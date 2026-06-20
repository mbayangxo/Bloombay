import { NextResponse } from "next/server";
import { getMissionControlRole } from "@/lib/auth/get-mc-role";
import { canMissionControl } from "@/lib/auth/mission-control";
import { updateWaitlistStatus } from "@/lib/supabase-admin";
import {
  WAITLIST_STATUSES,
  type WaitlistStatus,
} from "@/lib/waitlist-admin";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const role = await getMissionControlRole();
  if (!role || !canMissionControl(role, "submissions")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
