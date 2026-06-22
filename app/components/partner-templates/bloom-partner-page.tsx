"use client";

import React from "react";

interface BloomPartnerPageProps {
  brandName?: string;
  location?: string;
  tagline?: string;
  heroImageUrl?: string;
  accentColor?: string;
  girlFavorites?: string[];
  curatorNote?: string;
  curatorName?: string;
  aboutText?: string;
  instagram?: string;
  hours?: string;
}

export function BloomPartnerPage({
  brandName = "Café Lyria",
  location = "West Village, NYC",
  tagline = "The kind of place that makes your weekday feel like a soft little secret ♡",
  heroImageUrl,
  accentColor = "#FF1F7D",
  girlFavorites = ["Pistachio Matcha", "Almond Croissant", "Window Table"],
  curatorNote = "Order the pistachio matcha and sit by the front window. Go before 11am, trust me.",
  curatorName = "Amina",
  aboutText = "A cozy all-day café with Parisian soul and NYC energy. Perfect for slow mornings, long catch-ups, and solo coffee dates.",
  hours = "Daily 7AM – 9PM",
  instagram = "@cafelyria.nyc",
}: BloomPartnerPageProps) {
  const PINK = accentColor;
  const BG = "#FEFCF8";
  const CREAM_CARD = "#FFF9F0";
  const YELLOW_STICKY = "#FFF9C4";
  const FONT_PLAY = "var(--font-playfair)";
  const FONT_JOST = "var(--font-jost)";
  const FONT_CAVEAT = "var(--font-caveat)";

  const mockColors = ["#FFE4EC", "#E8F4EC", "#EEE8FF", "#FFF3E0"];

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: FONT_JOST }}>

      {/* ── Pink top ribbon ─────────────────────────────────────────────── */}
      <div style={{
        background: PINK,
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: FONT_JOST,
          fontSize: "9px",
          fontWeight: 800,
          letterSpacing: "0.18em",
          color: "white",
        }}>
          BLOOMBAY ✦ BLOOM APPROVED ♡
        </span>
        <div style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          border: "2px solid white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.15)",
        }}>
          <span style={{ fontFamily: FONT_PLAY, fontSize: "14px", fontWeight: 900, color: "white", fontStyle: "italic" }}>B</span>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div style={{ padding: "24px 18px", maxWidth: 480, margin: "0 auto" }}>

        {/* ── Heading ─────────────────────────────────────────────────── */}
        <h1 style={{
          fontFamily: FONT_PLAY,
          fontSize: "38px",
          fontWeight: 900,
          color: "#1C1B1C",
          lineHeight: 1.05,
          margin: "0 0 6px",
        }}>
          {brandName}
        </h1>

        {/* ── Location small caps ─────────────────────────────────────── */}
        <p style={{
          fontFamily: FONT_JOST,
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: "#9A8A7A",
          textTransform: "uppercase",
          margin: "0 0 8px",
        }}>
          {location}
        </p>

        {/* ── Italic tagline ──────────────────────────────────────────── */}
        <p style={{
          fontFamily: FONT_PLAY,
          fontSize: "15px",
          fontStyle: "italic",
          color: "#4A3A2C",
          margin: "0 0 16px",
          lineHeight: 1.5,
        }}>
          {tagline}
        </p>

        {/* ── Rating pill ─────────────────────────────────────────────── */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          background: `${PINK}18`,
          border: `1.5px solid ${PINK}40`,
          borderRadius: 999,
          padding: "7px 14px",
          marginBottom: 14,
        }}>
          <span style={{
            fontFamily: FONT_JOST,
            fontSize: "8.5px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: PINK,
          }}>
            ★★★★★ BLOOMIES RATED 4.8 — LOVED BY 843 WOMEN
          </span>
        </div>

        {/* ── Bloom notes row ─────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 22,
        }}>
          <span style={{
            fontFamily: FONT_JOST,
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#1C1B1C",
          }}>
            127 BLOOM NOTES
          </span>
          <span style={{
            fontFamily: FONT_JOST,
            fontSize: "10px",
            color: PINK,
            fontWeight: 700,
          }}>
            — See all →
          </span>
        </div>

        {/* ── Hero photo card ─────────────────────────────────────────── */}
        <div style={{
          transform: "rotate(1.5deg)",
          background: "white",
          padding: "10px 10px 36px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
          borderRadius: 4,
          marginBottom: 28,
        }}>
          <div style={{
            width: "100%",
            aspectRatio: "4/3",
            background: heroImageUrl ? "transparent" : "#EDE8E2",
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroImageUrl} alt={brandName} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            ) : (
              <span style={{ fontFamily: FONT_JOST, fontSize: "11px", color: "#B0A090", letterSpacing: "0.12em" }}>HERO PHOTO</span>
            )}
          </div>
          <p style={{
            fontFamily: FONT_CAVEAT,
            fontSize: "15px",
            color: "#6A5A4A",
            textAlign: "center",
            margin: "10px 0 0",
            lineHeight: 1.3,
          }}>
            morning light + the best matcha ♡
          </p>
        </div>

        {/* ── Girl Favorites ──────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontFamily: FONT_JOST,
            fontSize: "9px",
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: PINK,
            marginBottom: 12,
          }}>
            GIRL FAVORITES ♡
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {girlFavorites.slice(0, 3).map((fav, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: CREAM_CARD,
                borderRadius: 10,
                padding: "11px 14px",
              }}>
                <span style={{ color: PINK, fontSize: "16px", flexShrink: 0 }}>♡</span>
                <span style={{
                  fontFamily: FONT_JOST,
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1C1B1C",
                }}>
                  {fav}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Curator note card ───────────────────────────────────────── */}
        <div style={{
          background: CREAM_CARD,
          borderRadius: 14,
          padding: "18px 16px",
          marginBottom: 20,
          borderLeft: `3px solid ${PINK}`,
        }}>
          <p style={{
            fontFamily: FONT_JOST,
            fontSize: "8px",
            fontWeight: 800,
            letterSpacing: "0.2em",
            color: "#9A8A7A",
            marginBottom: 12,
          }}>
            A NOTE FROM {curatorName.toUpperCase()}
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: PINK,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: FONT_PLAY,
                fontSize: "16px",
                fontWeight: 900,
                color: "white",
                fontStyle: "italic",
              }}>
                {curatorName.charAt(0)}
              </span>
            </div>
            <p style={{
              fontFamily: FONT_PLAY,
              fontSize: "14px",
              fontStyle: "italic",
              color: "#4A3A2C",
              lineHeight: 1.6,
              margin: 0,
            }}>
              &ldquo;{curatorNote}&rdquo;
            </p>
          </div>
        </div>

        {/* ── Bloom Tip sticky notes ──────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            "Go before 11am for a window seat",
            "Cash tips — they remember you",
          ].map((tip, i) => (
            <div key={i} style={{
              background: YELLOW_STICKY,
              borderRadius: 4,
              padding: "14px 12px",
              boxShadow: "2px 3px 8px rgba(0,0,0,0.1)",
              transform: i === 0 ? "rotate(-1deg)" : "rotate(1.2deg)",
            }}>
              <p style={{
                fontFamily: FONT_JOST,
                fontSize: "7.5px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: "#9A8A7A",
                marginBottom: 6,
              }}>
                BLOOM TIP
              </p>
              <p style={{
                fontFamily: FONT_CAVEAT,
                fontSize: "14px",
                color: "#4A3A2C",
                lineHeight: 1.4,
                margin: 0,
              }}>
                {tip}
              </p>
            </div>
          ))}
        </div>

        {/* ── About ───────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontFamily: FONT_JOST,
            fontSize: "9px",
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: "#9A8A7A",
            marginBottom: 10,
          }}>
            ABOUT {brandName.toUpperCase()}
          </p>
          <p style={{
            fontFamily: FONT_JOST,
            fontSize: "13px",
            color: "#4A3A2C",
            lineHeight: 1.7,
            margin: 0,
          }}>
            {aboutText}
          </p>
        </div>

        {/* ── Saved to ────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontFamily: FONT_JOST,
            fontSize: "9px",
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: "#9A8A7A",
            marginBottom: 12,
          }}>
            SAVED TO
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { initial: "S", name: "Sara's Coffee Tour ☕", count: "14 places" },
              { initial: "M", name: "Maya's West Village Must-Dos", count: "9 places" },
              { initial: "J", name: "Jess's Solo Date Spots", count: "22 places" },
            ].map((list, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: `${PINK}22`,
                  border: `1.5px solid ${PINK}50`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: FONT_PLAY, fontSize: "12px", fontWeight: 700, color: PINK, fontStyle: "italic" }}>{list.initial}</span>
                </div>
                <div>
                  <p style={{ fontFamily: FONT_JOST, fontSize: "11px", fontWeight: 600, color: "#1C1B1C", margin: 0, lineHeight: 1.2 }}>{list.name}</p>
                  <p style={{ fontFamily: FONT_JOST, fontSize: "9px", color: "#9A8A7A", margin: 0 }}>{list.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── More from [name] ────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <p style={{
            fontFamily: FONT_JOST,
            fontSize: "9px",
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: "#9A8A7A",
            marginBottom: 12,
          }}>
            MORE FROM {brandName.toUpperCase()}
          </p>
          <div style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            paddingBottom: 4,
          }}>
            {mockColors.map((color, i) => (
              <div key={i} style={{
                flexShrink: 0,
                width: 100,
                height: 100,
                borderRadius: 12,
                background: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}>
                <span style={{ fontFamily: FONT_JOST, fontSize: "8px", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(0,0,0,0.3)" }}>
                  PHOTO {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bloom Passport stamp ────────────────────────────────────── */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 28,
        }}>
          <div style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            border: `3px dashed ${PINK}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            transform: "rotate(-6deg)",
          }}>
            <span style={{ fontFamily: FONT_JOST, fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: PINK }}>BLOOM PASSPORT</span>
            <span style={{ fontFamily: FONT_PLAY, fontSize: "18px", fontWeight: 900, fontStyle: "italic", color: PINK }}>VISITED</span>
            <span style={{ fontFamily: FONT_JOST, fontSize: "7px", fontWeight: 600, letterSpacing: "0.12em", color: PINK, opacity: 0.7 }}>✦ 2024 ✦</span>
          </div>
        </div>

        {/* ── What Bloomies are saying ─────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <p style={{
            fontFamily: FONT_JOST,
            fontSize: "9px",
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: PINK,
            marginBottom: 14,
          }}>
            WHAT BLOOMIES ARE SAYING ♡
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { author: "Priya K.", stars: 5, text: "The pistachio matcha is life-changing. I've come back 4 times this week alone." },
              { author: "Clara M.", stars: 5, text: "Perfect solo date spot. The ambiance is exactly what my nervous system needed." },
              { author: "Nadia T.", stars: 5, text: "This place understands the assignment. Pastries, good lighting, no rush. ♡" },
            ].map((review, i) => (
              <div key={i} style={{
                background: "white",
                borderRadius: 12,
                padding: "14px 16px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: FONT_JOST, fontSize: "11px", fontWeight: 700, color: "#1C1B1C" }}>{review.author}</span>
                  <span style={{ color: PINK, fontSize: "13px", letterSpacing: "1px" }}>{"★".repeat(review.stars)}</span>
                </div>
                <p style={{ fontFamily: FONT_JOST, fontSize: "12px", color: "#4A3A2C", lineHeight: 1.6, margin: 0 }}>{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick info row ──────────────────────────────────────────── */}
        <div style={{
          background: CREAM_CARD,
          borderRadius: 14,
          padding: "16px",
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          <p style={{ fontFamily: FONT_JOST, fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", color: "#9A8A7A", margin: "0 0 4px" }}>QUICK INFO</p>
          {[
            { icon: "📍", label: location },
            { icon: "🕐", label: hours },
            { icon: "📸", label: instagram },
          ].map((info, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "14px", flexShrink: 0 }}>{info.icon}</span>
              <span style={{ fontFamily: FONT_JOST, fontSize: "12px", color: "#4A3A2C", fontWeight: 500 }}>{info.label}</span>
            </div>
          ))}
        </div>

        {/* ── Save to my world button ─────────────────────────────────── */}
        <button style={{
          width: "100%",
          background: PINK,
          border: "none",
          borderRadius: 999,
          padding: "16px 0",
          fontFamily: FONT_JOST,
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.18em",
          color: "white",
          cursor: "pointer",
          boxShadow: `0 6px 24px ${PINK}50`,
        }}>
          SAVE TO MY WORLD ♡
        </button>

      </div>
    </div>
  );
}
