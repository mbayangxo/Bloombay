import { NextResponse } from "next/server";
import { buildSmsReminderBody, type ReminderKind } from "@/lib/sms/reminder-message";
import { sendSmsForUser } from "@/lib/sms/send-for-user";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: {
    message?: string;
    kind?: ReminderKind;
    title?: string;
    when?: string;
    place?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  let message = body.message?.trim();

  if (!message && body.kind) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    const firstName = (profile?.full_name as string | null)?.trim().split(/\s+/)[0];
    message = buildSmsReminderBody({
      firstName,
      kind: body.kind,
      title: body.title?.trim(),
      when: body.when?.trim(),
      place: body.place?.trim(),
    });
  }

  if (!message) {
    return NextResponse.json({ ok: false, error: "message or kind required" }, { status: 400 });
  }

  const result = await sendSmsForUser(supabase, user.id, message);

  if (result.skipped) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? "Send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
