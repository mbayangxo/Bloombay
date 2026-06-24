"use client";

import { useState } from "react";
import type { PlanRoom } from "@/lib/plans/types";
import { BLOOMIES_LIST } from "@/lib/plans/mock-data";

export function InviteBloomieSheet({ room, onClose, onBack }: { room: PlanRoom; onClose: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sent, setSent] = useState(false);

  function toggle(id: number) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  if (sent) return (
    <>
      <div className="fixed inset-0 z-[60]" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl" style={{ background: "#FFFFFF", boxShadow: "0 -8px 40px rgba(255,31,125,0.12)", paddingBottom: "env(safe-area-inset-bottom,24px)" }}>
        <div className="flex flex-col items-center py-10 px-6 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg,#FF1F7D,#FF69B4)", boxShadow: "0 4px 20px rgba(255,31,125,0.35)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="font-black text-xl mb-1" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>Invitations sent!</p>
          <p className="text-sm" style={{ color: "rgba(0,0,0,0.5)", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>{selected.size} Bloomie{selected.size !== 1 ? "s" : ""} invited to {room.name}</p>
          <button onClick={onClose} className="mt-6 px-8 py-3.5 rounded-full text-sm font-bold" style={{ background: "#FF1F7D", color: "white" }}>Done</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="fixed inset-0 z-[60]" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl flex flex-col" style={{ background: "#FFFFFF", maxHeight: "88vh", boxShadow: "0 -8px 40px rgba(255,31,125,0.12)" }}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0"><div className="w-9 h-1 rounded-full" style={{ background: "rgba(255,31,125,0.2)" }} /></div>
        <div className="px-6 pb-4 pt-2 flex items-center justify-between flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,31,125,0.1)" }}>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FFF5F8" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,31,125,0.6)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>💌 INVITE TO {room.name.toUpperCase()}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>Choose who to invite</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FFF5F8" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(255,31,125,0.5)" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {BLOOMIES_LIST.map(b => {
            const on = selected.has(b.id);
            return (
              <button key={b.id} onClick={() => toggle(b.id)} className="w-full flex items-center gap-4 px-6 py-3.5 text-left" style={{ borderBottom: "1px solid rgba(255,31,125,0.08)", background: on ? "rgba(255,31,125,0.15)" : "transparent" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 text-sm" style={{ background: `linear-gradient(135deg,${b.color},${b.color}BB)` }}>{b.initial}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: "#111111" }}>{b.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>{b.status}</p>
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={on ? { background: "#FF1F7D" } : { background: "transparent", border: "2px solid rgba(255,31,125,0.2)" }}>
                  {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              </button>
            );
          })}
        </div>
        <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,31,125,0.1)", paddingBottom: "max(16px,env(safe-area-inset-bottom))" }}>
          <button onClick={() => setSent(true)} disabled={selected.size === 0} className="w-full py-4 rounded-full text-sm font-bold"
            style={selected.size > 0 ? { background: "#FF1F7D", color: "white" } : { background: "#F5E8EE", color: "#C8A0B0" }}>
            {selected.size > 0 ? `Send invite to ${selected.size} Bloomie${selected.size !== 1 ? "s" : ""} →` : "Select Bloomies to invite"}
          </button>
        </div>
      </div>
    </>
  );
}
