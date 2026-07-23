"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PINK   = "#FF1F7D";
const DARK   = "#1C1B1C";
const CREAM  = "#FAF6F0";
const REEL   = "#E8B84B";
const GRAIN  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

type FilmCategory = "all" | "drama" | "romance" | "thriller" | "horror" | "indie" | "documentary";

const CAT_META: Record<FilmCategory, { label: string; color: string }> = {
  all:          { label: "All",          color: DARK },
  drama:        { label: "Drama",        color: "#1565C0" },
  romance:      { label: "Romance",      color: PINK },
  thriller:     { label: "Thriller",     color: "#4A148C" },
  horror:       { label: "Horror",       color: "#B71C1C" },
  indie:        { label: "Indie",        color: "#2E7D32" },
  documentary:  { label: "Doc",          color: "#E65100" },
};

interface FilmPost {
  id: string;
  author_name: string;
  author_initial: string;
  author_color: string;
  category: FilmCategory;
  title: string;
  year: number;
  text: string;
  rating: number;
  blooms: number;
  poster_a: string;
  poster_b: string;
  timeAgo: string;
  platform?: string;
  badge?: string;
}

// ── DB row shape from avenue_content ─────────────────────────────────────────
interface ScreeningRow {
  id: string;
  title: string;
  body: string | null;
  badge: string | null;
  week_of: string;
  rank_order: number;
  like_count: number;
  save_count: number;
  meta: {
    where_to_watch?: string;
    genre?: string;
    runtime?: string;
    director?: string;
    year?: number;
    author_name?: string;
    author_initial?: string;
    author_color?: string;
    poster_a?: string;
    poster_b?: string;
    rating?: number;
  };
}

// Map a genre string to a FilmCategory key
function genreToCategory(genre?: string): FilmCategory {
  if (!genre) return "indie";
  const g = genre.toLowerCase();
  if (g.includes("drama"))     return "drama";
  if (g.includes("romance"))   return "romance";
  if (g.includes("thriller"))  return "thriller";
  if (g.includes("horror") || g.includes("surreal")) return "horror";
  if (g.includes("doc"))       return "documentary";
  return "indie";
}

function rowToFilmPost(row: ScreeningRow): FilmPost {
  const meta = row.meta ?? {};
  return {
    id:            row.id,
    author_name:   meta.author_name   ?? "Screening Room",
    author_initial: meta.author_initial ?? "S",
    author_color:  meta.author_color  ?? REEL,
    category:      genreToCategory(meta.genre),
    title:         row.title,
    year:          meta.year          ?? 2024,
    text:          row.body           ?? "",
    rating:        meta.rating        ?? 5,
    blooms:        row.like_count     ?? 0,
    poster_a:      meta.poster_a      ?? "#4A148C",
    poster_b:      meta.poster_b      ?? "#1A1A1A",
    timeAgo:       "This week",
    platform:      meta.where_to_watch,
    badge:         row.badge          ?? undefined,
  };
}

// ── Film card ─────────────────────────────────────────────────────────────────

function FilmCard({ post }: { post: FilmPost }) {
  const meta = CAT_META[post.category];
  return (
    <div style={{
      background: DARK,
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.15)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Film strip header */}
      <div style={{
        height: 130,
        background: `linear-gradient(135deg, ${post.poster_a} 0%, ${post.poster_b} 100%)`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
      }}>
        {/* Film sprocket holes top */}
        <div style={{ position: "absolute", top: 6, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 8px" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ width: 10, height: 7, background: "rgba(0,0,0,0.4)", borderRadius: 2 }} />
          ))}
        </div>
        {/* Film sprocket holes bottom */}
        <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 8px" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ width: 10, height: 7, background: "rgba(0,0,0,0.4)", borderRadius: 2 }} />
          ))}
        </div>
        {/* Grain */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, backgroundSize: "200px 200px", opacity: 0.6 }} />
        {/* Badge */}
        {post.badge && (
          <div style={{ position: "absolute", top: 20, right: 10, background: REEL, borderRadius: 99, padding: "2px 8px", zIndex: 2 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: DARK, letterSpacing: "0.15em" }}>{post.badge}</p>
          </div>
        )}
        {/* Title overlay */}
        <div style={{ position: "relative", zIndex: 1, padding: "0 14px 14px", width: "100%" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 18, color: "white", lineHeight: 1.1, textShadow: "0 2px 8px rgba(0,0,0,0.5)", marginBottom: 2 }}>{post.title}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.1em" }}>{post.year}{post.platform ? ` · ${post.platform}` : ""}</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.15em", color: meta.color, background: `${meta.color}18`, borderRadius: 99, padding: "2px 7px", display: "inline-block" }}>{meta.label.toUpperCase()}</span>
          <div style={{ display: "flex", gap: 1 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ fontSize: 9, color: i < post.rating ? REEL : "rgba(255,255,255,0.15)" }}>★</span>
            ))}
          </div>
        </div>

        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.62)", lineHeight: 1.55, marginBottom: 12 }}>{post.text}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: `linear-gradient(135deg, ${post.author_color}, ${post.author_color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "white" }}>{post.author_initial}</div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{post.author_name} · {post.timeAgo}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 11 }}>🌸</span>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK }}>{post.blooms}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function ScreeningRoomPage() {
  const [activeCategory, setActiveCategory] = useState<FilmCategory>("all");
  const [posts, setPosts] = useState<FilmPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPicks() {
      try {
        const res = await fetch("/api/avenue/screening-room");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows: ScreeningRow[] = await res.json();
        setPosts(Array.isArray(rows) ? rows.map(rowToFilmPost) : []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPicks();
  }, []);

  const cats = Object.entries(CAT_META) as [FilmCategory, { label: string; color: string }][];
  const filtered = activeCategory === "all" ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <div style={{ background: "#0E0C10", minHeight: "100vh", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>
      {/* Header */}
      <div style={{
        padding: "56px 22px 24px",
        background: "linear-gradient(150deg, #0E0C10 0%, #1A1224 60%, #2D1B4E 100%)",
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Spotlight effect */}
        <div style={{ position: "absolute", top: -60, right: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,184,75,0.08), transparent 70%)", pointerEvents: "none" }} />
        {/* Film strip edge */}
        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 24, display: "flex", flexDirection: "column", gap: 6, padding: "6px 0", overflow: "hidden" }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ width: 14, height: 9, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginLeft: 5 }} />
          ))}
        </div>
        <div style={{ paddingLeft: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <Link href="/member/avenue" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </Link>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(32px, 11vw, 44px)", color: "white", lineHeight: 1, marginBottom: 6 }}>Screening Room.</h1>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.4)" }}>Films. Reviews. Watch parties.</p>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(14,12,16,0.96)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 8, padding: "10px 18px" }}>
          {cats.map(([id, meta]) => (
            <button key={id} onClick={() => setActiveCategory(id)} style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 99,
              background: activeCategory === id ? meta.color : "rgba(255,255,255,0.05)",
              border: `1.5px solid ${activeCategory === id ? meta.color : "rgba(255,255,255,0.1)"}`,
              color: activeCategory === id ? "white" : "rgba(255,255,255,0.45)",
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}>{meta.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px 18px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ height: 230, borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
            ))
          : filtered.length === 0
            ? (
              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-caveat)", fontSize: 18, marginTop: 48 }}>
                Nothing published yet
              </p>
            )
            : filtered.map(post => <FilmCard key={post.id} post={post} />)
        }
      </div>

      {/* Watch party CTA */}
      <div style={{ margin: "24px 18px 0", borderRadius: 20, background: "linear-gradient(135deg, #1A0A2E, #2D1B4E)", padding: "22px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", border: "1px solid rgba(232,184,75,0.12)" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 4 }}>Host a Watch Party</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Pick a film, invite your circle, watch together live. BloomBay rooms hold up to 12.</p>
        <button style={{ padding: "12px 22px", borderRadius: 50, background: `linear-gradient(135deg, ${REEL}, #C8860A)`, border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: DARK, letterSpacing: "0.06em" }}>
          Start a Room →
        </button>
      </div>
    </div>
  );
}
