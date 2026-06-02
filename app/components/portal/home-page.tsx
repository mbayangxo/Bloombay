"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BBLogo } from "./bb-logo";
import { getTimeOfDay, getGreeting } from "./time-wrapper";

const openSeats = [
  { id: 1, count: "2", title: "Girls dinner · Carbone", host: "BloomBay Official", detail: "Tonight 7PM · Individual pay", grad: "linear-gradient(160deg,#FF1F7D 0%,#111111 100%)" },
  { id: 2, count: "3", title: "Pilates + matcha morning", host: "Girls Who Move", detail: "Sunday 9AM · $20 · 3 spots", grad: "linear-gradient(160deg,#FF69B4 0%,#111111 100%)" },
  { id: 3, count: "2", title: "MoMA + froyo after", host: "Girl Creatives", detail: "Saturday 2PM · $1 deposit", grad: "linear-gradient(160deg,#FF1F7D 0%,#4A0020 100%)" },
  { id: 4, count: "4", title: "Rooftop wine hour", host: "Soft Life Club NYC", detail: "Friday 7PM · SoHo · Free entry", grad: "linear-gradient(160deg,#FF69B4 0%,#111111 100%)" },
];

const EVENTS_PREVIEW = [
  { title: "Paint + sip + dinner", detail: "Fri 7PM · $65 · 8 seats", host: "BloomBay Official", color: "#FF1F7D", accent: "linear-gradient(180deg,#FF1F7D,#CC0060)" },
  { title: "Book club and sip", detail: "Sat 4PM · $35 · 12 seats", host: "Girl Creatives", color: "#FF69B4", accent: "linear-gradient(180deg,#FF69B4,#E040A0)" },
  { title: "Gym and juice morning", detail: "Sun 8AM · $25 · 10 seats", host: "Girls Who Move", color: "#FF1F7D", accent: "linear-gradient(180deg,#FF1F7D,#111111)" },
];

const CLUBS_PREVIEW = [
  { name: "Soft Life Club NYC", members: "312 women", color: "#FF1F7D" },
  { name: "Girl Tech Collective", members: "89 women", color: "#FF69B4" },
  { name: "Girls Who Move", members: "142 women", color: "#FF1F7D" },
];

const CITY_STATS = [
  { n: "24", label: "active rooms" },
  { n: "312", label: "women online" },
  { n: "7", label: "events tonight" },
];

export function HomePage() {
  const [greeting, setGreeting] = useState("Good morning");
  const [isNight, setIsNight] = useState(false);
  const [socialDismissed, setSocialDismissed] = useState(false);

  useEffect(() => {
    const tod = getTimeOfDay(new Date().getHours());
    setGreeting(getGreeting(tod));
    setIsNight(tod === "night" || tod === "evening");
  }, []);

  const textMuted = isNight ? "rgba(255,255,255,0.5)" : "#888";
  const headingColor = isNight ? "white" : "var(--bb-black)";
  const cardBg = isNight ? "#1A1A1A" : "white";
  const cardBorder = isNight ? "rgba(255,255,255,0.07)" : "transparent";
  const pageBg = isNight ? "#0D0D0D" : "var(--pale-pink-bg)";

  return (
    <div
      className="min-h-screen pb-36 md:pb-10"
      style={{ background: pageBg }}
    >
      {/* ── MOBILE TOP BAR ── */}
      <header className="flex items-center justify-between px-5 pt-12 pb-3 md:hidden">
        <div className="flex items-center gap-2">
          <BBLogo size={26} />
          <span className="text-lg font-bold tracking-tight" style={{ color: headingColor }}>
            Bloom<span style={{ color: "var(--bb-pink)" }}>Bay</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/member/messages"
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: "var(--light-pink)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </Link>
          <Link
            href="/member/notifications"
            className="w-9 h-9 flex items-center justify-center rounded-full relative"
            style={{ background: "var(--light-pink)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "var(--bb-pink)" }} />
          </Link>
          <Link href="/member/lounge">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "var(--bb-pink)", boxShadow: "0 2px 8px rgba(255,31,125,0.4)" }}
            >
              M
            </div>
          </Link>
        </div>
      </header>

      {/* ── DESKTOP HEADER ── */}
      <div className="hidden md:flex items-center justify-between px-8 pt-8 pb-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--bb-pink)" }}>
            Williamsburg, NYC · 72° · Sunny
          </p>
          <p className="text-sm mb-0.5" style={{ color: textMuted }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-4xl font-bold leading-none" style={{ color: headingColor }}>
            {greeting},{" "}
            <span
              className="italic"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
            >
              Maya.
            </span>
          </h1>
          <div className="mt-2 h-0.5 w-16 rounded-full" style={{ background: "var(--bb-pink)" }} />
        </div>
        <div className="flex items-center gap-3">
          {[
            { n: "3", label: "Open seats" },
            { n: "8", label: "Active clubs" },
            { n: "3", label: "Your Bloomies" },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center px-5 py-3 rounded-2xl"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: "0 2px 12px rgba(255,31,125,0.08)" }}
            >
              <p className="font-bold text-xl leading-none" style={{ color: "var(--bb-pink)" }}>{s.n}</p>
              <p className="text-xs mt-1" style={{ color: textMuted }}>{s.label}</p>
            </div>
          ))}
          <Link
            href="/member/messages"
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "var(--light-pink)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </Link>
          <Link
            href="/member/notifications"
            className="w-10 h-10 rounded-full flex items-center justify-center relative"
            style={{ background: "var(--light-pink)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: "var(--bb-pink)" }} />
          </Link>
          <Link
            href="/member/lounge"
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ml-1"
            style={{ background: "var(--bb-pink)", boxShadow: "0 2px 10px rgba(255,31,125,0.4)" }}
          >
            M
          </Link>
        </div>
      </div>

      {/* ── MOBILE GREETING ── */}
      <div className="px-5 pb-2 md:hidden">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--bb-pink)" }}>
          Williamsburg, NYC · 72° · Sunny
        </p>
        <p className="text-xs mb-1" style={{ color: textMuted }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="text-5xl font-bold leading-tight" style={{ color: headingColor }}>{greeting},</h1>
        <h1
          className="text-5xl font-bold italic leading-tight"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
        >
          Maya.
        </h1>
        <div className="mt-2 h-0.5 w-14 rounded-full" style={{ background: "var(--bb-pink)" }} />
      </div>

      {/* ── RIGHT NOW IN YOUR CITY banner ── */}
      <div className="px-5 mb-6 mt-5 md:px-8">
        <div
          className="rounded-2xl px-5 py-3.5 flex items-center gap-6 overflow-x-auto"
          style={{ background: "#111111", scrollbarWidth: "none" }}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase flex-shrink-0" style={{ color: "var(--mid-pink)" }}>
            RIGHT NOW
          </p>
          <div className="w-px h-5 flex-shrink-0" style={{ background: "rgba(255,255,255,0.12)" }} />
          {CITY_STATS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <span className="text-lg font-bold leading-none" style={{ color: "var(--bb-pink)" }}>{s.n}</span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2-col on desktop ── */}
      <div className="md:grid md:grid-cols-[1fr_300px] md:gap-6 md:px-8 md:items-start">

        {/* LEFT */}
        <div>
          {/* THE DAILY card */}
          <div className="px-5 mb-6 md:px-0">
            <div
              className="rounded-3xl relative overflow-hidden"
              style={{
                background: "#111111",
                minHeight: "200px",
                boxShadow: "0 8px 32px rgba(255,31,125,0.18)",
              }}
            >
              {/* Pink glow accent strip */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
                style={{ background: "linear-gradient(180deg,#FF1F7D,#FF69B4)" }}
              />
              {/* Radial glow */}
              <div
                className="absolute top-0 left-0 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 20% 20%, rgba(255,31,125,0.18) 0%, transparent 70%)",
                }}
              />
              {/* Floating logo */}
              <div
                className="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--bb-pink)",
                  boxShadow: "0 4px 16px rgba(255,31,125,0.5)",
                }}
              >
                <BBLogo size={22} light />
              </div>
              <div className="p-6 pr-16">
                <p
                  className="text-[10px] font-bold tracking-widest uppercase mb-4"
                  style={{ color: "var(--mid-pink)" }}
                >
                  ✦ THE DAILY · FROM YANDE
                </p>
                <p
                  className="text-white text-2xl font-bold leading-snug mb-3 italic"
                  style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}
                >
                  Matcha morning in Williamsburg.
                </p>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">
                  Sunday 10AM · 3 seats · $1 deposit · 30% off nearby
                </p>
                <Link
                  href="/member/happenings"
                  className="inline-block px-7 py-3 rounded-full font-semibold text-sm transition-all hover:brightness-110 active:scale-95"
                  style={{
                    background: "var(--bb-pink)",
                    color: "white",
                    boxShadow: "0 4px 16px rgba(255,31,125,0.4)",
                  }}
                >
                  See the Seat →
                </Link>
              </div>
            </div>
          </div>

          {/* Social trigger */}
          {!socialDismissed && (
            <div className="px-5 mb-6 md:px-0">
              <div
                className="rounded-3xl p-5"
                style={{
                  background: "white",
                  border: "2px solid var(--light-pink)",
                  boxShadow: "0 4px 20px rgba(255,31,125,0.07)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                    style={{ background: "#111111" }}
                  >
                    ✦
                  </div>
                  <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#111111" }}>HAPPENING NOW</p>
                </div>
                <p className="text-sm font-semibold leading-snug mb-1" style={{ color: "var(--bb-black)" }}>
                  Aminah and 3 women from African Girls Club are going to{" "}
                  <span style={{ color: "var(--bb-pink)" }}>Jollof + Movie Night Friday.</span>
                </p>
                <p className="text-xs mb-4" style={{ color: "#aaa" }}>Are you coming?</p>
                <div className="flex gap-2">
                  <Link
                    href="/member/happenings"
                    className="flex-1 py-3 rounded-full text-sm font-bold text-center transition-all active:scale-95"
                    style={{
                      background: "var(--bb-pink)",
                      color: "white",
                      boxShadow: "0 4px 14px rgba(255,31,125,0.35)",
                    }}
                  >
                    I&apos;m in →
                  </Link>
                  <button
                    onClick={() => setSocialDismissed(true)}
                    className="px-4 py-3 rounded-full text-sm font-semibold transition-all active:scale-95"
                    style={{ background: "var(--pale-pink-bg)", color: "#aaa" }}
                  >
                    Not this time
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Open Seats — tall horizontal cards */}
          <div className="px-5 mb-7 md:px-0">
            <div className="flex items-center justify-between mb-4">
              <p
                className="text-lg font-bold italic"
                style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
              >
                Open Seats
              </p>
              <Link href="/member/happenings" className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>
                See all →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {openSeats.map((seat) => (
                <Link
                  key={seat.id}
                  href="/member/happenings"
                  className="rounded-2xl overflow-hidden flex"
                  style={{
                    background: cardBg,
                    boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
                    minHeight: "88px",
                  }}
                >
                  {/* Gradient left panel with seat count */}
                  <div
                    className="w-20 flex-shrink-0 flex flex-col items-center justify-center"
                    style={{ background: seat.grad }}
                  >
                    <span
                      className="text-4xl font-bold leading-none text-white"
                      style={{ fontFamily: "var(--font-playfair)", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                    >
                      {seat.count}
                    </span>
                    <span className="text-[9px] font-bold tracking-widest uppercase text-white/70 mt-0.5">SEATS</span>
                  </div>
                  {/* Right panel */}
                  <div className="flex-1 px-4 py-3.5 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-sm leading-snug" style={{ color: headingColor }}>{seat.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: textMuted }}>{seat.host}</p>
                      <p className="text-xs mt-1" style={{ color: "#aaa" }}>{seat.detail}</p>
                    </div>
                    <div className="mt-2">
                      <span
                        className="inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white"
                        style={{
                          background: "var(--bb-pink)",
                          boxShadow: "0 2px 8px rgba(255,31,125,0.3)",
                        }}
                      >
                        Reserve seat
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Plan Something — elegant dark card */}
          <div className="px-5 mb-7 md:px-0">
            <div
              className="rounded-3xl p-6 relative overflow-hidden"
              style={{
                background: "#111111",
                boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              }}
            >
              {/* Radial gradient effect */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at 80% 50%, rgba(255,31,125,0.15) 0%, transparent 65%)",
                }}
              />
              <div className="relative flex items-center gap-5">
                <div className="flex-1">
                  <p
                    className="text-[10px] font-bold tracking-widest uppercase mb-2"
                    style={{ color: "var(--mid-pink)" }}
                  >
                    PLAN SOMETHING
                  </p>
                  <p
                    className="text-white font-bold text-xl italic leading-snug mb-2"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}
                  >
                    4 of your clubs are free this Sunday.
                  </p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                    You could make something happen.
                  </p>
                </div>
                <Link
                  href="/member/happenings"
                  className="flex-shrink-0 px-5 py-3 rounded-full text-sm font-bold transition-all active:scale-95"
                  style={{
                    background: "var(--bb-pink)",
                    color: "white",
                    boxShadow: "0 4px 16px rgba(255,31,125,0.45)",
                  }}
                >
                  Plan it →
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="px-5 mb-6 md:px-0">
            <div className="flex items-center justify-between mb-4">
              <p
                className="text-lg font-bold italic"
                style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
              >
                Upcoming Gatherings
              </p>
              <Link href="/member/happenings" className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>
                See all →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {EVENTS_PREVIEW.map((evt, i) => (
                <Link
                  key={i}
                  href="/member/happenings"
                  className="rounded-2xl overflow-hidden flex items-stretch"
                  style={{
                    background: cardBg,
                    boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
                  }}
                >
                  {/* Colored accent bar */}
                  <div className="w-1.5 flex-shrink-0" style={{ background: evt.accent }} />
                  <div className="flex-1 px-4 py-4 flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex-shrink-0"
                      style={{ background: evt.accent }}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-sm leading-snug" style={{ color: headingColor }}>{evt.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: textMuted }}>{evt.detail}</p>
                      <p className="text-xs font-bold mt-1" style={{ color: "var(--bb-pink)" }}>{evt.host}</p>
                    </div>
                    <span
                      className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2"
                      style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}
                    >
                      RSVP
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — desktop only */}
        <div className="hidden md:flex flex-col gap-5">

          {/* About BloomBay */}
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{ background: "#111111", boxShadow: "0 8px 28px rgba(0,0,0,0.2)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 10% 90%, rgba(255,31,125,0.15) 0%, transparent 65%)",
              }}
            />
            <div className="relative p-5">
              <div className="flex items-center gap-2 mb-3">
                <BBLogo size={22} light />
                <span className="text-white font-bold text-sm tracking-widest uppercase">BloomBay</span>
              </div>
              <p
                className="text-white font-bold text-lg leading-snug mb-2 italic"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}
              >
                The only world built for women.
              </p>
              <p className="text-white/60 text-xs leading-relaxed">
                NYC&apos;s first women-only social platform. Real friendships, live-verified members, city-wide events.
              </p>
            </div>
          </div>

          {/* Girl Clubs spotlight */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p
                className="text-base font-bold italic"
                style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
              >
                Girl Clubs
              </p>
              <Link href="/member/clubs" className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>All clubs →</Link>
            </div>
            <div className="flex flex-col gap-2">
              {CLUBS_PREVIEW.map((club, i) => (
                <Link
                  key={i}
                  href="/member/clubs"
                  className="rounded-2xl p-3.5 flex items-center gap-3"
                  style={{ background: cardBg, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0"
                    style={{ background: `linear-gradient(135deg,${club.color},#111111)` }}
                  />
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: headingColor }}>{club.name}</p>
                    <p className="text-xs" style={{ color: textMuted }}>{club.members}</p>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}
                  >
                    Join
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* The Room teaser */}
          <Link
            href="/member/room"
            className="rounded-3xl p-5 relative overflow-hidden"
            style={{ background: "#111111", boxShadow: "0 8px 28px rgba(0,0,0,0.2)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 90% 10%, rgba(255,105,180,0.15) 0%, transparent 65%)",
              }}
            />
            <div className="relative">
              <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "var(--mid-pink)" }}>
                THE ROOM
              </p>
              <p className="text-white font-bold text-base mb-1">Girl Bar is live now</p>
              <p className="text-white/50 text-xs mb-4 leading-relaxed">8 women in Morning Room · Bulletin has 3 new posts</p>
              <span
                className="inline-block px-5 py-2.5 rounded-full text-xs font-bold"
                style={{ background: "var(--bb-pink)", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.4)" }}
              >
                Enter The Room →
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* MOBILE: clubs preview */}
      <div className="md:hidden px-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p
            className="text-base font-bold italic"
            style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
          >
            Girl Clubs
          </p>
          <Link href="/member/clubs" className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>All →</Link>
        </div>
        <div className="flex flex-col gap-2">
          {CLUBS_PREVIEW.slice(0, 2).map((club, i) => (
            <Link
              key={i}
              href="/member/clubs"
              className="rounded-2xl p-3.5 flex items-center gap-3"
              style={{ background: cardBg, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex-shrink-0"
                style={{ background: `linear-gradient(135deg,${club.color},#111111)` }}
              />
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: headingColor }}>{club.name}</p>
                <p className="text-xs" style={{ color: textMuted }}>{club.members}</p>
              </div>
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}
              >
                Join
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
