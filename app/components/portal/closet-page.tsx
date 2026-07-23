"use client";

import { useState } from "react";
import Link from "next/link";
import { FashionPostSheet } from "@/app/components/portal/fashion-post-sheet";

const PINK  = "#FF1F7D";
const CREAM = "#F6F1EB";
const DARK  = "#1C1B1C";

const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

type Category = "all" | "fits" | "advice" | "inspo" | "deals" | "tips";

const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string }> = {
  all:    { label: "All",    emoji: "✦",  color: DARK },
  fits:   { label: "Fits",   emoji: "👗",  color: "#C084FC" },
  advice: { label: "Advice", emoji: "💬",  color: "#FF69B4" },
  inspo:  { label: "Inspo",  emoji: "✨",  color: "#C084FC" },
  deals:  { label: "Deals",  emoji: "🏷️", color: "#E8A050" },
  tips:   { label: "Tips",   emoji: "💡",  color: PINK },
};

// ── ClosetPage ───────────────────────────────────────────────────────────────────
export function ClosetPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div style={{
      minHeight: "100dvh",
      background: CREAM,
      backgroundImage: PAPER_TEX,
      paddingBottom: 120,
      backgroundRepeat: "repeat",
      fontFamily: "var(--font-jost), sans-serif",
      color: DARK,
      overflowX: "hidden",
    }}>
      {/* Sticky header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        background: "rgba(246,241,235,0.9)",
        borderBottom: "1px solid rgba(28,27,28,0.08)",
        padding: "14px 18px 10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/member/avenue" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(28,27,28,0.06)", color: DARK,
              textDecoration: "none", fontSize: 16, flexShrink: 0,
            }}>←</Link>
            <div>
              <h1 style={{
                fontFamily: "var(--font-playfair)", fontStyle: "italic",
                fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.1,
                background: `linear-gradient(90deg, #E8007A, ${PINK}, #FF6B9D)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                The Closet.
              </h1>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, margin: 0, color: "rgba(28,27,28,0.5)", lineHeight: 1.2 }}>
                Fits. Advice. Style. ✦
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Category filter strip */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "14px 18px", scrollbarWidth: "none" }}>
        {(Object.keys(CATEGORY_META) as Category[]).map(c => {
          const m = CATEGORY_META[c];
          const active = activeCategory === c;
          return (
            <button key={c} onClick={() => setActiveCategory(c)}
              style={{
                flexShrink: 0, padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                border: active ? `1.5px solid ${PINK}` : "1.5px solid rgba(28,27,28,0.15)",
                background: active ? PINK : "transparent",
                color: active ? "#fff" : DARK,
                fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600,
                letterSpacing: "0.03em", transition: "all 0.15s",
              }}>
              {m.emoji} {m.label}
            </button>
          );
        })}
      </div>

      {/* Feed */}
      <div style={{ padding: "0 18px 120px" }}>
        <p style={{ textAlign: "center", color: "rgba(28,27,28,0.4)", fontFamily: "var(--font-caveat)", fontSize: 18, marginTop: 48 }}>
          Nothing published yet
        </p>
      </div>

      {/* The Hanger — sell & swap banner */}
      <div style={{ padding: "4px 18px 120px" }}>
        <Link href="/member/hanger" style={{ textDecoration: "none", display: "block" }}>
          <div style={{
            background: "linear-gradient(135deg, #1C1B1C 0%, #2E0A1C 100%)",
            borderRadius: 20,
            padding: "20px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: `0 6px 24px rgba(255,31,125,0.18)`,
            border: "1px solid rgba(255,31,125,0.12)",
          }}>
            {/* Hanger icon — Silhouette Rule: hook = petal arc */}
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: `${PINK}18`,
              border: `1.5px solid ${PINK}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M13 5 C13 5 15.5 3 16 5 C16.5 7 14 8 14 8" stroke={PINK} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                <path d="M14 8 L20 15 C22 17 21 20 19 20 L7 20 C5 20 4 17 6 15 Z" stroke={PINK} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill={`${PINK}18`}/>
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 3 }}>THE HANGER</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 16, color: "rgba(255,238,220,0.92)", lineHeight: 1.2, margin: 0 }}>Sell & swap with the girls.</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>List pieces. Buy from members. Ship it out.</p>
            </div>

            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </Link>
      </div>

      {/* FAB — fixed bottom-right */}
      <button
        onClick={() => setShowCreate(true)}
        style={{
          position: "fixed", bottom: 28, right: 20, zIndex: 40,
          width: 52, height: 52, borderRadius: "50%",
          background: PINK, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 20px ${PINK}60`,
          fontSize: 24, color: "#fff",
          transition: "transform 0.15s",
        }}
        aria-label="Create post"
      >
        +
      </button>

      {showCreate && (
        <FashionPostSheet
          context="avenue"
          category="fits"
          onClose={() => setShowCreate(false)}
          onPosted={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
