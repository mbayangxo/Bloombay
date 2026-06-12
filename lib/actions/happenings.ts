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
