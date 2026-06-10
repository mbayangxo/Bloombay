"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface PlanRoom {
  id: number; name: string; emoji: string; bg: string; accent: string;
  unread: number; members: number; date: string; venue?: string; time?: string; eventId?: number;
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
  { id: 1, name: "Morocco October",     emoji: "🇲🇦", bg: "#1A0E0A", accent: "#FF69B4", unread: 7, members: 14, date: "Oct 2026", venue: "Marrakech · Private Villa",       time: "Oct 10–17, 2026"   },
  { id: 2, name: "Afrobeats Night",     emoji: "🎵",  bg: "#0F0818", accent: "#FF1F7D", unread: 3, members: 8,  date: "Jun 14",  venue: "SOB's, 204 Varick St",            time: "Sat Jun 14 · 10PM", eventId: 6 },
  { id: 3, name: "Sunday Walk Circle",  emoji: "🌿",  bg: "#0A120F", accent: "#83C5A0", unread: 0, members: 6,  date: "Jun 8",   venue: "Prospect Park, Grand Army Plaza", time: "Sun Jun 8 · 9AM",   eventId: 4 },
  { id: 4, name: "Women in Lens",       emoji: "🎨",  bg: "#1A0A14", accent: "#FF1F7D", unread: 2, members: 5,  date: "Tonight", venue: "The Parlor Gallery, Bushwick",    time: "Tonight · 7PM",     eventId: 1 },
  { id: 5, name: "Wheel Throwing",      emoji: "🏺",  bg: "#0A1518", accent: "#83C5A0", unread: 1, members: 4,  date: "Tonight", venue: "Brooklyn Clay, Williamsburg",     time: "Tonight · 6:30PM",  eventId: 2 },
  { id: 6, name: "Golden Hour Rooftop", emoji: "🌅",  bg: "#180A06", accent: "#F59E0B", unread: 0, members: 6,  date: "Tonight", venue: "Westlight Hotel, Williamsburg",   time: "Tonight · 8PM",     eventId: 3 },
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

const STICKER_PALETTE = [
  "🌸","🌼","💐","🌿","🍃","🌺","🌻","🌷","🌹","🪷",
  "💕","💖","💗","💝","❤️","🩷","💞","💌","💘","🫶",
  "✨","⭐","🌟","💫","🌙","☀️","🌈","🎀","🎊","🎉",
  "🗽","🌆","🚕","🏙","🌉","🚇","🍕","🥯","☕","🌃",
  "📔","✏️","📸","🎵","🦋","🍯","🫧","🌾","🍂","🎗",
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
          <p className="text-sm" style={{ color: "#999", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>{selected.size} Bloomie{selected.size !== 1 ? "s" : ""} invited to {room.name}</p>
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
            <div style={{ padding: "16px 20px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 12 }}>TAP TO ADD</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
                {STICKER_PALETTE.map((s, i) => (
                  <button key={i} onClick={() => addSticker(s)}
                    className="active:scale-90 transition-transform"
                    style={{ fontSize: 26, padding: "8px 0", borderRadius: 14, background: "white", border: "1px solid rgba(0,0,0,0.07)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
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

// ── PAPER CALENDAR VIEW (BLUE NOTEBOOK) ──────────────────────────────────────

function PaperCalendarView({ dayContents, onSelectDay, selectedDay }: { dayContents: Record<string, DayContent>; onSelectDay: (d: string) => void; selectedDay: string | null; }) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  function dateKey(d: number) { return `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

  const NB_BLUE = "#8A9DC0";
  const NB_DARK = "#6878A0";
  const NB_TEX  = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='80' height='80' filter='url(%23n)' opacity='0.06'/></svg>")`;
  const CREAM   = "#FEF8EE";

  return (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: `linear-gradient(160deg, #7B8DB8 0%, ${NB_BLUE} 55%, #7585B2 100%)`, backgroundImage: NB_TEX }}>

      {/* Spiral binding */}
      <div style={{ background: NB_DARK, padding: "10px 16px 8px", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
        {Array.from({ length: 13 }, (_, i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: "#1A1C26", border: "2px solid #3A3D50", boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.5)" }} />
        ))}
      </div>

      {/* Month nav + title */}
      <div style={{ padding: "14px 18px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); }}
          style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={CREAM} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: CREAM, lineHeight: 1 }}>{MONTH_NAMES[month]} Planner</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(254,248,238,0.5)", marginTop: 2 }}>{year}</p>
        </div>
        <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); }}
          style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={CREAM} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 10px 4px" }}>
        {DAY_NAMES.map(d => (
          <p key={d} style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", color: "rgba(254,248,238,0.5)", textAlign: "center", paddingBottom: 4 }}>{d}</p>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ padding: "0 10px 10px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, overflow: "hidden" }}>
          {cells.map((day, i) => {
            if (!day) return (
              <div key={i} style={{ minHeight: 52, background: "rgba(0,0,0,0.08)", borderRight: i%7!==6 ? "1px solid rgba(255,255,255,0.1)" : "none", borderBottom: i<cells.length-7 ? "1px solid rgba(255,255,255,0.1)" : "none" }} />
            );
            const key = dateKey(day);
            const isToday = key === todayKey;
            const isSel = key === selectedDay;
            const dots = EVENT_DATES[key];
            const dc = dayContents[key];
            const hasSticker = dc?.stickers?.length > 0;
            const hasNote = dc && (dc.text || dc.photos.length > 0 || dc.voiceCount > 0);
            return (
              <button key={i} onClick={() => onSelectDay(key)}
                style={{ minHeight: 52, padding: "5px 2px", borderRight: i%7!==6 ? "1px solid rgba(255,255,255,0.1)" : "none", borderBottom: i<cells.length-7 ? "1px solid rgba(255,255,255,0.1)" : "none", background: isSel ? "rgba(255,255,255,0.25)" : isToday ? "rgba(255,31,125,0.18)" : "rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", transition: "background 0.15s" }}>
                {isToday ? (
                  <div style={{ position: "relative", width: 26, height: 26, marginBottom: 2 }}>
                    <svg style={{ position: "absolute", top: 0, left: 0 }} width="26" height="26" viewBox="0 0 26 26">
                      <ellipse cx="13" cy="13" rx="11" ry="11" fill="none" stroke="#FF1F7D" strokeWidth="1.5" strokeDasharray="4 1.5" transform="rotate(-10 13 13)" />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, fontWeight: 700, color: "#FF1F7D", lineHeight: 1 }}>{day}</p>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: isSel ? CREAM : "rgba(254,248,238,0.82)", fontWeight: isSel ? 700 : 400, lineHeight: 1, marginBottom: 2, paddingTop: 2 }}>{day}</p>
                )}
                {hasSticker ? <span style={{ fontSize: 10 }}>{dc.stickers[dc.stickers.length-1]}</span>
                  : dots ? <div style={{ display: "flex", gap: 1.5 }}>{dots.slice(0,2).map((ev,j) => <div key={j} style={{ width: 4, height: 4, borderRadius: "50%", background: ev.color }} />)}</div>
                  : hasNote ? <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,248,220,0.5)" }} />
                  : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "0 14px 12px", display: "flex", gap: 12 }}>
        {[{ color: "#FF1F7D", label: "Today" }, { color: "#83C5A0", label: "Plans" }, { color: "rgba(255,248,220,0.5)", label: "Notes" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.color }} />
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(254,248,238,0.5)" }}>{l.label}</p>
          </div>
        ))}
      </div>

      {/* Floating gold stars */}
      <div style={{ position: "absolute", bottom: 16, right: 14, display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: 3 }}>{"★★".split("").map((s,i) => <span key={i} style={{ fontSize: 9, color: "#D4A853", opacity: 0.75 }}>{s}</span>)}</div>
        <div style={{ display: "flex", gap: 3 }}>{"★★★".split("").map((s,i) => <span key={i} style={{ fontSize: 10, color: "#D4A853", opacity: 0.9 }}>{s}</span>)}</div>
      </div>

      {/* Heart doodle */}
      <svg style={{ position: "absolute", top: 80, right: 16, opacity: 0.3 }} width="26" height="24" viewBox="0 0 26 24">
        <path d="M13 22 C13 22 1 14 1 7 C1 3.5 4 1 7 1 C9.5 1 11.5 2.5 13 4.5 C14.5 2.5 16.5 1 19 1 C22 1 25 3.5 25 7 C25 14 13 22 13 22Z" fill="none" stroke="#FEF8EE" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// ── DAY SCHEDULE VIEW ─────────────────────────────────────────────────────────

function DayScheduleView({ dayKey, dayContent, onEdit }: {
  dayKey: string;
  dayContent: DayContent | undefined;
  onEdit: () => void;
}) {
  const date       = new Date(dayKey + "T12:00:00");
  const dayNum     = date.getDate();
  const dayLabel   = DAY_FULL[date.getDay()];
  const monthLabel = MONTH_NAMES[date.getMonth()];
  const events     = EVENT_DATES[dayKey] ?? [];

  const CARD_PALETTES = [
    { bg: "#FFE4EF", border: "#FF69B4", check: "#FF1F7D" },
    { bg: "#FFF3D0", border: "#F59E0B", check: "#D97706" },
    { bg: "#D8F0E4", border: "#83C5A0", check: "#22C55E" },
    { bg: "#EDE8FC", border: "#A855F7", check: "#9333EA" },
  ];

  const hasContent = dayContent && (dayContent.text || dayContent.photos.length > 0 || dayContent.voiceCount > 0 || dayContent.stickers.length > 0);

  return (
    <div style={{ margin: "0 8px 12px", background: "#FAF6F0", borderRadius: 20, padding: "14px 14px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.7)" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#FF1F7D", lineHeight: 1 }}>{dayLabel}</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1.1 }}>{dayNum} {monthLabel}</p>
        </div>
        <button onClick={onEdit}
          style={{ padding: "6px 14px", borderRadius: 999, background: "#FFF0F7", border: "1.5px solid rgba(255,31,125,0.2)", cursor: "pointer", flexShrink: 0 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "#FF1F7D", letterSpacing: "0.05em" }}>+ NOTES</p>
        </button>
      </div>

      {/* Events as pastel cards */}
      {events.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: hasContent ? 12 : 0 }}>
          {events.map((ev, i) => {
            const pal = CARD_PALETTES[i % CARD_PALETTES.length];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: pal.bg, borderRadius: 12, borderLeft: `3.5px solid ${pal.border}`, padding: "10px 12px" }}>
                <span style={{ fontSize: 20 }}>{ev.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{ev.name}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#888", marginTop: 2 }}>🕐 {ev.time}</p>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: 8, background: pal.check, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day notes preview */}
      {hasContent && (
        <div style={{ background: "#FFFCF5", borderRadius: 12, padding: "10px 12px", border: "1px solid rgba(0,0,0,0.06)" }}>
          {dayContent!.text && (
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#555", lineHeight: 1.5, marginBottom: dayContent!.stickers.length > 0 ? 6 : 0 }}>
              {dayContent!.text.slice(0, 80)}{dayContent!.text.length > 80 ? "…" : ""}
            </p>
          )}
          {dayContent!.stickers.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {dayContent!.stickers.map((s, i) => <span key={i} style={{ fontSize: 18 }}>{s}</span>)}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {events.length === 0 && !hasContent && (
        <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 17, color: "#C0B8B0" }}>Nothing planned yet ✨</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#CCC5BC", marginTop: 4 }}>Tap + NOTES to write, add stickers or photos</p>
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
        {/* Arch glass window */}
        <div style={{
          position: "absolute", top: 5, left: 8, right: 8, height: ARCH_R - 4,
          borderRadius: `${ARCH_R - 8}px ${ARCH_R - 8}px 2px 2px`,
          background: paint.glass,
          border: "1.5px solid rgba(255,255,255,0.35)",
          backdropFilter: "blur(2px)",
          overflow: "hidden",
        }}>
          {/* Glass shine */}
          <div style={{ position: "absolute", top: 3, left: 5, right: 5, height: "38%", borderRadius: "50% 50% 0 0", background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)" }} />
          {/* Room emoji inside glass */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 4 }}>
            <span style={{ fontSize: 16, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}>{room.emoji}</span>
          </div>
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
          <p className="text-sm italic" style={{ color: "#999", fontFamily: "var(--font-instrument)" }}>
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

// ── WALLET TICKETS ────────────────────────────────────────────────────────────

const RETIRED_ROOMS: PlanRoom[] = [
  { id: 10, name: "Gallery Hop BK",   emoji: "🖼️", bg: "#1A0A14", accent: "#C8A0FF", unread: 0, members: 8,  date: "May 3",  venue: "Bushwick Collective", time: "Sat May 3 · 6PM"  },
  { id: 11, name: "Brunch at Lola's", emoji: "🥂",  bg: "#0A100A", accent: "#83C5A0", unread: 0, members: 5,  date: "Apr 20", venue: "Lola Taverna, WV",       time: "Sun Apr 20 · 11AM" },
];

function WalletTickets({ rooms, theme, onOpen }: { rooms: PlanRoom[]; theme: typeof THEME; onOpen: (room: PlanRoom) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<"active"|"retired">("active");
  const STACK_OFFSET = 10;
  const activeRooms = rooms;
  const retiredRooms = RETIRED_ROOMS;
  const displayRooms = tab === "active" ? activeRooms : retiredRooms;

  return (
    <div style={{ padding: "0 16px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        {/* Tabs */}
        <div style={{ display: "flex", background: "rgba(255,31,125,0.07)", borderRadius: 999, padding: 3, gap: 2 }}>
          {(["active","retired"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "5px 12px", borderRadius: 999,
              background: tab === t ? PINK : "transparent",
              color: tab === t ? "white" : "#999",
              fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800,
              letterSpacing: "0.08em", textTransform: "uppercase" as const,
              border: "none", cursor: "pointer", transition: "all 0.15s",
            }}>
              {t === "active" ? "🎟 Active" : "📁 Retired"}
            </button>
          ))}
        </div>
        <button onClick={() => setExpanded(e => !e)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: PINK, letterSpacing: "0.06em" }}>{expanded ? "CLOSE ✕" : "VIEW ALL"}</p>
        </button>
      </div>

      {tab === "retired" && (
        <div style={{ marginBottom: 10, padding: "8px 12px", background: "rgba(255,31,125,0.05)", borderRadius: 12, border: "1px dashed rgba(255,31,125,0.15)" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#aaa", textAlign: "center" }}>These plans have wrapped up ✦ memories made</p>
        </div>
      )}

      {!expanded ? (
        <button onClick={() => setExpanded(true)} style={{ background: "none", border: "none", cursor: "pointer", width: "100%", position: "relative", height: 80 + (displayRooms.length - 1) * STACK_OFFSET }}>
          {[...displayRooms].reverse().map((room, i) => {
            const idx = displayRooms.length - 1 - i;
            return (
              <div key={room.id} style={{
                position: "absolute",
                top: (displayRooms.length - 1 - idx) * STACK_OFFSET,
                left: idx * 2, right: idx * 2,
                height: 72, borderRadius: 14, overflow: "hidden",
                background: tab === "retired" ? "rgba(240,236,230,0.95)" : "white",
                border: `1px solid ${tab === "retired" ? "rgba(0,0,0,0.08)" : "rgba(255,31,125,0.12)"}`,
                boxShadow: `0 ${2 + idx * 2}px ${8 + idx * 4}px rgba(0,0,0,${0.06 + idx * 0.02})`,
                display: "flex", alignItems: "stretch",
                zIndex: idx + 1,
                opacity: tab === "retired" ? 0.85 : 1,
              }}>
                <div style={{ width: 52, flexShrink: 0, background: tab === "retired" ? "rgba(0,0,0,0.04)" : `${room.accent}18`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, borderRight: `1px dashed ${tab === "retired" ? "rgba(0,0,0,0.08)" : room.accent + "33"}` }}>
                  <span style={{ fontSize: 20, filter: tab === "retired" ? "grayscale(0.4)" : "none" }}>{room.emoji}</span>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 8, color: tab === "retired" ? "#bbb" : room.accent, fontWeight: 700, lineHeight: 1 }}>{room.date}</p>
                </div>
                <div style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 800, letterSpacing: "0.15em", color: tab === "retired" ? "#bbb" : PINK, marginBottom: 2 }}>{tab === "retired" ? "RETIRED" : "TICKET"}</p>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: tab === "retired" ? "#aaa" : "#1A1A1A", lineHeight: 1.1, textDecoration: tab === "retired" ? "line-through" : "none" }}>{room.name}</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "#bbb", marginTop: 2 }}>{room.time}</p>
                </div>
                <div style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 8 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            );
          })}
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {displayRooms.map(room => {
            const ticketCode = `BB-${room.id.toString().padStart(2,"0")}-${(room.id * 7841 + 3301) % 9000 + 1000}`;
            return (
              <div key={room.id} style={{ borderRadius: 16, overflow: "hidden", background: tab === "retired" ? "rgba(240,236,230,0.95)" : "white", border: `1px solid ${tab === "retired" ? "rgba(0,0,0,0.07)" : "rgba(255,31,125,0.1)"}`, boxShadow: "0 3px 12px rgba(0,0,0,0.07)", opacity: tab === "retired" ? 0.85 : 1 }}>
                <button onClick={() => tab === "active" && onOpen(room)} style={{ width: "100%", display: "flex", alignItems: "stretch", background: "none", border: "none", cursor: tab === "active" ? "pointer" : "default", textAlign: "left" }}>
                  <div style={{ width: 56, flexShrink: 0, background: tab === "retired" ? "rgba(0,0,0,0.04)" : `${room.accent}18`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <span style={{ fontSize: 22, filter: tab === "retired" ? "grayscale(0.5)" : "none" }}>{room.emoji}</span>
                    <p style={{ fontFamily: "var(--font-caveat)", fontSize: 9, color: tab === "retired" ? "#bbb" : room.accent, fontWeight: 700 }}>{room.date}</p>
                  </div>
                  <div style={{ flex: 1, padding: "12px 14px" }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.15em", color: tab === "retired" ? "#ccc" : PINK, marginBottom: 3 }}>{tab === "retired" ? "RETIRED PLAN" : "PLAN TICKET"}</p>
                    <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: tab === "retired" ? "#aaa" : "#1A1A1A", lineHeight: 1.15, marginBottom: 2, textDecoration: tab === "retired" ? "line-through" : "none" }}>{room.name}</p>
                    <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#bbb" }}>{room.time}</p>
                  </div>
                </button>
                <div style={{ borderTop: `1px dashed rgba(0,0,0,0.07)`, margin: "0 10px" }} />
                <div style={{ padding: "6px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "#ccc", letterSpacing: "0.06em" }}>{ticketCode}</p>
                  {tab === "active" && <button onClick={() => onOpen(room)} style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK, background: "none", border: "none", cursor: "pointer" }}>🎟 View</button>}
                  {tab === "retired" && <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#ccc" }}>✓ Done</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

function PlansPageInner() {
  const searchParams = useSearchParams();
  const theme = THEME;

  const [view, setView]               = useState<View>("list");
  const [mainTab, setMainTab]         = useState<MainTab>("plans");
  const [activeRoom, setActiveRoom]   = useState<PlanRoom | null>(null);
  const [ticketRoom, setTicketRoom]   = useState<PlanRoom | null>(null);
  const [showNewPlan, setShowNewPlan] = useState(false);
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

        {/* Plans tab — door grid */}
        {mainTab === "plans" && (
          <div>
            {/* ── Beautiful Header Card ── */}
            <div style={{ margin: "16px 16px 0", borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 28px rgba(255,31,125,0.12), 0 1px 0 rgba(255,255,255,0.9) inset", position: "relative" }}>
              {/* Card background */}
              <div style={{ background: "linear-gradient(135deg, #FFF0F8 0%, #FFE0F0 40%, #FFF5E8 80%, #FFF0F8 100%)", padding: "20px 18px 18px", position: "relative", overflow: "hidden" }}>
                {/* Decorative petals */}
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,31,125,0.06)" }} />
                <div style={{ position: "absolute", bottom: -15, left: 20, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,31,125,0.04)" }} />
                {/* Ornamental top line */}
                <div style={{ height: 1.5, background: "linear-gradient(90deg, transparent, rgba(255,31,125,0.3), rgba(212,168,83,0.4), rgba(255,31,125,0.3), transparent)", marginBottom: 14 }} />
                {/* Date */}
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.26em", color: "rgba(255,31,125,0.6)", marginBottom: 8 }}>
                  {todayStr.toUpperCase()}
                </p>
                {/* Title row */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <div>
                    <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 36, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 0.95, letterSpacing: "-0.02em" }}>
                      Your<br />Plans.
                    </h1>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 600, color: "rgba(0,0,0,0.35)", letterSpacing: "0.1em", marginTop: 8 }}>
                      SWIPE TO ENTER A ROOM ✦
                    </p>
                  </div>
                  {/* Large + button on right */}
                  <button onClick={() => setShowNewPlan(true)} style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #FF1F7D, #FF5BAD)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 18px rgba(255,31,125,0.45), inset 0 1px 0 rgba(255,255,255,0.3)", flexShrink: 0, marginLeft: 12, marginBottom: 2 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
                {/* Stats row */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK }} />
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(0,0,0,0.4)" }}>{PLAN_ROOMS.length} rooms</p>
                  </div>
                  <div style={{ width: 1, height: 10, background: "rgba(0,0,0,0.1)" }} />
                  {totalUnread > 0 && (
                    <div style={{ background: PINK, borderRadius: 999, padding: "2px 8px" }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white" }}>{totalUnread} new</p>
                    </div>
                  )}
                  {/* Mini planner button */}
                  <button onClick={() => setMainTab("calendar")} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.15)", borderRadius: 999, padding: "5px 12px", cursor: "pointer" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: PINK, letterSpacing: "0.08em" }}>PLANNER</p>
                  </button>
                </div>
                {/* Ornamental bottom line */}
                <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,31,125,0.2), rgba(212,168,83,0.25), rgba(255,31,125,0.2), transparent)", marginTop: 14 }} />
              </div>
            </div>

            {/* ── PLAN ROOMS label ── */}
            <div style={{ padding: "16px 18px 4px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)" }}>PLAN ROOMS</p>
            </div>

            {/* Swipeable door row */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "8px 16px 24px", scrollbarWidth: "none" as const, WebkitOverflowScrolling: "touch" as unknown as undefined }}>
              {PLAN_ROOMS.map(room => (
                <PlanDoorCard key={room.id} room={room} isRead={read.has(room.id)} onPress={() => openRoom(room)} />
              ))}
              {/* Add door */}
              <button onClick={() => setShowNewPlan(true)} style={{ width: 90, height: 145, flexShrink: 0, borderRadius: "45px 45px 6px 6px", border: `2px dashed rgba(255,31,125,0.25)`, background: "rgba(255,31,125,0.04)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", marginTop: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,31,125,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,31,125,0.6)", letterSpacing: "0.06em" }}>NEW</p>
              </button>
            </div>

            {/* ── MY TICKETS label ── */}
            <div style={{ padding: "0 16px 6px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)" }}>MY TICKETS</p>
            </div>

            {/* Wallet Tickets */}
            <WalletTickets rooms={PLAN_ROOMS.filter(r => r.eventId)} theme={theme} onOpen={(room) => { setTicketRoom(room); }} />
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
