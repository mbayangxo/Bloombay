"use client";

import { useState } from "react";
import Link from "next/link";
import type { WellnessPost } from "@/lib/actions/wellness";

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

// ── Mock posts ──────────────────────────────────────────────────────────────────
type MockPost = WellnessPost & { gradientA: string; gradientB: string };

const MOCK_POSTS: MockPost[] = [
  {
    id: "1", author_id: "u1", author_name: "Zara F.", author_avatar: null,
    category: "juice", title: "Anti-Inflammatory Glow Juice",
    content: "This one changed my skin in 2 weeks. Drink it in the morning on an empty stomach.",
    ingredients: ["2 carrots", "1 inch ginger", "1 lemon", "1 apple", "handful turmeric root", "pinch black pepper"],
    steps: ["Wash and chop all produce", "Feed through juicer in order", "Stir and add black pepper to activate turmeric", "Drink immediately or store up to 24h"],
    image_url: null, saves_count: 312, created_at: "2026-06-10T08:00:00Z",
    gradientA: "#A8E063", gradientB: "#56AB2F",
  },
  {
    id: "2", author_id: "u2", author_name: "Amara T.", author_avatar: null,
    category: "smoothie", title: "Hormone Balance Smoothie",
    content: "Maca + ashwagandha are doing the most right now. Creamy, earthy, actually delicious.",
    ingredients: ["1 frozen banana", "1 tbsp maca powder", "1 tsp ashwagandha", "1 cup oat milk", "1 tbsp almond butter", "pinch cinnamon", "1 date (pitted)"],
    steps: ["Add all ingredients to blender", "Blend on high 45 seconds", "Taste and adjust sweetness with date", "Serve cold"],
    image_url: null, saves_count: 247, created_at: "2026-06-09T14:00:00Z",
    gradientA: "#D4A574", gradientB: "#C68642",
  },
  {
    id: "3", author_id: "u3", author_name: "Kezia M.", author_avatar: null,
    category: "tip", title: "The 5-minute morning ritual that actually works",
    content: "I've done this every morning for 6 months. No skipping, no excuses.",
    ingredients: [],
    steps: ["Warm lemon water before anything else", "10 deep breaths at the window", "Write 3 things you're grateful for", "No phone for the first 20 minutes", "Move your body even for 5 minutes"],
    image_url: null, saves_count: 489, created_at: "2026-06-08T07:00:00Z",
    gradientA: "#FFB3D9", gradientB: "#FF1F7D",
  },
  {
    id: "4", author_id: "u4", author_name: "Nia B.", author_avatar: null,
    category: "skincare", title: "DIY Honey Turmeric Mask",
    content: "For melanin skin. Brightens without bleaching. Do this 2x a week.",
    ingredients: ["1 tbsp raw honey", "½ tsp turmeric", "1 tsp plain yogurt", "3 drops rosehip oil"],
    steps: ["Mix all ingredients in a small bowl", "Apply to clean dry face", "Leave 15-20 minutes", "Rinse with warm water, pat dry", "Follow with moisturiser"],
    image_url: null, saves_count: 178, created_at: "2026-06-07T11:00:00Z",
    gradientA: "#F9D423", gradientB: "#F83600",
  },
  {
    id: "5", author_id: "u5", author_name: "Lena P.", author_avatar: null,
    category: "meal", title: "High-Protein Jollof Bowls",
    content: "Meal-prepped this for the whole week. Filling, tasty, and 35g protein per bowl.",
    ingredients: ["1 cup brown rice", "200g chicken thighs", "2 plum tomatoes", "1 red bell pepper", "1 onion", "scotch bonnet (half)", "chicken stock cube", "smoked paprika", "thyme", "black beans"],
    steps: ["Blend tomatoes, pepper, scotch bonnet and set aside", "Brown chicken in oil, set aside", "Fry onion until golden, add blended mix", "Cook down 15 min, add stock cube and spices", "Add rice and chicken, cook until tender", "Top with black beans and fresh coriander"],
    image_url: null, saves_count: 203, created_at: "2026-06-06T12:00:00Z",
    gradientA: "#F7971E", gradientB: "#FFD200",
  },
  {
    id: "6", author_id: "u1", author_name: "Zara F.", author_avatar: null,
    category: "juice", title: "Deep Sleep Nighttime Tonic",
    content: "Tart cherry + magnesium glycinate changed my sleep. This is the gentler food version.",
    ingredients: ["100ml tart cherry juice", "200ml warm chamomile tea", "1 tsp honey", "pinch nutmeg", "pinch cinnamon"],
    steps: ["Brew chamomile, let cool slightly", "Stir in cherry juice and honey", "Add spices", "Drink 30-45 min before bed"],
    image_url: null, saves_count: 134, created_at: "2026-06-05T20:00:00Z",
    gradientA: "#6B2FA0", gradientB: "#9B59B6",
  },
];

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
function CreateSheet({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<Category>("juice");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");

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
          It goes straight to the Health Bar — and to saved apartments ✦
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

        <button
          style={{
            width: "100%", background: PINK, color: "#fff", border: "none",
            borderRadius: 14, padding: "14px 0", fontSize: 14,
            fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer",
          }}
          onClick={onClose}
        >
          Post to Health Bar →
        </button>
      </div>
    </>
  );
}

// ── HealthPage ──────────────────────────────────────────────────────────────────
export function HealthPage() {
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
                fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.1, color: DARK,
              }}>The Health Bar</h1>
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
            Nothing here yet. Be first ✦
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

      {showCreate && <CreateSheet onClose={() => setShowCreate(false)} />}
    </div>
  );
}
