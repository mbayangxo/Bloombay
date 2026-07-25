"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { cancelGathering, listGatherings, logAudit, saveGathering } from "@/lib/club-owner-store";
import { getClubProfile } from "@/lib/club-world-data";
import { HostPostMortemCard } from "@/app/components/portal/host-post-mortem-card";
import { BloomCardsDeck } from "@/app/components/portal/bloom-cards-deck";
import { EventImportPanel } from "@/app/components/portal/event-import-panel";

type PastGathering = { id: string; title: string; date: string; venue: string };

export default function ClubOwnerGatheringsPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [events, setEvents] = useState(() => listGatherings(clubId));
  const [pastGatherings, setPastGatherings] = useState<PastGathering[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/club-portal/gatherings");
        if (res.ok) {
          const json = await res.json();
          setPastGatherings(json.past ?? []);
        }
      } catch {
        // Fail silently — post-mortem section is additive
      }
    })();
  }, []);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("NYC");
  const [capacity, setCapacity] = useState("40");
  const [paid, setPaid] = useState(false);
  const [price, setPrice] = useState("25");

  function refresh() {
    setEvents(listGatherings(clubId));
  }

  function handlePlan(e: React.FormEvent) {
    e.preventDefault();
    saveGathering(clubId, {
      title,
      date,
      location,
      capacity: parseInt(capacity, 10) || 40,
      waitlist: 0,
      paid,
      price: paid ? parseInt(price, 10) : undefined,
    });
    logAudit(clubId, "Scheduled gathering", title);
    setTitle("");
    setDate("");
    refresh();
  }

  return (
    <ClubOwnerShell title="Gatherings" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Gatherings"
        sub="Plan events, set capacity and paid tickets, cancel if needed. QR + scan for check-in."
      />

      <section className="co-section co-section--full" style={{ marginBottom: "1.25rem" }}>
        <EventImportPanel publishByDefault clubId={clubId} />
      </section>

      <section className="co-section co-section--full">
        <h2 className="co-section__title">Scheduled</h2>
        {events.map((ev) => (
          <div key={ev.id} className="co-row-card" style={{ flexWrap: "wrap", marginBottom: "0.5rem" }}>
            <div>
              <strong>{ev.title}</strong>
              <p>
                {ev.date} · {ev.location} · cap {ev.capacity}
                {ev.paid ? ` · $${ev.price}` : ""}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <Link href={`/club-owner/events/${ev.id}`} className="co-link">
                QR
              </Link>
              <button
                type="button"
                className="co-btn co-btn--ghost"
                style={{ padding: "0.35rem 0.65rem", fontSize: "0.65rem" }}
                onClick={() => {
                  cancelGathering(ev.id);
                  logAudit(clubId, "Cancelled gathering", ev.title);
                  refresh();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </section>

      {pastGatherings.length > 0 && (
        <section className="co-section co-section--full">
          <h2 className="co-section__title">Past Gatherings</h2>
          {pastGatherings.map((g) => (
            <div key={g.id}>
              <div className="co-row-card" style={{ flexWrap: "wrap", marginBottom: "0.25rem" }}>
                <div>
                  <strong>{g.title}</strong>
                  <p>
                    {g.date}
                    {g.venue ? ` · ${g.venue}` : ""}
                  </p>
                </div>
              </div>
              <HostPostMortemCard gatheringId={g.id} title={g.title} />
            </div>
          ))}
        </section>
      )}

      <form onSubmit={handlePlan} className="co-form">
        <p className="co-form__club">Plan a gathering</p>
        <input className="co-input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input className="co-input" placeholder="Date & time" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input className="co-input" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input className="co-input" type="number" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        <label className="co-toggle">
          <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} />
          <span>Paid ticket</span>
        </label>
        {paid ? (
          <input className="co-input" type="number" placeholder="Price USD" value={price} onChange={(e) => setPrice(e.target.value)} />
        ) : null}
        <button type="submit" className="co-btn co-btn--primary">
          Save gathering
        </button>
      </form>

      <section className="co-section co-section--full">
        <BloomCardsDeck context="host" />
      </section>
    </ClubOwnerShell>
  );
}
