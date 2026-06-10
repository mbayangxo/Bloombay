"use client";

import React, { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const CREAM = "#F6F1EB";
const PAPER = "#FEFCF7";
const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

type CityCategory = "landing" | "eats" | "go" | "solo" | "favorites" | "happenings" | "places";

const CSS = `
@keyframes trainRoll {
  0%   { transform: translateX(-140px); }
  100% { transform: translateX(calc(100vw + 60px)); }
}
@keyframes carRoll {
  0%   { transform: translateX(calc(100vw + 60px)) scaleX(-1); }
  100% { transform: translateX(-140px) scaleX(-1); }
}
`;

/* ── Dense Night Skyline ────────────────────────────────────────── */
function NightSkyline({ width = 430, height = 700 }: { width?: number; height?: number }) {
  // Deterministic LCG — Park-Miller
  function lcg(s: number) { return (s * 16807) % 2147483647; }

  const buildings: { x: number; w: number; h: number; idx: number }[] = [];
  let x = 0;
  let s = 42;
  let idx = 0;
  while (x < width + 40) {
    s = lcg(s);
    const w = 10 + (s % 19);           // 10-28px — very tight
    s = lcg(s);
    const hFrac = 0.38 + (s % 1000) / 1000 * 0.52;  // 38-90%
    const h = Math.floor(height * hFrac);
    buildings.push({ x, w, h, idx });
    x += w;
    idx++;
  }

  const bldgColors = ["#1C1520","#18142A","#1A1830","#161424","#1E162C","#141820","#1A1A26","#141020","#1C1822","#161428"];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice"
      style={{ display: "block", width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="sg_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#080612"/>
          <stop offset="40%"  stopColor="#140A1E"/>
          <stop offset="100%" stopColor="#120E1C"/>
        </linearGradient>
        <radialGradient id="sg_pk" cx="50%" cy="75%" r="55%">
          <stop offset="0%"   stopColor="rgba(200,30,100,0.16)"/>
          <stop offset="100%" stopColor="rgba(200,30,100,0)"/>
        </radialGradient>
        <radialGradient id="sg_pu" cx="22%" cy="60%" r="38%">
          <stop offset="0%"   stopColor="rgba(110,55,210,0.1)"/>
          <stop offset="100%" stopColor="rgba(110,55,210,0)"/>
        </radialGradient>
        <radialGradient id="sg_pk2" cx="78%" cy="55%" r="30%">
          <stop offset="0%"   stopColor="rgba(255,31,125,0.07)"/>
          <stop offset="100%" stopColor="rgba(255,31,125,0)"/>
        </radialGradient>
      </defs>
      <rect width={width} height={height} fill="url(#sg_sky)"/>
      <rect width={width} height={height} fill="url(#sg_pk)"/>
      <rect width={width} height={height} fill="url(#sg_pu)"/>
      <rect width={width} height={height} fill="url(#sg_pk2)"/>

      {/* Stars */}
      {Array.from({length: 50}, (_, i) => {
        const sx = (i * 97 + 31) % width;
        const sy = (i * 61 + 11) % Math.floor(height * 0.36);
        const sz = i % 5 === 0 ? 0.9 : 0.5;
        return <circle key={i} cx={sx} cy={sy} r={sz} fill="rgba(255,255,255,0.65)"/>;
      })}

      {/* Buildings */}
      {buildings.map((b) => {
        const col = bldgColors[b.idx % bldgColors.length];
        const winW = 3, winH = 3, gapX = 4, gapY = 5;
        const cols = Math.max(1, Math.floor((b.w - 2) / (winW + gapX)));
        const rows = Math.max(1, Math.floor((b.h - 8) / (winH + gapY)));
        const hasSetback = b.w >= 16 && b.h >= height * 0.65 && b.idx % 6 === 2;
        const hasTip     = b.w >= 12 && b.h >= height * 0.72 && b.idx % 5 === 0;

        return (
          <g key={b.idx}>
            <rect x={b.x} y={height - b.h} width={b.w} height={b.h} fill={col}/>
            {/* Art-deco setback */}
            {hasSetback && (
              <>
                <rect x={b.x + Math.floor(b.w*0.18)} y={height - b.h - Math.floor(b.h*0.22)}
                  width={Math.floor(b.w*0.64)} height={Math.floor(b.h*0.22)} fill={col}/>
                <rect x={b.x + Math.floor(b.w*0.38)} y={height - b.h - Math.floor(b.h*0.22) - Math.floor(b.h*0.1)}
                  width={Math.floor(b.w*0.24)} height={Math.floor(b.h*0.1)} fill={col}/>
                {/* spire */}
                <rect x={b.x + Math.floor(b.w/2) - 0.9} y={height - b.h - Math.floor(b.h*0.22) - Math.floor(b.h*0.1) - 14}
                  width={1.8} height={16} fill="rgba(255,255,255,0.13)"/>
              </>
            )}
            {/* Slim antenna */}
            {hasTip && !hasSetback && (
              <rect x={b.x + Math.floor(b.w/2) - 0.8} y={height - b.h - 13}
                width={1.6} height={15} fill="rgba(255,255,255,0.14)"/>
            )}
            {/* Windows */}
            {Array.from({length: rows}, (_, row) =>
              Array.from({length: cols}, (_, col_) => {
                const seed = b.idx * 11 + row * 7 + col_ * 13;
                if (seed % 5 === 0) return null;
                const isPink = seed % 9 === 1;
                const isBlue = seed % 13 === 3;
                const fill = isPink ? "rgba(255,140,195,0.88)" : isBlue ? "rgba(160,200,255,0.75)" : "rgba(255,218,155,0.78)";
                return (
                  <rect key={`${row}-${col_}`}
                    x={b.x + 1 + col_ * (winW + gapX)}
                    y={height - b.h + 5 + row * (winH + gapY)}
                    width={winW} height={winH} rx="0.3" fill={fill}/>
                );
              })
            )}
          </g>
        );
      })}

      {/* Ground ambient glow */}
      <rect x={0} y={height - 10} width={width} height={10} fill="rgba(255,31,125,0.08)"/>
    </svg>
  );
}

/* ── Window strip texture (for inside signs) ───────────────────── */
function WindowStrip() {
  const data = Array.from({length: 70}, (_, i) => ({
    x: i * 7 + (i % 4) * 1.5,
    lit: (i * 11 + 3) % 5 !== 0,
    pink: (i * 13 + 7) % 7 === 0,
    tall: (i * 17 + 5) % 9 === 0,
  }));
  return (
    <svg width="100%" height="18" style={{ display: "block", overflow: "visible" }}>
      {data.map((d, i) => d.lit && (
        <rect key={i} x={d.x} y={d.pink ? 2 : d.tall ? 1 : 4}
          width={d.tall ? 3 : 4} height={d.pink ? 8 : d.tall ? 10 : 5}
          rx="0.4" fill={d.pink ? "rgba(255,110,170,0.65)" : "rgba(255,210,145,0.52)"}/>
      ))}
    </svg>
  );
}

/* ── Band data ─────────────────────────────────────────────────── */
interface Band {
  id: CityCategory;
  label: string;
  sub: string;
  icon: string;
  accentColor: string;
  href?: string;
}

const BANDS: Band[] = [
  { id: "eats",       label: "EAT",        sub: "Restaurants, cafés & bars",              icon: "🍽️", accentColor: "#FF9B70" },
  { id: "go",         label: "GO",         sub: "Museums, galleries & more",              icon: "🎨", accentColor: "#87CEEB" },
  { id: "solo",       label: "SOLO",       sub: "Thoughtful things to do by yourself",    icon: "☕", accentColor: "#FFD98A" },
  { id: "favorites",  label: "GIRL PICKS", sub: "The best of the city, curated by women", icon: "✦",  accentColor: "#FF80B0" },
  { id: "happenings", label: "HAPPENINGS", sub: "What's happening in the city",           icon: "🎉", accentColor: "#C8A0FF" },
  { id: "places",     label: "PLACES",     sub: "Neighborhoods, guides & more",           icon: "📍", accentColor: "#80D4B0", href: "/member/city/places" },
];

/* ── Eats sub-page ─────────────────────────────────────────────── */

const FILTERS = ["Tonight","1+","Italian","Cocktails","Date Night","Brunch","Outdoor","Sushi","Wine Bars"];

const FEATURED = [
  { id: 1, name: "Bar Pisellino", neighborhood: "WEST VILLAGE", cuisine: "ITALIAN", women: 18, note: "So early for a martini at the bar — Maya", bg: "#1a0a0e" },
  { id: 2, name: "Lola Taverna",  neighborhood: "WEST VILLAGE", cuisine: "GREEK",   women: 41, badge: "TRENDING", note: "Everything we ordered was perfect — Dani", bg: "#2d1a0e" },
  { id: 3, name: "Via Carota",    neighborhood: "WEST VILLAGE", cuisine: "ITALIAN", women: 12, badge: "⚑ RESERVED", bg: PAPER, reservation: { time: "8:15PM", seats: "2 SEATS" }, light: true },
];

const GRID_SPOTS = [
  { id: 4, name: "Sant Ambroeus", neighborhood: "SOHO",         saved: 12, bg: "#FAF0E8" },
  { id: 5, name: "Cecconi's",     neighborhood: "SOHO",         saved: 8,  bg: "#F0EAF8" },
  { id: 6, name: "Rubirosa",      neighborhood: "NOLITA",       saved: 12, bg: "#FFF5F8" },
  { id: 7, name: "Pasta Night",   neighborhood: "LES",          saved: 8,  bg: "#F5F0E8" },
  { id: 8, name: "Four Horsemen", neighborhood: "WILLIAMSBURG", saved: 11, bg: "#EEEAE0" },
  { id: 9, name: "Burette",       neighborhood: "WEST VILLAGE", saved: 7,  bg: "#F0EEF8" },
];

function EatsPage({ onBack }: { onBack: () => void }) {
  const [activeFilter, setActiveFilter] = useState("Tonight");
  const [savedIds, setSaved] = useState<number[]>([]);
  function toggleSave(id: number) { setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]); }

  return (
    <div style={{ backgroundImage: PAPER_TEX, backgroundColor: CREAM, backgroundSize: "200px 200px", minHeight: "100vh", paddingBottom: 120 }}>
      <div style={{ position: "relative", height: 200, background: "#0d0806", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 30%, #3d1a0a 0%, #0d0806 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />
        <button onClick={onBack} style={{ position: "absolute", top: 56, left: 16, background: "rgba(0,0,0,0.4)", border: "none", borderRadius: 999, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>CITY</span>
        </button>
        <div style={{ position: "absolute", bottom: 16, left: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>EATS · NYC</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Tonight&apos;s<br />Table</p>
        </div>
      </div>
      <div style={{ background: "#0d0806", paddingBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px 0", scrollbarWidth: "none" as const }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ flexShrink: 0, padding: "6px 13px", borderRadius: 999, border: `1.5px solid ${activeFilter === f ? PINK : "rgba(255,255,255,0.15)"}`, background: activeFilter === f ? PINK : "transparent", color: activeFilter === f ? "white" : "rgba(255,255,255,0.55)", fontSize: "10px", fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer" }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "14px 14px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div style={{ gridRow: "span 2", background: FEATURED[0].bg, borderRadius: 18, minHeight: 240, position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.22)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 30%, rgba(180,30,60,0.5) 0%, transparent 70%)" }} />
            <div style={{ position: "absolute", top: 18, left: 12 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "#ff9eb5", lineHeight: 1.1, textShadow: "0 0 20px rgba(255,31,125,0.6)" }}>Bar<br />Pisellino</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginTop: 4 }}>{FEATURED[0].neighborhood} · {FEATURED[0].cuisine}</p>
            </div>
            <div style={{ position: "absolute", top: 12, right: 10, background: PINK, borderRadius: 999, padding: "3px 8px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "white" }}>{FEATURED[0].women} going</span>
            </div>
            <div style={{ position: "absolute", bottom: 14, left: 12, right: 12 }}>
              <div style={{ transform: "rotate(-1deg)", background: "rgba(255,255,230,0.88)", padding: "7px 9px" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#444", lineHeight: 1.4 }}>{FEATURED[0].note}</p>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", background: FEATURED[1].bg, borderRadius: 18, minHeight: 112, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 60% 30%, rgba(100,50,20,0.6) 0%, transparent 70%)" }} />
            {FEATURED[1].badge && <div style={{ position: "absolute", top: 10, left: 10, background: PINK, borderRadius: 999, padding: "2px 8px" }}><span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>{FEATURED[1].badge}</span></div>}
            <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: "rgba(255,230,200,0.92)", lineHeight: 1.1 }}>{FEATURED[1].name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", marginTop: 2 }}>{FEATURED[1].neighborhood}</p>
            </div>
          </div>
          <div style={{ backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", borderRadius: 18, minHeight: 112, padding: "12px 12px 10px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            {FEATURED[2].badge && <div style={{ display: "inline-flex", background: "#2d1a0a", borderRadius: 999, padding: "3px 9px", marginBottom: 6 }}><span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "#d4a060", letterSpacing: "0.1em" }}>{FEATURED[2].badge}</span></div>}
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.1 }}>{FEATURED[2].name}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#aaa", letterSpacing: "0.08em", marginTop: 2 }}>{FEATURED[2].neighborhood}</p>
            {FEATURED[2].reservation && (
              <div style={{ marginTop: 8, background: DARK, borderRadius: 8, padding: "6px 8px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "#d4a060" }}>{FEATURED[2].reservation.time}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>{FEATURED[2].reservation.seats}</p>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {GRID_SPOTS.map(spot => (
            <div key={spot.id} style={{ backgroundImage: PAPER_TEX, backgroundColor: spot.bg, backgroundSize: "200px 200px", borderRadius: 16, padding: "12px 12px 10px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 700, fontStyle: "italic", color: DARK, lineHeight: 1.2, marginBottom: 4 }}>{spot.name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "#aaa", letterSpacing: "0.06em" }}>{spot.neighborhood}</p>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#bbb" }}>{spot.saved} saved</span>
                <button onClick={() => toggleSave(spot.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill={savedIds.includes(spot.id) ? PINK : "none"} stroke={PINK} strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{ backgroundImage: PAPER_TEX, backgroundColor: "#FEF3E8", backgroundSize: "200px 200px", borderRadius: 14, padding: "14px 12px", transform: "rotate(-0.5deg)", boxShadow: "2px 4px 14px rgba(0,0,0,0.25)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 8 }}>GO-TO SPOTS LATELY</p>
            {["Bar Pisellino","Sushi Noz","Lucien","Café Kitsuné","Buvette"].map((name, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "#2a1a10" }}>{name}</span>
              </div>
            ))}
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: PINK, marginTop: 6, opacity: 0.7 }}>girls night →</p>
          </div>
          <div style={{ borderRadius: 14, background: "#0d0806", overflow: "hidden", position: "relative", minHeight: 160, boxShadow: "0 4px 20px rgba(0,0,0,0.45)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 20%, rgba(40,20,10,0.8) 0%, rgba(5,3,2,0.95) 80%)" }}/>
            <div style={{ position: "absolute", inset: 0, padding: "14px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>ROOFTOP · NOMAD</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: "rgba(255,245,235,0.92)", lineHeight: 1.2 }}>The Roof at<br/>PUBLIC Hotel</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: PINK, letterSpacing: "0.1em", marginBottom: 6 }}>AMAZING VIEWS ✦</p>
                <div style={{ background: PINK, borderRadius: 999, padding: "5px 12px", display: "inline-flex" }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>18 GOING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Coming soon ───────────────────────────────────────────────── */
function ComingSoon({ band, onBack }: { band: Band; onBack: () => void }) {
  return (
    <div style={{ background: "#0D0814", minHeight: "100vh", paddingBottom: 100 }}>
      <div style={{ position: "relative", height: 230, overflow: "hidden" }}>
        <NightSkyline width={430} height={230}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 25%, rgba(13,8,20,0.88) 100%)" }}/>
        <button onClick={onBack} style={{ position: "absolute", top: 56, left: 16, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,31,125,0.2)", borderRadius: 999, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>CITY</span>
        </button>
        <div style={{ position: "absolute", bottom: 20, left: 20 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: band.accentColor, marginBottom: 6 }}>{band.label}</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Coming<br />Soon</p>
        </div>
      </div>
      <div style={{ padding: "28px 24px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,200,220,0.55)", lineHeight: 1.6 }}>We&apos;re curating the best of NYC.<br />Check back soon.</p>
      </div>
    </div>
  );
}

/* ── City Landing ──────────────────────────────────────────────── */
function CityLanding({ onSelect }: { onSelect: (c: CityCategory) => void }) {
  const [hovered, setHovered] = useState<CityCategory | null>(null);

  return (
    <div style={{ background: "#080612", minHeight: "100vh", paddingBottom: 100, position: "relative", overflow: "hidden" }}>
      <style>{CSS}</style>

      {/* Fixed background skyline */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <NightSkyline width={430} height={800}/>
      </div>

      {/* Pink haze overlay */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 90%, rgba(255,31,125,0.12) 0%, transparent 65%)" }}/>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{ padding: "72px 22px 28px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.32em", color: PINK, marginBottom: 8 }}>
            BB+ · NEW YORK CITY
          </p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(38px,10vw,52px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 0.95, marginBottom: 10 }}>
            Your City.
          </p>
          <p style={{ fontFamily: "var(--font-instrument)", fontSize: "13px", fontStyle: "italic", color: "rgba(255,200,220,0.55)", letterSpacing: "0.01em" }}>
            Everything women love about this city.
          </p>
          {/* Decorative pink rule */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14 }}>
            <div style={{ height: 1, width: 40, background: `linear-gradient(to right, ${PINK}, transparent)`, opacity: 0.5 }}/>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: PINK, opacity: 0.6 }}/>
          </div>
        </div>

        {/* ── Signs ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: "0 14px 24px" }}>
          {BANDS.map((band) => {
            const isHov = hovered === band.id;

            const signInner = (
              <div style={{
                position: "relative",
                height: 78,
                clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 50%, calc(100% - 28px) 100%, 0 100%)",
                background: `linear-gradient(180deg, rgba(42,18,38,0.96) 0%, rgba(26,10,24,0.98) 100%)`,
                borderTop:    `1px solid rgba(255,31,125,${isHov ? "0.55" : "0.22"})`,
                borderBottom: "1px solid rgba(0,0,0,0.4)",
                boxShadow:    isHov ? "0 6px 32px rgba(255,31,125,0.22), 0 2px 8px rgba(0,0,0,0.4)" : "0 2px 14px rgba(0,0,0,0.35)",
                overflow: "hidden",
                transition: "box-shadow 0.2s, border-top-color 0.2s",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
              }}>
                {/* Window strip — centred */}
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: 0, right: 44, opacity: isHov ? 0.75 : 0.45, transition: "opacity 0.2s", overflow: "hidden" }}>
                  <WindowStrip/>
                </div>

                {/* Dark overlay for readability */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(26,10,24,0.92) 0%, rgba(26,10,24,0.72) 38%, rgba(26,10,24,0.82) 78%, transparent 100%)", pointerEvents: "none" }}/>

                {/* Left pink edge accent */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${band.accentColor}80, ${band.accentColor}30)`, opacity: isHov ? 1 : 0.6, transition: "opacity 0.2s" }}/>

                {/* Content row */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 48px 0 18px", gap: 0 }}>

                  {/* Icon circle */}
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `rgba(255,31,125,${isHov ? "0.18" : "0.1"})`, border: `1px solid rgba(255,31,125,${isHov ? "0.5" : "0.22"})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 14, transition: "background 0.2s, border-color 0.2s" }}>
                    <span style={{ fontSize: band.icon === "✦" ? 16 : 18, lineHeight: 1 }}>{band.icon}</span>
                  </div>

                  {/* Category label */}
                  <p style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: band.label.length > 7 ? 19 : 26,
                    fontWeight: 900,
                    fontStyle: "italic",
                    color: isHov ? "#FFFFFF" : "#F2D8E8",
                    lineHeight: 1,
                    letterSpacing: "-0.01em",
                    flexShrink: 0,
                    minWidth: band.label.length > 7 ? 110 : 72,
                    textShadow: isHov ? `0 0 24px rgba(255,31,125,0.55)` : `0 0 0 transparent`,
                    transition: "color 0.2s, text-shadow 0.2s",
                  }}>
                    {band.label}
                  </p>

                  {/* Divider */}
                  <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.13)", flexShrink: 0, margin: "0 14px" }}/>

                  {/* Subtitle */}
                  <p style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    color: isHov ? "rgba(255,210,230,0.8)" : "rgba(255,180,210,0.48)",
                    lineHeight: 1.45,
                    flex: 1,
                    minWidth: 0,
                    transition: "color 0.2s",
                  }}>
                    {band.sub}
                  </p>

                  {/* Arrow */}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isHov ? PINK : "rgba(255,100,150,0.4)"} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginRight: 18, transition: "stroke 0.2s" }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            );

            if (band.href) {
              return (
                <Link key={band.id} href={band.href} style={{ textDecoration: "none", display: "block" }}
                  onMouseEnter={() => setHovered(band.id)}
                  onMouseLeave={() => setHovered(null)}
                  onTouchStart={() => setHovered(band.id)}
                  onTouchEnd={() => setHovered(null)}>
                  {signInner}
                </Link>
              );
            }

            return (
              <button
                key={band.id}
                onClick={() => onSelect(band.id)}
                onMouseEnter={() => setHovered(band.id)}
                onMouseLeave={() => setHovered(null)}
                onTouchStart={() => setHovered(band.id)}
                onTouchEnd={() => setHovered(null)}
                style={{ background: "none", border: "none", padding: 0, display: "block", width: "100%", cursor: "pointer" }}>
                {signInner}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Main export ───────────────────────────────────────────────── */
export function CityPage() {
  const [category, setCategory] = useState<CityCategory>("landing");

  if (category === "landing")   return <CityLanding onSelect={setCategory}/>;
  if (category === "eats")      return <EatsPage    onBack={() => setCategory("landing")}/>;

  const band = BANDS.find(b => b.id === category)!;
  return <ComingSoon band={band} onBack={() => setCategory("landing")}/>;
}
