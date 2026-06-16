// Event Intelligence — runs Tuesday + Friday mornings at 9am UTC
// Scans upcoming events (next 7 days), flags at-risk ones, nudges hosts.
// At-risk = event within 72h and RSVPs < 40% of capacity.

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
  const now     = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const in72h   = new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString();

  // Upcoming published events in the next 7 days
  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, date_time, capacity, attending_count, created_by, neighborhood, category")
    .eq("is_published", true)
    .gte("date_time", now.toISOString())
    .lte("date_time", in7Days)
    .not("created_by", "is", null)
    .order("date_time", { ascending: true });

  if (error || !events?.length) {
    return NextResponse.json({ skipped: "no upcoming events", error: error?.message });
  }

  let nudged = 0;

  for (const event of events) {
    const capacity       = event.capacity ?? 0;
    const attending      = event.attending_count ?? 0;
    const fillRate       = capacity > 0 ? attending / capacity : 1;
    const isWithin72h    = event.date_time <= in72h;
    const hoursUntil     = Math.round((new Date(event.date_time).getTime() - now.getTime()) / 3600000);

    // Only nudge if: has capacity, under 40% filled, within 72h
    if (capacity === 0 || fillRate >= 0.4 || !isWithin72h) continue;

    // Don't double-nudge: check if we already sent one today
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);
    const { count: recentNudge } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", event.created_by)
      .eq("data->>event_id", event.id)
      .gte("created_at", todayStart.toISOString());

    if (recentNudge && recentNudge > 0) continue;

    const context = `
Event: ${event.title}
Category: ${event.category ?? "general"}
Location: ${event.neighborhood ?? "NYC"}
Hours until event: ${hoursUntil}
RSVPs: ${attending} of ${capacity} spots filled (${Math.round(fillRate * 100)}%)
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
        max_tokens: 90,
        system: `You are Yande, writing a short nudge to a BloomBay event host.
Their event isn't filling up. Give one specific, actionable suggestion.
Warm but direct. 1-2 sentences. No filler. Sound like someone who actually cares.`,
        messages: [{ role: "user", content: context }],
      }),
    });

    if (!res.ok) continue;

    const aiData = await res.json() as { content: { type: string; text: string }[] };
    const note = aiData.content[0]?.text?.trim();
    if (!note) continue;

    await supabase.from("notifications").insert({
      user_id: event.created_by,
      type:    "seat",
      title:   `${event.title} — ${capacity - attending} seats still open`,
      body:    note,
      link:    `/member/happenings`,
      data:    { event_id: event.id, fill_rate: fillRate, hours_until: hoursUntil },
    });

    nudged++;
    await new Promise(r => setTimeout(r, 300));
  }

  return NextResponse.json({ ok: true, events: events.length, nudged });
}
