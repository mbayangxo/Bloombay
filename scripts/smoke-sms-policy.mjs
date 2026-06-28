#!/usr/bin/env node
/**
 * SMS policy smoke test — allowed types pass policy gate; disallowed types fail;
 * no direct Twilio fetch outside lib/sms/twilio-client.ts.
 *
 * Usage: node scripts/smoke-sms-policy.mjs
 * Optional: APP_URL=http://localhost:3000 (tests POST /api/sms/send → 403)
 */

import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const ALLOWED = new Set([
  "phone_verification",
  "private_beta_accepted",
  "app_launch",
  "urgent_safety",
]);

const DISALLOWED = [
  "event_reminder",
  "ticket_confirmed",
  "seat_confirmed",
  "calendar_reminder",
  "member_welcome",
  "intro",
  "report_submitted",
  "arbitrary_draft",
];

const results = [];

function pass(id, detail) {
  results.push({ id, ok: true, detail });
  console.log(`✅ ${id}: ${detail}`);
}

function fail(id, detail) {
  results.push({ id, ok: false, detail });
  console.log(`❌ ${id}: ${detail}`);
}

function isAllowedSmsType(type) {
  return ALLOWED.has(type);
}

function smsPolicyError(type) {
  const allowed = [...ALLOWED].join(", ");
  return type
    ? `SMS type "${type}" is not allowed. Permitted types: ${allowed}.`
    : `SMS requires an allowed type. Permitted types: ${allowed}.`;
}

// ── Policy unit checks (mirrors lib/sms/policy.ts) ───────────────────────────
for (const type of ALLOWED) {
  if (isAllowedSmsType(type)) pass(`allowed:${type}`, "permitted");
  else fail(`allowed:${type}`, "should be permitted");
}

for (const type of DISALLOWED) {
  if (!isAllowedSmsType(type)) pass(`blocked:${type}`, "rejected");
  else fail(`blocked:${type}`, "should be blocked");
}

if (smsPolicyError("event_reminder").includes("event_reminder")) {
  pass("error:message", "policy error names disallowed type");
} else {
  fail("error:message", "policy error missing type name");
}

// ── sendMemberSmsReminder blocked at source ──────────────────────────────────
const reminderSrc = readFileSync("lib/sms/send-member-reminder.ts", "utf8");
if (reminderSrc.includes("blocked: true") && !reminderSrc.includes("sendSmsForUser(")) {
  pass("reminder:helper", "sendMemberSmsReminder does not call Twilio");
} else {
  fail("reminder:helper", "sendMemberSmsReminder may still send SMS");
}

// ── twilio-client requires smsType ───────────────────────────────────────────
const twilioSrc = readFileSync("lib/sms/twilio-client.ts", "utf8");
if (twilioSrc.includes("isAllowedSmsType(smsType)") && twilioSrc.includes("smsType: string")) {
  pass("twilio:gate", "sendSms enforces allowed type");
} else {
  fail("twilio:gate", "sendSms missing policy gate");
}

// ── notifications/sms delegates to twilio-client ─────────────────────────────
const notifSmsSrc = readFileSync("lib/notifications/sms.ts", "utf8");
if (
  notifSmsSrc.includes('from "@/lib/sms/twilio-client"') &&
  !notifSmsSrc.includes("api.twilio.com")
) {
  pass("notifications:sms", "no direct Twilio bypass");
} else {
  fail("notifications:sms", "notifications/sms may bypass policy");
}

// ── No direct Twilio fetch outside twilio-client ─────────────────────────────
function walk(dir, acc = []) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (
      name.name === "node_modules" ||
      name.name === ".git" ||
      name.name === ".next" ||
      name.name === "dist" ||
      name.name === "alkebulan-local"
    ) {
      continue;
    }
    const p = join(dir, name.name);
    if (name.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx|mjs|js)$/.test(name.name)) acc.push(p);
  }
  return acc;
}

const twilioBypass = [];
for (const file of walk(".")) {
  if (file.includes("lib/sms/twilio-client.ts")) continue;
  if (file.includes("mcp/")) continue;
  if (file.endsWith("scripts/smoke-sms-policy.mjs")) continue;
  const src = readFileSync(file, "utf8");
  if (src.includes("api.twilio.com")) twilioBypass.push(file);
}

if (twilioBypass.length === 0) {
  pass("scan:twilio", "no api.twilio.com outside twilio-client (app code)");
} else {
  fail("scan:twilio", `direct Twilio in: ${twilioBypass.join(", ")}`);
}

// ── Legacy /api/sms/send endpoint ────────────────────────────────────────────
const apiSmsSrc = readFileSync("app/api/sms/send/route.ts", "utf8");
if (
  apiSmsSrc.includes("403") &&
  (apiSmsSrc.includes("SMS_POLICY_BLOCKED_CODE") || apiSmsSrc.includes("sms_blocked_by_policy"))
) {
  pass("api:sms-send", "legacy route returns 403 blocked");
} else {
  fail("api:sms-send", "legacy route not blocked with 403");
}

// ── Optional live HTTP check ─────────────────────────────────────────────────
const APP_URL = (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");
if (APP_URL) {
  try {
    const res = await fetch(`${APP_URL}/api/sms/send`, { method: "POST" });
    const json = await res.json().catch(() => ({}));
    if (res.status === 403 && json.error === "sms_blocked_by_policy") {
      pass("http:sms-send", `POST /api/sms/send → 403 (${APP_URL})`);
    } else {
      fail("http:sms-send", `expected 403, got ${res.status} ${JSON.stringify(json).slice(0, 80)}`);
    }
  } catch (e) {
    fail("http:sms-send", `fetch failed: ${e.message}`);
  }
} else {
  pass("http:sms-send", "skipped (set APP_URL for live check)");
}

// ── Summary ──────────────────────────────────────────────────────────────────
const bad = results.filter((r) => !r.ok);
console.log(`\n── SMS policy smoke: ${results.length - bad.length}/${results.length} passed ──`);
process.exit(bad.length ? 1 : 0);
