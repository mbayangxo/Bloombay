"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────────

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

interface PlanMessage {
  id: number;
  sender: string;
  initial: string;
  color: string;
  text: string;
  time: string;
  isMe?: boolean;
}

type View = "list" | "room";

// ── Data ───────────────────────────────────────────────────────────────────────

const PLAN_ROOMS: PlanRoom[] = [
  { id: 1, name: "Morocco October",    emoji: "🇲🇦", bg: "#1A0E0A", accent: "#FF69B4", unread: 7,  members: 14, date: "Oct 2026", venue: "Marrakech · Private Villa",        time: "Oct 10–17, 2026" },
  { id: 2, name: "Afrobeats Night",    emoji: "🎵",  bg: "#0F0818", accent: "#FF1F7D", unread: 3,  members: 8,  date: "Jun 14",  venue: "SOB's, 204 Varick St",             time: "Sat Jun 14 · 10PM" },
  { id: 3, name: "Sunday Walk Circle", emoji: "🌿",  bg: "#0A120F", accent: "#83C5A0", unread: 0,  members: 6,  date: "Jun 8",   venue: "Prospect Park, Grand Army Plaza",  time: "Sun Jun 8 · 9AM" },
];

const ROOM_MESSAGES: Record<number, PlanMessage[]> = {
  1: [
    { id: 1, sender: "Aaliyah M.", initial: "A", color: "#FF1F7D", text: "Who's booking flights? We should coordinate — group deals are cheaper", time: "9:12 AM" },
    { id: 2, sender: "Jade K.",    initial: "J", color: "#FF69B4", text: "Skyscanner has a group booking tool 👀 let me look into it", time: "9:14 AM" },
    { id: 3, sender: "Nadia S.",   initial: "N", color: "#A855F7", text: "I found a riad that fits 14. The photos are unreal", time: "9:15 AM" },
    { id: 4, sender: "Me",         initial: "Y", color: "#FF1F7D", text: "Send the riad link!! And yes let's do a group call to sort flights this week", time: "9:17 AM", isMe: true },
    { id: 5, sender: "Aaliyah M.", initial: "A", color: "#FF1F7D", text: "Oct 10th works for me. Flying JFK → RAK", time: "9:18 AM" },
    { id: 6, sender: "Me",         initial: "Y", color: "#FF1F7D", text: "Same ✈️ Let's lock this in before prices go up", time: "9:20 AM", isMe: true },
    { id: 7, sender: "Jade K.",    initial: "J", color: "#FF69B4", text: "Link dropped in the group thread. 5 rooms, private pool 🌴", time: "9:22 AM" },
  ],
  2: [
    { id: 1, sender: "Temi A.",    initial: "T", color: "#FF1F7D", text: "SOB's is going OFF this night. Who's dressing up?", time: "3:00 PM" },
    { id: 2, sender: "Zara F.",    initial: "Z", color: "#FF69B4", text: "Always. What's the dress code — chic or full Afrobeats?", time: "3:05 PM" },
    { id: 3, sender: "Me",         initial: "Y", color: "#FF1F7D", text: "Full send. I'm wearing my Ankara set 🔥", time: "3:08 PM", isMe: true },
    { id: 4, sender: "Temi A.",    initial: "T", color: "#FF1F7D", text: "YESSS. We're getting there by 10 — doors open at 9", time: "3:10 PM" },
    { id: 5, sender: "Me",         initial: "Y", color: "#FF1F7D", text: "Pregame at mine before? I'm 10 min from SOB's", time: "3:12 PM", isMe: true },
  ],
  3: [
    { id: 1, sender: "Sofia W.",   initial: "S", color: "#83C5A0", text: "Sunday walk is confirmed! Meet at Grand Army Plaza at 9AM 🌿", time: "Fri · 6pm" },
    { id: 2, sender: "Naomi B.",   initial: "N", color: "#FF69B4", text: "I'll bring matcha for everyone ☕", time: "Fri · 6:15pm" },
    { id: 3, sender: "Me",         initial: "Y", color: "#FF1F7D", text: "Perfect. See everyone Sunday 🌅", time: "Fri · 7pm", isMe: true },
  ],
};

// ── QR Code ────────────────────────────────────────────────────────────────────

function QRCodeVisual({ seed }: { seed: number }) {
  const size = 13;
  const cell = 6;
  function cell64(r: number, c: number) {
    return ((seed * 31 + r * 17 + c * 7) % 3) !== 0;
  }
  const cells: boolean[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
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

// ── Ticket Sheet ───────────────────────────────────────────────────────────────

function PlanTicketSheet({ room, onClose, onOpenRoom }: {
  room: PlanRoom;
  onClose: () => void;
  onOpenRoom: () => void;
}) {
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
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1.5px dashed rgba(0,0,0,0.08)" }}>
              <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
              <p className="text-[9px] font-semibold tracking-[0.15em] uppercase" style={{ color: "#bbb" }}>PLAN ROOM TICKET</p>
            </div>
            <div className="flex items-center justify-center" style={{ height: "80px", background: room.bg }}>
              <span style={{ fontSize: "38px" }}>{room.emoji}</span>
            </div>
            <div className="px-6 pt-4 pb-2">
              <p className="text-[9px] font-bold tracking-wider uppercase mb-1" style={{ color: "#FF1F7D" }}>YOUR TICKET</p>
              <h2 className="font-black leading-none mb-2"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(20px,6vw,28px)", color: "#111", lineHeight: 0.92, letterSpacing: "-0.015em" }}>
                {room.name}
              </h2>
              <p className="text-xs" style={{ color: "#777" }}>{room.time}</p>
              <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{room.venue}</p>
            </div>
            <div style={{ borderTop: "1.5px dashed rgba(0,0,0,0.08)", margin: "12px 24px" }} />
            <div className="px-6 pb-6 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[8px] font-mono tracking-widest" style={{ color: "#bbb" }}>{ticketCode}</p>
                <div className="flex items-center gap-1 py-0.5 px-2 rounded-full w-fit"
                  style={{ background: "linear-gradient(135deg, #1A1208 0%, #2D1E08 100%)", border: "1px solid rgba(212,168,83,0.35)" }}>
                  <span style={{ fontSize: "7px", color: "#D4A853" }}>✦</span>
                  <span className="text-[7px] font-bold tracking-[0.12em] uppercase" style={{ color: "#D4A853" }}>Founding Mother #47</span>
                </div>
                <p className="text-[9px] font-semibold" style={{ color: "#999" }}>{room.members} women · Show at door</p>
              </div>
              <div className="flex-shrink-0 rounded-xl overflow-hidden p-2" style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)" }}>
                <QRCodeVisual seed={room.id * 13 + 42} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pt-3 pb-8 flex gap-3">
          <button className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: "#111111", color: "white" }}>
            💌 Invite a Bloomie
          </button>
          <button
            onClick={() => { onClose(); setTimeout(onOpenRoom, 120); }}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: room.accent, color: "white", boxShadow: `0 4px 14px ${room.accent}44` }}>
            Open Room →
          </button>
        </div>
      </div>
    </>
  );
}

// ── Plan Room Thread View ──────────────────────────────────────────────────────

function PlanRoomThread({ room, onBack }: { room: PlanRoom; onBack: () => void }) {
  const [msgs, setMsgs] = useState<PlanMessage[]>(ROOM_MESSAGES[room.id] ?? []);
  const [draft, setDraft] = useState("");
  const [showTicket, setShowTicket] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMsgs(prev => [...prev, {
      id: prev.length + 100,
      sender: "Me", initial: "Y", color: "#FF1F7D",
      text, time: "now", isMe: true,
    }]);
    setDraft("");
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0A0806" }}>
      {/* Room header */}
      <div className="flex-shrink-0 relative overflow-hidden"
        style={{ background: room.bg, paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${room.accent}22 0%, transparent 60%)` }} />
        <div className="relative flex items-center gap-3 px-5 pt-12 pb-4 md:pt-10">
          <button onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
            style={{ background: "rgba(255,255,255,0.08)" }}>
            {room.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-tight text-white truncate">{room.name}</p>
            <p className="text-[10px] mt-0.5" style={{ color: `${room.accent}BB` }}>
              {room.members} women · {room.time}
            </p>
          </div>
          <button
            onClick={() => setShowTicket(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95"
            style={{ background: `${room.accent}22`, color: room.accent, border: `1px solid ${room.accent}44` }}>
            🎟 Ticket
          </button>
        </div>
        {/* Bottom fade */}
        <div className="h-4" style={{ background: "linear-gradient(to bottom, transparent, #0A0806)" }} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ paddingBottom: "80px" }}>
        {/* Room info pill */}
        <div className="flex justify-center mb-1">
          <span className="text-[9px] font-semibold px-3 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
            {room.venue}
          </span>
        </div>

        {msgs.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}>
            {!msg.isMe && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 self-end text-[10px]"
                style={{ background: `linear-gradient(135deg, ${msg.color}, ${msg.color}BB)` }}>
                {msg.initial}
              </div>
            )}
            <div className={`max-w-[75%] ${msg.isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
              {!msg.isMe && (
                <p className="text-[10px] font-semibold px-1" style={{ color: "rgba(255,255,255,0.35)" }}>{msg.sender}</p>
              )}
              <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={msg.isMe
                  ? { background: room.accent, color: "white", borderBottomRightRadius: "6px", boxShadow: `0 2px 10px ${room.accent}44` }
                  : { background: "rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.85)", borderBottomLeftRadius: "6px" }}>
                {msg.text}
              </div>
              <p className="text-[9px] px-1" style={{ color: "rgba(255,255,255,0.2)" }}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-3"
        style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.07)", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div className="flex-1 rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <input value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={`Message ${room.name}…`}
            className="w-full px-4 py-3 text-sm outline-none bg-transparent"
            style={{ color: "rgba(255,255,255,0.85)" }} />
        </div>
        <button onClick={send}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
          style={{ background: draft.trim() ? room.accent : "rgba(255,255,255,0.08)", boxShadow: draft.trim() ? `0 2px 10px ${room.accent}55` : "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={draft.trim() ? "white" : "rgba(255,255,255,0.3)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      {/* Ticket sheet overlay from within room */}
      {showTicket && (
        <PlanTicketSheet
          room={room}
          onClose={() => setShowTicket(false)}
          onOpenRoom={() => setShowTicket(false)}
        />
      )}
    </div>
  );
}

// ── New Plan Room Sheet ────────────────────────────────────────────────────────

function NewPlanRoomSheet({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");

  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{ background: "white", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", paddingBottom: "env(safe-area-inset-bottom, 24px)" }}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div className="px-6 pb-3 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>✦ NEW PLAN ROOM</p>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: "rgba(0,0,0,0.05)" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1l10 10M11 1L1 11"/>
            </svg>
          </button>
        </div>
        <div className="px-6 pt-5 pb-8 flex flex-col gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "#bbb" }}>Room name</p>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Morocco October, Brunch Girls…"
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE", color: "#111" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "#bbb" }}>What&apos;s the plan?</p>
            <input value={details} onChange={e => setDetails(e.target.value)}
              placeholder="Event, trip, outing… add a date or venue"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE", color: "#111" }} />
          </div>
          <button
            onClick={() => { if (name.trim()) onClose(); }}
            disabled={!name.trim()}
            className="w-full py-4 rounded-full text-sm font-bold transition-all active:scale-[0.98]"
            style={name.trim()
              ? { background: "linear-gradient(135deg, #FF1F7D, #FF69B4)", color: "white", boxShadow: "0 4px 16px rgba(255,31,125,0.3)" }
              : { background: "#F5E8EE", color: "#C8A0B0" }}>
            {name.trim() ? "Create Plan Room →" : "Add a room name first"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Plan Room Card ─────────────────────────────────────────────────────────────

function PlanRoomCard({ room, onPress }: { room: PlanRoom; onPress: () => void }) {
  return (
    <button onClick={onPress}
      className="flex-shrink-0 rounded-2xl overflow-hidden relative active:scale-[0.96] transition-transform text-left"
      style={{ width: "112px", background: room.bg, boxShadow: "0 4px 18px rgba(0,0,0,0.22)" }}>
      <div className="flex items-center justify-center relative" style={{ height: "90px" }}>
        <span style={{ fontSize: "36px" }}>{room.emoji}</span>
        {room.unread > 0 && (
          <div className="absolute top-2 right-2 min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1.5"
            style={{ background: "#FF1F7D", boxShadow: "0 2px 8px rgba(255,31,125,0.55)" }}>
            <span className="text-[10px] font-black text-white leading-none">{room.unread}</span>
          </div>
        )}
      </div>
      <div className="px-3 pb-3 pt-1.5">
        <p className="text-[11px] font-bold leading-tight text-white truncate">{room.name}</p>
        <p className="text-[9px] mt-0.5 font-medium" style={{ color: room.accent }}>{room.members} women · {room.date}</p>
      </div>
    </button>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function PlansPage() {
  const [view, setView] = useState<View>("list");
  const [activeRoom, setActiveRoom] = useState<PlanRoom | null>(null);
  const [ticketRoom, setTicketRoom] = useState<PlanRoom | null>(null);
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [read, setRead] = useState<Set<number>>(new Set());

  function openRoom(room: PlanRoom) {
    setRead(prev => new Set([...prev, room.id]));
    setActiveRoom(room);
    setView("room");
  }

  if (view === "room" && activeRoom) {
    return <PlanRoomThread room={activeRoom} onBack={() => { setView("list"); setActiveRoom(null); }} />;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>

      {/* Header */}
      <div className="px-5 pt-20 pb-6 md:px-10 md:pt-8 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ YOUR PLANS</p>
          <h1 className="font-black leading-none"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(34px,6vw,48px)", color: "#111", lineHeight: 0.92, letterSpacing: "-0.02em" }}>
            Plans.
          </h1>
          <p className="text-sm italic mt-2" style={{ fontFamily: "var(--font-instrument)", color: "#999" }}>
            Your rooms, tickets & plan threads.
          </p>
        </div>
        {/* + button top-right */}
        <button onClick={() => setShowNewRoom(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-all active:scale-90"
          style={{ background: "linear-gradient(135deg, #FF1F7D, #FF69B4)", boxShadow: "0 3px 12px rgba(255,31,125,0.38)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      {/* Plan Rooms — horizontal scroll */}
      <div className="mb-8">
        <div className="px-5 md:px-10 flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(0,0,0,0.35)" }}>
            PLAN ROOMS
          </p>
          <p className="text-[10px] font-semibold" style={{ color: "#FF1F7D" }}>
            {PLAN_ROOMS.length} rooms
          </p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1"
          style={{ paddingLeft: "20px", paddingRight: "20px", scrollbarWidth: "none" }}>
          {PLAN_ROOMS.map(room => (
            <PlanRoomCard key={room.id} room={room} onPress={() => openRoom(room)} />
          ))}
          {/* Create new room card */}
          <button onClick={() => setShowNewRoom(true)}
            className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95"
            style={{ width: "112px", height: "126px", background: "rgba(255,31,125,0.06)", border: "1.5px dashed rgba(255,31,125,0.25)" }}>
            <span style={{ color: "#FF1F7D", fontSize: "22px", lineHeight: 1, marginBottom: "6px" }}>+</span>
            <p className="text-[10px] font-semibold" style={{ color: "rgba(255,31,125,0.6)" }}>New Room</p>
          </button>
        </div>
      </div>

      {/* My Tickets section */}
      <div className="px-5 md:px-10 mb-6">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(0,0,0,0.35)" }}>MY TICKETS</p>
        <div className="flex flex-col gap-3">
          {PLAN_ROOMS.map(room => {
            const unread = room.unread > 0 && !read.has(room.id);
            return (
              <div key={room.id} className="rounded-2xl overflow-hidden"
                style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                <button onClick={() => openRoom(room)}
                  className="w-full flex items-stretch text-left active:scale-[0.99] transition-transform">
                  {/* Color strip */}
                  <div className="w-14 flex-shrink-0 flex items-center justify-center"
                    style={{ background: room.bg, minHeight: "72px" }}>
                    <span style={{ fontSize: "24px" }}>{room.emoji}</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 px-4 py-3">
                    <p className="text-[9px] font-bold tracking-wider uppercase mb-0.5" style={{ color: "#FF1F7D" }}>PLAN ROOM</p>
                    <p className="font-bold text-sm leading-snug" style={{ color: "#111" }}>{room.name}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#aaa" }}>{room.time} · {room.members} women</p>
                  </div>
                  {/* Unread or chevron */}
                  <div className="flex items-center pr-4 gap-2">
                    {unread && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: "#FF1F7D" }}>
                        <span className="text-[9px] font-black text-white">{room.unread}</span>
                      </div>
                    )}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </button>
                {/* Perforation + footer */}
                <div style={{ borderTop: "1px dashed rgba(0,0,0,0.06)", marginLeft: "12px", marginRight: "12px" }} />
                <div className="px-4 py-2 flex items-center justify-between">
                  <p className="text-[9px] font-mono" style={{ color: "#ccc" }}>
                    BB-{room.id.toString().padStart(2, "0")}-{(room.id * 7841 + 3301) % 9000 + 1000}
                  </p>
                  <button onClick={() => setTicketRoom(room)}
                    className="text-[9px] font-semibold transition-all active:opacity-70"
                    style={{ color: "#FF1F7D" }}>
                    View ticket →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state footer */}
      <div className="px-5 md:px-10 flex flex-col items-center justify-center py-6 text-center">
        <p style={{ fontSize: "28px" }}>🎫</p>
        <p className="font-bold mt-2 text-sm" style={{ color: "#bbb" }}>RSVP to events for more tickets.</p>
      </div>

      {/* Ticket sheet */}
      {ticketRoom && (
        <PlanTicketSheet
          room={ticketRoom}
          onClose={() => setTicketRoom(null)}
          onOpenRoom={() => { setTicketRoom(null); openRoom(ticketRoom); }}
        />
      )}

      {/* New plan room sheet */}
      {showNewRoom && <NewPlanRoomSheet onClose={() => setShowNewRoom(false)} />}
    </div>
  );
}
