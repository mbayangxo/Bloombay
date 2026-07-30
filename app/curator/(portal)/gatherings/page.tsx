"use client";

import { useEffect, useState } from "react";
import { CuratorShell } from "@/app/components/curator/curator-shell";

type Gathering = { id: string; name: string; club: string; date: string; venue: string; total: number };

export default function CuratorGatheringsPage() {
  const [gatherings, setGatherings] = useState<Gathering[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/curator/overview")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setGatherings(d?.gatherings ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <CuratorShell
      title="Gatherings"
      subtitle="Host, welcome, and keep chemistry high — you are culture in the field."
    >
      <div className="cu-stat-row">
        <div className="cu-stat">
          <strong>{gatherings.length}</strong>
          <span>On your calendar</span>
        </div>
      </div>

      <article className="cu-card">
        <h2>Upcoming gatherings</h2>
        {loading ? (
          <p className="cu-note">Loading…</p>
        ) : gatherings.length === 0 ? (
          <p className="cu-note">No gatherings on your calendar yet.</p>
        ) : (
          <ul className="cu-list">
            {gatherings.map((g) => (
              <li key={g.id} className="cu-list__row">
                <div>
                  <strong>{g.name}</strong>
                  <p className="cu-note">
                    {g.date}
                    {g.venue ? ` · ${g.venue}` : ""}
                    {g.club ? ` · ${g.club}` : ""}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="cu-note">{g.total} capacity</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="cu-card">
        <h2>Not Clubhouse</h2>
        <p className="cu-note">
          Club hosts manage tickets & QR in Clubhouse. You curate culture — recruit women, run the room, welcome
          members IRL.
        </p>
      </article>
    </CuratorShell>
  );
}
