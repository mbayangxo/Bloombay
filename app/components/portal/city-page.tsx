"use client";

import React, { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const DARK  = "#0A0806";
const CREAM = "#F6F1EB";
const PAPER = "#FEFCF7";
const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

type CityCategory = "landing" | "eats" | "go" | "solo" | "favorites" | "trending";

/* ── NYC Scene SVGs ─────────────────────────────────────────── */

function SubwayScene() {
  return (
    <svg viewBox="0 0 400 90" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      {/* track */}
      <line x1="0" y1="72" x2="400" y2="72" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
      <line x1="0" y1="76" x2="400" y2="76" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
      {/* rails */}
      {Array.from({length:16}).map((_,i)=>(
        <rect key={i} x={i*26} y="72" width="12" height="4" rx="1" fill="rgba(255,255,255,0.08)"/>
      ))}
      {/* train car 1 */}
      <rect x="30" y="34" width="160" height="38" rx="5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/>
      <rect x="30" y="34" width="160" height="10" rx="3" fill="rgba(255,255,255,0.07)"/>
      {/* windows car 1 */}
      {[50,80,110,140,164].map((x,i)=>(
        <rect key={i} x={x} y="40" width="16" height="8" rx="2" fill="none" stroke="rgba(255,220,100,0.5)" strokeWidth="1"/>
      ))}
      {/* doors car 1 */}
      <rect x="95" y="45" width="12" height="22" rx="1" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      {/* wheels */}
      {[50,155].map((x,i)=>(
        <circle key={i} cx={x} cy="72" r="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2"/>
      ))}
      {/* train car 2 */}
      <rect x="198" y="36" width="150" height="36" rx="5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
      <rect x="198" y="36" width="150" height="9" rx="3" fill="rgba(255,255,255,0.05)"/>
      {[215,242,270,298,326].map((x,i)=>(
        <rect key={i} x={x} y="41" width="14" height="7" rx="2" fill="none" stroke="rgba(255,220,100,0.35)" strokeWidth="1"/>
      ))}
      {[218,330].map((x,i)=>(
        <circle key={i} cx={x} cy="72" r="5.5" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
      ))}
      {/* front of train - headlights */}
      <circle cx="34" cy="53" r="3" fill="rgba(255,240,180,0.7)" filter="url(#glow)"/>
      <defs><filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      {/* station pillars */}
      {[10, 380].map((x,i)=>(
        <rect key={i} x={x} y="10" width="6" height="62" rx="2" fill="rgba(255,255,255,0.08)"/>
      ))}
    </svg>
  );
}

function SkyscraperScene() {
  return (
    <svg viewBox="0 0 400 90" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      {/* ground */}
      <rect x="0" y="82" width="400" height="8" fill="rgba(255,255,255,0.06)"/>
      {/* Empire State style */}
      <rect x="152" y="8" width="16" height="74" fill="rgba(255,255,255,0.55)"/>
      <rect x="146" y="22" width="28" height="60" fill="rgba(255,255,255,0.5)"/>
      <rect x="138" y="36" width="44" height="46" fill="rgba(255,255,255,0.45)"/>
      <rect x="130" y="48" width="60" height="34" fill="rgba(255,255,255,0.4)"/>
      <line x1="160" y1="4" x2="160" y2="8" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
      {/* windows empire */}
      {[0,1,2,3].map(col=>
        [0,1,2,3,4].map(row=>(
          <rect key={`e${col}${row}`} x={132+col*14} y={50+row*6} width="5" height="4" rx="0.5"
            fill={Math.random()>0.4?"rgba(255,240,160,0.4)":"rgba(255,255,255,0.06)"}/>
        ))
      )}
      {/* tall building left */}
      <rect x="70" y="28" width="38" height="54" fill="rgba(255,255,255,0.28)"/>
      <rect x="78" y="20" width="22" height="62" fill="rgba(255,255,255,0.32)"/>
      {[0,1].map(col=>[0,1,2,3,4,5,6].map(row=>(
        <rect key={`l${col}${row}`} x={72+col*14} y={30+row*7} width="5" height="4" rx="0.5" fill="rgba(255,240,160,0.25)"/>
      )))}
      {/* tall building right */}
      <rect x="300" y="18" width="42" height="64" fill="rgba(255,255,255,0.3)"/>
      <rect x="310" y="10" width="22" height="72" fill="rgba(255,255,255,0.35)"/>
      {[0,1].map(col=>[0,1,2,3,4,5,6,7].map(row=>(
        <rect key={`r${col}${row}`} x={302+col*16} y={22+row*7} width="6" height="4" rx="0.5" fill="rgba(255,240,160,0.28)"/>
      )))}
      {/* water tower */}
      <rect x="240" y="54" width="3" height="18" fill="rgba(255,255,255,0.3)"/>
      <ellipse cx="241" cy="54" rx="7" ry="5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
      <rect x="234" y="56" width="14" height="10" rx="1" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>
      {/* mid buildings */}
      <rect x="20" y="44" width="46" height="38" fill="rgba(255,255,255,0.2)"/>
      <rect x="356" y="38" width="38" height="44" fill="rgba(255,255,255,0.22)"/>
      {/* moon */}
      <circle cx="368" cy="16" r="6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
    </svg>
  );
}

function BrownstoneScene() {
  return (
    <svg viewBox="0 0 400 90" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      {/* sidewalk */}
      <rect x="0" y="78" width="400" height="12" fill="rgba(255,255,255,0.06)"/>
      {[0,40,80,120,160,200,240,280,320,360].map((x,i)=>(
        <line key={i} x1={x} y1="78" x2={x} y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      ))}
      {/* brownstone row */}
      {[0,1,2,3,4].map(i=>{
        const x = i*80;
        const h = [46,52,44,50,48][i];
        return (
          <g key={i}>
            <rect x={x} y={78-h} width="76" height={h} fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            {/* stoop */}
            <rect x={x+26} y={66} width="24" height="12" fill="rgba(255,255,255,0.1)"/>
            {/* door */}
            <rect x={x+30} y={56} width="16" height="20" rx="8 8 0 0" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
            {/* windows */}
            {[0,1].map(col=>[0,1,2].map(row=>(
              <rect key={`w${i}${col}${row}`} x={x+8+col*28} y={78-h+8+row*12} width="12" height="8" rx="1"
                fill={[true,false,true,false,true,false][i*2+col+row]?"rgba(255,240,160,0.4)":"rgba(255,255,255,0.06)"}
                stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
            )))}
            {/* cornice */}
            <rect x={x} y={78-h} width="76" height="4" fill="rgba(255,255,255,0.12)"/>
          </g>
        );
      })}
      {/* tree */}
      <rect x="77" y="54" width="3" height="24" fill="rgba(255,255,255,0.2)"/>
      <circle cx="78" cy="50" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <rect x="157" y="56" width="3" height="22" fill="rgba(255,255,255,0.2)"/>
      <circle cx="158" cy="52" r="9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    </svg>
  );
}

function ParkScene() {
  return (
    <svg viewBox="0 0 400 90" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      {/* ground */}
      <rect x="0" y="74" width="400" height="16" fill="rgba(255,255,255,0.06)"/>
      {/* path */}
      <path d="M160 90 Q200 74 240 90" fill="rgba(255,255,255,0.06)"/>
      {/* trees */}
      {[20,80,140,260,320,376].map((x,i)=>{
        const h = [22,28,24,26,20,24][i];
        return (
          <g key={i}>
            <rect x={x} y={74-h} width="3" height={h} fill="rgba(255,255,255,0.25)"/>
            <ellipse cx={x+1.5} cy={74-h-8} rx={10+i%2*4} ry={10+i%3*3} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1"/>
            <ellipse cx={x+1.5} cy={74-h-8} rx={6+i%2*3} ry={7+i%3*2} fill="rgba(255,255,255,0.06)"/>
          </g>
        );
      })}
      {/* bench */}
      <rect x="180" y="68" width="40" height="4" rx="1" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
      <rect x="184" y="72" width="4" height="6" fill="rgba(255,255,255,0.2)"/>
      <rect x="212" y="72" width="4" height="6" fill="rgba(255,255,255,0.2)"/>
      <rect x="188" y="62" width="26" height="3" rx="1" fill="rgba(255,255,255,0.2)"/>
      {/* lamp */}
      <rect x="340" y="42" width="2.5" height="32" fill="rgba(255,255,255,0.3)"/>
      <ellipse cx="341" cy="42" rx="7" ry="5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
      <circle cx="341" cy="42" r="3" fill="rgba(255,240,160,0.6)"/>
      {/* skyline backdrop low buildings */}
      <rect x="0" y="40" width="30" height="34" fill="rgba(255,255,255,0.08)"/>
      <rect x="360" y="36" width="40" height="38" fill="rgba(255,255,255,0.08)"/>
      {/* stars */}
      {[[50,12],[120,8],[200,16],[300,10],[360,18]].map(([sx,sy],i)=>(
        <circle key={i} cx={sx} cy={sy} r="1" fill="rgba(255,255,255,0.5)"/>
      ))}
    </svg>
  );
}

function SohoScene() {
  return (
    <svg viewBox="0 0 400 90" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      {/* ground */}
      <rect x="0" y="80" width="400" height="10" fill="rgba(255,255,255,0.06)"/>
      {/* cast iron buildings */}
      {[0,1,2,3].map(i=>{
        const x = i*100;
        const h = [56,48,60,52][i];
        return (
          <g key={i}>
            <rect x={x} y={80-h} width="96" height={h} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
            {/* columns */}
            {[0,1,2,3].map(c=>(
              <rect key={c} x={x+c*24} y={80-h} width="3" height={h} fill="rgba(255,255,255,0.06)"/>
            ))}
            {/* arched windows */}
            {[0,1,2,3].map(col=>[0,1,2,3].map(row=>(
              <g key={`a${i}${col}${row}`}>
                <rect x={x+4+col*23} y={80-h+8+row*13} width="14" height="10" rx="7 7 0 0"
                  fill={((i+col+row)%3===0)?"rgba(255,240,160,0.35)":"rgba(255,255,255,0.05)"}
                  stroke="rgba(255,255,255,0.18)" strokeWidth="0.6"/>
              </g>
            )))}
            {/* cornice detail */}
            <rect x={x} y={80-h} width="96" height="5" fill="rgba(255,255,255,0.1)"/>
            <rect x={x} y={80-h+5} width="96" height="2" fill="rgba(255,255,255,0.06)"/>
          </g>
        );
      })}
      {/* fire escapes */}
      {[60, 260].map((x,i)=>(
        <g key={i}>
          <rect x={x} y={30} width="18" height="50" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
          {[0,1,2,3].map(r=>(
            <rect key={r} x={x} y={30+r*12} width="18" height="1.5" fill="rgba(255,255,255,0.2)"/>
          ))}
          <rect x={x} y={76} width="18" height="4" fill="rgba(255,255,255,0.15)"/>
        </g>
      ))}
      {/* water tower */}
      <rect x="186" y="26" width="3" height="22" fill="rgba(255,255,255,0.3)"/>
      <rect x="178" y="28" width="20" height="14" rx="2 2 0 0" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>
      {/* awnings */}
      {[10,110,210,310].map((x,i)=>(
        <path key={i} d={`M${x} 60 L${x+30} 60 L${x+26} 66 L${x+4} 66 Z`}
          fill={["rgba(255,31,125,0.4)","rgba(255,255,255,0.1)","rgba(255,31,125,0.3)","rgba(255,255,255,0.12)"][i]}/>
      ))}
    </svg>
  );
}

/* ── Band config ──────────────────────────────────────────────── */

const BANDS = [
  {
    id: "eats" as CityCategory,
    label: "EATS",
    sub: "restaurants · bars · late night",
    Scene: SubwayScene,
    accent: "#FF1F7D",
    tint: "rgba(255,31,125,0.18)",
  },
  {
    id: "go" as CityCategory,
    label: "GO",
    sub: "events · shows · rooftops",
    Scene: SkyscraperScene,
    accent: "#A8D8EA",
    tint: "rgba(168,216,234,0.12)",
  },
  {
    id: "solo" as CityCategory,
    label: "SOLO",
    sub: "walks · coffee · galleries",
    Scene: BrownstoneScene,
    accent: "#F4C2A1",
    tint: "rgba(244,194,161,0.12)",
  },
  {
    id: "favorites" as CityCategory,
    label: "BLOOMIES\nFAVORITES",
    sub: "member picks",
    Scene: ParkScene,
    accent: "#A8E6C8",
    tint: "rgba(168,230,200,0.12)",
  },
  {
    id: "trending" as CityCategory,
    label: "TRENDING",
    sub: "what's hot right now",
    Scene: SohoScene,
    accent: "#E8C4F0",
    tint: "rgba(232,196,240,0.12)",
  },
];

/* ── Eats sub-page data ───────────────────────────────────────── */

const FILTERS = ["Tonight", "1+", "Italian", "Cocktails", "Date Night", "Brunch", "Outdoor", "Sushi", "Wine Bars"];

const FEATURED = [
  { id: 1, name: "Bar Pisellino", neighborhood: "WEST VILLAGE", cuisine: "ITALIAN", women: 18, note: "So early for a martini at the bar — Maya", bg: "#1a0a0e" },
  { id: 2, name: "Lola Taverna", neighborhood: "WEST VILLAGE", cuisine: "GREEK", badge: "TRENDING", women: 41, note: "Everything we ordered was perfect — Dani", bg: "#2d1a0e" },
  { id: 3, name: "Via Carota", neighborhood: "WEST VILLAGE", cuisine: "ITALIAN", badge: "⚑ RESERVED", women: 12, bg: PAPER, reservation: { time: "8:15PM", seats: "2 SEATS" }, light: true },
];

const GRID_SPOTS = [
  { id: 4, name: "Sant Ambroeus", neighborhood: "SOHO", saved: 12, bg: "#FAF0E8" },
  { id: 5, name: "Cecconni's",    neighborhood: "SOHO", saved: 8,  bg: "#F0EAF8" },
  { id: 6, name: "Rubirosa",      neighborhood: "NOLITA", saved: 12, bg: "#FFF5F8" },
  { id: 7, name: "Pasta Night",   neighborhood: "LES", saved: 8, bg: "#F5F0E8" },
];

/* ── Landing page ─────────────────────────────────────────────── */

function CityLanding({ onSelect }: { onSelect: (c: CityCategory) => void }) {
  return (
    <div style={{ background: DARK, minHeight: "100vh", paddingTop: 48, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 16px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,31,125,0.8)", marginBottom: 6 }}>
          BB+ · NEW YORK CITY
        </p>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.05 }}>
          Your City
        </p>
      </div>

      {/* Bands */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {BANDS.map((band, i) => (
          <button
            key={band.id}
            onClick={() => onSelect(band.id)}
            style={{
              display: "flex",
              alignItems: "stretch",
              width: "100%",
              height: 140,
              border: "none",
              cursor: "pointer",
              background: "none",
              padding: 0,
              position: "relative",
              borderBottom: i < BANDS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            {/* Dark band background */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(to right, ${band.tint} 0%, transparent 60%)`,
            }} />

            {/* Scene illustration — right portion */}
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "65%", overflow: "hidden", opacity: 0.85 }}>
              <band.Scene />
            </div>

            {/* Fade overlay left-to-right */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(to right, ${DARK} 28%, rgba(10,8,6,0.7) 55%, transparent 100%)`,
              pointerEvents: "none",
            }} />

            {/* Label */}
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px", textAlign: "left" }}>
              <p style={{
                fontFamily: "var(--font-playfair)",
                fontSize: band.label.includes("\n") ? 20 : 28,
                fontWeight: 900,
                fontStyle: "italic",
                color: "white",
                lineHeight: 1.05,
                whiteSpace: "pre-line",
                marginBottom: 6,
              }}>
                {band.label}
              </p>
              <p style={{
                fontFamily: "var(--font-jost)",
                fontSize: "8px",
                fontWeight: 600,
                letterSpacing: "0.10em",
                color: band.accent,
                opacity: 0.85,
              }}>
                {band.sub}
              </p>
            </div>

            {/* Arrow */}
            <div style={{ position: "absolute", right: 18, bottom: 18, zIndex: 2 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Eats sub-page ────────────────────────────────────────────── */

function EatsPage({ onBack }: { onBack: () => void }) {
  const [activeFilter, setActiveFilter] = useState("Tonight");
  const [savedIds, setSaved] = useState<number[]>([]);
  function toggleSave(id: number) { setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]); }

  return (
    <div style={{ backgroundImage: PAPER_TEX, backgroundColor: CREAM, backgroundSize: "200px 200px", minHeight: "100vh", paddingBottom: 120 }}>

      {/* Cover */}
      <div style={{ position: "relative", height: 200, background: "#0d0806", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 30%, #3d1a0a 0%, #0d0806 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />

        {/* Back */}
        <button onClick={onBack} style={{ position: "absolute", top: 56, left: 16, background: "rgba(0,0,0,0.4)", border: "none", borderRadius: 999, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>CITY</span>
        </button>

        <div style={{ position: "absolute", bottom: 16, left: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>EATS · NYC</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>
            Tonight&apos;s<br />Table
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#0d0806", paddingBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px 0", scrollbarWidth: "none" as const }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              flexShrink: 0, padding: "6px 13px", borderRadius: 999,
              border: `1.5px solid ${activeFilter === f ? PINK : "rgba(255,255,255,0.15)"}`,
              background: activeFilter === f ? PINK : "transparent",
              color: activeFilter === f ? "white" : "rgba(255,255,255,0.55)",
              fontSize: "10px", fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer",
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 14px 0" }}>

        {/* Featured grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          {/* Left tall card */}
          <div style={{ gridRow: "span 2", background: FEATURED[0].bg, borderRadius: 18, minHeight: 240, position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.22)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 30%, rgba(180,30,60,0.5) 0%, transparent 70%)" }} />
            <div style={{ position: "absolute", top: 18, left: 12 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "#ff9eb5", lineHeight: 1.1, textShadow: "0 0 20px rgba(255,31,125,0.6)" }}>
                Bar<br />Pisellino
              </p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginTop: 4 }}>
                {FEATURED[0].neighborhood} · {FEATURED[0].cuisine}
              </p>
            </div>
            <div style={{ position: "absolute", top: 12, right: 10, background: PINK, borderRadius: 999, padding: "3px 8px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "white" }}>{FEATURED[0].women} going</span>
            </div>
            <div style={{ position: "absolute", bottom: 14, left: 12, right: 12 }}>
              <div style={{ transform: "rotate(-1deg)", background: "rgba(255,255,230,0.88)", padding: "7px 9px" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#444", lineHeight: 1.4 }}>{FEATURED[0].note}</p>
              </div>
            </div>
            <button onClick={() => toggleSave(1)} style={{ position: "absolute", bottom: 66, right: 10, width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill={savedIds.includes(1) ? PINK : "none"} stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>

          {/* Top right */}
          <div style={{ position: "relative", background: FEATURED[1].bg, borderRadius: 18, minHeight: 112, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 60% 30%, rgba(100,50,20,0.6) 0%, transparent 70%)" }} />
            {FEATURED[1].badge && (
              <div style={{ position: "absolute", top: 10, left: 10, background: PINK, borderRadius: 999, padding: "2px 8px" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>{FEATURED[1].badge}</span>
              </div>
            )}
            <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: "rgba(255,230,200,0.92)", lineHeight: 1.1 }}>{FEATURED[1].name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", marginTop: 2 }}>{FEATURED[1].neighborhood} · {FEATURED[1].cuisine}</p>
              <div style={{ marginTop: 5, display: "inline-flex", alignItems: "center", gap: 3 }}>
                {[1,2,3].map(k => <div key={k} style={{ width: 13, height: 13, borderRadius: "50%", background: `hsl(${20+k*20},60%,60%)`, border: "1.5px solid rgba(255,255,255,0.4)", marginLeft: k > 1 ? -5 : 0 }} />)}
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginLeft: 3 }}>{FEATURED[1].women}</span>
              </div>
            </div>
          </div>

          {/* Bottom right */}
          <div style={{ backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", borderRadius: 18, minHeight: 112, padding: "12px 12px 10px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            {FEATURED[2].badge && (
              <div style={{ display: "inline-flex", background: "#2d1a0a", borderRadius: 999, padding: "3px 9px", marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "#d4a060", letterSpacing: "0.1em" }}>{FEATURED[2].badge}</span>
              </div>
            )}
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: "#1C1B1C", lineHeight: 1.1 }}>{FEATURED[2].name}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#aaa", letterSpacing: "0.08em", marginTop: 2 }}>{FEATURED[2].neighborhood}</p>
            {FEATURED[2].reservation && (
              <div style={{ marginTop: 8, background: "#1C1B1C", borderRadius: 8, padding: "6px 8px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "#d4a060" }}>{FEATURED[2].reservation.time}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>{FEATURED[2].reservation.seats}</p>
              </div>
            )}
          </div>
        </div>

        {/* Grid spots */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {GRID_SPOTS.map(spot => (
            <div key={spot.id} style={{ backgroundImage: PAPER_TEX, backgroundColor: spot.bg, backgroundSize: "200px 200px", borderRadius: 16, padding: "12px 12px 10px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", position: "relative" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 700, fontStyle: "italic", color: "#1C1B1C", lineHeight: 1.2, marginBottom: 4 }}>{spot.name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "#aaa", letterSpacing: "0.06em" }}>{spot.neighborhood}</p>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill={PINK} stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#bbb" }}>{spot.saved} saved</span>
                </div>
                <button onClick={() => toggleSave(spot.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill={savedIds.includes(spot.id) ? PINK : "none"} stroke={PINK} strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Rooftop spotlight */}
        <div style={{ background: "linear-gradient(145deg, #0d0d14 0%, #1a0d20 100%)", borderRadius: 22, padding: "20px 18px", position: "relative", overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.25)", marginBottom: 14 }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(255,31,125,0.25) 0%, transparent 55%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 10, right: 14, background: PINK, borderRadius: 999, padding: "3px 10px" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>ROOFTOP</span>
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.8)", marginBottom: 5, position: "relative" }}>TONIGHT&apos;S SPOT</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 19, fontWeight: 900, fontStyle: "italic", color: "#F1DFDD", lineHeight: 1.15, marginBottom: 4, position: "relative" }}>
            The Roof at PUBLIC Hotel
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", marginBottom: 12, position: "relative" }}>LOWER EAST SIDE</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
            <div style={{ display: "flex" }}>
              {[1,2,3].map(k => <div key={k} style={{ width: 22, height: 22, borderRadius: "50%", background: `hsl(${330+k*15},50%,55%)`, border: "2px solid rgba(255,255,255,0.25)", marginLeft: k > 1 ? -8 : 0 }} />)}
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.45)" }}>18 women going</span>
            <div style={{ marginLeft: "auto", background: PINK, borderRadius: 999, padding: "8px 16px", boxShadow: `0 4px 14px ${PINK}55` }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: "white" }}>I&apos;M IN →</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Coming soon placeholder ──────────────────────────────────── */

function ComingSoon({ label, accent, onBack, Scene }: {
  label: string; accent: string; onBack: () => void;
  Scene: () => React.ReactElement;
}) {
  return (
    <div style={{ background: DARK, minHeight: "100vh", paddingTop: 48, paddingBottom: 100 }}>
      <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}><Scene /></div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 0%, rgba(10,8,6,0.9) 100%)" }} />
        <button onClick={onBack} style={{ position: "absolute", top: 16, left: 16, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: 999, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>CITY</span>
        </button>
      </div>
      <div style={{ padding: "32px 24px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: accent, marginBottom: 8 }}>
          {label.toUpperCase()}
        </p>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1, marginBottom: 16 }}>
          Coming<br />Soon
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
          We&apos;re curating the best of NYC for you.<br />Check back soon.
        </p>
      </div>
    </div>
  );
}

/* ── Main export ──────────────────────────────────────────────── */

export function CityPage() {
  const [category, setCategory] = useState<CityCategory>("landing");

  if (category === "landing") return <CityLanding onSelect={setCategory} />;
  if (category === "eats")    return <EatsPage onBack={() => setCategory("landing")} />;

  const band = BANDS.find(b => b.id === category)!;
  return (
    <ComingSoon
      label={band.label}
      accent={band.accent}
      onBack={() => setCategory("landing")}
      Scene={band.Scene}
    />
  );
}
