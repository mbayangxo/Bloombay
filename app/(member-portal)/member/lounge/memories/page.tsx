"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";

interface TrailItem {
  id: string;
  type: "event" | "bloom_note" | "club" | "moment";
  title: string;
  subtitle: string;
  emoji: string;
  date: string;
  rawDate: Date;
  href?: string;
  color: string;
}

function formatRelative(d: Date): string {
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BloomTrailsPage() {
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let userId: string | null = null;

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      userId = user.id;

      const items: TrailItem[] = [];

      // 1. Events attended
      const { data: attendance } = await supabase
        .from("gathering_attendance")
        .select("gathering_id, created_at, gatherings(title, venue, neighborhood, starts_at)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(30);

      type AttendanceRow = {
        gathering_id: string;
        created_at: string;
        gatherings: { title: string; venue: string | null; neighborhood: string | null; starts_at: string } | { title: string; venue: string | null; neighborhood: string | null; starts_at: string }[] | null;
      };
      (attendance as AttendanceRow[] ?? []).forEach((row) => {
        if (!row.gatherings) return;
        const g = Array.isArray(row.gatherings) ? row.gatherings[0] : row.gatherings;
        if (!g) return;
        items.push({
          id: `event-${row.gathering_id}`,
          type: "event",
          title: g.title,
          subtitle: g.venue ?? g.neighborhood ?? "NYC",
          emoji: "✨",
          date: formatRelative(new Date(g.starts_at)),
          rawDate: new Date(g.starts_at),
          href: `/member/happenings`,
          color: PINK,
        });
      });

      // 2. Bloom notes left
      const { data: notes } = await supabase
        .from("bloom_notes")
        .select("id, place_name, place_slug, content, created_at")
        .eq("author_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      (notes ?? []).forEach((n: {
        id: string; place_name: string | null; place_slug: string;
        content: string; created_at: string;
      }) => {
        items.push({
          id: `note-${n.id}`,
          type: "bloom_note",
          title: n.place_name ?? n.place_slug,
          subtitle: `"${n.content.slice(0, 60)}${n.content.length > 60 ? "…" : ""}"`,
          emoji: "🌸",
          date: formatRelative(new Date(n.created_at)),
          rawDate: new Date(n.created_at),
          href: `/member/city/bloom-notes/${n.place_slug}`,
          color: "#E8006A",
        });
      });

      // 3. Clubs joined
      const { data: memberships } = await supabase
        .from("club_memberships")
        .select("club_slug, created_at, clubs(name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      type MembershipRow = {
        club_slug: string; created_at: string;
        clubs: { name: string } | { name: string }[] | null;
      };
      (memberships as MembershipRow[] ?? []).forEach((m) => {
        if (!m.clubs) return;
        const club = Array.isArray(m.clubs) ? m.clubs[0] : m.clubs;
        if (!club) return;
        items.push({
          id: `club-${m.club_slug}`,
          type: "club",
          title: `Joined ${club.name}`,
          subtitle: "Club membership",
          emoji: "🌺",
          date: formatRelative(new Date(m.created_at)),
          rawDate: new Date(m.created_at),
          href: `/member/clubs/${m.club_slug}`,
          color: "#C80060",
        });
      });

      // Sort by date, newest first
      items.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

      setTrail(items);
      setLoading(false);
    });
  }, []);

  // Group by month
  const grouped: Record<string, TrailItem[]> = {};
  trail.forEach(item => {
    const key = item.rawDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  const typeLabel: Record<TrailItem["type"], string> = {
    event: "EVENT",
    bloom_note: "BLOOM NOTE",
    club: "CLUB",
    moment: "MOMENT",
  };

  return (
    <div style={{ minHeight: "100vh", background: PAPER, paddingBottom: 96 }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${DARK} 0%, #2A0818 50%, #480C24 100%)`,
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 56px)",
        paddingBottom: 32, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ padding: "0 20px 14px", position: "relative", zIndex: 1 }}>
          <Link href="/member/lounge" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em" }}>APARTMENT</span>
          </Link>
        </div>

        <div style={{ padding: "0 20px", position: "relative", zIndex: 1 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.3em", color: "rgba(255,31,125,0.6)", marginBottom: 6 }}>🌸 BLOOM TRAILS</p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(38px, 10vw, 52px)", color: "rgba(255,238,220,0.92)", lineHeight: 0.94, margin: 0 }}>Your Trail.</h1>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>
            Every event, note, and club you&apos;ve touched
          </p>
        </div>
      </div>

      {/* Trail count */}
      {!loading && trail.length > 0 && (
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ background: "white", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 10px rgba(255,31,125,0.07)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${PINK}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌸</div>
            <div>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: PINK, lineHeight: 1 }}>{trail.length}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(0,0,0,0.28)", marginTop: 2 }}>TRAIL MARKERS</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
              {(["event","bloom_note","club"] as const).map(type => ({
                type, count: trail.filter(t => t.type === type).length,
                icon: type === "event" ? "✨" : type === "bloom_note" ? "🌸" : "🌺",
              })).map(({ type, count, icon }) => (
                <div key={type} style={{ textAlign: "center" as const }}>
                  <p style={{ fontSize: 14 }}>{icon}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK }}>{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2.5px solid ${PINK}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* Empty state */}
      {!loading && trail.length === 0 && (
        <div style={{ padding: "48px 20px", textAlign: "center" as const }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "rgba(255,31,125,0.5)", marginBottom: 8 }}>Your trail starts here.</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.35)", marginBottom: 24, lineHeight: 1.6 }}>
            Join events, leave bloom notes, and connect with clubs.<br/>Every action builds your trail.
          </p>
          <Link href="/member/happenings" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: PINK, color: "white", borderRadius: 14, textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800 }}>
            Find an event →
          </Link>
        </div>
      )}

      {/* Timeline grouped by month */}
      {!loading && trail.length > 0 && (
        <div style={{ padding: "20px 0 0" }}>
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month} style={{ marginBottom: 28 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)", padding: "0 20px 14px" }}>
                {month.toUpperCase()}
              </p>

              {/* Timeline */}
              <div style={{ position: "relative", padding: "0 20px" }}>
                {/* Vertical line */}
                <div style={{ position: "absolute", left: 36, top: 0, bottom: 0, width: 1.5, background: "rgba(255,31,125,0.12)" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href ?? "#"}
                      style={{ textDecoration: "none", display: "flex", alignItems: "flex-start", gap: 14 }}
                    >
                      {/* Trail marker */}
                      <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: `${item.color}18`, border: `1.5px solid ${item.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, zIndex: 1, marginLeft: -2, boxShadow: `0 0 0 3px ${PAPER}` }}>
                        {item.emoji}
                      </div>

                      {/* Card */}
                      <div style={{ flex: 1, background: "white", borderRadius: 14, padding: "12px 14px", marginBottom: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderLeft: `2px solid ${item.color}44` }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 14, color: DARK, lineHeight: 1.2, flex: 1 }}>{item.title}</p>
                          <span style={{ flexShrink: 0, fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.14em", color: "white", background: item.color, borderRadius: 3, padding: "2px 6px" }}>
                            {typeLabel[item.type]}
                          </span>
                        </div>
                        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#888", lineHeight: 1.4 }}>{item.subtitle}</p>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(0,0,0,0.28)", marginTop: 6 }}>{item.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
