import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth/require-role";
import { updateWaitlistStatus } from "@/lib/supabase-admin";
import {
  WAITLIST_STATUSES,
  type WaitlistStatus,
} from "@/lib/waitlist-admin";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const guard = await requireRole(request, ["founder", "admin"]);
  if (guard.error) return guard.error;

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { status?: string };
  const status = body.status as WaitlistStatus;

  if (!WAITLIST_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const row = await updateWaitlistStatus(id, status);
    return NextResponse.json({ row });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
