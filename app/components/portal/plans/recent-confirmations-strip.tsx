"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ConfirmationSummary } from "@/lib/plans/types";
import { PINK } from "@/lib/plans/constants";

export function RecentConfirmationsStrip() {
  const router = useRouter();
  const [confirmations, setConfirmations] = useState<ConfirmationSummary[]>([]);

  useEffect(() => {
    fetch("/api/member/plans/confirmations")
      .then(r => r.ok ? r.json() : { confirmations: [] })
      .then(({ confirmations: c }) => setConfirmations(c ?? []))
      .catch(() => {});
  }, []);

  if (confirmations.length === 0) return null;

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", marginBottom: 10 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,31,125,0.5)" }}>✦ MY CONFIRMATIONS</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(0,0,0,0.3)", letterSpacing: "0.06em" }}>{confirmations.length} confirmed</p>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "2px 16px 16px", scrollbarWidth: "none" as const }}>
        {confirmations.map(c => {
          const d = new Date(c.starts_at);
          const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
          const day = d.getDate();
          return (
            <button
              key={c.id}
              onClick={() => router.push(`/member/plans/confirmations/${c.id}`)}
              style={{ flexShrink: 0, width: 130, background: "var(--bb-card)", border: "1px solid rgba(255,31,125,0.14)", borderRadius: 16, padding: "12px 12px 10px", cursor: "pointer", textAlign: "left" as const, boxShadow: "0 2px 12px rgba(255,31,125,0.07)" }}
            >
              <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", background: "rgba(255,31,125,0.08)", borderRadius: 8, padding: "4px 8px", marginBottom: 8 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.12em", color: PINK }}>{month}</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: PINK, lineHeight: 1 }}>{day}</p>
              </div>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, fontWeight: 700, color: "var(--bb-text)", lineHeight: 1.2, marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{c.title}</p>
              {c.venue && <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "var(--bb-text-3)", overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis", marginBottom: 4 }}>{c.venue}</p>}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: PINK, flexShrink: 0 }} />
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: PINK, letterSpacing: "0.04em" }}>Confirmed ✓</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
