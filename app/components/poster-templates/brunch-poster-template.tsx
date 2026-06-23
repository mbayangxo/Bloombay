"use client";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function BrunchPosterTemplate({
  title, category, date, time, location, seatsLeft, imageUrl, accentColor, href,
}: PosterTemplateProps) {
  const ac = accentColor ?? "#C8860A";
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
        boxShadow: "0 14px 52px rgba(0,0,0,0.18)",
        background: "#F5EFE0",
        display: "flex",
        flexDirection: "column",
      }}>

        {imageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(245,239,224,0.85) 0%, rgba(245,239,224,0.4) 50%, rgba(245,239,224,0.9) 100%)" }}/>
          </>
        )}

        <p style={{ position: "absolute", bottom: "30%", left: "50%", transform: "translateX(-50%) rotate(-10deg)", fontFamily: "var(--font-caveat)", fontSize: 64, color: "rgba(139,107,61,0.06)", whiteSpace: "nowrap", zIndex: 1, pointerEvents: "none" }}>
          Sunday Brunch
        </p>

        <div style={{ margin: 14, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", borderRadius: 14, padding: 16, zIndex: 2 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "#8B6B3D", letterSpacing: "0.2em", fontWeight: 600, marginBottom: 6 }}>BLOOMBAY PRESENTS</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(28px,10vw,40px)", color: "#3A2010", lineHeight: 0.95 }}>{title}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "#8B6B3D", background: "rgba(139,107,61,0.1)", borderRadius: 999, padding: "3px 10px", fontWeight: 700 }}>{category}</span>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "#8B6B3D", background: "rgba(139,107,61,0.1)", borderRadius: 999, padding: "3px 10px", fontWeight: 700 }}>{date}</span>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ margin: 14, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderRadius: 14, padding: 14, zIndex: 2 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "#3A2010" }}>{time}</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#8B6B3D" }}>{venueName}</p>
          {seatsLeft !== undefined && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, color: ac, marginTop: 4, letterSpacing: "0.06em" }}>{seatsLeft} SEATS LEFT</p>
          )}
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 10, color: "rgba(139,107,61,0.6)", marginTop: 6 }}>BloomBay ✦</p>
        </div>
      </div>
    </a>
  );
}
