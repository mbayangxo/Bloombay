"use client";

import Link from "next/link";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId, setHostClubId } from "@/lib/club-host-store";
import { listHostClubs } from "@/lib/club-owner-store";

export default function ClubOwnerClubsPage() {
  const activeId = getHostClubId();
  const clubs = listHostClubs();

  return (
    <ClubOwnerShell title="My clubs" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle title="My clubs" sub="Switch which club you're managing. Settings and data are per club." />
      <ul className="co-app-list">
        {clubs.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={`co-application-row${activeId === c.id ? " co-application-row--selected" : ""}`}
              style={{ width: "100%" }}
              onClick={() => {
                setHostClubId(c.id);
                window.location.href = "/club-owner/dashboard";
              }}
            >
              <span className="co-application-row__body">
                <strong>{c.name}</strong>
                <span className="co-application-row__meta">{c.members.toLocaleString()} members</span>
              </span>
              {activeId === c.id ? <span className="co-badge co-badge--approved">Active</span> : null}
            </button>
          </li>
        ))}
      </ul>
      <p className="co-hint" style={{ marginTop: "1rem" }}>
        <Link href="/club-owner/dashboard" className="co-link">
          ← Back to dashboard
        </Link>
      </p>
    </ClubOwnerShell>
  );
}
