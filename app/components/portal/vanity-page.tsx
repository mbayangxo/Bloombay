"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getVanityPosts,
  getMyVanitySaveIds,
  createVanityPost,
  saveVanityPost,
  unsaveVanityPost,
  type VanityPost as RealVanityPost,
} from "@/lib/actions/vanity";

const PINK  = "#FF1F7D";
const ROSE  = "#E8007A";
const CREAM = "#FAF6F2";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

type VanityCategory = "all" | "skincare" | "makeup" | "haircare" | "fragrance" | "nails";
type PostGradient = { gradientA: string; gradientB: string };
type VanityPost = RealVanityPost & PostGradient;

const CATEGORY_META: Record<VanityCategory, { label: string; color: string }> = {
  all:       { label: "All",       color: "#1C1B1C" },
  skincare:  { label: "Skincare",  color: "#A0522D" },
  makeup:    { label: "Makeup",    color: PINK },
  haircare:  { label: "Hair",      color: "#6A1B9A" },
  fragrance: { label: "Fragrance", color: "#C2185B" },
  nails:     { label: "Nails",     color: ROSE },
};

const CATEGORY_GRADIENTS: Record<Exclude<VanityCategory, "all">, PostGradient> = {
  skincare:  { gradientA: "#E8C9A0", gradientB: "#A0522D" },
  makeup:    { gradientA: "#FF9A9E", gradientB: PINK },
  haircare:  { gradientA: "#C79EE8", gradientB: "#6A1B9A" },
  fragrance: { gradientA: "#F0A8C8", gradientB: "#C2185B" },
  nails:     { gradientA: "#FFB3D0", gradientB: ROSE },
};

function gradientForCategory(category: string): PostGradient {
  return CATEGORY_GRADIENTS[category as Exclude<VanityCategory, "all">] ?? CATEGORY_GRADIENTS.skincare;
}

// A small hand-mirror mark — the Vanity's own signature, not reused elsewhere.
function MirrorMark({ size = 88, opacity = 0.16 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ opacity }}>
      <ellipse cx="50" cy="40" rx="30" ry="34" stroke="white" strokeWidth="2.5" />
      <ellipse cx="50" cy="40" rx="22" ry="26" stroke="white" strokeWidth="1" opacity="0.6" />
      <path d="M50 74 L50 96" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M36 96 L64 96" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function Sparkle({ x, y, size, opacity }: { x: number; y: number; size: number; opacity: number }) {
  return (
    <text x={x} y={y} fontSize={size} fill="white" opacity={opacity} style={{ fontFamily: "serif" }}>✦</text>
  );
}

// ── Post card ─────────────────────────────────────────────────────────────────

function VanityCard({ post, saved, onSave }: { post: VanityPost; saved: boolean; onSave: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[post.category as VanityCategory] ?? CATEGORY_META.skincare;
  const authorName = post.author_name ?? "A member";
  const authorInitial = authorName[0]?.toUpperCase() ?? "?";

  return (
    <div style={{ position: "relative" }}>
      {/* Paper layers */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: `${post.gradientA}22`, transform: "rotate(1deg)", zIndex: 0 }} />
      <div style={{
        position: "relative", zIndex: 1, borderRadius: 18, overflow: "hidden",
        background: `${GRAIN}, white`,
        backgroundSize: "200px 200px, auto",
        boxShadow: "0 6px 28px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        border: "1px solid rgba(255,31,125,0.06)",
      }}>
        {/* Colour bar top */}
        <div style={{ height: 6, background: `linear-gradient(90deg, ${post.gradientA}, ${post.gradientB})` }} />
        <div style={{ padding: "14px 16px 16px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, ${post.gradientA}, ${post.gradientB})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: "white",
              }}>{authorInitial}</div>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "#1C1B1C" }}>{authorName}</p>
              </div>
            </div>
            <span style={{
              fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800,
              letterSpacing: "0.18em", color: meta.color,
              background: `${meta.color}12`, borderRadius: 99, padding: "3px 8px",
            }}>{meta.label.toUpperCase()}</span>
          </div>

          {/* Title */}
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: "#1C1B1C", lineHeight: 1.3, marginBottom: 6 }}>{post.title}</p>

          {/* Text */}
          {post.content && (
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.58)", lineHeight: 1.55, marginBottom: 12 }}>{post.content}</p>
          )}

          {/* Products */}
          {post.products.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,0,0,0.3)", marginBottom: 6 }}>PRODUCTS USED</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {(expanded ? post.products : post.products.slice(0, 3)).map((p, i) => (
                  <span key={i} style={{
                    fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 600,
                    background: `${GRAIN}, #F5F0F8`, backgroundSize: "200px 200px, auto",
                    border: "1px solid rgba(255,31,125,0.12)",
                    borderRadius: 6, padding: "3px 8px", color: "#555",
                  }}>✦ {p}</span>
                ))}
                {!expanded && post.products.length > 3 && (
                  <button onClick={() => setExpanded(true)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 10, color: PINK, fontWeight: 700 }}>
                    +{post.products.length - 3} more
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 13 }}>🌸</span>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: PINK }}>{post.saves_count}</p>
            </div>
            <button
              onClick={onSave}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: saved ? `${PINK}12` : "transparent",
                border: `1.5px solid ${saved ? PINK : "rgba(0,0,0,0.1)"}`,
                borderRadius: 99, padding: "5px 12px", cursor: "pointer",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill={saved ? PINK : "none"} stroke={saved ? PINK : "#aaa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: saved ? PINK : "#aaa" }}>{saved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mirror feature — the top-saved post shown "in" an oval vanity mirror,
// a structural centerpiece rather than a decorative overlay ──────────────────
function MirrorFeature({ post }: { post: VanityPost }) {
  const meta = CATEGORY_META[post.category as VanityCategory] ?? CATEGORY_META.skincare;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "22px 24px 6px" }}>
      <div style={{
        position: "relative", width: "100%", maxWidth: 280, aspectRatio: "1 / 1.08",
        borderRadius: "50%", overflow: "hidden",
        background: `linear-gradient(160deg, ${post.gradientA}22, ${post.gradientB}18)`,
        border: `6px solid white`,
        boxShadow: "0 10px 28px rgba(28,27,28,0.16), 0 0 0 1px rgba(255,31,125,0.12)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "0 30px", textAlign: "center",
      }}>
        {/* glass sheen */}
        <div style={{ position: "absolute", top: "6%", left: "12%", width: "30%", height: "55%", borderRadius: "50%", background: "rgba(255,255,255,0.35)", filter: "blur(6px)", pointerEvents: "none" }} />
        <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", color: PINK, marginBottom: 8 }}>✦ TODAY'S REFLECTION</span>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 19, color: "#1C1B1C", lineHeight: 1.25, marginBottom: 6 }}>{post.title}</p>
        {post.content && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.55)", lineHeight: 1.4 }}>{post.content.slice(0, 80)}{post.content.length > 80 ? "…" : ""}</p>
        )}
        <span style={{ marginTop: 8, fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: meta.color }}>{meta.label} · {post.author_name ?? "a member"}</span>
      </div>
      {/* mirror stand */}
      <div style={{ width: 3, height: 16, background: "rgba(0,0,0,0.12)" }} />
      <div style={{ width: 64, height: 3, borderRadius: 2, background: "rgba(0,0,0,0.12)" }} />
    </div>
  );
}

// ── Create sheet ──────────────────────────────────────────────────────────────

function CreateSheet({ onClose, onPosted }: { onClose: () => void; onPosted: () => void }) {
  const [category, setCategory] = useState<Exclude<VanityCategory, "all">>("skincare");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [productsInput, setProductsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!title.trim() || saving) return;
    setSaving(true);
    setError(null);
    const res = await createVanityPost({
      category,
      title: title.trim(),
      content: text.trim() || undefined,
      products: productsInput.split(",").map(s => s.trim()).filter(Boolean),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Couldn't post. Try again.");
      return;
    }
    onPosted();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: CREAM, borderRadius: "22px 22px 0 0", padding: "24px 20px 40px", boxShadow: "0 -12px 48px rgba(0,0,0,0.16)", maxHeight: "88dvh", overflowY: "auto" }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(0,0,0,0.12)", margin: "0 auto 18px" }} />
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 20, color: "#1C1B1C", marginBottom: 14 }}>Share to The Vanity</p>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 6, marginBottom: 14 }}>
          {(Object.entries(CATEGORY_META).filter(([k]) => k !== "all") as [Exclude<VanityCategory, "all">, { label: string; color: string }][]).map(([id, meta]) => (
            <button key={id} onClick={() => setCategory(id)} style={{
              flexShrink: 0, padding: "5px 12px", borderRadius: 99,
              background: category === id ? meta.color : "white",
              border: `1.5px solid ${category === id ? meta.color : "rgba(0,0,0,0.1)"}`,
              color: category === id ? "white" : "#888",
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}>{meta.label}</button>
          ))}
        </div>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title — e.g. My pre-wash routine for natural hair"
          style={{ width: "100%", boxSizing: "border-box", borderRadius: 12, border: "1.5px solid rgba(0,0,0,0.1)", padding: "10px 14px", fontFamily: "var(--font-jost)", fontSize: 14, color: "#1C1B1C", outline: "none", marginBottom: 10, background: "white" }}
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Share your routine, tip, or recommendation…"
          style={{
            width: "100%", minHeight: 100, borderRadius: 14, border: "1.5px solid rgba(255,31,125,0.15)",
            padding: "12px 14px", fontFamily: "var(--font-caveat)", fontSize: 16, color: "#1C1B1C",
            background: "white", outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 10,
          }}
        />
        <input
          value={productsInput}
          onChange={e => setProductsInput(e.target.value)}
          placeholder="Products used, comma-separated (optional)"
          style={{ width: "100%", boxSizing: "border-box", borderRadius: 12, border: "1.5px solid rgba(0,0,0,0.1)", padding: "10px 14px", fontFamily: "var(--font-jost)", fontSize: 13, color: "#1C1B1C", outline: "none", background: "white" }}
        />
        {error && <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#C0392B", marginTop: 10 }}>{error}</p>}
        <button
          onClick={() => void submit()}
          disabled={!title.trim() || saving}
          style={{ width: "100%", marginTop: 14, padding: "15px 0", borderRadius: 50, background: `linear-gradient(135deg, ${PINK}, ${ROSE})`, color: "white", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, letterSpacing: "0.06em", border: "none", cursor: !title.trim() || saving ? "default" : "pointer", opacity: !title.trim() || saving ? 0.6 : 1, boxShadow: `0 6px 20px ${PINK}44` }}
        >{saving ? "POSTING…" : "Post to The Vanity ✦"}</button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function VanityPage() {
  const [activeCategory, setActiveCategory] = useState<VanityCategory>("all");
  const [posts, setPosts] = useState<VanityPost[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);

  const loadPosts = useCallback(() => {
    getVanityPosts()
      .then(rows => setPosts(rows.map((r): VanityPost => ({ ...r, ...gradientForCategory(r.category) }))))
      .catch(() => setPosts([]));
  }, []);

  useEffect(() => {
    loadPosts();
    getMyVanitySaveIds().then(ids => setSavedIds(new Set(ids))).catch(() => {});
  }, [loadPosts]);

  const filtered = activeCategory === "all"
    ? posts
    : posts.filter(p => p.category === activeCategory);

  // The most-saved post gets the mirror — a real signal, not a fixed pick.
  const featured = posts.length > 0
    ? posts.reduce((best, p) => (p.saves_count > best.saves_count ? p : best), posts[0])
    : null;
  const feedPosts = activeCategory === "all" ? filtered.filter(p => p.id !== featured?.id) : filtered;

  const cats = Object.entries(CATEGORY_META) as [VanityCategory, { label: string; color: string }][];

  function toggleSave(id: string) {
    const wasSaved = savedIds.has(id);
    setSavedIds(prev => {
      const next = new Set(prev);
      wasSaved ? next.delete(id) : next.add(id);
      return next;
    });
    setPosts(prev => prev.map(p => p.id === id ? { ...p, saves_count: Math.max(0, p.saves_count + (wasSaved ? -1 : 1)) } : p));
    void (wasSaved ? unsaveVanityPost(id) : saveVanityPost(id));
  }

  return (
    <div style={{ background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 40%, #FFF5F0 100%)", minHeight: "100vh", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>

      {/* Header — same brand pink as every other room; the mirror + sparkle
          motif (not a new palette) is what makes this one read as Vanity. */}
      <div style={{
        padding: "56px 22px 30px",
        background: `linear-gradient(150deg, ${PINK} 0%, #FF5BAD 60%, ${ROSE} 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -10, right: 8 }}><MirrorMark size={110} opacity={0.16} /></div>
        <svg width="100%" height="60" style={{ position: "absolute", top: 30, left: 0, pointerEvents: "none" }}>
          <Sparkle x={40} y={20} size={12} opacity={0.5} />
          <Sparkle x={220} y={45} size={8} opacity={0.35} />
          <Sparkle x={150} y={8} size={9} opacity={0.4} />
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Link href="/member/avenue" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
        </div>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(32px, 11vw, 44px)", color: "white", lineHeight: 1, marginBottom: 6 }}>The Vanity.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.65)" }}>Beauty. Glow. You.</p>
      </div>

      {/* The mirror — a real structural centerpiece, only on the unfiltered view */}
      {activeCategory === "all" && featured && <MirrorFeature post={featured} />}

      {/* Category filter */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(250,246,242,0.96)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,31,125,0.08)" }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 8, padding: "10px 18px" }}>
          {cats.map(([id, meta]) => (
            <button key={id} onClick={() => setActiveCategory(id)} style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 99,
              background: activeCategory === id ? meta.color : "white",
              border: `1.5px solid ${activeCategory === id ? meta.color : "rgba(0,0,0,0.08)"}`,
              color: activeCategory === id ? "white" : "#888",
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700,
              cursor: "pointer", transition: "all 0.15s",
            }}>{meta.label}</button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div style={{ padding: "18px 18px 0", display: "flex", flexDirection: "column", gap: 16 }}>
        {feedPosts.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(0,0,0,0.4)", fontFamily: "var(--font-caveat)", fontSize: 18, marginTop: 48 }}>
            Nothing published yet
          </p>
        )}
        {feedPosts.map(post => (
          <VanityCard
            key={post.id} post={post}
            saved={savedIds.has(post.id)}
            onSave={() => toggleSave(post.id)}
          />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowCreate(true)}
        style={{
          position: "fixed", bottom: 90, right: 20, width: 56, height: 56,
          borderRadius: "50%", background: `linear-gradient(135deg, ${PINK}, ${ROSE})`,
          border: "none", cursor: "pointer", zIndex: 40,
          boxShadow: `0 8px 24px ${PINK}50, inset 0 1px 0 rgba(255,255,255,0.2)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, color: "white", fontWeight: 300,
        }}
      >+</button>

      {showCreate && (
        <CreateSheet
          onClose={() => setShowCreate(false)}
          onPosted={() => { setShowCreate(false); loadPosts(); }}
        />
      )}
    </div>
  );
}
