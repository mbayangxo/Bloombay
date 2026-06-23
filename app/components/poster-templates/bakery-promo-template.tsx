"use client";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function BakeryPromoTemplate({
  title, category, date, time, hostName, imageUrl, accentColor, ctaLabel, href,
}: PosterTemplateProps) {
  const topBg = accentColor ?? "#4A90D9";

  return (
    <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3/4",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Top half */}
        <div style={{
          background: topBg,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "16px 18px 12px",
          position: "relative",
        }}>
          {/* WAKE UP */}
          <div style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 52,
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
          }}>
            WAKE UP
          </div>

          {/* Treats */}
          <div style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: 36,
            fontWeight: 700,
            fontStyle: "italic",
            color: "#FFFFFF",
            lineHeight: 1,
            marginTop: -4,
            marginBottom: 10,
            paddingLeft: 4,
          }}>
            Treats
          </div>

          {/* Promo pill tag */}
          <div style={{
            alignSelf: "flex-start",
            background: "rgba(255,255,255,0.2)",
            border: "1.5px solid rgba(255,255,255,0.6)",
            borderRadius: 999,
            padding: "5px 12px",
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 8,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            BUY COFFEE GET FREE CROISSANT
          </div>
        </div>

        {/* Bottom half */}
        <div style={{
          background: "#F5E8D0",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 18px",
          boxSizing: "border-box",
        }}>
          {/* Product illustration */}
          <div style={{
            width: 120,
            height: 120,
            borderRadius: 999,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
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
              <span style={{ fontSize: 80, lineHeight: 1 }}>🥐</span>
            )}
          </div>

          {/* Title */}
          <div style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 18,
            fontWeight: 900,
            color: "#2A1A0A",
            letterSpacing: "0.02em",
            textAlign: "center",
            marginBottom: 6,
          }}>
            {title}
          </div>

          {/* Category tag */}
          {category && (
            <div style={{
              background: "#FFE0EC",
              borderRadius: 999,
              padding: "3px 12px",
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 9,
              fontWeight: 700,
              color: "#FF1F7D",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}>
              {category}
            </div>
          )}

          {/* Footer */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            marginBottom: 12,
          }}>
            {hostName && (
              <div style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "#3A2010",
                letterSpacing: "0.06em",
              }}>
                {hostName}
              </div>
            )}
            {time && (
              <div style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: 9,
                color: "#8B7A6A",
              }}>
                {time}
              </div>
            )}
            {date && (
              <div style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: 9,
                color: "#8B7A6A",
              }}>
                {date}
              </div>
            )}
          </div>

          {/* CTA button */}
          <div style={{
            background: "#2A1A0A",
            borderRadius: 6,
            padding: "10px 24px",
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 11,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            {ctaLabel ?? "CLAIM NOW"}
          </div>
        </div>

      </div>
    </a>
  );
}
