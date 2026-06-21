import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { ClubCalendarView } from "@/app/components/portal/club-calendar-view";

export default async function ClubCalendarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getAuthUser();
  if (!user) redirect("/member/login");

  const supabase = await createClient();

  // Support both UUID and slug
  const isUuid = /^[0-9a-f-]{36}$/i.test(id);
  const baseQuery = supabase
    .from("clubs")
    .select("id, slug, name, primary_color");

  const { data: club, error: clubError } = isUuid
    ? await baseQuery.eq("id", id).single()
    : await baseQuery.eq("slug", id).single();

  if (clubError || !club) notFound();

  const clubSlug = (club.slug as string | null) ?? id;
  const primaryColor = (club.primary_color as string | null) ?? "#FF1F7D";

  // Fetch upcoming gatherings for this club (next 3 months)
  const now = new Date();
  const in3Months = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const { data: gatherings } = await supabase
    .from("gatherings")
    .select(
      "id, slug, title, starts_at, area, venue, club_slug, spots_left, is_recurring, recurrence_type"
    )
    .eq("club_slug", clubSlug)
    .gte("starts_at", now.toISOString())
    .lte("starts_at", in3Months.toISOString())
    .order("starts_at", { ascending: true });

  const gatheringIds = (gatherings ?? []).map((g) => g.id as string);

  // Fetch RSVP and permanent status for user
  const [{ data: reservations }, { data: permanentRsvps }] = await Promise.all([
    gatheringIds.length > 0
      ? supabase
          .from("seat_reservations")
          .select("gathering_id, status")
          .eq("user_id", user.id)
          .in("gathering_id", gatheringIds)
      : Promise.resolve({ data: [] }),
    gatheringIds.length > 0
      ? supabase
          .from("gathering_permanent_rsvp")
          .select("gathering_id")
          .eq("user_id", user.id)
          .in("gathering_id", gatheringIds)
      : Promise.resolve({ data: [] }),
  ]);

  const rsvpdSet = new Set(
    (reservations ?? [])
      .filter((r) => r.status === "reserved")
      .map((r) => r.gathering_id as string)
  );
  const permanentSet = new Set(
    (permanentRsvps ?? []).map((p) => p.gathering_id as string)
  );

  const events = (gatherings ?? []).map((g) => ({
    id: g.id as string,
    slug: (g.slug as string | null) ?? "",
    title: g.title as string,
    starts_at: g.starts_at as string,
    area: (g.area as string | null) ?? null,
    venue: (g.venue as string | null) ?? null,
    club_slug: g.club_slug as string,
    is_recurring: (g.is_recurring as boolean | null) ?? false,
    recurrence_type: (g.recurrence_type as string | null) ?? null,
    spots_left: (g.spots_left as number | null) ?? null,
    is_rsvpd: rsvpdSet.has(g.id as string),
    is_permanent: permanentSet.has(g.id as string),
  }));

  return (
    <ClubCalendarView
      club={{
        id: club.id as string,
        slug: clubSlug,
        name: club.name as string,
        primary_color: primaryColor,
      }}
      initialEvents={events}
    />
  );
}
