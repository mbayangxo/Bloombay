import { NextResponse } from "next/server";
import { sendMemberWelcome } from "@/lib/welcome/send-member-welcome";
import { createClient } from "@/lib/supabase/server";

/** Welcome pack on member signup: email + SMS + in-app mailbox.
 *  Recipient is ALWAYS the authenticated caller — never body-supplied —
 *  so this cannot be used to bomb arbitrary emails/phones. */
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

  // Recipient details come from the session + the caller's own profile,
  // NOT from the request body.
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, first_name, phone_number, city, neighborhood")
    .eq("id", user.id)
    .maybeSingle();

  const email = user.email ?? "";
  if (!email) {
    return NextResponse.json({ ok: false, error: "No email on account" }, { status: 400 });
  }

  const result = await sendMemberWelcome({
    userId: user.id,
    email,
    fullName: profile?.full_name ?? profile?.first_name ?? body.fullName?.trim() ?? "",
    phone: profile?.phone_number ?? undefined,
    city: profile?.city ?? body.city?.trim(),
    neighborhood: profile?.neighborhood ?? body.neighborhood?.trim(),
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
