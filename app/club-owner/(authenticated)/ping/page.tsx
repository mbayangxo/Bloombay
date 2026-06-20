"use client";

import { ClubOwnerShell } from "../components/club-owner-shell";
import { BloomPingPanel } from "../components/bloom-ping-panel";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubOwnerPingPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);

  return (
    <ClubOwnerShell title="Bloom ping" backHref="/club-owner/dashboard">
      <header className="co-page-head">
        <p className="co-page-head__eyebrow">{club?.name}</p>
        <h1 className="co-page-head__title">Bloom ping</h1>
        <p className="co-page-head__sub">
          One message to every member in {club?.name ?? "your club"} — instantly.
        </p>
      </header>
      <BloomPingPanel clubId={clubId} memberCount={club?.members ?? 200} />
    </ClubOwnerShell>
  );
}
