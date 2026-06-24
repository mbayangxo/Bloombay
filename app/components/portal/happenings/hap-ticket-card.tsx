"use client";

import Image from "next/image";
import type { Event } from "@/lib/actions/events";
import { PINK, TICKET_IMGS } from "@/lib/happenings/constants";
import { getBadge, fmtShort } from "@/lib/happenings/utils";

export function HapTicketCard({ ev, ticketIdx, joined, onToggle, waitlistCount = 0, onWaitlist = false, onJoinWaitlist, onInvite }: {
  ev: Event; ticketIdx: number; joined: boolean; onToggle: () => void;
  waitlistCount?: number; onWaitlist?: boolean; onJoinWaitlist?: () => void; onInvite?: () => void;
}) {
  const img = TICKET_IMGS[ticketIdx % TICKET_IMGS.length];
  const badge = getBadge(ev);

  return (
    <div style={{
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
      background: "rgba(255,255,255,0.85)",
      boxShadow: "0 6px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ position: "relative", height: 130, overflow: "hidden" }}>
        <Image src={img} alt={ev.title} fill unoptimized style={{ objectFit: "cover" }} />
        {badge && (
          <div style={{ position: "absolute", top: 8, left: 8, display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.6)", borderRadius: 999, padding: "3px 8px", backdropFilter: "blur(6px)" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: PINK, animation: "livePulse 1.4s ease-in-out infinite" }}/>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, color: "white", letterSpacing: "0.1em" }}>{badge}</span>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: "repeating-linear-gradient(to right, transparent, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 8px)", margin: "0 12px" }}/>

      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 3 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,0,0,0.35)" }}>ADMIT ONE</p>
          {onInvite && (
            <button onClick={e => { e.stopPropagation(); onInvite(); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1 }}>👯</button>
          )}
        </div>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1.2, marginBottom: 4 }}>{ev.title}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(0,0,0,0.45)", letterSpacing: "0.04em", marginBottom: ev.spots_left === 0 && waitlistCount > 0 ? 3 : 8 }}>{fmtShort(ev.starts_at)}</p>
        {ev.spots_left === 0 && waitlistCount > 0 && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "#D97706", marginBottom: 6 }}>Full · {waitlistCount} women waiting</p>
        )}
        {ev.spots_left === 0 ? (
          <button onClick={onJoinWaitlist} style={{
            width: "100%", padding: "7px 0",
            background: onWaitlist ? "rgba(0,0,0,0.06)" : "#D97706",
            color: onWaitlist ? "rgba(0,0,0,0.5)" : "white",
            border: "none", borderRadius: 6,
            fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.08em",
            cursor: "pointer",
          }}>
            {onWaitlist ? "You're next ✓" : "Next to sit →"}
          </button>
        ) : (
          <button onClick={onToggle} style={{
            width: "100%", padding: "7px 0",
            background: joined ? "rgba(0,0,0,0.06)" : PINK,
            color: joined ? "rgba(0,0,0,0.5)" : "white",
            border: "none", borderRadius: 6,
            fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.08em",
            cursor: "pointer",
          }}>
            {joined ? "Going ✓" : "Going →"}
          </button>
        )}
      </div>
    </div>
  );
}
