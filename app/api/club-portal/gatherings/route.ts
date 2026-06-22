// GET /api/club-portal/gatherings
// Returns upcoming + past gatherings for the club owner's club.
// POST /api/club-portal/gatherings – create a gathering

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: club } = await supabase.from("clubs").select("id").eq("owner_id", user.id).maybeSingle();
  if (!club) return NextResponse.json({ error: "No club" }, { status: 404 });

  const now = new Date().toISOString();

  const [upcomingRes, pastRes] = await Promise.all([
    supabase.from("gatherings")
      .select("id, title, starts_at, venue, neighborhood, capacity")
      .eq("club_id", club.id)
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(10),
    supabase.from("gatherings")
      .select("id, title, starts_at, venue, neighborhood, capacity")
      .eq("club_id", club.id)
      .lt("starts_at", now)
      .order("starts_at", { ascending: false })
      .limit(10),
  ]);

  function fmt(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return NextResponse.json({
    upcoming: (upcomingRes.data ?? []).map(g => ({
      id: g.id,
      title: g.title,
      date: fmt(g.starts_at),
      venue: g.venue ?? "",
      seats: g.capacity ?? 0,
    })),
    past: (pastRes.data ?? []).map(g => ({
      id: g.id,
      title: g.title,
      date: fmt(g.starts_at),
      venue: g.venue ?? "",
    })),
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: club } = await supabase.from("clubs").select("id").eq("owner_id", user.id).maybeSingle();
  if (!club) return NextResponse.json({ error: "No club" }, { status: 404 });

  const body = await req.json();
  const { title, starts_at, venue, neighborhood, capacity } = body as {
    title: string; starts_at: string; venue: string; neighborhood?: string; capacity?: number;
  };

  if (!title || !starts_at || !venue) {
    return NextResponse.json({ error: "title, starts_at, and venue are required" }, { status: 400 });
  }

  const { error } = await supabase.from("gatherings").insert({
    club_id: club.id,
    host_id: user.id,
    title,
    starts_at,
    venue,
    neighborhood: neighborhood ?? null,
    capacity: capacity ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
