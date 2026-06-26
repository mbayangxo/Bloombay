/** Client helpers for member report / block APIs */

export const MEMBER_REPORT_REASONS = [
  { value: "harassment", label: "Harassment" },
  { value: "spam", label: "Spam" },
  { value: "fake_profile", label: "Fake profile" },
  { value: "inappropriate_content", label: "Inappropriate content" },
  { value: "hate_speech", label: "Hate speech" },
  { value: "scam", label: "Scam" },
  { value: "other", label: "Other" },
] as const;

export type MemberReportReason = (typeof MEMBER_REPORT_REASONS)[number]["value"];

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type BlockedMemberRow = { blocked_id: string; created_at: string };

async function parseJson(res: Response): Promise<Record<string, unknown>> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function apiError(res: Response, body: Record<string, unknown>, fallback: string): string {
  const msg = typeof body.error === "string" ? body.error : fallback;
  return res.status === 401 ? "Sign in required" : msg;
}

/** Resolve email-prefix username, @handle, or raw UUID to a member id. */
export async function resolveMemberId(input: string): Promise<string> {
  const trimmed = input.trim().replace(/^@/, "");
  if (!trimmed) throw new Error("Enter a username or member ID");
  if (UUID_RE.test(trimmed)) return trimmed;

  const res = await fetch(
    `/api/member/resolve-user?username=${encodeURIComponent(trimmed)}`,
  );
  const body = await parseJson(res);
  if (!res.ok) {
    throw new Error(apiError(res, body, "Member not found"));
  }
  const id = body.id;
  if (typeof id !== "string") throw new Error("Member not found");
  return id;
}

export async function submitMemberReport(input: {
  reported_id: string;
  reason: MemberReportReason;
  details?: string;
  source_type?: string;
  source_id?: string;
}): Promise<{ report_id: string }> {
  const res = await fetch("/api/member/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reported_id: input.reported_id,
      reason: input.reason,
      details: input.details?.trim() || undefined,
      source_type: input.source_type,
      source_id: input.source_id,
    }),
  });
  const body = await parseJson(res);
  if (!res.ok) {
    throw new Error(apiError(res, body, "Could not submit report"));
  }
  const reportId = body.report_id;
  if (typeof reportId !== "string") throw new Error("Could not submit report");
  return { report_id: reportId };
}

export async function fetchBlockedMembers(): Promise<BlockedMemberRow[]> {
  const res = await fetch("/api/member/block");
  if (!res.ok) {
    const body = await parseJson(res);
    throw new Error(apiError(res, body, "Could not load blocked users"));
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) return [];
  return data as BlockedMemberRow[];
}

export async function blockMember(blocked_id: string): Promise<void> {
  const res = await fetch("/api/member/block", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocked_id }),
  });
  const body = await parseJson(res);
  if (!res.ok) {
    throw new Error(apiError(res, body, "Could not block member"));
  }
}

export async function unblockMember(blocked_id: string): Promise<void> {
  const res = await fetch(
    `/api/member/block?blocked_id=${encodeURIComponent(blocked_id)}`,
    { method: "DELETE" },
  );
  const body = await parseJson(res);
  if (!res.ok) {
    throw new Error(apiError(res, body, "Could not unblock member"));
  }
}
