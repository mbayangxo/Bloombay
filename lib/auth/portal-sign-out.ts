import { clearRoleCookiesClient } from "@/lib/auth/role-cookie";
import { COMPANY_LOGIN, type PortalId } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/browser";

/** Clears every portal session (server cookies + client Supabase + demo state). */
export async function clearPortalSession(): Promise<void> {
  try {
    await fetch("/api/auth/sign-out", { method: "POST", credentials: "same-origin" });
  } catch {
    /* offline */
  }

  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    /* missing env */
  }

  clearRoleCookiesClient();
  if (typeof document !== "undefined") {
    document.cookie = "bb_dev_role=; path=/; max-age=0";
  }

  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem("gf_name");
    sessionStorage.removeItem("gf_email");
  }
}

/** Sign out and land on the BloomBay company login. */
export async function signOutCompanyPortal(): Promise<void> {
  await clearPortalSession();
  window.location.assign(COMPANY_LOGIN);
}

/** @deprecated Use signOutCompanyPortal — all portals share /login. */
export async function signOutToPortalLogin(_portal: PortalId): Promise<void> {
  await signOutCompanyPortal();
}
