import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { createMembership, chargeTicket, chargeClubMembership } from "@/lib/payments";
import { createClient } from "@/lib/supabase/server";

type MembershipBody = {
  type: "membership";
  plan: "monthly" | "biannual" | "annual";
};

type TicketBody = {
  type: "ticket";
  eventId: string;
  eventName: string;
  amountCents: number;
  quantity?: number;
};

type ClubBody = {
  type: "club";
  clubId: string;
};

type RequestBody = MembershipBody | TicketBody | ClubBody;

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: RequestBody = await req.json();

  if (body.type === "membership") {
    const { plan } = body;
    if (!plan) return NextResponse.json({ error: "plan required" }, { status: 400 });

    const { url } = await createMembership({
      plan,
      userId: user.id,
      userEmail: user.email ?? "",
    });

    return NextResponse.json({ url });
  }

  if (body.type === "ticket") {
    const { eventId, eventName, quantity } = body;
    if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });
    if (!eventName) return NextResponse.json({ error: "eventName required" }, { status: 400 });

    const supabase = await createClient();
    const { data: gathering } = await supabase
      .from("gatherings")
      .select("id, host_id, price_cents, title")
      .eq("id", eventId)
      .maybeSingle();

    if (!gathering) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // The price is always derived from the gathering's own record, never
    // trusted from the client — otherwise a caller could set their own
    // ticket price by editing the request body.
    const amountCents = (gathering as { price_cents?: number | null }).price_cents ?? 0;
    if (amountCents <= 0) {
      return NextResponse.json({ error: "This event has no ticket price set." }, { status: 400 });
    }

    const hostId = (gathering as { host_id?: string | null }).host_id;
    let destinationAccountId: string | undefined;
    let platformFeeCents = 0;

    if (amountCents > 0) {
      if (!hostId) {
        return NextResponse.json(
          { error: "This paid event has no host payout account. Contact the host." },
          { status: 400 },
        );
      }
      const { data: host } = await supabase
        .from("profiles")
        .select("stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled")
        .eq("id", hostId)
        .maybeSingle();

      const acct = (host as { stripe_account_id?: string | null; stripe_charges_enabled?: boolean; stripe_payouts_enabled?: boolean } | null);
      if (!acct?.stripe_account_id || !acct.stripe_charges_enabled || !acct.stripe_payouts_enabled) {
        return NextResponse.json(
          {
            error:
              "The host hasn’t finished Stripe payout setup. Paid tickets can’t be sold until their bank is connected.",
          },
          { status: 400 },
        );
      }
      destinationAccountId = acct.stripe_account_id;
      const qty = quantity ?? 1;
      const { calcPlatformFeeCents } = await import("@/lib/payments/stripe-connect");
      platformFeeCents = calcPlatformFeeCents(amountCents * qty);
    }

    const { url } = await chargeTicket({
      eventId,
      eventName: eventName || (gathering as { title: string }).title,
      amountCents,
      quantity: quantity ?? 1,
      userId: user.id,
      userEmail: user.email ?? "",
      destinationAccountId,
      platformFeeCents,
      hostId: hostId ?? undefined,
    });

    return NextResponse.json({ url });
  }

  if (body.type === "club") {
    const { clubId } = body;
    if (!clubId) return NextResponse.json({ error: "clubId required" }, { status: 400 });

    const supabase = await createClient();
    const { data: club } = await supabase
      .from("clubs")
      .select("id, name, price_cents, is_paid, owner_id, stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled")
      .eq("id", clubId)
      .single();

    if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });
    if (!club.is_paid) return NextResponse.json({ error: "Club is free" }, { status: 400 });

    const priceCents = club.price_cents ?? 1000;
    const hostId = (club as { owner_id?: string | null }).owner_id ?? undefined;
    let destinationAccountId: string | undefined =
      (club as { stripe_account_id?: string | null }).stripe_account_id &&
      (club as { stripe_charges_enabled?: boolean }).stripe_charges_enabled &&
      (club as { stripe_payouts_enabled?: boolean }).stripe_payouts_enabled
        ? ((club as { stripe_account_id: string }).stripe_account_id)
        : undefined;

    if (!destinationAccountId && hostId) {
      const { data: owner } = await supabase
        .from("profiles")
        .select("stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled")
        .eq("id", hostId)
        .maybeSingle();
      const o = owner as {
        stripe_account_id?: string | null;
        stripe_charges_enabled?: boolean;
        stripe_payouts_enabled?: boolean;
      } | null;
      if (o?.stripe_account_id && o.stripe_charges_enabled && o.stripe_payouts_enabled) {
        destinationAccountId = o.stripe_account_id;
      }
    }

    if (!destinationAccountId) {
      return NextResponse.json(
        {
          error:
            "This Club Mama hasn’t finished Stripe payout setup. Paid joins can’t be charged until their bank is connected.",
        },
        { status: 400 },
      );
    }

    const { calcPlatformFeeCents } = await import("@/lib/payments/stripe-connect");
    const { url } = await chargeClubMembership({
      clubId: club.id,
      clubName: club.name,
      priceCents,
      userId: user.id,
      userEmail: user.email ?? "",
      destinationAccountId,
      platformFeeCents: calcPlatformFeeCents(priceCents),
      hostId,
    });

    return NextResponse.json({ url });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
