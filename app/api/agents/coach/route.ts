import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { applicationCoachAgent } from "@/lib/agents";
import type { Opportunity, UserProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { opportunity_id, action, question, context } = await req.json();

  const [{ data: opportunity }, { data: profile }] = await Promise.all([
    supabase.from("opportunities").select("*").eq("id", opportunity_id).single(),
    supabase.from("user_profiles").select("*").eq("id", user.id).single(),
  ]);

  if (!opportunity || !profile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (action === "checklist") {
    const result = await applicationCoachAgent.generateChecklist({
      opportunity: opportunity as Opportunity,
      user: profile as UserProfile,
    });
    return NextResponse.json(result);
  }

  if (action === "draft" && question) {
    const result = await applicationCoachAgent.draftResponse({
      opportunity: opportunity as Opportunity,
      question,
      userContext: context ?? "",
    });
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
