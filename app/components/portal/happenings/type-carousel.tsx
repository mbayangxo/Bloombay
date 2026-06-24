"use client";

import { TYPE_CARDS } from "@/lib/happenings/constants";
import type { Filter } from "@/lib/happenings/types";

export function TypeCarousel({ onSelect }: { onSelect: (label: string) => void }) {
  return (
    <div
      className="type-scroll"
      style={{
        display: "flex", gap: 10, overflowX: "auto",
        padding: "12px 16px 14px",
        scrollbarWidth: "none",
      }}
    >
      {TYPE_CARDS.map(tc => (
        <button
          key={tc.label}
          onClick={() => onSelect(tc.label as Filter)}
          style={{
            flexShrink: 0,
            width: 100,
            height: 80,
            borderRadius: 12,
            background: tc.bg,
            border: tc.border,
            boxShadow: tc.glow,
            padding: "10px 10px 8px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{tc.emoji}</span>
          <div>
            <p style={{
              fontFamily: tc.font,
              fontSize: tc.size,
              fontWeight: tc.weight,
              letterSpacing: tc.spacing,
              color: tc.color,
              lineHeight: 1.1,
              fontStyle: tc.font === "var(--font-playfair)" ? "italic" : "normal",
            }}>
              {tc.label}
            </p>
            <p style={{
              fontFamily: "var(--font-jost)",
              fontSize: 8,
              fontWeight: 600,
              color: tc.subColor,
              marginTop: 2,
            }}>
              {tc.sub}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
