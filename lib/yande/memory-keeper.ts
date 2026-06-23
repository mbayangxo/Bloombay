// Yande Memory Keeper
//
// Reads unprocessed memory_events and updates the member_memory_graph.
// Designed to run daily so Yande's understanding of each member stays current.
//
// This is the only agent that writes to member_memory_graph — all others read from it.

import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export type MemoryEventType =
  | "event_attended"
  | "club_joined"
  | "bloom_sent"
  | "bloom_received"
  | "plan_created"
  | "plan_joined"
  | "bloom_request_sent"
  | "bloom_request_accepted"
  | "message_sent"
  | "profile_updated";

interface MemoryEvent {
  id: string;
  user_id: string;
  event_type: MemoryEventType;
  payload: Record<string, unknown>;
  created_at: string;
}

interface GraphUpdates {
  attendance_count?: number;
  clubs_joined?: number;
  bloom_given?: number;
  bloom_received?: number;
  last_active_at?: string;
  first_event_at?: string;
  milestones?: Record<string, string>;
}

async function fetchCurrentGraph(supabase: ReturnType<typeof admin>, userId: string) {
  const { data } = await supabase
    .from("member_memory_graph")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

function applyEvent(
  current: Record<string, unknown> | null,
  event: MemoryEvent,
): Partial<GraphUpdates> {
  const now = event.created_at;
  const updates: Partial<GraphUpdates> = { last_active_at: now };

  switch (event.event_type) {
    case "event_attended": {
      updates.attendance_count = ((current?.attendance_count as number) ?? 0) + 1;
      if (!current?.first_event_at) updates.first_event_at = now;
      const milestones = (current?.milestones as Record<string, string>) ?? {};
      if (!milestones.first_event) updates.milestones = { ...milestones, first_event: now };
      break;
    }
    case "club_joined": {
      updates.clubs_joined = ((current?.clubs_joined as number) ?? 0) + 1;
      break;
    }
    case "bloom_sent": {
      updates.bloom_given = ((current?.bloom_given as number) ?? 0) + 1;
      break;
    }
    case "bloom_received": {
      updates.bloom_received = ((current?.bloom_received as number) ?? 0) + 1;
      const milestones = (current?.milestones as Record<string, string>) ?? {};
      if (!milestones.first_bloom_received) {
        updates.milestones = { ...milestones, first_bloom_received: now };
      }
      break;
    }
    case "plan_created": {
      const milestones = (current?.milestones as Record<string, string>) ?? {};
      if (!milestones.first_plan) updates.milestones = { ...milestones, first_plan: now };
      break;
    }
    case "bloom_request_accepted": {
      const milestones = (current?.milestones as Record<string, string>) ?? {};
      if (!milestones.first_bloomie) updates.milestones = { ...milestones, first_bloomie: now };
      break;
    }
  }

  return updates;
}

function computeChurnRisk(graph: Record<string, unknown>): number {
  const lastActive = graph.last_active_at as string | null;
  if (!lastActive) return 0.8;

  const daysSilent = (Date.now() - new Date(lastActive).getTime()) / 86400000;
  // Simple decay: 0–7 days = low risk; 14+ = high risk
  if (daysSilent < 7)  return 0.05;
  if (daysSilent < 14) return 0.25;
  if (daysSilent < 21) return 0.50;
  if (daysSilent < 30) return 0.75;
  return 0.90;
}

function computeFriendshipScore(graph: Record<string, unknown>): number {
  let score = 0;
  score += Math.min(((graph.attendance_count as number) ?? 0) * 8,  32);
  score += Math.min(((graph.clubs_joined    as number) ?? 0) * 6,  18);
  score += Math.min(((graph.bloom_given     as number) ?? 0) * 2,  20);
  score += Math.min(((graph.bloom_received  as number) ?? 0) * 2,  20);
  return Math.min(Math.round(score), 100);
}

// Upsert the memory graph for a single user given a batch of events for that user.
async function processUserEvents(
  supabase: ReturnType<typeof admin>,
  userId: string,
  events: MemoryEvent[],
): Promise<void> {
  const current = await fetchCurrentGraph(supabase, userId);
  let merged: Record<string, unknown> = { ...(current ?? {}) };

  for (const event of events) {
    const updates = applyEvent(merged, event);
    merged = { ...merged, ...updates };
  }

  const churn_risk       = computeChurnRisk(merged);
  const friendship_score = computeFriendshipScore(merged);

  await supabase.from("member_memory_graph").upsert(
    {
      user_id:          userId,
      attendance_count: (merged.attendance_count as number) ?? 0,
      clubs_joined:     (merged.clubs_joined     as number) ?? 0,
      bloom_given:      (merged.bloom_given       as number) ?? 0,
      bloom_received:   (merged.bloom_received    as number) ?? 0,
      last_active_at:   merged.last_active_at,
      first_event_at:   merged.first_event_at ?? null,
      milestones:       merged.milestones ?? {},
      friendship_score,
      churn_risk,
      updated_at:       new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

// Main batch runner — called from the cron route.
export async function runMemoryKeeper(): Promise<{ processed: number; users: number; errors: number }> {
  const supabase = admin();

  // Grab up to 500 unprocessed events, ordered oldest-first.
  const { data: events, error } = await supabase
    .from("memory_events")
    .select("id, user_id, event_type, payload, created_at")
    .eq("processed", false)
    .order("created_at", { ascending: true })
    .limit(500);

  if (error || !events?.length) {
    return { processed: 0, users: 0, errors: error ? 1 : 0 };
  }

  // Group by user so we can do one upsert per member.
  const byUser = new Map<string, MemoryEvent[]>();
  for (const e of events) {
    const list = byUser.get(e.user_id) ?? [];
    list.push(e as MemoryEvent);
    byUser.set(e.user_id, list);
  }

  let users = 0;
  let errors = 0;
  const processed_ids: string[] = [];

  for (const [userId, userEvents] of byUser) {
    try {
      await processUserEvents(supabase, userId, userEvents);
      processed_ids.push(...userEvents.map(e => e.id));
      users++;
    } catch (err) {
      console.error("[MemoryKeeper] error for user", userId, err);
      errors++;
    }
  }

  // Mark events as processed in batch.
  if (processed_ids.length) {
    await supabase
      .from("memory_events")
      .update({ processed: true })
      .in("id", processed_ids);
  }

  return { processed: processed_ids.length, users, errors };
}

// Convenience: write a memory event from server-side code.
export async function writeMemoryEvent(
  userId: string,
  eventType: MemoryEventType,
  payload: Record<string, unknown> = {},
): Promise<void> {
  const supabase = admin();
  await supabase.from("memory_events").insert({ user_id: userId, event_type: eventType, payload });
}
