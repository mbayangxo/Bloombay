"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";
const CREAM = "#FFF8F0";

interface Confirmation {
  id: string;
  type: "gathering" | "event";
  title: string;
  venue: string | null;
  starts_at: string;
  confirmation_code: string;
  confirmed_at: string | null;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function isPast(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

export default function ConfirmationsPage() {
  const [items, setItems] = useState<Confirmation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/member/plans/confirmations")
      .then(r => r.json())
      .then(d => { setItems(d.confirmations ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>

      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(255,255,255,0.97)", borderBottom: "1px solid rgba(255,31,125,0.12)", backdropFilter: "blur(16px)", paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div style={{ height: 52, display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
          <Link href="/member/plans" style={{ display: "flex", alignItems: "center", padding: 6, borderRadius: 999, background: "rgba(255,31,125,0.08)", textDecoration: "none" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,31,125,0.7)", lineHeight: 1 }}>YOUR</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 17, color: "#111111", lineHeight: 1.1 }}>Confirmations</p>
          </div>
          {!loading && items.length > 0 && (
            <div style={{ background: PINK, borderRadius: 999, padding: "3px 10px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "white" }}>{items.length}</p>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 16px 0" }}>

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 108, borderRadius: 18, background: "linear-gradient(90deg, rgba(255,31,125,0.08) 25%, rgba(255,31,125,0.15) 50%, rgba(255,31,125,0.08) 75%)", backgroundSize: "400px 100%", animation: "shimmer 1.4s ease-in-out infinite" }}/>
            ))}
            <style>{`@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }`}</style>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎫</div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: "#111", marginBottom: 8 }}>Nothing yet</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#999", marginBottom: 24 }}>Your confirmed events will show up here.</p>
            <Link href="/member/happenings" style={{ textDecoration: "none", display: "inline-block", background: PINK, color: "white", borderRadius: 999, padding: "13px 28px", fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", boxShadow: `0 6px 20px ${PINK}44` }}>
              Find something to go to →
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            {/* Upcoming */}
            {items.filter(c => !isPast(c.starts_at)).length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,31,125,0.55)", marginBottom: 12 }}>COMING UP</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.filter(c => !isPast(c.starts_at)).map(c => (
                    <ConfirmationCard key={c.id + c.confirmation_code} item={c} />
                  ))}
                </div>
              </div>
            )}

            {/* Past */}
            {items.filter(c => isPast(c.starts_at)).length > 0 && (
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.3)", marginBottom: 12 }}>PAST</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.filter(c => isPast(c.starts_at)).map(c => (
                    <ConfirmationCard key={c.id + c.confirmation_code} item={c} past />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ConfirmationCard({ item, past = false }: { item: Confirmation; past?: boolean }) {
  const href = `/member/plans/confirmations/${item.type === "gathering" ? item.id : item.id}`;

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        background: past ? "rgba(255,255,255,0.7)" : "white",
        borderRadius: 18,
        border: past ? "1px solid rgba(0,0,0,0.07)" : `1px solid rgba(255,31,125,0.14)`,
        boxShadow: past ? "none" : "0 4px 20px rgba(255,31,125,0.08)",
        padding: "16px 18px",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        opacity: past ? 0.72 : 1,
      }}>
        {/* Left: icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: past ? "rgba(0,0,0,0.06)" : `${PINK}14`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={past ? "#999" : PINK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
            <path d="m15 16 1.5 1.5L19 14"/>
          </svg>
        </div>

        {/* Middle: info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 15, color: past ? "#555" : "#111", lineHeight: 1.2, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.title}
            </p>
          </div>
          {item.venue && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "#999", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.venue}
            </p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", color: past ? "#aaa" : "#555" }}>
              {fmtDate(item.starts_at)} · {fmtTime(item.starts_at)}
            </p>
            {!past && (
              <div style={{ background: `${PINK}14`, borderRadius: 999, padding: "2px 8px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: PINK, letterSpacing: "0.06em" }}>CONFIRMED ✓</p>
              </div>
            )}
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "#ccc", marginTop: 5, letterSpacing: "0.1em" }}>{item.confirmation_code}</p>
        </div>

        {/* Right: arrow */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={past ? "rgba(0,0,0,0.2)" : "rgba(255,31,125,0.4)"} strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 4 }}>
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </Link>
  );
}
