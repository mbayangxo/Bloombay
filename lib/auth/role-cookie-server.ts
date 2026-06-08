import { cookies } from "next/headers";
import { normalizeRole, type UserRole } from "@/lib/auth/roles";
import { ROLE_COOKIE, UID_COOKIE } from "@/lib/auth/role-cookie";

export async function roleFromServerCookies(userId: string): Promise<UserRole | null> {
  const jar = await cookies();
  const uid = jar.get(UID_COOKIE)?.value;
  const role = jar.get(ROLE_COOKIE)?.value;
  if (uid !== userId || !role) return null;
  return normalizeRole(role);
}

export async function devRoleFromServerCookie(): Promise<UserRole | null> {
  if (process.env.NODE_ENV !== "development") return null;
  const jar = await cookies();
  const dev = jar.get("bb_dev_role")?.value;
  return dev ? normalizeRole(dev) : null;
}
