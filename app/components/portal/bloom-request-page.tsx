"use client";

import { useState } from "react";

const PINK = "#FF1F7D";
const CRIMSON = "#C8003C";
const BG = "#FFF5F8";

const COMPAT_POINTS = [
  "Values aligned",
  "Lifestyle aligned",
  "Energy aligned",
  "Vibe aligned",
];

function FlowerSVG() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 6 petals arranged around center */}
      <ellipse cx="22" cy="10" rx="5" ry="9" fill={CRIMSON} opacity="0.85" />
      <ellipse
        cx="22"
        cy="10"
        rx="5"
        ry="9"
        fill={CRIMSON}
        opacity="0.85"
        transform="rotate(60 22 22)"
      />
      <ellipse
        cx="22"
        cy="10"
        rx="5"
        ry="9"
        fill={CRIMSON}
        opacity="0.85"
        transform="rotate(120 22 22)"
      />
      <ellipse
        cx="22"
        cy="10"
        rx="5"
        ry="9"
        fill={CRIMSON}
        opacity="0.85"
        transform="rotate(180 22 22)"
      />
      <ellipse
        cx="22"
        cy="10"
        rx="5"
        ry="9"
        fill={CRIMSON}
        opacity="0.85"
        transform="rotate(240 22 22)"
      />
      <ellipse
        cx="22"
        cy="10"
        rx="5"
        ry="9"
        fill={CRIMSON}
        opacity="0.85"
        transform="rotate(300 22 22)"
      />
      {/* Center circle */}
      <circle cx="22" cy="22" r="6" fill="#fff" />
      <circle cx="22" cy="22" r="4" fill={PINK} />
    </svg>
  );
}

function BarcodeSVG() {
  // Decorative barcode — vertical lines of varying heights
  const bars = [
    3, 7, 2, 5, 9, 3, 6, 2, 8, 4, 7, 2, 5, 9, 3, 6, 2, 8, 4, 3, 7, 5, 9, 2,
    6, 4, 8, 3, 5, 7, 2, 9, 4, 6, 3, 8, 5, 2, 7, 4, 9, 3, 6, 5, 2, 8, 4, 7,
    3, 5, 9, 2, 6, 4, 3, 8, 7, 2, 5, 9,
  ];
  let x = 0;
  const totalWidth = bars.reduce((sum, w) => sum + w + 1, 0);
  const rects: React.ReactNode[] = [];
  bars.forEach((w, i) => {
    const barX = x;
    x += w + 1;
    const h = 20 + ((i * 7 + w * 3) % 14);
    const y = (36 - h) / 2;
    rects.push(
      <rect key={i} x={barX} y={y} width={w} height={h} fill="#222" />
    );
  });
  return (
    <svg
      width="100%"
      height="36"
      viewBox={`0 0 ${totalWidth} 36`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {rects}
    </svg>
  );
}

export function BloomRequestPage() {
  const [opened, setOpened] = useState(false);

  if (opened) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: BG,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-jost), sans-serif",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>🌸</div>
        <div
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: 28,
            fontWeight: 700,
            color: CRIMSON,
            marginBottom: 10,
          }}
        >
          You bloomed!
        </div>
        <div
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 17,
            color: "#555",
            maxWidth: 300,
          }}
        >
          You&apos;re now connected. 🌸 Reach out and say hello — she&apos;s
          waiting.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        fontFamily: "var(--font-jost), sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── TOP BAR ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px 10px",
        }}
      >
        {/* × close */}
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1.5px solid #ddd",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            color: "#555",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          ×
        </button>

        {/* Center brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.12em",
              color: "#111",
              textTransform: "uppercase",
            }}
          >
            BLOOMBAY
          </span>
          {/* Small BB logo badge */}
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: PINK,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "0.04em",
            }}
          >
            BB
          </div>
        </div>

        {/* Tag icon */}
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1.5px solid #ddd",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          🏷️
        </button>
      </div>

      {/* ── MAIN CARD SECTION ── */}
      <div
        style={{
          position: "relative",
          margin: "8px 20px 0",
          minHeight: 420,
        }}
      >
        {/* ── HANG TAG (top-right, rotated ~10deg) ── */}
        <div
          style={{
            position: "absolute",
            top: -8,
            right: 4,
            zIndex: 10,
            transform: "rotate(10deg)",
            transformOrigin: "top center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 72,
              background: "#fffdf7",
              borderRadius: 6,
              border: "1.5px dashed #e05555",
              padding: "20px 10px 12px",
              boxShadow: "2px 3px 10px rgba(0,0,0,0.13)",
              textAlign: "center",
            }}
          >
            {/* Hole at top */}
            <div
              style={{
                position: "absolute",
                top: 7,
                left: "50%",
                transform: "translateX(-50%)",
                width: 9,
                height: 9,
                borderRadius: "50%",
                border: "1.5px solid #e05555",
                background: BG,
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#b33",
                lineHeight: 1.6,
              }}
            >
              REAL
              <br />
              CONNECTION
              <br />
              <span style={{ letterSpacing: "0.3em" }}>—</span>
              <br />
              ONE
              <br />
              DIRECTION
            </div>
          </div>
        </div>

        {/* ── WHITE INVITATION CARD ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            border: "1.5px solid #ffd6e5",
            padding: "28px 24px 24px",
            boxShadow:
              "0 4px 24px rgba(200,0,60,0.07), 0 1.5px 6px rgba(0,0,0,0.07)",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Flower icon */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <FlowerSVG />
          </div>

          {/* "YOU JUST RECEIVED A" */}
          <div
            style={{
              textAlign: "center",
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: "#aaa",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            YOU JUST RECEIVED A
          </div>

          {/* BLOOM */}
          <div
            style={{
              textAlign: "center",
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: 54,
              fontWeight: 700,
              fontStyle: "italic",
              color: CRIMSON,
              lineHeight: 1,
              marginBottom: 0,
              letterSpacing: "-0.01em",
            }}
          >
            BLOOM
          </div>

          {/* Request */}
          <div
            style={{
              textAlign: "center",
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 34,
              color: CRIMSON,
              lineHeight: 1.1,
              marginBottom: 14,
            }}
          >
            Request
          </div>

          {/* Divider */}
          <div
            style={{
              width: 48,
              height: 1,
              background: "#ffd6e5",
              margin: "0 auto 14px",
            }}
          />

          {/* She sees something... */}
          <div
            style={{
              textAlign: "center",
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontSize: 15,
              color: "#555",
              marginBottom: 5,
            }}
          >
            &ldquo;She sees something beautiful in you.&rdquo;
          </div>

          {/* And she'd love... */}
          <div
            style={{
              textAlign: "center",
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 13,
              color: "#888",
            }}
          >
            And she&apos;d love to get to know you.
          </div>
        </div>

        {/* ── YANDE NOTE (slightly overlapping, rotated -1deg) ── */}
        <div
          style={{
            background: "#fdf6e3",
            borderRadius: 14,
            border: "1px solid #e8d9b5",
            padding: "16px 20px",
            marginTop: -10,
            position: "relative",
            zIndex: 1,
            transform: "rotate(-1deg)",
            boxShadow: "0 3px 12px rgba(0,0,0,0.09)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "#b8860b",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            YANDE SAYS:
          </div>
          <div
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontSize: 13.5,
              color: "#5a4a2a",
              lineHeight: 1.55,
            }}
          >
            &ldquo;The right connection won&apos;t feel like luck. It will feel
            like coming home to yourself.&rdquo;
          </div>
        </div>

        {/* ── BARCODE RECEIPT SLIP ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: "0 0 10px 10px",
            marginTop: 0,
            position: "relative",
            zIndex: 0,
            boxShadow: "0 4px 10px rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}
        >
          {/* Perforated edge */}
          <div
            style={{
              height: 10,
              backgroundImage:
                "radial-gradient(circle, #FFF5F8 5px, #fff 5px)",
              backgroundSize: "16px 16px",
              backgroundPosition: "8px center",
              backgroundRepeat: "repeat-x",
              borderTop: "1px dashed #ddd",
            }}
          />
          <div style={{ padding: "8px 16px 12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jost), sans-serif",
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "#aaa",
                  textTransform: "uppercase",
                }}
              >
                BLOOMBAY
              </span>
              <span
                style={{
                  fontFamily: "var(--font-jost), sans-serif",
                  fontSize: 8,
                  letterSpacing: "0.15em",
                  color: "#bbb",
                  textTransform: "uppercase",
                }}
              >
                INVITATION RECEIPT
              </span>
            </div>
            <BarcodeSVG />
          </div>
        </div>
      </div>

      {/* ── PERSON SECTION ── */}
      <div style={{ padding: "24px 20px 0" }}>
        {/* Profile row */}
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          {/* Photo placeholder */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 14,
              background: "linear-gradient(135deg, #FF69B4 0%, #FF1F7D 100%)",
              flexShrink: 0,
              boxShadow: "0 2px 10px rgba(255,31,125,0.25)",
            }}
          />

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#111",
                marginBottom: 4,
              }}
            >
              Liana 🌸
            </div>
            <div
              style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: 12,
                color: "#999",
                marginBottom: 6,
                lineHeight: 1.5,
              }}
            >
              Wellness lover · Book girl · Sunset chaser · Big dreamer
            </div>
            <div
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontSize: 15,
                color: "#666",
                marginBottom: 6,
                fontStyle: "italic",
              }}
            >
              Looking for my girls.
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jost), sans-serif",
                  fontSize: 11,
                  color: "#bbb",
                }}
              >
                📍 New York, NY
              </span>
              <span
                style={{
                  fontFamily: "var(--font-jost), sans-serif",
                  fontSize: 11,
                  color: "#ccc",
                }}
              >
                8 miles away
              </span>
            </div>
          </div>
        </div>

        {/* ── COMPATIBILITY BLOCK ── */}
        <div
          style={{
            marginTop: 18,
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #ffd6e5",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            boxShadow: "0 2px 10px rgba(200,0,60,0.05)",
          }}
        >
          {/* Left: percentage */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: 48,
                fontWeight: 700,
                color: PINK,
                lineHeight: 1,
              }}
            >
              92%
            </div>
            <div
              style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#bbb",
                textTransform: "uppercase",
                marginTop: 3,
              }}
            >
              COMPATIBILITY
            </div>
          </div>

          {/* Vertical divider */}
          <div
            style={{
              width: 1,
              height: 72,
              background: "#ffd6e5",
              flexShrink: 0,
            }}
          />

          {/* Right: checkmarks */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              flex: 1,
            }}
          >
            {COMPAT_POINTS.map((label) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span
                  style={{
                    color: PINK,
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jost), sans-serif",
                    fontSize: 12.5,
                    color: "#444",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA SECTION ── */}
      <div style={{ padding: "20px 20px 32px" }}>
        {/* Main button */}
        <button
          onClick={() => setOpened(true)}
          style={{
            width: "100%",
            background: PINK,
            color: "#fff",
            border: "none",
            borderRadius: 16,
            padding: "18px 24px",
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "0.03em",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(255,31,125,0.35)",
            marginBottom: 14,
          }}
        >
          Open Bloom Request →
        </button>

        {/* Not now */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <button
            style={{
              background: "none",
              border: "none",
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 14,
              color: "#aaa",
              cursor: "pointer",
            }}
          >
            Not now
          </button>
        </div>

        {/* Footer text */}
        <div
          style={{
            textAlign: "center",
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 11,
            color: "#ccc",
            letterSpacing: "0.02em",
          }}
        >
          This request is private. You decide what happens next.
        </div>
      </div>
    </div>
  );
}
