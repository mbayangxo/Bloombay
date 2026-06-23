import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  // Get all club slugs the user is a member of
  const { data: memberships, error: memberError } = await supabase
    .from("club_memberships")
    .select("club_slug")
    .eq("user_id", user.id);

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  const clubSlugs = (memberships ?? []).map((m) => m.club_slug as string).filter(Boolean);

  if (clubSlugs.length === 0) {
    return NextResponse.json({ events: [] });
  }

  // Fetch upcoming gatherings for those clubs (next 90 days)
  const now = new Date();
  const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const { data: gatherings, error: gatherError } = await supabase
    .from("gatherings")
    .select(
      "id, slug, title, starts_at, area, venue, club_slug, capacity, spots_left, is_recurring, recurrence_type, description, event_type"
    )
    .in("club_slug", clubSlugs)
    .gte("starts_at", now.toISOString())
    .lte("starts_at", in90Days.toISOString())
    .order("starts_at", { ascending: true });

  if (gatherError) {
    return NextResponse.json({ error: gatherError.message }, { status: 500 });
  }

  if (!gatherings || gatherings.length === 0) {
    return NextResponse.json({ events: [] });
  }

  const gatheringIds = gatherings.map((g) => g.id as string);

  // Fetch user's seat_reservations for these gatherings
  const { data: reservations } = await supabase
    .from("seat_reservations")
    .select("gathering_id, status")
    .eq("user_id", user.id)
    .in("gathering_id", gatheringIds);

  const rsvpdSet = new Set(
    (reservations ?? [])
      .filter((r) => r.status === "reserved")
      .map((r) => r.gathering_id as string)
  );

  // Fetch user's permanent RSVPs
  const { data: permanentRsvps } = await supabase
    .from("gathering_permanent_rsvp")
    .select("gathering_id")
    .eq("user_id", user.id)
    .in("gathering_id", gatheringIds);

  const permanentSet = new Set(
    (permanentRsvps ?? []).map((p) => p.gathering_id as string)
  );

  // Fetch club details (name, primary_color) for these slugs
  const { data: clubs } = await supabase
    .from("clubs")
    .select("slug, name, primary_color")
    .in("slug", clubSlugs);

  const clubMap = new Map<string, { name: string; primary_color: string }>();
  for (const club of clubs ?? []) {
    clubMap.set(club.slug as string, {
      name: club.name as string,
      primary_color: (club.primary_color as string) ?? "#FF1F7D",
    });
  }

  const events = gatherings.map((g) => {
    const clubInfo = clubMap.get(g.club_slug as string);
    return {
      id: g.id as string,
      slug: g.slug as string,
      title: g.title as string,
      starts_at: g.starts_at as string,
      area: g.area as string | null,
      venue: (g.venue as string | null) ?? null,
      club_slug: g.club_slug as string,
      club_name: clubInfo?.name ?? g.club_slug,
      club_color: clubInfo?.primary_color ?? "#FF1F7D",
      is_recurring: (g.is_recurring as boolean | null) ?? false,
      recurrence_type: (g.recurrence_type as string | null) ?? null,
      description: (g.description as string | null) ?? null,
      event_type: (g.event_type as string | null) ?? null,
      is_rsvpd: rsvpdSet.has(g.id as string),
      is_permanent: permanentSet.has(g.id as string),
      spots_left: g.spots_left as number | null,
    };
  });

  return NextResponse.json({ events });
}
