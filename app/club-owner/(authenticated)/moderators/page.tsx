"use client";

import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { ModeratorsPanel } from "../components/moderators-panel";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubOwnerModeratorsPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);

  return (
    <ClubOwnerShell title="Moderators" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Moderators"
        sub="Give trusted members access to applications, zones, gatherings, scan, and Bloom ping."
      />
      <ModeratorsPanel clubId={clubId} />
    </ClubOwnerShell>
  );
}
