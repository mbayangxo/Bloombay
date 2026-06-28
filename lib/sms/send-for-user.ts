import type { SupabaseClient } from "@supabase/supabase-js";
import { isAllowedSmsType, smsPolicyError } from "@/lib/sms/policy";
import { sendSms } from "@/lib/sms/twilio-client";

type ProfileSmsRow = {
  phone: string | null;
  sms_notifications: boolean | null;
};

/**
 * Send SMS to a profile when sms_notifications is enabled.
 * Requires an allowed SMS policy type — arbitrary bodies are blocked.
 */
export async function sendSmsForUser(
  supabase: SupabaseClient,
  userId: string,
  body: string,
  smsType: string,
): Promise<{ ok: boolean; skipped?: boolean; blocked?: boolean; error?: string }> {
  if (!isAllowedSmsType(smsType)) {
    return { ok: false, blocked: true, error: smsPolicyError(smsType) };
  }

  const { data: profile, error: readErr } = await supabase
    .from("profiles")
    .select("phone, sms_notifications")
    .eq("id", userId)
    .maybeSingle();

  if (readErr) {
    if (readErr.message.includes("does not exist")) {
      return { ok: false, skipped: true, error: "profiles columns missing — run migration 008" };
    }
    return { ok: false, error: readErr.message };
  }

  const row = profile as ProfileSmsRow | null;
  if (!row?.sms_notifications || !row.phone?.trim()) {
    return { ok: true, skipped: true };
  }

  return sendSms(row.phone, body, smsType);
}
