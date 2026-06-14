"use client";

import { use } from "react";
import Link from "next/link";

type ThankYouType = "membership" | "ticket" | "club" | "hanger";

function getEyebrow(type: ThankYouType): string {
  switch (type) {
    case "membership":
      return "MEMBERSHIP CONFIRMED";
    case "ticket":
      return "TICKET CONFIRMED";
    case "club":
      return "MEMBERSHIP CONFIRMED";
    case "hanger":
      return "PURCHASE CONFIRMED";
    default:
      return "CONFIRMED";
  }
}

function getHeading(type: ThankYouType, name?: string): string {
  switch (type) {
    case "membership":
      return "Welcome to BloomBay ✦";
    case "ticket":
      return `You're going to ${name ?? "the event"}!`;
    case "club":
      return `You're in ${name ?? "the club"}!`;
    case "hanger":
      return "Your piece is on its way ✦";
    default:
      return "You're all set ✦";
  }
}

function getSubtitle(type: ThankYouType): string {
  switch (type) {
    case "membership":
      return "The Avenue is yours. Women are gathering.";
    case "ticket":
      return "Your seat is secured. See you there.";
    case "club":
      return "Your club is waiting.";
    case "hanger":
      return "The seller will ship within 3 days.";
    default:
      return "";
  }
}

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  const type = (params.type as ThankYouType) ?? "membership";
  const name = params.name as string | undefined;
  const back = params.back as string | undefined;

  const eyebrow = getEyebrow(type);
  const heading = getHeading(type, name);
  const subtitle = getSubtitle(type);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FFF5F8 0%, #F8F0FF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          textAlign: "center",
        }}
      >
        {/* Checkmark circle */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#FF1F7D",
            boxShadow:
              "0 0 0 12px rgba(255,31,125,0.12), 0 8px 32px rgba(255,31,125,0.30)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: "36px",
              fontWeight: 700,
              lineHeight: 1,
              marginTop: "-2px",
            }}
          >
            ✓
          </span>
        </div>

        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: "10px",
            fontWeight: 800,
            color: "#FF1F7D",
            letterSpacing: "0.2em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </p>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "clamp(28px, 7vw, 36px)",
            lineHeight: 1.2,
            color: "#1A0A2E",
            margin: 0,
          }}
        >
          {heading}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: "14px",
            color: "#666",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
            marginTop: "8px",
          }}
        >
          {/* Primary button */}
          <Link
            href={back ?? "/member/home"}
            style={{
              display: "block",
              width: "100%",
              padding: "15px 24px",
              background: "#FF1F7D",
              color: "#fff",
              borderRadius: "14px",
              textDecoration: "none",
              fontFamily: "var(--font-jost), sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(255,31,125,0.28)",
              letterSpacing: "0.01em",
            }}
          >
            {back ? "Go back ←" : "Go to Home →"}
          </Link>

          {/* Secondary ghost button — only if back param exists */}
          {back && (
            <Link
              href="/member/home"
              style={{
                display: "block",
                width: "100%",
                padding: "14px 24px",
                background: "transparent",
                color: "#1A0A2E",
                border: "1.5px solid rgba(26,10,46,0.2)",
                borderRadius: "14px",
                textDecoration: "none",
                fontFamily: "var(--font-jost), sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                textAlign: "center",
                letterSpacing: "0.01em",
              }}
            >
              Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
