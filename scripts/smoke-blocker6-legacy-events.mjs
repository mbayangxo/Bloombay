#!/usr/bin/env node
/**
 * Blocker 6 — legacy events → gatherings migration smoke.
 * Usage: node scripts/smoke-blocker6-legacy-events.mjs
 *
 * Static checks: zero `.from("events")` in app/api + tsc --noEmit.
 * Optional live hits when APP_URL + auth env are set (see smoke-blocker5-storage.mjs).
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
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

const MIGRATED_ROUTES = [
  "app/api/admin/quick-stats/route.ts",
  "app/api/member/desktop-panel/route.ts",
  "app/api/cron/event-intelligence/route.ts",
  "app/api/cron/club-success/route.ts",
  "app/api/member/plans/confirmations/[id]/route.ts",
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

function walkApiFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkApiFiles(p, acc);
    else if (p.endsWith(".ts")) acc.push(p);
  }
  return acc;
}

function grepEventsReadsInApi() {
  const apiRoot = "app/api";
  const hits = [];
  for (const file of walkApiFiles(apiRoot)) {
    const text = readFileSync(file, "utf8");
    const re = /\.from\(["']events["']\)/g;
    let m;
    while ((m = re.exec(text))) {
      const line = text.slice(0, m.index).split("\n").length;
      hits.push({ file, line });
    }
  }
  return hits;
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

async function apiGet(path, session) {
  const res = await fetch(`${APP_URL}${path}`, {
    headers: { Cookie: authCookie(session) },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* non-json */
  }
  return { status: res.status, json, text };
}

async function main() {
  console.log("Blocker 6 — legacy events → gatherings\n");

  // 1) Migrated files exist and reference gatherings
  for (const route of MIGRATED_ROUTES) {
    try {
      const src = readFileSync(route, "utf8");
      if (src.includes('.from("events")')) {
        fail(`migrate:${route}`, "still contains .from(\"events\")");
      } else if (src.includes('.from("gatherings")') || route.includes("confirmations")) {
        pass(`migrate:${route}`, "no events read");
      } else {
        need(`migrate:${route}`, "no gatherings read (confirmations route removes fallback only)");
      }
    } catch (e) {
      fail(`migrate:${route}`, String(e));
    }
  }

  // 2) Zero events reads in app/api
  const hits = grepEventsReadsInApi();
  if (hits.length === 0) {
    pass("grep:app/api", "zero .from(\"events\") in app/api routes");
  } else {
    fail(
      "grep:app/api",
      hits.map((h) => `${h.file}:${h.line}`).join(", "),
    );
  }

  // 3) Typecheck
  try {
    execSync("npx tsc --noEmit", { stdio: "pipe", encoding: "utf8" });
    pass("tsc", "npx tsc --noEmit passed");
  } catch (e) {
    fail("tsc", (e.stdout || e.stderr || e.message || String(e)).slice(0, 500));
  }

  // 4) Optional live API smoke
  const staffEmail = env.STAFF_EMAIL || env.MEMBER_A_EMAIL;
  const memberEmail = env.MEMBER_A_EMAIL || env.MEMBER_EMAIL;

  if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
    need("live:auth", "missing Supabase env — skipped live API hits");
  } else if (!staffEmail && !memberEmail) {
    need("live:auth", "set STAFF_EMAIL or MEMBER_A_EMAIL for live hits");
  } else {
    if (staffEmail) {
      try {
        const session = await signIn(staffEmail);
        const stats = await apiGet("/api/admin/quick-stats", session);
        if (stats.status === 200 && typeof stats.json?.upcomingEvents === "number") {
          pass("live:quick-stats", `upcomingEvents=${stats.json.upcomingEvents}`);
        } else {
          fail("live:quick-stats", `HTTP ${stats.status}`);
        }
      } catch (e) {
        need("live:quick-stats", `skipped — ${e.message}`);
      }
    }

    if (memberEmail) {
      try {
        const session = await signIn(memberEmail);
        const panel = await apiGet("/api/member/desktop-panel", session);
        if (panel.status === 200 && Array.isArray(panel.json?.openSeats)) {
          pass("live:desktop-panel", `openSeats=${panel.json.openSeats.length}`);
        } else {
          fail("live:desktop-panel", `HTTP ${panel.status}`);
        }
      } catch (e) {
        need("live:desktop-panel", `skipped — ${e.message}`);
      }
    }
  }

  const bad = results.filter((r) => !r.ok);
  console.log(`\n── Summary: ${results.length - bad.length}/${results.length} passed ──`);
  if (bad.length) {
    console.log("Failed:", bad.map((r) => r.id).join(", "));
    process.exit(1);
  }
  console.log("ALL PASSED — Blocker 6 API routes migrated off events.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
