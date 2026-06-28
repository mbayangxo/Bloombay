import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/payments/stripe";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Admin/founder only
  const db = createAdminClient();
  const { data: profile } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "founder"].includes(profile.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: { orderId: string; reason?: string } = await req.json();
  const { orderId, reason } = body;

  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  // Fetch the pending order
  const { data: order, error: orderErr } = await db
    .from("pending_orders")
    .select("id, user_id, type, event_id, club_id, amount_cents, currency, stripe_session_id, status")
    .eq("id", orderId)
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status !== "paid") {
    return NextResponse.json({ error: "Order is not in paid status" }, { status: 400 });
  }

  // Resolve the Stripe PaymentIntent from the Checkout Session
  if (!order.stripe_session_id) {
    return NextResponse.json({ error: "No Stripe session on record" }, { status: 400 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;

  if (!paymentIntentId) {
    return NextResponse.json({ error: "No PaymentIntent found for this session" }, { status: 400 });
  }

  // Validate reason
  const validReasons = ["duplicate", "fraudulent", "requested_by_customer"] as const;
  type StripeReason = typeof validReasons[number];
  const stripeReason: StripeReason | undefined = validReasons.includes(reason as StripeReason)
    ? (reason as StripeReason)
    : undefined;

  // Issue refund
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    ...(stripeReason ? { reason: stripeReason } : {}),
  });

  if (refund.status !== "succeeded" && refund.status !== "pending") {
    return NextResponse.json({ error: "Refund failed", status: refund.status }, { status: 500 });
  }

  // Update order and ticket status
  await Promise.all([
    db
      .from("pending_orders")
      .update({ status: "refunded", updated_at: new Date().toISOString() })
      .eq("id", orderId),

    order.event_id
      ? db
          .from("tickets")
          .update({ status: "refunded" })
          .eq("pending_order_id", orderId)
      : Promise.resolve(),

    db.from("payment_audit_logs").insert({
      pending_order_id: orderId,
      user_id: order.user_id,
      actor_id: user.id,
      event_type: "refund_initiated",
      stripe_session_id: order.stripe_session_id,
      stripe_payment_intent: paymentIntentId,
      amount_cents: order.amount_cents,
      currency: order.currency,
      reason: reason ?? null,
      meta: { refund_id: refund.id, refund_status: refund.status },
    }),
  ]);

  return NextResponse.json({ ok: true, refundId: refund.id, status: refund.status });
}
