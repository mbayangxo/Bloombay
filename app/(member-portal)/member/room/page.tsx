"use client";

import { useState } from "react";

type RoomTab = "wall" | "girlbar";
type WallFilter = "all" | "trending" | "gather" | "discover" | "plan" | "now" | "ask";
type WallCategory = "gather" | "discover" | "plan" | "now" | "ask";

interface WallPost {
  id: number;
  author: string;
  initial: string;
  color: string;
  time: string;
  text: string;
  likes: number;
  replies: number;
  pinned: boolean;
  category: WallCategory;
}

const SEED_POSTS: WallPost[] = [
  { id: 1, author: "Aaliyah M.", initial: "A", color: "#FF1F7D",  time: "8m ago",    text: "Anyone want to do matcha Thursday morning in Williamsburg? I know a spot that's not on TikTok yet. Small group, max 5.",                        likes: 14, replies: 6,  pinned: true,  category: "gather"   },
  { id: 2, author: "Sofia K.",   initial: "S", color: "#FF69B4",  time: "22m ago",   text: "At Café Medina right now — table for 2 just opened up. If you're in Crown Heights come through 🌸",                                                 likes: 7,  replies: 3,  pinned: false, category: "now"      },
  { id: 3, author: "Priya R.",   initial: "P", color: "#FF69B4",  time: "1h ago",    text: "Organizing a run in Prospect Park this Sunday 8AM. All paces welcome — we end at the café and get pastries. DM me to join.",                         likes: 23, replies: 9,  pinned: false, category: "plan"     },
  { id: 4, author: "Kezia N.",   initial: "K", color: "#FF1F7D",  time: "2h ago",    text: "Best Nigerian restaurant in BK? Taking 4 girls tonight — need a rec by 5PM.",                                                                         likes: 11, replies: 17, pinned: false, category: "discover" },
  { id: 5, author: "Imani J.",   initial: "I", color: "#FF1F7D",  time: "3h ago",    text: "Afrobeats Night at SOB's is this Saturday. I have 2 extra tickets — who wants them? Girls only.",                                                     likes: 31, replies: 14, pinned: false, category: "gather"   },
  { id: 6, author: "Naomi B.",   initial: "N", color: "#FF69B4",  time: "5h ago",    text: "Book club in the West Village starting next Thursday — first pick is 'Parable of the Sower'. 8 spots, 3 left. Comment if you want in.",               likes: 19, replies: 8,  pinned: false, category: "plan"     },
  { id: 7, author: "Zara M.",    initial: "Z", color: "#FF1F7D",  time: "Yesterday", text: "Looking for a gym buddy in Greenpoint — early mornings, any gym. I just need someone to hold me accountable.",                                        likes: 8,  replies: 11, pinned: false, category: "gather"   },
  { id: 8, author: "Temi A.",    initial: "T", color: "#FF69B4",  time: "Yesterday", text: "Anyone been to the new Eritrean spot on Fulton? Thinking about it for my birthday dinner. Honest reviews only.",                                       likes: 22, replies: 7,  pinned: false, category: "discover" },
  { id: 9, author: "Jade O.",    initial: "J", color: "#FF1F7D",  time: "2d ago",    text: "Spin class at HAUS on Sunday has 2 spots — anyone want to come together? 10AM, I'll grab us smoothies after.",                                        likes: 16, replies: 5,  pinned: false, category: "gather"   },
];

const WALL_FILTERS: { label: string; value: WallFilter }[] = [
  { label: "All",        value: "all"      },
  { label: "🔥 Now",     value: "trending" },
  { label: "Gather",     value: "gather"   },
  { label: "Discover",   value: "discover" },
  { label: "Plan",       value: "plan"     },
  { label: "Happening",  value: "now"      },
  { label: "Ask",        value: "ask"      },
];

const CATEGORY_LABELS: Record<WallCategory, string> = {
  gather:   "Gather",
  discover: "Discover",
  plan:     "Plan",
  now:      "Happening now",
  ask:      "Ask",
};

const GIRL_BAR_ROOMS = [
  { id: 1, name: "Morning Room",    desc: "Coffee talk, slow start, soft energy",  women: 8,  live: true  },
  { id: 2, name: "Night Owl",       desc: "Late-night conversations, no filter",    women: 14, live: true  },
  { id: 3, name: "Study With Me",   desc: "Silent co-working, you're not alone",    women: 5,  live: true  },
  { id: 4, name: "Sunday Soft",     desc: "Decompressing before the week starts",   women: 3,  live: false },
];

function CategoryBadge({ category }: { category: WallCategory }) {
  return (
    <span
      className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0"
      style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}

function WallBoard() {
  const [liked,       setLiked]       = useState<Set<number>>(new Set());
  const [text,        setText]        = useState("");
  const [filter,      setFilter]      = useState<WallFilter>("all");
  const [newCategory, setNewCategory] = useState<WallCategory>("gather");
  const [posts,       setPosts]       = useState<WallPost[]>(SEED_POSTS);

  const trending = [...posts]
    .sort((a, b) => (b.likes + b.replies * 2) - (a.likes + a.replies * 2))
    .slice(0, 4);

  const shown =
    filter === "all"      ? posts :
    filter === "trending" ? trending :
    posts.filter((p) => p.category === filter);

  function handlePost() {
    if (!text.trim()) return;
    setPosts((prev) => [{
      id: Date.now(), author: "You", initial: "Y", color: "#FF1F7D",
      time: "just now", text: text.trim(), likes: 0, replies: 0,
      pinned: false, category: newCategory,
    }, ...prev]);
    setText("");
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Trending strip — only show on "all" */}
      {filter === "all" && (
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--bb-pink)" }}>
            🔥 HAPPENING NOW
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {trending.map((post) => (
              <div
                key={post.id}
                className="flex-shrink-0 w-52 rounded-2xl p-4 bg-white"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: post.color }}
                  >
                    {post.initial}
                  </div>
                  <p className="text-xs font-bold truncate flex-1" style={{ color: "var(--bb-black)" }}>{post.author}</p>
                  <CategoryBadge category={post.category} />
                </div>
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "#555" }}>{post.text}</p>
                <p className="text-[10px] font-semibold mt-3" style={{ color: "var(--bb-pink)" }}>
                  ♥ {post.likes} · {post.replies} replies
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
        {WALL_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-150 active:scale-95"
            style={
              filter === f.value
                ? { background: "#111111", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }
                : { background: "white", color: "#666", border: "1.5px solid #EAEAEA" }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Compose box */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 4px 20px rgba(255,31,125,0.08)",
          borderLeft: "4px solid var(--bb-pink)",
        }}
      >
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: "var(--bb-pink)", boxShadow: "0 2px 10px rgba(255,31,125,0.35)" }}
            >
              Y
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What are you planning, gathering, or looking for?…"
              rows={3}
              className="flex-1 resize-none text-sm outline-none px-3.5 py-2.5 rounded-xl"
              style={{
                background: "white",
                color: "#111111",
                border: "1.5px solid #F0E0E8",
                lineHeight: "1.6",
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
              {(["gather", "discover", "plan", "now", "ask"] as WallCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap capitalize flex-shrink-0 transition-all"
                  style={
                    newCategory === cat
                      ? { background: "var(--bb-pink)", color: "white", boxShadow: "0 2px 6px rgba(255,31,125,0.3)" }
                      : { background: "var(--light-pink)", color: "var(--bb-pink)" }
                  }
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
            <button
              onClick={handlePost}
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold text-white transition-all active:scale-95"
              style={{
                background: text.trim() ? "var(--bb-pink)" : "#E0C0CC",
                boxShadow: text.trim() ? "0 3px 10px rgba(255,31,125,0.3)" : "none",
              }}
              disabled={!text.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Post list */}
      {shown.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-2xl overflow-hidden"
          style={{
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            borderLeft: post.pinned ? "3px solid var(--bb-pink)" : "3px solid transparent",
          }}
        >
          <div className="p-4">
            {post.pinned && (
              <div className="flex items-center gap-1.5 mb-3">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--bb-pink)">
                  <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                </svg>
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>PINNED</span>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: post.color, boxShadow: `0 2px 8px ${post.color}55` }}
              >
                {post.initial}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{post.author}</p>
                  <CategoryBadge category={post.category} />
                  <p className="text-xs" style={{ color: "#bbb" }}>{post.time}</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#444", lineHeight: "1.65" }}>{post.text}</p>
                <div className="flex items-center gap-5 mt-3">
                  <button
                    onClick={() => {
                      const n = new Set(liked);
                      if (n.has(post.id)) n.delete(post.id); else n.add(post.id);
                      setLiked(n);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                    style={{ color: liked.has(post.id) ? "var(--bb-pink)" : "rgba(0,0,0,0.28)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={liked.has(post.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                    {post.likes + (liked.has(post.id) ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "rgba(0,0,0,0.28)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    {post.replies}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Girl Bar ──────────────────────────────────────────────────────────────────

function GirlBar() {
  const [joined,   setJoined]   = useState<Set<number>>(new Set());
  const [notified, setNotified] = useState<Set<number>>(new Set());

  return (
    <div className="flex flex-col gap-4">
      {/* Hero dark card */}
      <div
        className="rounded-3xl relative overflow-hidden"
        style={{ background: "#111111", minHeight: "180px", boxShadow: "0 8px 32px rgba(255,31,125,0.22)" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,31,125,0.22) 0%, transparent 65%)" }} />
        <div className="absolute top-6 right-6 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(255,31,125,0.12)", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--bb-pink)", boxShadow: "0 4px 16px rgba(255,31,125,0.6)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="relative p-6 pr-24">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--bb-pink)", animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
              <div className="w-2 h-2 rounded-full opacity-50" style={{ background: "var(--bb-pink)", animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.3s" }} />
              <div className="w-1.5 h-1.5 rounded-full opacity-25" style={{ background: "var(--bb-pink)", animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.6s" }} />
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#FF69B4" }}>
              GIRL BAR · LIVE NOW
            </p>
          </div>
          <p className="text-white text-3xl font-bold italic mb-2" style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}>
            Girls Talk Late.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            Live audio rooms for women only. Tap in, drop out, no recordings.
          </p>
        </div>
      </div>

      {/* Room cards */}
      <div className="flex flex-col gap-3">
        {GIRL_BAR_ROOMS.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl overflow-hidden flex items-stretch" style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.07)" }}>
            <div className="w-1.5 flex-shrink-0" style={{ background: r.live ? "linear-gradient(180deg,#FF1F7D,#FF69B4)" : "var(--light-pink)" }} />
            <div className="flex-1 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: r.live ? "var(--bb-pink)" : "var(--light-pink)", boxShadow: r.live ? "0 4px 14px rgba(255,31,125,0.35)" : "none" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={r.live ? "white" : "var(--bb-pink)"}>
                  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{r.name}</p>
                  {r.live && <div className="w-2 h-2 rounded-full" style={{ background: "var(--bb-pink)", animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />}
                </div>
                <p className="text-xs mb-1.5" style={{ color: "#aaa" }}>{r.desc}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: r.live ? "var(--light-pink)" : "#F5F5F5", color: r.live ? "var(--bb-pink)" : "#999" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                  {r.women} {r.live ? "listening" : "waiting"}
                </span>
              </div>
              <button
                onClick={() => r.live
                  ? setJoined((p) => { const n = new Set(p); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; })
                  : setNotified((p) => new Set([...p, r.id]))}
                className="flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95"
                style={r.live
                  ? joined.has(r.id)
                    ? { background: "var(--light-pink)", color: "var(--bb-pink)" }
                    : { background: "var(--bb-pink)", color: "white", boxShadow: "0 3px 10px rgba(255,31,125,0.3)" }
                  : notified.has(r.id)
                    ? { background: "var(--light-pink)", color: "var(--bb-pink)" }
                    : { background: "#F5F5F5", color: "#888" }}
              >
                {r.live ? (joined.has(r.id) ? "In room ✓" : "Join") : (notified.has(r.id) ? "Notified ✓" : "Notify me")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function TheRoomPage() {
  const [tab, setTab] = useState<RoomTab>("wall");

  return (
    <div className="min-h-screen pb-36 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8">
        <p className="text-[10px] font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--bb-pink)" }}>BLOOMBAY</p>
        <h1 className="text-4xl font-bold leading-tight italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)", fontWeight: 700 }}>
          The Room
        </h1>
        <p className="text-sm mt-1" style={{ color: "#aaa" }}>Where plans are made.</p>
        <div className="mt-2 h-0.5 w-12 rounded-full" style={{ background: "var(--bb-pink)" }} />
      </div>

      <div className="px-5 md:px-8 mb-5">
        <div className="inline-flex rounded-full p-1 gap-1" style={{ background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
          {(["wall", "girlbar"] as RoomTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-150"
              style={tab === t
                ? { background: "#111111", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }
                : { color: "#888" }}
            >
              {t === "wall" ? "The Wall" : "Girl Bar"}
              {t === "girlbar" && (
                <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "var(--bb-pink)", color: "white" }}>LIVE</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 md:px-8">
        {tab === "wall"    && <WallBoard />}
        {tab === "girlbar" && <GirlBar />}
      </div>
    </div>
  );
}
