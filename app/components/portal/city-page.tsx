"use client";

import "@/app/styles/bloom-entrance.css";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PushPin } from "./scrapbook";
import { ReserveTableSheet } from "./reserve-table-sheet";
import { createClient } from "@/lib/supabase/client";
import {
  getNoteCountsByPlace,
} from "@/lib/actions/bloom-notes";
import { BloomNotesBoard } from "@/app/components/portal/bloom-notes-board";
import { FlowerButton } from "@/app/components/shared/flower-button";
import {
  getPlaceGiftsForUser,
  givePlaceGift,
  takeBackPlaceGift,
} from "@/lib/actions/place-gifts";
import type { GiftKind } from "@/lib/bloom-gifts";
import { unitsForKind } from "@/lib/bloom-gifts";
import { getMyNeighborhood, isNearby } from "@/lib/city-neighborhoods";
import { NeighborhoodPicker } from "@/app/components/portal/neighborhood-picker";

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
type CityCategory = "landing" | "eat" | "go" | "solo" | "bloomies" | "girl_gems" | "girl_favs";

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
  { id: "eat",      label: "EAT",               sub: "Restaurants · Cafés · Bars",              icon: "🍽️", accentColor: "#FF1F7D" },
  { id: "go",       label: "GO",                sub: "Museums · Walks · Things to do",          icon: "🗺️", accentColor: "#E8006A" },
  { id: "solo",     label: "SOLO",              sub: "For your alone time · Self-care · Peace", icon: "🌸", accentColor: "#FF5BAD" },
  { id: "bloomies", label: "BLOOMIES FAVES",    sub: "Member picks · Hidden gems · Top spots",  icon: "✦",  accentColor: "#C80060" },
];

// ── Horizontal Skyline SVG ────────────────────────────────────────────────────
// Buildings as horizontal bars anchored on the LEFT, extending right — like
// viewing a skyline from the side (reference: IMG_3117 perspective style).
function DaySkyline({ width = 430, height = 700 }: { width?: number; height?: number }) {
  function lcg(s: number) { return (s * 16807) % 2147483647; }

  // Generate horizontal bars (each = one building)
  const bars: { y: number; bh: number; bw: number; idx: number }[] = [];
  let y = 0, s = 99, idx = 0;
  while (y < height) {
    s = lcg(s); const bh = 26 + (s % 34);          // bar height 26–60 px — bigger, fewer bars
    s = lcg(s); const bw = Math.floor(width * (0.2 + (s % 1000) / 1000 * 0.72));  // bar width
    s = lcg(s); const gap = 10 + (s % 16);          // gap between bars — more breathing room
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

// ── Weekly theme spotlight — "Best Croissants This Week", curated by the
// city-theme-picks cron from REAL approved rows only (never invented). ──────
interface CitySpotlight { theme: string; blurb: string | null; names: string[] }

function SpotlightBanner({ page, accent }: { page: "eat" | "go" | "solo"; accent: string }) {
  const [spotlight, setSpotlight] = useState<CitySpotlight | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data: row } = await supabase
        .from("city_spotlights")
        .select("theme, blurb, trending_ids, partner_ids")
        .eq("page", page)
        .order("week_of", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!row || !active) return;

      const r = row as { theme: string; blurb: string | null; trending_ids: string[]; partner_ids: string[] };
      const [{ data: t }, { data: p }] = await Promise.all([
        r.trending_ids.length ? supabase.from("city_trending").select("name").in("id", r.trending_ids) : Promise.resolve({ data: [] }),
        r.partner_ids.length ? supabase.from("restaurant_partners").select("name").in("id", r.partner_ids) : Promise.resolve({ data: [] }),
      ]);
      const names = [...(t ?? []), ...(p ?? [])].map((row2) => (row2 as { name: string }).name);
      if (active && names.length > 0) setSpotlight({ theme: r.theme, blurb: r.blurb, names });
    })();
    return () => { active = false; };
  }, [page]);

  if (!spotlight) return null;

  return (
    <div style={{ background: `${accent}12`, border: `1px solid ${accent}33`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.16em", color: accent, marginBottom: 4 }}>✦ {spotlight.theme.toUpperCase()}</p>
      {spotlight.blurb && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#555", marginBottom: 8 }}>{spotlight.blurb}</p>}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
        {spotlight.names.map((n, i) => (
          <span key={i} style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "#444", background: "white", borderRadius: 999, padding: "4px 10px", border: `1px solid ${accent}22` }}>{n}</span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NYC BUILDING TILE — single tappable building with facade + windows
// ═══════════════════════════════════════════════════════════════════════════════
interface BuildingConfig {
  id: string;
  category?: CityCategory;
  label?: string;
  subLabel?: string;
  width: number;   // px
  height: number;  // px — varies like real NYC skyline
  wallColor: string;
  windowColor: string;
  windowLitColor: string;
  winCols: number;
  winRows: number;
  rooftop: "flat" | "setback" | "arched" | "stepped" | "tower";
  waterTower?: boolean;
  accentTop?: string;  // colored top stripe/band
  filler?: boolean;    // decorative, not clickable
}

const SKYLINE_BUILDINGS: BuildingConfig[] = [
  // Left edge filler — narrow brownstone
  {
    id: "fill-1", filler: true,
    width: 48, height: 118,
    wallColor: "#7A5438", windowColor: "#1A0A04", windowLitColor: "#F5D080",
    winCols: 2, winRows: 5, rooftop: "flat",
  },
  // EAT — wide limestone with cornice
  {
    id: "eat", category: "eat", label: "EAT", subLabel: "Eats · Cafés",
    width: 112, height: 168,
    wallColor: "#C8B89A", windowColor: "#3A2A1A", windowLitColor: "#FFDF90",
    winCols: 4, winRows: 8, rooftop: "stepped",
    waterTower: true,
    accentTop: "#B8A88A",
  },
  // Narrow filler — dark glass
  {
    id: "fill-2", filler: true,
    width: 38, height: 88,
    wallColor: "#3A4A5A", windowColor: "#0A1A2A", windowLitColor: "#A0D0FF",
    winCols: 2, winRows: 4, rooftop: "flat",
  },
  // GO — slim glass tower, tallest
  {
    id: "go", category: "go", label: "GO", subLabel: "Museums · Walks",
    width: 82, height: 214,
    wallColor: "#6A8AAA", windowColor: "#0A1A2A", windowLitColor: "#C0E8FF",
    winCols: 3, winRows: 12, rooftop: "tower",
    accentTop: "#8AAABF",
  },
  // Filler — brick mid-rise
  {
    id: "fill-3", filler: true,
    width: 56, height: 104,
    wallColor: "#8A4A3A", windowColor: "#1A0800", windowLitColor: "#FFD070",
    winCols: 2, winRows: 5, rooftop: "arched",
  },
  // SOLO — wide pre-war, medium height
  {
    id: "solo", category: "solo", label: "SOLO", subLabel: "Self-care · Peace",
    width: 128, height: 148,
    wallColor: "#D4C8B4", windowColor: "#2A1A0A", windowLitColor: "#FFE8A0",
    winCols: 5, winRows: 7, rooftop: "stepped",
    waterTower: true,
    accentTop: "#C4B8A4",
  },
  // Filler — copper/green patina
  {
    id: "fill-4", filler: true,
    width: 60, height: 134,
    wallColor: "#5A7A6A", windowColor: "#0A180A", windowLitColor: "#B0FFD0",
    winCols: 2, winRows: 6, rooftop: "arched",
  },
  // BLOOMIES FAVES — dark steel, setback design
  {
    id: "bloomies", category: "bloomies", label: "BLOOMIES", subLabel: "Member Faves",
    width: 100, height: 188,
    wallColor: "#2A3A4A", windowColor: "#050D15", windowLitColor: "#80C4FF",
    winCols: 4, winRows: 10, rooftop: "setback",
    accentTop: "#3A4A5A",
  },
  // Right edge filler — narrow brick
  {
    id: "fill-5", filler: true,
    width: 44, height: 96,
    wallColor: "#6A4A38", windowColor: "#180800", windowLitColor: "#FFCF70",
    winCols: 2, winRows: 4, rooftop: "flat",
    waterTower: true,
  },
];

function BuildingTile({
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
function BuildingLabelsPanel({ onSelect, onSwipeToMenu }: { onSelect: (c: CityCategory) => void; onSwipeToMenu: () => void }) {
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
      <style>{CSS}</style>

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

// ── Girl Gems + Girl Favorites — real restaurant_partners rows ──────────────
// Girl Gems: partners with editorial "poem" or "bloom_tips" content (hidden-gem material).
// Girl Favs: partners ranked by bloom_rating (highest-rated real spots).
interface GirlGemRow {
  id: string; name: string; neighborhood: string | null; restaurant_type: string;
  poem: string | null; bloom_tips: string[] | null; brand_color: string | null;
}
interface GirlFavRow {
  id: string; name: string; neighborhood: string | null; restaurant_type: string; bloom_rating: number | null;
}
const TYPE_EMOJI: Record<string, string> = {
  café: "☕", cafe: "☕", coffee: "☕", bar: "🍸", cocktail: "🍸",
  bakery: "🥐", fine_dining: "🍽️", casual: "🍴", restaurant: "🍴",
};
function emojiForType(t: string | null | undefined) {
  return TYPE_EMOJI[(t ?? "").toLowerCase()] ?? "✦";
}
const GEM_COLORS = ["#8B4513", "#722F37", "#1A4A1A", "#8B1A1A", "#2A4A7F", "#6A3A6A"];

// ═══════════════════════════════════════════════════════════════════════════════
// CITY MENU PANEL  (landing slide 1)
// ═══════════════════════════════════════════════════════════════════════════════
function CityMenuPanel({ onSelect, onSwipeBack }: { onSelect: (c: CityCategory) => void; onSwipeBack: () => void }) {
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

          {/* Girl Gems + Girl Favs — small corner chips, not full cards */}
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <button onClick={() => onSelect("girl_gems")} style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.4)", borderRadius: 999,
              padding: "6px 11px 6px 8px", cursor: "pointer", WebkitTapHighlightColor: "transparent",
            }}>
              <span style={{ fontSize: 12 }}>💎</span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>GIRL GEMS</span>
            </button>
            <button onClick={() => onSelect("girl_favs")} style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.4)", borderRadius: 999,
              padding: "6px 11px 6px 8px", cursor: "pointer", WebkitTapHighlightColor: "transparent",
            }}>
              <span style={{ fontSize: 12 }}>💗</span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>GIRL FAVS</span>
            </button>
          </div>
          </div>{/* end column wrapper */}
        </div>{/* end header row */}

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
  // City Guide (slide 1) is the landing — the building-signs scroll (slide 0)
  // is the secondary "SIGNS" view, reached by swiping or tapping the toggle.
  const [slide, setSlide] = useState(1);
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

// ── Partner profiles with menu templates ─────────────────────────────────────
type RestaurantType = "fine_dining" | "café" | "bar" | "bakery" | "casual";

interface EatsPartner {
  id: number;
  slug: string;
  name: string;
  type: RestaurantType;
  hood: string;
  tagline: string;
  tags: string[];
  saves: number;
  rating: string;
  priceRange: string;
  heroColor: string;
  coverUrl: string | null;
  accentColor: string;
  textColor: string;
  menuHighlights: { item: string; price: string; note?: string }[];
  bloomieNote: string;
  // Profile (storefront) extras
  lovedBy: number;          // "LOVED BY N WOMEN"
  poem: string;             // handwritten description under the name
  polaroidCaption: string;  // caption under hero polaroid
  hostNote: { from: string; text: string };
  about: string;
  tips: string[];           // pink sticky note bloom tips
  girlFavorites: { item: string; note: string; tone: string }[];
  reviews: { name: string; text: string; ago: string }[];
  hours: string;
  instagram: string;
  visited: boolean;
}

function filterEatsPartners(partners: EatsPartner[], filter: string): EatsPartner[] {
  if (filter === "Tonight") return partners;
  const needle = filter.toLowerCase();
  return partners.filter(p =>
    p.tags.some(tag => tag.toLowerCase().includes(needle)) ||
    p.type.replace("_", " ").includes(needle) ||
    p.hood.toLowerCase().includes(needle)
  );
}

// Real partner row from restaurant_partners table
interface RealPartnerRow {
  id: string; slug: string | null; name: string; restaurant_type: string; neighborhood: string | null;
  tagline: string | null; about: string | null; bloom_notes: number; bloom_rating: number;
  price_range: string | null; brand_color: string; cover_url: string | null;
  poem: string | null; polaroid_caption: string | null; host_note: string | null;
  bloom_tips: string[] | null; girl_favorites: {item:string;description:string}[] | null;
  reviews: {author:string;text:string;rating:number}[] | null; instagram: string | null;
  hours: Record<string,string> | null; loved_by: string[] | null; visited_by: string[];
  photo_urls: string[];
}

function realToEatsPartner(r: RealPartnerRow, idx: number): EatsPartner {
  const typeMap: Record<string, RestaurantType> = {
    café: "café", cafe: "café", coffee: "café", bar: "bar", cocktail: "bar",
    bakery: "bakery", casual: "casual", fine_dining: "fine_dining", restaurant: "casual",
  };
  const heroColors = ["#C84A18","#3A6A38","#5A1A0A","#1A3A6A","#6A1A5A","#3A1A6A"];
  const heroColor = r.brand_color || heroColors[idx % heroColors.length];
  const slug = r.slug || toSlug(r.name);
  return {
    id: idx + 100,
    slug,
    name: r.name,
    type: typeMap[r.restaurant_type?.toLowerCase() ?? ""] ?? "casual",
    hood: r.neighborhood ?? "NYC",
    tagline: r.tagline ?? "",
    tags: [r.restaurant_type ?? "Dining"],
    saves: r.loved_by?.length ?? 0,
    rating: r.bloom_rating ? String(r.bloom_rating.toFixed(1)) : "—",
    priceRange: r.price_range ?? "$",
    heroColor,
    coverUrl: r.cover_url ?? r.photo_urls?.[0] ?? null,
    accentColor: heroColor,
    textColor: "#FFF",
    menuHighlights: (r.girl_favorites ?? []).slice(0, 3).map(g => ({ item: g.item, price: "" })),
    bloomieNote: r.bloom_tips?.[0] ?? r.polaroid_caption ?? "",
    lovedBy: r.loved_by?.length ?? 0,
    poem: r.poem ?? r.tagline ?? "",
    polaroidCaption: r.polaroid_caption ?? "",
    hostNote: r.host_note ? { from: "BloomBay", text: r.host_note } : { from: "BloomBay", text: r.about ?? "" },
    about: r.about ?? "",
    tips: r.bloom_tips ?? [],
    girlFavorites: (r.girl_favorites ?? []).map(g => ({ item: g.item, note: g.description ?? "", tone: "#FFE8D0" })),
    reviews: (r.reviews ?? []).map(rv => ({ name: rv.author, text: rv.text, ago: "recently" })),
    hours: r.hours ? Object.values(r.hours)[0] ?? "Daily" : "Daily",
    instagram: r.instagram ?? "",
    visited: (r.visited_by ?? []).length > 0,
  };
}

function EatsPage({ onBack }: { onBack: () => void }) {
  const [activeFilter, setActiveFilter] = useState("Tonight");
  const [profileId, setProfileId] = useState<number | null>(null);
  const [noteCounts, setNoteCounts] = useState<Record<string, number>>({});
  const [realPartners, setRealPartners] = useState<EatsPartner[]>([]);
  const [reserveTarget, setReserveTarget] = useState<{ id: string; name: string } | null>(null);
  const [hood, setHood] = useState<string | null>(null);
  useEffect(() => { setHood(getMyNeighborhood()); }, []);

  useEffect(() => {
    // Fetch real restaurant partners from DB
    import("@/lib/supabase/client").then(({ createClient }) => {
      createClient()
        .from("restaurant_partners")
        .select("*")
        .order("bloom_notes", { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data && data.length > 0) {
            const mapped = (data as RealPartnerRow[]).map((r, i) => realToEatsPartner(r, i));
            setRealPartners(mapped);
            getNoteCountsByPlace(mapped.map(p => p.slug)).then(setNoteCounts).catch(() => {});
          }
        });
    });
  }, []);

  const filteredByType = filterEatsPartners(realPartners, activeFilter);
  const allPartners = hood ? filteredByType.filter(p => isNearby(hood, p.hood)) : filteredByType;
  const openPartner = filteredByType.find(p => p.id === profileId);
  if (openPartner) return <PartnerStorefront partner={openPartner} onBack={() => setProfileId(null)} />;

  return (
    <div style={{
      backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
      backgroundSize: "200px 200px, 80px 80px",
      background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 30%, #FFF5F0 60%, #FFF0F8 100%)", minHeight: "100vh", paddingBottom: 120,
    }}>
      {/* Compact header */}
      <div style={{ position: "relative", height: 88, overflow: "hidden", backgroundImage: `${DARK_GRAIN}, linear-gradient(135deg, #FF9060 0%, #FFB080 55%, #FF8050 100%)`, backgroundSize: "160px 160px, 100% 100%" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)" }}/>
        <BackBtn onBack={onBack}/>
        <div style={{ position: "absolute", bottom: 14, left: 18, display: "flex", alignItems: "baseline", gap: 10 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, textShadow: "0 2px 14px rgba(200,80,30,0.5)" }}>Tonight&apos;s Table</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.65)" }}>EATS · NYC</p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, #FF9B7088, ${PINK}66, #FF9B7088, transparent)` }}/>
      </div>

      {/* Filters */}
      <div style={{ backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: "#FFF5F0", paddingBottom: 12 }}>
        <div style={{ padding: "10px 16px 8px" }}>
          <NeighborhoodPicker value={hood} onChange={setHood} />
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 16px", scrollbarWidth: "none" as const }}>
          {EATS_FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 999, border: `1.5px solid ${activeFilter === f ? "#FF9B70" : "rgba(180,100,60,0.25)"}`, background: activeFilter === f ? "#FF9B70" : "rgba(255,255,255,0.6)", color: activeFilter === f ? "white" : "rgba(160,80,40,0.8)", fontSize: "9px", fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ padding: "14px 14px 0" }}>
        <SpotlightBanner page="eat" accent="#FF9B70" />

        {/* Featured grid — first 3 real partners */}
        {allPartners.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {/* Big left card */}
            <div onClick={() => setProfileId(allPartners[0].id)} style={{ gridRow: "span 2", backgroundImage: allPartners[0].coverUrl ? `url(${allPartners[0].coverUrl})` : PAPER_TEX, backgroundSize: allPartners[0].coverUrl ? "cover" : "200px 200px", backgroundPosition: "center", backgroundColor: allPartners[0].heroColor, borderRadius: 18, minHeight: 252, position: "relative", overflow: "hidden", boxShadow: "0 6px 24px rgba(200,80,30,0.25)", cursor: "pointer" }}>
              {!allPartners[0].coverUrl && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 30%, rgba(255,180,100,0.3) 0%, transparent 70%)" }}/>}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.6) 100%)" }}/>
              <div style={{ position: "absolute", top: 13, right: 11, background: "rgba(255,255,255,0.22)", borderRadius: 999, padding: "3px 8px" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "white" }}>{allPartners[0].saves} saved</span>
              </div>
              <div style={{ position: "absolute", bottom: 15, left: 12, right: 12 }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 19, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.4)", marginBottom: 3 }}>{allPartners[0].name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}>{allPartners[0].hood.toUpperCase()}</p>
              </div>
            </div>
            {/* Top-right */}
            {allPartners[1] && (
              <div onClick={() => setProfileId(allPartners[1].id)} style={{ backgroundImage: allPartners[1].coverUrl ? `url(${allPartners[1].coverUrl})` : PAPER_TEX, backgroundSize: allPartners[1].coverUrl ? "cover" : "200px 200px", backgroundPosition: "center", backgroundColor: allPartners[1].heroColor, borderRadius: 18, minHeight: 118, position: "relative", overflow: "hidden", boxShadow: "0 4px 16px rgba(200,80,30,0.18)", cursor: "pointer" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 100%)" }}/>
                <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1 }}>{allPartners[1].name}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", marginTop: 2 }}>{allPartners[1].hood.toUpperCase()}</p>
                </div>
              </div>
            )}
            {/* Bottom-right */}
            {allPartners[2] && (
              <div onClick={() => setProfileId(allPartners[2].id)} style={{ backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`, backgroundSize: "200px 200px, 80px 80px", backgroundColor: PAPER, borderRadius: 18, minHeight: 118, padding: "12px 13px 10px", boxShadow: "0 4px 16px rgba(0,0,0,0.09)", cursor: "pointer" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.1, marginBottom: 2 }}>{allPartners[2].name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#aaa", letterSpacing: "0.08em" }}>{allPartners[2].hood.toUpperCase()}</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#BB7788", marginTop: 6, lineHeight: 1.4 }}>{allPartners[2].bloomieNote}</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 20px 20px", color: "rgba(160,80,40,0.45)" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15 }}>
              {realPartners.length === 0 ? "No partner spots yet" : hood ? `Nothing near ${hood} yet` : `No spots for “${activeFilter}”`}
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, marginTop: 4, letterSpacing: "0.1em" }}>
              {realPartners.length === 0 ? "CHECK BACK SOON" : hood ? "TRY ALL OF NYC" : "TRY ANOTHER FILTER"}
            </p>
          </div>
        )}

        {/* Spot grid — partners 3–9 */}
        {allPartners.length > 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 14 }}>
            {allPartners.slice(3, 9).map(p => (
              <div key={p.id} onClick={() => setProfileId(p.id)} style={{ backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`, backgroundSize: "200px 200px, 80px 80px", backgroundColor: "#FAF0E8", borderRadius: 16, padding: "13px 13px 11px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", cursor: "pointer" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 700, fontStyle: "italic", color: DARK, lineHeight: 1.2, marginBottom: 4 }}>{p.name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "#aaa", letterSpacing: "0.06em" }}>{p.hood.toUpperCase()}</p>
                <div style={{ marginTop: 9, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#bbb" }}>{p.saves} saved</span>
                  <button
                    type="button"
                    disabled
                    title="Saving spots isn't available yet"
                    onClick={e => e.stopPropagation()}
                    style={{ background: "none", border: "none", cursor: "not-allowed", padding: 2, opacity: 0.45 }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF9B70" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GO-TO LATELY — dynamic from real partners */}
        {allPartners.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`, backgroundSize: "200px 200px, 80px 80px", backgroundColor: "#FEF3E8", borderRadius: 14, padding: "14px 13px", transform: "rotate(-0.4deg)", boxShadow: "2px 4px 16px rgba(0,0,0,0.18)" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "#FF9B70", marginBottom: 9 }}>GO-TO LATELY</p>
              {allPartners.slice(0, 5).map((p, i) => (
                <div key={p.id} onClick={() => setProfileId(p.id)} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6, cursor: "pointer" }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#FF9B70" }}>{i + 1}.</span>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "#2a1a10" }}>{p.name}</span>
                </div>
              ))}
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#FF9B70", marginTop: 6, opacity: 0.75 }}>girls night →</p>
            </div>
          </div>
        )}

        {/* ── PARTNER PROFILES ── */}
        <div style={{ paddingTop: 8 }}>
          <div style={{ padding: "0 14px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF9B70" }}/>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "#FF9B70" }}>BLOOMIES PARTNERS</p>
          </div>
          {allPartners.map(p => (
            <EatsPartnerCard key={p.id} partner={p} noteCount={noteCounts[p.slug] ?? 0} onOpen={() => setProfileId(p.id)} onReserve={() => setReserveTarget({ id: String(p.id), name: p.name })} />
          ))}
        </div>
      </div>

      {reserveTarget && (
        <ReserveTableSheet
          restaurantId={reserveTarget.id}
          restaurantName={reserveTarget.name}
          onClose={() => setReserveTarget(null)}
        />
      )}
    </div>
  );
}

function EatsPartnerCard({ partner: p, noteCount, onOpen, onReserve }: { partner: EatsPartner; noteCount: number; onOpen: () => void; onReserve: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const typeLabel: Record<RestaurantType, string> = {
    fine_dining: "FINE DINING", café: "CAFÉ", bar: "BAR", bakery: "BAKERY", casual: "CASUAL",
  };

  return (
    <div style={{
      marginBottom: 14, borderRadius: 22, overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
    }}>
      {/* Hero band — tap to open storefront */}
      <div onClick={onOpen} style={{
        position: "relative", height: 110, cursor: "pointer",
        backgroundImage: `${DARK_GRAIN}`,
        backgroundSize: "160px 160px",
        backgroundColor: p.heroColor,
      }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 50%, ${p.accentColor}55 0%, transparent 65%)` }}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)" }}/>
        {/* Type badge */}
        <div style={{ position: "absolute", top: 12, left: 14, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "3px 10px" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em" }}>{typeLabel[p.type]}</span>
        </div>
        {/* Save — not wired yet */}
        <button
          type="button"
          disabled
          title="Saving spots isn't available yet"
          onClick={(e) => e.stopPropagation()}
          style={{ position: "absolute", top: 10, right: 78, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "not-allowed", opacity: 0.45 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9B70" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
        {/* Pinned bloom notes stack — only renders when real notes exist */}
        {noteCount > 0 && (
          <div style={{ position: "absolute", top: 14, right: 12, width: 56, height: 54, pointerEvents: "none" }}>
            {/* 3rd paper (5+ notes) */}
            {noteCount >= 5 && <div style={{ position: "absolute", inset: "6px -1px 0 4px", background: "#EED8AA", borderRadius: 3, transform: "rotate(7deg)", boxShadow: "0 2px 7px rgba(0,0,0,0.28)" }}/>}
            {/* 2nd paper (2+ notes) */}
            {noteCount >= 2 && <div style={{ position: "absolute", inset: "3px 1px 0 2px", background: "#F6E8C8", borderRadius: 3, transform: "rotate(-4deg)", boxShadow: "0 2px 7px rgba(0,0,0,0.24)" }}/>}
            {/* front note — always */}
            <div style={{ position: "absolute", inset: 0, background: "#FFF8E6", borderRadius: 3, transform: "rotate(1.5deg)", boxShadow: "0 4px 14px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 900, fontStyle: "italic", color: "#C0185F", lineHeight: 1 }}>{noteCount}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "5px", fontWeight: 800, letterSpacing: "0.12em", color: "#9A8A6A", marginTop: 2 }}>NOTES</p>
            </div>
            {/* push pin */}
            <PushPin color="pink" size={12} style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}/>
          </div>
        )}
        {/* Name */}
        <div style={{ position: "absolute", bottom: 10, left: 14, right: 46 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>{p.name}</p>
        </div>
        {/* Visit hint */}
        <div style={{ position: "absolute", bottom: 10, right: 12, background: "rgba(255,255,255,0.16)", backdropFilter: "blur(6px)", borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.1em" }}>VISIT</span>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      {/* Info strip */}
      <div style={{ backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`, backgroundSize: "200px 200px, 80px 80px", backgroundColor: "#FFFAF6", padding: "12px 14px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#999", letterSpacing: "0.08em" }}>{p.hood.toUpperCase()}</span>
          <span style={{ color: "#ddd" }}>·</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "#bbb" }}>{p.priceRange}</span>
          <span style={{ color: "#ddd" }}>·</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#FF9B70" }}>★ {p.rating}</span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "#bbb" }}>{p.saves} saves</span>
        </div>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#7A5A40", marginBottom: 8, lineHeight: 1.3 }}>"{p.tagline}"</p>
        {/* Tags */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const, marginBottom: 10 }}>
          {p.tags.map(tag => (
            <span key={tag} style={{ background: "rgba(255,155,112,0.12)", border: "1px solid rgba(255,155,112,0.22)", borderRadius: 999, padding: "3px 9px", fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: "#CC7040", letterSpacing: "0.04em" }}>{tag}</span>
          ))}
        </div>

        {/* Bloomie note */}
        <div style={{ background: "rgba(255,155,112,0.07)", borderLeft: `3px solid ${p.accentColor}`, padding: "8px 10px", marginBottom: 10, borderRadius: "0 8px 8px 0" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#5A3A20", lineHeight: 1.4 }}>{p.bloomieNote}</p>
        </div>

        {/* Reserve button */}
        <div style={{ marginBottom: 10 }}>
          <button
            onClick={onReserve}
            style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: PINK, background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.2)", borderRadius: 999, padding: "6px 14px", cursor: "pointer" }}
          >
            Reserve ✦
          </button>
        </div>

        {/* Menu toggle */}
        <button onClick={() => setMenuOpen(o => !o)} style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 0 12px",
          borderTop: "1px solid rgba(255,155,112,0.12)",
        }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em", color: "#FF9B70" }}>MENU HIGHLIGHTS</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF9B70" strokeWidth="2.5" strokeLinecap="round" style={{ transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {/* Menu template — expandable */}
        {menuOpen && <MenuTemplate partner={p} />}
      </div>
    </div>
  );
}

function MenuTemplate({ partner: p }: { partner: EatsPartner }) {
  const isFine    = p.type === "fine_dining";
  const isCafé    = p.type === "café";
  const isBakery  = p.type === "bakery";

  return (
    <div style={{
      marginBottom: 14, borderRadius: 14, overflow: "hidden",
      ...(isFine   ? { backgroundImage: `${DARK_GRAIN}`, backgroundSize: "160px 160px", backgroundColor: p.heroColor } : {}),
      ...(isCafé   ? { background: "#F6FAF2", border: "1px solid rgba(138,200,120,0.2)" } : {}),
      ...(isBakery ? { background: "#FEF8F0", border: "1px solid rgba(200,120,60,0.2)" } : {}),
      ...(!isFine && !isCafé && !isBakery ? { backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: "#FFFAF4", border: "1px solid rgba(255,155,112,0.15)" } : {}),
      padding: "14px",
    }}>
      {/* Menu header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <p style={{ fontFamily: isFine ? "var(--font-playfair)" : "var(--font-jost)", fontStyle: isFine ? "italic" : "normal", fontSize: isFine ? 16 : 11, fontWeight: isFine ? 700 : 800, color: isFine ? "rgba(255,255,255,0.9)" : "#3A2010", letterSpacing: isFine ? "0" : "0.08em" }}>{p.name}</p>
          {isFine && <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginTop: 2 }}>MENU</p>}
        </div>
        <div style={{ width: 26, height: 1, background: isFine ? "rgba(255,255,255,0.3)" : "rgba(180,90,40,0.3)" }}/>
      </div>
      {/* Items */}
      {p.menuHighlights.map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          padding: "9px 0",
          borderBottom: i < p.menuHighlights.length - 1 ? `1px solid ${isFine ? "rgba(255,255,255,0.08)" : "rgba(180,90,40,0.1)"}` : "none",
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: isFine ? "var(--font-playfair)" : "var(--font-jost)", fontStyle: isFine ? "italic" : "normal", fontSize: 12, fontWeight: isFine ? 600 : 700, color: isFine ? "rgba(255,255,255,0.88)" : "#2A1A10", lineHeight: 1.2 }}>{item.item}</p>
            {item.note && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: isFine ? `${p.accentColor}bb` : "#AA8060", marginTop: 2 }}>{item.note}</p>}
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: isFine ? p.accentColor : "#FF9B70", marginLeft: 12, flexShrink: 0 }}>{item.price}</p>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARTNER STOREFRONT — scrapbook profile: photos, reviews, menu, atmosphere
// ═══════════════════════════════════════════════════════════════════════════════
function Tape({ rotate = 0, top = -8, left = "50%" }: { rotate?: number; top?: number; left?: string }) {
  return (
    <div style={{
      position: "absolute", top, left, transform: `translateX(-50%) rotate(${rotate}deg)`,
      width: 54, height: 16, background: "rgba(255,248,230,0.55)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)", zIndex: 3,
    }}/>
  );
}

function PaperCard({ children, rotate = 0, style = {} }: { children: React.ReactNode; rotate?: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      position: "relative",
      backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px",
      backgroundColor: "#FBF6EE",
      borderRadius: 8, padding: "14px",
      boxShadow: "0 4px 18px rgba(0,0,0,0.35)",
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      ...style,
    }}>
      {children}
    </div>
  );
}

function StarRow({ color = "#E8336E", size = 9 }: { color?: string; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[0,1,2,3,4].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
      ))}
    </span>
  );
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function PartnerStorefront({ partner: p, onBack, isOwner = false }: { partner: EatsPartner; onBack: () => void; isOwner?: boolean }) {
  // Brand palette derived from the partner
  const BRAND  = p.heroColor;
  const ACCENT = p.accentColor;
  const [placeGift, setPlaceGift] = useState<{ units: number; myKind: GiftKind | null }>({
    units: 0,
    myKind: null,
  });

  useEffect(() => {
    void getPlaceGiftsForUser([p.slug]).then((map) => {
      const fl = map[p.slug] ?? { units: 0, myKind: null };
      setPlaceGift(fl);
    });
  }, [p.slug]);

  async function onGivePlaceGift(kind: GiftKind) {
    const prev = placeGift;
    const prevGave = prev.myKind ? unitsForKind(prev.myKind) : 0;
    const nextUnits = unitsForKind(kind);
    if (prev.myKind === kind) {
      setPlaceGift({ units: Math.max(0, prev.units - prevGave), myKind: null });
    } else {
      setPlaceGift({
        units: Math.max(0, prev.units - prevGave + nextUnits),
        myKind: kind,
      });
    }
    const result = await givePlaceGift(p.slug, kind);
    if (!result.gave) {
      setPlaceGift({ units: Math.max(0, prev.units - prevGave), myKind: null });
    }
  }

  async function onTakeBackPlaceGift() {
    const prev = placeGift;
    const prevGave = prev.myKind ? unitsForKind(prev.myKind) : 0;
    setPlaceGift({ units: Math.max(0, prev.units - prevGave), myKind: null });
    await takeBackPlaceGift(p.slug);
  }

  // Toned "photo" placeholder — gradient tile standing in for real imagery
  function PhotoTile({ tone, h = 70, br = 6 }: { tone: string; h?: number; br?: number }) {
    return (
      <div style={{
        height: h, borderRadius: br, flexShrink: 0,
        background: `linear-gradient(135deg, ${tone} 0%, ${BRAND}33 60%, ${BRAND}66 100%)`,
        backgroundBlendMode: "multiply",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
      }}/>
    );
  }

  return (
    <div style={{
      backgroundImage: `${DARK_GRAIN}`,
      backgroundSize: "160px 160px",
      backgroundColor: "#100C0A",
      minHeight: "100vh", paddingBottom: 120,
      position: "relative",
    }}>
      {/* subtle brand glow */}
      <div style={{ position: "fixed", top: "10%", left: "20%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${BRAND}40 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }}/>

      <BackBtn onBack={onBack} label="EATS"/>

      {/* Edit page button — for partner owners */}
      {isOwner && (
        <Link href={`/member/city/partners/${toSlug(p.name)}/edit`} style={{
          position: "fixed", top: "calc(env(safe-area-inset-top,0px) + 58px)", right: 14, zIndex: 50,
          background: "rgba(255,31,125,0.9)", color: "white", borderRadius: 999,
          padding: "6px 14px", fontFamily: "var(--font-jost)", fontSize: "8px",
          fontWeight: 800, letterSpacing: "0.14em", textDecoration: "none",
          backdropFilter: "blur(10px)", boxShadow: "0 4px 14px rgba(255,31,125,0.5)",
        }}>
          EDIT PAGE ✏
        </Link>
      )}

      <div style={{ position: "relative", padding: "calc(env(safe-area-inset-top,0px) + 100px) 14px 0", maxWidth: 480, margin: "0 auto" }}>

        {/* ── Header strip: BLOOMBAY · BLOOM APPROVED · badge ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "0 4px" }}>
          <div style={{ background: BRAND, borderRadius: 4, padding: "4px 10px" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.2em" }}>BLOOMBAY</span>
          </div>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#F6C8D8", transform: "rotate(-3deg)" }}>bloom approved ♡</p>
          {/* Partner badge */}
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#FBF6EE", display: "flex", alignItems: "center", justifyContent: "center", border: `2px dashed ${BRAND}`, boxShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 900, fontStyle: "italic", color: BRAND }}>{p.name.charAt(0)}</span>
          </div>
        </div>

        {/* ── Hero collage: title card + polaroid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 10, marginBottom: 12 }}>
          {/* Title card */}
          <PaperCard rotate={-0.8} style={{ padding: "18px 14px" }}>
            <Tape rotate={-4} left="30%"/>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,7.5vw,34px)", fontWeight: 900, fontStyle: "italic", color: BRAND, lineHeight: 1.0, marginBottom: 6 }}>{p.name}</h1>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: ACCENT, marginBottom: 10 }}>{p.hood}, NYC</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#5A4A3A", lineHeight: 1.4, marginBottom: 10 }}>{p.poem} <span style={{ color: "#E8336E" }}>♡</span></p>
            <FlowerButton
              size="sm"
              units={placeGift.units}
              myKind={placeGift.myKind}
              onGive={onGivePlaceGift}
              onTakeBack={onTakeBackPlaceGift}
            />
          </PaperCard>

          {/* Polaroid + notes column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Polaroid */}
            <div style={{ background: "#FDFBF6", padding: "7px 7px 22px", borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.45)", transform: "rotate(1.5deg)", position: "relative" }}>
              <Tape rotate={3}/>
              <div style={{ height: 110, borderRadius: 2, background: `linear-gradient(150deg, ${ACCENT}AA 0%, ${BRAND} 70%)`, position: "relative", overflow: "hidden" }}>
                {/* simple table-scene suggestion */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 34, background: "rgba(255,255,255,0.18)" }}/>
                <div style={{ position: "absolute", bottom: 22, left: "28%", width: 30, height: 18, borderRadius: "0 0 14px 14px", background: "rgba(255,255,255,0.85)" }}/>
                <div style={{ position: "absolute", bottom: 26, right: "22%", width: 26, height: 12, borderRadius: 8, background: "rgba(255,240,210,0.9)" }}/>
                <div style={{ position: "absolute", top: 10, left: "15%", width: 40, height: 52, borderRadius: "50% 50% 0 0", background: "rgba(255,255,255,0.22)" }}/>
              </div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10.5, color: "#8A7A6A", textAlign: "center", marginTop: 5, lineHeight: 1 }}>{p.polaroidCaption}</p>
            </div>
            {/* Bloom notes — tap to see all */}
            <Link href={`/member/city/bloom-notes/${p.slug}`} style={{ textDecoration: "none" }}>
              <PaperCard rotate={1} style={{ padding: "10px 12px", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.18em", color: "#C0185F", marginBottom: 5 }}>BLOOM NOTES</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#5A4A3A", lineHeight: 1.4 }}>What women left behind here ✿</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "#C0185F", marginTop: 6 }}>READ THEM →</p>
              </PaperCard>
            </Link>
          </div>
        </div>

        {/* ── Rated strip + host note ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 10, marginBottom: 12 }}>
          <PaperCard rotate={0.6} style={{ padding: "13px 14px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: BRAND, marginBottom: 6 }}>BLOOMIES RATED</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px, 7.5vw, 30px)", fontWeight: 900, color: "#2A1A10", lineHeight: 1 }}>{p.rating}</p>
              <StarRow/>
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: "#9A8A7A", letterSpacing: "0.08em", marginTop: 6 }}>LOVED BY {p.lovedBy} WOMEN</p>
          </PaperCard>

          <PaperCard rotate={-0.5} style={{ padding: "13px 14px" }}>
            <Tape rotate={-5} left="70%"/>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: BRAND, marginBottom: 7 }}>A NOTE FROM {p.hostNote.from.toUpperCase()}</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#4A3A2A", lineHeight: 1.45 }}>{p.hostNote.text} <span style={{ color: "#E8336E" }}>♡</span></p>
          </PaperCard>
        </div>

        {/* ── Girl favorites + about/tips column ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 10, marginBottom: 12 }}>
          {/* Girl favorites */}
          <PaperCard rotate={-0.4}>
            <div style={{ display: "inline-flex", background: BRAND, borderRadius: 4, padding: "3px 9px", marginBottom: 12 }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.14em" }}>GIRL FAVORITES</span>
            </div>
            {p.girlFavorites.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: i < p.girlFavorites.length - 1 ? 11 : 0 }}>
                <div style={{ width: 38 }}><PhotoTile tone={f.tone} h={38} br={5}/></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "#2A1A10", letterSpacing: "0.04em", lineHeight: 1.2 }}>{f.item.toUpperCase()}</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11.5, color: ACCENT, marginTop: 1 }}>{f.note}</p>
                </div>
                <span style={{ color: "#E8336E", fontSize: 9 }}>♡</span>
              </div>
            ))}
          </PaperCard>

          {/* About + tips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <PaperCard rotate={0.7} style={{ padding: "12px 13px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: BRAND, marginBottom: 6 }}>✦ ABOUT {p.name.split(" ")[0].toUpperCase()}</p>
              {/* storefront illustration suggestion */}
              <div style={{ height: 54, borderRadius: 5, marginBottom: 7, background: `linear-gradient(180deg, ${BRAND}22 0%, ${BRAND}44 100%)`, position: "relative", overflow: "hidden", border: `1px solid ${BRAND}33` }}>
                <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", top: 14, border: `2px solid ${BRAND}88`, borderBottom: "none", borderRadius: "6px 6px 0 0", background: "rgba(255,255,255,0.4)" }}/>
                <div style={{ position: "absolute", top: 8, left: "14%", right: "14%", height: 7, background: BRAND, borderRadius: 2 }}/>
              </div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "#6A5A4A", lineHeight: 1.55 }}>{p.about}</p>
            </PaperCard>

            {/* Pink bloom tips */}
            {p.tips.map((tip, i) => (
              <div key={i} style={{
                background: i === 0 ? "#F9C8D8" : "#F6B8CC",
                borderRadius: 6, padding: "10px 12px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                transform: `rotate(${i === 0 ? -1.2 : 1.4}deg)`,
                position: "relative",
              }}>
                <Tape rotate={i === 0 ? 4 : -3}/>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.18em", color: "#C0185F", marginBottom: 4 }}>BLOOM TIP</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#7A1A40", lineHeight: 1.35 }}>{tip} ♡</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── More photos + passport ── */}
        <div style={{ marginBottom: 12 }}>
          <PaperCard rotate={0.3} style={{ padding: "12px 13px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
              <div style={{ display: "inline-flex", background: BRAND, borderRadius: 4, padding: "3px 9px" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.14em" }}>MORE FROM {p.name.split(" ")[0].toUpperCase()}</span>
              </div>
              <span style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#B0A090" }}>the atmosphere ✦</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7 }}>
              {[`${ACCENT}88`, `${BRAND}55`, `${ACCENT}55`, `${BRAND}77`].map((tone, i) => (
                <PhotoTile key={i} tone={tone} h={64} br={5}/>
              ))}
            </div>
          </PaperCard>
        </div>

        {/* ── Bloom passport stamp ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <PaperCard rotate={-0.6} style={{ padding: "14px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "#7A6A5A", marginBottom: 9 }}>BLOOM PASSPORT</p>
            {p.visited ? (
              <>
                <div style={{ display: "inline-block", border: "2.5px solid #C0185F", borderRadius: 6, padding: "5px 14px", transform: "rotate(-6deg)", marginBottom: 7 }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 900, color: "#C0185F", letterSpacing: "0.18em" }}>VISITED</span>
                </div>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#9A8A7A" }}>added to your bloom passport</p>
              </>
            ) : (
              <>
                <div style={{ display: "inline-block", border: "2px dashed #B0A090", borderRadius: 6, padding: "5px 14px", transform: "rotate(-4deg)", marginBottom: 7 }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, color: "#B0A090", letterSpacing: "0.16em" }}>NOT YET</span>
                </div>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#9A8A7A" }}>stamp it when you go ✈</p>
              </>
            )}
          </PaperCard>

          {/* Menu peek */}
          <PaperCard rotate={0.8} style={{ padding: "13px 14px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: BRAND, marginBottom: 8 }}>FROM THE MENU</p>
            {p.menuHighlights.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: i < p.menuHighlights.length - 1 ? 6 : 0 }}>
                <span style={{ fontFamily: "var(--font-playfair)", fontSize: 11, fontStyle: "italic", color: "#3A2A1A", lineHeight: 1.2 }}>{m.item}</span>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800, color: ACCENT, marginLeft: 8, flexShrink: 0 }}>{m.price}</span>
              </div>
            ))}
          </PaperCard>
        </div>

        {/* ── Bloom notes board — read them all, leave one ── */}
        <BloomNotesBoard placeSlug={p.slug} placeName={p.name} brand={BRAND} accent={ACCENT} />

        {/* ── Quick info + save CTA ── */}
        <div style={{
          backgroundImage: `${DARK_GRAIN}`, backgroundSize: "160px 160px",
          backgroundColor: BRAND, borderRadius: 16, padding: "16px",
          boxShadow: `0 10px 36px ${BRAND}88`,
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>QUICK INFO</p>
          {[
            { icon: "📍", text: `${p.hood}, NYC` },
            { icon: "🕐", text: p.hours },
            { icon: "✦",  text: p.instagram },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <span style={{ fontSize: 10 }}>{row.icon}</span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.88)" }}>{row.text}</span>
            </div>
          ))}
          <button type="button" disabled title="Saving to My World isn't available yet" style={{
            marginTop: 8, width: "100%",
            background: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "12px 0",
            fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800,
            letterSpacing: "0.12em", cursor: "not-allowed",
          }}>
            SAVE TO MY WORLD — COMING SOON
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOLO PAGE  —  morning light, sage & linen, introspective
// ═══════════════════════════════════════════════════════════════════════════════
function SoloPage({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<TrendingItem[] | null>(null); // null = loading
  const [mood, setMood] = useState("All");
  const [openItem, setOpenItem] = useState<TrendingItem | null>(null);
  const [hood, setHood] = useState<string | null>(null);
  useEffect(() => { setHood(getMyNeighborhood()); }, []);

  useEffect(() => {
    createClient()
      .from("city_trending")
      .select("id,name,category,description,neighborhood,badge,image_url,save_count")
      .eq("status", "approved")
      .order("rank_order", { ascending: true })
      .limit(30)
      .then(({ data }) => setItems((data as TrendingItem[] | null) ?? []));
  }, []);

  const byMood = (items ?? []).filter(i => mood === "All" || i.category === mood);
  const moods = ["All", ...Array.from(new Set((items ?? []).map(i => i.category)))];
  const shown = hood ? byMood.filter(i => isNearby(hood, i.neighborhood)) : byMood;

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
        <div style={{ marginBottom: 14 }}>
          <NeighborhoodPicker value={hood} onChange={setHood} />
        </div>

        <SpotlightBanner page="solo" accent="#7A9A6C" />

        {/* Mood chips — real categories from what's actually approved */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "#9A7A6A", marginBottom: 8 }}>WHAT MOOD ARE YOU IN?</p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" as const }}>
            {moods.map(m => (
              <button key={m} onClick={() => setMood(m)} style={{
                padding: "6px 14px", borderRadius: 999,
                border: `1.5px solid ${mood === m ? "#7A9A6C" : "rgba(120,90,80,0.2)"}`,
                background: mood === m ? "#7A9A6C" : "transparent",
                color: mood === m ? "white" : "#8A6A5A",
                fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700,
                letterSpacing: "0.05em", cursor: "pointer", textTransform: "capitalize" as const,
              }}>{m}</button>
            ))}
          </div>
        </div>

        {/* Activity cards — real city_trending picks, curated via the city-intelligence cron */}
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "#9A7A6A", marginBottom: 10 }}>MADE FOR SOLO TIME</p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 16 }}>
          {items === null ? (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#9A8A7A", textAlign: "center" as const, padding: "20px 0" }}>Loading…</p>
          ) : shown.length === 0 ? (
            <div style={{ textAlign: "center" as const, padding: "32px 20px", color: "#9A8A7A" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15 }}>{hood ? `Nothing near ${hood} yet` : "Nothing here yet"}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, marginTop: 4, letterSpacing: "0.1em" }}>{hood ? "TRY ALL OF NYC" : "CHECK BACK SOON"}</p>
            </div>
          ) : shown.map((act, i) => (
            <div key={act.id} onClick={() => setOpenItem(act)} style={{
              backgroundImage: act.image_url ? undefined : `${PAPER_TEX}, ${LINEN_TEX}`,
              backgroundSize: "200px 200px, 80px 80px",
              backgroundColor: "#F4EFE4",
              borderRadius: 18, overflow: "hidden",
              boxShadow: "0 3px 16px rgba(80,60,40,0.1), inset 0 1px 0 rgba(255,255,255,0.85)",
              display: "flex", gap: 0, cursor: "pointer",
              animation: `soloFade 0.5s ease-out both`,
              animationDelay: `${i * 0.07}s`,
            }}>
              {act.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={act.image_url} alt="" style={{ width: 84, flexShrink: 0, objectFit: "cover" }} />
              )}
              {!act.image_url && <div style={{ width: 5, flexShrink: 0, background: "linear-gradient(180deg, #B0CCE8, #B0CCE866)" }}/>}
              <div style={{ flex: 1, padding: "14px 14px 12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ display: "inline-flex", background: "rgba(122,154,108,0.2)", borderRadius: 999, padding: "2px 8px", marginBottom: 5 }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "#4A3A2A", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>{act.category}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, fontStyle: "italic", color: "#2A1A10", lineHeight: 1.1 }}>{act.name}</p>
                  </div>
                  {act.badge && (
                    <div style={{ backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "4px 8px", marginLeft: 8, flexShrink: 0 }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: "#6A5A4A", letterSpacing: "0.04em" }}>{act.badge}</p>
                    </div>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#9A8A7A", letterSpacing: "0.04em", marginBottom: act.description ? 4 : 0 }}>{act.neighborhood ?? "NYC"}</p>
                {act.description && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12.5, color: "#6A5A4A", lineHeight: 1.4, opacity: 0.9 }}>&quot;{act.description}&quot;</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {openItem && <TrendingDetailSheet item={openItem} onClose={() => setOpenItem(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GO PAGE  —  gallery white + cobalt, bold architectural
// ═══════════════════════════════════════════════════════════════════════════════
interface TrendingItem {
  id: string; name: string; category: string; description: string | null;
  neighborhood: string | null; badge: string | null; image_url: string | null; save_count: number;
}

// Detail view for a GO/SOLO city_trending pick — full description + real save
// + Bloom Notes, so tapping a card actually goes somewhere instead of nothing.
function TrendingDetailSheet({ item, onClose }: { item: TrendingItem; onClose: () => void }) {
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(item.save_count);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChecking(false); return; }
      const { data } = await supabase
        .from("city_trending_saves")
        .select("trending_id")
        .eq("trending_id", item.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (active) { setSaved(!!data); setChecking(false); }
    })();
    return () => { active = false; };
  }, [item.id]);

  async function toggleSave() {
    const { saveTrendingSpot, unsaveTrendingSpot } = await import("@/lib/actions/city-trending");
    if (saved) {
      setSaved(false); setSaveCount(c => Math.max(0, c - 1));
      await unsaveTrendingSpot(item.id);
    } else {
      setSaved(true); setSaveCount(c => c + 1);
      await saveTrendingSpot(item.id);
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 301, background: "#FFFBF6", borderRadius: "24px 24px 0 0", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 -12px 48px rgba(0,0,0,0.35)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.12)" }} />
        </div>
        {item.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt="" style={{ width: "100%", height: 200, objectFit: "cover" }} />
        )}
        <div style={{ padding: "18px 20px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.12em", color: PINK, background: "rgba(255,31,125,0.08)", borderRadius: 999, padding: "3px 9px", textTransform: "uppercase" as const }}>{item.category}</span>
            {item.badge && <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, color: "#888", background: "rgba(0,0,0,0.05)", borderRadius: 999, padding: "3px 9px" }}>{item.badge}</span>}
          </div>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 24, color: "#1A1A1A", lineHeight: 1.1, marginBottom: 4 }}>{item.name}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#999", marginBottom: 14 }}>{item.neighborhood ?? "NYC"}</p>
          {item.description && <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: "#444", lineHeight: 1.6, marginBottom: 18 }}>{item.description}</p>}

          <button onClick={toggleSave} disabled={checking} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%",
            padding: "12px 0", borderRadius: 999, marginBottom: 22,
            border: saved ? "none" : "1.5px solid rgba(255,31,125,0.3)",
            background: saved ? PINK : "white", color: saved ? "white" : PINK,
            fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, letterSpacing: "0.04em", cursor: "pointer",
          }}>
            {saved ? "✓ Saved" : "♡ Save this spot"} {saveCount > 0 ? `· ${saveCount}` : ""}
          </button>

          <BloomNotesBoard placeSlug={`trending-${item.id}`} placeName={item.name} brand={PINK} accent="#FF69B4" />
        </div>
      </div>
    </>
  );
}

// GO covers "things to do" — everything that isn't primarily about eating/drinking.
const GO_CATEGORIES = ["pop-up", "art", "shopping", "wellness", "event", "other"];

function GoPage({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<TrendingItem[] | null>(null); // null = loading
  const [activeType, setActiveType] = useState("All");
  const [openItem, setOpenItem] = useState<TrendingItem | null>(null);
  const [hood, setHood] = useState<string | null>(null);
  useEffect(() => { setHood(getMyNeighborhood()); }, []);

  useEffect(() => {
    createClient()
      .from("city_trending")
      .select("id,name,category,description,neighborhood,badge,image_url,save_count")
      .eq("status", "approved")
      .in("category", GO_CATEGORIES)
      .order("rank_order", { ascending: true })
      .limit(30)
      .then(({ data }) => setItems((data as TrendingItem[] | null) ?? []));
  }, []);

  const byType = (items ?? []).filter(i => activeType === "All" || i.category === activeType);
  const types = ["All", ...Array.from(new Set((items ?? []).map(i => i.category)))];
  const shown = hood ? byType.filter(i => isNearby(hood, i.neighborhood)) : byType;

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
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px, 8.5vw, 34px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Get<br />Out There.</p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #3A5FCD66, #6BB5F544, transparent)" }}/>
      </div>

      {/* Type filters — real categories from what's actually approved */}
      <div style={{ background: "#E8F4FF", borderBottom: "1px solid rgba(58,95,205,0.15)", paddingBottom: 1 }}>
        <div style={{ padding: "10px 16px 8px" }}>
          <NeighborhoodPicker value={hood} onChange={setHood} />
        </div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto", padding: "0 16px 10px", scrollbarWidth: "none" as const }}>
          {types.map(t => (
            <button key={t} onClick={() => setActiveType(t)} style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 999, marginRight: 6,
              border: `1.5px solid ${activeType === t ? "#3A5FCD" : "rgba(58,95,205,0.25)"}`,
              background: activeType === t ? "#3A5FCD" : "rgba(255,255,255,0.7)",
              color: activeType === t ? "white" : "rgba(40,70,160,0.7)",
              fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", textTransform: "capitalize" as const,
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Experience cards — real city_trending picks, curated via the city-intelligence cron */}
      <div style={{ padding: "14px 14px 0" }}>
        <SpotlightBanner page="go" accent="#3A5FCD" />
        {items === null ? (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(40,60,120,0.4)", textAlign: "center" as const, padding: "24px 0" }}>Loading…</p>
        ) : shown.length === 0 ? (
          <div style={{ textAlign: "center" as const, padding: "40px 20px" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, color: "#28468F" }}>{hood ? `Nothing near ${hood} yet` : "Nothing here yet"}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(40,60,120,0.4)", marginTop: 6, letterSpacing: "0.06em" }}>{hood ? "TRY ALL OF NYC" : "CHECK BACK SOON"}</p>
          </div>
        ) : shown.map((item, i) => (
          <div key={item.id} onClick={() => setOpenItem(item)} style={{
            backgroundImage: item.image_url ? undefined : `${PAPER_TEX}`,
            backgroundSize: "200px 200px",
            backgroundColor: "#EAF2FF",
            borderRadius: 18, marginBottom: 10, overflow: "hidden",
            minHeight: i === 0 ? 170 : 100,
            position: "relative", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1), 0 1px 0 rgba(58,95,205,0.27) inset",
          }}>
            {item.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image_url} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            )}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(180deg, #3A5FCD, #3A5FCD88)" }}/>
            <div style={{ position: "absolute", inset: 0, background: item.image_url ? "linear-gradient(to top, rgba(6,8,15,0.75) 0%, rgba(6,8,15,0.15) 60%, transparent 100%)" : `radial-gradient(circle at 30% 30%, rgba(58,95,205,0.09) 0%, transparent 60%)` }}/>
            <div style={{ position: "relative", padding: i === 0 ? "22px 20px 18px 18px" : "14px 16px 12px 14px", display: "flex", flexDirection: "column" as const, justifyContent: "space-between", minHeight: i === 0 ? 170 : 100, boxSizing: "border-box" as const }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ background: item.image_url ? "rgba(255,255,255,0.2)" : "rgba(58,95,205,0.13)", border: "1px solid rgba(58,95,205,0.5)", borderRadius: 999, padding: "2px 9px" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: item.image_url ? "white" : "#3A5FCD", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>{item.category}</span>
                  </div>
                  {item.badge && (
                    <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 999, padding: "2px 9px" }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "rgba(40,60,120,0.7)", letterSpacing: "0.08em" }}>{item.badge}</span>
                    </div>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: i === 0 ? 22 : 15, fontWeight: 900, fontStyle: "italic", color: item.image_url ? "white" : DARK, lineHeight: 1.15 }}>{item.name}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: item.image_url ? "rgba(255,255,255,0.7)" : "rgba(40,60,100,0.5)", letterSpacing: "0.1em" }}>{(item.neighborhood ?? "NYC").toUpperCase()}</p>
                {item.save_count > 0 && (
                  <div style={{ background: item.image_url ? "rgba(255,255,255,0.2)" : "rgba(58,95,205,0.13)", border: "1px solid rgba(58,95,205,0.4)", borderRadius: 999, padding: "3px 10px" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: item.image_url ? "white" : "#3A5FCD" }}>{item.save_count} saved</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {openItem && <TrendingDetailSheet item={openItem} onClose={() => setOpenItem(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRENDING PAGE  —  electric pink-orange neon, live energy
// ═══════════════════════════════════════════════════════════════════════════════

function TrendingPage({ onBack }: { onBack: () => void }) {
  // Live data from city_trending table; falls back to demo list when empty
  const [liveItems, setLiveItems] = useState<Array<{
    id: string; name: string; category: string; description: string | null;
    source: string | null; badge: string | null; save_count: number; neighborhood: string | null;
  }>>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("city_trending")
      .select("id,name,category,description,source,badge,save_count,neighborhood")
      .eq("status", "approved")
      .order("rank_order", { ascending: true })
      .limit(10)
      .then(({ data }) => { if (data && data.length > 0) setLiveItems(data); });
  }, []);

  const displayItems = liveItems.map((item, i) => ({
    rank: i + 1,
    name: item.name,
    tag: item.category.toUpperCase(),
    count: item.save_count,
    hot: i < 2,
    badge: item.badge,
    description: item.description,
    source: item.source,
  }));

  const hasTrending = displayItems.length > 0;
  const tickerText = hasTrending
    ? liveItems.map(i => i.name.toUpperCase()).join("   ✦   ") + "   ✦   "
    : "";
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
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px, 7.5vw, 30px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, textShadow: "0 0 30px rgba(255,31,125,0.7), 0 0 60px rgba(255,85,0,0.3)" }}>What&apos;s<br />Hot Right Now.</p>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(8,1,14,0.7) 100%)" }}/>
        <BackBtn onBack={onBack} label="CITY"/>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${PINK}88, #FF774466, transparent)` }}/>
      </div>

      {/* Ticker tape */}
      {hasTrending && (
      <div style={{ background: "#FF1F7D", overflow: "hidden", height: 28, display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", animation: "tickerScroll 18s linear infinite" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "white", letterSpacing: "0.1em", paddingRight: 0 }}>
            {doubled}
          </span>
        </div>
      </div>
      )}

      {/* Trending list */}
      <div style={{ padding: "16px 16px 0" }}>
        {!hasTrending ? (
          <div style={{ textAlign: "center", padding: "48px 24px 32px" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 8 }}>
              Nothing trending yet
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(120,60,80,0.55)", lineHeight: 1.55 }}>
              When Bloomies save and share spots, the hot list will show up here.
            </p>
          </div>
        ) : (
        <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,119,68,0.8)" }}>THIS WEEK&apos;S HOT LIST</p>
          <div style={{ background: "rgba(255,31,125,0.12)", border: "1px solid rgba(255,31,125,0.25)", borderRadius: 999, padding: "3px 10px" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: PINK, animation: "hotPulse 2s ease-in-out infinite" }}>● LIVE</span>
          </div>
        </div>

        {displayItems.map((item, i) => (
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
                  {"source" in item && item.source && (
                    <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 999, padding: "2px 7px" }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 700, color: "rgba(100,60,80,0.5)", letterSpacing: "0.06em" }}>via {item.source}</span>
                    </div>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 700, fontStyle: "italic", color: DARK, lineHeight: 1.2 }}>{item.name}</p>
                {"description" in item && item.description && (
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(120,60,80,0.6)", marginTop: 3, lineHeight: 1.4 }}>{item.description}</p>
                )}
              </div>
              {/* Count */}
              <div style={{ flexShrink: 0, textAlign: "right" as const }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 800, color: i < 2 ? (i === 0 ? PINK : "#FF7744") : "rgba(180,80,120,0.3)", lineHeight: 1 }}>{item.count}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 700, color: "rgba(120,60,80,0.4)", letterSpacing: "0.05em" }}>SAVED</p>
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
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(120,40,60,0.55)", lineHeight: 1.55 }}>
            Activity highlights will appear here when members start sharing plans.
          </p>
        </div>
        </>
        )}
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
  const picks: typeof BLOOM_PICKS = [];

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

      <div style={{ padding: "16px 14px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "#9A7A6A", marginBottom: 12 }}>THE BLOOMIES LIST</p>

        {picks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 24px 32px" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, fontWeight: 700, color: "#4A2A18", marginBottom: 8 }}>
              No community picks yet
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#8A6A4A", lineHeight: 1.6 }}>
              When Bloomies save their favorite spots, curated picks will show up here.
            </p>
          </div>
        ) : picks.map((pick, i) => (
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
                  <button type="button" disabled title="Saving spots isn't available yet" style={{ background: "none", border: "none", cursor: "not-allowed", padding: 2, flexShrink: 0, opacity: 0.45 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
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
        {picks.length === 0 ? null : (
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
          <div style={{ backgroundImage: `${DARK_GRAIN}`, backgroundSize: "160px 160px", backgroundColor: "#1A0C08", display: "inline-flex", borderRadius: 999, padding: "9px 22px", opacity: 0.55 }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: PINK, letterSpacing: "0.1em" }}>✦ SAVE A SPOT — COMING SOON</span>
          </div>
        </div>
        )}
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
// GIRL GEMS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function GirlGemsPage({ onBack }: { onBack: () => void }) {
  const [gems, setGems] = useState<GirlGemRow[] | null>(null); // null = loading
  const [showSubmit, setShowSubmit] = useState(false);
  const [gemName, setGemName] = useState("");
  const [gemNeighborhood, setGemNeighborhood] = useState("");
  const [gemNote, setGemNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function submitGem() {
    if (!gemName.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    const { submitTrendingSpot } = await import("@/lib/actions/city-trending");
    const { ok, error } = await submitTrendingSpot({
      name: gemName,
      category: "other",
      neighborhood: gemNeighborhood.trim() || undefined,
      description: gemNote.trim() || undefined,
      source: "Bloomie tip",
    });
    setSubmitting(false);
    if (!ok) { setSubmitError(error ?? "Couldn't submit — try again."); return; }
    setSubmitted(true);
    setGemName(""); setGemNeighborhood(""); setGemNote("");
    setTimeout(() => { setSubmitted(false); setShowSubmit(false); }, 2200);
  }

  useEffect(() => {
    createClient()
      .from("restaurant_partners")
      .select("id, name, neighborhood, restaurant_type, poem, bloom_tips, brand_color")
      .or("poem.not.is.null,bloom_tips.not.is.null")
      .order("bloom_notes", { ascending: false })
      .limit(8)
      .then(({ data }) => setGems((data as GirlGemRow[] | null) ?? []));
  }, []);

  return (
    <div style={{
      backgroundImage: `${DARK_GRAIN}, linear-gradient(160deg, #1A0810 0%, #2A1018 50%, #1A0C10 100%)`,
      backgroundSize: "160px 160px, 100% 100%",
      minHeight: "100vh",
      paddingBottom: 120,
    }}>
      {/* Hero */}
      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `${DARK_GRAIN}`, backgroundSize: "160px 160px", backgroundColor: "#160A10" }} />
        <div style={{ position: "absolute", top: "20%", left: "20%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,69,19,0.35) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "30%", right: "10%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.2) 0%, transparent 70%)", filter: "blur(24px)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(26,8,16,0.9) 100%)" }} />
        <BackBtn onBack={onBack} label="CITY" />
        <div style={{ position: "absolute", bottom: 20, left: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(139,100,60,0.8)", marginBottom: 5 }}>GIRL GEMS · NYC</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Spots only<br />we know.</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 5 }}>curated by the bloomies ♡</p>
        </div>
      </div>

      {/* Gems list */}
      <div style={{ padding: "20px 16px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", marginBottom: 14 }}>THE LIST</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {gems === null && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "20px 0" }}>Loading gems…</p>
          )}
          {gems !== null && gems.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 20px", color: "rgba(255,255,255,0.3)" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15 }}>No gems yet</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, marginTop: 4, letterSpacing: "0.1em" }}>CHECK BACK SOON</p>
            </div>
          )}
          {gems !== null && gems.map((gem, i) => {
            const color = gem.brand_color || GEM_COLORS[i % GEM_COLORS.length];
            const note = gem.poem ?? gem.bloom_tips?.[0] ?? "";
            return (
              <div key={gem.id} style={{
                backgroundImage: `${DARK_GRAIN}`,
                backgroundSize: "160px 160px",
                backgroundColor: "#1E0E14",
                borderRadius: 20,
                padding: "16px 16px 18px",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                overflow: "hidden",
                position: "relative",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}99, transparent)` }} />
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, boxShadow: `0 4px 16px ${color}66` }}>
                    {emojiForType(gem.restaurant_type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 15, fontWeight: 700, color: "white" }}>{gem.name}</p>
                      <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{gem.restaurant_type}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500, marginBottom: 8, letterSpacing: "0.04em" }}>{gem.neighborhood ?? "NYC"}</p>
                    {note && <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "rgba(255,220,200,0.7)", lineHeight: 1.6 }}>&quot;{note}&quot;</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit CTA */}
        <div style={{
          marginTop: 24,
          backgroundImage: `${DARK_GRAIN}`,
          backgroundSize: "160px 160px",
          backgroundColor: "#1A0810",
          borderRadius: 20,
          padding: "20px 18px",
          border: "1px solid rgba(255,31,125,0.15)",
          textAlign: "center" as const,
        }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>know a hidden gem? ✦</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.25)", marginBottom: 14 }}>Bloomies-only submissions — reviewed before they go live</p>
          {!showSubmit ? (
            <button
              type="button"
              onClick={() => setShowSubmit(true)}
              style={{ background: "rgba(255,31,125,0.15)", border: "1px solid rgba(255,31,125,0.35)", borderRadius: 999, padding: "9px 22px", fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: PINK, cursor: "pointer" }}>
              SUBMIT A GEM →
            </button>
          ) : submitted ? (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#A8C97A" }}>Sent for review ✦ thank you!</p>
          ) : (
            <div style={{ textAlign: "left" as const }}>
              <input value={gemName} onChange={e => setGemName(e.target.value)} placeholder="Place name"
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "9px 12px", fontFamily: "var(--font-jost)", fontSize: 12, color: "white", marginBottom: 8, boxSizing: "border-box" as const, outline: "none" }} />
              <input value={gemNeighborhood} onChange={e => setGemNeighborhood(e.target.value)} placeholder="Neighborhood (optional)"
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "9px 12px", fontFamily: "var(--font-jost)", fontSize: 12, color: "white", marginBottom: 8, boxSizing: "border-box" as const, outline: "none" }} />
              <textarea value={gemNote} onChange={e => setGemNote(e.target.value)} placeholder="Why do you love it?" rows={2}
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "9px 12px", fontFamily: "var(--font-jost)", fontSize: 12, color: "white", marginBottom: 8, resize: "none" as const, boxSizing: "border-box" as const, outline: "none" }} />
              {submitError && <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#FFB3C7", marginBottom: 8 }}>{submitError}</p>}
              <button
                onClick={submitGem}
                disabled={!gemName.trim() || submitting}
                style={{ width: "100%", background: PINK, border: "none", borderRadius: 999, padding: "10px 0", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", color: "white", cursor: "pointer", opacity: (!gemName.trim() || submitting) ? 0.6 : 1 }}>
                {submitting ? "SENDING…" : "SEND FOR REVIEW →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GIRL FAVORITES PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function GirlFavsPage({ onBack }: { onBack: () => void }) {
  const [favs, setFavs] = useState<GirlFavRow[] | null>(null); // null = loading

  useEffect(() => {
    createClient()
      .from("restaurant_partners")
      .select("id, name, neighborhood, restaurant_type, bloom_rating")
      .order("bloom_rating", { ascending: false })
      .order("bloom_notes", { ascending: false })
      .limit(5)
      .then(({ data }) => setFavs((data as GirlFavRow[] | null) ?? []));
  }, []);

  return (
    <div style={{
      backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
      backgroundSize: "200px 200px, 80px 80px",
      backgroundColor: "#F9F4EE",
      minHeight: "100vh",
      paddingBottom: 120,
    }}>
      {/* Hero */}
      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `${DARK_GRAIN}, linear-gradient(145deg, #1A0818 0%, #2A0820 50%, #160A14 100%)`, backgroundSize: "160px 160px, 100% 100%" }} />
        <div style={{ position: "absolute", top: "15%", left: "30%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.3) 0%, transparent 70%)", filter: "blur(36px)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 35%, rgba(26,8,24,0.88) 100%)" }} />
        <BackBtn onBack={onBack} label="CITY" />
        <div style={{ position: "absolute", bottom: 20, left: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: PINK, marginBottom: 5 }}>GIRL FAVS · NYC</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Our favorite<br />spots.</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 5 }}>curated by BloomBay ♡</p>
        </div>
      </div>

      {/* Ranked list */}
      <div style={{ padding: "20px 16px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "#9A7A6A", marginBottom: 14 }}>OUR PICKS</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {favs === null && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "20px 0" }}>Loading favs…</p>
          )}
          {favs !== null && favs.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 20px", color: "rgba(255,255,255,0.3)" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15 }}>No favs yet</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, marginTop: 4, letterSpacing: "0.1em" }}>CHECK BACK SOON</p>
            </div>
          )}
          {favs !== null && favs.map((fav, i) => (
            <div key={fav.id} style={{
              backgroundImage: `${DARK_GRAIN}`,
              backgroundSize: "160px 160px",
              backgroundColor: i === 0 ? "#200C18" : "#1C0C14",
              borderRadius: 18,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              border: i === 0 ? "1px solid rgba(255,31,125,0.2)" : "1px solid rgba(255,255,255,0.04)",
              boxShadow: i === 0 ? "0 4px 24px rgba(255,31,125,0.12)" : "none",
              position: "relative" as const,
              overflow: "hidden",
            }}>
              {i === 0 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${PINK}88, transparent)` }} />}
              {/* Rank */}
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: i === 0 ? `rgba(255,31,125,0.15)` : "rgba(255,255,255,0.05)", border: `1px solid ${i === 0 ? "rgba(255,31,125,0.3)" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: i === 0 ? PINK : "rgba(255,255,255,0.4)" }}>{i + 1}</span>
              </div>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{emojiForType(fav.restaurant_type)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 700, color: "white", marginBottom: 2 }}>{fav.name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{fav.neighborhood ?? "NYC"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
function CityGuide() {
  const [category, setCategory] = useState<CityCategory>("landing");

  if (category === "landing")   return <CityLanding onSelect={setCategory}/>;
  if (category === "eat")       return <EatsPage             onBack={() => setCategory("landing")}/>;
  if (category === "go")        return <GoPage               onBack={() => setCategory("landing")}/>;
  if (category === "solo")      return <SoloPage             onBack={() => setCategory("landing")}/>;
  if (category === "bloomies")  return <BloomiesFavoritesPage onBack={() => setCategory("landing")}/>;
  if (category === "girl_gems") return <GirlGemsPage         onBack={() => setCategory("landing")}/>;
  if (category === "girl_favs") return <GirlFavsPage         onBack={() => setCategory("landing")}/>;

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
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px, 8.5vw, 34px)", fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1, letterSpacing: "-0.01em" }}>Neighborhoods</h1>
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


// ── Root city page ────────────────────────────────────────────────────────────
type CityRootMode = "guide" | "map";

export function CityPage() {
  const [mode, setMode] = useState<CityRootMode>("guide");
  const [hoodQuery, setHoodQuery] = useState("");
  const [hoodOpen, setHoodOpen] = useState(false);

  const MODES: { id: CityRootMode; label: string }[] = [
    { id: "guide", label: "THE CITY" },
    { id: "map",   label: "MAP"   },
  ];

  const hoodResults = hoodQuery.length > 0
    ? HOOD_INDEX.filter(h =>
        h.name.toLowerCase().includes(hoodQuery.toLowerCase()) ||
        h.tags.some(t => t.includes(hoodQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <div className="bloom-world-enter" style={{ minHeight: "100vh" }}>
      {/* Fixed top bar */}
      <div className="md:top-[60px] lg:top-0 lg:left-60 lg:right-[280px]" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 51,
        paddingTop: "env(safe-area-inset-top, 0px)",
        background: "rgba(255,252,248,0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,31,125,0.1)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ height: 54, display: "flex", alignItems: "center", padding: "0 12px", gap: 7 }}>

          {/* Tab pills */}
          {MODES.map(m => {
            const active = mode === m.id;
            return (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                padding: "7px 13px", borderRadius: 999, border: "none", cursor: "pointer",
                background: active ? PINK : "rgba(0,0,0,0.06)",
                color: active ? "white" : "rgba(0,0,0,0.45)",
                fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800,
                letterSpacing: "0.07em", whiteSpace: "nowrap" as const,
                boxShadow: active ? `0 4px 14px ${PINK}55` : "none",
                transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
                flexShrink: 0,
              }}>
                {m.label}
              </button>
            );
          })}

          {/* Divider */}
          <div style={{ width: 1, height: 18, background: "rgba(0,0,0,0.1)", flexShrink: 0 }} />

          {/* Tiny neighborhood search */}
          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(0,0,0,0.05)", borderRadius: 999,
              padding: "5px 10px 5px 8px",
              border: hoodOpen ? `1.5px solid ${PINK}55` : "1.5px solid transparent",
              transition: "border-color 0.15s",
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={hoodQuery}
                onChange={e => { setHoodQuery(e.target.value); setHoodOpen(true); }}
                onFocus={() => setHoodOpen(true)}
                onBlur={() => setTimeout(() => setHoodOpen(false), 150)}
                placeholder="neighborhood…"
                style={{
                  border: "none", background: "transparent", outline: "none",
                  fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 500,
                  color: DARK, width: "100%", minWidth: 0,
                }}
              />
              {hoodQuery && (
                <button onClick={() => { setHoodQuery(""); setHoodOpen(false); }} style={{ border: "none", background: "none", padding: 0, cursor: "pointer", lineHeight: 1 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown results */}
            {hoodOpen && hoodResults.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                background: "rgba(255,252,248,0.98)", borderRadius: 14,
                boxShadow: "0 8px 30px rgba(0,0,0,0.14)",
                border: "1.5px solid rgba(255,31,125,0.12)",
                overflow: "hidden", zIndex: 100,
              }}>
                {hoodResults.map(h => (
                  <button key={h.slug} onMouseDown={() => { setHoodQuery(h.name); setHoodOpen(false); }} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "9px 12px", border: "none", background: "transparent",
                    cursor: "pointer", textAlign: "left" as const,
                  }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: DARK }}>{h.name}</span>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(0,0,0,0.3)", letterSpacing: "0.05em" }}>{h.borough.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Content */}
      <div className="md:pt-0" style={{ paddingTop: "calc(54px + env(safe-area-inset-top, 0px))" }}>
        {mode === "guide" && <CityGuide />}
        {mode === "map"   && <CityMapView />}
      </div>
    </div>
  );
}

// ── Map view placeholder (real map integration TBD) ──────────────────────────
function CityMapView() {
  return (
    <div style={{ minHeight: "calc(100vh - 54px)", background: "#F0EBE4", paddingBottom: 110 }}>
      {/* Neighborhood search on map page */}
      <div style={{
        padding: "16px 16px 0",
        background: "linear-gradient(160deg, #FF1F7D 0%, #E8006A 100%)",
        paddingBottom: 20,
      }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>SEARCH NYC</p>
        <NeighborhoodSearch />
      </div>

      {/* Quick neighborhood chips */}
      <div style={{ padding: "16px 16px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,0,0,0.3)", marginBottom: 10 }}>POPULAR</p>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
          {["West Village","Williamsburg","SoHo","Harlem","DUMBO","Nolita","Crown Heights","Bushwick"].map(n => (
            <Link key={n} href={`/member/city/neighborhoods/${n.toLowerCase().replace(/ /g,"-")}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "white", borderRadius: 999,
                padding: "8px 14px",
                border: `1.5px solid rgba(255,31,125,0.15)`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: DARK }}>{n}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Map placeholder */}
      <div style={{ margin: "20px 16px 0", borderRadius: 20, overflow: "hidden", border: "1.5px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ background: "#D6E8F5", height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "#666" }}>Map launching in New York City</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.35)", letterSpacing: "0.04em" }}>Use search above to explore neighborhoods</p>
        </div>
      </div>
    </div>
  );
}
