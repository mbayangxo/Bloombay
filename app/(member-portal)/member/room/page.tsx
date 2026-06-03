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
  { id: "wall" as Room,     name: "The Wall",    sub: "Community board",       hint: "42 posts today",        bg: "#F8F5F0", darkBg: "#1A1830", dark: false, accent: "#FF1F7D", available: true  },
  { id: "girlbar" as Room,  name: "Girl Bar",    sub: "Live audio rooms",      hint: "27 women listening",    bg: "#111118", darkBg: "#111118", dark: true,  accent: "#FF69B4", available: true  },
  { id: "new-keys" as Room, name: "New Keys",    sub: "Newcomers & arrivals",  hint: "",                      bg: "#FFF0F5", darkBg: "#1C1428", dark: false, accent: "#FF1F7D", available: false },
  { id: "vanity" as Room,   name: "The Vanity",  sub: "Beauty & style",        hint: "",                      bg: "#FBF3F7", darkBg: "#1A1428", dark: false, accent: "#FF69B4", available: false },
  { id: "closet" as Room,   name: "The Closet",  sub: "Outfits & what to wear",hint: "",                      bg: "#F5F0EC", darkBg: "#181428", dark: false, accent: "#FF1F7D", available: false },
];

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
  const frameColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const knobColor  = isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)";

  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left cursor-pointer transition-all duration-300 group hover:brightness-[1.04] active:scale-[0.98] ${className}`}
      style={{
        background: bg,
        boxShadow: isDark
          ? "inset 0 0 0 10px rgba(255,255,255,0.04), 4px 0 24px rgba(0,0,0,0.4)"
          : "inset 0 0 0 10px rgba(0,0,0,0.025), 0 8px 32px rgba(0,0,0,0.10)",
        borderRadius: "3px 3px 0 0",
      }}
    >
      {/* Night glow for dark doors */}
      {isDark && (
        <div className="absolute inset-0 rounded-sm pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 30% 30%, ${door.accent}22 0%, transparent 65%)` }} />
      )}

      {/* Outer door frame */}
      <div className="absolute inset-[8px] rounded-[2px] pointer-events-none"
        style={{ border: `1px solid ${frameColor}` }} />

      {/* Upper panel */}
      <div className="absolute pointer-events-none"
        style={{ top: "18px", left: "18px", right: "18px", height: "38%", border: `1px solid ${frameColor}`, borderRadius: "1px" }} />

      {/* Lower panel */}
      <div className="absolute pointer-events-none"
        style={{ top: "calc(18px + 38% + 12px)", left: "18px", right: "18px", bottom: "52px", border: `1px solid ${frameColor}`, borderRadius: "1px" }} />

      {/* Door knob */}
      <div className="absolute" style={{ right: "18px", top: "50%", transform: "translateY(-50%)" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: knobColor, boxShadow: `0 0 0 3px ${frameColor}` }} />
      </div>

      {/* Coming soon badge */}
      {!door.available && (
        <div className="absolute top-4 left-4">
          <span className="text-[7px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
            style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)", color: isDark ? "rgba(255,255,255,0.3)" : "#bbb" }}>
            Soon
          </span>
        </div>
      )}

      {/* Room info — bottom */}
      <div className="absolute bottom-4 left-4 right-10">
        <p className="font-bold italic leading-tight"
          style={{
            fontFamily: "var(--font-playfair)",
            color: textColor,
            fontSize: "clamp(13px, 1.4vw, 18px)",
          }}>
          {door.name}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: subColor }}>{door.sub}</p>
        {door.hint && door.available && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
              style={{ background: door.accent }} />
            <span className="text-[9px] font-bold" style={{ color: door.accent }}>{door.hint}</span>
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

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
  }, []);

  const isNight = tod === "evening" || tod === "night";
  const bgColor = isNight ? "var(--pale-pink-bg)" : "#F5F0EC";
  const headingColor = isNight ? "rgba(240,232,255,0.92)" : "#111111";
  const mutedColor = isNight ? "rgba(190,180,215,0.45)" : "rgba(0,0,0,0.38)";

  if (room === "wall")      return <TheWall onBack={() => setRoom("lobby")} />;
  if (room === "girlbar")   return <GirlBar onBack={() => setRoom("lobby")} />;
  if (room === "new-keys")  return <ComingSoonRoom name="New Keys"   sub="Where newcomers arrive and introduce themselves." onBack={() => setRoom("lobby")} />;
  if (room === "vanity")    return <ComingSoonRoom name="The Vanity" sub="Beauty advice, recommendations, and routines." onBack={() => setRoom("lobby")} />;
  if (room === "closet")    return <ComingSoonRoom name="The Closet" sub="Outfit questions, style finds, and dressing for the city." onBack={() => setRoom("lobby")} />;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bgColor }}>

      {/* Header */}
      <div className="px-6 pt-12 pb-6 md:px-10 md:pt-8 flex-shrink-0">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ BLOOMBAY</p>
        <h1 className="text-4xl font-bold italic leading-none mb-1"
          style={{ fontFamily: "var(--font-playfair)", color: headingColor }}>
          The Lobby
        </h1>
        <p className="text-sm italic" style={{ fontFamily: "var(--font-instrument)", color: mutedColor }}>
          Step inside. Choose your room.
        </p>
      </div>

      {/* ── DESKTOP: 5 doors side by side filling full height ── */}
      <div className="hidden md:grid px-6 pb-6 gap-2" style={{ minHeight: "68vh", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }}>
        {LOBBY_DOORS.map(door => (
          <LobbyDoor
            key={door.id}
            door={door}
            onClick={() => setRoom(door.id)}
            isNight={isNight}
            className="h-full"
          />
        ))}
      </div>

      {/* ── MOBILE: 2 big doors + 3 small doors ── */}
      <div className="md:hidden px-5 pb-20 flex flex-col gap-2">
        {/* 2 main doors — tall */}
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
      <div className="md:hidden px-5 pb-6">
        <div className="flex items-center gap-3 px-4 py-3 rounded-full"
          style={{ background: "#111" }}>
          <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: "#FF1F7D" }} />
          <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>35 women in The Lobby right now</p>
        </div>
      </div>
    </div>
  );
}
