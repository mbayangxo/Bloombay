"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

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

interface AttendeeData {
  initial: string;
  name: string;
  color: string;
  tag: string;
  compatibility: number;
}

// ── Extended event data ───────────────────────────────────────────────────────

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
  attendees: AttendeeData[];
  tableNum: string;
  note: string;
}> = {
  1: {
    tags: ["Gallery", "Bushwick", "Women Only", "Free"],
    vibe: "Think candlelight, deep talks, and women who inspire you. A night to exhale, connect, and romanticize your life.",
    dresscode: "Anything that makes you feel like art",
    seats: 8, seatsLeft: 3, chemistry: 94,
    deposit: 0, ticketFee: 0, bbFee: 0, venueService: 0,
    includes: ["Entry to opening", "Curated crowd", "Champagne reception", "Energy you won't find elsewhere"],
    attendees: [
      { initial: "A", name: "Amara", color: "#FF1F7D", tag: "Photographer · Lover of film", compatibility: 96 },
      { initial: "S", name: "Sofía", color: "#FF69B4", tag: "Painter · Art Basel regular", compatibility: 91 },
      { initial: "N", name: "Nia", color: "#C0185F", tag: "Writer · Culture nerd", compatibility: 88 },
      { initial: "K", name: "Kezia", color: "#FF69B4", tag: "Creative Director", compatibility: 93 },
      { initial: "Z", name: "Zanele", color: "#FF1F7D", tag: "Poet · Music head", compatibility: 85 },
    ],
    tableNum: "A3",
    note: "Good art.\nGreat women.\nUnforgettable night.",
  },
  2: {
    tags: ["Workshop", "Williamsburg", "All levels", "$45"],
    vibe: "Hands in clay, mind at peace. Three hours of making something real with your hands and the right people around you.",
    dresscode: "Clothes you can ruin",
    seats: 10, seatsLeft: 4, chemistry: 88,
    deposit: 15, ticketFee: 45, bbFee: 5, venueService: 0,
    includes: ["Clay + tools", "3-hour session", "Kiln firing included", "Tea and snacks"],
    attendees: [
      { initial: "P", name: "Priya", color: "#FF69B4", tag: "Ceramicist · Plant mom", compatibility: 90 },
      { initial: "J", name: "Jade", color: "#FF1F7D", tag: "Interior designer", compatibility: 86 },
      { initial: "T", name: "Tara", color: "#FF69B4", tag: "Yoga teacher · Maker", compatibility: 82 },
      { initial: "M", name: "Mia", color: "#FF1F7D", tag: "Architect · Tactile art", compatibility: 88 },
    ],
    tableNum: "B7",
    note: "Make something\nyou'll keep\nforever.",
  },
  3: {
    tags: ["Rooftop", "Williamsburg", "21+", "$20"],
    vibe: "Golden hour from the top floor. Brooklyn in every direction. Women who know how to make an evening last.",
    dresscode: "Golden hour everything",
    seats: 15, seatsLeft: 6, chemistry: 91,
    deposit: 10, ticketFee: 20, bbFee: 5, venueService: 15,
    includes: ["Rooftop access", "Welcome cocktail", "Curated playlist", "Unforgettable view"],
    attendees: [
      { initial: "I", name: "Imani", color: "#FF1F7D", tag: "Event host · Virgo", compatibility: 93 },
      { initial: "L", name: "Luna", color: "#FF69B4", tag: "DJ · Night owl", compatibility: 89 },
      { initial: "B", name: "Bianca", color: "#C0185F", tag: "Fashion editor", compatibility: 87 },
      { initial: "D", name: "Dara", color: "#FF69B4", tag: "Sommelier · Traveler", compatibility: 91 },
      { initial: "R", name: "Rosa", color: "#FF1F7D", tag: "Mixologist · Host", compatibility: 85 },
      { initial: "F", name: "Fola", color: "#FF69B4", tag: "Curator · Afrobeats", compatibility: 88 },
    ],
    tableNum: "R1",
    note: "Golden hour.\nGood drinks.\nBetter company.",
  },
  4: {
    tags: ["Pop-Up", "SoHo", "Free", "This Weekend"],
    vibe: "Local designers. Beautiful things. Women who know what they want. Browse, buy, and meet the makers.",
    dresscode: "Come as your most stylish self",
    seats: 40, seatsLeft: 22, chemistry: 85,
    deposit: 0, ticketFee: 0, bbFee: 0, venueService: 0,
    includes: ["Free entry", "Designer showcases", "Champagne on arrival", "First access to limited pieces"],
    attendees: [
      { initial: "Y", name: "Yemi", color: "#FF69B4", tag: "Stylist · Curator", compatibility: 87 },
      { initial: "C", name: "Camille", color: "#FF1F7D", tag: "Fashion blogger", compatibility: 83 },
      { initial: "A", name: "Ada", color: "#FF69B4", tag: "Designer · Tailor", compatibility: 90 },
    ],
    tableNum: "F1",
    note: "Style.\nStory.\nSisterhood.",
  },
  5: {
    tags: ["Class", "Midtown", "All levels", "$15"],
    vibe: "Sunrise pilates in the park. The city before the rush. Movement that actually feels like a gift to yourself.",
    dresscode: "Workout wear, bring a mat",
    seats: 20, seatsLeft: 7, chemistry: 92,
    deposit: 10, ticketFee: 15, bbFee: 5, venueService: 0,
    includes: ["1hr pilates class", "Mat provided", "Post-class matcha walk", "New morning ritual"],
    attendees: [
      { initial: "S", name: "Sade", color: "#FF1F7D", tag: "Wellness coach · Runner", compatibility: 94 },
      { initial: "P", name: "Phoebe", color: "#FF69B4", tag: "Nutritionist · Early riser", compatibility: 90 },
      { initial: "A", name: "Asha", color: "#C0185F", tag: "Pilates instructor", compatibility: 88 },
      { initial: "N", name: "Nadia", color: "#FF69B4", tag: "Meditator · Dancer", compatibility: 85 },
    ],
    tableNum: "G5",
    note: "Move your body.\nClear your mind.\nGood morning.",
  },
  6: {
    tags: ["Festival", "Sunset Park", "Free", "Sat–Sun"],
    vibe: "Two nights of music, food, and culture. Brooklyn at its best. Come for the vibes, stay for the people.",
    dresscode: "Festival mode",
    seats: 50, seatsLeft: 18, chemistry: 87,
    deposit: 0, ticketFee: 0, bbFee: 0, venueService: 0,
    includes: ["Free entry", "Live music", "Food market", "Night you'll talk about"],
    attendees: [
      { initial: "Z", name: "Zainab", color: "#FF1F7D", tag: "DJ · Music lover", compatibility: 89 },
      { initial: "I", name: "Iris", color: "#FF69B4", tag: "Food writer · Critic", compatibility: 85 },
      { initial: "T", name: "Tolu", color: "#C0185F", tag: "Photographer · Afrobeats", compatibility: 88 },
      { initial: "K", name: "Kemi", color: "#FF69B4", tag: "Event planner · Host", compatibility: 83 },
      { initial: "R", name: "Remi", color: "#FF1F7D", tag: "Dancer · Cultural guide", compatibility: 86 },
    ],
    tableNum: "E2",
    note: "Music.\nFood.\nPure Brooklyn.",
  },
  7: {
    tags: ["Workshop", "Nolita", "Beginner", "$30"],
    vibe: "Make your own book from scratch. Quiet craft, good company, and something beautiful to take home.",
    dresscode: "Comfortable and creative",
    seats: 8, seatsLeft: 2, chemistry: 89,
    deposit: 15, ticketFee: 30, bbFee: 5, venueService: 0,
    includes: ["All materials", "2hr session", "Take home your book", "Tea served"],
    attendees: [
      { initial: "N", name: "Naomi", color: "#FF69B4", tag: "Bookbinder · Librarian", compatibility: 92 },
      { initial: "D", name: "Demi", color: "#FF1F7D", tag: "Illustrator · Zine maker", compatibility: 87 },
    ],
    tableNum: "W3",
    note: "Craft something\nbeautiful.\nTake it home.",
  },
  8: {
    tags: ["Gallery", "Chelsea", "Free", "First Friday"],
    vibe: "New works from emerging figurative painters. The kind of show that makes you stop in front of one piece for ten minutes.",
    dresscode: "Gallery-ready",
    seats: 30, seatsLeft: 15, chemistry: 90,
    deposit: 0, ticketFee: 0, bbFee: 0, venueService: 0,
    includes: ["Free entry", "Artist talks", "Wine reception", "Gallery guide"],
    attendees: [
      { initial: "A", name: "Amara", color: "#FF1F7D", tag: "Art collector · Curator", compatibility: 93 },
      { initial: "S", name: "Soraya", color: "#FF69B4", tag: "Painter · Arts writer", compatibility: 89 },
      { initial: "P", name: "Petra", color: "#C0185F", tag: "Gallery owner · Critic", compatibility: 91 },
    ],
    tableNum: "G1",
    note: "See something\nthat moves you.\nFree.",
  },
};

function fallbackExtended(id: number) {
  return EVENT_EXTENDED[id] ?? {
    tags: ["Event", "NYC"],
    vibe: "An experience curated for women who want more.",
    dresscode: "Dress for the night",
    seats: 10, seatsLeft: 5, chemistry: 88,
    deposit: 10, ticketFee: 0, bbFee: 5, venueService: 0,
    includes: ["Entry", "Curated crowd"],
    attendees: [
      { initial: "A", name: "Amara", color: "#FF1F7D", tag: "Creative soul", compatibility: 88 },
      { initial: "S", name: "Sofía", color: "#FF69B4", tag: "City explorer", compatibility: 85 },
    ],
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

// ── Attendee profile card (used in confirmed view) ────────────────────────────

function AttendeeProfileCard({ attendee }: { attendee: AttendeeData }) {
  return (
    <button
      className="flex-shrink-0 rounded-2xl overflow-hidden text-left active:scale-[0.96] transition-transform"
      style={{ width: "126px", background: "white", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
    >
      {/* Avatar banner */}
      <div className="h-[68px] flex items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${attendee.color} 0%, ${attendee.color}88 100%)` }}>
        <span className="text-2xl font-black text-white">{attendee.initial}</span>
        {/* Compatibility badge */}
        <div className="absolute top-2 right-2 rounded-full px-2 py-0.5 flex items-center gap-0.5"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
          <span style={{ color: "white", fontSize: "7px" }}>♡</span>
          <span className="text-[9px] font-black text-white">{attendee.compatibility}%</span>
        </div>
      </div>
      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-xs font-bold leading-tight" style={{ color: "#111" }}>{attendee.name}</p>
        <p className="text-[9px] mt-0.5 leading-tight" style={{ color: "#999" }}>{attendee.tag}</p>
        <div className="mt-2 rounded-full px-2 py-0.5 inline-flex items-center gap-1" style={{ background: "#FFF0F5" }}>
          <span style={{ color: "#FF1F7D", fontSize: "7px" }}>✦</span>
          <span className="text-[9px] font-black" style={{ color: "#FF1F7D" }}>{attendee.compatibility}% match</span>
        </div>
      </div>
    </button>
  );
}

// ── Add to Calendar Banner ────────────────────────────────────────────────────

function AddToCalendarBanner({ event }: { event: EventData }) {
  const [added, setAdded] = useState(false);
  if (added) {
    return (
      <div className="px-5 md:px-8 mb-4">
        <div className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
          style={{ background: "#FFF5F8", border: "1.5px solid #FFB6D0" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#FF1F7D" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: "#111" }}>Added to your calendar</p>
            <p className="text-[10px]" style={{ color: "#bbb" }}>{event.time}</p>
          </div>
          <span className="text-[10px] font-bold" style={{ color: "#FF1F7D" }}>✓</span>
        </div>
      </div>
    );
  }
  return (
    <div className="px-5 md:px-8 mb-4">
      <div className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
        style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1.5px dashed #FFB6D0" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#FFF0F5" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: "#111" }}>Add to your calendar?</p>
          <p className="text-[10px]" style={{ color: "#bbb" }}>{event.title} · {event.time}</p>
        </div>
        <button
          onClick={() => setAdded(true)}
          className="px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex-shrink-0"
          style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 12px rgba(255,31,125,0.3)" }}>
          Add
        </button>
      </div>
    </div>
  );
}

// ── Invite Sheet ─────────────────────────────────────────────────────────────

function InviteSheet({ event, onClose }: { event: EventData; onClose: () => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sent, setSent] = useState(false);
  const friends = [
    { id: 1, name: "Amara",  tag: "Your Bloomie · She&apos;ll love this",  initial: "A", color: "#FF1F7D" },
    { id: 2, name: "Sofía",  tag: "Connected · Art lover",                 initial: "S", color: "#FF69B4" },
    { id: 3, name: "Nia",    tag: "Your match · Same energy",               initial: "N", color: "#C0185F" },
    { id: 4, name: "Kezia",  tag: "Close girl · Night out energy",          initial: "K", color: "#FF1F7D" },
  ];
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-y-auto"
        style={{ background: "#FDFAF5", maxHeight: "85vh", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>
        <div className="px-5 pb-10 pt-2">
          {!sent ? (
            <>
              <p className="text-[9px] font-bold tracking-[0.28em] uppercase text-center mb-5" style={{ color: "#FF1F7D" }}>
                💌 SEND AN INVITATION
              </p>
              {/* Invitation card preview */}
              <div className="rounded-3xl p-5 mb-6 relative overflow-hidden"
                style={{ background: "#111", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 20% 20%, rgba(255,31,125,0.18) 0%, transparent 60%)" }} />
                <div className="relative">
                  <p className="text-[8px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color: "rgba(255,31,125,0.7)" }}>
                    BLOOMBAY ✿ · PERSONAL INVITATION
                  </p>
                  <p className="text-[10px] italic mb-1" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.4)" }}>
                    You are cordially invited to join
                  </p>
                  <p className="font-black leading-none mb-3"
                    style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(18px,5vw,22px)", color: "white" }}>
                    {event.title}
                  </p>
                  <div className="flex gap-5">
                    <div>
                      <p className="text-[8px] font-bold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>WHEN</p>
                      <p className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>{event.time}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>WHERE</p>
                      <p className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>{event.venue}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-[10px] italic" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,31,125,0.55)" }}>
                      Sent from a Bloomie. Will you join her? ♡
                    </p>
                  </div>
                </div>
              </div>
              {/* Friends list */}
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#bbb" }}>
                CHOOSE A BLOOMIE TO INVITE
              </p>
              <div className="flex flex-col gap-2.5 mb-5">
                {friends.map(f => {
                  const isSel = selected.has(f.id);
                  return (
                    <button key={f.id}
                      onClick={() => setSelected(s => { const n = new Set(s); isSel ? n.delete(f.id) : n.add(f.id); return n; })}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all active:scale-[0.98] text-left w-full"
                      style={isSel
                        ? { background: "#FF1F7D", boxShadow: "0 4px 14px rgba(255,31,125,0.3)" }
                        : { background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                        style={{ background: isSel ? "rgba(255,255,255,0.28)" : f.color }}>
                        {f.initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold" style={{ color: isSel ? "white" : "#111" }}>{f.name}</p>
                        <p className="text-[10px]" style={{ color: isSel ? "rgba(255,255,255,0.65)" : "#bbb" }}>{f.tag}</p>
                      </div>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: isSel ? "rgba(255,255,255,0.2)" : "#FFF0F5" }}>
                        {isSel
                          ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><polyline points="2 6 5 9 10 3"/></svg>
                          : <span style={{ color: "#FF1F7D", fontSize: "14px", lineHeight: "1", display: "block" }}>+</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => selected.size > 0 && setSent(true)}
                className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.97]"
                style={selected.size > 0
                  ? { background: "#FF1F7D", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.3)" }
                  : { background: "#F0E8EC", color: "#ccc" }}>
                Send Invitation{selected.size > 1 ? ` (${selected.size})` : ""} 💌
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "#FFF0F5", border: "2px solid #FFB6D0" }}>
                <span style={{ fontSize: "28px" }}>💌</span>
              </div>
              <h3 className="font-black text-xl italic mb-2"
                style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>
                Invitation sent.
              </h3>
              <p className="text-sm italic mb-6" style={{ fontFamily: "var(--font-playfair)", color: "#999" }}>
                She&apos;ll receive a beautiful card in her mailbox.<br />It&apos;s her call now. ♡
              </p>
              <button onClick={onClose}
                className="px-8 py-3.5 rounded-2xl font-bold text-sm"
                style={{ background: "#111", color: "white" }}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── EventDetail ───────────────────────────────────────────────────────────────

export function EventDetail({ event, onBack }: { event: EventData; onBack: () => void }) {
  const ext = fallbackExtended(event.id);
  const isFree = event.price === 0;
  const [rsvpState, setRsvpState] = useState<"idle" | "paying" | "confirmed">("idle");
  const [saved, setSaved] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const total = ext.ticketFee + ext.bbFee + ext.venueService;
  const eventCode = `BB-${String(event.id).padStart(4, "0")}-${event.neighborhood.toUpperCase().replace(/ /g, "").slice(0, 4)}-${ext.tableNum}`;

  function handleRSVP() {
    if (isFree) { setRsvpState("confirmed"); return; }
    setRsvpState("paying");
  }
  async function handlePay() {
    setPaying(true);
    setPayError(null);
    try {
      const res = await fetch("/api/payments/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ticket",
          eventId: String(event.id),
          eventName: event.title,
          amountCents: Math.round(total * 100),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPayError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setPayError("Something went wrong. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  // ── CONFIRMED VIEW ─────────────────────────────────────────────────────────

  if (rsvpState === "confirmed") {
    return (
      <div className="min-h-screen pb-24 md:pb-10" style={{ background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 30%, #FFF5F0 60%, #FFF0F8 100%)" }}>

        {/* Header */}
        <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8 flex items-center justify-between">
          <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <p className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#FF1F7D" }}>BLOOMBAY ✿</p>
          <button onClick={() => setSaved(s => !s)} className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          </button>
        </div>

        {/* Ticket + polaroid hero */}
        <div className="px-5 md:px-8 mb-5 flex gap-3 items-start">
          {/* Main ticket stub */}
          <div className="flex-1 rounded-2xl overflow-hidden" style={{ background: "#FDFAF5", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <div className="px-5 pt-4 pb-2 flex items-center justify-between" style={{ borderBottom: "1.5px dashed rgba(0,0,0,0.08)" }}>
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "#bbb" }}>ADMIT ONE, HER</p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="1.5"><path d="M12 2c-1.5 0-2.7 1.2-2.7 2.7S10.5 7.4 12 7.4s2.7-1.2 2.7-2.7S13.5 2 12 2zM9 9c-2 0-3.5 1.1-4 2.7h14c-.5-1.6-2-2.7-4-2.7H9zM3 14h18v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/></svg>
            </div>
            <div className="px-5 pt-3 pb-4">
              <h1 className="font-black uppercase mb-3 leading-none"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px,7vw,34px)", color: "#111111", lineHeight: 0.88, letterSpacing: "-0.02em" }}>
                {event.title.split(" ").slice(0, 2).join(" ")}{"\n"}
                {event.title.split(" ").slice(2).length > 0 && (
                  <span style={{ color: "#FF1F7D" }}>{event.title.split(" ").slice(2).join(" ")}</span>
                )}
              </h1>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "#777" }}>{ext.vibe.split(".")[0]}.</p>
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
              <Barcode code={eventCode} />
            </div>
          </div>

          {/* Polaroid + note */}
          <div className="flex-shrink-0 flex flex-col gap-2 items-end" style={{ width: "100px" }}>
            <div className="bg-white p-2 pb-5 shadow-xl" style={{ transform: "rotate(2.5deg)", borderRadius: "4px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
              <div className="w-full h-16 flex items-center justify-center rounded-sm" style={{ background: "linear-gradient(135deg, #330011, #FF1F7D33)" }}>
                <span className="text-3xl">🕯️</span>
              </div>
              <p className="text-[9px] text-center mt-1" style={{ fontFamily: "var(--font-caveat)", color: "#888", fontSize: "11px" }}>✿</p>
            </div>
            <div className="px-3 py-2.5 rounded-xl" style={{ background: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", transform: "rotate(-1.5deg)" }}>
              <p className="text-[11px] leading-relaxed" style={{ fontFamily: "var(--font-caveat)", color: "#555", fontSize: "12px", whiteSpace: "pre-line" }}>{ext.note}</p>
              <p className="mt-1 text-[10px]" style={{ color: "#FF1F7D" }}>♡</p>
            </div>
          </div>
        </div>

        {/* RSVP confirmed banner */}
        <div className="px-5 md:px-8 mb-4">
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "#111111" }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF1F7D" }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><polyline points="2 6 5 9 10 3"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black tracking-wider uppercase" style={{ color: "#FF1F7D" }}>YOU&apos;RE GOING ✿</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>Seat {ext.tableNum} · {event.venue}</p>
            </div>
            {!isFree && (
              <p className="text-xs font-black" style={{ color: "rgba(255,255,255,0.3)" }}>Paid in full</p>
            )}
          </div>
        </div>

        {/* Your Seat dark card */}
        <div className="px-5 md:px-8 mb-5">
          <div className="rounded-2xl p-5" style={{ background: "#1A0A12", boxShadow: "0 8px 28px rgba(0,0,0,0.25)" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>YOUR SEAT</p>
                <p className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "42px", color: "white" }}>{ext.tableNum}</p>
                <p className="text-xs mt-1 italic" style={{ fontFamily: "var(--font-caveat)", color: "#FF69B4", fontSize: "14px" }}>{ext.seats} women · intimate</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>STATUS</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ border: "1.5px solid #FF1F7D" }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#FF1F7D" strokeWidth="2"><polyline points="2 6 5 9 10 3"/></svg>
                  <span className="text-[10px] font-black tracking-wider uppercase" style={{ color: "#FF1F7D" }}>CONFIRMED</span>
                </div>
              </div>
            </div>
            {!isFree && (
              <div className="grid grid-cols-4 gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "12px" }}>
                {[
                  { label: "DEPOSIT", val: `$${ext.deposit}` },
                  { label: "TICKET", val: `$${ext.ticketFee}` },
                  { label: "BB FEE", val: `$${ext.bbFee}` },
                  { label: "TOTAL", val: `$${ext.deposit + ext.ticketFee}` },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[8px] font-bold tracking-wider uppercase mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>{item.label}</p>
                    <p className="text-base font-black" style={{ color: item.label === "TOTAL" ? "#FF1F7D" : "white", fontFamily: "var(--font-playfair)" }}>{item.val}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* WHO YOU'LL BE WITH — individual profile cards */}
        <div className="mb-5">
          <div className="px-5 md:px-8 flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#FF1F7D" }}>WHO YOU&apos;LL BE WITH</p>
              <p className="text-xs italic mt-0.5" style={{ fontFamily: "var(--font-playfair)", color: "#bbb" }}>
                {ext.attendees.length} women going · avg {Math.round(ext.attendees.reduce((s, a) => s + a.compatibility, 0) / ext.attendees.length)}% match
              </p>
            </div>
            <div className="rounded-full px-3 py-1.5" style={{ background: "#FFF0F5" }}>
              <p className="text-[10px] font-black" style={{ color: "#FF1F7D" }}>♡ {ext.chemistry}% chemistry</p>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2"
            style={{ paddingLeft: "20px", paddingRight: "20px", scrollbarWidth: "none" }}>
            {ext.attendees.map((a, i) => (
              <AttendeeProfileCard key={i} attendee={a} />
            ))}
            {/* Add yourself */}
            <div className="flex-shrink-0 rounded-2xl overflow-hidden text-left"
              style={{ width: "126px", background: "#FFF0F5", border: "1.5px dashed #FFB6D0" }}>
              <div className="h-[68px] flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #FF1F7D22 0%, #FF69B422 100%)" }}>
                <span className="text-2xl">✦</span>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-xs font-bold" style={{ color: "#FF1F7D" }}>You</p>
                <p className="text-[9px] mt-0.5" style={{ color: "#FF69B4" }}>Your spot is saved</p>
              </div>
            </div>
          </div>
        </div>

        {/* YOUR PLAN ROOM */}
        <div className="px-5 md:px-8 mb-5">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(0,0,0,0.35)" }}>YOUR PLAN ROOM</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "#0D0810", boxShadow: "0 8px 28px rgba(0,0,0,0.3)" }}>
            {/* Subtle glow */}
            <div className="relative px-5 pt-5 pb-4">
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 0%, rgba(255,31,125,0.12) 0%, transparent 65%)" }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#FF1F7D", boxShadow: "0 0 6px rgba(255,31,125,0.8)" }} />
                  <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>LIVE PLAN ROOM</p>
                </div>
                <p className="font-black leading-tight" style={{ fontFamily: "var(--font-playfair)", fontSize: "17px", color: "white" }}>{event.title}</p>
                <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {ext.attendees.length} women going · Private group · Open after RSVP
                </p>
              </div>
            </div>
            <div className="px-5 pb-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
              <div className="flex items-center">
                {ext.attendees.slice(0, 4).map((a, i) => (
                  <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: a.color, marginLeft: i > 0 ? "-6px" : "0", border: "2px solid #0D0810" }}>
                    {a.initial}
                  </div>
                ))}
                {ext.attendees.length > 4 && (
                  <p className="text-[10px] font-semibold ml-2.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                    +{ext.attendees.length - 4} more
                  </p>
                )}
              </div>
              <Link href={`/member/plans?event=${event.id}`}
                className="px-4 py-2 rounded-xl text-xs font-bold active:scale-[0.97] transition-transform"
                style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.4)" }}>
                Enter Room →
              </Link>
            </div>
          </div>
        </div>

        {/* EVENT CHAT */}
        <div className="px-5 md:px-8 mb-5">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(0,0,0,0.35)" }}>EVENT CHAT</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "1.5px solid #F0E8EC" }}>
            <div className="px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#FFF0F5" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#FF1F7D", boxShadow: "0 0 4px rgba(255,31,125,0.7)" }} />
                  <p className="text-xs font-bold" style={{ color: "#111" }}>Event Group Chat</p>
                </div>
                <p className="text-[10px]" style={{ color: "#bbb" }}>{ext.attendees.length} women · Active now</p>
              </div>
              <Link href="/member/chat"
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.97] flex-shrink-0"
                style={{ background: "#111", color: "white" }}>
                Open →
              </Link>
            </div>
          </div>
        </div>

        {/* PRE-ORDER placeholder */}
        <div className="px-5 md:px-8 mb-5">
          <div className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px dashed #FFB6D0" }}>
            <span style={{ fontSize: "28px", opacity: 0.5, flexShrink: 0 }}>🥂</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[9px] font-bold tracking-wider uppercase" style={{ color: "#bbb" }}>OPENING SOON</p>
              </div>
              <p className="text-sm font-bold" style={{ color: "#111" }}>Pre-Order Food & Drinks</p>
              <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: "#bbb" }}>
                Skip the wait. Pay in advance. No splitting required.
              </p>
            </div>
          </div>
        </div>

        {/* Add to Calendar prompt */}
        <AddToCalendarBanner event={event} />

        {/* Ticket wallet */}
        <div className="px-5 md:px-8 mb-4">
          <div className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
            style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid #F0E8EC" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#FFF0F5" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold" style={{ color: "#111" }}>Ticket saved to your wallet</p>
              <p className="text-[10px]" style={{ color: "#bbb" }}>All your events live in My Tickets</p>
            </div>
            <Link href="/member/happenings"
              className="px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex-shrink-0"
              style={{ background: "#FF1F7D", color: "white" }}>
              View →
            </Link>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 md:px-8 flex gap-3 mb-4">
          <button onClick={() => setShowInvite(true)} className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.97]"
            style={{ background: "#111111", color: "white" }}>
            💌 Invite a Bloomie
          </button>
          <Link href={`/member/plans?event=${event.id}`}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white inline-flex items-center justify-center active:scale-[0.97] transition-transform"
            style={{ background: "#FF1F7D", boxShadow: "0 4px 14px rgba(255,31,125,0.3)" }}>
            Plan Room →
          </Link>
        </div>

        <div className="px-5 md:px-8 pb-2">
          <p className="text-[10px] text-center" style={{ color: "#ccc" }}>✿ All women are verified. All vibes are real.</p>
        </div>

        {showInvite && <InviteSheet event={event} onClose={() => setShowInvite(false)} />}
      </div>
    );
  }

  // ── PAYMENT SHEET ──────────────────────────────────────────────────────────

  if (rsvpState === "paying") {
    return (
      <div className="min-h-screen pb-24" style={{ background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 30%, #FFF5F0 60%, #FFF0F8 100%)" }}>
        <div className="px-5 pt-12 pb-4 flex items-center gap-3">
          <button onClick={() => setRsvpState("idle")} className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
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

          {/* Secure checkout notice */}
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p className="text-sm text-center leading-relaxed" style={{ color: "#555" }}>
              You&apos;ll be taken to our secure payment page to complete your booking.
            </p>
          </div>

          {payError && (
            <p className="text-sm text-center" style={{ color: "#e53e3e" }}>{payError}</p>
          )}

          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full rounded-2xl text-base font-bold text-white transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "#FF1F7D", boxShadow: "0 6px 20px rgba(255,31,125,0.35)", padding: "18px" }}
          >
            {paying ? "Sending you to checkout…" : `Pay £${total} — Secure My Seat ✿`}
          </button>
          <p className="text-[10px] text-center" style={{ color: "#ccc" }}>✿ All women are verified. All vibes are real.</p>
        </div>
      </div>
    );
  }

  // ── DISCOVERY VIEW (idle) ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 30%, #FFF5F0 60%, #FFF0F8 100%)" }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-3 md:px-8 md:pt-8 flex items-center justify-between">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <p className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#111" }}>BLOOMBAY ✿</p>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
          </button>
          <button onClick={() => setSaved(s => !s)} className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
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
            <div className="flex flex-wrap gap-2">
              {ext.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: tag === "Women Only" ? "#111111" : "white", color: tag === "Women Only" ? "white" : "#555", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Photo collage */}
          <div className="px-5 md:px-0 mb-5 relative" style={{ height: "220px" }}>
            <div className="absolute left-0 top-0 w-3/5 h-full rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #330011, #FF1F7D44)" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl opacity-60">🕯️</span>
              </div>
              <div className="absolute bottom-3 left-3 w-16 h-16 rounded-full flex flex-col items-center justify-center"
                style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                <p className="text-[7px] font-black tracking-wider uppercase text-center leading-tight" style={{ color: "#FF1F7D" }}>CURATED<br/>BLOOMBAY</p>
                <span style={{ color: "#FF1F7D", fontSize: "14px" }}>✿</span>
              </div>
            </div>
            <div className="absolute right-0 top-0 bg-white p-2 pb-7 shadow-xl"
              style={{ width: "42%", transform: "rotate(2deg)", borderRadius: "4px", zIndex: 2 }}>
              <div className="w-full h-28 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #220008, #FF1F7D33)" }}>
                <span className="text-4xl">🥂</span>
              </div>
            </div>
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
              <div key={i} className="flex items-start gap-2.5 rounded-xl px-3 py-3"
                style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
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
          <div className="mb-5">
            <div className="px-5 md:px-0 flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#FF1F7D" }}>WHO&apos;S COMING</p>
              <p className="text-[10px] font-semibold italic" style={{ fontFamily: "var(--font-playfair)", color: "#bbb" }}>
                {ext.attendees.length} women · avg {Math.round(ext.attendees.reduce((s, a) => s + a.compatibility, 0) / ext.attendees.length)}% match
              </p>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2"
              style={{ paddingLeft: "20px", paddingRight: "20px", scrollbarWidth: "none" }}>
              {ext.attendees.map((a, i) => (
                <div key={i} className="flex-shrink-0 rounded-2xl overflow-hidden"
                  style={{ width: "110px", background: "white", boxShadow: "0 4px 14px rgba(0,0,0,0.07)" }}>
                  <div className="h-[60px] flex items-center justify-center relative"
                    style={{ background: `linear-gradient(135deg, ${a.color}66 0%, ${a.color}33 100%)` }}>
                    <span className="text-xl font-black" style={{ color: a.color }}>{a.initial}</span>
                    <div className="absolute top-1.5 right-1.5 rounded-full px-1.5 py-0.5"
                      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}>
                      <span className="text-[8px] font-black text-white">{a.compatibility}%</span>
                    </div>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-xs font-bold" style={{ color: "#111" }}>{a.name}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: "#bbb" }}>{a.tag.split("·")[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chemistry Preview */}
          <div className="px-5 md:px-0 mb-5 bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#FF1F7D" }}>CHEMISTRY PREVIEW</p>
            <div className="flex items-start gap-5">
              <div>
                <p className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "44px", color: "#FF1F7D" }}>{ext.chemistry}%</p>
                <p className="text-xs mt-1 italic" style={{ fontFamily: "var(--font-playfair)", color: "#aaa" }}>Amazing Match Energy ✿</p>
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
          {/* Reserve countdown */}
          <div className="rounded-2xl p-4 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#111" }}>RESERVE YOUR SEAT</p>
            <p className="text-[9px] mb-2" style={{ color: "#bbb" }}>ENDS IN</p>
            <div className="flex gap-2 items-center">
              {[{ n: "02", l: "DAYS" }, { n: "14", l: "HRS" }, { n: "37", l: "MINS" }, { n: "52", l: "SECS" }].map((t, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-10 rounded-lg flex items-center justify-center font-black text-lg"
                    style={{ background: "#111", color: "white", fontFamily: "var(--font-playfair)" }}>{t.n}</div>
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

          {/* 4 Intent CTAs */}
          <button onClick={handleRSVP}
            className="w-full rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.97]"
            style={{ background: "#FF1F7D", boxShadow: "0 6px 22px rgba(255,31,125,0.4)", padding: "17px" }}>
            {isFree ? "I'm Going ✿" : "I'm Going — Secure My Seat ✿"}
          </button>
          <button onClick={() => setSaved(true)}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]"
            style={{ background: "#FFF0F5", color: "#FF1F7D", border: "1.5px solid rgba(255,31,125,0.2)" }}>
            I Might Go — Remind me ◷
          </button>
          <button
            className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]"
            style={{ background: "white", color: "#888", border: "1.5px solid #E8E8E8" }}>
            Not sure yet
          </button>
          <button onClick={onBack}
            className="w-full py-2 text-xs font-medium transition-all active:opacity-60"
            style={{ color: "#ccc" }}>
            Maybe next time →
          </button>
          <p className="text-[10px] text-center" style={{ color: "#bbb" }}>✿ All women are verified. All vibes are real.</p>
        </div>
      </div>
    </div>
  );
}

// ── Catalog for direct-link event pages ──────────────────────────────────────

const DIRECT_EVENTS: Record<number, EventData> = {
  1: { id: 1, type: "gallery",  title: "Museum Girls",      venue: "Brooklyn Museum",      neighborhood: "Crown Heights", time: "Tonight · 7PM",    priceLabel: "Free", price: 0 },
  2: { id: 2, type: "class",    title: "Book Society",       venue: "McNally Jackson",      neighborhood: "West Village",  time: "Thursday · 7PM",   priceLabel: "Free", price: 0 },
  3: { id: 3, type: "rooftop",  title: "Dinner Society",     venue: "Carbone",              neighborhood: "SoHo",          time: "Friday · 8PM",     priceLabel: "$75",  price: 75 },
  4: { id: 4, type: "workshop", title: "Sunday Walk",        venue: "Grand Army Plaza",     neighborhood: "Prospect Park", time: "Sunday · 10AM",    priceLabel: "Free", price: 0 },
  5: { id: 5, type: "gallery",  title: "Women in Lens",      venue: "The Parlor Gallery",   neighborhood: "Bushwick",      time: "Tonight · 7PM",    priceLabel: "Free", price: 0 },
  6: { id: 6, type: "workshop", title: "Wheel Throwing",     venue: "Brooklyn Clay",        neighborhood: "Williamsburg",  time: "Tonight · 6:30PM", priceLabel: "$45",  price: 45 },
  7: { id: 7, type: "rooftop",  title: "Golden Hour",        venue: "Westlight Hotel",      neighborhood: "Williamsburg",  time: "Tonight · 8PM",    priceLabel: "$20",  price: 20 },
  8: { id: 8, type: "popup",    title: "Designers Pop-Up",   venue: "The Canvas Space",     neighborhood: "SoHo",          time: "Saturday · 12PM",  priceLabel: "Free", price: 0 },
};

export function StandaloneEventDetail({ eventId }: { eventId: string }) {
  const router = useRouter();
  const id = parseInt(eventId, 10);
  const event = DIRECT_EVENTS[id] ?? DIRECT_EVENTS[1];
  return <EventDetail event={event} onBack={() => router.back()} />;
}
