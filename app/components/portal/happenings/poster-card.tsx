"use client";

import Image from "next/image";
import type { Event } from "@/lib/actions/events";
import { PINK, POSTER_IMGS } from "@/lib/happenings/constants";
import { getBadge } from "@/lib/happenings/utils";

export function PosterCard({ ev, posterIdx, joined, onToggle, fullWidth = false, waitlistCount = 0, onWaitlist = false, onJoinWaitlist, onInvite }: {
  ev: Event; posterIdx: number; joined: boolean; onToggle: () => void; fullWidth?: boolean;
  waitlistCount?: number; onWaitlist?: boolean; onJoinWaitlist?: () => void; onInvite?: () => void;
}) {
  const badge  = getBadge(ev);
  const poster = ev.image_url ?? POSTER_IMGS[posterIdx % POSTER_IMGS.length];

  return (
    <div style={{
      borderRadius: 14,
      overflow: "hidden",
      position: "relative",
      height: fullWidth ? 230 : 168,
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    }}>
      <Image src={poster} alt={ev.title} fill unoptimized style={{ objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.75) 65%, rgba(0,0,0,0.92) 100%)" }}/>

      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
        {badge && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.6)", borderRadius: 999, padding: "4px 10px", backdropFilter: "blur(8px)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, animation: "livePulse 1.4s ease-in-out infinite" }}/>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.1em" }}>{badge}</span>
          </div>
        )}
        {ev.is_official && (
          <div style={{ background: PINK, borderRadius: 999, padding: "4px 10px" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>✦ OFFICIAL</span>
          </div>
        )}
      </div>

      {(ev as { going_count?: number }).going_count && (ev as { going_count?: number }).going_count! > 0 && (
        <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", borderRadius: 999, padding: "4px 10px", backdropFilter: "blur(8px)" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "white" }}>{(ev as { going_count?: number }).going_count} going</span>
        </div>
      )}

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 14px 12px" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: fullWidth ? 22 : 16, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.05, marginBottom: 4, textShadow: "0 2px 12px rgba(0,0,0,0.7)", letterSpacing: "-0.01em" }}>
          {ev.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em", flex: 1 }}>
            {ev.venue ?? ""}{ev.neighborhood ? ` · ${ev.neighborhood}` : ""}
            {ev.spots_left === 0 && waitlistCount > 0 && (
              <span style={{ color: "rgba(255,200,100,0.9)", marginLeft: 4 }}>· Full · {waitlistCount} waiting</span>
            )}
          </span>
          {onInvite && (
            <button onClick={e => { e.stopPropagation(); onInvite(); }} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999, padding: "5px 10px", color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
              👯
            </button>
          )}
          {ev.spots_left === 0 ? (
            <button onClick={onJoinWaitlist} style={{
              background: onWaitlist ? "rgba(255,255,255,0.12)" : "rgba(255,180,50,0.85)",
              color: "white", border: onWaitlist ? "1.5px solid rgba(255,255,255,0.35)" : "none",
              borderRadius: 999, padding: "5px 12px",
              fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.05em",
              cursor: "pointer", flexShrink: 0,
            }}>
              {onWaitlist ? "You're next ✓" : "Next to attend"}
            </button>
          ) : (
            <button onClick={onToggle} style={{
              background: joined ? "rgba(255,255,255,0.12)" : PINK,
              color: "white", border: joined ? "1.5px solid rgba(255,255,255,0.35)" : "none",
              borderRadius: 999, padding: "5px 14px",
              fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.06em",
              cursor: "pointer", flexShrink: 0,
              boxShadow: joined ? "none" : `0 3px 14px ${PINK}66`,
            }}>
              {joined ? "Going ✓" : "Going →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
