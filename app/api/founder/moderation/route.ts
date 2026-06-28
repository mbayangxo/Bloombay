import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireRole } from "@/lib/admin/require-staff";
import { writeAdminAuditLog } from "@/lib/admin/audit-log";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const STAFF_READ = ["admin", "founder", "moderator", "curator"] as const;
const STAFF_REVIEW = ["admin", "founder", "moderator"] as const;

// GET /api/founder/moderation?verdict=needs_review&limit=50
export async function GET(req: NextRequest) {
  const guard = await requireRole(req, [...STAFF_READ]);
  if (guard.error) return guard.error;

  const verdict = req.nextUrl.searchParams.get("verdict") ?? "needs_review";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? "50"), 100);

  const supabase = admin();
  let query = supabase
    .from("content_moderation")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (verdict !== "all") query = query.eq("verdict", verdict);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

// PATCH /api/founder/moderation — update a verdict
export async function PATCH(req: NextRequest) {
  const guard = await requireRole(req, [...STAFF_REVIEW]);
  if (guard.error) return guard.error;

  const body = await req.json() as { id: string; verdict: "approved" | "rejected" };
  if (!body.id || !["approved", "rejected"].includes(body.verdict)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = admin();
  const { data: before } = await supabase
    .from("content_moderation")
    .select("id, verdict")
    .eq("id", body.id)
    .maybeSingle();

  const reviewedAt = new Date().toISOString();
  const { error } = await supabase
    .from("content_moderation")
    .update({
      verdict: body.verdict,
      reviewed_by: guard.user.id,
      reviewed_at: reviewedAt,
    })
    .eq("id", body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAdminAuditLog({
    actorId: guard.user.id,
    actorRole: guard.role,
    action: `content_moderation.${body.verdict}`,
    resourceType: "content_moderation",
    resourceId: body.id,
    before: before as Record<string, unknown> | null,
    after: { verdict: body.verdict, reviewed_at: reviewedAt },
    req,
  });

  return NextResponse.json({ ok: true });
}
