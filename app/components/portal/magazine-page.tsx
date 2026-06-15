"use client";

import { useState } from "react";
import Link from "next/link";

const PINK   = "#FF1F7D";
const DARK   = "#1C1B1C";
const CREAM  = "#FAF6F0";
const GOLD   = "#D4A853";
const GRAIN  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

type MagSection = "all" | "culture" | "wellness" | "career" | "love" | "style" | "opinion";

const SECTION_META: Record<MagSection, { label: string; color: string }> = {
  all:      { label: "All",      color: DARK },
  culture:  { label: "Culture",  color: "#7B1FA2" },
  wellness: { label: "Wellness", color: "#2E7D32" },
  career:   { label: "Career",   color: "#1565C0" },
  love:     { label: "Love",     color: PINK },
  style:    { label: "Style",    color: "#C4005A" },
  opinion:  { label: "Opinion",  color: "#E65100" },
};

interface Article {
  id: string;
  section: MagSection;
  headline: string;
  dek: string;
  author: string;
  author_initial: string;
  author_color: string;
  readTime: string;
  cover_a: string;
  cover_b: string;
  featured?: boolean;
  blooms: number;
  timeAgo: string;
  label?: string;
}

const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    section: "culture",
    headline: "The Quiet Power of Taking Up Space",
    dek: "On learning to stop apologising for wanting the seat at the table — and what happens when we finally sit down.",
    author: "Amara T.", author_initial: "A", author_color: GOLD,
    readTime: "6 min read",
    cover_a: "#4A148C", cover_b: "#7B1FA2",
    featured: true, blooms: 512, timeAgo: "2h ago",
    label: "COVER STORY",
  },
  {
    id: "2",
    section: "wellness",
    headline: "Your Body Isn't the Problem",
    dek: "A conversation with nutritionist Dr. Funmi Adeyemi on why diet culture was never about health.",
    author: "Nia B.", author_initial: "N", author_color: "#C084FC",
    readTime: "4 min read",
    cover_a: "#1B5E20", cover_b: "#2E7D32",
    blooms: 289, timeAgo: "5h ago",
  },
  {
    id: "3",
    section: "love",
    headline: "The Soft Life Is a Political Act",
    dek: "Rest, pleasure, and choosing ease — Black women reclaim the right to do nothing.",
    author: "Kezia M.", author_initial: "K", author_color: PINK,
    readTime: "5 min read",
    cover_a: "#AD1457", cover_b: PINK,
    blooms: 401, timeAgo: "1d ago",
    label: "EDITOR'S PICK",
  },
  {
    id: "4",
    section: "career",
    headline: "On Being the Only One in the Room",
    dek: "Six women on navigating workplaces that weren't built for them — and building their own anyway.",
    author: "Temi A.", author_initial: "T", author_color: "#83C5A0",
    readTime: "8 min read",
    cover_a: "#0D47A1", cover_b: "#1565C0",
    blooms: 176, timeAgo: "2d ago",
  },
  {
    id: "5",
    section: "style",
    headline: "Dressing Without Permission",
    dek: "The return of maximalism and why personal style has nothing to do with other people's comfort.",
    author: "Zara F.", author_initial: "Z", author_color: "#E8A050",
    readTime: "3 min read",
    cover_a: "#880E4F", cover_b: "#C4005A",
    blooms: 234, timeAgo: "3d ago",
  },
  {
    id: "6",
    section: "opinion",
    headline: "We Need to Talk About 'Networking'",
    dek: "Community is not leverage. A pushback on hustle culture's colonisation of our relationships.",
    author: "Sofia W.", author_initial: "S", author_color: "#FF69B4",
    readTime: "5 min read",
    cover_a: "#BF360C", cover_b: "#E64A19",
    blooms: 143, timeAgo: "4d ago",
  },
];

// ── Featured article ──────────────────────────────────────────────────────────

function FeaturedCard({ article }: { article: Article }) {
  const meta = SECTION_META[article.section];
  return (
    <div style={{
      borderRadius: 22,
      overflow: "hidden",
      boxShadow: "0 12px 48px rgba(0,0,0,0.14), 0 3px 8px rgba(0,0,0,0.06)",
      background: CREAM,
      border: "1px solid rgba(212,168,83,0.1)",
      position: "relative",
    }}>
      {/* Large cover image */}
      <div style={{
        height: 220,
        background: `linear-gradient(160deg, ${article.cover_a} 0%, ${article.cover_b} 100%)`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, backgroundSize: "200px 200px" }} />
        {/* BB Magazine masthead stamp */}
        <div style={{ position: "absolute", top: 14, right: 14, fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>BB</div>
        {article.label && (
          <div style={{ position: "absolute", top: 12, left: 12, background: PINK, borderRadius: 99, padding: "3px 10px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.18em" }}>{article.label}</p>
          </div>
        )}
        <div style={{ position: "relative", zIndex: 1, padding: "0 18px 20px", background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)", paddingTop: 40, width: "100%" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: meta.color, background: `${meta.color}22`, borderRadius: 99, padding: "2px 8px", marginBottom: 8, display: "inline-block", backdropFilter: "blur(4px)" }}>{meta.label.toUpperCase()}</span>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: "white", lineHeight: 1.15, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{article.headline}</h2>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "14px 18px 16px" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.55)", lineHeight: 1.55, marginBottom: 14 }}>{article.dek}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${article.author_color}, ${article.author_color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "white" }}>{article.author_initial}</div>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: DARK, lineHeight: 1.2 }}>{article.author}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#aaa" }}>{article.readTime} · {article.timeAgo}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 11 }}>🌸</span>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK }}>{article.blooms}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Regular article card ──────────────────────────────────────────────────────

function ArticleCard({ article }: { article: Article }) {
  const meta = SECTION_META[article.section];
  return (
    <div style={{
      borderRadius: 16,
      overflow: "hidden",
      background: `${GRAIN}, ${CREAM}`,
      backgroundSize: "200px 200px, auto",
      boxShadow: "0 4px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.05)",
      display: "flex",
      gap: 0,
    }}>
      {/* Color sidebar */}
      <div style={{
        width: 6, flexShrink: 0,
        background: `linear-gradient(180deg, ${article.cover_a}, ${article.cover_b})`,
      }} />

      {/* Content */}
      <div style={{ flex: 1, padding: "13px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.15em", color: meta.color, background: `${meta.color}10`, borderRadius: 99, padding: "2px 7px" }}>{meta.label.toUpperCase()}</span>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#bbb" }}>{article.readTime}</p>
        </div>
        <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: DARK, lineHeight: 1.25, marginBottom: 5 }}>{article.headline}</h3>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.5)", lineHeight: 1.5, marginBottom: 10 }}>{article.dek}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: `linear-gradient(135deg, ${article.author_color}, ${article.author_color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: "white" }}>{article.author_initial}</div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#bbb" }}>{article.author} · {article.timeAgo}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 10 }}>🌸</span>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK }}>{article.blooms}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function MagazinePage() {
  const [activeSection, setActiveSection] = useState<MagSection>("all");
  const sections = Object.entries(SECTION_META) as [MagSection, { label: string; color: string }][];
  const filtered = activeSection === "all" ? MOCK_ARTICLES : MOCK_ARTICLES.filter(a => a.section === activeSection);
  const [featured, ...rest] = filtered;

  return (
    <div style={{ background: `${GRAIN}, ${CREAM}`, backgroundSize: "200px 200px, auto", minHeight: "100vh", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>
      {/* Header */}
      <div style={{
        padding: "56px 22px 24px",
        background: `${GRAIN}, linear-gradient(150deg, ${DARK} 0%, #2C1A2E 60%, #3D1A4A 100%)`,
        backgroundSize: "200px 200px, auto",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}12, transparent)`, pointerEvents: "none" }} />
        {/* Issue line */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}44, transparent)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Link href="/member/avenue" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.08)", borderRadius: 99, padding: "4px 12px", border: "1px solid rgba(212,168,83,0.2)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: `${GOLD}CC`, letterSpacing: "0.2em" }}>ISSUE 07 · JUNE 2026</p>
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: `${GOLD}88`, letterSpacing: "0.3em", marginBottom: 4 }}>BLOOMBAY</p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 44, color: "white", lineHeight: 1, marginBottom: 6 }}>Magazine.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.45)" }}>Her stories. Her voice. Her world.</p>
      </div>

      {/* Section filter */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(250,246,240,0.97)", backdropFilter: "blur(8px)", borderBottom: `2px solid ${GOLD}22` }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 8, padding: "10px 18px" }}>
          {sections.map(([id, meta]) => (
            <button key={id} onClick={() => setActiveSection(id)} style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 99,
              background: activeSection === id ? meta.color : "white",
              border: `1.5px solid ${activeSection === id ? meta.color : "rgba(0,0,0,0.08)"}`,
              color: activeSection === id ? "white" : "#888",
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}>{meta.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px 18px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {featured && <FeaturedCard article={featured} />}
        {rest.map(article => <ArticleCard key={article.id} article={article} />)}
      </div>

      {/* Write CTA */}
      <div style={{ margin: "24px 18px 0", borderRadius: 20, background: `${GRAIN}, ${DARK}`, backgroundSize: "200px 200px, auto", padding: "22px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", border: `1px solid ${GOLD}18` }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 4 }}>Write for BloomBay</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>Have something to say? Pitch us. Every issue features member voices.</p>
        <button style={{ padding: "12px 22px", borderRadius: 50, background: `linear-gradient(135deg, ${PINK}, #C4005A)`, border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: "white", letterSpacing: "0.06em", boxShadow: `0 4px 16px ${PINK}44` }}>
          Submit a Pitch →
        </button>
      </div>
    </div>
  );
}
