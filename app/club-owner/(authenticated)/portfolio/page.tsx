"use client";

import Link from "next/link";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getDefaultPortfolioClubIds, getPortfolioSummaries } from "@/lib/club-operations-store";
import { listAllEvents } from "@/lib/bloombay-events-store";

export default function ClubOwnerPortfolioPage() {
  const clubIds = getDefaultPortfolioClubIds();
  const summaries = getPortfolioSummaries(clubIds);
  const upcoming = listAllEvents().filter((e) => e.status === "live").slice(0, 6);

  return (
    <ClubOwnerShell title="Portfolio" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        title="Multi-club portfolio"
        sub="For owners managing multiple clubs — upcoming events, growth, members needing attention, and pending approvals."
      />
      <section className="co-stack">
        <h2 className="co-section__title">Upcoming across clubs</h2>
        <ul className="co-app-list">
          {upcoming.map((e) => (
            <li key={e.id}>
              <strong>{e.title}</strong>
              <span className="co-hint"> · {e.clubId}</span>
            </li>
          ))}
        </ul>
      </section>
      <div className="co-ops-grid">
        {summaries.map((s) => (
          <Link
            key={s.clubId}
            href={`/member/clubs/${s.clubId}`}
            className="co-ops-metric"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <strong>{s.clubName}</strong>
            <span style={{ display: "block", marginTop: "0.35rem" }}>
              {s.upcomingEvents} events · {s.newMembers} new · {s.pendingApprovals} pending
            </span>
            {s.needsAttention.length > 0 ? (
              <p className="co-hint" style={{ marginTop: "0.35rem", color: "var(--co-hot)" }}>
                {s.needsAttention[0]}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </ClubOwnerShell>
  );
}
