import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logBehaviorSignal } from "@/lib/truth/behavior";

/** Upcoming gatherings for member feed (authenticated). */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ gatherings: [], source: "demo" });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("gatherings")
    .select(
      "id, slug, title, starts_at, area, venue, neighborhood, capacity, spots_left, club_slug, event_key, event_type, poster_variant, image_url, description, price_cents, host_name, table_size, deposit_cents, experience_fee_cents, venue_fee_cents, dress_code, rsvp_deadline"
    )
    .gte("starts_at", now)
    .not("event_type", "is", null)
    .order("starts_at", { ascending: true })
    .limit(40);

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({ gatherings: [], source: "demo" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ gatherings: data ?? [], source: "db" });
}

function slugify(title: string) {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)}-${Date.now().toString(36).slice(-4)}`;
}

/** Create an open seat / gathering (member-hosted). */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: {
    title?: string;
    startsAt?: string;
    area?: string;
    capacity?: number;
    clubSlug?: string;
    venue?: string;
    neighborhood?: string;
    eventKey?: string;
    eventType?: string;
    posterVariant?: string;
    imageUrl?: string;
    description?: string;
    priceCents?: number;
    hostName?: string;
    tableSize?: number;
    depositCents?: number;
    experienceFeeCents?: number;
    venueFeeCents?: number;
    dressCode?: string;
    rsvpDeadline?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const title = body.title?.trim();
  const startsAt = body.startsAt;
  if (!title || !startsAt) {
    return NextResponse.json({ ok: false, error: "title and startsAt required" }, { status: 400 });
  }

  const capacity = Math.min(50, Math.max(2, body.capacity ?? 8));
  const slug = slugify(title);
  const eventKey = body.eventKey?.trim() || null;

  const row = {
    slug,
    title,
    starts_at: startsAt,
    area: body.area ?? body.neighborhood ?? null,
    venue: body.venue ?? null,
    neighborhood: body.neighborhood ?? null,
    capacity,
    spots_left: capacity,
    club_slug: body.clubSlug ?? null,
    created_by: user.id,
    host_id: user.id,
    event_type: body.eventType?.trim() || "dinner",
    poster_variant: body.posterVariant?.trim() || null,
    image_url: body.imageUrl?.trim() || null,
    description: body.description?.trim() || null,
    price_cents: Math.max(0, body.priceCents ?? 0),
    host_name: body.hostName?.trim() || null,
    table_size: Math.min(20, Math.max(2, body.tableSize ?? 8)),
    deposit_cents: Math.max(0, body.depositCents ?? 0),
    experience_fee_cents: Math.max(0, body.experienceFeeCents ?? 0),
    venue_fee_cents: Math.max(0, body.venueFeeCents ?? 0),
    dress_code: body.dressCode?.trim() || null,
    rsvp_deadline: body.rsvpDeadline || null,
    ...(eventKey ? { event_key: eventKey } : {}),
  };

  let data;
  let error;

  if (eventKey) {
    const existing = await supabase
      .from("gatherings")
      .select("id")
      .eq("event_key", eventKey)
      .maybeSingle();
    if (existing.data?.id) {
      const upd = await supabase
        .from("gatherings")
        .update({
          title: row.title,
          starts_at: row.starts_at,
          area: row.area,
          venue: row.venue,
          neighborhood: row.neighborhood,
          capacity: row.capacity,
          club_slug: row.club_slug,
        })
        .eq("id", existing.data.id)
        .select("id, slug, title, starts_at, area, capacity, spots_left, club_slug, event_key")
        .single();
      data = upd.data;
      error = upd.error;
    } else {
      const ins = await supabase
        .from("gatherings")
        .insert(row)
        .select("id, slug, title, starts_at, area, capacity, spots_left, club_slug, event_key")
        .single();
      data = ins.data;
      error = ins.error;
    }
  } else {
    const ins = await supabase
      .from("gatherings")
      .insert(row)
      .select("id, slug, title, starts_at, area, capacity, spots_left, club_slug, event_key")
      .single();
    data = ins.data;
    error = ins.error;
  }

  if (error || !data) {
    if (error?.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/006_member_truth_layer.sql" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: error?.message ?? "Insert failed" }, { status: 400 });
  }

  await logBehaviorSignal(supabase, user.id, "seat_created", { gatheringId: data.id, title });

  return NextResponse.json({ ok: true, gathering: data });
}
