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
  pendingOrderId?: string;
}

export interface ClubMembershipParams {
  userId: string;
  userEmail: string;
  clubId: string;
  clubSlug: string;
  clubName: string;
  priceCents: number;
  currency?: string;
  pendingOrderId?: string;
}

export interface TicketParams {
  userId: string;
  userEmail: string;
  eventId: string;
  eventName: string;
  amountCents: number;
  currency?: string;
  quantity?: number;
  pendingOrderId?: string;
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
