"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  EVENT_KIND_META,
  listAllEvents,
  listClubsForPortal,
  type EventKind,
} from "@/lib/bloombay-events-store";
import type { EventsPortalBase } from "./club-command-center";
import { TickerNumber } from "@/app/components/admin/portal/ticker-number";
import { EventsOpenAnalytics } from "./events-open-analytics";

export function EventsHub({ staffBase = "/founder" }: { staffBase?: EventsPortalBase }) {
  const [liveTotal, setLiveTotal] = useState(0);
  const kinds: EventKind[] = ["blueday", "current", "regular", "hq"];

  useEffect(() => {
    function refresh() {
      setLiveTotal(listAllEvents().filter((e) => e.status === "live").length);
    }
    refresh();
    window.addEventListener("bb-events-updated", refresh);
    return () => window.removeEventListener("bb-events-updated", refresh);
  }, []);

  const clubs = listClubsForPortal();

  return (
    <div className="fp-portal-page fp-submissions-hub">
      <header className="fp-portal-hero">
        <p className="fp-portal-hero__kicker">Events & Happenings</p>
        <h2 className="fp-portal-hero__title">Plan, cover, and push live</h2>
        <p className="fp-portal-hero__sub">
          Blue Day (all members), current week, regular city gatherings, and HQ flagship events — each with its own
          calendar. Draft privately, upload covers, publish when ready.
        </p>
        <p className="fp-submissions-queue__count-line">
          <TickerNumber value={liveTotal} className="fp-careers-stats__num" /> live on member
          Happenings now
        </p>
      </header>

      <section className="fp-submissions-section">
        <h3 className="fp-submissions-section__title">Event programs</h3>
        <div className="fp-submissions-grid">
          {kinds.map((kind) => {
            const m = EVENT_KIND_META[kind];
            const count = listAllEvents().filter((e) => e.kind === kind).length;
            const live = listAllEvents().filter((e) => e.kind === kind && e.status === "live").length;
            return (
              <Link
                key={kind}
                href={`${staffBase}/events/${kind}`}
                className="fp-submissions-box fp-submissions-box--pink"
              >
                <span className="fp-submissions-box__icon">{m.icon}</span>
                <span className="fp-submissions-box__kicker">{m.kicker}</span>
                <span className="fp-submissions-box__title">{m.title}</span>
                <TickerNumber value={live} className="fp-submissions-box__count" />
                <span className="fp-submissions-box__waiting">live now</span>
                <span className="fp-submissions-box__total">{count} scheduled</span>
                <span className="fp-submissions-box__blurb">{m.blurb}</span>
                <span className="fp-submissions-box__cta">Open calendar →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="fp-submissions-section">
        <h3 className="fp-submissions-section__title">Clubs</h3>
        <p className="fp-portal-muted" style={{ marginBottom: "0.75rem" }}>
          Tap a club for analytics, limited branding edits, monthly manager notes, and event ideas.
        </p>
        <div className="fp-submissions-grid bb-events-clubs-grid">
          {clubs.map((c) => (
            <Link
              key={c.id}
              href={
                staffBase === "/founder"
                  ? `/founder/clubs/${c.id}/dashboard`
                  : `${staffBase}/events/clubs/${c.id}`
              }
              className="fp-submissions-box"
              style={{ borderTop: `4px solid transparent`, background: c.gradient }}
            >
              <span className="fp-submissions-box__kicker">{c.category}</span>
              <span className="fp-submissions-box__title">{c.name}</span>
              <span className="fp-submissions-box__count" style={{ fontSize: "1.25rem" }}>
                {c.members.toLocaleString()}
              </span>
              <span className="fp-submissions-box__total">members</span>
              <span className="fp-submissions-box__blurb">{c.tagline}</span>
              <span className="fp-submissions-box__cta">Club command →</span>
            </Link>
          ))}
        </div>
      </section>

      <EventsOpenAnalytics />
    </div>
  );
}
