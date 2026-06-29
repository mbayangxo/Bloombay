// GET  /api/member/pin-drops — personal drops + club mama pin drops
// POST /api/member/pin-drops — private pin drop (bouquet or specific girls)

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isBlocked } from "@/lib/auth/block-check";

const LOCATION_MIN = 2;
const LOCATION_MAX = 120;
const CAPTION_MAX  = 200;
const VALID_EXPIRES = new Set([2, 6, 24, 72]);
const RATE_LIMIT_PER_DAY = 5;
const MAX_RECIPIENTS     = 12;
const DUPE_COOLDOWN_MS   = 30 * 60 * 1000; // 30 minutes

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date().toISOString();

  const { data: mine } = await supabase
    .from("pin_drops")
    .select("id, location, caption, visibility, expires_at, created_at")
    .eq("user_id", user.id)
    .gte("expires_at", now)
    .order("created_at", { ascending: false })
    .limit(20);

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

  const { data: memberships } = await supabase
    .from("club_memberships")
    .select("club_slug")
    .eq("user_id", user.id);

  const clubSlugs = (memberships ?? []).map((m: { club_slug: string }) => m.club_slug).filter(Boolean);

  type ClubBroadcastRow = {
    id: string; club_id: string; title: string | null;
    body: string; sent_at: string; clubs: { name: string } | null;
  };

  let clubPins: ClubBroadcastRow[] = [];
  if (clubSlugs.length > 0) {
    const { data: clubs } = await supabase
      .from("clubs")
      .select("id")
      .in("slug", clubSlugs);
    const clubIds = (clubs ?? []).map((c: { id: string }) => c.id);
    if (clubIds.length > 0) {
      const { data } = await supabase
        .from("club_broadcasts")
        .select("id, club_id, title, body, sent_at, clubs ( name )")
        .eq("type", "pin_drop")
        .in("club_id", clubIds)
        .order("sent_at", { ascending: false })
        .limit(20);
      clubPins = (data ?? []) as unknown as ClubBroadcastRow[];
    }
  }

  type ReceivedRow = {
    pin_id: string;
    pin_drops: {
      id: string; location: string; caption: string | null;
      expires_at: string; created_at: string; user_id: string;
      profiles: { first_name: string | null; full_name: string | null; avatar_url: string | null } | null;
    } | null;
  };

  return NextResponse.json({
    mine: mine ?? [],
    received: ((received ?? []) as unknown as ReceivedRow[])
      .filter((r) => r.pin_drops && new Date(r.pin_drops.expires_at) > new Date())
      .map((r) => ({
        id:            r.pin_drops!.id,
        location:      r.pin_drops!.location,
        caption:       r.pin_drops!.caption,
        expires_at:    r.pin_drops!.expires_at,
        sent_at:       r.pin_drops!.created_at,
        sender_name:   r.pin_drops!.profiles?.first_name || r.pin_drops!.profiles?.full_name || "Someone",
        sender_avatar: r.pin_drops!.profiles?.avatar_url ?? null,
        kind:          "received" as const,
      })),
    club_pins: clubPins.map((p) => ({
      id:        p.id,
      location:  p.title ?? "Somewhere special",
      caption:   p.body,
      club_name: (p.clubs as { name: string } | null)?.name ?? null,
      sent_at:   p.sent_at,
      kind:      "club" as const,
    })),
  });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Require verified + onboarded
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed, verification_status")
    .eq("id", user.id)
    .single();
  if (!profile?.onboarding_completed) {
    return NextResponse.json({ error: "Complete onboarding first" }, { status: 403 });
  }
  if (profile.verification_status !== "verified") {
    return NextResponse.json({ error: "Verified members only" }, { status: 403 });
  }

  let body: {
    location?: string; caption?: string; target?: string;
    recipient_ids?: unknown; expires_hours?: unknown; notify?: unknown;
  };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const location   = body.location?.trim() ?? "";
  const caption    = body.caption?.trim() ?? null;
  const target     = body.target;
  const notify     = body.notify !== false;
  const expiresHours = Number(body.expires_hours ?? 24);

  // Validate location
  if (location.length < LOCATION_MIN || location.length > LOCATION_MAX) {
    return NextResponse.json(
      { error: `Location must be ${LOCATION_MIN}–${LOCATION_MAX} characters` },
      { status: 400 }
    );
  }

  // Validate caption
  if (caption && caption.length > CAPTION_MAX) {
    return NextResponse.json(
      { error: `Caption must be ${CAPTION_MAX} characters or fewer` },
      { status: 400 }
    );
  }

  // Only bouquet or specific — public disabled
  if (!["bouquet", "specific"].includes(target ?? "")) {
    return NextResponse.json({ error: "Invalid target. Use 'bouquet' or 'specific'" }, { status: 400 });
  }

  // Validate expires_hours
  if (!VALID_EXPIRES.has(expiresHours)) {
    return NextResponse.json({ error: "expires_hours must be 2, 6, 24, or 72" }, { status: 400 });
  }

  // Rate limit: 5 per day
  const dayAgo = new Date(Date.now() - 24 * 3600000).toISOString();
  const { count: todayCount } = await supabase
    .from("pin_drops")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", dayAgo);
  if ((todayCount ?? 0) >= RATE_LIMIT_PER_DAY) {
    return NextResponse.json({ error: "Daily pin drop limit reached (5/day)" }, { status: 429 });
  }

  // Duplicate location cooldown: 30 min
  const cooldownCutoff = new Date(Date.now() - DUPE_COOLDOWN_MS).toISOString();
  const { data: recent } = await supabase
    .from("pin_drops")
    .select("id")
    .eq("user_id", user.id)
    .eq("location", location)
    .gte("created_at", cooldownCutoff)
    .limit(1)
    .maybeSingle();
  if (recent) {
    return NextResponse.json(
      { error: "You already dropped a pin at this location recently. Wait 30 minutes." },
      { status: 429 }
    );
  }

  // Resolve recipients
  let recipientIds: string[] = [];

  if (target === "bouquet") {
    const { data: bouquet } = await supabase
      .from("bloom_bouquet")
      .select("member_id")
      .eq("owner_id", user.id);
    recipientIds = (bouquet ?? []).map((b: { member_id: string }) => b.member_id);
  } else if (target === "specific") {
    // Validate recipient_ids is an array of strings
    if (!Array.isArray(body.recipient_ids) || body.recipient_ids.length === 0) {
      return NextResponse.json({ error: "recipient_ids required for specific target" }, { status: 400 });
    }
    const rawIds = (body.recipient_ids as unknown[]).filter((id) => typeof id === "string") as string[];
    if (rawIds.length > MAX_RECIPIENTS) {
      return NextResponse.json({ error: `Max ${MAX_RECIPIENTS} recipients per drop` }, { status: 400 });
    }

    // Server-side bouquet verification: all recipients must be in sender's bouquet
    const { data: bouquet } = await supabase
      .from("bloom_bouquet")
      .select("member_id")
      .eq("owner_id", user.id);
    const bouquetSet = new Set((bouquet ?? []).map((b: { member_id: string }) => b.member_id));
    const invalid = rawIds.filter((id) => !bouquetSet.has(id));
    if (invalid.length > 0) {
      return NextResponse.json({ error: "All recipients must be in your bouquet" }, { status: 400 });
    }
    recipientIds = rawIds;
  }

  // Block/report checks — remove blocked users from recipients
  const safeRecipients: string[] = [];
  for (const uid of recipientIds) {
    const blocked = await isBlocked(supabase, user.id, uid);
    if (!blocked) safeRecipients.push(uid);
  }

  const visibility = target === "bouquet" ? "bouquet" : "private";
  const expiresAt  = new Date(Date.now() + expiresHours * 3600000).toISOString();

  const { data: pin, error } = await supabase
    .from("pin_drops")
    .insert({
      user_id:    user.id,
      location,
      caption:    caption ?? null,
      visibility,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (safeRecipients.length > 0) {
    const recipientRows = safeRecipients.map((uid) => ({ pin_id: pin.id, user_id: uid }));
    await supabase.from("pin_drop_recipients").insert(recipientRows);

    if (notify) {
      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("first_name, full_name")
        .eq("id", user.id)
        .maybeSingle();

      const senderName = senderProfile?.first_name || senderProfile?.full_name?.split(" ")[0] || "Someone";
      const notifRows = safeRecipients.map((uid) => ({
        user_id: uid,
        type:    "pin_drop",
        title:   `${senderName} dropped a pin`,
        body:    `${location}${caption ? ` — ${caption}` : ""}`,
        link:    "/member/pin-drops",
        data:    { pin_id: pin.id, sender_id: user.id },
      }));
      await supabase.from("notifications").insert(notifRows);
    }
  }

  return NextResponse.json({ pin, recipients: safeRecipients.length }, { status: 201 });
}
