"use client";

import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { listAuditLog } from "@/lib/club-owner-store";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubOwnerAuditPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const entries = listAuditLog(clubId);

  return (
    <ClubOwnerShell title="Audit" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Audit log"
        sub="Moderators and hosts — who approved, denied, blocked, or changed settings."
      />
      <ul className="co-app-list">
        {entries.length === 0 ? (
          <li className="co-hint">Actions will appear here as you run the club.</li>
        ) : (
          entries.map((e) => (
            <li key={e.id} className="co-app-card">
              <strong>{e.action}</strong>
              {e.target ? <p className="co-app-card__meta">{e.target}</p> : null}
              <p className="co-hint">
                {e.actor} · {new Date(e.createdAt).toLocaleString()}
              </p>
            </li>
          ))
        )}
      </ul>
    </ClubOwnerShell>
  );
}
