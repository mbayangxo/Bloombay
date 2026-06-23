import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Try gatherings first (IRL events with seat reservations)
  const { data: gathering } = await supabase
    .from("gatherings")
    .select("id, title, starts_at, area, venue, slug, club_slug")
    .eq("id", id)
    .maybeSingle();

  if (gathering) {
    const { data: reservation } = await supabase
      .from("seat_reservations")
      .select("id, status, created_at")
      .eq("gathering_id", id)
      .eq("user_id", user.id)
      .eq("status", "reserved")
      .maybeSingle();

    const { count: attendeeCount } = await supabase
      .from("seat_reservations")
      .select("id", { count: "exact", head: true })
      .eq("gathering_id", id)
      .eq("status", "reserved");

    const confirmationCode = reservation
      ? `BB-${reservation.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`
      : null;

    return NextResponse.json({
      type: "gathering",
      confirmed: !!reservation,
      event: {
        id: gathering.id,
        title: gathering.title,
        venue: gathering.venue ?? gathering.area ?? null,
        starts_at: gathering.starts_at,
        slug: gathering.slug,
        poster: null,
      },
      confirmation_code: confirmationCode,
      reservation_id: reservation?.id ?? null,
      confirmed_at: reservation?.created_at ?? null,
      attendee_count: attendeeCount ?? 0,
    });
  }

  // Fall back to events table
  const { data: event } = await supabase
    .from("events")
    .select("id, title, venue, neighborhood, date_time, photo_url, accent_color")
    .eq("id", id)
    .maybeSingle();

  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  // Check if user is attending
  const { data: attendance } = await supabase
    .from("gathering_attendance")
    .select("id, checked_in_at")
    .eq("gathering_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  const confirmationCode = attendance
    ? `BB-${attendance.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`
    : `BB-${user.id.replace(/-/g, "").slice(0, 4).toUpperCase()}-${id.replace(/-/g, "").slice(0, 4).toUpperCase()}`;

  return NextResponse.json({
    type: "event",
    confirmed: true,
    event: {
      id: event.id,
      title: event.title,
      venue: event.venue ?? event.neighborhood ?? null,
      starts_at: event.date_time,
      slug: null,
      poster: event.photo_url ?? null,
      accent: event.accent_color ?? "#FF1F7D",
    },
    confirmation_code: confirmationCode,
    reservation_id: attendance?.id ?? null,
    confirmed_at: attendance?.checked_in_at ?? null,
    attendee_count: 0,
  });
}
