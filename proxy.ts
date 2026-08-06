import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  canAccessPortal,
  normalizeRole,
  portalFromPath,
  type UserRole,
} from "@/lib/auth/roles";

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Every redirect below MUST carry over any refreshed session cookies —
  // otherwise a just-rotated Supabase refresh token gets silently dropped
  // on nearly every navigation (redirects are extremely common here: login
  // pages, onboarding, host-desk gating, wrong-portal), the browser keeps
  // presenting the now-stale token, and the next refresh attempt fails,
  // forcing a real logout. That's what was happening.
  function redirect(url: URL): NextResponse {
    const res = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((c) => res.cookies.set(c.name, c.value));
    return res;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
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

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // ── Legacy route redirects ─────────────────────────────────────────────────
  const oldToNew: Record<string, string> = {
    "/home": "/member/home",
    "/city": "/member/happenings",
    "/clubs": "/member/clubs",
    "/lounge": "/member/lounge",
  };
  if (oldToNew[pathname]) {
    return redirect(new URL(oldToNew[pathname], request.url));
  }

  // ── GirlMate auth gates ───────────────────────────────────────────────────
  const GM_PROTECTED = ["/girlmate/home", "/girlmate/post", "/girlmate/inbox", "/girlmate/partner/dashboard"];
  const GM_AUTH_PAGES = ["/girlmate/login", "/girlmate/signup"];
  const isGMProtected = GM_PROTECTED.some(p => pathname.startsWith(p));
  const isGMAuthPage  = GM_AUTH_PAGES.some(p => pathname === p);

  if (isGMProtected && !user) {
    const redirectTo = encodeURIComponent(pathname);
    return redirect(new URL(`/girlmate/login?redirect=${redirectTo}`, request.url));
  }
  if (user && isGMAuthPage) {
    return redirect(new URL("/girlmate/home", request.url));
  }

  const PROTECTED = ["/member", "/admin", "/founder", "/club-owner", "/partner", "/curator"];
  const isProtected = PROTECTED.some(p => pathname.startsWith(p));

  const isLoginPath =
    pathname === "/member/login" ||
    pathname === "/admin/login" ||
    pathname === "/club-owner/login" ||
    pathname === "/partner/login" ||
    pathname === "/curator/login" ||
    pathname === "/founder/login";

  // ── Unauthenticated → redirect to login ───────────────────────────────────
  if (isProtected && !isLoginPath && !user) {
    let loginPath = "/member/login";
    if (pathname.startsWith("/admin"))      loginPath = "/admin/login";
    else if (pathname.startsWith("/club-owner")) loginPath = "/club-owner/login";
    else if (pathname.startsWith("/partner"))    loginPath = "/partner/login";
    else if (pathname.startsWith("/curator"))    loginPath = "/curator/login";
    else if (pathname.startsWith("/founder"))    loginPath = "/founder/login";
    const redirectTo = encodeURIComponent(pathname);
    return redirect(new URL(`${loginPath}?redirect=${redirectTo}`, request.url));
  }

  // ── Authenticated on login page ───────────────────────────────────────────
  // /member/login is the one door everyone (any role) can use for the member app.
  if (user && isLoginPath) {
    if (pathname === "/member/login") {
      return redirect(new URL("/member/home", request.url));
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = normalizeRole(profile?.role as string | undefined);
    const homes: Record<string, string> = {
      founder:    "/founder/dashboard",
      admin:      "/admin/dashboard",
      club_owner: "/club-owner/dashboard",
      partner:    "/partner/dashboard",
      curator:    "/curator/dashboard",
    };
    if (pathname.startsWith("/founder") && role === "founder") {
      return redirect(new URL("/founder/dashboard", request.url));
    }
    if (pathname.startsWith("/club-owner") && (role === "club_owner" || role === "founder")) {
      return redirect(new URL("/club-owner/dashboard", request.url));
    }
    return redirect(
      new URL(homes[role] ?? "/member/home", request.url)
    );
  }

  // ── Member portal: onboarding (staff keep member access) ──────────────────
  if (user && pathname.startsWith("/member") &&
      !pathname.startsWith("/member/login")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed, role, first_name, is_host")
      .eq("id", user.id)
      .single();

    if (profile && !profile.onboarding_completed) {
      if (profile.first_name?.trim()) {
        await supabase
          .from("profiles")
          .update({ onboarding_completed: true })
          .eq("id", user.id);
      } else {
        return redirect(new URL("/onboard?resume=1", request.url));
      }
    }

    // Host desk — only hosts (or staff who host). Become-host is the exception.
    if (
      pathname.startsWith("/member/host") &&
      !pathname.startsWith("/member/host/become")
    ) {
      const role = normalizeRole(profile?.role as string | undefined);
      const isStaffHost =
        role === "founder" || role === "club_owner" || role === "admin";
      let allowed = !!(profile as { is_host?: boolean } | null)?.is_host || isStaffHost;
      if (!allowed) {
        const { count } = await supabase
          .from("gatherings")
          .select("id", { count: "exact", head: true })
          .eq("host_id", user.id);
        allowed = (count ?? 0) > 0;
        if (allowed) {
          await supabase.from("profiles").update({ is_host: true }).eq("id", user.id);
        }
      }
      if (!allowed) {
        return redirect(new URL("/member/host/become", request.url));
      }
    }
  }

  // ── Work portals: role entitlement (not just “logged in”) ─────────────────
  if (user) {
    const portal = portalFromPath(pathname);
    if (portal && portal !== "member" && !isLoginPath) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      const role = normalizeRole(profile?.role as string | undefined) as UserRole;

      let allowed = canAccessPortal(role, portal);

      // Club Mama: ownership grants access even if role is still member
      if (!allowed && portal === "club_owner") {
        const { data: club } = await supabase
          .from("clubs")
          .select("id")
          .eq("owner_id", user.id)
          .limit(1)
          .maybeSingle();
        allowed = !!club;
      }

      if (!allowed) {
        return redirect(
          new URL(`/member/home?notice=portal_denied&tried=${portal}`, request.url),
        );
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|ico|webp)$).*)",
  ],
};
