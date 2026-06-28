"use client";

import { useRouter } from "next/navigation";
import type { PlanRoom } from "@/lib/plans/types";
import { ticketCodeForRoom } from "@/lib/plans/ticket-code";

function TicketCard({ room, status, onOpen }: { room: PlanRoom; status: "active" | "used" | "expired"; onOpen: () => void }) {
  const img = room.poster;
  const ticketCode = ticketCodeForRoom(room.id);
  const TH = 148;
  const isClickable = status === "active";
  const overlay = status === "used" ? "USED ✓" : status === "expired" ? "MISSED" : null;
  const PAGE_BG = "#F5F0EA";

  return (
    <button
      onClick={() => isClickable && onOpen()}
      className="active:scale-[0.98] transition-transform"
      style={{ background: "none", border: "none", padding: 0, cursor: isClickable ? "pointer" : "default", width: "100%", textAlign: "left" as const }}
    >
      <div style={{ width: "100%", height: TH, borderRadius: 16, background: room.bg, boxShadow: "0 6px 28px rgba(0,0,0,0.22), 0 2px 0 rgba(0,0,0,0.5)", display: "flex", overflow: "hidden", position: "relative", opacity: status !== "active" ? 0.68 : 1 }}>
        {status !== "active" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#FFF5F8", border: "1.5px solid rgba(255,31,125,0.2)", borderRadius: 8, padding: "5px 14px", transform: "rotate(-8deg)" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.85)", letterSpacing: "0.18em" }}>{overlay}</p>
            </div>
          </div>
        )}
        <div style={{ width: "38%", flexShrink: 0, position: "relative", overflow: "hidden" }}>
          {img ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={room.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 60%, rgba(0,0,0,0.45) 100%)" }} />
            </>
          ) : (
            <div style={{ width: "100%", height: "100%", background: `linear-gradient(145deg, ${room.accent}44, ${room.accent}18)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>
              {room.emoji}
            </div>
          )}
          <div style={{ position: "absolute", top: 10, bottom: 10, right: -1, borderRight: "2px dashed rgba(255,255,255,0.22)" }} />
          <div style={{ position: "absolute", top: -9, right: -9, width: 18, height: 18, borderRadius: "50%", background: PAGE_BG }} />
          <div style={{ position: "absolute", bottom: -9, right: -9, width: 18, height: 18, borderRadius: "50%", background: PAGE_BG }} />
        </div>
        <div style={{ flex: 1, padding: "12px 14px 10px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 700, letterSpacing: "0.22em", color: `${room.accent}AA`, marginBottom: 4 }}>BLOOMBAY · EVENT TICKET</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, color: "white", lineHeight: 1.05, letterSpacing: "-0.01em" }}>{room.name}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.45)", marginTop: 3, overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis" }}>{room.venue}</p>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
              <div>
                <div style={{ display: "inline-flex", background: `${room.accent}22`, border: `1px solid ${room.accent}44`, borderRadius: 6, padding: "3px 8px", marginBottom: 6 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: room.accent, letterSpacing: "0.04em" }}>{room.time}</p>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", color: "rgba(255,255,255,0.22)", letterSpacing: "0.06em" }}>{ticketCode}</p>
              </div>
              <div style={{ display: "flex", gap: 1, alignItems: "flex-end", flexShrink: 0 }}>
                {[2,1,3,1,2,1,3,2,1,2,1,3,1,2].map((w, j) => (
                  <div key={j} style={{ width: w, height: j % 3 === 0 ? 28 : 20, background: "rgba(255,255,255,0.28)", borderRadius: 1 }} />
                ))}
              </div>
            </div>
            <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: room.accent }} />
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.32)" }}>{room.members} women · show at door</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export { TicketCard };

export function WalletTickets({ rooms, onOpen }: { rooms: PlanRoom[]; onOpen: (room: PlanRoom) => void }) {
  const router = useRouter();

  const allActive  = rooms;
  const stackItems = allActive.slice(0, 4);

  const STACK = [
    { rot: -3.8, x: -10, z: 1 },
    { rot:  2.2, x:   9, z: 2 },
    { rot: -1.5, x:  -4, z: 3 },
    { rot:  0.6, x:   3, z: 4 },
  ];

  const WALLET_H   = 158;
  const PEEK       = 50;
  const SLOT_DEPTH = 18;
  const TOTAL_H    = WALLET_H + PEEK;

  const GRAIN = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence type='turbulence' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='80' height='80' filter='url(%23n)' opacity='0.07'/></svg>") repeat`;

  return (
    <div style={{ paddingBottom: 20 }}>
      <button
        onClick={() => router.push("/member/plans/tickets")}
        className="active:scale-[0.985] transition-transform"
        style={{ width: "100%", padding: "0 16px", background: "none", border: "none", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
      >
        <div style={{ position: "relative", height: TOTAL_H }}>

          <div style={{ position: "absolute", top: PEEK, left: 0, right: 0, height: WALLET_H, borderRadius: 22, background: "linear-gradient(148deg, #FFD0E6 0%, #FFAED4 30%, #FFD4E8 70%, #FFE8F2 100%)", boxShadow: "0 24px 70px rgba(255,31,125,0.22), 0 6px 0 rgba(200,0,80,0.18), inset 0 1px 0 rgba(255,255,255,0.6)", zIndex: 1 }} />

          {stackItems.map((room, i) => {
            const s = STACK[Math.min(i, STACK.length - 1)];
            const img = room.poster;
            const isFront = i === stackItems.length - 1;
            return (
              <div key={room.id} style={{ position: "absolute", top: 0, left: 0, right: 0, height: PEEK + SLOT_DEPTH, borderRadius: "13px 13px 0 0", background: room.bg, transform: `rotate(${s.rot}deg) translateX(${s.x}px)`, zIndex: 2 + i, overflow: "hidden", boxShadow: "0 -5px 18px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${room.accent}, ${room.accent}BB)` }} />
                {img && (
                  <div style={{ position: "absolute", top: 0, left: 0, width: "36%", height: "100%", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.55) 100%)" }} />
                  </div>
                )}
                {isFront && (
                  <div style={{ position: "absolute", left: img ? "40%" : 12, right: 10, top: 10, display: "flex", flexDirection: "column", gap: 2 }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.22em", color: `${room.accent}CC` }}>BLOOMBAY · TICKET</p>
                    <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "white", lineHeight: 1.05, overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis" }}>{room.name}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.38)", overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis" }}>{room.time}</p>
                  </div>
                )}
                {!isFront && (
                  <div style={{ position: "absolute", right: 14, top: "45%", transform: "translateY(-50%)", fontSize: 20, opacity: 0.3 }}>{room.emoji}</div>
                )}
                <div style={{ position: "absolute", bottom: 0, left: 10, right: 10, borderBottom: "1.5px dashed rgba(255,255,255,0.14)" }} />
              </div>
            );
          })}

          <div style={{ position: "absolute", top: PEEK - 8, left: 8, right: 8, height: 22, background: "linear-gradient(180deg, rgba(180,0,70,0.32) 0%, rgba(255,31,125,0.12) 55%, transparent 100%)", zIndex: 9, borderRadius: "0 0 4px 4px", pointerEvents: "none" }} />

          <div style={{ position: "absolute", top: PEEK + SLOT_DEPTH, left: 0, right: 0, height: WALLET_H - SLOT_DEPTH, borderRadius: "0 0 22px 22px", background: "linear-gradient(165deg, #FFE0EE 0%, #FFAED4 48%, #FFD0E6 82%, #FFE8F2 100%)", backgroundImage: GRAIN, zIndex: 8, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 10, left: 8, right: 8, bottom: 8, borderRadius: "0 0 16px 16px", border: "1.5px dashed rgba(255,31,125,0.28)", borderTop: "none", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 52, left: 14, right: 14, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,31,125,0.2), rgba(255,31,125,0.3), rgba(255,31,125,0.2), transparent)" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -42%)", pointerEvents: "none", userSelect: "none" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 68, fontWeight: 900, fontStyle: "italic", color: "rgba(255,31,125,0.1)", lineHeight: 1 }}>BB</p>
            </div>
            <div style={{ position: "absolute", right: 20, top: 18, display: "flex", flexDirection: "column", gap: 5 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,31,125,0.22)" }} />
              ))}
            </div>
            <div style={{ position: "absolute", bottom: 22, left: 20, right: 20, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.24em", color: "rgba(255,31,125,0.55)", marginBottom: 4 }}>BLOOMBAY</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 21, color: "rgba(120,0,50,0.75)", lineHeight: 1 }}>
                  {allActive.length} {allActive.length === 1 ? "ticket" : "tickets"}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 22, opacity: 0.7 }}>🎀</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,31,125,0.6)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 32, background: "linear-gradient(0deg, rgba(0,0,0,0.42) 0%, transparent 100%)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 7, pointerEvents: "none" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.48)" }}>OPEN WALLET</p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
