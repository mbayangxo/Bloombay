import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ photos: [], avatarUrl: null, source: "demo" });
  }

  const [photosRes, profileRes] = await Promise.all([
    supabase
      .from("profile_photos")
      .select("id, user_id, image_url, sort_order, kind, created_at")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
    supabase.from("profiles").select("avatar_url").eq("id", user.id).maybeSingle(),
  ]);

  if (photosRes.error?.message.includes("does not exist")) {
    return NextResponse.json({
      photos: [],
      avatarUrl: profileRes.data?.avatar_url ?? null,
      source: "demo",
      warning: "Run supabase/migrations/013_member_media.sql",
    });
  }

  if (photosRes.error) {
    return NextResponse.json({ error: photosRes.error.message }, { status: 500 });
  }

  return NextResponse.json({
    photos: photosRes.data ?? [],
    avatarUrl: profileRes.data?.avatar_url ?? null,
    source: "db",
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: { imageUrl?: string; kind?: "avatar" | "gallery"; title?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const imageUrl = body.imageUrl?.trim();
  if (!imageUrl) {
    return NextResponse.json({ ok: false, error: "imageUrl required" }, { status: 400 });
  }

  const kind = body.kind === "avatar" ? "avatar" : "gallery";

  if (kind === "avatar") {
    const { error: profileErr } = await supabase
      .from("profiles")
      .update({ avatar_url: imageUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (profileErr && !profileErr.message.includes("does not exist")) {
      return NextResponse.json({ ok: false, error: profileErr.message }, { status: 400 });
    }

    await supabase.from("profile_photos").delete().eq("user_id", user.id).eq("kind", "avatar");
  }

  const { count } = await supabase
    .from("profile_photos")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("kind", "gallery");

  const { data, error } = await supabase
    .from("profile_photos")
    .insert({
      user_id: user.id,
      image_url: imageUrl,
      kind,
      sort_order: kind === "gallery" ? (count ?? 0) : 0,
    })
    .select("id, user_id, image_url, sort_order, kind, created_at")
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

  return NextResponse.json({ ok: true, photo: data });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profile_photos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
