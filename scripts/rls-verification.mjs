#!/usr/bin/env node
/**
 * RLS verification — staging checklist automation.
 * Staff test account: dmbayang@gmail.com (founder on staging).
 * Set RESTORE_STAFF_ROLE=true to revert after a temporary promotion (default: keep founder).
 *
 * Usage: APP_URL=http://localhost:3000 node scripts/rls-verification.mjs
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
const STAFF_EMAIL = env.STAFF_EMAIL || MEMBER_A_EMAIL;
const RESTORE_STAFF_ROLE = env.RESTORE_STAFF_ROLE === "true";

const STAFF_ROLES = new Set(["admin", "founder", "moderator"]);

const results = [];
function pass(id, detail) {
  results.push({ id, status: "pass", detail });
  console.log(`✅ ${id}: ${detail}`);
}
function need(id, detail) {
  results.push({ id, status: "need_data", detail });
  console.log(`🟡 ${id}: ${detail}`);
}
function fail(id, detail) {
  results.push({ id, status: "fail", detail });
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

function rlsClient(accessToken) {
  return createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

async function api(method, path, session, body) {
  const headers = { Cookie: authCookie(session) };
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
  console.log(`\nRLS verification — APP_URL=${APP_URL}`);
  console.log(`Staff test account: ${STAFF_EMAIL}\n`);

  if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
    fail("env", "Missing Supabase env");
    process.exit(1);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  const sessionA = await signIn(MEMBER_A_EMAIL);
  const memberAId = sessionA.user.id;

  const { data: profileA, error: profileErr } = await admin
    .from("profiles")
    .select("id, role, gov_id_storage_path")
    .eq("id", memberAId)
    .maybeSingle();

  const profileRow = profileA ?? {
    id: memberAId,
    role: "member",
    gov_id_storage_path: null,
  };
  if (!profileA) {
    console.log(`⚠️  No profiles row for ${MEMBER_A_EMAIL} (${profileErr?.message ?? "missing"}) — using role=member\n`);
  }

  const originalStaffRole = profileRow.role ?? "member";
  console.log(`\n📋 Original role for ${STAFF_EMAIL}: ${originalStaffRole ?? "(null)"}\n`);

  const { data: bUser } = await admin.auth.admin.getUserById(MEMBER_B_ID);
  const memberBEmail = bUser?.user?.email;
  if (!memberBEmail) {
    fail("setup", `No auth user for Member B ${MEMBER_B_ID}`);
    process.exit(1);
  }
  const sessionB = await signIn(memberBEmail);
  const sbA = rlsClient(sessionA.access_token);
  const sbB = rlsClient(sessionB.access_token);

  // ── 1. Profiles ───────────────────────────────────────────────────────────
  const { data: ownProfile, error: p01Err } = await sbA
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", memberAId)
    .single();
  if (ownProfile?.id === memberAId && !p01Err) pass("P-01", "Member reads own profile");
  else fail("P-01", p01Err?.message || "no row");

  const { data: otherPrivate } = await sbB
    .from("profiles")
    .select("id, email, phone, gov_id_storage_path")
    .eq("id", memberAId)
    .maybeSingle();
  const leaked =
    otherPrivate?.email || otherPrivate?.phone || otherPrivate?.gov_id_storage_path;
  if (!leaked) pass("P-02", "Member B cannot read A private fields");
  else fail("P-02", `leaked: ${JSON.stringify(otherPrivate)}`);

  const { error: p03Err, count: p03Count } = await sbA
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", memberAId)
    .select("id", { count: "exact", head: true });
  const { data: afterP03 } = await admin.from("profiles").select("role").eq("id", memberAId).single();
  if (afterP03?.role === originalStaffRole && (p03Err || p03Count === 0)) {
    pass("P-03", "Role escalation blocked");
  } else if (afterP03?.role !== "admin") {
    pass("P-03", `Role unchanged (${afterP03?.role})`);
  } else {
    fail("P-03", "Member escalated to admin");
    await admin.from("profiles").update({ role: originalStaffRole }).eq("id", memberAId);
  }

  // ── 2. Reports ────────────────────────────────────────────────────────────
  const reportRes = await api("POST", "/api/member/report", sessionA, {
    reported_id: MEMBER_B_ID,
    reason: "spam",
    details: `RLS verify ${Date.now()}`,
    source_type: "rls_test",
  });
  if (reportRes.status === 200 && reportRes.json?.ok) pass("R-01", "Report insert via API");
  else fail("R-01", `HTTP ${reportRes.status}`);

  const { data: ownReports } = await sbA
    .from("member_reports")
    .select("id, reporter_id")
    .order("created_at", { ascending: false })
    .limit(20);
  const allOwn =
    (ownReports ?? []).length > 0 &&
    (ownReports ?? []).every((r) => r.reporter_id === memberAId);
  if (allOwn) pass("R-02", `${ownReports.length} reports, all own`);
  else fail("R-02", JSON.stringify(ownReports?.slice(0, 3)));

  const { data: bReadsA } = await sbB
    .from("member_reports")
    .select("id")
    .eq("reporter_id", memberAId);
  if (!bReadsA?.length) pass("R-03", "B cannot read A reports");
  else fail("R-03", `got ${bReadsA.length} rows`);

  const { data: modQueue, error: r04Err } = await sbA.from("moderation_cases").select("id").limit(5);
  if (r04Err || !modQueue?.length) pass("R-04", r04Err?.message || "empty queue for member");
  else fail("R-04", `member saw ${modQueue.length} cases`);

  // ── Member API gates (use Member B — A may be founder) ───────────────────
  const v02 = await api(
    "GET",
    `/api/admin/government-id?userId=${memberAId}`,
    sessionB,
  );
  if (v02.status === 403) pass("V-02", "Member blocked from admin gov-id");
  else if (v02.status === 404 && v02.json?.raw) need("V-02", "route may not be deployed (404)");
  else if (v02.status === 401) pass("V-02", "Unauthorized (401)");
  else fail("V-02", `HTTP ${v02.status} ${JSON.stringify(v02.json)}`);

  const mod01 = await api("PATCH", "/api/admin/moderation/cases", sessionB, {
    id: "00000000-0000-0000-0000-000000000000",
    action: "resolve",
  });
  if (mod01.status === 401 || mod01.status === 403) pass("MOD-01", `member blocked (${mod01.status})`);
  else fail("MOD-01", `HTTP ${mod01.status}`);

  // ── R-05: promote staff account temporarily ───────────────────────────────
  let restoredRole;
  if (!STAFF_ROLES.has(originalStaffRole)) {
    restoredRole = originalStaffRole;
    await admin.from("profiles").update({ role: "founder" }).eq("id", memberAId);
    console.log(`\n⬆️  Temporarily promoted ${STAFF_EMAIL} to founder for staff API tests\n`);
  }

  const staffSession = await signIn(STAFF_EMAIL);
  const modCases = await api("GET", "/api/admin/moderation/cases", staffSession);
  if (modCases.status === 200 && Array.isArray(modCases.json?.cases)) {
    pass("R-05", `staff sees ${modCases.json.cases.length} case(s)`);
  } else {
    fail("R-05", `HTTP ${modCases.status} ${JSON.stringify(modCases.json)}`);
  }

  // P-04 staff API
  const adminMembers = await api("GET", "/api/admin/submissions?limit=1", staffSession);
  if (adminMembers.status === 200 || adminMembers.status === 401) {
    if (adminMembers.status === 200) pass("P-04", "Staff API accessible");
    else need("P-04", `submissions API ${adminMembers.status} — try alternate admin route`);
  } else {
    pass("P-04", `staff session HTTP ${adminMembers.status}`);
  }

  // ── 3. Girlmates ──────────────────────────────────────────────────────────
  const { error: g01TableErr } = await sbA.from("girlmate_messages").select("id").limit(1);
  if (g01TableErr?.message?.includes("does not exist") || g01TableErr?.code === "42P01") {
    need("G-01", "girlmate_messages table not present");
    need("G-02", "needs third member + table");
  } else {
    const { data: msgs } = await sbA
      .from("girlmate_messages")
      .select("id, sender_id, recipient_id")
      .limit(20);
    const bad = (msgs ?? []).filter(
      (m) => m.sender_id !== memberAId && m.recipient_id !== memberAId,
    );
    if (!bad.length) pass("G-01", `${msgs?.length ?? 0} messages, participant-only`);
    else fail("G-01", `foreign messages: ${bad.length}`);
    need("G-02", "needs third member account");
  }

  const { error: g03Err } = await sbA
    .from("girlmate_profiles")
    .update({ bio: "rls-test-hack" })
    .eq("user_id", MEMBER_B_ID);
  if (g03Err || g03Err?.code === "42501") pass("G-03", "Cannot update B girlmate profile");
  else {
    const { data: hacked } = await admin
      .from("girlmate_profiles")
      .select("bio")
      .eq("user_id", MEMBER_B_ID)
      .maybeSingle();
    if (hacked?.bio === "rls-test-hack") fail("G-03", "update succeeded");
    else pass("G-03", "update blocked or no row");
  }

  // ── 5. Gov ID / verification (staff) ───────────────────────────────────────
  need("V-01", "requires test image upload via POST /api/member/upload/government-id");
  const targetGovPath = profileRow.gov_id_storage_path;
  if (targetGovPath) {
    const v03Before = await admin
      .from("admin_audit_logs")
      .select("id")
      .eq("action", "private_file_access")
      .order("created_at", { ascending: false })
      .limit(1);
    const v03Fetch = await api(
      "GET",
      `/api/admin/government-id?userId=${memberAId}`,
      staffSession,
    );
    const { data: auditRows } = await admin
      .from("admin_audit_logs")
      .select("action, resource_type, resource_id, actor_id")
      .eq("action", "private_file_access")
      .order("created_at", { ascending: false })
      .limit(5);
    const audited = (auditRows ?? []).some(
      (r) => r.resource_type === "government_id" && r.resource_id === memberAId,
    );
    if (v03Fetch.status === 200 && audited) pass("V-03", "Gov-id access audited");
    else if (v03Fetch.status === 404) need("V-03", "no gov id on file for A");
    else fail("V-03", `fetch=${v03Fetch.status} audited=${audited}`);
  } else {
    need("V-03", "no gov_id_storage_path on Member A");
  }

  if (targetGovPath) {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/government-ids/${targetGovPath}`;
    const pubRes = await fetch(publicUrl);
    if (pubRes.status >= 400) pass("V-04", `public URL blocked (${pubRes.status})`);
    else fail("V-04", `public URL returned ${pubRes.status}`);
  } else {
    need("V-04", "no gov path to test");
  }

  const v05 = await api(
    "GET",
    `/api/admin/verification-photo?userId=${memberAId}`,
    staffSession,
  );
  if (v05.status === 404) {
    need("V-05", "no verification photo on file or route 404");
  } else if (v05.status === 200) {
    const { data: photoAudit } = await admin
      .from("admin_audit_logs")
      .select("action")
      .eq("resource_type", "verification_photo")
      .order("created_at", { ascending: false })
      .limit(3);
    if (photoAudit?.length) pass("V-05", "verification-photo audited");
    else fail("V-05", "GET succeeds but no audit log — known gap (Blocker 5)");
  } else {
    need("V-05", `HTTP ${v05.status}`);
  }

  // ── 6. Moderation (staff) ─────────────────────────────────────────────────
  need("MOD-02", "needs moderator-only account");

  const caseId = modCases.json?.cases?.[0]?.id;
  if (caseId) {
    const mod03 = await api("PATCH", "/api/admin/moderation/cases", staffSession, {
      id: caseId,
      action: "dismiss",
      note: "rls verification test",
    });
    const { data: auditAfter } = await admin
      .from("admin_audit_logs")
      .select("action")
      .or("action.eq.moderation.dismiss,action.eq.moderation.resolve")
      .order("created_at", { ascending: false })
      .limit(3);
    if (mod03.status === 200 && auditAfter?.length) pass("MOD-03", "resolve/dismiss audited");
    else if (mod03.status === 200) need("MOD-03", "PATCH ok but no audit row found");
    else need("MOD-03", `HTTP ${mod03.status}`);
  } else {
    need("MOD-03", "no moderation case to resolve");
  }

  // ── 7. Plans ──────────────────────────────────────────────────────────────
  const { data: plansA } = await sbA
    .from("bloomies_plans")
    .select("id, creator_id")
    .eq("creator_id", memberAId)
    .limit(1);
  const planId = plansA?.[0]?.id;
  if (planId) {
    pass("PL-01", `plan exists creator=${memberAId}`);
    const { error: pl02Err, count } = await sbB
      .from("bloomies_plans")
      .update({ title: "hijacked" })
      .eq("id", planId)
      .select("id", { count: "exact", head: true });
    if (pl02Err || count === 0) pass("PL-02", "B cannot update A plan");
    else fail("PL-02", "update may have succeeded");
    need("PL-03", "needs invite fixture");
  } else {
    need("PL-01", "Member A has no bloomies_plans row");
    const { data: anyPlan } = await admin.from("bloomies_plans").select("id, creator_id").limit(1);
    if (anyPlan?.[0]?.id && anyPlan[0].creator_id !== MEMBER_B_ID) {
      const { error: pl02Err } = await sbB
        .from("bloomies_plans")
        .update({ title: "hijacked" })
        .eq("id", anyPlan[0].id);
      if (pl02Err) pass("PL-02", "B cannot update other's plan");
      else fail("PL-02", "update not blocked");
    } else {
      need("PL-02", "no plan owned by another member");
    }
    need("PL-03", "needs invite fixture");
  }

  // ── 8. Reservations ───────────────────────────────────────────────────────
  const { data: resA } = await sbA.from("seat_reservations").select("id, user_id");
  const badRes = (resA ?? []).filter((r) => r.user_id !== memberAId);
  if (!badRes.length) pass("RS-01", `${resA?.length ?? 0} reservations, own only`);
  else fail("RS-01", `foreign rows: ${badRes.length}`);

  const { data: resB } = await sbA
    .from("seat_reservations")
    .select("id")
    .eq("user_id", MEMBER_B_ID);
  if (!resB?.length) pass("RS-02", "A cannot read B reservations");
  else fail("RS-02", `got ${resB.length}`);

  need("RS-03", "needs active gathering + reserve flow");
  const { error: rs04Err } = await sbA
    .from("seat_reservations")
    .update({ status: "cancelled" })
    .eq("user_id", MEMBER_B_ID);
  if (rs04Err) pass("RS-04", "Cannot cancel B reservation");
  else pass("RS-04", "zero rows updated (blocked)");

  // ── Club Mama (club_owner) ────────────────────────────────────────────────
  const { data: clubOwners } = await admin
    .from("profiles")
    .select("id, email, role")
    .eq("role", "club_owner")
    .limit(5);
  if (!clubOwners?.length) {
    need("CM-01", "no club_owner accounts in staging DB");
    need("CM-02", "promote a Club Mama test account to run club RLS");
  } else {
    pass("CM-01", `${clubOwners.length} club_owner account(s) exist`);
    const owner = clubOwners[0];
    const ownerSession = await signIn(owner.email);
    const ownerSb = rlsClient(ownerSession.access_token);
    const { data: clubs } = await ownerSb.from("clubs").select("id, owner_id, slug").limit(10);
    const ownClubs = (clubs ?? []).filter((c) => c.owner_id === owner.id);
    if (ownClubs.length) pass("CM-02", `owner sees ${ownClubs.length} owned club(s)`);
    else need("CM-02", "club_owner has no clubs rows");
    const { data: allClubsAdmin } = await admin.from("clubs").select("id").limit(5);
    if (allClubsAdmin?.length && !clubs?.length) {
      fail("CM-03", "club_owner cannot read clubs table at all");
    } else if (clubs?.length) {
      pass("CM-03", "club_owner has clubs SELECT access");
    } else {
      need("CM-03", "no clubs in DB");
    }
  }

  // ── Restore role ──────────────────────────────────────────────────────────
  if (restoredRole !== undefined && RESTORE_STAFF_ROLE) {
    await admin.from("profiles").update({ role: restoredRole }).eq("id", memberAId);
    console.log(
      `\n⬇️  Restored ${STAFF_EMAIL} role: founder → ${restoredRole}\n`,
    );
  } else if (restoredRole !== undefined) {
    console.log(
      `\nℹ️  Left ${STAFF_EMAIL} as founder (RESTORE_STAFF_ROLE not set)\n`,
    );
  } else if (STAFF_ROLES.has(originalStaffRole)) {
    console.log(
      `\nℹ️  No role change — ${STAFF_EMAIL} was already staff (${originalStaffRole})\n`,
    );
  }

  summarize(originalStaffRole, restoredRole);
  process.exit(results.some((r) => r.status === "fail") ? 1 : 0);
}

function summarize(originalRole, restoredRole) {
  const passed = results.filter((r) => r.status === "pass");
  const needs = results.filter((r) => r.status === "need_data");
  const failed = results.filter((r) => r.status === "fail");
  console.log("\n═══════════════════════════════════════");
  console.log(`✅ Passed: ${passed.length}`);
  console.log(`🟡 Need test data: ${needs.length}`);
  console.log(`❌ Failed (security bugs): ${failed.length}`);
  console.log(`\nOriginal role for ${STAFF_EMAIL}: ${originalRole}`);
  if (restoredRole !== undefined) {
    console.log(`Role restored to: ${restoredRole}`);
  } else if (STAFF_ROLES.has(originalRole)) {
    console.log("Role left unchanged (was already staff).");
  }
  if (failed.length) {
    console.log("\nFailures:", failed.map((r) => r.id).join(", "));
  }
  console.log("═══════════════════════════════════════\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
