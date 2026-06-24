"use client";

import type { Event } from "@/lib/actions/events";
import { PINK } from "@/lib/happenings/constants";

export function TonightStrip({ events, joined, onToggle }: { events: Event[]; joined: Set<string>; onToggle: (id: string) => void }) {
  const tonight = events.filter(ev => {
    const diffH = (new Date(ev.starts_at).getTime() - Date.now()) / 36e5;
    return diffH >= 0 && diffH <= 8;
  });
  if (tonight.length === 0) return null;
  return (
    <div style={{ margin: "12px 14px 4px", borderRadius: 14, background: "rgba(255,31,125,0.12)", border: "1px solid rgba(255,31,125,0.25)", padding: "12px 12px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: PINK, animation: "livePulse 1.2s ease-in-out infinite" }}/>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.9)" }}>TONIGHT</span>
        <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>— happening now</span>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" as const }}>
        {tonight.map(ev => (
          <div key={ev.id} style={{ flexShrink: 0, width: 160, background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2, marginBottom: 4 }}>{ev.title}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>{ev.venue ?? ev.neighborhood} · {new Date(ev.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
            {ev.spots_left !== null && ev.spots_left > 0 && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: PINK, marginBottom: 6 }}>{ev.spots_left} seats left</p>
            )}
            <button onClick={() => onToggle(ev.id)} style={{
              width: "100%", padding: "6px 0", borderRadius: 6, border: "none",
              background: joined.has(ev.id) ? "rgba(255,255,255,0.12)" : PINK,
              color: "white", fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800,
              cursor: "pointer",
            }}>
              {joined.has(ev.id) ? "Going ✓" : "Going →"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
