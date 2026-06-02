"use client";

import { useState, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type ChatType = "bloomie" | "club" | "bloombay" | "group" | "plan";

interface ChatEntry {
  id: number;
  type: ChatType;
  name: string;
  initial: string;
  color: string;
  preview: string;
  time: string;
  unread: number;
  members?: number;
}

interface ThreadMsg {
  id: number;
  from: string;
  initial: string;
  color: string;
  text: string;
  mine: boolean;
  time: string;
  mediaType?: "photo" | "voice" | "gif";
  mediaLabel?: string;
  reactions?: number;
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const CHATS: ChatEntry[] = [
  { id: 1, type: "bloombay", name: "BloomBay HQ",      initial: "✦", color: "#FF1F7D", preview: "Jollof Night Friday — 3 seats left. Don't miss it.", time: "2m",  unread: 2 },
  { id: 2, type: "bloomie",  name: "Aminah C.",         initial: "A", color: "#FF1F7D", preview: "I saved you a seat at my table 🌸",                  time: "14m", unread: 1 },
  { id: 3, type: "club",     name: "African Girls Club",initial: "AG",color: "#FF69B4", preview: "New event: Afrobeats Night — Saturday 10PM.",         time: "1h",  unread: 1, members: 47 },
  { id: 4, type: "bloomie",  name: "Sofia K.",          initial: "S", color: "#FF69B4", preview: "Same time next week? That class was perfect.",         time: "3h",  unread: 0 },
  { id: 5, type: "club",     name: "Soft Life Club",    initial: "SL",color: "#FF1F7D", preview: "Sunday brunch confirmed! Table under Amanda.",         time: "5h",  unread: 0, members: 22 },
  { id: 6, type: "group",    name: "Morocco October",   initial: "M", color: "#FF69B4", preview: "Zara: I booked my flight!! Who else is in??",          time: "8h",  unread: 3, members: 7 },
  { id: 7, type: "bloomie",  name: "Kelechi O.",        initial: "K", color: "#FF69B4", preview: "The jollof was unreal. Thank you for the rec 🙏",      time: "1d",  unread: 0 },
];

const THREADS: Record<number, ThreadMsg[]> = {
  1: [
    { id: 1, from: "BloomBay", initial: "✦", color: "#FF1F7D", text: "Jollof + Movie Night Friday is filling up fast — 3 seats left.", mine: false, time: "2m ago" },
    { id: 2, from: "BloomBay", initial: "✦", color: "#FF1F7D", text: "Your Bouquet member Aminah just grabbed one. You should too.", mine: false, time: "1m ago", mediaType: "gif", mediaLabel: "🎬 Tap to view" },
  ],
  2: [
    { id: 1, from: "Aminah C.", initial: "A", color: "#FF1F7D", text: "Are you going Friday?? I saved you a seat at my table 🌸", mine: false, time: "14m ago" },
    { id: 2, from: "You", initial: "Y", color: "#FF1F7D", text: "YES omg, what are you wearing", mine: true, time: "10m ago" },
    { id: 3, from: "Aminah C.", initial: "A", color: "#FF1F7D", text: "Something pink obviously.", mine: false, time: "8m ago", mediaType: "photo", mediaLabel: "📸 Photo" },
    { id: 4, from: "Aminah C.", initial: "A", color: "#FF1F7D", text: "Meet me at the door at 7?", mine: false, time: "8m ago" },
  ],
  3: [
    { id: 1, from: "Imani J.", initial: "I", color: "#FF69B4", text: "Afrobeats Night at SOB's — who's coming Saturday? Let's coordinate outfits.", mine: false, time: "1h ago", reactions: 8 },
    { id: 2, from: "Naomi B.", initial: "N", color: "#FF1F7D", text: "I'm in!! Already have the perfect dress.", mine: false, time: "58m ago", reactions: 4 },
    { id: 3, from: "Temi A.",  initial: "T", color: "#FF69B4", text: "Same — leaving straight from work. Will someone save a table?", mine: false, time: "45m ago" },
    { id: 4, from: "You", initial: "Y", color: "#FF1F7D", text: "I can be there early and get a table 🙋‍♀️", mine: true, time: "30m ago" },
  ],
  4: [
    { id: 1, from: "Sofia K.", initial: "S", color: "#FF69B4", text: "That pilates class was SO good.", mine: false, time: "3h ago" },
    { id: 2, from: "Sofia K.", initial: "S", color: "#FF69B4", text: "Same time next week?", mine: false, time: "3h ago", mediaType: "voice", mediaLabel: "0:08" },
    { id: 3, from: "You", initial: "Y", color: "#FF1F7D", text: "Absolutely. Already blocked my calendar.", mine: true, time: "2h ago" },
  ],
  5: [
    { id: 1, from: "Soft Life Club", initial: "SL", color: "#FF1F7D", text: "Sunday brunch confirmed! Arrive by 11:15. Table booked under Amanda.", mine: false, time: "5h ago" },
  ],
  6: [
    { id: 1, from: "Zara F.",  initial: "Z", color: "#FF69B4", text: "I booked my flight!! Oct 4–11 ✈️ Who else is confirmed?", mine: false, time: "8h ago", reactions: 5 },
    { id: 2, from: "Sofia K.", initial: "S", color: "#FF69B4", text: "Me!! Already have mine", mine: false, time: "7h ago", reactions: 3 },
    { id: 3, from: "You", initial: "Y", color: "#FF1F7D", text: "Booking tonight! Send me the dates again?", mine: true, time: "6h ago" },
    { id: 4, from: "Zara F.",  initial: "Z", color: "#FF69B4", text: "Oct 4–11, flying out of JFK.", mine: false, time: "5h ago", mediaType: "photo", mediaLabel: "📸 Itinerary" },
  ],
  7: [
    { id: 1, from: "Kelechi O.", initial: "K", color: "#FF69B4", text: "The jollof was unreal. Thank you for the rec 🙏", mine: false, time: "1d ago" },
    { id: 2, from: "You", initial: "Y", color: "#FF1F7D", text: "Told you!! Best kept secret in Brooklyn.", mine: true, time: "23h ago" },
    { id: 3, from: "Kelechi O.", initial: "K", color: "#FF69B4", text: "I'm going back with 6 more girls. You're legendary.", mine: false, time: "22h ago" },
  ],
};

// ── Input bar with photo / voice / GIF ────────────────────────────────────────

function MessageInput({ onSend, placeholder = "Say something…" }: { onSend?: (text: string) => void; placeholder?: string }) {
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const recTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  function startRecord() {
    setRecording(true);
    setRecordSecs(0);
    recTimer.current = setInterval(() => setRecordSecs((s) => s + 1), 1000);
  }
  function stopRecord() {
    setRecording(false);
    if (recTimer.current) clearInterval(recTimer.current);
    setRecordSecs(0);
  }
  function handleSend() {
    if (!text.trim()) return;
    onSend?.(text.trim());
    setText("");
  }

  if (recording) {
    return (
      <div className="px-4 py-3 flex items-center gap-3" style={{ background: "white", borderTop: "1px solid #F5F5F5" }}>
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-full" style={{ background: "#FFF5F8", border: "1.5px solid #FF1F7D" }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "#FF1F7D" }} />
          <div className="flex-1 flex gap-0.5 items-center h-5">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="rounded-full flex-shrink-0" style={{ width: "2px", background: "#FF1F7D", height: `${8 + Math.sin(i * 0.7 + Date.now() / 200) * 6}px`, opacity: 0.6 + (i % 3) * 0.15 }} />
            ))}
          </div>
          <span className="text-xs font-bold flex-shrink-0" style={{ color: "#FF1F7D" }}>0:{String(recordSecs).padStart(2, "0")}</span>
        </div>
        <button onClick={stopRecord} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF1F7D" }}>
          <div className="w-3.5 h-3.5 rounded-sm" style={{ background: "white" }} />
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 flex items-center gap-2" style={{ background: "white", borderTop: "1px solid #F5F5F5" }}>
      {/* Photo */}
      <button
        onClick={() => alert("Photo upload coming soon")}
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "#FFF0F5" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
      </button>
      {/* GIF */}
      <button
        onClick={() => alert("GIF picker coming soon")}
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black"
        style={{ background: "#FFF0F5", color: "#FF1F7D" }}
      >
        GIF
      </button>
      {/* Text input */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder={placeholder}
        className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
        style={{ background: "#FFF5F8", color: "#111111", border: "1.5px solid #FFE0EE" }}
      />
      {/* Voice / Send */}
      {text.trim() ? (
        <button onClick={handleSend} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF1F7D" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
        </button>
      ) : (
        <button
          onMouseDown={startRecord}
          onMouseUp={stopRecord}
          onTouchStart={startRecord}
          onTouchEnd={stopRecord}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#FFF0F5" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
          </svg>
        </button>
      )}
    </div>
  );
}

// ── Bloomie Thread — intimate note-passing ────────────────────────────────────

function BloomieThread({ chat, msgs, onBack }: { chat: ChatEntry; msgs: ThreadMsg[]; onBack: () => void }) {
  const [messages, setMessages] = useState(msgs);

  function addMsg(text: string) {
    setMessages((p) => [...p, { id: Date.now(), from: "You", initial: "Y", color: "#FF1F7D", text, mine: true, time: "just now" }]);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FDFAF5" }}>
      {/* Header — intimate, polaroid style */}
      <div className="px-5 pt-14 pb-4 md:pt-8 flex items-center gap-3" style={{ background: "#FDFAF5", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.06)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${chat.color} 0%, ${chat.color}BB 100%)`, boxShadow: `0 3px 10px ${chat.color}44` }}
        >
          {chat.initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{chat.name}</p>
          <p className="text-[10px]" style={{ color: "#bbb" }}>Bloomie · Private</p>
        </div>
        {/* Heart indicator */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FFE0EE" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF1F7D" stroke="none">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </div>
      </div>

      {/* Messages — note-card aesthetic, not standard bubbles */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-3 overflow-y-auto pb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.mine ? "flex-row-reverse" : ""}`}>
            {!msg.mine && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 self-end"
                   style={{ background: `linear-gradient(135deg, ${msg.color} 0%, ${msg.color}BB 100%)` }}>
                {msg.initial}
              </div>
            )}
            <div className="max-w-[70%] flex flex-col gap-0.5" style={{ alignItems: msg.mine ? "flex-end" : "flex-start" }}>
              {msg.mediaType === "photo" && (
                <div className="rounded-xl overflow-hidden" style={{ background: "#F0E0E8", width: "160px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div className="text-center">
                    <p className="text-2xl mb-1">📸</p>
                    <p className="text-[10px] font-bold" style={{ color: "#FF1F7D" }}>{msg.mediaLabel}</p>
                  </div>
                </div>
              )}
              {msg.mediaType === "voice" && (
                <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: msg.mine ? "#FF1F7D" : "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", minWidth: "160px" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: msg.mine ? "rgba(255,255,255,0.2)" : "#FFE0EE" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill={msg.mine ? "white" : "#FF1F7D"}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                  <div className="flex gap-0.5 items-center flex-1 h-4">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="rounded-full flex-shrink-0" style={{ width: "2px", height: `${4 + Math.abs(Math.sin(i * 1.2)) * 10}px`, background: msg.mine ? "rgba(255,255,255,0.7)" : "#FF1F7D", opacity: 0.6 }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold flex-shrink-0" style={{ color: msg.mine ? "rgba(255,255,255,0.7)" : "#aaa" }}>{msg.mediaLabel}</span>
                </div>
              )}
              {msg.mediaType === "gif" && (
                <div className="rounded-xl overflow-hidden" style={{ background: "#111", width: "160px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p className="text-sm font-bold" style={{ color: "#FF69B4" }}>{msg.mediaLabel}</p>
                </div>
              )}
              {msg.text && (
                <div
                  className="px-4 py-2.5 rounded-2xl"
                  style={{
                    background: msg.mine ? "#FF1F7D" : "white",
                    boxShadow: msg.mine ? "0 3px 12px rgba(255,31,125,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
                    borderBottomRightRadius: msg.mine ? "6px" : "16px",
                    borderBottomLeftRadius: msg.mine ? "16px" : "6px",
                  }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: msg.mine ? "white" : "#111" }}>{msg.text}</p>
                </div>
              )}
              <p className="text-[10px] px-1" style={{ color: "#ccc" }}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <MessageInput onSend={addMsg} placeholder={`Message ${chat.name.split(" ")[0]}…`} />
    </div>
  );
}

// ── Club Thread — living board, not bubble chat ───────────────────────────────

function ClubThread({ chat, msgs, onBack }: { chat: ChatEntry; msgs: ThreadMsg[]; onBack: () => void }) {
  const [messages, setMessages] = useState(msgs);
  const [loved, setLoved] = useState<Set<number>>(new Set());

  function addMsg(text: string) {
    setMessages((p) => [...p, { id: Date.now(), from: "You", initial: "Y", color: "#FF1F7D", text, mine: true, time: "just now", reactions: 0 }]);
  }

  const MEMBER_AVATARS = ["A", "N", "T", "K", "S", "Z", "+38"];
  const MEMBER_COLORS = ["#FF1F7D", "#FF69B4", "#FF69B4", "#FF1F7D", "#FF69B4", "#FF1F7D", "#111"];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F9F5F8" }}>
      {/* Club header — room/hall feel */}
      <div className="pt-14 pb-0 md:pt-8" style={{ background: "white", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="px-5 flex items-center gap-3 mb-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,0,0,0.06)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-xs flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${chat.color} 0%, ${chat.color}CC 100%)` }}
          >
            {chat.initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ color: "#111" }}>{chat.name}</p>
            <p className="text-[10px]" style={{ color: "#bbb" }}>{chat.members} members · Club Room</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#FF1F7D" }} />
            <p className="text-[9px] font-bold tracking-wider uppercase" style={{ color: "#FF1F7D" }}>LIVE</p>
          </div>
        </div>
        {/* Member avatars — who's in the room */}
        <div className="px-5 pb-3 flex items-center gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {MEMBER_AVATARS.map((a, i) => (
            <div key={i}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 border-2 border-white"
              style={{ background: MEMBER_COLORS[i], boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
              {a}
            </div>
          ))}
        </div>
      </div>

      {/* Messages — notice board cards, not bubbles */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-3 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.mine ? "justify-end" : ""}`}>
            {!msg.mine && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 self-start mt-1"
                   style={{ background: `linear-gradient(135deg, ${msg.color} 0%, ${msg.color}BB 100%)` }}>
                {msg.initial}
              </div>
            )}
            <div className={`${msg.mine ? "max-w-[68%]" : "flex-1"}`}>
              {!msg.mine && (
                <p className="text-[10px] font-bold mb-1.5 ml-1" style={{ color: msg.color }}>{msg.from}</p>
              )}
              <div
                className="rounded-2xl px-4 py-3"
                style={{
                  background: msg.mine ? "#FF1F7D" : "white",
                  boxShadow: msg.mine ? "0 3px 12px rgba(255,31,125,0.2)" : "0 2px 10px rgba(0,0,0,0.06)",
                  borderTopLeftRadius: !msg.mine ? "6px" : "16px",
                  borderTopRightRadius: msg.mine ? "6px" : "16px",
                }}
              >
                {msg.mediaType === "photo" && (
                  <div className="mb-2.5 rounded-xl overflow-hidden" style={{ background: "#F0E0E8", height: "110px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p className="text-2xl">📸</p>
                  </div>
                )}
                <p className="text-sm leading-relaxed" style={{ color: msg.mine ? "white" : "#111" }}>{msg.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px]" style={{ color: msg.mine ? "rgba(255,255,255,0.5)" : "#ccc" }}>{msg.time}</p>
                  {!msg.mine && (
                    <button
                      onClick={() => setLoved((p) => { const n = new Set(p); n.has(msg.id) ? n.delete(msg.id) : n.add(msg.id); return n; })}
                      className="flex items-center gap-1 px-2 py-1 rounded-full transition-all active:scale-90"
                      style={{ background: loved.has(msg.id) ? "#FF1F7D" : "#FFF0F5" }}
                    >
                      <span style={{ fontSize: "10px" }}>🌸</span>
                      <span className="text-[9px] font-bold" style={{ color: loved.has(msg.id) ? "white" : "#FF1F7D" }}>
                        {(msg.reactions ?? 0) + (loved.has(msg.id) ? 1 : 0)}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MessageInput onSend={addMsg} placeholder="Post to the club…" />
    </div>
  );
}

// ── BloomBay HQ Thread — official dispatch ────────────────────────────────────

function BloomBayThread({ msgs, onBack }: { msgs: ThreadMsg[]; onBack: () => void }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#111111" }}>
      {/* HQ Header */}
      <div className="px-5 pt-14 pb-5 md:pt-8 relative overflow-hidden" style={{ background: "#111111", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(255,31,125,0.14) 0%, transparent 60%)" }} />
        <div className="relative flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-base flex-shrink-0" style={{ background: "#FF1F7D", boxShadow: "0 4px 14px rgba(255,31,125,0.4)" }}>
            ✦
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "white" }}>BloomBay HQ</p>
            <p className="text-[10px] tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>OFFICIAL DISPATCH</p>
          </div>
        </div>
      </div>

      {/* Dispatch messages — sealed letter aesthetic */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-4 overflow-y-auto">
        {msgs.map((msg) => (
          <div key={msg.id} className={`${msg.mine ? "flex justify-end" : ""}`}>
            {!msg.mine ? (
              <div className="rounded-2xl overflow-hidden" style={{ background: "#1C1610", border: "1px solid rgba(255,31,125,0.18)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                {/* Stamp header */}
                <div className="px-5 py-2.5 flex items-center gap-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-sm" style={{ color: "#FF1F7D" }}>✦</span>
                  <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>BLOOMBAY HQ</p>
                  <div className="flex-1" />
                  <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>{msg.time}</p>
                </div>
                {msg.mediaType === "gif" && (
                  <div className="mx-5 mt-4 rounded-xl overflow-hidden" style={{ background: "rgba(255,31,125,0.15)", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p className="font-bold" style={{ color: "#FF69B4" }}>{msg.mediaLabel}</p>
                  </div>
                )}
                <div className="px-5 py-4">
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>{msg.text}</p>
                </div>
              </div>
            ) : (
              <div className="max-w-[72%] px-4 py-3 rounded-2xl" style={{ background: "#FF1F7D", boxShadow: "0 3px 12px rgba(255,31,125,0.3)" }}>
                <p className="text-sm leading-relaxed text-white">{msg.text}</p>
                <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{msg.time}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reply bar — dark style */}
      <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#1C1610", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <input
          type="text"
          placeholder="Reply to HQ…"
          className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,31,125,0.25)" }}
        />
        <button className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF1F7D" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
        </button>
      </div>
    </div>
  );
}

// ── Plan Room — event planning space ─────────────────────────────────────────

function PlanRoom({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"PLAN" | "PEOPLE" | "DETAILS" | "ORDERS">("PLAN");
  const [chatMsg, setChatMsg] = useState("");
  const [chatMsgs, setChatMsgs] = useState([
    { from: "Maya", initial: "M", color: "#FF1F7D", text: "I found the cutest table lamp 🕯️✨  It's giving <3", mine: false, time: "12:40 PM", reactions: 3 },
    { from: "You", initial: "Y", color: "#FF1F7D", text: "Omg stop I love it  Perfection", mine: true, time: "12:41 PM" },
  ]);

  const ATTENDEES = [
    { initial: "Y", name: "You",   role: "Host",      color: "#FF1F7D", confirmed: true },
    { initial: "M", name: "Maya",  role: "Confirmed", color: "#FF1F7D", confirmed: true },
    { initial: "T", name: "Teni",  role: "Confirmed", color: "#FF69B4", confirmed: true },
    { initial: "A", name: "Aisha", role: "Confirmed", color: "#FF69B4", confirmed: true },
    { initial: "Z", name: "Zara",  role: "Confirmed", color: "#FF1F7D", confirmed: true },
    { initial: "N", name: "Noor",  role: "Pending",   color: "#FF69B4", confirmed: false },
    { initial: "+2",name: "Invited", role: "Invited", color: "#888",    confirmed: false },
  ];

  function sendChat() {
    if (!chatMsg.trim()) return;
    setChatMsgs((p) => [...p, { from: "You", initial: "Y", color: "#FF1F7D", text: chatMsg.trim(), mine: true, time: "just now" }]);
    setChatMsg("");
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#111111" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-0 md:pt-8 relative" style={{ background: "#111111" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(255,31,125,0.15) 0%, transparent 55%)" }} />
        <div className="relative flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: "#FF1F7D" }}>PLAN ROOM ✿</p>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </div>
        </div>

        {/* Hero */}
        <div className="relative mb-4 flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-white leading-tight mb-2" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px,8vw,36px)", fontWeight: 900 }}>
              Let&apos;s make it{" "}
              <span style={{ fontFamily: "var(--font-caveat)", color: "#FF1F7D", fontWeight: 400, fontSize: "1.2em", fontStyle: "italic" }}>
                iconic
              </span>
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <p className="text-[10px] font-bold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>PLAN FOR</p>
            </div>
            <p className="text-lg font-bold" style={{ color: "white" }}>Saturday in Soho ✿</p>
          </div>
          {/* Polaroid photo */}
          <div className="flex-shrink-0 relative" style={{ transform: "rotate(3deg)" }}>
            <div className="bg-white p-2 pb-6 shadow-xl rounded-sm" style={{ width: "88px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
              <div className="w-full h-16 rounded-sm flex items-center justify-center" style={{ background: "linear-gradient(135deg, #330011, #FF1F7D44)" }}>
                <span className="text-2xl">🥂</span>
              </div>
              <p className="text-[8px] text-center mt-1 italic" style={{ fontFamily: "var(--font-caveat)", color: "#888", fontSize: "10px" }}>this is going to be so good ♡</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          {(["PLAN", "PEOPLE", "DETAILS", "ORDERS"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 text-xs font-bold tracking-wider transition-all"
              style={activeTab === tab
                ? { color: "#FF1F7D", borderBottom: "2px solid #FF1F7D" }
                : { color: "rgba(255,255,255,0.35)", borderBottom: "2px solid transparent" }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">

        {activeTab === "PLAN" && (
          <div className="p-5 flex flex-col gap-4">
            {/* The Plan card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "white" }}>
              <div className="px-4 py-2 flex items-center" style={{ background: "#FF1F7D" }}>
                <p className="text-xs font-black tracking-wider uppercase text-white">THE PLAN</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-base font-semibold mb-1.5" style={{ color: "#111" }}>Dinner at Lafayette House</p>
                <p className="text-base font-semibold mb-1.5" style={{ color: "#111" }}>Drinks after at Dante</p>
                <p className="text-base font-semibold flex items-center gap-2" style={{ color: "#111" }}>Late night girls&apos; walk <span>♡</span></p>
              </div>
              {/* Voice note */}
              <div className="mx-4 mb-4 rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: "#FFF0F5" }}>
                <button className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF1F7D" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
                <div className="flex gap-0.5 items-center flex-1 h-5">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} style={{ width: "2px", height: `${4 + Math.abs(Math.sin(i * 0.9)) * 12}px`, background: "#FF1F7D", opacity: 0.5, borderRadius: "2px", flexShrink: 0 }} />
                  ))}
                </div>
                <span className="text-xs font-bold" style={{ color: "#FF1F7D" }}>0:28</span>
              </div>
              <div className="px-4 pb-4">
                <p className="text-xs" style={{ color: "#aaa" }}>Voice Note from Maya</p>
              </div>
              {/* Outfit check card */}
              <div className="mx-4 mb-4 rounded-xl px-4 py-3.5" style={{ background: "#FFF5F8", border: "1px solid rgba(255,31,125,0.12)" }}>
                <p className="text-[10px] font-black tracking-wider uppercase mb-1.5" style={{ color: "#FF1F7D" }}>OUTFIT CHECK</p>
                <p className="text-sm italic leading-snug mb-2.5" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>Help each other decide what to wear</p>
                <div className="flex items-center gap-1">
                  {["A","T","Z","M"].map((a, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: i % 2 === 0 ? "#FF1F7D" : "#FF69B4", marginLeft: i > 0 ? "-8px" : "0", zIndex: 4 - i }}>
                      {a}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "#111", color: "#FF69B4", marginLeft: "-8px" }}>+4</div>
                </div>
              </div>
            </div>

            {/* Countdown + Advance Order */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-4" style={{ background: "#1C1610" }}>
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#FF1F7D" }}>COUNTDOWN</p>
                <p className="font-black leading-none mb-0.5" style={{ color: "white", fontFamily: "var(--font-playfair)", fontSize: "42px" }}>02</p>
                <p className="text-xs font-bold tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>DAYS</p>
                <div className="flex gap-3">
                  <div>
                    <p className="text-2xl font-black" style={{ color: "white", fontFamily: "var(--font-playfair)" }}>07</p>
                    <p className="text-[9px] font-bold tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>HRS</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black" style={{ color: "white", fontFamily: "var(--font-playfair)" }}>48</p>
                    <p className="text-[9px] font-bold tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>MIN</p>
                  </div>
                </div>
                <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>until our night</p>
              </div>
              <div className="rounded-2xl p-4" style={{ background: "#FFF0F5" }}>
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1.5" style={{ color: "#FF1F7D" }}>ADVANCE ORDER</p>
                <p className="text-xs leading-snug mb-3" style={{ color: "#555" }}>Skip the line. Pre-order your favorites.</p>
                <div className="flex items-center gap-1.5 mb-2">
                  {["🍝","🥗","🍹"].map((e, i) => (
                    <div key={i} className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "rgba(255,31,125,0.1)" }}>{e}</div>
                  ))}
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FF1F7D" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "PEOPLE" && (
          <div className="p-5">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "#FF1F7D" }}>WHO&apos;S COMING</p>
            <div className="grid grid-cols-3 gap-3">
              {ATTENDEES.map((a, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white"
                      style={{ background: a.initial === "+2" ? "#333" : `linear-gradient(135deg, ${a.color} 0%, ${a.color}BB 100%)`, fontSize: a.initial.length > 1 ? "11px" : "18px" }}>
                      {a.initial}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white"
                      style={{ background: a.role === "Host" ? "#FF1F7D" : a.confirmed ? "#4CAF50" : a.role === "Pending" ? "#FFC107" : "#bbb" }} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>{a.name}</p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{a.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-3.5 rounded-full text-sm font-bold text-white" style={{ background: "rgba(255,31,125,0.2)", border: "1px solid rgba(255,31,125,0.3)" }}>
              + Invite more women
            </button>
          </div>
        )}

        {activeTab === "DETAILS" && (
          <div className="p-5 flex flex-col gap-4">
            {[
              { label: "VENUE", val: "Lafayette House, SoHo", icon: "📍" },
              { label: "DATE", val: "Saturday, June 7 · 7:30 PM", icon: "📅" },
              { label: "DRESS CODE", val: "Something pink, obviously", icon: "👗" },
              { label: "BACKUP PLAN", val: "Dante cocktail bar if late", icon: "🍸" },
            ].map((d, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl px-4 py-3.5" style={{ background: "#1C1610" }}>
                <span className="text-xl flex-shrink-0 mt-0.5">{d.icon}</span>
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#FF1F7D" }}>{d.label}</p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{d.val}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "ORDERS" && (
          <div className="p-5 flex flex-col gap-3">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "#FF1F7D" }}>PRE-ORDERS</p>
            {[
              { name: "Maya", item: "Truffle pasta + rosé", status: "Confirmed" },
              { name: "Teni", item: "Burrata + cocktail", status: "Confirmed" },
              { name: "You", item: "Not yet ordered", status: "Pending" },
            ].map((o, i) => (
              <div key={i} className="rounded-2xl px-4 py-3.5 flex items-center gap-3" style={{ background: "#1C1610" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "#FF1F7D" }}>
                  {o.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: "white" }}>{o.name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{o.item}</p>
                </div>
                <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                  style={o.status === "Confirmed" ? { background: "rgba(76,175,80,0.2)", color: "#4CAF50" } : { background: "rgba(255,31,125,0.2)", color: "#FF69B4" }}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Plan Chat — always at bottom of PLAN tab */}
        {activeTab === "PLAN" && (
          <div className="px-5 pb-5">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#FF1F7D" }}>PLAN CHAT</p>
            <div className="flex flex-col gap-3 mb-4">
              {chatMsgs.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.mine ? "flex-row-reverse" : ""}`}>
                  {!msg.mine && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 self-end"
                         style={{ background: msg.color }}>
                      {msg.initial}
                    </div>
                  )}
                  <div className={`max-w-[70%]`}>
                    {!msg.mine && <p className="text-[10px] font-bold mb-1" style={{ color: "#FF69B4" }}>{msg.from}</p>}
                    <div className="px-4 py-2.5 rounded-2xl" style={{ background: msg.mine ? "#FF1F7D" : "#1C1610" }}>
                      <p className="text-sm" style={{ color: "white" }}>{msg.text}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{msg.time}</p>
                        {!msg.mine && msg.reactions && (
                          <span className="text-[10px]" style={{ color: "#FF69B4" }}>🌸 {msg.reactions}</span>
                        )}
                        {msg.mine && <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>✓</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <div className="flex items-center gap-2" style={{ background: "#1C1610", borderRadius: "100px", padding: "6px 6px 6px 16px", border: "1px solid rgba(255,31,125,0.2)" }}>
              <button className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF1F7D" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="none"><line x1="12" y1="5" x2="12" y2="19" strokeWidth="2"/><line x1="5" y1="12" x2="19" y2="12" strokeWidth="2"/></svg>
              </button>
              <input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                type="text"
                placeholder="Say something, Bloomie…"
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: "rgba(255,255,255,0.8)" }}
              />
              {/* BB flower icon */}
              <button onClick={sendChat} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "18px" }}>✿</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Group Thread ──────────────────────────────────────────────────────────────

function GroupThread({ chat, msgs, onBack }: { chat: ChatEntry; msgs: ThreadMsg[]; onBack: () => void }) {
  const [messages, setMessages] = useState(msgs);
  function addMsg(text: string) {
    setMessages((p) => [...p, { id: Date.now(), from: "You", initial: "Y", color: "#FF1F7D", text, mine: true, time: "just now" }]);
  }
  const MEMBER_COLORS = ["#FF1F7D", "#FF69B4", "#FF1F7D", "#FF69B4", "#FF1F7D"];
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFF5FB" }}>
      <div className="px-5 pt-14 pb-4 md:pt-8 flex items-center gap-3" style={{ background: "white", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.06)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        {/* Stacked avatars for group */}
        <div className="flex items-center flex-shrink-0" style={{ width: "44px" }}>
          {["Z","S","A"].map((a, i) => (
            <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white"
              style={{ background: MEMBER_COLORS[i], marginLeft: i > 0 ? "-8px" : "0", zIndex: 3 - i }}>
              {a}
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: "#111" }}>{chat.name}</p>
          <p className="text-[10px]" style={{ color: "#bbb" }}>Group · {chat.members} women</p>
        </div>
      </div>
      <div className="flex-1 px-5 py-5 flex flex-col gap-3 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.mine ? "flex-row-reverse" : ""}`}>
            {!msg.mine && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 self-end"
                   style={{ background: `linear-gradient(135deg, ${msg.color} 0%, ${msg.color}BB 100%)` }}>
                {msg.initial}
              </div>
            )}
            <div className="max-w-[70%] flex flex-col gap-0.5" style={{ alignItems: msg.mine ? "flex-end" : "flex-start" }}>
              {!msg.mine && <p className="text-[10px] font-bold px-1" style={{ color: msg.color }}>{msg.from}</p>}
              {msg.mediaType === "photo" && (
                <div className="rounded-xl overflow-hidden mb-1" style={{ background: "#F0E0E8", width: "160px", height: "110px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p className="text-2xl">📸</p>
                </div>
              )}
              {msg.text && (
                <div className="px-4 py-2.5 rounded-2xl"
                  style={{ background: msg.mine ? "#FF1F7D" : "white", boxShadow: msg.mine ? "0 3px 12px rgba(255,31,125,0.2)" : "0 2px 8px rgba(0,0,0,0.06)", borderBottomRightRadius: msg.mine ? "6px" : "16px", borderBottomLeftRadius: msg.mine ? "16px" : "6px" }}>
                  <p className="text-sm" style={{ color: msg.mine ? "white" : "#111" }}>{msg.text}</p>
                </div>
              )}
              <p className="text-[10px] px-1" style={{ color: "#ccc" }}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>
      <MessageInput onSend={addMsg} placeholder="Message the group…" />
    </div>
  );
}

// ── New Group Chat Sheet ───────────────────────────────────────────────────────

function NewGroupSheet({ onClose }: { onClose: () => void }) {
  const SUGGESTIONS = [
    { name: "Aminah C.", initial: "A", color: "#FF1F7D" },
    { name: "Sofia K.",  initial: "S", color: "#FF69B4" },
    { name: "Kelechi O.",initial: "K", color: "#FF69B4" },
    { name: "Zara F.",   initial: "Z", color: "#FF1F7D" },
    { name: "Naomi B.",  initial: "N", color: "#FF69B4" },
    { name: "Temi A.",   initial: "T", color: "#FF1F7D" },
  ];
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");

  function toggle(n: string) { setSelected((p) => { const s = new Set(p); s.has(n) ? s.delete(n) : s.add(n); return s; }); }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden" style={{ background: "white", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)", maxHeight: "75vh" }}>
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>
        <div className="px-6 pb-2">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#FF1F7D" }}>CREATE GROUP CHAT</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Group name (e.g. Morocco Girls)"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4"
            style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE", color: "#111" }}
          />
          <p className="text-xs font-bold mb-3" style={{ color: "#bbb" }}>SELECT WOMEN</p>
          <div className="flex flex-col gap-2.5 overflow-y-auto pb-4" style={{ maxHeight: "240px" }}>
            {SUGGESTIONS.map((s) => (
              <button key={s.name} onClick={() => toggle(s.name)}
                className="flex items-center gap-3 transition-all"
                style={{ opacity: 1 }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${s.color} 0%, ${s.color}BB 100%)` }}>
                  {s.initial}
                </div>
                <p className="flex-1 text-sm font-semibold text-left" style={{ color: "#111" }}>{s.name}</p>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: selected.has(s.name) ? "#FF1F7D" : "#ddd", background: selected.has(s.name) ? "#FF1F7D" : "transparent" }}>
                  {selected.has(s.name) && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><polyline points="2 6 5 9 10 3"/></svg>}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 pb-8">
          <button
            onClick={onClose}
            disabled={selected.size < 2 || !name.trim()}
            className="w-full py-4 rounded-full text-sm font-bold transition-all"
            style={selected.size >= 2 && name.trim() ? { background: "#FF1F7D", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.3)" } : { background: "#F0E0E8", color: "#C8A0B0" }}
          >
            {selected.size >= 2 ? `Create Group · ${selected.size} women` : "Select at least 2 women"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main Messages Page ────────────────────────────────────────────────────────

type View = "hub" | "thread" | "plan";

export default function MessagesPage() {
  const [view, setView] = useState<View>("hub");
  const [activeChat, setActiveChat] = useState<ChatEntry | null>(null);
  const [filter, setFilter] = useState<ChatType | "all">("all");
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [read, setRead] = useState<Set<number>>(new Set());

  function openChat(chat: ChatEntry) {
    setRead((p) => new Set([...p, chat.id]));
    setActiveChat(chat);
    setView("thread");
  }
  function openPlan() { setView("plan"); }
  function back() { setView("hub"); setActiveChat(null); }

  // ── Thread views ──
  if (view === "plan") return <PlanRoom onBack={back} />;
  if (view === "thread" && activeChat) {
    const msgs = THREADS[activeChat.id] ?? [];
    if (activeChat.type === "bloombay") return <BloomBayThread msgs={msgs} onBack={back} />;
    if (activeChat.type === "club")     return <ClubThread chat={activeChat} msgs={msgs} onBack={back} />;
    if (activeChat.type === "group")    return <GroupThread chat={activeChat} msgs={msgs} onBack={back} />;
    return <BloomieThread chat={activeChat} msgs={msgs} onBack={back} />;
  }

  const FILTERS: { label: string; value: ChatType | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Bloomies", value: "bloomie" },
    { label: "Clubs", value: "club" },
    { label: "Groups", value: "group" },
    { label: "BB HQ", value: "bloombay" },
  ];
  const shown = CHATS.filter((c) => filter === "all" || c.type === filter);
  const totalUnread = CHATS.reduce((s, c) => s + (read.has(c.id) ? 0 : c.unread), 0);

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-5 md:px-8 md:pt-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "#FF1F7D" }}>✦ INBOX</p>
            <div className="flex items-end gap-3">
              <h1 className="font-bold italic leading-none" style={{ color: "#111111", fontFamily: "var(--font-playfair)", fontSize: "clamp(42px,11vw,58px)" }}>
                Messages
              </h1>
              {totalUnread > 0 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white mb-2" style={{ background: "#FF1F7D" }}>
                  {totalUnread}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowNewGroup(true)}
            className="mt-2 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
            style={{ background: "#111111", color: "white" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Group
          </button>
        </div>
      </div>

      {/* Plan Room Door — entry to the plan room */}
      <div className="px-5 mb-5 md:px-8">
        <button
          onClick={openPlan}
          className="w-full relative overflow-hidden transition-all active:scale-[0.98]"
          style={{ borderRadius: "20px" }}
        >
          <div className="relative flex items-center gap-4 px-5 py-4" style={{ background: "#111111", minHeight: "88px" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(255,31,125,0.22) 0%, transparent 55%)" }} />
            {/* Door shape */}
            <div className="relative flex-shrink-0 w-12 h-16 rounded-t-full border-2 flex items-center justify-center" style={{ borderColor: "rgba(255,31,125,0.5)", background: "rgba(255,31,125,0.1)" }}>
              <div className="absolute right-1.5 top-1/2 w-1.5 h-4 rounded-full" style={{ background: "rgba(255,31,125,0.4)" }} />
              <span className="text-lg">✿</span>
            </div>
            <div className="flex-1 relative text-left">
              <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>PLAN ROOM</p>
              <p className="font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "white", fontSize: "16px" }}>
                Saturday in Soho
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>02 days · 7 confirmed</p>
            </div>
            <div className="flex-shrink-0 relative">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </button>
      </div>

      {/* Filter chips */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto md:px-8" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all active:scale-95"
            style={filter === f.value
              ? { background: "#111111", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }
              : { background: "white", color: "#555", border: "1.5px solid #E8E8E8" }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Chat list — visually distinct objects per type */}
      <div className="px-5 flex flex-col gap-2 md:px-8">
        {shown.map((chat) => {
          const isUnread = chat.unread > 0 && !read.has(chat.id);

          if (chat.type === "bloombay") return (
            <button key={chat.id} onClick={() => openChat(chat)}
              className="w-full rounded-2xl overflow-hidden text-left transition-all active:scale-[0.99]"
              style={{ background: "#111111", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
              <div className="relative px-4 py-4 flex items-start gap-3.5">
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 90% 50%, rgba(255,31,125,0.18) 0%, transparent 55%)" }} />
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-base flex-shrink-0 relative" style={{ background: "#FF1F7D" }}>✦</div>
                <div className="flex-1 min-w-0 relative">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold tracking-wider uppercase" style={{ color: "#FF69B4" }}>BLOOMBAY HQ</p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{chat.time}</p>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: isUnread ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)", fontWeight: isUnread ? 500 : 400 }}>
                    {chat.preview}
                  </p>
                </div>
                {isUnread && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: "#FF1F7D" }} />}
              </div>
            </button>
          );

          if (chat.type === "club") return (
            <button key={chat.id} onClick={() => openChat(chat)}
              className="w-full rounded-2xl p-4 flex items-start gap-3.5 text-left transition-all active:scale-[0.99]"
              style={{ background: isUnread ? "#FFF0F5" : "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderTop: `3px solid ${chat.color}` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-xs flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${chat.color} 0%, ${chat.color}CC 100%)` }}>
                {chat.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold" style={{ color: "#111", fontWeight: isUnread ? 700 : 600 }}>{chat.name}</p>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wider" style={{ background: `${chat.color}15`, color: chat.color }}>
                    {chat.members} MEMBERS
                  </span>
                </div>
                <p className="text-xs leading-relaxed line-clamp-1" style={{ color: isUnread ? "#555" : "#aaa" }}>{chat.preview}</p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <p className="text-[10px]" style={{ color: "#bbb" }}>{chat.time}</p>
                {isUnread && <div className="w-2 h-2 rounded-full" style={{ background: "#FF1F7D" }} />}
              </div>
            </button>
          );

          if (chat.type === "group") return (
            <button key={chat.id} onClick={() => openChat(chat)}
              className="w-full rounded-2xl p-4 flex items-start gap-3.5 text-left transition-all active:scale-[0.99]"
              style={{ background: isUnread ? "#FFF5F8" : "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: "3px solid #FF69B4" }}>
              {/* Stacked mini avatars */}
              <div className="flex items-center flex-shrink-0" style={{ width: "44px", position: "relative", height: "44px" }}>
                {["Z","S","A"].map((a, i) => (
                  <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white absolute border-2 border-white"
                    style={{ background: i === 0 ? "#FF1F7D" : "#FF69B4", left: `${i * 10}px`, zIndex: 3 - i, top: "9px" }}>
                    {a}
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-sm font-bold" style={{ color: "#111", fontWeight: isUnread ? 700 : 600 }}>{chat.name}</p>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#FFE0EE", color: "#FF1F7D" }}>GROUP</span>
                </div>
                <p className="text-xs line-clamp-1" style={{ color: isUnread ? "#555" : "#aaa" }}>{chat.preview}</p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <p className="text-[10px]" style={{ color: "#bbb" }}>{chat.time}</p>
                {isUnread && <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "#FF1F7D" }}>{chat.unread}</div>}
              </div>
            </button>
          );

          // Bloomie — most intimate treatment
          return (
            <button key={chat.id} onClick={() => openChat(chat)}
              className="w-full rounded-2xl p-4 flex items-start gap-3.5 text-left transition-all active:scale-[0.99]"
              style={{ background: isUnread ? "#FFF8FC" : "white", boxShadow: isUnread ? "0 4px 16px rgba(255,31,125,0.09)" : "0 2px 10px rgba(0,0,0,0.05)" }}>
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${chat.color} 0%, ${chat.color}BB 100%)`, boxShadow: isUnread ? `0 3px 10px ${chat.color}44` : "none" }}>
                  {chat.initial}
                </div>
                {isUnread && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white" style={{ background: "#FF1F7D" }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm italic" style={{ fontFamily: "var(--font-playfair)", color: "#111", fontWeight: isUnread ? 700 : 500, fontStyle: "italic" }}>{chat.name}</p>
                  <p className="text-[10px]" style={{ color: "#bbb" }}>{chat.time}</p>
                </div>
                <p className="text-xs leading-relaxed line-clamp-1" style={{ color: isUnread ? "#444" : "#aaa" }}>{chat.preview}</p>
              </div>
            </button>
          );
        })}
      </div>

      {showNewGroup && <NewGroupSheet onClose={() => setShowNewGroup(false)} />}
    </div>
  );
}
