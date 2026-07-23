// GET /api/partner-portal/my-venue
// Returns the authenticated partner's venue data with reservations and stats.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: venue } = await supabase
    .from("restaurant_partners")
    .select("id, slug, name, restaurant_type, neighborhood, city, tagline, about, bloom_notes, bloom_rating, reviews, brand_color, cover_url, photo_urls, instagram, address, hours")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!venue) return NextResponse.json({ error: "No venue found" }, { status: 404 });

  const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const [upcomingRes, pastRes, pendingRes] = await Promise.all([
    supabase
      .from("table_reservations")
      .select("id, user_id, date, time, party_size, notes, status, created_at")
      .eq("restaurant_id", venue.id)
      .gte("date", now)
      .eq("status", "confirmed")
      .order("date", { ascending: true })
      .limit(20),

    supabase
      .from("table_reservations")
      .select("id, user_id, date, time, party_size, status")
      .eq("restaurant_id", venue.id)
      .lt("date", now)
      .order("date", { ascending: false })
      .limit(20),

    supabase
      .from("table_reservations")
      .select("id, user_id, date, time, party_size, notes, created_at")
      .eq("restaurant_id", venue.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  // Enrich with user profiles
  const allUserIds = [
    ...(upcomingRes.data ?? []).map(r => r.user_id),
    ...(pastRes.data ?? []).map(r => r.user_id),
    ...(pendingRes.data ?? []).map(r => r.user_id),
  ].filter(Boolean) as string[];

  const uniqueUserIds = [...new Set(allUserIds)];
  let profileMap: Record<string, { full_name: string | null; first_name: string | null }> = {};
  if (uniqueUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, first_name")
      .in("id", uniqueUserIds);
    profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]));
  }

  function guestName(userId: string | null) {
    if (!userId) return "Guest";
    const p = profileMap[userId];
    return (p?.full_name as string | null) ?? (p?.first_name as string | null) ?? "Guest";
  }

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const reviews = (venue.reviews as Array<{ author: string; text: string; rating: number }> | null) ?? [];
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return NextResponse.json({
    venue: {
      id: venue.id,
      name: venue.name,
      type: venue.restaurant_type ?? "",
      neighborhood: venue.neighborhood ?? "",
      city: venue.city ?? "",
      tagline: venue.tagline ?? "",
      about: venue.about ?? "",
      brand_color: (venue.brand_color as string | null) ?? "#FF1F7D",
      cover_url: venue.cover_url,
      instagram: venue.instagram,
      address: venue.address,
      bloom_notes: venue.bloom_notes ?? 0,
      avg_rating: Math.round(avgRating * 10) / 10,
      review_count: reviews.length,
      hours: (venue.hours as Record<string, string> | null) ?? null,
    },
    upcoming: (upcomingRes.data ?? []).map(r => ({
      id: r.id,
      guest: guestName(r.user_id),
      date: fmtDate(r.date),
      time: r.time,
      party_size: r.party_size,
      notes: r.notes,
    })),
    past: (pastRes.data ?? []).map(r => ({
      id: r.id,
      guest: guestName(r.user_id),
      date: fmtDate(r.date),
      time: r.time,
      party_size: r.party_size,
    })),
    pending_requests: (pendingRes.data ?? []).map(r => ({
      id: r.id,
      guest: guestName(r.user_id),
      date: fmtDate(r.date),
      time: r.time,
      party_size: r.party_size,
      notes: r.notes,
      requested_at: r.created_at,
    })),
    reviews: reviews.map(r => ({
      author: r.author,
      text: r.text,
      rating: r.rating,
    })),
    stats: {
      total_upcoming: (upcomingRes.data ?? []).length,
      total_past: (pastRes.data ?? []).length,
      pending_requests: (pendingRes.data ?? []).length,
      avg_rating: Math.round(avgRating * 10) / 10,
    },
  });
}
