"use client";

import React, { useState } from "react";
import {
  PAPER_TEX, DARK_GRAIN, LINEN_TEX,
} from "@/lib/city/tokens";
import {
  SOLO_MOODS, SOLO_ACTIVITIES,
} from "@/lib/city/city-data";
import { BackBtn } from "./shared";

export function SoloPage({ onBack }: { onBack: () => void }) {
  const [mood, setMood] = useState("Quiet");

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
        {/* Mood chips */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "#9A7A6A", marginBottom: 8 }}>WHAT MOOD ARE YOU IN?</p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" as const }}>
            {SOLO_MOODS.map(m => (
              <button key={m} onClick={() => setMood(m)} style={{
                padding: "6px 14px", borderRadius: 999,
                border: `1.5px solid ${mood === m ? "#7A9A6C" : "rgba(120,90,80,0.2)"}`,
                background: mood === m ? "#7A9A6C" : "transparent",
                color: mood === m ? "white" : "#8A6A5A",
                fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700,
                letterSpacing: "0.05em", cursor: "pointer",
              }}>{m}</button>
            ))}
          </div>
        </div>

        {/* Activity cards */}
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "#9A7A6A", marginBottom: 10 }}>MADE FOR SOLO TIME</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {SOLO_ACTIVITIES.map((act, i) => (
            <div key={act.id} style={{
              backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
              backgroundSize: "200px 200px, 80px 80px",
              backgroundColor: act.bg,
              borderRadius: 18, overflow: "hidden",
              boxShadow: "0 3px 16px rgba(80,60,40,0.1), inset 0 1px 0 rgba(255,255,255,0.85)",
              display: "flex", gap: 0,
              animation: `soloFade 0.5s ease-out both`,
              animationDelay: `${i * 0.07}s`,
            }}>
              {/* Accent bar */}
              <div style={{ width: 5, flexShrink: 0, background: `linear-gradient(180deg, ${act.accent}, ${act.accent}66)` }}/>
              <div style={{ flex: 1, padding: "14px 14px 12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ display: "inline-flex", background: `${act.accent}44`, borderRadius: 999, padding: "2px 8px", marginBottom: 5 }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "#4A3A2A", letterSpacing: "0.1em" }}>{act.type}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, fontStyle: "italic", color: "#2A1A10", lineHeight: 1.1 }}>{act.name}</p>
                  </div>
                  <div style={{ backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px", backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "4px 8px", marginLeft: 8, flexShrink: 0 }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: "#6A5A4A", letterSpacing: "0.04em" }}>{act.time}</p>
                  </div>
                </div>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12.5, color: "#6A5A4A", lineHeight: 1.4, opacity: 0.9 }}>"{act.note}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* Solo editorial card */}
        <div style={{
          backgroundImage: `${DARK_GRAIN}, linear-gradient(135deg, #1C2814 0%, #283820 60%, #1A2610 100%)`,
          backgroundSize: "160px 160px, 100% 100%",
          borderRadius: 18, padding: "22px 20px", marginBottom: 14,
          boxShadow: "0 8px 32px rgba(30,40,20,0.35)",
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "#A8C97A", marginBottom: 10 }}>THIS WEEK&apos;S SOLO RITUAL</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2, marginBottom: 8 }}>Saturday Morning<br />at the Brooklyn Botanic</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(200,230,180,0.65)", lineHeight: 1.6, marginBottom: 14 }}>
            Open at 8am for members. Quiet paths, zero crowds, cherry blossoms still holding.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "#A8C97A", borderRadius: 999, padding: "6px 16px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.08em" }}>34 BLOOMIES GOING</span>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(200,230,180,0.5)" }}>solo ✦ together</span>
          </div>
        </div>
      </div>
    </div>
  );
}
