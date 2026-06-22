"use client";

import React from "react";

interface FabmagTemplateProps {
  brandName?: string;
  issueNumber?: string;
  headline?: string;
  subheadline?: string;
  excerpt?: string;
  heroImageUrl?: string;
  accentColor?: string;
  bgColor?: string;
}

export function FabmagTemplate({
  brandName = "FABMAG®",
  issueNumber = "#77825",
  headline = "LET THE\nWORK\nSP*AK",
  subheadline = "THE LOST ART OF CRAFTSMANSHIP",
  excerpt = "THE WORK OF A TRUE CRAFTSMAN GOES BEYOND PROFIT MARGINS",
  heroImageUrl,
  accentColor = "#E8D44D",
  bgColor = "#6B7A5C",
}: FabmagTemplateProps) {
  const FONT_JOST = "var(--font-jost)";

  const navItems = ["HOME", "BLOG(24)", "GALLERY", "SHOP"];

  const NavPills = () => (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {navItems.map((item, i) => (
        <span key={i} style={{
          fontFamily: FONT_JOST,
          fontSize: "7px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: accentColor,
          background: "rgba(255,255,255,0.12)",
          borderRadius: 999,
          padding: "3px 8px",
          border: `1px solid ${accentColor}50`,
        }}>
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div>
      {/* ── Desktop / tablet two-panel layout ──────────────────────── */}
      <div style={{ display: "none" }} className="fabmag-desktop">
        {/* Hidden on mobile, shown md+ — handled by the stacked mobile layout below */}
      </div>

      {/* ── Responsive: two stacked cards on mobile, side-by-side on md+ ── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}>

        {/* ── LEFT PANEL ────────────────────────────────────────────── */}
        <div style={{
          position: "relative",
          background: heroImageUrl ? "transparent" : "#1A1A1A",
          minHeight: 280,
          overflow: "hidden",
          borderRadius: "12px 12px 0 0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "18px 18px 20px",
        }}>
          {/* Background image */}
          {heroImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImageUrl}
              alt={brandName}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
              }}
            />
          )}

          {/* Dark overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)",
            zIndex: 1,
          }} />

          {/* Top section */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <p style={{
              fontFamily: FONT_JOST,
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: "0.22em",
              color: accentColor,
              margin: "0 0 10px",
            }}>
              {brandName}
            </p>
            <NavPills />
          </div>

          {/* Bottom text overlay */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <p style={{
              fontFamily: FONT_JOST,
              fontSize: "52px",
              fontWeight: 900,
              color: accentColor,
              lineHeight: 0.95,
              margin: "0 0 14px",
              whiteSpace: "pre-line",
            }}>
              {headline}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontFamily: FONT_JOST,
                fontSize: "8px",
                fontWeight: 600,
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.6)",
              }}>
                (Issue:)
              </span>
              <span style={{
                fontFamily: FONT_JOST,
                fontSize: "8px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: accentColor,
              }}>
                {issueNumber}
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ───────────────────────────────────────────── */}
        <div style={{
          background: bgColor,
          minHeight: 280,
          borderRadius: "0 0 12px 12px",
          padding: "20px 18px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
          position: "relative",
          zIndex: 2,
          marginTop: -2,
        }}>
          {/* Top section */}
          <div>
            <p style={{
              fontFamily: FONT_JOST,
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: "0.22em",
              color: accentColor,
              margin: "0 0 10px",
            }}>
              {brandName}
            </p>
            <NavPills />
          </div>

          {/* Middle content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px 0" }}>
            {/* Big headline */}
            <p style={{
              fontFamily: FONT_JOST,
              fontSize: "44px",
              fontWeight: 900,
              color: accentColor,
              lineHeight: 0.95,
              margin: "0 0 12px",
              whiteSpace: "pre-line",
            }}>
              {headline}
            </p>

            {/* Subheadline */}
            <p style={{
              fontFamily: FONT_JOST,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 10px",
            }}>
              {subheadline}
            </p>

            {/* Issue marker */}
            <p style={{
              fontFamily: FONT_JOST,
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: `${accentColor}99`,
              margin: "0 0 14px",
            }}>
              //01-03
            </p>

            {/* Excerpt */}
            <p style={{
              fontFamily: FONT_JOST,
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6,
              margin: "0 0 20px",
              maxWidth: 260,
            }}>
              {excerpt}
            </p>
          </div>

          {/* Read button */}
          <button style={{
            alignSelf: "flex-start",
            background: "transparent",
            border: `2px solid ${accentColor}`,
            borderRadius: 999,
            padding: "10px 22px",
            fontFamily: FONT_JOST,
            fontSize: "9px",
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: accentColor,
            cursor: "pointer",
          }}>
            READ FULL ARTICLE
          </button>
        </div>

      </div>

      {/* ── Side-by-side on wider screens ─────────────────────────── */}
      <style>{`
        @media (min-width: 600px) {
          .fabmag-two-panel {
            flex-direction: row !important;
          }
          .fabmag-two-panel > div:first-child {
            border-radius: 12px 0 0 12px !important;
            min-height: 400px !important;
          }
          .fabmag-two-panel > div:last-child {
            border-radius: 0 12px 12px 0 !important;
            margin-top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
