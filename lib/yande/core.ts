// Yande Core — action logging and permission enforcement
// Every agent routes through logAction() so there is always an audit trail.

import { createClient } from "@/lib/supabase/server";

export type RiskLevel = "low" | "medium" | "high";
export type ActionStatus = "completed" | "pending_approval" | "approved" | "rejected" | "failed";

export interface YandeActionInput {
  agent: string;
  action_type: string;
  risk_level?: RiskLevel;
  target_user_id?: string;
  metadata?: Record<string, unknown>;
  triggered_by?: string;
}

export interface YandeActionResult {
  id: string;
  status: ActionStatus;
}

// Log every action Yande takes, regardless of outcome.
export async function logAction(
  input: YandeActionInput,
  status: ActionStatus = "completed",
  error?: string,
): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("yande_actions")
      .insert({
        agent: input.agent,
        action_type: input.action_type,
        risk_level: input.risk_level ?? "low",
        status,
        target_user_id: input.target_user_id ?? null,
        metadata: input.metadata ?? {},
        triggered_by: input.triggered_by ?? "automatic",
        error_message: error ?? null,
      })
      .select("id")
      .single();
    return (data as { id: string } | null)?.id ?? null;
  } catch (err) {
    console.error("[Yande] Failed to log action:", err);
    return null;
  }
}

// Record that a member has received a specific type of touch.
// Returns false if they've already received it (idempotent).
export async function recordMemberTouch(
  userId: string,
  touchType: string,
  actionId?: string | null,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("yande_member_touches")
      .insert({ user_id: userId, touch_type: touchType, yande_action_id: actionId ?? null });
    return !error; // false if unique constraint hit (already sent)
  } catch {
    return false;
  }
}

// Check if a member has already received a touch type.
export async function hasReceivedTouch(userId: string, touchType: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("yande_member_touches")
    .select("id")
    .eq("user_id", userId)
    .eq("touch_type", touchType)
    .maybeSingle();
  return !!data;
}
