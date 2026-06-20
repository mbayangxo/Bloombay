import { NextResponse } from "next/server";
import { sendMemberWelcome } from "@/lib/welcome/send-member-welcome";
import { createClient } from "@/lib/supabase/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Welcome pack on member signup: email + SMS + in-app mailbox. */
export async function POST(request: Request) {
  let body: {
    email?: string;
    fullName?: string;
    phone?: string;
    city?: string;
    neighborhood?: string;
    userId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const fullName = body.fullName?.trim() ?? "";
  const phone = body.phone?.trim();
  const userId = body.userId;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resolvedUserId = userId ?? user?.id;

  if (!isValidEmail(email) && !(phone && resolvedUserId)) {
    return NextResponse.json(
      { ok: false, error: "Valid email required (or phone while signed in)" },
      { status: 400 }
    );
  }

  if (email && user?.email && user.email.toLowerCase() !== email) {
    return NextResponse.json({ ok: false, error: "Email mismatch" }, { status: 403 });
  }

  const result = await sendMemberWelcome({
    userId: resolvedUserId,
    email: email || `${resolvedUserId ?? "member"}@signup.bloombay.local`,
    fullName,
    phone,
    city: body.city?.trim(),
    neighborhood: body.neighborhood?.trim(),
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "Welcome failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    emailSent: result.emailSent,
    smsSent: result.smsSent,
    mailboxSaved: result.mailboxSaved,
    skipped: result.skipped,
  });
}
