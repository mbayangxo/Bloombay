"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getPaymentSettings, savePaymentSettings, logAudit } from "@/lib/club-owner-store";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubOwnerPaymentsPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [settings, setSettings] = useState(() => getPaymentSettings(clubId));

  function connect() {
    const next = { stripeConnected: true, payoutsEnabled: true };
    savePaymentSettings(clubId, next);
    setSettings(next);
    logAudit(clubId, "Connected Stripe (demo)");
  }

  return (
    <ClubOwnerShell title="Payments" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Payments"
        sub="Connect Stripe for join fees, subscriptions, and paid gatherings. Prototype mode — no real charges."
      />
      <div className="co-card" style={{ maxWidth: 480 }}>
        <strong>{settings.stripeConnected ? "Stripe connected ✓" : "Stripe not connected"}</strong>
        <p style={{ marginTop: "0.5rem" }}>
          Payouts: {settings.payoutsEnabled ? "Enabled" : "Disabled"}
        </p>
        {!settings.stripeConnected ? (
          <button type="button" className="co-btn co-btn--primary" style={{ marginTop: "1rem" }} onClick={connect}>
            Connect Stripe
          </button>
        ) : (
          <p className="co-hint" style={{ marginTop: "0.75rem" }}>
            Revenue totals appear in Analytics. Pair with Join & paywall for pricing.
          </p>
        )}
      </div>
    </ClubOwnerShell>
  );
}
