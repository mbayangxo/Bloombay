"use client";

import type { Tradition } from "@/lib/actions/traditions";
import { PINK } from "@/lib/happenings/constants";

const FREQ_LABEL: Record<string, string> = { weekly: "Weekly", biweekly: "Bi-weekly", monthly: "Monthly", seasonal: "Seasonal", irregular: "Recurring" };

export function TraditionsStrip({ traditions, onFollow }: {
  traditions: Tradition[];
  onFollow: (id: string) => void;
}) {
  if (traditions.length === 0) return null;
  return (
    <div style={{ padding: "0 0 8px" }}>
      <div style={{ padding: "8px 14px 10px", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: PINK }} />
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.5)" }}>TRADITIONS</span>
        <span style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(255,255,255,0.25)", marginLeft: 4 }}>recurring series by Bloomies</span>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 14px 8px", scrollbarWidth: "none" as const }}>
        {traditions.map(t => (
          <div key={t.id} style={{
            flexShrink: 0, width: 160, borderRadius: 16,
            background: `linear-gradient(145deg, ${t.primary_color}22, ${t.primary_color}44)`,
            border: `1px solid ${t.primary_color}44`,
            padding: "14px 14px 12px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -16, right: -16, width: 60, height: 60, borderRadius: "50%", background: `${t.primary_color}22` }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.12em", color: t.primary_color, marginBottom: 4 }}>{FREQ_LABEL[t.frequency] ?? "RECURRING"} · {t.neighborhood ?? "NYC"}</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 14, color: "white", lineHeight: 1.2, marginBottom: 6 }}>{t.name}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>by {t.host_name ?? "A Bloomie"} · {t.follower_count} following</p>
            <button onClick={() => onFollow(t.id)} style={{
              background: t.is_following ? "rgba(255,255,255,0.12)" : t.primary_color,
              border: "none", borderRadius: 999, padding: "5px 12px",
              color: "white", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800,
              cursor: "pointer", transition: "all 0.18s",
            }}>
              {t.is_following ? "FOLLOWING ✓" : "FOLLOW →"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
