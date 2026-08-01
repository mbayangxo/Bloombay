// Host-defined pre-order menu for a gathering. RLS (migration 105) lets any
// authenticated member read the menu, but only the host/ops can write it.

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

  const { data, error } = await supabase
    .from("gathering_menu_items")
    .select("id, name, category, price_cents, sort_order")
    .eq("gathering_id", id)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    name?: string; category?: "drink" | "food" | "extra"; price_cents?: number; sort_order?: number;
  };
  if (!body.name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });

  const { data, error } = await supabase
    .from("gathering_menu_items")
    .insert({
      gathering_id: id,
      name: body.name.trim(),
      category: body.category ?? "drink",
      price_cents: Math.max(0, body.price_cents ?? 0),
      sort_order: body.sort_order ?? 0,
    })
    .select("id")
    .single();

  // RLS blocks non-hosts silently (0 rows) rather than erroring, so a null
  // data with no error still means "not allowed."
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Only the host can edit the menu." }, { status: 403 });

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
    .from("gathering_menu_items")
    .delete()
    .eq("id", itemId)
    .eq("gathering_id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
