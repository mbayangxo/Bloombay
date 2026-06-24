"use client";

import Image from "next/image";
import type { Event } from "@/lib/actions/events";
import { PINK, CLUB_IMGS } from "@/lib/happenings/constants";
import { getBadge } from "@/lib/happenings/utils";

export function ClubCard({ ev, clubIdx, joined, onToggle }: {
  ev: Event; clubIdx: number; joined: boolean; onToggle: () => void;
}) {
  const img   = ev.image_url ?? CLUB_IMGS[clubIdx % CLUB_IMGS.length];
  const badge = getBadge(ev);

  return (
    <div style={{
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
      height: 200,
      background: "#0A0A0A",
      boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
    }}>
      <Image src={img} alt={ev.title} fill unoptimized style={{ objectFit: "cover", opacity: 0.75 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.8) 100%)" }}/>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${PINK}, transparent)` }}/>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px" }}>
        {badge && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 4 }}>{badge} ✦</p>
        )}
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2, marginBottom: 6 }}>{ev.title}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>{ev.neighborhood ?? ev.city}</span>
          <button onClick={onToggle} style={{
            background: joined ? "rgba(255,255,255,0.12)" : PINK,
            border: joined ? `1px solid rgba(255,255,255,0.3)` : "none",
            color: "white", borderRadius: 999, padding: "5px 12px",
            fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.08em",
            cursor: "pointer",
            boxShadow: joined ? "none" : `0 2px 10px ${PINK}55`,
          }}>
            {joined ? "Going ✓" : "Going →"}
          </button>
        </div>
      </div>
    </div>
  );
}
