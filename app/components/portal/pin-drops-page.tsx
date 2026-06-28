"use client";

import { useEffect, useState, useCallback } from "react";
import { PinDropCompose } from "./pin-drop-compose";
import "@/app/styles/bloom-entrance.css";

const PINK = "#FF1F7D";
const BG   = "var(--bb-page-bg, #FFF0F6)";

interface PersonalPin  { id: string; location: string; caption: string | null; expires_at: string; created_at: string; }
interface ReceivedPin  { id: string; location: string; caption: string | null; expires_at: string; sent_at: string; sender_name: string; sender_avatar: string | null; kind: "received"; }
interface ClubPin      { id: string; location: string; caption: string; club_name: string | null; sent_at: string; type: "club"; }

type PinItem =
  | ({ kind: "personal" } & PersonalPin)
  | ({ kind: "received" } & ReceivedPin)
  | ({ kind: "club" }    & ClubPin);

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function expiresIn(iso: string) {
  const h = Math.round((new Date(iso).getTime() - Date.now()) / 3600000);
  if (h < 1) return "expires soon";
  if (h < 24) return `${h}h left`;
  return `${Math.round(h / 24)}d left`;
}

const PILL_COLORS = [
  { bg: "#FF1F7D", border: "rgba(255,31,125,0.5)",   text: "#FFFFFF" },
  { bg: "#FFFFFF",  border: "rgba(255,31,125,0.3)",   text: "#FF1F7D" },
  { bg: "#FF69B4", border: "rgba(255,105,180,0.5)",  text: "#FFFFFF" },
  { bg: "#1C1B1C", border: "rgba(0,0,0,0.3)",        text: "#FFFFFF" },
  { bg: "#FFF0F6", border: "rgba(255,31,125,0.25)",  text: "#FF1F7D" },
  { bg: "#FF1F7D", border: "rgba(255,31,125,0.5)",   text: "#FFFFFF" },
];

// Scattered layout: each pill gets a % position and slight rotation
const SCATTER: { top: string; left: string; rot: number }[] = [
  { top: "8%",  left: "12%", rot: -3 },
  { top: "6%",  left: "52%", rot:  2 },
  { top: "18%", left: "30%", rot: -5 },
  { top: "22%", left: "62%", rot:  4 },
  { top: "32%", left: "5%",  rot:  3 },
  { top: "36%", left: "45%", rot: -2 },
  { top: "46%", left: "18%", rot:  5 },
  { top: "48%", left: "58%", rot: -4 },
  { top: "58%", left: "8%",  rot:  2 },
  { top: "60%", left: "42%", rot: -3 },
  { top: "70%", left: "22%", rot:  4 },
  { top: "72%", left: "60%", rot: -2 },
];

function PinPill({ pin, idx }: { pin: PinItem; idx: number }) {
  const pos   = SCATTER[idx % SCATTER.length];
  const color = PILL_COLORS[idx % PILL_COLORS.length];
  const label = pin.kind === "club"
    ? (pin.club_name ?? "Club")
    : pin.kind === "received"
    ? pin.sender_name
    : "You";
  const time = pin.kind === "personal"
    ? expiresIn(pin.expires_at)
    : timeAgo(pin.kind === "received" ? pin.sent_at : pin.sent_at);

  return (
    <div style={{
      position: "absolute",
      top: pos.top,
      left: pos.left,
      transform: `rotate(${pos.rot}deg)`,
      background: color.bg,
      border: `1.5px solid ${color.border}`,
      borderRadius: 999,
      padding: "10px 18px",
      backdropFilter: "blur(12px)",
      boxShadow: `0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
      maxWidth: 180,
      cursor: "default",
    }}>
      <p style={{
        fontFamily: "var(--font-jost)",
        fontSize: 13,
        fontWeight: 700,
        color: color.text,
        margin: 0,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: 150,
      }}>
        {pin.location}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK, letterSpacing: "0.08em" }}>
          {label.toUpperCase()}
        </span>
        <span style={{ width: 2, height: 2, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
        <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>
          {time}
        </span>
      </div>
    </div>
  );
}

export function PinDropsPage() {
  const [pins, setPins]     = useState<PinItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPins = useCallback(() => {
    setLoading(true);
    fetch("/api/member/pin-drops")
      .then((r) => (r.ok ? r.json() : { mine: [], received: [], club_pins: [] }))
      .then(({ mine, received, club_pins }) => {
        const all: PinItem[] = [
          ...(mine as PersonalPin[]).map((p) => ({ kind: "personal" as const, ...p })),
          ...(received as ReceivedPin[]),
          ...(club_pins as ClubPin[]).map((p) => ({ kind: "club" as const, ...p })),
        ];
        all.sort((a, b) => {
          const t = (x: PinItem) => x.kind === "personal" ? x.created_at : x.kind === "received" ? x.sent_at : x.sent_at;
          return new Date(t(b)).getTime() - new Date(t(a)).getTime();
        });
        setPins(all);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { loadPins(); }, [loadPins]);

  // Fallback preview pills when no real data
  const PREVIEW_PILLS = [
    { label: "Dinner Society", sub: "SoHo · tonight" },
    { label: "Museum Meetup",  sub: "Sofia K. · 2h ago" },
    { label: "Rooftop Girls",  sub: "Club · 5m ago" },
    { label: "Book Night",     sub: "You · expires in 3h" },
    { label: "Wine & Style",   sub: "Priya K. · 1h ago" },
    { label: "Sunday Brunch",  sub: "Club Mama · now" },
    { label: "Gallery Walk",   sub: "Amara · 30m ago" },
    { label: "Soft Life Club", sub: "You · expires in 6h" },
  ];

  return (
    <div style={{
      background: BG,
      minHeight: "100vh",
      paddingBottom: 120,
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 64px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Radial glow behind */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 300, height: 300, borderRadius: "50%",
        background: `radial-gradient(circle, ${PINK}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ padding: "0 22px 24px", position: "relative", zIndex: 2 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: `${PINK}99`, marginBottom: 6 }}>
          YOUR DROPS
        </p>
        <h1 style={{
          fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900,
          fontSize: 42, color: "white", margin: 0, lineHeight: 1,
        }}>
          Pin Drops.
        </h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.38)", marginTop: 6 }}>
          where you&apos;ve been dropped in ✦
        </p>
      </div>

      {/* Compose */}
      <div style={{ padding: "0 22px 16px", position: "relative", zIndex: 2 }}>
        <PinDropCompose onSent={loadPins} />
      </div>

      {/* Scattered pills */}
      <div style={{
        position: "relative",
        height: loading ? 300 : Math.max(500, (pins.length || PREVIEW_PILLS.length) * 70),
        margin: "0 0 20px",
      }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>loading drops…</p>
          </div>
        ) : pins.length > 0 ? (
          pins.map((pin, i) => <PinPill key={pin.id} pin={pin} idx={i} />)
        ) : (
          /* Preview mode — show what it'll look like */
          PREVIEW_PILLS.map((p, i) => {
            const pos   = SCATTER[i % SCATTER.length];
            const color = PILL_COLORS[i % PILL_COLORS.length];
            return (
              <div key={i} style={{
                position: "absolute",
                top: pos.top, left: pos.left,
                transform: `rotate(${pos.rot}deg)`,
                background: color.bg,
                border: `1.5px solid ${color.border}`,
                borderRadius: 999,
                padding: "10px 18px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                opacity: 0.72,
              }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: color.text, margin: 0, whiteSpace: "nowrap" }}>{p.label}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.35)", margin: "3px 0 0", whiteSpace: "nowrap" }}>{p.sub}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
