"use client";

import { useState } from "react";
import Link from "next/link";
import { BBLogo } from "./bb-logo";

const GOALS = [
  { icon: "📚", label: "I want to join a book club" },
  { icon: "🤝", label: "I want more friendships" },
  { icon: "🥂", label: "I want fun gatherings & dinners" },
  { icon: "🏙️", label: "I moved to the city" },
  { icon: "🌿", label: "I want wellness & self care" },
  { icon: "📵", label: "I want to stop scrolling & start living" },
];

const INTERESTS = [
  { icon: "📚", label: "Book Clubs" },
  { icon: "🍽️", label: "Dinners" },
  { icon: "🎨", label: "Creative Circles" },
  { icon: "🌿", label: "Wellness" },
  { icon: "✈️", label: "Girls' Trips" },
  { icon: "✦", label: "Everything!" },
];

const AGE_RANGES = ["18–24", "25–30", "31–35", "36–40", "40+"];

const CITIES = [
  { city: "New York City", country: "USA", count: 1847 },
  { city: "Los Angeles", country: "USA", count: 412 },
  { city: "Chicago", country: "USA", count: 289 },
  { city: "Atlanta", country: "USA", count: 201 },
  { city: "Miami", country: "USA", count: 178 },
  { city: "London", country: "UK", count: 634 },
  { city: "Toronto", country: "Canada", count: 321 },
  { city: "Paris", country: "France", count: 198 },
  { city: "Lagos", country: "Nigeria", count: 445 },
  { city: "Accra", country: "Ghana", count: 213 },
  { city: "Dubai", country: "UAE", count: 167 },
  { city: "Sydney", country: "Australia", count: 145 },
];

const WAITLIST_GOAL = 2500;
const WAITLIST_CURRENT = 1847;

function WaxSeal({ size = "lg" }: { size?: "sm" | "lg" }) {
  const outer = size === "lg" ? "w-24 h-24" : "w-14 h-14";
  const inner = size === "lg" ? "w-16 h-16" : "w-9 h-9";
  const fontSize = size === "lg" ? "text-2xl" : "text-sm";
  return (
    <div
      className={`${outer} rounded-full flex items-center justify-center flex-shrink-0`}
      style={{
        background: "linear-gradient(135deg,#FF1F7D,#c4005a)",
        boxShadow: "0 8px 32px rgba(255,31,125,0.45)",
      }}
    >
      <div
        className={`${inner} rounded-full border-2 border-white/30 flex items-center justify-center`}
      >
        <span className={`text-white font-black ${fontSize}`} style={{ fontFamily: "serif" }}>BB</span>
      </div>
    </div>
  );
}

function ProgressBar({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min(100, (current / goal) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-2 font-semibold" style={{ color: "#888" }}>
        <span>{current.toLocaleString()} women in</span>
        <span>Goal: {goal.toLocaleString()}</span>
      </div>
      <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "#FFE0EE" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#FF1F7D,#FF69B4)",
            boxShadow: "0 0 10px rgba(255,31,125,0.6)",
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );
}

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: i === current ? "28px" : "7px",
            height: "7px",
            background: i <= current ? "#FF1F7D" : "#FFE0EE",
            boxShadow: i === current ? "0 0 8px rgba(255,31,125,0.5)" : "none",
          }}
        />
      ))}
    </div>
  );
}

export function WaitlistFlow() {
  const [step, setStep] = useState(0);
  const [opened, setOpened] = useState(false);
  const [goals, setGoals] = useState<Set<number>>(new Set());
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCity, setSelectedCity] = useState<typeof CITIES[0] | null>(null);
  const [cityQuery, setCityQuery] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [interests, setInterests] = useState<Set<number>>(new Set());
  const [foundingMother, setFoundingMother] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function toggleGoal(i: number) {
    const next = new Set(goals);
    if (next.has(i)) next.delete(i); else next.add(i);
    setGoals(next);
  }

  function toggleInterest(i: number) {
    const next = new Set(interests);
    if (next.has(i)) next.delete(i); else next.add(i);
    setInterests(next);
  }

  const filteredCities = cityQuery
    ? CITIES.filter((c) =>
        c.city.toLowerCase().includes(cityQuery.toLowerCase()) ||
        c.country.toLowerCase().includes(cityQuery.toLowerCase())
      )
    : CITIES;

  async function submit() {
    setSubmitting(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          email,
          phone: phone || undefined,
          city: selectedCity?.city,
          goals: Array.from(goals).map(i => GOALS[i]?.label ?? String(i)),
        }),
      });
    } catch {
      // silent — still show success
    }
    setSubmitting(false);
    setSubmitted(true);
    setStep(3);
  }

  const cityCount = selectedCity?.count ?? WAITLIST_CURRENT;

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: "#FFF5F8" }}>

      {/* ─── STEP 0 — Invitation envelope ─── */}
      {step === 0 && (
        <div className="w-full max-w-md mx-auto px-5 pt-12 pb-10 flex flex-col items-center">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <BBLogo size={48} />
            <p className="text-xs font-black tracking-[0.25em] uppercase mt-3" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
            <p className="text-xs italic text-gray-400 mt-1" style={{ fontFamily: "var(--font-playfair)" }}>Where you bloom.</p>
          </div>

          {/* Envelope / invitation card */}
          <div
            className="w-full rounded-3xl relative overflow-hidden"
            style={{
              background: "white",
              boxShadow: "0 16px 60px rgba(255,31,125,0.16), 0 4px 16px rgba(0,0,0,0.05)",
            }}
          >
            {/* Pink gradient header strip */}
            <div
              className="w-full flex flex-col items-center justify-center pt-10 pb-8 px-8 relative"
              style={{ background: "linear-gradient(160deg,#FF1F7D 0%,#c4005a 100%)" }}
            >
              {/* Decorative radial shine */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{ background: "radial-gradient(circle at 30% 20%, white 0%, transparent 55%)" }}
              />
              {/* Decorative SVG petal marks */}
              <div className="absolute top-4 left-5 opacity-20">
                <svg width="22" height="22" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12M2.5 2.5l9 9M11.5 2.5l-9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="absolute top-6 right-7 opacity-15">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12M2.5 2.5l9 9M11.5 2.5l-9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              <div className="relative flex flex-col items-center">
                <WaxSeal size="lg" />
                <p
                  className="text-white/90 text-lg italic mt-5 mb-1"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  You&apos;re invited
                </p>
                <h1
                  className="text-white font-black text-center leading-tight"
                  style={{ fontSize: "clamp(28px, 6vw, 36px)", letterSpacing: "0.06em" }}
                >
                  TO BLOOMBAY
                </h1>
              </div>
            </div>

            {/* Card body */}
            <div className="px-8 py-8 flex flex-col items-center gap-6">
              <div className="text-center">
                <p
                  className="text-sm font-black uppercase tracking-[0.18em] mb-4"
                  style={{ color: "#888" }}
                >
                  A NEW KIND OF SOCIAL LIFE FOR WOMEN
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  BloomBay is a living social world for women in cities to find clubs, gatherings, celebrations, and real friendships.
                </p>
              </div>

              {/* Feature pills — 2 col grid */}
              <div className="grid grid-cols-2 gap-2.5 w-full">
                {[
                  { icon: "🤝", text: "Clubs that feel alive" },
                  { icon: "✨", text: "Real gatherings" },
                  { icon: "🥂", text: "Celebrations you'll actually show up for" },
                  { icon: "🌸", text: "A softer way to meet your people" },
                ].map((f) => (
                  <div
                    key={f.text}
                    className="rounded-2xl p-3.5 flex flex-col items-center gap-2 text-center"
                    style={{ background: "#FFF0F5", border: "1px solid #FFE0EE" }}
                  >
                    <span className="text-2xl">{f.icon}</span>
                    <p className="text-xs font-medium text-gray-500 leading-snug">{f.text}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar with glow */}
              <div className="w-full">
                <ProgressBar current={WAITLIST_CURRENT} goal={WAITLIST_GOAL} />
              </div>
            </div>
          </div>

          {/* CTA button — very prominent */}
          <div className="w-full mt-8 flex flex-col items-center gap-3">
            <p className="text-xs text-gray-400 italic" style={{ fontFamily: "var(--font-playfair)" }}>
              Ready to open your invitation?
            </p>
            <button
              onClick={() => { setOpened(true); setStep(1); }}
              className="w-full py-5 rounded-full text-white font-black text-base flex items-center justify-center gap-3 transition-all hover:brightness-110 active:scale-95"
              style={{
                background: "linear-gradient(135deg,#FF1F7D,#c4005a)",
                boxShadow: "0 8px 40px rgba(255,31,125,0.5)",
                letterSpacing: "0.06em",
                fontSize: "15px",
              }}
            >
              OPEN THE INVITATION
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-5">
            Already have an invite?{" "}
            <Link href="/login" className="font-bold" style={{ color: "#FF1F7D" }}>Sign in</Link>
          </p>
        </div>
      )}

      {/* ─── STEP 1 — Why Women Join ─── */}
      {step === 1 && (
        <div className="w-full max-w-md mx-auto px-5 pt-12 pb-10 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#FF1F7D,#c4005a)",
                boxShadow: "0 4px 12px rgba(255,31,125,0.4)",
              }}
            >
              1
            </div>
            <div>
              <h2 className="text-2xl font-black" style={{ color: "#111111" }}>
                Why Women Join BloomBay
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">What are you looking for? Choose all that apply.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {GOALS.map((g, i) => {
              const on = goals.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleGoal(i)}
                  className="rounded-3xl p-5 flex flex-col gap-3 text-left transition-all relative overflow-hidden"
                  style={{
                    background: on ? "#FF1F7D" : "white",
                    border: `2px solid ${on ? "#FF1F7D" : "#F0F0F0"}`,
                    boxShadow: on
                      ? "0 8px 24px rgba(255,31,125,0.3)"
                      : "0 1px 6px rgba(0,0,0,0.04)",
                    transform: on ? "scale(1.01)" : "scale(1)",
                  }}
                >
                  {on && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-15"
                      style={{ background: "radial-gradient(circle at 30% 20%, white 0%, transparent 60%)" }}
                    />
                  )}
                  {on && (
                    <div
                      className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.3)" }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="white">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </div>
                  )}
                  <span className="text-2xl relative">{g.icon}</span>
                  <p
                    className="text-xs font-semibold leading-snug relative"
                    style={{ color: on ? "white" : "#111111" }}
                  >
                    {g.label}
                  </p>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={goals.size === 0}
            className="w-full py-4 rounded-full text-white font-black text-base flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95"
            style={{
              background: goals.size > 0
                ? "linear-gradient(135deg,#FF1F7D,#c4005a)"
                : "#FFB6D0",
              cursor: goals.size > 0 ? "pointer" : "default",
              boxShadow: goals.size > 0 ? "0 6px 24px rgba(255,31,125,0.4)" : "none",
            }}
          >
            CONTINUE →
          </button>

          <div className="mt-6 flex justify-center">
            <StepDots total={4} current={1} />
          </div>
        </div>
      )}

      {/* ─── STEP 2 — Tell Us About You ─── */}
      {step === 2 && (
        <div className="w-full max-w-md mx-auto px-5 pt-12 pb-10 flex flex-col">
          <div className="flex items-center gap-3 mb-7">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#FF1F7D,#c4005a)",
                boxShadow: "0 4px 12px rgba(255,31,125,0.4)",
              }}
            >
              2
            </div>
            <div>
              <h2 className="text-2xl font-black" style={{ color: "#111111" }}>
                Tell Us About You
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">Help us create a BloomBay made for you.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            {/* First Name */}
            <div>
              <label className="block text-xs font-black tracking-widest uppercase mb-1.5" style={{ color: "#bbb" }}>
                First Name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Elle"
                className="w-full rounded-2xl px-4 py-3.5 text-base outline-none border-2 transition-all"
                style={{
                  color: "#111111",
                  background: "white",
                  borderColor: "#F0F0F0",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF1F7D";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255,31,125,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#F0F0F0";
                  e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black tracking-widest uppercase mb-1.5" style={{ color: "#bbb" }}>
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elle@gmail.com"
                type="email"
                className="w-full rounded-2xl px-4 py-3.5 text-base outline-none border-2 transition-all"
                style={{
                  color: "#111111",
                  background: "white",
                  borderColor: "#F0F0F0",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF1F7D";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255,31,125,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#F0F0F0";
                  e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-black tracking-widest uppercase mb-1.5" style={{ color: "#bbb" }}>
                Phone <span className="font-normal normal-case tracking-normal" style={{ color: "#ccc" }}>(for SMS invite)</span>
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                type="tel"
                className="w-full rounded-2xl px-4 py-3.5 text-base outline-none border-2 transition-all"
                style={{
                  color: "#111111",
                  background: "white",
                  borderColor: "#F0F0F0",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF1F7D";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255,31,125,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#F0F0F0";
                  e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                }}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-black tracking-widest uppercase mb-1.5" style={{ color: "#bbb" }}>
                Where Are You?
              </label>
              {selectedCity ? (
                <div
                  className="w-full rounded-2xl px-4 py-3.5 flex items-center justify-between"
                  style={{
                    border: "2px solid #FF1F7D",
                    background: "white",
                    boxShadow: "0 0 0 3px rgba(255,31,125,0.1)",
                  }}
                >
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#111111" }}>{selectedCity.city}</p>
                    <p className="text-xs text-gray-400">{selectedCity.country}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedCity(null); setCityQuery(""); }}
                    className="text-xs font-black transition-opacity hover:opacity-70"
                    style={{ color: "#FF1F7D" }}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                    placeholder="Search city or country…"
                    className="w-full rounded-2xl px-4 py-3.5 text-base outline-none border-2 transition-all"
                    style={{
                      color: "#111111",
                      background: "white",
                      borderColor: "#F0F0F0",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FF1F7D";
                      e.target.style.boxShadow = "0 0 0 3px rgba(255,31,125,0.12)";
                    }}
                    onBlur={(e) => setTimeout(() => {
                      e.target.style.borderColor = "#F0F0F0";
                      e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                    }, 150)}
                  />
                  {cityQuery && (
                    <div
                      className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-20"
                      style={{
                        background: "white",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        border: "1px solid #FFE0EE",
                      }}
                    >
                      {filteredCities.slice(0, 6).map((c) => (
                        <button
                          key={c.city}
                          onMouseDown={() => setSelectedCity(c)}
                          className="w-full px-4 py-3.5 flex items-center justify-between text-left transition-colors"
                          style={{ borderBottom: "1px solid #FFF0F5" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#FFF8FB")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <div>
                            <p className="font-semibold text-sm" style={{ color: "#111111" }}>{c.city}</p>
                            <p className="text-xs text-gray-400">{c.country}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black" style={{ color: "#FF1F7D" }}>
                              {c.count.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400">waiting</p>
                          </div>
                        </button>
                      ))}
                      {filteredCities.length === 0 && (
                        <button
                          onMouseDown={() => setSelectedCity({ city: cityQuery, country: "Other", count: 12 })}
                          className="w-full px-4 py-3 text-left transition-colors hover:bg-pink-50"
                        >
                          <p className="font-semibold text-sm" style={{ color: "#111111" }}>"{cityQuery}"</p>
                          <p className="text-xs text-gray-400">Add your city</p>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Neighborhood */}
            <div>
              <label className="block text-xs font-black tracking-widest uppercase mb-1.5" style={{ color: "#bbb" }}>
                Neighborhood
              </label>
              <input
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Upper East Side"
                className="w-full rounded-2xl px-4 py-3.5 text-base outline-none border-2 transition-all"
                style={{
                  color: "#111111",
                  background: "white",
                  borderColor: "#F0F0F0",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF1F7D";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255,31,125,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#F0F0F0";
                  e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                }}
              />
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-xs font-black tracking-widest uppercase mb-2" style={{ color: "#bbb" }}>
                Age Range
              </label>
              <div className="flex gap-2 flex-wrap">
                {AGE_RANGES.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAgeRange(a)}
                    className="px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
                    style={
                      ageRange === a
                        ? {
                            background: "linear-gradient(135deg,#FF1F7D,#c4005a)",
                            color: "white",
                            boxShadow: "0 4px 12px rgba(255,31,125,0.3)",
                          }
                        : {
                            background: "white",
                            color: "#111111",
                            border: "1.5px solid #E8E8E8",
                          }
                    }
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-xs font-black tracking-widest uppercase mb-2" style={{ color: "#bbb" }}>
                Most excited about? <span className="font-normal normal-case tracking-normal" style={{ color: "#ccc" }}>(up to 3)</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {INTERESTS.map((item, i) => {
                  const on = interests.has(i);
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (!on && interests.size >= 3) return;
                        toggleInterest(i);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
                      style={
                        on
                          ? {
                              background: "linear-gradient(135deg,#FF1F7D,#c4005a)",
                              color: "white",
                              boxShadow: "0 4px 12px rgba(255,31,125,0.3)",
                            }
                          : {
                              background: "white",
                              color: "#111111",
                              border: "1.5px solid #E8E8E8",
                              opacity: !on && interests.size >= 3 ? 0.4 : 1,
                            }
                      }
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Founding Mother */}
            <button
              onClick={() => setFoundingMother(!foundingMother)}
              className="flex items-center gap-3 p-4 rounded-2xl transition-all text-left"
              style={{
                background: foundingMother ? "#FFF0F5" : "white",
                border: `2px solid ${foundingMother ? "#FF1F7D" : "#E8E8E8"}`,
                boxShadow: foundingMother ? "0 4px 16px rgba(255,31,125,0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: foundingMother ? "#FF1F7D" : "transparent",
                  border: `2px solid ${foundingMother ? "#FF1F7D" : "#CCC"}`,
                }}
              >
                {foundingMother && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="white">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#111111" }}>
                  I want to be considered for{" "}
                  <span style={{ color: "#FF1F7D" }}>Founding Mothers</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">The first 100 women who help shape BloomBay</p>
              </div>
            </button>
          </div>

          <button
            onClick={() => void submit()}
            disabled={!firstName || !email || !selectedCity || submitting}
            className="w-full py-4 rounded-full text-white font-black text-base transition-all hover:brightness-110 active:scale-95"
            style={{
              background: firstName && email && selectedCity && !submitting
                ? "linear-gradient(135deg,#FF1F7D,#c4005a)"
                : "#FFB6D0",
              cursor: firstName && email && selectedCity && !submitting ? "pointer" : "default",
              boxShadow: firstName && email && selectedCity && !submitting
                ? "0 8px 32px rgba(255,31,125,0.4)"
                : "none",
            }}
          >
            {submitting ? "Saving…" : "SAVE MY SPOT"}
          </button>

          <div className="mt-6 flex justify-center">
            <StepDots total={4} current={2} />
          </div>
        </div>
      )}

      {/* ─── STEP 3 — You're In! (celebration) ─── */}
      {step === 3 && (
        <div className="w-full max-w-md mx-auto px-5 pt-10 pb-10 flex flex-col items-center relative overflow-hidden">

          {/* CSS-only confetti dots scattered across the header area */}
          {[
            { top: "2%", left: "8%", bg: "#FF1F7D", size: 8, rotate: "15deg" },
            { top: "5%", left: "20%", bg: "#FF69B4", size: 6, rotate: "40deg" },
            { top: "1%", left: "40%", bg: "#111111", size: 5, rotate: "60deg" },
            { top: "4%", left: "55%", bg: "#FF1F7D", size: 7, rotate: "25deg" },
            { top: "7%", left: "70%", bg: "#FF69B4", size: 5, rotate: "80deg" },
            { top: "2%", left: "85%", bg: "#FF1F7D", size: 9, rotate: "10deg" },
            { top: "9%", left: "12%", bg: "#FF69B4", size: 5, rotate: "50deg" },
            { top: "11%", left: "30%", bg: "#111111", size: 4, rotate: "70deg" },
            { top: "6%", left: "62%", bg: "#FF1F7D", size: 6, rotate: "30deg" },
            { top: "10%", left: "78%", bg: "#FF69B4", size: 7, rotate: "55deg" },
            { top: "13%", left: "90%", bg: "#FF1F7D", size: 4, rotate: "20deg" },
            { top: "14%", left: "5%", bg: "#FF69B4", size: 6, rotate: "45deg" },
          ].map((dot, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                top: dot.top,
                left: dot.left,
                width: dot.size,
                height: dot.size * 2.4,
                background: dot.bg,
                borderRadius: "2px",
                transform: `rotate(${dot.rotate})`,
                opacity: 0.75,
              }}
            />
          ))}

          {/* Big celebration header */}
          <div
            className="w-full rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden mb-6"
            style={{
              background: "linear-gradient(160deg,#FF1F7D 0%,#c4005a 100%)",
              boxShadow: "0 16px 60px rgba(255,31,125,0.4)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{ background: "radial-gradient(circle at 30% 20%, white 0%, transparent 55%)" }}
            />
            <div className="relative flex flex-col items-center">
              {/* Big check circle */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "3px solid rgba(255,255,255,0.5)",
                }}
              >
                <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
                  <path d="M2 14l10 10L34 2" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h2
                className="text-white font-black leading-tight mb-2"
                style={{
                  fontSize: "clamp(38px, 10vw, 52px)",
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                }}
              >
                YOU&apos;RE IN!
              </h2>
              <p className="text-white/85 text-base font-medium mb-1">
                Welcome to BloomBay.
              </p>
              <p className="text-white/65 text-sm leading-relaxed">
                You&apos;ll be the first to know when we open in{" "}
                <strong className="text-white">
                  {selectedCity?.city ?? "New York City"}
                </strong>
                .
              </p>
            </div>
          </div>

          {/* City waitlist count card */}
          <div
            className="w-full rounded-3xl p-6 mb-5"
            style={{
              background: "white",
              boxShadow: "0 4px 24px rgba(255,31,125,0.1)",
              border: "1px solid #FFE0EE",
            }}
          >
            <p className="text-xs font-black tracking-widest uppercase text-gray-400 mb-3">
              WAITLIST — {selectedCity?.city?.toUpperCase() ?? "NEW YORK CITY"}
            </p>
            <ProgressBar
              current={cityCount + 1}
              goal={WAITLIST_GOAL}
            />
            <p className="text-xs font-semibold text-center mt-2.5" style={{ color: "#FF1F7D" }}>
              You are #{(cityCount + 1).toLocaleString()} in your city
            </p>
          </div>

          {/* What you get */}
          <div className="w-full flex flex-col gap-3 mb-8">
            <p className="text-xs font-black tracking-widest uppercase text-gray-400 mb-1">WHEN WE OPEN, YOU GET</p>
            {[
              {
                icon: "👑",
                title: "Founding Mother consideration",
                sub: foundingMother ? "You checked the box — we see you." : "Apply to help shape BloomBay from the start.",
              },
              {
                icon: "⚡",
                title: "Early access to cities",
                sub: "Be first in line when BloomBay opens near you.",
              },
              {
                icon: "🌸",
                title: "Invitations to special gatherings",
                sub: "Waitlist women get first access to founding events.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 rounded-2xl"
                style={{
                  background: "white",
                  boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
                  border: "1px solid #FFF0F5",
                }}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#111111" }}>{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sign-off */}
          <p
            className="text-2xl font-bold italic text-center mb-1"
            style={{ fontFamily: "var(--font-playfair)", color: "#FF1F7D" }}
          >
            See you soon
          </p>
          <p className="text-3xl mb-7" style={{ color: "#FF1F7D" }}>♥</p>

          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "#111111",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            <BBLogo size={28} light />
          </div>

          <p className="text-xs text-gray-400 mt-5 text-center">
            Invite a friend →{" "}
            <button
              className="font-black underline transition-opacity hover:opacity-70"
              style={{ color: "#FF1F7D" }}
              onClick={() => navigator.clipboard?.writeText("https://bloombay.app/waitlist")}
            >
              Copy link
            </button>
          </p>

          <div className="mt-7 flex justify-center">
            <StepDots total={4} current={3} />
          </div>
        </div>
      )}
    </div>
  );
}
