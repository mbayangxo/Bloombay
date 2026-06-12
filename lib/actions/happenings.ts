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
  return (data as { id: string }).id;
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
