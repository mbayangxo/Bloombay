"use client";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function SaturdayPosterTemplate({
  title, category, date, time, location, seatsLeft, imageUrl, accentColor, href,
}: PosterTemplateProps) {
  const ac = accentColor ?? "#4A9FFF";
  const parts = location.split(",").map(s => s.trim());
  const venueName = parts[0] ?? location;
  const words = title.split(" ");
  const firstWord = words[0] ?? title;
  const restWords = words.slice(1).join(" ") || "";

  return (
    <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4/5",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 14px 52px rgba(0,0,0,0.4)",
        background: "#0D1939",
        display: "flex",
        flexDirection: "column",
        padding: 16,
      }}>

        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "8px 8px", pointerEvents: "none" }} />

        {imageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
            <div style={{ position: "absolute", inset: 0, background: "rgba(13,25,57,0.6)" }}/>
          </>
        )}

        <div style={{ position: "absolute", top: "35%", left: 0, right: 0, height: "30%", background: "linear-gradient(180deg, transparent, rgba(26,47,94,0.3), transparent)", pointerEvents: "none" }} />

        <div style={{ position: "absolute", top: 16, right: 16, zIndex: 3 }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
            <line x1="0" y1="8" x2="24" y2="8" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <line x1="0" y1="12" x2="24" y2="12" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <line x1="0" y1="16" x2="24" y2="16" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <line x1="8" y1="0" x2="8" y2="24" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <line x1="12" y1="0" x2="12" y2="24" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <line x1="16" y1="0" x2="16" y2="24" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
          </svg>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2 }}>
          <div/>
          <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "4px 12px", border: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "white", fontWeight: 700 }}>{date}</p>
          </div>
        </div>

        <div style={{ marginTop: "auto", marginBottom: 12, zIndex: 2 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(24px,8vw,34px)", color: "rgba(255,255,255,0.8)", lineHeight: 1 }}>{firstWord}</p>
          {restWords && (
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(40px,14vw,64px)", color: "white", letterSpacing: "-0.04em", lineHeight: 0.9 }}>{restWords}</p>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 2 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{venueName} · {time}</p>
            {seatsLeft !== undefined && (
              <div style={{ marginTop: 4, background: ac, borderRadius: 999, padding: "3px 10px", display: "inline-block" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "white", fontWeight: 700 }}>{seatsLeft} seats left</p>
              </div>
            )}
          </div>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>BB</p>
        </div>
      </div>
    </a>
  );
}
