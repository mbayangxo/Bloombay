"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  listCalendarEntries,
  removeFromCalendar,
  syncCalendarFromServer,
  toggleCalendarReminder,
  type CalendarEntry,
} from "@/lib/member-calendar-store";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function monthMatrix(year: number, month: number): (number | null)[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const days: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  const rows: (number | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
  return rows;
}

function entriesForDay(entries: CalendarEntry[], year: number, month: number, day: number): CalendarEntry[] {
  const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return entries.filter((e) => e.when.includes(String(day)) || e.when.toLowerCase().includes(key.slice(5)));
}

function dayQuery(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function GirlCalendarMonth({
  dayPath = "/member/calendar/day",
}: {
  dayPath?: string;
}) {
  const router = useRouter();
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [selectedDay, setSelectedDay] = useState(now.getDate());

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

  const matrix = useMemo(() => monthMatrix(view.year, view.month), [view.year, view.month]);
  const monthLabel = new Date(view.year, view.month, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const dayEntries = selectedDay
    ? entriesForDay(entries, view.year, view.month, selectedDay)
    : [];

  const nowYear = now.getFullYear();
  const maxYear = nowYear + 1;

  function shiftMonth(delta: number) {
    const d = new Date(view.year, view.month + delta, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
    setSelectedDay(1);
  }

  function shiftYear(delta: number) {
    const nextYear = view.year + delta;
    if (nextYear < nowYear || nextYear > maxYear) return;
    setView({ year: nextYear, month: view.month });
    setSelectedDay(1);
  }

  return (
    <div className="bb-cal-month">
      <p className="bb-cal-month__hint">
        Tap a day to open your full planner — add notes and photos.
      </p>
      <div className="bb-cal-month__toolbar">
        <button type="button" className="bb-cal-month__nav" onClick={() => shiftMonth(-1)} aria-label="Previous month">
          ←
        </button>
        <div className="bb-cal-month__title-wrap">
          <h2 className="bb-cal-month__title">{monthLabel}</h2>
          <div className="bb-cal-month__year-nav" aria-label="Year">
            <button
              type="button"
              className="bb-cal-month__year-btn"
              onClick={() => shiftYear(-1)}
              disabled={view.year <= nowYear}
              aria-label="Previous year"
            >
              ‹‹
            </button>
            <span className="bb-cal-month__year">{view.year}</span>
            <button
              type="button"
              className="bb-cal-month__year-btn"
              onClick={() => shiftYear(1)}
              disabled={view.year >= maxYear}
              aria-label="Next year"
            >
              ››
            </button>
          </div>
        </div>
        <button type="button" className="bb-cal-month__nav" onClick={() => shiftMonth(1)} aria-label="Next month">
          →
        </button>
      </div>

      <div className="bb-cal-month__grid" role="grid" aria-label={monthLabel}>
        {WEEKDAYS.map((w) => (
          <span key={w} className="bb-cal-month__dow" role="columnheader">
            {w}
          </span>
        ))}
        {matrix.flat().map((day, i) => {
          if (day === null) {
            return <span key={`e-${i}`} className="bb-cal-month__cell bb-cal-month__cell--empty" />;
          }
          const has = entriesForDay(entries, view.year, view.month, day).length > 0;
          const selected = selectedDay === day;
          const isToday =
            day === now.getDate() &&
            view.month === now.getMonth() &&
            view.year === now.getFullYear();
          return (
            <button
              key={`d-${day}-${i}`}
              type="button"
              role="gridcell"
              className={`bb-cal-month__cell${has ? " bb-cal-month__cell--has" : ""}${selected ? " bb-cal-month__cell--selected" : ""}${isToday ? " bb-cal-month__cell--today" : ""}`}
              onClick={() => {
                setSelectedDay(day);
                router.push(`${dayPath}?date=${dayQuery(view.year, view.month, day)}`);
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      <section className="bb-cal-month__day" aria-label="Plans for selected day">
        {selectedDay ? (
          <Link
            href={`${dayPath}?date=${dayQuery(view.year, view.month, selectedDay)}`}
            className="bb-cal-month__open-day"
          >
            Open full day →
          </Link>
        ) : null}
        <h3 className="bb-cal-month__day-title">
          {selectedDay
            ? new Date(view.year, view.month, selectedDay).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })
            : "Pick a day"}
        </h3>
        {dayEntries.length === 0 ? (
          <p className="bb-cal-month__empty">
            Nothing on this day — save a seat or RSVP on{" "}
            <Link href="/member/happenings">Happenings</Link>.
          </p>
        ) : (
          <ul className="bb-cal-month__list">
            {dayEntries.map((e) => (
              <li key={e.id} className="bb-cal-month__item">
                <div className="bb-cal-month__item-main">
                  <Link href={e.href} className="bb-cal-month__item-title">
                    {e.title}
                  </Link>
                  <p className="bb-cal-month__item-meta">
                    {e.when} · {e.place}
                  </p>
                </div>
                <div className="bb-cal-month__item-actions">
                  <button
                    type="button"
                    className="bb-cal-month__pill"
                    onClick={() => {
                      void toggleCalendarReminder(e.id, !e.remind).then(() => {
                        setEntries(listCalendarEntries());
                      });
                    }}
                  >
                    {e.remind ? "Reminder on" : "Remind me"}
                  </button>
                  <button
                    type="button"
                    className="bb-cal-month__pill bb-cal-month__pill--ghost"
                    onClick={() => {
                      void removeFromCalendar(e.id);
                      setEntries(listCalendarEntries());
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {entries.length > 0 && dayEntries.length === 0 ? (
          <ul className="bb-cal-month__all" aria-label="All saved plans">
            {entries.map((e) => (
              <li key={`all-${e.id}`}>
                <Link href={e.href}>{e.title}</Link>
                <span> · {e.when}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
