"use client";

import { useState } from "react";
import { INVITE_DEMO } from "@/lib/events/mock-data";

export function EnvelopeInviteCard({ c, onOpen }: { c: typeof INVITE_DEMO[0]; onOpen: () => void }) {
  const [opened, setOpened] = useState(false);

  function handleOpen() {
    setOpened(true);
    onOpen();
  }

  return (
    <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, overflow: "hidden", position: "relative" }}>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${c.color}, ${c.color}55)` }} />

      {!opened && (
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ position: "relative", height: 54, background: `linear-gradient(145deg, ${c.color}22, ${c.color}08)`, border: `1px solid ${c.color}30`, borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%", clipPath: "polygon(0 0, 50% 100%, 100% 0)", background: `${c.color}18`, borderBottom: `1px solid ${c.color}22` }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", clipPath: "polygon(0 0, 50% 100%, 100% 0)", background: `${c.color}12` }} />
            <span style={{ fontSize: 18, zIndex: 1 }}>💌</span>
          </div>
          <div style={{ height: 32, background: `${c.color}08`, border: `1px solid ${c.color}22`, borderTop: "none", borderRadius: "0 0 10px 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.14em", color: `${c.color}99` }}>SEALED WITH LOVE</p>
          </div>
        </div>
      )}

      <div style={{ padding: opened ? "16px 16px 14px" : "12px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <div style={{ background: `${c.color}22`, border: `1px solid ${c.color}44`, borderRadius: 999, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 10 }}>{c.type === "Birthday" ? "🎂" : c.type === "Wins" ? "✨" : "🌸"}</span>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: c.color, letterSpacing: "0.08em" }}>{c.type.toUpperCase()}</p>
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.4)" }}>{c.date} · {c.time}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${c.color}, ${c.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "2px solid rgba(255,255,255,0.15)" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 900, color: "white" }}>{c.initials}</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.55)", marginBottom: 2 }}>{c.name} is celebrating</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 17, color: "white", lineHeight: 1.1 }}>{c.what}</p>
          </div>
        </div>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.38)", marginBottom: 12 }}>{c.venue}</p>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${c.color}AA, ${c.color}55)`, border: "1.5px solid rgba(255,255,255,0.15)", marginLeft: i > 0 ? -10 : 0 }} />
          ))}
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.45)", marginLeft: 4 }}>{c.confirmed} showing up for her</p>
        </div>

        <button
          onClick={handleOpen}
          style={{ width: "100%", padding: "11px", borderRadius: 14, background: opened ? `${c.color}22` : c.color, border: opened ? `1.5px solid ${c.color}55` : "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 11, letterSpacing: "0.08em", color: opened ? c.color : "white", boxShadow: opened ? "none" : `0 4px 18px ${c.color}55`, transition: "all 0.18s" }}
        >
          {opened ? "Invitation opened ✓" : "Open the invitation →"}
        </button>
      </div>
    </div>
  );
}
