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
  status?: "active" | "draft";
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
    status: input.status ?? "active",
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

// ─── Messaging ─────────────────────────────────────────────────────────────────

export type HangerMessageType = "text" | "swap_offer" | "address" | "delivery_offer";

export interface HangerMessage {
  id: string;
  listing_id: string;
  sender_id: string;
  recipient_id: string;
  body: string | null;
  photo_url: string | null;
  message_type: HangerMessageType;
  meta: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export async function sendHangerMessage(input: {
  listing_id: string;
  recipient_id: string;
  body?: string;
  photo_url?: string;
  message_type?: HangerMessageType;
  meta?: Record<string, unknown>;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };
  if (user.id === input.recipient_id) return { ok: false, error: "You can't message yourself." };

  const { data, error } = await supabase.from("hanger_messages").insert({
    listing_id:   input.listing_id,
    sender_id:    user.id,
    recipient_id: input.recipient_id,
    body:         input.body?.trim() ?? null,
    photo_url:    input.photo_url ?? null,
    message_type: input.message_type ?? "text",
    meta:         input.meta ?? null,
  }).select("id").single();

  return error ? { ok: false, error: error.message } : { ok: true, id: (data as { id: string }).id };
}

export async function getHangerThread(listingId: string, otherUserId: string): Promise<HangerMessage[]> {

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("hanger_messages")
    .select("*")
    .eq("listing_id", listingId)
    .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
    .order("created_at", { ascending: true });

  return (data ?? []) as HangerMessage[];
}

// ─── Flowers ───────────────────────────────────────────────────────────────────

export async function sendHangerFlower(
  recipientId: string,
  listingId: string,
  type: "flower" | "petal",
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };
  // Upsert: creates or switches petal ↔ flower for this (sender, listing) pair
  const { error } = await supabase.from("hanger_flowers").upsert(
    { sender_id: user.id, recipient_id: recipientId, listing_id: listingId, appreciation_type: type },
    { onConflict: "sender_id,listing_id" },
  );
  return error ? { ok: false, error: error.message } : { ok: true };
}

export interface ListingAppreciation {
  petals: number;
  flowers: number;
  myType: "flower" | "petal" | null;
}

export async function getListingAppreciation(listingId: string): Promise<ListingAppreciation> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: counts }, { data: mine }] = await Promise.all([
    supabase
      .from("hanger_listing_appreciation")
      .select("petal_count, flower_count")
      .eq("listing_id", listingId)
      .maybeSingle(),
    user
      ? supabase
          .from("hanger_flowers")
          .select("appreciation_type")
          .eq("listing_id", listingId)
          .eq("sender_id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return {
    petals:  (counts as { petal_count: number } | null)?.petal_count  ?? 0,
    flowers: (counts as { flower_count: number } | null)?.flower_count ?? 0,
    myType:  (mine as { appreciation_type: string } | null)?.appreciation_type as "flower" | "petal" | null ?? null,
  };
}

export async function removeHangerFlower(listingId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("hanger_flowers").delete().eq("sender_id", user.id).eq("listing_id", listingId);
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface HangerReview {
  id: string;
  seller_id: string;
  reviewer_id: string;
  listing_id: string | null;
  rating: number;
  body: string | null;
  created_at: string;
}

export async function getHangerReviews(sellerId: string): Promise<HangerReview[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hanger_reviews")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .limit(20);
  return (data ?? []) as HangerReview[];
}

export async function submitHangerReview(input: {
  seller_id: string;
  listing_id?: string;
  rating: number;
  body?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };
  const { error } = await supabase.from("hanger_reviews").insert({
    seller_id: input.seller_id, reviewer_id: user.id,
    listing_id: input.listing_id ?? null, rating: input.rating,
    body: input.body?.trim() ?? null,
  });
  if (error?.code === "23505") return { ok: false, error: "You've already reviewed this listing." };
  return error ? { ok: false, error: error.message } : { ok: true };
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export interface HangerComment {
  id: string;
  listing_id: string;
  author_id: string;
  author_name: string | null;
  author_avatar: string | null;
  body: string;
  created_at: string;
}

export async function getHangerComments(listingId: string): Promise<HangerComment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hanger_comments")
    .select("*, profiles(display_name, avatar_url)")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: true })
    .limit(50);
  return (data ?? []).map((r: {
    id: string; listing_id: string; author_id: string; body: string; created_at: string;
    profiles: { display_name: string | null; avatar_url: string | null } | null;
  }) => ({
    id: r.id, listing_id: r.listing_id, author_id: r.author_id, body: r.body, created_at: r.created_at,
    author_name: r.profiles?.display_name ?? null,
    author_avatar: r.profiles?.avatar_url ?? null,
  }));
}

export async function postHangerComment(listingId: string, body: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };
  const { error } = await supabase.from("hanger_comments").insert({
    listing_id: listingId, author_id: user.id, body: body.trim(),
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

// ─── Hanger seller stats ───────────────────────────────────────────────────────

export interface HangerSellerStats {
  seller_id: string;
  review_count: number;
  avg_rating: number;
  flower_count: number;
}

export async function hasPurchasedFromSeller(sellerId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("hanger_sales")
    .select("id")
    .eq("seller_id", sellerId)
    .eq("buyer_id", user.id)
    .limit(1)
    .maybeSingle();
  return !!data;
}

export async function getHangerSellerStats(sellerId: string): Promise<HangerSellerStats> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hanger_seller_stats")
    .select("*")
    .eq("seller_id", sellerId)
    .maybeSingle();
  return (data as HangerSellerStats | null) ?? { seller_id: sellerId, review_count: 0, avg_rating: 0, flower_count: 0 };
}
