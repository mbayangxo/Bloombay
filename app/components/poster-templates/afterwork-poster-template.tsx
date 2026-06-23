"use client";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function AfterWorkPosterTemplate({
  title, category, date, time, location, seatsLeft, imageUrl, accentColor, href,
}: PosterTemplateProps) {
  const ac = accentColor ?? "#B07040";
  const parts = location.split(",").map(s => s.trim());
  const venueName = parts[0] ?? location;
  const words = title.split(" ");
  const firstWord = words[0] ?? title;
  const restWords = words.slice(1).join(" ");

  return (
    <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3/4",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 14px 52px rgba(0,0,0,0.18)",
        background: "radial-gradient(ellipse at 50% 50%, #FFF4E8 0%, #F5EDE0 60%, #EDE0D0 100%)",
        display: "flex",
        flexDirection: "column",
        padding: 16,
      }}>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "#B07040", letterSpacing: "0.2em", fontWeight: 600, zIndex: 2 }}>BLOOMBAY PRESENTS</p>

        {imageUrl && (
          <div style={{ position: "absolute", top: "12%", right: "5%", zIndex: 3, transform: "rotate(3deg)", width: "70%", borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 28px rgba(0,0,0,0.2)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}/>
          </div>
        )}

        <div style={{ marginTop: imageUrl ? "55%" : 20, zIndex: 2, position: "relative", display: "inline-block" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px,9vw,40px)", color: "#2A1A0A", lineHeight: 1.1 }}>{firstWord}</p>
          {restWords && (
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(32px,11vw,48px)", color: "#2A1A0A", lineHeight: 0.95 }}>{restWords}</p>
          )}
          <svg style={{ position: "absolute", top: 4, right: -28, transform: "rotate(-10deg)" }} width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10,6 C10,3 7,1 4,3 C1,5 1,9 4,11 L10,17 L16,11 C19,9 19,5 16,3 C13,1 10,3 10,6Z" stroke="#FF1F7D" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>

        <div style={{ marginTop: 10, zIndex: 2 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "#5C3A1A", background: "rgba(92,58,26,0.08)", border: "1px solid rgba(92,58,26,0.2)", borderRadius: 999, padding: "3px 10px", fontWeight: 700 }}>{category}</span>
        </div>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "#5C3A1A", marginTop: 6, zIndex: 2 }}>{date}</p>

        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#8B6040", marginTop: 2, zIndex: 2 }}>{venueName}</p>

        <div style={{ flex: 1 }} />

        {seatsLeft !== undefined && (
          <div style={{ zIndex: 2, marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, color: "white", background: "#D4703A", borderRadius: 999, padding: "4px 12px" }}>{seatsLeft} going</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "#B07040", opacity: 0.6, letterSpacing: "0.1em" }}>soho · bloombay</p>
          <div style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${ac}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 7, fontWeight: 700, color: ac }}>BB</p>
          </div>
        </div>
      </div>
    </a>
  );
}
