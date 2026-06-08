"use client";

import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { MembersPanel } from "../components/members-panel";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubOwnerMembersPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);

  return (
    <ClubOwnerShell title="Women" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Women"
        sub="Your clubhouse roster — search, block, remove, export CSV."
      />
      <MembersPanel clubId={clubId} />
    </ClubOwnerShell>
  );
}
