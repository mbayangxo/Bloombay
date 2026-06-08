"use client";

import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { getEventFinanceSummary, listEventExpenses } from "@/lib/club-operations-store";

export default function ClubOwnerFinancesPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const lines = listEventExpenses(clubId);
  const byEvent = [...new Set(lines.map((l) => l.eventId))];
  const summaries = byEvent.map((id) => ({ id, ...getEventFinanceSummary(clubId, id), title: lines.find((l) => l.eventId === id)?.eventTitle ?? id }));

  return (
    <ClubOwnerShell title="Finances" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Event budgets & expenses"
        sub="Track deposits, sponsorships, expenses, revenue, and profit/loss summaries for leaders and founders."
      />
      {summaries.map((s) => (
        <article key={s.id} className="co-app-card" style={{ marginBottom: "0.75rem" }}>
          <strong>{s.title}</strong>
          <div className="co-ops-grid" style={{ marginTop: "0.5rem" }}>
            <div className="co-ops-metric">
              <strong>${s.revenue}</strong>
              <span>Revenue</span>
            </div>
            <div className="co-ops-metric">
              <strong>${s.spent}</strong>
              <span>Spent</span>
            </div>
            <div className="co-ops-metric">
              <strong>${s.profit}</strong>
              <span>Net</span>
            </div>
          </div>
          <ul className="co-hint">
            {s.lines.map((l) => (
              <li key={l.id}>
                {l.type}: {l.label} ${l.amount}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </ClubOwnerShell>
  );
}
