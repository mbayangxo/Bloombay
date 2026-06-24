import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireVerified(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<{ ok: boolean; response?: NextResponse }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed, verification_status")
    .eq("id", userId)
    .single();
  if (!profile?.onboarding_completed) {
    return { ok: false, response: NextResponse.json({ error: "Complete onboarding first" }, { status: 403 }) };
  }
  if (profile.verification_status !== "verified") {
    return { ok: false, response: NextResponse.json({ error: "Verified members only" }, { status: 403 }) };
  }
  return { ok: true };
}

// GET /api/girlmate/my-listing — return the current user's GirlMate listing
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gate = await requireVerified(supabase, user.id);
  if (!gate.ok) return gate.response!;

  const { data, error } = await supabase
    .from("girlmate_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? null);
}

// DELETE /api/girlmate/my-listing — deactivate listing
export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gate = await requireVerified(supabase, user.id);
  if (!gate.ok) return gate.response!;

  const { error } = await supabase
    .from("girlmate_profiles")
    .update({ is_active: false })
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// PATCH /api/girlmate/my-listing — toggle active state
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gate = await requireVerified(supabase, user.id);
  if (!gate.ok) return gate.response!;

  const body = await req.json() as { is_active?: boolean };
  const { error } = await supabase
    .from("girlmate_profiles")
    .update({ is_active: body.is_active ?? true })
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
