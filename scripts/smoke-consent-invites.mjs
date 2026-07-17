#!/usr/bin/env node
/**
 * Smoke test for migration 094 (consent + invites backend).
 *
 * Verifies, against a live Supabase project, that:
 *   1. invites table exists (inviter_id, email, status)   — onboarding invites
 *   2. user_consents table exists (consent columns)       — legal consent log
 *
 * Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/smoke-consent-invites.mjs
 * Without those env vars it prints SKIP and exits 0.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.log("SKIP — no Supabase env. Run with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to verify against the live DB.");
  process.exit(0);
}

const db = createClient(url, key, { auth: { persistSession: false } });
let failures = 0;
const pass = (n) => console.log(`✓ ${n}`);
const fail = (n, d) => { console.error(`✗ ${n}${d ? ` — ${d}` : ""}`); failures++; };

async function probe(table, columns) {
  const { error } = await db.from(table).select(columns).limit(0);
  return { ok: !error, error: error?.message };
}

const run = async () => {
  {
    const r = await probe("invites", "inviter_id, email, status");
    r.ok ? pass("invites(inviter_id, email, status) exists") : fail("invites table", r.error);
  }
  {
    const r = await probe("user_consents", "user_id, consent_type, version, accepted_at, source, ip, user_agent");
    r.ok ? pass("user_consents(consent columns) exists") : fail("user_consents table", r.error);
  }

  if (failures > 0) { console.error(`\n${failures} check(s) failed.`); process.exit(1); }
  console.log("\nConsent + invites backend verified.");
};

run().catch((e) => { console.error("smoke runner error:", e.message); process.exit(1); });
