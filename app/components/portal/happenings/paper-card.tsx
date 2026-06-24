"use client";

import Image from "next/image";
import type { Event } from "@/lib/actions/events";
import { coverUrl } from "@/lib/images/supabase-transform";
import { PINK } from "@/lib/happenings/constants";
import { getBadge, fmtShort } from "@/lib/happenings/utils";

export function PaperCard({ ev, joined, onToggle }: { ev: Event; joined: boolean; onToggle: () => void }) {
  const badge  = getBadge(ev);
  const accent = ev.accent_color ?? PINK;

  return (
    <div style={{
      borderRadius: 10,
      background: "rgba(255,255,255,0.85)",
      backgroundImage: "repeating-linear-gradient(transparent, transparent 20px, rgba(0,0,0,0.04) 20px, rgba(0,0,0,0.04) 21px)",
      boxShadow: "0 6px 24px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.05)",
      padding: "12px 12px 12px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ position: "absolute", top: -4, left: "50%", transform: "translateX(-50%) rotate(-1deg)", width: 40, height: 12, background: "rgba(255,252,195,0.85)", boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}/>

      {ev.image_url && (
        <div style={{ position: "relative", width: "100%", height: 80, borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
          <Image src={coverUrl(ev.image_url) ?? ""} alt={ev.title} fill unoptimized style={{ objectFit: "cover" }} />
        </div>
      )}
      {!ev.image_url && (
        <div style={{ width: "100%", height: 60, borderRadius: 6, marginBottom: 8, background: `${accent}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 28 }}>✿</span>
        </div>
      )}

      {badge && (
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.18em", color: accent, marginBottom: 3 }}>{badge}</p>
      )}
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, flex: 1, marginBottom: 4 }}>{ev.title}</p>
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(0,0,0,0.45)", marginBottom: 8 }}>{ev.venue ?? fmtShort(ev.starts_at)}</p>
      <button onClick={onToggle} style={{
        background: joined ? "rgba(0,0,0,0.06)" : accent,
        color: joined ? "rgba(0,0,0,0.4)" : "white",
        border: "none", borderRadius: 6, padding: "6px 0", width: "100%",
        fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.07em",
        cursor: "pointer",
      }}>
        {joined ? "Going ✓" : "Going →"}
      </button>
    </div>
  );
}
