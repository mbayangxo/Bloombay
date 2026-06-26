import { NextResponse } from "next/server";
import { getMemberPhone } from "@/lib/irl/member-phone";
import { createNotificationEvent } from "@/lib/notifications/notification-service";
import { createClient } from "@/lib/supabase/server";
import { isBlocked } from "@/lib/auth/block-check";
import { logBehaviorSignal } from "@/lib/truth/behavior";
import { resolveGatheringId } from "@/lib/truth/resolve-gathering";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: { gatheringId?: string; slug?: string; eventKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const resolved = await resolveGatheringId(supabase, body);
  if (!resolved) {
    return NextResponse.json({ ok: false, error: "Gathering not found" }, { status: 404 });
  }

  const gatheringId = resolved.id;

  const { data: gatheringMeta } = await supabase
    .from("gatherings")
    .select("spots_left, host_id, created_by")
    .eq("id", gatheringId)
    .maybeSingle();

  const hostId = (gatheringMeta?.host_id ?? gatheringMeta?.created_by) as string | null;
  if (hostId && hostId !== user.id && await isBlocked(supabase, user.id, hostId)) {
    return NextResponse.json({ ok: false, error: "Cannot reserve this event" }, { status: 403 });
  }

  const { data: capRow } = gatheringMeta
    ? { data: { spots_left: gatheringMeta.spots_left } }
    : await supabase
      .from("gatherings")
      .select("spots_left")
      .eq("id", gatheringId)
      .maybeSingle();
  if (capRow && (capRow.spots_left as number) <= 0) {
    return NextResponse.json({ ok: false, error: "No seats left" }, { status: 409 });
  }

  const { data: existing } = await supabase
    .from("seat_reservations")
    .select("id")
    .eq("gathering_id", gatheringId)
    .eq("user_id", user.id)
    .eq("status", "reserved")
    .maybeSingle();

  if (existing) {
    const { data: gathering } = await supabase
      .from("gatherings")
      .select("id, slug, title, starts_at, area, capacity, spots_left, club_slug")
      .eq("id", gatheringId)
      .single();
    return NextResponse.json({ ok: true, gathering, alreadyReserved: true });
  }

  const phone = await getMemberPhone(supabase, user.id, user.phone);

  const reservationRow: Record<string, unknown> = {
    gathering_id: gatheringId,
    user_id: user.id,
    status: "reserved",
  };
  if (phone) reservationRow.phone = phone;

  let { error: insertErr } = await supabase.from("seat_reservations").insert(reservationRow);

  if (insertErr?.message.includes("'phone' column")) {
    ({ error: insertErr } = await supabase.from("seat_reservations").insert({
      gathering_id: gatheringId,
      user_id: user.id,
      status: "reserved",
    }));
  }

  if (insertErr) {
    if (insertErr.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/003_irl_core.sql first" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: insertErr.message }, { status: 400 });
  }

  const { data: gathering, error: fetchErr } = await supabase
    .from("gatherings")
    .select("id, slug, title, starts_at, area, capacity, spots_left, club_slug")
    .eq("id", gatheringId)
    .single();

  if (fetchErr) {
    return NextResponse.json({ ok: false, error: fetchErr.message }, { status: 500 });
  }

  await logBehaviorSignal(supabase, user.id, "rsvp_reserved", {
    gatheringId,
    slug: resolved.slug,
    eventKey: body.eventKey ?? null,
  });

  const startsAt = gathering.starts_at as string | undefined;
  const whenLabel = startsAt
    ? new Date(startsAt).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : undefined;

  void createNotificationEvent({
    userId: user.id,
    type: "ticket_confirmed",
    channels: ["in_app"],
    payload: {
      title: `You're going to ${gathering.title as string}!`,
      templateVars: {
        eventTitle: gathering.title as string,
        date: whenLabel ?? "TBD",
        place: (gathering.area as string) ?? "",
      },
      link: `/member/happenings`,
    },
  });

  return NextResponse.json({ ok: true, gathering });
}
