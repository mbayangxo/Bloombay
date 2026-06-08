"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  listCalendarEntries,
  removeFromCalendar,
  syncCalendarFromServer,
  type CalendarEntry,
} from "@/lib/member-calendar-store";

export function GirlCalendarStrip() {
  const [entries, setEntries] = useState<CalendarEntry[]>([]);

  useEffect(() => {
    async function load() {
      const rows = await syncCalendarFromServer();
      setEntries(rows.length ? rows : listCalendarEntries());
    }
    void load();
    const onUpdate = () => setEntries(listCalendarEntries());
    window.addEventListener("bb-calendar-updated", onUpdate);
    return () => window.removeEventListener("bb-calendar-updated", onUpdate);
  }, []);

  return (
    <section className="bb-girl-calendar" aria-label="Girl Calendar">
      <div className="bb-girl-calendar__head">
        <h2 className="bb-girl-calendar__title">Girl Calendar</h2>
        <Link href="/member/calendar" className="bb-girl-calendar__full">
          Full calendar →
        </Link>
      </div>
      {entries.length === 0 ? (
        <p className="bb-girl-calendar__empty">
          Nothing saved yet —{" "}
          <Link href="/member/happenings?tab=invitations">RSVP a seat</Link> or{" "}
          <Link href="/member/calendar">open full calendar</Link>.
        </p>
      ) : (
        <ul className="bb-girl-calendar__list">
          {entries.slice(0, 6).map((e) => (
            <li key={e.id} className="bb-girl-calendar__item">
              <Link href={e.href} className="bb-girl-calendar__link">
                <span className="bb-girl-calendar__when">{e.when}</span>
                <strong className="bb-girl-calendar__name">{e.title}</strong>
                <span className="bb-girl-calendar__place">{e.place}</span>
              </Link>
              <button
                type="button"
                className="bb-girl-calendar__remove"
                aria-label={`Remove ${e.title}`}
                onClick={() => {
                  void removeFromCalendar(e.id);
                  setEntries(listCalendarEntries());
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
