"use client";

import { WashiTape, GoldStar } from "../scrapbook";
import { DARK, PINK, CREAM, PAPER_TEX } from "./shared";

const VIBES = ["creative", "wellness", "adventure", "career", "night out", "faith", "fashion", "foodie"];

export function ExploreByVibe({ activeVibe, onVibeChange }: {
  activeVibe: string | null;
  onVibeChange: (v: string | null) => void;
}) {
  return (
    <section style={{ padding: "0 18px 32px" }}>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: -10, right: 20, zIndex: 5 }}>
          <WashiTape color="pink" width={56} height={16} rot={2} />
        </div>
        <div style={{
          background: CREAM, backgroundImage: PAPER_TEX, backgroundSize: "200px 200px",
          padding: "20px 16px 18px", boxShadow: "3px 6px 24px rgba(0,0,0,0.5)",
          transform: "rotate(0.4deg)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: DARK, opacity: 0.5 }}>EXPLORE CLUBS BY VIBE</p>
            <GoldStar size={14} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {VIBES.map(vibe => (
              <button key={vibe} onClick={() => onVibeChange(activeVibe === vibe ? null : vibe)} style={{
                padding: "6px 14px", borderRadius: 20,
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                border: `1.5px solid ${activeVibe === vibe ? PINK : "rgba(255,31,125,0.3)"}`,
                background: activeVibe === vibe ? PINK : "rgba(255,31,125,0.06)",
                color: activeVibe === vibe ? "white" : PINK,
                transition: "all 0.15s",
              }}>
                {vibe}
              </button>
            ))}
            <button style={{ padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", border: `1.5px solid ${PINK}`, background: PINK, color: "white" }}>
              all vibes →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
