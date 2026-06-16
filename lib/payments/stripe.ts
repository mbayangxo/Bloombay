import Stripe from "stripe";
import type {
  CheckoutResult,
  PaymentResult,
  MembershipParams,
  ClubMembershipParams,
  TicketParams,
} from "./types";

// Lazily initialised so the module can be imported without STRIPE_SECRET_KEY
// being set at build time.
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

function baseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

// ── Platform membership (Stripe Billing subscription) ─────────────────────────

export async function stripeMembershipCheckout(
  params: MembershipParams
): Promise<CheckoutResult> {
  const priceId =
    params.plan === "monthly"
      ? process.env.STRIPE_PRICE_MONTHLY
      : params.plan === "biannual"
      ? process.env.STRIPE_PRICE_BIANNUAL
      : process.env.STRIPE_PRICE_ANNUAL;

  if (!priceId) {
    throw new Error(`STRIPE_PRICE_${params.plan.toUpperCase()} is not set`);
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer_email: params.userEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      user_id: params.userId,
      type: "platform_membership",
    },
    success_url: `${baseUrl()}/member/thank-you?type=membership`,
    cancel_url: `${baseUrl()}/join?cancelled=true`,
  });

  return { url: session.url!, sessionId: session.id };
}

// ── Event ticket (one-time payment) ───────────────────────────────────────────

export async function stripeTicketCheckout(
  params: TicketParams
): Promise<CheckoutResult> {
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: params.userEmail,
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: params.amountCents,
          product_data: { name: params.eventName },
        },
        quantity: params.quantity ?? 1,
      },
    ],
    metadata: {
      user_id: params.userId,
      event_id: params.eventId,
      type: "event_ticket",
    },
    success_url: `${baseUrl()}/member/thank-you?type=ticket&name=${encodeURIComponent(params.eventName)}&back=${encodeURIComponent('/member/happenings/' + params.eventId)}`,
    cancel_url: `${baseUrl()}/member/happenings/${params.eventId}`,
  });

  return { url: session.url!, sessionId: session.id };
}

// ── Club membership (one-time payment, migrated from Whop) ────────────────────

export async function stripeClubCheckout(
  params: ClubMembershipParams
): Promise<CheckoutResult> {
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: params.userEmail,
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: params.priceCents,
          product_data: { name: `${params.clubName} — Club Membership` },
        },
        quantity: 1,
      },
    ],
    metadata: {
      user_id: params.userId,
      club_id: params.clubId,
      type: "club_membership",
    },
    success_url: `${baseUrl()}/member/thank-you?type=club&name=${encodeURIComponent(params.clubName)}&back=${encodeURIComponent('/member/clubs/' + params.clubId)}`,
    cancel_url: `${baseUrl()}/member/clubs/${params.clubId}`,
  });

  return { url: session.url!, sessionId: session.id };
}

// ── Refund ─────────────────────────────────────────────────────────────────────

export async function stripeRefund(
  paymentIntentId: string
): Promise<PaymentResult> {
  const refund = await getStripe().refunds.create({
    payment_intent: paymentIntentId,
  });

  return {
    success: refund.status === "succeeded",
    transactionId: refund.id,
  };
}

// ── Export raw client for webhook signature verification ──────────────────────

export { getStripe };
