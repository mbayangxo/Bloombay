import { createClient } from "@/lib/supabase/server";
import { homeAfterCompanyLogin } from "@/lib/auth/redirect";
import { normalizeRole, type UserRole } from "@/lib/auth/roles";
import { applyRoleCookies } from "@/lib/auth/role-cookie";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? searchParams.get("redirect");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        const role = normalizeRole(profile?.role as string) as UserRole;
        const dest = homeAfterCompanyLogin(role, next);
        const response = NextResponse.redirect(`${origin}${dest}`);
        applyRoleCookies(response, user.id, role);
        return response;
      }
    }
  }

  return NextResponse.redirect(`${origin}/portals?error=auth`);
}
