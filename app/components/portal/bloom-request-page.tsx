"use client";

import { useState } from "react";

const PINK = "#FF1F7D";
const INK = "#111111";
const IVORY = "#fdf4ec";
const ROSE_GOLD = "#c9a27a";

const MADISON = {
  initial: "M",
  name: "Madison",
  firstName: "Madison",
  lastName: "Chen",
  occupation: "Law Student",
  tags: ["Law Student", "Dog Mom", "Jazz Lover", "Book Club"],
  location: "West Village",
  distance: "2 miles away",
  compatibility: 91,
  color: PINK,
};

const COMPAT_POINTS = [
  "Values aligned",
  "Lifestyle aligned",
  "Energy aligned",
  "Vibe aligned",
];

function EnvelopeSVG() {
  return (
    <svg
      width="220"
      height="160"
      viewBox="0 0 220 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", margin: "0 auto" }}
    >
      <rect x="10" y="40" width="200" height="120" rx="10" fill="#C0185F" />
      <rect x="10" y="40" width="200" height="120" rx="10" fill="url(#envGrad)" />
      <path
        d="M10 50 Q110 130 210 50"
        fill="#8B0045"
        opacity="0.6"
      />
      <path
        d="M10 40 C10 40 60 95 110 108 C160 95 210 40 210 40 Z"
        fill="#E8186F"
      />
      <path
        d="M10 40 L110 108 L210 40"
        stroke="#C0185F"
        strokeWidth="1"
        fill="none"
      />
      <line x1="10" y1="160" x2="110" y2="100" stroke="#8B0045" strokeWidth="0.8" opacity="0.4" />
      <line x1="210" y1="160" x2="110" y2="100" stroke="#8B0045" strokeWidth="0.8" opacity="0.4" />
      <circle cx="110" cy="108" r="20" fill="#8B0045" />
      <circle cx="110" cy="108" r="17" fill="#C0185F" />
      <circle cx="110" cy="108" r="15" stroke="#E8186F" strokeWidth="1" fill="none" />
      <text
        x="110"
        y="114"
        textAnchor="middle"
        fontSize="16"
        fontWeight="900"
        fontStyle="italic"
        fill="white"
        fontFamily="var(--font-playfair)"
      >
        B
      </text>
      <defs>
        <linearGradient id="envGrad" x1="10" y1="40" x2="210" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8186F" />
          <stop offset="100%" stopColor="#A00050" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PolaroidDecor({
  style,
  rotate,
  label,
}: {
  style?: React.CSSProperties;
  rotate: number;
  label: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: 80,
        background: "white",
        borderRadius: 4,
        padding: "6px 6px 18px",
        boxShadow: "0 4px 18px rgba(0,0,0,0.35)",
        transform: `rotate(${rotate}deg)`,
        pointerEvents: "none",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: 56,
          borderRadius: 2,
          background: "linear-gradient(135deg, #2a0018 0%, #4a0030 100%)",
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-caveat)",
          fontSize: 9,
          color: "#888",
          textAlign: "center",
          marginTop: 4,
          lineHeight: 1.2,
        }}
      >
        {label}
      </p>
    </div>
  );
}

function RuleBookCard() {
  return (
    <div
      style={{
        background: "#1a0010",
        borderRadius: 10,
        padding: "14px 16px",
        border: "1px solid rgba(255,31,125,0.2)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        maxWidth: 140,
        flexShrink: 0,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: 7,
          fontWeight: 800,
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.4)",
          marginBottom: 8,
        }}
      >
        BLOOMBAY
      </p>
      <p
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: "0.18em",
          color: PINK,
          marginBottom: 10,
        }}
      >
        RULE BOOK
      </p>
      <p
        style={{
          fontFamily: "var(--font-caveat)",
          fontSize: 13,
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.7,
        }}
      >
        no 1<br />
        be kind.<br />
        be classy.<br />
        be you.
      </p>
    </div>
  );
}

function ThankYouState({ onDone }: { onDone: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: PINK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 32px",
      }}
    >
      <style>{`
        @keyframes bloomPop { 0%{opacity:0;transform:scale(0.5)} 60%{transform:scale(1.1)} 100%{opacity:1;transform:scale(1)} }
        @keyframes petalRain { 0%{opacity:0;transform:translateY(-40px) rotate(0deg)} 20%{opacity:1} 100%{opacity:0;transform:translateY(110vh) rotate(400deg)} }
      `}</style>
      {["8%", "22%", "38%", "55%", "70%", "85%"].map((left, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            left,
            top: 0,
            fontSize: 22,
            opacity: 0,
            animation: `petalRain ${2.8 + i * 0.35}s ease-in ${i * 0.25}s infinite`,
            pointerEvents: "none",
          }}
        >
          🌸
        </div>
      ))}
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          animation: "bloomPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <span style={{ fontSize: 44 }}>✿</span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.22em",
          color: "rgba(255,255,255,0.65)",
          marginBottom: 8,
          animation: "bloomPop 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both",
          opacity: 0,
        }}
      >
        YOU OPENED IT
      </p>
      <p
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: 42,
          fontWeight: 900,
          fontStyle: "italic",
          color: "white",
          textAlign: "center",
          lineHeight: 1,
          marginBottom: 16,
          animation: "bloomPop 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
          opacity: 0,
        }}
      >
        She&apos;s waiting.
      </p>
      <p
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: 15,
          fontStyle: "italic",
          color: "rgba(255,255,255,0.75)",
          textAlign: "center",
          lineHeight: 1.6,
          marginBottom: 40,
          animation: "bloomPop 0.5s 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
          opacity: 0,
        }}
      >
        You and {MADISON.firstName} are now connected.<br />
        Say hello.
      </p>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          animation: "bloomPop 0.5s 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
          opacity: 0,
        }}
      >
        <button
          onClick={onDone}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 999,
            border: "none",
            background: "white",
            color: PINK,
            fontFamily: "var(--font-jost)",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.06em",
            cursor: "pointer",
            boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
          }}
        >
          Message {MADISON.firstName} →
        </button>
        <button
          onClick={onDone}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 999,
            border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "var(--font-jost)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

export function BloomRequestPage() {
  const [opened, setOpened] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "#0d0008",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 32px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: 28,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 12,
            }}
          >
            Maybe another time.
          </p>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 11,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.1em",
            }}
          >
            This request is private. You decide what happens next.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(170deg, #0d0008 0%, #1a0012 40%, #0d0008 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes subtlePulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
      `}</style>

      <PolaroidDecor style={{ top: 60, left: -18 }} rotate={-14} label="girls night out" />
      <PolaroidDecor style={{ top: 140, right: -14 }} rotate={11} label="so much fun" />
      <PolaroidDecor style={{ top: 280, left: -22 }} rotate={7} label="us two ✿" />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          paddingBottom: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 20px 0",
            position: "relative",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.28em",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            BLOOMBAY
          </p>
          <div
            style={{
              position: "absolute",
              right: 20,
              top: 20,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill={PINK} />
              <path d="M12 2C12 2 9 6 9 9.5C9 11.4 10.3 13 12 13C13.7 13 15 11.4 15 9.5C15 6 12 2 12 2Z" fill={PINK} opacity="0.8" />
              <path d="M12 22C12 22 9 18 9 14.5C9 12.6 10.3 11 12 11C13.7 11 15 12.6 15 14.5C15 18 12 22 12 22Z" fill={PINK} opacity="0.8" />
              <path d="M2 12C2 12 6 9 9.5 9C11.4 9 13 10.3 13 12C13 13.7 11.4 15 9.5 15C6 15 2 12 2 12Z" fill={PINK} opacity="0.8" />
              <path d="M22 12C22 12 18 9 14.5 9C12.6 9 11 10.3 11 12C11 13.7 12.6 15 14.5 15C18 15 22 12 22 12Z" fill={PINK} opacity="0.8" />
            </svg>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "28px 24px 12px",
            animation: "fadeUp 0.4s ease-out both",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: 22,
              fontStyle: "italic",
              color: "rgba(255,100,160,0.7)",
              marginBottom: 6,
            }}
          >
            You just received a
          </p>
          <h1
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 52,
              fontWeight: 900,
              color: "white",
              lineHeight: 0.95,
              marginBottom: 10,
              letterSpacing: "-0.01em",
            }}
          >
            BLOOM<br />REQUEST
          </h1>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.24em",
              color: "rgba(255,255,255,0.28)",
              textTransform: "uppercase",
            }}
          >
            AN INVITATION TO A REAL CONNECTION
          </p>
        </div>

        <div
          style={{
            padding: "20px 24px 8px",
            animation: "fadeUp 0.4s 0.1s ease-out both",
            opacity: 0,
          }}
        >
          <EnvelopeSVG />
          <div
            style={{
              textAlign: "center",
              marginTop: 20,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: 17,
                fontStyle: "italic",
                color: "#FF85C0",
                marginBottom: 6,
              }}
            >
              She sees something in you.
            </p>
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 12,
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.6,
              }}
            >
              And she&apos;d love to get to know the real you.
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "16px 24px",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            animation: "fadeUp 0.4s 0.15s ease-out both",
            opacity: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 14,
              padding: "16px 18px",
              border: "1px solid rgba(255,31,125,0.15)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 7,
                fontWeight: 800,
                letterSpacing: "0.22em",
                color: PINK,
                marginBottom: 8,
              }}
            >
              YANDE SAYS
            </p>
            <p
              style={{
                fontFamily: "var(--font-caveat)",
                fontSize: 16,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.55,
              }}
            >
              &ldquo;The right connections don&apos;t just happen, they&apos;re chosen. You bring the intention, we bring the women.&rdquo;
            </p>
          </div>
          <RuleBookCard />
        </div>

        <div
          style={{
            margin: "0 24px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 20,
            padding: "20px",
            border: "1px solid rgba(255,255,255,0.07)",
            animation: "fadeUp 0.4s 0.2s ease-out both",
            opacity: 0,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 7,
              fontWeight: 800,
              letterSpacing: "0.24em",
              color: PINK,
              marginBottom: 14,
            }}
          >
            ABOUT HER
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 35%, #FF69B4, ${PINK})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 6px 24px ${PINK}55`,
                border: "3px solid rgba(255,255,255,0.12)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: 28,
                  fontWeight: 900,
                  fontStyle: "italic",
                  color: "white",
                }}
              >
                {MADISON.initial}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: 22,
                  fontWeight: 900,
                  fontStyle: "italic",
                  color: "white",
                  lineHeight: 1,
                  marginBottom: 10,
                }}
              >
                {MADISON.firstName}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {MADISON.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "rgba(255,31,125,0.15)",
                      color: "#FF85C0",
                      border: "1px solid rgba(255,31,125,0.2)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12 }}>📍</span>
              <p
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {MADISON.location}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12 }}>✦</span>
              <p
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {MADISON.distance}
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            margin: "14px 24px 0",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 20,
            padding: "20px",
            border: "1px solid rgba(255,255,255,0.07)",
            animation: "fadeUp 0.4s 0.25s ease-out both",
            opacity: 0,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 7,
              fontWeight: 800,
              letterSpacing: "0.24em",
              color: PINK,
              marginBottom: 16,
            }}
          >
            COMPATIBILITY
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ flexShrink: 0 }}>
              <p
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontSize: 64,
                  fontWeight: 900,
                  color: PINK,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {MADISON.compatibility}
                <span style={{ fontSize: 28 }}>%</span>
              </p>
              <p
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 7,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.1em",
                  marginTop: 2,
                }}
              >
                MATCH SCORE
              </p>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {COMPAT_POINTS.map((pt) => (
                <div key={pt} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "rgba(255,31,125,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <polyline
                        points="1.5,5 3.5,7.5 8.5,2.5"
                        stroke={PINK}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {pt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "20px 24px 0",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            animation: "fadeUp 0.4s 0.3s ease-out both",
            opacity: 0,
          }}
        >
          <button
            onClick={() => setOpened(true)}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: 999,
              border: "none",
              background: PINK,
              color: "white",
              fontFamily: "var(--font-jost)",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.1em",
              cursor: "pointer",
              boxShadow: `0 8px 32px ${PINK}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            OPEN BLOOM REQUEST
            <span style={{ fontSize: 18 }}>✦</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 999,
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "var(--font-jost)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.08em",
            }}
          >
            NOT NOW
          </button>
          <p
            style={{
              textAlign: "center",
              fontFamily: "var(--font-jost)",
              fontSize: 9,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.04em",
              paddingBottom: 8,
            }}
          >
            This request is private. You decide what happens next.
          </p>
        </div>
      </div>

      {opened && <ThankYouState onDone={() => setOpened(false)} />}
    </div>
  );
}

export function BloomRequestSheet({
  onAccept,
  onDismiss,
}: {
  onAccept: () => void;
  onDismiss: () => void;
}) {
  const [revealing, setRevealing] = useState(false);

  function handleAccept() {
    setRevealing(true);
    setTimeout(() => {
      setRevealing(false);
      onAccept();
    }, 600);
  }

  return (
    <div
      style={{
        background: "linear-gradient(170deg, #1a0012 0%, #0d0008 100%)",
        borderRadius: "24px 24px 0 0",
        padding: "20px 20px 36px",
      }}
    >
      <style>{`
        @keyframes envelopeReveal { 0%{transform:scaleY(1)} 50%{transform:scaleY(0.9) translateY(4px)} 100%{transform:scaleY(1)} }
      `}</style>
      <div
        style={{
          width: 36,
          height: 4,
          borderRadius: 2,
          background: "rgba(255,255,255,0.15)",
          margin: "0 auto 20px",
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: 7,
          fontWeight: 800,
          letterSpacing: "0.24em",
          color: PINK,
          textAlign: "center",
          marginBottom: 6,
        }}
      >
        YOU HAVE A
      </p>
      <p
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: 30,
          fontWeight: 900,
          fontStyle: "italic",
          color: "white",
          textAlign: "center",
          marginBottom: 20,
          lineHeight: 1,
        }}
      >
        Bloom Request
      </p>
      <div
        style={{
          animation: revealing ? "envelopeReveal 0.6s ease-in-out" : undefined,
        }}
      >
        <EnvelopeSVG />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "20px 0",
          padding: "14px 16px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 14,
          border: "1px solid rgba(255,31,125,0.15)",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, #FF69B4, ${PINK})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: `0 4px 14px ${PINK}44`,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: 18,
              fontWeight: 900,
              fontStyle: "italic",
              color: "white",
            }}
          >
            {MADISON.initial}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: 16,
              fontWeight: 900,
              fontStyle: "italic",
              color: "white",
              marginBottom: 4,
            }}
          >
            {MADISON.firstName}
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {MADISON.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 8,
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: 999,
                  background: "rgba(255,31,125,0.15)",
                  color: "#FF85C0",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: 28,
              fontWeight: 900,
              color: PINK,
              lineHeight: 1,
            }}
          >
            {MADISON.compatibility}%
          </p>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 7,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.08em",
            }}
          >
            MATCH
          </p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={handleAccept}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 999,
            border: "none",
            background: PINK,
            color: "white",
            fontFamily: "var(--font-jost)",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.1em",
            cursor: "pointer",
            boxShadow: `0 6px 24px ${PINK}55`,
          }}
        >
          OPEN BLOOM REQUEST ✦
        </button>
        <button
          onClick={onDismiss}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 999,
            border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "var(--font-jost)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          NOT NOW
        </button>
      </div>
    </div>
  );
}
