import { NextResponse } from "next/server";
import { sendMemberWelcome } from "@/lib/welcome/send-member-welcome";
import { createClient } from "@/lib/supabase/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Welcome pack on member signup: email + SMS + in-app mailbox. */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

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

  if (body.userId && body.userId !== user.id) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const userId = user.id;
  const email = (body.email?.trim().toLowerCase() || user.email?.toLowerCase() || "");
  const fullName = body.fullName?.trim() ?? "";
  const phone = body.phone?.trim();

  if (!isValidEmail(email) && !phone) {
    return NextResponse.json(
      { ok: false, error: "Valid email or phone required" },
      { status: 400 },
    );
  }

  if (email && user.email && user.email.toLowerCase() !== email) {
    return NextResponse.json({ ok: false, error: "Email mismatch" }, { status: 403 });
  }

  const result = await sendMemberWelcome({
    userId,
    email: email || `${userId}@signup.bloombay.local`,
    fullName,
    phone,
    city: body.city?.trim(),
    neighborhood: body.neighborhood?.trim(),
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "Welcome failed" },
      { status: 500 },
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
