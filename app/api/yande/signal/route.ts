import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as adminClient } from "@supabase/supabase-js";

function admin() {
  return adminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// POST /api/yande/signal
// Called by every feature whenever a meaningful interaction happens.
// Body: { feature, event_type, target_id?, object_id?, object_type?, meta?, app? }
//
// Examples:
//   { feature: "girlmate", event_type: "profile_viewed", target_id: "uuid", object_id: "listing-uuid" }
//   { feature: "girlmate", event_type: "message_sent", target_id: "uuid", meta: { compat_score: 87 } }
//   { feature: "introductions", event_type: "bloom_request_accepted", target_id: "uuid" }
//   { feature: "clubs", event_type: "co_attended", target_id: "uuid", object_id: "event-uuid" }

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { feature, event_type, target_id, object_id, object_type, meta, app } = body;

  if (!feature || !event_type) {
    return NextResponse.json({ error: "feature and event_type are required" }, { status: 400 });
  }

  const db = admin();

  // Write the signal
  const { error } = await db.from("yande_signals").insert({
    app:          app ?? "bloombay",
    feature,
    event_type,
    actor_id:     user.id,
    target_id:    target_id ?? null,
    object_id:    object_id ?? null,
    object_type:  object_type ?? null,
    meta:         meta ?? null,
  });

  if (error) {
    console.error("yande_signal write error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // For high-value events, queue a memory refresh asynchronously
  // (fire and forget — if this fails, the next cron will catch it)
  if (HIGH_VALUE_EVENTS.has(event_type)) {
    refreshMemoryAsync(user.id, feature, db).catch(console.error);
  }

  return NextResponse.json({ ok: true });
}

const HIGH_VALUE_EVENTS = new Set([
  "message_sent", "accepted", "declined_kindly", "moved_in_confirmed",
  "bloom_request_accepted", "came_with_me", "met_at_event",
]);

// Lightweight immediate memory refresh for high-value events
// (The full weekly cron does deeper analysis; this does a quick note update)
async function refreshMemoryAsync(
  userId: string,
  feature: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: { from: (...args: any[]) => any },
) {
  const month = new Date().toISOString().slice(0, 7); // "2026-06"

  // Count recent signals for this user in this feature
  const { data: signals } = await db
    .from("yande_signals")
    .select("event_type, target_id, created_at")
    .eq("actor_id", userId)
    .eq("feature", feature)
    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order("created_at", { ascending: false })
    .limit(50);

  if (!signals || signals.length === 0) return;

  const typedSignals = signals as { event_type: string; target_id: string; created_at: string }[];
  const counts = typedSignals.reduce<Record<string, number>>((acc, s) => {
    acc[s.event_type] = (acc[s.event_type] ?? 0) + 1;
    return acc;
  }, {});

  // Upsert a running memory note for this month
  const note = buildMemoryNote(feature, counts);
  if (!note) return;

  await db.from("yande_memories").upsert(
    { user_id: userId, month_of: month, note, raw_data: { feature, signal_counts: counts } },
    { onConflict: "user_id,month_of" }
  );
}

function buildMemoryNote(feature: string, counts: Record<string, number>): string | null {
  if (feature === "girlmate") {
    const parts: string[] = [];
    if (counts["profile_viewed"])   parts.push(`browsed ${counts["profile_viewed"]} listings`);
    if (counts["message_sent"])     parts.push(`messaged ${counts["message_sent"]} women`);
    if (counts["accepted"])         parts.push(`accepted ${counts["accepted"]} connection(s)`);
    if (counts["declined_kindly"])  parts.push(`declined ${counts["declined_kindly"]} kindly`);
    if (counts["moved_in_confirmed"]) parts.push("confirmed a match 🏠");
    if (parts.length === 0) return null;
    return `GirlMate: ${parts.join(", ")}.`;
  }
  if (feature === "introductions") {
    const parts: string[] = [];
    if (counts["bloom_request_sent"])     parts.push(`sent ${counts["bloom_request_sent"]} bloom request(s)`);
    if (counts["bloom_request_accepted"]) parts.push(`accepted ${counts["bloom_request_accepted"]}`);
    if (counts["came_with_me"])           parts.push(`did ${counts["came_with_me"]} activity(ies)`);
    if (parts.length === 0) return null;
    return `Introductions: ${parts.join(", ")}.`;
  }
  return null;
}
