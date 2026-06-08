import { isAdminAuthenticated } from "@/lib/admin-auth-server";
import { getMissionControlRole } from "@/lib/auth/get-mc-role";

export async function requireFounderOrAdmin() {
  if (await isAdminAuthenticated()) {
    return { ok: true as const };
  }

  const role = await getMissionControlRole();
  if (role === "founder" || role === "admin") {
    return { ok: true as const };
  }

  return { ok: false as const, error: "Founder or admin access required" };
}
