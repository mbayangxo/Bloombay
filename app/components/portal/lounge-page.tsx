"use client";

import { useState } from "react";
import { logout } from "@/lib/auth/actions";

const TABS = ["Home", "Memories", "My Circle", "My Link", "Profile"];

const STAMPS = [
  { emoji: "☕", name: "Matcha Morning", earned: true },
  { emoji: "🏃‍♀️", name: "Run Club", earned: true },
  { emoji: "🎨", name: "Paint + Sip", earned: false },
  { emoji: "🌸", name: "Girl Dinner", earned: false },
];

const MEMORIES = [
  { emoji: "🌅", title: "Williamsburg morning", date: "May 12", bg: "#FFF0F5" },
  { emoji: "🍷", title: "Rooftop wine hour", date: "May 8", bg: "#FFE0EE" },
  { emoji: "🎨", title: "Paint + sip night", date: "Apr 30", bg: "#FFF5F8" },
  { emoji: "🏃‍♀️", title: "Run club Sunday", date: "Apr 27", bg: "#FFE0EE" },
  { emoji: "🧘", title: "Pilates morning", date: "Apr 20", bg: "#FFF0F5" },
  { emoji: "☕", title: "Matcha café crawl", date: "Apr 14", bg: "#FFF5F8" },
];

const YANDE_MEMORIES = [
  {
    quote: '"You showed up for Aaliyah\'s birthday even when you were tired. That\'s love."',
    date: "May 2025",
  },
  {
    quote: '"You\'ve been to 4 events this month. Your city is noticing you."',
    date: "May 2025",
  },
];

const CIRCLE = [
  { name: "Aaliyah M.", color: "#FF1F7D", mutual: true },
  { name: "Sofia K.", color: "#FF69B4", mutual: true },
  { name: "Priya R.", color: "#FFB6D0", mutual: false },
];

export function LoungePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [matchOn, setMatchOn] = useState(true);
  const [moodSelected, setMoodSelected] = useState<string | null>("Soft");
  const [waved, setWaved] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const MOODS = ["Soft", "Lit", "Cozy", "Focused", "Low-key"];

  function wave(name: string) {
    setWaved((prev) => new Set([...prev, name]));
  }

  function copyLink() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="min-h-screen pb-36" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-4xl font-bold" style={{ color: "var(--bb-black)" }}>
          Lounge
        </h1>
        <p
          className="italic text-gray-400 mt-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Your private world
        </p>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-6 overflow-x-auto">
        <div className="flex gap-2 w-max pb-1">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
              style={
                activeTab === i
                  ? { background: "var(--bb-black)", color: "white" }
                  : { background: "white", color: "var(--bb-black)", border: "1.5px solid #E0E0E0" }
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">
        {/* Home tab */}
        {activeTab === 0 && (
          <div className="flex flex-col gap-5">
            {/* Wallet card */}
            <div
              className="rounded-3xl p-5 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #FF1F7D 0%, #c40060 60%, #1A0514 100%)" }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: "white", transform: "translate(20%, -30%)" }} />
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                MY WALLET
              </p>
              <div className="flex gap-6 mb-5">
                <div>
                  <p className="text-white text-2xl font-bold">420</p>
                  <p className="text-white/60 text-xs tracking-wider">Points</p>
                </div>
                <div className="w-px bg-white/20" />
                <div>
                  <p className="text-white text-2xl font-bold">3</p>
                  <p className="text-white/60 text-xs tracking-wider">Tokens</p>
                </div>
                <div className="w-px bg-white/20" />
                <div>
                  <p className="text-white text-2xl font-bold">7</p>
                  <p className="text-white/60 text-xs tracking-wider">Stamps</p>
                </div>
              </div>
              <div
                className="rounded-2xl px-4 py-2.5 inline-flex items-center gap-2"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <span className="text-white text-xs font-bold tracking-widest">MY CODE</span>
                <span className="text-white font-bold">GF-NYC-7842</span>
              </div>
            </div>

            {/* Match toggle */}
            <div className="bg-white rounded-3xl p-4 flex items-center justify-between" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>
                  Girl Match
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {matchOn ? "Yande is finding your people" : "Turn on to start matching"}
                </p>
              </div>
              <button
                onClick={() => setMatchOn(!matchOn)}
                className="relative w-12 h-6 rounded-full transition-all"
                style={{ background: matchOn ? "var(--bb-pink)" : "#E0E0E0" }}
              >
                <div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
                  style={{ left: matchOn ? "26px" : "4px" }}
                />
              </button>
            </div>

            {/* Mood */}
            <div>
              <p
                className="text-base font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
              >
                Today&apos;s Mood
              </p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setMoodSelected(mood)}
                    className="px-3 py-2 rounded-full text-sm font-semibold transition-all"
                    style={
                      moodSelected === mood
                        ? { background: "var(--bb-pink)", color: "white" }
                        : { background: "white", color: "var(--bb-black)", border: "1.5px solid #E0E0E0" }
                    }
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick actions grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: "📓", label: "Journal", sub: "Private entries" },
                { emoji: "👭", label: "My Circle", sub: "3 connections" },
                { emoji: "🛡️", label: "Bloom Safe", sub: "Share location" },
                { emoji: "💌", label: "Girl Mail", sub: "2 unread" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-2xl p-4"
                  style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
                >
                  <span className="text-2xl block mb-2">{item.emoji}</span>
                  <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Stamps */}
            <div>
              <p
                className="text-base font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
              >
                My Stamps
              </p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {STAMPS.map((stamp) => (
                  <div
                    key={stamp.name}
                    className="flex-shrink-0 flex flex-col items-center gap-1.5"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                      style={{
                        background: stamp.earned ? "var(--light-pink)" : "#F5F5F5",
                        opacity: stamp.earned ? 1 : 0.4,
                      }}
                    >
                      {stamp.emoji}
                    </div>
                    <p className="text-xs text-gray-500 text-center w-14 leading-tight">{stamp.name}</p>
                  </div>
                ))}
                <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl border-2 border-dashed"
                    style={{ borderColor: "#E0E0E0" }}
                  >
                    +
                  </div>
                  <p className="text-xs text-gray-400 text-center w-14">More</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Memories tab */}
        {activeTab === 1 && (
          <div className="flex flex-col gap-5">
            {/* YANDE REMEMBERS */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--bb-pink)" }}>
                YANDE REMEMBERS
              </p>
              <div className="flex flex-col gap-3">
                {YANDE_MEMORIES.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-4"
                    style={{ background: "#1A0514" }}
                  >
                    <p
                      className="text-white/90 text-sm italic leading-relaxed"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {m.quote}
                    </p>
                    <p className="text-white/40 text-xs mt-2">{m.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory grid */}
            <div>
              <p
                className="text-base font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
              >
                My Moments
              </p>
              <div className="grid grid-cols-2 gap-3">
                {MEMORIES.map((mem, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: mem.bg }}
                  >
                    <div className="h-20 flex items-center justify-center text-4xl">
                      {mem.emoji}
                    </div>
                    <div className="p-2.5">
                      <p className="font-semibold text-sm leading-snug" style={{ color: "var(--bb-black)" }}>
                        {mem.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{mem.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Circle tab */}
        {activeTab === 2 && (
          <div className="flex flex-col gap-4">
            <div
              className="rounded-3xl p-4 mb-1"
              style={{ background: "var(--light-pink)" }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase mb-1"
                style={{ color: "var(--bb-pink)" }}
              >
                YOUR INNER CIRCLE
              </p>
              <p
                className="italic text-sm"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
              >
                The women you&apos;ve actually clicked with. Not followers — real ones.
              </p>
            </div>
            {CIRCLE.map((c) => (
              <div
                key={c.name}
                className="bg-white rounded-2xl p-4 flex items-center gap-3"
                style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="w-12 h-12 rounded-full border-2"
                  style={{ background: `${c.color}22`, borderColor: c.color }}
                />
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>
                    {c.name}
                  </p>
                  <p className="text-xs text-gray-400">{c.mutual ? "Mutual connection" : "Pending"}</p>
                </div>
                {c.mutual ? (
                  <button
                    onClick={() => wave(c.name)}
                    className="px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-90"
                    style={
                      waved.has(c.name)
                        ? { background: "var(--bb-pink)", color: "white" }
                        : { background: "var(--light-pink)", color: "var(--bb-pink)" }
                    }
                  >
                    {waved.has(c.name) ? "Waved ✓" : "Wave"}
                  </button>
                ) : (
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: "#F5F5F5", color: "#bbb" }}>Pending</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* My Link tab */}
        {activeTab === 3 && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <p
                className="text-base font-bold italic mb-1"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
              >
                My BloomBay Link
              </p>
              <p className="text-xs text-gray-400 mb-4">Share your profile. Invite women you trust.</p>
              <div
                className="rounded-2xl px-4 py-3 flex items-center justify-between mb-4"
                style={{ background: "var(--pale-pink-bg)" }}
              >
                <p className="text-sm font-bold" style={{ color: "var(--bb-black)" }}>
                  bloombay.app/maya
                </p>
                <button
                  onClick={copyLink}
                  className="text-xs font-bold px-3 py-1.5 rounded-full transition-all active:scale-90"
                  style={
                    copied
                      ? { background: "#1A0514", color: "white" }
                      : { background: "var(--bb-pink)", color: "white" }
                  }
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 rounded-full text-sm font-bold border-2 transition-all hover:bg-pink-50"
                  style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}
                >
                  Share to Instagram
                </button>
                <button
                  className="flex-1 py-3 rounded-full text-sm font-bold text-white transition-all"
                  style={{ background: "var(--bb-black)" }}
                >
                  Invite Girls
                </button>
              </div>
            </div>
            <div
              className="rounded-3xl p-4"
              style={{ background: "#1A0514" }}
            >
              <p className="text-xs font-bold tracking-widest uppercase text-pink-400 mb-2">
                REFERRAL CODE
              </p>
              <p className="text-white text-2xl font-bold mb-1">GF-NYC-7842</p>
              <p className="text-white/50 text-xs">
                Invite 3 girls → earn Girl Token · unlock early drops
              </p>
            </div>
          </div>
        )}

        {/* Profile tab */}
        {activeTab === 4 && (
          <div className="flex flex-col gap-5">
            {/* Profile card */}
            <div className="bg-white rounded-3xl p-5 flex flex-col items-center text-center" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <div
                className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl mb-3"
                style={{ borderColor: "var(--bb-pink)", background: "var(--light-pink)" }}
              >
                🌸
              </div>
              <h2
                className="text-2xl font-bold italic"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
              >
                Maya L.
              </h2>
              <p className="text-gray-400 text-sm mt-0.5">Brooklyn · NYC</p>
              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <p className="font-bold text-lg" style={{ color: "var(--bb-black)" }}>12</p>
                  <p className="text-xs text-gray-400">Events</p>
                </div>
                <div className="w-px bg-gray-200" />
                <div className="text-center">
                  <p className="font-bold text-lg" style={{ color: "var(--bb-black)" }}>3</p>
                  <p className="text-xs text-gray-400">Clubs</p>
                </div>
                <div className="w-px bg-gray-200" />
                <div className="text-center">
                  <p className="font-bold text-lg" style={{ color: "var(--bb-black)" }}>420</p>
                  <p className="text-xs text-gray-400">Points</p>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <p className="font-bold text-sm mb-2" style={{ color: "var(--bb-black)" }}>
                About Maya
              </p>
              <p
                className="italic text-sm text-gray-500 leading-relaxed"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                &quot;Lover of matcha mornings, rooftop sunsets, and finding my people in the city.&quot;
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Soft Life", "Art", "Wellness", "Food", "Music"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Settings links */}
            <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              {[
                { label: "Edit profile" },
                { label: "Notifications" },
                { label: "Privacy & Safety" },
                { label: "BloomBay Premium" },
              ].map((item, i, arr) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-pink-50 transition-colors"
                  style={{ borderBottom: "1px solid #F5F5F5" }}
                >
                  <p className="flex-1 text-sm font-semibold" style={{ color: "var(--bb-black)" }}>{item.label}</p>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#ccc" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-red-50 transition-colors"
                >
                  <p className="flex-1 text-sm font-semibold" style={{ color: "#c40060" }}>Sign out</p>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c40060" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
