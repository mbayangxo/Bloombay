import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireFounder } from "@/lib/admin/require-staff";
import { fetchAllWaitlistRows } from "@/lib/supabase-admin";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

export async function GET(req: NextRequest) {
  const guard = await requireFounder(req);
  if (guard.error) return guard.error;

  const db = admin();

  const [
    waitlistResult,
    { count: pendingClubMama },
    { count: openModerationCases },
    reportsProbe,
  ] = await Promise.all([
    fetchAllWaitlistRows().catch(() => []),
    db
      .from("club_mama_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    db
      .from("moderation_cases")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending", "human_review_required", "in_review"]),
    db.from("moderation_cases").select("id", { count: "exact", head: true }).limit(1),
  ]);

  const waitlistCount = waitlistResult.length;
  const stripeConfigured = Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET,
  );
  const emailConfigured = Boolean(process.env.RESEND_API_KEY);
  const smsConfigured = Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      (process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM_NUMBER),
  );
  const cronEnabled = process.env.CRON_ENABLED === "true" || process.env.CRON_ENABLED === "1";

  return NextResponse.json({
    signals: {
      waitlistCount,
      waitlistOk: waitlistCount >= 0,
      pendingClubMama: pendingClubMama ?? 0,
      openModerationCases: openModerationCases ?? 0,
      stripeConfigured,
      emailConfigured,
      smsConfigured,
      cronEnabled,
      reportsApiOk: !reportsProbe.error,
    },
    checkedAt: new Date().toISOString(),
  });
}
