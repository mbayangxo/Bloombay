"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BBLogo } from "./bb-logo";
import { getTimeOfDay, getGreeting } from "./time-wrapper";

const openSeats = [
  { id: 1, badge: "2 SEATS", title: "Girls dinner · Carbone", detail: "Tonight 7PM · Individual pay", grad: "linear-gradient(135deg,#FF1F7D,#111111)" },
  { id: 2, badge: "3 SEATS", title: "Pilates + matcha morning", detail: "Sunday 9AM · $20 · 3 spots", grad: "linear-gradient(135deg,#FF69B4,#111111)" },
  { id: 3, badge: "2 SEATS", title: "MoMA + froyo after", detail: "Saturday 2PM · $1 deposit", grad: "linear-gradient(135deg,#FF1F7D,#111111)" },
  { id: 4, badge: "4 SEATS", title: "Rooftop wine hour", detail: "Friday 7PM · SoHo · Free entry", grad: "linear-gradient(135deg,#FF1F7D,#111111)" },
];

const EVENTS_PREVIEW = [
  { title: "Paint + sip + dinner", detail: "Fri 7PM · $65 · 8 seats", host: "BloomBay Official", color: "#FF1F7D" },
  { title: "Book club and sip", detail: "Sat 4PM · $35 · 12 seats", host: "Girl Creatives", color: "#FF69B4" },
  { title: "Gym and juice morning", detail: "Sun 8AM · $25 · 10 seats", host: "Girls Who Move", color: "#FF1F7D" },
];

const CLUBS_PREVIEW = [
  { name: "Soft Life Club NYC", members: "312 women", color: "#FF1F7D" },
  { name: "Girl Tech Collective", members: "89 women", color: "#FF69B4" },
  { name: "Girls Who Move", members: "142 women", color: "#FF1F7D" },
];

export function HomePage() {
  const [greeting, setGreeting] = useState("Good morning");
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const tod = getTimeOfDay(new Date().getHours());
    setGreeting(getGreeting(tod));
    setIsNight(tod === "night" || tod === "evening");
  }, []);

  const textMuted = isNight ? "rgba(255,255,255,0.5)" : "var(--bb-black)";
  const headingColor = isNight ? "white" : "var(--bb-black)";
  const cardBg = isNight ? "#1A1A1A" : "white";
  const cardBorder = isNight ? "rgba(255,255,255,0.07)" : "transparent";

  return (
    <div
      className="min-h-screen pb-36 md:pb-10"
      style={{ background: "var(--pale-pink-bg)" }}
    >
      {/* ── MOBILE TOP BAR ── */}
      <header className="flex items-center justify-between px-4 pt-12 pb-3 md:hidden">
        <div className="flex items-center gap-2">
          <BBLogo size={26} />
          <span className="text-lg font-bold tracking-tight" style={{ color: headingColor }}>
            Bloom<span style={{ color: "var(--bb-pink)" }}>Bay</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mailbox */}
          <Link
            href="/member/messages"
            className="w-8 h-8 flex items-center justify-center rounded-full relative"
            style={{ background: "var(--light-pink)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            {/* unread dot */}
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--bb-pink)" }} />
          </Link>
          {/* Notifications */}
          <Link
            href="/member/notifications"
            className="w-8 h-8 flex items-center justify-center rounded-full relative"
            style={{ background: "var(--light-pink)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {/* unread dot */}
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--bb-pink)" }} />
          </Link>
          <Link href="/member/lounge">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "var(--bb-pink)" }}
            >
              M
            </div>
          </Link>
        </div>
      </header>

      {/* ── DESKTOP HEADER ── */}
      <div className="hidden md:flex items-center justify-between px-8 pt-8 pb-6">
        <div>
          <p className="text-sm mb-1" style={{ color: textMuted }}>Williamsburg, NYC</p>
          <h1 className="text-3xl font-bold" style={{ color: headingColor }}>
            {greeting},{" "}
            <span className="italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}>Maya.</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {[
            { n: "3", label: "Open seats" },
            { n: "8", label: "Active clubs" },
            { n: "3", label: "Your Bloomies" },
          ].map((s) => (
            <div key={s.label} className="text-center px-4 py-2 rounded-2xl" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }}>
              <p className="font-bold text-lg leading-none" style={{ color: "var(--bb-pink)" }}>{s.n}</p>
              <p className="text-xs mt-0.5" style={{ color: textMuted }}>{s.label}</p>
            </div>
          ))}
          <Link
            href="/member/messages"
            className="w-9 h-9 rounded-full flex items-center justify-center relative"
            style={{ background: "var(--light-pink)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: "var(--bb-pink)" }} />
          </Link>
          <Link
            href="/member/notifications"
            className="w-9 h-9 rounded-full flex items-center justify-center relative"
            style={{ background: "var(--light-pink)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: "var(--bb-pink)" }} />
          </Link>
          <Link href="/member/lounge" className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ml-1" style={{ background: "var(--bb-pink)" }}>M</Link>
        </div>
      </div>

      {/* ── MOBILE GREETING ── */}
      <div className="px-5 pb-4 md:hidden">
        <h1 className="text-4xl font-bold leading-tight" style={{ color: headingColor }}>{greeting},</h1>
        <h1 className="text-4xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}>Maya.</h1>
        <div className="mt-1 h-0.5 w-12 rounded-full" style={{ background: "var(--bb-pink)" }} />
      </div>

      {/* ── 2-col on desktop ── */}
      <div className="md:grid md:grid-cols-[1fr_300px] md:gap-6 md:px-8 md:items-start">

        {/* LEFT */}
        <div>
          {/* THE DAILY card */}
          <div className="px-5 mb-6 md:px-0">
            <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: "#111111" }}>
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--bb-pink)" }}>
                <BBLogo size={20} light />
              </div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--mid-pink)" }}>✦ THE DAILY · FROM YANDE</p>
              <p className="text-white text-2xl font-bold leading-snug mb-1 italic" style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}>
                Matcha morning in Williamsburg.
              </p>
              <p className="text-white/50 text-sm mb-5">Sunday 10AM · 3 seats · $1 deposit · 30% off nearby</p>
              <Link
                href="/member/happenings"
                className="block w-full py-3 rounded-full text-center font-semibold text-sm transition-colors hover:brightness-110"
                style={{ background: "var(--bb-pink)", color: "white" }}
              >
                See the Seat
              </Link>
            </div>
          </div>

          {/* Social trigger */}
          <div className="px-5 mb-4 md:px-0">
            <div
              className="rounded-3xl p-4"
              style={{ background: "white", border: "2px solid var(--light-pink)", boxShadow: "0 1px 8px rgba(255,31,125,0.07)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: "#111111" }}
                >
                  ✦
                </div>
                <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#111111" }}>HAPPENING NOW</p>
              </div>
              <p className="text-sm font-semibold leading-snug mb-0.5" style={{ color: "var(--bb-black)" }}>
                Aminah and 3 women from African Girls Club are going to{" "}
                <span style={{ color: "var(--bb-pink)" }}>Jollof + Movie Night Friday.</span>
              </p>
              <p className="text-xs text-gray-400 mb-3">Are you coming?</p>
              <div className="flex gap-2">
                <Link
                  href="/member/happenings"
                  className="flex-1 py-2.5 rounded-full text-sm font-bold text-center transition-all active:scale-95"
                  style={{ background: "var(--bb-pink)", color: "white" }}
                >
                  I&apos;m in →
                </Link>
                <button
                  className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95"
                  style={{ background: "var(--pale-pink-bg)", color: "#999" }}
                >
                  Not this time
                </button>
              </div>
            </div>
          </div>

          {/* Plan something */}
          <div className="px-5 mb-6 md:px-0">
            <div
              className="rounded-3xl p-4 flex items-center gap-4"
              style={{ background: "linear-gradient(135deg, #111111 0%, #111111 100%)" }}
            >
              <div className="flex-1">
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--mid-pink)" }}>
                  PLAN SOMETHING
                </p>
                <p
                  className="text-white font-bold text-base italic leading-snug"
                  style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}
                >
                  4 of your clubs are free this Sunday.
                </p>
                <p className="text-white/50 text-xs mt-0.5">You could make something happen.</p>
              </div>
              <Link
                href="/member/happenings"
                className="flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95"
                style={{ background: "var(--bb-pink)", color: "white" }}
              >
                Plan it →
              </Link>
            </div>
          </div>

          {/* Open Seats */}
          <div className="px-5 mb-6 md:px-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Open Seats</p>
              <Link href="/member/happenings" className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>See all →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {openSeats.map((seat) => (
                <Link key={seat.id} href="/member/happenings" className="rounded-2xl overflow-hidden bg-white block" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div className="h-20 flex items-end p-2" style={{ background: seat.grad }}>
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>● {seat.badge}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold leading-snug" style={{ color: "var(--bb-black)" }}>{seat.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{seat.detail}</p>
                    <div className="mt-2 w-full py-1.5 rounded-full text-center text-white text-xs font-bold" style={{ background: "var(--bb-pink)" }}>Reserve seat</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="px-5 mb-6 md:px-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Upcoming Gatherings</p>
              <Link href="/member/happenings" className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>See all →</Link>
            </div>
            <div className="flex flex-col gap-3">
              {EVENTS_PREVIEW.map((evt, i) => (
                <Link key={i} href="/member/happenings" className="bg-white rounded-2xl p-4 flex items-center gap-4 block" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: `linear-gradient(135deg,${evt.color},#111111)` }} />
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{evt.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{evt.detail}</p>
                    <p className="text-xs font-bold mt-0.5" style={{ color: "var(--bb-pink)" }}>{evt.host}</p>
                  </div>
                  <span className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2" style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}>RSVP</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — desktop only */}
        <div className="hidden md:flex flex-col gap-5">

          {/* About BloomBay */}
          <div className="rounded-3xl overflow-hidden" style={{ background: "#111111" }}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <BBLogo size={22} light />
                <span className="text-white font-bold text-sm tracking-widest uppercase">BloomBay</span>
              </div>
              <p className="text-white font-bold text-lg leading-snug mb-2 italic" style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}>
                The only world built for women.
              </p>
              <p className="text-white/60 text-xs leading-relaxed">
                NYC's first women-only social platform. Real friendships, live-verified members, city-wide events.
              </p>
            </div>
          </div>

          {/* Girl Clubs spotlight */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Girl Clubs</p>
              <Link href="/member/clubs" className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>All clubs →</Link>
            </div>
            <div className="flex flex-col gap-2">
              {CLUBS_PREVIEW.map((club, i) => (
                <Link key={i} href="/member/clubs" className="bg-white rounded-2xl p-3.5 flex items-center gap-3 block" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: `linear-gradient(135deg,${club.color},#111111)` }} />
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{club.name}</p>
                    <p className="text-xs text-gray-400">{club.members}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}>Join</span>
                </Link>
              ))}
            </div>
          </div>

          {/* The Room teaser */}
          <Link href="/member/room" className="rounded-3xl p-5 block" style={{ background: "#111111" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--mid-pink)" }}>THE ROOM</p>
            <p className="text-white font-bold text-base mb-1">Girl Bar is live now</p>
            <p className="text-white/50 text-xs mb-3">8 women in Morning Room · Bulletin has 3 new posts</p>
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold" style={{ background: "var(--bb-pink)", color: "white" }}>Enter The Room →</span>
          </Link>
        </div>
      </div>

      {/* MOBILE: clubs preview */}
      <div className="md:hidden px-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Girl Clubs</p>
          <Link href="/member/clubs" className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>All →</Link>
        </div>
        <div className="flex flex-col gap-2">
          {CLUBS_PREVIEW.slice(0, 2).map((club, i) => (
            <Link key={i} href="/member/clubs" className="bg-white rounded-2xl p-3.5 flex items-center gap-3 block" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: `linear-gradient(135deg,${club.color},#111111)` }} />
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{club.name}</p>
                <p className="text-xs text-gray-400">{club.members}</p>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}>Join</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
