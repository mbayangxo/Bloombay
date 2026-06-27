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
    .select("id, title, starts_at, area, venue, slug, club_slug, capacity, spots_left")
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

    const capacity = (gathering.capacity as number) ?? 0;
    const spotsLeft = (gathering.spots_left as number) ?? capacity;
    const attendeeCount = Math.max(0, capacity - spotsLeft);

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

  return NextResponse.json({ error: "Event not found" }, { status: 404 });
}
