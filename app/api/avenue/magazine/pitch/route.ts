import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/avenue/magazine/pitch — submit a pitch
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    section: string;
    headline: string;
    pitch_body: string;
    image_url?: string;
  };

  if (!body.section || !body.headline?.trim() || !body.pitch_body?.trim()) {
    return NextResponse.json({ error: "Section, headline, and pitch are required" }, { status: 400 });
  }

  const SECTIONS = ["style", "culture", "love", "career", "wellness", "opinion"];
  if (!SECTIONS.includes(body.section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("magazine_pitches")
    .insert({
      submitted_by: user.id,
      section: body.section,
      headline: body.headline.trim().slice(0, 140),
      pitch_body: body.pitch_body.trim().slice(0, 1000),
      image_url: body.image_url ?? null,
    })
    .select("id, section, headline, status, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// GET /api/avenue/magazine/pitch — member's own pitches
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("magazine_pitches")
    .select("id, section, headline, pitch_body, image_url, status, created_at")
    .eq("submitted_by", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pitches: data ?? [] });
}
