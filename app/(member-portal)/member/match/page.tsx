"use client";

import { useState, useEffect } from "react";
import { getTimeOfDay, type TimeOfDay } from "@/app/components/portal/time-wrapper";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const BLOOM_REQUESTS = [
  { id: 1, initial: "A", name: "Aminah C.", neighborhood: "Williamsburg", color: "#D4155C", text: "Looking for a brunch friend for Sunday mornings. Love long tables and good conversation." },
  { id: 2, initial: "P", name: "Priya R.", neighborhood: "Greenpoint", color: "#9E1A46", text: "Need a gym accountability partner. Any gym, early mornings. I just need someone to drag me." },
  { id: 3, initial: "Z", name: "Zara M.", neighborhood: "Bed-Stuy", color: "#7A2C8C", text: "First month in NYC. Moved from Toronto. Looking for my people in Brooklyn." },
  { id: 4, initial: "N", name: "Naomi B.", neighborhood: "Brooklyn Heights", color: "#D4155C", text: "Looking for a female roommate for a 2BR. $1,400/mo, available October." },
  { id: 5, initial: "T", name: "Temi A.", neighborhood: "Crown Heights", color: "#9E1A46", text: "Anyone else who does early morning walks? Prospect Park, before the crowds." },
];

const YANDE_INTROS = [
  { id: 1, initial: "S", name: "Sofia K.", neighborhood: "Greenpoint", color: "#E05C9A", note: "You and Sofia both attend African Girls Club and have been to the same 3 events. Same energy, same taste.", vibe: "Wellness · Art · Long walks", score: 94 },
  { id: 2, initial: "K", name: "Kezia N.", neighborhood: "Chelsea", color: "#D4155C", note: "Kezia moved from Lagos 3 weeks ago. You both love the same corners of Bed-Stuy and share a similar vibe.", vibe: "Culture · Food · Nightlife", score: 88 },
  { id: 3, initial: "J", name: "Jade O.", neighborhood: "Crown Heights", color: "#9E1A46", note: "You've both attended Dinner Society three times. Jade hosted two of them. She'd love a regular table partner.", vibe: "Restaurants · Great tables · Art", score: 91 },
];

const CIRCLES = [
  { id: 1, name: "Sunday Walk Circle", women: 8, cadence: "Weekly · Sunday mornings", neighborhood: "Prospect Park", emoji: "🌿" },
  { id: 2, name: "Museum Girls", women: 5, cadence: "Monthly · rotating museums", neighborhood: "All NYC", emoji: "🖼️" },
  { id: 3, name: "Women Founders Accountability", women: 12, cadence: "Bi-weekly check-ins", neighborhood: "Virtual + IRL", emoji: "🚀" },
  { id: 4, name: "Matcha Thursdays", women: 6, cadence: "Every Thursday 9AM", neighborhood: "Williamsburg", emoji: "🍵" },
];

const TRAVEL = [
  { id: 1, dest: "Morocco", month: "October 2025", women: 7, emoji: "🇲🇦", note: "Marrakech + Atlas Mountains · Casual interest" },
  { id: 2, dest: "Paris", month: "Spring 2026", women: 4, emoji: "🇫🇷", note: "Long weekend · museums · markets" },
  { id: 3, dest: "Ghana", month: "December 2025", women: 3, emoji: "🇬🇭", note: "AFROFUTURE festival + Accra" },
];

const NEW_IN_TOWN = [
  { id: 1, initial: "A", name: "Amara O.", from: "Lagos, Nigeria", weeks: "3 weeks ago", neighborhood: "Bed-Stuy", color: "#D4155C" },
  { id: 2, initial: "Y", name: "Yuki T.", from: "Tokyo, Japan", weeks: "2 months ago", neighborhood: "Williamsburg", color: "#9E1A46" },
  { id: 3, initial: "B", name: "Blessing A.", from: "London, UK", weeks: "1 month ago", neighborhood: "Harlem", color: "#7A2C8C" },
  { id: 4, initial: "M", name: "Mia S.", from: "Atlanta, GA", weeks: "5 weeks ago", neighborhood: "Crown Heights", color: "#D4155C" },
];

const GIRL_MATES = [
  { id: 1, initial: "S", name: "Sara L.", color: "#D4155C", type: "looking", text: "Need girl for 2BR in Williamsburg. $1,400/mo. October move-in. Female-only preferred.", neighborhood: "Williamsburg" },
  { id: 2, initial: "K", name: "Kemi A.", color: "#9E1A46", type: "offering", text: "Room in Crown Heights townhouse. $1,250/mo all-in. Existing female-only apartment of 3.", neighborhood: "Crown Heights" },
  { id: 3, initial: "T", name: "Taiwo B.", color: "#7A2C8C", type: "looking", text: "Looking for studio or 1BR roommate split in Bed-Stuy or Bushwick. Budget $1,100.", neighborhood: "Bed-Stuy" },
];

const FOUNDERS = [
  { id: 1, initial: "N", name: "Naomi B.", color: "#D4155C", neighborhood: "West Village", seeking: "Cofounder", building: "Fintech · consumer payments for women", note: "Product side · pre-seed · looking for technical cofounder" },
  { id: 2, initial: "T", name: "Temi A.", color: "#9E1A46", neighborhood: "Greenpoint", seeking: "Accountability Partner", building: "Community platform · early stage", note: "Building solo, need someone to check in weekly" },
  { id: 3, initial: "S", name: "Sofia K.", color: "#7A2C8C", neighborhood: "Brooklyn", seeking: "Design Cofounder", building: "Women's social app", note: "Ex-Google PM, need a product designer who thinks in systems" },
];

// ── Desktop tab types ─────────────────────────────────────────────────────────

const DESKTOP_TABS = ["Introductions", "Requests", "Circles", "Travel", "New In Town", "GirlMates", "Founders"] as const;
type DesktopTab = typeof DESKTOP_TABS[number];

// ── Sub-components ────────────────────────────────────────────────────────────

function Avatar({ initial, color, size = 44 }: { initial: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color} 0%, ${color}BB 100%)`,
        fontSize: size / 2.8,
        boxShadow: `0 3px 10px ${color}44`,
      }}
    >
      {initial}
    </div>
  );
}

function BloomRequestCard({
  req,
  cardBg,
  borderCol,
  headingColor,
  textMuted,
}: {
  req: typeof BLOOM_REQUESTS[0];
  cardBg: string;
  borderCol: string;
  headingColor: string;
  textMuted: string;
}) {
  const [sent, setSent] = useState(false);
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: cardBg, border: `1px solid ${borderCol}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start gap-3">
        <Avatar initial={req.initial} color={req.color} size={40} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-tight" style={{ color: headingColor }}>{req.name}</p>
          <p className="text-[11px] mt-0.5" style={{ color: textMuted }}>{req.neighborhood}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: textMuted, paddingLeft: "52px", marginTop: "-6px" }}>
        {req.text}
      </p>
      <div style={{ paddingLeft: "52px" }}>
        <button
          onClick={() => setSent(true)}
          className="px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
          style={
            sent
              ? { background: `${req.color}18`, color: req.color }
              : { background: "var(--bb-pink)", color: "white", boxShadow: "0 3px 10px rgba(212,21,92,0.28)" }
          }
        >
          {sent ? "Sent ✓" : "Connect →"}
        </button>
      </div>
    </div>
  );
}

function YandeIntroCard({
  intro,
  cardBg,
  borderCol,
  headingColor,
  textMuted,
}: {
  intro: typeof YANDE_INTROS[0];
  cardBg: string;
  borderCol: string;
  headingColor: string;
  textMuted: string;
}) {
  const [sent, setSent] = useState(false);
  const [bloomed, setBloomed] = useState(false);

  function handleBloom() {
    setSent(true);
    setTimeout(() => setBloomed(true), 600);
  }

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: cardBg, border: `1px solid ${borderCol}`, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
    >
      {/* Top row: avatar + name + compatibility score */}
      <div className="flex items-center gap-3">
        <Avatar initial={intro.initial} color={intro.color} size={44} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: headingColor }}>{intro.name}</p>
          <p className="text-[11px] mt-0.5" style={{ color: textMuted }}>{intro.neighborhood} · {intro.vibe}</p>
        </div>
        {/* Compatibility score ring */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: `conic-gradient(${intro.color} 0% ${intro.score}%, rgba(0,0,0,0.07) ${intro.score}% 100%)`, padding: "3px" }}>
            <div className="w-full h-full rounded-full flex items-center justify-center"
              style={{ background: cardBg }}>
              <span className="text-[11px] font-black" style={{ color: intro.color }}>{intro.score}%</span>
            </div>
          </div>
          <p className="text-[8px] font-bold tracking-widest mt-0.5" style={{ color: textMuted }}>MATCH</p>
        </div>
      </div>
      {/* Yande note */}
      <div className="rounded-xl px-3 py-2.5" style={{ background: "rgba(212,21,92,0.07)", borderLeft: "3px solid var(--bb-pink)" }}>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "var(--bb-pink)" }}>YANDE SAYS</p>
        <p className="text-xs leading-relaxed italic" style={{ color: textMuted }}>{intro.note}</p>
      </div>
      {/* Bloom button */}
      <button
        onClick={handleBloom}
        disabled={sent}
        className="px-4 py-2.5 rounded-full text-xs font-bold self-start transition-all active:scale-95 flex items-center gap-1.5"
        style={
          bloomed
            ? { background: `${intro.color}18`, color: intro.color }
            : sent
            ? { background: "rgba(0,0,0,0.05)", color: textMuted }
            : { background: "var(--bb-pink)", color: "white", boxShadow: "0 3px 12px rgba(212,21,92,0.3)" }
        }
      >
        {bloomed ? (
          <><span>🌸</span> Bloom request sent</>
        ) : sent ? (
          "Sending…"
        ) : (
          <>Send Bloom Request →</>
        )}
      </button>
    </div>
  );
}

function CircleCard({
  circle,
  cardBg,
  borderCol,
  headingColor,
  textMuted,
}: {
  circle: typeof CIRCLES[0];
  cardBg: string;
  borderCol: string;
  headingColor: string;
  textMuted: string;
}) {
  const [joined, setJoined] = useState(false);
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2.5"
      style={{ background: cardBg, border: `1px solid ${borderCol}`, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{circle.emoji}</span>
        <p className="font-bold text-sm leading-tight flex-1" style={{ color: headingColor }}>{circle.name}</p>
      </div>
      <p className="text-[11px]" style={{ color: textMuted }}>{circle.cadence}</p>
      <p className="text-[11px]" style={{ color: textMuted }}>{circle.neighborhood}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[11px] font-semibold" style={{ color: "var(--bb-pink)" }}>
          {circle.women} women
        </span>
        <button
          onClick={() => setJoined(true)}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
          style={
            joined
              ? { background: "rgba(212,21,92,0.12)", color: "var(--bb-pink)" }
              : { background: "#111", color: "white" }
          }
        >
          {joined ? "Joined ✓" : "Join →"}
        </button>
      </div>
    </div>
  );
}

function TravelCard({
  trip,
  cardBg,
  borderCol,
  headingColor,
  textMuted,
}: {
  trip: typeof TRAVEL[0];
  cardBg: string;
  borderCol: string;
  headingColor: string;
  textMuted: string;
}) {
  const [interested, setInterested] = useState(false);
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{ background: cardBg, border: `1px solid ${borderCol}`, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", minWidth: "180px" }}
    >
      <span className="text-3xl">{trip.emoji}</span>
      <p className="font-bold text-sm" style={{ color: headingColor }}>{trip.dest}</p>
      <p className="text-[11px] font-semibold" style={{ color: "var(--bb-pink)" }}>{trip.month}</p>
      <p className="text-[11px] leading-snug" style={{ color: textMuted }}>{trip.note}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[11px]" style={{ color: textMuted }}>{trip.women} women</span>
        <button
          onClick={() => setInterested(true)}
          className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95"
          style={
            interested
              ? { background: "rgba(212,21,92,0.12)", color: "var(--bb-pink)" }
              : { background: "var(--bb-pink)", color: "white" }
          }
        >
          {interested ? "Interested ✓" : "I'm interested"}
        </button>
      </div>
    </div>
  );
}

function NewInTownCard({
  person,
  cardBg,
  borderCol,
  headingColor,
  textMuted,
}: {
  person: typeof NEW_IN_TOWN[0];
  cardBg: string;
  borderCol: string;
  headingColor: string;
  textMuted: string;
}) {
  const [said, setSaid] = useState(false);
  return (
    <div
      className="rounded-2xl p-3.5 flex flex-col gap-2.5"
      style={{ background: cardBg, border: `1px solid ${borderCol}`, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", minWidth: "180px" }}
    >
      <Avatar initial={person.initial} color={person.color} size={40} />
      <div>
        <p className="font-bold text-sm" style={{ color: headingColor }}>{person.name}</p>
        <p className="text-[11px] mt-0.5" style={{ color: "var(--bb-pink)" }}>From {person.from}</p>
        <p className="text-[10px] mt-0.5" style={{ color: textMuted }}>{person.neighborhood} · {person.weeks}</p>
      </div>
      <button
        onClick={() => setSaid(true)}
        className="px-3.5 py-1.5 rounded-full text-xs font-bold self-start transition-all active:scale-95"
        style={
          said
            ? { background: `${person.color}18`, color: person.color }
            : { background: person.color, color: "white" }
        }
      >
        {said ? "Sent ✓" : "Say hello →"}
      </button>
    </div>
  );
}

function GirlMateCard({
  gm,
  cardBg,
  borderCol,
  headingColor,
  textMuted,
}: {
  gm: typeof GIRL_MATES[0];
  cardBg: string;
  borderCol: string;
  headingColor: string;
  textMuted: string;
}) {
  const [sent, setSent] = useState(false);
  const isLooking = gm.type === "looking";
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: cardBg, border: `1px solid ${borderCol}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start gap-3">
        <Avatar initial={gm.initial} color={gm.color} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm" style={{ color: headingColor }}>{gm.name}</p>
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={
                isLooking
                  ? { background: "rgba(212,21,92,0.12)", color: "var(--bb-pink)" }
                  : { background: "rgba(74,154,74,0.12)", color: "#3a8c3a" }
              }
            >
              {isLooking ? "Looking" : "Room available"}
            </span>
          </div>
          <p className="text-[11px] mt-0.5" style={{ color: textMuted }}>{gm.neighborhood}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: textMuted }}>{gm.text}</p>
      <button
        onClick={() => setSent(true)}
        className="px-4 py-2 rounded-full text-xs font-bold self-start transition-all active:scale-95"
        style={
          sent
            ? { background: `${gm.color}18`, color: gm.color }
            : { background: "var(--bb-pink)", color: "white", boxShadow: "0 3px 10px rgba(212,21,92,0.25)" }
        }
      >
        {sent ? "Sent ✓" : "Connect →"}
      </button>
    </div>
  );
}

function FounderCard({
  founder,
  cardBg,
  borderCol,
  headingColor,
  textMuted,
}: {
  founder: typeof FOUNDERS[0];
  cardBg: string;
  borderCol: string;
  headingColor: string;
  textMuted: string;
}) {
  const [sent, setSent] = useState(false);
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: cardBg, border: `1px solid ${borderCol}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start gap-3">
        <Avatar initial={founder.initial} color={founder.color} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm" style={{ color: headingColor }}>{founder.name}</p>
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${founder.color}18`, color: founder.color }}
            >
              {founder.seeking}
            </span>
          </div>
          <p className="text-[11px] mt-0.5" style={{ color: textMuted }}>{founder.neighborhood}</p>
        </div>
      </div>
      <p className="text-xs font-semibold" style={{ color: headingColor }}>{founder.building}</p>
      <p className="text-[11px] leading-snug italic" style={{ color: textMuted }}>{founder.note}</p>
      <button
        onClick={() => setSent(true)}
        className="px-4 py-2 rounded-full text-xs font-bold self-start transition-all active:scale-95"
        style={
          sent
            ? { background: `${founder.color}18`, color: founder.color }
            : { background: founder.color, color: "white" }
        }
      >
        {sent ? "Sent ✓" : "Connect →"}
      </button>
    </div>
  );
}

// ── Section header helper ─────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "var(--bb-pink)" }}>
      {children}
    </p>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ConnectPage() {
  const [tod, setTod] = useState<TimeOfDay>("morning");
  const [activeTab, setActiveTab] = useState<DesktopTab>("Introductions");

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
  }, []);

  const isNight = tod === "evening" || tod === "night";
  const isEvening = tod === "evening";
  const headingColor = isNight ? "rgba(240,232,255,0.92)" : "#111111";
  const textMuted = isNight ? "rgba(200,190,225,0.52)" : "#888";
  const cardBg = isNight ? (isEvening ? "#1E1830" : "#191428") : "white";
  const surfaceBg = isNight ? (isEvening ? "#1A1428" : "#151020") : "#FFF5F8";
  const borderCol = isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  const sharedCardProps = { cardBg, borderCol, headingColor, textMuted };

  return (
    <div style={{ background: surfaceBg }}>
      {/* ── MOBILE ──────────────────────────────────────────────────────────── */}
      <div className="md:hidden min-h-screen pb-24">
        {/* Header */}
        <div className="px-5 pt-14 pb-6">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--bb-pink)" }}>
            CONNECT
          </p>
          <h1
            className="font-bold italic leading-none mb-2"
            style={{
              color: headingColor,
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(42px, 12vw, 64px)",
            }}
          >
            Who should I meet?
          </h1>
        </div>

        {/* 1. BLOOM REQUESTS — horizontal scroll */}
        <div className="mb-8">
          <div className="px-5">
            <SectionLabel>BLOOM REQUESTS</SectionLabel>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-2" style={{ scrollbarWidth: "none" }}>
            {BLOOM_REQUESTS.map((req) => (
              <div key={req.id} style={{ minWidth: "260px", maxWidth: "280px" }}>
                <BloomRequestCard req={req} {...sharedCardProps} />
              </div>
            ))}
          </div>
        </div>

        {/* 2. YANDE CONNECTS YOU */}
        <div className="px-5 mb-8">
          <SectionLabel>YANDE CONNECTS YOU</SectionLabel>
          <div className="flex flex-col gap-3">
            {YANDE_INTROS.map((intro) => (
              <YandeIntroCard key={intro.id} intro={intro} {...sharedCardProps} />
            ))}
          </div>
        </div>

        {/* 3. CIRCLES — 2-col grid */}
        <div className="px-5 mb-8">
          <SectionLabel>CIRCLES</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {CIRCLES.map((circle) => (
              <CircleCard key={circle.id} circle={circle} {...sharedCardProps} />
            ))}
          </div>
        </div>

        {/* 4. TRAVEL — horizontal scroll */}
        <div className="mb-8">
          <div className="px-5">
            <SectionLabel>TRAVEL</SectionLabel>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-2" style={{ scrollbarWidth: "none" }}>
            {TRAVEL.map((trip) => (
              <TravelCard key={trip.id} trip={trip} {...sharedCardProps} />
            ))}
          </div>
        </div>

        {/* 5. NEW IN TOWN — horizontal scroll */}
        <div className="mb-8">
          <div className="px-5">
            <SectionLabel>NEW IN TOWN</SectionLabel>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-2" style={{ scrollbarWidth: "none" }}>
            {NEW_IN_TOWN.map((person) => (
              <NewInTownCard key={person.id} person={person} {...sharedCardProps} />
            ))}
          </div>
        </div>

        {/* 6. GIRLMATES — 2-col grid */}
        <div className="px-5 mb-8">
          <SectionLabel>GIRLMATES</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {GIRL_MATES.map((gm) => (
              <GirlMateCard key={gm.id} gm={gm} {...sharedCardProps} />
            ))}
          </div>
        </div>

        {/* 7. FOUNDER CIRCLE — 2-col grid */}
        <div className="px-5 mb-8">
          <SectionLabel>FOUNDER CIRCLE</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {FOUNDERS.map((founder) => (
              <FounderCard key={founder.id} founder={founder} {...sharedCardProps} />
            ))}
          </div>
        </div>
      </div>
      {/* end mobile */}

      {/* ── DESKTOP ──────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:flex-col" style={{ height: "100vh" }}>

        {/* Top bar */}
        <div
          className="flex items-center gap-4 px-6 flex-shrink-0 border-b"
          style={{ height: "64px", borderColor: borderCol, background: surfaceBg }}
        >
          {/* Left: label + heading */}
          <div className="flex items-baseline gap-2 flex-shrink-0">
            <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>
              CONNECT
            </span>
            <h1
              className="font-bold italic text-xl leading-none"
              style={{ color: headingColor, fontFamily: "var(--font-playfair)" }}
            >
              Who should I meet?
            </h1>
          </div>

          {/* Divider */}
          <div className="w-px self-stretch my-3 flex-shrink-0" style={{ background: borderCol }} />

          {/* Section tabs */}
          <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {DESKTOP_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex-shrink-0"
                style={
                  activeTab === tab
                    ? { background: "#111", color: "white" }
                    : { background: isNight ? "rgba(255,255,255,0.06)" : "white", color: isNight ? "rgba(255,255,255,0.55)" : "#555", border: `1px solid ${borderCol}` }
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right: online count + post button */}
          <div className="flex items-center gap-3 flex-shrink-0" style={{ marginLeft: "auto", marginRight: "256px" }}>
            <span className="text-[11px] font-semibold" style={{ color: textMuted }}>
              <span style={{ color: "#4caf50" }}>●</span> 24 women online
            </span>
            <button
              className="px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
              style={{ background: "var(--bb-pink)", color: "white", boxShadow: "0 3px 10px rgba(212,21,92,0.28)" }}
            >
              Post a request +
            </button>
          </div>
        </div>

        {/* 3-panel body */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT panel — Yande Introductions + New In Town */}
          <div
            className="overflow-y-auto py-5 px-4 flex-shrink-0 flex flex-col gap-6"
            style={{ width: "240px", borderRight: `1px solid ${borderCol}` }}
          >
            {/* Yande Introductions */}
            <div>
              <SectionLabel>YANDE INTRODUCTIONS</SectionLabel>
              <div className="flex flex-col gap-3">
                {YANDE_INTROS.map((intro) => (
                  <YandeIntroCard key={intro.id} intro={intro} {...sharedCardProps} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: borderCol }} />

            {/* New In Town */}
            <div>
              <SectionLabel>NEW IN TOWN</SectionLabel>
              <div className="flex flex-col gap-3">
                {NEW_IN_TOWN.slice(0, 4).map((person) => (
                  <NewInTownCard key={person.id} person={person} {...sharedCardProps} />
                ))}
              </div>
            </div>
          </div>

          {/* CENTER panel */}
          <div className="flex-1 overflow-y-auto p-6">

            {activeTab === "Introductions" && (
              <div className="flex flex-col gap-8">
                {/* Yande Intros full view */}
                <div>
                  <SectionLabel>YANDE INTRODUCTIONS</SectionLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {YANDE_INTROS.map((intro) => (
                      <YandeIntroCard key={intro.id} intro={intro} {...sharedCardProps} />
                    ))}
                  </div>
                </div>
                {/* Bloom Requests below */}
                <div>
                  <SectionLabel>BLOOM REQUESTS</SectionLabel>
                  <div className="grid grid-cols-2 gap-3 max-w-2xl">
                    {BLOOM_REQUESTS.map((req) => (
                      <BloomRequestCard key={req.id} req={req} {...sharedCardProps} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Requests" && (
              <div>
                <SectionLabel>BLOOM REQUESTS</SectionLabel>
                <div className="grid grid-cols-2 gap-3 max-w-2xl">
                  {BLOOM_REQUESTS.map((req) => (
                    <BloomRequestCard key={req.id} req={req} {...sharedCardProps} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Circles" && (
              <div>
                <SectionLabel>CIRCLES</SectionLabel>
                <div className="grid grid-cols-2 gap-3 max-w-2xl">
                  {CIRCLES.map((circle) => (
                    <CircleCard key={circle.id} circle={circle} {...sharedCardProps} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Travel" && (
              <div>
                <SectionLabel>TRAVEL</SectionLabel>
                <div className="grid grid-cols-3 gap-3 max-w-2xl">
                  {TRAVEL.map((trip) => (
                    <TravelCard key={trip.id} trip={trip} {...sharedCardProps} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "New In Town" && (
              <div>
                <SectionLabel>NEW IN TOWN</SectionLabel>
                <div className="grid grid-cols-3 gap-3 max-w-2xl">
                  {NEW_IN_TOWN.map((person) => (
                    <NewInTownCard key={person.id} person={person} {...sharedCardProps} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "GirlMates" && (
              <div>
                <SectionLabel>GIRLMATES</SectionLabel>
                <div className="grid grid-cols-2 gap-4">
                  {GIRL_MATES.map((gm) => (
                    <GirlMateCard key={gm.id} gm={gm} {...sharedCardProps} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Founders" && (
              <div>
                <SectionLabel>FOUNDER CIRCLE</SectionLabel>
                <div className="grid grid-cols-2 gap-4">
                  {FOUNDERS.map((founder) => (
                    <FounderCard key={founder.id} founder={founder} {...sharedCardProps} />
                  ))}
                </div>
              </div>
            )}

          </div>
          {/* end CENTER */}

          {/* RIGHT panel — Circles + Travel + Founder Circle */}
          <div
            className="overflow-y-auto py-5 px-4 flex-shrink-0 flex flex-col gap-6"
            style={{ width: "260px", borderLeft: `1px solid ${borderCol}` }}
          >
            {/* Circles */}
            <div>
              <SectionLabel>CIRCLES</SectionLabel>
              <div className="flex flex-col gap-2">
                {CIRCLES.slice(0, 3).map((circle) => (
                  <CircleCard key={circle.id} circle={circle} {...sharedCardProps} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: borderCol }} />

            {/* Travel — small flag cards */}
            <div>
              <SectionLabel>TRAVEL</SectionLabel>
              <div className="flex flex-col gap-2">
                {TRAVEL.map((trip) => (
                  <div
                    key={trip.id}
                    className="rounded-xl p-3 flex items-center gap-3"
                    style={{ background: cardBg, border: `1px solid ${borderCol}` }}
                  >
                    <span className="text-2xl flex-shrink-0">{trip.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs" style={{ color: headingColor }}>{trip.dest}</p>
                      <p className="text-[10px]" style={{ color: textMuted }}>{trip.month} · {trip.women} women</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: borderCol }} />

            {/* Founder Circle */}
            <div>
              <SectionLabel>FOUNDER CIRCLE</SectionLabel>
              <div className="flex flex-col gap-2">
                {FOUNDERS.slice(0, 2).map((founder) => (
                  <FounderCard key={founder.id} founder={founder} {...sharedCardProps} />
                ))}
              </div>
            </div>
          </div>
          {/* end RIGHT */}

        </div>
        {/* end 3-panel body */}
      </div>
      {/* end desktop */}
    </div>
  );
}
