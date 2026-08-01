// Per-attendee voice notes left on a gathering — real recordings, uploaded
// via lib/storage/upload.ts::uploadGatheringVoiceNote, listed here for the
// Plan Room. RLS (gathering_voice_notes policies, migration 105) restricts
// read/write to attendees of that gathering.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("gathering_voice_notes")
    .select("id, user_id, audio_url, duration_secs, created_at, profiles!user_id(first_name, full_name, avatar_url)")
    .eq("gathering_id", id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ notes: data ?? [] });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { audio_url?: string; duration_secs?: number };
  if (!body.audio_url) return NextResponse.json({ error: "audio_url required" }, { status: 400 });

  const { data, error } = await supabase
    .from("gathering_voice_notes")
    .insert({
      gathering_id: id,
      user_id: user.id,
      audio_url: body.audio_url,
      duration_secs: Math.max(0, Math.min(60, Math.round(body.duration_secs ?? 0))),
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}
