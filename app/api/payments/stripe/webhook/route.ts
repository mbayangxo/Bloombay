import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Signature verification failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata ?? {};
      const type = meta.type;

      if (type === "platform_membership") {
        // Grant platform membership access
        await supabase
          .from("profiles")
          .update({
            is_member: true,
            membership_started_at: new Date().toISOString(),
            membership_type: "platform",
          })
          .eq("id", meta.user_id);

        await supabase.from("notifications").insert({
          user_id: meta.user_id,
          type: "membership_confirmed",
          title: "Welcome to BloomBay!",
          body: "Your membership is confirmed. The Avenue is yours.",
          link: "/member/avenue",
        });
      }

      if (type === "event_ticket") {
        // TODO: upsert into `tickets` table once schema is migrated
        await supabase.from("notifications").insert({
          user_id: meta.user_id,
          type: "ticket_confirmed",
          title: "You're going!",
          body: "Your ticket is confirmed.",
          link: `/member/happenings/${meta.event_id}`,
          data: { event_id: meta.event_id },
        });
      }

      if (type === "club_membership") {
        const { data: club } = await supabase
          .from("clubs")
          .select("slug")
          .eq("id", meta.club_id)
          .single();

        const clubSlug = (club as { slug: string } | null)?.slug ?? meta.club_id;

        await supabase.from("club_memberships").upsert(
          {
            user_id: meta.user_id,
            club_slug: clubSlug,
            club_id: meta.club_id,
            joined_at: new Date().toISOString(),
          },
          { onConflict: "user_id,club_slug" }
        );

        await supabase
          .from("club_applications")
          .update({ status: "accepted" })
          .eq("club_id", meta.club_id)
          .eq("user_id", meta.user_id)
          .eq("status", "pending");

        await supabase.from("notifications").insert({
          user_id: meta.user_id,
          type: "club_accepted",
          title: "Payment confirmed — you're in!",
          body: "Your membership was confirmed. Welcome.",
          link: `/member/clubs/${clubSlug}`,
          data: { club_id: meta.club_id },
        });
      }

      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const subMeta = sub.metadata ?? {};
      if (subMeta.user_id) {
        await supabase
          .from("profiles")
          .update({ is_member: false, membership_type: null })
          .eq("id", subMeta.user_id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
