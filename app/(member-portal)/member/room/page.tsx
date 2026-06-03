"use client";

import { useState } from "react";

type Room = "lobby" | "wall" | "girlbar" | "new-keys" | "vanity" | "closet";
type WallCategory = "gather" | "discover" | "plan" | "now" | "ask";

interface WallPost {
  id: number; author: string; initial: string; color: string;
  time: string; text: string; likes: number; replies: number;
  pinned: boolean; category: WallCategory;
}


const CATEGORY_LABELS: Record<WallCategory, string> = {
  gather: "Gather", discover: "Discover", plan: "Plan", now: "Now", ask: "Ask",
};

const WALL_FILTERS: { label: string; value: WallCategory | "all" | "trending" }[] = [
  { label: "All",       value: "all"      },
  { label: "🔥 Now",    value: "trending" },
  { label: "Gather",    value: "gather"   },
  { label: "Discover",  value: "discover" },
  { label: "Plan",      value: "plan"     },
  { label: "Happening", value: "now"      },
  { label: "Ask",       value: "ask"      },
];

const GIRL_BAR_ROOMS = [
  { id: 1, name: "Morning Room",  desc: "Coffee talk, slow start, soft energy",  women: 8,  live: true  },
  { id: 2, name: "Night Owl",     desc: "Late-night conversations, no filter",    women: 14, live: true  },
  { id: 3, name: "Study With Me", desc: "Silent co-working, you're not alone",    women: 5,  live: true  },
  { id: 4, name: "Sunday Soft",   desc: "Decompressing before the week starts",   women: 3,  live: false },
];

// ── Category card styles ──────────────────────────────────────────────────────

function getCategoryStyle(category: WallCategory): React.CSSProperties {
  switch (category) {
    case "gather":
      return {
        background: "#FEFAF3",
        borderLeft: "3px solid #FF69B4",
      };
    case "now":
      return {
        background: "#111111",
        borderLeft: "3px solid #FF1F7D",
      };
    case "plan":
      return {
        background: "#FFF0F7",
        borderLeft: "3px solid #FFB6D0",
      };
    case "discover":
      return {
        background: "#FFFFFF",
        borderLeft: "3px solid #FFE0EE",
      };
    case "ask":
      return {
        background: "#F7F0FF",
        borderLeft: "3px solid #D0AAFF",
      };
  }
}

function getCategoryTextColor(category: WallCategory): string {
  return category === "now" ? "rgba(255,255,255,0.9)" : "#2A2020";
}

function getCategorySubColor(category: WallCategory): string {
  return category === "now" ? "rgba(255,255,255,0.5)" : "#888";
}

// ── The Wall ─────────────────────────────────────────────────────────────────

function TheWall({ onBack }: { onBack: () => void }) {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<"all" | "trending" | WallCategory>("all");
  const [newCategory, setNewCategory] = useState<WallCategory>("gather");
  const [posts, setPosts] = useState<WallPost[]>([]);

  const trending = [...posts].sort((a, b) => (b.likes + b.replies * 2) - (a.likes + a.replies * 2)).slice(0, 4);
  const shown = filter === "all" ? posts : filter === "trending" ? trending : posts.filter(p => p.category === filter);

  function handlePost() {
    if (!text.trim()) return;
    setPosts(prev => [{ id: Date.now(), author: "You", initial: "Y", color: "#FF1F7D", time: "just now", text: text.trim(), likes: 0, replies: 0, pinned: false, category: newCategory }, ...prev]);
    setText("");
  }

  // Split shown posts into two columns for masonry layout
  const col1: WallPost[] = [];
  const col2: WallPost[] = [];
  shown.filter(p => !p.pinned).forEach((p, i) => {
    if (i % 2 === 0) col1.push(p);
    else col2.push(p);
  });
  const pinned = shown.filter(p => p.pinned);

  return (
    <div
      className="min-h-screen pb-24 md:pb-10"
      style={{ background: "#FDFAF6" }}
    >
      {/* ── keyframes injected inline ── */}
      <style>{`
        @keyframes wall-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .wall-post { animation: wall-fade-in 0.35s ease both; }
      `}</style>

      {/* Header */}
      <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8 flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,31,125,0.08)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>THE LOBBY</p>
          <h1
            className="text-3xl italic leading-tight"
            style={{ fontFamily: "var(--font-playfair)", color: "#1A1010", fontWeight: 700 }}
          >
            The Wall
            <span style={{ color: "var(--bb-pink)", marginLeft: "0.35em", fontSize: "0.6em", verticalAlign: "middle" }}>✦</span>
          </h1>
        </div>
      </div>

      <div className="px-5 md:px-8 flex flex-col gap-5">

        {/* ── Filter chips — editorial stamp style ── */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {WALL_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="px-4 py-1.5 rounded-full text-[11px] whitespace-nowrap flex-shrink-0 transition-all duration-150 active:scale-95"
              style={filter === f.value
                ? {
                    background: "var(--bb-pink)",
                    color: "white",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    boxShadow: "0 2px 10px rgba(255,31,125,0.35)",
                  }
                : {
                    background: "transparent",
                    color: "#888",
                    border: "1.5px solid #E8DDD8",
                    fontFamily: "var(--font-caveat)",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Compose — letter feel ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#FEF8EE",
            boxShadow: "0 2px 16px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,180,120,0.18)",
          }}
        >
          {/* Torn-paper top line */}
          <div style={{ height: "3px", background: "repeating-linear-gradient(90deg, #FFB6D0 0px, #FFB6D0 6px, transparent 6px, transparent 12px)" }}/>
          <div className="p-4">
            <p
              className="text-[10px] font-bold tracking-widest uppercase mb-3"
              style={{ color: "#C090A0" }}
            >
              Write something ✦
            </p>
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: "var(--bb-pink)" }}
              >
                Y
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="What are you gathering, planning, or wondering about…"
                rows={3}
                className="flex-1 resize-none text-sm outline-none"
                style={{
                  background: "transparent",
                  color: "#2A1820",
                  border: "none",
                  borderBottom: "1px dashed #E8D0D8",
                  lineHeight: "1.75",
                  fontFamily: "var(--font-instrument)",
                  fontSize: "14px",
                  paddingBottom: "6px",
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
                {(["gather","discover","plan","now","ask"] as WallCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    className="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap capitalize flex-shrink-0 transition-all"
                    style={newCategory === cat
                      ? { background: "var(--bb-pink)", color: "white", textTransform: "uppercase", letterSpacing: "0.06em" }
                      : { background: "rgba(255,31,125,0.08)", color: "var(--bb-pink)", textTransform: "uppercase", letterSpacing: "0.06em" }}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
              <button
                onClick={handlePost}
                disabled={!text.trim()}
                className="flex-shrink-0 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest text-white transition-all active:scale-95"
                style={{
                  background: text.trim() ? "var(--bb-pink)" : "#E0C8D0",
                  letterSpacing: "0.1em",
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* ── Empty state ── */}
        {shown.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: "#FFF0F5", boxShadow: "0 0 0 6px rgba(255,31,125,0.06)" }}
            >
              <span style={{ fontSize: "22px" }}>✦</span>
            </div>
            <p
              className="text-lg italic mb-1"
              style={{ fontFamily: "var(--font-playfair)", color: "#2A1820", fontWeight: 700 }}
            >
              The Wall is quiet.
            </p>
            <p className="text-sm" style={{ color: "#C0A8B0", fontFamily: "var(--font-instrument)" }}>
              Be the first to leave something here.
            </p>
          </div>
        )}

        {/* ── Pinned posts — full width ── */}
        {pinned.map(post => (
          <WallPostCard key={post.id} post={post} liked={liked} setLiked={setLiked} fullWidth />
        ))}

        {/* ── 2-column masonry grid ── */}
        {shown.length > 0 && (col1.length > 0 || col2.length > 0) && (
          <div className="grid grid-cols-2 gap-3 items-start">
            <div className="flex flex-col gap-3">
              {col1.map(post => (
                <WallPostCard key={post.id} post={post} liked={liked} setLiked={setLiked} />
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {col2.map(post => (
                <WallPostCard key={post.id} post={post} liked={liked} setLiked={setLiked} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function WallPostCard({
  post, liked, setLiked, fullWidth,
}: {
  post: WallPost;
  liked: Set<number>;
  setLiked: React.Dispatch<React.SetStateAction<Set<number>>>;
  fullWidth?: boolean;
}) {
  const cardStyle = getCategoryStyle(post.category);
  const textColor = getCategoryTextColor(post.category);
  const subColor = getCategorySubColor(post.category);
  const isDark = post.category === "now";

  return (
    <div
      className="wall-post rounded-2xl overflow-hidden"
      style={{
        ...cardStyle,
        boxShadow: isDark
          ? "0 4px 20px rgba(255,31,125,0.18)"
          : "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div className="p-3.5">
        {/* Now label */}
        {post.category === "now" && (
          <p
            className="text-[8px] font-black tracking-[0.18em] mb-2"
            style={{ color: "#FF1F7D", textTransform: "uppercase" }}
          >
            HAPPENING NOW
          </p>
        )}

        {/* Pinned indicator */}
        {post.pinned && (
          <div className="flex items-center gap-1 mb-2">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="var(--bb-pink)">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
            </svg>
            <span className="text-[8px] font-black tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>PINNED</span>
          </div>
        )}

        {/* Author row */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
            style={{ background: post.color }}
          >
            {post.initial}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-[13px] italic font-bold leading-tight truncate"
              style={{ fontFamily: "var(--font-playfair)", color: textColor }}
            >
              {post.author}
            </p>
            <p className="text-[9px]" style={{ color: subColor }}>{post.time}</p>
          </div>
          {/* Category stamp */}
          <span
            className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
            style={isDark
              ? { background: "rgba(255,31,125,0.25)", color: "#FF69B4" }
              : { background: "rgba(255,31,125,0.08)", color: "var(--bb-pink)" }}
          >
            {CATEGORY_LABELS[post.category]}
          </span>
        </div>

        {/* Post text */}
        <p
          className="text-[13px] leading-relaxed mb-3"
          style={{
            color: isDark ? "rgba(255,255,255,0.82)" : "#3A2830",
            fontFamily: "var(--font-instrument)",
            lineHeight: "1.65",
          }}
        >
          {post.text}
        </p>

        {/* Actions — minimal icon + count */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const n = new Set(liked);
              if (n.has(post.id)) n.delete(post.id); else n.add(post.id);
              setLiked(n);
            }}
            className="flex items-center gap-1 transition-colors"
            style={{ color: liked.has(post.id) ? "#FF1F7D" : (isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.22)") }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={liked.has(post.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <span className="text-[11px] font-bold">{post.likes + (liked.has(post.id) ? 1 : 0)}</span>
          </button>
          <button
            className="flex items-center gap-1"
            style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.22)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <span className="text-[11px] font-bold">{post.replies}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Girl Bar ─────────────────────────────────────────────────────────────────

function GirlBar({ onBack }: { onBack: () => void }) {
  const [joined, setJoined] = useState<Set<number>>(new Set());
  const [notified, setNotified] = useState<Set<number>>(new Set());

  const liveCount = GIRL_BAR_ROOMS.filter(r => r.live).reduce((acc, r) => acc + r.women, 0);

  // Deterministic avatar colors per room slot
  const avatarColors = ["#FF1F7D","#FF69B4","#C084FC","#FB923C","#34D399","#60A5FA","#F472B6","#A78BFA"];

  return (
    <div
      className="min-h-screen pb-24 md:pb-10"
      style={{ background: "#0D0810" }}
    >
      {/* ── keyframes ── */}
      <style>{`
        @keyframes gb-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.88); }
        }
        @keyframes gb-bar1 { 0%,100% { height: 8px; }  50% { height: 18px; } }
        @keyframes gb-bar2 { 0%,100% { height: 14px; } 50% { height: 6px;  } }
        @keyframes gb-bar3 { 0%,100% { height: 10px; } 50% { height: 22px; } }
        @keyframes gb-bar4 { 0%,100% { height: 18px; } 50% { height: 10px; } }
        @keyframes gb-bar5 { 0%,100% { height: 6px;  } 50% { height: 16px; } }
        @keyframes gb-glow-breathe {
          0%,100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .gb-pulse-dot { animation: gb-pulse 1.6s ease-in-out infinite; }
        .gb-bar1 { animation: gb-bar1 0.9s ease-in-out infinite; }
        .gb-bar2 { animation: gb-bar2 1.1s ease-in-out infinite; }
        .gb-bar3 { animation: gb-bar3 0.8s ease-in-out infinite; }
        .gb-bar4 { animation: gb-bar4 1.3s ease-in-out infinite; }
        .gb-bar5 { animation: gb-bar5 1.0s ease-in-out infinite; }
        .gb-glow { animation: gb-glow-breathe 3s ease-in-out infinite; }
      `}</style>

      {/* Back + title */}
      <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8 flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF69B4" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#FF69B4" }}>THE LOBBY</p>
          <h1 className="text-3xl font-bold italic text-white" style={{ fontFamily: "var(--font-playfair)" }}>Girl Bar</h1>
        </div>
      </div>

      <div className="px-5 md:px-8 flex flex-col gap-4">

        {/* ── Atmospheric hero ── */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{ minHeight: "200px" }}
        >
          {/* Multi-layer radial glow background */}
          <div
            style={{
              position: "absolute", inset: 0,
              background: "#120A14",
            }}
          />
          <div
            className="gb-glow"
            style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 25% 60%, rgba(255,31,125,0.28) 0%, transparent 55%)",
            }}
          />
          <div
            style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 75% 30%, rgba(180,60,255,0.14) 0%, transparent 50%)",
            }}
          />
          <div
            style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 100%, rgba(255,105,180,0.12) 0%, transparent 45%)",
            }}
          />

          {/* Floor haze */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "60px",
            background: "linear-gradient(to top, rgba(255,31,125,0.07), transparent)",
          }}/>

          {/* Content */}
          <div className="relative p-7">
            {/* Live badge */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className="gb-pulse-dot w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: "#FF1F7D", boxShadow: "0 0 8px #FF1F7D" }}
              />
              <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: "#FF69B4" }}>
                LIVE · {liveCount} WOMEN IN
              </p>
            </div>

            {/* Headline */}
            <p
              className="text-white text-3xl font-bold italic leading-tight mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              You're in the bar.
            </p>

            {/* Atmospheric subtitle */}
            <p
              className="text-sm italic"
              style={{ color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-caveat)", fontSize: "16px" }}
            >
              Slip in, slip out. No recordings.
            </p>

            {/* Sound wave decoration */}
            <div className="flex items-end gap-1 mt-5" style={{ height: "28px" }}>
              {["gb-bar1","gb-bar2","gb-bar3","gb-bar4","gb-bar5","gb-bar3","gb-bar2"].map((cls, i) => (
                <div
                  key={i}
                  className={cls}
                  style={{
                    width: "3px",
                    borderRadius: "2px",
                    background: i % 2 === 0
                      ? "rgba(255,31,125,0.7)"
                      : "rgba(255,105,180,0.5)",
                    alignSelf: "flex-end",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Room panels ── */}
        {GIRL_BAR_ROOMS.map(r => (
          <div
            key={r.id}
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              ...(r.live ? {
                borderLeft: "2px solid #FF1F7D",
                boxShadow: "0 0 18px rgba(255,31,125,0.14), inset 0 0 0 1px rgba(255,31,125,0.1)",
              } : {
                borderLeft: "2px solid rgba(255,255,255,0.08)",
              }),
            }}
          >
            {/* Subtle ambient glow for live rooms */}
            {r.live && (
              <div
                style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "radial-gradient(ellipse at 0% 50%, rgba(255,31,125,0.08) 0%, transparent 60%)",
                }}
              />
            )}

            <div className="relative p-5">
              {/* Top row: name + live indicator */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {/* Live micro-label */}
                  {r.live && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div
                        className="gb-pulse-dot w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: "#FF1F7D", boxShadow: "0 0 6px #FF1F7D" }}
                      />
                      {/* Animated wave bars */}
                      <div className="flex items-end gap-0.5" style={{ height: "14px" }}>
                        {["gb-bar2","gb-bar3","gb-bar1","gb-bar4","gb-bar2"].map((cls, i) => (
                          <div
                            key={i}
                            className={cls}
                            style={{
                              width: "2px",
                              borderRadius: "1px",
                              background: "#FF1F7D",
                              alignSelf: "flex-end",
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-black tracking-[0.18em] uppercase" style={{ color: "#FF1F7D" }}>LIVE</span>
                    </div>
                  )}
                  <p
                    className="font-bold italic"
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "20px",
                      color: "white",
                      lineHeight: "1.2",
                    }}
                  >
                    {r.name}
                  </p>
                </div>

                {/* Join / Notify button */}
                <button
                  onClick={() => r.live
                    ? setJoined(p => { const n = new Set(p); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; })
                    : setNotified(p => new Set([...p, r.id]))}
                  className="flex-shrink-0 ml-4 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all active:scale-95"
                  style={r.live
                    ? joined.has(r.id)
                      ? {
                          background: "rgba(255,31,125,0.18)",
                          color: "#FF69B4",
                          border: "1px solid rgba(255,31,125,0.4)",
                        }
                      : {
                          background: "#FF1F7D",
                          color: "white",
                          boxShadow: "0 4px 14px rgba(255,31,125,0.45)",
                        }
                    : notified.has(r.id)
                      ? {
                          background: "rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.4)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }
                      : {
                          background: "transparent",
                          color: "rgba(255,255,255,0.5)",
                          border: "1px solid rgba(255,255,255,0.18)",
                        }}
                >
                  {r.live
                    ? (joined.has(r.id) ? "In room ✓" : "Join")
                    : (notified.has(r.id) ? "Notified ✓" : "Notify me")}
                </button>
              </div>

              {/* Desc */}
              <p
                className="text-sm mb-4"
                style={{ color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-instrument)", lineHeight: "1.55" }}
              >
                {r.desc}
              </p>

              {/* Listener avatars */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {Array.from({ length: Math.min(r.women, 6) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full flex-shrink-0"
                      style={{
                        background: avatarColors[i % avatarColors.length],
                        border: "1.5px solid #0D0810",
                        opacity: 0.85 - i * 0.05,
                      }}
                    />
                  ))}
                  {r.women > 6 && (
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1.5px solid #0D0810",
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "8px",
                        fontWeight: 700,
                      }}
                    >
                      +{r.women - 6}
                    </div>
                  )}
                </div>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: r.live ? "rgba(255,105,180,0.7)" : "rgba(255,255,255,0.25)" }}
                >
                  {r.women} {r.live ? "listening" : "waiting"}
                </span>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

// ── Coming Soon Room ─────────────────────────────────────────────────────────

function ComingSoonRoom({ name, sub, onBack }: { name: string; sub: string; onBack: () => void }) {
  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8 flex items-center gap-4">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#FF1F7D" }}>THE LOBBY</p>
          <h1 className="text-3xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>{name}</h1>
        </div>
      </div>
      <div className="px-5 md:px-8 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ background: "#FFE0EC" }}>
          <span className="text-2xl">✦</span>
        </div>
        <p className="text-base font-bold italic mb-2"
          style={{ fontFamily: "var(--font-instrument)", color: "#111111" }}>
          {name} is being prepared.
        </p>
        <p className="text-sm leading-relaxed mb-1" style={{ color: "#aaa" }}>{sub}</p>
        <p className="text-xs italic mt-3" style={{ fontFamily: "var(--font-caveat)", color: "#FF1F7D", fontSize: "16px" }}>
          Yande is getting this room ready for you.
        </p>
      </div>
    </div>
  );
}

// ── The Lobby ────────────────────────────────────────────────────────────────

const LOBBY_DOORS = [
  {
    id: "wall" as Room,
    n: "01",
    name: "The Wall",
    sub: "Community board",
    hint: "42 posts today",
    bg: "#FDFAF7",
    dark: false,
    accent: "#FF1F7D",
    available: true,
  },
  {
    id: "girlbar" as Room,
    n: "02",
    name: "Girl Bar",
    sub: "Live audio rooms",
    hint: "🔴 27 women listening",
    bg: "#1A1008",
    dark: true,
    accent: "#FF69B4",
    available: true,
  },
  {
    id: "new-keys" as Room,
    n: "03",
    name: "New Keys",
    sub: "Newcomers & arrivals",
    hint: "",
    bg: "#FFF0F7",
    dark: false,
    accent: "#FF1F7D",
    available: false,
  },
  {
    id: "vanity" as Room,
    n: "04",
    name: "The Vanity",
    sub: "Beauty & style advice",
    hint: "",
    bg: "#FBF3F7",
    dark: false,
    accent: "#FF69B4",
    available: false,
  },
  {
    id: "closet" as Room,
    n: "05",
    name: "The Closet",
    sub: "Outfits & what to wear",
    hint: "",
    bg: "#F9F5F0",
    dark: false,
    accent: "#FF1F7D",
    available: false,
  },
];

export default function TheLobbyPage() {
  const [room, setRoom] = useState<Room>("lobby");

  if (room === "wall")      return <TheWall         onBack={() => setRoom("lobby")} />;
  if (room === "girlbar")   return <GirlBar          onBack={() => setRoom("lobby")} />;
  if (room === "new-keys")  return <ComingSoonRoom   name="New Keys"    sub="Where newcomers arrive and introduce themselves." onBack={() => setRoom("lobby")} />;
  if (room === "vanity")    return <ComingSoonRoom   name="The Vanity"  sub="Beauty advice, recommendations, and routines from women who know."  onBack={() => setRoom("lobby")} />;
  if (room === "closet")    return <ComingSoonRoom   name="The Closet"  sub="Outfit questions, style finds, and dressing for the city." onBack={() => setRoom("lobby")} />;

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-5 md:px-8 md:pt-8">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>
          ✦ BLOOMBAY
        </p>
        <h1 className="text-4xl font-bold italic leading-none"
          style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
          The Lobby
        </h1>
        <p className="text-sm mt-1 italic" style={{ fontFamily: "var(--font-instrument)", color: "#aaa" }}>
          Step inside. Choose your room.
        </p>
      </div>

      {/* Hallway — 5 architectural doors */}
      <div className="px-5 md:px-8">

        {/* Main doors — Wall + Girl Bar */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {LOBBY_DOORS.slice(0, 2).map((door) => (
            <button
              key={door.id}
              onClick={() => setRoom(door.id)}
              className="relative rounded-2xl text-left transition-all active:scale-[0.96]"
              style={{
                background: door.bg,
                minHeight: "230px",
                boxShadow: door.dark
                  ? "0 8px 28px rgba(255,31,125,0.22)"
                  : "0 6px 24px rgba(255,31,125,0.10), 0 0 0 1.5px rgba(255,31,125,0.1)",
              }}
            >
              {door.dark && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 20% 20%, rgba(255,31,125,0.22) 0%, transparent 60%)" }} />
              )}
              {/* Inset door frame */}
              <div className="absolute inset-[7px] rounded-xl pointer-events-none"
                style={{ border: `1px solid ${door.dark ? "rgba(255,255,255,0.07)" : "rgba(255,31,125,0.1)"}` }} />
              {/* Door handle */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ width: "3px", height: "22px", borderRadius: "2px", background: door.dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)" }} />
              {/* Number */}
              <p className="absolute top-4 left-4 text-[8px] font-mono font-bold tracking-[0.2em]"
                style={{ color: door.accent }}>
                {door.n}
              </p>
              {/* Content */}
              <div className="absolute bottom-4 left-4 right-8">
                <p className="text-lg font-bold italic leading-tight mb-0.5"
                  style={{ fontFamily: "var(--font-playfair)", color: door.dark ? "rgba(255,255,255,0.92)" : "#111111" }}>
                  {door.name}
                </p>
                <p className="text-[10px] mb-2.5"
                  style={{ color: door.dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.38)" }}>
                  {door.sub}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                    style={{ background: door.accent }} />
                  <span className="text-[9px] font-bold tracking-wider" style={{ color: door.accent }}>
                    {door.hint}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Secondary doors — New Keys, Vanity, Closet */}
        <div className="grid grid-cols-3 gap-3 md:grid-cols-3">
          {LOBBY_DOORS.slice(2).map((door) => (
            <button
              key={door.id}
              onClick={() => setRoom(door.id)}
              className="relative rounded-2xl text-left transition-all active:scale-[0.96]"
              style={{
                background: door.bg,
                minHeight: "160px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)",
                opacity: 0.75,
              }}
            >
              {/* Inset frame */}
              <div className="absolute inset-[6px] rounded-xl pointer-events-none"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }} />
              {/* Door handle */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ width: "2.5px", height: "18px", borderRadius: "2px", background: "rgba(0,0,0,0.1)" }} />
              {/* Number */}
              <p className="absolute top-3.5 left-3.5 text-[7px] font-mono font-bold tracking-[0.2em]"
                style={{ color: door.accent, opacity: 0.5 }}>
                {door.n}
              </p>
              {/* Coming soon tag */}
              <div className="absolute top-3 right-5">
                <span className="text-[7px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(0,0,0,0.05)", color: "#bbb" }}>
                  Soon
                </span>
              </div>
              {/* Content */}
              <div className="absolute bottom-3.5 left-3.5 right-6">
                <p className="text-sm font-bold italic leading-tight mb-0.5"
                  style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
                  {door.name}
                </p>
                <p className="text-[9px]" style={{ color: "rgba(0,0,0,0.32)" }}>{door.sub}</p>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* Live pulse */}
      <div className="px-5 md:px-8 mt-6">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: "#111111" }}>
          <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: "#FF1F7D" }} />
          <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
            35 women in The Lobby right now
          </p>
        </div>
      </div>

    </div>
  );
}
