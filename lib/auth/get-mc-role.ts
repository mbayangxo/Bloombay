import { getAuthUser } from "@/lib/auth/get-user";
import { normalizeRole, type UserRole } from "@/lib/auth/roles";

/** Resolve mission-control role from Supabase session + profiles.role only. */
export async function getMissionControlRole(): Promise<UserRole | null> {
  const user = await getAuthUser();
  if (!user) return null;
  return normalizeRole(user.role);
}
