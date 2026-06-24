"use client";

import React from "react";
import {
  PINK,
  DARK_GRAIN,
} from "@/lib/city/tokens";
import {
  GIRL_GEMS,
} from "@/lib/city/city-data";
import { BackBtn } from "./shared";

export function GirlGemsPage({ onBack }: { onBack: () => void }) {
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
          {GIRL_GEMS.map((gem, i) => (
            <div key={i} style={{
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
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${gem.color}99, transparent)` }} />
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: gem.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, boxShadow: `0 4px 16px ${gem.color}66` }}>
                  {gem.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 15, fontWeight: 700, color: "white" }}>{gem.name}</p>
                    <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{gem.type}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500, marginBottom: 8, letterSpacing: "0.04em" }}>{gem.neighborhood}</p>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "rgba(255,220,200,0.7)", lineHeight: 1.6 }}>"{gem.note}"</p>
                </div>
              </div>
            </div>
          ))}
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
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.25)", marginBottom: 14 }}>Bloomies-only submissions</p>
          <button style={{ background: "rgba(255,31,125,0.12)", border: "1px solid rgba(255,31,125,0.25)", borderRadius: 999, padding: "9px 22px", fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: PINK, cursor: "pointer" }}>
            SUBMIT A GEM →
          </button>
        </div>
      </div>
    </div>
  );
}
