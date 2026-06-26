// Central notification service — all notifications must flow through here.
// Routes should never call Twilio/Resend/insert-into-notifications directly.

import { getResendClient, resendFromAddress } from "@/lib/email/resend-client";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeAdminAuditLog } from "@/lib/admin/audit-log";
import {
  type NotificationChannel,
  defaultChannelsForType,
  isChannelEnabled,
  isSmsBlocked,
  isTopicEnabled,
  requiresAdminActor,
  resolveChannels,
} from "./channel-rules";
import { ADMIN_SMS_BATCH_LIMIT, isRateLimited } from "./rate-limits";
import { sendSMS } from "./sms";
import {
  type NotificationType,
  type TemplateData,
  renderTemplate,
} from "./templates";

export type { NotificationChannel, NotificationType };

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  channels?: NotificationChannel[];
  payload: {
    title?: string;
    body?: string;
    link?: string;
    templateId?: string;
    templateVars?: Record<string, string>;
    subject?: string;
    html?: string;
    data?: Record<string, unknown>;
  };
  /** Skip preference check (urgent safety only) */
  force?: boolean;
  /** Required for admin-triggered SMS */
  actorId?: string;
  actorRole?: string;
}

export interface AdminWaitlistSmsInput {
  template: "private_beta_accepted" | "app_launch";
  targets: Array<{
    waitlistId: string;
    phoneNumber: string;
    firstName?: string | null;
    email?: string;
  }>;
  actorId: string;
  actorRole: "admin" | "founder";
  dryRun?: boolean;
}

interface RenderedContent {
  title: string;
  body: string;
  smsBody?: string;
  link?: string;
  subject?: string;
  html?: string;
}

function templateDataFromPayload(
  payload: CreateNotificationInput["payload"],
): TemplateData {
  const vars = payload.templateVars ?? {};
  return {
    name: vars.name ?? vars.firstName,
    restaurantName: vars.restaurantName,
    date: vars.date,
    time: vars.time,
    partySize: vars.partySize ? Number(vars.partySize) : undefined,
    clubName: vars.clubName,
    eventTitle: vars.eventTitle ?? vars.title,
    appUrl: vars.appUrl,
    code: vars.code,
    message: vars.message ?? payload.body,
  };
}

function resolveContent(
  type: NotificationType,
  payload: CreateNotificationInput["payload"],
): RenderedContent {
  const rendered = renderTemplate(type, templateDataFromPayload(payload));
  return {
    title: payload.title ?? rendered.title,
    body: payload.body ?? rendered.body,
    smsBody: rendered.smsBody,
    link: payload.link ?? rendered.link,
    subject: payload.subject ?? rendered.title,
    html: payload.html,
  };
}

async function getUserPreferences(db: ReturnType<typeof createAdminClient>, userId: string) {
  const { data } = await db
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

async function getUserContact(
  db: ReturnType<typeof createAdminClient>,
  userId: string,
): Promise<{ email: string | null; phone: string | null }> {
  const { data } = await db
    .from("profiles")
    .select("email, phone")
    .eq("id", userId)
    .maybeSingle();
  return {
    email: (data?.email as string | null) ?? null,
    phone: (data?.phone as string | null) ?? null,
  };
}

async function insertPendingEvent(
  db: ReturnType<typeof createAdminClient>,
  userId: string,
  type: NotificationType,
  channel: NotificationChannel,
  payload: Record<string, unknown>,
): Promise<string | null> {
  const { data, error } = await db
    .from("notification_events")
    .insert({
      user_id: userId,
      type,
      channel,
      payload,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[notification-service] failed to insert event:", error.message);
    return null;
  }
  return (data as { id: string }).id;
}

async function updateEventStatus(
  db: ReturnType<typeof createAdminClient>,
  eventId: string | null,
  status: "sent" | "failed" | "skipped",
  errorMessage?: string,
) {
  if (!eventId) return;
  await db
    .from("notification_events")
    .update({
      status,
      error_message: errorMessage ?? null,
      sent_at: status === "sent" ? new Date().toISOString() : null,
    })
    .eq("id", eventId);
}

async function sendInApp(
  db: ReturnType<typeof createAdminClient>,
  userId: string,
  type: NotificationType,
  content: RenderedContent,
  data?: Record<string, unknown>,
): Promise<"sent" | "failed"> {
  const { error } = await db.from("notifications").insert({
    user_id: userId,
    type,
    title: content.title,
    body: content.body,
    link: content.link ?? null,
    data: data ?? null,
  });
  return error ? "failed" : "sent";
}

async function sendEmail(
  db: ReturnType<typeof createAdminClient>,
  userId: string,
  content: RenderedContent,
): Promise<"sent" | "failed" | "skipped"> {
  const resend = getResendClient();
  if (!resend) return "skipped";

  const { email } = await getUserContact(db, userId);
  if (!email) return "skipped";

  const { error } = await resend.emails.send({
    from: resendFromAddress(),
    to: email,
    subject: content.subject ?? content.title,
    html: content.html ?? `<p>${content.body}</p>`,
  });

  return error ? "failed" : "sent";
}

async function sendSmsToPhone(
  phone: string,
  content: RenderedContent,
): Promise<"sent" | "failed"> {
  if (!content.smsBody) return "failed";
  const result = await sendSMS(phone, content.smsBody);
  return result.ok ? "sent" : "failed";
}

async function sendSmsForUser(
  db: ReturnType<typeof createAdminClient>,
  userId: string,
  content: RenderedContent,
): Promise<"sent" | "failed" | "skipped"> {
  const { phone } = await getUserContact(db, userId);
  if (!phone) return "skipped";
  return sendSmsToPhone(phone, content);
}

function isAdminRole(role?: string): boolean {
  return role === "admin" || role === "founder";
}

/** Core entry point — creates events, applies rules, sends, and logs outcomes. */
export async function createNotificationEvent(
  input: CreateNotificationInput,
): Promise<{ eventIds: string[] }> {
  const db = createAdminClient();
  const channels = resolveChannels(input.type, input.channels);
  const content = resolveContent(input.type, input.payload);
  const prefs = await getUserPreferences(db, input.userId);
  const eventIds: string[] = [];

  for (const channel of channels) {
    const eventPayload = {
      type: input.type,
      channel,
      payload: input.payload,
      actorId: input.actorId ?? null,
    };

    if (channel === "sms") {
      if (isSmsBlocked(input.type)) {
        const eventId = await insertPendingEvent(db, input.userId, input.type, channel, eventPayload);
        await updateEventStatus(db, eventId, "skipped", "SMS not permitted for this notification type");
        if (eventId) eventIds.push(eventId);
        continue;
      }
      if (requiresAdminActor(input.type, channel) && !isAdminRole(input.actorRole)) {
        const eventId = await insertPendingEvent(db, input.userId, input.type, channel, eventPayload);
        await updateEventStatus(db, eventId, "skipped", "SMS requires admin or founder actor");
        if (eventId) eventIds.push(eventId);
        continue;
      }
    }

    if (!input.force) {
      if (!isTopicEnabled(prefs, input.type)) {
        const eventId = await insertPendingEvent(db, input.userId, input.type, channel, eventPayload);
        await updateEventStatus(db, eventId, "skipped", "user disabled topic");
        if (eventId) eventIds.push(eventId);
        continue;
      }
      if (!isChannelEnabled(prefs, channel)) {
        const eventId = await insertPendingEvent(db, input.userId, input.type, channel, eventPayload);
        await updateEventStatus(db, eventId, "skipped", `user disabled ${channel}`);
        if (eventId) eventIds.push(eventId);
        continue;
      }
    }

    const rate = await isRateLimited(db, input.userId, channel);
    if (rate.limited) {
      const eventId = await insertPendingEvent(db, input.userId, input.type, channel, eventPayload);
      await updateEventStatus(db, eventId, "skipped", rate.reason);
      if (eventId) eventIds.push(eventId);
      continue;
    }

    const eventId = await insertPendingEvent(db, input.userId, input.type, channel, eventPayload);
    if (eventId) eventIds.push(eventId);

    let status: "sent" | "failed" | "skipped" = "failed";
    let errorMessage: string | undefined;

    try {
      if (channel === "in_app") {
        status = await sendInApp(db, input.userId, input.type, content, input.payload.data);
      } else if (channel === "email") {
        status = await sendEmail(db, input.userId, content);
      } else {
        status = await sendSmsForUser(db, input.userId, content);
      }
    } catch (err) {
      status = "failed";
      errorMessage = err instanceof Error ? err.message : String(err);
    }

    await updateEventStatus(db, eventId, status, errorMessage);
  }

  return { eventIds };
}

/** Admin batch SMS for waitlist members (no profile user_id). */
export async function sendAdminWaitlistSmsBatch(
  input: AdminWaitlistSmsInput,
): Promise<{ sent: number; failed: number; errors: string[]; sentWaitlistIds: string[]; dryRun?: boolean }> {
  if (!isAdminRole(input.actorRole)) {
    return { sent: 0, failed: 0, errors: ["SMS requires admin or founder actor"], sentWaitlistIds: [] };
  }

  const targets = input.targets.slice(0, ADMIN_SMS_BATCH_LIMIT);

  if (input.dryRun) {
    return {
      sent: 0,
      failed: 0,
      errors: [],
      sentWaitlistIds: [],
      dryRun: true,
    };
  }

  const db = createAdminClient();
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  const sentWaitlistIds: string[] = [];

  for (const row of targets) {
    const content = resolveContent(input.template, {
      templateVars: { name: row.firstName ?? "Bloomie", appUrl: "bloombay.app/join" },
    });

    const result = await sendSMS(row.phoneNumber, content.smsBody ?? content.body);
    if (result.ok) {
      sent++;
      sentWaitlistIds.push(row.waitlistId);
    } else {
      failed++;
      errors.push(`${row.email ?? row.waitlistId}: ${result.error}`);
    }
  }

  await writeAdminAuditLog({
    actorId: input.actorId,
    actorRole: input.actorRole,
    action: "waitlist_sms_batch",
    resourceType: "waitlist",
    metadata: {
      template: input.template,
      sent,
      failed,
      targetCount: targets.length,
    },
  });

  await db.from("cron_logs").insert({
    job: `admin-waitlist-notify:${input.template}`,
    result: failed === 0 ? "ok" : "error",
    details: { sent, failed, errors: errors.slice(0, 20) },
    ran_at: new Date().toISOString(),
  }).maybeSingle();

  return { sent, failed, errors, sentWaitlistIds };
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

export function notifyInApp(
  userId: string,
  type: NotificationType,
  payload: CreateNotificationInput["payload"],
) {
  return createNotificationEvent({ userId, type, channels: ["in_app"], payload });
}

export function notifyMember(
  userId: string,
  type: NotificationType,
  payload: CreateNotificationInput["payload"],
) {
  return createNotificationEvent({
    userId,
    type,
    channels: defaultChannelsForType(type).includes("email")
      ? ["in_app", "email"]
      : ["in_app"],
    payload,
  });
}
