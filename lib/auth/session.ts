import { createClient } from "@/lib/supabase/browser";
import { homeAfterCompanyLogin, safePathAfterLogin } from "@/lib/auth/redirect";
import { canUseCompanyPortal } from "@/lib/auth/company-portal";
import { COMPANY_LOGIN, MEMBER_LOGIN } from "@/lib/auth/roles";
import {
  clearRoleCookiesClient,
  roleFromClientCookie,
  setRoleCookiesClient,
} from "@/lib/auth/role-cookie";
import {
  normalizeRole,
  roleFromEmailAddress,
  type PortalId,
  type UserRole,
} from "@/lib/auth/roles";

export async function fetchUserRole(): Promise<UserRole | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const cached = roleFromClientCookie(user.id);
  if (cached) return cached;

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const role = data?.role
    ? normalizeRole(data.role as string)
    : user.email
      ? roleFromEmailAddress(user.email) ?? "member"
      : "member";

  setRoleCookiesClient(user.id, role);
  return role;
}

async function signInFounderWithDashboardPassword(password: string): Promise<boolean> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.ok;
}

export async function signInAndRedirect(
  email: string,
  password: string,
  portal: PortalId,
  fallbackNext?: string
) {
  const supabase = createClient();

  if (portal === "founder" && (await signInFounderWithDashboardPassword(password))) {
    await supabase.auth.signOut();
    setRoleCookiesClient("bb-founder-password", "founder");
    const next =
      fallbackNext && fallbackNext.startsWith("/founder") ? fallbackNext : "/founder/dashboard";
    window.location.href = next;
    return;
  }

  if (portal === "founder" && !email.trim()) {
    throw new Error(
      "Enter founder@bloombay.app (Supabase password), or set ADMIN_PASSWORD in .env.local and use that as the password."
    );
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (portal === "founder") {
      throw new Error(
        "Founder sign-in failed. Use founder@bloombay.app with your Supabase password, or set ADMIN_PASSWORD in .env.local and sign in with that password (email optional)."
      );
    }
    throw error;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign-in succeeded but no session.");

  const role = (await fetchUserRole()) ?? "member";
  if (portal === "member" && role !== "member") {
    await supabase.auth.signOut();
    clearRoleCookiesClient();
    throw new Error(`This is a ${role} account. Use company sign-in at ${COMPANY_LOGIN}.`);
  }
  setRoleCookiesClient(user.id, role);
  window.location.href = safePathAfterLogin(role, portal, fallbackNext);
}

/**
 * BloomBay company portal — one login; email/profile decides which app opens.
 * No role dropdown; ignores bb_dev_role.
 */
export async function signInCompanyPortal(
  email: string,
  password: string,
  fallbackNext?: string
) {
  if (typeof document !== "undefined") {
    document.cookie = "bb_dev_role=; path=/; max-age=0";
  }

  const supabase = createClient();

  if (!email.trim() && (await signInFounderWithDashboardPassword(password))) {
    await supabase.auth.signOut();
    setRoleCookiesClient("bb-founder-password", "founder");
    window.location.href = homeAfterCompanyLogin("founder", fallbackNext);
    return;
  }

  if (!email.trim()) {
    throw new Error("Enter your work email, or use the founder dashboard password from .env.local.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw new Error(
      error.message === "Invalid login credentials"
        ? "Email or password did not match. New here? Use the invite link from your founder to create an account."
        : error.message
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign-in succeeded but no session.");

  const role = (await fetchUserRole()) ?? "member";
  if (!canUseCompanyPortal(role)) {
    await supabase.auth.signOut();
    clearRoleCookiesClient();
    throw new Error(
      `This is a member account. Women in the community sign in at ${MEMBER_LOGIN} — not the company portal.`
    );
  }
  setRoleCookiesClient(user.id, role);
  window.location.href = homeAfterCompanyLogin(role, fallbackNext);
}

export async function signUpCompanyPortal(input: {
  email: string;
  password: string;
  fullName: string;
  inviteRole: UserRole;
}) {
  const supabase = createClient();
  const email = input.email.trim();
  const role = input.inviteRole || roleFromEmailAddress(email) || "club_owner";
  if (!canUseCompanyPortal(role)) {
    throw new Error("Company signup requires a staff invite (Club Mama, partner, operations, etc.).");
  }
  const { error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName.trim(),
        role,
      },
    },
  });

  if (error) throw error;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const role = (await fetchUserRole()) ?? input.inviteRole;
    setRoleCookiesClient(user.id, role);
    window.location.href = homeAfterCompanyLogin(role);
    return;
  }

  window.location.href = `${COMPANY_LOGIN}?notice=confirm_email`;
}
