"use server";

import { createClient } from "@/lib/supabase/server";

export interface TrendingSpot {
  id: string;
  city: string;
  neighborhood: string | null;
  name: string;
  category: string;
  description: string | null;
  source: string | null;
  source_url: string | null;
  image_url: string | null;
  badge: string | null;
  week_of: string;
  rank_order: number;
  save_count: number;
}

export async function getWeeklyTrending(city = "New York"): Promise<TrendingSpot[]> {
  const supabase = await createClient();

  // Get the most recent approved week
  const { data } = await supabase
    .from("city_trending")
    .select("id,city,neighborhood,name,category,description,source,source_url,image_url,badge,week_of,rank_order,save_count")
    .eq("city", city)
    .eq("status", "approved")
    .order("week_of", { ascending: false })
    .order("rank_order", { ascending: true })
    .limit(12);

  return (data ?? []) as TrendingSpot[];
}

export async function saveTrendingSpot(trendingId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("city_trending_saves").upsert({ trending_id: trendingId, user_id: user.id });
}

export async function unsaveTrendingSpot(trendingId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("city_trending_saves").delete().eq("trending_id", trendingId).eq("user_id", user.id);
}

export async function submitTrendingSpot(spot: {
  name: string;
  category: string;
  neighborhood?: string;
  description?: string;
  source?: string;
  source_url?: string;
  city?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { error } = await supabase.from("city_trending").insert({
    ...spot,
    city: spot.city ?? "New York",
    submitted_by: user.id,
    status: "pending",
  });

  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function approveTrendingSpot(id: string, rankOrder: number): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("city_trending").update({
    status: "approved",
    approved_by: user.id,
    approved_at: new Date().toISOString(),
    rank_order: rankOrder,
  }).eq("id", id);
}
