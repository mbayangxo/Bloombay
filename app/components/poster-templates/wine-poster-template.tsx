"use client";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function WinePosterTemplate({
  title, category, date, time, location, seatsLeft, imageUrl, accentColor, href,
}: PosterTemplateProps) {
  const ac = accentColor ?? "#9B2335";
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
        boxShadow: "0 14px 52px rgba(0,0,0,0.2)",
        background: "#F0E8D8",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(0,0,0,0.03) 23px, rgba(0,0,0,0.03) 24px)",
        display: "flex",
        flexDirection: "column",
        padding: 16,
      }}>

        <svg style={{ position: "absolute", bottom: "12%", right: "8%", zIndex: 1 }} width="70" height="70" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(120,30,40,0.12)" strokeWidth="3"/>
          <circle cx="42" cy="40" r="24" fill="none" stroke="rgba(120,30,40,0.08)" strokeWidth="2.5"/>
        </svg>

        <div style={{ position: "absolute", bottom: "8%", left: "10%", width: 18, height: 12, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(155,35,53,0.2)", zIndex: 1 }} />

        <div style={{ alignSelf: "center", width: 44, height: 44, borderRadius: "50%", border: `1.5px solid ${ac}`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, fontWeight: 700, color: ac }}>BB</p>
        </div>

        <div style={{ marginTop: 12, zIndex: 2 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: ac, letterSpacing: "0.2em", fontWeight: 700 }}>{category.toUpperCase()}</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(28px,9vw,42px)", color: "#2A1010", lineHeight: 1, marginTop: 4 }}>{title}</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#8B5C5C", marginTop: 4 }}>{date} · {time}</p>
        </div>

        {imageUrl && (
          <div style={{ position: "absolute", top: "25%", right: "5%", zIndex: 4, transform: "rotate(3deg)", background: "white", padding: "5px 5px 16px", boxShadow: "0 6px 22px rgba(0,0,0,0.25)", width: "38%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}/>
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div style={{ zIndex: 2, borderTop: `1px solid rgba(155,35,53,0.2)`, paddingTop: 10 }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#2A1010" }}>{venueName}</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#8B5C5C" }}>{parts[1] ?? ""}</p>
          {seatsLeft !== undefined && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, color: ac, marginTop: 4 }}>{seatsLeft} SEATS LEFT</p>
          )}
        </div>

        <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: 13, color: ac, opacity: 0.55, zIndex: 2, marginTop: 8 }}>Buon vino, buona vita ♡</p>
      </div>
    </a>
  );
}
