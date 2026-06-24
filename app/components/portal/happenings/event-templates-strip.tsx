"use client";

import type { Event } from "@/lib/actions/events";
import { EventCard } from "@/app/components/portal/event-card-templates";
import { PINK } from "@/lib/happenings/constants";
import { toCardData } from "@/lib/happenings/utils";

export function EventTemplatesStrip({ events, joined, waitlistCounts, myWaitlist, onToggle, onWaitlist, onInvite, flowers, onFlower }: {
  events: Event[];
  joined: Set<string>;
  waitlistCounts: Record<string, number>;
  myWaitlist: Set<string>;
  onToggle: (id: string) => void;
  onWaitlist: (id: string) => void;
  onInvite: (ev: Event) => void;
  flowers: Record<string, { count: number; gave: boolean }>;
  onFlower: (id: string) => void;
}) {
  if (events.length === 0) return null;
  return (
    <div>
      <div style={{ padding: "0 14px 10px", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: PINK }} />
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.6)" }}>YOUR EVENTS</span>
      </div>
      <div className="bloom-stagger" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 14px 16px", scrollbarWidth: "none" as const }}>
        {events.map(ev => {
          const isFull = ev.spots_left !== null && ev.spots_left !== undefined && ev.spots_left <= 0;
          const wCount = waitlistCounts[ev.id] ?? 0;
          const onList = myWaitlist.has(ev.id);
          return (
            <div key={ev.id} className="bloom-lift bloom-card-enter" style={{ flexShrink: 0, display: "flex", flexDirection: "column" }}>
              <EventCard ev={toCardData(ev)} />
              <div style={{ display: "flex", gap: 5, marginTop: 6, alignItems: "center" }}>
                {(() => {
                  const fl = flowers[ev.id] ?? { count: 0, gave: false };
                  return (
                    <button onClick={() => onFlower(ev.id)} style={{
                      display: "flex", alignItems: "center", gap: 3,
                      background: fl.gave ? "rgba(255,31,125,0.3)" : "rgba(255,255,255,0.1)",
                      border: `1px solid ${fl.gave ? "rgba(255,31,125,0.5)" : "rgba(255,255,255,0.15)"}`,
                      borderRadius: 999, padding: "4px 9px", cursor: "pointer",
                      color: "white", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800,
                      transition: "all 0.18s",
                    }}>
                      <span style={{ fontSize: 11 }}>🌸</span>
                      {fl.count > 0 && <span>{fl.count}</span>}
                    </button>
                  );
                })()}
                <button onClick={() => onInvite(ev)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "4px 9px", color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, cursor: "pointer" }}>
                  👯 Invite
                </button>
                <div style={{ flex: 1 }} />
                {isFull ? (
                  <button onClick={() => onWaitlist(ev.id)} style={{ background: onList ? "rgba(255,255,255,0.1)" : "#D97706", border: "none", borderRadius: 999, padding: "4px 10px", color: "white", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, cursor: "pointer" }}>
                    {onList ? "You're next ✓" : "Next to attend"}
                  </button>
                ) : (
                  <button onClick={() => onToggle(ev.id)} style={{ background: joined.has(ev.id) ? "rgba(255,255,255,0.1)" : PINK, border: "none", borderRadius: 999, padding: "4px 12px", color: "white", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, cursor: "pointer", boxShadow: joined.has(ev.id) ? "none" : `0 2px 10px ${PINK}55` }}>
                    {joined.has(ev.id) ? "Going ✓" : "Going →"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
