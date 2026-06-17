"use client";

import { useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";
const PLUM = "#1A0A2E";

// ── Demo data for current month recap ────────────────────────────────────────
const CURRENT_RECAP = {
  month: "May 2026",
  shortMonth: "May",
  events: 4,
  saves: 18,
  bloomiesMet: 3,
  flowers: 26,
  clubsJoined: 2,
  teaserLine: "May felt very museum and bookstore coded.",
  highlight: "You met 3 new Bloomies through Museum Girls.",
  fullObservation: "May felt very museum and bookstore coded. You attended more events this month than any month before. Here are a few things I think you'll love in June.",
};

// ── Full Recap Sheet ──────────────────────────────────────────────────────────

function RecapSheet({ onClose }: { onClose: () => void }) {
  const r = CURRENT_RECAP;
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
      />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 301,
        background: PLUM, borderRadius: "24px 24px 0 0",
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 -12px 48px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.1)" }} />
        </div>

        <div style={{ padding: "16px 22px 56px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>✦ BLOOM RECAP</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 32, fontWeight: 700, color: "white", lineHeight: 1 }}>{r.month}</p>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8" /></svg>
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { emoji: "🌸", label: "Events attended",  value: r.events },
              { emoji: "📍", label: "Places saved",      value: r.saves },
              { emoji: "✦",  label: "Bloomies met",      value: r.bloomiesMet },
              { emoji: "🌺", label: "Flowers given",     value: r.flowers },
              { emoji: "👥", label: "Clubs joined",      value: r.clubsJoined },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "14px 16px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 28, fontWeight: 900, color: "white", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.38)", marginTop: 3 }}>{s.emoji} {s.label}</p>
              </div>
            ))}
          </div>

          {/* Highlight */}
          <div style={{ background: "rgba(255,31,125,0.12)", border: `1px solid ${PINK}33`, borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 6 }}>✦ HIGHLIGHT</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{r.highlight}</p>
          </div>

          {/* Yande */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px", marginBottom: 20 }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 17, color: "rgba(255,255,255,0.68)", lineHeight: 1.6, marginBottom: 10 }}>
              &ldquo;{r.fullObservation}&rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK, letterSpacing: "0.08em" }}>— Yande ✦</p>
          </div>

          {/* CTA to full Bloom Trails */}
          <Link href="/member/lounge/memories" onClick={onClose} style={{
            display: "block", textAlign: "center", padding: "14px",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14, textDecoration: "none",
            fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700,
            color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em",
          }}>
            View all recaps in Bloom Trails →
          </Link>
        </div>
      </div>
    </>
  );
}

// ── Home Feed Card ────────────────────────────────────────────────────────────

export function BloomRecapCard({ onDismiss }: { onDismiss?: () => void }) {
  const [open, setOpen]           = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  function handleView() { setOpen(true); }
  function handleDismiss() { setDismissed(true); onDismiss?.(); }

  return (
    <>
      {/* Ghost card behind */}
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #120820 0%, #1e0612 100%)",
          borderRadius: 14,
          transform: "rotate(1.6deg) translateY(3px)",
          opacity: 0.5,
        }} />

        {/* Main card */}
        <div style={{
          position: "relative", borderRadius: 14, overflow: "hidden",
          background: "linear-gradient(150deg, #1d0828 0%, #2c0a1a 100%)",
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.10)",
            "0 2px 0 #080006",
            "0 4px 0 rgba(0,0,0,0.45)",
            "0 12px 28px rgba(0,0,0,0.55)",
          ].join(", "),
          transform: "rotate(-0.5deg)",
        }}>
          {/* Pink left spine */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${PINK}, #8B0038)` }} />

          <div style={{ paddingLeft: 3 }}>
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 10px 0 10px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 900, letterSpacing: "0.18em", color: PINK }}>✦ {CURRENT_RECAP.month.toUpperCase()}</p>
              <button onClick={handleDismiss} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: 0.3 }} aria-label="Dismiss">
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8" /></svg>
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 18, padding: "8px 10px 0" }}>
              {[
                { value: CURRENT_RECAP.events,      label: "events"   },
                { value: CURRENT_RECAP.saves,       label: "saves"    },
                { value: CURRENT_RECAP.bloomiesMet, label: "bloomies" },
                { value: CURRENT_RECAP.flowers,     label: "flowers"  },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 17, fontWeight: 900, color: "white", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Dashed separator */}
            <div style={{ margin: "8px 10px 0", borderTop: "1px dashed rgba(255,255,255,0.08)" }} />

            {/* CTA */}
            <div style={{ padding: "8px 10px 12px" }}>
              <button onClick={handleView} style={{
                width: "100%", padding: "8px 0",
                background: PINK, color: "white", border: "none",
                borderRadius: 8, cursor: "pointer",
                fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800,
                letterSpacing: "0.03em",
                boxShadow: `0 2px 0 rgba(130,0,45,0.8), 0 3px 10px ${PINK}44`,
              }}>
                Open {CURRENT_RECAP.shortMonth} →
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && <RecapSheet onClose={() => { setOpen(false); handleDismiss(); }} />}
    </>
  );
}
