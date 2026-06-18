// Yande Host Coach — runs daily at 7am EST
// Analyzes event host performance and sends coaching insights.
// Helps hosts understand what's working and what to improve.

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
      max_tokens:  220,
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

  const supabase  = admin();
  const weekAgo   = new Date(Date.now() - 7 * 86400000).toISOString();
  const monthAgo  = new Date(Date.now() - 30 * 86400000).toISOString();

  // Find hosts who ran events in the past month
  const { data: hostedEvents } = await supabase
    .from("gatherings")
    .select("id, host_id, title, date, capacity, status")
    .gte("date", monthAgo)
    .not("host_id", "is", null)
    .order("date", { ascending: false })
    .limit(50);

  if (!hostedEvents?.length) {
    return NextResponse.json({ ok: true, skipped: "no recent hosted events" });
  }

  // Group by host
  const byHost = new Map<string, typeof hostedEvents>();
  for (const event of hostedEvents) {
    if (!event.host_id) continue;
    const list = byHost.get(event.host_id) ?? [];
    list.push(event);
    byHost.set(event.host_id, list);
  }

  let coached = 0;
  let errors  = 0;

  for (const [hostId, events] of byHost) {
    // Don't send if already got coaching this week
    const { data: recentCoach } = await supabase
      .from("yande_messages")
      .select("id")
      .eq("user_id", hostId)
      .eq("message_type", "community_insight")
      .gte("created_at", weekAgo)
      .maybeSingle();

    if (recentCoach) continue;

    try {
      const { data: hostProfile } = await supabase
        .from("profiles")
        .select("first_name, full_name")
        .eq("id", hostId)
        .maybeSingle();

      const hostName = ((hostProfile?.full_name ?? hostProfile?.first_name ?? "").split(" ")[0]) || "Host";

      // Fetch RSVPs for host's events
      const eventIds = events.map(e => e.id);
      const { count: rsvpCount } = await supabase
        .from("event_rsvps")
        .select("id", { count: "exact", head: true })
        .in("event_id", eventIds);

      const totalCapacity = events.reduce((sum, e) => sum + (e.capacity ?? 20), 0);
      const fillRate      = totalCapacity > 0 ? Math.round(((rsvpCount ?? 0) / totalCapacity) * 100) : 0;

      const context = `
Host: ${hostName}
Events this month: ${events.length}
Total RSVPs: ${rsvpCount ?? 0}
Average fill rate: ${fillRate}%
Recent events: ${events.slice(0, 3).map(e => e.title).join(", ")}
      `.trim();

      const coaching = await callClaude(
        `You are Yande, BloomBay's AI host coach. Write a short, specific, honest coaching note to a host.
Not cheerleader energy. More like a smart friend who helps you run better events.
2-3 sentences. No greeting or sign-off. Focus on what the data says.`,
        context,
      );

      if (!coaching) continue;

      await supabase.from("yande_messages").insert({
        user_id:      hostId,
        message_type: "community_insight",
        subject:      "Your hosting this month — a note from Yande.",
        body:         coaching,
        action_url:   "/member/plans",
        metadata:     { events_hosted: events.length, fill_rate: fillRate, rsvps: rsvpCount },
      });

      await supabase.from("notifications").insert({
        user_id:    hostId,
        type:       "intro",
        title:      "A note on your hosting. ✦",
        body:       coaching.slice(0, 140),
        action_url: "/member/messages",
      });

      coached++;
      await new Promise(r => setTimeout(r, 400));
    } catch (err) {
      console.error("[HostCoach] error for host", hostId, err);
      errors++;
    }
  }

  await supabase.from("yande_actions").insert({
    agent:        "yande_host",
    action_type:  "host_coach_batch",
    risk_level:   "low",
    status:       "completed",
    triggered_by: "scheduled",
    metadata:     { coached, errors, hosts_checked: byHost.size },
  });

  return NextResponse.json({ ok: true, coached, errors });
}
