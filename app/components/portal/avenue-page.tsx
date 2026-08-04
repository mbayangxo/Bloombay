"use client";

import Link from "next/link";
import { BBLogo } from "./bb-logo";
import { useState, useEffect } from "react";

const PINK = "#FF1F7D";

// ── Avenue data ─────────────────────────────────────────────────────────────────
interface AvenueConfig {
  signLine1: string;
  title: string;
  tagline: string;
  href: string;
  roomKey: string;
  emoji: string;
}

// Every window uses the same brand pink awning/frame — the emoji + sign
// line are what tell rooms apart, not a different palette per room.
const AVENUES: AvenueConfig[] = [
  {
    signLine1: "WALL ST.",
    title: "The Wall",
    tagline: "Post. Share. Vibe.",
    href: "/member/avenue/wall",
    roomKey: "wall",
    emoji: "📌",
  },
  {
    signLine1: "FASHION AVE.",
    title: "The Closet",
    tagline: "Fits. Advice. Style.",
    href: "/member/avenue/closet",
    roomKey: "closet",
    emoji: "👗",
  },
  {
    signLine1: "BLOOM BLVD.",
    title: "The Vanity",
    tagline: "Beauty. Glow. You.",
    href: "/member/avenue/vanity",
    roomKey: "vanity",
    emoji: "💄",
  },
  {
    signLine1: "LIBRARY LANE",
    title: "The Reading Room",
    tagline: "Books. Discuss. Share.",
    href: "/member/avenue/reading-room",
    roomKey: "reading-room",
    emoji: "📚",
  },
  {
    signLine1: "CINEMA ROW",
    title: "The Screening Room",
    tagline: "Film. Watch. Review.",
    href: "/member/avenue/screening-room",
    roomKey: "screening",
    emoji: "🎬",
  },
  {
    signLine1: "FITNESS ROW",
    title: "Girl Fit",
    tagline: "Move. Eat. Glow.",
    href: "/member/avenue/wellness",
    roomKey: "wellness",
    emoji: "🧘",
  },
  {
    signLine1: "CAREER BLVD.",
    title: "Girl Working",
    tagline: "Jobs. Money. Hot Takes.",
    href: "/member/avenue/working",
    roomKey: "working",
    emoji: "💼",
  },
];

// ── Top Posts data ─────────────────────────────────────────────────────────────

interface WallPost {
  id: string;
  text: string;
  blooms: number;
  category: string | null;
  is_seed: boolean;
  seed_author: string | null;
  author: { id: string; first_name: string | null; full_name: string | null } | null;
}

const CATEGORY_ROOMS: Record<string, { title: string; href: string }> = {
  wall:           { title: "The Wall",         href: "/member/avenue/wall" },
  closet:         { title: "The Closet",        href: "/member/avenue/closet" },
  vanity:         { title: "The Vanity",        href: "/member/avenue/vanity" },
  wellness:       { title: "Girl Fit",           href: "/member/avenue/wellness" },
  "reading-room": { title: "The Reading Room",  href: "/member/avenue/reading-room" },
  screening:      { title: "The Screening Room", href: "/member/avenue/screening-room" },
  working:        { title: "Girl Working",      href: "/member/avenue/working" },
  magazine:       { title: "Magazine",          href: "/member/avenue/magazine" },
};
const AVATAR_COLORS = ["#FF1F7D", "#FF69B4", "#A855F7", "#E8A050", "#4A7C59", "#C4005A", "#1565C0", "#D4A853"];

function getPostDisplay(post: WallPost, idx: number) {
  const roomMeta = CATEGORY_ROOMS[post.category ?? "wall"] ?? { title: "The Wall", href: "/member/avenue/wall" };
  const userName = post.is_seed && post.seed_author
    ? post.seed_author
    : (post.author?.first_name ?? post.author?.full_name?.split(" ")[0] ?? "Member");
  return {
    room: roomMeta.title,
    roomHref: roomMeta.href,
    user: userName,
    initial: userName[0]?.toUpperCase() ?? "B",
    color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
    text: post.text,
    blooms: post.blooms,
  };
}

// ── Avenue signpost — a street of hanging signs down a lamppost line,
// one per room, alternating sides. Same visual language as The City's
// neighborhood signposts, so the two districts read as siblings. ────────────
const SIGN_COLORS = [PINK, "#D86487", "#C0185F", PINK, "#E87BA8", "#D86487", "#C0185F"];

function AvenueSign({ avenue, count, side, swayClass }: {
  avenue: AvenueConfig; count: number | null; side: "left" | "right"; swayClass: string;
}) {
  const color = SIGN_COLORS[AVENUES.indexOf(avenue) % SIGN_COLORS.length];
  const pointer = (
    <div style={{
      width: 0, height: 0,
      borderTop: "18px solid transparent", borderBottom: "18px solid transparent",
      ...(side === "left" ? { borderRight: `16px solid ${color}` } : { borderLeft: `16px solid ${color}` }),
    }} />
  );
  const tag = (
    <div style={{
      background: color,
      padding: side === "left" ? "10px 18px 10px 10px" : "10px 10px 10px 18px",
      borderRadius: side === "left" ? "0 8px 8px 0" : "8px 0 0 8px",
    }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.7)" }}>{avenue.signLine1}</p>
      <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.15, whiteSpace: "nowrap" }}>{avenue.emoji} {avenue.title}</p>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
        {avenue.tagline}{count !== null && count > 0 ? ` · ${count} today` : ""}
      </p>
    </div>
  );
  return (
    <Link href={avenue.href} style={{
      textDecoration: "none",
      alignSelf: side === "left" ? "flex-start" : "flex-end",
      marginLeft: side === "left" ? "5%" : 0,
      marginRight: side === "right" ? "5%" : 0,
    }}>
      <div className={swayClass} style={{ position: "relative", display: "inline-flex", alignItems: "center", filter: "drop-shadow(0 3px 8px rgba(26,26,26,0.14))" }}>
        {side === "left" ? <>{pointer}{tag}</> : <>{tag}{pointer}</>}
      </div>
    </Link>
  );
}

// ── TopPostCard ────────────────────────────────────────────────────────────────
interface PostDisplay {
  room: string; roomHref: string; user: string; initial: string; color: string; text: string; blooms: number;
}
function TopPostCard({ post }: { post: PostDisplay }) {
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
  const [topPosts, setTopPosts] = useState<PostDisplay[]>([]);
  const [topPostsLoading, setTopPostsLoading] = useState(true);
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/avenue/top-posts")
      .then(r => r.ok ? r.json() : [])
      .then((data: WallPost[]) => setTopPosts((data ?? []).map((p, i) => getPostDisplay(p, i))))
      .catch(() => {})
      .finally(() => setTopPostsLoading(false));

    fetch("/api/avenue/room-counts")
      .then(r => r.json())
      .then(d => setRoomCounts(d.counts ?? {}))
      .catch(() => {});
  }, []);

  return (
    <div style={{
      background: "#FFF0F6",
      minHeight: "100vh",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)",
      overflowX: "hidden",
    }}>
      <style>{`
        .lscroll::-webkit-scrollbar { display: none; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        .ave-sign-0 { transform-origin: center center; animation: aveSway0 3.2s ease-in-out infinite; }
        .ave-sign-1 { transform-origin: center center; animation: aveSway1 2.9s ease-in-out 0.5s infinite; }
        .ave-sign-2 { transform-origin: center center; animation: aveSway2 3.5s ease-in-out 0.2s infinite; }
        .ave-sign-3 { transform-origin: center center; animation: aveSway3 2.7s ease-in-out 0.8s infinite; }
        .ave-sign-4 { transform-origin: center center; animation: aveSway4 3.1s ease-in-out 0.3s infinite; }
        .ave-sign-5 { transform-origin: center center; animation: aveSway5 2.8s ease-in-out 0.7s infinite; }
        .ave-sign-6 { transform-origin: center center; animation: aveSway6 3.3s ease-in-out 0.1s infinite; }
        @keyframes aveSway0 { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(-4.5deg) translateY(1px); } }
        @keyframes aveSway1 { 0%,100% { transform: rotate(2.5deg); } 50% { transform: rotate(4.5deg) translateY(1px); } }
        @keyframes aveSway2 { 0%,100% { transform: rotate(-1.5deg); } 50% { transform: rotate(-3.5deg) translateY(1px); } }
        @keyframes aveSway3 { 0%,100% { transform: rotate(1deg); } 50% { transform: rotate(3deg) translateY(1px); } }
        @keyframes aveSway4 { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(-5.5deg) translateY(1px); } }
        @keyframes aveSway5 { 0%,100% { transform: rotate(2deg); } 50% { transform: rotate(4.5deg) translateY(1px); } }
        @keyframes aveSway6 { 0%,100% { transform: rotate(-1deg); } 50% { transform: rotate(-3deg) translateY(1px); } }
      `}</style>

      {/* ══ HEADER ═══════════════════════════════════════════════════════════════ */}
      <div style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 70px)",
        paddingLeft: 24, paddingRight: 24, paddingBottom: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <BBLogo size={22} />
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, color: "rgba(26,26,26,0.4)", letterSpacing: "0.2em" }}>WHERE WOMEN CONNECT</p>
        </div>

        {/* Title row — small title + publication objects side by side */}
        <div style={{ marginTop: 18, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: 28, color: "#1A1A1A", lineHeight: 1, margin: 0 }}>The Avenue.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(26,26,26,0.45)", marginTop: 5 }}>every block has something for you ♡</p>
          </div>

          {/* Publication objects — Magazine + The Column */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0, paddingTop: 2 }}>
            {/* BloomBay Magazine */}
            <Link href="/member/avenue/magazine" style={{ textDecoration: "none" }}>
              <div style={{
                width: 56, height: 74,
                background: "#fff",
                border: "1px solid rgba(255,31,125,0.18)",
                borderRadius: 5,
                display: "flex", flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                position: "relative",
              }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: "rgba(255,31,125,0.15)" }} />
                <div style={{ flex: 1, padding: "6px 6px 4px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ height: 1, background: PINK, marginBottom: 2 }} />
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: 6, fontStyle: "italic", fontWeight: 700, color: "#1A1A1A", lineHeight: 1.1 }}>BloomBay</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 4.5, fontWeight: 900, letterSpacing: "0.12em", color: "rgba(26,26,26,0.5)" }}>MAG</p>
                  <div style={{ height: 1, background: "rgba(26,26,26,0.12)", marginTop: 2 }} />
                  <div style={{ height: 1, background: "rgba(26,26,26,0.07)", marginTop: 2 }} />
                  <div style={{ height: 1, background: "rgba(26,26,26,0.04)", marginTop: 2 }} />
                </div>
                <div style={{ padding: "3px 5px 4px 10px", background: PINK }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "4px", fontWeight: 900, letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)" }}>EDITORIAL</p>
                </div>
              </div>
            </Link>

            {/* The Column */}
            <Link href="/member/avenue/column" style={{ textDecoration: "none" }}>
              <div style={{
                width: 56, height: 74,
                background: "#fff",
                border: "1px solid rgba(26,26,26,0.1)",
                borderRadius: 5,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ flex: 1, padding: "6px 7px 4px", display: "flex", flexDirection: "column", gap: 4 }}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ height: 1, background: i === 0 ? "rgba(26,26,26,0.35)" : "rgba(26,26,26,0.1)" }} />
                  ))}
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 7, color: "rgba(26,26,26,0.5)", lineHeight: 1.2, marginTop: 2 }}>Zuri writes every Sunday.</p>
                </div>
                <div style={{ padding: "3px 7px 4px", background: "rgba(255,31,125,0.85)" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "4px", fontWeight: 900, letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)" }}>THE COLUMN</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ══ TOP POSTS — full-width horizontal scroll ═════════════════════════ */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 900, color: "rgba(26,26,26,0.5)", letterSpacing: "0.18em" }}>TOP POSTS</p>
          <Link href="/member/avenue/wall" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(26,26,26,0.35)" }}>all →</span>
          </Link>
        </div>
        {topPostsLoading ? (
          <div className="lscroll" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 24px 8px", scrollbarWidth: "none" as const }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ width: 180, height: 130, background: "rgba(26,26,26,0.06)", borderRadius: 18, flexShrink: 0, animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : topPosts.length === 0 ? (
          <div style={{ padding: "0 24px" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(26,26,26,0.4)" }}>
              Nothing trending yet — be the first to post on{" "}
              <Link href="/member/avenue/wall" style={{ color: PINK, textDecoration: "none", fontWeight: 700 }}>The Wall ✦</Link>
            </p>
          </div>
        ) : (
          <div className="lscroll" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 24px 8px", scrollbarWidth: "none" as const }}>
            {topPosts.map((post, i) => (
              <TopPostCard key={i} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* ══ THE AVENUE — a street of signposts, one per room ═════════════════ */}
      <div style={{ marginTop: 32, paddingBottom: 8 }}>
        <div style={{ padding: "0 24px", marginBottom: 4 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 900, color: "rgba(26,26,26,0.5)", letterSpacing: "0.22em" }}>THE AVENUE</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(26,26,26,0.4)", marginTop: 2 }}>tap a sign to explore</p>
        </div>

        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 0 8px", minHeight: 420 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: PINK, border: "3px solid #FF5BAD", zIndex: 2 }} />
          <div style={{ width: 8, height: "100%", position: "absolute", top: 14, background: `linear-gradient(180deg, ${PINK} 0%, #FF9CC8 100%)`, borderRadius: 4, zIndex: 1, opacity: 0.5 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 12, width: "100%", alignItems: "center", zIndex: 2 }}>
            {AVENUES.map((avenue, i) => (
              <AvenueSign
                key={avenue.href}
                avenue={avenue}
                count={roomCounts[avenue.roomKey] ?? null}
                side={i % 2 === 0 ? "left" : "right"}
                swayClass={`ave-sign-${i % 7}`}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
