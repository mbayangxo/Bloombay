"use client";

import { useState } from "react";
import Link from "next/link";
import { type BookListing, BOOK_CATEGORIES } from "@/lib/actions/book";

// ── Design tokens ─────────────────────────────────────────────────────────────
const PINK = "#FF1F7D";
const CREAM = "#F6F1EB";
const DARK = "#1C1B1C";
const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_LISTINGS: BookListing[] = [
  {
    id: "1",
    provider_id: "p1",
    provider_name: "Amara K",
    provider_avatar: null,
    service_name: "Portrait Photography",
    category: "Photography",
    description: "Film and digital. Natural light only. I shoot the woman, not the pose.",
    price_cents: 25000,
    price_type: "fixed",
    location: "West Village",
    image_url: null,
    created_at: "2026-01-01",
  },
  {
    id: "2",
    provider_id: "p2",
    provider_name: "Zara M",
    provider_avatar: null,
    service_name: "Personal Styling Session",
    category: "Styling",
    description: "I'll go through your closet, tell you the truth, and help you figure out your actual style.",
    price_cents: 15000,
    price_type: "fixed",
    location: "Your place or mine",
    image_url: null,
    created_at: "2026-01-02",
  },
  {
    id: "3",
    provider_id: "p3",
    provider_name: "Sade T",
    provider_avatar: null,
    service_name: "Gel Nails (home visit)",
    category: "Nails",
    description: "I come to you. Full set or fill. Builder gel only — no acrylics.",
    price_cents: 8500,
    price_type: "fixed",
    location: "Crown Heights + nearby",
    image_url: null,
    created_at: "2026-01-03",
  },
  {
    id: "4",
    provider_id: "p4",
    provider_name: "Nia B",
    provider_avatar: null,
    service_name: "Financial Planning for Creatives",
    category: "Finance",
    description: "I help artists, freelancers and small business owners actually understand their money.",
    price_cents: 20000,
    price_type: "hourly",
    location: "Remote",
    image_url: null,
    created_at: "2026-01-04",
  },
  {
    id: "5",
    provider_id: "p5",
    provider_name: "Lena P",
    provider_avatar: null,
    service_name: "French + Italian Tutoring",
    category: "Tutoring",
    description: "PhD student, native French speaker. Patient. Focused on conversation.",
    price_cents: 7500,
    price_type: "hourly",
    location: "Remote or Astoria",
    image_url: null,
    created_at: "2026-01-05",
  },
  {
    id: "6",
    provider_id: "p6",
    provider_name: "Kemi O",
    provider_avatar: null,
    service_name: "Brow Shaping + Tint",
    category: "Makeup",
    description: "I only work with natural hair textures. No over-plucking.",
    price_cents: 6500,
    price_type: "fixed",
    location: "Harlem",
    image_url: null,
    created_at: "2026-01-06",
  },
  {
    id: "7",
    provider_id: "p7",
    provider_name: "Sofia R",
    provider_avatar: null,
    service_name: "Brand Photography",
    category: "Photography",
    description: "Content days for creatives and small brands. I make it look intentional.",
    price_cents: 40000,
    price_type: "fixed",
    location: "NYC",
    image_url: null,
    created_at: "2026-01-07",
  },
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
  if (listing.price_type === "contact" || listing.price_cents == null) return "Contact for pricing";
  const dollars = listing.price_cents / 100;
  const fmt = dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
  if (listing.price_type === "hourly") return `${fmt}/hr`;
  return fmt;
}

// ── Provider Avatar ───────────────────────────────────────────────────────────
function ProviderAvatar({ listing, size = 48 }: { listing: BookListing; size?: number }) {
  const color = providerColor(listing.provider_id);
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

// ── Provider Card ─────────────────────────────────────────────────────────────
function ProviderCard({ listing }: { listing: BookListing }) {
  const priceStr = formatPrice(listing);
  const isContactOnly = listing.price_type === "contact" || listing.price_cents == null;

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        padding: "14px 18px",
      }}
    >
      {/* Top row: avatar + info */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <ProviderAvatar listing={listing} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontWeight: 700,
              fontSize: 14,
              color: DARK,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {listing.service_name}
          </p>
          <p
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: 13,
              color: "#666",
              margin: "2px 0 4px",
            }}
          >
            {listing.provider_name}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span
              style={{
                background: `${PINK}18`,
                color: PINK,
                fontFamily: "var(--font-jost)",
                fontWeight: 700,
                fontSize: 9,
                padding: "2px 8px",
                borderRadius: 20,
                letterSpacing: "0.05em",
              }}
            >
              {listing.category}
            </span>
            {listing.location && (
              <span
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 9,
                  color: "#aaa",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                📍 {listing.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Price row */}
      <div style={{ marginTop: 10 }}>
        <span
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 15,
            color: isContactOnly ? "#888" : PINK,
          }}
        >
          {priceStr}
        </span>
      </div>

      {/* Description preview */}
      {listing.description && (
        <p
          style={{
            fontFamily: "var(--font-caveat)",
            fontSize: 14,
            color: "#555",
            margin: "8px 0 0",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.45,
          }}
        >
          {listing.description}
        </p>
      )}

      {/* Book button */}
      <button
        style={{
          marginTop: 12,
          background: PINK,
          color: "white",
          border: "none",
          borderRadius: 20,
          fontFamily: "var(--font-jost)",
          fontWeight: 700,
          fontSize: 12,
          padding: "8px 16px",
          cursor: "pointer",
          letterSpacing: "0.04em",
        }}
      >
        Book her →
      </button>
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
                  fontFamily: "var(--font-caveat)",
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

          {/* Caveat note */}
          <p
            style={{
              fontFamily: "var(--font-caveat)",
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

  const categories = ["All", ...BOOK_CATEGORIES];
  const filtered =
    activeCategory === "All"
      ? MOCK_LISTINGS
      : MOCK_LISTINGS.filter(l => l.category === activeCategory);

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
              fontFamily: "var(--font-caveat)",
              fontSize: 15,
              color: "#888",
              margin: "2px 0 0",
            }}
          >
            women offering to women ✿
          </p>
        </div>

        {/* Category chips */}
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
          {categories.map(cat => {
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
                  transition: "all 0.15s ease",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Listing cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "16px 18px 0",
        }}
      >
        {filtered.map(listing => (
          <ProviderCard key={listing.id} listing={listing} />
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
                fontFamily: "var(--font-caveat)",
                fontSize: 18,
                color: "#bbb",
              }}
            >
              No listings in this category yet.
            </p>
            <p
              style={{
                fontFamily: "var(--font-caveat)",
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
