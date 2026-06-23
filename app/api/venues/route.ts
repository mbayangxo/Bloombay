// GET /api/venues
// Public — returns all restaurant partners for the places discovery page.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: venues } = await supabase
    .from("restaurant_partners")
    .select("id, slug, name, restaurant_type, neighborhood, city, tagline, bloom_notes, bloom_rating, reviews, brand_color, cover_url")
    .order("bloom_notes", { ascending: false })
    .limit(30);

  if (!venues?.length) return NextResponse.json([]);

  return NextResponse.json(venues.map(v => {
    const reviews = (v.reviews as Array<{ rating: number }> | null) ?? [];
    const avgRating = reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : (v.bloom_rating as number | null) ?? 0;

    return {
      id: v.id,
      slug: v.slug ?? "",
      name: v.name,
      neighborhood: v.neighborhood ?? "",
      city: v.city ?? "",
      tagline: v.tagline ?? "",
      type: (v.restaurant_type as string | null) ?? "",
      bloom_notes: (v.bloom_notes as number | null) ?? 0,
      avg_rating: Math.round(avgRating * 10) / 10,
      brand_color: (v.brand_color as string | null) ?? "#FF1F7D",
      cover_url: v.cover_url as string | null,
    };
  }));
}
