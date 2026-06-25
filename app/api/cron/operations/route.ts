import { NextRequest, NextResponse } from "next/server";
import { processEventWaitlists, checkCapacityAlerts } from "@/lib/yande/operations";
import { cronGuard, isDryRun, logCronRun } from "@/lib/cron-guard";

export async function POST(req: NextRequest) {
  const guard = cronGuard(req, "operations");
  if (guard) return guard;

  if (isDryRun()) {
    return NextResponse.json({ ok: true, dry_run: true, message: "Dry run — no data written" });
  }

  try {
    const [waitlists, capacity] = await Promise.all([
      processEventWaitlists(),
      checkCapacityAlerts(),
    ]);
    await logCronRun("operations", "ok", { waitlists, capacity });
    return NextResponse.json({ ok: true, waitlists, capacity });
  } catch (err) {
    await logCronRun("operations", "error", { error: String(err) });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
