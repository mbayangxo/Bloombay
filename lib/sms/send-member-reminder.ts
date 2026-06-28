import type { SupabaseClient } from "@supabase/supabase-js";
import type { ReminderKind } from "@/lib/sms/reminder-message";
import { SMS_POLICY_BLOCKED_CODE, SMS_REMINDER_BLOCKED } from "@/lib/sms/policy";

/** @deprecated Blocked — calendar/seat/opt-in SMS is not permitted. Use createNotificationEvent (in_app/email). */
export async function sendMemberSmsReminder(
  _supabase: SupabaseClient,
  _userId: string,
  _input: {
    kind: ReminderKind;
    title?: string;
    when?: string;
    place?: string;
  },
): Promise<{ ok: boolean; skipped?: boolean; blocked?: boolean; error?: string }> {
  return {
    ok: false,
    blocked: true,
    error: `${SMS_POLICY_BLOCKED_CODE}: ${SMS_REMINDER_BLOCKED}`,
  };
}
