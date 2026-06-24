import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
}

export const db = createClient(url, key, {
  auth: { persistSession: false },
});

export function cap(n: number, max = 50): number {
  return Math.min(Math.max(1, n), max);
}

export function fmt(rows: unknown[]): string {
  if (rows.length === 0) return "No results found.";
  return JSON.stringify(rows, null, 2);
}
