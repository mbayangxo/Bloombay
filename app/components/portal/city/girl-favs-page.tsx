"use client";

import React from "react";
import {
  PINK,
  PAPER_TEX, DARK_GRAIN, LINEN_TEX,
} from "@/lib/city/tokens";
import {
  GIRL_FAVS,
} from "@/lib/city/city-data";
import { BackBtn } from "./shared";

export function GirlFavsPage({ onBack }: { onBack: () => void }) {
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
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Most saved<br />this month.</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 5 }}>by the bloomies community ♡</p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ backgroundImage: `${DARK_GRAIN}`, backgroundSize: "160px 160px", backgroundColor: "#1A0818", padding: "12px 18px", display: "flex", gap: 0 }}>
        {[["3,200+", "total saves"], ["847", "this month"], ["5", "top spots"]].map(([val, label], i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ width: 1, background: "rgba(255,31,125,0.15)", margin: "0 16px" }} />}
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: PINK }}>{val}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", marginTop: 1 }}>{label}</p>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Ranked list */}
      <div style={{ padding: "20px 16px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "#9A7A6A", marginBottom: 14 }}>THE RANKING</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {GIRL_FAVS.map((fav, i) => (
            <div key={i} style={{
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
              <span style={{ fontSize: 20, flexShrink: 0 }}>{fav.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 700, color: "white", marginBottom: 2 }}>{fav.name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{fav.neighborhood}</p>
              </div>
              <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: i === 0 ? PINK : "rgba(255,255,255,0.55)" }}>{fav.saves.toLocaleString()}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>SAVES</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
