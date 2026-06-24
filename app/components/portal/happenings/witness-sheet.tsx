"use client";

import { useState, useEffect } from "react";
import type { Event } from "@/lib/actions/events";
import { getGatheringAttendees } from "@/lib/actions/events";
import { witnessAttendee, getWitnessedIds } from "@/lib/actions/happenings";
import { PINK, AV_COLORS } from "@/lib/happenings/constants";

export function WitnessSheet({ ev, onClose }: { ev: Event; onClose: () => void }) {
  const [witnessed, setWitnessed] = useState<Set<string>>(new Set());
  const [attendees, setAttendees] = useState<Array<{ id: string; name: string; avatar_url: string | null }>>([]);

  useEffect(() => {
    Promise.all([
      getWitnessedIds(ev.id),
      getGatheringAttendees(ev.id),
    ]).then(([ids, people]) => {
      setWitnessed(new Set(ids));
      setAttendees(people);
    });
  }, [ev.id]);

  async function toggle(userId: string) {
    setWitnessed(prev => { const s = new Set(prev); s.has(userId) ? s.delete(userId) : s.add(userId); return s; });
    await witnessAttendee(ev.id, userId);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ background: "rgba(0,0,0,0.5)", position: "absolute", inset: 0 }}/>
      <div style={{ position: "relative", background: "#FFF8F2", borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", zIndex: 1 }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.15)", margin: "0 auto 16px" }}/>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 4 }}>WHO DID YOU MEET?</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "#1C1B1C", marginBottom: 16 }}>{ev.title}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {attendees.length === 0 && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#9A8070" }}>No other attendees found for this event.</p>
          )}
          {attendees.map((a, i) => {
            const color = AV_COLORS[i % AV_COLORS.length];
            return (
              <button key={a.id} onClick={() => toggle(a.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12,
                background: witnessed.has(a.id) ? `${PINK}15` : "white",
                border: witnessed.has(a.id) ? `1.5px solid ${PINK}` : "1px solid rgba(0,0,0,0.08)",
                cursor: "pointer", textAlign: "left" as const,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}88)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, color: "white" }}>{a.name[0]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: "#1C1B1C" }}>{a.name}</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#9A8070", marginTop: 1 }}>was there with you</p>
                </div>
                {witnessed.has(a.id) && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
