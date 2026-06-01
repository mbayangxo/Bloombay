"use client";

import { useState } from "react";

type RoomTab = "wall" | "girlbar";

const WALL_POSTS = [
  { id: 1, author: "Aaliyah M.", initial: "A", color: "#FF1F7D", time: "2h ago", text: "Anyone going to the Carbone dinner tonight? Let's meet beforehand for drinks at Don Ciccio.", likes: 12, replies: 4, pinned: true },
  { id: 2, author: "Sofia K.",   initial: "S", color: "#FF69B4", time: "4h ago", text: "PSA: The pilates class on Sunday has 3 spots left. Worth every penny. DM me if you want the link.", likes: 8, replies: 2, pinned: false },
  { id: 3, author: "Priya R.",   initial: "P", color: "#8B5CF6", time: "6h ago", text: "Just discovered the best matcha in Williamsburg — not telling you where until you come with me.", likes: 23, replies: 9, pinned: false },
  { id: 4, author: "Kezia N.",   initial: "K", color: "#c40060", time: "Yesterday", text: "Reminder that the Soft Life Club brunch is this Saturday 11AM. Hoboken girls, this one's for you.", likes: 17, replies: 6, pinned: false },
  { id: 5, author: "Imani J.",   initial: "I", color: "#FF1F7D", time: "Yesterday", text: "I just negotiated a $40K raise. The best thing I ever did was stop treating my salary as a fixed number.", likes: 87, replies: 23, pinned: false },
  { id: 6, author: "Naomi B.",   initial: "N", color: "#FF69B4", time: "2d ago", text: "Anyone here have experience pitching to female investors? About to raise a seed round and want to connect.", likes: 19, replies: 11, pinned: false },
];

const GIRL_BAR_ROOMS = [
  { id: 1, name: "Morning Room",  desc: "Coffee talk, soft energy",         women: 8,  live: true  },
  { id: 2, name: "Night Owl",     desc: "Late night conversations",         women: 14, live: true  },
  { id: 3, name: "Study With Me", desc: "Silent co-working vibes",          women: 5,  live: true  },
  { id: 4, name: "Vent Room",     desc: "Private, supportive space",        women: 3,  live: false },
];

// ── Post board ────────────────────────────────────────────────────────────────

function WallBoard() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col gap-4">
      {/* Compose */}
      <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: "var(--bb-pink)" }}
          >
            M
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Post something to the board…"
            rows={2}
            className="flex-1 resize-none text-sm outline-none px-3 py-2 rounded-xl"
            style={{ background: "var(--pale-pink-bg)", color: "var(--bb-black)" }}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="px-5 py-2 rounded-full text-xs font-bold text-white transition-all active:scale-95"
            style={{ background: text.trim() ? "var(--bb-pink)" : "#E0C0CC" }}
            disabled={!text.trim()}
          >
            Post
          </button>
        </div>
      </div>

      {WALL_POSTS.map((post) => (
        <div key={post.id} className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
          {post.pinned && (
            <div className="flex items-center gap-1 mb-2">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--bb-pink)">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
              <span className="text-xs font-bold" style={{ color: "var(--bb-pink)" }}>PINNED</span>
            </div>
          )}
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: post.color }}
            >
              {post.initial}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{post.author}</p>
                <p className="text-xs text-gray-400">{post.time}</p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{post.text}</p>
              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={() => {
                    const n = new Set(liked);
                    if (n.has(post.id)) n.delete(post.id); else n.add(post.id);
                    setLiked(n);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: liked.has(post.id) ? "var(--bb-pink)" : "rgba(0,0,0,0.3)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={liked.has(post.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  {post.likes + (liked.has(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "rgba(0,0,0,0.3)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                  {post.replies}
                </button>
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
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl p-5" style={{ background: "#1A0514" }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--bb-pink)" }} />
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--mid-pink)" }}>
            GIRL BAR · LIVE
          </p>
        </div>
        <p
          className="text-white text-2xl font-bold italic mb-1"
          style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}
        >
          Girls Talk Late.
        </p>
        <p className="text-white/50 text-sm">
          Live audio rooms for women only. Tap in, drop out, no recordings.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {GIRL_BAR_ROOMS.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl p-4 flex items-center gap-4"
            style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: r.live ? "var(--bb-pink)" : "var(--light-pink)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={r.live ? "white" : "var(--bb-pink)"}>
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{r.name}</p>
                {r.live && (
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--bb-pink)" }} />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: "var(--bb-pink)" }}>
                {r.women} women {r.live ? "listening" : "waiting"}
              </p>
            </div>
            <button
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
              style={
                r.live
                  ? { background: "var(--bb-pink)", color: "white" }
                  : { background: "var(--light-pink)", color: "var(--bb-pink)" }
              }
            >
              {r.live ? "Join" : "Notify me"}
            </button>
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
      {/* Header */}
      <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: "var(--bb-pink)" }}>
          BLOOMBAY
        </p>
        <h1 className="text-3xl font-bold leading-tight" style={{ color: "var(--bb-black)" }}>
          The Room
        </h1>
      </div>

      {/* Tab switcher */}
      <div className="px-5 md:px-8 mb-5">
        <div
          className="inline-flex rounded-full p-1 gap-1"
          style={{ background: "#F0E8EC" }}
        >
          {(["wall", "girlbar"] as RoomTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={
                tab === t
                  ? { background: "#1A0514", color: "white" }
                  : { color: "#888" }
              }
            >
              {t === "wall" ? "The Wall" : "Girl Bar"}
              {t === "girlbar" && (
                <span
                  className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "var(--bb-pink)", color: "white" }}
                >
                  LIVE
                </span>
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
