"use server";

import { createClient } from "@supabase/supabase-js";
import { logAction } from "./core";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function nudgeClubsWithNoUpcomingEvents(): Promise<{ nudged: number }> {
  const supabase = admin();
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: clubs } = await supabase
    .from("clubs")
    .select("id, name, owner_id, member_count, category")
    .eq("is_active", true)
    .not("owner_id", "is", null);

  if (!clubs?.length) return { nudged: 0 };

  let nudged = 0;

  for (const club of clubs) {
    // Check if they have any event in next 30 days
    const { count: upcomingCount } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("created_by", club.owner_id)
      .gte("date_time", now.toISOString())
      .lte("date_time", in30Days);

    if ((upcomingCount ?? 0) > 0) continue;

    // Don't double-nudge within 14 days
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { count: recentNudge } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", club.owner_id)
      .eq("type", "scheduling")
      .gte("created_at", twoWeeksAgo);

    if (recentNudge && recentNudge > 0) continue;

    let suggestion = `Your ${club.name} club has ${club.member_count ?? "some"} members waiting for your next gathering. What's next?`;

    if (process.env.ANTHROPIC_API_KEY) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 80,
          system: `You are Yande, suggesting a specific event idea to a BloomBay club host.
Be specific to the club category. 1-2 sentences. Sound like a friend, not a template.`,
          messages: [{ role: "user", content: `Club: ${club.name}\nCategory: ${club.category ?? "social"}\nMembers: ${club.member_count ?? 0}\n\nSuggest one concrete event idea.` }],
        }),
      });

      if (res.ok) {
        const d = await res.json() as { content: { text: string }[] };
        const text = d.content[0]?.text?.trim();
        if (text) suggestion = text;
      }
    }

    await supabase.from("notifications").insert({
      user_id: club.owner_id,
      type: "scheduling",
      title: `Time to gather, ${club.name}? ✦`,
      body: suggestion,
      link: "/member/happenings",
      data: { club_id: club.id },
    });

    await logAction({
      agent: "yande-scheduling",
      action_type: "nudge_club_host",
      risk_level: "low",
      target_user_id: club.owner_id as string,
      metadata: { club_id: club.id, club_name: club.name },
    }, "completed");

    nudged++;
    await new Promise(r => setTimeout(r, 300));
  }

  return { nudged };
}

export async function suggestRecurringEvents(): Promise<{ suggested: number }> {
  const supabase = admin();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Find events that ran successfully (90%+ full) in the last 30 days
  const { data: successfulEvents } = await supabase
    .from("events")
    .select("id, title, created_by, attending_count, capacity, category")
    .eq("is_published", true)
    .lte("date_time", now.toISOString())
    .gte("date_time", thirtyDaysAgo)
    .not("created_by", "is", null);

  if (!successfulEvents?.length) return { suggested: 0 };

  let suggested = 0;

  const hostsSeen = new Set<string>();

  for (const event of successfulEvents) {
    const cap = event.capacity ?? 0;
    const att = event.attending_count ?? 0;
    const fillRate = cap > 0 ? att / cap : 0;

    if (fillRate < 0.85 || hostsSeen.has(event.created_by as string)) continue;
    hostsSeen.add(event.created_by as string);

    await supabase.from("notifications").insert({
      user_id: event.created_by,
      type: "scheduling",
      title: `${event.title} was a hit — do it again? ✦`,
      body: `${att} women showed up. Your community loved this. Consider making it a regular thing — we can help you set it up.`,
      link: "/member/happenings",
      data: { event_id: event.id, fill_rate: fillRate },
    });

    await logAction({
      agent: "yande-scheduling",
      action_type: "suggest_recurring_event",
      risk_level: "low",
      target_user_id: event.created_by as string,
      metadata: { event_id: event.id, fill_rate: fillRate },
    }, "completed");

    suggested++;
    await new Promise(r => setTimeout(r, 200));
  }

  return { suggested };
}
