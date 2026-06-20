import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("clubs")
    .select(
      "id, slug, owner_id, name, cover_url, banner_url, logo_url, logo_template, logo_text, crest_image_url, tagline, description, welcome_line, primary_color, accent_color, instagram, website, tiktok, crest_symbol, crest_accent, aesthetic_key, category, layout_key, default_happening_template, membership_type"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({ club: null, source: "demo", warning: "Run 013_member_media.sql" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ club: data, source: data ? "db" : "demo", isOwner: user?.id === data?.owner_id });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: {
    slug?: string;
    name?: string;
    coverUrl?: string;
    bannerUrl?: string;
    logoUrl?: string;
    logoTemplate?: string;
    logoText?: string;
    crestImageUrl?: string;
    tagline?: string;
    description?: string;
    welcomeLine?: string;
    primaryColor?: string;
    accentColor?: string;
    instagram?: string;
    website?: string;
    tiktok?: string;
    crestSymbol?: string;
    crestAccent?: string;
    aestheticKey?: string;
    category?: string;
    layoutKey?: string;
    defaultHappeningTemplate?: string;
    membershipType?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const slug = body.slug?.trim();
  const name = body.name?.trim();
  if (!slug || !name) {
    return NextResponse.json({ ok: false, error: "slug and name required" }, { status: 400 });
  }

  const row = {
    slug,
    owner_id: user.id,
    name,
    cover_url: body.coverUrl?.trim() || null,
    banner_url: body.bannerUrl?.trim() || null,
    logo_url: body.logoUrl?.trim() || null,
    logo_template: body.logoTemplate?.trim() || null,
    logo_text: body.logoText?.trim() || null,
    crest_image_url: body.crestImageUrl?.trim() || null,
    tagline: body.tagline?.trim() || null,
    description: body.description?.trim() || null,
    welcome_line: body.welcomeLine?.trim() || null,
    primary_color: body.primaryColor?.trim() || null,
    accent_color: body.accentColor?.trim() || null,
    instagram: body.instagram?.trim() || null,
    website: body.website?.trim() || null,
    tiktok: body.tiktok?.trim() || null,
    crest_symbol: body.crestSymbol?.trim() || null,
    crest_accent: body.crestAccent?.trim() || null,
    aesthetic_key: body.aestheticKey?.trim() || null,
    category: body.category?.trim() || null,
    layout_key: body.layoutKey?.trim() || "salon",
    default_happening_template: body.defaultHappeningTemplate?.trim() || null,
    membership_type: body.membershipType?.trim() || "curated",
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("clubs")
    .upsert(row, { onConflict: "slug" })
    .select(
      "id, slug, owner_id, name, cover_url, banner_url, logo_url, logo_template, logo_text, crest_image_url, tagline, description, welcome_line, primary_color, accent_color, instagram, website, tiktok, crest_symbol, crest_accent, aesthetic_key, category, layout_key, default_happening_template, membership_type"
    )
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

  return NextResponse.json({ ok: true, club: data });
}
