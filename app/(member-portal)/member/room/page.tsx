"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Room = "avenue" | "wall" | "girlbar" | "new-keys" | "vanity" | "closet";
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
    emoji: "✦", label: "Happening Now", sub: "Right now, in real time",
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
  { id: 4, name: "Hot Topics",        sub: "What's on everyone's mind",    desc: "The conversations happening right now.",                 women: 84,  live: true,  color: "#FF1F7D", emoji: "♡" },
];

// ── Seed content ─────────────────────────────────────────────────────────────

const SEED_POSTS: WallPost[] = [
  { id: 101, author: "Aaliyah M.", initial: "A", color: "#FF1F7D", time: "2m ago",  text: "Just watched the most beautiful sunset at the High Line. Go RIGHT NOW if you can — 30 min of this light left.", likes: 34, replies: 8,  pinned: false, category: "now"      },
  { id: 102, author: "Jade O.",    initial: "J", color: "#FF69B4", time: "8m ago",  text: "Drinks at Employees Only in 45 min. Table for 4, one spot left. DM fast.",                                          likes: 12, replies: 5,  pinned: false, category: "now"      },
  { id: 103, author: "Sofia K.",   initial: "S", color: "#FF1F7D", time: "1h ago",  text: "Sunday slow walk in Prospect Park. Looking for 3–4 women who want a gentle morning. No agenda, just good air.",    likes: 28, replies: 11, pinned: true,  category: "gather"   },
  { id: 104, author: "Naomi B.",   initial: "N", color: "#FF69B4", time: "2h ago",  text: "Anyone for Sadelle's brunch Saturday? I'll book for 6 if we have people. The smoked salmon platter is non-negotiable.", likes: 19, replies: 7,  pinned: false, category: "gather"   },
  { id: 105, author: "Priya R.",   initial: "P", color: "#F472B6", time: "3h ago",  text: "Yoga in Prospect Park, Tuesday 8AM. Free. Bring a mat and someone to talk to after.",                             likes: 41, replies: 14, pinned: false, category: "gather"   },
  { id: 106, author: "Kezia T.",   initial: "K", color: "#FF1F7D", time: "5h ago",  text: "The Met at 9:30AM on weekday mornings — empty, beautiful, the Temple of Dendur room is yours. Anyone is welcome.", likes: 56, replies: 18, pinned: false, category: "gather"   },
  { id: 107, author: "Iris D.",    initial: "I", color: "#A78BFA", time: "30m ago", text: "Best solo dinner spot in the West Village? I want somewhere warm and not too loud. Friday night.",                likes: 22, replies: 19, pinned: false, category: "ask"      },
  { id: 108, author: "Rachel M.",  initial: "R", color: "#C084FC", time: "1h ago",  text: "Has anyone tried therapy in NYC they'd recommend? Looking for someone warm, not too clinical, not too expensive.", likes: 45, replies: 31, pinned: true,  category: "ask"      },
  { id: 109, author: "Deja W.",    initial: "D", color: "#FF69B4", time: "2h ago",  text: "What do you wear to an art gallery opening? First one ever, tomorrow night, I genuinely have no idea.",            likes: 33, replies: 24, pinned: false, category: "ask"      },
  { id: 110, author: "Lena V.",    initial: "L", color: "#A78BFA", time: "4h ago",  text: "Anyone know a good tailor in Brooklyn who does alterations well and actually takes her time?",                     likes: 17, replies: 9,  pinned: false, category: "ask"      },
  { id: 111, author: "Zara F.",    initial: "Z", color: "#FF1F7D", time: "45m ago", text: "The Archway Café under the Manhattan Bridge on a Tuesday morning is a religious experience. You need to go.",      likes: 67, replies: 22, pinned: true,  category: "discover" },
  { id: 112, author: "Sofia K.",   initial: "S", color: "#FF69B4", time: "2h ago",  text: "You can get into MoMA free after 5:30PM on Fridays if you know a member. I'm a member. Just DM me.",             likes: 89, replies: 41, pinned: false, category: "discover" },
  { id: 113, author: "Naomi B.",   initial: "N", color: "#FF1F7D", time: "4h ago",  text: "McNally Jackson has a quiet reading room upstairs nobody talks about. You can sit there for hours with no one bothering you.", likes: 54, replies: 16, pinned: false, category: "discover" },
  { id: 114, author: "Aaliyah M.", initial: "A", color: "#F472B6", time: "6h ago",  text: "Russ & Daughters before 9AM on a Wednesday — empty, peaceful, the best bagels of your life. No wait at all.",     likes: 72, replies: 27, pinned: false, category: "discover" },
  { id: 115, author: "Book Club",  initial: "B", color: "#FF1F7D", time: "1h ago",  text: "Reading The Women by Kristin Hannah this month. Meeting March 15 at McNally Jackson, 6PM. Reply to RSVP.",         likes: 38, replies: 22, pinned: true,  category: "plan"     },
  { id: 116, author: "Sofia K.",   initial: "S", color: "#FF69B4", time: "3h ago",  text: "Chelsea gallery crawl Saturday afternoon. 3 galleries, 4PM start. Slow walk, no rush, wine at the end.",           likes: 29, replies: 13, pinned: false, category: "plan"     },
  { id: 117, author: "Priya R.",   initial: "P", color: "#F472B6", time: "5h ago",  text: "Summer rooftop series — one every Friday in June. Westlight to start. Save the dates, it's happening.",            likes: 61, replies: 34, pinned: false, category: "plan"     },
];

// ── Wall Note Card ────────────────────────────────────────────────────────────

const PIN_COLORS: Record<WallCategory, string> = {
  now: "#FF1F7D", gather: "#FF69B4", ask: "#A78BFA", discover: "#FBBF24", plan: "#34D399",
};
const NOTE_BG: Record<WallCategory, string> = {
  now: "#1C0E16", gather: "#FDFAF6", ask: "#FAF8FF", discover: "#FFFEF8", plan: "#FDFFF8",
};

function WallNoteCard({
  post, zone, liked, setLiked, onExpand,
}: {
  post: WallPost; zone: WallZone; liked: Set<number>;
  setLiked: React.Dispatch<React.SetStateAction<Set<number>>>;
  onExpand: () => void;
}) {
  const isLiked = liked.has(post.id);
  const rot = ((post.id * 13 + 7) % 11 - 5) * 0.42;
  const pinColor = PIN_COLORS[zone.id];
  const noteBg = NOTE_BG[zone.id];

  return (
    <div
      className="relative cursor-pointer wall-note"
      style={{ paddingTop: "13px", transform: `rotate(${rot}deg)`, transformOrigin: "top center" }}
      onClick={onExpand}
    >
      {/* Pushpin */}
      <div
        className="absolute left-1/2 top-0 z-10 w-[18px] h-[18px] rounded-full"
        style={{
          transform: "translateX(-50%)",
          background: `radial-gradient(circle at 38% 35%, rgba(255,255,255,0.55) 0%, ${pinColor} 52%, color-mix(in srgb, ${pinColor} 70%, black) 100%)`,
          boxShadow: `0 3px 8px rgba(0,0,0,0.4), 0 0 0 2.5px rgba(255,255,255,0.18)`,
        }}
      />

      {/* Note paper */}
      <div
        className="transition-transform active:scale-[0.97]"
        style={{
          background: noteBg,
          borderRadius: "2px",
          padding: "14px 13px 12px",
          borderTop: `3px solid ${pinColor}`,
          boxShadow: zone.dark
            ? "0 8px 32px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.4)"
            : "0 6px 24px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {/* Zone + pin indicator */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
            style={{ background: `${zone.accent}18`, color: zone.accent }}
          >
            {zone.emoji} {zone.label}
          </span>
          <div className="flex items-center gap-1.5">
            {post.pinned && <span className="text-[9px]" style={{ color: zone.accent }}>📌</span>}
            {zone.id === "now" && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#FF1F7D" }} />}
          </div>
        </div>

        {/* Main text */}
        <p
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "13.5px",
            color: zone.textColor,
            lineHeight: "1.68",
            marginBottom: "14px",
          }}
        >
          {post.text}
        </p>

        {/* Author row */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
            style={{ background: post.color }}
          >
            {post.initial}
          </div>
          <p className="text-[10px] font-bold italic flex-1 min-w-0 truncate"
            style={{ fontFamily: "var(--font-playfair)", color: zone.subColor }}>
            {post.author}
          </p>
          <p className="text-[9px] flex-shrink-0" style={{ color: zone.subColor, opacity: 0.55 }}>{post.time}</p>
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-4 pt-2.5"
          style={{ borderTop: zone.dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)" }}
        >
          <button
            onClick={e => {
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
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <span className="text-[10px] font-bold">{post.replies}</span>
          </div>
          {post.replies > 15 && (
            <span className="ml-auto text-[8px] font-bold tracking-wider uppercase" style={{ color: zone.accent }}>
              Hot thread
            </span>
          )}
        </div>
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
                fontFamily: "var(--font-playfair)",
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
            style={{ fontFamily: "var(--font-playfair)", color: "#2A1820", lineHeight: "1.72" }}
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
                <p className="text-[13px] leading-relaxed pl-8" style={{ fontFamily: "var(--font-playfair)", color: "#444", lineHeight: "1.65" }}>
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
                fontFamily: "var(--font-playfair)",
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

const ZONE_FILTERS: { id: WallCategory | "all"; label: string; emoji: string }[] = [
  { id: "all",      label: "All",         emoji: "✦" },
  { id: "now",      label: "Happening Now", emoji: "✦" },
  { id: "gather",   label: "Gather",      emoji: "🌸" },
  { id: "ask",      label: "Ask the Room", emoji: "💬" },
  { id: "discover", label: "Discover",    emoji: "✦" },
  { id: "plan",     label: "Plan",        emoji: "📌" },
];

function TheWall({ onBack }: { onBack: () => void }) {
  const [liked, setLiked]       = useState<Set<number>>(new Set());
  const [userPosts, setUserPosts] = useState<WallPost[]>([]);
  const [replies, setReplies]   = useState<WallReply[]>([]);
  const [composing, setComposing] = useState(false);
  const [composingCat, setComposingCat] = useState<WallCategory>("gather");
  const [expanded, setExpanded] = useState<{ post: WallPost; zone: WallZone } | null>(null);
  const [activeFilter, setActiveFilter] = useState<WallCategory | "all">("all");

  const WOMEN_HERE = 12;
  const allPosts = [...userPosts, ...SEED_POSTS];
  const displayed = activeFilter === "all"
    ? allPosts
    : allPosts.filter(p => p.category === activeFilter);

  // pinned first within filter
  const sorted = [
    ...displayed.filter(p => p.pinned),
    ...displayed.filter(p => !p.pinned),
  ];

  function handlePost(text: string, cat: WallCategory) {
    setUserPosts(prev => [{
      id: Date.now(), author: "You", initial: "Y", color: "#FF1F7D",
      time: "just now", text, likes: 0, replies: 0, pinned: false, category: cat,
    }, ...prev]);
  }

  function handleReply(postId: number, text: string) {
    setReplies(prev => [...prev, {
      id: Date.now(), postId, author: "You", initial: "Y", color: "#FF1F7D",
      time: "just now", text,
    }]);
  }

  function toggleLike(id: number) {
    setLiked(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  const activeZoneInfo = WALL_ZONES.find(z => z.id === activeFilter);
  const filterAccent = activeZoneInfo ? activeZoneInfo.accent : "#FF1F7D";

  return (
    <div className="min-h-screen pb-28" style={{ background: "linear-gradient(160deg, #FF1F7D 0%, #C51B7A 55%, #A0145E 100%)" }}>
      <style>{`
        @keyframes wall-fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .wall-note { animation: wall-fade 0.28s ease both; }
        .wall-bg {
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px, 14px 14px;
          background-position: 0 0, 7px 7px;
        }
      `}</style>

      {/* Subtle dot grid overlay */}
      <div className="fixed inset-0 pointer-events-none wall-bg" />

      {/* ── HEADER ── */}
      <div className="relative px-5 pt-16 pb-5 md:px-8 md:pt-4">
        {/* Back */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>THE AVENUE</p>
        </div>

        {/* Title block */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="font-black italic leading-none"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(44px,11vw,60px)", color: "white", lineHeight: 0.86, letterSpacing: "-0.025em" }}>
              The<br />
              <span style={{ color: "rgba(255,255,255,0.75)" }}>Wall.</span>
            </h1>
            <p className="text-sm italic mt-2.5" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.6)" }}>
              A community board. Leave something.
            </p>
          </div>

          {/* Live chip */}
          <div className="rounded-2xl px-4 py-3 text-center flex-shrink-0"
            style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
            <p className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "28px", color: "white" }}>
              {WOMEN_HERE}
            </p>
            <p className="text-[7px] font-bold tracking-[0.22em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              HERE NOW
            </p>
          </div>
        </div>

        {/* Live avatars */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {WALL_AVATARS.map((a, i) => (
              <div key={i}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: a.c, border: "2px solid #FF1F7D", marginLeft: i > 0 ? "-8px" : "0" }}>
                {a.i}
              </div>
            ))}
          </div>
          <p className="text-[10px] ml-2" style={{ color: "rgba(255,255,255,0.55)" }}>
            +{WOMEN_HERE - WALL_AVATARS.length} more reading right now
          </p>
          <span className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: "#FF1F7D" }} />
        </div>
      </div>

      {/* ── COMPOSE TRIGGER ── */}
      <div className="relative px-5 md:px-8 mb-5">
        <button
          onClick={() => { setComposingCat("gather"); setComposing(true); }}
          className="w-full rounded-2xl flex items-center justify-between px-5 py-4 transition-all active:scale-[0.98]"
          style={{
            background: "rgba(255,255,255,0.18)",
            boxShadow: "0 3px 18px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)",
            border: "1.5px dashed rgba(255,255,255,0.45)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF1F7D" }}>
              <span className="text-white text-xs font-bold">Y</span>
            </div>
            <p className="italic" style={{ fontFamily: "var(--font-caveat)", color: "rgba(255,255,255,0.6)", fontSize: "16px" }}>
              Leave something on the wall…
            </p>
          </div>
          <span className="text-base font-bold" style={{ color: "#FF1F7D" }}>✦</span>
        </button>
      </div>

      {/* ── SUBJECT FILTER ── */}
      <div
        className="relative flex gap-2 overflow-x-auto px-5 pb-4 md:px-8"
        style={{ scrollbarWidth: "none" }}
      >
        {ZONE_FILTERS.map(f => {
          const isActive = activeFilter === f.id;
          const zone = WALL_ZONES.find(z => z.id === f.id);
          const accent = zone ? zone.accent : "#FF1F7D";
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-bold transition-all active:scale-95"
              style={isActive
                ? { background: "white", color: "#FF1F7D", boxShadow: "0 3px 12px rgba(0,0,0,0.2)" }
                : { background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.88)", border: "1.5px solid rgba(255,255,255,0.3)" }}
            >
              {f.emoji} {f.label}
              {f.id !== "all" && (
                <span className="ml-1.5 text-[9px] font-bold opacity-60">
                  {allPosts.filter(p => p.category === f.id).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── NOTE COUNT ── */}
      <div className="relative px-5 md:px-8 pb-3">
        <p className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
          {sorted.length} note{sorted.length !== 1 ? "s" : ""} on the wall
          {activeFilter !== "all" && activeZoneInfo && ` · ${activeZoneInfo.label}`}
        </p>
      </div>

      {/* ── MASONRY BOARD ── */}
      <div className="relative px-4 md:px-8 pb-10">
        <div className="columns-2 md:columns-3 gap-x-4">
          {sorted.map((post) => {
            const zone = WALL_ZONES.find(z => z.id === post.category) ?? WALL_ZONES[1];
            return (
              <div key={post.id} className="mb-5 break-inside-avoid" style={{ paddingTop: "2px" }}>
                <WallNoteCard
                  post={post}
                  zone={zone}
                  liked={liked}
                  setLiked={setLiked}
                  onExpand={() => setExpanded({ post, zone })}
                />
              </div>
            );
          })}
        </div>

        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span style={{ fontSize: "36px", opacity: 0.3 }}>
              {activeZoneInfo?.emoji ?? "✦"}
            </span>
            <p className="italic text-center" style={{ fontFamily: "var(--font-caveat)", color: "#B08870", fontSize: "16px" }}>
              Nothing here yet. Be the first to leave a note.
            </p>
            <button
              onClick={() => { setComposingCat(activeFilter as WallCategory); setComposing(true); }}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white mt-1 active:scale-95 transition-transform"
              style={{ background: filterAccent }}>
              + Leave a note
            </button>
          </div>
        )}
      </div>

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
          <span className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: room.live ? "#FF1F7D" : "rgba(255,255,255,0.3)" }}>{room.live ? "LIVE" : ""}</span>
        </div>
        <div className="w-9 h-9" />
      </div>

      {/* Room name */}
      <div className="relative px-6 mt-4 mb-8 text-center">
        <p className="text-[9px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color:"rgba(255,105,180,0.5)" }}>GIRL BAR · ROOM</p>
        <h1 className="font-black italic leading-none mb-3" style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(36px,10vw,52px)", color:"white", letterSpacing:"-0.02em" }}>
          {room.name}
        </h1>
        <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.38)", fontFamily:"var(--font-playfair)" }}>{room.desc}</p>
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
      <div className="relative flex items-center px-5 pt-16 pb-0">
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
      <div className="px-5 pt-16 pb-4 md:px-8 md:pt-4 flex items-center gap-4">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#FF1F7D" }}>THE AVENUE</p>
          <h1 className="text-3xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>{name}</h1>
        </div>
      </div>
      <div className="px-5 md:px-8 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "#FFE0EC" }}>
          <span className="text-2xl">✦</span>
        </div>
        <p className="text-base font-bold italic mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
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

// ── The Avenue ────────────────────────────────────────────────────────────────

function useEnterRoom(): Room {
  const params = useSearchParams();
  const enter = params.get("enter");
  if (enter === "girlbar" || enter === "wall") return enter as Room;
  return "avenue";
}

const AVENUE_DOORS = [
  { id: "wall" as Room, n: "01", name: "The Wall", sub: "Community board", hint: "Leave a note", bg: "#FAF5EE", dark: false, accent: "#FF1F7D", available: true, newCount: 4 },
  { id: "girlbar" as Room, n: "02", name: "Girl Bar", sub: "Live audio rooms", hint: "27 women listening", bg: "#1A1008", dark: true, accent: "#FF69B4", available: true, newCount: 11 },
  { id: "new-keys" as Room, n: "03", name: "New Keys", sub: "Newcomers & arrivals", hint: "", bg: "#FFF0F7", dark: false, accent: "#FF1F7D", available: false, newCount: 0 },
  { id: "vanity" as Room, n: "04", name: "The Vanity", sub: "Beauty & style advice", hint: "", bg: "#FBF3F7", dark: false, accent: "#FF69B4", available: false, newCount: 0 },
  { id: "closet" as Room, n: "05", name: "The Closet", sub: "Outfits & what to wear", hint: "", bg: "#F9F5F0", dark: false, accent: "#FF1F7D", available: false, newCount: 0 },
];

function TheAvenueInner() {
  const enterRoom = useEnterRoom();
  const [room, setRoom] = useState<Room>(enterRoom);

  if (room === "wall")    return <TheWall onBack={() => setRoom("avenue")} />;
  if (room === "girlbar") return <GirlBar onBack={() => setRoom("avenue")} />;

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "#0C050F" }}>

      <div className="px-5 pt-16 pb-4 md:px-8 md:pt-4">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "rgba(255,31,125,0.6)" }}>✦ BLOOMBAY</p>
        <h1 className="text-4xl font-bold italic leading-none" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,248,240,0.94)" }}>
          The Avenue
        </h1>
        <p className="text-sm mt-1 italic" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.28)" }}>
          Step inside. Choose your room.
        </p>
      </div>

      <div className="px-5 md:px-8">

        {/* ── Two large main doors ── */}
        <div className="flex gap-3 mb-3">

          {/* Door — The Wall */}
          <button
            onClick={() => setRoom("wall")}
            className="relative flex-1 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-[0.96]"
            style={{
              height: "272px",
              borderRadius: "50% 50% 8px 8px / 13% 13% 8px 8px",
              background: "rgba(255,246,235,0.68)",
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              border: "1.5px solid rgba(255,31,125,0.2)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.5)",
            }}
          >
            <p className="absolute top-4 left-4 text-[7px] font-mono font-bold tracking-[0.22em]"
              style={{ color: "rgba(255,31,125,0.38)" }}>01</p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ width: "5px", height: "30px", borderRadius: "3px", background: "rgba(0,0,0,0.14)" }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", fontStyle: "italic", fontWeight: 700, color: "#1A0A12", textAlign: "center", lineHeight: 1.2 }}>
              The Wall
            </p>
            <p style={{ fontSize: "10px", color: "rgba(0,0,0,0.3)", textAlign: "center" }}>Community board</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#FF1F7D" }} />
              <span style={{ fontSize: "9px", color: "#FF1F7D", fontWeight: 700, letterSpacing: "0.1em" }}>Leave a note</span>
            </div>
          </button>

          {/* Door — Girl Bar */}
          <button
            onClick={() => setRoom("girlbar")}
            className="relative flex-1 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-[0.96]"
            style={{
              height: "272px",
              borderRadius: "50% 50% 8px 8px / 13% 13% 8px 8px",
              background: "rgba(8,2,18,0.9)",
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              border: "1.5px solid rgba(255,31,125,0.38)",
              boxShadow: "0 0 44px rgba(255,31,125,0.22), 0 10px 40px rgba(0,0,0,0.4), inset 0 0 28px rgba(255,31,125,0.06)",
            }}
          >
            {/* Inner glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: "inherit", background: "radial-gradient(ellipse at 50% 25%, rgba(255,31,125,0.18) 0%, transparent 65%)" }} />
            <p className="absolute top-4 left-4 text-[7px] font-mono font-bold tracking-[0.22em]"
              style={{ color: "rgba(255,31,125,0.42)" }}>02</p>
            <span className="absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse"
              style={{ background: "#FF1F7D", boxShadow: "0 0 6px #FF1F7D" }} />
            <div className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ width: "5px", height: "30px", borderRadius: "3px", background: "rgba(255,105,180,0.2)" }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", fontStyle: "italic", fontWeight: 700, color: "rgba(255,248,240,0.93)", textAlign: "center", lineHeight: 1.2 }}>
              Girl Bar
            </p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", textAlign: "center" }}>Live audio rooms</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#FF1F7D", boxShadow: "0 0 5px #FF1F7D" }} />
              <span style={{ fontSize: "9px", color: "#FF69B4", fontWeight: 700, letterSpacing: "0.1em" }}>27 women listening</span>
            </div>
          </button>

        </div>

        {/* ── More rooms teaser ── */}
        <div className="flex items-center gap-4 px-5 py-4 rounded-2xl mt-1"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color: "rgba(255,31,125,0.65)" }}>More rooms on the way</p>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.22)", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
              New Keys · The Vanity · The Closet
            </p>
          </div>
          <span className="flex-shrink-0 text-[9px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,31,125,0.1)", color: "rgba(255,31,125,0.55)", border: "1px solid rgba(255,31,125,0.18)" }}>
            SOON
          </span>
        </div>

      </div>

      {/* Live pulse */}
      <div className="px-5 md:px-8 mt-5">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: "#FF1F7D" }} />
          <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>
            35 women in The Avenue right now
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TheAvenuePage() {
  return (
    <Suspense>
      <TheAvenueInner />
    </Suspense>
  );
}
