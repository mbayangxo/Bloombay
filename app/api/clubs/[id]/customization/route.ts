// GET  /api/clubs/[id]/customization — fetch the customization for a club
// POST /api/clubs/[id]/customization — upsert the customization (owner only)

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id: clubId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("club_customization")
    .select("*")
    .eq("club_id", clubId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? {});
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id: clubId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify club ownership
  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("id, owner_id")
    .eq("id", clubId)
    .maybeSingle();

  if (clubError) return NextResponse.json({ error: clubError.message }, { status: 500 });
  if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });
  if (club.owner_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  const {
    crest_shape, crest_symbol,
    crest_color_primary, crest_color_secondary, crest_color_accent,
    crest_url,
    layout,
    accent_color, bg_color, text_color,
    cover_url, cover_position,
    tagline, about,
  } = body;

  const { error } = await supabase
    .from("club_customization")
    .upsert({
      club_id:               clubId,
      crest_shape:           crest_shape           ?? "shield",
      crest_symbol:          crest_symbol          ?? "flower",
      crest_color_primary:   crest_color_primary   ?? "#FF1F7D",
      crest_color_secondary: crest_color_secondary ?? "#1C1B1C",
      crest_color_accent:    crest_color_accent    ?? "#D4A853",
      crest_url:             crest_url             ?? null,
      layout:                layout                ?? "editorial",
      accent_color:          accent_color          ?? "#FF1F7D",
      bg_color:              bg_color              ?? "#FEFCF7",
      text_color:            text_color            ?? "#1C1B1C",
      cover_url:             cover_url             ?? null,
      cover_position:        cover_position        ?? "center",
      tagline:               tagline               ?? null,
      about:                 about                 ?? null,
      updated_at:            new Date().toISOString(),
    }, { onConflict: "club_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
