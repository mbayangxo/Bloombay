"use client";

import Link from "next/link";

interface Notif {
  id: number;
  type: "seat" | "stamp" | "event" | "celebrate" | "intro" | "message" | "club";
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const NOW: Notif[] = [
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

const EARLIER: Notif[] = [
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
  if (type === "stamp") {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#111111" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF1F7D">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
      </div>
    );
  }
  if (type === "seat") {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FFF0F5" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
          <path d="M20 9V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2"/><path d="M4 9h16v5a2 2 0 01-2 2H6a2 2 0 01-2-2V9z"/>
          <path d="M8 16v3"/><path d="M16 16v3"/>
        </svg>
      </div>
    );
  }
  if (type === "event") {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FFF5F8" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
    );
  }
  if (type === "celebrate") {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FFF8E8" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </div>
    );
  }
  if (type === "intro") {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#E8F9F0" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      </div>
    );
  }
  if (type === "message") {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#EEF0FF" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      </div>
    );
  }
  // club
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FFF0F5" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    </div>
  );
}

function NotifRow({ n }: { n: Notif }) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
      style={{ background: n.unread ? "#FFF5F8" : "white" }}
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
          className="text-xs mt-0.5 leading-relaxed"
          style={{
            color: n.type === "stamp" ? "#FF1F7D" : "#888",
            fontStyle: n.type === "stamp" ? "italic" : "normal",
          }}
        >
          {n.body}
        </p>
      </div>
      <p className="text-[11px] text-gray-400 flex-shrink-0 mt-0.5">{n.time}</p>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <div className="min-h-screen pb-36" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5 flex items-center gap-3">
        <Link
          href="/member/home"
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "white" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: "var(--bb-black)", fontFamily: "var(--font-playfair)" }}>
          Notifications
        </h1>
      </div>

      <div className="px-5 flex flex-col gap-6">
        {/* Right Now */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--bb-pink)" }}>
            RIGHT NOW
          </p>
          <div className="flex flex-col gap-1.5">
            {NOW.map((n) => <NotifRow key={n.id} n={n} />)}
          </div>
        </div>

        {/* Earlier */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-3 text-gray-400">EARLIER</p>
          <div className="flex flex-col gap-1.5">
            {EARLIER.map((n) => <NotifRow key={n.id} n={n} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
