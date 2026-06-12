"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { HappeningsPage } from "./happenings-page";

// ── Design tokens ─────────────────────────────────────────────────────────────
const PINK  = "#FF1F7D";
const CREAM = "#F6F1EB";
const PAPER = "#FEFCF7";
const DARK  = "#1C1B1C";

// ── Textures ──────────────────────────────────────────────────────────────────
const PAPER_TEX  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;
const DARK_GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' fill='%23fff' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;
const LINEN_TEX  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08 0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='80' height='80' fill='%23000' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`;

// ── CSS animations ────────────────────────────────────────────────────────────
const CSS = `
@keyframes trainRoll {
  0%   { transform: translateX(-140px); }
  100% { transform: translateX(calc(100vw + 60px)); }
}
@keyframes carRoll {
  0%   { transform: translateX(calc(100vw + 60px)) scaleX(-1); }
  100% { transform: translateX(-140px) scaleX(-1); }
}
@keyframes signSway {
  0%, 100% { transform: rotate(-1.5deg); }
  50%       { transform: rotate(1.5deg); }
}
@keyframes signBob {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-5px); }
}
@keyframes signGlow {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}
@keyframes flameFlicker {
  0%, 100% { transform: scaleX(1) scaleY(1); opacity: 0.9; }
  25%       { transform: scaleX(0.86) scaleY(1.12); opacity: 1; }
  50%       { transform: scaleX(1.1) scaleY(0.92); opacity: 0.82; }
  75%       { transform: scaleX(0.92) scaleY(1.07); opacity: 0.97; }
}
@keyframes tickerScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes hotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(0.97); }
}
@keyframes champFloat {
  0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
  50%       { transform: translateY(-7px) rotate(1.5deg); }
}
@keyframes soloFade {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes gallerySweep {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes poleAppear {
  from { transform: scaleY(0); transform-origin: top center; }
  to   { transform: scaleY(1); transform-origin: top center; }
}
`;

// ── Types ─────────────────────────────────────────────────────────────────────
type CityCategory = "landing" | "places" | "people" | "culture" | "activity";

interface Band {
  id: CityCategory;
  label: string;
  sub: string;
  icon: string;
  accentColor: string;
}

// ── Neighborhood search index ─────────────────────────────────────────────────
const HOOD_INDEX = [
  { name: "West Village",      slug: "west-village",      borough: "Manhattan",   tags: ["wine bars","date night","italian","cobblestones"] },
  { name: "SoHo",              slug: "soho",               borough: "Manhattan",   tags: ["shopping","brunch","galleries","cast iron"] },
  { name: "Nolita",            slug: "nolita",             borough: "Manhattan",   tags: ["cafés","boutiques","strolling","cool"] },
  { name: "Williamsburg",      slug: "williamsburg",       borough: "Brooklyn",    tags: ["brunch","vintage","rooftops","music"] },
  { name: "DUMBO",             slug: "dumbo",              borough: "Brooklyn",    tags: ["waterfront","galleries","views","arch"] },
  { name: "Brooklyn Heights",  slug: "brooklyn-heights",   borough: "Brooklyn",    tags: ["promenade","brownstones","quiet","views"] },
  { name: "Park Slope",        slug: "park-slope",         borough: "Brooklyn",    tags: ["families","brunch","bookshops","chill"] },
  { name: "Lower East Side",   slug: "lower-east-side",    borough: "Manhattan",   tags: ["bars","live music","vintage","edgy"] },
  { name: "Chelsea",           slug: "chelsea",            borough: "Manhattan",   tags: ["galleries","high line","art","west side"] },
  { name: "Harlem",            slug: "harlem",             borough: "Manhattan",   tags: ["culture","music","soul food","history"] },
  { name: "Astoria",           slug: "astoria",            borough: "Queens",      tags: ["greek food","chill","coffee","affordable"] },
  { name: "Crown Heights",     slug: "crown-heights",      borough: "Brooklyn",    tags: ["culture","caribbean","arts","nightlife"] },
  { name: "Upper East Side",   slug: "upper-east-side",    borough: "Manhattan",   tags: ["museums","elegant","brunch","classic nyc"] },
  { name: "Bushwick",          slug: "bushwick",           borough: "Brooklyn",    tags: ["murals","nightlife","art","studios"] },
  { name: "Flushing",          slug: "flushing",           borough: "Queens",      tags: ["dim sum","asian food","markets","culture"] },
];

const BANDS: Band[] = [
  { id: "places",   label: "PLACES",   sub: "Restaurants · Cafés · Museums",          icon: "🍽️", accentColor: "#FF1F7D" },
  { id: "people",   label: "PEOPLE",   sub: "Clubs · Open Seats · Gatherings",        icon: "👭", accentColor: "#E8006A" },
  { id: "culture",  label: "CULTURE",  sub: "What girls love · Hidden gems · Trends", icon: "✦",  accentColor: "#FF5BAD" },
  { id: "activity", label: "ACTIVITY", sub: "Events · Happenings · Things to do",     icon: "🌃", accentColor: "#C80060" },
];

// ── Day Skyline SVG ───────────────────────────────────────────────────────────
function DaySkyline({ width = 430, height = 700 }: { width?: number; height?: number }) {
  function lcg(s: number) { return (s * 16807) % 2147483647; }
  const buildings: { x: number; w: number; h: number; idx: number }[] = [];
  let x = 0, s = 42, idx = 0;
  while (x < width + 40) {
    s = lcg(s); const w = 10 + (s % 19);
    s = lcg(s); const hFrac = 0.38 + (s % 1000) / 1000 * 0.52;
    buildings.push({ x, w, h: Math.floor(height * hFrac), idx });
    x += w; idx++;
  }
  const bldgColors = ["#F5E6FF","#FFE0F0","#FFF0E8","#E8F4FF","#FFF5E0","#F0E8FF","#FFE8D6","#E8FFF5","#FFE0EC","#F8E8FF"];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" style={{ display: "block", width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="sg_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB3D9"/>
          <stop offset="50%" stopColor="#FF7BAC"/>
          <stop offset="100%" stopColor="#FFC8A0"/>
        </linearGradient>
        <radialGradient id="sg_sun" cx="70%" cy="25%" r="30%">
          <stop offset="0%" stopColor="rgba(255,240,180,0.55)"/>
          <stop offset="100%" stopColor="rgba(255,200,100,0)"/>
        </radialGradient>
        <radialGradient id="sg_glow" cx="50%" cy="85%" r="55%">
          <stop offset="0%" stopColor="rgba(255,180,120,0.25)"/>
          <stop offset="100%" stopColor="rgba(255,180,120,0)"/>
        </radialGradient>
      </defs>
      <rect width={width} height={height} fill="url(#sg_sky)"/>
      <rect width={width} height={height} fill="url(#sg_sun)"/>
      <rect width={width} height={height} fill="url(#sg_glow)"/>
      {buildings.map((b) => {
        const col = bldgColors[b.idx % bldgColors.length];
        const winW = 3, winH = 3, gapX = 4, gapY = 5;
        const cols = Math.max(1, Math.floor((b.w - 2) / (winW + gapX)));
        const rows = Math.max(1, Math.floor((b.h - 8) / (winH + gapY)));
        const hasSetback = b.w >= 16 && b.h >= height * 0.65 && b.idx % 6 === 2;
        return (
          <g key={b.idx}>
            <rect x={b.x} y={height - b.h} width={b.w} height={b.h} fill={col}/>
            {hasSetback && (
              <>
                <rect x={b.x + Math.floor(b.w*.18)} y={height - b.h - Math.floor(b.h*.22)} width={Math.floor(b.w*.64)} height={Math.floor(b.h*.22)} fill={col}/>
                <rect x={b.x + Math.floor(b.w/2) - 0.9} y={height - b.h - Math.floor(b.h*.32) - 14} width={1.8} height={16} fill="rgba(200,100,180,0.3)"/>
              </>
            )}
            {Array.from({length: rows}, (_, row) =>
              Array.from({length: cols}, (_, col_) => {
                const seed = b.idx * 11 + row * 7 + col_ * 13;
                if (seed % 5 === 0) return null;
                const fill = seed % 9 === 1 ? "rgba(255,180,80,0.85)" : seed % 13 === 3 ? "rgba(255,120,180,0.75)" : "rgba(255,200,120,0.7)";
                return <rect key={`${row}-${col_}`} x={b.x + 1 + col_ * (winW + gapX)} y={height - b.h + 5 + row * (winH + gapY)} width={winW} height={winH} rx="0.3" fill={fill}/>;
              })
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Window strip (for sign fill texture) ─────────────────────────────────────
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

// ── Back button shared ────────────────────────────────────────────────────────
function BackBtn({ onBack, label = "CITY" }: { onBack: () => void; label?: string }) {
  return (
    <button onClick={onBack} style={{
      position: "absolute", top: 56, left: 16, zIndex: 20,
      background: "rgba(0,0,0,0.38)", backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999,
      padding: "6px 13px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
    }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "white", letterSpacing: "0.07em" }}>{label}</span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUILDING LABELS PANEL  (landing slide 0)
// Buildings laid flat horizontally — a scrollable city avenue
// ═══════════════════════════════════════════════════════════════════════════════
function BuildingLabelsPanel({ onSelect, onSwipeToMenu }: { onSelect: (c: CityCategory) => void; onSwipeToMenu: () => void }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed.length > 0
    ? HOOD_INDEX.filter(h =>
        h.name.toLowerCase().includes(trimmed) ||
        h.borough.toLowerCase().includes(trimmed) ||
        h.tags.some(t => t.includes(trimmed))
      ).slice(0, 5)
    : [];

  const showDropdown = focused && (results.length > 0 || trimmed.length > 0);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const strips: { band: Band; solidBg: string; lightBg: string }[] = [
    { band: BANDS[0], solidBg: "#C80060", lightBg: "#FF1F7D" },
    { band: BANDS[1], solidBg: "#A8004C", lightBg: "#E8006A" },
    { band: BANDS[2], solidBg: "#E8006A", lightBg: "#FF5BAD" },
    { band: BANDS[3], solidBg: "#FF1F7D", lightBg: "#C80060" },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden",
      background: "linear-gradient(180deg, #FFB3D9 0%, #FF8FB8 20%, #FFC090 55%, #FFD4A8 80%, #FFDFC8 100%)",
      display: "flex", flexDirection: "column",
    }}>
      <style>{CSS}</style>
      {/* Sky backdrop */}
      <div style={{ position: "absolute", inset: 0 }}>
        <DaySkyline />
      </div>
      {/* Haze at ground level */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "38%", background: "linear-gradient(to top, rgba(255,210,170,0.45), transparent)", pointerEvents: "none" }} />

      {/* City header — title and CITY GUIDE button on the same row */}
      <div style={{
        position: "relative", zIndex: 5,
        padding: "68px 20px 0",
        display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12,
      }}>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.32em", color: "rgba(255,255,255,0.85)", marginBottom: 5 }}>THE CITY</p>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 31, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, textShadow: "0 2px 16px rgba(200,50,100,0.5)", margin: 0 }}>
            Your<br />Avenue.
          </h1>
        </div>
        <button onClick={onSwipeToMenu} style={{
          flexShrink: 0, marginBottom: 4,
          background: "rgba(255,255,255,0.28)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.45)", borderRadius: 999,
          padding: "9px 15px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 7,
          WebkitTapHighlightColor: "transparent",
        }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "white", letterSpacing: "0.1em" }}>CITY GUIDE</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {/* ── Neighborhood search ── */}
      <div style={{ position: "relative", zIndex: 20, padding: "14px 20px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 9,
          background: "rgba(255,255,255,0.22)", backdropFilter: "blur(14px) saturate(1.3)",
          WebkitBackdropFilter: "blur(14px) saturate(1.3)",
          border: `1.5px solid ${focused ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)"}`,
          borderRadius: 999, padding: "10px 16px",
          transition: "border-color 0.2s",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search a neighborhood…"
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 500,
              color: "white", letterSpacing: "0.01em",
            }}
          />
          {query.length > 0 && (
            <button onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" strokeLinecap="round">
                <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
              </svg>
            </button>
          )}
        </div>

        {/* Dropdown results */}
        {showDropdown && (
          <div ref={dropdownRef} style={{
            position: "absolute", top: "calc(100% - 4px)", left: 20, right: 20,
            background: "rgba(20,4,16,0.96)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18, overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
            zIndex: 30,
          }}>
            {results.length > 0 ? results.map((hood, i) => (
              <Link key={hood.slug} href={`/member/city/neighborhoods/${hood.slug}`} style={{ textDecoration: "none", display: "block" }}
                onClick={() => { setQuery(""); setFocused(false); }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "13px 16px",
                  borderBottom: i < results.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: PINK, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 16, color: "white", lineHeight: 1 }}>{hood.name}</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginTop: 2 }}>{hood.borough.toUpperCase()}</p>
                    </div>
                  </div>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </Link>
            )) : (
              <div style={{ padding: "18px 16px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>No neighborhoods found for "{trimmed}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Avenue: horizontal strips stacked vertically ── */}
      <div style={{ position: "relative", zIndex: 5, flex: 1, overflowY: "auto", scrollbarWidth: "none" as const }}>
        {strips.map(({ band, solidBg, lightBg }, idx) => (
          <button
            key={band.id}
            onClick={() => onSelect(band.id)}
            style={{
              width: "100%", height: 78,
              display: "flex", flexDirection: "row",
              background: "none", border: "none",
              borderBottom: idx < strips.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none",
              cursor: "pointer", position: "relative", overflow: "hidden",
              WebkitTapHighlightColor: "transparent",
              padding: 0,
            }}
          >
            {/* Left solid block with rotated label */}
            <div style={{
              width: 76, height: "100%", flexShrink: 0,
              background: solidBg,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: "var(--font-jost)",
                fontSize: band.label.length > 7 ? 8 : 11,
                fontWeight: 900, color: "white",
                letterSpacing: "0.18em",
                writingMode: "vertical-rl" as const,
                transform: "rotate(180deg)",
              }}>
                {band.label}
              </span>
            </div>
            {/* Right: lighter with dot texture + icon + sub */}
            <div style={{
              flex: 1, height: "100%",
              background: lightBg,
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.22) 1.5px, transparent 1.5px)",
              backgroundSize: "14px 14px",
              display: "flex", alignItems: "center",
              padding: "0 18px",
              gap: 14,
            }}>
              <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{band.icon}</span>
              <p style={{
                fontFamily: "var(--font-jost)",
                fontSize: "11px", fontWeight: 500,
                color: "rgba(255,255,255,0.82)",
                letterSpacing: "0.02em",
                lineHeight: 1.3,
              }}>
                {band.sub}
              </p>
            </div>
            {/* Arrow */}
            <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Girl Gems + Girl Favorites data ──────────────────────────────────────────
const GIRL_GEMS = [
  { name: "Caffe Reggio", neighborhood: "Greenwich Village", type: "café", note: "Oldest espresso machine in NYC. Order the cappuccino.", emoji: "☕", color: "#8B4513" },
  { name: "Corner Bar", neighborhood: "NoHo", type: "bar", note: "No sign outside. Tiny, perfect, intimate.", emoji: "🍷", color: "#722F37" },
  { name: "Bluestockings", neighborhood: "LES", type: "bookshop", note: "Radical feminist bookshop. Buy something.", emoji: "📚", color: "#1A4A1A" },
  { name: "Lucien", neighborhood: "East Village", type: "restaurant", note: "Always full but worth the wait. Order the steak frites.", emoji: "🥩", color: "#8B1A1A" },
  { name: "Housing Works", neighborhood: "SoHo", type: "shop", note: "The best thrift store in NYC. Everything is $5–$40.", emoji: "🛍", color: "#2A4A7F" },
];

const GIRL_FAVS = [
  { name: "Cha Cha Matcha", neighborhood: "Multiple locations", saves: 847, emoji: "🍵" },
  { name: "Bar Pisellino", neighborhood: "West Village", saves: 623, emoji: "🍸" },
  { name: "The Strand", neighborhood: "Flatiron", saves: 541, emoji: "📚" },
  { name: "Café Kitsuné", neighborhood: "West Village", saves: 488, emoji: "☕" },
  { name: "Russ & Daughters", neighborhood: "LES", saves: 412, emoji: "🥯" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CITY MENU PANEL  (landing slide 1)
// ═══════════════════════════════════════════════════════════════════════════════
function CityMenuPanel({ onSelect, onSwipeBack }: { onSelect: (c: CityCategory) => void; onSwipeBack: () => void }) {
  const [hovered, setHovered] = useState<CityCategory | null>(null);
  return (
    <div style={{
      background: "linear-gradient(180deg, #FFB3D9 0%, #FF8FB8 20%, #FFC090 55%, #FFDFC8 100%)", minHeight: "100vh", paddingBottom: 100, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <DaySkyline width={430} height={800}/>
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 90%, rgba(255,31,125,0.12) 0%, transparent 65%)" }}/>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header row */}
        <div style={{ padding: "72px 22px 20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: PINK, marginBottom: 6 }}>BB+ · NEW YORK CITY</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <p style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px,8vw,44px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 0.95 }}>City Guide.</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>restaurants, bars &amp; more</p>
            </div>
          </div>
          <button onClick={onSwipeBack} style={{
            marginTop: 6, background: "rgba(255,255,255,0.35)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.5)", borderRadius: 999,
            padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "white", letterSpacing: "0.08em" }}>SIGNS</span>
          </button>
        </div>

        {/* ── GIRL GEMS ── */}
        <section style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.38)" }}>GIRL GEMS</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>spots only we know ♡</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {GIRL_GEMS.map((gem, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 18, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: gem.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{gem.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{gem.name}</p>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}>{gem.type}</span>
                    </div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{gem.neighborhood}</p>
                    <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4, lineHeight: 1.5 }}>{gem.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── GIRL FAVORITES ── */}
        <section style={{ padding: "24px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.38)" }}>GIRL FAVORITES</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>most saved this month ♡</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {GIRL_FAVS.map((fav, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.25)", minWidth: 20 }}>0{i+1}</span>
                <span style={{ fontSize: 18 }}>{fav.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{fav.name}</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.38)" }}>{fav.neighborhood}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{fav.saves.toLocaleString()}</p>
                  <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>saves</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Band list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: "0 14px 24px" }}>
          {BANDS.map((band) => {
            const isHov = hovered === band.id;
            return (
              <button key={band.id} onClick={() => onSelect(band.id)}
                onMouseEnter={() => setHovered(band.id)} onMouseLeave={() => setHovered(null)}
                onTouchStart={() => setHovered(band.id)} onTouchEnd={() => setHovered(null)}
                style={{ background: "none", border: "none", padding: 0, display: "block", width: "100%", cursor: "pointer" }}>
                <div style={{
                  position: "relative", height: 76,
                  clipPath: "polygon(0 0, calc(100% - 26px) 0, 100% 50%, calc(100% - 26px) 100%, 0 100%)",
                  backgroundImage: `${DARK_GRAIN}, linear-gradient(180deg, rgba(42,18,38,0.96) 0%, rgba(26,10,24,0.98) 100%)`,
                  backgroundSize: "160px 160px, 100% 100%",
                  borderTop: `1px solid rgba(255,31,125,${isHov ? "0.55" : "0.22"})`,
                  borderBottom: "1px solid rgba(0,0,0,0.4)",
                  boxShadow: isHov ? "0 6px 32px rgba(255,31,125,0.22)" : "0 2px 14px rgba(0,0,0,0.35)",
                  overflow: "hidden", transition: "box-shadow 0.2s",
                  WebkitTapHighlightColor: "transparent",
                }}>
                  <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: 0, right: 44, opacity: isHov ? 0.7 : 0.4, overflow: "hidden", transition: "opacity 0.2s" }}>
                    <WindowStrip/>
                  </div>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(26,10,24,0.94) 0%, rgba(26,10,24,0.7) 40%, rgba(26,10,24,0.84) 80%, transparent 100%)", pointerEvents: "none" }}/>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${band.accentColor}80, ${band.accentColor}30)`, opacity: isHov ? 1 : 0.6, transition: "opacity 0.2s" }}/>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 46px 0 18px", gap: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `rgba(255,31,125,${isHov ? "0.18" : "0.08"})`, border: `1px solid rgba(255,31,125,${isHov ? "0.5" : "0.18"})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 12, transition: "all 0.2s" }}>
                      <span style={{ fontSize: 15 }}>{band.icon}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-playfair)", fontSize: band.label.length > 7 ? 18 : 24, fontWeight: 900, fontStyle: "italic", color: isHov ? "#FFF" : "#F2D8E8", lineHeight: 1, flexShrink: 0, minWidth: band.label.length > 7 ? 110 : 70, textShadow: isHov ? `0 0 22px rgba(255,31,125,0.55)` : "none", transition: "all 0.2s" }}>
                      {band.label}
                    </p>
                    <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.12)", flexShrink: 0, margin: "0 12px" }}/>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: isHov ? "rgba(255,210,230,0.8)" : "rgba(255,180,210,0.45)", lineHeight: 1.45, flex: 1, minWidth: 0, transition: "color 0.2s" }}>
                      {band.sub}
                    </p>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={isHov ? PINK : "rgba(255,100,150,0.38)"} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginRight: 16, transition: "stroke 0.2s" }}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CITY LANDING  —  two-pane swipeable wrapper
// ═══════════════════════════════════════════════════════════════════════════════
function CityLanding({ onSelect }: { onSelect: (c: CityCategory) => void }) {
  const [slide, setSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) setSlide(dx < 0 ? 1 : 0);
    touchStartX.current = null; touchStartY.current = null;
  }

  return (
    <div style={{ position: "relative", overflow: "hidden", height: "100vh" }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Panel 0: avenue signs */}
      <div style={{ position: "absolute", inset: 0, overflowY: "auto",
        transform: `translateX(${slide === 0 ? "0" : "-100%"})`,
        transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
        <BuildingLabelsPanel onSelect={onSelect} onSwipeToMenu={() => setSlide(1)}/>
      </div>
      {/* Panel 1: city menu */}
      <div style={{ position: "absolute", inset: 0, overflowY: "auto",
        transform: `translateX(${slide === 1 ? "0" : "100%"})`,
        transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
        <CityMenuPanel onSelect={onSelect} onSwipeBack={() => setSlide(0)}/>
      </div>
      {/* Dots */}
      <div style={{ position: "absolute", bottom: 100, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7, zIndex: 30, pointerEvents: "none" }}>
        {[0, 1].map(i => (
          <div key={i} style={{ height: 5, borderRadius: 999, transition: "all 0.35s ease",
            width: i === slide ? 22 : 5,
            background: i === slide ? PINK : "rgba(255,255,255,0.25)" }}/>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EATS PAGE  —  candlelit mahogany, warm amber
// ═══════════════════════════════════════════════════════════════════════════════
const EATS_FILTERS = ["Tonight","Date Night","Brunch","Cocktails","Italian","Outdoor","Sushi","Wine Bar","Solo"];
const EATS_FEATURED = [
  { id: 1, name: "Bar Pisellino",   hood: "WEST VILLAGE", cuisine: "ITALIAN", going: 18, note: "So early for a martini at the bar — Maya",   bg: "#FF9060" },
  { id: 2, name: "Lola Taverna",    hood: "WEST VILLAGE", cuisine: "GREEK",   going: 41, badge: "TRENDING", note: "Everything we ordered was perfect — Dani", bg: "#FFA878" },
  { id: 3, name: "Via Carota",      hood: "WEST VILLAGE", cuisine: "ITALIAN", going: 12, badge: "⚑ RESERVED", bg: PAPER, reservation: { time: "8:15 PM", seats: "2 SEATS" } },
];
const EATS_GRID = [
  { id: 4, name: "Sant Ambroeus", hood: "SOHO",         saved: 12, bg: "#FAF0E8" },
  { id: 5, name: "Cecconi's",     hood: "SOHO",         saved: 8,  bg: "#F0EAF8" },
  { id: 6, name: "Rubirosa",      hood: "NOLITA",       saved: 14, bg: "#FFF5F8" },
  { id: 7, name: "Pasta Night",   hood: "LES",          saved: 9,  bg: "#F5F0E8" },
  { id: 8, name: "Four Horsemen", hood: "WILLIAMSBURG", saved: 11, bg: "#EEEAE0" },
  { id: 9, name: "Buvette",       hood: "WEST VILLAGE", saved: 7,  bg: "#F0EEF8" },
];

function EatsPage({ onBack }: { onBack: () => void }) {
  const [activeFilter, setActiveFilter] = useState("Tonight");
  const [savedIds, setSaved] = useState<number[]>([]);
  function toggleSave(id: number) { setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]); }

  return (
    <div style={{
      backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
      backgroundSize: "200px 200px, 80px 80px",
      background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 30%, #FFF5F0 60%, #FFF0F8 100%)", minHeight: "100vh", paddingBottom: 120,
    }}>
      {/* Hero */}
      <div style={{ position: "relative", height: 230, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `${DARK_GRAIN}, linear-gradient(135deg, #FF9060 0%, #FFB080 55%, #FF8050 100%)`, backgroundSize: "160px 160px, 100% 100%", backgroundColor: "#FFF5F0" }}/>
        {/* Amber candle glow */}
        <div style={{ position: "absolute", bottom: 0, left: "35%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,100,30,0.28) 0%, transparent 70%)", filter: "blur(20px)" }}/>
        {/* Flame SVG */}
        <div style={{ position: "absolute", bottom: 40, left: "48%", transform: "translateX(-50%)", animation: "flameFlicker 2.4s ease-in-out infinite" }}>
          <svg width="18" height="28" viewBox="0 0 18 28">
            <path d="M9 27 C2 22 0 16 3 10 C5 6 7 8 9 4 C11 8 13 6 15 10 C18 16 16 22 9 27Z" fill="url(#flame_g)"/>
            <defs>
              <radialGradient id="flame_g" cx="50%" cy="80%" r="60%">
                <stop offset="0%" stopColor="#FFF5C0"/>
                <stop offset="35%" stopColor="#FFB830"/>
                <stop offset="100%" stopColor="#FF5500" stopOpacity="0.7"/>
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.55) 100%)" }}/>
        <BackBtn onBack={onBack}/>
        <div style={{ position: "absolute", bottom: 18, left: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "#FF9B70", marginBottom: 5 }}>EATS · NYC</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, textShadow: "0 2px 20px rgba(200,80,30,0.6)" }}>Tonight&apos;s<br />Table</p>
        </div>
        {/* Ornamental rule */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, #FF9B7088, ${PINK}66, #FF9B7088, transparent)` }}/>
      </div>

      {/* Filters */}
      <div style={{ backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: "#FFF5F0", paddingBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px 0", scrollbarWidth: "none" as const }}>
          {EATS_FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 999, border: `1.5px solid ${activeFilter === f ? "#FF9B70" : "rgba(180,100,60,0.25)"}`, background: activeFilter === f ? "#FF9B70" : "rgba(255,255,255,0.6)", color: activeFilter === f ? "white" : "rgba(160,80,40,0.8)", fontSize: "9px", fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ padding: "14px 14px 0" }}>
        {/* Featured grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          {/* Big card */}
          <div style={{ gridRow: "span 2", backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: EATS_FEATURED[0].bg, borderRadius: 18, minHeight: 252, position: "relative", overflow: "hidden", boxShadow: "0 6px 24px rgba(200,80,30,0.25)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 30%, rgba(255,180,100,0.3) 0%, transparent 70%)" }}/>
            <div style={{ position: "absolute", top: 18, left: 13 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 21, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1, textShadow: "0 2px 12px rgba(180,60,20,0.4)" }}>Bar<br />Pisellino</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", marginTop: 4 }}>WEST VILLAGE · ITALIAN</p>
            </div>
            <div style={{ position: "absolute", top: 13, right: 11, background: "rgba(255,255,255,0.25)", borderRadius: 999, padding: "3px 8px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "white" }}>{EATS_FEATURED[0].going} going</span>
            </div>
            <div style={{ position: "absolute", bottom: 15, left: 12, right: 14 }}>
              <div style={{ transform: "rotate(-1.2deg)", backgroundImage: `${PAPER_TEX}`, backgroundColor: "rgba(255,252,230,0.92)", backgroundSize: "200px 200px", padding: "7px 10px", boxShadow: "1px 2px 8px rgba(0,0,0,0.12)" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#3a2010", lineHeight: 1.4 }}>{EATS_FEATURED[0].note}</p>
              </div>
            </div>
          </div>
          {/* Top-right */}
          <div style={{ backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: EATS_FEATURED[1].bg, borderRadius: 18, minHeight: 118, position: "relative", overflow: "hidden", boxShadow: "0 4px 16px rgba(200,80,30,0.18)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 60% 30%, rgba(255,200,100,0.25) 0%, transparent 70%)" }}/>
            {EATS_FEATURED[1].badge && <div style={{ position: "absolute", top: 10, left: 10, background: PINK, borderRadius: 999, padding: "2px 8px" }}><span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>{EATS_FEATURED[1].badge}</span></div>}
            <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1 }}>{EATS_FEATURED[1].name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", marginTop: 2 }}>{EATS_FEATURED[1].hood}</p>
            </div>
          </div>
          {/* Bottom-right: reserved card */}
          <div style={{ backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`, backgroundSize: "200px 200px, 80px 80px", backgroundColor: PAPER, borderRadius: 18, minHeight: 118, padding: "12px 13px 10px", boxShadow: "0 4px 16px rgba(0,0,0,0.09)" }}>
            <div style={{ display: "inline-flex", background: "#1e0e04", borderRadius: 999, padding: "3px 9px", marginBottom: 6 }}><span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: PINK, letterSpacing: "0.1em" }}>⚑ RESERVED</span></div>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.1 }}>Via Carota</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#aaa", letterSpacing: "0.08em", marginTop: 2 }}>WEST VILLAGE</p>
            <div style={{ marginTop: 8, backgroundImage: `${DARK_GRAIN}`, backgroundSize: "160px 160px", backgroundColor: DARK, borderRadius: 8, padding: "7px 9px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: PINK }}>8:15 PM</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.38)", letterSpacing: "0.08em" }}>2 SEATS</p>
            </div>
          </div>
        </div>

        {/* Spot grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 14 }}>
          {EATS_GRID.map(spot => (
            <div key={spot.id} style={{ backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`, backgroundSize: "200px 200px, 80px 80px", backgroundColor: spot.bg, borderRadius: 16, padding: "13px 13px 11px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 700, fontStyle: "italic", color: DARK, lineHeight: 1.2, marginBottom: 4 }}>{spot.name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "#aaa", letterSpacing: "0.06em" }}>{spot.hood}</p>
              <div style={{ marginTop: 9, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#bbb" }}>{spot.saved} saved</span>
                <button onClick={() => toggleSave(spot.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={savedIds.includes(spot.id) ? "#FF9B70" : "none"} stroke="#FF9B70" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom picks */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{ backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`, backgroundSize: "200px 200px, 80px 80px", backgroundColor: "#FEF3E8", borderRadius: 14, padding: "14px 13px", transform: "rotate(-0.4deg)", boxShadow: "2px 4px 16px rgba(0,0,0,0.18)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "#FF9B70", marginBottom: 9 }}>GO-TO LATELY</p>
            {["Bar Pisellino","Sushi Noz","Lucien","Café Kitsuné","Buvette"].map((name, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#FF9B70" }}>{i + 1}.</span>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "#2a1a10" }}>{name}</span>
              </div>
            ))}
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#FF9B70", marginTop: 6, opacity: 0.75 }}>girls night →</p>
          </div>
          <div style={{ borderRadius: 14, backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: "#FF9060", overflow: "hidden", position: "relative", minHeight: 168, boxShadow: "0 6px 20px rgba(200,80,30,0.22)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 20%, rgba(255,220,160,0.3) 0%, rgba(255,100,40,0.1) 80%)" }}/>
            <div style={{ position: "absolute", inset: 0, padding: "14px 13px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>ROOFTOP · NOMAD</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2 }}>The Roof at<br/>PUBLIC Hotel</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em", marginBottom: 6 }}>AMAZING VIEWS ✦</p>
                <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 999, padding: "5px 12px", display: "inline-flex" }}>
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

// ═══════════════════════════════════════════════════════════════════════════════
// SOLO PAGE  —  morning light, sage & linen, introspective
// ═══════════════════════════════════════════════════════════════════════════════
const SOLO_MOODS = ["Quiet", "Creative", "Mindful", "Wandering", "Indulgent"];
const SOLO_ACTIVITIES = [
  { id: 1, name: "MoMA Galleries",      type: "ART",        time: "90 min",   note: "Get there at 10am — entire floor to yourself", accent: "#B0CCE8", bg: "#EDF2FA" },
  { id: 2, name: "The Strand",          type: "BOOKS",      time: "open-ended", note: "Rare books room on the third floor is magic",  accent: "#C9A882", bg: "#FAF2E8" },
  { id: 3, name: "Central Park Loop",   type: "WALK",       time: "45 min",   note: "Reservoir track at golden hour",                accent: "#9AC98A", bg: "#EDF5EC" },
  { id: 4, name: "Café Kitsuné",        type: "COFFEE",     time: "∞",        note: "Matcha latte + journal, always a good idea",    accent: "#E8A0B0", bg: "#FAF0F2" },
  { id: 5, name: "Glossier Flagship",   type: "SELF-CARE",  time: "30 min",   note: "Actually try everything before you commit",     accent: "#F4C0D0", bg: "#FEF4F6" },
  { id: 6, name: "Jane's Carousel",     type: "DREAMY",     time: "20 min",   note: "Brooklyn Bridge views from the glass pavilion", accent: "#B8C8E8", bg: "#F2F5FD" },
];

function SoloPage({ onBack }: { onBack: () => void }) {
  const [mood, setMood] = useState("Quiet");

  return (
    <div style={{
      backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
      backgroundSize: "200px 200px, 80px 80px",
      backgroundColor: "#F8F5EE", minHeight: "100vh", paddingBottom: 120,
    }}>
      {/* Hero */}
      <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
        {/* Morning gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #E8EEE0 0%, #D8E8D0 30%, #EAD8E0 65%, #F0E8D8 100%)" }}/>
        {/* Dappled light spots */}
        <div style={{ position: "absolute", top: 40, left: "15%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,230,0.5) 0%, transparent 70%)", filter: "blur(25px)" }}/>
        <div style={{ position: "absolute", top: 80, right: "10%", width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,230,200,0.4) 0%, transparent 70%)", filter: "blur(18px)" }}/>
        {/* Botanical decoration SVG */}
        <svg style={{ position: "absolute", right: 16, top: 50, opacity: 0.25 }} width="80" height="140" viewBox="0 0 80 140">
          <ellipse cx="40" cy="30" rx="12" ry="22" fill="#6A9A5A" transform="rotate(-20 40 30)"/>
          <ellipse cx="55" cy="55" rx="14" ry="24" fill="#5A8A4A" transform="rotate(15 55 55)"/>
          <ellipse cx="25" cy="60" rx="10" ry="20" fill="#7AAA6A" transform="rotate(-30 25 60)"/>
          <ellipse cx="45" cy="85" rx="12" ry="26" fill="#4A7A3A" transform="rotate(10 45 85)"/>
          <line x1="40" y1="10" x2="40" y2="120" stroke="#4A6A3A" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(248,245,238,0.85) 100%)" }}/>
        <BackBtn onBack={onBack} label="CITY"/>
        <div style={{ position: "absolute", bottom: 20, left: 20 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.26em", color: "#7A9A6C", marginBottom: 5 }}>SOLO · NYC</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 900, fontStyle: "italic", color: "#2A3A22", lineHeight: 1, marginBottom: 4 }}>A Day<br />For You.</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#8A7A6A", opacity: 0.85 }}>thoughtful things to do alone ✦</p>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* Mood chips */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "#9A7A6A", marginBottom: 8 }}>WHAT MOOD ARE YOU IN?</p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" as const }}>
            {SOLO_MOODS.map(m => (
              <button key={m} onClick={() => setMood(m)} style={{
                padding: "6px 14px", borderRadius: 999,
                border: `1.5px solid ${mood === m ? "#7A9A6C" : "rgba(120,90,80,0.2)"}`,
                background: mood === m ? "#7A9A6C" : "transparent",
                color: mood === m ? "white" : "#8A6A5A",
                fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700,
                letterSpacing: "0.05em", cursor: "pointer",
              }}>{m}</button>
            ))}
          </div>
        </div>

        {/* Activity cards */}
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "#9A7A6A", marginBottom: 10 }}>MADE FOR SOLO TIME</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {SOLO_ACTIVITIES.map((act, i) => (
            <div key={act.id} style={{
              backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
              backgroundSize: "200px 200px, 80px 80px",
              backgroundColor: act.bg,
              borderRadius: 18, overflow: "hidden",
              boxShadow: "0 3px 16px rgba(80,60,40,0.1), inset 0 1px 0 rgba(255,255,255,0.85)",
              display: "flex", gap: 0,
              animation: `soloFade 0.5s ease-out both`,
              animationDelay: `${i * 0.07}s`,
            }}>
              {/* Accent bar */}
              <div style={{ width: 5, flexShrink: 0, background: `linear-gradient(180deg, ${act.accent}, ${act.accent}66)` }}/>
              <div style={{ flex: 1, padding: "14px 14px 12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ display: "inline-flex", background: `${act.accent}44`, borderRadius: 999, padding: "2px 8px", marginBottom: 5 }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "#4A3A2A", letterSpacing: "0.1em" }}>{act.type}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, fontStyle: "italic", color: "#2A1A10", lineHeight: 1.1 }}>{act.name}</p>
                  </div>
                  <div style={{ backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "4px 8px", marginLeft: 8, flexShrink: 0 }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: "#6A5A4A", letterSpacing: "0.04em" }}>{act.time}</p>
                  </div>
                </div>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12.5, color: "#6A5A4A", lineHeight: 1.4, opacity: 0.9 }}>"{act.note}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* Solo editorial card */}
        <div style={{
          backgroundImage: `${DARK_GRAIN}, linear-gradient(135deg, #1C2814 0%, #283820 60%, #1A2610 100%)`,
          backgroundSize: "160px 160px, 100% 100%",
          borderRadius: 18, padding: "22px 20px", marginBottom: 14,
          boxShadow: "0 8px 32px rgba(30,40,20,0.35)",
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "#A8C97A", marginBottom: 10 }}>THIS WEEK&apos;S SOLO RITUAL</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2, marginBottom: 8 }}>Saturday Morning<br />at the Brooklyn Botanic</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(200,230,180,0.65)", lineHeight: 1.6, marginBottom: 14 }}>
            Open at 8am for members. Quiet paths, zero crowds, cherry blossoms still holding.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "#A8C97A", borderRadius: 999, padding: "6px 16px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.08em" }}>34 BLOOMIES GOING</span>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(200,230,180,0.5)" }}>solo ✦ together</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GO PAGE  —  gallery white + cobalt, bold architectural
// ═══════════════════════════════════════════════════════════════════════════════
const GO_TYPES = ["All", "Museums", "Outdoors", "Markets", "Theater", "Tours"];
const GO_EXPERIENCES = [
  { id: 1, name: "The Metropolitan Museum", hood: "UPPER EAST SIDE", type: "MUSEUM",  tag: "FREE THIS WEEK", big: true,  accent: "#3A5FCD", bg: "#E8EEFF" },
  { id: 2, name: "The High Line",           hood: "WEST CHELSEA",    type: "OUTDOOR", going: 28,             big: false, accent: "#2A9A60", bg: "#E8FFF4" },
  { id: 3, name: "Brooklyn Flea",           hood: "DUMBO",           type: "MARKET",  tag: "THIS WEEKEND",   big: false, accent: "#C4802A", bg: "#FFF5E8" },
  { id: 4, name: "MoMA PS1",               hood: "LONG ISLAND CITY", type: "GALLERY", going: 14,             big: false, accent: "#A04090", bg: "#FEF0FF" },
  { id: 5, name: "Staten Island Ferry",     hood: "LOWER MANHATTAN",  type: "TOUR",   tag: "FREE",           big: false, accent: "#3A5FCD", bg: "#EAF0FF" },
  { id: 6, name: "The Shed",               hood: "HUDSON YARDS",     type: "THEATER", going: 22,             big: false, accent: "#C43A3A", bg: "#FFF0F0" },
];

function GoPage({ onBack }: { onBack: () => void }) {
  const [activeType, setActiveType] = useState("All");

  return (
    <div style={{ background: "#F0F8FF", minHeight: "100vh", paddingBottom: 120 }}>
      {/* Hero — stark gallery aesthetic */}
      <div style={{ position: "relative", height: 250, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #3A5FCD 0%, #6BB5F5 55%, #4A80E8 100%)" }}/>
        {/* Bold cobalt sweep */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #3A5FCD, #6BB5F5, #3A5FCD)", animation: "gallerySweep 1s ease-out both" }}/>
        <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, height: 1, background: "rgba(106,181,245,0.15)" }}/>
        {/* GO. large typographic mark */}
        <div style={{ position: "absolute", right: 18, bottom: 60, opacity: 0.06 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 140, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, userSelect: "none" }}>GO.</p>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #06080F 40%, transparent 80%)" }}/>
        <BackBtn onBack={onBack} label="CITY"/>
        <div style={{ position: "absolute", bottom: 22, left: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: "#6BB5F5", marginBottom: 5 }}>GO · NYC</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 34, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Get<br />Out There.</p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #3A5FCD66, #6BB5F544, transparent)" }}/>
      </div>

      {/* Type filters */}
      <div style={{ background: "#E8F4FF", borderBottom: "1px solid rgba(58,95,205,0.15)", paddingBottom: 1 }}>
        <div style={{ display: "flex", gap: 0, overflowX: "auto", padding: "10px 16px", scrollbarWidth: "none" as const }}>
          {GO_TYPES.map(t => (
            <button key={t} onClick={() => setActiveType(t)} style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 999, marginRight: 6,
              border: `1.5px solid ${activeType === t ? "#3A5FCD" : "rgba(58,95,205,0.25)"}`,
              background: activeType === t ? "#3A5FCD" : "rgba(255,255,255,0.7)",
              color: activeType === t ? "white" : "rgba(40,70,160,0.7)",
              fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer",
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Experience cards */}
      <div style={{ padding: "14px 14px 0" }}>
        {GO_EXPERIENCES.map((exp, i) => (
          <div key={exp.id} style={{
            backgroundImage: `${PAPER_TEX}`,
            backgroundSize: "200px 200px",
            backgroundColor: exp.bg,
            borderRadius: 18, marginBottom: 10, overflow: "hidden",
            height: i === 0 ? 170 : 100,
            position: "relative",
            boxShadow: `0 4px 16px rgba(0,0,0,0.1), 0 1px 0 ${exp.accent}44 inset`,
          }}>
            {/* Left accent bar */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${exp.accent}, ${exp.accent}88)` }}/>
            {/* Glow */}
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 30%, ${exp.accent}18 0%, transparent 60%)` }}/>
            {/* Content */}
            <div style={{ position: "absolute", inset: 0, padding: i === 0 ? "22px 20px 18px 18px" : "14px 16px 12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ background: `${exp.accent}22`, border: `1px solid ${exp.accent}88`, borderRadius: 999, padding: "2px 9px" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: exp.accent, letterSpacing: "0.1em" }}>{exp.type}</span>
                  </div>
                  {"tag" in exp && exp.tag && (
                    <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 999, padding: "2px 9px" }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "rgba(40,60,120,0.7)", letterSpacing: "0.08em" }}>{exp.tag}</span>
                    </div>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: i === 0 ? 22 : 15, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.15 }}>{exp.name}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(40,60,100,0.5)", letterSpacing: "0.1em" }}>{exp.hood}</p>
                {"going" in exp && exp.going && (
                  <div style={{ background: `${exp.accent}22`, border: `1px solid ${exp.accent}66`, borderRadius: 999, padding: "3px 10px" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: exp.accent }}>{exp.going} going</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* This Week editorial */}
        <div style={{
          backgroundImage: `${PAPER_TEX}`,
          backgroundSize: "200px 200px",
          backgroundColor: "#EAF2FF",
          borderRadius: 18, padding: "20px 18px", marginBottom: 14,
          border: "1px solid rgba(58,95,205,0.18)",
          boxShadow: "0 4px 16px rgba(58,95,205,0.1)",
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "#3A5FCD", marginBottom: 8 }}>THIS WEEK IN NYC ✦</p>
          {["MOMA: New Acquisitions","Brooklyn Botanic: Cherry Blossoms","Jazz at Lincoln Center: Fri/Sat","Governors Ball: Week 2"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9, paddingBottom: 9, borderBottom: i < 3 ? "1px solid rgba(58,95,205,0.12)" : "none" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3A5FCD", flexShrink: 0 }}/>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(30,50,120,0.78)" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRENDING PAGE  —  electric pink-orange neon, live energy
// ═══════════════════════════════════════════════════════════════════════════════
const TICKER_ITEMS = ["VILLA PIZZA", "DIOR CAFÉ POP-UP", "JAZZ CLUB FRIDAYS", "ROOFTOP THURSDAYS", "PASTA NIGHT LES", "BROOKLYN FLEA", "MATCHA BARS", "HOTEL BARS", "WINE TASTING SOHO"];
const TREND_LIST = [
  { rank: 1,  name: "Italian in the West Village",    tag: "DINING",     count: 247, hot: true,  badge: "🔥 ON FIRE" },
  { rank: 2,  name: "Dior Café Pop-Up on Madison",    tag: "POP-UP",     count: 188, hot: true,  badge: "✦ NEW" },
  { rank: 3,  name: "Late Night Jazz in Harlem",       tag: "NIGHTLIFE",  count: 156, hot: false, badge: null },
  { rank: 4,  name: "Rooftop Bars This Season",        tag: "DRINKS",     count: 134, hot: false, badge: null },
  { rank: 5,  name: "Sunday Brunch: Best Spots",       tag: "BRUNCH",     count: 119, hot: false, badge: null },
  { rank: 6,  name: "The Quiet Luxury Hotel Bars",     tag: "COCKTAILS",  count: 98,  hot: false, badge: null },
  { rank: 7,  name: "Gallery Openings This Week",      tag: "ART",        count: 87,  hot: false, badge: null },
  { rank: 8,  name: "Korean BBQ in Koreatown",         tag: "DINING",     count: 76,  hot: false, badge: null },
];

function TrendingPage({ onBack }: { onBack: () => void }) {
  const tickerText = TICKER_ITEMS.join("   ✦   ") + "   ✦   ";
  const doubled = tickerText + tickerText;

  return (
    <div style={{
      backgroundImage: `${PAPER_TEX}`,
      backgroundSize: "200px 200px",
      backgroundColor: "#FFF0FC",
      minHeight: "100vh", paddingBottom: 120,
    }}>
      {/* Hero */}
      <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1A0028 0%, #280A0A 40%, #200812 80%, #0E0018 100%)" }}/>
        {/* Neon glow layers */}
        <div style={{ position: "absolute", top: "30%", left: "20%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.3) 0%, transparent 70%)", filter: "blur(30px)" }}/>
        <div style={{ position: "absolute", top: "20%", right: "10%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,85,0,0.25) 0%, transparent 70%)", filter: "blur(22px)" }}/>
        {/* TRENDING° neon-style letters */}
        <div style={{ position: "absolute", top: 80, left: 18, right: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: "#FF7744", marginBottom: 8 }}>TRENDING · NYC</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 30, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, textShadow: "0 0 30px rgba(255,31,125,0.7), 0 0 60px rgba(255,85,0,0.3)" }}>What&apos;s<br />Hot Right Now.</p>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(8,1,14,0.7) 100%)" }}/>
        <BackBtn onBack={onBack} label="CITY"/>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${PINK}88, #FF774466, transparent)` }}/>
      </div>

      {/* Ticker tape */}
      <div style={{ background: "#FF1F7D", overflow: "hidden", height: 28, display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", animation: "tickerScroll 18s linear infinite" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "white", letterSpacing: "0.1em", paddingRight: 0 }}>
            {doubled}
          </span>
        </div>
      </div>

      {/* Trending list */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,119,68,0.8)" }}>THIS WEEK&apos;S HOT LIST</p>
          <div style={{ background: "rgba(255,31,125,0.12)", border: "1px solid rgba(255,31,125,0.25)", borderRadius: 999, padding: "3px 10px" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: PINK, animation: "hotPulse 2s ease-in-out infinite" }}>● LIVE</span>
          </div>
        </div>

        {TREND_LIST.map((item, i) => (
          <div key={item.rank} style={{
            backgroundImage: `${PAPER_TEX}`,
            backgroundSize: "200px 200px",
            backgroundColor: i < 2 ? "#FFE8F5" : "#FFF5FA",
            borderRadius: 16, marginBottom: 8, overflow: "hidden",
            border: i < 2 ? `1px solid rgba(255,31,125,${i === 0 ? "0.35" : "0.18"})` : "1px solid rgba(255,31,125,0.08)",
            boxShadow: i === 0 ? "0 4px 16px rgba(255,31,125,0.12)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", padding: "14px 14px", gap: 14 }}>
              {/* Rank number */}
              <div style={{ flexShrink: 0, width: 32, textAlign: "center" as const }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: i < 2 ? 26 : 20, fontWeight: 900, fontStyle: "italic",
                  color: i === 0 ? PINK : i === 1 ? "#FF7744" : "rgba(180,80,120,0.3)", lineHeight: 1,
                  textShadow: i === 0 ? `0 0 20px ${PINK}44` : "none" }}>
                  {item.rank}
                </p>
              </div>
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" as const }}>
                  <div style={{ background: "rgba(255,31,125,0.08)", borderRadius: 999, padding: "2px 7px" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, color: "rgba(180,40,80,0.6)", letterSpacing: "0.1em" }}>{item.tag}</span>
                  </div>
                  {item.badge && (
                    <div style={{ background: i === 0 ? "rgba(255,31,125,0.12)" : "rgba(255,119,68,0.12)", borderRadius: 999, padding: "2px 7px" }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, color: i === 0 ? PINK : "#FF7744" }}>{item.badge}</span>
                    </div>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 700, fontStyle: "italic", color: DARK, lineHeight: 1.2 }}>{item.name}</p>
              </div>
              {/* Count */}
              <div style={{ flexShrink: 0, textAlign: "right" as const }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 800, color: i < 2 ? (i === 0 ? PINK : "#FF7744") : "rgba(180,80,120,0.3)", lineHeight: 1 }}>{item.count}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 700, color: "rgba(120,60,80,0.4)", letterSpacing: "0.05em" }}>BLOOMIES</p>
              </div>
            </div>
          </div>
        ))}

        {/* This Week CTA */}
        <div style={{
          backgroundImage: `${PAPER_TEX}`,
          backgroundSize: "200px 200px",
          backgroundColor: "#FFE8F2",
          borderRadius: 18, padding: "22px 20px", marginBottom: 14,
          border: `1px solid rgba(255,31,125,0.18)`,
          boxShadow: "0 4px 16px rgba(255,31,125,0.08)",
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "#FF7744", marginBottom: 10 }}>WHAT BLOOMIES ARE DOING THIS WEEK</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            {["🍷 Wine tasting","🎭 Off-Broadway","🛍️ Vintage markets","🌙 Jazz nights","🍜 Ramen crawl"].map(item => (
              <div key={item} style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,31,125,0.15)", borderRadius: 999, padding: "6px 13px" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(120,40,60,0.8)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOOMIES FAVORITES  —  champagne rose, editorial luxury
// ═══════════════════════════════════════════════════════════════════════════════
const BLOOM_PICKS = [
  { id: 1,  name: "Bar Pisellino",        cat: "DINING",     hood: "WEST VILLAGE",    stars: 5, saves: 312, note: "The martini. The marble bar. The people.",          accent: "#D4A070", bg: "#1A0C08" },
  { id: 2,  name: "The Standard Spa",     cat: "SELF-CARE",  hood: "MEATPACKING",     stars: 5, saves: 284, note: "Book 3 weeks ahead. Worth every minute.",           accent: "#E8B0C0", bg: "#140A0C" },
  { id: 3,  name: "Café Kitsuné",         cat: "COFFEE",     hood: "WEST VILLAGE",    stars: 5, saves: 256, note: "Matcha in the garden with a good book.",           accent: "#A8C890", bg: "#0C1408" },
  { id: 4,  name: "Brooklyn Museum",      cat: "ART",        hood: "CROWN HEIGHTS",   stars: 4, saves: 198, note: "First Saturday of the month is free + a party.",    accent: "#9090D8", bg: "#08080E" },
  { id: 5,  name: "Russ & Daughters",     cat: "BRUNCH",     hood: "LOWER EAST SIDE", stars: 5, saves: 176, note: "The appetizing plate. Every. Single. Time.",        accent: "#D8A050", bg: "#181008" },
  { id: 6,  name: "Vessel (Hudson Yards)",cat: "ICONIC",     hood: "HUDSON YARDS",    stars: 4, saves: 154, note: "Go at sunset for the best light.",                  accent: "#C0B090", bg: "#101008" },
];

function BloomiesFavoritesPage({ onBack }: { onBack: () => void }) {
  const [saved, setSaved] = useState<number[]>([]);
  function toggleSave(id: number) { setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]); }

  return (
    <div style={{
      backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
      backgroundSize: "200px 200px, 80px 80px",
      backgroundColor: "#F9F4EE",
      minHeight: "100vh", paddingBottom: 120,
    }}>
      {/* Hero — rose gold editorial */}
      <div style={{ position: "relative", height: 270, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `${DARK_GRAIN}, linear-gradient(155deg, #1A0818 0%, #2A1018 40%, #200C14 75%, #160A10 100%)`, backgroundSize: "160px 160px, 100% 100%", backgroundColor: "#1A0810" }}/>
        {/* Gold/champagne glows */}
        <div style={{ position: "absolute", top: "20%", left: "25%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,112,0.22) 0%, transparent 70%)", filter: "blur(32px)" }}/>
        <div style={{ position: "absolute", top: "30%", right: "15%", width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,100,140,0.18) 0%, transparent 70%)", filter: "blur(22px)" }}/>
        {/* Floating card decoration */}
        <div style={{ position: "absolute", right: 22, top: 70, animation: "champFloat 5s ease-in-out infinite", transform: "rotate(-4deg)" }}>
          <div style={{ backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: "rgba(255,248,240,0.12)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(212,168,83,0.3)", width: 80 }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: PINK, lineHeight: 1.3, opacity: 0.9 }}>our very faves ✦</p>
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 35%, rgba(26,8,16,0.78) 100%)" }}/>
        <BackBtn onBack={onBack} label="CITY"/>
        <div style={{ position: "absolute", bottom: 22, left: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: PINK, marginBottom: 6 }}>BLOOMIES PICKS · NYC</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, textShadow: "0 2px 24px rgba(212,160,112,0.5)" }}>Our City,<br />Curated.</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontStyle: "italic", color: "rgba(255,210,190,0.55)", marginTop: 6, letterSpacing: "0.03em" }}>By the bloomies community, for the bloomies community.</p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${PINK}66, rgba(232,100,140,0.4), ${PINK}66, transparent)` }}/>
      </div>

      {/* Community stats */}
      <div style={{ backgroundImage: `${DARK_GRAIN}`, backgroundSize: "160px 160px", backgroundColor: "#1A0810", padding: "14px 18px 12px", display: "flex", gap: 0 }}>
        {[["1,240+", "saves this month"], ["324", "bloomies contributed"], ["6", "categories"]].map(([val, label], i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ width: 1, background: "rgba(212,168,83,0.15)", margin: "0 16px" }}/>}
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: PINK }}>{val}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", marginTop: 1 }}>{label}</p>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div style={{ padding: "16px 14px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "#9A7A6A", marginBottom: 12 }}>THE BLOOMIES LIST</p>

        {BLOOM_PICKS.map((pick, i) => (
          <div key={pick.id} style={{
            backgroundImage: `${DARK_GRAIN}`,
            backgroundSize: "160px 160px",
            backgroundColor: pick.bg,
            borderRadius: 18, marginBottom: 10, overflow: "hidden",
            boxShadow: "0 4px 22px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}>
            {/* Top accent */}
            <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${pick.accent}88, transparent)` }}/>
            <div style={{ padding: "14px 16px 14px 14px", display: "flex", gap: 12 }}>
              {/* Rank badge */}
              <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: "50%", background: `rgba(212,168,83,0.1)`, border: `1px solid ${pick.accent}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: pick.accent }}>
                  {i + 1}
                </span>
              </div>
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 5 }}>
                  <div>
                    <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 4 }}>
                      <div style={{ background: `${pick.accent}22`, border: `1px solid ${pick.accent}44`, borderRadius: 999, padding: "1.5px 8px" }}>
                        <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, color: pick.accent, letterSpacing: "0.1em" }}>{pick.cat}</span>
                      </div>
                    </div>
                    <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 700, fontStyle: "italic", color: "rgba(255,245,235,0.9)", lineHeight: 1.1 }}>{pick.name}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em", marginTop: 2 }}>{pick.hood}</p>
                  </div>
                  <button onClick={() => toggleSave(pick.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={saved.includes(pick.id) ? PINK : "none"} stroke={PINK} strokeWidth="2.2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </button>
                </div>
                {/* Stars */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {Array.from({length: 5}, (_, si) => (
                      <svg key={si} width="9" height="9" viewBox="0 0 24 24" fill={si < pick.stars ? PINK : "none"} stroke={PINK} strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.28)" }}>{pick.saves} saves</span>
                </div>
                {/* Note */}
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: `${pick.accent}cc`, lineHeight: 1.4 }}>"{pick.note}"</p>
              </div>
            </div>
          </div>
        ))}

        {/* Community CTA card */}
        <div style={{
          backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
          backgroundSize: "200px 200px, 80px 80px",
          backgroundColor: "#FEF6EE",
          borderRadius: 18, padding: "20px 18px", marginBottom: 14,
          boxShadow: "0 4px 20px rgba(180,130,80,0.12), inset 0 1.5px 0 rgba(255,255,255,0.9)",
          border: "1px solid rgba(212,168,83,0.2)",
          textAlign: "center" as const,
        }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "#4A2A18", marginBottom: 8 }}>Add Your Faves</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "#8A6A4A", lineHeight: 1.6, marginBottom: 14 }}>
            Every save shapes this list.<br/>Your favorites become the city&apos;s favorites.
          </p>
          <div style={{ backgroundImage: `${DARK_GRAIN}`, backgroundSize: "160px 160px", backgroundColor: "#1A0C08", display: "inline-flex", borderRadius: 999, padding: "9px 22px" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: PINK, letterSpacing: "0.1em" }}>✦ SAVE A SPOT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMING SOON  (fallback)
// ═══════════════════════════════════════════════════════════════════════════════
function ComingSoon({ band, onBack }: { band: Band; onBack: () => void }) {
  return (
    <div style={{ background: "linear-gradient(180deg, #FFB3D9 0%, #FFC8A0 100%)", minHeight: "100vh", paddingBottom: 100 }}>
      <div style={{ position: "relative", height: 230, overflow: "hidden" }}>
        <DaySkyline width={430} height={230}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 25%, rgba(13,8,20,0.88) 100%)" }}/>
        <BackBtn onBack={onBack} label="CITY"/>
        <div style={{ position: "absolute", bottom: 20, left: 20 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: band.accentColor, marginBottom: 6 }}>{band.label}</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Coming<br />Soon</p>
        </div>
      </div>
      <div style={{ padding: "28px 24px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(120,40,80,0.7)", lineHeight: 1.6 }}>We&apos;re curating the best of NYC.<br/>Check back soon.</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
function CityGuide() {
  const [category, setCategory] = useState<CityCategory>("landing");

  if (category === "landing") return <CityLanding onSelect={setCategory}/>;

  const band = BANDS.find(b => b.id === category);
  if (!band) return <CityLanding onSelect={setCategory}/>;
  return <ComingSoon band={band} onBack={() => setCategory("landing")}/>;
}

// ── Neighborhood street-sign map ───────────────────────────────────────────────
function NeighborhoodMap() {
  const signs = [
    { href: "/member/city?area=les",         cls: "sign-s1", color: PINK,      side: "left",  ml: "5%",  label: "Lower East Side", sub: "UNDERGROUND SPOTS · LATE NIGHTS" },
    { href: "/member/city?area=williamsburg", cls: "sign-s2", color: "#D86487", side: "right", mr: "5%",  label: "Williamsburg",    sub: "ROOFTOPS · STUDIOS · EATS" },
    { href: "/member/city?area=crownheights", cls: "sign-s3", color: "#C0185F", side: "left",  ml: "8%",  label: "Crown Heights",   sub: "BRUNCHES · RHYTHM · CULTURE" },
    { href: "/member/city?area=harlem",       cls: "sign-s4", color: PINK,      side: "right", mr: "8%",  label: "Harlem",          sub: "CULTURE RUNS DEEP" },
    { href: "/member/city?area=soho",         cls: "sign-s5", color: "#E87BA8", side: "left",  ml: "5%",  label: "SoHo",            sub: "GALLERIES · DINNERS · FASHION" },
    { href: "/member/city?area=dumbo",        cls: "sign-s6", color: "#D86487", side: "right", mr: "5%",  label: "DUMBO",           sub: "WATERFRONT · BRIDGE VIEWS" },
    { href: "/member/city?area=bushwick",     cls: "sign-s7", color: "#C0185F", side: "left",  ml: "10%", label: "Bushwick",        sub: "ART · LATE NIGHTS · ENERGY" },
  ];
  return (
    <div style={{ padding: "0 0 32px", minHeight: "calc(100vh - 54px)", background: "linear-gradient(180deg, #D6E8F5 0%, #EAF2F9 35%, #F0EBE4 100%)" }}>
      <div style={{ padding: "20px 20px 8px" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, marginBottom: 2 }}>New York City</p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 34, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1, letterSpacing: "-0.01em" }}>Neighborhoods</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#888", marginTop: 4 }}>tap one to explore</p>
      </div>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 30px", minHeight: 500 }}>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#8A8A8A", border: "3px solid #666", marginBottom: 0, zIndex: 2 }} />
        <div style={{ width: 8, height: "100%", position: "absolute", top: 14, background: "linear-gradient(90deg, #AAA 0%, #CCC 40%, #BBB 60%, #999 100%)", borderRadius: 4, zIndex: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 12, width: "100%", alignItems: "center", zIndex: 2 }}>
          {signs.map((s, i) => {
            const isLeft = s.side === "left";
            return (
              <Link key={i} href={s.href} style={{ textDecoration: "none", alignSelf: isLeft ? "flex-start" : "flex-end", marginLeft: isLeft ? s.ml : undefined, marginRight: !isLeft ? s.mr : undefined }}>
                <div className={s.cls} style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 0, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.18))" }}>
                  {isLeft && <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderRight: `16px solid ${s.color}` }} />}
                  <div style={{ background: s.color, padding: isLeft ? "10px 18px 10px 10px" : "10px 10px 10px 18px", borderRadius: isLeft ? "0 8px 8px 0" : "8px 0 0 8px" }}>
                    <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, whiteSpace: "nowrap" }}>{s.label}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{s.sub}</p>
                  </div>
                  {!isLeft && <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: `16px solid ${s.color}` }} />}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "16px 18px", border: "1px solid rgba(255,31,125,0.15)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 6 }}>FULL CITY GUIDE</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontStyle: "italic", color: "#666", lineHeight: 1.5, marginBottom: 12 }}>
            Restaurants, bars, rooftops — curated by Bloomies for Bloomies.
          </p>
          <button style={{ display: "inline-flex", background: PINK, color: "white", borderRadius: 999, padding: "9px 20px", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", boxShadow: `0 4px 14px ${PINK}55`, border: "none", cursor: "pointer" }}>
            ALL OF NYC →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Neighborhood search bar (hub) ────────────────────────────────────────────
function NeighborhoodSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed.length > 0
    ? HOOD_INDEX.filter(h =>
        h.name.toLowerCase().includes(trimmed) ||
        h.borough.toLowerCase().includes(trimmed) ||
        h.tags.some(t => t.includes(trimmed))
      ).slice(0, 6)
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setFocused(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `1.5px solid ${focused ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.28)"}`,
        borderRadius: 16, padding: "13px 16px",
        transition: "border-color 0.2s",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search a neighborhood…"
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontFamily: "var(--font-jost)", fontSize: "14px", fontWeight: 500,
            color: "white", letterSpacing: "0.01em",
          }}
        />
        {query.length > 0 && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" strokeLinecap="round">
              <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
            </svg>
          </button>
        )}
      </div>

      {focused && (results.length > 0 || trimmed.length > 0) && (
        <div ref={dropdownRef} style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 40,
          background: "rgba(14,8,18,0.97)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 18, overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
        }}>
          {results.length > 0 ? results.map((hood, i) => (
            <Link key={hood.slug} href={`/member/city/neighborhoods/${hood.slug}`}
              style={{ textDecoration: "none", display: "block" }}
              onClick={() => { setQuery(""); setFocused(false); }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px",
                borderBottom: i < results.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: PINK, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 17, color: "white", lineHeight: 1 }}>{hood.name}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.32)", letterSpacing: "0.1em", marginTop: 3 }}>{hood.borough.toUpperCase()} · {hood.tags.slice(0,2).join(" · ").toUpperCase()}</p>
                  </div>
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </Link>
          )) : (
            <div style={{ padding: "20px 18px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>No neighborhoods found for &ldquo;{trimmed}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── City hub nav card ─────────────────────────────────────────────────────────
function CityNavCard({ onClick, icon, label, sub, accent, preview }: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
  accent: string;
  preview?: string;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        width: "100%", background: "none", border: "none", padding: 0,
        cursor: "pointer", textAlign: "left" as const,
        WebkitTapHighlightColor: "transparent",
        transform: pressed ? "scale(0.975)" : "scale(1)",
        transition: "transform 0.12s",
      }}
    >
      <div style={{
        background: "white",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: pressed
          ? "0 2px 12px rgba(0,0,0,0.1)"
          : "0 6px 28px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)",
        border: "1.5px solid rgba(0,0,0,0.06)",
        transition: "box-shadow 0.12s",
      }}>
        {/* Colored top band */}
        <div style={{ height: 6, background: accent }} />

        <div style={{ padding: "18px 20px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          {/* Icon tile */}
          <div style={{
            width: 56, height: 56, borderRadius: 16, flexShrink: 0,
            background: `linear-gradient(145deg, ${accent}22, ${accent}0D)`,
            border: `1.5px solid ${accent}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {icon}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 900,
              fontSize: 22,
              color: DARK,
              lineHeight: 1,
              marginBottom: 5,
            }}>{label}</p>
            <p style={{
              fontFamily: "var(--font-jost)",
              fontSize: "10px",
              fontWeight: 600,
              color: "rgba(0,0,0,0.38)",
              letterSpacing: "0.04em",
              lineHeight: 1.4,
            }}>{sub}</p>
            {preview && (
              <p style={{
                fontFamily: "var(--font-caveat)",
                fontSize: 12,
                color: accent,
                marginTop: 6,
                lineHeight: 1,
              }}>{preview}</p>
            )}
          </div>

          {/* Arrow */}
          <div style={{
            width: 36, height: 36, borderRadius: 12, flexShrink: 0,
            background: accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 14px ${accent}44`,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

// ── City hub (landing) ────────────────────────────────────────────────────────
function CityHub({ onSelect }: { onSelect: (m: "tonight" | "guide") => void }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #FF1F7D 0%, #E8006A 45%, #C80060 100%)",
      paddingBottom: 110,
    }}>
      {/* Header */}
      <div style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 70px)",
        padding: "calc(env(safe-area-inset-top, 0px) + 70px) 20px 0",
      }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.3em", color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>NEW YORK CITY</p>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 42, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 0.95, margin: "0 0 6px" }}>The City.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 24 }}>what&apos;s happening in your world</p>

        {/* Neighborhood search */}
        <NeighborhoodSearch />
      </div>

      {/* Nav cards */}
      <div style={{ padding: "28px 16px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        <CityNavCard
          onClick={() => onSelect("tonight")}
          label="Out Tonight"
          sub="Gatherings · Open Seats · What's On"
          accent={PINK}
          preview="tap to see what's happening →"
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          }
        />
        <CityNavCard
          onClick={() => onSelect("guide")}
          label="The City Guide"
          sub="Restaurants · Bars · Hidden Gems"
          accent="#C80060"
          preview="tap to explore the city →"
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C80060" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          }
        />
      </div>
    </div>
  );
}

// ── Root city page ────────────────────────────────────────────────────────────
type CityRootMode = "hub" | "tonight" | "guide";

export function CityPage() {
  const [mode, setMode] = useState<CityRootMode>("hub");

  if (mode === "tonight") {
    return (
      <div style={{ minHeight: "100vh" }}>
        {/* Back button */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 51,
          paddingTop: "env(safe-area-inset-top, 0px)",
          background: "rgba(255,252,248,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,31,125,0.1)",
        }}>
          <div style={{ height: 54, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
            <button onClick={() => setMode("hub")} style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", gap: 7,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: PINK, letterSpacing: "0.08em" }}>CITY</span>
            </button>
            <div style={{ width: 1, height: 18, background: "rgba(0,0,0,0.1)" }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 18, color: DARK }}>Out Tonight</p>
          </div>
        </div>
        <div style={{ paddingTop: "calc(54px + env(safe-area-inset-top, 0px))" }}>
          <HappeningsPage standalone={false} />
        </div>
      </div>
    );
  }

  if (mode === "guide") {
    return (
      <div style={{ minHeight: "100vh" }}>
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 51,
          paddingTop: "env(safe-area-inset-top, 0px)",
          background: "rgba(255,252,248,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,31,125,0.1)",
        }}>
          <div style={{ height: 54, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
            <button onClick={() => setMode("hub")} style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", gap: 7,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: PINK, letterSpacing: "0.08em" }}>CITY</span>
            </button>
            <div style={{ width: 1, height: 18, background: "rgba(0,0,0,0.1)" }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 18, color: DARK }}>City Guide</p>
          </div>
        </div>
        <div style={{ paddingTop: "calc(54px + env(safe-area-inset-top, 0px))" }}>
          <CityGuide />
        </div>
      </div>
    );
  }

  return <CityHub onSelect={setMode} />;
}
