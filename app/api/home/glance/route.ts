import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Aggregated media for homepage photo frames + deep links */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      avatarUrl: null,
      profilePhotos: [],
      memories: [],
      clubCovers: [],
      source: "demo",
    });
  }

  const [profileRes, photosRes, memoriesRes, clubsRes] = await Promise.all([
    supabase.from("profiles").select("avatar_url").eq("id", user.id).maybeSingle(),
    supabase
      .from("profile_photos")
      .select("id, user_id, image_url, sort_order, kind, created_at")
      .eq("user_id", user.id)
      .eq("kind", "gallery")
      .order("sort_order", { ascending: true })
      .limit(6),
    supabase
      .from("member_memories")
      .select("id, user_id, image_url, title, caption, club_slug, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("clubs")
      .select("slug, name, cover_url, banner_url")
      .not("cover_url", "is", null)
      .order("updated_at", { ascending: false })
      .limit(4),
  ]);

  const missingTable = [photosRes.error, memoriesRes.error, clubsRes.error].some((e) =>
    e?.message.includes("does not exist")
  );

  if (missingTable) {
    return NextResponse.json({
      avatarUrl: profileRes.data?.avatar_url ?? null,
      profilePhotos: [],
      memories: [],
      clubCovers: [],
      source: "demo",
      warning: "Run supabase/migrations/013_member_media.sql",
    });
  }

  const clubCovers = (clubsRes.data ?? []).map((c) => ({
    slug: c.slug as string,
    name: c.name as string,
    coverUrl: (c.cover_url as string | null) ?? (c.banner_url as string | null),
  }));

  return NextResponse.json({
    avatarUrl: profileRes.data?.avatar_url ?? null,
    profilePhotos: photosRes.data ?? [],
    memories: memoriesRes.data ?? [],
    clubCovers,
    source: "db",
  });
}
