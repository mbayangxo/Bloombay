"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const CREAM = "#F6F1EB";
const PAPER = "#FEFCF7";
const DARK  = "#1C1B1C";
const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

type HapTab = "happenings" | "city";
type Filter = "All" | "Tonight" | "This Weekend" | "Dinners" | "Parties";

const EVENTS = [
  {
    id: 1,
    name: "Girls Night Out",
    loc: "Lower East Side",
    time: "Tonight · 10PM",
    badge: "TONIGHT",
    women: 18,
    span: "full" as const,
    bg: "#FFF0F5",
    accent: PINK,
    emoji: "✦",
    note: "girls night ♡",
  },
  {
    id: 2,
    name: "Dinner Society",
    loc: "Carbone · West Village",
    time: "Tonight · 9PM",
    badge: "TONIGHT",
    women: 14,
    span: "half" as const,
    bg: "#FAF0E4",
    accent: "#C47A3A",
    emoji: "♡",
    note: "reservation needed",
  },
  {
    id: 3,
    name: "Rooftop Girls",
    loc: "Westlight · Williamsburg",
    time: "Tonight · 8PM",
    badge: "TONIGHT",
    women: 16,
    span: "half" as const,
    bg: "#EFF4FF",
    accent: "#4A70CC",
    emoji: "★",
  },
  {
    id: 4,
    name: "Afrobeats in the City",
    loc: "SOB's · Manhattan",
    time: "Sat · 11PM",
    badge: "THIS WEEKEND",
    women: 33,
    span: "full" as const,
    bg: "#F5F0FA",
    accent: "#8A40CC",
    emoji: "✿",
    note: "🔥 hot",
  },
  {
    id: 5,
    name: "Brunch Club",
    loc: "Via Carota · W. Village",
    time: "Sun · 12PM",
    badge: "",
    women: 9,
    span: "half" as const,
    bg: "#FFF8EE",
    accent: "#E07020",
    emoji: "◆",
  },
  {
    id: 6,
    name: "Gallery Walk",
    loc: "Chelsea Art District",
    time: "Sat · 3PM",
    badge: "",
    women: 7,
    span: "half" as const,
    bg: "#F0FAF4",
    accent: "#2A9060",
    emoji: "⬡",
  },
  {
    id: 7,
    name: "Sunset Picnic",
    loc: "Prospect Park · Brooklyn",
    time: "Sun · 6PM",
    badge: "",
    women: 22,
    span: "full" as const,
    bg: "#FFFAF0",
    accent: "#D4A020",
    emoji: "☀",
    note: "bring blankets ♡",
  },
];

const FILTERS: Filter[] = ["All", "Tonight", "This Weekend", "Dinners", "Parties"];

const AV = ["#FF1F7D","#FF69B4","#C084FC","#F97316","#06B6D4","#84CC16","#FBBF24"];

function EventCard({ ev, idx }: { ev: typeof EVENTS[0]; idx: number }) {
  const isFull = ev.span === "full";
  const rotate = (idx % 3 === 0) ? "-0.8deg" : (idx % 3 === 1) ? "0.5deg" : "-0.4deg";

  return (
    <div
      style={{
        gridColumn: isFull ? "span 2" : undefined,
        backgroundImage: PAPER_TEX,
        backgroundColor: ev.bg,
        backgroundSize: "200px 200px",
        borderRadius: 20,
        padding: isFull ? "16px 16px 14px" : "14px 12px 12px",
        boxShadow: "0 3px 16px rgba(0,0,0,0.09)",
        transform: `rotate(${rotate})`,
        position: "relative",
        overflow: "hidden",
        minHeight: isFull ? 130 : 140,
        border: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      {/* tape strip */}
      <div style={{
        position: "absolute", top: -4, left: isFull ? "50%" : "50%",
        transform: "translateX(-50%) rotate(-1.5deg)",
        width: 32, height: 11,
        background: `linear-gradient(to bottom, ${ev.accent}30, ${ev.accent}55 25%, rgba(255,255,255,0.45) 46%, rgba(255,255,255,0.45) 54%, ${ev.accent}55 75%, ${ev.accent}30)`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }} />

      {/* badge */}
      {ev.badge && (
        <div style={{
          display: "inline-block",
          background: ev.accent,
          color: "white",
          borderRadius: 999,
          padding: "2px 8px",
          fontFamily: "var(--font-jost)",
          fontSize: "7px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          marginBottom: 8,
          marginTop: 4,
        }}>
          {ev.badge}
        </div>
      )}

      {/* main layout */}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: ev.badge ? 0 : 6 }}>
        {/* emoji accent */}
        <div style={{
          width: isFull ? 44 : 38,
          height: isFull ? 44 : 38,
          borderRadius: 12,
          background: `${ev.accent}18`,
          border: `1.5px solid ${ev.accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isFull ? 20 : 17,
          flexShrink: 0,
          color: ev.accent,
        }}>
          {ev.emoji}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "var(--font-playfair)",
            fontSize: isFull ? 17 : 14,
            fontWeight: 900,
            fontStyle: "italic",
            color: DARK,
            lineHeight: 1.15,
            marginBottom: 3,
          }}>
            {ev.name}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "#888", letterSpacing: "0.05em", marginBottom: 4 }}>
            {ev.loc}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: ev.accent }}>{ev.time}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {AV.slice(0, Math.min(3, ev.women)).map((c, i) => (
                <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: "1.5px solid white", marginLeft: i > 0 ? -5 : 0 }} />
              ))}
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "#aaa", marginLeft: 4 }}>{ev.women} going</span>
            </div>
          </div>
        </div>

        {/* join button */}
        <button style={{
          flexShrink: 0,
          background: ev.accent,
          color: "white",
          border: "none",
          borderRadius: 999,
          padding: "6px 11px",
          fontFamily: "var(--font-jost)",
          fontSize: "8px",
          fontWeight: 800,
          letterSpacing: "0.05em",
          cursor: "pointer",
          boxShadow: `0 3px 10px ${ev.accent}44`,
          alignSelf: "center",
        }}>
          JOIN
        </button>
      </div>

      {/* handwritten note */}
      {ev.note && (
        <div style={{
          marginTop: 10,
          display: "inline-block",
          transform: "rotate(-1deg)",
          background: "rgba(255,255,230,0.9)",
          padding: "4px 8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#666", lineHeight: 1.3 }}>{ev.note}</p>
        </div>
      )}
    </div>
  );
}

export function HappeningsPage() {
  const [tab, setTab]       = useState<HapTab>("happenings");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = EVENTS.filter(e => {
    if (filter === "All") return true;
    if (filter === "Tonight") return e.badge === "TONIGHT";
    if (filter === "This Weekend") return e.badge === "THIS WEEKEND" || e.badge === "TONIGHT";
    if (filter === "Dinners") return e.name.toLowerCase().includes("dinner") || e.name.toLowerCase().includes("brunch");
    if (filter === "Parties") return e.name.toLowerCase().includes("night") || e.name.toLowerCase().includes("beats");
    return true;
  });

  return (
    <div
      style={{
        backgroundImage: PAPER_TEX,
        backgroundColor: CREAM,
        backgroundSize: "200px 200px",
        minHeight: "100vh",
        paddingBottom: 100,
      }}
    >
      {/* ── Sticky header ── */}
      <div style={{
        position: "sticky",
        top: 48,
        zIndex: 40,
        background: "rgba(246,241,235,0.97)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        padding: "12px 16px 10px",
      }}>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{
            fontFamily: "var(--font-playfair)",
            fontSize: 22,
            fontWeight: 900,
            fontStyle: "italic",
            color: DARK,
          }}>
            Happenings
          </p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Tab toggle */}
        <div style={{
          display: "inline-flex",
          background: "rgba(0,0,0,0.06)",
          borderRadius: 999,
          padding: 3,
          marginBottom: 12,
        }}>
          {(["happenings", "city"] as HapTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "7px 20px",
                borderRadius: 999,
                border: "none",
                background: tab === t ? PINK : "transparent",
                color: tab === t ? "white" : "rgba(0,0,0,0.45)",
                fontFamily: "var(--font-jost)",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                cursor: "pointer",
                transition: "all 0.18s",
                boxShadow: tab === t ? `0 2px 10px ${PINK}44` : "none",
              }}
            >
              {t === "happenings" ? "HAPPENINGS" : "CITY"}
            </button>
          ))}
        </div>

        {/* Filter pills */}
        {tab === "happenings" && (
          <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" as const }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  flexShrink: 0,
                  padding: "5px 12px",
                  borderRadius: 999,
                  border: `1.5px solid ${filter === f ? PINK : "rgba(0,0,0,0.12)"}`,
                  background: filter === f ? `${PINK}12` : "transparent",
                  color: filter === f ? PINK : "rgba(0,0,0,0.45)",
                  fontFamily: "var(--font-jost)",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Happenings tab ── */}
      {tab === "happenings" && (
        <div style={{ padding: "14px 14px 0" }}>

          {/* BB+ header note */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ height: 1, flex: 1, background: "rgba(0,0,0,0.08)" }} />
            <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#aaa" }}>this week in NYC ✦</span>
            <div style={{ height: 1, flex: 1, background: "rgba(0,0,0,0.08)" }} />
          </div>

          {/* Masonry-style grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {filtered.map((ev, i) => (
              <EventCard key={ev.id} ev={ev} idx={i} />
            ))}
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", padding: "24px 0 0" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#bbb" }}>more coming soon ✿</p>
          </div>
        </div>
      )}

      {/* ── City tab ── */}
      {tab === "city" && (
        <div style={{ padding: "20px 16px 0" }}>
          <div style={{
            backgroundImage: PAPER_TEX,
            backgroundColor: PAPER,
            backgroundSize: "200px 200px",
            borderRadius: 22,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.09)",
            marginBottom: 14,
          }}>
            {/* mini city illustration */}
            <div style={{ height: 120, background: "linear-gradient(to bottom, #1a2a3a 0%, #0d1520 100%)", position: "relative", overflow: "hidden" }}>
              <svg viewBox="0 0 400 80" style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid slice">
                <rect x="60"  y="20" width="30" height="60" fill="rgba(255,255,255,0.2)"/>
                <rect x="100" y="8"  width="22" height="72" fill="rgba(255,255,255,0.28)"/>
                <rect x="160" y="2"  width="16" height="78" fill="rgba(255,255,255,0.35)"/>
                <rect x="182" y="14" width="28" height="66" fill="rgba(255,255,255,0.22)"/>
                <rect x="240" y="10" width="20" height="70" fill="rgba(255,255,255,0.28)"/>
                <rect x="280" y="24" width="36" height="56" fill="rgba(255,255,255,0.18)"/>
                <rect x="0"   y="60" width="400" height="20" fill="rgba(255,255,255,0.06)"/>
                {[[80,22],[110,10],[170,4],[250,12],[290,26]].map(([x,y],i)=>(
                  <circle key={i} cx={x} cy={y} r="1.5" fill="rgba(255,220,120,0.6)"/>
                ))}
              </svg>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.5) 100%)" }} />
              <div style={{ position: "absolute", bottom: 12, left: 16 }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>
                  Your City
                </p>
              </div>
            </div>
            <div style={{ padding: "14px 16px 16px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.14em", color: PINK, marginBottom: 6 }}>
                EATS · GO · SOLO · TRENDING
              </p>
              <p style={{ fontFamily: "var(--font-instrument)", fontSize: 13, fontStyle: "italic", color: "#666", lineHeight: 1.5, marginBottom: 14 }}>
                Restaurants, bars, rooftops — everything worth doing in NYC, curated for you.
              </p>
              <Link href="/member/city" style={{ textDecoration: "none" }}>
                <div style={{
                  display: "inline-flex",
                  background: PINK,
                  color: "white",
                  borderRadius: 999,
                  padding: "9px 20px",
                  fontFamily: "var(--font-jost)",
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  boxShadow: `0 4px 14px ${PINK}55`,
                }}>
                  EXPLORE CITY →
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
