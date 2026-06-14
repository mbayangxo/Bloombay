"use client";

import { useState } from "react";
import Link from "next/link";
import { BBLogo } from "./bb-logo";

const PINK  = "#FF1F7D";
const INK   = "#111111";
const IVORY = "#fdf4ec";

const CLUBS = [
  { name: "DINNER\nSOCIETY", dark: false, icon: "wine" },
  { name: "MUSEUM\nGIRLS",   dark: false, icon: "museum" },
  { name: "BOOK\nCLUB",      dark: false, icon: "book", outline: true },
  { name: "WELLNESS\nCIRCLE",dark: false, icon: "lotus" },
  { name: "SUNDAY\nWALKS",   dark: false, icon: "walk", outline: true },
  { name: "TRAVEL\nGIRLS",   dark: true,  icon: "plane" },
];

function Sparkle({ color = PINK, size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ display: "inline", verticalAlign: "middle", flexShrink: 0 }}>
      <path d="M7 1v12M1 7h12M2.5 2.5l9 9M11.5 2.5l-9 9" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ClubCard({ name, dark, icon, outline }: { name: string; dark: boolean; outline?: boolean; icon: string }) {
  const bg     = dark ? "linear-gradient(145deg,#111111 0%,#1e0a14 100%)" : outline ? "white" : `linear-gradient(145deg,${PINK} 0%,#d4006a 100%)`;
  const stroke = dark ? PINK : outline ? PINK : "white";
  const textColor   = dark || !outline ? "white" : INK;
  const borderStyle = outline ? `2px solid ${PINK}` : dark ? "2px solid #333" : "none";
  const icons: Record<string, React.ReactNode> = {
    wine:   <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={stroke} strokeWidth="1.8"><path d="M8 2h8l-2 8a4 4 0 01-4 0L8 2zM12 10v10M9 20h6" strokeLinecap="round" /></svg>,
    museum: <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={stroke} strokeWidth="1.8"><rect x="3" y="10" width="18" height="11" rx="1" /><path d="M3 10l9-7 9 7" strokeLinecap="round" /><rect x="9" y="14" width="6" height="7" /></svg>,
    book:   <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={stroke} strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>,
    lotus:  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={stroke} strokeWidth="1.8"><path d="M12 22c-4-2-8-6-8-10a8 8 0 0116 0c0 4-4 8-8 10z" /><path d="M12 22V12M8 16c1-2 2-3 4-4M16 16c-1-2-2-3-4-4" /></svg>,
    walk:   <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={stroke} strokeWidth="1.8"><path d="M13 4a1 1 0 100-2 1 1 0 000 2z" fill={stroke} /><path d="M7 20l3-6 3 3 2-4 3 3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    plane:  <svg viewBox="0 0 24 24" width="26" height="26" fill={stroke}><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>,
  };
  return (
    <div style={{ width: 150, height: 180, background: bg, border: borderStyle, flexShrink: 0, borderRadius: 20, overflow: "hidden", position: "relative", boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.3)" : outline ? "0 4px 20px rgba(255,31,125,0.15)" : "0 8px 32px rgba(255,31,125,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {!outline && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, white 0%, transparent 65%)", opacity: 0.18, pointerEvents: "none" }} />}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "0 12px", position: "relative" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: outline ? "#FFF0F5" : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>{icons[icon]}</div>
        <p style={{ fontSize: "10px", color: textColor, letterSpacing: "0.12em", fontWeight: 700, textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.4 }}>{name}</p>
        <div style={{ padding: "2px 10px", borderRadius: 999, background: "rgba(255,255,255,0.15)" }}>
          <span style={{ fontSize: "7px", color: dark ? "#FF69B4" : outline ? PINK : "rgba(255,255,255,0.8)", fontWeight: 700, letterSpacing: "0.1em" }}>BLOOMBAY</span>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: IVORY, fontFamily: "var(--font-jost)" }}>

      <style>{`
        .bb-nav-desktop { display: none; }
        @media (min-width: 768px) { .bb-nav-desktop { display: block; } }
        .bb-mobile-only { display: flex; }
        @media (min-width: 768px) { .bb-mobile-only { display: none; } }
        .bb-desktop-only { display: none; }
        @media (min-width: 768px) { .bb-desktop-only { display: grid; } }
        .bb-outline { -webkit-text-stroke: 2.5px white; color: transparent; }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-10px) rotate(-4deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(3deg)} 50%{transform:translateY(-8px) rotate(3deg)} }
        @keyframes float3 { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-12px) rotate(-2deg)} }
        @keyframes bb-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .bb-marquee-track { display:flex; gap:0; animation:bb-marquee 22s linear infinite; width:max-content; }
      `}</style>

      {/* ── DESKTOP NAV ── */}
      <nav className="bb-nav-desktop" style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(253,244,236,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #ecddd4" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <BBLogo size={30} />
            <span style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "14px", letterSpacing: "0.2em", color: INK }}>BLOOMBAY</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {[{ label: "ABOUT", href: "/about" }, { label: "CLUBS", href: "/member/clubs" }, { label: "SAFETY", href: "/safety" }, { label: "CLUB OWNERS", href: "/start-a-club" }].map((item) => (
              <Link key={item.label} href={item.href} style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", color: "#888", textDecoration: "none" }}>{item.label}</Link>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/portals" style={{ padding: "8px 18px", borderRadius: 999, fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "#888", border: "1.5px solid #ddd", textDecoration: "none" }}>LOG IN</Link>
            <Link href="/waitlist" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 999, fontSize: "10px", fontWeight: 900, letterSpacing: "0.12em", color: "white", background: `linear-gradient(135deg,${PINK},#c4005a)`, textDecoration: "none", boxShadow: "0 4px 16px rgba(255,31,125,0.35)" }}>
              SAVE MY SPOT <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
          MOBILE HERO — full editorial cover
      ══════════════════════════════════════════════════════ */}
      <section className="bb-mobile-only" style={{ minHeight: "100svh", background: PINK, flexDirection: "column", overflow: "hidden", position: "relative" }}>

        {/* Noise/grain texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.12) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(0,0,0,0.1) 0%, transparent 45%)", pointerEvents: "none", zIndex: 0 }} />

        {/* Decorative blob */}
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", top: 60, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(0,0,0,0.06)", pointerEvents: "none", zIndex: 0 }} />

        {/* Top bar */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)", flexShrink: 0 }}>
          <BBLogo size={22} light />
          <Link href="/portals" style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.65)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)", padding: "6px 14px", borderRadius: 999 }}>
            LOG IN
          </Link>
        </div>

        {/* Main headline */}
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 22px" }}>

          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.36em", color: "rgba(255,255,255,0.5)", marginBottom: 18 }}>
            ✦ &nbsp;NEW YORK CITY &nbsp;·&nbsp; EST. 2025
          </p>

          {/* Big phrase rotation: "Women are gathering." */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(44px, 13vw, 60px)", color: "white", lineHeight: 0.92, letterSpacing: "-0.01em" }}>
              Women
            </div>
            <div style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(60px, 17vw, 82px)", color: "white", lineHeight: 0.82, letterSpacing: "-0.04em", marginTop: 2 }}>
              are
            </div>
            <div style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(52px, 15vw, 72px)", lineHeight: 0.88, letterSpacing: "-0.04em", marginTop: 2 }}>
              <span className="bb-outline">gathering.</span>
            </div>
          </div>

          {/* Handwritten accent */}
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: "18px", color: "rgba(255,255,255,0.7)", marginBottom: 24, marginTop: 8, transform: "rotate(-1deg)", display: "inline-block" }}>
            your table is here ♡
          </p>

          {/* Club pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            {["Dinner Society", "Museum Girls", "Book Club", "Sunday Walks"].map((name) => (
              <div key={name} style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 999, padding: "5px 12px", backdropFilter: "blur(8px)" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.9)" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ position: "relative", zIndex: 1, padding: "0 20px", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 28px)", flexShrink: 0 }}>
          <Link href="/waitlist" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", borderRadius: 18, padding: "18px 22px", textDecoration: "none", boxShadow: "0 12px 40px rgba(0,0,0,0.22)", marginBottom: 14 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 900, letterSpacing: "0.08em", color: INK }}>SAVE MY SPOT</p>
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "11px", color: "#aaa", marginTop: 1 }}>500 founding spots available</p>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${PINK},#c4005a)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            {[{ num: "247", label: "MEMBERS" }, { num: "500", label: "FOUNDING SPOTS" }, { num: "NYC", label: "FIRST CITY" }].map((s, i) => (
              <div key={s.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, borderRight: i < 2 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "18px", fontWeight: 900, color: "white", lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DESKTOP HERO
      ══════════════════════════════════════════════════════ */}
      <section className="bb-desktop-only" style={{ minHeight: "91vh", background: IVORY, position: "relative", overflow: "hidden", gridTemplateColumns: "1fr 1fr", alignItems: "center", maxWidth: 1280, margin: "0 auto", padding: "48px 24px 64px", gap: 32 }}>
        {/* Pink circle */}
        <div style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", zIndex: 0, width: "min(90vw, 860px)", height: "min(90vw, 860px)", background: `radial-gradient(circle, ${PINK} 0%, #c4005a 100%)`, left: "min(-22vw, -180px)", top: "-80px", boxShadow: "0 0 120px 40px rgba(255,31,125,0.2)" }} />

        {/* LEFT */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkle color="rgba(255,255,255,0.55)" size={14} /> EST. 2025 · NEW YORK CITY
          </p>
          <h1 style={{ margin: "0 0 24px", lineHeight: 0.88 }}>
            <span style={{ display: "block", fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(50px, 8vw, 82px)", color: "white", letterSpacing: "-0.01em", lineHeight: 0.9 }}>Women</span>
            <span style={{ display: "block", fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(60px, 10vw, 108px)", color: "white", letterSpacing: "-0.04em", lineHeight: 0.84 }}>are</span>
            <span style={{ display: "block", fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(54px, 9vw, 96px)", color: "white", letterSpacing: "-0.04em", lineHeight: 0.9 }}>gathering.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: "22px", color: "rgba(255,255,255,0.65)", lineHeight: 1, marginBottom: 12, transform: "rotate(-1.5deg)", display: "inline-block" }}>
            your table is here ♡
          </p>
          <div style={{ width: 36, height: 2, background: "rgba(255,255,255,0.35)", marginBottom: 20, marginTop: 16 }} />
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "18px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, maxWidth: 320, marginBottom: 36 }}>
            New York City&apos;s social club for women. Clubs, dinners, museums, and real friendship.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/waitlist" style={{ padding: "16px 36px", borderRadius: 999, fontWeight: 900, fontSize: "12px", letterSpacing: "0.14em", background: "white", color: PINK, textDecoration: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.14)" }}>SAVE MY SPOT</Link>
            <Link href="/portals" style={{ padding: "16px 28px", borderRadius: 999, fontWeight: 600, fontSize: "12px", letterSpacing: "0.1em", border: "2px solid rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.85)", textDecoration: "none" }}>Log in</Link>
          </div>
        </div>

        {/* RIGHT: floating objects */}
        <div style={{ position: "relative", zIndex: 1, height: 540 }}>
          {/* Polaroid-style card 1 */}
          <div style={{ position: "absolute", width: 210, height: 230, top: 0, right: 55, background: "linear-gradient(135deg,#ff9ec4,#FF1F7D)", borderRadius: 24, transform: "rotate(-3deg)", zIndex: 3, boxShadow: "0 16px 48px rgba(255,31,125,0.3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", animation: "float1 4s ease-in-out infinite" }}>
            {/* Dinner scene illustration */}
            <svg viewBox="0 0 100 100" width="160" height="160" fill="none">
              <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.08)" />
              <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" strokeDasharray="4 3" />
              <path d="M30 55 Q50 30 70 55" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="50" cy="55" r="12" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" />
              <path d="M44 55 Q50 48 56 55" fill="white" opacity="0.6" />
              {/* Wine glasses */}
              <path d="M38 45 L38 35 M38 40 Q35 36 40 36 Q43 36 40 40" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
              <path d="M62 45 L62 35 M62 40 Q59 36 64 36 Q67 36 64 40" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
              <path d="M20 70 Q50 65 80 70" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
            </svg>
            <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "14px", color: "rgba(255,255,255,0.9)", transform: "rotate(1deg)" }}>girls dinner ♡</p>
            </div>
          </div>

          {/* Membership card */}
          <div style={{ position: "absolute", width: 148, height: 200, top: 165, right: 8, background: `linear-gradient(145deg,${PINK},#c4005a)`, borderRadius: 16, transform: "rotate(4deg)", zIndex: 4, boxShadow: "0 12px 40px rgba(255,31,125,0.45)", padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", animation: "float2 5s ease-in-out infinite" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "white", fontWeight: 900, fontSize: "10px" }}>B</span></div>
              <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 800, letterSpacing: "0.16em", fontSize: "8px" }}>BLOOMBAY</span>
            </div>
            <div>
              <p style={{ color: "white", fontWeight: 900, letterSpacing: "0.16em", fontSize: "13px" }}>PASS</p>
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                {["YOUR CITY","YOUR PEOPLE","YOUR WORLD"].map(l => (
                  <p key={l} style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: "8px", letterSpacing: "0.12em", lineHeight: 1.7 }}>{l}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Handwritten note card */}
          <div style={{ position: "absolute", width: 136, height: 116, top: 268, right: 175, background: IVORY, borderRadius: 16, transform: "rotate(-6deg)", zIndex: 5, boxShadow: "0 6px 24px rgba(0,0,0,0.1)", padding: 16, display: "flex", flexDirection: "column", justifyContent: "center", animation: "float3 3.5s ease-in-out infinite" }}>
            <p style={{ fontFamily: "var(--font-caveat)", color: INK, fontSize: "17px", lineHeight: 1.35 }}>See you Saturday!</p>
            <p style={{ marginTop: 8, fontSize: "18px", color: PINK }}>♡</p>
          </div>

          {/* Event ticket */}
          <div style={{ position: "absolute", width: 165, height: 94, top: 390, right: 55, transform: "rotate(2deg)", zIndex: 4, background: "#FFF5F8", border: `1.5px solid ${PINK}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 28, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "6px 0 6px 6px" }}>
              {Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ width: 10, height: 8, borderRadius: 3, background: PINK }} />)}
            </div>
            <div style={{ marginLeft: 28, padding: 10 }}>
              <p style={{ fontWeight: 900, color: INK, fontSize: "11px" }}>MUSEUM GIRLS</p>
              <p style={{ fontSize: "11px", color: "#aaa", marginTop: 2 }}>SAT, MAY 24 · 2:00 PM</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: PINK }} />
                <p style={{ fontSize: "11px", fontWeight: 700, color: PINK }}>2 SEATS LEFT</p>
              </div>
            </div>
          </div>

          {/* BB badge */}
          <div style={{ position: "absolute", width: 56, height: 56, top: 470, right: 248, borderRadius: "50%", background: `linear-gradient(135deg,${PINK},#c4005a)`, transform: "rotate(-12deg)", zIndex: 3, boxShadow: "0 4px 16px rgba(255,31,125,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: "14px" }}>BB</span>
          </div>

          {/* Dark card */}
          <div style={{ position: "absolute", width: 105, height: 136, top: 58, right: 296, transform: "rotate(5deg)", zIndex: 2, background: "linear-gradient(160deg,#111111,#FF1F7D)", borderRadius: 18, boxShadow: "0 6px 24px rgba(0,0,0,0.15)", padding: 10, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div style={{ width: "100%", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.28)", marginBottom: 5 }} />
            <div style={{ width: "75%", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.18)" }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MARQUEE — animated phrase strip
      ══════════════════════════════════════════════════════ */}
      <div style={{ background: INK, overflow: "hidden", padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="bb-marquee-track">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} style={{ display: "flex", gap: 0 }}>
              {["your table is here", "your friends are here", "your social life starts here", "it's a woman's world", "we're it", "women are gathering"].map((phrase, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 20, padding: "0 32px", whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "15px", color: "rgba(255,255,255,0.7)" }}>{phrase}</span>
                  <Sparkle color={PINK} size={10} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          YOUR TABLE IS HERE — Event cards
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "72px 22px", background: "white" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.24em", color: PINK, marginBottom: 10 }}>YOUR TABLE IS HERE</p>
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: INK, margin: 0, lineHeight: 1 }}>
              Tonight on{" "}
              <span style={{ color: PINK, fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300 }}>BloomBay</span>
              {" "}<Sparkle />
            </h2>
            <p style={{ fontSize: "13px", color: "#aaa", fontWeight: 500, marginTop: 8 }}>Real plans. Real women. Real memories.</p>
          </div>

          <div style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 8 }}>
            {[
              { tag: "2 SEATS LEFT", title: "Girls Dinner", location: "Carbone · West Village", time: "7:30 PM", grad: `linear-gradient(160deg,${PINK} 0%,#111111 100%)` },
              { tag: "3 SPOTS LEFT", title: "Museum Girls", location: "The Met · Upper East Side", time: "2:00 PM", grad: "linear-gradient(160deg,#1A0A2E 0%,#FF1F7D 100%)" },
              { tag: "1 SEAT LEFT",  title: "Book Club", location: "McNally Jackson · Nolita", time: "7:00 PM", grad: "linear-gradient(160deg,#FF69B4 0%,#111111 100%)" },
              { tag: "OPEN",         title: "Sunday Walk", location: "Brooklyn Bridge Park", time: "10:00 AM", grad: "linear-gradient(160deg,#111 0%,#c4005a 100%)" },
            ].map((ev, i) => (
              <div key={i} style={{ flexShrink: 0, width: 210, borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", background: "white", position: "relative" }}>
                <div style={{ height: 200, background: ev.grad, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 20%, white 0%, transparent 60%)", opacity: 0.15, pointerEvents: "none" }} />
                  <div style={{ position: "absolute", top: 14, left: 14, padding: "5px 11px", borderRadius: 999, background: "rgba(255,255,255,0.95)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.1em", color: PINK }}>{ev.tag}</div>
                  <div style={{ position: "absolute", bottom: 14, left: 14 }}>
                    <p style={{ fontWeight: 900, color: "white", fontSize: "21px", lineHeight: 1 }}>{ev.time}</p>
                  </div>
                  {/* Decorative element */}
                  <div style={{ position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)", opacity: 0.15 }}>
                    <Sparkle color="white" size={40} />
                  </div>
                </div>
                <div style={{ padding: "13px 14px 15px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <p style={{ fontWeight: 900, fontSize: "13px", color: INK }}>{ev.title}</p>
                    <p style={{ fontSize: "11px", color: "#bbb", fontWeight: 500, marginTop: 2 }}>{ev.location}</p>
                  </div>
                  <Link href="/member/happenings" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${PINK},#c4005a)`, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </Link>
                </div>
              </div>
            ))}
            <div style={{ flexShrink: 0, width: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", color: "#ccc", fontSize: "18px", lineHeight: 1.3, textAlign: "center" }}>And more tonight.</p>
              <Link href="/member/happenings" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "10px", fontWeight: 800, color: PINK, textDecoration: "none", letterSpacing: "0.06em" }}>
                See all <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke={PINK} strokeWidth="1.5" strokeLinecap="round" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          YOUR FRIENDS ARE HERE — Testimonial + profile cards
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 22px", background: INK, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,105,180,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.24em", color: PINK, marginBottom: 16 }}>YOUR FRIENDS ARE HERE</p>

          {/* Testimonial */}
          <blockquote style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "clamp(20px,3.5vw,32px)", color: "white", lineHeight: 1.5, fontWeight: 300, margin: "0 0 32px", maxWidth: 680 }}>
            &ldquo;I moved to New York knowing nobody. Within three months of joining BloomBay, I had a book club, a dinner table, and five women I actually call friends now.&rdquo;
          </blockquote>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${PINK},#FF69B4)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: 700, fontSize: "15px" }}>S</span>
            </div>
            <div>
              <p style={{ color: "white", fontWeight: 600, fontSize: "14px" }}>Sofia M.</p>
              <p style={{ color: "#FF69B4", fontSize: "12px", fontWeight: 500 }}>Upper East Side · Founding Member</p>
            </div>
          </div>

          {/* Member profile cards horizontal scroll */}
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
            {[
              { name: "Amara", city: "Crown Heights", clubs: ["Book Club", "Museum Girls"], color: "#FF1F7D", bg: "#1e0a18" },
              { name: "Jade",  city: "West Village",  clubs: ["Dinner Society", "Pilates"], color: "#C084FC", bg: "#0e0a1e" },
              { name: "Sofia", city: "Upper East",    clubs: ["Gallery Girls", "Jazz Night"], color: "#34D399", bg: "#0a1e14" },
              { name: "Lena",  city: "Williamsburg",  clubs: ["Sunday Walks", "Book Club"], color: "#60A5FA", bg: "#0a1220" },
              { name: "Yemi",  city: "Harlem",        clubs: ["Dinner Society", "Travel"], color: "#F59E0B", bg: "#1e140a" },
            ].map((m) => (
              <div key={m.name} style={{ flexShrink: 0, width: 140, borderRadius: 18, background: m.bg, border: `1px solid ${m.color}22`, padding: "14px 12px", boxShadow: `0 4px 24px ${m.color}18` }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${m.color},${m.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <span style={{ color: "white", fontWeight: 900, fontSize: "14px" }}>{m.name[0]}</span>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: "13px", color: "white", marginBottom: 2 }}>{m.name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>{m.city}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {m.clubs.map(c => (
                    <span key={c} style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: m.color, background: `${m.color}18`, borderRadius: 999, padding: "2px 7px", letterSpacing: "0.06em" }}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          YOUR SOCIAL LIFE STARTS HERE — CLUBS
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 22px", background: IVORY }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.24em", color: PINK, marginBottom: 12 }}>YOUR SOCIAL LIFE STARTS HERE</p>
            <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 900, color: INK, marginBottom: 4 }}>
              Clubs that feel like{" "}
              <span style={{ color: PINK, fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300 }}>home.</span>
            </h2>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "20px", color: "#aaa", transform: "rotate(-1deg)" }}>find your people. build your world.</p>
          </div>
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {CLUBS.map((club, i) => <ClubCard key={i} name={club.name} dark={club.dark} outline={club.outline} icon={club.icon} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          IT'S A WOMAN'S WORLD. WE'RE IT.
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: PINK, padding: "80px 22px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0,0,0,0.08) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <Sparkle color="rgba(255,255,255,0.5)" size={28} />
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(32px,6vw,68px)", color: "white", margin: "20px 0 10px", lineHeight: 1.1 }}>
            It&apos;s a woman&apos;s world.
          </h2>
          <h2 style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(32px,6vw,68px)", color: "white", margin: "0 0 24px", lineHeight: 1, letterSpacing: "-0.02em" }}>
            We&apos;re it.
          </h2>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", marginBottom: 32 }}>
            {[{ num: "247", label: "Members" }, { num: "12+", label: "Clubs" }, { num: "500", label: "Founding spots" }].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "36px", color: "white", lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{s.label.toUpperCase()}</p>
              </div>
            ))}
          </div>

          <Link href="/waitlist" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "18px 40px", borderRadius: 999, fontWeight: 900, fontSize: "13px", letterSpacing: "0.12em", background: "white", color: PINK, textDecoration: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
            SAVE MY SPOT
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke={PINK} strokeWidth="1.5" strokeLinecap="round" /></svg>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS (light, editorial steps)
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 22px", background: "white" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.24em", color: PINK, marginBottom: 12, textAlign: "center" }}>HOW IT WORKS</p>
          <h2 style={{ fontWeight: 900, fontSize: "clamp(22px,3.5vw,36px)", color: INK, marginBottom: 8, textAlign: "center" }}>
            From stranger to{" "}
            <span style={{ color: PINK, fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300 }}>sister</span>.
          </h2>
          <div style={{ width: 32, height: 2, background: PINK, margin: "0 auto 48px" }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 28 }}>
            {[
              { step: "01", title: "Join BloomBay", body: "Sign up and get matched to clubs based on who you are, not just where you live." },
              { step: "02", title: "Pick your clubs", body: "Dinner Society. Museum Girls. Book Club. There's a table for you here." },
              { step: "03", title: "Show up", body: "Attend IRL events with real women who actually show up. No flaking, no randos." },
              { step: "04", title: "Make it yours", body: "Start your own club, host your first gathering, build something that lasts." },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: "left", padding: "22px 20px", background: IVORY, borderRadius: 18, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -8, right: 8, fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "64px", fontWeight: 300, color: "rgba(255,31,125,0.08)", lineHeight: 1 }}>{item.step}</div>
                <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "28px", fontWeight: 300, color: PINK, marginBottom: 8, lineHeight: 1, position: "relative" }}>{item.step}</p>
                <p style={{ fontWeight: 800, fontSize: "13px", color: INK, marginBottom: 6, position: "relative" }}>{item.title}</p>
                <p style={{ fontSize: "12px", color: "#888", lineHeight: 1.6, position: "relative" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PARTNERS SECTION
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "64px 22px", background: IVORY }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ background: INK, borderRadius: 24, padding: "48px 36px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, background: `radial-gradient(circle, rgba(255,31,125,0.2) 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>✦ &nbsp;FOR GROUP OWNERS</p>
              <h2 style={{ fontWeight: 900, fontSize: "clamp(22px,4vw,34px)", color: "white", marginBottom: 12, lineHeight: 1.15 }}>
                Run a housing group?<br />
                <span style={{ color: PINK, fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300 }}>Bring your women here.</span>
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 480, marginBottom: 28 }}>
                If you manage a Facebook group, WhatsApp chat, or community for women, you can become a <strong style={{ color: "white" }}>BloomBay Partner</strong>. Your members get a verified, safer space — and you get tools to manage it.
              </p>
              <Link href="/start-a-club" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 999, background: PINK, color: "white", fontWeight: 900, fontSize: "12px", letterSpacing: "0.12em", textDecoration: "none", boxShadow: "0 6px 24px rgba(255,31,125,0.4)" }}>
                START A CLUB
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: INK, padding: "88px 22px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: 400, background: "radial-gradient(circle, rgba(255,31,125,0.28) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 300, height: 300, background: "radial-gradient(circle, rgba(255,105,180,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 580 }}>
          <Sparkle color="#FF69B4" size={22} />
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.4)", fontSize: "clamp(14px,2vw,18px)", margin: "14px 0 6px", letterSpacing: "0.04em" }}>You haven&apos;t met your people yet.</p>
          <p style={{ fontWeight: 900, color: "white", fontSize: "clamp(32px,6vw,60px)", lineHeight: 1.05, marginBottom: 10 }}>
            Your place is{" "}
            <span style={{ color: PINK, fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, textShadow: "0 0 40px rgba(255,31,125,0.5)" }}>here.</span>
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", fontFamily: "var(--font-fraunces)", fontStyle: "italic", marginBottom: 40 }}>500 founding spots. New York City.</p>
          <Link href="/waitlist" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "20px 44px", borderRadius: 999, fontWeight: 900, fontSize: "13px", letterSpacing: "0.14em", background: `linear-gradient(135deg,${PINK},#c4005a)`, color: "white", textDecoration: "none", boxShadow: "0 8px 40px rgba(255,31,125,0.5)" }}>
            SAVE MY SPOT
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </Link>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: IVORY, borderTop: "1px solid #ecddd4" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 22px 36px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid #ecddd4" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <BBLogo size={32} />
                <span style={{ fontWeight: 900, fontSize: "18px", letterSpacing: "0.18em", color: INK }}>BLOOMBAY</span>
              </div>
              <p style={{ fontSize: "14px", color: "#888", fontFamily: "var(--font-fraunces)", fontStyle: "italic", marginBottom: 4 }}>A world built for women.</p>
              <p style={{ fontSize: "12px", color: "#bbb" }}>New York City · Est. 2025</p>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {[
                { href: "https://instagram.com/bloombaynyc", label: "Instagram", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.5" /><circle cx="17.5" cy="6.5" r="1.2" fill={PINK} stroke="none" /></svg> },
                { href: "https://tiktok.com/@bloombay",     label: "TikTok",    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill={PINK}><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.18 8.18 0 004.78 1.52V6.81a4.85 4.85 0 01-1.01-.12z" /></svg> },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#FFE0EE", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#999" }}>{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "28px 16px", marginBottom: 40 }}>
            {[
              { title: "ABOUT",       links: [{ l: "Our Story", h: "/about" }, { l: "Safety", h: "/safety" }, { l: "Careers", h: "/careers" }] },
              { title: "COMMUNITY",   links: [{ l: "BloomBay Mag", h: "/magazine" }, { l: "Events", h: "/events" }] },
              { title: "CLUB OWNERS", links: [{ l: "Start a Club", h: "/start-a-club" }, { l: "Host Resources", h: "/host-resources" }] },
              { title: "SUPPORT",     links: [{ l: "Help Center", h: "/help" }, { l: "Contact Us", h: "/contact" }] },
            ].map((col) => (
              <div key={col.title}>
                <p style={{ fontSize: "9px", fontWeight: 900, letterSpacing: "0.22em", color: INK, marginBottom: 14 }}>{col.title}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((link) => (
                    <Link key={link.l} href={link.h} style={{ fontSize: "13px", color: "#888", textDecoration: "none" }}>{link.l}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 10, alignItems: "center", borderTop: "1px solid #ecddd4" }}>
            <p style={{ fontSize: "11px", color: "#bbb" }}>© 2026 BloomBay, Inc. All rights reserved.</p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
              {[{ l: "Privacy Policy", h: "/privacy" }, { l: "Terms of Service", h: "/terms" }, { l: "Safety", h: "/safety" }, { l: "Girl Rights", h: "/girl-rights" }].map((link) => (
                <Link key={link.l} href={link.h} style={{ fontSize: "11px", color: "#bbb", textDecoration: "none" }}>{link.l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
