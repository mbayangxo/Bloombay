import type { PortalOnboardingId } from "@/lib/portal-onboarding/types";

/** Append ?tour=1 to reopen the illustrated portal onboarding. */
export function portalTourHref(portal: PortalOnboardingId): string {
  const bases: Record<PortalOnboardingId, string> = {
    partner: "/partner",
    club_owner: "/club-owner/dashboard",
    founder: "/founder/dashboard",
    admin: "/admin/dashboard",
    curator: "/curator/dashboard",
  };
  return `${bases[portal]}?tour=1`;
}
