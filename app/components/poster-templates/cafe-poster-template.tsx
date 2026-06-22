"use client";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function CafePosterTemplate({
  title,
  category,
  date,
  time,
  location,
  seatsLeft,
  imageUrl,
  accentColor = "#3A0A1E",
}: PosterTemplateProps) {
  return (
    <div style={{ aspectRatio: "3/4", background: "linear-gradient(160deg, #2A0616 0%, #3D0A22 60%, #1A0410 100%)", borderRadius: 14, overflow: "hidden", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* TOP SECTION */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.3em", textAlign: "center" }}>BLOOMBAY</p>

        {/* Vintage telephone SVG */}
        <div style={{ margin: "10px 0 6px" }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="10" cy="10" rx="6" ry="4" />
            <path d="M10 14 C8 18 8 22 10 26" />
            <ellipse cx="10" cy="30" rx="6" ry="4" />
            <path d="M16 10 L24 10 C28 10 30 14 30 20 C30 26 28 30 24 30 L16 30" />
          </svg>
        </div>

        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "13px", color: "rgba(255,255,255,0.65)", fontStyle: "italic", textAlign: "center", padding: "0 16px" }}>Coffee Shop &amp; Conversation Starter</p>
      </div>

      {/* TITLE SECTION */}
      <div style={{ width: "100%", padding: "16px 16px 8px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(26px, 9vw, 40px)", color: "#FF85C8", lineHeight: 0.9, textAlign: "center", textTransform: "uppercase", letterSpacing: "-0.02em", wordBreak: "break-word" }}>
          {title}
        </p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "14px", color: "rgba(255,255,255,0.55)", fontStyle: "italic", textAlign: "center", marginTop: 8 }}>
          {category || "Pretend you didn’t see the lipstick."}
        </p>
      </div>

      {/* PHOTO / BOTANICAL SECTION */}
      <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "0 12.5%" }}>
        <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: 8, overflow: "hidden", boxShadow: "0 6px 24px rgba(0,0,0,0.4)", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
          ) : (
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              {Array.from({ length: 12 }, (_, i) => {
                const angle = (i * 360) / 12;
                const rad = (angle * Math.PI) / 180;
                const x = 50 + 32 * Math.cos(rad);
                const y = 50 + 32 * Math.sin(rad);
                return (
                  <ellipse key={i} cx={x} cy={y} rx="7" ry="4"
                    fill="rgba(255,255,255,0.12)"
                    transform={`rotate(${angle} ${x} ${y})`}
                  />
                );
              })}
              <circle cx="50" cy="50" r="8" fill="rgba(255,255,255,0.08)" />
            </svg>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div style={{ width: "100%", marginTop: "auto", padding: "12px 16px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ width: "70%", height: 1, background: "rgba(255,255,255,0.3)" }} />
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.7)", textAlign: "center" }}>{date} · {time}</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "14px", color: "rgba(255,255,255,0.5)", textAlign: "center" }}>{location}</p>
        {seatsLeft !== undefined && (
          <div style={{ background: "#FF85C8", borderRadius: 999, padding: "3px 12px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: accentColor, letterSpacing: "0.08em" }}>{seatsLeft} SPOTS LEFT</p>
          </div>
        )}
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "12px", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>Call (Me) Later ♡</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.2)" }}>·BB·</p>
      </div>
    </div>
  );
}
