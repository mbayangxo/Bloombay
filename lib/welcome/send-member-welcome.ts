import { getResendClient, resendFromAddress } from "@/lib/email/resend-client";
import {
  emailHtmlFromText,
  renderTemplateString,
  welcomeTemplateVars,
} from "@/lib/message-templates/render";
import { resolveMessageTemplate } from "@/lib/message-templates/resolve";
import { getAdminClient } from "@/lib/supabase-admin";
import { sendSms } from "@/lib/sms/twilio-client";

export type MemberWelcomeInput = {
  userId?: string;
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

export async function sendMemberWelcome(
  input: MemberWelcomeInput
): Promise<MemberWelcomeResult> {
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  const phone = input.phone?.trim();
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

  if (input.userId && (await welcomeAlreadySent(input.userId))) {
    result.skipped = { email: "Already welcomed", sms: "Already welcomed", mailbox: "Already welcomed" };
    return result;
  }

  const emailTemplate = await resolveMessageTemplate("member_welcome_email", vars);
  const smsTemplate = await resolveMessageTemplate("member_welcome_sms", vars);
  const inAppTemplate = await resolveMessageTemplate("member_welcome_in_app", vars);

  const resend = getResendClient();
  if (!email || !isValidEmail(email)) {
    result.skipped!.email = "No valid email";
  } else if (!resend) {
    result.skipped!.email = "RESEND_API_KEY not configured";
  } else {
    const subject =
      emailTemplate.subject ?? renderTemplateString("Welcome to BloomBay, {{first_name}}", vars);
    const { error } = await resend.emails.send({
      from: resendFromAddress(),
      to: email,
      subject,
      html: emailHtmlFromText(emailTemplate.body),
      text: emailTemplate.body,
    });
    if (error) {
      result.ok = false;
      result.error = error.message;
      return result;
    }
    result.emailSent = true;
  }

  if (phone) {
    const sms = await sendSms(phone, smsTemplate.body);
    if (sms.ok) {
      result.smsSent = true;
    } else if (sms.skipped) {
      result.skipped!.sms = sms.error ?? "Twilio not configured";
    } else {
      result.skipped!.sms = sms.error ?? "SMS failed";
    }
  } else {
    result.skipped!.sms = "No phone on signup";
  }

  if (!input.userId) {
    result.skipped!.mailbox = "userId required";
    return result;
  }

  try {
    const admin = getAdminClient();
    const { data: existing } = await admin
      .from("member_mailbox_messages")
      .select("id")
      .eq("user_id", input.userId)
      .eq("message_type", "welcome")
      .maybeSingle();

    if (existing?.id) {
      result.skipped!.mailbox = "Welcome already in mailbox";
      return result;
    }

    const mailboxSubject =
      inAppTemplate.subject ?? renderTemplateString("Welcome to BloomBay, {{first_name}}", vars);

    const { error: insertErr } = await admin.from("member_mailbox_messages").insert({
      user_id: input.userId,
      from_name: "BloomBay",
      subject: mailboxSubject,
      body: inAppTemplate.body,
      message_type: "welcome",
      href: appHomeHref(),
    });

    if (insertErr) {
      if (insertErr.message.includes("does not exist")) {
        result.skipped!.mailbox = "Run supabase/migrations/011_member_mailbox.sql";
      } else {
        result.skipped!.mailbox = insertErr.message;
      }
      return result;
    }

    result.mailboxSaved = true;
  } catch (e) {
    result.skipped!.mailbox = e instanceof Error ? e.message : "Mailbox insert failed";
  }

  return result;
}
