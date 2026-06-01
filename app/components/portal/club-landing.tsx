"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BBLogo } from "./bb-logo";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ClubAccessType = "free" | "one_time" | "subscription";
export type ClubEntryStyle = "open" | "application" | "approval_paywall";

export interface ClubLandingData {
  id: string;
  name: string;
  tagline: string;
  about: string;
  whoItsFor: string;
  whatMembersDo: string[];
  tags: string[];
  city: string;
  neighborhood: string;
  memberCount: number;
  color: string;
  darkBg: boolean;
  hostName: string;
  hostTitle: string;
  hostBio: string;
  accessType: ClubAccessType;
  entryStyle: ClubEntryStyle;
  price?: number;
  billingInterval?: "monthly" | "seasonal" | "yearly";
  rules?: string[];
  upcomingSeats: { title: string; date: string; seats: number; price?: string }[];
  photos?: string[];
}

// ─── Mock data used when no real data passed ─────────────────────────────────

const DEFAULT_CLUB: ClubLandingData = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Dinner Society",
  tagline: "Gorgeous tables. Real conversations.",
  about:
    "Dinner Society is where NYC women gather around the table — at the best restaurants, in private dining rooms, and at intimate supper clubs. Every dinner is curated for connection.",
  whoItsFor:
    "Women who love food, conversation, and turning strangers into friends over a beautiful meal.",
  whatMembersDo: [
    "Monthly curated dinners at NYC's top restaurants",
    "Private dining room takeovers",
    "Girls-only supper club nights",
    "Cultural food tours around the city",
    "Cooking workshops with local chefs",
  ],
  tags: ["Dining", "Social", "Culture", "NYC"],
  city: "New York",
  neighborhood: "All boroughs",
  memberCount: 312,
  color: "#FF0055",
  darkBg: false,
  hostName: "Amanda R.",
  hostTitle: "Dinner Society Host · BloomBay Curator",
  hostBio:
    "Former food editor and lifelong table-setter. Amanda started Dinner Society because she believes the best conversations happen over food.",
  accessType: "one_time",
  entryStyle: "application",
  price: 49,
  rules: [
    "Come with an open heart",
    "No phones at the table during dinner",
    "Respect every woman's story",
    "What's shared at the table stays at the table",
  ],
  upcomingSeats: [
    { title: "Carbone Girls Dinner", date: "Sat, Jun 14 · 7:30 PM", seats: 3, price: "Individual pay" },
    { title: "Rooftop Wine Hour", date: "Fri, Jun 20 · 8:00 PM", seats: 5, price: "Free" },
    { title: "Private Supper Club", date: "Thu, Jun 26 · 7:00 PM", seats: 2, price: "$65 per seat" },
  ],
};

// ─── Chat Mock Data ──────────────────────────────────────────────────────────

interface ChatMessage {
  id: number;
  author: string;
  initial: string;
  color: string;
  text: string;
  time: string;
  mine?: boolean;
  reactions?: { emoji: string; count: number }[];
}

const CHAT_MESSAGES: ChatMessage[] = [
  { id: 1, author: "Aminah C.", initial: "A", color: "#FF1F7D", text: "Has anyone tried the jollof at that new spot on Atlantic Ave?", time: "2:14 PM" },
  { id: 2, author: "Kelechi O.", initial: "K", color: "#FF69B4", text: "YES the smoky base is exactly right 🔥 I went twice last week", time: "2:16 PM", reactions: [{ emoji: "♡", count: 4 }] },
  { id: 3, author: "You", initial: "M", color: "#FF69B4", text: "Ok we need a club outing asap. I've been waiting for a reason to go back", time: "2:17 PM", mine: true },
  { id: 4, author: "Aminah C.", initial: "A", color: "#FF1F7D", text: "The Jollof + Movie Night is confirmed for Friday btw!! Amanda just posted it 🎉", time: "2:19 PM", reactions: [{ emoji: "♡", count: 8 }, { emoji: "✦", count: 3 }] },
  { id: 5, author: "Bea T.", initial: "B", color: "#FF69B4", text: "Friday works! What movie are we watching?", time: "2:21 PM" },
  { id: 6, author: "You", initial: "M", color: "#FF69B4", text: "I vote Half of a Yellow Sun or The Burial of Kojo", time: "2:22 PM", mine: true },
  { id: 7, author: "Kelechi O.", initial: "K", color: "#FF69B4", text: "I'm bringing garri and puff puff 😂 somebody else handle dessert", time: "2:24 PM", reactions: [{ emoji: "😂", count: 6 }] },
  { id: 8, author: "Fatima A.", initial: "F", color: "#FF1F7D", text: "I'll bring zobo 🍹 the hibiscus one from that vendor at the weekend market", time: "2:25 PM" },
  { id: 9, author: "Aminah C.", initial: "A", color: "#FF1F7D", text: "This is going to be such a good night. See everyone Friday 🌸", time: "2:26 PM", reactions: [{ emoji: "♡", count: 11 }] },
];

const CLUB_MEMBERS = [
  { initial: "A", name: "Aminah C.", color: "#FF1F7D", role: "Host" },
  { initial: "K", name: "Kelechi O.", color: "#FF69B4", role: "Member" },
  { initial: "B", name: "Bea T.", color: "#FF69B4", role: "Member" },
  { initial: "F", name: "Fatima A.", color: "#FF1F7D", role: "Member" },
  { initial: "R", name: "Remi O.", color: "#FF69B4", role: "Member" },
  { initial: "N", name: "Ngozi M.", color: "#FF1F7D", role: "Member" },
  { initial: "T", name: "Temi A.", color: "#FF69B4", role: "Member" },
  { initial: "C", name: "Chidera L.", color: "#0EA5E9", role: "Member" },
];

type ClubTab = "about" | "chat" | "events" | "members";

// ─── Club Chat Component ──────────────────────────────────────────────────────

function ClubChat({ club }: { club: ClubLandingData }) {
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);
  const [input, setInput]         = useState("");
  const [likedIds, setLikedIds]   = useState<Set<number>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), author: "You", initial: "M", color: "#FF69B4", text: input.trim(), time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), mine: true },
    ]);
    setInput("");
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 280px)", minHeight: "400px" }}>
      {/* Online indicator */}
      <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: "#F0E8E0" }}>
        <div className="flex -space-x-1.5">
          {CLUB_MEMBERS.slice(0, 5).map((m) => (
            <div key={m.name} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white" style={{ background: m.color }}>
              {m.initial}
            </div>
          ))}
        </div>
        <span className="text-xs text-gray-400">{CLUB_MEMBERS.length} members · <span style={{ color: "#FF1F7D" }}>5 online</span></span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {/* Date divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px" style={{ background: "#F0E8E0" }} />
          <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">Today</span>
          <div className="flex-1 h-px" style={{ background: "#F0E8E0" }} />
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.mine ? "flex-row-reverse" : "flex-row"}`}>
            {!msg.mine && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mb-1" style={{ background: msg.color }}>
                {msg.initial}
              </div>
            )}
            <div className={`flex flex-col ${msg.mine ? "items-end" : "items-start"} max-w-[75%]`}>
              {!msg.mine && (
                <span className="text-[11px] font-semibold mb-1 ml-1" style={{ color: msg.color }}>{msg.author}</span>
              )}
              <div
                className="px-4 py-2.5 text-sm leading-relaxed"
                style={{
                  background: msg.mine ? club.color : "white",
                  color: msg.mine ? "white" : "#111111",
                  borderRadius: msg.mine ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                }}
              >
                {msg.text}
              </div>
              {msg.reactions && (
                <div className="flex items-center gap-1.5 mt-1.5 ml-1">
                  {msg.reactions.map((r) => (
                    <button
                      key={r.emoji}
                      onClick={() => setLikedIds((p) => { const n = new Set(p); n.has(msg.id) ? n.delete(msg.id) : n.add(msg.id); return n; })}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all"
                      style={likedIds.has(msg.id)
                        ? { background: "#FFF0F5", color: "#FF1F7D" }
                        : { background: "#F5F5F5", color: "#888" }}
                    >
                      {r.emoji} {likedIds.has(msg.id) ? r.count + 1 : r.count}
                    </button>
                  ))}
                </div>
              )}
              <span className="text-[10px] text-gray-300 mt-1 mx-1">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ borderTop: "1px solid #F0E8E0", background: "white" }}>
        <div className="flex-1 flex items-center rounded-full px-4 py-2.5 gap-2" style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Say something..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#111111" }}
          />
          <button className="text-gray-300 hover:text-gray-400 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
            </svg>
          </button>
        </div>
        <button
          onClick={send}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-30"
          style={{ background: club.color }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CrestMark({ name, color, size = 72 }: { name: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size / 3.5, boxShadow: `0 4px 24px ${color}55` }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function PriceBadge({ type, price, interval }: { type: ClubAccessType; price?: number; interval?: string }) {
  if (type === "free") return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "#F0FFF4", color: "#16a34a" }}>
      Free to join
    </span>
  );
  if (type === "one_time") return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "#FFF5F8", color: "#FF0055" }}>
      ${price} one-time access
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "#FFF5F8", color: "#FF0055" }}>
      ${price}/{interval ?? "month"}
    </span>
  );
}

function EntryBadge({ style }: { style: ClubEntryStyle }) {
  if (style === "open") return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#F0FFF4", color: "#16a34a" }}>
      Open join — join instantly
    </span>
  );
  if (style === "application") return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#FFF9E6", color: "#b45309" }}>
      Application required
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#FFF5F8", color: "#FF0055" }}>
      Apply → approve → pay
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ClubLandingPage({ club = DEFAULT_CLUB }: { club?: ClubLandingData }) {
  const [applied, setApplied]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [clubTab, setClubTab]   = useState<ClubTab>("about");

  const ctaLabel =
    club.entryStyle === "open"
      ? "Join the Clubhouse"
      : club.entryStyle === "application"
      ? "Apply to Join"
      : "Apply to Join";

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--pale-pink-bg)" }}>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: club.darkBg ? "#111111" : `linear-gradient(160deg, ${club.color}22 0%, #FFF5F8 60%)`,
          minHeight: "280px",
        }}
      >
        {/* Back nav */}
        <div className="absolute top-0 left-0 right-0 z-10 px-5 pt-12 flex items-center justify-between">
          <Link href="/member/clubs" className="flex items-center gap-1.5 text-sm font-medium" style={{ color: club.darkBg ? "rgba(255,255,255,0.7)" : "#111111" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            All Clubs
          </Link>
          <BBLogo size={28} light={club.darkBg} />
        </div>

        {/* Decorative circle */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "300px", height: "300px",
            background: club.color,
            borderRadius: "50%",
            right: "-80px", top: "-80px",
            opacity: 0.12,
          }}
        />

        {/* Club identity */}
        <div className="relative z-10 px-5 pt-24 pb-8">
          <div className="flex items-end gap-5">
            <CrestMark name={club.name} color={club.color} size={80} />
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap gap-2 mb-2">
                {club.tags.map((t) => (
                  <span key={t} className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${club.color}22`, color: club.color }}>
                    {t}
                  </span>
                ))}
              </div>
              <h1
                className="text-2xl font-bold leading-tight"
                style={{ color: club.darkBg ? "white" : "#111111", fontFamily: "var(--font-playfair)" }}
              >
                {club.name}
              </h1>
              <p className="text-sm mt-0.5" style={{ color: club.darkBg ? "rgba(255,255,255,0.6)" : "#888" }}>
                {club.memberCount.toLocaleString()} women · {club.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky CTA bar ─────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 px-5 py-3 flex items-center justify-between gap-3"
        style={{ background: "rgba(255,245,248,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #F0D0DC" }}
      >
        <div className="flex flex-wrap gap-2">
          <PriceBadge type={club.accessType} price={club.price} interval={club.billingInterval} />
          <EntryBadge style={club.entryStyle} />
        </div>
        <button
          onClick={() => { if (!applied) setShowForm(true); }}
          className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all active:scale-95"
          style={{ background: applied ? "#16a34a" : club.color }}
        >
          {applied ? "Applied" : ctaLabel}
        </button>
      </div>

      {/* ── Club Tabs ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 px-5 py-3 overflow-x-auto" style={{ borderBottom: "1px solid #F0E0E8" }}>
        {(["about", "chat", "events", "members"] as ClubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setClubTab(t)}
            className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap capitalize transition-all"
            style={clubTab === t
              ? { background: club.color, color: "white" }
              : { color: "#888", background: "transparent" }}
          >
            {t === "about" ? "About" : t === "chat" ? "Chat 💬" : t === "events" ? "Events" : "Members"}
          </button>
        ))}
      </div>

      {/* ── Chat Tab ───────────────────────────────────────────────────────── */}
      {clubTab === "chat" && <ClubChat club={club} />}

      {/* ── Events Tab ─────────────────────────────────────────────────────── */}
      {clubTab === "events" && (
        <div className="max-w-xl mx-auto px-5 pt-5 flex flex-col gap-4 pb-20">
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: club.color }}>OPEN SEATS</p>
          {club.upcomingSeats.map((seat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 flex items-center justify-between" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div>
                <p className="font-bold text-sm" style={{ color: "#111111" }}>{seat.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{seat.date}</p>
                {seat.price && <p className="text-xs font-semibold mt-1" style={{ color: club.color }}>{seat.price}</p>}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: club.color }}>{seat.seats}</p>
                  <p className="text-xs text-gray-400">seats</p>
                </div>
                <button className="px-4 py-2 rounded-full text-sm font-bold text-white" style={{ background: club.color }}>
                  RSVP
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Members Tab ────────────────────────────────────────────────────── */}
      {clubTab === "members" && (
        <div className="max-w-xl mx-auto px-5 pt-5 pb-20">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: club.color }}>
            {club.memberCount.toLocaleString()} MEMBERS
          </p>
          <div className="flex flex-col gap-2">
            {CLUB_MEMBERS.map((m) => (
              <div key={m.name} className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: m.color }}>
                  {m.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: "#111111" }}>{m.name}</p>
                  {m.role === "Host" && (
                    <span className="text-xs font-bold" style={{ color: club.color }}>Host</span>
                  )}
                </div>
                <button className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      {clubTab === "about" && <div className="max-w-xl mx-auto px-5 pt-6 flex flex-col gap-6">

        {/* Tagline */}
        <p
          className="text-xl font-bold leading-snug italic"
          style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}
        >
          &ldquo;{club.tagline}&rdquo;
        </p>

        {/* About */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: club.color }}>ABOUT THIS CLUB</p>
          <p className="text-sm leading-relaxed text-gray-600">{club.about}</p>
        </div>

        {/* Who it's for */}
        <div className="rounded-3xl p-5" style={{ background: `${club.color}12`, border: `1px solid ${club.color}30` }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: club.color }}>WHO IT&apos;S FOR</p>
          <p className="text-sm leading-relaxed font-medium" style={{ color: "#111111" }}>{club.whoItsFor}</p>
        </div>

        {/* What members do */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: club.color }}>WHAT MEMBERS DO</p>
          <ul className="flex flex-col gap-2.5">
            {club.whatMembersDo.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: `${club.color}20` }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1 4.5l2.5 2.5L8 1.5" stroke={club.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Seats */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: club.color }}>OPEN SEATS</p>
            <Link href="/member/happenings" className="text-xs font-semibold" style={{ color: club.color }}>See all →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {club.upcomingSeats.map((seat, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 flex items-center justify-between" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#111111" }}>{seat.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{seat.date}</p>
                  {seat.price && <p className="text-xs font-semibold mt-0.5" style={{ color: club.color }}>{seat.price}</p>}
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-xl font-bold" style={{ color: club.color }}>{seat.seats}</p>
                  <p className="text-xs text-gray-400">seats</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Host card */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: club.color }}>YOUR HOST</p>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-lg" style={{ background: club.color }}>
              {club.hostName[0]}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "#111111" }}>{club.hostName}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: club.color }}>{club.hostTitle}</p>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{club.hostBio}</p>
            </div>
          </div>
        </div>

        {/* Rules */}
        {club.rules && club.rules.length > 0 && (
          <div className="rounded-3xl p-5" style={{ background: "#111111" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>CLUB RULES</p>
            <ul className="flex flex-col gap-2">
              {club.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                  <span className="font-bold" style={{ color: club.color }}>0{i + 1}</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pricing detail */}
        {club.accessType !== "free" && (
          <div className="rounded-3xl p-5" style={{ background: `${club.color}10`, border: `1px solid ${club.color}25` }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: club.color }}>ACCESS</p>
            {club.accessType === "one_time" && (
              <>
                <p className="text-3xl font-bold" style={{ color: "#111111" }}>${club.price}</p>
                <p className="text-sm text-gray-500 mt-1">One-time fee · Full club access after approval</p>
              </>
            )}
            {club.accessType === "subscription" && (
              <>
                <p className="text-3xl font-bold" style={{ color: "#111111" }}>${club.price}<span className="text-base font-normal text-gray-400">/{club.billingInterval ?? "month"}</span></p>
                <p className="text-sm text-gray-500 mt-1">Recurring subscription · Cancel any time</p>
              </>
            )}
            <p className="text-xs text-gray-400 mt-2">Payment collected after club owner approves your application.</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="flex flex-col gap-3 pt-2 pb-6">
          <button
            onClick={() => { if (!applied) setShowForm(true); }}
            className="w-full py-4 rounded-full font-bold text-base text-white transition-all active:scale-[0.98]"
            style={{ background: applied ? "#16a34a" : club.color }}
          >
            {applied ? "Application Submitted" : ctaLabel}
          </button>
          {club.entryStyle !== "open" && (
            <p className="text-center text-xs text-gray-400">
              {club.entryStyle === "application" ? "The host reviews every application." : "Apply → host approves → pay to enter."}
            </p>
          )}
        </div>
      </div>}


      {/* ── Application Sheet ───────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div
            className="w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 overflow-y-auto"
            style={{ background: "white", maxHeight: "90vh" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase" style={{ color: club.color }}>APPLY</p>
                <h3 className="text-xl font-bold" style={{ color: "#111111" }}>{club.name}</h3>
              </div>
              <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#F5F5F5" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="#888" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">WHY DO YOU WANT TO JOIN?</label>
                <textarea
                  rows={3}
                  placeholder="Tell the host what draws you to this club..."
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm outline-none border-2 border-transparent resize-none"
                  style={{ color: "#111111" }}
                  onFocus={(e) => (e.target.style.borderColor = club.color)}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">TELL US ABOUT YOURSELF</label>
                <textarea
                  rows={3}
                  placeholder="A little about you — work, vibe, what you love..."
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm outline-none border-2 border-transparent resize-none"
                  style={{ color: "#111111" }}
                  onFocus={(e) => (e.target.style.borderColor = club.color)}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">INSTAGRAM (optional)</label>
                <input
                  type="text"
                  placeholder="@handle"
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3.5 text-sm outline-none border-2 border-transparent"
                  style={{ color: "#111111" }}
                  onFocus={(e) => (e.target.style.borderColor = club.color)}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
              </div>
              {club.rules && club.rules.length > 0 && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 accent-[#FF0055]" required />
                  <span className="text-sm text-gray-500">I have read and accept the club rules.</span>
                </label>
              )}
            </div>

            <button
              onClick={() => { setApplied(true); setShowForm(false); }}
              className="w-full mt-6 py-4 rounded-full font-bold text-base text-white transition-all active:scale-[0.98]"
              style={{ background: club.color }}
            >
              Submit Application
            </button>

            {club.accessType !== "free" && (
              <p className="text-center text-xs text-gray-400 mt-3">
                Payment is only collected after the host approves you.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
