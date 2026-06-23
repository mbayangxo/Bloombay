"use client";
import { useTheme } from "@/lib/theme/theme-context";

const PINK = "#FF1F7D";

export function ThemeToggle() {
  const { mode, toggle } = useTheme();
  const isNight = mode === "night";

  return (
    <button
      onClick={toggle}
      aria-label={isNight ? "Switch to day mode" : "Switch to night mode"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: isNight ? "rgba(255,31,125,0.12)" : "rgba(255,31,125,0.08)",
        border: `1px solid rgba(255,31,125,${isNight ? "0.3" : "0.15"})`,
        borderRadius: 999,
        padding: "6px 14px",
        cursor: "pointer",
        transition: "all 0.25s",
      }}
    >
      <span style={{ fontSize: 13 }}>{isNight ? "✦" : "☀︎"}</span>
      <span style={{
        fontFamily: "var(--font-jost)",
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: "0.18em",
        color: PINK,
      }}>
        {isNight ? "NIGHT" : "DAY"}
      </span>
    </button>
  );
}
