"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const CREAM = "#F6F1EB";
const DARK  = "#1C1B1C";

const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

type Category = "all" | "fits" | "advice" | "inspo" | "deals" | "tips";

const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string }> = {
  all:    { label: "All",    emoji: "✦",  color: DARK },
  fits:   { label: "Fits",   emoji: "👗",  color: "#C084FC" },
  advice: { label: "Advice", emoji: "💬",  color: "#FF69B4" },
  inspo:  { label: "Inspo",  emoji: "✨",  color: "#C084FC" },
  deals:  { label: "Deals",  emoji: "🏷️", color: "#E8A050" },
  tips:   { label: "Tips",   emoji: "💡",  color: PINK },
};

// ── Mock data ────────────────────────────────────────────────────────────────────
type ClosetPost = {
  id: string;
  author_name: string;
  author_initial: string;
  author_color: string;
  category: Category;
  title: string;
  text: string;
  outfit_items: string[];
  image_placeholder_color: string;
  blooms: number;
  saves: number;
  timeAgo: string;
};

const MOCK_POSTS: ClosetPost[] = [
  {
    id: "1",
    author_name: "Zara",
    author_initial: "Z",
    author_color: "#1C1B1C",
    category: "fits",
    title: "Rate my dinner fit 🖤",
    text: "All black to Carbone tonight. Nervous for some reason",
    outfit_items: ["Black midi dress", "Square toe mules", "Silver hoops"],
    image_placeholder_color: "#1C1B1C",
    blooms: 312,
    saves: 74,
    timeAgo: "2h ago",
  },
  {
    id: "2",
    author_name: "Amara",
    author_initial: "A",
    author_color: "#FF69B4",
    category: "advice",
    title: "Is this too much for a first date?",
    text: "I never know the balance between pretty and trying too hard",
    outfit_items: ["Wrap dress", "Block heels", "Minimal gold jewelry"],
    image_placeholder_color: "#FF69B4",
    blooms: 89,
    saves: 23,
    timeAgo: "4h ago",
  },
  {
    id: "3",
    author_name: "Sofia",
    author_initial: "S",
    author_color: "#FF1F7D",
    category: "tips",
    title: "The lazy girl capsule wardrobe",
    text: "5 pieces that go with literally everything. This changed how I shop",
    outfit_items: ["White shirt", "Dark wash straight jeans", "Black blazer", "Nude loafer", "Simple gold chain"],
    image_placeholder_color: "#FF1F7D",
    blooms: 247,
    saves: 112,
    timeAgo: "6h ago",
  },
  {
    id: "4",
    author_name: "Kezia",
    author_initial: "K",
    author_color: "#C084FC",
    category: "inspo",
    title: "Pinterest vs Reality — I actually nailed it",
    text: "Spent 2 months manifesting this outfit. Finally got there",
    outfit_items: ["Burgundy trench", "Cream wide-leg trousers", "Brown pointed boots"],
    image_placeholder_color: "#C084FC",
    blooms: 178,
    saves: 61,
    timeAgo: "1d ago",
  },
  {
    id: "5",
    author_name: "Nia",
    author_initial: "N",
    author_color: "#E8A050",
    category: "deals",
    title: "ASOS has a hidden sale section right now",
    text: "Seriously, go to sale > occasion wear. I got a £120 dress for £18",
    outfit_items: [],
    image_placeholder_color: "#E8A050",
    blooms: 134,
    saves: 88,
    timeAgo: "1d ago",
  },
  {
    id: "6",
    author_name: "Temi",
    author_initial: "T",
    author_color: "#83C5A0",
    category: "fits",
    title: "Casual Sunday done right",
    text: "When you look put together but literally got dressed in 4 minutes",
    outfit_items: ["Linen co-ord set", "Flat sandals", "Woven tote"],
    image_placeholder_color: "#83C5A0",
    blooms: 201,
    saves: 45,
    timeAgo: "2d ago",
  },
  {
    id: "7",
    author_name: "Aaliyah",
    author_initial: "A",
    author_color: "#FF8EC7",
    category: "advice",
    title: "How do you style bodycon when you have a curvy figure?",
    text: "I love the look but feel self-conscious, tips welcome",
    outfit_items: [],
    image_placeholder_color: "#FF8EC7",
    blooms: 156,
    saves: 19,
    timeAgo: "2d ago",
  },
  {
    id: "8",
    author_name: "Jade",
    author_initial: "J",
    author_color: "#EC4899",
    category: "tips",
    title: "Understanding your colour season changed everything",
    text: "Once you know if you're warm/cool toned, shopping becomes so much easier",
    outfit_items: [],
    image_placeholder_color: "#EC4899",
    blooms: 267,
    saves: 130,
    timeAgo: "3d ago",
  },
];

// ── darken hex colour slightly for gradient ──────────────────────────────────────
function darkenHex(hex: string, amount = 40): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (n >> 16) - amount);
  const g = Math.max(0, ((n >> 8) & 0xff) - amount);
  const b = Math.max(0, (n & 0xff) - amount);
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;
}

// ── ClosetCard ───────────────────────────────────────────────────────────────────
function ClosetCard({
  post,
  saved,
  onToggleSave,
}: {
  post: ClosetPost;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const [replied, setReplied] = useState(false);
  const meta = CATEGORY_META[post.category];
  const dark2 = darkenHex(post.image_placeholder_color);

  return (
    <div style={{ position: "relative", paddingTop: 4, paddingLeft: 4 }}>
      {/* Paper layer 1 */}
      <div style={{
        position: "absolute", inset: 0,
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 2px 12px rgba(28,27,28,0.08)",
        transform: "rotate(1.2deg)",
        zIndex: 0,
      }} />
      {/* Paper layer 2 */}
      <div style={{
        position: "absolute", inset: 0,
        background: "#fafafa",
        borderRadius: 18,
        boxShadow: "0 1px 6px rgba(28,27,28,0.05)",
        transform: "rotate(-0.6deg)",
        zIndex: 1,
      }} />

      {/* Card body */}
      <div style={{
        position: "relative", zIndex: 2,
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 2px 16px rgba(28,27,28,0.07)",
        overflow: "hidden",
      }}>
        {/* Image placeholder — 3:4 aspect */}
        <div style={{
          width: "100%",
          aspectRatio: "3 / 4",
          background: `linear-gradient(160deg, ${post.image_placeholder_color}, ${dark2})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 16px",
          gap: 8,
        }}>
          {post.outfit_items.length > 0 ? (
            post.outfit_items.map((item, i) => (
              <span key={i} style={{
                fontFamily: "var(--font-caveat)",
                fontSize: 15,
                color: "rgba(255,255,255,0.92)",
                background: "rgba(255,255,255,0.15)",
                borderRadius: 8,
                padding: "4px 10px",
                textAlign: "center",
              }}>
                👗 {item}
              </span>
            ))
          ) : (
            <span style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
            }}>
              No image yet
            </span>
          )}
        </div>

        {/* Author chip */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              background: post.author_color,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                {post.author_initial}
              </span>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: DARK, lineHeight: 1, margin: 0 }}>
                {post.author_name}
              </p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(28,27,28,0.4)", margin: 0, lineHeight: 1.2 }}>
                {post.timeAgo}
              </p>
            </div>
          </div>

          {/* Category tag */}
          <span style={{
            fontSize: 9, fontFamily: "var(--font-jost)", fontWeight: 700,
            letterSpacing: "0.06em", textTransform: "uppercase" as const,
            color: meta.color, background: `${meta.color}18`,
            borderRadius: 20, padding: "3px 8px", flexShrink: 0,
          }}>
            {meta.emoji} {meta.label}
          </span>
        </div>

        {/* Title */}
        <div style={{ padding: "8px 14px 0" }}>
          <p style={{
            fontFamily: "var(--font-playfair)", fontStyle: "italic",
            fontSize: 14, fontWeight: 700, color: DARK, lineHeight: 1.25, margin: 0,
          }}>
            {post.title}
          </p>
        </div>

        {/* Post text */}
        <div style={{ padding: "6px 14px 0" }}>
          <p style={{
            fontFamily: "var(--font-caveat)", fontSize: 14,
            color: "rgba(28,27,28,0.65)", lineHeight: 1.5, margin: 0,
          }}>
            {post.text}
          </p>
        </div>

        {/* Outfit item chips — horizontal scroll */}
        {post.outfit_items.length > 0 && (
          <div style={{
            display: "flex", gap: 6, overflowX: "auto", padding: "8px 14px 0",
            scrollbarWidth: "none",
          }}>
            {post.outfit_items.map((item, i) => (
              <span key={i} style={{
                flexShrink: 0, fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 600,
                color: DARK, background: "rgba(28,27,28,0.06)",
                borderRadius: 20, padding: "3px 9px", whiteSpace: "nowrap",
              }}>
                👗 {item}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px 14px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Blooms */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 13 }}>🌸</span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: PINK }}>
                {post.blooms.toLocaleString()}
              </span>
            </div>

            {/* Saves / bookmark */}
            <button onClick={onToggleSave} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? PINK : "none"} stroke={PINK} strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: PINK }}>
                {post.saves}
              </span>
            </button>
          </div>

          {/* Reply button */}
          <button
            onClick={() => setReplied(r => !r)}
            style={{
              background: replied ? PINK : "transparent",
              border: `1.5px solid ${PINK}`,
              borderRadius: 20, padding: "4px 10px", cursor: "pointer",
              fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700,
              color: replied ? "#fff" : PINK, letterSpacing: "0.04em",
              transition: "all 0.15s",
            }}
          >
            {replied ? "✓ Replied" : "Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CreateSheet ──────────────────────────────────────────────────────────────────
function CreateSheet({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<Category>("fits");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [outfitItems, setOutfitItems] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: "1.5px solid rgba(28,27,28,0.12)", background: "#fff",
    fontFamily: "var(--font-jost)", fontSize: 14, color: DARK,
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800,
    letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(28,27,28,0.45)",
    display: "block", marginBottom: 6,
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 70 }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 80,
        background: CREAM, backgroundImage: PAPER_TEX, backgroundRepeat: "repeat",
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        boxShadow: "0 -8px 40px rgba(0,0,0,0.16)",
        maxHeight: "90dvh", overflowY: "auto", padding: "0 18px 40px",
      }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(28,27,28,0.18)" }} />
        </div>

        <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, fontWeight: 700, color: DARK, margin: "8px 0 4px" }}>
          Post to The Closet
        </h2>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(28,27,28,0.5)", margin: "0 0 20px" }}>
          Share your fit, ask for advice, drop a tip ✦
        </p>

        {/* Category */}
        <label style={labelStyle}>Category</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {(Object.keys(CATEGORY_META) as Category[]).filter(c => c !== "all").map(c => {
            const m = CATEGORY_META[c];
            return (
              <button key={c} type="button" onClick={() => setCategory(c)}
                style={{
                  padding: "5px 12px", borderRadius: 20, cursor: "pointer",
                  border: category === c ? `1.5px solid ${PINK}` : "1.5px solid rgba(28,27,28,0.15)",
                  background: category === c ? PINK : "transparent",
                  color: category === c ? "#fff" : DARK,
                  fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600,
                }}>
                {m.emoji} {m.label}
              </button>
            );
          })}
        </div>

        {/* Title */}
        <label style={labelStyle}>Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Rate my dinner fit 🖤"
          style={{ ...inputStyle, marginBottom: 16 }}
        />

        {/* Text — lined paper feel */}
        <label style={labelStyle}>What&apos;s on your mind?</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          placeholder="Tell the girls what's going on..."
          style={{
            ...inputStyle, marginBottom: 16, resize: "none",
            fontFamily: "var(--font-caveat)", fontSize: 16,
            backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(28,27,28,0.07) 27px, rgba(28,27,28,0.07) 28px)",
            lineHeight: "28px", paddingTop: 8,
          }}
        />

        {/* Outfit items */}
        <label style={labelStyle}>Outfit items (comma-separated)</label>
        <input
          value={outfitItems}
          onChange={e => setOutfitItems(e.target.value)}
          placeholder="Black midi dress, Square toe mules, Silver hoops"
          style={{ ...inputStyle, marginBottom: 24 }}
        />

        <button
          style={{
            width: "100%", background: PINK, color: "#fff", border: "none",
            borderRadius: 14, padding: "14px 0", fontSize: 14,
            fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer",
          }}
          onClick={onClose}
        >
          Share to The Closet →
        </button>
      </div>
    </>
  );
}

// ── ClosetPage ───────────────────────────────────────────────────────────────────
export function ClosetPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);

  const filtered = activeCategory === "all"
    ? MOCK_POSTS
    : MOCK_POSTS.filter(p => p.category === activeCategory);

  function toggleSave(id: string) {
    setSavedIds(prev => {
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
      {/* Sticky header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        background: "rgba(246,241,235,0.9)",
        borderBottom: "1px solid rgba(28,27,28,0.08)",
        padding: "14px 18px 10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/member/avenue" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(28,27,28,0.06)", color: DARK,
              textDecoration: "none", fontSize: 16, flexShrink: 0,
            }}>←</Link>
            <div>
              <h1 style={{
                fontFamily: "var(--font-playfair)", fontStyle: "italic",
                fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.1,
                background: `linear-gradient(90deg, #E8007A, ${PINK}, #FF6B9D)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                The Closet.
              </h1>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, margin: 0, color: "rgba(28,27,28,0.5)", lineHeight: 1.2 }}>
                Fits. Advice. Style. ✦
              </p>
            </div>
          </div>

          {/* Members badge */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            background: `${PINK}12`, borderRadius: 12, padding: "6px 10px",
          }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800, color: PINK, lineHeight: 1 }}>
              2.1k
            </span>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(28,27,28,0.45)", lineHeight: 1.3 }}>
              members
            </span>
          </div>
        </div>
      </header>

      {/* Category filter strip */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "14px 18px", scrollbarWidth: "none" }}>
        {(Object.keys(CATEGORY_META) as Category[]).map(c => {
          const m = CATEGORY_META[c];
          const active = activeCategory === c;
          return (
            <button key={c} onClick={() => setActiveCategory(c)}
              style={{
                flexShrink: 0, padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                border: active ? `1.5px solid ${PINK}` : "1.5px solid rgba(28,27,28,0.15)",
                background: active ? PINK : "transparent",
                color: active ? "#fff" : DARK,
                fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600,
                letterSpacing: "0.03em", transition: "all 0.15s",
              }}>
              {m.emoji} {m.label}
            </button>
          );
        })}
      </div>

      {/* Posts — alternating featured (full-width) and 2-column grid */}
      <div style={{ padding: "0 18px 120px" }}>
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(28,27,28,0.4)", fontFamily: "var(--font-caveat)", fontSize: 18, marginTop: 48 }}>
            Nothing here yet. Be first ✦
          </p>
        )}

        {filtered.map((post, i) => {
          // Every 3rd post (index 0, 3, 6…) is featured full-width; the rest pair up in 2-col
          const isFeatured = i % 3 === 0;

          if (isFeatured) {
            // Featured full-width card
            return (
              <div key={post.id} style={{ marginBottom: 14 }}>
                <ClosetCard
                  post={post}
                  saved={savedIds.has(post.id)}
                  onToggleSave={() => toggleSave(post.id)}
                />
              </div>
            );
          }

          // Pair two cards side-by-side; only render the pair when i is odd (first of pair)
          if (i % 3 === 1) {
            const next = filtered[i + 1];
            return (
              <div key={post.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <ClosetCard
                  post={post}
                  saved={savedIds.has(post.id)}
                  onToggleSave={() => toggleSave(post.id)}
                />
                {next ? (
                  <ClosetCard
                    key={next.id}
                    post={next}
                    saved={savedIds.has(next.id)}
                    onToggleSave={() => toggleSave(next.id)}
                  />
                ) : (
                  <div /> /* empty filler to keep grid balanced */
                )}
              </div>
            );
          }

          // i % 3 === 2 — already rendered inside the pair above, skip
          return null;
        })}
      </div>

      {/* FAB — fixed bottom-right */}
      <button
        onClick={() => setShowCreate(true)}
        style={{
          position: "fixed", bottom: 28, right: 20, zIndex: 40,
          width: 52, height: 52, borderRadius: "50%",
          background: PINK, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 20px ${PINK}60`,
          fontSize: 24, color: "#fff",
          transition: "transform 0.15s",
        }}
        aria-label="Create post"
      >
        +
      </button>

      {showCreate && <CreateSheet onClose={() => setShowCreate(false)} />}
    </div>
  );
}
