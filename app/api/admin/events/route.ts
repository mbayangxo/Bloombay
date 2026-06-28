import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin, requireFounder } from "@/lib/admin/require-staff";
import { writeAdminAuditLog } from "@/lib/admin/audit-log";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// POST — create a curated event (manual or imported from Eventbrite)
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

  const body = await req.json() as {
    title: string;
    description?: string;
    starts_at: string;
    ends_at?: string;
    venue?: string;
    neighborhood?: string;
    city: string;
    image_url?: string;
    ticket_price_cents?: number;
    is_free?: boolean;
    external_url?: string;
    external_source?: string;
    max_attendees?: number;
    tags?: string[];
  };

  if (!body.title || !body.starts_at || !body.city) {
    return NextResponse.json({ error: "title, starts_at, city required" }, { status: 400 });
  }

  const db = admin();
  const { data, error } = await db.from("gatherings").insert({
    title:              body.title,
    description:        body.description ?? null,
    starts_at:          body.starts_at,
    ends_at:            body.ends_at ?? null,
    venue:              body.venue ?? null,
    neighborhood:       body.neighborhood ?? null,
    city:               body.city,
    image_url:          body.image_url ?? null,
    ticket_price_cents: body.ticket_price_cents ?? null,
    is_free:            body.is_free ?? !body.ticket_price_cents,
    external_url:       body.external_url ?? null,
    external_source:    body.external_source ?? "manual",
    max_attendees:      body.max_attendees ?? null,
    tags:               body.tags ?? [],
    status:             "published",
    curated_by_admin:   true,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const eventId = (data as { id: string }).id;
  await writeAdminAuditLog({
    actorId: guard.user.id,
    actorRole: guard.role,
    action: "event.create",
    resourceType: "gathering",
    resourceId: eventId,
    after: { title: body.title, city: body.city, starts_at: body.starts_at },
    req,
  });

  return NextResponse.json({ ok: true, id: eventId });
}

// DELETE — remove a curated event (founder-only destructive)
export async function DELETE(req: NextRequest) {
  const guard = await requireFounder(req);
  if (guard.error) return guard.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = admin();
  const { data: before } = await db
    .from("gatherings")
    .select("id, title, starts_at, city")
    .eq("id", id)
    .maybeSingle();

  const { error } = await db.from("gatherings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAdminAuditLog({
    actorId: guard.user.id,
    actorRole: guard.role,
    action: "event.delete",
    resourceType: "gathering",
    resourceId: id,
    before: before as Record<string, unknown> | null,
    req,
  });

  return NextResponse.json({ ok: true });
}

// GET — list all curated events
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;
  const db = admin();
  const { data, error } = await db
    .from("gatherings")
    .select("id, title, starts_at, city, venue, is_free, ticket_price_cents, external_source, status, curated_by_admin")
    .order("starts_at", { ascending: true })
    .limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
