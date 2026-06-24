import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { getStripe } from "@/lib/payments/stripe";

function baseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

// Shop items — prices in smallest currency unit
const SHOP_CATALOG: Record<string, { name: string; price_cents: number; currency: string }> = {
  "1": { name: "Melanin Glow Oil",             price_cents: 4200, currency: "gbp" },
  "2": { name: "Vintage Styling Session",       price_cents: 5500, currency: "gbp" },
  "3": { name: "West African Spice Bundle",     price_cents: 1800, currency: "gbp" },
  "4": { name: "Natural Hair Care Guide PDF",   price_cents: 1200, currency: "gbp" },
  "5": { name: "1:1 Pilates Drop-In",           price_cents: 6500, currency: "usd" },
  "6": { name: "Custom Press-On Nails",         price_cents: 3500, currency: "gbp" },
};

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId } = await req.json() as { itemId: string };
  const item = SHOP_CATALOG[itemId];
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [{
      price_data: {
        currency: item.currency,
        unit_amount: item.price_cents,
        product_data: { name: item.name },
      },
      quantity: 1,
    }],
    metadata: {
      user_id: user.id,
      item_id: itemId,
      type: "shop_purchase",
    },
    success_url: `${baseUrl()}/member/thank-you?type=shop&name=${encodeURIComponent(item.name)}&back=${encodeURIComponent("/member/avenue/shop")}`,
    cancel_url: `${baseUrl()}/member/avenue/shop`,
  });

  return NextResponse.json({ url: session.url! });
}
