// GET /api/venues/[id]
// Public — returns a single venue by UUID or slug.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const cols = "id, slug, name, restaurant_type, neighborhood, city, tagline, about, bloom_notes, bloom_rating, reviews, brand_color, cover_url, photo_urls, instagram, address";

  let { data: venue } = await supabase
    .from("restaurant_partners")
    .select(cols)
    .eq("id", id)
    .maybeSingle();

  if (!venue) {
    ({ data: venue } = await supabase
      .from("restaurant_partners")
      .select(cols)
      .eq("slug", id)
      .maybeSingle());
  }

  if (!venue) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const reviews = (venue.reviews as Array<{ author: string; text: string; rating: number }> | null) ?? [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : (venue.bloom_rating as number | null) ?? 0;

  return NextResponse.json({
    id: venue.id,
    slug: venue.slug ?? "",
    name: venue.name,
    neighborhood: venue.neighborhood ?? "",
    city: venue.city ?? "",
    location: [venue.neighborhood, venue.city].filter(Boolean).join(", "),
    tagline: venue.tagline ?? "",
    about: venue.about ?? "",
    type: (venue.restaurant_type as string | null) ?? "",
    bloom_notes: (venue.bloom_notes as number | null) ?? 0,
    avg_rating: Math.round(avgRating * 10) / 10,
    review_count: reviews.length,
    brand_color: (venue.brand_color as string | null) ?? "#FF1F7D",
    cover_url: venue.cover_url as string | null,
    photo_urls: (venue.photo_urls as string[] | null) ?? [],
    instagram: (venue.instagram as string | null) ?? "",
    address: (venue.address as string | null) ?? "",
    reviews: reviews.map(r => ({ author: r.author, text: r.text, rating: r.rating })),
  });
}
