"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface ClubEvent {
  id: string;
  slug: string;
  title: string;
  starts_at: string;
  area: string | null;
  venue: string | null;
  club_slug: string;
  is_recurring: boolean;
  recurrence_type: string | null;
  spots_left: number | null;
  is_rsvpd: boolean;
  is_permanent: boolean;
}

interface ClubCalendarViewProps {
  club: {
    id: string;
    slug: string;
    name: string;
    primary_color: string;
  };
  initialEvents: ClubEvent[];
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatTime(isoString: string) {
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function ClubCalendarView({ club, initialEvents }: ClubCalendarViewProps) {
  const TODAY = new Date();
  const THIS_MONTH = TODAY.getMonth();
  const THIS_YEAR = TODAY.getFullYear();
  const TODAY_DATE = TODAY.getDate();

  const [viewMonth, setViewMonth] = useState(THIS_MONTH);
  const [viewYear, setViewYear] = useState(THIS_YEAR);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [events, setEvents] = useState<ClubEvent[]>(initialEvents);

  const primaryColor = club.primary_color || "#FF1F7D";

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
    setSelectedDay(null);
  }

  const isCurrentMonth = viewMonth === THIS_MONTH && viewYear === THIS_YEAR;

  // Get events for this month view
  const eventsThisMonth = events.filter((e) => {
    const d = new Date(e.starts_at);
    return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
  });

  const daysWithEvents = new Set(eventsThisMonth.map((e) => new Date(e.starts_at).getDate()));

  const selectedEvents = selectedDay
    ? eventsThisMonth.filter((e) => new Date(e.starts_at).getDate() === selectedDay)
    : [];

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const handleRsvp = useCallback(async (eventId: string, currentlyRsvpd: boolean) => {
    const action = currentlyRsvpd ? "leave" : "join";
    const res = await fetch("/api/member/calendar/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gathering_id: eventId, action }),
    });
    if (res.ok) {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, is_rsvpd: !currentlyRsvpd } : e))
      );
    }
  }, []);

  const handlePermanent = useCallback(async (eventId: string, currentlyPermanent: boolean) => {
    const action = currentlyPermanent ? "remove" : "add";
    const res = await fetch("/api/member/calendar/permanent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gathering_id: eventId, action }),
    });
    if (res.ok) {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, is_permanent: !currentlyPermanent } : e))
      );
    }
  }, []);

  return (
    <div className="min-h-screen pb-28" style={{ background: "#FDFAF5" }}>
      {/* Header */}
      <div className="px-5 pt-20 pb-4 md:px-10 md:pt-8">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={`/member/clubs/${club.slug}`}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,0,0,0.05)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: primaryColor }}>
              ✦ CLUB CALENDAR
            </p>
            <h1
              className="font-black leading-none"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(24px,5vw,36px)", color: "#111", fontStyle: "italic" }}
            >
              {club.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Calendar card */}
      <div className="px-5 md:px-10">
        <div className="rounded-3xl overflow-hidden" style={{ background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

          {/* Month nav */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ background: "rgba(0,0,0,0.05)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-base font-bold" style={{ color: "#111", fontFamily: "var(--font-playfair)" }}>
                {MONTHS[viewMonth]}
              </p>
              <p className="text-[10px] tracking-[0.2em]" style={{ color: "rgba(0,0,0,0.3)" }}>{viewYear}</p>
            </div>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ background: "rgba(0,0,0,0.05)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-3 pb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center py-1">
                <span className="text-[9px] font-bold tracking-[0.1em]" style={{ color: "rgba(0,0,0,0.35)" }}>{d}</span>
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 px-3 pb-4 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = isCurrentMonth && day === TODAY_DATE;
              const hasEvent = daysWithEvents.has(day);
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className="flex flex-col items-center justify-center py-1.5 rounded-xl transition-all active:scale-90"
                  style={{ background: isSelected ? primaryColor : isToday ? `${primaryColor}33` : "transparent" }}
                >
                  <span
                    className="text-sm font-semibold leading-none"
                    style={{ color: isSelected ? "white" : isToday ? primaryColor : "rgba(0,0,0,0.72)" }}
                  >
                    {day}
                  </span>
                  {hasEvent && !isSelected && (
                    <span className="w-1 h-1 rounded-full mt-0.5" style={{ background: primaryColor }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events for selected day or upcoming */}
      <div className="px-5 mt-6 md:px-10">
        {selectedDay ? (
          <>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "rgba(0,0,0,0.3)" }}>
              {MONTHS[viewMonth].toUpperCase()} {selectedDay}
            </p>
            {selectedEvents.length === 0 ? (
              <div className="rounded-2xl p-6 text-center" style={{ background: "#FFF8F5" }}>
                <p className="text-sm font-medium" style={{ color: "rgba(0,0,0,0.35)", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                  No events this day.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedEvents.map((ev) => (
                  <ClubEventCard
                    key={ev.id}
                    event={ev}
                    primaryColor={primaryColor}
                    onRsvp={handleRsvp}
                    onPermanent={handlePermanent}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "rgba(0,0,0,0.3)" }}>
              UPCOMING EVENTS
            </p>
            {eventsThisMonth.length === 0 ? (
              <div className="rounded-2xl p-6 text-center" style={{ background: "#FFF8F5" }}>
                <p className="text-sm font-medium" style={{ color: "rgba(0,0,0,0.35)", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                  No upcoming events this month.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {eventsThisMonth
                  .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
                  .map((ev) => (
                    <ClubEventCard
                      key={ev.id}
                      event={ev}
                      primaryColor={primaryColor}
                      onRsvp={handleRsvp}
                      onPermanent={handlePermanent}
                    />
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ClubEventCard({
  event,
  primaryColor,
  onRsvp,
  onPermanent,
}: {
  event: ClubEvent;
  primaryColor: string;
  onRsvp: (id: string, current: boolean) => void;
  onPermanent: (id: string, current: boolean) => void;
}) {
  const d = new Date(event.starts_at);
  const dateLabel = `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
  const timeLabel = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const location = event.venue ?? event.area ?? null;

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "white", borderLeft: `3px solid ${primaryColor}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start gap-3">
        <div className="text-center flex-shrink-0 w-10">
          <p className="text-[10px] font-bold" style={{ color: primaryColor }}>
            {MONTHS[d.getMonth()].slice(0, 3).toUpperCase()}
          </p>
          <p className="text-xl font-black leading-none" style={{ color: "#111" }}>{d.getDate()}</p>
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/member/happenings?event=${event.id}`}>
            <p className="font-bold text-sm" style={{ color: "#111" }}>{event.title}</p>
          </Link>
          <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>
            {timeLabel}
            {location ? ` · ${location}` : ""}
          </p>
          {event.spots_left !== null && event.spots_left <= 5 && (
            <p className="text-[10px] mt-1 font-semibold" style={{ color: "#FF1F7D" }}>
              {event.spots_left === 0 ? "Sold out" : `${event.spots_left} spots left`}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              onClick={() => onRsvp(event.id, event.is_rsvpd)}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
              style={
                event.is_rsvpd
                  ? { background: "rgba(255,31,125,0.12)", color: "#FF1F7D", border: "1px solid rgba(255,31,125,0.3)" }
                  : { background: "#FF1F7D", color: "white", boxShadow: "0 2px 8px rgba(255,31,125,0.35)" }
              }
            >
              {event.is_rsvpd ? "Going ✓" : "I'm going →"}
            </button>
            {event.is_recurring && (
              <button
                onClick={() => onPermanent(event.id, event.is_permanent)}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
                style={
                  event.is_permanent
                    ? { background: "rgba(0,0,0,0.08)", color: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,0,0,0.15)" }
                    : { background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.45)", border: "1px solid rgba(0,0,0,0.1)" }
                }
              >
                {event.is_permanent ? "Permanent ♻ ✓" : "Permanent ♻"}
              </button>
            )}
            <a
              href={`/api/member/calendar/${event.id}/ics`}
              download
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
              style={{ background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,0,0,0.08)" }}
            >
              + Calendar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
