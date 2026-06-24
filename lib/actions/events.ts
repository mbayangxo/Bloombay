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

export async function getEvents(): Promise<Event[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gatherings")
    .select("*")
    .not("event_type", "is", null)
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed, verification_status")
    .eq("id", user.id)
    .single();
  if (!profile?.onboarding_completed) return { error: "Complete onboarding first" };
  if (profile.verification_status !== "verified") return { error: "Verified members only" };

  // Capacity check — spots_left is decremented by DB trigger on INSERT
  const { data: gathering } = await supabase
    .from("gatherings")
    .select("spots_left")
    .eq("id", gatheringId)
    .single();
  if (gathering && gathering.spots_left !== null && gathering.spots_left <= 0) {
    return { error: "This event is full" };
  }

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

/** Returns other attendees at a gathering — only visible to fellow attendees. */
export async function getGatheringAttendees(gatheringId: string): Promise<Array<{ id: string; name: string; avatar_url: string | null }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: myAttendance } = await supabase
    .from("gathering_attendance")
    .select("gathering_id")
    .eq("gathering_id", gatheringId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!myAttendance) return [];

  const { data } = await supabase
    .from("gathering_attendance")
    .select("user_id, profiles!user_id(first_name, full_name, avatar_url)")
    .eq("gathering_id", gatheringId)
    .neq("user_id", user.id)
    .limit(50);

  return (data ?? []).map((r: Record<string, unknown>) => {
    const p = r.profiles as { first_name?: string | null; full_name?: string | null; avatar_url?: string | null } | null;
    const name = p?.first_name ?? p?.full_name?.split(" ")[0] ?? "Member";
    return { id: r.user_id as string, name, avatar_url: p?.avatar_url ?? null };
  });
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
