"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/admin-labels";
import {
  displayType,
  filterRows,
  locationLabel,
  type WaitlistRow,
  type WaitlistStatus,
  type SignupType,
} from "@/lib/waitlist-admin";
import { TickerNumber } from "./ticker-number";

function referralSource(row: WaitlistRow): string {
  if (row.founding_mother) return "Founding invite";
  if (row.extra_notes?.trim()) return row.extra_notes.trim();
  return "Waitlist";
}

export function ApplicationsCenter({
  rows,
  initialType,
}: {
  rows: WaitlistRow[];
  initialType?: SignupType;
}) {
  const [activeType, setActiveType] = useState<SignupType | null>(
    initialType ?? null
  );
  const [localRows, setLocalRows] = useState(rows);
  const [updating, setUpdating] = useState<string | null>(null);

  const members = useMemo(() => localRows.filter((r) => r.signup_type === "member"), [localRows]);
  const hosts = useMemo(() => localRows.filter((r) => r.signup_type === "club_host"), [localRows]);
  const partners = useMemo(() => localRows.filter((r) => r.signup_type === "partner"), [localRows]);

  const queues = [
    {
      type: "member" as const,
      title: "Women",
      count: members.filter((r) => r.status === "new" || r.status === "reviewed").length,
      total: members.length,
      blurb: "Members joining the network",
    },
    {
      type: "club_host" as const,
      title: "Club hosts",
      count: hosts.filter((r) => r.status === "new").length,
      total: hosts.length,
      blurb: "Leaders bringing communities in",
    },
    {
      type: "partner" as const,
      title: "Partners",
      count: partners.filter((r) => r.status === "new").length,
      total: partners.length,
      blurb: "Venues & brands hosting women",
    },
  ];

  const queueRows = useMemo(() => {
    if (!activeType) return [];
    return filterRows(localRows, { type: activeType }).filter((r) =>
      ["new", "reviewed", "contacted"].includes(r.status)
    );
  }, [activeType, localRows]);

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
      setLocalRows((prev) => prev.map((r) => (r.id === id ? row : r)));
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="fp-portal-page fp-applications-page">
      <header className="fp-portal-hero">
        <p className="fp-portal-hero__kicker">Applications</p>
        <h2 className="fp-portal-hero__title">Who is moving into BloomBay?</h2>
        <p className="fp-portal-hero__sub">
          Choose a queue — women, club hosts, or partners — then review one beautiful
          card at a time.
        </p>
      </header>

      <div className="fp-app-gates">
        {queues.map((q) => (
          <button
            key={q.type}
            type="button"
            className={`fp-app-gate${activeType === q.type ? " fp-app-gate--active" : ""}`}
            onClick={() => setActiveType(q.type)}
          >
            <span className="fp-app-gate__icon" aria-hidden>
              ✦
            </span>
            <h3>{q.title}</h3>
            <TickerNumber value={q.count} className="fp-app-gate__count" />
            <span className="fp-app-gate__waiting">waiting review</span>
            <span className="fp-app-gate__total">{q.total.toLocaleString()} total</span>
            <p>{q.blurb}</p>
          </button>
        ))}
      </div>

      {activeType ? (
        <section className="fp-app-queue fp-surface-white">
          <div className="fp-app-queue__head">
            <h3>
              {queues.find((q) => q.type === activeType)?.title} queue
            </h3>
            <button type="button" className="fp-portal-link-btn" onClick={() => setActiveType(null)}>
              Close queue
            </button>
          </div>
          {queueRows.length === 0 ? (
            <p className="fp-portal-empty">No pending applications in this queue.</p>
          ) : (
            <ul className="fp-app-queue__list">
              {queueRows.map((row) => (
                <li key={row.id} className="fp-app-person">
                  <div className="fp-app-person__avatar" aria-hidden>
                    {(row.first_name ?? row.business_name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong>{row.first_name ?? row.business_name ?? "—"}</strong>
                    <p className="fp-portal-muted">
                      {locationLabel(row)} · {displayType(row.signup_type)} ·{" "}
                      {formatDate(row.created_at)}
                    </p>
                    <p className="fp-portal-muted">{referralSource(row)}</p>
                  </div>
                  <div className="fp-app-person__actions">
                    <button
                      type="button"
                      className="fp-portal-btn fp-portal-btn--pink"
                      disabled={updating === row.id}
                      onClick={() => updateStatus(row.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="fp-portal-btn"
                      disabled={updating === row.id}
                      onClick={() => updateStatus(row.id, "rejected")}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="fp-portal-btn"
                      disabled={updating === row.id}
                      onClick={() => updateStatus(row.id, "reviewed")}
                    >
                      Review
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <p className="fp-app-hint">Select a card above to open the review queue.</p>
      )}
    </div>
  );
}
