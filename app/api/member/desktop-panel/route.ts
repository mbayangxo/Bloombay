import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";

function admin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const db = admin();
  const now = new Date().toISOString();

  const [bloomiesRes, openSeatsRes, venuesRes] = await Promise.all([
    // Recently active bloomies (proxy: updated_at within 7 days), exclude self
    db
      .from("profiles")
      .select("id, first_name, full_name, avatar_url, neighborhood")
      .eq("is_member", true)
      .neq("id", user.id)
      .gte("updated_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("updated_at", { ascending: false })
      .limit(6),

    // Gatherings with open seats (capacity set, not full, upcoming)
    db
      .from("gatherings")
      .select("id, title, starts_at, capacity, spots_left, accent_color, venue, area")
      .eq("publish_status", "live")
      .not("capacity", "is", null)
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(8),

    // Top venues for Yande's rotating daily pick
    db
      .from("restaurant_partners")
      .select("id, slug, name, neighborhood, tagline, poem, bloom_rating, restaurant_type")
      .gte("bloom_rating", 4.0)
      .order("bloom_rating", { ascending: false })
      .limit(7),
  ]);

  // Filter open seats to only those that actually have seats left
  const openSeats = (openSeatsRes.data ?? [])
    .filter((g) => {
      if (g.capacity === null) return false;
      const spotsLeft = g.spots_left ?? g.capacity;
      return spotsLeft > 0;
    })
    .slice(0, 3)
    .map((g) => ({
      id: g.id,
      title: g.title,
      date_time: g.starts_at,
      seats_left: g.spots_left ?? g.capacity ?? 0,
      accent_color: g.accent_color ?? "#FF1F7D",
      venue: g.venue ?? g.area ?? null,
    }));

  // Rotate Yande's pick by day of year so it changes daily
  const venues = venuesRes.data ?? [];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const yandeRecommends = venues.length > 0 ? venues[dayOfYear % venues.length] : null;

  return NextResponse.json({
    activeBloomies: (bloomiesRes.data ?? []).map(p => ({
      id: p.id,
      first_name: p.first_name ?? (p.full_name?.split(" ")[0] ?? null),
      avatar_url: p.avatar_url ?? null,
      neighborhood: p.neighborhood ?? null,
    })),
    openSeats,
    yandeRecommends,
  });
}
