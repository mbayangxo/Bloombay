// Yande Community Intelligence — runs daily at 8am EST
// Reads memory graphs to surface personalized event/club/connection suggestions.
// Writes suggestions as yande_messages so members find them in their inbox.
// Uses the compatibility matching engine for real introductions.

import { NextRequest, NextResponse } from "next/server";
import { sendYandeMessage } from "@/lib/yande/messages";
import { findTopMatches } from "@/lib/yande/matching";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = admin();
  const weekAgo  = new Date(Date.now() - 7 * 86400000).toISOString();

  // ── 1. Find members who need introductions ─────────────────────────────────
  // Active members with low bloom-received count — they're engaged but under-connected.
  const { data: candidates } = await supabase
    .from("member_memory_graph")
    .select("user_id, clubs_joined, attendance_count, bloom_received, friendship_score")
    .gte("last_active_at", weekAgo)
    .lt("bloom_received", 3)
    .gt("clubs_joined", 0)
    .order("friendship_score", { ascending: true })
    .limit(20);

  let introductions = 0;
  for (const member of (candidates ?? [])) {
    // Max one introduction per member per 7 days
    const { data: recent } = await supabase
      .from("yande_messages")
      .select("id")
      .eq("user_id", member.user_id)
      .eq("message_type", "introduction")
      .gte("created_at", weekAgo)
      .maybeSingle();

    if (recent) continue;

    try {
      // Use the real matching engine
      const matches = await findTopMatches(member.user_id, { limit: 1, minScore: 35 });
      if (!matches.length) continue;

      const best = matches[0];
      const reasonText = best.reasons.length > 0
        ? best.reasons.join(", ")
        : "similar energy and interests on BloomBay";

      await sendYandeMessage(member.user_id, "introduction", {
        other_name:       best.name,
        shared_interests: reasonText,
        compatibility:    best.score,
        action_url:       "/member/introductions",
      });
      introductions++;
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error("[Community] intro error for", member.user_id, err);
    }
  }

  // ── 2. Event suggestions for highly engaged members ────────────────────────
  const { data: actives } = await supabase
    .from("member_memory_graph")
    .select("user_id, attendance_count, friendship_score")
    .gte("friendship_score", 40)
    .gte("last_active_at", weekAgo)
    .limit(20);

  let suggestions = 0;
  for (const active of (actives ?? [])) {
    const { data: recentSugg } = await supabase
      .from("yande_messages")
      .select("id")
      .eq("user_id", active.user_id)
      .eq("message_type", "suggestion")
      .gte("created_at", weekAgo)
      .maybeSingle();

    if (recentSugg) continue;

    try {
      await sendYandeMessage(active.user_id, "suggestion", {
        suggestion: "check out a new gathering this week",
        action_url: "/member/happenings",
      });
      suggestions++;
      await new Promise(r => setTimeout(r, 400));
    } catch {
      // continue
    }
  }

  // ── 3. Community insight — let members know they're not alone ─────────────
  // Find clusters of members with high shared-club overlap and surface the insight.
  const { data: clubCounts } = await supabase
    .from("club_memberships")
    .select("club_id")
    .limit(500);

  // Count members per club
  const clubPopularity: Record<string, number> = {};
  for (const row of (clubCounts ?? [])) {
    clubPopularity[row.club_id] = (clubPopularity[row.club_id] ?? 0) + 1;
  }
  const topClubId = Object.entries(clubPopularity).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topClubSize = topClubId ? clubPopularity[topClubId] : 0;

  let insights = 0;
  if (topClubId && topClubSize > 5) {
    // Tell members of the top club something about their community
    const { data: topMembers } = await supabase
      .from("club_memberships")
      .select("user_id")
      .eq("club_id", topClubId)
      .limit(10);

    const { data: clubInfo } = await supabase
      .from("clubs")
      .select("name")
      .eq("id", topClubId)
      .maybeSingle();

    for (const m of (topMembers ?? [])) {
      const { data: recentInsight } = await supabase
        .from("yande_messages")
        .select("id")
        .eq("user_id", m.user_id)
        .eq("message_type", "community_insight")
        .gte("created_at", weekAgo)
        .maybeSingle();

      if (recentInsight) continue;

      try {
        await sendYandeMessage(m.user_id, "community_insight", {
          insight:          `are in the ${clubInfo?.name ?? "same"} club`,
          community_count:  topClubSize,
          action_url:       `/member/clubs`,
        });
        insights++;
        await new Promise(r => setTimeout(r, 300));
      } catch {
        // continue
      }
    }
  }

  await supabase.from("yande_actions").insert({
    agent:        "yande_community",
    action_type:  "community_intelligence_batch",
    risk_level:   "low",
    status:       "completed",
    triggered_by: "scheduled",
    metadata:     { introductions, suggestions, insights, candidates_checked: candidates?.length ?? 0 },
  });

  return NextResponse.json({ ok: true, introductions, suggestions, insights });
}
