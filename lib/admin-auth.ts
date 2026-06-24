import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const ADMIN_COOKIE = "bb_founder_session";
/** Role cookie uid when signed in via ADMIN_PASSWORD (no Supabase user). */
export const FOUNDER_PASSWORD_UID = "bb-founder-password";

export function getAdminSecret(): string {
  return (
    process.env.ADMIN_PASSWORD ??
    process.env.FOUNDER_DASHBOARD_PASSWORD ??
    ""
  );
}

export function isValidAdminPassword(password: string): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;
  return password === secret;
}

export function createSessionToken(): string {
  const secret = getAdminSecret();
  if (!secret) return "";
  return Buffer.from(`bloombay-founder:${secret}`).toString("base64url");
}

export function isFounderPasswordSession(token: string | undefined): boolean {
  const secret = getAdminSecret();
  if (!secret || !token) return false;
  return token === createSessionToken();
}

export function isFounderPasswordSessionFromRequest(request: NextRequest): boolean {
  return isFounderPasswordSession(request.cookies.get(ADMIN_COOKIE)?.value);
}

/** Verify admin via Supabase session — user must have role admin or founder. */
export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll() {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return ["admin", "founder"].includes(profile?.role ?? "");
}
