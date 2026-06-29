#!/usr/bin/env node
/**
 * Smoke test for the four beta data-path fixes (migration 123 + code).
 *
 * Verifies, against a live Supabase project, that:
 *   1. club_memberships is keyed by (user_id, club_slug)  — onboarding club selection
 *   2. club_memberships has NO `club_id` column           — paid-club fulfillment drift fixed
 *   3. invites table exists (inviter_id, email, status)   — onboarding invites
 *   4. user_consents table exists (consent columns)       — legal consent log
 *   5. user_clubs table does NOT exist                    — confirms nothing depends on it
 *   6. club_applications is keyed by club_slug            — Club Mama approvals
 *   7. gatherings uses club_slug                          — gathering creation / discovery
 *
 * Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/smoke-beta-data-paths.mjs
 * Without those env vars it prints SKIP and exits 0 (so CI without secrets is green).
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.log("SKIP — no Supabase env (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY). Run with env to verify against the live DB.");
  process.exit(0);
}

const db = createClient(url, key, { auth: { persistSession: false } });
let failures = 0;

function pass(name) { console.log(`✓ ${name}`); }
function fail(name, detail) { console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`); failures++; }

// Probe: select the given columns with limit 0. Resolves { ok, error }.
async function probe(table, columns) {
  const { error } = await db.from(table).select(columns).limit(0);
  return { ok: !error, error: error?.message };
}

const run = async () => {
  // 1. club_memberships keyed by (user_id, club_slug)
  {
    const r = await probe("club_memberships", "user_id, club_slug");
    r.ok ? pass("club_memberships(user_id, club_slug) exists") : fail("club_memberships(user_id, club_slug)", r.error);
  }

  // 2. club_memberships has NO club_id (drift fixed)
  {
    const r = await probe("club_memberships", "club_id");
    r.ok ? fail("club_memberships.club_id should NOT exist (drift not fixed)") : pass("club_memberships.club_id is gone (drift fixed)");
  }

  // 3. invites table
  {
    const r = await probe("invites", "inviter_id, email, status");
    r.ok ? pass("invites(inviter_id, email, status) exists") : fail("invites table", r.error);
  }

  // 4. user_consents table
  {
    const r = await probe("user_consents", "user_id, consent_type, version, accepted_at, source, ip, user_agent");
    r.ok ? pass("user_consents(consent columns) exists") : fail("user_consents table", r.error);
  }

  // 5. user_clubs must NOT exist
  {
    const r = await probe("user_clubs", "user_id");
    r.ok ? fail("user_clubs should NOT exist (onboarding must not depend on it)") : pass("user_clubs is absent (nothing depends on it)");
  }

  // 6. club_applications keyed by club_slug
  {
    const r = await probe("club_applications", "club_slug, user_id, status");
    r.ok ? pass("club_applications(club_slug, user_id, status) exists") : fail("club_applications club_slug", r.error);
  }

  // 7. gatherings keyed by club_slug
  {
    const r = await probe("gatherings", "club_slug, title, starts_at");
    r.ok ? pass("gatherings(club_slug, title, starts_at) exists") : fail("gatherings club_slug", r.error);
  }

  if (failures > 0) {
    console.error(`\n${failures} check(s) failed.`);
    process.exit(1);
  }
  console.log("\nAll beta data-path checks passed.");
};

run().catch((e) => { console.error("smoke runner error:", e.message); process.exit(1); });
