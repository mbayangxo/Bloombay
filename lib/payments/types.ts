export interface CheckoutResult {
  url: string;
  sessionId: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface MembershipParams {
  userId: string;
  userEmail: string;
  plan: "monthly" | "biannual" | "annual";
}

export interface ClubMembershipParams {
  userId: string;
  userEmail: string;
  clubId: string;
  clubName: string;
  priceCents: number;
  destinationAccountId?: string;
  platformFeeCents?: number;
  hostId?: string;
}

export interface TicketParams {
  userId: string;
  userEmail: string;
  eventId: string;
  eventName: string;
  amountCents: number;
  quantity?: number;
  /** Stripe Connect Express account that receives the funds (minus platform fee). */
  destinationAccountId?: string;
  platformFeeCents?: number;
  hostId?: string;
}

export interface HostPayoutParams {
  hostId: string;
  amountCents: number;
  currency?: string;
  description?: string;
}

export interface SellerPayoutParams {
  sellerId: string;
  amountCents: number;
  currency?: string;
  description?: string;
}
