"use client";

import { useState } from "react";
import Link from "next/link";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type EventType = "event" | "plan" | "personal" | "bloomie" | "note" | "todo";

interface CalEvent {
  id: number;
  date: number;
  month: number;
  year: number;
  title: string;
  time: string;
  type: EventType;
  color: string;
  with?: string;
  body?: string;
  checked?: boolean;
}

const TODAY = new Date();
const THIS_MONTH = TODAY.getMonth();
const THIS_YEAR = TODAY.getFullYear();
const TODAY_DATE = TODAY.getDate();

const TYPE_COLORS: Record<EventType, string> = {
  event:    "#FF1F7D",
  plan:     "#83C5A0",
  personal: "#C97EFF",
  bloomie:  "#FF69B4",
  note:     "#D4A853",
  todo:     "#0EA5E9",
};

const TYPE_LABELS: Record<EventType, string> = {
  event:    "Event",
  plan:     "Plan Room",
  personal: "Personal",
  bloomie:  "With Bloomie",
  note:     "Note",
  todo:     "To-Do",
};

const TYPE_EMOJIS: Record<EventType, string> = {
  event: "🎟", plan: "🗓", bloomie: "🌸", personal: "✦", note: "📝", todo: "☐",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ── Add Event Sheet ────────────────────────────────────────────────────────────

const TIME_CHIPS = ["9 AM", "11 AM", "1 PM", "3 PM", "5 PM", "7 PM", "8 PM", "9 PM", "10 PM"];

const SHEET_TYPES: EventType[] = ["event", "bloomie", "personal", "plan", "note", "todo"];

function AddEventSheet({ defaultDay, defaultMonth, defaultYear, onClose, onAdd }: {
  defaultDay: number;
  defaultMonth: number;
  defaultYear: number;
  onClose: () => void;
  onAdd: (ev: CalEvent) => void;
}) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("7 PM");
  const [type, setType] = useState<EventType>("personal");
  const [body, setBody] = useState("");

  const hasTime = type !== "note" && type !== "todo";

  function handleAdd() {
    if (!title.trim()) return;
    onAdd({
      id: Date.now(),
      date: defaultDay,
      month: defaultMonth,
      year: defaultYear,
      title: title.trim(),
      time: hasTime ? time : "",
      type,
      color: TYPE_COLORS[type],
      body: body.trim() || undefined,
      checked: type === "todo" ? false : undefined,
    });
    onClose();
  }

  const dayLabel = `${MONTHS[defaultMonth].slice(0, 3)} ${defaultDay}`;

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl"
        style={{ background: "#FFF8F5", boxShadow: "0 -8px 48px rgba(0,0,0,0.6)", maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
        </div>

        {/* Header */}
        <div className="px-6 pb-4 pt-2 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>✦ NEW ENTRY</p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>{dayLabel}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: "rgba(0,0,0,0.05)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Type row — first so it sets context */}
          <div className="mb-5">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2.5" style={{ color: "rgba(0,0,0,0.3)" }}>What kind?</p>
            <div className="grid grid-cols-3 gap-2">
              {SHEET_TYPES.map(k => (
                <button key={k} onClick={() => setType(k)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={type === k
                    ? { background: `${TYPE_COLORS[k]}22`, border: `1.5px solid ${TYPE_COLORS[k]}66`, color: TYPE_COLORS[k] }
                    : { background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.08)", color: "rgba(0,0,0,0.38)" }}>
                  <span className="text-sm">{TYPE_EMOJIS[k]}</span>
                  <span>{TYPE_LABELS[k]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-5">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(0,0,0,0.3)" }}>
              {type === "note" ? "Note title" : type === "todo" ? "What to do?" : "What's happening?"}
            </p>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder={
                type === "note" ? "My thoughts on…" :
                type === "todo" ? "Pick up dress, confirm reservation…" :
                "Dinner at Tatiana, coffee, gallery…"
              }
              className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", color: "#111", caretColor: "#FF1F7D" }}
              autoFocus />
          </div>

          {/* Body textarea — for notes and todos */}
          {(type === "note" || type === "todo" || type === "personal") && (
            <div className="mb-5">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(0,0,0,0.3)" }}>
                {type === "note" ? "Details / thoughts" : "Notes (optional)"}
              </p>
              <textarea value={body} onChange={e => setBody(e.target.value)}
                placeholder={type === "note" ? "Write anything…" : "Any details…"}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", color: "rgba(255,238,220,0.8)", caretColor: "#FF1F7D" }} />
            </div>
          )}

          {/* Time chips — hidden for notes/todos */}
          {hasTime && (
            <div className="mb-5">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2.5" style={{ color: "rgba(0,0,0,0.3)" }}>Time</p>
              <div className="flex gap-2 flex-wrap">
                {TIME_CHIPS.map(t => (
                  <button key={t} onClick={() => setTime(t)}
                    className="px-3.5 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
                    style={time === t
                      ? { background: "#FF1F7D", color: "white", boxShadow: "0 2px 10px rgba(255,31,125,0.4)" }
                      : { background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="px-6 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
          <button onClick={handleAdd}
            disabled={!title.trim()}
            className="w-full py-4 rounded-full text-sm font-bold transition-all active:scale-[0.98]"
            style={title.trim()
              ? { background: TYPE_COLORS[type], color: "white", boxShadow: `0 4px 18px ${TYPE_COLORS[type]}55` }
              : { background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.3)" }}>
            {title.trim()
              ? type === "todo" ? `Add to-do for ${dayLabel}`
              : type === "note" ? `Save note for ${dayLabel}`
              : `Add to ${dayLabel}`
              : "Enter a title first"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Event Card ─────────────────────────────────────────────────────────────────

function EventCard({ ev, onToggle }: { ev: CalEvent; onToggle?: () => void }) {
  const isNote = ev.type === "note";
  const isTodo = ev.type === "todo";

  return (
    <div className="rounded-2xl p-4"
      style={{ background: isNote ? `${ev.color}11` : "#FFF8F5", borderLeft: `3px solid ${ev.color}` }}>
      <div className="flex items-start gap-3">
        {isTodo ? (
          <button onClick={onToggle}
            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all active:scale-90"
            style={ev.checked
              ? { background: ev.color, border: `1.5px solid ${ev.color}` }
              : { background: "transparent", border: `1.5px solid rgba(255,255,255,0.25)` }}>
            {ev.checked && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `${ev.color}22` }}>
            <span className="text-sm">{TYPE_EMOJIS[ev.type]}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm"
            style={{ color: ev.checked ? "rgba(0,0,0,0.3)" : "#111", textDecoration: ev.checked ? "line-through" : "none" }}>
            {ev.title}
          </p>
          {ev.time && (
            <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.38)" }}>
              {ev.time} · {TYPE_LABELS[ev.type]}
            </p>
          )}
          {!ev.time && (
            <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.38)" }}>{TYPE_LABELS[ev.type]}</p>
          )}
          {ev.with && (
            <p className="text-[10px] mt-1 font-medium" style={{ color: ev.color }}>{ev.with}</p>
          )}
          {ev.body && (
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "rgba(0,0,0,0.5)" }}>{ev.body}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Calendar Page ─────────────────────────────────────────────────────────

export default function CalendarPage() {
  const [viewMonth, setViewMonth] = useState(THIS_MONTH);
  const [viewYear, setViewYear]   = useState(THIS_YEAR);
  const [selectedDay, setSelectedDay] = useState<number | null>(TODAY_DATE);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [events, setEvents] = useState<CalEvent[]>([
    { id: 1, date: 7,          month: THIS_MONTH, year: THIS_YEAR, title: "Afrobeats Night",       time: "10 PM", type: "event",    color: "#FF1F7D", with: "8 Bloomies" },
    { id: 2, date: 10,         month: THIS_MONTH, year: THIS_YEAR, title: "Sunday Walk Circle",    time: "9 AM",  type: "plan",     color: "#83C5A0", with: "Zara, Nia" },
    { id: 3, date: 14,         month: THIS_MONTH, year: THIS_YEAR, title: "Coffee w/ Solange",     time: "2 PM",  type: "bloomie",  color: "#FF69B4", with: "Solange" },
    { id: 4, date: TODAY_DATE, month: THIS_MONTH, year: THIS_YEAR, title: "Women & Lens Gallery",  time: "7 PM",  type: "event",    color: "#FF1F7D", with: "12 Bloomies" },
    { id: 5, date: 21,         month: THIS_MONTH, year: THIS_YEAR, title: "Dinner at Tatiana",     time: "8 PM",  type: "personal", color: "#C97EFF", with: "Amara, Temi" },
    { id: 6, date: 28,         month: THIS_MONTH, year: THIS_YEAR, title: "Morocco Trip Debrief",  time: "4 PM",  type: "plan",     color: "#83C5A0", with: "Morocco Group" },
  ]);

  const daysInMonth   = getDaysInMonth(viewYear, viewMonth);
  const firstDay      = getFirstDayOfMonth(viewYear, viewMonth);
  const isCurrentMonth = viewMonth === THIS_MONTH && viewYear === THIS_YEAR;

  const eventsThisMonth = events.filter(e => e.month === viewMonth && e.year === viewYear);
  const daysWithEvents  = new Set(eventsThisMonth.map(e => e.date));
  const selectedEvents  = selectedDay ? eventsThisMonth.filter(e => e.date === selectedDay) : [];

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  }

  function addEvent(ev: CalEvent) {
    setEvents(prev => [...prev, ev]);
    setSelectedDay(ev.date);
  }

  const addDay = selectedDay ?? TODAY_DATE;

  return (
    <div className="min-h-screen pb-28" style={{ background: "#FDFAF5" }}>

      {/* Header */}
      <div className="px-5 pt-20 pb-4 md:px-10 md:pt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link href="/member/home"
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,0,0,0.05)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </Link>
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>✦ MY CALENDAR</p>
              <h1 className="font-black leading-none"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px,6vw,40px)", color: "#111", lineHeight: 1 }}>
                Schedule.
              </h1>
            </div>
          </div>
          <button onClick={() => setShowAddSheet(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: "#FF1F7D", boxShadow: "0 4px 12px rgba(255,31,125,0.4)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar card */}
      <div className="px-5 md:px-10">
        <div className="rounded-3xl overflow-hidden" style={{ background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

          {/* Month nav */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <button onClick={prevMonth}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ background: "rgba(0,0,0,0.05)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div className="text-center">
              <p className="text-base font-bold" style={{ color: "#111", fontFamily: "var(--font-playfair)" }}>
                {MONTHS[viewMonth]}
              </p>
              <p className="text-[10px] tracking-[0.2em]" style={{ color: "rgba(0,0,0,0.3)" }}>{viewYear}</p>
            </div>
            <button onClick={nextMonth}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ background: "rgba(0,0,0,0.05)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-3 pb-1">
            {DAYS.map(d => (
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
              const isToday    = isCurrentMonth && day === TODAY_DATE;
              const hasEvent   = daysWithEvents.has(day);
              const isSelected = selectedDay === day;
              return (
                <button key={day} onClick={() => setSelectedDay(isSelected ? null : day)}
                  className="flex flex-col items-center justify-center py-1.5 rounded-xl transition-all active:scale-90"
                  style={{ background: isSelected ? "#FF1F7D" : isToday ? "rgba(255,31,125,0.2)" : "transparent" }}>
                  <span className="text-sm font-semibold leading-none"
                    style={{ color: isSelected ? "white" : isToday ? "#FF1F7D" : "rgba(0,0,0,0.72)" }}>
                    {day}
                  </span>
                  {hasEvent && !isSelected && (
                    <span className="w-1 h-1 rounded-full mt-0.5" style={{ background: isToday ? "#FF1F7D" : "rgba(255,31,125,0.7)" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected day events or upcoming */}
      <div className="px-5 mt-6 md:px-10">
        {selectedDay ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(0,0,0,0.3)" }}>
                {MONTHS[viewMonth].toUpperCase()} {selectedDay}
              </p>
              <button onClick={() => setShowAddSheet(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95"
                style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="3" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add
              </button>
            </div>
            {selectedEvents.length === 0 ? (
              <div className="rounded-2xl p-6 text-center" style={{ background: "#FFF8F5" }}>
                <p className="text-2xl mb-2">🌸</p>
                <p className="text-sm font-medium mb-3" style={{ color: "rgba(0,0,0,0.35)" }}>Nothing planned — free day.</p>
                <button onClick={() => setShowAddSheet(true)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95"
                  style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }}>
                  + Add something
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedEvents.map(ev => (
                  <EventCard key={ev.id} ev={ev}
                    onToggle={ev.type === "todo" ? () => setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, checked: !e.checked } : e)) : undefined} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "rgba(0,0,0,0.3)" }}>
              COMING UP
            </p>
            <div className="flex flex-col gap-3">
              {events.filter(e => e.month === THIS_MONTH && e.year === THIS_YEAR && e.date >= TODAY_DATE)
                .sort((a, b) => a.date - b.date)
                .map(ev => (
                  <button key={ev.id} onClick={() => setSelectedDay(ev.date)}
                    className="rounded-2xl p-4 flex items-start gap-4 text-left w-full transition-all active:scale-[0.98]"
                    style={{ background: ev.type === "note" ? `${ev.color}11` : "white", borderLeft: `3px solid ${ev.color}` }}>
                    <div className="text-center flex-shrink-0 w-10">
                      <p className="text-xs font-bold" style={{ color: ev.color }}>{MONTHS[ev.month].slice(0, 3).toUpperCase()}</p>
                      <p className="text-xl font-black leading-none" style={{ color: "#111" }}>{ev.date}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm"
                        style={{ color: ev.checked ? "rgba(0,0,0,0.3)" : "#111", textDecoration: ev.checked ? "line-through" : "none" }}>
                        {TYPE_EMOJIS[ev.type]} {ev.title}
                      </p>
                      {ev.time ? (
                        <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.38)" }}>
                          {ev.time} · {TYPE_LABELS[ev.type]}
                        </p>
                      ) : (
                        <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.38)" }}>{TYPE_LABELS[ev.type]}</p>
                      )}
                      {ev.with && (
                        <p className="text-[10px] mt-1 font-medium" style={{ color: ev.color }}>{ev.with}</p>
                      )}
                      {ev.body && (
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(0,0,0,0.4)" }} >{ev.body}</p>
                      )}
                    </div>
                  </button>
                ))}
            </div>
          </>
        )}
      </div>

      {/* Coordinate */}
      <div className="px-5 mt-6 mb-4 md:px-10">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "rgba(0,0,0,0.3)" }}>COORDINATE</p>
        <div className="rounded-2xl p-4" style={{ background: "#FFF8F5" }}>
          <div className="mb-3">
            <p className="text-sm font-bold" style={{ color: "#111", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
              Plan with other women.
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(0,0,0,0.35)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
              Share your calendar or coordinate an outing.
            </p>
          </div>
          <div className="flex items-end gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {[
              { initial: "Z", color: "#FF1F7D", name: "Zara",  status: "free",    freeDay: "Sat" },
              { initial: "A", color: "#FF69B4", name: "Amara", status: "busy",    freeDay: "Sun" },
              { initial: "N", color: "#A855F7", name: "Nia",   status: "free",    freeDay: "Fri" },
              { initial: "S", color: "#0EA5E9", name: "Sofia", status: "maybe",   freeDay: "Sat" },
            ].map(b => (
              <div key={b.initial} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: b.color }}>
                    {b.initial}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                    style={{
                      borderColor: "#FFF8F5",
                      background: b.status === "free" ? "#4ADE80" : b.status === "busy" ? "#F87171" : "#FBBF24",
                    }} />
                </div>
                <span className="text-[9px]" style={{ color: "rgba(0,0,0,0.35)" }}>{b.name}</span>
                <span className="text-[8px] font-semibold" style={{ color: b.status === "free" ? "#4ADE80" : b.status === "busy" ? "rgba(255,255,255,0.2)" : "#FBBF24" }}>
                  {b.status === "free" ? `Free ${b.freeDay}` : b.status === "busy" ? "Busy" : `Maybe ${b.freeDay}`}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.05)", border: "1px dashed rgba(255,255,255,0.2)" }}>
                <span style={{ color: "rgba(0,0,0,0.4)", fontSize: 18 }}>+</span>
              </div>
              <span className="text-[9px]" style={{ color: "rgba(0,0,0,0.35)" }}>Invite</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/member/plans"
              className="flex-1 py-3 rounded-xl text-xs font-bold text-center transition-all active:scale-[0.97]"
              style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 12px rgba(255,31,125,0.35)" }}>
              + Create a Plan Room
            </Link>
            <button className="px-4 py-3 rounded-xl text-xs font-bold transition-all active:scale-[0.97]"
              style={{ background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Share
            </button>
          </div>
        </div>
      </div>

      {showAddSheet && (
        <AddEventSheet
          defaultDay={addDay}
          defaultMonth={viewMonth}
          defaultYear={viewYear}
          onClose={() => setShowAddSheet(false)}
          onAdd={addEvent}
        />
      )}
    </div>
  );
}
