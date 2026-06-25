// Approved notification templates — the only SMS/email bodies allowed in the system.
// Routes must use these; no arbitrary user-facing message strings in API code.

export type NotificationType =
  // ── SMS-permitted types (admin/founder triggered only) ────────────────────
  | "private_beta_accepted"
  | "app_launch"
  | "phone_verification"
  | "urgent_safety"
  // ── In-app + email ────────────────────────────────────────────────────────
  | "reservation_requested"
  | "reservation_confirmed"
  | "reservation_cancelled"
  | "club_joined"
  | "club_application_approved"
  | "club_application_rejected"
  | "event_reminder"
  | "ticket_confirmed"
  | "membership_activated"
  | "girlmate_message"
  | "bloom_request"
  | "bloom_request_accepted"
  | "day3_nudge"
  | "day7_nudge"
  | "verification_submitted"
  | "verification_approved"
  | "verification_rejected"
  | "intro";

// Types that may use SMS — admin/founder must explicitly opt in to SMS channel
export const SMS_PERMITTED_TYPES = new Set<NotificationType>([
  "private_beta_accepted",
  "app_launch",
  "phone_verification",
  "urgent_safety",
]);

export interface TemplateData {
  name?: string;
  restaurantName?: string;
  date?: string;
  time?: string;
  partySize?: number;
  clubName?: string;
  eventTitle?: string;
  appUrl?: string;
  code?: string;
  message?: string;
}

export interface RenderedNotification {
  title: string;
  body: string;
  smsBody?: string;   // only present for SMS-permitted types
  link?: string;
}

export function renderTemplate(
  type: NotificationType,
  data: TemplateData
): RenderedNotification {
  const name = data.name ?? "Bloomie";
  const url = data.appUrl ?? "bloombay.app";

  switch (type) {
    // ── SMS-permitted ──────────────────────────────────────────────────────
    case "private_beta_accepted":
      return {
        title: "You're in. Welcome to BloomBay.",
        body: "Your private beta invitation is ready. Tap to get started.",
        smsBody: `${name}, you're in 🌸\n\nBloomBay is ready for you. Your private beta access starts now.\n\n${url}`,
        link: "/",
      };

    case "app_launch":
      return {
        title: "BloomBay is live.",
        body: "The app has officially launched. Come find your people.",
        smsBody: `Hey ${name} ✦\n\nBloomBay is officially live. Come find your people → ${url}`,
        link: "/",
      };

    case "phone_verification":
      return {
        title: "Your verification code",
        body: `Your code is ${data.code}. Expires in 10 minutes.`,
        smsBody: `Your BloomBay code: ${data.code}\n\nExpires in 10 minutes. Don't share this.`,
      };

    case "urgent_safety":
      return {
        title: "Safety notice from BloomBay",
        body: data.message ?? "Please check your account.",
        smsBody: data.message ?? "Important notice from BloomBay. Please check the app.",
        link: "/member",
      };

    // ── Reservations ───────────────────────────────────────────────────────
    case "reservation_requested":
      return {
        title: "Reservation request sent",
        body: `We've sent your request to ${data.restaurantName} for ${data.date} at ${data.time}. We'll confirm within 24h.`,
        link: "/member/lounge",
      };

    case "reservation_confirmed":
      return {
        title: `Table confirmed at ${data.restaurantName}!`,
        body: `Your table for ${data.date} at ${data.time} is confirmed. See you there ✦`,
        link: "/member/city",
      };

    case "reservation_cancelled":
      return {
        title: "Reservation update",
        body: `Your request at ${data.restaurantName} for ${data.date} couldn't be accommodated.`,
        link: "/member/city",
      };

    // ── Clubs ─────────────────────────────────────────────────────────────
    case "club_joined":
      return {
        title: `Welcome to ${data.clubName}!`,
        body: `You're now a member of ${data.clubName}. See what's happening inside.`,
        link: "/member/clubs",
      };

    case "club_application_approved":
      return {
        title: `You're in — ${data.clubName}`,
        body: `Your application to ${data.clubName} was approved! Come meet your girls.`,
        link: "/member/clubs",
      };

    case "club_application_rejected":
      return {
        title: "Application update",
        body: `Your application to ${data.clubName} wasn't accepted this time. Keep exploring!`,
        link: "/member/clubs",
      };

    // ── Events / Tickets ───────────────────────────────────────────────────
    case "event_reminder":
      return {
        title: `Coming up: ${data.eventTitle}`,
        body: `Your event is ${data.date} at ${data.time}. Don't forget!`,
        link: "/member/happenings",
      };

    case "ticket_confirmed":
      return {
        title: `You're going to ${data.eventTitle}!`,
        body: `Your ticket is confirmed. We'll see you there.`,
        link: "/member/happenings",
      };

    // ── Membership ─────────────────────────────────────────────────────────
    case "membership_activated":
      return {
        title: "Your BloomBay membership is active.",
        body: "You now have full access. Explore everything.",
        link: "/member",
      };

    // ── Social ─────────────────────────────────────────────────────────────
    case "girlmate_message":
      return {
        title: "New message",
        body: "Someone sent you a message on Girlmates.",
        link: "/member/girlmates",
      };

    case "bloom_request":
      return {
        title: "Someone wants to connect",
        body: "You have a new Bloom Request.",
        link: "/member/introductions",
      };

    case "bloom_request_accepted":
      return {
        title: "Bloom Request accepted!",
        body: "They said yes. Time to say hi.",
        link: "/member/introductions",
      };

    // ── Onboarding nudges ──────────────────────────────────────────────────
    case "day3_nudge":
      return {
        title: "Find your people. 🌺",
        body: "You've been here 3 days — have you joined a club yet? Women who join a club in their first week are 3× more likely to attend a gathering.",
        link: "/member/clubs",
      };

    case "day7_nudge":
      return {
        title: `One week in, ${name}. ✦`,
        body: "You made it through your first week. There are gatherings this weekend — one of them has your name on it.",
        link: "/member/happenings",
      };

    case "intro":
      return {
        title: "Find your people. 🌺",
        body: "You've been here 3 days — have you joined a club yet? Women who join a club in their first week are 3× more likely to attend a gathering.",
        link: "/member/clubs",
      };

    // ── Verification ───────────────────────────────────────────────────────
    case "verification_submitted":
      return {
        title: "Verification submitted",
        body: "We received your verification. We'll review it within 24 hours.",
        link: "/member",
      };

    case "verification_approved":
      return {
        title: "You're verified! ✦",
        body: "Your identity has been verified. You now have full BloomBay access.",
        link: "/member",
      };

    case "verification_rejected":
      return {
        title: "Verification needs attention",
        body: "We couldn't verify your ID. Please try again with a clearer photo.",
        link: "/member/settings",
      };

    default:
      return {
        title: "BloomBay notification",
        body: data.message ?? "You have a new notification.",
        link: "/member",
      };
  }
}
