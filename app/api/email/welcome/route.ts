import { NextResponse } from "next/server";
import { sendMemberWelcome } from "@/lib/welcome/send-member-welcome";
import { createClient } from "@/lib/supabase/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Legacy path — delegates to full welcome pack (email + SMS + mailbox). */
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

  const email = (body.email?.trim().toLowerCase() || user.email?.toLowerCase() || "");
  const fullName = body.fullName?.trim() ?? "";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Valid email required" }, { status: 400 });
  }

  if (user.email && user.email.toLowerCase() !== email) {
    return NextResponse.json({ ok: false, error: "Email mismatch" }, { status: 403 });
  }

  const result = await sendMemberWelcome({
    userId: user.id,
    email,
    fullName,
    phone: body.phone?.trim(),
    city: body.city?.trim(),
    neighborhood: body.neighborhood?.trim(),
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? "Send failed" }, { status: 500 });
  }

  if (!result.emailSent && result.skipped?.email) {
    return NextResponse.json({
      ok: false,
      skipped: true,
      error: result.skipped.email,
    });
  }

  return NextResponse.json({
    ok: true,
    emailSent: result.emailSent,
    smsSent: result.smsSent,
    mailboxSaved: result.mailboxSaved,
  });
}
