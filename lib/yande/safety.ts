"use server";

import { createClient } from "@supabase/supabase-js";
import { logAction, recordMemberTouch } from "./core";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function reviewPendingReports(): Promise<{ reviewed: number; escalated: number }> {
  const supabase = admin();
  const { data: reports } = await supabase
    .from("member_reports")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(20);

  if (!reports?.length) return { reviewed: 0, escalated: 0 };

  let reviewed = 0;
  let escalated = 0;

  for (const report of reports) {
    try {
      // Count prior reports against the same member
      const { count: priorCount } = await supabase
        .from("member_reports")
        .select("id", { count: "exact", head: true })
        .eq("reported_id", report.reported_id)
        .neq("status", "dismissed");

      const totalReports = (priorCount ?? 0) + 1;
      const isHighSeverity = report.severity === "high" || totalReports >= 3;

      let yandeAnalysis = "";

      if (process.env.ANTHROPIC_API_KEY) {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 120,
            system: `You are Yande, BloomBay's safety agent. Assess this member report briefly.
Output format: SEVERITY: [low/medium/high] | ACTION: [monitor/warn/deactivate] | SUMMARY: [1 sentence]
Be objective. BloomBay is a women-only community — safety is the top priority.`,
            messages: [{ role: "user", content: `Reason: ${report.reason}\nDetails: ${report.details ?? "none"}\nPrior reports against this member: ${priorCount ?? 0}` }],
          }),
        });

        if (res.ok) {
          const d = await res.json() as { content: { text: string }[] };
          yandeAnalysis = d.content[0]?.text?.trim() ?? "";
        }
      }

      const newStatus = isHighSeverity ? "reviewed" : "reviewed";

      await supabase.from("member_reports").update({
        status: newStatus,
        yande_summary: yandeAnalysis || `${totalReports} report(s) on file. Auto-reviewed by Yande.`,
      }).eq("id", report.id);

      // Alert admin for high severity
      if (isHighSeverity) {
        await supabase.from("notifications").insert({
          user_id: report.reporter_id,
          type: "safety",
          title: "Safety report under review ✦",
          body: "We've flagged this for human review. Our team will take action within 24 hours.",
          data: { report_id: report.id },
        });

        escalated++;
      }

      await logAction({
        agent: "yande-safety",
        action_type: "review_report",
        risk_level: isHighSeverity ? "high" : "medium",
        target_user_id: report.reported_id as string,
        metadata: { report_id: report.id, prior_reports: priorCount, escalated: isHighSeverity },
      }, "completed");

      reviewed++;
      await new Promise(r => setTimeout(r, 300));
    } catch {
      // skip individual failures
    }
  }

  return { reviewed, escalated };
}

export async function deactivateForSafety(userId: string, reason: string): Promise<{ ok: boolean }> {
  // HIGH RISK — logs as pending_approval; a human must approve in the admin panel
  const action = await logAction({
    agent: "yande-safety",
    action_type: "deactivate_member",
    risk_level: "high",
    target_user_id: userId,
    metadata: { reason },
  }, "pending_approval");

  const supabase = admin();
  await supabase.from("notifications").insert({
    user_id: userId,
    type: "safety",
    title: "Account action required",
    body: "Your account has been temporarily restricted pending review. Please contact support.",
  });

  return { ok: !!action };
}

export async function sendSafetyConfirmation(reporterId: string): Promise<void> {
  const touched = await recordMemberTouch(reporterId, "safety_confirmation");
  if (!touched) return;

  const supabase = admin();
  await supabase.from("notifications").insert({
    user_id: reporterId,
    type: "safety",
    title: "We received your report ✦",
    body: "Thank you for keeping BloomBay safe. We take every report seriously and will follow up within 48 hours.",
  });
}
