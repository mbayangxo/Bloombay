#!/usr/bin/env node
/**
 * Blocker 1 report smoke test — staging (or local dev + staging Supabase)
 *
 * Usage:
 *   APP_URL=https://your-staging.vercel.app node scripts/smoke-blocker1-reports.mjs
 *   # or local dev against staging DB:
 *   npm run dev   # separate terminal
 *   APP_URL=http://localhost:3000 node scripts/smoke-blocker1-reports.mjs
 *
 * Env (from .env.local): NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 *   SUPABASE_SERVICE_ROLE_KEY
 * Optional: MEMBER_A_EMAIL, MEMBER_A_PASSWORD, MEMBER_B_EMAIL, ADMIN_EMAIL, ADMIN_PASSWORD
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = { ...process.env };
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split("\n")) {
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
const APP_URL = (env.APP_URL || env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const MEMBER_A_EMAIL = env.MEMBER_A_EMAIL || "member-a@staging.test";
const MEMBER_A_PASSWORD = env.MEMBER_A_PASSWORD || env.ADMIN_PASSWORD || "StagingTest123!";
const MEMBER_B_ID = env.MEMBER_B_ID;
const MEMBER_B_EMAIL = env.MEMBER_B_EMAIL || "member-b@staging.test";
const ADMIN_EMAIL = env.ADMIN_EMAIL || env.FOUNDER_EMAIL || "mbayangskin@gmail.com";
const ADMIN_PASSWORD = env.ADMIN_PASSWORD || env.FOUNDER_PASSWORD;

const results = [];
function pass(id, detail) {
  results.push({ id, ok: true, detail });
  console.log(`✅ ${id}: ${detail}`);
}
function fail(id, detail) {
  results.push({ id, ok: false, detail });
  console.log(`❌ ${id}: ${detail}`);
}

function projectRef(supabaseUrl) {
  try {
    return new URL(supabaseUrl).hostname.split(".")[0];
  } catch {
    return "project";
  }
}

function authCookieHeader(session) {
  const ref = projectRef(SUPABASE_URL);
  const name = `sb-${ref}-auth-token`;
  const payload = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    expires_in: session.expires_in,
    token_type: session.token_type,
    user: session.user,
  });
  return `${name}=${encodeURIComponent(payload)}`;
}

async function signIn(email, password) {
  const client = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
  if (password) {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (!error && data.session) return data.session;
  }
  // Fallback: admin magic link (staging smoke — no password required)
  const adminClient = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const { data: linkData, error: linkErr } = await adminClient.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkErr || !linkData?.properties?.hashed_token) {
    throw new Error(`signIn ${email}: ${linkErr?.message || "no magic link token"}`);
  }
  const { data: otpData, error: otpErr } = await client.auth.verifyOtp({
    type: "email",
    token_hash: linkData.properties.hashed_token,
  });
  if (otpErr || !otpData.session) {
    throw new Error(`signIn ${email} via magiclink: ${otpErr?.message || "no session"}`);
  }
  return otpData.session;
}

async function api(method, path, session, body) {
  const headers = { Cookie: authCookieHeader(session) };
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(`${APP_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json };
}

async function main() {
  console.log(`\nBlocker 1 smoke test — APP_URL=${APP_URL}\n`);

  if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
    fail("env", "Missing NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, or SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  // ── Prerequisites ─────────────────────────────────────────────────────────
  const prereq = async (label, fn) => {
    try {
      if (await fn()) pass(`prereq:${label}`, "ok");
      else fail(`prereq:${label}`, "missing");
    } catch (e) {
      fail(`prereq:${label}`, e.message);
    }
  };

  await prereq("member_reports", async () => {
    const { error } = await admin.from("member_reports").select("id", { head: true, count: "exact" });
    return !error;
  });
  await prereq("moderation_cases", async () => {
    const { error } = await admin.from("moderation_cases").select("id", { head: true, count: "exact" });
    return !error;
  });
  await prereq("notification_events", async () => {
    const { error } = await admin.from("notification_events").select("id", { head: true, count: "exact" });
    return !error;
  });
  await prereq("member_reports.source_type", async () => {
    const { data } = await admin.from("member_reports").select("source_type").limit(1);
    return data !== null;
  });

  const { count: userReportsBefore } = await admin
    .from("user_reports")
    .select("*", { count: "exact", head: true });

  // ── Resolve Member B UUID ─────────────────────────────────────────────────
  let memberBId = MEMBER_B_ID;
  if (!memberBId) {
    const { data: bProfile } = await admin.from("profiles").select("id").eq("email", MEMBER_B_EMAIL).maybeSingle();
    if (bProfile?.id) memberBId = bProfile.id;
    else {
      const { data: authB } = await admin.auth.admin.listUsers({ perPage: 1000 });
      const u = authB?.users?.find((x) => x.email?.toLowerCase() === MEMBER_B_EMAIL.toLowerCase());
      memberBId = u?.id;
    }
  }
  if (!memberBId) {
    fail("member_b", `No user for ${MEMBER_B_EMAIL} — create staging test accounts first`);
    summarize();
    process.exit(1);
  }
  pass("member_b", `reported_id=${memberBId}`);

  // ── Sign in Member A ──────────────────────────────────────────────────────
  let memberASession;
  try {
    memberASession = await signIn(MEMBER_A_EMAIL, MEMBER_A_PASSWORD);
    pass("auth:member_a", MEMBER_A_EMAIL);
  } catch (e) {
    fail("auth:member_a", e.message);
    console.log("\nSet MEMBER_A_EMAIL / MEMBER_A_PASSWORD or create member-a@staging.test in Supabase Auth.");
    summarize();
    process.exit(1);
  }

  const reporterId = memberASession.user.id;
  const ts = Date.now();

  // ── Test 1: Low severity (spam) ───────────────────────────────────────────
  const low = await api("POST", "/api/member/report", memberASession, {
    reported_id: memberBId,
    reason: "spam",
    details: `smoke low ${ts}`,
  });

  if (low.status !== 200 || !low.json?.ok) {
    fail("1:post_low", `HTTP ${low.status} ${JSON.stringify(low.json)}`);
  } else {
    pass("1:post_low", `report_id=${low.json.report_id}`);

    const { data: mr } = await admin
      .from("member_reports")
      .select("*")
      .eq("id", low.json.report_id)
      .single();

    if (mr && mr.reporter_id === reporterId && mr.reason === "spam") {
      pass("1:member_reports", "one row, correct reporter/reason");
    } else {
      fail("1:member_reports", JSON.stringify(mr));
    }

    const { data: mc } = await admin
      .from("moderation_cases")
      .select("id")
      .eq("source_type", "member_report")
      .eq("source_id", String(low.json.report_id));

    if (!mc?.length) pass("1:no_moderation_case", "correct for low severity");
    else fail("1:no_moderation_case", `unexpected case: ${mc.length}`);
  }

  const { count: userReportsAfterLow } = await admin
    .from("user_reports")
    .select("*", { count: "exact", head: true });

  if (userReportsAfterLow === userReportsBefore) {
    pass("1:no_user_reports", `count stayed ${userReportsBefore}`);
  } else {
    fail("1:no_user_reports", `before=${userReportsBefore} after=${userReportsAfterLow}`);
  }

  // ── Test 2: High severity (harassment) ────────────────────────────────────
  const high = await api("POST", "/api/member/report", memberASession, {
    reported_id: memberBId,
    reason: "harassment",
    details: `smoke high ${ts}`,
  });

  let caseId;
  if (high.status !== 200 || !high.json?.ok) {
    fail("2:post_high", `HTTP ${high.status} ${JSON.stringify(high.json)}`);
  } else {
    pass("2:post_high", `report_id=${high.json.report_id}`);

    const { data: mr } = await admin
      .from("member_reports")
      .select("status, severity")
      .eq("id", high.json.report_id)
      .single();

    if (mr?.status === "human_review_required" && mr?.severity === "high") {
      pass("2:report_status", "human_review_required / high");
    } else {
      fail("2:report_status", JSON.stringify(mr));
    }

    const { data: mc } = await admin
      .from("moderation_cases")
      .select("id, status, severity")
      .eq("source_type", "member_report")
      .eq("source_id", String(high.json.report_id))
      .maybeSingle();

    if (mc?.id) {
      caseId = mc.id;
      pass("2:moderation_case", `case_id=${caseId}`);
    } else {
      fail("2:moderation_case", "missing");
    }
  }

  // ── Test 3: Admin resolve ───────────────────────────────────────────────────
  if (!caseId) {
    fail("3:resolve", "skipped — no case from test 2");
  } else {
    let restoredAdminRole;
    try {
      const { data: adminProfile } = await admin
        .from("profiles")
        .select("role")
        .eq("email", ADMIN_EMAIL)
        .maybeSingle();
      const staffRoles = new Set(["admin", "founder", "moderator"]);
      if (adminProfile?.role && !staffRoles.has(adminProfile.role)) {
        restoredAdminRole = adminProfile.role;
        await admin.from("profiles").update({ role: "founder" }).eq("email", ADMIN_EMAIL);
      }

      const adminSession = await signIn(ADMIN_EMAIL, ADMIN_PASSWORD);
      pass("auth:admin", ADMIN_EMAIL);

      const resolved = await api("PATCH", "/api/admin/moderation/cases", adminSession, {
        id: caseId,
        action: "resolve",
        note: `smoke resolve ${ts}`,
      });

      if (resolved.status === 200) {
        pass("3:patch_resolve", "HTTP 200");
      } else {
        fail("3:patch_resolve", `HTTP ${resolved.status} ${JSON.stringify(resolved.json)}`);
      }

      const { data: mc } = await admin.from("moderation_cases").select("status").eq("id", caseId).single();
      const { data: mr } = await admin
        .from("member_reports")
        .select("status")
        .eq("id", high.json.report_id)
        .single();

      if (mc?.status === "resolved") pass("3:case_resolved", "ok");
      else fail("3:case_resolved", JSON.stringify(mc));

      if (mr?.status === "resolved") pass("3:report_sync", "member_reports.status=resolved");
      else fail("3:report_sync", JSON.stringify(mr));
    } catch (e) {
      fail("3:resolve", e.message);
    } finally {
      if (restoredAdminRole) {
        await admin.from("profiles").update({ role: restoredAdminRole }).eq("email", ADMIN_EMAIL);
      }
    }
  }

  // ── Test 4: Reporter notification ─────────────────────────────────────────
  const { data: events, error: eventsErr } = await admin
    .from("notification_events")
    .select("id, type, channel, status, user_id, created_at")
    .eq("user_id", reporterId)
    .eq("type", "report_submitted")
    .gte("created_at", new Date(ts - 5000).toISOString())
    .order("created_at", { ascending: false })
    .limit(3);

  if (eventsErr) {
    fail("4:notification_event", eventsErr.message);
  } else if (events?.length) {
    pass("4:notification_event", `${events.length} report_submitted row(s) this run`);
    const inApp = events.find((e) => e.channel === "in_app");
    if (events.some((e) => e.channel === "sms")) {
      fail("4:no_sms", "SMS channel used for report_submitted");
    } else if (inApp?.channel === "in_app") {
      pass("4:no_sms", "channel=in_app only");
    } else {
      fail("4:no_sms", `unexpected channels: ${events.map((e) => e.channel).join(", ")}`);
    }
    if (inApp?.status === "sent") {
      pass("4:in_app_sent", "notification_events.status=sent");
    } else {
      fail("4:in_app_sent", `status=${inApp?.status ?? "missing"} (apply migration 120 on staging)`);
    }
  } else {
    fail("4:notification_event", "no report_submitted for reporter this run");
  }

  const { data: notifs } = await admin
    .from("notifications")
    .select("id, type, title, created_at")
    .eq("user_id", reporterId)
    .eq("type", "report_submitted")
    .gte("created_at", new Date(ts - 5000).toISOString())
    .order("created_at", { ascending: false })
    .limit(1);

  if (notifs?.length) {
    pass("4:notifications_row", `title=${notifs[0].title}`);
  } else {
    fail("4:notifications_row", "no in-app notifications row (check migration 120)");
  }

  summarize();
  process.exit(results.some((r) => !r.ok) ? 1 : 0);
}

function summarize() {
  const bad = results.filter((r) => !r.ok);
  console.log(`\n── Summary: ${results.length - bad.length}/${results.length} passed ──`);
  if (bad.length) {
    console.log("Failed:", bad.map((r) => r.id).join(", "));
  } else {
    console.log("ALL PASSED — approved to commit Blocker 1.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
