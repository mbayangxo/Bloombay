import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cronGuard, isDryRun, logCronRun, cronMaxRecords } from "@/lib/cron-guard";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  const guard = cronGuard(req, "event-intelligence");
  if (guard) return guard;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ skipped: "no anthropic key" });
  }

  if (isDryRun()) {
    return NextResponse.json({ ok: true, dry_run: true, message: "Dry run — no data written" });
  }

  const supabase = admin();
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const in72h = new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString();

  try {
    const { data: gatherings, error } = await supabase
      .from("gatherings")
      .select("id, title, starts_at, capacity, spots_left, host_id, creator_user_id, area, event_type")
      .eq("publish_status", "live")
      .gte("starts_at", now.toISOString())
      .lte("starts_at", in7Days)
      .order("starts_at", { ascending: true })
      .limit(cronMaxRecords(50));

    if (error || !gatherings?.length) {
      await logCronRun("event-intelligence", "skipped", {
        reason: "no upcoming gatherings",
        error: error?.message,
      });
      return NextResponse.json({ skipped: "no upcoming gatherings", error: error?.message });
    }

    let nudged = 0;

    for (const gathering of gatherings) {
      const hostUserId = gathering.creator_user_id ?? gathering.host_id;
      if (!hostUserId) continue;

      const capacity = gathering.capacity ?? 0;
      const spotsLeft = gathering.spots_left ?? capacity;
      const attending = capacity > 0 ? capacity - spotsLeft : 0;
      const fillRate = capacity > 0 ? attending / capacity : 1;
      const isWithin72h = gathering.starts_at <= in72h;
      const hoursUntil = Math.round(
        (new Date(gathering.starts_at).getTime() - now.getTime()) / 3600000,
      );

      if (capacity === 0 || fillRate >= 0.4 || !isWithin72h) continue;

      const todayStart = new Date(now);
      todayStart.setUTCHours(0, 0, 0, 0);
      const { count: recentNudge } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", hostUserId)
        .eq("data->>gathering_id", gathering.id)
        .gte("created_at", todayStart.toISOString());

      if (recentNudge && recentNudge > 0) continue;

      const location = gathering.area ?? gathering.event_type ?? "NYC";
      const context = `
Event: ${gathering.title}
Category: ${gathering.event_type ?? "general"}
Location: ${location}
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

      const aiData = (await res.json()) as { content: { type: string; text: string }[] };
      const note = aiData.content[0]?.text?.trim();
      if (!note) continue;

      await supabase.from("notifications").insert({
        user_id: hostUserId,
        type: "seat",
        title: `${gathering.title} — ${spotsLeft} seats still open`,
        body: note,
        link: `/member/happenings`,
        data: {
          gathering_id: gathering.id,
          fill_rate: fillRate,
          hours_until: hoursUntil,
        },
      });

      nudged++;
      await new Promise((r) => setTimeout(r, 300));
    }

    await logCronRun("event-intelligence", "ok", {
      records_processed: nudged,
      gatherings_scanned: gatherings.length,
    });
    return NextResponse.json({ ok: true, gatherings: gatherings.length, nudged });
  } catch (err) {
    await logCronRun("event-intelligence", "error", { error: String(err) });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
