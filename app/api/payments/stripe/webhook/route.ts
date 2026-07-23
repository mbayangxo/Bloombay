import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSMS, formatWelcomeSMS, formatTicketConfirmSMS, formatClubWelcomeSMS } from "@/lib/notifications/sms";
import type Stripe from "stripe";

const HANGER_FEE_PCT = 0.10;

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

  // A Stripe webhook request carries no user session/cookies, so RLS on
  // profiles/club_memberships/notifications/etc (all scoped to auth.uid())
  // would silently block every write below under the normal cookie-bound
  // client. Use the service-role client instead.
  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata ?? {};
      const type = meta.type;
      const amountCents = session.amount_total ?? 0;
      const currency = session.currency ?? "usd";

      if (type === "platform_membership") {
        await supabase
          .from("profiles")
          .update({
            is_member: true,
            membership_started_at: new Date().toISOString(),
            membership_type: "platform",
          })
          .eq("id", meta.user_id);

        await supabase.from("purchases").upsert({
          user_id: meta.user_id,
          type: "membership",
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
          amount_cents: amountCents,
          currency,
          item_name: "BloomBay Membership",
          status: "completed",
        }, { onConflict: "stripe_session_id", ignoreDuplicates: true });

        await supabase.from("notifications").insert({
          user_id: meta.user_id,
          type: "membership_confirmed",
          title: "Welcome to BloomBay!",
          body: "Your membership is confirmed. The Avenue is yours.",
          link: "/member/avenue",
        });

        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, full_name, phone_number")
          .eq("id", meta.user_id)
          .single();

        if (profile?.phone_number) {
          const name = profile.first_name ?? profile.full_name?.split(" ")[0] ?? "";
          await sendSMS(profile.phone_number, formatWelcomeSMS(name));
        }
      }

      if (type === "event_ticket") {
        await supabase.from("tickets").upsert({
          user_id: meta.user_id,
          event_id: meta.event_id,
          stripe_session_id: session.id,
          amount_paid: amountCents,
          currency,
          status: "confirmed",
          purchased_at: new Date().toISOString(),
        }, { onConflict: "stripe_session_id", ignoreDuplicates: true });

        const { data: ev } = await supabase.from("gatherings").select("title, starts_at").eq("id", meta.event_id).single();

        await supabase.from("purchases").upsert({
          user_id: meta.user_id,
          type: "event_ticket",
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
          amount_cents: amountCents,
          currency,
          item_name: ev?.title ?? "Event ticket",
          item_id: meta.event_id ?? null,
          status: "completed",
        }, { onConflict: "stripe_session_id", ignoreDuplicates: true });

        await supabase.from("notifications").insert({
          user_id: meta.user_id,
          type: "ticket_confirmed",
          title: "You're going!",
          body: "Your ticket is confirmed.",
          link: `/member/happenings/${meta.event_id}`,
          data: { event_id: meta.event_id },
        });

        const { data: profile } = await supabase.from("profiles").select("first_name, full_name, phone_number").eq("id", meta.user_id).single();

        if (profile?.phone_number && ev) {
          const name = profile.first_name ?? profile.full_name?.split(" ")[0] ?? "";
          const dateStr = new Date(ev.starts_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
          await sendSMS(profile.phone_number, formatTicketConfirmSMS(name, ev.title, dateStr));
        }
      }

      if (type === "club_membership") {
        const { data: club } = await supabase
          .from("clubs")
          .select("slug, name")
          .eq("id", meta.club_id)
          .single();

        const clubSlug = (club as { slug: string } | null)?.slug ?? meta.club_id;
        const clubName = (club as { name: string } | null)?.name ?? "your club";

        await supabase.from("club_memberships").upsert(
          {
            user_id: meta.user_id,
            club_slug: clubSlug,
            joined_at: new Date().toISOString(),
          },
          { onConflict: "user_id,club_slug" }
        );

        await supabase
          .from("club_applications")
          .update({ status: "approved", reviewed_at: new Date().toISOString() })
          .eq("club_slug", clubSlug)
          .eq("user_id", meta.user_id)
          .eq("status", "pending");

        await supabase.from("purchases").upsert({
          user_id: meta.user_id,
          type: "club_membership",
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
          amount_cents: amountCents,
          currency,
          item_name: clubName,
          item_id: meta.club_id ?? null,
          status: "completed",
        }, { onConflict: "stripe_session_id", ignoreDuplicates: true });

        await supabase.from("notifications").insert({
          user_id: meta.user_id,
          type: "club_accepted",
          title: "Payment confirmed — you're in!",
          body: "Your membership was confirmed. Welcome.",
          link: `/member/clubs/${clubSlug}`,
          data: { club_id: meta.club_id },
        });

        const { data: memberProfile } = await supabase
          .from("profiles")
          .select("first_name, full_name, phone_number")
          .eq("id", meta.user_id)
          .single();

        if (memberProfile?.phone_number) {
          const name = memberProfile.first_name ?? memberProfile.full_name?.split(" ")[0] ?? "";
          await sendSMS(memberProfile.phone_number, formatClubWelcomeSMS(name, clubName));
        }
      }

      if (type === "hanger_purchase") {
        const listingId = meta.listing_id;
        const sellerId = meta.seller_id;
        const buyerId = meta.user_id;
        const feeCents = Math.round(amountCents * HANGER_FEE_PCT);
        const payoutCents = amountCents - feeCents;

        const { data: listing } = await supabase.from("hanger_listings").select("title, status").eq("id", listingId).single();

        // Guard against a webhook retry double-selling an already-sold listing.
        if (listing && listing.status !== "sold") {
          await supabase.from("hanger_sales").upsert({
            listing_id: listingId,
            seller_id: sellerId,
            buyer_id: buyerId,
            amount_cents: amountCents,
            fee_cents: feeCents,
            payout_cents: payoutCents,
            stripe_session_id: session.id,
          }, { onConflict: "stripe_session_id", ignoreDuplicates: true });

          await supabase.from("hanger_listings").update({ status: "sold" }).eq("id", listingId);

          await supabase.from("notifications").insert({
            user_id: sellerId,
            type: "hanger_sold",
            title: "Sold! 👗",
            body: `"${listing.title}" sold on The Hanger.`,
            link: "/member/hanger",
          });
        }

        await supabase.from("purchases").upsert({
          user_id: buyerId,
          type: "hanger_purchase",
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
          amount_cents: amountCents,
          currency,
          item_name: listing?.title ?? "Hanger item",
          item_id: listingId ?? null,
          status: "completed",
        }, { onConflict: "stripe_session_id", ignoreDuplicates: true });
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
