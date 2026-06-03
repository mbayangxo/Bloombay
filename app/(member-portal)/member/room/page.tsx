"use client";

import { useState, useEffect } from "react";
import { getTimeOfDay, type TimeOfDay } from "@/app/components/portal/time-wrapper";

type Room = "lobby" | "wall" | "girlbar" | "new-keys" | "vanity" | "closet";
type WallCategory = "gather" | "discover" | "plan" | "now" | "ask";

interface WallPost {
  id: number; author: string; initial: string; color: string;
  time: string; text: string; likes: number; replies: number;
  pinned: boolean; category: WallCategory;
}

const SEED_POSTS: WallPost[] = [
  { id: 1, author: "Aaliyah M.", initial: "A", color: "#FF1F7D",  time: "8m ago",    text: "Anyone want to do matcha Thursday morning in Williamsburg? I know a spot that's not on TikTok yet. Small group, max 5.",                likes: 14, replies: 6,  pinned: true,  category: "gather"   },
  { id: 2, author: "Sofia K.",   initial: "S", color: "#FF69B4",  time: "22m ago",   text: "At Café Medina right now — table for 2 just opened up. If you're in Crown Heights come through 🌸",                                       likes: 7,  replies: 3,  pinned: false, category: "now"      },
  { id: 3, author: "Priya R.",   initial: "P", color: "#FF69B4",  time: "1h ago",    text: "Organizing a run in Prospect Park this Sunday 8AM. All paces welcome — we end at the café and get pastries. DM me to join.",               likes: 23, replies: 9,  pinned: false, category: "plan"     },
  { id: 4, author: "Kezia N.",   initial: "K", color: "#FF1F7D",  time: "2h ago",    text: "Best Nigerian restaurant in BK? Taking 4 girls tonight — need a rec by 5PM.",                                                              likes: 11, replies: 17, pinned: false, category: "discover" },
  { id: 5, author: "Imani J.",   initial: "I", color: "#FF1F7D",  time: "3h ago",    text: "Afrobeats Night at SOB's is this Saturday. I have 2 extra tickets — who wants them? Girls only.",                                          likes: 31, replies: 14, pinned: false, category: "gather"   },
  { id: 6, author: "Naomi B.",   initial: "N", color: "#FF69B4",  time: "5h ago",    text: "Book club in the West Village starting next Thursday — first pick is 'Parable of the Sower'. 8 spots, 3 left.",                            likes: 19, replies: 8,  pinned: false, category: "plan"     },
  { id: 7, author: "Zara M.",    initial: "Z", color: "#FF1F7D",  time: "Yesterday", text: "Looking for a gym buddy in Greenpoint — early mornings, any gym. I just need someone to hold me accountable.",                             likes: 8,  replies: 11, pinned: false, category: "gather"   },
  { id: 8, author: "Temi A.",    initial: "T", color: "#FF69B4",  time: "Yesterday", text: "Anyone been to the new Eritrean spot on Fulton? Thinking about it for my birthday dinner. Honest reviews only.",                            likes: 22, replies: 7,  pinned: false, category: "discover" },
];

const WALL_FILTERS: { label: string; value: WallCategory | "all" | "trending" }[] = [
  { label: "All", value: "all" }, { label: "🔥 Now", value: "trending" },
  { label: "Gather", value: "gather" }, { label: "Discover", value: "discover" },
  { label: "Plan", value: "plan" }, { label: "Happening", value: "now" }, { label: "Ask", value: "ask" },
];

const GIRL_BAR_ROOMS = [
  { id: 1, name: "Morning Room",  desc: "Coffee talk, slow start, soft energy",  women: 8,  live: true  },
  { id: 2, name: "Night Owl",     desc: "Late-night conversations, no filter",    women: 14, live: true  },
  { id: 3, name: "Study With Me", desc: "Silent co-working, you're not alone",    women: 5,  live: true  },
  { id: 4, name: "Sunday Soft",   desc: "Decompressing before the week starts",   women: 3,  live: false },
];

// ── Door data ─────────────────────────────────────────────────────────────────

const LOBBY_DOORS = [
  { id: "wall" as Room,     name: "The Wall",    sub: "Community board",       hint: "42 posts today",        bg: "#F8F5F0", darkBg: "#1A1830", dark: false, accent: "#FF1F7D", available: true,  newCount: 5 },
  { id: "girlbar" as Room,  name: "Girl Bar",    sub: "Live audio rooms",      hint: "27 women listening",    bg: "#111118", darkBg: "#111118", dark: true,  accent: "#FF69B4", available: true,  newCount: 3 },
  { id: "new-keys" as Room, name: "New Keys",    sub: "Newcomers & arrivals",  hint: "",                      bg: "#FFF0F5", darkBg: "#1C1428", dark: false, accent: "#FF1F7D", available: false, newCount: 0 },
  { id: "vanity" as Room,   name: "The Vanity",  sub: "Beauty & style",        hint: "",                      bg: "#FBF3F7", darkBg: "#1A1428", dark: false, accent: "#FF69B4", available: false, newCount: 0 },
  { id: "closet" as Room,   name: "The Closet",  sub: "Outfits & what to wear",hint: "",                      bg: "#F5F0EC", darkBg: "#181428", dark: false, accent: "#FF1F7D", available: false, newCount: 0 },
];

// ── SVG symbols per room ──────────────────────────────────────────────────────

function DoorSymbol({ id, accent }: { id: string; accent: string }) {
  if (id === "wall") return (
    <>
      <line x1="20" y1="40" x2="36" y2="40" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
      <line x1="20" y1="46" x2="36" y2="46" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
      <line x1="20" y1="52" x2="30" y2="52" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
    </>
  );
  if (id === "girlbar") return (
    <>
      <rect x="23" y="33" width="10" height="15" rx="5" fill="none" stroke={accent} strokeWidth="1.8" opacity="0.7"/>
      <path d="M 20 50 Q 20 58 28 58 Q 36 58 36 50" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
      <line x1="28" y1="58" x2="28" y2="63" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
    </>
  );
  if (id === "new-keys") return (
    <>
      <circle cx="22" cy="40" r="7" fill="none" stroke={accent} strokeWidth="1.8" opacity="0.7"/>
      <line x1="27.5" y1="45.5" x2="42" y2="60" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
      <line x1="38" y1="56" x2="38" y2="61" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
      <line x1="34" y1="60" x2="34" y2="65" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
    </>
  );
  if (id === "vanity") return (
    <>
      <ellipse cx="28" cy="40" rx="9" ry="10" fill="none" stroke={accent} strokeWidth="1.8" opacity="0.7"/>
      <line x1="28" y1="50" x2="28" y2="56" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
      <line x1="21" y1="56" x2="35" y2="56" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
    </>
  );
  if (id === "closet") return (
    <>
      <line x1="28" y1="32" x2="28" y2="36" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
      <circle cx="28" cy="31" r="2.5" fill="none" stroke={accent} strokeWidth="1.8" opacity="0.7"/>
      <path d="M 28 36 C 22 36 16 40 16 47 L 16 50 L 40 50 L 40 47 C 40 40 34 36 28 36" fill="none" stroke={accent} strokeWidth="1.8" strokeLinejoin="round" opacity="0.7"/>
      <line x1="16" y1="50" x2="40" y2="50" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
    </>
  );
  return null;
}

// ── Door component ─────────────────────────────────────────────────────────────

function LobbyDoor({
  door, onClick, isNight, className = "",
}: {
  door: typeof LOBBY_DOORS[0];
  onClick: () => void;
  isNight: boolean;
  className?: string;
}) {
  const bg = isNight ? door.darkBg : door.bg;
  const isDark = door.dark || isNight;
  const textColor = isDark ? "rgba(255,255,255,0.88)" : "#111111";
  const subColor  = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)";
  const hasNew = (door.newCount ?? 0) > 0 && door.available;

  return (
    <button
      onClick={onClick}
      className={`relative w-full flex flex-col items-center justify-end pb-4 cursor-pointer transition-all duration-200 hover:brightness-[1.06] active:scale-[0.97] ${hasNew ? "bb-notify-glow" : ""} ${className}`}
      style={{
        background: bg,
        boxShadow: isDark
          ? "0 4px 24px rgba(0,0,0,0.4)"
          : "0 4px 20px rgba(0,0,0,0.08)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {/* Night glow */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 30% 25%, ${door.accent}22 0%, transparent 65%)` }} />
      )}

      {/* Coming soon */}
      {!door.available && (
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[7px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
            style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)", color: isDark ? "rgba(255,255,255,0.3)" : "#bbb" }}>
            Soon
          </span>
        </div>
      )}

      {/* New-content badge */}
      {hasNew && (
        <div className="absolute top-3 right-3 z-20">
          <span className="min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-white px-1"
            style={{ background: "#FF1F7D", boxShadow: `0 0 0 2px ${bg}` }}>
            {door.newCount}
          </span>
        </div>
      )}

      {/* SVG arch door */}
      <div className="flex-1 flex items-center justify-center pt-3 relative z-10">
        <svg viewBox="0 0 56 76" width="52" height="70">
          {/* Arch door outline */}
          <path
            d="M 6 72 L 6 28 A 22 22 0 0 1 50 28 L 50 72 Z"
            fill={`${door.accent}14`}
            stroke={door.accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner panel line */}
          <path
            d="M 12 66 L 12 32 A 16 16 0 0 1 44 32 L 44 66"
            fill="none"
            stroke={door.accent}
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.3"
          />
          {/* Door knob */}
          <circle cx="40" cy="50" r="2.5" fill={door.accent} opacity="0.65"/>
          {/* Room symbol */}
          <DoorSymbol id={door.id} accent={door.accent} />
        </svg>
      </div>

      {/* Room info */}
      <div className="relative z-10 text-center px-2 pb-0">
        <p className="font-bold italic leading-tight"
          style={{ fontFamily: "var(--font-playfair)", color: textColor, fontSize: "clamp(11px, 1.3vw, 14px)" }}>
          {door.name}
        </p>
        <p className="text-[8px] mt-0.5" style={{ color: subColor }}>{door.sub}</p>
        {door.hint && door.available && (
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="w-1 h-1 rounded-full animate-pulse flex-shrink-0" style={{ background: door.accent }} />
            <span className="text-[8px] font-bold" style={{ color: door.accent }}>{door.hint}</span>
          </div>
        )}
      </div>
    </button>
  );
}

// ── The Wall ─────────────────────────────────────────────────────────────────

function TheWall({ onBack }: { onBack: () => void }) {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<"all" | "trending" | WallCategory>("all");
  const [newCategory, setNewCategory] = useState<WallCategory>("gather");
  const [posts, setPosts] = useState<WallPost[]>(SEED_POSTS);

  const trending = [...posts].sort((a, b) => (b.likes + b.replies * 2) - (a.likes + a.replies * 2)).slice(0, 4);
  const shown = filter === "all" ? posts : filter === "trending" ? trending : posts.filter(p => p.category === filter);

  function handlePost() {
    if (!text.trim()) return;
    setPosts(prev => [{ id: Date.now(), author: "You", initial: "Y", color: "#FF1F7D", time: "just now", text: text.trim(), likes: 0, replies: 0, pinned: false, category: newCategory }, ...prev]);
    setText("");
  }

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-4 md:px-10 md:pt-8 flex items-center gap-4">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,31,125,0.1)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#FF1F7D" }}>THE LOBBY</p>
          <h1 className="text-3xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>The Wall</h1>
        </div>
      </div>
      <div className="md:grid md:grid-cols-[1fr_340px] md:gap-6 px-5 md:px-10">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
            {WALL_FILTERS.map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
                style={filter === f.value ? { background: "#111", color: "white" } : { background: "white", color: "#666", border: "1.5px solid #EAEAEA" }}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(255,31,125,0.08)", borderLeft: "4px solid #FF1F7D" }}>
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "#FF1F7D" }}>Y</div>
                <textarea value={text} onChange={e => setText(e.target.value)}
                  placeholder="What are you planning, gathering, or looking for?…" rows={3}
                  className="flex-1 resize-none text-sm outline-none px-3.5 py-2.5 rounded-xl"
                  style={{ background: "white", color: "#111111", border: "1.5px solid #F0E0E8", lineHeight: "1.6" }}/>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
                  {(["gather","discover","plan","now","ask"] as WallCategory[]).map(cat => (
                    <button key={cat} onClick={() => setNewCategory(cat)}
                      className="px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap capitalize flex-shrink-0 transition-all"
                      style={newCategory === cat ? { background: "#FF1F7D", color: "white" } : { background: "#FFE0EE", color: "#FF1F7D" }}>
                      {cat}
                    </button>
                  ))}
                </div>
                <button onClick={handlePost} disabled={!text.trim()}
                  className="flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold text-white transition-all active:scale-95"
                  style={{ background: text.trim() ? "#FF1F7D" : "#E0C0CC" }}>
                  Post
                </button>
              </div>
            </div>
          </div>
          {shown.map(post => (
            <div key={post.id} className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: post.pinned ? "3px solid #FF1F7D" : "3px solid transparent" }}>
              <div className="p-4">
                {post.pinned && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#FF1F7D"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#FF1F7D" }}>PINNED</span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: post.color }}>{post.initial}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <p className="font-bold text-sm" style={{ color: "#111" }}>{post.author}</p>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ background: "#FFE0EE", color: "#FF1F7D" }}>{post.category}</span>
                      <p className="text-xs" style={{ color: "#bbb" }}>{post.time}</p>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#444" }}>{post.text}</p>
                    <div className="flex items-center gap-5 mt-3">
                      <button onClick={() => { const n = new Set(liked); if (n.has(post.id)) n.delete(post.id); else n.add(post.id); setLiked(n); }}
                        className="flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: liked.has(post.id) ? "#FF1F7D" : "rgba(0,0,0,0.28)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={liked.has(post.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg>
                        {post.likes + (liked.has(post.id) ? 1 : 0)}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "rgba(0,0,0,0.28)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                        {post.replies}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Desktop sidebar */}
        <div className="hidden md:flex flex-col gap-4 pt-0">
          <div className="rounded-2xl p-5" style={{ background: "#111", boxShadow: "0 8px 28px rgba(0,0,0,0.2)" }}>
            <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#FF69B4" }}>TRENDING NOW</p>
            {[...SEED_POSTS].sort((a,b) => b.likes - a.likes).slice(0,3).map(p => (
              <div key={p.id} className="py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-xs font-semibold text-white leading-snug truncate">{p.text.slice(0, 60)}…</p>
                <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>✿ {p.likes} · {p.author}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-4" style={{ background: "#FFF0F5" }}>
            <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "#FF1F7D" }}>IN THE LOBBY</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>35</p>
            <p className="text-xs" style={{ color: "#aaa" }}>women here right now</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Girl Bar ─────────────────────────────────────────────────────────────────

function GirlBar({ onBack }: { onBack: () => void }) {
  const [joined, setJoined] = useState<Set<number>>(new Set());

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "#0D0B14" }}>
      <div className="px-5 pt-12 pb-4 md:px-10 md:pt-8 flex items-center gap-4">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF69B4" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#FF69B4" }}>THE LOBBY</p>
          <h1 className="text-3xl font-bold italic text-white" style={{ fontFamily: "var(--font-playfair)" }}>Girl Bar</h1>
        </div>
      </div>
      <div className="px-5 md:px-10 md:grid md:grid-cols-[1fr_300px] md:gap-6">
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl relative overflow-hidden" style={{ background: "#1A1428", minHeight: "140px", boxShadow: "0 8px 32px rgba(255,31,125,0.18)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,31,125,0.2) 0%, transparent 65%)" }}/>
            <div className="relative p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#FF1F7D" }} />
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#FF69B4" }}>LIVE NOW</p>
              </div>
              <p className="text-white text-2xl font-bold italic mb-1" style={{ fontFamily: "var(--font-playfair)" }}>Girls Talk Late.</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Live audio rooms. No recordings. Drop in, drop out.</p>
            </div>
          </div>
          {GIRL_BAR_ROOMS.map(r => (
            <div key={r.id} className="rounded-2xl overflow-hidden flex items-stretch" style={{ background: "#1C1830", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
              <div className="w-1.5 flex-shrink-0" style={{ background: r.live ? "linear-gradient(180deg,#FF1F7D,#FF69B4)" : "#2A1840" }}/>
              <div className="flex-1 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: r.live ? "#FF1F7D" : "rgba(255,105,180,0.12)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={r.live ? "white" : "#FF69B4"}>
                    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-sm text-white">{r.name}</p>
                    {r.live && <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#FF1F7D" }}/>}
                  </div>
                  <p className="text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>{r.desc}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: r.live ? "rgba(255,31,125,0.15)" : "rgba(255,255,255,0.06)", color: r.live ? "#FF69B4" : "rgba(255,255,255,0.3)" }}>
                    {r.women} {r.live ? "listening" : "waiting"}
                  </span>
                </div>
                <button onClick={() => setJoined(p => { const n = new Set(p); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; })}
                  className="flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95"
                  style={joined.has(r.id) ? { background: "rgba(255,31,125,0.15)", color: "#FF69B4" } : { background: "#FF1F7D", color: "white" }}>
                  {joined.has(r.id) ? "In room ✓" : "Join"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:flex flex-col gap-4 pt-0">
          <div className="rounded-2xl p-5" style={{ background: "#1C1830" }}>
            <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#FF69B4" }}>INSIDE GIRL BAR</p>
            <p className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>27</p>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>women listening now</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComingSoonRoom({ name, sub, onBack }: { name: string; sub: string; onBack: () => void }) {
  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-4 md:px-10 md:pt-8 flex items-center gap-4">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,31,125,0.1)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#FF1F7D" }}>THE LOBBY</p>
          <h1 className="text-3xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{name}</h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center px-8">
        <p className="text-base font-bold italic mb-2" style={{ fontFamily: "var(--font-instrument)", color: "#111" }}>{name} is being prepared.</p>
        <p className="text-sm leading-relaxed mb-2" style={{ color: "#aaa" }}>{sub}</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "17px", color: "#FF1F7D" }}>Yande is getting this room ready.</p>
      </div>
    </div>
  );
}

// ── Lobby Main — actual doors ─────────────────────────────────────────────────

export default function TheLobbyPage() {
  const [room, setRoom] = useState<Room>("lobby");
  const [tod, setTod] = useState<TimeOfDay>("morning");
  const [activeTab, setActiveTab] = useState<"lobby" | "wall" | "girlbar">("lobby");

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
  }, []);

  const isNight = tod === "evening" || tod === "night";
  const isEvening = tod === "evening";
  const headingColor = isNight ? "rgba(240,232,255,0.92)" : "#111111";
  const textMuted = isNight ? "rgba(200,190,225,0.52)" : "#888";
  const cardBg = isNight ? (isEvening ? "#1E1830" : "#191428") : "white";
  const borderCol = isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const bgColor = isNight ? "var(--pale-pink-bg)" : "#F5F0EC";

  // ── Mobile: sub-page routing still works ──────────────────────────────────────
  if (room === "wall")      return <TheWall onBack={() => setRoom("lobby")} />;
  if (room === "girlbar")   return <GirlBar onBack={() => setRoom("lobby")} />;
  if (room === "new-keys")  return <ComingSoonRoom name="New Keys"   sub="Where newcomers arrive and introduce themselves." onBack={() => setRoom("lobby")} />;
  if (room === "vanity")    return <ComingSoonRoom name="The Vanity" sub="Beauty advice, recommendations, and routines." onBack={() => setRoom("lobby")} />;
  if (room === "closet")    return <ComingSoonRoom name="The Closet" sub="Outfit questions, style finds, and dressing for the city." onBack={() => setRoom("lobby")} />;

  const totalWomen = GIRL_BAR_ROOMS.reduce((s, r) => s + r.women, 0);
  const trendingPosts = [...SEED_POSTS].sort((a, b) => (b.likes + b.replies * 2) - (a.likes + a.replies * 2)).slice(0, 3);

  return (
    <>
      {/* ── MOBILE ─────────────────────────────────────────────────────────── */}
      <div className="md:hidden min-h-screen pb-24" style={{ background: bgColor }}>

        {/* Header */}
        <div className="px-6 pt-12 pb-6 flex-shrink-0">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "var(--bb-pink)" }}>✦ BLOOMBAY</p>
          <h1 className="text-4xl font-bold italic leading-none mb-1"
            style={{ fontFamily: "var(--font-playfair)", color: headingColor }}>
            The Lobby
          </h1>
          <p className="text-sm italic" style={{ fontFamily: "var(--font-instrument)", color: textMuted }}>
            Step inside. Choose your room.
          </p>
        </div>

        {/* 2 main doors — tall */}
        <div className="px-5 pb-2 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2" style={{ height: "300px" }}>
            {LOBBY_DOORS.slice(0, 2).map(door => (
              <LobbyDoor
                key={door.id}
                door={door}
                onClick={() => setRoom(door.id)}
                isNight={isNight}
                className="h-full"
              />
            ))}
          </div>
          {/* 3 side rooms — shorter */}
          <div className="grid grid-cols-3 gap-2" style={{ height: "180px" }}>
            {LOBBY_DOORS.slice(2).map(door => (
              <LobbyDoor
                key={door.id}
                door={door}
                onClick={() => setRoom(door.id)}
                isNight={isNight}
                className="h-full"
              />
            ))}
          </div>
        </div>

        {/* Live indicator */}
        <div className="px-5 pb-6 pt-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-full"
            style={{ background: "#111" }}>
            <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: "var(--bb-pink)" }} />
            <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>35 women in The Lobby right now</p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP 3-PANEL ────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:flex-col" style={{ height: "100vh", background: bgColor }}>

        {/* Top bar */}
        <div className="flex-shrink-0 flex items-center gap-0 px-6 border-b"
          style={{ height: "64px", borderColor: borderCol, background: cardBg }}>
          {/* Brand */}
          <p className="font-bold italic text-lg tracking-tight mr-8"
            style={{ fontFamily: "var(--font-playfair)", color: headingColor }}>
            THE LOBBY
          </p>
          {/* Tab buttons */}
          <div className="flex items-center gap-1 flex-1">
            {(["lobby", "wall", "girlbar"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-full text-xs font-bold transition-all"
                style={activeTab === tab
                  ? { background: "var(--bb-pink)", color: "white" }
                  : { background: "transparent", color: textMuted }}
              >
                {tab === "lobby" ? "Lobby" : tab === "wall" ? "The Wall" : "Girl Bar"}
              </button>
            ))}
          </div>
          {/* Women count badge */}
          <div className="flex items-center gap-2 flex-shrink-0" style={{ marginRight: "256px" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--bb-pink)" }} />
            <span className="text-xs font-bold" style={{ color: textMuted }}>35 women here</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left panel — room doors list */}
          <div className="flex-shrink-0 flex flex-col gap-2 p-3 overflow-y-auto border-r"
            style={{ width: "220px", borderColor: borderCol, background: cardBg }}>
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase px-2 pt-1 pb-0.5" style={{ color: textMuted }}>ROOMS</p>
            {LOBBY_DOORS.map(door => {
              const isActive = activeTab === door.id || (activeTab === "lobby" && false);
              const isDark = door.dark || isNight;
              return (
                <button
                  key={door.id}
                  onClick={() => {
                    if (door.id === "wall") setActiveTab("wall");
                    else if (door.id === "girlbar") setActiveTab("girlbar");
                    else setRoom(door.id);
                  }}
                  className="w-full text-left px-3 py-3 rounded-xl transition-all"
                  style={{
                    background: isActive
                      ? "rgba(255,31,125,0.1)"
                      : isNight ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    border: `1px solid ${isActive ? "rgba(255,31,125,0.2)" : borderCol}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    {door.available && door.hint && (
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                        style={{ background: door.accent }} />
                    )}
                    <p className="font-bold text-xs" style={{ color: headingColor, fontFamily: "var(--font-playfair)" }}>
                      {door.name}
                    </p>
                    {!door.available && (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded ml-auto"
                        style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: textMuted }}>
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="text-[10px]" style={{ color: textMuted }}>{door.sub}</p>
                  {door.hint && door.available && (
                    <p className="text-[9px] font-bold mt-1" style={{ color: door.accent }}>{door.hint}</p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Center panel */}
          <div className="flex-1 overflow-y-auto" style={{ background: bgColor }}>
            {activeTab === "lobby" && (
              <div className="p-6 h-full flex flex-col">
                <div className="mb-4">
                  <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "var(--bb-pink)" }}>✦ BLOOMBAY</p>
                  <h2 className="text-3xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: headingColor }}>
                    The Lobby
                  </h2>
                  <p className="text-sm italic mt-1" style={{ fontFamily: "var(--font-instrument)", color: textMuted }}>
                    Step inside. Choose your room.
                  </p>
                </div>
                {/* 2×2 door grid */}
                <div className="grid grid-cols-2 gap-3 flex-1" style={{ maxHeight: "520px" }}>
                  {LOBBY_DOORS.slice(0, 4).map(door => (
                    <LobbyDoor
                      key={door.id}
                      door={door}
                      onClick={() => {
                        if (door.id === "wall") setActiveTab("wall");
                        else if (door.id === "girlbar") setActiveTab("girlbar");
                        else setRoom(door.id);
                      }}
                      isNight={isNight}
                      className="h-full min-h-[160px]"
                    />
                  ))}
                </div>
              </div>
            )}
            {activeTab === "wall" && (
              <TheWall onBack={() => setActiveTab("lobby")} />
            )}
            {activeTab === "girlbar" && (
              <GirlBar onBack={() => setActiveTab("lobby")} />
            )}
          </div>

          {/* Right panel */}
          <div className="flex-shrink-0 flex flex-col gap-4 p-4 overflow-y-auto border-l"
            style={{ width: "240px", borderColor: borderCol, background: cardBg }}>

            {/* Live women count */}
            <div className="rounded-xl p-4" style={{ background: isNight ? "rgba(255,31,125,0.1)" : "#FFF0F5" }}>
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "var(--bb-pink)" }}>LIVE NOW</p>
              <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: headingColor }}>
                {totalWomen}
              </p>
              <p className="text-xs mt-0.5" style={{ color: textMuted }}>women in the lobby</p>
            </div>

            {/* Trending posts */}
            <div>
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2.5" style={{ color: textMuted }}>TRENDING ON THE WALL</p>
              <div className="flex flex-col gap-2">
                {trendingPosts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActiveTab("wall")}
                    className="w-full text-left p-2.5 rounded-xl transition-all hover:opacity-80"
                    style={{ background: isNight ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)", border: `1px solid ${borderCol}` }}
                  >
                    <p className="text-[11px] font-semibold leading-snug line-clamp-2" style={{ color: headingColor }}>
                      {p.text.slice(0, 55)}…
                    </p>
                    <p className="text-[9px] mt-1" style={{ color: textMuted }}>✿ {p.likes} · {p.author}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Girl Bar live indicator */}
            <div className="rounded-xl p-3 flex items-center gap-2.5"
              style={{ background: "#111", border: "1px solid rgba(255,105,180,0.15)" }}>
              <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: "#FF69B4" }} />
              <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                Girl Bar · 27 women
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
