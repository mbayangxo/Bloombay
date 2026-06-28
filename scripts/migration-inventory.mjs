#!/usr/bin/env node
/**
 * Migration inventory — confirm 115–120 schema on connected Supabase.
 * Usage: node scripts/migration-inventory.mjs
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = { ...process.env };
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i > 0) env[t.slice(0, i)] = t.slice(i + 1).replace(/^"|"$/g, "");
    }
  } catch {
    /* optional */
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const results = [];

async function check(id, label, fn) {
  try {
    const ok = await fn();
    results.push({ id, ok, label });
    console.log(ok ? `✅ ${id}: ${label}` : `❌ ${id}: ${label}`);
  } catch (e) {
    results.push({ id, ok: false, label: `${label} — ${e.message}` });
    console.log(`❌ ${id}: ${label} — ${e.message}`);
  }
}

async function main() {
  console.log(`\nMigration inventory — ${SUPABASE_URL}\n`);
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error("Missing Supabase env");
    process.exit(1);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  await check("115", "moderation_cases table", async () => {
    const { error } = await admin.from("moderation_cases").select("id", { head: true, count: "exact" });
    return !error;
  });

  await check("116", "notification_events table", async () => {
    const { error } = await admin.from("notification_events").select("id", { head: true, count: "exact" });
    return !error;
  });

  await check("117", "profiles.gov_id_storage_path column", async () => {
    const { error } = await admin.from("profiles").select("gov_id_storage_path").limit(1);
    return !error;
  });

  await check("118", "admin_audit_logs.actor_role column", async () => {
    const { error } = await admin.from("admin_audit_logs").select("actor_role").limit(1);
    return !error;
  });

  await check("119", "member_reports source columns", async () => {
    const { error } = await admin
      .from("member_reports")
      .select("source_type, source_id, admin_notes")
      .limit(1);
    return !error;
  });

  await check("120", "notifications.type allows report_submitted", async () => {
    const { data: prof } = await admin.from("profiles").select("id").limit(1).maybeSingle();
    if (!prof?.id) return false;
    const { data: row, error } = await admin
      .from("notifications")
      .insert({
        user_id: prof.id,
        type: "report_submitted",
        title: "_migration_120_probe",
        body: "probe",
      })
      .select("id")
      .single();
    if (error) return false;
    await admin.from("notifications").delete().eq("id", row.id);
    return true;
  });

  const privateBuckets = [
    "government-ids",
    "verification-selfies",
    "girlmate-private",
    "moderation-evidence",
    "reports",
  ];
  const { data: buckets, error: bucketErr } = await admin.storage.listBuckets();
  if (bucketErr) {
    console.log(`🟡 buckets: could not list (${bucketErr.message})`);
  } else {
    for (const id of privateBuckets) {
      const row = (buckets ?? []).find((b) => b.id === id);
      if (!row) {
        console.log(`🟡 bucket:${id}: not found`);
      } else if (row.public) {
        console.log(`❌ bucket:${id}: public=true (must be false)`);
        results.push({ id: `bucket:${id}`, ok: false, label: "public bucket" });
      } else {
        console.log(`✅ bucket:${id}: private`);
        results.push({ id: `bucket:${id}`, ok: true, label: "private" });
      }
    }
  }

  const bad = results.filter((r) => !r.ok);
  console.log(`\n── Summary: ${results.length - bad.length}/${results.length} schema checks passed ──\n`);
  process.exit(bad.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
