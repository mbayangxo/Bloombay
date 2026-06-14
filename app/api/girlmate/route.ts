import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as adminClient } from "@supabase/supabase-js";

function admin() {
  return adminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// GET /api/girlmate?tab=available|looking&city=New+York+City
export async function GET(req: NextRequest) {
  const tab = req.nextUrl.searchParams.get("tab") ?? "available";
  const city = req.nextUrl.searchParams.get("city") ?? "New York City";

  const supabase = admin();
  let query = supabase
    .from("girlmate_profiles")
    .select(`
      id, listing_type, city, neighborhood_name, price_cents, available_from,
      available_to, furnished, private_bathroom, pets, smoking, weed_ok,
      halal_kitchen, wfh_friendly, partner_ok, show_profile, description,
      yande_note, image_url, lifestyle_tags, bio, display_name,
      profile:profiles!user_id ( id, first_name, full_name )
    `)
    .eq("is_active", true)
    .eq("city", city)
    .order("created_at", { ascending: false })
    .limit(30);

  // "available" tab: rooms/apartments/roommate-wanted (has space)
  // "looking" tab: roommate-wanted seeking + co-search
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

  const body = await req.json();

  const { error } = await supabase
    .from("girlmate_profiles")
    .upsert(
      {
        user_id: user.id,
        listing_type:     body.listing_type ?? "room",
        city:             body.city ?? "New York City",
        neighborhood_name: body.neighborhood ?? "",
        price_cents:      body.price ? Math.round(Number(body.price) * 100) : null,
        available_from:   body.available_from ?? null,
        available_to:     body.available_to ?? null,
        furnished:        body.furnished ?? false,
        private_bathroom: body.private_bathroom ?? false,
        pets:             body.pets ?? false,
        smoking:          body.smoking ?? false,
        weed_ok:          body.weed_ok ?? false,
        halal_kitchen:    body.halal_kitchen ?? false,
        wfh_friendly:     body.wfh_friendly ?? false,
        partner_ok:       body.partner_ok ?? false,
        show_profile:     body.show_profile ?? true,
        description:      body.description ?? null,
        is_active:        true,
      },
      { onConflict: "user_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
