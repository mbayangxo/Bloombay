"use client";

import { useEffect, useState } from "react";
import { PartnerShell } from "../components/partner-shell";

interface Reservation {
  id: string;
  guest: string;
  date: string;
  time: string;
  party_size: number;
}

export default function PartnerBookingsPage() {
  const [upcoming, setUpcoming] = useState<Reservation[]>([]);
  const [past, setPast] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partner-portal/my-venue")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setUpcoming(data.upcoming ?? []);
          setPast(data.past ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PartnerShell title="Bookings" sub="Upcoming BloomBay reservations and past visits.">
      <div className="pp-card">
        <h2>Upcoming</h2>
        {loading ? (
          <p className="pp-dash__empty">Loading…</p>
        ) : upcoming.length === 0 ? (
          <p className="pp-dash__empty">No upcoming bookings yet.</p>
        ) : (
          upcoming.map((b) => (
            <div key={b.id} className="pp-list-row">
              <div>
                <strong>{b.guest}</strong>
                <br />
                <span style={{ color: "var(--pp-muted)" }}>
                  {b.date}{b.time ? ` · ${b.time}` : ""} · {b.party_size} guests
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="pp-card">
        <h2>Past</h2>
        {loading ? (
          <p className="pp-dash__empty">Loading…</p>
        ) : past.length === 0 ? (
          <p className="pp-dash__empty">No past visits yet.</p>
        ) : (
          past.map((b) => (
            <div key={b.id} className="pp-list-row">
              <div>
                <strong>{b.guest}</strong>
                <br />
                <span style={{ color: "var(--pp-muted)" }}>
                  {b.date}{b.time ? ` · ${b.time}` : ""}
                </span>
              </div>
              <span>{b.party_size} guests</span>
            </div>
          ))
        )}
      </div>
    </PartnerShell>
  );
}
