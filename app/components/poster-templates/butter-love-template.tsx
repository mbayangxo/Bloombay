"use client";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function ButterLoveTemplate({
  title, hostName, imageUrl, accentColor, href,
}: PosterTemplateProps) {
  const ac = accentColor ?? "#8B1A2E";

  return (
    <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1/1",
        background: "#FEFCF7",
        border: "1px solid #E8DDD0",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        boxSizing: "border-box",
        overflow: "hidden",
      }}>

        {/* Arch text — "MADE WITH BUTTER" */}
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <svg viewBox="0 0 240 60" width="240" height="60" style={{ overflow: "visible" }}>
            <defs>
              <path id="arch" d="M 20 55 A 100 100 0 0 1 220 55" />
            </defs>
            <text
              fontFamily="var(--font-jost), sans-serif"
              fontSize="11"
              fontWeight="700"
              fill="#3A2010"
              letterSpacing="4"
            >
              <textPath href="#arch" startOffset="50%" textAnchor="middle">
                MADE WITH BUTTER
              </textPath>
            </text>
          </svg>
        </div>

        {/* "& love" in Caveat script */}
        <div style={{
          fontFamily: "var(--font-caveat), cursive",
          fontSize: 28,
          fontWeight: 700,
          color: ac,
          marginBottom: 8,
          lineHeight: 1,
        }}>
          &amp; love
        </div>

        {/* Title — bakery/product name */}
        <div style={{
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: 18,
          fontWeight: 800,
          color: "#3A2010",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 14,
        }}>
          {title}
        </div>

        {/* 3 product photos in a row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, width: "100%" }}>
          {/* Left placeholder */}
          <div style={{
            flex: 1,
            height: 80,
            background: "#F5E8C8",
            borderRadius: 4,
          }} />
          {/* Center — imageUrl */}
          <div style={{
            flex: 1,
            height: 80,
            borderRadius: 4,
            overflow: "hidden",
            background: "#EDD9A3",
          }}>
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#EDD9A3" }} />
            )}
          </div>
          {/* Right placeholder */}
          <div style={{
            flex: 1,
            height: 80,
            background: "#F5E8C8",
            borderRadius: 4,
          }} />
        </div>

        {/* Divider */}
        <div style={{ width: "80%", height: 1, background: "#E8DDD0", marginBottom: 10 }} />

        {/* Bakery name in small caps */}
        <div style={{
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.18em",
          color: "#8B7A6A",
          textTransform: "uppercase",
          textAlign: "center",
        }}>
          {hostName ?? "The Bakery"}
        </div>
      </div>
    </a>
  );
}
