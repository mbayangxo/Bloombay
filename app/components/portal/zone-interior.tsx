"use client";

import Link from "next/link";

const PINK = "#FF1F7D";

/**
 * Club zones used to render the same fabricated "Museum Girls" feed for every zoneId.
 * Until zones are backed by real data, show an honest empty state.
 */
export function ZoneInteriorPage({
  clubId = "",
  zoneId = "",
}: {
  clubId?: string;
  zoneId?: string;
}) {
  void zoneId;
  const backHref = clubId ? `/member/clubs/${clubId}` : "/member/clubs";

  return (
    <div
      style={{
        background: "#F7F7F7",
        minHeight: "100vh",
        fontFamily: "var(--font-jost)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontSize: 26,
          color: "#111",
          marginBottom: 10,
        }}
      >
        This zone isn’t live yet
      </p>
      <p style={{ fontSize: 14, color: "#888", maxWidth: 340, lineHeight: 1.5, marginBottom: 28 }}>
        Zone feeds, resources, and events will show here when club zones are wired to real data.
      </p>
      <Link
        href={backHref}
        style={{
          display: "inline-block",
          padding: "12px 22px",
          borderRadius: 999,
          background: PINK,
          color: "white",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textDecoration: "none",
        }}
      >
        Back to club
      </Link>
    </div>
  );
}
