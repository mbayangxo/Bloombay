import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  applyRoleCookies,
  roleFromRequestCookies,
} from "@/lib/auth/role-cookie";
import {
  FOUNDER_PASSWORD_UID,
  isFounderPasswordSessionFromRequest,
} from "@/lib/admin-auth";
import { canUseCompanyPortal } from "@/lib/auth/company-portal";
import {
  canAccessPortal,
  COMPANY_LOGIN,
  roleFromEmailAddress,
  MEMBER_LOGIN,
  homeForRole,
  normalizeRole,
  portalFromPath,
  PORTAL_LOGIN,
  type PortalId,
  type UserRole,
} from "@/lib/auth/roles";

const COMPANY_AUTH_PATHS = new Set([COMPANY_LOGIN, "/company/create"]);

function isCompanyAuthPath(pathname: string): boolean {
  return (
    COMPANY_AUTH_PATHS.has(pathname) ||
    pathname.startsWith("/company/") ||
    pathname === "/login" ||
    pathname.startsWith("/login/")
  );
}

function redirectWrongPortal(
  request: NextRequest,
  role: UserRole,
  triedPortal: PortalId,
  userId: string
): NextResponse {
  const url = request.nextUrl.clone();
  const attempted = `${url.pathname}${url.search}`;
  url.pathname = PORTAL_LOGIN[triedPortal];
  url.searchParams.set("notice", "wrong_portal");
  url.searchParams.set("tried", triedPortal);
  url.searchParams.set("next", attempted);
  url.searchParams.delete("error");
  url.searchParams.delete("from");
  const redirect = NextResponse.redirect(url);
  applyRoleCookies(redirect, userId, role);
  return redirect;
}

function portalFromLoginPath(pathname: string): PortalId | null {
  if (isCompanyAuthPath(pathname)) return null;
  for (const [portal, path] of Object.entries(PORTAL_LOGIN) as [PortalId, string][]) {
    if (pathname === path) return portal;
  }
  return null;
}

const LOGIN_PATHS = new Set([COMPANY_LOGIN, "/member/login", "/founder/login", "/admin/login", "/club-owner/login", "/partner/login"]);

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/_next")) return true;
  if (/\.[a-z0-9]+$/i.test(pathname)) return true;
  if (pathname === "/member" || pathname === "/member/") return true;
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/api/admin/login") || pathname.startsWith("/api/admin/logout")) return true;
  if (pathname === "/onboard" || pathname === "/onboard/") return true;
  return LOGIN_PATHS.has(pathname) || isCompanyAuthPath(pathname) || pathname === "/member/join";
}

function isFastPublicPath(pathname: string): boolean {
  return (
    pathname === "/portals" ||
    pathname === "/member/join" ||
    pathname === "/member" ||
    pathname === "/member/" ||
    LOGIN_PATHS.has(pathname) ||
    isCompanyAuthPath(pathname) ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout")
  );
}

/** Cookie-only redirect when already signed in to the right portal (no Supabase round-trip). */
function loginRedirectFromCookies(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;
  if (!LOGIN_PATHS.has(pathname) && !isCompanyAuthPath(pathname)) return null;

  const founderPasswordSession = isFounderPasswordSessionFromRequest(request);
  if (founderPasswordSession && (isCompanyAuthPath(pathname) || pathname === "/founder/login")) {
    const url = request.nextUrl.clone();
    url.pathname = homeForRole("founder");
    url.searchParams.delete("next");
    const redirect = NextResponse.redirect(url);
    applyRoleCookies(redirect, FOUNDER_PASSWORD_UID, "founder");
    return redirect;
  }

  const uid = request.cookies.get("bb_uid")?.value;
  const roleRaw = request.cookies.get("bb_role")?.value;
  if (!uid || !roleRaw) return null;

  const role = normalizeRole(roleRaw);

  if (isCompanyAuthPath(pathname)) {
    const url = request.nextUrl.clone();
    if (!canUseCompanyPortal(role)) {
      url.pathname = MEMBER_LOGIN;
      url.searchParams.set("notice", "member_not_company");
    } else {
      url.pathname = homeForRole(role);
      url.searchParams.delete("next");
    }
    url.searchParams.delete("error");
    url.searchParams.delete("from");
    const redirect = NextResponse.redirect(url);
    applyRoleCookies(redirect, uid, role);
    return redirect;
  }

  const loginPortal = portalFromLoginPath(pathname);
  if (loginPortal && canAccessPortal(role, loginPortal)) {
    const url = request.nextUrl.clone();
    url.pathname = homeForRole(role);
    url.searchParams.delete("next");
    url.searchParams.delete("error");
    url.searchParams.delete("from");
    const redirect = NextResponse.redirect(url);
    applyRoleCookies(redirect, uid, role);
    return redirect;
  }

  return null;
}

async function resolveRole(
  request: NextRequest,
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  email?: string
): Promise<UserRole> {
  const cached = roleFromRequestCookies(request, userId);
  if (cached) return cached;

  const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  const role = data?.role
    ? normalizeRole(data.role as string)
    : email
      ? roleFromEmailAddress(email) ?? "member"
      : "member";

  return role;
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (isPublicPath(pathname) || pathname === "/portals") {
      return NextResponse.next({ request });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/portals";
    url.searchParams.set("notice", "missing_env");
    return NextResponse.redirect(url);
  }

  if (isFastPublicPath(pathname)) {
    const cookieRedirect = loginRedirectFromCookies(request);
    if (cookieRedirect) return cookieRedirect;
    return NextResponse.next({ request });
  }

  const founderPasswordSession = isFounderPasswordSessionFromRequest(request);

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && (isCompanyAuthPath(pathname) || LOGIN_PATHS.has(pathname))) {
    const role = await resolveRole(request, supabase, user.id, user.email);
    if (isCompanyAuthPath(pathname)) {
      const url = request.nextUrl.clone();
      if (!canUseCompanyPortal(role)) {
        url.pathname = MEMBER_LOGIN;
        url.searchParams.set("notice", "member_not_company");
      } else {
        url.pathname = homeForRole(role);
        url.searchParams.delete("next");
      }
      const redirect = NextResponse.redirect(url);
      applyRoleCookies(redirect, user.id, role);
      return redirect;
    }
    const loginPortal = portalFromLoginPath(pathname);
    if (loginPortal && canAccessPortal(role, loginPortal)) {
      const url = request.nextUrl.clone();
      url.pathname = homeForRole(role);
      url.searchParams.delete("next");
      const redirect = NextResponse.redirect(url);
      applyRoleCookies(redirect, user.id, role);
      return redirect;
    }
    /* Legacy per-portal login URLs — send to company login. */
    if (LOGIN_PATHS.has(pathname) && pathname !== COMPANY_LOGIN) {
      const url = request.nextUrl.clone();
      url.pathname = COMPANY_LOGIN;
      return NextResponse.redirect(url);
    }
  }

  if (isPublicPath(pathname)) {
    return supabaseResponse;
  }

  const portal = portalFromPath(pathname);
  if (!portal) {
    return supabaseResponse;
  }

  if (!user) {
    if (portal === "founder" && founderPasswordSession) {
      applyRoleCookies(supabaseResponse, FOUNDER_PASSWORD_UID, "founder");
      return supabaseResponse;
    }
    const url = request.nextUrl.clone();
    url.pathname = portal === "member" ? MEMBER_LOGIN : COMPANY_LOGIN;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const role = await resolveRole(request, supabase, user.id, user.email);

  if (!canAccessPortal(role, portal)) {
    /* Founder dashboard password still grants founder portal while QA preview has a member session. */
    if (portal === "founder" && founderPasswordSession) {
      applyRoleCookies(supabaseResponse, FOUNDER_PASSWORD_UID, "founder");
      return supabaseResponse;
    }
    return redirectWrongPortal(request, role, portal, user.id);
  }

  const cached = roleFromRequestCookies(request, user.id);
  if (!cached || cached !== role) {
    applyRoleCookies(supabaseResponse, user.id, role);
  }

  return supabaseResponse;
}
