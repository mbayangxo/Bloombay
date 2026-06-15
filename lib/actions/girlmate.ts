"use server";

import { createClient } from "@/lib/supabase/server";

export interface GirlmateListing {
  id: string;
  user_id: string;
  listing_type: "room" | "apartment" | "roommate-wanted" | "co-search";
  city: string;
  neighborhood_name: string | null;
  price_cents: number | null;
  available_from: string | null;
  available_to: string | null;
  furnished: boolean;
  private_bathroom: boolean;
  pets: boolean;
  smoking: boolean;
  weed_ok: boolean;
  halal_kitchen: boolean;
  wfh_friendly: boolean;
  partner_ok: boolean;
  description: string | null;
  image_url: string | null;
  show_profile: boolean;
  is_active: boolean;
  created_at: string;
  // Joined from profiles
  poster_name: string | null;
  poster_initial: string;
  poster_color: string;
  poster_clubs?: string[];
}

export interface CreateListingInput {
  listing_type: "room" | "apartment" | "roommate-wanted" | "co-search";
  city?: string;
  neighborhood_name?: string;
  price_cents?: number;
  available_from?: string;
  available_to?: string;
  furnished?: boolean;
  private_bathroom?: boolean;
  pets?: boolean;
  smoking?: boolean;
  weed_ok?: boolean;
  halal_kitchen?: boolean;
  wfh_friendly?: boolean;
  description?: string;
  show_profile?: boolean;
}

const AVATAR_COLORS = ["#FF1F7D","#FF69B4","#C084FC","#F97316","#10B981","#3B82F6","#A855F7","#EC4899"];
function colorForId(id: string) {
  let n = 0;
  for (const c of id) n = (n * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

export async function getGirlmateListings(city?: string): Promise<GirlmateListing[]> {
  const supabase = await createClient();

  let q = supabase
    .from("girlmate_profiles")
    .select("*, profiles!user_id(first_name, full_name)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(40);

  if (city) q = q.ilike("city", `%${city}%`);

  const { data } = await q;

  return (data ?? []).map((r: Record<string, unknown>) => {
    const profile = r.profiles as { first_name?: string; full_name?: string } | null;
    const name = profile?.full_name ?? profile?.first_name ?? null;
    return {
      id: r.id as string,
      user_id: r.user_id as string,
      listing_type: (r.listing_type as GirlmateListing["listing_type"]) ?? "roommate-wanted",
      city: (r.city as string) ?? "New York",
      neighborhood_name: r.neighborhood_name as string | null,
      price_cents: r.price_cents as number | null,
      available_from: r.available_from as string | null,
      available_to: r.available_to as string | null,
      furnished: !!(r.furnished),
      private_bathroom: !!(r.private_bathroom),
      pets: !!(r.pets),
      smoking: !!(r.smoking),
      weed_ok: !!(r.weed_ok),
      halal_kitchen: !!(r.halal_kitchen),
      wfh_friendly: !!(r.wfh_friendly),
      partner_ok: !!(r.partner_ok),
      description: r.description as string | null,
      image_url: r.image_url as string | null,
      show_profile: r.show_profile !== false,
      is_active: !!(r.is_active),
      created_at: r.created_at as string,
      poster_name: name,
      poster_initial: (name?.[0] ?? "?").toUpperCase(),
      poster_color: colorForId(r.user_id as string),
    };
  });
}

export async function getMyListing(): Promise<GirlmateListing | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("girlmate_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return null;
  const r = data as Record<string, unknown>;
  return {
    id: r.id as string, user_id: r.user_id as string,
    listing_type: (r.listing_type as GirlmateListing["listing_type"]) ?? "roommate-wanted",
    city: (r.city as string) ?? "New York", neighborhood_name: r.neighborhood_name as string | null,
    price_cents: r.price_cents as number | null, available_from: r.available_from as string | null,
    available_to: r.available_to as string | null, furnished: !!(r.furnished),
    private_bathroom: !!(r.private_bathroom), pets: !!(r.pets), smoking: !!(r.smoking),
    weed_ok: !!(r.weed_ok), halal_kitchen: !!(r.halal_kitchen), wfh_friendly: !!(r.wfh_friendly),
    partner_ok: !!(r.partner_ok), description: r.description as string | null,
    image_url: r.image_url as string | null, show_profile: r.show_profile !== false,
    is_active: !!(r.is_active), created_at: r.created_at as string,
    poster_name: null, poster_initial: "?", poster_color: colorForId(r.user_id as string),
  };
}

export async function upsertListing(input: CreateListingInput): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const { error } = await supabase.from("girlmate_profiles").upsert({
    user_id: user.id,
    listing_type: input.listing_type,
    city: input.city ?? "New York",
    neighborhood_name: input.neighborhood_name ?? null,
    price_cents: input.price_cents ?? null,
    available_from: input.available_from ?? null,
    available_to: input.available_to ?? null,
    furnished: input.furnished ?? false,
    private_bathroom: input.private_bathroom ?? false,
    pets: input.pets ?? false,
    smoking: input.smoking ?? false,
    weed_ok: input.weed_ok ?? false,
    halal_kitchen: input.halal_kitchen ?? false,
    wfh_friendly: input.wfh_friendly ?? false,
    description: input.description?.trim() ?? null,
    show_profile: input.show_profile ?? true,
    is_active: true,
  }, { onConflict: "user_id" });

  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function deactivateListing(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("girlmate_profiles").update({ is_active: false }).eq("user_id", user.id);
}
