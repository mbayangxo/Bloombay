"use client";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";

export function ReceiptMenuTemplate({
  title, location, hostName, accentColor, href,
}: PosterTemplateProps) {
  const ac = accentColor ?? "#8B1A2E";

  // Parse menu items from title (comma-separated) or use mock items
  const rawItems = title ? title.split(",").map(s => s.trim()).filter(Boolean) : [];
  const mockItems = [
    { num: "01", name: "Croissant", price: "$4.27" },
    { num: "02", name: "Blueberry Muffin", price: "$3.76" },
    { num: "03", name: "Chocolate Cake", price: "$4.67" },
    { num: "04", name: "Brownie", price: "$4.98" },
    { num: "05", name: "Donut", price: "$3.46" },
  ];
  const displayItems = rawItems.length >= 2
    ? rawItems.slice(0, 5).map((name, i) => ({
        num: String(i + 1).padStart(2, "0"),
        name,
        price: `$${(3.5 + i * 0.5).toFixed(2)}`,
      }))
    : mockItems;

  const total = displayItems
    .reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")), 0)
    .toFixed(2);

  return (
    <a href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3/4",
        background: "linear-gradient(135deg, #8B5E3C 0%, #A0714B 40%, #7A4F2E 100%)",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        boxSizing: "border-box",
      }}>

        {/* Receipt card */}
        <div style={{
          background: "#FEFCF7",
          borderRadius: 2,
          padding: 20,
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}>

          {/* Metallic clip SVG at top */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <svg width="50" height="28" viewBox="0 0 50 28">
              <rect x="10" y="0" width="30" height="20" rx="5" fill="#C0B090" stroke="#A09070" strokeWidth="1" />
              <rect x="14" y="4" width="22" height="2" rx="1" fill="#907850" />
              <rect x="14" y="8" width="22" height="2" rx="1" fill="#907850" />
              <rect x="14" y="12" width="22" height="2" rx="1" fill="#907850" />
              <rect x="5" y="18" width="40" height="6" rx="2" fill="#B0A080" stroke="#A09070" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Brand name */}
          <div style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: 22,
            fontWeight: 700,
            fontStyle: "italic",
            color: ac,
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 4,
          }}>
            {hostName ?? "The Bakery"}
          </div>

          {/* Tagline */}
          <div style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.18em",
            color: "#8B7A6A",
            textAlign: "center",
            textTransform: "uppercase",
            marginBottom: 6,
          }}>
            Fresh Baked Daily
          </div>

          {/* Address */}
          <div style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: 9,
            color: "#A09080",
            textAlign: "center",
            marginBottom: 10,
          }}>
            {location}
          </div>

          {/* Dashed divider */}
          <div style={{
            borderTop: "1.5px dashed #D0C8B8",
            marginBottom: 10,
          }} />

          {/* Menu items */}
          {displayItems.map((item) => (
            <div key={item.num} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}>
              <span style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: 10,
                color: "#6B5A4A",
                fontWeight: 500,
              }}>
                <span style={{ color: "#B0A090", marginRight: 6 }}>{item.num}</span>
                {item.name}
              </span>
              <span style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "#3A2A1A",
              }}>
                {item.price}
              </span>
            </div>
          ))}

          {/* Dashed divider */}
          <div style={{
            borderTop: "1.5px dashed #D0C8B8",
            margin: "8px 0",
          }} />

          {/* Total row */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: "#3A2A1A",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              {displayItems.length} items — Total
            </span>
            <span style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 12,
              fontWeight: 800,
              color: ac,
            }}>
              ${total}
            </span>
          </div>
        </div>

        {/* Wax seal — bottom-right corner */}
        <div style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          width: 60,
          height: 60,
        }}>
          <svg viewBox="0 0 60 60" width="60" height="60">
            {/* Seal star burst */}
            <circle cx="30" cy="30" r="28" fill={ac} />
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => (
              <rect
                key={deg}
                x="28" y="2"
                width="4" height="10"
                rx="1"
                fill={ac}
                transform={`rotate(${deg} 30 30)`}
              />
            ))}
            <circle cx="30" cy="30" r="22" fill={ac} />
            <circle cx="30" cy="30" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <text
              x="30" y="33"
              textAnchor="middle"
              fontFamily="var(--font-jost), sans-serif"
              fontSize="7"
              fontWeight="700"
              fill="rgba(255,255,255,0.9)"
              letterSpacing="1"
            >
              {(hostName ?? "BAKERY").toUpperCase().slice(0, 7)}
            </text>
          </svg>
        </div>

      </div>
    </a>
  );
}
