import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth/require-role";
import { buildCursorQaPrompt, buildQaReport, runSmokeChecks } from "@/lib/founder-qa-engine";
import type { QaViewportId } from "@/lib/founder-qa-routes";

export async function POST(request: NextRequest) {
  const guard = await requireRole(request, ["founder", "admin"]);
  if (guard.error) return guard.error;

  const body = (await request.json().catch(() => ({}))) as {
    action?: "smoke" | "ask";
    question?: string;
    route?: string;
    viewport?: QaViewportId;
    origin?: string;
  };

  const origin = body.origin ?? new URL(request.url).origin;
  const route = body.route ?? "/member/home";
  const viewport = body.viewport ?? "desktop";
  const question = body.question ?? "";

  if (body.action === "smoke") {
    const smoke = await runSmokeChecks(origin);
    return NextResponse.json({ smoke });
  }

  const smoke = await runSmokeChecks(origin);
  const report = buildQaReport({ question, route, viewport, smoke });
  const cursorPrompt = buildCursorQaPrompt({ question, route, viewport, smoke, origin });

  return NextResponse.json({
    report,
    cursorPrompt,
    smoke,
  });
}
