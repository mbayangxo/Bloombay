import type { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { USER_ROLES, normalizeRole, type UserRole } from "@/lib/auth/roles";

export const ROLE_COOKIE = "bb_role";
export const UID_COOKIE = "bb_uid";
const MAX_AGE = 60 * 60 * 24; // 24h — avoids profiles query on every navigation

export function roleFromRequestCookies(request: NextRequest, userId: string): UserRole | null {
  const uid = request.cookies.get(UID_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  if (uid !== userId || !role) return null;
  return USER_ROLES.includes(role as UserRole) ? (role as UserRole) : null;
}

export function applyRoleCookies(response: NextResponse, userId: string, role: UserRole) {
  const opts = {
    path: "/",
    maxAge: MAX_AGE,
    sameSite: "lax" as const,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  response.cookies.set(ROLE_COOKIE, role, opts);
  response.cookies.set(UID_COOKIE, userId, opts);
}

export function clearRoleCookies(response: NextResponse) {
  for (const name of [ROLE_COOKIE, UID_COOKIE]) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
}

export function setRoleCookiesClient(userId: string, role: UserRole) {
  const maxAge = MAX_AGE;
  const secure = typeof window !== "undefined" && window.location.protocol === "https:";
  const base = `path=/; max-age=${maxAge}; samesite=lax${secure ? "; secure" : ""}`;
  document.cookie = `${ROLE_COOKIE}=${role}; ${base}`;
  document.cookie = `${UID_COOKIE}=${userId}; ${base}`;
}

export function clearRoleCookiesClient() {
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${UID_COOKIE}=; path=/; max-age=0`;
}

export function roleFromClientCookie(userId: string): UserRole | null {
  if (typeof document === "undefined") return null;
  const uid = document.cookie.match(new RegExp(`(?:^|;\\s*)${UID_COOKIE}=([^;]+)`))?.[1];
  const role = document.cookie.match(new RegExp(`(?:^|;\\s*)${ROLE_COOKIE}=([^;]+)`))?.[1];
  if (uid !== userId || !role) return null;
  return normalizeRole(decodeURIComponent(role));
}
