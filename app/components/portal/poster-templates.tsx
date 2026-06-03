"use client";

import React from "react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────────────────────────

export type PosterTemplateType = "dinner" | "club" | "party" | "museum" | "walk" | "wellness";

export interface PosterData {
  id: number;
  template: PosterTemplateType;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  seatsLeft: number | string;
  hostName: string;
  imageUrl?: string;
  accentColor?: string;
  ctaLabel?: string;
  memberCount?: number;
  href?: string;
}

// ─── SVG Decorative Assets ───────────────────────────────────────────────────────

// Wax seal — irregular polygon, initials inside
function WaxSeal({ color = "#D4155C", size = 36, label = "BB" }: {
  color?: string; size?: number; label?: string;
}) {
  const s = size;
  const c = s / 2;
  const r = s * 0.46;
  // 16-point star polygon for seal edge
  const pts = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 16 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.84;
    return `${c + radius * Math.cos(angle)},${c + radius * Math.sin(angle)}`;
  }).join(" ");
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" style={{ flexShrink: 0 }}>
      <polygon points={pts} fill={color} />
      <circle cx={c} cy={c} r={r * 0.65} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
      <text
        x={c} y={c + s * 0.11}
        textAnchor="middle"
        fill="white"
        fontSize={s * 0.22}
        fontWeight="800"
        fontFamily="Georgia, 'Times New Roman', serif"
        letterSpacing="0.5"
      >{label}</text>
    </svg>
  );
}

// Leaf — botanical accent
function LeafAccent({ color = "#A8C4A0", size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 22 28" fill="none">
      <path d="M11 26 C7 19 2 15 2 9 C2 4.6 6.2 1.5 11 1.5 C15.8 1.5 20 4.6 20 9 C20 15 15 19 11 26Z" fill={color} opacity="0.5" />
      <line x1="11" y1="2" x2="11" y2="24" stroke={color} strokeWidth="0.8" opacity="0.65" />
      <line x1="11" y1="10" x2="7.5" y2="14" stroke={color} strokeWidth="0.6" opacity="0.5" />
      <line x1="11" y1="15" x2="14.5" y2="19" stroke={color} strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}

// Corner flourish — small flower at card corner
function CornerFlourish({ color = "rgba(255,255,255,0.22)", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <ellipse key={i} cx="8" cy="8" rx="1.2" ry="3.5" fill={color}
          transform={`rotate(${deg} 8 8) translate(0 -4)`} />
      ))}
      <circle cx="8" cy="8" r="1.5" fill={color} />
    </svg>
  );
}

// Stamp circle — circular text
function StampCircle({ text = "BLOOMBAY NYC ✦", size = 60, color = "rgba(255,255,255,0.45)" }: {
  text?: string; size?: number; color?: string;
}) {
  const r = size / 2 - 5;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <path id={`sp-${size}`}
          d={`M${size / 2},${size / 2} m-${r},0 a${r},${r} 0 1,1 ${r * 2},0 a${r},${r} 0 1,1 -${r * 2},0`} />
      </defs>
      <text fill={color} fontSize="6" letterSpacing="2.5" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="600">
        <textPath href={`#sp-${size}`}>{text}</textPath>
      </text>
    </svg>
  );
}

// Gallery rule — thin horizontal line
function GalleryRule({ dark = true }: { dark?: boolean }) {
  return <div style={{ height: "1px", background: dark ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.14)", margin: "10px 0" }} />;
}

// ─── Template 1: Dinner ─────────────────────────────────────────────────────────
// Mood: intimate, warm, candlelit, editorial
// Proportions: 2:3 portrait

export function DinnerPosterTemplate({ data }: { data: PosterData }) {
  const imgBg = data.imageUrl
    ? `url(${data.imageUrl})`
    : `linear-gradient(165deg, #180810 0%, #3A0C24 40%, #680F3A 75%, #8A1040 100%)`;

  const accent = data.accentColor || "#D4155C";

  return (
    <div style={{
      aspectRatio: "2 / 3",
      position: "relative",
      overflow: "hidden",
      borderRadius: "14px",
      background: imgBg,
      backgroundSize: "cover",
      backgroundPosition: "center",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Photo overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.06) 100%)",
      }} />

      {/* Inset border */}
      <div style={{
        position: "absolute", inset: "9px",
        border: "0.75px solid rgba(255,255,255,0.16)",
        borderRadius: "7px",
        pointerEvents: "none",
        zIndex: 2,
      }} />

      {/* Corner flourishes */}
      <div style={{ position: "absolute", top: 13, left: 13, zIndex: 3 }}><CornerFlourish /></div>
      <div style={{ position: "absolute", top: 13, right: 13, zIndex: 3, transform: "rotate(90deg)" }}><CornerFlourish /></div>

      {/* Top — date + seal */}
      <div style={{
        position: "absolute", top: 18, left: 18, right: 18,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        zIndex: 4,
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", lineHeight: 1.2 }}>
            {data.date}
          </p>
          <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "7.5px", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: "2px" }}>
            {data.time}
          </p>
        </div>
        <WaxSeal color={accent} size={34} label="BB" />
      </div>

      {/* Bottom content */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 18px 18px", zIndex: 4 }}>
        <p style={{ color: accent, fontSize: "8px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "5px" }}>
          ✦ {data.category}
        </p>
        <h3 style={{
          fontFamily: "var(--font-playfair, Georgia, serif)",
          fontSize: "clamp(18px, 2.2vw, 24px)",
          fontWeight: 900,
          color: "white",
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
          marginBottom: "10px",
        }}>
          {data.title}
        </h3>

        {/* Perforation */}
        <div style={{ borderTop: "1px dashed rgba(255,255,255,0.16)", margin: "8px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "9.5px" }}>{data.location}</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "9.5px" }}>{data.seatsLeft} seats</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "8.5px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {data.hostName}
          </p>
          <span style={{
            background: accent,
            color: "white",
            fontSize: "9.5px",
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: "20px",
            letterSpacing: "0.04em",
          }}>
            {data.ctaLabel || "Reserve →"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Template 2: Club ───────────────────────────────────────────────────────────
// Mood: identity, belonging, membership
// Proportions: 4:5

export function ClubPosterTemplate({ data }: { data: PosterData }) {
  const accent = data.accentColor || "#D4155C";
  const darkAccent = accent + "DD";
  const initials = data.title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

  return (
    <div style={{
      aspectRatio: "4 / 5",
      position: "relative",
      overflow: "hidden",
      borderRadius: "14px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      background: `linear-gradient(165deg, ${accent} 0%, ${darkAccent} 100%)`,
    }}>
      {/* Decorative radial glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
      }} />

      {/* Outer inset border */}
      <div style={{
        position: "absolute", inset: "8px",
        border: "0.75px solid rgba(255,255,255,0.2)",
        borderRadius: "8px",
        pointerEvents: "none",
      }} />

      {/* Upper 55%: crest area */}
      <div style={{
        flex: "0 0 55%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}>
        <StampCircle size={72} color="rgba(255,255,255,0.35)" />
        <div style={{ position: "absolute" }}>
          <WaxSeal color="rgba(0,0,0,0.25)" size={52} label={initials} />
        </div>
        <p style={{
          color: "rgba(255,255,255,0.88)",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          marginTop: "10px",
          textAlign: "center",
        }}>
          {data.category}
        </p>
      </div>

      {/* Lower 45%: info */}
      <div style={{
        flex: "0 0 45%",
        background: "rgba(0,0,0,0.28)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 20px 14px",
      }}>
        <GalleryRule dark={false} />
        <h3 style={{
          fontFamily: "var(--font-playfair, Georgia, serif)",
          fontSize: "clamp(15px, 1.8vw, 20px)",
          fontWeight: 900,
          color: "white",
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
          marginBottom: "6px",
          textAlign: "center",
        }}>
          {data.title}
        </h3>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "9px", textAlign: "center", marginBottom: "10px" }}>
          {data.memberCount ? `${data.memberCount} members · ` : ""}{data.location}
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{
            border: "1px solid rgba(255,255,255,0.45)",
            color: "rgba(255,255,255,0.88)",
            fontSize: "9.5px",
            fontWeight: 700,
            padding: "5px 16px",
            borderRadius: "20px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            {data.ctaLabel || "View Club →"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Template 3: Party ──────────────────────────────────────────────────────────
// Mood: bold, nightlife, high contrast
// Proportions: 3:4

export function PartyPosterTemplate({ data }: { data: PosterData }) {
  const accent = data.accentColor || "#D4155C";
  const imgBg = data.imageUrl
    ? `url(${data.imageUrl})`
    : "#0A0A0A";

  return (
    <div style={{
      aspectRatio: "3 / 4",
      position: "relative",
      overflow: "hidden",
      borderRadius: "14px",
      background: imgBg,
      backgroundSize: "cover",
      backgroundPosition: "center",
      cursor: "pointer",
    }}>
      {/* Strong dark overlay */}
      {data.imageUrl && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)" }} />
      )}

      {/* Accent color bar at top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "5px", background: accent }} />

      {/* Category stamp */}
      <div style={{
        position: "absolute", top: 20, left: 18,
        display: "flex", alignItems: "center", gap: "6px",
      }}>
        <div style={{ width: "20px", height: "1px", background: accent }} />
        <p style={{ color: accent, fontSize: "9px", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" }}>
          {data.category}
        </p>
      </div>

      <div style={{ position: "absolute", top: 18, right: 16 }}>
        <WaxSeal color={accent} size={28} label="BB" />
      </div>

      {/* GIANT TITLE — center of card */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "18px",
        right: "18px",
        transform: "translateY(-50%)",
      }}>
        <h2 style={{
          fontFamily: "var(--font-playfair, Georgia, serif)",
          fontSize: "clamp(28px, 3.5vw, 44px)",
          fontWeight: 900,
          color: "white",
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
        }}>
          {data.title}
        </h2>
      </div>

      {/* Date large */}
      <div style={{
        position: "absolute",
        top: "55%",
        left: "18px",
        right: "18px",
      }}>
        <p style={{
          color: accent,
          fontSize: "clamp(18px, 2.2vw, 26px)",
          fontWeight: 800,
          fontFamily: "var(--font-instrument, Georgia, serif)",
          fontStyle: "italic",
        }}>
          {data.date}
        </p>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px", marginTop: "3px" }}>
          {data.time}
        </p>
      </div>

      {/* Bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 18px 16px",
      }}>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px" }}>{data.location}</p>
              <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "8.5px" }}>{data.hostName}</p>
            </div>
            <span style={{
              background: accent,
              color: "white",
              fontSize: "9.5px",
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: "20px",
            }}>
              {data.ctaLabel || "I'm going →"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Template 4: Museum ─────────────────────────────────────────────────────────
// Mood: cultural, gallery, refined
// Proportions: 3:4 with lots of negative space

export function MuseumPosterTemplate({ data }: { data: PosterData }) {
  const accent = data.accentColor || "#2A4A6B";
  const bg = "#FDFAF5";

  return (
    <div style={{
      aspectRatio: "3 / 4",
      position: "relative",
      overflow: "hidden",
      borderRadius: "14px",
      background: bg,
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Thin outer border */}
      <div style={{
        position: "absolute", inset: "8px",
        border: "0.75px solid rgba(0,0,0,0.1)",
        borderRadius: "8px",
        pointerEvents: "none",
        zIndex: 2,
      }} />

      {/* TOP: Typography breathing space */}
      <div style={{ padding: "22px 20px 0", flex: "0 0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <div style={{ width: "14px", height: "1px", background: "rgba(0,0,0,0.25)" }} />
          <p style={{ color: "rgba(0,0,0,0.38)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" }}>
            {data.category}
          </p>
        </div>
        <p style={{ color: "rgba(0,0,0,0.55)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {data.hostName}
        </p>
      </div>

      {/* MIDDLE: Image frame */}
      <div style={{
        flex: "0 0 40%",
        margin: "14px 20px",
        position: "relative",
        overflow: "hidden",
        borderRadius: "4px",
        background: data.imageUrl ? undefined : `linear-gradient(135deg, ${accent}18 0%, ${accent}30 100%)`,
        backgroundImage: data.imageUrl ? `url(${data.imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        {!data.imageUrl && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "40px", height: "40px", border: `1px solid ${accent}40`, borderRadius: "50%", margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "14px", color: accent, opacity: 0.4 }}>◈</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM: Title + meta */}
      <div style={{ flex: 1, padding: "0 20px 18px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "10px" }}>
          <h3 style={{
            fontFamily: "var(--font-playfair, Georgia, serif)",
            fontSize: "clamp(16px, 1.8vw, 20px)",
            fontWeight: 700,
            fontStyle: "italic",
            color: "#111111",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            marginBottom: "8px",
          }}>
            {data.title}
          </h3>
          <p style={{ color: "rgba(0,0,0,0.38)", fontSize: "9px", marginBottom: "2px" }}>
            {data.date} · {data.time}
          </p>
          <p style={{ color: "rgba(0,0,0,0.38)", fontSize: "9px", marginBottom: "12px" }}>
            {data.location}
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "rgba(0,0,0,0.3)", fontSize: "8.5px" }}>{data.seatsLeft} seats</p>
            <span style={{
              border: `1px solid ${accent}`,
              color: accent,
              fontSize: "9.5px",
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: "20px",
              letterSpacing: "0.06em",
            }}>
              {data.ctaLabel || "Get ticket →"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Template 5: Walk ───────────────────────────────────────────────────────────
// Mood: soft, outdoors, city morning
// Proportions: 5:6

export function WalkPosterTemplate({ data }: { data: PosterData }) {
  const accent = data.accentColor || "#4A7A5C";
  const bg = data.imageUrl
    ? `url(${data.imageUrl})`
    : `linear-gradient(180deg, #C8DDD0 0%, #A8C4B0 100%)`;

  return (
    <div style={{
      aspectRatio: "5 / 6",
      position: "relative",
      overflow: "hidden",
      borderRadius: "14px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Top photo area — 48% */}
      <div style={{
        flex: "0 0 48%",
        background: bg,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}>
        {/* Soft bottom gradient fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
          background: "linear-gradient(transparent, #F0F5F0)",
        }} />
        {/* Date tag */}
        <div style={{
          position: "absolute", top: 14, left: 14,
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(8px)",
          borderRadius: "20px",
          padding: "4px 10px",
        }}>
          <p style={{ color: accent, fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            {data.date}
          </p>
        </div>
        {/* Category — top right */}
        <div style={{ position: "absolute", top: 14, right: 14 }}>
          <WaxSeal color={accent} size={28} label="↟" />
        </div>
      </div>

      {/* Bottom content — 52% */}
      <div style={{
        flex: 1,
        background: "#F0F5F0",
        padding: "10px 16px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <LeafAccent color={accent} size={14} />
            <p style={{ color: accent, fontSize: "8px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              {data.category}
            </p>
          </div>
          <h3 style={{
            fontFamily: "var(--font-playfair, Georgia, serif)",
            fontSize: "clamp(15px, 1.8vw, 19px)",
            fontWeight: 700,
            color: "#1A2E1E",
            lineHeight: 1.1,
            marginBottom: "5px",
          }}>
            {data.title}
          </h3>
          <p style={{ color: "rgba(30,50,30,0.48)", fontSize: "9.5px" }}>
            {data.time} · {data.location}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ color: "rgba(30,50,30,0.36)", fontSize: "8.5px" }}>
            {data.hostName} · {data.seatsLeft} spots
          </p>
          <span style={{
            background: accent,
            color: "white",
            fontSize: "9px",
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: "20px",
          }}>
            {data.ctaLabel || "Join →"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Template 6: Wellness ───────────────────────────────────────────────────────
// Mood: calm, restorative, soft
// Proportions: 2:3

export function WellnessPosterTemplate({ data }: { data: PosterData }) {
  const accent = data.accentColor || "#8B6A8C";
  const imgBg = data.imageUrl
    ? `url(${data.imageUrl})`
    : `linear-gradient(165deg, #E8D5E8 0%, #D4C0D4 50%, #BFA8BF 100%)`;

  return (
    <div style={{
      aspectRatio: "2 / 3",
      position: "relative",
      overflow: "hidden",
      borderRadius: "14px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      background: "#FAF5FA",
    }}>
      {/* Top photo area — 42% */}
      <div style={{
        flex: "0 0 42%",
        background: imgBg,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}>
        {/* Very soft fade to card background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 50%, rgba(250,245,250,0.7) 85%, #FAF5FA 100%)",
        }} />
        {/* Tiny category pill */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(8px)",
          borderRadius: "20px",
          padding: "3px 9px",
        }}>
          <p style={{ color: accent, fontSize: "7.5px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            {data.category}
          </p>
        </div>
      </div>

      {/* Thin accent separator */}
      <div style={{ height: "2px", background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }} />

      {/* Content */}
      <div style={{ flex: 1, padding: "14px 16px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: `${accent}88`, fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "5px" }}>
            {data.hostName}
          </p>
          <h3 style={{
            fontFamily: "var(--font-playfair, Georgia, serif)",
            fontSize: "clamp(16px, 1.8vw, 20px)",
            fontWeight: 700,
            color: "#2A1A2A",
            lineHeight: 1.1,
            fontStyle: "italic",
            marginBottom: "6px",
          }}>
            {data.title}
          </h3>
          <p style={{ color: "rgba(42,26,42,0.42)", fontSize: "9.5px", lineHeight: 1.5 }}>
            {data.date} · {data.time}
          </p>
          <p style={{ color: "rgba(42,26,42,0.38)", fontSize: "9px" }}>
            {data.location}
          </p>
        </div>

        <div>
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "rgba(42,26,42,0.35)", fontSize: "8.5px" }}>
              {typeof data.seatsLeft === "number" ? `${data.seatsLeft} seats left` : data.seatsLeft}
            </p>
            <span style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}CC)`,
              color: "white",
              fontSize: "9px",
              fontWeight: 700,
              padding: "5px 13px",
              borderRadius: "20px",
              boxShadow: `0 3px 10px ${accent}44`,
            }}>
              {data.ctaLabel || "Reserve →"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dispatcher ─────────────────────────────────────────────────────────────────

export function PosterCard({ data, className = "", style = {} }: {
  data: PosterData;
  className?: string;
  style?: React.CSSProperties;
}) {
  const href = data.href || "/member/happenings";
  const card = (
    <div className={className} style={style}>
      {data.template === "dinner"   && <DinnerPosterTemplate   data={data} />}
      {data.template === "club"     && <ClubPosterTemplate     data={data} />}
      {data.template === "party"    && <PartyPosterTemplate    data={data} />}
      {data.template === "museum"   && <MuseumPosterTemplate   data={data} />}
      {data.template === "walk"     && <WalkPosterTemplate     data={data} />}
      {data.template === "wellness" && <WellnessPosterTemplate data={data} />}
    </div>
  );
  return <Link href={href} style={{ textDecoration: "none", display: "block" }}>{card}</Link>;
}

// ─── Sample Data ─────────────────────────────────────────────────────────────────

export const SAMPLE_POSTERS: PosterData[] = [
  {
    id: 1,
    template: "dinner",
    title: "Girls Dinner · Carbone",
    category: "Supper Club",
    date: "Tonight · Fri",
    time: "7:30 PM",
    location: "Carbone, SoHo",
    seatsLeft: 2,
    hostName: "Aminah C.",
    accentColor: "#D4155C",
    ctaLabel: "Reserve seat →",
    href: "/member/happenings/1",
  },
  {
    id: 2,
    template: "walk",
    title: "Sunday Morning Walk",
    category: "Outdoors",
    date: "Sunday · 9AM",
    time: "9:00 AM",
    location: "Prospect Park, BK",
    seatsLeft: "Open",
    hostName: "Girls Who Move",
    accentColor: "#4A7A5C",
    ctaLabel: "Join the walk →",
    href: "/member/happenings/2",
  },
  {
    id: 3,
    template: "museum",
    title: "After Hours: Women in Motion",
    category: "Exhibition",
    date: "Saturday",
    time: "6:00 PM",
    location: "Brooklyn Museum",
    seatsLeft: 4,
    hostName: "Museum Girls Club",
    accentColor: "#2A4A6B",
    ctaLabel: "Get ticket →",
    href: "/member/happenings/3",
  },
  {
    id: 4,
    template: "party",
    title: "Afrobeats Night",
    category: "Nightlife",
    date: "Saturday",
    time: "10:00 PM",
    location: "SOB's, West Village",
    seatsLeft: 6,
    hostName: "African Girls Club",
    accentColor: "#D4155C",
    ctaLabel: "I'm going →",
    href: "/member/happenings/4",
  },
  {
    id: 5,
    template: "wellness",
    title: "Pilates & Matcha Morning",
    category: "Wellness",
    date: "Sunday · Oct 6",
    time: "9:00 AM",
    location: "Studio Bloom, WBurg",
    seatsLeft: 3,
    hostName: "Sofia K.",
    accentColor: "#8B6A8C",
    ctaLabel: "Reserve →",
    href: "/member/happenings/5",
  },
  {
    id: 6,
    template: "club",
    title: "Soft Life Club NYC",
    category: "Lifestyle",
    date: "Ongoing",
    time: "—",
    location: "NYC · Members only",
    seatsLeft: "Open",
    hostName: "Soft Life Club",
    accentColor: "#C41856",
    memberCount: 124,
    ctaLabel: "View Club →",
    href: "/member/clubs/1",
  },
  {
    id: 7,
    template: "dinner",
    title: "Jollof + Movie Night",
    category: "Dinner",
    date: "Friday · Nov 8",
    time: "7:00 PM",
    location: "Bed-Stuy, BK",
    seatsLeft: 3,
    hostName: "Kemi A.",
    accentColor: "#9E1A46",
    ctaLabel: "Reserve seat →",
    href: "/member/happenings/7",
  },
  {
    id: 8,
    template: "party",
    title: "BloomBay Launch Night",
    category: "Celebration",
    date: "Fri Nov 15",
    time: "9:00 PM",
    location: "Elsewhere, BK",
    seatsLeft: 12,
    hostName: "BloomBay",
    accentColor: "#D4155C",
    ctaLabel: "Get on the list →",
    href: "/member/happenings/8",
  },
];

// ─── Demo Grid ──────────────────────────────────────────────────────────────────

export function PosterDemoGrid() {
  return (
    <div style={{ padding: "40px 32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.26em", color: "var(--bb-pink)", textTransform: "uppercase", marginBottom: "4px" }}>
          ✦ TEMPLATE SYSTEM
        </p>
        <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "28px", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.01em" }}>
          BloomBay Poster Templates
        </h2>
        <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
          6 templates · every event is a designed object
        </p>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 260px))",
        gap: "20px",
        justifyContent: "start",
      }}>
        {SAMPLE_POSTERS.map(p => <PosterCard key={p.id} data={p} />)}
      </div>
    </div>
  );
}
