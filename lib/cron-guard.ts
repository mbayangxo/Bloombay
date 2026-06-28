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

function envTruthy(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === "true" || v === "1";
}

/** True when CRON_ENABLED is "true" or "1". */
export function isCronEnabled(): boolean {
  return envTruthy(process.env.CRON_ENABLED);
}

/** Returns true when CRON_DRY_RUN is "true" or "1" — gate all writes behind this. */
export function isDryRun(): boolean {
  return envTruthy(process.env.CRON_DRY_RUN);
}

/** Default max records per cron run (override via CRON_MAX_RECORDS env var). */
export function cronMaxRecords(fallback = 100): number {
  const val = parseInt(process.env.CRON_MAX_RECORDS ?? "", 10);
  return isNaN(val) ? fallback : val;
}

export interface CronContext {
  dryRun: boolean;
  maxRecords: number;
}

export type CronJobResult = {
  recordsProcessed?: number;
  skipped?: boolean;
  reason?: string;
  [key: string]: unknown;
};

function verifyCronAuth(req: NextRequest | Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const headerSecret = req.headers.get("x-cron-secret");
  if (headerSecret === secret) return true;

  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  return false;
}

/**
 * Guards a cron route with secret verification and a kill switch.
 * Returns NextResponse if the request should be rejected, null if it can proceed.
 *
 * Supports `x-cron-secret` header or `Authorization: Bearer <CRON_SECRET>`.
 */
export function cronGuard(req: NextRequest | Request, jobName: string): NextResponse | null {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCronEnabled()) {
    return NextResponse.json({ skipped: true, reason: "CRON_DISABLED", job: jobName });
  }

  return null;
}

/**
 * Standard cron wrapper: auth, kill switch, dry-run context, structured logging.
 * Logs to `cron_logs` (see CRON_AUDIT.md for column mapping).
 */
export async function runCronJob(
  req: NextRequest | Request,
  jobName: string,
  fn: (ctx: CronContext) => Promise<CronJobResult>
): Promise<NextResponse> {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCronEnabled()) {
    await logCronRun(jobName, "skipped", {
      reason: "CRON_DISABLED",
      started_at: new Date().toISOString(),
      finished_at: new Date().toISOString(),
    });
    return NextResponse.json({ skipped: true, reason: "CRON_DISABLED", job: jobName });
  }

  const startedAt = new Date().toISOString();
  const ctx: CronContext = {
    dryRun: isDryRun(),
    maxRecords: cronMaxRecords(),
  };

  let status: "ok" | "skipped" | "error" = "ok";
  let details: Record<string, unknown> = { started_at: startedAt };
  let responseBody: Record<string, unknown> = { ok: true };
  let httpStatus = 200;

  try {
    const result = await fn(ctx);
    const records =
      typeof result.recordsProcessed === "number"
        ? result.recordsProcessed
        : typeof result.records_processed === "number"
          ? result.records_processed
          : 0;

    details = {
      ...result,
      records_processed: records,
      started_at: startedAt,
    };

    if (result.skipped) {
      status = "skipped";
      responseBody = { ok: true, ...result };
    } else if (result.error && !result.ok) {
      status = "error";
      httpStatus = typeof result.status === "number" ? result.status : 500;
      responseBody = result;
    } else {
      responseBody = { ok: true, ...result };
    }
  } catch (err) {
    status = "error";
    details = {
      error: String(err),
      started_at: startedAt,
    };
    responseBody = { error: "Internal error" };
    httpStatus = 500;
  } finally {
    await logCronRun(jobName, status, {
      ...details,
      finished_at: new Date().toISOString(),
    });
  }

  return NextResponse.json(responseBody, { status: httpStatus });
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
      records_processed:
        typeof details?.records_processed === "number" ? details.records_processed : null,
      error_message:
        typeof details?.error === "string"
          ? details.error
          : typeof details?.reason === "string" && result === "error"
            ? details.reason
            : null,
      started_at: typeof details?.started_at === "string" ? details.started_at : null,
      finished_at: typeof details?.finished_at === "string" ? details.finished_at : null,
      ran_at: new Date().toISOString(),
    });
  } catch {
    // Never let logging break the cron job itself
  }
}
