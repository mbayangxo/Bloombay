"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";
import { BBLogo } from "./bb-logo";

// Inject pulse keyframe once
if (typeof document !== "undefined") {
  if (!document.getElementById("bb-home-style")) {
    const s = document.createElement("style");
    s.id = "bb-home-style";
    s.textContent = `
      @keyframes cardPulse {
        0%,100%{ box-shadow:0 2px 0 rgba(0,0,0,0.9),0 10px 40px rgba(0,0,0,0.4),0 0 0 0 rgba(255,0,144,0); }
        50%{ box-shadow:0 2px 0 rgba(0,0,0,0.9),0 10px 40px rgba(0,0,0,0.4),0 0 0 10px rgba(255,0,144,0.12); }
      }
    `;
    document.head.appendChild(s);
  }
}

const PINK = "#FF0090";
const MONTHS_S = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const WEEK_DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

type Club = { id: string; name: string; color: string | null; cover_url: string | null; member_count: number };

const SUNDAY_STACK_WOMEN = [
  { name: "Aaliya",  initial: "A", vibes: ["books", "brunch", "jazz"],        bg: "#FFFBF0" },
  { name: "Mira",    initial: "M", vibes: ["gallery", "ceramics"],             bg: "#F0FFF8" },
  { name: "Soleil",  initial: "S", vibes: ["pilates", "coffee bars"],          bg: "#FFF0F8" },
  { name: "Chioma",  initial: "C", vibes: ["fashion", "night out"],            bg: "#F0F4FF" },
  { name: "Reva",    initial: "R", vibes: ["botanical", "slow mornings"],      bg: "#FFFAF0" },
];

const FIRST_MONTH_TASKS = [
  { week: 1, task: "Join 3 clubs",             href: "/member/clubs"    },
  { week: 2, task: "Attend 1 gathering",        href: "/member/discover" },
  { week: 3, task: "Introduce yourself",        href: "/member/match"    },
  { week: 4, task: "Save 5 places in The City", href: "/member/city"     },
];

const TODAY_EVENTS = [
  { time: "9:00 AM",  label: "NEXT",    name: "Pilates Class",    loc: "Brooklyn Studio · Carroll Gardens" },
  { time: "1:00 PM",  label: "",        name: "Lunch with Sofia", loc: "Café Auguste · East Village"      },
  { time: "7:30 PM",  label: "TONIGHT", name: "Girls Dinner",     loc: "Carbone · West Village"           },
];

const TONIGHT_CARDS = [
  {
    image: "/happenings/posters/04_Italian_Dinner_Society.png",
    time: "TONIGHT · 7:30 PM",
    venue: "WEST VILLAGE · CARBONE",
    title: "Girls Dinner.",
    sub: "4 seats remaining",
    href: "/member/happenings",
  },
  {
    image: "/happenings/posters/01_Pilates_Pop_Up.png",
    time: "TONIGHT · 6:00 PM",
    venue: "SOHO · MOVEMENT STUDIO",
    title: "Pilates Pop‑Up.",
    sub: "8 spots left",
    href: "/member/happenings",
  },
  {
    image: "/happenings/posters/03_Jazz_Night.png",
    time: "TONIGHT · 9:00 PM",
    venue: "WEST VILLAGE · SMALLS",
    title: "Jazz Night.",
    sub: "Open doors · free entry",
    href: "/member/happenings",
  },
];

// ── White card base ────────────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 20,
  border: "1.5px solid rgba(255,0,144,0.09)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9) inset",
};

// ── Washi/clear tape strip ─────────────────────────────────────────────────────
function Tape({ style, rotate = 0, width = 56, pink = false }: { style?: React.CSSProperties; rotate?: number; width?: number; pink?: boolean }) {
  return (
    <div style={{
      position: "absolute",
      width, height: 18,
      background: pink ? "rgba(255,180,225,0.62)" : "rgba(255,242,195,0.74)",
      borderRadius: 2,
      transform: `rotate(${rotate}deg)`,
      backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.03) 4px, rgba(0,0,0,0.03) 5px)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.5)",
      zIndex: 10, pointerEvents: "none",
      ...style,
    }} />
  );
}

// ── Push pin ───────────────────────────────────────────────────────────────────
function PushPin({ color = PINK, style }: { color?: string; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", zIndex: 10, pointerEvents: "none", ...style }}>
      <div style={{ width: 13, height: 13, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, white 0%, ${color} 40%)`, boxShadow: `0 2px 6px ${color}55, 0 1px 2px rgba(0,0,0,0.22)` }} />
      <div style={{ width: 2, height: 7, background: "rgba(0,0,0,0.2)", margin: "0 auto", borderRadius: "0 0 1px 1px" }} />
    </div>
  );
}

// ── Pink sticky note ───────────────────────────────────────────────────────────
function StickyNote({ text, author, rotate = 2 }: { text: string; author?: string; rotate?: number }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #FFF0F8 0%, #FFE4F3 100%)",
      padding: "9px 11px 10px",
      borderRadius: 4,
      transform: `rotate(${rotate}deg)`,
      boxShadow: "0 2px 10px rgba(255,0,144,0.15), 0 1px 4px rgba(0,0,0,0.08)",
      maxWidth: 118,
      border: "1px solid rgba(255,0,144,0.13)",
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)", width: 9, height: 9, borderRadius: "50%", background: PINK, boxShadow: "0 1px 5px rgba(255,0,144,0.55)" }} />
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#1A0010", lineHeight: 1.45 }}>{text}</p>
      {author && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "rgba(200,0,100,0.5)", marginTop: 4 }}>— {author}</p>}
    </div>
  );
}

// ── Club cover ─────────────────────────────────────────────────────────────────
function ClubCover({ club }: { club: Club }) {
  const abbr = club.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <Link href="/member/clubs" style={{ textDecoration: "none", flexShrink: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
        <div style={{ width: 62, height: 62, borderRadius: 17, overflow: "hidden", boxShadow: "0 4px 16px rgba(255,0,144,0.2)" }}>
          {club.cover_url
            ? <img src={club.cover_url} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", background: `linear-gradient(145deg, ${PINK}, #FF5BAD)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "white" }}>{abbr}</p>
              </div>
          }
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 600, color: "rgba(255,255,255,0.65)", maxWidth: 66, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: "center" }}>{club.name}</p>
      </div>
    </Link>
  );
}

// ── HomePage ───────────────────────────────────────────────────────────────────
export function HomePage() {
  const [tod,        setTod]       = useState<TimeOfDay>("afternoon");
  const [greeting,   setGreeting]  = useState("Good afternoon");
  const [firstName,  setFirstName] = useState("");
  const [myClubs,    setMyClubs]   = useState<Club[]>([]);
  const [joinedAt,   setJoinedAt]  = useState<string | null>(null);
  const [loading,    setLoading]   = useState(true);
  const [tonightIdx, setTonightIdx] = useState(0);

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
      const { data: profile } = await supabase.from("profiles").select("first_name, avatar_url, created_at").eq("id", user.id).single();
      if (profile) { setFirstName(profile.first_name || ""); setJoinedAt(profile.created_at || null); }
      const { data: uc } = await supabase.from("user_clubs").select("club:clubs(id,name,color,cover_url,member_count)").eq("user_id", user.id).limit(10);
      if (uc) setMyClubs(uc.map((r: Record<string, unknown>) => r.club as Club).filter(Boolean));
      setLoading(false);
    }
    load();
  }, []);

  const today      = new Date();
  const todayDow   = today.getDay();
  const weekDays   = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - todayDow + i);
    return { abbr: WEEK_DAYS[i], date: d.getDate(), isToday: i === todayDow };
  });
  const weeksIn    = joinedAt ? Math.min(4, Math.floor((Date.now() - new Date(joinedAt).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1) : 1;
  const task       = FIRST_MONTH_TASKS[Math.min(weeksIn - 1, 3)];
  const displayName = firstName || (loading ? "…" : "you");
  const monthShort  = MONTHS_S[today.getMonth()];
  const dayOfMonth  = today.getDate();
  const dayAbbr     = WEEK_DAYS[todayDow];
  void tod;

  const nameFontSize = loading ? 48 : Math.max(36, 58 - Math.max(0, (displayName.length - 5) * 3));

  return (
    <div style={{
      background: "linear-gradient(180deg, #060006 0%, #120010 18%, #3A0026 36%, #FF0090 52%, #FFB3D9 74%, #FFF0F8 100%)",
      minHeight: "100vh",
      paddingBottom: 112,
      overflowX: "hidden",
    }}>

      {/* ══ HEADER SHELL ═════════════════════════════════════════════════════════ */}
      <div style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 70px)",
        paddingLeft: 16, paddingRight: 16, paddingBottom: 20,
      }}>

        {/* ── UNIFIED CARD: greeting top + tonight bottom ── */}
        <div style={{
          background: "#000",
          borderRadius: 22,
          overflow: "hidden",
          animation: "cardPulse 4s ease-in-out infinite",
          position: "relative",
        }}>
          {/* Pink glow bottom-right */}
          <div style={{ position: "absolute", bottom: -20, right: -20, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,0,144,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />

          {/* — TOP: Greeting + Date — */}
          <div style={{ padding: "24px 22px 20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
            {/* Left: greeting */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: "13px", letterSpacing: "0.24em", color: PINK, marginBottom: 8 }}>{greeting.toUpperCase()},</p>
              <p style={{
                fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300,
                fontSize: nameFontSize,
                color: "white", lineHeight: 0.84, letterSpacing: "-0.02em",
              }}>{loading ? "…" : `${displayName}.`}</p>
              {!loading && (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.38)", marginTop: 12, letterSpacing: "0.02em" }}>
                  {TODAY_EVENTS.length} things on your calendar today.
                </p>
              )}
            </div>
            {/* Right: date */}
            <div style={{ textAlign: "right" as const, flexShrink: 0, paddingTop: 2, paddingLeft: 10 }}>
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 54, color: "white", lineHeight: 1, letterSpacing: "-0.02em", opacity: 0.88 }}>{dayOfMonth}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: "9px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", marginTop: 3 }}>{dayAbbr}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: "9px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.38)", marginTop: 2 }}>{monthShort}</p>
            </div>
          </div>

          {/* Pink separator */}
          <div style={{ height: 1, background: `linear-gradient(90deg, ${PINK}99, rgba(255,0,144,0.15), transparent)`, margin: "0 20px" }} />

          {/* — BOTTOM: YOUR WEEK mini calendar — */}
          <div style={{ padding: "14px 20px 6px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>YOUR WEEK</p>
            <div style={{ display: "flex", gap: 4 }}>
              {weekDays.map((d, i) => {
                const hasEvent = [1, 3, 5].includes(i);
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: d.isToday ? PINK : "rgba(255,255,255,0.28)", letterSpacing: "0.06em" }}>{d.abbr}</p>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: d.isToday ? PINK : "rgba(255,255,255,0.07)", border: d.isToday ? "none" : "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: d.isToday ? 800 : 600, color: d.isToday ? "white" : "rgba(255,255,255,0.5)" }}>{d.date}</p>
                    </div>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: hasEvent ? PINK : "transparent" }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* — YOUR DAY timeline — */}
          <div style={{ padding: "10px 20px 18px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>YOUR DAY</p>
              <Link href="/member/plans" style={{ textDecoration: "none" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.22)" }}>full schedule →</span>
              </Link>
            </div>
            {TODAY_EVENTS.map((ev, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < TODAY_EVENTS.length - 1 ? 14 : 0 }}>
                <div style={{ width: 36, flexShrink: 0, textAlign: "right" as const }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.32)", lineHeight: 1 }}>{ev.time.split(" ")[0]}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.2)" }}>{ev.time.split(" ")[1]}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: ev.label === "TONIGHT" ? PINK : "rgba(255,255,255,0.3)", boxShadow: ev.label === "TONIGHT" ? `0 0 0 3px rgba(255,0,144,0.18)` : "none" }} />
                  {i < TODAY_EVENTS.length - 1 && <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.08)", marginTop: 3 }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontWeight: 400, fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.1 }}>{ev.name}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.28)", marginTop: 1, overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis" }}>{ev.loc.split(" · ")[0]}</p>
                </div>
                {ev.label === "NEXT" && (
                  <div style={{ flexShrink: 0, background: PINK, borderRadius: 999, padding: "3px 8px" }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.1em" }}>NEXT</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chips row */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, paddingLeft: 2 }}>
          {[
            { href: "/member/happenings", label: "Tonight · 3", bg: "white",   text: PINK    },
            { href: "/member/city",       label: "City · 12",  bg: "#000000", text: "white" },
            { href: "/member/plans",      label: "Plans · 2",  bg: "#000000", text: "white" },
          ].map(c => (
            <Link key={c.href} href={c.href} style={{ textDecoration: "none" }}>
              <div style={{ padding: "11px 24px", borderRadius: 999, background: c.bg, boxShadow: c.bg === "white" ? "0 2px 0 rgba(140,0,50,0.6), 0 5px 16px rgba(0,0,0,0.1)" : "0 2px 0 rgba(0,0,0,0.85), 0 4px 10px rgba(0,0,0,0.18)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 800, color: c.text, letterSpacing: "0.04em" }}>{c.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── SEARCH BAR ── */}
        <Link href="/member/discover" style={{ textDecoration: "none", display: "block", marginTop: 14 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.08)",
            border: "1.5px solid rgba(255,255,255,0.13)",
            borderRadius: 999,
            padding: "13px 18px",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "13px", color: "rgba(255,255,255,0.32)", fontWeight: 500 }}>
              Search events, clubs, places…
            </span>
          </div>
        </Link>
      </div>

      {/* ══ LIVE PULSE ══════════════════════════════════════════════════════════ */}
      <div style={{ display: "flex", overflowX: "auto", gap: 8, padding: "16px 16px 0", scrollbarWidth: "none" as const }}>
        {[
          { text: "Girls Night → 2 seats left",     time: "now" },
          { text: "Italian Dinner Society · tonight", time: "" },
          { text: "14 happenings near SoHo",          time: "" },
          { text: "Book Club starts Wednesday",       time: "3d" },
        ].map((p, i) => (
          <div key={i} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 999, padding: "8px 15px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, flexShrink: 0, boxShadow: `0 0 0 2px rgba(255,0,144,0.22)` }} />
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap" as const }}>{p.text}</span>
            {p.time && <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.24)", marginLeft: 1 }}>{p.time}</span>}
          </div>
        ))}
      </div>

      {/* ══ FEATURED TONIGHT ════════════════════════════════════════════════════ */}
      <div style={{ padding: "20px 16px 0" }}>
        {/* Carousel track */}
        <div
          style={{ position: "relative", touchAction: "pan-y" }}
          onTouchStart={(e) => {
            const t = e.touches[0];
            (e.currentTarget as HTMLElement).dataset.touchX = String(t.clientX);
          }}
          onTouchEnd={(e) => {
            const startX = Number((e.currentTarget as HTMLElement).dataset.touchX ?? 0);
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) {
              setTonightIdx(prev =>
                dx < 0
                  ? Math.min(prev + 1, TONIGHT_CARDS.length - 1)
                  : Math.max(prev - 1, 0)
              );
            }
          }}
        >
          <Link href={TONIGHT_CARDS[tonightIdx].href} style={{ textDecoration: "none" }}>
            <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 220, boxShadow: "0 14px 44px rgba(0,0,0,0.42)" }}>
              <Image
                src={TONIGHT_CARDS[tonightIdx].image}
                alt="Tonight"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
                sizes="(max-width: 520px) 100vw, 520px"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.92) 100%)" }} />
              {/* Top tag */}
              <div style={{ position: "absolute", top: 14, left: 14 }}>
                <div style={{ background: PINK, borderRadius: 999, padding: "5px 14px", display: "inline-flex", boxShadow: `0 2px 8px ${PINK}66` }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 900, color: "white", letterSpacing: "0.12em" }}>{TONIGHT_CARDS[tonightIdx].time}</span>
                </div>
              </div>
              {/* Dots */}
              <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 5 }}>
                {TONIGHT_CARDS.map((_, i) => (
                  <div key={i} style={{ width: i === tonightIdx ? 16 : 5, height: 5, borderRadius: 999, background: i === tonightIdx ? "white" : "rgba(255,255,255,0.4)", transition: "width 0.2s" }} />
                ))}
              </div>
              {/* Bottom content */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px 18px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", marginBottom: 5 }}>{TONIGHT_CARDS[tonightIdx].venue}</p>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontWeight: 400, fontSize: 32, color: "white", lineHeight: 1 }}>{TONIGHT_CARDS[tonightIdx].title}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.38)", marginTop: 4 }}>{TONIGHT_CARDS[tonightIdx].sub}</p>
                  </div>
                  <div style={{ flexShrink: 0, background: PINK, borderRadius: 999, padding: "12px 24px", boxShadow: `0 2px 0 rgba(150,0,55,0.75), 0 6px 18px ${PINK}55` }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 900, color: "white", letterSpacing: "0.06em" }}>JOIN →</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ══ THREE STAT TILES ════════════════════════════════════════════════════ */}
      <div style={{ padding: "14px 16px 0", display: "flex", gap: 9 }}>

        {/* MY FIRST MONTH — stat: week number */}
        <Link href={task.href} style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ ...CARD, padding: "16px 8px 14px", textAlign: "center" as const, position: "relative" }}>
            <PushPin style={{ top: -7, left: "50%", transform: "translateX(-50%)" }} color="#FF5BAD" />
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 44, color: "#000", lineHeight: 1, letterSpacing: "-0.02em" }}>W{weeksIn}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 900, letterSpacing: "0.1em", color: PINK, marginTop: 6 }}>FIRST<br />MONTH</p>
            <div style={{ height: 2, borderRadius: 999, background: "rgba(255,0,144,0.1)", marginTop: 8, overflow: "hidden" }}>
              <div style={{ width: `${(weeksIn / 4) * 100}%`, height: "100%", background: PINK, borderRadius: 999 }} />
            </div>
          </div>
        </Link>

        {/* THIS WEEK — stat: event count */}
        <Link href="/member/happenings" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ ...CARD, padding: "16px 8px 14px", textAlign: "center" as const }}>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 44, color: "#000", lineHeight: 1, letterSpacing: "-0.02em" }}>2</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 900, letterSpacing: "0.1em", color: PINK, marginTop: 6 }}>THIS<br />WEEK</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.36)", marginTop: 8 }}>Next: Wed</p>
          </div>
        </Link>

        {/* CITY VIBES — stat: spots saved + micro photo */}
        <Link href="/member/city" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ ...CARD, overflow: "hidden" }}>
            <div style={{ height: 52, position: "relative", overflow: "hidden" }}>
              <Image
                src="/club gatherings,casual gatherings templates/Event_Sunday_Walk.png"
                alt="City"
                fill
                style={{ objectFit: "cover", objectPosition: "center 30%" }}
                sizes="110px"
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)" }} />
            </div>
            <div style={{ padding: "10px 8px 14px", textAlign: "center" as const }}>
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 36, color: "#000", lineHeight: 1, letterSpacing: "-0.02em" }}>9</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 900, letterSpacing: "0.1em", color: PINK, marginTop: 4 }}>SPOTS<br />SAVED</p>
            </div>
          </div>
        </Link>

      </div>

      {/* ══ VISUAL BREAK ════════════════════════════════════════════════════════ */}
      <div style={{ margin: "32px 0 0", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18))" }} />
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.28em", color: "rgba(255,255,255,0.28)" }}>YOUR WORLD</p>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.18), transparent)" }} />
        </div>
      </div>

      {/* ══ YOUR CLUBS ═══════════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 20px", marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 900, letterSpacing: "0.16em", color: "rgba(255,255,255,0.95)" }}>YOUR CLUBS</p>
            {!loading && myClubs.length > 0 && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>{myClubs.length} joined</p>}
          </div>
          <Link href="/member/clubs" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>Browse all →</span>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", gap: 14, padding: "4px 20px 12px" }}>
            {[1,2,3,4].map(i => <div key={i} style={{ width: 62, height: 62, borderRadius: 17, background: "rgba(255,255,255,0.18)", flexShrink: 0 }} />)}
          </div>
        ) : myClubs.length === 0 ? (
          <div style={{ margin: "0 16px", ...CARD, padding: "30px 22px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <StickyNote text={"find your people ✦"} rotate={-2} />
            </div>
            <p style={{ fontFamily: "var(--font-instrument)", fontSize: 22, fontStyle: "italic", fontWeight: 400, color: "#000", marginBottom: 6 }}>No clubs yet.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.38)", lineHeight: 1.5, marginBottom: 22 }}>There&apos;s a club for every<br />side of you.</p>
            <Link href="/member/clubs" style={{ display: "inline-block", background: PINK, color: "white", padding: "12px 32px", borderRadius: 999, fontSize: 11, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-jost)", boxShadow: `0 3px 0 rgba(150,0,55,0.8), 0 6px 18px ${PINK}44` }}>Browse Clubs →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", overflowX: "auto", padding: "4px 20px 16px", gap: 14, scrollbarWidth: "none" as const }}>
            {myClubs.map(club => <ClubCover key={club.id} club={club} />)}
          </div>
        )}
      </div>

      {/* ══ THE EDIT ════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "28px 0 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 20px", marginBottom: 18 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 900, letterSpacing: "0.16em", color: "rgba(255,255,255,0.95)" }}>THE EDIT</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 17, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>This week&apos;s picks</p>
          </div>
          <Link href="/member/edit" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.38)" }}>SEE ALL →</span>
          </Link>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingLeft: 16, paddingRight: 24, paddingBottom: 12, scrollbarWidth: "none" as const, alignItems: "flex-start" }}>

          {/* WATCHING */}
          <div style={{ flexShrink: 0, width: 168, borderRadius: 16, overflow: "hidden", background: "linear-gradient(160deg, #0E0008 0%, #2A0018 100%)", boxShadow: "0 8px 28px rgba(0,0,0,0.35)", transform: "rotate(-1deg)", padding: "18px 16px 20px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 14 }}>WATCHING</p>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 28, color: "white", lineHeight: 0.92, letterSpacing: "-0.01em", marginBottom: 8 }}>The White<br />Lotus</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>HBO · Season 3</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.38)", lineHeight: 1.4 }}>&ldquo;Thailand. Drama.<br />You&apos;re already late.&rdquo;</p>
          </div>

          {/* READING */}
          <div style={{ flexShrink: 0, width: 168, borderRadius: 16, overflow: "hidden", background: "linear-gradient(160deg, #FFFDF6 0%, #FFF5E8 100%)", boxShadow: "0 8px 28px rgba(0,0,0,0.18)", transform: "rotate(0.8deg)", padding: "18px 16px 20px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: PINK }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 14 }}>READING</p>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 28, color: "#1A0010", lineHeight: 0.92, letterSpacing: "-0.01em", marginBottom: 8 }}>Intermezzo</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(0,0,0,0.42)", marginBottom: 10 }}>Sally Rooney</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.38)", lineHeight: 1.4 }}>&ldquo;Grief, want,<br />and brothers.&rdquo;</p>
          </div>

          {/* OBSESSING OVER */}
          <div style={{ flexShrink: 0, width: 168, borderRadius: 16, overflow: "hidden", background: "linear-gradient(160deg, #FFF0F8 0%, #FFE0EE 100%)", boxShadow: "0 8px 28px rgba(255,0,144,0.14)", transform: "rotate(-0.5deg)", padding: "18px 16px 20px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 14 }}>OBSESSING</p>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 28, color: "#1A0010", lineHeight: 0.92, letterSpacing: "-0.01em", marginBottom: 8 }}>The Row<br />aesthetic</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(0,0,0,0.4)", marginBottom: 10 }}>Quiet luxury</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.38)", lineHeight: 1.4 }}>&ldquo;Rich. Quiet.<br />No logos needed.&rdquo;</p>
          </div>

        </div>
      </div>

      {/* ══ NEAR YOU ═════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 900, letterSpacing: "0.16em", color: "rgba(255,255,255,0.95)" }}>NEAR YOU</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>SoHo, NYC</p>
          </div>
          <Link href="/member/discover" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>EXPLORE MAP →</span>
          </Link>
        </div>
        {/* Polaroid photos — overlapping, pinned-up feel */}
        <div style={{ display: "flex", overflowX: "auto", paddingBottom: 20, paddingLeft: 18, paddingRight: 18, scrollbarWidth: "none" as const, alignItems: "flex-end" }}>
          {[
            { name: "SoHo",         happenings: 4, img: "/happenings/posters/08_Rooftop_Sessions.png",        rot: -3,   zIdx: 5, slug: "soho" },
            { name: "West Village", happenings: 7, img: "/happenings/posters/04_Italian_Dinner_Society.png",  rot:  1.5, zIdx: 4, slug: "west-village" },
            { name: "Williamsburg", happenings: 5, img: "/happenings/posters/06_Dance_All_Night.png",         rot: -1.5, zIdx: 3, slug: "williamsburg" },
            { name: "Brooklyn Hts", happenings: 3, img: "/happenings/posters/07_Sunday_Brunch_Club.png",      rot:  2.5, zIdx: 2, slug: "brooklyn-heights" },
            { name: "Harlem",       happenings: 2, img: "/happenings/posters/09_Bagels_And_Books.png",        rot: -1,   zIdx: 1, slug: "harlem" },
          ].map((n, i) => (
            <Link key={i} href={`/member/city/neighborhoods/${n.slug}`} style={{ textDecoration: "none", flexShrink: 0, marginLeft: i === 0 ? 0 : -32, zIndex: n.zIdx, position: "relative" }}>
              <div style={{
                width: 152, background: "white",
                padding: "8px 8px 0",
                boxShadow: "0 8px 28px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.12)",
                transform: `rotate(${n.rot}deg)`,
                transformOrigin: "bottom center",
                position: "relative",
              }}>
                {i === 0 && <Tape style={{ top: -10, left: "50%", transform: "translateX(-50%) rotate(1deg)" }} width={56} pink />}
                <div style={{ height: 120, position: "relative", overflow: "hidden" }}>
                  <Image src={n.img} alt={n.name} fill style={{ objectFit: "cover", objectPosition: "center top" }} sizes="152px" />
                </div>
                <div style={{ padding: "9px 6px 10px", textAlign: "center" as const }}>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "#1A0010", lineHeight: 1 }}>{n.name}</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.35)", marginTop: 3 }}>{n.happenings} happenings</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ QUOTE — torn magazine clipping pinned to board ════════════════════════ */}
      <div style={{ padding: "28px 22px 44px", display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: "100%", transform: "rotate(-0.8deg)" }}>
          {/* Push pin at top center */}
          <PushPin style={{ top: -7, left: "50%", transform: "translateX(-50%)" }} />
          {/* Clipping body — aged paper */}
          <div style={{
            background: "linear-gradient(160deg, #F5EDD8 0%, #EDE3C8 100%)",
            padding: "28px 24px 24px",
            boxShadow: "0 6px 24px rgba(0,0,0,0.22), 2px 3px 10px rgba(0,0,0,0.12)",
            position: "relative", overflow: "hidden",
            borderBottom: "2px solid rgba(0,0,0,0.06)",
          }}>
            {/* Subtle lined-paper texture */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(transparent, transparent 24px, rgba(0,0,0,0.04) 24px, rgba(0,0,0,0.04) 25px)", pointerEvents: "none" }} />
            {/* Pink margin line on left */}
            <div style={{ position: "absolute", left: 46, top: 0, bottom: 0, width: 1, background: "rgba(255,0,144,0.18)", pointerEvents: "none" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.24em", color: "rgba(0,0,0,0.28)", marginBottom: 14, position: "relative" }}>FROM THE BLOOMBAY JOURNAL</p>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 32, color: "#1A0010", lineHeight: 1.1, letterSpacing: "-0.01em", position: "relative" }}>
              Collect moments,<br />not things.
            </p>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
              <div style={{ height: 1, flex: 1, background: "rgba(0,0,0,0.1)" }} />
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.35)" }}>BloomBay ✦</p>
            </div>
            {/* Tape strip at bottom-right corner — holding it down */}
            <Tape style={{ bottom: -8, right: 24, transform: "rotate(2deg)" }} width={48} />
          </div>
        </div>
      </div>

    </div>
  );
}
