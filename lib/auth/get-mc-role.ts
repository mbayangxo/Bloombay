import { createClient } from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin-auth-server";
import { devRoleFromServerCookie } from "@/lib/auth/role-cookie-server";
import { normalizeRole, roleFromEmailAddress, type UserRole } from "@/lib/auth/roles";

/** Mission Control role from Supabase session + profiles (no bb_role cookie trust). */
export async function getMissionControlRole(): Promise<UserRole | null> {
  if (await isAdminAuthenticated()) return "founder";

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const devOverride = await devRoleFromServerCookie();
  if (devOverride) return devOverride;

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (data?.role) return normalizeRole(data.role as string);
  if (user.email) return roleFromEmailAddress(user.email);
  return "member";
}
