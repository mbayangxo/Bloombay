import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_PORTAL: Record<string, string> = {
  founder:    "/founder",
  admin:      "/admin",
  club_owner: "/club-owner",
  partner:    "/partner",
  curator:    "/curator",
};

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

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
    "/member/you": "/member/lounge",
  };
  if (oldToNew[pathname]) {
    return NextResponse.redirect(new URL(oldToNew[pathname], request.url));
  }

  // ── GirlMate auth gates ───────────────────────────────────────────────────
  const GM_PROTECTED = ["/girlmate/home", "/girlmate/post", "/girlmate/inbox", "/girlmate/partner/dashboard"];
  const GM_AUTH_PAGES = ["/girlmate/login", "/girlmate/signup"];
  const isGMProtected = GM_PROTECTED.some(p => pathname.startsWith(p));
  const isGMAuthPage  = GM_AUTH_PAGES.some(p => pathname === p);

  if (isGMProtected && !user) {
    const redirectTo = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/girlmate/login?redirect=${redirectTo}`, request.url));
  }
  if (user && isGMAuthPage) {
    return NextResponse.redirect(new URL("/girlmate/home", request.url));
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
    return NextResponse.redirect(new URL(`${loginPath}?redirect=${redirectTo}`, request.url));
  }

  // ── Authenticated user on login page → redirect to their portal ───────────
  if (user && isLoginPath) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = profile?.role ?? "member";
    const homes: Record<string, string> = {
      founder:    "/founder/dashboard",
      admin:      "/admin/dashboard",
      club_owner: "/club-owner/dashboard",
      partner:    "/partner/dashboard",
      curator:    "/curator/dashboard",
    };
    return NextResponse.redirect(
      new URL(homes[role] ?? "/member/home", request.url)
    );
  }

  // ── Member portal: onboarding gate + role mismatch ────────────────────────
  if (user && pathname.startsWith("/member") &&
      !pathname.startsWith("/member/onboard") &&
      !pathname.startsWith("/member/login")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed, role")
      .eq("id", user.id)
      .single();

    if (profile && !profile.onboarding_completed) {
      return NextResponse.redirect(new URL("/member/onboard", request.url));
    }

    const role = profile?.role as string | undefined;
    if (role && ROLE_PORTAL[role] && !pathname.startsWith(ROLE_PORTAL[role])) {
      return NextResponse.redirect(new URL(`${ROLE_PORTAL[role]}/dashboard`, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|ico|webp)$).*)",
  ],
};
