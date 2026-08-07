"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyMemories, type MemoryMoment } from "@/lib/actions/events";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";
const POLAROID_ROTS = [-2.5, 1.8, -1.5, 2.2, -1, 1.5, -2, 1, -1.8, 2, -1.2, 1.7];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<MemoryMoment[] | null>(null);

  useEffect(() => {
    getMyMemories().then(setMemories).catch(() => setMemories([]));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F8", paddingBottom: 100 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(255,240,248,0.96)", borderBottom: "1px solid rgba(255,31,125,0.1)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div style={{ height: 54, display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
          <Link href="/member/plans" style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.4" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 16, color: DARK }}>Your Story</span>
        </div>
      </div>

      <div style={{ padding: "22px 16px 40px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,31,125,0.5)", marginBottom: 3 }}>✦ MEMORIES</p>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1 }}>Your Story.</h1>
          {memories && memories.length > 0 && (
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "#bbb" }}>{memories.length} moments ✦</p>
          )}
        </div>

        {memories === null ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2.5px solid ${PINK}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : memories.length === 0 ? (
          <div style={{ borderRadius: 16, border: "1px dashed rgba(255,31,125,0.2)", background: "rgba(255,255,255,0.6)", padding: "40px 20px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, color: "#888", lineHeight: 1.5 }}>No memories yet — plans you attend will show up here once they've happened.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {memories.map((m, i) => (
              <div key={m.id} style={{ transform: `rotate(${POLAROID_ROTS[i % POLAROID_ROTS.length]}deg)`, transformOrigin: "center bottom", transition: "transform 0.2s" }}>
                <div style={{ background: "white", borderRadius: 4, padding: "5px 5px 14px", boxShadow: "0 6px 20px rgba(0,0,0,0.12), 0 1px 0 rgba(0,0,0,0.06)" }}>
                  <div style={{ width: "100%", aspectRatio: "1", borderRadius: 2, overflow: "hidden", background: `${m.accent_color ?? PINK}18`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {m.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image_url} alt={m.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 26 }}>✿</span>
                    )}
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${m.accent_color ?? PINK}44 100%)` }} />
                  </div>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 10, color: "#888", textAlign: "center", marginTop: 5, lineHeight: 1.2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{m.title}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 700, color: "#ccc", textAlign: "center", marginTop: 2, letterSpacing: "0.06em" }}>{fmtDate(m.starts_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
