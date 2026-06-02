"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";

const CITY_MOOD: Record<TimeOfDay, { weather: string; temp: string; vibe: string; women: number }> = {
  morning:   { weather: "Golden morning light",  temp: "68°", vibe: "The city is waking up. Coffee breath and good intentions.", women: 6 },
  afternoon: { weather: "Sunny afternoon",        temp: "74°", vibe: "24 women making plans right now.",                          women: 24 },
  evening:   { weather: "Golden hour, Williamsburg", temp: "72°", vibe: "Williamsburg is buzzing. 18 women out tonight.",          women: 18 },
  night:     { weather: "Quiet city, still alive",   temp: "64°", vibe: "17 women still looking for a plan. Still time.",         women: 17 },
};

const INVITATIONS = [
  {
    id: 1,
    from: "Aminah saved you a seat",
    title: "Girls Dinner · Carbone",
    detail: "Tonight 7PM · 2 seats · Individual pay",
    tag: "TONIGHT",
    dark: true,
  },
  {
    id: 2,
    from: "Sofia and 2 others are going",
    title: "Pilates + Matcha Morning",
    detail: "Sunday 9AM · $20 · 3 spots left",
    tag: "SUNDAY",
    dark: false,
  },
  {
    id: 3,
    from: "Girl Creatives are going",
    title: "MoMA + Froyo After",
    detail: "Saturday 2PM · $1 deposit hold",
    tag: "SATURDAY",
    dark: false,
  },
];

const CITY_EVENTS = [
  {
    id: 1,
    label: "TONIGHT · WILLIAMSBURG",
    title: "Museum Girls",
    sub: "Brooklyn Museum after hours",
    venue: "200 Eastern Pkwy",
    seats: "4 seats",
    dark: true,
  },
  {
    id: 2,
    label: "THURSDAY · WEST VILLAGE",
    title: "Book Society",
    sub: "Patti Smith's Just Kids",
    venue: "McNally Jackson",
    seats: "8 seats",
    dark: false,
  },
  {
    id: 3,
    label: "FRIDAY · SOHO",
    title: "Dinner Society",
    sub: "Long table, longer conversation",
    venue: "Carbone · 181 Thompson",
    seats: "2 seats",
    dark: true,
  },
  {
    id: 4,
    label: "SUNDAY · PROSPECT PARK",
    title: "Sunday Walk",
    sub: "Slow morning. Coffee after.",
    venue: "Grand Army Plaza",
    seats: "Open",
    dark: false,
  },
];

const CLUB_PULSE = [
  { name: "Soft Life Club NYC",    status: "🔥 12 women online · buzzing",      members: "312" },
  { name: "Girl Tech Collective",  status: "Quiet tonight",                       members: "89"  },
  { name: "Girls Who Move",        status: "⚡ 5 active · planning something",   members: "142" },
  { name: "African Girls Club",    status: "🎉 Event coming Friday",              members: "204" },
];

export function HomePage({ firstName, initial }: { firstName: string; initial: string }) {
  const [tod, setTod] = useState<TimeOfDay>("morning");
  const [greeting, setGreeting] = useState("Good morning");
  const [witnessShown, setWitnessShown] = useState(true);

  useEffect(() => {
    const t = getTimeOfDay(new Date().getHours());
    setTod(t);
    setGreeting(getGreeting(t));
  }, []);

  const isNight = tod === "night" || tod === "evening";
  const mood = CITY_MOOD[tod];
  const textMuted   = isNight ? "rgba(255,235,220,0.5)" : "#888";
  const headingColor = isNight ? "rgba(255,245,235,0.95)" : "#111111";
  const cardBg      = isNight ? "#2A1E16" : "white";
  const surfaceBg   = isNight ? "#1E1510" : "#F5ECE8";

  return (
    <div className="min-h-screen pb-24 md:pb-12">

      {/* ── TOP BAR ── */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4 md:px-8 md:pt-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>
            {mood.weather} · {mood.temp}
          </p>
          <h1 className="text-4xl font-bold leading-tight mt-1 md:text-5xl" style={{ color: headingColor }}>
            {greeting},{" "}
            <span className="italic" style={{ fontFamily: "var(--font-instrument)", color: "#FF1F7D", fontWeight: 400 }}>
              {firstName}.
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/member/messages"
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: isNight ? "#2A1E16" : "#FFE0EC" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </Link>
          <Link href="/member/notifications"
            className="w-9 h-9 flex items-center justify-center rounded-full relative"
            style={{ background: isNight ? "#2A1E16" : "#FFE0EC" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#FF1F7D" }} />
          </Link>
          <Link href="/member/lounge">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "#FF1F7D", boxShadow: "0 2px 8px rgba(255,31,125,0.4)" }}>
              {initial}
            </div>
          </Link>
        </div>
      </header>

      {/* ── TONIGHT IN WILLIAMSBURG — the city card ── */}
      <div className="px-5 mb-6 md:px-8">
        <div
          className="rounded-3xl relative overflow-hidden"
          style={{
            background: "#1A1008",
            minHeight: "260px",
            boxShadow: "0 16px 48px rgba(255,31,125,0.22), 0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          {/* Atmospheric glow — pink sunrise or night pulse */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 10% 20%, rgba(255,31,125,0.28) 0%, transparent 55%)" }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 90% 80%, rgba(255,105,180,0.12) 0%, transparent 50%)" }} />
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
            style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }} />

          {/* Women count — top right */}
          <div className="absolute top-6 right-6 text-right">
            <div className="text-6xl font-bold leading-none text-white"
              style={{ fontFamily: "var(--font-instrument)", textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
              {mood.women}
            </div>
            <div className="text-[9px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: "#FF69B4" }}>
              WOMEN TONIGHT
            </div>
          </div>

          <div className="relative p-6 pt-7 pr-24 pb-7 flex flex-col justify-between" style={{ minHeight: "260px" }}>
            <div>
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-5" style={{ color: "#FF69B4" }}>
                ✦ TONIGHT IN WILLIAMSBURG
              </p>
              <p
                className="text-white leading-snug mb-2"
                style={{ fontFamily: "var(--font-instrument)", fontSize: "1.5rem", fontStyle: "italic" }}
              >
                {mood.vibe}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                {mood.weather} · {mood.temp} · Brooklyn
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Link href="/member/happenings"
                className="inline-block px-6 py-2.5 rounded-full font-bold text-sm"
                style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 16px rgba(255,31,125,0.5)" }}>
                See what&apos;s on →
              </Link>
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                {tod === "morning" || tod === "afternoon" ? "Plans forming" : "Still time"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── YANDE SAYS — contextual voice ── */}
      <div className="px-5 mb-5 md:px-8">
        <div
          className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{ background: surfaceBg }}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "#FF1F7D" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <div>
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#FF1F7D" }}>
              Yande says
            </p>
            <p className="text-sm leading-relaxed" style={{ color: headingColor }}>
              You haven&apos;t chosen a club yet. I saved three that match your energy — Soft Life, African Girls Club, and Girl Creatives.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2-col on desktop ── */}
      <div className="md:grid md:grid-cols-[1fr_280px] md:gap-6 md:px-8 md:items-start">

        {/* ── LEFT COLUMN ── */}
        <div>

          {/* INVITATIONS — your seats are waiting */}
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

            <div className="flex flex-col gap-3">
              {INVITATIONS.map((inv) => (
                <Link key={inv.id} href="/member/happenings"
                  className="rounded-2xl overflow-hidden flex items-stretch"
                  style={{
                    background: inv.dark ? "#1A1008" : cardBg,
                    boxShadow: inv.dark
                      ? "0 4px 20px rgba(255,31,125,0.15)"
                      : "0 2px 12px rgba(0,0,0,0.07)",
                    minHeight: "88px",
                  }}>
                  {/* Left ticket stub */}
                  <div className="w-14 flex-shrink-0 flex flex-col items-center justify-center relative"
                    style={{ background: "#FF1F7D", borderRight: "2px dashed rgba(255,255,255,0.25)" }}>
                    <span className="text-[8px] font-bold tracking-widest uppercase text-white rotate-[-90deg] whitespace-nowrap">
                      {inv.tag}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 px-4 py-3.5">
                    <p className="text-[10px] font-bold tracking-wider uppercase mb-1"
                      style={{ color: inv.dark ? "#FF69B4" : "#FF1F7D" }}>
                      {inv.from}
                    </p>
                    <p className="font-bold text-sm leading-snug"
                      style={{ color: inv.dark ? "white" : headingColor }}>
                      {inv.title}
                    </p>
                    <p className="text-xs mt-0.5"
                      style={{ color: inv.dark ? "rgba(255,255,255,0.4)" : textMuted }}>
                      {inv.detail}
                    </p>
                  </div>
                  <div className="flex items-center pr-4">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: "#FF1F7D", color: "white" }}>
                      I&apos;m in →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CITY EVENTS — ticket posters */}
          <div className="px-5 mb-7 md:px-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold italic"
                style={{ fontFamily: "var(--font-instrument)", color: headingColor, fontSize: "1.1rem" }}>
                The City, this week
              </h2>
              <Link href="/member/happenings" className="text-xs font-bold tracking-wider" style={{ color: "#FF1F7D" }}>
                The City →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CITY_EVENTS.map((ev) => (
                <Link key={ev.id} href="/member/happenings"
                  className="rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden"
                  style={{
                    background: ev.dark ? "#1A1008" : cardBg,
                    minHeight: "160px",
                    boxShadow: ev.dark
                      ? "0 6px 24px rgba(255,31,125,0.15)"
                      : "0 2px 12px rgba(0,0,0,0.07)",
                  }}>
                  {ev.dark && (
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: "radial-gradient(ellipse at 15% 15%, rgba(255,31,125,0.2) 0%, transparent 60%)" }} />
                  )}
                  <div className="relative">
                    <p className="text-[8px] font-bold tracking-[0.2em] uppercase mb-2"
                      style={{ color: ev.dark ? "#FF69B4" : "#FF1F7D" }}>
                      {ev.label}
                    </p>
                    <p className="font-bold leading-tight"
                      style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: "1.2rem",
                        color: ev.dark ? "white" : headingColor,
                        lineHeight: 1.1,
                      }}>
                      {ev.title}
                    </p>
                    <p className="text-xs mt-1.5 leading-snug"
                      style={{ color: ev.dark ? "rgba(255,255,255,0.4)" : textMuted }}>
                      {ev.sub}
                    </p>
                  </div>
                  <div className="relative mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] font-bold tracking-wider uppercase"
                        style={{ color: ev.dark ? "rgba(255,255,255,0.3)" : "#bbb" }}>
                        {ev.venue}
                      </p>
                      <p className="text-[10px] font-bold mt-0.5" style={{ color: "#FF1F7D" }}>
                        {ev.seats}
                      </p>
                    </div>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: "#FF1F7D" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* WITNESS — mobile only, desktop in sidebar */}
          {witnessShown && (
            <div className="px-5 mb-6 md:hidden">
              <div
                className="rounded-2xl p-5 relative"
                style={{
                  background: cardBg,
                  border: `1px solid rgba(255,31,125,0.15)`,
                  boxShadow: "0 4px 20px rgba(255,31,125,0.07)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#FF1F7D,#111111)" }}>
                    K
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold" style={{ color: headingColor }}>Kezia A.</p>
                      <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded"
                        style={{ background: "#FF1F7D", color: "white" }}>
                        witnessed you
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                      &ldquo;She makes every table feel full. She showed up for us when we were just 12 women. She&apos;s the real one.&rdquo;
                    </p>
                  </div>
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
              style={{ background: "#1A1008" }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 85% 15%, rgba(255,105,180,0.18) 0%, transparent 60%)" }} />
              <div className="relative">
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF69B4" }}>
                  THE LOBBY
                </p>
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

          {/* CLUBS — mobile only */}
          <div className="px-5 mb-6 md:hidden">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold italic"
                style={{ fontFamily: "var(--font-instrument)", color: headingColor, fontSize: "1.1rem" }}>
                Your clubs, right now
              </h2>
              <Link href="/member/clubs" className="text-xs font-bold" style={{ color: "#FF1F7D" }}>All →</Link>
            </div>
            <div className="flex flex-col gap-2">
              {CLUB_PULSE.slice(0, 3).map((club, i) => (
                <Link key={i} href="/member/clubs"
                  className="rounded-2xl p-3.5 flex items-center gap-3"
                  style={{ background: cardBg, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                  <div className="w-9 h-9 rounded-xl flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#FF1F7D,#111111)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: headingColor }}>{club.name}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: textMuted }}>{club.status}</p>
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

          {/* Witness card */}
          {witnessShown && (
            <div className="rounded-2xl p-4 relative"
              style={{
                background: cardBg,
                border: "1px solid rgba(255,31,125,0.15)",
                boxShadow: "0 4px 16px rgba(255,31,125,0.07)",
              }}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#FF1F7D,#111111)" }}>
                  K
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold" style={{ color: headingColor }}>Kezia A.</p>
                    <span className="text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded"
                      style={{ background: "#FF1F7D", color: "white" }}>
                      witnessed
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                    &ldquo;She showed up when we had 12 members. She&apos;s the real one.&rdquo;
                  </p>
                </div>
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

          {/* Yande — desktop pick */}
          <div className="rounded-3xl overflow-hidden relative"
            style={{ background: "#1A1008", boxShadow: "0 8px 28px rgba(0,0,0,0.25)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 10% 85%, rgba(255,31,125,0.2) 0%, transparent 60%)" }} />
            <div className="relative p-5">
              <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#FF69B4" }}>
                ✦ YANDE PICKED THIS
              </p>
              <p className="text-white font-bold text-base leading-snug mb-1 italic"
                style={{ fontFamily: "var(--font-instrument)", fontWeight: 500 }}>
                Matcha morning in Williamsburg
              </p>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
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
            style={{ background: "#1A1008", boxShadow: "0 6px 24px rgba(0,0,0,0.2)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 85% 15%, rgba(255,105,180,0.15) 0%, transparent 60%)" }} />
            <div className="relative">
              <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF69B4" }}>
                THE LOBBY
              </p>
              <p className="text-white font-bold text-sm mb-1">Girl Bar is live · 8 women</p>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                The Wall has 3 new posts. Someone is asking about Morocco.
              </p>
              <span className="inline-block px-4 py-2 rounded-full text-xs font-bold"
                style={{ background: "#FF1F7D", color: "white" }}>
                Enter →
              </span>
            </div>
          </Link>

          {/* Your clubs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold italic"
                style={{ fontFamily: "var(--font-instrument)", color: headingColor }}>
                Your clubs tonight
              </p>
              <Link href="/member/clubs" className="text-xs font-bold" style={{ color: "#FF1F7D" }}>All →</Link>
            </div>
            <div className="flex flex-col gap-2">
              {CLUB_PULSE.map((club, i) => (
                <Link key={i} href="/member/clubs"
                  className="rounded-2xl p-3 flex items-center gap-3"
                  style={{ background: cardBg, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div className="w-8 h-8 rounded-xl flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#FF1F7D,#111111)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs truncate" style={{ color: headingColor }}>{club.name}</p>
                    <p className="text-[11px] mt-0.5 truncate" style={{ color: textMuted }}>{club.status}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Concierge teaser */}
          <Link href="/member/match"
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: cardBg,
              boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              border: `1px solid ${isNight ? "rgba(255,255,255,0.06)" : "transparent"}`,
            }}>
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
