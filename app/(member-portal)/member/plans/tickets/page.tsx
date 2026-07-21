"use client";

import { useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";

interface PlanRoom {
  id: number; name: string; emoji: string; bg: string; accent: string;
  unread: number; members: number; date: string; venue?: string; time?: string;
  eventId?: number; poster?: string;
}

const TICKET_IMAGES: Record<number, string> = {
  2: "/tickets templates/Ticket_Girls_Night.png",
  4: "/tickets templates/Ticket_Museum_Exhibition.png",
  6: "/tickets templates/Ticket_Dinner_Society.png",
  1: "/tickets templates/Ticket_NYC_Marrakech.png",
};

// Tickets/wallet is not yet wired to real confirmed happenings. Rather than
// render fabricated tickets with fake "Paid in full" credentials and fake QR
// codes, show the honest empty state until the real ticket data is wired to
// /api/member/plans/confirmations.
const ACTIVE_ROOMS: PlanRoom[] = [];
const RETIRED_ROOMS: PlanRoom[] = [];
const EXPIRED_ROOMS: PlanRoom[] = [];

function TicketCard({ room, status }: { room: PlanRoom; status: "active" | "used" | "expired" }) {
  const img = TICKET_IMAGES[room.id];
  const ticketCode = `BB-${room.id.toString().padStart(2, "0")}-${(room.id * 7841 + 3301) % 9000 + 1000}`;
  const TH = 148;
  const overlay = status === "used" ? "USED ✓" : status === "expired" ? "MISSED" : null;

  return (
    <div style={{
      width: "100%", height: TH, borderRadius: 16,
      background: room.bg,
      boxShadow: "0 6px 28px rgba(0,0,0,0.22), 0 2px 0 rgba(0,0,0,0.5)",
      display: "flex", overflow: "hidden", position: "relative",
      opacity: status !== "active" ? 0.68 : 1,
    }}>
      {status !== "active" && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "5px 14px", transform: "rotate(-8deg)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.85)", letterSpacing: "0.18em" }}>{overlay}</p>
          </div>
        </div>
      )}
      {/* LEFT: poster */}
      <div style={{ width: "38%", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        {img ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={room.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 60%, rgba(0,0,0,0.45) 100%)" }} />
          </>
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${room.accent}22, ${room.accent}44)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 32, opacity: 0.6 }}>{room.emoji}</span>
          </div>
        )}
      </div>
      {/* Perforation */}
      <div style={{ width: 1, flexShrink: 0, background: `repeating-linear-gradient(to bottom, transparent 0px, transparent 5px, rgba(255,255,255,0.14) 5px, rgba(255,255,255,0.14) 7px)` }} />
      {/* RIGHT: info */}
      <div style={{ flex: 1, padding: "14px 14px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.22em", color: `${room.accent}CC`, marginBottom: 4 }}>BLOOMBAY · EVENT TICKET</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, color: "white", lineHeight: 1.05, overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis" }}>{room.name}</p>
          {room.venue && <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.35)", marginTop: 4, overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis" }}>{room.venue}</p>}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            {room.time && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${room.accent}18`, border: `1px solid ${room.accent}40`, borderRadius: 6, padding: "3px 8px", marginBottom: 6 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: room.accent }}>{room.time}</p>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: `${room.accent}44`, border: `1px solid ${room.accent}66`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="5" height="5" viewBox="0 0 24 24" fill="none" stroke={room.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.28)" }}>{room.members}</p>
              </div>
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", color: "rgba(255,255,255,0.22)", letterSpacing: "0.06em" }}>{ticketCode}</p>
        </div>
      </div>
    </div>
  );
}

export default function TicketsPage() {
  const [filter, setFilter] = useState<"active" | "used" | "expired">("active");

  const displayRooms = filter === "active" ? ACTIVE_ROOMS : filter === "used" ? RETIRED_ROOMS : EXPIRED_ROOMS;

  const GRAIN = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence type='turbulence' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='80' height='80' filter='url(%23n)' opacity='0.07'/></svg>") repeat`;

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>

      {/* Header */}
      <div style={{
        padding: "calc(env(safe-area-inset-top, 0px) + 14px) 16px 0",
        background: "linear-gradient(135deg, #FFD0E6 0%, #FFAED4 60%, #FFB8D8 100%)",
        backgroundImage: GRAIN,
        marginBottom: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/member/plans" style={{ textDecoration: "none" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(120,0,50,0.7)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </div>
            </Link>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.24em", color: "rgba(255,31,125,0.55)", marginBottom: 2 }}>BLOOMBAY</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, color: "rgba(120,0,50,0.85)", lineHeight: 1 }}>My Wallet</p>
            </div>
          </div>
          <span style={{ fontSize: 22, opacity: 0.7 }}>🎀</span>
        </div>

        {/* 3-tab filter */}
        <div style={{ display: "flex", gap: 6, paddingBottom: 16 }}>
          {([
            { key: "active",  label: "ACTIVE",  count: ACTIVE_ROOMS.length  },
            { key: "used",    label: "USED",    count: RETIRED_ROOMS.length  },
            { key: "expired", label: "EXPIRED", count: EXPIRED_ROOMS.length },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)} style={{
              flex: 1, padding: "8px 0", borderRadius: 12,
              background: filter === t.key ? PINK : "rgba(255,255,255,0.4)",
              border: "none", cursor: "pointer", transition: "all 0.15s",
              boxShadow: filter === t.key ? `0 2px 0 rgba(150,0,55,0.5), 0 4px 12px ${PINK}44` : "none",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 900, letterSpacing: "0.1em", color: filter === t.key ? "white" : "rgba(120,0,50,0.55)" }}>{t.label}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: filter === t.key ? "rgba(255,255,255,0.7)" : "rgba(120,0,50,0.35)", marginTop: 1 }}>{t.count}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Ticket list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "16px 16px 0" }}>
        {displayRooms.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center" as const }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, color: "rgba(0,0,0,0.35)" }}>
              {filter === "active" ? "No upcoming tickets." : filter === "used" ? "No used tickets yet." : "No expired tickets."}
            </p>
          </div>
        ) : displayRooms.map(room => (
          <TicketCard key={room.id} room={room} status={filter} />
        ))}

        {filter === "active" && (
          <div style={{ width: "100%", height: 64, borderRadius: 16, border: `2px dashed rgba(255,31,125,0.2)`, background: "rgba(255,31,125,0.03)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,31,125,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,31,125,0.45)", letterSpacing: "0.08em" }}>JOIN AN EVENT TO GET A TICKET</p>
          </div>
        )}
      </div>
    </div>
  );
}
