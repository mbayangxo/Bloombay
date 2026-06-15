"use server";

import { createClient } from "@/lib/supabase/server";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface HostProfile {
  id: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  neighborhood: string | null;
  borough: string | null;
  city: string | null;
  created_at: string;
}

export interface HostStats {
  eventsHosted: number;
  womenHosted: number;
  flowersReceived: number;
  avgRating: number | null;
  reviewCount: number;
}

export interface HostEventSummary {
  id: string;
  title: string;
  starts_at: string;
  venue: string | null;
  neighborhood: string | null;
  attending_count: number;
  flower_count: number;
  memory_text: string | null;
  tradition_id: string | null;
  attendee_avatars: { user_id: string; full_name: string | null; avatar_url: string | null }[];
}

export interface HostReviewPublic {
  id: string;
  event_id: string;
  rating: number;
  content: string | null;
  created_at: string;
  reviewer_name: string | null;
  reviewer_avatar: string | null;
}

// ── Data fetchers ─────────────────────────────────────────────────────────────

export async function getHostProfile(hostId: string): Promise<HostProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, display_name, avatar_url, bio, neighborhood, borough, city, created_at")
    .eq("id", hostId)
    .maybeSingle();
  return data as HostProfile | null;
}

export async function getHostStats(hostId: string): Promise<HostStats> {
  const supabase = await createClient();

  const { data: hostEvents, count: eventsHosted } = await supabase
    .from("gatherings")
    .select("id, attending_count", { count: "exact" })
    .eq("host_id", hostId);

  const eventIds = (hostEvents ?? []).map((e: { id: string }) => e.id);
  const womenHosted = (hostEvents ?? []).reduce(
    (s: number, e: { attending_count: number }) => s + (e.attending_count ?? 0),
    0,
  );

  let flowersReceived = 0;
  let avgRating: number | null = null;
  let reviewCount = 0;

  if (eventIds.length > 0) {
    const { count: fc } = await supabase
      .from("gathering_flowers")
      .select("gathering_id", { count: "exact", head: true })
      .in("gathering_id", eventIds);
    flowersReceived = fc ?? 0;

    const { data: reviews } = await supabase
      .from("host_reviews")
      .select("rating")
      .eq("host_id", hostId);
    reviewCount = (reviews ?? []).length;
    if (reviewCount > 0) {
      const sum = (reviews ?? []).reduce((s: number, r: { rating: number }) => s + r.rating, 0);
      avgRating = Math.round((sum / reviewCount) * 10) / 10;
    }
  }

  return { eventsHosted: eventsHosted ?? 0, womenHosted, flowersReceived, avgRating, reviewCount };
}

export async function getHostPastEvents(hostId: string, limit = 12): Promise<HostEventSummary[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: events } = await supabase
    .from("gatherings")
    .select("id, title, starts_at, venue, neighborhood, attending_count, tradition_id")
    .eq("host_id", hostId)
    .lt("starts_at", now)
    .order("starts_at", { ascending: false })
    .limit(limit);

  if (!events?.length) return [];

  const eventIds = (events as { id: string }[]).map(e => e.id);

  const [{ data: flowers }, { data: memories }, ...attendeeResults] = await Promise.all([
    supabase.from("gathering_flowers").select("gathering_id").in("gathering_id", eventIds),
    supabase.from("event_memories").select("gathering_id, memory_text").in("gathering_id", eventIds),
    ...eventIds.map(id =>
      supabase
        .from("gathering_attendance")
        .select("user_id, profiles!user_id(full_name, avatar_url)")
        .eq("gathering_id", id)
        .limit(5),
    ),
  ]);

  const flowerCounts: Record<string, number> = {};
  for (const f of (flowers ?? []) as { gathering_id: string }[]) {
    flowerCounts[f.gathering_id] = (flowerCounts[f.gathering_id] ?? 0) + 1;
  }

  const memoryMap: Record<string, string> = {};
  for (const m of (memories ?? []) as { gathering_id: string; memory_text: string }[]) {
    memoryMap[m.gathering_id] = m.memory_text;
  }

  return (events as {
    id: string; title: string; starts_at: string; venue: string | null;
    neighborhood: string | null; attending_count: number; tradition_id: string | null;
  }[]).map((e, i) => {
    const attendees = ((attendeeResults[i].data ?? []) as Record<string, unknown>[]).map(r => {
      const p = r.profiles as { full_name?: string; avatar_url?: string } | null;
      return { user_id: r.user_id as string, full_name: p?.full_name ?? null, avatar_url: p?.avatar_url ?? null };
    });
    return {
      id: e.id, title: e.title, starts_at: e.starts_at, venue: e.venue,
      neighborhood: e.neighborhood, attending_count: e.attending_count ?? 0,
      flower_count: flowerCounts[e.id] ?? 0, memory_text: memoryMap[e.id] ?? null,
      tradition_id: e.tradition_id, attendee_avatars: attendees,
    };
  });
}

// Reviews only visible 24h after the event
export async function getHostReviewsPublic(hostId: string): Promise<HostReviewPublic[]> {
  const supabase = await createClient();
  const twentyFourAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from("host_reviews")
    .select("id, event_id, rating, content, created_at, profiles!reviewer_id(full_name, display_name, avatar_url)")
    .eq("host_id", hostId)
    .lt("created_at", twentyFourAgo)
    .order("created_at", { ascending: false })
    .limit(30);

  return ((data ?? []) as Record<string, unknown>[]).map(r => {
    const p = r.profiles as { full_name?: string; display_name?: string; avatar_url?: string } | null;
    return {
      id: r.id as string,
      event_id: r.event_id as string,
      rating: r.rating as number,
      content: r.content as string | null,
      created_at: r.created_at as string,
      reviewer_name: p?.display_name ?? p?.full_name ?? null,
      reviewer_avatar: p?.avatar_url ?? null,
    };
  });
}
