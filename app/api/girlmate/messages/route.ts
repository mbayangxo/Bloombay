import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isBlocked } from "@/lib/auth/block-check";

const MESSAGE_MAX_LENGTH         = 500;
const HOURLY_RATE_LIMIT          = 20;
const HOURLY_WINDOW_MS           = 60 * 60 * 1000;
const FIRST_MESSAGE_DAILY_LIMIT  = 10; // new conversations per day

// GET /api/girlmate/messages — inbox for current user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  const { data, error } = await supabase
    .from("girlmate_messages")
    .select(`
      id, body, read, created_at,
      from_user:profiles!from_user_id ( id, first_name, full_name ),
      to_user:profiles!to_user_id ( id, first_name, full_name ),
      listing:girlmate_profiles!listing_id ( id, listing_type, neighborhood_name, city )
    `)
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/girlmate/messages — send a message
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  let body: { to_user_id?: string; listing_id?: string; body?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.to_user_id || !body.body?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (body.to_user_id === user.id) {
    return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
  }
  if (body.body.trim().length > MESSAGE_MAX_LENGTH) {
    return NextResponse.json({ error: `Message too long (max ${MESSAGE_MAX_LENGTH} chars)` }, { status: 400 });
  }

  // Block check
  if (await isBlocked(supabase, user.id, body.to_user_id)) {
    return NextResponse.json({ error: "Cannot send message" }, { status: 403 });
  }

  // Verify recipient has an active listing
  const { data: listing } = await supabase
    .from("girlmate_profiles")
    .select("id, is_active")
    .eq("user_id", body.to_user_id)
    .eq("is_active", true)
    .maybeSingle();

  if (!listing) {
    return NextResponse.json({ error: "Recipient does not have an active listing" }, { status: 400 });
  }

  // Hourly rate limit (total messages)
  const hourStart = new Date(Date.now() - HOURLY_WINDOW_MS).toISOString();
  const { count: hourCount } = await supabase
    .from("girlmate_messages")
    .select("id", { count: "exact", head: true })
    .eq("from_user_id", user.id)
    .gte("created_at", hourStart);

  if ((hourCount ?? 0) >= HOURLY_RATE_LIMIT) {
    return NextResponse.json({ error: "Too many messages. Please wait before sending more." }, { status: 429 });
  }

  // First-message rate limit: max 10 new conversations per day
  const dayStart = new Date(Date.now() - 24 * 3600000).toISOString();
  const { data: existingThread } = await supabase
    .from("girlmate_messages")
    .select("id")
    .eq("from_user_id", user.id)
    .eq("to_user_id", body.to_user_id)
    .limit(1)
    .maybeSingle();

  if (!existingThread) {
    // This is a first message — count new conversations started today
    const { data: todayFirstMessages } = await supabase
      .from("girlmate_messages")
      .select("to_user_id")
      .eq("from_user_id", user.id)
      .gte("created_at", dayStart);

    const uniqueRecipients = new Set((todayFirstMessages ?? []).map((m: { to_user_id: string }) => m.to_user_id));
    if (uniqueRecipients.size >= FIRST_MESSAGE_DAILY_LIMIT) {
      return NextResponse.json(
        { error: "Daily limit for new conversations reached (10/day)" },
        { status: 429 }
      );
    }
  }

  const { error } = await supabase.from("girlmate_messages").insert({
    from_user_id: user.id,
    to_user_id:   body.to_user_id,
    listing_id:   body.listing_id ?? null,
    body:         body.body.trim(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
