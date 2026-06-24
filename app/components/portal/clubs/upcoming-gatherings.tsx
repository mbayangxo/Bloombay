"use client";

import { useState } from "react";
import { WashiTape, TornEdge } from "../scrapbook";
import { PINK, DARK, PAPER, PAPER_TEX, type RealGathering } from "./shared";

const ONBOARDING_STEPS = [
  "Join 3 clubs",
  "Save 5 places",
  "Attend 1 gathering",
  "Introduce yourself",
];

export function UpcomingGatherings({ happenings }: { happenings: RealGathering[] }) {
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>([false, false, false, false]);
  const allDone = checkedSteps.every(Boolean);

  return (
    <section style={{ padding: "0 18px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

      {/* TODAY'S HAPPENINGS — paper scrap */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%) rotate(-2deg)", zIndex: 5 }}>
          <WashiTape color="yellow" width={80} height={18} />
        </div>
        <div style={{
          backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px",
          padding: "20px 14px 0", boxShadow: "3px 5px 22px rgba(0,0,0,0.5)",
          transform: "rotate(-0.8deg)", position: "relative", overflow: "hidden",
        }}>
          <p style={{ fontSize: 7, fontWeight: 800, letterSpacing: "0.22em", color: DARK, opacity: 0.35, marginBottom: 12 }}>UPCOMING</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {happenings.length === 0 && (
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 10, color: DARK, opacity: 0.4 }}>Check back soon.</p>
            )}
            {happenings.map((h, i) => {
              const d = new Date(h.starts_at);
              const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
              const initial = h.title[0]?.toUpperCase() ?? "✦";
              const avatarColor = [PINK, "#E8006A", "#C80060", "#FF5BAD", "#A8004C"][i % 5];
              return (
                <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: avatarColor, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10, flexShrink: 0 }}>
                    {initial}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 10, color: DARK, lineHeight: 1.2 }}>{h.title}</p>
                    <p style={{ fontSize: 9, color: DARK, opacity: 0.45, fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                      {[h.venue || h.neighborhood, timeStr].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <button style={{ marginTop: 12, marginBottom: 10, fontSize: 8, fontWeight: 800, letterSpacing: "0.14em", color: PINK, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            SEE FULL CALENDAR →
          </button>
          <TornEdge color="#FFF0F6" height={14} style={{ marginLeft: -14, marginRight: -14 }} />
        </div>
      </div>

      {/* NEW HERE — interactive checklist */}
      {!allDone && (
        <div style={{
          background: "#FFF8F0", backgroundImage: PAPER_TEX, backgroundSize: "200px 200px",
          padding: "18px 14px", boxShadow: "3px 5px 22px rgba(0,0,0,0.5)",
          transform: "rotate(1.2deg)", position: "relative",
        }}>
          <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 12 }}>NEW HERE?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {ONBOARDING_STEPS.map((text, i) => {
              const done = checkedSteps[i];
              return (
                <button key={i}
                  onClick={() => setCheckedSteps(prev => { const n=[...prev]; n[i]=!n[i]; return n; })}
                  style={{ display: "flex", gap: 8, alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" as const, WebkitTapHighlightColor: "transparent" }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    border: `1.5px solid ${done ? PINK : "rgba(0,0,0,0.2)"}`,
                    background: done ? PINK : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s",
                  }}>
                    {done && (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 10, color: DARK, opacity: done ? 0.35 : 0.7, lineHeight: 1.4, textDecoration: done ? "line-through" : "none" }}>{text}</span>
                </button>
              );
            })}
          </div>
          <button style={{ marginTop: 14, fontSize: 8, fontWeight: 800, letterSpacing: "0.12em", color: PINK, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            START YOUR JOURNEY →
          </button>
        </div>
      )}
    </section>
  );
}
