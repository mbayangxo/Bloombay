"use client";

import { useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";
const AV_COLORS = ["#FF1F7D","#FF69B4","#C084FC","#F97316","#06B6D4","#84CC16","#FBBF24","#E879F9"];

type HapTab = "happenings" | "city";
type Filter = "All" | "Tonight" | "This Weekend" | "Dinners" | "Parties";

// ── Data ───────────────────────────────────────────────────────────────────────

const EVENTS = [
  {
    id: 1,
    name: "GIRLS\nNIGHT OUT",
    loc: "Lower East Side",
    time: "TONIGHT · 10PM",
    badge: "TONIGHT",
    women: 18,
    span: "full" as const,
    height: 220,
    grad: "linear-gradient(160deg, #3a0a18 0%, #1a0010 55%, #0a0006 100%)",
    glow: "rgba(255,31,125,0.3)",
    note: "girls night ♡",
    noteColor: "#FF1F7D",
  },
  {
    id: 2,
    name: "DINNER\nSOCIETY",
    loc: "Carbone · West Village",
    time: "TONIGHT · 9PM",
    badge: "TONIGHT",
    women: 14,
    span: "half" as const,
    height: 200,
    grad: "linear-gradient(145deg, #faf0e4 0%, #e8d5b8 100%)",
    dark: false,
    note: "reservation needed ♡",
    noteColor: "#8A5A3A",
  },
  {
    id: 3,
    name: "ROOFTOP\nGIRLS",
    loc: "Westlight · Williamsburg",
    time: "TONIGHT · 8PM",
    badge: "TONIGHT",
    women: 16,
    span: "half" as const,
    height: 200,
    grad: "linear-gradient(160deg, #0a1828 0%, #0a0e1a 100%)",
    glow: "rgba(30,80,180,0.3)",
  },
  {
    id: 4,
    name: "AFROBEATS\nIN THE CITY",
    loc: "SOB's · Manhattan",
    time: "SAT · MAY 15 · 11PM",
    badge: "THIS WEEKEND",
    women: 8,
    span: "half" as const,
    height: 230,
    grad: "linear-gradient(145deg, #FF1F7D 0%, #8B0040 100%)",
    glow: "rgba(255,31,125,0.4)",
    note: "11PM – 3AM",
    noteColor: "rgba(255,255,255,0.7)",
  },
  {
    id: 5,
    name: "MUSEUM\nGIRLS",
    loc: "The Met",
    time: "SATURDAY · 2PM",
    badge: "THIS WEEKEND",
    women: 7,
    span: "half" as const,
    height: 230,
    grad: "linear-gradient(145deg, #F8F0E4 0%, #E8DCC8 100%)",
    dark: false,
    note: "come for the art ♡",
    noteColor: "#8A6A3A",
    ticket: true,
  },
  {
    id: 6,
    name: "BOOK GIRLS",
    loc: "McNally Jackson · SoHo",
    time: "WED · MAY 21 · 7PM",
    badge: "UPCOMING",
    women: 5,
    span: "half" as const,
    height: 190,
    grad: "linear-gradient(145deg, #FFF0F5 0%, #FFD8E8 100%)",
    dark: false,
    note: "this month's pick →",
    noteColor: PINK,
  },
  {
    id: 7,
    name: "PASTA NIGHT",
    loc: "Little Ruby · SoHo",
    time: "TONIGHT · 8PM",
    badge: "TONIGHT",
    women: 4,
    span: "half" as const,
    height: 190,
    grad: "linear-gradient(145deg, #1a0e08 0%, #0a0600 100%)",
    glow: "rgba(200,100,40,0.25)",
    note: "byo wine ♡",
    noteColor: "#D4884A",
  },
  {
    id: 8,
    name: "WINE & CONVERSATIONS",
    loc: "West Village",
    time: "FRI · 7PM",
    badge: "UPCOMING",
    women: 12,
    span: "full" as const,
    height: 140,
    grad: "linear-gradient(90deg, #2d0a18 0%, #1a0008 100%)",
    glow: "rgba(255,31,125,0.15)",
    ticket: true,
    note: "you're invited ♡",
    noteColor: "#FF69B4",
  },
];

const FROM_CITY = [
  { id: 1, name: "Sunset Walk",      loc: "Brooklyn Bridge · Sun 1PM",   women: 22, grad: "linear-gradient(135deg,#1a3a5a,#0a1828)" },
  { id: 2, name: "Natural Wine",     loc: "Williamsburg · Tonight 6PM",  women: 6,  grad: "linear-gradient(135deg,#2a1a0a,#160a00)" },
  { id: 3, name: "Rooftop",          loc: "Public Hotel · Sat 8PM",      women: 12, grad: "linear-gradient(135deg,#1a0a2a,#0a0418)" },
  { id: 4, name: "Dance All Night",  loc: "Public Records · Sat 11PM",   women: 10, grad: "linear-gradient(135deg,#1a0a14,#0a0008)" },
];

// ── Attendee Row ───────────────────────────────────────────────────────────────

function AvatarRow({ count, light = true }: { count: number; light?: boolean }) {
  const show = Math.min(count, 5);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex" }}>
        {Array.from({ length: show }).map((_, i) => (
          <div key={i} style={{
            width: 20, height: 20, borderRadius: "50%",
            background: AV_COLORS[i % AV_COLORS.length],
            marginLeft: i > 0 ? -7 : 0,
            border: `2px solid ${light ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.3)"}`,
            flexShrink: 0,
          }}/>
        ))}
      </div>
      {count > 5 && (
        <span style={{ fontSize: 9, fontWeight: 700, color: light ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.4)", fontFamily: "var(--font-jost)" }}>
          +{count - 5}
        </span>
      )}
    </div>
  );
}

// ── Event Card ─────────────────────────────────────────────────────────────────

function EventCard({ ev }: { ev: typeof EVENTS[number] }) {
  const isDark = ev.dark === false ? false : true;

  return (
    <button
      className="relative overflow-hidden active:scale-[0.97] transition-transform text-left"
      style={{
        background: ev.grad,
        borderRadius: "18px",
        height: ev.height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "14px 14px 12px",
        boxShadow: ev.glow ? `0 0 30px ${ev.glow}, 0 4px 20px rgba(0,0,0,0.3)` : "0 4px 20px rgba(0,0,0,0.1)",
        border: "none",
        cursor: "pointer",
        width: "100%",
        gridColumn: ev.span === "full" ? "span 2" : undefined,
      }}
    >
      {/* Glow overlay */}
      {ev.glow && (
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 80% 15%, ${ev.glow} 0%, transparent 55%)`, pointerEvents: "none" }} />
      )}

      {/* Ticket border for ticket cards */}
      {ev.ticket && (
        <div style={{ position: "absolute", inset: "6px", border: `1px dashed ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`, borderRadius: "12px", pointerEvents: "none" }} />
      )}

      {/* Top row: badge + women count */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
        <div style={{
          background: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.07)",
          borderRadius: 999, padding: "3px 9px",
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em", color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.5)" }}>
            {ev.badge}
          </p>
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: PINK,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          boxShadow: `0 2px 8px ${PINK}55`,
          flexShrink: 0,
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, color: "white", lineHeight: 1 }}>{ev.women}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 700, color: "rgba(255,255,255,0.8)", lineHeight: 1 }}>going</p>
        </div>
      </div>

      {/* Event name */}
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "8px 0" }}>
        <p style={{
          fontFamily: "var(--font-playfair)",
          fontSize: ev.span === "full" ? "26px" : "19px",
          fontWeight: 900,
          fontStyle: "italic",
          color: isDark ? "rgba(255,248,240,0.95)" : "#1A0A0A",
          lineHeight: 1.1,
          whiteSpace: "pre-line",
        }}>
          {ev.name}
        </p>
        {ev.note && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: "12px", color: ev.noteColor, marginTop: "5px" }}>
            {ev.note}
          </p>
        )}
      </div>

      {/* Bottom row: location + avatars */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", position: "relative" }}>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.1em", color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)", marginBottom: "4px" }}>
            {ev.loc.toUpperCase()}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: PINK }}>
            {ev.time}
          </p>
        </div>
        <AvatarRow count={ev.women} light={isDark} />
      </div>
    </button>
  );
}

// ── City preview (shown in City tab) ──────────────────────────────────────────

function CityTabPreview() {
  return (
    <div style={{ padding: "16px" }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: "12px" }}>
        NYC · THE CITY
      </p>
      <Link href="/member/city" style={{ textDecoration: "none", display: "block" }}>
        <div style={{
          background: "#0A0806",
          borderRadius: "20px",
          overflow: "hidden",
          padding: "24px 20px 24px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: "11px", fontStyle: "italic", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>New York City</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: "32px", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, marginBottom: "16px" }}>
            The City<br />
            <span style={{ color: PINK }}>awaits.</span>
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
            {["EATS", "GO", "SOLO", "BLOOMIES' FAVES", "TRENDING"].map(c => (
              <span key={c} style={{
                fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em",
                background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)",
                borderRadius: 999, padding: "4px 10px",
              }}>{c}</span>
            ))}
          </div>
          <div style={{ display: "inline-flex", background: PINK, borderRadius: 999, padding: "10px 20px", boxShadow: `0 3px 12px ${PINK}44` }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: "white", letterSpacing: "0.07em" }}>OPEN THE CITY →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function HappeningsPage() {
  const [tab, setTab]       = useState<HapTab>("happenings");
  const [filter, setFilter] = useState<Filter>("All");

  const filters: Filter[] = ["All", "Tonight", "This Weekend", "Dinners", "Parties"];

  const filtered = tab === "happenings"
    ? (filter === "All" ? EVENTS : EVENTS.filter(e =>
        filter === "Tonight"      ? e.badge === "TONIGHT"      :
        filter === "This Weekend" ? e.badge === "THIS WEEKEND" :
        filter === "Dinners"      ? e.loc.toLowerCase().includes("dinner") || e.name.toLowerCase().includes("dinner") || e.name.toLowerCase().includes("pasta") :
        filter === "Parties"      ? e.badge === "TONIGHT" && e.time.includes("PM") && parseInt(e.time.split("PM")[0].trim().split("·").pop()?.trim() ?? "0") >= 8 : true
      ))
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "#0A0806", paddingBottom: 96 }}>

      {/* ── Header + toggle ── */}
      <div style={{
        paddingTop: "60px",
        background: "#0A0806",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 12px" }}>
          {/* Left: city/date */}
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.85)" }}>
              BB+ · NYC · TONIGHT
            </p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "13px", color: "rgba(255,255,255,0.3)", marginTop: "1px" }}>
              87 women out
            </p>
          </div>

          {/* Toggle: HAPPENINGS | CITY — big pills */}
          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.07)",
            borderRadius: 999,
            padding: "3px",
            gap: "2px",
          }}>
            {(["happenings", "city"] as HapTab[]).map(t => {
              const active = tab === t;
              const label  = t === "happenings" ? "Happenings" : "City";
              return (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: "7px 18px",
                  borderRadius: 999,
                  background: active ? PINK : "transparent",
                  color: active ? "white" : "rgba(255,255,255,0.45)",
                  fontFamily: "var(--font-jost)",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: active ? `0 2px 8px ${PINK}55` : "none",
                  transition: "all 0.15s",
                }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter pills — happenings only */}
        {tab === "happenings" && (
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "0 16px 12px", scrollbarWidth: "none" as const }}>
            {filters.map(f => {
              const active = filter === f;
              return (
                <button key={f} onClick={() => setFilter(f)} style={{
                  flexShrink: 0,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: active ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)",
                  border: active ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.07)",
                  color: active ? "white" : "rgba(255,255,255,0.38)",
                  fontFamily: "var(--font-jost)",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}>
                  {f}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── City tab ── */}
      {tab === "city" && <CityTabPreview />}

      {/* ── Happenings masonry grid ── */}
      {tab === "happenings" && (
        <div style={{ padding: "12px 12px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {filtered.map(ev => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>
      )}

      {/* ── From your city ── */}
      {tab === "happenings" && (
        <div style={{ padding: "22px 12px 0" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: "15px", color: "rgba(255,255,255,0.35)", marginBottom: "10px", paddingLeft: "4px" }}>
            From your city...
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {FROM_CITY.map(fc => (
              <button key={fc.id}
                className="active:scale-[0.97] transition-transform"
                style={{
                  background: fc.grad,
                  borderRadius: "14px",
                  padding: "14px 12px",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.25)",
                }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.9)", marginBottom: "4px" }}>
                  {fc.name}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.38)", marginBottom: "10px" }}>
                  {fc.loc}
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  background: PINK, borderRadius: 999, padding: "3px 8px",
                }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white" }}>
                    {fc.women}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
