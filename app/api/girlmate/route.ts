import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_LISTING_TYPES = new Set(["room", "apartment", "roommate-wanted", "co-search"]);
const VALID_CITIES = new Set(["New York City", "London", "Los Angeles", "Atlanta", "Chicago"]);
const NEIGHBORHOOD_MIN = 2;
const NEIGHBORHOOD_MAX = 80;
const DESCRIPTION_MIN  = 20;
const DESCRIPTION_MAX  = 800;
const LIFESTYLE_TAGS_MAX = 8;

// Housing listing types require gov ID verification before going live
const HOUSING_TYPES = new Set(["room", "apartment"]);

// GET /api/girlmate?tab=available|looking&city=New+York+City
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed, verification_status")
    .eq("id", user.id)
    .single();
  if (!profile?.onboarding_completed) {
    return NextResponse.json({ error: "Complete onboarding first" }, { status: 403 });
  }
  if (profile.verification_status !== "verified") {
    return NextResponse.json({ error: "Verified members only" }, { status: 403 });
  }

  const tab  = req.nextUrl.searchParams.get("tab") ?? "available";
  const city = req.nextUrl.searchParams.get("city") ?? "New York City";

  let query = supabase
    .from("girlmate_profiles")
    .select(`
      id, listing_type, city, neighborhood_name, price_cents, available_from,
      available_to, furnished, private_bathroom, pets, smoking, weed_ok,
      halal_kitchen, wfh_friendly, partner_ok, show_profile, description,
      yande_note, image_url, lifestyle_tags, bio, display_name,
      age_range, preferred_age, personality_type, cleanliness_level,
      noise_level, drinking, mom_status, wants_kids, religion, religion_level,
      move_in_timeline, guest_frequency, kitchen_use, temp_preference,
      dealbreaker_tags, interests, deal_breakers, voice_note_url, video_intro_url,
      profile:profiles!user_id ( id, first_name, full_name )
    `)
    .eq("is_active", true)
    .eq("city", city)
    .order("created_at", { ascending: false })
    .limit(30);

  if (tab === "available") {
    query = query.in("listing_type", ["room", "apartment", "roommate-wanted"]);
  } else {
    query = query.in("listing_type", ["roommate-wanted", "co-search"]);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/girlmate — create or upsert a listing
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed, verification_status, gov_id_verification_status")
    .eq("id", user.id)
    .single();
  if (!profile?.onboarding_completed) {
    return NextResponse.json({ error: "Complete onboarding first" }, { status: 403 });
  }
  if (profile.verification_status !== "verified") {
    return NextResponse.json({ error: "Verified members only" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // listing_type must be a valid enum
  const listingType = String(body.listing_type ?? "");
  if (!VALID_LISTING_TYPES.has(listingType)) {
    return NextResponse.json(
      { error: `listing_type must be one of: ${[...VALID_LISTING_TYPES].join(", ")}` },
      { status: 400 }
    );
  }

  // Gov ID required before housing listings go live
  const govIdStatus = (profile as { gov_id_verification_status?: string }).gov_id_verification_status ?? "not_submitted";
  if (HOUSING_TYPES.has(listingType) && govIdStatus !== "verified") {
    return NextResponse.json(
      { error: "Upload ID to publish a housing listing. Your ID must be verified before the listing goes live." },
      { status: 403 }
    );
  }

  // city must be from the approved list
  const city = String(body.city ?? "New York City");
  if (!VALID_CITIES.has(city)) {
    return NextResponse.json(
      { error: `city must be one of: ${[...VALID_CITIES].join(", ")}` },
      { status: 400 }
    );
  }

  // neighborhood: 2–80 chars
  const neighborhood = String(body.neighborhood ?? "").trim();
  if (neighborhood.length < NEIGHBORHOOD_MIN || neighborhood.length > NEIGHBORHOOD_MAX) {
    return NextResponse.json(
      { error: `Neighborhood must be ${NEIGHBORHOOD_MIN}–${NEIGHBORHOOD_MAX} characters` },
      { status: 400 }
    );
  }

  // description: 20–800 chars
  const description = String(body.description ?? "").trim();
  if (description && (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX)) {
    return NextResponse.json(
      { error: `Description must be ${DESCRIPTION_MIN}–${DESCRIPTION_MAX} characters` },
      { status: 400 }
    );
  }

  // price: sane range ($0–$20,000/mo)
  const price = body.price !== undefined && body.price !== null ? Number(body.price) : null;
  if (price !== null && (isNaN(price) || price < 0 || price > 20000)) {
    return NextResponse.json({ error: "Price must be between $0 and $20,000" }, { status: 400 });
  }
  const priceCents = price !== null ? Math.round(price * 100) : null;

  // lifestyle_tags: max 8
  const lifestyleTags = Array.isArray(body.lifestyle_tags)
    ? (body.lifestyle_tags as unknown[]).filter((t): t is string => typeof t === "string").slice(0, LIFESTYLE_TAGS_MAX)
    : [];

  // available_from / available_to: valid ISO dates if provided
  const availableFrom = body.available_from ? String(body.available_from) : null;
  const availableTo   = body.available_to   ? String(body.available_to)   : null;
  if (availableFrom && isNaN(Date.parse(availableFrom))) {
    return NextResponse.json({ error: "available_from must be a valid date" }, { status: 400 });
  }
  if (availableTo && isNaN(Date.parse(availableTo))) {
    return NextResponse.json({ error: "available_to must be a valid date" }, { status: 400 });
  }

  const { error } = await supabase
    .from("girlmate_profiles")
    .upsert(
      {
        user_id:           user.id,
        listing_type:      listingType,
        city,
        neighborhood_name: neighborhood,
        price_cents:       priceCents,
        available_from:    availableFrom,
        available_to:      availableTo,
        furnished:         Boolean(body.furnished),
        private_bathroom:  Boolean(body.private_bathroom),
        pets:              Boolean(body.pets),
        smoking:           Boolean(body.smoking),
        weed_ok:           Boolean(body.weed_ok),
        halal_kitchen:     Boolean(body.halal_kitchen),
        wfh_friendly:      Boolean(body.wfh_friendly),
        partner_ok:        Boolean(body.partner_ok),
        show_profile:      body.show_profile !== false,
        description:       description || null,
        lifestyle_tags:    lifestyleTags,
        personality_type:  body.personality_type ?? null,
        cleanliness_level: body.cleanliness_level ?? null,
        noise_level:       body.noise_level ?? null,
        drinking:          body.drinking ?? null,
        mom_status:        body.mom_status ?? null,
        wants_kids:        body.wants_kids ?? null,
        religion:          body.religion ?? null,
        religion_level:    body.religion_level ?? null,
        move_in_timeline:  body.move_in_timeline ?? null,
        guest_frequency:   body.guest_frequency ?? null,
        kitchen_use:       body.kitchen_use ?? null,
        temp_preference:   body.temp_preference ?? null,
        dealbreaker_tags:  Array.isArray(body.dealbreaker_tags) ? body.dealbreaker_tags : [],
        interests:         Array.isArray(body.interests) ? body.interests : [],
        deal_breakers:     body.deal_breakers ?? null,
        voice_note_url:    body.voice_note_url ?? null,
        video_intro_url:   body.video_intro_url ?? null,
        // Housing listings: only active if gov ID verified
        is_active:         !HOUSING_TYPES.has(listingType) || govIdStatus === "verified",
      },
      { onConflict: "user_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
