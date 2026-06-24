"use client";

import { useState } from "react";
import type { PlanRoom } from "@/lib/plans/types";
import { InviteBloomieSheet } from "./invite-bloomie-sheet";

function QRCodeVisual({ seed }: { seed: number }) {
  const size = 13, cell = 6;
  const cells: boolean[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      if ((r < 3 && c < 3) || (r < 3 && c >= size - 3) || (r >= size - 3 && c < 3)) return true;
      if ((r === 3 && c < 4) || (r < 4 && c === 3) || (r === 3 && c >= size - 4) || (r < 4 && c === size - 4)) return false;
      if ((r >= size - 4 && c < 4) || (r >= size - 4 && c === 3)) return false;
      return ((seed * 31 + r * 17 + c * 7) % 3) !== 0;
    })
  );
  return (
    <svg width={size * cell} height={size * cell} viewBox={`0 0 ${size * cell} ${size * cell}`}>
      {cells.map((row, r) => row.map((filled, c) =>
        filled ? <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell - 1} height={cell - 1} rx="0.5" fill="#111111"/> : null
      ))}
    </svg>
  );
}

export function PlanTicketSheet({ room, onClose, onOpenRoom }: { room: PlanRoom; onClose: () => void; onOpenRoom: () => void }) {
  const [showInvite, setShowInvite] = useState(false);
  const ticketCode = `BB-${room.id.toString().padStart(2, "0")}-${(room.id * 7841 + 3301) % 9000 + 1000}`;

  if (showInvite) return <InviteBloomieSheet room={room} onClose={onClose} onBack={() => setShowInvite(false)} />;

  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden" style={{ background: "#FFFFFF", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(255,31,125,0.12)" }}>
        <div className="flex justify-center pt-3 pb-1"><div className="w-9 h-1 rounded-full" style={{ background: "rgba(255,31,125,0.2)" }} /></div>
        <div className="px-5 pb-2">
          <div className="rounded-3xl overflow-hidden" style={{ background: "#FFF5F8", boxShadow: "0 4px 24px rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.2)" }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1.5px dashed rgba(255,31,125,0.12)" }}>
              <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
              <p className="text-[9px] font-semibold tracking-[0.15em] uppercase" style={{ color: "rgba(0,0,0,0.4)" }}>PLAN ROOM TICKET</p>
            </div>
            <div className="flex items-center justify-center" style={{ height: "80px", background: room.bg }}>
              <span style={{ fontSize: "38px" }}>{room.emoji}</span>
            </div>
            <div className="px-6 pt-4 pb-2">
              <p className="text-[9px] font-bold tracking-wider uppercase mb-1" style={{ color: "#FF1F7D" }}>YOUR TICKET</p>
              <h2 className="font-black leading-none mb-2" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(20px,6vw,28px)", color: "#111111", lineHeight: 0.92 }}>{room.name}</h2>
              <p className="text-xs" style={{ color: "rgba(0,0,0,0.5)" }}>{room.time}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>{room.venue}</p>
            </div>
            <div style={{ borderTop: "1.5px dashed rgba(255,31,125,0.12)", margin: "12px 24px" }} />
            <div className="px-6 pb-6 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[8px] font-mono tracking-widest" style={{ color: "rgba(0,0,0,0.38)" }}>{ticketCode}</p>
                <div className="flex items-center gap-1 py-0.5 px-2 rounded-full w-fit" style={{ background: "linear-gradient(135deg,#111,#1A0010)", border: "1px solid rgba(255,31,125,0.35)" }}>
                  <span style={{ fontSize: "7px", color: "#FF1F7D" }}>✦</span>
                  <span className="text-[7px] font-bold tracking-[0.12em] uppercase" style={{ color: "#FF1F7D" }}>Founding Mother #47</span>
                </div>
                <p className="text-[9px] font-semibold" style={{ color: "#999" }}>{room.members} women · Show at door</p>
              </div>
              <div className="flex-shrink-0 rounded-xl overflow-hidden p-2" style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)" }}>
                <QRCodeVisual seed={room.id * 13 + 42} />
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 pt-3 pb-8 flex gap-3">
          <button onClick={() => setShowInvite(true)} className="flex-1 py-3.5 rounded-2xl font-bold text-sm" style={{ background: "#111", color: "white" }}>💌 Invite a Bloomie</button>
          <button onClick={() => { onClose(); setTimeout(onOpenRoom, 120); }} className="flex-1 py-3.5 rounded-2xl font-bold text-sm" style={{ background: room.accent, color: "white" }}>Open Room →</button>
        </div>
      </div>
    </>
  );
}
