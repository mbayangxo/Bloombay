// Yande Compatibility Matching
//
// Scores two members for compatibility using real signals from the memory graph
// and their shared clubs, neighborhoods, and activity patterns.
// Used by the Community Intelligence cron for introductions.
// Also exposed for the Introductions page % score.

import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export interface CompatibilityScore {
  user_a:           string;
  user_b:           string;
  score:            number;   // 0–100
  shared_clubs:     string[];
  shared_neighborhood: boolean;
  activity_match:   number;   // 0–1, how similar their activity levels are
  reasons:          string[]; // human-readable explanation bullets
}

interface MemberSnapshot {
  user_id:          string;
  first_name:       string | null;
  full_name:        string | null;
  neighborhood:     string | null;
  clubs:            string[];
  attendance_count: number;
  bloom_given:      number;
  clubs_joined:     number;
  friendship_score: number;
}

async function fetchMemberSnapshot(supabase: ReturnType<typeof admin>, userId: string): Promise<MemberSnapshot | null> {
  const [{ data: profile }, { data: graph }, { data: clubs }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, first_name, full_name, neighborhood")
      .eq("id", userId)
      .maybeSingle(),

    supabase
      .from("member_memory_graph")
      .select("attendance_count, bloom_given, clubs_joined, friendship_score")
      .eq("user_id", userId)
      .maybeSingle(),

    supabase
      .from("club_memberships")
      .select("club_id")
      .eq("user_id", userId)
      .limit(20),
  ]);

  if (!profile) return null;

  return {
    user_id:          userId,
    first_name:       profile.first_name,
    full_name:        profile.full_name,
    neighborhood:     profile.neighborhood ?? null,
    clubs:            (clubs ?? []).map((c: { club_id: string }) => c.club_id),
    attendance_count: graph?.attendance_count ?? 0,
    bloom_given:      graph?.bloom_given ?? 0,
    clubs_joined:     graph?.clubs_joined ?? 0,
    friendship_score: graph?.friendship_score ?? 0,
  };
}

function computeActivitySimilarity(a: MemberSnapshot, b: MemberSnapshot): number {
  const aScore = a.attendance_count * 3 + a.bloom_given + a.clubs_joined * 2;
  const bScore = b.attendance_count * 3 + b.bloom_given + b.clubs_joined * 2;
  if (aScore === 0 && bScore === 0) return 0.5;
  const max = Math.max(aScore, bScore);
  const min = Math.min(aScore, bScore);
  return max > 0 ? min / max : 0;
}

// Score two specific members for compatibility.
export async function scoreCompatibility(userIdA: string, userIdB: string): Promise<CompatibilityScore | null> {
  const supabase = admin();

  const [a, b] = await Promise.all([
    fetchMemberSnapshot(supabase, userIdA),
    fetchMemberSnapshot(supabase, userIdB),
  ]);

  if (!a || !b) return null;

  const sharedClubs     = a.clubs.filter(c => b.clubs.includes(c));
  const sameNeighborhood = !!(a.neighborhood && b.neighborhood && a.neighborhood === b.neighborhood);
  const activityMatch   = computeActivitySimilarity(a, b);

  let score = 0;
  const reasons: string[] = [];

  // Shared clubs: 15 points each, max 45
  const clubPoints = Math.min(sharedClubs.length * 15, 45);
  score += clubPoints;

  // Same neighborhood: 20 points
  if (sameNeighborhood) {
    score += 20;
    reasons.push(`Both in ${a.neighborhood}`);
  }

  // Activity similarity: up to 20 points
  const activityPoints = Math.round(activityMatch * 20);
  score += activityPoints;

  // Both have attended events: 10 bonus
  if (a.attendance_count > 0 && b.attendance_count > 0) {
    score += 10;
    reasons.push("Both attend events");
  }

  // Both give blooms: 5 bonus (generous people connect well)
  if (a.bloom_given > 2 && b.bloom_given > 2) {
    score += 5;
    reasons.push("Similar energy");
  }

  if (sharedClubs.length > 0) {
    reasons.push(`${sharedClubs.length} shared club${sharedClubs.length > 1 ? "s" : ""}`);
  }
  if (activityMatch > 0.7) {
    reasons.push("Similar pace on the platform");
  }

  score = Math.min(Math.round(score), 100);

  // Resolve club names for display
  let sharedClubNames: string[] = [];
  if (sharedClubs.length > 0) {
    const { data: clubRows } = await supabase
      .from("clubs")
      .select("id, name")
      .in("id", sharedClubs.slice(0, 3));
    sharedClubNames = (clubRows ?? []).map((c: { name: string }) => c.name);
  }

  return {
    user_a:               userIdA,
    user_b:               userIdB,
    score,
    shared_clubs:         sharedClubNames,
    shared_neighborhood:  sameNeighborhood,
    activity_match:       activityMatch,
    reasons,
  };
}

// Find the best matches for a given member from a pool of candidates.
// Returns candidates ranked by compatibility score, highest first.
export async function findTopMatches(
  userId: string,
  opts: { limit?: number; minScore?: number } = {},
): Promise<Array<CompatibilityScore & { name: string }>> {
  const { limit = 5, minScore = 30 } = opts;
  const supabase = admin();

  // Get the member's own snapshot
  const self = await fetchMemberSnapshot(supabase, userId);
  if (!self) return [];

  // Pull candidates: active members with at least one shared signal (club)
  // who haven't already been introduced to this member
  const { data: candidateIds } = await supabase
    .from("club_memberships")
    .select("user_id")
    .in("club_id", self.clubs.length > 0 ? self.clubs : ["__none__"])
    .neq("user_id", userId)
    .limit(100);

  // Fall back to recently active members if no shared clubs
  const pool = candidateIds?.length
    ? [...new Set((candidateIds as { user_id: string }[]).map(c => c.user_id))]
    : await (async () => {
        const { data: active } = await supabase
          .from("member_memory_graph")
          .select("user_id")
          .neq("user_id", userId)
          .order("last_active_at", { ascending: false })
          .limit(50);
        return (active ?? []).map((a: { user_id: string }) => a.user_id);
      })();

  // Filter already-introduced pairs
  const { data: existing } = await supabase
    .from("introductions")
    .select("sender_id, receiver_id")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

  const alreadyMet = new Set<string>();
  for (const intro of (existing ?? [])) {
    alreadyMet.add(intro.sender_id === userId ? intro.receiver_id : intro.sender_id);
  }

  const candidates = pool.filter(id => !alreadyMet.has(id));

  // Score all candidates
  const scores = await Promise.all(
    candidates.slice(0, 30).map(candidateId => scoreCompatibility(userId, candidateId)),
  );

  // Fetch names for results
  const results = scores
    .filter((s): s is CompatibilityScore => s !== null && s.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const profileIds = results.map(r => r.user_b);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, full_name")
    .in("id", profileIds);

  const nameMap = new Map((profiles ?? []).map((p: { id: string; first_name: string | null; full_name: string | null }) => [
    p.id,
    (p.full_name ?? p.first_name ?? "").split(" ")[0] || "Someone",
  ]));

  return results.map(r => ({ ...r, name: nameMap.get(r.user_b) ?? "Someone" }));
}
