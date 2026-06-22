"use client";

import { useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";
const PAPER = "#FEFCF7";
const GOLD = "#D4A853";

export default function TicketPage() {
  const [_dummy] = useState(false);

  const avatars = [
    { color: "#FF1F7D", letter: "S" },
    { color: "#C084FC", letter: "M" },
    { color: "#0EA5E9", letter: "A" },
    { color: "#FF9F43", letter: "T" },
    { color: "#059669", letter: "N" },
    { color: "#8B5CF6", letter: "D" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: PAPER,
        fontFamily: "var(--font-jost)",
      }}
    >
      {/* BACK BUTTON */}
      <div
        style={{
          position: "fixed",
          top: "calc(env(safe-area-inset-top, 0px) + 14px)",
          left: 16,
          zIndex: 50,
        }}
      >
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <Link
            href="/member/plans"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1C1B1C"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
        </button>
      </div>

      {/* TICKET CONTAINER */}
      <div
        style={{
          margin: "0 16px 40px",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* TOP SECTION */}
        <div
          style={{
            background: PINK,
            padding: "calc(env(safe-area-inset-top, 0px) + 60px) 24px 0px",
          }}
        >
          {/* ADMIT ONE */}
          <div
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.6)",
              marginBottom: 12,
            }}
          >
            ADMIT ONE
          </div>

          {/* Event Name */}
          <div style={{ marginBottom: 16 }}>
            <p
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 900,
                fontSize: 52,
                color: "white",
                lineHeight: 0.9,
                margin: 0,
              }}
            >
              SATURDAY
            </p>
            <p
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 900,
                fontSize: 52,
                color: "white",
                lineHeight: 0.9,
                margin: 0,
              }}
            >
              IN SOHO
            </p>
          </div>

          {/* Event Photo Area */}
          <div
            style={{
              width: "100%",
              height: 180,
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.3) 100%)",
              borderRadius: 16,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
              marginBottom: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "12px 16px",
                background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-caveat)",
                  fontSize: 13,
                  color: "white",
                  lineHeight: 1.4,
                }}
              >
                An intimate dinner party for women who embrace life...
              </span>
            </div>
          </div>

          {/* Event Info Row */}
          <div
            style={{
              padding: "14px 0 0",
              display: "flex",
              flexDirection: "row",
              gap: 14,
              alignItems: "center",
              paddingBottom: 14,
            }}
          >
            {[
              { icon: "📅", label: "Sat 25" },
              { icon: "🕗", label: "8:00PM" },
              { icon: "👥", label: "44/70" },
            ].map((chip) => (
              <div
                key={chip.label}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {chip.icon} {chip.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PERFORATED DIVIDER */}
        <div style={{ position: "relative", overflow: "visible" }}>
          <div
            style={{
              height: 1,
              background:
                "repeating-linear-gradient(to right, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 8px, transparent 8px, transparent 16px)",
            }}
          />
          {/* Left cut-out */}
          <div
            style={{
              position: "absolute",
              left: -28,
              top: -12,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: PAPER,
            }}
          />
          {/* Right cut-out */}
          <div
            style={{
              position: "absolute",
              right: -28,
              top: -12,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: PAPER,
            }}
          />
        </div>

        {/* BOTTOM SECTION */}
        <div
          style={{
            background: "white",
            padding: "20px 24px 28px",
          }}
        >
          {/* Organizer Row */}
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginBottom: 16,
              paddingBottom: 14,
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            <div
              style={{
                background: `${PINK}12`,
                borderRadius: 999,
                padding: "4px 10px",
                fontFamily: "var(--font-jost)",
                fontSize: 8,
                fontWeight: 800,
                color: PINK,
              }}
            >
              YANDE SAYS
            </div>
            <span style={{ color: "#aaa" }}>/</span>
            <span
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 8,
                fontWeight: 700,
                color: "#888",
              }}
            >
              BETTER COMPANY
            </span>
          </div>

          {/* TABLE 07 */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 900,
                fontSize: 36,
                color: DARK,
                lineHeight: 1,
              }}
            >
              TABLE 07
            </div>
            <div
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 11,
                color: "#888",
                marginTop: 4,
                marginBottom: 16,
              }}
            >
              4 women · 2 left
            </div>
          </div>

          {/* Price Breakdown */}
          <div
            style={{
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            {[
              { label: "Ticket", value: "$25" },
              { label: "Food", value: "$65" },
              { label: "Wine", value: "$80" },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 12,
                    color: "#555",
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 12,
                    color: DARK,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}

            {/* Total Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 13,
                  fontWeight: 800,
                  color: DARK,
                }}
              >
                Total
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 16,
                    fontWeight: 900,
                    color: DARK,
                  }}
                >
                  $170
                </span>
                <span
                  style={{
                    background: "#ECFDF5",
                    borderRadius: 999,
                    padding: "3px 10px",
                    fontFamily: "var(--font-jost)",
                    fontSize: 8,
                    fontWeight: 800,
                    color: "#059669",
                  }}
                >
                  Paid in full
                </span>
              </div>
            </div>
          </div>

          {/* "This is your group" Section */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: "#aaa",
                marginBottom: 10,
              }}
            >
              THIS IS YOUR GROUP
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {avatars.map((avatar, i) => (
                <div
                  key={i}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "2px solid white",
                    marginLeft: i === 0 ? 0 : -8,
                    background: avatar.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-jost)",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {avatar.letter}
                </div>
              ))}
            </div>
          </div>

          {/* Compatibility Section */}
          <div
            style={{
              marginBottom: 20,
              background: "#FFF0F5",
              borderRadius: 16,
              padding: "16px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 900,
                fontSize: 36,
                color: PINK,
              }}
            >
              94%
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: DARK,
                }}
              >
                Strong energy match
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 10,
                  color: "#888",
                  marginTop: 2,
                }}
              >
                You and your group are highly compatible
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            style={{
              width: "100%",
              padding: "14px 0",
              background: PINK,
              color: "white",
              border: "none",
              borderRadius: 999,
              fontFamily: "var(--font-jost)",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              marginBottom: 10,
            }}
          >
            Invite a Bloomie 🌸
          </button>
          <button
            style={{
              width: "100%",
              padding: "14px 0",
              background: "white",
              color: DARK,
              border: "1.5px solid #E5E5E5",
              borderRadius: 999,
              fontFamily: "var(--font-jost)",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Modify Seat
          </button>
        </div>
      </div>
    </div>
  );
}
