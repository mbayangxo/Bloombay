"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const PAPER = "#FFFFFF";
const MAX_BOUQUET = 12;

type BouquetMember = {
  id: string;
  name: string;
  neighborhood: string;
  color: string;
  initial: string;
  since: string;
};

const COLORS = ["#FF1F7D", "#FF69B4", "#C084FC", "#E07040", "#5070C8"];

function colorForId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) % COLORS.length;
  return COLORS[h]!;
}

function mapMember(m: {
  id: string;
  first_name: string | null;
  full_name: string | null;
  neighborhood: string | null;
  position: number;
}): BouquetMember {
  const name = m.full_name?.trim() || m.first_name?.trim() || "Bloomie";
  return {
    id: m.id,
    name,
    neighborhood: m.neighborhood?.trim() || "NYC",
    color: colorForId(m.id),
    initial: (name[0] ?? "?").toUpperCase(),
    since: "Your bouquet",
  };
}

export default function BouquetPage() {
  const [bouquet, setBouquet] = useState<BouquetMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BouquetMember | null>(null);

  useEffect(() => {
    fetch("/api/member/bouquet")
      .then((r) => (r.ok ? r.json() : { members: [] }))
      .then((data: { members?: Array<{ id: string; first_name: string | null; full_name: string | null; neighborhood: string | null; position: number }> }) => {
        setBouquet((data.members ?? []).map(mapMember));
      })
      .catch(() => setBouquet([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: PAPER, paddingBottom: 96 }}>

      <div style={{
        background: `linear-gradient(160deg, #FF1F7D 0%, #FF3A8C 50%, #FF80C0 100%)`,
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 56px)",
        paddingBottom: 32, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ padding: "0 20px 16px", position: "relative", zIndex: 1 }}>
          <Link href="/member/apartment" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em" }}>APARTMENT</span>
          </Link>
        </div>

        <div style={{ padding: "0 20px", position: "relative", zIndex: 1 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.3em", color: "rgba(255,31,125,0.65)", marginBottom: 6 }}>💐 YOUR BOUQUET</p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(38px, 10vw, 52px)", color: "rgba(255,238,220,0.92)", lineHeight: 0.94, margin: 0 }}>Your 12.</h1>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>The women you carry closest</p>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(255,31,125,0.07)" }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)" }}>BOUQUET SIZE</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: PINK, lineHeight: 1.1, marginTop: 2 }}>
              {bouquet.length} <span style={{ color: "rgba(0,0,0,0.2)", fontSize: 16 }}>of {MAX_BOUQUET}</span>
            </p>
          </div>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" as const, maxWidth: 100, justifyContent: "flex-end" }}>
            {Array.from({ length: MAX_BOUQUET }).map((_, i) => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                background: i < bouquet.length ? PINK : "rgba(0,0,0,0.08)",
                transform: `rotate(${i * 30}deg)`,
                boxShadow: i < bouquet.length ? `0 1px 4px ${PINK}44` : "none",
              }} />
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <p style={{ padding: "40px 24px", textAlign: "center", fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.4)" }}>
          Loading bouquet…
        </p>
      ) : bouquet.length === 0 ? (
        <div style={{ padding: "40px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, fontWeight: 700, color: "#111111" }}>
            Your bouquet is empty
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.4)", marginTop: 8, lineHeight: 1.5 }}>
            Add Bloomies from home safety or your connections — they&apos;ll show up here.
          </p>
          <Link href="/member/home" style={{ display: "inline-block", marginTop: 16, color: PINK, fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
            Go to home →
          </Link>
        </div>
      ) : (
        <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
          {bouquet.map((w, i) => (
            <button key={w.id} onClick={() => setSelected(w)}
              style={{
                background: "#FFFFFF", borderRadius: 20, padding: "16px",
                display: "flex", alignItems: "center", gap: 14, textAlign: "left" as const,
                border: "none", cursor: "pointer", width: "100%",
                boxShadow: "0 3px 14px rgba(255,31,125,0.08)",
              }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${w.color}18`, border: `1.5px solid ${w.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, color: w.color }}>#{i + 1}</span>
              </div>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${w.color}, ${w.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 20, color: "white", flexShrink: 0 }}>
                {w.initial}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: "#111111", marginBottom: 2 }}>{w.name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(0,0,0,0.4)" }}>{w.neighborhood}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)", zIndex: 40 }} onClick={() => setSelected(null)} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "#FFFFFF", borderRadius: "24px 24px 0 0", padding: "20px 24px 40px" }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 24, color: "#111111", margin: 0 }}>{selected.name}</h2>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 4 }}>{selected.neighborhood}</p>
          </div>
        </>
      )}
    </div>
  );
}
