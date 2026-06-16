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
}

export interface TicketParams {
  userId: string;
  userEmail: string;
  eventId: string;
  eventName: string;
  amountCents: number;
  quantity?: number;
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
