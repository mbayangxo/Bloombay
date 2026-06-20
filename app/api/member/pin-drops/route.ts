// GET  /api/member/pin-drops — personal drops + club mama pin drops
// POST /api/member/pin-drops — drop a pin (to bouquet, bloomies, or public)

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date().toISOString();

  // This user's own active pin drops
  const { data: mine } = await supabase
    .from("pin_drops")
    .select("id, location, caption, visibility, expires_at, created_at")
    .eq("user_id", user.id)
    .gte("expires_at", now)
    .order("created_at", { ascending: false })
    .limit(20);

  // Pin drops sent TO this user (from bouquet or private sends)
  const { data: received } = await supabase
    .from("pin_drop_recipients")
    .select(`
      pin_id,
      pin_drops ( id, location, caption, expires_at, created_at, user_id,
        profiles!pin_drops_user_id_fkey ( first_name, full_name, avatar_url )
      )
    `)
    .eq("user_id", user.id)
    .limit(20);

  // Get clubs the member belongs to for club mama pin drops
  const { data: memberships } = await supabase
    .from("club_memberships")
    .select("club_id")
    .eq("user_id", user.id)
    .eq("status", "active");

  const clubIds = (memberships ?? []).map((m: { club_id: string }) => m.club_id);

  type ClubBroadcastRow = {
    id: string;
    club_id: string;
    title: string | null;
    body: string;
    sent_at: string;
    clubs: { name: string } | null;
  };

  let clubPins: ClubBroadcastRow[] = [];
  if (clubIds.length > 0) {
    const { data } = await supabase
      .from("club_broadcasts")
      .select("id, club_id, title, body, sent_at, clubs ( name )")
      .eq("type", "pin_drop")
      .in("club_id", clubIds)
      .order("sent_at", { ascending: false })
      .limit(20);
    clubPins = (data ?? []) as ClubBroadcastRow[];
  }

  type ReceivedRow = {
    pin_id: string;
    pin_drops: {
      id: string;
      location: string;
      caption: string | null;
      expires_at: string;
      created_at: string;
      user_id: string;
      profiles: { first_name: string | null; full_name: string | null; avatar_url: string | null } | null;
    } | null;
  };

  return NextResponse.json({
    mine: mine ?? [],
    received: ((received ?? []) as ReceivedRow[])
      .filter((r) => r.pin_drops && new Date(r.pin_drops.expires_at) > new Date())
      .map((r) => ({
        id: r.pin_drops!.id,
        location: r.pin_drops!.location,
        caption: r.pin_drops!.caption,
        expires_at: r.pin_drops!.expires_at,
        sent_at: r.pin_drops!.created_at,
        sender_name: r.pin_drops!.profiles?.first_name || r.pin_drops!.profiles?.full_name || "Someone",
        sender_avatar: r.pin_drops!.profiles?.avatar_url ?? null,
        kind: "received" as const,
      })),
    club_pins: clubPins.map((p) => ({
      id: p.id,
      location: p.title ?? "Somewhere special",
      caption: p.body,
      club_name: (p.clubs as { name: string } | null)?.name ?? null,
      sent_at: p.sent_at,
      kind: "club" as const,
    })),
  });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    location,
    caption,
    target,          // 'public' | 'bouquet' | 'specific'
    recipient_ids,   // string[] — only used when target = 'specific'
    expires_hours = 24,
    notify = true,
  } = body;

  if (!location?.trim()) return NextResponse.json({ error: "Location required" }, { status: 400 });
  if (!["public", "bouquet", "specific"].includes(target)) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  const visibility = target === "public" ? "public" : target === "bouquet" ? "bouquet" : "private";
  const expiresAt = new Date(Date.now() + expires_hours * 3600000).toISOString();

  // Create the pin drop
  const { data: pin, error } = await supabase
    .from("pin_drops")
    .insert({
      user_id: user.id,
      location: location.trim(),
      caption: caption?.trim() || null,
      visibility,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Determine recipients
  let recipientIds: string[] = [];

  if (target === "bouquet") {
    const { data: bouquet } = await supabase
      .from("bloom_bouquet")
      .select("member_id")
      .eq("owner_id", user.id);
    recipientIds = (bouquet ?? []).map((b: { member_id: string }) => b.member_id);
  } else if (target === "specific" && Array.isArray(recipient_ids)) {
    recipientIds = recipient_ids.filter((id: string) => typeof id === "string");
  }

  // Fan out to recipients
  if (recipientIds.length > 0) {
    // Insert recipients
    const recipientRows = recipientIds.map((uid) => ({
      pin_id: pin.id,
      user_id: uid,
    }));
    await supabase.from("pin_drop_recipients").insert(recipientRows);

    // Send in-app notifications if requested
    if (notify) {
      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("first_name, full_name")
        .eq("id", user.id)
        .maybeSingle();

      const senderName = senderProfile?.first_name || senderProfile?.full_name?.split(" ")[0] || "Someone";
      const notifRows = recipientIds.map((uid) => ({
        user_id: uid,
        type: "pin_drop",
        title: `${senderName} dropped a pin`,
        body: `${location.trim()}${caption ? ` — ${caption.trim()}` : ""}`,
        link: "/member/pin-drops",
        data: { pin_id: pin.id, sender_id: user.id },
      }));
      await supabase.from("notifications").insert(notifRows);
    }
  }

  return NextResponse.json({
    pin,
    recipients: recipientIds.length,
  }, { status: 201 });
}
