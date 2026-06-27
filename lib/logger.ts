export type LogDomain =
  | "payment"
  | "supabase"
  | "admin"
  | "moderation"
  | "cron"
  | "upload"
  | "notification"
  | "api"
  | "search";

type LogLevel = "info" | "warn" | "error";

function write(level: LogLevel, domain: LogDomain, message: string, meta?: Record<string, unknown>) {
  const payload = {
    level,
    domain,
    message,
    ts: new Date().toISOString(),
    ...meta,
  };
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}

export function logInfo(domain: LogDomain, message: string, meta?: Record<string, unknown>) {
  write("info", domain, message, meta);
}

export function logWarn(domain: LogDomain, message: string, meta?: Record<string, unknown>) {
  write("warn", domain, message, meta);
}

export function logError(domain: LogDomain, message: string, meta?: Record<string, unknown>) {
  write("error", domain, message, meta);
}

/** Safe message for client — never includes stack traces or secrets. */
export function userSafeMessage(fallback = "Something went wrong. Please try again.") {
  return fallback;
}
