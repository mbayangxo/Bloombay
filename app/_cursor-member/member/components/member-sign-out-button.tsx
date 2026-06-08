"use client";

import { useState } from "react";
import { signOutMember } from "@/lib/auth/member-sign-out";

type Variant = "row" | "button" | "sidebar" | "bottom-nav";

export function MemberSignOutButton({
  variant = "row",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);

  function handleSignOut() {
    if (busy) return;
    setBusy(true);
    void signOutMember();
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        className={`mp-btn mp-btn--outline mp-sign-out-btn ${className}`.trim()}
        onClick={handleSignOut}
        disabled={busy}
      >
        {busy ? "Signing out…" : "Sign out"}
      </button>
    );
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        className={`mp-sidebar__link mp-sidebar__link--sub mp-sidebar__link--signout ${className}`.trim()}
        onClick={handleSignOut}
        disabled={busy}
        aria-label={busy ? "Signing out" : "Sign out"}
        title={busy ? "Signing out" : "Sign out"}
      >
        <span className="mp-sidebar__link-icon" aria-hidden>
          <svg className="mp-sidebar__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="mp-sidebar__tip" aria-hidden>
          {busy ? "Signing out…" : "Sign out"}
        </span>
      </button>
    );
  }

  if (variant === "bottom-nav") {
    return (
      <button
        type="button"
        className={`mp-bottom-nav__signout ${className}`.trim()}
        onClick={handleSignOut}
        disabled={busy}
        aria-label="Sign out of BloomBay"
      >
        <span className="mp-bottom-nav__signout-label">{busy ? "Signing out…" : "Sign out"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`mp-settings-row mp-settings-row--signout ${className}`.trim()}
      onClick={handleSignOut}
      disabled={busy}
    >
      Sign out
      <span aria-hidden>{busy ? "…" : "→"}</span>
    </button>
  );
}
