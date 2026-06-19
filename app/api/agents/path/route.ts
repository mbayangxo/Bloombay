import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { pathBuilderAgent } from "@/lib/agents";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goal } = body;

    if (!goal || typeof goal !== "string" || goal.trim().length < 3) {
      return NextResponse.json({ error: "Goal is required (min 3 characters)" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current user (optional — path works for unauthenticated too)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let userProfile = {};
    if (user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (profile) userProfile = profile;
    }

    // Get recent opportunities to match against path steps
    const { data: opportunities } = await supabase
      .from("opportunities")
      .select("id, title, country, type, source_url")
      .eq("archived", false)
      .order("created_at", { ascending: false })
      .limit(100);

    const result = await pathBuilderAgent.buildPath({
      goal: goal.trim(),
      user: userProfile,
      availableOpportunities: opportunities || [],
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // If user is logged in, save the path to DB
    if (user) {
      await supabase
        .from("opportunity_paths")
        .insert({
          user_id: user.id,
          goal: goal.trim(),
          steps: result.data?.phases.flatMap((p) => p.steps) || [],
          status: "active",
        })
        .throwOnError();
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("[path route error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
