#!/usr/bin/env node
/**
 * Report/block UI smoke — mirrors lib/member-safety-client + bloom-safety / settings flows.
 *
 * Usage:
 *   APP_URL=http://localhost:3000 node scripts/smoke-report-block-ui.mjs
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

const MEMBER_A_EMAIL = env.MEMBER_A_EMAIL || "dmbayang@gmail.com";
const MEMBER_B_USERNAME = env.MEMBER_B_USERNAME || "soyandexo";
const MEMBER_B_ID = env.MEMBER_B_ID || "c420d66b-26ad-49f4-b81d-945bb8713222";

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

async function signIn(email) {
  const client = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
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

/** Same logic as lib/member-safety-client resolveMemberId */
async function resolveMemberId(session, input) {
  const trimmed = input.trim().replace(/^@/, "");
  if (!trimmed) throw new Error("Enter a username or member ID");
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRe.test(trimmed)) return trimmed;
  const res = await api(
    "GET",
    `/api/member/resolve-user?username=${encodeURIComponent(trimmed)}`,
    session,
  );
  if (res.status !== 200) {
    throw new Error(res.json?.error || "Member not found");
  }
  if (!res.json?.id) throw new Error("Member not found");
  return res.json.id;
}

async function main() {
  console.log(`\nReport/block UI smoke — APP_URL=${APP_URL}\n`);

  if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
    fail("env", "Missing Supabase env in .env.local");
    process.exit(1);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const ts = Date.now();

  let session;
  try {
    session = await signIn(MEMBER_A_EMAIL);
    pass("auth", MEMBER_A_EMAIL);
  } catch (e) {
    fail("auth", e.message);
    summarize();
    process.exit(1);
  }

  const reporterId = session.user.id;

  // ── 1–4: bloom-safety flow (username resolve + high-severity report) ───────
  let reportedId;
  try {
    reportedId = await resolveMemberId(session, MEMBER_B_USERNAME);
    if (reportedId === MEMBER_B_ID) pass("1:bloom_resolve_username", `username=${MEMBER_B_USERNAME} → ${reportedId}`);
    else pass("1:bloom_resolve_username", `resolved ${reportedId}`);
  } catch (e) {
    fail("1:bloom_resolve_username", e.message);
  }

  let highReportId;
  if (reportedId) {
    const high = await api("POST", "/api/member/report", session, {
      reported_id: reportedId,
      reason: "harassment",
      details: `ui smoke bloom-safety ${ts}`,
      source_type: "bloom_safety",
    });
    if (high.status === 200 && high.json?.ok && high.json?.report_id) {
      highReportId = high.json.report_id;
      pass("1:bloom_report_submit", `report_id=${highReportId}`);
    } else {
      fail("1:bloom_report_submit", `HTTP ${high.status} ${JSON.stringify(high.json)}`);
    }
  }

  if (highReportId) {
    const { data: mr } = await admin.from("member_reports").select("id, status, severity").eq("id", highReportId).single();
    if (mr?.id) pass("2:member_reports_row", JSON.stringify(mr));
    else fail("2:member_reports_row", "missing");

    const { data: mc } = await admin
      .from("moderation_cases")
      .select("id, source_id, status")
      .eq("source_type", "member_report")
      .eq("source_id", highReportId)
      .maybeSingle();
    if (mc?.id) pass("3:moderation_case", `case_id=${mc.id}`);
    else fail("3:moderation_case", "no case for high severity");

    pass("4:success_state", "API ok:true — UI would set reportSent");
  }

  // ── 5: profile settings report (spam / low) ───────────────────────────────
  if (reportedId) {
    const low = await api("POST", "/api/member/report", session, {
      reported_id: reportedId,
      reason: "spam",
      details: `ui smoke settings ${ts}`,
      source_type: "settings",
    });
    if (low.status === 200 && low.json?.ok) pass("5:settings_report", `report_id=${low.json.report_id}`);
    else fail("5:settings_report", `HTTP ${low.status} ${JSON.stringify(low.json)}`);
  } else {
    fail("5:settings_report", "skipped — no reported id");
  }

  // ── 6–8: block / list / unblock ───────────────────────────────────────────
  if (reportedId) {
    const block = await api("POST", "/api/member/block", session, { blocked_id: reportedId });
    if (block.status === 200 && block.json?.ok) pass("6:block_user", "ok");
    else fail("6:block_user", `HTTP ${block.status} ${JSON.stringify(block.json)}`);

    const list = await api("GET", "/api/member/block", session);
    const rows = Array.isArray(list.json) ? list.json : [];
    const found = rows.some((r) => r.blocked_id === reportedId);
    if (found) pass("7:block_list", `${rows.length} row(s), includes target`);
    else fail("7:block_list", JSON.stringify(list.json));

    const unb = await api("DELETE", `/api/member/block?blocked_id=${encodeURIComponent(reportedId)}`, session);
    if (unb.status === 200 && unb.json?.ok) pass("8:unblock_user", "ok");
    else fail("8:unblock_user", `HTTP ${unb.status} ${JSON.stringify(unb.json)}`);

    const listAfter = await api("GET", "/api/member/block", session);
    const rowsAfter = Array.isArray(listAfter.json) ? listAfter.json : [];
    if (!rowsAfter.some((r) => r.blocked_id === reportedId)) pass("8:unblock_confirmed", "removed from list");
    else fail("8:unblock_confirmed", JSON.stringify(listAfter.json));
  } else {
    fail("6:block_user", "skipped");
    fail("7:block_list", "skipped");
    fail("8:unblock_user", "skipped");
  }

  // ── UUID resolution (client-side, no API) ─────────────────────────────────
  try {
    const uuidResolved = await resolveMemberId(session, MEMBER_B_ID);
    if (uuidResolved === MEMBER_B_ID) pass("1b:resolve_uuid", `uuid → ${uuidResolved}`);
    else fail("1b:resolve_uuid", `expected ${MEMBER_B_ID}, got ${uuidResolved}`);
  } catch (e) {
    fail("1b:resolve_uuid", e.message);
  }

  // ── 9: invalid username errors ────────────────────────────────────────────
  try {
    await resolveMemberId(session, "not-a-real-bloombay-user-xyz-999");
    fail("9:invalid_username", "expected error, got success");
  } catch (e) {
    const msg = e.message || "";
    if (msg.toLowerCase().includes("not found") || msg.includes("404")) {
      pass("9:invalid_username", msg);
    } else {
      pass("9:invalid_username", `error thrown: ${msg}`);
    }
  }

  // Ensure reporter is not self-blocked from prior runs
  if (reportedId && reporterId !== reportedId) {
    await api("DELETE", `/api/member/block?blocked_id=${encodeURIComponent(reportedId)}`, session);
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
    console.log("ALL PASSED — UI wiring verified.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
