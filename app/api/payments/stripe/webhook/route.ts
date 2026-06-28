import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Signature verification failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // All webhook DB writes use the service-role client — Stripe events are
  // system events, not a logged-in user session.
  const db = createAdminClient();

  switch (event.type) {

    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata ?? {};
      const type = meta.type;
      const pendingOrderId = meta.pending_order_id ?? null;

      // ── Idempotency: skip if this session was already processed ──────────────
      if (pendingOrderId) {
        const { data: existing } = await db
          .from("pending_orders")
          .select("status")
          .eq("id", pendingOrderId)
          .single();

        if (existing?.status === "paid") {
          return NextResponse.json({ received: true });
        }
      }

      if (type === "platform_membership") {
        await db
          .from("profiles")
          .update({
            is_member: true,
            membership_started_at: new Date().toISOString(),
            membership_type: "platform",
          })
          .eq("id", meta.user_id);

        await db.from("notifications").insert({
          user_id: meta.user_id,
          type: "membership_confirmed",
          title: "Welcome to BloomBay!",
          body: "Your membership is confirmed. The Avenue is yours.",
          link: "/member/avenue",
        });

        if (pendingOrderId) {
          await db
            .from("pending_orders")
            .update({ status: "paid", stripe_session_id: session.id, updated_at: new Date().toISOString() })
            .eq("id", pendingOrderId);
        }

        await db.from("payment_audit_logs").insert({
          pending_order_id: pendingOrderId,
          user_id: meta.user_id,
          event_type: "payment_completed",
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
          amount_cents: session.amount_total ?? 0,
          currency: session.currency ?? "usd",
          meta: { type: "platform_membership" },
        });
      }

      if (type === "event_ticket") {
        await db.from("tickets").upsert(
          {
            user_id: meta.user_id,
            event_id: meta.event_id,
            pending_order_id: pendingOrderId,
            stripe_session_id: session.id,
            amount_paid: session.amount_total ?? 0,
            currency: session.currency ?? "usd",
            status: "confirmed",
            purchased_at: new Date().toISOString(),
          },
          { onConflict: "stripe_session_id", ignoreDuplicates: true }
        );

        await db.from("notifications").insert({
          user_id: meta.user_id,
          type: "ticket_confirmed",
          title: "You're going!",
          body: "Your ticket is confirmed.",
          link: `/member/happenings/${meta.event_id}`,
          data: { event_id: meta.event_id },
        });

        if (pendingOrderId) {
          await db
            .from("pending_orders")
            .update({ status: "paid", stripe_session_id: session.id, updated_at: new Date().toISOString() })
            .eq("id", pendingOrderId);
        }

        await db.from("payment_audit_logs").insert({
          pending_order_id: pendingOrderId,
          user_id: meta.user_id,
          event_type: "payment_completed",
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
          amount_cents: session.amount_total ?? 0,
          currency: session.currency ?? "usd",
          meta: { type: "event_ticket", event_id: meta.event_id },
        });
      }

      if (type === "club_membership") {
        const clubSlug = meta.club_slug ?? meta.club_id;

        await db.from("club_memberships").upsert(
          {
            user_id: meta.user_id,
            club_slug: clubSlug,
            club_id: meta.club_id,
            joined_at: new Date().toISOString(),
          },
          { onConflict: "user_id,club_slug" }
        );

        await db
          .from("club_applications")
          .update({ status: "accepted" })
          .eq("club_id", meta.club_id)
          .eq("user_id", meta.user_id)
          .eq("status", "pending");

        await db.from("notifications").insert({
          user_id: meta.user_id,
          type: "club_accepted",
          title: "Payment confirmed — you're in!",
          body: "Your membership was confirmed. Welcome.",
          link: `/member/clubs/${clubSlug}`,
          data: { club_id: meta.club_id },
        });

        if (pendingOrderId) {
          await db
            .from("pending_orders")
            .update({ status: "paid", stripe_session_id: session.id, updated_at: new Date().toISOString() })
            .eq("id", pendingOrderId);
        }

        await db.from("payment_audit_logs").insert({
          pending_order_id: pendingOrderId,
          user_id: meta.user_id,
          event_type: "payment_completed",
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
          amount_cents: session.amount_total ?? 0,
          currency: session.currency ?? "usd",
          meta: { type: "club_membership", club_id: meta.club_id, club_slug: clubSlug },
        });
      }

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const pendingOrderId = session.metadata?.pending_order_id ?? null;
      if (pendingOrderId) {
        await db
          .from("pending_orders")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("id", pendingOrderId)
          .eq("status", "pending");
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const subMeta = sub.metadata ?? {};
      if (subMeta.user_id) {
        await db
          .from("profiles")
          .update({ is_member: false, membership_type: null })
          .eq("id", subMeta.user_id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
