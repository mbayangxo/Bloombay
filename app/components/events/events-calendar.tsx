"use client";

import { useMemo, useState } from "react";
import type { BloomBayEvent } from "@/lib/bloombay-events-store";
import { formatEventDate } from "@/lib/bloombay-events-store";

export function EventsCalendar({
  events,
  selectedId,
  onSelect,
}: {
  events: BloomBayEvent[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const { weeks, monthLabel } = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startPad = first.getDay();
    const daysInMonth = last.getDate();
    const byDay = new Map<number, BloomBayEvent[]>();
    for (const ev of events) {
      const d = new Date(ev.startAt);
      if (d.getFullYear() === y && d.getMonth() === m) {
        const day = d.getDate();
        if (!byDay.has(day)) byDay.set(day, []);
        byDay.get(day)!.push(ev);
      }
    }
    const cells: { day: number | null; events: BloomBayEvent[] }[] = [];
    for (let i = 0; i < startPad; i++) cells.push({ day: null, events: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, events: byDay.get(d) ?? [] });
    }
    while (cells.length % 7 !== 0) cells.push({ day: null, events: [] });
    const weeks: (typeof cells)[] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    const monthLabel = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    return { weeks, monthLabel };
  }, [cursor, events]);

  function shiftMonth(delta: number) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  }

  return (
    <div className="bb-events-cal">
      <div className="bb-events-cal__head">
        <button type="button" className="fp-portal-btn" onClick={() => shiftMonth(-1)} aria-label="Previous month">
          ←
        </button>
        <strong>{monthLabel}</strong>
        <button type="button" className="fp-portal-btn" onClick={() => shiftMonth(1)} aria-label="Next month">
          →
        </button>
      </div>
      <div className="bb-events-cal__weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="bb-events-cal__grid">
        {weeks.flat().map((cell, i) => (
          <div
            key={i}
            className={`bb-events-cal__cell${cell.day ? "" : " bb-events-cal__cell--empty"}`}
          >
            {cell.day ? <span className="bb-events-cal__day">{cell.day}</span> : null}
            {cell.events.slice(0, 2).map((ev) => (
              <button
                key={ev.id}
                type="button"
                className={`bb-events-cal__dot${selectedId === ev.id ? " bb-events-cal__dot--on" : ""}${ev.status === "live" ? " bb-events-cal__dot--live" : ""}`}
                title={ev.title}
                onClick={() => onSelect?.(ev.id)}
              >
                {ev.title.slice(0, 12)}
                {ev.title.length > 12 ? "…" : ""}
              </button>
            ))}
            {cell.events.length > 2 ? (
              <span className="bb-events-cal__more">+{cell.events.length - 2}</span>
            ) : null}
          </div>
        ))}
      </div>
      <ul className="bb-events-cal__agenda">
        {events
          .slice()
          .sort((a, b) => a.startAt.localeCompare(b.startAt))
          .map((ev) => (
            <li key={ev.id}>
              <button
                type="button"
                className={`bb-events-cal__agenda-item${selectedId === ev.id ? " bb-events-cal__agenda-item--on" : ""}`}
                onClick={() => onSelect?.(ev.id)}
              >
                <span className={`bb-events-cal__status bb-events-cal__status--${ev.status}`}>
                  {ev.status}
                </span>
                <strong>{ev.title}</strong>
                <span>{formatEventDate(ev.startAt)}</span>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
