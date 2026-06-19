// POST /api/clubs/[id]/patch-order
// Creates a physical patch order for an eligible member.
// Eligibility: 3+ months continuous membership in the club.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clubId = params.id;

  // Check membership tenure
  const { data: membership } = await supabase
    .from("club_memberships")
    .select("created_at")
    .eq("user_id", user.id)
    .eq("club_id", clubId)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "You are not a member of this club." }, { status: 403 });
  }

  const monthsInClub = (Date.now() - new Date(membership.created_at).getTime()) / (30 * 24 * 60 * 60 * 1000);
  if (monthsInClub < 3) {
    const daysLeft = Math.ceil((3 * 30) - (monthsInClub * 30));
    return NextResponse.json({
      error: `You'll be eligible for a patch in ${daysLeft} more days. Patches are earned after 3 months in a club.`,
      days_remaining: daysLeft,
    }, { status: 403 });
  }

  // Check they haven't already ordered one for this club
  const { data: existingOrder } = await supabase
    .from("patch_orders")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("club_id", clubId)
    .not("status", "eq", "cancelled")
    .maybeSingle();

  if (existingOrder) {
    return NextResponse.json({
      error: "You already have a patch order for this club.",
      existing_order: existingOrder,
    }, { status: 409 });
  }

  // Fetch club crest customization for the order snapshot
  const { data: customization } = await supabase
    .from("club_customization")
    .select("crest_shape, crest_symbol, crest_color_primary, crest_color_secondary, crest_color_accent, crest_url")
    .eq("club_id", clubId)
    .maybeSingle();

  const body = await req.json();
  const { recipient_name, address_line1, address_line2, city, state, zip, country } = body;

  if (!recipient_name || !address_line1 || !city || !state || !zip) {
    return NextResponse.json({ error: "Shipping address is incomplete." }, { status: 400 });
  }

  const crest_config = {
    shape:          customization?.crest_shape           ?? "oval",
    symbol:         customization?.crest_symbol          ?? "flower",
    colorPrimary:   customization?.crest_color_primary   ?? "#1C1B1C",
    colorSecondary: customization?.crest_color_secondary ?? "#FEFCF7",
    colorAccent:    customization?.crest_color_accent    ?? "#D4A853",
  };

  const { data: order, error } = await supabase
    .from("patch_orders")
    .insert({
      user_id:        user.id,
      club_id:        clubId,
      crest_config,
      crest_svg_url:  customization?.crest_url ?? null,
      recipient_name,
      address_line1,
      address_line2:  address_line2 ?? null,
      city,
      state,
      zip,
      country:        country ?? "US",
      status:         "pending",
    })
    .select("id, status")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify the member
  await supabase.from("notifications").insert({
    user_id:    user.id,
    type:       "celebrate",
    title:      "Your patch is on its way. ✦",
    body:       "Your club crest patch has been ordered. It'll arrive at your door within 2–3 weeks.",
    action_url: "/member/home",
  });

  return NextResponse.json({ ok: true, order_id: order.id });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("patch_orders")
    .select("id, status, created_at, shipped_at, tracking_number")
    .eq("user_id", user.id)
    .eq("club_id", params.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json(data ?? null);
}
