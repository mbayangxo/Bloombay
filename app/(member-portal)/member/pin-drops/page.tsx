"use client";

import { useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";
const PLUM = "#1A0A2E";
const INK  = "#111111";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Pin {
  id: string;
  name: string;
  initial: string;
  color: string;
  location: string;
  caption: string;
  time: string;
  expires: string;
  going: number;
}

// ── Demo data ──────────────────────────────────────────────────────────────────

const PINS: Pin[] = [
  {
    id: "1",
    name: "Sofia K.",
    initial: "S",
    color: "#FF69B4",
    location: "Blue Bottle Coffee · Soho",
    caption: "grabbing matcha if anyone wants to join ♡",
    time: "8 min ago",
    expires: "2h 52m left",
    going: 2,
  },
  {
    id: "2",
    name: "Aaliyah M.",
    initial: "A",
    color: "#FF1F7D",
    location: "The Whitney · Meatpacking",
    caption: "the Ana Mendieta exhibit is *chef's kiss* — come through",
    time: "24 min ago",
    expires: "2h 36m left",
    going: 1,
  },
  {
    id: "3",
    name: "Kelechi O.",
    initial: "K",
    color: "#C084FC",
    location: "Essex Market · Lower East Side",
    caption: "Saturday market haul. Looking for someone to split the croissants with.",
    time: "1h ago",
    expires: "2h left",
    going: 0,
  },
  {
    id: "4",
    name: "Naomi B.",
    initial: "N",
    color: "#FF1F7D",
    location: "Prospect Park · Brooklyn",
    caption: "morning run turned into picnic. the universe decided for me.",
    time: "1h 30min ago",
    expires: "1h 30m left",
    going: 3,
  },
];

// ── SVG icons ──────────────────────────────────────────────────────────────────

function MapPinIcon({ size = 16, color = PINK }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
        fill={color}
      />
    </svg>
  );
}

function PlusPinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
        fill="white"
      />
      <circle cx="18" cy="6" r="5" fill="white" />
      <line x1="18" y1="3.5" x2="18" y2="8.5" stroke={PINK} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="15.5" y1="6" x2="20.5" y2="6" stroke={PINK} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ── Pin card ───────────────────────────────────────────────────────────────────

function PinCard({ pin, onJoin }: { pin: Pin; onJoin: (id: string) => void }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 20,
        padding: 16,
        borderLeft: `4px solid ${PINK}`,
        boxShadow: "0 2px 16px rgba(26,10,46,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Location row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          <MapPinIcon size={14} />
          <span
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: INK,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {pin.location}
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 11,
            color: "#999",
            flexShrink: 0,
          }}
        >
          {pin.time}
        </span>
      </div>

      {/* Bloomie row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        {/* Avatar */}
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${pin.color}, ${pin.color}BB)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-fraunces), serif",
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: 22,
            color: "white",
            flexShrink: 0,
            boxShadow: `0 4px 14px ${pin.color}44`,
          }}
        >
          {pin.initial}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name */}
          <p
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: PLUM,
              marginBottom: 4,
            }}
          >
            {pin.name}
          </p>
          {/* Caption */}
          <p
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 15,
              color: "#444",
              lineHeight: 1.45,
            }}
          >
            {pin.caption}
          </p>
        </div>
      </div>

      {/* Footer row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        {/* Join button */}
        <button
          onClick={() => onJoin(pin.id)}
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: PINK,
            background: "transparent",
            border: `1.5px solid ${PINK}`,
            borderRadius: 999,
            padding: "6px 16px",
            cursor: "pointer",
            letterSpacing: "0.01em",
          }}
        >
          I&apos;m joining ♡
        </button>

        {/* Going count + expires */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {pin.going > 0 && (
            <span
              style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: PINK,
              }}
            >
              {pin.going} going
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 10,
              color: "#bbb",
            }}
          >
            {pin.expires}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Drop sheet ─────────────────────────────────────────────────────────────────

const EXPIRE_OPTIONS = ["1 hour", "2 hours", "4 hours"];

function DropSheet({ onClose }: { onClose: () => void }) {
  const [location, setLocation]   = useState("");
  const [caption, setCaption]     = useState("");
  const [expires, setExpires]     = useState("2 hours");

  function handleDrop() {
    if (!location.trim()) return;
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(26,10,46,0.5)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: 40,
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "white",
          borderRadius: "24px 24px 0 0",
          padding: "12px 24px 48px",
          boxShadow: "0 -8px 48px rgba(26,10,46,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 999,
              background: "rgba(26,10,46,0.12)",
            }}
          />
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontStyle: "italic",
            fontSize: 24,
            color: PLUM,
            marginBottom: 6,
          }}
        >
          Where are you right now?
        </h2>
        <p
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 12,
            color: "#999",
            marginBottom: 24,
          }}
        >
          Drop a real-time ping for your Bloomies.
        </p>

        {/* Location input */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 10,
              fontWeight: 800,
              color: PINK,
              letterSpacing: "0.15em",
              display: "block",
              marginBottom: 8,
            }}
          >
            LOCATION
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#F8F5FF",
              borderRadius: 14,
              padding: "0 14px",
              border: `1.5px solid rgba(255,31,125,0.15)`,
            }}
          >
            <MapPinIcon size={14} />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Dimes Square, Canal St"
              style={{
                flex: 1,
                padding: "14px 0",
                border: "none",
                outline: "none",
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: 14,
                color: INK,
                background: "transparent",
              }}
            />
          </div>
        </div>

        {/* Caption textarea */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 10,
              fontWeight: 800,
              color: PINK,
              letterSpacing: "0.15em",
              display: "block",
              marginBottom: 8,
            }}
          >
            WHAT&apos;S THE VIBE?
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What are you doing / want company for?"
            rows={3}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 14,
              border: `1.5px solid rgba(255,31,125,0.15)`,
              background: "#F8F5FF",
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 16,
              color: INK,
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Expires in pills */}
        <div style={{ marginBottom: 28 }}>
          <p
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 10,
              fontWeight: 800,
              color: PINK,
              letterSpacing: "0.15em",
              marginBottom: 10,
            }}
          >
            EXPIRES IN
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {EXPIRE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setExpires(opt)}
                style={{
                  fontFamily: "var(--font-jost), sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "8px 18px",
                  borderRadius: 999,
                  cursor: "pointer",
                  border: expires === opt ? "none" : `1.5px solid rgba(255,31,125,0.25)`,
                  background: expires === opt ? PINK : "transparent",
                  color: expires === opt ? "white" : PINK,
                  boxShadow: expires === opt ? `0 2px 10px ${PINK}44` : "none",
                  transition: "all 0.15s ease",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* CTA button */}
        <button
          onClick={handleDrop}
          disabled={!location.trim()}
          style={{
            width: "100%",
            padding: "16px 0",
            borderRadius: 16,
            border: "none",
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.04em",
            cursor: location.trim() ? "pointer" : "not-allowed",
            background: location.trim() ? PINK : "rgba(26,10,46,0.08)",
            color: location.trim() ? "white" : "rgba(26,10,46,0.3)",
            boxShadow: location.trim() ? `0 4px 18px ${PINK}55` : "none",
            transition: "all 0.15s ease",
          }}
        >
          Drop My Pin ✦
        </button>

        {/* Fine print */}
        <p
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 11,
            color: "#bbb",
            textAlign: "center",
            marginTop: 14,
            lineHeight: 1.5,
          }}
        >
          Your pin expires automatically. Only your Bloomies can see it.
        </p>
      </div>
    </>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({ onDrop }: { onDrop: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 32px",
        textAlign: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: `${PINK}12`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <MapPinIcon size={32} />
      </div>
      <p
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontStyle: "italic",
          fontSize: 20,
          color: PLUM,
        }}
      >
        No active pins right now ✦
      </p>
      <p
        style={{
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: 13,
          color: "#999",
          lineHeight: 1.6,
          maxWidth: 260,
        }}
      >
        Drop the first pin and invite your Bloomies to join you!
      </p>
      <button
        onClick={onDrop}
        style={{
          marginTop: 12,
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: PINK,
          background: `${PINK}12`,
          border: `1.5px solid ${PINK}33`,
          borderRadius: 999,
          padding: "10px 24px",
          cursor: "pointer",
        }}
      >
        Drop the first pin
      </button>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function PinDropsPage() {
  const [dropOpen, setDropOpen]     = useState(false);
  const [joiningIds, setJoiningIds] = useState<Set<string>>(new Set());

  function handleJoin(id: string) {
    setJoiningIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  const hasPins = PINS.length > 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FFF5F8 0%, #F8F0FF 100%)",
        fontFamily: "var(--font-jost), sans-serif",
        paddingBottom: 100,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "24px 20px 0",
        }}
      >
        {/* ── Header ── */}
        <Link
          href="/member/home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
            color: PLUM,
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 28,
            opacity: 0.6,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Home
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
            fontSize: "clamp(28px, 8vw, 36px)",
            color: PLUM,
            lineHeight: 1.15,
            marginBottom: 10,
          }}
        >
          Where are your Bloomies?
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 13,
            color: "#777",
            lineHeight: 1.65,
            marginBottom: 32,
          }}
        >
          Real-time pings from the women in your city. Join them.
        </p>

        {/* ── Active pins feed ── */}
        {hasPins ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PINS.map((pin) => (
              <PinCard
                key={pin.id}
                pin={
                  joiningIds.has(pin.id)
                    ? { ...pin, going: pin.going + 1 }
                    : pin
                }
                onJoin={handleJoin}
              />
            ))}
          </div>
        ) : (
          <EmptyState onDrop={() => setDropOpen(true)} />
        )}
      </div>

      {/* ── Drop a Pin FAB ── */}
      <div
        style={{
          position: "fixed",
          bottom: 28,
          right: 24,
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <button
          onClick={() => setDropOpen(true)}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: PINK,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 6px 24px ${PINK}66`,
          }}
        >
          <PlusPinIcon />
        </button>
        <span
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 10,
            fontWeight: 700,
            color: PINK,
            letterSpacing: "0.05em",
          }}
        >
          Drop
        </span>
      </div>

      {/* ── Drop sheet ── */}
      {dropOpen && <DropSheet onClose={() => setDropOpen(false)} />}
    </div>
  );
}
