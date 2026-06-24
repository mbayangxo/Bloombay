"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";
const DARK = "#1A1A1A";
const BG   = "#FEF3F7";

// ─── Types ────────────────────────────────────────────────────────────────────

type DropCat = "all" | "food_drink" | "beauty_wellness" | "experiences" | "shopping" | "travel";

interface LiveDrop {
  id: string;
  title: string;
  description: string;
  partner_name: string;
  neighborhood: string | null;
  total_qty: number;
  claimed_qty: number;
  remaining: number;
  valid_until: string | null;
  cover_color_a: string;
  cover_color_b: string;
  instructions: string | null;
  my_code: string | null;
  category?: string;
  badge_text?: string;
  is_featured?: boolean;
}

interface EditDrop {
  id: string;
  title: string;
  line2: string;
  partner: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  cat: Exclude<DropCat, "all">;
  validUntil?: string;
  gradA: string;
  gradB: string;
  variant: "dark" | "cream" | "light";
  discount?: string;
}

// ─── Static editorial data ─────────────────────────────────────────────────────

const CATS: { id: DropCat; label: string }[] = [
  { id: "all",             label: "All Drops"         },
  { id: "food_drink",      label: "Food & Drink"      },
  { id: "beauty_wellness", label: "Beauty & Wellness" },
  { id: "experiences",     label: "Experiences"       },
  { id: "shopping",        label: "Shopping"          },
  { id: "travel",          label: "Travel"            },
];

const FEATURED: EditDrop[] = [
  {
    id: "f1", title: "A TASTE OF", line2: "LUXURY",
    partner: "Atelier Noé", tagline: "CLEAN. GIRL. BEAUTY. ELEVATED.",
    badge: "EXCLUSIVE", badgeColor: DARK,
    cat: "beauty_wellness", validUntil: "May 31",
    gradA: "#3B0A1F", gradB: "#7A1535", variant: "dark",
  },
  {
    id: "f2", title: "ESPRESSO", line2: "ON US ♡",
    partner: "Laude", tagline: "BECAUSE MONDAYS NEED CAFFEINE.",
    badge: "JUST FOR US", badgeColor: PINK,
    cat: "food_drink",
    gradA: "#FFF0F5", gradB: "#FDE8F0", variant: "cream",
  },
  {
    id: "f3", title: "ICONIC", line2: "PIECES",
    partner: "Far", tagline: "TIMELESS PIECES FOR YOUR MAIN CHARACTER ERA.",
    badge: "NEW DROP", badgeColor: "#1A7A3A",
    cat: "shopping", validUntil: "Jun 15",
    gradA: "#FFF5F8", gradB: "#FFE8F0", variant: "light",
    discount: "15% OFF BY FAR",
  },
];

const CURATED: EditDrop[] = [
  {
    id: "c1", title: "BLOWOUT", line2: "SESSIONS",
    partner: "House of Gloss", tagline: "Complimentary at House of Gloss",
    badge: "BLOOMBAY PICK", badgeColor: PINK,
    cat: "beauty_wellness",
    gradA: "#2A0A1A", gradB: "#7B2040", variant: "dark",
  },
  {
    id: "c2", title: "SUNSET", line2: "SAIL",
    partner: "Sorelle", tagline: "All-girls sail with Sorelle",
    badge: "LIMITED SPOTS", badgeColor: DARK,
    cat: "experiences",
    gradA: "#0D1245", gradB: "#E85A20", variant: "dark",
  },
  {
    id: "c3", title: "$10 OFF YOUR", line2: "FIRST ORDER",
    partner: "Café Colette", tagline: "At Café Colette",
    badge: "FOR THE GIRLS", badgeColor: PINK,
    cat: "food_drink",
    gradA: "#3D2010", gradB: "#A05030", variant: "dark",
  },
];

// ─── Shopping bag illustration ────────────────────────────────────────────────

function ShoppingBag() {
  return (
    <div style={{ position: "relative", width: 162, height: 195, flexShrink: 0 }}>
      {/* Bag SVG */}
      <svg width="128" height="168" viewBox="0 0 128 168" fill="none" style={{ position: "absolute", left: 0, top: 14 }}>
        <defs>
          <linearGradient id="bb-bag" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D95"/>
            <stop offset="60%" stopColor="#FF1F7D"/>
            <stop offset="100%" stopColor="#C4005A"/>
          </linearGradient>
        </defs>
        {/* Shadow */}
        <ellipse cx="64" cy="159" rx="46" ry="7" fill="rgba(255,31,125,0.14)"/>
        {/* Bag body */}
        <path d="M 17 44 L 4 146 Q 3 152 9 153 L 119 153 Q 125 152 124 146 L 111 44 Z" fill="url(#bb-bag)"/>
        {/* Left shadow */}
        <path d="M 17 44 L 6 130 Q 18 122 23 94 L 31 44 Z" fill="rgba(0,0,0,0.11)"/>
        {/* Right shadow */}
        <path d="M 111 44 L 124 146 Q 115 126 110 98 Z" fill="rgba(0,0,0,0.08)"/>
        {/* Sheen */}
        <path d="M 33 44 L 25 108 Q 39 104 46 78 Z" fill="rgba(255,255,255,0.09)"/>
        {/* Handle outer */}
        <path d="M 38 44 C 36 16 47 8 64 8 C 81 8 92 16 90 44" fill="none" stroke="#B8004E" strokeWidth="12" strokeLinecap="round"/>
        {/* Handle inner sheen */}
        <path d="M 38 44 C 36 18 47 11 64 11 C 81 11 92 18 90 44" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="5" strokeLinecap="round"/>
        {/* Brand panel */}
        <rect x="22" y="68" width="84" height="48" rx="3" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
        {/* Bow center */}
        <ellipse cx="64" cy="44" rx="7" ry="4.5" fill="#E0006A"/>
        {/* Bow left wing */}
        <path d="M 57 41 Q 44 34 46 42 Q 47 47 57 46 Z" fill="#CC005A"/>
        {/* Bow right wing */}
        <path d="M 71 41 Q 84 34 82 42 Q 81 47 71 46 Z" fill="#CC005A"/>
        <circle cx="64" cy="44" r="3.5" fill="#AA0045"/>
      </svg>

      {/* BLOOMBAY text overlay */}
      <div style={{ position: "absolute", left: 8, top: 88, width: 112, textAlign: "center", pointerEvents: "none" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 10.5, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em", margin: 0 }}>BLOOMBAY</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "1px 0 0" }}>✿</p>
      </div>

      {/* Tag */}
      <div style={{
        position: "absolute", right: 0, top: 2,
        width: 68,
        background: "#FDF5EE",
        borderRadius: 5,
        padding: "8px 7px 10px",
        boxShadow: "2px 4px 14px rgba(0,0,0,0.14)",
        border: "1px solid rgba(0,0,0,0.06)",
        transform: "rotate(6deg)",
        transformOrigin: "top center",
      }}>
        {/* Tag hole */}
        <div style={{ width: 7, height: 7, borderRadius: "50%", border: "1.5px solid rgba(0,0,0,0.2)", margin: "0 auto 7px" }}/>
        {/* Tag string line */}
        <div style={{ position: "absolute", top: 0, left: "50%", width: 1, height: 16, background: "rgba(0,0,0,0.1)", transform: "translateX(-50%)" }}/>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 6.5, fontWeight: 900, color: DARK, lineHeight: 1.5, textAlign: "center", letterSpacing: "0.03em" }}>
          GOOD<br/>GIRLS<br/>GET<br/>THE<br/>GOOD<br/>STUFF.
        </p>
        <div style={{ marginTop: 6, height: 1, background: "rgba(0,0,0,0.07)" }}/>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 4.5, fontWeight: 800, color: PINK, textAlign: "center", marginTop: 5, letterSpacing: "0.14em" }}>BLOOMBAY</p>
      </div>
    </div>
  );
}

// ─── Decorative blossom ────────────────────────────────────────────────────────

function Blossom({ size = 22, opacity = 0.6 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity, display: "block" }}>
      {[0, 60, 120, 180, 240, 300].map(a => (
        <ellipse key={a} cx="12" cy="4.5" rx="2.8" ry="5.8" fill={PINK}
          transform={`rotate(${a} 12 12)`} opacity="0.65"/>
      ))}
      <circle cx="12" cy="12" r="3.8" fill="#FFDCE9"/>
      <circle cx="12" cy="12" r="2.2" fill="rgba(255,180,210,0.9)"/>
    </svg>
  );
}

// ─── Category icons ────────────────────────────────────────────────────────────

function CatIcon({ id }: { id: DropCat }) {
  const s = { width: 15, height: 15 };
  if (id === "all") return (
    <svg {...s} viewBox="0 0 24 24" fill="currentColor">
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={a} cx="12" cy="4" rx="2.4" ry="5.5" transform={`rotate(${a} 12 12)`} opacity="0.9"/>
      ))}
      <circle cx="12" cy="12" r="3.5"/>
    </svg>
  );
  if (id === "food_drink") return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M3 2v7c0 2.2 1.8 4 4 4s4-1.8 4-4V2"/><line x1="7" y1="2" x2="7" y2="22"/>
      <line x1="17" y1="2" x2="17" y2="22"/><path d="M14 7h6v1a6 6 0 01-6 0z"/>
    </svg>
  );
  if (id === "beauty_wellness") return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M12 2a7 7 0 00-7 7c0 3 1.8 5.8 4.5 7.2V20h5v-3.8C17.2 14.8 19 12 19 9a7 7 0 00-7-7z"/>
      <line x1="9" y1="22" x2="15" y2="22"/>
    </svg>
  );
  if (id === "experiences") return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <rect x="3" y="9" width="18" height="13" rx="1"/><path d="M8 9V7a4 4 0 018 0v2"/>
      <line x1="12" y1="13" x2="12" y2="17"/>
    </svg>
  );
  if (id === "shopping") return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
  return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5c-1.5-1.5-3.5-1.5-5 0L11 6 2.8 4.2l-1.6 1.6 7.5 4-3.6 3.6-1.5-1-1.4 1.4L6 17l3.8 3.8 1.4-1.4-1-1.5 3.6-3.6 4 7.5z"/>
    </svg>
  );
}

// ─── GRAIN util ───────────────────────────────────────────────────────────────

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.09'/%3E%3C/svg%3E")`;

// ─── Featured card: dark (tilted, torn bottom) ────────────────────────────────

function FeaturedCardDark({ data }: { data: EditDrop }) {
  return (
    <div style={{ width: 188, flexShrink: 0, transform: "rotate(1.5deg)", position: "relative" }}>
      <div style={{
        borderRadius: 22, overflow: "hidden",
        background: `linear-gradient(160deg, ${data.gradA}, ${data.gradB})`,
        backgroundImage: `${GRAIN_BG}, linear-gradient(160deg, ${data.gradA}, ${data.gradB})`,
        backgroundSize: "200px 200px, auto",
        boxShadow: "0 14px 44px rgba(0,0,0,0.3)",
        height: 285,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "0 16px 16px",
        position: "relative",
      }}>
        {/* Badge */}
        <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,0.7)", borderRadius: 99, padding: "3px 10px", backdropFilter: "blur(4px)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.18em" }}>{data.badge}</p>
        </div>

        {/* Content */}
        <div style={{ position: "relative" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 30, color: "white", lineHeight: 0.94, marginBottom: 8, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
            {data.title}<br/>{data.line2}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.65)", marginBottom: 3 }}>{data.partner}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.42)", letterSpacing: "0.06em", marginBottom: 12 }}>{data.tagline}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {data.validUntil
              ? <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Valid until {data.validUntil} ✿</p>
              : <span/>
            }
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>

        {/* Torn paper bottom */}
        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, pointerEvents: "none" }}>
          <svg viewBox="0 0 200 20" preserveAspectRatio="none" style={{ width: "100%", height: 20, display: "block" }}>
            <path d="M0 5 Q8 0 16 9 Q24 16 32 6 Q40 -1 48 11 Q56 20 64 7 Q72 -3 80 10 Q88 20 96 8 Q104 -2 112 12 Q120 21 128 8 Q136 -2 144 10 Q152 19 160 6 Q168 -3 176 9 Q184 17 200 4 L200 20 L0 20 Z" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Featured card: cream blob ────────────────────────────────────────────────

function FeaturedCardBlob({ data }: { data: EditDrop }) {
  return (
    <div style={{
      width: 188, flexShrink: 0,
      borderRadius: "58% 42% 52% 48% / 52% 44% 56% 48%",
      overflow: "hidden",
      background: "white",
      boxShadow: "0 10px 38px rgba(255,31,125,0.16), 0 3px 10px rgba(0,0,0,0.07)",
      height: 285,
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
      padding: "18px 18px 26px",
      position: "relative",
    }}>
      {/* Blossom top right */}
      <div style={{ position: "absolute", top: 28, right: 26 }}>
        <Blossom size={30} opacity={0.45}/>
      </div>

      {/* Badge */}
      <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", background: `${PINK}14`, border: `1.5px solid ${PINK}28`, borderRadius: 99, padding: "4px 12px", whiteSpace: "nowrap" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: PINK, letterSpacing: "0.18em" }}>{data.badge}</p>
      </div>

      {/* Coffee cup illus */}
      <div style={{ position: "absolute", right: 16, top: "26%", width: 58, height: 62 }}>
        <div style={{ width: 50, height: 6, borderRadius: 99, background: "linear-gradient(90deg, #E0B898, #C09070)", position: "absolute", bottom: 0, left: 0 }}/>
        <div style={{ width: 40, height: 48, borderRadius: "5px 5px 18px 18px", background: "linear-gradient(155deg, #F8E0CC, #E8C0A0)", position: "absolute", bottom: 6, left: 5 }}>
          <div style={{ position: "absolute", top: 5, left: 5, right: 5, bottom: 10, borderRadius: "0 0 14px 14px", background: "linear-gradient(180deg, rgba(80,30,5,0.6), rgba(60,20,2,0.7))" }}/>
          <div style={{ position: "absolute", top: 16, left: 8, right: 8, height: 3, borderRadius: 99, background: "rgba(255,255,255,0.18)" }}/>
        </div>
        <div style={{ position: "absolute", right: -1, bottom: 14, width: 13, height: 22, borderRadius: "0 10px 10px 0", border: "3.5px solid #D0A888", borderLeft: "none" }}/>
      </div>

      <div style={{ position: "relative" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 26, color: DARK, lineHeight: 0.93, marginBottom: 7 }}>
          {data.title}<br/>{data.line2}
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(0,0,0,0.5)", marginBottom: 5 }}>Free Espresso · {data.partner}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: PINK, letterSpacing: "0.12em", marginBottom: 14 }}>{data.tagline}</p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Featured card: light product ─────────────────────────────────────────────

function FeaturedCardLight({ data }: { data: EditDrop }) {
  return (
    <div style={{
      width: 188, flexShrink: 0,
      borderRadius: 22, overflow: "hidden",
      background: "white",
      boxShadow: "0 8px 28px rgba(0,0,0,0.09)",
      height: 285,
      display: "flex", flexDirection: "column",
      position: "relative",
    }}>
      {/* Product area */}
      <div style={{ height: 132, background: "linear-gradient(145deg, #FFF0F5, #FFE4EF)", position: "relative", overflow: "hidden" }}>
        {/* Pink bag */}
        <div style={{ position: "absolute", right: 14, top: 12 }}>
          <div style={{ width: 52, height: 64, borderRadius: "6px 6px 3px 3px", background: "linear-gradient(145deg, #FF6FA8, #E0006A)", position: "relative" }}>
            <div style={{ position: "absolute", top: 16, left: 8, right: 8, height: 11, borderRadius: 2, background: "rgba(255,255,255,0.14)" }}/>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 16, background: "rgba(0,0,0,0.08)" }}/>
          </div>
          <div style={{ position: "absolute", top: -12, left: 12, width: 28, height: 18, borderRadius: "50% 50% 0 0", border: "5px solid #C4005A", borderBottom: "none" }}/>
        </div>
        {/* Sunglasses */}
        <div style={{ position: "absolute", left: 14, bottom: 16 }}>
          <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
            <div style={{ width: 27, height: 17, borderRadius: 5, border: "2.5px solid #C8C8C8", background: "rgba(160,160,160,0.15)" }}/>
            <div style={{ width: 9, height: 2, background: "#C8C8C8", borderRadius: 1 }}/>
            <div style={{ width: 27, height: 17, borderRadius: 5, border: "2.5px solid #C8C8C8", background: "rgba(160,160,160,0.15)" }}/>
          </div>
        </div>
        {/* Paper clip */}
        <div style={{ position: "absolute", top: -3, right: 6 }}>
          <svg width="13" height="28" viewBox="0 0 13 28" fill="none">
            <path d="M6.5 3.5 Q11 3.5 11 9 L11 20 Q11 26 6.5 26 Q2 26 2 20 L2 7 Q2 3 5.5 3 Q9 3 9 7 L9 20 Q9 24 6.5 24 Q4 24 4 20 L4 9" stroke="#C8A060" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        {/* Badge */}
        <div style={{ position: "absolute", top: 10, left: 12, background: "#1A7A3A", borderRadius: 99, padding: "3px 9px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.15em" }}>{data.badge}</p>
        </div>
      </div>

      {/* Text */}
      <div style={{ padding: "13px 14px 14px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 23, color: DARK, lineHeight: 0.93, marginBottom: 5 }}>
            {data.title}<br/>{data.line2}
          </p>
          {data.discount && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, color: PINK, marginBottom: 4 }}>{data.discount}</p>
          )}
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, color: "rgba(0,0,0,0.37)", letterSpacing: "0.09em" }}>{data.tagline}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          {data.validUntil
            ? <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, fontStyle: "italic" }}>Valid until {data.validUntil}</p>
            : <span/>
          }
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${PINK}10`, border: `1.5px solid ${PINK}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Curated card ──────────────────────────────────────────────────────────────

function CuratedCard({ data, index }: { data: EditDrop; index: number }) {
  return (
    <div style={{
      flex: "1 1 0", minWidth: 0, borderRadius: 18, overflow: "hidden",
      position: "relative", height: 185,
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }}>
      {/* Photo-like gradient */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(155deg, ${data.gradA}, ${data.gradB})`, backgroundImage: `${GRAIN_BG}, linear-gradient(155deg, ${data.gradA}, ${data.gradB})`, backgroundSize: "200px 200px, auto" }}/>
      {/* Vignette */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 60%)" }}/>

      {/* Badge */}
      <div style={{ position: "absolute", top: 9, left: 9, background: data.badgeColor === PINK ? PINK : "rgba(0,0,0,0.6)", borderRadius: 99, padding: "3px 8px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 900, color: "white", letterSpacing: "0.13em" }}>{data.badge}</p>
      </div>

      {/* Heart for BLOOMBAY PICK */}
      {index === 0 && (
        <div style={{ position: "absolute", top: 9, right: 9 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)" stroke="none">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </div>
      )}

      {/* Blossom decoration */}
      <div style={{ position: "absolute", bottom: 8, right: 8 }}>
        <Blossom size={18} opacity={0.55}/>
      </div>

      {/* Text */}
      <div style={{ position: "relative", padding: "8px 10px 11px" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 15, color: "white", lineHeight: 1.05, marginBottom: 3 }}>
          {data.title}<br/>{data.line2}
        </p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{data.tagline}</p>
      </div>
    </div>
  );
}

// ─── Live drop claim card (integrates real DB drops) ──────────────────────────

function LiveDropCard({ drop, onClaimed }: { drop: LiveDrop; onClaimed: (code: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const isSoldOut = drop.remaining <= 0;
  const pct = Math.round((drop.remaining / drop.total_qty) * 100);

  async function claim() {
    if (loading || drop.my_code || isSoldOut) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/drops/claim", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dropId: drop.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
      onClaimed(data.code);
    } catch { setError("Network error — try again"); }
    finally { setLoading(false); }
  }

  return (
    <div style={{
      width: 188, flexShrink: 0, borderRadius: 22, overflow: "hidden",
      background: `linear-gradient(155deg, ${drop.cover_color_a}, ${drop.cover_color_b})`,
      backgroundImage: `${GRAIN_BG}, linear-gradient(155deg, ${drop.cover_color_a}, ${drop.cover_color_b})`,
      backgroundSize: "200px 200px, auto",
      boxShadow: "0 14px 44px rgba(0,0,0,0.24)",
      height: 285,
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
      padding: "0 16px 18px",
      position: "relative",
    }}>
      {/* Bloom Drop badge */}
      <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", borderRadius: 99, padding: "3px 10px", border: "1px solid rgba(255,255,255,0.25)" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.18em" }}>BLOOM DROP ✦</p>
      </div>
      {drop.my_code && (
        <div style={{ position: "absolute", top: 14, right: 14, background: "#4CAF50", borderRadius: 99, padding: "3px 10px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.15em" }}>CLAIMED ✓</p>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ position: "absolute", top: 46, left: 14, right: 14 }}>
        <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.18)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "rgba(255,255,255,0.65)", borderRadius: 99, transition: "width 0.6s" }}/>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 26, color: "white", lineHeight: 1, marginBottom: 4, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>{drop.title}</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(255,255,255,0.68)", marginBottom: 2 }}>{drop.partner_name}{drop.neighborhood ? ` · ${drop.neighborhood}` : ""}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.45)", marginBottom: 12 }}>
          {isSoldOut ? "All claimed" : `${drop.remaining} of ${drop.total_qty} left · 1 per week`}
        </p>
        {error && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#FFB3C1", marginBottom: 8 }}>{error}</p>}

        {drop.my_code ? (
          <button onClick={() => onClaimed(drop.my_code!)} style={{ width: "100%", padding: "11px", borderRadius: 50, background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.38)", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, color: "white" }}>
            View my code →
          </button>
        ) : isSoldOut ? (
          <button disabled style={{ width: "100%", padding: "11px", borderRadius: 50, background: "rgba(255,255,255,0.08)", border: "none", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", cursor: "not-allowed" }}>
            All claimed
          </button>
        ) : (
          <button onClick={claim} disabled={loading} style={{ width: "100%", padding: "11px", borderRadius: 50, background: loading ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.38)", cursor: loading ? "default" : "pointer", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, color: "white", backdropFilter: "blur(4px)" }}>
            {loading ? "Claiming…" : `Claim ${drop.title} →`}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── My Drops sheet ────────────────────────────────────────────────────────────

function MyDropsSheet({ drops, onClose }: { drops: LiveDrop[]; onClose: () => void }) {
  const claimed = drops.filter(d => d.my_code);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: "white", borderRadius: "24px 24px 0 0", padding: "18px 20px calc(env(safe-area-inset-bottom,0px) + 36px)", maxHeight: "72vh", overflow: "auto" }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(0,0,0,0.1)", margin: "0 auto 20px" }}/>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: DARK }}>My Drops</p>
          {claimed.length > 0 && (
            <div style={{ background: PINK, borderRadius: 99, padding: "3px 12px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white" }}>{claimed.length} claimed</p>
            </div>
          )}
        </div>
        {claimed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <Blossom size={40} opacity={0.25}/>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(0,0,0,0.35)", marginTop: 12 }}>No drops claimed yet.<br/>Claim your weekly drop below!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {claimed.map(d => {
              const expired = d.valid_until ? new Date(d.valid_until) < new Date() : false;
              return (
                <div key={d.id} style={{ borderRadius: 16, border: "1.5px solid rgba(0,0,0,0.07)", padding: "13px 15px", display: "flex", alignItems: "center", gap: 13 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${d.cover_color_a}, ${d.cover_color_b})`, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: DARK, marginBottom: 2 }}>{d.title}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#999", marginBottom: 5 }}>{d.partner_name}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 900, color: expired ? "#bbb" : PINK, letterSpacing: "0.1em" }}>{d.my_code}</p>
                  </div>
                  <div style={{ background: expired ? "rgba(0,0,0,0.04)" : "#F0FFF4", borderRadius: 99, padding: "3px 10px", border: `1px solid ${expired ? "rgba(0,0,0,0.06)" : "#4CAF50"}`, flexShrink: 0 }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: expired ? "#bbb" : "#2E7D32", letterSpacing: "0.12em" }}>{expired ? "EXPIRED" : "ACTIVE"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Code modal (shown after claiming) ───────────────────────────────────────

function CodeModal({ code, drop, onClose }: { code: string; drop: LiveDrop; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 210, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 370, background: "#FAF6F2", borderRadius: 26, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.32)" }}>
        <div style={{ background: `linear-gradient(135deg, ${drop.cover_color_a}, ${drop.cover_color_b})`, padding: "26px 22px 20px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(255,255,255,0.58)", letterSpacing: "0.2em", marginBottom: 5 }}>YOUR BLOOM DROP</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 24, color: "white", lineHeight: 1.1 }}>{drop.title}</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.68)", marginTop: 3 }}>{drop.partner_name}</p>
        </div>
        <div style={{ padding: "22px 22px 28px" }}>
          <div style={{ background: "white", borderRadius: 16, padding: "18px", border: `1.5px solid ${PINK}20`, textAlign: "center", marginBottom: 14 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(0,0,0,0.28)", letterSpacing: "0.2em", marginBottom: 8 }}>YOUR CODE</p>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 30, color: PINK, letterSpacing: "0.15em", marginBottom: 12 }}>{code}</p>
            <button onClick={copy} style={{ background: copied ? "#F0FFF4" : `${PINK}10`, border: `1.5px solid ${copied ? "#4CAF50" : `${PINK}28`}`, borderRadius: 99, padding: "6px 16px", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: copied ? "#2E7D32" : PINK }}>
              {copied ? "✓ Copied!" : "Copy code"}
            </button>
          </div>
          {drop.instructions && (
            <div style={{ background: `${PINK}07`, borderRadius: 12, padding: "11px 13px", marginBottom: 14, border: `1px solid ${PINK}12` }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: PINK, letterSpacing: "0.14em", marginBottom: 5 }}>HOW TO REDEEM</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.6)", lineHeight: 1.55 }}>{drop.instructions}</p>
            </div>
          )}
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(0,0,0,0.3)", textAlign: "center", marginBottom: 14 }}>Screenshot or copy before closing.</p>
          <button onClick={onClose} style={{ width: "100%", padding: "14px", borderRadius: 50, background: `linear-gradient(135deg, ${PINK}, #C4005A)`, border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: "white", boxShadow: `0 6px 20px ${PINK}40` }}>
            Done ✦
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function DropsPage() {
  const [activeCat, setActiveCat]     = useState<DropCat>("all");
  const [drops, setDrops]             = useState<LiveDrop[]>([]);
  const [myDropsOpen, setMyDropsOpen] = useState(false);
  const [activeCode, setActiveCode]   = useState<{ code: string; drop: LiveDrop } | null>(null);

  const fetchDrops = useCallback(() => {
    fetch("/api/drops")
      .then(r => r.json())
      .then(d => { if (d.drops) setDrops(d.drops); })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchDrops(); }, [fetchDrops]);

  function handleClaimed(dropId: string, code: string) {
    setDrops(prev => prev.map(d =>
      d.id === dropId
        ? { ...d, my_code: code, claimed_qty: d.my_code ? d.claimed_qty : d.claimed_qty + 1, remaining: d.my_code ? d.remaining : d.remaining - 1 }
        : d
    ));
    const drop = drops.find(d => d.id === dropId);
    if (drop) setActiveCode({ code, drop: { ...drop, my_code: code } });
  }

  const claimedCount = drops.filter(d => d.my_code).length;

  const filteredFeatured = activeCat === "all" ? FEATURED : FEATURED.filter(d => d.cat === activeCat);
  const filteredCurated  = activeCat === "all" ? CURATED  : CURATED.filter(d => d.cat === activeCat);
  const filteredLive     = activeCat === "all" ? drops     : drops.filter(d => (d.category ?? "food_drink") === activeCat);

  return (
    <div style={{ background: BG, minHeight: "100vh", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>
      <style>{`.dscroll::-webkit-scrollbar{display:none}`}</style>

      {/* ── TOP BAR ───────────────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(254,243,247,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,31,125,0.06)",
        padding: "calc(env(safe-area-inset-top, 0px) + 12px) 20px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 900, color: PINK, letterSpacing: "0.04em" }}>
          BLOOMBAY <span style={{ fontSize: 15 }}>✿</span>
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <button onClick={() => setMyDropsOpen(true)} style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, background: "white", border: "1.5px solid rgba(0,0,0,0.07)", borderRadius: 99, padding: "6px 14px 6px 12px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: DARK }}>My Drops</p>
            {claimedCount > 0 && (
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 900, color: "white" }}>{claimedCount}</p>
              </div>
            )}
          </button>
          <button style={{ width: 34, height: 34, borderRadius: "50%", background: "white", border: "1.5px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </button>
          <button style={{ width: 34, height: 34, borderRadius: "50%", background: "white", border: "1.5px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <div style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 76px)", padding: "calc(env(safe-area-inset-top, 0px) + 76px) 22px 0 22px", position: "relative", overflow: "hidden" }}>
        {/* Scattered blossoms */}
        <div style={{ position: "absolute", top: 82, left: 6, transform: "rotate(-18deg)", pointerEvents: "none" }}><Blossom size={32} opacity={0.32}/></div>
        <div style={{ position: "absolute", top: 150, left: 58, transform: "rotate(22deg)", pointerEvents: "none" }}><Blossom size={18} opacity={0.22}/></div>
        <div style={{ position: "absolute", top: 102, right: 178, transform: "rotate(12deg)", pointerEvents: "none" }}><Blossom size={24} opacity={0.28}/></div>
        <div style={{ position: "absolute", top: 190, left: 112, transform: "rotate(-8deg)", pointerEvents: "none" }}><Blossom size={14} opacity={0.18}/></div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ paddingTop: 6 }}>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontSize: "clamp(54px, 19vw, 76px)", color: DARK, lineHeight: 0.86, margin: 0, letterSpacing: "-0.02em" }}>
              DROPS
            </h1>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 21, color: DARK, marginTop: 7, transform: "rotate(-2deg)", transformOrigin: "left bottom", display: "inline-block", paddingLeft: 2, opacity: 0.82 }}>
              Only the good stuff.
            </p>
          </div>
          <ShoppingBag/>
        </div>
      </div>

      {/* ── CATEGORY CHIPS ────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 22 }}>
        <div className="dscroll" style={{ display: "flex", gap: 10, overflowX: "auto", padding: "4px 18px 6px", scrollbarWidth: "none" as const, alignItems: "center" }}>
          {CATS.map(cat => {
            const isActive = activeCat === cat.id;
            const isAll    = cat.id === "all";
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: isAll ? "row" : "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: isAll ? 6 : 4,
                  padding: isAll ? "9px 18px" : "8px 12px 9px",
                  borderRadius: isAll ? 99 : 16,
                  minWidth: isAll ? undefined : 60,
                  background: isActive ? PINK : "white",
                  border: `1.5px solid ${isActive ? PINK : "rgba(0,0,0,0.07)"}`,
                  color: isActive ? "white" : "#666",
                  cursor: "pointer",
                  boxShadow: isActive ? `0 4px 16px ${PINK}35` : "0 2px 6px rgba(0,0,0,0.05)",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <CatIcon id={cat.id}/>
                </span>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: isAll ? 12 : 8, fontWeight: 800, whiteSpace: "nowrap", lineHeight: 1.2 }}>
                  {cat.label}
                </span>
              </button>
            );
          })}
          {/* + button */}
          <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 16px ${PINK}40`, cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── FEATURED DROPS ────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", marginBottom: 16 }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 19, color: DARK, fontWeight: 700 }}>Featured Drops 📫</p>
          <Link href="#" style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.38)", textDecoration: "none" }}>See all →</Link>
        </div>
        <div className="dscroll" style={{ display: "flex", gap: 14, overflowX: "auto", padding: "8px 20px 14px", scrollbarWidth: "none" as const }}>
          {/* Real claimable drops first */}
          {filteredLive.map(drop => (
            <LiveDropCard key={drop.id} drop={drop} onClaimed={code => handleClaimed(drop.id, code)}/>
          ))}
          {/* Editorial cards */}
          {filteredFeatured.map(d =>
            d.variant === "dark"  ? <FeaturedCardDark  key={d.id} data={d}/> :
            d.variant === "cream" ? <FeaturedCardBlob  key={d.id} data={d}/> :
                                    <FeaturedCardLight key={d.id} data={d}/>
          )}
        </div>
      </div>

      {/* ── CURATED FOR OUR GIRLS ─────────────────────────────────────────────── */}
      {filteredCurated.length > 0 && (
        <div style={{ marginTop: 30, padding: "0 18px" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 19, fontWeight: 700, color: DARK, marginBottom: 14 }}>Curated For Our Girls ✿</p>
          <div style={{ display: "flex", gap: 10 }}>
            {filteredCurated.map((d, i) => (
              <CuratedCard key={d.id} data={d} index={i}/>
            ))}
          </div>
        </div>
      )}

      {/* ── SUBMIT CTA ────────────────────────────────────────────────────────── */}
      <div style={{ margin: "30px 18px 0", borderRadius: 22, background: "white", padding: "20px 18px 22px", boxShadow: "0 4px 20px rgba(255,31,125,0.07)", border: "1px solid rgba(255,31,125,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <span style={{ fontSize: 16, color: PINK }}>✿</span>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: DARK }}>Have a favorite spot?</p>
          </div>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.42)", lineHeight: 1.4 }}>
            Tell us about it so we can feature it for all Bloomies!
          </p>
        </div>
        <button style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, background: DARK, borderRadius: 50, padding: "12px 16px", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9.5, fontWeight: 900, color: "white", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>SUBMIT A DROP</p>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>

      {/* ── OVERLAYS ──────────────────────────────────────────────────────────── */}
      {myDropsOpen && (
        <MyDropsSheet drops={drops} onClose={() => setMyDropsOpen(false)}/>
      )}
      {activeCode && (
        <CodeModal code={activeCode.code} drop={activeCode.drop} onClose={() => setActiveCode(null)}/>
      )}
    </div>
  );
}
