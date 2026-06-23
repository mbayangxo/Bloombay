import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/moments/post
// Called by CreateMomentSheet to save a moment to the user's memory box.
// Body: { template_id, moment_type, caption, location_name, photo_urls, tagged_friend }

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    template_id = "standard",
    moment_type,
    caption,
    location_name,
    photo_urls,
    tagged_friend,
  } = body;

  if (!moment_type) {
    return NextResponse.json({ error: "moment_type is required" }, { status: 400 });
  }
  if (!photo_urls || !Array.isArray(photo_urls) || photo_urls.length === 0) {
    return NextResponse.json({ error: "At least one photo is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("moments")
    .insert({
      author_id:     user.id,
      template_id,
      moment_type,
      caption:       caption ?? null,
      location_name: location_name ?? null,
      tagged_friend: tagged_friend ?? null,
      photo_urls,
    })
    .select("id")
    .single();

  if (error) {
    console.error("moments insert error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
