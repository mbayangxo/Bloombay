#!/usr/bin/env node
/**
 * Blocker 5 — storage / gov-ID smoke.
 * Usage: APP_URL=http://localhost:3000 node scripts/smoke-blocker5-storage.mjs
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

const STAFF_EMAIL = env.STAFF_EMAIL || env.MEMBER_A_EMAIL || "dmbayang@gmail.com";
const MEMBER_B_ID = env.MEMBER_B_ID || "c420d66b-26ad-49f4-b81d-945bb8713222";

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

async function apiGet(path, session) {
  const headers = {};
  if (session) headers.Cookie = authCookie(session);
  const res = await fetch(`${APP_URL}${path}`, { headers });
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
  console.log(`\nBlocker 5 storage smoke — APP_URL=${APP_URL}\n`);
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  const { data: bUser } = await admin.auth.admin.getUserById(MEMBER_B_ID);
  const memberBEmail = bUser?.user?.email;
  if (!memberBEmail) {
    fail("setup", "Member B email missing");
    process.exit(1);
  }

  const sessionB = await signIn(memberBEmail);
  const sessionStaff = await signIn(STAFF_EMAIL);
  const staffId = sessionStaff.user.id;

  const v02 = await apiGet(`/api/admin/government-id?userId=${staffId}`, sessionB);
  if (v02.status === 403 || v02.status === 401) pass("1:member_blocked_gov_id", String(v02.status));
  else fail("1:member_blocked_gov_id", `HTTP ${v02.status}`);

  const vpMember = await apiGet(`/api/admin/verification-photo?userId=${staffId}`, sessionB);
  if (vpMember.status === 403 || vpMember.status === 401) {
    pass("2:member_blocked_verification_photo", String(vpMember.status));
  } else {
    fail("2:member_blocked_verification_photo", `HTTP ${vpMember.status}`);
  }

  const { data: staffProfile } = await admin
    .from("profiles")
    .select("gov_id_storage_path, verification_photo_url")
    .eq("id", staffId)
    .maybeSingle();

  const govPath = staffProfile?.gov_id_storage_path;
  if (govPath) {
    const pubUrl = `${SUPABASE_URL}/storage/v1/object/public/government-ids/${govPath}`;
    const pubRes = await fetch(pubUrl);
    if (pubRes.status >= 400) pass("3:gov_id_public_url_blocked", String(pubRes.status));
    else fail("3:gov_id_public_url_blocked", `HTTP ${pubRes.status}`);

    const beforeAudit = (
      await admin
        .from("admin_audit_logs")
        .select("id")
        .eq("action", "private_file_access")
        .eq("resource_id", staffId)
        .order("created_at", { ascending: false })
        .limit(1)
    ).data?.[0]?.id;

    const govStaff = await apiGet(`/api/admin/government-id?userId=${staffId}`, sessionStaff);
    if (govStaff.status === 200 && govStaff.json?.url && govStaff.json?.expiresIn === 300) {
      pass("4:staff_gov_id_signed_url", `expiresIn=${govStaff.json.expiresIn}`);
    } else if (govStaff.status === 200 && govStaff.json?.url) {
      pass("4:staff_gov_id_signed_url", `url ok expiresIn=${govStaff.json.expiresIn}`);
    } else {
      fail("4:staff_gov_id_signed_url", `HTTP ${govStaff.status} ${JSON.stringify(govStaff.json)}`);
    }

    const { data: auditRows } = await admin
      .from("admin_audit_logs")
      .select("action, resource_type, resource_id, actor_id")
      .eq("action", "private_file_access")
      .eq("resource_type", "government_id")
      .eq("resource_id", staffId)
      .order("created_at", { ascending: false })
      .limit(3);
    if (auditRows?.some((r) => r.actor_id === staffId)) {
      pass("5:gov_id_access_audited", "private_file_access logged");
    } else {
      fail("5:gov_id_access_audited", JSON.stringify(auditRows));
    }
  } else {
    need("3:gov_id_public_url_blocked", "no gov path on staff profile");
    need("4:staff_gov_id_signed_url", "no gov path");
    need("5:gov_id_access_audited", "no gov path");
  }

  const selfiePath = staffProfile?.verification_photo_url;
  if (selfiePath) {
    const selfieStaff = await apiGet(`/api/admin/verification-photo?userId=${staffId}`, sessionStaff);
    if (selfieStaff.status === 200 && selfieStaff.json?.url) {
      pass("6:staff_verification_photo_signed", `expiresIn=${selfieStaff.json.expiresIn}`);
    } else {
      fail("6:staff_verification_photo_signed", `HTTP ${selfieStaff.status}`);
    }

    const { data: selfieAudit } = await admin
      .from("admin_audit_logs")
      .select("resource_type, actor_id")
      .eq("action", "private_file_access")
      .eq("resource_type", "verification_selfie")
      .eq("resource_id", staffId)
      .order("created_at", { ascending: false })
      .limit(3);
    if (selfieAudit?.some((r) => r.actor_id === staffId)) {
      pass("7:verification_photo_access_audited", "private_file_access logged");
    } else {
      fail("7:verification_photo_access_audited", JSON.stringify(selfieAudit));
    }
  } else {
    const vpStaff = await apiGet(`/api/admin/verification-photo?userId=${staffId}`, sessionStaff);
    if (vpStaff.status === 404) {
      need("6:staff_verification_photo_signed", "no verification photo on file");
      need("7:verification_photo_access_audited", "no file to audit");
    } else {
      fail("6:staff_verification_photo_signed", `HTTP ${vpStaff.status}`);
    }
  }

  const bad = results.filter((r) => !r.ok);
  console.log(`\n── Summary: ${results.length - bad.length}/${results.length} passed ──`);
  if (bad.length) {
    console.log("Failed:", bad.map((r) => r.id).join(", "));
    process.exit(1);
  }
  console.log(bad.length ? "" : "ALL PASSED — storage gov-ID checks verified.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
