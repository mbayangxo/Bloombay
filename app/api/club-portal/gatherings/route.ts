import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function slugify(title: string): string {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)}-${Date.now().toString(36).slice(-4)}`;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mapGathering(g: Record<string, unknown>) {
  return {
    id: g.id as string,
    slug: (g.slug as string | null) ?? "",
    title: g.title as string,
    date: fmt(g.starts_at as string),
    starts_at: g.starts_at as string,
    venue: (g.venue as string | null) ?? "",
    neighborhood: (g.neighborhood as string | null) ?? "",
    seats: (g.capacity as number | null) ?? 0,
    capacity: (g.capacity as number | null) ?? 0,
    publish_status: (g.publish_status as string | null) ?? "draft",
    event_type: (g.event_type as string | null) ?? null,
  };
}

async function ownedClub(userId: string) {
  const supabase = admin();
  const { data: club } = await supabase
    .from("clubs")
    .select("id, slug, name")
    .eq("owner_id", userId)
    .maybeSingle();
  return club;
}

// GET /api/club-portal/gatherings
export async function GET() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const club = await ownedClub(user.id);
  if (!club) return NextResponse.json({ error: "No club" }, { status: 404 });

  const now = new Date().toISOString();
  const db = admin();

  const [upcomingRes, pastRes] = await Promise.all([
    db
      .from("gatherings")
      .select(
        "id, slug, title, starts_at, venue, neighborhood, capacity, publish_status, event_type",
      )
      .eq("club_slug", club.slug)
      .gte("starts_at", now)
      .neq("publish_status", "cancelled")
      .order("starts_at", { ascending: true })
      .limit(20),
    db
      .from("gatherings")
      .select("id, title, starts_at, venue, neighborhood, capacity")
      .eq("club_slug", club.slug)
      .lt("starts_at", now)
      .order("starts_at", { ascending: false })
      .limit(10),
  ]);

  return NextResponse.json({
    upcoming: (upcomingRes.data ?? []).map(mapGathering),
    past: (pastRes.data ?? []).map((g) => ({
      id: g.id,
      title: g.title,
      date: fmt(g.starts_at),
      venue: g.venue ?? "",
    })),
  });
}

// POST /api/club-portal/gatherings — create draft gathering
export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const club = await ownedClub(user.id);
  if (!club) return NextResponse.json({ error: "No club" }, { status: 404 });

  const body = await req.json();
  const { title, starts_at, venue, neighborhood, capacity } = body as {
    title: string;
    starts_at: string;
    venue: string;
    neighborhood?: string;
    capacity?: number;
  };

  if (!title?.trim() || !starts_at || !venue?.trim()) {
    return NextResponse.json(
      { error: "title, starts_at, and venue are required" },
      { status: 400 },
    );
  }

  const parsed = new Date(starts_at);
  if (Number.isNaN(parsed.getTime())) {
    return NextResponse.json({ error: "starts_at must be a valid date" }, { status: 400 });
  }

  const cap = Math.min(200, Math.max(2, capacity ?? 40));
  const slug = slugify(title.trim());
  const db = admin();

  const row: Record<string, unknown> = {
    club_slug: club.slug,
    created_by: user.id,
    creator_user_id: user.id,
    title: title.trim(),
    starts_at: parsed.toISOString(),
    venue: venue.trim(),
    neighborhood: neighborhood?.trim() ?? null,
    capacity: cap,
    spots_left: cap,
    slug,
    publish_status: "draft",
    area: neighborhood?.trim() ?? null,
  };

  const { data, error } = await db
    .from("gatherings")
    .insert(row)
    .select("id, title, starts_at, venue, neighborhood, capacity, publish_status")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("gathering_audit_log").insert({
    gathering_id: data.id,
    user_id: user.id,
    action: "gathering_created",
    meta: { club_slug: club.slug, publish_status: "draft" },
  });

  return NextResponse.json({ ok: true, gathering: mapGathering(data as Record<string, unknown>) });
}
