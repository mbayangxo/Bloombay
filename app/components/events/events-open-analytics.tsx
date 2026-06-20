"use client";

import { useEffect, useState } from "react";
import { listAllEvents } from "@/lib/bloombay-events-store";
import { listHostReviewRecords } from "@/lib/host-review-store";
import { TickerNumber } from "@/app/components/admin/portal/ticker-number";

export function EventsOpenAnalytics() {
  const [stats, setStats] = useState({
    openSeats: 0,
    live: 0,
    topTitle: "—",
    worstTitle: "—",
    topCurator: "Maya R.",
    topHost: "The Rose Room",
  });

  useEffect(() => {
    function refresh() {
      const events = listAllEvents();
      const live = events.filter((e) => e.status === "live");
      const openSeats = live.reduce((s, e) => s + (e.capacity ?? 0) - (e.rsvpCount ?? 0), 0);
      const sorted = [...live].sort((a, b) => (b.rsvpCount ?? 0) - (a.rsvpCount ?? 0));
      const top = sorted[0];
      const worst = [...live].sort((a, b) => a.ratingAvg - b.ratingAvg)[0];
      setStats({
        openSeats: Math.max(0, openSeats),
        live: live.length,
        topTitle: top?.title ?? "—",
        worstTitle: worst?.title ?? "—",
        topCurator: "Priya K.",
        topHost: top?.venue ?? "—",
      });
    }
    refresh();
    window.addEventListener("bb-events-updated", refresh);
    return () => window.removeEventListener("bb-events-updated", refresh);
  }, []);

  const hosts = listHostReviewRecords().filter((h) => h.warnings > 0);

  return (
    <section className="fp-submissions-section">
      <h3 className="fp-submissions-section__title">Open events analytics</h3>
      <div className="fp-careers-stats">
        <div className="fp-careers-stat">
          <TickerNumber value={stats.openSeats} className="fp-careers-stats__num" />
          <span className="fp-careers-stats__label">Open seats (live)</span>
        </div>
        <div className="fp-careers-stat">
          <TickerNumber value={stats.live} className="fp-careers-stats__num" />
          <span className="fp-careers-stats__label">Live events</span>
        </div>
      </div>
      <ul className="fp-portal-list" style={{ marginTop: 16 }}>
        <li>
          <strong>Top event:</strong> {stats.topTitle}
        </li>
        <li>
          <strong>Needs attention:</strong> {stats.worstTitle}
        </li>
        <li>
          <strong>Top curator:</strong> {stats.topCurator}
        </li>
        <li>
          <strong>Top host venue:</strong> {stats.topHost}
        </li>
      </ul>
      {hosts.length > 0 && (
        <p className="fp-portal-muted" style={{ marginTop: 12 }}>
          Host warnings: {hosts.map((h) => `${h.hostName} (${h.warnings})`).join(", ")}. Third strike
          soft-archives for 60 days with email.
        </p>
      )}
    </section>
  );
}
