// SMS notifications — all sends route through lib/sms/twilio-client (policy enforced).
import { sendSms } from "@/lib/sms/twilio-client";
import type { AllowedSmsType } from "@/lib/sms/policy";

export interface SMSResult {
  ok: boolean;
  messageId?: string;
  error?: string;
  blocked?: boolean;
}

export async function sendSMS(
  to: string,
  body: string,
  smsType: AllowedSmsType,
): Promise<SMSResult> {
  const result = await sendSms(to, body, smsType);
  if (result.blocked) {
    console.warn("[SMS] blocked by policy:", result.error);
  } else if (!result.ok && !result.skipped) {
    console.error("[SMS] Twilio error:", result.error);
  }
  return {
    ok: result.ok,
    error: result.error,
    blocked: result.blocked,
  };
}
