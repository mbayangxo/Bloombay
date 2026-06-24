import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { db, cap, fmt } from "../supabase.js";

export const reportTools: Tool[] = [
  {
    name: "find_member_reports",
    description:
      "Find peer-reported safety incidents between members. Filter by severity, status, or date.",
    inputSchema: {
      type: "object",
      properties: {
        severity: { type: "string", enum: ["low", "medium", "high"] },
        status:   { type: "string", enum: ["pending", "reviewed", "resolved", "dismissed"] },
        limit:    { type: "number" },
      },
    },
  },
  {
    name: "find_safety_reports",
    description:
      "Find contact/safety form submissions from members. Filter by category or status.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", enum: ["support", "safety", "billing", "clubs"] },
        status:   { type: "string", enum: ["open", "reviewed", "closed"] },
        limit:    { type: "number" },
      },
    },
  },
  {
    name: "find_support_tickets",
    description: "Find member support tickets. Filter by status or category.",
    inputSchema: {
      type: "object",
      properties: {
        status:   { type: "string", enum: ["open", "in_progress", "resolved", "closed"] },
        category: { type: "string", enum: ["general", "billing", "account", "event", "safety", "other"] },
        needs_human: { type: "boolean", description: "Only tickets flagged as needing human review" },
        limit:    { type: "number" },
      },
    },
  },
  {
    name: "find_content_flags",
    description:
      "Find automatically fact-checked content flagged for review (wall posts, magazine articles, etc.).",
    inputSchema: {
      type: "object",
      properties: {
        content_type: { type: "string", enum: ["wall_post", "magazine_article", "avenue_content", "drop"] },
        verdict:      { type: "string", enum: ["needs_review", "approved", "rejected", "pass"] },
        min_risk_score: { type: "number", description: "Only flags with risk_score >= this value (0-100)" },
        limit:        { type: "number" },
      },
    },
  },
  {
    name: "find_pending_reviews",
    description:
      "Summary of everything currently needing review across all queues: member reports, safety forms, support tickets, content flags, and magazine pitches.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

type Args = Record<string, unknown>;

export async function handleReportTool(
  name: string,
  args: Args
): Promise<{ content: { type: "text"; text: string }[] }> {
  const text = await dispatch(name, args);
  return { content: [{ type: "text", text }] };
}

async function dispatch(name: string, args: Args): Promise<string> {
  switch (name) {
    case "find_member_reports":   return findMemberReports(args);
    case "find_safety_reports":   return findSafetyReports(args);
    case "find_support_tickets":  return findSupportTickets(args);
    case "find_content_flags":    return findContentFlags(args);
    case "find_pending_reviews":  return findPendingReviews();
    default: return `Unknown report tool: ${name}`;
  }
}

async function findMemberReports(args: Args): Promise<string> {
  let q = db
    .from("member_reports")
    .select(`
      id, reason, details, severity, status, created_at, resolved_at,
      reporter:profiles!reporter_id(full_name, email),
      reported:profiles!reported_id(full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(cap(Number(args.limit ?? 25)));

  if (args.severity) q = q.eq("severity", args.severity as string);
  if (args.status)   q = q.eq("status", args.status as string);

  const { data, error } = await q;
  if (error) return `Error: ${error.message}`;
  return fmt(data ?? []);
}

async function findSafetyReports(args: Args): Promise<string> {
  let q = db
    .from("safety_reports")
    .select("id, email, category, body, status, created_at")
    .order("created_at", { ascending: false })
    .limit(cap(Number(args.limit ?? 25)));

  if (args.category) q = q.eq("category", args.category as string);
  if (args.status)   q = q.eq("status", args.status as string);

  const { data, error } = await q;
  if (error) return `Error: ${error.message}`;
  return fmt(data ?? []);
}

async function findSupportTickets(args: Args): Promise<string> {
  let q = db
    .from("support_tickets")
    .select(`
      id, subject, message, category, status, needs_human, yande_response, resolved_at, created_at,
      user:profiles!user_id(full_name, email, city)
    `)
    .order("created_at", { ascending: false })
    .limit(cap(Number(args.limit ?? 25)));

  if (args.status)   q = q.eq("status", args.status as string);
  if (args.category) q = q.eq("category", args.category as string);
  if (args.needs_human === true) q = q.eq("needs_human", true);

  const { data, error } = await q;
  if (error) return `Error: ${error.message}`;
  return fmt(data ?? []);
}

async function findContentFlags(args: Args): Promise<string> {
  let q = db
    .from("content_moderation")
    .select("id, source_table, source_id, content_type, verdict, risk_score, summary, flags, auto_flagged, created_at")
    .order("created_at", { ascending: false })
    .limit(cap(Number(args.limit ?? 25)));

  if (args.content_type) q = q.eq("content_type", args.content_type as string);
  if (args.verdict)      q = q.eq("verdict", args.verdict as string);
  if (typeof args.min_risk_score === "number") q = q.gte("risk_score", args.min_risk_score);

  const { data, error } = await q;
  if (error) return `Error: ${error.message}`;
  return fmt(data ?? []);
}

async function findPendingReviews(): Promise<string> {
  const [memberReports, safetyReports, supportTickets, contentFlags, pitches] =
    await Promise.all([
      db.from("member_reports").select("id", { count: "exact" }).eq("status", "pending"),
      db.from("safety_reports").select("id", { count: "exact" }).eq("status", "open"),
      db.from("support_tickets").select("id", { count: "exact" }).in("status", ["open", "in_progress"]),
      db.from("content_moderation").select("id", { count: "exact" }).eq("verdict", "needs_review"),
      db.from("magazine_pitches").select("id", { count: "exact" }).eq("status", "pending"),
    ]);

  const summary = {
    member_reports_pending:   memberReports.count ?? 0,
    safety_reports_open:      safetyReports.count ?? 0,
    support_tickets_open:     supportTickets.count ?? 0,
    content_flags_pending:    contentFlags.count ?? 0,
    magazine_pitches_pending: pitches.count ?? 0,
    total: (memberReports.count ?? 0) + (safetyReports.count ?? 0) + (supportTickets.count ?? 0) + (contentFlags.count ?? 0) + (pitches.count ?? 0),
  };

  if (summary.total === 0) return "All queues are clear. Nothing pending review.";

  return `Pending review summary:\n${JSON.stringify(summary, null, 2)}\n\nCall find_member_reports, find_safety_reports, find_support_tickets, find_content_flags, or the founder/pitches API to drill into each queue.`;
}
