import { defaultTemplateForKey } from "@/lib/message-templates/defaults";
import { renderTemplateString } from "@/lib/message-templates/render";
import type { MessageTemplateKey, TemplateVariables } from "@/lib/message-templates/types";
import { getAdminClient } from "@/lib/supabase-admin";

export type ResolvedMessage = {
  key: string;
  channel: "email" | "sms" | "in_app";
  subject: string | null;
  body: string;
  source: "db" | "default";
};

export async function resolveMessageTemplate(
  key: MessageTemplateKey | string,
  vars: TemplateVariables
): Promise<ResolvedMessage> {
  const fallback = defaultTemplateForKey(key);

  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("message_templates")
      .select("key, channel, subject, body, is_active")
      .eq("key", key)
      .maybeSingle();

    if (!error && data && data.is_active !== false) {
      const subject = data.subject
        ? renderTemplateString(String(data.subject), vars)
        : null;
      return {
        key,
        channel: data.channel as ResolvedMessage["channel"],
        subject,
        body: renderTemplateString(String(data.body), vars),
        source: "db",
      };
    }
  } catch {
    /* fall through to code defaults */
  }

  if (!fallback) {
    return {
      key,
      channel: "sms",
      subject: null,
      body: renderTemplateString("BloomBay update for {{first_name}}.", vars),
      source: "default",
    };
  }

  return {
    key: fallback.key,
    channel: fallback.channel,
    subject: fallback.subject ? renderTemplateString(fallback.subject, vars) : null,
    body: renderTemplateString(fallback.body, vars),
    source: "default",
  };
}
