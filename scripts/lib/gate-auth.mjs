/**
 * Shared auth helpers for gate/launch-loop scripts hitting APP_URL (preview or local).
 * Sessions are minted via Supabase admin API using .env.local credentials (same staging project).
 * Cookies are serialized with @supabase/ssr so Route Handlers can read them.
 */

import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { readFileSync } from "fs";

export function loadGateEnv() {
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

export async function signInWithMagicLink(email, env = loadGateEnv()) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || !service) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, or SERVICE_ROLE_KEY in .env.local");
  }

  const client = createClient(url, anon, { auth: { persistSession: false } });
  const admin = createClient(url, service, { auth: { persistSession: false } });
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkErr || !linkData?.properties?.hashed_token) {
    throw new Error(linkErr?.message || "no magic link token");
  }
  const { data: otpData, error: otpErr } = await client.auth.verifyOtp({
    type: "email",
    token_hash: linkData.properties.hashed_token,
  });
  if (otpErr || !otpData.session) throw new Error(otpErr?.message || "no session");
  return otpData.session;
}

/** Cookie header string compatible with @supabase/ssr Route Handlers */
export async function cookieHeaderForSession(session, env = loadGateEnv()) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const jar = [];
  const supabase = createServerClient(url, anon, {
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
  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
  return jar.map((c) => `${c.name}=${c.value}`).join("; ");
}

export async function apiFetch(appUrl, path, session, init = {}, env = loadGateEnv()) {
  const headers = { ...(init.headers || {}) };
  if (session) headers.Cookie = await cookieHeaderForSession(session, env);
  if (init.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  const res = await fetch(`${appUrl.replace(/\/$/, "")}${path}`, {
    ...init,
    headers,
    redirect: "manual",
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json, location: res.headers.get("location") };
}
