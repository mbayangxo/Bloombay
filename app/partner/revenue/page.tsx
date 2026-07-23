"use client";

import { useEffect, useState } from "react";
import { PartnerShell } from "../components/partner-shell";

interface VenueStats {
  total_upcoming: number;
  total_past: number;
}

export default function PartnerRevenuePage() {
  const [stats, setStats] = useState<VenueStats | null>(null);
  const [womenHosted, setWomenHosted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partner-portal/my-venue")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setStats(data.stats ?? null);
          const past = (data.past ?? []) as { party_size: number }[];
          setWomenHosted(past.reduce((sum, p) => sum + p.party_size, 0));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PartnerShell title="Revenue" sub="Events hosted and women hosted, from your real booking history.">
      <p className="pb-builder__proto" role="status">
        Prototype — dollar revenue isn&apos;t tracked yet (reservations don&apos;t carry a price), so
        it isn&apos;t shown here. Events and women hosted below are real counts from your bookings.
      </p>
      <div className="pp-stat-grid">
        <div className="pp-stat">
          <strong>{loading ? "…" : stats?.total_past ?? 0}</strong>
          <span>Events hosted</span>
        </div>
        <div className="pp-stat">
          <strong>{loading ? "…" : womenHosted}</strong>
          <span>Women hosted</span>
        </div>
        <div className="pp-stat">
          <strong>{loading ? "…" : stats?.total_upcoming ?? 0}</strong>
          <span>Upcoming</span>
        </div>
      </div>
    </PartnerShell>
  );
}
