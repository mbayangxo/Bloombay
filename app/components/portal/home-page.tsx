"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BBLogo } from "./bb-logo";
import { getTimeOfDay, getGreeting } from "./time-wrapper";

const LIVE_PULSE = [
  { emoji: "☕", text: "Matcha Thursday is happening NOW · Williamsburg" },
  { emoji: "✈️", text: "Morocco group — 2 women joined in the last hour" },
  { emoji: "🏃‍♀️", text: "Sunday run confirmed · Prospect Park · 8AM" },
  { emoji: "🍷", text: "Soft Life wine hour — 6 seats left · SoHo" },
  { emoji: "📚", text: "Book club thread is active · West Village" },
];

const SEATS = [
  {
    id: 1,
    who: "Aminah saved you a spot",
    event: "Girls dinner · Carbone",
    detail: "Tonight 7PM · 2 seats · Individual pay",
    grad: "linear-gradient(135deg,#FF1F7D,#4A0020)",
  },
  {
    id: 2,
    who: "Sofia and 2 others are going",
    event: "Pilates + matcha morning",
    detail: "Sunday 9AM · $20 · 3 spots left",
    grad: "linear-gradient(135deg,#FF69B4,#111111)",
  },
  {
    id: 3,
    who: "Girl Creatives are going",
    event: "MoMA + froyo after",
    detail: "Saturday 2PM · $1 deposit hold",
    grad: "linear-gradient(135deg,#FF1F7D,#111111)",
  },
];

const CLUB_PULSE = [
  { name: "Soft Life Club NYC", status: "🔥 Buzzing — 12 women online", members: "312" },
  { name: "Girl Tech Collective", status: "Quiet tonight", members: "89" },
  { name: "Girls Who Move", status: "⚡ Planning something — 5 active", members: "142" },
  { name: "African Girls Club", status: "🎉 Event coming up Friday", members: "204" },
];

export function HomePage() {
  const [greeting, setGreeting] = useState("Good morning");
  const [isNight, setIsNight] = useState(false);
  const [witnessShown, setWitnessShown] = useState(true);

  useEffect(() => {
    const tod = getTimeOfDay(new Date().getHours());
    setGreeting(getGreeting(tod));
    setIsNight(tod === "night" || tod === "evening");
  }, []);

  const textMuted = isNight ? "rgba(255,255,255,0.5)" : "#888";
  const headingColor = isNight ? "white" : "#111111";
  const cardBg = isNight ? "#1A1A1A" : "white";
  const pageBg = isNight ? "#0D0D0D" : "var(--pale-pink-bg)";

  return (
    <div className="min-h-screen pb-36 md:pb-10" style={{ background: pageBg }}>

      {/* ── MOBILE TOP BAR ── */}
      <header className="flex items-center justify-between px-5 pt-12 pb-3 md:hidden">
        <div className="flex items-center gap-2">
          <BBLogo size={26} />
          <span className="text-lg font-bold tracking-tight" style={{ color: headingColor }}>
            Bloom<span style={{ color: "#FF1F7D" }}>Bay</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/member/messages"
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: isNight ? "#1A1A1A" : "#FFE0EC" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </Link>
          <Link
            href="/member/notifications"
            className="w-9 h-9 flex items-center justify-center rounded-full relative"
            style={{ background: isNight ? "#1A1A1A" : "#FFE0EC" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#FF1F7D" }} />
          </Link>
          <Link href="/member/lounge">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "#FF1F7D", boxShadow: "0 2px 8px rgba(255,31,125,0.4)" }}>
              M
            </div>
          </Link>
        </div>
      </header>

      {/* ── DESKTOP HEADER ── */}
      <div className="hidden md:flex items-center justify-between px-8 pt-8 pb-2">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#FF1F7D" }}>
            Williamsburg, Brooklyn · Monday evening
          </p>
          <h1 className="text-4xl font-bold leading-none" style={{ color: headingColor }}>
            {greeting},{" "}
            <span className="italic" style={{ fontFamily: "var(--font-playfair)", color: "#FF1F7D", fontWeight: 400 }}>
              Maya.
            </span>
          </h1>
          <p className="text-sm mt-2" style={{ color: textMuted }}>
            The city has plans tonight. So do your girls.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/member/messages"
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: isNight ? "#1A1A1A" : "#FFE0EC" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </Link>
          <Link href="/member/notifications"
            className="w-10 h-10 rounded-full flex items-center justify-center relative"
            style={{ background: isNight ? "#1A1A1A" : "#FFE0EC" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: "#FF1F7D" }} />
          </Link>
          <Link href="/member/lounge"
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ml-1"
            style={{ background: "#FF1F7D", boxShadow: "0 2px 10px rgba(255,31,125,0.4)" }}>
            M
          </Link>
        </div>
      </div>

      {/* ── MOBILE GREETING ── */}
      <div className="px-5 pb-2 mt-1 md:hidden">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#FF1F7D" }}>
          Williamsburg, Brooklyn · Monday evening
        </p>
        <h1 className="text-5xl font-bold leading-tight" style={{ color: headingColor }}>{greeting},</h1>
        <h1 className="text-5xl font-bold italic leading-tight"
          style={{ fontFamily: "var(--font-playfair)", color: "#FF1F7D", fontWeight: 400 }}>
          Maya.
        </h1>
        <p className="text-sm mt-3" style={{ color: textMuted }}>The city has plans tonight. So do your girls.</p>
      </div>

      {/* ── LIVE PULSE STRIP ── */}
      <div className="px-5 mt-5 mb-5 md:px-8">
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-5 overflow-x-auto"
          style={{ background: "#111111", scrollbarWidth: "none" }}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase flex-shrink-0" style={{ color: "#FF69B4" }}>
            LIVE
          </p>
          <div className="w-px h-4 flex-shrink-0" style={{ background: "rgba(255,255,255,0.12)" }} />
          {LIVE_PULSE.map((p, i) => (
            <div key={i} className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-sm">{p.emoji}</span>
              <span className="text-xs whitespace-nowrap" style={{ color: "rgba(255,255,255,0.55)" }}>{p.text}</span>
              {i < LIVE_PULSE.length - 1 && (
                <div className="ml-4 w-px h-3 flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 2-col on desktop ── */}
      <div className="md:grid md:grid-cols-[1fr_296px] md:gap-6 md:px-8 md:items-start">

        {/* LEFT */}
        <div>

          {/* THE SCENE — tonight's main moment */}
          <div className="px-5 mb-5 md:px-0">
            <div
              className="rounded-3xl relative overflow-hidden"
              style={{
                background: "#111111",
                minHeight: "220px",
                boxShadow: "0 8px 32px rgba(255,31,125,0.2)",
              }}
            >
              {/* Pink atmospheric glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 15% 15%, rgba(255,31,125,0.22) 0%, transparent 60%)" }} />
              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.5))" }} />

              {/* Floating seat count */}
              <div className="absolute top-5 right-5 text-right">
                <div className="text-5xl font-bold leading-none text-white"
                  style={{ fontFamily: "var(--font-playfair)", textShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                  18
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase mt-0.5" style={{ color: "#FF69B4" }}>
                  WOMEN TONIGHT
                </div>
              </div>

              <div className="p-6 pr-24 pb-5">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#FF69B4" }}>
                  ✦ TONIGHT IN YOUR CITY
                </p>
                <p className="text-white font-bold leading-snug mb-2"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "1.35rem", fontWeight: 500 }}>
                  Girls dinner at Carbone. Aminah is already there. Sofia just texted she&apos;s on the F train.
                </p>
                <p className="text-white/45 text-sm mb-5 leading-relaxed">
                  2 seats left · Hosted by BloomBay Official · Individual pay
                </p>
                <div className="flex items-center gap-3">
                  <Link href="/member/happenings"
                    className="inline-block px-6 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95"
                    style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 16px rgba(255,31,125,0.45)" }}>
                    See the seat →
                  </Link>
                  <span className="text-white/30 text-xs">BloomBay Official · Tonight 7PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* WITNESS CARD */}
          {witnessShown && (
            <div className="px-5 mb-5 md:px-0">
              <div
                className="rounded-3xl p-5 relative overflow-hidden"
                style={{
                  background: cardBg,
                  border: `1px solid ${isNight ? "rgba(255,31,125,0.2)" : "rgba(255,31,125,0.15)"}`,
                  boxShadow: "0 4px 20px rgba(255,31,125,0.08)",
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Kezia avatar */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#FF1F7D,#111111)" }}>
                    K
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-xs font-bold" style={{ color: headingColor }}>Kezia A.</p>
                      <span className="text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
                        style={{ background: "#FF1F7D", color: "white" }}>
                        witnessed you
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mt-1.5" style={{ color: textMuted }}>
                      &ldquo;Maya is the one who makes everyone feel welcome at every table. She showed up for African Girls Club when we had 12 members. She&apos;s the real one.&rdquo;
                    </p>
                  </div>
                  <button onClick={() => setWitnessShown(false)}
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: isNight ? "rgba(255,255,255,0.08)" : "#F5F5F5", color: textMuted }}>
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                      <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SAVED SEATS — written as invitations */}
          <div className="px-5 mb-6 md:px-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-bold italic"
                style={{ fontFamily: "var(--font-playfair)", color: headingColor }}>
                Your seats are waiting
              </p>
              <Link href="/member/happenings" className="text-sm font-semibold" style={{ color: "#FF1F7D" }}>
                All happenings →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {SEATS.map((seat) => (
                <Link key={seat.id} href="/member/happenings"
                  className="rounded-2xl overflow-hidden flex"
                  style={{ background: cardBg, boxShadow: "0 2px 14px rgba(0,0,0,0.07)", minHeight: "80px" }}>
                  {/* Gradient left panel */}
                  <div className="w-16 flex-shrink-0 flex items-center justify-center"
                    style={{ background: seat.grad }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" opacity={0.7}>
                      <path d="M20 6h-2.18c.07-.44.18-.87.18-1.32A4.675 4.675 0 0 0 13.32 0a4.674 4.674 0 0 0-4.68 4.68c0 .45.11.88.18 1.32H6.5C5.12 6 4 7.12 4 8.5v11C4 20.88 5.12 22 6.5 22h15c1.38 0 2.5-1.12 2.5-2.5v-11C24 7.12 22.88 6 21.5 6H20zm-6.68-4c1.44 0 2.68 1.24 2.68 2.68 0 1.44-1.24 2.68-2.68 2.68-1.44 0-2.68-1.24-2.68-2.68C10.64 3.24 11.88 2 13.32 2z"/>
                    </svg>
                  </div>
                  <div className="flex-1 px-4 py-3.5">
                    <p className="text-xs font-bold mb-0.5" style={{ color: "#FF1F7D" }}>{seat.who}</p>
                    <p className="font-bold text-sm leading-snug" style={{ color: headingColor }}>{seat.event}</p>
                    <p className="text-xs mt-0.5" style={{ color: textMuted }}>{seat.detail}</p>
                  </div>
                  <div className="flex items-center pr-4">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: "#FF1F7D", color: "white", boxShadow: "0 2px 8px rgba(255,31,125,0.3)" }}>
                      I&apos;m in →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* THE LOBBY TEASER — mobile only here, desktop in sidebar */}
          <div className="px-5 mb-6 md:hidden">
            <Link href="/member/room" className="block rounded-3xl p-5 relative overflow-hidden"
              style={{ background: "#111111", boxShadow: "0 8px 28px rgba(0,0,0,0.2)" }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 85% 15%, rgba(255,105,180,0.18) 0%, transparent 60%)" }} />
              <div className="relative">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#FF69B4" }}>
                  THE LOBBY
                </p>
                <p className="text-white font-bold text-base mb-1">Girl Bar is live now</p>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  8 women in The Wall · 3 new posts · Someone is asking about Morocco
                </p>
                <span className="inline-block px-5 py-2.5 rounded-full text-xs font-bold"
                  style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.4)" }}>
                  Enter the Lobby →
                </span>
              </div>
            </Link>
          </div>

          {/* GIRL CLUBS — mobile only (desktop in sidebar) */}
          <div className="px-5 mb-6 md:hidden">
            <div className="flex items-center justify-between mb-3">
              <p className="text-base font-bold italic"
                style={{ fontFamily: "var(--font-playfair)", color: headingColor }}>
                Your clubs, right now
              </p>
              <Link href="/member/clubs" className="text-sm font-semibold" style={{ color: "#FF1F7D" }}>All →</Link>
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
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#FF1F7D" }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── DESKTOP SIDEBAR ── */}
        <div className="hidden md:flex flex-col gap-4">

          {/* Yande's pick */}
          <div className="rounded-3xl overflow-hidden relative"
            style={{ background: "#111111", boxShadow: "0 8px 28px rgba(0,0,0,0.2)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 10% 85%, rgba(255,31,125,0.18) 0%, transparent 65%)" }} />
            <div className="relative p-5">
              <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#FF69B4" }}>
                ✦ FROM YANDE
              </p>
              <p className="text-white font-bold text-base leading-snug mb-2 italic"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}>
                Matcha morning in Williamsburg. Sunday 10AM.
              </p>
              <p className="mb-4 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                3 seats · $1 deposit · 30% off at the café nearby. The girls who went last week are going back.
              </p>
              <Link href="/member/happenings"
                className="inline-block px-5 py-2.5 rounded-full font-bold text-xs transition-all active:scale-95"
                style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.4)" }}>
                See the seat →
              </Link>
            </div>
          </div>

          {/* Enter the Lobby */}
          <Link href="/member/room" className="block rounded-3xl p-5 relative overflow-hidden"
            style={{ background: "#111111", boxShadow: "0 6px 24px rgba(0,0,0,0.2)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 85% 15%, rgba(255,105,180,0.15) 0%, transparent 60%)" }} />
            <div className="relative">
              <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#FF69B4" }}>
                THE LOBBY
              </p>
              <p className="text-white font-bold text-sm mb-1">Girl Bar is live · 8 women</p>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                The Wall has 3 new posts. Someone is asking about Morocco.
              </p>
              <span className="inline-block px-4 py-2 rounded-full text-xs font-bold"
                style={{ background: "#FF1F7D", color: "white", boxShadow: "0 3px 10px rgba(255,31,125,0.4)" }}>
                Enter →
              </span>
            </div>
          </Link>

          {/* Your clubs right now */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold italic"
                style={{ fontFamily: "var(--font-playfair)", color: headingColor }}>
                Your clubs tonight
              </p>
              <Link href="/member/clubs" className="text-xs font-semibold" style={{ color: "#FF1F7D" }}>All →</Link>
            </div>
            <div className="flex flex-col gap-2">
              {CLUB_PULSE.map((club, i) => (
                <Link key={i} href="/member/clubs"
                  className="rounded-2xl p-3.5 flex items-center gap-3"
                  style={{ background: cardBg, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
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

          {/* Connect teaser */}
          <Link href="/member/match"
            className="rounded-3xl p-5 flex items-center gap-4"
            style={{ background: cardBg, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: `1px solid ${isNight ? "rgba(255,255,255,0.07)" : "transparent"}` }}>
            <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl"
              style={{ background: "linear-gradient(135deg,#FF1F7D,#FF69B4)" }}>
              ✈️
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: headingColor }}>Morocco in October</p>
              <p className="text-xs mt-0.5" style={{ color: textMuted }}>7 women planning · Join the conversation</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
