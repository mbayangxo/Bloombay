/**
 * Block enforcement helpers.
 * Call isBlocked() before allowing any user-to-user contact.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns true if either user has blocked the other.
 * Uses the caller's supabase client (works with both anon + service role).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function isBlocked(supabase: { from: (...args: any[]) => any }, userA: string, userB: string): Promise<boolean> {
  const { data } = await supabase
    .from("user_blocks")
    .select("id")
    .or(`and(blocker_id.eq.${userA},blocked_id.eq.${userB}),and(blocker_id.eq.${userB},blocked_id.eq.${userA})`)
    .limit(1)
    .maybeSingle();

  return data !== null;
}
