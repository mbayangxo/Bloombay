"use server";

import { createClient } from "@/lib/supabase/server";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface HostRecapData {
  gatheringId: string;
  title: string;
  startsAt: string;
  attendingCount: number;
  flowerCount: number;
  venue: string | null;
}

// ── Cron entry point ──────────────────────────────────────────────────────────

export async function processPostEventFollowups(): Promise<{ processed: number }> {
  const supabase = await createClient();

  const now = new Date();
  const twoHoursAgo   = new Date(now.getTime() - 2  * 60 * 60 * 1000).toISOString();
  const twentyFourAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  // Gatherings that ended 2-24 h ago (approximate via starts_at)
  const { data: events } = await supabase
    .from("gatherings")
    .select("id, title, host_id, starts_at, attending_count")
    .gte("starts_at", twentyFourAgo)
    .lt("starts_at", twoHoursAgo)
    .not("host_id", "is", null);

  if (!events?.length) return { processed: 0 };

  for (const ev of events) {
    try {
      await sendPostEventFollowup(
        ev.id,
        ev.title,
        ev.host_id as string,
        (ev.attending_count as number) ?? 0,
      );
    } catch {
      // non-fatal — continue to next event
    }
  }

  return { processed: events.length };
}

// ── Per-event logic ───────────────────────────────────────────────────────────

async function sendPostEventFollowup(
  gatheringId: string,
  title: string,
  hostId: string,
  attendingCount: number,
): Promise<void> {
  const supabase = await createClient();

  const [{ data: attendees }, { data: hostProfile }, { count: flowerCount }] = await Promise.all([
    supabase.from("gathering_attendance").select("user_id").eq("gathering_id", gatheringId),
    supabase.from("profiles").select("full_name, display_name").eq("id", hostId).maybeSingle(),
    supabase.from("gathering_flowers")
      .select("gathering_id", { count: "exact", head: true })
      .eq("gathering_id", gatheringId),
  ]);

  const hostName =
    (hostProfile as { display_name?: string; full_name?: string } | null)?.display_name ??
    (hostProfile as { display_name?: string; full_name?: string } | null)?.full_name ??
    "your host";

  // Notify each attendee (skip the host herself)
  const rpc = supabase as unknown as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<unknown>;
  };

  for (const a of (attendees ?? [])) {
    if ((a as { user_id: string }).user_id === hostId) continue;
    await rpc.rpc("create_notification", {
      p_user_id: (a as { user_id: string }).user_id,
      p_type:    "post_event_thanks",
      p_title:   `${title} ✦`,
      p_body:    `${hostName} is glad you came. Leave a flower if you had a great time.`,
      p_url:     "/member/happenings",
      p_meta:    { gathering_id: gatheringId, host_id: hostId },
    }).catch(() => {});
  }

  // Morning recap for the host
  const recapMsg = await generateHostRecapMessage(title, attendingCount, flowerCount ?? 0);

  await rpc.rpc("create_notification", {
    p_user_id: hostId,
    p_type:    "host_morning_recap",
    p_title:   `Your ${title} recap ✦`,
    p_body:    recapMsg,
    p_url:     "/member/host?tab=dashboard",
    p_meta:    {
      gathering_id:    gatheringId,
      attending_count: attendingCount,
      flower_count:    flowerCount ?? 0,
    },
  }).catch(() => {});

  // Store event memory on host profile (upsert so safe to re-run)
  await storeEventMemory(supabase, gatheringId, title, attendingCount, flowerCount ?? 0);
}

async function generateHostRecapMessage(
  title: string,
  attendingCount: number,
  flowerCount: number,
): Promise<string> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key":         process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
        "content-type":      "application/json",
      },
      body: JSON.stringify({
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 80,
        messages: [{
          role: "user",
          content: `Write a warm 1-sentence recap for a woman who hosted "${title}" with ${attendingCount} attendees and received ${flowerCount} flowers. Celebratory, genuine, feminine. No emojis. Under 80 chars.`,
        }],
      }),
    });
    const json = await res.json() as { content?: { text: string }[] };
    return json.content?.[0]?.text?.trim() ?? `${attendingCount} women showed up for you. You did that.`;
  } catch {
    return `${attendingCount} women showed up for you. You did that.`;
  }
}

// ── Store event memory on the host profile ────────────────────────────────────

async function storeEventMemory(
  supabase: Awaited<ReturnType<typeof createClient>>,
  gatheringId: string,
  title: string,
  attendingCount: number,
  flowerCount: number,
): Promise<void> {
  // Check if a memory already exists
  const { data: existing } = await (supabase as unknown as {
    from: (t: string) => { select: (c: string) => { eq: (k: string, v: string) => { maybeSingle: () => Promise<{ data: unknown }> } } };
  }).from("event_memories").select("id").eq("gathering_id", gatheringId).maybeSingle();
  if (existing) return;

  const memoryText = await generateEventMemory(title, attendingCount, flowerCount);

  await (supabase as unknown as {
    from: (t: string) => { upsert: (row: Record<string, unknown>, opts: Record<string, unknown>) => Promise<unknown> };
  }).from("event_memories").upsert(
    { gathering_id: gatheringId, memory_text: memoryText },
    { onConflict: "gathering_id" },
  );
}

async function generateEventMemory(
  title: string,
  attendingCount: number,
  flowerCount: number,
): Promise<string> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key":         process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
        "content-type":      "application/json",
      },
      body: JSON.stringify({
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 60,
        messages: [{
          role: "user",
          content: `Write a 1-line atmospheric memory for "${title}" — ${attendingCount} women came, ${flowerCount} flowers given. Evocative, sensory, present-tense. No emojis. Under 60 chars.`,
        }],
      }),
    });
    const json = await res.json() as { content?: { text: string }[] };
    return json.content?.[0]?.text?.trim() ?? `${attendingCount} women. One evening.`;
  } catch {
    return `${attendingCount} women. One evening.`;
  }
}

// ── Host recap for the home-feed card ─────────────────────────────────────────

export async function getLastHostedEventRecap(): Promise<HostRecapData | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const twentyFourAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from("gatherings")
    .select("id, title, starts_at, attending_count, venue")
    .eq("host_id", user.id)
    .gte("starts_at", twentyFourAgo)
    .lt("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  const row = data as {
    id: string; title: string; starts_at: string; attending_count: number; venue: string | null;
  };

  const { count: flowerCount } = await supabase
    .from("gathering_flowers")
    .select("gathering_id", { count: "exact", head: true })
    .eq("gathering_id", row.id);

  return {
    gatheringId:    row.id,
    title:          row.title,
    startsAt:       row.starts_at,
    attendingCount: row.attending_count ?? 0,
    flowerCount:    flowerCount ?? 0,
    venue:          row.venue,
  };
}
