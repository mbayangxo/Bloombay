"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Privacy = "Public" | "Bloomies Only" | "Club Only" | "Invited Only";
type PaymentType = "advance" | "pay_in_person";
type TimeTag = "today" | "tonight" | "weekend";
type HappeningType = "gallery" | "popup" | "rooftop" | "workshop" | "class" | "festival";

interface Happening {
  id: number;
  type: HappeningType;
  title: string;
  venue: string;
  neighborhood: string;
  time: string;
  timeTag: TimeTag;
  price: number;
  priceLabel: string;
  womenLoved: boolean;
  featured: boolean;
  partner?: string;
  gradient: string;
}

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

const HAPPENINGS: Happening[] = [
  {
    id: 1, type: "gallery",
    title: "Soft Opening: Women in Lens",
    venue: "The Parlor Gallery", neighborhood: "Bushwick",
    time: "Tonight · 7PM", timeTag: "tonight",
    price: 0, priceLabel: "Free",
    womenLoved: true, featured: true,
    gradient: "linear-gradient(160deg, #1a0a22 0%, #5a1a4a 100%)",
  },
  {
    id: 2, type: "workshop",
    title: "Wheel Throwing for Beginners",
    venue: "Brooklyn Clay", neighborhood: "Williamsburg",
    time: "Tonight · 6:30PM", timeTag: "tonight",
    price: 45, priceLabel: "$45",
    womenLoved: true, featured: false,
    partner: "Brooklyn Clay",
    gradient: "linear-gradient(160deg, #1a1208 0%, #4a3010 100%)",
  },
  {
    id: 3, type: "rooftop",
    title: "Golden Hour at Westlight",
    venue: "Westlight Hotel", neighborhood: "Williamsburg",
    time: "Tonight · 8PM", timeTag: "tonight",
    price: 20, priceLabel: "$20",
    womenLoved: false, featured: false,
    gradient: "linear-gradient(160deg, #0a0a1a 0%, #1a2a4a 100%)",
  },
  {
    id: 4, type: "popup",
    title: "Local Designers Pop-Up Market",
    venue: "The Canvas Space", neighborhood: "SoHo",
    time: "This Weekend · Sat 12–6PM", timeTag: "weekend",
    price: 0, priceLabel: "Free",
    womenLoved: true, featured: false,
    gradient: "linear-gradient(160deg, #2a0a10 0%, #6a1a2a 100%)",
  },
  {
    id: 5, type: "class",
    title: "Morning Pilates in the Park",
    venue: "Sheep Meadow, Central Park", neighborhood: "Midtown",
    time: "Today · 8AM", timeTag: "today",
    price: 15, priceLabel: "$15",
    womenLoved: true, featured: false,
    partner: "Form Pilates",
    gradient: "linear-gradient(160deg, #0a1a0a 0%, #1a3a1a 100%)",
  },
  {
    id: 6, type: "festival",
    title: "Brooklyn Night Bazaar",
    venue: "Industry City", neighborhood: "Sunset Park",
    time: "This Weekend · Sat–Sun", timeTag: "weekend",
    price: 0, priceLabel: "Free",
    womenLoved: true, featured: false,
    gradient: "linear-gradient(160deg, #0a0a20 0%, #2a0a3a 100%)",
  },
  {
    id: 7, type: "class",
    title: "Bookbinding Workshop",
    venue: "McNally Jackson", neighborhood: "Nolita",
    time: "Today · 3PM", timeTag: "today",
    price: 30, priceLabel: "$30",
    womenLoved: false, featured: false,
    partner: "McNally Jackson",
    gradient: "linear-gradient(160deg, #1a0808 0%, #3a1010 100%)",
  },
  {
    id: 8, type: "gallery",
    title: "First Friday: New Figurative Works",
    venue: "Tanya Bonakdar Gallery", neighborhood: "Chelsea",
    time: "This Weekend · Fri 6PM", timeTag: "weekend",
    price: 0, priceLabel: "Free",
    womenLoved: false, featured: false,
    gradient: "linear-gradient(160deg, #1a1a1a 0%, #3a1a3a 100%)",
  },
];

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
];

const CELEBRATE = [
  { id: 1, initial: "A", name: "Aaliyah M.", event: "Birthday picnic",   quote: "First birthday I'm actually celebrating.", location: "Prospect Park · Sat 2PM", seats: "4 seats · Free" },
  { id: 2, initial: "S", name: "Sofia K.",   event: "Promotion dinner",  quote: "I got the job I was scared to apply for.",   location: "Carbone · Fri 7PM · $85", seats: "2 seats left" },
  { id: 3, initial: "P", name: "Priya R.",   event: "New apartment",     quote: "Moved to NYC alone. Now I have a city.",     location: "Williamsburg · Sun 3PM · Free", seats: "6 seats" },
];

const GIRL_TESTED = [
  { id: 1, name: "Ladurée SoHo",     type: "Café",       tag: "FIRST DATE APPROVED", rating: "4.9", soloRating: "4.8", desc: "Macarons, pink walls, the best afternoon light in the city." },
  { id: 2, name: "Figure 8 Pilates", type: "Fitness",    tag: "GIRL APPROVED",       rating: "5.0", soloRating: "5.0", desc: "Intense, beautiful, and a real community if you let it be." },
  { id: 3, name: "Strand Bookstore", type: "Culture",    tag: "HIDDEN GEM",          rating: "4.7", soloRating: "4.9", desc: "Three floors. Miles of books. Nobody asks why you're alone." },
];

// ── Constants ────────────────────────────────────────────────────────────────

const FILTERS = ["Tonight", "Today", "This Weekend", "Free", "Near Me", "Women-Loved"] as const;
type Filter = typeof FILTERS[number];

const TYPE_LABEL: Record<HappeningType, string> = {
  gallery: "GALLERY",
  popup: "POP-UP",
  rooftop: "ROOFTOP NIGHT",
  workshop: "WORKSHOP",
  class: "CLASS",
  festival: "FESTIVAL",
};

const PRIVACY_STYLE: Record<Privacy, { bg: string; color: string; symbol: string }> = {
  "Public":        { bg: "#E8F9F0", color: "#22A85A", symbol: "○" },
  "Bloomies Only": { bg: "#FFF0F5", color: "#FF1F7D", symbol: "⬡" },
  "Club Only":     { bg: "#EEF0FF", color: "#6366F1", symbol: "◈" },
  "Invited Only":  { bg: "#FFF8E8", color: "#D97706", symbol: "◆" },
};

// ── Happening Card ────────────────────────────────────────────────────────────

function HappeningCard({ h, featured }: { h: Happening; featured?: boolean }) {
  const [saved, setSaved] = useState(false);
  const [going, setGoing] = useState(false);

  return (
    <div
      className={`rounded-3xl overflow-hidden bg-white${featured ? " md:col-span-2" : ""}`}
      style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.07)" }}
    >
      {/* Visual area */}
      <div
        className="relative"
        style={{ height: featured ? "220px" : "150px", background: h.gradient }}
      >
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider"
                style={{ background: "rgba(255,255,255,0.18)", color: "white", backdropFilter: "blur(6px)" }}
              >
                {TYPE_LABEL[h.type]}
              </span>
              {h.womenLoved && (
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "#FF1F7D", color: "white" }}
                >
                  ♡ Women-Loved
                </span>
              )}
              {h.partner && (
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
                >
                  BB × {h.partner}
                </span>
              )}
            </div>
            <button
              onClick={() => setSaved((s) => !s)}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
              style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "white" : "none"} stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>

          {/* Bottom row */}
          <div>
            {featured && (
              <h3
                className="font-bold text-white mb-1.5 leading-tight"
                style={{ fontSize: "20px", fontFamily: "var(--font-playfair)", fontWeight: 500 }}
              >
                {h.title}
              </h3>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-white/75">{h.time}</span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-xs text-white/75">{h.neighborhood}</span>
              <span
                className="ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                style={{
                  background: h.price === 0 ? "rgba(34,168,90,0.4)" : "rgba(255,255,255,0.18)",
                  color: "white",
                }}
              >
                {h.priceLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-4 py-3.5 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          {!featured && (
            <p className="font-bold text-sm leading-snug" style={{ color: "#1A0514" }}>
              {h.title}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-0.5 truncate">{h.venue}</p>
        </div>
        <button
          onClick={() => setGoing((g) => !g)}
          className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95"
          style={
            going
              ? { background: "#FFF0F5", color: "#FF1F7D" }
              : { background: "#FF1F7D", color: "white" }
          }
        >
          {going ? "Going ✓" : "I'm going"}
        </button>
      </div>
    </div>
  );
}

// ── Seat Ticket ───────────────────────────────────────────────────────────────

function SeatTicket({
  seat, reserved, onReserve, onDrop,
}: {
  seat: Seat; reserved: boolean; onReserve: () => void; onDrop: () => void;
}) {
  const ps = PRIVACY_STYLE[seat.privacy];
  const payLine =
    seat.paymentType === "pay_in_person"
      ? `Exact cash · $${seat.cashAmount}`
      : seat.price === 0 ? "Free" : `$${seat.price} · through app`;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex-shrink-0"
      style={{
        width: "280px",
        boxShadow: reserved ? "0 2px 16px rgba(255,31,125,0.1)" : "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex">
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: ps.bg, color: ps.color }}>
              {ps.symbol} {seat.privacy}
            </span>
            {reserved && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#FFF0F5", color: "#FF1F7D" }}>
                ✓ Reserved
              </span>
            )}
          </div>
          <p className="font-bold text-sm leading-snug" style={{ color: "#1A0514" }}>{seat.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{seat.time}</p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: "#FF1F7D" }}>{seat.host}</p>
          <p className="text-[11px] text-gray-400 mt-2">{payLine}</p>
        </div>
        <div className="w-[76px] flex-shrink-0 flex flex-col items-center justify-center gap-0.5 py-4 px-2"
             style={{ background: "#FFF5F8", borderLeft: "1.5px dashed #FECDD5" }}>
          <p className="text-2xl font-bold" style={{ color: "#FF1F7D" }}>{seat.seats}</p>
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
      <div className="px-4 py-2.5 flex items-center justify-between gap-2" style={{ borderTop: "1px solid #FFF0F5" }}>
        <p className="text-[11px] text-gray-400 flex-1 min-w-0 truncate">
          {seat.deposit > 0 ? `$${seat.deposit} back as credit when you show up` : "No deposit"}
        </p>
        {reserved ? (
          <button onClick={onDrop}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: "#FFF0F5", color: "#FF1F7D", border: "1px solid #FECDD5" }}>
            Drop spot
          </button>
        ) : (
          <button onClick={onReserve}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ background: "#FF1F7D" }}>
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
              Post a Seat
            </h2>
            <button onClick={onClose} className="text-gray-300 p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">What are you doing?</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Girls dinner · Carbone"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#FFE0EE", color: "#1A0514" }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">When</label>
                <input type="text" value={time} onChange={(e) => setTime(e.target.value)}
                  placeholder="Friday 7:30PM"
                  className="w-full px-3 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#FFE0EE", color: "#1A0514" }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Where</label>
                <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)}
                  placeholder="Carbone, SoHo"
                  className="w-full px-3 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#FFE0EE", color: "#1A0514" }} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Seats available</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setSeats((s) => Math.max(1, s - 1))}
                  className="w-10 h-10 rounded-full text-xl font-bold flex items-center justify-center"
                  style={{ background: "#FFF0F5", color: "#FF1F7D" }}>−</button>
                <p className="text-2xl font-bold w-8 text-center" style={{ color: "#1A0514" }}>{seats}</p>
                <button onClick={() => setSeats((s) => Math.min(20, s + 1))}
                  className="w-10 h-10 rounded-full text-xl font-bold flex items-center justify-center"
                  style={{ background: "#FFF0F5", color: "#FF1F7D" }}>+</button>
                <p className="text-xs text-gray-400">Individual pay always.</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Who can see this?</label>
              <div className="grid grid-cols-2 gap-2">
                {privacyOptions.map(({ key, desc }) => {
                  const ps = PRIVACY_STYLE[key];
                  return (
                    <button key={key} onClick={() => setPrivacy(key)}
                      className="flex items-start gap-2 px-3 py-2.5 rounded-xl border-2 text-left transition-all"
                      style={privacy === key
                        ? { borderColor: "#FF1F7D", background: "#FFF0F5" }
                        : { borderColor: "#EEE", background: "white" }}>
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

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">How do they pay?</label>
              <div className="flex gap-2 mb-3">
                {(["advance", "pay_in_person"] as PaymentType[]).map((pt) => (
                  <button key={pt} onClick={() => setPaymentType(pt)}
                    className="flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all"
                    style={paymentType === pt
                      ? { borderColor: "#FF1F7D", background: "#FFF0F5", color: "#FF1F7D" }
                      : { borderColor: "#EEE", background: "white", color: "#555" }}>
                    {pt === "advance" ? "Through app" : "Pay in person"}
                  </button>
                ))}
              </div>
              {paymentType === "pay_in_person" && (
                <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: "#FFE0EE" }}>
                  <span className="px-3 py-2.5 text-sm font-bold" style={{ background: "#FFF5F8", color: "#FF1F7D" }}>$</span>
                  <input type="number" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="Exact cash amount"
                    className="flex-1 px-3 py-2.5 text-sm outline-none" style={{ color: "#1A0514" }} />
                </div>
              )}
              {paymentType === "advance" && (
                <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: "#FFE0EE" }}>
                  <span className="px-3 py-2.5 text-sm font-bold" style={{ background: "#FFF5F8", color: "#FF1F7D" }}>$</span>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price (0 = free)"
                    className="flex-1 px-3 py-2.5 text-sm outline-none" style={{ color: "#1A0514" }} />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Deposit ($0–$50)</label>
              <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: "#FFE0EE" }}>
                <span className="px-3 py-2.5 text-sm font-bold" style={{ background: "#FFF5F8", color: "#FF1F7D" }}>$</span>
                <input type="number" value={deposit}
                  onChange={(e) => setDeposit(String(Math.min(50, Math.max(0, parseInt(e.target.value) || 0))))}
                  min="0" max="50"
                  className="flex-1 px-3 py-2.5 text-sm outline-none" style={{ color: "#1A0514" }} />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Returns as wallet credit when she shows up.</p>
            </div>

            <button className="w-full py-4 rounded-full font-bold text-base text-white mt-1"
                    style={{ background: "#FF1F7D" }}>
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
  const [activeFilter, setActiveFilter] = useState<Filter>("Tonight");
  const [reservedSeats, setReservedSeats] = useState<Set<number>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [showingUp, setShowingUp]   = useState<Set<number>>(new Set());
  const [gtFilter, setGtFilter]     = useState("All");

  const GT_FILTERS = ["All", "Cafés", "Fitness", "Culture"];

  function reserveSeat(id: number) { setReservedSeats((p) => new Set([...p, id])); }
  function dropSeat(id: number) { setReservedSeats((p) => { const n = new Set(p); n.delete(id); return n; }); }

  const filtered = HAPPENINGS.filter((h) => {
    if (activeFilter === "Tonight")      return h.timeTag === "tonight";
    if (activeFilter === "Today")        return h.timeTag === "today" || h.timeTag === "tonight";
    if (activeFilter === "This Weekend") return h.timeTag === "weekend";
    if (activeFilter === "Free")         return h.price === 0;
    if (activeFilter === "Women-Loved")  return h.womenLoved;
    return true;
  });

  const featured  = filtered.find((h) => h.featured);
  const rest      = filtered.filter((h) => !h.featured);

  return (
    <div className="min-h-screen pb-36 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>

      {/* ── Header ── */}
      <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>NYC</p>
          <span className="text-xs text-gray-300">·</span>
          <p className="text-xs text-gray-400">Monday, June 1</p>
        </div>
        <h1 className="text-4xl font-bold" style={{ color: "var(--bb-black)" }}>Happenings</h1>
        <p className="text-sm italic text-gray-400 mt-0.5" style={{ fontFamily: "var(--font-playfair)" }}>
          What&apos;s happening in the city.
        </p>
      </div>

      {/* ── Filter chips ── */}
      <div className="px-5 mb-5 overflow-x-auto md:px-8">
        <div className="flex gap-2 w-max pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95"
              style={activeFilter === f
                ? { background: "#1A0514", color: "white" }
                : { background: "white", color: "#555", border: "1.5px solid #E8E8E8" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 md:px-8 flex flex-col gap-10">

        {/* ── City events ── */}
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-3xl p-10 text-center" style={{ background: "white" }}>
              <p className="text-gray-400 text-sm">Nothing matching right now. Try a different filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featured && <HappeningCard h={featured} featured />}
              {rest.map((h) => <HappeningCard key={h.id} h={h} />)}
            </div>
          )}
        </div>

        {/* ── BloomBay Seats ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>OPEN SEATS</p>
              <p className="font-bold text-base mt-0.5" style={{ color: "var(--bb-black)" }}>Women making plans near you</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white"
              style={{ background: "#FF1F7D" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="1" x2="6" y2="11" /><line x1="1" y1="6" x2="11" y2="6" />
              </svg>
              Post a seat
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {SEATS.map((seat) => (
              <SeatTicket
                key={seat.id}
                seat={seat}
                reserved={reservedSeats.has(seat.id)}
                onReserve={() => reserveSeat(seat.id)}
                onDrop={() => dropSeat(seat.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Show up · Be there ── */}
        <div>
          <div className="mb-3">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>SHOW UP · BE THERE</p>
            <p className="font-bold text-base mt-0.5" style={{ color: "var(--bb-black)" }}>Celebrate with her</p>
          </div>
          <div className="flex flex-col gap-3">
            {CELEBRATE.map((c) => {
              const attending = showingUp.has(c.id);
              return (
                <div key={c.id} className="bg-white rounded-2xl p-4 flex items-center gap-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                       style={{ background: "#FF1F7D" }}>
                    {c.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: "#1A0514" }}>{c.name} · <span className="font-normal text-gray-500">{c.event}</span></p>
                    <p className="italic text-xs text-gray-500 mt-0.5 truncate" style={{ fontFamily: "var(--font-playfair)" }}>
                      &ldquo;{c.quote}&rdquo;
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{c.location} · <span style={{ color: "#FF1F7D", fontWeight: 600 }}>{c.seats}</span></p>
                  </div>
                  <button
                    onClick={() => setShowingUp((p) => new Set([...p, c.id]))}
                    className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-90"
                    style={attending
                      ? { background: "#FFF0F5", color: "#FF1F7D" }
                      : { background: "#FF1F7D", color: "white" }}
                  >
                    {attending ? "Going ✓" : "Show up"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Women-Loved spots ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>WOMEN-LOVED</p>
              <p className="font-bold text-base mt-0.5" style={{ color: "var(--bb-black)" }}>The city through her eyes</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {GT_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setGtFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
                style={gtFilter === f
                  ? { background: "#FF1F7D", color: "white" }
                  : { background: "white", color: "#555", border: "1.5px solid #E8E8E8" }}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {GIRL_TESTED
              .filter((s) => gtFilter === "All" || s.type.toLowerCase().includes(gtFilter.replace("-", " ").toLowerCase().slice(0, -1)))
              .map((spot) => (
                <div key={spot.id} className="bg-white rounded-2xl overflow-hidden flex" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div className="w-2 flex-shrink-0" style={{ background: "#FF1F7D" }} />
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-bold text-sm" style={{ color: "#1A0514" }}>{spot.name}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: "#FFF0F5", color: "#FF1F7D" }}>
                        {spot.tag}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{spot.desc}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#FF1F7D">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span className="text-xs font-bold" style={{ color: "#1A0514" }}>{spot.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22A85A" strokeWidth="2" strokeLinecap="round">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                        </svg>
                        <span className="text-xs text-gray-400">Solo</span>
                        <span className="text-xs font-semibold" style={{ color: "#22A85A" }}>{spot.soloRating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>

      {showCreate && <CreateSeatSheet onClose={() => setShowCreate(false)} />}
    </div>
  );
}
