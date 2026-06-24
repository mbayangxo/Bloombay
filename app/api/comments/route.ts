import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBlocked } from "@/lib/auth/block-check";

const COMMENT_MAX_LENGTH = 500;
const COMMENT_RATE_LIMIT_PER_HOUR = 20;

// GET /api/comments?fashion_post_id=xxx  OR  ?wall_post_id=xxx  OR  ?avenue_content_id=xxx
// Returns flat list of comments including author info. Client builds the thread.
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const fashionPostId    = searchParams.get("fashion_post_id");
  const wallPostId       = searchParams.get("wall_post_id");
  const avenueContentId  = searchParams.get("avenue_content_id");

  const targetCount = [fashionPostId, wallPostId, avenueContentId].filter(Boolean).length;
  if (targetCount !== 1) {
    return NextResponse.json({ error: "Exactly one post reference required" }, { status: 400 });
  }

  // Admin client needed for cross-table profile join; auth is already verified above
  const db = createAdminClient();
  let q = db
    .from("post_comments")
    .select(`
      id, parent_id, body, blooms, created_at,
      author_id,
      profiles!post_comments_author_id_fkey(display_name, avatar_url, bloom_code)
    `)
    .order("created_at", { ascending: true })
    .limit(200);

  if (fashionPostId)   q = q.eq("fashion_post_id", fashionPostId);
  if (wallPostId)      q = q.eq("wall_post_id", wallPostId);
  if (avenueContentId) q = q.eq("avenue_content_id", avenueContentId);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ comments: data ?? [] });
}

// POST /api/comments
// Body: { body, fashion_post_id? | wall_post_id? | avenue_content_id?, parent_id? }
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { body: text, fashion_post_id, wall_post_id, avenue_content_id, parent_id } = body;

  if (!text?.trim()) {
    return NextResponse.json({ error: "Comment body is required" }, { status: 400 });
  }
  if (text.length > COMMENT_MAX_LENGTH) {
    return NextResponse.json({ error: `Comment too long (max ${COMMENT_MAX_LENGTH} chars)` }, { status: 400 });
  }

  const targetCount = [fashion_post_id, wall_post_id, avenue_content_id].filter(Boolean).length;
  if (targetCount !== 1) {
    return NextResponse.json({ error: "Exactly one post reference required" }, { status: 400 });
  }

  // Block check for wall posts
  if (wall_post_id) {
    const { data: wallPost } = await supabase
      .from("wall_posts")
      .select("author_id")
      .eq("id", wall_post_id)
      .single();
    if (wallPost?.author_id && await isBlocked(supabase, user.id, wallPost.author_id)) {
      return NextResponse.json({ error: "Cannot comment on this post" }, { status: 403 });
    }
  }

  // Hourly rate limit
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: hourCount } = await supabase
    .from("post_comments")
    .select("id", { count: "exact", head: true })
    .eq("author_id", user.id)
    .gte("created_at", hourAgo);
  if ((hourCount ?? 0) >= COMMENT_RATE_LIMIT_PER_HOUR) {
    return NextResponse.json({ error: "Comment rate limit reached. Try again later." }, { status: 429 });
  }

  const { data, error } = await supabase.from("post_comments").insert({
    author_id:         user.id,
    body:              text.trim().slice(0, COMMENT_MAX_LENGTH),
    fashion_post_id:   fashion_post_id ?? null,
    wall_post_id:      wall_post_id ?? null,
    avenue_content_id: avenue_content_id ?? null,
    parent_id:         parent_id ?? null,
  }).select("id, body, created_at, parent_id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, comment: data });
}

// DELETE /api/comments?id=xxx
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("post_comments").delete().eq("id", id).eq("author_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
