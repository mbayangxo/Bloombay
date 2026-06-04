"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { logout } from "@/lib/auth/actions";
import { getTimeOfDay, type TimeOfDay } from "./time-wrapper";

const TABS = ["Living Room", "Gallery", "Door", "Mirror"];

const TAB_BACKGROUNDS = [
  "#FAF3EB", // Living Room — warm cream
  "#1A1208", // Gallery    — dark warm wall
  "#FFF8F4", // Door       — hallway, bright
  "#FDFAF6", // Mirror     — vanity/dressing room
];

// ── BloomBay World Themes ──────────────────────────────────────────────────────
const WORLD_THEMES = [
  { id: "bloom",    label: "Bloom",    emoji: "🌸", desc: "Soft pink, floral, warm", accent: "#FF1F7D", bg: "#FFF5F8", stationery: "#FFE0EE" },
  { id: "velvet",   label: "Velvet",   emoji: "🍷", desc: "Deep red, rich, opulent", accent: "#8B0000", bg: "#1A0508", stationery: "#3D0B14" },
  { id: "dawn",     label: "Dawn",     emoji: "🌅", desc: "Warm gold, soft morning", accent: "#D4A853", bg: "#FFF8EC", stationery: "#FFF0D0" },
  { id: "midnight", label: "Midnight", emoji: "🌙", desc: "Deep navy, stars, quiet", accent: "#818CF8", bg: "#05060F", stationery: "#0A0C20" },
  { id: "society",  label: "Society",  emoji: "✦",  desc: "Noir black, structured",  accent: "#FFFFFF", bg: "#0A0A0A", stationery: "#181818" },
  { id: "petal",    label: "Petal",    emoji: "🌷", desc: "Dusty rose, vintage, soft", accent: "#C97EFF", bg: "#FAF0FF", stationery: "#F5E8FF" },
] as const;

type WorldThemeId = typeof WORLD_THEMES[number]["id"];

// ── Pinned Objects ─────────────────────────────────────────────────────────────
const PINNABLE_OBJECTS = [
  { id: "candle",    emoji: "🕯️", label: "Candle" },
  { id: "flowers",   emoji: "🌸", label: "Flowers" },
  { id: "book",      emoji: "📚", label: "Book" },
  { id: "perfume",   emoji: "✨", label: "Perfume" },
  { id: "plant",     emoji: "🌿", label: "Plant" },
  { id: "mirror",    emoji: "🪞", label: "Mirror" },
  { id: "camera",    emoji: "📷", label: "Camera" },
  { id: "vinyl",     emoji: "🎵", label: "Vinyl" },
  { id: "tea",       emoji: "☕", label: "Tea" },
  { id: "journal",   emoji: "📓", label: "Journal" },
];

// ── Witness Stack entries ──────────────────────────────────────────────────────
const WITNESS_ENTRIES = [
  { initial: "A", color: "#FF1F7D",  text: "She lights up the whole table when she talks about food.",  date: "Apr 2026" },
  { initial: "Z", color: "#FF69B4",  text: "The most thoughtful woman I've met at a BloomBay event.",   date: "Mar 2026" },
  { initial: "N", color: "#C084FC",  text: "She made everyone feel welcome that Sunday morning walk.",  date: "Mar 2026" },
  { initial: "M", color: "#FB923C",  text: "Real, grounded, and completely herself — rare.",            date: "Feb 2026" },
];

const BOUQUET_MEMBERS = [
  { name: "Aaliyah M.", neighborhood: "Crown Heights", color: "#FF1F7D", initial: "A", since: "Jan 2026" },
  { name: "Sofia K.", neighborhood: "Williamsburg", color: "#FF69B4", initial: "S", since: "Feb 2026" },
  { name: "Kelechi O.", neighborhood: "Flatbush", color: "#FF69B4", initial: "K", since: "Mar 2026" },
];

// Bloomies = all friends (unlimited) — separate from Bouquet (best 12)
const ALL_BLOOMIES = [
  { name: "Aaliyah M.", neighborhood: "Crown Heights", color: "#FF1F7D", initial: "A", since: "Jan 2026" },
  { name: "Sofia K.", neighborhood: "Williamsburg", color: "#FF69B4", initial: "S", since: "Feb 2026" },
  { name: "Kelechi O.", neighborhood: "Flatbush", color: "#FF69B4", initial: "K", since: "Mar 2026" },
  { name: "Naomi B.", neighborhood: "SoHo", color: "#FF69B4", initial: "N", since: "Apr 2026" },
  { name: "Temi A.", neighborhood: "Crown Heights", color: "#FF1F7D", initial: "T", since: "Apr 2026" },
  { name: "Zara F.", neighborhood: "DUMBO", color: "#FF69B4", initial: "Z", since: "May 2026" },
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

function BloomiesListSheet({ onClose, onSelectBloomie }: {
  onClose: () => void;
  onSelectBloomie: (b: BloomieProfile) => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{ background: "#FDFAF5", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", maxHeight: "80vh", overflowY: "auto" }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>
        <div className="px-6 pb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#FF1F7D" }}>YOUR BLOOMIES</p>
            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{ALL_BLOOMIES.length} friends</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.07)" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round">
              <path d="M1 1l8 8M9 1l-8 8"/>
            </svg>
          </button>
        </div>
        <div className="px-6 pb-8 flex flex-col gap-2.5">
          {ALL_BLOOMIES.map((m, idx) => (
            <button
              key={m.name}
              onClick={() => { onClose(); setTimeout(() => onSelectBloomie(m), 100); }}
              className="rounded-2xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform w-full"
              style={{
                background: "white",
                boxShadow: "0 2px 12px rgba(255,31,125,0.07)",
                borderLeft: `3px solid ${BORDER_COLORS[idx % BORDER_COLORS.length]}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${m.color} 0%, ${m.color}AA 100%)`, boxShadow: `0 2px 8px ${m.color}44` }}
              >
                {m.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: "#111" }}>{m.name}</p>
                <p className="text-xs mt-0.5 text-gray-400">{m.neighborhood} · since {m.since}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ))}
        </div>
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
  const [showBloomiesList, setShowBloomiesList] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [tod, setTod] = useState<TimeOfDay>("morning");
  const [worldTheme, setWorldTheme] = useState<WorldThemeId>("bloom");
  const [pinnedObjects, setPinnedObjects] = useState<Set<string>>(new Set(["candle", "flowers", "book"]));
  const [showWorldPicker, setShowWorldPicker] = useState(false);
  const [showObjectPicker, setShowObjectPicker] = useState(false);

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
  }, []);

  // Per-tab heading/muted color — Gallery tab is dark so needs light text
  const isGalleryTab = activeTab === 1;
  const headingColor = isGalleryTab ? "rgba(255,240,220,0.92)" : "#0A0A0A";
  const mutedColor   = isGalleryTab ? "rgba(215,175,155,0.58)"  : "#aaa";
  const cardBg       = isGalleryTab ? "#2A1E10" : "white";
  const darkCard     = isGalleryTab ? "#1E1410" : "#111111";

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
    <div
      className="min-h-screen"
      style={{ background: "#120C06" }}
    >
      <div className="md:max-w-[1000px] md:mx-auto">

        {/* ── Entry Foyer / Header ── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #120C06 0%, #1A1008 100%)",
            paddingTop: "env(safe-area-inset-top, 0px)",
          }}
        >
          {/* Amber window-light glow — top right */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 85% 15%, rgba(255,165,50,0.14) 0%, transparent 55%)",
            }}
          />

          {/* Top bar: back button + avatar */}
          <div className="relative flex items-center justify-between px-5 pt-12 pb-4 md:px-8 md:pt-10">
            {/* Back button */}
            <Link
              href="/member/home"
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity active:opacity-70"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </Link>

            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #FF1F7D 0%, #FF69B4 100%)",
                boxShadow: "0 0 0 2px rgba(255,165,50,0.25), 0 4px 12px rgba(255,31,125,0.40)",
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
              }}
            >
              {displayInitial}
            </div>
          </div>

          {/* Hero text */}
          <div className="relative px-5 pb-8 md:px-8">
            {/* YOUR APARTMENT label */}
            <p
              className="text-[9px] font-bold tracking-[0.28em] uppercase mb-3"
              style={{ color: "rgba(255,165,50,0.75)" }}
            >
              YOUR APARTMENT
            </p>

            {/* "Welcome home," */}
            <h1
              className="leading-none mb-1"
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(38px, 10vw, 52px)",
                color: "rgba(255,240,220,0.92)",
              }}
            >
              Welcome home,
            </h1>

            {/* Name in pink */}
            <h1
              className="leading-none mb-4"
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(38px, 10vw, 52px)",
                color: "#FF1F7D",
              }}
            >
              {displayName.split(" ")[0]}.
            </h1>

            {/* Address sub-line */}
            <p
              className="text-xs tracking-wide"
              style={{ color: "rgba(255,200,100,0.65)", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
            >
              APT 3F · {displayNeighborhood}
            </p>
          </div>
        </div>

        {/* ── Tab strip — sits on dark #120C06 background ── */}
        <div
          className="sticky top-0 z-30 px-5 py-3 overflow-x-auto md:px-8"
          style={{ background: "#120C06", scrollbarWidth: "none", borderBottom: "1px solid rgba(255,165,50,0.08)" }}
        >
          <div className="flex gap-2 w-max">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95"
                style={
                  activeTab === i
                    ? { background: "#FF1F7D", color: "white", boxShadow: "0 2px 10px rgba(255,31,125,0.35)" }
                    : { background: "rgba(255,200,130,0.10)", color: "rgba(255,220,170,0.60)", border: "1px solid rgba(255,200,130,0.14)" }
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content area — background switches per tab ── */}
        <div
          className="min-h-screen pb-24 px-5 pt-6 md:px-8"
          style={{ background: TAB_BACKGROUNDS[activeTab], transition: "background 0.3s ease" }}
        >

          {/* ── Living Room Tab (was Bouquet) ── */}
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
                    {BOUQUET_MEMBERS.length} of {BOUQUET_MAX} Best Friends
                  </p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Your inner circle. Max 12. Invite-only.
                  </p>
                </div>
              </div>

              {/* Flower grid — 12 slots */}
              <div>
                <p
                  className="text-sm font-bold italic mb-3"
                  style={{ fontFamily: "var(--font-playfair)", color: "#0A0A0A" }}
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
                        style={{ borderColor: "#E0C8C0" }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C8A0A8" strokeWidth="1.5">
                          <path d="M12 2l1.7 5.3H19l-4.4 3.2 1.7 5.3L12 13l-4.3 2.8 1.7-5.3L5 7.3h5.3z" />
                        </svg>
                      </div>
                      <p className="text-[10px] text-center leading-tight" style={{ color: "#C8A090" }}>open</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloomies — icon entry (tap the rose to see all friends) */}
              <button
                onClick={() => setShowBloomiesList(true)}
                className="w-full rounded-3xl p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
                style={{
                  background: "white",
                  boxShadow: "0 4px 20px rgba(255,31,125,0.10)",
                  border: "1.5px solid rgba(255,31,125,0.12)",
                }}
              >
                {/* Bouquet of roses icon */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 relative"
                  style={{
                    background: "linear-gradient(160deg, #2D1520 0%, #1A0A12 100%)",
                    boxShadow: "0 6px 20px rgba(255,31,125,0.45)",
                  }}
                >
                  <svg width="38" height="40" viewBox="0 0 38 40" fill="none">
                    {/* Left rose */}
                    <circle cx="10" cy="11" r="5.5" fill="#FF69B4"/>
                    <circle cx="10" cy="8.2" r="2.8" fill="white" fillOpacity="0.28"/>
                    <ellipse cx="7.5" cy="12.5" rx="2.2" ry="2.8" fill="#FF1F7D" opacity="0.8"/>
                    {/* Center rose — larger, in front */}
                    <circle cx="19" cy="9" r="7" fill="#FF1F7D"/>
                    <circle cx="19" cy="6" r="3.5" fill="white" fillOpacity="0.26"/>
                    <ellipse cx="15.5" cy="10.5" rx="2.8" ry="3.5" fill="#FF69B4" opacity="0.75"/>
                    <ellipse cx="22.5" cy="10.5" rx="2.8" ry="3.5" fill="#FFB6D0" opacity="0.7"/>
                    {/* Right rose */}
                    <circle cx="28" cy="11" r="5.5" fill="#FF69B4"/>
                    <circle cx="28" cy="8.2" r="2.8" fill="white" fillOpacity="0.28"/>
                    <ellipse cx="30.5" cy="12.5" rx="2.2" ry="2.8" fill="#FF1F7D" opacity="0.8"/>
                    {/* Stems */}
                    <path d="M10 16 Q13 22 15 28" stroke="#5D8A5E" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M19 16 L19 28" stroke="#5D8A5E" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M28 16 Q25 22 23 28" stroke="#5D8A5E" strokeWidth="1.8" strokeLinecap="round"/>
                    {/* Leaves */}
                    <path d="M12 22 Q9 19 10 16" stroke="#5D8A5E" strokeWidth="1.5" fill="#5D8A5E" fillOpacity="0.45" strokeLinecap="round"/>
                    <path d="M26 22 Q29 19 28 16" stroke="#5D8A5E" strokeWidth="1.5" fill="#5D8A5E" fillOpacity="0.45" strokeLinecap="round"/>
                    {/* Ribbon wrap */}
                    <path d="M13.5 28 L24.5 28 L22.5 37 L15.5 37 Z" fill="white" fillOpacity="0.18" stroke="white" strokeWidth="0.8" strokeOpacity="0.4"/>
                    <line x1="19" y1="28" x2="19" y2="37" stroke="white" strokeWidth="0.8" strokeOpacity="0.3"/>
                  </svg>
                  {/* Count badge */}
                  <div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2"
                    style={{ background: "#111111", borderColor: "#FAF3EB" }}
                  >
                    <span className="text-[10px] font-black" style={{ color: "#FF69B4" }}>{ALL_BLOOMIES.length}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold italic text-xl mb-0.5"
                    style={{ fontFamily: "var(--font-playfair)", color: "#0A0A0A" }}
                  >
                    Your Bloomies
                  </p>
                  <p className="text-sm" style={{ color: "#aaa" }}>
                    {ALL_BLOOMIES.length} friends · Rose to see all
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,31,125,0.1)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </button>

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
                <p className="text-sm leading-relaxed" style={{ color: "#0A0A0A" }}>
                  <span className="font-bold">Bloomies</span> are your friends — no limit.{" "}
                  <span className="font-bold">Your Bouquet</span> is your inner circle, the 12 women closest to you.
                  Connect through Match first, then invite to your Bouquet.
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

          {/* ── Living Room: Pinned Objects ── */}
          {activeTab === 0 && (
            <div className="flex flex-col gap-5 mt-2">
              {/* Pinned Objects */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>✦ PINNED OBJECTS</p>
                    <p className="text-sm font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#0A0A0A" }}>Your apartment, your things.</p>
                  </div>
                  <button onClick={() => setShowObjectPicker(true)}
                    className="text-[9px] font-bold tracking-[0.12em] uppercase" style={{ color: "#FF1F7D" }}>
                    Edit
                  </button>
                </div>
                <div className="flex gap-4">
                  {PINNABLE_OBJECTS.filter(o => pinnedObjects.has(o.id)).slice(0, 5).map(obj => (
                    <div key={obj.id} className="flex flex-col items-center gap-1.5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ background: "#F5EEE8", boxShadow: "0 2px 10px rgba(255,105,180,0.1)" }}>
                        {obj.emoji}
                      </div>
                      <p className="text-[9px] font-medium" style={{ color: "#aaa" }}>{obj.label}</p>
                    </div>
                  ))}
                  {pinnedObjects.size < 5 && (
                    <button onClick={() => setShowObjectPicker(true)}
                      className="flex flex-col items-center gap-1.5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: "#F5F5F5", border: "1.5px dashed #E0D0C8" }}>
                        <span style={{ color: "#ccc", fontSize: "20px" }}>+</span>
                      </div>
                      <p className="text-[9px] font-medium" style={{ color: "#ddd" }}>Add</p>
                    </button>
                  )}
                </div>
              </div>

              {/* World Theme chip */}
              <div className="flex items-center justify-between rounded-2xl px-4 py-3.5"
                style={{ background: "#F5EEE8", border: "1.5px solid #F0E0D0" }}>
                <div>
                  <p className="text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: "#aaa" }}>YOUR WORLD</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span style={{ fontSize: "16px" }}>{WORLD_THEMES.find(w => w.id === worldTheme)?.emoji}</span>
                    <p className="font-bold text-sm" style={{ color: "#111" }}>{WORLD_THEMES.find(w => w.id === worldTheme)?.label}</p>
                  </div>
                </div>
                <button onClick={() => setShowWorldPicker(true)}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95"
                  style={{ background: "#FF1F7D", color: "white" }}>
                  Change
                </button>
              </div>
            </div>
          )}

          {/* ── World Picker Sheet ── */}
          {showWorldPicker && (
            <>
              <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                onClick={() => setShowWorldPicker(false)} />
              <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl p-6 pb-10"
                style={{ background: "#0A0A0A", boxShadow: "0 -16px 48px rgba(0,0,0,0.5)" }}>
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
                </div>
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ CHOOSE YOUR WORLD</p>
                <h3 className="font-bold italic mb-1" style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: "rgba(255,238,220,0.9)" }}>
                  Your world, your vibe.
                </h3>
                <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Recolors your Lounge, Mailbox, and Stationery. Never changes the layout.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {WORLD_THEMES.map(theme => (
                    <button key={theme.id}
                      onClick={() => { setWorldTheme(theme.id); setShowWorldPicker(false); }}
                      className="rounded-2xl p-3.5 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                      style={{
                        background: worldTheme === theme.id ? `${theme.accent}22` : "rgba(255,255,255,0.05)",
                        border: worldTheme === theme.id ? `2px solid ${theme.accent}` : "1.5px solid rgba(255,255,255,0.08)",
                        boxShadow: worldTheme === theme.id ? `0 4px 16px ${theme.accent}33` : "none",
                      }}>
                      <span style={{ fontSize: "24px" }}>{theme.emoji}</span>
                      <p className="text-xs font-bold" style={{ color: worldTheme === theme.id ? theme.accent : "rgba(255,255,255,0.65)" }}>{theme.label}</p>
                      <p className="text-[9px] text-center leading-snug" style={{ color: "rgba(255,255,255,0.28)" }}>{theme.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Object Picker Sheet ── */}
          {showObjectPicker && (
            <>
              <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                onClick={() => setShowObjectPicker(false)} />
              <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl p-6 pb-10"
                style={{ background: "#FFF8F4", boxShadow: "0 -16px 48px rgba(0,0,0,0.15)" }}>
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
                </div>
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-1" style={{ color: "#FF1F7D" }}>PINNED OBJECTS</p>
                <h3 className="font-bold italic mb-1" style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: "#111" }}>
                  Choose up to 5 objects.
                </h3>
                <p className="text-xs mb-5" style={{ color: "#bbb" }}>These live in your apartment.</p>
                <div className="grid grid-cols-5 gap-3 mb-5">
                  {PINNABLE_OBJECTS.map(obj => {
                    const isPinned = pinnedObjects.has(obj.id);
                    return (
                      <button key={obj.id}
                        onClick={() => setPinnedObjects(p => {
                          const n = new Set(p);
                          if (n.has(obj.id)) { n.delete(obj.id); }
                          else if (n.size < 5) { n.add(obj.id); }
                          return n;
                        })}
                        className="flex flex-col items-center gap-1 rounded-2xl p-2 transition-all active:scale-95"
                        style={{ background: isPinned ? "#FFF0F5" : "#F5F5F5", border: isPinned ? "1.5px solid #FF1F7D" : "1.5px solid transparent" }}>
                        <span style={{ fontSize: "24px" }}>{obj.emoji}</span>
                        <p className="text-[8px] font-medium" style={{ color: isPinned ? "#FF1F7D" : "#aaa" }}>{obj.label}</p>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setShowObjectPicker(false)}
                  className="w-full py-4 rounded-2xl font-bold text-sm"
                  style={{ background: "#FF1F7D", color: "white" }}>
                  Save ({pinnedObjects.size}/5)
                </button>
              </div>
            </>
          )}

          {/* ── Gallery Tab (was Memories) ── */}
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

              {/* My Moments grid — gallery wall framed feel */}
              <div>
                <p
                  className="text-base font-bold italic mb-3"
                  style={{ fontFamily: "var(--font-playfair)", color: headingColor }}
                >
                  My Moments
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {MEMORIES.map((mem, i) => (
                    <div
                      key={i}
                      className="rounded-2xl overflow-hidden"
                      style={{
                        background: mem.bg,
                        boxShadow: "0 2px 10px rgba(255,31,125,0.07)",
                        border: "1px solid rgba(255,200,130,0.15)",
                      }}
                    >
                      <div className="h-28 flex items-center justify-center text-5xl">{mem.emoji}</div>
                      <div className="p-3">
                        <p className="font-semibold text-sm leading-snug" style={{ color: "#0A0A0A" }}>{mem.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{mem.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Her Story — Scrapbook Section ── */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-1" style={{ color: "rgba(255,165,50,0.6)" }}>✦ HER STORY</p>
                    <p className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: headingColor }}>Your scrapbook.</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95"
                    style={{ background: "rgba(255,31,125,0.15)", color: "#FF69B4", border: "1px solid rgba(255,31,125,0.2)" }}>
                    + Add
                  </button>
                </div>

                {/* Polaroid stack */}
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5" style={{ scrollbarWidth: "none" }}>
                  {[
                    { emoji: "🌸", caption: "Brooklyn brunch with the girls", date: "Apr 2026", rotate: "-3deg", color: "#FFF5F8" },
                    { emoji: "🥂", caption: "Rooftop after the gallery show", date: "Mar 2026", rotate: "2.5deg", color: "#FFF8EC" },
                    { emoji: "🌙", caption: "Midnight walk through SoHo", date: "Feb 2026", rotate: "-1.5deg", color: "#F5F0FF" },
                    { emoji: "☕", caption: "Solo Saturday at La Mercerie", date: "Jan 2026", rotate: "3deg", color: "#FFF5F8" },
                  ].map((p, i) => (
                    <div key={i} className="flex-shrink-0 transition-transform active:scale-[0.97]"
                      style={{ transform: `rotate(${p.rotate})`, transformOrigin: "center top" }}>
                      <div className="p-3 pb-8 shadow-2xl"
                        style={{ background: p.color, borderRadius: "4px", width: "148px", boxShadow: "0 8px 28px rgba(0,0,0,0.35)" }}>
                        <div className="w-full h-28 flex items-center justify-center rounded-sm mb-1"
                          style={{ background: "rgba(0,0,0,0.06)" }}>
                          <span style={{ fontSize: "48px", opacity: 0.7 }}>{p.emoji}</span>
                        </div>
                        <div className="pt-2 px-1">
                          <p className="text-xs leading-snug text-center"
                            style={{ fontFamily: "var(--font-caveat)", fontSize: "13px", color: "#444", lineHeight: 1.4 }}>
                            {p.caption}
                          </p>
                          <p className="text-[9px] text-center mt-1" style={{ color: "#bbb" }}>{p.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add new polaroid */}
                  <div className="flex-shrink-0" style={{ transform: "rotate(1deg)" }}>
                    <button className="p-3 pb-8 transition-all active:scale-95"
                      style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px", width: "148px", border: "1.5px dashed rgba(255,255,255,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                      <div className="w-full h-28 flex items-center justify-center rounded-sm mb-1"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1.5px dashed rgba(255,255,255,0.1)" }}>
                        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "32px" }}>+</span>
                      </div>
                      <p className="text-xs text-center pt-2"
                        style={{ fontFamily: "var(--font-caveat)", fontSize: "13px", color: "rgba(255,255,255,0.22)" }}>
                        Add a memory
                      </p>
                    </button>
                  </div>
                </div>

                {/* Notes area */}
                <div className="rounded-2xl p-5 mt-2"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,200,130,0.1)" }}>
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(255,165,50,0.5)" }}>MISC NOTES</p>
                  <div className="flex flex-col gap-2">
                    {[
                      "Tried the clay class — life changed. Going back with Zara.",
                      "Morocco trip: 11 women. Changed how I see friendship.",
                      "The smoked fish platter at Sadelle's > everything.",
                    ].map((note, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span style={{ color: "#FF69B4", fontSize: "10px", marginTop: "2px" }}>✦</span>
                        <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-caveat)", fontSize: "14px", color: "rgba(255,230,200,0.65)", lineHeight: 1.55 }}>{note}</p>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                    style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                    + Write something
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Door Tab (was My Link) ── */}
          {activeTab === 2 && (
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <p
                  className="text-base font-bold italic mb-1"
                  style={{ fontFamily: "var(--font-playfair)", color: "#0A0A0A" }}
                >
                  My BloomBay Link
                </p>
                <p className="text-xs text-gray-400 mb-4">Share your profile. Invite women you trust.</p>
                <div
                  className="rounded-2xl px-4 py-3 flex items-center justify-between mb-4"
                  style={{ background: "#FFF1EC" }}
                >
                  <p className="text-sm font-bold" style={{ color: "#0A0A0A" }}>
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

          {/* ── Mirror Tab (was Profile) ── */}
          {activeTab === 3 && (
            <div className="flex flex-col gap-5">
              <div className="bg-white rounded-3xl p-6 flex flex-col items-center text-center" style={{ boxShadow: "0 2px 16px rgba(255,31,125,0.08)" }}>
                {/* Large styled initial circle */}
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
                  style={{ fontFamily: "var(--font-playfair)", color: "#0A0A0A" }}
                >
                  {displayName}
                </h2>
                <p className="text-sm text-gray-400 mb-2">{displayNeighborhood} · NYC</p>
                {/* Founding Mother badge */}
                <div className="flex flex-col items-center gap-1.5 mb-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ background: "linear-gradient(135deg, #1A1208 0%, #2D1E08 100%)", border: "1px solid rgba(212,168,83,0.45)" }}>
                    <span style={{ color: "#D4A853", fontSize: "9px" }}>✦</span>
                    <span className="text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: "#D4A853" }}>Founding Mother</span>
                    <span className="text-[10px] font-bold" style={{ color: "rgba(212,168,83,0.55)" }}>#47</span>
                  </div>
                  <p className="text-[9px] italic" style={{ color: "#ccc", fontFamily: "var(--font-instrument)" }}>
                    One of the original 100
                  </p>
                </div>
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
                <p className="font-bold text-sm mb-2" style={{ color: "#0A0A0A" }}>About {displayName.split(" ")[0]}</p>
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

              {/* ── Witness Stack ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>✦ WITNESS STACK</p>
                    <p className="text-sm font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#0A0A0A" }}>What other women see.</p>
                  </div>
                  <span className="text-[9px] font-medium px-2.5 py-1 rounded-full"
                    style={{ background: "#FFF0F5", color: "#FF1F7D" }}>{WITNESS_ENTRIES.length} notes</span>
                </div>
                {/* Stacked cards with slight rotation */}
                <div className="relative" style={{ height: `${Math.min(WITNESS_ENTRIES.length, 3) * 16 + 100}px` }}>
                  {WITNESS_ENTRIES.slice(0, 3).map((w, i) => (
                    <div key={i} className="absolute inset-x-0 rounded-2xl p-4"
                      style={{
                        background: "white",
                        boxShadow: "0 4px 16px rgba(255,105,180,0.08)",
                        top: `${i * 14}px`,
                        zIndex: WITNESS_ENTRIES.length - i,
                        transform: `rotate(${[-1.5, 1, -0.5][i]}deg)`,
                        border: "1px solid #FFE8F0",
                      }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: w.color }}>
                          {w.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm italic leading-relaxed"
                            style={{ fontFamily: "var(--font-playfair)", color: "#333", lineHeight: 1.5 }}>
                            &ldquo;{w.text}&rdquo;
                          </p>
                          <p className="text-[10px] mt-1" style={{ color: "#bbb" }}>{w.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {WITNESS_ENTRIES.length > 3 && (
                  <button className="mt-3 w-full py-2.5 text-center text-xs font-bold transition-all active:scale-95 rounded-2xl"
                    style={{ background: "#FFF0F5", color: "#FF1F7D" }}>
                    See all {WITNESS_ENTRIES.length} observations →
                  </button>
                )}
              </div>

              {/* ── YOUR PORTALS ── */}
              <div className="rounded-3xl overflow-hidden" style={{ background: "#111111", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
                <div className="px-4 pt-4 pb-2 relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(212,168,83,0.12) 0%, transparent 55%)" }} />
                  <p className="text-[9px] font-bold tracking-[0.22em] uppercase relative" style={{ color: "rgba(212,168,83,0.6)" }}>
                    ✦ YOUR PORTALS
                  </p>
                </div>

                {/* Club Mama Portal */}
                <button onClick={() => showToast("Club Mama Portal — coming soon")}
                  className="w-full px-4 py-3.5 flex items-center gap-3 text-left transition-all active:bg-white/5"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ background: "rgba(255,31,125,0.12)", border: "1px solid rgba(255,31,125,0.2)" }}>
                    🏠
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold" style={{ color: "rgba(255,238,220,0.9)" }}>Club Mama Portal</p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Create & manage your club</p>
                  </div>
                  <span className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }}>Activate</span>
                </button>

                {/* Bloom Curator Portal */}
                <button onClick={() => showToast("Curator applications open soon")}
                  className="w-full px-4 py-3.5 flex items-center gap-3 text-left transition-all active:bg-white/5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    🔒
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Curator Portal</p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Bloom Curators only · Apply</p>
                  </div>
                  <span className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>Apply</span>
                </button>

                {/* Founding Mother Portal - active since FM */}
                <button onClick={() => showToast("Founding Mother access — always on")}
                  className="w-full px-4 py-3.5 flex items-center gap-3 text-left transition-all active:bg-white/5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ background: "rgba(212,168,83,0.12)", border: "1px solid rgba(212,168,83,0.3)" }}>
                    ✦
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold" style={{ color: "rgba(212,168,83,0.9)" }}>Founding Mother Access</p>
                    <p className="text-[10px]" style={{ color: "rgba(212,168,83,0.4)" }}>Secret events · FM messages · #47</p>
                  </div>
                  <span className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(212,168,83,0.15)", color: "#D4A853" }}>Active</span>
                </button>
              </div>

              {/* ── Club Passport ── */}
              <div className="rounded-3xl overflow-hidden" style={{ background: "#0A0804", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", border: "1px solid rgba(212,168,83,0.15)" }}>
                <div className="px-5 pt-5 pb-4 relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(212,168,83,0.15) 0%, transparent 50%)" }} />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(212,168,83,0.55)" }}>✦ CLUB PASSPORT</p>
                      <h3 className="font-black italic leading-none mb-1" style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: "rgba(255,238,220,0.9)" }}>
                        {displayName.split(" ")[0]}&apos;s Clubs
                      </h3>
                      <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>3 active memberships</p>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(212,168,83,0.12)", border: "1px solid rgba(212,168,83,0.25)" }}>
                      <span style={{ fontSize: "18px" }}>🎫</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5 flex flex-col gap-3">
                  {[
                    { name: "Art & Wine Society", color: "#FF69B4", emoji: "🍷", role: "Member", since: "Jan 2026" },
                    { name: "Dinner Society NYC", color: "#FF1F7D", emoji: "🥂", role: "Member", since: "Feb 2026" },
                    { name: "Sunday Walk Circle", color: "#83C5A0", emoji: "🌿", role: "Founding Member", since: "Mar 2026" },
                  ].map((club, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl px-4 py-3"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                        style={{ background: `${club.color}22` }}>
                        {club.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: "rgba(255,238,220,0.85)" }}>{club.name}</p>
                        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{club.role} · Since {club.since}</p>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-1 rounded-full flex-shrink-0"
                        style={{ background: `${club.color}22`, color: club.color }}>✓</span>
                    </div>
                  ))}
                  <Link href="/member/clubs"
                    className="w-full py-3 text-center text-xs font-bold rounded-2xl transition-all active:scale-95 block"
                    style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                    View All Clubs →
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <Link
                  href="/member/notifications"
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors block"
                  style={{ borderBottom: "1px solid #F5F5F5" }}
                >
                  <p className="flex-1 text-sm font-semibold" style={{ color: "#0A0A0A" }}>Pings</p>
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
                    <p className="flex-1 text-sm font-semibold" style={{ color: "#0A0A0A" }}>{label}</p>
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
      </div>{/* md:max-w wrapper */}

      {/* Bloomies list sheet */}
      {showBloomiesList && (
        <BloomiesListSheet
          onClose={() => setShowBloomiesList(false)}
          onSelectBloomie={(b) => setSelectedBloomie(b)}
        />
      )}

      {/* Bloomie profile sheet */}
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
