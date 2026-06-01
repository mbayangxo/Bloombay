import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
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
  const { pathname } = request.nextUrl;

  // Redirect old routes to new member routes
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

  const isProtected =
    pathname.startsWith("/member") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/club-owner") ||
    pathname.startsWith("/partner");

  if (isProtected && !user) {
    // Redirect to appropriate login
    let loginPath = "/member/login";
    if (pathname.startsWith("/admin")) loginPath = "/admin/login";
    else if (pathname.startsWith("/club-owner")) loginPath = "/club-owner/login";
    else if (pathname.startsWith("/partner")) loginPath = "/partner/login";
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  if (
    user &&
    (pathname === "/member/login" ||
      pathname === "/admin/login" ||
      pathname === "/club-owner/login" ||
      pathname === "/partner/login")
  ) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = profile?.role ?? "member";
    const homes: Record<string, string> = {
      founder: "/admin/dashboard",
      admin: "/admin/dashboard",
      club_owner: "/club-owner/dashboard",
      partner: "/partner/dashboard",
    };
    return NextResponse.redirect(
      new URL(homes[role] ?? "/member/home", request.url)
    );
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|ico|webp)$).*)",
  ],
};
