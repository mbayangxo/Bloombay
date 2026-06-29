"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/admin-labels";
import type { WaitlistRow, WaitlistStatus } from "@/lib/waitlist-admin";
import type { FounderClubRow } from "@/lib/founder/club-host-ops";
import { ClubMamaBetaPath } from "@/app/components/founder/club-mama-beta-path";

export function ClubHostsMissionPanel({
  basePath,
  pendingHosts: initialPending,
  activeClubs,
  warning,
}: {
  basePath: "/founder" | "/admin";
  pendingHosts: WaitlistRow[];
  activeClubs: FounderClubRow[];
  warning: string | null;
}) {
  const [pendingHosts, setPendingHosts] = useState(initialPending);
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStatus(id: string, status: WaitlistStatus) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      const { row } = (await res.json()) as { row: WaitlistRow };
      if (["approved", "rejected"].includes(row.status)) {
        setPendingHosts((prev) => prev.filter((r) => r.id !== id));
      } else {
        setPendingHosts((prev) => prev.map((r) => (r.id === id ? row : r)));
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="fp-page">
      <ClubMamaBetaPath />

      {warning ? (
        <p className="bb-admin-login-error" style={{ marginBottom: "1rem" }}>
          {warning}
        </p>
      ) : null}

      <header className="fp-page__head">
        <p className="fp-kicker">Hosts</p>
        <h2 className="fp-headline">Club Mama queue & live clubs</h2>
        <p className="fp-sub">
          Real waitlist applications and database clubs — not the demo host leaderboard.
        </p>
      </header>

      <div className="fp-inbox-pink-cards">
        <article className="fp-inbox-pink-card">
          <span className="fp-inbox-pink-card__num">{pendingHosts.length}</span>
          <span className="fp-inbox-pink-card__label">Pending host applications</span>
        </article>
        <article className="fp-inbox-pink-card">
          <span className="fp-inbox-pink-card__num">{activeClubs.length}</span>
          <span className="fp-inbox-pink-card__label">Clubs in database</span>
        </article>
      </div>

      <section className="fp-card" style={{ marginBottom: "1.25rem" }}>
        <h3 className="fp-card__title">Pending Club Mama applications</h3>
        {pendingHosts.length === 0 ? (
          <p className="fp-portal-empty">No club host applications waiting review.</p>
        ) : (
          <ul className="fp-safety-reports" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {pendingHosts.map((row) => (
              <li key={row.id} className="fp-safety-report" style={{ marginBottom: "0.75rem" }}>
                <p>
                  <strong>{row.club_name ?? row.first_name ?? "Club host"}</strong>
                  <span className="fp-portal-muted"> · {row.status}</span>
                </p>
                <p className="fp-portal-muted">
                  {row.email ?? "No email"} · {row.city ?? "City TBD"} · {formatDate(row.created_at)}
                </p>
                {row.club_platform ? (
                  <p className="fp-portal-muted">Platform: {row.club_platform}</p>
                ) : null}
                <div className="fp-safety-report__actions">
                  <button
                    type="button"
                    className="fp-portal-btn fp-portal-btn--pink"
                    disabled={updating === row.id}
                    onClick={() => void updateStatus(row.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="fp-portal-btn"
                    disabled={updating === row.id}
                    onClick={() => void updateStatus(row.id, "rejected")}
                  >
                    Reject
                  </button>
                  <Link href={`${basePath}/invites`} className="fp-link-pill">
                    Send portal invite →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="fp-card">
        <h3 className="fp-card__title">Live clubs (beta manage path)</h3>
        {activeClubs.length === 0 ? (
          <p className="fp-portal-empty">No clubs in the database yet.</p>
        ) : (
          <ol className="fp-host-lb">
            {activeClubs.map((club) => (
              <li key={club.id} className="fp-host-lb__row">
                <div>
                  <strong>{club.name}</strong>
                  <span className="fp-sub">
                    {club.ownerName ?? "No owner"} · /{club.slug}
                  </span>
                </div>
                <Link href={club.managePath} className="fp-link-pill">
                  Open manage →
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <p className="fp-sub" style={{ marginTop: "1rem" }}>
        <Link href={`${basePath}/applications?type=club_host`} className="fp-link-pill">
          Full applications queue →
        </Link>
        {" · "}
        <Link href={`${basePath}/invites`} className="fp-link-pill">
          Portal invites →
        </Link>
      </p>
    </div>
  );
}
