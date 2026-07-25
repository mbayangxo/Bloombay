"use client";

import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { StripeConnectCard } from "@/app/components/portal/stripe-connect-card";

export default function ClubOwnerPaymentsPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);

  return (
    <ClubOwnerShell title="Payments" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Payments"
        sub="Connect your bank via Stripe so join fees and paid gatherings pay you — not a mystery account."
      />
      <div style={{ maxWidth: 520 }}>
        <StripeConnectCard returnPath="/club-owner/payments" />
      </div>
    </ClubOwnerShell>
  );
}
