// GET /api/member/my-story
// Returns a member's personal social autobiography: milestones, stats, and narrative moments.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch stored milestones
  const { data: storedMilestones } = await supabase
    .from("member_milestones")
    .select("id, kind, title, body, meta, happened_at")
    .eq("user_id", user.id)
    .order("happened_at", { ascending: true })
    .limit(50);

  // Fetch profile for member_since
  const { data: profile } = await supabase
    .from("profiles")
    .select("created_at, first_name, full_name")
    .eq("id", user.id)
    .maybeSingle();

  // Stats
  const [
    { count: eventsCount },
    { count: bloomiesCount },
    { count: clubsCount },
    { count: flowersCount },
    { count: witnessCount },
  ] = await Promise.all([
    supabase.from("gathering_attendance").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("bloom_requests").select("*", { count: "exact", head: true })
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .eq("status", "accepted"),
    supabase.from("club_memberships").select("*", { count: "exact", head: true })
      .eq("user_id", user.id).eq("status", "active"),
    supabase.from("bloom_flowers").select("*", { count: "exact", head: true }).eq("to_user_id", user.id),
    supabase.from("gathering_witnesses").select("*", { count: "exact", head: true }).eq("subject_user_id", user.id),
  ]);

  // Compute dynamic milestone chapters from real events
  const dynamicChapters: {
    id: string;
    kind: string;
    title: string;
    body: string | null;
    happened_at: string;
    meta: Record<string, unknown> | null;
  }[] = [];

  // Member since
  if (profile?.created_at) {
    dynamicChapters.push({
      id: "member_since",
      kind: "member_since",
      title: "You joined BloomBay.",
      body: "Every chapter starts somewhere. This is yours.",
      happened_at: profile.created_at,
      meta: null,
    });
  }

  // First event attended
  const { data: firstEvent } = await supabase
    .from("gathering_attendance")
    .select("checked_in_at, gatherings ( title )")
    .eq("user_id", user.id)
    .order("checked_in_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstEvent) {
    const gTitle = (firstEvent.gatherings as { title?: string } | null)?.title ?? "your first gathering";
    dynamicChapters.push({
      id: "first_event",
      kind: "first_event",
      title: "Your first gathering.",
      body: `You walked into ${gTitle}. That's always the hardest part.`,
      happened_at: firstEvent.checked_in_at,
      meta: { gathering_title: gTitle },
    });
  }

  // First bloom request sent
  const { data: firstBloom } = await supabase
    .from("bloom_requests")
    .select("created_at, note")
    .eq("from_user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstBloom) {
    dynamicChapters.push({
      id: "first_bloom_sent",
      kind: "first_bloom_sent",
      title: "You sent your first bloom request.",
      body: firstBloom.note ? `You wrote: "${firstBloom.note.slice(0, 100)}${firstBloom.note.length > 100 ? "…" : ""}"` : "You reached out. That takes courage.",
      happened_at: firstBloom.created_at,
      meta: null,
    });
  }

  // First accepted bloomie
  const { data: firstAccepted } = await supabase
    .from("bloom_requests")
    .select("created_at, responded_at")
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .eq("status", "accepted")
    .order("responded_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstAccepted?.responded_at) {
    dynamicChapters.push({
      id: "first_bloomie",
      kind: "first_bloomie",
      title: "Your first Bloomie.",
      body: "Two women decided to actually know each other. A friendship began.",
      happened_at: firstAccepted.responded_at,
      meta: null,
    });
  }

  // Milestone: 5 events
  if ((eventsCount ?? 0) >= 5) {
    const { data: fifthEvent } = await supabase
      .from("gathering_attendance")
      .select("checked_in_at")
      .eq("user_id", user.id)
      .order("checked_in_at", { ascending: true })
      .limit(5);
    if (fifthEvent && fifthEvent.length === 5) {
      dynamicChapters.push({
        id: "five_events",
        kind: "milestone_count",
        title: "Five gatherings.",
        body: "You've been showing up. That's not nothing.",
        happened_at: fifthEvent[4].checked_in_at,
        meta: { count: 5 },
      });
    }
  }

  // First flower received
  const { data: firstFlower } = await supabase
    .from("bloom_flowers")
    .select("sent_at")
    .eq("to_user_id", user.id)
    .order("sent_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstFlower) {
    dynamicChapters.push({
      id: "first_flower",
      kind: "flower_received",
      title: "Someone sent you flowers.",
      body: "She noticed you. That's the whole point of showing up.",
      happened_at: firstFlower.sent_at,
      meta: null,
    });
  }

  // First witness
  const { data: firstWitness } = await supabase
    .from("gathering_witnesses")
    .select("created_at, note")
    .eq("subject_user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstWitness) {
    dynamicChapters.push({
      id: "first_witnessed",
      kind: "witnessed",
      title: "Someone witnessed something about you.",
      body: firstWitness.note ? `"${firstWitness.note}"` : "She was paying attention. So is Yande.",
      happened_at: firstWitness.created_at,
      meta: null,
    });
  }

  // Merge stored + dynamic, deduplicate by kind (stored wins), sort by date
  const storedKinds = new Set((storedMilestones ?? []).map(m => m.kind));
  const mergedDynamic = dynamicChapters.filter(c => !storedKinds.has(c.kind));

  const all = [
    ...(storedMilestones ?? []),
    ...mergedDynamic,
  ].sort((a, b) => new Date(a.happened_at).getTime() - new Date(b.happened_at).getTime());

  return NextResponse.json({
    chapters: all,
    member_since: profile?.created_at ?? null,
    name: profile?.first_name || profile?.full_name?.split(" ")[0] || null,
    stats: {
      events_attended: eventsCount ?? 0,
      bloomies_count: bloomiesCount ?? 0,
      clubs_joined: clubsCount ?? 0,
      flowers_received: flowersCount ?? 0,
      times_witnessed: witnessCount ?? 0,
    },
  });
}
