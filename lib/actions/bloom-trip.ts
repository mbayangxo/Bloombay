"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface BloomTrip {
  id: string;
  organizer_id: string;
  organizer_name: string | null;
  organizer_avatar: string | null;
  title: string;
  destination: string;
  description: string | null;
  departure_date: string;
  return_date: string | null;
  price_per_person_cents: number;
  capacity: number;
  attending_count: number;
  includes: string[];
  image_url: string | null;
  accent_color: string;
  status: string;
  created_at: string;
}

export interface CreateBloomTripInput {
  title: string;
  destination: string;
  description?: string;
  departure_date: string;
  return_date?: string;
  price_per_person_cents: number;
  capacity: number;
  includes?: string[];
  image_url?: string;
  accent_color?: string;
}

const BLOOM_TRIP_FEE_PCT = 0.08; // 8%

export async function getBloomTrips(): Promise<BloomTrip[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bloom_trips")
    .select("*, profiles!organizer_id(display_name, avatar_url)")
    .in("status", ["open", "full"])
    .gte("departure_date", new Date().toISOString().split("T")[0])
    .order("departure_date", { ascending: true })
    .limit(30);
  return (data ?? []).map(mapTrip);
}

export async function getMyTrips(): Promise<BloomTrip[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: attending } = await supabase
    .from("bloom_trip_attendees")
    .select("trip_id")
    .eq("user_id", user.id);
  const ids = (attending ?? []).map((r: { trip_id: string }) => r.trip_id);

  const [organized, joined] = await Promise.all([
    supabase.from("bloom_trips").select("*, profiles!organizer_id(display_name, avatar_url)").eq("organizer_id", user.id),
    ids.length > 0
      ? supabase.from("bloom_trips").select("*, profiles!organizer_id(display_name, avatar_url)").in("id", ids)
      : Promise.resolve({ data: [] }),
  ]);
  const all = [...(organized.data ?? []), ...((joined as { data: unknown[] }).data ?? [])];
  return all.map(mapTrip);
}

export async function createBloomTrip(input: CreateBloomTripInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data, error } = await supabase.from("bloom_trips").insert({
    organizer_id: user.id,
    title: input.title.trim(),
    destination: input.destination.trim(),
    description: input.description?.trim() ?? null,
    departure_date: input.departure_date,
    return_date: input.return_date ?? null,
    price_per_person_cents: input.price_per_person_cents,
    capacity: input.capacity,
    includes: input.includes ?? [],
    image_url: input.image_url ?? null,
    accent_color: input.accent_color ?? "#FF1F7D",
    status: "open",
  }).select("id").single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/member/bloom-trip");
  return { ok: true, id: (data as { id: string }).id };
}

export async function joinBloomTrip(tripId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("bloom_trip_attendees").insert({ trip_id: tripId, user_id: user.id });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/member/bloom-trip");
  return { ok: true };
}

export async function leaveBloomTrip(tripId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("bloom_trip_attendees").delete().eq("trip_id", tripId).eq("user_id", user.id);
}

export async function getMyTripIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from("bloom_trip_attendees").select("trip_id").eq("user_id", user.id);
  return (data ?? []).map((r: { trip_id: string }) => r.trip_id);
}

export function bloomTripFee(pricePerPersonCents: number): number {
  return Math.round(pricePerPersonCents * BLOOM_TRIP_FEE_PCT);
}

function mapTrip(r: {
  id: string; organizer_id: string; title: string; destination: string;
  description: string | null; departure_date: string; return_date: string | null;
  price_per_person_cents: number; capacity: number; attending_count: number;
  includes: string[]; image_url: string | null; accent_color: string;
  status: string; created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}): BloomTrip {
  return {
    id: r.id, organizer_id: r.organizer_id, title: r.title, destination: r.destination,
    description: r.description, departure_date: r.departure_date, return_date: r.return_date,
    price_per_person_cents: r.price_per_person_cents, capacity: r.capacity,
    attending_count: r.attending_count, includes: r.includes, image_url: r.image_url,
    accent_color: r.accent_color, status: r.status, created_at: r.created_at,
    organizer_name: r.profiles?.display_name ?? null,
    organizer_avatar: r.profiles?.avatar_url ?? null,
  };
}
