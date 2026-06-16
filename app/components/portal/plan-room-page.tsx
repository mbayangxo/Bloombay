"use client";

import { useState, useRef } from "react";

const PINK = "#FF1F7D";
const INK = "#111111";
const IVORY = "#fdf4ec";

const EVENT = {
  name: "Saturday in Soho",
  emoji: "♡",
  date: "May 24",
  time: "8:00PM",
  venue: "Lafayette House, NYC",
};

const AGENDA = [
  { icon: "🍽️", text: "Dinner at Lafayette House" },
  { icon: "🍹", text: "Drinks after at Dante" },
  { icon: "🌙", text: "Late night girls' walk" },
];

const CONFIRMED = [
  { initial: "Y", name: "You", color: PINK, role: "Host" },
  { initial: "M", name: "Maya", color: "#FF69B4", role: "Confirmed" },
  { initial: "T", name: "Teni", color: "#C084FC", role: "Confirmed" },
  { initial: "A", name: "Aisha", color: "#34D399", role: "Confirmed" },
  { initial: "Z", name: "Zara", color: "#F59E0B", role: "Confirmed" },
  { initial: "N", name: "Noor", color: "#60A5FA", role: "Confirmed" },
];

const PENDING = [
  { initial: "S", name: "Samira", color: "#FB923C" },
  { initial: "L", name: "Liv", color: "#A78BFA" },
  { initial: "C", name: "Clara", color: "#4ADE80" },
];

const VOICE_NOTES = [
  { initial: "M", name: "Maya", color: "#FF69B4", duration: "0:36", waves: [0.3, 0.6, 0.9, 0.5, 0.8, 0.4, 0.7, 0.9, 0.5, 0.6, 0.3, 0.7, 0.8, 0.4, 0.5, 0.9, 0.6, 0.3, 0.7, 0.5] },
  { initial: "T", name: "Teni", color: "#C084FC", duration: "0:28", waves: [0.5, 0.8, 0.4, 0.7, 0.3, 0.9, 0.6, 0.4, 0.8, 0.5, 0.7, 0.3, 0.6, 0.9, 0.4, 0.5, 0.7, 0.8, 0.3, 0.6] },
  { initial: "A", name: "Aisha", color: "#34D399", duration: "0:31", waves: [0.7, 0.4, 0.8, 0.3, 0.6, 0.9, 0.5, 0.7, 0.4, 0.8, 0.3, 0.6, 0.9, 0.5, 0.4, 0.7, 0.8, 0.3, 0.6, 0.9] },
];

const FOOD_COLORS = ["#FFE4E1", "#E1F0FF", "#E1FFE8"];
const FOOD_EMOJIS = ["🍝", "🥂", "🍮"];

const CHAT_MESSAGES = [
  { id: 1, initial: "M", name: "Maya", color: "#FF69B4", text: "So excited for this!! 🌸", sent: false, time: "7:42 PM" },
  { id: 2, initial: "Y", name: "You", color: PINK, text: "Me too! Lafayette is going to be perfect 💕", sent: true, time: "7:44 PM" },
  { id: 3, initial: "T", name: "Teni", color: "#C084FC", text: "Should we do a dress code? Main character energy only 😂", sent: false, time: "7:45 PM" },
  { id: 4, initial: "A", name: "Aisha", color: "#34D399", text: "Dress code is literally written in the plan 😂😂", sent: false, time: "7:46 PM" },
  { id: 5, initial: "Y", name: "You", color: PINK, text: "You're all going to look incredible 🌷", sent: true, time: "7:48 PM" },
];

type PlanTab = "PLAN" | "ATTENDEES" | "DETAILS" | "ORDERS";

function WaveformSVG({ waves, playing }: { waves: number[]; playing: boolean }) {
  return (
    <svg width="80" height="28" viewBox={`0 0 ${waves.length * 4} 28`} fill="none">
      {waves.map((h, i) => (
        <rect
          key={i}
          x={i * 4}
          y={(1 - h) * 14}
          width="2.5"
          height={h * 28}
          rx="1.25"
          fill={playing && i < waves.length / 2 ? PINK : "rgba(255,31,125,0.3)"}
        />
      ))}
    </svg>
  );
}

function Avatar({ initial, color, size = 40 }: { initial: string; color: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 3px 10px ${color}44`,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: size / 2.6,
          fontWeight: 800,
          color: "white",
        }}
      >
        {initial}
      </span>
    </div>
  );
}

function PlanTab({ tab }: { tab: PlanTab }) {
  const [playingNote, setPlayingNote] = useState<number | null>(null);
  const [ordering, setOrdering] = useState(false);
  const [outfitJoined, setOutfitJoined] = useState(false);

  return (
    <div style={{ padding: "16px 16px 0" }}>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          marginBottom: 14,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: PINK,
            color: "white",
            fontFamily: "var(--font-jost)",
            fontSize: 7,
            fontWeight: 800,
            letterSpacing: "0.18em",
            padding: "4px 10px",
            borderRadius: 4,
            transform: "rotate(2deg)",
          }}
        >
          THE PLAN
        </div>
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: "0.2em",
            color: PINK,
            marginBottom: 12,
          }}
        >
          THE PLAN ✦
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {AGENDA.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              <p
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: INK,
                  lineHeight: 1.3,
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
        <p
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: 13,
            fontStyle: "italic",
            color: PINK,
            borderTop: "1px dashed rgba(255,31,125,0.2)",
            paddingTop: 12,
          }}
        >
          Dress code: The main character
        </p>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(255,31,125,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polyline
                points="2,7 5,10 12,4"
                stroke={PINK}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.18em",
              color: PINK,
            }}
          >
            OUTFIT CHECK
          </p>
        </div>
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 12,
            color: "#666",
            marginBottom: 12,
            lineHeight: 1.5,
          }}
        >
          Help each other decide what to wear!
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
          {CONFIRMED.slice(0, 4).map((a, i) => (
            <div
              key={i}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${a.color}, ${a.color}CC)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid white",
                marginLeft: i > 0 ? -8 : 0,
                zIndex: CONFIRMED.length - i,
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white" }}>
                {a.initial}
              </span>
            </div>
          ))}
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "#F5F5F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid white",
              marginLeft: -8,
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: "#999" }}>+3</span>
          </div>
        </div>
        <button
          onClick={() => setOutfitJoined(!outfitJoined)}
          style={{
            padding: "10px 16px",
            borderRadius: 999,
            border: "none",
            background: outfitJoined ? "rgba(255,31,125,0.1)" : PINK,
            color: outfitJoined ? PINK : "white",
            fontFamily: "var(--font-jost)",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.1em",
            cursor: "pointer",
            boxShadow: outfitJoined ? "none" : `0 4px 16px ${PINK}44`,
          }}
        >
          {outfitJoined ? "JOINED ✓" : "POST YOUR OUTFIT →"}
        </button>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          marginBottom: 14,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: PINK,
            marginBottom: 6,
          }}
        >
          ADVANCE ORDER
        </p>
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 11,
            color: "#888",
            marginBottom: 14,
            lineHeight: 1.5,
          }}
        >
          Skip the line. Pre-order your favorites.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {FOOD_COLORS.map((bg, i) => (
            <div
              key={i}
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 24,
              }}
            >
              {FOOD_EMOJIS[i]}
            </div>
          ))}
        </div>
        <button
          onClick={() => setOrdering(!ordering)}
          style={{
            padding: "10px 16px",
            borderRadius: 999,
            border: "none",
            background: ordering ? "#EEE" : INK,
            color: ordering ? "#888" : "white",
            fontFamily: "var(--font-jost)",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          {ordering ? "ORDER PLACED ✓" : "ORDER NOW →"}
        </button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.2em",
            color: PINK,
            marginBottom: 12,
          }}
        >
          VOICE NOTES
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {VOICE_NOTES.map((note, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: 14,
                padding: "12px 14px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Avatar initial={note.initial} color={note.color} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: INK,
                    marginBottom: 4,
                  }}
                >
                  {note.name}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <WaveformSVG waves={note.waves} playing={playingNote === i} />
                  <span
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: 10,
                      color: "#999",
                      flexShrink: 0,
                    }}
                  >
                    {note.duration}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPlayingNote(playingNote === i ? null : i)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "none",
                  background: playingNote === i ? PINK : "rgba(255,31,125,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {playingNote === i ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                    <rect x="1" y="1" width="4" height="10" rx="1" />
                    <rect x="7" y="1" width="4" height="10" rx="1" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill={PINK}>
                    <polygon points="2,1 11,6 2,11" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AttendeesTab() {
  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          marginBottom: 14,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: PINK,
            marginBottom: 14,
          }}
        >
          CONFIRMED ({CONFIRMED.length})
        </p>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
          {CONFIRMED.map((a, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <Avatar initial={a.initial} color={a.color} size={44} />
                {a.role === "Host" && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -2,
                      right: -2,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#F59E0B",
                      border: "2px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 8 }}>★</span>
                  </div>
                )}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 9,
                  fontWeight: 600,
                  color: INK,
                  textAlign: "center",
                }}
              >
                {a.name}
              </p>
              <span
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 7,
                  fontWeight: 700,
                  color: a.role === "Host" ? "#F59E0B" : PINK,
                  letterSpacing: "0.08em",
                }}
              >
                {a.role === "Host" ? "HOST ★" : "✓"}
              </span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              paddingTop: 8,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: `1.5px dashed rgba(0,0,0,0.2)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 16, color: "#CCC" }}>›</span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: "#999",
            marginBottom: 14,
          }}
        >
          PENDING ({PENDING.length})
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {PENDING.map((a, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: `${a.color}33`,
                  border: `2px dashed ${a.color}66`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 16,
                    fontWeight: 800,
                    color: a.color,
                    opacity: 0.6,
                  }}
                >
                  {a.initial}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 9,
                  color: "#AAA",
                  textAlign: "center",
                }}
              >
                {a.name}
              </p>
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: `2px dashed rgba(255,31,125,0.3)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,31,125,0.05)",
              }}
            >
              <span style={{ fontSize: 18, color: PINK }}>+</span>
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: PINK, fontWeight: 700 }}>Invite</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailsTab() {
  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          marginBottom: 14,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: PINK,
            marginBottom: 12,
          }}
        >
          EVENT DETAILS
        </p>
        {[
          { label: "DATE", value: "Saturday, May 24, 2025" },
          { label: "TIME", value: "8:00 PM — Late" },
          { label: "VENUE", value: "Lafayette House" },
          { label: "ADDRESS", value: "380 Lafayette St, NYC" },
          { label: "NEIGHBORHOOD", value: "NoHo / SoHo" },
          { label: "DRESS CODE", value: "The main character" },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: 10,
              marginBottom: 10,
              borderBottom: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "#AAA" }}>
              {label}
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: INK, fontWeight: 600, textAlign: "right", maxWidth: "55%" }}>
              {value}
            </p>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "rgba(255,31,125,0.05)",
          borderRadius: 14,
          padding: "14px 16px",
          border: "1px solid rgba(255,31,125,0.12)",
        }}
      >
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", color: PINK, marginBottom: 6 }}>
          NOTES FROM THE HOST
        </p>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontStyle: "italic", color: "#555", lineHeight: 1.6 }}>
          &ldquo;Can&apos;t wait to finally get us all together. Lafayette has the best ambiance. Let&apos;s make it a real night.&rdquo;
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#BBB", marginTop: 8 }}>— You (Host)</p>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [ordered, setOrdered] = useState<Set<number>>(new Set());

  const ORDERS = [
    { id: 1, item: "Chicken Paillard", desc: "With capers, lemon butter, arugula", price: "$32", emoji: "🍗" },
    { id: 2, item: "Spaghetti Pomodoro", desc: "House-made pasta, San Marzano, basil", price: "$28", emoji: "🍝" },
    { id: 3, item: "Tarte au Citron", desc: "Lemon curd tart, crème fraîche", price: "$14", emoji: "🍋" },
    { id: 4, item: "Aperol Spritz", desc: "Prosecco, Aperol, orange, soda", price: "$18", emoji: "🍊" },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <p
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.2em",
          color: PINK,
          marginBottom: 14,
        }}
      >
        ADVANCE ORDER ✦
      </p>
      <p
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: 12,
          color: "#888",
          marginBottom: 16,
          lineHeight: 1.5,
        }}
      >
        Pre-order from Lafayette House and skip the wait.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ORDERS.map((o) => (
          <div
            key={o.id}
            style={{
              background: "white",
              borderRadius: 14,
              padding: "14px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 10,
                background: "rgba(255,31,125,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 24,
              }}
            >
              {o.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: INK, marginBottom: 2 }}>
                {o.item}
              </p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#AAA", lineHeight: 1.4 }}>
                {o.desc}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: INK }}>
                {o.price}
              </p>
              <button
                onClick={() => {
                  setOrdered((prev) => {
                    const next = new Set(prev);
                    next.has(o.id) ? next.delete(o.id) : next.add(o.id);
                    return next;
                  });
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "none",
                  background: ordered.has(o.id) ? "rgba(255,31,125,0.1)" : PINK,
                  color: ordered.has(o.id) ? PINK : "white",
                  fontFamily: "var(--font-jost)",
                  fontSize: 9,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {ordered.has(o.id) ? "ADDED ✓" : "ADD"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {ordered.size > 0 && (
        <button
          style={{
            width: "100%",
            marginTop: 16,
            padding: "16px",
            borderRadius: 999,
            border: "none",
            background: PINK,
            color: "white",
            fontFamily: "var(--font-jost)",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.08em",
            cursor: "pointer",
            boxShadow: `0 6px 24px ${PINK}44`,
          }}
        >
          CONFIRM ORDER ({ordered.size} item{ordered.size > 1 ? "s" : ""}) →
        </button>
      )}
    </div>
  );
}

export function PlanRoomPage() {
  const [activeTab, setActiveTab] = useState<PlanTab>("PLAN");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const inputRef = useRef<HTMLInputElement>(null);

  const TABS: PlanTab[] = ["PLAN", "ATTENDEES", "DETAILS", "ORDERS"];

  function sendMessage() {
    const text = chatInput.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        initial: "Y",
        name: "You",
        color: PINK,
        text,
        sent: true,
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      },
    ]);
    setChatInput("");
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#F7F2ED",
        display: "flex",
        flexDirection: "column",
        maxWidth: 430,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .plan-scroll::-webkit-scrollbar { display: none; }
        .chat-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "white",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "14px 16px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid rgba(0,0,0,0.08)",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.2em",
                color: PINK,
                lineHeight: 1,
              }}
            >
              PLAN ROOM ✦
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <button
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </button>
              <div
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: PINK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px solid white",
                }}
              >
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, color: "white" }}>3</span>
              </div>
            </div>
            <button
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.08)",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 18, color: "#888", lineHeight: 1 }}>⋯</span>
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 0 }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "10px 4px 12px",
                border: "none",
                background: "transparent",
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: activeTab === tab ? PINK : "#BBB",
                cursor: "pointer",
                position: "relative",
                borderBottom: activeTab === tab ? `2px solid ${PINK}` : "2px solid transparent",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(135deg, #FFF0F8 0%, #FFE8F2 100%)",
          padding: "16px 16px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: PINK,
            marginBottom: 4,
          }}
        >
          PLAN FOR
        </p>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: 26,
            fontWeight: 900,
            fontStyle: "italic",
            color: INK,
            lineHeight: 1.1,
            marginBottom: 6,
          }}
        >
          {EVENT.name} {EVENT.emoji}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 11,
            color: "rgba(0,0,0,0.45)",
            marginBottom: 0,
          }}
        >
          {EVENT.date} · {EVENT.time} · {EVENT.venue}
        </p>

        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "white",
            borderRadius: 12,
            padding: "10px 12px 14px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            width: 120,
            transform: "rotate(2deg)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 64,
              borderRadius: 8,
              background: "linear-gradient(135deg, #1a0010 0%, #3a0028 100%)",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 28 }}>🕯️</span>
          </div>
          <p
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: 10,
              color: "#999",
              textAlign: "center",
              marginBottom: 6,
            }}
          >
            notes from Maya
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#F5F5F5",
              borderRadius: 6,
              padding: "5px 7px",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: `linear-gradient(135deg, #FF69B4, #FF1F7D)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="white">
                <polygon points="1,1 7,4 1,7" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 1 }}>
                {[0.6, 1, 0.5, 0.8, 0.4, 0.9, 0.6].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 2,
                      height: 12 * h,
                      background: PINK,
                      borderRadius: 1,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "#999" }}>0:36</span>
          </div>
        </div>
      </div>

      <div
        className="plan-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: 220,
        }}
      >
        {activeTab === "PLAN" && <PlanTab tab={activeTab} />}
        {activeTab === "ATTENDEES" && <AttendeesTab />}
        {activeTab === "DETAILS" && <DetailsTab />}
        {activeTab === "ORDERS" && <OrdersTab />}

        <div style={{ padding: "16px 16px 0" }}>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "16px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: PINK,
                marginBottom: 14,
              }}
            >
              CONFIRMED ({CONFIRMED.length})
            </p>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
              {CONFIRMED.map((a, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flexShrink: 0 }}>
                  <div style={{ position: "relative" }}>
                    <Avatar initial={a.initial} color={a.color} size={38} />
                    {a.role === "Host" && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: -1,
                          right: -1,
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: "#F59E0B",
                          border: "1.5px solid white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 7,
                        }}
                      >
                        ★
                      </div>
                    )}
                  </div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#666", textAlign: "center" }}>
                    {a.name}
                  </p>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", paddingLeft: 4 }}>
                <span style={{ fontSize: 16, color: "#CCC" }}>›</span>
              </div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <p
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  color: "#CCC",
                  marginBottom: 10,
                }}
              >
                PENDING ({PENDING.length})
              </p>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {PENDING.map((a, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: `${a.color}22`,
                        border: `1.5px dashed ${a.color}66`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800, color: a.color, opacity: 0.6 }}>
                        {a.initial}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#BBB", textAlign: "center" }}>
                      {a.name}
                    </p>
                  </div>
                ))}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flexShrink: 0 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      border: `1.5px dashed rgba(255,31,125,0.3)`,
                      background: "rgba(255,31,125,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 16, color: PINK }}>+</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: PINK, fontWeight: 700 }}>Invite</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 430,
          margin: "0 auto",
          background: "white",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          zIndex: 30,
        }}
      >
        <div
          style={{
            padding: "10px 14px 6px",
            maxHeight: 200,
            overflowY: "auto",
          }}
          className="chat-scroll"
        >
          {messages.slice(-3).map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: msg.sent ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: 8,
                marginBottom: 8,
              }}
            >
              {!msg.sent && <Avatar initial={msg.initial} color={msg.color} size={26} />}
              <div
                style={{
                  maxWidth: "70%",
                  background: msg.sent ? PINK : "#F5F5F5",
                  borderRadius: msg.sent ? "14px 14px 4px 14px / 16px 16px 4px 16px" : "14px 14px 14px 4px / 16px 16px 16px 4px",
                  padding: "8px 12px",
                }}
              >
                {!msg.sent && (
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: msg.color, marginBottom: 2 }}>
                    {msg.name}
                  </p>
                )}
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: msg.sent ? "white" : INK, lineHeight: 1.4 }}>
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px 20px",
          }}
        >
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid rgba(0,0,0,0.1)",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 18, color: "#BBB", lineHeight: 1 }}>+</span>
          </button>
          <input
            ref={inputRef}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Say something, Bloomie..."
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 999,
              border: "1.5px solid rgba(0,0,0,0.08)",
              background: "#F8F8F8",
              fontFamily: "var(--font-jost)",
              fontSize: 13,
              color: INK,
              outline: "none",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: chatInput.trim() ? PINK : "rgba(255,31,125,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: chatInput.trim() ? `0 4px 14px ${PINK}44` : "none",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill={chatInput.trim() ? "white" : PINK} />
              <path d="M12 2C12 2 9 6 9 9.5C9 11.4 10.3 13 12 13C13.7 13 15 11.4 15 9.5C15 6 12 2 12 2Z" fill={chatInput.trim() ? "white" : PINK} opacity="0.8" />
              <path d="M12 22C12 22 9 18 9 14.5C9 12.6 10.3 11 12 11C13.7 11 15 12.6 15 14.5C15 18 12 22 12 22Z" fill={chatInput.trim() ? "white" : PINK} opacity="0.8" />
              <path d="M2 12C2 12 6 9 9.5 9C11.4 9 13 10.3 13 12C13 13.7 11.4 15 9.5 15C6 15 2 12 2 12Z" fill={chatInput.trim() ? "white" : PINK} opacity="0.8" />
              <path d="M22 12C22 12 18 9 14.5 9C12.6 9 11 10.3 11 12C11 13.7 12.6 15 14.5 15C18 15 22 12 22 12Z" fill={chatInput.trim() ? "white" : PINK} opacity="0.8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
