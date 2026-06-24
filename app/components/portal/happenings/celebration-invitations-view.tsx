"use client";

import { useState } from "react";
import type { Event } from "@/lib/actions/events";
import { PINK } from "@/lib/happenings/constants";
import type { InviteType } from "@/lib/happenings/types";
import { InvitationRsvpSheet } from "./invitation-rsvp-sheet";

export function CelebrationInvitationsView({ events, joined, onToggle }: {
  events: Event[];
  joined: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [typeFilter, setTypeFilter] = useState<InviteType>("All");
  const [rsvpEv, setRsvpEv] = useState<Event | null>(null);

  return (
    <div style={{ padding: "0 0 24px" }}>
      {rsvpEv && <InvitationRsvpSheet ev={rsvpEv} onClose={() => setRsvpEv(null)} />}

      <div style={{ padding: "18px 16px 14px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>💌 INVITATIONS</p>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(24px, 7vw, 30px)", color: "rgba(255,238,220,0.96)", lineHeight: 1.0, margin: "0 0 6px" }}>
          We show up for our girls.
        </h2>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.38)" }}>
          Birthdays, wins & the moments that matter — open an invite, let her know you&apos;re coming, and send confetti no matter what.
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, padding: "0 14px 16px", overflowX: "auto", scrollbarWidth: "none" as const }}>
        {(["All", "Birthday", "Wins", "Milestones"] as InviteType[]).map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} style={{ flexShrink: 0, padding: "7px 16px", borderRadius: 999, border: "none", cursor: "pointer", background: typeFilter === t ? PINK : "rgba(255,255,255,0.1)", color: typeFilter === t ? "white" : "rgba(255,255,255,0.55)", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.06em", boxShadow: typeFilter === t ? `0 3px 14px ${PINK}55` : "none", transition: "all 0.15s" }}>
            {t === "Birthday" ? "🎂 " : t === "Wins" ? "✨ " : t === "Milestones" ? "🌸 " : ""}{t}
          </button>
        ))}
      </div>

      {events.length > 0 && (
        <div style={{ padding: "0 14px 14px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>YOUR INVITATIONS</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {events.map(ev => (
              <div key={ev.id} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, overflow: "hidden" }}>
                <div style={{ height: 3, background: `linear-gradient(90deg, ${PINK}, ${PINK}44)` }} />
                <div style={{ padding: "14px 16px" }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 17, fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 4 }}>{ev.title}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", color: "rgba(255,255,255,0.45)", marginBottom: 14 }}>{ev.venue ?? ev.neighborhood} · {new Date(ev.starts_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  <div style={{ display: "flex", gap: 7 }}>
                    <button onClick={() => onToggle(ev.id)} style={{ flex: 1, padding: "9px 6px", borderRadius: 10, border: "none", cursor: "pointer", background: joined.has(ev.id) ? PINK : "rgba(255,255,255,0.12)", color: "white", fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800 }}>
                      {joined.has(ev.id) ? "I'm going ✓" : "I'm going"}
                    </button>
                    <button onClick={() => setRsvpEv(ev)} style={{ flex: 1, padding: "9px 6px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800 }}>
                      Can&apos;t make it
                    </button>
                    <button onClick={() => setRsvpEv(ev)} style={{ flex: 1, padding: "9px 6px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800 }}>
                      I&apos;ll try 🤞
                    </button>
                  </div>
                  <button onClick={() => setRsvpEv(ev)} style={{ width: "100%", marginTop: 7, padding: "8px", borderRadius: 10, border: `1px solid ${PINK}33`, background: `${PINK}12`, cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800, color: PINK }}>
                    🎊 Send confetti
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div style={{ padding: "0 14px 14px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.35)", textAlign: "center", paddingTop: 8 }}>No open invitations right now.</p>
        </div>
      )}

      <div style={{ margin: "14px 14px 0", padding: "14px 16px", background: `${PINK}18`, border: `1px solid ${PINK}28`, borderRadius: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 22 }}>🎊</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 12, color: "rgba(255,255,255,0.85)", marginBottom: 2 }}>Drop confetti on her</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.4)" }}>Birthdays, wins, new keys, new chapters</p>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
  );
}
