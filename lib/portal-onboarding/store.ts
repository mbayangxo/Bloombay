import type { PortalOnboardingId } from "./types";

const PREFIX = "bb_portal_onboarding_";

function key(portalId: PortalOnboardingId) {
  return `${PREFIX}${portalId}`;
}

export function isPortalOnboardingDone(portalId: PortalOnboardingId): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(key(portalId)) === "done";
}

export function completePortalOnboarding(portalId: PortalOnboardingId) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key(portalId), "done");
}

export function resetPortalOnboarding(portalId: PortalOnboardingId) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key(portalId));
}

/** Re-open tour from settings or help links */
export function shouldForceOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("tour") === "1";
}
