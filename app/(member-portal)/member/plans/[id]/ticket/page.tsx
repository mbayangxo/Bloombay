"use client";

import Link from "next/link";

const PINK = "#FF1F7D";
const PAPER = "#FEFCF7";

/**
 * Ticket detail used to render a fully fabricated receipt (TABLE 07, Paid in full, fake QR).
 * Until tickets are wired to real confirmations, show an honest empty state.
 */
export default function TicketPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: PAPER,
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
        Ticket isn’t ready yet
      </p>
      <p style={{ fontSize: 14, color: "#888", maxWidth: 320, lineHeight: 1.5, marginBottom: 28 }}>
        Digital tickets and QR check-in will show here once they’re live for your plans.
      </p>
      <Link
        href="/member/plans"
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
        Back to Plans
      </Link>
    </div>
  );
}
