"use client";

import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { ClubPlannerPanel } from "@/app/components/events/club-planner-panel";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubOwnerPlannerRoomPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);

  return (
    <ClubOwnerShell title="Planner room" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Planner room"
        sub="Private planning — drafts, ideas, covers, and publish when ready."
      />
      <ClubPlannerPanel clubId={clubId} staffBase="/club-owner" />
    </ClubOwnerShell>
  );
}
