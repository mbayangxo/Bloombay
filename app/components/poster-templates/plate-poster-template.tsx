"use client";

import type { PosterTemplateProps } from "@/lib/poster-templates/types";

/**
 * Plate Poster — Sunday Supper at Carbone style.
 * Red & white stripe tablecloth, white dinner plate, polaroid clipped, handwritten notes.
 * Reference: 9A21C922... Sunday Supper
 */
export function PlatePosterTemplate({
  title,
  category,
  date,
  time,
  location,
  seatsLeft,
  hostName,
  imageUrl,
  accentColor = "#9B2335",
  href,
}: PosterTemplateProps) {

  const parts = location.split(",").map(s => s.trim());
  const venueName  = parts[0] ?? location;
  const venueCity  = parts[1] ?? "";

  return (
    <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3/2",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 14px 52px rgba(0,0,0,0.28)",
        background: `repeating-linear-gradient(
          90deg,
          ${accentColor} 0px,
          ${accentColor} 28px,
          white 28px,
          white 56px
        )`,
      }}>

        {/* ── Linen texture overlay ── */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)", backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)" }} />

        {/* ── Dinner Plate ── */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "62%", aspectRatio: "1",
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 8px 40px rgba(0,0,0,0.22), inset 0 0 0 3px rgba(155,35,53,0.08), inset 0 0 0 8px rgba(155,35,53,0.04)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "16px",
          zIndex: 2,
        }}>
          {/* Plate inner ring */}
          <div style={{ position: "absolute", inset: "10%", borderRadius: "50%", border: `1.5px solid ${accentColor}18` }} />

          <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: "clamp(11px, 2.5vw, 16px)", color: accentColor, letterSpacing: "0.04em", marginBottom: 2 }}>
            {category || "bloom bay presents"}
          </p>
          <div style={{ width: "40%", height: 1, background: `${accentColor}40`, marginBottom: 6 }} />

          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(18px, 4vw, 28px)", color: accentColor, lineHeight: 1, textAlign: "center", letterSpacing: "-0.01em" }}>
            {title}
          </p>

          {hostName && (
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(10px, 2vw, 14px)", color: `${accentColor}88`, marginTop: 3, textAlign: "center" }}>
              at {venueName}
              {venueCity && <><br/><em style={{ fontStyle: "italic" }}>{venueCity}</em></>}
            </p>
          )}

          <div style={{ width: "55%", height: 1, background: `${accentColor}30`, margin: "8px 0" }} />

          {/* Date / time / location row */}
          <div style={{ display: "flex", gap: "clamp(8px, 2vw, 14px)", alignItems: "center" }}>
            {[["✳", date], ["|", time], ["|", venueCity || location]].map(([sep, val], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {i > 0 && <span style={{ color: `${accentColor}44`, fontSize: 10 }}>|</span>}
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(7px, 1.5vw, 9px)", fontWeight: 800, color: accentColor, letterSpacing: "0.06em" }}>{val}</p>
              </div>
            ))}
          </div>

          {seatsLeft !== undefined && (
            <div style={{ marginTop: 6, background: `${accentColor}12`, borderRadius: 999, padding: "3px 10px", border: `1px solid ${accentColor}25` }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: accentColor, fontWeight: 700 }}>
                {seatsLeft} seats left ♡
              </p>
            </div>
          )}

          <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(6px, 1.2vw, 8px)", fontWeight: 900, letterSpacing: "0.2em", color: `${accentColor}55`, marginTop: 6 }}>·BB·</p>
        </div>

        {/* ── Polaroid photo (top-right, clipped over plate) ── */}
        {imageUrl && (
          <div style={{
            position: "absolute", top: "8%", right: "5%", zIndex: 4,
            transform: "rotate(4deg)",
            background: "white", padding: "6px 6px 18px",
            boxShadow: "0 6px 22px rgba(0,0,0,0.3)",
            width: "28%",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(8px, 1.5vw, 11px)", color: "rgba(0,0,0,0.45)", textAlign: "center", marginTop: 4 }}>
              see you there! ♡
            </p>
          </div>
        )}

        {/* ── Handwritten left annotation ── */}
        <div style={{ position: "absolute", left: "3%", top: "30%", zIndex: 3, transform: "rotate(-3deg)" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(9px, 1.8vw, 12px)", color: accentColor, lineHeight: 1.8, opacity: 0.8 }}>
            good food<br />better wine<br />better company ♡
          </p>
        </div>

        {/* ── BB monogram bottom-right ── */}
        <div style={{ position: "absolute", bottom: "6%", right: "3%", zIndex: 3, width: "10%", aspectRatio: "1", borderRadius: "50%", background: "white", boxShadow: "0 3px 12px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${accentColor}22` }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "clamp(8px, 1.8vw, 12px)", fontWeight: 700, color: accentColor }}>BB</p>
        </div>

        {/* ── Kiss mark stamp bottom-left ── */}
        <div style={{ position: "absolute", bottom: "8%", left: "4%", zIndex: 3, opacity: 0.55 }}>
          <svg width="clamp(14px,3vw,20px)" height="clamp(10px,2.2vw,14px)" viewBox="0 0 20 14" fill={accentColor}>
            <ellipse cx="7" cy="5" rx="5" ry="3.5" transform="rotate(-15 7 5)"/>
            <ellipse cx="13" cy="5" rx="5" ry="3.5" transform="rotate(15 13 5)"/>
            <ellipse cx="10" cy="10" rx="3" ry="2"/>
          </svg>
        </div>
      </div>
    </a>
  );
}
