"use client";

import Link from "next/link";
import { BloomDropSection } from "./bloom-drop-card";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const WARM  = "#8B4513";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

interface EatsSpot {
  id: string;
  name: string;
  tagline: string;
  neighborhood: string;
  city: string;
  category: string;
  gradientA: string;
  gradientB: string;
  badge?: string;
  emoji: string;
}

const EATS_SPOTS: EatsSpot[] = [
  {
    id: "e1", name: "Café Gitane", tagline: "Moroccan café, wine & bites",
    neighborhood: "NoLita", city: "New York",
    category: "Café", gradientA: "#6B3A2A", gradientB: "#C87840",
    badge: "BLOOM DROP ✦", emoji: "☕",
  },
  {
    id: "e2", name: "Sant Ambroeus", tagline: "Italian pastries & espresso",
    neighborhood: "West Village", city: "New York",
    category: "Café", gradientA: "#B5895A", gradientB: "#D4A870",
    emoji: "🥐",
  },
  {
    id: "e3", name: "Libertine", tagline: "Brixton wine bar & small plates",
    neighborhood: "Brixton", city: "London",
    category: "Wine Bar", gradientA: "#3D2B1F", gradientB: "#7B4F2E",
    emoji: "🍷",
  },
  {
    id: "e4", name: "Buns from Home", tagline: "Cinnamon buns & specialty coffee",
    neighborhood: "Shoreditch", city: "London",
    category: "Bakery", gradientA: "#C2510F", gradientB: "#E8A050",
    badge: "GIRL FAV", emoji: "🍞",
  },
  {
    id: "e5", name: "Odo Odo", tagline: "West African brunch & cocktails",
    neighborhood: "Peckham", city: "London",
    category: "Brunch", gradientA: "#4A7C59", gradientB: "#84A98C",
    emoji: "🌿",
  },
  {
    id: "e6", name: "Winsome", tagline: "Natural wine, small plates",
    neighborhood: "Crown Heights", city: "New York",
    category: "Wine Bar", gradientA: "#7C4D8C", gradientB: "#BF8FD9",
    badge: "NEW", emoji: "🍾",
  },
];

function SpotCard({ spot }: { spot: EatsSpot }) {
  const catColor = spot.category === "Café" ? WARM
    : spot.category === "Bakery" ? "#C2510F"
    : spot.category === "Wine Bar" ? "#6A1B9A"
    : spot.category === "Brunch" ? "#4A7C59"
    : DARK;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: `${spot.gradientA}15`, transform: "rotate(-1deg)", zIndex: 0 }} />
      <div style={{
        position: "relative", zIndex: 1, borderRadius: 18, overflow: "hidden",
        background: `${GRAIN}, white`, backgroundSize: "200px 200px, auto",
        boxShadow: "0 6px 24px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.05)",
      }}>
        <div style={{
          height: 90, background: `linear-gradient(135deg, ${spot.gradientA}, ${spot.gradientB})`,
          position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {spot.badge && (
            <div style={{
              position: "absolute", top: 8, left: 8,
              background: spot.badge.includes("DROP") ? DARK : spot.badge === "GIRL FAV" ? "#C2510F" : PINK,
              borderRadius: 99, padding: "2px 8px",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 900, color: "white", letterSpacing: "0.16em" }}>{spot.badge}</p>
            </div>
          )}
          <span style={{ fontSize: 28, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }}>{spot.emoji}</span>
        </div>

        <div style={{ padding: "10px 12px 13px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: DARK, lineHeight: 1.2 }}>{spot.name}</p>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, color: catColor, background: `${catColor}10`, borderRadius: 99, padding: "2px 6px", flexShrink: 0, marginLeft: 4 }}>{spot.category.toUpperCase()}</span>
          </div>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.5)", lineHeight: 1.4, marginBottom: 8 }}>{spot.tagline}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "#aaa", marginBottom: 10 }}>{spot.neighborhood} · {spot.city}</p>

          <Link href="/member/city" style={{
            display: "block", textAlign: "center", padding: "7px 12px",
            borderRadius: 99, background: `${WARM}12`,
            border: `1.5px solid ${WARM}30`,
            fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800,
            color: WARM, textDecoration: "none",
            letterSpacing: "0.04em",
          }}>
            View on Map →
          </Link>
        </div>
      </div>
    </div>
  );
}

export function EatsPage() {
  return (
    <div style={{
      background: "#FDF8F2",
      minHeight: "100vh",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)",
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 54px)",
    }}>

      {/* Header */}
      <div style={{
        padding: "56px 22px 24px",
        background: `linear-gradient(150deg, #3D2B1F 0%, #6B3A2A 55%, #C87840 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.06), transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "linear-gradient(to bottom, transparent, rgba(61,43,31,0.3))", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Link href="/member/avenue" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "4px 12px", border: "1px solid rgba(255,255,255,0.18)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "rgba(255,255,255,0.65)", letterSpacing: "0.2em" }}>GIRL EATS GUIDE</p>
          </div>
        </div>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(32px, 11vw, 44px)", color: "white", lineHeight: 1, marginBottom: 6 }}>Eats.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.6)" }}>Girl-approved spots. Weekly bloom drops.</p>
      </div>

      {/* Bloom Drop section */}
      <div style={{ padding: "20px 18px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ background: `${PINK}12`, borderRadius: 99, padding: "5px 12px", border: `1px solid ${PINK}20` }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: PINK, letterSpacing: "0.2em" }}>✦ WEEKLY BLOOM DROP</p>
          </div>
          <div style={{ flex: 1, height: 1, background: `${PINK}15` }} />
        </div>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.45)", marginBottom: 16 }}>One free drop per member, per week. Claim yours before they're gone.</p>
        <BloomDropSection />
      </div>

      {/* Divider */}
      <div style={{ margin: "24px 18px 0", height: 1, background: "rgba(0,0,0,0.06)" }} />

      {/* Curated spots */}
      <div style={{ padding: "20px 18px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: "rgba(0,0,0,0.4)", letterSpacing: "0.22em" }}>GIRL-APPROVED SPOTS</p>
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.07)" }} />
        </div>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.4)", marginBottom: 16 }}>Cafés, bars + restaurants the BB community loves.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {EATS_SPOTS.map(spot => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </div>

      {/* Suggest a spot */}
      <div style={{ margin: "24px 18px 0", borderRadius: 20, background: DARK, padding: "22px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 4 }}>Know a great spot?</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Drop it on the map and the community will find it.</p>
        <Link href="/member/city" style={{
          display: "inline-block", padding: "12px 22px", borderRadius: 50,
          background: `linear-gradient(135deg, #6B3A2A, #C87840)`,
          fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800,
          color: "white", textDecoration: "none", letterSpacing: "0.06em",
          boxShadow: "0 4px 16px rgba(107,58,42,0.5)",
        }}>
          Add to the map →
        </Link>
      </div>
    </div>
  );
}
