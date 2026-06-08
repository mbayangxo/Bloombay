"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  getBlueDayAnalytics,
  listBlueDayAnnouncements,
  sendBlueDayAnnouncement,
} from "@/lib/blueday-founder-store";
import {
  formatEventDate,
  getEvent,
  listBlueDayEvents,
  publishEvent,
  cancelEvent,
} from "@/lib/bloombay-events-store";
import { ensureEventQrCode, getEventAttendanceStats, listRsvps } from "@/lib/event-rsvp-store";
import { EventsStudio } from "./events-studio";

export function BlueDayStudio({ backHref = "/founder/events" }: { backHref?: string }) {
  const [analytics, setAnalytics] = useState(getBlueDayAnalytics);
  const [announcements, setAnnouncements] = useState(listBlueDayAnnouncements);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [tab, setTab] = useState<"events" | "announce" | "analytics">("events");

  const refresh = useCallback(() => {
    setAnalytics(getBlueDayAnalytics());
    setAnnouncements(listBlueDayAnnouncements());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("bb-events-updated", refresh);
    return () => window.removeEventListener("bb-events-updated", refresh);
  }, [refresh]);

  const selected = selectedId ? getEvent(selectedId) : null;
  const stats = selected ? getEventAttendanceStats(selected.id) : null;

  return (
    <div className="fp-portal-page">
      <header className="fp-submissions-queue__hero">
        <Link href={backHref} className="fp-submissions-queue__back">
          ← Events hub
        </Link>
        <p className="fp-portal-hero__kicker">Platform-wide</p>
        <h2 className="fp-portal-hero__title">Blue Day events</h2>
        <p className="fp-portal-hero__sub">
          Open to all members regardless of club — RSVP, optional deposit, unique QR check-in. Most are free.
        </p>
      </header>

      <nav className="bb-club-command__tabs">
        {(["events", "announce", "analytics"] as const).map((t) => (
          <button
            key={t}
            type="button"
            className={`bb-club-command__tab${tab === t ? " bb-club-command__tab--on" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "events" ? "Manage events" : t === "announce" ? "Announcements" : "Analytics"}
          </button>
        ))}
      </nav>

      {tab === "events" ? (
        <EventsStudio kind="blueday" staffBase="/founder" backHref={backHref} />
      ) : null}

      {tab === "announce" ? (
        <div className="bb-events-form fp-surface-white" style={{ marginTop: "1rem" }}>
          <h3>Announce to all users</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendBlueDayAnnouncement({
                title: annTitle,
                body: annBody,
                eventId: selectedId ?? undefined,
                channels: { push: true, email: true, sms: false },
              });
              setAnnTitle("");
              setAnnBody("");
              refresh();
            }}
          >
            <label>
              Title
              <input value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} required />
            </label>
            <label>
              Update
              <textarea rows={4} value={annBody} onChange={(e) => setAnnBody(e.target.value)} required />
            </label>
            <button type="submit" className="fp-portal-btn fp-portal-btn--pink">
              Send to all members
            </button>
          </form>
          <ul className="fp-happenings-list" style={{ marginTop: "1rem" }}>
            {announcements.map((a) => (
              <li key={a.id} className="fp-happenings-list__row">
                <div>
                  <strong>{a.title}</strong>
                  <p className="fp-sub">{a.body}</p>
                  <p className="fp-portal-muted">
                    {new Date(a.sentAt).toLocaleString()} · reach ~{a.reach}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tab === "analytics" ? (
        <div style={{ marginTop: "1rem" }}>
          <div className="fp-inbox-pink-cards">
            <article className="fp-inbox-pink-card">
              <span className="fp-inbox-pink-card__num">{analytics.liveEvents}</span>
              <span className="fp-inbox-pink-card__label">Live Blue Days</span>
            </article>
            <article className="fp-inbox-pink-card">
              <span className="fp-inbox-pink-card__num">{analytics.totalRsvps}</span>
              <span className="fp-inbox-pink-card__label">RSVPs</span>
            </article>
            <article className="fp-inbox-pink-card">
              <span className="fp-inbox-pink-card__num">{analytics.totalCheckIns}</span>
              <span className="fp-inbox-pink-card__label">Check-ins</span>
            </article>
            <article className="fp-inbox-pink-card">
              <span className="fp-inbox-pink-card__num">{analytics.freeEvents}</span>
              <span className="fp-inbox-pink-card__label">Free events</span>
            </article>
          </div>
          <h3 className="fp-card__title" style={{ marginTop: "1.25rem" }}>
            Per-event
          </h3>
          <ul className="fp-happenings-list">
            {listBlueDayEvents().map((e) => {
              const s = getEventAttendanceStats(e.id);
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    className="fp-happenings-list__row"
                    style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", cursor: "pointer" }}
                    onClick={() => setSelectedId(e.id)}
                  >
                    <strong>{e.title}</strong>
                    <span className="fp-sub">
                      {e.status} · {s.rsvps} RSVPs · {s.checkIns} check-ins
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {selected && stats ? (
            <article className="fp-surface-barbie" style={{ marginTop: "1rem", padding: "1rem" }}>
              <h4>{selected.title}</h4>
              <p>{formatEventDate(selected.startAt)}</p>
              <p>QR: {ensureEventQrCode(selected.id)}</p>
              <p>
                RSVPs: {stats.rsvps} · Check-ins: {stats.checkIns} · No-shows: {stats.noShows}
              </p>
              <p className="fp-portal-muted">{listRsvps(selected.id).length} stored RSVPs</p>
              {selected.status === "draft" ? (
                <button
                  type="button"
                  className="fp-portal-btn fp-portal-btn--pink"
                  onClick={() => {
                    publishEvent(selected.id, true);
                    refresh();
                  }}
                >
                  Publish + notify all users
                </button>
              ) : selected.status === "live" ? (
                <button
                  type="button"
                  className="fp-portal-btn"
                  onClick={() => {
                    if (confirm("Cancel and notify attendees?")) {
                      cancelEvent(selected.id);
                      sendBlueDayAnnouncement({
                        title: `Cancelled: ${selected.title}`,
                        body: "This Blue Day event has been cancelled. We'll see you at the next one.",
                        eventId: selected.id,
                        channels: { push: true, email: true, sms: false },
                      });
                      refresh();
                    }
                  }}
                >
                  Cancel event
                </button>
              ) : null}
            </article>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
