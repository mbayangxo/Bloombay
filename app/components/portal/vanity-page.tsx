"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const ROSE  = "#E8007A";
const CREAM = "#FAF6F2";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

type VanityCategory = "all" | "skincare" | "makeup" | "haircare" | "fragrance" | "nails";
type SavedSet = Set<string>;

const CATEGORY_META: Record<VanityCategory, { label: string; color: string }> = {
  all:       { label: "All",       color: "#1C1B1C" },
  skincare:  { label: "Skincare",  color: "#A0522D" },
  makeup:    { label: "Makeup",    color: PINK },
  haircare:  { label: "Hair",      color: "#6A1B9A" },
  fragrance: { label: "Fragrance", color: "#C2185B" },
  nails:     { label: "Nails",     color: ROSE },
};

interface VanityPost {
  id: string;
  author_name: string;
  author_initial: string;
  author_color: string;
  category: VanityCategory;
  title: string;
  text: string;
  products: string[];
  saves: number;
  gradientA: string;
  gradientB: string;
  timeAgo: string;
}

const MOCK_POSTS: VanityPost[] = [
  {
    id: "1", author_name: "Sofia W.", author_initial: "S", author_color: "#FF69B4",
    category: "skincare", title: "The holy grail routine for melanin skin",
    text: "3 years of testing to find this routine. My skin has never looked better. The key is layering correctly.",
    products: ["Klairs Supple Prep Toner", "Ordinary Niacinamide 10%", "Fenty Skin Hydra Vizor SPF30", "Paula's Choice BHA"],
    saves: 312, gradientA: "#F9D423", gradientB: "#F83600", timeAgo: "2h ago",
  },
  {
    id: "2", author_name: "Zara F.", author_initial: "Z", author_color: PINK,
    category: "makeup", title: "The 'no-makeup' makeup look breakdown",
    text: "I get asked about this every single time I do it. Literally takes 8 minutes.",
    products: ["Charlotte Tilbury Flawless Filter", "Rare Beauty blush", "Jones Road Miracle Balm", "Benefit Brow Pencil"],
    saves: 247, gradientA: "#FFB3D9", gradientB: PINK, timeAgo: "5h ago",
  },
  {
    id: "3", author_name: "Nia B.", author_initial: "N", author_color: "#C084FC",
    category: "haircare", title: "How I grew 4 inches in 6 months (4C hair)",
    text: "I genuinely thought length retention wasn't for me. Then I changed my whole approach.",
    products: ["Mielle Rosemary Oil", "Shea Moisture Curl Cream", "Satya hemp milk", "Rice water rinse (DIY)"],
    saves: 489, gradientA: "#A18CD1", gradientB: "#FBC2EB", timeAgo: "1d ago",
  },
  {
    id: "4", author_name: "Amara T.", author_initial: "A", author_color: "#E8A050",
    category: "fragrance", title: "My entire signature scent collection",
    text: "I rotate 5 perfumes by mood + season. People always ask what I'm wearing. Here's the breakdown.",
    products: ["Maison Margiela Replica - Flower Market", "Carolina Herrera Good Girl", "Sol de Janeiro 62", "Kayali Vanilla 28", "D&G Light Blue"],
    saves: 178, gradientA: "#F7971E", gradientB: "#FFD200", timeAgo: "2d ago",
  },
  {
    id: "5", author_name: "Kezia M.", author_initial: "K", author_color: "#FF5BAD",
    category: "nails", title: "Press-ons that actually last 3 weeks",
    text: "I've been doing my own nails at home for 2 years and I finally cracked the code.",
    products: ["imPRESS Pro nails", "Nailboo powder (for prep)", "Bondaid dehydrator", "KDS UV/LED gel top coat"],
    saves: 134, gradientA: "#FF9A9E", gradientB: "#FAD0C4", timeAgo: "3d ago",
  },
  {
    id: "6", author_name: "Temi A.", author_initial: "T", author_color: "#83C5A0",
    category: "skincare", title: "Slugging changed my life — here's how to do it right",
    text: "The Korean skincare hack that gives you glass skin overnight. Yes it works. No it won't cause breakouts if you do it correctly.",
    products: ["La Roche-Posay Cicaplast Baume B5", "Vaseline (unscented)", "Drunk Elephant Protini moisturiser"],
    saves: 201, gradientA: "#84FAB0", gradientB: "#8FD3F4", timeAgo: "4d ago",
  },
];

// ── Post card ─────────────────────────────────────────────────────────────────

function VanityCard({ post, saved, onSave }: { post: VanityPost; saved: boolean; onSave: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[post.category];

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
                background: `linear-gradient(135deg, ${post.author_color}, ${post.author_color}AA)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: "white",
              }}>{post.author_initial}</div>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "#1C1B1C" }}>{post.author_name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#bbb" }}>{post.timeAgo}</p>
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
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.58)", lineHeight: 1.55, marginBottom: 12 }}>{post.text}</p>

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
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: PINK }}>{post.saves}</p>
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

// ── Main page ─────────────────────────────────────────────────────────────────

export function VanityPage() {
  const [activeCategory, setActiveCategory] = useState<VanityCategory>("all");
  const [saved, setSaved] = useState<SavedSet>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [newText, setNewText] = useState("");
  const [newCategory, setNewCategory] = useState<VanityCategory>("skincare");

  const filtered = activeCategory === "all"
    ? MOCK_POSTS
    : MOCK_POSTS.filter(p => p.category === activeCategory);

  const cats = Object.entries(CATEGORY_META) as [VanityCategory, { label: string; color: string }][];

  return (
    <div style={{ background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 40%, #FFF5F0 100%)", minHeight: "100vh", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>

      {/* Header */}
      <div style={{
        padding: "56px 22px 24px",
        background: `linear-gradient(150deg, ${PINK} 0%, #FF5BAD 60%, ${ROSE} 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.08), transparent)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Link href="/member/avenue" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.15)", borderRadius: 99, padding: "4px 12px", border: "1px solid rgba(255,255,255,0.2)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.2em" }}>76 MEMBERS ONLINE</p>
          </div>
        </div>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 44, color: "white", lineHeight: 1, marginBottom: 6 }}>The Vanity.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.65)" }}>Beauty. Glow. You.</p>
      </div>

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
        {filtered.map(post => (
          <VanityCard
            key={post.id} post={post}
            saved={saved.has(post.id)}
            onSave={() => setSaved(prev => { const s = new Set(prev); s.has(post.id) ? s.delete(post.id) : s.add(post.id); return s; })}
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

      {/* Create sheet */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "flex-end" }} onClick={() => setShowCreate(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: CREAM, borderRadius: "22px 22px 0 0", padding: "24px 20px 40px", boxShadow: "0 -12px 48px rgba(0,0,0,0.16)" }}>
            <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(0,0,0,0.12)", margin: "0 auto 18px" }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 20, color: "#1C1B1C", marginBottom: 14 }}>Share to The Vanity</p>
            <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 6, marginBottom: 14 }}>
              {(Object.entries(CATEGORY_META).filter(([k]) => k !== "all") as [VanityCategory, { label: string; color: string }][]).map(([id, meta]) => (
                <button key={id} onClick={() => setNewCategory(id)} style={{
                  flexShrink: 0, padding: "5px 12px", borderRadius: 99,
                  background: newCategory === id ? meta.color : "white",
                  border: `1.5px solid ${newCategory === id ? meta.color : "rgba(0,0,0,0.1)"}`,
                  color: newCategory === id ? "white" : "#888",
                  fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer",
                }}>{meta.label}</button>
              ))}
            </div>
            <textarea
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder="Share your routine, tip, or recommendation…"
              style={{
                width: "100%", minHeight: 100, borderRadius: 14, border: "1.5px solid rgba(255,31,125,0.15)",
                padding: "12px 14px", fontFamily: "var(--font-caveat)", fontSize: 16, color: "#1C1B1C",
                background: "white", outline: "none", resize: "none", boxSizing: "border-box",
              }}
            />
            <button
              onClick={() => { setShowCreate(false); setNewText(""); }}
              style={{ width: "100%", marginTop: 12, padding: "15px 0", borderRadius: 50, background: `linear-gradient(135deg, ${PINK}, ${ROSE})`, color: "white", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, letterSpacing: "0.06em", border: "none", cursor: "pointer", boxShadow: `0 6px 20px ${PINK}44` }}
            >Post to The Vanity ✦</button>
          </div>
        </div>
      )}
    </div>
  );
}
