import type { MessageTemplateKey } from "@/lib/message-templates/types";

export type DefaultTemplate = {
  key: MessageTemplateKey;
  channel: "email" | "sms" | "in_app";
  subject: string | null;
  body: string;
};

export const MESSAGE_TEMPLATE_DEFAULTS: DefaultTemplate[] = [
  {
    key: "member_welcome_email",
    channel: "email",
    subject: "Welcome to BloomBay, {{first_name}}",
    body: `Hi {{first_name}},

Welcome to BloomBay — women meeting women IRL in {{place}}.

Open seats, clubs, and tonight in the city are waiting for you.

Enter BloomBay: {{app_url}}/member/home

— BloomBay`,
  },
  {
    key: "member_welcome_sms",
    channel: "sms",
    subject: null,
    body: "Welcome to BloomBay, {{first_name}}! You're in{{place_suffix}}. Open BloomBay for seats, clubs & tonight in the city.",
  },
  {
    key: "member_welcome_in_app",
    channel: "in_app",
    subject: "Welcome to BloomBay, {{first_name}}",
    body: `Hi {{first_name}},

Welcome to BloomBay — women meeting women IRL in {{place}}.

Open seats, clubs, and tonight in the city are waiting for you. Tap below to enter your home feed.

— BloomBay`,
  },
  {
    key: "seat_confirmed_email",
    channel: "email",
    subject: "Seat saved — {{title}}",
    body: `Hi {{first_name}},

Your seat is saved for {{title}}{{venue_suffix}}{{when_suffix}}.

See you there,
BloomBay`,
  },
  {
    key: "seat_confirmed_sms",
    channel: "sms",
    subject: null,
    body: "BloomBay: Your seat is saved for {{title}}{{venue_suffix}}{{when_suffix}}. See you there, {{first_name}}.",
  },
  {
    key: "event_reminder_sms",
    channel: "sms",
    subject: null,
    body: "BloomBay reminder: {{title}} on {{when}}{{place_suffix}}. Open BloomBay when you're ready.",
  },
  {
    key: "club_approved_email",
    channel: "email",
    subject: "You're approved — {{club_name}}",
    body: `Hi {{first_name}},

Great news — you're approved for {{club_name}} on BloomBay.

Open the club world and say hello to your people.

— BloomBay`,
  },
  {
    key: "waitlist_approved_email",
    channel: "email",
    subject: "You're off the waitlist, {{first_name}}",
    body: `Hi {{first_name}},

You're off the BloomBay waitlist — welcome in.

Create your member account and we'll see you in the city.

— BloomBay`,
  },
];

export function defaultTemplateForKey(key: string): DefaultTemplate | null {
  return MESSAGE_TEMPLATE_DEFAULTS.find((t) => t.key === key) ?? null;
}
