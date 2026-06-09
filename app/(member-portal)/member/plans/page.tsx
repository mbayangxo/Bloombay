"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface PlanRoom {
  id: number; name: string; emoji: string; bg: string; accent: string;
  unread: number; members: number; date: string; venue?: string; time?: string; eventId?: number;
}
interface PlanMessage {
  id: number; sender: string; initial: string; color: string;
  text: string; time: string; isMe?: boolean;
}
interface DayContent { text: string; stickers: string[]; photos: string[]; voiceCount: number; }
type View = "list" | "room";
type MainTab = "plans" | "calendar";
type NewPlanStep = "choose" | "room" | "bloomie" | "club";
type DayEditorTab = "write" | "sticker" | "photo" | "voice";

// ── DATA ──────────────────────────────────────────────────────────────────────

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

const ROOM_MESSAGES: Record<number, PlanMessage[]> = {
  4: [
    { id: 1, sender: "Amara", initial: "A", color: "#FF1F7D", text: "So excited for tonight!! Anyone getting there early to grab a spot near the front?", time: "2:30 PM" },
    { id: 2, sender: "Sofía", initial: "S", color: "#FF69B4", text: "I'll be there by 6:45. They said the opening talk starts at 7:15", time: "2:34 PM" },
    { id: 3, sender: "Me",    initial: "Y", color: "#FF1F7D", text: "I'll come with you Sofía! Meeting at the corner of Wyckoff?", time: "2:38 PM", isMe: true },
    { id: 4, sender: "Nia",   initial: "N", color: "#C0185F", text: "Yes!! The photographer doing the artist talk is incredible. I've been following her work for years", time: "2:42 PM" },
    { id: 5, sender: "Amara", initial: "A", color: "#FF1F7D", text: "Also — champagne reception is free 🥂🥂 this night is going to be everything", time: "2:45 PM" },
  ],
  5: [
    { id: 1, sender: "Priya", initial: "P", color: "#FF69B4", text: "First time doing wheel throwing. Should I wear old clothes?", time: "10:00 AM" },
    { id: 2, sender: "Mia",   initial: "M", color: "#FF1F7D", text: "Absolutely. I ruined a white top last time 😅 clay goes everywhere", time: "10:04 AM" },
    { id: 3, sender: "Me",    initial: "Y", color: "#FF1F7D", text: "Good call. I'm wearing my black overalls", time: "10:06 AM", isMe: true },
    { id: 4, sender: "Jade",  initial: "J", color: "#FF69B4", text: "The instructor is so good — she'll teach you how to center the clay in the first 10 minutes", time: "10:09 AM" },
  ],
  6: [
    { id: 1, sender: "Imani", initial: "I", color: "#FF1F7D", text: "Golden hour from the rooftop tonight 🌅 who's hyped?", time: "3:00 PM" },
    { id: 2, sender: "Luna",  initial: "L", color: "#FF69B4", text: "Been waiting for this all week. What's everyone wearing?", time: "3:03 PM" },
    { id: 3, sender: "Me",    initial: "Y", color: "#FF1F7D", text: "Something gold obviously 😂 see you all at 8!", time: "3:07 PM", isMe: true },
  ],
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
    { id: 1, sender: "Temi A.", initial: "T", color: "#FF1F7D", text: "SOB's is going OFF this night. Who's dressing up?", time: "3:00 PM" },
    { id: 2, sender: "Zara F.", initial: "Z", color: "#FF69B4", text: "Always. What's the dress code — chic or full Afrobeats?", time: "3:05 PM" },
    { id: 3, sender: "Me",      initial: "Y", color: "#FF1F7D", text: "Full send. I'm wearing my Ankara set 🔥", time: "3:08 PM", isMe: true },
    { id: 4, sender: "Temi A.", initial: "T", color: "#FF1F7D", text: "YESSS. We're getting there by 10 — doors open at 9", time: "3:10 PM" },
    { id: 5, sender: "Me",      initial: "Y", color: "#FF1F7D", text: "Pregame at mine before? I'm 10 min from SOB's", time: "3:12 PM", isMe: true },
  ],
  3: [
    { id: 1, sender: "Sofia W.", initial: "S", color: "#83C5A0", text: "Sunday walk is confirmed! Meet at Grand Army Plaza at 9AM 🌿", time: "Fri · 6pm" },
    { id: 2, sender: "Naomi B.", initial: "N", color: "#FF69B4", text: "I'll bring matcha for everyone ☕", time: "Fri · 6:15pm" },
    { id: 3, sender: "Me",       initial: "Y", color: "#FF1F7D", text: "Perfect. See everyone Sunday 🌅", time: "Fri · 7pm", isMe: true },
  ],
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

  function toggle(id: number) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

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

// ── DAY EDITOR SHEET ──────────────────────────────────────────────────────────

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
  const dayLabel = DAY_FULL[date.getDay()];
  const monthDay = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
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
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        const n = [...photosRef.current, ev.target.result as string];
        photosRef.current = n; setPhotos(n); save({ photos: n });
      }
    };
    reader.readAsDataURL(file);
  }

  const WAVE_HEIGHTS = [8,14,22,18,10,26,16,8,20,12,26,8,18,24,10,16,22,8,14,18];

  return (
    <>
      <div className="fixed inset-0 z-[55]" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[56] rounded-t-[28px] flex flex-col"
        style={{ background: "#FEFCF7", maxHeight: "90vh", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", paddingBottom: "env(safe-area-inset-bottom,20px)" }}>

        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.12)" }} />
        </div>

        {/* Header */}
        <div className="px-6 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#FF1F7D", marginBottom: 2 }}>{dayLabel}</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1.1 }}>{monthDay}</p>
              {stickers.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                  {stickers.map((s, i) => (
                    <button key={i} onClick={() => removeSticker(i)} style={{ fontSize: 18, padding: "2px 5px", background: "rgba(255,31,125,0.08)", borderRadius: 8, border: "none", cursor: "pointer" }}>{s}</button>
                  ))}
                </div>
              )}
              {eventsToday.length > 0 && (
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {eventsToday.map((ev, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 999, background: `${ev.color}18`, border: `1px solid ${ev.color}44` }}>
                      <span style={{ fontSize: 11 }}>{ev.emoji}</span>
                      <span style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: ev.color }}>{ev.name} · {ev.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 8 }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
            </button>
          </div>
        </div>

        {/* Panels */}
        <div className="flex-1 overflow-y-auto">

          {tab === "write" && (
            <textarea value={text} onChange={e => handleText(e.target.value)}
              placeholder="Write about your day, your thoughts, your plans..."
              autoFocus
              style={{
                width: "100%", minHeight: 200,
                padding: "12px 24px 16px",
                fontFamily: "var(--font-caveat)", fontSize: 18, color: "#333",
                background: "repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.06) 32px)",
                backgroundSize: "100% 32px", backgroundPosition: "0 12px",
                border: "none", outline: "none", resize: "none", lineHeight: "32px",
              }}
            />
          )}

          {tab === "sticker" && (
            <div style={{ padding: "16px 20px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: "#FF1F7D", marginBottom: 12 }}>TAP TO ADD</p>
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
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#FF1F7D", fontWeight: 700 }}>Add from camera roll</p>
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
                  <div key={i} style={{
                    width: 3, borderRadius: 99,
                    height: recording ? undefined : h,
                    background: recording ? "#FF1F7D" : "rgba(255,31,125,0.22)",
                    animation: recording ? `waveBar ${0.4 + (i % 5) * 0.1}s ease-in-out ${i * 0.05}s infinite alternate` : "none",
                    minHeight: recording ? 6 : h, maxHeight: recording ? 36 : h,
                  }} />
                ))}
              </div>
              {recording && (
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 22, color: "#FF1F7D", marginBottom: 16 }}>
                  {Math.floor(recSecs / 60).toString().padStart(2,"0")}:{(recSecs % 60).toString().padStart(2,"0")}
                </p>
              )}
              <button onClick={() => recording ? stopRecording() : setRecording(true)}
                style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: recording ? "#FF1F7D" : "rgba(255,31,125,0.1)",
                  border: `3px solid ${recording ? "#FF1F7D" : "rgba(255,31,125,0.3)"}`,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: recording ? "0 0 0 10px rgba(255,31,125,0.1), 0 4px 20px rgba(255,31,125,0.4)" : "none",
                  transition: "all 0.2s",
                }}>
                {recording
                  ? <div style={{ width: 22, height: 22, borderRadius: 4, background: "white" }} />
                  : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,31,125,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                }
              </button>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#aaa", marginTop: 10, textAlign: "center" }}>
                {recording ? "Tap to stop" : "Tap to record a voice note"}
              </p>
              {voiceCount > 0 && (
                <div style={{ marginTop: 20, width: "100%" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#aaa", marginBottom: 8 }}>SAVED</p>
                  {Array.from({ length: voiceCount }, (_, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "white", borderRadius: 14, border: "1px solid rgba(0,0,0,0.06)", marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,31,125,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
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
                style={{ flex: 1, paddingTop: 7, paddingBottom: 7, borderRadius: 14, background: tab === t.id ? "#FF1F7D" : "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "background 0.15s" }}>
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

// ── PAPER CALENDAR VIEW ───────────────────────────────────────────────────────

function PaperCalendarView({ dayContents, onSelectDay }: { dayContents: Record<string, DayContent>; onSelectDay: (d: string) => void }) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  function dateKey(d: number) { return `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      {/* Decorative binding */}
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 14 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(0,0,0,0.08)", border: "2px solid rgba(0,0,0,0.12)" }} />
        ))}
      </div>

      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1 }}>{MONTH_NAMES[month]}</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#aaa", marginTop: 2 }}>{year}</p>
        </div>
        <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 }}>
        {DAY_NAMES.map(d => (
          <p key={d} style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.07em", color: "rgba(0,0,0,0.28)", textAlign: "center", paddingBottom: 4 }}>{d}</p>
        ))}
      </div>

      {/* Grid */}
      <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.07)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
          {cells.map((day, i) => {
            if (!day) return (
              <div key={i} style={{ minHeight: 54, background: "rgba(0,0,0,0.015)", borderRight: i%7!==6 ? "1px solid rgba(0,0,0,0.05)" : "none", borderBottom: i<cells.length-7 ? "1px solid rgba(0,0,0,0.05)" : "none" }} />
            );
            const key = dateKey(day);
            const isToday = key === todayKey;
            const dots = EVENT_DATES[key];
            const dc = dayContents[key];
            const hasSticker = dc?.stickers?.length > 0;
            const hasNote = dc && (dc.text || dc.photos.length > 0 || dc.voiceCount > 0);
            return (
              <button key={i} onClick={() => onSelectDay(key)}
                className="active:bg-pink-50 transition-colors"
                style={{
                  minHeight: 54, padding: "6px 3px",
                  borderRight: i%7!==6 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  borderBottom: i<cells.length-7 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  background: isToday ? "rgba(255,31,125,0.04)" : "transparent",
                  display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer",
                }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: isToday ? "#FF1F7D" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, fontWeight: isToday ? 700 : 400, color: isToday ? "white" : "rgba(0,0,0,0.7)", lineHeight: 1 }}>{day}</p>
                </div>
                {hasSticker
                  ? <span style={{ fontSize: 11 }}>{dc.stickers[dc.stickers.length-1]}</span>
                  : dots
                  ? <div style={{ display: "flex", gap: 2 }}>{dots.slice(0,2).map((ev,j) => <div key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: ev.color }} />)}</div>
                  : hasNote
                  ? <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,31,125,0.4)" }} />
                  : null
                }
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 14 }}>
        {[{ color: "#FF1F7D", label: "Today" }, { color: "#83C5A0", label: "Plans" }, { color: "rgba(255,31,125,0.4)", label: "Notes" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: l.color }} />
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#aaa" }}>{l.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DIARY ENTRY CARD ──────────────────────────────────────────────────────────

function DiaryEntryCard({ room, isRead, onPress }: { room: PlanRoom; isRead: boolean; onPress: () => void }) {
  const msgs = ROOM_MESSAGES[room.id] ?? [];
  const lastMsg = msgs[msgs.length - 1];
  const hasUnread = room.unread > 0 && !isRead;
  return (
    <button onClick={onPress} className="w-full text-left active:scale-[0.99] transition-transform"
      style={{ display: "flex", borderRadius: 20, overflow: "hidden", background: "white", boxShadow: hasUnread ? `0 0 0 1.5px ${room.accent}66, 0 4px 16px rgba(0,0,0,0.09)` : "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ width: 64, flexShrink: 0, background: `${room.accent}15`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: "16px 0", borderRight: `3px solid ${room.accent}33` }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>{room.emoji}</span>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: room.accent, fontWeight: 700, textAlign: "center", lineHeight: 1.2, padding: "0 4px" }}>{room.date}</p>
      </div>
      <div style={{ flex: 1, padding: "14px 16px 14px 14px", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1.15, flex: 1, minWidth: 0, paddingRight: 8 }}>{room.name}</p>
          {hasUnread && (
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#FF1F7D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "badgeShake 3s ease-in-out 1s infinite" }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: "white", lineHeight: 1 }}>{room.unread}</span>
            </div>
          )}
        </div>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#999", marginBottom: 6 }}>{room.members} women · {room.venue ?? room.time}</p>
        <div style={{ height: 1, background: "rgba(0,0,0,0.06)", marginBottom: 7 }} />
        {lastMsg && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#bbb", fontStyle: "italic", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as const, lineHeight: 1.4 }}>
            &ldquo;{lastMsg.text}&rdquo;
          </p>
        )}
      </div>
    </button>
  );
}

// ── PLAN ROOM THREAD (BRIGHT) ─────────────────────────────────────────────────

function PlanRoomThread({ room, onBack }: { room: PlanRoom; onBack: () => void }) {
  const [msgs, setMsgs] = useState<PlanMessage[]>(ROOM_MESSAGES[room.id] ?? []);
  const [draft, setDraft] = useState("");
  const [showTicket, setShowTicket] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  function send() {
    const t = draft.trim(); if (!t) return;
    setMsgs(p => [...p, { id: p.length + 100, sender: "Me", initial: "Y", color: "#FF1F7D", text: t, time: "now", isMe: true }]);
    setDraft("");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F8F4EF" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid rgba(0,0,0,0.07)", paddingTop: 54, position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px 12px" }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.05)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{ width: 38, height: 38, borderRadius: 14, background: `${room.accent}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{room.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1.2 }}>{room.name}</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#aaa", marginTop: 1 }}>{room.members} women · {room.time}</p>
          </div>
          <button onClick={() => setShowTicket(true)} style={{ padding: "5px 12px", borderRadius: 999, background: `${room.accent}15`, border: `1px solid ${room.accent}44`, cursor: "pointer", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: room.accent }}>🎟 Ticket</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 84px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          <span style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(0,0,0,0.3)", background: "rgba(0,0,0,0.05)", padding: "3px 12px", borderRadius: 999 }}>{room.venue}</span>
        </div>
        {msgs.map(msg => (
          <div key={msg.id} style={{ display: "flex", gap: 10, flexDirection: msg.isMe ? "row-reverse" : "row" }}>
            {!msg.isMe && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${msg.color},${msg.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, alignSelf: "flex-end", fontSize: 11, fontWeight: 800, color: "white" }}>{msg.initial}</div>
            )}
            <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: 3, alignItems: msg.isMe ? "flex-end" : "flex-start" }}>
              {!msg.isMe && <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.3)", paddingLeft: 4 }}>{msg.sender}</p>}
              <div style={{ padding: "10px 14px", borderRadius: 18, background: msg.isMe ? "#FF1F7D" : "white", color: msg.isMe ? "white" : "#222", fontFamily: "var(--font-jost)", fontSize: 14, lineHeight: 1.45, boxShadow: msg.isMe ? "0 2px 10px rgba(255,31,125,0.28)" : "0 1px 6px rgba(0,0,0,0.07)", borderBottomRightRadius: msg.isMe ? 4 : 18, borderBottomLeftRadius: msg.isMe ? 18 : 4 }}>{msg.text}</div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "rgba(0,0,0,0.25)", padding: "0 4px" }}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid rgba(0,0,0,0.07)", padding: "10px 16px", paddingBottom: "max(10px,env(safe-area-inset-bottom))", display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ flex: 1, background: "#F8F4EF", borderRadius: 24, border: "1px solid rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <input value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={`Message ${room.name}…`}
            style={{ width: "100%", padding: "10px 16px", fontSize: 14, fontFamily: "var(--font-jost)", outline: "none", background: "transparent", color: "#333", border: "none" }} />
        </div>
        <button onClick={send} style={{ width: 40, height: 40, borderRadius: "50%", background: draft.trim() ? "#FF1F7D" : "rgba(0,0,0,0.07)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s", boxShadow: draft.trim() ? "0 2px 10px rgba(255,31,125,0.4)" : "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={draft.trim() ? "white" : "rgba(0,0,0,0.3)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      {showTicket && <PlanTicketSheet room={room} onClose={() => setShowTicket(false)} onOpenRoom={() => setShowTicket(false)} />}
    </div>
  );
}

// ── NEW PLAN SHEET (BRIGHT) ───────────────────────────────────────────────────

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

        {/* Header */}
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
                {step === "choose" ? "What kind of plan?" : step === "room" ? "Create a planning thread" : step === "bloomie" ? "Send directly to friends" : "Share with club members"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.05)" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
          </button>
        </div>

        {/* Choose */}
        {step === "choose" && (
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
            {([
              { s: "room" as NewPlanStep, emoji: "🗓", label: "Plan Room", sub: "Group planning thread for an event or trip" },
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

        {/* Room */}
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

        {/* Bloomie */}
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

        {/* Club */}
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

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

function PlansPageInner() {
  const searchParams = useSearchParams();
  const [view, setView]             = useState<View>("list");
  const [mainTab, setMainTab]       = useState<MainTab>("plans");
  const [activeRoom, setActiveRoom] = useState<PlanRoom | null>(null);
  const [ticketRoom, setTicketRoom] = useState<PlanRoom | null>(null);
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [read, setRead]             = useState<Set<number>>(new Set());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
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
    return <PlanRoomThread room={activeRoom} onBack={() => { setView("list"); setActiveRoom(null); }} />;
  }

  const totalUnread = PLAN_ROOMS.filter(r => r.unread > 0 && !read.has(r.id)).length;
  const today = new Date();
  const todayStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ minHeight: "100vh", background: "#F6F1EB", paddingBottom: 96 }}>

      {/* Custom top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 54, zIndex: 51, background: "#FEFCF7", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, color: "#FF1F7D" }}>BB✿</span>

        <div style={{ display: "flex", background: "rgba(0,0,0,0.07)", borderRadius: 999, padding: "3px", gap: 2 }}>
          {(["plans","calendar"] as MainTab[]).map(t => (
            <button key={t} onClick={() => setMainTab(t)}
              style={{ padding: "6px 14px", borderRadius: 999, background: mainTab === t ? "#FF1F7D" : "transparent", color: mainTab === t ? "white" : "rgba(0,0,0,0.4)", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase" as const, border: "none", cursor: "pointer", transition: "all 0.18s", boxShadow: mainTab === t ? "0 2px 10px rgba(255,31,125,0.44)" : "none" }}>
              {t === "plans" ? "PLANS" : "CALENDAR"}
            </button>
          ))}
        </div>

        <button onClick={() => setShowNewPlan(true)} style={{ width: 32, height: 32, borderRadius: "50%", background: "#FF1F7D", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(255,31,125,0.38)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>

      <div style={{ paddingTop: 54 }}>

        {/* Plans tab */}
        {mainTab === "plans" && (
          <div>
            <div style={{ padding: "22px 20px 14px" }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#FF1F7D", marginBottom: 4 }}>{todayStr}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 34, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1, letterSpacing: "-0.01em" }}>Your Plans</h1>
                {totalUnread > 0 && (
                  <div style={{ background: "#FF1F7D", color: "white", borderRadius: 999, padding: "3px 10px", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800 }}>{totalUnread} new</div>
                )}
              </div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#aaa", marginTop: 4, fontStyle: "italic" }}>{PLAN_ROOMS.length} rooms · tickets &amp; threads</p>
            </div>

            <div style={{ padding: "0 20px 8px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.28)" }}>PLAN ROOMS</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 16px 16px" }}>
              {PLAN_ROOMS.map(room => (
                <DiaryEntryCard key={room.id} room={room} isRead={read.has(room.id)} onPress={() => openRoom(room)} />
              ))}
              <button onClick={() => setShowNewPlan(true)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "18px", borderRadius: 20, border: "1.5px dashed rgba(255,31,125,0.28)", background: "rgba(255,31,125,0.03)", cursor: "pointer", gap: 8 }}>
                <span style={{ fontSize: 18, color: "#FF1F7D" }}>+</span>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,31,125,0.65)" }}>Start a new plan room</p>
              </button>
            </div>

            {/* Ticket strip */}
            {PLAN_ROOMS.some(r => r.eventId) && (
              <div style={{ padding: "0 0 16px" }}>
                <div style={{ padding: "0 20px 8px" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.28)" }}>MY TICKETS</p>
                </div>
                <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "4px 16px 4px", scrollbarWidth: "none" as const }}>
                  {PLAN_ROOMS.filter(r => r.eventId).map(room => {
                    const ticketCode = `BB-${room.id.toString().padStart(2,"0")}-${(room.id * 7841 + 3301) % 9000 + 1000}`;
                    return (
                      <div key={room.id} style={{ flexShrink: 0, width: 200, borderRadius: 16, overflow: "hidden", background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                        <button onClick={() => openRoom(room)} className="w-full flex items-stretch text-left active:scale-[0.99] transition-transform">
                          <div style={{ width: 52, flexShrink: 0, background: room.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                            <span style={{ fontSize: 22 }}>{room.emoji}</span>
                            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 9, color: room.accent, fontWeight: 700 }}>{room.date}</p>
                          </div>
                          <div style={{ flex: 1, padding: "10px 12px" }}>
                            <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.15em", color: "#FF1F7D", marginBottom: 2 }}>PLAN ROOM</p>
                            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: "#111", lineHeight: 1.2, marginBottom: 2 }}>{room.name}</p>
                            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#aaa" }}>{room.time}</p>
                          </div>
                        </button>
                        <div style={{ borderTop: "1px dashed rgba(0,0,0,0.08)", margin: "0 10px" }} />
                        <div style={{ padding: "6px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "#ccc", letterSpacing: "0.05em" }}>{ticketCode}</p>
                          <button onClick={() => setTicketRoom(room)} style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: "#FF1F7D", background: "none", border: "none", cursor: "pointer" }}>View →</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calendar tab */}
        {mainTab === "calendar" && (
          <div style={{ padding: "16px 0" }}>
            <div style={{ background: "#FEFCF7", margin: "0 16px 16px", borderRadius: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", overflow: "hidden" }}>
              <PaperCalendarView dayContents={dayContents} onSelectDay={setSelectedDay} />
            </div>
          </div>
        )}
      </div>

      {/* Day editor sheet */}
      {selectedDay && (
        <DayEditorSheet
          dayKey={selectedDay}
          content={dayContents[selectedDay] ?? { text: "", stickers: [], photos: [], voiceCount: 0 }}
          onUpdate={c => updateDayContent(selectedDay, c)}
          onClose={() => setSelectedDay(null)}
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
