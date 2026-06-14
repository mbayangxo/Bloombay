// Club Success Manager — runs every Wednesday at 10am UTC
// Checks each active club for health signals and notifies the owner via Yande.
// Signals: recent join count, members inactive 45+ days, attendance trend.

import { NextRequest, NextResponse } from "next/server";
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

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ skipped: "no anthropic key" });
  }

  const supabase = admin();
  const now         = new Date();
  const daysAgo45   = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString();
  const daysAgo30   = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const daysAgo7    = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Get all active clubs with their owner
  const { data: clubs, error: clubErr } = await supabase
    .from("clubs")
    .select("id, name, owner_id, member_count")
    .eq("is_active", true)
    .not("owner_id", "is", null);

  if (clubErr || !clubs?.length) {
    return NextResponse.json({ skipped: "no clubs", error: clubErr?.message });
  }

  let notified = 0;

  for (const club of clubs) {
    try {
      // New members in last 7 days
      const { count: newMembers } = await supabase
        .from("user_clubs")
        .select("user_id", { count: "exact", head: true })
        .eq("club_id", club.id)
        .gte("joined_at", daysAgo7);

      // Members who joined 45+ days ago but have no recent check-ins
      const { data: allMembers } = await supabase
        .from("user_clubs")
        .select("user_id")
        .eq("club_id", club.id)
        .lt("joined_at", daysAgo45);

      let inactiveCount = 0;
      if (allMembers?.length) {
        // Check which of these members have no check-ins in last 45 days
        const memberIds = allMembers.map(m => m.user_id);
        const { data: activeCheckins } = await supabase
          .from("event_checkins")
          .select("user_id")
          .in("user_id", memberIds)
          .gte("checked_in_at", daysAgo45);

        const activeSet = new Set((activeCheckins ?? []).map(c => c.user_id));
        inactiveCount = memberIds.filter(id => !activeSet.has(id)).length;
      }

      // Events hosted by this club owner in last 30 days
      const { count: recentEvents } = await supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("created_by", club.owner_id)
        .gte("date_time", daysAgo30);

      // Only send a nudge if there's something actionable
      const hasNewMembers   = (newMembers ?? 0) > 0;
      const hasInactive     = inactiveCount > 2;
      const noRecentEvents  = (recentEvents ?? 0) === 0;

      if (!hasNewMembers && !hasInactive && !noRecentEvents) continue;

      const context = `
Club: ${club.name}
Total members: ${club.member_count}
New members this week: ${newMembers ?? 0}
Members inactive 45+ days: ${inactiveCount}
Events hosted last 30 days: ${recentEvents ?? 0}
`.trim();

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 100,
          system: `You are Yande, writing a short nudge to a club host on BloomBay.
Be warm, specific, and helpful. 1-2 sentences max. No generic advice.
Focus on the most important signal only. Sound like a smart friend, not a dashboard.`,
          messages: [{ role: "user", content: `Club health data:\n${context}\n\nWrite the nudge.` }],
        }),
      });

      if (!res.ok) continue;

      const aiData = await res.json() as { content: { type: string; text: string }[] };
      const note = aiData.content[0]?.text?.trim();
      if (!note) continue;

      await supabase.from("notifications").insert({
        user_id: club.owner_id,
        type:    "club",
        title:   `${club.name} — Yande check-in ✦`,
        body:    note,
        link:    `/club-owner/dashboard`,
        data:    { club_id: club.id, inactive: inactiveCount, new_members: newMembers },
      });

      notified++;

      await new Promise(r => setTimeout(r, 400));

    } catch {
      // skip individual club failures silently
    }
  }

  return NextResponse.json({ ok: true, clubs: clubs.length, notified });
}
