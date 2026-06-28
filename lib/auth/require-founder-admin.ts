import { getAuthUser } from "@/lib/auth/get-user";
import { getMissionControlRole } from "@/lib/auth/get-mc-role";
import type { UserRole } from "@/lib/auth/roles";

type Ok = { ok: true; userId: string; role: UserRole };
type Fail = { ok: false; error: string };

/** Server-component / route helper — Supabase session + profiles.role only. */
export async function requireFounderOrAdmin(): Promise<Ok | Fail> {
  const user = await getAuthUser();
  if (!user) {
    return { ok: false, error: "Sign in required" };
  }

  const role = await getMissionControlRole();
  if (role === "founder" || role === "admin") {
    return { ok: true, userId: user.id, role };
  }

  return { ok: false, error: "Founder or admin access required" };
}
