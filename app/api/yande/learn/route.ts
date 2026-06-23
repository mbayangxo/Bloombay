import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// POST /api/yande/learn
// Called by a weekly cron (Supabase pg_cron or Vercel cron).
// Yande reads all signals from the past week, analyzes patterns,
// updates compatibility weights, refreshes user memories, and
// queues proactive match suggestions.

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = admin();
  const results: string[] = [];

  // ── Step 1: Update compatibility weights from recent outcomes ──────────────
  results.push(...await updateCompatWeights(db));

  // ── Step 2: Refresh Yande memories for active users ───────────────────────
  results.push(...await refreshUserMemories(db));

  // ── Step 3: Queue proactive match suggestions ─────────────────────────────
  results.push(...await queueProactiveMatches(db));

  return NextResponse.json({ ok: true, log: results });
}

// ── Compatibility Weight Learning ─────────────────────────────────────────────
// Look at outcomes over the last 90 days.
// If "moved_in" or "met_in_person" correlates with a specific field overlap,
// increase that field's weight. If connections ghost, adjust accordingly.

async function updateCompatWeights(db: ReturnType<typeof admin>) {
  const log: string[] = [];

  const { data: outcomes } = await db
    .from("yande_match_outcomes")
    .select("feature, outcome, field_overlaps, compat_score_at_match")
    .gte("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

  if (!outcomes || outcomes.length === 0) {
    log.push("weights: no new outcomes to learn from yet");
    return log;
  }

  // Count which field overlaps appear in successful vs unsuccessful matches
  const fieldSuccess: Record<string, { positive: number; total: number }> = {};
  const positiveOutcomes = new Set(["moved_in", "met_in_person", "connected"]);

  for (const outcome of outcomes) {
    const isPositive = positiveOutcomes.has(outcome.outcome);
    const overlaps: string[] = outcome.field_overlaps?.matched_fields ?? [];
    for (const field of overlaps) {
      const key = `${outcome.feature}:${field}`;
      if (!fieldSuccess[key]) fieldSuccess[key] = { positive: 0, total: 0 };
      fieldSuccess[key].total++;
      if (isPositive) fieldSuccess[key].positive++;
    }
  }

  // Update weights: success rate relative to baseline
  for (const [key, stats] of Object.entries(fieldSuccess)) {
    if (stats.total < 3) continue; // not enough data
    const [feature, field_name] = key.split(":");
    const successRate = stats.positive / stats.total;
    // Normalize to 0.5–3.0 range
    const newWeight = Math.max(0.5, Math.min(3.0, successRate * 3));
    await db.from("yande_compat_weights").upsert(
      { feature, field_name, weight: newWeight, sample_size: stats.total, last_updated: new Date().toISOString() },
      { onConflict: "feature,field_name" }
    );
  }

  log.push(`weights: updated from ${outcomes.length} outcomes`);
  return log;
}

// ── User Memory Refresh ───────────────────────────────────────────────────────
// For every user who had signals in the past week, rebuild their Yande memory.
// This gives Yande context when she makes recommendations or writes notes.

async function refreshUserMemories(db: ReturnType<typeof admin>) {
  const log: string[] = [];
  const month = new Date().toISOString().slice(0, 7);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Get users who had signals this week
  const { data: activeUsers } = await db
    .from("yande_signals")
    .select("actor_id")
    .gte("created_at", weekAgo)
    .not("actor_id", "is", null);

  if (!activeUsers || activeUsers.length === 0) {
    log.push("memories: no active users this week");
    return log;
  }

  const userIds = [...new Set(activeUsers.map(u => u.actor_id as string))];

  for (const userId of userIds) {
    // Get all signals for this user this month
    const { data: signals } = await db
      .from("yande_signals")
      .select("feature, event_type, target_id, object_type, meta, created_at")
      .eq("actor_id", userId)
      .gte("created_at", `${month}-01T00:00:00Z`);

    if (!signals || signals.length === 0) continue;

    // Build feature-by-feature summary
    const byFeature: Record<string, Record<string, number>> = {};
    for (const s of signals) {
      if (!byFeature[s.feature]) byFeature[s.feature] = {};
      byFeature[s.feature][s.event_type] = (byFeature[s.feature][s.event_type] ?? 0) + 1;
    }

    const notes: string[] = [];

    if (byFeature["girlmate"]) {
      const g = byFeature["girlmate"];
      const parts: string[] = [];
      if (g["profile_viewed"])     parts.push(`browsed ${g["profile_viewed"]} GirlMate listings`);
      if (g["message_sent"])       parts.push(`messaged ${g["message_sent"]} women`);
      if (g["accepted"])           parts.push(`accepted ${g["accepted"]} match(es)`);
      if (g["declined_kindly"])    parts.push(`declined ${g["declined_kindly"]} kindly`);
      if (g["moved_in_confirmed"]) parts.push("confirmed a living match 🏠");
      if (parts.length) notes.push(`GirlMate: ${parts.join("; ")}.`);
    }

    if (byFeature["introductions"]) {
      const i = byFeature["introductions"];
      const parts: string[] = [];
      if (i["bloom_request_sent"])     parts.push(`sent ${i["bloom_request_sent"]} bloom request(s)`);
      if (i["bloom_request_accepted"]) parts.push(`accepted ${i["bloom_request_accepted"]}`);
      if (i["met_at_event"])           parts.push(`met ${i["met_at_event"]} women at events`);
      if (parts.length) notes.push(`Intros: ${parts.join("; ")}.`);
    }

    if (byFeature["clubs"]) {
      const c = byFeature["clubs"];
      if (c["joined"])     notes.push(`Joined ${c["joined"]} club(s) this month.`);
      if (c["co_attended"]) notes.push(`Co-attended events with ${c["co_attended"]} women.`);
    }

    if (notes.length === 0) continue;

    const note = notes.join(" ");
    await db.from("yande_memories").upsert(
      { user_id: userId, month_of: month, note, raw_data: { by_feature: byFeature, signal_count: signals.length } },
      { onConflict: "user_id,month_of" }
    );
  }

  log.push(`memories: refreshed ${userIds.length} users`);
  return log;
}

// ── Proactive Match Queue ─────────────────────────────────────────────────────
// Look for pairs of women who have high compatibility but haven't connected yet.
// Yande queues them as proactive suggestions to be shown in the UI.
//
// Algorithm: for GirlMates, find active listings with high field overlap
// that haven't exchanged messages yet. Score them using learned weights.

async function queueProactiveMatches(db: ReturnType<typeof admin>) {
  const log: string[] = [];

  // Get current compatibility weights
  const { data: weightRows } = await db
    .from("yande_compat_weights")
    .select("feature, field_name, weight")
    .eq("feature", "girlmate");

  const weights: Record<string, number> = {};
  for (const row of weightRows ?? []) {
    weights[row.field_name] = row.weight;
  }

  // Get active GirlMate listings with profile data
  const { data: listings } = await db
    .from("girlmate_profiles")
    .select(`
      id, user_id, listing_type, city, lifestyle_tags, cleanliness_level,
      noise_level, smoking, pets, halal_kitchen, religion, mom_status,
      drinking, personality_type, age_range
    `)
    .eq("is_active", true)
    .limit(200);

  if (!listings || listings.length < 2) {
    log.push("proactive: not enough listings to match yet");
    return log;
  }

  // Get pairs who have already messaged (exclude them)
  const { data: existingSignals } = await db
    .from("yande_signals")
    .select("actor_id, target_id")
    .eq("feature", "girlmate")
    .eq("event_type", "message_sent");

  const alreadyConnected = new Set(
    (existingSignals ?? []).map(s => `${s.actor_id}:${s.target_id}`)
  );

  // Score pairs
  const suggestions: Array<{ userA: string; userB: string; score: number; reason: string; overlaps: string[] }> = [];

  // Room seekers (co-search / roommate-wanted) matched against room posters
  const seekers = listings.filter(l => l.listing_type === "roommate-wanted" || l.listing_type === "co-search");
  const posters = listings.filter(l => l.listing_type === "room" || l.listing_type === "apartment");

  for (const seeker of seekers) {
    for (const poster of posters) {
      if (seeker.user_id === poster.user_id) continue;
      if (alreadyConnected.has(`${seeker.user_id}:${poster.user_id}`)) continue;
      if (seeker.city !== poster.city) continue;

      const { score, overlaps, reason } = scoreCompatibility(seeker, poster, weights);
      if (score >= 65) {
        suggestions.push({ userA: seeker.user_id, userB: poster.user_id, score, reason, overlaps });
      }
    }
  }

  // Sort by score desc, take top 50 new suggestions
  suggestions.sort((a, b) => b.score - a.score);
  const topSuggestions = suggestions.slice(0, 50);

  for (const s of topSuggestions) {
    await db.from("yande_match_queue").upsert(
      {
        user_a_id:    s.userA,
        user_b_id:    s.userB,
        feature:      "girlmate",
        compat_score: s.score,
        reason:       s.reason,
        signal_count: 0,
        status:       "pending",
      },
      { onConflict: "user_a_id,user_b_id,feature" }
    );
  }

  log.push(`proactive: queued ${topSuggestions.length} new match suggestions`);
  return log;
}

// ── Compatibility Scoring ─────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function scoreCompatibility(a: any, b: any, weights: Record<string, number>) {
  let score = 50; // baseline
  const overlaps: string[] = [];
  const reasonParts: string[] = [];

  const BINARY_FIELDS: Array<{ field: string; label: string }> = [
    { field: "smoking",          label: "same smoking preference" },
    { field: "pets",             label: "both agree on pets" },
    { field: "halal_kitchen",    label: "same kitchen needs" },
    { field: "cleanliness_level",label: "same cleanliness level" },
    { field: "noise_level",      label: "same noise level" },
    { field: "religion",         label: "same religion" },
    { field: "mom_status",       label: "compatible family status" },
    { field: "drinking",         label: "same drinking habits" },
    { field: "personality_type", label: "compatible personalities" },
  ];

  for (const { field, label } of BINARY_FIELDS) {
    if (a[field] !== null && b[field] !== null && a[field] === b[field]) {
      const w = weights[field] ?? 1.0;
      score += Math.round(w * 6);
      overlaps.push(field);
      reasonParts.push(label);
    }
  }

  // Lifestyle tag overlap
  const aTags: string[] = a.lifestyle_tags ?? [];
  const bTags: string[] = b.lifestyle_tags ?? [];
  const sharedTags = aTags.filter((t: string) => bTags.includes(t));
  if (sharedTags.length > 0) {
    score += Math.min(15, sharedTags.length * 4);
    overlaps.push("lifestyle_tags");
    reasonParts.push(`${sharedTags.length} shared lifestyle traits`);
  }

  // Cap at 98
  score = Math.min(98, score);

  const reason = reasonParts.length > 0
    ? reasonParts.slice(0, 3).join(", ") + "."
    : "Compatible profiles based on your answers.";

  return { score, overlaps, reason };
}
