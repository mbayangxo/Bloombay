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
  morning:   "linear-gradient(135deg, #E8558A 0%, #C91A6B 60%, #9E1248 100%)",
  afternoon: "linear-gradient(135deg, #D4155C 0%, #E05C9A 50%, #C91A6B 100%)",
  evening:   "linear-gradient(135deg, #3D0A1E 0%, #5C1535 50%, #4A1228 100%)",
  night:     "linear-gradient(135deg, #1A0510 0%, #280B18 55%, #1E0814 100%)",
};

const HERO_GLOW: Record<TimeOfDay, string> = {
  morning:   "radial-gradient(ellipse at 15% 20%, rgba(255,255,255,0.20) 0%, transparent 55%)",
  afternoon: "radial-gradient(ellipse at 80% 15%, rgba(255,255,255,0.16) 0%, transparent 50%)",
  evening:   "radial-gradient(ellipse at 15% 20%, rgba(255,80,140,0.22) 0%, transparent 55%)",
  night:     "radial-gradient(ellipse at 10% 20%, rgba(212,21,92,0.18) 0%, transparent 55%)",
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const INVITATIONS = [
  { id: 1, from: "Aminah",      title: "Girls Dinner · Carbone",     detail: "Tonight 7PM · 2 seats", tag: "TONIGHT",   seal: "A", sealColor: "#9E1A46" },
  { id: 2, from: "Sofia +2",    title: "Pilates + Matcha Morning",   detail: "Sunday 9AM · $20",       tag: "SUNDAY",    seal: "S", sealColor: "#7A2C8C" },
  { id: 3, from: "Girl Creatives", title: "MoMA + Froyo After",      detail: "Saturday 2PM · $1 hold", tag: "SATURDAY",  seal: "GC", sealColor: "#2A6090" },
];

const CITY_EVENTS = [
  { id: 1, label: "TONIGHT · WILLIAMSBURG", title: "Museum Girls",   sub: "Brooklyn Museum after hours",      venue: "200 Eastern Pkwy",      seats: "4 seats", bg: "#D4155C",  textCol: "white" },
  { id: 2, label: "THURSDAY · WEST VILLAGE", title: "Book Society",  sub: "Patti Smith's Just Kids",          venue: "McNally Jackson",        seats: "8 seats", bg: "#111111",  textCol: "white" },
  { id: 3, label: "FRIDAY · SOHO",           title: "Dinner Society", sub: "Long table, longer conversation", venue: "Carbone · 181 Thompson", seats: "2 seats", bg: "#E05C9A",  textCol: "white" },
  { id: 4, label: "SUNDAY · PROSPECT PARK",  title: "Sunday Walk",    sub: "Slow morning. Coffee after.",     venue: "Grand Army Plaza",       seats: "Open",    bg: "#FDFAF5",  textCol: "#111111" },
];

const CLUB_PULSE = [
  { name: "Soft Life Club NYC",   status: "12 women online · buzzing",    live: true,  color: "#E05C9A", crestBg: "#9E1A46" },
  { name: "African Girls Club",   status: "Event coming Friday",           live: false, color: "#D4155C", crestBg: "#7F0030" },
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

// ─── Envelope Invitation Card ──────────────────────────────────────────────────

function EnvelopeCard({
  inv, isNight, headingColor, textMuted,
}: {
  inv: typeof INVITATIONS[0];
  isNight: boolean;
  headingColor: string;
  textMuted: string;
}) {
  const paperBg  = isNight ? "#1C1014" : "#FFFBF6";
  const flapBg   = isNight ? "#251518" : "#F5EEE0";
  const lineBg   = isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <Link href="/member/happenings" style={{ textDecoration: "none" }}>
      <div
        className="relative overflow-visible"
        style={{ fontFamily: "inherit" }}
      >
        {/* Envelope flap */}
        <div
          style={{
            background: flapBg,
            borderRadius: "10px 10px 0 0",
            padding: "6px 14px 10px",
            borderBottom: `1px solid ${lineBg}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.22em", color: "var(--bb-pink)", textTransform: "uppercase" }}>
            BloomBay
          </span>
          <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.16em", color: textMuted, textTransform: "uppercase" }}>
            {inv.tag}
          </span>
        </div>

        {/* Letter body */}
        <div
          style={{
            background: paperBg,
            borderRadius: "0 0 10px 10px",
            padding: "12px 14px 14px",
            boxShadow: isNight ? "0 4px 18px rgba(0,0,0,0.35)" : "0 4px 18px rgba(0,0,0,0.09)",
            border: isNight ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.06)",
            borderTop: "none",
            position: "relative",
          }}
        >
          {/* Wax seal */}
          <div
            style={{
              position: "absolute",
              top: "-13px",
              right: "14px",
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, ${inv.sealColor}CC, ${inv.sealColor})`,
              boxShadow: `0 2px 8px ${inv.sealColor}66`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.9)",
              fontSize: "8px",
              fontWeight: 700,
              border: "1.5px solid rgba(255,255,255,0.25)",
            }}
          >
            {inv.seal}
          </div>

          <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", color: "var(--bb-pink)", textTransform: "uppercase", marginBottom: "5px" }}>
            {inv.from} saved you a seat
          </p>
          <h3
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "12px",
              fontWeight: 900,
              color: headingColor,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              marginBottom: "8px",
            }}
          >
            {inv.title}
          </h3>
          <div style={{ borderTop: `1px dashed ${lineBg}`, marginBottom: "8px" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", color: textMuted }}>{inv.detail}</span>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--bb-pink)" }}>I&apos;m in →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Event Poster Card ─────────────────────────────────────────────────────────

function EventPoster({ ev }: { ev: typeof CITY_EVENTS[0] }) {
  return (
    <Link href={`/member/happenings/${ev.id}`} style={{ textDecoration: "none" }}>
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ height: "180px", background: ev.bg, boxShadow: "0 4px 18px rgba(0,0,0,0.13)" }}
      >
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <p className="text-[9px] font-bold tracking-[0.22em] uppercase"
            style={{ color: ev.textCol === "white" ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.4)" }}>
            {ev.label}
          </p>
          <h3
            className="font-black uppercase"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: ev.textCol, lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            {ev.title}
          </h3>
          <div>
            <p className="text-[9px] mb-1" style={{ color: ev.textCol === "white" ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.38)" }}>{ev.venue}</p>
            <div className="flex items-center justify-between">
              <p className="text-[9px]" style={{ color: ev.textCol === "white" ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.38)" }}>{ev.sub}</p>
              <span className="text-[10px] font-bold" style={{ color: ev.textCol }}>{ev.seats} →</span>
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

  const mood       = CITY_MOOD[tod];
  const isNight    = tod === "evening" || tod === "night";
  const isEvening  = tod === "evening";
  const textMuted  = isNight ? "rgba(255,190,210,0.45)" : "#888";
  const headingColor = isNight ? "rgba(255,245,248,0.92)" : "#111111";
  const cardBg     = isNight ? (isEvening ? "#1A0D10" : "#150A0C") : "white";
  const surfaceBg  = isNight ? (isEvening ? "#160C0E" : "#11080A") : "#FFF5F8";
  const heroBg     = HERO_BG[tod];
  const borderCol  = isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT
          ══════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden min-h-screen pb-24">

        <header className="px-5 pt-14 pb-4">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "var(--bb-pink)" }}>
            {mood.weather} · {mood.temp}
          </p>
          <h1 className="text-4xl font-bold leading-tight mt-1" style={{ color: headingColor }}>
            {greeting},{" "}
            <span className="italic" style={{ fontFamily: "var(--font-instrument)", color: "var(--bb-pink)", fontWeight: 400 }}>
              {firstName}.
            </span>
          </h1>
        </header>

        {/* Hero card — mobile keeps the bigger size */}
        <div className="px-5 mb-6">
          <div className="rounded-3xl relative overflow-hidden"
            style={{ background: heroBg, minHeight: "160px", boxShadow: isNight ? "0 12px 40px rgba(0,0,0,0.4)" : "0 12px 40px rgba(212,21,92,0.3)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: HERO_GLOW[tod] }} />
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
              style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.22))" }} />
            <div className="absolute top-5 right-5 text-right">
              <div className="text-3xl font-bold leading-none text-white"
                style={{ fontFamily: "var(--font-instrument)", textShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
                {mood.women}
              </div>
              <div className="text-[8px] font-bold tracking-[0.2em] uppercase mt-0.5"
                style={{ color: "rgba(255,255,255,0.6)" }}>
                WOMEN TONIGHT
              </div>
            </div>
            <div className="relative p-4 pr-16 flex flex-col justify-between" style={{ minHeight: "160px" }}>
              <div>
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-3"
                  style={{ color: "rgba(255,255,255,0.7)" }}>
                  ✦ {tod === "morning" ? "THIS MORNING" : tod === "afternoon" ? "THIS AFTERNOON" : tod === "evening" ? "THIS EVENING" : "TONIGHT"} IN WILLIAMSBURG
                </p>
                <p className="text-white leading-snug mb-2"
                  style={{ fontFamily: "var(--font-instrument)", fontSize: "1.1rem", fontStyle: "italic" }}>
                  {mood.vibe}
                </p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {mood.weather} · {mood.temp} · Brooklyn
                </p>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <Link href="/member/happenings"
                  className="inline-block px-5 py-2 rounded-full font-bold text-sm"
                  style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(8px)" }}>
                  See what&apos;s on →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* City events — right under hero */}
        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold italic"
              style={{ fontFamily: "var(--font-instrument)", color: headingColor, fontSize: "1.1rem" }}>
              Your city, your week
            </h2>
            <Link href="/member/happenings" className="text-xs font-bold tracking-wider" style={{ color: "var(--bb-pink)" }}>
              The City →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {CITY_EVENTS.map((ev) => <EventPoster key={ev.id} ev={ev} />)}
          </div>
        </div>

        {/* Yande says */}
        <div className="px-5 mb-5">
          <div className="rounded-2xl px-5 py-4 flex items-start gap-3" style={{ background: surfaceBg }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "var(--bb-pink)" }}>
              <span style={{ color: "white", fontSize: "11px" }}>✦</span>
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "var(--bb-pink)" }}>Yande says</p>
              <p className="text-sm leading-relaxed" style={{ color: headingColor }}>
                You haven&apos;t chosen a club yet. I saved three that match your energy — Soft Life, African Girls Club, and Girl Creatives.
              </p>
            </div>
          </div>
        </div>

        {/* Invitations — envelope style, mobile */}
        <div className="px-5 mb-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold italic"
              style={{ fontFamily: "var(--font-instrument)", color: headingColor, fontSize: "1.1rem" }}>
              Your invitations
            </h2>
            <Link href="/member/happenings" className="text-xs font-bold tracking-wider" style={{ color: "var(--bb-pink)" }}>
              All →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {INVITATIONS.map((inv) => (
              <EnvelopeCard key={inv.id} inv={inv} isNight={isNight} headingColor={headingColor} textMuted={textMuted} />
            ))}
          </div>
        </div>

        {/* Witness */}
        {witnessShown && (
          <div className="px-5 mb-6">
            <Link href="/member/match" style={{ textDecoration: "none" }}>
              <div className="rounded-2xl p-5 relative"
                style={{ background: cardBg, border: "1px solid rgba(212,21,92,0.1)", boxShadow: "0 4px 20px rgba(212,21,92,0.07)" }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#D4155C,#9E1A46)" }}>K</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold" style={{ color: headingColor }}>Kezia A.</p>
                      <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded"
                        style={{ background: "var(--bb-pink)", color: "white" }}>witnessed you</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                      &ldquo;She makes every table feel full. She showed up for us when we were just 12 women.&rdquo;
                    </p>
                  </div>
                  <button onClick={(e) => { e.preventDefault(); setWitnessShown(false); }}
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: isNight ? "rgba(255,255,255,0.08)" : "#F0E8E4" }}>
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke={textMuted} strokeWidth="1.5" strokeLinecap="round">
                      <path d="M1 1l8 8M9 1l-8 8"/>
                    </svg>
                  </button>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Lobby teaser — mobile */}
        <div className="px-5 mb-6">
          <Link href="/member/room" className="block rounded-3xl p-5 relative overflow-hidden"
            style={{ background: isNight ? (isEvening ? "#1C1410" : "#141010") : "#111111" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 85% 15%, rgba(224,92,154,0.18) 0%, transparent 60%)" }} />
            <div className="relative">
              <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#E05C9A" }}>THE LOBBY</p>
              <p className="text-white font-bold text-base mb-1">Girl Bar is live now</p>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                8 women in The Wall · 3 new posts · Someone is asking about Morocco
              </p>
              <span className="inline-block px-5 py-2.5 rounded-full text-xs font-bold"
                style={{ background: "var(--bb-pink)", color: "white" }}>
                Enter the Lobby →
              </span>
            </div>
          </Link>
        </div>

        {/* Clubs — mobile */}
        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold italic"
              style={{ fontFamily: "var(--font-instrument)", color: headingColor, fontSize: "1.1rem" }}>
              Your clubs, right now
            </h2>
            <Link href="/member/clubs" className="text-xs font-bold" style={{ color: "var(--bb-pink)" }}>All →</Link>
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
                    {club.live && <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "var(--bb-pink)" }} />}
                    <p className="text-xs truncate" style={{ color: club.live ? "var(--bb-pink)" : textMuted }}>{club.status}</p>
                  </div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT — 3-panel app shell
          ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex md:flex-col" style={{ height: "100vh" }}>

        {/* ── TOP BAR ── */}
        <div
          className="flex items-center gap-5 px-8 flex-shrink-0"
          style={{
            height: "72px",
            borderBottom: `1px solid ${borderCol}`,
          }}
        >
          {/* Greeting */}
          <h1 style={{ fontFamily: "var(--font-instrument)", fontSize: "22px", color: headingColor, lineHeight: 1, fontWeight: 500, flexShrink: 0 }}>
            {greeting},{" "}
            <em style={{ color: "var(--bb-pink)", fontWeight: 400 }}>{firstName}.</em>
          </h1>

          <div style={{ width: "1px", height: "28px", background: borderCol, flexShrink: 0 }} />

          {/* Quick filters */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {["Tonight", "This week", "Clubs", "Friends"].map((f) => (
              <span key={f}
                className="text-[11px] font-semibold px-3 py-1 rounded-full cursor-pointer"
                style={{ background: surfaceBg, color: textMuted }}>
                {f}
              </span>
            ))}
          </div>

          {/* Mood statement — right side, same row as portal icons */}
          <div className="flex-1 flex justify-end items-center" style={{ marginRight: "360px" }}>
            <div className="text-right">
              <p style={{ fontFamily: "var(--font-instrument)", fontSize: "19px", fontStyle: "italic", color: headingColor, lineHeight: 1.1, fontWeight: 500 }}>
                {mood.weather}
              </p>
              <p className="font-bold tracking-widest mt-0.5" style={{ fontSize: "13px", color: "var(--bb-pink)", letterSpacing: "0.1em" }}>
                {mood.temp} · {mood.women} women active
              </p>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT PANEL — 220px */}
          <div
            className="flex-shrink-0 overflow-y-auto"
            style={{ width: "220px", borderRight: `1px solid ${borderCol}`, padding: "20px 16px" }}
          >
            {/* Yande nudge */}
            <div className="rounded-2xl p-4 mb-4"
              style={{ background: surfaceBg }}>
              <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "var(--bb-pink)" }}>✦ Yande says</p>
              <p className="text-xs leading-relaxed" style={{ color: headingColor }}>
                Three clubs match your energy — Soft Life, African Girls Club, and Girl Creatives.
              </p>
              <Link href="/member/clubs"
                className="inline-block mt-3 text-[10px] font-bold"
                style={{ color: "var(--bb-pink)" }}>
                Explore clubs →
              </Link>
            </div>

            {/* Your clubs */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase" style={{ color: textMuted }}>Your clubs</p>
              <Link href="/member/clubs" className="text-[10px] font-bold" style={{ color: "var(--bb-pink)" }}>All →</Link>
            </div>
            <div className="flex flex-col gap-2 mb-5">
              {CLUB_PULSE.map((club, i) => (
                <Link key={i} href="/member/clubs"
                  className="rounded-xl p-3 flex items-center gap-2.5"
                  style={{ background: cardBg, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <MiniCrest name={club.name} color={club.color} crestBg={club.crestBg} size={34} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[11px] truncate" style={{ color: headingColor }}>{club.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {club.live && <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "var(--bb-pink)" }} />}
                      <p className="text-[10px] truncate" style={{ color: club.live ? "var(--bb-pink)" : textMuted }}>{club.status}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Morocco teaser */}
            <Link href="/member/match"
              className="block rounded-xl p-3 flex items-start gap-2"
              style={{ background: cardBg, border: isNight ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(212,21,92,0.08)" }}>
              <span className="text-xl flex-shrink-0">🌍</span>
              <div>
                <p className="font-bold text-xs" style={{ color: headingColor }}>Morocco · October</p>
                <p className="text-[10px] mt-0.5" style={{ color: textMuted }}>7 women planning · Join</p>
              </div>
            </Link>
          </div>

          {/* CENTER — flex-1 */}
          <div className="flex-1 overflow-y-auto" style={{ padding: "20px 24px" }}>

            {/* ── COMPACT HERO STRIP ── */}
            <div
              className="rounded-2xl overflow-hidden mb-6 relative"
              style={{
                background: heroBg,
                height: "80px",
                boxShadow: isNight ? "0 8px 28px rgba(0,0,0,0.35)" : "0 8px 28px rgba(212,21,92,0.28)",
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: HERO_GLOW[tod] }} />
              <div className="absolute inset-0 flex items-center px-6 gap-4">
                <p className="text-[9px] font-bold tracking-[0.26em] uppercase flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.7)" }}>
                  ✦ {tod === "morning" ? "THIS MORNING" : tod === "afternoon" ? "THIS AFTERNOON" : tod === "evening" ? "THIS EVENING" : "TONIGHT"}
                </p>
                <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                <p className="flex-1 text-white font-medium text-sm truncate"
                  style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
                  {mood.vibe}
                </p>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-2xl font-bold leading-none text-white"
                      style={{ fontFamily: "var(--font-instrument)" }}>
                      {mood.women}
                    </div>
                    <div className="text-[8px] font-bold tracking-[0.18em] uppercase"
                      style={{ color: "rgba(255,255,255,0.55)" }}>
                      OUT NOW
                    </div>
                  </div>
                  <Link href="/member/happenings"
                    className="flex-shrink-0 px-4 py-1.5 rounded-full font-bold text-xs"
                    style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(8px)", whiteSpace: "nowrap" }}>
                    See what&apos;s on →
                  </Link>
                </div>
              </div>
            </div>

            {/* ── INVITATIONS — envelope cards ── */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold italic"
                  style={{ fontFamily: "var(--font-instrument)", color: headingColor, fontSize: "1.1rem" }}>
                  Your invitations
                </h2>
                <Link href="/member/happenings" className="text-xs font-bold tracking-wider" style={{ color: "var(--bb-pink)" }}>
                  All happenings →
                </Link>
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {INVITATIONS.map((inv) => (
                  <EnvelopeCard key={inv.id} inv={inv} isNight={isNight} headingColor={headingColor} textMuted={textMuted} />
                ))}
              </div>
            </div>

            {/* ── CITY EVENTS — poster grid ── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold italic"
                  style={{ fontFamily: "var(--font-instrument)", color: headingColor, fontSize: "1.1rem" }}>
                  Your city, your week
                </h2>
                <Link href="/member/happenings" className="text-xs font-bold tracking-wider" style={{ color: "var(--bb-pink)" }}>
                  The City →
                </Link>
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                {CITY_EVENTS.map((ev) => <EventPoster key={ev.id} ev={ev} />)}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — 260px */}
          <div
            className="flex-shrink-0 overflow-y-auto"
            style={{ width: "260px", borderLeft: `1px solid ${borderCol}`, padding: "20px 16px" }}
          >
            {/* Witness */}
            {witnessShown && (
              <Link href="/member/match" style={{ textDecoration: "none" }}>
                <div className="rounded-2xl p-4 mb-4 relative"
                  style={{ background: cardBg, border: "1px solid rgba(212,21,92,0.1)", boxShadow: "0 4px 16px rgba(212,21,92,0.07)" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#D4155C,#9E1A46)" }}>K</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-bold" style={{ color: headingColor }}>Kezia A.</p>
                        <span className="text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded"
                          style={{ background: "var(--bb-pink)", color: "white" }}>witnessed</span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                        &ldquo;She showed up when we had 12 members. She&apos;s the real one.&rdquo;
                      </p>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); setWitnessShown(false); }}
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: isNight ? "rgba(255,255,255,0.08)" : "#F0E8E4" }}>
                      <svg width="7" height="7" viewBox="0 0 10 10" fill="none" stroke={textMuted} strokeWidth="1.5" strokeLinecap="round">
                        <path d="M1 1l8 8M9 1l-8 8"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            )}

            {/* Yande pick */}
            <div className="rounded-2xl overflow-hidden mb-4 relative"
              style={{
                background: isNight ? (isEvening ? "#1E0E12" : "#18090C") : "#FFF0F5",
                border: isNight ? "none" : "1px solid rgba(212,21,92,0.10)",
                boxShadow: isNight ? "0 6px 22px rgba(0,0,0,0.25)" : "0 4px 18px rgba(212,21,92,0.10)",
              }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: isNight ? "radial-gradient(ellipse at 10% 85%, rgba(158,26,70,0.25) 0%, transparent 60%)" : "none" }} />
              <div className="relative p-4">
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-2"
                  style={{ color: isNight ? "#E05C9A" : "var(--bb-pink)" }}>
                  ✦ YANDE PICKED THIS
                </p>
                <p className="font-bold text-sm leading-snug mb-1 italic"
                  style={{ fontFamily: "var(--font-instrument)", fontWeight: 500, color: isNight ? "white" : "#111111" }}>
                  Matcha morning in Williamsburg
                </p>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: textMuted }}>
                  Sunday 10AM · 3 seats · $1 deposit. The girls who went last week are going back.
                </p>
                <Link href="/member/happenings"
                  className="inline-block px-4 py-2 rounded-full font-bold text-xs"
                  style={{ background: "var(--bb-pink)", color: "white", boxShadow: "0 3px 12px rgba(212,21,92,0.35)" }}>
                  See the seat →
                </Link>
              </div>
            </div>

            {/* Lobby */}
            <Link href="/member/room" className="block rounded-2xl p-4 relative overflow-hidden mb-4"
              style={{ background: isNight ? (isEvening ? "#1C1410" : "#141010") : "#111111", boxShadow: "0 6px 20px rgba(0,0,0,0.2)" }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 85% 15%, rgba(224,92,154,0.14) 0%, transparent 60%)" }} />
              <div className="relative">
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#E05C9A" }}>THE LOBBY</p>
                <p className="text-white font-bold text-sm mb-1">Girl Bar is live · 8 women</p>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                  3 new posts in The Wall. Someone is asking about Morocco.
                </p>
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: "var(--bb-pink)", color: "white" }}>Enter →</span>
              </div>
            </Link>

            {/* Concierge / travel */}
            <Link href="/member/match"
              className="block rounded-2xl p-4"
              style={{ background: cardBg, boxShadow: "0 3px 14px rgba(0,0,0,0.07)", border: isNight ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(212,21,92,0.08)" }}>
              <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "var(--bb-pink)" }}>✈ TRAVEL CIRCLE</p>
              <p className="font-bold text-sm" style={{ color: headingColor }}>Morocco in October</p>
              <p className="text-xs mt-1 mb-3" style={{ color: textMuted }}>7 women planning · Casual interest group</p>
              <span className="text-[10px] font-bold" style={{ color: "var(--bb-pink)" }}>Join via Connect →</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
