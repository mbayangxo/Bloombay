export type MessageChannel = "email" | "sms" | "in_app";

export type MessageTemplateKey =
  | "member_welcome_email"
  | "member_welcome_sms"
  | "member_welcome_in_app"
  | "seat_confirmed_email"
  | "seat_confirmed_sms"
  | "event_reminder_sms"
  | "club_approved_email"
  | "waitlist_approved_email";

export type MessageTemplateRow = {
  id: string;
  key: MessageTemplateKey | string;
  channel: MessageChannel;
  subject: string | null;
  body: string;
  is_active: boolean;
  updated_at: string;
};

export type TemplateVariables = Record<string, string | undefined | null>;
