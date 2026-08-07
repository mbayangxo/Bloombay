"use server";

import { createClient } from "@/lib/supabase/server";

export async function isVenueSaved(venueId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("venue_saves")
    .select("venue_id")
    .eq("venue_id", venueId)
    .eq("user_id", user.id)
    .maybeSingle();
  return !!data;
}

export async function saveVenue(venueId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  await supabase.from("venue_saves").insert({ venue_id: venueId, user_id: user.id });
}

export async function unsaveVenue(venueId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  await supabase.from("venue_saves").delete().eq("venue_id", venueId).eq("user_id", user.id);
}
