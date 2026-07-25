import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Body = {
  gatheringId: string;
  eventType: "view" | "click" | "interest" | "share";
};

/** POST /api/happenings/analytics — record view / click / interest */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as Body;
  if (!body.gatheringId || !body.eventType) {
    return NextResponse.json({ error: "gatheringId and eventType required" }, { status: 400 });
  }
  if (!["view", "click", "interest", "share"].includes(body.eventType)) {
    return NextResponse.json({ error: "Invalid eventType" }, { status: 400 });
  }

  const { error } = await supabase.from("gathering_analytics_events").insert({
    gathering_id: body.gatheringId,
    user_id: user.id,
    event_type: body.eventType,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** GET /api/happenings/analytics?gatheringId= — host-only summary */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gatheringId = req.nextUrl.searchParams.get("gatheringId");
  if (!gatheringId) return NextResponse.json({ error: "gatheringId required" }, { status: 400 });

  const { data: gathering } = await supabase
    .from("gatherings")
    .select("id, host_id, title, price_cents")
    .eq("id", gatheringId)
    .maybeSingle();

  if (!gathering || (gathering as { host_id?: string }).host_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: rows } = await supabase
    .from("gathering_analytics_events")
    .select("event_type")
    .eq("gathering_id", gatheringId);

  const counts = { view: 0, click: 0, interest: 0, share: 0 };
  for (const r of rows ?? []) {
    const t = (r as { event_type: keyof typeof counts }).event_type;
    if (t in counts) counts[t] += 1;
  }

  const { data: tickets } = await supabase
    .from("tickets")
    .select("amount_paid, platform_fee_cents, host_receives_cents, status")
    .eq("event_id", gatheringId)
    .eq("status", "confirmed");

  const ticketRows = (tickets ?? []) as {
    amount_paid: number;
    platform_fee_cents: number;
    host_receives_cents: number;
  }[];

  const gross = ticketRows.reduce((s, t) => s + (t.amount_paid ?? 0), 0);
  const fees = ticketRows.reduce((s, t) => s + (t.platform_fee_cents ?? 0), 0);
  const net = ticketRows.reduce(
    (s, t) => s + (t.host_receives_cents ?? Math.max(0, (t.amount_paid ?? 0) - (t.platform_fee_cents ?? 0))),
    0,
  );

  const [{ count: going }, { count: attended }] = await Promise.all([
    supabase
      .from("seat_reservations")
      .select("id", { count: "exact", head: true })
      .eq("gathering_id", gatheringId)
      .eq("status", "reserved"),
    supabase
      .from("gathering_attendance")
      .select("id", { count: "exact", head: true })
      .eq("gathering_id", gatheringId),
  ]);

  return NextResponse.json({
    gatheringId,
    title: (gathering as { title: string }).title,
    analytics: counts,
    going: going ?? 0,
    attended: attended ?? 0,
    ticketsSold: ticketRows.length,
    revenue: {
      grossCents: gross,
      platformFeeCents: fees,
      hostNetCents: net,
      currency: "gbp",
    },
  });
}
