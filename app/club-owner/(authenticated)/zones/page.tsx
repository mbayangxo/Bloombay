"use client";

import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { ZoneRequestsPanel } from "../components/zone-requests-panel";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubOwnerZonesPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);

  return (
    <ClubOwnerShell title="Zones" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Zone requests"
        sub="Women ask to open a new chapter or space. You approve before it goes live."
      />
      <ZoneRequestsPanel clubId={clubId} />
    </ClubOwnerShell>
  );
}
