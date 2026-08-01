// Yande Compatibility Matching
//
// Scores two members for compatibility. Values, lifestyle, and life stage are
// the dominant signals — clubs and neighborhood are secondary texture.
//
// Scoring breakdown (100 pts total):
//   Values overlap          — up to 20 pts
//   Lifestyle alignment     — up to 20 pts  (dealbreaker conflicts apply here)
//   Life stage match        — up to 15 pts  (age group + mother status)
//   Activity preferences    — up to 15 pts
//   Dealbreaker safety      — up to 15 pts  (penalty if someone's avoid_vibes
//                                             match the other's lifestyle)
//   Shared clubs            — up to 10 pts
//   Neighborhood            —      5 pts

import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export interface CompatibilityScore {
  user_a:               string;
  user_b:               string;
  score:                number;        // 0–100
  shared_clubs:         string[];
  shared_neighborhood:  boolean;
  activity_match:       number;        // 0–1
  reasons:              string[];      // positive signals surfaced to members
  flags:                string[];      // internal only — potential friction points
  breakdown: {
    values_pct:    number;  // 0–100, from valuesScore (max 20 pts)
    vibe_pct:      number;  // 0–100, from lifestyleScore (max 20 pts)
    interests_pct: number;  // 0–100, from activityScore (max 15 pts)
    energy_pct:    number;  // 0–100, from lifeStageScore (max 15 pts)
  };
}

interface MemberPrefs {
  age_group:           string | null;
  is_mother:           boolean | null;
  relationship_status: string | null;
  faith:               string | null;
  faith_important:     boolean;
  lifestyle_tags:      string[];
  activity_types:      string[];
  core_values:         string[];
  friendship_style:    string | null;
  avoid_vibes:         string[];
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
  prefs:            MemberPrefs | null;
}

const EMPTY_PREFS: MemberPrefs = {
  age_group: null, is_mother: null, relationship_status: null,
  faith: null, faith_important: false,
  lifestyle_tags: [], activity_types: [], core_values: [],
  friendship_style: null, avoid_vibes: [],
};

// Lifestyle tags that signal someone avoids alcohol/bars/smoking
// Used to detect dealbreaker conflicts
const DRINKING_TAGS   = ["social_drinker"];
const SOBRIETY_TAGS   = ["sober", "sober_curious"];
const SMOKING_TAGS    = ["smoker"];
const NIGHTLIFE_TAGS  = ["night_owl", "nightlife"];
const AVOID_DRINKING  = ["heavy_drinking", "bar_scene", "nightlife"];
const AVOID_SMOKING   = ["smoking"];

function sharedCount(a: string[], b: string[]): number {
  return a.filter(x => b.includes(x)).length;
}

function sharedItems(a: string[], b: string[]): string[] {
  return a.filter(x => b.includes(x));
}

// ── Dealbreaker detection ─────────────────────────────────────────────────────
// Returns a penalty (negative) and flag messages for friction points.
// Does NOT hard-exclude — Yande surfaces better matches but never hides people entirely.

function dealbreakersScore(a: MemberPrefs, b: MemberPrefs): { penalty: number; flags: string[] } {
  let penalty = 0;
  const flags: string[] = [];

  // A avoids alcohol/bars but B is a social drinker or lists nightlife
  const aAvoidsDrinking = a.avoid_vibes.some(v => AVOID_DRINKING.includes(v));
  const bDrinks         = b.lifestyle_tags.some(t => DRINKING_TAGS.includes(t));
  if (aAvoidsDrinking && bDrinks) {
    penalty += 10;
    flags.push("A avoids drinking; B social drinker");
  }

  // Reverse
  const bAvoidsDrinking = b.avoid_vibes.some(v => AVOID_DRINKING.includes(v));
  const aDrinks         = a.lifestyle_tags.some(t => DRINKING_TAGS.includes(t));
  if (bAvoidsDrinking && aDrinks) {
    penalty += 10;
    flags.push("B avoids drinking; A social drinker");
  }

  // A avoids smoking but B smokes
  const aAvoidsSmoking = a.avoid_vibes.some(v => AVOID_SMOKING.includes(v));
  const bSmokes        = b.lifestyle_tags.some(t => SMOKING_TAGS.includes(t));
  if (aAvoidsSmoking && bSmokes) {
    penalty += 12;
    flags.push("A is non-smoker; B smokes");
  }

  const bAvoidsSmoking = b.avoid_vibes.some(v => AVOID_SMOKING.includes(v));
  const aSmokes        = a.lifestyle_tags.some(t => SMOKING_TAGS.includes(t));
  if (bAvoidsSmoking && aSmokes) {
    penalty += 12;
    flags.push("B is non-smoker; A smokes");
  }

  // Late nights: one avoids them, other is a night owl
  const aAvoidsLateNights = a.avoid_vibes.includes("late_nights");
  const bNightOwl         = b.lifestyle_tags.some(t => NIGHTLIFE_TAGS.includes(t));
  if (aAvoidsLateNights && bNightOwl) { penalty += 5; }

  const bAvoidsLateNights = b.avoid_vibes.includes("late_nights");
  const aNightOwl         = a.lifestyle_tags.some(t => NIGHTLIFE_TAGS.includes(t));
  if (bAvoidsLateNights && aNightOwl) { penalty += 5; }

  // Faith: if either says faith_important, check alignment
  if (a.faith_important && b.faith_important) {
    if (a.faith && b.faith && a.faith.toLowerCase() !== b.faith.toLowerCase()) {
      penalty += 5;
      flags.push(`Different faith: ${a.faith} / ${b.faith}`);
    }
  }
  if ((a.faith_important && !b.faith) || (b.faith_important && !a.faith)) {
    penalty += 3;
  }

  return { penalty: Math.min(penalty, 25), flags };
}

// ── Life stage ────────────────────────────────────────────────────────────────

function lifeStageScore(a: MemberPrefs, b: MemberPrefs): { pts: number; reasons: string[] } {
  let pts = 0;
  const reasons: string[] = [];

  // Same age group: 8 pts
  if (a.age_group && b.age_group && a.age_group === b.age_group) {
    pts += 8;
    reasons.push(`Both in their ${a.age_group}`);
  }
  // Adjacent age groups: 3 pts
  else if (a.age_group && b.age_group) {
    const order = ["20s","30s","40s","50+"];
    const diff  = Math.abs(order.indexOf(a.age_group) - order.indexOf(b.age_group));
    if (diff === 1) pts += 3;
  }

  // Both mothers / both non-mothers: 7 pts
  if (a.is_mother !== null && b.is_mother !== null) {
    if (a.is_mother === b.is_mother) {
      pts += 7;
      reasons.push(a.is_mother ? "Both moms" : "Both child-free");
    }
  }

  return { pts, reasons };
}

// ── Values ────────────────────────────────────────────────────────────────────

function valuesScore(a: MemberPrefs, b: MemberPrefs): { pts: number; reasons: string[] } {
  const shared = sharedItems(a.core_values, b.core_values);
  const pts    = Math.min(shared.length * 5, 20);
  const reasons: string[] = [];

  if (shared.length > 0) {
    const display = shared
      .slice(0, 3)
      .map(v => v.replace(/_/g, " "))
      .join(", ");
    reasons.push(`Shared values: ${display}`);
  }

  return { pts, reasons };
}

// ── Lifestyle alignment ────────────────────────────────────────────────────────

function lifestyleScore(a: MemberPrefs, b: MemberPrefs): { pts: number; reasons: string[] } {
  const shared  = sharedItems(a.lifestyle_tags, b.lifestyle_tags);
  let pts       = Math.min(shared.length * 4, 20);
  const reasons: string[] = [];

  // Bonus: both sober / sober-curious (strong alignment signal)
  const aSober = a.lifestyle_tags.some(t => SOBRIETY_TAGS.includes(t));
  const bSober = b.lifestyle_tags.some(t => SOBRIETY_TAGS.includes(t));
  if (aSober && bSober) {
    pts = Math.min(pts + 5, 20);
    reasons.push("Same energy around drinking");
  }

  if (shared.length > 0 && !reasons.length) {
    const display = shared.slice(0, 2).map(v => v.replace(/_/g, " ")).join(", ");
    reasons.push(`Similar lifestyle: ${display}`);
  }

  return { pts, reasons };
}

// ── Activity preferences ──────────────────────────────────────────────────────

function activityScore(a: MemberPrefs, b: MemberPrefs): { pts: number; reasons: string[] } {
  const shared  = sharedItems(a.activity_types, b.activity_types);
  const pts     = Math.min(shared.length * 3, 15);
  const reasons: string[] = [];

  if (shared.length > 0) {
    const display = shared.slice(0, 3).map(v => v.replace(/_/g, " ")).join(", ");
    reasons.push(`Both into: ${display}`);
  }

  return { pts, reasons };
}

// ── Full snapshot ─────────────────────────────────────────────────────────────

async function fetchMemberSnapshot(supabase: ReturnType<typeof admin>, userId: string): Promise<MemberSnapshot | null> {
  const [{ data: profile }, { data: graph }, { data: clubs }, { data: prefs }] = await Promise.all([
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

    supabase
      .from("member_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  if (!profile) return null;

  const p = prefs as (MemberPrefs & { id: string; user_id: string; updated_at: string }) | null;

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
    prefs: p ? {
      age_group:           p.age_group,
      is_mother:           p.is_mother,
      relationship_status: p.relationship_status,
      faith:               p.faith,
      faith_important:     p.faith_important ?? false,
      lifestyle_tags:      p.lifestyle_tags ?? [],
      activity_types:      p.activity_types ?? [],
      core_values:         p.core_values ?? [],
      friendship_style:    p.friendship_style,
      avoid_vibes:         p.avoid_vibes ?? [],
    } : null,
  };
}

// ── Main scoring function ─────────────────────────────────────────────────────

export async function scoreCompatibility(userIdA: string, userIdB: string): Promise<CompatibilityScore | null> {
  const supabase = admin();

  const [a, b] = await Promise.all([
    fetchMemberSnapshot(supabase, userIdA),
    fetchMemberSnapshot(supabase, userIdB),
  ]);

  if (!a || !b) return null;

  const pa = a.prefs ?? EMPTY_PREFS;
  const pb = b.prefs ?? EMPTY_PREFS;

  const reasons: string[] = [];
  const flags:   string[] = [];
  let score = 0;

  // ── Values (max 20) ────────────────────────────────────────────────────────
  const values = valuesScore(pa, pb);
  score += values.pts;
  reasons.push(...values.reasons);

  // ── Lifestyle alignment (max 20) ───────────────────────────────────────────
  const lifestyle = lifestyleScore(pa, pb);
  score += lifestyle.pts;
  reasons.push(...lifestyle.reasons);

  // ── Life stage (max 15) ────────────────────────────────────────────────────
  const lifeStage = lifeStageScore(pa, pb);
  score += lifeStage.pts;
  reasons.push(...lifeStage.reasons);

  // ── Activity preferences (max 15) ─────────────────────────────────────────
  const activities = activityScore(pa, pb);
  score += activities.pts;
  reasons.push(...activities.reasons);

  // ── Dealbreaker check (max -25 penalty, +15 if fully clean) ───────────────
  const dealbreakers = dealbreakersScore(pa, pb);
  if (dealbreakers.penalty === 0) {
    score += 15;  // clean signal — no friction
  } else {
    score -= dealbreakers.penalty;
    flags.push(...dealbreakers.flags);
  }

  // ── Shared clubs (max 10) ─────────────────────────────────────────────────
  const sharedClubIds  = a.clubs.filter(c => b.clubs.includes(c));
  const clubPts        = Math.min(sharedClubIds.length * 5, 10);
  score += clubPts;
  if (sharedClubIds.length > 0) {
    reasons.push(`${sharedClubIds.length} shared club${sharedClubIds.length > 1 ? "s" : ""}`);
  }

  // ── Neighborhood (5 pts) ──────────────────────────────────────────────────
  const sameNeighborhood = !!(a.neighborhood && b.neighborhood && a.neighborhood === b.neighborhood);
  if (sameNeighborhood) {
    score += 5;
    reasons.push(`Both in ${a.neighborhood}`);
  }

  // ── Activity level similarity (used as tiebreaker, 0–1) ──────────────────
  const aLevel = a.attendance_count * 3 + a.bloom_given + a.clubs_joined * 2;
  const bLevel = b.attendance_count * 3 + b.bloom_given + b.clubs_joined * 2;
  const activityMatch = (aLevel === 0 && bLevel === 0) ? 0.5
    : Math.min(aLevel, bLevel) / Math.max(aLevel, bLevel, 1);

  score = Math.max(0, Math.min(Math.round(score), 100));

  // Resolve club names
  let sharedClubNames: string[] = [];
  if (sharedClubIds.length > 0) {
    const { data: clubRows } = await supabase
      .from("clubs")
      .select("id, name")
      .in("id", sharedClubIds.slice(0, 3));
    sharedClubNames = (clubRows ?? []).map((c: { name: string }) => c.name);
  }

  return {
    user_a:              userIdA,
    user_b:              userIdB,
    score,
    shared_clubs:        sharedClubNames,
    shared_neighborhood: sameNeighborhood,
    activity_match:      activityMatch,
    reasons:             reasons.filter(Boolean),
    flags,
    breakdown: {
      values_pct:    Math.round((values.pts / 20) * 100),
      vibe_pct:      Math.round((lifestyle.pts / 20) * 100),
      interests_pct: Math.round((activities.pts / 15) * 100),
      energy_pct:    Math.round((lifeStage.pts / 15) * 100),
    },
  };
}

// ── Batch finder ──────────────────────────────────────────────────────────────

export async function findTopMatches(
  userId: string,
  opts: { limit?: number; minScore?: number } = {},
): Promise<Array<CompatibilityScore & { name: string }>> {
  const { limit = 5, minScore = 30 } = opts;
  const supabase = admin();

  const self = await fetchMemberSnapshot(supabase, userId);
  if (!self) return [];

  // Candidate pool: shared-club members first, then recently active
  const { data: clubCandidates } = await supabase
    .from("club_memberships")
    .select("user_id")
    .in("club_id", self.clubs.length > 0 ? self.clubs : ["__none__"])
    .neq("user_id", userId)
    .limit(80);

  const pool: string[] = clubCandidates?.length
    ? [...new Set((clubCandidates as { user_id: string }[]).map(c => c.user_id))]
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

  const candidates = pool.filter(id => !alreadyMet.has(id)).slice(0, 30);

  const scores = await Promise.all(candidates.map(id => scoreCompatibility(userId, id)));

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
