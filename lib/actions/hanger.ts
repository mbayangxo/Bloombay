"use server";

import { createClient } from "@/lib/supabase/server";

export type HangerListingType = "sell" | "swap" | "sell_or_swap" | "give_away";

export interface HangerListing {
  id: string;
  seller_id: string;
  seller_name: string | null;
  seller_avatar: string | null;
  title: string;
  description: string | null;
  price_cents: number;
  listing_type: HangerListingType;
  swap_wants: string | null;
  size: string | null;
  category: string | null;
  condition: string;
  city: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
}

export interface CreateHangerListingInput {
  title: string;
  description?: string;
  price_cents: number;
  listing_type?: HangerListingType;
  swap_wants?: string;
  city?: string;
  size?: string;
  category?: string;
  condition?: string;
  image_url?: string;
}

const HANGER_FEE_PCT = 0.10; // 10%

export async function getHangerListings(category?: string): Promise<HangerListing[]> {
  const supabase = await createClient();
  let q = supabase
    .from("hanger_listings")
    .select("*, profiles(display_name, avatar_url)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(60);
  if (category) q = q.eq("category", category);
  const { data } = await q;
  return (data ?? []).map((r: {
    id: string; seller_id: string; title: string; description: string | null;
    price_cents: number; listing_type: HangerListingType | null; swap_wants: string | null;
    city: string | null; size: string | null; category: string | null;
    condition: string; image_url: string | null; status: string; created_at: string;
    profiles: { display_name: string | null; avatar_url: string | null } | null;
  }) => ({
    id: r.id, seller_id: r.seller_id, title: r.title, description: r.description,
    price_cents: r.price_cents, listing_type: r.listing_type ?? "sell", swap_wants: r.swap_wants ?? null,
    city: r.city ?? null, size: r.size, category: r.category,
    condition: r.condition, image_url: r.image_url, status: r.status, created_at: r.created_at,
    seller_name: r.profiles?.display_name ?? null,
    seller_avatar: r.profiles?.avatar_url ?? null,
  }));
}

export async function getMyHangerListings(): Promise<HangerListing[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("hanger_listings")
    .select("*, profiles(display_name, avatar_url)")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r: {
    id: string; seller_id: string; title: string; description: string | null;
    price_cents: number; listing_type: HangerListingType | null; swap_wants: string | null;
    city: string | null; size: string | null; category: string | null;
    condition: string; image_url: string | null; status: string; created_at: string;
    profiles: { display_name: string | null; avatar_url: string | null } | null;
  }) => ({
    id: r.id, seller_id: r.seller_id, title: r.title, description: r.description,
    price_cents: r.price_cents, listing_type: r.listing_type ?? "sell", swap_wants: r.swap_wants ?? null,
    city: r.city ?? null, size: r.size, category: r.category,
    condition: r.condition, image_url: r.image_url, status: r.status, created_at: r.created_at,
    seller_name: r.profiles?.display_name ?? null,
    seller_avatar: r.profiles?.avatar_url ?? null,
  }));
}

export async function createHangerListing(input: CreateHangerListingInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data, error } = await supabase.from("hanger_listings").insert({
    seller_id: user.id,
    title: input.title.trim(),
    description: input.description?.trim() ?? null,
    price_cents: input.price_cents,
    listing_type: input.listing_type ?? "sell",
    swap_wants: input.swap_wants?.trim() ?? null,
    city: input.city?.trim() ?? null,
    size: input.size ?? null,
    category: input.category ?? null,
    condition: input.condition ?? "good",
    image_url: input.image_url ?? null,
    status: "active",
  }).select("id").single();
  return error ? { ok: false, error: error.message } : { ok: true, id: (data as { id: string }).id };
}

export async function recordHangerSale(listingId: string, buyerId: string, amountCents: number): Promise<void> {
  const supabase = await createClient();
  const feeCents = Math.round(amountCents * HANGER_FEE_PCT);
  const payoutCents = amountCents - feeCents;

  const { data: listing } = await supabase.from("hanger_listings").select("seller_id").eq("id", listingId).single();
  if (!listing) return;

  await Promise.all([
    supabase.from("hanger_sales").insert({
      listing_id: listingId, seller_id: (listing as { seller_id: string }).seller_id,
      buyer_id: buyerId, amount_cents: amountCents, fee_cents: feeCents, payout_cents: payoutCents,
    }),
    supabase.from("hanger_listings").update({ status: "sold" }).eq("id", listingId),
  ]);
}

export async function getMyHangerBalance(): Promise<{ pending_cents: number; paid_out_cents: number }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { pending_cents: 0, paid_out_cents: 0 };
  const { data } = await supabase.from("hanger_seller_balance").select("*").eq("seller_id", user.id).maybeSingle();
  return { pending_cents: (data as { pending_cents: number } | null)?.pending_cents ?? 0, paid_out_cents: (data as { paid_out_cents: number } | null)?.paid_out_cents ?? 0 };
}
