"use client";

import React, { useState } from "react";
import {
  DARK,
  PAPER_TEX,
} from "@/lib/city/tokens";
import {
  GO_TYPES, GO_EXPERIENCES,
} from "@/lib/city/city-data";
import { BackBtn } from "./shared";

export function GoPage({ onBack }: { onBack: () => void }) {
  const [activeType, setActiveType] = useState("All");

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

      {/* Type filters */}
      <div style={{ background: "#E8F4FF", borderBottom: "1px solid rgba(58,95,205,0.15)", paddingBottom: 1 }}>
        <div style={{ display: "flex", gap: 0, overflowX: "auto", padding: "10px 16px", scrollbarWidth: "none" as const }}>
          {GO_TYPES.map(t => (
            <button key={t} onClick={() => setActiveType(t)} style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 999, marginRight: 6,
              border: `1.5px solid ${activeType === t ? "#3A5FCD" : "rgba(58,95,205,0.25)"}`,
              background: activeType === t ? "#3A5FCD" : "rgba(255,255,255,0.7)",
              color: activeType === t ? "white" : "rgba(40,70,160,0.7)",
              fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer",
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Experience cards */}
      <div style={{ padding: "14px 14px 0" }}>
        {GO_EXPERIENCES.map((exp, i) => (
          <div key={exp.id} style={{
            backgroundImage: `${PAPER_TEX}`,
            backgroundSize: "200px 200px",
            backgroundColor: exp.bg,
            borderRadius: 18, marginBottom: 10, overflow: "hidden",
            height: i === 0 ? 170 : 100,
            position: "relative",
            boxShadow: `0 4px 16px rgba(0,0,0,0.1), 0 1px 0 ${exp.accent}44 inset`,
          }}>
            {/* Left accent bar */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${exp.accent}, ${exp.accent}88)` }}/>
            {/* Glow */}
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 30%, ${exp.accent}18 0%, transparent 60%)` }}/>
            {/* Content */}
            <div style={{ position: "absolute", inset: 0, padding: i === 0 ? "22px 20px 18px 18px" : "14px 16px 12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ background: `${exp.accent}22`, border: `1px solid ${exp.accent}88`, borderRadius: 999, padding: "2px 9px" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: exp.accent, letterSpacing: "0.1em" }}>{exp.type}</span>
                  </div>
                  {"tag" in exp && exp.tag && (
                    <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 999, padding: "2px 9px" }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "rgba(40,60,120,0.7)", letterSpacing: "0.08em" }}>{exp.tag}</span>
                    </div>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: i === 0 ? 22 : 15, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.15 }}>{exp.name}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(40,60,100,0.5)", letterSpacing: "0.1em" }}>{exp.hood}</p>
                {"going" in exp && exp.going && (
                  <div style={{ background: `${exp.accent}22`, border: `1px solid ${exp.accent}66`, borderRadius: 999, padding: "3px 10px" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: exp.accent }}>{exp.going} going</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* This Week editorial */}
        <div style={{
          backgroundImage: `${PAPER_TEX}`,
          backgroundSize: "200px 200px",
          backgroundColor: "#EAF2FF",
          borderRadius: 18, padding: "20px 18px", marginBottom: 14,
          border: "1px solid rgba(58,95,205,0.18)",
          boxShadow: "0 4px 16px rgba(58,95,205,0.1)",
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "#3A5FCD", marginBottom: 8 }}>THIS WEEK IN NYC ✦</p>
          {["MOMA: New Acquisitions","Brooklyn Botanic: Cherry Blossoms","Jazz at Lincoln Center: Fri/Sat","Governors Ball: Week 2"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9, paddingBottom: 9, borderBottom: i < 3 ? "1px solid rgba(58,95,205,0.12)" : "none" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3A5FCD", flexShrink: 0 }}/>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(30,50,120,0.78)" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
