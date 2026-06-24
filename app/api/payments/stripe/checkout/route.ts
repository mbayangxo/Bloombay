import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { createMembership, chargeTicket, chargeClubMembership } from "@/lib/payments";
import { createClient } from "@/lib/supabase/server";
import { createClient as adminClient } from "@supabase/supabase-js";

function admin() {
  return adminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

type MembershipBody = {
  type: "membership";
  plan: "monthly" | "biannual" | "annual";
};

type TicketBody = {
  type: "ticket";
  eventId: string;
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
    const { eventId, quantity } = body;
    if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

    // Always fetch price and name server-side — never trust the client
    const db = admin();
    const { data: event, error } = await db
      .from("gatherings")
      .select("id, title, ticket_price_cents, is_free")
      .eq("id", eventId)
      .single();

    if (error || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (event.is_free || !event.ticket_price_cents) {
      return NextResponse.json({ error: "Event is free" }, { status: 400 });
    }

    const { url } = await chargeTicket({
      eventId: event.id,
      eventName: event.title,
      amountCents: event.ticket_price_cents,
      quantity: quantity ?? 1,
      userId: user.id,
      userEmail: user.email ?? "",
    });

    return NextResponse.json({ url });
  }

  if (body.type === "club") {
    const { clubId } = body;
    if (!clubId) return NextResponse.json({ error: "clubId required" }, { status: 400 });

    const supabase = await createClient();
    const { data: club } = await supabase
      .from("clubs")
      .select("id, name, price_cents, is_paid")
      .eq("id", clubId)
      .single();

    if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });
    if (!club.is_paid) return NextResponse.json({ error: "Club is free" }, { status: 400 });

    const { url } = await chargeClubMembership({
      clubId: club.id,
      clubName: club.name,
      priceCents: club.price_cents ?? 1000,
      userId: user.id,
      userEmail: user.email ?? "",
    });

    return NextResponse.json({ url });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
