"use client";

import React, { useState, useEffect } from "react";

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
  const [isMd, setIsMd] = useState(false);

  useEffect(() => {
    function check() { setIsMd(window.innerWidth >= 600); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navItems = ["HOME", "BLOG(24)", "GALLERY", "SHOP"];

  function NavPills() {
    return (
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
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
  }

  const leftRadius = isMd ? "12px 0 0 12px" : "12px 12px 0 0";
  const rightRadius = isMd ? "0 12px 12px 0" : "0 0 12px 12px";

  return (
    <div style={{
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      display: "flex",
      flexDirection: isMd ? "row" : "column",
    }}>

      {/* ── LEFT PANEL ────────────────────────────────────────────────── */}
      <div style={{
        position: "relative",
        background: heroImageUrl ? "transparent" : "#1A1A1A",
        minHeight: isMd ? 400 : 300,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "18px 18px 20px",
        flex: "1 1 50%",
        borderRadius: leftRadius,
      }}>
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

        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.6) 100%)",
          zIndex: 1,
        }} />

        {/* Top: brand + nav */}
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

        {/* Bottom: big text + issue */}
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

      {/* ── RIGHT PANEL ───────────────────────────────────────────────── */}
      <div style={{
        background: bgColor,
        minHeight: isMd ? 400 : 300,
        padding: "20px 18px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: "1 1 50%",
        borderRadius: rightRadius,
      }}>
        {/* Top: brand + nav */}
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

        {/* Middle: article content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px 0" }}>
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
  );
}
