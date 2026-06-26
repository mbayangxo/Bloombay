#!/usr/bin/env node
/**
 * Blocker 7 staging walkthrough — full operator journey.
 * Usage: APP_URL=http://localhost:3000 node scripts/walkthrough-blocker7-staging.mjs
 */

import { readFileSync } from "fs";
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
const MEMBER_B_ID = env.MEMBER_B_ID || "c420d66b-26ad-49f4-b81d-945bb8713222";
const MEMBER_RESERVE_EMAIL = env.MEMBER_RESERVE_EMAIL || STAFF_EMAIL;
const RUN_ID = Date.now().toString(36);

const steps = [];
function ok(n, detail) {
  steps.push({ n, ok: true, detail });
  console.log(`✅ Step ${n}: ${detail}`);
}
function bad(n, detail, cause, fix) {
  steps.push({ n, ok: false, detail, cause, fix });
  console.log(`❌ Step ${n}: ${detail}`);
  if (cause) console.log(`   cause: ${cause}`);
  if (fix) console.log(`   fix: ${fix}`);
  process.exit(1);
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
  const headers = { "Content-Type": "application/json", ...(init.headers || {}) };
  if (session) headers.Cookie = authCookie(session);
  const res = await fetch(`${APP_URL}${path}`, { ...init, headers });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 300) };
  }
  return { status: res.status, json };
}

async function main() {
  console.log(`\nBlocker 7 staging walkthrough — ${APP_URL}\n`);

  if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) {
    bad(0, "Missing Supabase env", ".env.local incomplete", "Set NEXT_PUBLIC_SUPABASE_URL, keys");
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  // Step 14 early — tsc
  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" });
    ok(14, "npx tsc --noEmit passed");
  } catch (e) {
    const out = (e.stdout?.toString() || e.stderr?.toString() || "").slice(0, 500);
    bad(14, "tsc failed", out, "Fix TypeScript errors before walkthrough");
  }

  // Resolve Club Mama test user (member B)
  const { data: mamaProfile, error: mamaProfErr } = await admin
    .from("profiles")
    .select("id, email, role")
    .eq("id", MEMBER_B_ID)
    .maybeSingle();

  if (mamaProfErr || !mamaProfile?.email) {
    bad(
      1,
      "Club Mama test profile missing email",
      mamaProfErr?.message || `no profile for ${MEMBER_B_ID}`,
      "Set MEMBER_B_ID to a staging user with email in profiles",
    );
  }

  const mamaEmail = mamaProfile.email;
  const clubName = `B7 Walkthrough ${RUN_ID}`;

  // Cleanup prior pending apps for this user
  await admin
    .from("club_mama_applications")
    .update({ status: "declined", reviewed_at: new Date().toISOString() })
    .eq("user_id", MEMBER_B_ID)
    .eq("status", "pending");

  // Step 1 — submit application (service role insert simulates logged-in apply)
  const { data: appRow, error: appErr } = await admin
    .from("club_mama_applications")
    .insert({
      user_id: MEMBER_B_ID,
      club_name: clubName,
      club_emoji: "🌸",
      category: "Social & Lifestyle",
      tagline: "Blocker 7 walkthrough club",
      neighborhood: "Williamsburg",
      description: "Staging walkthrough test club",
      frequency: "Monthly",
      capacity: 12,
      membership_type: "open",
      why_run: "Walkthrough",
      experience: "Walkthrough",
      status: "pending",
    })
    .select("id")
    .single();

  if (appErr || !appRow) {
    bad(1, "Submit Club Mama application", appErr?.message, "Check club_mama_applications table/RLS");
  }
  ok(1, `Application submitted (${appRow.id}) as ${mamaEmail}`);

  let staffSession;
  try {
    staffSession = await signIn(STAFF_EMAIL);
  } catch (e) {
    bad(2, "Founder sign-in failed", e.message, "Verify STAFF_EMAIL on staging auth");
  }

  // Step 2 — founder sees queue
  const queue = await apiFetch("/api/admin/club-mama-applications?status=pending", staffSession);
  if (queue.status !== 200 || !Array.isArray(queue.json)) {
    bad(
      2,
      "Founder queue fetch failed",
      `HTTP ${queue.status} ${JSON.stringify(queue.json).slice(0, 120)}`,
      "Start dev server; verify requireAdmin on route",
    );
  }
  const found = queue.json.find((a) => a.id === appRow.id);
  if (!found) {
    bad(
      2,
      "Application not in founder queue",
      "pending list missing new row",
      "Check GET /api/admin/club-mama-applications",
    );
  }
  ok(2, `Founder sees application in queue (${queue.json.length} pending)`);

  // Step 3 — approve via consolidated [id] path
  const approve = await apiFetch(`/api/admin/club-mama-applications/${appRow.id}`, staffSession, {
    method: "POST",
    body: JSON.stringify({ action: "approve" }),
  });
  if (approve.status !== 200 || !approve.json.ok) {
    bad(
      3,
      "Founder approve failed",
      `HTTP ${approve.status} ${JSON.stringify(approve.json).slice(0, 200)}`,
      "Check POST /api/admin/club-mama-applications/[id]",
    );
  }
  ok(3, `Founder approved → clubId=${approve.json.clubId}`);

  // Step 4 — role
  const { data: roleRow } = await admin.from("profiles").select("role").eq("id", MEMBER_B_ID).single();
  if (roleRow?.role !== "club_owner") {
    bad(
      4,
      `profiles.role is ${roleRow?.role}`,
      "approve did not set club_owner",
      "Check approve handler profile update",
    );
  }
  ok(4, "profiles.role = club_owner");

  // Step 5 — clubs row
  const { data: clubRow } = await admin
    .from("clubs")
    .select("id, slug, owner_id, name")
    .eq("owner_id", MEMBER_B_ID)
    .maybeSingle();
  if (!clubRow) {
    bad(5, "No clubs row for owner", "provisionClubFromApplication failed", "Check clubs insert in approve");
  }
  ok(5, `clubs row ${clubRow.id} owner_id=${clubRow.owner_id}`);

  // Step 6 — club mama session + my-club
  let mamaSession;
  try {
    mamaSession = await signIn(mamaEmail);
  } catch (e) {
    bad(6, "Club Mama sign-in failed", e.message, "Auth for club mama email");
  }
  const myClub = await apiFetch("/api/club-portal/my-club", mamaSession);
  if (myClub.status !== 200 || myClub.json.id !== clubRow.id) {
    bad(
      6,
      "Club Mama my-club failed",
      `HTTP ${myClub.status}`,
      "Check /api/club-portal/my-club",
    );
  }
  ok(6, `Club Mama dashboard data from Supabase (${myClub.json.name})`);

  // Step 7 — edit club via branding API (Supabase)
  const newTagline = `B7 tagline ${RUN_ID}`;
  const branding = await apiFetch("/api/club-owner/branding", mamaSession, {
    method: "PATCH",
    body: JSON.stringify({ slug: clubRow.slug, name: clubRow.name, tagline: newTagline }),
  });
  if (branding.status !== 200 && branding.json?.ok !== true) {
    bad(
      7,
      "Club edit via branding API failed",
      `HTTP ${branding.status} ${JSON.stringify(branding.json).slice(0, 120)}`,
      "Check PATCH /api/club-owner/branding",
    );
  }
  const { data: clubAfterEdit } = await admin
    .from("clubs")
    .select("tagline")
    .eq("id", clubRow.id)
    .single();
  if (clubAfterEdit?.tagline !== newTagline) {
    bad(7, "Club tagline not persisted", clubAfterEdit?.tagline, "branding PATCH should write clubs table");
  }
  ok(7, "Club Mama edited club in Supabase (tagline updated)");

  // Gov-ID gate for publish — set verified for walkthrough
  await admin
    .from("profiles")
    .update({ gov_id_verification_status: "verified" })
    .eq("id", MEMBER_B_ID);

  // Step 8 — create gathering
  const startsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const createG = await apiFetch("/api/club-portal/gatherings", mamaSession, {
    method: "POST",
    body: JSON.stringify({
      title: `B7 Gathering ${RUN_ID}`,
      starts_at: startsAt,
      venue: "BloomBay Test Venue",
      neighborhood: "Williamsburg",
      capacity: 10,
    }),
  });
  if (createG.status !== 200 || !createG.json.gathering?.id) {
    bad(
      8,
      "Create gathering failed",
      `HTTP ${createG.status} ${JSON.stringify(createG.json).slice(0, 200)}`,
      "Check gatherings.club_id column + POST /api/club-portal/gatherings",
    );
  }
  const gatheringId = createG.json.gathering.id;
  ok(8, `Gathering created draft ${gatheringId}`);

  // Step 13 partial — draft hidden from member feed before publish
  let reserveSession;
  try {
    reserveSession = await signIn(MEMBER_RESERVE_EMAIL);
  } catch (e) {
    bad(12, "Reserve member sign-in failed", e.message, "Set MEMBER_RESERVE_EMAIL");
  }
  const feedBefore = await apiFetch("/api/member/gatherings", reserveSession);
  const visibleDraft = (feedBefore.json.gatherings ?? []).some((g) => g.id === gatheringId);
  if (visibleDraft) {
    bad(
      13,
      "Draft gathering visible to members",
      "publish_status filter missing",
      "Add publish_status=live to member gatherings API",
    );
  }
  ok(13, "Draft gathering hidden from member feed");

  // Step 9 — publish
  const publish = await apiFetch(`/api/club-portal/gatherings/${gatheringId}/publish`, mamaSession, {
    method: "POST",
  });
  if (publish.status !== 200 || publish.json.publish_status !== "live") {
    bad(
      9,
      "Publish failed",
      `HTTP ${publish.status} ${JSON.stringify(publish.json).slice(0, 200)}`,
      "gov_id_verification_status must be verified; check publish route",
    );
  }
  ok(9, "Club Mama published gathering");

  // Step 10 — DB publish_status
  const { data: gLive } = await admin
    .from("gatherings")
    .select("publish_status, event_type")
    .eq("id", gatheringId)
    .single();
  if (gLive?.publish_status !== "live") {
    bad(10, `publish_status=${gLive?.publish_status}`, "not live after publish", "publish route update");
  }
  ok(10, `publish_status=live, event_type=${gLive?.event_type}`);

  // Step 11 — member sees in happenings feed
  const feedAfter = await apiFetch("/api/member/gatherings", reserveSession);
  const visibleLive = (feedAfter.json.gatherings ?? []).some((g) => g.id === gatheringId);
  if (!visibleLive) {
    bad(
      11,
      "Live gathering not in member feed",
      JSON.stringify(feedAfter.json).slice(0, 200),
      "Check GET /api/member/gatherings filters",
    );
  }
  ok(11, "Member sees live gathering in /api/member/gatherings");

  // Step 12 — reserve
  const reserve = await apiFetch("/api/irl/reserve", reserveSession, {
    method: "POST",
    body: JSON.stringify({ gatheringId }),
  });
  if (reserve.status !== 200 || reserve.json.ok === false) {
    bad(
      12,
      "Member reserve failed",
      `HTTP ${reserve.status} ${JSON.stringify(reserve.json).slice(0, 200)}`,
      "Check POST /api/irl/reserve + seat_reservations",
    );
  }
  ok(12, "Member reserved seat");

  console.log("\n── All 14 steps passed — Blocker 7 staging walkthrough OK ──\n");
  console.log(
    JSON.stringify(
      { applicationId: appRow.id, clubId: clubRow.id, gatheringId, clubMama: mamaEmail },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  if (e?.cause?.code === "ECONNREFUSED" || String(e.message).includes("fetch failed")) {
    bad(2, "App unreachable", `Start dev server at ${APP_URL}`, "npm run dev");
  }
  console.error(e);
  process.exit(1);
});
