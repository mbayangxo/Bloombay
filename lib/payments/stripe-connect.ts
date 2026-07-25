import Stripe from "stripe";
import { getStripe } from "@/lib/payments/stripe";

function baseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/** Platform fee in basis points (1000 = 10%). */
export function platformFeeBps(): number {
  const raw = Number(process.env.STRIPE_PLATFORM_FEE_BPS ?? "1000");
  if (!Number.isFinite(raw) || raw < 0) return 1000;
  return Math.min(raw, 5000);
}

export function calcPlatformFeeCents(amountCents: number): number {
  return Math.round((amountCents * platformFeeBps()) / 10000);
}

export async function createConnectExpressAccount(params: {
  userId: string;
  email: string;
}): Promise<Stripe.Account> {
  const stripe = getStripe();
  return stripe.accounts.create({
    type: "express",
    email: params.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: "individual",
    metadata: {
      bloombay_user_id: params.userId,
    },
  });
}

export async function createConnectOnboardingLink(params: {
  accountId: string;
  returnPath: string;
}): Promise<string> {
  const stripe = getStripe();
  const link = await stripe.accountLinks.create({
    account: params.accountId,
    refresh_url: `${baseUrl()}${params.returnPath}?connect=refresh`,
    return_url: `${baseUrl()}${params.returnPath}?connect=return`,
    type: "account_onboarding",
  });
  return link.url;
}

export async function createConnectLoginLink(accountId: string): Promise<string> {
  const stripe = getStripe();
  const link = await stripe.accounts.createLoginLink(accountId);
  return link.url;
}

export async function retrieveConnectAccount(accountId: string): Promise<Stripe.Account> {
  return getStripe().accounts.retrieve(accountId);
}

export function accountPayoutReady(account: Stripe.Account): boolean {
  return !!(account.charges_enabled && account.payouts_enabled && account.details_submitted);
}
