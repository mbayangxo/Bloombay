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

// Pill style variants — scattered aesthetic matching the reference
const PILL_STYLES = [
  { bg: "#FF1F7D", text: "#fff", border: "none", size: "lg" },
  { bg: "#1C1B1C", text: "#fff", border: "none", size: "md" },
  { bg: "#fff", text: "#1C1B1C", border: "1.5px solid rgba(28,27,28,0.18)", size: "sm" },
  { bg: "#FF69B4", text: "#fff", border: "none", size: "md" },
  { bg: "#FFF0F6", text: "#FF1F7D", border: "1.5px solid rgba(255,31,125,0.25)", size: "sm" },
  { bg: "#1C1B1C", text: "#FF69B4", border: "none", size: "lg" },
  { bg: "#FF1F7D", text: "#fff", border: "none", size: "sm" },
  { bg: "#fff", text: "#FF1F7D", border: "1.5px solid #FF1F7D", size: "md" },
];

const SCATTER = [
  { top: "8%",  left: "4%",  rotate: -8,  delay: "0s"    },
  { top: "6%",  left: "38%", rotate: 3,   delay: "0.05s" },
  { top: "5%",  left: "66%", rotate: -4,  delay: "0.1s"  },
  { top: "22%", left: "12%", rotate: 6,   delay: "0.08s" },
  { top: "20%", left: "52%", rotate: -2,  delay: "0.12s" },
  { top: "34%", left: "2%",  rotate: -6,  delay: "0.06s" },
  { top: "32%", left: "36%", rotate: 4,   delay: "0.15s" },
  { top: "32%", left: "68%", rotate: -7,  delay: "0.09s" },
];

function ScatteredPills({ pins }: { pins: PinItem[] }) {
  if (pins.length === 0) {
    return (
      <div style={{ height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 36 }}>📍</span>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: "rgba(28,27,28,0.4)", textAlign: "center", margin: 0 }}>
          No pin drops yet
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(28,27,28,0.28)", textAlign: "center", margin: 0, maxWidth: 220, lineHeight: 1.5 }}>
          Drop a pin to let your bouquet know where you are right now.
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: 320, marginBottom: 8 }}>
      {pins.slice(0, 8).map((pin, i) => {
        const s = SCATTER[i % SCATTER.length];
        const v = PILL_STYLES[i % PILL_STYLES.length];
        const location = pin.location;
        const sublabel = pin.kind === "club"
          ? (pin.club_name ?? "Club")
          : pin.kind === "received"
          ? pin.sender_name
          : "Your pin";
        const time = pin.kind === "personal"
          ? expiresIn(pin.expires_at)
          : timeAgo(pin.kind === "received" ? pin.sent_at : pin.sent_at);

        const padH = v.size === "lg" ? "10px 18px" : v.size === "md" ? "8px 14px" : "6px 12px";
        const fontSize = v.size === "lg" ? 14 : v.size === "md" ? 13 : 12;

        return (
          <div
            key={pin.id}
            className="bloom-card-enter"
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              transform: `rotate(${s.rotate}deg)`,
              animationDelay: s.delay,
              zIndex: i % 2 === 0 ? 2 : 1,
              maxWidth: "56%",
            }}
          >
            <div style={{
              background: v.bg,
              border: v.border ?? "none",
              borderRadius: 100,
              padding: padH,
              boxShadow: v.bg === "#fff" || v.bg === "#FFF0F6"
                ? "0 4px 16px rgba(0,0,0,0.10)"
                : "0 4px 16px rgba(0,0,0,0.22)",
              display: "inline-flex",
              flexDirection: "column",
              gap: 1,
              minWidth: 80,
            }}>
              <span style={{
                fontFamily: "var(--font-jost)",
                fontSize,
                fontWeight: 700,
                color: v.text,
                whiteSpace: "nowrap",
                letterSpacing: "0.01em",
                lineHeight: 1.2,
              }}>
                📍 {location}
              </span>
              <span style={{
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                fontWeight: 500,
                color: v.text,
                opacity: 0.7,
                whiteSpace: "nowrap",
              }}>
                {sublabel} · {time}
              </span>
            </div>
          </div>
        );
      })}
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
    <div className="bloom-page-enter min-h-screen pb-24"
      style={{ background: "var(--bb-page-bg, #FFF0F6)", paddingTop: "calc(env(safe-area-inset-top, 0px) + 64px)" }}>
      <div style={{ padding: "0 20px 24px", maxWidth: 480, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Link
            href="/member/home"
            style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bb-page-card, #fff)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", textDecoration: "none", color: "var(--bb-page-text, #1C1B1C)", flexShrink: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PinIcon size={16} />
            <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)", fontStyle: "italic", fontSize: 24, fontWeight: 700, color: "var(--bb-page-text, #1C1B1C)", margin: 0 }}>
              Pin drops
            </h1>
          </div>
        </div>

        {/* Pink accent line */}
        <div style={{ width: 36, height: 2, borderRadius: 2, background: "#FF1F7D", marginBottom: 20 }} />

        {/* Scattered pills area */}
        {!loading && <ScatteredPills pins={pins} />}

        {loading && (
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(28,27,28,0.35)", letterSpacing: "0.1em" }}>Loading…</p>
          </div>
        )}

        {/* Compose */}
        <PinDropCompose onSent={loadPins} />
      </div>

        {/* List view */}
        {!loading && pins.length > 0 && (
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,31,125,0.6)", marginBottom: 4 }}>ALL DROPS</p>
            {pins.map((pin) => (
              <div
                key={pin.id}
                style={{
                  background: "var(--bb-page-card, #fff)",
                  borderRadius: 16,
                  padding: "14px 16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  borderLeft: pin.kind === "personal" ? "3px solid #1C1B1C" : "3px solid #FF1F7D",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: pin.kind === "personal" ? "rgba(28,27,28,0.5)" : "#FF1F7D" }}>
                    {pin.kind === "club" ? (pin.club_name ?? "Club") : pin.kind === "received" ? `${pin.sender_name} dropped a pin` : "Your pin"}
                  </span>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(28,27,28,0.38)" }}>
                    {pin.kind === "personal" ? expiresIn(pin.expires_at) : timeAgo(pin.sent_at)}
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)", fontStyle: "italic", fontSize: 15, fontWeight: 700, color: "var(--bb-page-text, #1C1B1C)", margin: "0 0 3px" }}>
                  {pin.location}
                </p>
                {pin.caption && (
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "var(--bb-page-text-2, rgba(28,27,28,0.65))", margin: 0, lineHeight: 1.5 }}>
                    {pin.caption}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
