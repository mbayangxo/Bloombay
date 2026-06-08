"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  listCalendarEntries,
  removeFromCalendar,
  syncCalendarFromServer,
  type CalendarEntry,
} from "@/lib/member-calendar-store";
import {
  getCalendarJournal,
  saveCalendarJournal,
} from "@/lib/calendar-journal-store";

function parseDateParam(raw: string | null): Date | null {
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const [y, m, d] = raw.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

function dateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function entriesForDate(entries: CalendarEntry[], d: Date): CalendarEntry[] {
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  return entries.filter(
    (e) =>
      e.when.includes(String(day)) &&
      (e.when.toLowerCase().includes(month.toLowerCase()) || e.when.includes(dateKey(d)))
  );
}

export function CalendarDayStudio({
  dateParam,
  calendarHref = "/member/plans?tab=calendar",
}: {
  dateParam: string | null;
  calendarHref?: string;
}) {
  const day = useMemo(() => parseDateParam(dateParam) ?? new Date(), [dateParam]);
  const key = dateKey(day);
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [note, setNote] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saved, setSaved] = useState(false);

  const dayEntries = useMemo(() => entriesForDate(entries, day), [entries, day]);

  useEffect(() => {
    async function load() {
      const rows = await syncCalendarFromServer();
      setEntries(rows.length ? rows : listCalendarEntries());
    }
    void load();
    const journal = getCalendarJournal(key);
    setNote(journal?.note ?? "");
    setImageUrl(journal?.imageUrl ?? "");
    const onCal = () => setEntries(listCalendarEntries());
    const onJournal = () => {
      const j = getCalendarJournal(key);
      setNote(j?.note ?? "");
      setImageUrl(j?.imageUrl ?? "");
    };
    window.addEventListener("bb-calendar-updated", onCal);
    window.addEventListener("bb-calendar-journal-updated", onJournal);
    return () => {
      window.removeEventListener("bb-calendar-updated", onCal);
      window.removeEventListener("bb-calendar-journal-updated", onJournal);
    };
  }, [key]);

  function persistJournal() {
    saveCalendarJournal(key, { note, imageUrl: imageUrl.trim() });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  const label = day.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bb-cal-studio">
      <header className="bb-cal-studio__head">
        <Link href={calendarHref} className="bb-cal-studio__back">
          ← Calendar
        </Link>
        <h1 className="bb-cal-studio__title">{label}</h1>
        <p className="bb-cal-studio__sub">Your day — plans, notes, and a photo.</p>
      </header>

      <section className="bb-cal-studio__plans" aria-label="Saved plans">
        <h2 className="bb-cal-studio__section-title">On your calendar</h2>
        {dayEntries.length === 0 ? (
          <p className="bb-cal-studio__empty">
            No saved plans yet. RSVP on{" "}
            <Link href="/member/happenings">Happenings</Link> or tap a seat to add one.
          </p>
        ) : (
          <ul className="bb-cal-studio__plan-list">
            {dayEntries.map((e) => (
              <li key={e.id} className="bb-cal-studio__plan">
                <div>
                  <Link href={e.href} className="bb-cal-studio__plan-title">
                    {e.title}
                  </Link>
                  <p className="bb-cal-studio__plan-meta">
                    {e.when} · {e.place}
                  </p>
                </div>
                <button
                  type="button"
                  className="bb-cal-studio__plan-remove"
                  onClick={() => {
                    void removeFromCalendar(e.id);
                    setEntries(listCalendarEntries());
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bb-cal-studio__journal" aria-label="Day journal">
        <h2 className="bb-cal-studio__section-title">Write something</h2>
        <textarea
          className="bb-cal-studio__note"
          rows={5}
          placeholder="Outfit ideas, who you're meeting, how you want the day to feel…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <label className="bb-cal-studio__image-label">
          Photo (paste an image URL)
          <input
            type="url"
            className="bb-cal-studio__image-input"
            placeholder="https://…"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>
        {imageUrl.trim() ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl.trim()} alt="" className="bb-cal-studio__preview" />
        ) : null}
        <div className="bb-cal-studio__actions">
          <button type="button" className="mp-btn mp-btn--hot" onClick={persistJournal}>
            Save day
          </button>
          {saved ? <span className="bb-cal-studio__saved">Saved</span> : null}
        </div>
      </section>
    </div>
  );
}
