"use client";

import { useState } from "react";
import Link from "next/link";
import { BBLogo } from "./bb-logo";

const TONIGHT = [
  { id: 1, tag: "2 SEATS LEFT", title: "Coffee Walk", location: "Williamsburg", time: "10:00 AM", grad: "linear-gradient(160deg,#2d1a26 0%,#5a1a35 100%)" },
  { id: 2, tag: "3 SPOTS LEFT", title: "Museum Girls", location: "The Met", time: "2:00 PM", grad: "linear-gradient(160deg,#1a1a2e 0%,#3d1a4a 100%)" },
  { id: 3, tag: "1 SEAT LEFT", title: "Dinner Society", location: "West Village", time: "7:30 PM", grad: "linear-gradient(160deg,#2a0a1a 0%,#6b1a3a 100%)" },
];

const OBJECTS = [
  { key: "seat", label: "THE SEAT", sub: "Every gathering starts with a seat." },
  { key: "bouquet", label: "THE BOUQUET", sub: "Your people. Your world." },
  { key: "pass", label: "THE PASS", sub: "Your access to your world." },
  { key: "ticket", label: "THE TICKET", sub: "Your invitation to real experiences." },
  { key: "postcard", label: "THE POSTCARD", sub: "Collect memories worth keeping." },
];

const CLUBS = [
  { name: "DINNER\nSOCIETY", dark: false, icon: "wine" },
  { name: "MUSEUM\nGIRLS", dark: false, icon: "museum" },
  { name: "BOOK\nCLUB", dark: false, icon: "book", outline: true },
  { name: "WELLNESS\nCIRCLE", dark: false, icon: "lotus" },
  { name: "SUNDAY\nWALKS", dark: false, icon: "walk", outline: true },
  { name: "TRAVEL\nGIRLS", dark: true, icon: "plane" },
];

function ObjectCard({ k }: { k: string }) {
  const base = "rounded-2xl flex items-center justify-center";
  if (k === "seat") return (
    <div className={`${base} w-full h-36`} style={{ background: "linear-gradient(135deg,#FF1F7D,#c40060)" }}>
      <svg viewBox="0 0 48 48" width="60" height="60" fill="none">
        <rect x="10" y="8" width="28" height="18" rx="4" stroke="white" strokeWidth="1.8" />
        <rect x="8" y="24" width="32" height="6" rx="2" stroke="white" strokeWidth="1.8" />
        <line x1="14" y1="30" x2="12" y2="42" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="34" y1="30" x2="36" y2="42" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="16" y1="30" x2="15" y2="42" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
        <line x1="32" y1="30" x2="33" y2="42" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      </svg>
    </div>
  );
  if (k === "bouquet") return (
    <div className={`${base} w-full h-36`} style={{ background: "#FFF0F5" }}>
      <svg viewBox="0 0 48 48" width="60" height="60" fill="none">
        <circle cx="20" cy="16" r="6" stroke="#FF1F7D" strokeWidth="1.8" />
        <circle cx="30" cy="14" r="5" stroke="#FF1F7D" strokeWidth="1.8" />
        <circle cx="24" cy="22" r="5" stroke="#FF1F7D" strokeWidth="1.8" />
        <circle cx="15" cy="22" r="4" stroke="#FF69B4" strokeWidth="1.6" />
        <circle cx="32" cy="21" r="4" stroke="#FF69B4" strokeWidth="1.6" />
        <path d="M18 28 Q24 32 30 28 L28 42 Q24 44 20 42 Z" stroke="#FF1F7D" strokeWidth="1.8" fill="#FFE0EE" />
        <path d="M22 34 Q24 36 26 34" stroke="#FF1F7D" strokeWidth="1.2" />
      </svg>
    </div>
  );
  if (k === "pass") return (
    <div className={`${base} w-full h-36 flex-col gap-1`} style={{ background: "#FF1F7D" }}>
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-5 h-5 rounded-full border border-white/50 flex items-center justify-center">
          <span className="text-white font-bold text-xs">B</span>
        </div>
        <span className="text-white text-xs font-bold tracking-widest">BLOOMBAY</span>
      </div>
      <p className="text-white font-bold text-sm tracking-widest">PASS</p>
      <div className="mt-1 border-t border-white/20 pt-1 text-center">
        <p className="text-white/70 text-xs tracking-wider">YOUR CITY</p>
        <p className="text-white/70 text-xs tracking-wider">YOUR PEOPLE</p>
        <p className="text-white/70 text-xs tracking-wider">YOUR WORLD</p>
      </div>
    </div>
  );
  if (k === "ticket") return (
    <div className={`${base} w-full h-36 flex-col relative overflow-hidden`} style={{ background: "#FFF5F8", border: "1.5px solid #FF1F7D" }}>
      <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-between py-2 pl-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-2 h-1.5 rounded-sm" style={{ background: "#FF1F7D" }} />
        ))}
      </div>
      <div className="ml-6 text-center px-2">
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
        <p className="font-bold text-sm" style={{ color: "#1A0514" }}>TICKET</p>
        <div className="w-6 h-px mx-auto my-1" style={{ background: "#FF1F7D" }} />
        <p className="text-xs text-gray-500">ADMIT ONE</p>
        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mx-auto mt-1" style={{ borderColor: "#FF1F7D" }}>
          <span className="text-xs font-bold" style={{ color: "#FF1F7D" }}>BB</span>
        </div>
      </div>
    </div>
  );
  if (k === "postcard") return (
    <div className={`${base} w-full h-36 flex-col items-start p-3 relative`} style={{ background: "#FDF8F2", border: "1.5px solid #e8d8cc" }}>
      <div className="absolute top-2 right-2 w-8 h-10 border" style={{ borderColor: "#FF1F7D" }}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#FF1F7D" }}>
            <span className="text-white text-xs font-bold">B</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end">
        <div className="w-12 h-px mb-0.5" style={{ background: "#e8d8cc" }} />
        <div className="w-16 h-px mb-0.5" style={{ background: "#e8d8cc" }} />
        <div className="w-10 h-px mb-0.5" style={{ background: "#e8d8cc" }} />
        <div className="w-14 h-px mb-2" style={{ background: "#e8d8cc" }} />
        <p className="text-xs italic" style={{ fontFamily: "var(--font-playfair)", color: "#c4a898" }}>Wish you were here!</p>
      </div>
    </div>
  );
  return null;
}

function ClubCrest({ name, dark, icon, outline }: { name: string; dark: boolean; outline?: boolean; icon: string }) {
  const bg = dark ? "#1A0514" : outline ? "white" : "#FF1F7D";
  const stroke = dark ? "#FF1F7D" : outline ? "#FF1F7D" : "white";
  const textColor = dark || !outline ? "white" : "#1A0514";
  const border = outline ? "2px solid #FF1F7D" : "none";

  const icons: Record<string, React.ReactNode> = {
    wine: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={stroke} strokeWidth="1.8"><path d="M8 2h8l-2 8a4 4 0 01-4 0L8 2zM12 10v10M9 20h6" strokeLinecap="round" /></svg>,
    museum: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={stroke} strokeWidth="1.8"><rect x="3" y="10" width="18" height="11" rx="1" /><path d="M3 10l9-7 9 7" strokeLinecap="round" /><rect x="9" y="14" width="6" height="7" /></svg>,
    book: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={stroke} strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>,
    lotus: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={stroke} strokeWidth="1.8"><path d="M12 22c-4-2-8-6-8-10a8 8 0 0116 0c0 4-4 8-8 10z" /><path d="M12 22V12" /><path d="M8 16c1-2 2-3 4-4" /><path d="M16 16c-1-2-2-3-4-4" /></svg>,
    walk: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={stroke} strokeWidth="1.8"><path d="M13 4a1 1 0 100-2 1 1 0 000 2z" fill={stroke} /><path d="M7 20l3-6 3 3 2-4 3 3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    plane: <svg viewBox="0 0 24 24" width="22" height="22" fill={stroke}><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>,
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Shield/crest shape */}
      <div
        className="relative flex flex-col items-center justify-center"
        style={{
          width: "100px",
          height: "112px",
          background: bg,
          clipPath: "polygon(50% 0%, 100% 15%, 100% 65%, 50% 100%, 0% 65%, 0% 15%)",
          border,
        }}
      >
        <div className="flex flex-col items-center gap-1 px-2">
          {icons[icon]}
          <p className="text-center font-bold leading-tight whitespace-pre-line" style={{ fontSize: "8px", color: textColor, letterSpacing: "0.08em" }}>
            {name}
          </p>
          <div className="w-6 h-3 rounded-full flex items-center justify-center mt-0.5" style={{ background: "rgba(255,255,255,0.15)" }}>
            <span style={{ fontSize: "6px", color: stroke, fontWeight: 700 }}>BB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#FDF8F2", fontFamily: "var(--font-jost)" }}>

      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b" style={{ borderColor: "#f0e8e0" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <BBLogo size={32} />
            <span className="font-bold text-base tracking-widest" style={{ color: "#1A0514" }}>BLOOMBAY</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {["ABOUT", "CLUBS", "SAFETY", "CLUB OWNERS", "PARTNERS"].map((item) => (
              <Link key={item} href="#" className="text-xs font-semibold tracking-widest transition-colors hover:text-pink-500" style={{ color: "#888" }}>
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/portals" className="hidden md:block text-xs font-semibold tracking-widest" style={{ color: "#888" }}>
              LOG IN
            </Link>
            <Link
              href="/onboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-widest text-white transition-all hover:brightness-110 active:scale-95"
              style={{ background: "#FF1F7D" }}
            >
              JOIN NOW
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </Link>
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t px-6 py-4 flex flex-col gap-3" style={{ background: "white", borderColor: "#f0e8e0" }}>
            {["ABOUT", "CLUBS", "SAFETY", "CLUB OWNERS", "PARTNERS"].map((item) => (
              <Link key={item} href="#" className="text-sm font-semibold tracking-widest py-1" style={{ color: "#888" }}>{item}</Link>
            ))}
            <Link href="/portals" className="text-sm font-semibold tracking-widest py-1" style={{ color: "#888" }}>LOG IN</Link>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden" style={{ background: "#FDF8F2", minHeight: "92vh" }}>
        {/* BIG PINK CIRCLE — prominent, overflows left edge */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "min(90vw, 820px)",
            height: "min(90vw, 820px)",
            background: "#FF1F7D",
            borderRadius: "50%",
            left: "min(-20vw, -160px)",
            top: "-60px",
            zIndex: 1,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-16 grid md:grid-cols-2 gap-8 items-center min-h-[85vh]">

          {/* LEFT: text over the circle */}
          <div className="relative">
            {/* Asterisk mark */}
            <div className="mb-6">
              <span className="text-2xl font-light" style={{ color: "rgba(255,255,255,0.6)" }}>✳</span>
            </div>

            <h1 className="mb-6 leading-[0.95]">
              <span className="block font-bold text-white" style={{ fontSize: "clamp(52px, 9vw, 88px)" }}>Women</span>
              <span className="block font-bold italic text-white" style={{ fontSize: "clamp(52px, 9vw, 88px)", fontFamily: "var(--font-playfair)", fontWeight: 400 }}>are</span>
              <span className="block font-bold text-white" style={{ fontSize: "clamp(52px, 9vw, 88px)" }}>gathering.</span>
            </h1>

            <div className="mb-6">
              {["DINNER RESERVATIONS.", "MUSEUM GIRLS.", "BOOK CLUBS.", "SUNDAY WALKS."].map((line) => (
                <p key={line} className="font-bold tracking-widest text-white/80" style={{ fontSize: "11px", lineHeight: "1.9" }}>{line}</p>
              ))}
            </div>

            <div className="w-10 h-px mb-4" style={{ background: "rgba(255,255,255,0.4)" }} />

            <p className="text-white/80 font-medium" style={{ fontSize: "15px", maxWidth: "280px" }}>
              A city of women is already happening.
            </p>

            <div className="flex gap-3 mt-8">
              <Link
                href="/onboard"
                className="px-7 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all hover:bg-white/90 active:scale-95"
                style={{ background: "white", color: "#FF1F7D" }}
              >
                Join BloomBay
              </Link>
              <Link
                href="/portals"
                className="px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide border transition-all hover:border-white/50"
                style={{ borderColor: "rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.8)" }}
              >
                Log in
              </Link>
            </div>
          </div>

          {/* RIGHT: scattered objects */}
          <div className="hidden md:block relative" style={{ height: "520px" }}>
            {/* Pink peonies / bouquet */}
            <div
              className="absolute rounded-3xl flex items-center justify-center overflow-hidden"
              style={{ width: "200px", height: "220px", top: "0px", right: "60px", background: "linear-gradient(135deg,#ff9ec4,#FF1F7D)", transform: "rotate(-3deg)", zIndex: 3 }}
            >
              <svg viewBox="0 0 80 80" width="130" height="130" fill="none">
                {[
                  [40, 20, 14], [24, 28, 11], [54, 26, 12], [32, 38, 13], [50, 36, 11], [40, 46, 10],
                ].map(([cx, cy, r], i) => (
                  <circle key={i} cx={cx} cy={cy} r={r} stroke="white" strokeWidth="1.4" fill={i % 2 === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"} />
                ))}
                <path d="M34 58 Q40 62 46 58 L44 72 Q40 74 36 72 Z" stroke="white" strokeWidth="1.4" fill="rgba(255,255,255,0.2)" />
              </svg>
            </div>

            {/* BloomBay Pass card */}
            <div
              className="absolute rounded-2xl p-4 flex flex-col justify-between"
              style={{ width: "140px", height: "190px", background: "#FF1F7D", top: "160px", right: "10px", transform: "rotate(4deg)", zIndex: 4, boxShadow: "0 8px 32px rgba(255,31,125,0.35)" }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full border-2 border-white/60 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">B</span>
                </div>
                <span className="text-white/80 font-bold tracking-widest" style={{ fontSize: "9px" }}>BLOOMBAY</span>
              </div>
              <div>
                <p className="text-white font-bold tracking-widest" style={{ fontSize: "13px" }}>PASS</p>
                <div className="mt-2 pt-2 border-t border-white/20">
                  {["YOUR CITY", "YOUR PEOPLE", "YOUR WORLD"].map((l) => (
                    <p key={l} className="text-white/60 font-semibold" style={{ fontSize: "8px", letterSpacing: "0.12em", lineHeight: 1.7 }}>{l}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* "See you Saturday!" note */}
            <div
              className="absolute rounded-2xl p-4 flex flex-col justify-center"
              style={{ width: "130px", height: "110px", background: "#FDF8F2", top: "260px", right: "170px", transform: "rotate(-6deg)", zIndex: 5, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
            >
              <p className="italic font-medium" style={{ fontFamily: "var(--font-playfair)", color: "#1A0514", fontSize: "16px", lineHeight: 1.3 }}>See you Saturday!</p>
              <p className="mt-2 text-lg" style={{ color: "#FF1F7D" }}>♡</p>
            </div>

            {/* Museum Girls ticket */}
            <div
              className="absolute rounded-xl overflow-hidden"
              style={{ width: "160px", height: "90px", top: "380px", right: "60px", transform: "rotate(2deg)", zIndex: 4, background: "#FFF5F8", border: "1.5px solid #FF1F7D", boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-7 flex flex-col justify-between py-1.5 pl-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2 rounded-sm" style={{ background: "#FF1F7D" }} />
                ))}
              </div>
              <div className="ml-7 p-2.5">
                <p className="font-bold" style={{ color: "#1A0514", fontSize: "11px" }}>MUSEUM GIRLS</p>
                <p className="text-xs text-gray-500">SAT, MAY 24 · 2:00 PM</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#FF1F7D" }} />
                  <p className="text-xs font-bold" style={{ color: "#FF1F7D" }}>2 SEATS LEFT</p>
                </div>
              </div>
            </div>

            {/* Wax seal */}
            <div
              className="absolute w-12 h-12 rounded-full flex items-center justify-center"
              style={{ top: "460px", right: "240px", background: "#FF1F7D", transform: "rotate(-12deg)", zIndex: 3, boxShadow: "0 2px 12px rgba(255,31,125,0.4)" }}
            >
              <span className="text-white font-bold" style={{ fontSize: "14px" }}>BB</span>
            </div>

            {/* City photo placeholder */}
            <div
              className="absolute rounded-2xl overflow-hidden"
              style={{ width: "100px", height: "130px", top: "60px", right: "290px", transform: "rotate(5deg)", zIndex: 2, background: "linear-gradient(160deg,#2d1a26,#8b2252)", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
            >
              <div className="w-full h-full flex flex-col justify-end p-2">
                <div className="w-full h-2 rounded-sm opacity-30 mb-1" style={{ background: "white" }} />
                <div className="w-3/4 h-2 rounded-sm opacity-20" style={{ background: "white" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile hero CTA */}
        <div className="md:hidden px-6 pb-10 relative z-10">
          <div className="flex gap-3">
            <Link href="/onboard" className="flex-1 py-3.5 rounded-full text-center font-bold text-sm text-white" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}>
              Join
            </Link>
            <Link href="/portals" className="flex-1 py-3.5 rounded-full text-center font-semibold text-sm border" style={{ borderColor: "rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.8)" }}>
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TONIGHT ON BLOOMBAY ─── */}
      <section className="py-16 px-6 md:px-10" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[220px_1fr] gap-10 items-start">
            {/* Left label */}
            <div className="pt-2">
              <h2 className="font-bold leading-tight mb-2" style={{ fontSize: "clamp(24px, 3.5vw, 34px)", color: "#1A0514" }}>
                Tonight on{" "}
                <span style={{ color: "#FF1F7D" }}>BloomBay</span>
                {" "}<span style={{ color: "#FF1F7D" }}>✳</span>
              </h2>
              <div className="w-10 h-0.5 mb-4" style={{ background: "#FF1F7D" }} />
              <p className="text-sm leading-relaxed" style={{ color: "#888" }}>
                Real plans.<br />Real women.<br />Real memories.
              </p>
            </div>

            {/* Event cards */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {TONIGHT.map((ev) => (
                <div key={ev.id} className="flex-shrink-0 rounded-2xl overflow-hidden group cursor-pointer" style={{ width: "200px" }}>
                  <div className="relative" style={{ height: "200px", background: ev.grad }}>
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "#FF1F7D", color: "white" }}>
                      {ev.tag}
                    </div>
                  </div>
                  <div className="pt-3 pb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-sm leading-snug" style={{ color: "#1A0514" }}>{ev.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#888" }}>{ev.location} · {ev.time}</p>
                    </div>
                    <Link
                      href="/member/happenings"
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
                      style={{ background: "#FF1F7D" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </Link>
                  </div>
                </div>
              ))}

              {/* "And more tonight." */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center" style={{ width: "120px" }}>
                <p className="italic text-center" style={{ fontFamily: "var(--font-playfair)", color: "#888", fontSize: "18px", lineHeight: 1.3 }}>
                  And more tonight.
                </p>
                <Link href="/member/happenings" className="mt-3 flex items-center gap-1 text-xs font-bold" style={{ color: "#FF1F7D" }}>
                  See all <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="#FF1F7D" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE WORLD OF BLOOMBAY ─── */}
      <section className="py-16 px-6 md:px-10" style={{ background: "#FDF8F2" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[220px_1fr] gap-10 items-start">
            <div className="pt-2">
              <h2 className="font-bold leading-tight mb-2" style={{ fontSize: "clamp(24px, 3.5vw, 34px)", color: "#1A0514" }}>
                The world of{" "}
                <span style={{ color: "#FF1F7D" }}>BloomBay</span>
                {" "}<span style={{ color: "#FF1F7D" }}>✳</span>
              </h2>
              <div className="w-10 h-0.5 mb-4" style={{ background: "#FF1F7D" }} />
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#888" }}>
                Every detail.<br />Designed for<br />real life together.
              </p>
              <Link href="#" className="text-xs font-bold tracking-widest flex items-center gap-2" style={{ color: "#FF1F7D" }}>
                LEARN MORE
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="#FF1F7D" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {OBJECTS.map((obj) => (
                <div key={obj.key} className="flex-shrink-0" style={{ width: "150px" }}>
                  <ObjectCard k={obj.key} />
                  <div className="mt-3">
                    <p className="font-bold tracking-widest" style={{ fontSize: "10px", color: "#1A0514" }}>{obj.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#888" }}>{obj.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CLUBS ─── */}
      <section className="py-16 px-6 md:px-10" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[220px_1fr] gap-10 items-center">
            <div>
              <h2 className="font-bold leading-tight mb-2" style={{ fontSize: "clamp(24px, 3.5vw, 34px)", color: "#1A0514" }}>
                Clubs that feel like home.
                {" "}<span style={{ color: "#FF1F7D" }}>✳</span>
              </h2>
              <div className="w-10 h-0.5 mb-4" style={{ background: "#FF1F7D" }} />
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#888" }}>
                Find your people.<br />Build your world.
              </p>
              <Link href="/member/clubs" className="text-xs font-bold tracking-widest flex items-center gap-2" style={{ color: "#FF1F7D" }}>
                EXPLORE CLUBS
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="#FF1F7D" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </Link>
            </div>

            <div className="flex gap-5 flex-wrap md:flex-nowrap overflow-x-auto pb-2">
              {CLUBS.map((club, i) => (
                <ClubCrest key={i} name={club.name} dark={club.dark} outline={club.outline} icon={club.icon} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="relative overflow-hidden py-16 px-6 flex flex-col items-center justify-center" style={{ background: "#FF1F7D", minHeight: "200px" }}>
        {/* Decorative peonies hint — top right */}
        <div className="absolute right-0 top-0 w-48 h-48 pointer-events-none opacity-20">
          <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
        </div>
        <div className="relative text-center">
          <p className="font-bold text-white mb-6" style={{ fontSize: "clamp(28px, 5vw, 46px)", fontFamily: "var(--font-jost)" }}>
            Your place is{" "}
            <span className="italic" style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}>here.</span>
          </p>
          <Link
            href="/onboard"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-sm tracking-widest transition-all hover:bg-white/90 active:scale-95"
            style={{ background: "white", color: "#FF1F7D" }}
          >
            JOIN NOW
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="#FF1F7D" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: "#FDF8F2", borderTop: "1px solid #ecddd4" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <BBLogo size={28} />
                <span className="font-bold text-sm tracking-widest" style={{ color: "#1A0514" }}>BLOOMBAY</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">A world built for women.</p>
              <div className="flex gap-3">
                {["IG", "TK", "PT"].map((s) => (
                  <div key={s} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#FFE0EE", color: "#FF1F7D" }}>{s}</div>
                ))}
              </div>
            </div>

            {[
              { title: "ABOUT", links: ["Our Story", "Safety", "Careers", "Press"] },
              { title: "COMMUNITY", links: ["Blog", "Events", "BloomBay IRL"] },
              { title: "CLUB OWNERS", links: ["Start a Club", "Host Resources"] },
              { title: "PARTNERS", links: ["Partner With Us", "Venue Directory"] },
              { title: "SUPPORT", links: ["Help Center", "Contact Us", "FAQ"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "#1A0514" }}>{col.title}</p>
                {col.links.map((link) => (
                  <Link key={link} href="#" className="block text-xs mb-2 transition-colors hover:text-pink-500" style={{ color: "#999" }}>{link}</Link>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderColor: "#ecddd4" }}>
            <p className="text-xs" style={{ color: "#bbb" }}>© 2025 BloomBay, Inc. All rights reserved.</p>
            <div className="flex gap-5">
              <Link href="#" className="text-xs" style={{ color: "#bbb" }}>Privacy Policy</Link>
              <Link href="#" className="text-xs" style={{ color: "#bbb" }}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
