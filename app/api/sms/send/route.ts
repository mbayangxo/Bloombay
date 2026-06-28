import { NextResponse } from "next/server";
import { ALLOWED_SMS_TYPES, SMS_POLICY_BLOCKED_CODE, SMS_REMINDER_BLOCKED } from "@/lib/sms/policy";

/**
 * Legacy per-user SMS endpoint — disabled.
 * Event/seat/calendar/opt-in SMS and arbitrary drafts are blocked globally.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      blocked: true,
      error: SMS_POLICY_BLOCKED_CODE,
      message: SMS_REMINDER_BLOCKED,
      allowedTypes: [...ALLOWED_SMS_TYPES],
    },
    { status: 403 },
  );
}
