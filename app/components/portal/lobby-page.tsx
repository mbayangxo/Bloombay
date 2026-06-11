"use client";

import Link from "next/link";
import { BBLogo } from "./bb-logo";

const PINK = "#FF1F7D";

// ── Door data ──────────────────────────────────────────────────────────────────
interface DoorConfig {
  street: string;
  title: string;
  tagline: string;
  href: string;
  background: string;
  knobColor: string;
  count: number | null;
  darkText?: boolean;
  lightPanel?: boolean;
}

const DOORS: DoorConfig[] = [
  {
    street: "Wall St.",
    title: "The Wall",
    tagline: "Post. Share. Vibe.",
    href: "/member/lobby/wall",
    background: "linear-gradient(145deg, #FF1F7D 0%, #E8007A 100%)",
    knobColor: "#FFD6EE",
    count: 247,
  },
  {
    street: "Fashion Ave.",
    title: "The Closet",
    tagline: "Fits. Advice. Swap.",
    href: "/member/lobby/closet",
    background: "linear-gradient(145deg, #FFB3D9 0%, #FF8EC7 100%)",
    knobColor: "#FF1F7D",
    count: 183,
    darkText: true,
  },
  {
    street: "Match Lane",
    title: "Girl Mate",
    tagline: "Find your people.",
    href: "/member/lobby/girl-mate",
    background: "linear-gradient(145deg, #E8A050 0%, #C87830 100%)",
    knobColor: "#FFF0D0",
    count: 89,
  },
  {
    street: "Market Row",
    title: "The Shop",
    tagline: "Her brand. Her world.",
    href: "/member/lobby/shop",
    background: "linear-gradient(145deg, #9B0060 0%, #CC0080 100%)",
    knobColor: "#FFB3E6",
    count: 134,
  },
  {
    street: "Bloom Blvd.",
    title: "The Vanity",
    tagline: "Beauty. Glow. You.",
    href: "/member/lobby/vanity",
    background: "linear-gradient(145deg, #FFF0F5 0%, #FFE0EC 100%)",
    knobColor: "#FF1F7D",
    count: 76,
    darkText: true,
    lightPanel: true,
  },
  {
    street: "Library Lane",
    title: "The Reading Room",
    tagline: "Books. Discuss. Share.",
    href: "/member/lobby/reading-room",
    background: "linear-gradient(145deg, #2C1808 0%, #4A2C14 100%)",
    knobColor: "#D4A853",
    count: 54,
  },
  {
    street: "Cinema Row",
    title: "The Screening Room",
    tagline: "Film. Watch. Review.",
    href: "/member/lobby/screening-room",
    background: "linear-gradient(145deg, #0A0A1A 0%, #1A1A3A 100%)",
    knobColor: "#C8A0FF",
    count: 38,
  },
  {
    street: "Press Row",
    title: "Magazine",
    tagline: "BloomBay Editorial.",
    href: "/member/lobby/magazine",
    background: "linear-gradient(145deg, #1A0010 0%, #2D0018 100%)",
    knobColor: "#FF1F7D",
    count: null,
  },
];

// ── Top Posts data ─────────────────────────────────────────────────────────────
const TOP_POSTS = [
  {
    room: "The Wall",
    roomHref: "/member/lobby/wall",
    user: "Aaliyah M.",
    initial: "A",
    color: "#FF1F7D",
    text: "Looking for a study partner in Brooklyn 📚 Anyone free this week?",
    blooms: 47,
  },
  {
    room: "The Closet",
    roomHref: "/member/lobby/closet",
    user: "Zara F.",
    initial: "Z",
    color: "#FF69B4",
    text: "Rate my fit for tonight's dinner — honest opinions only 🖤",
    blooms: 132,
  },
  {
    room: "The Shop",
    roomHref: "/member/lobby/shop",
    user: "Temi A.",
    initial: "T",
    color: "#A855F7",
    text: "Just launched my natural hair care line 🌿 Link in bio!",
    blooms: 89,
  },
  {
    room: "The Vanity",
    roomHref: "/member/lobby/vanity",
    user: "Sofia W.",
    initial: "S",
    color: "#E8A050",
    text: "My holy grail moisturiser routine for melanin skin ✨",
    blooms: 201,
  },
];

// ── LobbyDoor ──────────────────────────────────────────────────────────────────
function LobbyDoor({ door }: { door: DoorConfig }) {
  const panelBg    = door.lightPanel ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.13)";
  const textColor  = door.darkText ? "rgba(0,0,0,0.8)"   : "white";
  const labelColor = door.darkText ? "rgba(0,0,0,0.45)"  : "rgba(255,255,255,0.75)";

  return (
    <Link href={door.href} style={{ textDecoration: "none" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>

        {/* Street sign */}
        <div style={{ background: "rgba(0,0,0,0.28)", borderRadius: 4, padding: "2px 8px", border: "1px solid rgba(255,255,255,0.18)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, color: "rgba(255,255,255,0.75)", letterSpacing: "0.12em", whiteSpace: "nowrap" as const }}>{door.street.toUpperCase()}</p>
        </div>

        <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 5" }}>

          {/* The door shape */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: door.background,
            borderRadius: "50% 50% 8px 8px / 18% 18% 8px 8px",
            boxShadow: [
              "0 1px 0 rgba(0,0,0,0.45)",
              "0 3px 0 rgba(0,0,0,0.22)",
              "0 10px 28px rgba(0,0,0,0.22)",
              "inset 0 1px 0 rgba(255,255,255,0.45)",
              "inset 0 -2px 0 rgba(0,0,0,0.12)",
            ].join(", "),
            overflow: "hidden",
          }}>
            {/* Gloss overlay */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "44%",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.38) 0%, transparent 100%)",
              pointerEvents: "none", zIndex: 2,
            }} />

            {/* Inset decorative panel — carries the room name */}
            <div style={{
              position: "absolute",
              top: "14%", left: "11%", right: "11%", bottom: "22%",
              borderRadius: "38% 38% 5px 5px / 14% 14% 5px 5px",
              background: panelBg,
              border: "1.5px solid rgba(255,255,255,0.2)",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.18)",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 5px 10px",
              gap: 3,
            }}>
              <p style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 11,
                color: textColor,
                textAlign: "center",
                lineHeight: 1.15,
              }}>{door.title}</p>
              <p style={{
                fontFamily: "var(--font-jost)",
                fontSize: 6,
                fontWeight: 700,
                color: labelColor,
                textAlign: "center",
                letterSpacing: "0.04em",
                lineHeight: 1.3,
              }}>{door.tagline}</p>
            </div>

            {/* Knob / handle */}
            <div style={{
              position: "absolute", bottom: "24%", right: "17%",
              width: 9, height: 9, borderRadius: "50%",
              background: door.knobColor,
              boxShadow: "0 1px 4px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.5)",
              zIndex: 3,
            }} />

            {/* Activity count badge */}
            {door.count !== null && (
              <div style={{
                position: "absolute", top: 8, right: 8,
                background: PINK, borderRadius: 999,
                height: 18, minWidth: 18, paddingLeft: 9, paddingRight: 9,
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 4,
              }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, color: "white", lineHeight: 1 }}>{door.count}</span>
              </div>
            )}
          </div>
        </div>
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

// ── LobbyPage ──────────────────────────────────────────────────────────────────
export function LobbyPage() {
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
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,255,255,0.55)", marginTop: 8 }}>pick a door, enter a world</p>
        </div>
      </div>

      {/* ══ TOP POSTS — full-width horizontal scroll ═════════════════════════ */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 900, color: "rgba(255,255,255,0.7)", letterSpacing: "0.18em" }}>TOP POSTS</p>
          <Link href="/member/lobby/wall" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(255,255,255,0.38)" }}>all →</span>
          </Link>
        </div>
        <div className="lscroll" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 24px 8px", scrollbarWidth: "none" as const }}>
          {TOP_POSTS.map((post, i) => (
            <TopPostCard key={i} post={post} />
          ))}
        </div>
      </div>

      {/* ══ THE DOORS — horizontal scroll ═══════════════════════════════════ */}
      <div style={{ marginTop: 32 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 900, color: "white", letterSpacing: "0.22em", marginBottom: 14, padding: "0 24px" }}>THE AVENUE</p>
        <div className="lscroll" style={{ display: "flex", gap: 14, overflowX: "auto", padding: "0 24px 8px", scrollbarWidth: "none" as const }}>
          {DOORS.map((door) => (
            <div key={door.href} style={{ flexShrink: 0, width: 130 }}>
              <LobbyDoor door={door} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
