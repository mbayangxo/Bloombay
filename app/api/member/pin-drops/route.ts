// GET /api/member/pin-drops
// Returns personal pin drops + club mama broadcast pin drops for the member.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date().toISOString();

  // Personal pin drops (user's own drops + any active drops)
  const { data: personal } = await supabase
    .from("pin_drops")
    .select("id, location, caption, expires_at, created_at, user_id")
    .eq("user_id", user.id)
    .gte("expires_at", now)
    .order("created_at", { ascending: false })
    .limit(20);

  // Get clubs the member belongs to
  const { data: memberships } = await supabase
    .from("club_memberships")
    .select("club_id")
    .eq("user_id", user.id)
    .eq("status", "active");

  const clubIds = (memberships ?? []).map((m) => m.club_id);

  // Club broadcast pin drops (from Club Mamas in member's clubs)
  let clubPins: {
    id: string;
    club_id: string;
    title: string | null;
    body: string;
    sent_at: string;
    clubs: { name: string } | null;
  }[] = [];

  if (clubIds.length > 0) {
    const { data } = await supabase
      .from("club_broadcasts")
      .select("id, club_id, title, body, sent_at, clubs ( name )")
      .eq("type", "pin_drop")
      .in("club_id", clubIds)
      .order("sent_at", { ascending: false })
      .limit(20);
    clubPins = (data ?? []) as typeof clubPins;
  }

  return NextResponse.json({
    personal: personal ?? [],
    club_pins: clubPins.map((p) => ({
      id: p.id,
      location: p.title ?? "Somewhere special",
      caption: p.body,
      club_name: p.clubs?.name ?? null,
      sent_at: p.sent_at,
      type: "club",
    })),
  });
}
