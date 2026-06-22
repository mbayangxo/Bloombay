"use client";

import { useState } from "react";

const PINK = "#FF1F7D";

// Map pins with approximate grid positions (left%, top%)
const MAP_PINS = [
  { name: "DEVOCIÓN", left: "12%", top: "28%", color: "#E8C4A0" },
  { name: "DOMINO PAR", left: "30%", top: "18%", color: "#A8C5DA" },
  { name: "MOGU", left: "52%", top: "35%", color: "#C8A8D8" },
  { name: "MAIL", left: "68%", top: "15%", color: "#F0C8A0" },
  { name: "REMIERE", left: "78%", top: "50%", color: "#A8D8C0" },
  { name: "SAUCED", left: "22%", top: "60%", color: "#F8A8B8" },
  { name: "ARTISTS &\nFLEAS", left: "55%", top: "65%", color: "#C8D8A8" },
];

const CATEGORY_PILLS = [
  { label: "discover ▲", active: true },
  { label: "eat", active: false },
  { label: "café", active: false },
  { label: "bar", active: false },
  { label: "+", active: false },
];

const CURATIONS = [
  {
    username: "@tasha",
    location: "chinatown & les",
    city: "nyc",
    gradient: "linear-gradient(135deg, #2D1B69 0%, #11998e 100%)",
  },
  {
    username: "@amartini22",
    location: "west village",
    city: "nyc",
    gradient: "linear-gradient(135deg, #c0392b 0%, #f39c12 100%)",
  },
  {
    username: "@celeste",
    location: "brooklyn heights",
    city: "nyc",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  },
  {
    username: "@nova",
    location: "soho & tribeca",
    city: "nyc",
    gradient: "linear-gradient(135deg, #4a0e8f 0%, #a855f7 100%)",
  },
];

const CURATORS = [
  { username: "@tasha", views: "92", bg: "#2D1B69" },
  { username: "@amartini22", views: "147", bg: "#c0392b" },
  { username: "@celeste", views: "38", bg: "#1a1a2e" },
  { username: "@nova", views: "215", bg: "#4a0e8f" },
  { username: "@mila", views: "61", bg: "#11998e" },
];

// SVG street grid for the map background
function MapBackground() {
  return (
    <svg
      width="100%"
      height="260"
      style={{ position: "absolute", top: 0, left: 0, display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="260" fill="#1A1A1A" />
      {/* Horizontal streets */}
      {[30, 60, 90, 120, 150, 180, 210, 240].map((y) => (
        <rect key={`h${y}`} x="0" y={y} width="100%" height="2" fill="#2A2A2A" />
      ))}
      {/* Vertical streets */}
      {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
        <rect key={`v${x}`} x={x} y="0" width="2" height="260" fill="#2A2A2A" />
      ))}
      {/* A diagonal street for Williamsburg feel */}
      <line x1="0" y1="80" x2="200" y2="260" stroke="#2A2A2A" strokeWidth="2" />
      <line x1="100" y1="0" x2="400" y2="260" stroke="#2A2A2A" strokeWidth="2" />
      {/* Slightly wider main avenues */}
      <rect x="0" y="85" width="100%" height="3" fill="#242424" />
      <rect x="160" y="0" width="3" height="260" fill="#242424" />
      <rect x="320" y="0" width="3" height="260" fill="#242424" />
    </svg>
  );
}

export function TheCity() {
  const [activeCategory, setActiveCategory] = useState("discover ▲");

  return (
    <div
      style={{
        background: "#FEFEFE",
        minHeight: "100vh",
        fontFamily: "var(--font-jost, sans-serif)",
        maxWidth: 480,
        margin: "0 auto",
        paddingBottom: 32,
      }}
    >
      {/* Search Bar */}
      <div style={{ padding: "16px 16px 12px" }}>
        <div
          style={{
            background: "#111111",
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            padding: "12px 18px",
            gap: 10,
          }}
        >
          <span
            style={{
              flex: 1,
              color: "#888",
              fontSize: 15,
              fontFamily: "var(--font-jost, sans-serif)",
              letterSpacing: 0.2,
            }}
          >
            search for something
          </span>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: PINK,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {/* Navigation arrow icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2L14 8L8 14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 8H14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
        <MapBackground />

        {/* Place pins */}
        {MAP_PINS.map((pin) => (
          <div
            key={pin.name}
            style={{
              position: "absolute",
              left: pin.left,
              top: pin.top,
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              zIndex: 2,
            }}
          >
            {/* Avatar circle */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: pin.color,
                border: "2.5px solid white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  textAlign: "center",
                  lineHeight: 1.1,
                  padding: "0 2px",
                }}
              >
                {pin.name.split("\n")[0].slice(0, 3).toUpperCase()}
              </span>
            </div>
            {/* Place name */}
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "white",
                textAlign: "center",
                lineHeight: 1.2,
                textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                whiteSpace: "pre-line",
                maxWidth: 64,
                letterSpacing: 0.3,
              }}
            >
              {pin.name}
            </span>
          </div>
        ))}

        {/* Search here button overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 4,
          }}
        >
          <button
            style={{
              background: "white",
              border: "none",
              borderRadius: 999,
              padding: "9px 18px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
              fontFamily: "var(--font-jost, sans-serif)",
              fontSize: 13,
              fontWeight: 600,
              color: "#111",
              letterSpacing: 0.2,
            }}
          >
            {/* Refresh icon */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 7C1 4.24 3.24 2 6 2C7.38 2 8.63 2.56 9.54 3.46L11 5H8"
                stroke="#111"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 7C13 9.76 10.76 12 8 12C6.62 12 5.37 11.44 4.46 10.54L3 9H6"
                stroke="#111"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            search here
          </button>
        </div>
      </div>

      {/* Category filter pills */}
      <div
        style={{
          padding: "14px 16px",
          display: "flex",
          gap: 8,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {CATEGORY_PILLS.map((pill) => {
          const isActive = pill.label === activeCategory;
          return (
            <button
              key={pill.label}
              onClick={() => setActiveCategory(pill.label)}
              style={{
                flexShrink: 0,
                padding: "8px 16px",
                borderRadius: 999,
                border: isActive ? "none" : "1.5px solid #222",
                background: isActive ? "#111" : "transparent",
                color: isActive ? "white" : "#111",
                fontFamily: "var(--font-jost, sans-serif)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: 0.2,
                whiteSpace: "nowrap",
              }}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Curations for you */}
      <div style={{ paddingBottom: 20 }}>
        <div style={{ padding: "0 16px 12px" }}>
          <h2
            style={{
              fontFamily: "var(--font-playfair, serif)",
              fontSize: 20,
              fontWeight: 700,
              color: "#111",
              margin: 0,
              letterSpacing: -0.3,
            }}
          >
            curations for you
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            padding: "0 16px",
            scrollbarWidth: "none",
          }}
        >
          {CURATIONS.map((c) => (
            <div
              key={c.username}
              style={{
                flexShrink: 0,
                width: 160,
                height: 100,
                borderRadius: 16,
                background: c.gradient,
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {/* Content overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                  padding: "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <span
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 10,
                    fontFamily: "var(--font-jost, sans-serif)",
                    fontWeight: 500,
                    letterSpacing: 0.3,
                  }}
                >
                  {c.username}
                </span>
                <span
                  style={{
                    color: "white",
                    fontSize: 13,
                    fontFamily: "var(--font-playfair, serif)",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    letterSpacing: -0.2,
                  }}
                >
                  {c.location}
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 10,
                    fontFamily: "var(--font-jost, sans-serif)",
                    fontWeight: 500,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  {c.city}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curators for you */}
      <div style={{ paddingBottom: 24 }}>
        <div style={{ padding: "0 16px 12px" }}>
          <h2
            style={{
              fontFamily: "var(--font-playfair, serif)",
              fontSize: 20,
              fontWeight: 700,
              color: "#111",
              margin: 0,
              letterSpacing: -0.3,
            }}
          >
            curators for you
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            padding: "0 16px",
            scrollbarWidth: "none",
          }}
        >
          {CURATORS.map((curator) => (
            <div
              key={curator.username}
              style={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
              }}
            >
              {/* Avatar circle */}
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: curator.bg,
                  border: `2px solid ${PINK}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    color: "white",
                    fontFamily: "var(--font-playfair, serif)",
                    fontWeight: 700,
                  }}
                >
                  {curator.username.replace("@", "").slice(0, 1).toUpperCase()}
                </span>
              </div>
              {/* Username */}
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-jost, sans-serif)",
                  fontWeight: 600,
                  color: "#111",
                  letterSpacing: 0.1,
                  maxWidth: 64,
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {curator.username}
              </span>
              {/* Stats */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                {/* Eye icon */}
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M1 5.5C1 5.5 2.5 2 5.5 2C8.5 2 10 5.5 10 5.5C10 5.5 8.5 9 5.5 9C2.5 9 1 5.5 1 5.5Z"
                    stroke="#888"
                    strokeWidth="1"
                  />
                  <circle cx="5.5" cy="5.5" r="1.2" fill="#888" />
                </svg>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-jost, sans-serif)",
                    fontWeight: 500,
                    color: "#888",
                  }}
                >
                  {curator.views}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
