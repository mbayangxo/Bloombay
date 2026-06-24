"use client";

import Link from "next/link";
import { BBLogo } from "./bb-logo";
import { useState, useEffect } from "react";
import { AVENUES } from "@/lib/avenue/rooms";
import { type AvenueConfig } from "@/lib/avenue/rooms";
import { getPostDisplay, type WallPost, type PostDisplay } from "@/lib/avenue/post-display";

const PINK = "#FF1F7D";

// ── AvenueArrow ────────────────────────────────────────────────────────────────
function AvenueArrow({ avenue, flip = false }: { avenue: AvenueConfig; flip?: boolean }) {
  const TIP = 32;
  const clipRight = `polygon(0 0, calc(100% - ${TIP}px) 0, 100% 50%, calc(100% - ${TIP}px) 100%, 0 100%)`;
  const clipLeft  = `polygon(${TIP}px 0, 100% 0, 100% 100%, ${TIP}px 100%, 0 50%)`;

  return (
    <Link href={avenue.href} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        clipPath: flip ? clipLeft : clipRight,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(26,26,26,0.08)",
        padding: flip ? `15px 22px 15px ${TIP + 22}px` : `15px ${TIP + 22}px 15px 22px`,
        display: "flex",
        alignItems: "center",
        gap: 11,
        flexDirection: flip ? "row-reverse" as const : "row" as const,
      }}>

        {/* Magazine object icon */}
        {avenue.icon === "magazine" && (
          <svg width="20" height="26" viewBox="0 0 20 26" fill="none" style={{ flexShrink: 0 }}>
            <rect x="1" y="2" width="15" height="20" rx="1" fill="rgba(0,0,0,0.06)" transform="rotate(-4 8 12)"/>
            <rect x="2" y="1" width="16" height="22" rx="1.5" fill="rgba(0,0,0,0.08)"/>
            <line x1="5" y1="6"  x2="15" y2="6"  stroke="rgba(255,31,125,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="5" y1="9"  x2="12" y2="9"  stroke="rgba(0,0,0,0.18)" strokeWidth="1" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="15" y2="12" stroke="rgba(0,0,0,0.14)" strokeWidth="1" strokeLinecap="round"/>
            <line x1="5" y1="15" x2="11" y2="15" stroke="rgba(0,0,0,0.14)" strokeWidth="1" strokeLinecap="round"/>
            <line x1="5" y1="18" x2="14" y2="18" stroke="rgba(0,0,0,0.12)" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        )}

        <div style={{ flex: 1, textAlign: flip ? "right" as const : "left" as const }}>
          <p style={{
            fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900,
            fontStyle: "italic", color: "#1A1A1A", lineHeight: 1, margin: 0,
          }}>{avenue.title}</p>
          <p style={{
            fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 700,
            color: "rgba(26,26,26,0.5)", letterSpacing: "0.07em", marginTop: 3,
          }}>{avenue.tagline}</p>
        </div>

        {avenue.count !== null && (
          <div style={{
            background: "rgba(255,31,125,0.08)",
            borderRadius: 999, padding: "2px 9px",
            border: "1px solid rgba(255,31,125,0.2)",
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: PINK }}>{avenue.count}</span>
          </div>
        )}

        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" style={{ flexShrink: 0, transform: flip ? "scaleX(-1)" : undefined }}>
          <path d="M1 1l6 6-6 6" stroke="rgba(26,26,26,0.35)" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
    </Link>
  );
}

// ── TopPostCard ────────────────────────────────────────────────────────────────
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ background: "rgba(255,0,144,0.08)", borderRadius: 999, padding: "3px 8px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 900, color: PINK, letterSpacing: "0.08em" }}>{post.room.toUpperCase()}</p>
          </div>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${post.color}, ${post.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white" }}>{post.initial}</p>
          </div>
        </div>

        <p style={{
          fontFamily: "var(--font-caveat)",
          fontSize: 13,
          color: "rgba(0,0,0,0.72)",
          lineHeight: 1.4,
          flex: 1,
        }}>{post.text}</p>

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

// ── TopPostsSkeleton ───────────────────────────────────────────────────────────
function TopPostsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{
          width: 180, height: 130, flexShrink: 0,
          background: "rgba(26,26,26,0.06)", borderRadius: 18,
          animation: "pulse 1.5s ease-in-out infinite",
        }} />
      ))}
    </>
  );
}

// ── TopPostsSection ────────────────────────────────────────────────────────────
type LoadState = "loading" | "loaded" | "empty" | "error";

function TopPostsSection() {
  const [posts, setPosts] = useState<PostDisplay[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    fetch("/api/avenue/top-posts")
      .then(r => {
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then((data: WallPost[]) => {
        const mapped = (data ?? []).map((p, i) => getPostDisplay(p, i));
        setPosts(mapped);
        setState(mapped.length === 0 ? "empty" : "loaded");
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", marginBottom: 12 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 900, color: "rgba(26,26,26,0.5)", letterSpacing: "0.18em" }}>TOP POSTS</p>
        <Link href="/member/avenue/wall" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(26,26,26,0.35)" }}>all →</span>
        </Link>
      </div>
      <div className="lscroll" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 24px 8px", scrollbarWidth: "none" as const }}>
        {state === "loading" && <TopPostsSkeleton />}
        {state === "loaded" && posts.map((post, i) => <TopPostCard key={i} post={post} />)}
        {state === "empty" && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(26,26,26,0.3)", padding: "16px 0" }}>
            Be the first to post something ✿
          </p>
        )}
        {state === "error" && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(26,26,26,0.3)", padding: "16px 0" }}>
            Couldn&apos;t load posts right now.
          </p>
        )}
      </div>
    </div>
  );
}

// ── AvenuePage ──────────────────────────────────────────────────────────────────
export function AvenuePage() {
  return (
    <div style={{
      background: "#ffffff",
      minHeight: "100vh",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)",
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
          <BBLogo size={22} />
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, color: "rgba(26,26,26,0.4)", letterSpacing: "0.2em" }}>WHERE WOMEN CONNECT</p>
        </div>

        <div style={{ marginTop: 18, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: 28, color: "#1A1A1A", lineHeight: 1, margin: 0 }}>The Avenue.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(26,26,26,0.45)", marginTop: 5 }}>every block has something for you ♡</p>
          </div>

          {/* Publication objects — Magazine + The Column */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0, paddingTop: 2 }}>
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

      {/* ══ TOP POSTS ════════════════════════════════════════════════════════════ */}
      <TopPostsSection />

      {/* ══ THE AVENUE — arrow list ════════════════════════════════════════════ */}
      <div style={{ marginTop: 32, paddingBottom: 8 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 900, color: "rgba(26,26,26,0.5)", letterSpacing: "0.22em", marginBottom: 16, padding: "0 24px" }}>THE AVENUE</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {AVENUES.map((avenue, i) => (
            <AvenueArrow key={avenue.href} avenue={avenue} flip={i % 2 === 1} />
          ))}
        </div>
      </div>

    </div>
  );
}
