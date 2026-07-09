import { NextResponse } from "next/server";
import { sendMemberWelcome } from "@/lib/welcome/send-member-welcome";
import { createClient } from "@/lib/supabase/server";

/** Legacy path — delegates to full welcome pack (email + SMS + mailbox).
 *  Recipient is ALWAYS the authenticated caller's own account, never
 *  body-supplied, so it cannot be used to email/SMS arbitrary addresses. */
export async function POST(request: Request) {
  let body: { fullName?: string; city?: string; neighborhood?: string };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const email = user.email ?? "";
  if (!email) {
    return NextResponse.json({ ok: false, error: "No email on account" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, first_name, phone_number, city, neighborhood")
    .eq("id", user.id)
    .maybeSingle();

  const result = await sendMemberWelcome({
    userId: user.id,
    email,
    fullName: profile?.full_name ?? profile?.first_name ?? body.fullName?.trim() ?? "",
    phone: profile?.phone_number ?? undefined,
    city: profile?.city ?? body.city?.trim(),
    neighborhood: profile?.neighborhood ?? body.neighborhood?.trim(),
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? "Send failed" }, { status: 500 });
  }

  if (!result.emailSent && result.skipped?.email) {
    return NextResponse.json({ ok: false, skipped: true, error: result.skipped.email });
  }

  return NextResponse.json({
    ok: true,
    emailSent: result.emailSent,
    smsSent: result.smsSent,
    mailboxSaved: result.mailboxSaved,
  });
}
