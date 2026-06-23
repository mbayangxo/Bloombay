"use client";

import { useState } from "react";
import Link from "next/link";
import { type BloomTrip } from "@/lib/actions/bloom-trip";

// ── Design tokens ─────────────────────────────────────────────────────────────
const PINK = "#FF1F7D";
const CREAM = "#F6F1EB";
const DARK = "#1C1B1C";

// suppress unused-variable lint — kept for completeness
void CREAM;
void DARK;

// ── Mock trips ────────────────────────────────────────────────────────────────
const MOCK_TRIPS: BloomTrip[] = [
  {
    id: "t1",
    organizer_id: "p4",
    organizer_name: "Nia B",
    organizer_avatar: null,
    title: "Morocco Girls Trip",
    destination: "Casablanca → Marrakech",
    description: "Sun, souks, and sisterhood. We explore Casablanca first, then take the train to Marrakech for the heart of the trip.",
    departure_date: "2026-07-18",
    return_date: "2026-07-25",
    price_per_person_cents: 185000,
    capacity: 8,
    attending_count: 5,
    includes: ["flights", "hotel", "guided tours"],
    image_url: null,
    accent_color: "#D2691E",
    status: "open",
    created_at: "2026-06-01",
  },
  {
    id: "t2",
    organizer_id: "p1",
    organizer_name: "Amara K",
    organizer_avatar: null,
    title: "Tulum Reset",
    destination: "Tulum, Mexico",
    description: "A small group trip to decompress. Think cenotes, cacao ceremonies, and sleeping well for once.",
    departure_date: "2026-08-03",
    return_date: "2026-08-08",
    price_per_person_cents: 120000,
    capacity: 6,
    attending_count: 3,
    includes: ["hotel", "activities"],
    image_url: null,
    accent_color: "#00A693",
    status: "open",
    created_at: "2026-06-02",
  },
  {
    id: "t3",
    organizer_id: "p2",
    organizer_name: "Zara M",
    organizer_avatar: null,
    title: "Paris Long Weekend",
    destination: "Paris, France",
    description: "Three nights in Paris. Markets, museums, and the best croissants you've ever had.",
    departure_date: "2026-09-12",
    return_date: "2026-09-15",
    price_per_person_cents: 95000,
    capacity: 10,
    attending_count: 10,
    includes: ["hotel"],
    image_url: null,
    accent_color: "#6A5ACD",
    status: "full",
    created_at: "2026-06-03",
  },
  {
    id: "t4",
    organizer_id: "p3",
    organizer_name: "Sade T",
    organizer_avatar: null,
    title: "Italian Coast Drive",
    destination: "Amalfi Coast, Italy",
    description: "Seven days driving down the Amalfi Coast. We share the car, share the meals, and don't share the wifi password with anyone else.",
    departure_date: "2026-10-04",
    return_date: "2026-10-11",
    price_per_person_cents: 240000,
    capacity: 5,
    attending_count: 1,
    includes: ["flights", "hotel", "car rental", "meals"],
    image_url: null,
    accent_color: "#2E86AB",
    status: "open",
    created_at: "2026-06-04",
  },
];

// ── Gradient map (trip id → CSS gradient) ────────────────────────────────────
const TRIP_GRADIENTS: Record<string, string> = {
  t1: "linear-gradient(160deg, #8B4513, #D2691E, #CD853F)",
  t2: "linear-gradient(160deg, #006994, #00A693, #20B2AA)",
  t3: "linear-gradient(160deg, #4A4A6A, #6A5ACD, #9370DB)",
  t4: "linear-gradient(160deg, #1E4080, #2E86AB, #A8DADC)",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatDateRange(departure: string, returnDate: string | null): string {
  const dep = new Date(departure + "T00:00:00");
  const ret = returnDate ? new Date(returnDate + "T00:00:00") : null;
  const depStr = dep.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const retStr = ret
    ? ret.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";
  return ret ? `${depStr} – ${retStr}` : depStr;
}

const ORGANIZER_COLORS = [PINK, "#C084FC", "#FB923C", "#34D399", "#60A5FA", "#F472B6"];

function organizerColor(name: string): string {
  const idx = name.charCodeAt(0) % ORGANIZER_COLORS.length;
  return ORGANIZER_COLORS[idx];
}

function initials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

// ── Trip Card ─────────────────────────────────────────────────────────────────
function TripCard({
  trip,
  joined,
  onJoin,
}: {
  trip: BloomTrip;
  joined: boolean;
  onJoin: (id: string) => void;
}) {
  const isFull = trip.status === "full" || trip.attending_count >= trip.capacity;
  const spotsLeft = trip.capacity - trip.attending_count;
  const gradient = TRIP_GRADIENTS[trip.id] ?? `linear-gradient(160deg, ${trip.accent_color}, ${trip.accent_color}99)`;
  const orgColor = organizerColor(trip.organizer_name ?? "A");

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Image / gradient area */}
      <div
        style={{
          height: 160,
          background: gradient,
          position: "relative",
        }}
      >
        {/* Gradient overlay for text legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Status badge top-right */}
        {isFull && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "#D97706",
              borderRadius: 999,
              padding: "4px 10px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jost)",
                fontWeight: 800,
                fontSize: 9,
                color: "white",
                letterSpacing: "0.1em",
              }}
            >
              FULL
            </span>
          </div>
        )}

        {/* Destination title at bottom of image */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 14,
            right: 14,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 22,
              color: "white",
              margin: 0,
              lineHeight: 1.15,
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            {trip.title}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "12px 14px 14px" }}>
        {/* Destination + dates row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontWeight: 700,
              fontSize: 11,
              color: "rgba(255,255,255,0.85)",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            {trip.destination}
          </p>
          <span
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 9,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.06em",
            }}
          >
            {formatDateRange(trip.departure_date, trip.return_date)}
          </span>
        </div>

        {/* Organizer chip */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${orgColor}, ${orgColor}BB)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jost)",
                fontWeight: 800,
                fontSize: 8,
                color: "white",
              }}
            >
              {initials(trip.organizer_name)}
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: 14,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            with {trip.organizer_name}
          </span>
        </div>

        {/* Includes tags */}
        {trip.includes.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            {trip.includes.map(item => (
              <span
                key={item}
                style={{
                  fontFamily: "var(--font-jost)",
                  fontWeight: 700,
                  fontSize: 9,
                  color: "rgba(255,255,255,0.8)",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 20,
                  padding: "3px 9px",
                  letterSpacing: "0.04em",
                  textTransform: "capitalize",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Bottom row: price + spots + action */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          {/* Price */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 18,
                color: PINK,
              }}
            >
              {formatPrice(trip.price_per_person_cents)}
            </span>
            <span
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                color: "rgba(255,255,255,0.45)",
                marginLeft: 4,
                letterSpacing: "0.04em",
              }}
            >
              / person
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Spots badge */}
            {!isFull && spotsLeft > 0 && (
              <span
                style={{
                  fontFamily: "var(--font-jost)",
                  fontWeight: 700,
                  fontSize: 9,
                  color: "rgba(255,255,255,0.6)",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: "3px 9px",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
              </span>
            )}

            {/* Action button */}
            {isFull ? (
              <button
                onClick={() => onJoin(trip.id)}
                style={{
                  background: joined ? "rgba(217,119,6,0.2)" : "#D97706",
                  color: "white",
                  border: joined ? "1.5px solid #D97706" : "none",
                  borderRadius: 20,
                  fontFamily: "var(--font-jost)",
                  fontWeight: 700,
                  fontSize: 11,
                  padding: "8px 16px",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                  boxShadow: joined ? "none" : "0 4px 16px rgba(217,119,6,0.4)",
                }}
              >
                {joined ? "Waitlisted ✓" : "Join Waitlist"}
              </button>
            ) : (
              <button
                onClick={() => onJoin(trip.id)}
                style={{
                  background: joined ? "rgba(255,31,125,0.15)" : PINK,
                  color: "white",
                  border: joined ? `1.5px solid ${PINK}` : "none",
                  borderRadius: 20,
                  fontFamily: "var(--font-jost)",
                  fontWeight: 700,
                  fontSize: 11,
                  padding: "8px 16px",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                  boxShadow: joined ? "none" : `0 4px 16px ${PINK}55`,
                }}
              >
                {joined ? "Joined ✓" : "Join →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Create Trip Sheet ─────────────────────────────────────────────────────────
function CreateTripSheet({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [capacity, setCapacity] = useState("");
  const [includes, setIncludes] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState("");

  const INCLUDES_OPTIONS = ["Flights", "Hotel", "Activities", "Meals", "Car rental"];

  function toggleInclude(item: string) {
    setIncludes(prev => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    fontFamily: "var(--font-jost)",
    fontSize: 14,
    color: "white",
    background: "rgba(255,255,255,0.08)",
    boxSizing: "border-box",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-jost)",
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.5)",
    marginBottom: 5,
    display: "block",
  };

  function handleLaunch() {
    // In production, convert priceInput dollars → cents and call createBloomTrip
    // For now, close the sheet optimistically
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)",
          zIndex: 70,
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 80,
          background: "linear-gradient(160deg, #0D0820 0%, #1A0830 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderBottom: "none",
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -8px 48px rgba(0,0,0,0.5)",
          maxHeight: "90vh",
          overflowY: "auto",
          paddingBottom: 44,
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        <div style={{ padding: "0 20px" }}>
          {/* Sheet header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "white",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Plan a Bloom Trip
              </p>
              <p
                style={{
                  fontFamily: "var(--font-caveat)",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.4)",
                  margin: "3px 0 0",
                }}
              >
                bring women together, see the world ✦
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.1)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1 1l8 8M9 1l-8 8" />
              </svg>
            </button>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Trip title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Morocco Girls Trip"
              style={inputStyle}
            />
          </div>

          {/* Destination */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Destination</label>
            <input
              type="text"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="e.g. Marrakech, Morocco"
              style={inputStyle}
            />
          </div>

          {/* Departure + Return dates side by side */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Dates</label>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <input
                  type="date"
                  value={departureDate}
                  onChange={e => setDepartureDate(e.target.value)}
                  style={{ ...inputStyle, colorScheme: "dark" }}
                />
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.35)", display: "block", marginTop: 4 }}>Departure</span>
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="date"
                  value={returnDate}
                  onChange={e => setReturnDate(e.target.value)}
                  style={{ ...inputStyle, colorScheme: "dark" }}
                />
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.35)", display: "block", marginTop: 4 }}>Return</span>
              </div>
            </div>
          </div>

          {/* Price per person */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Price per person (USD)</label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-jost)",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.5)",
                  pointerEvents: "none",
                }}
              >
                $
              </span>
              <input
                type="number"
                value={priceInput}
                onChange={e => setPriceInput(e.target.value)}
                placeholder="0"
                min="0"
                style={{ ...inputStyle, paddingLeft: 26 }}
              />
            </div>
          </div>

          {/* Capacity */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Capacity (number of women)</label>
            <input
              type="number"
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              placeholder="e.g. 8"
              min="2"
              max="50"
              style={inputStyle}
            />
          </div>

          {/* Includes checkboxes */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>What&apos;s included</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {INCLUDES_OPTIONS.map(item => {
                const active = includes.has(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleInclude(item)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 20,
                      border: "1.5px solid",
                      borderColor: active ? PINK : "rgba(255,255,255,0.18)",
                      background: active ? `${PINK}20` : "rgba(255,255,255,0.06)",
                      color: active ? PINK : "rgba(255,255,255,0.6)",
                      fontFamily: "var(--font-jost)",
                      fontWeight: 700,
                      fontSize: 11,
                      cursor: "pointer",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Tell women what this trip is about. Vibes, itinerary, what to expect."
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical",
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleLaunch}
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
              boxShadow: `0 6px 28px ${PINK}55`,
            }}
          >
            Launch this trip →
          </button>

          {/* Caveat note */}
          <p
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: 14,
              color: "rgba(255,255,255,0.35)",
              textAlign: "center",
              marginTop: 12,
              lineHeight: 1.4,
            }}
          >
            Bloombay takes 8% to coordinate payments. You keep the rest.
          </p>
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function BloomTripPage() {
  const [activeFilter, setActiveFilter] = useState<"All" | "Open" | "Full">("All");
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [joinedTrips, setJoinedTrips] = useState<Set<string>>(new Set());

  const filters: Array<"All" | "Open" | "Full"> = ["All", "Open", "Full"];

  const filtered = MOCK_TRIPS.filter(trip => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Open") return trip.status !== "full" && trip.attending_count < trip.capacity;
    if (activeFilter === "Full") return trip.status === "full" || trip.attending_count >= trip.capacity;
    return true;
  });

  function handleJoin(tripId: string) {
    setJoinedTrips(prev => {
      const next = new Set(prev);
      next.has(tripId) ? next.delete(tripId) : next.add(tripId);
      return next;
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0D0820 0%, #1A0830 40%, #0D1A20 100%)",
        paddingBottom: 100,
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 54px)",
      }}
    >
      {/* Sticky header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(13,8,32,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "14px 18px 12px",
        }}
      >
        {/* Top row: back + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
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

          <button
            onClick={() => setShowCreateSheet(true)}
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
              boxShadow: `0 4px 16px ${PINK}44`,
            }}
          >
            Plan a trip →
          </button>
        </div>

        {/* Title block */}
        <div style={{ marginBottom: 12 }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 26,
              color: "white",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Bloom Trip
          </h1>
          <p
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: 15,
              color: "rgba(255,255,255,0.4)",
              margin: "3px 0 0",
            }}
          >
            travel with women who get it ✦
          </p>
        </div>

        {/* Filter chips */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {filters.map(f => {
            const active = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  flexShrink: 0,
                  padding: "5px 16px",
                  borderRadius: 20,
                  border: "1.5px solid",
                  borderColor: active ? PINK : "rgba(255,255,255,0.18)",
                  background: active ? PINK : "rgba(255,255,255,0.06)",
                  color: active ? "white" : "rgba(255,255,255,0.55)",
                  fontFamily: "var(--font-jost)",
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                  boxShadow: active ? `0 3px 12px ${PINK}44` : "none",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trip cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "16px 16px 0",
        }}
      >
        {filtered.map(trip => (
          <TripCard
            key={trip.id}
            trip={trip}
            joined={joinedTrips.has(trip.id)}
            onJoin={handleJoin}
          />
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "56px 24px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-caveat)",
                fontSize: 20,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              No trips here right now.
            </p>
            <p
              style={{
                fontFamily: "var(--font-caveat)",
                fontSize: 15,
                color: "rgba(255,255,255,0.2)",
                marginTop: 4,
              }}
            >
              Be the first to plan one.
            </p>
          </div>
        )}
      </div>

      {/* Create trip sheet */}
      {showCreateSheet && <CreateTripSheet onClose={() => setShowCreateSheet(false)} />}
    </div>
  );
}
