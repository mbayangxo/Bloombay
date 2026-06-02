"use client";

import { useState } from "react";
import Link from "next/link";

// ── Extended event data ───────────────────────────────────────────────────────

export interface EventData {
  id: number;
  type: string;
  title: string;
  venue: string;
  neighborhood: string;
  time: string;
  priceLabel: string;
  price: number;
  partner?: string;
  womenLoved?: boolean;
}

// Mock extended data per event (keyed by id)
const EVENT_EXTENDED: Record<number, {
  tags: string[];
  vibe: string;
  dresscode: string;
  seats: number;
  seatsLeft: number;
  chemistry: number;
  deposit: number;
  ticketFee: number;
  bbFee: number;
  venueService: number;
  includes: string[];
  attendees: { initial: string; color: string }[];
  tableNum: string;
  note: string;
}> = {
  1: { tags: ["Gallery", "Bushwick", "Women Only", "Free"],
    vibe: "Think candlelight, deep talks, and women who inspire you. A night to exhale, connect, and romanticize your life.",
    dresscode: "Anything that makes you feel like art", seats: 8, seatsLeft: 3, chemistry: 94,
    deposit: 0, ticketFee: 0, bbFee: 0, venueService: 0,
    includes: ["Entry to opening", "Curated crowd", "Champagne reception", "Energy you won't find elsewhere"],
    attendees: [{ initial: "A", color: "#FF1F7D" }, { initial: "S", color: "#FF69B4" }, { initial: "N", color: "#FF1F7D" }, { initial: "K", color: "#FF69B4" }, { initial: "Z", color: "#FF1F7D" }],
    tableNum: "A3", note: "Good art.\nGreat women.\nUnforgettable night." },
  2: { tags: ["Workshop", "Williamsburg", "All levels", "$45"],
    vibe: "Hands in clay, mind at peace. Three hours of making something real with your hands and the right people around you.",
    dresscode: "Clothes you can ruin", seats: 10, seatsLeft: 4, chemistry: 88,
    deposit: 15, ticketFee: 45, bbFee: 5, venueService: 0,
    includes: ["Clay + tools", "3-hour session", "Kiln firing included", "Tea and snacks"],
    attendees: [{ initial: "P", color: "#FF69B4" }, { initial: "J", color: "#FF1F7D" }, { initial: "T", color: "#FF69B4" }, { initial: "M", color: "#FF1F7D" }],
    tableNum: "B7", note: "Make something\nyou'll keep\nforever." },
  3: { tags: ["Rooftop", "Williamsburg", "21+", "$20"],
    vibe: "Golden hour from the top floor. Brooklyn in every direction. Women who know how to make an evening last.",
    dresscode: "Golden hour everything", seats: 15, seatsLeft: 6, chemistry: 91,
    deposit: 10, ticketFee: 20, bbFee: 5, venueService: 15,
    includes: ["Rooftop access", "Welcome cocktail", "Curated playlist", "Unforgettable view"],
    attendees: [{ initial: "I", color: "#FF1F7D" }, { initial: "L", color: "#FF69B4" }, { initial: "B", color: "#FF1F7D" }, { initial: "D", color: "#FF69B4" }, { initial: "R", color: "#FF1F7D" }, { initial: "F", color: "#FF69B4" }],
    tableNum: "R1", note: "Golden hour.\nGood drinks.\nBetter company." },
  4: { tags: ["Pop-Up", "SoHo", "Free", "This Weekend"],
    vibe: "Local designers. Beautiful things. Women who know what they want. Browse, buy, and meet the makers.",
    dresscode: "Come as your most stylish self", seats: 40, seatsLeft: 22, chemistry: 85,
    deposit: 0, ticketFee: 0, bbFee: 0, venueService: 0,
    includes: ["Free entry", "Designer showcases", "Champagne on arrival", "First access to limited pieces"],
    attendees: [{ initial: "Y", color: "#FF69B4" }, { initial: "C", color: "#FF1F7D" }, { initial: "A", color: "#FF69B4" }],
    tableNum: "F1", note: "Style.\nStory.\nSisterhood." },
  5: { tags: ["Class", "Midtown", "All levels", "$15"],
    vibe: "Sunrise pilates in the park. The city before the rush. Movement that actually feels like a gift to yourself.",
    dresscode: "Workout wear, bring a mat", seats: 20, seatsLeft: 7, chemistry: 92,
    deposit: 10, ticketFee: 15, bbFee: 5, venueService: 0,
    includes: ["1hr pilates class", "Mat provided", "Post-class matcha walk", "New morning ritual"],
    attendees: [{ initial: "S", color: "#FF1F7D" }, { initial: "P", color: "#FF69B4" }, { initial: "A", color: "#FF1F7D" }, { initial: "N", color: "#FF69B4" }],
    tableNum: "G5", note: "Move your body.\nClear your mind.\nGood morning." },
  6: { tags: ["Festival", "Sunset Park", "Free", "Sat–Sun"],
    vibe: "Two nights of music, food, and culture. Brooklyn at its best. Come for the vibes, stay for the people.",
    dresscode: "Festival mode", seats: 50, seatsLeft: 18, chemistry: 87,
    deposit: 0, ticketFee: 0, bbFee: 0, venueService: 0,
    includes: ["Free entry", "Live music", "Food market", "Night you'll talk about"],
    attendees: [{ initial: "Z", color: "#FF1F7D" }, { initial: "I", color: "#FF69B4" }, { initial: "T", color: "#FF1F7D" }, { initial: "K", color: "#FF69B4" }, { initial: "R", color: "#FF1F7D" }],
    tableNum: "E2", note: "Music.\nFood.\nPure Brooklyn." },
  7: { tags: ["Workshop", "Nolita", "Beginner", "$30"],
    vibe: "Make your own book from scratch. Quiet craft, good company, and something beautiful to take home.",
    dresscode: "Comfortable and creative", seats: 8, seatsLeft: 2, chemistry: 89,
    deposit: 15, ticketFee: 30, bbFee: 5, venueService: 0,
    includes: ["All materials", "2hr session", "Take home your book", "Tea served"],
    attendees: [{ initial: "N", color: "#FF69B4" }, { initial: "D", color: "#FF1F7D" }],
    tableNum: "W3", note: "Craft something\nbeautiful.\nTake it home." },
  8: { tags: ["Gallery", "Chelsea", "Free", "First Friday"],
    vibe: "New works from emerging figurative painters. The kind of show that makes you stop in front of one piece for ten minutes.",
    dresscode: "Gallery-ready", seats: 30, seatsLeft: 15, chemistry: 90,
    deposit: 0, ticketFee: 0, bbFee: 0, venueService: 0,
    includes: ["Free entry", "Artist talks", "Wine reception", "Gallery guide"],
    attendees: [{ initial: "A", color: "#FF1F7D" }, { initial: "S", color: "#FF69B4" }, { initial: "P", color: "#FF1F7D" }],
    tableNum: "G1", note: "See something\nthat moves you.\nFree." },
};

function fallbackExtended(id: number) {
  return EVENT_EXTENDED[id] ?? {
    tags: ["Event", "NYC"],
    vibe: "An experience curated for women who want more.",
    dresscode: "Dress for the night",
    seats: 10, seatsLeft: 5, chemistry: 88,
    deposit: 10, ticketFee: 0, bbFee: 5, venueService: 0,
    includes: ["Entry", "Curated crowd"],
    attendees: [{ initial: "A", color: "#FF1F7D" }, { initial: "S", color: "#FF69B4" }],
    tableNum: "T1",
    note: "Good food.\nGreat women.\nMemories.",
  };
}

// ── Barcode decoration ────────────────────────────────────────────────────────

function Barcode({ code, light = false }: { code: string; light?: boolean }) {
  const bars = Array.from({ length: 48 }).map((_, i) => ({ w: [1, 1, 2, 1, 3, 1, 1, 2][i % 8], h: i % 5 === 0 ? 36 : 28 }));
  return (
    <div>
      <div className="flex gap-[1.5px] items-end mb-1">
        {bars.map((b, i) => (
          <div key={i} style={{ width: `${b.w}px`, height: `${b.h}px`, background: light ? "rgba(255,255,255,0.7)" : "#222", borderRadius: "0.5px", flexShrink: 0 }} />
        ))}
      </div>
      <p className="text-[8px] font-mono tracking-widest" style={{ color: light ? "rgba(255,255,255,0.4)" : "#aaa" }}>{code}</p>
    </div>
  );
}

// ── Chemistry bar chart ───────────────────────────────────────────────────────

function ChemistryBars({ chemistry }: { chemistry: number }) {
  const bars = [
    { label: "Values",    pct: Math.min(100, chemistry + 4) },
    { label: "Vibe",      pct: Math.min(100, chemistry - 2) },
    { label: "Interests", pct: Math.min(100, chemistry + 1) },
    { label: "Energy",    pct: Math.min(100, chemistry + 3) },
  ];
  return (
    <div className="flex flex-col gap-2">
      {bars.map((b) => (
        <div key={b.label} className="flex items-center gap-2">
          <p className="text-[10px] w-16 flex-shrink-0" style={{ color: "#bbb" }}>{b.label}</p>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#F0E8EC" }}>
            <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: "#FF1F7D" }} />
          </div>
          <p className="text-[10px] w-8 text-right flex-shrink-0" style={{ color: "#FF1F7D" }}>{b.pct}%</p>
        </div>
      ))}
    </div>
  );
}

// ── EventDetail ───────────────────────────────────────────────────────────────

export function EventDetail({ event, onBack }: { event: EventData; onBack: () => void }) {
  const ext = fallbackExtended(event.id);
  const isFree = event.price === 0;
  const [rsvpState, setRsvpState] = useState<"idle" | "paying" | "confirmed">("idle");
  const [deposit, setDeposit] = useState("");
  const [saved, setSaved] = useState(false);

  const total = ext.ticketFee + ext.bbFee + ext.venueService;
  const eventCode = `BB-${String(event.id).padStart(4, "0")}-${event.neighborhood.toUpperCase().replace(/ /g, "").slice(0, 4)}-${ext.tableNum}`;

  function handleRSVP() {
    if (isFree) { setRsvpState("confirmed"); return; }
    setRsvpState("paying");
  }
  function handlePay() { setRsvpState("confirmed"); }

  // ── CONFIRMED VIEW ─────────────────────────────────────────────────────────

  if (rsvpState === "confirmed") {
    return (
      <div className="min-h-screen pb-24 md:pb-10" style={{ background: "#FFF5F8" }}>
        {/* Header */}
        <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8 flex items-center justify-between">
          <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <p className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#FF1F7D" }}>BLOOMBAY ✿</p>
          <button onClick={() => setSaved(s => !s)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          </button>
        </div>

        {/* Ticket + polaroid hero */}
        <div className="px-5 md:px-8 mb-6 flex gap-3 items-start">
          {/* Main ticket stub */}
          <div className="flex-1 rounded-2xl overflow-hidden" style={{ background: "#FDFAF5", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            {/* Perforated top */}
            <div className="px-5 pt-4 pb-2 flex items-center justify-between" style={{ borderBottom: "1.5px dashed rgba(0,0,0,0.08)" }}>
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "#bbb" }}>ADMIT ONE, HER</p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="1.5"><path d="M12 2c-1.5 0-2.7 1.2-2.7 2.7S10.5 7.4 12 7.4s2.7-1.2 2.7-2.7S13.5 2 12 2zM9 9c-2 0-3.5 1.1-4 2.7h14c-.5-1.6-2-2.7-4-2.7H9zM3 14h18v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/></svg>
            </div>
            <div className="px-5 pt-3 pb-4">
              {/* Huge compressed title */}
              <h1 className="font-black uppercase mb-3 leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,8vw,38px)", color: "#111111", lineHeight: 0.88, letterSpacing: "-0.02em" }}>
                {event.title.split(" ").slice(0, 2).join("\n")}{"\n"}
                {event.title.split(" ").slice(2).length > 0 && (
                  <span style={{ color: "#FF1F7D" }}>{event.title.split(" ").slice(2).join(" ")}</span>
                )}
              </h1>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "#777" }}>{ext.vibe.split(".")[0]}.</p>
              {/* Date row */}
              <div className="flex gap-4 mb-4">
                <div>
                  <p className="text-[8px] font-bold tracking-wider uppercase" style={{ color: "#bbb" }}>DATE</p>
                  <p className="text-sm font-bold" style={{ color: "#111" }}>{event.time.split("·")[0].trim()}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold tracking-wider uppercase" style={{ color: "#bbb" }}>TIME</p>
                  <p className="text-sm font-bold" style={{ color: "#111" }}>{event.time.split("·")[1]?.trim() ?? "8:00PM"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold tracking-wider uppercase" style={{ color: "#bbb" }}>SEAT</p>
                  <p className="text-sm font-bold" style={{ color: "#FF1F7D" }}>{ext.tableNum}</p>
                </div>
              </div>
              {/* Barcode */}
              <Barcode code={eventCode} />
            </div>
          </div>

          {/* Polaroid + note stack */}
          <div className="flex-shrink-0 flex flex-col gap-2 items-end" style={{ width: "110px" }}>
            <div className="bg-white p-2 pb-5 shadow-xl" style={{ transform: "rotate(2.5deg)", borderRadius: "4px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
              <div className="w-full h-20 flex items-center justify-center rounded-sm" style={{ background: "linear-gradient(135deg, #330011, #FF1F7D33)" }}>
                <span className="text-4xl">🕯️</span>
              </div>
              <p className="text-[9px] text-center mt-1" style={{ fontFamily: "var(--font-caveat)", color: "#888", fontSize: "11px", fontStyle: "italic" }}>✿</p>
            </div>
            <div className="px-3 py-3 rounded-xl" style={{ background: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", transform: "rotate(-1.5deg)" }}>
              <p className="text-[11px] leading-relaxed" style={{ fontFamily: "var(--font-caveat)", color: "#555", fontSize: "13px", whiteSpace: "pre-line" }}>{ext.note}</p>
              <p className="mt-1.5 text-[10px]" style={{ color: "#FF1F7D" }}>♡</p>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="px-5 md:px-8 mb-5">
          <p className="text-[10px] font-bold tracking-[0.22em] text-center" style={{ color: "#bbb" }}>
            CURATED CROWD · GOOD FOOD · BETTER COMPANY ✿
          </p>
        </div>

        {/* Your Seat (dark card) */}
        <div className="px-5 md:px-8 mb-4">
          <div className="rounded-2xl p-5" style={{ background: "#111111", boxShadow: "0 8px 28px rgba(0,0,0,0.25)" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>YOUR SEAT</p>
                <p className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "36px", color: "white" }}>{ext.tableNum}</p>
                <p className="text-xs mt-1 italic" style={{ fontFamily: "var(--font-caveat)", color: "#FF69B4", fontSize: "14px" }}>{ext.seats} women · intimate</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>RSVP STATUS</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ border: "1.5px solid #FF1F7D" }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#FF1F7D" strokeWidth="2"><polyline points="2 6 5 9 10 3"/></svg>
                  <span className="text-[10px] font-black tracking-wider uppercase" style={{ color: "#FF1F7D" }}>CONFIRMED</span>
                </div>
                <p className="text-[10px] mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>Paid in full ✿</p>
              </div>
            </div>
            {!isFree && (
              <div className="grid grid-cols-4 gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "14px" }}>
                {[
                  { label: "DEPOSIT", val: `$${ext.deposit}`, sub: "Secures your seat" },
                  { label: "TICKET", val: `$${ext.ticketFee}`, sub: "Non-refundable" },
                  { label: "MIN. SPEND", val: "$0", sub: "Covered" },
                  { label: "TOTAL", val: `$${ext.deposit + ext.ticketFee}`, sub: "Paid" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[8px] font-bold tracking-wider uppercase mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{item.label}</p>
                    <p className="text-base font-black" style={{ color: item.label === "TOTAL" ? "#FF1F7D" : "white", fontFamily: "var(--font-playfair)" }}>{item.val}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{item.sub}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Who you'll be with */}
        <div className="px-5 md:px-8 mb-4">
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#FF1F7D" }}>WHO YOU&apos;LL BE WITH</p>
              <p className="text-[10px] font-bold tracking-widest" style={{ color: "#FF1F7D" }}>CHEMISTRY {ext.chemistry}%</p>
            </div>
            <div className="flex items-center gap-1.5">
              {ext.attendees.slice(0, 6).map((a, i) => (
                <div key={i} className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs border-2 border-white"
                  style={{ background: `linear-gradient(135deg, ${a.color} 0%, ${a.color}BB 100%)`, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginLeft: i > 0 ? "-6px" : "0" }}>
                  {a.initial}
                </div>
              ))}
              {ext.attendees.length > 6 && (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white" style={{ background: "#111", color: "#FF69B4", marginLeft: "-6px" }}>
                  +{ext.attendees.length - 6}
                </div>
              )}
            </div>
            <p className="text-xs italic mt-2" style={{ fontFamily: "var(--font-instrument)", color: "#bbb" }}>Great energy match.</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 md:px-8 flex flex-wrap gap-3 mb-5">
          <button className="px-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.97]"
            style={{ background: "#FF1F7D", boxShadow: "0 4px 14px rgba(255,31,125,0.35)" }}>
            Invite a Bloomie ✦
          </button>
          <Link href="/member/messages"
            className="px-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.97] inline-flex items-center"
            style={{ background: "#2C1A0E" }}>
            Enter Plan Room →
          </Link>
        </div>

        <div className="px-5 md:px-8">
          <p className="text-[10px] text-center" style={{ color: "#ccc" }}>✿ All women are verified. All vibes are real.</p>
        </div>
      </div>
    );
  }

  // ── PAYMENT SHEET ──────────────────────────────────────────────────────────

  if (rsvpState === "paying") {
    return (
      <div className="min-h-screen pb-24" style={{ background: "#FFF5F8" }}>
        <div className="px-5 pt-12 pb-4 flex items-center gap-3">
          <button onClick={() => setRsvpState("idle")} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#FF1F7D" }}>SECURE YOUR SEAT</p>
            <p className="text-lg font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{event.title}</p>
          </div>
        </div>

        <div className="px-5 flex flex-col gap-4">
          {/* Investment breakdown */}
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "#FF1F7D" }}>INVESTMENT</p>
            {[
              { label: "Seat Fee", val: ext.ticketFee },
              { label: "BloomBay Experience Fee", val: ext.bbFee },
              { label: "Venue & Service", val: ext.venueService },
            ].filter((r) => r.val > 0).map((r) => (
              <div key={r.label} className="flex justify-between py-2.5" style={{ borderBottom: "1px solid #F5F5F5" }}>
                <p className="text-sm" style={{ color: "#555" }}>{r.label}</p>
                <p className="text-sm font-bold" style={{ color: "#111" }}>${r.val}</p>
              </div>
            ))}
            <div className="flex justify-between pt-3">
              <p className="text-sm font-bold" style={{ color: "#111" }}>Total</p>
              <p className="text-base font-black" style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)" }}>${total} USD</p>
            </div>
            {ext.deposit > 0 && (
              <div className="mt-3 rounded-xl px-4 py-3" style={{ background: "#FFF0F5" }}>
                <p className="text-xs leading-relaxed" style={{ color: "#FF1F7D" }}>
                  ✿ A ${ext.deposit} deposit secures your seat. The rest is due before the event.
                </p>
              </div>
            )}
          </div>

          {/* Card input (mock) */}
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#bbb" }}>PAYMENT</p>
            <input
              type="text"
              placeholder="Card number"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-2.5"
              style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE", color: "#111" }}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <input placeholder="MM/YY" className="px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE", color: "#111" }} />
              <input placeholder="CVV" className="px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE", color: "#111" }} />
            </div>
          </div>

          <button
            onClick={handlePay}
            className="w-full py-4.5 rounded-2xl text-base font-bold text-white transition-all active:scale-[0.97]"
            style={{ background: "#FF1F7D", boxShadow: "0 6px 20px rgba(255,31,125,0.35)", padding: "18px" }}
          >
            Pay ${ext.deposit > 0 ? ext.deposit : total} deposit — Secure My Seat ✿
          </button>
          <p className="text-[10px] text-center" style={{ color: "#ccc" }}>✿ All women are verified. All vibes are real.</p>
        </div>
      </div>
    );
  }

  // ── DISCOVERY VIEW (idle) ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "#FDFAF5" }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-3 md:px-8 md:pt-8 flex items-center justify-between">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <p className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#111" }}>BLOOMBAY ✿</p>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
          </button>
          <button onClick={() => setSaved(s => !s)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          </button>
        </div>
      </div>

      <div className="md:grid md:grid-cols-[1fr_360px] md:gap-6 md:px-8 md:items-start">

        {/* ── LEFT / MAIN ── */}
        <div>
          {/* Category + title */}
          <div className="px-5 md:px-0 mb-4">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "#FF1F7D" }}>
              HAPPENING · {event.type.toUpperCase()}
            </p>
            <h1 className="font-black uppercase leading-none mb-3"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(30px,9vw,48px)", color: "#111111", lineHeight: 0.88, letterSpacing: "-0.02em" }}>
              {event.title}
            </h1>
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {ext.tags.map((tag) => (
                <span key={tag}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: tag === "Women Only" ? "#111111" : "white", color: tag === "Women Only" ? "white" : "#555", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Photo collage */}
          <div className="px-5 md:px-0 mb-5 relative" style={{ height: "220px" }}>
            {/* Main photo */}
            <div className="absolute left-0 top-0 w-3/5 h-full rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #330011, #FF1F7D44)" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl opacity-60">🕯️</span>
              </div>
              {/* Curated Bloombay seal */}
              <div className="absolute bottom-3 left-3 w-16 h-16 rounded-full flex flex-col items-center justify-center" style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                <p className="text-[7px] font-black tracking-wider uppercase text-center leading-tight" style={{ color: "#FF1F7D" }}>CURATED<br/>BLOOMBAY</p>
                <span style={{ color: "#FF1F7D", fontSize: "14px" }}>✿</span>
              </div>
            </div>
            {/* Polaroid top-right */}
            <div className="absolute right-0 top-0 bg-white p-2 pb-7 shadow-xl" style={{ width: "42%", transform: "rotate(2deg)", borderRadius: "4px", zIndex: 2 }}>
              <div className="w-full h-28 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #220008, #FF1F7D33)" }}>
                <span className="text-4xl">🥂</span>
              </div>
            </div>
            {/* Note card */}
            <div className="absolute right-2 bottom-0 px-3 py-3 rounded-xl shadow-md z-10"
              style={{ background: "white", maxWidth: "130px", transform: "rotate(-2deg)" }}>
              <p className="text-[12px] leading-relaxed italic" style={{ fontFamily: "var(--font-caveat)", color: "#555", whiteSpace: "pre-line" }}>{ext.note}</p>
              <p className="mt-1" style={{ color: "#FF1F7D", fontSize: "12px" }}>♡</p>
            </div>
          </div>

          {/* Event info row */}
          <div className="px-5 md:px-0 mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: "📅", label: event.time.split("·")[0].trim(), sub: event.time.split("·")[1]?.trim() ?? "8:00 PM" },
              { icon: "📍", label: event.venue, sub: event.neighborhood },
              { icon: "👥", label: `${ext.seatsLeft} Seats`, sub: "Left" },
              { icon: "👗", label: ext.dresscode.split(" ").slice(0, 3).join(" "), sub: "Dress code" },
            ].map((d, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl px-3 py-3" style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>{d.icon}</span>
                <div>
                  <p className="text-xs font-bold leading-tight" style={{ color: "#111" }}>{d.label}</p>
                  <p className="text-[10px]" style={{ color: "#aaa" }}>{d.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* The Vibe */}
          <div className="px-5 md:px-0 mb-5">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "#FF1F7D" }}>THE VIBE</p>
            <p className="text-sm leading-relaxed" style={{ color: "#555" }}>{ext.vibe}</p>
            <div className="mt-3 flex items-center gap-2">
              <p className="text-xs italic" style={{ fontFamily: "var(--font-caveat)", color: "#FF1F7D", fontSize: "15px" }}>Good food. Great energy. Even better company.</p>
              <span style={{ color: "#FF1F7D" }}>♡</span>
            </div>
          </div>

          {/* Who's Coming */}
          <div className="px-5 md:px-0 mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#FF1F7D" }}>WHO&apos;S COMING</p>
              <p className="text-xs font-bold" style={{ color: "#FF1F7D" }}>See all →</p>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              {ext.attendees.map((a, i) => (
                <div key={i} className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm border-2 border-white"
                  style={{ background: `linear-gradient(135deg, ${a.color} 0%, ${a.color}BB 100%)`, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginLeft: i > 0 ? "-6px" : "0" }}>
                  {a.initial}
                </div>
              ))}
              <div className="w-11 h-11 rounded-full border-2 border-dashed flex items-center justify-center text-xs font-bold"
                style={{ borderColor: "#FFB6D0", color: "#FF1F7D", marginLeft: "-6px" }}>+7</div>
            </div>
            <p className="text-xs italic" style={{ fontFamily: "var(--font-instrument)", color: "#bbb" }}>Great energy. Great mix.</p>
          </div>

          {/* Chemistry Preview */}
          <div className="px-5 md:px-0 mb-5 bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#FF1F7D" }}>CHEMISTRY PREVIEW</p>
            <div className="flex items-start gap-5">
              <div>
                <p className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "44px", color: "#FF1F7D" }}>{ext.chemistry}%</p>
                <p className="text-xs mt-1 italic" style={{ fontFamily: "var(--font-instrument)", color: "#aaa" }}>Amazing Match Energy ✿</p>
              </div>
              <div className="flex-1">
                <ChemistryBars chemistry={ext.chemistry} />
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="px-5 md:px-0 mb-6 rounded-2xl p-5" style={{ background: "#FFF0F5", borderLeft: "4px solid #FF1F7D" }}>
            <p className="text-base italic leading-relaxed" style={{ fontFamily: "var(--font-caveat)", color: "#555", fontSize: "17px" }}>
              &ldquo;You&apos;re not just reserving a seat. You&apos;re saying yes to a night you&apos;ll remember.&rdquo;
            </p>
            <p className="mt-2" style={{ color: "#FF1F7D", fontSize: "18px" }}>💋</p>
          </div>
        </div>

        {/* ── RIGHT / BOOKING SIDEBAR ── */}
        <div className="px-5 md:px-0 flex flex-col gap-4">
          {/* Your Seat ticket */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <div className="px-5 py-3" style={{ background: "#FF1F7D" }}>
              <p className="text-xs font-black tracking-[0.2em] uppercase text-white">YOUR SEAT</p>
            </div>
            <div className="p-5">
              <div className="flex gap-4 mb-3">
                <div>
                  <p className="text-[8px] font-bold tracking-wider uppercase mb-1" style={{ color: "#bbb" }}>SEAT</p>
                  <p className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "32px", color: "#FF1F7D" }}>{ext.tableNum}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold tracking-wider uppercase mb-1" style={{ color: "#bbb" }}>SECTION</p>
                  <p className="text-xs font-black tracking-wider uppercase" style={{ color: "#FF1F7D" }}>MAIN TABLE</p>
                  <p className="text-[9px] mt-1" style={{ color: "#bbb" }}>TABLE OF {ext.seats} WOMEN</p>
                </div>
                <div className="ml-auto">
                  <Barcode code="BLOOMBAY" />
                </div>
              </div>
              <p className="text-xs italic" style={{ fontFamily: "var(--font-instrument)", color: "#bbb" }}>You&apos;re in good company. ✿</p>
            </div>
          </div>

          {/* Reserve countdown */}
          <div className="rounded-2xl p-4 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#111" }}>RESERVE YOUR SEAT</p>
            <p className="text-[9px] mb-2" style={{ color: "#bbb" }}>ENDS IN</p>
            <div className="flex gap-2 items-center">
              {[{ n: "02", l: "DAYS" }, { n: "14", l: "HRS" }, { n: "37", l: "MINS" }, { n: "52", l: "SECS" }].map((t, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-10 rounded-lg flex items-center justify-center font-black text-lg" style={{ background: "#111", color: "white", fontFamily: "var(--font-playfair)" }}>{t.n}</div>
                  <p className="text-[8px] mt-0.5 font-bold tracking-wider" style={{ color: "#bbb" }}>{t.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What's included */}
          <div className="rounded-2xl p-4 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#111" }}>WHAT&apos;S INCLUDED</p>
            <div className="flex flex-col gap-2">
              {ext.includes.map((inc, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF1F7D" }}>
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><polyline points="2 6 5 9 10 3"/></svg>
                  </div>
                  <p className="text-xs" style={{ color: "#555" }}>{inc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Investment */}
          {!isFree && (
            <div className="rounded-2xl p-4 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#111" }}>INVESTMENT</p>
              {[
                { label: "Seat Fee", val: ext.ticketFee },
                { label: "BloomBay Experience Fee", val: ext.bbFee },
                { label: "Venue & Service", val: ext.venueService },
              ].filter((r) => r.val > 0).map((r) => (
                <div key={r.label} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #F8F5F7" }}>
                  <p className="text-xs" style={{ color: "#666" }}>{r.label}</p>
                  <p className="text-xs font-bold" style={{ color: "#111" }}>${r.val}</p>
                </div>
              ))}
              <div className="flex justify-between pt-2">
                <p className="text-sm font-bold" style={{ color: "#111" }}>Total</p>
                <p className="text-sm font-black" style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)" }}>${total} USD</p>
              </div>
              <div className="mt-3 rounded-xl px-3 py-2.5" style={{ background: "#FFF0F5" }}>
                <p className="text-[10px] leading-relaxed" style={{ color: "#FF1F7D" }}>✿ A ${ext.deposit} deposit secures your seat. The rest is due before the event.</p>
              </div>
            </div>
          )}

          {/* Make it your night (add-ons) */}
          <div className="rounded-2xl p-4 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#111" }}>MAKE IT YOUR NIGHT</p>
            {[
              { icon: "🥂", title: "Pre-Order Drinks", sub: "Skip the wait and have your favorite drink ready.", label: "+ ADD" },
              { icon: "🎁", title: "Bring a Little Joy", sub: "Add a surprise for the table. Because we love surprises.", label: "+ ADD" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: i === 0 ? "1px solid #F8F5F7" : "none" }}>
                <span style={{ fontSize: "20px", flexShrink: 0 }}>{a.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold" style={{ color: "#111" }}>{a.title}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#bbb" }}>{a.sub}</p>
                </div>
                <button className="text-[10px] font-black flex-shrink-0" style={{ color: "#FF1F7D" }}>{a.label}</button>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <button onClick={handleRSVP}
            className="w-full py-5 rounded-2xl text-base font-bold text-white transition-all active:scale-[0.97]"
            style={{ background: "#FF1F7D", boxShadow: "0 6px 22px rgba(255,31,125,0.4)" }}>
            {isFree ? "RSVP — I'm Going ✿" : "SECURE MY SEAT ✿"}
          </button>
          <button className="w-full py-4 rounded-2xl text-sm font-bold transition-all active:scale-[0.97]"
            style={{ background: "white", color: "#111", border: "1.5px solid #E0E0E0" }}>
            SAVE FOR LATER ◻
          </button>
          <p className="text-[10px] text-center" style={{ color: "#bbb" }}>✿ All women are verified. All vibes are real.</p>
        </div>
      </div>
    </div>
  );
}
