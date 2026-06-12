import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { club_id, user_id } = session.metadata ?? {};

    if (club_id && user_id && session.payment_status === "paid") {
      const supabase = await createClient();

      // Fetch club slug for the membership record
      const { data: club } = await supabase
        .from("clubs")
        .select("slug")
        .eq("id", club_id)
        .single();

      const clubSlug = (club as { slug: string | null } | null)?.slug ?? club_id;

      // Create membership
      await supabase.from("club_memberships").upsert({
        user_id,
        club_slug:  clubSlug,
        club_id,
        joined_at:  new Date().toISOString(),
      }, { onConflict: "user_id,club_slug" });

      // Approve the pending application (if any)
      await supabase
        .from("club_applications")
        .update({ status: "accepted" })
        .eq("club_id", club_id)
        .eq("user_id", user_id)
        .eq("status", "pending");

      // Push a notification to the user
      await supabase.from("notifications").insert({
        user_id,
        type:  "club_accepted",
        title: "Payment confirmed — you're in!",
        body:  `Your membership to the club was confirmed. Welcome.`,
        link:  `/member/clubs/${clubSlug}`,
        data:  { club_id },
      });
    }
  }

  return NextResponse.json({ received: true });
}
