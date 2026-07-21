"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const DARK  = "#0F0F1A";
const INK   = "#1A1A2E";
const CREAM = "#FAF6F0";
const PLUM  = "#1A0A2E";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

type WorkMode = "working" | "trepreneur" | "fluencer";

const MODE_META: Record<WorkMode, { label: string; tagline: string; accent: string; accent2: string }> = {
  working:    { label: "Girl Working",      tagline: "Jobs. Money. Elevation.",         accent: PLUM,    accent2: INK },
  trepreneur: { label: "Girltrepreneur",    tagline: "Build your empire.",              accent: "#7B1FA2", accent2: "#4A0070" },
  fluencer:   { label: "Girl Fluencer",     tagline: "Create. Grow. Get paid.",         accent: "#C4005A", accent2: PINK },
};

/**
 * Avenue Working — honest empty until feeds are wired.
 * Fabricated Figma/jobs content was removed for launch readiness.
 */
export function WorkingPage() {
  const [mode, setMode] = useState<WorkMode>("working");
  const activeMeta = MODE_META[mode];

  return (
    <div style={{ background: `${GRAIN}, ${CREAM}`, backgroundSize: "200px 200px, auto", minHeight: "100vh", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>
      <div style={{ padding: "56px 22px 24px", background: `${GRAIN}, linear-gradient(150deg, ${DARK} 0%, ${INK} 50%, ${PLUM} 100%)`, backgroundSize: "200px 200px, auto", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${PINK}10, transparent)`, pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Link href="/member/avenue" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
        </div>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(30px, 10.5vw, 42px)", color: "white", lineHeight: 1, marginBottom: 6 }}>{activeMeta.label}.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.45)" }}>{activeMeta.tagline}</p>
      </div>

      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(15,15,26,0.97)", backdropFilter: "blur(8px)", borderBottom: "2px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex" }}>
          {(Object.entries(MODE_META) as [WorkMode, typeof MODE_META[WorkMode]][]).map(([id, meta]) => (
            <button key={id} onClick={() => setMode(id)} style={{
              flex: 1, padding: "13px 0", background: "none", border: "none", cursor: "pointer",
              borderBottom: mode === id ? `3px solid ${meta.accent === PLUM ? PINK : meta.accent}` : "3px solid transparent",
              transition: "border-color 0.18s",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: mode === id ? "white" : "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>{meta.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "72px 22px 48px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 24, color: "#1A1A1A", marginBottom: 10 }}>Opening soon.</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#888", lineHeight: 1.65, maxWidth: 300, margin: "0 auto" }}>
          {activeMeta.label} — real opportunities, founders, and creators from the BloomBay community — is being built. We&apos;ll open it the moment it&apos;s real, never with filler.
        </p>
      </div>
    </div>
  );
}
