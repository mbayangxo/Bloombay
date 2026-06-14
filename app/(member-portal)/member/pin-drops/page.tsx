"use client";

import Link from "next/link";

const PINK = "#FF1F7D";
const PLUM = "#1A0A2E";

// Simple pin icon SVG
function PinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
        fill={PINK}
      />
    </svg>
  );
}

// Placeholder card for the blurred grid
function PlaceholderCard() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        height: 120,
        position: "relative",
        overflow: "hidden",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 6,
        boxShadow: "0 2px 12px rgba(26,10,46,0.07)",
      }}
    >
      {/* Pin icon top-right */}
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <PinIcon size={14} />
      </div>
      {/* Placeholder lines */}
      <div
        style={{
          height: 10,
          borderRadius: 6,
          background: "rgba(26,10,46,0.1)",
          width: "70%",
        }}
      />
      <div
        style={{
          height: 8,
          borderRadius: 6,
          background: "rgba(26,10,46,0.06)",
          width: "45%",
        }}
      />
    </div>
  );
}

export default function PinDropsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FFF5F8 0%, #F8F0FF 100%)",
        fontFamily: "var(--font-jost), sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "24px 24px 48px",
        }}
      >
        {/* Back arrow */}
        <Link
          href="/member/city"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
            color: PLUM,
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 32,
            opacity: 0.7,
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>←</span>
          City Guide
        </Link>

        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 10,
            fontWeight: 800,
            color: PINK,
            letterSpacing: "0.18em",
            marginBottom: 10,
          }}
        >
          PIN DROPS
        </p>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontStyle: "italic",
            fontSize: 32,
            color: PLUM,
            lineHeight: 1.15,
            marginBottom: 12,
          }}
        >
          Your saved spots.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 14,
            color: "#777",
            lineHeight: 1.65,
            marginBottom: 36,
          }}
        >
          Tap the pin on any restaurant, venue, or bar in the City Guide to save it here.
        </p>

        {/* Placeholder grid with coming-soon overlay */}
        <div style={{ position: "relative" }}>
          {/* 2-column grid of placeholder cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <PlaceholderCard />
            <PlaceholderCard />
            <PlaceholderCard />
            <PlaceholderCard />
          </div>

          {/* Frosted overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontStyle: "italic",
                fontSize: 16,
                color: PINK,
                margin: 0,
              }}
            >
              Coming soon ✦
            </p>
          </div>
        </div>

        {/* Bottom note */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link
            href="/member/city"
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: PINK,
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            Explore the City Guide →
          </Link>
        </div>
      </div>
    </div>
  );
}
