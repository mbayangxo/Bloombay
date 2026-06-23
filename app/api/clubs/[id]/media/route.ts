import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  // Resolve club id from slug or uuid
  const isUuid = /^[0-9a-f-]{36}$/i.test(id);
  const { data: club } = await supabase
    .from("clubs")
    .select("id")
    .eq(isUuid ? "id" : "slug", id)
    .single();

  if (!club) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const mediaType = new URL(req.url).searchParams.get("type");
  const q = supabase
    .from("club_media")
    .select("id, media_type, public_url, caption, duration_ms, created_at, user_id, profiles(first_name, full_name)")
    .eq("club_id", club.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (mediaType) q.eq("media_type", mediaType);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ media: data ?? [] });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const isUuid = /^[0-9a-f-]{36}$/i.test(id);
  const { data: club } = await supabase
    .from("clubs")
    .select("id, slug")
    .eq(isUuid ? "id" : "slug", id)
    .single();

  if (!club) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Check membership or ownership
  const [{ data: membership }, { data: ownership }] = await Promise.all([
    supabase.from("club_memberships")
      .select("joined_at")
      .eq("club_slug", club.slug)
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase.from("clubs")
      .select("id")
      .eq("id", club.id)
      .eq("owner_id", user.id)
      .maybeSingle(),
  ]);

  if (!membership && !ownership) {
    return NextResponse.json({ error: "Must be a member to add media" }, { status: 403 });
  }

  const body = await req.json();
  const { media_type, storage_path, public_url, caption, duration_ms } = body;

  if (!media_type || !storage_path || !public_url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("club_media")
    .insert({ club_id: club.id, user_id: user.id, media_type, storage_path, public_url, caption, duration_ms })
    .select("id, media_type, public_url, caption, duration_ms, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ media: data });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { mediaId } = await req.json();
  if (!mediaId) return NextResponse.json({ error: "mediaId required" }, { status: 400 });

  const { error } = await supabase
    .from("club_media")
    .delete()
    .eq("id", mediaId)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
