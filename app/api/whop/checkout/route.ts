import { NextResponse } from "next/server";

// Whop checkout is disabled. Payments run exclusively through Stripe
// (app/api/payments/stripe/checkout), which enforces the BETA_PAYMENTS_DISABLED
// guard during the guided private beta. This legacy route previously called
// chargeClubMembership directly and bypassed that guard — it is now retired.
export async function POST() {
  return NextResponse.json(
    {
      error: "gone",
      message: "Whop checkout is disabled. Use Stripe checkout (/api/payments/stripe/checkout).",
    },
    { status: 410 },
  );
}
