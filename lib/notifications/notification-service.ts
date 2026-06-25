// Central notification service — all notifications must flow through here.
// Routes should never call Twilio/Resend/insert-into-notifications directly.
// This service enforces: channel policy, user preferences, rate limits, and logging.

import { createAdminClient } from "@/lib/supabase/admin";
import {
  NotificationType,
  SMS_PERMITTED_TYPES,
  TemplateData,
  renderTemplate,
} from "./templates";

export type NotificationChannel = "in_app" | "email" | "sms";

export interface NotificationRequest {
  userId: string;
  type: NotificationType;
  channels: NotificationChannel[];
  data?: TemplateData;
  link?: string;
  // For SMS-permitted types triggered by admins/founders
  actorId?: string;
  actorRole?: string;
}

// Rate limits: max sends per user per channel per 24h
const RATE_LIMITS: Record<NotificationChannel, number> = {
  in_app: 50,
  email:  5,
  sms:    3,   // admin-triggered only, but still capped
};

async function isRateLimited(
  db: ReturnType<typeof createAdminClient>,
  userId: string,
  channel: NotificationChannel
): Promise<boolean> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await db
    .from("notification_events")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("channel", channel)
    .in("status", ["sent", "pending"])
    .gte("created_at", since);

  return (count ?? 0) >= RATE_LIMITS[channel];
}

async function getUserPreferences(
  db: ReturnType<typeof createAdminClient>,
  userId: string
) {
  const { data } = await db
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

async function logEvent(
  db: ReturnType<typeof createAdminClient>,
  userId: string,
  type: NotificationType,
  channel: NotificationChannel,
  payload: Record<string, unknown>,
  status: "sent" | "failed" | "skipped",
  errorMessage?: string
) {
  await db.from("notification_events").insert({
    user_id: userId,
    type,
    channel,
    payload,
    status,
    error_message: errorMessage ?? null,
    sent_at: status === "sent" ? new Date().toISOString() : null,
  });
}

// ── Channel senders ───────────────────────────────────────────────────────────

async function sendInApp(
  db: ReturnType<typeof createAdminClient>,
  userId: string,
  type: NotificationType,
  rendered: ReturnType<typeof renderTemplate>
): Promise<"sent" | "failed"> {
  const { error } = await db.from("notifications").insert({
    user_id: userId,
    type,
    title: rendered.title,
    body: rendered.body,
    link: rendered.link ?? null,
  });
  return error ? "failed" : "sent";
}

async function sendEmail(
  _db: ReturnType<typeof createAdminClient>,
  _userId: string,
  _type: NotificationType,
  _rendered: ReturnType<typeof renderTemplate>
): Promise<"sent" | "failed"> {
  // TODO: integrate Resend/SendGrid here
  // const email = await getUserEmail(db, userId);
  // await resend.emails.send({ to: email, subject: rendered.title, html: ... });
  return "sent"; // stub — mark as sent until email provider is wired
}

async function sendSms(
  _db: ReturnType<typeof createAdminClient>,
  _userId: string,
  _type: NotificationType,
  _rendered: ReturnType<typeof renderTemplate>
): Promise<"sent" | "failed"> {
  if (!_rendered.smsBody) return "failed";
  // TODO: call Twilio via lib/sms/twilio-client.ts
  // const phone = await getUserPhone(db, userId);
  // await sendSmsViaTwilio(phone, rendered.smsBody);
  return "sent"; // stub
}

// ── Main entry point ──────────────────────────────────────────────────────────

export async function sendNotification(req: NotificationRequest): Promise<void> {
  const db = createAdminClient();
  const rendered = renderTemplate(req.type, req.data ?? {});
  const prefs = await getUserPreferences(db, req.userId);

  for (const channel of req.channels) {
    const payload = {
      type: req.type,
      channel,
      data: req.data ?? {},
      actorId: req.actorId ?? null,
    };

    // ── SMS gate: only permitted types, only admin/founder-triggered ──────
    if (channel === "sms") {
      if (!SMS_PERMITTED_TYPES.has(req.type)) {
        await logEvent(db, req.userId, req.type, "sms", payload, "skipped",
          "SMS not permitted for this notification type");
        continue;
      }
      if (!req.actorId || !["admin", "founder"].includes(req.actorRole ?? "")) {
        await logEvent(db, req.userId, req.type, "sms", payload, "skipped",
          "SMS requires admin or founder actor");
        continue;
      }
    }

    // ── User preference gate ─────────────────────────────────────────────
    if (prefs) {
      if (channel === "in_app" && !prefs.in_app_enabled) {
        await logEvent(db, req.userId, req.type, channel, payload, "skipped", "user disabled in_app");
        continue;
      }
      if (channel === "email" && !prefs.email_enabled) {
        await logEvent(db, req.userId, req.type, channel, payload, "skipped", "user disabled email");
        continue;
      }
      if (channel === "sms" && !prefs.sms_enabled) {
        await logEvent(db, req.userId, req.type, channel, payload, "skipped", "user disabled sms");
        continue;
      }
    }

    // ── Rate limit gate ───────────────────────────────────────────────────
    if (await isRateLimited(db, req.userId, channel)) {
      await logEvent(db, req.userId, req.type, channel, payload, "skipped",
        `rate limit exceeded for ${channel}`);
      continue;
    }

    // ── Send ──────────────────────────────────────────────────────────────
    let status: "sent" | "failed";
    let errorMessage: string | undefined;

    try {
      if (channel === "in_app") {
        status = await sendInApp(db, req.userId, req.type, rendered);
      } else if (channel === "email") {
        status = await sendEmail(db, req.userId, req.type, rendered);
      } else {
        status = await sendSms(db, req.userId, req.type, rendered);
      }
    } catch (err) {
      status = "failed";
      errorMessage = err instanceof Error ? err.message : String(err);
    }

    await logEvent(db, req.userId, req.type, channel, payload, status, errorMessage);
  }
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

export function notifyInApp(
  userId: string,
  type: NotificationType,
  data?: TemplateData,
  link?: string
) {
  return sendNotification({ userId, type, channels: ["in_app"], data, link });
}

export function notifyMember(
  userId: string,
  type: NotificationType,
  data?: TemplateData
) {
  return sendNotification({ userId, type, channels: ["in_app", "email"], data });
}

// SMS-permitted types only — requires admin/founder actor
export function notifySmsBeta(
  userId: string,
  type: "private_beta_accepted" | "app_launch" | "urgent_safety",
  actorId: string,
  actorRole: "admin" | "founder",
  data?: TemplateData
) {
  return sendNotification({
    userId,
    type,
    channels: ["in_app", "sms"],
    data,
    actorId,
    actorRole,
  });
}
