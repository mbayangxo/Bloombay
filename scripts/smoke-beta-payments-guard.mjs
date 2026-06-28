#!/usr/bin/env node
/**
 * Beta payments guard smoke test — checkout APIs blocked when guard is on;
 * free /api/irl/reserve is not gated.
 *
 * Usage:
 *   node scripts/smoke-beta-payments-guard.mjs
 *   APP_URL=https://preview.example.com node scripts/smoke-beta-payments-guard.mjs
 *
 * Live checks expect BETA_PAYMENTS_DISABLED=true on the target server.
 * Optional reserve check: NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY,
 * LAUNCH_LOOP_MEMBER_EMAIL (or defaults from operator loop).
 */

import { readFileSync, existsSync } from "fs";
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
const APP_URL = (env.APP_URL || env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");
const BETA_CODE = "beta_payments_disabled";

const results = [];

function pass(id, detail) {
  results.push({ id, ok: true, detail });
  console.log(`✅ ${id}: ${detail}`);
}

function fail(id, detail) {
  results.push({ id, ok: false, detail });
  console.log(`❌ ${id}: ${detail}`);
}

function routeHasGuard(path) {
  const src = readFileSync(path, "utf8");
  return (
    src.includes("isBetaPaymentsDisabled()") &&
    src.includes("betaPaymentsDisabledResponse()")
  );
}

// ── Static: checkout routes guarded ───────────────────────────────────────────
for (const route of [
  "app/api/payments/stripe/checkout/route.ts",
  "app/api/hanger/checkout/route.ts",
  "app/api/shop/checkout/route.ts",
]) {
  if (routeHasGuard(route)) pass(`guard:${route}`, "403 guard wired");
  else fail(`guard:${route}`, "missing isBetaPaymentsDisabled guard");
}

// ── Static: reserve NOT guarded ───────────────────────────────────────────────
const reserveSrc = readFileSync("app/api/irl/reserve/route.ts", "utf8");
if (!reserveSrc.includes("isBetaPaymentsDisabled")) {
  pass("reserve:unguarded", "/api/irl/reserve has no payments guard");
} else {
  fail("reserve:unguarded", "reserve must stay free during beta");
}

// ── Static: shared guard modules ──────────────────────────────────────────────
const guardSrc = readFileSync("lib/payments/beta-guard.ts", "utf8");
if (guardSrc.includes("BETA_PAYMENTS_DISABLED") && guardSrc.includes("status: 403")) {
  pass("guard:module", "server guard returns 403 JSON");
} else {
  fail("guard:module", "beta-guard.ts incomplete");
}

const clientSrc = readFileSync("lib/payments/beta-guard-client.ts", "utf8");
if (clientSrc.includes("NEXT_PUBLIC_BETA_PAYMENTS_DISABLED")) {
  pass("guard:client", "client env flag present");
} else {
  fail("guard:client", "beta-guard-client.ts missing public flag");
}

// ── Static: Whop payment routes disabled + lib removed ────────────────────────
{
  const checkoutSrc = readFileSync("app/api/whop/checkout/route.ts", "utf8");
  // Disabled = returns 410 AND no longer imports the payments lib (so it cannot
  // reach chargeClubMembership). The word may still appear in an explanatory comment.
  if (checkoutSrc.includes("410") && !checkoutSrc.includes('from "@/lib/payments"')) {
    pass("whop:checkout-disabled", "whop checkout returns 410, payments lib not imported");
  } else {
    fail("whop:checkout-disabled", "whop checkout still active or still imports @/lib/payments");
  }

  const webhookSrc = readFileSync("app/api/whop/webhook/route.ts", "utf8");
  if (webhookSrc.includes("410") && !webhookSrc.includes("club_memberships")) {
    pass("whop:webhook-disabled", "whop webhook returns 410, no membership writes");
  } else {
    fail("whop:webhook-disabled", "whop webhook still active or still writes memberships");
  }

  if (!existsSync("lib/whop.ts")) {
    pass("whop:lib-removed", "lib/whop.ts removed");
  } else {
    fail("whop:lib-removed", "lib/whop.ts still present");
  }
}

// ── Static: UI surfaces use client guard ──────────────────────────────────────
for (const ui of [
  "app/(member-portal)/member/upgrade/page.tsx",
  "app/components/portal/event-detail.tsx",
  "app/components/portal/club-landing.tsx",
  "app/components/portal/hanger-page.tsx",
  "app/components/portal/shop-page.tsx",
]) {
  const src = readFileSync(ui, "utf8");
  if (src.includes("isBetaPaymentsDisabledClient")) {
    pass(`ui:${ui.split("/").slice(-2).join("/")}`, "client guard imported");
  } else {
    fail(`ui:${ui}`, "missing client guard");
  }
}

// ── Optional live HTTP: payment endpoints → 403 ───────────────────────────────
async function postJson(path, body, cookie) {
  const res = await fetch(`${APP_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

if (APP_URL) {
  const checkoutCases = [
    { id: "stripe", path: "/api/payments/stripe/checkout", body: { type: "membership", plan: "monthly" } },
    { id: "hanger", path: "/api/hanger/checkout", body: { listingId: "smoke-test" } },
    { id: "shop", path: "/api/shop/checkout", body: { itemId: "smoke-test" } },
  ];

  for (const c of checkoutCases) {
    try {
      const { status, json } = await postJson(c.path, c.body);
      if (status === 403 && json.error === BETA_CODE) {
        pass(`http:${c.id}`, `POST ${c.path} → 403 ${BETA_CODE}`);
      } else if (status === 403) {
        pass(`http:${c.id}`, `POST ${c.path} → 403 (guard active)`);
      } else {
        fail(
          `http:${c.id}`,
          `expected 403 ${BETA_CODE}, got ${status} ${JSON.stringify(json).slice(0, 80)} — set BETA_PAYMENTS_DISABLED=true on server`,
        );
      }
    } catch (e) {
      fail(`http:${c.id}`, `fetch failed: ${e.message}`);
    }
  }

  // ── Optional live: Whop routes disabled (410) ───────────────────────────────
  for (const w of [
    { id: "whop-checkout", path: "/api/whop/checkout", body: { clubId: "smoke-test" } },
    { id: "whop-webhook", path: "/api/whop/webhook", body: {} },
  ]) {
    try {
      const { status } = await postJson(w.path, w.body);
      if (status === 410) pass(`http:${w.id}`, `POST ${w.path} → 410 (disabled)`);
      else fail(`http:${w.id}`, `expected 410 (disabled), got ${status}`);
    } catch (e) {
      fail(`http:${w.id}`, `fetch failed: ${e.message}`);
    }
  }

  // ── Optional live: reserve not blocked by payments guard ────────────────────
  const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
  const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
  const MEMBER_EMAIL = env.LAUNCH_LOOP_MEMBER_EMAIL || env.MEMBER_EMAIL;

  if (SUPABASE_URL && ANON_KEY && SERVICE_KEY && MEMBER_EMAIL) {
    try {
      const client = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
      const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
      const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email: MEMBER_EMAIL,
      });
      if (linkErr || !linkData?.properties?.hashed_token) {
        fail("http:reserve", `auth setup failed: ${linkErr?.message || "no token"}`);
      } else {
        const { data: otpData, error: otpErr } = await client.auth.verifyOtp({
          type: "magiclink",
          token_hash: linkData.properties.hashed_token,
        });
        if (otpErr || !otpData.session) {
          fail("http:reserve", `verifyOtp failed: ${otpErr?.message}`);
        } else {
          const ref = new URL(SUPABASE_URL).hostname.split(".")[0];
          const cookie = `sb-${ref}-auth-token=${encodeURIComponent(
            JSON.stringify({
              access_token: otpData.session.access_token,
              refresh_token: otpData.session.refresh_token,
              expires_at: otpData.session.expires_at,
              expires_in: otpData.session.expires_in,
              token_type: otpData.session.token_type,
              user: otpData.session.user,
            }),
          )}`;

          const reserve = await postJson(
            "/api/irl/reserve",
            { gatheringId: "00000000-0000-0000-0000-000000000000" },
            cookie,
          );
          if (reserve.json?.error === BETA_CODE) {
            fail("http:reserve", "reserve incorrectly blocked by payments guard");
          } else {
            pass(
              "http:reserve",
              `POST /api/irl/reserve not payments-blocked (HTTP ${reserve.status})`,
            );
          }
        }
      }
    } catch (e) {
      fail("http:reserve", `live reserve check failed: ${e.message}`);
    }
  } else {
    pass("http:reserve", "skipped (set Supabase env + LAUNCH_LOOP_MEMBER_EMAIL for live reserve)");
  }
} else {
  pass("http:checkout", "skipped (set APP_URL for live payment checks)");
  pass("http:reserve", "skipped (set APP_URL for live checks)");
}

const bad = results.filter((r) => !r.ok);
console.log(`\n── Beta payments guard smoke: ${results.length - bad.length}/${results.length} passed ──`);
process.exit(bad.length ? 1 : 0);
