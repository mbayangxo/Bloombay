import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Portal prefixes that require a logged-in session
const PROTECTED = ["/member", "/admin", "/founder", "/club-owner", "/partner", "/curator"];

// Role → expected portal prefix (redirect if role doesn't match portal)
const ROLE_PORTAL: Record<string, string> = {
  founder:    "/founder",
  admin:      "/admin",
  club_owner: "/club-owner",
  partner:    "/partner",
  curator:    "/curator",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect portal routes
  const needsAuth = PROTECTED.some(p => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Determine login page based on which portal is being accessed
    const portalPrefix = PROTECTED.find(p => pathname.startsWith(p)) ?? "/member";
    const loginPath = portalPrefix === "/member" ? "/member/login" : `${portalPrefix}/login`;
    const redirectTo = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`${loginPath}?redirect=${redirectTo}`, request.url)
    );
  }

  // Onboarding gate: members who haven't completed onboarding get redirected
  if (pathname.startsWith("/member") && !pathname.startsWith("/member/onboard") && !pathname.startsWith("/member/login")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed, role")
      .eq("id", user.id)
      .single();

    if (profile && !profile.onboarding_completed) {
      return NextResponse.redirect(new URL("/member/onboard", request.url));
    }

    // Role mismatch guard — e.g. admin shouldn't be on /member
    const role = profile?.role as string | undefined;
    if (role && ROLE_PORTAL[role]) {
      const expectedPortal = ROLE_PORTAL[role];
      if (!pathname.startsWith(expectedPortal)) {
        return NextResponse.redirect(new URL(`${expectedPortal}/dashboard`, request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/(member|admin|founder|club-owner|partner|curator)/:path*",
  ],
};
