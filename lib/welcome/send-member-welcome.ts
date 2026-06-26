import {
  emailHtmlFromText,
  renderTemplateString,
  welcomeTemplateVars,
} from "@/lib/message-templates/render";
import { resolveMessageTemplate } from "@/lib/message-templates/resolve";
import { createNotificationEvent } from "@/lib/notifications/notification-service";
import { getAdminClient } from "@/lib/supabase-admin";

export type MemberWelcomeInput = {
  /** Server-derived from auth.uid() — never from client body. */
  userId: string;
  email: string;
  fullName: string;
  phone?: string;
  city?: string;
  neighborhood?: string;
};

export type MemberWelcomeResult = {
  ok: boolean;
  emailSent: boolean;
  smsSent: boolean;
  mailboxSaved: boolean;
  skipped?: {
    email?: string;
    sms?: string;
    mailbox?: string;
  };
  error?: string;
};

function appHomeHref() {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(".supabase.co", "") ??
    "http://127.0.0.1:3000";
  return `${appUrl.replace(/\/$/, "")}/member/home`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function welcomeAlreadySent(userId: string) {
  try {
    const admin = getAdminClient();
    const { data } = await admin
      .from("member_mailbox_messages")
      .select("id")
      .eq("user_id", userId)
      .eq("message_type", "welcome")
      .maybeSingle();
    return Boolean(data?.id);
  } catch {
    return false;
  }
}

async function channelStatuses(userId: string, eventIds: string[]) {
  if (!eventIds.length) {
    return { email: "skipped" as const, in_app: "skipped" as const, sms: "skipped" as const };
  }
  const admin = getAdminClient();
  const { data } = await admin
    .from("notification_events")
    .select("channel, status")
    .eq("user_id", userId)
    .in("id", eventIds);
  const rows = data ?? [];
  const statusFor = (channel: string) =>
    rows.find((r) => r.channel === channel)?.status ?? "skipped";
  return {
    email: statusFor("email"),
    in_app: statusFor("in_app"),
    sms: statusFor("sms"),
  };
}

export async function sendMemberWelcome(
  input: MemberWelcomeInput,
): Promise<MemberWelcomeResult> {
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  const vars = welcomeTemplateVars({
    fullName,
    email,
    city: input.city,
    neighborhood: input.neighborhood,
  });

  const result: MemberWelcomeResult = {
    ok: true,
    emailSent: false,
    smsSent: false,
    mailboxSaved: false,
    skipped: {},
  };

  if (!input.userId) {
    result.ok = false;
    result.error = "userId required";
    return result;
  }

  if (await welcomeAlreadySent(input.userId)) {
    result.skipped = {
      email: "Already welcomed",
      sms: "SMS not used for member welcome",
      mailbox: "Already welcomed",
    };
    return result;
  }

  const emailTemplate = await resolveMessageTemplate("member_welcome_email", vars);
  const inAppTemplate = await resolveMessageTemplate("member_welcome_in_app", vars);
  const mailboxSubject =
    inAppTemplate.subject ?? renderTemplateString("Welcome to BloomBay, {{first_name}}", vars);
  const emailSubject =
    emailTemplate.subject ?? renderTemplateString("Welcome to BloomBay, {{first_name}}", vars);

  try {
    const { eventIds } = await createNotificationEvent({
      userId: input.userId,
      type: "member_welcome",
      channels: ["in_app", "email"],
      payload: {
        title: mailboxSubject,
        body: inAppTemplate.body,
        link: appHomeHref(),
        subject: emailSubject,
        html: emailHtmlFromText(emailTemplate.body),
        recipientEmail: isValidEmail(email) ? email : undefined,
        templateVars: vars,
      },
    });

    const statuses = await channelStatuses(input.userId, eventIds);
    result.mailboxSaved = statuses.in_app === "sent";
    result.emailSent = statuses.email === "sent";
    result.smsSent = false;
    result.skipped!.sms = "SMS not permitted for member_welcome";

    if (statuses.email === "skipped") {
      result.skipped!.email = isValidEmail(email)
        ? "RESEND not configured or user email disabled"
        : "No valid email";
    } else if (statuses.email === "failed") {
      result.ok = false;
      result.error = "Welcome email failed";
      return result;
    }

    if (statuses.in_app === "skipped") {
      result.skipped!.mailbox = "Welcome already in mailbox or table missing";
    } else if (statuses.in_app === "failed") {
      result.skipped!.mailbox = "Mailbox insert failed";
    }
  } catch (e) {
    result.ok = false;
    result.error = e instanceof Error ? e.message : "Welcome failed";
  }

  return result;
}
