"use client";

import { useState } from "react";
import { signOutCompanyPortal } from "@/lib/auth/portal-sign-out";
import type { PortalId } from "@/lib/auth/roles";

export function PortalSignOutButton({
  portal: _portal,
  className = "bb-portal-signout",
  label = "Sign out",
}: {
  /** Kept for call-site clarity; all portals share company sign-in. */
  portal: PortalId;
  className?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);

  function handleSignOut() {
    setBusy(true);
    void signOutCompanyPortal();
  }

  return (
    <button type="button" className={className} onClick={handleSignOut} disabled={busy}>
      {busy ? "Signing out…" : label}
    </button>
  );
}
