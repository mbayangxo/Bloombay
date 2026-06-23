"use client";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function RooftopPosterTemplate({
  title, category, date, time, location, seatsLeft, imageUrl, accentColor, href,
}: PosterTemplateProps) {
  const ac = accentColor ?? "#FF1F7D";
  const parts = location.split(",").map(s => s.trim());
  const venueName = parts[0] ?? location;
  const words = title.split(" ");
  const half = Math.ceil(words.length / 2);
  const line1 = words.slice(0, half).join(" ");
  const line2 = words.slice(half).join(" ");

  return (
    <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4/5",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 14px 52px rgba(0,0,0,0.45)",
        background: "linear-gradient(180deg, #0A0A0A 0%, #1A1A2E 100%)",
        display: "flex",
        flexDirection: "column",
        padding: 16,
      }}>

        {imageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
            <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.7)" }}/>
          </>
        )}

        <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 1 }} viewBox="0 0 400 100" preserveAspectRatio="none">
          <rect x="0" y="60" width="30" height="40" fill="rgba(255,255,255,0.06)"/>
          <rect x="25" y="40" width="20" height="60" fill="rgba(255,255,255,0.06)"/>
          <rect x="40" y="55" width="25" height="45" fill="rgba(255,255,255,0.06)"/>
          <rect x="60" y="30" width="18" height="70" fill="rgba(255,255,255,0.06)"/>
          <rect x="75" y="50" width="22" height="50" fill="rgba(255,255,255,0.06)"/>
          <rect x="92" y="45" width="15" height="55" fill="rgba(255,255,255,0.06)"/>
          <rect x="105" y="35" width="20" height="65" fill="rgba(255,255,255,0.06)"/>
          <rect x="122" y="55" width="28" height="45" fill="rgba(255,255,255,0.06)"/>
          <rect x="148" y="25" width="22" height="75" fill="rgba(255,255,255,0.06)"/>
          <rect x="168" y="45" width="18" height="55" fill="rgba(255,255,255,0.06)"/>
          <rect x="184" y="60" width="25" height="40" fill="rgba(255,255,255,0.06)"/>
          <rect x="206" y="40" width="20" height="60" fill="rgba(255,255,255,0.06)"/>
          <rect x="224" y="30" width="16" height="70" fill="rgba(255,255,255,0.06)"/>
          <rect x="238" y="50" width="22" height="50" fill="rgba(255,255,255,0.06)"/>
          <rect x="258" y="42" width="18" height="58" fill="rgba(255,255,255,0.06)"/>
          <rect x="274" y="55" width="28" height="45" fill="rgba(255,255,255,0.06)"/>
          <rect x="300" y="35" width="20" height="65" fill="rgba(255,255,255,0.06)"/>
          <rect x="318" y="48" width="24" height="52" fill="rgba(255,255,255,0.06)"/>
          <rect x="340" y="38" width="18" height="62" fill="rgba(255,255,255,0.06)"/>
          <rect x="356" y="55" width="22" height="45" fill="rgba(255,255,255,0.06)"/>
          <rect x="375" y="42" width="25" height="58" fill="rgba(255,255,255,0.06)"/>
        </svg>

        {["4% 15%", "92% 25%", "8% 70%", "88% 60%"].map((pos, i) => (
          <div key={i} style={{ position: "absolute", left: pos.split(" ")[0], top: pos.split(" ")[1], zIndex: 2, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>✦</div>
        ))}

        <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", fontWeight: 600, zIndex: 3 }}>BLOOMBAY PRESENTS</p>

        <div style={{ position: "absolute", top: 14, right: 14, zIndex: 4, display: "flex", gap: 6 }}>
          <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "4px 10px", border: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "white", fontWeight: 700 }}>{date}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "4px 10px", border: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "white", fontWeight: 700 }}>{time}</p>
          </div>
        </div>

        <div style={{ marginTop: "auto", marginBottom: 40, zIndex: 3 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(38px,13vw,56px)", color: "white", lineHeight: 0.88 }}>{line1}</p>
          {line2 && <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(38px,13vw,56px)", color: "#FF1F7D", lineHeight: 0.88 }}>{line2}</p>}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 3 }}>
          <div>
            <div style={{ background: "#FF1F7D", borderRadius: 999, padding: "4px 12px", display: "inline-block", marginBottom: 6 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "white", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{category}</p>
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{venueName}</p>
          </div>
          {seatsLeft !== undefined && (
            <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "4px 12px", border: "1px solid rgba(255,255,255,0.2)" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "white", fontWeight: 700 }}>{seatsLeft} seats left</p>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
