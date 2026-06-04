"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Room = "lobby" | "wall" | "girlbar" | "new-keys" | "vanity" | "closet";
type WallCategory = "gather" | "discover" | "plan" | "now" | "ask";

interface WallPost {
  id: number; author: string; initial: string; color: string;
  time: string; text: string; likes: number; replies: number;
  pinned: boolean; category: WallCategory;
}

interface WallReply {
  id: number;
  postId: number;
  author: string;
  initial: string;
  color: string;
  time: string;
  text: string;
}

interface WallZone {
  id: WallCategory;
  emoji: string;
  label: string;
  sub: string;
  dark: boolean;
  noteBg: string;
  accent: string;
  textColor: string;
  subColor: string;
  emptyText: string;
}

const WALL_ZONES: WallZone[] = [
  {
    id: "now",
    emoji: "🔥", label: "Happening Now", sub: "Right now, in real time",
    dark: true, noteBg: "#0D0810",
    accent: "#FF1F7D", textColor: "rgba(255,255,255,0.88)", subColor: "rgba(255,255,255,0.32)",
    emptyText: "Nothing happening yet.",
  },
  {
    id: "gather",
    emoji: "🌸", label: "Gather", sub: "Come through, making plans",
    dark: false, noteBg: "#FBF6EE",
    accent: "#FF69B4", textColor: "#2A1820", subColor: "#bbb",
    emptyText: "No gatherings yet. Start one.",
  },
  {
    id: "ask",
    emoji: "💬", label: "Ask the Room", sub: "Questions, advice, thoughts",
    dark: false, noteBg: "#F5F0FF",
    accent: "#A78BFA", textColor: "#1E1530", subColor: "#aaa",
    emptyText: "Ask the room something.",
  },
  {
    id: "discover",
    emoji: "✦", label: "Discover", sub: "Finds, recs & things to love",
    dark: false, noteBg: "#FFFFFF",
    accent: "#FF1F7D", textColor: "#111", subColor: "#bbb",
    emptyText: "No discoveries yet.",
  },
  {
    id: "plan",
    emoji: "📌", label: "Plan", sub: "Events, ideas, what's coming",
    dark: false, noteBg: "#FFF5F8",
    accent: "#FF1F7D", textColor: "#1A0A12", subColor: "#bbb",
    emptyText: "No plans posted yet.",
  },
];

const GIRL_BAR_ROOMS = [
  { id: 1, name: "Late Night Lounge", sub: "Open now",                    desc: "No filter, no judgment. Slip in and stay a while.",      women: 127, live: true,  color: "#FF1F7D", emoji: "🌙" },
  { id: 2, name: "Voice Rooms",       sub: "Join a conversation",          desc: "Live audio spaces — listen in or take the mic.",         women: 84,  live: true,  color: "#C084FC", emoji: "🎙" },
  { id: 3, name: "Confessions",       sub: "Share anonymously",            desc: "Say what you've been holding. No names here.",           women: 52,  live: true,  color: "#FB7185", emoji: "💌" },
  { id: 4, name: "Hot Topics",        sub: "What's on everyone's mind",    desc: "The conversations happening right now.",                 women: 84,  live: true,  color: "#F59E0B", emoji: "🔥" },
];

// ── Wall Note Card ────────────────────────────────────────────────────────────

function WallNoteCard({
  post, zone, liked, setLiked, onExpand,
}: {
  post: WallPost;
  zone: WallZone;
  liked: Set<number>;
  setLiked: React.Dispatch<React.SetStateAction<Set<number>>>;
  onExpand: () => void;
}) {
  const isLiked = liked.has(post.id);
  const rot = ((post.id * 13 + 7) % 11 - 5) * 0.55;

  return (
    <button
      onClick={onExpand}
      className="flex-shrink-0 rounded-2xl text-left wall-note active:scale-[0.96] transition-transform"
      style={{
        width: zone.id === "now" ? "238px" : "192px",
        background: zone.noteBg,
        transform: `rotate(${rot}deg)`,
        boxShadow: zone.dark
          ? "0 6px 24px rgba(255,31,125,0.18), 0 0 0 1px rgba(255,255,255,0.04)"
          : "0 3px 16px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.04)",
        padding: "16px",
        minHeight: "130px",
      }}
    >
      {/* Author seal */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
          style={{ background: post.color }}
        >
          {post.initial}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-[12px] font-bold italic leading-tight truncate"
            style={{ fontFamily: "var(--font-playfair)", color: zone.textColor }}
          >
            {post.author}
          </p>
          <p className="text-[9px]" style={{ color: zone.subColor }}>{post.time}</p>
        </div>
        {zone.id === "now" && (
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: "#FF1F7D" }} />
        )}
      </div>

      {/* Note text */}
      <p
        className="text-[13px] leading-relaxed mb-3 flex-1"
        style={{
          fontFamily: "var(--font-instrument)",
          color: zone.textColor,
          lineHeight: "1.65",
        }}
      >
        {post.text}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const n = new Set(liked);
            n.has(post.id) ? n.delete(post.id) : n.add(post.id);
            setLiked(n);
          }}
          className="flex items-center gap-1 transition-all"
          style={{ color: isLiked ? zone.accent : zone.subColor }}
        >
          <span style={{ fontSize: "13px" }}>{isLiked ? "♥" : "♡"}</span>
          <span className="text-[10px] font-bold">{post.likes + (isLiked ? 1 : 0)}</span>
        </button>
        <div className="flex items-center gap-1" style={{ color: zone.subColor }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          <span className="text-[10px] font-bold">{post.replies}</span>
        </div>
        <span className="ml-auto text-[9px] font-bold uppercase tracking-wider" style={{ color: zone.subColor, opacity: 0.7 }}>
          {zone.emoji}
        </span>
      </div>
    </button>
  );
}

// ── Wall Zone Section ─────────────────────────────────────────────────────────

function WallZoneSection({
  zone, posts, liked, setLiked, onAddNote, onExpand,
}: {
  zone: WallZone;
  posts: WallPost[];
  liked: Set<number>;
  setLiked: React.Dispatch<React.SetStateAction<Set<number>>>;
  onAddNote: (cat: WallCategory) => void;
  onExpand: (post: WallPost, zone: WallZone) => void;
}) {
  const zonePosts = posts.filter(p => p.category === zone.id);

  return (
    <div
      className="mb-6"
      style={zone.dark ? { background: "#0D0810", paddingTop: "20px", paddingBottom: "24px" } : {}}
    >
      {/* Zone header */}
      <div className="px-5 md:px-8 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "14px" }}>{zone.emoji}</span>
          <p
            className="text-[10px] font-bold tracking-[0.18em] uppercase"
            style={{ color: zone.dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.38)" }}
          >
            {zone.label}
          </p>
          {zone.id === "now" && (
            <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "#FF1F7D" }} />
          )}
          {zonePosts.length > 0 && (
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: zone.dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
                color: zone.dark ? "rgba(255,255,255,0.3)" : "#bbb",
              }}
            >
              {zonePosts.length}
            </span>
          )}
        </div>
        <button
          onClick={() => onAddNote(zone.id)}
          className="text-[10px] font-bold tracking-wider transition-opacity active:opacity-60"
          style={{ color: zone.accent }}
        >
          + leave a note
        </button>
      </div>

      {/* Horizontal scroll of notes */}
      <div
        className="flex gap-4 overflow-x-auto pb-3"
        style={{ paddingLeft: "20px", paddingRight: "20px", scrollbarWidth: "none", alignItems: "flex-start" }}
      >
        {zonePosts.map(p => (
          <WallNoteCard
            key={p.id}
            post={p}
            zone={zone}
            liked={liked}
            setLiked={setLiked}
            onExpand={() => onExpand(p, zone)}
          />
        ))}

        {/* Empty state placeholder — tap to compose */}
        {zonePosts.length === 0 && (
          <button
            onClick={() => onAddNote(zone.id)}
            className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center gap-2 text-center active:scale-[0.97] transition-transform"
            style={{
              width: "160px",
              minHeight: "110px",
              padding: "20px",
              background: zone.dark ? "rgba(255,255,255,0.03)" : "white",
              border: `1.5px dashed ${zone.accent}44`,
            }}
          >
            <span style={{ fontSize: "20px", opacity: 0.3 }}>{zone.emoji}</span>
            <p
              className="italic"
              style={{ fontFamily: "var(--font-caveat)", color: zone.dark ? "rgba(255,255,255,0.2)" : "#ccc", fontSize: "13px" }}
            >
              {zone.emptyText}
            </p>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Compose Sheet ─────────────────────────────────────────────────────────────

function ComposeSheet({
  defaultCategory, onClose, onPost,
}: {
  defaultCategory: WallCategory;
  onClose: () => void;
  onPost: (text: string, cat: WallCategory) => void;
}) {
  const [text, setText] = useState("");
  const [cat, setCat] = useState<WallCategory>(defaultCategory);
  const zone = WALL_ZONES.find(z => z.id === cat) ?? WALL_ZONES[1];

  function submit() {
    if (!text.trim()) return;
    onPost(text.trim(), cat);
    onClose();
  }

  const PLACEHOLDERS: Record<WallCategory, string> = {
    now: "What's happening right now…",
    gather: "Who's gathering and for what…",
    ask: "What do you want to ask the room…",
    discover: "What did you find or discover…",
    plan: "What are you planning…",
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl"
        style={{ background: "#FDFAF6", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)", maxHeight: "88vh", overflowY: "auto" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-8 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: "#FF1F7D" }}>LEAVE A NOTE ✦</p>
            <p className="text-sm italic mt-0.5" style={{ fontFamily: "var(--font-caveat)", color: "#bbb", fontSize: "14px" }}>
              Only women here will see this.
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.06)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Zone picker */}
        <div className="px-5 pt-4 pb-3">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2.5" style={{ color: "#bbb" }}>WHERE DOES THIS GO?</p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {WALL_ZONES.map(z => (
              <button
                key={z.id}
                onClick={() => setCat(z.id)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95"
                style={cat === z.id
                  ? { background: z.accent, color: "white", boxShadow: `0 2px 8px ${z.accent}44` }
                  : { background: "rgba(0,0,0,0.04)", color: "#888", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                {z.emoji} {z.label}
              </button>
            ))}
          </div>
        </div>

        {/* Writing area */}
        <div className="px-5 pb-4" style={{ borderTop: "1px dashed rgba(0,0,0,0.07)" }}>
          <div className="flex items-start gap-3 pt-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "#FF1F7D" }}
            >
              Y
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={PLACEHOLDERS[cat]}
              rows={4}
              autoFocus
              className="flex-1 resize-none outline-none"
              style={{
                background: "transparent",
                fontFamily: "var(--font-instrument)",
                fontSize: "15px",
                color: "#2A1820",
                lineHeight: "1.7",
                border: "none",
                borderBottom: "1.5px dashed #E8D8DE",
              }}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="px-5 pb-8">
          <button
            onClick={submit}
            disabled={!text.trim()}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all active:scale-[0.97]"
            style={{ background: text.trim() ? zone.accent : "#E0C8D0" }}
          >
            Leave this on the wall ✦
          </button>
        </div>
      </div>
    </>
  );
}

// ── Expanded Note + Replies ───────────────────────────────────────────────────

function ExpandedNoteSheet({
  post, zone, liked, onLike, replies, onReply, onClose,
}: {
  post: WallPost;
  zone: WallZone;
  liked: boolean;
  onLike: () => void;
  replies: WallReply[];
  onReply: (postId: number, text: string) => void;
  onClose: () => void;
}) {
  const [replyText, setReplyText] = useState("");
  const postReplies = replies.filter(r => r.postId === post.id);

  function submitReply() {
    if (!replyText.trim()) return;
    onReply(post.id, replyText.trim());
    setReplyText("");
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.52)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl"
        style={{ background: "#FDFAF6", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)", maxHeight: "88vh", overflowY: "auto" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-8 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
        </div>

        {/* Zone tag */}
        <div className="px-5 pb-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <span
            className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
            style={{ background: `${zone.accent}18`, color: zone.accent }}
          >
            {zone.emoji} {zone.label}
          </span>
        </div>

        {/* Original note */}
        <div className="px-5 pt-5 pb-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: post.color }}
            >
              {post.initial}
            </div>
            <div>
              <p className="text-sm font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{post.author}</p>
              <p className="text-[9px]" style={{ color: "#bbb" }}>{post.time}</p>
            </div>
          </div>
          <p
            className="text-[15px] leading-relaxed mb-4"
            style={{ fontFamily: "var(--font-instrument)", color: "#2A1820", lineHeight: "1.72" }}
          >
            {post.text}
          </p>
          <div className="flex items-center gap-4">
            <button onClick={onLike} className="flex items-center gap-1.5 transition-all"
              style={{ color: liked ? zone.accent : "#bbb" }}>
              <span style={{ fontSize: "15px" }}>{liked ? "♥" : "♡"}</span>
              <span className="text-[11px] font-bold">{post.likes + (liked ? 1 : 0)}</span>
            </button>
            <p className="text-[11px]" style={{ color: "#ccc" }}>·</p>
            <p className="text-[11px]" style={{ color: "#bbb" }}>{postReplies.length + post.replies} replies</p>
          </div>
        </div>

        {/* Replies */}
        {postReplies.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
            <p className="px-5 pt-3 pb-2 text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "#bbb" }}>REPLIES</p>
            {postReplies.map((r) => (
              <div key={r.id} className="px-5 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                    style={{ background: r.color }}>
                    {r.initial}
                  </div>
                  <p className="text-xs font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{r.author}</p>
                  <p className="text-[9px]" style={{ color: "#ccc" }}>{r.time}</p>
                </div>
                <p className="text-[13px] leading-relaxed pl-8" style={{ fontFamily: "var(--font-instrument)", color: "#444", lineHeight: "1.65" }}>
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Reply input */}
        <div className="px-5 py-4 flex gap-3 items-start" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
            style={{ background: "#FF1F7D" }}>
            Y
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") submitReply(); }}
              placeholder="Add your reply…"
              className="w-full outline-none text-[14px] pb-2"
              style={{
                background: "transparent",
                fontFamily: "var(--font-instrument)",
                color: "#2A1820",
                borderBottom: "1.5px dashed #E8D8DE",
              }}
            />
          </div>
          <button
            onClick={submitReply}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
            style={{ background: "#FF1F7D", opacity: replyText.trim() ? 1 : 0.35 }}
          >
            Reply
          </button>
        </div>
        <div className="pb-8" />
      </div>
    </>
  );
}

// ── The Wall ─────────────────────────────────────────────────────────────────

const WALL_AVATARS = [
  { i: "A", c: "#FF1F7D" }, { i: "S", c: "#FF69B4" }, { i: "K", c: "#C084FC" },
  { i: "N", c: "#FF1F7D" }, { i: "Z", c: "#F472B6" }, { i: "I", c: "#FF69B4" },
];

function TheWall({ onBack }: { onBack: () => void }) {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [replies, setReplies] = useState<WallReply[]>([]);
  const [composing, setComposing] = useState(false);
  const [composingCat, setComposingCat] = useState<WallCategory>("gather");
  const [expanded, setExpanded] = useState<{ post: WallPost; zone: WallZone } | null>(null);

  const WOMEN_HERE = 12;

  function handlePost(text: string, cat: WallCategory) {
    setPosts(prev => [{
      id: Date.now(), author: "You", initial: "Y", color: "#FF1F7D",
      time: "just now", text, likes: 0, replies: 0, pinned: false, category: cat,
    }, ...prev]);
  }

  function handleReply(postId: number, text: string) {
    setReplies(prev => [...prev, {
      id: Date.now(), postId,
      author: "You", initial: "Y", color: "#FF1F7D",
      time: "just now", text,
    }]);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, replies: p.replies + 1 } : p));
  }

  function openCompose(cat: WallCategory) {
    setComposingCat(cat);
    setComposing(true);
  }

  function toggleLike(id: number) {
    setLiked(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "#FAF5EE" }}>
      <style>{`
        @keyframes wall-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .wall-note { animation: wall-fade 0.32s ease both; }
      `}</style>

      {/* ── HEADER ── */}
      <div className="px-5 pt-12 pb-6 md:px-8 md:pt-8">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,31,125,0.08)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>THE LOBBY</p>
        </div>

        {/* Title + live count side by side */}
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="font-black italic leading-none"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(40px,11vw,56px)",
                color: "#1A1010",
                lineHeight: 0.86,
                letterSpacing: "-0.025em",
              }}
            >
              The<br />
              <span style={{ color: "#FF1F7D" }}>Wall.</span>
            </h1>
            <p className="text-sm italic mt-2" style={{ fontFamily: "var(--font-instrument)", color: "#C0A8B0" }}>
              Your room. Leave something here.
            </p>
          </div>
          {/* Live counter */}
          <div className="rounded-2xl px-4 py-3 text-center" style={{ background: "#111111", minWidth: "72px" }}>
            <p className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "30px", color: "white" }}>
              {WOMEN_HERE}
            </p>
            <p className="text-[7px] font-bold tracking-[0.22em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              HERE NOW
            </p>
          </div>
        </div>

        {/* Live avatars */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex">
            {WALL_AVATARS.map((a, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: a.c, border: "2px solid #FAF5EE", marginLeft: i > 0 ? "-7px" : "0" }}
              >
                {a.i}
              </div>
            ))}
          </div>
          <p className="text-[10px] ml-1" style={{ color: "#bbb" }}>
            +{WOMEN_HERE - WALL_AVATARS.length} more on the wall
          </p>
          <span className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: "#FF1F7D" }} />
        </div>
      </div>

      {/* ── COMPOSE TRIGGER ── */}
      <div className="px-5 md:px-8 mb-7">
        <button
          onClick={() => openCompose("gather")}
          className="w-full py-4 rounded-2xl flex items-center justify-between px-5 transition-all active:scale-[0.98]"
          style={{
            background: "white",
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            border: "1.5px dashed rgba(255,31,125,0.2)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF1F7D" }}>
              <span className="text-white text-xs font-bold">Y</span>
            </div>
            <p className="italic" style={{ fontFamily: "var(--font-caveat)", color: "#C0A8B0", fontSize: "16px" }}>
              Leave something on the wall…
            </p>
          </div>
          <span className="text-base font-bold" style={{ color: "#FF1F7D" }}>✦</span>
        </button>
      </div>

      {/* ── ZONES ── */}
      {WALL_ZONES.map(zone => (
        <WallZoneSection
          key={zone.id}
          zone={zone}
          posts={posts}
          liked={liked}
          setLiked={setLiked}
          onAddNote={openCompose}
          onExpand={(post, z) => setExpanded({ post, zone: z })}
        />
      ))}

      {/* ── COMPOSE SHEET ── */}
      {composing && (
        <ComposeSheet
          defaultCategory={composingCat}
          onClose={() => setComposing(false)}
          onPost={handlePost}
        />
      )}

      {/* ── EXPANDED NOTE ── */}
      {expanded && (
        <ExpandedNoteSheet
          post={expanded.post}
          zone={expanded.zone}
          liked={liked.has(expanded.post.id)}
          onLike={() => toggleLike(expanded.post.id)}
          replies={replies}
          onReply={handleReply}
          onClose={() => setExpanded(null)}
        />
      )}
    </div>
  );
}

// ── Girl Bar ─────────────────────────────────────────────────────────────────

// ── Girl Bar Room Entry ───────────────────────────────────────────────────────

type GBRoom = typeof GIRL_BAR_ROOMS[number];

function GirlBarRoomEntry({ room, onLeave }: { room: GBRoom; onLeave: () => void }) {
  const [speaking, setSpeaking] = useState(false);
  const avatarColors = ["#FF1F7D","#FF69B4","#C084FC","#FB923C","#34D399","#60A5FA","#F472B6","#A78BFA"];
  const speakerInitials = ["A","J","Z","M","N","S","T","K","R","L","I","D"];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#050209" }}>
      <style>{`
        @keyframes room-glow { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:0.85; transform:scale(1.05); } }
        @keyframes room-wave { 0%,100% { height:12px; } 50% { height:32px; } }
        @keyframes room-wave2 { 0%,100% { height:20px; } 50% { height:8px; } }
        @keyframes room-wave3 { 0%,100% { height:16px; } 50% { height:36px; } }
        @keyframes room-speak { 0%,100% { transform:scale(1); box-shadow: 0 0 0 0 rgba(255,31,125,0.4); } 50% { transform:scale(1.06); box-shadow: 0 0 0 8px rgba(255,31,125,0); } }
        .room-glow { animation: room-glow 3s ease-in-out infinite; }
        .room-w1 { animation: room-wave 0.7s ease-in-out infinite; }
        .room-w2 { animation: room-wave2 0.9s ease-in-out infinite; }
        .room-w3 { animation: room-wave3 0.6s ease-in-out infinite; }
        .room-w4 { animation: room-wave2 0.8s ease-in-out infinite; }
        .room-w5 { animation: room-wave 1.1s ease-in-out infinite; }
        .room-speak { animation: room-speak 1.2s ease-in-out infinite; }
      `}</style>

      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="room-glow absolute rounded-full" style={{ width:"340px", height:"340px", top:"-80px", left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle, rgba(255,31,125,0.18) 0%, transparent 70%)" }} />
        <div className="absolute rounded-full" style={{ width:"200px", height:"200px", bottom:"120px", right:"-40px", background:"radial-gradient(circle, rgba(160,84,252,0.12) 0%, transparent 70%)", animation:"room-glow 4s ease-in-out infinite 1s" }} />
      </div>

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={onLeave}
          className="px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
          style={{ background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.1)" }}>
          ← Leave
        </button>
        <div className="flex items-center gap-1.5">
          {room.live && <div className="w-2 h-2 rounded-full" style={{ background:"#FF1F7D", boxShadow:"0 0 6px #FF1F7D", animation:"room-glow 1.6s ease-in-out infinite" }} />}
          <span className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: room.live ? "#FF1F7D" : "rgba(255,255,255,0.3)" }}>{room.live ? "LIVE" : "COMING SOON"}</span>
        </div>
        <div className="w-9 h-9" />
      </div>

      {/* Room name */}
      <div className="relative px-6 mt-4 mb-8 text-center">
        <p className="text-[9px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color:"rgba(255,105,180,0.5)" }}>GIRL BAR · ROOM</p>
        <h1 className="font-black italic leading-none mb-3" style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(36px,10vw,52px)", color:"white", letterSpacing:"-0.02em" }}>
          {room.name}
        </h1>
        <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.38)", fontFamily:"var(--font-instrument)" }}>{room.desc}</p>
      </div>

      {/* Live waveform */}
      {room.live && (
        <div className="flex items-end justify-center gap-1.5 mb-8" style={{ height:"48px" }}>
          {[1,2,3,4,5,6,7,8,9,10,11,12,13].map((_, i) => (
            <div key={i} className={["room-w1","room-w2","room-w3","room-w4","room-w5","room-w3","room-w2","room-w1","room-w4","room-w5","room-w2","room-w3","room-w1"][i]}
              style={{ width:"3px", borderRadius:"2px", background: i % 3 === 0 ? "#FF1F7D" : "rgba(255,105,180,0.4)", minHeight:"6px" }} />
          ))}
        </div>
      )}

      {/* Speaker avatars */}
      <div className="relative px-6 flex-1">
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color:"rgba(255,255,255,0.2)" }}>
          {room.women} WOMEN {room.live ? "IN THE ROOM" : "WAITING"}
        </p>
        <div className="flex flex-wrap gap-5 justify-center">
          {Array.from({ length: Math.min(room.women, 12) }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={i < 3 && room.live ? "room-speak" : ""}
                style={{ width:"52px", height:"52px", borderRadius:"50%", background:`linear-gradient(135deg, ${avatarColors[i % 8]}, ${avatarColors[(i+2)%8]}88)`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow: i < 3 && room.live ? `0 0 0 2px ${avatarColors[i%8]}` : "none" }}>
                <span style={{ color:"white", fontWeight:700, fontSize:"16px" }}>{speakerInitials[i % 12]}</span>
              </div>
              {i < 3 && room.live && (
                <div className="flex gap-0.5 items-end" style={{ height:"10px" }}>
                  {[0,1,2].map(b => (
                    <div key={b} className={["room-w2","room-w1","room-w3"][b]} style={{ width:"2px", borderRadius:"1px", background:"rgba(255,105,180,0.6)", minHeight:"3px" }} />
                  ))}
                </div>
              )}
            </div>
          ))}
          {room.women > 12 && (
            <div className="flex flex-col items-center gap-2">
              <div style={{ width:"52px", height:"52px", borderRadius:"50%", background:"rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(255,255,255,0.12)" }}>
                <span style={{ color:"rgba(255,255,255,0.4)", fontWeight:700, fontSize:"12px" }}>+{room.women-12}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="relative px-6 pb-12 pt-6">
        <div className="flex gap-3 justify-center">
          {room.live ? (
            <>
              <button
                onClick={() => setSpeaking(s => !s)}
                className="flex-1 max-w-[200px] py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
                style={speaking
                  ? { background:"#FF1F7D", color:"white", boxShadow:"0 8px 24px rgba(255,31,125,0.5)" }
                  : { background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.12)" }}>
                {speaking ? "🎙 Speaking..." : "✦ Request Mic"}
              </button>
              <button
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2a3 3 0 003 3v8a3 3 0 01-6 0V5a3 3 0 013-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M8 22h8"/>
                </svg>
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm font-bold mb-2" style={{ color:"rgba(255,255,255,0.5)" }}>Room opens soon</p>
              <button className="px-8 py-3 rounded-full text-sm font-bold transition-all active:scale-95"
                style={{ background:"rgba(255,31,125,0.15)", color:"#FF69B4", border:"1px solid rgba(255,31,125,0.3)" }}>
                Notify Me When Live
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function GirlBar({ onBack }: { onBack: () => void }) {
  const [activeRoom, setActiveRoom] = useState<GBRoom | null>(null);
  const totalWomen = GIRL_BAR_ROOMS.filter(r => r.live).reduce((sum, r) => sum + r.women, 0);

  if (activeRoom) {
    return <GirlBarRoomEntry room={activeRoom} onLeave={() => setActiveRoom(null)} />;
  }

  const WAVE = ["gb-w1","gb-w3","gb-w2","gb-w4","gb-w5","gb-w3","gb-w1","gb-w2","gb-w4","gb-w3","gb-w5","gb-w1","gb-w2","gb-w3","gb-w4","gb-w5","gb-w2","gb-w1","gb-w3","gb-w4","gb-w5","gb-w2","gb-w3","gb-w4","gb-w1","gb-w5","gb-w3","gb-w2"];

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "#080308", position: "relative" }}>
      <style>{`
        @keyframes gbw1 { 0%,100% { height:3px; } 50% { height:18px; } }
        @keyframes gbw2 { 0%,100% { height:12px; } 50% { height:3px; } }
        @keyframes gbw3 { 0%,100% { height:5px; } 50% { height:22px; } }
        @keyframes gbw4 { 0%,100% { height:20px; } 50% { height:7px; } }
        @keyframes gbw5 { 0%,100% { height:8px; } 50% { height:14px; } }
        @keyframes gb-breathe { 0%,100% { opacity:0.55; } 50% { opacity:1; } }
        @keyframes gb-neon { 0%,94%,100% { opacity:0.9; text-shadow:0 0 8px rgba(255,31,125,0.9),0 0 22px rgba(255,31,125,0.7),0 0 44px rgba(255,31,125,0.35); } 95% { opacity:0.35; text-shadow:none; } 97% { opacity:0.8; } }
        .gb-w1 { animation: gbw1 0.7s ease-in-out infinite; }
        .gb-w2 { animation: gbw2 0.9s ease-in-out infinite; }
        .gb-w3 { animation: gbw3 0.6s ease-in-out infinite; }
        .gb-w4 { animation: gbw4 0.8s ease-in-out infinite; }
        .gb-w5 { animation: gbw5 1.05s ease-in-out infinite; }
        .gb-ambient { animation: gb-breathe 3.5s ease-in-out infinite; }
        .gb-neon-txt { animation: gb-neon 7s ease-in-out infinite; }
      `}</style>

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="gb-ambient absolute rounded-full" style={{
          width: "420px", height: "420px", top: "-130px", left: "50%", transform: "translateX(-50%)",
          background: "radial-gradient(circle, rgba(160,18,65,0.38) 0%, transparent 65%)",
        }} />
        <div className="absolute rounded-full" style={{
          width: "280px", height: "280px", bottom: "40px", right: "-70px",
          background: "radial-gradient(circle, rgba(255,31,125,0.16) 0%, transparent 65%)",
          animation: "gb-breathe 4.5s ease-in-out infinite 2s",
        }} />
        {/* Bokeh dots */}
        {[
          { top: "22%", left: "12%", size: 3, opacity: 0.3 },
          { top: "38%", left: "88%", size: 2, opacity: 0.22 },
          { top: "55%", left: "7%",  size: 2, opacity: 0.2  },
          { top: "70%", left: "78%", size: 3, opacity: 0.25 },
          { top: "15%", left: "60%", size: 2, opacity: 0.18 },
        ].map((b, i) => (
          <div key={i} className="absolute rounded-full" style={{
            top: b.top, left: b.left, width: b.size * 4, height: b.size * 4,
            background: "#FF1F7D", opacity: b.opacity, filter: "blur(3px)",
            animation: `gb-breathe ${2.5 + i * 0.4}s ease-in-out infinite ${i * 0.6}s`,
          }} />
        ))}
      </div>

      {/* Back button */}
      <div className="relative flex items-center px-5 pt-12 pb-0">
        <button onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      </div>

      {/* ── HERO ── */}
      <div className="relative px-6 pt-5 pb-5">
        <div className="flex items-start justify-between">
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(30px,8.5vw,44px)",
            color: "rgba(255,248,240,0.96)",
            fontWeight: 700,
            fontStyle: "italic",
            lineHeight: 1.22,
            letterSpacing: "-0.01em",
          }}>
            The night<br />belongs to<br />girls.
          </h1>
          {/* BloomBay flower */}
          <div className="mt-1 flex-shrink-0">
            <svg width="30" height="30" viewBox="0 0 30 30">
              {[0,60,120,180,240,300].map((deg, i) => {
                const r = (deg * Math.PI) / 180;
                const cx = 15 + 6.5 * Math.cos(r);
                const cy = 15 + 6.5 * Math.sin(r);
                return <ellipse key={i} cx={cx} cy={cy} rx="4.2" ry="3" fill="rgba(255,31,125,0.78)" transform={`rotate(${deg} ${cx} ${cy})`} />;
              })}
              <circle cx="15" cy="15" r="4.5" fill="#FF1F7D" />
            </svg>
          </div>
        </div>

        {/* Live now + waveform + avatars */}
        <div className="flex items-center gap-2 mt-5">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#FF1F7D", boxShadow: "0 0 6px #FF1F7D" }} />
            <span className="text-xs font-bold" style={{ color: "#FF1F7D", letterSpacing: "0.04em" }}>Live now</span>
          </div>
          {/* Waveform */}
          <div className="flex items-end flex-1 gap-[1.5px] overflow-hidden" style={{ height: "24px" }}>
            {WAVE.map((cls, i) => (
              <div key={i} className={cls} style={{
                width: "2px", borderRadius: "1px", alignSelf: "flex-end", minHeight: "3px", flexShrink: 0,
                background: i % 3 === 0 ? "#FF1F7D" : i % 3 === 1 ? "rgba(255,105,180,0.65)" : "rgba(255,105,180,0.32)",
              }} />
            ))}
          </div>
          {/* Avatars */}
          <div className="flex flex-shrink-0">
            {["#FF1F7D","#C084FC"].map((bg, i) => (
              <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                style={{ background: `linear-gradient(135deg, ${bg}, ${bg}88)`, border: "2px solid #080308", marginLeft: i > 0 ? "-8px" : "0" }}>
                {["A","J"][i]}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-1.5 text-sm" style={{ color: "rgba(255,255,255,0.26)" }}>
          {totalWomen} girls in the room
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginLeft: "24px", marginRight: "24px" }} />

      {/* ── ROOM LIST + NEON SIGN ── */}
      <div className="relative pt-3 pb-28">
        {/* Room rows */}
        <div className="px-5" style={{ paddingRight: "108px" }}>
          {GIRL_BAR_ROOMS.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => setActiveRoom(r)}
              className="w-full flex items-center gap-4 py-3.5 text-left transition-all active:scale-[0.98]"
              style={{ borderBottom: idx < GIRL_BAR_ROOMS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${r.color}1A`, border: `1px solid ${r.color}44` }}>
                <span style={{ fontSize: "22px" }}>{r.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight" style={{ color: "rgba(255,255,255,0.88)" }}>
                  {r.name}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {r.sub}
                </p>
              </div>
              <svg className="flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ))}
        </div>

        {/* Neon sign — right side */}
        <div className="absolute top-0 right-0 bottom-0 flex items-center justify-center pointer-events-none"
          style={{ width: "100px" }}>
          <p className="gb-neon-txt text-center font-black"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "20px",
              fontStyle: "italic",
              color: "#FF1F7D",
              lineHeight: 1.18,
              letterSpacing: "0.03em",
              textShadow: "0 0 8px rgba(255,31,125,0.9), 0 0 22px rgba(255,31,125,0.7), 0 0 44px rgba(255,31,125,0.35)",
            }}>
            GIRLS<br />TALK<br />LATE.
          </p>
        </div>
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
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "#FFE0EC" }}>
          <span className="text-2xl">✦</span>
        </div>
        <p className="text-base font-bold italic mb-2" style={{ fontFamily: "var(--font-instrument)", color: "#111111" }}>
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

function useEnterRoom(): Room {
  const params = useSearchParams();
  const enter = params.get("enter");
  if (enter === "girlbar" || enter === "wall") return enter as Room;
  return "lobby";
}

const LOBBY_DOORS = [
  { id: "wall" as Room, n: "01", name: "The Wall", sub: "Community board", hint: "Leave something here", bg: "#FAF5EE", dark: false, accent: "#FF1F7D", available: true },
  { id: "girlbar" as Room, n: "02", name: "Girl Bar", sub: "Live audio rooms", hint: "🔴 27 women listening", bg: "#1A1008", dark: true, accent: "#FF69B4", available: true },
  { id: "new-keys" as Room, n: "03", name: "New Keys", sub: "Newcomers & arrivals", hint: "", bg: "#FFF0F7", dark: false, accent: "#FF1F7D", available: false },
  { id: "vanity" as Room, n: "04", name: "The Vanity", sub: "Beauty & style advice", hint: "", bg: "#FBF3F7", dark: false, accent: "#FF69B4", available: false },
  { id: "closet" as Room, n: "05", name: "The Closet", sub: "Outfits & what to wear", hint: "", bg: "#F9F5F0", dark: false, accent: "#FF1F7D", available: false },
];

function TheLobbyInner() {
  const enterRoom = useEnterRoom();
  const [room, setRoom] = useState<Room>(enterRoom);

  if (room === "wall")      return <TheWall         onBack={() => setRoom("lobby")} />;
  if (room === "girlbar")   return <GirlBar          onBack={() => setRoom("lobby")} />;
  if (room === "new-keys")  return <ComingSoonRoom   name="New Keys"   sub="Where newcomers arrive and introduce themselves."                                   onBack={() => setRoom("lobby")} />;
  if (room === "vanity")    return <ComingSoonRoom   name="The Vanity" sub="Beauty advice, recommendations, and routines from women who know."                  onBack={() => setRoom("lobby")} />;
  if (room === "closet")    return <ComingSoonRoom   name="The Closet" sub="Outfit questions, style finds, and dressing for the city."                          onBack={() => setRoom("lobby")} />;

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>

      <div className="px-5 pt-12 pb-5 md:px-8 md:pt-8">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ BLOOMBAY</p>
        <h1 className="text-4xl font-bold italic leading-none" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
          The Lobby
        </h1>
        <p className="text-sm mt-1 italic" style={{ fontFamily: "var(--font-instrument)", color: "#aaa" }}>
          Step inside. Choose your room.
        </p>
      </div>

      <div className="px-5 md:px-8">
        {/* Main doors */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {LOBBY_DOORS.slice(0, 2).map((door) => (
            <button
              key={door.id}
              onClick={() => setRoom(door.id)}
              className="relative rounded-2xl text-left transition-all active:scale-[0.96]"
              style={{
                background: door.bg, minHeight: "230px",
                boxShadow: door.dark
                  ? "0 8px 28px rgba(255,31,125,0.28), 0 0 0 1px rgba(255,31,125,0.12)"
                  : "0 6px 24px rgba(255,31,125,0.10), 0 0 0 1.5px rgba(255,31,125,0.1)",
              }}
            >
              {door.id === "girlbar" ? (
                /* ── Arched door illustration for Girl Bar ── */
                <>
                  {/* Ambient glow */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(255,31,125,0.2) 0%, transparent 65%)" }} />
                  {/* Arch door SVG */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingBottom: "36px" }}>
                    <svg width="100" height="148" viewBox="0 0 100 148" fill="none">
                      {/* Arch outline */}
                      <path
                        d="M 14 148 L 14 52 Q 14 8 50 8 Q 86 8 86 52 L 86 148"
                        stroke="#FF1F7D" strokeWidth="2" fill="rgba(255,31,125,0.06)"
                        style={{ filter: "drop-shadow(0 0 6px rgba(255,31,125,0.6))" }}
                      />
                      {/* Inner arch line */}
                      <path
                        d="M 22 148 L 22 55 Q 22 18 50 18 Q 78 18 78 55 L 78 148"
                        stroke="rgba(255,31,125,0.28)" strokeWidth="1" fill="none"
                      />
                      {/* BloomBay flower at top */}
                      <g transform="translate(50, 42)">
                        {[0,60,120,180,240,300].map((deg, i) => {
                          const r2 = (deg * Math.PI) / 180;
                          const cx = 7 * Math.cos(r2);
                          const cy = 7 * Math.sin(r2);
                          return <ellipse key={i} cx={cx} cy={cy} rx="4.5" ry="3.2" fill="rgba(255,31,125,0.72)" transform={`rotate(${deg} ${cx} ${cy})`} />;
                        })}
                        <circle cx="0" cy="0" r="5" fill="#FF1F7D" style={{ filter: "drop-shadow(0 0 4px rgba(255,31,125,0.9))" }} />
                      </g>
                      {/* Door handle */}
                      <rect x="72" y="82" width="5" height="14" rx="2.5"
                        fill="rgba(255,31,125,0.5)"
                        style={{ filter: "drop-shadow(0 0 3px rgba(255,31,125,0.4))" }} />
                    </svg>
                  </div>
                  {/* Live dot */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#FF1F7D", boxShadow: "0 0 5px #FF1F7D" }} />
                  </div>
                  {/* Number */}
                  <p className="absolute top-4 left-4 text-[8px] font-mono font-bold tracking-[0.2em]" style={{ color: "rgba(255,31,125,0.55)" }}>{door.n}</p>
                  {/* Label */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-lg font-bold italic leading-tight mb-0.5"
                      style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.92)" }}>
                      {door.name}
                    </p>
                    <p className="text-[10px] mb-2" style={{ color: "rgba(255,255,255,0.32)" }}>{door.sub}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: door.accent }} />
                      <span className="text-[9px] font-bold tracking-wider" style={{ color: door.accent }}>{door.hint}</span>
                    </div>
                  </div>
                </>
              ) : (
                /* ── Default door card (The Wall) ── */
                <>
                  <div className="absolute inset-[7px] rounded-xl pointer-events-none"
                    style={{ border: "1px solid rgba(255,31,125,0.1)" }} />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ width: "3px", height: "22px", borderRadius: "2px", background: "rgba(0,0,0,0.12)" }} />
                  <p className="absolute top-4 left-4 text-[8px] font-mono font-bold tracking-[0.2em]" style={{ color: door.accent }}>{door.n}</p>
                  <div className="absolute bottom-4 left-4 right-8">
                    <p className="text-lg font-bold italic leading-tight mb-0.5"
                      style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
                      {door.name}
                    </p>
                    <p className="text-[10px] mb-2.5" style={{ color: "rgba(0,0,0,0.38)" }}>{door.sub}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: door.accent }} />
                      <span className="text-[9px] font-bold tracking-wider" style={{ color: door.accent }}>{door.hint}</span>
                    </div>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Secondary doors */}
        <div className="grid grid-cols-3 gap-3">
          {LOBBY_DOORS.slice(2).map((door) => (
            <button
              key={door.id}
              onClick={() => setRoom(door.id)}
              className="relative rounded-2xl text-left transition-all active:scale-[0.96]"
              style={{ background: door.bg, minHeight: "160px", boxShadow: "0 2px 12px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)", opacity: 0.75 }}
            >
              <div className="absolute inset-[6px] rounded-xl pointer-events-none" style={{ border: "1px solid rgba(0,0,0,0.06)" }} />
              <div className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ width: "2.5px", height: "18px", borderRadius: "2px", background: "rgba(0,0,0,0.1)" }} />
              <p className="absolute top-3.5 left-3.5 text-[7px] font-mono font-bold tracking-[0.2em]"
                style={{ color: door.accent, opacity: 0.5 }}>{door.n}</p>
              <div className="absolute top-3 right-5">
                <span className="text-[7px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(0,0,0,0.05)", color: "#bbb" }}>Soon</span>
              </div>
              <div className="absolute bottom-3.5 left-3.5 right-6">
                <p className="text-sm font-bold italic leading-tight mb-0.5"
                  style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>{door.name}</p>
                <p className="text-[9px]" style={{ color: "rgba(0,0,0,0.32)" }}>{door.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live pulse */}
      <div className="px-5 md:px-8 mt-6">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: "#111111" }}>
          <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: "#FF1F7D" }} />
          <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
            35 women in The Lobby right now
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TheLobbyPage() {
  return (
    <Suspense>
      <TheLobbyInner />
    </Suspense>
  );
}
