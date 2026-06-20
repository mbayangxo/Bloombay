import { cookies } from "next/headers";
import { ADMIN_COOKIE, isFounderPasswordSession } from "@/lib/admin-auth";

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return isFounderPasswordSession(jar.get(ADMIN_COOKIE)?.value);
}
