"use server";

import { createClient } from "@/lib/supabase/server";

export interface BookListing {
  id: string;
  provider_id: string;
  provider_name: string | null;
  provider_avatar: string | null;
  service_name: string;
  category: string;
  description: string | null;
  price_cents: number | null;
  price_type: string;
  location: string | null;
  image_url: string | null;
  created_at: string;
}

export interface CreateBookListingInput {
  service_name: string;
  category: string;
  description?: string;
  price_cents?: number;
  price_type?: string;
  location?: string;
  image_url?: string;
}

export const BOOK_CATEGORIES = [
  "Nails", "Hair", "Makeup", "Photography", "Fitness",
  "Tutoring", "Coaching", "Art", "Music", "Legal",
  "Finance", "Therapy", "Nutrition", "Styling", "Other",
];

export async function getBookListings(category?: string): Promise<BookListing[]> {
  const supabase = await createClient();
  let q = supabase
    .from("book_listings")
    .select("*, profiles!provider_id(display_name, avatar_url)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(60);
  if (category) q = q.eq("category", category);
  const { data } = await q;
  return (data ?? []).map((r: {
    id: string; provider_id: string; service_name: string; category: string;
    description: string | null; price_cents: number | null; price_type: string;
    location: string | null; image_url: string | null; created_at: string;
    profiles: { display_name: string | null; avatar_url: string | null } | null;
  }) => ({
    id: r.id, provider_id: r.provider_id, service_name: r.service_name,
    category: r.category, description: r.description, price_cents: r.price_cents,
    price_type: r.price_type, location: r.location, image_url: r.image_url,
    created_at: r.created_at,
    provider_name: r.profiles?.display_name ?? null,
    provider_avatar: r.profiles?.avatar_url ?? null,
  }));
}

export async function createBookListing(input: CreateBookListingInput): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("book_listings").insert({
    provider_id: user.id,
    service_name: input.service_name.trim(),
    category: input.category,
    description: input.description?.trim() ?? null,
    price_cents: input.price_cents ?? null,
    price_type: input.price_type ?? "fixed",
    location: input.location?.trim() ?? null,
    image_url: input.image_url ?? null,
    is_active: true,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function sendBookRequest(listingId: string, message?: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("book_requests").insert({
    listing_id: listingId, client_id: user.id, message: message?.trim() ?? null,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function getMyBookListings(): Promise<BookListing[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("book_listings")
    .select("*, profiles!provider_id(display_name, avatar_url)")
    .eq("provider_id", user.id)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r: {
    id: string; provider_id: string; service_name: string; category: string;
    description: string | null; price_cents: number | null; price_type: string;
    location: string | null; image_url: string | null; created_at: string;
    profiles: { display_name: string | null; avatar_url: string | null } | null;
  }) => ({
    id: r.id, provider_id: r.provider_id, service_name: r.service_name,
    category: r.category, description: r.description, price_cents: r.price_cents,
    price_type: r.price_type, location: r.location, image_url: r.image_url,
    created_at: r.created_at,
    provider_name: r.profiles?.display_name ?? null,
    provider_avatar: r.profiles?.avatar_url ?? null,
  }));
}
