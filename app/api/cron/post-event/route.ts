import { NextResponse } from "next/server";
import { processPostEventFollowups } from "@/lib/yande/post-event";
import { isDryRun, logCronRun } from "@/lib/cron-guard";

export const runtime = "nodejs";

// Uses GET + Bearer auth to match original Vercel cron config — do not change to POST
// without updating vercel.json.
export async function GET(req: Request) {
  if (process.env.CRON_ENABLED === "false") {
    return NextResponse.json({ skipped: "crons disabled", job: "post-event" });
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDryRun()) {
    return NextResponse.json({ ok: true, dry_run: true, message: "Dry run — no data written" });
  }

  try {
    const result = await processPostEventFollowups();
    await logCronRun("post-event", "ok", result as Record<string, unknown>);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    await logCronRun("post-event", "error", { error: String(err) });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
