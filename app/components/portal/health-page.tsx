"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getWellnessPosts,
  getMyWellnessSaveIds,
  createWellnessPost,
  saveWellnessPost,
  unsaveWellnessPost,
  type WellnessPost,
} from "@/lib/actions/wellness";

const PINK  = "#FF1F7D";
const CREAM = "#F6F1EB";
const DARK  = "#1C1B1C";
const SAGE  = "#4A7C59";

const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

type Category = "all" | "juice" | "smoothie" | "meal" | "tip" | "skincare";

const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string }> = {
  all:      { label: "All",      emoji: "✦",  color: DARK },
  juice:    { label: "Juice",    emoji: "🥤",  color: "#2E7D32" },
  smoothie: { label: "Smoothie", emoji: "💚",  color: "#388E3C" },
  meal:     { label: "Meals",    emoji: "🥗",  color: "#5D4037" },
  tip:      { label: "Tips",     emoji: "✦",   color: PINK },
  skincare: { label: "Skincare", emoji: "🌿",  color: "#6A1B9A" },
};

// ── Post shape ──────────────────────────────────────────────────────────────────
type PostGradient = { gradientA: string; gradientB: string };
type MockPost = WellnessPost & PostGradient;

const CATEGORY_GRADIENTS: Record<Category, PostGradient> = {
  all:      { gradientA: "#A8E063", gradientB: "#56AB2F" },
  juice:    { gradientA: "#A8E063", gradientB: "#56AB2F" },
  smoothie: { gradientA: "#8FD3A0", gradientB: "#3D9970" },
  meal:     { gradientA: "#D7A86E", gradientB: "#8D5B3F" },
  tip:      { gradientA: "#FF9BC0", gradientB: "#FF1F7D" },
  skincare: { gradientA: "#C99BE0", gradientB: "#7B3F9E" },
};

function gradientForCategory(category: string): PostGradient {
  return CATEGORY_GRADIENTS[category as Category] ?? CATEGORY_GRADIENTS.tip;
}

// ── PostCard ────────────────────────────────────────────────────────────────────
function PostCard({ post, saved, onToggleSave }: { post: MockPost; saved: boolean; onToggleSave: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[post.category as Category] ?? CATEGORY_META.tip;

  const initials = post.author_name
    ? post.author_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      boxShadow: "0 2px 16px rgba(28,27,28,0.07)",
      overflow: "hidden",
    }}>
      {/* Color bar top */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${post.gradientA}, ${post.gradientB})` }} />

      <div style={{ padding: "16px 16px 0" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              background: `linear-gradient(135deg, ${post.gradientA}, ${post.gradientB})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "#fff" }}>{initials}</span>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: DARK, lineHeight: 1.1 }}>{post.author_name}</p>
              <span style={{
                fontSize: 9, fontFamily: "var(--font-jost)", fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase" as const,
                color: meta.color, background: `${meta.color}14`,
                borderRadius: 20, padding: "2px 7px",
              }}>
                {meta.emoji} {meta.label}
              </span>
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={onToggleSave}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? PINK : "none"} stroke={PINK} strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>

        {/* Title + description */}
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 17, fontWeight: 700, color: DARK, lineHeight: 1.2, marginBottom: 6 }}>
          {post.title}
        </p>
        {post.content && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(28,27,28,0.65)", lineHeight: 1.5, marginBottom: 12 }}>
            {post.content}
          </p>
        )}

        {/* Saves count */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={PINK} stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: PINK }}>{post.saves_count.toLocaleString()} saves</span>
        </div>

        {/* Expand toggle */}
        {(post.ingredients.length > 0 || post.steps.length > 0) && (
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 0",
              borderTop: "1px solid rgba(28,27,28,0.07)",
              marginBottom: expanded ? 0 : 16,
            }}
          >
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: DARK, letterSpacing: "0.04em" }}>
              {expanded ? "HIDE RECIPE" : "SEE RECIPE →"}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2.5" strokeLinecap="round"
              style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        )}
      </div>

      {/* Expanded recipe */}
      {expanded && (
        <div style={{ padding: "0 16px 20px" }}>
          {post.ingredients.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", color: "rgba(28,27,28,0.4)", textTransform: "uppercase" as const, marginBottom: 8 }}>
                INGREDIENTS
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {post.ingredients.map((ing, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: SAGE, flexShrink: 0, marginTop: 6 }} />
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: DARK, lineHeight: 1.4 }}>{ing}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {post.steps.length > 0 && (
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", color: "rgba(28,27,28,0.4)", textTransform: "uppercase" as const, marginBottom: 8 }}>
                {post.category === "tip" ? "THE RITUAL" : post.category === "skincare" ? "METHOD" : "STEPS"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {post.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                      background: `linear-gradient(135deg, ${post.gradientA}, ${post.gradientB})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, color: "#fff" }}>{i + 1}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: DARK, lineHeight: 1.5, flex: 1 }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── CreateSheet ─────────────────────────────────────────────────────────────────
function CreateSheet({ onClose, onPosted }: { onClose: () => void; onPosted: () => void }) {
  const [category, setCategory] = useState<Category>("juice");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!title.trim() || saving) return;
    setSaving(true);
    setError(null);
    const res = await createWellnessPost({
      category,
      title: title.trim(),
      content: content.trim() || undefined,
      ingredients: ingredients.split("\n").map(s => s.trim()).filter(Boolean),
      steps: steps.split("\n").map(s => s.trim()).filter(Boolean),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Couldn't post. Try again.");
      return;
    }
    onPosted();
  }

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
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(28,27,28,0.18)" }} />
        </div>

        <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, fontWeight: 700, color: DARK, margin: "8px 0 4px" }}>
          Share a recipe
        </h2>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(28,27,28,0.5)", margin: "0 0 20px" }}>
          It goes straight to the Girl Fit — and to saved apartments ✦
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
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Anti-Inflammatory Glow Juice" style={{ ...inputStyle, marginBottom: 16 }} />

        {/* Description */}
        <label style={labelStyle}>A little context (optional)</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={2} placeholder="Why you love this, when you make it…"
          style={{ ...inputStyle, marginBottom: 16, resize: "none", fontFamily: "var(--font-caveat)", fontSize: 16 }} />

        {/* Ingredients */}
        <label style={labelStyle}>Ingredients (one per line)</label>
        <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} rows={4}
          placeholder={"2 carrots\n1 inch ginger\n1 lemon"}
          style={{ ...inputStyle, marginBottom: 16, resize: "none" }} />

        {/* Steps */}
        <label style={labelStyle}>Steps (one per line)</label>
        <textarea value={steps} onChange={e => setSteps(e.target.value)} rows={4}
          placeholder={"Wash and chop all produce\nFeed through juicer\nDrink immediately"}
          style={{ ...inputStyle, marginBottom: 24, resize: "none" }} />

        {error && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#C0392B", marginBottom: 12 }}>{error}</p>
        )}

        <button
          disabled={!title.trim() || saving}
          style={{
            width: "100%", background: PINK, color: "#fff", border: "none",
            borderRadius: 14, padding: "14px 0", fontSize: 14,
            fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.05em",
            cursor: !title.trim() || saving ? "default" : "pointer",
            opacity: !title.trim() || saving ? 0.6 : 1,
          }}
          onClick={submit}
        >
          {saving ? "POSTING…" : "Post to Girl Fit →"}
        </button>
      </div>
    </>
  );
}

// ── HealthPage ──────────────────────────────────────────────────────────────────
export function HealthPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [posts, setPosts] = useState<MockPost[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);

  const loadPosts = useCallback(() => {
    getWellnessPosts()
      .then(rows => setPosts(rows.map((r): MockPost => ({ ...r, ...gradientForCategory(r.category) }))))
      .catch(() => setPosts([]));
  }, []);

  useEffect(() => {
    loadPosts();
    getMyWellnessSaveIds().then(ids => setSavedIds(new Set(ids))).catch(() => {});
  }, [loadPosts]);

  const filtered = activeCategory === "all"
    ? posts
    : posts.filter(p => p.category === activeCategory);

  function toggleSave(id: string) {
    const wasSaved = savedIds.has(id);
    setSavedIds(prev => {
      const next = new Set(prev);
      wasSaved ? next.delete(id) : next.add(id);
      return next;
    });
    void (wasSaved ? unsaveWellnessPost(id) : saveWellnessPost(id));
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
                fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.1, color: DARK,
              }}>The Girl Fit</h1>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, margin: 0, color: "rgba(28,27,28,0.5)", lineHeight: 1.2 }}>
                recipes, rituals & real wellness ✦
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              background: SAGE, color: "#fff", border: "none",
              borderRadius: 20, padding: "8px 16px", fontSize: 12,
              fontFamily: "var(--font-jost)", fontWeight: 700,
              letterSpacing: "0.04em", cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            Share →
          </button>
        </div>
      </header>

      {/* Saved banner — if any saves */}
      {savedIds.size > 0 && (
        <div style={{
          background: `${SAGE}14`, borderBottom: `1px solid ${SAGE}33`,
          padding: "10px 18px", display: "flex", alignItems: "center", gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={SAGE} stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: SAGE, margin: 0 }}>
            {savedIds.size} recipe{savedIds.size !== 1 ? "s" : ""} saved to your apartment ♡
          </p>
        </div>
      )}

      {/* Category chips */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "14px 18px", scrollbarWidth: "none" }}>
        {(Object.keys(CATEGORY_META) as Category[]).map(c => {
          const m = CATEGORY_META[c];
          const active = activeCategory === c;
          return (
            <button key={c} onClick={() => setActiveCategory(c)}
              style={{
                flexShrink: 0, padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                border: active ? `1.5px solid ${SAGE}` : "1.5px solid rgba(28,27,28,0.15)",
                background: active ? SAGE : "transparent",
                color: active ? "#fff" : DARK,
                fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600,
                letterSpacing: "0.03em", transition: "all 0.15s",
              }}>
              {m.emoji} {m.label}
            </button>
          );
        })}
      </div>

      {/* Posts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "0 18px 100px" }}>
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(28,27,28,0.4)", fontFamily: "var(--font-caveat)", fontSize: 18, marginTop: 48 }}>
            Nothing published yet
          </p>
        )}
        {filtered.map(post => (
          <PostCard
            key={post.id}
            post={post}
            saved={savedIds.has(post.id)}
            onToggleSave={() => toggleSave(post.id)}
          />
        ))}
      </div>

      {showCreate && (
        <CreateSheet
          onClose={() => setShowCreate(false)}
          onPosted={() => { setShowCreate(false); loadPosts(); }}
        />
      )}
    </div>
  );
}
