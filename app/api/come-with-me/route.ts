import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const POST_MAX_LENGTH   = 300;
const ACTIVITY_MAX      = 50;
const WHEN_TEXT_MAX     = 80;
const RATE_LIMIT_PER_DAY = 5;

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed, verification_status")
    .eq("id", user.id)
    .single();
  if (!profile?.onboarding_completed) return NextResponse.json({ error: "Complete onboarding first" }, { status: 403 });
  if (profile.verification_status !== "verified") return NextResponse.json({ error: "Verified members only" }, { status: 403 });

  const { data } = await supabase
    .from("come_with_me_posts")
    .select("id, post, activity, when_text, emoji, spots_left, created_at, user_id, profiles!inner(first_name, full_name, avatar_url, neighborhood)")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(15);

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed, verification_status")
    .eq("id", user.id)
    .single();
  if (!profile?.onboarding_completed) return NextResponse.json({ error: "Complete onboarding first" }, { status: 403 });
  if (profile.verification_status !== "verified") return NextResponse.json({ error: "Verified members only" }, { status: 403 });

  const body = await req.json();
  const { post, activity, when_text, emoji, spots_left } = body;

  if (!post || typeof post !== "string" || !post.trim())
    return NextResponse.json({ error: "post is required" }, { status: 400 });
  if (post.trim().length > POST_MAX_LENGTH)
    return NextResponse.json({ error: `post must be ${POST_MAX_LENGTH} characters or less` }, { status: 400 });

  if (!activity || typeof activity !== "string" || !activity.trim())
    return NextResponse.json({ error: "activity is required" }, { status: 400 });
  if (activity.trim().length > ACTIVITY_MAX)
    return NextResponse.json({ error: `activity must be ${ACTIVITY_MAX} characters or less` }, { status: 400 });

  if (when_text !== undefined && when_text !== null) {
    if (typeof when_text !== "string" || when_text.trim().length > WHEN_TEXT_MAX)
      return NextResponse.json({ error: `when_text must be ${WHEN_TEXT_MAX} characters or less` }, { status: 400 });
  }

  const spotsNum = spots_left !== undefined && spots_left !== null ? Number(spots_left) : 1;
  if (!Number.isInteger(spotsNum) || spotsNum < 1 || spotsNum > 10)
    return NextResponse.json({ error: "spots_left must be an integer between 1 and 10" }, { status: 400 });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("come_with_me_posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= RATE_LIMIT_PER_DAY)
    return NextResponse.json({ error: "Rate limit reached — try again tomorrow" }, { status: 429 });

  const safeEmoji = (typeof emoji === "string" && emoji.length <= 8) ? emoji : "🌸";

  const { data, error } = await supabase
    .from("come_with_me_posts")
    .insert({
      user_id: user.id,
      post: post.trim(),
      activity: activity.trim(),
      when_text: when_text?.trim() ?? null,
      emoji: safeEmoji,
      spots_left: spotsNum,
    })
    .select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}
