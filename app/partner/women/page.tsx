"use client";

import { useEffect, useState } from "react";
import { PartnerShell } from "../components/partner-shell";

interface PastVisit {
  id: string;
  guest: string;
  date: string;
  time: string;
  party_size: number;
}

export default function PartnerWomenPage() {
  const [past, setPast] = useState<PastVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partner-portal/my-venue")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setPast(data.past ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalGuests = past.reduce((sum, r) => sum + r.party_size, 0);

  return (
    <PartnerShell title="Women hosted" sub="BloomBay members who've visited your venue.">
      <div className="pp-stat-grid">
        <div className="pp-stat">
          <strong>{past.length}</strong>
          <span>Past visits</span>
        </div>
        <div className="pp-stat">
          <strong>{totalGuests}</strong>
          <span>Women hosted</span>
        </div>
      </div>
      <div className="pp-card">
        {loading ? (
          <p className="pp-dash__empty">Loading…</p>
        ) : past.length === 0 ? (
          <p className="pp-dash__empty">No past visits yet.</p>
        ) : (
          past.map((r) => (
            <div key={r.id} className="pp-list-row">
              <div>
                <strong>{r.guest}</strong>
                <br />
                <span style={{ color: "var(--pp-muted)" }}>
                  {r.date}{r.time ? ` · ${r.time}` : ""}
                </span>
              </div>
              <span>{r.party_size} guests</span>
            </div>
          ))
        )}
      </div>
    </PartnerShell>
  );
}
