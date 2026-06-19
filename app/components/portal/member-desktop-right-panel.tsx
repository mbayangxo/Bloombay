"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";

interface UpcomingEvent {
  id: string;
  title: string;
  venue: string | null;
  neighborhood: string | null;
  date_time: string;
  accent_color: string;
  attending_count: number;
  category: string | null;
}

interface WallPost {
  id: string;
  text: string;
  blooms: number;
  category: string | null;
  seed_author: string | null;
  author: { first_name: string | null; full_name: string | null } | null;
}

interface PanelData {
  upcoming: UpcomingEvent[];
  posts: WallPost[];
  memberCount: number;
}

function fmtDay(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Today · ${time}`;
  if (isTomorrow) return `Tomorrow · ${time}`;
  return `${d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · ${time}`;
}

function authorName(post: WallPost) {
  if (post.seed_author) return post.seed_author;
  const p = post.author;
  if (!p) return "A Bloomie";
  return p.first_name ?? p.full_name ?? "A Bloomie";
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning ✦";
  if (h < 17) return "Good afternoon ✦";
  if (h < 21) return "Good evening ✦";
  return "Good night ✦";
}

export function MemberDesktopRightPanel() {
  const [data, setData] = useState<PanelData | null>(null);

  useEffect(() => {
    fetch("/api/member/desktop-panel")
      .then(r => r.ok ? r.json() : null)
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  return (
    <aside
      className="hidden lg:flex flex-col fixed right-0 top-0 h-full overflow-y-auto"
      style={{
        width: 280,
        background: "#FEFCF7",
        borderLeft: "1px solid rgba(255,31,125,0.07)",
        padding: "28px 0 40px",
      }}
    >
      {/* ── Date & greeting ── */}
      <div style={{ padding: "0 22px 20px", borderBottom: "1px solid rgba(255,31,125,0.06)" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>
          {todayLabel().toUpperCase()}
        </p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: DARK, lineHeight: 1.2 }}>
          {greeting()}
        </p>
        {data && data.memberCount > 0 && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.3)", marginTop: 8, letterSpacing: "0.06em" }}>
            {data.memberCount} women in BloomBay
          </p>
        )}
      </div>

      {/* ── Upcoming events (next 48h) ── */}
      <div style={{ padding: "18px 22px 16px", borderBottom: "1px solid rgba(255,31,125,0.06)" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.3)", marginBottom: 12 }}>
          UPCOMING
        </p>
        {!data && (
          <div style={{ height: 60, background: "rgba(255,31,125,0.04)", borderRadius: 10 }} />
        )}
        {data && data.upcoming.length === 0 && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.3)", lineHeight: 1.5 }}>
            Nothing in the next 48 hours.
            <br />
            <Link href="/member/happenings" style={{ color: PINK, textDecoration: "none" }}>Browse all happenings →</Link>
          </p>
        )}
        {data && data.upcoming.map(ev => (
          <Link key={ev.id} href={`/member/happenings/${ev.id}`} style={{ textDecoration: "none", display: "block", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                width: 4, flexShrink: 0, alignSelf: "stretch", borderRadius: 2,
                background: ev.accent_color || PINK, marginTop: 2,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: DARK, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ev.title}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.4)", marginTop: 2, letterSpacing: "0.03em" }}>
                  {fmtDay(ev.date_time)}
                </p>
                {(ev.venue || ev.neighborhood) && (
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.3)", marginTop: 1 }}>
                    {ev.venue ?? ev.neighborhood}
                  </p>
                )}
                {ev.attending_count > 0 && (
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: PINK, marginTop: 3, fontWeight: 700, letterSpacing: "0.04em" }}>
                    {ev.attending_count} going
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
        <Link href="/member/happenings" style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK, letterSpacing: "0.1em", textDecoration: "none", display: "block", marginTop: 4 }}>
          ALL HAPPENINGS →
        </Link>
      </div>

      {/* ── Community posts ── */}
      <div style={{ padding: "18px 22px 16px", borderBottom: "1px solid rgba(255,31,125,0.06)" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.3)", marginBottom: 12 }}>
          ON THE WALL
        </p>
        {!data && (
          <div style={{ height: 80, background: "rgba(255,31,125,0.04)", borderRadius: 10 }} />
        )}
        {data && data.posts.length === 0 && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.3)" }}>
            Nothing posted yet.
          </p>
        )}
        {data && data.posts.map(post => (
          <div key={post.id} style={{ marginBottom: 14 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(0,0,0,0.28)", letterSpacing: "0.06em", marginBottom: 3 }}>
              {authorName(post).toUpperCase()}
            </p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: DARK, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {post.text}
            </p>
            {post.blooms > 0 && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: PINK, marginTop: 4, fontWeight: 700 }}>
                ✿ {post.blooms}
              </p>
            )}
          </div>
        ))}
        <Link href="/member/avenue/wall" style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK, letterSpacing: "0.1em", textDecoration: "none", display: "block", marginTop: 4 }}>
          GO TO THE WALL →
        </Link>
      </div>

      {/* ── Quick links ── */}
      <div style={{ padding: "18px 22px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.3)", marginBottom: 12 }}>
          QUICK ACCESS
        </p>
        {[
          { href: "/member/you",           label: "My Profile" },
          { href: "/member/settings",      label: "Settings" },
          { href: "/member/discover",      label: "Discover" },
          { href: "/member/apartment",     label: "My Apartment" },
          { href: "/member/notifications", label: "Pin Drops" },
          { href: "/member/plans",         label: "My Plans" },
        ].map(({ href, label }) => (
          <Link key={href} href={href}
            style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.04em", padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", textDecoration: "none" }}
          >
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
