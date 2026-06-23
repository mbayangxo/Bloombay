// GET /api/member/people-you-met
// Returns profiles of members you shared a real event with (gathering attendance,
// open seats, come-with-me joins) but haven't yet bloomed with.
// Excludes people with existing pending/accepted bloom requests.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600000).toISOString();

  // Gatherings the current user attended in last 30 days
  const { data: myAttendance } = await supabase
    .from("gathering_attendance")
    .select("gathering_id")
    .eq("user_id", user.id)
    .gte("checked_in_at", thirtyDaysAgo);

  const myGatheringIds = (myAttendance ?? []).map((a: { gathering_id: string }) => a.gathering_id);

  // Shared events via event_attendees (open seats, etc.)
  const { data: myEventAttendance } = await supabase
    .from("event_attendees")
    .select("event_id")
    .eq("user_id", user.id)
    .gte("joined_at", thirtyDaysAgo);

  const myEventIds = (myEventAttendance ?? []).map((a: { event_id: string }) => a.event_id);

  // Existing bloom requests (any direction, any status) — to exclude
  const { data: existingRequests } = await supabase
    .from("bloom_requests")
    .select("from_user_id, to_user_id")
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`);

  const alreadyBloomed = new Set<string>();
  for (const r of existingRequests ?? []) {
    if (r.from_user_id !== user.id) alreadyBloomed.add(r.from_user_id);
    if (r.to_user_id !== user.id) alreadyBloomed.add(r.to_user_id);
  }

  const metProfiles = new Map<string, {
    id: string;
    first_name: string | null;
    full_name: string | null;
    avatar_url: string | null;
    neighborhood: string | null;
    shared_context: string;
    gathering_title: string | null;
    gathering_id: string | null;
  }>();

  // People from shared gatherings
  if (myGatheringIds.length > 0) {
    const { data: coAttendees } = await supabase
      .from("gathering_attendance")
      .select(`
        user_id,
        gathering_id,
        gatherings ( title, starts_at ),
        profiles!gathering_attendance_user_id_fkey ( id, first_name, full_name, avatar_url, neighborhood )
      `)
      .in("gathering_id", myGatheringIds)
      .neq("user_id", user.id)
      .gte("checked_in_at", thirtyDaysAgo)
      .limit(30);

    type CoAttendeeRow = {
      user_id: string;
      gathering_id: string;
      gatherings: { title: string; starts_at: string } | null;
      profiles: { id: string; first_name: string | null; full_name: string | null; avatar_url: string | null; neighborhood: string | null } | null;
    };

    for (const row of (coAttendees ?? []) as CoAttendeeRow[]) {
      if (!row.profiles || alreadyBloomed.has(row.user_id)) continue;
      if (!metProfiles.has(row.user_id)) {
        metProfiles.set(row.user_id, {
          ...row.profiles,
          shared_context: "gathering",
          gathering_title: row.gatherings?.title ?? null,
          gathering_id: row.gathering_id,
        });
      }
    }
  }

  // People from shared events (open seats)
  if (myEventIds.length > 0) {
    const { data: coEventees } = await supabase
      .from("event_attendees")
      .select(`
        user_id,
        event_id,
        events ( title ),
        profiles!event_attendees_user_id_fkey ( id, first_name, full_name, avatar_url, neighborhood )
      `)
      .in("event_id", myEventIds)
      .neq("user_id", user.id)
      .gte("joined_at", thirtyDaysAgo)
      .limit(20);

    type CoEventeeRow = {
      user_id: string;
      event_id: string;
      events: { title: string } | null;
      profiles: { id: string; first_name: string | null; full_name: string | null; avatar_url: string | null; neighborhood: string | null } | null;
    };

    for (const row of (coEventees ?? []) as CoEventeeRow[]) {
      if (!row.profiles || alreadyBloomed.has(row.user_id)) continue;
      if (!metProfiles.has(row.user_id)) {
        metProfiles.set(row.user_id, {
          ...row.profiles,
          shared_context: "event",
          gathering_title: row.events?.title ?? null,
          gathering_id: null,
        });
      }
    }
  }

  // Return up to 5 suggestions
  const suggestions = Array.from(metProfiles.values()).slice(0, 5);

  return NextResponse.json({ suggestions });
}
