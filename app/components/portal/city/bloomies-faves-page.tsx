"use client";

import React, { useState } from "react";
import {
  PINK,
  PAPER_TEX, DARK_GRAIN, LINEN_TEX,
} from "@/lib/city/tokens";
import {
  BLOOM_PICKS,
} from "@/lib/city/city-data";
import { BackBtn } from "./shared";

export function BloomiesFavoritesPage({ onBack }: { onBack: () => void }) {
  const [saved, setSaved] = useState<number[]>([]);
  function toggleSave(id: number) { setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]); }

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

      {/* Community stats */}
      <div style={{ backgroundImage: `${DARK_GRAIN}`, backgroundSize: "160px 160px", backgroundColor: "#1A0810", padding: "14px 18px 12px", display: "flex", gap: 0 }}>
        {[["1,240+", "saves this month"], ["324", "bloomies contributed"], ["6", "categories"]].map(([val, label], i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ width: 1, background: "rgba(212,168,83,0.15)", margin: "0 16px" }}/>}
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: PINK }}>{val}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", marginTop: 1 }}>{label}</p>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div style={{ padding: "16px 14px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "#9A7A6A", marginBottom: 12 }}>THE BLOOMIES LIST</p>

        {BLOOM_PICKS.map((pick, i) => (
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
                  <button onClick={() => toggleSave(pick.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={saved.includes(pick.id) ? PINK : "none"} stroke={PINK} strokeWidth="2.2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
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
          <div style={{ backgroundImage: `${DARK_GRAIN}`, backgroundSize: "160px 160px", backgroundColor: "#1A0C08", display: "inline-flex", borderRadius: 999, padding: "9px 22px" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: PINK, letterSpacing: "0.1em" }}>✦ SAVE A SPOT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
