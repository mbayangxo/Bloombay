#!/usr/bin/env node
/**
 * Welcome auth smoke — Blocker 3.
 *
 * Usage: APP_URL=http://localhost:3000 node scripts/smoke-welcome-auth.mjs
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
const APP_URL = (env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const MEMBER_A_EMAIL = env.MEMBER_A_EMAIL || "dmbayang@gmail.com";
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
    throw new Error(`signIn ${email}: ${linkErr?.message || "no token"}`);
  }
  const { data: otpData, error: otpErr } = await client.auth.verifyOtp({
    type: "email",
    token_hash: linkData.properties.hashed_token,
  });
  if (otpErr || !otpData.session) throw new Error(`signIn ${email}: ${otpErr?.message}`);
  return otpData.session;
}

async function welcomePost(session, body) {
  const headers = { "Content-Type": "application/json" };
  if (session) headers.Cookie = authCookie(session);
  const res = await fetch(`${APP_URL}/api/member/welcome`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
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

async function welcomeMailboxCount(admin, userId) {
  const { count, error } = await admin
    .from("member_mailbox_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("message_type", "welcome");
  if (error) return { error: error.message, count: null };
  return { count: count ?? 0 };
}

async function main() {
  console.log(`\nWelcome auth smoke — APP_URL=${APP_URL}\n`);

  if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
    fail("env", "Missing Supabase env");
    process.exit(1);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const ts = Date.now();

  // 1. Unauthenticated → 401
  const anon = await welcomePost(null, {
    email: "anon@test.local",
    fullName: "Anon",
  });
  if (anon.status === 401) pass("1:unauthenticated_401", anon.json?.error || "401");
  else fail("1:unauthenticated_401", `HTTP ${anon.status} ${JSON.stringify(anon.json)}`);

  let sessionA;
  try {
    sessionA = await signIn(MEMBER_A_EMAIL);
  } catch (e) {
    fail("auth", e.message);
    summarize();
    process.exit(1);
  }
  const memberAId = sessionA.user.id;
  const emailA = sessionA.user.email?.toLowerCase() || MEMBER_A_EMAIL;

  const bBefore = await welcomeMailboxCount(admin, MEMBER_B_ID);

  // 2. Signed-in, no body.userId
  const noUserId = await welcomePost(sessionA, {
    email: emailA,
    fullName: `Smoke A ${ts}`,
  });
  if (noUserId.status === 200 && noUserId.json?.ok) {
    pass("2:no_body_userId", `ok emailSent=${noUserId.json.emailSent} mailbox=${noUserId.json.mailboxSaved}`);
  } else {
    fail("2:no_body_userId", `HTTP ${noUserId.status} ${JSON.stringify(noUserId.json)}`);
  }

  // 3. Signed-in, matching body.userId
  const matchUserId = await welcomePost(sessionA, {
    email: emailA,
    fullName: `Smoke A match ${ts}`,
    userId: memberAId,
  });
  if (matchUserId.status === 200 && matchUserId.json?.ok) {
    pass("3:matching_userId", "accepted or idempotent skip");
  } else {
    fail("3:matching_userId", `HTTP ${matchUserId.status} ${JSON.stringify(matchUserId.json)}`);
  }

  // 4. Signed-in, spoofed body.userId → 403
  const spoof = await welcomePost(sessionA, {
    email: emailA,
    fullName: "Spoof",
    userId: MEMBER_B_ID,
  });
  if (spoof.status === 403) pass("4:spoof_userId_403", spoof.json?.error || "403");
  else fail("4:spoof_userId_403", `HTTP ${spoof.status} ${JSON.stringify(spoof.json)}`);

  const bAfter = await welcomeMailboxCount(admin, MEMBER_B_ID);
  if (bAfter.error) {
    fail("4b:spoof_no_victim_mailbox", bAfter.error);
  } else if (bAfter.count === bBefore.count) {
    pass("4b:spoof_no_victim_mailbox", `B welcome count unchanged (${bAfter.count})`);
  } else {
    fail("4b:spoof_no_victim_mailbox", `B count ${bBefore.count} → ${bAfter.count}`);
  }

  // 5. Attribution to session user (mailbox)
  const aMailbox = await welcomeMailboxCount(admin, memberAId);
  const bMailbox = await welcomeMailboxCount(admin, MEMBER_B_ID);
  if (aMailbox.error) {
    fail("5:session_attribution", aMailbox.error);
  } else if ((aMailbox.count ?? 0) >= 1) {
    pass(
      "5:session_attribution",
      `A has ${aMailbox.count} welcome mailbox row(s); B has ${bMailbox.count ?? 0}`,
    );
  } else if (noUserId.json?.mailboxSaved || noUserId.json?.emailSent || noUserId.json?.smsSent) {
    pass("5:session_attribution", "welcome channels fired for session user");
  } else if (noUserId.json?.skipped) {
    pass(
      "5:session_attribution",
      `idempotent skip for A; B unchanged (${bMailbox.count ?? 0}) — no cross-user write`,
    );
  } else {
    fail("5:session_attribution", JSON.stringify({ a: aMailbox, b: bMailbox, noUserId: noUserId.json }));
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
    console.log("ALL PASSED — welcome auth verified.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
