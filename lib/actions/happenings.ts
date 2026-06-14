"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface HappeningEvent {
  id: string;
  title: string;
  description: string | null;
  venue: string | null;
  neighborhood: string | null;
  city: string;
  date_time: string;
  end_time: string | null;
  photo_url: string | null;
  accent_color: string;
  host_note: string | null;
  category: string | null;
  badge: string | null;
  capacity: number | null;
  attending_count: number;
  price_cents: number;
  is_official: boolean;
  created_by: string | null;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  venue?: string;
  neighborhood?: string;
  date_time: string;
  end_time?: string;
  category?: string;
  capacity?: number;
  price_cents?: number;
  accent_color?: string;
  host_note?: string;
  photo_url?: string;
}

export async function getUpcomingEvents(limit = 30): Promise<HappeningEvent[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("date_time", new Date().toISOString())
    .order("date_time", { ascending: true })
    .limit(limit);
  return (data ?? []) as HappeningEvent[];
}

export async function getEventById(id: string): Promise<HappeningEvent | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();
  return (data as HappeningEvent | null) ?? null;
}

export async function createEvent(input: CreateEventInput): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("events")
    .insert({
      title:        input.title,
      description:  input.description ?? null,
      venue:        input.venue ?? null,
      neighborhood: input.neighborhood ?? null,
      city:         "NYC",
      date_time:    input.date_time,
      end_time:     input.end_time ?? null,
      category:     input.category ?? null,
      capacity:     input.capacity ?? null,
      price_cents:  input.price_cents ?? 0,
      accent_color: input.accent_color ?? "#FF1F7D",
      host_note:    input.host_note ?? null,
      photo_url:    input.photo_url ?? null,
      created_by:   user.id,
      is_published: true,
    })
    .select("id")
    .single();

  if (error) throw error;
  revalidatePath("/member/happenings");
  const eventId = (data as { id: string }).id;
  // Fire-and-forget streak notification (don't await — non-blocking)
  checkAndNotifyStreak().catch(() => {});
  return eventId;
}

export async function rsvpEvent(eventId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("event_attendees")
    .insert({ event_id: eventId, user_id: user.id });
  if (error && error.code !== "23505") throw error; // ignore duplicate
}

export async function unrsvpEvent(eventId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase
    .from("event_attendees")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", user.id);
}

export async function getMyRsvps(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("event_attendees")
    .select("event_id")
    .eq("user_id", user.id);
  return (data ?? []).map((r: { event_id: string }) => r.event_id);
}

// ── Waitlist ──────────────────────────────────────────────────────────────────

export async function joinWaitlist(eventId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  await supabase.from("event_waitlist").insert({ event_id: eventId, user_id: user.id });
}

export async function leaveWaitlist(eventId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("event_waitlist").delete().eq("event_id", eventId).eq("user_id", user.id);
}

export async function getWaitlistCounts(eventIds: string[]): Promise<Record<string, number>> {
  if (eventIds.length === 0) return {};
  const supabase = await createClient();
  const { data } = await supabase.from("event_waitlist").select("event_id").in("event_id", eventIds);
  const counts: Record<string, number> = {};
  for (const row of data ?? []) counts[row.event_id] = (counts[row.event_id] ?? 0) + 1;
  return counts;
}

export async function getMyWaitlistIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from("event_waitlist").select("event_id").eq("user_id", user.id);
  return (data ?? []).map((r: { event_id: string }) => r.event_id);
}

// ── Post-event witnesses ──────────────────────────────────────────────────────

export async function witnessAttendee(eventId: string, toUserId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  await supabase.from("event_witnesses")
    .upsert({ event_id: eventId, from_user_id: user.id, to_user_id: toUserId }, { onConflict: "event_id,from_user_id,to_user_id" });
}

export async function getWitnessedIds(eventId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from("event_witnesses")
    .select("to_user_id").eq("event_id", eventId).eq("from_user_id", user.id);
  return (data ?? []).map((r: { to_user_id: string }) => r.to_user_id);
}

// ── Host reviews ──────────────────────────────────────────────────────────────

export interface HostReview {
  id: string;
  event_id: string;
  host_id: string;
  reviewer_id: string;
  rating: number;
  content: string | null;
  created_at: string;
  reviewer_name: string | null;
  reviewer_avatar: string | null;
}

export async function leaveHostReview(
  eventId: string, hostId: string, rating: number, content?: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };
  if (user.id === hostId) return { ok: false, error: "Can't review yourself." };

  const { error } = await supabase.from("host_reviews").insert({
    event_id: eventId, host_id: hostId, reviewer_id: user.id,
    rating, content: content?.trim() || null,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function getHostReviews(hostId: string): Promise<HostReview[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("host_reviews")
    .select("*, profiles!reviewer_id(display_name, avatar_url)")
    .eq("host_id", hostId)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []).map((r: {
    id: string; event_id: string; host_id: string; reviewer_id: string;
    rating: number; content: string | null; created_at: string;
    profiles: { display_name: string | null; avatar_url: string | null } | null;
  }) => ({
    id: r.id, event_id: r.event_id, host_id: r.host_id, reviewer_id: r.reviewer_id,
    rating: r.rating, content: r.content, created_at: r.created_at,
    reviewer_name: r.profiles?.display_name ?? null,
    reviewer_avatar: r.profiles?.avatar_url ?? null,
  }));
}

export async function getMyReviewedEventIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from("host_reviews").select("event_id").eq("reviewer_id", user.id);
  return (data ?? []).map((r: { event_id: string }) => r.event_id);
}

// ── Host streak ───────────────────────────────────────────────────────────────

export async function getMyHostedCount(): Promise<number> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;
  const { count } = await supabase.from("events").select("id", { count: "exact", head: true }).eq("created_by", user.id);
  return count ?? 0;
}

const STREAK_MILESTONES: Record<number, string> = {
  2:  "You've hosted twice now. Women are showing up for you. ✦",
  3:  "Third happening. You're becoming a fixture in the city. ✦",
  5:  "Five events. You're a real host now. Bloombay sees you. ✦",
  10: "Ten happenings. You've built something. This is your city. ✦",
};

export async function checkAndNotifyStreak(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { count } = await supabase.from("events").select("id", { count: "exact", head: true }).eq("created_by", user.id);
  const n = count ?? 0;
  const msg = STREAK_MILESTONES[n];
  if (!msg) return;

  await (supabase as unknown as { rpc: (fn: string, args: Record<string, unknown>) => Promise<unknown> }).rpc("create_notification", {
    p_user_id: user.id,
    p_type: "host_streak",
    p_title: `Host streak · ${n} events 🔥`,
    p_body: msg,
    p_url: "/member/happenings",
    p_meta: { hosted_count: n },
  });
}

// ── Gathering flowers ─────────────────────────────────────────────────────────

export async function toggleGatheringFlower(gatheringId: string): Promise<{ gave: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { gave: false };

  const { data: existing } = await supabase
    .from("gathering_flowers")
    .select("gathering_id")
    .eq("gathering_id", gatheringId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("gathering_flowers").delete().eq("gathering_id", gatheringId).eq("user_id", user.id);
    return { gave: false };
  }
  await supabase.from("gathering_flowers").insert({ gathering_id: gatheringId, user_id: user.id });
  return { gave: true };
}

export async function getGatheringFlowersForUser(gatheringIds: string[]): Promise<Record<string, { count: number; gave: boolean }>> {
  if (!gatheringIds.length) return {};
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: counts } = await supabase
    .from("gathering_flowers")
    .select("gathering_id")
    .in("gathering_id", gatheringIds);

  const result: Record<string, { count: number; gave: boolean }> = {};
  for (const row of (counts ?? []) as { gathering_id: string }[]) {
    result[row.gathering_id] = { count: (result[row.gathering_id]?.count ?? 0) + 1, gave: false };
  }

  if (user) {
    const { data: mine } = await supabase
      .from("gathering_flowers")
      .select("gathering_id")
      .in("gathering_id", gatheringIds)
      .eq("user_id", user.id);
    for (const row of (mine ?? []) as { gathering_id: string }[]) {
      if (result[row.gathering_id]) result[row.gathering_id].gave = true;
    }
  }

  return result;
}

// ── Profile flowers ───────────────────────────────────────────────────────────

export async function sendProfileFlower(
  profileId: string,
  flowerType: "general" | "witness" | "host" | "club" = "general",
  message?: string
): Promise<{ gave: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id === profileId) return { gave: false };

  const { data: existing } = await supabase
    .from("profile_flowers")
    .select("profile_id")
    .eq("profile_id", profileId)
    .eq("user_id", user.id)
    .eq("flower_type", flowerType)
    .maybeSingle();

  if (existing) {
    await supabase.from("profile_flowers").delete()
      .eq("profile_id", profileId).eq("user_id", user.id).eq("flower_type", flowerType);
    return { gave: false };
  }
  await supabase.from("profile_flowers").insert({
    profile_id: profileId, user_id: user.id, flower_type: flowerType, message: message ?? null,
  });
  return { gave: true };
}

export async function getProfileFlowerCount(profileId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("profile_flowers")
    .select("profile_id", { count: "exact", head: true })
    .eq("profile_id", profileId);
  return count ?? 0;
}

// ── Host Reputation ───────────────────────────────────────────────────────────

export interface HostReputation {
  flowersReceived: number;
  totalAttendees: number;
  repeatAttendees: number;
  eventsHosted: number;
}

export async function getHostReputation(hostId: string): Promise<HostReputation> {
  const supabase = await createClient();

  // Events hosted
  const { count: eventsHosted } = await supabase
    .from("gatherings")
    .select("id", { count: "exact", head: true })
    .eq("host_id", hostId);

  // Flowers received (across all their events)
  const { data: hostEvents } = await supabase
    .from("gatherings")
    .select("id")
    .eq("host_id", hostId);

  const eventIds = (hostEvents ?? []).map((e: { id: string }) => e.id);

  let flowersReceived = 0;
  let totalAttendees = 0;
  let repeatAttendees = 0;

  if (eventIds.length > 0) {
    const { count: fc } = await supabase
      .from("gathering_flowers")
      .select("gathering_id", { count: "exact", head: true })
      .in("gathering_id", eventIds);
    flowersReceived = fc ?? 0;

    // Unique total attendees
    const { data: attendees } = await supabase
      .from("gathering_attendance")
      .select("user_id")
      .in("gathering_id", eventIds);
    const allUsers = (attendees ?? []).map((a: { user_id: string }) => a.user_id);
    totalAttendees = new Set(allUsers).size;

    // Repeat attendees (appeared more than once)
    const freq: Record<string, number> = {};
    allUsers.forEach(u => { freq[u] = (freq[u] ?? 0) + 1; });
    repeatAttendees = Object.values(freq).filter(v => v > 1).length;
  }

  return {
    flowersReceived,
    totalAttendees,
    repeatAttendees,
    eventsHosted: eventsHosted ?? 0,
  };
}

export async function updateArrivalStatus(
  status: "just_moved" | "new_6mo" | "fresh_start" | "local" | "native"
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").update({ arrival_status: status }).eq("id", user.id);
}

// ── Host: my hosted gatherings ────────────────────────────────────────────────

export interface HostedGathering {
  id: string;
  title: string;
  starts_at: string;
  venue: string | null;
  neighborhood: string | null;
  attending_count: number;
  spots_left: number | null;
  capacity: number | null;
  tradition_id: string | null;
}

export async function getMyHostedGatherings(): Promise<{ upcoming: HostedGathering[]; past: HostedGathering[] }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { upcoming: [], past: [] };

  const now = new Date().toISOString();
  const [{ data: upcoming }, { data: past }] = await Promise.all([
    supabase.from("gatherings")
      .select("id, title, starts_at, venue, neighborhood, attending_count, spots_left, capacity, tradition_id")
      .eq("host_id", user.id)
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(10),
    supabase.from("gatherings")
      .select("id, title, starts_at, venue, neighborhood, attending_count, spots_left, capacity, tradition_id")
      .eq("host_id", user.id)
      .lt("starts_at", now)
      .order("starts_at", { ascending: false })
      .limit(10),
  ]);

  return {
    upcoming: (upcoming ?? []) as HostedGathering[],
    past:     (past     ?? []) as HostedGathering[],
  };
}

export interface AttendeePreview {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export async function getGatheringAttendeesForHost(gatheringId: string): Promise<AttendeePreview[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: g } = await supabase
    .from("gatherings").select("host_id").eq("id", gatheringId).single();
  if (!g || (g as { host_id: string }).host_id !== user.id) return [];

  const { data } = await supabase
    .from("gathering_attendance")
    .select("user_id, profiles!user_id(full_name, avatar_url)")
    .eq("gathering_id", gatheringId)
    .limit(30);

  return (data ?? []).map((r: Record<string, unknown>) => {
    const p = r.profiles as { full_name?: string; avatar_url?: string } | null;
    return { user_id: r.user_id as string, full_name: p?.full_name ?? null, avatar_url: p?.avatar_url ?? null };
  });
}



