"use client";

import { useState, useRef, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";
const GOLD  = "#D4A853";

const PRESET_SWATCHES = [
  "#FF1F7D", "#FF6BAE", "#FFB3D6",  // pinks
  "#D4A853", "#F5D080",              // golds
  "#3DAA6E", "#A8DFBB",             // greens
  "#2563EB", "#93C5FD",             // blues
  "#1C1B1C", "#5A585A",             // blacks
  "#FEFCF7", "#F0EDE6",             // whites/creams
  "#1E3A5F", "#264F79",             // navies
  "#F6F1EB", "#E8E0D5",             // creams
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CrestConfig {
  shape: "shield" | "circle" | "arch" | "diamond";
  symbol: "flower" | "star" | "leaf" | "crown" | "book" | "flame" | "moon" | "sun";
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
}

interface Props {
  clubName: string;
  initialConfig?: CrestConfig;
  onSave: (config: CrestConfig, svgString: string) => void;
}

// ─── SVG Shape Paths ──────────────────────────────────────────────────────────

function ShieldPath({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <>
      {/* Classic heraldic shield */}
      <path
        d="M100 12 L188 40 L188 110 Q188 160 100 195 Q12 160 12 110 L12 40 Z"
        fill={primary}
        stroke={secondary}
        strokeWidth="4"
      />
      {/* Inner shield highlight */}
      <path
        d="M100 24 L176 48 L176 112 Q176 155 100 185 Q24 155 24 112 L24 48 Z"
        fill="none"
        stroke={secondary}
        strokeWidth="1.5"
        opacity="0.4"
      />
    </>
  );
}

function CirclePath({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <>
      {/* Outer ring */}
      <circle cx="100" cy="105" r="88" fill={primary} stroke={secondary} strokeWidth="4" />
      {/* Inner ring */}
      <circle cx="100" cy="105" r="74" fill="none" stroke={secondary} strokeWidth="2" opacity="0.5" />
    </>
  );
}

function ArchPath({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <>
      {/* Rounded arch / banner shape */}
      <path
        d="M15 85 Q15 12 100 12 Q185 12 185 85 L185 170 Q185 192 100 192 Q15 192 15 170 Z"
        fill={primary}
        stroke={secondary}
        strokeWidth="4"
      />
      {/* Inner arch line */}
      <path
        d="M27 87 Q27 26 100 26 Q173 26 173 87 L173 168 Q173 180 100 180 Q27 180 27 168 Z"
        fill="none"
        stroke={secondary}
        strokeWidth="1.5"
        opacity="0.4"
      />
    </>
  );
}

function DiamondPath({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <>
      {/* Rotated square with cut corners */}
      <path
        d="M100 10 L172 55 L190 105 L172 155 L100 190 L28 155 L10 105 L28 55 Z"
        fill={primary}
        stroke={secondary}
        strokeWidth="4"
      />
      {/* Inner diamond */}
      <path
        d="M100 24 L162 62 L178 105 L162 148 L100 176 L38 148 L22 105 L38 62 Z"
        fill="none"
        stroke={secondary}
        strokeWidth="1.5"
        opacity="0.4"
      />
    </>
  );
}

// ─── SVG Symbol Icons ─────────────────────────────────────────────────────────

function FlowerSymbol({ color, accent }: { color: string; accent: string }) {
  // 5 rounded petals using ellipses rotated around center
  const petals = [0, 72, 144, 216, 288];
  return (
    <g transform="translate(100,104)">
      {petals.map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-18"
          rx="8"
          ry="16"
          fill={color}
          transform={`rotate(${angle})`}
          opacity="0.9"
        />
      ))}
      <circle cx="0" cy="0" r="9" fill={accent} />
    </g>
  );
}

function StarSymbol({ color }: { color: string }) {
  // 5-pointed star
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 72 - 90) * (Math.PI / 180);
    const innerAngle = ((i * 72 + 36) - 90) * (Math.PI / 180);
    points.push(`${100 + 30 * Math.cos(outerAngle)},${104 + 30 * Math.sin(outerAngle)}`);
    points.push(`${100 + 13 * Math.cos(innerAngle)},${104 + 13 * Math.sin(innerAngle)}`);
  }
  return <polygon points={points.join(" ")} fill={color} />;
}

function LeafSymbol({ color, accent }: { color: string; accent: string }) {
  return (
    <g transform="translate(100,104)">
      {/* Curved leaf shape */}
      <path
        d="M0,-30 C20,-15 20,10 0,30 C-20,10 -20,-15 0,-30 Z"
        fill={color}
      />
      {/* Center vein */}
      <line x1="0" y1="-26" x2="0" y2="26" stroke={accent} strokeWidth="1.5" opacity="0.7" />
    </g>
  );
}

function CrownSymbol({ color, accent }: { color: string; accent: string }) {
  return (
    <g transform="translate(100,104)">
      {/* 3-point crown */}
      <path
        d="M-28,12 L-28,-8 L-12,-24 L0,-10 L12,-24 L28,-8 L28,12 Z"
        fill={color}
        stroke={accent}
        strokeWidth="1.5"
      />
      {/* Crown band */}
      <rect x="-28" y="8" width="56" height="8" fill={accent} rx="1" />
      {/* Gem dots */}
      <circle cx="-14" cy="3" r="3" fill={accent} />
      <circle cx="0" cy="1" r="3" fill={accent} />
      <circle cx="14" cy="3" r="3" fill={accent} />
    </g>
  );
}

function BookSymbol({ color, accent }: { color: string; accent: string }) {
  return (
    <g transform="translate(100,104)">
      {/* Open book left page */}
      <path
        d="M-2,-20 L-28,-20 Q-30,-20 -30,-18 L-30,20 Q-30,22 -28,22 L-2,22 Z"
        fill={color}
        stroke={accent}
        strokeWidth="1"
      />
      {/* Open book right page */}
      <path
        d="M2,-20 L28,-20 Q30,-20 30,-18 L30,20 Q30,22 28,22 L2,22 Z"
        fill={color}
        stroke={accent}
        strokeWidth="1"
      />
      {/* Spine */}
      <rect x="-2" y="-20" width="4" height="42" fill={accent} rx="1" />
      {/* Lines on left page */}
      <line x1="-24" y1="-8" x2="-6" y2="-8" stroke={accent} strokeWidth="1" opacity="0.5" />
      <line x1="-24" y1="-1" x2="-6" y2="-1" stroke={accent} strokeWidth="1" opacity="0.5" />
      <line x1="-24" y1="6" x2="-6" y2="6" stroke={accent} strokeWidth="1" opacity="0.5" />
      {/* Lines on right page */}
      <line x1="6" y1="-8" x2="24" y2="-8" stroke={accent} strokeWidth="1" opacity="0.5" />
      <line x1="6" y1="-1" x2="24" y2="-1" stroke={accent} strokeWidth="1" opacity="0.5" />
      <line x1="6" y1="6" x2="24" y2="6" stroke={accent} strokeWidth="1" opacity="0.5" />
    </g>
  );
}

function FlameSymbol({ color, accent }: { color: string; accent: string }) {
  return (
    <g transform="translate(100,104)">
      {/* Outer flame */}
      <path
        d="M0,-32 C8,-20 22,-14 18,0 C14,14 22,16 16,28 C8,38 -8,38 -16,28 C-22,16 -14,14 -18,0 C-22,-14 -8,-20 0,-32 Z"
        fill={color}
      />
      {/* Inner flame highlight */}
      <path
        d="M0,-16 C4,-8 10,-4 8,4 C6,12 10,14 6,20 C2,26 -2,26 -6,20 C-10,14 -6,12 -8,4 C-10,-4 -4,-8 0,-16 Z"
        fill={accent}
        opacity="0.7"
      />
    </g>
  );
}

function MoonSymbol({ color, accent }: { color: string; accent: string }) {
  return (
    <g transform="translate(100,104)">
      {/* Crescent moon using two circles */}
      <circle cx="0" cy="0" r="26" fill={color} />
      <circle cx="12" cy="-6" r="20" fill="transparent" />
      {/* Use clip technique with a path instead */}
      <path
        d="M0,-26 A26,26 0 1,1 0,26 A18,20 0 1,0 0,-26 Z"
        fill={color}
      />
      {/* Star dot */}
      <circle cx="14" cy="-14" r="3" fill={accent} />
    </g>
  );
}

function SunSymbol({ color, accent }: { color: string; accent: string }) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g transform="translate(100,104)">
      {/* Rays */}
      {rays.map((angle) => {
        const rad = (angle - 90) * (Math.PI / 180);
        return (
          <line
            key={angle}
            x1={16 * Math.cos(rad)}
            y1={16 * Math.sin(rad)}
            x2={28 * Math.cos(rad)}
            y2={28 * Math.sin(rad)}
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}
      {/* Center circle */}
      <circle cx="0" cy="0" r="14" fill={color} />
      <circle cx="0" cy="0" r="8" fill={accent} />
    </g>
  );
}

// ─── Crest SVG Renderer ───────────────────────────────────────────────────────

function renderCrestSVG(config: CrestConfig, clubName: string): string {
  const { shape, symbol, colorPrimary, colorSecondary, colorAccent } = config;

  const shapeMap: Record<string, string> = {
    shield: `<path d="M100 12 L188 40 L188 110 Q188 160 100 195 Q12 160 12 110 L12 40 Z" fill="${colorPrimary}" stroke="${colorSecondary}" stroke-width="4"/>
             <path d="M100 24 L176 48 L176 112 Q176 155 100 185 Q24 155 24 112 L24 48 Z" fill="none" stroke="${colorSecondary}" stroke-width="1.5" opacity="0.4"/>`,
    circle: `<circle cx="100" cy="105" r="88" fill="${colorPrimary}" stroke="${colorSecondary}" stroke-width="4"/>
             <circle cx="100" cy="105" r="74" fill="none" stroke="${colorSecondary}" stroke-width="2" opacity="0.5"/>`,
    arch:   `<path d="M15 85 Q15 12 100 12 Q185 12 185 85 L185 170 Q185 192 100 192 Q15 192 15 170 Z" fill="${colorPrimary}" stroke="${colorSecondary}" stroke-width="4"/>
             <path d="M27 87 Q27 26 100 26 Q173 26 173 87 L173 168 Q173 180 100 180 Q27 180 27 168 Z" fill="none" stroke="${colorSecondary}" stroke-width="1.5" opacity="0.4"/>`,
    diamond:`<path d="M100 10 L172 55 L190 105 L172 155 L100 190 L28 155 L10 105 L28 55 Z" fill="${colorPrimary}" stroke="${colorSecondary}" stroke-width="4"/>
             <path d="M100 24 L162 62 L178 105 L162 148 L100 176 L38 148 L22 105 L38 62 Z" fill="none" stroke="${colorSecondary}" stroke-width="1.5" opacity="0.4"/>`,
  };

  const petalAngles = [0, 72, 144, 216, 288];
  const flowerPetals = petalAngles.map(a =>
    `<ellipse cx="0" cy="-18" rx="8" ry="16" fill="${colorSecondary}" transform="rotate(${a})" opacity="0.9"/>`
  ).join("");
  const starPoints: string[] = [];
  for (let i = 0; i < 5; i++) {
    const oA = (i * 72 - 90) * (Math.PI / 180);
    const iA = ((i * 72 + 36) - 90) * (Math.PI / 180);
    starPoints.push(`${100 + 30 * Math.cos(oA)},${104 + 30 * Math.sin(oA)}`);
    starPoints.push(`${100 + 13 * Math.cos(iA)},${104 + 13 * Math.sin(iA)}`);
  }
  const rayAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  const sunRays = rayAngles.map(a => {
    const r = (a - 90) * (Math.PI / 180);
    return `<line x1="${16*Math.cos(r)}" y1="${16*Math.sin(r)}" x2="${28*Math.cos(r)}" y2="${28*Math.sin(r)}" stroke="${colorSecondary}" stroke-width="4" stroke-linecap="round"/>`;
  }).join("");

  const symbolMap: Record<string, string> = {
    flower: `<g transform="translate(100,104)">${flowerPetals}<circle cx="0" cy="0" r="9" fill="${colorAccent}"/></g>`,
    star:   `<polygon points="${starPoints.join(" ")}" fill="${colorSecondary}"/>`,
    leaf:   `<g transform="translate(100,104)"><path d="M0,-30 C20,-15 20,10 0,30 C-20,10 -20,-15 0,-30 Z" fill="${colorSecondary}"/><line x1="0" y1="-26" x2="0" y2="26" stroke="${colorAccent}" stroke-width="1.5" opacity="0.7"/></g>`,
    crown:  `<g transform="translate(100,104)"><path d="M-28,12 L-28,-8 L-12,-24 L0,-10 L12,-24 L28,-8 L28,12 Z" fill="${colorSecondary}" stroke="${colorAccent}" stroke-width="1.5"/><rect x="-28" y="8" width="56" height="8" fill="${colorAccent}" rx="1"/><circle cx="-14" cy="3" r="3" fill="${colorAccent}"/><circle cx="0" cy="1" r="3" fill="${colorAccent}"/><circle cx="14" cy="3" r="3" fill="${colorAccent}"/></g>`,
    book:   `<g transform="translate(100,104)"><path d="M-2,-20 L-28,-20 Q-30,-20 -30,-18 L-30,20 Q-30,22 -28,22 L-2,22 Z" fill="${colorSecondary}" stroke="${colorAccent}" stroke-width="1"/><path d="M2,-20 L28,-20 Q30,-20 30,-18 L30,20 Q30,22 28,22 L2,22 Z" fill="${colorSecondary}" stroke="${colorAccent}" stroke-width="1"/><rect x="-2" y="-20" width="4" height="42" fill="${colorAccent}" rx="1"/><line x1="-24" y1="-8" x2="-6" y2="-8" stroke="${colorAccent}" stroke-width="1" opacity="0.5"/><line x1="-24" y1="-1" x2="-6" y2="-1" stroke="${colorAccent}" stroke-width="1" opacity="0.5"/><line x1="-24" y1="6" x2="-6" y2="6" stroke="${colorAccent}" stroke-width="1" opacity="0.5"/><line x1="6" y1="-8" x2="24" y2="-8" stroke="${colorAccent}" stroke-width="1" opacity="0.5"/><line x1="6" y1="-1" x2="24" y2="-1" stroke="${colorAccent}" stroke-width="1" opacity="0.5"/><line x1="6" y1="6" x2="24" y2="6" stroke="${colorAccent}" stroke-width="1" opacity="0.5"/></g>`,
    flame:  `<g transform="translate(100,104)"><path d="M0,-32 C8,-20 22,-14 18,0 C14,14 22,16 16,28 C8,38 -8,38 -16,28 C-22,16 -14,14 -18,0 C-22,-14 -8,-20 0,-32 Z" fill="${colorSecondary}"/><path d="M0,-16 C4,-8 10,-4 8,4 C6,12 10,14 6,20 C2,26 -2,26 -6,20 C-10,14 -6,12 -8,4 C-10,-4 -4,-8 0,-16 Z" fill="${colorAccent}" opacity="0.7"/></g>`,
    moon:   `<g transform="translate(100,104)"><path d="M0,-26 A26,26 0 1,1 0,26 A18,20 0 1,0 0,-26 Z" fill="${colorSecondary}"/><circle cx="14" cy="-14" r="3" fill="${colorAccent}"/></g>`,
    sun:    `<g transform="translate(100,104)">${sunRays}<circle cx="0" cy="0" r="14" fill="${colorSecondary}"/><circle cx="0" cy="0" r="8" fill="${colorAccent}"/></g>`,
  };

  const nameFontSize = clubName.length > 16 ? 9 : clubName.length > 10 ? 11 : 13;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  ${shapeMap[shape] ?? shapeMap.shield}
  ${symbolMap[symbol] ?? symbolMap.flower}
  <text x="100" y="210" text-anchor="middle" font-family="serif" font-size="${nameFontSize}" fill="${colorSecondary}" font-weight="600" letter-spacing="1">${clubName.toUpperCase()}</text>
</svg>`;
}

// ─── Color Picker Row ─────────────────────────────────────────────────────────

function ColorPickerRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontFamily: "var(--font-jost)", color: DARK, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </div>
      {/* Swatch scroll */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
        {PRESET_SWATCHES.map((swatch) => (
          <button
            key={swatch}
            onClick={() => onChange(swatch)}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: swatch,
              border: value === swatch ? `3px solid ${PINK}` : "2px solid rgba(0,0,0,0.1)",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: value === swatch ? `0 0 0 2px ${PAPER}` : "none",
              transition: "transform 0.15s",
              outline: "none",
            }}
            aria-label={swatch}
          />
        ))}
        {/* Custom color input */}
        <label style={{ width: 32, height: 32, borderRadius: "50%", border: "2px dashed #ccc", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer" }}
          />
        </label>
      </div>
      {/* Active color display */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
        <div style={{ width: 20, height: 20, borderRadius: 4, background: value, border: "1px solid rgba(0,0,0,0.1)" }} />
        <span style={{ fontSize: 12, fontFamily: "var(--font-jost)", color: "#777" }}>{value}</span>
      </div>
    </div>
  );
}

// ─── Shape Chip ───────────────────────────────────────────────────────────────

const SHAPE_LABELS: Record<string, string> = {
  shield: "Shield",
  circle: "Circle",
  arch: "Arch",
  diamond: "Diamond",
};

const SYMBOL_LABELS: Record<string, string> = {
  flower: "Flower",
  star: "Star",
  leaf: "Leaf",
  crown: "Crown",
  book: "Book",
  flame: "Flame",
  moon: "Moon",
  sun: "Sun",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function ClubCrestGenerator({ clubName, initialConfig, onSave }: Props) {
  const [config, setConfig] = useState<CrestConfig>({
    shape: initialConfig?.shape ?? "shield",
    symbol: initialConfig?.symbol ?? "flower",
    colorPrimary: initialConfig?.colorPrimary ?? PINK,
    colorSecondary: initialConfig?.colorSecondary ?? DARK,
    colorAccent: initialConfig?.colorAccent ?? GOLD,
  });

  const svgRef = useRef<SVGSVGElement>(null);

  const update = useCallback(<K extends keyof CrestConfig>(key: K, val: CrestConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  }, []);

  function handleSave() {
    const svgString = renderCrestSVG(config, clubName);
    onSave(config, svgString);
  }

  const { shape, symbol, colorPrimary, colorSecondary, colorAccent } = config;

  return (
    <div style={{ fontFamily: "var(--font-jost)", color: DARK, background: PAPER }}>
      {/* ── Live Preview ── */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <div style={{ position: "relative" }}>
          <svg
            ref={svgRef}
            viewBox="0 0 200 200"
            width={200}
            height={200}
            style={{ display: "block", filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.13))" }}
          >
            {shape === "shield"  && <ShieldPath  primary={colorPrimary} secondary={colorSecondary} />}
            {shape === "circle"  && <CirclePath  primary={colorPrimary} secondary={colorSecondary} />}
            {shape === "arch"    && <ArchPath    primary={colorPrimary} secondary={colorSecondary} />}
            {shape === "diamond" && <DiamondPath primary={colorPrimary} secondary={colorSecondary} />}

            {symbol === "flower" && <FlowerSymbol color={colorSecondary} accent={colorAccent} />}
            {symbol === "star"   && <StarSymbol   color={colorSecondary} />}
            {symbol === "leaf"   && <LeafSymbol   color={colorSecondary} accent={colorAccent} />}
            {symbol === "crown"  && <CrownSymbol  color={colorSecondary} accent={colorAccent} />}
            {symbol === "book"   && <BookSymbol   color={colorSecondary} accent={colorAccent} />}
            {symbol === "flame"  && <FlameSymbol  color={colorSecondary} accent={colorAccent} />}
            {symbol === "moon"   && <MoonSymbol   color={colorSecondary} accent={colorAccent} />}
            {symbol === "sun"    && <SunSymbol    color={colorSecondary} accent={colorAccent} />}
          </svg>
          {/* Club name below */}
          <div style={{
            textAlign: "center",
            marginTop: 8,
            fontSize: 11,
            fontFamily: "var(--font-playfair)",
            letterSpacing: "0.12em",
            fontWeight: 700,
            color: DARK,
            textTransform: "uppercase",
          }}>
            {clubName}
          </div>
        </div>
      </div>

      {/* ── Shape Selector ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, color: DARK }}>
          Shape
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["shield", "circle", "arch", "diamond"] as const).map((s) => (
            <button
              key={s}
              onClick={() => update("shape", s)}
              style={{
                padding: "8px 16px",
                borderRadius: 24,
                border: shape === s ? `2px solid ${PINK}` : "2px solid #ddd",
                background: shape === s ? `${PINK}15` : "#fff",
                color: shape === s ? PINK : DARK,
                fontFamily: "var(--font-jost)",
                fontSize: 13,
                fontWeight: shape === s ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
                outline: "none",
              }}
            >
              {SHAPE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Symbol Selector ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, color: DARK }}>
          Symbol
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["flower", "star", "leaf", "crown", "book", "flame", "moon", "sun"] as const).map((sym) => (
            <button
              key={sym}
              onClick={() => update("symbol", sym)}
              style={{
                padding: "8px 14px",
                borderRadius: 24,
                border: symbol === sym ? `2px solid ${PINK}` : "2px solid #ddd",
                background: symbol === sym ? `${PINK}15` : "#fff",
                color: symbol === sym ? PINK : DARK,
                fontFamily: "var(--font-jost)",
                fontSize: 13,
                fontWeight: symbol === sym ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
                outline: "none",
              }}
            >
              {SYMBOL_LABELS[sym]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Color Pickers ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, color: DARK }}>
          Colors
        </div>
        <ColorPickerRow label="Primary" value={colorPrimary} onChange={(c) => update("colorPrimary", c)} />
        <ColorPickerRow label="Secondary" value={colorSecondary} onChange={(c) => update("colorSecondary", c)} />
        <ColorPickerRow label="Accent" value={colorAccent} onChange={(c) => update("colorAccent", c)} />
      </div>

      {/* ── Save Button ── */}
      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "16px 0",
          borderRadius: 50,
          background: PINK,
          color: "#fff",
          fontFamily: "var(--font-jost)",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.04em",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(255,31,125,0.3)",
          transition: "opacity 0.15s",
        }}
      >
        Save Crest →
      </button>
    </div>
  );
}
