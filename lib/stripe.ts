import Stripe from "stripe";

// Server-side Stripe client — never import this in client components
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-05-27.dahlia",
});

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

// Create a Stripe Checkout session for a one-time club membership payment
export async function createClubCheckoutSession({
  clubId,
  clubName,
  priceCents,
  userId,
  userEmail,
}: {
  clubId: string;
  clubName: string;
  priceCents: number;
  userId: string;
  userEmail: string;
}): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: priceCents,
          product_data: {
            name: `${clubName} Membership`,
            description: `Join ${clubName} on Bloombay`,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${baseUrl}/member/clubs/${clubId}?payment=success`,
    cancel_url:  `${baseUrl}/member/clubs/${clubId}?payment=cancelled`,
    metadata: {
      club_id:  clubId,
      user_id:  userId,
      type:     "club_membership",
    },
  });

  return session.url!;
}
