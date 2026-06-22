"use client";

// ── ClubCrestSVG ──────────────────────────────────────────────────────────────
// Pure SVG club crest/badge component.
// Accepts a club name + optional category/color/size/shape.
// Maps category keywords to decorative SVG icons.
// Uses SVG gradients + drop-shadow for an embossed wax-seal look.

const PINK  = "#FF1F7D";
const BLACK = "#111111";
const CREAM = "#FFF8F0";

export interface ClubCrestSVGProps {
  name: string;
  category?: string;
  color?: string;
  size?: number;
  shape?: "shield" | "oval" | "round";
}

// ── Category → icon key ───────────────────────────────────────────────────────

type IconKey =
  | "wine-leaf"
  | "book"
  | "column"
  | "laurel"
  | "compass"
  | "lotus"
  | "crown"
  | "stars"
  | "monogram";

function categoryToIcon(category?: string): IconKey {
  if (!category) return "monogram";
  const c = category.toLowerCase();
  if (/brunch|food|supper|dining|eat/.test(c)) return "wine-leaf";
  if (/book|read|literary|lit|librar/.test(c)) return "book";
  if (/museum|art|gallery|exhibit/.test(c))    return "column";
  if (/run|walk|active|fitness|sport/.test(c)) return "laurel";
  if (/travel|explore|adventure/.test(c))      return "compass";
  if (/wellness|soft life|spa|yoga|heal/.test(c)) return "lotus";
  if (/fashion|style|beauty|luxe/.test(c))     return "crown";
  if (/night|party|club|social|gal/.test(c))   return "stars";
  return "monogram";
}

// ── Icon SVG fragments (cx/cy = center of drawing area) ──────────────────────

function IconWineLeaf({ cx, cy, fg, s }: { cx: number; cy: number; fg: string; s: number }) {
  // Wine glass + leaf
  return (
    <g transform={`translate(${cx},${cy})`}>
      {/* Wine glass */}
      <path
        d={`M${-9*s},${-18*s} L${9*s},${-18*s} Q${14*s},${-6*s} ${6*s},${2*s} L${6*s},${8*s} L${9*s},${8*s} L${9*s},${11*s} L${-9*s},${11*s} L${-9*s},${8*s} L${-6*s},${8*s} L${-6*s},${2*s} Q${-14*s},${-6*s} ${-9*s},${-18*s} Z`}
        fill={fg} opacity="0.92"
      />
      {/* Leaf on the side */}
      <path
        d={`M${14*s},${-4*s} Q${24*s},${-14*s} ${22*s},${-24*s} Q${12*s},${-22*s} ${14*s},${-4*s} Z`}
        fill={fg} opacity="0.7"
      />
      <line x1={14*s} y1={-4*s} x2={18*s} y2={-14*s} stroke={fg} strokeWidth={0.8*s} opacity="0.5" />
    </g>
  );
}

function IconBook({ cx, cy, fg, s }: { cx: number; cy: number; fg: string; s: number }) {
  return (
    <g transform={`translate(${cx - 14*s},${cy - 12*s})`}>
      {/* Left page */}
      <path d={`M0,0 Q${12*s},${-3*s} ${14*s},0 L${14*s},${24*s} Q${12*s},${21*s} 0,${24*s} Z`} fill={fg} opacity="0.85" />
      {/* Right page */}
      <path d={`M${14*s},0 Q${16*s},${-3*s} ${28*s},0 L${28*s},${24*s} Q${16*s},${21*s} ${14*s},${24*s} Z`} fill={fg} opacity="0.7" />
      {/* Spine */}
      <line x1={14*s} y1={0} x2={14*s} y2={24*s} stroke={fg} strokeWidth={1.5*s} opacity="0.9" />
      {/* Lines on left page */}
      {[6,11,16].map(y => (
        <line key={y} x1={3*s} y1={y*s} x2={11*s} y2={y*s} stroke={fg} strokeWidth={0.8*s} opacity="0.4" />
      ))}
      {/* Lines on right page */}
      {[6,11,16].map(y => (
        <line key={y} x1={17*s} y1={y*s} x2={25*s} y2={y*s} stroke={fg} strokeWidth={0.8*s} opacity="0.4" />
      ))}
    </g>
  );
}

function IconColumn({ cx, cy, fg, s }: { cx: number; cy: number; fg: string; s: number }) {
  // Classical column / arch
  return (
    <g transform={`translate(${cx},${cy})`}>
      {/* Pediment */}
      <polygon points={`${-20*s},${-22*s} ${0},${-34*s} ${20*s},${-22*s}`} fill={fg} opacity="0.9" />
      {/* Entablature */}
      <rect x={-20*s} y={-22*s} width={40*s} height={4*s} fill={fg} opacity="0.85" />
      {/* Columns */}
      {[-11*s, 0, 11*s].map((x, i) => (
        <rect key={i} x={x - 3*s} y={-18*s} width={6*s} height={26*s} rx={2*s} fill={fg} opacity="0.75" />
      ))}
      {/* Base */}
      <rect x={-22*s} y={8*s} width={44*s} height={4*s} rx={1} fill={fg} opacity="0.85" />
    </g>
  );
}

function IconLaurel({ cx, cy, fg, s }: { cx: number; cy: number; fg: string; s: number }) {
  // Laurel wreath halves
  const leftLeaves = [-5, 0, 5, 10, 15, 20];
  return (
    <g transform={`translate(${cx},${cy})`}>
      {/* Left branch */}
      {leftLeaves.map((deg, i) => {
        const angle = (-30 - deg) * Math.PI / 180;
        const bx = -8*s + Math.cos(angle + Math.PI/2) * i * 4*s;
        const by = 4*s + Math.sin(angle + Math.PI/2) * i * 4*s;
        return (
          <ellipse key={i} cx={bx} cy={by} rx={4*s} ry={7*s}
            fill={fg} opacity="0.7"
            transform={`rotate(${-110 - i * 12},${bx},${by})`}
          />
        );
      })}
      {/* Right branch (mirrored) */}
      {leftLeaves.map((deg, i) => {
        const angle = (-30 - deg) * Math.PI / 180;
        const bx = 8*s - Math.cos(angle + Math.PI/2) * i * 4*s;
        const by = 4*s + Math.sin(angle + Math.PI/2) * i * 4*s;
        return (
          <ellipse key={i} cx={bx} cy={by} rx={4*s} ry={7*s}
            fill={fg} opacity="0.7"
            transform={`rotate(${110 + i * 12},${bx},${by})`}
          />
        );
      })}
      {/* Center star */}
      <polygon
        points={Array.from({ length: 5 }, (_, i) => {
          const a = (i * 72 - 90) * Math.PI / 180;
          const a2 = ((i * 72 + 36) - 90) * Math.PI / 180;
          return `${Math.cos(a)*7*s},${Math.sin(a)*7*s} ${Math.cos(a2)*3*s},${Math.sin(a2)*3*s}`;
        }).join(" ")}
        fill={fg} opacity="0.9"
      />
    </g>
  );
}

function IconCompass({ cx, cy, fg, s }: { cx: number; cy: number; fg: string; s: number }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      {/* Outer ring */}
      <circle cx={0} cy={0} r={20*s} fill="none" stroke={fg} strokeWidth={1.5*s} opacity="0.7" />
      <circle cx={0} cy={0} r={17*s} fill="none" stroke={fg} strokeWidth={0.5*s} opacity="0.4" />
      {/* Cardinal tick marks */}
      {[0, 90, 180, 270].map(deg => {
        const a = deg * Math.PI / 180;
        return (
          <line key={deg}
            x1={Math.cos(a)*14*s} y1={Math.sin(a)*14*s}
            x2={Math.cos(a)*20*s} y2={Math.sin(a)*20*s}
            stroke={fg} strokeWidth={1.5*s} opacity="0.8"
          />
        );
      })}
      {/* Compass needle - N (up) */}
      <polygon points={`0,${-16*s} ${4*s},0 0,${4*s} ${-4*s},0`} fill={fg} opacity="0.9" />
      <polygon points={`0,${16*s} ${4*s},0 0,${-4*s} ${-4*s},0`} fill={fg} opacity="0.4" />
      {/* Center dot */}
      <circle cx={0} cy={0} r={3*s} fill={fg} opacity="0.9" />
    </g>
  );
}

function IconLotus({ cx, cy, fg, s }: { cx: number; cy: number; fg: string; s: number }) {
  // Lotus / flower
  return (
    <g transform={`translate(${cx},${cy})`}>
      {/* Outer petals */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const a = (deg - 90) * Math.PI / 180;
        return (
          <ellipse key={i}
            cx={Math.cos(a) * 14*s} cy={Math.sin(a) * 14*s}
            rx={5*s} ry={11*s}
            fill={fg} opacity="0.6"
            transform={`rotate(${deg},${Math.cos(a)*14*s},${Math.sin(a)*14*s})`}
          />
        );
      })}
      {/* Inner petals */}
      {[30, 90, 150, 210, 270, 330].map((deg, i) => {
        const a = (deg - 90) * Math.PI / 180;
        return (
          <ellipse key={i}
            cx={Math.cos(a) * 9*s} cy={Math.sin(a) * 9*s}
            rx={4*s} ry={8*s}
            fill={fg} opacity="0.85"
            transform={`rotate(${deg},${Math.cos(a)*9*s},${Math.sin(a)*9*s})`}
          />
        );
      })}
      {/* Center */}
      <circle cx={0} cy={0} r={6*s} fill={fg} opacity="0.95" />
      <circle cx={0} cy={0} r={3*s} fill="none" stroke={fg} strokeWidth={0.8*s} opacity="0.5" />
    </g>
  );
}

function IconCrown({ cx, cy, fg, s }: { cx: number; cy: number; fg: string; s: number }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      {/* Crown body */}
      <path
        d={`M${-18*s},${8*s} L${-18*s},${-6*s} L${-8*s},${2*s} L${0},${-16*s} L${8*s},${2*s} L${18*s},${-6*s} L${18*s},${8*s} Z`}
        fill={fg} opacity="0.9"
      />
      {/* Base band */}
      <rect x={-18*s} y={8*s} width={36*s} height={5*s} rx={1} fill={fg} opacity="0.8" />
      {/* Jewels */}
      {[-8*s, 0, 8*s].map((x, i) => (
        <circle key={i} cx={x} cy={10*s} r={2.5*s} fill={fg} opacity="0.5" />
      ))}
      {/* Fleur accents */}
      <circle cx={0} cy={-16*s} r={3*s} fill={fg} opacity="0.7" />
    </g>
  );
}

function IconStars({ cx, cy, fg, s }: { cx: number; cy: number; fg: string; s: number }) {
  const positions: [number, number, number][] = [
    [0, -18*s, 7*s],
    [-14*s, -8*s, 5*s],
    [14*s, -8*s, 5*s],
    [-8*s, 8*s, 4*s],
    [8*s, 8*s, 4*s],
    [0, 4*s, 3*s],
  ];
  return (
    <g transform={`translate(${cx},${cy})`}>
      {positions.map(([px, py, r], i) => (
        <polygon key={i}
          fill={fg} opacity={i === 0 ? 0.95 : 0.65}
          points={Array.from({ length: 5 }, (_, k) => {
            const a1 = (k * 72 - 90) * Math.PI / 180;
            const a2 = ((k * 72 + 36) - 90) * Math.PI / 180;
            return `${px + Math.cos(a1)*r},${py + Math.sin(a1)*r} ${px + Math.cos(a2)*(r*0.42)},${py + Math.sin(a2)*(r*0.42)}`;
          }).join(" ")}
        />
      ))}
    </g>
  );
}

function IconMonogram({ cx, cy, fg, s, name }: { cx: number; cy: number; fg: string; s: number; name: string }) {
  // Double-B or initials monogram
  const initials = name
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
  const display = initials.length >= 2 ? initials : "BB";
  return (
    <g transform={`translate(${cx},${cy})`}>
      <text
        x={0} y={0}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-playfair, Georgia, serif)"
        fontWeight="700"
        fontStyle="italic"
        fontSize={26 * s}
        fill={fg}
        opacity="0.9"
        letterSpacing={2 * s}
      >
        {display}
      </text>
    </g>
  );
}

// ── Shape paths ───────────────────────────────────────────────────────────────

function ShieldShape({ fill, outerStroke, innerStroke }: { fill: string; outerStroke: string; innerStroke: string }) {
  // viewBox 0 0 200 220
  return (
    <>
      {/* Outer shadow shape */}
      <path
        d="M100,14 L186,46 L186,118 Q186,178 100,202 Q14,178 14,118 L14,46 Z"
        fill={fill}
        filter="url(#crest-shadow)"
      />
      {/* Outer border */}
      <path
        d="M100,14 L186,46 L186,118 Q186,178 100,202 Q14,178 14,118 L14,46 Z"
        fill={fill}
        stroke={outerStroke}
        strokeWidth="2"
      />
      {/* Inner decorative border */}
      <path
        d="M100,24 L176,52 L176,120 Q176,170 100,190 Q24,170 24,120 L24,52 Z"
        fill="none"
        stroke={innerStroke}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Second inner border */}
      <path
        d="M100,32 L168,56 L168,122 Q168,164 100,180 Q32,164 32,122 L32,56 Z"
        fill="none"
        stroke={innerStroke}
        strokeWidth="0.5"
        opacity="0.3"
      />
    </>
  );
}

function OvalShape({ fill, outerStroke, innerStroke }: { fill: string; outerStroke: string; innerStroke: string }) {
  // viewBox 0 0 200 240
  return (
    <>
      <ellipse cx="100" cy="122" rx="88" ry="108" fill={fill} filter="url(#crest-shadow)" />
      <ellipse cx="100" cy="122" rx="88" ry="108" fill={fill} stroke={outerStroke} strokeWidth="2" />
      <ellipse cx="100" cy="122" rx="79"  ry="99"  fill="none" stroke={innerStroke} strokeWidth="1" opacity="0.5" />
      <ellipse cx="100" cy="122" rx="72"  ry="92"  fill="none" stroke={innerStroke} strokeWidth="0.5" opacity="0.3" />
    </>
  );
}

function RoundShape({ fill, outerStroke, innerStroke }: { fill: string; outerStroke: string; innerStroke: string }) {
  // viewBox 0 0 200 200
  return (
    <>
      <circle cx="100" cy="100" r="88" fill={fill} filter="url(#crest-shadow)" />
      <circle cx="100" cy="100" r="88" fill={fill} stroke={outerStroke} strokeWidth="2" />
      <circle cx="100" cy="100" r="78" fill="none" stroke={innerStroke} strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="71" fill="none" stroke={innerStroke} strokeWidth="0.5" opacity="0.3" />
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ClubCrestSVG({
  name,
  category,
  color,
  size = 120,
  shape = "shield",
}: ClubCrestSVGProps) {
  const primaryColor = color ?? PINK;
  const fgColor = CREAM;
  const accentColor = CREAM;

  const iconKey = categoryToIcon(category);

  // Shape-specific config
  const shapeConfig = {
    shield: {
      viewBox: "0 0 200 220",
      nameCy: 52,
      iconCy: 128,
      dividerY: 70,
      taglineY: 186,
    },
    oval: {
      viewBox: "0 0 200 240",
      nameCy: 52,
      iconCy: 138,
      dividerY: 70,
      taglineY: 204,
    },
    round: {
      viewBox: "0 0 200 200",
      nameCy: 48,
      iconCy: 118,
      dividerY: 66,
      taglineY: 172,
    },
  }[shape];

  // Name display — truncate and uppercase
  const displayName = name.length > 16 ? name.slice(0, 16).toUpperCase() : name.toUpperCase();
  const fontSize = displayName.length > 12 ? 9.5 : displayName.length > 9 ? 10.5 : 11.5;

  // Scale for icon (normalized to 200px viewBox)
  const iconScale = 0.78;

  // Gradient IDs need to be unique per instance — use simple string from name
  const uid = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "crest";
  const gradId    = `cg-${uid}`;
  const glowId    = `glow-${uid}`;
  const shadowId  = `shadow-${uid}`;
  const innerGlowId = `iglow-${uid}`;

  return (
    <svg
      viewBox={shapeConfig.viewBox}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        {/* Radial gradient for embossed body */}
        <radialGradient id={gradId} cx="45%" cy="35%" r="70%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
          <stop offset="60%" stopColor={primaryColor} stopOpacity="1" />
          <stop offset="100%" stopColor={adjustColor(primaryColor, -40)} stopOpacity="1" />
        </radialGradient>

        {/* Outer glow */}
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" type="matrix"
            values="0 0 0 0 1  0 0 0 0 0.12  0 0 0 0 0.49  0 0 0 0.5 0"
            result="glow"
          />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Drop shadow */}
        <filter id={shadowId} x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor="rgba(0,0,0,0.5)" />
        </filter>

        {/* Inner highlight */}
        <radialGradient id={innerGlowId} cx="40%" cy="28%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Filter alias for shapes */}
      <defs>
        <filter id="crest-shadow" x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>

      {/* Outer glow halo */}
      <g filter={`url(#${glowId})`}>
        {shape === "shield" && (
          <path d="M100,14 L186,46 L186,118 Q186,178 100,202 Q14,178 14,118 L14,46 Z"
            fill={primaryColor} opacity="0.3" />
        )}
        {shape === "oval" && (
          <ellipse cx="100" cy="122" rx="88" ry="108" fill={primaryColor} opacity="0.3" />
        )}
        {shape === "round" && (
          <circle cx="100" cy="100" r="88" fill={primaryColor} opacity="0.3" />
        )}
      </g>

      {/* Main shape */}
      {shape === "shield" && (
        <ShieldShape fill={`url(#${gradId})`} outerStroke={fgColor} innerStroke={fgColor} />
      )}
      {shape === "oval" && (
        <OvalShape fill={`url(#${gradId})`} outerStroke={fgColor} innerStroke={fgColor} />
      )}
      {shape === "round" && (
        <RoundShape fill={`url(#${gradId})`} outerStroke={fgColor} innerStroke={fgColor} />
      )}

      {/* Inner highlight overlay for embossed look */}
      {shape === "shield" && (
        <path
          d="M100,14 L186,46 L186,118 Q186,178 100,202 Q14,178 14,118 L14,46 Z"
          fill={`url(#${innerGlowId})`}
        />
      )}
      {shape === "oval" && (
        <ellipse cx="100" cy="122" rx="88" ry="108" fill={`url(#${innerGlowId})`} />
      )}
      {shape === "round" && (
        <circle cx="100" cy="100" r="88" fill={`url(#${innerGlowId})`} />
      )}

      {/* Club name */}
      <text
        x="100"
        y={shapeConfig.nameCy}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-playfair, Georgia, serif)"
        fontWeight="700"
        fontSize={fontSize}
        letterSpacing="0.15em"
        fill={fgColor}
      >
        {displayName}
      </text>

      {/* Decorative divider · ✦ · */}
      <text
        x="100"
        y={shapeConfig.dividerY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Georgia, serif"
        fontSize="7"
        letterSpacing="3"
        fill={accentColor}
        opacity="0.65"
      >
        · ✦ ·
      </text>

      {/* Category icon */}
      {iconKey === "wine-leaf" && (
        <IconWineLeaf cx={100} cy={shapeConfig.iconCy} fg={fgColor} s={iconScale} />
      )}
      {iconKey === "book" && (
        <IconBook cx={100} cy={shapeConfig.iconCy} fg={fgColor} s={iconScale} />
      )}
      {iconKey === "column" && (
        <IconColumn cx={100} cy={shapeConfig.iconCy} fg={fgColor} s={iconScale} />
      )}
      {iconKey === "laurel" && (
        <IconLaurel cx={100} cy={shapeConfig.iconCy} fg={fgColor} s={iconScale} />
      )}
      {iconKey === "compass" && (
        <IconCompass cx={100} cy={shapeConfig.iconCy} fg={fgColor} s={iconScale} />
      )}
      {iconKey === "lotus" && (
        <IconLotus cx={100} cy={shapeConfig.iconCy} fg={fgColor} s={iconScale} />
      )}
      {iconKey === "crown" && (
        <IconCrown cx={100} cy={shapeConfig.iconCy} fg={fgColor} s={iconScale} />
      )}
      {iconKey === "stars" && (
        <IconStars cx={100} cy={shapeConfig.iconCy} fg={fgColor} s={iconScale} />
      )}
      {iconKey === "monogram" && (
        <IconMonogram cx={100} cy={shapeConfig.iconCy} fg={fgColor} s={iconScale} name={name} />
      )}

      {/* Bottom tagline area */}
      <text
        x="100"
        y={shapeConfig.taglineY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-jost, Arial, sans-serif)"
        fontWeight="600"
        fontSize="6"
        letterSpacing="0.2em"
        fill={fgColor}
        opacity="0.5"
      >
        BLOOMBAY
      </text>
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Darken or lighten a hex color by `amount` (negative = darker). */
function adjustColor(hex: string, amount: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const toHex = (v: number) => clamp(v + amount).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
