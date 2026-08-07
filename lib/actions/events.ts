"use server";

import { createClient } from "@/lib/supabase/server";

export interface Event {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  venue: string | null;
  neighborhood: string | null;
  area: string | null;
  city: string;
  starts_at: string;
  event_type: string | null;
  image_url: string | null;
  accent_color: string | null;
  host_id: string | null;
  host_name: string | null;
  host_note: string | null;
  capacity: number | null;
  spots_left: number | null;
  attending_count: number;
  price_cents: number;
  is_official: boolean;
  badge: string | null;
}

// Demo/seed rows inserted by supabase/migrations/003_irl_core.sql for local
// dev — never meant to reach a real member's feed. event_type was added as
// a nullable column later with no backfill, so these are normally excluded
// by the event_type filter below already; this is defense-in-depth in case
// event_type ever gets set on them (host-dashboard edit, re-seed, etc).
const DEMO_GATHERING_SLUGS = ["sant-ambroeus-soho", "cafe-lume-williamsburg", "loft-house-brooklyn"];

export async function getEvents(): Promise<Event[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gatherings")
    .select("*")
    .not("event_type", "is", null)
    .not("slug", "in", `(${DEMO_GATHERING_SLUGS.join(",")})`)
    .order("starts_at", { ascending: true });

  if (error) {
    console.error("getEvents error:", error.message);
    return [];
  }

  return (data ?? []) as Event[];
}

export async function joinEvent(gatheringId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("gathering_attendance")
    .insert({ gathering_id: gatheringId, user_id: user.id });

  if (error && error.code !== "23505") return { error: error.message };
  return { error: null };
}

export async function leaveEvent(gatheringId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("gathering_attendance")
    .delete()
    .eq("gathering_id", gatheringId)
    .eq("user_id", user.id);

  return { error: error?.message ?? null };
}

export async function getJoinedEventIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("gathering_attendance")
    .select("gathering_id")
    .eq("user_id", user.id);

  return (data ?? []).map((r: { gathering_id: string }) => r.gathering_id);
}

