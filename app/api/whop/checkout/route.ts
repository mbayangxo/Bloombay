import { NextResponse } from "next/server";

// Whop checkout is disabled. Payments run exclusively through Stripe
// (app/api/payments/stripe/checkout). This legacy route called
// chargeClubMembership directly with a hardcoded price fallback — it is retired.
export async function POST() {
  return NextResponse.json(
    {
      error: "gone",
      message: "Whop checkout is disabled. Use Stripe checkout (/api/payments/stripe/checkout).",
    },
    { status: 410 },
  );
}
