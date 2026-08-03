"use server";

import { createClient } from "@/lib/supabase/server";

export interface MonthlyRecap {
  month: string;
  shortMonth: string;
  events: number;
  saves: number;
  bloomiesMet: number;
  flowers: number;
  clubsJoined: number;
  hasActivity: boolean;
}

function sumUnits(rows: { units?: number | null }[] | null): number {
  return (rows ?? []).reduce((sum, r) => sum + (r.units ?? 1), 0);
}

// Real counts for the current calendar month, scoped to the signed-in member.
// Returns null when signed out so the card can render nothing.
export async function getMonthlyRecap(): Promise<MonthlyRecap | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
  const month = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const shortMonth = now.toLocaleDateString("en-US", { month: "long" });

  const [
    eventsRes,
    savesRes,
    scansRes,
    gatheringFlowersRes,
    profileFlowersRes,
    placeFlowersRes,
    postFlowersRes,
    noteFlowersRes,
    clubsRes,
  ] = await Promise.all([
    supabase.from("gathering_attendance").select("id", { count: "exact", head: true })
      .eq("user_id", user.id).gte("checked_in_at", monthStart).lt("checked_in_at", monthEnd),
    supabase.from("city_trending_saves").select("trending_id", { count: "exact", head: true })
      .eq("user_id", user.id).gte("saved_at", monthStart).lt("saved_at", monthEnd),
    supabase.from("friend_scans").select("initiator_id, scanned_id")
      .or(`initiator_id.eq.${user.id},scanned_id.eq.${user.id}`)
      .gte("scanned_at", monthStart).lt("scanned_at", monthEnd),
    supabase.from("gathering_flowers").select("units")
      .eq("user_id", user.id).gte("created_at", monthStart).lt("created_at", monthEnd),
    supabase.from("profile_flowers").select("units")
      .eq("user_id", user.id).gte("created_at", monthStart).lt("created_at", monthEnd),
    supabase.from("place_flowers").select("units")
      .eq("user_id", user.id).gte("created_at", monthStart).lt("created_at", monthEnd),
    supabase.from("post_flowers").select("units")
      .eq("user_id", user.id).gte("created_at", monthStart).lt("created_at", monthEnd),
    supabase.from("bloom_note_flowers").select("units")
      .eq("user_id", user.id).gte("created_at", monthStart).lt("created_at", monthEnd),
    supabase.from("club_memberships").select("id", { count: "exact", head: true })
      .eq("user_id", user.id).gte("joined_at", monthStart).lt("joined_at", monthEnd),
  ]);

  const events = eventsRes.count ?? 0;
  const saves = savesRes.count ?? 0;
  const clubsJoined = clubsRes.count ?? 0;

  const met = new Set<string>();
  for (const row of (scansRes.data ?? []) as { initiator_id: string; scanned_id: string }[]) {
    const other = row.initiator_id === user.id ? row.scanned_id : row.initiator_id;
    if (other) met.add(other);
  }
  const bloomiesMet = met.size;

  const flowers =
    sumUnits(gatheringFlowersRes.data) +
    sumUnits(profileFlowersRes.data) +
    sumUnits(placeFlowersRes.data) +
    sumUnits(postFlowersRes.data) +
    sumUnits(noteFlowersRes.data);

  const hasActivity = events > 0 || saves > 0 || bloomiesMet > 0 || flowers > 0 || clubsJoined > 0;

  return { month, shortMonth, events, saves, bloomiesMet, flowers, clubsJoined, hasActivity };
}
