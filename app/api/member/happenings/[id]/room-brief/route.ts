// GET /api/member/happenings/[id]/room-brief
// Returns a quiet briefing about who's attending this gathering (from the current member's perspective).

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
    .select("id, title, starts_at, venue")
    .eq("id", id)
    .maybeSingle();

  if (gErr || !gathering) {
    return NextResponse.json({ error: "Gathering not found" }, { status: 404 });
  }

  // 2. Get attendees (limit 20, exclude current user)
  const { data: attendees } = await supabase
    .from("gathering_attendance")
    .select("user_id")
    .eq("gathering_id", id)
    .neq("user_id", user.id)
    .limit(20);

  const attendeeIds = (attendees ?? []).map((a) => a.user_id);
  const attendee_count = attendeeIds.length;

  if (attendeeIds.length === 0) {
    return NextResponse.json({
      gathering: {
        title: gathering.title,
        starts_at: gathering.starts_at,
        venue: gathering.venue ?? null,
      },
      attendee_count: 0,
      people: [],
    });
  }

  // 3. Fetch profiles for attendees
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, full_name, avatar_url, neighborhood")
    .in("id", attendeeIds);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, p])
  );

  // 4. Fetch friendship_scores for current user with these attendees
  const { data: friendships } = await supabase
    .from("friendship_scores")
    .select("user_a, user_b, co_attendance_count, last_seen_together")
    .or(
      `and(user_a.eq.${user.id},user_b.in.(${attendeeIds.join(",")})),and(user_b.eq.${user.id},user_a.in.(${attendeeIds.join(",")}))`
    );

  type FriendshipRow = {
    user_a: string;
    user_b: string;
    co_attendance_count: number;
    last_seen_together: string | null;
  };

  const friendshipMap = new Map<string, FriendshipRow>();
  for (const f of (friendships ?? []) as FriendshipRow[]) {
    const other = f.user_a === user.id ? f.user_b : f.user_a;
    friendshipMap.set(other, f);
  }

  // 5. Fetch bloom_requests between current user and these attendees
  let bloomRequests: { from_user_id: string; to_user_id: string; status: string }[] = [];
  try {
    const { data: brData } = await supabase
      .from("bloom_requests")
      .select("from_user_id, to_user_id, status")
      .or(
        `and(from_user_id.eq.${user.id},to_user_id.in.(${attendeeIds.join(",")})),and(to_user_id.eq.${user.id},from_user_id.in.(${attendeeIds.join(",")}))`
      );
    bloomRequests = brData ?? [];
  } catch {
    // Table may not exist — handle gracefully
  }

  const bloomieSet = new Set<string>();
  for (const br of bloomRequests) {
    if (br.status === "accepted") {
      const other = br.from_user_id === user.id ? br.to_user_id : br.from_user_id;
      bloomieSet.add(other);
    }
  }

  // 6. Build connection hints using memory language only
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  function getConnectionHint(
    friendship: FriendshipRow | undefined
  ): string | null {
    if (!friendship) return null;
    const count = friendship.co_attendance_count ?? 0;
    const lastSeen = friendship.last_seen_together ?? null;

    if (count >= 3) {
      return `You've crossed paths ${count} times before.`;
    }
    if (count >= 1) {
      return "You've been at the same gathering before.";
    }
    if (lastSeen && lastSeen >= fourteenDaysAgo) {
      return "You were both at an event recently.";
    }
    return null;
  }

  // 7. Build people list, limit to 8
  const people = attendeeIds.slice(0, 8).map((uid) => {
    const profile = profileMap.get(uid);
    const friendship = friendshipMap.get(uid);

    const rawName =
      profile?.first_name ||
      (profile?.full_name ? profile.full_name.split(" ")[0] : null) ||
      "Member";

    return {
      user_id: uid,
      name: rawName,
      avatar_url: profile?.avatar_url ?? null,
      neighborhood: profile?.neighborhood ?? null,
      connection_hint: getConnectionHint(friendship),
      is_bloomie: bloomieSet.has(uid),
      co_attendance_count: friendship?.co_attendance_count ?? 0,
    };
  });

  return NextResponse.json({
    gathering: {
      title: gathering.title,
      starts_at: gathering.starts_at,
      venue: gathering.venue ?? null,
    },
    attendee_count,
    people,
  });
}
