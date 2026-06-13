"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";

const BOUQUET = [
  { name: "Aaliyah M.", neighborhood: "Crown Heights", color: "#FF1F7D", initial: "A", since: "Jan 2026", note: "She always knows the right thing to say." },
  { name: "Sofia K.",   neighborhood: "Williamsburg",  color: "#FF69B4", initial: "S", since: "Feb 2026", note: "My travel buddy and brunch date for life." },
  { name: "Kelechi O.", neighborhood: "Flatbush",      color: "#C084FC", initial: "K", since: "Mar 2026", note: "The culture oracle. She knows everything." },
  { name: "Naomi B.",   neighborhood: "SoHo",          color: "#FF69B4", initial: "N", since: "Apr 2026", note: "Quiet until she says the funniest thing." },
];

const MAX_BOUQUET = 12;

export default function BouquetPage() {
  const [selected, setSelected] = useState<typeof BOUQUET[0] | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: PAPER, paddingBottom: 96 }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, #1C0010 0%, #380820 50%, #5C0C34 100%)`,
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 56px)",
        paddingBottom: 32, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

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
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.3em", color: "rgba(255,31,125,0.65)", marginBottom: 6 }}>💐 YOUR BOUQUET</p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(38px, 10vw, 52px)", color: "rgba(255,238,220,0.92)", lineHeight: 0.94, margin: 0 }}>Your 12.</h1>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>The women you carry closest</p>
        </div>
      </div>

      {/* Counter */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(255,31,125,0.07)" }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)" }}>BOUQUET SIZE</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: PINK, lineHeight: 1.1, marginTop: 2 }}>
              {BOUQUET.length} <span style={{ color: "rgba(0,0,0,0.2)", fontSize: 16 }}>of {MAX_BOUQUET}</span>
            </p>
          </div>
          {/* Petal progress */}
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" as const, maxWidth: 100, justifyContent: "flex-end" }}>
            {Array.from({ length: MAX_BOUQUET }).map((_, i) => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                background: i < BOUQUET.length ? PINK : "rgba(0,0,0,0.08)",
                transform: `rotate(${i * 30}deg)`,
                boxShadow: i < BOUQUET.length ? `0 1px 4px ${PINK}44` : "none",
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Bouquet grid */}
      <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {BOUQUET.map((w, i) => (
          <button key={w.name} onClick={() => setSelected(w)}
            style={{
              background: "white", borderRadius: 20, padding: "16px",
              display: "flex", alignItems: "center", gap: 14, textAlign: "left" as const,
              border: "none", cursor: "pointer", width: "100%",
              boxShadow: "0 3px 14px rgba(255,31,125,0.08), 0 1px 3px rgba(0,0,0,0.04)",
              transition: "transform 0.12s",
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>

            {/* Petal number */}
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${w.color}18`, border: `1.5px solid ${w.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, color: w.color }}>#{i + 1}</span>
            </div>

            {/* Avatar */}
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${w.color}, ${w.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 20, color: "white", flexShrink: 0, boxShadow: `0 4px 14px ${w.color}33` }}>
              {w.initial}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: DARK, marginBottom: 2 }}>{w.name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#bbb" }}>{w.neighborhood} · since {w.since}</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#888", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{w.note}</p>
            </div>

            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ))}

        {/* Add slots */}
        {Array.from({ length: MAX_BOUQUET - BOUQUET.length }).map((_, i) => (
          <Link key={`empty-${i}`} href="/member/match" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(255,31,125,0.03)", borderRadius: 20, padding: "16px",
              display: "flex", alignItems: "center", gap: 14,
              border: "1.5px dashed rgba(255,31,125,0.18)",
            }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", border: `1.5px dashed rgba(255,31,125,0.25)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 20, color: "rgba(255,31,125,0.3)" }}>+</span>
              </div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,31,125,0.4)" }}>Add to your bouquet</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Profile sheet */}
      {selected && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 40 }} onClick={() => setSelected(null)} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: PAPER, borderRadius: "24px 24px 0 0", maxHeight: "75vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
              <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.12)" }} />
            </div>
            <div style={{ padding: "20px 24px 40px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${selected.color}, ${selected.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 30, color: "white", boxShadow: `0 6px 24px ${selected.color}44`, flexShrink: 0 }}>
                  {selected.initial}
                </div>
                <div style={{ flex: 1, paddingTop: 6 }}>
                  <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 24, color: DARK, margin: 0, lineHeight: 1 }}>{selected.name}</h2>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#aaa", marginTop: 4 }}>{selected.neighborhood} · since {selected.since}</p>
                  <span style={{ display: "inline-block", marginTop: 8, fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.16em", color: "white", background: PINK, borderRadius: 4, padding: "3px 10px" }}>✦ BOUQUET</span>
                </div>
              </div>
              {selected.note && (
                <div style={{ background: "#FFF5F8", borderRadius: 16, padding: "14px 16px", borderLeft: `3px solid ${PINK}`, marginBottom: 20 }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, color: "#444", lineHeight: 1.6 }}>"{selected.note}"</p>
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <Link href="/member/messages" style={{ flex: 1, textDecoration: "none" }}>
                  <div style={{ padding: "13px 0", borderRadius: 14, background: PINK, color: "white", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, textAlign: "center" as const, boxShadow: `0 4px 16px ${PINK}44` }}>
                    Message →
                  </div>
                </Link>
                <button onClick={() => setSelected(null)} style={{ width: 48, borderRadius: 14, background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
