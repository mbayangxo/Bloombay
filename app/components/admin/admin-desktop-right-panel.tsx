"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface QuickStats {
  totalMembers: number;
  pendingApplications: number;
  activeClubs: number;
  newThisWeek: number;
  upcomingEvents: number;
}

const PINK = "#FF1F7D";

function formatTodayDate(): string {
  const d = new Date();
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];
  return `${days[d.getDay()]} · ${d.getDate()} ${months[d.getMonth()]}`;
}

const QUICK_ACCESS = [
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/members", label: "Women" },
  { href: "/admin/clubs", label: "Clubs" },
  { href: "/admin/mailroom", label: "Mailroom" },
  { href: "/admin/safety", label: "Safety" },
];

function SkeletonBar({ width = "60%", height = 14 }: { width?: string; height?: number }) {
  return (
    <div
      style={{
        height,
        width,
        background: "rgba(255,255,255,0.06)",
        borderRadius: 3,
        marginBottom: 4,
      }}
    />
  );
}

function QuickLink({
  href,
  label,
  active,
  last,
}: {
  href: string;
  label: string;
  active: boolean;
  last: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "'Jost', sans-serif",
        fontSize: 9,
        letterSpacing: "0.1em",
        color: active
          ? "white"
          : hovered
          ? "rgba(255,255,255,0.6)"
          : "rgba(255,255,255,0.3)",
        fontWeight: active ? 600 : 400,
        padding: "9px 0",
        borderBottom: last ? "none" : "0.5px solid rgba(255,255,255,0.05)",
        textDecoration: "none",
        transition: "color 0.15s ease",
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>›</span>
    </Link>
  );
}

export function AdminDesktopRightPanel() {
  const pathname = usePathname();
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/quick-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pending = stats?.pendingApplications ?? 0;
  const newThisWeek = stats?.newThisWeek ?? 0;
  const totalMembers = stats?.totalMembers ?? 0;
  const upcomingEvents = stats?.upcomingEvents ?? 0;

  return (
    <aside
      className="hidden xl:flex flex-col fixed right-0 top-0 h-full overflow-y-auto z-40"
      style={{
        width: 260,
        background: "#111111",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* DATE + GREETING */}
      <div
        style={{
          padding: 24,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {formatTodayDate()}
        </div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: 17,
            color: "white",
            lineHeight: 1.2,
          }}
        >
          Here&apos;s your platform.
        </div>
      </div>

      {/* NEEDS ACTION */}
      <div
        style={{
          padding: 24,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          NEEDS ACTION
        </div>

        {/* Applications */}
        <div
          style={{
            paddingLeft: 10,
            borderLeft: `2px solid ${PINK}`,
            marginBottom: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <SkeletonBar width="70%" />
            ) : (
              <div
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 11,
                  color: "white",
                  fontWeight: 500,
                  marginBottom: 3,
                }}
              >
                {pending} membership applications
              </div>
            )}
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 9,
                color: "rgba(255,255,255,0.35)",
                fontStyle: "italic",
              }}
            >
              Don&apos;t keep women waiting
            </div>
          </div>
          <Link
            href="/admin/applications"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 8,
              letterSpacing: "0.12em",
              color: PINK,
              textDecoration: "none",
              textTransform: "uppercase",
              flexShrink: 0,
              marginLeft: 8,
              marginTop: 1,
            }}
          >
            REVIEW →
          </Link>
        </div>

        {/* Safety reports — only if upcomingEvents > 0 */}
        {!loading && upcomingEvents > 0 && (
          <div
            style={{
              paddingLeft: 10,
              borderLeft: `2px solid ${PINK}`,
              marginBottom: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 11,
                  color: "white",
                  fontWeight: 500,
                  marginBottom: 3,
                }}
              >
                Safety reports
              </div>
              <div
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.35)",
                  fontStyle: "italic",
                }}
              >
                Awaiting moderation
              </div>
            </div>
            <Link
              href="/admin/safety"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 8,
                letterSpacing: "0.12em",
                color: PINK,
                textDecoration: "none",
                textTransform: "uppercase",
                flexShrink: 0,
                marginLeft: 8,
                marginTop: 1,
              }}
            >
              VIEW →
            </Link>
          </div>
        )}

        {/* Revenue & billing — always shown */}
        <div
          style={{
            paddingLeft: 10,
            borderLeft: `2px solid ${PINK}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                color: "white",
                fontWeight: 500,
                marginBottom: 3,
              }}
            >
              Revenue &amp; billing
            </div>
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 9,
                color: "rgba(255,255,255,0.35)",
                fontStyle: "italic",
              }}
            >
              Check payouts and failed payments
            </div>
          </div>
          <Link
            href="/admin/billing"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 8,
              letterSpacing: "0.12em",
              color: PINK,
              textDecoration: "none",
              textTransform: "uppercase",
              flexShrink: 0,
              marginLeft: 8,
              marginTop: 1,
            }}
          >
            PAYOUTS →
          </Link>
        </div>
      </div>

      {/* TODAY ON THE PLATFORM */}
      <div
        style={{
          padding: 24,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          TODAY ON THE PLATFORM
        </div>

        {/* New This Week */}
        <div style={{ marginBottom: 16 }}>
          {loading ? (
            <SkeletonBar width="40%" height={26} />
          ) : (
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: 26,
                color: "white",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {newThisWeek}
            </div>
          )}
          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 7,
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
            }}
          >
            NEW THIS WEEK
          </div>
        </div>

        {/* Total Members */}
        <div style={{ marginBottom: 16 }}>
          {loading ? (
            <SkeletonBar width="55%" height={26} />
          ) : (
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: 26,
                color: "white",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {totalMembers}
            </div>
          )}
          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 7,
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
            }}
          >
            TOTAL MEMBERS
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          {loading ? (
            <SkeletonBar width="45%" height={26} />
          ) : (
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: 26,
                color: "white",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {upcomingEvents}
            </div>
          )}
          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 7,
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
            }}
          >
            UPCOMING EVENTS
          </div>
        </div>
      </div>

      {/* QUICK ACCESS */}
      <div style={{ padding: 24 }}>
        <div
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.25)",
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
            <QuickLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={active}
              last={i === QUICK_ACCESS.length - 1}
            />
          );
        })}
      </div>
    </aside>
  );
}
