import { NextRequest, NextResponse } from "next/server";
import { reviewPendingReports } from "@/lib/yande/safety";
import { cronGuard, isDryRun, logCronRun } from "@/lib/cron-guard";

export async function POST(req: NextRequest) {
  const guard = cronGuard(req, "safety-monitor");
  if (guard) return guard;

  if (isDryRun()) {
    return NextResponse.json({ ok: true, dry_run: true, message: "Dry run — no data written" });
  }

  try {
    const result = await reviewPendingReports();
    await logCronRun("safety-monitor", "ok", result as Record<string, unknown>);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    await logCronRun("safety-monitor", "error", { error: String(err) });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
