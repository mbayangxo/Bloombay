"use client";

import Link from "next/link";

// Shared section header used by all main pages:
// Hanger, Avenue, Profile, Lounge, Happenings, etc.
// Keeps the same height, font scale, button position everywhere.

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  // "light" = ivory/white pages, "dark" = dark marketplace pages
  theme?: "light" | "dark";
  // Optional: override background
  bg?: string;
}

export function SectionHeader({
  title,
  subtitle,
  backHref,
  onBack,
  actions,
  theme = "dark",
  bg,
}: SectionHeaderProps) {
  const isDark = theme === "dark";

  const headerBg = bg ?? (isDark
    ? "rgba(13,13,13,0.92)"
    : "rgba(255,255,255,0.92)");

  const titleColor  = isDark ? "#fff"                  : "#111111";
  const subColor    = isDark ? "rgba(255,255,255,0.38)" : "rgba(17,17,17,0.45)";
  const backBg      = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,31,125,0.07)";
  const backColor   = isDark ? "#fff"                  : "#FF1F7D";
  const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(17,17,17,0.08)";

  const backEl = backHref ? (
    <Link
      href={backHref}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 34, height: 34, borderRadius: "50%",
        background: backBg, color: backColor,
        textDecoration: "none", fontSize: 16, flexShrink: 0,
      }}
      aria-label="Back"
    >
      ←
    </Link>
  ) : onBack ? (
    <button
      onClick={onBack}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 34, height: 34, borderRadius: "50%",
        background: backBg, color: backColor,
        border: "none", fontSize: 16, flexShrink: 0, cursor: "pointer",
      }}
      aria-label="Back"
    >
      ←
    </button>
  ) : (
    // Spacer so title stays centred when no back button
    <div style={{ width: 34, flexShrink: 0 }} />
  );

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        background: headerBg,
        borderBottom: `1px solid ${borderColor}`,
        padding: "13px 16px 12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {backEl}

        {/* Title block — grows to fill space */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 22,
              margin: 0,
              lineHeight: 1.1,
              color: titleColor,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontSize: 13,
                margin: 0,
                color: subColor,
                lineHeight: 1.2,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Action buttons slot */}
        {actions && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

// ── Reusable header action buttons ───────────────────────────────────────────

interface HeaderBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "ghost" | "primary" | "teal" | "green";
  disabled?: boolean;
}

const COLORS = {
  ghost:   { bg: "rgba(255,31,125,0.07)", color: "#FF1F7D",  border: "rgba(255,31,125,0.2)" },
  primary: { bg: "#FF1F7D",              color: "#fff",       border: "transparent" },
  teal:    { bg: "#00C6A7",              color: "#fff",       border: "transparent" },
  green:   { bg: "#16A34A",              color: "#fff",       border: "transparent" },
};

export function HeaderBtn({ children, onClick, variant = "ghost", disabled }: HeaderBtnProps) {
  const c = COLORS[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "rgba(17,17,17,0.05)" : c.bg,
        color: disabled ? "rgba(17,17,17,0.25)" : c.color,
        border: `1.5px solid ${c.border}`,
        borderRadius: 20,
        padding: "7px 14px",
        fontSize: 12,
        fontFamily: "var(--font-jost), sans-serif",
        fontWeight: 700,
        letterSpacing: "0.04em",
        cursor: disabled ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}
