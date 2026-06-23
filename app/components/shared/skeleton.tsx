"use client";

// Shimmer skeleton — used across the app while data loads.
// dark=true for dark-themed pages (Hanger), false for light pages.

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  dark?: boolean;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = 8, dark = true, style }: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: dark
          ? "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)"
          : "linear-gradient(90deg, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.09) 50%, rgba(0,0,0,0.05) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite linear",
        ...style,
      }}
    />
  );
}

// Inject keyframe once
if (typeof document !== "undefined" && !document.getElementById("bb-shimmer-style")) {
  const s = document.createElement("style");
  s.id = "bb-shimmer-style";
  s.textContent = `@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`;
  document.head.appendChild(s);
}

// ── Pre-built skeleton cards ──────────────────────────────────────────────────

export function HangerCardSkeleton() {
  return (
    <div style={{ background: "#1a1a1a", borderRadius: 12, overflow: "hidden" }}>
      {/* Image area */}
      <Skeleton height={0} style={{ aspectRatio: "3/4", height: "auto", borderRadius: 0 }} />
      {/* Body */}
      <div style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        <Skeleton height={12} width="70%" />
        <Skeleton height={16} width="45%" />
        <Skeleton height={9}  width="55%" />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Skeleton width={20} height={20} borderRadius="50%" />
          <Skeleton height={10} width="50%" />
        </div>
        <Skeleton height={30} borderRadius={8} />
      </div>
    </div>
  );
}

export function ListItemSkeleton({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
      <Skeleton width={44} height={44} borderRadius="50%" dark={dark} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton height={13} width="60%" dark={dark} />
        <Skeleton height={10} width="80%" dark={dark} />
      </div>
      <Skeleton width={48} height={24} borderRadius={12} dark={dark} />
    </div>
  );
}
