"use client";

import React from "react";

const PINK = "#FF1F7D";

export interface MenuItem {
  item: string;
  price: string;
  note?: string;
}

export type MenuTemplateStyle = "chalkboard" | "bistro" | "cafe_board" | "weekly_schedule" | "daily_specials";

export interface MenuTemplateProps {
  items: MenuItem[];
  brandName?: string;
  tagline?: string;
  accentColor?: string;
  fontFamily?: string;
  style: MenuTemplateStyle;
}

// ── SVG noise texture for paper/chalk effects ──────────────────────────────

function NoiseTexture({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="noise-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feBlend in="SourceGraphic" mode="multiply"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#noise-filter)" opacity={opacity}/>
    </svg>
  );
}

// ── 1. ChalkboardMenu ──────────────────────────────────────────────────────

function ChalkboardMenu({ items, brandName, tagline, accentColor, fontFamily }: MenuTemplateProps) {
  const accent = accentColor ?? PINK;
  const titleFont = fontFamily ?? "var(--font-playfair)";
  return (
    <div style={{
      position: "relative",
      background: "#1C2B1A",
      borderRadius: 16,
      padding: "28px 24px 20px",
      overflow: "hidden",
      fontFamily: "var(--font-caveat), Caveat, cursive",
    }}>
      <NoiseTexture opacity={0.07} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <p style={{ fontSize: 32, fontStyle: "italic", color: "white", margin: 0, lineHeight: 1.1, fontFamily: titleFont }}>
          {brandName || "Our Menu"}
        </p>
        {tagline && (
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "4px 0 0", fontStyle: "italic" }}>
            {tagline}
          </p>
        )}
      </div>

      {/* Chalk dashed divider */}
      <div style={{ borderTop: "2px dashed rgba(245,240,224,0.5)", marginBottom: 14 }} />

      {/* Section label */}
      <p style={{
        textAlign: "center",
        fontFamily: "var(--font-jost), Jost, sans-serif",
        fontSize: 8,
        fontWeight: 800,
        letterSpacing: "0.3em",
        color: "#F5F0E0",
        textTransform: "uppercase" as const,
        marginBottom: 14,
      }}>
        MENU
      </p>

      {/* Items */}
      {items.map((m, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 16, color: "#F5F0E0", flex: 1, minWidth: 0 }}>{m.item}</span>
            <span style={{ fontSize: 12, color: "rgba(245,240,224,0.5)", flex: 1, textAlign: "center", overflow: "hidden", whiteSpace: "nowrap" as const }}>
              {". . . . . . . . . . . . . . . . . . . ."}
            </span>
            <span style={{ fontSize: 16, color: accent, flexShrink: 0 }}>{m.price}</span>
          </div>
          {m.note && (
            <p style={{ fontSize: 12, color: "rgba(245,240,224,0.5)", fontStyle: "italic", margin: "2px 0 0 0" }}>
              {m.note}
            </p>
          )}
        </div>
      ))}

      {/* Chalk divider */}
      <div style={{ borderTop: "2px dashed rgba(245,240,224,0.3)", margin: "16px 0 12px" }} />

      {/* Footer flourish */}
      <p style={{ textAlign: "center", fontSize: 14, color: "rgba(245,240,224,0.6)", margin: 0, fontStyle: "italic" }}>
        ✦ · MADE FRESH DAILY · ✦
      </p>
    </div>
  );
}

// ── 2. BistroMenu ─────────────────────────────────────────────────────────

function BistroMenu({ items, brandName, tagline, accentColor, fontFamily }: MenuTemplateProps) {
  const accent = accentColor ?? PINK;
  const titleFont = fontFamily ?? "var(--font-playfair)";
  return (
    <div style={{
      position: "relative",
      background: "#FDFAF3",
      borderRadius: 16,
      padding: "24px 22px 20px",
      overflow: "hidden",
    }}>
      <NoiseTexture opacity={0.035} />

      {/* Double rule top */}
      <div style={{ borderTop: "1.5px solid #2C1810", marginBottom: 2 }} />
      <div style={{ borderTop: "0.5px solid #2C1810", marginBottom: 14 }} />

      {/* Brand name */}
      <p style={{
        textAlign: "center",
        fontFamily: titleFont,
        fontSize: 28,
        fontStyle: "italic",
        fontWeight: 900,
        color: "#2C1810",
        margin: "0 0 4px",
      }}>
        {brandName || "Bistro"}
      </p>

      {/* Tagline */}
      {tagline && (
        <p style={{
          textAlign: "center",
          fontFamily: "var(--font-jost), Jost, sans-serif",
          fontSize: 9,
          fontVariant: "small-caps",
          letterSpacing: "0.2em",
          color: "#8B7A6A",
          margin: "0 0 12px",
          textTransform: "uppercase" as const,
        }}>
          {tagline}
        </p>
      )}

      {/* Rule */}
      <div style={{ borderTop: "0.5px solid #2C1810", marginBottom: 16 }} />

      {/* Items */}
      {items.map((m, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            {/* Item name */}
            <span style={{
              fontFamily: titleFont,
              fontSize: 15,
              color: "#2C1810",
              flex: "0 0 auto",
              maxWidth: "55%",
            }}>
              {m.item}
            </span>
            {/* Dotted leader */}
            <span style={{
              flex: 1,
              borderBottom: "1px dotted #B0A090",
              marginBottom: 3,
            }} />
            {/* Price */}
            <span style={{
              fontFamily: "var(--font-jost), Jost, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: "#2C1810",
              flexShrink: 0,
            }}>
              {m.price}
            </span>
          </div>
          {m.note && (
            <p style={{
              fontFamily: titleFont,
              fontSize: 11,
              fontStyle: "italic",
              color: "#9A8A7A",
              margin: "2px 0 0",
            }}>
              {m.note}
            </p>
          )}
          {/* Category accent on certain items */}
          {i === 0 && (
            <p style={{
              fontFamily: "var(--font-jost), Jost, sans-serif",
              fontSize: 8,
              fontWeight: 900,
              letterSpacing: "0.2em",
              color: accent,
              textTransform: "uppercase" as const,
              margin: "0 0 6px",
            }}>
              {m.note || "CHEF'S SELECTION"}
            </p>
          )}
        </div>
      ))}

      {/* Bottom rule */}
      <div style={{ borderTop: "0.5px solid #2C1810", margin: "14px 0 10px" }} />

      {/* Footer */}
      <p style={{
        textAlign: "center",
        fontFamily: "var(--font-caveat), Caveat, cursive",
        fontSize: 14,
        fontStyle: "italic",
        color: "#8B7A6A",
        margin: 0,
      }}>
        Chef&apos;s recommendation — ask your server
      </p>
    </div>
  );
}

// ── 3. CafeBoardMenu ──────────────────────────────────────────────────────

function priceToEmoji(price: string): string {
  const count = (price.match(/\$/g) || []).length;
  if (count === 1) return "☕";
  if (count === 2) return "🥐";
  if (count >= 3) return "🍷";
  return "✦";
}

function CafeBoardMenu({ items, brandName, tagline, accentColor, fontFamily }: MenuTemplateProps) {
  const accent = accentColor ?? "#8B5E3C";
  const titleFont = fontFamily ?? "var(--font-playfair)";
  return (
    <div style={{
      background: "#FBF6EE",
      borderRadius: 16,
      padding: "24px 20px 20px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <p style={{
          fontFamily: "var(--font-jost), Jost, sans-serif",
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          color: "#4A3728",
          margin: "0 0 2px",
        }}>
          TODAY&apos;S
        </p>
        <p style={{
          fontFamily: titleFont,
          fontSize: 38,
          fontStyle: "italic",
          fontWeight: 900,
          color: accent,
          margin: "0 0 8px",
          lineHeight: 1,
        }}>
          Specials
        </p>
        {/* Wavy underline SVG */}
        <svg width="100%" height="10" viewBox="0 0 200 10" preserveAspectRatio="none" style={{ display: "block" }}>
          <path
            d="M0,5 Q25,0 50,5 Q75,10 100,5 Q125,0 150,5 Q175,10 200,5"
            stroke={accent}
            strokeWidth="2"
            fill="none"
          />
        </svg>
        {tagline && (
          <p style={{
            fontFamily: "var(--font-jost), Jost, sans-serif",
            fontSize: 10,
            color: "#9A8A7A",
            margin: "8px 0 0",
          }}>
            {tagline}
          </p>
        )}
      </div>

      {/* Item cards */}
      {items.map((m, i) => (
        <div key={i} style={{
          background: "white",
          borderRadius: 12,
          padding: "12px 14px",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}>
          {/* Emoji */}
          <span style={{ fontSize: 22, flexShrink: 0 }}>{priceToEmoji(m.price)}</span>
          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: titleFont,
              fontSize: 16,
              fontStyle: "italic",
              color: "#2C1810",
              margin: 0,
              lineHeight: 1.2,
            }}>
              {m.item}
            </p>
            {m.note && (
              <p style={{
                fontFamily: "var(--font-jost), Jost, sans-serif",
                fontSize: 10,
                color: "#9A8A7A",
                margin: "2px 0 0",
              }}>
                {m.note}
              </p>
            )}
          </div>
          {/* Price pill */}
          <span style={{
            background: accent,
            color: "white",
            borderRadius: 999,
            padding: "4px 10px",
            fontFamily: "var(--font-jost), Jost, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {m.price}
          </span>
        </div>
      ))}

      {/* Ornament */}
      <p style={{ textAlign: "center", color: "#C0B0A0", fontSize: 14, margin: "12px 0 8px" }}>· · ·</p>

      {/* Footer */}
      <p style={{
        textAlign: "center",
        fontFamily: "var(--font-caveat), Caveat, cursive",
        fontSize: 14,
        fontStyle: "italic",
        color: "#8B7A6A",
        margin: 0,
      }}>
        {brandName || "Our Café"}
      </p>
    </div>
  );
}

// ── 4. WeeklyScheduleMenu ─────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function WeeklyScheduleMenu({ items, brandName, tagline, accentColor, fontFamily }: MenuTemplateProps) {
  const accent = accentColor ?? PINK;
  const titleFont = fontFamily ?? "var(--font-playfair)";
  const brandWord = brandName ? brandName.split(" ")[0].toUpperCase() : "BREAD";
  const effectiveItems = items.length > 0 ? items : [
    { item: "Sourdough", price: "$8" },
    { item: "Rye", price: "$9" },
    { item: "Focaccia", price: "$7" },
  ];

  return (
    <div style={{
      background: "#FBF6EE",
      borderRadius: 16,
      padding: "24px 20px 20px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <p style={{
          fontFamily: "var(--font-jost), Jost, sans-serif",
          fontSize: 42,
          fontWeight: 900,
          textTransform: "uppercase" as const,
          color: "#2C1810",
          margin: 0,
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}>
          {brandWord}
        </p>
        <p style={{
          fontFamily: titleFont,
          fontSize: 28,
          fontStyle: "italic",
          color: accent,
          margin: "2px 0 0",
          lineHeight: 1,
        }}>
          schedule
        </p>
        {tagline && (
          <p style={{
            fontFamily: "var(--font-jost), Jost, sans-serif",
            fontSize: 10,
            color: "#9A8A7A",
            margin: "6px 0 0",
          }}>
            {tagline}
          </p>
        )}
      </div>

      {/* Day rows */}
      {DAYS.map((day, i) => {
        const menuItem = effectiveItems[i % effectiveItems.length];
        return (
          <div key={day}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0" }}>
              {/* Day */}
              <span style={{
                fontFamily: "var(--font-jost), Jost, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: accent,
                width: 28,
                flexShrink: 0,
                textTransform: "uppercase" as const,
              }}>
                {day}
              </span>
              {/* Item */}
              <span style={{
                fontFamily: titleFont,
                fontSize: 14,
                fontStyle: "italic",
                color: "#2C1810",
                flex: 1,
              }}>
                {menuItem.item}
              </span>
              {/* Price */}
              <span style={{
                fontFamily: "var(--font-jost), Jost, sans-serif",
                fontSize: 11,
                color: "#9A8A7A",
                flexShrink: 0,
              }}>
                {menuItem.price}
              </span>
            </div>
            {i < DAYS.length - 1 && (
              <div style={{ borderTop: "0.5px solid #E0D8CE" }} />
            )}
          </div>
        );
      })}

      {/* Footer */}
      <p style={{
        fontFamily: "var(--font-caveat), Caveat, cursive",
        fontSize: 14,
        fontStyle: "italic",
        color: "#9A8A7A",
        margin: "16px 0 0",
        textAlign: "center",
      }}>
        Fresh every day · {brandName || ""}
      </p>
    </div>
  );
}

// ── 5. DailySpecialsMenu ──────────────────────────────────────────────────

const MOCK_ITEMS: MenuItem[] = [
  { item: "Espresso", price: "$4.50", note: "Double shot, silky micro-foam" },
  { item: "Butter Croissant", price: "$3.75", note: "Laminated, baked fresh at 6am" },
  { item: "Avocado Toast", price: "$12.00", note: "Sourdough, chili flake, lemon" },
];

function DailySpecialsMenu({ items, brandName, accentColor, fontFamily }: MenuTemplateProps) {
  const accent = accentColor ?? PINK;
  const titleFont = fontFamily ?? "var(--font-playfair)";
  const displayed = (items.length > 0 ? items : MOCK_ITEMS).slice(0, 4);

  return (
    <div style={{
      background: "#1A0F08",
      borderRadius: 16,
      padding: "24px 20px 20px",
    }}>
      {/* TODAY'S pill */}
      <span style={{
        background: accent,
        color: "white",
        borderRadius: 999,
        padding: "4px 12px",
        fontFamily: "var(--font-jost), Jost, sans-serif",
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.1em",
        display: "inline-block",
        marginBottom: 10,
      }}>
        TODAY&apos;S
      </span>

      {/* Brand name */}
      <p style={{
        fontFamily: titleFont,
        fontSize: 30,
        fontStyle: "italic",
        color: "white",
        margin: "0 0 18px",
        lineHeight: 1.1,
      }}>
        {brandName || "Daily Specials"}
      </p>

      {/* Special cards */}
      {displayed.map((m, i) => (
        <div key={i} style={{
          background: "white",
          borderRadius: 16,
          padding: 14,
          marginBottom: 10,
        }}>
          {/* Top row: name + price */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{
              fontFamily: titleFont,
              fontSize: 18,
              fontStyle: "italic",
              color: "#1A0F08",
              flex: 1,
              lineHeight: 1.2,
            }}>
              {m.item}
            </span>
            <span style={{
              fontFamily: "var(--font-jost), Jost, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: accent,
              marginLeft: 10,
              flexShrink: 0,
            }}>
              {m.price}
            </span>
          </div>
          {/* Note */}
          {m.note && (
            <p style={{
              fontFamily: "var(--font-jost), Jost, sans-serif",
              fontSize: 11,
              color: "#7A6A5A",
              margin: "0 0 8px",
            }}>
              {m.note}
            </p>
          )}
          {/* ORDER link */}
          <p style={{
            fontFamily: "var(--font-jost), Jost, sans-serif",
            fontSize: 9,
            fontWeight: 700,
            fontVariant: "small-caps",
            color: accent,
            letterSpacing: "0.1em",
            margin: 0,
            textTransform: "uppercase" as const,
          }}>
            ORDER →
          </p>
        </div>
      ))}

      {/* Footer */}
      <p style={{
        fontFamily: "var(--font-caveat), Caveat, cursive",
        fontSize: 16,
        color: "#F5F0E0",
        margin: "10px 0 0",
        textAlign: "center",
      }}>
        {brandName || ""}
      </p>
    </div>
  );
}

// ── MenuTemplate dispatcher ────────────────────────────────────────────────

export function MenuTemplate(props: MenuTemplateProps) {
  switch (props.style) {
    case "chalkboard":      return <ChalkboardMenu {...props} />;
    case "bistro":          return <BistroMenu {...props} />;
    case "cafe_board":      return <CafeBoardMenu {...props} />;
    case "weekly_schedule": return <WeeklyScheduleMenu {...props} />;
    case "daily_specials":  return <DailySpecialsMenu {...props} />;
    default:                return <CafeBoardMenu {...props} />;
  }
}
