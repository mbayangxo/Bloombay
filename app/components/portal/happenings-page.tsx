"use client";

import { useState } from "react";
import Link from "next/link";

// ── Design tokens ──────────────────────────────────────────────────────────────
const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const CREAM = "#F6F1EB";
const PAPER = "#FEFCF7";
const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

type Filter = "All" | "Tonight" | "This Weekend" | "Dinners" | "Parties";

const CITY_CARDS = [
  { id: 1, city: "BROOKLYN",        sub: "14 women out · Tonight",      bg: DARK },
  { id: 2, city: "LOWER EAST SIDE", sub: "8 events · Tonight",           bg: PINK },
  { id: 3, city: "WEST VILLAGE",    sub: "6 dinners this weekend",        bg: CREAM },
  { id: 4, city: "HARLEM",          sub: "4 events · Saturday",           bg: "#2A1040" },
];

const AV_COLORS = [PINK, "#FF69B4", "#C084FC", "#F97316", "#06B6D4", "#84CC16"];

function AvatarStack({ count, extra, light }: { count: number; extra?: string; light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ display: "flex" }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{
            width: 24, height: 24, borderRadius: "50%",
            background: AV_COLORS[i % AV_COLORS.length],
            border: `2px solid ${light ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.1)"}`,
            marginLeft: i > 0 ? -8 : 0,
            flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 900, color: "white",
          }}>✿</div>
        ))}
      </div>
      {extra && (
        <span style={{
          fontSize: 9, fontWeight: 700,
          color: light ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.4)",
          fontFamily: "var(--font-jost)",
        }}>{extra}</span>
      )}
    </div>
  );
}

function Tape({ top, left, right, rotate = 0 }: { top?: number; left?: string; right?: string; rotate?: number }) {
  return (
    <div style={{
      position: "absolute",
      top: top ?? -7,
      left: left,
      right: right,
      width: 52,
      height: 13,
      background: "linear-gradient(135deg, rgba(255,245,195,0.55), rgba(255,225,170,0.4))",
      borderRadius: 4,
      transform: `rotate(${rotate}deg)`,
      zIndex: 2,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }} />
  );
}

// ── Card 1: GIRLS NIGHT OUT ───────────────────────────────────────────────────
function GirlsNightCard() {
  return (
    <div style={{
      background: DARK,
      backgroundImage: `linear-gradient(155deg, rgba(28,27,28,0.15) 0%, rgba(255,31,125,0.6) 100%), ${PAPER_TEX}`,
      borderRadius: 22,
      overflow: "visible",
      position: "relative",
      minHeight: 210,
      cursor: "pointer",
    }}>
      <Tape top={-7} left="48%" />
      <div style={{ padding: "30px 22px 22px" }}>
        <span style={{
          fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700,
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
        }}>LOWER EAST SIDE · TONIGHT · 10PM</span>
        <h2 style={{
          fontFamily: "var(--font-playfair)", fontSize: 42, fontWeight: 900,
          color: "white", lineHeight: 0.88, letterSpacing: "-0.02em",
          margin: "10px 0 20px", textShadow: "0 2px 20px rgba(0,0,0,0.3)",
        }}>
          GIRLS<br />NIGHT<br />OUT
        </h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <AvatarStack count={6} extra="+18" light />
          <div style={{
            background: "rgba(255,255,255,0.15)", borderRadius: 20,
            padding: "6px 14px", backdropFilter: "blur(6px)",
          }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "white" }}>RSVP →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Card 2: DINNER SOCIETY ────────────────────────────────────────────────────
function DinnerSocietyCard() {
  return (
    <div style={{
      background: CREAM, backgroundImage: PAPER_TEX,
      borderRadius: 20, padding: "18px 15px 16px",
      position: "relative", cursor: "pointer",
      boxShadow: "0 2px 14px rgba(0,0,0,0.05)",
    }}>
      <Tape top={-7} right="14px" rotate={2} />
      <span style={{
        fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)",
      }}>Carbone, West Village</span>
      <h3 style={{
        fontFamily: "var(--font-playfair)", fontSize: 21, fontWeight: 900,
        color: DARK, lineHeight: 0.95, margin: "7px 0 5px", letterSpacing: "-0.01em",
      }}>DINNER<br />SOCIETY</h3>
      <p style={{
        fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.48)",
        marginBottom: 14, fontStyle: "italic",
      }}>TONIGHT · 9PM</p>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: DARK, borderRadius: 20, padding: "5px 11px",
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "white", fontFamily: "var(--font-jost)", letterSpacing: "0.08em" }}>10 going</span>
      </div>
    </div>
  );
}

// ── Card 3: AFRO BEATS ────────────────────────────────────────────────────────
function AfroBeatsCard() {
  return (
    <div style={{
      background: PINK, backgroundImage: PAPER_TEX,
      borderRadius: 20, padding: "18px 15px 16px",
      position: "relative", cursor: "pointer", overflow: "hidden",
    }}>
      {[
        { x: "82%", y: "12%", s: 9 },
        { x: "12%", y: "10%", s: 6 },
        { x: "68%", y: "52%", s: 5 },
        { x: "25%", y: "65%", s: 4 },
      ].map((d, i) => (
        <div key={i} style={{
          position: "absolute", left: d.x, top: d.y, width: d.s, height: d.s,
          borderRadius: "50%", background: "rgba(255,255,255,0.2)",
        }} />
      ))}
      <span style={{
        fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)",
      }}>SAT · MAY 15</span>
      <h3 style={{
        fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900,
        color: "white", lineHeight: 0.92, margin: "7px 0 5px", letterSpacing: "-0.01em",
      }}>AFRO<br />BEATS<br />IN THE<br />CITY</h3>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.65)", margin: "6px 0 12px" }}>
        11PM–3AM
      </p>
      <span style={{ fontSize: 10, fontWeight: 700, color: "white", fontFamily: "var(--font-jost)" }}>8 going →</span>
    </div>
  );
}

// ── Card 4: Museum Girls ──────────────────────────────────────────────────────
function MuseumGirlsCard() {
  return (
    <div style={{
      background: PAPER, backgroundImage: PAPER_TEX,
      borderRadius: 20, padding: "16px 14px",
      cursor: "pointer", border: "1.5px solid rgba(0,0,0,0.07)",
    }}>
      <span style={{
        fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(0,0,0,0.32)",
      }}>The Met · SATURDAY</span>
      <h3 style={{
        fontFamily: "var(--font-playfair)", fontSize: 19, fontWeight: 900,
        color: DARK, lineHeight: 1, margin: "6px 0 2px",
      }}>Museum<br />Girls</h3>
      <p style={{
        fontFamily: "var(--font-jost)", fontSize: 9,
        color: "rgba(0,0,0,0.35)", marginBottom: 10,
      }}>12PM</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 36, fontWeight: 900, color: PINK, lineHeight: 1 }}>7</span>
        <span style={{ fontSize: 10, color: "rgba(0,0,0,0.38)", fontFamily: "var(--font-jost)" }}>going</span>
      </div>
    </div>
  );
}

// ── Card 5: BOOK GIRLS ────────────────────────────────────────────────────────
function BookGirlsCard() {
  return (
    <div style={{
      background: CREAM, backgroundImage: PAPER_TEX,
      borderRadius: "20px 20px 6px 20px",
      padding: "20px 16px 18px",
      position: "relative", cursor: "pointer",
    }}>
      <Tape top={-7} left="20px" rotate={-1} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 7,
        background: `repeating-linear-gradient(90deg, ${CREAM} 0px, ${CREAM} 9px, transparent 9px, transparent 15px)`,
        filter: "blur(0.8px)",
      }} />
      <span style={{ position: "absolute", right: 18, top: 18, fontSize: 24, opacity: 0.3 }}>✿</span>
      <span style={{ position: "absolute", right: 36, bottom: 20, fontSize: 16, opacity: 0.18, transform: "rotate(-12deg)" }}>✦</span>
      <span style={{
        fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)",
      }}>WED · MAY 21 · 7PM</span>
      <h3 style={{
        fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900,
        color: DARK, lineHeight: 1, margin: "7px 0 14px",
      }}>BOOK GIRLS</h3>
      <div style={{
        display: "inline-flex", alignItems: "center",
        background: DARK, borderRadius: 20, padding: "5px 12px",
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: PINK, fontFamily: "var(--font-jost)", letterSpacing: "0.05em" }}>
          5 seats left
        </span>
      </div>
    </div>
  );
}

// ── Card 6: ROOFTOP GIRLS ─────────────────────────────────────────────────────
function RooftopGirlsCard() {
  return (
    <div style={{
      background: "white",
      borderRadius: 20, padding: "16px 14px",
      cursor: "pointer", border: "1.5px solid rgba(0,0,0,0.07)",
      boxShadow: "0 3px 14px rgba(0,0,0,0.06)",
    }}>
      <span style={{
        fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(0,0,0,0.32)",
      }}>SAT · 9PM · MIDTOWN</span>
      <h3 style={{
        fontFamily: "var(--font-playfair)", fontSize: 19, fontWeight: 900,
        color: DARK, lineHeight: 1, margin: "6px 0 14px",
      }}>ROOFTOP<br />GIRLS</h3>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.45)", fontFamily: "var(--font-jost)" }}>16 going</span>
        <span style={{ fontSize: 14, color: PINK }}>→</span>
      </div>
    </div>
  );
}

// ── Card 7: PASTA NIGHT ───────────────────────────────────────────────────────
function PastaNightCard() {
  return (
    <div style={{
      background: DARK, backgroundImage: PAPER_TEX,
      borderRadius: 20, padding: "16px 14px", cursor: "pointer",
    }}>
      <span style={{
        fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
      }}>Little Italy · TONIGHT</span>
      <h3 style={{
        fontFamily: "var(--font-playfair)", fontSize: 19, fontWeight: 900,
        color: "white", lineHeight: 1, margin: "6px 0 4px",
      }}>PASTA<br />NIGHT</h3>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>9PM</p>
      <span style={{ fontSize: 10, fontWeight: 700, color: PINK, fontFamily: "var(--font-jost)" }}>4 going →</span>
    </div>
  );
}

// ── Card 8: You're Invited ────────────────────────────────────────────────────
function InvitedCard() {
  return (
    <div style={{
      background: PINK, backgroundImage: PAPER_TEX,
      borderRadius: 22, padding: "22px 20px 20px",
      cursor: "pointer", position: "relative", overflow: "hidden",
    }}>
      <Tape top={-7} right="30px" rotate={1} />
      <div style={{
        position: "absolute", top: -30, right: -30, width: 120, height: 120,
        borderRadius: "50%", background: "rgba(255,255,255,0.07)",
      }} />
      <div style={{
        position: "absolute", bottom: -20, left: -20, width: 80, height: 80,
        borderRadius: "50%", background: "rgba(255,255,255,0.06)",
      }} />
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 20, color: "white", marginBottom: 4, opacity: 0.9 }}>
        You&apos;re Invited ♡
      </p>
      <h3 style={{
        fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900,
        color: "white", lineHeight: 1, margin: "0 0 8px", letterSpacing: "-0.01em",
      }}>Wine &amp; Conversations</h3>
      <p style={{
        fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.7)",
        marginBottom: 18, letterSpacing: "0.18em", textTransform: "uppercase",
      }}>FRI · 7PM · WEST VILLAGE</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <AvatarStack count={5} extra="+3" light />
        <div style={{
          background: "rgba(255,255,255,0.2)", borderRadius: 20,
          padding: "6px 14px",
        }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "white" }}>RSVP →</span>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function HappeningsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const filters: Filter[] = ["All", "Tonight", "This Weekend", "Dinners", "Parties"];

  return (
    <div style={{ minHeight: "100vh", background: PAPER, paddingBottom: 120 }}>

      {/* Top bar */}
      <div style={{
        background: DARK,
        padding: "13px 20px 11px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <span style={{
          fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)",
        }}>BB* · NYC · TONIGHT</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: "rgba(255,31,125,0.16)", border: "1px solid rgba(255,31,125,0.35)",
            borderRadius: 20, padding: "3px 10px",
          }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK }}>
              87 women out
            </span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{
        display: "flex", gap: 8,
        overflowX: "auto", padding: "14px 20px",
        scrollbarWidth: "none",
        background: PAPER,
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              flexShrink: 0, padding: "7px 17px", borderRadius: 20,
              border: activeFilter === f ? "none" : "1.5px solid rgba(0,0,0,0.11)",
              background: activeFilter === f ? DARK : "transparent",
              color: activeFilter === f ? "white" : "rgba(0,0,0,0.5)",
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.06em", cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >{f}</button>
        ))}
      </div>

      {/* Masonry grid */}
      <div style={{ padding: "18px 16px 0" }}>

        {/* Row 1 — full-width hero */}
        <div style={{ marginBottom: 12 }}>
          <GirlsNightCard />
        </div>

        {/* Row 2 — 2 col */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12, alignItems: "start" }}>
          <DinnerSocietyCard />
          <AfroBeatsCard />
        </div>

        {/* Row 3 — unequal 2 col */}
        <div style={{ display: "grid", gridTemplateColumns: "4fr 5fr", gap: 12, marginBottom: 12, alignItems: "start" }}>
          <MuseumGirlsCard />
          <RooftopGirlsCard />
        </div>

        {/* Row 4 — full-width torn paper */}
        <div style={{ marginBottom: 12 }}>
          <BookGirlsCard />
        </div>

        {/* Row 5 — 2 col */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12, alignItems: "start" }}>
          <PastaNightCard />
          <div style={{
            background: "#F0E8FF", backgroundImage: PAPER_TEX,
            borderRadius: 20, padding: "16px 14px", cursor: "pointer",
            border: "1.5px solid rgba(100,50,150,0.08)",
          }}>
            <span style={{
              fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(80,40,120,0.38)",
            }}>SUN · MAY 18 · 3PM</span>
            <h3 style={{
              fontFamily: "var(--font-playfair)", fontSize: 19, fontWeight: 900,
              color: "#3B1F5E", lineHeight: 1, margin: "6px 0 12px",
            }}>BRUNCH<br />BABES</h3>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#8B5CF6", fontFamily: "var(--font-jost)" }}>12 going →</span>
          </div>
        </div>

        {/* Row 6 — full-width invite */}
        <div style={{ marginBottom: 24 }}>
          <InvitedCard />
        </div>
      </div>

      {/* From your city */}
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 20 }}>
        <div style={{ padding: "0 20px 12px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <p style={{
              fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700,
              letterSpacing: "0.3em", textTransform: "uppercase", color: PINK, marginBottom: 2,
            }}>FROM YOUR CITY</p>
            <p style={{ fontFamily: "var(--font-instrument)", fontSize: 11, fontStyle: "italic", color: "rgba(0,0,0,0.38)" }}>
              What&apos;s moving in NYC
            </p>
          </div>
          <Link href="#" style={{
            fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700,
            color: PINK, textDecoration: "none",
          }}>See all →</Link>
        </div>

        <div style={{
          display: "flex", gap: 12,
          overflowX: "auto", padding: "4px 20px 24px",
          scrollbarWidth: "none",
        }}>
          {CITY_CARDS.map(card => (
            <div key={card.id} style={{
              flexShrink: 0, width: 140, height: 175,
              borderRadius: 18,
              background: card.bg,
              backgroundImage: `linear-gradient(160deg, transparent 25%, rgba(0,0,0,0.5) 100%), ${PAPER_TEX}`,
              padding: "14px 12px",
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              cursor: "pointer", position: "relative", overflow: "hidden",
            }}>
              <p style={{
                fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900,
                color: card.bg === CREAM ? DARK : "white",
                lineHeight: 1.1, marginBottom: 4,
              }}>{card.city}</p>
              <p style={{
                fontFamily: "var(--font-jost)", fontSize: 9,
                color: card.bg === CREAM ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)",
                letterSpacing: "0.04em",
              }}>{card.sub}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
