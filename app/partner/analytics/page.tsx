"use client";

import { useEffect, useState } from "react";
import { PartnerShell } from "../components/partner-shell";

interface VenueStats {
  total_upcoming: number;
  total_past: number;
  pending_requests: number;
  avg_rating: number;
}

export default function PartnerAnalyticsPage() {
  const [stats, setStats] = useState<VenueStats | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partner-portal/my-venue")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setStats(data.stats ?? null);
          setReviewCount(data.venue?.review_count ?? 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PartnerShell title="Analytics" sub="Bookings and rating data pulled from your venue's real activity.">
      {loading ? (
        <p className="pp-dash__empty">Loading…</p>
      ) : (
        <>
          <div className="pp-stat-grid">
            <div className="pp-stat">
              <strong>{stats?.total_upcoming ?? 0}</strong>
              <span>Upcoming bookings</span>
            </div>
            <div className="pp-stat">
              <strong>{stats?.total_past ?? 0}</strong>
              <span>Past bookings</span>
            </div>
            <div className="pp-stat">
              <strong>{stats?.pending_requests ?? 0}</strong>
              <span>Pending requests</span>
            </div>
            <div className="pp-stat">
              <strong>{stats && stats.avg_rating > 0 ? stats.avg_rating.toFixed(1) : "—"}</strong>
              <span>Avg rating · {reviewCount} reviews</span>
            </div>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--pp-muted)" }}>
            Deeper trends (conversion, repeat visits, revenue) aren&apos;t tracked yet — this
            page shows the real counts BloomBay currently has for your venue.
          </p>
        </>
      )}
    </PartnerShell>
  );
}
