"use client";

import { useState, useRef } from "react";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BannerConfig {
  template:    "editorial" | "street" | "gradient" | "minimal";
  colorBg:     string;
  colorText:   string;
  colorAccent: string;
  clubName:    string;
  tagline:     string;
  showTagline: boolean;
}

interface Props {
  initialConfig?: Partial<BannerConfig>;
  onSave: (config: BannerConfig) => void;
}

const DEFAULTS: BannerConfig = {
  template:    "editorial",
  colorBg:     "#111111",
  colorText:   PAPER,
  colorAccent: PINK,
  clubName:    "Club Name",
  tagline:     "A club for women who know.",
  showTagline: true,
};

// ── Color swatches ────────────────────────────────────────────────────────────

const SWATCHES = [
  "#111111","#1C1B1C","#2D1B33","#FF1F7D","#C00055","#FF69B4",
  "#FFF8F0","#FEFCF7","#F6F1EB","#D4A853","#2E5C3E","#1A2744",
];

// ── BannerSVG ─────────────────────────────────────────────────────────────────

export function BannerSVG({
  config,
  width,
  height,
}: {
  config: BannerConfig;
  width?: number | string;
  height?: number | string;
}) {
  const { template, colorBg, colorText, colorAccent, clubName, tagline, showTagline } = config;

  const displayWidth  = width  ?? "100%";
  const displayHeight = height ?? "100%";

  // Clamp club name for SVG display
  const name = clubName.trim() || "Club Name";
  const nameUpper = name.toUpperCase();

  const svgProps = {
    viewBox: "0 0 600 200",
    width:   displayWidth,
    height:  displayHeight,
    xmlns:   "http://www.w3.org/2000/svg",
    style:   { display: "block" as const },
    preserveAspectRatio: "xMidYMid meet",
  };

  if (template === "editorial") {
    // White/cream editorial — magazine-like, Playfair serif name on left, thin accent line
    const bg       = colorBg.startsWith("#fff") || colorBg === "#FFF8F0" || colorBg === "#FEFCF7" || colorBg === "#F6F1EB" ? colorBg : "#FEFCF7";
    const textCol  = colorText;
    const accentCol = colorAccent;
    const nameFontSize = name.length > 20 ? 32 : name.length > 14 ? 38 : 46;
    return (
      <svg {...svgProps}>
        {/* Background */}
        <rect width="600" height="200" fill={bg} />
        {/* Subtle texture lines */}
        <line x1="0" y1="190" x2="600" y2="190" stroke={accentCol} strokeWidth="2" opacity="0.9" />
        <line x1="0" y1="194" x2="600" y2="194" stroke={accentCol} strokeWidth="0.4" opacity="0.4" />
        {/* Left accent bar */}
        <rect x="40" y="40" width="3" height={showTagline ? 120 : 90} fill={accentCol} />
        {/* BLOOMBAY CLUB small label */}
        <text x="56" y="60"
          fontFamily="var(--font-jost, Arial, sans-serif)"
          fontWeight="700" fontSize="9"
          letterSpacing="0.28em" fill={accentCol} opacity="0.8">
          BLOOMBAY CLUB
        </text>
        {/* Club name */}
        <text x="56" y={showTagline ? 118 : 128}
          fontFamily="var(--font-playfair, Georgia, serif)"
          fontStyle="italic"
          fontWeight="900" fontSize={nameFontSize}
          fill={textCol} dominantBaseline="auto">
          {name}
        </text>
        {/* Tagline */}
        {showTagline && tagline && (
          <text x="56" y="148"
            fontFamily="var(--font-jost, Arial, sans-serif)"
            fontWeight="400" fontSize="12"
            letterSpacing="0.05em"
            fill={textCol} opacity="0.55">
            {tagline}
          </text>
        )}
        {/* Right decorative diamond */}
        <polygon points="540,90 556,100 540,110 524,100"
          fill="none" stroke={accentCol} strokeWidth="1" opacity="0.35" />
        <polygon points="540,95 550,100 540,105 530,100"
          fill={accentCol} opacity="0.15" />
      </svg>
    );
  }

  if (template === "street") {
    // Dark bg, huge bold condensed all-caps name, colored accent bar at bottom
    const bg        = colorBg;
    const textCol   = colorText;
    const accentCol = colorAccent;
    const nameFontSize = name.length > 22 ? 40 : name.length > 14 ? 52 : 66;
    return (
      <svg {...svgProps}>
        {/* Background */}
        <rect width="600" height="200" fill={bg} />
        {/* Accent bar at bottom */}
        <rect x="0" y="183" width="600" height="17" fill={accentCol} />
        {/* Thin accent bar at top */}
        <rect x="0" y="0" width="600" height="4" fill={accentCol} opacity="0.7" />
        {/* Club name — huge and condensed */}
        <text x="30" y={showTagline ? 120 : 140}
          fontFamily="var(--font-jost, 'Arial Narrow', sans-serif)"
          fontWeight="900" fontSize={nameFontSize}
          letterSpacing="-0.01em"
          fill={textCol}>
          {nameUpper}
        </text>
        {/* Tagline over accent bar */}
        {showTagline && tagline && (
          <text x="30" y="158"
            fontFamily="var(--font-jost, sans-serif)"
            fontWeight="700" fontSize="10"
            letterSpacing="0.18em"
            fill={textCol} opacity="0.55">
            {tagline.toUpperCase()}
          </text>
        )}
        {/* Right accent slash */}
        <line x1="556" y1="10" x2="590" y2="180" stroke={textCol} strokeWidth="1.5" opacity="0.12" />
        <line x1="546" y1="10" x2="580" y2="180" stroke={textCol} strokeWidth="0.6" opacity="0.07" />
      </svg>
    );
  }

  if (template === "gradient") {
    // colorBg fills BG with horizontal gradient, large name, vignette
    const accentCol = colorAccent;
    const textCol   = colorText;
    const nameFontSize = name.length > 20 ? 34 : name.length > 14 ? 42 : 52;
    return (
      <svg {...svgProps}>
        <defs>
          <linearGradient id="gradBg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={colorBg} stopOpacity="1" />
            <stop offset="60%"  stopColor={colorBg} stopOpacity="0.7" />
            <stop offset="100%" stopColor={colorBg} stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="gradVignette" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.4)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <radialGradient id="gradRadial" cx="30%" cy="50%" r="70%">
            <stop offset="0%"   stopColor={colorBg} stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        {/* Dark base background */}
        <rect width="600" height="200" fill="#0A0A0A" />
        {/* Gradient overlay */}
        <rect width="600" height="200" fill="url(#gradBg)" />
        {/* Radial glow */}
        <rect width="600" height="200" fill="url(#gradRadial)" />
        {/* Top vignette */}
        <rect width="600" height="200" fill="url(#gradVignette)" opacity="0.5" />
        {/* Accent line */}
        <line x1="40" y1="155" x2="240" y2="155" stroke={accentCol} strokeWidth="1.5" opacity="0.7" />
        {/* Club name */}
        <text x="40" y={showTagline ? 135 : 120}
          fontFamily="var(--font-playfair, Georgia, serif)"
          fontStyle="italic"
          fontWeight="900" fontSize={nameFontSize}
          fill={textCol}>
          {name}
        </text>
        {/* Tagline */}
        {showTagline && tagline && (
          <text x="41" y="172"
            fontFamily="var(--font-jost, sans-serif)"
            fontWeight="400" fontSize="11"
            letterSpacing="0.1em"
            fill={textCol} opacity="0.6">
            {tagline}
          </text>
        )}
        {/* Accent diamond */}
        <polygon points="560,95 574,100 560,105 546,100"
          fill={accentCol} opacity="0.6" />
        <polygon points="560,90 578,100 560,110 542,100"
          fill="none" stroke={accentCol} strokeWidth="1" opacity="0.3" />
      </svg>
    );
  }

  // minimal
  const textCol   = colorText;
  const accentCol = colorAccent;
  const borderCol = colorBg;
  const nameFontSize = name.length > 20 ? 30 : name.length > 14 ? 38 : 46;
  return (
    <svg {...svgProps}>
      {/* White background */}
      <rect width="600" height="200" fill={PAPER} />
      {/* Thin border rectangle */}
      <rect x="16" y="16" width="568" height="168" fill="none" stroke={borderCol} strokeWidth="1.5" />
      <rect x="22" y="22" width="556" height="156" fill="none" stroke={accentCol} strokeWidth="0.5" opacity="0.5" />
      {/* Center club name */}
      <text x="300" y={showTagline ? 96 : 104}
        fontFamily="var(--font-playfair, Georgia, serif)"
        fontStyle="italic"
        fontWeight="700" fontSize={nameFontSize}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textCol}
        letterSpacing="0.03em">
        {name}
      </text>
      {/* Thin accent lines flanking name */}
      <line x1="40" y1={showTagline ? 105 : 115} x2="210" y2={showTagline ? 105 : 115}
        stroke={accentCol} strokeWidth="0.8" opacity="0.6" />
      <line x1="390" y1={showTagline ? 105 : 115} x2="560" y2={showTagline ? 105 : 115}
        stroke={accentCol} strokeWidth="0.8" opacity="0.6" />
      {/* Tagline */}
      {showTagline && tagline && (
        <text x="300" y="130"
          fontFamily="var(--font-jost, sans-serif)"
          fontWeight="400" fontSize="11"
          letterSpacing="0.18em"
          textAnchor="middle"
          fill={textCol} opacity="0.4">
          {tagline.toUpperCase()}
        </text>
      )}
      {/* Corner accents */}
      <line x1="16" y1="30" x2="16" y2="16" stroke={accentCol} strokeWidth="2" opacity="0.7" />
      <line x1="16" y1="16" x2="30" y2="16" stroke={accentCol} strokeWidth="2" opacity="0.7" />
      <line x1="570" y1="30" x2="570" y2="16" stroke={accentCol} strokeWidth="2" opacity="0.7" />
      <line x1="570" y1="16" x2="556" y2="16" stroke={accentCol} strokeWidth="2" opacity="0.7" />
      <line x1="16" y1="154" x2="16" y2="168" stroke={accentCol} strokeWidth="2" opacity="0.7" />
      <line x1="16" y1="168" x2="30" y2="168" stroke={accentCol} strokeWidth="2" opacity="0.7" />
      <line x1="570" y1="154" x2="570" y2="168" stroke={accentCol} strokeWidth="2" opacity="0.7" />
      <line x1="570" y1="168" x2="556" y2="168" stroke={accentCol} strokeWidth="2" opacity="0.7" />
    </svg>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#888", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "center" }}>
        {SWATCHES.map(s => (
          <button key={s} onClick={() => onChange(s)} style={{
            width: 28, height: 28, borderRadius: "50%", background: s, cursor: "pointer", flexShrink: 0,
            border: value === s ? `3px solid ${PINK}` : "2px solid rgba(0,0,0,0.1)",
            boxShadow: value === s ? `0 0 0 2px white, 0 0 0 4px ${PINK}` : "none",
            transition: "all 0.15s",
          }} />
        ))}
        <button onClick={() => ref.current?.click()} title="Custom color" style={{
          width: 28, height: 28, borderRadius: "50%", cursor: "pointer", flexShrink: 0,
          background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)",
          border: "2px solid rgba(0,0,0,0.12)",
          position: "relative" as const,
        }}>
          <span style={{ position: "absolute" as const, inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", textShadow: "0 0 3px rgba(0,0,0,0.5)", fontWeight: 900 }}>+</span>
        </button>
        <input ref={ref} type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ position: "absolute" as const, opacity: 0, width: 1, height: 1 }} />
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: value, border: "2px solid rgba(0,0,0,0.15)", flexShrink: 0 }} title={value} />
      </div>
    </div>
  );
}

const TEMPLATE_OPTIONS: {
  value: BannerConfig["template"];
  label: string;
  description: string;
}[] = [
  { value: "editorial", label: "Editorial",  description: "Magazine, elegant serif" },
  { value: "street",    label: "Street",      description: "Bold, graphic, raw" },
  { value: "gradient",  label: "Gradient",    description: "Color wash, cinematic" },
  { value: "minimal",   label: "Minimal",     description: "Thin border, letterpressed" },
];

// ── Main export ───────────────────────────────────────────────────────────────

export function ClubBannerGenerator({ initialConfig, onSave }: Props) {
  const [cfg, setCfg] = useState<BannerConfig>({ ...DEFAULTS, ...initialConfig });

  const set = <K extends keyof BannerConfig>(key: K, val: BannerConfig[K]) =>
    setCfg(p => ({ ...p, [key]: val }));

  return (
    <div style={{ background: PAPER, minHeight: "100svh", paddingBottom: 40 }}>
      {/* Live preview */}
      <div style={{
        padding: "28px 0 28px",
        background: `linear-gradient(160deg, ${cfg.colorBg}18, ${cfg.colorAccent}0A)`,
        borderBottom: "1px solid #F0EBE3",
      }}>
        <div style={{ padding: "0 20px" }}>
          <div style={{
            width: "100%",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
            aspectRatio: "3 / 1",
          }}>
            <BannerSVG config={cfg} width="100%" height="100%" />
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#bbb", marginTop: 14, letterSpacing: "0.12em", textTransform: "uppercase" as const, textAlign: "center" }}>
          Live preview
        </p>
      </div>

      <div style={{ padding: "28px 20px 0" }}>

        {/* ── Template picker ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#888", marginBottom: 14 }}>Template</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {TEMPLATE_OPTIONS.map(t => (
              <button key={t.value} onClick={() => set("template", t.value)} style={{
                padding: "10px 8px 10px", borderRadius: 16, cursor: "pointer",
                border: cfg.template === t.value ? `2.5px solid ${PINK}` : "1.5px solid #E0D8CF",
                background: cfg.template === t.value ? "#FFF0F6" : "white",
                display: "flex", flexDirection: "column" as const, alignItems: "stretch", gap: 8,
                transition: "all 0.15s",
                boxShadow: cfg.template === t.value ? `0 0 0 3px ${PINK}22` : "none",
                overflow: "hidden",
              }}>
                {/* Mini banner preview */}
                <div style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "3 / 1" }}>
                  <BannerSVG
                    config={{ ...cfg, template: t.value, clubName: cfg.clubName || "Club" }}
                    width="100%"
                    height="100%"
                  />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: cfg.template === t.value ? PINK : DARK }}>{t.label}</div>
                  <div style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#aaa", marginTop: 2 }}>{t.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <ColorPicker label="Background" value={cfg.colorBg}     onChange={v => set("colorBg", v)} />
        <ColorPicker label="Text"       value={cfg.colorText}   onChange={v => set("colorText", v)} />
        <ColorPicker label="Accent"     value={cfg.colorAccent} onChange={v => set("colorAccent", v)} />

        {/* Tagline */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#888", marginBottom: 10 }}>Tagline</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => set("showTagline", !cfg.showTagline)} style={{
              padding: "8px 16px", borderRadius: "100px", cursor: "pointer", flexShrink: 0,
              border: cfg.showTagline ? `2px solid ${PINK}` : "1.5px solid #E0D8CF",
              background: cfg.showTagline ? PINK : "white",
              color: cfg.showTagline ? "white" : DARK,
              fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600,
            }}>{cfg.showTagline ? "On" : "Off"}</button>
            {cfg.showTagline && (
              <input
                value={cfg.tagline}
                onChange={e => set("tagline", e.target.value.slice(0, 80))}
                placeholder="A club for women who know."
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 12,
                  border: "1.5px solid #E0D8CF", background: "white",
                  fontFamily: "var(--font-jost)", fontSize: 14, color: DARK, outline: "none",
                }}
              />
            )}
          </div>
        </div>

        <button onClick={() => onSave(cfg)} style={{
          width: "100%", padding: "18px", borderRadius: "100px", border: "none",
          background: PINK, color: "white", fontFamily: "var(--font-jost)",
          fontWeight: 700, fontSize: 15, letterSpacing: "0.06em", cursor: "pointer",
        }}>
          Save Banner →
        </button>
      </div>
    </div>
  );
}
