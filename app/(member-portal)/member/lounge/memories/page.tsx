"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PINK  = "#FF1F7D";
const PLUM  = "#1A0A2E";
const IVORY = "#fdf4ec";
const INK   = "#111111";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BloomRecap {
  month: string;       // "June 2026"
  shortMonth: string;  // "JUN"
  year: string;
  events: number;
  saves: number;
  bloomiesMet: number;
  flowers: number;
  clubsJoined: number;
  yandeObservation: string;
  highlight?: string;
  current?: boolean;
}

interface WitnessNote {
  id: string;
  text: string;
  date: string;
}

interface MissedEvent {
  id: string;
  title: string;
  venue: string;
  date: string;
  clubName?: string;
  reasonYouWouldHaveLoved: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  venue: string;
  date: string;
  clubName?: string;
  href: string;
}

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

// ── Demo recap data ───────────────────────────────────────────────────────────

const RECAPS: BloomRecap[] = [
  {
    month: "June 2026", shortMonth: "JUN", year: "2026",
    events: 2, saves: 14, bloomiesMet: 3, flowers: 8, clubsJoined: 1,
    yandeObservation: "June is shaping up to be museum and café coded.",
    highlight: "You went to your first BloomBay Dinner Society event.",
    current: true,
  },
  {
    month: "May 2026", shortMonth: "MAY", year: "2026",
    events: 4, saves: 18, bloomiesMet: 3, flowers: 26, clubsJoined: 2,
    yandeObservation: "May felt very museum and bookstore coded. You attended more events this month than any month before.",
    highlight: "You met 3 new Bloomies through Museum Girls.",
  },
  {
    month: "April 2026", shortMonth: "APR", year: "2026",
    events: 2, saves: 11, bloomiesMet: 1, flowers: 14, clubsJoined: 0,
    yandeObservation: "You spent a lot of April discovering. Eleven new places saved, mostly cafés and bookstores close to home.",
    highlight: "You accepted your first Bloom Request.",
  },
  {
    month: "March 2026", shortMonth: "MAR", year: "2026",
    events: 1, saves: 6, bloomiesMet: 0, flowers: 3, clubsJoined: 1,
    yandeObservation: "Your first full month here. You started quietly. That's always how the good ones start.",
    highlight: "You attended your first BloomBay event.",
  },
];

// Demo missed events — in production: events from last month where user_id
// not in event_attendees, filtered to clubs the user belongs to.
const MISSED_LAST_MONTH: MissedEvent[] = [
  {
    id: "m1",
    title: "Sunday Rooftop Brunch",
    venue: "Dumbo House · Brooklyn",
    date: "May 18",
    clubName: "Dinner Society",
    reasonYouWouldHaveLoved: "8 women from your clubs went. Two of them are in your neighborhood.",
  },
  {
    id: "m2",
    title: "Women in Design: Studio Visits",
    venue: "Soho galleries, guided",
    date: "May 24",
    clubName: "Museum Girls",
    reasonYouWouldHaveLoved: "You've saved 3 design studios in The City. This had your name all over it.",
  },
];

// Demo upcoming this month — in production: events from current month in
// clubs the user belongs to, where starts_at >= now().
const COMING_UP_THIS_MONTH: UpcomingEvent[] = [
  {
    id: "u1",
    title: "Book Club: July Picks",
    venue: "McNally Jackson · Nolita",
    date: "Jun 21",
    clubName: "Book Club",
    href: "/member/happenings",
  },
  {
    id: "u2",
    title: "Girls Dinner at Carbone",
    venue: "Carbone · West Village",
    date: "Jun 27",
    clubName: "Dinner Society",
    href: "/member/happenings",
  },
];

const WITNESS_NOTES: WitnessNote[] = [
  { id: "w1", text: "Three months ago you didn't know anyone in Museum Girls. Now you've attended 4 events and met 6 Bloomies.", date: "Jun 1" },
  { id: "w2", text: "You've been saving more cafés than restaurants lately. Something's shifting.", date: "May 28" },
  { id: "w3", text: "You went to your first BloomBay event alone and stayed the whole night. That takes something.", date: "Mar 14" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRelative(d: Date): string {
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Bloom Recap Card ──────────────────────────────────────────────────────────

function RecapCard({ recap, onOpen }: { recap: BloomRecap; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      style={{
        width: "100%", textAlign: "left", cursor: "pointer",
        background: recap.current
          ? "linear-gradient(135deg, rgba(255,31,125,0.08) 0%, rgba(255,31,125,0.03) 100%)"
          : PLUM,
        border: recap.current
          ? `1.5px dashed rgba(255,31,125,0.3)`
          : "none",
        borderRadius: 20,
        padding: "18px 18px 16px",
        boxShadow: recap.current
          ? "none"
          : "0 4px 24px rgba(26,10,46,0.18)",
        flexShrink: 0,
        minWidth: 240,
      }}
    >
      {/* Month label */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <p style={{
            fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800,
            letterSpacing: "0.22em",
            color: recap.current ? PINK : "rgba(255,255,255,0.4)",
            marginBottom: 2,
          }}>
            {recap.current ? "✦ IN PROGRESS" : "BLOOM RECAP"}
          </p>
          <p style={{
            fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, fontWeight: 700, lineHeight: 1,
            color: recap.current ? INK : "white",
          }}>
            {recap.shortMonth}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: recap.current ? "#888" : "rgba(255,255,255,0.35)", marginTop: 1 }}>
            {recap.year}
          </p>
        </div>

        {/* Flower icon */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity={recap.current ? 0.2 : 0.15}>
          <circle cx="16" cy="16" r="4" fill={PINK} />
          {[0,1,2,3,4].map(i => {
            const a = (i/5)*Math.PI*2 - Math.PI/2;
            return <ellipse key={i} cx={16+Math.cos(a)*8} cy={16+Math.sin(a)*8} rx="3.5" ry="5.5" fill={PINK} transform={`rotate(${(i/5)*360} ${16+Math.cos(a)*8} ${16+Math.sin(a)*8})`} />;
          })}
        </svg>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          { label: "Events", value: recap.events },
          { label: "Saves", value: recap.saves },
          { label: "Bloomies", value: recap.bloomiesMet },
          { label: "Flowers", value: recap.flowers },
          { label: "Clubs", value: recap.clubsJoined },
        ].map(s => (
          <div key={s.label}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 16, fontWeight: 900, color: recap.current ? PINK : "rgba(255,255,255,0.9)", lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: recap.current ? "#aaa" : "rgba(255,255,255,0.35)", marginTop: 1 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Yande observation */}
      <p style={{
        fontFamily: "var(--font-caveat)", fontSize: 13, lineHeight: 1.5,
        color: recap.current ? "#888" : "rgba(255,255,255,0.5)",
        borderTop: `1px solid ${recap.current ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}`,
        paddingTop: 10,
      }}>
        &ldquo;{recap.yandeObservation}&rdquo;
      </p>
    </button>
  );
}

// ── Recap Full Sheet ──────────────────────────────────────────────────────────

function RecapSheet({ recap, onClose }: { recap: BloomRecap; onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 301,
        background: PLUM, borderRadius: "24px 24px 0 0",
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 -12px 48px rgba(0,0,0,0.4)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.12)" }} />
        </div>

        <div style={{ padding: "16px 22px 56px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>
                {recap.current ? "✦ IN PROGRESS" : "✦ BLOOM RECAP"}
              </p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 32, fontWeight: 700, color: "white", lineHeight: 1 }}>
                {recap.month}
              </p>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
            </button>
          </div>

          {/* Stat blocks */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { emoji: "🌸", label: "Events attended", value: recap.events },
              { emoji: "📍", label: "Places saved", value: recap.saves },
              { emoji: "✦", label: "Bloomies met", value: recap.bloomiesMet },
              { emoji: "🌺", label: "Flowers given", value: recap.flowers },
              { emoji: "👥", label: "Clubs joined", value: recap.clubsJoined },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "14px 16px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 28, fontWeight: 900, color: "white", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{s.emoji} {s.label}</p>
              </div>
            ))}
          </div>

          {/* Highlight */}
          {recap.highlight && (
            <div style={{ background: "rgba(255,31,125,0.12)", border: `1px solid ${PINK}33`, borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 6 }}>✦ HIGHLIGHT</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{recap.highlight}</p>
            </div>
          )}

          {/* Yande's observation */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 10 }}>
              &ldquo;{recap.yandeObservation}&rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK, letterSpacing: "0.08em" }}>— Yande ✦</p>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BloomTrailsPage() {
  const [trail, setTrail]     = useState<TrailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRecap, setOpenRecap] = useState<BloomRecap | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      const userId = user.id;
      const items: TrailItem[] = [];

      // Events attended
      const { data: attendance } = await supabase
        .from("gathering_attendance")
        .select("gathering_id, created_at, gatherings(title, venue, neighborhood, starts_at)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(30);

      type AttendanceRow = {
        gathering_id: string; created_at: string;
        gatherings: { title: string; venue: string | null; neighborhood: string | null; starts_at: string } | { title: string; venue: string | null; neighborhood: string | null; starts_at: string }[] | null;
      };
      (attendance as AttendanceRow[] ?? []).forEach(row => {
        if (!row.gatherings) return;
        const g = Array.isArray(row.gatherings) ? row.gatherings[0] : row.gatherings;
        if (!g) return;
        items.push({ id: `event-${row.gathering_id}`, type: "event", title: g.title, subtitle: g.venue ?? g.neighborhood ?? "NYC", emoji: "✨", date: formatRelative(new Date(g.starts_at)), rawDate: new Date(g.starts_at), href: "/member/happenings", color: PINK });
      });

      // Bloom notes
      const { data: notes } = await supabase
        .from("bloom_notes")
        .select("id, place_name, place_slug, content, created_at")
        .eq("author_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      (notes ?? []).forEach((n: { id: string; place_name: string | null; place_slug: string; content: string; created_at: string }) => {
        items.push({ id: `note-${n.id}`, type: "bloom_note", title: n.place_name ?? n.place_slug, subtitle: `"${n.content.slice(0, 60)}${n.content.length > 60 ? "…" : ""}"`, emoji: "🌸", date: formatRelative(new Date(n.created_at)), rawDate: new Date(n.created_at), href: `/member/city/bloom-notes/${n.place_slug}`, color: "#E8006A" });
      });

      // Clubs joined
      const { data: memberships } = await supabase
        .from("club_memberships")
        .select("club_slug, created_at, clubs(name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      type MembershipRow = { club_slug: string; created_at: string; clubs: { name: string } | { name: string }[] | null };
      (memberships as MembershipRow[] ?? []).forEach(m => {
        if (!m.clubs) return;
        const club = Array.isArray(m.clubs) ? m.clubs[0] : m.clubs;
        if (!club) return;
        items.push({ id: `club-${m.club_slug}`, type: "club", title: `Joined ${club.name}`, subtitle: "Club membership", emoji: "🌺", date: formatRelative(new Date(m.created_at)), rawDate: new Date(m.created_at), href: `/member/clubs/${m.club_slug}`, color: "#C80060" });
      });

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

  const typeLabel: Record<TrailItem["type"], string> = { event: "EVENT", bloom_note: "BLOOM NOTE", club: "CLUB", moment: "MOMENT" };
  const currentRecap = RECAPS.find(r => r.current);
  const pastRecaps = RECAPS.filter(r => !r.current);

  return (
    <div style={{ minHeight: "100dvh", background: IVORY, paddingBottom: 96 }}>

      {/* ── Header ── */}
      <div style={{ background: `linear-gradient(160deg, ${PLUM} 0%, #2A0818 60%, #3C0E22 100%)`, paddingTop: "calc(env(safe-area-inset-top, 0px) + 56px)", paddingBottom: 28, position: "relative", overflow: "hidden" }}>
        {/* Subtle radial glow */}
        <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ padding: "0 20px 14px", position: "relative", zIndex: 1 }}>
          <Link href="/member/lounge" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>THE APARTMENT</span>
          </Link>
        </div>

        <div style={{ padding: "0 20px", position: "relative", zIndex: 1 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.28em", color: PINK, marginBottom: 6, opacity: 0.7 }}>✦ BLOOM TRAILS</p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(38px, 10vw, 50px)", color: "rgba(255,238,220,0.92)", lineHeight: 0.94, margin: "0 0 8px" }}>
            Your trail.
          </h1>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.35)", margin: 0 }}>
            Every month. Every place. Every Bloomie.
          </p>
        </div>
      </div>

      {/* ── Monthly Recaps ── */}
      <div style={{ padding: "24px 0 0" }}>
        <div style={{ padding: "0 20px 12px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "#bbb" }}>MONTHLY RECAPS</p>
        </div>

        {/* Horizontal scroll row */}
        <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 20px 4px", scrollbarWidth: "none" }}>
          {/* Current month card */}
          {currentRecap && (
            <RecapCard recap={currentRecap} onOpen={() => setOpenRecap(currentRecap)} />
          )}
          {/* Past sealed recap cards */}
          {pastRecaps.map(r => (
            <RecapCard key={r.month} recap={r} onOpen={() => setOpenRecap(r)} />
          ))}
        </div>
      </div>

      {/* ── What you missed last month ── */}
      {MISSED_LAST_MONTH.length > 0 && (
        <div style={{ padding: "28px 20px 0" }}>
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "#bbb" }}>FROM LAST MONTH</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#bbb", marginTop: 3 }}>You missed these. Could be different this time.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MISSED_LAST_MONTH.map(ev => (
              <Link key={ev.id} href="/member/happenings" style={{ textDecoration: "none" }}>
                <div style={{ background: "white", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", borderLeft: `3px solid rgba(0,0,0,0.08)` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                    <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 14, color: INK, lineHeight: 1.2, flex: 1 }}>{ev.title}</p>
                    {ev.clubName && (
                      <span style={{ flexShrink: 0, fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.1em", color: PINK, background: `${PINK}14`, borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap" }}>
                        {ev.clubName.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#aaa", marginBottom: 6 }}>{ev.venue} · {ev.date}</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#777", lineHeight: 1.5 }}>
                    &ldquo;{ev.reasonYouWouldHaveLoved}&rdquo; — Yande ✦
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Coming up this month ── */}
      {COMING_UP_THIS_MONTH.length > 0 && (
        <div style={{ padding: "28px 20px 0" }}>
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "#bbb" }}>THIS MONTH — DON&apos;T MISS</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#bbb", marginTop: 3 }}>From your clubs. Yande thinks you&apos;ll want to be there.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {COMING_UP_THIS_MONTH.map(ev => (
              <Link key={ev.id} href={ev.href} style={{ textDecoration: "none" }}>
                <div style={{ background: `linear-gradient(135deg, ${PINK}08 0%, transparent 100%)`, border: `1px solid ${PINK}22`, borderRadius: 16, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                    <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 14, color: INK, lineHeight: 1.2, flex: 1 }}>{ev.title}</p>
                    {ev.clubName && (
                      <span style={{ flexShrink: 0, fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.1em", color: PINK, background: `${PINK}14`, borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap" }}>
                        {ev.clubName.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#aaa", marginBottom: 8 }}>{ev.venue} · {ev.date}</p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: PINK, borderRadius: 999, boxShadow: `0 2px 8px ${PINK}44` }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white", letterSpacing: "0.04em" }}>RSVP now →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Yande's Witness ── */}
      <div style={{ padding: "28px 20px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "#bbb", marginBottom: 12 }}>YANDE NOTICED</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {WITNESS_NOTES.map(w => (
            <div key={w.id} style={{ background: "white", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", borderLeft: `3px solid ${PINK}` }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: INK, lineHeight: 1.55, marginBottom: 6 }}>
                &ldquo;{w.text}&rdquo;
              </p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: PINK, fontWeight: 700, letterSpacing: "0.05em" }}>— Yande ✦ · {w.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Activity Trail ── */}
      <div style={{ padding: "28px 0 0" }}>
        <div style={{ padding: "0 20px 12px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "#bbb" }}>ACTIVITY TRAIL</p>
        </div>

        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${PINK}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {!loading && trail.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "rgba(255,31,125,0.4)", marginBottom: 8 }}>Your trail starts here.</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#bbb", lineHeight: 1.6, marginBottom: 20 }}>
              Attend events, save places, and join clubs.<br />Every action builds your trail.
            </p>
            <Link href="/member/happenings" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: PINK, color: "white", borderRadius: 14, textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800 }}>
              Find an event →
            </Link>
          </div>
        )}

        {!loading && trail.length > 0 && (
          <div>
            {Object.entries(grouped).map(([month, items]) => (
              <div key={month} style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "#ccc", padding: "0 20px 12px" }}>
                  {month.toUpperCase()}
                </p>

                <div style={{ position: "relative", padding: "0 20px" }}>
                  {/* Timeline line */}
                  <div style={{ position: "absolute", left: 36, top: 0, bottom: 0, width: 1.5, background: `${PINK}18` }} />

                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {items.map(item => (
                      <Link key={item.id} href={item.href ?? "#"} style={{ textDecoration: "none", display: "flex", alignItems: "flex-start", gap: 12 }}>
                        {/* Trail marker */}
                        <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: `${item.color}14`, border: `1.5px solid ${item.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, zIndex: 1, marginLeft: -2, boxShadow: `0 0 0 3px ${IVORY}` }}>
                          {item.emoji}
                        </div>

                        {/* Card */}
                        <div style={{ flex: 1, background: "white", borderRadius: 14, padding: "11px 13px", marginBottom: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.04)", borderLeft: `2px solid ${item.color}44` }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 13, color: INK, lineHeight: 1.2, flex: 1 }}>{item.title}</p>
                            <span style={{ flexShrink: 0, fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.12em", color: "white", background: item.color, borderRadius: 4, padding: "2px 5px" }}>
                              {typeLabel[item.type]}
                            </span>
                          </div>
                          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#999", lineHeight: 1.4 }}>{item.subtitle}</p>
                          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#ccc", marginTop: 5 }}>{item.date}</p>
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

      {/* ── Recap Sheet ── */}
      {openRecap && <RecapSheet recap={openRecap} onClose={() => setOpenRecap(null)} />}
    </div>
  );
}
