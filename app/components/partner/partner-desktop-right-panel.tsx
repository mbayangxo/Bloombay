"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Booking {
  id: string;
  date: string;
  time: string;
  party_size: number;
  status?: string;
  notes?: string;
  name?: string;
}

interface VenueData {
  venue: {
    name: string;
    neighborhood: string;
    bloom_rating?: number;
  };
  upcoming: Booking[];
  pending: Booking[];
}

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";

const QUICK_ACCESS = [
  { href: "/partner/bookings", label: "Full Schedule" },
  { href: "/partner/requests", label: "Booking Requests" },
  { href: "/partner/analytics", label: "Analytics" },
  { href: "/partner/settings", label: "Venue Settings" },
];

function isToday(dateStr: string): boolean {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  } catch {
    return false;
  }
}

function formatTodayLabel(): string {
  const d = new Date();
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function SkeletonBar({ width = "60%", height = 14 }: { width?: string; height?: number }) {
  return (
    <div
      style={{
        height,
        width,
        background: "rgba(0,0,0,0.07)",
        borderRadius: 3,
        marginBottom: 4,
      }}
    />
  );
}

export function PartnerDesktopRightPanel() {
  const pathname = usePathname();
  const [data, setData] = useState<VenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partner-portal/my-venue")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json) setData(json);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const venue = data?.venue;
  const upcoming = data?.upcoming ?? [];
  const pending = data?.pending ?? [];
  const todaysBookings = upcoming.filter((b) => isToday(b.date)).slice(0, 4);

  return (
    <aside
      className="hidden xl:flex flex-col fixed right-0 top-0 h-full overflow-y-auto z-40"
      style={{
        width: 260,
        background: "#FEFCF7",
        borderLeft: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      {/* VENUE HEADER */}
      <div
        style={{
          padding: 24,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(0,0,0,0.3)",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          YOUR VENUE
        </div>

        {loading ? (
          <>
            <SkeletonBar width="80%" height={18} />
            <SkeletonBar width="50%" height={10} />
          </>
        ) : (
          <>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: 18,
                color: DARK,
                lineHeight: 1.2,
                marginBottom: 4,
              }}
            >
              {venue?.name ?? "Your Venue"}
            </div>
            {venue?.neighborhood && (
              <div
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 9,
                  color: "rgba(0,0,0,0.4)",
                  marginBottom: 4,
                }}
              >
                {venue.neighborhood}
              </div>
            )}
            {venue?.bloom_rating != null && venue.bloom_rating > 0 && (
              <div
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: PINK,
                }}
              >
                ✦ {venue.bloom_rating}
              </div>
            )}
          </>
        )}
      </div>

      {/* TODAY'S TABLE */}
      <div
        style={{
          padding: 24,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 7,
              letterSpacing: "0.2em",
              color: "rgba(0,0,0,0.3)",
              textTransform: "uppercase",
            }}
          >
            TODAY
          </div>
          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 7,
              color: "rgba(0,0,0,0.3)",
              letterSpacing: "0.1em",
            }}
          >
            {formatTodayLabel()}
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[0, 1, 2].map((i) => (
              <SkeletonBar key={i} width="90%" height={32} />
            ))}
          </div>
        ) : todaysBookings.length === 0 ? (
          <div
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 13,
              color: "rgba(0,0,0,0.3)",
            }}
          >
            No bookings today.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {todaysBookings.map((b) => (
              <div key={b.id}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <div
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: PINK,
                      flexShrink: 0,
                    }}
                  >
                    {b.time}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: DARK,
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {b.name ?? "Guest"}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 10,
                      color: "rgba(0,0,0,0.4)",
                      flexShrink: 0,
                    }}
                  >
                    {b.party_size} guests
                  </div>
                </div>
                {b.notes && (
                  <div
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 10,
                      fontStyle: "italic",
                      color: "rgba(0,0,0,0.4)",
                      marginTop: 2,
                      paddingLeft: 0,
                    }}
                  >
                    {b.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PENDING REQUESTS — only if pending.length > 0 */}
      {!loading && pending.length > 0 && (
        <div
          style={{
            padding: 24,
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 7,
              letterSpacing: "0.2em",
              color: "rgba(0,0,0,0.3)",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            PENDING REQUESTS
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: 14,
                color: DARK,
              }}
            >
              {pending.length} request{pending.length !== 1 ? "s" : ""} waiting
            </div>
            <Link
              href="/partner/requests"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 8,
                letterSpacing: "0.12em",
                color: PINK,
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              REVIEW →
            </Link>
          </div>
        </div>
      )}

      {/* BLOOM RATING — only if venue has rating */}
      {!loading && venue?.bloom_rating != null && venue.bloom_rating > 0 && (
        <div
          style={{
            padding: 24,
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: 36,
              color: PINK,
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            {venue.bloom_rating}
          </div>
          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 7,
              letterSpacing: "0.2em",
              color: "rgba(0,0,0,0.3)",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            YOUR BLOOM RATING
          </div>
          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 9,
              color: "rgba(0,0,0,0.35)",
              fontStyle: "italic",
            }}
          >
            Based on member reviews
          </div>
        </div>
      )}

      {/* QUICK ACCESS */}
      <div style={{ padding: 24 }}>
        <div
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(0,0,0,0.25)",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          QUICK ACCESS
        </div>

        {QUICK_ACCESS.map((link, i) => {
          const active =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "'Jost', sans-serif",
                fontSize: 9,
                letterSpacing: "0.1em",
                color: active ? DARK : "rgba(0,0,0,0.35)",
                fontWeight: active ? 600 : 400,
                padding: "9px 0",
                borderBottom:
                  i === QUICK_ACCESS.length - 1
                    ? "none"
                    : "0.5px solid rgba(0,0,0,0.05)",
                textDecoration: "none",
              }}
            >
              <span>{link.label}</span>
              <span style={{ fontSize: 10, color: "rgba(0,0,0,0.2)" }}>›</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
