"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/lib/auth/actions";

const TABS = ["Bouquet", "Memories", "My Link", "Profile"];

const BOUQUET_MEMBERS = [
  { name: "Aaliyah M.", neighborhood: "Crown Heights", color: "#FF1F7D", initial: "A", since: "Jan 2026" },
  { name: "Sofia K.", neighborhood: "Williamsburg", color: "#FF69B4", initial: "S", since: "Feb 2026" },
  { name: "Kelechi O.", neighborhood: "Flatbush", color: "#FF69B4", initial: "K", since: "Mar 2026" },
];

const YANDE_MEMORIES = [
  {
    quote: '"You showed up for Aaliyah\'s birthday even when you were tired. That\'s love."',
    date: "May 2026",
  },
  {
    quote: '"You\'ve been to 4 events this month. Your city is noticing you."',
    date: "May 2026",
  },
];

const MEMORIES = [
  { emoji: "🌅", title: "Williamsburg morning", date: "May 12", bg: "#FFF0F5" },
  { emoji: "🍷", title: "Rooftop wine hour", date: "May 8", bg: "#FFE0EE" },
  { emoji: "🎨", title: "Paint + sip night", date: "Apr 30", bg: "#FFF5F8" },
  { emoji: "🏃‍♀️", title: "Run club Sunday", date: "Apr 27", bg: "#FFE0EE" },
  { emoji: "🧘", title: "Pilates morning", date: "Apr 20", bg: "#FFF0F5" },
  { emoji: "☕", title: "Matcha café crawl", date: "Apr 14", bg: "#FFF5F8" },
];

const BOUQUET_MAX = 12;

export function LoungePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [waved, setWaved] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function wave(name: string) {
    setWaved((prev) => new Set([...prev, name]));
  }

  function copyLink() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const emptySlots = BOUQUET_MAX - BOUQUET_MEMBERS.length;

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
      <div className="px-5 mb-6 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
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

        {/* ── Bouquet Tab ── */}
        {activeTab === 0 && (
          <div className="flex flex-col gap-5">
            {/* Banner */}
            <div
              className="rounded-3xl p-5 relative overflow-hidden"
              style={{ background: "#111111" }}
            >
              <div
                className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-10"
                style={{ background: "var(--bb-pink)", transform: "translate(30%, -30%)" }}
              />
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--mid-pink)" }}>
                YOUR BOUQUET
              </p>
              <p
                className="text-white text-2xl font-bold italic mb-1"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}
              >
                {BOUQUET_MEMBERS.length} of {BOUQUET_MAX} Bloomies
              </p>
              <p className="text-white/50 text-sm">
                Your intimate inner circle. Max 12. Invite-only.
              </p>
            </div>

            {/* Flower grid — 12 slots */}
            <div>
              <p
                className="text-sm font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
              >
                Your Circle
              </p>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {BOUQUET_MEMBERS.map((m) => (
                  <div key={m.name} className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white border-2"
                      style={{ background: m.color, borderColor: `${m.color}44` }}
                    >
                      {m.initial}
                    </div>
                    <p className="text-[10px] text-center text-gray-500 leading-tight w-14 truncate">{m.name.split(" ")[0]}</p>
                  </div>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-dashed"
                      style={{ borderColor: "#E0D0D8" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C0A8B0" strokeWidth="1.5">
                        <path d="M12 2l1.7 5.3H19l-4.4 3.2 1.7 5.3L12 13l-4.3 2.8 1.7-5.3L5 7.3h5.3z"/>
                      </svg>
                    </div>
                    <p className="text-[10px] text-center text-gray-300 leading-tight">open</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloomies list */}
            <div>
              <p
                className="text-sm font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
              >
                Your Bloomies
              </p>
              <div className="flex flex-col gap-2">
                {BOUQUET_MEMBERS.map((m) => (
                  <div
                    key={m.name}
                    className="bg-white rounded-2xl p-4 flex items-center gap-3"
                    style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                      style={{ background: m.color }}
                    >
                      {m.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{m.name}</p>
                      <p className="text-xs text-gray-400">{m.neighborhood} · since {m.since}</p>
                    </div>
                    <button
                      onClick={() => wave(m.name)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-90"
                      style={
                        waved.has(m.name)
                          ? { background: m.color, color: "white" }
                          : { background: "var(--light-pink)", color: "var(--bb-pink)" }
                      }
                    >
                      {waved.has(m.name) ? "Waved ✓" : "Wave"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* How Bouquet works */}
            <div
              className="rounded-3xl p-4"
              style={{ background: "var(--light-pink)" }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: "var(--bb-pink)" }}
              >
                HOW IT WORKS
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--bb-black)" }}>
                Your Bouquet is your inner circle — the women you&apos;ve genuinely connected with through BloomBay.
                Connect through Match first, then invite to your Bouquet. Max 12. No exceptions.
              </p>
              <Link
                href="/member/match"
                className="mt-3 block w-full py-3 rounded-full text-sm font-bold text-center"
                style={{ background: "var(--bb-pink)", color: "white" }}
              >
                Invite to Bouquet →
              </Link>
            </div>
          </div>
        )}

        {/* ── Memories Tab ── */}
        {activeTab === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--bb-pink)" }}>
                YANDE REMEMBERS
              </p>
              <div className="flex flex-col gap-3">
                {YANDE_MEMORIES.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-4"
                    style={{ background: "#111111" }}
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

            <div>
              <p
                className="text-base font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
              >
                My Moments
              </p>
              <div className="grid grid-cols-2 gap-3">
                {MEMORIES.map((mem, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ background: mem.bg }}>
                    <div className="h-20 flex items-center justify-center text-4xl">{mem.emoji}</div>
                    <div className="p-2.5">
                      <p className="font-semibold text-sm leading-snug" style={{ color: "var(--bb-black)" }}>{mem.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{mem.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── My Link Tab ── */}
        {activeTab === 2 && (
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
                  style={copied ? { background: "#111111", color: "white" } : { background: "var(--bb-pink)", color: "white" }}
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { if (typeof navigator !== "undefined" && navigator.share) { navigator.share({ title: "BloomBay", url: "https://bloombay.app/maya" }); } else { navigator.clipboard?.writeText("https://bloombay.app/maya"); showToast("Link copied!"); } }}
                  className="flex-1 py-3 rounded-full text-sm font-bold border-2 transition-all active:scale-95"
                  style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}
                >
                  Share to Instagram
                </button>
                <button
                  onClick={() => { navigator.clipboard?.writeText("https://bloombay.app/maya"); showToast("Invite link copied!"); }}
                  className="flex-1 py-3 rounded-full text-sm font-bold text-white transition-all"
                  style={{ background: "var(--bb-black)" }}
                >
                  Invite Girls
                </button>
              </div>
            </div>
            <div
              className="rounded-3xl p-4"
              style={{ background: "#111111" }}
            >
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--bb-pink)" }}>
                REFERRAL CODE
              </p>
              <p className="text-white text-2xl font-bold mb-1">GF-NYC-7842</p>
              <p className="text-white/50 text-xs">
                Invite women you actually know. Quality over quantity.
              </p>
            </div>
          </div>
        )}

        {/* ── Profile Tab ── */}
        {activeTab === 3 && (
          <div className="flex flex-col gap-5">
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
                  <p className="font-bold text-lg" style={{ color: "var(--bb-black)" }}>3</p>
                  <p className="text-xs text-gray-400">Bloomies</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <p className="font-bold text-sm mb-2" style={{ color: "var(--bb-black)" }}>About Maya</p>
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

            <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <Link href="/member/notifications" className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors block" style={{ borderBottom: "1px solid #F5F5F5" }}>
                <p className="flex-1 text-sm font-semibold" style={{ color: "var(--bb-black)" }}>Notifications</p>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#ccc" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              {["Edit profile", "Privacy & Safety", "BloomBay Premium"].map((label) => (
                <button
                  key={label}
                  onClick={() => showToast("Coming soon")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
                  style={{ borderBottom: "1px solid #F5F5F5" }}
                >
                  <p className="flex-1 text-sm font-semibold" style={{ color: "var(--bb-black)" }}>{label}</p>
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
                  <p className="flex-1 text-sm font-semibold" style={{ color: "#FF1F7D" }}>Sign out</p>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-24 left-1/2 z-50 px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg"
          style={{ background: "#111111", transform: "translateX(-50%)" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
