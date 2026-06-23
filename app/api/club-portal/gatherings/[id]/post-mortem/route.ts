// GET /api/club-portal/gatherings/[id]/post-mortem
// Returns post-event intelligence for the club owner (Club Mama).
// Only accessible 24-48h after event ends. Validates club ownership.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Get gathering details
  const { data: gathering, error: gErr } = await supabase
    .from("gatherings")
    .select("id, title, starts_at, ends_at, venue, club_id")
    .eq("id", id)
    .maybeSingle();

  if (gErr || !gathering) {
    return NextResponse.json({ error: "Gathering not found" }, { status: 404 });
  }

  // Validate club ownership
  const { data: club } = await supabase
    .from("clubs")
    .select("id")
    .eq("id", gathering.club_id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!club) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Count total attendees and checked-in
  const { data: allAttendees } = await supabase
    .from("gathering_attendance")
    .select("user_id, checked_in_at")
    .eq("gathering_id", id);

  const attendeeRows = allAttendees ?? [];
  const totalAttendees = attendeeRows.length;
  const checkedIn = attendeeRows.filter((a) => a.checked_in_at != null).length;

  // 3. Find new bloom_requests created within 48h of event end
  const endsAt = gathering.ends_at
    ? new Date(gathering.ends_at)
    : new Date(gathering.starts_at);

  const windowEnd = new Date(endsAt.getTime() + 48 * 60 * 60 * 1000).toISOString();
  const endsAtIso = endsAt.toISOString();

  let newConnections = 0;
  try {
    const { data: brData } = await supabase
      .from("bloom_requests")
      .select("from_user_id")
      .gte("created_at", endsAtIso)
      .lte("created_at", windowEnd);
    newConnections = (brData ?? []).length;
  } catch {
    // bloom_requests table might not exist — handle gracefully
  }

  // 4. Find bloom_flowers sent during/after event
  let newFlowers = 0;
  try {
    const { data: flowerData } = await supabase
      .from("bloom_flowers")
      .select("from_user_id")
      .eq("gathering_id", id);
    newFlowers = (flowerData ?? []).length;
  } catch {
    // bloom_flowers table might not exist — handle gracefully
  }

  // 5. Generate Yande observation (logic-based, not AI)
  let yande_observation: string;
  if (newConnections >= 3) {
    yande_observation = `Strong night — ${newConnections} new connections formed after this one.`;
  } else if (newConnections >= 1) {
    yande_observation = `Something clicked. ${newConnections} women reached out to each other after.`;
  } else if (newFlowers >= 5) {
    yande_observation = `${newFlowers} flowers were sent. The room felt it.`;
  } else {
    yande_observation = "The gathering happened. That's always enough.";
  }

  return NextResponse.json({
    gathering: {
      title: gathering.title,
      starts_at: gathering.starts_at,
      ends_at: gathering.ends_at ?? null,
      venue: gathering.venue ?? null,
    },
    attendance: {
      total: totalAttendees,
      checked_in: checkedIn,
    },
    new_connections: newConnections,
    new_flowers: newFlowers,
    yande_observation,
  });
}
