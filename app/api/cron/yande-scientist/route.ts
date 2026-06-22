// Yande Social Scientist — runs every Sunday at 5am EST
// Detects platform-wide patterns: which clubs drive the most friendships,
// what neighborhoods are growing, what content generates the most blooms.
// Writes a weekly insight report and stores it for the founder dashboard.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function callClaude(system: string, user: string): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key":          process.env.ANTHROPIC_API_KEY,
      "anthropic-version":  "2023-06-01",
      "content-type":       "application/json",
    },
    body: JSON.stringify({
      model:       "claude-haiku-4-5-20251001",
      max_tokens:  350,
      system,
      messages:    [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json() as { content: { type: string; text: string }[] };
  return data.content[0]?.text?.trim() ?? null;
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ skipped: "no anthropic key" });
  }

  const supabase = admin();
  const weekAgo  = new Date(Date.now() - 7 * 86400000).toISOString();
  const weekOf   = new Date().toISOString().split("T")[0];

  // ── Platform signals ───────────────────────────────────────────────────────
  const [
    { count: newMembers },
    { count: wallPosts },
    { count: wallBlooms },
    { count: newPlans },
    { data: memoryStats },
    { data: neighborhoodBreakdown },
  ] = await Promise.all([
    supabase.from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_member", true)
      .gte("created_at", weekAgo),

    supabase.from("wall_posts")
      .select("id", { count: "exact", head: true })
      .eq("is_seed", false)
      .gte("created_at", weekAgo),

    supabase.from("wall_post_blooms")
      .select("post_id", { count: "exact", head: true })
      .gte("created_at", weekAgo),

    supabase.from("plans")
      .select("id", { count: "exact", head: true })
      .gte("created_at", weekAgo),

    // Average friendship score and churn risk across all members
    supabase.from("member_memory_graph")
      .select("friendship_score, churn_risk, clubs_joined")
      .limit(500),

    // Neighborhood breakdown
    supabase.from("profiles")
      .select("neighborhood")
      .eq("is_member", true)
      .not("neighborhood", "is", null)
      .limit(500),
  ]);

  // Compute averages from memory graph
  const graphs = (memoryStats ?? []) as { friendship_score: number; churn_risk: number; clubs_joined: number }[];
  const avgFriendshipScore = graphs.length
    ? Math.round(graphs.reduce((s, g) => s + g.friendship_score, 0) / graphs.length)
    : 0;
  const avgChurnRisk = graphs.length
    ? (graphs.reduce((s, g) => s + g.churn_risk, 0) / graphs.length).toFixed(2)
    : "0";
  const highChurnCount = graphs.filter(g => g.churn_risk > 0.6).length;

  // Neighborhood distribution
  const neighborhoodMap: Record<string, number> = {};
  for (const row of (neighborhoodBreakdown ?? [])) {
    const n = row.neighborhood as string;
    neighborhoodMap[n] = (neighborhoodMap[n] ?? 0) + 1;
  }
  const topNeighborhoods = Object.entries(neighborhoodMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([n, c]) => `${n} (${c})`);

  const dataContext = `
WEEK OF: ${weekOf}

GROWTH:
- New members this week: ${newMembers ?? 0}
- Total members with memory graphs: ${graphs.length}

ENGAGEMENT:
- Wall posts (real): ${wallPosts ?? 0}
- Bloom reactions: ${wallBlooms ?? 0}
- New plans created: ${newPlans ?? 0}

SOCIAL HEALTH:
- Average friendship score: ${avgFriendshipScore}/100
- Average churn risk: ${avgChurnRisk}
- Members at high churn risk (>60%): ${highChurnCount}

GEOGRAPHY:
- Top neighborhoods: ${topNeighborhoods.join(", ") || "data pending"}
  `.trim();

  const analysis = await callClaude(
    `You are Yande's Social Scientist — the analytical mind behind BloomBay's community intelligence.
Write a weekly platform health analysis. Be specific, honest, and actionable.
Format: 3 sections — "What grew", "What needs attention", "One thing to try".
Plain text, no markdown, under 250 words. Write for a founder who has no time for fluff.`,
    `Here's this week's data:\n\n${dataContext}\n\nWrite the analysis.`,
  );

  if (!analysis) return NextResponse.json({ skipped: "claude api error" });

  // Store the report
  await supabase.from("yande_scientist_reports").upsert(
    {
      week_of:      weekOf,
      report_text:  analysis,
      raw_data:     {
        new_members:        newMembers,
        wall_posts:         wallPosts,
        wall_blooms:        wallBlooms,
        new_plans:          newPlans,
        avg_friendship:     avgFriendshipScore,
        avg_churn_risk:     avgChurnRisk,
        high_churn_count:   highChurnCount,
        neighborhoods:      neighborhoodMap,
      },
    },
    { onConflict: "week_of" },
  );

  // Notify founder
  if (process.env.FOUNDER_USER_ID) {
    await supabase.from("notifications").insert({
      user_id:    process.env.FOUNDER_USER_ID,
      type:       "celebrate",
      title:      "Social Scientist weekly report ✦",
      body:       analysis.slice(0, 140),
      action_url: "/admin/dashboard",
    });
  }

  await supabase.from("yande_actions").insert({
    agent:        "yande_scientist",
    action_type:  "weekly_platform_analysis",
    risk_level:   "low",
    status:       "completed",
    triggered_by: "scheduled",
    metadata:     { week_of: weekOf, members_analyzed: graphs.length },
  });

  return NextResponse.json({ ok: true, week_of: weekOf, preview: analysis.slice(0, 120) });
}
