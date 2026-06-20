import { clearPortalSession } from "@/lib/auth/portal-sign-out";
import { MEMBER_LOGIN } from "@/lib/auth/roles";

/** Clears Supabase session, role cookies, and local member demo state. */
export async function clearMemberSession(): Promise<void> {
  await clearPortalSession();
}

/** Full sign-out with redirect to member login. */
export async function signOutMember(): Promise<void> {
  await clearMemberSession();
  window.location.assign(MEMBER_LOGIN);
}
