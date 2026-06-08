import type { SupabaseClient } from "@supabase/supabase-js";
import { sendSms } from "@/lib/sms/twilio-client";

type ProfileSmsRow = {
  phone: string | null;
  sms_notifications: boolean | null;
};

/** Send SMS only when profiles.sms_notifications is true and phone is set. */
export async function sendSmsForUser(
  supabase: SupabaseClient,
  userId: string,
  body: string
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
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

  return sendSms(row.phone, body);
}
