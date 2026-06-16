"use server";

import { createClient } from "@supabase/supabase-js";
import { logAction } from "./core";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function processEventWaitlists(): Promise<{ processed: number; promoted: number }> {
  const supabase = admin();
  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();

  // Events within 48h that have open capacity
  const { data: events } = await supabase
    .from("events")
    .select("id, title, capacity, attending_count, created_by")
    .eq("is_published", true)
    .gte("date_time", now.toISOString())
    .lte("date_time", in48h);

  if (!events?.length) return { processed: 0, promoted: 0 };

  let processed = 0;
  let promoted = 0;

  for (const event of events) {
    const capacity = event.capacity ?? 0;
    const attending = event.attending_count ?? 0;
    const openSlots = capacity - attending;
    if (openSlots <= 0) continue;

    // Get waitlisted members (ordered by join time)
    const { data: waitlist } = await supabase
      .from("event_waitlist")
      .select("user_id, id")
      .eq("event_id", event.id)
      .order("created_at", { ascending: true })
      .limit(openSlots);

    if (!waitlist?.length) { processed++; continue; }

    for (const entry of waitlist) {
      // Move from waitlist to attending
      const { error } = await supabase.from("event_rsvps").insert({
        event_id: event.id,
        user_id: entry.user_id,
        status: "confirmed",
        source: "waitlist_promotion",
      });

      if (!error) {
        await supabase.from("event_waitlist").delete().eq("id", entry.id);
        await supabase.from("events").update({ attending_count: attending + 1 }).eq("id", event.id);

        await supabase.from("notifications").insert({
          user_id: entry.user_id,
          type: "seat",
          title: `You're in! ${event.title} ✦`,
          body: "A spot opened up and you were first on the waitlist. You're confirmed for this event.",
          link: "/member/happenings",
          data: { event_id: event.id },
        });

        await logAction({
          agent: "yande-operations",
          action_type: "promote_from_waitlist",
          risk_level: "low",
          target_user_id: entry.user_id as string,
          metadata: { event_id: event.id, event_title: event.title },
        }, "completed");

        promoted++;
      }
      await new Promise(r => setTimeout(r, 200));
    }

    processed++;
  }

  return { processed, promoted };
}

export async function checkCapacityAlerts(): Promise<{ alerted: number }> {
  const supabase = admin();
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, capacity, attending_count, created_by")
    .eq("is_published", true)
    .gte("date_time", now.toISOString())
    .lte("date_time", in24h)
    .not("created_by", "is", null);

  if (!events?.length) return { alerted: 0 };

  let alerted = 0;

  for (const event of events) {
    const cap = event.capacity ?? 0;
    const att = event.attending_count ?? 0;
    const pct = cap > 0 ? att / cap : 0;

    // Alert at 90% full (still time to add a friend)
    if (pct < 0.9 || pct >= 1) continue;

    const { count: recentAlert } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", event.created_by)
      .eq("data->>event_id", event.id)
      .eq("type", "capacity");

    if (recentAlert && recentAlert > 0) continue;

    await supabase.from("notifications").insert({
      user_id: event.created_by,
      type: "capacity",
      title: `${event.title} is almost full`,
      body: `${att} of ${cap} spots filled. You might want to open a waitlist or add a seat.`,
      link: "/member/happenings",
      data: { event_id: event.id, fill_pct: Math.round(pct * 100) },
    });

    alerted++;
  }

  return { alerted };
}
