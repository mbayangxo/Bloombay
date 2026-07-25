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
  // Ticket money uses destination charges at checkout (Connect).
  // Manual transfers remain available for edge cases.
  void params;
  throw new Error(
    "Manual payHost transfers are unused — paid tickets pay out via Stripe Connect destination charges. Hosts must finish Connect onboarding first.",
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
