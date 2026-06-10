// Shared scrapbook / collage UI elements — all CSS/SVG, no images required.

import React from "react";

// ─── Tape ─────────────────────────────────────────────────────────────────────
// Translucent yellow tape strip with a glossy highlight stripe.

export function Tape({ style, rot = 0 }: { style?: React.CSSProperties; rot?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: -11,
        left: "50%",
        transform: `translateX(-50%) rotate(${rot}deg)`,
        width: 52,
        height: 22,
        zIndex: 3,
        // Semi-transparent tape body
        background: "linear-gradient(105deg, rgba(255,238,100,0.18) 0%, rgba(255,248,160,0.52) 22%, rgba(255,255,210,0.68) 44%, rgba(255,255,255,0.78) 50%, rgba(255,255,210,0.68) 56%, rgba(255,248,160,0.52) 78%, rgba(255,238,100,0.18) 100%)",
        borderRadius: 3,
        // Edges slightly darker
        boxShadow: "inset 0 0 0 1px rgba(210,190,50,0.22), 0 1px 3px rgba(0,0,0,0.08)",
        // Horizontal grain lines
        backgroundImage: [
          "linear-gradient(105deg, rgba(255,238,100,0.18) 0%, rgba(255,248,160,0.52) 22%, rgba(255,255,210,0.68) 44%, rgba(255,255,255,0.78) 50%, rgba(255,255,210,0.68) 56%, rgba(255,248,160,0.52) 78%, rgba(255,238,100,0.18) 100%)",
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(200,180,40,0.04) 3px, rgba(200,180,40,0.04) 4px)",
        ].join(", "),
        ...style,
      }}
    />
  );
}

// ─── Tape Strip (horizontal, like masking tape on a note) ────────────────────

export function TapeStrip({ color = "yellow", style }: { color?: "yellow" | "pink" | "white"; style?: React.CSSProperties }) {
  const palettes = {
    yellow: { body: "rgba(255,242,120,0.55)", shine: "rgba(255,255,210,0.8)" },
    pink:   { body: "rgba(255,180,210,0.55)", shine: "rgba(255,230,240,0.8)" },
    white:  { body: "rgba(240,240,240,0.55)", shine: "rgba(255,255,255,0.85)" },
  };
  const p = palettes[color];
  return (
    <div
      style={{
        width: 56,
        height: 20,
        borderRadius: 3,
        background: `linear-gradient(105deg, ${p.body} 0%, ${p.shine} 48%, ${p.body} 100%)`,
        boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.07)`,
        backgroundImage: [
          `linear-gradient(105deg, ${p.body} 0%, ${p.shine} 48%, ${p.body} 100%)`,
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px)",
        ].join(", "),
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

// ─── Push Pin ────────────────────────────────────────────────────────────────
// Circular head + thin needle. color: "pink" | "red" | "blue" | "gold"

export function PushPin({
  color = "pink",
  size = 16,
  style,
}: {
  color?: "pink" | "red" | "blue" | "gold";
  size?: number;
  style?: React.CSSProperties;
}) {
  const heads: Record<string, [string, string]> = {
    pink: ["#FF8EC4", "#C0185F"],
    red:  ["#FF7070", "#C02020"],
    blue: ["#70A8FF", "#204890"],
    gold: ["#FFD966", "#C07A10"],
  };
  const [light, dark] = heads[color];
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        ...style,
      }}
    >
      {/* Head */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle at 36% 32%, ${light}, ${dark})`,
          boxShadow: `0 2px 5px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.38)`,
          position: "relative",
        }}
      >
        {/* Shine dot */}
        <div
          style={{
            position: "absolute",
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.6)",
            top: "18%",
            left: "22%",
          }}
        />
      </div>
      {/* Needle */}
      <div
        style={{
          width: 2,
          height: size * 0.7,
          background: "linear-gradient(to bottom, #bbb 0%, #777 100%)",
          borderRadius: "0 0 1px 1px",
          marginTop: 1,
        }}
      />
    </div>
  );
}

// ─── Gold Star ───────────────────────────────────────────────────────────────

export function GoldStar({ size = 24, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))", ...style }}
    >
      <polygon
        points="12,1.5 14.6,8.8 22.4,8.8 16.1,13.4 18.4,20.7 12,16.3 5.6,20.7 7.9,13.4 1.6,8.8 9.4,8.8"
        fill="#F5C540"
        stroke="#C89010"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      {/* Inner highlight */}
      <polygon
        points="12,4.5 13.7,9.6 19.1,9.6 14.7,12.7 16.3,17.8 12,14.8 7.7,17.8 9.3,12.7 4.9,9.6 10.3,9.6"
        fill="#FFD966"
        opacity="0.5"
      />
    </svg>
  );
}

// ─── Safety Pin ──────────────────────────────────────────────────────────────

export function SafetyPin({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width="22" height="44" viewBox="0 0 22 44" fill="none" style={{ opacity: 0.55, ...style }}>
      {/* Coil */}
      <path
        d="M11 3 Q15.5 3 15.5 7.5 Q15.5 12 11 12"
        fill="none" stroke="#bbb" strokeWidth="1.4" strokeLinecap="round"
      />
      {/* Body */}
      <path
        d="M11 12 L11 38 Q11 41.5 8.5 41.5 Q6 41.5 6 38 L6 16 Q6 9 11 7.5"
        fill="none" stroke="#bbb" strokeWidth="1.4" strokeLinecap="round"
      />
      {/* Clasp */}
      <path d="M6 38 Q6 42.5 11 42.5 Q16 42.5 16 38" fill="none" stroke="#bbb" strokeWidth="1.4" strokeLinecap="round"/>
      {/* Pin tip */}
      <path d="M16 16 L11 12" fill="none" stroke="#bbb" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Torn Paper Edge (bottom of a section) ────────────────────────────────────
// Render this as the LAST child of a paper card to get a torn-bottom look.

export function TornEdge({
  color = "white",
  height = 18,
  style,
}: {
  color?: string;
  height?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      style={{ display: "block", width: "100%", height, ...style }}
    >
      <path
        d="M0,2 L12,10 L24,3 L38,14 L52,5 L64,13 L78,4 L90,11 L104,3 L116,15 L128,6 L140,12 L154,2 L166,10 L180,4 L194,14 L206,5 L218,11 L232,3 L246,13 L258,4 L270,10 L284,2 L298,12 L312,5 L326,14 L338,4 L350,11 L364,2 L376,12 L388,5 L400,9 L400,24 L0,24 Z"
        fill={color}
      />
    </svg>
  );
}

// ─── Torn Paper Edge (top — flipped) ─────────────────────────────────────────

export function TornEdgeTop({
  color = "white",
  height = 18,
  style,
}: {
  color?: string;
  height?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      style={{ display: "block", width: "100%", height, transform: "scaleY(-1)", ...style }}
    >
      <path
        d="M0,2 L12,10 L24,3 L38,14 L52,5 L64,13 L78,4 L90,11 L104,3 L116,15 L128,6 L140,12 L154,2 L166,10 L180,4 L194,14 L206,5 L218,11 L232,3 L246,13 L258,4 L270,10 L284,2 L298,12 L312,5 L326,14 L338,4 L350,11 L364,2 L376,12 L388,5 L400,9 L400,24 L0,24 Z"
        fill={color}
      />
    </svg>
  );
}

// ─── Washi Tape (longer strip for notes/cards) ────────────────────────────────

export function WashiTape({
  color = "yellow",
  width = 64,
  height = 18,
  rot = 0,
  style,
}: {
  color?: "yellow" | "pink" | "mint" | "lavender";
  width?: number;
  height?: number;
  rot?: number;
  style?: React.CSSProperties;
}) {
  const palettes = {
    yellow:   { base: "rgba(255,235,80,0.52)",  stripe: "rgba(255,255,160,0.35)", border: "rgba(210,180,30,0.22)" },
    pink:     { base: "rgba(255,150,190,0.5)",  stripe: "rgba(255,210,230,0.35)", border: "rgba(200,80,120,0.2)"  },
    mint:     { base: "rgba(130,220,190,0.5)",  stripe: "rgba(200,255,240,0.35)", border: "rgba(60,160,120,0.2)"  },
    lavender: { base: "rgba(185,160,255,0.5)",  stripe: "rgba(230,220,255,0.35)", border: "rgba(120,90,200,0.2)"  },
  };
  const p = palettes[color];
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 3,
        transform: `rotate(${rot}deg)`,
        background: p.base,
        backgroundImage: [
          `repeating-linear-gradient(90deg, transparent, transparent 8px, ${p.stripe} 8px, ${p.stripe} 9px)`,
          `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.018) 3px, rgba(0,0,0,0.018) 4px)`,
        ].join(", "),
        boxShadow: `inset 0 0 0 1px ${p.border}, 0 1px 3px rgba(0,0,0,0.08)`,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

// ─── Polaroid ────────────────────────────────────────────────────────────────
// A polaroid-style photo card with optional caption and tape/pin decoration.

export function Polaroid({
  width = 130,
  height = 100,
  caption,
  bg = "linear-gradient(135deg,#d4a5c4 0%,#e8c8b5 100%)",
  rot = 0,
  tape = false,
  pin = false,
  pinColor = "pink" as "pink" | "red" | "blue" | "gold",
  children,
  style,
}: {
  width?: number;
  height?: number;
  caption?: string;
  bg?: string;
  rot?: number;
  tape?: boolean;
  pin?: boolean;
  pinColor?: "pink" | "red" | "blue" | "gold";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      {pin && (
        <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", zIndex: 4 }}>
          <PushPin color={pinColor} size={13} />
        </div>
      )}
      {tape && (
        <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%) rotate(-1.5deg)", zIndex: 3 }}>
          <Tape rot={0} />
        </div>
      )}
      <div style={{
        width,
        background: "white",
        backgroundImage: PAPER_TEX,
        backgroundSize: "200px 200px",
        padding: "7px 7px",
        paddingBottom: caption ? 22 : 7,
        boxShadow: "2px 4px 18px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.1)",
        transform: `rotate(${rot}deg)`,
        position: "relative",
      }}>
        <div style={{ width: "100%", height, background: bg, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {children}
        </div>
        {caption && (
          <p style={{
            fontFamily: "var(--font-caveat)",
            fontSize: 11,
            color: "rgba(0,0,0,0.45)",
            textAlign: "center",
            marginTop: 6,
            lineHeight: 1.3,
            position: "absolute",
            bottom: 5,
            left: 7,
            right: 7,
          }}>
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Sticky Note ─────────────────────────────────────────────────────────────
// A small sticky note with optional ruling lines and handwritten-style text.

export function StickyNote({
  color = "yellow",
  rot = 0,
  width = 100,
  children,
  style,
}: {
  color?: "yellow" | "pink" | "blue" | "mint";
  rot?: number;
  width?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const palettes = {
    yellow: { bg: "#FFF9C4", ruled: "rgba(200,180,0,0.12)", shadow: "rgba(200,170,0,0.15)" },
    pink:   { bg: "#FFE4EF", ruled: "rgba(220,80,120,0.1)",  shadow: "rgba(220,80,120,0.12)" },
    blue:   { bg: "#E3F0FF", ruled: "rgba(40,100,200,0.09)", shadow: "rgba(40,100,200,0.1)"  },
    mint:   { bg: "#E0FBF0", ruled: "rgba(20,160,100,0.1)",  shadow: "rgba(20,160,100,0.1)"  },
  };
  const p = palettes[color];

  return (
    <div style={{
      width,
      background: p.bg,
      backgroundImage: `repeating-linear-gradient(transparent, transparent 18px, ${p.ruled} 18px, ${p.ruled} 19px)`,
      padding: "10px 10px 12px",
      boxShadow: `2px 4px 12px ${p.shadow}, 0 1px 3px rgba(0,0,0,0.1)`,
      transform: `rotate(${rot}deg)`,
      ...style,
    }}>
      <div style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.7)", lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  );
}
