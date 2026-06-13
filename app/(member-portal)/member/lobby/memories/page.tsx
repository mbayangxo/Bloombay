"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";

const MEMORIES = [
  { emoji: "🌅", title: "Williamsburg morning",  date: "May 12, 2026", caption: "Matcha and good talk at 7am",          color: "#FFF0F5", rotate: "-2.5deg", months: "May" },
  { emoji: "🍷", title: "Rooftop wine hour",      date: "May 8, 2026",  caption: "The view was unreal",                 color: "#FFE8F3", rotate:  "2deg",   months: "May" },
  { emoji: "🎨", title: "Paint + sip night",      date: "Apr 30, 2026", caption: "No one painted straight",             color: "#FFF5F8", rotate: "-1.5deg", months: "Apr" },
  { emoji: "🏃‍♀️", title: "Run club Sunday",       date: "Apr 27, 2026", caption: "6am run → pastries. Always.",        color: "#FFE0EE", rotate:  "3deg",   months: "Apr" },
  { emoji: "🧘", title: "Pilates morning",        date: "Apr 20, 2026", caption: "Core work and club chat after",       color: "#FFF0F5", rotate: "-2deg",   months: "Apr" },
  { emoji: "☕", title: "Matcha café crawl",      date: "Apr 14, 2026", caption: "Three cafés, four girls",             color: "#FFF5F8", rotate:  "1.5deg", months: "Apr" },
  { emoji: "🌸", title: "Brooklyn Botanic Garden", date: "Mar 30, 2026", caption: "Cherry blossom season. We cried.",   color: "#FFE8F3", rotate: "-1deg",   months: "Mar" },
  { emoji: "🎭", title: "Off-Broadway show",       date: "Mar 22, 2026", caption: "Last-minute tickets, best night",    color: "#FFF0F5", rotate:  "2.5deg", months: "Mar" },
];

export default function BloomTrailsPage() {
  const [adding, setAdding] = useState(false);
  const [newCaption, setNewCaption] = useState("");

  const months = [...new Set(MEMORIES.map(m => m.months))];

  return (
    <div style={{ minHeight: "100vh", background: PAPER, paddingBottom: 96 }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${DARK} 0%, #2A0818 50%, #480C24 100%)`,
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 56px)",
        paddingBottom: 32, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Back */}
        <div style={{ padding: "0 20px 16px", position: "relative", zIndex: 1 }}>
          <Link href="/member/lounge" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em" }}>APARTMENT</span>
          </Link>
        </div>

        <div style={{ padding: "0 20px", position: "relative", zIndex: 1 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.3em", color: "rgba(255,31,125,0.6)", marginBottom: 6 }}>🎈 BLOOM TRAILS</p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(38px, 10vw, 52px)", color: "rgba(255,238,220,0.92)", lineHeight: 0.94, margin: 0 }}>Your Story.</h1>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>{MEMORIES.length} moments collected</p>
        </div>
      </div>

      {/* Add memory banner */}
      <div style={{ padding: "20px 20px 0" }}>
        {!adding ? (
          <button
            onClick={() => setAdding(true)}
            style={{
              width: "100%", padding: "14px 18px", borderRadius: 16,
              border: `1.5px dashed rgba(255,31,125,0.3)`,
              background: "rgba(255,31,125,0.04)",
              display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            }}>
            <span style={{ fontSize: 20 }}>🎈</span>
            <span style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,31,125,0.55)" }}>Add a bloom trail…</span>
          </button>
        ) : (
          <div style={{ background: "white", borderRadius: 16, padding: "16px", boxShadow: "0 4px 16px rgba(255,31,125,0.1)", border: "1.5px solid rgba(255,31,125,0.15)" }}>
            <textarea
              value={newCaption}
              onChange={e => setNewCaption(e.target.value)}
              placeholder="What happened? Where were you? How did it feel?"
              rows={3}
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-caveat)", fontSize: 16, color: DARK, lineHeight: 1.65, resize: "none", boxSizing: "border-box" as const }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
              <button onClick={() => { setAdding(false); setNewCaption(""); }} style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "#bbb", background: "none", border: "none", cursor: "pointer", padding: "6px 12px" }}>Cancel</button>
              <button
                disabled={!newCaption.trim()}
                style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white", background: newCaption.trim() ? PINK : "#F0E0E8", border: "none", borderRadius: 999, padding: "8px 18px", cursor: newCaption.trim() ? "pointer" : "default" }}>
                Save Trail
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Memories by month */}
      <div style={{ padding: "24px 0 0" }}>
        {months.map(month => (
          <div key={month} style={{ marginBottom: 28 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)", padding: "0 20px 14px" }}>{month.toUpperCase()} 2026</p>

            {/* Polaroid scroll row */}
            <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "8px 20px 16px", scrollbarWidth: "none" as const }}>
              {MEMORIES.filter(m => m.months === month).map((m, i) => (
                <div key={i} style={{ flexShrink: 0, transform: `rotate(${m.rotate})`, transformOrigin: "center top", cursor: "pointer" }}>
                  <div style={{
                    padding: "10px 10px 34px", background: m.color, width: 138,
                    borderRadius: 4, boxShadow: "0 8px 28px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
                  }}>
                    {/* Photo area */}
                    <div style={{ width: "100%", height: 108, background: `linear-gradient(135deg, ${m.color}CC 0%, ${m.color}44 100%)`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 48, opacity: 0.75 }}>{m.emoji}</span>
                    </div>
                    {/* Caption */}
                    <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#444", textAlign: "center" as const, lineHeight: 1.4, marginTop: 8 }}>{m.title}</p>
                    <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "#bbb", textAlign: "center" as const, marginTop: 3 }}>{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom quote */}
      <div style={{ padding: "8px 20px 0", textAlign: "center" as const }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, color: "rgba(255,31,125,0.4)", lineHeight: 1.65 }}>
          &ldquo;Every trail is a reminder that you showed up.&rdquo;
        </p>
      </div>
    </div>
  );
}
