"use client";

import { useState, useRef } from "react";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const GOLD  = "#D4A853";
const PAPER = "#FEFCF7";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CrestConfig {
  shape:          "shield" | "oval" | "circle" | "arch" | "banner";
  symbol:         "flower" | "star" | "leaf" | "crown" | "book" | "flame" | "moon" | "sun" | "rose" | "diamond";
  font:           "serif" | "condensed" | "script" | "slab";
  colorPrimary:   string;
  colorSecondary: string;
  colorAccent:    string;
  showBannerText: boolean;
  bannerText:     string;
  memberCount?:   number;
  foundedYear?:   number;
}

interface Props {
  clubName:       string;
  initialConfig?: Partial<CrestConfig>;
  memberCount?:   number;
  foundedYear?:   number;
  onSave:         (config: CrestConfig, svgString: string) => void;
}

const DEFAULTS: CrestConfig = {
  shape:          "oval",
  symbol:         "flower",
  font:           "serif",
  colorPrimary:   DARK,
  colorSecondary: PAPER,
  colorAccent:    GOLD,
  showBannerText: true,
  bannerText:     "EST. 2026",
};

// ── Color palettes ────────────────────────────────────────────────────────────

const SWATCHES = [
  "#1C1B1C","#2D1B33","#0E0C0A","#1A2744",
  "#FF1F7D","#C00055","#FF69B4","#FFB6D0",
  "#D4A853","#B8860B","#F5DEB3","#FFF8EE",
  "#2E5C3E","#4A7C59","#8FBC8F","#E8F5E9",
  "#FEFCF7","#F5F0E8","#EDE8DF","#D6CCB8",
];

const FONT_LABEL: Record<CrestConfig["font"], string> = {
  serif:     "Playfair",
  condensed: "Jost",
  script:    "Caveat",
  slab:      "Fraunces",
};

const FONT_CSS: Record<CrestConfig["font"], string> = {
  serif:     "var(--font-playfair, Georgia, serif)",
  condensed: "var(--font-jost, Arial Narrow, sans-serif)",
  script:    "var(--font-caveat, cursive)",
  slab:      "var(--font-fraunces, Palatino Linotype, serif)",
};

// ── Shape geometry ────────────────────────────────────────────────────────────

function getShapeMeta(shape: CrestConfig["shape"]): {
  viewBox: string; textY: number; symbolY: number;
} {
  switch (shape) {
    case "shield":  return { viewBox: "0 0 200 210", textY: 52,  symbolY: 120 };
    case "oval":    return { viewBox: "0 0 200 240", textY: 52,  symbolY: 132 };
    case "circle":  return { viewBox: "0 0 200 200", textY: 50,  symbolY: 110 };
    case "arch":    return { viewBox: "0 0 200 210", textY: 56,  symbolY: 124 };
    case "banner":  return { viewBox: "0 0 200 215", textY: 56,  symbolY: 124 };
  }
}

function ShapeOutline({ shape, fill, stroke }: { shape: CrestConfig["shape"]; fill: string; stroke: string }) {
  switch (shape) {
    case "oval":
      return (
        <>
          <ellipse cx="100" cy="122" rx="88" ry="108" fill={fill} />
          <ellipse cx="100" cy="122" rx="79" ry="99"  fill="none" stroke={stroke} strokeWidth="1.5" />
          <ellipse cx="100" cy="122" rx="73" ry="93"  fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
        </>
      );
    case "shield":
      return (
        <>
          <path d="M100,12 L184,42 L184,112 Q184,172 100,196 Q16,172 16,112 L16,42 Z" fill={fill} />
          <path d="M100,22 L174,48 L174,114 Q174,164 100,184 Q26,164 26,114 L26,48 Z" fill="none" stroke={stroke} strokeWidth="1.5" />
        </>
      );
    case "circle":
      return (
        <>
          <circle cx="100" cy="100" r="88"  fill={fill} />
          <circle cx="100" cy="100" r="79"  fill="none" stroke={stroke} strokeWidth="1.5" />
          <circle cx="100" cy="100" r="73"  fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
        </>
      );
    case "arch":
      return (
        <>
          <path d="M18,196 L18,80 Q18,12 100,12 Q182,12 182,80 L182,196 Z" fill={fill} />
          <path d="M28,190 L28,82 Q28,24 100,24 Q172,24 172,82 L172,190 Z" fill="none" stroke={stroke} strokeWidth="1.5" />
        </>
      );
    case "banner":
      return (
        <>
          <path d="M12,52 L12,164 L100,198 L188,164 L188,52 Q188,12 100,12 Q12,12 12,52 Z" fill={fill} />
          <path d="M22,58 L22,158 L100,186 L178,158 L178,58 Q178,24 100,24 Q22,24 22,58 Z" fill="none" stroke={stroke} strokeWidth="1.5" />
        </>
      );
  }
}

function SymbolSVG({ symbol, color, accent, cx = 100, cy = 110, s = 1 }: {
  symbol: CrestConfig["symbol"]; color: string; accent: string; cx?: number; cy?: number; s?: number;
}) {
  switch (symbol) {
    case "flower":
      return (
        <g transform={`translate(${cx},${cy})`}>
          {[0,72,144,216,288].map((deg, i) => (
            <ellipse key={i} cx="0" cy={-18 * s} rx={7 * s} ry={12 * s}
              fill={color} opacity="0.9" transform={`rotate(${deg})`} />
          ))}
          <circle cx="0" cy="0" r={9 * s} fill={accent} />
          <circle cx="0" cy="0" r={5 * s} fill={color} />
        </g>
      );
    case "rose":
      return (
        <g transform={`translate(${cx},${cy})`}>
          {[0,45,90,135,180,225,270,315].map((deg, i) => (
            <ellipse key={i} cx="0" cy={-14 * s} rx={5 * s} ry={9 * s}
              fill={color} opacity={i < 4 ? 0.65 : 0.85} transform={`rotate(${deg})`} />
          ))}
          {[0,60,120,180,240,300].map((deg, i) => (
            <ellipse key={i} cx="0" cy={-7 * s} rx={3.5 * s} ry={6 * s}
              fill={accent} opacity="0.8" transform={`rotate(${deg + 30})`} />
          ))}
          <circle cx="0" cy="0" r={5 * s} fill={color} />
        </g>
      );
    case "star":
      return (
        <g transform={`translate(${cx},${cy})`}>
          <polygon fill={color}
            points={Array.from({ length: 5 }, (_, i) => {
              const a1 = (i * 72 - 90) * Math.PI / 180;
              const a2 = ((i * 72 + 36) - 90) * Math.PI / 180;
              return `${Math.cos(a1)*22*s},${Math.sin(a1)*22*s} ${Math.cos(a2)*10*s},${Math.sin(a2)*10*s}`;
            }).join(" ")} />
          <circle cx="0" cy="0" r={5 * s} fill={accent} />
        </g>
      );
    case "crown":
      return (
        <g transform={`translate(${cx - 22*s},${cy - 16*s})`}>
          <path d={`M0,${28*s} L0,${14*s} L${10*s},${22*s} L${22*s},0 L${34*s},${22*s} L${44*s},${14*s} L${44*s},${28*s} Z`} fill={color} />
          <rect x={0} y={28*s} width={44*s} height={6*s} rx={2} fill={accent} />
          {[8,22,36].map(x => <circle key={x} cx={x*s} cy={28*s} r={3*s} fill={accent} />)}
        </g>
      );
    case "leaf":
      return (
        <g transform={`translate(${cx},${cy})`}>
          <path d={`M0,${-24*s} Q${20*s},${-10*s} ${18*s},${10*s} Q${10*s},${22*s} 0,${24*s} Q${-10*s},${22*s} ${-18*s},${10*s} Q${-20*s},${-10*s} 0,${-24*s} Z`} fill={color} />
          <line x1="0" y1={-22*s} x2="0" y2={22*s} stroke={accent} strokeWidth={1.5*s} />
        </g>
      );
    case "book":
      return (
        <g transform={`translate(${cx-20*s},${cy-16*s})`}>
          <rect x={0} y={0} width={40*s} height={32*s} rx={3} fill={color} />
          <line x1={20*s} y1={0} x2={20*s} y2={32*s} stroke={accent} strokeWidth={2*s} />
          {[6,12,18,24].map(y => <line key={y} x1={3*s} y1={y*s} x2={17*s} y2={y*s} stroke={accent} strokeWidth={s} opacity="0.5" />)}
          {[6,12,18,24].map(y => <line key={y} x1={23*s} y1={y*s} x2={37*s} y2={y*s} stroke={accent} strokeWidth={s} opacity="0.5" />)}
        </g>
      );
    case "flame":
      return (
        <g transform={`translate(${cx},${cy})`}>
          <path d={`M0,${24*s} Q${-18*s},${6*s} ${-10*s},${-10*s} Q${-4*s},${-22*s} 0,${-26*s} Q${4*s},${-14*s} ${2*s},${-4*s} Q${12*s},${-18*s} ${8*s},${-28*s} Q${22*s},${-8*s} ${18*s},${6*s} Q${18*s},${22*s} 0,${24*s} Z`} fill={color} />
          <path d={`M0,${16*s} Q${-8*s},${4*s} ${-3*s},${-4*s} Q0,${-10*s} 0,${-12*s} Q${1*s},${-6*s} 0,${-2*s} Q${6*s},${-8*s} ${4*s},${0} Q${8*s},${10*s} 0,${16*s} Z`} fill={accent} opacity="0.8" />
        </g>
      );
    case "moon":
      return (
        <g transform={`translate(${cx},${cy})`}>
          <path d={`M${8*s},${-22*s} A${24*s},${24*s} 0 1 0 ${8*s},${22*s} A${16*s},${16*s} 0 1 1 ${8*s},${-22*s} Z`} fill={color} />
          <circle cx={14*s} cy={-14*s} r={3*s} fill={accent} />
          <circle cx={18*s} cy={0}      r={2*s} fill={accent} opacity="0.6" />
        </g>
      );
    case "sun":
      return (
        <g transform={`translate(${cx},${cy})`}>
          {Array.from({length:8},(_,i) => {
            const a = (i*45-90)*Math.PI/180;
            return <line key={i} x1={Math.cos(a)*13*s} y1={Math.sin(a)*13*s} x2={Math.cos(a)*22*s} y2={Math.sin(a)*22*s} stroke={color} strokeWidth={2.5*s} strokeLinecap="round"/>;
          })}
          <circle cx="0" cy="0" r={12*s} fill={color} />
          <circle cx="0" cy="0" r={7*s}  fill={accent} />
        </g>
      );
    case "diamond":
      return (
        <g transform={`translate(${cx},${cy})`}>
          <polygon points={`0,${-22*s} ${17*s},0 0,${22*s} ${-17*s},0`} fill={color} />
          <polygon points={`0,${-13*s} ${10*s},0 0,${13*s} ${-10*s},0`} fill={accent} opacity="0.8" />
        </g>
      );
  }
}

// ── Rendered crest (React) ────────────────────────────────────────────────────

export function CrestSVG({ config, clubName, size = 200 }: {
  config: CrestConfig; clubName: string; size?: number;
}) {
  const { shape, symbol, font, colorPrimary, colorSecondary, colorAccent, showBannerText, bannerText } = config;
  const meta = getShapeMeta(shape);
  const fontFamily = FONT_CSS[font];
  const short = clubName.length > 14 ? clubName.slice(0,14).toUpperCase() : clubName.toUpperCase();
  const fontSize = short.length > 10 ? 11 : short.length > 7 ? 12 : 13;

  return (
    <svg viewBox={meta.viewBox} width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <defs>
        <filter id="cs">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>

      <g filter="url(#cs)">
        <ShapeOutline shape={shape} fill={colorPrimary} stroke={colorAccent} />
      </g>

      {/* Decorative divider */}
      <line x1="52" y1={meta.textY+12} x2="148" y2={meta.textY+12} stroke={colorAccent} strokeWidth="0.8" opacity="0.7" />
      <polygon points={`100,${meta.textY+9} 104,${meta.textY+12} 100,${meta.textY+15} 96,${meta.textY+12}`} fill={colorAccent} />

      {/* Club name */}
      <text x="100" y={meta.textY} textAnchor="middle" dominantBaseline="middle"
        fontFamily={fontFamily} fontWeight="700" fontSize={fontSize}
        letterSpacing={font === "condensed" ? "0.18em" : "0.09em"} fill={colorSecondary}>
        {short}
      </text>

      {/* Symbol */}
      <SymbolSVG symbol={symbol} color={colorSecondary} accent={colorAccent} cx={100} cy={meta.symbolY} s={0.82} />

      {/* Banner */}
      {showBannerText && bannerText && (
        <text x="100" y={meta.symbolY+34} textAnchor="middle" dominantBaseline="middle"
          fontFamily={fontFamily} fontWeight="400" fontSize="8"
          letterSpacing="0.22em" fill={colorAccent} opacity="0.85">
          {bannerText.toUpperCase()}
        </text>
      )}

      {/* Living crest milestone ring */}
      {(config.memberCount ?? 0) >= 50 && (
        <circle cx="100" cy="100" r="65" fill="none" stroke={colorAccent} strokeWidth="0.6" strokeDasharray="3 3" opacity="0.4" />
      )}
    </svg>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {SWATCHES.map(s => (
          <button key={s} onClick={() => onChange(s)} style={{
            width: 28, height: 28, borderRadius: "50%", background: s, cursor: "pointer", flexShrink: 0,
            border: value === s ? `3px solid ${PINK}` : "2px solid rgba(0,0,0,0.1)",
            boxShadow: value === s ? `0 0 0 2px white, 0 0 0 4px ${PINK}` : "none",
            transition: "all 0.15s",
          }} />
        ))}
        <button onClick={() => ref.current?.click()} style={{
          width: 28, height: 28, borderRadius: "50%", cursor: "pointer", flexShrink: 0,
          background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)",
          border: "2px solid rgba(0,0,0,0.12)",
        }} />
        <input ref={ref} type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ position: "absolute", opacity: 0, width: 1, height: 1 }} />
      </div>
    </div>
  );
}

function ChipRow<T extends string>({ label, options, value, onChange }: {
  label: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map(o => (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            padding: "8px 16px", borderRadius: "100px", cursor: "pointer",
            border: value === o.value ? `2px solid ${PINK}` : "1.5px solid #E0D8CF",
            background: value === o.value ? PINK : "white",
            color: value === o.value ? "white" : DARK,
            fontFamily: "var(--font-jost)", fontSize: 13,
            fontWeight: value === o.value ? 700 : 400, transition: "all 0.15s",
          }}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function ClubCrestGenerator({ clubName, initialConfig, memberCount, foundedYear, onSave }: Props) {
  const [cfg, setCfg] = useState<CrestConfig>({
    ...DEFAULTS, ...initialConfig, memberCount, foundedYear,
    bannerText: foundedYear ? `EST. ${foundedYear}` : DEFAULTS.bannerText,
  });

  const set = <K extends keyof CrestConfig>(key: K, val: CrestConfig[K]) =>
    setCfg(p => ({ ...p, [key]: val }));

  const handleSave = () => {
    // Build a minimal SVG string for storage
    const meta = getShapeMeta(cfg.shape);
    const short = clubName.length > 14 ? clubName.slice(0,14).toUpperCase() : clubName.toUpperCase();
    const svgStr = `<svg viewBox="${meta.viewBox}" xmlns="http://www.w3.org/2000/svg"><text x="100" y="${meta.textY}" text-anchor="middle" font-size="13" fill="${cfg.colorSecondary}">${short}</text></svg>`;
    onSave(cfg, svgStr);
  };

  return (
    <div style={{ background: PAPER, minHeight: "100svh", paddingBottom: 40 }}>
      {/* Live preview */}
      <div style={{
        padding: "40px 0 28px", display: "flex", flexDirection: "column", alignItems: "center",
        background: `linear-gradient(160deg, ${cfg.colorPrimary}18, ${cfg.colorAccent}0A)`,
        borderBottom: "1px solid #F0EBE3",
      }}>
        <CrestSVG config={cfg} clubName={clubName} size={190} />
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#bbb", marginTop: 14, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Live preview
        </p>
      </div>

      <div style={{ padding: "28px 20px 0" }}>
        <ChipRow label="Shape"
          options={[{value:"oval",label:"Oval"},{value:"shield",label:"Shield"},{value:"circle",label:"Circle"},{value:"arch",label:"Arch"},{value:"banner",label:"Banner"}]}
          value={cfg.shape} onChange={v => set("shape", v)} />

        <ChipRow label="Symbol"
          options={[{value:"flower",label:"Flower"},{value:"rose",label:"Rose"},{value:"star",label:"Star"},{value:"crown",label:"Crown"},{value:"leaf",label:"Leaf"},{value:"book",label:"Book"},{value:"flame",label:"Flame"},{value:"moon",label:"Moon"},{value:"sun",label:"Sun"},{value:"diamond",label:"Diamond"}]}
          value={cfg.symbol} onChange={v => set("symbol", v)} />

        <ChipRow label="Font"
          options={(["serif","condensed","script","slab"] as CrestConfig["font"][]).map(f => ({ value: f, label: FONT_LABEL[f] }))}
          value={cfg.font} onChange={v => set("font", v)} />

        <ColorPicker label="Badge color"     value={cfg.colorPrimary}   onChange={v => set("colorPrimary", v)} />
        <ColorPicker label="Text & symbol"   value={cfg.colorSecondary} onChange={v => set("colorSecondary", v)} />
        <ColorPicker label="Accent & detail" value={cfg.colorAccent}    onChange={v => set("colorAccent", v)} />

        {/* Banner text toggle */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: 10 }}>Banner text</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => set("showBannerText", !cfg.showBannerText)} style={{
              padding: "8px 16px", borderRadius: "100px", cursor: "pointer",
              border: cfg.showBannerText ? `2px solid ${PINK}` : "1.5px solid #E0D8CF",
              background: cfg.showBannerText ? PINK : "white",
              color: cfg.showBannerText ? "white" : DARK,
              fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600,
            }}>{cfg.showBannerText ? "On" : "Off"}</button>
            {cfg.showBannerText && (
              <input value={cfg.bannerText}
                onChange={e => set("bannerText", e.target.value.slice(0,16))}
                placeholder="EST. 2026"
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 12,
                  border: "1.5px solid #E0D8CF", background: "white",
                  fontFamily: "var(--font-jost)", fontSize: 14, color: DARK, outline: "none",
                }} />
            )}
          </div>
        </div>

        {(memberCount ?? 0) >= 50 && (
          <div style={{ padding: "14px 16px", background: "#FFF0F6", borderRadius: 14, marginBottom: 24, border: `1px solid #FFD6E8` }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: PINK, margin: 0 }}>
              ✦ Your crest has earned a milestone ring — {memberCount} members strong.
            </p>
          </div>
        )}

        <button onClick={handleSave} style={{
          width: "100%", padding: "18px", borderRadius: "100px", border: "none",
          background: PINK, color: "white", fontFamily: "var(--font-jost)",
          fontWeight: 700, fontSize: 15, letterSpacing: "0.06em", cursor: "pointer",
        }}>
          Save Crest →
        </button>

        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "#aaa", textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
          "Every great women's club started with two women who felt exactly the same way about something." — Yande ✦
        </p>
      </div>
    </div>
  );
}
