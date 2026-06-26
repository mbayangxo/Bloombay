/**
 * GET  /api/admin/moderation/cases — list moderation queue
 * PATCH /api/admin/moderation/cases — assign, resolve, dismiss, or ban
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireModeratorStaff, requireFounder } from "@/lib/admin/require-staff";
import { writeAdminAuditLog } from "@/lib/admin/audit-log";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

export async function GET(req: NextRequest) {
  const guard = await requireModeratorStaff(req);
  if (guard.error) return guard.error;

  const status = req.nextUrl.searchParams.get("status");
  const db = admin();

  let query = db
    .from("moderation_cases")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) {
    query = query.eq("status", status);
  } else {
    query = query.in("status", ["pending", "human_review_required", "in_review"]);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ cases: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const guard = await requireModeratorStaff(req);
  if (guard.error) return guard.error;

  const body = await req.json() as {
    id?: string;
    action?: "assign" | "resolve" | "dismiss" | "ban";
    assigned_to?: string;
    note?: string;
  };

  if (!body.id || !body.action) {
    return NextResponse.json({ error: "id and action required" }, { status: 400 });
  }

  if (body.action === "ban") {
    const founderGuard = await requireFounder(req);
    if (founderGuard.error) return founderGuard.error;
  }

  const db = admin();
  const { data: existing, error: fetchErr } = await db
    .from("moderation_cases")
    .select("*")
    .eq("id", body.id)
    .single();

  if (fetchErr || !existing) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  let update: Record<string, unknown> = { updated_at: now };
  let auditAction = `moderation.${body.action}`;

  switch (body.action) {
    case "assign":
      update = { ...update, status: "in_review", assigned_to: body.assigned_to ?? guard.user.id };
      break;
    case "resolve":
      update = { ...update, status: "resolved", resolved_by: guard.user.id, resolved_at: now };
      break;
    case "dismiss":
      update = { ...update, status: "dismissed", resolved_by: guard.user.id, resolved_at: now };
      break;
    case "ban":
      update = { ...update, status: "resolved", resolved_by: guard.user.id, resolved_at: now };
      if (existing.reported_user_id) {
        await db.from("profiles").update({ is_member: false }).eq("id", existing.reported_user_id);
      }
      auditAction = "moderation.ban";
      break;
  }

  const { data: updated, error } = await db
    .from("moderation_cases")
    .update(update)
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (
    existing.source_type === "member_report" &&
    existing.source_id &&
    (body.action === "resolve" || body.action === "dismiss" || body.action === "ban")
  ) {
    const reportStatus = body.action === "dismiss" ? "dismissed" : "resolved";
    const reportUpdate: Record<string, unknown> = {
      status: reportStatus,
      resolved_by: guard.user.id,
      resolved_at: now,
    };
    if (body.note) reportUpdate.admin_notes = body.note;

    const { error: reportErr } = await db
      .from("member_reports")
      .update(reportUpdate)
      .eq("id", existing.source_id);

    if (reportErr) {
      console.error("[moderation] member_reports sync failed:", reportErr.message);
    }
  }

  await writeAdminAuditLog({
    actorId: guard.user.id,
    actorRole: guard.role,
    action: auditAction,
    resourceType: "moderation_case",
    resourceId: body.id,
    before: existing as Record<string, unknown>,
    after: updated as Record<string, unknown>,
    req,
    metadata: body.note ? { note: body.note } : undefined,
  });

  return NextResponse.json({ ok: true, case: updated });
}
