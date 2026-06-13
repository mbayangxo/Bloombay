"use client";

import { useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";

// Silhouette Rule: this SVG looks like a coffee cup at first glance.
// Second glance: the rim is five petals, the saucer curves like a bloom.
function BloomCupSilhouette() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      style={{ position: "absolute", right: 16, top: 12, opacity: 0.07, pointerEvents: "none" }}
    >
      {/* Cup body — the "bowl" is actually 5 petal arcs */}
      <path
        d="M18 36 C18 24 22 20 28 18 C30 17 32 16.5 32 16.5 C32 16.5 34 17 36 18 C42 20 46 24 46 36 C46 42 42 46 32 46 C22 46 18 42 18 36Z"
        fill={PINK}
      />
      {/* Cup rim — petals */}
      <path
        d="M32 16.5 C32 14 30 11 28 10 C26 11 24 14 24 16.5 C24 18 25 18.5 26 18.5
           M32 16.5 C32 14 34 11 36 10 C38 11 40 14 40 16.5 C40 18 39 18.5 38 18.5
           M32 16.5 C30 13 27 12.5 25.5 14 C25.5 16 28 18 30 18.5
           M32 16.5 C34 13 37 12.5 38.5 14 C38.5 16 36 18 34 18.5
           M32 16.5 C32 12 31.5 10 32 9 C32.5 10 32 12 32 16.5"
        stroke={PINK}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Handle — rose stem curve */}
      <path
        d="M46 30 C52 30 54 34 52 38 C50 42 46 42 46 42"
        stroke={PINK}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Saucer — bloom shape: five slight petal bumps on the base ellipse */}
      <path
        d="M14 50 C14 48 18 46 32 46 C46 46 50 48 50 50 C50 52 46 54 32 54 C18 54 14 52 14 50Z"
        fill={PINK}
        opacity="0.6"
      />
      <path
        d="M20 50 C20 48.5 21 47.5 22 48 C22 49 21 50 20 50Z
           M32 46 C30.5 45 30 44 31 43.5 C32 44 33 45 32 46Z"
        fill={PINK}
        opacity="0.9"
      />
    </svg>
  );
}

interface MorningAfterCardProps {
  happeningTitle?: string;
  happeningVenue?: string;
  women?: { name: string; initial: string; color: string }[];
  onDismiss?: () => void;
}

const DEFAULT_WOMEN = [
  { name: "Amara", initial: "A", color: "#FF5BAD" },
  { name: "Bea",   initial: "B", color: "#C96EE0" },
  { name: "Leila", initial: "L", color: "#FF9CC8" },
];

export function MorningAfterCard({
  happeningTitle = "Girls Dinner",
  happeningVenue = "Carbone · West Village",
  women = DEFAULT_WOMEN,
  onDismiss,
}: MorningAfterCardProps) {
  const [showTraditionSheet, setShowTraditionSheet] = useState(false);
  const [flowerSent, setFlowerSent] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [tradName, setTradName] = useState("");
  const [tradFreq, setTradFreq] = useState("monthly");

  if (dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  function handleSendFlower() {
    setFlowerSent(true);
    setTimeout(() => handleDismiss(), 1400);
  }

  return (
    <>
      {/* ── Morning-After Card ── */}
      <div style={{ padding: "18px 16px 0" }}>
        <div style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(135deg, #FFF8F3 0%, #FFF0F8 100%)",
          border: "1.5px solid rgba(255,31,125,0.13)",
          boxShadow: "0 4px 24px rgba(255,31,125,0.08), 0 1px 0 rgba(255,255,255,0.9) inset",
        }}>
          <BloomCupSilhouette />

          {/* Top label */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              {/* Flower dot */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="2.5" fill={PINK} />
                {[0,1,2,3,4].map(i => {
                  const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                  const cx = 7 + Math.cos(angle) * 4.5;
                  const cy = 7 + Math.sin(angle) * 4.5;
                  return <ellipse key={i} cx={cx} cy={cy} rx="2" ry="1.3" fill={PINK} opacity="0.55" transform={`rotate(${(i / 5) * 360}, ${cx}, ${cy})`} />;
                })}
              </svg>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 900, letterSpacing: "0.2em", color: PINK }}>
                THIS MORNING
              </span>
            </div>
            <button
              onClick={handleDismiss}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, opacity: 0.35 }}
              aria-label="Dismiss"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1 1l8 8M9 1l-8 8" />
              </svg>
            </button>
          </div>

          {/* Main copy */}
          <div style={{ padding: "10px 18px 0" }}>
            <p style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 22,
              color: "#111",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}>
              Last night&apos;s {happeningTitle.toLowerCase()}.
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(0,0,0,0.38)", marginTop: 3 }}>
              {happeningVenue}
            </p>
          </div>

          {/* Women avatars + names */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px 0" }}>
            <div style={{ display: "flex" }}>
              {women.map((w, i) => (
                <div
                  key={i}
                  title={w.name}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${w.color}, ${w.color}cc)`,
                    border: "2.5px solid white",
                    marginLeft: i > 0 ? -10 : 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-jost)",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    zIndex: women.length - i,
                    position: "relative",
                  }}
                >
                  {w.initial}
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", color: "rgba(0,0,0,0.55)", fontWeight: 500 }}>
              You were in a room with{" "}
              <span style={{ color: "#111", fontWeight: 700 }}>
                {women.map(w => w.name).join(", ")}
              </span>.
            </p>
          </div>

          {/* Prompt line */}
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.4)", padding: "8px 18px 0", lineHeight: 1.5 }}>
            Keep the thread going.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 9, padding: "14px 18px 18px" }}>
            <button
              onClick={() => setShowTraditionSheet(true)}
              style={{
                flex: 1,
                background: "#111",
                color: "white",
                border: "none",
                borderRadius: 999,
                padding: "12px 0",
                fontFamily: "var(--font-jost)",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.06em",
                cursor: "pointer",
                boxShadow: "0 2px 0 rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.18)",
              }}
            >
              Start a tradition →
            </button>
            <button
              onClick={handleSendFlower}
              style={{
                flex: 1,
                background: flowerSent ? "#FFF0F5" : "white",
                color: flowerSent ? PINK : "#111",
                border: `1.5px solid ${flowerSent ? PINK : "rgba(0,0,0,0.10)"}`,
                borderRadius: 999,
                padding: "12px 0",
                fontFamily: "var(--font-jost)",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.06em",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              {flowerSent ? "Flowers sent ✦" : "Send a flower"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Start a Tradition Sheet ── */}
      {showTraditionSheet && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={() => setShowTraditionSheet(false)}
          />
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201,
            background: "#FEFCF7",
            borderRadius: "24px 24px 0 0",
            maxHeight: "88vh",
            overflowY: "auto",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
              <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} />
            </div>

            {/* Sheet header */}
            <div style={{ padding: "0 24px 8px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.2em", color: PINK }}>NEW TRADITION</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 24, color: "#111", marginTop: 2, lineHeight: 1.1 }}>
                  Make it a ritual.
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", color: "rgba(0,0,0,0.4)", marginTop: 6 }}>
                  With {women.map(w => w.name).join(", ")}
                </p>
              </div>
              <button
                onClick={() => setShowTraditionSheet(false)}
                style={{ background: "rgba(0,0,0,0.07)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
              </button>
            </div>

            {/* Form */}
            <div style={{ padding: "16px 24px 48px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.15em", color: "#aaa", marginBottom: 8, textTransform: "uppercase" as const }}>What do you want to call it?</p>
                <input
                  value={tradName}
                  onChange={e => setTradName(e.target.value)}
                  placeholder="e.g. Monday Dinner Club"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: "1.5px solid #F0E0E8",
                    background: "white",
                    fontFamily: "var(--font-jost)",
                    fontSize: 14,
                    color: "#111",
                    outline: "none",
                    boxSizing: "border-box" as const,
                  }}
                />
              </div>

              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.15em", color: "#aaa", marginBottom: 8, textTransform: "uppercase" as const }}>How often?</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                  {["weekly", "biweekly", "monthly", "seasonal"].map(f => (
                    <button
                      key={f}
                      onClick={() => setTradFreq(f)}
                      style={{
                        padding: "9px 16px",
                        borderRadius: 999,
                        border: `1.5px solid ${tradFreq === f ? PINK : "#F0E0E8"}`,
                        background: tradFreq === f ? "#FFF0F5" : "white",
                        color: tradFreq === f ? PINK : "#666",
                        fontFamily: "var(--font-jost)",
                        fontSize: "12px",
                        fontWeight: tradFreq === f ? 700 : 500,
                        cursor: "pointer",
                        textTransform: "capitalize" as const,
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Women who'll be in it */}
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.15em", color: "#aaa", marginBottom: 10, textTransform: "uppercase" as const }}>Starting with</p>
                <div style={{ display: "flex", gap: 10 }}>
                  {women.map((w, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${w.color}, ${w.color}bb)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-jost)", fontSize: "14px", fontWeight: 800, color: "white",
                      }}>
                        {w.initial}
                      </div>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "#888" }}>{w.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/member/happenings"
                onClick={() => setShowTraditionSheet(false)}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "16px",
                  borderRadius: 14,
                  background: tradName.trim() ? PINK : "#eee",
                  color: tradName.trim() ? "white" : "#bbb",
                  fontFamily: "var(--font-jost)",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  pointerEvents: tradName.trim() ? "auto" : "none",
                  boxShadow: tradName.trim() ? `0 2px 0 rgba(150,0,55,0.8), 0 6px 18px ${PINK}44` : "none",
                  transition: "all 0.2s",
                }}
              >
                Start the tradition →
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
