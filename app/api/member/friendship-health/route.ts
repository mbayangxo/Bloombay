import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const LIMIT = 3;

type FriendshipScoreRow = {
  user_a: string;
  user_b: string;
  co_attendance_count: number;
  friend_scan_count: number;
  score: number;
  last_seen_together: string | null;
  updated_at: string;
};

type ProfileRow = {
  id: string;
  first_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  neighborhood: string | null;
};

type BloomRequestRow = {
  from_user_id: string;
  to_user_id: string;
};

export type FriendshipSignal = {
  user_id: string;
  name: string;
  first_name: string;
  avatar_url: string | null;
  neighborhood: string | null;
  score: number;
  co_attendance_count: number;
  last_seen_together: string | null;
  days_since: number | null;
  kind: "active" | "fading" | "forming";
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const me = user.id;

  // Fetch all friendship_scores where user_a = me OR user_b = me
  const { data: scoreRows, error: scoreError } = await supabase
    .from("friendship_scores")
    .select(
      "user_a, user_b, co_attendance_count, friend_scan_count, score, last_seen_together, updated_at"
    )
    .or(`user_a.eq.${me},user_b.eq.${me}`)
    .order("score", { ascending: false })
    .limit(30);

  if (scoreError) {
    if (scoreError.message.includes("does not exist")) {
      return NextResponse.json({ active: [], fading: [], forming: [] });
    }
    return NextResponse.json({ error: scoreError.message }, { status: 500 });
  }

  const scores = (scoreRows ?? []) as FriendshipScoreRow[];
  if (scores.length === 0) {
    return NextResponse.json({ active: [], fading: [], forming: [] });
  }

  // Collect paired user IDs
  const otherIds = scores.map((r) => (r.user_a === me ? r.user_b : r.user_a));
  const uniqueOtherIds = [...new Set(otherIds)];

  // Fetch profiles
  const { data: profileRows } = await supabase
    .from("profiles")
    .select("id, first_name, full_name, avatar_url, neighborhood")
    .in("id", uniqueOtherIds);

  const profileMap = new Map<string, ProfileRow>(
    ((profileRows ?? []) as ProfileRow[]).map((p) => [p.id, p])
  );

  // Fetch bloom_requests between me and any of these users
  let bloomedIds = new Set<string>();
  if (uniqueOtherIds.length > 0) {
    const orClauses = uniqueOtherIds
      .map(
        (id) =>
          `and(from_user_id.eq.${me},to_user_id.eq.${id}),and(from_user_id.eq.${id},to_user_id.eq.${me})`
      )
      .join(",");

    const { data: bloomRows } = await supabase
      .from("bloom_requests")
      .select("from_user_id, to_user_id")
      .or(orClauses);

    // Build a set of user IDs who already have a bloom request with me
    for (const req of (bloomRows ?? []) as BloomRequestRow[]) {
      const otherId =
        req.from_user_id === me ? req.to_user_id : req.from_user_id;
      bloomedIds.add(otherId);
    }
  }

  const now = Date.now();

  const active: FriendshipSignal[] = [];
  const fading: FriendshipSignal[] = [];
  const forming: FriendshipSignal[] = [];

  for (const row of scores) {
    if (active.length >= LIMIT && fading.length >= LIMIT && forming.length >= LIMIT) {
      break;
    }

    const otherId = row.user_a === me ? row.user_b : row.user_a;
    const profile = profileMap.get(otherId);

    const daysSince =
      row.last_seen_together !== null
        ? Math.floor(
            (now - new Date(row.last_seen_together).getTime()) / 86400000
          )
        : null;

    const withinThreshold =
      row.last_seen_together !== null &&
      daysSince !== null &&
      daysSince <= 21;

    const olderThanThreshold =
      row.last_seen_together !== null &&
      daysSince !== null &&
      daysSince > 21;

    const signal: Omit<FriendshipSignal, "kind"> = {
      user_id: otherId,
      name: profile?.full_name ?? profile?.first_name ?? "Member",
      first_name:
        profile?.first_name ??
        profile?.full_name?.split(" ")[0] ??
        "Member",
      avatar_url: profile?.avatar_url ?? null,
      neighborhood: profile?.neighborhood ?? null,
      score: row.score,
      co_attendance_count: row.co_attendance_count,
      last_seen_together: row.last_seen_together,
      days_since: daysSince,
    };

    // active: score >= 30 AND last_seen within 21 days
    if (active.length < LIMIT && row.score >= 30 && withinThreshold) {
      active.push({ ...signal, kind: "active" });
      continue;
    }

    // fading: score >= 20 AND last_seen older than 21 days
    if (fading.length < LIMIT && row.score >= 20 && olderThanThreshold) {
      fading.push({ ...signal, kind: "fading" });
      continue;
    }

    // forming: co_attendance_count >= 2 AND no bloom_request between them
    if (
      forming.length < LIMIT &&
      row.co_attendance_count >= 2 &&
      !bloomedIds.has(otherId)
    ) {
      forming.push({ ...signal, kind: "forming" });
      continue;
    }
  }

  return NextResponse.json({ active, fading, forming });
}
