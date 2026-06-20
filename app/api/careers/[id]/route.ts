import { NextResponse } from "next/server";
import { getMissionControlRole } from "@/lib/auth/get-mc-role";
import {
  CAREER_STATUSES,
  type CareerApplicationStatus,
} from "@/lib/careers-admin";
import { updateCareerApplicationStatus } from "@/lib/supabase-admin";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const role = await getMissionControlRole();
  if (role !== "founder") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { status?: string };
  const status = body.status as CareerApplicationStatus;

  if (!CAREER_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (id.startsWith("seed-")) {
    return NextResponse.json(
      { error: "Demo applications cannot be updated. Run migration 005 in Supabase." },
      { status: 400 }
    );
  }

  try {
    const row = await updateCareerApplicationStatus(id, status);
    return NextResponse.json({ row });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
