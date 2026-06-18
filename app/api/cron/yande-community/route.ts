// Yande Community Intelligence — runs daily at 8am EST
// Reads memory graphs to surface personalized event/club/connection suggestions.
// Writes suggestions as yande_messages so members find them in their inbox.

import { NextRequest, NextResponse } from "next/server";
import { sendYandeMessage } from "@/lib/yande/messages";
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

  // ── 1. Potential introductions ────────────────────────────────────────────
  // Find members who are active but have few blooms — they need introductions.
  const { data: members } = await supabase
    .from("member_memory_graph")
    .select("user_id, clubs_joined, attendance_count, bloom_received, friendship_score, last_active_at")
    .gte("last_active_at", weekAgo)   // active this week
    .lt("bloom_received", 3)           // haven't been bloomed much
    .gt("clubs_joined", 0)             // joined at least one club (not brand new)
    .order("friendship_score", { ascending: true })
    .limit(30);

  // ── 2. For each lonely-ish member, find a compatible peer ─────────────────
  let introductions = 0;
  for (const member of (members ?? [])) {
    // Don't spam — max one intro per member per 7 days
    const { data: recent } = await supabase
      .from("yande_messages")
      .select("id")
      .eq("user_id", member.user_id)
      .eq("message_type", "introduction")
      .gte("created_at", weekAgo)
      .maybeSingle();

    if (recent) continue;

    // Find a compatible peer (shared clubs, similar activity level)
    const { data: peers } = await supabase
      .from("member_memory_graph")
      .select("user_id")
      .gte("clubs_joined", 1)
      .gte("attendance_count", 1)
      .neq("user_id", member.user_id)
      .limit(5);

    if (!peers?.length) continue;

    const peer = peers[Math.floor(Math.random() * peers.length)];

    // Fetch peer name
    const { data: peerProfile } = await supabase
      .from("profiles")
      .select("first_name, full_name")
      .eq("id", peer.user_id)
      .maybeSingle();

    if (!peerProfile) continue;
    const peerName = (peerProfile.full_name ?? peerProfile.first_name ?? "").split(" ")[0] || "someone";

    try {
      await sendYandeMessage(member.user_id, "introduction", {
        other_name:        peerName,
        shared_interests:  "similar clubs and activity on BloomBay",
        action_url:        "/member/introductions",
      });
      introductions++;
      await new Promise(r => setTimeout(r, 400));
    } catch {
      // continue
    }
  }

  // ── 3. Event suggestions for highly active members ────────────────────────
  // Members with high friendship scores get tailored event suggestions.
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
        suggestion:   "check out a new gathering this week",
        action_url:   "/member/happenings",
      });
      suggestions++;
      await new Promise(r => setTimeout(r, 400));
    } catch {
      // continue
    }
  }

  await supabase.from("yande_actions").insert({
    agent: "yande_community",
    action_type: "community_intelligence_batch",
    risk_level: "low",
    status: "completed",
    triggered_by: "scheduled",
    metadata: { introductions, suggestions, members_checked: members?.length ?? 0 },
  });

  return NextResponse.json({ ok: true, introductions, suggestions });
}
