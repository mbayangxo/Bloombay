import { NextResponse } from "next/server";
import { buildSmsReminderBody, type ReminderKind } from "@/lib/sms/reminder-message";
import { sendSmsForUser } from "@/lib/sms/send-for-user";
import { createClient } from "@/lib/supabase/server";

const VALID_KINDS: ReminderKind[] = ["calendar", "seat", "opt_in"];
// Hard limit on title/place/when to prevent free-text injection
const FIELD_MAX = 200;
// Per-user daily SMS cap
const SMS_DAILY_LIMIT = 10;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: {
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

  // Only template-based sends are allowed — no arbitrary message field
  if (!body.kind || !VALID_KINDS.includes(body.kind)) {
    return NextResponse.json({ ok: false, error: `kind must be one of: ${VALID_KINDS.join(", ")}` }, { status: 400 });
  }

  // Sanitise and cap structured fields
  const kind = body.kind;
  const title = body.title?.trim().slice(0, FIELD_MAX);
  const when  = body.when?.trim().slice(0, FIELD_MAX);
  const place = body.place?.trim().slice(0, FIELD_MAX);

  // Daily rate limit per user
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("sms_log")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("sent_at", dayStart.toISOString());

  if ((count ?? 0) >= SMS_DAILY_LIMIT) {
    return NextResponse.json({ ok: true, skipped: true, reason: "daily_limit" });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const firstName = (profile?.full_name as string | null)?.trim().split(/\s+/)[0];
  const message = buildSmsReminderBody({ firstName, kind, title, when, place });

  const result = await sendSmsForUser(supabase, user.id, message);

  if (result.skipped) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? "Send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
