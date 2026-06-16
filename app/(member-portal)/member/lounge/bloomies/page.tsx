"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";

const ALL_BLOOMIES = [
  { name: "Aaliyah M.", neighborhood: "Crown Heights", color: "#FF1F7D", initial: "A", since: "Jan 2026", mutual: 4 },
  { name: "Sofia K.",   neighborhood: "Williamsburg",  color: "#FF69B4", initial: "S", since: "Feb 2026", mutual: 3 },
  { name: "Kelechi O.", neighborhood: "Flatbush",      color: "#C084FC", initial: "K", since: "Mar 2026", mutual: 5 },
  { name: "Naomi B.",   neighborhood: "SoHo",          color: "#FF69B4", initial: "N", since: "Apr 2026", mutual: 2 },
  { name: "Temi A.",    neighborhood: "Crown Heights", color: "#FF1F7D", initial: "T", since: "Apr 2026", mutual: 3 },
  { name: "Zara F.",    neighborhood: "DUMBO",         color: "#FF69B4", initial: "Z", since: "May 2026", mutual: 6 },
];

export default function BloomiesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof ALL_BLOOMIES[0] | null>(null);

  const filtered = ALL_BLOOMIES.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.neighborhood.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: PAPER, paddingBottom: 96 }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${DARK} 0%, #2A0818 50%, #4A0C28 100%)`,
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 56px)",
        paddingBottom: 28, position: "relative", overflow: "hidden",
      }}>
        <div style={{ padding: "0 20px 14px", position: "relative", zIndex: 1 }}>
          <Link href="/member/lounge" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em" }}>APARTMENT</span>
          </Link>
        </div>
        <div style={{ padding: "0 20px", position: "relative", zIndex: 1 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.3em", color: "rgba(255,31,125,0.65)", marginBottom: 6 }}>🌸 YOUR BLOOMIES</p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(38px, 10vw, 52px)", color: "rgba(255,238,220,0.92)", lineHeight: 0.94, margin: 0 }}>Your People.</h1>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>{ALL_BLOOMIES.length} women in your world</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ background: "white", borderRadius: 14, padding: "0 14px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: "1.5px solid rgba(0,0,0,0.06)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search your bloomies…"
            style={{ flex: 1, padding: "12px 0", border: "none", outline: "none", fontFamily: "var(--font-jost)", fontSize: 13, color: DARK, background: "transparent" }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(b => (
          <button key={b.name} onClick={() => setSelected(b)}
            style={{
              background: "white", borderRadius: 18, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 14, textAlign: "left" as const,
              border: "none", cursor: "pointer", width: "100%",
              boxShadow: "0 2px 12px rgba(255,31,125,0.07)", borderLeft: `3px solid ${b.color}`,
            }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg, ${b.color}, ${b.color}AA)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 20, color: "white", flexShrink: 0 }}>{b.initial}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: DARK }}>{b.name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#bbb", marginTop: 2 }}>{b.neighborhood} · since {b.since}</p>
            </div>
            <div style={{ textAlign: "right" as const }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK }}>{b.mutual} events</p>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2" strokeLinecap="round" style={{ marginTop: 4 }}><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center" as const, padding: "40px 20px" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "rgba(255,31,125,0.4)" }}>No matches found</p>
          </div>
        )}
      </div>

      {/* Add more */}
      <div style={{ padding: "16px 20px 0" }}>
        <Link href="/member/match" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: `${PINK}0A`, border: `1.5px dashed rgba(255,31,125,0.25)`, borderRadius: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", border: `1.5px dashed rgba(255,31,125,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 20, color: "rgba(255,31,125,0.35)" }}>+</span>
          </div>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,31,125,0.5)" }}>Meet more women via Introductions →</p>
        </Link>
      </div>

      {/* Profile sheet */}
      {selected && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 40 }} onClick={() => setSelected(null)} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: PAPER, borderRadius: "24px 24px 0 0", padding: "20px 24px 48px", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.12)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg, ${selected.color}, ${selected.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 28, color: "white", boxShadow: `0 6px 20px ${selected.color}44` }}>{selected.initial}</div>
              <div>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: DARK, margin: 0 }}>{selected.name}</h3>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#aaa", marginTop: 4 }}>{selected.neighborhood} · since {selected.since}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK, marginTop: 4 }}>{selected.mutual} events together</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/member/messages" style={{ flex: 1, textDecoration: "none" }}>
                <div style={{ padding: "13px 0", borderRadius: 14, background: PINK, textAlign: "center" as const, fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, color: "white", boxShadow: `0 4px 14px ${PINK}44` }}>Message</div>
              </Link>
              <Link href="/member/lounge/bouquet" style={{ flex: 1, textDecoration: "none" }}>
                <div style={{ padding: "13px 0", borderRadius: 14, background: "white", textAlign: "center" as const, fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: PINK, border: `1.5px solid rgba(255,31,125,0.2)` }}>Add to Bouquet</div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
