import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { createMembership, chargeTicket, chargeClubMembership } from "@/lib/payments";
import { createAdminClient } from "@/lib/supabase/admin";
import { betaPaymentsDisabledResponse, isBetaPaymentsDisabled } from "@/lib/payments/beta-guard";

type MembershipBody = { type: "membership"; plan: "monthly" | "biannual" | "annual" };
type TicketBody    = { type: "ticket"; eventId: string; quantity?: number };
type ClubBody      = { type: "club"; clubId: string };
type RequestBody   = MembershipBody | TicketBody | ClubBody;

export async function POST(req: NextRequest) {
  if (isBetaPaymentsDisabled()) return betaPaymentsDisabledResponse();

  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: RequestBody = await req.json();
  const db = createAdminClient();

  // ── Platform membership ──────────────────────────────────────────────────────
  if (body.type === "membership") {
    const { plan } = body;
    if (!plan) return NextResponse.json({ error: "plan required" }, { status: 400 });

    const { data: order, error: orderErr } = await db
      .from("pending_orders")
      .insert({ user_id: user.id, type: "membership", amount_cents: 0, currency: "usd" })
      .select("id")
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: "Could not create order" }, { status: 500 });
    }

    const { url } = await createMembership({ plan, userId: user.id, userEmail: user.email ?? "", pendingOrderId: order.id });

    await db.from("payment_audit_logs").insert({
      pending_order_id: order.id,
      user_id: user.id,
      event_type: "checkout_created",
      meta: { plan, type: "membership" },
    });

    return NextResponse.json({ url });
  }

  // ── Event ticket ─────────────────────────────────────────────────────────────
  if (body.type === "ticket") {
    const { eventId, quantity = 1 } = body;
    if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

    // Fetch event server-side — never trust client-sent price or name
    const { data: event, error: eventErr } = await db
      .from("gatherings")
      .select("id, title, ticket_price_cents, is_free, currency, capacity, spots_left, is_published")
      .eq("id", eventId)
      .single();

    if (eventErr || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (!event.is_published) {
      return NextResponse.json({ error: "Event is not available" }, { status: 400 });
    }
    if (event.is_free || !event.ticket_price_cents || event.ticket_price_cents <= 0) {
      return NextResponse.json({ error: "Event has no ticket price" }, { status: 400 });
    }
    if (event.spots_left !== null && event.spots_left < quantity) {
      return NextResponse.json({ error: "Not enough spots remaining" }, { status: 409 });
    }

    // Reject if user already has a confirmed ticket for this event
    const { data: existing } = await db
      .from("tickets")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", user.id)
      .eq("status", "confirmed")
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "You already have a ticket for this event" }, { status: 409 });
    }

    const totalCents = event.ticket_price_cents * quantity;
    const currency = event.currency ?? "usd";

    const { data: order, error: orderErr } = await db
      .from("pending_orders")
      .insert({
        user_id: user.id,
        type: "ticket",
        event_id: eventId,
        amount_cents: totalCents,
        currency,
      })
      .select("id")
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: "Could not create order" }, { status: 500 });
    }

    const { url, sessionId } = await chargeTicket({
      eventId: event.id,
      eventName: event.title,
      amountCents: event.ticket_price_cents,
      currency,
      quantity,
      userId: user.id,
      userEmail: user.email ?? "",
      pendingOrderId: order.id,
    });

    await Promise.all([
      db.from("pending_orders").update({ stripe_session_id: sessionId }).eq("id", order.id),
      db.from("payment_audit_logs").insert({
        pending_order_id: order.id,
        user_id: user.id,
        event_type: "checkout_created",
        stripe_session_id: sessionId,
        amount_cents: totalCents,
        currency,
        meta: { event_id: eventId, quantity, type: "ticket" },
      }),
    ]);

    return NextResponse.json({ url });
  }

  // ── Club membership ──────────────────────────────────────────────────────────
  if (body.type === "club") {
    const { clubId } = body;
    if (!clubId) return NextResponse.json({ error: "clubId required" }, { status: 400 });

    const { data: club, error: clubErr } = await db
      .from("clubs")
      .select("id, slug, name, price_cents, is_paid")
      .eq("id", clubId)
      .single();

    if (clubErr || !club) return NextResponse.json({ error: "Club not found" }, { status: 404 });
    if (!club.is_paid) return NextResponse.json({ error: "Club is free" }, { status: 400 });
    if (!club.price_cents || club.price_cents <= 0) {
      return NextResponse.json({ error: "Club has no price configured" }, { status: 400 });
    }

    const currency = (process.env.STRIPE_CURRENCY ?? "usd").toLowerCase();

    const { data: order, error: orderErr } = await db
      .from("pending_orders")
      .insert({
        user_id: user.id,
        type: "club",
        club_id: clubId,
        amount_cents: club.price_cents,
        currency,
      })
      .select("id")
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: "Could not create order" }, { status: 500 });
    }

    const { url, sessionId } = await chargeClubMembership({
      clubId: club.id,
      clubSlug: club.slug,
      clubName: club.name,
      priceCents: club.price_cents,
      currency,
      userId: user.id,
      userEmail: user.email ?? "",
      pendingOrderId: order.id,
    });

    await Promise.all([
      db.from("pending_orders").update({ stripe_session_id: sessionId }).eq("id", order.id),
      db.from("payment_audit_logs").insert({
        pending_order_id: order.id,
        user_id: user.id,
        event_type: "checkout_created",
        stripe_session_id: sessionId,
        amount_cents: club.price_cents,
        currency,
        meta: { club_id: clubId, club_slug: club.slug, type: "club" },
      }),
    ]);

    return NextResponse.json({ url });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
