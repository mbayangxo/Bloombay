#!/usr/bin/env node
/**
 * Apply migration 120 on staging via direct Postgres (DATABASE_URL or SUPABASE_DB_PASSWORD).
 *
 * Usage:
 *   SUPABASE_DB_PASSWORD='your-db-password' node scripts/apply-migration-120.mjs
 *   DATABASE_URL='postgresql://...' node scripts/apply-migration-120.mjs
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i > 0 && !process.env[t.slice(0, i)]) {
        process.env[t.slice(0, i)] = t.slice(i + 1).replace(/^"|"$/g, "");
      }
    }
  } catch {
    /* optional */
  }
}

loadEnv();

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.SUPABASE_DB_URL) return process.env.SUPABASE_DB_URL;
  const pw = process.env.SUPABASE_DB_PASSWORD;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!pw || !supabaseUrl) return null;
  const ref = new URL(supabaseUrl).hostname.split(".")[0];
  const region = process.env.SUPABASE_DB_REGION || "us-east-1";
  const host = process.env.SUPABASE_DB_HOST || `aws-0-${region}.pooler.supabase.com`;
  return `postgresql://postgres.${ref}:${encodeURIComponent(pw)}@${host}:6543/postgres`;
}

async function main() {
  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) {
    console.error(
      "Missing DATABASE_URL or SUPABASE_DB_PASSWORD.\n" +
        "Apply manually: supabase/scripts/APPLY_120_report_submitted.sql in Supabase SQL Editor.",
    );
    process.exit(1);
  }

  const sql = readFileSync(
    join(root, "supabase/migrations/120_report_submitted_notification_type.sql"),
    "utf8",
  );

  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
    console.log("✓ Applied migration 120 (report_submitted notification type)");
    const { rows } = await client.query(
      `SELECT pg_get_constraintdef(oid) AS def
       FROM pg_constraint
       WHERE conrelid = 'public.notifications'::regclass
         AND conname = 'notifications_type_check'`,
    );
    console.log(rows[0]?.def ?? "(constraint not found)");
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error("Migration failed:", e.message);
  process.exit(1);
});
