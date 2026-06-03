"use client";

import { useState } from "react";

interface PlanRoom {
  id: number;
  name: string;
  emoji: string;
  bg: string;
  accent: string;
  unread: number;
  members: number;
  date: string;
  venue?: string;
  time?: string;
}

const PLAN_ROOMS: PlanRoom[] = [
  { id: 1, name: "Morocco October",    emoji: "🇲🇦", bg: "#1A0E0A", accent: "#FF69B4", unread: 7,  members: 14, date: "Oct 2026", venue: "Marrakech · Private Villa", time: "Oct 10–17, 2026" },
  { id: 2, name: "Afrobeats Night",    emoji: "🎵",  bg: "#0F0818", accent: "#FF1F7D", unread: 3,  members: 8,  date: "Jun 14",  venue: "SOB's, 204 Varick St",      time: "Sat Jun 14 · 10PM" },
  { id: 3, name: "Sunday Walk Circle", emoji: "🌿",  bg: "#0A120F", accent: "#83C5A0", unread: 0,  members: 6,  date: "Jun 8",   venue: "Prospect Park, Grand Army Plaza", time: "Sun Jun 8 · 9AM" },
];

// Simple deterministic QR-like SVG pattern
function QRCodeVisual({ seed }: { seed: number }) {
  const size = 13;
  const cell = 6;
  // Seeded pseudo-random
  function cell64(r: number, c: number) {
    return ((seed * 31 + r * 17 + c * 7) % 3) !== 0;
  }
  const cells: boolean[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      // Corner finder patterns (3x3 bordered square)
      if ((r < 3 && c < 3) || (r < 3 && c >= size - 3) || (r >= size - 3 && c < 3)) return true;
      if ((r === 3 && c < 4) || (r < 4 && c === 3) || (r === 3 && c >= size - 4) || (r < 4 && c === size - 4)) return false;
      if ((r >= size - 4 && c < 4) || (r >= size - 4 && c === 3)) return false;
      return cell64(r, c);
    })
  );

  return (
    <svg width={size * cell} height={size * cell} viewBox={`0 0 ${size * cell} ${size * cell}`}>
      {cells.map((row, r) =>
        row.map((filled, c) =>
          filled ? <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell - 1} height={cell - 1} rx="0.5" fill="#111111"/> : null
        )
      )}
    </svg>
  );
}

function PlanTicketSheet({ room, onClose }: { room: PlanRoom; onClose: () => void }) {
  const ticketCode = `BB-${room.id.toString().padStart(2, "0")}-${(room.id * 7841 + 3301) % 9000 + 1000}`;

  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{ background: "#FDFAF5", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.25)" }}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>

        {/* Ticket card */}
        <div className="px-5 pb-2">
          <div className="rounded-3xl overflow-hidden" style={{ background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
            {/* Ticket header */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1.5px dashed rgba(0,0,0,0.08)" }}>
              <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
              <p className="text-[9px] font-semibold tracking-[0.15em] uppercase" style={{ color: "#bbb" }}>PLAN ROOM TICKET</p>
            </div>

            {/* Ticket cover */}
            <div className="flex items-center justify-center" style={{ height: "80px", background: room.bg }}>
              <span style={{ fontSize: "38px" }}>{room.emoji}</span>
            </div>

            {/* Ticket body */}
            <div className="px-6 pt-4 pb-2">
              <p className="text-[9px] font-bold tracking-wider uppercase mb-1" style={{ color: "#FF1F7D" }}>YOUR TICKET</p>
              <h2 className="font-black leading-none mb-2" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(20px,6vw,28px)", color: "#111", lineHeight: 0.92, letterSpacing: "-0.015em" }}>
                {room.name}
              </h2>
              <p className="text-xs" style={{ color: "#777" }}>{room.time}</p>
              <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{room.venue}</p>
            </div>

            {/* Perforation */}
            <div style={{ borderTop: "1.5px dashed rgba(0,0,0,0.08)", margin: "12px 24px" }} />

            {/* QR code */}
            <div className="px-6 pb-6 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[8px] font-mono tracking-widest" style={{ color: "#bbb" }}>{ticketCode}</p>
                <p className="text-[9px] font-semibold" style={{ color: "#999" }}>{room.members} women · Tap to scan at door</p>
                <p className="text-[9px] italic mt-1" style={{ fontFamily: "var(--font-instrument)", color: "#ccc" }}>Show this at check-in</p>
              </div>
              <div className="flex-shrink-0 rounded-xl overflow-hidden p-2" style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)" }}>
                <QRCodeVisual seed={room.id * 13 + 42} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pt-3 pb-8 flex gap-3">
          <button className="flex-1 py-3.5 rounded-2xl font-bold text-sm"
            style={{ background: "#111111", color: "white" }}>
            💌 Invite a Bloomie
          </button>
          <button className="flex-1 py-3.5 rounded-2xl font-bold text-sm"
            style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.3)" }}>
            Open Room →
          </button>
        </div>
      </div>
    </>
  );
}

function PlanRoomCard({ room, onPress }: { room: PlanRoom; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      className="flex-shrink-0 rounded-2xl overflow-hidden relative active:scale-[0.96] transition-transform text-left"
      style={{ width: "108px", background: room.bg, boxShadow: "0 4px 18px rgba(0,0,0,0.22)" }}
    >
      {/* Cover */}
      <div className="flex items-center justify-center relative" style={{ height: "88px" }}>
        <span style={{ fontSize: "34px" }}>{room.emoji}</span>
        {room.unread > 0 && (
          <div
            className="absolute top-2 right-2 min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1.5"
            style={{ background: "#FF1F7D", boxShadow: "0 2px 8px rgba(255,31,125,0.55)" }}
          >
            <span className="text-[10px] font-black text-white leading-none">{room.unread}</span>
          </div>
        )}
        {/* QR hint icon */}
        <div className="absolute bottom-1.5 right-2">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            <rect x="5" y="5" width="3" height="3" fill="rgba(255,255,255,0.4)" stroke="none"/>
            <rect x="16" y="5" width="3" height="3" fill="rgba(255,255,255,0.4)" stroke="none"/>
            <rect x="5" y="16" width="3" height="3" fill="rgba(255,255,255,0.4)" stroke="none"/>
            <rect x="14" y="14" width="3" height="3" fill="rgba(255,255,255,0.4)" stroke="none"/>
          </svg>
        </div>
      </div>
      {/* Info */}
      <div className="px-3 pb-3 pt-1.5">
        <p className="text-[11px] font-bold leading-tight text-white truncate">{room.name}</p>
        <p className="text-[9px] mt-0.5 font-medium" style={{ color: room.accent }}>
          {room.members} women · {room.date}
        </p>
      </div>
    </button>
  );
}

export default function PlansPage() {
  const [selectedRoom, setSelectedRoom] = useState<PlanRoom | null>(null);

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>

      {/* Header */}
      <div className="px-5 pt-20 pb-6 md:px-10 md:pt-8">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ YOUR PLANS</p>
        <h1
          className="font-black leading-none"
          style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(34px,6vw,48px)", color: "#111", lineHeight: 0.92, letterSpacing: "-0.02em" }}
        >
          Plans.
        </h1>
        <p className="text-sm italic mt-1" style={{ fontFamily: "var(--font-instrument)", color: "#999" }}>
          Your tickets, invitations & plan rooms.
        </p>
      </div>

      {/* Plan Rooms — horizontal scroll */}
      <div className="mb-8">
        <div className="px-5 md:px-10 flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(0,0,0,0.35)" }}>
            PLAN ROOMS
          </p>
          <p className="text-[10px] font-semibold" style={{ color: "#FF1F7D" }}>
            {PLAN_ROOMS.length} rooms · tap for ticket
          </p>
        </div>
        <div
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ paddingLeft: "20px", paddingRight: "20px", scrollbarWidth: "none" }}
        >
          {PLAN_ROOMS.map(room => (
            <PlanRoomCard key={room.id} room={room} onPress={() => setSelectedRoom(room)} />
          ))}
        </div>
      </div>

      {/* My Tickets section */}
      <div className="px-5 md:px-10 mb-6">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(0,0,0,0.35)" }}>MY TICKETS</p>
        <div className="flex flex-col gap-3">
          {PLAN_ROOMS.map(room => (
            <button key={room.id} onClick={() => setSelectedRoom(room)}
              className="w-full rounded-2xl overflow-hidden text-left active:scale-[0.98] transition-transform"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <div className="flex items-stretch">
                {/* Color strip */}
                <div className="w-12 flex-shrink-0 flex items-center justify-center"
                  style={{ background: room.bg, minHeight: "72px" }}>
                  <span style={{ fontSize: "22px" }}>{room.emoji}</span>
                </div>
                {/* Info */}
                <div className="flex-1 px-4 py-3">
                  <p className="text-[9px] font-bold tracking-wider uppercase mb-0.5" style={{ color: "#FF1F7D" }}>PLAN ROOM TICKET</p>
                  <p className="font-bold text-sm leading-snug" style={{ color: "#111" }}>{room.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#aaa" }}>{room.time} · {room.members} women</p>
                </div>
                {/* QR hint */}
                <div className="flex items-center pr-4">
                  <div className="rounded-xl p-1.5" style={{ background: "#F5F5F5" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                      <rect x="5" y="5" width="3" height="3" fill="#999" stroke="none"/>
                      <rect x="16" y="5" width="3" height="3" fill="#999" stroke="none"/>
                      <rect x="5" y="16" width="3" height="3" fill="#999" stroke="none"/>
                    </svg>
                  </div>
                </div>
              </div>
              {/* Perforation bottom */}
              <div style={{ borderTop: "1px dashed rgba(0,0,0,0.06)", marginLeft: "12px", marginRight: "12px" }} />
              <div className="px-4 py-2 flex items-center justify-between">
                <p className="text-[9px] font-mono" style={{ color: "#ccc" }}>BB-{room.id.toString().padStart(2, "0")}-{(room.id * 7841 + 3301) % 9000 + 1000}</p>
                <p className="text-[9px] font-semibold" style={{ color: "#FF1F7D" }}>Tap for QR →</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming events empty state */}
      <div className="px-5 md:px-10 flex flex-col items-center justify-center py-8 text-center">
        <p style={{ fontSize: "32px" }}>🎫</p>
        <p className="font-bold mt-2 text-sm" style={{ color: "#bbb" }}>RSVP to events for more tickets.</p>
      </div>

      {selectedRoom && <PlanTicketSheet room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
    </div>
  );
}
