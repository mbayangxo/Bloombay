#!/usr/bin/env node
/**
 * Phase 2 — Role walkthroughs (staging API smoke).
 * Usage: APP_URL=http://localhost:3000 node scripts/role-walkthrough-staging.mjs
 *
 * Roles: Founder · Club Mama (club_owner) · Host (verified member) · Member
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

const FOUNDER_EMAIL = env.STAFF_EMAIL || env.FOUNDER_EMAIL || "dmbayang@gmail.com";
const CLUB_MAMA_ID = env.CLUB_MAMA_ID || env.MEMBER_B_ID || "c420d66b-26ad-49f4-b81d-945bb8713222";
const MEMBER_EMAIL = env.MEMBER_RESERVE_EMAIL || env.MEMBER_A_EMAIL || FOUNDER_EMAIL;

const results = [];
function pass(role, step, detail) {
  results.push({ role, step, ok: true, detail });
  console.log(`✅ [${role}] ${step}: ${detail}`);
}
function fail(role, step, detail, cause, fix) {
  results.push({ role, step, ok: false, detail, cause, fix });
  console.log(`❌ [${role}] ${step}: ${detail}`);
  if (cause) console.log(`   cause: ${cause}`);
  if (fix) console.log(`   fix: ${fix}`);
}
function warn(role, step, detail) {
  results.push({ role, step, ok: true, detail, warn: true });
  console.log(`🟡 [${role}] ${step}: ${detail}`);
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

async function api(path, session, init = {}) {
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

async function pageOk(path, session, role, step) {
  const res = await api(path, session, { headers: { Accept: "text/html" } });
  if (res.status >= 200 && res.status < 400) {
    pass(role, step, `${path} → HTTP ${res.status}`);
    return true;
  }
  fail(role, step, `${path} unreachable`, `HTTP ${res.status}`, "Check route auth/layout");
  return false;
}

async function main() {
  console.log(`\nRole walkthrough — ${APP_URL}\n`);

  if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) {
    fail("setup", "env", "Missing Supabase env", "", "Set .env.local");
    process.exit(1);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  const { data: mamaProfile } = await admin
    .from("profiles")
    .select("email, role")
    .eq("id", CLUB_MAMA_ID)
    .maybeSingle();

  const clubMamaEmail = mamaProfile?.email;
  if (!clubMamaEmail) {
    fail("setup", "club_mama", "No Club Mama profile", CLUB_MAMA_ID, "Run Blocker 7 walkthrough first");
    process.exit(1);
  }

  // ── Founder ─────────────────────────────────────────────────────────────
  let founderSession;
  try {
    founderSession = await signIn(FOUNDER_EMAIL);
    pass("Founder", "sign-in", FOUNDER_EMAIL);
  } catch (e) {
    fail("Founder", "sign-in", e.message, "", "Auth staging");
    process.exit(1);
  }

  const stats = await api("/api/admin/quick-stats", founderSession);
  if (stats.status === 200 && typeof stats.json.totalMembers === "number") {
    pass("Founder", "quick-stats", `members=${stats.json.totalMembers} pendingClubMama=${stats.json.pendingClubMama ?? "?"}`);
  } else {
    fail("Founder", "quick-stats", `HTTP ${stats.status}`, JSON.stringify(stats.json).slice(0, 100), "admin/quick-stats");
  }

  const queue = await api("/api/admin/club-mama-applications?status=pending", founderSession);
  if (queue.status === 200 && Array.isArray(queue.json)) {
    pass("Founder", "club-hosts-queue", `${queue.json.length} pending Club Mama apps`);
  } else {
    fail("Founder", "club-hosts-queue", `HTTP ${queue.status}`, "", "club-mama-applications GET");
  }

  const mod = await api("/api/admin/moderation/cases", founderSession);
  if (mod.status === 200) {
    pass("Founder", "moderation", `cases loaded`);
  } else if (mod.status === 401 || mod.status === 403) {
    warn("Founder", "moderation", `HTTP ${mod.status} — role may need moderator`);
  } else {
    fail("Founder", "moderation", `HTTP ${mod.status}`, "", "moderation/cases");
  }

  await pageOk("/founder/club-hosts", founderSession, "Founder", "club-hosts-page");

  // ── Club Mama ───────────────────────────────────────────────────────────
  if (mamaProfile.role !== "club_owner") {
    warn("Club Mama", "role", `expected club_owner, got ${mamaProfile.role}`);
  } else {
    pass("Club Mama", "role", "club_owner");
  }

  let mamaSession;
  try {
    mamaSession = await signIn(clubMamaEmail);
    pass("Club Mama", "sign-in", clubMamaEmail);
  } catch (e) {
    fail("Club Mama", "sign-in", e.message, "", "Auth");
    mamaSession = null;
  }

  if (mamaSession) {
    const myClub = await api("/api/club-portal/my-club", mamaSession);
    if (myClub.status === 200 && myClub.json.id) {
      pass("Club Mama", "my-club", `${myClub.json.name} (${myClub.json.slug})`);
    } else {
      fail("Club Mama", "my-club", `HTTP ${myClub.status}`, "", "Approve Club Mama + clubs row");
    }

    const gatherings = await api("/api/club-portal/gatherings", mamaSession);
    if (gatherings.status === 200 && Array.isArray(gatherings.json.upcoming)) {
      pass("Club Mama", "gatherings-list", `${gatherings.json.upcoming.length} upcoming`);
    } else {
      fail("Club Mama", "gatherings-list", `HTTP ${gatherings.status}`, "", "club-portal/gatherings");
    }

    await pageOk("/club-owner/dashboard", mamaSession, "Club Mama", "dashboard-page");
    await pageOk("/club-owner/gatherings", mamaSession, "Club Mama", "gatherings-page");
  }

  // ── Host (verified member — member-hosted gatherings) ───────────────────
  let hostSession;
  try {
    hostSession = await signIn(MEMBER_EMAIL);
    pass("Host", "sign-in", MEMBER_EMAIL);
  } catch (e) {
    fail("Host", "sign-in", e.message, "", "Auth");
    hostSession = null;
  }

  if (hostSession) {
    const { data: hostProf } = await admin
      .from("profiles")
      .select("verification_status, onboarding_completed")
      .eq("id", hostSession.user.id)
      .maybeSingle();

    await pageOk("/member/host", hostSession, "Host", "host-page");

    const createHost = await api("/api/member/gatherings", hostSession, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Host walkthrough ${Date.now().toString(36)}`,
        startsAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        venue: "Walkthrough Venue",
        neighborhood: "Brooklyn",
        capacity: 8,
      }),
    });

    if (createHost.status === 200 && createHost.json.ok !== false) {
      pass("Host", "create-gathering", "member-hosted gathering created");
    } else if (createHost.status === 403) {
      warn(
        "Host",
        "create-gathering",
        `blocked (${createHost.json.error ?? "verification"}) — hostProf=${hostProf?.verification_status}`,
      );
    } else {
      fail("Host", "create-gathering", `HTTP ${createHost.status}`, JSON.stringify(createHost.json).slice(0, 120), "member/gatherings POST");
    }
  }

  // ── Member ──────────────────────────────────────────────────────────────
  let memberSession = hostSession;
  if (!memberSession) {
    try {
      memberSession = await signIn(MEMBER_EMAIL);
    } catch {
      memberSession = null;
    }
  }

  if (memberSession) {
    pass("Member", "sign-in", MEMBER_EMAIL);

    const feed = await api("/api/member/gatherings", memberSession);
    if (feed.status === 200 && Array.isArray(feed.json.gatherings)) {
      const live = feed.json.gatherings.filter((g) => g.publish_status === "live" || g.event_type);
      pass("Member", "happenings-feed", `${feed.json.gatherings.length} rows (${live.length} live-type)`);
    } else {
      fail("Member", "happenings-feed", `HTTP ${feed.status}`, "", "member/gatherings GET");
    }

    const glance = await api("/api/home/glance", memberSession);
    if (glance.status === 200) {
      pass("Member", "home-glance", "home data loads");
    } else {
      warn("Member", "home-glance", `HTTP ${glance.status}`);
    }

    await pageOk("/member/happenings", memberSession, "Member", "happenings-page");
    await pageOk("/member/home", memberSession, "Member", "home-page");

    const liveG = feed.json?.gatherings?.[0];
    if (liveG?.id) {
      const reserve = await api("/api/irl/reserve", memberSession, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gatheringId: liveG.id }),
      });
      if (reserve.status === 200 && reserve.json.ok !== false) {
        pass("Member", "reserve", `gathering ${liveG.id.slice(0, 8)}…`);
      } else if (reserve.json?.alreadyReserved) {
        pass("Member", "reserve", "already reserved (ok)");
      } else {
        warn("Member", "reserve", `HTTP ${reserve.status} ${reserve.json?.error ?? ""}`);
      }
    } else {
      warn("Member", "reserve", "no live gathering to reserve — publish one first");
    }
  }

  const bad = results.filter((r) => !r.ok);
  const warns = results.filter((r) => r.warn);
  console.log(`\n── Summary: ${results.length - bad.length}/${results.length} passed, ${warns.length} warnings ──`);
  if (bad.length) {
    console.log("Failed:", bad.map((r) => `${r.role}/${r.step}`).join(", "));
    process.exit(1);
  }
}

main().catch((e) => {
  if (e?.cause?.code === "ECONNREFUSED" || String(e.message).includes("fetch failed")) {
    fail("setup", "app", `Unreachable ${APP_URL}`, "", "npm run dev");
  }
  console.error(e);
  process.exit(1);
});
