import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
