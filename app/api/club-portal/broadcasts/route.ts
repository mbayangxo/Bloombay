// GET  /api/club-portal/broadcasts  — list sent broadcasts for the owner's club
// POST /api/club-portal/broadcasts  — send a new broadcast

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: club } = await supabase
    .from("clubs")
    .select("id, name")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!club) return NextResponse.json({ error: "No club" }, { status: 404 });

  const { data: broadcasts } = await supabase
    .from("club_broadcasts")
    .select(`
      id, type, title, body, photo_url, poll_options, recipient_count, sent_at,
      gatherings ( id, title, starts_at )
    `)
    .eq("club_id", club.id)
    .order("sent_at", { ascending: false })
    .limit(40);

  // Fetch reply/response counts in parallel
  const ids = (broadcasts ?? []).map((b) => b.id);
  const [pollRes, replyRes] = await Promise.all([
    ids.length
      ? supabase.from("broadcast_poll_responses").select("broadcast_id", { count: "exact" }).in("broadcast_id", ids)
      : Promise.resolve({ data: [] }),
    ids.length
      ? supabase.from("broadcast_replies").select("broadcast_id", { count: "exact" }).in("broadcast_id", ids)
      : Promise.resolve({ data: [] }),
  ]);

  const pollCounts: Record<string, number> = {};
  const replyCounts: Record<string, number> = {};
  for (const r of (pollRes.data ?? [])) {
    pollCounts[r.broadcast_id] = (pollCounts[r.broadcast_id] ?? 0) + 1;
  }
  for (const r of (replyRes.data ?? [])) {
    replyCounts[r.broadcast_id] = (replyCounts[r.broadcast_id] ?? 0) + 1;
  }

  return NextResponse.json({
    club: { id: club.id, name: club.name },
    broadcasts: (broadcasts ?? []).map((b) => ({
      ...b,
      poll_responses: pollCounts[b.id] ?? 0,
      reply_count: replyCounts[b.id] ?? 0,
    })),
  });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: club } = await supabase
    .from("clubs")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!club) return NextResponse.json({ error: "No club" }, { status: 404 });

  const body = await req.json();
  const { type, title, message, photo_url, poll_options, gathering_id } = body;

  if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const validTypes = ["ping", "photo", "poll", "question", "event_invite"];
  if (!validTypes.includes(type)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  // Get member count for this club
  const { count: memberCount } = await supabase
    .from("club_memberships")
    .select("*", { count: "exact", head: true })
    .eq("club_id", club.id)
    .eq("status", "active");

  const { data: broadcast, error } = await supabase
    .from("club_broadcasts")
    .insert({
      club_id: club.id,
      sent_by: user.id,
      type,
      title: title?.trim() || null,
      body: message.trim(),
      photo_url: photo_url || null,
      poll_options: poll_options || null,
      gathering_id: gathering_id || null,
      recipient_count: memberCount ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ broadcast }, { status: 201 });
}
