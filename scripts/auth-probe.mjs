#!/usr/bin/env node
/**
 * Auth probe — prove why Preview returns 401 for gate scripts.
 * Usage: APP_URL=https://preview... node scripts/auth-probe.mjs
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

function loadEnv() {
  const env = { ...process.env };
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i > 0 && env[t.slice(0, i)] === undefined) {
        env[t.slice(0, i)] = t.slice(i + 1).replace(/^"|"$/g, "");
      }
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
const EMAIL = env.CLUB_MAMA_EMAIL || "soyandexo@gmail.com";

function legacyCookie(session) {
  const ref = new URL(SUPABASE_URL).hostname.split(".")[0];
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

function ssrCookieHeader(session) {
  const jar = [];
  const supabase = createServerClient(SUPABASE_URL, ANON_KEY, {
    cookies: {
      getAll() {
        return jar;
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((c) => {
          const i = jar.findIndex((x) => x.name === c.name);
          if (i >= 0) jar[i] = c;
          else jar.push(c);
        });
      },
    },
  });
  // setSession is sync enough for cookie jar population
  return supabase.auth
    .setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    })
    .then(() => jar.map((c) => `${c.name}=${c.value}`).join("; "));
}

async function signIn() {
  const client = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: EMAIL,
  });
  if (linkErr || !linkData?.properties?.hashed_token) throw new Error(linkErr?.message || "no token");
  const { data: otpData, error: otpErr } = await client.auth.verifyOtp({
    type: "email",
    token_hash: linkData.properties.hashed_token,
  });
  if (otpErr || !otpData.session) throw new Error(otpErr?.message || "no session");
  return otpData.session;
}

async function probe(label, cookieHeader, bearer) {
  const headers = {};
  if (cookieHeader) headers.Cookie = cookieHeader;
  if (bearer) headers.Authorization = `Bearer ${bearer}`;
  const res = await fetch(`${APP_URL}/api/club-portal/my-club`, { headers, redirect: "manual" });
  const text = await res.text();
  console.log(`${label}: HTTP ${res.status} ${text.slice(0, 80)}`);
}

async function main() {
  console.log(`\nAuth probe — APP_URL=${APP_URL}`);
  console.log(`Supabase host: ${SUPABASE_URL ? new URL(SUPABASE_URL).hostname : "missing"}`);
  console.log(`Local anon: length=${(ANON_KEY || "").length} eyJ=${(ANON_KEY || "").startsWith("eyJ")}`);
  console.log(`Session mint: .env.local (not Vercel env)\n`);

  const session = await signIn();
  console.log(`Signed in ${EMAIL} user=${session.user.id.slice(0, 8)}…\n`);

  const legacy = legacyCookie(session);
  console.log(`Legacy cookie length: ${legacy.length}`);

  const ssrHeader = await ssrCookieHeader(session);
  console.log(`SSR cookie header length: ${ssrHeader.length}`);
  console.log(`SSR cookie names: ${ssrHeader.split(";").map((p) => p.trim().split("=")[0]).join(", ")}\n`);

  await probe("no auth", null, null);
  await probe("legacy cookie", legacy, null);
  await probe("ssr cookie jar", ssrHeader, null);
  await probe("bearer only", null, session.access_token);

  const client = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
  const { data: u1, error: e1 } = await client.auth.getUser(session.access_token);
  console.log(`\nDirect getUser(local anon): user=${u1?.user?.id?.slice(0, 8) ?? "null"} err=${e1?.message ?? "none"}`);

  const rawJson = (() => {
    const ref = new URL(SUPABASE_URL).hostname.split(".")[0];
    const val = JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      expires_in: session.expires_in,
      token_type: session.token_type,
      user: session.user,
    });
    return `sb-${ref}-auth-token=${val}`;
  })();
  await probe("legacy cookie raw JSON (no encode)", rawJson, null);

  const dbg = await fetch(`${APP_URL}/api/debug/auth-session`, {
    headers: { Cookie: ssrHeader },
  });
  if (dbg.status === 200) {
    console.log("\n/api/debug/auth-session (with SSR cookie):");
    console.log(await dbg.text());
  } else {
    console.log(`\n/api/debug/auth-session: HTTP ${dbg.status}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
