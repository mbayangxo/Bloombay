import { SMS_PERMITTED_TYPES, type NotificationType } from "@/lib/notifications/templates";

/** SMS types allowed to reach Twilio — must match product policy. */
export type AllowedSmsType = Extract<
  NotificationType,
  "phone_verification" | "private_beta_accepted" | "app_launch" | "urgent_safety"
>;

export const ALLOWED_SMS_TYPES = SMS_PERMITTED_TYPES as ReadonlySet<AllowedSmsType>;

export const SMS_POLICY_BLOCKED_CODE = "sms_blocked_by_policy";

export function isAllowedSmsType(type: string): type is AllowedSmsType {
  return SMS_PERMITTED_TYPES.has(type as NotificationType);
}

export function smsPolicyError(type?: string): string {
  const allowed = [...SMS_PERMITTED_TYPES].join(", ");
  if (type) {
    return `SMS type "${type}" is not allowed. Permitted types: ${allowed}.`;
  }
  return `SMS requires an allowed type. Permitted types: ${allowed}.`;
}

/** Block calendar/seat/opt-in reminder SMS at the helper layer. */
export const SMS_REMINDER_BLOCKED =
  "Calendar, seat, and opt-in reminder SMS are disabled. Use in-app or email notifications.";
