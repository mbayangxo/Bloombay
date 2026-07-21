import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: planId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { invitee_ids?: string[] };
  const inviteeIds = [...new Set((body.invitee_ids ?? []).filter(Boolean))];
  if (inviteeIds.length === 0) {
    return NextResponse.json({ error: "Select at least one Bloomie" }, { status: 400 });
  }

  const { data: plan, error: planError } = await supabase
    .from("bloomies_plans")
    .select("id, creator_id")
    .eq("id", planId)
    .single();

  if (planError || !plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }
  if (plan.creator_id !== user.id) {
    return NextResponse.json({ error: "Only the plan creator can invite" }, { status: 403 });
  }

  const { error } = await supabase.from("bloomies_plan_invites").upsert(
    inviteeIds.map((invitee_id) => ({
      plan_id: planId,
      invitee_id,
      rsvp_status: "pending",
    })),
    { onConflict: "plan_id,invitee_id", ignoreDuplicates: true },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, invited: inviteeIds.length });
}
