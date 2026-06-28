import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPlansData } from "@/lib/plans/get-plans-data";

export async function GET() {
  const data = await getPlansData();
  if (!data.ok) {
    const status = data.error === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: data.error }, { status });
  }
  return NextResponse.json({ plans: data.plans, memories: data.memories });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    title?: string; plan_type?: string; description?: string;
    date_time?: string; venue?: string; emoji?: string; invitee_ids?: string[];
  };

  if (!body.title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const { data: plan, error } = await supabase
    .from("bloomies_plans")
    .insert({
      creator_id: user.id,
      title: body.title.trim(),
      plan_type: body.plan_type ?? "hangout",
      description: body.description ?? null,
      date_time: body.date_time ?? null,
      venue: body.venue ?? null,
      emoji: body.emoji ?? null,
    })
    .select("id, title, plan_type, created_at")
    .single();

  if (error || !plan) return NextResponse.json({ error: error?.message ?? "Failed to create plan" }, { status: 500 });

  if (body.invitee_ids?.length) {
    await supabase.from("bloomies_plan_invites").insert(
      body.invitee_ids.map(id => ({ plan_id: plan.id, invitee_id: id }))
    );
  }

  return NextResponse.json({ plan }, { status: 201 });
}
