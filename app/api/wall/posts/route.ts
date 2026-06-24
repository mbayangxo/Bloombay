import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { factCheck, logModeration } from "@/lib/fact-check";

const ALLOWED_CATEGORIES = new Set([
  "wall", "closet", "vanity", "wellness", "reading-room", "screening", "working", "magazine",
]);
const POST_MAX_LENGTH = 500;
const POST_RATE_LIMIT_PER_DAY = 10;

// GET /api/wall/posts?category=all&limit=30&offset=0
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

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

  const category = req.nextUrl.searchParams.get("category") ?? "all";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? "30"), 50);
  const offset = Number(req.nextUrl.searchParams.get("offset") ?? "0");

  const admin = createAdminClient();
  let query = admin
    .from("wall_posts")
    .select(`
      id, category, text, blooms, created_at, is_seed, seed_author,
      author:profiles!author_id ( first_name, full_name )
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category !== "all") query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/wall/posts — create a post (requires verified + onboarded)
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

  const body = await req.json() as { category?: string; text?: string };
  const text = body.text?.trim() ?? "";
  if (!text) return NextResponse.json({ error: "Text required" }, { status: 400 });
  if (text.length > POST_MAX_LENGTH) {
    return NextResponse.json({ error: `Post too long (max ${POST_MAX_LENGTH} chars)` }, { status: 400 });
  }

  const category = body.category ?? "wall";
  if (!ALLOWED_CATEGORIES.has(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  // Daily rate limit
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: dayCount } = await supabase
    .from("wall_posts")
    .select("id", { count: "exact", head: true })
    .eq("author_id", user.id)
    .gte("created_at", dayAgo);
  if ((dayCount ?? 0) >= POST_RATE_LIMIT_PER_DAY) {
    return NextResponse.json({ error: "Daily post limit reached. Try again tomorrow." }, { status: 429 });
  }

  const { data, error } = await supabase
    .from("wall_posts")
    .insert({ author_id: user.id, category, text })
    .select(`id, category, text, blooms, created_at, author:profiles!author_id ( first_name, full_name )`)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Background fact-check — don't block the response
  if (data?.id) {
    const admin = createAdminClient();
    factCheck(text, { contentType: "wall_post" }).then(async (result) => {
      await logModeration(admin, {
        sourceTable: "wall_posts",
        sourceId: data.id,
        contentType: "wall_post",
        contentText: text,
        result,
      });
    }).catch(() => {});
  }

  return NextResponse.json(data);
}
