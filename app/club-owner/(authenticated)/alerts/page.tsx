"use client";

import Link from "next/link";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getHealthAlerts } from "@/lib/club-owner-store";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubOwnerAlertsPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const alerts = getHealthAlerts(clubId);

  return (
    <ClubOwnerShell title="Alerts" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Health alerts"
        sub="Automated nudges when activity or retention needs your attention."
      />
      <ul className="co-app-list">
        {alerts.map((a) => (
          <li key={a.id} className={`co-app-card co-alert--${a.level}`}>
            <p>{a.message}</p>
            {a.href ? (
              <Link href={a.href} className="co-link" style={{ marginTop: "0.5rem", display: "inline-block" }}>
                {a.action ?? "View →"}
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </ClubOwnerShell>
  );
}
