"use server";

import { createClient } from "@/lib/supabase/server";

export interface PartnerReview {
  author: string;
  text: string;
  rating: number;
}

export interface GirlFavorite {
  name: string;
  description: string;
}

export interface PartnerData {
  id: string;
  slug: string;
  owner_id: string | null;
  name: string;
  restaurant_type: string;
  neighborhood: string | null;
  city: string;
  tagline: string | null;
  about: string | null;
  bloom_notes: number;
  bloom_rating: number;
  loved_by: string[] | null;
  poem: string | null;
  polaroid_caption: string | null;
  host_note: string | null;
  bloom_tips: string[] | null;
  girl_favorites: GirlFavorite[] | null;
  reviews: PartnerReview[] | null;
  hours: Record<string, string> | null;
  instagram: string | null;
  address: string | null;
  price_range: string | null;
  cover_url: string | null;
  photo_urls: string[];
  menu_url: string | null;
  brand_color: string;
  visited_by: string[];
}

export type PartnerUpdateFields = Partial<Omit<PartnerData, "id" | "slug" | "owner_id" | "visited_by">>;

export async function getPartners(city = "New York"): Promise<PartnerData[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("restaurant_partners")
    .select("*")
    .eq("city", city)
    .order("bloom_notes", { ascending: false });
  return (data ?? []) as PartnerData[];
}

export async function getPartner(slugOrId: string): Promise<PartnerData | null> {
  const supabase = await createClient();
  const isUuid = /^[0-9a-f-]{36}$/i.test(slugOrId);
  const query = supabase.from("restaurant_partners").select("*");
  const { data } = isUuid
    ? await query.eq("id", slugOrId).single()
    : await query.eq("slug", slugOrId).single();
  return (data as PartnerData | null) ?? null;
}

export async function updatePartner(id: string, fields: PartnerUpdateFields): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("restaurant_partners")
    .update(fields as Record<string, unknown>)
    .eq("id", id);
  if (error) throw error;
}

export async function createPartner(fields: {
  slug: string;
  name: string;
  restaurant_type?: string;
  neighborhood?: string;
  city?: string;
}): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("restaurant_partners")
    .insert({ ...fields, owner_id: user.id })
    .select("id")
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function markVisited(partnerId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data } = await supabase
    .from("restaurant_partners")
    .select("visited_by")
    .eq("id", partnerId)
    .single();
  const visited: string[] = (data as { visited_by: string[] | null } | null)?.visited_by ?? [];
  if (visited.includes(user.id)) return;
  await supabase
    .from("restaurant_partners")
    .update({ visited_by: [...visited, user.id] })
    .eq("id", partnerId);
}

export async function addPartnerPhoto(partnerId: string, url: string): Promise<void> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("restaurant_partners")
    .select("photo_urls")
    .eq("id", partnerId)
    .single();
  const photos: string[] = (data as { photo_urls: string[] | null } | null)?.photo_urls ?? [];
  await supabase
    .from("restaurant_partners")
    .update({ photo_urls: [...photos, url] })
    .eq("id", partnerId);
}

export async function removePartnerPhoto(partnerId: string, url: string): Promise<void> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("restaurant_partners")
    .select("photo_urls")
    .eq("id", partnerId)
    .single();
  const photos: string[] = (data as { photo_urls: string[] | null } | null)?.photo_urls ?? [];
  await supabase
    .from("restaurant_partners")
    .update({ photo_urls: photos.filter(u => u !== url) })
    .eq("id", partnerId);
}
