"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface OverviewData {
  clubs: unknown[];
  memberships: unknown[];
  pending_applications: unknown[];
  upcoming_gatherings: Array<{ title: string; starts_at: string }>;
}

const QUICK_LINKS = [
  { href: "/curator/dashboard", label: "Dashboard" },
  { href: "/curator/events", label: "Events" },
  { href: "/curator/clubs", label: "Clubs" },
  { href: "/curator/members", label: "Members" },
  { href: "/curator/analytics", label: "Analytics" },
  { href: "/curator/promote", label: "Promote" },
];

function formatGatheringDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const hour = d.getHours();
    const ampm = hour >= 12 ? "pm" : "am";
    const hour12 = hour % 12 || 12;
    return `${month} ${day} · ${hour12}${ampm}`;
  } catch {
    return "";
  }
}

export function CuratorDesktopRightPanel() {
  const pathname = usePathname();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/curator/overview")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const clubs = data?.clubs ?? [];
  const memberships = data?.memberships ?? [];
  const pending = data?.pending_applications ?? [];
  const gatherings = data?.upcoming_gatherings ?? [];
  const topGatherings = gatherings.slice(0, 3);

  return (
    <aside
      className="hidden lg:flex flex-col fixed right-0 top-0 h-full overflow-y-auto z-40"
      style={{
        width: 260,
        background: "#111111",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0"
        style={{
          padding: "24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          CURATOR
        </p>
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: 18,
            color: "white",
            margin: 0,
          }}
        >
          Overview
        </p>
      </div>

      {/* Live counts */}
      <div
        className="flex-shrink-0"
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {loading ? (
            <>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[52px] rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              ))}
            </>
          ) : (
            <>
              {/* Clubs */}
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 10,
                  padding: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 24,
                    color: "white",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {clubs.length}
                </p>
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 7,
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    margin: "4px 0 0",
                  }}
                >
                  CLUBS
                </p>
              </div>

              {/* New Members */}
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 10,
                  padding: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 24,
                    color: "white",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {memberships.length}
                </p>
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 7,
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    margin: "4px 0 0",
                  }}
                >
                  NEW JOINS
                </p>
              </div>

              {/* Pending Apps */}
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 10,
                  padding: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 24,
                    color: pending.length > 0 ? "#FF1F7D" : "white",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {pending.length}
                </p>
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 7,
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    margin: "4px 0 0",
                  }}
                >
                  PENDING
                </p>
              </div>

              {/* Upcoming Gatherings count */}
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 10,
                  padding: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 24,
                    color: "white",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {gatherings.length}
                </p>
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 7,
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    margin: "4px 0 0",
                  }}
                >
                  GATHERINGS
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upcoming gatherings list */}
      <div
        className="flex-shrink-0"
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          UPCOMING
        </p>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-8 rounded-md"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
            ))}
          </div>
        ) : topGatherings.length === 0 ? (
          <p
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 13,
              color: "rgba(255,255,255,0.25)",
              margin: 0,
            }}
          >
            Nothing scheduled.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {topGatherings.map((g, i) => (
              <div key={i}>
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 10,
                    color: "white",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {g.title}
                </p>
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 8,
                    color: "rgba(255,255,255,0.35)",
                    margin: "3px 0 0",
                  }}
                >
                  {formatGatheringDate(g.starts_at)}
                </p>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/curator/dashboard?tab=gatherings"
          style={{
            display: "inline-block",
            marginTop: 14,
            fontFamily: "'Jost', sans-serif",
            fontSize: 8,
            color: "#FF1F7D",
            letterSpacing: "0.08em",
            textDecoration: "none",
          }}
        >
          VIEW ALL →
        </Link>
      </div>

      {/* Quick links */}
      <div
        className="flex-1"
        style={{ padding: "20px 24px" }}
      >
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          QUICK NAV
        </p>

        <div className="flex flex-col">
          {QUICK_LINKS.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(link.href + "?");
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 9,
                  color: active ? "white" : "rgba(255,255,255,0.35)",
                  fontWeight: active ? 700 : 400,
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
