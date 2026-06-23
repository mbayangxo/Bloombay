"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const PINK = "#FF1F7D";
const CREAM = "#FAF6F0";

// Mock club name — real data layer comes later via Supabase
const MOCK_CLUB_NAME = "Museum Girls";

const RULES = [
  "What happens in the club stays in the club — be a safe space for everyone",
  "Arrive open-minded, leave with new connections",
  "Support every woman's story, even when it's different from yours",
  "Show up with your whole self. Nothing less.",
];

const FEATURES = [
  {
    emoji: "🎉",
    title: "Your First Event",
    desc: "You'll be invited to your first event within the week",
  },
  {
    emoji: "💬",
    title: "The Club Chat",
    desc: "Join the private conversation happening right now",
  },
  {
    emoji: "🎁",
    title: "Welcome Gift",
    desc: "A special surprise is on its way to you",
  },
];

export default function ClubWelcomePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const clubId = params.id;

  const [screen, setScreen] = useState(0); // 0–3
  const [rulesAgreed, setRulesAgreed] = useState(false);

  // ── SCREEN 0: Welcome ──────────────────────────────────────────────────────
  if (screen === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #FF1F7D, #FF3A8C 50%, #FF69B4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 28px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* sparkle decorations */}
        {["✦", "✦", "✦", "✦"].map((s, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              fontSize: [12, 8, 16, 10][i],
              color: "#fff",
              opacity: 0.5,
              top: [`18%`, `35%`, `55%`, `25%`][i],
              left: [`12%`, `80%`, `10%`, `75%`][i],
              transform: `rotate(${[0, 45, 20, -15][i]}deg)`,
            }}
          >
            {s}
          </span>
        ))}

        {/* top content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          {/* checkmark circle */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 22, fontWeight: 300 }}>✓</span>
          </div>

          <h1
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: 42,
              fontStyle: "italic",
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 12px",
              lineHeight: 1.1,
            }}
          >
            You&apos;re in ♡
          </h1>

          <p
            style={{
              fontFamily: "Jost, sans-serif",
              fontSize: 12,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              margin: "0 0 16px",
            }}
          >
            {MOCK_CLUB_NAME}
          </p>

          <p
            style={{
              fontFamily: "Caveat, cursive",
              fontSize: 18,
              color: "rgba(255,255,255,0.7)",
              margin: 0,
            }}
          >
            Welcome to the club
          </p>
        </div>

        {/* scrolling ticker */}
        <div
          style={{
            width: "100%",
            overflowX: "hidden",
            whiteSpace: "nowrap",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontFamily: "Jost, sans-serif",
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              animation: "ticker 12s linear infinite",
            }}
          >
            Welcome · {MOCK_CLUB_NAME} · Welcome · {MOCK_CLUB_NAME} · Welcome · {MOCK_CLUB_NAME} · Welcome · {MOCK_CLUB_NAME} ·&nbsp;
          </span>
          <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        </div>

        {/* CTA */}
        <button
          onClick={() => setScreen(1)}
          style={{
            width: "100%",
            padding: "16px 0",
            borderRadius: 50,
            background: "#fff",
            border: "none",
            color: PINK,
            fontFamily: "Jost, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          Let&apos;s get you started →
        </button>
      </div>
    );
  }

  // ── SCREEN 1: The Rules ────────────────────────────────────────────────────
  if (screen === 1) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: CREAM,
          display: "flex",
          flexDirection: "column",
          padding: "48px 20px 48px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: 28,
              fontStyle: "italic",
              fontWeight: 700,
              color: "#111",
              margin: "0 0 8px",
            }}
          >
            The Club Code
          </h1>
          <p
            style={{
              fontFamily: "Caveat, cursive",
              fontSize: 15,
              color: "#888",
              margin: "0 0 28px",
            }}
          >
            Every great club has a culture. Here&apos;s ours.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            {RULES.map((rule, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "stretch",
                  gap: 14,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                {/* pink accent line */}
                <div
                  style={{
                    width: 4,
                    borderRadius: 4,
                    background: PINK,
                    flexShrink: 0,
                    alignSelf: "stretch",
                    minHeight: "100%",
                  }}
                />
                <div>
                  <p
                    style={{
                      fontFamily: "Jost, sans-serif",
                      fontSize: 8,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: PINK,
                      margin: "0 0 4px",
                      fontWeight: 600,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p
                    style={{
                      fontFamily: "Playfair Display, Georgia, serif",
                      fontSize: 14,
                      fontStyle: "italic",
                      color: "#333",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {rule}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* agree checkbox */}
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              cursor: "pointer",
              marginBottom: 32,
            }}
          >
            <div
              onClick={() => setRulesAgreed((v) => !v)}
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: `2px solid ${rulesAgreed ? PINK : "#C8BEB4"}`,
                background: rulesAgreed ? PINK : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {rulesAgreed && (
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>
              )}
            </div>
            <span
              style={{
                fontFamily: "Jost, sans-serif",
                fontSize: 11,
                letterSpacing: "0.08em",
                color: "#555",
                lineHeight: 1.6,
                marginTop: 2,
              }}
            >
              I agree to uphold these values
            </span>
          </label>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setScreen(0)}
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 50,
              background: "transparent",
              border: "1.5px solid #E0D8D0",
              color: "#666",
              fontFamily: "Jost, sans-serif",
              fontSize: 13,
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <button
            onClick={() => setScreen(2)}
            disabled={!rulesAgreed}
            style={{
              flex: 2,
              padding: "14px 0",
              borderRadius: 50,
              background: rulesAgreed
                ? `linear-gradient(135deg, ${PINK}, #FF69B4)`
                : "#E0D8D0",
              border: "none",
              color: rulesAgreed ? "#fff" : "#aaa",
              fontFamily: "Jost, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              cursor: rulesAgreed ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  // ── SCREEN 2: What Awaits You ──────────────────────────────────────────────
  if (screen === 2) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: CREAM,
          display: "flex",
          flexDirection: "column",
          padding: "48px 20px 48px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: 28,
              fontStyle: "italic",
              fontWeight: 700,
              color: "#111",
              margin: "0 0 6px",
            }}
          >
            What Awaits You
          </h1>
          <p
            style={{
              fontFamily: "Jost, sans-serif",
              fontSize: 12,
              color: "#999",
              margin: "0 0 28px",
            }}
          >
            Here&apos;s a taste of what&apos;s coming your way.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "18px 16px 16px",
                  borderTop: `3px solid #FFE4EF`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                }}
              >
                <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{f.emoji}</span>
                <div>
                  <p
                    style={{
                      fontFamily: "Playfair Display, Georgia, serif",
                      fontSize: 16,
                      fontWeight: 700,
                      fontStyle: "italic",
                      color: "#111",
                      margin: "0 0 4px",
                    }}
                  >
                    {f.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "Jost, sans-serif",
                      fontSize: 12,
                      color: "#777",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setScreen(1)}
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 50,
              background: "transparent",
              border: "1.5px solid #E0D8D0",
              color: "#666",
              fontFamily: "Jost, sans-serif",
              fontSize: 13,
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <button
            onClick={() => setScreen(3)}
            style={{
              flex: 2,
              padding: "14px 0",
              borderRadius: 50,
              background: `linear-gradient(135deg, ${PINK}, #FF69B4)`,
              border: "none",
              color: "#fff",
              fontFamily: "Jost, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            I&apos;m ready →
          </button>
        </div>
      </div>
    );
  }

  // ── SCREEN 3: Final — Go to Club ──────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FF1F7D, #FF69B4)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "60px 28px 48px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* confetti circles */}
      {[
        { size: 14, top: "8%", left: "10%", bg: "#fff", opacity: 0.3 },
        { size: 10, top: "18%", left: "82%", bg: "#FFE4EF", opacity: 0.5 },
        { size: 18, top: "75%", left: "6%", bg: "#fff", opacity: 0.2 },
        { size: 12, top: "80%", left: "88%", bg: "#FFE4EF", opacity: 0.4 },
        { size: 8, top: "45%", left: "92%", bg: "#fff", opacity: 0.3 },
        { size: 16, top: "55%", left: "4%", bg: "#FFE4EF", opacity: 0.25 },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: c.size,
            height: c.size,
            borderRadius: "50%",
            background: c.bg,
            opacity: c.opacity,
            top: c.top,
            left: c.left,
            transform: `scale(${1 + i * 0.1})`,
          }}
        />
      ))}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        {/* avatar placeholder */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              color: PINK,
              fontSize: 28,
              fontWeight: 300,
              lineHeight: 1,
            }}
          >
            +
          </span>
        </div>

        <h1
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 32,
            fontStyle: "italic",
            fontWeight: 900,
            color: "#fff",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          You&apos;re officially a Bloomie ♡
        </h1>

        {/* club name pill */}
        <div
          style={{
            background: "#fff",
            borderRadius: 50,
            padding: "6px 16px",
            fontFamily: "Jost, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: PINK,
          }}
        >
          {MOCK_CLUB_NAME}
        </div>
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
        <Link
          href={`/member/clubs/${clubId}`}
          style={{
            display: "block",
            width: "100%",
            padding: "16px 0",
            borderRadius: 50,
            background: "#fff",
            border: "none",
            color: PINK,
            fontFamily: "Jost, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textDecoration: "none",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          Set your club profile
        </Link>
        <Link
          href={`/member/clubs/${clubId}`}
          style={{
            display: "block",
            width: "100%",
            padding: "14px 0",
            borderRadius: 50,
            background: "transparent",
            border: "1.5px solid rgba(255,255,255,0.4)",
            color: "#fff",
            fontFamily: "Jost, sans-serif",
            fontSize: 13,
            letterSpacing: "0.08em",
            textDecoration: "none",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          Go to the club →
        </Link>
      </div>
    </div>
  );
}
