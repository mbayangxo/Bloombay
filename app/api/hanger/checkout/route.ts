import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { getStripe } from "@/lib/payments/stripe";

function baseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId } = await req.json() as { listingId: string };
  if (!listingId) return NextResponse.json({ error: "listingId required" }, { status: 400 });

  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("hanger_listings")
    .select("id, title, price_cents, status, seller_id")
    .eq("id", listingId)
    .single();

  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (listing.status !== "active") return NextResponse.json({ error: "Item is no longer available" }, { status: 409 });
  if (listing.seller_id === user.id) return NextResponse.json({ error: "You cannot buy your own listing" }, { status: 400 });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [{
      price_data: {
        currency: "gbp",
        unit_amount: listing.price_cents,
        product_data: { name: listing.title },
      },
      quantity: 1,
    }],
    metadata: {
      user_id: user.id,
      listing_id: listing.id,
      seller_id: listing.seller_id,
      type: "hanger_purchase",
    },
    success_url: `${baseUrl()}/member/thank-you?type=hanger&name=${encodeURIComponent(listing.title)}&back=${encodeURIComponent("/member/hanger")}`,
    cancel_url: `${baseUrl()}/member/hanger`,
  });

  return NextResponse.json({ url: session.url! });
}
