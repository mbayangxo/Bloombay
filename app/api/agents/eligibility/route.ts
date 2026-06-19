import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { eligibilityAgent } from "@/lib/agents";
import type { Opportunity, UserProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { opportunity_id } = await req.json();
  if (!opportunity_id) {
    return NextResponse.json({ error: "opportunity_id required" }, { status: 400 });
  }

  const [{ data: opportunity }, { data: profile }] = await Promise.all([
    supabase.from("opportunities").select("*").eq("id", opportunity_id).single(),
    supabase.from("user_profiles").select("*").eq("id", user.id).single(),
  ]);

  if (!opportunity || !profile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await eligibilityAgent.assess({
    opportunity: opportunity as Opportunity,
    user: profile as UserProfile,
  });

  return NextResponse.json(result);
}
