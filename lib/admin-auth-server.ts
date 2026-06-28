import { getMissionControlRole } from "@/lib/auth/get-mc-role";

/** @deprecated Use getMissionControlRole() or requireAdmin() — password sessions are disabled. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const role = await getMissionControlRole();
  return role === "admin" || role === "founder";
}
