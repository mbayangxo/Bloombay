import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createMemberClient } from "@/lib/supabase/server";
import { createNotificationEvent } from "@/lib/notifications/notification-service";

const VALID_REASONS = [
  "harassment", "spam", "fake_profile", "inappropriate_content",
  "hate_speech", "scam", "other",
] as const;

const HIGH_SEVERITY_REASONS = new Set(["harassment", "hate_speech", "scam"]);

function severityForReason(reason: string): "low" | "medium" | "high" {
  if (HIGH_SEVERITY_REASONS.has(reason)) return "high";
  if (reason === "inappropriate_content" || reason === "fake_profile") return "medium";
  return "low";
}

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

// POST /api/member/report — report a member (canonical: member_reports only)
export async function POST(req: NextRequest) {
  const supabase = await createMemberClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    reported_id?: string;
    reason?: string;
    details?: string;
    source_type?: string;
    source_id?: string;
  };

  if (!body.reported_id) return NextResponse.json({ error: "reported_id required" }, { status: 400 });
  if (body.reported_id === user.id) return NextResponse.json({ error: "Cannot report yourself" }, { status: 400 });
  if (!body.reason || !VALID_REASONS.includes(body.reason as typeof VALID_REASONS[number])) {
    return NextResponse.json({ error: `reason must be one of: ${VALID_REASONS.join(", ")}` }, { status: 400 });
  }

  const severity = severityForReason(body.reason);
  const details = body.details?.trim().slice(0, 1000) ?? null;
  const status = severity === "high" ? "human_review_required" : "pending";

  const { data: memberReport, error } = await supabase.from("member_reports").insert({
    reporter_id: user.id,
    reported_id: body.reported_id,
    reason: body.reason,
    details,
    severity,
    status,
    source_type: body.source_type ?? null,
    source_id: body.source_id ?? null,
  }).select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (severity === "high" && memberReport?.id) {
    const db = admin();
    const { error: caseErr } = await db.from("moderation_cases").insert({
      source_type: "member_report",
      source_id: String(memberReport.id),
      reported_user_id: body.reported_id,
      reporter_id: user.id,
      severity: "high",
      status: "human_review_required",
    });
    if (caseErr && caseErr.code !== "23505") {
      console.error("[report] moderation_cases insert failed:", caseErr.message);
    }
  }

  void createNotificationEvent({
    userId: user.id,
    type: "report_submitted",
    channels: ["in_app"],
    payload: { link: "/member/settings" },
  });

  return NextResponse.json({ ok: true, report_id: memberReport.id });
}
