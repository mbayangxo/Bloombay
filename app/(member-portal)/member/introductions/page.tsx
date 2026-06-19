"use client";

import { useState } from "react";
import { BBLogo } from "@/app/components/portal/bb-logo";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";
const PAPER = "#FEFCF7";
const GOLD = "#D4A853";

// ─── Profile Cards ────────────────────────────────────────────────────────────

const PROFILE_CARDS = [
  { color: "#FF6B9D", name: "Hana", age: 27, distance: "5 miles away" },
  { color: "#C084FC", name: "Selu", age: 29, distance: "Richman girls · 3 miles away" },
  { color: "#FF9F43", name: "Zara", age: 28, distance: "Cup noodles · 3 miles away" },
];

// ─── Category Cards ───────────────────────────────────────────────────────────

const CATEGORY_CARDS = [
  { label: "Deep talkers", bg: "linear-gradient(135deg, #FF1F7D, #FF69B4)" },
  { label: "Girls nights", bg: "linear-gradient(135deg, #FF6B35, #FF9F43)" },
  { label: "Creative dates", bg: "linear-gradient(135deg, #8B5CF6, #C084FC)" },
  { label: "Hope circle", bg: "linear-gradient(135deg, #059669, #34D399)" },
  { label: "Solo plans", bg: "linear-gradient(135deg, #374151, #6B7280)" },
];

// ─── Come With Feed Cards ─────────────────────────────────────────────────────

const COME_WITH_CARDS = [
  {
    avatarColor: "#C084FC",
    initial: "S",
    name: "Sofia K.",
    neighborhood: "Williamsburg",
    time: "2h ago",
    event: "Girls' dinner at Carbone",
    venue: "Carbone · West Village",
    date: "This Thursday 7:30PM",
    othersGoing: 4,
  },
  {
    avatarColor: "#0EA5E9",
    initial: "A",
    name: "Aminah M.",
    neighborhood: "Crown Heights",
    time: "5h ago",
    event: "MoMA Saturday afternoon",
    venue: "MoMA · Midtown",
    date: "Saturday 2PM",
    othersGoing: 2,
  },
  {
    avatarColor: "#FF9F43",
    initial: "T",
    name: "Temi A.",
    neighborhood: "Crown Heights",
    time: "1d ago",
    event: "Sunday Prospect Park walk",
    venue: "Prospect Park · Brooklyn",
    date: "This Sunday 9AM",
    othersGoing: 7,
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function IntroductionsPage() {
  const [toast, setToast] = useState<string>("");

  function handleCardTap() {
    setToast("Bloom Request Sent!");
    setTimeout(() => setToast(""), 2000);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: PAPER,
        paddingBottom: 120,
      }}
    >
      {/* ── 1. HEADER ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#1C1B1C",
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
          paddingBottom: 14,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BBLogo size={28} light />
        <div style={{ display: "flex", flexDirection: "row", gap: 12, alignItems: "center" }}>
          {/* Bell */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          {/* Avatar */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF1F7D, #FF69B4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 14,
                fontWeight: 800,
                color: "white",
              }}
            >
              Y
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. HERO SECTION ───────────────────────────────────────────────── */}
      <div
        style={{
          background: "white",
          padding: "20px 20px 16px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: PINK,
            marginBottom: 8,
          }}
        >
          INTRODUCTIONS
        </div>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: "clamp(30px, 10.5vw, 42px)",
            lineHeight: 1.05,
            color: DARK,
            margin: 0,
          }}
        >
          Your people
          <br />
          <span style={{ color: PINK }}>get you.</span>
        </h1>
        <div style={{ marginTop: 12 }}>
          <span
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 10,
              fontWeight: 800,
              color: PINK,
              fontVariant: "small-caps",
            }}
          >
            Yande says:
          </span>
          <p
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: 15,
              color: "#555",
              lineHeight: 1.5,
              margin: 0,
              marginTop: 2,
            }}
          >
            We don&apos;t match on looks. We match on life, energy, and direction.
          </p>
          <span
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 10,
              fontWeight: 700,
              color: PINK,
              cursor: "pointer",
              marginTop: 6,
              display: "inline-block",
            }}
          >
            That&apos;s Bloom-Ship →
          </span>
        </div>
      </div>

      {/* ── 3. THREE COLUMN INFO BOX ──────────────────────────────────────── */}
      <div
        style={{
          margin: "12px 16px",
          background: "#FFF0F5",
          borderRadius: 16,
          padding: "16px 14px",
          display: "flex",
          flexDirection: "row",
          gap: 0,
        }}
      >
        {[
          { header: "IN YOUR ORBIT", body: "Women who may match your energy" },
          { header: "SOFT MODE", body: "Take your time. No pressure. Just presence." },
          { header: "IN MY WORLD", body: "Women who match your lifestyle & vibe" },
        ].map((col, i) => (
          <div
            key={col.header}
            style={{
              flex: 1,
              padding: "0 10px",
              borderLeft: i > 0 ? "1px solid rgba(255,31,125,0.15)" : undefined,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 7,
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: PINK,
                marginBottom: 5,
              }}
            >
              {col.header}
            </div>
            <div
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                color: "#aaa",
                lineHeight: 1.4,
              }}
            >
              {col.body}
            </div>
          </div>
        ))}
      </div>

      {/* ── 4. NEW ENERGIES AROUND YOU ────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 16px 10px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: DARK,
          }}
        >
          NEW ENERGIES AROUND YOU
        </span>
        <button
          style={{
            background: PINK,
            color: "white",
            fontSize: 8,
            fontWeight: 800,
            fontFamily: "var(--font-jost)",
            padding: "5px 10px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      {/* Horizontal scroll: profile cards */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: 10,
          padding: "0 16px 16px",
          scrollbarWidth: "none",
        }}
      >
        {PROFILE_CARDS.map((card) => (
          <div
            key={card.name}
            onClick={handleCardTap}
            style={{
              width: 150,
              height: 200,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Top ~70% */}
            <div
              style={{
                flex: "0 0 70%",
                background: `linear-gradient(160deg, ${card.color} 0%, ${card.color}88 100%)`,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "white",
                  }}
                >
                  {card.name[0]}
                </span>
              </div>
            </div>
            {/* Bottom ~30% */}
            <div
              style={{
                flex: "0 0 30%",
                background: "rgba(0,0,0,0.75)",
                padding: "10px 10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "white",
                }}
              >
                {card.name}, {card.age}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.65)",
                  marginTop: 2,
                }}
              >
                {card.distance}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 5. CURATED FOR YOU ────────────────────────────────────────────── */}
      <div
        style={{
          padding: "0 16px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: DARK,
          }}
        >
          CURATED FOR YOU
        </span>
        <span
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 10,
            color: PINK,
            cursor: "pointer",
          }}
        >
          See all
        </span>
      </div>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: 10,
          padding: "0 16px 16px",
          scrollbarWidth: "none",
        }}
      >
        {CATEGORY_CARDS.map((cat) => (
          <div
            key={cat.label}
            style={{
              width: 120,
              height: 150,
              borderRadius: 14,
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
              background: cat.bg,
            }}
          >
            <span
              style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                right: 12,
                fontFamily: "var(--font-jost)",
                fontSize: 11,
                fontWeight: 800,
                color: "white",
              }}
            >
              {cat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── 6. YOUR MATCH VIBE ────────────────────────────────────────────── */}
      <div style={{ padding: "0 16px 10px" }}>
        <span
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: DARK,
          }}
        >
          YOUR MATCH VIBE
        </span>
      </div>

      <div
        style={{
          padding: "0 16px 16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {["Deep talks", "Adventures", "Creative dates", "Support system"].map((tag) => (
          <div
            key={tag}
            style={{
              background: `${PINK}12`,
              border: `1px solid ${PINK}25`,
              borderRadius: 999,
              padding: "12px 16px",
              textAlign: "center",
              fontFamily: "var(--font-jost)",
              fontSize: 11,
              fontWeight: 700,
              color: PINK,
            }}
          >
            {tag}
          </div>
        ))}
      </div>

      {/* ── 7. COME WITH ──────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 16px 4px" }}>
        <div
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: 22,
            color: DARK,
          }}
        >
          Come With
        </div>
        <div
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 11,
            color: "#888",
            marginTop: 2,
          }}
        >
          I&apos;m going — who wants to join?
        </div>
      </div>

      {/* Post button */}
      <button
        style={{
          margin: "8px 16px 16px",
          width: "calc(100% - 32px)",
          padding: "13px 0",
          borderRadius: 999,
          background: PINK,
          color: "white",
          border: "none",
          fontFamily: "var(--font-jost)",
          fontSize: 12,
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Post a Come With
      </button>

      {/* Feed cards */}
      {COME_WITH_CARDS.map((card) => (
        <div
          key={card.name}
          style={{
            margin: "0 16px 12px",
            background: "white",
            borderRadius: 18,
            padding: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          }}
        >
          {/* Top row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${card.avatarColor}, ${card.avatarColor}88)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "white",
                }}
              >
                {card.initial}
              </span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: DARK,
                }}
              >
                {card.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 9,
                  color: "#aaa",
                }}
              >
                {card.neighborhood} · {card.time}
              </div>
            </div>
          </div>

          {/* Event name */}
          <div
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: 16,
              fontWeight: 700,
              color: DARK,
              margin: "10px 0 8px",
            }}
          >
            {card.event}
          </div>

          {/* Chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div
              style={{
                background: "#F5F5F5",
                borderRadius: 8,
                padding: "4px 10px",
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                color: "#666",
              }}
            >
              📍 {card.venue}
            </div>
            <div
              style={{
                background: "#F5F5F5",
                borderRadius: 8,
                padding: "4px 10px",
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                color: "#666",
              }}
            >
              📅 {card.date}
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
            <span
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                color: "#888",
                flex: 1,
                alignSelf: "center",
              }}
            >
              {card.othersGoing} others going
            </span>
            <button
              style={{
                background: PINK,
                color: "white",
                border: "none",
                borderRadius: 999,
                padding: "8px 14px",
                fontFamily: "var(--font-jost)",
                fontSize: 10,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              I&apos;m In 🙋‍♀️
            </button>
            <button
              style={{
                background: "white",
                color: DARK,
                border: "1.5px solid #E5E5E5",
                borderRadius: 999,
                padding: "8px 14px",
                fontFamily: "var(--font-jost)",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Tell Me More
            </button>
          </div>
        </div>
      ))}

      {/* ── TOAST ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: PINK,
            color: "white",
            borderRadius: 999,
            padding: "10px 20px",
            zIndex: 999,
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "var(--font-jost)",
            whiteSpace: "nowrap",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
