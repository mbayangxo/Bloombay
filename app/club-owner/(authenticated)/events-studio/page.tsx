"use client";

import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { ClubCommandCenter } from "@/app/components/events/club-command-center";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubOwnerEventsStudioPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);

  return (
    <ClubOwnerShell title="Events studio" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Events studio"
        sub="Covers, calendar, push live to Happenings, monthly manager notes, and saved ideas for your club."
      />
      <ClubCommandCenter clubId={clubId} staffBase="/club-owner" defaultTab="events" />
    </ClubOwnerShell>
  );
}
