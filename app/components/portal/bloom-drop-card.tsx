"use client";

import { useState, useEffect, useCallback } from "react";

const PINK  = "#FF1F7D";
const CREAM = "#FAF6F0";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

interface Drop {
  id: string;
  title: string;
  description: string;
  partner_name: string;
  neighborhood: string | null;
  total_qty: number;
  claimed_qty: number;
  remaining: number;
  valid_until: string | null;
  cover_color_a: string;
  cover_color_b: string;
  instructions: string | null;
  my_code: string | null;
}

function CodeScreen({ code, drop, onClose }: { code: string; drop: Drop; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 20px",
    }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 380, background: CREAM, borderRadius: 28,
        overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
      }}>
        {/* Cover */}
        <div style={{
          background: `linear-gradient(135deg, ${drop.cover_color_a}, ${drop.cover_color_b})`,
          padding: "28px 24px 22px", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, backgroundSize: "200px 200px" }} />
          <div style={{ position: "relative" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "rgba(255,255,255,0.6)", letterSpacing: "0.2em", marginBottom: 6 }}>YOUR BLOOM DROP</p>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 26, color: "white", lineHeight: 1.1, marginBottom: 4 }}>{drop.title}</h2>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{drop.partner_name}</p>
          </div>
        </div>

        <div style={{ padding: "24px 24px 28px" }}>
          {/* Code display */}
          <div style={{
            background: "white", borderRadius: 18, padding: "20px",
            border: `2px solid ${PINK}22`, textAlign: "center", marginBottom: 16,
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "rgba(0,0,0,0.3)", letterSpacing: "0.2em", marginBottom: 10 }}>YOUR CODE</p>
            <p style={{
              fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 32,
              color: PINK, letterSpacing: "0.15em", marginBottom: 12,
            }}>{code}</p>
            <button
              onClick={copyCode}
              style={{
                background: copied ? "#F0FFF4" : `${PINK}10`,
                border: `1.5px solid ${copied ? "#4CAF50" : `${PINK}28`}`,
                borderRadius: 99, padding: "6px 16px", cursor: "pointer",
                fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700,
                color: copied ? "#2E7D32" : PINK,
                transition: "all 0.2s",
              }}
            >{copied ? "✓ Copied!" : "Copy code"}</button>
          </div>

          {/* Instructions */}
          {drop.instructions && (
            <div style={{ background: `${PINK}06`, borderRadius: 14, padding: "12px 14px", marginBottom: 16, border: `1px solid ${PINK}12` }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: PINK, letterSpacing: "0.15em", marginBottom: 6 }}>HOW TO REDEEM</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.65)", lineHeight: 1.55 }}>{drop.instructions}</p>
            </div>
          )}

          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.35)", textAlign: "center", marginBottom: 16 }}>
            Screenshot this screen or copy your code before closing.
          </p>

          <button
            onClick={onClose}
            style={{
              width: "100%", padding: "14px", borderRadius: 50,
              background: `linear-gradient(135deg, ${PINK}, #C4005A)`,
              border: "none", cursor: "pointer",
              fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800,
              color: "white", letterSpacing: "0.06em",
              boxShadow: `0 6px 20px ${PINK}40`,
            }}
          >Done ✦</button>
        </div>
      </div>
    </div>
  );
}

function DropCard({ drop, onClaimed }: { drop: Drop; onClaimed: (code: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pct = Math.round((drop.remaining / drop.total_qty) * 100);
  const isSoldOut = drop.remaining <= 0;

  async function claim() {
    if (loading || drop.my_code || isSoldOut) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/drops/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dropId: drop.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
      onClaimed(data.code);
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      borderRadius: 22, overflow: "hidden",
      boxShadow: "0 10px 40px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.06)",
      background: CREAM,
    }}>
      {/* Hero */}
      <div style={{
        height: 140,
        background: `${GRAIN}, linear-gradient(135deg, ${drop.cover_color_a}, ${drop.cover_color_b})`,
        backgroundSize: "200px 200px, auto",
        position: "relative", display: "flex", alignItems: "flex-end",
      }}>
        <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", borderRadius: 99, padding: "3px 10px", border: "1px solid rgba(255,255,255,0.25)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.18em" }}>BLOOM DROP ✦</p>
        </div>
        {drop.my_code && (
          <div style={{ position: "absolute", top: 12, right: 12, background: "#4CAF50", borderRadius: 99, padding: "3px 10px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.15em" }}>CLAIMED ✓</p>
          </div>
        )}
        <div style={{ position: "relative", padding: "0 18px 16px", width: "100%", background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)", paddingTop: 36 }}>
          <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: "white", lineHeight: 1.1, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{drop.title}</h3>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{drop.partner_name}{drop.neighborhood ? ` · ${drop.neighborhood}` : ""}</p>
        </div>
      </div>

      <div style={{ padding: "16px 18px 20px" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.65)", lineHeight: 1.55, marginBottom: 14 }}>{drop.description}</p>

        {/* Remaining counter + progress bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, color: isSoldOut ? "#aaa" : PINK }}>
              {isSoldOut ? "All claimed" : `${drop.remaining} of ${drop.total_qty} remaining`}
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 600, color: "#bbb" }}>{pct}%</p>
          </div>
          <div style={{ height: 5, borderRadius: 99, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99,
              width: `${pct}%`,
              background: isSoldOut
                ? "rgba(0,0,0,0.15)"
                : `linear-gradient(90deg, ${drop.cover_color_b}, ${PINK})`,
              transition: "width 0.6s ease",
            }}/>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#E53935", marginBottom: 10 }}>{error}</p>
        )}

        {/* CTA */}
        {drop.my_code ? (
          <button
            onClick={() => onClaimed(drop.my_code!)}
            style={{
              width: "100%", padding: "13px", borderRadius: 50,
              background: "white", border: `2px solid ${PINK}`,
              cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 11,
              fontWeight: 800, color: PINK, letterSpacing: "0.06em",
            }}
          >View my code →</button>
        ) : isSoldOut ? (
          <button disabled style={{
            width: "100%", padding: "13px", borderRadius: 50,
            background: "rgba(0,0,0,0.06)", border: "none",
            fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700,
            color: "#aaa", cursor: "not-allowed",
          }}>All claimed · Next drop coming soon</button>
        ) : (
          <button
            onClick={claim}
            disabled={loading}
            style={{
              width: "100%", padding: "13px", borderRadius: 50,
              background: loading ? "rgba(0,0,0,0.06)" : `linear-gradient(135deg, ${drop.cover_color_a}, ${drop.cover_color_b})`,
              border: "none", cursor: loading ? "default" : "pointer",
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800,
              color: loading ? "#aaa" : "white", letterSpacing: "0.06em",
              boxShadow: loading ? "none" : `0 6px 20px ${drop.cover_color_a}55`,
              transition: "all 0.2s",
            }}
          >{loading ? "Claiming…" : "Claim my free coffee ☕"}</button>
        )}
      </div>
    </div>
  );
}

export function BloomDropSection() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [activeCode, setActiveCode] = useState<{ code: string; drop: Drop } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDrops = useCallback(() => {
    fetch("/api/drops")
      .then(r => r.json())
      .then(d => { if (d.drops) setDrops(d.drops); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchDrops(); }, [fetchDrops]);

  function handleClaimed(dropId: string, code: string) {
    setDrops(prev => prev.map(d =>
      d.id === dropId
        ? { ...d, my_code: code, claimed_qty: d.my_code ? d.claimed_qty : d.claimed_qty + 1, remaining: d.my_code ? d.remaining : d.remaining - 1 }
        : d
    ));
    const drop = drops.find(d => d.id === dropId);
    if (drop) setActiveCode({ code, drop: { ...drop, my_code: code } });
  }

  if (loading || drops.length === 0) return null;

  return (
    <>
      {activeCode && (
        <CodeScreen
          code={activeCode.code}
          drop={activeCode.drop}
          onClose={() => setActiveCode(null)}
        />
      )}
      <div style={{ padding: "0 0 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: PINK, letterSpacing: "0.2em" }}>ACTIVE DROPS</p>
          <div style={{ flex: 1, height: 1, background: `${PINK}18` }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {drops.map(drop => (
            <DropCard
              key={drop.id}
              drop={drop}
              onClaimed={code => handleClaimed(drop.id, code)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
