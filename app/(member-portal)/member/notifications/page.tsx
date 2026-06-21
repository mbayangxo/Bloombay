"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMyNotifications, markAllRead as markAllReadDB } from "@/lib/actions/notifications";
import type { Notification as DBNotif } from "@/lib/actions/notifications";

/* ── Types ──────────────────────────────────────────────────────── */
interface Notif {
  id: number;
  type: "seat" | "flower" | "event" | "celebrate" | "intro" | "message" | "club" | "club_accepted";
  title: string;
  body: string;
  time: string;
  unread: boolean;
  clubName?: string;
  clubCrest?: string;
  witnessId?: string;
}

/* ── Data ───────────────────────────────────────────────────────── */
const INITIAL_NOW: Notif[] = [
  {
    id: 0, type: "club_accepted",
    title: "You're in. Welcome to Lens & Light.",
    body: "Your application was accepted. Check your mailbox for a welcome note from the club.",
    time: "just now", unread: true,
    clubName: "Lens & Light", clubCrest: "📸",
  },
  {
    id: 1, type: "flower",
    title: "Kezia A. gave you a flower 🌸",
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
    id: 3, type: "flower",
    title: "Sofia K. gave you a flower 🌸",
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
    id: 7, type: "flower",
    title: "Priya R. gave you a flower 🌸",
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

/* ── Design ─────────────────────────────────────────────────────── */
const PINK = "#FF1F7D";

const CSS = ``;

type NoteTheme = {
  bg: string; pin: string; ruledColor: string;
  titleColor: string; bodyColor: string; rot: string;
};

const NOTE_THEMES: Record<Notif["type"], NoteTheme> = {
  flower:        { bg: "#FFFFFF", pin: "#FF1F7D", ruledColor: "rgba(255,31,125,0.05)", titleColor: "#111111", bodyColor: "#111111", rot: "0deg" },
  seat:          { bg: "#FFFFFF", pin: "#FF1F7D", ruledColor: "rgba(255,31,125,0.05)", titleColor: "#111111", bodyColor: "#111111", rot: "0deg" },
  event:         { bg: "#FFFFFF", pin: "#FF1F7D", ruledColor: "rgba(255,31,125,0.05)", titleColor: "#111111", bodyColor: "#111111", rot: "0deg" },
  celebrate:     { bg: "#FFFFFF", pin: "#FF1F7D", ruledColor: "rgba(255,31,125,0.05)", titleColor: "#111111", bodyColor: "#111111", rot: "0deg" },
  intro:         { bg: "#FFFFFF", pin: "#FF1F7D", ruledColor: "rgba(255,31,125,0.05)", titleColor: "#111111", bodyColor: "#111111", rot: "0deg" },
  message:       { bg: "#FFFFFF", pin: "#FF1F7D", ruledColor: "rgba(255,31,125,0.05)", titleColor: "#111111", bodyColor: "#111111", rot: "0deg" },
  club:          { bg: "#FFFFFF", pin: "#FF1F7D", ruledColor: "rgba(255,31,125,0.05)", titleColor: "#111111", bodyColor: "#111111", rot: "0deg" },
  club_accepted: { bg: "#FFF8F0", pin: "#FF1F7D", ruledColor: "rgba(255,31,125,0.06)", titleColor: "#111111", bodyColor: "#111111", rot: "0deg" },
};

/* ── Section label ───────────────────────────────────────────────── */
function TapeLabel({ text, faint }: { text: string; faint?: boolean }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{
        fontFamily: "var(--font-jost)",
        fontSize: "9px",
        fontWeight: 800,
        letterSpacing: "0.18em",
        color: faint ? "rgba(255,31,125,0.45)" : PINK,
        textTransform: "uppercase" as const,
      }}>
        {text}
      </p>
    </div>
  );
}

/* ── Note card ───────────────────────────────────────────────────── */
function NoteCard({ n }: { n: Notif }) {
  const isAccepted = n.type === "club_accepted";

  const inner = (
    <div style={{
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      padding: "14px 16px",
      position: "relative",
      boxShadow: "0 2px 10px rgba(255,31,125,0.06)",
      borderLeft: `3px solid ${PINK}`,
      border: `1px solid rgba(255,31,125,${n.unread ? "0.2" : "0.08"})`,
      borderLeftWidth: 3,
      borderLeftColor: PINK,
      minHeight: 80,
      cursor: "pointer",
    }}>
      {/* Unread dot */}
      {n.unread && (
        <div style={{
          position: "absolute", top: 10, right: 12,
          width: 7, height: 7, borderRadius: "50%",
          background: PINK, boxShadow: `0 0 6px ${PINK}88`,
        }}/>
      )}

      <div>
        {isAccepted && n.clubCrest && (
          <p style={{ fontSize: 18, marginBottom: 5, lineHeight: 1 }}>{n.clubCrest}</p>
        )}

        <p style={{
          fontFamily: "var(--font-playfair)",
          fontSize: 13,
          fontWeight: 700,
          fontStyle: "italic",
          color: "#111111",
          lineHeight: 1.4,
          marginBottom: 4,
          paddingRight: n.unread ? 16 : 0,
        }}>
          {n.title}
        </p>

        <p style={{
          fontFamily: "var(--font-jost)",
          fontSize: 11,
          color: "rgba(0,0,0,0.55)",
          lineHeight: 1.5,
          fontStyle: n.type === "flower" ? "italic" : "normal",
          marginBottom: 7,
        }}>
          {n.body}
        </p>

        <p style={{
          fontFamily: "var(--font-jost)",
          fontSize: "8px",
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: "rgba(0,0,0,0.25)",
        }}>
          {n.time.toUpperCase()}
        </p>

        {isAccepted && (
          <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
            <Link href="/member/messages" style={{
              flex: 1, padding: "7px 0",
              background: PINK, color: "white",
              borderRadius: 8, textAlign: "center", textDecoration: "none",
              fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.06em",
            }}>
              MAILBOX →
            </Link>
            <Link href="/member/clubs" style={{
              flex: 1, padding: "7px 0",
              background: "rgba(255,31,125,0.08)", color: PINK,
              borderRadius: 8, textAlign: "center", textDecoration: "none",
              fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.06em",
              border: "1px solid rgba(255,31,125,0.2)",
            }}>
              VIEW CLUB
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  if (n.type === "flower" && n.witnessId) {
    return (
      <Link href={`/member/witness/${n.witnessId}`} style={{ textDecoration: "none", display: "block" }}>
        {inner}
      </Link>
    );
  }
  return inner;
}

function dbNotifToUI(n: DBNotif, idx: number): Notif {
  const ago = (() => {
    const diff = Date.now() - new Date(n.created_at).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  })();
  return {
    id: idx,
    type: n.type as Notif["type"],
    title: n.title,
    body: n.body ?? "",
    time: ago,
    unread: !n.read,
    clubName: (n.data as Record<string,string> | null)?.clubName,
    clubCrest: (n.data as Record<string,string> | null)?.clubCrest,
    witnessId: (n.data as Record<string,string> | null)?.witnessId,
  };
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function NotificationsPage() {
  const [nowItems, setNowItems]         = useState<Notif[]>(INITIAL_NOW);
  const [earlierItems, setEarlierItems] = useState<Notif[]>(INITIAL_EARLIER);
  const [loaded, setLoaded]             = useState(false);

  const unreadCount = [...nowItems, ...earlierItems].filter(n => n.unread).length;
  const totalItems  = nowItems.length + earlierItems.length;

  // Load real notifications from DB; fall back to demo data if none
  useEffect(() => {
    getMyNotifications(40).then(data => {
      if (data.length > 0) {
        const cutoff = Date.now() - 3 * 3600000; // 3 hours ago
        const now     = data.filter(n => new Date(n.created_at).getTime() > cutoff).map(dbNotifToUI);
        const earlier = data.filter(n => new Date(n.created_at).getTime() <= cutoff).map(dbNotifToUI);
        setNowItems(now);
        setEarlierItems(earlier);
      }
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  function markAllRead() {
    setNowItems(p => p.map(n => ({ ...n, unread: false })));
    setEarlierItems(p => p.map(n => ({ ...n, unread: false })));
    markAllReadDB().catch(console.error);
  }
  useEffect(() => { if (loaded) markAllRead(); }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  function renderSection(items: Notif[], label: string, faint?: boolean) {
    if (items.length === 0) return null;
    return (
      <div style={{ padding: "0 16px", marginBottom: 6 }}>
        <TapeLabel text={label} faint={faint}/>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((n) => (
            <div key={n.id}>
              <NoteCard n={n}/>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      paddingBottom: 100,
      paddingTop: 70,
      backgroundColor: "#FFF8F0",
    }}>
      {/* Header */}
      <div style={{ padding: "0 18px 18px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-playfair)", fontSize: "clamp(24px, 7.5vw, 30px)", fontWeight: 900,
            fontStyle: "italic", color: "#111111", lineHeight: 1, marginBottom: 6,
          }}>
            Notifications.
          </h1>
          {unreadCount > 0 && (
            <span style={{
              display: "inline-block",
              background: PINK, color: "white", borderRadius: 999,
              padding: "2px 10px",
              fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800,
            }}>
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700,
              letterSpacing: "0.08em", color: "rgba(0,0,0,0.35)",
              paddingBottom: 6,
            }}
          >
            CLEAR ALL
          </button>
        )}
      </div>

      {/* Notes */}
      {totalItems > 0 ? (
        <>
          {renderSection(nowItems, "✦ right now")}
          {renderSection(earlierItems, "earlier today", true)}
        </>
      ) : (
        <div style={{ padding: "60px 24px", display: "flex", justifyContent: "center" }}>
          <div style={{
            background: "#FFFFFF",
            padding: "24px 32px",
            borderRadius: 16,
            border: "1px solid rgba(255,31,125,0.1)",
            boxShadow: "0 2px 10px rgba(255,31,125,0.06)",
            textAlign: "center",
          }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, fontWeight: 700, color: "#111111" }}>
              All caught up ✦
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.4)", marginTop: 6 }}>
              Nothing new right now.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
