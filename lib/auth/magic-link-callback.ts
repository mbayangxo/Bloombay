import { createClient } from "@/lib/supabase/browser";
import { safePathAfterLogin } from "@/lib/auth/redirect";
import { fetchUserRole } from "@/lib/auth/session";
import {
  canAccessPortal,
  COMPANY_LOGIN,
  portalLabel,
  type PortalId,
} from "@/lib/auth/roles";
import { clearRoleCookiesClient, setRoleCookiesClient } from "@/lib/auth/role-cookie";

export type MagicLinkResult =
  | { status: "none" }
  | { status: "redirecting" }
  | { status: "error"; message: string };

function decodeRedirectParam(raw: string | null): string | undefined {
  if (!raw) return undefined;
  try {
    const decoded = decodeURIComponent(raw);
    return decoded.startsWith("/") ? decoded : undefined;
  } catch {
    return raw.startsWith("/") ? raw : undefined;
  }
}

export function fallbackNextFromLocation(): string | undefined {
  const params = new URLSearchParams(window.location.search);
  return decodeRedirectParam(params.get("redirect") ?? params.get("next"));
}

export function hasAuthCallback(search: string, hash: string): boolean {
  if (hash.includes("access_token")) return true;
  return new URLSearchParams(search).has("code");
}

function parseHashTokens(hash: string): { access_token: string; refresh_token: string } | null {
  if (!hash.startsWith("#")) return null;
  const params = new URLSearchParams(hash.slice(1));
  const access_token = params.get("access_token");
  if (!access_token) return null;
  return {
    access_token,
    refresh_token: params.get("refresh_token") ?? "",
  };
}

function stripAuthFromUrl(): void {
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.delete("code");
  window.history.replaceState({}, "", url.pathname + url.search);
}

function roleGuardMessage(portal: PortalId, role: string): string {
  if (portal === "member" && role !== "member") {
    return `This is a ${role} account. Use company sign-in at ${COMPANY_LOGIN}.`;
  }
  return `Your account does not have access to the ${portalLabel(portal)} portal.`;
}

export async function processMagicLinkCallback(portal: PortalId): Promise<MagicLinkResult> {
  const search = window.location.search;
  const hash = window.location.hash;
  if (!hasAuthCallback(search, hash)) return { status: "none" };

  const supabase = createClient();
  const fallbackNext = fallbackNextFromLocation();
  const code = new URLSearchParams(search).get("code");

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    } else {
      const tokens = parseHashTokens(hash);
      if (!tokens) return { status: "none" };
      const { error } = await supabase.auth.setSession(tokens);
      if (error) throw error;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Sign-in succeeded but no session.");

    const role = (await fetchUserRole()) ?? "member";

    if (portal === "member" && role !== "member") {
      await supabase.auth.signOut();
      clearRoleCookiesClient();
      stripAuthFromUrl();
      return { status: "error", message: roleGuardMessage(portal, role) };
    }

    if (!canAccessPortal(role, portal)) {
      await supabase.auth.signOut();
      clearRoleCookiesClient();
      stripAuthFromUrl();
      return { status: "error", message: roleGuardMessage(portal, role) };
    }

    setRoleCookiesClient(user.id, role);
    stripAuthFromUrl();
    window.location.href = safePathAfterLogin(role, portal, fallbackNext);
    return { status: "redirecting" };
  } catch (err) {
    stripAuthFromUrl();
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Could not complete sign-in.",
    };
  }
}
