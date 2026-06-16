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

const CSS = `
@keyframes pinBob {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  30%       { transform: translateY(-2px) rotate(2.5deg); }
  70%       { transform: translateY(-1px) rotate(-1.5deg); }
}
.pin-bob { animation: pinBob 4s ease-in-out infinite; }
`;

type NoteTheme = {
  bg: string; pin: string; ruledColor: string;
  titleColor: string; bodyColor: string; rot: string;
};

const NOTE_THEMES: Record<Notif["type"], NoteTheme> = {
  flower:        { bg: "#FFF0F8", pin: "#FF1F7D", ruledColor: "rgba(255,0,144,0.08)", titleColor: "#7A0040", bodyColor: "#9D174D", rot: "-1.5deg" },
  seat:          { bg: "#FFF0F5", pin: "#FF1F7D", ruledColor: "rgba(255,31,125,0.08)", titleColor: "#831843", bodyColor: "#9D174D", rot: "1.2deg"  },
  event:         { bg: "#EEF2FF", pin: "#4F46E5", ruledColor: "rgba(79,70,229,0.1)",   titleColor: "#312E81", bodyColor: "#3730A3", rot: "-0.8deg" },
  celebrate:     { bg: "#FFF7ED", pin: "#EA580C", ruledColor: "rgba(234,88,12,0.09)",  titleColor: "#7C2D12", bodyColor: "#9A3412", rot: "1.8deg"  },
  intro:         { bg: "#F0FFF4", pin: "#16A34A", ruledColor: "rgba(22,163,74,0.1)",   titleColor: "#14532D", bodyColor: "#166534", rot: "-1.2deg" },
  message:       { bg: "#F0F9FF", pin: "#0284C7", ruledColor: "rgba(2,132,199,0.09)",  titleColor: "#0C4A6E", bodyColor: "#075985", rot: "0.7deg"  },
  club:          { bg: "#FAF5FF", pin: "#7C3AED", ruledColor: "rgba(124,58,237,0.09)", titleColor: "#4C1D95", bodyColor: "#5B21B6", rot: "-0.5deg" },
  club_accepted: { bg: "#0F0B04", pin: "#D4A853", ruledColor: "rgba(212,168,83,0.12)", titleColor: "#FEF3C7", bodyColor: "#FDE68A", rot: "0.8deg"  },
};

/* ── Pushpin SVG ─────────────────────────────────────────────────── */
function PushPin({ color }: { color: string }) {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
      <circle cx="7" cy="6.5" r="5.5" fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="0.8"/>
      <ellipse cx="5.2" cy="4.8" rx="1.6" ry="1.1" fill="rgba(255,255,255,0.38)"/>
      <rect x="6.1" y="12" width="1.8" height="8" rx="0.9" fill={color} opacity="0.8"/>
      <circle cx="7" cy="20.5" r="0.9" fill={color}/>
    </svg>
  );
}

/* ── Tape label ──────────────────────────────────────────────────── */
function TapeLabel({ text, faint }: { text: string; faint?: boolean }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        display: "inline-block",
        background: faint ? "rgba(255,252,195,0.65)" : "rgba(255,252,195,0.88)",
        padding: "3px 14px 4px",
        transform: faint ? "rotate(0.3deg)" : "rotate(-0.6deg)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
      }}>
        <p style={{
          fontFamily: "var(--font-caveat)", fontSize: 14, fontWeight: 700,
          color: faint ? "#7A5F00" : "#5A3E00", letterSpacing: "0.01em",
        }}>
          {text}
        </p>
      </div>
    </div>
  );
}

/* ── Note card ───────────────────────────────────────────────────── */
function NoteCard({ n }: { n: Notif }) {
  const th = NOTE_THEMES[n.type];
  const isGold = n.type === "club_accepted";

  const inner = (
    <div style={{
      backgroundColor: th.bg,
      backgroundImage: `repeating-linear-gradient(transparent, transparent 22px, ${th.ruledColor} 22px, ${th.ruledColor} 23px)`,
      borderRadius: 2,
      padding: "24px 13px 14px",
      position: "relative",
      transform: `rotate(${th.rot})`,
      boxShadow: "0 4px 16px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.04)",
      border: isGold ? "1px solid rgba(212,168,83,0.35)" : "none",
      minHeight: 110,
      cursor: "pointer",
    }}>
      {/* Pushpin */}
      <div className="pin-bob" style={{
        position: "absolute", top: -9, left: "50%",
        transform: "translateX(-50%)", zIndex: 3, pointerEvents: "none",
      }}>
        <PushPin color={th.pin}/>
      </div>

      {/* Unread dot */}
      {n.unread && !isGold && (
        <div style={{
          position: "absolute", top: 8, right: 8,
          width: 7, height: 7, borderRadius: "50%",
          background: PINK, boxShadow: `0 0 6px ${PINK}88`,
        }}/>
      )}

      <div style={{ position: "relative", zIndex: 2 }}>
        {isGold && n.clubCrest && (
          <p style={{ fontSize: 20, marginBottom: 5, lineHeight: 1 }}>{n.clubCrest}</p>
        )}

        <p style={{
          fontFamily: "var(--font-caveat)",
          fontSize: 13,
          fontWeight: 700,
          color: th.titleColor,
          lineHeight: 1.45,
          marginBottom: 4,
        }}>
          {n.title}
        </p>

        <p style={{
          fontFamily: "var(--font-caveat)",
          fontSize: 11.5,
          color: th.bodyColor,
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
          color: isGold ? "rgba(212,168,83,0.45)" : "rgba(0,0,0,0.25)",
        }}>
          {n.time.toUpperCase()}
        </p>

        {isGold && (
          <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
            <Link href="/member/messages" style={{
              flex: 1, padding: "7px 0",
              background: PINK, color: "white",
              borderRadius: 4, textAlign: "center", textDecoration: "none",
              fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.06em",
            }}>
              MAILBOX →
            </Link>
            <Link href="/member/clubs" style={{
              flex: 1, padding: "7px 0",
              background: "rgba(212,168,83,0.12)", color: "#D4A853",
              borderRadius: 4, textAlign: "center", textDecoration: "none",
              fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.06em",
              border: "1px solid rgba(212,168,83,0.25)",
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {items.map((n, i) => (
            <div
              key={n.id}
              style={{
                gridColumn: n.type === "club_accepted" ? "span 2" : undefined,
                marginTop: n.type !== "club_accepted" && i % 2 !== 0 ? 12 : 0,
              }}
            >
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
      backgroundColor: "#C0975C",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.35'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23A07040' filter='url(%23n)' opacity='0.2'/%3E%3C/svg%3E")`,
      backgroundSize: "200px 200px",
    }}>
      <style>{CSS}</style>

      {/* Board header */}
      <div style={{ padding: "0 18px 18px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{
            display: "inline-block",
            background: "rgba(255,252,200,0.9)",
            padding: "4px 16px 5px",
            transform: "rotate(-0.8deg)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}>
            <h1 style={{
              fontFamily: "var(--font-playfair)", fontSize: 30, fontWeight: 900,
              fontStyle: "italic", color: "#3A2800", lineHeight: 1,
            }}>
              Pin Drops.
            </h1>
          </div>
          {unreadCount > 0 && (
            <span style={{
              display: "inline-block", marginLeft: 10, marginBottom: 3,
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
              letterSpacing: "0.08em", color: "rgba(255,255,255,0.65)",
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
            background: "rgba(255,252,200,0.88)",
            padding: "24px 32px",
            transform: "rotate(-1deg)",
            boxShadow: "0 4px 18px rgba(0,0,0,0.22)",
            textAlign: "center",
          }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 20, fontWeight: 700, color: "#5A3E00" }}>
              All caught up ✦
            </p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#8A6000", marginTop: 4 }}>
              Nothing new on the board.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
