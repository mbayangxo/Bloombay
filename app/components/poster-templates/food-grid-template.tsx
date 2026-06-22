"use client";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function FoodGridTemplate({
  title, hostName, accentColor, href,
}: PosterTemplateProps) {
  const ac = accentColor ?? "#8B5E3C";

  const cellStyle = (bg: string): React.CSSProperties => ({
    background: bg,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    boxSizing: "border-box",
    overflow: "hidden",
  });

  return (
    <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        width: "100%",
        aspectRatio: "1/1",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gap: 2,
        background: "#111",
        borderRadius: 10,
        overflow: "hidden",
      }}>

        {/* Cell 1 — dark photo (coffee machine) */}
        <div style={cellStyle("#1C1008")} />

        {/* Cell 2 — light cream — repeating CROISSANT text */}
        <div style={{ background: "#F5E8D0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 6 }}>
          {["CROISSANT", "CROISSANT", "CROISSANT", "CROISSANT", "CROISSANT"].map((t, i) => (
            <div key={i} style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 9,
              fontWeight: 900,
              color: "#3A2010",
              letterSpacing: "0.06em",
              lineHeight: 1.4,
              textAlign: "center",
              opacity: 1 - i * 0.12,
            }}>
              {t}
            </div>
          ))}
        </div>

        {/* Cell 3 — dark photo (coffee cup) */}
        <div style={cellStyle("#2A1810")} />

        {/* Cell 4 — cream promo */}
        <div style={{ background: "#F5E8D0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 8, gap: 4 }}>
          <div style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 7,
            fontWeight: 700,
            color: "#8B6B3D",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            BREAKFAST PROMO
          </div>
          <div style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 9,
            fontWeight: 900,
            color: "#3A2010",
            textAlign: "center",
            lineHeight: 1.2,
          }}>
            CROISSANT<br />COFFEE
          </div>
          <div style={{
            background: ac,
            borderRadius: 999,
            padding: "2px 8px",
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 9,
            fontWeight: 800,
            color: "#FFFFFF",
          }}>
            $5.50
          </div>
        </div>

        {/* Cell 5 — center: brand */}
        <div style={{ background: "#2A1A0A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 8, gap: 4 }}>
          <div style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: 14,
            fontWeight: 700,
            fontStyle: "italic",
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.1,
          }}>
            {title || "Habit"}
          </div>
          <div style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 7,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            textAlign: "center",
          }}>
            {hostName ?? "HABIT COFFEE"}
          </div>
        </div>

        {/* Cell 6 — cream — barista courses */}
        <div style={{ background: "#F5E8D0", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: 8, gap: 4 }}>
          <div style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 8,
            fontWeight: 900,
            color: "#3A2010",
            lineHeight: 1.2,
          }}>
            BARISTA<br />COURSES
          </div>
          <div style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 7,
            color: "#8B6B3D",
            lineHeight: 1.3,
          }}>
            Learn from the best in the city
          </div>
          <div style={{
            background: ac,
            borderRadius: 999,
            padding: "2px 6px",
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 7,
            fontWeight: 700,
            color: "#FFFFFF",
          }}>
            ENJOY 15% PROMO
          </div>
        </div>

        {/* Cell 7 — dark photo */}
        <div style={cellStyle("#180E04")} />

        {/* Cell 8 — cream — CROIS-SANT */}
        <div style={{ background: "#F5E8D0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 8 }}>
          <div style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 14,
            fontWeight: 900,
            color: "#3A2010",
            textAlign: "center",
            lineHeight: 1.1,
          }}>
            CROIS-<br />SANT
          </div>
          <div style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 7,
            fontWeight: 600,
            color: "#8B6B3D",
            letterSpacing: "0.1em",
            marginTop: 4,
          }}>
            {hostName ?? "BAKERY"}
          </div>
        </div>

        {/* Cell 9 — dark photo */}
        <div style={cellStyle("#221508")} />

      </div>
    </a>
  );
}
