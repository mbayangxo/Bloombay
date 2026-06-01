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

function WaxSeal() {
  return (
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
      style={{ background: "linear-gradient(135deg,#FF1F7D,#FF69B4)" }}
    >
      <div
        className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center"
      >
        <span className="text-white font-bold text-xl" style={{ fontFamily: "serif" }}>BB</span>
      </div>
    </div>
  );
}

function ProgressBar({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min(100, (current / goal) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1.5" style={{ color: "#888" }}>
        <span>{current.toLocaleString()} women in</span>
        <span>Goal: {goal.toLocaleString()}</span>
      </div>
      <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "#FFE0EE" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg,#FF1F7D,#FF69B4)" }}
        />
      </div>
    </div>
  );
}

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: i === current ? "24px" : "6px",
            height: "6px",
            background: i <= current ? "#FF1F7D" : "#FFE0EE",
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

  function submit() {
    setSubmitted(true);
    setStep(3);
  }

  const cityCount = selectedCity?.count ?? WAITLIST_CURRENT;

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: "#FFF5F8" }}>
      {/* Step 0 — Invitation envelope */}
      {step === 0 && (
        <div className="w-full max-w-md mx-auto px-5 pt-12 pb-10 flex flex-col items-center">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <BBLogo size={44} />
            <p className="text-xs font-bold tracking-widest uppercase mt-2" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
            <p className="text-xs italic text-gray-400 mt-0.5" style={{ fontFamily: "serif" }}>Where you bloom.</p>
          </div>

          {/* Envelope card */}
          <div
            className="w-full rounded-3xl p-8 flex flex-col items-center gap-6 relative overflow-hidden"
            style={{ background: "white", boxShadow: "0 8px 40px rgba(255,31,125,0.12)" }}
          >
            {/* Decorative petals */}
            <div className="absolute top-4 left-4 text-2xl opacity-20">🌸</div>
            <div className="absolute top-6 right-6 text-xl opacity-20">🌸</div>
            <div className="absolute bottom-8 left-8 text-lg opacity-15">🌸</div>
            <div className="absolute bottom-4 right-4 text-2xl opacity-15">🌸</div>

            <WaxSeal />

            <div className="text-center">
              <p
                className="text-2xl font-bold italic mb-1"
                style={{ fontFamily: "serif", color: "#FF1F7D" }}
              >
                You&apos;re invited
              </p>
              <h1
                className="text-4xl font-black mb-3 leading-tight"
                style={{ color: "#111111" }}
              >
                TO BLOOMBAY
              </h1>
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-4"
                style={{ color: "#888" }}
              >
                A NEW KIND OF SOCIAL LIFE<br />FOR WOMEN
              </p>
              <div className="w-8 mx-auto mb-4" style={{ height: "1px", background: "#FFE0EE" }} />
              <p className="text-sm text-gray-500 leading-relaxed mb-2">
                BloomBay is a living social world for women in cities to find clubs, gatherings, celebrations, and real friendships.
              </p>
            </div>

            {/* Feature pills */}
            <div className="grid grid-cols-2 gap-2 w-full">
              {[
                { icon: "🤝", text: "Clubs that feel alive" },
                { icon: "✨", text: "Real gatherings" },
                { icon: "🥂", text: "Celebrations you'll actually show up for" },
                { icon: "🌸", text: "A softer way to meet your people" },
              ].map((f) => (
                <div
                  key={f.text}
                  className="rounded-2xl p-3 flex flex-col items-center gap-1.5 text-center"
                  style={{ background: "#FFF0F5" }}
                >
                  <span className="text-xl">{f.icon}</span>
                  <p className="text-xs font-medium text-gray-500 leading-snug">{f.text}</p>
                </div>
              ))}
            </div>

            <div className="w-full">
              <ProgressBar current={WAITLIST_CURRENT} goal={WAITLIST_GOAL} />
            </div>
          </div>

          {/* CTA */}
          <div className="w-full mt-6 flex flex-col items-center gap-3">
            <p className="text-xs text-gray-400 italic" style={{ fontFamily: "serif" }}>
              Ready to open?
            </p>
            <button
              onClick={() => { setOpened(true); setStep(1); }}
              className="w-full py-4 rounded-full text-white font-bold text-base flex items-center justify-center gap-2"
              style={{ background: "#FF1F7D", boxShadow: "0 4px 20px rgba(255,31,125,0.35)" }}
            >
              OPEN THE INVITATION
              <WaxSeal />
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Already have an invite?{" "}
            <Link href="/login" className="font-bold" style={{ color: "#FF1F7D" }}>Sign in</Link>
          </p>
        </div>
      )}

      {/* Step 1 — Why Women Join */}
      {step === 1 && (
        <div className="w-full max-w-md mx-auto px-5 pt-12 pb-10 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: "#FF1F7D" }}
            >
              2
            </div>
            <div>
              <h2 className="text-2xl font-black" style={{ color: "#111111" }}>
                Why Women Join BloomBay
              </h2>
              <p className="text-sm text-gray-400">What are you looking for? (choose all that apply)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {GOALS.map((g, i) => {
              const on = goals.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleGoal(i)}
                  className="rounded-3xl p-4 flex flex-col gap-2 text-left transition-all relative overflow-hidden"
                  style={{
                    background: on ? "#FFF0F5" : "white",
                    border: `2px solid ${on ? "#FF1F7D" : "#F0F0F0"}`,
                    boxShadow: on ? "0 2px 12px rgba(255,31,125,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  {on && (
                    <div
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "#FF1F7D" }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="white">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </div>
                  )}
                  <span className="text-2xl">{g.icon}</span>
                  <p className="text-xs font-semibold leading-snug" style={{ color: "#111111" }}>{g.label}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={goals.size === 0}
            className="w-full py-4 rounded-full text-white font-bold text-base flex items-center justify-center gap-2"
            style={{
              background: goals.size > 0 ? "#FF1F7D" : "#FFB6D0",
              cursor: goals.size > 0 ? "pointer" : "default",
            }}
          >
            CONTINUE →
          </button>

          <div className="mt-6 flex justify-center">
            <StepDots total={4} current={1} />
          </div>
        </div>
      )}

      {/* Step 2 — Tell Us About You */}
      {step === 2 && (
        <div className="w-full max-w-md mx-auto px-5 pt-12 pb-10 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: "#FF1F7D" }}
            >
              3
            </div>
            <div>
              <h2 className="text-2xl font-black" style={{ color: "#111111" }}>
                Tell Us About You
              </h2>
              <p className="text-sm text-gray-400">Help us create a BloomBay made for you.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5">
                First Name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Elle"
                className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent"
                style={{ color: "#111111" }}
                onFocus={(e) => (e.target.style.borderColor = "#FF1F7D")}
                onBlur={(e) => (e.target.style.borderColor = "transparent")}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elle@gmail.com"
                type="email"
                className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent"
                style={{ color: "#111111" }}
                onFocus={(e) => (e.target.style.borderColor = "#FF1F7D")}
                onBlur={(e) => (e.target.style.borderColor = "transparent")}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5">
                Phone (for SMS invite)
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                type="tel"
                className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent"
                style={{ color: "#111111" }}
                onFocus={(e) => (e.target.style.borderColor = "#FF1F7D")}
                onBlur={(e) => (e.target.style.borderColor = "transparent")}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5">
                Where Are You?
              </label>
              {selectedCity ? (
                <div
                  className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between"
                  style={{ border: "2px solid #FF1F7D" }}
                >
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#111111" }}>{selectedCity.city}</p>
                    <p className="text-xs text-gray-400">{selectedCity.country}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedCity(null); setCityQuery(""); }}
                    className="text-xs font-bold"
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
                    className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent"
                    style={{ color: "#111111" }}
                    onFocus={(e) => (e.target.style.borderColor = "#FF1F7D")}
                    onBlur={(e) => setTimeout(() => (e.target.style.borderColor = "transparent"), 150)}
                  />
                  {cityQuery && (
                    <div
                      className="absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-hidden z-20"
                      style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                    >
                      {filteredCities.slice(0, 6).map((c) => (
                        <button
                          key={c.city}
                          onMouseDown={() => setSelectedCity(c)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-pink-50 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-sm" style={{ color: "#111111" }}>{c.city}</p>
                            <p className="text-xs text-gray-400">{c.country}</p>
                          </div>
                          <p className="text-xs font-bold" style={{ color: "#FF1F7D" }}>
                            {c.count.toLocaleString()} waiting
                          </p>
                        </button>
                      ))}
                      {filteredCities.length === 0 && (
                        <button
                          onMouseDown={() => setSelectedCity({ city: cityQuery, country: "Other", count: 12 })}
                          className="w-full px-4 py-3 text-left hover:bg-pink-50"
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
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5">
                Neighborhood
              </label>
              <input
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Upper East Side"
                className="w-full bg-white rounded-2xl px-4 py-3.5 text-base outline-none border-2 border-transparent"
                style={{ color: "#111111" }}
                onFocus={(e) => (e.target.style.borderColor = "#FF1F7D")}
                onBlur={(e) => (e.target.style.borderColor = "transparent")}
              />
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5">
                Age Range
              </label>
              <div className="flex gap-2 flex-wrap">
                {AGE_RANGES.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAgeRange(a)}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                    style={
                      ageRange === a
                        ? { background: "#FF1F7D", color: "white" }
                        : { background: "white", color: "#111111", border: "1.5px solid #E8E8E8" }
                    }
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5">
                What are you most excited about? (choose up to 3)
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
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all"
                      style={
                        on
                          ? { background: "#FF1F7D", color: "white" }
                          : { background: "white", color: "#111111", border: "1.5px solid #E8E8E8", opacity: !on && interests.size >= 3 ? 0.4 : 1 }
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
                border: `1.5px solid ${foundingMother ? "#FF1F7D" : "#E8E8E8"}`,
              }}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: foundingMother ? "#FF1F7D" : "transparent", border: `2px solid ${foundingMother ? "#FF1F7D" : "#CCC"}` }}
              >
                {foundingMother && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="white">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#111111" }}>
                  I want to be considered for <span style={{ color: "#FF1F7D" }}>Founding Mothers</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">The first 100 women who help shape BloomBay</p>
              </div>
            </button>
          </div>

          <button
            onClick={submit}
            disabled={!firstName || !email || !selectedCity}
            className="w-full py-4 rounded-full text-white font-bold text-base"
            style={{
              background: firstName && email && selectedCity ? "#FF1F7D" : "#FFB6D0",
              cursor: firstName && email && selectedCity ? "pointer" : "default",
              boxShadow: firstName && email && selectedCity ? "0 4px 20px rgba(255,31,125,0.35)" : "none",
            }}
          >
            JOIN THE WAITLIST
          </button>

          <div className="mt-6 flex justify-center">
            <StepDots total={4} current={2} />
          </div>
        </div>
      )}

      {/* Step 3 — You're In! */}
      {step === 3 && (
        <div className="w-full max-w-md mx-auto px-5 pt-12 pb-10 flex flex-col items-center">
          <div className="flex flex-col items-center text-center mb-8">
            <WaxSeal />
            <h2
              className="text-5xl font-black mt-6 mb-2"
              style={{ color: "#FF1F7D", fontFamily: "serif", fontStyle: "italic" }}
            >
              YOU&apos;RE IN!
            </h2>
            <p className="text-base text-gray-500 leading-relaxed mb-1">
              Welcome to BloomBay.
            </p>
            <p className="text-sm text-gray-400">
              You&apos;ll be the first to know when we open in{" "}
              <strong style={{ color: "#111111" }}>
                {selectedCity?.city ?? "New York City"}
              </strong>
              .
            </p>
          </div>

          {/* City count */}
          <div
            className="w-full rounded-3xl p-5 mb-6"
            style={{ background: "white", boxShadow: "0 4px 20px rgba(255,31,125,0.08)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
              WAITLIST — {selectedCity?.city?.toUpperCase() ?? "NEW YORK CITY"}
            </p>
            <ProgressBar
              current={cityCount + 1}
              goal={WAITLIST_GOAL}
            />
            <p className="text-xs text-gray-400 mt-2 text-center">
              You are #{(cityCount + 1).toLocaleString()} in your city
            </p>
          </div>

          {/* What you get */}
          <div className="w-full flex flex-col gap-3 mb-8">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400">WHEN WE OPEN, YOU GET</p>
            {[
              { icon: "👑", title: "Founding Mother consideration", sub: foundingMother ? "You checked the box — we see you." : "Apply to help shape BloomBay from the start." },
              { icon: "⚡", title: "Early access to cities", sub: "Be first in line when BloomBay opens near you." },
              { icon: "🌸", title: "Invitations to special gatherings", sub: "Waitlist women get first access to founding events." },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#111111" }}>{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <p
            className="text-2xl font-bold italic text-center mb-1"
            style={{ fontFamily: "serif", color: "#FF1F7D" }}
          >
            See you soon
          </p>
          <p className="text-2xl mb-6" style={{ color: "#FF1F7D" }}>♥</p>

          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "#111111" }}
          >
            <BBLogo size={24} light />
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center">
            Invite a friend →{" "}
            <button
              className="font-bold underline"
              style={{ color: "#FF1F7D" }}
              onClick={() => navigator.clipboard?.writeText("https://bloombay.app/waitlist")}
            >
              Copy link
            </button>
          </p>

          <div className="mt-6 flex justify-center">
            <StepDots total={4} current={3} />
          </div>
        </div>
      )}
    </div>
  );
}
