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

const QUICK_LINKS = [
  { href: "/admin/dashboard",    label: "Dashboard" },
  { href: "/admin/members",      label: "Members" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/events",       label: "Events" },
  { href: "/admin/clubs",        label: "Clubs" },
  { href: "/admin/analytics",    label: "Analytics" },
];

function StatRow({
  value,
  label,
  loading,
  highlight,
}: {
  value: number;
  label: string;
  loading: boolean;
  highlight?: boolean;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      {loading ? (
        <div
          style={{
            height: 28,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 4,
            marginBottom: 6,
          }}
        />
      ) : (
        <div
          style={{
            fontFamily: "Playfair Display, serif",
            fontStyle: "italic",
            fontSize: 28,
            color: highlight && value > 0 ? "#FF1F7D" : "white",
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          {value}
        </div>
      )}
      <div
        style={{
          fontFamily: "Jost, sans-serif",
          fontSize: 7,
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export function AdminDesktopRightPanel() {
  const pathname = usePathname();
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/quick-stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <aside
      className="hidden lg:flex flex-col fixed right-0 top-0 h-full overflow-y-auto"
      style={{
        width: 260,
        background: "#111111",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        zIndex: 40,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 24,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontFamily: "Jost, sans-serif",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          SYSTEM
        </div>
        <div
          style={{
            fontFamily: "Playfair Display, serif",
            fontStyle: "italic",
            fontSize: 18,
            color: "white",
          }}
        >
          Live Stats
        </div>
      </div>

      {/* Stats section */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <StatRow
          value={stats?.totalMembers ?? 0}
          label="Members Total"
          loading={loading}
        />
        <StatRow
          value={stats?.newThisWeek ?? 0}
          label="New This Week"
          loading={loading}
        />
        <StatRow
          value={stats?.pendingApplications ?? 0}
          label="Pending Applications"
          loading={loading}
          highlight
        />
        <StatRow
          value={stats?.activeClubs ?? 0}
          label="Active Clubs"
          loading={loading}
        />
        <StatRow
          value={stats?.upcomingEvents ?? 0}
          label="Upcoming Events"
          loading={loading}
        />

        {!loading && stats && stats.pendingApplications > 0 && (
          <Link
            href="/admin/applications"
            style={{
              display: "inline-block",
              marginTop: 4,
              fontFamily: "Jost, sans-serif",
              fontSize: 9,
              letterSpacing: "0.12em",
              color: "#FF1F7D",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            Review applications →
          </Link>
        )}
      </div>

      {/* Quick links section */}
      <div style={{ padding: "20px 24px" }}>
        <div
          style={{
            fontFamily: "Jost, sans-serif",
            fontSize: 7,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          QUICK NAV
        </div>
        <div>
          {QUICK_LINKS.map((link, i) => {
            const active =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <QuickLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={active}
                last={i === QUICK_LINKS.length - 1}
              />
            );
          })}
        </div>
      </div>
    </aside>
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
        display: "block",
        fontFamily: "Jost, sans-serif",
        fontSize: 9,
        letterSpacing: "0.12em",
        color: active
          ? "white"
          : hovered
          ? "rgba(255,255,255,0.7)"
          : "rgba(255,255,255,0.35)",
        fontWeight: active ? 700 : 400,
        padding: "8px 0",
        borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.04)",
        textDecoration: "none",
        textTransform: "uppercase",
        transition: "color 0.15s ease",
      }}
    >
      {label}
    </Link>
  );
}
