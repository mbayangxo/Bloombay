"use client";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function BiteCrunchTemplate({
  title, category, imageUrl, accentColor, ctaLabel, href,
}: PosterTemplateProps) {
  const bg = accentColor ?? "#C8201A";

  return (
    <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3/4",
        background: bg,
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: 20,
        boxSizing: "border-box",
      }}>

        {/* Top brand name */}
        <div style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: 11,
          fontWeight: 400,
          fontStyle: "italic",
          color: "rgba(255,255,255,0.75)",
          letterSpacing: "0.08em",
          marginBottom: 12,
        }}>
          {title}
        </div>

        {/* BITE headline */}
        <div style={{
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: 72,
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 0.9,
          letterSpacing: "-0.02em",
        }}>
          BITE
        </div>

        {/* "the crunch" italic overlay */}
        <div style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: 28,
          fontWeight: 400,
          fontStyle: "italic",
          color: "#FFFFFF",
          lineHeight: 1,
          marginTop: -4,
          marginBottom: 16,
          paddingLeft: 4,
        }}>
          the crunch
        </div>

        {/* Product photo */}
        <div style={{
          width: "100%",
          height: 180,
          borderRadius: 6,
          overflow: "hidden",
          background: imageUrl ? "transparent" : "linear-gradient(160deg, #C8860A 0%, #A0714B 50%, #7A4F2E 100%)",
          marginBottom: 12,
          flexShrink: 0,
        }}>
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )}
        </div>

        {/* Category description */}
        <div style={{
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: 10,
          fontWeight: 400,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.1em",
          marginBottom: 10,
        }}>
          {category}
        </div>

        <div style={{ flex: 1 }} />

        {/* SAVOR */}
        <div style={{
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: 64,
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 0.9,
          letterSpacing: "-0.02em",
        }}>
          SAVOR
        </div>

        {/* "the crumble" */}
        <div style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: 24,
          fontWeight: 400,
          fontStyle: "italic",
          color: "#FFFFFF",
          lineHeight: 1,
          marginTop: 2,
          marginBottom: 16,
          paddingLeft: 4,
        }}>
          the crumble
        </div>

        {/* CTA button */}
        <div style={{
          alignSelf: "flex-start",
          background: "rgba(255,255,255,0.2)",
          border: "1.5px solid rgba(255,255,255,0.7)",
          borderRadius: 999,
          padding: "8px 22px",
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: "#FFFFFF",
          letterSpacing: "0.12em",
        }}>
          {ctaLabel ?? "ORDER NOW"}
        </div>
      </div>
    </a>
  );
}
