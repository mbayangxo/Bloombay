import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

/**
 * Guards a cron route with secret verification and a kill switch.
 * Returns NextResponse if the request should be rejected, null if it can proceed.
 *
 * Usage:
 *   const guard = cronGuard(req, "wall-seeder");
 *   if (guard) return guard;
 */
export function cronGuard(req: NextRequest, jobName: string): NextResponse | null {
  if (process.env.CRON_ENABLED === "false") {
    return NextResponse.json({ skipped: `crons disabled (CRON_ENABLED=false)`, job: jobName });
  }
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Default max records per cron run (override via CRON_MAX_RECORDS env var). */
export function cronMaxRecords(fallback = 100): number {
  const val = parseInt(process.env.CRON_MAX_RECORDS ?? "", 10);
  return isNaN(val) ? fallback : val;
}

/** Log a cron run result to the cron_logs table (best-effort, never throws). */
export async function logCronRun(
  job: string,
  result: "ok" | "skipped" | "error",
  details?: Record<string, unknown>
): Promise<void> {
  try {
    const db = admin();
    await db.from("cron_logs").insert({
      job,
      result,
      details: details ?? null,
      ran_at: new Date().toISOString(),
    });
  } catch {
    // Never let logging break the cron job itself
  }
}
