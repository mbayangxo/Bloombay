"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Reservation {
  id: string;
  date: string;
  time: string;
  party_size: number;
  status?: string;
}

interface VenueData {
  venue: {
    name: string;
    neighborhood: string;
    bloom_rating: number;
    restaurant_type: string;
    instagram: string;
  };
  upcoming: Reservation[];
  pending: Reservation[];
}

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";

const QUICK_LINKS = [
  { href: "/partner/dashboard", label: "Dashboard" },
  { href: "/partner/bookings", label: "Bookings" },
  { href: "/partner/gallery", label: "Gallery" },
  { href: "/partner/analytics", label: "Analytics" },
  { href: "/partner/settings", label: "Settings" },
];

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export function PartnerDesktopRightPanel() {
  const pathname = usePathname();
  const [data, setData] = useState<VenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partner-portal/my-venue")
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json) setData(json);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const venue = data?.venue;
  const upcoming = data?.upcoming ?? [];
  const pending = data?.pending ?? [];

  return (
    <aside
      className="hidden xl:flex flex-col fixed right-0 top-0 h-full overflow-y-auto z-40"
      style={{
        width: 260,
        background: "#FEFCF7",
        borderLeft: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      {/* ── Venue header ── */}
      <div
        style={{
          padding: 24,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(0,0,0,0.3)",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          YOUR VENUE
        </p>
        <p
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: 18,
            color: DARK,
            lineHeight: 1.2,
          }}
        >
          {venue?.name ?? "Your Venue"}
        </p>
        {venue?.neighborhood && (
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 9,
              color: "rgba(0,0,0,0.4)",
              marginTop: 4,
            }}
          >
            {venue.neighborhood}
          </p>
        )}
        {venue?.bloom_rating != null && venue.bloom_rating > 0 && (
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 11,
              fontWeight: 700,
              color: PINK,
              marginTop: 6,
            }}
          >
            ★ {venue.bloom_rating}
          </p>
        )}
      </div>

      {/* ── Stats tiles ── */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[52px] rounded-lg"
                style={{ background: "rgba(255,31,125,0.06)" }}
              />
            ))
          ) : (
            <>
              {/* Upcoming confirmed */}
              <StatTile
                value={upcoming.length}
                label="UPCOMING"
                pink={false}
              />
              {/* Pending requests */}
              <StatTile
                value={pending.length}
                label="PENDING"
                pink={pending.length > 0}
              />
              {/* Rating */}
              <StatTile
                value={venue?.bloom_rating ? venue.bloom_rating : "—"}
                label="BLOOM RATING"
                pink={false}
              />
              {/* Type */}
              <StatTile
                value={
                  venue?.restaurant_type
                    ? venue.restaurant_type.split(" ")[0]
                    : "—"
                }
                label="TYPE"
                pink={false}
              />
            </>
          )}
        </div>
      </div>

      {/* ── Upcoming reservations ── */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(0,0,0,0.3)",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          NEXT RESERVATIONS
        </p>

        {upcoming.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: 13,
              color: "rgba(0,0,0,0.3)",
            }}
          >
            No confirmed bookings yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming.slice(0, 3).map((r) => (
              <div key={r.id}>
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 9,
                    color: DARK,
                    lineHeight: 1.4,
                  }}
                >
                  {formatDate(r.date)} · {r.time}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 9,
                    color: "rgba(0,0,0,0.4)",
                  }}
                >
                  · {r.party_size} guests
                </p>
              </div>
            ))}
          </div>
        )}

        {upcoming.length > 0 && (
          <Link
            href="/partner/bookings"
            style={{
              display: "inline-block",
              marginTop: 12,
              fontFamily: "var(--font-jost)",
              fontSize: 8,
              letterSpacing: "0.15em",
              color: PINK,
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            SEE ALL →
          </Link>
        )}
      </div>

      {/* ── Quick links ── */}
      <div style={{ padding: "20px 24px" }}>
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(0,0,0,0.3)",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          QUICK NAV
        </p>
        {QUICK_LINKS.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                color: active ? DARK : "rgba(0,0,0,0.35)",
                fontWeight: active ? 700 : 400,
                padding: "8px 0",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

function StatTile({
  value,
  label,
  pink,
}: {
  value: string | number;
  label: string;
  pink: boolean;
}) {
  return (
    <div
      style={{
        background: "rgba(255,31,125,0.04)",
        borderRadius: 10,
        padding: 12,
        border: "1px solid rgba(255,31,125,0.06)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: 22,
          color: pink ? PINK : DARK,
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: 7,
          letterSpacing: "0.15em",
          color: "rgba(0,0,0,0.3)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
    </div>
  );
}
