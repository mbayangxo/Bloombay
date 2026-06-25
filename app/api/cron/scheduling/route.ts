import { NextRequest, NextResponse } from "next/server";
import { nudgeClubsWithNoUpcomingEvents, suggestRecurringEvents } from "@/lib/yande/scheduling";
import { cronGuard, isDryRun, logCronRun } from "@/lib/cron-guard";

export async function POST(req: NextRequest) {
  const guard = cronGuard(req, "scheduling");
  if (guard) return guard;

  if (isDryRun()) {
    return NextResponse.json({ ok: true, dry_run: true, message: "Dry run — no data written" });
  }

  try {
    const [clubs, recurring] = await Promise.all([
      nudgeClubsWithNoUpcomingEvents(),
      suggestRecurringEvents(),
    ]);
    await logCronRun("scheduling", "ok", { clubs, recurring });
    return NextResponse.json({ ok: true, clubs, recurring });
  } catch (err) {
    await logCronRun("scheduling", "error", { error: String(err) });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
