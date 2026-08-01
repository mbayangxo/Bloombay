// Outfit-check: an attendee shares one outfit photo for a gathering, other
// attendees react. RLS (migration 105) restricts read/write to attendees.

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

  const { data: photos, error } = await supabase
    .from("gathering_outfit_photos")
    .select("id, user_id, photo_url, created_at, profiles!user_id(first_name, full_name, avatar_url)")
    .eq("gathering_id", id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const photoIds = (photos ?? []).map(p => p.id);
  let votes: { photo_id: string; voter_id: string }[] = [];
  if (photoIds.length > 0) {
    const { data } = await supabase
      .from("gathering_outfit_votes")
      .select("photo_id, voter_id")
      .in("photo_id", photoIds);
    votes = data ?? [];
  }

  const results = (photos ?? []).map(p => ({
    ...p,
    vote_count: votes.filter(v => v.photo_id === p.id).length,
    my_vote: votes.some(v => v.photo_id === p.id && v.voter_id === user.id),
  }));

  return NextResponse.json({ photos: results });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { photo_url?: string };
  if (!body.photo_url) return NextResponse.json({ error: "photo_url required" }, { status: 400 });

  const { data, error } = await supabase
    .from("gathering_outfit_photos")
    .upsert(
      { gathering_id: id, user_id: user.id, photo_url: body.photo_url },
      { onConflict: "gathering_id,user_id" }
    )
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}
