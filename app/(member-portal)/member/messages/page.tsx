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

function TypeIcon({ type, initial, color }: { type: MsgType; initial: string; color: string }) {
  if (type === "bloombay") {
    return (
      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ background: "#111111" }}>
        ✦
      </div>
    );
  }
  return (
    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ background: color }}>
      {initial}
    </div>
  );
}

function TypeBadge({ type }: { type: MsgType }) {
  if (type === "bloombay") return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide" style={{ background: "#111111", color: "white" }}>BB</span>
  );
  if (type === "club") return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide" style={{ background: "#FFE0EE", color: "#FF1F7D" }}>Club</span>
  );
  return null;
}

export default function MessagesPage() {
  const [filter, setFilter] = useState<MsgType | "all">("all");
  const [read, setRead] = useState<Set<number>>(new Set());

  const shown = MESSAGES.filter((m) => filter === "all" || m.type === filter);
  const unreadCount = MESSAGES.filter((m) => m.unread && !read.has(m.id)).length;

  return (
    <div className="min-h-screen pb-36" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link
          href="/member/home"
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "white" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: "var(--bb-black)", fontFamily: "var(--font-playfair)" }}>
            Messages
          </h1>
        </div>
        {unreadCount > 0 && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "var(--bb-pink)" }}>
            {unreadCount} new
          </span>
        )}
      </div>

      {/* Filter chips */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0"
            style={
              filter === f.value
                ? { background: "#111111", color: "white" }
                : { background: "white", color: "#111111", border: "1.5px solid #E8E8E8" }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Message list */}
      <div className="px-5 flex flex-col gap-1.5">
        {shown.map((msg) => {
          const isUnread = msg.unread && !read.has(msg.id);
          return (
            <button
              key={msg.id}
              onClick={() => setRead((p) => new Set([...p, msg.id]))}
              className="w-full rounded-2xl p-4 flex items-start gap-3 text-left transition-all active:scale-[0.98]"
              style={{
                background: isUnread ? "#FFF0F5" : "white",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              }}
            >
              <TypeIcon type={msg.type} initial={msg.initial} color={msg.color} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="font-bold text-sm leading-none" style={{ color: "var(--bb-black)", fontWeight: isUnread ? 700 : 500 }}>
                    {msg.from}
                  </p>
                  <TypeBadge type={msg.type} />
                </div>
                <p className="text-xs leading-relaxed mt-0.5 line-clamp-2" style={{ color: isUnread ? "#333" : "#888" }}>
                  {msg.preview}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <p className="text-[11px] text-gray-400">{msg.time}</p>
                {isUnread && (
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--bb-pink)" }} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
