import type { NotificationType } from "./templates";
import { SMS_PERMITTED_TYPES } from "./templates";

export type NotificationChannel = "in_app" | "email" | "sms";

/** Types that must never use SMS — in-app and/or email only. */
export const SMS_BLOCKED_TYPES = new Set<string>([
  "reservation_requested",
  "reservation_confirmed",
  "reservation_cancelled",
  "event_reminder",
  "bloom_request",
  "bloom_request_accepted",
  "yande_nudge",
  "day3_nudge",
  "day7_nudge",
  "intro",
  "girlmate_message",
  "club_update",
  "club_joined",
  "club_application_approved",
  "club_application_rejected",
  "club_accepted",
  "ticket_confirmed",
  "membership_activated",
  "membership_confirmed",
  "member_approved",
  "yande_question",
  "celebrate",
  "report_submitted",
]);

/** Admin/founder-only SMS types (must use approved templates). */
export { SMS_PERMITTED_TYPES };

const ADMIN_TRIGGERED_SMS_TYPES = new Set<string>([
  "private_beta_accepted",
  "app_launch",
]);

export interface NotificationPreferences {
  email_enabled: boolean;
  in_app_enabled: boolean;
  sms_enabled: boolean;
  event_reminders: boolean;
  club_updates: boolean;
  girlmate_messages: boolean;
  bloom_requests: boolean;
}

export function defaultChannelsForType(type: NotificationType): NotificationChannel[] {
  if (SMS_PERMITTED_TYPES.has(type)) {
    return ["in_app", "email"];
  }
  return ["in_app"];
}

export function resolveChannels(
  type: NotificationType,
  requested?: NotificationChannel[],
): NotificationChannel[] {
  const base = requested?.length ? [...requested] : defaultChannelsForType(type);
  return base.filter((channel) => {
    if (channel === "sms" && !SMS_PERMITTED_TYPES.has(type)) return false;
    return true;
  });
}

export function isSmsBlocked(type: string): boolean {
  return SMS_BLOCKED_TYPES.has(type) || !SMS_PERMITTED_TYPES.has(type as NotificationType);
}

export function requiresAdminActor(type: string, channel: NotificationChannel): boolean {
  return channel === "sms" && ADMIN_TRIGGERED_SMS_TYPES.has(type);
}

export function isTopicEnabled(
  prefs: NotificationPreferences | null,
  type: string,
): boolean {
  if (!prefs) return true;

  if (type === "event_reminder" || type === "ticket_confirmed") {
    return prefs.event_reminders;
  }
  if (
    type.startsWith("club_") ||
    type === "club_accepted" ||
    type === "club_joined"
  ) {
    return prefs.club_updates;
  }
  if (type === "girlmate_message") {
    return prefs.girlmate_messages;
  }
  if (type === "bloom_request" || type === "bloom_request_accepted") {
    return prefs.bloom_requests;
  }
  if (type === "day3_nudge" || type === "day7_nudge" || type === "intro") {
    return prefs.in_app_enabled;
  }

  return true;
}

export function isChannelEnabled(
  prefs: NotificationPreferences | null,
  channel: NotificationChannel,
): boolean {
  if (!prefs) return true;
  if (channel === "in_app") return prefs.in_app_enabled;
  if (channel === "email") return prefs.email_enabled;
  if (channel === "sms") return prefs.sms_enabled;
  return true;
}
