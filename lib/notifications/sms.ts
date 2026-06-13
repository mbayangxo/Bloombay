// SMS notifications via Twilio
// Set these in .env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER

const ACCOUNT_SID  = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN   = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER  = process.env.TWILIO_FROM_NUMBER;

export interface SMSResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export async function sendSMS(to: string, body: string): Promise<SMSResult> {
  if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER) {
    console.warn("[SMS] Twilio not configured — set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER");
    return { ok: false, error: "SMS provider not configured" };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`;
  const creds = Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString("base64");

  const body_params = new URLSearchParams({ To: to, From: FROM_NUMBER, Body: body });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body_params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[SMS] Twilio error:", err);
    return { ok: false, error: err };
  }

  const data = await res.json() as { sid: string };
  return { ok: true, messageId: data.sid };
}

export function formatWeeklyDigest(
  firstName: string,
  events: Array<{ title: string; date: string; location: string }>,
): string {
  const greeting = `Hey ${firstName || "Bloomie"} 🌸`;

  if (events.length === 0) {
    return `${greeting}\n\nNothing in the diary this week yet — but BloomBay has new happenings dropping daily. Check the app! 💕\n\nbloombay.app`;
  }

  const eventLines = events.slice(0, 3).map(e => `✦ ${e.title} — ${e.date} · ${e.location}`).join("\n");
  const more = events.length > 3 ? `\n+${events.length - 3} more in the app` : "";

  return `${greeting}\n\nThis week in your city:\n${eventLines}${more}\n\nTap to join → bloombay.app`;
}
