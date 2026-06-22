"use client";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function AperitivoPosterTemplate({
  title, category, date, time, location, seatsLeft, imageUrl, accentColor, href,
}: PosterTemplateProps) {
  const ac = accentColor ?? "#FF2D78";
  const parts = location.split(",").map(s => s.trim());
  const venueName = parts[0] ?? location;

  return (
    <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3/4",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 14px 52px rgba(0,0,0,0.28)",
        background: "linear-gradient(160deg, #FF2D78 0%, #FF6B3D 100%)",
        display: "flex",
        flexDirection: "column",
        padding: 14,
      }}>

        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}>
          <filter id="ap-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#ap-noise)"/>
        </svg>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "white", opacity: 0.55, letterSpacing: "0.2em", fontWeight: 600, zIndex: 2 }}>BLOOMBAY PRESENTS</p>

        <div style={{ marginTop: 8, zIndex: 2 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(32px,12vw,48px)", color: "white", lineHeight: 0.95, marginBottom: 2 }}>
            {title.split(" ")[0]}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(28px,10vw,42px)", color: "rgba(255,255,255,0.9)", lineHeight: 0.95 }}>
            {title.split(" ").slice(1).join(" ") || title}
          </p>
        </div>

        <div style={{ width: "40%", height: 1, background: "rgba(255,255,255,0.5)", marginTop: 10, zIndex: 2 }} />

        <div style={{ marginTop: 8, zIndex: 2 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "white", background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: "3px 10px", fontWeight: 700, letterSpacing: "0.08em" }}>
            {category}
          </span>
        </div>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.75)", marginTop: 6, zIndex: 2 }}>
          {date} · {time}
        </p>

        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.65)", marginTop: 2, zIndex: 2 }}>{venueName}</p>

        {imageUrl && (
          <div style={{ position: "absolute", right: 14, top: "30%", width: "55%", zIndex: 3, transform: "rotate(3deg)", borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 28px rgba(0,0,0,0.35)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}/>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {seatsLeft !== undefined && (
          <div style={{ position: "absolute", bottom: 14, right: 14, zIndex: 4 }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, color: "#FF2D78", background: "white", borderRadius: 999, padding: "4px 10px", letterSpacing: "0.08em" }}>
              {seatsLeft} SEATS LEFT
            </span>
          </div>
        )}

        <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: 14, color: "rgba(255,255,255,0.6)", zIndex: 2 }}>can&apos;t wait ♡</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(255,255,255,0.3)", fontWeight: 900, letterSpacing: "0.15em", zIndex: 2 }}>·BB·</p>
      </div>
    </a>
  );
}
