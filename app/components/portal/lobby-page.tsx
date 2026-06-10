"use client";

import Link from "next/link";
import { BBLogo } from "./bb-logo";

const PINK = "#FF0090";

// ── Door data ──────────────────────────────────────────────────────────────────
interface DoorConfig {
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
    title: "The Wall",
    tagline: "Post. Share. Vibe.",
    href: "/member/lobby/wall",
    background: "linear-gradient(145deg, #FF0090 0%, #E8007A 100%)",
    knobColor: "#FFD6EE",
    count: 247,
  },
  {
    title: "The Closet",
    tagline: "Style. Share. Swap.",
    href: "/member/lobby/closet",
    background: "linear-gradient(145deg, #FFB3D9 0%, #FF8EC7 100%)",
    knobColor: "#FF0090",
    count: 183,
  },
  {
    title: "Girl Meet",
    tagline: "Find your roommate.",
    href: "/member/lobby/girl-meet",
    background: "linear-gradient(145deg, #E8A050 0%, #C87830 100%)",
    knobColor: "#FFF0D0",
    count: 89,
  },
  {
    title: "The Shop",
    tagline: "Her brand. Her world.",
    href: "/member/lobby/shop",
    background: "linear-gradient(145deg, #9B0060 0%, #CC0080 100%)",
    knobColor: "#FFB3E6",
    count: 134,
  },
  {
    title: "The Book",
    tagline: "Book a woman.",
    href: "/member/lobby/book",
    background: "linear-gradient(145deg, #FFF0F5 0%, #FFE0EC 100%)",
    knobColor: "#FF0090",
    count: 61,
    darkText: true,
    lightPanel: true,
  },
  {
    title: "Magazine",
    tagline: "BloomBay Editorial.",
    href: "/member/lobby/magazine",
    background: "linear-gradient(145deg, #1A0010 0%, #2D0018 100%)",
    knobColor: "#FF0090",
    count: null,
  },
];

// ── LobbyDoor ──────────────────────────────────────────────────────────────────
function LobbyDoor({ door }: { door: DoorConfig }) {
  const panelBg = door.lightPanel
    ? "rgba(0,0,0,0.07)"
    : "rgba(255,255,255,0.13)";

  return (
    <Link href={door.href} style={{ textDecoration: "none" }}>
      {/* Outer wrapper — provides aspect ratio and positions label below door */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>

        {/* The door shape */}
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4.8",
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
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "44%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.38) 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }} />

          {/* Inset decorative panel */}
          <div style={{
            position: "absolute",
            top: "14%",
            left: "11%",
            right: "11%",
            bottom: "22%",
            borderRadius: "38% 38% 5px 5px / 14% 14% 5px 5px",
            background: panelBg,
            border: "1.5px solid rgba(255,255,255,0.2)",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.18)",
            zIndex: 1,
          }} />

          {/* Knob / handle */}
          <div style={{
            position: "absolute",
            bottom: "24%",
            right: "17%",
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: door.knobColor,
            boxShadow: "0 1px 4px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.5)",
            zIndex: 3,
          }} />

          {/* Activity count badge */}
          {door.count !== null && (
            <div style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: PINK,
              borderRadius: 999,
              height: 18,
              minWidth: 18,
              paddingLeft: 9,
              paddingRight: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 4,
            }}>
              <span style={{
                fontFamily: "var(--font-jost)",
                fontSize: 8,
                fontWeight: 800,
                color: "white",
                lineHeight: 1,
              }}>{door.count}</span>
            </div>
          )}
        </div>

        {/* Door label below */}
        <div style={{ textAlign: "center", paddingBottom: 4 }}>
          <p style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: 13,
            color: "white",
            lineHeight: 1.2,
            marginBottom: 2,
          }}>{door.title}</p>
          <p style={{
            fontFamily: "var(--font-jost)",
            fontSize: 8,
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.04em",
            lineHeight: 1.3,
          }}>{door.tagline}</p>
        </div>

      </div>
    </Link>
  );
}

// ── Sealed envelope / witness card ────────────────────────────────────────────
function SealedEnvelope() {
  return (
    <div style={{
      flexShrink: 0,
      width: 140,
      background: "#FFFFFF",
      borderRadius: 16,
      padding: 16,
      border: "1.5px solid rgba(255,0,144,0.12)",
      boxShadow: "0 4px 20px rgba(255,0,144,0.08)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
    }}>
      {/* Wax seal */}
      <div style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: `linear-gradient(145deg, ${PINK} 0%, #E8007A 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 10px rgba(255,0,144,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 20, lineHeight: 1 }}>✿</span>
      </div>

      <p style={{
        fontFamily: "var(--font-caveat)",
        fontSize: 13,
        color: "rgba(0,0,0,0.55)",
        textAlign: "center",
        lineHeight: 1.3,
      }}>From a witness</p>

      <p style={{
        fontFamily: "var(--font-jost)",
        fontSize: 8,
        fontWeight: 600,
        color: "rgba(0,0,0,0.3)",
        letterSpacing: "0.08em",
        textAlign: "center",
      }}>Tap to unseal</p>
    </div>
  );
}

// ── LobbyPage ──────────────────────────────────────────────────────────────────
export function LobbyPage() {
  return (
    <div style={{
      background: "linear-gradient(160deg, #FF0090 0%, #FF1F7D 45%, #FF5BAD 80%, #FFB3D9 100%)",
      minHeight: "100vh",
      paddingBottom: 104,
      overflowX: "hidden",
    }}>

      {/* ══ HEADER ═══════════════════════════════════════════════════════════════ */}
      <div style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 24px)",
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 32,
      }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <BBLogo size={22} light />
          <p style={{
            fontFamily: "var(--font-jost)",
            fontSize: 7,
            fontWeight: 700,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.2em",
          }}>WHERE WOMEN CONNECT</p>
        </div>

        {/* Title block */}
        <div style={{ marginTop: 20 }}>
          <p style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: 58,
            color: "white",
            lineHeight: 0.9,
          }}>LOBBY</p>
          <p style={{
            fontFamily: "var(--font-caveat)",
            fontSize: 16,
            color: "rgba(255,255,255,0.55)",
            marginTop: 8,
          }}>where women connect</p>
        </div>
      </div>

      {/* ══ THE DOORS ════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "20px 16px 0" }}>
        <p style={{
          fontFamily: "var(--font-jost)",
          fontSize: 8,
          fontWeight: 900,
          color: "white",
          letterSpacing: "0.22em",
        }}>THE DOORS</p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginTop: 14,
        }}>
          {DOORS.map((door) => (
            <LobbyDoor key={door.href} door={door} />
          ))}
        </div>
      </div>

      {/* ══ WITNESSES ════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "28px 16px 0" }}>
        <p style={{
          fontFamily: "var(--font-jost)",
          fontSize: 8,
          fontWeight: 900,
          color: PINK,
          letterSpacing: "0.22em",
        }}>WITNESSES</p>

        <p style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 22,
          color: "white",
          marginTop: 4,
          lineHeight: 1.2,
        }}>Notes from women who see you.</p>

        {/* Horizontal scroll of sealed envelopes */}
        <div style={{
          display: "flex",
          overflowX: "auto",
          gap: 12,
          paddingTop: 16,
          paddingBottom: 8,
          scrollbarWidth: "none",
        }}>
          <SealedEnvelope />
          <SealedEnvelope />
          <SealedEnvelope />

          {/* Empty state card */}
          <div style={{
            flexShrink: 0,
            width: 160,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 4,
            paddingLeft: 4,
          }}>
            <p style={{
              fontFamily: "var(--font-caveat)",
              fontSize: 14,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.4,
            }}>Your witnesses will appear here.</p>
            <p style={{
              fontFamily: "var(--font-jost)",
              fontSize: 8,
              fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.04em",
              lineHeight: 1.4,
            }}>Women who see and appreciate you.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
