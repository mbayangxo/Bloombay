"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  PINK,
  DARK_GRAIN,
  CITY_CSS,
  type CityCategory,
} from "@/lib/city/tokens";
import {
  HOOD_INDEX, BANDS,
  type BuildingConfig, SKYLINE_BUILDINGS,
} from "@/lib/city/city-data";

// ── Horizontal Skyline SVG ────────────────────────────────────────────────────
// Buildings as horizontal bars anchored on the LEFT, extending right — like
// viewing a skyline from the side (reference: IMG_3117 perspective style).
export function DaySkyline({ width = 430, height = 700 }: { width?: number; height?: number }) {
  function lcg(s: number) { return (s * 16807) % 2147483647; }

  // Generate horizontal bars (each = one building)
  const bars: { y: number; bh: number; bw: number; idx: number }[] = [];
  let y = 0, s = 99, idx = 0;
  while (y < height) {
    s = lcg(s); const bh = 9 + (s % 16);           // bar height 9–25 px
    s = lcg(s); const bw = Math.floor(width * (0.2 + (s % 1000) / 1000 * 0.72));  // bar width
    s = lcg(s); const gap = 3 + (s % 6);            // gap between bars
    bars.push({ y, bh, bw, idx });
    y += bh + gap;
    idx++;
  }

  // Uniform dusky-mauve silhouette palette — all similar tones so the skyline reads as one cohesive shape
  const colors = ["#8B6090","#7A5280","#966898","#7E5888","#8A6092"];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice"
      style={{ display: "block", width: "100%", height: "100%" }}>
      <defs>
        {/* Sky gradient — horizontal, golden-hour pink to soft peach */}
        <linearGradient id="hsky_bg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF8FB8"/>
          <stop offset="45%" stopColor="#FFB3D9"/>
          <stop offset="100%" stopColor="#FFC8A0"/>
        </linearGradient>
        {/* Subtle vertical sky gradient overlay */}
        <linearGradient id="hsky_ov" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,180,200,0.4)"/>
          <stop offset="100%" stopColor="rgba(255,160,80,0.25)"/>
        </linearGradient>
        {/* Glow from left where buildings anchor */}
        <radialGradient id="hsky_glow" cx="0%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(255,100,160,0.28)"/>
          <stop offset="100%" stopColor="rgba(255,100,160,0)"/>
        </radialGradient>
      </defs>

      {/* Background sky */}
      <rect width={width} height={height} fill="url(#hsky_bg)"/>
      <rect width={width} height={height} fill="url(#hsky_ov)"/>
      <rect width={width} height={height} fill="url(#hsky_glow)"/>

      {/* Building bars — left-anchored horizontal blocks */}
      {bars.map((b) => {
        const col = colors[b.idx % colors.length];
        const winH = Math.max(3, b.bh - 6);
        const winCount = Math.max(1, Math.floor(b.bw / 14));
        const hasSetback = b.bw > width * 0.6 && b.idx % 5 === 1;
        return (
          <g key={b.idx}>
            {/* Drop shadow for depth */}
            <rect x={3} y={b.y + 3} width={b.bw} height={b.bh} fill="rgba(200,60,120,0.18)" rx={1}/>
            {/* Building bar */}
            <rect x={0} y={b.y} width={b.bw} height={b.bh} fill={col} rx={1}/>
            {/* Right-edge highlight (gloss) */}
            <rect x={b.bw - 3} y={b.y + 1} width={2} height={b.bh - 2} fill="rgba(255,255,255,0.35)" rx={0.5}/>
            {/* Top-edge highlight */}
            <rect x={1} y={b.y} width={b.bw - 4} height={1.5} fill="rgba(255,255,255,0.4)" rx={0.5}/>
            {/* Setback tower */}
            {hasSetback && (
              <rect x={0} y={b.y - Math.floor(b.bh * 0.7)} width={Math.floor(b.bw * 0.55)} height={Math.floor(b.bh * 0.7)} fill={col} rx={1}/>
            )}
            {/* Windows — tiny warm squares running along the bar */}
            {b.bh >= 13 && Array.from({ length: winCount }, (_, wi) => {
              const seed = b.idx * 17 + wi * 13;
              const lit = seed % 5 !== 0;
              if (!lit) return null;
              const wFill = seed % 7 === 1
                ? "rgba(255,200,80,0.85)"
                : seed % 11 === 3
                ? "rgba(255,120,180,0.75)"
                : "rgba(255,220,140,0.7)";
              return (
                <rect key={wi}
                  x={4 + wi * 14}
                  y={b.y + Math.floor((b.bh - winH) / 2)}
                  width={6}
                  height={winH}
                  fill={wFill}
                  rx={0.5}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

// ── Window strip (for sign fill texture) ─────────────────────────────────────
export function WindowStrip() {
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

// ═══════════════════════════════════════════════════════════════════════════════
// NYC BUILDING TILE — single tappable building with facade + windows
// ═══════════════════════════════════════════════════════════════════════════════

export function BuildingTile({
  b, onTap, active,
}: {
  b: BuildingConfig;
  onTap?: () => void;
  active?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const winW = Math.floor((b.width - 16) / b.winCols) - 4;
  const winH = Math.floor((b.height * 0.72 - 14) / b.winRows) - 4;

  // Rooftop height / shape
  const roofH = b.rooftop === "tower" ? 28 : b.rooftop === "setback" ? 18 : b.rooftop === "stepped" ? 12 : b.rooftop === "arched" ? 10 : 6;
  const bodyH = b.height - roofH;

  function Rooftop() {
    const w = b.width;
    if (b.rooftop === "tower") return (
      <div style={{ position: "relative", width: w, height: roofH }}>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: Math.floor(w * 0.4), height: roofH, background: b.accentTop ?? b.wallColor, borderRadius: "3px 3px 0 0" }} />
      </div>
    );
    if (b.rooftop === "setback") return (
      <div style={{ position: "relative", width: w, height: roofH }}>
        <div style={{ position: "absolute", left: "15%", right: "15%", height: roofH * 0.6, background: b.accentTop ?? b.wallColor, top: 0 }} />
        <div style={{ position: "absolute", left: 0, right: 0, height: roofH * 0.45, background: b.wallColor, bottom: 0 }} />
      </div>
    );
    if (b.rooftop === "arched") return (
      <div style={{ width: w, height: roofH, background: b.wallColor, borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />
    );
    if (b.rooftop === "stepped") return (
      <div style={{ position: "relative", width: w, height: roofH }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 4, background: b.accentTop ?? b.wallColor, top: 0 }} />
        <div style={{ position: "absolute", left: "8%", right: "8%", height: 4, background: b.wallColor, top: 4 }} />
        <div style={{ position: "absolute", left: "16%", right: "16%", height: 4, background: b.wallColor, top: 8 }} />
      </div>
    );
    // flat
    return <div style={{ width: w, height: roofH, background: b.accentTop ?? b.wallColor }} />;
  }

  const el = (
    <div
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => { setPressed(false); onTap?.(); }}
      onClick={onTap}
      style={{
        width: b.width,
        display: "flex", flexDirection: "column", alignItems: "center",
        cursor: b.filler ? "default" : "pointer",
        transform: pressed && !b.filler ? "scaleY(0.96)" : "scaleY(1)",
        transformOrigin: "bottom center",
        transition: "transform 0.1s",
        WebkitTapHighlightColor: "transparent",
        position: "relative",
      }}
    >
      {/* Active highlight glow */}
      {active && !b.filler && (
        <div style={{ position: "absolute", inset: 0, background: `${PINK}22`, borderRadius: "4px 4px 0 0", zIndex: 5, pointerEvents: "none" }} />
      )}

      {/* Rooftop */}
      <Rooftop />

      {/* Water tower */}
      {b.waterTower && (
        <div style={{ position: "absolute", top: roofH - 22, right: Math.floor(b.width * 0.18), zIndex: 3 }}>
          <div style={{ width: 10, height: 14, background: "#5A4030", borderRadius: "2px 2px 0 0", margin: "0 auto" }} />
          <div style={{ width: 14, height: 8, background: "#4A3020", borderRadius: "50% 50% 0 0 / 60% 60% 0 0", marginLeft: -2 }} />
          <div style={{ width: 2, height: 8, background: "#4A3020", margin: "0 auto" }} />
        </div>
      )}

      {/* Building body */}
      <div style={{
        width: b.width, height: bodyH,
        background: b.wallColor,
        position: "relative",
        overflow: "hidden",
        boxShadow: active && !b.filler ? `inset 0 0 0 2px ${PINK}88` : "inset -2px 0 8px rgba(0,0,0,0.15)",
      }}>
        {/* Shadow on right edge — depth */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 6, background: "rgba(0,0,0,0.12)", pointerEvents: "none" }} />

        {/* Window grid */}
        <div style={{
          position: "absolute",
          top: 10,
          left: 0, right: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${b.winCols}, ${winW}px)`,
          gridTemplateRows: `repeat(${b.winRows}, ${winH}px)`,
          gap: 4,
          justifyContent: "center",
          padding: "0 8px",
        }}>
          {Array.from({ length: b.winCols * b.winRows }, (_, i) => {
            const litSeed = (i * 7 + b.id.charCodeAt(0)) % 10;
            const lit = litSeed > 3;
            const pinkWindow = litSeed === 8;
            return (
              <div key={i} style={{
                width: winW, height: winH,
                background: pinkWindow ? `${PINK}99` : lit ? b.windowLitColor : b.windowColor,
                borderRadius: 1,
                boxShadow: lit ? `0 0 3px ${b.windowLitColor}66` : "none",
              }} />
            );
          })}
        </div>

        {/* Category label on building face — only for non-filler */}
        {!b.filler && b.label && (
          <div style={{
            position: "absolute", bottom: 12, left: 0, right: 0,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            zIndex: 2,
          }}>
            <div style={{
              background: active ? PINK : "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
              borderRadius: 6, padding: "4px 8px",
              border: active ? `1px solid ${PINK}` : "1px solid rgba(255,255,255,0.15)",
              transition: "background 0.2s",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.12em", color: "white", lineHeight: 1 }}>{b.label}</p>
            </div>
            {b.subLabel && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>{b.subLabel}</p>
            )}
          </div>
        )}
      </div>

      {/* Ground floor — slightly darker base strip */}
      <div style={{ width: b.width, height: 6, background: `color-mix(in srgb, ${b.wallColor} 70%, black)` }} />
    </div>
  );

  return el;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUILDING LABELS PANEL  — NYC skyline, horizontal scroll, tap to explore
// ═══════════════════════════════════════════════════════════════════════════════
export function BuildingLabelsPanel({ onSelect, onSwipeToMenu }: { onSelect: (c: CityCategory) => void; onSwipeToMenu: () => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleBuildingTap(b: BuildingConfig) {
    if (b.filler || !b.category) return;
    setActiveId(b.id);
    onSelect(b.category);
  }

  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      <style>{CITY_CSS}</style>

      {/* ── SKY — clean NYC dusk gradient, no confusing imagery ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #1A1040 0%, #2A1860 18%, #6A2870 38%, #C05080 58%, #E08070 75%, #F0C090 90%, #F8E0C0 100%)",
      }} />

      {/* Stars */}
      {[{top:"8%",left:"12%"},{top:"5%",left:"35%"},{top:"12%",left:"55%"},{top:"7%",left:"72%"},{top:"14%",left:"88%"},{top:"4%",left:"92%"}].map((s,i)=>(
        <div key={i} style={{ position:"absolute", top:s.top, left:s.left, width:2, height:2, borderRadius:"50%", background:"white", opacity:0.7, zIndex:1, pointerEvents:"none" }} />
      ))}

      {/* Moon */}
      <div style={{ position:"absolute", top:"6%", right:"18%", zIndex:1, pointerEvents:"none" }}>
        <div style={{ width:18, height:18, borderRadius:"50%", background:"rgba(255,245,200,0.9)", boxShadow:"0 0 12px rgba(255,240,180,0.7)" }} />
      </div>

      {/* Header */}
      <div style={{ position:"relative", zIndex:5, padding:"calc(env(safe-area-inset-top,0px) + 68px) 20px 0", display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
        <div>
          <p style={{ fontFamily:"var(--font-jost)", fontSize:"7px", fontWeight:800, letterSpacing:"0.3em", color:"rgba(255,255,255,0.6)", marginBottom:4 }}>THE CITY</p>
          <h1 style={{ fontFamily:"var(--font-fraunces)", fontSize:28, fontWeight:900, fontStyle:"italic", color:"white", lineHeight:1, margin:0, textShadow:"0 2px 12px rgba(0,0,0,0.4)" }}>New York.</h1>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
          <button onClick={onSwipeToMenu} style={{
            background:"rgba(255,255,255,0.18)", backdropFilter:"blur(10px)",
            border:"1px solid rgba(255,255,255,0.35)", borderRadius:999,
            padding:"8px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6,
            WebkitTapHighlightColor:"transparent",
          }}>
            <span style={{ fontFamily:"var(--font-jost)", fontSize:"8px", fontWeight:700, color:"white", letterSpacing:"0.1em" }}>CITY GUIDE</span>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <Link href="/member/book" style={{ textDecoration:"none" }}>
            <div style={{
              background:"rgba(255,31,125,0.25)", backdropFilter:"blur(10px)",
              border:"1px solid rgba(255,31,125,0.4)", borderRadius:999,
              padding:"6px 12px", display:"flex", alignItems:"center", gap:5,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
              </svg>
              <span style={{ fontFamily:"var(--font-jost)", fontSize:"8px", fontWeight:800, color:"white", letterSpacing:"0.1em" }}>THE BOOK</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Hint text */}
      <div style={{ position:"relative", zIndex:5, padding:"10px 20px 0" }}>
        <p style={{ fontFamily:"var(--font-caveat)", fontSize:14, color:"rgba(255,255,255,0.45)" }}>tap a building to explore ↓</p>
      </div>

      {/* ── SKYLINE — horizontal scroll, buildings sit on ground ── */}
      <div style={{ flex:1, position:"relative", zIndex:4 }}>
        {/* Ground / street */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:24,
          background:"linear-gradient(to top, #1A1208, #2A2010)",
          zIndex:2,
        }}>
          {/* Street dashes */}
          <div style={{ position:"absolute", top:"50%", left:0, right:0, height:1, background:"repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 20px, transparent 20px, transparent 40px)" }} />
        </div>

        {/* Sidewalk strip */}
        <div style={{ position:"absolute", bottom:24, left:0, right:0, height:8, background:"#2A2818", zIndex:2 }} />

        {/* Horizontal scroll of buildings */}
        <div style={{
          position:"absolute", bottom:32, left:0, right:0,
          overflowX:"auto", overflowY:"hidden",
          scrollbarWidth:"none" as const,
          display:"flex", alignItems:"flex-end",
          paddingLeft:16, paddingRight:32,
          zIndex:3,
          WebkitOverflowScrolling: "touch" as const,
        }}
          className="type-scroll"
        >
          {/* Ambient city glow at ground level */}
          <div style={{ position:"sticky", left:0, bottom:0, width:"100%", height:40, background:"linear-gradient(to top, rgba(255,140,60,0.18), transparent)", pointerEvents:"none", zIndex:1 }} />

          {SKYLINE_BUILDINGS.map(b => (
            <BuildingTile
              key={b.id}
              b={b}
              active={activeId === b.id}
              onTap={() => handleBuildingTap(b)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// CITY MENU PANEL  (landing slide 1)
// ═══════════════════════════════════════════════════════════════════════════════
export function CityMenuPanel({ onSelect, onSwipeBack }: { onSelect: (c: CityCategory) => void; onSwipeBack: () => void }) {
  const [hovered, setHovered] = useState<CityCategory | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const searchResults = searchQ.trim().length > 0
    ? HOOD_INDEX.filter(h =>
        h.name.toLowerCase().includes(searchQ.toLowerCase()) ||
        h.borough.toLowerCase().includes(searchQ.toLowerCase()) ||
        h.tags.some(t => t.includes(searchQ.toLowerCase()))
      )
    : [];

  function openSearch() {
    setSearchOpen(true);
    setSearchQ("");
    setTimeout(() => searchRef.current?.focus(), 80);
  }

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
        {/* Neighborhood search overlay */}
        {searchOpen && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(20,8,32,0.82)", backdropFilter: "blur(18px)",
            display: "flex", flexDirection: "column", padding: "calc(env(safe-area-inset-top,0px) + 60px) 20px 32px",
          }} onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{
                flex: 1, display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 14, padding: "12px 16px",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  ref={searchRef}
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search a neighborhood…"
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    fontFamily: "var(--font-jost)", fontSize: 16, fontWeight: 500, color: "white",
                  }}
                />
              </div>
              <button onClick={() => setSearchOpen(false)} style={{
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 10, padding: "10px 14px", cursor: "pointer", color: "white",
                fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700,
              }}>CANCEL</button>
            </div>

            {searchQ.trim() === "" && (
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>ALL NEIGHBORHOODS</p>
                {HOOD_INDEX.map(h => (
                  <button key={h.slug} onClick={() => setSearchOpen(false)}
                    style={{ width: "100%", background: "none", border: "none", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 15, fontWeight: 700, color: "white", margin: 0 }}>{h.name}</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.4)", margin: 0, marginTop: 2 }}>{h.tags.slice(0,3).join(" · ")}</p>
                    </div>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK, letterSpacing: "0.08em" }}>{h.borough.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}

            {searchResults.length > 0 && (
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>{searchResults.length} RESULT{searchResults.length > 1 ? "S" : ""}</p>
                {searchResults.map(h => (
                  <button key={h.slug} onClick={() => setSearchOpen(false)}
                    style={{ width: "100%", background: "none", border: "none", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 15, fontWeight: 700, color: "white", margin: 0 }}>{h.name}</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.4)", margin: 0, marginTop: 2 }}>{h.tags.slice(0,3).join(" · ")}</p>
                    </div>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK, letterSpacing: "0.08em" }}>{h.borough.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}

            {searchQ.trim() !== "" && searchResults.length === 0 && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: 32 }}>No neighborhoods found.</p>
            )}
          </div>
        )}

        {/* Header row */}
        <div style={{ padding: "72px 22px 20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: PINK, marginBottom: 6 }}>BB+ · NEW YORK CITY</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <p style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px,8vw,44px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 0.95 }}>City Guide.</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>restaurants, bars &amp; more</p>
            </div>
          </div>
          {/* Search + back buttons */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, marginTop: 6 }}>
          <div style={{ display: "flex", gap: 7 }}>
            <button onClick={openSearch} style={{
              background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.4)", borderRadius: 999,
              width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              WebkitTapHighlightColor: "transparent",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          <button onClick={onSwipeBack} style={{
            marginTop: 6, background: "rgba(255,255,255,0.35)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.5)", borderRadius: 999,
            padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "white", letterSpacing: "0.08em" }}>SIGNS</span>
          </button>
          </div>{/* end flex row of buttons */}
          </div>{/* end column wrapper */}
        </div>{/* end header row */}

        {/* ── GIRL GEMS + GIRL FAVORITES — literal object tiles ── */}
        <div style={{ padding: "6px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {/* Girl Gems — gemstone object */}
          <button onClick={() => onSelect("girl_gems")}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" as const, WebkitTapHighlightColor: "transparent" }}>
            <div style={{
              background: "linear-gradient(145deg, #FDEEF7 0%, #FAD8ED 60%, #F8C8E8 100%)",
              borderRadius: 20, padding: "16px 16px 14px",
              border: "1px solid rgba(255,100,160,0.25)",
              minHeight: 130, display: "flex", flexDirection: "column" as const, justifyContent: "space-between",
              position: "relative" as const, overflow: "hidden",
              boxShadow: "0 4px 20px rgba(255,31,125,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}>
              {/* Gemstone SVG */}
              <div style={{ position: "absolute", bottom: -8, right: -8 }}>
                <svg width="72" height="64" viewBox="0 0 72 64" fill="none">
                  <defs>
                    <linearGradient id="gem1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="rgba(255,180,220,0.9)"/>
                      <stop offset="100%" stopColor="rgba(255,100,170,0.6)"/>
                    </linearGradient>
                  </defs>
                  <polygon points="36,4 66,20 58,60 14,60 6,20" fill="url(#gem1)" stroke="rgba(255,31,125,0.2)" strokeWidth="1"/>
                  <polygon points="36,4 66,20 36,34" fill="rgba(255,220,240,0.7)"/>
                  <polygon points="36,4 6,20 36,34" fill="rgba(255,200,230,0.5)"/>
                  <polygon points="36,34 66,20 58,60" fill="rgba(255,160,210,0.4)"/>
                  <polygon points="36,34 6,20 14,60" fill="rgba(255,140,200,0.3)"/>
                  <line x1="36" y1="4" x2="36" y2="34" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
                </svg>
              </div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>GIRL GEMS</p>
              <div>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 17, fontWeight: 700, color: "#3A0020", lineHeight: 1.15 }}>spots only<br/>we know</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: PINK, marginTop: 10, letterSpacing: "0.06em" }}>EXPLORE →</p>
              </div>
            </div>
          </button>

          {/* Girl Favs — heart charm object */}
          <button onClick={() => onSelect("girl_favs")}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" as const, WebkitTapHighlightColor: "transparent" }}>
            <div style={{
              background: "linear-gradient(145deg, #FFF0F5 0%, #FFDFEE 60%, #FFD0E8 100%)",
              borderRadius: 20, padding: "16px 16px 14px",
              border: "1px solid rgba(255,31,125,0.18)",
              minHeight: 130, display: "flex", flexDirection: "column" as const, justifyContent: "space-between",
              position: "relative" as const, overflow: "hidden",
              boxShadow: "0 4px 20px rgba(255,31,125,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}>
              {/* Heart object SVG */}
              <div style={{ position: "absolute", bottom: -8, right: -8 }}>
                <svg width="68" height="62" viewBox="0 0 68 62" fill="none">
                  <defs>
                    <radialGradient id="heart1" cx="50%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="rgba(255,120,170,0.8)"/>
                      <stop offset="100%" stopColor="rgba(200,0,80,0.5)"/>
                    </radialGradient>
                  </defs>
                  <path d="M34 52 C34 52 4 36 4 18 C4 8 11 2 20 4 C26 5 32 10 34 14 C36 10 42 5 48 4 C57 2 64 8 64 18 C64 36 34 52 34 52Z" fill="url(#heart1)"/>
                  <path d="M20 10 C16 12 14 16 15 20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>GIRL FAVS</p>
              <div>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 17, fontWeight: 700, color: "#3A0020", lineHeight: 1.15 }}>most saved<br/>this month</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: PINK, marginTop: 10, letterSpacing: "0.06em" }}>SEE ALL →</p>
              </div>
            </div>
          </button>
        </div>

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
export function CityLanding({ onSelect }: { onSelect: (c: CityCategory) => void }) {
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
