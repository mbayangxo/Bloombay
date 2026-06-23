"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { PinIcon } from "./pin-icon";
import { PinDropCompose } from "./pin-drop-compose";
import "@/app/styles/bloom-entrance.css";

interface PersonalPin {
  id: string;
  location: string;
  caption: string | null;
  expires_at: string;
  created_at: string;
}

interface ReceivedPin {
  id: string;
  location: string;
  caption: string | null;
  expires_at: string;
  sent_at: string;
  sender_name: string;
  sender_avatar: string | null;
  kind: "received";
}

interface ClubPin {
  id: string;
  location: string;
  caption: string;
  club_name: string | null;
  sent_at: string;
  type: "club";
}

type PinItem =
  | ({ kind: "personal" } & PersonalPin)
  | ({ kind: "received" } & ReceivedPin)
  | ({ kind: "club" } & ClubPin);

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function expiresIn(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const h = Math.round(diff / 3600000);
  if (h < 1) return "expires soon";
  if (h < 24) return `expires in ${h}h`;
  return `expires in ${Math.round(h / 24)}d`;
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
  const items = pins.length > 0 ? pins : [
    { id: "p1", kind: "received" as const, location: "Le Coucou", caption: "saved you a seat ♡", sender_name: "Amara K.", expires_at: "", sent_at: "", sender_avatar: null },
    { id: "p2", kind: "club" as const, location: "Rooftop at 7pm", caption: "Dinner tonight!", club_name: "Dinner Society", sent_at: "", type: "club" as const },
    { id: "p3", kind: "personal" as const, location: "The Loft, SoHo", caption: null, expires_at: new Date(Date.now() + 7200000).toISOString(), created_at: new Date().toISOString() },
    { id: "p4", kind: "received" as const, location: "Book Club @ 6", caption: null, sender_name: "Sofia M.", expires_at: "", sent_at: new Date(Date.now() - 3600000).toISOString(), sender_avatar: null },
    { id: "p5", kind: "club" as const, location: "Museum First Friday", caption: "RSVP opens now", club_name: "Museum Girls", sent_at: new Date(Date.now() - 1800000).toISOString(), type: "club" as const },
  ] as PinItem[];

  return (
    <div style={{ position: "relative", height: 320, marginBottom: 8 }}>
      {items.slice(0, 8).map((pin, i) => {
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
  const [pins, setPins]       = useState<PinItem[]>([]);
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
          const aTime = a.kind === "personal" ? a.created_at : a.sent_at;
          const bTime = b.kind === "personal" ? b.created_at : b.sent_at;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
        setPins(all);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { loadPins(); }, [loadPins]);

  return (
    <div className="bloom-page-enter min-h-screen pb-24"
      style={{ background: "var(--bb-page-bg, #FFF0F6)", paddingTop: "calc(env(safe-area-inset-top, 0px) + 62px)" }}>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
