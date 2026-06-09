"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const CREAM = "#F6F1EB";
const PAPER = "#FEFCF7";
const DARK  = "#1C1B1C";
const NAV_BG = "#FAF7F2";

const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

const CSS = `
@keyframes ticker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
}
@keyframes filterSlide {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

type HapTab = "happenings" | "city";
type Filter = "All" | "Tonight" | "This Weekend" | "Dinners" | "Parties";

const FILTERS: Filter[] = ["All", "Tonight", "This Weekend", "Dinners", "Parties"];

const EVENTS = [
  { id:1,  name:"Girls Night Out",      loc:"Lower East Side",          time:"Tonight · 10PM", badge:"TONIGHT",      women:18, span:"full" as const, bg:"#FFF0F5", accent:PINK,      emoji:"✦", note:"girls night ♡" },
  { id:2,  name:"Dinner Society",       loc:"Carbone · West Village",   time:"Tonight · 9PM",  badge:"TONIGHT",      women:14, span:"half" as const, bg:"#FAF0E4", accent:"#C47A3A", emoji:"♡", note:"reservation needed" },
  { id:3,  name:"Rooftop Girls",        loc:"Westlight · Williamsburg",  time:"Tonight · 8PM",  badge:"TONIGHT",      women:16, span:"half" as const, bg:"#EFF4FF", accent:"#4A70CC", emoji:"★" },
  { id:4,  name:"Afrobeats in the City",loc:"SOB's · Manhattan",         time:"Sat · 11PM",     badge:"THIS WEEKEND", women:33, span:"full" as const, bg:"#F5F0FA", accent:"#8A40CC", emoji:"✿", note:"🔥 selling out" },
  { id:5,  name:"Brunch Club",          loc:"Via Carota · W. Village",   time:"Sun · 12PM",     badge:"",             women:9,  span:"half" as const, bg:"#FFF8EE", accent:"#E07020", emoji:"◆" },
  { id:6,  name:"Gallery Walk",         loc:"Chelsea Art District",      time:"Sat · 3PM",      badge:"",             women:7,  span:"half" as const, bg:"#F0FAF4", accent:"#2A9060", emoji:"⬡" },
  { id:7,  name:"Sunset Picnic",        loc:"Prospect Park · Brooklyn",  time:"Sun · 6PM",      badge:"",             women:22, span:"full" as const, bg:"#FFFAF0", accent:"#D4A020", emoji:"☀", note:"bring blankets ♡" },
  { id:8,  name:"Wine & Cheese Night",  loc:"Nom Wah · Chinatown",       time:"Fri · 8PM",      badge:"TONIGHT",      women:11, span:"half" as const, bg:"#FBF0F5", accent:"#B03070", emoji:"◇" },
  { id:9,  name:"Pilates Social",       loc:"East Village Studio",       time:"Sat · 9AM",      badge:"THIS WEEKEND", women:6,  span:"half" as const, bg:"#F0F8EE", accent:"#3A8030", emoji:"✻" },
];

const AV = ["#FF1F7D","#FF69B4","#C084FC","#F97316","#06B6D4","#84CC16","#FBBF24"];

const TICKER_ITEMS = [
  "GIRLS NIGHT OUT · LES · TONIGHT 10PM",
  "DINNER SOCIETY · CARBONE · TONIGHT 9PM",
  "ROOFTOP GIRLS · WESTLIGHT · TONIGHT 8PM",
  "AFROBEATS IN THE CITY · SOB'S · SAT 11PM",
  "BRUNCH CLUB · VIA CAROTA · SUN 12PM",
  "SUNSET PICNIC · PROSPECT PARK · SUN 6PM",
  "GALLERY WALK · CHELSEA · SAT 3PM",
];

/* ── Hero card ────────────────────────────────────────────────── */
function HeroCard({ ev }: { ev: typeof EVENTS[0] }) {
  return (
    <div style={{
      margin: "0 14px 6px",
      backgroundImage: PAPER_TEX,
      backgroundColor: ev.bg,
      backgroundSize: "200px 200px",
      borderRadius: 24,
      padding: "20px 18px 18px",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 6px 28px rgba(0,0,0,0.11)",
      transform: "rotate(-0.4deg)",
      border: `1.5px solid ${ev.accent}22`,
    }}>
      {/* big accent shape */}
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 140, height: 140, borderRadius: "50%",
        background: `${ev.accent}12`,
        pointerEvents: "none",
      }}/>

      {/* tape */}
      <div style={{
        position: "absolute", top: -5, left: "50%", transform: "translateX(-50%) rotate(-1deg)",
        width: 40, height: 13,
        background: `linear-gradient(to bottom, ${ev.accent}28, ${ev.accent}50 30%, rgba(255,255,255,0.5) 46%, rgba(255,255,255,0.5) 54%, ${ev.accent}50 70%, ${ev.accent}28)`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}/>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        {/* big emoji block */}
        <div style={{
          width: 64, height: 64, borderRadius: 18, flexShrink: 0,
          background: `${ev.accent}1a`,
          border: `2px solid ${ev.accent}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 30,
        }}>
          {ev.emoji}
        </div>

        <div style={{ flex: 1 }}>
          {/* live badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: PINK,
              animation: "livePulse 1.4s ease-in-out infinite",
            }}/>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: PINK, letterSpacing: "0.12em" }}>
              HAPPENING TONIGHT
            </span>
          </div>

          <p style={{
            fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 900, fontStyle: "italic",
            color: DARK, lineHeight: 1.1, marginBottom: 4,
          }}>
            {ev.name}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "#888", letterSpacing: "0.04em", marginBottom: 10 }}>
            {ev.loc}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex" }}>
              {AV.slice(0, 4).map((c,i) => (
                <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: "2px solid white", marginLeft: i > 0 ? -7 : 0 }}/>
              ))}
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 700, color: "#aaa" }}>
              {ev.women} women going
            </span>
            <div style={{ marginLeft: "auto" }}>
              <button style={{
                background: ev.accent, color: "white", border: "none", borderRadius: 999,
                padding: "9px 18px", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800,
                letterSpacing: "0.06em", cursor: "pointer", boxShadow: `0 4px 14px ${ev.accent}55`,
              }}>
                JOIN →
              </button>
            </div>
          </div>
        </div>
      </div>

      {ev.note && (
        <div style={{
          marginTop: 12, display: "inline-block", transform: "rotate(-0.8deg)",
          background: "rgba(255,255,230,0.92)", padding: "4px 10px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#666" }}>{ev.note}</p>
        </div>
      )}
    </div>
  );
}

/* ── Grid card ────────────────────────────────────────────────── */
function GridCard({ ev, idx }: { ev: typeof EVENTS[0]; idx: number }) {
  const isFull = ev.span === "full";
  const rot = ["-0.6deg","0.5deg","-0.3deg","0.7deg","-0.5deg"][idx % 5];
  return (
    <div style={{
      gridColumn: isFull ? "span 2" : undefined,
      backgroundImage: PAPER_TEX, backgroundColor: ev.bg, backgroundSize: "200px 200px",
      borderRadius: 18, padding: "14px 13px 13px",
      boxShadow: "0 3px 14px rgba(0,0,0,0.08)",
      transform: `rotate(${rot})`,
      position: "relative", overflow: "hidden",
      border: `1px solid ${ev.accent}18`,
    }}>
      {/* tape */}
      <div style={{
        position: "absolute", top: -4, left: "50%", transform: "translateX(-50%) rotate(-1.5deg)",
        width: 28, height: 10,
        background: `linear-gradient(to bottom, ${ev.accent}25, ${ev.accent}48 25%, rgba(255,255,255,0.4) 46%, rgba(255,255,255,0.4) 54%, ${ev.accent}48 75%, ${ev.accent}25)`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}/>

      <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 4 }}>
        <div style={{
          width: isFull ? 40 : 34, height: isFull ? 40 : 34, borderRadius: 11, flexShrink: 0,
          background: `${ev.accent}16`, border: `1.5px solid ${ev.accent}28`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: isFull ? 18 : 15, color: ev.accent,
        }}>
          {ev.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2, flexWrap: "wrap" }}>
            {ev.badge && (
              <span style={{
                background: ev.accent, color: "white", borderRadius: 999,
                padding: "1px 6px", fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.07em",
              }}>{ev.badge}</span>
            )}
            {ev.badge === "TONIGHT" && (
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: PINK, animation: "livePulse 1.4s ease-in-out infinite" }}/>
            )}
          </div>
          <p style={{
            fontFamily: "var(--font-playfair)", fontSize: isFull ? 16 : 13, fontWeight: 900, fontStyle: "italic",
            color: DARK, lineHeight: 1.15, marginBottom: 2,
          }}>
            {ev.name}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#999", letterSpacing: "0.04em" }}>
            {ev.loc}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {AV.slice(0, Math.min(3, ev.women)).map((c,i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: "1.5px solid white", marginLeft: i > 0 ? -5 : 0 }}/>
          ))}
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "#bbb", marginLeft: 5 }}>
            {ev.women}
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: ev.accent }}>
          {ev.time}
        </span>
        <button style={{
          background: ev.accent, color: "white", border: "none", borderRadius: 999,
          padding: "5px 11px", fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800,
          cursor: "pointer", boxShadow: `0 2px 8px ${ev.accent}44`,
        }}>
          JOIN
        </button>
      </div>

      {ev.note && (
        <div style={{
          marginTop: 8, display: "inline-block", transform: "rotate(-1deg)",
          background: "rgba(255,255,230,0.9)", padding: "3px 8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "#777" }}>{ev.note}</p>
        </div>
      )}
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */
export function HappeningsPage() {
  const [tab,    setTab]    = useState<HapTab>("happenings");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = EVENTS.filter(e => {
    if (filter === "All")          return true;
    if (filter === "Tonight")      return e.badge === "TONIGHT";
    if (filter === "This Weekend") return e.badge === "THIS WEEKEND" || e.badge === "TONIGHT";
    if (filter === "Dinners")      return e.name.toLowerCase().includes("dinner") || e.name.toLowerCase().includes("brunch") || e.name.toLowerCase().includes("wine");
    if (filter === "Parties")      return e.name.toLowerCase().includes("night") || e.name.toLowerCase().includes("beats") || e.name.toLowerCase().includes("rooftop");
    return true;
  });

  const heroEv  = filtered[0];
  const gridEvs = filtered.slice(1);

  return (
    <div style={{
      backgroundImage: PAPER_TEX, backgroundColor: CREAM, backgroundSize: "200px 200px",
      minHeight: "100vh", paddingBottom: 100,
    }}>
      <style>{CSS}</style>

      {/* ── Custom top bar: covers the global one ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 51,
        background: NAV_BG,
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
        height: 54,
        paddingTop: "env(safe-area-inset-top, 0px)",
        display: "flex", alignItems: "center",
      }}>
        {/* Left: BB logo */}
        <div style={{ width: 64, display: "flex", alignItems: "center", paddingLeft: 18 }}>
          <Link href="/member/home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
            <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "20px", color: PINK, letterSpacing: "-0.02em" }}>BB</span>
            <span style={{ color: PINK, fontSize: "12px", opacity: 0.6 }}>✿</span>
          </Link>
        </div>

        {/* Center: BIG toggle */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{
            display: "inline-flex",
            background: "rgba(0,0,0,0.07)",
            borderRadius: 999,
            padding: "3px",
          }}>
            {(["happenings","city"] as HapTab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "8px 20px", borderRadius: 999, border: "none",
                background: tab === t ? PINK : "transparent",
                color: tab === t ? "white" : "rgba(0,0,0,0.4)",
                fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 800,
                letterSpacing: "0.10em", cursor: "pointer", transition: "all 0.18s",
                boxShadow: tab === t ? `0 2px 10px ${PINK}44` : "none",
              }}>
                {t === "happenings" ? "HAPPENINGS" : "THE CITY"}
              </button>
            ))}
          </div>
        </div>

        {/* Right: mailbox · pin drop · chat · apt */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingRight: 16 }}>
          {/* Mailbox */}
          <Link href="/member/messages" aria-label="Mailbox" style={{ position: "relative", display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <div style={{ position: "absolute", top: "-4px", right: "-5px", width: 14, height: 14, borderRadius: "50%", background: PINK, border: `1.5px solid ${NAV_BG}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "7px", fontWeight: 900, color: "white", lineHeight: 1 }}>3</div>
          </Link>
          {/* Pin drop */}
          <Link href="/member/notifications" aria-label="Notifications" style={{ position: "relative", display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ position: "absolute", top: "-1px", right: "-1px", width: 7, height: 7, borderRadius: "50%", background: PINK, border: `1.5px solid ${NAV_BG}` }}/>
          </Link>
          {/* Chat */}
          <Link href="/member/messages" aria-label="Chats" style={{ display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </Link>
          {/* Apt */}
          <Link href="/member/lounge" aria-label="My Apt" style={{ display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 22V8l9-6 9 6v14"/>
              <path d="M9 22V12h6v10"/>
              <rect x="10" y="14" width="4" height="4" rx="0.5"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ paddingTop: 54 }}>

        {/* ── Filter pills (always visible at top) ── */}
        {tab === "happenings" && (
          <div style={{
            display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none" as const,
            padding: "10px 16px 8px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            background: "rgba(246,241,235,0.96)",
            backdropFilter: "blur(6px)",
          }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                flexShrink: 0, padding: "6px 15px", borderRadius: 999,
                border: `1.5px solid ${filter === f ? PINK : "rgba(0,0,0,0.11)"}`,
                background: filter === f ? PINK : "white",
                color: filter === f ? "white" : "rgba(0,0,0,0.5)",
                fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700,
                letterSpacing: "0.04em", cursor: "pointer",
                boxShadow: filter === f ? `0 2px 8px ${PINK}33` : "none",
              }}>
                {f}
              </button>
            ))}
          </div>
        )}

        {/* ── HAPPENINGS TAB ── */}
        {tab === "happenings" && (
          <>
            {/* Scrolling ticker */}
            <div style={{
              overflow: "hidden", borderBottom: "1px solid rgba(0,0,0,0.06)",
              background: `${PINK}0a`, padding: "7px 0",
            }}>
              <div style={{
                display: "flex", gap: 0,
                animation: "ticker 22s linear infinite",
                width: "max-content",
              }}>
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                  <span key={i} style={{
                    fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700,
                    letterSpacing: "0.14em", color: PINK, whiteSpace: "nowrap",
                    padding: "0 20px",
                  }}>
                    {item} ✦
                  </span>
                ))}
              </div>
            </div>

            {/* Section label */}
            <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: PINK, animation: "livePulse 1.4s ease-in-out infinite" }}/>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,0,0,0.35)" }}>
                {filter === "All" ? "THIS WEEK IN NYC" : filter.toUpperCase()}
                {filter !== "All" && " · " + filtered.length + " EVENTS"}
              </span>
              {filter !== "All" && (
                <button onClick={() => setFilter("All")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: "auto" }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: PINK, fontWeight: 700 }}>clear ×</span>
                </button>
              )}
            </div>

            {/* Hero card */}
            {heroEv && <HeroCard ev={heroEv}/>}

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "6px 14px 0" }}>
              {gridEvs.map((ev, i) => <GridCard key={ev.id} ev={ev} idx={i}/>)}
            </div>

            <div style={{ textAlign: "center", padding: "22px 0 0" }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#bbb" }}>more coming soon ✿</p>
            </div>
          </>
        )}

        {/* ── CITY TAB ── */}
        {tab === "city" && (
          <div style={{ padding: "16px 16px 0" }}>
            <div style={{
              backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px",
              borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.09)",
            }}>
              <div style={{ height: 130, background: "linear-gradient(to bottom, #1a2a3a 0%, #0d1520 100%)", position: "relative", overflow: "hidden" }}>
                <svg viewBox="0 0 400 80" style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid slice">
                  <rect x="60"  y="20" width="30" height="60" fill="rgba(255,255,255,0.2)"/>
                  <rect x="100" y="8"  width="22" height="72" fill="rgba(255,255,255,0.28)"/>
                  <rect x="160" y="2"  width="16" height="78" fill="rgba(255,255,255,0.35)"/>
                  <rect x="182" y="14" width="28" height="66" fill="rgba(255,255,255,0.22)"/>
                  <rect x="240" y="10" width="20" height="70" fill="rgba(255,255,255,0.28)"/>
                  <rect x="280" y="24" width="36" height="56" fill="rgba(255,255,255,0.18)"/>
                  {[[80,22],[110,10],[170,4],[250,12],[290,26]].map(([x,y],i)=>(
                    <circle key={i} cx={x} cy={y} r="1.5" fill="rgba(255,220,120,0.6)"/>
                  ))}
                </svg>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.5) 100%)" }}/>
                <div style={{ position: "absolute", bottom: 12, left: 16 }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Your City</p>
                </div>
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.14em", color: PINK, marginBottom: 6 }}>EATS · GO · SOLO · TRENDING</p>
                <p style={{ fontFamily: "var(--font-instrument)", fontSize: 13, fontStyle: "italic", color: "#666", lineHeight: 1.5, marginBottom: 14 }}>
                  Restaurants, bars, rooftops — everything worth doing in NYC, curated for you.
                </p>
                <Link href="/member/city" style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "inline-flex", background: PINK, color: "white",
                    borderRadius: 999, padding: "9px 20px",
                    fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em",
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
    </div>
  );
}
