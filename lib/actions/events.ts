"use server";

import { createClient } from "@/lib/supabase/server";

export interface Event {
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
}

export async function getEvents(): Promise<Event[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("date_time", { ascending: true });

  if (error) {
    console.error("getEvents error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function joinEvent(eventId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("event_attendees")
    .insert({ event_id: eventId, user_id: user.id });

  if (error && error.code !== "23505") {
    return { error: error.message };
  }

  return { error: null };
}

export async function leaveEvent(eventId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("event_attendees")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", user.id);

  return { error: error?.message ?? null };
}

export async function getJoinedEventIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("event_attendees")
    .select("event_id")
    .eq("user_id", user.id);

  return (data ?? []).map(r => r.event_id);
}
