"use client";

import React from "react";
import { PINK, PAPER_TEX } from "@/lib/city/tokens";

// ── Back button shared ────────────────────────────────────────────────────────
export function BackBtn({ onBack, label = "CITY" }: { onBack: () => void; label?: string }) {
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

export function StarRow({ color = "#E8336E", size = 9 }: { color?: string; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[0,1,2,3,4].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
      ))}
    </span>
  );
}

export function Tape({ rotate = 0, top = -8, left = "50%" }: { rotate?: number; top?: number; left?: string }) {
  return (
    <div style={{
      position: "absolute", top, left, transform: `translateX(-50%) rotate(${rotate}deg)`,
      width: 54, height: 16, background: "rgba(255,248,230,0.55)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)", zIndex: 3,
    }}/>
  );
}

export function PaperCard({ children, rotate = 0, style = {} }: { children: React.ReactNode; rotate?: number; style?: React.CSSProperties }) {
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
