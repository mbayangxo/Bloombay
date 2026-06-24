"use client";

import { useRouter } from "next/navigation";
import type { PlanRoom } from "@/lib/plans/types";
import { PINK } from "@/lib/plans/constants";
import { BLOOMIES_LIST } from "@/lib/plans/mock-data";

export function EventConfirmationCard({ room, onViewRoom }: { room: PlanRoom; onViewRoom: () => void }) {
  void onViewRoom;
  const router = useRouter();
  void router;

  return (
    <div style={{ margin: "0 16px 6px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)" }}>YOUR CONFIRMATION</p>
        <button onClick={onViewRoom} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: PINK, letterSpacing: "0.06em" }}>OPEN ROOM →</p>
        </button>
      </div>

      <div style={{ background: "#FAF5EE", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.09)" }}>

        <div style={{ padding: "16px 14px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.32)", marginBottom: 6 }}>SEAT DETAIL ❋</p>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontStyle: "italic", fontSize: "clamp(17px,5vw,21px)", color: "#1A1A1A", lineHeight: 1.05, marginBottom: 6 }}>{room.name}</h2>
            {room.venue && <p style={{ fontFamily: "var(--font-jost)", fontSize: "9.5px", fontWeight: 500, color: PINK, marginBottom: 2 }}>📍 {room.venue}</p>}
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9.5px", fontWeight: 600, color: PINK, marginBottom: 10 }}>{room.time}</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, color: "rgba(0,0,0,0.38)", lineHeight: 1.4 }}>
              see you there,<br/>gorgeous ♡
            </p>
          </div>

          <div style={{ width: 128, flexShrink: 0, background: "linear-gradient(150deg, #FF1F7D 0%, #E0006A 100%)", borderRadius: 11, padding: "10px 11px 12px", transform: "rotate(4.5deg) translateY(-4px)", boxShadow: "0 10px 30px rgba(255,31,125,0.42), 0 2px 0 rgba(120,0,45,0.5)", position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.6)" }}>BLOOMBAY ❋</p>
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.72)", marginBottom: 5 }}>ADMITS ONE</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontStyle: "italic", fontSize: 15, color: "white", lineHeight: 1.05, marginBottom: 8 }}>{room.name}</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              {[{ l: "DATE", v: room.date }, { l: "TIME", v: room.time?.split("·")[1]?.trim() ?? "8PM" }].map(({ l, v }) => (
                <div key={l}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "5px", fontWeight: 700, color: "rgba(255,255,255,0.48)", letterSpacing: "0.15em" }}>{l}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 700, color: "white" }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1.5px dashed rgba(255,255,255,0.28)", paddingTop: 7 }}>
              <div style={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                {[2,1,3,1,2,1,3,2,1,2,1,3,1,2,3,1,2].map((w, j) => (
                  <div key={j} style={{ width: w, height: j % 3 === 0 ? 17 : 11, background: "rgba(255,255,255,0.72)", borderRadius: 0.5 }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: "#111", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.8)", marginBottom: 3 }}>YOUR BOOKING</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>{room.members} women</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: "rgba(255,105,180,0.8)", marginTop: 1 }}>xoxo</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.2em", color: "#666", marginBottom: 5 }}>RSVP STATUS</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, border: `1.5px solid ${PINK}`, borderRadius: 999, padding: "4px 10px", marginBottom: 3 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: PINK }} />
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: PINK, letterSpacing: "0.06em" }}>Confirmed ✓</p>
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", color: "#666", letterSpacing: "0.08em" }}>Paid in full ❋</p>
          </div>
        </div>

        <div style={{ padding: "12px 14px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.28)", marginBottom: 8 }}>WHO YOU&apos;LL BE WITH</p>
              <div style={{ display: "flex" }}>
                {BLOOMIES_LIST.slice(0, 5).map((b, i) => (
                  <div key={b.id} style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${b.color},${b.color}BB)`, border: "2px solid #FAF5EE", marginLeft: i > 0 ? -9 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: "white", flexShrink: 0, position: "relative", zIndex: 5 - i, boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}>
                    {b.initial}
                  </div>
                ))}
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F0E8E0", border: "2px solid #FAF5EE", marginLeft: -9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#888" }}>+{room.members > 5 ? room.members - 5 : 1}</p>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 2 }}>CHEMISTRY</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1 }}>94%</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#888", marginTop: 1 }}>Great energy ❋</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
