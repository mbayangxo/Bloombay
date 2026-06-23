"use client";

import type { PosterTemplateProps } from "@/lib/poster-templates/types";

/**
 * Grid Poster — SSC Supper Club style.
 * 2×2 moody photo grid with dark veil + centred serif+sans title overlay.
 * Reference: IMG_3647
 */
export function GridPosterTemplate({
  title,
  category,
  date,
  time,
  location,
  seatsLeft,
  imageUrl,
  accentColor = "#E8D45A",
  href,
}: PosterTemplateProps) {

  const gridPhotos = imageUrl
    ? [imageUrl, imageUrl, imageUrl, imageUrl]
    : [null, null, null, null];

  const titleWords = title.split(" ");
  const scriptPart = titleWords.slice(0, 2).join(" ");
  const boldPart   = titleWords.slice(2).join(" ") || title;

  return (
    <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4/5",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 12px 48px rgba(0,0,0,0.45)",
      }}>

        {/* ── 2×2 Photo Grid ── */}
        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 2 }}>
          {gridPhotos.map((photo, i) => (
            <div key={i} style={{ position: "relative", overflow: "hidden", background: "#1A1210" }}>
              {photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.72) saturate(0.7)", display: "block" }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Dark veil gradient ── */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,6,0.92) 0%, rgba(10,8,6,0.55) 42%, rgba(10,8,6,0.3) 65%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,8,6,0.4) 0%, transparent 25%)" }} />

        {/* ── Category + date strip at top ── */}
        <div style={{ position: "absolute", top: 18, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(6px)", borderRadius: 999, padding: "5px 12px", border: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "rgba(255,255,255,0.8)", letterSpacing: "0.18em" }}>{category.toUpperCase()}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(6px)", borderRadius: 999, padding: "5px 12px", border: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}>{date}</p>
          </div>
        </div>

        {/* ── Centred title overlay ── */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(20px, 6vw, 32px)", color: "rgba(255,255,255,0.85)", lineHeight: 1, letterSpacing: "-0.01em", textAlign: "center", marginBottom: 4 }}>
            {scriptPart}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(32px, 10vw, 54px)", color: accentColor, lineHeight: 0.9, letterSpacing: "-0.03em", textAlign: "center", textTransform: "uppercase" as const }}>
            {boldPart}
          </p>
        </div>

        {/* ── Bottom info bar ── */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 20px 20px", background: "linear-gradient(to top, rgba(10,8,6,0.96) 0%, transparent 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 3 }}>{location}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)" }}>{time}</p>
            </div>
            {seatsLeft !== undefined && (
              <div style={{ background: accentColor, borderRadius: 999, padding: "6px 14px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: "#111", letterSpacing: "0.08em" }}>{seatsLeft} SEATS LEFT</p>
              </div>
            )}
          </div>
          {/* BB mark */}
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 10, letterSpacing: "0.05em" }}>BloomBay ✦</p>
        </div>
      </div>
    </a>
  );
}
