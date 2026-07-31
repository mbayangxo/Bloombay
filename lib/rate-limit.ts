import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Best-effort client identifier for rate limiting unauthenticated
 * endpoints. Not spoof-proof (a client can lie about x-forwarded-for),
 * but it's the standard low-effort signal available behind Vercel's edge
 * network without adding new infrastructure. Accepts any Request-like
 * object (plain Request or NextRequest) since route handlers use both.
 */
export function clientIp(req: { headers: Headers }): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Returns true if `key` has already hit `max` requests within
 * `windowSeconds`. Records this request as a hit either way (so a caller
 * that's over the limit doesn't get a free retry-without-counting).
 */
export async function isRateLimited(
  key: string,
  opts: { max: number; windowSeconds: number },
): Promise<boolean> {
  const db = createAdminClient();
  const since = new Date(Date.now() - opts.windowSeconds * 1000).toISOString();

  const { count } = await db
    .from("rate_limit_hits")
    .select("id", { count: "exact", head: true })
    .eq("rl_key", key)
    .gte("created_at", since);

  await db.from("rate_limit_hits").insert({ rl_key: key });

  return (count ?? 0) >= opts.max;
}
