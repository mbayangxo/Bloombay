"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const CREAM = "#F6F1EB";
const DARK  = "#1C1B1C";

const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

type Category = "all" | "mood" | "connects" | "wins" | "questions" | "rant";

const CATEGORY_META: Record<Category, { label: string; icon: string; color: string }> = {
  all:       { label: "All",       icon: "all",  color: DARK },
  mood:      { label: "Mood",      icon: "✦",    color: "#9C27B0" },
  connects:  { label: "Connects",  icon: "🤝",   color: "#1565C0" },
  wins:      { label: "Wins",      icon: "✨",   color: "#2E7D32" },
  questions: { label: "Questions", icon: "?",    color: "#E65100" },
  rant:      { label: "Rant",      icon: "💬",   color: "#B71C1C" },
};

// ── Mock posts ───────────────────────────────────────────────────────────────────
type WallPost = {
  id: string;
  author_name: string;
  author_initial: string;
  author_color: [string, string]; // gradient pair
  category: Category;
  text: string;
  blooms: number;
  comments: number;
  timeAgo: string;
};

const MOCK_POSTS: WallPost[] = [
  {
    id: "1",
    author_name: "Aaliyah R.",
    author_initial: "A",
    author_color: ["#A78BFA", "#7C3AED"],
    category: "connects",
    text: "Looking for a study partner in Brooklyn 📚 Anyone free this week? I'm working through a data analytics cert and it hits different with someone else grinding alongside you.",
    blooms: 47,
    comments: 12,
    timeAgo: "2h ago",
  },
  {
    id: "2",
    author_name: "Temi O.",
    author_initial: "T",
    author_color: ["#FDE68A", "#F59E0B"],
    category: "wins",
    text: "Finally got the job offer 🥹 I ugly cried in the bathroom for a full 10 minutes. Three rounds of interviews, one rejection, and a lot of prayer. We did it.",
    blooms: 201,
    comments: 43,
    timeAgo: "4h ago",
  },
  {
    id: "3",
    author_name: "Jade M.",
    author_initial: "J",
    author_color: ["#FCA5A5", "#EF4444"],
    category: "rant",
    text: "Why is dating in NYC so humbling lmaooo like sir you live in a basement in Bushwick and you're being picky??? okay bestie.",
    blooms: 312,
    comments: 67,
    timeAgo: "5h ago",
  },
  {
    id: "4",
    author_name: "Sofia D.",
    author_initial: "S",
    author_color: ["#6EE7B7", "#059669"],
    category: "questions",
    text: "What's everyone's go-to gym in Brooklyn/BK area? Need a new one — looking for something that's not too bro-y and has actual classes. Budget ~$60/month.",
    blooms: 89,
    comments: 31,
    timeAgo: "7h ago",
  },
  {
    id: "5",
    author_name: "Amara S.",
    author_initial: "A",
    author_color: ["#C4B5FD", "#8B5CF6"],
    category: "mood",
    text: "I'm in my quiet era and I've never felt more myself. Less noise, less explaining, less performing. Just me, my routines, and peace.",
    blooms: 156,
    comments: 24,
    timeAgo: "9h ago",
  },
  {
    id: "6",
    author_name: "Nia B.",
    author_initial: "N",
    author_color: ["#86EFAC", "#16A34A"],
    category: "wins",
    text: "Just booked my flight to Lagos ✈️ first time back in 8 years. I don't even know how to feel. Scared. Excited. Ready to cry at the airport.",
    blooms: 267,
    comments: 55,
    timeAgo: "11h ago",
  },
  {
    id: "7",
    author_name: "Kezia N.",
    author_initial: "K",
    author_color: ["#FBB6CE", "#EC4899"],
    category: "mood",
    text: "Can we normalize leaving events early when you're done? No explanation needed. No long goodbyes. Just a quiet exit. Protect your energy at all costs.",
    blooms: 178,
    comments: 38,
    timeAgo: "13h ago",
  },
  {
    id: "8",
    author_name: "Zara F.",
    author_initial: "Z",
    author_color: ["#93C5FD", "#3B82F6"],
    category: "connects",
    text: "Anyone want to do a morning walk this Saturday? Prospect Park, 8am. No pressure, just vibes and movement. DM me or drop a comment 🌿",
    blooms: 134,
    comments: 29,
    timeAgo: "1d ago",
  },
];

// ── PostCard ─────────────────────────────────────────────────────────────────────
function PostCard({ post, bloomed, onBloom }: { post: WallPost; bloomed: boolean; onBloom: () => void }) {
  const meta = CATEGORY_META[post.category];
  const [localBlooms, setLocalBlooms] = useState(post.blooms);

  function handleBloom() {
    if (!bloomed) setLocalBlooms(n => n + 1);
    onBloom();
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Stack paper behind — physical depth effect */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 2px 12px rgba(28,27,28,0.06)",
        transform: "rotate(1.2deg)",
        zIndex: 0,
      }} />

      {/* Main card */}
      <div style={{
        position: "relative",
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 3px 20px rgba(28,27,28,0.09)",
        overflow: "hidden",
        zIndex: 1,
      }}>
        {/* Top gradient bar */}
        <div style={{
          height: 4,
          background: `linear-gradient(90deg, ${post.author_color[0]}, ${post.author_color[1]})`,
        }} />

        <div style={{ padding: "14px 16px 0" }}>
          {/* Author row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              {/* Avatar circle */}
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, ${post.author_color[0]}, ${post.author_color[1]})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}>
                <span style={{
                  fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, color: "#fff",
                }}>
                  {post.author_initial}
                </span>
              </div>

              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: DARK, lineHeight: 1.1, margin: 0 }}>
                  {post.author_name}
                </p>
                {/* Category chip */}
                <span style={{
                  fontSize: 9, fontFamily: "var(--font-jost)", fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase" as const,
                  color: meta.color, background: `${meta.color}14`,
                  borderRadius: 20, padding: "2px 7px", display: "inline-block", marginTop: 2,
                }}>
                  {meta.icon} {meta.label}
                </span>
              </div>
            </div>

            {/* Time ago */}
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(28,27,28,0.35)", flexShrink: 0 }}>
              {post.timeAgo}
            </span>
          </div>

          {/* Post text in Caveat */}
          <p style={{
            fontFamily: "var(--font-caveat)", fontSize: 15, color: DARK, lineHeight: 1.55,
            margin: "0 0 14px",
          }}>
            {post.text}
          </p>

          {/* Bottom action bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            borderTop: "1px solid rgba(28,27,28,0.07)",
            padding: "10px 0 12px",
          }}>
            {/* Bloom button */}
            <button
              onClick={handleBloom}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: bloomed ? `${PINK}14` : "transparent",
                border: bloomed ? `1.5px solid ${PINK}40` : "1.5px solid rgba(28,27,28,0.1)",
                borderRadius: 20, padding: "5px 12px", cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 13 }}>🌸</span>
              <span style={{
                fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700,
                color: bloomed ? PINK : "rgba(28,27,28,0.45)",
              }}>
                {localBlooms.toLocaleString()}
              </span>
            </button>

            {/* Comments count */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(28,27,28,0.35)" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, color: "rgba(28,27,28,0.35)" }}>
                {post.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CreateSheet ──────────────────────────────────────────────────────────────────
function CreateSheet({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<Category>("mood");
  const [text, setText] = useState("");

  const LINE_BG = `repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 27px,
    rgba(28,27,28,0.07) 27px,
    rgba(28,27,28,0.07) 28px
  )`;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 70 }}
      />

      {/* Sheet */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 80,
        background: CREAM, backgroundImage: PAPER_TEX, backgroundRepeat: "repeat",
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        boxShadow: "0 -8px 40px rgba(0,0,0,0.16)",
        maxHeight: "90dvh", overflowY: "auto", padding: "0 18px 44px",
      }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(28,27,28,0.18)" }} />
        </div>

        <h2 style={{
          fontFamily: "var(--font-playfair)", fontStyle: "italic",
          fontSize: 22, fontWeight: 700, color: DARK, margin: "8px 0 4px",
        }}>
          Post to The Wall
        </h2>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(28,27,28,0.5)", margin: "0 0 20px" }}>
          Say it. Share it. Let the community vibe ✦
        </p>

        {/* Category chips */}
        <p style={{
          fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800,
          letterSpacing: "0.1em", textTransform: "uppercase" as const,
          color: "rgba(28,27,28,0.45)", marginBottom: 8,
        }}>
          Category
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {(Object.keys(CATEGORY_META) as Category[]).filter(c => c !== "all").map(c => {
            const m = CATEGORY_META[c];
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                style={{
                  padding: "5px 12px", borderRadius: 20, cursor: "pointer",
                  border: category === c ? `1.5px solid ${PINK}` : "1.5px solid rgba(28,27,28,0.15)",
                  background: category === c ? PINK : "transparent",
                  color: category === c ? "#fff" : DARK,
                  fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600,
                }}
              >
                {m.icon} {m.label}
              </button>
            );
          })}
        </div>

        {/* Lined paper textarea */}
        <p style={{
          fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800,
          letterSpacing: "0.1em", textTransform: "uppercase" as const,
          color: "rgba(28,27,28,0.45)", marginBottom: 8,
        }}>
          What&apos;s on your mind?
        </p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={6}
          placeholder="Type it out…"
          style={{
            width: "100%", boxSizing: "border-box",
            background: `#fff ${LINE_BG}`,
            backgroundAttachment: "local",
            border: "1.5px solid rgba(28,27,28,0.12)",
            borderRadius: 12,
            padding: "10px 14px",
            fontFamily: "var(--font-caveat)", fontSize: 16, color: DARK,
            lineHeight: "28px",
            resize: "none", outline: "none",
            marginBottom: 24,
          }}
        />

        {/* Submit */}
        <button
          onClick={onClose}
          style={{
            width: "100%", background: PINK, color: "#fff", border: "none",
            borderRadius: 14, padding: "14px 0", fontSize: 14,
            fontFamily: "var(--font-jost)", fontWeight: 700,
            letterSpacing: "0.05em", cursor: "pointer",
          }}
        >
          Bloom it →
        </button>
      </div>
    </>
  );
}

// ── WallPage ─────────────────────────────────────────────────────────────────────
export function WallPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [bloomedIds, setBloomedIds] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);

  const filtered = activeCategory === "all"
    ? MOCK_POSTS
    : MOCK_POSTS.filter(p => p.category === activeCategory);

  function toggleBloom(id: string) {
    setBloomedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: CREAM,
      backgroundImage: PAPER_TEX,
      backgroundRepeat: "repeat",
      fontFamily: "var(--font-jost), sans-serif",
      color: DARK,
      overflowX: "hidden",
    }}>
      {/* ── Header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        background: `linear-gradient(160deg, #C2005A 0%, ${PINK} 55%, #FF6EB4 100%)`,
        padding: "18px 18px 16px",
        boxShadow: "0 4px 24px rgba(255,31,125,0.28)",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          {/* Back arrow */}
          <Link
            href="/member/avenue"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)", color: "#fff",
              textDecoration: "none", fontSize: 18, flexShrink: 0, marginTop: 4,
            }}
          >
            ←
          </Link>

          {/* Title block */}
          <div style={{ flex: 1, marginLeft: 12 }}>
            <h1 style={{
              fontFamily: "var(--font-playfair)", fontStyle: "italic",
              fontSize: 44, fontWeight: 700, margin: 0, lineHeight: 1,
              color: "#fff", letterSpacing: "-0.01em",
            }}>
              The Wall.
            </h1>
            <p style={{
              fontFamily: "var(--font-caveat)", fontSize: 17, margin: "4px 0 0",
              color: "rgba(255,255,255,0.82)",
            }}>
              Post. Share. Vibe.
            </p>
          </div>

          {/* Online badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.18)",
            borderRadius: 20, padding: "6px 11px", flexShrink: 0, marginTop: 6,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#A7F3D0" }} />
            <span style={{
              fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700,
              color: "#fff", letterSpacing: "0.04em",
            }}>
              142 online
            </span>
          </div>
        </div>
      </header>

      {/* ── Sticky category filter ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(246,241,235,0.95)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(28,27,28,0.08)",
        padding: "10px 18px",
      }}>
        <div style={{ display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none" }}>
          {(Object.keys(CATEGORY_META) as Category[]).map(c => {
            const m = CATEGORY_META[c];
            const active = activeCategory === c;
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                style={{
                  flexShrink: 0, padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                  border: active ? `1.5px solid ${PINK}` : "1.5px solid rgba(28,27,28,0.15)",
                  background: active ? PINK : "transparent",
                  color: active ? "#fff" : DARK,
                  fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600,
                  letterSpacing: "0.03em", transition: "all 0.15s",
                }}
              >
                {m.icon} {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Feed ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "16px 18px 110px" }}>
        {filtered.length === 0 && (
          <p style={{
            textAlign: "center", color: "rgba(28,27,28,0.4)",
            fontFamily: "var(--font-caveat)", fontSize: 18, marginTop: 48,
          }}>
            Nothing here yet. Be first ✦
          </p>
        )}
        {filtered.map(post => (
          <PostCard
            key={post.id}
            post={post}
            bloomed={bloomedIds.has(post.id)}
            onBloom={() => toggleBloom(post.id)}
          />
        ))}
      </div>

      {/* ── FAB — Post Something ── */}
      <button
        onClick={() => setShowCreate(true)}
        style={{
          position: "fixed", bottom: 28, right: 22, zIndex: 40,
          width: 60, height: 60, borderRadius: "50%",
          background: PINK,
          boxShadow: `0 6px 28px rgba(255,31,125,0.45)`,
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, color: "#fff", fontWeight: 300,
          transition: "transform 0.15s",
        }}
        aria-label="Post something"
      >
        +
      </button>

      {showCreate && <CreateSheet onClose={() => setShowCreate(false)} />}
    </div>
  );
}
