import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ memories: [], source: "demo" });
  }

  const { data, error } = await supabase
    .from("member_memories")
    .select("id, user_id, image_url, title, caption, club_slug, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(48);

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({
        memories: [],
        source: "demo",
        warning: "Run supabase/migrations/013_member_media.sql",
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ memories: data ?? [], source: "db" });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: { imageUrl?: string; title?: string; caption?: string; clubSlug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const imageUrl = body.imageUrl?.trim();
  if (!imageUrl) {
    return NextResponse.json({ ok: false, error: "imageUrl required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("member_memories")
    .insert({
      user_id: user.id,
      image_url: imageUrl,
      title: body.title?.trim() || null,
      caption: body.caption?.trim() || null,
      club_slug: body.clubSlug?.trim() || null,
    })
    .select("id, user_id, image_url, title, caption, club_slug, created_at")
    .single();

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/013_member_media.sql" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, memory: data });
}
