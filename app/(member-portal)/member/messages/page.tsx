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

export default function MessagesPage() {
  const [filter, setFilter] = useState<MsgType | "all">("all");
  const [read, setRead] = useState<Set<number>>(new Set());
  const [showComposedToast, setShowComposedToast] = useState(false);

  const shown = MESSAGES.filter((m) => filter === "all" || m.type === filter);
  const unreadCount = MESSAGES.filter((m) => m.unread && !read.has(m.id)).length;

  function handleCompose() {
    setShowComposedToast(true);
    setTimeout(() => setShowComposedToast(false), 2400);
  }

  return (
    <div className="min-h-screen pb-36" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header — large Playfair italic + pink unread badge */}
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
            <p
              className="text-xs font-bold tracking-widest uppercase mb-1"
              style={{ color: "var(--bb-pink)" }}
            >
              INBOX
            </p>
            <div className="flex items-center gap-3">
              <h1
                className="font-bold italic leading-none"
                style={{
                  color: "var(--bb-black)",
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(40px, 11vw, 56px)",
                }}
              >
                Messages
              </h1>
              {unreadCount > 0 && (
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full text-white self-end mb-1"
                  style={{ background: "var(--bb-pink)", boxShadow: "0 2px 8px rgba(255,31,125,0.35)" }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter chips — smooth transitions */}
      <div className="px-5 mb-5 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 active:scale-95"
            style={
              filter === f.value
                ? { background: "#111111", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }
                : { background: "white", color: "#555555", border: "1.5px solid #E8E8E8" }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Message list — full cards with shadows */}
      <div className="px-5 flex flex-col gap-2">
        {shown.map((msg) => {
          const isUnread = msg.unread && !read.has(msg.id);
          return (
            <button
              key={msg.id}
              onClick={() => setRead((p) => new Set([...p, msg.id]))}
              className="w-full rounded-2xl p-4 flex items-start gap-3.5 text-left transition-all active:scale-[0.99]"
              style={{
                background: isUnread ? "#FFF0F5" : "white",
                boxShadow: isUnread
                  ? "0 4px 16px rgba(255,31,125,0.10)"
                  : "0 2px 10px rgba(0,0,0,0.05)",
                borderLeft: isUnread ? "3px solid #FF1F7D" : "3px solid transparent",
              }}
            >
              <MessageAvatar type={msg.type} initial={msg.initial} color={msg.color} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <p
                    className="text-sm leading-none"
                    style={{
                      color: "var(--bb-black)",
                      fontWeight: isUnread ? 700 : 500,
                    }}
                  >
                    {msg.from}
                  </p>
                  <TypeBadge type={msg.type} />
                </div>
                <p
                  className="text-xs leading-relaxed line-clamp-2"
                  style={{ color: isUnread ? "#333333" : "#999999" }}
                >
                  {msg.preview}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0 pt-0.5">
                <p className="text-[11px]" style={{ color: "#BBBBBB" }}>{msg.time}</p>
                {isUnread && (
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: "var(--bb-pink)" }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Compose FAB — bottom right */}
      <button
        onClick={handleCompose}
        className="fixed bottom-28 right-5 w-14 h-14 rounded-full flex items-center justify-center z-40 transition-all active:scale-90"
        style={{
          background: "#111111",
          boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
        }}
        aria-label="Compose message"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>

      {/* Toast — bottom-center, smooth slide-up */}
      {showComposedToast && (
        <div
          className="fixed bottom-24 left-1/2 z-50 px-6 py-3.5 rounded-full text-sm font-semibold text-white"
          style={{
            background: "#111111",
            transform: "translateX(-50%)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
            animation: "slideUp 0.25s ease-out",
          }}
        >
          Messaging coming soon ✦
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
