"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BBLogo } from "./bb-logo";
import { createClient } from "@/lib/supabase/client";
import { welcomeNewMember } from "@/lib/yande/community-coordinator";

// ─── STATIC DATA ────────────────────────────────────────────────────────────

const GOALS = [
  "Find my people in NYC",
  "Build real friendships",
  "Find my girl group",
  "Get out of my routine",
  "Sober social life",
  "Network with ambitious women",
];

const ERAS = [
  "Building something big",
  "Healing era",
  "Soft life era",
  "Learning & growing",
  "New chapter",
  "Focused & driven",
];

const INTERESTS = [
  "Brunch and dinners",
  "Museums and culture",
  "Gym and fitness",
  "Faith community",
  "Afrobeats and live music",
  "Fashion and style",
  "Building and tech",
  "City walks and cafés",
  "Reading and book clubs",
  "Sober social life",
  "Wellness and healing",
  "Travel and exploring",
];

const LIFESTYLE = [
  "I don't drink",
  "Halal food matters to me",
  "Faith is central to my social life",
  "No smoking please",
  "I have kids",
  "Drug-free spaces only",
];

const SCHEDULE = [
  "Weekday mornings",
  "Weekday evenings",
  "Weekend mornings",
  "Weekend afternoons",
  "Weekend evenings",
  "Spontaneous — just send me things",
];

const BOROUGHS = ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island"];

const CLUBS = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Dinner Society",  desc: "Girls dinners, reservations, and table talks", count: 312 },
  { id: "22222222-2222-2222-2222-222222222222", name: "Museum Girls",    desc: "Culture, art, and city walks together",         count: 187 },
  { id: "33333333-3333-3333-3333-333333333333", name: "Book Club",       desc: "Reading, reflection, and good conversations",   count: 156 },
  { id: "44444444-4444-4444-4444-444444444444", name: "Wellness Circle", desc: "Pilates, yoga, and feeling good together",      count: 203 },
  { id: "55555555-5555-5555-5555-555555555555", name: "Sunday Walks",    desc: "Morning walks, coffee, and fresh air",          count: 142 },
  { id: "66666666-6666-6666-6666-666666666666", name: "Travel Girls",    desc: "Plan trips, share spots, explore together",     count: 98  },
];

const TOTAL_STEPS = 9; // 0 = welcome, 1–8 = form steps

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function toggleNum(set: Set<number>, i: number): Set<number> {
  const next = new Set(set);
  if (next.has(i)) next.delete(i); else next.add(i);
  return next;
}

function toggleStr(set: Set<string>, v: string): Set<string> {
  const next = new Set(set);
  if (next.has(v)) next.delete(v); else next.add(v);
  return next;
}

// ─── UI ATOMS ────────────────────────────────────────────────────────────────

function Progress({ step }: { step: number }) {
  return (
    <div className="flex gap-1 mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className="h-1 rounded-full flex-1 transition-all duration-300"
          style={{ background: i <= step ? "var(--bb-pink)" : "#F0E0E8" }}
        />
      ))}
    </div>
  );
}

function PinkBtn({
  children, onClick, disabled, loading, type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-4 rounded-full font-bold text-base transition-all active:scale-[0.98]"
      style={{
        background: disabled || loading ? "#FFB6D0" : "var(--bb-pink)",
        color: "white",
        cursor: disabled || loading ? "default" : "pointer",
      }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          Working…
        </span>
      ) : children}
    </button>
  );
}

function Field({
  label, children, hint,
}: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, type = "text",
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent transition-colors"
      style={{ color: "var(--bb-black)" }}
      onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
      onBlur={(e) => (e.target.style.borderColor = "transparent")}
    />
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style={{ background: "#FFE0EE", color: "#c40060" }}>
      {msg}
    </div>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5 mt-6 first:mt-0">
      <h3 className="text-xl font-bold" style={{ color: "var(--bb-black)" }}>{title}</h3>
      {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function MultiGrid({ items, selected, toggle }: { items: string[]; selected: Set<number>; toggle: (i: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 mb-2">
      {items.map((label, i) => {
        const on = selected.has(i);
        return (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="rounded-2xl px-3 py-3.5 text-sm font-medium text-left transition-all active:scale-[0.98]"
            style={{
              background: on ? "var(--light-pink)" : "white",
              border: `2px solid ${on ? "var(--bb-pink)" : "#F0F0F0"}`,
              color: "var(--bb-black)",
            }}
          >
            {on && <span className="font-bold mr-1.5" style={{ color: "var(--bb-pink)" }}>✓</span>}
            {label}
          </button>
        );
      })}
    </div>
  );
}

function ToggleRow({ label, on, toggle }: { label: string; on: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="w-full rounded-2xl px-4 py-3.5 flex items-center justify-between text-left transition-all"
      style={{
        background: on ? "var(--light-pink)" : "white",
        border: `2px solid ${on ? "var(--bb-pink)" : "#F0F0F0"}`,
      }}
    >
      <span className="text-sm font-medium" style={{ color: "var(--bb-black)" }}>{label}</span>
      {on && <span className="font-bold text-sm" style={{ color: "var(--bb-pink)" }}>✓</span>}
    </button>
  );
}


// ─── SCATTERED BLOB CHIPS (Onboarding interest selector) ─────────────────────

const BLOB_COLORS = [
  { bg: "#FF1F7D", text: "white" },
  { bg: "#FF69B4", text: "white" },
  { bg: "#FFB6D0", text: "#c40060" },
  { bg: "#FFC2D4", text: "#8B0040" },
  { bg: "#FF1F7D", text: "white" },
  { bg: "#FF69B4", text: "white" },
  { bg: "#FFD6E8", text: "#c40060" },
  { bg: "#FFB6D0", text: "#8B0040" },
];
const BLOB_ROTATIONS = [-4, 3, -6, 5, -2, 7, -5, 2, -3, 6, -1, 4];
const BLOB_OFFSETS   = [0, 18, -10, 28, -18, 8, -28, 14, -4, 22, -14, 4];
const BLOB_ICONS     = ["🌸", "✿", "🌷", "✦", "🌺", "✿", "🌸", "✦", "🌷", "🌸", "✿", "🌺"];

function ScatteredBlobs({ items, selected, toggle }: { items: string[]; selected: Set<number>; toggle: (i: number) => void }) {
  const [shaking, setShaking] = React.useState<number | null>(null);

  function handlePress(i: number) {
    toggle(i);
    setShaking(i);
    setTimeout(() => setShaking(null), 550);
  }

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: "4px 0 12px" }}>
        {items.map((label, i) => {
          const on = selected.has(i);
          const col = BLOB_COLORS[i % BLOB_COLORS.length];
          const rot = BLOB_ROTATIONS[i % BLOB_ROTATIONS.length];
          const dx  = BLOB_OFFSETS[i % BLOB_OFFSETS.length];
          const icon = BLOB_ICONS[i % BLOB_ICONS.length];
          return (
            <button
              key={i}
              onClick={() => handlePress(i)}
              style={{
                borderRadius: "100px",
                padding: "10px 18px",
                background: on ? col.bg : "white",
                color: on ? col.text : "#c40060",
                border: `2px solid ${on ? col.bg : "#FFB6D0"}`,
                fontWeight: on ? 700 : 500,
                fontSize: "13px",
                transform: `rotate(${rot}deg) translateX(${dx}px)`,
                animation: shaking === i ? "blobShake 0.55s ease-in-out" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: on ? `0 4px 16px ${col.bg}55` : "0 2px 8px rgba(0,0,0,0.06)",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "11px", lineHeight: 1 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </div>
      <style>{`
        @keyframes blobShake {
          0%   { transform: rotate(var(--r, 0deg)) scale(1.0); }
          12%  { transform: rotate(calc(var(--r, 0deg) + 14deg)) scale(1.18); }
          25%  { transform: rotate(calc(var(--r, 0deg) - 12deg)) scale(1.18); }
          38%  { transform: rotate(calc(var(--r, 0deg) + 8deg)) scale(1.12); }
          50%  { transform: rotate(calc(var(--r, 0deg) - 5deg)) scale(1.07); }
          65%  { transform: rotate(calc(var(--r, 0deg) + 3deg)) scale(1.04); }
          80%  { transform: rotate(calc(var(--r, 0deg) - 1deg)) scale(1.02); }
          100% { transform: rotate(var(--r, 0deg)) scale(1.0); }
        }
      `}</style>
    </>
  );
}

// ─── INTRO SLIDES ────────────────────────────────────────────────────────────

const SLIDES = [
  {
    bg: "linear-gradient(158deg, #8E0040 0%, #C00055 18%, #FF1F7D 60%, #FF4D8A 100%)",
    kicker: "✦ New York City · 2026 ✦",
    headline: "A world built\nfor women.",
    body: "BloomBay is the first real social platform just for women in New York City. No algorithms, no noise — just your people.",
    icon: "🌸",
  },
  {
    bg: "linear-gradient(158deg, #6B003A 0%, #A8004E 20%, #FF1F7D 65%, #FF69B4 100%)",
    kicker: "✦ FIND YOUR PEOPLE ✦",
    headline: "Join a club.\nFind your girls.",
    body: "Dinner Society. Museum Girls. Book Club. Wellness Circle. Small, intimate clubs where real friendships are made.",
    icon: "✿",
  },
  {
    bg: "linear-gradient(158deg, #7A0040 0%, #B80052 18%, #FF1F7D 58%, #FF8CB3 100%)",
    kicker: "✦ EVERY WEEK ✦",
    headline: "Real events.\nCurated for you.",
    body: "Dinners, walks, brunches, cultural nights. Every gathering is matched to who you are and where you live.",
    icon: "🌺",
  },
  {
    bg: "linear-gradient(158deg, #8E0040 0%, #C00055 18%, #FF1F7D 60%, #FF4D8A 100%)",
    kicker: "✦ YOU BELONG HERE ✦",
    headline: "2,400+ women\nare waiting.",
    body: "Your table is already set. Your people are already here. All you have to do is show up.",
    icon: "✦",
    isFinal: true,
  },
];

function IntroSlides({ onDone }: { onDone: () => void }) {
  const [slide, setSlide] = React.useState(0);
  const [exiting, setExiting] = React.useState(false);
  const touchStart = React.useRef<number | null>(null);

  function next() {
    if (slide < SLIDES.length - 1) {
      setExiting(true);
      setTimeout(() => { setSlide((s) => s + 1); setExiting(false); }, 220);
    } else {
      onDone();
    }
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    touchStart.current = null;
  }

  const s = SLIDES[slide];

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ background: s.bg, transition: "background 0.5s ease" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Film grain overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
        opacity: 0.65,
      }} />

      {/* Concentric rings */}
      {[88, 66, 46].map((vw, i) => (
        <div key={i} className="absolute pointer-events-none" style={{
          left: "50%", top: "38%",
          width: `${vw}vw`, height: `${vw}vw`,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          border: `1px solid rgba(255,255,255,${[0.08, 0.05, 0.03][i]})`,
        }} />
      ))}

      {/* Ghost BLOOM watermark */}
      <div className="absolute pointer-events-none select-none" style={{ bottom: "18%", left: "-8px", right: 0, overflow: "hidden", zIndex: 0 }}>
        <p style={{
          fontFamily: "var(--font-playfair)", fontWeight: 900,
          fontSize: "clamp(108px,36vw,200px)", lineHeight: 0.78,
          color: "rgba(255,255,255,0.065)",
          letterSpacing: "-0.04em", whiteSpace: "nowrap",
        }}>BLOOM</p>
      </div>

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-6 pt-14 pb-2" style={{ zIndex: 2 }}>
        <div className="flex items-center gap-2">
          <BBLogo size={26} />
          <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontStyle: "italic", fontSize: "15px", color: "rgba(255,255,255,0.92)" }}>BloomBay</p>
        </div>
        <button
          onClick={onDone}
          style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}
        >
          SKIP
        </button>
      </div>

      {/* Slide progress dots */}
      <div className="relative flex items-center justify-center gap-2 pt-3" style={{ zIndex: 2 }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            style={{
              width: i === slide ? 22 : 6,
              height: 6,
              borderRadius: 99,
              background: i === slide ? "white" : "rgba(255,255,255,0.3)",
              transition: "all 0.3s ease",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Slide content */}
      <div
        className="relative flex-1 flex flex-col justify-center px-8"
        style={{ zIndex: 2, opacity: exiting ? 0 : 1, transform: exiting ? "translateX(-20px)" : "translateX(0)", transition: "opacity 0.22s ease, transform 0.22s ease" }}
      >
        {/* Kicker */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25))" }} />
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.3em", color: "rgba(255,255,255,0.52)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            {s.kicker}
          </p>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.25), transparent)" }} />
        </div>

        {/* Large icon */}
        <p style={{ fontSize: "clamp(52px,16vw,72px)", lineHeight: 1, marginBottom: 20 }}>{s.icon}</p>

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--font-playfair)", fontWeight: 900, fontStyle: "italic",
          fontSize: "clamp(44px,13vw,62px)",
          color: "white", lineHeight: 0.9,
          letterSpacing: "-0.03em", margin: "0 0 20px",
          whiteSpace: "pre-line",
        }}>{s.headline}</h1>

        {/* Body */}
        <p style={{
          fontFamily: "var(--font-jost)", fontWeight: 400,
          fontSize: "clamp(14px,3.8vw,17px)",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.55, maxWidth: "340px",
        }}>{s.body}</p>
      </div>

      {/* Bottom CTA */}
      <div
        className="relative px-6 pb-safe"
        style={{
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.09)",
          paddingTop: 20,
          paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 24px)",
          zIndex: 2,
        }}
      >
        <button
          onClick={next}
          className="w-full py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98]"
          style={{
            fontFamily: "var(--font-jost)",
            background: "white",
            color: "#FF1F7D",
            boxShadow: "0 8px 32px rgba(0,0,0,0.24)",
            letterSpacing: "0.14em",
          }}
        >
          {slide < SLIDES.length - 1 ? "NEXT →" : "JOIN BLOOMBAY →"}
        </button>

        <p className="text-center mt-3" style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.38)" }}>
          Already a member?{" "}
          <a href="/login" style={{ color: "rgba(255,255,255,0.65)", fontWeight: 700 }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}

function WelcomeSplash({ onStart }: { onStart: () => void }) {
  const [agreeTerms, setAgreeTerms]     = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeRules, setAgreeRules]     = useState(false);
  const [agreeAge, setAgreeAge]         = useState(false);
  const allAgreed = agreeTerms && agreePrivacy && agreeRules && agreeAge;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(158deg, #8E0040 0%, #C00055 18%, #FF1F7D 58%, #FF4D8A 100%)" }}>

      {/* ── BACKGROUND COMPOSITION ── */}

      {/* Film grain */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
        opacity: 0.65,
      }} />

      {/* Concentric halo rings centred on the hero */}
      {[90, 70, 52].map((vw, i) => (
        <div key={i} className="absolute pointer-events-none" style={{
          left: "50%", top: "42%",
          width: `${vw}vw`, height: `${vw}vw`,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          border: `1px solid rgba(255,255,255,${[0.09, 0.06, 0.04][i]})`,
        }} />
      ))}

      {/* Upper-left abstract petal */}
      <div className="absolute pointer-events-none" style={{
        left: "-44px", top: "20%",
        width: "118px", height: "168px",
        borderRadius: "55% 45% 65% 35% / 45% 55% 45% 55%",
        background: "rgba(255,255,255,0.045)",
        transform: "rotate(-30deg)",
      }} />

      {/* Lower-right accent petal */}
      <div className="absolute pointer-events-none" style={{
        right: "-28px", bottom: "34%",
        width: "100px", height: "142px",
        borderRadius: "40% 60% 35% 65% / 65% 35% 65% 35%",
        background: "rgba(255,255,255,0.032)",
        transform: "rotate(16deg)",
      }} />

      {/* Ghost BLOOM — large typographic watermark */}
      <div className="absolute pointer-events-none select-none" style={{ bottom: "19%", left: "-8px", right: 0, overflow: "hidden", zIndex: 0 }}>
        <p style={{
          fontFamily: "var(--font-playfair)", fontWeight: 900,
          fontSize: "clamp(112px,37vw,215px)", lineHeight: 0.78,
          color: "rgba(255,255,255,0.078)",
          letterSpacing: "-0.04em", whiteSpace: "nowrap",
        }}>BLOOM</p>
      </div>

      {/* Vertical editorial sidebar text */}
      <div className="absolute pointer-events-none select-none" style={{
        right: 16, top: "50%",
        transform: "translateY(-50%) rotate(90deg)",
        transformOrigin: "center center",
        fontFamily: "var(--font-jost)",
        fontSize: "6.5px", fontWeight: 800,
        letterSpacing: "0.38em",
        color: "rgba(255,255,255,0.17)",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        zIndex: 1,
      }}>BLOOMBAY · NEW YORK CITY · 2026</div>

      {/* ── TOP NAV ── */}
      <div className="relative flex items-center justify-between px-6 pt-14 pb-2" style={{ zIndex: 2 }}>
        <div className="flex items-center gap-2">
          <BBLogo size={26} />
          <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontStyle: "italic", fontSize: "15px", color: "rgba(255,255,255,0.92)" }}>
            BloomBay
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.42)" }} />
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.3em", color: "rgba(255,255,255,0.46)", textTransform: "uppercase" }}>NYC</p>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="relative flex-1 flex flex-col justify-center px-6" style={{ paddingBottom: "4px", zIndex: 2 }}>

        {/* Centered kicker with extending ornamental lines */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28))" }} />
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.32em", color: "rgba(255,255,255,0.58)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            ✦ a space to bloom ✦
          </p>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.28), transparent)" }} />
        </div>

        {/* Primary: Women are / gathering. */}
        <div style={{ marginBottom: 22 }}>
          <p style={{
            fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(30px,9vw,44px)",
            color: "rgba(255,255,255,0.78)",
            lineHeight: 1.05, letterSpacing: "-0.01em", margin: 0,
          }}>Women are</p>
          <h1 style={{
            fontFamily: "var(--font-playfair)", fontWeight: 900, fontStyle: "italic",
            fontSize: "clamp(64px,19vw,92px)",
            color: "white",
            lineHeight: 0.84, letterSpacing: "-0.04em",
            margin: 0,
            textShadow: "0 4px 32px rgba(0,0,0,0.16)",
          }}>gathering.</h1>
        </div>

        {/* Ornamental divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.18)" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>✦</span>
          <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.18)" }} />
        </div>

        {/* Secondary: it's a woman's world. we're in it. */}
        <div style={{ marginBottom: 26 }}>
          <p style={{ fontWeight: 300, fontSize: "clamp(14px,4vw,19px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.2, margin: "0 0 2px" }}>it&apos;s a</p>
          <p style={{
            fontFamily: "var(--font-playfair)", fontWeight: 900,
            fontSize: "clamp(28px,8vw,38px)", lineHeight: 0.9,
            letterSpacing: "-0.02em",
            WebkitTextStroke: "1.5px rgba(255,255,255,0.78)",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            margin: "0 0 6px",
          }}>woman&apos;s world.</p>
          <p style={{
            fontFamily: "var(--font-playfair)", fontStyle: "italic",
            fontSize: "clamp(14px,3.8vw,18px)",
            color: "rgba(255,255,255,0.5)", margin: 0, letterSpacing: "0.01em",
          }}>we&apos;re in it.</p>
        </div>

        {/* Social proof — avatar stack */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex" }}>
            {(["#FF69B4","#A855F7","#0EA5E9","#D4A853"] as const).map((c, i) => (
              <div key={i} style={{
                width: 26, height: 26, borderRadius: "50%",
                background: `linear-gradient(135deg,${c},${c}BB)`,
                border: "2px solid rgba(255,255,255,0.38)",
                marginLeft: i > 0 ? -9 : 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "9px", fontWeight: 800, color: "white",
                flexShrink: 0, position: "relative", zIndex: 4 - i,
              }}>
                {["A","Z","T","J"][i]}
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.58)", letterSpacing: "0.03em" }}>
            2,400+ women in NYC
          </p>
        </div>
      </div>

      {/* ── BOTTOM STRIP — glassmorphism CTA ── */}
      <div className="relative px-6 pt-5 rounded-t-[28px]"
        style={{
          background: "rgba(0,0,0,0.36)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 24px)",
          zIndex: 2,
        }}>

        {/* 2×2 checkbox grid — compact, not a legal wall */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-4">
          {[
            { key: "terms",   label: "Terms of Service",    val: agreeTerms,   set: setAgreeTerms },
            { key: "privacy", label: "Privacy Policy",       val: agreePrivacy, set: setAgreePrivacy },
            { key: "rules",   label: "Community Guidelines", val: agreeRules,   set: setAgreeRules },
            { key: "age",     label: "18 or older",          val: agreeAge,     set: setAgreeAge },
          ].map(item => (
            <button key={item.key} onClick={() => item.set(!item.val)}
              className="flex items-center gap-2.5 text-left py-0.5">
              <div className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: 18, height: 18, borderRadius: 5,
                  background: item.val ? "white" : "rgba(255,255,255,0.12)",
                  border: `1.5px solid ${item.val ? "white" : "rgba(255,255,255,0.28)"}`,
                }}>
                {item.val && (
                  <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="#FF1F7D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{item.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onStart}
          disabled={!allAgreed}
          className="w-full py-4 rounded-full font-bold text-sm uppercase transition-all active:scale-[0.98]"
          style={{
            fontFamily: "var(--font-jost)",
            background: allAgreed ? "white" : "rgba(255,255,255,0.16)",
            color: allAgreed ? "#FF1F7D" : "rgba(255,255,255,0.35)",
            letterSpacing: allAgreed ? "0.14em" : "0.06em",
            boxShadow: allAgreed ? "0 8px 40px rgba(0,0,0,0.28)" : "none",
          }}>
          {allAgreed ? "LET'S START →" : "Agree to all to continue"}
        </button>

        <p className="text-center text-xs mt-3" style={{ color: "rgba(255,255,255,0.34)" }}>
          Already a member?{" "}
          <Link href="/login" className="font-bold" style={{ color: "rgba(255,255,255,0.68)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export function OnboardFlow() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  // Step 1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2
  const [firstName, setFirstName] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");

  // Step 3 – avatar
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Step 4 – selfie
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  // Step 5 – location
  const [borough, setBorough] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  // Step 6 – vibe
  const [goals, setGoals] = useState<Set<number>>(new Set());
  const [era, setEra] = useState<number | null>(null);
  const [interests, setInterests] = useState<Set<number>>(new Set());
  const [lifestyle, setLifestyle] = useState<Set<number>>(new Set());
  const [schedule, setSchedule] = useState<Set<number>>(new Set());

  // Step 7 – clubs
  const [selectedClubs, setSelectedClubs] = useState<Set<string>>(new Set());

  // Step 8 – invites
  const [inviteEmails, setInviteEmails] = useState(["", "", ""]);

  // Agreements – required before joining
  const [agreeTerms,   setAgreeTerms]   = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeRules,   setAgreeRules]   = useState(false);
  const [agreeAge,     setAgreeAge]     = useState(false);
  const allAgreed = agreeTerms && agreePrivacy && agreeRules && agreeAge;

  // ── helpers ──────────────────────────────────────────────────────
  function advance() { setStep((s) => s + 1); setError(null); }
  function goBack()  { setStep((s) => s - 1); setError(null); }

  if (showIntro) return <IntroSlides onDone={() => setShowIntro(false)} />;
  if (step === 0 && !emailVerificationSent) return <WelcomeSplash onStart={advance} />;

  async function getUser() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // ── STEP 1 – create account ───────────────────────────────────────
  async function handleCreateAccount() {
    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords don't match.");
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      if (err) throw err;
      if (!data.user) throw new Error("Sign-up failed — please try again.");
      if (!data.session) {
        // Email confirmation required
        setEmailVerificationSent(true);
        return;
      }
      advance();
    } catch (e: unknown) {
      setError((e as Error).message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 2 – save profile basics ─────────────────────────────────
  async function handleSaveProfile() {
    if (!firstName.trim()) return setError("Enter your first name.");
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      const { error: err } = await supabase
        .from("profiles")
        .update({ first_name: firstName.trim(), bio: bio.trim() || null, age: age ? parseInt(age) : null })
        .eq("id", user.id);
      if (err) throw err;
      advance();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 3 – upload avatar ────────────────────────────────────────
  async function handleUploadAvatar() {
    setLoading(true);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop() ?? "jpg";
        const { data: upload, error: upErr } = await supabase.storage
          .from("avatars")
          .upload(`${user.id}/avatar.${ext}`, avatarFile, { upsert: true });
        if (!upErr && upload) {
          const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(upload.path);
          await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("id", user.id);
        }
      }
      advance();
    } catch {
      // Storage may not be configured yet — skip gracefully
      advance();
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 4 – selfie verification ──────────────────────────────────
  async function handleSelfieVerification() {
    setLoading(true);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      if (selfieFile) {
        const ext = selfieFile.name.split(".").pop() ?? "jpg";
        const { data: upload, error: upErr } = await supabase.storage
          .from("verification")
          .upload(`${user.id}/selfie.${ext}`, selfieFile, { upsert: true });
        if (!upErr && upload) {
          const { data: urlData } = supabase.storage.from("verification").getPublicUrl(upload.path);
          await supabase.from("profiles").update({
            verification_photo_url: urlData.publicUrl,
            verification_status: "pending",
          }).eq("id", user.id);
        } else {
          // Storage not ready — mark pending anyway
          await supabase.from("profiles").update({ verification_status: "pending" }).eq("id", user.id);
        }
      }
      advance();
    } catch {
      advance();
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 5 – save location ────────────────────────────────────────
  async function handleSaveLocation() {
    if (!neighborhood.trim()) return setError("Tell us your neighborhood.");
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      const { error: err } = await supabase
        .from("profiles")
        .update({ city: "New York", borough: borough || null, neighborhood: neighborhood.trim() })
        .eq("id", user.id);
      if (err) throw err;
      advance();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 6 – save vibe ────────────────────────────────────────────
  async function handleSaveVibe() {
    if (goals.size === 0) return setError("Pick at least one goal.");
    if (interests.size === 0) return setError("Pick at least one interest.");
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      const { error: err } = await supabase.from("profiles").update({
        goals:      Array.from(goals).map((i) => GOALS[i]),
        era:        era !== null ? ERAS[era] : null,
        interests:  Array.from(interests).map((i) => INTERESTS[i]),
        lifestyle:  Array.from(lifestyle).map((i) => LIFESTYLE[i]),
        schedule:   Array.from(schedule).map((i) => SCHEDULE[i]),
      }).eq("id", user.id);
      if (err) throw err;
      advance();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 7 – join clubs ───────────────────────────────────────────
  async function handleJoinClubs() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      if (selectedClubs.size > 0) {
        const rows = Array.from(selectedClubs).map((club_id) => ({ user_id: user.id, club_id }));
        const { error: err } = await supabase.from("user_clubs").upsert(rows, { onConflict: "user_id,club_id" });
        if (err) throw err;
      }
      advance();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 8 – invites + complete ───────────────────────────────────
  async function handleComplete() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const user = await getUser();
      if (!user) throw new Error("Not signed in.");
      const valid = inviteEmails.filter((e) => e.includes("@"));
      if (valid.length > 0) {
        await supabase.from("invites").insert(valid.map((e) => ({ inviter_id: user.id, email: e })));
      }
      await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", user.id);
      // Fire-and-forget: Yande sends the welcome message
      welcomeNewMember(user.id).catch(() => {});
      router.push("/member/home");
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // ── RENDER ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="max-w-md mx-auto w-full px-5 pt-12 pb-20">
        {step > 0 && !emailVerificationSent && (
          <button
            onClick={goBack}
            className="mb-5 text-sm font-medium text-gray-400 flex items-center gap-1 hover:text-gray-600 transition-colors"
          >
            ← Back
          </button>
        )}

        <Progress step={step} />



        {/* ── EMAIL VERIFICATION PENDING ──────────────────────────────── */}
        {emailVerificationSent && (
          <div className="flex flex-col items-center text-center pt-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: "var(--light-pink)" }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="4" y="8" width="32" height="24" rx="4" stroke="var(--bb-pink)" strokeWidth="2" />
                <path d="M4 12L20 24L36 12" stroke="var(--bb-pink)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--bb-black)" }}>Check your email</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              We sent a confirmation link to <strong style={{ color: "var(--bb-black)" }}>{email}</strong>.
              Click it to verify your account, then come back to continue.
            </p>
            <div className="bg-white rounded-3xl p-4 mb-6 w-full text-left">
              <p className="text-sm font-bold mb-1" style={{ color: "var(--bb-black)" }}>Tip: check your spam folder</p>
              <p className="text-xs text-gray-400">After verifying, click below to continue your sign-up.</p>
            </div>
            <PinkBtn
              onClick={async () => {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user?.email_confirmed_at) {
                  setEmailVerificationSent(false);
                  advance();
                } else {
                  setError("Email not yet confirmed. Check your inbox.");
                }
              }}
            >
              I&apos;ve confirmed my email →
            </PinkBtn>
            {error && <ErrorBanner msg={error} />}
            <button onClick={() => setEmailVerificationSent(false)} className="mt-3 text-sm text-gray-400">
              Use a different email
            </button>
          </div>
        )}

        {/* ── STEP 1: Create Account ───────────────────────────────────── */}
        {step === 1 && !emailVerificationSent && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 1 OF 8</p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>Create your account.</h2>
            <p className="text-gray-400 text-sm mb-7">You&apos;re almost in.</p>

            {error && <ErrorBanner msg={error} />}

            <div className="flex flex-col gap-4 mb-8">
              <Field label="Email">
                <TextInput value={email} onChange={setEmail} placeholder="your@email.com" type="email" />
              </Field>
              <Field label="Password" hint="Minimum 8 characters">
                <TextInput value={password} onChange={setPassword} placeholder="••••••••" type="password" />
              </Field>
              <Field label="Confirm Password">
                <TextInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Same password again" type="password" />
              </Field>
            </div>

            <PinkBtn onClick={handleCreateAccount} loading={loading} disabled={!email || !password || !confirmPassword}>
              Create account →
            </PinkBtn>
            <p className="text-center text-xs text-gray-400 mt-4">
              Already a member?{" "}
              <Link href="/login" className="font-semibold" style={{ color: "var(--bb-pink)" }}>
                Log in
              </Link>
            </p>
          </div>
        )}

        {/* ── STEP 2: Basic Profile ────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 2 OF 8</p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>Tell us about you.</h2>
            <p className="text-gray-400 text-sm mb-7">This is how women will know you inside BloomBay.</p>

            {error && <ErrorBanner msg={error} />}

            <div className="flex flex-col gap-4 mb-8">
              <Field label="Your first name">
                <TextInput value={firstName} onChange={setFirstName} placeholder="Maya" />
              </Field>
              <Field label="Age" hint="Must be 18+">
                <TextInput value={age} onChange={setAge} placeholder="28" type="number" />
              </Field>
              <Field label="About you" hint="Optional — 200 characters max">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="I&#39;m a creative director who loves brunch and architecture. Always down for an impromptu gallery walk."
                  rows={3}
                  maxLength={200}
                  className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent transition-colors resize-none"
                  style={{ color: "var(--bb-black)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
                <p className="text-xs text-gray-400 text-right">{bio.length}/200</p>
              </Field>
            </div>

            <PinkBtn onClick={handleSaveProfile} loading={loading} disabled={!firstName}>
              Continue →
            </PinkBtn>
          </div>
        )}

        {/* ── STEP 3: Upload Photo ──────────────────────────────────────── */}
        {step === 3 && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 3 OF 8</p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>Add your photo.</h2>
            <p className="text-gray-400 text-sm mb-7">Women connect more when they can see each other.</p>

            <div className="flex flex-col items-center mb-7">
              <div
                className="relative w-36 h-36 rounded-full overflow-hidden cursor-pointer mb-4"
                style={{ border: `4px solid var(--bb-pink)` }}
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Your photo" fill unoptimized style={{ objectFit: "cover" }} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1" style={{ background: "var(--light-pink)" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <p className="text-xs font-bold" style={{ color: "var(--bb-pink)" }}>TAP TO ADD</p>
                  </div>
                )}
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setAvatarFile(f);
                  setAvatarPreview(URL.createObjectURL(f));
                }}
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="px-6 py-2.5 rounded-full text-sm font-bold border-2 transition-all active:scale-95"
                style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}
              >
                {avatarPreview ? "Change photo" : "Choose a photo"}
              </button>
            </div>

            <div className="bg-white rounded-3xl p-4 mb-8">
              <p className="text-sm font-bold mb-1" style={{ color: "var(--bb-black)" }}>Clear face, no filters needed.</p>
              <p className="text-xs text-gray-400">Just you, naturally. This helps women feel safe connecting with you.</p>
            </div>

            <PinkBtn onClick={handleUploadAvatar} loading={loading}>
              {avatarPreview ? "Looks good, continue →" : "Skip for now →"}
            </PinkBtn>
          </div>
        )}

        {/* ── STEP 4: Selfie Verification ───────────────────────────────── */}
        {step === 4 && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 4 OF 8</p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>Verify it&apos;s you.</h2>
            <p className="text-gray-400 text-sm mb-5">BloomBay is women only. We check every single member.</p>

            <div className="rounded-3xl p-4 mb-5" style={{ background: "var(--light-pink)" }}>
              <p className="text-sm font-bold mb-1" style={{ color: "var(--bb-black)" }}>Live selfie verification</p>
              <p className="text-xs leading-relaxed" style={{ color: "#9e6070" }}>
                Take a selfie holding a piece of paper with today&apos;s date written on it, or your phone screen showing the date.
                We&apos;ll review it within 24 hours. You can still explore BloomBay while we verify.
              </p>
            </div>

            <div
              className="relative w-full rounded-3xl overflow-hidden cursor-pointer mb-5"
              style={{ height: "220px", background: selfiePreview ? undefined : "#F5EDF0", border: "2px dashed var(--bb-pink)" }}
              onClick={() => selfieInputRef.current?.click()}
            >
              {selfiePreview ? (
                <Image src={selfiePreview} alt="Selfie" fill unoptimized style={{ objectFit: "cover" }} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="1.3">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <p className="text-sm font-bold" style={{ color: "var(--bb-pink)" }}>Take your selfie</p>
                  <p className="text-xs text-gray-400 text-center px-8">Tap to open camera. Front-facing camera will open on mobile.</p>
                </div>
              )}
            </div>
            <input
              ref={selfieInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setSelfieFile(f);
                setSelfiePreview(URL.createObjectURL(f));
              }}
            />

            <PinkBtn onClick={handleSelfieVerification} loading={loading}>
              {selfieFile ? "Submit for review →" : "Skip for now →"}
            </PinkBtn>
          </div>
        )}

        {/* ── STEP 5: City & Neighborhood ──────────────────────────────── */}
        {step === 5 && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 5 OF 8</p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>Where in NYC?</h2>
            <p className="text-gray-400 text-sm mb-7">Yande uses this to show you things nearby and find women close to you.</p>

            {error && <ErrorBanner msg={error} />}

            <div className="flex flex-col gap-5 mb-8">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">BOROUGH</label>
                <div className="flex flex-wrap gap-2">
                  {BOROUGHS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBorough(b)}
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                      style={{
                        background: borough === b ? "var(--bb-pink)" : "white",
                        color: borough === b ? "white" : "var(--bb-black)",
                        border: `2px solid ${borough === b ? "var(--bb-pink)" : "#E0E0E0"}`,
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="Your neighborhood">
                <TextInput
                  value={neighborhood}
                  onChange={setNeighborhood}
                  placeholder="Williamsburg, Crown Heights, Harlem…"
                />
              </Field>
            </div>

            <PinkBtn onClick={handleSaveLocation} loading={loading} disabled={!neighborhood}>
              Continue →
            </PinkBtn>
          </div>
        )}

        {/* ── STEP 6: Vibe & Interests ──────────────────────────────────── */}
        {step === 6 && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 6 OF 8</p>
            {error && <ErrorBanner msg={error} />}

            <SectionTitle
              title="What brings you here?"
              sub="Choose everything that feels right — this is how Yande finds your people."
            />
            <ScatteredBlobs items={GOALS} selected={goals} toggle={(i) => setGoals(toggleNum(goals, i))} />

            <div className="my-6 h-px" style={{ background: "var(--light-pink)" }} />

            <SectionTitle title="Your era right now?" sub="Pick one. Be honest — Yande uses this." />
            <div className="grid grid-cols-2 gap-2.5 mb-2">
              {ERAS.map((label, i) => {
                const on = era === i;
                return (
                  <button
                    key={i}
                    onClick={() => setEra(i)}
                    className="rounded-2xl px-3 py-3.5 text-sm font-semibold text-left transition-all active:scale-[0.98]"
                    style={{
                      background: on ? "var(--light-pink)" : "white",
                      border: `2px solid ${on ? "var(--bb-pink)" : "#F0F0F0"}`,
                      color: "var(--bb-black)",
                    }}
                  >
                    {on && <span className="font-bold mr-1.5" style={{ color: "var(--bb-pink)" }}>✓</span>}
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="my-6 h-px" style={{ background: "var(--light-pink)" }} />

            <SectionTitle title="What are you into?" sub="Pick everything that feels like you." />
            <ScatteredBlobs items={INTERESTS} selected={interests} toggle={(i) => setInterests(toggleNum(interests, i))} />

            <div className="my-6 h-px" style={{ background: "var(--light-pink)" }} />

            <SectionTitle
              title="A few private preferences."
              sub="Nobody else sees this. Yande uses it to match you with the right spaces and women."
            />
            <div className="flex flex-col gap-2.5 mb-2">
              {LIFESTYLE.map((label, i) => (
                <ToggleRow
                  key={i}
                  label={label}
                  on={lifestyle.has(i)}
                  toggle={() => setLifestyle(toggleNum(lifestyle, i))}
                />
              ))}
            </div>

            <div className="my-6 h-px" style={{ background: "var(--light-pink)" }} />

            <SectionTitle title="When are you generally free?" sub="Yande matches you to things that fit your life." />
            <div className="flex flex-col gap-2.5 mb-8">
              {SCHEDULE.map((label, i) => (
                <ToggleRow
                  key={i}
                  label={label}
                  on={schedule.has(i)}
                  toggle={() => setSchedule(toggleNum(schedule, i))}
                />
              ))}
            </div>

            <PinkBtn
              onClick={handleSaveVibe}
              loading={loading}
              disabled={goals.size === 0 || interests.size === 0}
            >
              Continue →
            </PinkBtn>
          </div>
        )}

        {/* ── STEP 7: Choose Clubs ──────────────────────────────────────── */}
        {step === 7 && (
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">STEP 7 OF 8</p>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--bb-black)" }}>Join some clubs.</h2>
            <p className="text-gray-400 text-sm mb-7">Find your people. You can always join more from the Clubs page.</p>

            {error && <ErrorBanner msg={error} />}

            <div className="flex flex-col gap-3 mb-8">
              {CLUBS.map((club) => {
                const on = selectedClubs.has(club.id);
                return (
                  <button
                    key={club.id}
                    onClick={() => setSelectedClubs(toggleStr(selectedClubs, club.id))}
                    className="w-full rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-[0.99]"
                    style={{
                      background: on ? "var(--light-pink)" : "white",
                      border: `2px solid ${on ? "var(--bb-pink)" : "#F0F0F0"}`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: on ? "var(--bb-pink)" : "var(--light-pink)" }}
                    >
                      <span className="text-xs font-bold" style={{ color: on ? "white" : "var(--bb-pink)" }}>
                        {club.name[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{club.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{club.desc}</p>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--bb-pink)" }}>
                        {club.count.toLocaleString()} women
                      </p>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center"
                      style={{
                        borderColor: on ? "var(--bb-pink)" : "#E0E0E0",
                        background: on ? "var(--bb-pink)" : "transparent",
                      }}
                    >
                      {on && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 5l2.5 2.5L8.5 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <PinkBtn onClick={handleJoinClubs} loading={loading}>
              {selectedClubs.size > 0
                ? `Join ${selectedClubs.size} club${selectedClubs.size > 1 ? "s" : ""} →`
                : "Skip for now →"}
            </PinkBtn>
          </div>
        )}

        {/* ── STEP 8: Invite Friends ────────────────────────────────────── */}
        {step === 8 && (
          <div>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--light-pink)" }}>
                <BBLogo size={38} />
              </div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--bb-black)" }}>
                Invite your girls.{" "}
                <span
                  className="italic"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
                >
                  Optional.
                </span>
              </h2>
              <p className="text-sm text-gray-400">Know women who should be inside BloomBay? Add their emails.</p>
            </div>

            {error && <ErrorBanner msg={error} />}

            <div className="flex flex-col gap-3 mb-4">
              {inviteEmails.map((em, i) => (
                <input
                  key={i}
                  type="email"
                  value={em}
                  onChange={(e) => {
                    const next = [...inviteEmails];
                    next[i] = e.target.value;
                    setInviteEmails(next);
                  }}
                  placeholder={`Friend ${i + 1}'s email`}
                  className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent transition-colors"
                  style={{ color: "var(--bb-black)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--bb-pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
              ))}
            </div>

            <button
              onClick={() => setInviteEmails([...inviteEmails, ""])}
              className="text-sm font-semibold flex items-center gap-1.5 mb-8"
              style={{ color: "var(--bb-pink)" }}
            >
              + Add another
            </button>

            <div className="rounded-3xl p-4 mb-6" style={{ background: "white", border: "1px solid var(--light-pink)" }}>
              <p className="text-sm font-bold mb-1" style={{ color: "var(--bb-black)" }}>You&apos;re almost inside.</p>
              <p className="text-xs text-gray-400">
                After this, you&apos;ll land in your BloomBay home.
                Your selfie verification will be reviewed within 24 hours.
              </p>
            </div>

            <PinkBtn onClick={handleComplete} loading={loading}>
              Enter BloomBay
            </PinkBtn>
            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full text-center text-sm text-gray-400 mt-3 py-2"
            >
              Skip invites &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
