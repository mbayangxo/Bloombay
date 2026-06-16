"use client";

import { useState, useEffect, useCallback } from "react";
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

type WallPost = {
  id: string;
  category: Category;
  text: string;
  blooms: number;
  created_at: string;
  is_seed?: boolean;
  seed_author?: string | null;
  author: { id: string; first_name: string | null; full_name: string | null } | null;
};

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function authorName(post: WallPost): string {
  if (post.is_seed) return post.seed_author ?? "Yande ✦";
  const a = post.author;
  if (!a) return "Bloomie";
  return a.full_name ?? a.first_name ?? "Bloomie";
}

function authorInitial(post: WallPost): string {
  if (post.is_seed) return "✦";
  return authorName(post)[0]?.toUpperCase() ?? "B";
}

const AVATAR_COLORS = ["#FF1F7D", "#7C3AED", "#F59E0B", "#059669", "#0EA5E9", "#EC4899"];
function avatarColor(id: string, isSeed?: boolean): string {
  if (isSeed) return "#FF1F7D";
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

// ── PostCard ──────────────────────────────────────────────────────────────────
function PostCard({ post, bloomed, onBloom }: { post: WallPost; bloomed: boolean; onBloom: () => void }) {
  const meta = CATEGORY_META[post.category] ?? CATEGORY_META.mood;
  const [localBlooms, setLocalBlooms] = useState(post.blooms);
  const [busy, setBusy] = useState(false);
  const color = avatarColor(post.author?.id ?? post.id, post.is_seed);

  async function handleBloom() {
    if (busy) return;
    setBusy(true);
    const next = !bloomed;
    setLocalBlooms(n => next ? n + 1 : Math.max(0, n - 1));
    onBloom();
    try {
      const res = await fetch("/api/wall/bloom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, bloomed: next }),
      });
      if (res.ok) {
        const d = await res.json();
        setLocalBlooms(d.blooms);
      }
    } catch { /* optimistic, ignore */ }
    setBusy(false);
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(28,27,28,0.06)", transform: "rotate(1.2deg)", zIndex: 0 }} />
      <div style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 3px 20px rgba(28,27,28,0.09)", overflow: "hidden", zIndex: 1 }}>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, ${color}BB)` }} />
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${color}, ${color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, color: "#fff" }}>{authorInitial(post)}</span>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: DARK, lineHeight: 1.1, margin: 0 }}>{authorName(post)}</p>
                <span style={{ fontSize: 9, fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: meta.color, background: `${meta.color}14`, borderRadius: 20, padding: "2px 7px", display: "inline-block", marginTop: 2 }}>
                  {meta.icon} {meta.label}
                </span>
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(28,27,28,0.35)", flexShrink: 0 }}>{timeAgo(post.created_at)}</span>
          </div>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: DARK, lineHeight: 1.55, margin: "0 0 14px" }}>{post.text}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, borderTop: "1px solid rgba(28,27,28,0.07)", padding: "10px 0 12px" }}>
            <button onClick={handleBloom} style={{ display: "flex", alignItems: "center", gap: 5, background: bloomed ? `${PINK}14` : "transparent", border: bloomed ? `1.5px solid ${PINK}40` : "1.5px solid rgba(28,27,28,0.1)", borderRadius: 20, padding: "5px 12px", cursor: "pointer", transition: "all 0.15s" }}>
              <span style={{ fontSize: 13 }}>🌸</span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: bloomed ? PINK : "rgba(28,27,28,0.45)" }}>{localBlooms.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CreateSheet ────────────────────────────────────────────────────────────────
function CreateSheet({ onClose, onPosted }: { onClose: () => void; onPosted: (post: WallPost) => void }) {
  const [category, setCategory] = useState<Exclude<Category, "all">>("mood");
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const LINE_BG = `repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(28,27,28,0.07) 27px, rgba(28,27,28,0.07) 28px)`;

  async function submit() {
    if (!text.trim() || posting) return;
    setPosting(true);
    setError(null);
    try {
      const res = await fetch("/api/wall/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, text: text.trim() }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Something went wrong");
        setPosting(false);
        return;
      }
      const post = await res.json() as WallPost;
      onPosted(post);
      onClose();
    } catch {
      setError("Something went wrong");
      setPosting(false);
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 70 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 80, background: CREAM, backgroundImage: PAPER_TEX, backgroundRepeat: "repeat", borderTopLeftRadius: 24, borderTopRightRadius: 24, boxShadow: "0 -8px 40px rgba(0,0,0,0.16)", maxHeight: "90dvh", overflowY: "auto", padding: "0 18px 44px" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(28,27,28,0.18)" }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, fontWeight: 700, color: DARK, margin: "8px 0 4px" }}>Post to The Wall</h2>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(28,27,28,0.5)", margin: "0 0 20px" }}>Say it. Share it. Let the community vibe ✦</p>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(28,27,28,0.45)", marginBottom: 8 }}>Category</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {(Object.keys(CATEGORY_META) as Category[]).filter(c => c !== "all").map(c => {
            const m = CATEGORY_META[c];
            return (
              <button key={c} type="button" onClick={() => setCategory(c as Exclude<Category, "all">)} style={{ padding: "5px 12px", borderRadius: 20, cursor: "pointer", border: category === c ? `1.5px solid ${PINK}` : "1.5px solid rgba(28,27,28,0.15)", background: category === c ? PINK : "transparent", color: category === c ? "#fff" : DARK, fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600 }}>
                {m.icon} {m.label}
              </button>
            );
          })}
        </div>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(28,27,28,0.45)", marginBottom: 8 }}>What&apos;s on your mind?</p>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={6} placeholder="Type it out…" style={{ width: "100%", boxSizing: "border-box", background: `#fff ${LINE_BG}`, backgroundAttachment: "local", border: "1.5px solid rgba(28,27,28,0.12)", borderRadius: 12, padding: "10px 14px", fontFamily: "var(--font-caveat)", fontSize: 16, color: DARK, lineHeight: "28px", resize: "none", outline: "none", marginBottom: error ? 8 : 24 }} />
        {error && <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#B71C1C", marginBottom: 16 }}>{error}</p>}

        <button onClick={submit} disabled={!text.trim() || posting} style={{ width: "100%", background: text.trim() ? PINK : "rgba(28,27,28,0.12)", color: text.trim() ? "#fff" : "rgba(28,27,28,0.3)", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 14, fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.05em", cursor: text.trim() ? "pointer" : "default" }}>
          {posting ? "Posting…" : "Bloom it →"}
        </button>
      </div>
    </>
  );
}

// ── WallPage ──────────────────────────────────────────────────────────────────
export function WallPage() {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [bloomedIds, setBloomedIds] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);

  const loadPosts = useCallback(async (cat: Category) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wall/posts?category=${cat}&limit=30`);
      if (res.ok) setPosts(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(activeCategory); }, [activeCategory, loadPosts]);

  function changeCategory(cat: Category) {
    setActiveCategory(cat);
  }

  function toggleBloom(id: string) {
    setBloomedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handlePosted(post: WallPost) {
    setPosts(prev => [post, ...prev]);
  }

  return (
    <div style={{ minHeight: "100dvh", background: CREAM, backgroundImage: PAPER_TEX, backgroundRepeat: "repeat", fontFamily: "var(--font-jost), sans-serif", color: DARK, overflowX: "hidden" }}>
      {/* ── Header ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 30, background: `linear-gradient(160deg, #C2005A 0%, ${PINK} 55%, #FF6EB4 100%)`, padding: "18px 18px 16px", boxShadow: "0 4px 24px rgba(255,31,125,0.28)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <Link href="/member/avenue" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", color: "#fff", textDecoration: "none", fontSize: 18, flexShrink: 0, marginTop: 4 }}>←</Link>
          <div style={{ flex: 1, marginLeft: 12 }}>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 44, fontWeight: 700, margin: 0, lineHeight: 1, color: "#fff", letterSpacing: "-0.01em" }}>The Wall.</h1>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 17, margin: "4px 0 0", color: "rgba(255,255,255,0.82)" }}>Post. Share. Vibe.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.18)", borderRadius: 20, padding: "6px 11px", flexShrink: 0, marginTop: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#A7F3D0" }} />
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>Live</span>
          </div>
        </div>
      </header>

      {/* ── Category filter ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(246,241,235,0.95)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", borderBottom: "1px solid rgba(28,27,28,0.08)", padding: "10px 18px" }}>
        <div style={{ display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none" }}>
          {(Object.keys(CATEGORY_META) as Category[]).map(c => {
            const m = CATEGORY_META[c];
            const active = activeCategory === c;
            return (
              <button key={c} onClick={() => changeCategory(c)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, cursor: "pointer", border: active ? `1.5px solid ${PINK}` : "1.5px solid rgba(28,27,28,0.15)", background: active ? PINK : "transparent", color: active ? "#fff" : DARK, fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, letterSpacing: "0.03em", transition: "all 0.15s" }}>
                {m.icon} {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Feed ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "16px 18px 110px" }}>
        {loading && (
          <p style={{ textAlign: "center", color: "rgba(28,27,28,0.4)", fontFamily: "var(--font-caveat)", fontSize: 18, marginTop: 48 }}>Loading…</p>
        )}
        {!loading && posts.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(28,27,28,0.4)", fontFamily: "var(--font-caveat)", fontSize: 18, marginTop: 48 }}>Nothing here yet. Be first ✦</p>
        )}
        {posts.map(post => (
          <PostCard key={post.id} post={post} bloomed={bloomedIds.has(post.id)} onBloom={() => toggleBloom(post.id)} />
        ))}
      </div>

      {/* ── FAB ── */}
      <button onClick={() => setShowCreate(true)} style={{ position: "fixed", bottom: 28, right: 22, zIndex: 40, width: 60, height: 60, borderRadius: "50%", background: PINK, boxShadow: `0 6px 28px rgba(255,31,125,0.45)`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", fontWeight: 300 }} aria-label="Post something">+</button>

      {showCreate && <CreateSheet onClose={() => setShowCreate(false)} onPosted={handlePosted} />}
    </div>
  );
}
