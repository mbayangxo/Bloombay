"use client";

import { useState } from "react";
import Link from "next/link";
import { BBLogo } from "./bb-logo";

const PINK  = "#FF1F7D";
const INK   = "#111111";
const IVORY = "#fdf4ec";

const TONIGHT = [
  { id: 1, tag: "2 SEATS LEFT",  title: "Coffee Walk",    location: "Williamsburg",  time: "10:00 AM", grad: "linear-gradient(160deg,#FF1F7D 0%,#111111 100%)" },
  { id: 2, tag: "3 SPOTS LEFT",  title: "Museum Girls",   location: "The Met",        time: "2:00 PM",  grad: "linear-gradient(160deg,#1A0A2E 0%,#FF1F7D 100%)" },
  { id: 3, tag: "1 SEAT LEFT",   title: "Dinner Society", location: "West Village",   time: "7:30 PM",  grad: "linear-gradient(160deg,#FF69B4 0%,#111111 100%)" },
];

const CLUBS = [
  { name: "DINNER\nSOCIETY", dark: false, icon: "wine" },
  { name: "MUSEUM\nGIRLS",   dark: false, icon: "museum" },
  { name: "BOOK\nCLUB",      dark: false, icon: "book",   outline: true },
  { name: "WELLNESS\nCIRCLE",dark: false, icon: "lotus" },
  { name: "SUNDAY\nWALKS",   dark: false, icon: "walk",   outline: true },
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
    <div style={{
      width: "150px", height: "180px", background: bg, border: borderStyle, flexShrink: 0,
      borderRadius: 20, overflow: "hidden", position: "relative",
      boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.3)" : outline ? "0 4px 20px rgba(255,31,125,0.15)" : "0 8px 32px rgba(255,31,125,0.25)",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {!outline && (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, white 0%, transparent 65%)", opacity: 0.18, pointerEvents: "none" }} />
      )}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "0 12px", position: "relative" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: outline ? "#FFF0F5" : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icons[icon]}
        </div>
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
        .bb-outline { -webkit-text-stroke: 2.5px white; color: transparent; }
        .bb-outline-dark { -webkit-text-stroke: 2px rgba(180,0,80,0.7); color: transparent; }
      `}</style>

      {/* ─── NAV: desktop only. Mobile hero has its own header. ─── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(253,244,236,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #ecddd4" }} className="hidden md:block">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <BBLogo size={30} />
            <span style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "14px", letterSpacing: "0.2em", color: INK }}>BLOOMBAY</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {[
              { label: "ABOUT",       href: "/about" },
              { label: "CLUBS",       href: "/member/clubs" },
              { label: "SAFETY",      href: "/safety" },
              { label: "CLUB OWNERS", href: "/start-a-club" },
              { label: "PARTNERS",    href: "/partner" },
            ].map((item) => (
              <Link key={item.label} href={item.href} style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", color: "#888", textDecoration: "none" }}>
                {item.label}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/portals" style={{ padding: "8px 18px", borderRadius: 999, fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "#888", border: "1.5px solid #ddd", textDecoration: "none" }}>
              LOG IN
            </Link>
            <Link href="/waitlist" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 999, fontSize: "10px", fontWeight: 900, letterSpacing: "0.12em", color: "white", background: `linear-gradient(135deg,${PINK},#c4005a)`, textDecoration: "none", boxShadow: "0 4px 16px rgba(255,31,125,0.35)" }}>
              JOIN WAITLIST
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE HERO ─── full screen, no duplicate nav ─── */}
      <section className="md:hidden" style={{ height: "100svh", background: PINK, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Single top bar — this IS the nav on mobile */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BBLogo size={18} light />
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.28em", color: "rgba(255,255,255,0.45)" }}>BLOOMBAY</span>
          </div>
          <Link href="/portals" style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", color: "rgba(255,255,255,0.65)", textDecoration: "none" }}>
            LOG IN
          </Link>
        </div>

        {/* Hero text — centred vertically in remaining space */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 22px" }}>

          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.32em", color: "rgba(255,255,255,0.45)", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
            <span>✦</span> EST. 2025 · NEW YORK CITY
          </p>

          <h1 style={{ margin: 0, lineHeight: 0.88 }}>
            <span style={{ display: "block", fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(70px, 20vw, 92px)", color: "white", letterSpacing: "-0.03em", lineHeight: 0.88 }}>
              Women
            </span>
            <span style={{ display: "block", fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(60px, 17vw, 78px)", color: "white", letterSpacing: "-0.02em", lineHeight: 0.92 }}>
              are
            </span>
            <span className="bb-outline" style={{ display: "block", fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(58px, 16vw, 76px)", letterSpacing: "-0.03em", lineHeight: 0.95 }}>
              gathering.
            </span>
          </h1>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.18)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 400, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 4 }}>
              A city of women is already happening.
            </p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "15px", color: "rgba(255,255,255,0.5)" }}>
              Find your table.
            </p>
          </div>
        </div>

        {/* CTAs + stat bar pinned to bottom */}
        <div style={{ padding: "0 20px", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 28px)", flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
            <Link href="/waitlist" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "white", borderRadius: 999, padding: "17px 24px", textDecoration: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 900, letterSpacing: "0.12em", color: PINK }}>JOIN THE WAITLIST →</span>
            </Link>
            <Link href="/portals" style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 999, padding: "15px 24px", textDecoration: "none" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.72)" }}>Log in</span>
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 16 }}>
            {[
              { num: "247",  label: "MEMBERS" },
              { num: "500",  label: "FOUNDING SPOTS" },
              { num: "NYC",  label: "FIRST CITY" },
            ].map((s, i) => (
              <div key={s.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, borderRight: i < 2 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "19px", fontWeight: 900, color: "white", lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DESKTOP HERO ─── */}
      <section className="hidden md:block" style={{ minHeight: "91vh", background: IVORY, position: "relative", overflow: "hidden" }}>
        {/* Big pink circle */}
        <div style={{
          position: "absolute", borderRadius: "50%", pointerEvents: "none", zIndex: 1,
          width: "min(90vw, 860px)", height: "min(90vw, 860px)",
          background: `radial-gradient(circle, ${PINK} 0%, #c4005a 100%)`,
          left: "min(-22vw, -180px)", top: "-80px",
          boxShadow: "0 0 120px 40px rgba(255,31,125,0.2)",
        }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "48px 24px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center", minHeight: "88vh" }}>

          {/* LEFT */}
          <div>
            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkle color="rgba(255,255,255,0.6)" size={16} />
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.55)" }}>EST. 2025 · NEW YORK CITY</span>
            </div>

            <h1 style={{ margin: "0 0 24px", lineHeight: 0.9 }}>
              <span style={{ display: "block", fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(54px, 9vw, 94px)", color: "white" }}>Women</span>
              <span style={{ display: "block", fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(54px, 9vw, 94px)", color: "white" }}>are</span>
              <span style={{ display: "block", fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "clamp(54px, 9vw, 94px)", color: "white" }}>gathering.</span>
            </h1>

            <div style={{ width: 36, height: 2, background: "rgba(255,255,255,0.35)", marginBottom: 20 }} />

            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, maxWidth: 320, marginBottom: 8 }}>
              A city of women is already happening.
            </p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "17px", color: "rgba(255,255,255,0.5)", marginBottom: 36 }}>
              Find your table.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/waitlist" style={{ padding: "16px 36px", borderRadius: 999, fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "12px", letterSpacing: "0.14em", background: "white", color: PINK, textDecoration: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.14)" }}>
                JOIN THE WAITLIST
              </Link>
              <Link href="/portals" style={{ padding: "16px 28px", borderRadius: 999, fontFamily: "var(--font-jost)", fontWeight: 600, fontSize: "12px", letterSpacing: "0.1em", border: "2px solid rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.85)", textDecoration: "none" }}>
                Log in
              </Link>
            </div>
          </div>

          {/* RIGHT: floating objects */}
          <div style={{ position: "relative", height: 540 }}>
            {/* Bouquet card */}
            <div style={{ position: "absolute", width: 210, height: 230, top: 0, right: 55, background: "linear-gradient(135deg,#ff9ec4,#FF1F7D)", borderRadius: 24, transform: "rotate(-3deg)", zIndex: 3, boxShadow: "0 16px 48px rgba(255,31,125,0.3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <svg viewBox="0 0 80 80" width="140" height="140" fill="none">
                {([[40,20,14],[24,28,11],[54,26,12],[32,38,13],[50,36,11],[40,46,10]] as number[][]).map(([cx,cy,r],i) => (
                  <circle key={i} cx={cx} cy={cy} r={r} stroke="white" strokeWidth="1.4" fill={i%2===0?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.08)"} />
                ))}
                <path d="M34 58 Q40 62 46 58 L44 72 Q40 74 36 72 Z" stroke="white" strokeWidth="1.4" fill="rgba(255,255,255,0.2)" />
              </svg>
            </div>

            {/* Pass card */}
            <div style={{ position: "absolute", width: 148, height: 200, top: 165, right: 8, background: `linear-gradient(145deg,${PINK},#c4005a)`, borderRadius: 16, transform: "rotate(4deg)", zIndex: 4, boxShadow: "0 12px 40px rgba(255,31,125,0.45)", padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontWeight: 900, fontSize: "10px" }}>B</span>
                </div>
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

            {/* Note card */}
            <div style={{ position: "absolute", width: 136, height: 116, top: 268, right: 175, background: IVORY, borderRadius: 16, transform: "rotate(-6deg)", zIndex: 5, boxShadow: "0 6px 24px rgba(0,0,0,0.1)", padding: 16, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: INK, fontSize: "16px", lineHeight: 1.35 }}>See you Saturday!</p>
              <p style={{ marginTop: 8, fontSize: "18px", color: PINK }}>♡</p>
            </div>

            {/* Museum Girls ticket */}
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

            {/* Wax seal */}
            <div style={{ position: "absolute", width: 56, height: 56, top: 470, right: 248, borderRadius: "50%", background: `linear-gradient(135deg,${PINK},#c4005a)`, transform: "rotate(-12deg)", zIndex: 3, boxShadow: "0 4px 16px rgba(255,31,125,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: "14px" }}>BB</span>
            </div>

            {/* City photo */}
            <div style={{ position: "absolute", width: 105, height: 136, top: 58, right: 296, transform: "rotate(5deg)", zIndex: 2, background: "linear-gradient(160deg,#111111,#FF1F7D)", borderRadius: 18, boxShadow: "0 6px 24px rgba(0,0,0,0.15)", padding: 10, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ width: "100%", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.28)", marginBottom: 5 }} />
              <div style={{ width: "75%", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.18)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TONIGHT ─── */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 48, alignItems: "start" }} className="md:grid hidden">
            <div style={{ paddingTop: 8, minWidth: 220 }}>
              <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 900, color: INK, lineHeight: 1.15, marginBottom: 12 }}>
                Tonight on{" "}
                <span style={{ color: PINK, fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}>BloomBay</span>
                {" "}<Sparkle />
              </h2>
              <div style={{ width: 40, height: 2, background: PINK, marginBottom: 16 }} />
              <p style={{ fontSize: "13px", lineHeight: 1.7, fontWeight: 500, color: "#888" }}>Real plans.<br />Real women.<br />Real memories.</p>
            </div>
            <EventCards />
          </div>
          {/* Mobile */}
          <div className="md:hidden">
            <h2 style={{ fontSize: "26px", fontWeight: 900, color: INK, marginBottom: 6 }}>
              Tonight on <span style={{ color: PINK, fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}>BloomBay</span>
            </h2>
            <div style={{ width: 32, height: 2, background: PINK, marginBottom: 20 }} />
            <EventCards />
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL ─── */}
      <section style={{ padding: "80px 24px", background: IVORY }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ borderRadius: 28, padding: "56px 48px", background: INK, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 280, height: 280, background: `radial-gradient(circle, rgba(255,31,125,0.28) 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, width: 200, height: 200, background: "radial-gradient(circle, rgba(255,105,180,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <Sparkle color={PINK} size={20} />
              <blockquote style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "clamp(20px,3vw,30px)", color: "white", lineHeight: 1.5, fontWeight: 400, margin: "24px 0 32px" }}>
                &ldquo;I moved to New York knowing nobody. Within three months of joining BloomBay, I had a book club, a dinner table, and five women I actually call friends now.&rdquo;
              </blockquote>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${PINK},#FF69B4)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontWeight: 700, fontSize: "15px" }}>S</span>
                </div>
                <div>
                  <p style={{ color: "white", fontWeight: 600, fontSize: "14px" }}>Sofia M.</p>
                  <p style={{ color: "#FF69B4", fontSize: "12px", fontWeight: 500 }}>Upper East Side · Founding Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CLUBS ─── */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, color: INK, marginBottom: 10 }}>
              Clubs that feel like{" "}
              <span style={{ color: PINK, fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400 }}>home.</span>
              {" "}<Sparkle />
            </h2>
            <div style={{ width: 36, height: 2, background: PINK, margin: "0 auto 16px" }} />
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#888", marginBottom: 20 }}>Find your people. Build your world.</p>
            <Link href="/member/clubs" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "10px", fontWeight: 900, letterSpacing: "0.2em", color: PINK, textDecoration: "none" }}>
              EXPLORE CLUBS
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke={PINK} strokeWidth="1.5" strokeLinecap="round" /></svg>
            </Link>
          </div>
          <div style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {CLUBS.map((club, i) => (
              <ClubCard key={i} name={club.name} dark={club.dark} outline={club.outline} icon={club.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section style={{ background: INK, padding: "96px 24px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320 }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: 400, background: "radial-gradient(circle, rgba(255,31,125,0.28) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 300, height: 300, background: "radial-gradient(circle, rgba(255,105,180,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 640 }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
            <Sparkle color="#FF69B4" size={22} />
          </div>
          <p style={{ fontWeight: 900, color: "white", fontSize: "clamp(34px,6vw,62px)", lineHeight: 1.1, marginBottom: 14 }}>
            Your place is{" "}
            <span style={{ color: PINK, fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, textShadow: "0 0 40px rgba(255,31,125,0.5)" }}>here.</span>
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "16px", fontFamily: "var(--font-playfair)", fontStyle: "italic", marginBottom: 40 }}>
            Join thousands of women already on the waitlist.
          </p>
          <Link href="/waitlist" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "20px 44px", borderRadius: 999, fontWeight: 900, fontSize: "13px", letterSpacing: "0.14em", background: `linear-gradient(135deg,${PINK},#c4005a)`, color: "white", textDecoration: "none", boxShadow: "0 8px 40px rgba(255,31,125,0.5)" }}>
            JOIN THE WAITLIST
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: IVORY, borderTop: "1px solid #ecddd4" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 24px 40px" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 32, marginBottom: 56, paddingBottom: 48, borderBottom: "1px solid #ecddd4" }} className="md:flex-row md:items-end md:justify-between">
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <BBLogo size={36} />
                <span style={{ fontWeight: 900, fontSize: "20px", letterSpacing: "0.18em", color: INK }}>BLOOMBAY</span>
              </div>
              <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#888", fontFamily: "var(--font-playfair)", fontStyle: "italic", marginBottom: 6 }}>A world built for women.</p>
              <p style={{ fontSize: "13px", color: "#bbb" }}>New York City · Est. 2025</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {[
                { href: "https://instagram.com/bloombaynyc", label: "Instagram", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.5" /><circle cx="17.5" cy="6.5" r="1.2" fill={PINK} stroke="none" /></svg> },
                { href: "https://tiktok.com/@bloombay",     label: "TikTok",    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill={PINK}><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.18 8.18 0 004.78 1.52V6.81a4.85 4.85 0 01-1.01-.12z" /></svg> },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textDecoration: "none" }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#FFE0EE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 500, color: "#999" }}>{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "32px 24px", marginBottom: 56 }} className="md:grid-cols-5">
            {[
              { title: "ABOUT",       links: [{ l: "Our Story", h: "/about" }, { l: "Safety", h: "/safety" }, { l: "Careers", h: "/careers" }, { l: "Press", h: "/press" }] },
              { title: "COMMUNITY",   links: [{ l: "BloomBay Mag", h: "/magazine" }, { l: "Events", h: "/events" }] },
              { title: "CLUB OWNERS", links: [{ l: "Start a Club", h: "/start-a-club" }, { l: "Host Resources", h: "/host-resources" }] },
              { title: "PARTNERS",    links: [{ l: "Partner With Us", h: "/partner" }, { l: "Venue Directory", h: "/venues" }] },
              { title: "SUPPORT",     links: [{ l: "Help Center", h: "/help" }, { l: "Contact Us", h: "/contact" }, { l: "FAQ", h: "/faq" }] },
            ].map((col) => (
              <div key={col.title}>
                <p style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.2em", color: INK, marginBottom: 18 }}>{col.title}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {col.links.map((link) => (
                    <Link key={link.l} href={link.h} style={{ fontSize: "13px", color: "#888", textDecoration: "none" }}>{link.l}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: 28, display: "flex", flexDirection: "column", gap: 12, alignItems: "center", borderTop: "1px solid #ecddd4" }} className="md:flex-row md:justify-between">
            <p style={{ fontSize: "12px", color: "#bbb" }}>© 2026 BloomBay, Inc. All rights reserved.</p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { l: "Privacy Policy", h: "/privacy" },
                { l: "Terms of Service", h: "/terms" },
                { l: "Safety", h: "/safety" },
                { l: "Girl Rights", h: "/girl-rights" },
              ].map((link) => (
                <Link key={link.l} href={link.h} style={{ fontSize: "12px", color: "#bbb", textDecoration: "none" }}>{link.l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EventCards() {
  return (
    <div style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 12 }}>
      {TONIGHT.map((ev) => (
        <div key={ev.id} style={{ flexShrink: 0, width: 220, borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", background: "white" }}>
          <div style={{ height: 220, background: ev.grad, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 20%, white 0%, transparent 60%)", opacity: 0.18, pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 16, left: 16, padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.95)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.1em", color: "#FF1F7D", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
              {ev.tag}
            </div>
            <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
              <p style={{ fontWeight: 900, color: "white", letterSpacing: "0.04em", fontSize: "22px", lineHeight: 1 }}>{ev.time}</p>
            </div>
          </div>
          <div style={{ padding: "14px 16px 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <div>
              <p style={{ fontWeight: 900, fontSize: "14px", color: "#111111", lineHeight: 1.2 }}>{ev.title}</p>
              <p style={{ fontSize: "12px", color: "#aaa", fontWeight: 500, marginTop: 3 }}>{ev.location}</p>
            </div>
            <Link href="/member/happenings" style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,#FF1F7D,#c4005a)`, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </Link>
          </div>
        </div>
      ))}
      <div style={{ flexShrink: 0, width: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: "#ccc", fontSize: "20px", lineHeight: 1.3, textAlign: "center" }}>And more tonight.</p>
        <Link href="/member/happenings" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "11px", fontWeight: 800, color: "#FF1F7D", textDecoration: "none", letterSpacing: "0.06em" }}>
          See all
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="#FF1F7D" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </Link>
      </div>
    </div>
  );
}
