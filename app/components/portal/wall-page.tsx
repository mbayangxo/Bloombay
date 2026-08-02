"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SectionHeader } from "@/app/components/shared/section-header";
import { PAGE_BG, PINK as _PINK, INK } from "@/app/components/shared/design-tokens";
import { FlowerButton } from "@/app/components/shared/flower-button";
import type { GiftKind } from "@/lib/bloom-gifts";
import { unitsForKind } from "@/lib/bloom-gifts";

const PINK  = _PINK;
const CREAM = PAGE_BG;
const DARK  = INK;

const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

type Category = "all" | "mood" | "connects" | "wins" | "questions" | "rant";

const CATEGORY_META: Record<Category, { label: string; icon: string; color: string }> = {
  all:       { label: "All",       icon: "✦",    color: DARK },
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

// Deterministic per-post "pinned at a slight angle" tilt — same id always
// gets the same tilt, so cards don't jitter on refetch/re-render.
function pinTilt(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ((h % 7) - 3) * 0.8; // -2.4deg .. 2.4deg
}

function Pushpin({ color }: { color: string }) {
  return (
    <div style={{
      position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)",
      width: 16, height: 16, borderRadius: "50%",
      background: `radial-gradient(circle at 35% 30%, ${color}, ${color}CC 60%, ${color}88)`,
      boxShadow: "0 2px 4px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.5)",
      zIndex: 2,
    }} />
  );
}

// ── PostCard ──────────────────────────────────────────────────────────────────
function PostCard({
  post,
  myKind,
  onGiftChange,
}: {
  post: WallPost;
  myKind: GiftKind | null;
  onGiftChange: (id: string, kind: GiftKind | null, units: number) => void;
}) {
  const meta = CATEGORY_META[post.category] ?? CATEGORY_META.mood;
  const [localUnits, setLocalUnits] = useState(post.blooms);
  const [localKind, setLocalKind] = useState<GiftKind | null>(myKind);
  const color = avatarColor(post.author?.id ?? post.id, post.is_seed);

  useEffect(() => {
    setLocalKind(myKind);
  }, [myKind]);

  useEffect(() => {
    setLocalUnits(post.blooms);
  }, [post.blooms]);

  async function onGive(kind: GiftKind) {
    const prevKind = localKind;
    const prevUnits = localUnits;
    const prevGave = prevKind ? unitsForKind(prevKind) : 0;
    const nextUnits = unitsForKind(kind);

    if (prevKind === kind) {
      setLocalKind(null);
      setLocalUnits(Math.max(0, prevUnits - prevGave));
      onGiftChange(post.id, null, Math.max(0, prevUnits - prevGave));
    } else {
      setLocalKind(kind);
      setLocalUnits(Math.max(0, prevUnits - prevGave + nextUnits));
      onGiftChange(post.id, kind, Math.max(0, prevUnits - prevGave + nextUnits));
    }

    try {
      const res = await fetch("/api/flowers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wall_post_id: post.id, kind }),
      });
      if (res.ok) {
        const d = await res.json();
        setLocalUnits(d.count ?? 0);
        setLocalKind(d.kind ?? null);
        onGiftChange(post.id, d.kind ?? null, d.count ?? 0);
      }
    } catch {
      setLocalKind(prevKind);
      setLocalUnits(prevUnits);
      onGiftChange(post.id, prevKind, prevUnits);
    }
  }

  async function onTakeBack() {
    const prevKind = localKind;
    const prevUnits = localUnits;
    const prevGave = prevKind ? unitsForKind(prevKind) : 0;
    setLocalKind(null);
    setLocalUnits(Math.max(0, prevUnits - prevGave));
    onGiftChange(post.id, null, Math.max(0, prevUnits - prevGave));
    try {
      await fetch("/api/flowers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wall_post_id: post.id, take_back: true }),
      });
    } catch {
      setLocalKind(prevKind);
      setLocalUnits(prevUnits);
    }
  }

  const tilt = pinTilt(post.id);

  return (
    <div style={{ position: "relative", breakInside: "avoid", marginBottom: 14, transform: `rotate(${tilt}deg)` }}>
      <Pushpin color={meta.color} />
      <div style={{ position: "relative", background: "#fff", borderRadius: 6, boxShadow: "0 6px 16px rgba(28,27,28,0.14), 0 1px 0 rgba(255,255,255,0.4) inset", overflow: "hidden", zIndex: 1, border: "1px solid rgba(28,27,28,0.05)" }}>
        <div style={{ padding: "16px 14px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${color}, ${color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, color: "#fff" }}>{authorInitial(post)}</span>
              </div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: DARK, lineHeight: 1.1, margin: 0 }}>{authorName(post)}</p>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(28,27,28,0.32)", flexShrink: 0 }}>{timeAgo(post.created_at)}</span>
          </div>
          <span style={{ fontSize: 8, fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: meta.color, background: `${meta.color}14`, borderRadius: 20, padding: "2px 7px", display: "inline-block", marginBottom: 8 }}>
            {meta.icon} {meta.label}
          </span>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: DARK, lineHeight: 1.5, margin: "0 0 12px" }}>{post.text}</p>
          <div style={{ display: "flex", alignItems: "center", borderTop: "1px solid rgba(28,27,28,0.07)", paddingTop: 10 }}>
            <FlowerButton
              size="sm"
              units={localUnits}
              myKind={localKind}
              onGive={onGive}
              onTakeBack={onTakeBack}
            />
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
  const [myGifts, setMyGifts] = useState<Record<string, GiftKind | null>>({});
  const [showCreate, setShowCreate] = useState(false);

  const loadPosts = useCallback(async (cat: Category) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wall/posts?category=${cat}&limit=30`);
      if (res.ok) {
        const data = (await res.json()) as WallPost[];
        setPosts(data);
        // Load viewer's gifts for visible posts (batched sequentially for simplicity)
        const gifts: Record<string, GiftKind | null> = {};
        await Promise.all(
          data.slice(0, 30).map(async (p) => {
            try {
              const fr = await fetch(`/api/flowers?wall_post_id=${p.id}`);
              if (fr.ok) {
                const fj = await fr.json();
                gifts[p.id] = (fj.myKind as GiftKind | null) ?? null;
                if (typeof fj.units === "number") p.blooms = fj.units;
              }
            } catch {
              /* ignore */
            }
          }),
        );
        setMyGifts(gifts);
        setPosts([...data]);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(activeCategory); }, [activeCategory, loadPosts]);

  function changeCategory(cat: Category) {
    setActiveCategory(cat);
  }

  function onGiftChange(id: string, kind: GiftKind | null, units: number) {
    setMyGifts((prev) => ({ ...prev, [id]: kind }));
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, blooms: units } : p)));
  }

  function handlePosted(post: WallPost) {
    setPosts(prev => [post, ...prev]);
  }

  return (
    <div style={{ minHeight: "100dvh", background: CREAM, backgroundImage: PAPER_TEX, backgroundRepeat: "repeat", fontFamily: "var(--font-jost), sans-serif", color: DARK, overflowX: "hidden", paddingBottom: 120 }}>
      {/* ── Header ── */}
      <SectionHeader
        title="The Wall"
        subtitle="Post. Share. Vibe."
        backHref="/member/avenue"
        theme="light"
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,31,125,0.08)", borderRadius: 20, padding: "6px 11px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: PINK, letterSpacing: "0.04em" }}>Live</span>
          </div>
        }
      />

      {/* ── Category filter ── */}
      <div style={{ position: "sticky", top: 60, zIndex: 20, background: "rgba(255,240,246,0.95)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", borderBottom: "1px solid rgba(26,26,26,0.08)", padding: "10px 18px" }}>
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

      {/* ── Corkboard feed — pinned notes in a staggered grid, not a plain list ── */}
      <div style={{
        margin: "14px 14px 0",
        borderRadius: 18,
        padding: "18px 12px 90px",
        background: `repeating-radial-gradient(circle at 20px 20px, rgba(255,31,125,0.05) 0px, rgba(255,31,125,0.05) 1.5px, transparent 1.5px, transparent 20px), ${CREAM}`,
        boxShadow: "inset 0 2px 10px rgba(28,27,28,0.06), 0 1px 0 rgba(255,255,255,0.4)",
        border: "1px solid rgba(255,31,125,0.08)",
      }}>
        {loading && (
          <p style={{ textAlign: "center", color: "rgba(28,27,28,0.4)", fontFamily: "var(--font-caveat)", fontSize: 18, marginTop: 48 }}>Loading…</p>
        )}
        {!loading && posts.length === 0 && (
          <div style={{ position: "relative", marginTop: 24, maxWidth: 260, marginLeft: "auto", marginRight: "auto" }}>
            <Pushpin color={PINK} />
            <div style={{
              position: "relative", background: "#fff", borderRadius: 6, transform: "rotate(-1.2deg)",
              boxShadow: "0 6px 16px rgba(28,27,28,0.14)", padding: "28px 20px", textAlign: "center",
            }}>
              <p style={{ fontSize: 24, marginBottom: 8 }}>📌</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 6 }}>Nothing pinned yet</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(28,27,28,0.5)" }}>Tap + to share the first mood, win, or question ✦</p>
            </div>
          </div>
        )}
        <div style={{ columnCount: 2, columnGap: 12 }}>
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              myKind={myGifts[post.id] ?? null}
              onGiftChange={onGiftChange}
            />
          ))}
        </div>
      </div>

      {/* ── FAB ── */}
      <button onClick={() => setShowCreate(true)} style={{ position: "fixed", bottom: 28, right: 22, zIndex: 40, width: 60, height: 60, borderRadius: "50%", background: PINK, boxShadow: `0 6px 28px rgba(255,31,125,0.45)`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", fontWeight: 300 }} aria-label="Post something">+</button>

      {showCreate && <CreateSheet onClose={() => setShowCreate(false)} onPosted={handlePosted} />}
    </div>
  );
}
