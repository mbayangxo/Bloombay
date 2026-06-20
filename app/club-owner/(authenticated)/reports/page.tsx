"use client";

import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { exportMembersCsv, exportRevenueCsv } from "@/lib/club-owner-store";
import { getClubProfile } from "@/lib/club-world-data";

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ClubOwnerReportsPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);

  return (
    <ClubOwnerShell title="Reports" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Reports"
        sub="Export member roster and revenue summary for your records."
      />
      <div className="co-hub-grid" style={{ maxWidth: 520 }}>
        <button type="button" className="co-hub-card co-hub-card--hot" onClick={() => download(`${clubId}-members.csv`, exportMembersCsv(clubId))}>
          <strong>Women CSV</strong>
          <p>Full roster with status</p>
        </button>
        <button type="button" className="co-hub-card co-hub-card--barbie" onClick={() => download(`${clubId}-revenue.csv`, exportRevenueCsv(clubId))}>
          <strong>Revenue CSV</strong>
          <p>MTD by source</p>
        </button>
      </div>
    </ClubOwnerShell>
  );
}
