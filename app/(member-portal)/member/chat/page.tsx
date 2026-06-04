"use client";

import { useState } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────────

type ConvoType = "plan" | "club" | "direct" | "group" | "event";

interface Convo {
  id: number;
  type: ConvoType;
  name: string;
  initial: string;
  color: string;
  preview: string;
  time: string;
  unread: number;
  subtitle?: string;
}

// ── Sample data ────────────────────────────────────────────────────────────────

const CONVOS: Convo[] = [
  {
    id: 1,
    type: "plan",
    name: "Morocco October",
    initial: "M",
    color: "#FF1F7D",
    preview: "Aaliyah: Who's booking flights?",
    time: "2m",
    unread: 3,
    subtitle: "Plan Room · 6 women",
  },
  {
    id: 2,
    type: "direct",
    name: "Maya",
    initial: "Ma",
    color: "#FF69B4",
    preview: "Are you going to the rooftop thing?",
    time: "18m",
    unread: 1,
    subtitle: "Direct · Bloomie",
  },
  {
    id: 3,
    type: "group",
    name: "Travel Girls",
    initial: "TG",
    color: "#FF1F7D",
    preview: "Jade: New date — Sept 12",
    time: "1h",
    unread: 2,
    subtitle: "Group · 8 women",
  },
  {
    id: 4,
    type: "plan",
    name: "Dinner Society",
    initial: "DS",
    color: "#FF69B4",
    preview: "Confirmed for Saturday ✓",
    time: "3h",
    unread: 0,
    subtitle: "Plan Room · 5 women",
  },
  {
    id: 5,
    type: "club",
    name: "Tech Women NYC",
    initial: "TW",
    color: "#FF1F7D",
    preview: "New post in #founders",
    time: "4h",
    unread: 0,
    subtitle: "Club · 112 members",
  },
  {
    id: 6,
    type: "event",
    name: "Girl Bar — Night Owl",
    initial: "GB",
    color: "#FF69B4",
    preview: "Great conversation last night 🌙",
    time: "1d",
    unread: 0,
    subtitle: "Event Chat",
  },
];

// ── Filter config ──────────────────────────────────────────────────────────────

type Filter = "all" | ConvoType;

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Plan Rooms", value: "plan" },
  { label: "Clubs", value: "club" },
  { label: "Direct", value: "direct" },
  { label: "Groups", value: "group" },
];

// ── Type badge color ───────────────────────────────────────────────────────────

function typeLabel(type: ConvoType): string {
  switch (type) {
    case "plan":   return "Plan";
    case "club":   return "Club";
    case "direct": return "DM";
    case "group":  return "Group";
    case "event":  return "Event";
  }
}

function typeBadgeStyle(type: ConvoType): React.CSSProperties {
  const base: React.CSSProperties = {
    fontSize: "8px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    padding: "2px 6px",
    borderRadius: "100px",
    textTransform: "uppercase",
    lineHeight: 1.4,
    flexShrink: 0,
  };
  switch (type) {
    case "plan":
      return { ...base, background: "#FFF0F5", color: "#FF1F7D", border: "1px solid #FFD6E8" };
    case "club":
      return { ...base, background: "#F5F0FF", color: "#8B5CF6", border: "1px solid #DDD6FE" };
    case "direct":
      return { ...base, background: "#F0FFF5", color: "#16A34A", border: "1px solid #BBF7D0" };
    case "group":
      return { ...base, background: "#FFF8F0", color: "#EA580C", border: "1px solid #FED7AA" };
    case "event":
      return { ...base, background: "#F0F8FF", color: "#0284C7", border: "1px solid #BAE6FD" };
  }
}

// ── New Group Chat bottom sheet ────────────────────────────────────────────────

function NewGroupSheet({ onClose }: { onClose: () => void }) {
  const SUGGESTIONS = [
    { name: "Aaliyah M.", initial: "A", color: "#FF1F7D" },
    { name: "Maya S.",    initial: "Ma", color: "#FF69B4" },
    { name: "Jade K.",    initial: "J",  color: "#FF1F7D" },
    { name: "Sofia W.",   initial: "S",  color: "#FF69B4" },
    { name: "Naomi B.",   initial: "N",  color: "#FF1F7D" },
    { name: "Temi A.",    initial: "T",  color: "#FF69B4" },
  ];
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState("");

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.42)" }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{
          background: "var(--card-bg, white)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.14)",
          maxHeight: "78vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
        </div>

        {/* Header */}
        <div className="px-6 pb-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--card-border, #F0F0F0)" }}>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>
            Create Group Chat
          </p>
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name (e.g. Morocco Girls)"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none mt-2"
            style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE", color: "var(--text-color, #111)" }}
          />
        </div>

        {/* Suggestions */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "var(--text-muted, #bbb)" }}>
            Select Women
          </p>
          <div className="flex flex-col gap-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.name}
                onClick={() => toggle(s.name)}
                className="w-full flex items-center gap-3 py-2.5 transition-all active:scale-[0.98]"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 text-xs"
                  style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}BB)` }}
                >
                  {s.initial}
                </div>
                <p className="flex-1 text-sm font-semibold text-left" style={{ color: "var(--heading-color, #111)" }}>
                  {s.name}
                </p>
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    borderColor: selected.has(s.name) ? "#FF1F7D" : "#DDD",
                    background: selected.has(s.name) ? "#FF1F7D" : "transparent",
                  }}
                >
                  {selected.has(s.name) && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5">
                      <polyline points="2 6 5 9 10 3" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-8 pt-3 flex-shrink-0" style={{ borderTop: "1px solid var(--card-border, #F0F0F0)" }}>
          <button
            onClick={() => {
              if (selected.size >= 2 && groupName.trim()) {
                alert(`Group "${groupName}" created with ${selected.size} women!`);
                onClose();
              }
            }}
            disabled={selected.size < 2 || !groupName.trim()}
            className="w-full py-4 rounded-full text-sm font-bold transition-all"
            style={
              selected.size >= 2 && groupName.trim()
                ? { background: "#FF1F7D", color: "white", boxShadow: "0 4px 16px rgba(255,31,125,0.3)" }
                : { background: "#F5E8EE", color: "#C8A0B0" }
            }
          >
            {selected.size >= 2
              ? `Create Group · ${selected.size} women`
              : "Select at least 2 women"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Conversation row ───────────────────────────────────────────────────────────

function ConvoRow({
  convo,
  isUnread,
  isLast,
  onClick,
}: {
  convo: Convo;
  isUnread: boolean;
  isLast: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3.5 px-5 py-3.5 text-left transition-all active:scale-[0.98] active:bg-pink-50"
      style={isLast ? undefined : { borderBottom: "1px solid var(--card-border, rgba(0,0,0,0.05))" }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${convo.color}, ${convo.color}BB)`,
            fontSize: convo.initial.length > 1 ? "11px" : "15px",
            boxShadow: isUnread
              ? `0 0 0 2px ${convo.color}, 0 0 0 4px var(--pale-pink-bg)`
              : "none",
          }}
        >
          {convo.initial}
        </div>
        {isUnread && (
          <div
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center"
            style={{ background: "#FF1F7D", boxShadow: "0 1px 4px rgba(255,31,125,0.55)" }}
          >
            <span className="text-[9px] font-black text-white leading-none px-1">
              {convo.unread}
            </span>
          </div>
        )}
      </div>

      {/* Text block */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p
            className="text-sm truncate leading-tight"
            style={{
              color: "var(--heading-color, #111111)",
              fontWeight: isUnread ? 700 : 500,
              flex: "1 1 0",
              minWidth: 0,
            }}
          >
            {convo.name}
          </p>
          <span style={typeBadgeStyle(convo.type)}>{typeLabel(convo.type)}</span>
          <span
            className="text-[10px] flex-shrink-0"
            style={{ color: "var(--text-muted, #bbb)" }}
          >
            {convo.time}
          </span>
        </div>
        <p
          className="text-xs truncate leading-relaxed"
          style={{
            color: isUnread ? "var(--text-color, #555)" : "var(--text-muted, #bbb)",
            fontWeight: isUnread ? 500 : 400,
          }}
        >
          {convo.preview}
        </p>
      </div>

      {/* Chevron */}
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(180,140,140,0.5)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="flex-shrink-0"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}

// ── Main Chat Page ─────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [read, setRead] = useState<Set<number>>(new Set());

  function markRead(id: number) {
    setRead((prev) => new Set([...prev, id]));
  }

  function handleOpen(convo: Convo) {
    markRead(convo.id);
    alert(`Opening "${convo.name}" chat — full chat view coming soon.`);
  }

  const shown = CONVOS.filter(
    (c) => filter === "all" || c.type === filter
  );

  const totalUnread = CONVOS.reduce(
    (sum, c) => sum + (read.has(c.id) ? 0 : c.unread),
    0
  );

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--pale-pink-bg)" }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-5 pt-14 pb-5 md:px-8 md:pt-10">
        <div className="flex items-center gap-3 mb-3">
          <Link
            href="/member/home"
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,0,0,0.06)" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(0,0,0,0.45)"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>

          <div className="flex-1">
            <p
              className="text-[10px] font-bold tracking-[0.22em] uppercase"
              style={{ color: "#FF1F7D" }}
            >
              ✦ CHAT
            </p>
            <div className="flex items-center gap-2">
              <h1
                className="font-bold italic leading-none"
                style={{
                  color: "var(--heading-color, #111111)",
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(38px,10vw,52px)",
                }}
              >
                Conversations.
              </h1>
            </div>
          </div>

          {totalUnread > 0 && (
            <span
              className="text-[9px] font-bold px-2.5 py-1 rounded-full text-white self-start mt-6 flex-shrink-0"
              style={{ background: "#FF1F7D" }}
            >
              {totalUnread} new
            </span>
          )}
        </div>

        {/* Create Group Chat shortcut */}
        <button
          onClick={() => setShowNewGroup(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95"
          style={{
            background: "white",
            border: "1.5px solid #FFD6E8",
            color: "#FF1F7D",
            boxShadow: "0 1px 6px rgba(255,31,125,0.08)",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF1F7D"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Create Group Chat
        </button>
      </div>

      {/* ── Filter tabs ────────────────────────────────────────────────────── */}
      <div
        className="px-5 mb-4 flex gap-2 overflow-x-auto md:px-8"
        style={{ scrollbarWidth: "none" }}
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all active:scale-95"
            style={
              filter === f.value
                ? { background: "#111111", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }
                : { background: "var(--card-bg, white)", color: "var(--text-color, #555)", border: "1.5px solid var(--card-border, #E8E8E8)" }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Conversation list ───────────────────────────────────────────────── */}
      {shown.length > 0 ? (
        <div
          className="mx-5 md:mx-8 rounded-3xl overflow-hidden"
          style={{
            background: "var(--card-bg, white)",
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          }}
        >
          {shown.map((convo, idx) => (
            <ConvoRow
              key={convo.id}
              convo={convo}
              isUnread={convo.unread > 0 && !read.has(convo.id)}
              isLast={idx === shown.length - 1}
              onClick={() => handleOpen(convo)}
            />
          ))}
        </div>
      ) : (
        <div className="mx-5 md:mx-8 rounded-3xl py-14 flex flex-col items-center gap-3"
          style={{ background: "var(--card-bg, white)", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
            style={{ background: "#FFF0F5" }}
          >
            💬
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-muted, #aaa)" }}>
            No conversations here yet
          </p>
          <p className="text-xs text-center px-8" style={{ color: "var(--text-muted, #ccc)" }}>
            Start a new group chat or join a Plan Room to get talking.
          </p>
        </div>
      )}

      {/* ── New Group Sheet ─────────────────────────────────────────────────── */}
      {showNewGroup && <NewGroupSheet onClose={() => setShowNewGroup(false)} />}

      {/* ── FAB: New conversation ────────────────────────────────────────────── */}
      <button
        onClick={() => alert("Start a new conversation — coming soon.")}
        className="fixed flex items-center justify-center transition-all active:scale-90"
        style={{
          bottom: "88px",
          right: "20px",
          width: "54px",
          height: "54px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FF1F7D, #FF69B4)",
          boxShadow: "0 6px 20px rgba(255,31,125,0.4)",
          zIndex: 30,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}
