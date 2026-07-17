import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth/require-role";
import {
  CAREER_STATUSES,
  type CareerApplicationStatus,
} from "@/lib/careers-admin";
import { updateCareerApplicationStatus } from "@/lib/supabase-admin";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const guard = await requireRole(request, ["founder"]);
  if (guard.error) return guard.error;

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
