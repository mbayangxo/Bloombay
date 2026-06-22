"use client";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function SundaySpecialTemplate({
  title, date, location, hostName, imageUrl, accentColor, href,
}: PosterTemplateProps) {
  const ac = accentColor ?? "#8B1A2E";

  return (
    <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3/4",
        background: "#FBF6EE",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 18px",
        boxSizing: "border-box",
      }}>

        {/* Brand name — thin Playfair italic */}
        <div style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: 12,
          fontWeight: 400,
          fontStyle: "italic",
          color: "#8B7A6A",
          marginBottom: 12,
          letterSpacing: "0.04em",
        }}>
          {hostName ?? "The Bakery"}
        </div>

        {/* "Sunday" bold editorial */}
        <div style={{
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: 36,
          fontWeight: 900,
          color: "#2A1A0A",
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}>
          Sunday
        </div>

        {/* "Special" large italic Playfair */}
        <div style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: 42,
          fontWeight: 700,
          fontStyle: "italic",
          color: ac,
          lineHeight: 1,
          marginBottom: 16,
        }}>
          Special
        </div>

        {/* Wavy/scalloped border box (approximated with dashed rounded border) */}
        <div style={{
          border: `3px dashed ${ac}`,
          borderRadius: 28,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          boxSizing: "border-box",
          background: "rgba(255,255,255,0.6)",
          marginBottom: 14,
        }}>
          {/* Product image or emoji */}
          <div style={{
            width: 150,
            height: 150,
            borderRadius: 8,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}>
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            ) : (
              <span style={{ fontSize: 80, lineHeight: 1 }}>🥐</span>
            )}
          </div>

          {/* Product name */}
          <div style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 14,
            fontWeight: 800,
            color: "#2A1A0A",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: 6,
          }}>
            {title}
          </div>

          {/* Date field */}
          {date && (
            <div style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: ac,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}>
              {date}
            </div>
          )}

          {/* Price in bold */}
          <div style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 18,
            fontWeight: 900,
            color: "#2A1A0A",
          }}>
            $4.50
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Footer: date/location in small caps */}
        <div style={{
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: 8,
          fontWeight: 600,
          letterSpacing: "0.16em",
          color: "#8B7A6A",
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.6,
        }}>
          {date && <div>{date}</div>}
          <div>{location}</div>
        </div>

      </div>
    </a>
  );
}
