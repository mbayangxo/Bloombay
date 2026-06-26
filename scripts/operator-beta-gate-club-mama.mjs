#!/usr/bin/env node
/**
 * Club Mama cross-session proof — P0 path uses Supabase only (no localStorage).
 *
 * Simulates fresh session: sign in as Club Mama → my-club API → gatherings API.
 *
 * Usage: APP_URL=http://localhost:3000 CLUB_MAMA_EMAIL=soyandexo@gmail.com node scripts/operator-beta-gate-club-mama.mjs
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
const CLUB_MAMA_EMAIL = env.CLUB_MAMA_EMAIL || "soyandexo@gmail.com";

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

async function main() {
  console.log(`\nClub Mama cross-session gate — APP_URL=${APP_URL}\n`);

  const session = await signIn(CLUB_MAMA_EMAIL);
  const cookie = authCookie(session);
  const headers = { Cookie: cookie };

  const myClub = await fetch(`${APP_URL}/api/club-portal/my-club`, { headers });
  const myClubJson = await myClub.json();
  if (myClub.status !== 200 || !myClubJson.slug) {
    console.log(`❌ my-club: HTTP ${myClub.status} ${JSON.stringify(myClubJson)}`);
    process.exit(1);
  }
  console.log(`✅ my-club: ${myClubJson.name} (${myClubJson.slug}) — from Supabase owner_id`);

  const gatherings = await fetch(`${APP_URL}/api/club-portal/gatherings`, { headers });
  const gJson = await gatherings.json();
  if (gatherings.status !== 200) {
    console.log(`❌ gatherings: HTTP ${gatherings.status} ${JSON.stringify(gJson)}`);
    process.exit(1);
  }
  const list = Array.isArray(gJson.gatherings) ? gJson.gatherings : gJson.items ?? [];
  console.log(`✅ gatherings: ${list.length} row(s) for club_slug=${myClubJson.slug}`);

  const live = list.filter((g) => g.publish_status === "live");
  console.log(`✅ live gatherings: ${live.length}`);

  console.log("\n── Cross-session P0 path: PASS (API/session only, no localStorage) ──\n");
  console.log("Manual: repeat in incognito browser with password or magic link.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
