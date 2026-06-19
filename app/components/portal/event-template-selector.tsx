"use client";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";
const GOLD  = "#D4A853";
const BOARD = "#0E0C0A";

// ── Template definitions ──────────────────────────────────────────────────────

const TEMPLATES = [
  {
    key: "invitation",
    name: "The Invitation",
    tagline: "Feels like a real card",
    defaultAccent: "#8B1A3C",
    preview: {
      bg: "#FEFCF7",
      border: "1.5px solid rgba(139,26,60,0.25)",
      fontFamily: "var(--font-playfair)",
    },
    MiniPreview: ({ accent }: { accent: string }) => (
      <div style={{
        width: "100%", height: "100%",
        background: "#FEFCF7",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 4, padding: "10px 8px",
        fontFamily: "var(--font-playfair)",
        position: "relative",
      }}>
        {/* Decorative border */}
        <div style={{
          position: "absolute", inset: 5,
          border: `1px solid ${accent}44`,
          borderRadius: 4,
        }} />
        <div style={{ width: 24, height: 1, background: accent, marginBottom: 2 }} />
        <p style={{ fontSize: 8, fontWeight: 700, color: accent, letterSpacing: "0.05em", textAlign: "center", fontStyle: "italic" }}>
          You're invited
        </p>
        <p style={{ fontSize: 6, color: "rgba(0,0,0,0.4)", fontFamily: "var(--font-jost)" }}>
          An intimate evening
        </p>
        <div style={{ width: 24, height: 1, background: accent, marginTop: 2 }} />
      </div>
    ),
  },
  {
    key: "editorial",
    name: "Editorial",
    tagline: "Magazine spread feel",
    defaultAccent: PINK,
    MiniPreview: ({ accent }: { accent: string }) => (
      <div style={{
        width: "100%", height: "100%",
        background: `linear-gradient(175deg, ${DARK} 0%, #2A1A24 100%)`,
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end",
        padding: "10px 8px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "55%",
          background: `linear-gradient(135deg, ${accent}33, ${accent}11)`,
        }} />
        <div style={{
          position: "absolute", top: 8, left: 8,
          background: accent, borderRadius: 2,
          padding: "2px 5px",
        }}>
          <p style={{ fontSize: 5, fontWeight: 900, color: "white", fontFamily: "var(--font-jost)", letterSpacing: "0.1em" }}>TONIGHT</p>
        </div>
        <p style={{ fontSize: 9, fontWeight: 900, color: "white", fontFamily: "var(--font-jost)", lineHeight: 1.2, position: "relative" }}>
          MUSEUM<br/>NIGHT OUT
        </p>
        <div style={{ width: 16, height: 2, background: accent, marginTop: 3 }} />
      </div>
    ),
  },
  {
    key: "cozy",
    name: "Cozy",
    tagline: "Warm & intimate",
    defaultAccent: GOLD,
    MiniPreview: ({ accent }: { accent: string }) => (
      <div style={{
        width: "100%", height: "100%",
        background: "#FFF8EE",
        display: "flex", flexDirection: "column",
        alignItems: "flex-start", justifyContent: "center",
        padding: "10px 10px",
        gap: 3,
      }}>
        <p style={{
          fontSize: 10, color: accent,
          fontFamily: "var(--font-caveat)",
          fontWeight: 700,
        }}>
          come over ♡
        </p>
        <p style={{
          fontSize: 7, color: DARK,
          fontFamily: "var(--font-fraunces)",
          fontWeight: 600, lineHeight: 1.3,
        }}>
          Saturday Brunch<br/>at mine
        </p>
        <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
          {["🕯️","🥂","✨"].map(e => (
            <span key={e} style={{ fontSize: 8 }}>{e}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "minimal",
    name: "Minimal",
    tagline: "Clean & modern",
    defaultAccent: DARK,
    MiniPreview: ({ accent }: { accent: string }) => (
      <div style={{
        width: "100%", height: "100%",
        background: "white",
        display: "flex", flexDirection: "column",
        justifyContent: "center",
        padding: "10px 10px",
        gap: 4,
        borderLeft: `3px solid ${accent}`,
      }}>
        <p style={{ fontSize: 7, fontWeight: 900, color: accent, fontFamily: "var(--font-jost)", letterSpacing: "0.15em" }}>
          GATHERING
        </p>
        <p style={{ fontSize: 9, fontWeight: 700, color: DARK, fontFamily: "var(--font-jost)", lineHeight: 1.2 }}>
          Sunday<br/>Morning Walk
        </p>
        <div style={{ width: "100%", height: 1, background: "rgba(0,0,0,0.08)", marginTop: 2 }} />
        <p style={{ fontSize: 6, color: "rgba(0,0,0,0.4)", fontFamily: "var(--font-jost)" }}>
          Central Park · 9:00 AM
        </p>
      </div>
    ),
  },
] as const;

type TemplateKey = typeof TEMPLATES[number]["key"];

// ── Color swatches ────────────────────────────────────────────────────────────

const ACCENT_SWATCHES = [
  PINK,
  "#E8006A",
  GOLD,
  "#A855F7",
  "#06B6D4",
  "#10B981",
  DARK,
  "#4B5563",
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  value: string;
  onChange: (template: string) => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
}

// ── Main component ────────────────────────────────────────────────────────────

export function EventTemplateSelector({ value, onChange, accentColor, onAccentColorChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── TEMPLATE CARDS ── */}
      <div>
        <p style={{
          fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800,
          letterSpacing: "0.22em", color: "rgba(0,0,0,0.35)", marginBottom: 12,
        }}>
          CARD STYLE
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {TEMPLATES.map(tpl => {
            const active = value === tpl.key;
            return (
              <button
                key={tpl.key}
                onClick={() => {
                  onChange(tpl.key);
                  // Set suggested accent unless user already picked a non-default
                  onAccentColorChange(tpl.defaultAccent);
                }}
                style={{
                  background: "white",
                  border: `2px solid ${active ? PINK : "rgba(0,0,0,0.08)"}`,
                  borderRadius: 16, padding: "10px",
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.18s",
                  boxShadow: active ? `0 4px 18px ${PINK}22` : "0 2px 8px rgba(0,0,0,0.04)",
                  position: "relative",
                }}
              >
                {/* Selected check */}
                {active && (
                  <div style={{
                    position: "absolute", top: 8, right: 8,
                    width: 18, height: 18, borderRadius: "50%",
                    background: PINK,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 1,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}

                {/* Mini card preview */}
                <div style={{
                  width: "100%", height: 100,
                  borderRadius: 10, overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.06)",
                  marginBottom: 8,
                }}>
                  <tpl.MiniPreview accent={active ? accentColor : tpl.defaultAccent} />
                </div>

                {/* Label */}
                <p style={{
                  fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800,
                  color: active ? PINK : DARK, lineHeight: 1.2,
                }}>
                  {tpl.name}
                </p>
                <p style={{
                  fontFamily: "var(--font-jost)", fontSize: "9px",
                  color: "rgba(0,0,0,0.4)", marginTop: 2,
                }}>
                  {tpl.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ACCENT COLOR ── */}
      <div>
        <p style={{
          fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800,
          letterSpacing: "0.22em", color: "rgba(0,0,0,0.35)", marginBottom: 12,
        }}>
          ACCENT COLOR
        </p>

        {/* Swatches */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {ACCENT_SWATCHES.map(c => (
            <button
              key={c}
              onClick={() => onAccentColorChange(c)}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: c, border: "3px solid transparent",
                cursor: "pointer", padding: 0,
                boxShadow: accentColor === c
                  ? `0 0 0 2px white, 0 0 0 4px ${c}`
                  : "0 2px 6px rgba(0,0,0,0.15)",
                transform: accentColor === c ? "scale(1.1)" : "scale(1)",
                transition: "all 0.15s",
              }}
            />
          ))}

          {/* Custom color picker */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="color"
              value={accentColor}
              onChange={e => onAccentColorChange(e.target.value)}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "2px solid rgba(0,0,0,0.12)",
                cursor: "pointer", padding: 2,
                background: "white",
              }}
              title="Pick a custom color"
            />
          </div>
        </div>

        {/* Color value display */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6,
            background: accentColor,
            border: "1.5px solid rgba(0,0,0,0.1)",
            flexShrink: 0,
          }} />
          <p style={{
            fontFamily: "var(--font-jost)", fontSize: "11px",
            fontWeight: 700, color: DARK,
            fontVariantNumeric: "tabular-nums",
          }}>
            {accentColor.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
