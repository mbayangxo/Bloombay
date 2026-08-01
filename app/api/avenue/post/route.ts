import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/avenue/post?context=avenue&category=fits
// Lists real fashion_posts for the Closet/Hanger feeds.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const context = searchParams.get("context") ?? "avenue";
  const category = searchParams.get("category");

  const supabase = await createClient();
  let query = supabase
    .from("fashion_posts")
    .select("id, author_id, category, template_id, title, caption, photo_urls, photo_captions, border_color, blooms, created_at, profiles!author_id(display_name, avatar_url)")
    .eq("context", context)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(60);

  if (category && category !== "all") query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data ?? [] });
}

// POST /api/avenue/post
// Called by FashionPostSheet for both Avenue (closet) and Hanger template posts.
// Body: { context, category, template_id, title, caption, photo_urls, photo_captions, border_color, meta }

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    context = "avenue",
    category = "fits",
    template_id = "standard",
    title,
    caption,
    photo_urls,
    photo_captions,
    border_color,
    meta,
  } = body;

  if (!photo_urls || !Array.isArray(photo_urls) || photo_urls.length === 0) {
    return NextResponse.json({ error: "At least one photo is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("fashion_posts")
    .insert({
      author_id:      user.id,
      context,
      category,
      template_id,
      title:          title ?? null,
      caption:        caption ?? null,
      photo_urls,
      photo_captions: photo_captions ?? [],
      border_color:   border_color ?? null,
      meta:           meta ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("fashion_post insert error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
