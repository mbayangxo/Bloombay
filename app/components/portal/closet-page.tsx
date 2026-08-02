"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FashionPostSheet } from "@/app/components/portal/fashion-post-sheet";

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

type ClosetPost = {
  id: string;
  author_id: string;
  category: string;
  title: string | null;
  caption: string | null;
  photo_urls: string[];
  blooms: number;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
};

// ── Post tile (masonry-style photo card) ─────────────────────────────────────
function ClosetTile({ post }: { post: ClosetPost }) {
  const meta = CATEGORY_META[post.category as Category] ?? CATEGORY_META.fits;
  const authorName = post.profiles?.display_name ?? "A member";
  const cover = post.photo_urls[0];

  return (
    <div style={{
      borderRadius: 16, overflow: "hidden", background: "white",
      boxShadow: "0 3px 16px rgba(28,27,28,0.08)", breakInside: "avoid", marginBottom: 12,
    }}>
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" style={{ width: "100%", display: "block" }} />
      ) : (
        <div style={{ width: "100%", aspectRatio: "3/4", background: `${meta.color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 28 }}>{meta.emoji}</span>
        </div>
      )}
      <div style={{ padding: "10px 12px 12px" }}>
        <span style={{
          fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800,
          letterSpacing: "0.14em", color: meta.color, background: `${meta.color}14`,
          borderRadius: 20, padding: "2px 7px", display: "inline-block", marginBottom: 6,
        }}>{meta.emoji} {meta.label.toUpperCase()}</span>
        {post.title && (
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 13, color: DARK, lineHeight: 1.25, marginBottom: 4 }}>{post.title}</p>
        )}
        {post.caption && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(28,27,28,0.6)", lineHeight: 1.4, marginBottom: 6 }}>{post.caption}</p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(28,27,28,0.4)" }}>{authorName}</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: PINK, fontWeight: 700 }}>🌸 {post.blooms}</span>
        </div>
      </div>
    </div>
  );
}

// ── Featured look — magazine-style lead feature, not just another tile ───────
function FeaturedLook({ post }: { post: ClosetPost }) {
  const meta = CATEGORY_META[post.category as Category] ?? CATEGORY_META.fits;
  const authorName = post.profiles?.display_name ?? "A member";
  const cover = post.photo_urls[0];

  return (
    <div style={{ margin: "6px 18px 20px", borderRadius: 22, overflow: "hidden", position: "relative", boxShadow: "0 10px 30px rgba(28,27,28,0.16)" }}>
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
      ) : (
        <div style={{ width: "100%", aspectRatio: "4/5", background: `linear-gradient(160deg, ${PINK}22, #E8007A33)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 48 }}>👗</span>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 45%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: 14, left: 14, background: PINK, borderRadius: 20, padding: "4px 11px" }}>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", color: "white" }}>✦ LOOK OF THE WEEK</span>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px 18px" }}>
        {post.title && (
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: "white", lineHeight: 1.1, marginBottom: 6, textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>{post.title}</p>
        )}
        {post.caption && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.4, marginBottom: 8 }}>{post.caption}</p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{meta.emoji} {authorName}</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "white", fontWeight: 700 }}>🌸 {post.blooms}</span>
        </div>
      </div>
    </div>
  );
}

// ── ClosetPage ───────────────────────────────────────────────────────────────────
export function ClosetPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [posts, setPosts] = useState<ClosetPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadPosts = useCallback((cat: Category) => {
    setLoading(true);
    const qs = new URLSearchParams({ context: "avenue" });
    if (cat !== "all") qs.set("category", cat);
    fetch(`/api/avenue/post?${qs.toString()}`)
      .then(r => r.json())
      .then(d => setPosts(d.posts ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadPosts(activeCategory); }, [activeCategory, loadPosts]);

  // Lead with whichever photo post has the most blooms — a real "look of
  // the week," not a fixed/fake pick — and show the rest in the grid.
  const withPhotos = posts.filter(p => p.photo_urls.length > 0);
  const featured = withPhotos.length > 0
    ? withPhotos.reduce((best, p) => (p.blooms > best.blooms ? p : best), withPhotos[0])
    : null;
  const rest = posts.filter(p => p.id !== featured?.id);

  return (
    <div style={{
      minHeight: "100dvh",
      background: CREAM,
      backgroundImage: PAPER_TEX,
      paddingBottom: 120,
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

      {/* Feed — a featured lookbook lead, then a photo-forward style-board grid */}
      {loading ? (
        <p style={{ textAlign: "center", color: "rgba(28,27,28,0.4)", fontFamily: "var(--font-caveat)", fontSize: 18, marginTop: 48 }}>
          Loading…
        </p>
      ) : posts.length === 0 ? (
        <div style={{
          margin: "12px 18px 0", borderRadius: 20, border: "1.5px dashed rgba(255,31,125,0.25)",
          padding: "40px 24px", textAlign: "center",
        }}>
          <p style={{ fontSize: 30, marginBottom: 8 }}>👗</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 6 }}>
            Nothing shared yet
          </p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(28,27,28,0.5)" }}>
            Post a fit, ask for advice, or drop some inspo — be the first ✦
          </p>
        </div>
      ) : (
        <>
          {featured && <FeaturedLook post={featured} />}
          <div style={{ padding: "0 18px" }}>
            <div style={{ columnCount: 2, columnGap: 12 }}>
              {rest.map(post => <ClosetTile key={post.id} post={post} />)}
            </div>
          </div>
        </>
      )}

      {/* The Hanger — sell & swap banner */}
      <div style={{ padding: "16px 18px 0" }}>
        <Link href="/member/hanger" style={{ textDecoration: "none", display: "block" }}>
          <div style={{
            background: "linear-gradient(135deg, #1C1B1C 0%, #2E0A1C 100%)",
            borderRadius: 20,
            padding: "20px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: `0 6px 24px rgba(255,31,125,0.18)`,
            border: "1px solid rgba(255,31,125,0.12)",
          }}>
            {/* Hanger icon — Silhouette Rule: hook = petal arc */}
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: `${PINK}18`,
              border: `1.5px solid ${PINK}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M13 5 C13 5 15.5 3 16 5 C16.5 7 14 8 14 8" stroke={PINK} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                <path d="M14 8 L20 15 C22 17 21 20 19 20 L7 20 C5 20 4 17 6 15 Z" stroke={PINK} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill={`${PINK}18`}/>
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 3 }}>THE HANGER</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 16, color: "rgba(255,238,220,0.92)", lineHeight: 1.2, margin: 0 }}>Sell & swap with the girls.</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>List pieces. Buy from members. Ship it out.</p>
            </div>

            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </Link>
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

      {showCreate && (
        <FashionPostSheet
          context="avenue"
          category={activeCategory === "all" ? "fits" : activeCategory}
          onClose={() => setShowCreate(false)}
          onPosted={() => { setShowCreate(false); loadPosts(activeCategory); }}
        />
      )}
    </div>
  );
}
