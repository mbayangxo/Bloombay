import type { SupabaseClient } from "@supabase/supabase-js";
import type { NotificationChannel } from "./channel-rules";

/** Max in-app + email notifications per user per 24h (combined). */
export const RATE_LIMIT_COMBINED_IN_APP_EMAIL = 50;

/** Max email notifications per user per 24h. */
export const RATE_LIMIT_EMAIL = 10;

/** Max admin-triggered SMS per batch invocation. */
export const ADMIN_SMS_BATCH_LIMIT = 500;

const SINCE_24H = () => new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

async function countEvents(
  db: SupabaseClient,
  filters: Record<string, string | string[]>,
): Promise<number> {
  let query = db
    .from("notification_events")
    .select("*", { count: "exact", head: true })
    .in("status", ["sent", "pending"])
    .gte("created_at", SINCE_24H());

  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      query = query.in(key, value);
    } else {
      query = query.eq(key, value);
    }
  }

  const { count } = await query;
  return count ?? 0;
}

export async function isRateLimited(
  db: SupabaseClient,
  userId: string,
  channel: NotificationChannel,
): Promise<{ limited: boolean; reason?: string }> {
  if (channel === "email") {
    const emailCount = await countEvents(db, { user_id: userId, channel: "email" });
    if (emailCount >= RATE_LIMIT_EMAIL) {
      return { limited: true, reason: `email daily limit (${RATE_LIMIT_EMAIL})` };
    }
  }

  if (channel === "in_app" || channel === "email") {
    const combined = await countEvents(db, {
      user_id: userId,
      channel: ["in_app", "email"],
    });
    if (combined >= RATE_LIMIT_COMBINED_IN_APP_EMAIL) {
      return {
        limited: true,
        reason: `in_app+email daily limit (${RATE_LIMIT_COMBINED_IN_APP_EMAIL})`,
      };
    }
  }

  // SMS per-user cap (admin-triggered only)
  if (channel === "sms") {
    const smsCount = await countEvents(db, { user_id: userId, channel: "sms" });
    if (smsCount >= 3) {
      return { limited: true, reason: "sms daily limit (3)" };
    }
  }

  return { limited: false };
}
