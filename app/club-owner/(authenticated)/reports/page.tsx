"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";

type ApiMember = {
  name: string;
  neighborhood: string;
  joined_at: string | null;
  joined_label: string;
};

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

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
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function exportMembers() {
    setExporting(true);
    setError(null);
    try {
      const res = await fetch("/api/club-portal/members");
      if (!res.ok) throw new Error("Couldn't load your roster.");
      const members = (await res.json()) as ApiMember[];
      const header = "name,neighborhood,joined_at";
      const body = members
        .map((m) => [m.name, m.neighborhood, m.joined_at ?? ""].map((c) => csvEscape(String(c ?? ""))).join(","))
        .join("\n");
      download(`${clubId}-members.csv`, `${header}\n${body}`);
    } catch {
      setError("Couldn't export your roster right now. Try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <ClubOwnerShell title="Reports" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Reports"
        sub="Export member roster for your records."
      />
      <div className="co-hub-grid" style={{ maxWidth: 520 }}>
        <button type="button" className="co-hub-card co-hub-card--hot" onClick={exportMembers} disabled={exporting}>
          <strong>{exporting ? "Exporting…" : "Women CSV"}</strong>
          <p>Your real roster, pulled live</p>
        </button>
        <div className="co-hub-card" style={{ opacity: 0.6 }}>
          <strong>Revenue CSV</strong>
          <p>Not built yet — there&apos;s no real revenue ledger behind club finances yet, so this export isn&apos;t offered rather than showing invented numbers.</p>
        </div>
      </div>
      {error ? <p className="co-hint" style={{ color: "#c0264a", marginTop: "0.75rem" }}>{error}</p> : null}
    </ClubOwnerShell>
  );
}
