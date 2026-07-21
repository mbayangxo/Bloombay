"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const PINK = "#FF1F7D";

/**
 * This route used to render a fully mock plan room (fake attendees, orders, chat).
 * Real plan rooms live at /member/plans/[id]/room via portal components when wired;
 * until then, don't invent women, tables, or messages.
 */
export default function PlanRoomPage() {
  const params = useParams<{ id: string }>();
  const planId = params?.id;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F8F8",
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
        Plan room isn’t open yet
      </p>
      <p style={{ fontSize: 14, color: "#888", maxWidth: 340, lineHeight: 1.5, marginBottom: 28 }}>
        Shared itineraries, attendees, and chat for this plan will live here when the room is wired to real data.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        {planId && (
          <Link
            href={`/member/plans/${planId}`}
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
            View plan
          </Link>
        )}
        <Link
          href="/member/plans"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: PINK,
            textDecoration: "none",
          }}
        >
          ← Back to Plans
        </Link>
      </div>
    </div>
  );
}
