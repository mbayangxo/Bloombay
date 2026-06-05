"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Notif {
  id: number;
  type: "seat" | "stamp" | "event" | "celebrate" | "intro" | "message" | "club" | "club_accepted";
  title: string;
  body: string;
  time: string;
  unread: boolean;
  clubName?: string;
  clubCrest?: string;
  witnessId?: string;
}

const INITIAL_NOW: Notif[] = [
  {
    id: 0, type: "club_accepted",
    title: "You're in. Welcome to Lens & Light.",
    body: "Your application was accepted. Check your mailbox for a welcome note from the club.",
    time: "just now", unread: true,
    clubName: "Lens & Light", clubCrest: "📸",
  },
  {
    id: 1, type: "stamp",
    title: "Kezia A. witnessed you",
    body: '"She makes every table feel full."',
    time: "4m ago", unread: true,
    witnessId: "kezia",
  },
  {
    id: 2, type: "seat",
    title: "You grabbed a seat",
    body: "Girls dinner · Carbone · Tonight 7:30PM",
    time: "12m ago", unread: true,
  },
  {
    id: 3, type: "stamp",
    title: "Sofia K. witnessed you",
    body: '"You made the whole table feel like home."',
    time: "28m ago", unread: true,
    witnessId: "sofia",
  },
  {
    id: 4, type: "event",
    title: "Paint + sip + dinner is almost full",
    body: "2 seats left · Tonight 7PM",
    time: "45m ago", unread: true,
  },
];

const INITIAL_EARLIER: Notif[] = [
  {
    id: 5, type: "celebrate",
    title: "Show up for Aaliyah M.",
    body: "Birthday picnic · Sat 2PM · Prospect Park · 4 seats",
    time: "2h ago", unread: true,
  },
  {
    id: 6, type: "club",
    title: "Dinner Society posted a new seat",
    body: "Girls brunch · Ladurée SoHo · Sat 11AM · $1 deposit",
    time: "4h ago", unread: false,
  },
  {
    id: 7, type: "stamp",
    title: "Priya R. witnessed you",
    body: '"You made everyone feel welcome. That\'s a rare thing."',
    time: "5h ago", unread: false,
    witnessId: "priya",
  },
  {
    id: 8, type: "event",
    title: "Wine & Style Night · Dinner Society",
    body: "Tomorrow 7PM · 4 seats left",
    time: "5h ago", unread: false,
  },
  {
    id: 9, type: "intro",
    title: "Yande thinks you and Kezia N. would vibe",
    body: '"You both love museums and independent bookstores."',
    time: "1d ago", unread: false,
  },
  {
    id: 10, type: "message",
    title: "New message from Naomi B.",
    body: "Quick question about the rooftop gathering...",
    time: "1d ago", unread: false,
  },
  {
    id: 11, type: "seat",
    title: "Your seat was confirmed",
    body: "Pilates + matcha morning · Sunday 9AM · Studio Bloom",
    time: "2d ago", unread: false,
  },
];

// ── Icons ─────────────────────────────────────────────────────────────────────

function NotifIcon({ type }: { type: Notif["type"] }) {
  const baseClass = "w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0";

  if (type === "stamp") {
    return (
      <div className={baseClass} style={{ background: "#110508", border: "1px solid rgba(255,31,125,0.2)", boxShadow: "0 2px 10px rgba(255,31,125,0.2)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="1.8" strokeLinecap="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3" fill="#FF1F7D" stroke="none"/>
        </svg>
      </div>
    );
  }
  if (type === "club_accepted") {
    return (
      <div className={baseClass} style={{ background: "#111111", border: "1px solid rgba(255,31,125,0.3)", boxShadow: "0 4px 16px rgba(255,31,125,0.25)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
    );
  }
  if (type === "seat") {
    return (
      <div className={baseClass} style={{ background: "#FFF0F5" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
          <path d="M20 9V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2"/>
          <path d="M4 9h16v5a2 2 0 01-2 2H6a2 2 0 01-2-2V9z"/>
          <path d="M8 16v3"/><path d="M16 16v3"/>
        </svg>
      </div>
    );
  }
  if (type === "event") {
    return (
      <div className={baseClass} style={{ background: "#FFF5F8" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
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
      <div className={baseClass} style={{ background: "#FFF8F0" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </div>
    );
  }
  if (type === "intro") {
    return (
      <div className={baseClass} style={{ background: "#FFF0F5" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
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
      <div className={baseClass} style={{ background: "#FFF0F5" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      </div>
    );
  }
  // club
  return (
    <div className={baseClass} style={{ background: "#FFF0F5" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    </div>
  );
}

// ── Club Accepted hero card ────────────────────────────────────────────────────

function ClubAcceptedPing({ n }: { n: Notif }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "#111111", boxShadow: "0 6px 28px rgba(255,31,125,0.2)" }}>
      <div className="relative px-5 pt-5 pb-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 90% 20%, rgba(255,31,125,0.18) 0%, transparent 60%)" }} />
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10"
          style={{ background: "rgba(255,31,125,0.15)", border: "1.5px solid rgba(255,31,125,0.3)", fontSize: "22px" }}>
          {n.clubCrest}
        </div>
        <div className="flex-1 min-w-0 relative z-10">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: "#FF1F7D" }}>✓ ACCEPTED</p>
          <p className="text-sm font-bold leading-snug" style={{ color: "rgba(255,238,220,0.92)" }}>{n.title}</p>
        </div>
        <p className="text-[10px] flex-shrink-0 relative z-10" style={{ color: "rgba(255,255,255,0.25)" }}>{n.time}</p>
      </div>
      <div className="px-5 py-3">
        <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>{n.body}</p>
        <div className="flex gap-2">
          <Link href="/member/messages"
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center transition-all active:scale-95"
            style={{ background: "#FF1F7D", color: "white" }}>
            Open Mailbox →
          </Link>
          <Link href="/member/clubs"
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)" }}>
            View Club
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Ping row ──────────────────────────────────────────────────────────────────

function NotifRow({ n }: { n: Notif }) {
  if (n.type === "club_accepted") return <ClubAcceptedPing n={n} />;

  const isWitness = n.type === "stamp";

  const inner = (
    <div className="flex items-start gap-3 p-4 rounded-2xl relative overflow-hidden transition-all active:scale-[0.98]"
      style={{
        background: isWitness ? "#0D0508" : "white",
        boxShadow: n.unread
          ? isWitness ? "0 4px 20px rgba(255,31,125,0.18)" : "0 3px 16px rgba(255,31,125,0.1)"
          : "0 1px 8px rgba(0,0,0,0.06)",
        border: isWitness ? "1px solid rgba(255,31,125,0.18)" : "none",
        borderLeft: n.unread ? `3px solid ${isWitness ? "#FF1F7D" : "#FF1F7D"}` : "3px solid transparent",
      }}>
      <NotifIcon type={n.type} />
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug"
          style={{ color: isWitness ? "rgba(255,235,215,0.9)" : "#111111", fontWeight: n.unread ? 700 : 500 }}>
          {n.title}
        </p>
        <p className="text-xs mt-1 leading-relaxed"
          style={{ color: isWitness ? "#FF69B4" : "#999", fontStyle: isWitness ? "italic" : "normal" }}>
          {n.body}
        </p>
        {isWitness && (
          <p className="text-[9px] mt-1.5 font-bold tracking-wide" style={{ color: "rgba(255,31,125,0.5)" }}>
            Tap to read the full note →
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <p className="text-[11px]" style={{ color: isWitness ? "rgba(255,255,255,0.2)" : "#ccc" }}>{n.time}</p>
        {n.unread && <div className="w-2 h-2 rounded-full" style={{ background: "#FF1F7D" }} />}
      </div>
    </div>
  );

  if (isWitness && n.witnessId) {
    return <Link href={`/member/witness/${n.witnessId}`} style={{ textDecoration: "none" }}>{inner}</Link>;
  }
  return inner;
}

// ── Section header ─────────────────────────────────────────────────────────────

function SectionHeader({ label, faint }: { label: string; faint?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <p className="text-[10px] font-bold tracking-[0.26em] uppercase flex-shrink-0"
        style={{ color: faint ? "#bbb" : "#111" }}>
        {label}
      </p>
      <div className="flex-1 h-px" style={{ background: faint ? "#E8E8E8" : "rgba(255,31,125,0.35)" }} />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [nowItems, setNowItems]         = useState<Notif[]>(INITIAL_NOW);
  const [earlierItems, setEarlierItems] = useState<Notif[]>(INITIAL_EARLIER);

  const unreadCount = [...nowItems, ...earlierItems].filter(n => n.unread).length;
  const totalItems  = nowItems.length + earlierItems.length;

  function markAllRead() {
    setNowItems(prev => prev.map(n => ({ ...n, unread: false })));
    setEarlierItems(prev => prev.map(n => ({ ...n, unread: false })));
  }

  useEffect(() => { markAllRead(); }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--pale-pink-bg)" }}>

      {/* ── Dark atmospheric header ────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "#0A0508", paddingBottom: "32px" }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 60% 0%, rgba(255,31,125,0.14) 0%, transparent 65%)" }} />

        {/* Top bar */}
        <div className="relative flex items-center justify-between px-5 pt-14 pb-0 md:pt-10">
          <Link href="/member/home"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2.2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
          <p className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: "rgba(255,31,125,0.65)" }}>
            ✦ PINGS
          </p>
          {unreadCount > 0 ? (
            <button onClick={markAllRead}
              className="text-[10px] font-semibold transition-all active:opacity-60"
              style={{ color: "rgba(255,31,125,0.7)" }}>
              Mark read
            </button>
          ) : (
            <div className="w-16" />
          )}
        </div>

        {/* Big title */}
        <div className="relative px-5 pt-5 pb-0">
          <div className="flex items-end gap-3">
            <h1 className="font-black italic leading-none"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(52px,13vw,72px)", color: "rgba(255,238,220,0.92)", lineHeight: 0.9 }}>
              Pings.
            </h1>
            {unreadCount > 0 && (
              <span className="text-sm font-bold px-3 py-1.5 rounded-full text-white mb-1"
                style={{ background: "#FF1F7D", boxShadow: "0 3px 12px rgba(255,31,125,0.45)" }}>
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-[11px] italic mt-2" style={{ color: "rgba(255,255,255,0.28)", fontFamily: "var(--font-instrument)" }}>
            What's happening in your world.
          </p>
        </div>

        {/* Fade to content */}
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--pale-pink-bg))" }} />
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="px-5 pb-28 flex flex-col gap-7 pt-2">
        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p style={{ fontSize: "44px", opacity: 0.22 }}>✦</p>
            <p className="font-black italic text-center"
              style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,238,220,0.38)", fontSize: "22px" }}>
              All caught up.
            </p>
            <p className="text-xs text-center leading-relaxed"
              style={{ color: "rgba(255,255,255,0.18)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
              When something happens in your world,<br />it will show up here.
            </p>
          </div>
        ) : (
          <>
            {/* Right Now */}
            {nowItems.length > 0 && (
              <div>
                <SectionHeader label="RIGHT NOW" />
                <div className="flex flex-col gap-2.5">
                  {nowItems.map(n => <NotifRow key={n.id} n={n} />)}
                </div>
              </div>
            )}

            {/* Earlier */}
            {earlierItems.length > 0 && (
              <div>
                <SectionHeader label="EARLIER TODAY" faint />
                <div className="flex flex-col gap-2.5">
                  {earlierItems.map(n => <NotifRow key={n.id} n={n} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
