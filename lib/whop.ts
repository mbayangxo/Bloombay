const WHOP_API_BASE = "https://api.whop.com/api/v2";

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

  const res = await fetch(`${WHOP_API_BASE}/checkout-sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: process.env.WHOP_PLAN_ID,
      price: {
        initial_price: priceCents / 100,
        plan_type: "one_time",
        currency: "usd",
      },
      redirect_url: `${baseUrl}/member/clubs/${clubId}?payment=success`,
      metadata: {
        club_id: clubId,
        user_id: userId,
        club_name: clubName,
        user_email: userEmail,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Whop checkout error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.checkout_url as string;
}
