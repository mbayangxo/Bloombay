import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  accountPayoutReady,
  createConnectExpressAccount,
  createConnectLoginLink,
  createConnectOnboardingLink,
  retrieveConnectAccount,
} from "@/lib/payments/stripe-connect";

type Body = {
  returnPath?: string;
  /** If true, open Stripe Express dashboard instead of onboarding */
  dashboard?: boolean;
};

/**
 * POST /api/payments/stripe/connect
 * Creates or resumes Stripe Connect Express onboarding for the signed-in host / Club Mama.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    body = {};
  }

  const returnPath = body.returnPath?.startsWith("/")
    ? body.returnPath
    : "/member/host?tab=payments";

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_account_id, email, first_name, full_name, is_host, role")
    .eq("id", user.id)
    .maybeSingle();

  let accountId = (profile as { stripe_account_id?: string | null } | null)?.stripe_account_id ?? null;

  try {
    if (!accountId) {
      const account = await createConnectExpressAccount({
        userId: user.id,
        email: user.email ?? (profile as { email?: string } | null)?.email ?? "",
      });
      accountId = account.id;
      await supabase
        .from("profiles")
        .update({
          stripe_account_id: accountId,
          is_host: true,
        })
        .eq("id", user.id);
    }

    if (body.dashboard) {
      const url = await createConnectLoginLink(accountId);
      return NextResponse.json({ url, accountId });
    }

    const url = await createConnectOnboardingLink({ accountId, returnPath });
    return NextResponse.json({ url, accountId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Connect failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/** GET — sync Connect account status into profiles */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled, stripe_details_submitted, is_host",
    )
    .eq("id", user.id)
    .maybeSingle();

  const accountId = (profile as { stripe_account_id?: string | null } | null)?.stripe_account_id;
  if (!accountId) {
    return NextResponse.json({
      connected: false,
      payoutsReady: false,
      is_host: !!(profile as { is_host?: boolean } | null)?.is_host,
    });
  }

  try {
    const account = await retrieveConnectAccount(accountId);
    const ready = accountPayoutReady(account);
    await supabase
      .from("profiles")
      .update({
        stripe_charges_enabled: !!account.charges_enabled,
        stripe_payouts_enabled: !!account.payouts_enabled,
        stripe_details_submitted: !!account.details_submitted,
        is_host: true,
      })
      .eq("id", user.id);

    return NextResponse.json({
      connected: true,
      payoutsReady: ready,
      chargesEnabled: !!account.charges_enabled,
      payoutsEnabled: !!account.payouts_enabled,
      detailsSubmitted: !!account.details_submitted,
      accountId,
    });
  } catch (e) {
    return NextResponse.json({
      connected: true,
      payoutsReady: false,
      accountId,
      error: e instanceof Error ? e.message : "Could not refresh Stripe",
    });
  }
}
