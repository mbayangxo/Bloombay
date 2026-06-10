"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Design Tokens ────────────────────────────────────────────────────────────

const PINK = "#FF1F7D";

// ─── SVG Textures ─────────────────────────────────────────────────────────────

const NOISE_DARK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' fill='%23fff' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;
const NOISE_LIGHT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;
const LINEN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08 0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='80' height='80' fill='%23000' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

// ─── Palette Types ────────────────────────────────────────────────────────────

type Swatch = {
  hex: string;
  name: string;
};

type Palette = {
  name: string;
  mastBg: string;
  pageBg: string;
  mastGrad: string;
  accent: string;
  accent2: string;
  accentGrad: string;
  heading: string;
  text: string;
  sub: string;
  cardBg: string;
  cardBg2: string;
  cardBorder: string;
  dark: boolean;
  emoji: string;
  tagline: string;
  swatches: Swatch[];
};

// ─── Palette Data ─────────────────────────────────────────────────────────────

const PALETTES: Palette[] = [
  {
    name: "Botanical",
    mastBg: "#0E0C08",
    pageBg: "#1A160E",
    mastGrad: "linear-gradient(135deg, #0E0C08 0%, #1A1608 60%, #120E08 100%)",
    accent: "#B5B84A",
    accent2: "#B5566A",
    accentGrad: "linear-gradient(135deg, #B5B84A, #7A8A18)",
    heading: "#E4D8B0",
    text: "#D4C4A0",
    sub: "#9BA8C4",
    cardBg: "#1E190E",
    cardBg2: "#160E0A",
    cardBorder: "rgba(181,184,74,0.2)",
    dark: true,
    emoji: "🌿",
    tagline: "earthy, wild & grounded",
    swatches: [
      { hex: "#6B6B2A", name: "Grassland" },
      { hex: "#9BA8C4", name: "Bluebell" },
      { hex: "#3D1A20", name: "Espresso" },
      { hex: "#B5566A", name: "Berry" },
      { hex: "#B5B84A", name: "Chartreuse" },
      { hex: "#7A1028", name: "Grape Fizz" },
    ],
  },
  {
    name: "French Rose",
    mastBg: "#0E0D0E",
    pageBg: "#1C1B1C",
    mastGrad: "linear-gradient(135deg, #0E0D0E 0%, #1E0812 60%, #0E0D0E 100%)",
    accent: "#FC4E88",
    accent2: "#F79EAF",
    accentGrad: "linear-gradient(135deg, #FC4E88, #B70239)",
    heading: "#DADCDF",
    text: "#DADCDF",
    sub: "#F79EAF",
    cardBg: "#221020",
    cardBg2: "#1A0812",
    cardBorder: "rgba(252,78,136,0.22)",
    dark: true,
    emoji: "🌹",
    tagline: "bold, passionate & fierce",
    swatches: [
      { hex: "#DADCDF", name: "Cumberland Fog" },
      { hex: "#F79EAF", name: "Sweet 60" },
      { hex: "#FC4E88", name: "French Rose" },
      { hex: "#B70239", name: "Warlock Red" },
      { hex: "#D4170E", name: "Hot Flamin Chilli" },
      { hex: "#65011A", name: "Claret" },
      { hex: "#1C1B1C", name: "Eerie Black" },
    ],
  },
  {
    name: "Metallic Blush",
    mastBg: "#4A202A",
    pageBg: "#FAF3F1",
    mastGrad: "linear-gradient(135deg, #3A161E 0%, #4A202A 50%, #381420 100%)",
    accent: "#D86487",
    accent2: "#EEAAC3",
    accentGrad: "linear-gradient(135deg, #D86487, #76172C)",
    heading: "#4A202A",
    text: "#4A202A",
    sub: "#76172C",
    cardBg: "#FDEEF4",
    cardBg2: "#F5E6EC",
    cardBorder: "rgba(216,100,135,0.2)",
    dark: false,
    emoji: "🌸",
    tagline: "soft, luxurious & feminine",
    swatches: [
      { hex: "#4A202A", name: "Brown Coffee" },
      { hex: "#D86487", name: "Blush" },
      { hex: "#EEAAC3", name: "Metallic Pink" },
      { hex: "#F1DFDD", name: "Pale Pink" },
      { hex: "#76172C", name: "Claret" },
    ],
  },
  {
    name: "Raspberry Ombré",
    mastBg: "#BD1946",
    pageBg: "#FEF6F8",
    mastGrad: "linear-gradient(135deg, #9C1038 0%, #BD1946 50%, #A81040 100%)",
    accent: "#E2275B",
    accent2: "#EE819F",
    accentGrad: "linear-gradient(135deg, #E2275B, #BD1946)",
    heading: "#7A0A22",
    text: "#4A0A1A",
    sub: "#E2275B",
    cardBg: "#FFF0F4",
    cardBg2: "#FFE4EC",
    cardBorder: "rgba(226,39,91,0.18)",
    dark: false,
    emoji: "🫐",
    tagline: "fresh, romantic & playful",
    swatches: [
      { hex: "#BD1946", name: "Raspberry" },
      { hex: "#E2275B", name: "Hot Pink" },
      { hex: "#E8547D", name: "Medium Rose" },
      { hex: "#EE819F", name: "Soft Pink" },
      { hex: "#F4AEC1", name: "Light Pink" },
      { hex: "#FAD8E3", name: "Blush" },
    ],
  },
];

// ─── HomeMockup ───────────────────────────────────────────────────────────────

function HomeMockup({ p }: { p: Palette }) {
  const SHIMMER = `repeating-linear-gradient(-45deg, transparent 0px, transparent 12px, rgba(255,255,255,0.018) 12px, rgba(255,255,255,0.018) 13px)`;
  const METALLIC_RULE = `linear-gradient(90deg, transparent, ${p.accent}66, rgba(212,168,83,0.5), ${p.accent}66, transparent)`;
  const noiseImg = p.dark ? NOISE_DARK : NOISE_LIGHT;

  return (
    <div
      style={{
        background: p.pageBg,
        backgroundImage: noiseImg,
        backgroundSize: p.dark ? "160px 160px" : "200px 200px",
        width: "100%",
        fontFamily: "var(--font-jost)",
        overflow: "hidden",
      }}
    >
      {/* ── Masthead ── */}
      <div
        style={{
          background: p.mastGrad,
          backgroundImage: `${SHIMMER}, ${p.mastGrad}`,
          backgroundSize: "auto, auto",
          position: "relative",
          padding: "10px 12px 8px",
          overflow: "hidden",
        }}
      >
        {/* Noise overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: NOISE_DARK,
            backgroundSize: "160px 160px",
            pointerEvents: "none",
          }}
        />
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 120%, ${p.accent}22 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        {/* Top accent rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundImage: METALLIC_RULE,
            opacity: 0.9,
          }}
        />
        {/* Bottom accent rule */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundImage: METALLIC_RULE,
            opacity: 0.7,
          }}
        />

        {/* Masthead row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Logo */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontWeight: 900,
                fontSize: 14,
                color: p.accent,
                letterSpacing: "0.02em",
              }}
            >
              BB ✿
            </span>
          </div>

          {/* Date */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "6px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: `${p.heading}99`,
                textTransform: "uppercase",
              }}
            >
              MON · 9 JUN
            </p>
          </div>

          {/* Bell */}
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: `1px solid ${p.accent}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${p.accent}11`,
            }}
          >
            <span style={{ fontSize: 9 }}>🔔</span>
          </div>
        </div>
      </div>

      {/* ── Greeting ── */}
      <div
        style={{
          padding: "10px 12px 8px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        {/* Text */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "6px",
              fontWeight: 800,
              letterSpacing: "0.22em",
              color: p.accent,
              marginBottom: 3,
            }}
          >
            GOOD EVENING
          </p>
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 800,
              fontSize: 12,
              color: p.heading,
              lineHeight: 1.15,
              marginBottom: 6,
            }}
          >
            Good evening,{" "}
            <span style={{ color: p.accent }}>there.</span>{" "}
            <span style={{ color: p.accent2 }}>♡</span>
          </p>

          {/* Vibe pills */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {["🌃 NYC tonight", "✦ soft life"].map((label) => (
              <div
                key={label}
                style={{
                  background: `${p.accent}18`,
                  border: `1px solid ${p.accent}33`,
                  borderRadius: 999,
                  padding: "2px 6px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "5.5px",
                    fontWeight: 700,
                    color: p.sub,
                    letterSpacing: "0.06em",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mini polaroid */}
        <div
          style={{
            flexShrink: 0,
            background: `linear-gradient(145deg, ${p.accent} 0%, ${p.accent2} 100%)`,
            width: 44,
            height: 52,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 3px 12px ${p.accent}44`,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 900,
              fontSize: 18,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            ?
          </span>
        </div>
      </div>

      {/* ── Calendar Strip ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundImage: `${noiseImg}, ${LINEN}`,
          backgroundSize: p.dark ? "160px 160px, 80px 80px" : "200px 200px, 80px 80px",
          backgroundColor: `${p.accent}0A`,
          borderTop: `1px solid ${p.accent}18`,
          borderBottom: `1px solid ${p.accent}18`,
          padding: "5px 12px",
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => {
          const isMon = i === 1;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: "5px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: isMon ? p.accent : `${p.heading}55`,
                }}
              >
                {day}
              </span>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isMon ? p.accent : "transparent",
                  boxShadow: isMon ? `0 1px 6px ${p.accent}55` : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "7px",
                    fontWeight: 800,
                    color: isMon ? "white" : `${p.heading}66`,
                  }}
                >
                  {[8, 9, 10, 11, 12, 13, 14][i]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3 Mini Cards ── */}
      <div
        style={{
          display: "flex",
          gap: 5,
          padding: "8px 10px 4px",
        }}
      >
        {[
          { label: "MY FIRST MONTH", title: "⭐ Week 1", sub: "Join 3 clubs" },
          { label: "THIS WEEK", title: "2 events", sub: "near you" },
          { label: "CITY VIBES", title: "Crown Heights", sub: "9 spots" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              flex: 1,
              backgroundImage: `${noiseImg}, ${LINEN}`,
              backgroundSize: p.dark ? "160px 160px, 80px 80px" : "200px 200px, 80px 80px",
              backgroundColor: p.cardBg,
              border: `1px solid ${p.cardBorder}`,
              borderRadius: 10,
              padding: "8px 7px 7px",
              minHeight: 58,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "5px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: p.accent,
                marginBottom: 3,
              }}
            >
              {card.label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontWeight: 900,
                fontSize: 8,
                color: p.heading,
                lineHeight: 1.3,
              }}
            >
              {card.title}
            </p>
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "5px",
                color: `${p.text}88`,
                marginTop: 2,
              }}
            >
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Tonight Card ── */}
      <div style={{ padding: "6px 10px 10px" }}>
        <div
          style={{
            background: p.mastGrad,
            backgroundImage: `${NOISE_DARK}, ${SHIMMER}, ${p.mastGrad}`,
            backgroundSize: "160px 160px, auto, auto",
            borderRadius: 10,
            padding: "10px 12px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Radial accent glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 85% 15%, ${p.accent}30 0%, transparent 55%)`,
              pointerEvents: "none",
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "5.5px",
              fontWeight: 800,
              letterSpacing: "0.16em",
              color: `${p.accent}CC`,
              position: "relative",
              marginBottom: 3,
            }}
          >
            7:30 PM · WEST VILLAGE
          </p>
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 900,
              fontSize: 13,
              color: p.accent2,
              lineHeight: 1.15,
              position: "relative",
              marginBottom: 7,
            }}
          >
            Girls Dinner
            <br />
            Carbone
          </p>
          <div
            style={{
              display: "inline-flex",
              background: p.accent,
              borderRadius: 999,
              padding: "4px 10px",
              position: "relative",
              boxShadow: `0 2px 8px ${p.accent}55`,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "6px",
                fontWeight: 800,
                color: "white",
                letterSpacing: "0.07em",
              }}
            >
              I&apos;M IN →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ColorwaysPage ────────────────────────────────────────────────────────────

export default function ColorwaysPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const p = PALETTES[activeIdx];

  const SHIMMER = `repeating-linear-gradient(-45deg, transparent 0px, transparent 12px, rgba(255,255,255,0.018) 12px, rgba(255,255,255,0.018) 13px)`;

  return (
    <div
      style={{
        background: "#0C0A0B",
        backgroundImage: NOISE_DARK,
        backgroundSize: "160px 160px",
        minHeight: "100vh",
        paddingBottom: 100,
        overflowX: "hidden",
      }}
    >
      {/* ══════════════════════════ HEADER ══════════════════════════ */}
      <div
        style={{
          padding: "56px 24px 20px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: "7px",
            fontWeight: 800,
            letterSpacing: "0.28em",
            color: PINK,
            marginBottom: 10,
          }}
        >
          ✦ CHOOSE YOUR PALETTE ✦
        </p>
        <p
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: 26,
            color: "white",
            lineHeight: 1.12,
            marginBottom: 10,
          }}
        >
          Your Look,
          <br />
          Your Bloombay
        </p>
        <p
          style={{
            fontFamily: "var(--font-caveat)",
            fontSize: 17,
            color: "rgba(255,255,255,0.38)",
            lineHeight: 1.4,
          }}
        >
          pick the palette that speaks to your soul ♡
        </p>
      </div>

      {/* ══════════════════════════ TAB CHIPS ══════════════════════════ */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "0 20px 20px",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {PALETTES.map((pal, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={pal.name}
              onClick={() => setActiveIdx(i)}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "8px 14px",
                borderRadius: 999,
                border: isActive
                  ? `1px solid ${pal.accent}55`
                  : "1px solid rgba(255,255,255,0.1)",
                background: isActive
                  ? pal.accent
                  : "rgba(255,255,255,0.07)",
                boxShadow: isActive
                  ? `0 0 16px ${pal.accent}55, 0 2px 8px rgba(0,0,0,0.3)`
                  : "none",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              <span style={{ fontSize: 13 }}>{pal.emoji}</span>
              <span
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: "9px",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: isActive ? "white" : "rgba(255,255,255,0.6)",
                  whiteSpace: "nowrap",
                }}
              >
                {pal.name.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════ PALETTE INFO CARD ══════════════════════════ */}
      <div style={{ padding: "0 20px 16px" }}>
        <div
          style={{
            background: p.mastGrad,
            backgroundImage: `${NOISE_DARK}, ${SHIMMER}, ${p.mastGrad}`,
            backgroundSize: "160px 160px, auto, auto",
            borderRadius: 18,
            padding: "18px 18px 16px",
            border: `1px solid ${p.cardBorder}`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${p.accent}22`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at 80% 20%, ${p.accent}1A 0%, transparent 60%)`,
              pointerEvents: "none",
            }}
          />

          {/* Name + tagline */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              marginBottom: 14,
              position: "relative",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontWeight: 900,
                fontSize: 20,
                color: p.accent,
                lineHeight: 1,
              }}
            >
              {p.name}
            </p>
            <p
              style={{
                fontFamily: "var(--font-caveat)",
                fontSize: 14,
                color: `${p.heading}99`,
              }}
            >
              {p.tagline}
            </p>
          </div>

          {/* Swatches */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              position: "relative",
            }}
          >
            {p.swatches.map((sw) => (
              <div
                key={sw.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: sw.hex,
                    boxShadow: `0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08)`,
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "6px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: `${p.heading}88`,
                    textAlign: "center",
                    maxWidth: 36,
                    lineHeight: 1.3,
                  }}
                >
                  {sw.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════ HOME MOCKUP ══════════════════════════ */}
      <div style={{ padding: "0 20px 20px" }}>
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: "7px",
            fontWeight: 800,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.28)",
            marginBottom: 10,
            textTransform: "uppercase",
          }}
        >
          Live Preview
        </p>
        <div
          style={{
            borderRadius: 22,
            overflow: "hidden",
            boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${p.accent}33`,
          }}
        >
          <HomeMockup p={p} />
        </div>
      </div>

      {/* ══════════════════════════ CTA BUTTON ══════════════════════════ */}
      <div style={{ padding: "0 20px 16px" }}>
        <button
          style={{
            width: "100%",
            padding: "18px 24px",
            borderRadius: 999,
            border: "none",
            background: p.accentGrad,
            backgroundImage: `${NOISE_DARK}, ${p.accentGrad}`,
            backgroundSize: "160px 160px, auto",
            cursor: "pointer",
            boxShadow: `0 8px 28px ${p.accent}55, 0 2px 8px rgba(0,0,0,0.3)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "13px",
              fontWeight: 900,
              letterSpacing: "0.18em",
              color: "white",
            }}
          >
            ✦ CHOOSE {p.name.toUpperCase()}
          </span>
        </button>
      </div>

      {/* ══════════════════════════ BACK LINK ══════════════════════════ */}
      <div style={{ padding: "4px 20px 0", textAlign: "center" }}>
        <Link
          href="/member/home"
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.28)",
            textDecoration: "none",
          }}
        >
          ← BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
