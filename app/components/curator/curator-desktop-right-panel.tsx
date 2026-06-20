"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PendingApplicant {
  id: string;
  name: string;
  applied_at?: string;
  avatar_url?: string;
}

interface UpcomingGathering {
  title: string;
  starts_at: string;
}

interface OverviewData {
  clubs: unknown[];
  memberships: unknown[];
  pending_applications: PendingApplicant[];
  upcoming_gatherings: UpcomingGathering[];
}

const PINK = "#FF1F7D";

const QUICK_ACCESS = [
  { href: "/curator/applications", label: "Review Applications", badge: true },
  { href: "/curator/gatherings/new", label: "New Gathering" },
  { href: "/curator/updates/new", label: "Post Update" },
  { href: "/curator/clubs", label: "All Clubs" },
  { href: "/member", label: "Member Portal" },
];

function daysUntil(isoString: string): number {
  return Math.ceil((new Date(isoString).getTime() - Date.now()) / 86400000);
}

function timeAgo(isoString?: string): string {
  if (!isoString) return "";
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

function formatGatheringDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const hour = d.getHours();
    const ampm = hour >= 12 ? "pm" : "am";
    const h = hour % 12 || 12;
    return `${months[d.getMonth()]} ${d.getDate()} · ${h}${ampm}`;
  } catch {
    return "";
  }
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

function InitialAvatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <div
      style={{
        width: 28,
        height: 28,
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
          fontSize: 11,
          fontWeight: 700,
          color: "white",
        }}
      >
        {initial}
      </span>
    </div>
  );
}

export function CuratorDesktopRightPanel() {
  const pathname = usePathname();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/curator/overview")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pending = data?.pending_applications ?? [];
  const gatherings = data?.upcoming_gatherings ?? [];
  const nextGathering = gatherings[0] ?? null;
  const daysAway = nextGathering ? daysUntil(nextGathering.starts_at) : null;

  return (
    <aside
      className="hidden xl:flex flex-col fixed right-0 top-0 h-full overflow-y-auto z-40"
      style={{
        width: 260,
        background: "#111111",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* CURATOR HEADER */}
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
            marginBottom: 6,
          }}
        >
          CURATOR
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
          Your clubs.
        </div>
      </div>

      {/* APPLICATIONS */}
      <div
        style={{
          padding: 24,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {loading ? (
          <>
            <SkeletonBar width="65%" height={18} />
            <SkeletonBar width="80%" height={32} />
            <SkeletonBar width="80%" height={32} />
          </>
        ) : pending.length === 0 ? (
          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              fontStyle: "italic",
            }}
          >
            All caught up.
          </div>
        ) : (
          <>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: 17,
                color: PINK,
                marginBottom: 14,
              }}
            >
              {pending.length} women want in.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pending.slice(0, 3).map((applicant) => (
                <div
                  key={applicant.id}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <InitialAvatar name={applicant.name} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "white",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {applicant.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 10,
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      wants to join
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 9,
                      color: "rgba(255,255,255,0.3)",
                      flexShrink: 0,
                    }}
                  >
                    {timeAgo(applicant.applied_at)}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/curator/applications"
              style={{
                display: "inline-block",
                marginTop: 12,
                fontFamily: "'Jost', sans-serif",
                fontSize: 8,
                letterSpacing: "0.12em",
                color: PINK,
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              SEE ALL →
            </Link>
          </>
        )}
      </div>

      {/* NEXT GATHERING */}
      {!loading && nextGathering && (
        <div
          style={{
            padding: 24,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {daysAway !== null && daysAway >= 0 && (
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 8,
                letterSpacing: "0.18em",
                color: PINK,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              IN {daysAway} DAYS
            </div>
          )}
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
            }}
          >
            {formatGatheringDate(nextGathering.starts_at)}
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
          const hasBadge = link.badge && pending.length > 0;

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
                    {pending.length}
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
