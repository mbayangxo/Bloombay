import { normalizePhone } from "@/lib/phone/normalize";

type TwilioConfig = {
  accountSid: string;
  authToken: string;
  fromNumber: string;
};

export function getTwilioConfig(): TwilioConfig | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  // lib/notifications/sms.ts (used by the webhook, waitlist, reservations)
  // reads TWILIO_FROM_NUMBER for the same purpose; .env.example only
  // documents that name. Accept both so this file works regardless of
  // which one is actually set in the deployed environment.
  const fromNumber = process.env.TWILIO_FROM_NUMBER || process.env.TWILIO_PHONE_NUMBER;
  if (!accountSid || !authToken || !fromNumber) return null;
  return { accountSid, authToken, fromNumber };
}

export async function sendSms(
  to: string,
  body: string
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
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
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: text || res.statusText };
  }

  return { ok: true };
}
