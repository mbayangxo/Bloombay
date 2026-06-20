"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ClubData {
  name: string;
  tagline: string;
  member_count: number;
  member_limit: number;
  pending_applications: number;
  upcoming_gatherings: number;
}

interface Gathering {
  id: string;
  title: string;
  date: string;
  venue: string;
  seats: number;
}

interface PendingApplicant {
  id: string;
  name: string;
  applied_at?: string;
}

interface GatheringsResponse {
  upcoming: Gathering[];
}

const PINK = "#FF1F7D";

const QUICK_ACCESS = [
  { href: "/club-owner/requests", label: "Applications", badge: true },
  { href: "/club-owner/happenings/new", label: "New Gathering" },
  { href: "/club-owner/updates/new", label: "Post Update" },
  { href: "/club-owner/women", label: "All Members" },
  { href: "/member", label: "Member Portal" },
];

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function formatGatheringDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const hour = d.getHours();
    const ampm = hour >= 12 ? "pm" : "am";
    const h = hour % 12 || 12;
    return `${months[d.getMonth()]} ${d.getDate()} · ${h}${ampm}`;
  } catch {
    return dateStr;
  }
}

function daysAgoLabel(isoString?: string): string {
  if (!isoString) return "";
  const diffDays = Math.floor((Date.now() - new Date(isoString).getTime()) / 86400000);
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

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

function AvatarCircle({ size, name }: { size: number; name: string }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #FF1F7D, #FF9ECA)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: size * 0.4,
          fontWeight: 700,
          color: "white",
        }}
      >
        {initial}
      </span>
    </div>
  );
}

export function ClubDesktopRightPanel() {
  const pathname = usePathname();
  const [club, setClub] = useState<ClubData | null>(null);
  const [gatherings, setGatherings] = useState<Gathering[]>([]);
  const [pendingApplicants, setPendingApplicants] = useState<PendingApplicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/club-portal/my-club").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/club-portal/gatherings").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([clubData, gatheringsData]) => {
        const cd = clubData as (ClubData & { error?: string }) | null;
        if (cd && !cd.error) {
          setClub(cd);
        }
        const gd = gatheringsData as GatheringsResponse | null;
        if (gd?.upcoming) {
          setGatherings(gd.upcoming);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch pending applicants separately for detail rows
  useEffect(() => {
    fetch("/api/club-portal/applications?status=pending")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.applications) setPendingApplicants(d.applications);
        else if (Array.isArray(d)) setPendingApplicants(d);
      })
      .catch(() => {});
  }, []);

  const nextGathering = gatherings[0] ?? null;
  const days = nextGathering ? daysUntil(nextGathering.date) : null;
  const pendingCount = club?.pending_applications ?? 0;
  const displayApplicants = pendingApplicants.slice(0, 3);
  const extraApplicants = pendingCount - 3;

  // Newest member proxy: use upcoming_gatherings count as availability signal
  const hasNewestMember = (club?.member_count ?? 0) > 0;

  return (
    <aside
      className="hidden lg:flex flex-col fixed right-0 top-0 h-full overflow-y-auto z-40"
      style={{
        width: 260,
        background: "#111111",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* CLUB HEADER */}
      <div
        style={{
          padding: 24,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {loading ? (
          <SkeletonBar width="75%" height={20} />
        ) : (
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: 18,
              color: "white",
              lineHeight: 1.2,
            }}
          >
            {club?.name ?? "Your Club"}
          </div>
        )}
      </div>

      {/* NEXT GATHERING */}
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
            marginBottom: 12,
          }}
        >
          NEXT GATHERING
        </div>

        {loading ? (
          <>
            <SkeletonBar width="30%" height={48} />
            <SkeletonBar width="60%" height={14} />
            <SkeletonBar width="80%" height={10} />
          </>
        ) : nextGathering && days !== null ? (
          <>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: 48,
                color: PINK,
                lineHeight: 1,
                marginBottom: 2,
              }}
            >
              {days >= 0 ? days : 0}
            </div>
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 7,
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              DAYS AWAY
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: 14,
                color: "white",
                lineHeight: 1.3,
                marginBottom: 4,
              }}
            >
              {nextGathering.title}
            </div>
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 2,
              }}
            >
              {formatGatheringDate(nextGathering.date)}
              {nextGathering.venue ? ` · ${nextGathering.venue}` : ""}
            </div>
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                marginBottom: 14,
              }}
            >
              {club?.member_count ?? 0} attending · {nextGathering.seats} open
            </div>

            {/* Ghost button */}
            <Link
              href={`/club-owner/happenings/${nextGathering.id}/remind`}
              style={{
                display: "block",
                textAlign: "center",
                fontFamily: "'Jost', sans-serif",
                fontSize: 8,
                letterSpacing: "0.12em",
                color: PINK,
                textDecoration: "none",
                textTransform: "uppercase",
                padding: "8px 12px",
                border: "1px solid rgba(255,31,125,0.3)",
                background: "rgba(255,31,125,0.08)",
                borderRadius: 9999,
              }}
            >
              REMIND MEMBERS →
            </Link>
          </>
        ) : (
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: 13,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            No gatherings scheduled.
          </div>
        )}
      </div>

      {/* APPLICATIONS */}
      {!loading && pendingCount > 0 && (
        <div
          style={{
            padding: 24,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: "white",
              marginBottom: 12,
            }}
          >
            {pendingCount} want to join
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {displayApplicants.map((a) => (
              <div
                key={a.id}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <AvatarCircle size={28} name={a.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 12,
                      color: "white",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.name}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.3)",
                    flexShrink: 0,
                  }}
                >
                  {daysAgoLabel(a.applied_at)}
                </div>
              </div>
            ))}
          </div>

          {extraApplicants > 0 && (
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                marginTop: 8,
              }}
            >
              + {extraApplicants} more
            </div>
          )}

          <Link
            href="/club-owner/requests"
            style={{
              display: "inline-block",
              marginTop: 10,
              fontFamily: "'Jost', sans-serif",
              fontSize: 9,
              letterSpacing: "0.12em",
              color: PINK,
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            REVIEW ALL →
          </Link>
        </div>
      )}

      {/* NEWEST MEMBER */}
      {!loading && hasNewestMember && (
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
              marginBottom: 12,
            }}
          >
            NEWEST MEMBER
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AvatarCircle size={36} name="M" />
            <div>
              <div
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "white",
                  marginBottom: 2,
                }}
              >
                New Member
              </div>
              <div
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                Joined recently
              </div>
            </div>
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: 11,
              color: PINK,
              marginTop: 8,
            }}
          >
            Welcome her ♡
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
          const hasBadge = link.badge && pendingCount > 0;

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
                color: active ? "white" : "rgba(255,255,255,0.3)",
                fontWeight: active ? 600 : 400,
                padding: "9px 0",
                borderBottom:
                  i === QUICK_ACCESS.length - 1
                    ? "none"
                    : "0.5px solid rgba(255,255,255,0.05)",
                textDecoration: "none",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {link.label}
                {hasBadge && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: PINK,
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 8,
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
              </span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>›</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
