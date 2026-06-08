"use client";

import { Suspense } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ApplicationsPanel } from "../components/applications-panel";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";

function ApplicationsContent() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);

  return (
    <ClubOwnerShell title="Applications" backHref="/club-owner/dashboard">
      <header className="co-page-head">
        <p className="co-page-head__eyebrow">{club?.name}</p>
        <h1 className="co-page-head__title">Applications</h1>
        <p className="co-page-head__sub">
          Review requests for {club?.name ?? "your club"}. Accept to grant access; deny to decline.
        </p>
      </header>
      <ApplicationsPanel clubId={clubId} />
    </ClubOwnerShell>
  );
}

export default function ClubOwnerApplicationsPage() {
  return (
    <Suspense fallback={<div className="co-hint" style={{ padding: "1.5rem" }}>Loading applications…</div>}>
      <ApplicationsContent />
    </Suspense>
  );
}
