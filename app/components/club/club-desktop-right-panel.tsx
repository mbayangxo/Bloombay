"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ClubData {
  name: string;
  tagline: string;
  primary_color: string;
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

const QUICK_LINKS = [
  { href: "/club-owner/dashboard",  label: "YOUR CLUB" },
  { href: "/club-owner/women",      label: "OUR WOMEN" },
  { href: "/club-owner/happenings", label: "GATHERINGS" },
  { href: "/club-owner/requests",   label: "APPLICATIONS" },
  { href: "/club-owner/finances",   label: "TREASURY" },
  { href: "/club-owner/settings",   label: "SETTINGS" },
];

function formatGatheringDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const hour = d.getHours();
    const ampm = hour >= 12 ? "pm" : "am";
    const h = hour % 12 || 12;
    return `${month} ${day} · ${h}${ampm}`;
  } catch {
    return dateStr;
  }
}

export function ClubDesktopRightPanel() {
  const pathname = usePathname();
  const [club, setClub] = useState<ClubData | null>(null);
  const [gatherings, setGatherings] = useState<Gathering[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/club-portal/my-club").then(r => r.ok ? r.json() : null),
      fetch("/api/club-portal/gatherings").then(r => r.ok ? r.json() : null),
    ]).then(([clubData, gatheringsData]) => {
      if (clubData && !clubData.error) setClub(clubData as ClubData);
      if (gatheringsData?.upcoming) setGatherings(gatheringsData.upcoming as Gathering[]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <aside
      className="hidden lg:flex flex-col fixed right-0 top-0 h-full overflow-y-auto z-40"
      style={{ width: 260, background: "#111111", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Club Header */}
      <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 8 }}>
          YOUR CLUB
        </p>
        <p style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 18, color: "white", fontStyle: "italic", textTransform: "uppercase", lineHeight: 1.2 }}>
          {club?.name ?? "YOUR CLUB"}
        </p>
        {club?.tagline ? (
          <p style={{ fontFamily: "var(--font-caveat, cursive)", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
            {club.tagline}
          </p>
        ) : null}
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>
          {club?.member_count ?? 0} members
        </p>
      </div>

      {/* Stats Tiles */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="grid grid-cols-2 gap-2">
          {loading ? (
            <>
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="h-[52px] rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }} />
              ))}
            </>
          ) : (
            <>
              {/* Members */}
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 24, color: "white", lineHeight: 1 }}>
                  {club?.member_count ?? 0}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(255,255,255,0.3)", marginTop: 4, letterSpacing: "0.1em" }}>
                  MEMBERS
                </p>
              </div>

              {/* Capacity */}
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 24, color: "white", lineHeight: 1 }}>
                  {club?.member_limit === 0 ? "∞" : (club?.member_limit ?? 0)}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(255,255,255,0.3)", marginTop: 4, letterSpacing: "0.1em" }}>
                  CAPACITY
                </p>
              </div>

              {/* Pending */}
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 24, color: (club?.pending_applications ?? 0) > 0 ? "#FF1F7D" : "white", lineHeight: 1 }}>
                  {club?.pending_applications ?? 0}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: (club?.pending_applications ?? 0) > 0 ? "#FF1F7D" : "rgba(255,255,255,0.3)", marginTop: 4, letterSpacing: "0.1em" }}>
                  PENDING
                </p>
              </div>

              {/* Upcoming Gatherings */}
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 24, color: "white", lineHeight: 1 }}>
                  {club?.upcoming_gatherings ?? 0}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(255,255,255,0.3)", marginTop: 4, letterSpacing: "0.1em" }}>
                  GATHERINGS
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upcoming Gatherings List */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Pending applications chip */}
        {(club?.pending_applications ?? 0) > 0 && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#FF1F7D", marginBottom: 10 }}>
            ● {club!.pending_applications} application{club!.pending_applications === 1 ? "" : "s"} waiting
          </p>
        )}

        <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 12 }}>
          UPCOMING GATHERINGS
        </p>

        {gatherings.length === 0 ? (
          <p style={{ fontFamily: "var(--font-caveat, cursive)", fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
            No gatherings scheduled.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {gatherings.slice(0, 3).map(g => (
              <div key={g.id}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "white", lineHeight: 1.3 }}>
                  {g.title}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                  {formatGatheringDate(g.date)}
                </p>
                {g.venue ? (
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>
                    {g.venue}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}

        <Link
          href="/club-owner/happenings"
          style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#FF1F7D", display: "inline-block", marginTop: 14, letterSpacing: "0.08em" }}
        >
          VIEW ALL →
        </Link>
      </div>

      {/* Quick Links */}
      <div style={{ padding: "20px 24px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 8 }}>
          QUICK NAV
        </p>
        <div className="flex flex-col">
          {QUICK_LINKS.map(link => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 9,
                  color: active ? "white" : "rgba(255,255,255,0.35)",
                  fontWeight: active ? 700 : undefined,
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  display: "block",
                  letterSpacing: "0.1em",
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
