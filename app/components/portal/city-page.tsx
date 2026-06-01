"use client";

import { useState } from "react";

const TABS = ["Seats", "Events", "Celebrate", "Girl-Tested"];

// ── Types ────────────────────────────────────────────────────────────────────

type Privacy = "Public" | "Bloomies Only" | "Club Only" | "Invited Only";
type PaymentType = "advance" | "pay_in_person";

interface Seat {
  id: number;
  privacy: Privacy;
  seats: number;
  title: string;
  time: string;
  venue: string;
  host: string;
  paymentType: PaymentType;
  cashAmount?: number;
  price?: number;
  deposit: number;
  featured: boolean;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const SEATS: Seat[] = [
  {
    id: 1, privacy: "Public", seats: 2,
    title: "Girls dinner · Carbone", time: "Tonight 7:30PM", venue: "Carbone, SoHo",
    host: "Aaliyah M.", paymentType: "pay_in_person", cashAmount: 85,
    deposit: 5, featured: true,
  },
  {
    id: 2, privacy: "Bloomies Only", seats: 3,
    title: "Pilates + matcha morning", time: "Sunday 9AM", venue: "Studio Bloom, Williamsburg",
    host: "Sofia K.", paymentType: "advance", price: 20,
    deposit: 1, featured: false,
  },
  {
    id: 3, privacy: "Club Only", seats: 4,
    title: "MoMA + froyo after", time: "Saturday 2PM", venue: "MoMA, Midtown",
    host: "Priya R.", paymentType: "pay_in_person", cashAmount: 30,
    deposit: 1, featured: false,
  },
  {
    id: 4, privacy: "Public", seats: 6,
    title: "Rooftop golden hour · SoHo", time: "Friday 7PM", venue: "285 West, SoHo",
    host: "Naomi B.", paymentType: "advance", price: 0,
    deposit: 0, featured: true,
  },
  {
    id: 5, privacy: "Invited Only", seats: 1,
    title: "Coffee + walk · Prospect Park", time: "Saturday 10AM", venue: "Prospect Park S. entrance",
    host: "Deja W.", paymentType: "advance", price: 0,
    deposit: 0, featured: false,
  },
];

const EVENTS = [
  { id: 1, title: "Paint + sip + dinner",    detail: "Fri 7PM · $65 · 8 seats left",  host: "BloomBay Official", official: true },
  { id: 2, title: "Pasta night",             detail: "Sat 7PM · $55 · 10 seats left", host: "BloomBay Official", official: true },
  { id: 3, title: "Book club and sip",       detail: "Sat 4PM · $35 · 12 seats left", host: "Girl Creatives",    official: false },
  { id: 4, title: "Gym and juice morning",   detail: "Sun 8AM · $25 · 10 seats left", host: "Girls Who Move",    official: false },
  { id: 5, title: "Zumba and snacks",        detail: "Mon 6PM · $30 · 15 seats left", host: "Soft Life Club",    official: false },
  { id: 6, title: "Pilates and matcha",      detail: "Tue 7AM · $28 · 8 seats left",  host: "Bloom Wellness",    official: false },
  { id: 7, title: "Coffee morning walk",     detail: "Wed 8AM · Free · 20 spots",     host: "BloomBay Official", official: true },
  { id: 8, title: "Museum afternoon",        detail: "Thu 2PM · $22 · 6 seats left",  host: "Museum Girls NYC",  official: false },
];

const CELEBRATE = [
  { id: 1, initial: "A", name: "Aaliyah M.", event: "Birthday picnic",    quote: "“First birthday I am actually celebrating.”",         location: "Prospect Park · Sat 2PM",         seats: "4 seats · Free" },
  { id: 2, initial: "S", name: "Sofia K.",   event: "Promotion dinner",   quote: "“I got the job I was scared to apply for.”",          location: "Carbone · Fri 7PM · $85",         seats: "2 seats left" },
  { id: 3, initial: "P", name: "Priya R.",   event: "New apartment",      quote: "“Moved to NYC alone. Now I have a city.”",            location: "Williamsburg · Sun 3PM · Free",   seats: "6 seats" },
  { id: 4, initial: "Z", name: "Zara F.",    event: "One year in NYC",    quote: "“365 days and I finally feel like I belong here.”",   location: "Brooklyn Bridge Park · Sun 12PM · Free", seats: "8 seats" },
];

const GIRL_TESTED = [
  { id: 1, name: "Ladurée SoHo",      type: "Café",            tag: "FIRST DATE APPROVED", rating: "4.9", reviews: 38, soloRating: "4.8", desc: "Macarons, pink walls, the best afternoon light in the city. Women eat here alone regularly." },
  { id: 2, name: "Le Coucou",         type: "Restaurant",      tag: "GIRL APPROVED",       rating: "4.8", reviews: 27, soloRating: "4.5", desc: "French. Warm. Never once made a solo woman feel weird about her table for one." },
  { id: 3, name: "Figure 8 Pilates",  type: "Fitness",         tag: "GIRL APPROVED",       rating: "5.0", reviews: 44, soloRating: "5.0", desc: "Intense, beautiful, and a real community if you let it be." },
  { id: 4, name: "Strand Bookstore",  type: "Culture",         tag: "HIDDEN GEM",          rating: "4.7", reviews: 61, soloRating: "4.9", desc: "Three floors. Miles of books. Nobody asks why you are here alone." },
  { id: 5, name: "Blank Street",      type: "Café",            tag: "WORK FRIENDLY",       rating: "4.6", reviews: 52, soloRating: "4.7", desc: "Laptops welcome, outlets at every table, matcha that actually tastes like matcha." },
];

// ── Privacy styles ────────────────────────────────────────────────────────────

const PRIVACY_STYLE: Record<Privacy, { bg: string; color: string; symbol: string }> = {
  "Public":        { bg: "#E8F9F0", color: "#22A85A", symbol: "○" },
  "Bloomies Only": { bg: "#FFF0F5", color: "#FF1F7D", symbol: "⬡" },
  "Club Only":     { bg: "#EEF0FF", color: "#6366F1", symbol: "◈" },
  "Invited Only":  { bg: "#FFF8E8", color: "#D97706", symbol: "◆" },
};

// ── Seat Ticket Card ──────────────────────────────────────────────────────────

function SeatTicket({
  seat,
  reserved,
  onReserve,
  onDrop,
}: {
  seat: Seat;
  reserved: boolean;
  onReserve: () => void;
  onDrop: () => void;
}) {
  const ps = PRIVACY_STYLE[seat.privacy];

  const payLine =
    seat.paymentType === "pay_in_person"
      ? `Pay in person · exact cash $${seat.cashAmount}`
      : seat.price === 0
      ? "Free · book through app"
      : `$${seat.price} · pay through app`;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow: reserved ? "0 2px 16px rgba(255,31,125,0.1)" : "0 2px 12px rgba(0,0,0,0.06)",
        transform: reserved ? "scale(0.985)" : "scale(1)",
        transition: "all 0.3s ease",
      }}
    >
      {/* ── Body + Stub row ── */}
      <div className="flex">
        {/* Left: main body */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ background: ps.bg, color: ps.color }}
            >
              {ps.symbol} {seat.privacy}
            </span>
            {reserved && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#FFF0F5", color: "#FF1F7D" }}
              >
                ✓ Reserved
              </span>
            )}
          </div>

          <p className="font-bold text-base leading-snug" style={{ color: "#1A0514" }}>
            {seat.title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{seat.time} · {seat.venue}</p>
          <p className="text-xs font-semibold mt-1" style={{ color: "#FF1F7D" }}>{seat.host}</p>

          <div className="flex items-center gap-1.5 mt-3">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <p className="text-[11px] text-gray-400">{payLine}</p>
          </div>
        </div>

        {/* Right: tear line + stub */}
        <div
          className="w-[88px] flex-shrink-0 flex flex-col items-center justify-center gap-1 py-4 px-3"
          style={{ background: "#FFF5F8", borderLeft: "1.5px dashed #FECDD5" }}
        >
          <p className="text-3xl font-bold leading-none" style={{ color: "#FF1F7D" }}>{seat.seats}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">seats</p>
          {seat.deposit > 0 && (
            <>
              <div className="w-8 my-1" style={{ borderTop: "1px solid #FECDD5" }} />
              <p className="text-sm font-bold" style={{ color: "#1A0514" }}>${seat.deposit}</p>
              <p className="text-[10px] text-gray-400">deposit</p>
            </>
          )}
        </div>
      </div>

      {/* ── Action row ── */}
      <div
        className="px-4 py-3 flex items-center justify-between gap-3"
        style={{ borderTop: "1px solid #FFF0F5" }}
      >
        <p className="text-[11px] text-gray-400 flex-1 min-w-0">
          {seat.deposit > 0
            ? `$${seat.deposit} returns as wallet credit after you show up`
            : "No deposit required"}
        </p>
        {reserved ? (
          <button
            onClick={onDrop}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
            style={{ background: "#FFF0F5", color: "#FF1F7D", border: "1px solid #FECDD5" }}
          >
            Drop My Spot
          </button>
        ) : (
          <button
            onClick={onReserve}
            className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold text-white transition-all active:scale-95"
            style={{ background: "#FF1F7D" }}
          >
            Grab a seat
          </button>
        )}
      </div>
    </div>
  );
}

// ── Create Seat Sheet ─────────────────────────────────────────────────────────

function CreateSeatSheet({ onClose }: { onClose: () => void }) {
  const [title, setTitle]           = useState("");
  const [time, setTime]             = useState("");
  const [venue, setVenue]           = useState("");
  const [seats, setSeats]           = useState(2);
  const [privacy, setPrivacy]       = useState<Privacy>("Public");
  const [paymentType, setPaymentType] = useState<PaymentType>("advance");
  const [cashAmount, setCashAmount] = useState("");
  const [price, setPrice]           = useState("");
  const [deposit, setDeposit]       = useState("1");

  const privacyOptions: { key: Privacy; desc: string }[] = [
    { key: "Public",        desc: "Anyone on BloomBay" },
    { key: "Bloomies Only", desc: "Your connections" },
    { key: "Club Only",     desc: "Club members only" },
    { key: "Invited Only",  desc: "Women you invite" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-y-auto"
        style={{ background: "white", boxShadow: "0 -4px 40px rgba(0,0,0,0.15)", maxHeight: "88vh" }}
      >
        <div className="p-5 pb-10">
          <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold" style={{ color: "#1A0514", fontFamily: "var(--font-playfair)" }}>
              Create a Seat
            </h2>
            <button onClick={onClose} className="text-gray-300 p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                What are you doing?
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Girls dinner · Carbone"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#FFE0EE", color: "#1A0514" }}
              />
            </div>

            {/* Time + Venue */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">When</label>
                <input
                  type="text" value={time} onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. Friday 7:30PM"
                  className="w-full px-3 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#FFE0EE", color: "#1A0514" }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Where</label>
                <input
                  type="text" value={venue} onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Carbone, SoHo"
                  className="w-full px-3 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#FFE0EE", color: "#1A0514" }}
                />
              </div>
            </div>

            {/* Seat count */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Seats available
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSeats((s) => Math.max(1, s - 1))}
                  className="w-10 h-10 rounded-full text-xl font-bold flex items-center justify-center"
                  style={{ background: "#FFF0F5", color: "#FF1F7D" }}
                >
                  −
                </button>
                <p className="text-2xl font-bold w-8 text-center" style={{ color: "#1A0514" }}>{seats}</p>
                <button
                  onClick={() => setSeats((s) => Math.min(20, s + 1))}
                  className="w-10 h-10 rounded-full text-xl font-bold flex items-center justify-center"
                  style={{ background: "#FFF0F5", color: "#FF1F7D" }}
                >
                  +
                </button>
                <p className="text-xs text-gray-400">max 20. Individual pay always.</p>
              </div>
            </div>

            {/* Privacy */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Who can see this?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {privacyOptions.map(({ key, desc }) => {
                  const ps = PRIVACY_STYLE[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setPrivacy(key)}
                      className="flex items-start gap-2 px-3 py-2.5 rounded-xl border-2 text-left transition-all"
                      style={
                        privacy === key
                          ? { borderColor: "#FF1F7D", background: "#FFF0F5" }
                          : { borderColor: "#EEE", background: "white" }
                      }
                    >
                      <span className="text-sm mt-0.5">{ps.symbol}</span>
                      <div>
                        <p className="text-xs font-bold" style={{ color: privacy === key ? "#FF1F7D" : "#1A0514" }}>{key}</p>
                        <p className="text-[10px] text-gray-400">{desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment type */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                How do they pay?
              </label>
              <div className="flex gap-2 mb-3">
                {(["advance", "pay_in_person"] as PaymentType[]).map((pt) => (
                  <button
                    key={pt}
                    onClick={() => setPaymentType(pt)}
                    className="flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all"
                    style={
                      paymentType === pt
                        ? { borderColor: "#FF1F7D", background: "#FFF0F5", color: "#FF1F7D" }
                        : { borderColor: "#EEE", background: "white", color: "#555" }
                    }
                  >
                    {pt === "advance" ? "Through app" : "Pay in person"}
                  </button>
                ))}
              </div>

              {paymentType === "pay_in_person" && (
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Exact cash amount (shown to every guest — no splitting)
                  </label>
                  <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: "#FFE0EE" }}>
                    <span className="px-3 py-2.5 text-sm font-bold" style={{ background: "#FFF5F8", color: "#FF1F7D" }}>$</span>
                    <input
                      type="number" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)}
                      placeholder="0" min="0"
                      className="flex-1 px-3 py-2.5 text-sm outline-none"
                      style={{ color: "#1A0514" }}
                    />
                  </div>
                </div>
              )}

              {paymentType === "advance" && (
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Price (0 = free)</label>
                  <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: "#FFE0EE" }}>
                    <span className="px-3 py-2.5 text-sm font-bold" style={{ background: "#FFF5F8", color: "#FF1F7D" }}>$</span>
                    <input
                      type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                      placeholder="0" min="0"
                      className="flex-1 px-3 py-2.5 text-sm outline-none"
                      style={{ color: "#1A0514" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Deposit */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                Deposit ($0–$50)
              </label>
              <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: "#FFE0EE" }}>
                <span className="px-3 py-2.5 text-sm font-bold" style={{ background: "#FFF5F8", color: "#FF1F7D" }}>$</span>
                <input
                  type="number" value={deposit}
                  onChange={(e) => setDeposit(String(Math.min(50, Math.max(0, parseInt(e.target.value) || 0))))}
                  min="0" max="50"
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                  style={{ color: "#1A0514" }}
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Returns as wallet credit after confirmed attendance. Set 0 for no deposit.
              </p>
            </div>

            <button
              className="w-full py-4 rounded-full font-bold text-base text-white mt-1"
              style={{ background: "#FF1F7D" }}
            >
              Post Seat
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function CityPage() {
  const [activeTab, setActiveTab]     = useState(0);
  const [reservedSeats, setReservedSeats] = useState<Set<number>>(new Set());
  const [rsvpd, setRsvpd]             = useState<Set<number>>(new Set());
  const [showingUp, setShowingUp]     = useState<Set<number>>(new Set());
  const [showCreate, setShowCreate]   = useState(false);
  const [gtFilter, setGtFilter]       = useState("All");

  function reserveSeat(id: number) {
    setReservedSeats((prev) => new Set([...prev, id]));
  }
  function dropSeat(id: number) {
    setReservedSeats((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }

  const GT_FILTERS = ["All", "Cafés", "Restaurants", "Fitness", "Culture", "Work-Friendly"];

  const filteredSpots = GIRL_TESTED.filter(
    (s) => gtFilter === "All" || s.type.toLowerCase().includes(gtFilter.replace("-", " ").toLowerCase())
  );

  return (
    <div className="min-h-screen pb-36 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--bb-pink)" }}>NYC</p>
        <h1 className="text-4xl font-bold" style={{ color: "var(--bb-black)" }}>Happenings</h1>
        <p className="italic text-gray-400 mt-1 text-sm" style={{ fontFamily: "var(--font-playfair)" }}>
          The city is breathing tonight
        </p>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-5 overflow-x-auto md:px-8">
        <div className="flex gap-2 w-max pb-1">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95"
              style={
                activeTab === i
                  ? { background: "var(--bb-black)", color: "white" }
                  : { background: "white", color: "var(--bb-black)", border: "1.5px solid #E8E8E8" }
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 md:px-8">

        {/* ── SEATS ── */}
        {activeTab === 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SEATS.map((seat) => (
                <div
                  key={seat.id}
                  className={seat.featured ? "md:col-span-2" : ""}
                >
                  <SeatTicket
                    seat={seat}
                    reserved={reservedSeats.has(seat.id)}
                    onReserve={() => reserveSeat(seat.id)}
                    onDrop={() => dropSeat(seat.id)}
                  />
                </div>
              ))}
            </div>

            {/* Create a Seat CTA */}
            <button
              onClick={() => setShowCreate(true)}
              className="mt-5 w-full rounded-2xl p-5 flex items-center gap-4 transition-all active:scale-[0.99]"
              style={{ background: "#1A0514", boxShadow: "0 4px 20px rgba(26,5,20,0.12)" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,31,125,0.15)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-base text-white">Create a Seat</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Invite women to your table, activity, or gathering
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {showCreate && <CreateSeatSheet onClose={() => setShowCreate(false)} />}
          </div>
        )}

        {/* ── EVENTS ── */}
        {activeTab === 1 && (
          <div className="flex flex-col gap-3">
            <div
              className="rounded-2xl p-4 flex items-center gap-3 mb-1"
              style={{ background: "#1A0514" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#FF1F7D" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#FF1F7D" }}>
                  BLOOMBAY OFFICIAL
                </p>
                <p className="text-white text-sm font-semibold">Curated by the BloomBay team</p>
              </div>
            </div>

            {EVENTS.map((evt) => {
              const going = rsvpd.has(evt.id);
              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-2xl p-4 flex items-center gap-4"
                  style={{
                    boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
                    borderLeft: evt.official ? "3px solid #FF1F7D" : "3px solid transparent",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#FF1F7D,#1A0514)" }}
                  >
                    {evt.official && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)">
                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm leading-snug" style={{ color: "var(--bb-black)" }}>{evt.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{evt.detail}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {evt.official && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="#FF1F7D">
                          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>
                      )}
                      <p className="text-xs font-bold" style={{ color: "var(--bb-pink)" }}>{evt.host}</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setRsvpd((prev) => {
                        const n = new Set(prev);
                        if (n.has(evt.id)) n.delete(evt.id); else n.add(evt.id);
                        return n;
                      })
                    }
                    className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all active:scale-90"
                    style={
                      going
                        ? { background: "var(--bb-pink)", color: "white", borderColor: "var(--bb-pink)" }
                        : { borderColor: "var(--bb-pink)", color: "var(--bb-pink)", background: "transparent" }
                    }
                  >
                    {going ? "Going ✓" : "RSVP"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── CELEBRATE ── */}
        {activeTab === 2 && (
          <div>
            <div className="rounded-3xl p-5 mb-5" style={{ background: "var(--light-pink)" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--bb-pink)" }}>
                SHOW UP · BE THERE
              </p>
              <p
                className="italic text-base leading-relaxed"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
              >
                Real milestones. Real women. Show up for a stranger and she becomes someone you know.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {CELEBRATE.map((c) => {
                const attending = showingUp.has(c.id);
                return (
                  <div key={c.id} className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: "var(--bb-pink)" }}
                      >
                        {c.initial}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{c.name}</p>
                        <p className="text-sm text-gray-400">{c.event}</p>
                      </div>
                    </div>
                    <div className="rounded-2xl p-3 mb-3" style={{ background: "var(--pale-pink-bg)" }}>
                      <p className="italic text-sm" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>
                        {c.quote}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">{c.location}</p>
                        <p className="text-xs font-bold mt-0.5" style={{ color: "var(--bb-pink)" }}>{c.seats}</p>
                      </div>
                      <button
                        onClick={() => setShowingUp((prev) => new Set([...prev, c.id]))}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all active:scale-90"
                        style={
                          attending
                            ? { background: "var(--light-pink)", color: "var(--bb-pink)" }
                            : { background: "var(--bb-pink)", color: "white" }
                        }
                      >
                        {attending ? "You're going ✓" : "Show up"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── GIRL-TESTED ── */}
        {activeTab === 3 && (
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl p-5 mb-0" style={{ background: "#1A0514" }}>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-1"
                style={{ color: "var(--mid-pink)" }}
              >
                GIRL-TESTED · VERIFIED
              </p>
              <p
                className="text-white font-bold text-xl italic"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}
              >
                The city through her eyes.
              </p>
              <p className="text-white/50 text-xs mt-1">
                Reviewed by real BloomBay women. Safe solo ratings included.
              </p>
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {GT_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setGtFilter(f)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
                  style={
                    gtFilter === f
                      ? { background: "var(--bb-pink)", color: "white" }
                      : { background: "white", color: "#1A0514", border: "1.5px solid #E8E8E8" }
                  }
                >
                  {f}
                </button>
              ))}
            </div>

            {filteredSpots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-3xl overflow-hidden"
                style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="h-20 flex items-end p-3"
                  style={{ background: "linear-gradient(135deg,#FF1F7D,#1A0514)" }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold text-base">{spot.name}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
                    >
                      {spot.tag}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-gray-400 mb-1.5">{spot.type}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{spot.desc}</p>
                  <div className="flex items-center gap-5 mt-3">
                    <div className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF1F7D">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="text-sm font-bold" style={{ color: "#1A0514" }}>{spot.rating}</span>
                      <span className="text-xs text-gray-400">({spot.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22A85A" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      </svg>
                      <span className="text-xs text-gray-400">Solo:</span>
                      <span className="text-xs font-semibold" style={{ color: "#22A85A" }}>{spot.soloRating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
