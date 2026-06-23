"use client";

import { useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";
// const PAPER = "#FEFCF7";
const GOLD = "#D4A853";

const planItems = [
  { emoji: "🍽", text: "Dinner at Lafayette House", time: "8:00 PM" },
  { emoji: "🍸", text: "Drinks after at Diana", time: "10:30 PM" },
  { emoji: "🚶‍♀️", text: "Late night girls walk", time: "Midnight" },
  { emoji: "💡", text: "Ideas with: the wine alternative", time: "TBD" },
];

const planItemAvatars = [
  ["#FF1F7D", "D"],
  ["#C084FC", "S"],
  ["#FF9F43", "N"],
];

const notes = [
  { name: "Dina", note: "Wine from the bottle shop" },
  { name: "Sofia", note: "Flowers for the table" },
  { name: "Nour", note: "Polaroid camera" },
];

const attendeeAvatarColors = [
  "#FF1F7D",
  "#C084FC",
  "#0EA5E9",
  "#FF9F43",
  "#059669",
  "#8B5CF6",
  "#FF6B9D",
  "#374151",
];
const attendeeLetters = ["D", "S", "N", "M", "T", "Y", "A", "R"];

const attendees = [
  { name: "Dina K.", neighborhood: "Williamsburg", match: true, color: "#FF1F7D", initial: "D" },
  { name: "Sofia M.", neighborhood: "West Village", match: false, color: "#C084FC", initial: "S" },
  { name: "Nour A.", neighborhood: "Crown Heights", match: false, color: "#0EA5E9", initial: "N" },
  { name: "Maya L.", neighborhood: "Brooklyn", match: false, color: "#FF9F43", initial: "M" },
  { name: "Temi S.", neighborhood: "Park Slope", match: false, color: "#059669", initial: "T" },
];

const orders = [
  { person: "Dina — Salmon entrée", price: "$45" },
  { person: "Sofia — Pasta", price: "$38" },
  { person: "Nour — Chicken", price: "$42" },
];

const tabs = ["PLAN", "ATTENDEES", "DETAILS", "ORDERS"];

export default function PlanRoomPage() {
  const [activeTab, setActiveTab] = useState("PLAN");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F8F8",
        fontFamily: "var(--font-jost)",
        position: "relative",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #F0F0F0",
          padding: "14px 16px",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Back */}
        <Link href="/member/plans" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#F5F5F5",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C1B1C" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </Link>

        {/* Center Title */}
        <span
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 18,
            color: PINK,
          }}
        >
          PLAN ROOM 🌸
        </span>

        {/* Right Icons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#F5F5F5",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#F5F5F5",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={DARK}>
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* EVENT SUBHEADER */}
      <div
        style={{
          background: "white",
          padding: "0 16px 0",
          borderBottom: "1px solid #F0F0F0",
        }}
      >
        <div style={{ paddingTop: 14 }}>
          <div
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: 22,
              fontWeight: 900,
              color: DARK,
              marginBottom: 2,
            }}
          >
            Saturday in Soho
          </div>
          <div
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 11,
              color: "#aaa",
            }}
          >
            May 24 · Lafayette House
          </div>
        </div>

        {/* TABS ROW */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 0,
            padding: "12px 0 0",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-jost)",
                fontSize: 10,
                fontWeight: 800,
                color: activeTab === tab ? PINK : "#aaa",
                paddingBottom: 8,
                borderBottom: activeTab === tab ? `2px solid ${PINK}` : "2px solid transparent",
                marginRight: 20,
                padding: "0 0 8px 0",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div style={{ paddingBottom: 100, overflowY: "auto" }}>

        {/* PLAN TAB */}
        {activeTab === "PLAN" && (
          <div>
            {/* Plan Items Feed */}
            <div style={{ padding: "16px 16px 0" }}>
              <div
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  color: "#aaa",
                  marginBottom: 10,
                }}
              >
                PLAN ITEMS
              </div>

              {planItems.map((item, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      background: "white",
                      borderRadius: 14,
                      padding: "12px 14px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    {/* Emoji circle */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#FFF0F5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                        flexShrink: 0,
                      }}
                    >
                      {item.emoji}
                    </div>

                    {/* Text */}
                    <span
                      style={{
                        fontFamily: "var(--font-jost)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: DARK,
                        flex: 1,
                      }}
                    >
                      {item.text}
                    </span>

                    {/* Time badge */}
                    <span
                      style={{
                        fontFamily: "var(--font-jost)",
                        fontSize: 8,
                        fontWeight: 700,
                        color: PINK,
                        background: `${PINK}12`,
                        borderRadius: 999,
                        padding: "3px 8px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.time}
                    </span>
                  </div>

                  {/* Avatar row */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: 4,
                      paddingLeft: 4,
                    }}
                  >
                    {planItemAvatars.map((av, ai) => (
                      <div
                        key={ai}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: av[0],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 9,
                          fontWeight: 700,
                          color: "white",
                          fontFamily: "var(--font-jost)",
                          marginLeft: ai === 0 ? 0 : -6,
                          border: "2px solid white",
                        }}
                      >
                        {av[1]}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* WHO'S NOTES */}
            <div style={{ padding: "16px 16px 0" }}>
              <div
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  color: "#aaa",
                  marginBottom: 10,
                }}
              >
                WHO&apos;S NOTES:
              </div>

              {notes.map((note, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      background: `${PINK}12`,
                      borderRadius: 999,
                      padding: "4px 10px",
                      fontFamily: "var(--font-jost)",
                      fontSize: 9,
                      fontWeight: 700,
                      color: PINK,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {note.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: 11,
                      color: "#555",
                      flex: 1,
                      lineHeight: 1.4,
                    }}
                  >
                    {note.note}
                  </span>
                </div>
              ))}
            </div>

            {/* ATTENDEES section */}
            <div style={{ padding: "12px 16px" }}>
              <div
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  color: "#aaa",
                  marginBottom: 10,
                }}
              >
                ATTENDEES
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                {attendeeAvatarColors.map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: color,
                      border: "2px solid white",
                      marginLeft: i === 0 ? 0 : -8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "white",
                      fontFamily: "var(--font-jost)",
                    }}
                  >
                    {attendeeLetters[i]}
                  </div>
                ))}
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 10,
                    color: "#888",
                    marginLeft: 8,
                    alignSelf: "center",
                  }}
                >
                  +12 more
                </span>
              </div>
            </div>

            {/* VIBE BOARD */}
            <div
              style={{
                margin: "12px 16px",
                padding: 14,
                background: "#FFF8EC",
                borderRadius: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  color: "#aaa",
                  marginBottom: 10,
                }}
              >
                VIBE BOARD
              </div>

              {/* Quote card */}
              <div
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 12,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: GOLD,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "white",
                      fontFamily: "var(--font-jost)",
                      flexShrink: 0,
                    }}
                  >
                    M
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: 10,
                      color: DARK,
                      fontWeight: 600,
                    }}
                  >
                    Mia
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-caveat)",
                    fontSize: 14,
                    color: "#444",
                  }}
                >
                  I found the cutest vintage top that would be perfect...
                </div>
              </div>

              {/* Reply bubble */}
              <div
                style={{
                  background: "#F5F5F5",
                  borderRadius: 12,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-caveat)",
                    fontSize: 13,
                    color: "#666",
                  }}
                >
                  Discovered! I was so set on...
                </div>
              </div>

              {/* React row */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 8,
                }}
              >
                {["💕 12", "✨ 8", "🌸 6"].map((reaction, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: 10,
                      color: "#888",
                    }}
                  >
                    {reaction}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ATTENDEES TAB */}
        {activeTab === "ATTENDEES" && (
          <div>
            {attendees.map((person, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 12,
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: "1px solid #F5F5F5",
                  background: "white",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${person.color}, ${person.color}88)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "white",
                    fontFamily: "var(--font-jost)",
                    flexShrink: 0,
                  }}
                >
                  {person.initial}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: DARK,
                    }}
                  >
                    {person.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: 9,
                      color: "#aaa",
                    }}
                  >
                    {person.neighborhood}
                  </div>
                </div>
                {person.match && (
                  <span
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: 9,
                      fontWeight: 700,
                      color: PINK,
                      background: `${PINK}12`,
                      borderRadius: 999,
                      padding: "3px 8px",
                    }}
                  >
                    94% match
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* DETAILS TAB */}
        {activeTab === "DETAILS" && (
          <div style={{ padding: 16 }}>
            <div
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontSize: 22,
                fontWeight: 700,
                color: DARK,
              }}
            >
              Saturday in Soho
            </div>
            <div
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 12,
                color: "#888",
                marginTop: 4,
              }}
            >
              Saturday, May 24 · 8:00 PM
            </div>
            <div
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 12,
                color: "#888",
              }}
            >
              Lafayette House · SoHo, NYC
            </div>
            <div
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 11,
                color: PINK,
                marginTop: 16,
              }}
            >
              Organized by Yande
            </div>
            <div
              style={{
                fontFamily: "var(--font-caveat)",
                fontSize: 15,
                color: "#555",
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              An intimate dinner for women who love good food, great company, and making memories in the city.
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "ORDERS" && (
          <div style={{ padding: 16 }}>
            <div
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: "0.2em",
                color: "#aaa",
                marginBottom: 10,
              }}
            >
              ORDER SUMMARY
            </div>

            {orders.map((order, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #F5F5F5",
                  padding: "10px 0",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 12,
                    color: DARK,
                  }}
                >
                  {order.person}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 12,
                    color: PINK,
                  }}
                >
                  {order.price}
                </span>
              </div>
            ))}

            {/* Total row */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
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
              <span
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 13,
                  fontWeight: 800,
                  color: DARK,
                }}
              >
                $125
              </span>
            </div>
          </div>
        )}
      </div>

      {/* FIXED BOTTOM INPUT BAR */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          borderTop: "1px solid #F0F0F0",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
          padding: "8px 16px",
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Add to the plan..."
          style={{
            flex: 1,
            background: "#F5F5F5",
            border: "none",
            borderRadius: 999,
            padding: "10px 14px",
            fontFamily: "var(--font-jost)",
            fontSize: 13,
            outline: "none",
            color: DARK,
          }}
        />
        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: PINK,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" stroke="white" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
