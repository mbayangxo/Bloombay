"use client";

import Link from "next/link";
import { BBLogo } from "./bb-logo";

const PINK = "#FF1F7D";

// ── Avenue data ─────────────────────────────────────────────────────────────────
interface AvenueConfig {
  signLine1: string;
  signLine2: string;
  title: string;
  tagline: string;
  href: string;
  accent: string;
  count: number | null;
}

const AVENUES: AvenueConfig[] = [
  {
    signLine1: "WALL ST.",
    signLine2: "THE WALL AVE.",
    title: "The Wall",
    tagline: "Post. Share. Vibe.",
    href: "/member/avenue/wall",
    accent: "#FF1F7D",
    count: 247,
  },
  {
    signLine1: "FASHION AVE.",
    signLine2: "THE CLOSET BLVD.",
    title: "The Closet",
    tagline: "Fits. Advice. Style.",
    href: "/member/avenue/closet",
    accent: "#E8007A",
    count: 183,
  },
  {
    signLine1: "MATCH LANE",
    signLine2: "INTRODUCTIONS AVE.",
    title: "Introductions",
    tagline: "Women who belong in your story.",
    href: "/member/match",
    accent: "#FF1F7D",
    count: 89,
  },
  {
    signLine1: "SERVICE ROW",
    signLine2: "THE BOOK ST.",
    title: "The Book",
    tagline: "Book women-owned services.",
    href: "/member/book",
    accent: "#C4005A",
    count: 48,
  },
  {
    signLine1: "BLOOM BLVD.",
    signLine2: "THE VANITY AVE.",
    title: "The Vanity",
    tagline: "Beauty. Glow. You.",
    href: "/member/avenue/vanity",
    accent: "#FF1F7D",
    count: 76,
  },
  {
    signLine1: "LIBRARY LANE",
    signLine2: "READING ROOM RD.",
    title: "The Reading Room",
    tagline: "Books. Discuss. Share.",
    href: "/member/avenue/reading-room",
    accent: "#D4A853",
    count: 54,
  },
  {
    signLine1: "CINEMA ROW",
    signLine2: "SCREENING ROOM ST.",
    title: "The Screening Room",
    tagline: "Film. Watch. Review.",
    href: "/member/avenue/screening-room",
    accent: "#FF1F7D",
    count: 38,
  },
  {
    signLine1: "PRESS ROW",
    signLine2: "MAGAZINE AVE.",
    title: "Magazine",
    tagline: "BloomBay Editorial.",
    href: "/member/avenue/magazine",
    accent: "#FF1F7D",
    count: null,
  },
  {
    signLine1: "WELLNESS ROW",
    signLine2: "HEALTH BAR AVE.",
    title: "The Health Bar",
    tagline: "Recipes. Rituals. Glow.",
    href: "/member/avenue/wellness",
    accent: "#4A7C59",
    count: 156,
  },
];

// ── Top Posts data ─────────────────────────────────────────────────────────────
const TOP_POSTS = [
  {
    room: "The Wall",
    roomHref: "/member/avenue/wall",
    user: "Aaliyah M.",
    initial: "A",
    color: "#FF1F7D",
    text: "Looking for a study partner in Brooklyn 📚 Anyone free this week?",
    blooms: 47,
  },
  {
    room: "The Closet",
    roomHref: "/member/avenue/closet",
    user: "Zara F.",
    initial: "Z",
    color: "#FF69B4",
    text: "Rate my fit for tonight's dinner — honest opinions only 🖤",
    blooms: 132,
  },
  {
    room: "The Book",
    roomHref: "/member/book",
    user: "Temi A.",
    initial: "T",
    color: "#A855F7",
    text: "Just launched my natural hair care services 🌿 Book me through The Book!",
    blooms: 89,
  },
  {
    room: "The Vanity",
    roomHref: "/member/avenue/vanity",
    user: "Sofia W.",
    initial: "S",
    color: "#E8A050",
    text: "My holy grail moisturiser routine for melanin skin ✨",
    blooms: 201,
  },
];

// ── AvenueSign ─────────────────────────────────────────────────────────────────
function AvenueSign({ avenue, flip = false }: { avenue: AvenueConfig; flip?: boolean }) {
  return (
    <Link href={avenue.href} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>

        {/* Cross-sign cluster */}
        <div style={{ position: "relative", width: 148, height: 92, marginBottom: 0 }}>

          {/* Upper crossing sign (street name) */}
          <div style={{
            position: "absolute",
            top: 0,
            left: flip ? "auto" : 8,
            right: flip ? 8 : "auto",
            background: avenue.accent,
            borderRadius: 5,
            padding: "5px 12px",
            border: "2.5px solid rgba(255,255,255,0.25)",
            boxShadow: `3px 3px 0 rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.1)`,
            transform: `rotate(${flip ? 1.5 : -1.5}deg)`,
            zIndex: 2,
            maxWidth: 120,
          }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: "white", letterSpacing: "0.08em", whiteSpace: "nowrap" as const }}>{avenue.signLine1}</p>
          </div>

          {/* Main sign (avenue title) */}
          <div style={{
            position: "absolute",
            top: 28,
            left: flip ? 8 : "auto",
            right: flip ? "auto" : 8,
            background: avenue.accent,
            borderRadius: 5,
            padding: "8px 14px",
            border: "2.5px solid rgba(255,255,255,0.25)",
            boxShadow: `3px 3px 0 rgba(0,0,0,0.2), 0 4px 16px ${avenue.accent}55`,
            transform: `rotate(${flip ? -2 : 2}deg)`,
            zIndex: 3,
          }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "white", whiteSpace: "nowrap" as const, lineHeight: 1.1 }}>{avenue.title}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 600, color: "rgba(255,255,255,0.75)", letterSpacing: "0.04em", marginTop: 2 }}>{avenue.tagline}</p>
          </div>

          {/* Count badge */}
          {avenue.count !== null && (
            <div style={{
              position: "absolute", top: 26, left: flip ? "auto" : 4, right: flip ? 4 : "auto",
              background: "white", borderRadius: 999, height: 18, minWidth: 18,
              paddingLeft: 6, paddingRight: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              zIndex: 5,
            }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 900, color: avenue.accent, lineHeight: 1 }}>{avenue.count}</span>
            </div>
          )}
        </div>

        {/* Pole */}
        <div style={{
          width: 7,
          height: 36,
          background: "linear-gradient(90deg, #aaa 0%, #ddd 35%, #bbb 65%, #999 100%)",
          boxShadow: "1px 0 3px rgba(0,0,0,0.2)",
          borderRadius: "0 0 2px 2px",
        }} />

        {/* Base */}
        <div style={{ width: 18, height: 5, borderRadius: "0 0 3px 3px", background: "linear-gradient(180deg, #aaa, #888)", boxShadow: "0 2px 4px rgba(0,0,0,0.25)" }} />
      </div>
    </Link>
  );
}

// ── TopPostCard ────────────────────────────────────────────────────────────────
function TopPostCard({ post }: { post: typeof TOP_POSTS[number] }) {
  return (
    <Link href={post.roomHref} style={{ textDecoration: "none", flexShrink: 0 }}>
      <div style={{
        width: 180,
        background: "#FFFFFF",
        borderRadius: 18,
        padding: "14px 14px 12px",
        border: "1.5px solid rgba(255,0,144,0.09)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        gap: 9,
      }}>
        {/* Room tag + avatar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ background: "rgba(255,0,144,0.08)", borderRadius: 999, padding: "3px 8px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 900, color: PINK, letterSpacing: "0.08em" }}>{post.room.toUpperCase()}</p>
          </div>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${post.color}, ${post.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white" }}>{post.initial}</p>
          </div>
        </div>

        {/* Post text */}
        <p style={{
          fontFamily: "var(--font-caveat)",
          fontSize: 13,
          color: "rgba(0,0,0,0.72)",
          lineHeight: 1.4,
          flex: 1,
        }}>{post.text}</p>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(0,0,0,0.35)" }}>{post.user}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 12 }}>🌸</span>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK }}>{post.blooms}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── AvenuePage ──────────────────────────────────────────────────────────────────
export function AvenuePage() {
  return (
    <div style={{
      background: "linear-gradient(160deg, #FF1F7D 0%, #FF1F7D 45%, #FF5BAD 80%, #FFB3D9 100%)",
      minHeight: "100vh",
      paddingBottom: 104,
      overflowX: "hidden",
    }}>
      <style>{`
        .lscroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ══ HEADER ═══════════════════════════════════════════════════════════════ */}
      <div style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 70px)",
        paddingLeft: 24, paddingRight: 24, paddingBottom: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <BBLogo size={22} light />
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.2em" }}>WHERE WOMEN CONNECT</p>
        </div>
        <div style={{ marginTop: 20 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: 58, color: "white", lineHeight: 0.9 }}>The Avenue.</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,255,255,0.55)", marginTop: 8 }}>every block has something for you ♡</p>
        </div>
      </div>

      {/* ══ TOP POSTS — full-width horizontal scroll ═════════════════════════ */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 900, color: "rgba(255,255,255,0.7)", letterSpacing: "0.18em" }}>TOP POSTS</p>
          <Link href="/member/avenue/wall" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(255,255,255,0.38)" }}>all →</span>
          </Link>
        </div>
        <div className="lscroll" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 24px 8px", scrollbarWidth: "none" as const }}>
          {TOP_POSTS.map((post, i) => (
            <TopPostCard key={i} post={post} />
          ))}
        </div>
      </div>

      {/* ══ THE AVENUE — sign grid ════════════════════════════════════════ */}
      <div style={{ marginTop: 32, paddingBottom: 8 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 900, color: "white", letterSpacing: "0.22em", marginBottom: 20, padding: "0 24px" }}>THE AVENUE</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 8px", padding: "0 20px" }}>
          {AVENUES.map((avenue, i) => (
            <AvenueSign key={avenue.href} avenue={avenue} flip={i % 2 === 1} />
          ))}
        </div>
      </div>

    </div>
  );
}
