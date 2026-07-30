"use client";

import { useEffect, useState } from "react";
import { CuratorShell } from "@/app/components/curator/curator-shell";

type RosterRow = { id: string; name: string; club: string; note: string; status: "welcomed" | "pending" };

export default function CuratorWomenPage() {
  const [roster, setRoster] = useState<RosterRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/curator/overview")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const welcomed: RosterRow[] = (d?.welcomed ?? []).map(
          (w: { name: string; club: string; dateWelcomed: string }, i: number) => ({
            id: `w-${i}`,
            name: w.name,
            club: w.club,
            note: `Welcomed ${w.dateWelcomed}`,
            status: "welcomed" as const,
          }),
        );
        const pending: RosterRow[] = (d?.applications ?? []).map(
          (a: { id: string; name: string; club: string; message: string; appliedAt: string }) => ({
            id: a.id,
            name: a.name,
            club: a.club,
            note: a.message || `Applied ${a.appliedAt}`,
            status: "pending" as const,
          }),
        );
        setRoster([...pending, ...welcomed]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const welcomedCount = roster.filter((w) => w.status === "welcomed").length;
  const pendingCount = roster.filter((w) => w.status !== "welcomed").length;

  return (
    <CuratorShell
      title="Women"
      subtitle="Welcome, recruit, and shepherd — every woman should feel claimed by the community."
    >
      <div className="cu-stat-row">
        <div className="cu-stat">
          <strong>{welcomedCount}</strong>
          <span>Welcomed</span>
        </div>
        <div className="cu-stat">
          <strong>{pendingCount}</strong>
          <span>In progress</span>
        </div>
      </div>

      <article className="cu-card">
        <h2>Your roster</h2>
        {loading ? (
          <p className="cu-note">Loading…</p>
        ) : roster.length === 0 ? (
          <p className="cu-note">No women on your roster yet.</p>
        ) : (
          <ul className="cu-list">
            {roster.map((w) => (
              <li key={w.id} className="cu-list__row">
                <div>
                  <strong>{w.name}</strong>
                  <p className="cu-note">
                    {w.club} · {w.note}
                  </p>
                </div>
                <span className={`cu-badge ${w.status === "welcomed" ? "cu-badge--welcomed" : "cu-badge--draft"}`}>
                  {w.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </CuratorShell>
  );
}
