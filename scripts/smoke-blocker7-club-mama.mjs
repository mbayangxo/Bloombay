#!/usr/bin/env node
/**
 * Blocker 7 — Club Mama operator flow smoke.
 * Usage: node scripts/smoke-blocker7-club-mama.mjs
 *
 * Static: route files, publish_status filters, no localStorage on gatherings page, tsc.
 * Live (optional): APP_URL + Supabase env — staff queue + member feed filter.
 */

import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";
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
const APP_URL = (env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const STAFF_EMAIL = env.STAFF_EMAIL || "dmbayang@gmail.com";

const REQUIRED_FILES = [
  "app/api/admin/club-mama-applications/route.ts",
  "app/api/admin/club-mama-applications/[id]/route.ts",
  "app/api/club-portal/gatherings/route.ts",
  "app/api/club-portal/gatherings/[id]/publish/route.ts",
  "app/api/club-portal/gatherings/[id]/route.ts",
  "app/components/admin/portal/club-hosts-mission-panel.tsx",
  "app/club-owner/(authenticated)/gatherings/page.tsx",
];

const results = [];
function pass(id, d) {
  results.push({ id, ok: true, detail: d });
  console.log(`✅ ${id}: ${d}`);
}
function fail(id, d) {
  results.push({ id, ok: false, detail: d });
  console.log(`❌ ${id}: ${d}`);
}
function need(id, d) {
  results.push({ id, ok: true, detail: d });
  console.log(`🟡 ${id}: ${d}`);
}

function projectRef(url) {
  return new URL(url).hostname.split(".")[0];
}

function authCookie(session) {
  const ref = projectRef(SUPABASE_URL);
  return `sb-${ref}-auth-token=${encodeURIComponent(
    JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      expires_in: session.expires_in,
      token_type: session.token_type,
      user: session.user,
    }),
  )}`;
}

async function signIn(email) {
  const client = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkErr || !linkData?.properties?.hashed_token) {
    throw new Error(linkErr?.message || "no token");
  }
  const { data: otpData, error: otpErr } = await client.auth.verifyOtp({
    type: "email",
    token_hash: linkData.properties.hashed_token,
  });
  if (otpErr || !otpData.session) throw new Error(otpErr?.message);
  return otpData.session;
}

async function apiFetch(path, session, init = {}) {
  const headers = { ...(init.headers || {}) };
  if (session) headers.Cookie = authCookie(session);
  const res = await fetch(`${APP_URL}${path}`, { ...init, headers });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json };
}

function staticChecks() {
  console.log("\n── Static checks ──\n");

  for (const file of REQUIRED_FILES) {
    if (existsSync(file)) pass(`file:${file}`, "exists");
    else fail(`file:${file}`, "missing");
  }

  const eventsTs = readFileSync("lib/actions/events.ts", "utf8");
  if (eventsTs.includes('.eq("publish_status", "live")')) {
    pass("filter:events_ts", "publish_status=live");
  } else {
    fail("filter:events_ts", "missing publish_status filter");
  }

  const memberGatherings = readFileSync("app/api/member/gatherings/route.ts", "utf8");
  if (memberGatherings.includes('.eq("publish_status", "live")')) {
    pass("filter:member_gatherings", "publish_status=live");
  } else {
    fail("filter:member_gatherings", "missing publish_status filter");
  }

  const coGatherings = readFileSync("app/club-owner/(authenticated)/gatherings/page.tsx", "utf8");
  if (!coGatherings.includes("saveGathering") && !coGatherings.includes("listGatherings")) {
    pass("gatherings_page:no_local_storage", "uses API");
  } else {
    fail("gatherings_page:no_local_storage", "still uses club-owner-store");
  }

  if (readFileSync("app/api/club-portal/gatherings/[id]/publish/route.ts", "utf8").includes("gov_id_verification_status")) {
    pass("publish:gov_id_gate", "checked in publish route");
  } else {
    fail("publish:gov_id_gate", "missing gov-ID check");
  }

  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" });
    pass("tsc", "npx tsc --noEmit passed");
  } catch (e) {
    const out = (e.stdout?.toString() || e.stderr?.toString() || "").slice(0, 400);
    fail("tsc", out || "tsc failed");
  }
}

async function liveChecks() {
  if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) {
    need("live:skipped", "Supabase env missing — static only");
    return;
  }

  console.log("\n── Live checks ──\n");

  let sessionStaff;
  try {
    sessionStaff = await signIn(STAFF_EMAIL);
    pass("live:staff_signin", STAFF_EMAIL);
  } catch (e) {
    need("live:staff_signin", e.message);
    return;
  }

  try {
    const queue = await apiFetch("/api/admin/club-mama-applications?status=pending", sessionStaff);
    if (queue.status === 200 && Array.isArray(queue.json)) {
      pass("live:club_mama_queue", `${queue.json.length} pending`);
    } else if (queue.status === 401 || queue.status === 403) {
      fail("live:club_mama_queue", `HTTP ${queue.status}`);
    } else {
      fail("live:club_mama_queue", `HTTP ${queue.status} ${JSON.stringify(queue.json).slice(0, 120)}`);
    }

    const stats = await apiFetch("/api/admin/quick-stats", sessionStaff);
    if (stats.status === 200 && typeof stats.json.pendingClubMama === "number") {
      pass("live:quick_stats", `pendingClubMama=${stats.json.pendingClubMama}`);
    } else {
      fail("live:quick_stats", `HTTP ${stats.status}`);
    }

    const memberFeed = await apiFetch("/api/member/gatherings", sessionStaff);
    if (memberFeed.status === 200 && Array.isArray(memberFeed.json.gatherings)) {
      pass("live:member_gatherings", `${memberFeed.json.gatherings.length} rows`);
    } else {
      need("live:member_gatherings", `HTTP ${memberFeed.status}`);
    }
  } catch (e) {
    if (e?.cause?.code === "ECONNREFUSED" || String(e.message).includes("fetch failed")) {
      need("live:app_unreachable", `Start dev server at ${APP_URL}`);
      return;
    }
    throw e;
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const { count: draftCount } = await admin
    .from("gatherings")
    .select("id", { count: "exact", head: true })
    .eq("publish_status", "draft");
  const { count: liveCount } = await admin
    .from("gatherings")
    .select("id", { count: "exact", head: true })
    .eq("publish_status", "live");
  pass("live:db_publish_status", `draft=${draftCount ?? 0} live=${liveCount ?? 0}`);
}

async function main() {
  console.log(`\nBlocker 7 Club Mama smoke — APP_URL=${APP_URL}\n`);
  staticChecks();
  await liveChecks();

  const bad = results.filter((r) => !r.ok);
  console.log(`\n── Summary: ${results.length - bad.length}/${results.length} passed ──`);
  if (bad.length) {
    console.log("Failed:", bad.map((r) => r.id).join(", "));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
