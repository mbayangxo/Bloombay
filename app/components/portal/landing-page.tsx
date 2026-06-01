"use client";

import { useState } from "react";
import Link from "next/link";
import { BBLogo } from "./bb-logo";

const AVATARS = [
  { initials: "A", color: "#FF1F7D" },
  { initials: "S", color: "#FF69B4" },
  { initials: "P", color: "#c40060" },
  { initials: "K", color: "#FF69B4" },
  { initials: "C", color: "#FFB6D0" },
  { initials: "M", color: "#1A0514" },
];

const CITY_MARKERS = [
  { name: "Williamsburg", x: 72, y: 38, active: true, count: 14 },
  { name: "SoHo", x: 44, y: 55, active: true, count: 9 },
  { name: "Chelsea", x: 36, y: 47, active: false, count: 6 },
  { name: "Upper West Side", x: 40, y: 22, active: false, count: 5 },
  { name: "Greenpoint", x: 68, y: 28, active: true, count: 7 },
  { name: "DUMBO", x: 60, y: 52, active: false, count: 4 },
];

type AppState = "closed" | "opening" | "open";

export function LandingPage() {
  const [envelopeState, setEnvelopeState] = useState<AppState>("closed");

  function openEnvelope() {
    if (envelopeState !== "closed") return;
    setEnvelopeState("opening");
    setTimeout(() => setEnvelopeState("open"), 700);
  }

  return (
    <div className="min-h-screen" style={{ background: "#1A0514" }}>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col px-6 pt-6 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.04 }}>
          <BBLogo size={340} light />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 55%, rgba(255,31,125,0.22) 0%, transparent 70%)" }}
        />

        <nav className="relative flex items-center justify-between pb-10">
          <div className="flex items-center gap-2.5">
            <BBLogo size={30} light />
            <span className="text-white font-bold text-base tracking-widest uppercase">
              BLOOM<span style={{ color: "#FF1F7D" }}>BAY</span>
            </span>
          </div>
          <Link href="/portals" className="text-sm font-semibold transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
            Log in →
          </Link>
        </nav>

        <div className="relative flex-1 flex flex-col justify-center pb-6">
          <div className="flex mb-5">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full" style={{ background: "rgba(255,31,125,0.18)", color: "#FF69B4" }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: "#FF69B4" }} />
              NYC · Founding Wave · 100 Mothers Only
            </span>
          </div>

          <h1 className="leading-none mb-5">
            <span className="block font-bold tracking-tight text-white" style={{ fontSize: "clamp(48px, 14vw, 68px)" }}>Where you</span>
            <span className="block" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(56px, 16vw, 80px)", color: "#FF1F7D", lineHeight: 1 }}>bloom.</span>
          </h1>

          <p className="mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", maxWidth: "300px" }}>
            The first world built by women, verified for women, alive with women. Real friendships. Real life. NYC.
          </p>

          <div className="flex flex-col gap-3 max-w-xs">
            <button
              onClick={openEnvelope}
              className="text-center py-4 rounded-full text-white font-bold text-base tracking-wide transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ background: "#FF1F7D" }}
            >
              Request an invitation
            </button>
            <Link
              href="/portals"
              className="text-center py-3.5 rounded-full font-semibold text-sm tracking-wide border transition-all hover:border-white/40"
              style={{ borderColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.6)" }}
            >
              Already a member? Log in
            </Link>
          </div>
        </div>

        <div className="-mx-6 px-6 py-4 flex items-center border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          {[
            { n: "100", label: "Founding Mothers" },
            { n: "NYC", label: "First city" },
            { n: "Only", label: "Invite · Verified" },
          ].map((s, i) => (
            <div key={i} className="text-center flex-1">
              <p className="text-white font-bold text-xl leading-none">{s.n}</p>
              <p className="text-xs mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="px-6 py-6" style={{ background: "var(--pale-pink-bg)" }}>
        <div className="flex items-center gap-2 mb-3">
          {AVATARS.map((a, i) => (
            <div key={i} className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: a.color }}>
              {a.initials}
            </div>
          ))}
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#FFE0EE", color: "var(--bb-pink)" }}>+94</div>
        </div>
        <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>
          100 Founding Mothers only.{" "}
          <span style={{ color: "var(--bb-pink)" }}>Spots are filling fast.</span>
        </p>
        <p className="text-xs text-gray-400 mt-0.5">Every member live-verified · NYC founding wave</p>
      </section>

      {/* ─── FEATURE BENTO ─── */}
      <section className="px-5 py-10" style={{ background: "#1A0514" }}>
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#FF1F7D" }}>WHAT&apos;S INSIDE</p>
          <h2 className="text-white font-bold leading-tight" style={{ fontSize: "28px" }}>Built for women.</h2>
          <p className="font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#FF1F7D", fontWeight: 400, fontSize: "28px" }}>Finally.</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-3xl p-5" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--bb-pink)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
            </div>
            <h3 className="text-white font-bold text-lg leading-snug mb-1">Real connections, not swipes</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Girl Match AI pairs you by energy, values, and schedule. Yande handles every first move so it&apos;s never awkward.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl p-4" style={{ background: "#FF1F7D" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: "rgba(255,255,255,0.2)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" /></svg>
              </div>
              <h3 className="text-white font-bold text-sm leading-snug mb-1">Women only. Actually.</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>Live selfie verification. No exceptions.</p>
            </div>
            <div className="rounded-3xl p-4" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: "rgba(255,31,125,0.3)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF1F7D"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
              </div>
              <h3 className="text-white font-bold text-sm leading-snug mb-1">Your sanctuary</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Journal, Yande, memories. Entirely yours.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl p-4" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: "rgba(255,31,125,0.2)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF69B4"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" /></svg>
              </div>
              <h3 className="text-white font-bold text-sm leading-snug mb-1">A city alive</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Girl Happenings, always something now.</p>
            </div>
            <div className="rounded-3xl p-4" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: "rgba(255,31,125,0.2)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF69B4"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" /></svg>
              </div>
              <h3 className="text-white font-bold text-sm leading-snug mb-1">The Room</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Girl Bar, live audio, the Bulletin.</p>
            </div>
          </div>

          <div className="rounded-3xl p-5" style={{ background: "rgba(255,31,125,0.13)", border: "1px solid rgba(255,31,125,0.22)" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: "rgba(255,31,125,0.3)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF1F7D"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
            </div>
            <h3 className="text-white font-bold text-lg leading-snug mb-1">Girl Clubs that feel alive</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Not a group chat. A world. Watch parties, audio rooms, events, circles — every club has its own identity.
            </p>
          </div>
        </div>
      </section>

      {/* ─── THE MISSION ─── */}
      <section className="px-6 py-12" style={{ background: "var(--pale-pink-bg)" }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: "var(--bb-pink)" }}>THE MISSION</p>
        <p className="font-bold italic leading-snug mb-5" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)", fontSize: "26px" }}>
          &ldquo;Show up for a stranger and she becomes someone you know.&rdquo;
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          Every feature inside BloomBay is built around one truth: women want real friendships — not followers, not likes. Real ones.
        </p>
      </section>

      {/* ─── SECTION 7: THE CITY ─── */}
      <section className="px-5 py-12" style={{ background: "#1A0514" }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#FF1F7D" }}>THE CITY</p>
        <h2 className="text-white font-bold text-2xl mb-1">NYC is blooming.</h2>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>Women verified across every neighborhood.</p>

        {/* Stylized city map */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{ background: "#0D0D0D", border: "1px solid rgba(255,31,125,0.15)", aspectRatio: "4/3" }}
        >
          {/* Grid lines — city street feel */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 75" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {/* Horizontal streets */}
            {[15, 25, 35, 45, 55, 62].map((y) => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,31,125,0.06)" strokeWidth="0.3" />
            ))}
            {/* Vertical avenues */}
            {[20, 35, 50, 65, 80].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="75" stroke="rgba(255,31,125,0.06)" strokeWidth="0.3" />
            ))}
            {/* Diagonal — Broadway */}
            <line x1="25" y1="10" x2="55" y2="65" stroke="rgba(255,31,125,0.1)" strokeWidth="0.5" />
            {/* Water body — East River */}
            <path d="M 80 0 Q 90 20 85 40 Q 88 55 82 75" fill="none" stroke="rgba(255,31,125,0.12)" strokeWidth="4" />
            {/* Water body — Hudson */}
            <path d="M 8 5 Q 5 25 7 50 Q 6 62 9 75" fill="none" stroke="rgba(255,31,125,0.08)" strokeWidth="5" />

            {/* Neighborhood blocks */}
            <rect x="60" y="22" width="18" height="22" rx="1" fill="rgba(255,31,125,0.04)" />
            <rect x="36" y="42" width="16" height="16" rx="1" fill="rgba(255,31,125,0.04)" />
            <rect x="28" y="34" width="14" height="18" rx="1" fill="rgba(255,31,125,0.04)" />
            <rect x="32" y="14" width="16" height="16" rx="1" fill="rgba(255,31,125,0.04)" />
            <rect x="60" y="12" width="14" height="14" rx="1" fill="rgba(255,31,125,0.04)" />
            <rect x="50" y="44" width="16" height="16" rx="1" fill="rgba(255,31,125,0.04)" />
          </svg>

          {/* Bloom markers */}
          {CITY_MARKERS.map((marker) => (
            <div
              key={marker.name}
              className="absolute flex flex-col items-center"
              style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: "translate(-50%, -100%)" }}
            >
              {/* Marker teardrop */}
              <div className="relative flex flex-col items-center" style={{ animation: marker.active ? "marker-drop 0.6s ease-out" : "none" }}>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: marker.active ? "#FF1F7D" : "rgba(255,31,125,0.25)",
                    boxShadow: marker.active ? "0 0 12px rgba(255,31,125,0.5)" : "none",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>
                {/* Stem */}
                <div className="w-0.5 h-2" style={{ background: marker.active ? "#FF1F7D" : "rgba(255,31,125,0.25)" }} />
                {/* Dot at base */}
                <div className="w-1 h-1 rounded-full" style={{ background: marker.active ? "rgba(255,31,125,0.4)" : "rgba(255,31,125,0.15)" }} />
              </div>
              {/* Label */}
              <div
                className="mt-1 px-2 py-0.5 rounded-full text-center whitespace-nowrap"
                style={{
                  background: marker.active ? "rgba(255,31,125,0.9)" : "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <p className="text-white font-bold" style={{ fontSize: "7px" }}>{marker.name}</p>
                {marker.active && (
                  <p style={{ fontSize: "6px", color: "rgba(255,255,255,0.7)" }}>{marker.count} women</p>
                )}
              </div>
            </div>
          ))}

          {/* Pulse rings on active markers */}
          {CITY_MARKERS.filter((m) => m.active).map((marker) => (
            <div
              key={`pulse-${marker.name}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${marker.x}%`,
                top: `${marker.y}%`,
                transform: "translate(-50%, calc(-100% - 14px))",
                width: "48px",
                height: "48px",
                marginLeft: "-10px",
                marginTop: "-10px",
                border: "1.5px solid rgba(255,31,125,0.3)",
                animation: "ping 2.5s cubic-bezier(0,0,0.2,1) infinite",
              }}
            />
          ))}

          {/* Live tag */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,31,125,0.15)", backdropFilter: "blur(8px)" }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#FF1F7D" }} />
            <span className="text-xs font-bold" style={{ color: "#FF69B4" }}>LIVE · NYC</span>
          </div>
        </div>

        {/* Neighborhood pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          {CITY_MARKERS.map((m) => (
            <div
              key={m.name}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: m.active ? "rgba(255,31,125,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${m.active ? "rgba(255,31,125,0.3)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: m.active ? "#FF1F7D" : "rgba(255,255,255,0.2)" }} />
              <span className="text-xs font-semibold" style={{ color: m.active ? "#FF69B4" : "rgba(255,255,255,0.4)" }}>{m.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 8: THE ENVELOPE ─── */}
      <section className="px-6 py-16 flex flex-col items-center" style={{ background: "var(--pale-pink-bg)" }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-8 text-center" style={{ color: "var(--bb-pink)" }}>YOUR INVITATION</p>

        {envelopeState !== "open" ? (
          <>
            {/* The Envelope */}
            <div
              className="relative w-full max-w-sm cursor-pointer select-none"
              onClick={openEnvelope}
              style={{
                perspective: "600px",
              }}
            >
              {/* Envelope body */}
              <div
                className="relative w-full rounded-3xl overflow-visible"
                style={{
                  background: "#FDF8F2",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                  paddingTop: "62%",
                  transition: "transform 0.6s ease",
                  transform: envelopeState === "opening" ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* Envelope flap */}
                <div
                  className="absolute top-0 left-0 right-0"
                  style={{
                    height: "50%",
                    background: "#FDF8F2",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    transformOrigin: "top center",
                    transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                    transform: envelopeState === "opening" ? "rotateX(-160deg)" : "rotateX(0deg)",
                    zIndex: 2,
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                />

                {/* Wax seal */}
                <div
                  className="absolute flex items-center justify-center rounded-full z-10"
                  style={{
                    width: "52px",
                    height: "52px",
                    background: "#FF1F7D",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    boxShadow: "0 2px 12px rgba(255,31,125,0.4)",
                    transition: "opacity 0.3s",
                    opacity: envelopeState === "opening" ? 0 : 1,
                  }}
                >
                  <BBLogo size={24} light />
                </div>

                {/* Bottom fold lines */}
                <div className="absolute bottom-0 left-0 right-0" style={{ height: "50%", overflow: "hidden" }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100%", clipPath: "polygon(0 100%, 50% 0, 100% 100%)", background: "#F5EEE6" }} />
                </div>
              </div>
            </div>

            <div className="text-center mt-8 max-w-xs">
              <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--bb-black)" }}>The city is opening.</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-2">
                Applications are reviewed by real women.
              </p>
              <p className="text-sm font-semibold mb-6" style={{ color: "var(--bb-pink)" }}>
                Request an invitation.
              </p>
              <button
                onClick={openEnvelope}
                className="w-full py-4 rounded-full font-bold text-base tracking-wide transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: "var(--bb-pink)", color: "white" }}
              >
                Open Envelope
              </button>
            </div>
          </>
        ) : (
          /* Application form — envelope is open */
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.1)" }}>
              <div className="flex items-center gap-2 mb-1">
                <BBLogo size={20} />
                <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>BLOOM REQUEST</p>
              </div>
              <h3 className="text-xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>Request your invitation</h3>
              <p className="text-xs text-gray-400 mb-5">Reviewed by real women. No algorithm.</p>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Your first name"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2 border-transparent"
                  style={{ background: "var(--pale-pink-bg)", color: "var(--bb-black)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2 border-transparent"
                  style={{ background: "var(--pale-pink-bg)", color: "var(--bb-black)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
                <input
                  type="text"
                  placeholder="Your neighborhood (e.g. Williamsburg)"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2 border-transparent"
                  style={{ background: "var(--pale-pink-bg)", color: "var(--bb-black)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
                <textarea
                  placeholder="Why do you want to join BloomBay? (optional)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2 border-transparent resize-none"
                  style={{ background: "var(--pale-pink-bg)", color: "var(--bb-black)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
                <Link
                  href="/onboard"
                  className="block w-full py-4 rounded-full text-center font-bold text-base transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ background: "var(--bb-pink)", color: "white" }}
                >
                  Send Bloom Request
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-6 py-7 flex items-center justify-between" style={{ background: "#1A0514" }}>
        <div className="flex items-center gap-2.5">
          <BBLogo size={22} light />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>BLOOMBAY</span>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>NYC · 2025</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>@welovebloombay</p>
        </div>
      </footer>
    </div>
  );
}
