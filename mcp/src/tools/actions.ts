import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { db } from "../supabase.js";

// ── Phase 3: Action Tools ─────────────────────────────────────────────────────
// Every action requires confirmed: true.
// Without it, the tool describes what will happen and refuses to proceed.
// This forces Claude to explicitly ask the human before confirming.

export const actionTools: Tool[] = [
  {
    name: "send_draft",
    description:
      "Send a single saved draft (email or SMS) to its recipient. Requires confirmed: true — without it, shows a preview and stops.",
    inputSchema: {
      type: "object",
      required: ["draft_id"],
      properties: {
        draft_id:  { type: "string", description: "UUID from yande_drafts" },
        confirmed: { type: "boolean", description: "Must be true to actually send. Omit or false to preview only." },
      },
    },
  },
  {
    name: "send_bulk_reminders",
    description:
      "Send all reminder drafts for an event. Requires confirmed: true. Without it, shows a count and preview.",
    inputSchema: {
      type: "object",
      required: ["event_id", "event_type"],
      properties: {
        event_id:   { type: "string" },
        event_type: { type: "string", enum: ["event", "gathering"] },
        confirmed:  { type: "boolean" },
      },
    },
  },
  {
    name: "feature_club",
    description:
      "Feature or unfeature a club. Featured clubs appear prominently in discovery. Requires confirmed: true.",
    inputSchema: {
      type: "object",
      required: ["club_slug", "featured"],
      properties: {
        club_slug:  { type: "string" },
        featured:   { type: "boolean", description: "true to feature, false to unfeature" },
        confirmed:  { type: "boolean" },
      },
    },
  },
  {
    name: "approve_verification",
    description:
      "Approve identity verification for a member. Marks them as verified. Requires confirmed: true.",
    inputSchema: {
      type: "object",
      required: ["user_id"],
      properties: {
        user_id:   { type: "string", description: "User UUID" },
        confirmed: { type: "boolean" },
      },
    },
  },
  {
    name: "close_report",
    description:
      "Close a safety report or member report with a resolution note. Requires confirmed: true.",
    inputSchema: {
      type: "object",
      required: ["report_id", "report_type", "resolution"],
      properties: {
        report_id:   { type: "string", description: "Report UUID" },
        report_type: { type: "string", enum: ["member", "safety", "support"] },
        resolution:  { type: "string", description: "How it was resolved (becomes internal note)" },
        outcome:     { type: "string", enum: ["resolved","dismissed","closed"], description: "Final status (default: resolved)" },
        confirmed:   { type: "boolean" },
      },
    },
  },
  {
    name: "update_member_status",
    description:
      "Warn, suspend, or unsuspend a member. Warn adds a note. Suspend prevents login. Requires confirmed: true.",
    inputSchema: {
      type: "object",
      required: ["user_id", "action", "reason"],
      properties: {
        user_id:   { type: "string", description: "User UUID" },
        action:    { type: "string", enum: ["warn", "suspend", "unsuspend"] },
        reason:    { type: "string", description: "Why this action is being taken (logged)" },
        confirmed: { type: "boolean" },
      },
    },
  },
];

type Args = Record<string, unknown>;

export async function handleActionTool(
  name: string,
  args: Args
): Promise<{ content: { type: "text"; text: string }[] }> {
  const text = await dispatch(name, args);
  return { content: [{ type: "text", text }] };
}

async function dispatch(name: string, args: Args): Promise<string> {
  switch (name) {
    case "send_draft":          return sendDraft(args);
    case "send_bulk_reminders": return sendBulkReminders(args);
    case "feature_club":        return featureClub(args);
    case "approve_verification": return approveVerification(args);
    case "close_report":        return closeReport(args);
    case "update_member_status": return updateMemberStatus(args);
    default: return `Unknown action tool: ${name}`;
  }
}

// ── Confirmation guard ────────────────────────────────────────────────────────

function needsConfirmation(description: string): string {
  return `⚠️ REQUIRES CONFIRMATION\n\n${description}\n\nTo execute: call this tool again with confirmed: true.\nTo cancel: do nothing.`;
}

async function logAction(action: string, params: unknown, result: unknown) {
  await db.from("yande_action_log").insert({
    action, params, result, confirmed_by: "yande-mcp",
  });
}

// ── Resend / Twilio senders ───────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, body: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not configured" };

  const from = process.env.RESEND_FROM ?? "BloomBay <hello@bloombay.co>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text: body }),
  });

  if (!res.ok) {
    const txt = await res.text();
    return { ok: false, error: txt };
  }
  return { ok: true };
}

async function sendSms(to: string, body: string): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  if (!accountSid || !authToken || !fromNumber) return { ok: false, skipped: true, error: "Twilio not configured" };

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: to, From: fromNumber, Body: body }),
  });

  if (!res.ok) {
    const txt = await res.text();
    return { ok: false, error: txt };
  }
  return { ok: true };
}

// ── Action implementations ────────────────────────────────────────────────────

async function sendDraft(args: Args): Promise<string> {
  const { data: draft } = await db.from("yande_drafts")
    .select("*").eq("id", args.draft_id as string).maybeSingle();

  if (!draft) return "Draft not found.";
  if (draft.status === "sent") return "This draft has already been sent.";

  const preview = `Send ${draft.type.toUpperCase()} to ${draft.recipient_email ?? draft.recipient_phone ?? "recipient"}\n\n${draft.subject ? `Subject: ${draft.subject}\n` : ""}---\n${draft.body}\n---`;

  if (!args.confirmed) return needsConfirmation(preview);

  let result: { ok: boolean; error?: string; skipped?: boolean };

  if (draft.type === "email" || (draft.type === "reminder" && draft.recipient_email)) {
    result = await sendEmail(draft.recipient_email!, draft.subject ?? "A message from BloomBay", draft.body);
  } else if (draft.type === "sms" || (draft.type === "reminder" && draft.recipient_phone)) {
    result = await sendSms(draft.recipient_phone!, draft.body);
  } else {
    return "Error: draft has no valid recipient email or phone.";
  }

  const status = result.ok ? "sent" : result.skipped ? "queued" : "failed";
  await db.from("yande_drafts").update({
    status, sent_at: result.ok ? new Date().toISOString() : null, error: result.error ?? null,
  }).eq("id", draft.id);

  await logAction("send_draft", { draft_id: draft.id, type: draft.type }, result);

  if (result.ok)      return `✓ Sent successfully to ${draft.recipient_email ?? draft.recipient_phone}.`;
  if (result.skipped) return `Draft queued (${result.error}). Will send when credentials are configured.`;
  return `Failed to send: ${result.error}`;
}

async function sendBulkReminders(args: Args): Promise<string> {
  const { data: drafts } = await db.from("yande_drafts")
    .select("id, type, recipient_email, recipient_phone, subject, body, status")
    .eq("status", "draft")
    .contains("context", { event_id: args.event_id, event_type: args.event_type });

  if (!drafts?.length) return "No pending reminder drafts found for this event. Run draft_bulk_reminder first.";

  if (!args.confirmed) {
    return needsConfirmation(
      `Send ${drafts.length} reminders for this event.\nChannels: ${drafts.filter(d => d.recipient_email).length} email, ${drafts.filter(d => d.recipient_phone).length} SMS.\n\nPreview of first message:\n---\n${drafts[0].body}\n---`
    );
  }

  let sent = 0, failed = 0, queued = 0;

  for (const draft of drafts) {
    let result: { ok: boolean; error?: string; skipped?: boolean };

    if (draft.recipient_email) {
      result = await sendEmail(draft.recipient_email, draft.subject ?? "A message from BloomBay", draft.body);
    } else if (draft.recipient_phone) {
      result = await sendSms(draft.recipient_phone, draft.body);
    } else {
      continue;
    }

    const status = result.ok ? "sent" : result.skipped ? "queued" : "failed";
    await db.from("yande_drafts").update({
      status, sent_at: result.ok ? new Date().toISOString() : null, error: result.error ?? null,
    }).eq("id", draft.id);

    if (result.ok) sent++;
    else if (result.skipped) queued++;
    else failed++;
  }

  await logAction("send_bulk_reminders", args, { sent, failed, queued });
  return `Reminders dispatched:\n✓ Sent: ${sent}\n⏳ Queued: ${queued}\n✗ Failed: ${failed}`;
}

async function featureClub(args: Args): Promise<string> {
  const { data: club } = await db.from("clubs")
    .select("name, is_featured").eq("slug", args.club_slug as string).maybeSingle();
  if (!club) return `Club '${args.club_slug}' not found.`;

  const action = args.featured ? "feature" : "unfeature";
  if (!args.confirmed) {
    return needsConfirmation(
      `${action.charAt(0).toUpperCase() + action.slice(1)} club "${club.name}".\nCurrent status: ${club.is_featured ? "featured" : "not featured"}.`
    );
  }

  const { error } = await db.from("clubs").update({
    is_featured: args.featured as boolean,
    featured_at: args.featured ? new Date().toISOString() : null,
  }).eq("slug", args.club_slug as string);

  if (error) return `Error: ${error.message}`;
  await logAction("feature_club", args, { club: club.name, featured: args.featured });
  return `✓ Club "${club.name}" ${args.featured ? "featured" : "unfeatured"} successfully.`;
}

async function approveVerification(args: Args): Promise<string> {
  const { data: user } = await db.from("profiles")
    .select("full_name, email, verification_status").eq("id", args.user_id as string).maybeSingle();
  if (!user) return "User not found.";

  if (!args.confirmed) {
    return needsConfirmation(
      `Approve identity verification for ${user.full_name} (${user.email}).\nCurrent status: ${user.verification_status}.`
    );
  }

  const { error } = await db.from("profiles").update({
    verified: true,
    verification_status: "verified",
  }).eq("id", args.user_id as string);

  if (error) return `Error: ${error.message}`;
  await logAction("approve_verification", { user_id: args.user_id }, { user: user.full_name });
  return `✓ ${user.full_name} verified successfully.`;
}

async function closeReport(args: Args): Promise<string> {
  const tableMap = { member: "member_reports", safety: "safety_reports", support: "support_tickets" };
  const table = tableMap[args.report_type as keyof typeof tableMap];
  if (!table) return "Invalid report_type.";

  const { data: report } = await db.from(table).select("*").eq("id", args.report_id as string).maybeSingle();
  if (!report) return "Report not found.";

  if (!args.confirmed) {
    return needsConfirmation(
      `Close ${args.report_type} report (ID: ${args.report_id}).\nCurrent status: ${report.status}.\nResolution: ${args.resolution}`
    );
  }

  const outcome = (args.outcome as string) ?? "resolved";
  const updateData: Record<string, unknown> = { status: outcome };

  if (args.report_type === "member") updateData.yande_summary = args.resolution;
  if (args.report_type === "support") updateData.yande_response = args.resolution;
  if (outcome === "resolved") updateData.resolved_at = new Date().toISOString();

  const { error } = await db.from(table).update(updateData).eq("id", args.report_id as string);
  if (error) return `Error: ${error.message}`;

  await logAction("close_report", args, { table, outcome });
  return `✓ Report closed with outcome: ${outcome}.`;
}

async function updateMemberStatus(args: Args): Promise<string> {
  const { data: user } = await db.from("profiles")
    .select("full_name, email, suspended_at").eq("id", args.user_id as string).maybeSingle();
  if (!user) return "User not found.";

  const action = args.action as string;

  if (!args.confirmed) {
    const descriptions = {
      warn:      `Log a warning for ${user.full_name} (${user.email}).\nReason: ${args.reason}`,
      suspend:   `Suspend ${user.full_name} (${user.email}). They will lose access.\nReason: ${args.reason}`,
      unsuspend: `Restore access for ${user.full_name} (${user.email}).\nCurrently suspended: ${user.suspended_at ? "yes" : "no"}`,
    };
    return needsConfirmation(descriptions[action as keyof typeof descriptions] ?? "Unknown action.");
  }

  if (action === "warn") {
    // Log to action log; optionally draft a warning message
    await logAction("warn_member", { user_id: args.user_id, reason: args.reason }, { user: user.full_name });
    return `✓ Warning logged for ${user.full_name}. Use draft_email to send a warning message if needed.`;
  }

  if (action === "suspend") {
    const { error } = await db.from("profiles").update({
      suspended_at: new Date().toISOString(),
      suspension_reason: args.reason as string,
    }).eq("id", args.user_id as string);
    if (error) return `Error: ${error.message}`;
    await logAction("suspend_member", args, { user: user.full_name });
    return `✓ ${user.full_name} suspended. Reason logged.`;
  }

  if (action === "unsuspend") {
    const { error } = await db.from("profiles").update({
      suspended_at: null, suspension_reason: null,
    }).eq("id", args.user_id as string);
    if (error) return `Error: ${error.message}`;
    await logAction("unsuspend_member", args, { user: user.full_name });
    return `✓ ${user.full_name} access restored.`;
  }

  return `Unknown action: ${action}`;
}
