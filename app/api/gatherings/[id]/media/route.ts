// PATCH /api/gatherings/[id]/media
// Updates photo_urls, voice_note_url, template, and accent_color on a gathering.
// Caller must be the event's host_id.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;

  // Verify caller is the host
  const { data: gathering, error: fetchError } = await supabase
    .from("gatherings")
    .select("host_id")
    .eq("id", id)
    .single();

  if (fetchError || !gathering) {
    return NextResponse.json({ error: "Gathering not found" }, { status: 404 });
  }

  if (gathering.host_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  // Only allow the four media fields — nothing else
  const patch: Record<string, unknown> = {};
  if (Array.isArray(body.photo_urls))           patch.photo_urls     = body.photo_urls;
  if ("voice_note_url" in body)                 patch.voice_note_url = body.voice_note_url ?? null;
  if (typeof body.template === "string")        patch.template       = body.template;
  if (typeof body.accent_color === "string")    patch.accent_color   = body.accent_color;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from("gatherings")
    .update(patch)
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
