"use client";

import { useState } from "react";
import type { NewPlanStep } from "@/lib/plans/types";
import { BLOOMIES_LIST, CLUBS_LIST } from "@/lib/plans/mock-data";

const CHOOSE_OPTIONS: { s: NewPlanStep; emoji: string; label: string; sub: string }[] = [
  { s: "room", emoji: "🗓", label: "Plan Room", sub: "Collaborative planning board for an event or trip" },
  { s: "bloomie", emoji: "🌸", label: "Invite Bloomies", sub: "Send a plan directly to specific friends" },
  { s: "club", emoji: "💫", label: "Post to Club", sub: "Open invite — let club members say they're down" },
];

export function NewPlanSheet({ onClose, onCreated }: { onClose: () => void; onCreated?: () => void }) {
  const [step, setStep]         = useState<NewPlanStep>("choose");
  const [name, setName]         = useState("");
  const [details, setDetails]   = useState("");
  const [message, setMessage]   = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [clubId, setClubId]     = useState<number | null>(null);
  const [done, setDone]         = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const showBloomieFlow = BLOOMIES_LIST.length > 0;
  const showClubFlow = CLUBS_LIST.length > 0;
  const chooseOptions = CHOOSE_OPTIONS.filter(opt =>
    opt.s === "room" || (opt.s === "bloomie" && showBloomieFlow) || (opt.s === "club" && showClubFlow),
  );

  function toggleBloomie(id: number) {
    setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  async function createRoom() {
    if (!name.trim() || creating) return;
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch("/api/member/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: name.trim(), description: details.trim() || undefined, plan_type: "hangout" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? "Failed to create plan");
      }
      onCreated?.();
      setDone(true);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create plan");
    } finally {
      setCreating(false);
    }
  }

  if (done) return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl" style={{ background: "white", paddingBottom: "env(safe-area-inset-bottom,24px)" }}>
        <div className="flex flex-col items-center py-10 px-6 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg,#FF1F7D,#FF69B4)", boxShadow: "0 4px 20px rgba(255,31,125,0.35)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="font-black text-xl mb-1" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>Done!</p>
          <p className="text-sm italic" style={{ color: "#999", fontFamily: "var(--font-playfair)" }}>
            {step === "room" ? `"${name}" created` : step === "bloomie" ? `Plan sent to ${selected.size} Bloomie${selected.size !== 1 ? "s" : ""}` : `Posted to ${CLUBS_LIST.find(c => c.id === clubId)?.name ?? "club"}`}
          </p>
          <button onClick={onClose} className="mt-6 px-8 py-3.5 rounded-full text-sm font-bold" style={{ background: "#FF1F7D", color: "white" }}>Done</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl flex flex-col" style={{ background: "#FFFFFF", maxHeight: "92vh", boxShadow: "0 -8px 40px rgba(255,31,125,0.12)" }}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0"><div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(255,31,125,0.2)" }} /></div>
        <div className="px-6 pb-4 pt-2 flex items-center justify-between flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,31,125,0.1)" }}>
          <div className="flex items-center gap-3">
            {step !== "choose" && (
              <button onClick={() => setStep("choose")} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FFF5F8" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,31,125,0.6)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            )}
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>
                {step === "choose" ? "✦ NEW PLAN" : step === "room" ? "✦ PLAN ROOM" : step === "bloomie" ? "✦ INVITE BLOOMIES" : "✦ POST TO CLUB"}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>
                {step === "choose" ? "What kind of plan?" : step === "room" ? "Create a plan room" : step === "bloomie" ? "Send directly to friends" : "Share with club members"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FFF5F8" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(255,31,125,0.5)" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
          </button>
        </div>

        {step === "choose" && (
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
            {chooseOptions.map(opt => (
              <button key={opt.s} onClick={() => setStep(opt.s)}
                className="flex items-center gap-4 p-5 rounded-2xl text-left active:scale-[0.98] transition-transform"
                style={{ background: "#FFF5F8", border: "1px solid rgba(255,31,125,0.2)" }}>
                <span style={{ fontSize: 28 }}>{opt.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: "#111111" }}>{opt.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>{opt.sub}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,31,125,0.5)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            ))}
          </div>
        )}

        {step === "room" && (
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(0,0,0,0.45)" }}>Room name</p>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Morocco October, Brunch Girls…" autoFocus className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#FFF5F8", border: "1.5px solid rgba(255,31,125,0.25)", color: "#111111" }} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(0,0,0,0.45)" }}>What&apos;s the plan?</p>
              <input value={details} onChange={e => setDetails(e.target.value)} placeholder="Event, trip, outing… add a date or venue" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#FFF5F8", border: "1.5px solid rgba(255,31,125,0.25)", color: "#111111" }} />
            </div>
            {createError && (
              <p className="text-xs text-center" style={{ color: "#FF1F7D", fontFamily: "var(--font-jost)" }}>{createError}</p>
            )}
            <button onClick={createRoom} disabled={!name.trim() || creating} className="w-full py-4 rounded-full text-sm font-bold mt-2"
              style={name.trim() ? { background: "linear-gradient(135deg,#FF1F7D,#FF69B4)", color: "white" } : { background: "#F5E8EE", color: "#C8A0B0" }}>
              {creating ? "Creating…" : name.trim() ? "Create Plan Room →" : "Add a room name first"}
            </button>
          </div>
        )}

        {step === "bloomie" && showBloomieFlow && (
          <>
            <div className="px-6 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,31,125,0.1)" }}>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(0,0,0,0.45)" }}>What&apos;s the plan?</p>
              <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Dinner at Tatiana, Sunday walk, gallery…" autoFocus className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#FFF5F8", border: "1.5px solid rgba(255,31,125,0.25)", color: "#111111" }} />
            </div>
            <div className="flex-1 overflow-y-auto">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase px-6 pt-3 pb-1" style={{ color: "rgba(0,0,0,0.45)" }}>Who to invite</p>
              {BLOOMIES_LIST.map(b => {
                const on = selected.has(b.id);
                return (
                  <button key={b.id} onClick={() => toggleBloomie(b.id)} className="w-full flex items-center gap-4 px-6 py-3.5 text-left" style={{ borderBottom: "1px solid rgba(255,31,125,0.08)", background: on ? "rgba(255,31,125,0.15)" : "transparent" }}>
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
              <button onClick={() => setDone(true)} disabled={selected.size === 0 || !message.trim()} className="w-full py-4 rounded-full text-sm font-bold"
                style={selected.size > 0 && message.trim() ? { background: "#FF1F7D", color: "white" } : { background: "#F5E8EE", color: "#C8A0B0" }}>
                {selected.size > 0 && message.trim() ? `Send to ${selected.size} Bloomie${selected.size !== 1 ? "s" : ""} →` : selected.size === 0 ? "Select Bloomies" : "Add a plan description"}
              </button>
            </div>
          </>
        )}

        {step === "club" && showClubFlow && (
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(0,0,0,0.45)" }}>What&apos;s the plan?</p>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="I'm going to Afrobeats Night at SOB's — who's coming?" autoFocus rows={3} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: "#FFF5F8", border: "1.5px solid rgba(255,31,125,0.25)", color: "#111111" }} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(0,0,0,0.45)" }}>Post to which club?</p>
              <div className="flex flex-col gap-2">
                {CLUBS_LIST.map(club => {
                  const on = clubId === club.id;
                  return (
                    <button key={club.id} onClick={() => setClubId(club.id)} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left" style={on ? { background: "rgba(255,31,125,0.15)", border: "1.5px solid rgba(255,31,125,0.4)" } : { background: "#FFF5F8", border: "1.5px solid rgba(255,31,125,0.12)" }}>
                      <span style={{ fontSize: 22 }}>{club.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: "#111111" }}>{club.name}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>{club.members} members</p>
                      </div>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={on ? { background: "#FF1F7D" } : { background: "transparent", border: "2px solid #E5E5E5" }}>
                        {on && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={() => setDone(true)} disabled={!message.trim() || clubId === null} className="w-full py-4 rounded-full text-sm font-bold"
              style={message.trim() && clubId !== null ? { background: "linear-gradient(135deg,#FF1F7D,#FF69B4)", color: "white" } : { background: "#F5E8EE", color: "#C8A0B0" }}>
              {message.trim() && clubId !== null ? `Post to ${CLUBS_LIST.find(c => c.id === clubId)?.name} →` : !message.trim() ? "Write your plan first" : "Choose a club"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
