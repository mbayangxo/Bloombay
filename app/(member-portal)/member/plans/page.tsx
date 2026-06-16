"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BloomiesPlanner } from "@/app/components/portal/bloomies-planner";

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface PlanRoom {
  id: number; name: string; emoji: string; bg: string; accent: string;
  unread: number; members: number; date: string; venue?: string; time?: string;
  eventId?: number; poster?: string;
}
interface DayContent { text: string; stickers: string[]; photos: string[]; voiceCount: number; }
type View = "list" | "room";
type MainTab = "plans" | "calendar";
type NewPlanStep = "choose" | "room" | "bloomie" | "club";
type DayEditorTab = "write" | "sticker" | "photo" | "voice";

// (night mode removed — always use light pink theme)

const THEME = {
  pageBg:      "linear-gradient(160deg, #FFF0F8 0%, #FFF5EC 50%, #FEF0F8 100%)",
  topBar:      "rgba(255,255,255,0.97)",
  topBarBorder:"rgba(255,31,125,0.1)",
  cardBg:      "rgba(255,255,255,0.92)",
  cardBorder:  "rgba(255,31,125,0.12)",
  heading:     "#1A1A1A",
  subText:     "#888",
  label:       "rgba(0,0,0,0.35)",
  sectionBg:   "rgba(255,255,255,0.85)",
  inputBg:     "#FFF5F8",
};

// ── DATA ──────────────────────────────────────────────────────────────────────

const PINK = "#FF1F7D";

const PLAN_ROOMS: PlanRoom[] = [
  { id: 1, name: "Morocco October",     emoji: "🇲🇦", bg: "#1A0E0A", accent: "#FF69B4", unread: 7,  members: 14, date: "Oct 2026", venue: "Marrakech · Private Villa",       time: "Oct 10–17, 2026",   poster: "/happenings/posters/10_Ladies_First_Road_Trip.png" },
  { id: 2, name: "Afrobeats Night",     emoji: "🎵",  bg: "#0F0818", accent: "#FF1F7D", unread: 3,  members: 8,  date: "Jun 14",  venue: "SOB's, 204 Varick St",            time: "Sat Jun 14 · 10PM", poster: "/happenings/posters/06_Dance_All_Night.png",          eventId: 6 },
  { id: 3, name: "Sunday Walk Circle",  emoji: "🌿",  bg: "#0A120F", accent: "#83C5A0", unread: 0,  members: 6,  date: "Jun 8",   venue: "Prospect Park, Grand Army Plaza", time: "Sun Jun 8 · 9AM",   poster: "/happenings/posters/09_Bagels_And_Books.png",         eventId: 4 },
  { id: 4, name: "Women in Lens",       emoji: "🎨",  bg: "#1A0A14", accent: "#FF1F7D", unread: 2,  members: 5,  date: "Tonight", venue: "The Parlor Gallery, Bushwick",    time: "Tonight · 7PM",     poster: "/happenings/posters/05_Film_Club.png",                eventId: 1 },
  { id: 5, name: "Wheel Throwing",      emoji: "🏺",  bg: "#0A1518", accent: "#83C5A0", unread: 1,  members: 4,  date: "Tonight", venue: "Brooklyn Clay, Williamsburg",     time: "Tonight · 6:30PM",  poster: "/happenings/posters/07_Sunday_Brunch_Club.png",       eventId: 2 },
  { id: 6, name: "Golden Hour Rooftop", emoji: "🌅",  bg: "#180A06", accent: "#F59E0B", unread: 0,  members: 6,  date: "Tonight", venue: "Westlight Hotel, Williamsburg",   time: "Tonight · 8PM",     poster: "/happenings/posters/08_Rooftop_Sessions.png",         eventId: 3 },
];

const BLOOMIES_LIST = [
  { id: 1, name: "Aaliyah M.", initial: "A", color: "#FF1F7D", status: "Active now" },
  { id: 2, name: "Zara F.",    initial: "Z", color: "#FF69B4", status: "Online"     },
  { id: 3, name: "Temi A.",    initial: "T", color: "#A855F7", status: "3h ago"     },
  { id: 4, name: "Jade K.",    initial: "J", color: "#0EA5E9", status: "Yesterday"  },
  { id: 5, name: "Sofia W.",   initial: "S", color: "#83C5A0", status: "Online"     },
  { id: 6, name: "Naomi B.",   initial: "N", color: "#D4A853", status: "2d ago"     },
];

const CLUBS_LIST = [
  { id: 1, name: "Women & Lens",         emoji: "📸", members: 42 },
  { id: 2, name: "Sunday Walkers",       emoji: "🌿", members: 28 },
  { id: 3, name: "Afrobeats Collective", emoji: "🎵", members: 67 },
];

const PLAN_TODOS: Record<number, { id: number; text: string; done: boolean }[]> = {
  1: [
    { id: 1, text: "Book flights JFK → RAK",              done: false },
    { id: 2, text: "Reserve riad (Nadia's link)",         done: false },
    { id: 3, text: "Check Morocco visa requirements",     done: true  },
    { id: 4, text: "Travel insurance",                   done: false },
    { id: 5, text: "Group flight coordination call",     done: false },
    { id: 6, text: "Shared packing list",                done: false },
  ],
  2: [
    { id: 1, text: "Get tickets (3 left!)",              done: false },
    { id: 2, text: "Pregame at mine — 9PM",              done: true  },
    { id: 3, text: "Rideshare to SOB's",                 done: false },
    { id: 4, text: "Outfit check ✔️",                   done: true  },
  ],
  3: [
    { id: 1, text: "Meet at Grand Army Plaza 9AM",       done: true  },
    { id: 2, text: "Naomi bringing matcha 🍵",           done: true  },
    { id: 3, text: "Wear comfy shoes",                   done: false },
  ],
  4: [
    { id: 1, text: "Get there by 6:45 (talk at 7:15)",  done: false },
    { id: 2, text: "Free champagne reception!",          done: false },
    { id: 3, text: "Meet Sofía at Wyckoff corner",       done: true  },
  ],
  5: [
    { id: 1, text: "Wear old clothes (clay splatter!)",  done: false },
    { id: 2, text: "Brooklyn Clay, Williamsburg",        done: true  },
    { id: 3, text: "Session starts 6:30PM sharp",       done: false },
  ],
  6: [
    { id: 1, text: "Wear something gold 🌟",            done: false },
    { id: 2, text: "Arrive before sunset (8PM)",        done: false },
    { id: 3, text: "Reserve Westlight rooftop bar",     done: true  },
  ],
};

const PLAN_NOTES: Record<number, { id: number; text: string }[]> = {
  1: [
    { id: 1, text: "Riad has private pool 🌴 link in group" },
    { id: 2, text: "Oct 10-17 works for everyone" },
    { id: 3, text: "Budget ~$2,200 per person all in" },
  ],
  2: [{ id: 1, text: "SOB's fills up — arrive by 10 latest" }],
  3: [{ id: 1, text: "Route: Grand Army → Boathouse → Vale" }],
  4: [{ id: 1, text: "Artist talk starts 7:15. Don't be late!" }, { id: 2, text: "Champagne reception is FREE 🥂" }],
  5: [{ id: 1, text: "First-timers: centering clay takes 20 min to learn, be patient!" }],
  6: [{ id: 1, text: "Sunset is 8:24PM — arrive early for good spots" }],
};

const EVENT_DATES: Record<string, { emoji: string; name: string; time: string; color: string }[]> = {
  "2026-06-07": [{ emoji: "🌿", name: "Sunday Walk Circle",  time: "9AM",    color: "#83C5A0" }],
  "2026-06-08": [{ emoji: "🎨", name: "Women in Lens",       time: "7PM",    color: "#FF1F7D" }, { emoji: "🏺", name: "Wheel Throwing", time: "6:30PM", color: "#83C5A0" }],
  "2026-06-14": [{ emoji: "🎵", name: "Afrobeats Night",     time: "10PM",   color: "#FF69B4" }],
  "2026-06-20": [{ emoji: "🌅", name: "Golden Hour Rooftop", time: "8PM",    color: "#F59E0B" }],
  "2026-10-10": [{ emoji: "🇲🇦", name: "Morocco October",   time: "10AM",   color: "#FF69B4" }],
};

type StickerPackId = "bloom" | "hearts" | "glam" | "stars" | "nyc";
const STICKER_PACKS: Record<StickerPackId, string[]> = {
  bloom:  ["🌸","🌺","🌷","🌹","💐","🪷","🌼","🌻","🌿","🍃","🌱","🪴","🫧","🪻","🌾","❀","✿","🎋"],
  hearts: ["💕","💖","💗","💝","❤️","🩷","💞","💌","💘","🫶","💓","♥️","❣️","🎀","🩰","💟","🫦","🌹"],
  glam:   ["💎","👑","🎀","💄","👠","💍","🪞","🛁","🫧","💅","🪭","🧴","🥂","🍾","🌟","✨","💫","🪩"],
  stars:  ["✨","⭐","🌟","💫","🌙","☀️","🌈","🌠","🎇","🎆","🌌","🔮","⚡","🎑","🌛","🌜","★","☆"],
  nyc:    ["🗽","🌆","🚕","🏙","🌉","🚇","🍕","🥯","☕","🌃","🛗","🌁","🎭","🎪","🍎","📸","🎶","🏟"],
};

// Module-level store so user stickers persist across day-editor open/close
const USER_STICKERS_STORE: string[] = [];

// ── PER-MONTH CALENDAR THEMES ─────────────────────────────────────────────────
const MONTH_THEMES = [
  /* 0 Jan */ { headerGrad:"linear-gradient(160deg,#F0EDE8 0%,#E8E4DF 100%)", binding:"#A8A0A8", accent:"#8A9DC0", textColor:"#3A3228", deco:"❄️", decoExtra:["✦","❄","✦"], watermark:"WINTER", gridBg:"#FDFAF7", todayRing:"#8A9DC0" },
  /* 1 Feb */ { headerGrad:"linear-gradient(160deg,#FCE0E8 0%,#F8C8D4 100%)", binding:"#D4607A", accent:"#CC3355", textColor:"#7A1530", deco:"💕", decoExtra:["♡","♥","♡"], watermark:"LOVE",   gridBg:"#FFF5F8", todayRing:"#CC3355" },
  /* 2 Mar */ { headerGrad:"linear-gradient(160deg,#EDF5EC 0%,#D8EED5 100%)", binding:"#6A9E68", accent:"#4A8A48", textColor:"#1A3818", deco:"🌸", decoExtra:["✿","❀","✿"], watermark:"BLOOM",  gridBg:"#F6FCF5", todayRing:"#4A8A48" },
  /* 3 Apr */ { headerGrad:"linear-gradient(160deg,#EDE8F8 0%,#DDD5F5 100%)", binding:"#8A70C8", accent:"#6A50B8", textColor:"#2A1860", deco:"🦋", decoExtra:["✦","✿","✦"], watermark:"SPRING", gridBg:"#F7F4FD", todayRing:"#6A50B8" },
  /* 4 May */ { headerGrad:"linear-gradient(160deg,#FEFAE0 0%,#FBF0C0 100%)", binding:"#C8A820", accent:"#A88808", textColor:"#4A3800", deco:"🌼", decoExtra:["☀","✦","☀"], watermark:"GOLDEN", gridBg:"#FFFDF0", todayRing:"#C8A820" },
  /* 5 Jun */ { headerGrad:"linear-gradient(160deg,#FFD0E8 0%,#FFB0D4 100%)", binding:"#FF1F7D", accent:"#FF1F7D", textColor:"#7A0038", deco:"🌺", decoExtra:["✦","❋","✦"], watermark:"BLOOM",  gridBg:"#FFF0F8", todayRing:"#FF1F7D" },
  /* 6 Jul */ { headerGrad:"linear-gradient(160deg,#FFE8D8 0%,#FFD0B8 100%)", binding:"#E07040", accent:"#C05028", textColor:"#5A1808", deco:"🐚", decoExtra:["〰","≈","〰"], watermark:"SUMMER", gridBg:"#FFF8F5", todayRing:"#E07040" },
  /* 7 Aug */ { headerGrad:"linear-gradient(160deg,#D8EEF8 0%,#C0E0F5 100%)", binding:"#3888C8", accent:"#1870B0", textColor:"#083858", deco:"🌊", decoExtra:["≈","〰","≈"], watermark:"WAVES",  gridBg:"#F5FAFE", todayRing:"#3888C8" },
  /* 8 Sep */ { headerGrad:"linear-gradient(160deg,#F8ECD8 0%,#F5DFC0 100%)", binding:"#C88040", accent:"#A86020", textColor:"#4A2808", deco:"🍂", decoExtra:["✦","❋","✦"], watermark:"GOLDEN", gridBg:"#FFFBF5", todayRing:"#C88040" },
  /* 9 Oct */ { headerGrad:"linear-gradient(160deg,#ECD8F5 0%,#DCC0F0 100%)", binding:"#8840C8", accent:"#6820A8", textColor:"#280848", deco:"🌙", decoExtra:["✦","★","✦"], watermark:"MAGIC",  gridBg:"#FAF5FF", todayRing:"#8840C8" },
  /* 10 Nov*/ { headerGrad:"linear-gradient(160deg,#F0E8DC 0%,#E8D8C4 100%)", binding:"#987060", accent:"#785040", textColor:"#381808", deco:"🍁", decoExtra:["✦","❋","✦"], watermark:"COZY",   gridBg:"#FBF7F3", todayRing:"#987060" },
  /* 11 Dec*/ { headerGrad:"linear-gradient(160deg,#F8E8F0 0%,#F0D0E4 100%)", binding:"#A82058", accent:"#881040", textColor:"#480820", deco:"⭐", decoExtra:["❄","✦","❄"], watermark:"JOY",    gridBg:"#FDF5F8", todayRing:"#A82058" },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES   = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const DAY_FULL    = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ── QR CODE ───────────────────────────────────────────────────────────────────

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

// ── INVITE BLOOMIE SHEET ──────────────────────────────────────────────────────

function InviteBloomieSheet({ room, onClose, onBack }: { room: PlanRoom; onClose: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sent, setSent] = useState(false);
  function toggle(id: number) { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  if (sent) return (
    <>
      <div className="fixed inset-0 z-[60]" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl" style={{ background: "#FDFAF5", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)", paddingBottom: "env(safe-area-inset-bottom,24px)" }}>
        <div className="flex flex-col items-center py-10 px-6 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg,#FF1F7D,#FF69B4)", boxShadow: "0 4px 20px rgba(255,31,125,0.35)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="font-black text-xl mb-1" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>Invitations sent!</p>
          <p className="text-sm" style={{ color: "#999", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>{selected.size} Bloomie{selected.size !== 1 ? "s" : ""} invited to {room.name}</p>
          <button onClick={onClose} className="mt-6 px-8 py-3.5 rounded-full text-sm font-bold" style={{ background: "#FF1F7D", color: "white" }}>Done</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="fixed inset-0 z-[60]" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl flex flex-col" style={{ background: "#FDFAF5", maxHeight: "88vh", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0"><div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} /></div>
        <div className="px-6 pb-4 pt-2 flex items-center justify-between flex-shrink-0" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.05)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>💌 INVITE TO {room.name.toUpperCase()}</p>
              <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>Choose who to invite</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.05)" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {BLOOMIES_LIST.map(b => {
            const on = selected.has(b.id);
            return (
              <button key={b.id} onClick={() => toggle(b.id)} className="w-full flex items-center gap-4 px-6 py-3.5 text-left" style={{ borderBottom: "1px solid #F5F5F5", background: on ? "#FFF5F8" : "white" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 text-sm" style={{ background: `linear-gradient(135deg,${b.color},${b.color}BB)` }}>{b.initial}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: "#111" }}>{b.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#aaa" }}>{b.status}</p>
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={on ? { background: "#FF1F7D" } : { background: "transparent", border: "2px solid #E5E5E5" }}>
                  {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              </button>
            );
          })}
        </div>
        <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid #F0F0F0", paddingBottom: "max(16px,env(safe-area-inset-bottom))" }}>
          <button onClick={() => setSent(true)} disabled={selected.size === 0} className="w-full py-4 rounded-full text-sm font-bold"
            style={selected.size > 0 ? { background: "#FF1F7D", color: "white" } : { background: "#F5E8EE", color: "#C8A0B0" }}>
            {selected.size > 0 ? `Send invite to ${selected.size} Bloomie${selected.size !== 1 ? "s" : ""} →` : "Select Bloomies to invite"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── PLAN TICKET SHEET ─────────────────────────────────────────────────────────

function PlanTicketSheet({ room, onClose, onOpenRoom }: { room: PlanRoom; onClose: () => void; onOpenRoom: () => void }) {
  const [showInvite, setShowInvite] = useState(false);
  const ticketCode = `BB-${room.id.toString().padStart(2, "0")}-${(room.id * 7841 + 3301) % 9000 + 1000}`;
  if (showInvite) return <InviteBloomieSheet room={room} onClose={onClose} onBack={() => setShowInvite(false)} />;
  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden" style={{ background: "#FDFAF5", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}>
        <div className="flex justify-center pt-3 pb-1"><div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} /></div>
        <div className="px-5 pb-2">
          <div className="rounded-3xl overflow-hidden" style={{ background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1.5px dashed rgba(0,0,0,0.08)" }}>
              <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
              <p className="text-[9px] font-semibold tracking-[0.15em] uppercase" style={{ color: "#bbb" }}>PLAN ROOM TICKET</p>
            </div>
            <div className="flex items-center justify-center" style={{ height: "80px", background: room.bg }}>
              <span style={{ fontSize: "38px" }}>{room.emoji}</span>
            </div>
            <div className="px-6 pt-4 pb-2">
              <p className="text-[9px] font-bold tracking-wider uppercase mb-1" style={{ color: "#FF1F7D" }}>YOUR TICKET</p>
              <h2 className="font-black leading-none mb-2" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(20px,6vw,28px)", color: "#111", lineHeight: 0.92 }}>{room.name}</h2>
              <p className="text-xs" style={{ color: "#777" }}>{room.time}</p>
              <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{room.venue}</p>
            </div>
            <div style={{ borderTop: "1.5px dashed rgba(0,0,0,0.08)", margin: "12px 24px" }} />
            <div className="px-6 pb-6 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[8px] font-mono tracking-widest" style={{ color: "#bbb" }}>{ticketCode}</p>
                <div className="flex items-center gap-1 py-0.5 px-2 rounded-full w-fit" style={{ background: "linear-gradient(135deg,#1A1208,#2D1E08)", border: "1px solid rgba(212,168,83,0.35)" }}>
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
        <div className="px-5 pt-3 pb-8 flex gap-3">
          <button onClick={() => setShowInvite(true)} className="flex-1 py-3.5 rounded-2xl font-bold text-sm" style={{ background: "#111", color: "white" }}>💌 Invite a Bloomie</button>
          <button onClick={() => { onClose(); setTimeout(onOpenRoom, 120); }} className="flex-1 py-3.5 rounded-2xl font-bold text-sm" style={{ background: room.accent, color: "white" }}>Open Room →</button>
        </div>
      </div>
    </>
  );
}

// ── STICKER KEYBOARD ──────────────────────────────────────────────────────────

function StickerKeyboard({ onAdd }: { onAdd: (s: string) => void }) {
  const [activePack, setActivePack] = useState<StickerPackId | "yours">("bloom");
  const [userStickers, setUserStickers] = useState<string[]>([...USER_STICKERS_STORE]);
  const fileRef = useRef<HTMLInputElement>(null);

  const PACK_TABS: { id: StickerPackId | "yours"; emoji: string; name: string }[] = [
    { id: "bloom",  emoji: "🌸", name: "BLOOM"  },
    { id: "hearts", emoji: "💕", name: "LOVE"   },
    { id: "glam",   emoji: "💎", name: "GLAM"   },
    { id: "stars",  emoji: "⭐", name: "MAGIC"  },
    { id: "nyc",    emoji: "🗽", name: "NYC"    },
    { id: "yours",  emoji: "📸", name: "YOURS"  },
  ];

  const stickers: string[] = activePack === "yours" ? userStickers : STICKER_PACKS[activePack as StickerPackId];

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        const url = ev.target.result as string;
        USER_STICKERS_STORE.push(url);
        setUserStickers([...USER_STICKERS_STORE]);
        setActivePack("yours");
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ background: "white" }}>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />

      {/* Pack tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "0 6px" }}>
        {PACK_TABS.map(p => (
          <button key={p.id} onClick={() => setActivePack(p.id)}
            style={{ flex: 1, paddingTop: 8, paddingBottom: 8, background: "none", border: "none", borderBottom: activePack === p.id ? `2.5px solid ${PINK}` : "2.5px solid transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "border-color 0.15s" }}>
            <span style={{ fontSize: 20 }}>{p.emoji}</span>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.1em", color: activePack === p.id ? PINK : "#ccc" }}>{p.name}</p>
          </button>
        ))}
      </div>

      {/* YOURS — empty upload state */}
      {activePack === "yours" && userStickers.length === 0 && (
        <div style={{ padding: "28px 20px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,31,125,0.08)", border: "2px dashed rgba(255,31,125,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", marginBottom: 4 }}>Your Sticker Pack</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#aaa", lineHeight: 1.4 }}>Upload PNG images to use as custom stickers on your planner</p>
          </div>
          <button onClick={() => fileRef.current?.click()} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg,#FF1F7D,#FF69B4)", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(255,31,125,0.3)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>UPLOAD STICKER →</p>
          </button>
        </div>
      )}

      {/* Sticker grid */}
      {(activePack !== "yours" || userStickers.length > 0) && (
        <div style={{ padding: "10px 10px 6px" }}>
          {activePack === "yours" && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
              <button onClick={() => fileRef.current?.click()} style={{ padding: "5px 14px", borderRadius: 999, background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.2)", cursor: "pointer" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: PINK }}>+ Upload more</p>
              </button>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 7 }}>
            {stickers.map((s, i) => (
              <button key={i} onClick={() => onAdd(s)}
                className="active:scale-90 transition-transform"
                style={{ aspectRatio: "1", borderRadius: 14, background: "rgba(255,31,125,0.04)", border: "1px solid rgba(255,31,125,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}>
                {s.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s} alt="" style={{ width: "75%", height: "75%", objectFit: "contain" }} />
                ) : (
                  <span style={{ fontSize: 26 }}>{s}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── DAY EDITOR SHEET (POLAROID CALENDAR STYLE) ────────────────────────────────

function DayEditorSheet({ dayKey, content, onUpdate, onClose }: {
  dayKey: string; content: DayContent;
  onUpdate: (c: DayContent) => void; onClose: () => void;
}) {
  const [tab, setTab] = useState<DayEditorTab>("write");
  const [text, setText] = useState(content.text);
  const [stickers, setStickers] = useState<string[]>(content.stickers);
  const [photos, setPhotos] = useState<string[]>(content.photos);
  const [voiceCount, setVoiceCount] = useState(content.voiceCount);
  const [recording, setRecording] = useState(false);
  const [recSecs, setRecSecs] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef(text);
  const stickersRef = useRef(stickers);
  const photosRef = useRef(photos);
  const voiceRef = useRef(voiceCount);

  const date = new Date(dayKey + "T12:00:00");
  const dayNum   = date.getDate();
  const dayLabel = DAY_FULL[date.getDay()];
  const monthLabel = MONTH_NAMES[date.getMonth()];
  const eventsToday = EVENT_DATES[dayKey] ?? [];

  function save(overrides: Partial<DayContent> = {}) {
    onUpdate({ text: textRef.current, stickers: stickersRef.current, photos: photosRef.current, voiceCount: voiceRef.current, ...overrides });
  }
  function handleText(s: string) { textRef.current = s; setText(s); save({ text: s }); }
  function addSticker(s: string) { const n = [...stickersRef.current, s]; stickersRef.current = n; setStickers(n); save({ stickers: n }); }
  function removeSticker(i: number) { const n = stickersRef.current.filter((_, j) => j !== i); stickersRef.current = n; setStickers(n); save({ stickers: n }); }
  function removePhoto(i: number) { const n = photosRef.current.filter((_, j) => j !== i); photosRef.current = n; setPhotos(n); save({ photos: n }); }

  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    if (recording) t = setInterval(() => setRecSecs(s => s + 1), 1000);
    else setRecSecs(0);
    return () => clearInterval(t);
  }, [recording]);

  function stopRecording() {
    setRecording(false);
    if (recSecs > 0) { const n = voiceRef.current + 1; voiceRef.current = n; setVoiceCount(n); save({ voiceCount: n }); }
  }
  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) { const n = [...photosRef.current, ev.target.result as string]; photosRef.current = n; setPhotos(n); save({ photos: n }); }
    };
    reader.readAsDataURL(file);
  }

  const WAVE_HEIGHTS = [8,14,22,18,10,26,16,8,20,12,26,8,18,24,10,16,22,8,14,18];

  return (
    <>
      <div className="fixed inset-0 z-[55]" style={{ background: "rgba(0,0,0,0.38)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[56] rounded-t-[28px] flex flex-col"
        style={{ background: "#FDF8F2", maxHeight: "92vh", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", paddingBottom: "env(safe-area-inset-bottom,20px)" }}>

        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} />
        </div>

        {/* Header — large circled date + events in handwriting */}
        <div className="px-6 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex items-start gap-5">
            {/* Circled date number */}
            <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
              <svg style={{ position: "absolute", top: 0, left: 0 }} width="72" height="72" viewBox="0 0 72 72">
                <ellipse cx="36" cy="36" rx="31" ry="31"
                  fill="none" stroke={PINK} strokeWidth="2"
                  strokeDasharray="6 2"
                  transform="rotate(-12 36 36)" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 38, fontWeight: 700, color: "#1A1A1A", lineHeight: 1 }}>{dayNum}</p>
              </div>
            </div>

            {/* Day info */}
            <div style={{ flex: 1, paddingTop: 4 }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, lineHeight: 1 }}>{dayLabel}</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "#888", marginBottom: 6 }}>{monthLabel}</p>
              {eventsToday.length > 0 && eventsToday.map((ev, i) => (
                <p key={i} style={{ fontFamily: "var(--font-caveat)", fontSize: 18, fontStyle: "italic", color: ev.color, lineHeight: 1.3, marginBottom: 2 }}>
                  {ev.emoji} {ev.name}
                  <span style={{ fontSize: 13, color: "#aaa" }}> · {ev.time}</span>
                </p>
              ))}
              {stickers.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                  {stickers.map((s, i) => (
                    <button key={i} onClick={() => removeSticker(i)} style={{ fontSize: 18, padding: "2px 5px", background: "rgba(255,31,125,0.08)", borderRadius: 8, border: "none", cursor: "pointer" }}>{s}</button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
            </button>
          </div>
        </div>

        {/* Panels */}
        <div className="flex-1 overflow-y-auto">
          {tab === "write" && (
            <textarea value={text} onChange={e => handleText(e.target.value)}
              placeholder="Write about your day, your plans, your thoughts…"
              autoFocus
              style={{
                width: "100%", minHeight: 200, padding: "12px 24px 16px",
                fontFamily: "var(--font-caveat)", fontSize: 18, color: "#333",
                background: "repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.06) 32px)",
                backgroundSize: "100% 32px", backgroundPosition: "0 12px",
                border: "none", outline: "none", resize: "none", lineHeight: "32px",
              }}
            />
          )}

          {tab === "sticker" && (
            <StickerKeyboard onAdd={addSticker} />
          )}

          {tab === "photo" && (
            <div style={{ padding: "16px 20px" }}>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
              <button onClick={() => fileRef.current?.click()}
                className="active:scale-[0.98] transition-transform"
                style={{ width: "100%", height: 100, borderRadius: 20, border: "2px dashed rgba(255,31,125,0.3)", background: "#FFF5F8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", marginBottom: 16 }}>
                <span style={{ fontSize: 32 }}>📷</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: PINK, fontWeight: 700 }}>Add from camera roll</p>
              </button>
              {photos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                  {photos.map((p, i) => (
                    <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={() => removePhoto(i)} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "voice" && (
            <div style={{ padding: "28px 20px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 3, height: 44, marginBottom: 20 }}>
                {WAVE_HEIGHTS.map((h, i) => (
                  <div key={i} style={{ width: 3, borderRadius: 99, height: recording ? undefined : h, background: recording ? PINK : "rgba(255,31,125,0.22)", animation: recording ? `waveBar ${0.4 + (i % 5) * 0.1}s ease-in-out ${i * 0.05}s infinite alternate` : "none", minHeight: recording ? 6 : h, maxHeight: recording ? 36 : h }} />
                ))}
              </div>
              {recording && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 22, color: PINK, marginBottom: 16 }}>{Math.floor(recSecs/60).toString().padStart(2,"0")}:{(recSecs%60).toString().padStart(2,"0")}</p>}
              <button onClick={() => recording ? stopRecording() : setRecording(true)}
                style={{ width: 80, height: 80, borderRadius: "50%", background: recording ? PINK : "rgba(255,31,125,0.1)", border: `3px solid ${recording ? PINK : "rgba(255,31,125,0.3)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: recording ? "0 0 0 10px rgba(255,31,125,0.1), 0 4px 20px rgba(255,31,125,0.4)" : "none", transition: "all 0.2s" }}>
                {recording ? <div style={{ width: 22, height: 22, borderRadius: 4, background: "white" }} /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,31,125,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>}
              </button>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#aaa", marginTop: 10, textAlign: "center" }}>{recording ? "Tap to stop" : "Tap to record a voice note"}</p>
              {voiceCount > 0 && (
                <div style={{ marginTop: 20, width: "100%" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#aaa", marginBottom: 8 }}>SAVED</p>
                  {Array.from({ length: voiceCount }, (_, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "white", borderRadius: 14, border: "1px solid rgba(0,0,0,0.06)", marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,31,125,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "#333" }}>Voice note {i + 1}</p>
                        <div style={{ display: "flex", gap: 2, marginTop: 4, alignItems: "center" }}>
                          {[4,8,12,6,10,14,8,4,12,8,6,10,4,14,8,6,12,4,10,6,14,8,4,10].map((h, j) => (
                            <div key={j} style={{ width: 2, height: h, borderRadius: 1, background: "rgba(255,31,125,0.28)" }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex-shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", padding: "8px 16px 4px" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {([
              { id: "write" as DayEditorTab, icon: "✍️", label: "Write" },
              { id: "sticker" as DayEditorTab, icon: "🌸", label: "Sticker" },
              { id: "photo" as DayEditorTab, icon: "📷", label: "Photo" },
              { id: "voice" as DayEditorTab, icon: "🎙", label: "Voice" },
            ]).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ flex: 1, paddingTop: 7, paddingBottom: 7, borderRadius: 14, background: tab === t.id ? PINK : "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "background 0.15s" }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, letterSpacing: "0.04em", color: tab === t.id ? "white" : "rgba(0,0,0,0.35)" }}>{t.label.toUpperCase()}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── PAPER CALENDAR VIEW — EDITORIAL, PER-MONTH THEMED ────────────────────────

function PaperCalendarView({ dayContents, onSelectDay, selectedDay }: { dayContents: Record<string, DayContent>; onSelectDay: (d: string) => void; selectedDay: string | null; }) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const T = MONTH_THEMES[month];
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  function dateKey(d: number) { return `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

  return (
    <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 10px 48px rgba(0,0,0,0.16)" }}>

      {/* ── SPIRAL BINDING ── */}
      <div style={{ background: T.binding, padding: "8px 0 7px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} style={{ width: 13, height: 13, borderRadius: "50%", background: "#181820", border: "2.5px solid rgba(255,255,255,0.18)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.08)" }} />
        ))}
      </div>

      {/* ── EDITORIAL HEADER ── */}
      <div style={{ position: "relative", background: T.headerGrad, padding: "20px 20px 16px", overflow: "hidden" }}>
        {/* Ghost watermark */}
        <div style={{ position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-playfair)", fontSize: 78, fontWeight: 900, fontStyle: "italic", color: "rgba(0,0,0,0.045)", whiteSpace: "nowrap" as const, pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>{T.watermark}</div>

        {/* Large deco emoji — illustrated focal point */}
        <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 68, lineHeight: 1, filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.16))", pointerEvents: "none" }}>{T.deco}</div>

        {/* Small floating decos */}
        <div style={{ position: "absolute", right: 90, top: 10 }}><span style={{ fontSize: 11, color: T.accent, opacity: 0.55 }}>{T.decoExtra[0]}</span></div>
        <div style={{ position: "absolute", right: 76, bottom: 10 }}><span style={{ fontSize: 9, color: T.accent, opacity: 0.4 }}>{T.decoExtra[2]}</span></div>

        {/* Vertical spine label */}
        <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, display: "flex", alignItems: "center" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.22em", color: T.accent, opacity: 0.4, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>BLOOMBAY · {year}</p>
        </div>

        {/* Nav arrows */}
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 4, zIndex: 2 }}>
          <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); }}
            style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.09)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.textColor} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); }}
            style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.09)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.textColor} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Deco kicker strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
          {T.decoExtra.map((d, i) => <span key={i} style={{ fontSize: 9, color: T.accent, opacity: 0.55 }}>{d}</span>)}
        </div>

        {/* Month name */}
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(30px,9vw,40px)", fontWeight: 900, fontStyle: "italic", color: T.textColor, lineHeight: 0.95, marginBottom: 4 }}>{MONTH_NAMES[month]}</h2>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, color: T.textColor, opacity: 0.5, lineHeight: 1 }}>Planner {year}</p>
      </div>

      {/* ── WEEKDAY HEADERS ── */}
      <div style={{ background: T.accent, display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
        {DAY_NAMES.map(d => (
          <p key={d} style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.08em", color: "rgba(255,255,255,0.92)", textAlign: "center", padding: "7px 0 6px" }}>{d}</p>
        ))}
      </div>

      {/* ── DATE GRID ── */}
      <div style={{ background: T.gridBg, padding: "3px 3px 2px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", border: `1px solid ${T.accent}22`, borderRadius: 10, overflow: "hidden" }}>
          {cells.map((day, i) => {
            if (!day) return (
              <div key={i} style={{ minHeight: 58, background: `${T.accent}07`, borderRight: i%7!==6 ? `1px solid ${T.accent}15` : "none", borderBottom: i<cells.length-7 ? `1px solid ${T.accent}15` : "none" }} />
            );
            const key = dateKey(day);
            const isToday = key === todayKey;
            const isSel   = key === selectedDay;
            const dots    = EVENT_DATES[key];
            const dc      = dayContents[key];
            const hasSticker = dc?.stickers?.length > 0;
            const hasNote    = dc && (dc.text || dc.photos.length > 0 || dc.voiceCount > 0);
            const isFullDay  = dots && dots.length >= 2;
            return (
              <button key={i} onClick={() => onSelectDay(key)}
                style={{ minHeight: 58, padding: "5px 3px 4px", borderRight: i%7!==6 ? `1px solid ${T.accent}15` : "none", borderBottom: i<cells.length-7 ? `1px solid ${T.accent}15` : "none", background: isSel ? `${T.accent}20` : isToday ? `${T.accent}0E` : "white", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", transition: "background 0.15s", position: "relative", gap: 2 }}>

                {/* Date number */}
                {isToday ? (
                  <div style={{ position: "relative", width: 28, height: 28, flexShrink: 0 }}>
                    <svg style={{ position: "absolute", top: 0, left: 0 }} width="28" height="28" viewBox="0 0 28 28">
                      <ellipse cx="14" cy="14" rx="12" ry="11.5" fill="none" stroke={T.todayRing} strokeWidth="1.8" strokeDasharray="4 1.5" transform="rotate(-12 14 14)" />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, fontWeight: 700, color: T.todayRing, lineHeight: 1 }}>{day}</p>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: isSel ? T.accent : "#444", fontWeight: isSel ? 700 : 400, lineHeight: 1 }}>{day}</p>
                )}

                {/* Indicators */}
                {hasSticker ? (
                  <span style={{ fontSize: 13 }}>{dc.stickers[dc.stickers.length-1]}</span>
                ) : isFullDay ? (
                  <div style={{ background: T.accent, borderRadius: 999, padding: "1.5px 5px" }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "5px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>FULL</p>
                  </div>
                ) : dots ? (
                  <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                    {dots.slice(0,3).map((ev, j) => <div key={j} style={{ width: 4, height: 4, borderRadius: "50%", background: ev.color }} />)}
                  </div>
                ) : hasNote ? (
                  <div style={{ width: 14, height: 10, borderRadius: 2, background: `${T.accent}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 7, height: 1.5, borderRadius: 1, background: T.accent, opacity: 0.5 }} />
                  </div>
                ) : null}

                {/* Selection border glow */}
                {isSel && <div style={{ position: "absolute", inset: 0, border: `2px solid ${T.accent}50`, pointerEvents: "none" }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FOOTER LEGEND ── */}
      <div style={{ background: T.headerGrad, padding: "10px 16px 12px", display: "flex", alignItems: "center", gap: 12 }}>
        {[{ color: T.todayRing, label: "Today" }, { color: T.accent, label: "Plans" }, { color: "#999", label: "Notes" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.color, opacity: 0.8 }} />
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: T.textColor, opacity: 0.6 }}>{l.label}</p>
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 12 }}>{T.deco}</span>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.14em", color: T.accent, opacity: 0.55 }}>BLOOMBAY</p>
        </div>
      </div>
    </div>
  );
}

// ── DAY SCHEDULE VIEW — TIME-SLOTTED AGENDA ───────────────────────────────────

function DayScheduleView({ dayKey, dayContent, onEdit }: {
  dayKey: string;
  dayContent: DayContent | undefined;
  onEdit: () => void;
}) {
  const date       = new Date(dayKey + "T12:00:00");
  const T          = MONTH_THEMES[date.getMonth()];
  const dayNum     = date.getDate();
  const dayLabel   = DAY_FULL[date.getDay()];
  const monthLabel = MONTH_NAMES[date.getMonth()];
  const events     = EVENT_DATES[dayKey] ?? [];

  function parseHour(t: string): number {
    const m = t.match(/(\d+)(?::\d+)?\s*(AM|PM)/i);
    if (!m) return 12;
    let h = parseInt(m[1]);
    if (m[2].toUpperCase() === "PM" && h !== 12) h += 12;
    if (m[2].toUpperCase() === "AM" && h === 12) h = 0;
    return h;
  }

  const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7AM–9PM
  const hasContent = dayContent && (dayContent.text || dayContent.photos.length > 0 || dayContent.voiceCount > 0 || dayContent.stickers.length > 0);

  return (
    <div style={{ margin: "0 8px 12px", borderRadius: 20, overflow: "hidden", boxShadow: "0 6px 28px rgba(0,0,0,0.1)", border: `1px solid ${T.accent}18` }}>

      {/* ── Day header ── */}
      <div style={{ background: T.headerGrad, padding: "14px 16px 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.25em", color: T.accent, marginBottom: 4 }}>{dayLabel.toUpperCase()} {T.deco}</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: T.textColor, lineHeight: 1 }}>{dayNum} {monthLabel}</p>
          {events.length > 0 && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: T.accent, opacity: 0.7, marginTop: 3 }}>{events.length} plan{events.length !== 1 ? "s" : ""} today</p>}
        </div>
        <button onClick={onEdit} style={{ padding: "8px 16px", borderRadius: 999, background: T.accent, border: "none", cursor: "pointer", flexShrink: 0 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "white", letterSpacing: "0.05em" }}>+ NOTES</p>
        </button>
      </div>

      {/* Stickers bar */}
      {dayContent?.stickers && dayContent.stickers.length > 0 && (
        <div style={{ background: `${T.accent}0A`, padding: "6px 14px", display: "flex", gap: 6, flexWrap: "wrap" as const, borderBottom: `1px solid ${T.accent}15` }}>
          {dayContent.stickers.map((s, i) => (
            s.startsWith("data:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={s} alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
            ) : <span key={i} style={{ fontSize: 22 }}>{s}</span>
          ))}
        </div>
      )}

      {/* ── Time slots ── */}
      <div style={{ background: "white" }}>
        {HOURS.map((h) => {
          const timeLabel = h < 12 ? `${h}AM` : h === 12 ? "12PM" : `${h-12}PM`;
          const eventsAtHour = events.filter(ev => parseHour(ev.time) === h);
          return (
            <div key={h} style={{ display: "flex", alignItems: "stretch", borderBottom: `1px solid rgba(0,0,0,0.04)`, minHeight: eventsAtHour.length > 0 ? "auto" : 40 }}>
              {/* Time label */}
              <div style={{ width: 46, flexShrink: 0, borderRight: `1px solid rgba(0,0,0,0.05)`, padding: "10px 6px 10px 10px", display: "flex", alignItems: "flex-start" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 600, color: "#C0B8B8", lineHeight: 1, whiteSpace: "nowrap" as const }}>{timeLabel}</p>
              </div>
              {/* Slot content */}
              <div style={{ flex: 1, padding: eventsAtHour.length > 0 ? "7px 10px" : "0", display: "flex", flexDirection: "column", gap: 6 }}>
                {eventsAtHour.map((ev, ei) => (
                  <div key={ei} style={{ background: `${ev.color}14`, borderLeft: `3.5px solid ${ev.color}`, borderRadius: "0 12px 12px 0", padding: "9px 10px 9px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, position: "relative", overflow: "hidden" }}>
                    {/* Colour wash */}
                    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "40%", background: `linear-gradient(90deg, transparent, ${ev.color}10)`, pointerEvents: "none" }} />
                    <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                        <span style={{ fontSize: 14, flexShrink: 0 }}>{ev.emoji}</span>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{ev.name}</p>
                      </div>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "#aaa" }}>🕐 {ev.time}</p>
                    </div>
                    {/* Mini polaroid thumbnail */}
                    <div style={{ flexShrink: 0, width: 38, background: "white", padding: "3px 3px 9px", borderRadius: 3, boxShadow: "0 3px 10px rgba(0,0,0,0.14)", transform: "rotate(2.5deg)", zIndex: 1 }}>
                      <div style={{ width: 32, height: 28, borderRadius: 2, background: `linear-gradient(135deg, ${ev.color}55, ${ev.color}22)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{ev.emoji}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      {dayContent?.text && (
        <div style={{ background: `${T.accent}07`, padding: "12px 16px 14px", borderTop: `1px solid ${T.accent}12` }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.2em", color: T.accent, opacity: 0.6, marginBottom: 6 }}>✍️ MY NOTES</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#555", lineHeight: 1.55 }}>{dayContent.text}</p>
        </div>
      )}

      {/* Empty state */}
      {events.length === 0 && !hasContent && (
        <div style={{ padding: "22px 16px 24px", textAlign: "center" as const, background: "white" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 17, color: "#D4CCC8" }}>Nothing planned yet {T.deco}</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#DDD", marginTop: 4 }}>Tap + NOTES to journal, add stickers, photos or voice notes</p>
        </div>
      )}
    </div>
  );
}

// ── PLAN DOOR CARD ────────────────────────────────────────────────────────────

const DOOR_PAINTS: Record<number, { body: string; bodyLight: string; frame: string; glass: string; knob: string }> = {
  1: { body: "#B8402A", bodyLight: "#D45038", frame: "#7A2818", glass: "rgba(255,150,80,0.22)",  knob: "#D4A853" },
  2: { body: "#CC1870", bodyLight: "#E0288A", frame: "#8A0048", glass: "rgba(255,80,180,0.18)",  knob: "#FFD4A0" },
  3: { body: "#3A7850", bodyLight: "#4A8860", frame: "#1E5830", glass: "rgba(80,200,120,0.18)",  knob: "#D4A853" },
  4: { body: "#6A1030", bodyLight: "#8A2040", frame: "#440818", glass: "rgba(200,60,100,0.2)",   knob: "#C8A870" },
  5: { body: "#C8B8A0", bodyLight: "#DECCA8", frame: "#A09070", glass: "rgba(240,220,180,0.3)",  knob: "#D4A853" },
  6: { body: "#A07018", bodyLight: "#B88028", frame: "#704E08", glass: "rgba(240,190,60,0.2)",   knob: "#FFD060" },
};

function PlanDoorCard({ room, isRead, onPress }: { room: PlanRoom; isRead: boolean; onPress: () => void }) {
  const hasUnread = room.unread > 0 && !isRead;
  const paint = DOOR_PAINTS[room.id] ?? DOOR_PAINTS[2];
  const W = 90, ARCH_R = 45;
  const BODY_H = 96;
  const TOTAL_H = ARCH_R + BODY_H;

  return (
    <button
      onClick={onPress}
      className="active:scale-[0.95] transition-transform"
      style={{ width: W + 10, height: TOTAL_H + 20, flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0, position: "relative", WebkitTapHighlightColor: "transparent" }}
    >
      {/* Floor shadow */}
      <div style={{ position: "absolute", bottom: 0, left: 8, right: 8, height: 10, borderRadius: "50%", background: `${paint.frame}44`, filter: "blur(5px)" }} />

      {/* Door frame/surround */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: W + 10, height: TOTAL_H + 10,
        borderRadius: `${ARCH_R + 5}px ${ARCH_R + 5}px 8px 8px`,
        background: `linear-gradient(180deg, ${paint.frame} 0%, ${paint.frame}CC 100%)`,
        boxShadow: `0 6px 20px ${paint.frame}66`,
      }} />

      {/* Door face */}
      <div style={{
        position: "absolute", top: 4, left: 4, width: W, height: TOTAL_H,
        borderRadius: `${ARCH_R}px ${ARCH_R}px 4px 4px`,
        background: `linear-gradient(175deg, ${paint.bodyLight} 0%, ${paint.body} 40%, ${paint.frame}88 100%)`,
        boxShadow: `inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -2px 6px rgba(0,0,0,0.2)`,
        overflow: "hidden",
      }}>
        {/* Arch glass window — shows poster or emoji */}
        <div style={{
          position: "absolute", top: 5, left: 8, right: 8, height: ARCH_R - 4,
          borderRadius: `${ARCH_R - 8}px ${ARCH_R - 8}px 2px 2px`,
          background: paint.glass,
          border: "1.5px solid rgba(255,255,255,0.35)",
          overflow: "hidden",
        }}>
          {room.poster ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={room.poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)" }} />
            </>
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16 }}>{room.emoji}</span>
            </div>
          )}
          {/* Glass shine */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "35%", borderRadius: "50% 50% 0 0", background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)", pointerEvents: "none" }} />
        </div>

        {/* Center stile (vertical divider) */}
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-0.5px)", top: ARCH_R + 2, bottom: 4, width: 1, background: `${paint.frame}88` }} />

        {/* Upper panels */}
        <div style={{ position: "absolute", top: ARCH_R + 4, left: 6, right: 6, height: Math.floor(BODY_H * 0.42), display: "flex", gap: 3 }}>
          {[0,1].map(i => (
            <div key={i} style={{ flex: 1, borderRadius: 3, background: "rgba(0,0,0,0.12)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 1px 0 rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.08)" }} />
          ))}
        </div>

        {/* Lower panels */}
        <div style={{ position: "absolute", bottom: 6, left: 6, right: 6, height: Math.floor(BODY_H * 0.45), display: "flex", gap: 3 }}>
          {[0,1].map(i => (
            <div key={i} style={{ flex: 1, borderRadius: 3, background: "rgba(0,0,0,0.12)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 1px 0 rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.08)" }} />
          ))}
        </div>

        {/* Door knob */}
        <div style={{
          position: "absolute", right: 10, top: ARCH_R + Math.floor(BODY_H * 0.55),
          width: 9, height: 9, borderRadius: "50%",
          background: `radial-gradient(circle at 38% 35%, ${paint.knob}FF, ${paint.knob}88)`,
          boxShadow: `0 1px 4px rgba(0,0,0,0.5), 0 0 0 1.5px ${paint.frame}88`,
        }} />

        {/* Name label at bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.45))", padding: "12px 5px 5px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "rgba(255,255,255,0.92)", textAlign: "center", letterSpacing: "0.05em", lineHeight: 1.2 }}>
            {room.name.split(" ").slice(0,2).join(" ").toUpperCase()}
          </p>
        </div>
      </div>

      {/* Date chip */}
      <div style={{ position: "absolute", top: 2, left: "50%", transform: "translateX(-50%)", background: "white", borderRadius: 999, padding: "1.5px 6px", border: `1px solid ${paint.frame}44`, whiteSpace: "nowrap" as const }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, color: paint.body, letterSpacing: "0.04em" }}>{room.date}</p>
      </div>

      {/* Unread badge */}
      {hasUnread && (
        <div style={{ position: "absolute", top: 6, right: 4, width: 17, height: 17, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(255,31,125,0.6)", zIndex: 3, animation: "badgeShake 3s ease-in-out 1s infinite" }}>
          <span style={{ fontSize: 7, fontWeight: 900, color: "white" }}>{room.unread}</span>
        </div>
      )}
    </button>
  );
}

// ── PLAN ROOM BOARD (NOT CHAT) ────────────────────────────────────────────────

function PlanRoomBoard({ room, onBack, theme }: { room: PlanRoom; onBack: () => void; theme: typeof THEME }) {
  const initialTodos = PLAN_TODOS[room.id] ?? [];
  const [todos, setTodos] = useState(initialTodos);
  const [showTicket, setShowTicket] = useState(false);
  const notes = PLAN_NOTES[room.id] ?? [];

  function toggleTodo(id: number) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  const done = todos.filter(t => t.done).length;
  const pct  = todos.length > 0 ? Math.round((done / todos.length) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: theme.pageBg, paddingBottom: 96 }}>

      {/* Sticky header */}
      <div style={{ background: theme.topBar, borderBottom: `1px solid ${theme.topBarBorder}`, paddingTop: 54, position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px 12px" }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.subText} strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{ width: 38, height: 38, borderRadius: 14, background: `${room.accent}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{room.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: theme.heading, lineHeight: 1.2 }}>{room.name}</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: theme.subText, marginTop: 1 }}>{room.members} women · {room.time}</p>
          </div>
          <button onClick={() => setShowTicket(true)} style={{ padding: "5px 12px", borderRadius: 999, background: `${room.accent}18`, border: `1px solid ${room.accent}44`, cursor: "pointer", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: room.accent }}>🎟 Ticket</span>
          </button>
        </div>
      </div>

      {/* Hero gradient band */}
      <div style={{ height: 140, background: `linear-gradient(135deg, ${room.bg} 0%, ${room.accent}33 100%)`, display: "flex", alignItems: "flex-end", padding: "0 20px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 72, opacity: 0.22 }}>{room.emoji}</div>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: `${room.accent}CC`, marginBottom: 4 }}>PLAN ROOM</p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px,7vw,30px)", fontWeight: 900, fontStyle: "italic", color: "#FEFCF7", lineHeight: 1.1 }}>{room.name}</h1>
        </div>
      </div>

      <div style={{ padding: "20px 16px 0" }}>

        {/* Details card */}
        <div style={{ background: theme.sectionBg, backdropFilter: "blur(8px)", borderRadius: 20, padding: "16px 18px", marginBottom: 16, border: `1px solid ${theme.cardBorder}` }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 10 }}>THE PLAN</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {room.time && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>📅</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: theme.heading, fontWeight: 500 }}>{room.time}</p>
              </div>
            )}
            {room.venue && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>📍</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: theme.heading, fontWeight: 500 }}>{room.venue}</p>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>👯‍♀️</span>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: theme.heading, fontWeight: 500 }}>{room.members} women joining</p>
            </div>
          </div>
        </div>

        {/* Who's in */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: theme.label, marginBottom: 10, paddingLeft: 2 }}>WHO'S IN</p>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" as const }}>
            {BLOOMIES_LIST.map(b => (
              <div key={b.id} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${b.color},${b.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white", border: "2.5px solid rgba(255,255,255,0.7)", boxShadow: `0 2px 10px ${b.color}44` }}>
                  {b.initial}
                </div>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: theme.subText, maxWidth: 44, textAlign: "center", lineHeight: 1.2 }}>{b.name.split(" ")[0]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div style={{ background: theme.sectionBg, backdropFilter: "blur(8px)", borderRadius: 20, padding: "16px 18px", marginBottom: 16, border: `1px solid ${theme.cardBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: PINK }}>CHECKLIST</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 60, height: 4, borderRadius: 99, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${PINK},#FF69B4)`, borderRadius: 99, transition: "width 0.3s" }} />
              </div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: theme.subText }}>{done}/{todos.length}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {todos.map(t => (
              <button key={t.id} onClick={() => toggleTodo(t.id)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ width: 22, height: 22, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: t.done ? PINK : "transparent", border: t.done ? "none" : "2px solid rgba(0,0,0,0.15)", transition: "all 0.15s" }}>
                  {t.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: t.done ? theme.subText : theme.heading, fontWeight: t.done ? 400 : 500, textDecoration: t.done ? "line-through" : "none", flex: 1 }}>{t.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Notes / pins */}
        {notes.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: theme.label, marginBottom: 10, paddingLeft: 2 }}>NOTES</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {notes.map(n => (
                <div key={n.id} style={{ background: theme.sectionBg, backdropFilter: "blur(8px)", borderRadius: 16, padding: "12px 16px", border: `1px solid ${theme.cardBorder}`, borderLeft: `3px solid ${room.accent}` }}>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: theme.heading, lineHeight: 1.45 }}>{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {showTicket && <PlanTicketSheet room={room} onClose={() => setShowTicket(false)} onOpenRoom={() => setShowTicket(false)} />}
    </div>
  );
}

// ── NEW PLAN SHEET ────────────────────────────────────────────────────────────

function NewPlanSheet({ onClose }: { onClose: () => void }) {
  const [step, setStep]         = useState<NewPlanStep>("choose");
  const [name, setName]         = useState("");
  const [details, setDetails]   = useState("");
  const [message, setMessage]   = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [clubId, setClubId]     = useState<number | null>(null);
  const [done, setDone]         = useState(false);
  function toggleBloomie(id: number) { setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

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
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl flex flex-col" style={{ background: "white", maxHeight: "92vh", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0"><div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} /></div>
        <div className="px-6 pb-4 pt-2 flex items-center justify-between flex-shrink-0" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <div className="flex items-center gap-3">
            {step !== "choose" && (
              <button onClick={() => setStep("choose")} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.05)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            )}
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>
                {step === "choose" ? "✦ NEW PLAN" : step === "room" ? "✦ PLAN ROOM" : step === "bloomie" ? "✦ INVITE BLOOMIES" : "✦ POST TO CLUB"}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>
                {step === "choose" ? "What kind of plan?" : step === "room" ? "Create a plan room" : step === "bloomie" ? "Send directly to friends" : "Share with club members"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.05)" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
          </button>
        </div>

        {step === "choose" && (
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
            {([
              { s: "room" as NewPlanStep, emoji: "🗓", label: "Plan Room", sub: "Collaborative planning board for an event or trip" },
              { s: "bloomie" as NewPlanStep, emoji: "🌸", label: "Invite Bloomies", sub: "Send a plan directly to specific friends" },
              { s: "club" as NewPlanStep, emoji: "💫", label: "Post to Club", sub: "Open invite — let club members say they're down" },
            ]).map(opt => (
              <button key={opt.s} onClick={() => setStep(opt.s)}
                className="flex items-center gap-4 p-5 rounded-2xl text-left active:scale-[0.98] transition-transform"
                style={{ background: "#FFF8FA", border: "1px solid rgba(255,31,125,0.12)" }}>
                <span style={{ fontSize: 28 }}>{opt.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: "#1A1A1A" }}>{opt.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "#aaa" }}>{opt.sub}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            ))}
          </div>
        )}

        {step === "room" && (
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "#bbb" }}>Room name</p>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Morocco October, Brunch Girls…" autoFocus className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE", color: "#111" }} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "#bbb" }}>What&apos;s the plan?</p>
              <input value={details} onChange={e => setDetails(e.target.value)} placeholder="Event, trip, outing… add a date or venue" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE", color: "#111" }} />
            </div>
            <button onClick={() => { if (name.trim()) setDone(true); }} disabled={!name.trim()} className="w-full py-4 rounded-full text-sm font-bold mt-2"
              style={name.trim() ? { background: "linear-gradient(135deg,#FF1F7D,#FF69B4)", color: "white" } : { background: "#F5E8EE", color: "#C8A0B0" }}>
              {name.trim() ? "Create Plan Room →" : "Add a room name first"}
            </button>
          </div>
        )}

        {step === "bloomie" && (
          <>
            <div className="px-6 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: "1px solid #F0F0F0" }}>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "#bbb" }}>What&apos;s the plan?</p>
              <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Dinner at Tatiana, Sunday walk, gallery…" autoFocus className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE", color: "#111" }} />
            </div>
            <div className="flex-1 overflow-y-auto">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase px-6 pt-3 pb-1" style={{ color: "#bbb" }}>Who to invite</p>
              {BLOOMIES_LIST.map(b => {
                const on = selected.has(b.id);
                return (
                  <button key={b.id} onClick={() => toggleBloomie(b.id)} className="w-full flex items-center gap-4 px-6 py-3.5 text-left" style={{ borderBottom: "1px solid #F5F5F5", background: on ? "#FFF5F8" : "white" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 text-sm" style={{ background: `linear-gradient(135deg,${b.color},${b.color}BB)` }}>{b.initial}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: "#111" }}>{b.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#aaa" }}>{b.status}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={on ? { background: "#FF1F7D" } : { background: "transparent", border: "2px solid #E5E5E5" }}>
                      {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid #F0F0F0", paddingBottom: "max(16px,env(safe-area-inset-bottom))" }}>
              <button onClick={() => setDone(true)} disabled={selected.size === 0 || !message.trim()} className="w-full py-4 rounded-full text-sm font-bold"
                style={selected.size > 0 && message.trim() ? { background: "#FF1F7D", color: "white" } : { background: "#F5E8EE", color: "#C8A0B0" }}>
                {selected.size > 0 && message.trim() ? `Send to ${selected.size} Bloomie${selected.size !== 1 ? "s" : ""} →` : selected.size === 0 ? "Select Bloomies" : "Add a plan description"}
              </button>
            </div>
          </>
        )}

        {step === "club" && (
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "#bbb" }}>What&apos;s the plan?</p>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="I'm going to Afrobeats Night at SOB's — who's coming?" autoFocus rows={3} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE", color: "#111" }} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "#bbb" }}>Post to which club?</p>
              <div className="flex flex-col gap-2">
                {CLUBS_LIST.map(club => {
                  const on = clubId === club.id;
                  return (
                    <button key={club.id} onClick={() => setClubId(club.id)} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left" style={on ? { background: "#FFF5F8", border: "1.5px solid #FF1F7D33" } : { background: "#FAFAFA", border: "1.5px solid #F0F0F0" }}>
                      <span style={{ fontSize: 22 }}>{club.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: "#111" }}>{club.name}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: "#aaa" }}>{club.members} members</p>
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

// ── TICKET IMAGE MAP ──────────────────────────────────────────────────────────

const TICKET_IMAGES: Record<number, string> = {
  2: "/tickets templates/Ticket_Girls_Night.png",       // Afrobeats Night → Girls Night ticket
  4: "/tickets templates/Ticket_Museum_Exhibition.png", // Women in Lens → Museum ticket
  6: "/tickets templates/Ticket_Dinner_Society.png",    // Golden Hour → Dinner Society ticket
  1: "/tickets templates/Ticket_NYC_Marrakech.png",     // Morocco → NYC Marrakech ticket
};

// ── MEMORY EVENTS ─────────────────────────────────────────────────────────────

const MEMORY_EVENTS = [
  { id: 10, name: "Gallery Hop BK",   date: "May 3",  poster: "/happenings/posters/05_Film_Club.png",               note: "what a night ✦",   color: "#C8A0FF" },
  { id: 11, name: "Brunch at Lola's", date: "Apr 20", poster: "/happenings/posters/07_Sunday_Brunch_Club.png",      note: "always her 🌸",    color: "#83C5A0" },
  { id: 20, name: "Jazz at Small's",  date: "May 28", poster: "/happenings/posters/09_Bagels_And_Books.png",        note: "iconic ✦",         color: "#D4A853" },
  { id: 21, name: "Rooftop Pilates",  date: "May 15", poster: "/happenings/posters/08_Rooftop_Sessions.png",        note: "girls that slay",  color: "#FF69B4" },
  { id: 22, name: "Film Club Night",  date: "Apr 5",  poster: "/happenings/posters/06_Dance_All_Night.png",         note: "loved this 💕",    color: "#FF1F7D" },
  { id: 23, name: "Sunday Walk",      date: "Mar 28", poster: "/happenings/posters/10_Ladies_First_Road_Trip.png",  note: "so peaceful 🌿",  color: "#83C5A0" },
];

const POLAROID_ROTS = [-2.5, 1.8, -1.2, 2.2, -1.8, 1.5];

// ── EVENT CONFIRMATION CARD ───────────────────────────────────────────────────

function EventConfirmationCard({ room, onViewRoom }: { room: PlanRoom; onViewRoom: () => void }) {
  return (
    <div style={{ margin: "0 16px 6px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)" }}>YOUR CONFIRMATION</p>
        <button onClick={onViewRoom} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: PINK, letterSpacing: "0.06em" }}>OPEN ROOM →</p>
        </button>
      </div>

      <div style={{ background: "#FAF5EE", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.09)" }}>

        {/* Top: event info + tilted ticket */}
        <div style={{ padding: "16px 14px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>

          {/* Left: event text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.32)", marginBottom: 6 }}>SEAT DETAIL ❋</p>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontStyle: "italic", fontSize: "clamp(17px,5vw,21px)", color: "#1A1A1A", lineHeight: 1.05, marginBottom: 6 }}>{room.name}</h2>
            {room.venue && <p style={{ fontFamily: "var(--font-jost)", fontSize: "9.5px", fontWeight: 500, color: PINK, marginBottom: 2 }}>📍 {room.venue}</p>}
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9.5px", fontWeight: 600, color: PINK, marginBottom: 10 }}>{room.time}</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.38)", lineHeight: 1.4 }}>
              see you there,<br/>gorgeous ♡
            </p>
          </div>

          {/* Right: tilted pink ticket stub */}
          <div style={{
            width: 128, flexShrink: 0,
            background: "linear-gradient(150deg, #FF1F7D 0%, #E0006A 100%)",
            borderRadius: 11,
            padding: "10px 11px 12px",
            transform: "rotate(4.5deg) translateY(-4px)",
            boxShadow: "0 10px 30px rgba(255,31,125,0.42), 0 2px 0 rgba(120,0,45,0.5)",
            position: "relative", overflow: "hidden",
          }}>
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

        {/* Middle: dark confirmed bar */}
        <div style={{ background: "#111", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(212,168,83,0.8)", marginBottom: 3 }}>YOUR BOOKING</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>
              {room.members} women
            </p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(255,105,180,0.8)", marginTop: 1 }}>xoxo</p>
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

        {/* Bottom: who you'll be with */}
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

// ── WALLET TICKETS ────────────────────────────────────────────────────────────

const RETIRED_ROOMS: PlanRoom[] = [
  { id: 10, name: "Gallery Hop BK",   emoji: "🖼️", bg: "#1A0A14", accent: "#C8A0FF", unread: 0, members: 8,  date: "May 3",  venue: "Bushwick Collective", time: "Sat May 3 · 6PM"  },
  { id: 11, name: "Brunch at Lola's", emoji: "🥂",  bg: "#0A100A", accent: "#83C5A0", unread: 0, members: 5,  date: "Apr 20", venue: "Lola Taverna, WV",       time: "Sun Apr 20 · 11AM" },
];

const EXPIRED_ROOMS: PlanRoom[] = [
  { id: 20, name: "Jazz at Small's",   emoji: "🎷",  bg: "#0A0810", accent: "#D4A853", unread: 0, members: 7,  date: "May 28", venue: "Smalls Jazz Club, WV",  time: "Wed May 28 · 8PM" },
  { id: 21, name: "Rooftop Pilates",   emoji: "🧘‍♀️", bg: "#0A1018", accent: "#83C5A0", unread: 0, members: 12, date: "May 15", venue: "Arlo Hotel Rooftop",    time: "Thu May 15 · 7AM" },
];

// ── Ticket card (shared render) ───────────────────────────────────────────────

function TicketCard({ room, status, onOpen }: { room: PlanRoom; status: "active" | "used" | "expired"; onOpen: () => void }) {
  const img = TICKET_IMAGES[room.id];
  const ticketCode = `BB-${room.id.toString().padStart(2,"0")}-${(room.id * 7841 + 3301) % 9000 + 1000}`;
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
      <div style={{
        width: "100%", height: TH, borderRadius: 16,
        background: room.bg,
        boxShadow: "0 6px 28px rgba(0,0,0,0.22), 0 2px 0 rgba(0,0,0,0.5)",
        display: "flex", overflow: "hidden", position: "relative",
        opacity: status !== "active" ? 0.68 : 1,
      }}>
        {/* Dimming overlay for used/expired */}
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
            <div style={{ width: "100%", height: "100%", background: `linear-gradient(145deg, ${room.accent}44, ${room.accent}18)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>
              {room.emoji}
            </div>
          )}
          <div style={{ position: "absolute", top: 10, bottom: 10, right: -1, borderRight: "2px dashed rgba(255,255,255,0.22)" }} />
          <div style={{ position: "absolute", top: -9, right: -9, width: 18, height: 18, borderRadius: "50%", background: PAGE_BG }} />
          <div style={{ position: "absolute", bottom: -9, right: -9, width: 18, height: 18, borderRadius: "50%", background: PAGE_BG }} />
        </div>
        {/* RIGHT: info */}
        <div style={{ flex: 1, padding: "12px 14px 10px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 700, letterSpacing: "0.22em", color: `${room.accent}AA`, marginBottom: 4 }}>BLOOMBAY · EVENT TICKET</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, color: "white", lineHeight: 1.05, letterSpacing: "-0.01em" }}>{room.name}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.45)", marginTop: 3, overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis" }}>{room.venue}</p>
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

// ── Wallet ─────────────────────────────────────────────────────────────────────

function WalletTickets({ rooms, theme, onOpen }: { rooms: PlanRoom[]; theme: typeof THEME; onOpen: (room: PlanRoom) => void }) {
  const router = useRouter();
  void theme;

  const allActive    = rooms;
  const stackItems   = allActive.slice(0, 4);

  // Subtle fan angles — like tickets slid into a card slot
  const STACK = [
    { rot: -3.8, x: -10, z: 1 },
    { rot:  2.2, x:   9, z: 2 },
    { rot: -1.5, x:  -4, z: 3 },
    { rot:  0.6, x:   3, z: 4 },
  ];

  // Wallet geometry
  const WALLET_H   = 158;  // total wallet body height
  const PEEK       = 50;   // ticket top visible above wallet opening
  const SLOT_DEPTH = 18;   // how deep ticket sits inside the slot
  const TOTAL_H    = WALLET_H + PEEK;

  // Leather SVG grain
  const GRAIN = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence type='turbulence' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='80' height='80' filter='url(%23n)' opacity='0.07'/></svg>") repeat`;

  return (
    <div style={{ paddingBottom: 20 }}>

        /* ── WALLET — tapping navigates to /member/plans/tickets ── */
        <button
          onClick={() => router.push("/member/plans/tickets")}
          className="active:scale-[0.985] transition-transform"
          style={{ width: "100%", padding: "0 16px", background: "none", border: "none", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
        >
          <div style={{ position: "relative", height: TOTAL_H }}>

            {/* ══ LAYER 1 — wallet back shell (full shape, gives bottom shadow) ══ */}
            <div style={{
              position: "absolute",
              top: PEEK, left: 0, right: 0, height: WALLET_H,
              borderRadius: 22,
              background: "linear-gradient(148deg, #FFD0E6 0%, #FFAED4 30%, #FFD4E8 70%, #FFE8F2 100%)",
              boxShadow: "0 24px 70px rgba(255,31,125,0.22), 0 6px 0 rgba(200,0,80,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
              zIndex: 1,
            }} />

            {/* ══ LAYER 2 — tickets peeking from slot, back-to-front ══ */}
            {stackItems.map((room, i) => {
              const s = STACK[Math.min(i, STACK.length - 1)];
              const img = TICKET_IMAGES[room.id];
              const isFront = i === stackItems.length - 1;
              return (
                <div key={room.id} style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: PEEK + SLOT_DEPTH,  // visible + buried in slot
                  borderRadius: "13px 13px 0 0",
                  background: room.bg,
                  transform: `rotate(${s.rot}deg) translateX(${s.x}px)`,
                  zIndex: 2 + i,
                  overflow: "hidden",
                  boxShadow: "0 -5px 18px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}>
                  {/* Accent colour stripe along very top */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${room.accent}, ${room.accent}BB)` }} />

                  {/* Poster strip on left */}
                  {img && (
                    <div style={{ position: "absolute", top: 0, left: 0, width: "36%", height: "100%", overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.55) 100%)" }} />
                    </div>
                  )}

                  {/* Front ticket info */}
                  {isFront && (
                    <div style={{ position: "absolute", left: img ? "40%" : 12, right: 10, top: 10, display: "flex", flexDirection: "column", gap: 2 }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.22em", color: `${room.accent}CC` }}>BLOOMBAY · TICKET</p>
                      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "white", lineHeight: 1.05, overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis" }}>{room.name}</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.38)", overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis" }}>{room.time}</p>
                    </div>
                  )}

                  {/* Back-ticket emoji mark */}
                  {!isFront && (
                    <div style={{ position: "absolute", right: 14, top: "45%", transform: "translateY(-50%)", fontSize: 20, opacity: 0.3 }}>{room.emoji}</div>
                  )}

                  {/* Dashed perforation at base — where ticket disappears into wallet */}
                  <div style={{ position: "absolute", bottom: 0, left: 10, right: 10, borderBottom: "1.5px dashed rgba(255,255,255,0.14)" }} />
                </div>
              );
            })}

            {/* ══ LAYER 3 — slot shadow (dark overhang, creates pocket depth) ══ */}
            <div style={{
              position: "absolute",
              top: PEEK - 8,
              left: 8, right: 8,
              height: 22,
              background: "linear-gradient(180deg, rgba(180,0,70,0.32) 0%, rgba(255,31,125,0.12) 55%, transparent 100%)",
              zIndex: 9,
              borderRadius: "0 0 4px 4px",
              pointerEvents: "none",
            }} />

            {/* ══ LAYER 4 — wallet front face (covers ticket bottoms = "inside pocket") ══ */}
            <div style={{
              position: "absolute",
              top: PEEK + SLOT_DEPTH,
              left: 0, right: 0,
              height: WALLET_H - SLOT_DEPTH,
              borderRadius: "0 0 22px 22px",
              background: "linear-gradient(165deg, #FFE0EE 0%, #FFAED4 48%, #FFD0E6 82%, #FFE8F2 100%)",
              backgroundImage: GRAIN,
              zIndex: 8,
              overflow: "hidden",
            }}>

              {/* Stitching — gold dashed border inset from edges */}
              <div style={{
                position: "absolute",
                top: 10, left: 8, right: 8, bottom: 8,
                borderRadius: "0 0 16px 16px",
                border: "1.5px dashed rgba(255,31,125,0.28)",
                borderTop: "none",
                pointerEvents: "none",
              }} />

              {/* Horizontal card-slot separator line */}
              <div style={{
                position: "absolute", top: 52, left: 14, right: 14, height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,31,125,0.2), rgba(255,31,125,0.3), rgba(255,31,125,0.2), transparent)",
              }} />

              {/* BB monogram — embossed / ghost */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -42%)",
                pointerEvents: "none", userSelect: "none",
              }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 68, fontWeight: 900, fontStyle: "italic", color: "rgba(255,31,125,0.1)", lineHeight: 1 }}>BB</p>
              </div>

              {/* Right edge decorative stitching dots */}
              <div style={{ position: "absolute", right: 20, top: 18, display: "flex", flexDirection: "column", gap: 5 }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,31,125,0.22)" }} />
                ))}
              </div>

              {/* Bottom info */}
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

              {/* Bottom "open" hint gradient */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 32,
                background: "linear-gradient(0deg, rgba(0,0,0,0.42) 0%, transparent 100%)",
                display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 7,
                pointerEvents: "none",
              }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.48)" }}>OPEN WALLET</p>
              </div>
            </div>

          </div>
        </button>

    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

function PlansPageInner() {
  const searchParams = useSearchParams();
  const theme = THEME;

  const [userId, setUserId] = useState<string | null>(null);
  const [view, setView]               = useState<View>("list");
  const [mainTab, setMainTab]         = useState<MainTab>("plans");
  const [activeRoom, setActiveRoom]   = useState<PlanRoom | null>(null);
  const [ticketRoom, setTicketRoom]   = useState<PlanRoom | null>(null);
  const [showNewPlan, setShowNewPlan] = useState(false);

  useEffect(() => {
    void import("@/lib/supabase/client").then(({ createClient }) => {
      createClient().auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    });
  }, []);
  const [read, setRead]               = useState<Set<number>>(new Set());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editorDay, setEditorDay]     = useState<string | null>(null);
  const [dayContents, setDayContents] = useState<Record<string, DayContent>>({});

  useEffect(() => {
    const eventId = searchParams.get("event");
    if (eventId) {
      const room = PLAN_ROOMS.find(r => r.eventId === parseInt(eventId, 10));
      if (room) openRoom(room);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openRoom(room: PlanRoom) {
    setRead(prev => new Set([...prev, room.id]));
    setActiveRoom(room);
    setView("room");
  }
  function updateDayContent(key: string, c: DayContent) {
    setDayContents(prev => ({ ...prev, [key]: c }));
  }

  if (view === "room" && activeRoom) {
    return <PlanRoomBoard room={activeRoom} onBack={() => { setView("list"); setActiveRoom(null); }} theme={theme} />;
  }

  const totalUnread = PLAN_ROOMS.filter(r => r.unread > 0 && !read.has(r.id)).length;
  const today = new Date();
  const todayStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, paddingBottom: 96, transition: "background 0.8s" }}>

      {/* Custom top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 54, zIndex: 51, background: theme.topBar, borderBottom: `1px solid ${theme.topBarBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, color: PINK }}>BB✿</span>

        <div style={{ display: "flex", background: "rgba(255,31,125,0.07)", borderRadius: 999, padding: "3px", gap: 2 }}>
          {(["plans","calendar"] as MainTab[]).map(t => (
            <button key={t} onClick={() => setMainTab(t)}
              style={{ padding: "6px 14px", borderRadius: 999, background: mainTab === t ? PINK : "transparent", color: mainTab === t ? "white" : theme.subText, fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase" as const, border: "none", cursor: "pointer", transition: "all 0.18s", boxShadow: mainTab === t ? "0 2px 10px rgba(255,31,125,0.44)" : "none" }}>
              {t === "plans" ? "PLANS" : "CALENDAR"}
            </button>
          ))}
        </div>

        <button onClick={() => setShowNewPlan(true)} style={{ width: 32, height: 32, borderRadius: "50%", background: PINK, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(255,31,125,0.38)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>

      <div style={{ paddingTop: 54 }}>

        {/* Plans tab */}
        {mainTab === "plans" && (
          <div>

            {/* ── EDITORIAL HEADER — full-bleed, no card border ── */}
            <div style={{ position: "relative", overflow: "hidden", paddingBottom: 28 }}>
              {/* Pink gradient that fades into page bg */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(185deg, #FF1F7D 0%, #E8006A 28%, #FF4FA0 55%, rgba(255,240,248,0) 100%)" }} />
              {/* Ghost BLOOM watermark */}
              <div style={{ position: "absolute", bottom: 10, right: -12, fontFamily: "var(--font-playfair)", fontSize: 90, fontWeight: 900, fontStyle: "italic", color: "rgba(255,255,255,0.07)", lineHeight: 1, userSelect: "none", pointerEvents: "none", letterSpacing: "-0.02em" }}>BLOOM</div>

              <div style={{ position: "relative", zIndex: 1, padding: "14px 18px 0" }}>
                {/* Date kicker */}
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.65)", marginBottom: 12 }}>✦ {todayStr.toUpperCase()}</p>

                {/* Title + new button */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px,8vw,34px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, letterSpacing: "-0.02em", textShadow: "0 2px 20px rgba(0,0,0,0.12)" }}>
                    Your Plans.
                  </h1>
                  <button onClick={() => setShowNewPlan(true)} style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", flexShrink: 0, marginTop: 4 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em" }}>{PLAN_ROOMS.length} ROOMS</p>
                  {totalUnread > 0 && (
                    <>
                      <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.35)" }} />
                      <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 999, padding: "2px 8px", border: "1px solid rgba(255,255,255,0.3)" }}>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>{totalUnread} NEW</p>
                      </div>
                    </>
                  )}
                  <button onClick={() => setMainTab("calendar")} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 999, padding: "5px 11px", cursor: "pointer" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em" }}>PLANNER</p>
                  </button>
                </div>

                {/* Week strip — embedded in header on dark pink bg */}
                {(() => {
                  const dow = today.getDay();
                  const mondayOffset = dow === 0 ? -6 : 1 - dow;
                  const monday = new Date(today);
                  monday.setDate(monday.getDate() + mondayOffset);
                  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
                  const weekDays = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date(monday);
                    d.setDate(monday.getDate() + i);
                    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
                    return { date: d.getDate(), events: EVENT_DATES[key] ?? [], isToday: key === todayKey, label: ["Mo","Tu","We","Th","Fr","Sa","Su"][i] };
                  });
                  return (
                    <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 16, padding: "10px 10px 8px", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                        {weekDays.map(day => (
                          <div key={day.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, letterSpacing: "0.04em", color: day.isToday ? "white" : "rgba(255,255,255,0.42)" }}>{day.label}</p>
                            <div style={{ width: 26, height: 26, borderRadius: "50%", background: day.isToday ? "white" : day.events.length > 0 ? "rgba(255,255,255,0.14)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", border: day.isToday ? "none" : `1.5px solid rgba(255,255,255,${day.events.length > 0 ? "0.3" : "0.15"})` }}>
                              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: day.isToday ? 800 : 400, color: day.isToday ? PINK : "rgba(255,255,255,0.8)", lineHeight: 1 }}>{day.date}</p>
                            </div>
                            <div style={{ display: "flex", gap: 1.5, justifyContent: "center", minHeight: 5 }}>
                              {day.events.slice(0, 2).map((_, j) => (
                                <div key={j} style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.7)" }} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Swipeable door row — no label, flows from header */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 16px 24px", scrollbarWidth: "none" as const, WebkitOverflowScrolling: "touch" as unknown as undefined }}>
              <button onClick={() => setShowNewPlan(true)} style={{ width: 90, height: 145, flexShrink: 0, borderRadius: "45px 45px 6px 6px", border: `2px dashed rgba(255,31,125,0.25)`, background: "rgba(255,31,125,0.04)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", marginTop: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,31,125,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,31,125,0.6)", letterSpacing: "0.06em" }}>NEW</p>
              </button>
              {PLAN_ROOMS.map(room => (
                <PlanDoorCard key={room.id} room={room} isRead={read.has(room.id)} onPress={() => openRoom(room)} />
              ))}
            </div>

            {/* Confirmation card — most recent upcoming event */}
            <EventConfirmationCard room={PLAN_ROOMS[1]} onViewRoom={() => openRoom(PLAN_ROOMS[1])} />

            {/* Ornamental divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 22px", marginBottom: 18, marginTop: 18 }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,31,125,0.18))" }} />
              <span style={{ fontSize: 9, color: "rgba(255,31,125,0.38)" }}>✦</span>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,31,125,0.18), transparent)" }} />
            </div>

            {/* Wallet Tickets — pink blush */}
            <WalletTickets rooms={PLAN_ROOMS.filter(r => r.eventId)} theme={theme} onOpen={(room) => { setTicketRoom(room); }} />

            {/* Ornamental divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 22px", marginBottom: 18 }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,31,125,0.18))" }} />
              <span style={{ fontSize: 9, color: "rgba(255,31,125,0.38)" }}>✦</span>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,31,125,0.18), transparent)" }} />
            </div>

            {/* Bloomies Planner™ — real live plans */}
            {userId && <BloomiesPlanner userId={userId} />}

            {/* Ornamental divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 22px 0", marginBottom: 18 }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,31,125,0.18))" }} />
              <span style={{ fontSize: 9, color: "rgba(255,31,125,0.38)" }}>✦</span>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,31,125,0.18), transparent)" }} />
            </div>

            {/* Memories section — polaroid grid */}
            <div style={{ padding: "0 16px 40px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,31,125,0.5)", marginBottom: 3 }}>✦ MEMORIES</p>
                  <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1 }}>Your Story.</h3>
                </div>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#bbb" }}>{MEMORY_EVENTS.length} moments ✦</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {MEMORY_EVENTS.map((ev, i) => (
                  <div key={ev.id} style={{ transform: `rotate(${POLAROID_ROTS[i]}deg)`, transformOrigin: "center bottom", transition: "transform 0.2s" }}>
                    <div style={{ background: "white", borderRadius: 4, padding: "5px 5px 14px", boxShadow: "0 6px 20px rgba(0,0,0,0.12), 0 1px 0 rgba(0,0,0,0.06)" }}>
                      <div style={{ width: "100%", aspectRatio: "1", borderRadius: 2, overflow: "hidden", background: "#F0E8E0", position: "relative" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ev.poster} alt={ev.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${ev.color}44 100%)` }} />
                      </div>
                      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "#888", textAlign: "center", marginTop: 5, lineHeight: 1.2 }}>{ev.note}</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 700, color: "#ccc", textAlign: "center", marginTop: 2, letterSpacing: "0.06em" }}>{ev.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calendar tab */}
        {mainTab === "calendar" && (
          <div style={{ padding: "16px 0" }}>
            <div style={{ padding: "0 16px 14px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,31,125,0.6)", marginBottom: 4 }}>YOUR PLANNER</p>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1 }}>Plan Calendar.</h2>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "#aaa", letterSpacing: "0.06em", marginTop: 5 }}>TAP A DATE TO ADD NOTES OR VIEW PLANS</p>
            </div>
            <div style={{ margin: "0 16px 12px", borderRadius: 20, overflow: "hidden", boxShadow: "0 6px 28px rgba(0,0,0,0.14), 0 1px 0 rgba(255,255,255,0.9) inset" }}>
              <PaperCalendarView
                dayContents={dayContents}
                onSelectDay={key => setSelectedDay(prev => prev === key ? null : key)}
                selectedDay={selectedDay}
              />
            </div>
            {selectedDay && (
              <DayScheduleView
                dayKey={selectedDay}
                dayContent={dayContents[selectedDay]}
                onEdit={() => setEditorDay(selectedDay)}
              />
            )}
          </div>
        )}
      </div>

      {editorDay && (
        <DayEditorSheet
          dayKey={editorDay}
          content={dayContents[editorDay] ?? { text: "", stickers: [], photos: [], voiceCount: 0 }}
          onUpdate={c => updateDayContent(editorDay, c)}
          onClose={() => setEditorDay(null)}
        />
      )}

      {ticketRoom && (
        <PlanTicketSheet
          room={ticketRoom}
          onClose={() => setTicketRoom(null)}
          onOpenRoom={() => { setTicketRoom(null); openRoom(ticketRoom); }}
        />
      )}

      {showNewPlan && <NewPlanSheet onClose={() => setShowNewPlan(false)} />}

      <style>{`
        @keyframes badgeShake {
          0%, 60%, 100% { transform: scale(1) rotate(0deg); }
          65%  { transform: scale(1.22) rotate(-12deg); }
          70%  { transform: scale(1.22) rotate(12deg); }
          75%  { transform: scale(1.18) rotate(-9deg); }
          80%  { transform: scale(1.18) rotate(9deg); }
          85%  { transform: scale(1.12) rotate(-4deg); }
          90%  { transform: scale(1.06) rotate(2deg); }
          95%  { transform: scale(1.02) rotate(0deg); }
        }
        @keyframes waveBar {
          0% { transform: scaleY(0.35); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

export default function PlansPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F6F1EB" }} />}>
      <PlansPageInner />
    </Suspense>
  );
}
