"use client";

import Link from "next/link";
import { getDefaultPortfolioClubIds, getPortfolioSummaries } from "@/lib/club-operations-store";
import { listAllEvents } from "@/lib/bloombay-events-store";

export default function FounderClubsPortfolioPage() {
  const summaries = getPortfolioSummaries(getDefaultPortfolioClubIds());
  const pendingTotal = summaries.reduce((s, c) => s + c.pendingApprovals, 0);
  const upcoming = listAllEvents().filter((e) => e.status === "live");

  return (
    <div className="mc-page">
      <header className="mc-page__head">
        <h1>Multi-club portfolio</h1>
        <p>Shared view for founders and multi-club owners — events, growth, attention needed, and approvals.</p>
      </header>

      <div className="co-ops-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="co-ops-metric">
          <strong>{upcoming.length}</strong>
          <span>Upcoming events</span>
        </div>
        <div className="co-ops-metric">
          <strong>{pendingTotal}</strong>
          <span>Pending approvals</span>
        </div>
        <div className="co-ops-metric">
          <strong>{summaries.length}</strong>
          <span>Clubs tracked</span>
        </div>
      </div>

      <section>
        <h2 className="mc-section-title">Club summaries</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {summaries.map((s) => (
            <li key={s.clubId} style={{ marginBottom: "0.75rem", padding: "1rem", background: "#fff5f8", borderRadius: 12 }}>
              <Link href={`/founder/events/clubs/${s.clubId}`} style={{ fontWeight: 700, color: "var(--bb-hot)" }}>
                {s.clubName}
              </Link>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", opacity: 0.8 }}>
                {s.upcomingEvents} upcoming · {s.newMembers} new members · health {s.healthScore}%
              </p>
              {s.needsAttention.map((n) => (
                <p key={n} style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: "#b45309" }}>
                  ⚠ {n}
                </p>
              ))}
              {s.pendingApprovals > 0 ? (
                <Link href="/club-owner/applications" style={{ fontSize: "0.78rem" }}>
                  Review {s.pendingApprovals} applications →
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2 className="mc-section-title">Upcoming across clubs</h2>
        <ul>
          {upcoming.slice(0, 10).map((e) => (
            <li key={e.id} style={{ marginBottom: "0.35rem" }}>
              <strong>{e.title}</strong>
              <span style={{ opacity: 0.7 }}> · {e.clubId}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
