import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require-staff";
import { writeAdminAuditLog } from "@/lib/admin/audit-log";
import { updateWaitlistStatus, getAdminClient } from "@/lib/supabase-admin";
import {
  WAITLIST_STATUSES,
  type WaitlistStatus,
} from "@/lib/waitlist-admin";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request);
  if (guard.error) return guard.error;

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { status?: string };
  const status = body.status as WaitlistStatus;

  if (!WAITLIST_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const admin = getAdminClient();
  const { data: before } = await admin
    .from("waitlist")
    .select("id, status, email")
    .eq("id", id)
    .maybeSingle();

  try {
    const row = await updateWaitlistStatus(id, status);
    await writeAdminAuditLog({
      actorId: guard.user.id,
      actorRole: guard.role,
      action: "waitlist.status_change",
      resourceType: "waitlist",
      resourceId: id,
      before: before as Record<string, unknown> | null,
      after: { status },
      req: request,
    });
    return NextResponse.json({ row });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
