import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone/normalize";
import { sendMemberSmsReminder } from "@/lib/sms/send-member-reminder";
import { createClient } from "@/lib/supabase/server";

type NotificationPrefs = {
  phone: string | null;
  smsNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
};

function mapProfileRow(row: Record<string, unknown> | null): NotificationPrefs {
  return {
    phone: (row?.phone as string | null) ?? null,
    smsNotifications: Boolean(row?.sms_notifications),
    emailNotifications: row?.email_notifications !== false,
    pushNotifications: row?.push_notifications !== false,
  };
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("phone, sms_notifications, email_notifications, push_notifications")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({
        phone: null,
        smsNotifications: false,
        emailNotifications: true,
        pushNotifications: true,
        warning: "Run supabase/migrations/008_profiles_phone_and_notifications.sql",
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapProfileRow(data));
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: {
    phone?: string;
    smsNotifications?: boolean;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { data: existing, error: readErr } = await supabase
    .from("profiles")
    .select("phone, sms_notifications, email_notifications, push_notifications")
    .eq("id", user.id)
    .maybeSingle();

  if (readErr) {
    if (readErr.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/008_profiles_phone_and_notifications.sql" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: readErr.message }, { status: 400 });
  }

  const current = mapProfileRow(existing);
  let resolvedPhone = current.phone;

  if (body.phone !== undefined) {
    const trimmed = body.phone.trim();
    if (!trimmed) {
      resolvedPhone = null;
    } else {
      const normalized = normalizePhone(trimmed);
      if (!normalized) {
        return NextResponse.json(
          { ok: false, error: "Enter a valid phone with country code" },
          { status: 400 }
        );
      }
      resolvedPhone = normalized;
    }
  }

  const nextSms =
    body.smsNotifications !== undefined ? body.smsNotifications : current.smsNotifications;

  if (nextSms && !resolvedPhone) {
    return NextResponse.json(
      { ok: false, error: "Add a phone number before enabling SMS reminders" },
      { status: 400 }
    );
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.phone !== undefined) patch.phone = resolvedPhone;
  if (body.smsNotifications !== undefined) patch.sms_notifications = nextSms;
  if (body.emailNotifications !== undefined) patch.email_notifications = body.emailNotifications;
  if (body.pushNotifications !== undefined) patch.push_notifications = body.pushNotifications;

  const { error: updateErr } = await supabase.from("profiles").update(patch).eq("id", user.id);

  if (updateErr) {
    return NextResponse.json({ ok: false, error: updateErr.message }, { status: 400 });
  }

  const turnedOnSms = nextSms && !current.smsNotifications;
  if (turnedOnSms) {
    void sendMemberSmsReminder(supabase, user.id, { kind: "opt_in" });
  }

  return NextResponse.json({
    ok: true,
    ...mapProfileRow({
      phone: resolvedPhone,
      sms_notifications: nextSms,
      email_notifications:
        body.emailNotifications !== undefined ? body.emailNotifications : current.emailNotifications,
      push_notifications:
        body.pushNotifications !== undefined ? body.pushNotifications : current.pushNotifications,
    }),
  });
}
