"use client";

import React, { useState } from "react";

const PINK = "#FF1F7D";

const GIRLIE_STICKERS = [
  { emoji: "🧴", label: "SPF" },
  { emoji: "📖", label: "Beach Read" },
  { emoji: "🩴", label: "Flip Flops" },
  { emoji: "🧋", label: "Iced Coffee" },
  { emoji: "🎧", label: "Headphones" },
  { emoji: "🕶️", label: "Sunnies" },
  { emoji: "💄", label: "Makeup" },
  { emoji: "🩱", label: "Pool Day" },
  { emoji: "🍟", label: "Snacks" },
  { emoji: "🧢", label: "Pink Cap" },
  { emoji: "✨", label: "Skincare" },
  { emoji: "💅", label: "Nails" },
  { emoji: "🫧", label: "Glowy" },
  { emoji: "💊", label: "Vitamins" },
  { emoji: "🪞", label: "Mirror" },
  { emoji: "🛁", label: "Spa" },
];

const BLOOM_VIBES_STICKERS = [
  { emoji: "🌸", label: "Bloom" },
  { emoji: "🍷", label: "Wine Night" },
  { emoji: "☕", label: "Coffee Run" },
  { emoji: "🍸", label: "Cocktail" },
  { emoji: "📓", label: "Journal" },
  { emoji: "📸", label: "Camera" },
  { emoji: "⭐", label: "Star" },
  { emoji: "🩷", label: "Soft Life" },
  { emoji: "🌙", label: "Moon" },
  { emoji: "💎", label: "Diamond" },
  { emoji: "👑", label: "Queen" },
  { emoji: "🎀", label: "Girlie" },
  { emoji: "🕯️", label: "Cozy" },
  { emoji: "🌿", label: "Serene" },
  { emoji: "🫶", label: "Girlhood" },
  { emoji: "✦", label: "BB Star" },
];

const BB_CLASSICS_STICKERS = [
  "can't wait ♡",
  "girls girl ✦",
  "with love always ♡",
  "·BB·",
  "bloom girl 🌸",
  "soho girlie",
  "main character",
  "soft life",
  "in my era",
  "she's that girl",
  "bloombay ♡",
  "see you there!",
];

type Tab = "GIRLIE" | "VIBES" | "BB CLASSICS";

export function BBStickerPicker({
  onSelect,
  onClose,
}: {
  onSelect: (sticker: string) => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("GIRLIE");
  const [query, setQuery] = useState("");

  const filteredGirlie = query
    ? GIRLIE_STICKERS.filter(s => s.label.toLowerCase().includes(query.toLowerCase()) || s.emoji.includes(query))
    : GIRLIE_STICKERS;

  const filteredVibes = query
    ? BLOOM_VIBES_STICKERS.filter(s => s.label.toLowerCase().includes(query.toLowerCase()) || s.emoji.includes(query))
    : BLOOM_VIBES_STICKERS;

  const filteredClassics = query
    ? BB_CLASSICS_STICKERS.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : BB_CLASSICS_STICKERS;

  const tabs: Tab[] = ["GIRLIE", "VIBES", "BB CLASSICS"];

  const tabLabels: Record<Tab, string> = {
    GIRLIE: "GIRLIE",
    VIBES: "BLOOM VIBES",
    "BB CLASSICS": "BB CLASSICS",
  };

  return (
    <div style={{
      position: "absolute",
      bottom: "100%",
      left: 0,
      right: 0,
      zIndex: 50,
      background: "white",
      borderRadius: "20px 20px 0 0",
      boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
      padding: "0 0 16px",
    }}>
      <div style={{ width: 40, height: 4, borderRadius: 2, background: "#e0e0e0", margin: "10px auto 12px" }} />

      <div style={{ padding: "0 14px", marginBottom: 10 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", left: 10 }}>
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search stickers..."
            style={{
              width: "100%",
              background: "#F5F5F5",
              borderRadius: 12,
              border: "none",
              outline: "none",
              padding: "10px 36px 10px 32px",
              fontFamily: "var(--font-jost)",
              fontSize: 13,
              color: "#333",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              right: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              color: "#999",
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #F0F0F0", padding: "0 14px", marginBottom: 10 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 10px",
              fontFamily: "var(--font-jost)",
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: "0.15em",
              color: activeTab === tab ? PINK : "#AAAAAA",
              borderBottom: activeTab === tab ? `2px solid ${PINK}` : "2px solid transparent",
              marginBottom: -1,
              whiteSpace: "nowrap",
            }}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 14px", maxHeight: 200, overflowY: "auto" }}>
        {activeTab === "GIRLIE" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 46px)", gap: 4 }}>
            {filteredGirlie.map(s => (
              <button
                key={s.emoji}
                onClick={() => onSelect(s.emoji)}
                title={s.label}
                style={{
                  width: 46,
                  height: 46,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 10,
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FFF0F7")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                {s.emoji}
              </button>
            ))}
          </div>
        )}

        {activeTab === "VIBES" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 46px)", gap: 4 }}>
            {filteredVibes.map(s => (
              <button
                key={s.emoji + s.label}
                onClick={() => onSelect(s.emoji)}
                title={s.label}
                style={{
                  width: 46,
                  height: 46,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 10,
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FFF0F7")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                {s.emoji}
              </button>
            ))}
          </div>
        )}

        {activeTab === "BB CLASSICS" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {filteredClassics.map(text => (
              <button
                key={text}
                onClick={() => onSelect(text)}
                style={{
                  background: "#FFF0F7",
                  border: `1px solid ${PINK}22`,
                  borderRadius: 999,
                  padding: "6px 12px",
                  fontFamily: "var(--font-caveat)",
                  fontSize: 14,
                  color: PINK,
                  cursor: "pointer",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FFE0EF")}
                onMouseLeave={e => (e.currentTarget.style.background = "#FFF0F7")}
              >
                {text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
