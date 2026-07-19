"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const PAPER = "#FFFFFF";

type Bloomie = {
  id: string;
  name: string;
  neighborhood: string;
  color: string;
  initial: string;
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
}): Bloomie {
  const name = m.full_name?.trim() || m.first_name?.trim() || "Bloomie";
  return {
    id: m.id,
    name,
    neighborhood: m.neighborhood?.trim() || "NYC",
    color: colorForId(m.id),
    initial: (name[0] ?? "?").toUpperCase(),
  };
}

export default function BloomiesPage() {
  const [bloomies, setBloomies] = useState<Bloomie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Bloomie | null>(null);

  useEffect(() => {
    fetch("/api/member/bouquet")
      .then((r) => (r.ok ? r.json() : { members: [] }))
      .then((data: { members?: Array<{ id: string; first_name: string | null; full_name: string | null; neighborhood: string | null }> }) => {
        setBloomies((data.members ?? []).map(mapMember));
      })
      .catch(() => setBloomies([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bloomies.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.neighborhood.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: PAPER, paddingBottom: 96 }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, #FF1F7D 0%, #FF3A8C 50%, #FF69B4 100%)`,
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 56px)",
        paddingBottom: 28, position: "relative", overflow: "hidden",
      }}>
        <div style={{ padding: "0 20px 14px", position: "relative", zIndex: 1 }}>
          <Link href="/member/lounge" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.08em" }}>APARTMENT</span>
          </Link>
        </div>
        <div style={{ padding: "0 20px", position: "relative", zIndex: 1 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.3em", color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>🌸 YOUR BLOOMIES</p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(38px, 10vw, 52px)", color: "white", lineHeight: 0.94, margin: 0 }}>Your People.</h1>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.75)", marginTop: 8 }}>{bloomies.length} women in your world</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ background: "#FFF5F8", borderRadius: 14, padding: "0 14px", display: "flex", alignItems: "center", gap: 10, border: "1.5px solid rgba(255,31,125,0.2)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search your bloomies…"
            style={{ flex: 1, padding: "12px 0", border: "none", outline: "none", fontFamily: "var(--font-jost)", fontSize: 13, color: "#111111", background: "transparent" }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {loading ? (
          <p style={{ padding: "24px 0", textAlign: "center" as const, fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.4)" }}>
            Loading your bloomies…
          </p>
        ) : (
          <>
            {filtered.map(b => (
              <button key={b.id} onClick={() => setSelected(b)}
                style={{
                  background: "#FFFFFF", borderRadius: 18, padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 14, textAlign: "left" as const,
                  border: "none", cursor: "pointer", width: "100%",
                  boxShadow: "0 2px 12px rgba(255,31,125,0.08)", borderLeft: `3px solid ${b.color}`,
                }}>
                <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg, ${b.color}, ${b.color}AA)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 20, color: "white", flexShrink: 0 }}>{b.initial}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: "#111111" }}>{b.name}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(0,0,0,0.4)", marginTop: 2 }}>{b.neighborhood}</p>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,31,125,0.3)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            ))}

            {bloomies.length === 0 && (
              <div style={{ textAlign: "center" as const, padding: "40px 20px" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, fontWeight: 700, color: "#111111" }}>No Bloomies yet</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.4)", marginTop: 8, lineHeight: 1.5 }}>
                  Add women from your connections and they&apos;ll show up here.
                </p>
              </div>
            )}

            {bloomies.length > 0 && filtered.length === 0 && (
              <div style={{ textAlign: "center" as const, padding: "40px 20px" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "rgba(255,31,125,0.4)" }}>No matches found</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add more */}
      <div style={{ padding: "16px 20px 0" }}>
        <Link href="/member/match" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: `${PINK}0A`, border: `1.5px dashed rgba(255,31,125,0.3)`, borderRadius: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", border: `1.5px dashed rgba(255,31,125,0.35)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 20, color: "rgba(255,31,125,0.5)" }}>+</span>
          </div>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: PINK }}>Meet more women via Introductions →</p>
        </Link>
      </div>

      {/* Profile sheet */}
      {selected && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)", zIndex: 40 }} onClick={() => setSelected(null)} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "#FFFFFF", borderRadius: "24px 24px 0 0", padding: "20px 24px 48px", boxShadow: "0 -8px 40px rgba(255,31,125,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(255,31,125,0.2)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg, ${selected.color}, ${selected.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 28, color: "white", boxShadow: `0 6px 20px ${selected.color}44` }}>{selected.initial}</div>
              <div>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: "#111111", margin: 0 }}>{selected.name}</h3>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 4 }}>{selected.neighborhood}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href={`/member/messages?with=${selected.id}`} style={{ flex: 1, textDecoration: "none" }}>
                <div style={{ padding: "13px 0", borderRadius: 14, background: PINK, textAlign: "center" as const, fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, color: "white", boxShadow: `0 4px 14px ${PINK}44` }}>Message</div>
              </Link>
              <Link href="/member/lounge/bouquet" style={{ flex: 1, textDecoration: "none" }}>
                <div style={{ padding: "13px 0", borderRadius: 14, background: "#FFF5F8", textAlign: "center" as const, fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: PINK, border: `1.5px solid rgba(255,31,125,0.25)` }}>Add to Bouquet</div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
