"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";
const DARK = "#1A1A1A";
const BG   = "#FEF3F7";

// ─── Types ────────────────────────────────────────────────────────────────────

type DropCat = "all" | "food_drink" | "beauty_wellness" | "experiences" | "shopping" | "travel";

interface LiveDrop {
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
  my_claimed_at: string | null;
  category?: string;
  badge_text?: string;
  is_featured?: boolean;
}

interface ActiveCode {
  code: string;
  drop: LiveDrop;
  member_name: string;
  claimed_at: string;
}

// ─── Category config ───────────────────────────────────────────────────────────

const CATS: { id: DropCat; label: string }[] = [
  { id: "all",             label: "All Drops"         },
  { id: "food_drink",      label: "Food & Drink"      },
  { id: "beauty_wellness", label: "Beauty & Wellness" },
  { id: "experiences",     label: "Experiences"       },
  { id: "shopping",        label: "Shopping"          },
  { id: "travel",          label: "Travel"            },
];

// ─── Decorative blossom ────────────────────────────────────────────────────────

function Blossom({ size = 22, opacity = 0.6 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity, display: "block" }}>
      {[0, 60, 120, 180, 240, 300].map(a => (
        <ellipse key={a} cx="12" cy="4.5" rx="2.8" ry="5.8" fill={PINK}
          transform={`rotate(${a} 12 12)`} opacity="0.65"/>
      ))}
      <circle cx="12" cy="12" r="3.8" fill="#FFDCE9"/>
      <circle cx="12" cy="12" r="2.2" fill="rgba(255,180,210,0.9)"/>
    </svg>
  );
}

// ─── Category icons ────────────────────────────────────────────────────────────

function CatIcon({ id }: { id: DropCat }) {
  const s = { width: 15, height: 15 };
  if (id === "all") return (
    <svg {...s} viewBox="0 0 24 24" fill="currentColor">
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={a} cx="12" cy="4" rx="2.4" ry="5.5" transform={`rotate(${a} 12 12)`} opacity="0.9"/>
      ))}
      <circle cx="12" cy="12" r="3.5"/>
    </svg>
  );
  if (id === "food_drink") return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M3 2v7c0 2.2 1.8 4 4 4s4-1.8 4-4V2"/><line x1="7" y1="2" x2="7" y2="22"/>
      <line x1="17" y1="2" x2="17" y2="22"/><path d="M14 7h6v1a6 6 0 01-6 0z"/>
    </svg>
  );
  if (id === "beauty_wellness") return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M12 2a7 7 0 00-7 7c0 3 1.8 5.8 4.5 7.2V20h5v-3.8C17.2 14.8 19 12 19 9a7 7 0 00-7-7z"/>
      <line x1="9" y1="22" x2="15" y2="22"/>
    </svg>
  );
  if (id === "experiences") return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <rect x="3" y="9" width="18" height="13" rx="1"/><path d="M8 9V7a4 4 0 018 0v2"/>
      <line x1="12" y1="13" x2="12" y2="17"/>
    </svg>
  );
  if (id === "shopping") return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
  return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5c-1.5-1.5-3.5-1.5-5 0L11 6 2.8 4.2l-1.6 1.6 7.5 4-3.6 3.6-1.5-1-1.4 1.4L6 17l3.8 3.8 1.4-1.4-1-1.5 3.6-3.6 4 7.5z"/>
    </svg>
  );
}

// ─── Drop card — "option b" full-width soft style ─────────────────────────────

function DropCard({ drop, onClaimed }: {
  drop: LiveDrop;
  onClaimed: (code: string, memberName: string, claimedAt: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const isSoldOut = drop.remaining <= 0;
  const pct       = Math.min(100, Math.round((drop.remaining / Math.max(1, drop.total_qty)) * 100));

  const now     = new Date();
  const expired = drop.valid_until ? new Date(drop.valid_until) < now : false;
  const validStr = drop.valid_until
    ? new Date(drop.valid_until).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  const myStatus = !drop.my_code ? null : expired ? "expired" : "active";

  async function claim() {
    if (loading || drop.my_code || isSoldOut) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/drops/claim", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dropId: drop.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
      onClaimed(data.code, data.member_name ?? "", data.claimed_at ?? new Date().toISOString());
    } catch { setError("Network error — try again"); }
    finally { setLoading(false); }
  }

  return (
    <div style={{
      borderRadius: 24,
      overflow: "hidden",
      background: "white",
      boxShadow: "0 6px 28px rgba(255,31,125,0.1), 0 2px 8px rgba(0,0,0,0.05)",
    }}>
      {/* ── gradient accent strip ── */}
      <div style={{
        height: 68,
        background: `linear-gradient(135deg, ${drop.cover_color_a}, ${drop.cover_color_b})`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 18px",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
          borderRadius: 99, padding: "4px 12px",
          border: "1px solid rgba(255,255,255,0.28)",
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: "white", letterSpacing: "0.18em" }}>
            BLOOM DROP ✦
          </p>
        </div>

        {myStatus === "active" && (
          <div style={{ background: "#4CAF50", borderRadius: 99, padding: "4px 12px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: "white", letterSpacing: "0.14em" }}>CLAIMED ✓</p>
          </div>
        )}
        {myStatus === "expired" && (
          <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 99, padding: "4px 12px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: "rgba(255,255,255,0.7)", letterSpacing: "0.14em" }}>EXPIRED</p>
          </div>
        )}
        {!drop.my_code && drop.badge_text && (
          <div style={{ background: "rgba(0,0,0,0.22)", borderRadius: 99, padding: "4px 12px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: "white", letterSpacing: "0.14em" }}>{drop.badge_text}</p>
          </div>
        )}
      </div>

      {/* ── body ── */}
      <div style={{ padding: "18px 18px 20px" }}>
        <p style={{
          fontFamily: "var(--font-playfair)", fontStyle: "italic",
          fontWeight: 900, fontSize: 26, color: DARK,
          lineHeight: 1.05, marginBottom: 3,
        }}>{drop.title}</p>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.42)", marginBottom: drop.description ? 10 : 14 }}>
          {drop.partner_name}{drop.neighborhood ? ` · ${drop.neighborhood}` : ""}
        </p>

        {drop.description && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.48)", lineHeight: 1.5, marginBottom: 14 }}>
            {drop.description}
          </p>
        )}

        {/* Progress */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(0,0,0,0.35)", letterSpacing: "0.1em" }}>
              {isSoldOut ? "ALL CLAIMED" : `${drop.remaining} OF ${drop.total_qty} REMAINING · 1 PER WEEK`}
            </p>
            {validStr && (
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: expired ? "#bbb" : PINK }}>
                Until {validStr}
              </p>
            )}
          </div>
          <div style={{ height: 5, borderRadius: 99, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${Math.max(isSoldOut ? 0 : 2, pct)}%`,
              background: isSoldOut
                ? "rgba(0,0,0,0.1)"
                : `linear-gradient(90deg, ${drop.cover_color_a}, ${drop.cover_color_b})`,
              borderRadius: 99,
              transition: "width 0.6s",
            }}/>
          </div>
        </div>

        {/* Instructions */}
        {drop.instructions && (
          <div style={{
            background: `${PINK}06`, borderRadius: 12,
            padding: "10px 13px", marginBottom: 14,
            border: `1px solid ${PINK}12`,
          }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: PINK, letterSpacing: "0.14em", marginBottom: 4 }}>HOW TO REDEEM</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.55)", lineHeight: 1.5 }}>
              {drop.instructions}
            </p>
          </div>
        )}

        {error && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#FF5252", marginBottom: 10 }}>{error}</p>
        )}

        {/* Action button */}
        {drop.my_code ? (
          <button
            onClick={() => onClaimed(drop.my_code!, "", drop.my_claimed_at ?? "")}
            style={{
              width: "100%", padding: "14px", borderRadius: 50,
              background: "rgba(0,0,0,0.04)", border: "1.5px solid rgba(0,0,0,0.08)",
              cursor: "pointer", fontFamily: "var(--font-jost)",
              fontSize: 12, fontWeight: 800, color: DARK,
            }}
          >
            View my code →
          </button>
        ) : isSoldOut ? (
          <button
            disabled
            style={{
              width: "100%", padding: "14px", borderRadius: 50,
              background: "rgba(0,0,0,0.04)", border: "none",
              fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700,
              color: "rgba(0,0,0,0.25)", cursor: "not-allowed",
            }}
          >
            All drops claimed
          </button>
        ) : (
          <button
            onClick={claim}
            disabled={loading}
            style={{
              width: "100%", padding: "14px", borderRadius: 50,
              background: loading
                ? "rgba(0,0,0,0.04)"
                : `linear-gradient(135deg, ${drop.cover_color_a}, ${drop.cover_color_b})`,
              border: "none",
              cursor: loading ? "default" : "pointer",
              fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800,
              color: loading ? "rgba(0,0,0,0.3)" : "white",
              boxShadow: loading ? "none" : `0 6px 22px ${drop.cover_color_a}45`,
              transition: "all 0.2s",
            }}
          >
            {loading ? "Claiming…" : `Claim ${drop.title} →`}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── My Drops sheet ────────────────────────────────────────────────────────────

function MyDropsSheet({ drops, onClose, onView }: {
  drops: LiveDrop[];
  onClose: () => void;
  onView: (drop: LiveDrop) => void;
}) {
  const claimed = drops.filter(d => d.my_code);
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", background: "white", borderRadius: "24px 24px 0 0", padding: "18px 20px calc(env(safe-area-inset-bottom,0px) + 36px)", maxHeight: "72vh", overflow: "auto" }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(0,0,0,0.1)", margin: "0 auto 20px" }}/>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: DARK }}>My Drops</p>
          {claimed.length > 0 && (
            <div style={{ background: PINK, borderRadius: 99, padding: "3px 12px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white" }}>{claimed.length} claimed</p>
            </div>
          )}
        </div>

        {claimed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <Blossom size={40} opacity={0.25}/>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(0,0,0,0.35)", marginTop: 12 }}>
              No drops claimed yet.<br/>Claim your weekly drop below!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {claimed.map(d => {
              const expired = d.valid_until ? new Date(d.valid_until) < new Date() : false;
              return (
                <button
                  key={d.id}
                  onClick={() => { onClose(); onView(d); }}
                  style={{ background: "none", border: "1.5px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: "13px 15px", display: "flex", alignItems: "center", gap: 13, cursor: "pointer", textAlign: "left", width: "100%" }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${d.cover_color_a}, ${d.cover_color_b})`, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: DARK, marginBottom: 2 }}>{d.title}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#999", marginBottom: 4 }}>{d.partner_name}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 900, color: expired ? "#bbb" : PINK, letterSpacing: "0.1em" }}>{d.my_code}</p>
                  </div>
                  <div style={{
                    background: expired ? "rgba(0,0,0,0.04)" : "#F0FFF4",
                    borderRadius: 99, padding: "3px 10px",
                    border: `1px solid ${expired ? "rgba(0,0,0,0.06)" : "#4CAF50"}`,
                    flexShrink: 0,
                  }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: expired ? "#bbb" : "#2E7D32", letterSpacing: "0.12em" }}>
                      {expired ? "EXPIRED" : "ACTIVE"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Code modal ────────────────────────────────────────────────────────────────

function CodeModal({ active, onClose }: { active: ActiveCode; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(active.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const expired = active.drop.valid_until ? new Date(active.drop.valid_until) < new Date() : false;
  const status  = active.drop.my_code ? (expired ? "EXPIRED" : "ACTIVE") : "ACTIVE";
  const validStr = active.drop.valid_until
    ? new Date(active.drop.valid_until).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;
  const claimedStr = active.claimed_at || active.drop.my_claimed_at
    ? new Date(active.claimed_at || active.drop.my_claimed_at!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 210, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 370, background: "#FAF6F2", borderRadius: 26, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.32)" }}
      >
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${active.drop.cover_color_a}, ${active.drop.cover_color_b})`, padding: "22px 22px 18px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(255,255,255,0.58)", letterSpacing: "0.2em", marginBottom: 4 }}>YOUR BLOOM DROP</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: "white", lineHeight: 1.05 }}>{active.drop.title}</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{active.drop.partner_name}</p>
            </div>
            {/* Status chip */}
            <div style={{
              background: expired ? "rgba(0,0,0,0.3)" : "rgba(76,175,80,0.9)",
              borderRadius: 99, padding: "4px 10px", flexShrink: 0,
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 900, color: "white", letterSpacing: "0.14em" }}>{status}</p>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 22px 26px" }}>
          {/* Code */}
          <div style={{ background: "white", borderRadius: 16, padding: "16px", border: `1.5px solid ${PINK}18`, textAlign: "center", marginBottom: 14 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(0,0,0,0.28)", letterSpacing: "0.2em", marginBottom: 7 }}>YOUR CODE</p>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 30, color: PINK, letterSpacing: "0.15em", marginBottom: 10 }}>{active.code}</p>
            <button
              onClick={copy}
              style={{
                background: copied ? "#F0FFF4" : `${PINK}10`,
                border: `1.5px solid ${copied ? "#4CAF50" : `${PINK}28`}`,
                borderRadius: 99, padding: "6px 16px", cursor: "pointer",
                fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700,
                color: copied ? "#2E7D32" : PINK,
              }}
            >
              {copied ? "✓ Copied!" : "Copy code"}
            </button>
          </div>

          {/* Meta grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 12px", marginBottom: 14 }}>
            {active.member_name && (
              <div style={{ background: "white", borderRadius: 12, padding: "10px 12px", border: "1px solid rgba(0,0,0,0.06)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(0,0,0,0.3)", letterSpacing: "0.12em", marginBottom: 3 }}>MEMBER</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: DARK }}>Hi, {active.member_name}!</p>
              </div>
            )}
            {claimedStr && (
              <div style={{ background: "white", borderRadius: 12, padding: "10px 12px", border: "1px solid rgba(0,0,0,0.06)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(0,0,0,0.3)", letterSpacing: "0.12em", marginBottom: 3 }}>CLAIMED</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, color: DARK }}>{claimedStr}</p>
              </div>
            )}
            {validStr && (
              <div style={{ background: "white", borderRadius: 12, padding: "10px 12px", border: "1px solid rgba(0,0,0,0.06)", gridColumn: claimedStr ? "auto" : "1 / -1" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(0,0,0,0.3)", letterSpacing: "0.12em", marginBottom: 3 }}>VALID UNTIL</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, color: expired ? "#bbb" : DARK }}>{validStr}</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          {active.drop.instructions && (
            <div style={{ background: `${PINK}07`, borderRadius: 12, padding: "11px 13px", marginBottom: 14, border: `1px solid ${PINK}12` }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: PINK, letterSpacing: "0.14em", marginBottom: 5 }}>HOW TO REDEEM</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.6)", lineHeight: 1.55 }}>{active.drop.instructions}</p>
            </div>
          )}

          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(0,0,0,0.3)", textAlign: "center", marginBottom: 14 }}>
            Screenshot or copy before closing.
          </p>

          <button
            onClick={onClose}
            style={{
              width: "100%", padding: "14px", borderRadius: 50,
              background: `linear-gradient(135deg, ${active.drop.cover_color_a}, ${active.drop.cover_color_b})`,
              border: "none", cursor: "pointer",
              fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: "white",
              boxShadow: `0 6px 20px ${active.drop.cover_color_a}40`,
            }}
          >
            Done ✦
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ cat }: { cat: DropCat }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ margin: "0 auto 18px" }}>
        <Blossom size={52} opacity={0.2}/>
      </div>
      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: DARK, marginBottom: 8 }}>
        No {cat === "all" ? "" : cat.replace("_", " & ")} drops yet.
      </p>
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.35)", lineHeight: 1.6 }}>
        New drops drop weekly.<br/>Check back soon ✿
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function DropsPage() {
  const [activeCat, setActiveCat]     = useState<DropCat>("all");
  const [drops, setDrops]             = useState<LiveDrop[]>([]);
  const [myDropsOpen, setMyDropsOpen] = useState(false);
  const [activeCode, setActiveCode]   = useState<ActiveCode | null>(null);

  const fetchDrops = useCallback(() => {
    fetch("/api/drops")
      .then(r => r.json())
      .then(d => { if (d.drops) setDrops(d.drops); })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchDrops(); }, [fetchDrops]);

  function handleClaimed(dropId: string, code: string, memberName: string, claimedAt: string) {
    setDrops(prev => prev.map(d =>
      d.id === dropId
        ? { ...d, my_code: code, my_claimed_at: claimedAt, claimed_qty: d.my_code ? d.claimed_qty : d.claimed_qty + 1, remaining: d.my_code ? d.remaining : d.remaining - 1 }
        : d
    ));
    const drop = drops.find(d => d.id === dropId);
    if (drop) setActiveCode({ code, drop: { ...drop, my_code: code, my_claimed_at: claimedAt }, member_name: memberName, claimed_at: claimedAt });
  }

  function openCodeFor(drop: LiveDrop) {
    if (!drop.my_code) return;
    setActiveCode({ code: drop.my_code, drop, member_name: "", claimed_at: drop.my_claimed_at ?? "" });
  }

  const claimedCount  = drops.filter(d => d.my_code).length;
  const filteredDrops = activeCat === "all" ? drops : drops.filter(d => (d.category ?? "food_drink") === activeCat);

  return (
    <div style={{ background: BG, minHeight: "100vh", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>
      <style>{`.dscroll::-webkit-scrollbar{display:none}`}</style>

      {/* ── TOP BAR ───────────────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(254,243,247,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,31,125,0.06)",
        padding: "calc(env(safe-area-inset-top, 0px) + 10px) 20px 10px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 900, color: PINK, letterSpacing: "0.04em" }}>
          BLOOMBAY <span style={{ fontSize: 15 }}>✿</span>
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setMyDropsOpen(true)}
            style={{ position: "relative", display: "flex", alignItems: "center", gap: 5, background: "white", border: "1.5px solid rgba(0,0,0,0.07)", borderRadius: 99, padding: "6px 13px 6px 11px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: DARK }}>My Drops</p>
            {claimedCount > 0 && (
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 900, color: "white" }}>{claimedCount}</p>
              </div>
            )}
          </button>
          <button style={{ width: 34, height: 34, borderRadius: "50%", background: "white", border: "1.5px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </button>
        </div>
      </div>

      {/* ── COMPACT HERO ──────────────────────────────────────────────────────── */}
      <div style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 68px)",
        padding: "calc(env(safe-area-inset-top, 0px) + 68px) 20px 6px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-playfair)", fontWeight: 900,
            fontSize: "clamp(36px, 12vw, 52px)", color: DARK,
            lineHeight: 0.9, margin: 0, letterSpacing: "-0.02em",
          }}>
            DROPS
          </h1>
          <p style={{
            fontFamily: "var(--font-caveat)", fontSize: 17, color: DARK,
            marginTop: 5, transform: "rotate(-1.5deg)", transformOrigin: "left bottom",
            display: "inline-block", paddingLeft: 2, opacity: 0.72,
          }}>
            Only the good stuff.
          </p>
        </div>

        {/* Mini shopping bag */}
        <div style={{ flexShrink: 0, position: "relative", width: 74, height: 88 }}>
          <svg width="58" height="76" viewBox="0 0 128 168" fill="none" style={{ position: "absolute", left: 0, top: 6 }}>
            <defs>
              <linearGradient id="bb-bag-sm" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D95"/>
                <stop offset="60%" stopColor="#FF1F7D"/>
                <stop offset="100%" stopColor="#C4005A"/>
              </linearGradient>
            </defs>
            <ellipse cx="64" cy="159" rx="46" ry="7" fill="rgba(255,31,125,0.14)"/>
            <path d="M 17 44 L 4 146 Q 3 152 9 153 L 119 153 Q 125 152 124 146 L 111 44 Z" fill="url(#bb-bag-sm)"/>
            <path d="M 17 44 L 6 130 Q 18 122 23 94 L 31 44 Z" fill="rgba(0,0,0,0.11)"/>
            <path d="M 38 44 C 36 16 47 8 64 8 C 81 8 92 16 90 44" fill="none" stroke="#B8004E" strokeWidth="12" strokeLinecap="round"/>
            <path d="M 38 44 C 36 18 47 11 64 11 C 81 11 92 18 90 44" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="5" strokeLinecap="round"/>
            <ellipse cx="64" cy="44" rx="7" ry="4.5" fill="#E0006A"/>
            <path d="M 57 41 Q 44 34 46 42 Q 47 47 57 46 Z" fill="#CC005A"/>
            <path d="M 71 41 Q 84 34 82 42 Q 81 47 71 46 Z" fill="#CC005A"/>
            <circle cx="64" cy="44" r="3.5" fill="#AA0045"/>
          </svg>
          {/* Gift tag */}
          <div style={{
            position: "absolute", right: 0, top: 0,
            width: 34, background: "#FDF5EE", borderRadius: 4,
            padding: "4px 4px 5px", boxShadow: "2px 3px 10px rgba(0,0,0,0.13)",
            border: "1px solid rgba(0,0,0,0.06)", transform: "rotate(5deg)",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", border: "1.5px solid rgba(0,0,0,0.18)", margin: "0 auto 4px" }}/>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 900, color: DARK, lineHeight: 1.5, textAlign: "center" }}>
              GOOD<br/>GIRLS<br/>GET THE<br/>GOOD<br/>STUFF.
            </p>
          </div>
        </div>
      </div>

      {/* ── CATEGORY CHIPS ────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 16 }}>
        <div className="dscroll" style={{ display: "flex", gap: 9, overflowX: "auto", padding: "2px 18px 4px", scrollbarWidth: "none" as const, alignItems: "center" }}>
          {CATS.map(cat => {
            const isActive = activeCat === cat.id;
            const isAll    = cat.id === "all";
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                style={{
                  flexShrink: 0, display: "flex",
                  flexDirection: isAll ? "row" : "column",
                  alignItems: "center", justifyContent: "center",
                  gap: isAll ? 6 : 4,
                  padding: isAll ? "8px 16px" : "7px 10px 8px",
                  borderRadius: isAll ? 99 : 14,
                  minWidth: isAll ? undefined : 56,
                  background: isActive ? PINK : "white",
                  border: `1.5px solid ${isActive ? PINK : "rgba(0,0,0,0.07)"}`,
                  color: isActive ? "white" : "#666",
                  cursor: "pointer",
                  boxShadow: isActive ? `0 4px 16px ${PINK}35` : "0 2px 6px rgba(0,0,0,0.05)",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <CatIcon id={cat.id}/>
                </span>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: isAll ? 11 : 7, fontWeight: 800, whiteSpace: "nowrap", lineHeight: 1.2 }}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BLOOM DROPS ────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 24, padding: "0 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: DARK, fontWeight: 700 }}>This Week's Drops 📫</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(0,0,0,0.3)", letterSpacing: "0.1em" }}>1 PER DROP</p>
        </div>

        {filteredDrops.length === 0 ? (
          <EmptyState cat={activeCat}/>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filteredDrops.map(drop => (
              <DropCard
                key={drop.id}
                drop={drop}
                onClaimed={(code, memberName, claimedAt) => handleClaimed(drop.id, code, memberName, claimedAt)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── SUBMIT CTA ────────────────────────────────────────────────────────── */}
      <div style={{ margin: "28px 18px 0", borderRadius: 22, background: "white", padding: "18px 18px 20px", boxShadow: "0 4px 20px rgba(255,31,125,0.06)", border: "1px solid rgba(255,31,125,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
            <span style={{ fontSize: 15, color: PINK }}>✿</span>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 17, color: DARK }}>Have a favorite spot?</p>
          </div>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.38)", lineHeight: 1.4 }}>
            Tell us about it so we can feature it for all Bloomies!
          </p>
        </div>
        <Link href="/member/city" style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 7, background: DARK, borderRadius: 50, padding: "11px 15px", textDecoration: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.18)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, color: "white", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>SUBMIT A DROP</p>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>

      {/* ── OVERLAYS ──────────────────────────────────────────────────────────── */}
      {myDropsOpen && (
        <MyDropsSheet drops={drops} onClose={() => setMyDropsOpen(false)} onView={openCodeFor}/>
      )}
      {activeCode && (
        <CodeModal active={activeCode} onClose={() => setActiveCode(null)}/>
      )}
    </div>
  );
}
