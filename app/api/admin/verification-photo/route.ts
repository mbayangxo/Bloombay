import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireModeratorStaff, requireAdmin } from "@/lib/admin/require-staff";
import { getVerificationSelfieUrl } from "@/lib/storage/signed-url";
import { writeAdminAuditLog } from "@/lib/admin/audit-log";

// GET /api/admin/verification-photo?userId=<uuid>
export async function GET(req: NextRequest) {
  const guard = await requireModeratorStaff(req);
  if (guard.error) return guard.error;

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();
  const { data: target } = await db
    .from("profiles")
    .select("verification_photo_url")
    .eq("id", userId)
    .single();

  if (!target?.verification_photo_url) {
    return NextResponse.json({ error: "No verification photo on file" }, { status: 404 });
  }

  try {
    const { url, expiresIn } = await getVerificationSelfieUrl(
      target.verification_photo_url,
      guard.user.id,
      { targetUserId: userId, req },
    );
    return NextResponse.json({ url, expiresIn });
  } catch {
    return NextResponse.json({ error: "Could not generate signed URL" }, { status: 403 });
  }
}

// PATCH /api/admin/verification-photo — approve or reject ID verification
export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

  const body = await req.json() as {
    userId?: string;
    action?: "approve" | "reject";
    note?: string;
  };

  if (!body.userId || !body.action || !["approve", "reject"].includes(body.action)) {
    return NextResponse.json({ error: "userId and action (approve|reject) required" }, { status: 400 });
  }

  const db = createAdminClient();
  const { data: before } = await db
    .from("profiles")
    .select("id, verification_status, gov_id_verification_status")
    .eq("id", body.userId)
    .maybeSingle();

  if (!before) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const nextStatus = body.action === "approve" ? "verified" : "rejected";
  const update = {
    verification_status: nextStatus,
    gov_id_verification_status: nextStatus,
    updated_at: new Date().toISOString(),
  };

  const { error } = await db.from("profiles").update(update).eq("id", body.userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAdminAuditLog({
    actorId: guard.user.id,
    actorRole: guard.role,
    action: `verification.${body.action}`,
    resourceType: "profile",
    resourceId: body.userId,
    before: before as Record<string, unknown>,
    after: update,
    req,
    metadata: body.note ? { note: body.note } : undefined,
  });

  return NextResponse.json({ ok: true, status: nextStatus });
}
