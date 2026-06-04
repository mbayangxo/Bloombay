"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────────

type ConvoType = "plan" | "club" | "direct" | "group" | "event";
type View = "list" | "thread";

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

interface Message {
  id: number;
  sender: string;
  initial: string;
  color: string;
  text: string;
  time: string;
  isMe?: boolean;
}

// ── Sample data ────────────────────────────────────────────────────────────────

const CONVOS: Convo[] = [
  { id: 1, type: "plan",   name: "Morocco October",  initial: "M",  color: "#FF1F7D", preview: "Aaliyah: Who's booking flights?",        time: "2m",  unread: 3, subtitle: "Plan Room · 6 women" },
  { id: 2, type: "direct", name: "Maya",              initial: "Ma", color: "#FF69B4", preview: "Are you going to the rooftop thing?",    time: "18m", unread: 1, subtitle: "Direct · Bloomie" },
  { id: 3, type: "group",  name: "Travel Girls",      initial: "TG", color: "#FF1F7D", preview: "Jade: New date — Sept 12",               time: "1h",  unread: 2, subtitle: "Group · 8 women" },
  { id: 4, type: "plan",   name: "Dinner Society",    initial: "DS", color: "#FF69B4", preview: "Confirmed for Saturday ✓",               time: "3h",  unread: 0, subtitle: "Plan Room · 5 women" },
  { id: 5, type: "club",   name: "Tech Women NYC",    initial: "TW", color: "#FF1F7D", preview: "New post in #founders",                  time: "4h",  unread: 0, subtitle: "Club · 112 members" },
  { id: 6, type: "event",  name: "Girl Bar — Night Owl", initial: "GB", color: "#FF69B4", preview: "Great conversation last night 🌙",  time: "1d",  unread: 0, subtitle: "Event Chat" },
];

const THREAD_MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, sender: "Aaliyah M.", initial: "A", color: "#FF1F7D", text: "Who's booking flights? We should probably coordinate", time: "9:12 AM" },
    { id: 2, sender: "Jade K.",    initial: "J", color: "#FF69B4", text: "I was thinking we do it together — better prices on group deals", time: "9:14 AM" },
    { id: 3, sender: "Nadia S.",   initial: "N", color: "#A855F7", text: "Skyscanner has a group tool 👀", time: "9:15 AM" },
    { id: 4, sender: "Me",         initial: "Y", color: "#FF1F7D", text: "Yes! Let's pick a weekend to book together. I'm thinking flights first week of Oct", time: "9:17 AM", isMe: true },
    { id: 5, sender: "Aaliyah M.", initial: "A", color: "#FF1F7D", text: "Oct 3rd works for me. Flying from JFK", time: "9:18 AM" },
    { id: 6, sender: "Me",         initial: "Y", color: "#FF1F7D", text: "Same ✈️ Should we do a quick call this week?", time: "9:20 AM", isMe: true },
  ],
  2: [
    { id: 1, sender: "Maya", initial: "Ma", color: "#FF69B4", text: "Are you going to the rooftop thing tonight?", time: "7:42 PM" },
    { id: 2, sender: "Me",   initial: "Y", color: "#FF1F7D", text: "I was thinking about it! Are you?", time: "7:45 PM", isMe: true },
    { id: 3, sender: "Maya", initial: "Ma", color: "#FF69B4", text: "100% going. Meet there at 9?", time: "7:46 PM" },
    { id: 4, sender: "Me",   initial: "Y", color: "#FF1F7D", text: "Perfect 🌙 See you there", time: "7:48 PM", isMe: true },
  ],
  3: [
    { id: 1, sender: "Jade K.",  initial: "J", color: "#FF69B4", text: "New date — Sept 12. Does that work for everyone?", time: "2:30 PM" },
    { id: 2, sender: "Temi A.",  initial: "T", color: "#FF1F7D", text: "Works for me!", time: "2:35 PM" },
    { id: 3, sender: "Sofia W.", initial: "S", color: "#A855F7", text: "I'm in 🙌", time: "2:38 PM" },
    { id: 4, sender: "Me",       initial: "Y", color: "#FF1F7D", text: "Sept 12 is perfect. Adding it to my calendar now", time: "2:40 PM", isMe: true },
  ],
  4: [
    { id: 1, sender: "Dinner Society", initial: "DS", color: "#FF69B4", text: "Just confirming everyone for Saturday — Ladurée SoHo, 8PM", time: "10:00 AM" },
    { id: 2, sender: "Me",             initial: "Y", color: "#FF1F7D", text: "Confirmed ✓ So excited", time: "10:05 AM", isMe: true },
    { id: 3, sender: "Dinner Society", initial: "DS", color: "#FF69B4", text: "Confirmed for Saturday ✓ See you all there 🌸", time: "10:06 AM" },
  ],
  5: [
    { id: 1, sender: "Tech Women NYC", initial: "TW", color: "#FF1F7D", text: "New post in #founders — 'Pitching without apology' — check it out", time: "3 hours ago" },
    { id: 2, sender: "Naomi B.",        initial: "N", color: "#FF69B4", text: "This is so good. Bookmarking", time: "2 hours ago" },
    { id: 3, sender: "Me",              initial: "Y", color: "#FF1F7D", text: "Exactly what I needed to read today 🙏", time: "1 hour ago", isMe: true },
  ],
  6: [
    { id: 1, sender: "Kezia A.", initial: "K", color: "#FF69B4", text: "Great conversation last night 🌙 That rooftop was everything", time: "Yesterday" },
    { id: 2, sender: "Priya R.", initial: "P", color: "#A855F7", text: "Honestly one of the best nights this year. We need a sequel", time: "Yesterday" },
    { id: 3, sender: "Me",       initial: "Y", color: "#FF1F7D", text: "Sequel confirmed. Someone find a rooftop 😂", time: "Yesterday", isMe: true },
  ],
};

// ── Filter config ──────────────────────────────────────────────────────────────

type Filter = "all" | ConvoType;

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All",    value: "all"    },
  { label: "Clubs",  value: "club"   },
  { label: "Direct", value: "direct" },
  { label: "Groups", value: "group"  },
];

function typeLabel(type: ConvoType): string {
  return { plan: "Plan", club: "Club", direct: "DM", group: "Group", event: "Event" }[type];
}

function typeBadgeStyle(type: ConvoType): React.CSSProperties {
  const base: React.CSSProperties = { fontSize: "8px", fontWeight: 800, letterSpacing: "0.08em", padding: "2px 6px", borderRadius: "100px", textTransform: "uppercase", lineHeight: 1.4, flexShrink: 0 };
  const themes: Record<ConvoType, React.CSSProperties> = {
    plan:   { background: "#FFF0F5", color: "#FF1F7D", border: "1px solid #FFD6E8" },
    club:   { background: "#F5F0FF", color: "#8B5CF6", border: "1px solid #DDD6FE" },
    direct: { background: "#F0FFF5", color: "#16A34A", border: "1px solid #BBF7D0" },
    group:  { background: "#FFF8F0", color: "#EA580C", border: "1px solid #FED7AA" },
    event:  { background: "#F0F8FF", color: "#0284C7", border: "1px solid #BAE6FD" },
  };
  return { ...base, ...themes[type] };
}

// ── New Chat bottom sheet ──────────────────────────────────────────────────────

type ChatMode = "choose" | "dm" | "group";

const SUGGESTIONS = [
  { name: "Aaliyah M.", initial: "A",  color: "#FF1F7D" },
  { name: "Maya S.",    initial: "Ma", color: "#FF69B4" },
  { name: "Jade K.",    initial: "J",  color: "#FF1F7D" },
  { name: "Sofia W.",   initial: "S",  color: "#FF69B4" },
  { name: "Naomi B.",   initial: "N",  color: "#FF1F7D" },
  { name: "Temi A.",    initial: "T",  color: "#FF69B4" },
];

function NewChatSheet({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<ChatMode>("choose");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dmPick, setDmPick] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");

  function toggleGroup(name: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  const Backdrop = () => (
    <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
  );

  const Handle = () => (
    <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
      <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
    </div>
  );

  const SheetHeader = ({ title, onBack }: { title: string; onBack?: () => void }) => (
    <div className="px-6 pt-2 pb-4 flex items-center gap-3 flex-shrink-0"
      style={{ borderBottom: "1px solid var(--card-border, #F0F0F0)" }}>
      {onBack && (
        <button onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
          style={{ background: "rgba(0,0,0,0.05)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      )}
      <p className="text-[10px] font-bold tracking-[0.22em] uppercase flex-1" style={{ color: "#FF1F7D" }}>
        {title}
      </p>
      <button onClick={onClose}
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
        style={{ background: "rgba(0,0,0,0.05)" }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round">
          <path d="M1 1l10 10M11 1L1 11"/>
        </svg>
      </button>
    </div>
  );

  // ── Step 1: choose DM or Group ──
  if (mode === "choose") {
    return (
      <>
        <Backdrop />
        <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
          style={{ background: "var(--card-bg, white)", boxShadow: "0 -8px 40px rgba(0,0,0,0.14)", paddingBottom: "env(safe-area-inset-bottom, 24px)" }}>
          <Handle />
          <SheetHeader title="✦ NEW CONVERSATION" />
          <div className="px-6 pt-5 pb-8 flex flex-col gap-3">
            <button onClick={() => setMode("dm")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all active:scale-[0.98]"
              style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #FF1F7D, #FF69B4)", boxShadow: "0 3px 10px rgba(255,31,125,0.3)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: "var(--heading-color, #111)" }}>Send a message</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted, #aaa)" }}>One-on-one with someone</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>

            <button onClick={() => setMode("group")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all active:scale-[0.98]"
              style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #FF69B4, #C084FC)", boxShadow: "0 3px 10px rgba(255,105,180,0.3)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: "var(--heading-color, #111)" }}>Send a group message</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted, #aaa)" }}>Start a group chat with multiple women</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Step 2a: Direct message — pick one person ──
  if (mode === "dm") {
    return (
      <>
        <Backdrop />
        <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
          style={{ background: "var(--card-bg, white)", boxShadow: "0 -8px 40px rgba(0,0,0,0.14)", maxHeight: "75vh", display: "flex", flexDirection: "column" }}>
          <Handle />
          <SheetHeader title="SEND A MESSAGE" onBack={() => { setMode("choose"); setDmPick(null); }} />
          <div className="flex-1 overflow-y-auto px-6 py-3">
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "var(--text-muted, #bbb)" }}>Choose someone</p>
            <div className="flex flex-col gap-1">
              {SUGGESTIONS.map(s => {
                const active = dmPick === s.name;
                return (
                  <button key={s.name} onClick={() => setDmPick(s.name)}
                    className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all active:scale-[0.98]"
                    style={{ background: active ? "#FFF0F5" : "transparent", border: active ? "1.5px solid #FFD6E8" : "1.5px solid transparent" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 text-xs"
                      style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}BB)`, boxShadow: active ? `0 0 0 2.5px ${s.color}44` : "none" }}>
                      {s.initial}
                    </div>
                    <p className="flex-1 text-sm font-semibold text-left" style={{ color: "var(--heading-color, #111)" }}>{s.name}</p>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ borderColor: active ? "#FF1F7D" : "#DDD", background: active ? "#FF1F7D" : "transparent" }}>
                      {active && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5">
                          <polyline points="2 6 5 9 10 3"/>
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="px-6 pb-8 pt-3 flex-shrink-0" style={{ borderTop: "1px solid var(--card-border, #F0F0F0)" }}>
            <button onClick={() => { if (dmPick) onClose(); }}
              disabled={!dmPick}
              className="w-full py-4 rounded-full text-sm font-bold transition-all"
              style={dmPick
                ? { background: "#FF1F7D", color: "white", boxShadow: "0 4px 16px rgba(255,31,125,0.3)" }
                : { background: "#F5E8EE", color: "#C8A0B0" }}>
              {dmPick ? `Message ${dmPick.split(" ")[0]} →` : "Choose someone first"}
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Step 2b: Group message — pick multiple + name ──
  return (
    <>
      <Backdrop />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{ background: "var(--card-bg, white)", boxShadow: "0 -8px 40px rgba(0,0,0,0.14)", maxHeight: "82vh", display: "flex", flexDirection: "column" }}>
        <Handle />
        <SheetHeader title="GROUP MESSAGE" onBack={() => { setMode("choose"); setSelected(new Set()); setGroupName(""); }} />
        <div className="px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--card-border, #F0F0F0)" }}>
          <input value={groupName} onChange={e => setGroupName(e.target.value)}
            placeholder="Group name (e.g. Morocco Girls)"
            autoFocus
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE", color: "var(--text-color, #111)" }} />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-3">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "var(--text-muted, #bbb)" }}>
            Add women · {selected.size} selected
          </p>
          <div className="flex flex-col gap-1">
            {SUGGESTIONS.map(s => (
              <button key={s.name} onClick={() => toggleGroup(s.name)}
                className="w-full flex items-center gap-3 py-2.5 transition-all active:scale-[0.98]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 text-xs"
                  style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}BB)` }}>
                  {s.initial}
                </div>
                <p className="flex-1 text-sm font-semibold text-left" style={{ color: "var(--heading-color, #111)" }}>{s.name}</p>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ borderColor: selected.has(s.name) ? "#FF1F7D" : "#DDD", background: selected.has(s.name) ? "#FF1F7D" : "transparent" }}>
                  {selected.has(s.name) && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5">
                      <polyline points="2 6 5 9 10 3"/>
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 pb-8 pt-3 flex-shrink-0" style={{ borderTop: "1px solid var(--card-border, #F0F0F0)" }}>
          <button onClick={() => { if (selected.size >= 2 && groupName.trim()) onClose(); }}
            disabled={selected.size < 2 || !groupName.trim()}
            className="w-full py-4 rounded-full text-sm font-bold transition-all"
            style={selected.size >= 2 && groupName.trim()
              ? { background: "linear-gradient(135deg, #FF1F7D, #FF69B4)", color: "white", boxShadow: "0 4px 16px rgba(255,31,125,0.3)" }
              : { background: "#F5E8EE", color: "#C8A0B0" }}>
            {selected.size >= 2 && groupName.trim()
              ? `Create group · ${selected.size} women →`
              : selected.size < 2
                ? "Add at least 2 women"
                : "Add a group name"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Conversation row ───────────────────────────────────────────────────────────

function ConvoRow({ convo, isUnread, isLast, onClick }: { convo: Convo; isUnread: boolean; isLast: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3.5 px-5 py-3.5 text-left transition-all active:scale-[0.98] active:bg-pink-50"
      style={isLast ? undefined : { borderBottom: "1px solid var(--card-border, rgba(0,0,0,0.05))" }}>
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${convo.color}, ${convo.color}BB)`, fontSize: convo.initial.length > 1 ? "11px" : "15px", boxShadow: isUnread ? `0 0 0 2px ${convo.color}, 0 0 0 4px var(--pale-pink-bg)` : "none" }}>
          {convo.initial}
        </div>
        {isUnread && (
          <div className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center"
            style={{ background: "#FF1F7D", boxShadow: "0 1px 4px rgba(255,31,125,0.55)" }}>
            <span className="text-[9px] font-black text-white leading-none px-1">{convo.unread}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm truncate leading-tight flex-1 min-w-0"
            style={{ color: "var(--heading-color, #111111)", fontWeight: isUnread ? 700 : 500 }}>
            {convo.name}
          </p>
          <span style={typeBadgeStyle(convo.type)}>{typeLabel(convo.type)}</span>
          <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-muted, #bbb)" }}>{convo.time}</span>
        </div>
        <p className="text-xs truncate leading-relaxed"
          style={{ color: isUnread ? "var(--text-color, #555)" : "var(--text-muted, #bbb)", fontWeight: isUnread ? 500 : 400 }}>
          {convo.preview}
        </p>
        {convo.subtitle && (
          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted, #ccc)" }}>{convo.subtitle}</p>
        )}
      </div>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(180,140,140,0.5)" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  );
}

// ── Thread View ────────────────────────────────────────────────────────────────

function ThreadView({ convo, messages, onBack }: { convo: Convo; messages: Message[]; onBack: () => void }) {
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<Message[]>(messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  function sendMessage() {
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
    <div className="min-h-screen flex flex-col" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3 flex-shrink-0 md:pt-10"
        style={{ background: "var(--card-bg, white)", borderBottom: "1px solid var(--card-border, #F0F0F0)", boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
        <button onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
          style={{ background: "rgba(0,0,0,0.05)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 text-sm"
          style={{ background: `linear-gradient(135deg, ${convo.color}, ${convo.color}BB)` }}>
          {convo.initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-tight" style={{ color: "var(--heading-color, #111)" }}>{convo.name}</p>
          {convo.subtitle && (
            <p className="text-[10px]" style={{ color: "var(--text-muted, #bbb)" }}>{convo.subtitle}</p>
          )}
        </div>
        <span style={typeBadgeStyle(convo.type)}>{typeLabel(convo.type)}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3" style={{ paddingBottom: "80px" }}>
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
                <p className="text-[10px] font-semibold px-1" style={{ color: "var(--text-muted, #aaa)" }}>{msg.sender}</p>
              )}
              <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={msg.isMe
                  ? { background: "#FF1F7D", color: "white", borderBottomRightRadius: "6px", boxShadow: "0 2px 10px rgba(255,31,125,0.25)" }
                  : { background: "var(--card-bg, white)", color: "var(--text-color, #333)", borderBottomLeftRadius: "6px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                {msg.text}
              </div>
              <p className="text-[9px] px-1" style={{ color: "var(--text-muted, #ccc)" }}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-3"
        style={{ background: "var(--card-bg, white)", borderTop: "1px solid var(--card-border, #F0F0F0)", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div className="flex-1 rounded-2xl overflow-hidden"
          style={{ background: "var(--pale-pink-bg, #FDFAF5)", border: "1.5px solid var(--card-border, #EEE)" }}>
          <input value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Send a message…"
            className="w-full px-4 py-3 text-sm outline-none bg-transparent"
            style={{ color: "var(--text-color, #111)" }} />
        </div>
        <button onClick={sendMessage}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
          style={{ background: draft.trim() ? "#FF1F7D" : "rgba(0,0,0,0.06)", boxShadow: draft.trim() ? "0 2px 10px rgba(255,31,125,0.35)" : "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={draft.trim() ? "white" : "rgba(0,0,0,0.3)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Main Chat Page ─────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [view, setView] = useState<View>("list");
  const [activeConvo, setActiveConvo] = useState<Convo | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [showNewChat, setShowNewChat] = useState(false);
  const [read, setRead] = useState<Set<number>>(new Set());

  function openConvo(convo: Convo) {
    setRead(prev => new Set([...prev, convo.id]));
    setActiveConvo(convo);
    setView("thread");
  }

  function backToList() {
    setView("list");
    setActiveConvo(null);
  }

  if (view === "thread" && activeConvo) {
    return (
      <ThreadView
        convo={activeConvo}
        messages={THREAD_MESSAGES[activeConvo.id] ?? []}
        onBack={backToList}
      />
    );
  }

  const shown = CONVOS.filter(c => c.type !== "plan" && (filter === "all" || c.type === filter));
  const totalUnread = CONVOS.filter(c => c.type !== "plan").reduce((sum, c) => sum + (read.has(c.id) ? 0 : c.unread), 0);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-5 md:px-8 md:pt-10">
        <div className="flex items-center gap-3">
          <Link href="/member/home"
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
            style={{ background: "rgba(0,0,0,0.06)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>✦ CHAT</p>
            <div className="flex items-center gap-2.5">
              <h1 className="font-black italic leading-none"
                style={{ color: "var(--heading-color, #111111)", fontFamily: "var(--font-playfair)", fontSize: "clamp(34px,9vw,48px)" }}>
                Conversations.
              </h1>
              {totalUnread > 0 && (
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full text-white self-end mb-1"
                  style={{ background: "#FF1F7D", boxShadow: "0 2px 8px rgba(255,31,125,0.4)" }}>
                  {totalUnread} new
                </span>
              )}
            </div>
          </div>
          {/* ── + button top-right ── */}
          <button onClick={() => setShowNewChat(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
            style={{ background: "linear-gradient(135deg, #FF1F7D, #FF69B4)", boxShadow: "0 3px 12px rgba(255,31,125,0.38)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto md:px-8" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all active:scale-95"
            style={filter === f.value
              ? { background: "#111111", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }
              : { background: "var(--card-bg, white)", color: "var(--text-color, #555)", border: "1.5px solid var(--card-border, #E8E8E8)" }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Conversation list */}
      {shown.length > 0 ? (
        <div className="mx-5 md:mx-8 rounded-3xl overflow-hidden"
          style={{ background: "var(--card-bg, white)", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          {shown.map((convo, idx) => (
            <ConvoRow key={convo.id} convo={convo}
              isUnread={convo.unread > 0 && !read.has(convo.id)}
              isLast={idx === shown.length - 1}
              onClick={() => openConvo(convo)} />
          ))}
        </div>
      ) : (
        <div className="mx-5 md:mx-8 rounded-3xl py-14 flex flex-col items-center gap-3"
          style={{ background: "var(--card-bg, white)", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: "#FFF0F5" }}>💬</div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-muted, #aaa)" }}>No conversations here yet</p>
          <p className="text-xs text-center px-8" style={{ color: "var(--text-muted, #ccc)" }}>Tap + to start a conversation or join a Plan Room.</p>
        </div>
      )}

      {showNewChat && <NewChatSheet onClose={() => setShowNewChat(false)} />}
    </div>
  );
}
