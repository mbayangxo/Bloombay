"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";

const PINK  = "#FF1F7D";
const CREAM = "#F6F1EB";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";
const PAPER_TEX  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;
const DARK_GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' fill='%23fff' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;
const LINEN_TEX  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08 0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='80' height='80' fill='%23000' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`;
const GOLD       = "#D4A853";
const MONTHS_S   = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

const TAPES = [
  { rgb: "255,148,172", a: 0.72 },
  { rgb: "255,210,60",  a: 0.62 },
  { rgb: "120,185,255", a: 0.68 },
  { rgb: "120,205,140", a: 0.62 },
  { rgb: "195,140,240", a: 0.68 },
];

type Club = {
  id: string;
  name: string;
  color: string | null;
  cover_url: string | null;
  member_count: number;
};

const WEEK_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const FIRST_MONTH_TASKS = [
  { week: 1, task: "Join 3 clubs",             href: "/member/clubs"    },
  { week: 2, task: "Attend 1 gathering",        href: "/member/discover" },
  { week: 3, task: "Introduce yourself",        href: "/member/match"    },
  { week: 4, task: "Save 5 places in The City", href: "/member/city"     },
];

const TODAY_EVENTS = [
  { time: "9:00 AM",  label: "NEXT",    name: "Pilates Class",    loc: "Brooklyn Studio · Carroll Gardens", color: "#E8A0B4" },
  { time: "1:00 PM",  label: "",        name: "Lunch with Sofia", loc: "Café Auguste · East Village",      color: "#A8C4E0" },
  { time: "7:30 PM",  label: "TONIGHT", name: "Girls Dinner",     loc: "Carbone · West Village",           color: PINK      },
];

// ─── Tape ─────────────────────────────────────────────────────────────────────

function Tape({
  index = 0,
  width = 36,
  height = 13,
  rotate = 0,
  style,
}: {
  index?: number;
  width?: number;
  height?: number;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  const t = TAPES[index % TAPES.length];
  const { rgb: r, a } = t;
  const fade = (a * 0.38).toFixed(2);
  return (
    <div
      style={{
        width,
        height,
        background: `linear-gradient(to bottom,
          rgba(${r},${fade}),
          rgba(${r},${a}) 25%,
          rgba(255,255,255,0.55) 45%,
          rgba(255,255,255,0.55) 55%,
          rgba(${r},${a}) 75%,
          rgba(${r},${fade})
        )`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.11)",
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    />
  );
}

// ─── Club Cover (compact square) ──────────────────────────────────────────────

function ClubCover({ club, index }: { club: Club; index: number }) {
  const abbr  = club.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const bg    = club.color || PINK;

  return (
    <Link href={`/member/clubs`} style={{ textDecoration: "none", flexShrink: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
        {/* Square cover */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 3px 12px rgba(0,0,0,0.14)",
          position: "relative",
        }}>
          {club.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={club.cover_url} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: `linear-gradient(145deg, ${bg} 0%, ${bg}bb 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>
                {abbr}
              </p>
            </div>
          )}
        </div>
        {/* Label */}
        <p style={{
          fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 600, color: "rgba(0,0,0,0.45)",
          textAlign: "center", letterSpacing: "0.02em", maxWidth: 60,
          overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
        }}>
          {abbr}
        </p>
      </div>
    </Link>
  );
}

// ─── Yande Sheet ──────────────────────────────────────────────────────────────

function YandeSheet({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
        onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl pb-10"
        style={{ background: "#FDF4EC", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
        <div className="flex justify-center pt-3 pb-3">
          <div className="w-8 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div className="px-5 flex items-center gap-3 mb-3">
          <span style={{ fontSize: 22 }}>🌸</span>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.22em", fontSize: 9, color: PINK, textTransform: "uppercase" }}>
              YANDE
            </p>
            <p className="font-black italic leading-tight"
              style={{ fontFamily: "var(--font-playfair)", fontSize: 20, color: "#111" }}>
              Find your tribe.
            </p>
          </div>
        </div>
        <p className="px-5 italic mb-6 leading-relaxed"
          style={{ fontFamily: "var(--font-instrument)", fontSize: 14, color: "#888" }}>
          Join clubs to start connecting with women in your city.
        </p>
        <div className="px-5">
          <Link href="/member/clubs" onClick={onClose}
            className="w-full py-4 rounded-full font-bold text-sm flex items-center justify-center"
            style={{ background: PINK, color: "white", textDecoration: "none", boxShadow: `0 4px 18px ${PINK}44` }}>
            Browse all clubs →
          </Link>
        </div>
      </div>
    </>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export function HomePage() {
  const [tod,       setTod]       = useState<TimeOfDay>("afternoon");
  const [greeting,  setGreeting]  = useState("Good afternoon");
  const [showYande, setShowYande] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [myClubs,   setMyClubs]   = useState<Club[]>([]);
  const [joinedAt,  setJoinedAt]  = useState<string | null>(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const t = getTimeOfDay(new Date().getHours());
    setTod(t);
    setGreeting(getGreeting(t));
  }, []);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, avatar_url, created_at")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFirstName(profile.first_name || "");
        setAvatarUrl(profile.avatar_url || null);
        setJoinedAt(profile.created_at  || null);
      }

      const { data: uc } = await supabase
        .from("user_clubs")
        .select("club:clubs(id,name,color,cover_url,member_count)")
        .eq("user_id", user.id)
        .limit(10);

      if (uc) setMyClubs(uc.map((r: Record<string, unknown>) => r.club as Club).filter(Boolean));
      setLoading(false);
    }
    load();
  }, []);

  const today    = new Date();
  const todayDow = today.getDay();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - todayDow + i);
    return { abbr: WEEK_DAYS[i], date: d.getDate(), isToday: i === todayDow };
  });

  const timeLabel = tod === "morning" ? "MORNING"
    : (tod === "evening" || tod === "night") ? "EVENING"
    : "AFTERNOON";

  const weeksIn   = joinedAt
    ? Math.min(4, Math.floor((Date.now() - new Date(joinedAt).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1)
    : 1;
  const task        = FIRST_MONTH_TASKS[Math.min(weeksIn - 1, 3)];
  const displayName = firstName || "there";
  const initial     = firstName ? firstName[0].toUpperCase() : "?";
  const monthShort  = MONTHS_S[today.getMonth()];
  const dayOfMonth  = today.getDate();
  const dayAbbr     = WEEK_DAYS[todayDow];

  return (
    <div style={{
      backgroundImage: PAPER_TEX,
      backgroundColor: CREAM,
      backgroundSize: "200px 200px",
      minHeight: "100vh",
      paddingBottom: 104,
      overflowX: "hidden",
    }}>

      {/* ══════════════════════════ HEADER ══════════════════════════ */}
      <div style={{
        position: "relative", overflow: "hidden",
        backgroundImage: `${DARK_GRAIN}, linear-gradient(160deg, #0E0610 0%, #1C0A18 40%, #220D18 70%, #160A10 100%)`,
        backgroundSize: "160px 160px, 100% 100%",
        backgroundColor: "#140810",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 44px)",
        paddingBottom: 28,
      }}>
        {/* Atmospheric glows */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 20%, rgba(255,31,125,0.22) 0%, transparent 55%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 85%, rgba(212,168,83,0.1) 0%, transparent 50%)", pointerEvents: "none" }} />

        {/* Top ornamental rule */}
        <div style={{ height: 2, background: `linear-gradient(90deg, transparent 0%, ${PINK} 30%, ${GOLD} 50%, ${PINK} 70%, transparent 100%)` }} />

        {/* ── Greeting ── */}
        <div style={{ padding: "20px 22px 0", position: "relative" }}>
          {/* Eyebrow */}
          <p style={{
            fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800,
            letterSpacing: "0.32em", color: `${PINK}99`, marginBottom: 10,
          }}>
            GOOD {timeLabel}
          </p>

          {/* Primary greeting line */}
          <p style={{
            fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400,
            fontSize: 22, color: "rgba(255,235,245,0.7)", lineHeight: 1, marginBottom: 2,
          }}>
            {greeting},
          </p>

          {/* Name — hero line */}
          <p style={{
            fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900,
            fontSize: loading ? 28 : Math.max(26, 36 - Math.max(0, (displayName.length - 6) * 2)),
            color: "white", lineHeight: 1.05,
            textShadow: `0 0 32px rgba(255,31,125,0.55), 0 0 64px rgba(255,31,125,0.2)`,
            letterSpacing: "-0.01em",
          }}>
            {loading ? "…" : `${displayName}.`}
          </p>

          {/* Sub line */}
          <p style={{
            fontFamily: "var(--font-caveat)", fontSize: 13,
            color: "rgba(255,200,220,0.38)", marginTop: 10, letterSpacing: "0.01em",
          }}>
            you belong here ✦ soft life, strong mind
          </p>

          {/* Quick-nav chips */}
          <div style={{ display: "flex", gap: 7, marginTop: 16, flexWrap: "wrap" as const }}>
            {[
              { href: "/member/happenings", icon: "🌃", label: "Tonight" },
              { href: "/member/city",       icon: "📍", label: "City"    },
              { href: "/member/plans",      icon: "✦",  label: "Plans"   },
            ].map(chip => (
              <Link key={chip.href} href={chip.href} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 999,
                  padding: "6px 13px",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                }}>
                  <span style={{ fontSize: 10 }}>{chip.icon}</span>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 700, color: "rgba(255,220,235,0.7)", letterSpacing: "0.06em" }}>
                    {chip.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Bottom fade to cream ── */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40,
          background: `linear-gradient(to bottom, transparent, ${CREAM}22)`,
          pointerEvents: "none" }} />
        {/* Bottom ornamental rule */}
        <div style={{ marginTop: 22, height: 1.5, background: `linear-gradient(90deg, transparent, ${PINK}44, ${GOLD}66, ${PINK}44, transparent)` }} />
      </div>

      {/* ══════════════════════════ CALENDAR STRIP ══════════════════════════ */}
      <div style={{ margin: "20px 0 0" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
          backgroundColor: "rgba(255,31,125,0.04)",
          backgroundSize: "200px 200px, 80px 80px",
          borderTop: "1px solid rgba(255,31,125,0.1)",
          borderBottom: "1px solid rgba(255,31,125,0.1)",
          padding: "8px 22px",
        }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.06em", color: d.isToday ? PINK : "rgba(0,0,0,0.25)" }}>
                {d.abbr}
              </span>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: d.isToday ? PINK : "transparent",
                boxShadow: d.isToday ? "0 2px 10px rgba(255,31,125,0.38)" : "none",
              }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: d.isToday ? "white" : "rgba(0,0,0,0.45)" }}>
                  {d.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════ THREE MINI CARDS ══════════════════════════ */}
      <div style={{ display: "flex", gap: 8, padding: "14px 16px 4px" }}>

        {/* My First Month */}
        <Link href={task.href} style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ position: "relative", paddingTop: 8 }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 4 }}>
              <Tape index={1} width={40} height={13} rotate={-2} />
            </div>
            <div style={{
              backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
              backgroundColor: PAPER,
              backgroundSize: "200px 200px, 80px 80px",
              borderRadius: 18,
              padding: "18px 12px 12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
              transform: "rotate(-0.6deg)",
              minHeight: 140,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em", color: PINK, marginBottom: 6 }}>
                  MY FIRST MONTH
                </p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 11, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.4 }}>
                  ⭐ Week {weeksIn}:<br />{task.task}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ flex: 1, height: 3, borderRadius: 999, background: "rgba(255,31,125,0.1)", overflow: "hidden" }}>
                  <div style={{ width: `${(weeksIn / 4) * 100}%`, height: "100%", background: PINK, borderRadius: 999 }} />
                </div>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(0,0,0,0.3)" }}>{weeksIn}/4</span>
              </div>
            </div>
          </div>
        </Link>

        {/* This week events */}
        <Link href="/member/happenings" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ position: "relative", paddingTop: 8 }}>
            <div style={{ position: "absolute", top: 0, right: 12, zIndex: 4 }}>
              <Tape index={2} width={36} height={13} rotate={3} />
            </div>
            <div style={{
              backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
              backgroundColor: "#FEF0F5",
              backgroundSize: "200px 200px, 80px 80px",
              borderRadius: 18,
              padding: "18px 12px 12px",
              boxShadow: "0 4px 20px rgba(255,31,125,0.09), inset 0 1px 0 rgba(255,255,255,0.85)",
              transform: "rotate(0.4deg)",
              minHeight: 140,
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em", color: PINK, marginBottom: 4 }}>
                THIS WEEK
              </p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: DARK }}>2</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 600, color: "rgba(0,0,0,0.35)", marginTop: 1 }}>events near you</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: PINK, marginTop: 8 }}>Book Girls NYC<br />Wednesday</p>
            </div>
          </div>
        </Link>

        {/* City vibes */}
        <Link href="/member/city" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ position: "relative", paddingTop: 8 }}>
            <div style={{ position: "absolute", top: 0, left: 8, zIndex: 4 }}>
              <Tape index={3} width={36} height={13} rotate={-1} />
            </div>
            <div style={{
              backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
              backgroundColor: PAPER,
              backgroundSize: "200px 200px, 80px 80px",
              borderRadius: 18,
              padding: "18px 12px 12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.9)",
              transform: "rotate(-0.3deg)",
              minHeight: 140,
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em", color: PINK, marginBottom: 4 }}>
                CITY VIBES
              </p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 11, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.3 }}>
                Crown Heights
              </p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "rgba(0,0,0,0.35)", marginTop: 3 }}>9 spots</p>
            </div>
          </div>
        </Link>

      </div>

      {/* ══════════════════════════ TODAY'S EVENTS ══════════════════════════ */}
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>
            TODAY · {TODAY_EVENTS.length} EVENTS
          </p>
          <Link href="/member/happenings" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(0,0,0,0.3)" }}>VIEW FULL SCHEDULE →</span>
          </Link>
        </div>

        {/* Event list */}
        <div style={{
          backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
          backgroundColor: PAPER,
          backgroundSize: "200px 200px, 80px 80px",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 22px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}>
          {TODAY_EVENTS.map((ev, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "13px 16px",
              borderBottom: i < TODAY_EVENTS.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
            }}>
              {/* Time */}
              <div style={{ width: 48, flexShrink: 0, textAlign: "right" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(0,0,0,0.35)", lineHeight: 1 }}>
                  {ev.time.split(" ")[0]}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 600, color: "rgba(0,0,0,0.22)" }}>
                  {ev.time.split(" ")[1]}
                </p>
              </div>

              {/* Color dot */}
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />

              {/* Event info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: DARK, lineHeight: 1.2 }}>
                  {ev.name}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.38)", marginTop: 1 }}>
                  {ev.loc}
                </p>
              </div>

              {/* Label badge */}
              {ev.label && (
                <div style={{
                  flexShrink: 0,
                  background: ev.label === "NEXT" ? "rgba(0,0,0,0.06)" : PINK,
                  borderRadius: 999,
                  padding: "3px 8px",
                }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.1em", color: ev.label === "NEXT" ? "rgba(0,0,0,0.4)" : "white" }}>
                    {ev.label}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Featured Tonight card */}
        <Link href="/member/happenings" style={{ textDecoration: "none" }}>
          <div style={{
            marginTop: 10,
            borderRadius: 18,
            overflow: "hidden",
            backgroundImage: `${DARK_GRAIN}, linear-gradient(145deg, #1A0810 0%, #2D0A1A 100%)`,
            backgroundSize: "160px 160px, 100% 100%",
            backgroundColor: "#1A0810",
            padding: "20px 20px",
            position: "relative",
            boxShadow: `0 10px 36px rgba(255,31,125,0.22)`,
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 85% 15%, rgba(255,31,125,0.35) 0%, transparent 55%)", pointerEvents: "none" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,31,125,0.85)", position: "relative" }}>
              7:30 PM · WEST VILLAGE
            </p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "#F8EEF2", lineHeight: 1.1, marginTop: 4, position: "relative" }}>
              Girls Dinner<br />
              <span style={{ color: "#FF69B4" }}>Carbone</span>
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.38)", marginTop: 6, position: "relative" }}>
              4 seats · Individual Pay
            </p>
            <div style={{
              marginTop: 14,
              display: "inline-flex",
              background: PINK,
              borderRadius: 999,
              padding: "9px 20px",
              position: "relative",
              boxShadow: `0 3px 14px ${PINK}55`,
            }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: "white", letterSpacing: "0.07em" }}>I&apos;M IN →</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ══════════════════════════ YOUR CLUBS ══════════════════════════ */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingLeft: 20, paddingRight: 20, marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>YOUR CLUBS</p>
            {!loading && myClubs.length > 0 && (
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.28)", marginTop: 1 }}>
                {myClubs.length} joined
              </p>
            )}
          </div>
          <Link href="/member/clubs" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(0,0,0,0.3)" }}>Browse all →</span>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", gap: 16, padding: "4px 20px 12px" }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(0,0,0,0.06)", flexShrink: 0 }} />
            ))}
          </div>
        ) : myClubs.length === 0 ? (
          <div style={{
            margin: "0 20px",
            backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
            backgroundColor: PAPER,
            backgroundSize: "200px 200px, 80px 80px",
            borderRadius: 22, padding: "28px 22px", textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontStyle: "italic", color: "rgba(0,0,0,0.25)", marginBottom: 8 }}>
              No clubs yet.
            </p>
            <p style={{ fontFamily: "var(--font-instrument)", fontSize: 12, fontStyle: "italic", color: "rgba(0,0,0,0.3)", lineHeight: 1.5, marginBottom: 20 }}>
              Find your people —<br />there&apos;s a club for every side of you.
            </p>
            <Link href="/member/clubs" style={{
              display: "inline-block", background: PINK, color: "white",
              padding: "12px 30px", borderRadius: 999, fontSize: 11, fontWeight: 700,
              textDecoration: "none", fontFamily: "var(--font-jost)",
              boxShadow: `0 4px 18px ${PINK}44`,
            }}>
              Browse Clubs →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", overflowX: "auto", padding: "4px 20px 16px", gap: 14, scrollbarWidth: "none" as const }}>
            {myClubs.map((club, i) => (
              <ClubCover key={club.id} club={club} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════ NEAR YOU ══════════════════════════ */}
      <div style={{ padding: "16px 20px 8px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>NEAR YOU</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.28)", marginTop: 1 }}>SoHo, NYC</p>
          </div>
          <Link href="/member/discover" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(0,0,0,0.3)" }}>EXPLORE MAP →</span>
          </Link>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" as const }}>
          {[
            { name: "SoHo",         clubs: 12, color: "#D4B5A0" },
            { name: "West Village", clubs: 18, color: "#C4A0A8" },
            { name: "Williamsburg", clubs: 16, color: "#B8A8C0" },
            { name: "Brooklyn Hts", clubs: 11, color: "#A8B8A8" },
            { name: "Harlem",       clubs: 9,  color: "#C0B0A0" },
          ].map((n, i) => (
            <Link key={i} href="/member/discover" style={{ textDecoration: "none", flexShrink: 0 }}>
              <div style={{
                width: 100,
                backgroundImage: `${PAPER_TEX}, ${LINEN_TEX}`,
                backgroundColor: PAPER,
                backgroundSize: "200px 200px, 80px 80px",
                borderRadius: 14, overflow: "hidden",
                boxShadow: "0 3px 14px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.85)",
              }}>
                <div style={{ height: 56, background: `linear-gradient(135deg, ${n.color}, ${n.color}88)`, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: `${DARK_GRAIN}`, backgroundSize: "160px 160px" }} />
                </div>
                <div style={{ padding: "7px 8px 9px" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: DARK }}>{n.name}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.35)", marginTop: 1 }}>{n.clubs} clubs</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══════════════════════════ INSPIRATION ══════════════════════════ */}
      <div style={{ padding: "14px 20px 36px" }}>
        <Link href="/member/discover" style={{ textDecoration: "none" }}>
          <div style={{
            backgroundImage: `${DARK_GRAIN}, linear-gradient(145deg, #1C1B1C 0%, #3D001A 100%)`,
            backgroundSize: "160px 160px, 100% 100%",
            backgroundColor: "#1C1B1C",
            borderRadius: 20, padding: "26px 22px",
            position: "relative", overflow: "hidden",
            boxShadow: "0 10px 36px rgba(0,0,0,0.2)",
            transform: "rotate(0.4deg)",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 88% 12%, rgba(255,31,125,0.22) 0%, transparent 65%)", pointerEvents: "none" }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, fontStyle: "italic", color: "#F1DFDD", lineHeight: 1.5, position: "relative" }}>
              &ldquo;Collect moments,<br />not things.&rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 600, color: "rgba(255,255,255,0.22)", marginTop: 12, letterSpacing: "0.1em", position: "relative" }}>
              — bloombay
            </p>
            <div style={{ marginTop: 16, display: "inline-flex", background: PINK, borderRadius: 999, padding: "9px 18px", position: "relative", boxShadow: `0 3px 14px ${PINK}55` }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "white", letterSpacing: "0.07em" }}>DISCOVER PLACES →</span>
            </div>
          </div>
        </Link>
      </div>

      {showYande && <YandeSheet onClose={() => setShowYande(false)} />}

    </div>
  );
}
