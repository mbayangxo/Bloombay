/**
 * BloomBay Payments Service
 *
 * All payment operations go through this file. The provider behind each
 * function can be swapped without touching call sites.
 *
 * Phase 1 (now)   — Stripe for all new transactions
 * Phase 2         — Stripe Connect for payHost / paySeller
 * Phase 3         — Evaluate Adyen at significant GMV
 */
import {
  stripeMembershipCheckout,
  stripeTicketCheckout,
  stripeClubCheckout,
  stripeRefund,
} from "./stripe";

import type {
  CheckoutResult,
  PaymentResult,
  MembershipParams,
  ClubMembershipParams,
  TicketParams,
  HostPayoutParams,
  SellerPayoutParams,
} from "./types";

export type { CheckoutResult, PaymentResult };

// ── Platform membership subscription ─────────────────────────────────────────

export async function createMembership(
  params: MembershipParams
): Promise<CheckoutResult> {
  return stripeMembershipCheckout(params);
}

// ── Paid club membership ──────────────────────────────────────────────────────

export async function chargeClubMembership(
  params: ClubMembershipParams
): Promise<CheckoutResult> {
  return stripeClubCheckout(params);
}

// ── Event ticket ──────────────────────────────────────────────────────────────

export async function chargeTicket(
  params: TicketParams
): Promise<CheckoutResult> {
  return stripeTicketCheckout(params);
}

// ── Ticket refund ─────────────────────────────────────────────────────────────

export async function refundTicket(
  paymentIntentId: string
): Promise<PaymentResult> {
  return stripeRefund(paymentIntentId);
}

// ── Host payout (Phase 2 — requires Stripe Connect) ──────────────────────────

export async function payHost(params: HostPayoutParams): Promise<PaymentResult> {
  // TODO Phase 2: onboard host via Stripe Connect (Express account), then:
  //   await stripe.transfers.create({
  //     amount: params.amountCents,
  //     currency: params.currency ?? "gbp",
  //     destination: connectedAccountId,
  //     description: params.description,
  //   });
  void params;
  throw new Error(
    "payHost is not yet implemented. Host payouts require Stripe Connect onboarding."
  );
}

// ── Seller payout (Phase 3 — requires Stripe Connect) ────────────────────────

export async function paySeller(
  params: SellerPayoutParams
): Promise<PaymentResult> {
  // TODO Phase 3: same as payHost but for Shop sellers.
  //   BloomBay's cut should be deducted before transfer.
  void params;
  throw new Error(
    "paySeller is not yet implemented. Seller payouts require Stripe Connect onboarding."
  );
}
