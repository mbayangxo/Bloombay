"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const GOLD  = "#D4A853";
const DARK  = "#1C1B1C";
const CREAM = "#FAF6F0";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`;

type BookCategory = "all" | "fiction" | "nonfiction" | "self-growth" | "romance" | "afrolit";

const CAT_META: Record<BookCategory, { label: string; color: string }> = {
  all:         { label: "All",       color: DARK },
  fiction:     { label: "Fiction",   color: "#5D4037" },
  nonfiction:  { label: "Non-fic",   color: "#1565C0" },
  "self-growth": { label: "Growth",  color: "#2E7D32" },
  romance:     { label: "Romance",   color: PINK },
  afrolit:     { label: "AfrоLit",   color: GOLD },
};

interface BookPost {
  id: string;
  author_name: string;
  author_initial: string;
  author_color: string;
  category: BookCategory;
  book_title: string;
  book_author: string;
  text: string;
  rating: number;
  blooms: number;
  spine_color: string;
  spine_color2: string;
  timeAgo: string;
}

// ── Book card ─────────────────────────────────────────────────────────────────

function BookCard({ post }: { post: BookPost }) {
  const meta = CAT_META[post.category];
  return (
    <div style={{
      background: `${GRAIN}, ${CREAM}`,
      backgroundSize: "200px 200px, auto",
      borderRadius: 18, overflow: "hidden",
      boxShadow: "0 6px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
      border: "1px solid rgba(212,168,83,0.1)",
      display: "flex", gap: 0,
    }}>
      {/* Book spine */}
      <div style={{
        width: 52, flexShrink: 0,
        background: `linear-gradient(180deg, ${post.spine_color} 0%, ${post.spine_color2} 100%)`,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "space-between", padding: "16px 6px",
        borderRight: "1px solid rgba(0,0,0,0.08)",
      }}>
        <p style={{
          fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700,
          fontSize: 9, color: "rgba(255,255,255,0.85)", lineHeight: 1.3,
          writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)",
          textAlign: "center",
        }}>{post.book_title}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ width: 18, height: 2, background: "rgba(255,255,255,0.25)", borderRadius: 1 }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "14px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 14, color: DARK, lineHeight: 1.2, marginBottom: 2 }}>{post.book_title}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#aaa", fontWeight: 600 }}>by {post.book_author}</p>
          </div>
          <div style={{ display: "flex", gap: 1, flexShrink: 0, marginLeft: 6 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ fontSize: 9, color: i < post.rating ? GOLD : "rgba(0,0,0,0.15)" }}>★</span>
            ))}
          </div>
        </div>

        <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.15em", color: meta.color, background: `${meta.color}10`, borderRadius: 99, padding: "2px 7px", marginBottom: 8, display: "inline-block" }}>{meta.label.toUpperCase()}</span>

        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.58)", lineHeight: 1.55, marginBottom: 10 }}>{post.text}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: `linear-gradient(135deg, ${post.author_color}, ${post.author_color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "white" }}>{post.author_initial}</div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#aaa" }}>{post.author_name} · {post.timeAgo}</p>
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

export function ReadingRoomPage() {
  const [activeCategory, setActiveCategory] = useState<BookCategory>("all");
  const [posts, setPosts] = useState<BookPost[]>([]);

  useEffect(() => {
    fetch("/api/avenue/reading")
      .then(r => r.json())
      .then(d => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setPosts((d.content ?? []).map((row: any): BookPost => ({
          id: row.id,
          book_title: row.title,
          book_author: row.meta?.book_author ?? "",
          category: (row.meta?.category ?? "fiction") as BookCategory,
          rating: row.meta?.rating ?? 0,
          spine_color: row.meta?.spine_color ?? "#333",
          spine_color2: row.meta?.spine_color2 ?? "#555",
          text: row.body ?? "",
          author_name: row.author ?? "",
          author_initial: (row.author ?? "?")[0],
          author_color: GOLD,
          blooms: 0,
          timeAgo: "",
        })));
      })
      .catch(() => setPosts([]));
  }, []);

  const cats = Object.entries(CAT_META) as [BookCategory, { label: string; color: string }][];
  const filtered = activeCategory === "all" ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <div style={{ background: "linear-gradient(160deg, #FAF6F0 0%, #F5EDD8 50%, #FAF6F0 100%)", minHeight: "100vh", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>
      <div style={{
        padding: "56px 22px 24px",
        background: `linear-gradient(150deg, #5D4037 0%, #8D6E63 60%, ${GOLD} 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,168,83,0.12), transparent)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Link href="/member/avenue" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.15)", borderRadius: 99, padding: "4px 12px", border: "1px solid rgba(255,255,255,0.2)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.2em" }}>54 READING NOW</p>
          </div>
        </div>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(32px, 11vw, 44px)", color: "white", lineHeight: 1, marginBottom: 6 }}>Reading Room.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.65)" }}>Books. Discuss. Share.</p>
      </div>

      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(250,246,240,0.96)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(212,168,83,0.12)" }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 8, padding: "10px 18px" }}>
          {cats.map(([id, meta]) => (
            <button key={id} onClick={() => setActiveCategory(id)} style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 99,
              background: activeCategory === id ? meta.color : "white",
              border: `1.5px solid ${activeCategory === id ? meta.color : "rgba(0,0,0,0.08)"}`,
              color: activeCategory === id ? "white" : "#888",
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}>{meta.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px 18px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(0,0,0,0.4)", fontFamily: "var(--font-caveat)", fontSize: 18, marginTop: 48 }}>
            Nothing published yet
          </p>
        )}
        {filtered.map(post => <BookCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}
