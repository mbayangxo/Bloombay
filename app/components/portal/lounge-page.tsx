"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { logout } from "@/lib/auth/actions";
import { getTimeOfDay, type TimeOfDay } from "./time-wrapper";

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

// Left-border accent colors cycling for Bloomies list
const BORDER_COLORS = ["#FF1F7D", "#FF69B4", "#FFB6D0"];

const BOUQUET_MAX = 12;

const BLOOMIE_UPDATES: Record<string, { emoji: string; text: string; time: string }[]> = {
  "Aaliyah M.": [
    { emoji: "🌅", text: "Just got back from that Williamsburg matcha spot. It's everything.", time: "2h ago" },
    { emoji: "🎨", text: "Paint & sip night was so good. Already planning the next one.", time: "Yesterday" },
  ],
  "Sofia K.": [
    { emoji: "🏃‍♀️", text: "Sunday run done. Pastries were mandatory.", time: "3h ago" },
    { emoji: "✈️", text: "Thinking Morocco in October. Who's in?", time: "2 days ago" },
  ],
  "Kelechi O.": [
    { emoji: "📚", text: "Book club pick just dropped. Cannot wait.", time: "5h ago" },
    { emoji: "🍷", text: "That rooftop spot in Flatbush is unreal. Telling everyone.", time: "3 days ago" },
  ],
};

interface LoungeUser { name: string; initial: string; neighborhood: string; bio?: string; }

interface BloomieProfile {
  name: string; neighborhood: string; color: string; initial: string; since: string;
}

function BloomieSheet({ bloomie, onClose }: { bloomie: BloomieProfile; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const updates = BLOOMIE_UPDATES[bloomie.name] ?? [];

  function sendMessage() {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 2500);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{ background: "#FDFAF5", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", maxHeight: "85vh", overflowY: "auto" }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>

        {/* Profile hero */}
        <div className="px-6 pb-5 flex items-start gap-4 relative">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${bloomie.color} 0%, ${bloomie.color}BB 100%)`, boxShadow: `0 4px 16px ${bloomie.color}44` }}
          >
            {bloomie.initial}
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
              {bloomie.name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{bloomie.neighborhood} · since {bloomie.since}</p>
            <span
              className="inline-block mt-2 text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider"
              style={{ background: "#111111", color: "#FF69B4" }}
            >
              ✦ YOUR BLOOMIE
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
            style={{ background: "rgba(0,0,0,0.07)" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round">
              <path d="M1 1l8 8M9 1l-8 8"/>
            </svg>
          </button>
        </div>

        {/* Message */}
        <div className="px-6 pb-5">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "#FF1F7D" }}>SEND A MESSAGE</p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid #F0E0E8" }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Write to ${bloomie.name.split(" ")[0]}…`}
              rows={3}
              className="w-full resize-none text-sm outline-none px-4 py-3"
              style={{ background: "transparent", color: "#111", lineHeight: 1.6 }}
            />
            <div className="px-4 pb-3 flex justify-end">
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
                style={sent
                  ? { background: "#111111", color: "#FF69B4" }
                  : message.trim()
                    ? { background: "#FF1F7D", color: "white", boxShadow: "0 3px 10px rgba(255,31,125,0.3)" }
                    : { background: "#F0E0E8", color: "#C8A0B0" }}
              >
                {sent ? "Sent ✓" : "Send →"}
              </button>
            </div>
          </div>
        </div>

        {/* Her updates */}
        {updates.length > 0 && (
          <div className="px-6 pb-8">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(0,0,0,0.3)" }}>HER UPDATES</p>
            <div className="flex flex-col gap-2.5">
              {updates.map((u, i) => (
                <div key={i} className="rounded-2xl px-4 py-3.5" style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{u.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed" style={{ color: "#444" }}>{u.text}</p>
                      <p className="text-xs mt-1" style={{ color: "#bbb" }}>{u.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function LoungePage({ user }: { user?: LoungeUser }) {
  const displayName = user?.name ?? "May";
  const displayInitial = user?.initial ?? "M";
  const displayNeighborhood = user?.neighborhood ?? "NYC";
  const displayBio = user?.bio ?? "Part of the world made for women.";
  const displayHandle = (user?.name?.split(" ")[0] ?? "member").toLowerCase();
  const [activeTab, setActiveTab] = useState(0);
  const [flowered, setFlowered] = useState<Set<string>>(new Set());
  const [selectedBloomie, setSelectedBloomie] = useState<BloomieProfile | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [tod, setTod] = useState<TimeOfDay>("morning");

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
  }, []);

  const isNight      = tod === "evening" || tod === "night";
  const isEvening    = tod === "evening";
  const headingColor = isNight ? "rgba(240,232,255,0.92)" : "#0A0A0A";
  const mutedColor   = isNight ? "rgba(200,190,225,0.52)"  : "#aaa";
  const cardBg       = isNight ? (isEvening ? "#1C1828" : "#16121E") : "white";
  const darkCard     = isNight ? (isEvening ? "#18142A" : "#131020") : "#111111";
  const tabActiveBg  = "#FF1F7D";
  const tabInactive  = isNight
    ? { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)", border: "none" }
    : { background: "white", color: "#0A0A0A", border: "1.5px solid #E0E0E0" };

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  function sendFlowers(name: string, e: React.MouseEvent) {
    e.stopPropagation();
    setFlowered((prev) => new Set([...prev, name]));
    showToast("Flowers sent 🌸");
  }

  function copyLink() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const emptySlots = BOUQUET_MAX - BOUQUET_MEMBERS.length;

  return (
    <div style={{ background: "var(--pale-pink-bg)" }}>

      {/* MOBILE */}
      <div className="md:hidden min-h-screen pb-24">
      {/* existing mobile content starts here - remove the md:grid wrapper and replace with just a plain div */}
      <div>
      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#FF1F7D" }}>
          YOUR SPACE
        </p>
        <h1
          className="font-bold italic leading-none mb-2"
          style={{ color: headingColor, fontFamily: "var(--font-playfair)", fontSize: "clamp(48px, 8vw, 64px)" }}
        >
          Apt
        </h1>
        <p className="italic text-sm" style={{ fontFamily: "var(--font-playfair)", color: mutedColor }}>
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
              className="px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95"
              style={activeTab === i ? { background: tabActiveBg, color: "white", boxShadow: "0 2px 8px rgba(255,31,125,0.3)" } : tabInactive}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">

        {/* ── Bouquet Tab ── */}
        {activeTab === 0 && (
          <div className="flex flex-col gap-6">
            {/* Banner with bloom pattern overlay */}
            <div
              className="rounded-3xl p-6 relative overflow-hidden"
              style={{ background: darkCard, minHeight: "120px" }}
            >
              {/* Large bloom orbs for visual drama */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #FF1F7D 0%, transparent 65%)",
                  opacity: 0.18,
                  transform: "translate(35%, -35%)",
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #FF69B4 0%, transparent 70%)",
                  opacity: 0.14,
                  transform: "translate(-30%, 30%)",
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 w-28 h-28 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #FF1F7D 0%, transparent 70%)",
                  opacity: 0.07,
                  transform: "translate(-50%, -50%)",
                }}
              />
              <div className="relative">
                <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--mid-pink)" }}>
                  YOUR BOUQUET
                </p>
                <p
                  className="text-white font-bold italic mb-2"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "28px" }}
                >
                  {BOUQUET_MEMBERS.length} of {BOUQUET_MAX} Bloomies
                </p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Your intimate inner circle. Max 12. Invite-only.
                </p>
              </div>
            </div>

            {/* Flower grid — 12 slots, larger (w-16 h-16) */}
            <div>
              <p
                className="text-sm font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
              >
                Your Circle
              </p>
              <div className="grid grid-cols-6 gap-2 mb-4">
                {BOUQUET_MEMBERS.map((m) => (
                  <div key={m.name} className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${m.color} 0%, ${m.color}BB 100%)`,
                        boxShadow: `0 4px 12px ${m.color}44`,
                      }}
                    >
                      {m.initial}
                    </div>
                    <p className="text-[10px] text-center text-gray-500 leading-tight w-16 truncate">
                      {m.name.split(" ")[0]}
                    </p>
                  </div>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-dashed"
                      style={{ borderColor: "#E0D0D8" }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C8B0BC" strokeWidth="1.5">
                        <path d="M12 2l1.7 5.3H19l-4.4 3.2 1.7 5.3L12 13l-4.3 2.8 1.7-5.3L5 7.3h5.3z" />
                      </svg>
                    </div>
                    <p className="text-[10px] text-center text-gray-300 leading-tight">open</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloomies list — colored left border accents, tappable */}
            <div>
              <p
                className="text-sm font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
              >
                Your Bloomies
              </p>
              <div className="flex flex-col gap-2.5">
                {BOUQUET_MEMBERS.map((m, idx) => (
                  <div
                    key={m.name}
                    onClick={() => setSelectedBloomie(m)}
                    className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
                    style={{
                      background: cardBg,
                      boxShadow: "0 2px 12px rgba(255,31,125,0.07)",
                      borderLeft: `3px solid ${BORDER_COLORS[idx % BORDER_COLORS.length]}`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${m.color} 0%, ${m.color}AA 100%)`,
                        boxShadow: `0 2px 8px ${m.color}44`,
                      }}
                    >
                      {m.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: headingColor }}>{m.name}</p>
                      <p className="text-xs mt-0.5 text-gray-400">{m.neighborhood} · since {m.since}</p>
                    </div>
                    <button
                      onClick={(e) => sendFlowers(m.name, e)}
                      className="px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-90 flex-shrink-0"
                      style={
                        flowered.has(m.name)
                          ? { background: m.color, color: "white", boxShadow: `0 2px 8px ${m.color}44` }
                          : { background: "var(--light-pink)", color: "var(--bb-pink)" }
                      }
                    >
                      {flowered.has(m.name) ? "Sent 🌸" : "Send Flowers"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* How Bouquet works */}
            <div
              className="rounded-3xl p-5"
              style={{ background: "var(--light-pink)" }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: "var(--bb-pink)" }}
              >
                HOW IT WORKS
              </p>
              <p className="text-sm leading-relaxed" style={{ color: headingColor }}>
                Your Bouquet is your inner circle — the women you&apos;ve genuinely connected with through BloomBay.
                Connect through Match first, then invite to your Bouquet. Max 12. No exceptions.
              </p>
              <Link
                href="/member/match"
                className="mt-4 block w-full py-3.5 rounded-full text-sm font-bold text-center transition-all active:scale-[0.98]"
                style={{
                  background: "var(--bb-pink)",
                  color: "white",
                  boxShadow: "0 4px 14px rgba(255,31,125,0.30)",
                }}
              >
                Invite to Bouquet →
              </Link>
            </div>
          </div>
        )}

        {/* ── Memories Tab ── */}
        {activeTab === 1 && (
          <div className="flex flex-col gap-6">
            {/* YANDE REMEMBERS — glowing pink text */}
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: "var(--bb-pink)" }}
              >
                YANDE REMEMBERS
              </p>
              <div className="flex flex-col gap-3">
                {YANDE_MEMORIES.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-5 relative overflow-hidden"
                    style={{ background: darkCard }}
                  >
                    {/* Glowing orb */}
                    <div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                      style={{
                        background: "radial-gradient(circle, #FF1F7D 0%, transparent 70%)",
                        opacity: 0.12,
                        transform: "translate(30%, -30%)",
                      }}
                    />
                    <p
                      className="text-sm italic leading-relaxed relative"
                      style={{
                        fontFamily: "var(--font-playfair)",
                        color: "#FF69B4",
                        textShadow: "0 0 20px rgba(255,105,180,0.5)",
                      }}
                    >
                      {m.quote}
                    </p>
                    <p className="text-xs mt-3 relative" style={{ color: "rgba(255,255,255,0.35)" }}>{m.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* My Moments grid — taller image areas (h-28) */}
            <div>
              <p
                className="text-base font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
              >
                My Moments
              </p>
              <div className="grid grid-cols-2 gap-3">
                {MEMORIES.map((mem, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ background: mem.bg, boxShadow: "0 2px 10px rgba(255,31,125,0.07)" }}>
                    <div className="h-28 flex items-center justify-center text-5xl">{mem.emoji}</div>
                    <div className="p-3">
                      <p className="font-semibold text-sm leading-snug" style={{ color: headingColor }}>{mem.title}</p>
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
                style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
              >
                My BloomBay Link
              </p>
              <p className="text-xs text-gray-400 mb-4">Share your profile. Invite women you trust.</p>
              <div
                className="rounded-2xl px-4 py-3 flex items-center justify-between mb-4"
                style={{ background: "var(--pale-pink-bg)" }}
              >
                <p className="text-sm font-bold" style={{ color: headingColor }}>
                  bloombay.app/{displayHandle}
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
                  onClick={() => {
                    const url = `https://bloombay.app/${displayHandle}`;
                    if (typeof navigator !== "undefined" && navigator.share) {
                      navigator.share({ title: "BloomBay", url });
                    } else {
                      navigator.clipboard?.writeText(url);
                      showToast("Link copied!");
                    }
                  }}
                  className="flex-1 py-3 rounded-full text-sm font-bold border-2 transition-all active:scale-95"
                  style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}
                >
                  Share to Instagram
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`https://bloombay.app/${displayHandle}`);
                    showToast("Invite link copied!");
                  }}
                  className="flex-1 py-3 rounded-full text-sm font-bold text-white transition-all active:scale-95"
                  style={{ background: "#FF1F7D", color: "white" }}
                >
                  Invite Girls
                </button>
              </div>
            </div>
            <div
              className="rounded-3xl p-5 relative overflow-hidden"
              style={{ background: "#111111" }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #FF1F7D 0%, transparent 70%)",
                  opacity: 0.15,
                  transform: "translate(30%, -30%)",
                }}
              />
              <p className="text-xs font-bold tracking-widest uppercase mb-2 relative" style={{ color: "var(--bb-pink)" }}>
                REFERRAL CODE
              </p>
              <p className="text-white text-2xl font-bold mb-1 relative">GF-NYC-7842</p>
              <p className="text-xs relative" style={{ color: "rgba(255,255,255,0.45)" }}>
                Invite women you actually know. Quality over quantity.
              </p>
            </div>
          </div>
        )}

        {/* ── Profile Tab ── */}
        {activeTab === 3 && (
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-3xl p-6 flex flex-col items-center text-center" style={{ boxShadow: "0 2px 16px rgba(255,31,125,0.08)" }}>
              {/* Large styled initial circle instead of emoji */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4"
                style={{
                  background: "linear-gradient(135deg, #FF1F7D 0%, #FF69B4 100%)",
                  boxShadow: "0 8px 24px rgba(255,31,125,0.35)",
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                }}
              >
                {displayInitial}
              </div>
              <h2
                className="text-2xl font-bold italic mb-1"
                style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
              >
                {displayName}
              </h2>
              <p className="text-sm text-gray-400 mb-2">{displayNeighborhood} · NYC</p>
              {/* Founding Mother badge */}
              <span
                className="text-xs font-bold px-3.5 py-1.5 rounded-full mb-4"
                style={{ background: "#111111", color: "#FF69B4", letterSpacing: "0.04em" }}
              >
                ✦ Founding Mother
              </span>
              {/* Stats row — pink numbers */}
              <div className="flex gap-6 w-full justify-center">
                <div className="text-center">
                  <p
                    className="font-bold text-2xl"
                    style={{ color: "var(--bb-pink)", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
                  >
                    12
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Events</p>
                </div>
                <div className="w-px bg-gray-100" />
                <div className="text-center">
                  <p
                    className="font-bold text-2xl"
                    style={{ color: "var(--bb-pink)", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
                  >
                    3
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Clubs</p>
                </div>
                <div className="w-px bg-gray-100" />
                <div className="text-center">
                  <p
                    className="font-bold text-2xl"
                    style={{ color: "var(--bb-pink)", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
                  >
                    3
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Bloomies</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <p className="font-bold text-sm mb-2" style={{ color: headingColor }}>About {displayName.split(" ")[0]}</p>
              <p
                className="italic text-sm text-gray-500 leading-relaxed"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                &quot;{displayBio}&quot;
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
              <Link
                href="/member/notifications"
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors block"
                style={{ borderBottom: "1px solid #F5F5F5" }}
              >
                <p className="flex-1 text-sm font-semibold" style={{ color: headingColor }}>Notifications</p>
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
                  <p className="flex-1 text-sm font-semibold" style={{ color: headingColor }}>{label}</p>
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
      </div>{/* end plain div wrapper */}
      </div>{/* end mobile */}

      {/* DESKTOP */}
      <div className="hidden md:flex md:flex-col" style={{ height: "100vh" }}>

        {/* Top bar */}
        <div
          className="flex items-center gap-4 flex-shrink-0 px-8"
          style={{ height: "64px", borderBottom: isNight ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.07)", background: "var(--pale-pink-bg)" }}
        >
          {/* Left: label + heading */}
          <div className="flex items-baseline gap-2.5">
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#FF1F7D" }}>YOUR SPACE</p>
            <h1
              className="font-bold italic leading-none"
              style={{ color: headingColor, fontFamily: "var(--font-playfair)", fontSize: "28px" }}
            >
              Apt
            </h1>
          </div>

          {/* Divider */}
          <div className="w-px self-stretch my-3" style={{ background: "rgba(0,0,0,0.10)" }} />

          {/* Tab pills */}
          <div className="flex gap-2">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
                style={
                  activeTab === i
                    ? { background: tabActiveBg, color: "white", boxShadow: "0 2px 8px rgba(255,31,125,0.3)" }
                    : tabInactive
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right: badge + avatar */}
          <div className="ml-auto flex items-center gap-3" style={{ marginRight: "256px" }}>
            <span
              className="text-[10px] font-bold px-3 py-1.5 rounded-full"
              style={{ background: "#111111", color: "#FF69B4", letterSpacing: "0.04em" }}
            >
              ✦ Founding Mother
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #FF1F7D 0%, #FF69B4 100%)",
                boxShadow: "0 2px 8px rgba(255,31,125,0.35)",
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
              }}
            >
              {displayInitial}
            </div>
          </div>
        </div>

        {/* 3-col body */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT panel */}
          <div
            className="flex-shrink-0 overflow-y-auto py-5 px-4"
            style={{ width: "240px", borderRight: isNight ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.07)" }}
          >
            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3"
                style={{
                  background: "linear-gradient(135deg, #FF1F7D 0%, #FF69B4 100%)",
                  boxShadow: "0 8px 24px rgba(255,31,125,0.35)",
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                }}
              >
                {displayInitial}
              </div>
              <h2
                className="text-xl font-bold italic mb-0.5"
                style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
              >
                {displayName}
              </h2>
              <p className="text-xs mb-2" style={{ color: mutedColor }}>{displayNeighborhood} · NYC</p>
              <span
                className="text-[10px] font-bold px-3 py-1 rounded-full"
                style={{ background: "#111111", color: "#FF69B4", letterSpacing: "0.04em" }}
              >
                ✦ Founding Mother
              </span>
            </div>

            {/* Stats row */}
            <div className="flex gap-3 justify-center mb-4">
              {[{ n: "12", label: "Events" }, { n: "3", label: "Clubs" }, { n: "3", label: "Bloomies" }].map((s, i) => (
                <div key={i} className="text-center">
                  <p
                    className="font-bold text-lg"
                    style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
                  >
                    {s.n}
                  </p>
                  <p className="text-[10px]" style={{ color: mutedColor }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="mb-4" style={{ height: "1px", background: isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)" }} />

            {/* Bio quote */}
            <p
              className="italic text-xs leading-relaxed mb-4 text-center"
              style={{ fontFamily: "var(--font-playfair)", color: mutedColor }}
            >
              &quot;{displayBio}&quot;
            </p>

            {/* Interest tags */}
            <div className="flex flex-wrap gap-1.5 justify-center mb-4">
              {["Soft Life", "Art", "Wellness", "Food"].map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                  style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="mb-3" style={{ height: "1px", background: isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)" }} />

            {/* Quick actions */}
            <div className="flex flex-col gap-0.5">
              <Link
                href="/member/notifications"
                className="flex items-center gap-3 px-2 py-2 rounded-xl transition-colors hover:bg-black/5"
              >
                <p className="flex-1 text-xs font-semibold" style={{ color: headingColor }}>Notifications</p>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#ccc" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <button
                onClick={() => showToast("Coming soon")}
                className="flex items-center gap-3 px-2 py-2 rounded-xl text-left transition-colors hover:bg-black/5"
              >
                <p className="flex-1 text-xs font-semibold" style={{ color: headingColor }}>Edit Profile</p>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#ccc" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-xl text-left transition-colors hover:bg-red-50"
                >
                  <p className="flex-1 text-xs font-semibold" style={{ color: "#FF1F7D" }}>Sign out</p>
                </button>
              </form>
            </div>
          </div>

          {/* CENTER panel */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* ── Bouquet Tab ── */}
            {activeTab === 0 && (
              <div className="flex flex-col gap-6">
                {/* Banner */}
                <div
                  className="rounded-3xl p-6 relative overflow-hidden"
                  style={{ background: darkCard, minHeight: "120px" }}
                >
                  <div
                    className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, #FF1F7D 0%, transparent 65%)", opacity: 0.18, transform: "translate(35%, -35%)" }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-40 h-40 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, #FF69B4 0%, transparent 70%)", opacity: 0.14, transform: "translate(-30%, 30%)" }}
                  />
                  <div className="relative">
                    <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--mid-pink)" }}>YOUR BOUQUET</p>
                    <p className="text-white font-bold italic mb-2" style={{ fontFamily: "var(--font-playfair)", fontSize: "28px" }}>
                      {BOUQUET_MEMBERS.length} of {BOUQUET_MAX} Bloomies
                    </p>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                      Your intimate inner circle. Max 12. Invite-only.
                    </p>
                  </div>
                </div>

                {/* Bloomies grid */}
                <div>
                  <p className="text-sm font-bold italic mb-4" style={{ fontFamily: "var(--font-playfair)", color: headingColor }}>
                    Your Bloomies
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {BOUQUET_MEMBERS.map((m, idx) => (
                      <div
                        key={m.name}
                        onClick={() => setSelectedBloomie(m)}
                        className="rounded-2xl p-4 flex flex-col gap-3 cursor-pointer active:scale-[0.98] transition-transform"
                        style={{
                          background: cardBg,
                          boxShadow: "0 2px 12px rgba(255,31,125,0.07)",
                          borderTop: `3px solid ${BORDER_COLORS[idx % BORDER_COLORS.length]}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${m.color} 0%, ${m.color}AA 100%)`, boxShadow: `0 2px 8px ${m.color}44` }}
                          >
                            {m.initial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm" style={{ color: headingColor }}>{m.name}</p>
                            <p className="text-xs mt-0.5 text-gray-400">{m.neighborhood}</p>
                            <p className="text-[10px] mt-0.5 text-gray-400">since {m.since}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => sendFlowers(m.name, e)}
                          className="w-full py-2 rounded-full text-xs font-bold transition-all active:scale-90"
                          style={
                            flowered.has(m.name)
                              ? { background: m.color, color: "white", boxShadow: `0 2px 8px ${m.color}44` }
                              : { background: "var(--light-pink)", color: "var(--bb-pink)" }
                          }
                        >
                          {flowered.has(m.name) ? "Sent 🌸" : "Send Flowers"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How it works */}
                <div className="rounded-3xl p-5" style={{ background: "var(--light-pink)" }}>
                  <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--bb-pink)" }}>HOW IT WORKS</p>
                  <p className="text-sm leading-relaxed" style={{ color: headingColor }}>
                    Your Bouquet is your inner circle — the women you&apos;ve genuinely connected with through BloomBay.
                    Connect through Match first, then invite to your Bouquet. Max 12. No exceptions.
                  </p>
                  <Link
                    href="/member/match"
                    className="mt-4 block w-full py-3.5 rounded-full text-sm font-bold text-center transition-all active:scale-[0.98]"
                    style={{ background: "var(--bb-pink)", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.30)" }}
                  >
                    Invite to Bouquet →
                  </Link>
                </div>
              </div>
            )}

            {/* ── Memories Tab ── */}
            {activeTab === 1 && (
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--bb-pink)" }}>YANDE REMEMBERS</p>
                  <div className="flex flex-col gap-3">
                    {YANDE_MEMORIES.map((m, i) => (
                      <div key={i} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: darkCard }}>
                        <div
                          className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                          style={{ background: "radial-gradient(circle, #FF1F7D 0%, transparent 70%)", opacity: 0.12, transform: "translate(30%, -30%)" }}
                        />
                        <p
                          className="text-sm italic leading-relaxed relative"
                          style={{ fontFamily: "var(--font-playfair)", color: "#FF69B4", textShadow: "0 0 20px rgba(255,105,180,0.5)" }}
                        >
                          {m.quote}
                        </p>
                        <p className="text-xs mt-3 relative" style={{ color: "rgba(255,255,255,0.35)" }}>{m.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-base font-bold italic mb-3" style={{ fontFamily: "var(--font-playfair)", color: headingColor }}>
                    My Moments
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {MEMORIES.map((mem, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden" style={{ background: mem.bg, boxShadow: "0 2px 10px rgba(255,31,125,0.07)" }}>
                        <div className="h-24 flex items-center justify-center text-4xl">{mem.emoji}</div>
                        <div className="p-3">
                          <p className="font-semibold text-sm leading-snug" style={{ color: headingColor }}>{mem.title}</p>
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
              <div className="flex flex-col gap-4 max-w-lg">
                <div className="rounded-3xl p-5" style={{ background: cardBg, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                  <p className="text-base font-bold italic mb-1" style={{ fontFamily: "var(--font-playfair)", color: headingColor }}>
                    My BloomBay Link
                  </p>
                  <p className="text-xs text-gray-400 mb-4">Share your profile. Invite women you trust.</p>
                  <div
                    className="rounded-2xl px-4 py-3 flex items-center justify-between mb-4"
                    style={{ background: "var(--pale-pink-bg)" }}
                  >
                    <p className="text-sm font-bold" style={{ color: headingColor }}>bloombay.app/{displayHandle}</p>
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
                      onClick={() => {
                        const url = `https://bloombay.app/${displayHandle}`;
                        if (typeof navigator !== "undefined" && navigator.share) {
                          navigator.share({ title: "BloomBay", url });
                        } else {
                          navigator.clipboard?.writeText(url);
                          showToast("Link copied!");
                        }
                      }}
                      className="flex-1 py-3 rounded-full text-sm font-bold border-2 transition-all active:scale-95"
                      style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}
                    >
                      Share to Instagram
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(`https://bloombay.app/${displayHandle}`);
                        showToast("Invite link copied!");
                      }}
                      className="flex-1 py-3 rounded-full text-sm font-bold text-white transition-all active:scale-95"
                      style={{ background: "#FF1F7D", color: "white" }}
                    >
                      Invite Girls
                    </button>
                  </div>
                </div>
                <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: "#111111" }}>
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, #FF1F7D 0%, transparent 70%)", opacity: 0.15, transform: "translate(30%, -30%)" }}
                  />
                  <p className="text-xs font-bold tracking-widest uppercase mb-2 relative" style={{ color: "var(--bb-pink)" }}>REFERRAL CODE</p>
                  <p className="text-white text-2xl font-bold mb-1 relative">GF-NYC-7842</p>
                  <p className="text-xs relative" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Invite women you actually know. Quality over quantity.
                  </p>
                </div>
              </div>
            )}

            {/* ── Profile Tab — account settings on desktop ── */}
            {activeTab === 3 && (
              <div className="flex flex-col gap-4 max-w-lg">
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--bb-pink)" }}>ACCOUNT SETTINGS</p>
                <div className="rounded-3xl overflow-hidden" style={{ background: cardBg, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                  <Link
                    href="/member/notifications"
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors block"
                    style={{ borderBottom: `1px solid ${isNight ? "rgba(255,255,255,0.06)" : "#F5F5F5"}` }}
                  >
                    <p className="flex-1 text-sm font-semibold" style={{ color: headingColor }}>Notifications</p>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#ccc" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  {["Edit profile", "Privacy & Safety", "BloomBay Premium"].map((label) => (
                    <button
                      key={label}
                      onClick={() => showToast("Coming soon")}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
                      style={{ borderBottom: `1px solid ${isNight ? "rgba(255,255,255,0.06)" : "#F5F5F5"}` }}
                    >
                      <p className="flex-1 text-sm font-semibold" style={{ color: headingColor }}>{label}</p>
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

          </div>{/* end center panel */}

          {/* RIGHT panel */}
          <div
            className="flex-shrink-0 overflow-y-auto py-5 px-4"
            style={{ width: "260px", borderLeft: isNight ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.07)" }}
          >
            {/* Yande Remembers */}
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "var(--bb-pink)" }}>
              YANDE REMEMBERS
            </p>
            {YANDE_MEMORIES.map((m, i) => (
              <div key={i} className="rounded-xl p-3 mb-3 relative overflow-hidden" style={{ background: darkCard }}>
                <div
                  className="absolute top-0 right-0 w-16 h-16 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, #FF1F7D 0%, transparent 70%)", opacity: 0.12, transform: "translate(30%, -30%)" }}
                />
                <p
                  className="text-[11px] italic leading-relaxed relative"
                  style={{ fontFamily: "var(--font-playfair)", color: "#FF69B4" }}
                >
                  {m.quote}
                </p>
                <p className="text-[10px] mt-1.5 relative" style={{ color: "rgba(255,255,255,0.3)" }}>{m.date}</p>
              </div>
            ))}

            {/* Divider */}
            <div className="my-4" style={{ height: "1px", background: isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)" }} />

            {/* Bouquet */}
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "var(--bb-pink)" }}>
              BOUQUET
            </p>
            <div className="grid grid-cols-4 gap-2">
              {BOUQUET_MEMBERS.map((m) => (
                <div key={m.name} className="flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${m.color} 0%, ${m.color}BB 100%)`,
                      boxShadow: `0 2px 8px ${m.color}44`,
                    }}
                  >
                    {m.initial}
                  </div>
                  <p className="text-[9px] text-center leading-tight" style={{ color: mutedColor }}>
                    {m.name.split(" ")[0]}
                  </p>
                </div>
              ))}
              {Array.from({ length: emptySlots > 5 ? 5 : emptySlots }).map((_, i) => (
                <div key={`empty-${i}`} className="flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-dashed"
                    style={{ borderColor: "#E0D0D8" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C8B0BC" strokeWidth="1.5">
                      <path d="M12 2l1.7 5.3H19l-4.4 3.2 1.7 5.3L12 13l-4.3 2.8 1.7-5.3L5 7.3h5.3z" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-center" style={{ color: "#C8B0BC" }}>open</p>
                </div>
              ))}
            </div>
          </div>{/* end right panel */}

        </div>{/* end 3-col body */}

      </div>{/* end desktop */}

      {selectedBloomie && (
        <BloomieSheet bloomie={selectedBloomie} onClose={() => setSelectedBloomie(null)} />
      )}

      {/* Toast — bottom-center, smooth slide-up animation */}
      {toast && (
        <div
          className="fixed bottom-24 left-1/2 z-50 px-6 py-3.5 rounded-full text-sm font-semibold text-white"
          style={{
            background: "#FF1F7D",
            transform: "translateX(-50%)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
            animation: "slideUpToast 0.25s ease-out",
          }}
        >
          {toast}
        </div>
      )}

      <style>{`
        @keyframes slideUpToast {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
