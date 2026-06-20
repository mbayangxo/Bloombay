import type { CSSProperties } from "react";

export function BloomEmpty({
  icon = "✦",
  title,
  sub,
  cta,
  ctaHref,
  style,
}: {
  icon?: string;
  title: string;
  sub?: string;
  cta?: string;
  ctaHref?: string;
  style?: CSSProperties;
}) {
  return (
    <div style={{
      textAlign: "center",
      padding: "48px 24px",
      ...style,
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "rgba(255,31,125,0.06)",
        border: "1.5px solid rgba(255,31,125,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 18px",
        fontSize: 22,
        color: "#FF1F7D",
      }}>
        {icon}
      </div>
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontStyle: "italic",
        fontSize: 18,
        color: "#111",
        margin: "0 0 8px",
        lineHeight: 1.25,
      }}>
        {title}
      </p>
      {sub && (
        <p style={{
          fontFamily: "Jost, sans-serif",
          fontSize: 12,
          color: "#999",
          lineHeight: 1.5,
          margin: "0 0 20px",
          maxWidth: 260,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          {sub}
        </p>
      )}
      {cta && ctaHref && (
        <a
          href={ctaHref}
          style={{
            display: "inline-block",
            fontFamily: "Jost, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#FF1F7D",
            textDecoration: "none",
            border: "1.5px solid #FF1F7D",
            borderRadius: 20,
            padding: "8px 20px",
          }}
        >
          {cta} →
        </a>
      )}
    </div>
  );
}
