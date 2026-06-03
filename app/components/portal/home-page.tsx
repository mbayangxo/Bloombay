"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";

// ─── City mood by time ─────────────────────────────────────────────────────────

const CITY_MOOD: Record<TimeOfDay, { weather: string; temp: string; vibe: string; women: number }> = {
  morning:   { weather: "Golden morning light",       temp: "68°", vibe: "The city is waking up. Coffee breath and good intentions.",  women: 6  },
  afternoon: { weather: "Sunny afternoon",             temp: "74°", vibe: "24 women making plans right now.",                           women: 24 },
  evening:   { weather: "Golden hour, Williamsburg",   temp: "72°", vibe: "Williamsburg is buzzing. 18 women out tonight.",             women: 18 },
  night:     { weather: "Quiet city, still alive",     temp: "64°", vibe: "17 women still looking for a plan. Still time.",            women: 17 },
};

// ─── Hero gradient by time ────────────────────────────────────────────────────

const HERO_BG: Record<TimeOfDay, string> = {
  morning:   "linear-gradient(150deg, #FF69B4 0%, #FF1F7D 45%, #C51B7A 100%)",
  afternoon: "linear-gradient(145deg, #FF1F7D 0%, #FF69B4 50%, #FF1F7D 100%)",
  evening:   "linear-gradient(150deg, #C51B7A 0%, #FF1F7D 55%, #FF69B4 100%)",
  night:     "linear-gradient(150deg, #7F0030 0%, #C51B7A 60%, #FF1F7D 100%)",
};

const HERO_GLOW: Record<TimeOfDay, string> = {
  morning:   "radial-gradient(ellipse at 15% 20%, rgba(255,255,255,0.22) 0%, transparent 55%)",
  afternoon: "radial-gradient(ellipse at 80% 15%, rgba(255,255,255,0.18) 0%, transparent 50%)",
  evening:   "radial-gradient(ellipse at 15% 20%, rgba(255,105,180,0.3) 0%, transparent 55%)",
  night:     "radial-gradient(ellipse at 10% 20%, rgba(255,31,125,0.22) 0%, transparent 55%)",
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const INVITATIONS = [
  { id: 1, from: "Aminah saved you a seat",      title: "Girls Dinner · Carbone",     detail: "Tonight 7PM · 2 seats · Individual pay", tag: "TONIGHT"  },
  { id: 2, from: "Sofia and 2 others are going", title: "Pilates + Matcha Morning",   detail: "Sunday 9AM · $20 · 3 spots left",         tag: "SUNDAY"   },
  { id: 3, from: "Girl Creatives are going",     title: "MoMA + Froyo After",         detail: "Saturday 2PM · $1 deposit hold",          tag: "SATURDAY" },
];

const CITY_EVENTS = [
  { id: 1, label: "TONIGHT · WILLIAMSBURG", title: "Museum Girls",   sub: "Brooklyn Museum after hours",      venue: "200 Eastern Pkwy",  seats: "4 seats", gradient: "linear-gradient(160deg, #FF1F7D 0%, #111111 100%)" },
  { id: 2, label: "THURSDAY · WEST VILLAGE", title: "Book Society",  sub: "Patti Smith's Just Kids",          venue: "McNally Jackson",   seats: "8 seats", gradient: "linear-gradient(160deg, #111111 0%, #FF69B4 100%)" },
  { id: 3, label: "FRIDAY · SOHO",          title: "Dinner Society", sub: "Long table, longer conversation",  venue: "Carbone · 181 Thompson", seats: "2 seats", gradient: "linear-gradient(160deg, #FF69B4 0%, #111111 100%)" },
  { id: 4, label: "SUNDAY · PROSPECT PARK", title: "Sunday Walk",    sub: "Slow morning. Coffee after.",      venue: "Grand Army Plaza",  seats: "Open",    gradient: "linear-gradient(160deg, #FF1F7D 0%, #FF69B4 100%)" },
];

const CLUB_PULSE = [
  { name: "Soft Life Club NYC",   status: "12 women online · buzzing",    live: true,  color: "#FF69B4", crestBg: "#C51B7A" },
  { name: "African Girls Club",   status: "Event coming Friday",           live: false, color: "#FF1F7D", crestBg: "#7F0030" },
  { name: "Girls Who Move",       status: "5 active · planning something", live: true,  color: "#F59E0B", crestBg: "#92400E" },
];

// ─── Mini Crest ────────────────────────────────────────────────────────────────

function MiniCrest({ name, color, crestBg, size = 40 }: {
  name: string; color: string; crestBg: string; size?: number;
}) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <div className="flex-shrink-0 relative rounded-full flex items-center justify-center font-bold text-white"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}, ${crestBg})`,
        boxShadow: `0 3px 12px ${color}44, inset 0 1px 0 rgba(255,255,255,0.2)`,
        fontSize: size / 3.2,
      }}>
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: "1.5px solid rgba(255,255,255,0.22)", transform: "scale(0.84)" }} />
      <span className="relative z-10">{initials}</span>
    </div>
  );
}

// ─── Event Poster Card — editorial square ──────────────────────────────────────

const POSTER_THEMES = [
  { bg: "#FF1F7D", text: "white",   muted: "rgba(255,255,255,0.52)" },
  { bg: "#FDFAF5", text: "#111111", muted: "rgba(0,0,0,0.36)"       },
  { bg: "#111111", text: "white",   muted: "rgba(255,255,255,0.45)" },
  { bg: "#FF1F7D", text: "white",   muted: "rgba(255,255,255,0.52)" },
];

function EventPoster({ ev, idx }: { ev: typeof CITY_EVENTS[0]; idx: number }) {
  const theme = POSTER_THEMES[idx % POSTER_THEMES.length];
  return (
    <Link href={`/member/happenings/${ev.id}`} style={{ textDecoration: "none" }}>
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ height: "188px", background: theme.bg, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
      >
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Top — category label */}
          <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: theme.muted }}>
            {ev.label}
          </p>

          {/* Middle — BIG title */}
          <h3
            className="font-black uppercase"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "22px",
              color: theme.text,
              lineHeight: 0.9,
              letterSpacing: "-0.01em",
            }}
          >
            {ev.title}
          </h3>

          {/* Bottom — venue + seats */}
          <div>
            <p className="text-[9px] mb-1" style={{ color: theme.muted }}>{ev.venue}</p>
            <div className="flex items-center justify-between">
              <p className="text-[9px]" style={{ color: theme.muted }}>{ev.sub}</p>
              <span
                className="text-[10px] font-bold"
                style={{ color: theme.text }}
              >
                {ev.seats} →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export function HomePage({ firstName = "there", initial = "M" }: { firstName?: string; initial?: string }) {
  const [tod, setTod] = useState<TimeOfDay>("morning");
  const [greeting, setGreeting] = useState("Good morning");
  const [witnessShown, setWitnessShown] = useState(true);

  useEffect(() => {
    const t = getTimeOfDay(new Date().getHours());
    setTod(t);
    setGreeting(getGreeting(t));
  }, []);

  const mood = CITY_MOOD[tod];
  const isNight      = tod === "evening" || tod === "night";
  const isEvening    = tod === "evening";
  const textMuted    = isNight ? "rgba(215,175,155,0.58)" : "#888";
  const headingColor = isNight ? "rgba(255,238,220,0.92)" : "#111111";
  const cardBg       = isNight ? (isEvening ? "#1E1612" : "#15100C") : "white";
  const surfaceBg    = isNight ? (isEvening ? "#1A1410" : "#120E0A") : "#FFF5F8";
  const heroBg       = HERO_BG[tod];

  return (
    <div className="min-h-screen pb-24 md:pb-12">

      <header className="px-5 pt-20 pb-4 md:px-8 md:pt-10">
        <p className="text-sm font-semibold tracking-[0.12em] uppercase" style={{ color: "#FF1F7D" }}>
          {mood.weather} · {mood.temp}
        </p>
        <h1 className="text-4xl font-bold leading-tight mt-1 md:text-5xl" style={{ color: headingColor }}>
          {greeting},{" "}
          <span className="italic" style={{ fontFamily: "var(--font-instrument)", color: "#FF1F7D", fontWeight: 400 }}>
            {firstName}.
          </span>
        </h1>
      </header>

      {/* ── CITY HERO CARD — time-aware ── */}
      <div className="px-5 mb-6 md:px-8">
        <div className="rounded-3xl relative overflow-hidden"
          style={{ background: heroBg, minHeight: "240px", boxShadow: isNight ? "0 12px 40px rgba(0,0,0,0.4)" : "0 12px 40px rgba(255,31,125,0.35)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: HERO_GLOW[tod] }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 90% 85%, rgba(0,0,0,0.12) 0%, transparent 50%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.25))" }} />

          {/* Women count */}
          <div className="absolute top-6 right-6 text-right">
            <div className="text-6xl font-bold leading-none text-white"
              style={{ fontFamily: "var(--font-instrument)", textShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
              {mood.women}
            </div>
            <div className="text-[9px] font-bold tracking-[0.2em] uppercase mt-0.5"
              style={{ color: "rgba(255,255,255,0.6)" }}>
              {tod === "morning" ? "WOMEN THIS MORNING" : tod === "afternoon" ? "WOMEN OUT TODAY" : "WOMEN TONIGHT"}
            </div>
          </div>

          <div className="relative p-6 pt-7 pr-24 pb-7 flex flex-col justify-between" style={{ minHeight: "240px" }}>
            <div>
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-4"
                style={{ color: "rgba(255,255,255,0.7)" }}>
                ✦ {tod === "morning" ? "THIS MORNING" : tod === "afternoon" ? "THIS AFTERNOON" : tod === "evening" ? "THIS EVENING" : "TONIGHT"} IN WILLIAMSBURG
              </p>
              <p className="text-white leading-snug mb-2"
                style={{ fontFamily: "var(--font-instrument)", fontSize: "1.5rem", fontStyle: "italic" }}>
                {mood.vibe}
              </p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                {mood.weather} · {mood.temp} · Brooklyn
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Link href="/member/happenings"
                className="inline-block px-6 py-2.5 rounded-full font-bold text-sm"
                style={{ background: "rgba(255,255,255,0.22)", color: "white", backdropFilter: "blur(8px)" }}>
                See what&apos;s on →
              </Link>
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                {tod === "morning" || tod === "afternoon" ? "Plans forming" : "Still time"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── YANDE SAYS — compact pill, tap to edit ── */}
      <div className="px-5 mb-5 md:px-8">
        <Link href="/member/clubs">
          <div className="inline-flex items-center gap-2.5 rounded-2xl px-4 py-2.5"
            style={{ background: surfaceBg, maxWidth: "100%" }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#FF1F7D" }}>
              <span style={{ color: "white", fontSize: "10px" }}>✦</span>
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-bold tracking-[0.18em] uppercase mr-1.5" style={{ color: "#FF1F7D" }}>Yande</span>
              <span className="text-xs" style={{ color: headingColor }}>
                You haven&apos;t chosen a club yet — I saved 3 that match you.
              </span>
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </Link>
      </div>

      {/* ── 2-col on desktop ── */}
      <div className="md:grid md:grid-cols-[1fr_320px] md:gap-8 md:px-10 md:items-start">

        {/* ── LEFT COLUMN ── */}
        <div>

          {/* INVITATIONS — ticket stubs */}
          <div className="px-5 mb-7 md:px-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold italic"
                style={{ fontFamily: "var(--font-instrument)", color: headingColor, fontSize: "1.1rem" }}>
                Your invitations
              </h2>
              <Link href="/member/happenings" className="text-xs font-bold tracking-wider" style={{ color: "#FF1F7D" }}>
                All happenings →
              </Link>
            </div>

            {/* Mobile: horizontal scroll; Desktop: 2-col grid */}
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-2"
              style={{ scrollbarWidth: "none" }}>
              {INVITATIONS.map((inv) => (
                <Link key={inv.id} href="/member/happenings" style={{ textDecoration: "none", flexShrink: 0, width: "clamp(260px, 72vw, 300px)" }}
                  className="md:w-auto md:flex-shrink-[unset]">
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "#FDFAF5",
                      boxShadow: "0 3px 16px rgba(0,0,0,0.07)",
                    }}
                  >
                    {/* Ticket header */}
                    <div className="px-5 py-2 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                      <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
                      <p className="text-[9px] font-semibold tracking-[0.15em] uppercase" style={{ color: "#bbb" }}>INVITATION</p>
                      <p className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "#bbb" }}>{inv.tag}</p>
                    </div>
                    {/* Ticket body */}
                    <div className="px-5 pt-3 pb-2">
                      <p className="text-[9px] font-bold tracking-wider uppercase mb-1.5" style={{ color: "#FF1F7D" }}>
                        {inv.from}
                      </p>
                      <h3
                        className="font-black uppercase leading-none"
                        style={{
                          fontFamily: "var(--font-playfair)",
                          fontSize: "18px",
                          color: "#111111",
                          lineHeight: 0.92,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {inv.title}
                      </h3>
                    </div>
                    {/* Perforation + footer */}
                    <div style={{ borderTop: "1.5px dashed rgba(0,0,0,0.08)", margin: "8px 20px" }} />
                    <div className="px-5 pb-3 flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#bbb" }}>{inv.detail}</p>
                      <span className="text-[10px] font-bold" style={{ color: "#111111" }}>I&apos;m in →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CITY EVENTS — editorial poster grid */}
          <div className="px-5 mb-7 md:px-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold italic"
                style={{ fontFamily: "var(--font-instrument)", color: headingColor, fontSize: "1.1rem" }}>
                Your city, your week
              </h2>
              <Link href="/member/happenings" className="text-xs font-bold tracking-wider" style={{ color: "#FF1F7D" }}>
                The City →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CITY_EVENTS.map((ev, idx) => <EventPoster key={ev.id} ev={ev} idx={idx} />)}
            </div>
          </div>

          {/* WITNESS — mobile only — tap to go to exact message */}
          {witnessShown && (
            <div className="px-5 mb-6 md:hidden">
              <div className="rounded-2xl p-5 relative"
                style={{ background: cardBg, border: "1px solid rgba(255,31,125,0.12)", boxShadow: "0 4px 20px rgba(255,31,125,0.07)" }}>
                <div className="flex items-start gap-3">
                  <Link href="/member/messages?witness=kezia" className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#FF1F7D,#C51B7A)" }}>
                      K
                    </div>
                  </Link>
                  <Link href="/member/messages?witness=kezia" className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold" style={{ color: headingColor }}>Kezia A.</p>
                      <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded"
                        style={{ background: "#FF1F7D", color: "white" }}>witnessed you</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                      &ldquo;She makes every table feel full. She showed up for us when we were just 12 women.&rdquo;
                    </p>
                  </Link>
                  <button onClick={() => setWitnessShown(false)}
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: isNight ? "rgba(255,255,255,0.08)" : "#F0E8E4" }}>
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke={textMuted} strokeWidth="1.5" strokeLinecap="round">
                      <path d="M1 1l8 8M9 1l-8 8"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LOBBY TEASER — mobile only */}
          <div className="px-5 mb-6 md:hidden">
            <Link href="/member/room" className="block rounded-3xl p-5 relative overflow-hidden"
              style={{ background: isNight ? (isEvening ? "#1C1410" : "#141010") : "#111111" }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 85% 15%, rgba(255,105,180,0.18) 0%, transparent 60%)" }} />
              <div className="relative">
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF69B4" }}>THE LOBBY</p>
                <p className="text-white font-bold text-base mb-1">Girl Bar is live now</p>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  8 women in The Wall · 3 new posts · Someone is asking about Morocco
                </p>
                <span className="inline-block px-5 py-2.5 rounded-full text-xs font-bold"
                  style={{ background: "#FF1F7D", color: "white" }}>
                  Enter the Lobby →
                </span>
              </div>
            </Link>
          </div>

          {/* YOUR CLUBS — mobile only, with crest seals */}
          <div className="px-5 mb-6 md:hidden">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold italic"
                style={{ fontFamily: "var(--font-instrument)", color: headingColor, fontSize: "1.1rem" }}>
                Your clubs, right now
              </h2>
              <Link href="/member/clubs" className="text-xs font-bold" style={{ color: "#FF1F7D" }}>All →</Link>
            </div>
            <div className="flex flex-col gap-2">
              {CLUB_PULSE.map((club, i) => (
                <Link key={i} href="/member/clubs"
                  className="rounded-2xl p-3.5 flex items-center gap-3"
                  style={{ background: cardBg, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                  <MiniCrest name={club.name} color={club.color} crestBg={club.crestBg} size={40} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: headingColor }}>{club.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {club.live && <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "#FF1F7D" }} />}
                      <p className="text-xs truncate" style={{ color: club.live ? "#FF1F7D" : textMuted }}>{club.status}</p>
                    </div>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── DESKTOP SIDEBAR ── */}
        <div className="hidden md:flex flex-col gap-4">

          {witnessShown && (
            <div className="rounded-2xl p-4 relative"
              style={{ background: cardBg, border: "1px solid rgba(255,31,125,0.12)", boxShadow: "0 4px 16px rgba(255,31,125,0.07)" }}>
              <div className="flex items-start gap-3">
                <Link href="/member/messages?witness=kezia" className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#FF1F7D,#C51B7A)" }}>K</div>
                </Link>
                <Link href="/member/messages?witness=kezia" className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold" style={{ color: headingColor }}>Kezia A.</p>
                    <span className="text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded"
                      style={{ background: "#FF1F7D", color: "white" }}>witnessed</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                    &ldquo;She showed up when we had 12 members. She&apos;s the real one.&rdquo;
                  </p>
                </Link>
                <button onClick={() => setWitnessShown(false)}
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: isNight ? "rgba(255,255,255,0.08)" : "#F0E8E4" }}>
                  <svg width="7" height="7" viewBox="0 0 10 10" fill="none" stroke={textMuted} strokeWidth="1.5" strokeLinecap="round">
                    <path d="M1 1l8 8M9 1l-8 8"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Yande pick */}
          <div className="rounded-3xl overflow-hidden relative"
            style={{
              background: isNight ? (isEvening ? "#1E1612" : "#15100C") : "#FFF0F5",
              boxShadow: isNight ? "0 8px 28px rgba(0,0,0,0.25)" : "0 4px 20px rgba(255,31,125,0.12)",
              border: isNight ? "none" : "1px solid rgba(255,31,125,0.12)",
            }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: isNight ? "radial-gradient(ellipse at 10% 85%, rgba(255,31,125,0.2) 0%, transparent 60%)" : "none" }} />
            <div className="relative p-5">
              <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-3"
                style={{ color: isNight ? "#FF69B4" : "#FF1F7D" }}>
                ✦ YANDE PICKED THIS
              </p>
              <p className="font-bold text-base leading-snug mb-1 italic"
                style={{ fontFamily: "var(--font-instrument)", fontWeight: 500, color: isNight ? "white" : "#111111" }}>
                Matcha morning in Williamsburg
              </p>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: textMuted }}>
                Sunday 10AM · 3 seats · $1 deposit. The girls who went last week are going back.
              </p>
              <Link href="/member/happenings"
                className="inline-block px-5 py-2.5 rounded-full font-bold text-xs"
                style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.4)" }}>
                See the seat →
              </Link>
            </div>
          </div>

          {/* Enter the Lobby */}
          <Link href="/member/room" className="block rounded-3xl p-5 relative overflow-hidden"
            style={{ background: isNight ? (isEvening ? "#1C1410" : "#141010") : "#111111", boxShadow: "0 6px 24px rgba(0,0,0,0.2)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 85% 15%, rgba(255,105,180,0.15) 0%, transparent 60%)" }} />
            <div className="relative">
              <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF69B4" }}>THE LOBBY</p>
              <p className="text-white font-bold text-sm mb-1">Girl Bar is live · 8 women</p>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                The Wall has 3 new posts. Someone is asking about Morocco.
              </p>
              <span className="inline-block px-4 py-2 rounded-full text-xs font-bold"
                style={{ background: "#FF1F7D", color: "white" }}>Enter →</span>
            </div>
          </Link>

          {/* Your clubs with crest seals */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold italic"
                style={{ fontFamily: "var(--font-instrument)", color: headingColor }}>Your clubs tonight</p>
              <Link href="/member/clubs" className="text-xs font-bold" style={{ color: "#FF1F7D" }}>All →</Link>
            </div>
            <div className="flex flex-col gap-2">
              {CLUB_PULSE.map((club, i) => (
                <Link key={i} href="/member/clubs"
                  className="rounded-2xl p-3 flex items-center gap-3"
                  style={{ background: cardBg, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <MiniCrest name={club.name} color={club.color} crestBg={club.crestBg} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs truncate" style={{ color: headingColor }}>{club.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {club.live && <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "#FF1F7D" }} />}
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: club.live ? "#FF1F7D" : textMuted }}>{club.status}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Concierge teaser */}
          <Link href="/member/match"
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: cardBg, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: isNight ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,31,125,0.08)" }}>
            <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg,#FF1F7D,#FF69B4)" }}>
              ✈️
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: headingColor }}>Morocco in October</p>
              <p className="text-xs mt-0.5" style={{ color: textMuted }}>7 women planning · Join via Concierge</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
