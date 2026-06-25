"use client";

import { useState } from "react";
import Link from "next/link";
import { type BookListing, BOOK_CATEGORIES } from "@/lib/actions/book";

// ── Design tokens ─────────────────────────────────────────────────────────────
const PINK = "#FF1F7D";
const CREAM = "#F6F1EB";
const DARK = "#1C1B1C";
const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

const MOCK_LISTINGS: BookListing[] = [];

interface MockReview { id: string; name: string; stars: number; text: string; date: string; initials: string; color: string; }
interface MockNote { id: string; text: string; color: string; }

const MOCK_REVIEWS: MockReview[] = [];
const MOCK_NOTES: MockNote[] = [];

// ── Color swatches for brand color picker ─────────────────────────────────────
const COLOR_SWATCHES = [
  PINK, "#C084FC", "#FB923C", "#34D399",
  "#60A5FA", "#F472B6", "#A78BFA", "#FBBF24",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const PROVIDER_COLORS = [PINK, "#C084FC", "#FB923C", "#34D399", "#60A5FA", "#F472B6", "#A78BFA"];

function providerColor(providerId: string): string {
  const idx = providerId.charCodeAt(providerId.length - 1) % PROVIDER_COLORS.length;
  return PROVIDER_COLORS[idx];
}

function initials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

function formatPrice(listing: BookListing): string {
  if (listing.price_type === "contact" || listing.price_cents == null) return "Contact";
  const dollars = listing.price_cents / 100;
  const fmt = dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
  if (listing.price_type === "hourly") return `${fmt}/hr`;
  return fmt;
}

function formatPriceShort(listing: BookListing): string {
  if (listing.price_type === "contact" || listing.price_cents == null) return "Contact";
  const dollars = listing.price_cents / 100;
  return dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

// ── Provider Avatar ───────────────────────────────────────────────────────────
function ProviderAvatar({
  listing,
  size = 48,
  colorOverride,
}: {
  listing: BookListing;
  size?: number;
  colorOverride?: string;
}) {
  const color = colorOverride ?? providerColor(listing.provider_id);
  if (listing.provider_avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={listing.provider_avatar}
        alt={listing.provider_name ?? "Provider"}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 3px 10px ${color}44`,
        color: "white",
        fontFamily: "var(--font-jost)",
        fontWeight: 700,
        fontSize: size / 2.6,
      }}
    >
      {initials(listing.provider_name)}
    </div>
  );
}

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ stars }: { stars: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= stars ? "#FBBF24" : "#E5E7EB"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ── Detail View ───────────────────────────────────────────────────────────────
function DetailView({
  listing,
  onBack,
  accentColor,
}: {
  listing: BookListing;
  onBack: () => void;
  accentColor: string;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "notes" | "inspiration">("overview");
  const priceStr = formatPriceShort(listing);
  const heroGradient = `linear-gradient(135deg, ${accentColor}CC 0%, ${accentColor}66 50%, #1C1B1C 100%)`;

  const TABS = [
    { id: "overview" as const, label: "OVERVIEW" },
    { id: "reviews" as const, label: "REVIEWS" },
    { id: "notes" as const, label: "BLOOM NOTES" },
    { id: "inspiration" as const, label: "INSPIRATION" },
  ];

  // Fake "friends who saved" avatars
  const FRIEND_COLORS = ["#C084FC", "#60A5FA", "#34D399"];
  const FRIEND_INITIALS = ["J", "M", "T"];

  return (
    <div style={{ minHeight: "100vh", background: CREAM, backgroundImage: PAPER_TEXTURE, paddingBottom: 100, paddingTop: "calc(env(safe-area-inset-top, 0px) + 54px)" }}>
      {/* Hero */}
      <div style={{ position: "relative", height: 220, background: heroGradient, flexShrink: 0 }}>
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(255,255,255,0.18)",
            border: "none",
            borderRadius: 20,
            color: "white",
            fontFamily: "var(--font-jost)",
            fontWeight: 700,
            fontSize: 12,
            padding: "6px 12px",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>

        {/* Hero text */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 20,
            right: 20,
            zIndex: 5,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontWeight: 700,
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.75)",
              margin: "0 0 4px",
            }}
          >
            BEAUTY STUDIO
          </p>
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 32,
              color: "white",
              margin: 0,
              lineHeight: 1.1,
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            {listing.provider_name}
          </h1>
        </div>
      </div>

      {/* Floating white card — overlaps hero by 20px */}
      <div
        style={{
          margin: "0 16px",
          marginTop: -24,
          background: "white",
          borderRadius: 24,
          boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
          padding: "20px 20px 22px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* BOOKED badge */}
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              background: `${PINK}18`,
              color: PINK,
              fontFamily: "var(--font-jost)",
              fontWeight: 800,
              fontSize: 9,
              letterSpacing: "0.18em",
              padding: "4px 10px",
              borderRadius: 20,
              border: `1px solid ${PINK}33`,
            }}
          >
            BOOKED
          </span>
        </div>

        {/* Service name */}
        <p
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700,
            fontSize: 20,
            color: DARK,
            margin: "0 0 2px",
            lineHeight: 1.2,
          }}
        >
          {listing.service_name}
        </p>
        {/* Addon subtext */}
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 12,
            color: "#aaa",
            margin: "0 0 14px",
          }}
        >
          + add-on available on request
        </p>

        {/* Provider row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <ProviderAvatar listing={listing} size={38} colorOverride={accentColor} />
          <div>
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontWeight: 700,
                fontSize: 13,
                color: DARK,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {listing.provider_name}
            </p>
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 11,
                color: "#aaa",
                margin: "1px 0 0",
              }}
            >
              {listing.category} · {listing.location}
            </p>
          </div>
        </div>

        {/* Friends who saved */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ display: "flex" }}>
            {FRIEND_INITIALS.map((ini, i) => (
              <div
                key={i}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: FRIEND_COLORS[i],
                  border: "2px solid white",
                  marginLeft: i === 0 ? 0 : -8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontFamily: "var(--font-jost)",
                  fontWeight: 700,
                  fontSize: 10,
                  zIndex: 3 - i,
                  position: "relative",
                }}
              >
                {ini}
              </div>
            ))}
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "#F3F4F6",
                border: "2px solid white",
                marginLeft: -8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
                fontFamily: "var(--font-jost)",
                fontWeight: 700,
                fontSize: 9,
                position: "relative",
                zIndex: 0,
              }}
            >
              +12
            </div>
          </div>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 11,
              color: "#aaa",
              margin: 0,
            }}
          >
            saved by friends
          </p>
        </div>

        {/* Date/time */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#F9FAFB",
            borderRadius: 12,
            padding: "10px 14px",
            marginBottom: 16,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 12,
              color: DARK,
              fontWeight: 600,
              margin: 0,
            }}
          >
            Tue, Dec 21 · 3:00–4:30 PM
          </p>
        </div>

        {/* Book Now button */}
        <button
          style={{
            width: "100%",
            padding: "15px 0",
            background: DARK,
            color: "white",
            border: "none",
            borderRadius: 14,
            fontFamily: "var(--font-jost)",
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: "0.1em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <span>BOOK NOW</span>
          {listing.price_cents != null && listing.price_type !== "contact" && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: accentColor }}>{priceStr}</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          marginTop: 20,
          paddingLeft: 16,
          paddingRight: 16,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flexShrink: 0,
              padding: "10px 14px",
              border: "none",
              borderBottom: activeTab === tab.id ? `2px solid ${accentColor}` : "2px solid transparent",
              background: "transparent",
              color: activeTab === tab.id ? accentColor : "#aaa",
              fontFamily: "var(--font-jost)",
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.12em",
              cursor: "pointer",
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: "20px 16px 0" }}>
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 14,
                color: "#555",
                lineHeight: 1.65,
                margin: "0 0 20px",
              }}
            >
              {listing.description}
            </p>

            {/* Brand color picker */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: "16px 18px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-jost)",
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#aaa",
                  margin: "0 0 12px",
                }}
              >
                Brand Color
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {COLOR_SWATCHES.map(sw => (
                  <div
                    key={sw}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: sw,
                      cursor: "default",
                      boxShadow: sw === accentColor ? `0 0 0 2px white, 0 0 0 4px ${sw}` : "0 2px 6px rgba(0,0,0,0.15)",
                      transition: "box-shadow 0.15s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {MOCK_REVIEWS.map(review => (
              <div
                key={review.id}
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: "16px 18px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: review.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontFamily: "var(--font-jost)",
                      fontWeight: 700,
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    {review.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-jost)",
                        fontWeight: 700,
                        fontSize: 13,
                        color: DARK,
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {review.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <StarRating stars={review.stars} />
                      <span
                        style={{
                          fontFamily: "var(--font-jost)",
                          fontSize: 10,
                          color: "#bbb",
                        }}
                      >
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 13,
                    color: "#555",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* BLOOM NOTES */}
        {activeTab === "notes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {MOCK_NOTES.map(note => (
              <div
                key={note.id}
                style={{
                  background: note.color,
                  borderRadius: 14,
                  padding: "16px 18px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  borderLeft: `3px solid ${accentColor}44`,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 13,
                    color: DARK,
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  "{note.text}"
                </p>
              </div>
            ))}
          </div>
        )}

        {/* INSPIRATION */}
        {activeTab === "inspiration" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[
                `linear-gradient(135deg, ${accentColor} 0%, #C084FC 100%)`,
                "linear-gradient(135deg, #FB923C 0%, #FBBF24 100%)",
                "linear-gradient(135deg, #60A5FA 0%, #34D399 100%)",
                `linear-gradient(135deg, #F472B6 0%, ${accentColor} 100%)`,
              ].map((grad, i) => (
                <div
                  key={i}
                  style={{
                    height: i % 2 === 0 ? 160 : 130,
                    borderRadius: 16,
                    background: grad,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Heart icon */}
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.3)",
                      backdropFilter: "blur(6px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" opacity={0.9}>
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── List Card ─────────────────────────────────────────────────────────────────
function ListCard({ listing, onTap }: { listing: BookListing; onTap: () => void }) {
  const color = providerColor(listing.provider_id);
  const priceStr = formatPrice(listing);
  const isContactOnly = listing.price_type === "contact" || listing.price_cents == null;

  return (
    <div
      onClick={onTap}
      style={{
        background: "white",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        overflow: "hidden",
        display: "flex",
        cursor: "pointer",
        transition: "box-shadow 0.15s",
      }}
    >
      {/* Color bar on left */}
      <div
        style={{
          width: 5,
          background: `linear-gradient(180deg, ${color} 0%, ${color}88 100%)`,
          flexShrink: 0,
        }}
      />

      {/* Card content */}
      <div style={{ flex: 1, padding: "14px 16px" }}>
        {/* Top row: category badge + price */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
          <span
            style={{
              background: `${color}18`,
              color: color,
              fontFamily: "var(--font-jost)",
              fontWeight: 700,
              fontSize: 9,
              padding: "3px 9px",
              borderRadius: 20,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              flexShrink: 0,
            }}
          >
            {listing.category}
          </span>
          <span
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 15,
              color: isContactOnly ? "#aaa" : PINK,
              flexShrink: 0,
            }}
          >
            {priceStr}
          </span>
        </div>

        {/* Service name */}
        <p
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700,
            fontSize: 16,
            color: DARK,
            margin: "0 0 2px",
            lineHeight: 1.2,
          }}
        >
          {listing.service_name}
        </p>

        {/* Provider name */}
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 12,
            color: "#888",
            margin: "0 0 6px",
          }}
        >
          {listing.provider_name}
          {listing.location ? ` · ${listing.location}` : ""}
        </p>

        {/* Description */}
        {listing.description && (
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 12,
              color: "#666",
              margin: 0,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {listing.description}
          </p>
        )}

        {/* Tap hint */}
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: color,
              opacity: 0.7,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 10,
              color: "#bbb",
              letterSpacing: "0.04em",
            }}
          >
            Tap to view
          </span>
        </div>
      </div>

      {/* Avatar on right */}
      <div style={{ padding: "14px 14px 14px 0", display: "flex", alignItems: "center" }}>
        <ProviderAvatar listing={listing} size={42} />
      </div>
    </div>
  );
}

// ── List Service Sheet ────────────────────────────────────────────────────────
function ListServiceSheet({ onClose }: { onClose: () => void }) {
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState(BOOK_CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState<"fixed" | "hourly" | "contact">("fixed");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid rgba(0,0,0,0.1)",
    borderRadius: 10,
    fontFamily: "var(--font-jost)",
    fontSize: 14,
    color: DARK,
    background: "white",
    boxSizing: "border-box",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-jost)",
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#888",
    marginBottom: 5,
    display: "block",
  };

  const PRICE_TYPES = [
    { value: "fixed", label: "Fixed" },
    { value: "hourly", label: "Hourly" },
    { value: "contact", label: "Contact" },
  ] as const;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 70,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 80,
          background: CREAM,
          backgroundImage: PAPER_TEXTURE,
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
          maxHeight: "88vh",
          overflowY: "auto",
          paddingBottom: 40,
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 6 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.12)" }} />
        </div>

        <div style={{ padding: "0 20px" }}>
          {/* Sheet header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: 22,
                  color: DARK,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                List your service
              </p>
              <p
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 14,
                  color: "#888",
                  margin: "3px 0 0",
                }}
              >
                women helping women ✿
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.07)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1 1l8 8M9 1l-8 8" />
              </svg>
            </button>
          </div>

          {/* Service name */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Service name</label>
            <input
              type="text"
              value={serviceName}
              onChange={e => setServiceName(e.target.value)}
              placeholder="e.g. Portrait Photography"
              style={inputStyle}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
            >
              {BOOK_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price + price type */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Price</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="e.g. 150"
                style={{ ...inputStyle, flex: 1 }}
                disabled={priceType === "contact"}
              />
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                {PRICE_TYPES.map(pt => (
                  <button
                    key={pt.value}
                    onClick={() => setPriceType(pt.value)}
                    style={{
                      padding: "0 12px",
                      height: 44,
                      borderRadius: 10,
                      border: "1.5px solid",
                      borderColor: priceType === pt.value ? PINK : "rgba(0,0,0,0.1)",
                      background: priceType === pt.value ? `${PINK}12` : "white",
                      color: priceType === pt.value ? PINK : "#888",
                      fontFamily: "var(--font-jost)",
                      fontWeight: 700,
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Harlem, Remote, Your place"
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Tell women what you do and how you do it."
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical",
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Submit button */}
          <button
            style={{
              width: "100%",
              padding: "15px 0",
              background: PINK,
              color: "white",
              border: "none",
              borderRadius: 14,
              fontFamily: "var(--font-jost)",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.05em",
              cursor: "pointer",
              boxShadow: `0 6px 24px ${PINK}44`,
            }}
          >
            List in The Book →
          </button>

          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 14,
              color: "#aaa",
              textAlign: "center",
              marginTop: 12,
            }}
          >
            Free to list. Bloombay takes a small fee when you get booked.
          </p>
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function BookPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showListSheet, setShowListSheet] = useState(false);
  const [detailView, setDetailView] = useState<BookListing | null>(null);
  const [accentColor, setAccentColor] = useState<string>(PINK);

  const FILTER_CATEGORIES = ["All", "Nails", "Hair", "Photography", "Styling", "Beauty", "Finance"];

  const filtered =
    activeCategory === "All"
      ? MOCK_LISTINGS
      : MOCK_LISTINGS.filter(l => l.category === activeCategory);

  // Show detail view
  if (detailView) {
    return (
      <DetailView
        listing={detailView}
        onBack={() => setDetailView(null)}
        accentColor={accentColor}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: CREAM,
        backgroundImage: PAPER_TEXTURE,
        paddingBottom: 100,
      }}
    >
      {/* Sticky header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: CREAM,
          backgroundImage: PAPER_TEXTURE,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "14px 18px 10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
          {/* Back arrow */}
          <Link
            href="/member/match"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: PINK,
              textDecoration: "none",
              fontFamily: "var(--font-jost)",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </Link>

          {/* List button */}
          <button
            onClick={() => setShowListSheet(true)}
            style={{
              background: PINK,
              color: "white",
              border: "none",
              borderRadius: 20,
              fontFamily: "var(--font-jost)",
              fontWeight: 700,
              fontSize: 11,
              padding: "7px 14px",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            List your service →
          </button>
        </div>

        {/* Title block */}
        <div style={{ marginTop: 6 }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 26,
              color: DARK,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            The Book
          </h1>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 15,
              color: "#888",
              margin: "2px 0 0",
            }}
          >
            women offering to women ✿
          </p>
        </div>

        {/* Category filter strip */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            marginTop: 12,
            paddingBottom: 2,
            scrollbarWidth: "none",
          }}
        >
          {FILTER_CATEGORIES.map(cat => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0,
                  padding: "5px 14px",
                  borderRadius: 20,
                  border: "1.5px solid",
                  borderColor: active ? PINK : "rgba(0,0,0,0.12)",
                  background: active ? PINK : "white",
                  color: active ? "white" : "#666",
                  fontFamily: "var(--font-jost)",
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent color picker strip */}
      <div
        style={{
          padding: "14px 18px 0",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontWeight: 700,
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#bbb",
            margin: 0,
            flexShrink: 0,
          }}
        >
          Accent
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          {COLOR_SWATCHES.map(sw => (
            <button
              key={sw}
              onClick={() => setAccentColor(sw)}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: sw,
                border: "none",
                cursor: "pointer",
                padding: 0,
                boxShadow:
                  accentColor === sw
                    ? `0 0 0 2px white, 0 0 0 3.5px ${sw}`
                    : "0 1px 4px rgba(0,0,0,0.18)",
                transition: "box-shadow 0.15s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Listing cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "14px 18px 0",
        }}
      >
        {filtered.map(listing => (
          <ListCard
            key={listing.id}
            listing={listing}
            onTap={() => setDetailView(listing)}
          />
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 18,
                color: "#bbb",
              }}
            >
              No listings in this category yet.
            </p>
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 15,
                color: "#ccc",
                marginTop: 4,
              }}
            >
              Be the first to offer your services here.
            </p>
          </div>
        )}
      </div>

      {/* List service bottom sheet */}
      {showListSheet && <ListServiceSheet onClose={() => setShowListSheet(false)} />}
    </div>
  );
}
