import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results: {
    id: string;
    type: "gathering" | "event";
    title: string;
    venue: string | null;
    starts_at: string;
    confirmation_code: string;
    confirmed_at: string | null;
  }[] = [];

  // 1. Gatherings with seat_reservations
  const { data: reservations } = await supabase
    .from("seat_reservations")
    .select("id, created_at, gathering_id, gatherings(id, title, starts_at, area, venue)")
    .eq("user_id", user.id)
    .eq("status", "reserved")
    .order("created_at", { ascending: false })
    .limit(10);

  for (const r of reservations ?? []) {
    const g = Array.isArray(r.gatherings) ? r.gatherings[0] : r.gatherings;
    if (!g) continue;
    results.push({
      id: g.id,
      type: "gathering",
      title: g.title,
      venue: g.venue ?? g.area ?? null,
      starts_at: g.starts_at,
      confirmation_code: `BB-${r.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`,
      confirmed_at: r.created_at,
    });
  }

  // 2. Events with gathering_attendance
  const { data: attendances } = await supabase
    .from("gathering_attendance")
    .select("id, checked_in_at, gathering_id, events(id, title, venue, neighborhood, date_time)")
    .eq("user_id", user.id)
    .order("checked_in_at", { ascending: false })
    .limit(10);

  for (const a of attendances ?? []) {
    const e = Array.isArray(a.events) ? a.events[0] : a.events;
    if (!e) continue;
    results.push({
      id: e.id,
      type: "event",
      title: e.title,
      venue: e.venue ?? e.neighborhood ?? null,
      starts_at: e.date_time,
      confirmation_code: `BB-${a.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`,
      confirmed_at: a.checked_in_at,
    });
  }

  // Sort by confirmed_at desc
  results.sort((a, b) => new Date(b.confirmed_at ?? 0).getTime() - new Date(a.confirmed_at ?? 0).getTime());

  return NextResponse.json({ confirmations: results.slice(0, 8) });
}
