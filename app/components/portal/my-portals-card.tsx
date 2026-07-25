"use client";

import Link from "next/link";
import type { PortalLink } from "@/lib/auth/portal-access";

/**
 * Entry points from a personal BloomBay account into work portals.
 */
export function MyPortalsCard({
  links,
  light = false,
}: {
  links: PortalLink[];
  light?: boolean;
}) {
  if (!links.length) return null;

  const ink = light ? "rgba(255,255,255,0.92)" : "#1C1B1C";
  const muted = light ? "rgba(255,255,255,0.55)" : "#888";
  const cardBg = light ? "rgba(255,255,255,0.1)" : "#fff";
  const border = light ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(0,0,0,0.06)";

  return (
    <div style={{ marginBottom: 18 }}>
      <p
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: "0.18em",
          color: light ? "rgba(255,255,255,0.5)" : "#FF1F7D",
          marginBottom: 8,
        }}
      >
        YOUR PORTALS
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map((p) => (
          <Link
            key={p.id}
            href={p.href}
            style={{
              display: "block",
              textDecoration: "none",
              background: cardBg,
              border,
              borderRadius: 14,
              padding: "12px 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 13,
                    fontWeight: 800,
                    color: ink,
                    marginBottom: 2,
                  }}
                >
                  {p.label}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: muted }}>{p.hint}</p>
              </div>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: "#FF1F7D" }}>
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Compact link back to the personal member app from a work portal. */
export function BackToMemberLink({ className }: { className?: string }) {
  return (
    <Link
      href="/member/home"
      className={className}
      style={{
        fontFamily: "var(--font-jost)",
        fontSize: 11,
        fontWeight: 700,
        color: "#FF1F7D",
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      ← BloomBay app
    </Link>
  );
}
