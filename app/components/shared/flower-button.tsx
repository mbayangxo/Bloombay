"use client";

import { useEffect, useState } from "react";
import "@/app/styles/bloom-entrance.css";
import {
  type GiftKind,
  formatBloomGiftLabel,
  splitBloomGifts,
} from "@/lib/bloom-gifts";

type FlowerButtonProps = {
  /** Total flower-units received (flower=1, bouquet=12). */
  units: number;
  /** What this viewer already gave, if any. */
  myKind: GiftKind | null;
  onGive: (kind: GiftKind) => void | Promise<void>;
  onTakeBack?: () => void | Promise<void>;
  size?: "sm" | "md" | "lg";
  light?: boolean;
  disabled?: boolean;
};

/**
 * Give a flower (like) or a bouquet (love it more).
 * Counts convert: every 12 units show as a bouquet.
 */
export function FlowerButton({
  units,
  myKind,
  onGive,
  onTakeBack,
  size = "md",
  light = false,
  disabled = false,
}: FlowerButtonProps) {
  const [open, setOpen] = useState(false);
  const [jumping, setJumping] = useState<GiftKind | null>(null);
  const [busy, setBusy] = useState(false);
  const split = splitBloomGifts(units);
  const dims = size === "lg" ? 36 : size === "sm" ? 22 : 28;
  const ink = light ? "rgba(255,255,255,0.92)" : "#C0185F";
  const pad = size === "sm" ? "4px 8px" : "6px 11px";
  const gave = myKind !== null;

  useEffect(() => {
    if (!jumping) return;
    const t = window.setTimeout(() => setJumping(null), 720);
    return () => window.clearTimeout(t);
  }, [jumping]);

  async function choose(kind: GiftKind) {
    if (disabled || busy) return;
    setOpen(false);
    setJumping(kind);
    setBusy(true);
    try {
      await onGive(kind);
    } finally {
      setBusy(false);
    }
  }

  async function takeBack() {
    if (disabled || busy || !onTakeBack) return;
    setOpen(false);
    setBusy(true);
    try {
      await onTakeBack();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled || busy}
        aria-pressed={gave}
        aria-expanded={open}
        aria-label={gave ? `You gave a ${myKind}. ${formatBloomGiftLabel(units)}` : `Give flowers. ${formatBloomGiftLabel(units)}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: pad,
          borderRadius: 999,
          border: gave
            ? `1.5px solid ${light ? "rgba(255,255,255,0.45)" : "#C0185F"}`
            : `1.5px solid ${light ? "rgba(255,255,255,0.2)" : "rgba(192,24,95,0.22)"}`,
          background: gave
            ? light
              ? "rgba(255,31,125,0.35)"
              : "#C0185F"
            : light
              ? "rgba(255,255,255,0.1)"
              : "rgba(192,24,95,0.08)",
          color: gave && !light ? "white" : ink,
          cursor: disabled || busy ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          fontFamily: "var(--font-jost)",
          fontSize: size === "sm" ? 8 : 10,
          fontWeight: 800,
          letterSpacing: "0.04em",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span
          className={jumping ? "bb-flower-jump" : undefined}
          style={{
            display: "inline-flex",
            width: dims,
            height: dims,
            perspective: 140,
            transformStyle: "preserve-3d",
          }}
        >
          {(jumping ?? myKind) === "bouquet" || (!myKind && split.bouquets > 0 && split.flowers === 0) ? (
            <Bouquet3D size={dims} lit={gave || !!jumping} />
          ) : (
            <Flower3D size={dims} lit={gave || !!jumping} />
          )}
        </span>
        <span style={{ whiteSpace: "nowrap" }}>
          {units > 0 ? formatBloomGiftLabel(units) : "Give"}
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 80, background: "transparent", border: "none", cursor: "default" }}
          />
          <div
            role="menu"
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 90,
              background: "white",
              borderRadius: 18,
              padding: 10,
              minWidth: 200,
              boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
              border: "1px solid rgba(255,31,125,0.12)",
            }}
          >
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.14em", color: "rgba(0,0,0,0.35)", margin: "2px 6px 8px" }}>
              GIVE YOUR FLOWERS
            </p>
            <GiftOption
              title="A flower"
              sub="You like this"
              onClick={() => void choose("flower")}
              visual={<Flower3D size={34} lit />}
              active={myKind === "flower"}
            />
            <GiftOption
              title="A bouquet"
              sub="12 flowers — you love this"
              onClick={() => void choose("bouquet")}
              visual={<Bouquet3D size={34} lit />}
              active={myKind === "bouquet"}
            />
            {myKind && onTakeBack && (
              <button
                type="button"
                onClick={() => void takeBack()}
                style={{
                  width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 12,
                  border: "none", background: "rgba(0,0,0,0.04)", cursor: "pointer",
                  fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)",
                }}
              >
                Take back
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function GiftOption({
  title,
  sub,
  visual,
  onClick,
  active,
}: {
  title: string;
  sub: string;
  visual: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 14,
        border: active ? "1.5px solid #FF1F7D" : "1.5px solid transparent",
        background: active ? "rgba(255,31,125,0.06)" : "transparent",
        cursor: "pointer",
        textAlign: "left",
        marginBottom: 4,
      }}
    >
      <span style={{ width: 36, height: 36, display: "inline-flex", perspective: 120 }}>{visual}</span>
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, color: "#1C1B1C" }}>{title}</span>
        <span style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(0,0,0,0.45)", marginTop: 1 }}>{sub}</span>
      </span>
    </button>
  );
}

function Flower3D({ size, lit }: { size: number; lit: boolean }) {
  const petal = lit ? "#FF4D9A" : "#FF8EC7";
  const center = lit ? "#FFD36A" : "#FFE8A8";
  const stem = lit ? "#2F9E5A" : "#7BC48F";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      style={{
        filter: lit
          ? "drop-shadow(0 4px 8px rgba(255,31,125,0.45))"
          : "drop-shadow(0 2px 4px rgba(0,0,0,0.12))",
        transform: "rotateX(18deg) rotateY(-8deg)",
        transformOrigin: "50% 70%",
      }}
    >
      <ellipse cx="32" cy="56" rx="14" ry="3.5" fill="rgba(0,0,0,0.12)" />
      <path d="M32 38 C31 46 30 52 32 56" stroke={stem} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M32 48 C26 46 22 48 20 52" stroke={stem} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse key={deg} cx="32" cy="22" rx="7.5" ry="12" fill={petal} opacity={0.92} transform={`rotate(${deg} 32 30)`} />
      ))}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => (
        <ellipse key={`i-${deg}`} cx="32" cy="24" rx="5" ry="8.5" fill="#FFB7D5" opacity={0.95} transform={`rotate(${deg} 32 30)`} />
      ))}
      <circle cx="32" cy="30" r="7" fill={center} />
      <circle cx="32" cy="30" r="3.2" fill="#F5A623" opacity={0.85} />
      <ellipse cx="29" cy="26" rx="2.2" ry="1.4" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}

/** A dozen blooms clustered — bouquet. */
function Bouquet3D({ size, lit }: { size: number; lit: boolean }) {
  const colors = lit
    ? ["#FF4D9A", "#FF6BB3", "#E91E8C", "#FF8EC7", "#FF3D8A"]
    : ["#FFB7D5", "#FFC4DD", "#F5A0C4", "#FFD0E4", "#E8A0C0"];
  const stem = lit ? "#2F9E5A" : "#7BC48F";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      style={{
        filter: lit
          ? "drop-shadow(0 4px 10px rgba(255,31,125,0.4))"
          : "drop-shadow(0 2px 4px rgba(0,0,0,0.12))",
        transform: "rotateX(14deg) rotateY(-6deg)",
        transformOrigin: "50% 80%",
      }}
    >
      <ellipse cx="32" cy="58" rx="16" ry="3" fill="rgba(0,0,0,0.12)" />
      {/* stems */}
      {[26, 32, 38].map((x) => (
        <path key={x} d={`M${x} 40 C${x - 1} 48 ${x} 54 32 58`} stroke={stem} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      ))}
      {/* 12 bloom heads in a fan */}
      {[
        [20, 28], [26, 22], [32, 18], [38, 22], [44, 28],
        [22, 34], [28, 30], [34, 30], [40, 34],
        [26, 36], [32, 34], [38, 36],
      ].map(([cx, cy], i) => (
        <g key={i}>
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              cx={cx}
              cy={cy - 3}
              rx="2.2"
              ry="3.4"
              fill={colors[i % colors.length]}
              transform={`rotate(${deg} ${cx} ${cy})`}
            />
          ))}
          <circle cx={cx} cy={cy} r="2" fill="#FFD36A" />
        </g>
      ))}
      {/* wrap */}
      <path d="M22 42 Q32 48 42 42 L38 52 Q32 56 26 52 Z" fill={lit ? "#FF1F7D" : "#FF8EC7"} opacity={0.85} />
    </svg>
  );
}

/** Compact read-only tally: “2 bouquets · 3 flowers” */
export function BloomGiftTally({
  units,
  light = false,
}: {
  units: number;
  light?: boolean;
}) {
  if (units <= 0) return null;
  const { bouquets, flowers } = splitBloomGifts(units);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-jost)",
        fontSize: 11,
        fontWeight: 700,
        color: light ? "rgba(255,255,255,0.85)" : "#C0185F",
      }}
    >
      {bouquets > 0 && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
          <Bouquet3D size={18} lit /> {bouquets}
        </span>
      )}
      {flowers > 0 && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
          <Flower3D size={16} lit /> {flowers}
        </span>
      )}
    </span>
  );
}
