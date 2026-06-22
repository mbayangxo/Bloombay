"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMyNotifications, markAllRead as markAllReadDB } from "@/lib/actions/notifications";
import type { Notification as DBNotif } from "@/lib/actions/notifications";

/* ── Types ──────────────────────────────────────────────────────── */
interface Notif {
  id: number;
  type: "seat" | "flower" | "event" | "celebrate" | "intro" | "message" | "club";
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
    time: "2h ago", unread: false,
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

/* ── Design constants ────────────────────────────────────────────── */
const PINK = "#FF1F7D";

const ROTATIONS = [-2.5, 1.8, -1.2, 3, -0.8, 2.2, -3, 1, -1.8, 2.5];

const PILL_STYLES: Record<Notif["type"], { bg: string; border: string; icon: string }> = {
  flower:    { bg: "rgba(255,31,125,0.15)",  border: "rgba(255,105,180,0.45)", icon: "🌸" },
  seat:      { bg: "rgba(34,197,94,0.1)",    border: "rgba(34,197,94,0.35)",   icon: "✦"  },
  event:     { bg: "rgba(255,155,112,0.12)", border: "rgba(255,155,112,0.4)",  icon: "📍" },
  celebrate: { bg: "rgba(255,31,125,0.1)",   border: "rgba(255,31,125,0.3)",   icon: "🎂" },
  intro:     { bg: "rgba(192,132,252,0.1)",  border: "rgba(192,132,252,0.35)", icon: "✨" },
  message:   { bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.3)",   icon: "💬" },
  club:      { bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.3)",   icon: "🌿" },
};

/* ── Pill component ──────────────────────────────────────────────── */
function NotifPill({ n, index }: { n: Notif; index: number }) {
  const style = PILL_STYLES[n.type] ?? PILL_STYLES.message;
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const isUnread = n.unread;

  // Mute border opacity for read pills
  const borderColor = isUnread
    ? style.border
    : style.border.replace(/[\d.]+\)$/, (m) => {
        const num = parseFloat(m);
        return `${(num * 0.45).toFixed(2)})`;
      });

  const pillContent = (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      backgroundColor: style.bg,
      border: `1px solid ${borderColor}`,
      borderRadius: 999,
      padding: isUnread ? "8px 14px" : "6px 12px",
      transform: `rotate(${rotation}deg)`,
      cursor: "pointer",
      position: "relative" as const,
      maxWidth: 280,
      opacity: isUnread ? 1 : 0.7,
    }}>
      {/* icon */}
      <span style={{ fontSize: isUnread ? 14 : 12, lineHeight: 1, flexShrink: 0 }}>
        {style.icon}
      </span>

      {/* text */}
      <span style={{
        fontFamily: "var(--font-jost)",
        fontSize: isUnread ? "12px" : "11px",
        fontWeight: isUnread ? 700 : 500,
        color: isUnread ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
        lineHeight: 1.3,
        whiteSpace: "nowrap" as const,
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: isUnread ? 200 : 190,
      }}>
        {n.title}
      </span>

      {/* unread dot */}
      {isUnread && (
        <span style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: PINK,
          boxShadow: `0 0 5px ${PINK}`,
          flexShrink: 0,
          marginLeft: 2,
        }} />
      )}
    </div>
  );

  if (n.type === "flower" && n.witnessId) {
    return (
      <Link href={`/member/witness/${n.witnessId}`} style={{ textDecoration: "none", display: "inline-block" }}>
        {pillContent}
      </Link>
    );
  }
  return <div style={{ display: "inline-block" }}>{pillContent}</div>;
}

/* ── Section label ───────────────────────────────────────────────── */
function SectionLabel({ text, faint }: { text: string; faint?: boolean }) {
  return (
    <div style={{ width: "100%", textAlign: "center", marginBottom: 10, marginTop: 4 }}>
      <span style={{
        fontFamily: "var(--font-jost)",
        fontSize: "9px",
        fontWeight: 800,
        letterSpacing: "0.18em",
        color: faint ? "rgba(255,31,125,0.4)" : PINK,
        textTransform: "uppercase" as const,
      }}>
        {text}
      </span>
    </div>
  );
}

/* ── DB helper ───────────────────────────────────────────────────── */
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
  // map club_accepted -> club so it fits the union type
  const rawType = n.type as string;
  const type: Notif["type"] = (rawType === "club_accepted" ? "club" : rawType) as Notif["type"];
  return {
    id: idx,
    type,
    title: n.title,
    body: n.body ?? "",
    time: ago,
    unread: !n.read,
    clubName: (n.data as Record<string, string> | null)?.clubName,
    clubCrest: (n.data as Record<string, string> | null)?.clubCrest,
    witnessId: (n.data as Record<string, string> | null)?.witnessId,
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

  return (
    <div style={{
      minHeight: "100vh",
      paddingBottom: 100,
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 70px)",
      backgroundColor: "#0C0818",
    }}>
      {/* Header */}
      <div style={{
        padding: "0 18px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(28px, 8vw, 34px)",
            fontWeight: 700,
            fontStyle: "italic",
            color: "white",
            lineHeight: 1,
            margin: 0,
          }}>
            Pin Drops.
          </h1>
          {unreadCount > 0 && (
            <span style={{
              display: "inline-block",
              background: PINK,
              color: "white",
              borderRadius: 999,
              padding: "3px 10px",
              fontFamily: "var(--font-jost)",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.04em",
            }}>
              {unreadCount} new
            </span>
          )}
        </div>

        <button
          onClick={markAllRead}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-jost)",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.3)",
            padding: "4px 0",
          }}
        >
          CLEAR ALL
        </button>
      </div>

      {/* Pills layout */}
      {totalItems > 0 ? (
        <div style={{ padding: "0 16px" }}>
          {/* RIGHT NOW section */}
          {nowItems.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SectionLabel text="RIGHT NOW" />
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 10,
                padding: "10px 16px",
              }}>
                {nowItems.map((n, i) => (
                  <NotifPill key={n.id} n={n} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* EARLIER section */}
          {earlierItems.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SectionLabel text="EARLIER" faint />
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 10,
                padding: "10px 16px",
              }}>
                {earlierItems.map((n, i) => (
                  <NotifPill key={n.id} n={n} index={i + nowItems.length} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: "60px 24px", display: "flex", justifyContent: "center" }}>
          <div style={{
            padding: "24px 32px",
            borderRadius: 20,
            border: "1px solid rgba(255,31,125,0.15)",
            background: "rgba(255,31,125,0.05)",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: 18,
              fontWeight: 700,
              color: "rgba(255,255,255,0.8)",
            }}>
              All caught up ✦
            </p>
            <p style={{
              fontFamily: "var(--font-jost)",
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
              marginTop: 6,
            }}>
              Nothing new right now.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
