"use client";

import { useState } from "react";
import Link from "next/link";

type MsgType = "bloomie" | "club" | "bloombay";

interface Message {
  id: number;
  type: MsgType;
  from: string;
  initial: string;
  color: string;
  preview: string;
  time: string;
  unread: boolean;
}

const MESSAGES: Message[] = [
  {
    id: 1, type: "bloombay", from: "BloomBay", initial: "✦", color: "#FF1F7D",
    preview: "Jollof + Movie Night Friday is filling up fast — 3 seats left.",
    time: "2m ago", unread: true,
  },
  {
    id: 2, type: "bloomie", from: "Aminah C.", initial: "A", color: "#FF1F7D",
    preview: "Are you going Friday?? I saved you a seat at my table 🌸",
    time: "14m ago", unread: true,
  },
  {
    id: 3, type: "club", from: "African Girls Club", initial: "AG", color: "#FF69B4",
    preview: "New event posted: Afrobeats Night at SOB's — Saturday 10PM.",
    time: "1h ago", unread: true,
  },
  {
    id: 4, type: "bloomie", from: "Sofia K.", initial: "S", color: "#FF69B4",
    preview: "That pilates class was SO good. Same time next week?",
    time: "3h ago", unread: false,
  },
  {
    id: 5, type: "club", from: "Soft Life Club", initial: "SL", color: "#FF1F7D",
    preview: "Sunday brunch confirmed! Arrive by 11:15 — table is booked under Amanda.",
    time: "5h ago", unread: false,
  },
  {
    id: 6, type: "bloombay", from: "BloomBay", initial: "✦", color: "#FF1F7D",
    preview: "Kelechi stamped your Girl Pick for Ayo's Kitchen. She said you were right.",
    time: "1d ago", unread: false,
  },
  {
    id: 7, type: "bloomie", from: "Kelechi O.", initial: "K", color: "#FF69B4",
    preview: "The jollof was unreal. Thank you for the rec 🙏",
    time: "1d ago", unread: false,
  },
];

const FILTERS: { label: string; value: MsgType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Bloomies", value: "bloomie" },
  { label: "Clubs", value: "club" },
  { label: "BloomBay", value: "bloombay" },
];

function MessageAvatar({ type, initial, color }: { type: MsgType; initial: string; color: string }) {
  if (type === "bloombay") {
    return (
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-base"
        style={{
          background: "#111111",
          color: "#FF69B4",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          letterSpacing: "0",
        }}
      >
        ✦
      </div>
    );
  }
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm text-white"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}BB 100%)`,
        boxShadow: `0 2px 8px ${color}44`,
      }}
    >
      {initial}
    </div>
  );
}

function TypeBadge({ type }: { type: MsgType }) {
  if (type === "bloombay") return (
    <span
      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
      style={{ background: "#111111", color: "#FF69B4" }}
    >
      BB
    </span>
  );
  if (type === "club") return (
    <span
      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
      style={{ background: "#FFE0EE", color: "#FF1F7D" }}
    >
      Club
    </span>
  );
  return null;
}

const THREAD_MESSAGES: Record<number, { from: string; text: string; mine: boolean; time: string }[]> = {
  1: [
    { from: "BloomBay", text: "Jollof + Movie Night Friday is filling up fast — 3 seats left.", mine: false, time: "2m ago" },
    { from: "You", text: "I want to go! How do I grab a seat?", mine: true, time: "1m ago" },
    { from: "BloomBay", text: "Head to Happenings → Open Seats to reserve your spot. See you Friday ✦", mine: false, time: "just now" },
  ],
  2: [
    { from: "Aminah C.", text: "Are you going Friday?? I saved you a seat at my table 🌸", mine: false, time: "14m ago" },
    { from: "You", text: "YES omg, what are you wearing", mine: true, time: "10m ago" },
    { from: "Aminah C.", text: "Something pink obviously. Meet me at the door at 7?", mine: false, time: "8m ago" },
  ],
  3: [
    { from: "African Girls Club", text: "New event posted: Afrobeats Night at SOB's — Saturday 10PM.", mine: false, time: "1h ago" },
  ],
  4: [
    { from: "Sofia K.", text: "That pilates class was SO good. Same time next week?", mine: false, time: "3h ago" },
    { from: "You", text: "Absolutely. Already blocked my calendar.", mine: true, time: "2h ago" },
    { from: "Sofia K.", text: "Perfect. I'll book us both. You'll never want to go alone again lol", mine: false, time: "2h ago" },
  ],
  5: [
    { from: "Soft Life Club", text: "Sunday brunch confirmed! Arrive by 11:15 — table is booked under Amanda.", mine: false, time: "5h ago" },
  ],
  6: [
    { from: "BloomBay", text: "Kelechi stamped your Girl Pick for Ayo's Kitchen. She said you were right.", mine: false, time: "1d ago" },
  ],
  7: [
    { from: "Kelechi O.", text: "The jollof was unreal. Thank you for the rec 🙏", mine: false, time: "1d ago" },
    { from: "You", text: "Told you!! It's the best kept secret in Brooklyn.", mine: true, time: "23h ago" },
    { from: "Kelechi O.", text: "I'm already planning to go back with 6 more girls. You're legendary for this.", mine: false, time: "22h ago" },
  ],
};

export default function MessagesPage() {
  const [filter, setFilter] = useState<MsgType | "all">("all");
  const [read, setRead] = useState<Set<number>>(new Set());
  const [openThread, setOpenThread] = useState<number | null>(null);

  const shown = MESSAGES.filter((m) => filter === "all" || m.type === filter);
  const unreadCount = MESSAGES.filter((m) => m.unread && !read.has(m.id)).length;

  function openMsg(id: number) {
    setRead((p) => new Set([...p, id]));
    setOpenThread(id);
  }

  const activeMsg = openThread ? MESSAGES.find((m) => m.id === openThread) : null;
  const thread = openThread ? THREAD_MESSAGES[openThread] ?? [] : [];

  if (activeMsg) {
    return (
      <div className="min-h-screen flex flex-col pb-24 md:pb-0" style={{ background: "var(--pale-pink-bg)" }}>
        {/* Thread header */}
        <div className="px-5 pt-14 pb-4 md:px-8 md:pt-10 flex items-center gap-3" style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
          <button
            onClick={() => setOpenThread(null)}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--light-pink)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <MessageAvatar type={activeMsg.type} initial={activeMsg.initial} color={activeMsg.color} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ color: "#111111" }}>{activeMsg.from}</p>
            <p className="text-xs" style={{ color: "#bbb" }}>
              {activeMsg.type === "club" ? "Club" : activeMsg.type === "bloombay" ? "BloomBay" : "Bloomie"}
            </p>
          </div>
        </div>

        {/* Thread messages */}
        <div className="flex-1 px-5 md:px-8 py-6 flex flex-col gap-4 overflow-y-auto">
          {thread.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.mine ? "flex-row-reverse" : ""}`}>
              {!msg.mine && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 self-end"
                     style={{ background: activeMsg.color }}>
                  {activeMsg.initial}
                </div>
              )}
              <div className={`max-w-[72%] px-4 py-3 rounded-2xl ${msg.mine ? "rounded-br-md" : "rounded-bl-md"}`}
                   style={{ background: msg.mine ? "#FF1F7D" : "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <p className="text-sm leading-relaxed" style={{ color: msg.mine ? "white" : "#111111" }}>{msg.text}</p>
                <p className="text-[10px] mt-1" style={{ color: msg.mine ? "rgba(255,255,255,0.6)" : "#ccc" }}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply bar */}
        <div className="px-5 md:px-8 py-4 flex items-center gap-3" style={{ background: "white", borderTop: "1px solid #F5F5F5" }}>
          <input
            type="text"
            placeholder="Send a message…"
            className="flex-1 px-4 py-3 rounded-full text-sm outline-none"
            style={{ background: "#FFF5F8", color: "#111111", border: "1.5px solid #FFE0EE" }}
          />
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#FF1F7D" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-5 md:px-8 md:pt-10">
        <div className="flex items-start gap-3">
          <Link
            href="/member/home"
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
            style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div className="flex-1">
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--bb-pink)" }}>INBOX</p>
            <div className="flex items-center gap-3">
              <h1 className="font-bold italic leading-none" style={{ color: "var(--bb-black)", fontFamily: "var(--font-playfair)", fontSize: "clamp(40px, 11vw, 56px)" }}>
                Messages
              </h1>
              {unreadCount > 0 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white self-end mb-1" style={{ background: "var(--bb-pink)", boxShadow: "0 2px 8px rgba(255,31,125,0.35)" }}>
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-5 mb-5 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 active:scale-95"
            style={filter === f.value
              ? { background: "#111111", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }
              : { background: "white", color: "#555555", border: "1.5px solid #E8E8E8" }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Message list */}
      <div className="px-5 flex flex-col gap-2">
        {shown.map((msg) => {
          const isUnread = msg.unread && !read.has(msg.id);
          return (
            <button
              key={msg.id}
              onClick={() => openMsg(msg.id)}
              className="w-full rounded-2xl p-4 flex items-start gap-3.5 text-left transition-all active:scale-[0.99]"
              style={{
                background: isUnread ? "#FFF0F5" : "white",
                boxShadow: isUnread ? "0 4px 16px rgba(255,31,125,0.10)" : "0 2px 10px rgba(0,0,0,0.05)",
                borderLeft: isUnread ? "3px solid #FF1F7D" : "3px solid transparent",
              }}
            >
              <MessageAvatar type={msg.type} initial={msg.initial} color={msg.color} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-sm leading-none" style={{ color: "var(--bb-black)", fontWeight: isUnread ? 700 : 500 }}>
                    {msg.from}
                  </p>
                  <TypeBadge type={msg.type} />
                </div>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: isUnread ? "#333333" : "#999999" }}>
                  {msg.preview}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0 pt-0.5">
                <p className="text-[11px]" style={{ color: "#BBBBBB" }}>{msg.time}</p>
                {isUnread && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--bb-pink)" }} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
