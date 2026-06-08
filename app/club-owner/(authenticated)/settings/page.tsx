"use client";

import { ClubOwnerShell } from "../components/club-owner-shell";
import { JoinSettingsForm } from "../components/join-settings-form";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { CLUBS } from "@/app/member/clubs/club-data";

export default function ClubOwnerSettingsPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId) ?? CLUBS[0];

  return (
    <ClubOwnerShell title="Join settings" backHref="/club-owner/dashboard">
      <header className="co-page-head">
        <p className="co-page-head__eyebrow">{club.name}</p>
        <h1 className="co-page-head__title">Join & paywall</h1>
        <p className="co-page-head__sub">
          Control open vs request-to-join, auto-approve, free vs paid, and when members pay.
        </p>
      </header>
      <JoinSettingsForm clubId={club.id} clubName={club.name} />
    </ClubOwnerShell>
  );
}
