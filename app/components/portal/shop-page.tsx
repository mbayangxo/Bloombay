"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const CREAM = "#FAF6F2";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

type ShopCategory = "all" | "beauty" | "fashion" | "wellness" | "food" | "digital" | "services";

const CAT_META: Record<ShopCategory, { label: string; color: string }> = {
  all:      { label: "All",      color: DARK },
  beauty:   { label: "Beauty",   color: PINK },
  fashion:  { label: "Fashion",  color: "#C4005A" },
  wellness: { label: "Wellness", color: "#4A7C59" },
  food:     { label: "Food",     color: "#C2510F" },
  digital:  { label: "Digital",  color: "#6A1B9A" },
  services: { label: "Services", color: "#1565C0" },
};

interface ShopItem {
  id: string;
  brand: string;
  seller: string;
  seller_initial: string;
  seller_color: string;
  category: ShopCategory;
  name: string;
  description: string;
  price: string;
  gradientA: string;
  gradientB: string;
  badge?: string;
  saves: number;
  sharedClub?: string;
}

const MOCK_ITEMS: ShopItem[] = [
  {
    id: "1", brand: "Glow by Nia", seller: "Nia B.", seller_initial: "N", seller_color: PINK,
    category: "beauty", name: "Melanin Glow Oil",
    description: "Small-batch face oil formulated for dark skin tones. Uses Marula, Baobab + Rosehip. No synthetics.",
    price: "£42", gradientA: "#F7971E", gradientB: "#FFD200",
    badge: "BB FOUNDER", saves: 89, sharedClub: "The Reading Room",
  },
  {
    id: "2", brand: "Zara Styles", seller: "Zara F.", seller_initial: "Z", seller_color: "#C084FC",
    category: "fashion", name: "Vintage Styling Session",
    description: "1hr virtual wardrobe audit. She'll help you shop your own closet before buying anything new.",
    price: "£55", gradientA: "#C084FC", gradientB: "#818CF8",
    badge: "TOP SELLER", saves: 134, sharedClub: "The Closet",
  },
  {
    id: "3", brand: "Amara's Kitchen", seller: "Amara T.", seller_initial: "A", seller_color: "#E8A050",
    category: "food", name: "West African Spice Bundle",
    description: "Hand-blended suya spice, egusi mix, and jollof seasoning. Ships UK-wide.",
    price: "£18", gradientA: "#F7971E", gradientB: "#F44336",
    saves: 67, sharedClub: "African Girls Club",
  },
  {
    id: "4", brand: "Temi Digital", seller: "Temi A.", seller_initial: "T", seller_color: "#83C5A0",
    category: "digital", name: "Natural Hair Care Guide PDF",
    description: "57-page guide covering porosity, growth, protective styles, and product ingredients to avoid.",
    price: "£12", gradientA: "#84FAB0", gradientB: "#8FD3F4",
    badge: "NEW", saves: 201,
  },
  {
    id: "5", brand: "Studio Sofia", seller: "Sofia W.", seller_initial: "S", seller_color: "#FF69B4",
    category: "wellness", name: "1:1 Pilates Drop-In",
    description: "Private reformer session in Williamsburg. Beginner-friendly. DM to book.",
    price: "$65", gradientA: "#FFB3D9", gradientB: PINK,
    saves: 45, sharedClub: "Wellness & Pilates",
  },
  {
    id: "6", brand: "Kezia Creates", seller: "Kezia M.", seller_initial: "K", seller_color: "#EC4899",
    category: "fashion", name: "Custom Press-On Nails",
    description: "Bespoke handmade press-ons. You send her your inspo, she builds the set. 2-week turnaround.",
    price: "£35", gradientA: "#FF9A9E", gradientB: "#FAD0C4",
    saves: 178, sharedClub: "Beauty & Nails",
  },
];

// ── Shop card ─────────────────────────────────────────────────────────────────

function ShopCard({ item, saved, onSave }: { item: ShopItem; saved: boolean; onSave: () => void }) {
  const meta = CAT_META[item.category];
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: `${item.gradientA}18`, transform: "rotate(1.2deg)", zIndex: 0 }} />
      <div style={{
        position: "relative", zIndex: 1, borderRadius: 18, overflow: "hidden",
        background: `${GRAIN}, white`, backgroundSize: "200px 200px, auto",
        boxShadow: "0 6px 24px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.05)",
      }}>
        {/* Product color block */}
        <div style={{
          height: 110, background: `linear-gradient(135deg, ${item.gradientA}, ${item.gradientB})`,
          position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {item.badge && (
            <div style={{
              position: "absolute", top: 10, left: 10,
              background: item.badge === "BB FOUNDER" ? DARK : item.badge === "TOP SELLER" ? "#C2510F" : PINK,
              borderRadius: 99, padding: "3px 9px",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.18em" }}>{item.badge}</p>
            </div>
          )}
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 16, color: "rgba(255,255,255,0.7)", textAlign: "center", padding: "0 12px" }}>{item.name}</p>
        </div>

        <div style={{ padding: "12px 14px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: item.sharedClub ? 3 : 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: `linear-gradient(135deg, ${item.seller_color}, ${item.seller_color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "white" }}>{item.seller_initial}</div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 600, color: "#888" }}>{item.seller}</p>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: meta.color, background: `${meta.color}10`, borderRadius: 99, padding: "2px 7px" }}>{meta.label.toUpperCase()}</span>
          </div>
          {item.sharedClub && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK, marginBottom: 6, letterSpacing: "0.02em" }}>
              ✦ Also in {item.sharedClub}
            </p>
          )}

          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 4, lineHeight: 1.3 }}>{item.name}</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.55)", lineHeight: 1.5, marginBottom: 12 }}>{item.description}</p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 18, fontWeight: 900, color: DARK }}>{item.price}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={onSave} style={{ width: 32, height: 32, borderRadius: "50%", background: saved ? `${PINK}12` : "rgba(0,0,0,0.04)", border: `1.5px solid ${saved ? PINK : "rgba(0,0,0,0.08)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill={saved ? PINK : "none"} stroke={saved ? PINK : "#aaa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
              <button style={{ padding: "7px 14px", borderRadius: 99, background: `linear-gradient(135deg, ${PINK}, #C4005A)`, border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white", boxShadow: `0 3px 12px ${PINK}40` }}>
                Shop →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>("all");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = activeCategory === "all" ? MOCK_ITEMS : MOCK_ITEMS.filter(i => i.category === activeCategory);
  const cats = Object.entries(CAT_META) as [ShopCategory, { label: string; color: string }][];

  return (
    <div style={{ background: "linear-gradient(160deg, #FFF0F8 0%, #FFF5F0 60%, #F0F4FF 100%)", minHeight: "100vh", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>

      {/* Header */}
      <div style={{
        padding: "56px 22px 24px",
        background: `linear-gradient(150deg, #C4005A 0%, ${PINK} 60%, #FF5BAD 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.07), transparent)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Link href="/member/avenue" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.15)", borderRadius: 99, padding: "4px 12px", border: "1px solid rgba(255,255,255,0.2)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.2em" }}>134 BRANDS LIVE</p>
          </div>
        </div>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 44, color: "white", lineHeight: 1, marginBottom: 6 }}>The Shop.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.65)" }}>Her brand. Her world.</p>
      </div>

      {/* Category filter */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(250,246,242,0.96)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 8, padding: "10px 18px" }}>
          {cats.map(([id, meta]) => (
            <button key={id} onClick={() => setActiveCategory(id)} style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 99,
              background: activeCategory === id ? meta.color : "white",
              border: `1.5px solid ${activeCategory === id ? meta.color : "rgba(0,0,0,0.08)"}`,
              color: activeCategory === id ? "white" : "#888",
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700,
              cursor: "pointer", transition: "all 0.15s",
            }}>{meta.label}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: "18px 18px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {filtered.map(item => (
          <ShopCard
            key={item.id} item={item}
            saved={saved.has(item.id)}
            onSave={() => setSaved(prev => { const s = new Set(prev); s.has(item.id) ? s.delete(item.id) : s.add(item.id); return s; })}
          />
        ))}
      </div>

      {/* Sell CTA */}
      <div style={{ margin: "24px 18px 0", borderRadius: 20, background: DARK, padding: "22px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 4 }}>Have something to sell?</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>BloomBay is built for women building things. List your product or service.</p>
        <button style={{ padding: "12px 22px", borderRadius: 50, background: `linear-gradient(135deg, ${PINK}, #C4005A)`, border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: "white", letterSpacing: "0.06em", boxShadow: `0 4px 16px ${PINK}44` }}>
          List on The Shop →
        </button>
      </div>
    </div>
  );
}
