import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { profileFromAuthUser } from "@/lib/auth/profile-from-metadata";
import { upsertProfileRow } from "@/lib/auth/upsert-profile";
import { applyRoleCookies } from "@/lib/auth/role-cookie";
import { homeAfterCompanyLogin } from "@/lib/auth/redirect";
import { normalizeRole, roleFromEmailAddress, COMPANY_LOGIN } from "@/lib/auth/roles";
import { getAdminClient } from "@/lib/supabase-admin";
import { sendMemberWelcome } from "@/lib/welcome/send-member-welcome";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/member/home";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const fields = profileFromAuthUser(user);
        await upsertProfileRow(getAdminClient(), user.id, fields);

        if (user.email) {
          void sendMemberWelcome({
            userId: user.id,
            email: user.email,
            fullName: fields.full_name ?? user.email.split("@")[0],
            phone: fields.phone ?? undefined,
            city: fields.city ?? undefined,
            neighborhood: fields.neighborhood ?? undefined,
          });
        }

        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        const role = data?.role
          ? normalizeRole(data.role as string)
          : roleFromEmailAddress(user.email ?? "") ?? "member";
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocal = process.env.NODE_ENV === "development";
        const base = isLocal ? origin : `https://${forwardedHost}`;
        const redirect = NextResponse.redirect(`${base}${homeAfterCompanyLogin(role, next)}`);
        applyRoleCookies(redirect, user.id, role);
        return redirect;
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}${COMPANY_LOGIN}?error=auth`);
}
