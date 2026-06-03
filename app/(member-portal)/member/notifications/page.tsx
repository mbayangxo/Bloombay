"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTimeOfDay, type TimeOfDay } from "@/app/components/portal/time-wrapper";

interface Notif {
  id: number;
  type: "seat" | "stamp" | "event" | "celebrate" | "intro" | "message" | "club";
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const INITIAL_NOW: Notif[] = [
  {
    id: 1, type: "seat",
    title: "You grabbed a seat",
    body: "Girls dinner · Carbone · Tonight 7:30PM",
    time: "2m ago", unread: true,
  },
  {
    id: 2, type: "stamp",
    title: "Sofia K. witnessed you",
    body: '"You made the whole table feel like home."',
    time: "8m ago", unread: true,
  },
  {
    id: 3, type: "event",
    title: "Paint + sip + dinner is almost full",
    body: "2 seats left · Tonight 7PM",
    time: "14m ago", unread: true,
  },
];

const INITIAL_EARLIER: Notif[] = [
  {
    id: 4, type: "celebrate",
    title: "Show up for Aaliyah M.",
    body: "Birthday picnic · Sat 2PM · Prospect Park · 4 seats",
    time: "2h ago", unread: true,
  },
  {
    id: 5, type: "club",
    title: "Dinner Society posted a new seat",
    body: "Girls brunch · Ladurée SoHo · Sat 11AM · $1 deposit",
    time: "4h ago", unread: false,
  },
  {
    id: 6, type: "stamp",
    title: "Priya R. witnessed you",
    body: '"You made everyone feel welcome."',
    time: "5h ago", unread: false,
  },
  {
    id: 7, type: "event",
    title: "Wine & Style Night · Dinner Society",
    body: "Tomorrow 7PM · 4 seats left",
    time: "5h ago", unread: false,
  },
  {
    id: 8, type: "intro",
    title: "Yande thinks you and Kezia N. would vibe",
    body: '"You both love museums and independent bookstores."',
    time: "1d ago", unread: false,
  },
  {
    id: 9, type: "message",
    title: "New message from Naomi B.",
    body: "Quick question about the rooftop gathering...",
    time: "1d ago", unread: false,
  },
  {
    id: 10, type: "seat",
    title: "Your seat was confirmed",
    body: "Pilates + matcha morning · Sunday 9AM · Studio Bloom",
    time: "2d ago", unread: false,
  },
];

// ── Icon per type ─────────────────────────────────────────────────────────────

function NotifIcon({ type }: { type: Notif["type"] }) {
  const baseClass = "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0";

  if (type === "stamp") {
    return (
      <div className={baseClass} style={{ background: "#111111", boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF1F7D">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
      </div>
    );
  }
  if (type === "seat") {
    return (
      <div className={baseClass} style={{ background: "#FFF0F5", boxShadow: "0 2px 8px rgba(255,31,125,0.1)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
          <path d="M20 9V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2"/>
          <path d="M4 9h16v5a2 2 0 01-2 2H6a2 2 0 01-2-2V9z"/>
          <path d="M8 16v3"/><path d="M16 16v3"/>
        </svg>
      </div>
    );
  }
  if (type === "event") {
    return (
      <div className={baseClass} style={{ background: "#FFF5F8", boxShadow: "0 2px 8px rgba(255,31,125,0.08)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
    );
  }
  if (type === "celebrate") {
    return (
      <div className={baseClass} style={{ background: "#FFF8F0", boxShadow: "0 2px 8px rgba(255,105,180,0.1)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </div>
    );
  }
  if (type === "intro") {
    return (
      <div className={baseClass} style={{ background: "var(--light-pink)", boxShadow: "0 2px 8px rgba(255,31,125,0.1)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      </div>
    );
  }
  if (type === "message") {
    return (
      <div className={baseClass} style={{ background: "#FFF0F5", boxShadow: "0 2px 8px rgba(255,31,125,0.08)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      </div>
    );
  }
  // club
  return (
    <div className={baseClass} style={{ background: "#FFF0F5", boxShadow: "0 2px 8px rgba(255,31,125,0.08)" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    </div>
  );
}

function NotifRow({ n, selected, onClick }: { n: Notif; selected?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-start gap-3 p-4 rounded-2xl relative overflow-hidden transition-all"
      style={{
        background: selected ? "rgba(255,31,125,0.06)" : "white",
        boxShadow: n.unread
          ? "0 3px 16px rgba(255,31,125,0.1)"
          : "0 1px 8px rgba(0,0,0,0.06)",
        borderLeft: n.unread ? "3px solid var(--bb-pink)" : "3px solid transparent",
        cursor: onClick ? "pointer" : "default",
        outline: selected ? "1.5px solid var(--bb-pink)" : "none",
      }}
    >
      <NotifIcon type={n.type} />
      <div className="flex-1 min-w-0">
        <p
          className="text-sm leading-snug"
          style={{ color: "#111111", fontWeight: n.unread ? 700 : 500 }}
        >
          {n.title}
        </p>
        <p
          className="text-xs mt-1 leading-relaxed"
          style={{
            color: n.type === "stamp" ? "var(--bb-pink)" : "#999",
            fontStyle: n.type === "stamp" ? "italic" : "normal",
          }}
        >
          {n.body}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <p className="text-[11px]" style={{ color: "#ccc" }}>{n.time}</p>
        {n.unread && (
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--bb-pink)" }}
          />
        )}
      </div>
    </div>
  );
}

function actionLabelForType(type: Notif["type"]): string {
  if (type === "seat" || type === "event" || type === "celebrate") return "View Event →";
  if (type === "intro") return "See Introduction →";
  if (type === "message") return "Reply →";
  if (type === "stamp") return "View Stamp →";
  return "View →";
}

export default function NotificationsPage() {
  const [nowItems, setNowItems] = useState<Notif[]>(INITIAL_NOW);
  const [earlierItems, setEarlierItems] = useState<Notif[]>(INITIAL_EARLIER);
  const [selectedNotifId, setSelectedNotifId] = useState<number | null>(null);
  const [tod, setTod] = useState<TimeOfDay>("morning");

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
  }, []);

  const isNight = tod === "evening" || tod === "night";
  const isEvening = tod === "evening";
  const headingColor = isNight ? "rgba(240,232,255,0.92)" : "#111111";
  const textMuted = isNight ? "rgba(200,190,225,0.52)" : "#888";
  const cardBg = isNight ? (isEvening ? "#1E1830" : "#191428") : "white";
  const borderCol = isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  const allItems = [...nowItems, ...earlierItems];
  const unreadCount = allItems.filter((n) => n.unread).length;
  const selectedNotif = allItems.find((n) => n.id === selectedNotifId) ?? null;
  const topUnread = allItems.filter((n) => n.unread).slice(0, 3);

  function markAllRead() {
    setNowItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    setEarlierItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  return (
    <>
      {/* ── MOBILE ─────────────────────────────────────────────────────────── */}
      <div className="md:hidden min-h-screen pb-24" style={{ background: "var(--pale-pink-bg)" }}>
        {/* Header */}
        <div className="px-5 pt-12 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/member/home"
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1
                  className="text-3xl font-bold italic"
                  style={{
                    color: "var(--bb-black)",
                    fontFamily: "var(--font-playfair)",
                    fontWeight: 700,
                  }}
                >
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span
                    className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full text-sm font-bold text-white"
                    style={{
                      background: "var(--bb-pink)",
                      boxShadow: "0 2px 8px rgba(255,31,125,0.4)",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-semibold transition-colors"
                style={{ color: "var(--bb-pink)" }}
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="h-0.5 w-10 rounded-full" style={{ background: "var(--bb-pink)" }} />
        </div>

        <div className="px-5 flex flex-col gap-7">
          {/* Right Now */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-black)" }}>
                RIGHT NOW
              </p>
              <div className="flex-1 h-px" style={{ background: "var(--bb-pink)" }} />
            </div>
            <div className="flex flex-col gap-2.5">
              {nowItems.map((n) => <NotifRow key={n.id} n={n} />)}
            </div>
          </div>

          {/* Earlier */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#bbb" }}>
                EARLIER TODAY
              </p>
              <div className="flex-1 h-px" style={{ background: "#E8E8E8" }} />
            </div>
            <div className="flex flex-col gap-2.5">
              {earlierItems.map((n) => <NotifRow key={n.id} n={n} />)}
            </div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP 3-PANEL ────────────────────────────────────────────────── */}
      <div
        className="hidden md:flex md:flex-col"
        style={{ height: "100vh", background: "var(--pale-pink-bg)" }}
      >
        {/* Top bar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-6 border-b"
          style={{ height: "64px", borderColor: borderCol, background: cardBg }}
        >
          <div className="flex items-center gap-3">
            <p
              className="font-bold italic text-lg tracking-tight"
              style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
            >
              NOTIFICATIONS
            </p>
            {unreadCount > 0 && (
              <span
                className="inline-flex items-center justify-center min-w-[26px] h-6 px-2 rounded-full text-xs font-bold text-white"
                style={{ background: "var(--bb-pink)" }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ marginRight: "256px" }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-semibold px-4 py-2 rounded-full transition-all"
                style={{ color: "var(--bb-pink)", border: "1.5px solid rgba(255,31,125,0.3)" }}
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left panel — full notification list */}
          <div
            className="flex-shrink-0 overflow-y-auto border-r"
            style={{ width: "300px", borderColor: borderCol, background: cardBg }}
          >
            {/* Right now section */}
            <div className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: headingColor }}>RIGHT NOW</p>
                <div className="flex-1 h-px" style={{ background: "var(--bb-pink)" }} />
              </div>
              <div className="flex flex-col gap-2">
                {nowItems.map((n) => (
                  <NotifRow
                    key={n.id}
                    n={n}
                    selected={selectedNotifId === n.id}
                    onClick={() => setSelectedNotifId(n.id === selectedNotifId ? null : n.id)}
                  />
                ))}
              </div>
            </div>

            {/* Earlier section */}
            <div className="px-4 pt-2 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: textMuted }}>EARLIER TODAY</p>
                <div className="flex-1 h-px" style={{ background: borderCol }} />
              </div>
              <div className="flex flex-col gap-2">
                {earlierItems.map((n) => (
                  <NotifRow
                    key={n.id}
                    n={n}
                    selected={selectedNotifId === n.id}
                    onClick={() => setSelectedNotifId(n.id === selectedNotifId ? null : n.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Center panel — expanded notification view */}
          <div
            className="flex-1 overflow-y-auto flex items-center justify-center p-8"
            style={{ background: "var(--pale-pink-bg)" }}
          >
            {selectedNotif ? (
              <div className="w-full max-w-md">
                <div
                  className="rounded-3xl overflow-hidden p-8"
                  style={{
                    background: cardBg,
                    boxShadow: "0 8px 40px rgba(255,31,125,0.10)",
                    border: `1.5px solid ${borderCol}`,
                  }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <NotifIcon type={selectedNotif.type} />
                    <div className="flex-1">
                      <p
                        className="font-bold text-lg leading-snug mb-1"
                        style={{ color: headingColor, fontFamily: "var(--font-playfair)" }}
                      >
                        {selectedNotif.title}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: selectedNotif.type === "stamp" ? "var(--bb-pink)" : textMuted,
                          fontStyle: selectedNotif.type === "stamp" ? "italic" : "normal",
                        }}
                      >
                        {selectedNotif.body}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs mb-6" style={{ color: textMuted }}>{selectedNotif.time}</p>
                  <button
                    className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98]"
                    style={{ background: "var(--bb-pink)" }}
                  >
                    {actionLabelForType(selectedNotif.type)}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center px-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(255,31,125,0.08)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 01-3.46 0"/>
                  </svg>
                </div>
                <p
                  className="font-bold text-xl mb-2"
                  style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
                >
                  Your activity, all in one place
                </p>
                <p className="text-sm italic" style={{ fontFamily: "var(--font-instrument)", color: textMuted }}>
                  Select a notification to see the full details here.
                </p>
              </div>
            )}
          </div>

          {/* Right panel — What's Next */}
          <div
            className="flex-shrink-0 flex flex-col gap-3 p-4 overflow-y-auto border-l"
            style={{ width: "240px", borderColor: borderCol, background: cardBg }}
          >
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase pt-1" style={{ color: textMuted }}>
              WHAT&apos;S NEXT
            </p>
            {topUnread.length === 0 ? (
              <p className="text-xs italic" style={{ color: textMuted }}>All caught up!</p>
            ) : (
              topUnread.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNotifId(n.id)}
                  className="w-full text-left p-3 rounded-xl transition-all hover:opacity-80"
                  style={{
                    background: isNight ? "rgba(255,31,125,0.08)" : "rgba(255,31,125,0.05)",
                    border: "1px solid rgba(255,31,125,0.15)",
                  }}
                >
                  <p className="text-xs font-bold leading-snug mb-1" style={{ color: headingColor }}>{n.title}</p>
                  <p className="text-[10px] mb-2 truncate" style={{ color: textMuted }}>{n.body}</p>
                  <span
                    className="text-[9px] font-bold"
                    style={{ color: "var(--bb-pink)" }}
                  >
                    {actionLabelForType(n.type)}
                  </span>
                </button>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  );
}
