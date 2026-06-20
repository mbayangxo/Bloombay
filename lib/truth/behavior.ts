import type { SupabaseClient } from "@supabase/supabase-js";

/** Phase 3 seed — log behavior for Yande memory without blocking UX. */
export async function logBehaviorSignal(
  supabase: SupabaseClient,
  userId: string,
  signalType: string,
  payload: Record<string, unknown>
) {
  try {
    await supabase.from("member_behavior_signals").insert({
      user_id: userId,
      signal_type: signalType,
      payload,
    });
  } catch {
    /* table may not exist yet */
  }
}
