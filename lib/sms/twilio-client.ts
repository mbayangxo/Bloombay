import { normalizePhone } from "@/lib/phone/normalize";
import { isAllowedSmsType, smsPolicyError } from "@/lib/sms/policy";

type TwilioConfig = {
  accountSid: string;
  authToken: string;
  fromNumber: string;
};

export type SendSmsResult = {
  ok: boolean;
  skipped?: boolean;
  blocked?: boolean;
  error?: string;
};

export function getTwilioConfig(): TwilioConfig | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  if (!accountSid || !authToken || !fromNumber) return null;
  return { accountSid, authToken, fromNumber };
}

/**
 * Send SMS via Twilio. All sends must declare an allowed policy type.
 * Direct Twilio calls outside this function are forbidden.
 */
export async function sendSms(
  to: string,
  body: string,
  smsType: string,
): Promise<SendSmsResult> {
  if (!isAllowedSmsType(smsType)) {
    return { ok: false, blocked: true, error: smsPolicyError(smsType) };
  }

  const config = getTwilioConfig();
  if (!config) {
    return { ok: false, skipped: true, error: "Twilio not configured" };
  }

  const normalized = normalizePhone(to);
  if (!normalized) {
    return { ok: false, error: "Invalid phone number" };
  }

  const auth = Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64");
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: normalized,
        From: config.fromNumber,
        Body: body,
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: text || res.statusText };
  }

  return { ok: true };
}
