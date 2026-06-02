"use client";

import { useState } from "react";
import Link from "next/link";

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

function NotifRow({ n }: { n: Notif }) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-2xl relative overflow-hidden"
      style={{
        background: n.unread ? "white" : "white",
        boxShadow: n.unread
          ? "0 3px 16px rgba(255,31,125,0.1)"
          : "0 1px 8px rgba(0,0,0,0.06)",
        borderLeft: n.unread ? "3px solid var(--bb-pink)" : "3px solid transparent",
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

export default function NotificationsPage() {
  const [nowItems, setNowItems] = useState<Notif[]>(INITIAL_NOW);
  const [earlierItems, setEarlierItems] = useState<Notif[]>(INITIAL_EARLIER);

  const unreadCount = [...nowItems, ...earlierItems].filter((n) => n.unread).length;

  function markAllRead() {
    setNowItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    setEarlierItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  return (
    <div className="min-h-screen pb-36" style={{ background: "var(--pale-pink-bg)" }}>
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
  );
}
