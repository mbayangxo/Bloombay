export type BetaLaunchItemId =
  | "waitlist"
  | "stripe"
  | "email"
  | "sms"
  | "magic_links"
  | "reports"
  | "moderation_queue"
  | "club_mama_queue"
  | "cron"
  | "notifications"
  | "no_critical_errors";

export type BetaLaunchItem = {
  id: BetaLaunchItemId;
  label: string;
  hint: string;
  href?: string;
  /** When true, API can suggest pass/warn/fail before you check the box. */
  autoSignal?: boolean;
};

export const BETA_LAUNCH_ITEMS: BetaLaunchItem[] = [
  {
    id: "waitlist",
    label: "Waitlist running",
    hint: "Public waitlist accepts signups.",
    href: "/waitlist",
    autoSignal: true,
  },
  {
    id: "stripe",
    label: "Stripe live",
    hint: "Secret key + webhook secret configured for payments.",
    autoSignal: true,
  },
  {
    id: "email",
    label: "Email working",
    hint: "Resend configured — send a test invite or welcome email.",
    autoSignal: true,
  },
  {
    id: "sms",
    label: "SMS working",
    hint: "Twilio configured — send a test reminder or OTP.",
    autoSignal: true,
  },
  {
    id: "magic_links",
    label: "Magic links working",
    hint: "Portal login completes session + redirect (founder, Club Mama, member).",
    href: "/founder/club-hosts",
  },
  {
    id: "reports",
    label: "Reports working",
    hint: "Member report → moderation case pipeline responds.",
    href: "/founder/reports",
    autoSignal: true,
  },
  {
    id: "moderation_queue",
    label: "Moderation queue empty",
    hint: "No open safety cases blocking launch.",
    href: "/founder/safety",
    autoSignal: true,
  },
  {
    id: "club_mama_queue",
    label: "Club Mama applications reviewed",
    hint: "Pending Club Mama queue cleared or triaged.",
    href: "/founder/club-hosts",
    autoSignal: true,
  },
  {
    id: "cron",
    label: "Cron health green",
    hint: "Scheduled jobs enabled (CRON_ENABLED) for ops automations.",
    href: "/founder/yande",
    autoSignal: true,
  },
  {
    id: "notifications",
    label: "Notifications healthy",
    hint: "Welcome + operator notifications deliver without errors.",
    href: "/founder/inbox",
  },
  {
    id: "no_critical_errors",
    label: "No critical errors",
    hint: "No P0 bugs open — check QA notes before inviting Club Mamas.",
    href: "/founder/qa-lab",
  },
];

export const BETA_LAUNCH_STORAGE_KEY = "bb_founder_beta_launch_v1";
