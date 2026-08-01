// Pre-order / "make it your night" add-ons. A real, host-visible order
// queue — fulfilled and billed by the host at the event, not charged live.
// RLS (migration 105) scopes reads to the orderer, the host, or ops.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Am I the host? If so, show every order for this gathering; otherwise
  // just my own (RLS enforces this regardless — this just shapes the query).
  const { data: gathering } = await supabase
    .from("gatherings")
    .select("host_id, created_by")
    .eq("id", id)
    .maybeSingle();
  const isHost = gathering && (gathering.host_id === user.id || gathering.created_by === user.id);

  let query = supabase
    .from("gathering_orders")
    .select("id, user_id, item_id, quantity, status, created_at, gathering_menu_items(name, price_cents, category)")
    .eq("gathering_id", id);
  if (!isHost) query = query.eq("user_id", user.id);

  const { data, error } = await query.order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [], isHost: !!isHost });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { item_id?: string; quantity?: number };
  if (!body.item_id) return NextResponse.json({ error: "item_id required" }, { status: 400 });

  const { data, error } = await supabase
    .from("gathering_orders")
    .upsert(
      {
        gathering_id: id,
        user_id: user.id,
        item_id: body.item_id,
        quantity: Math.max(1, body.quantity ?? 1),
        status: "requested",
      },
      { onConflict: "gathering_id,user_id,item_id" }
    )
    .select("id")
    .single();

  if (error) {
    if (error.message.includes("is_gathering_attendee") || error.code === "42501") {
      return NextResponse.json({ error: "RSVP to this happening before ordering." }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: data.id });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");
  if (!itemId) return NextResponse.json({ error: "itemId required" }, { status: 400 });

  const { error } = await supabase
    .from("gathering_orders")
    .delete()
    .eq("gathering_id", id)
    .eq("item_id", itemId)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
