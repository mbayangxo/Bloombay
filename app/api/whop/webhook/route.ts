import { NextResponse } from "next/server";

// Whop webhook is disabled — payment fulfillment is handled by the Stripe
// webhook (app/api/payments/stripe/webhook). This route no longer processes
// events or writes memberships.
export async function POST() {
  return NextResponse.json({ error: "gone", message: "Whop webhook is disabled." }, { status: 410 });
}
