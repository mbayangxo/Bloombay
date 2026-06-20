import { ALL_QA_ROUTES, QA_BRAND_CHECKLIST, type QaViewportId } from "@/lib/qa-routes";

export type SmokeResult = { path: string; label: string; status: number; ok: boolean; error?: string };

export async function runSmokeChecks(origin: string): Promise<SmokeResult[]> {
  const base = origin.replace(/\/$/, "");
  const results: SmokeResult[] = [];

  for (const route of ALL_QA_ROUTES) {
    const url = `${base}${route.path}`;
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "manual",
        headers: { Accept: "text/html" },
      });
      const ok = res.status >= 200 && res.status < 400;
      results.push({ path: route.path, label: route.label, status: res.status, ok });
    } catch (e) {
      results.push({
        path: route.path,
        label: route.label,
        status: 0,
        ok: false,
        error: e instanceof Error ? e.message : "fetch failed",
      });
    }
  }

  return results;
}

export function buildCursorQaPrompt(input: {
  question: string;
  route: string;
  viewport: QaViewportId;
  smoke?: SmokeResult[];
  origin: string;
}): string {
  const failed = input.smoke?.filter((s) => !s.ok) ?? [];
  const smokeBlock =
    input.smoke && input.smoke.length
      ? `\n## Smoke check (${input.origin})\n${input.smoke
          .map((s) => `- ${s.ok ? "✓" : "✗"} ${s.path} → ${s.status}${s.error ? ` (${s.error})` : ""}`)
          .join("\n")}`
      : "";

  const failedBlock = failed.length
    ? `\n## Broken routes\n${failed.map((f) => `- ${f.label} ${f.path}`).join("\n")}`
    : "";

  return `You are QA for BloomBay (member portal + founder tools).

## Task
${input.question.trim() || "Full QA pass on layout, branding, responsiveness, and broken links."}

## Context
- Viewport: **${input.viewport}**
- Page under review: **${input.route}**
- Preview URL: ${input.origin}${input.route}
- Brand: hot pink #ff0055, Barbie #ffe4ec, white, black #1a0514. Typography: Barlow Condensed, DM Sans, Cormorant.
${smokeBlock}${failedBlock}

## Checklist
${QA_BRAND_CHECKLIST.map((c) => `- ${c}`).join("\n")}

## Deliverable
1. List issues by severity (blocker / polish)
2. Name exact files or CSS modules to change if known
3. Confirm mobile, tablet, and desktop behavior
4. Note anything that fails smoke or looks off-brand`;
}

export function buildQaReport(input: {
  question: string;
  route: string;
  viewport: QaViewportId;
  smoke?: SmokeResult[];
}): string {
  const lines: string[] = [];
  lines.push(`Viewport: ${input.viewport}`);
  lines.push(`Route: ${input.route}`);
  if (input.question.trim()) lines.push(`Question: ${input.question.trim()}`);

  if (input.smoke?.length) {
    const bad = input.smoke.filter((s) => !s.ok);
    lines.push("");
    lines.push(`Smoke: ${input.smoke.length - bad.length}/${input.smoke.length} routes OK`);
    if (bad.length) {
      lines.push("Needs attention:");
      bad.forEach((b) => lines.push(`  • ${b.label} (${b.path}) — HTTP ${b.status}`));
    }
  }

  lines.push("");
  lines.push("Brand checklist:");
  QA_BRAND_CHECKLIST.forEach((c) => lines.push(`  • ${c}`));
  lines.push("");
  lines.push(
    "Copy the Cursor prompt below into Cursor chat (Agent mode) to run a full visual + code QA pass.",
  );

  return lines.join("\n");
}
