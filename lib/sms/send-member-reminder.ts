import type { SupabaseClient } from "@supabase/supabase-js";
import { buildSmsReminderBody, type ReminderKind } from "@/lib/sms/reminder-message";
import { resolveMessageTemplate } from "@/lib/message-templates/resolve";
import { seatTemplateVars } from "@/lib/message-templates/render";
import { sendSmsForUser } from "@/lib/sms/send-for-user";

export async function sendMemberSmsReminder(
  supabase: SupabaseClient,
  userId: string,
  input: {
    kind: ReminderKind;
    title?: string;
    when?: string;
    place?: string;
  }
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const { data: profile, error: readErr } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .maybeSingle();

  if (readErr && !readErr.message.includes("does not exist")) {
    return { ok: false, error: readErr.message };
  }

  const fullName = (profile?.full_name as string | null)?.trim();
  const vars = seatTemplateVars({
    fullName: fullName ?? undefined,
    title: input.title ?? "your gathering",
    when: input.when,
    place: input.place,
  });

  let body: string;

  if (input.kind === "seat") {
    const template = await resolveMessageTemplate("seat_confirmed_sms", vars);
    body = template.body;
  } else if (input.kind === "calendar") {
    const template = await resolveMessageTemplate("event_reminder_sms", vars);
    body = template.body;
  } else {
    body = buildSmsReminderBody({
      firstName: vars.first_name,
      title: input.title,
      when: input.when,
      place: input.place,
      kind: input.kind,
    });
  }

  return sendSmsForUser(supabase, userId, body);
}
