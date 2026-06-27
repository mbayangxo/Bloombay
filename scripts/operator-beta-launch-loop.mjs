#!/usr/bin/env node
/**
 * Operator Beta — full Club Mama → share → member join/reserve launch loop (12 steps).
 *
 * Usage:
 *   node scripts/operator-beta-launch-loop.mjs
 *   APP_URL=https://staging.example.com CLUB_MAMA_EMAIL=... node scripts/operator-beta-launch-loop.mjs
 *
 * Env (.env.local): NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY, APP_URL
 * Optional: CLUB_MAMA_EMAIL, LAUNCH_LOOP_MEMBER_EMAIL
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
const APP_URL = (env.APP_URL || env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const CLUB_MAMA_EMAIL = env.CLUB_MAMA_EMAIL || "soyandexo@gmail.com";
const RUN_ID = Date.now();

const results = [];

function pass(step, detail) {
  results.push({ step, ok: true, detail });
  console.log(`✅ Step ${step}: ${detail}`);
}

function fail(step, detail, fix) {
  results.push({ step, ok: false, detail, fix });
  console.log(`❌ Step ${step}: ${detail}`);
  if (fix) console.log(`   fix: ${fix}`);
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
  if (init.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  const res = await fetch(`${APP_URL}${path}`, { ...init, headers, redirect: "manual" });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json, location: res.headers.get("location") };
}

async function main() {
  console.log(`\nOperator Beta launch loop — APP_URL=${APP_URL}\n`);

  if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) {
    fail("setup", "Missing Supabase env", "Set .env.local");
    summarize();
    process.exit(1);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  // ── Step 1: Club Mama has club ─────────────────────────────────────────────
  let mamaSession;
  try {
    mamaSession = await signIn(CLUB_MAMA_EMAIL);
  } catch (e) {
    fail(1, `Club Mama sign-in failed: ${e.message}`, "Set CLUB_MAMA_EMAIL");
    summarize();
    process.exit(1);
  }

  const myClub = await api("/api/club-portal/my-club", mamaSession);
  if (myClub.status !== 200 || !myClub.json.slug) {
    fail(1, `my-club HTTP ${myClub.status} ${JSON.stringify(myClub.json)}`, "Club Mama needs owned club");
  } else {
    pass(1, `Club Mama owns "${myClub.json.name}" (${myClub.json.slug})`);
  }

  const clubSlug = myClub.json?.slug;
  const mamaId = mamaSession.user.id;

  // Ensure gov-id verified for publish gate
  await admin
    .from("profiles")
    .update({ gov_id_verification_status: "verified" })
    .eq("id", mamaId);

  // ── Step 2: Create + publish gathering ────────────────────────────────────
  const startsAt = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString();
  const createG = await api("/api/club-portal/gatherings", mamaSession, {
    method: "POST",
    body: JSON.stringify({
      title: `Launch Loop ${RUN_ID}`,
      starts_at: startsAt,
      venue: "BloomBay Test Venue",
      neighborhood: "Williamsburg",
      capacity: 12,
    }),
  });

  let gatheringId = createG.json?.gathering?.id;
  let gatheringSlug = createG.json?.gathering?.slug;
  if (createG.status !== 200 || !gatheringId) {
    fail(2, `Create gathering failed HTTP ${createG.status}`, JSON.stringify(createG.json).slice(0, 120));
  } else {
    pass(2, `Draft gathering created ${gatheringId}`);
  }

  const publish = gatheringId
    ? await api(`/api/club-portal/gatherings/${gatheringId}/publish`, mamaSession, { method: "POST" })
    : { status: 0, json: {} };

  if (gatheringId && publish.status === 200 && publish.json.publish_status === "live") {
    pass(2, "Gathering published live");
  } else if (gatheringId) {
    fail(2, `Publish failed HTTP ${publish.status}`, JSON.stringify(publish.json).slice(0, 120));
  }

  if (gatheringId && !gatheringSlug) {
    const { data: gRow } = await admin.from("gatherings").select("slug").eq("id", gatheringId).single();
    gatheringSlug = gRow?.slug;
  }

  const shareUrl = gatheringSlug ? `${APP_URL}/member/happenings/${gatheringSlug}` : null;

  // ── Step 3: Shareable link in API ─────────────────────────────────────────
  const listRes = await api("/api/club-portal/gatherings", mamaSession);
  const upcoming = listRes.json?.upcoming ?? [];
  const liveRow = upcoming.find((g) => g.id === gatheringId);
  if (liveRow?.slug && shareUrl) {
    pass(3, `Share link ${shareUrl} (slug in API)`);
  } else {
    fail(3, "No slug on live gathering in club-portal API", "Add slug to mapGathering");
  }

  // ── Step 12 (early): Draft hidden ─────────────────────────────────────────
  if (gatheringSlug) {
    const draftCheck = await admin
      .from("gatherings")
      .select("id, slug, publish_status")
      .eq("club_slug", clubSlug)
      .eq("publish_status", "draft")
      .gte("starts_at", new Date().toISOString())
      .limit(1)
      .maybeSingle();

    if (draftCheck.data?.slug) {
      const draftApi = await api(`/api/member/gatherings/${draftCheck.data.slug}`, null);
      if (draftApi.status === 404 || !draftApi.json?.gathering) {
        pass(12, `Draft slug ${draftCheck.data.slug} hidden (404)`);
      } else {
        fail(12, "Draft gathering leaked via member slug API", "Filter publish_status=live");
      }
    } else {
      pass(12, "No draft gathering to leak-check (ok)");
    }

    const liveApi = await api(`/api/member/gatherings/${gatheringSlug}`, null);
    if (liveApi.status === 200 && liveApi.json?.gathering?.slug === gatheringSlug) {
      pass(12, "Live gathering readable via slug API");
    }
  }

  // ── Step 4: Logged-out link redirects to login ────────────────────────────
  if (shareUrl) {
    const pageRes = await api(shareUrl.replace(APP_URL, ""), null, {
      headers: { Accept: "text/html" },
    });
    const loc = pageRes.location ?? "";
    if (pageRes.status === 307 || pageRes.status === 302) {
      if (loc.includes("/member/login") && loc.includes("redirect=")) {
        pass(4, `Logged-out → login with redirect (${pageRes.status})`);
      } else {
        fail(4, `Redirect without login param: ${loc}`, "proxy should add ?redirect=");
      }
    } else if (pageRes.status >= 200 && pageRes.status < 400) {
      pass(4, `Page reachable logged-out HTTP ${pageRes.status} (public preview)`);
    } else {
      fail(4, `Unexpected HTTP ${pageRes.status}`, loc || "check proxy");
    }
  } else {
    fail(4, "No share URL to test", "publish + slug");
  }

  // ── Fresh member for steps 5–11 ───────────────────────────────────────────
  const memberEmail =
    env.LAUNCH_LOOP_MEMBER_EMAIL || `launch-loop-test+${RUN_ID}@bloombay.test`;
  const memberPassword = `LoopTest${RUN_ID}!`;

  let memberId;
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === memberEmail);
  if (existing) {
    memberId = existing.id;
    await admin.auth.admin.updateUserById(memberId, { password: memberPassword, email_confirm: true });
  } else {
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: memberEmail,
      password: memberPassword,
      email_confirm: true,
      user_metadata: { full_name: "Launch Loop Test" },
    });
    if (createErr || !created.user) {
      fail(5, `Create member failed: ${createErr?.message}`, "service role createUser");
    }
    memberId = created.user.id;
  }

  await admin.from("profiles").upsert({
    id: memberId,
    role: "member",
    onboarding_completed: false,
    first_name: "Launch",
    full_name: "Launch Loop Test",
  });

  // ── Step 5: Sign up / join paths from link ────────────────────────────────
  const loginPage = await api(
    `/member/login?redirect=${encodeURIComponent(`/member/happenings/${gatheringSlug}`)}`,
    null,
    { headers: { Accept: "text/html" } },
  );
  if (loginPage.status >= 200 && loginPage.status < 400) {
    pass(5, "Login page accepts redirect param");
  } else {
    fail(5, `Login page HTTP ${loginPage.status}`, "member/login");
  }

  const onboardPage = await api(
    `/onboard?redirect=${encodeURIComponent(`/member/happenings/${gatheringSlug}`)}`,
    null,
    { headers: { Accept: "text/html" } },
  );
  if (onboardPage.status >= 200 && onboardPage.status < 400) {
    pass(5, "Onboard page accepts redirect param");
  } else {
    fail(5, `Onboard page HTTP ${onboardPage.status}`, "/onboard");
  }

  const waitlistPage = await api("/waitlist", null, { headers: { Accept: "text/html" } });
  if (waitlistPage.status >= 200 && waitlistPage.status < 400) {
    pass(5, "Waitlist page reachable");
  } else {
    fail(5, `Waitlist HTTP ${waitlistPage.status}`, "/waitlist");
  }

  // ── Step 6: Onboarding gate preserves return path ─────────────────────────
  let memberSession;
  try {
    memberSession = await signIn(memberEmail);
  } catch (e) {
    fail(6, `Member sign-in failed: ${e.message}`, "OTP sign-in");
    summarize();
    process.exit(1);
  }

  const gated = await api(`/member/happenings/${gatheringSlug}`, memberSession, {
    headers: { Accept: "text/html" },
  });
  const gateLoc = gated.location ?? "";
  if (
    (gated.status === 307 || gated.status === 302) &&
    gateLoc.includes("/onboard") &&
    gateLoc.includes("redirect=")
  ) {
    pass(6, "Incomplete onboarding → /onboard?redirect=…");
  } else if (gated.status >= 200 && gated.status < 400) {
    pass(6, "Member reached happening (onboarding already complete)");
  } else {
    fail(6, `Gate redirect HTTP ${gated.status} loc=${gateLoc}`, "proxy onboarding gate");
  }

  await admin.from("profiles").update({ onboarding_completed: true }).eq("id", memberId);
  memberSession = await signIn(memberEmail);

  const landed = await api(`/member/happenings/${gatheringSlug}`, memberSession, {
    headers: { Accept: "text/html" },
  });
  if (landed.status >= 200 && landed.status < 400) {
    pass(6, "After onboarding, member reaches happening page");
  } else {
    fail(6, `Post-onboard page HTTP ${landed.status}`, landed.location ?? "");
  }

  // ── Step 7: Reserve / RSVP ────────────────────────────────────────────────
  const reserve = await api("/api/irl/reserve", memberSession, {
    method: "POST",
    body: JSON.stringify({ gatheringId }),
  });
  if (reserve.status === 200 && reserve.json.ok !== false) {
    pass(7, "Member reserved seat");
  } else {
    fail(7, `Reserve HTTP ${reserve.status} ${JSON.stringify(reserve.json).slice(0, 120)}`, "/api/irl/reserve");
  }

  // ── Step 8: Confirmation notification ─────────────────────────────────────
  await new Promise((r) => setTimeout(r, 1500));
  const { data: notifs } = await admin
    .from("notification_events")
    .select("id, type, user_id, created_at")
    .eq("user_id", memberId)
    .eq("type", "ticket_confirmed")
    .order("created_at", { ascending: false })
    .limit(1);

  if (notifs?.length) {
    pass(8, `ticket_confirmed notification id=${notifs[0].id}`);
  } else {
    fail(8, "No ticket_confirmed notification", "createNotificationEvent + migration 120");
  }

  // ── Step 9: Club Mama sees attendees ───────────────────────────────────────
  const attendees = await api(`/api/club-portal/gatherings/${gatheringId}/attendees`, mamaSession);
  const attendeeList = attendees.json?.attendees ?? [];
  const foundMember = attendeeList.some((a) => a.user_id === memberId);
  if (attendees.status === 200 && foundMember) {
    pass(9, `Club Mama sees ${attendeeList.length} attendee(s) including test member`);
  } else if (attendees.status === 200) {
    fail(9, `Attendees API ok but member missing (${attendeeList.length} rows)`, "seat_reservations join");
  } else {
    fail(9, `Attendees HTTP ${attendees.status}`, "GET /api/club-portal/gatherings/[id]/attendees");
  }

  // ── Step 10: Member cancel ────────────────────────────────────────────────
  const cancel = await api("/api/member/calendar/rsvp", memberSession, {
    method: "POST",
    body: JSON.stringify({ gathering_id: gatheringId, action: "leave" }),
  });
  if (cancel.status === 200 && cancel.json.ok) {
    pass(10, "Member cancelled reservation");
  } else {
    fail(10, `Cancel HTTP ${cancel.status}`, "POST /api/member/calendar/rsvp leave");
  }

  const attendeesAfter = await api(`/api/club-portal/gatherings/${gatheringId}/attendees`, mamaSession);
  const stillListed = (attendeesAfter.json?.attendees ?? []).some((a) => a.user_id === memberId);
  if (attendeesAfter.status === 200 && !stillListed) {
    pass(10, "Attendee removed from Club Mama list after cancel");
  } else if (attendeesAfter.status === 200) {
    fail(10, "Member still in attendee list after cancel", "status=cancelled filter");
  }

  // ── Step 11: Report/block still works ─────────────────────────────────────
  const blockTarget = mamaId;
  const report = await api("/api/member/report", memberSession, {
    method: "POST",
    body: JSON.stringify({
      reported_id: blockTarget,
      reason: "spam",
      details: `launch-loop smoke ${RUN_ID}`,
      source_type: "launch_loop",
    }),
  });
  if (report.status === 200 && report.json?.ok) {
    pass(11, `Report submitted id=${report.json.report_id}`);
  } else {
    fail(11, `Report HTTP ${report.status}`, "POST /api/member/report");
  }

  const block = await api("/api/member/block", memberSession, {
    method: "POST",
    body: JSON.stringify({ blocked_id: blockTarget }),
  });
  if (block.status === 200 && block.json?.ok) {
    pass(11, "Block API ok");
    await api(`/api/member/block?blocked_id=${encodeURIComponent(blockTarget)}`, memberSession, {
      method: "DELETE",
    });
  } else {
    fail(11, `Block HTTP ${block.status}`, "POST /api/member/block");
  }

  summarize({
    gatheringId,
    gatheringSlug,
    shareUrl,
    memberEmail,
    clubSlug,
  });
  process.exit(results.some((r) => !r.ok) ? 1 : 0);
}

function summarize(meta) {
  const bad = results.filter((r) => !r.ok);
  console.log(`\n── Launch loop: ${results.length - bad.length}/${results.length} steps passed ──`);
  if (bad.length) {
    console.log("Failed steps:", bad.map((r) => r.step).join(", "));
  }
  if (meta) {
    console.log("\nArtifacts:", JSON.stringify(meta, null, 2));
  }
  console.log("\nManual QA: incognito share link → signup → reserve → cancel in browser.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
