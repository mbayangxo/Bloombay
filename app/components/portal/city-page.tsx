"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Privacy = "Public" | "Bloomies Only" | "Club Only" | "Invited Only";
type PaymentType = "advance" | "pay_in_person";
type TimeTag = "today" | "tonight" | "weekend";
type HappeningType = "gallery" | "popup" | "rooftop" | "workshop" | "class" | "festival";
type PlaceType = "place" | "eat" | "gem";
type PlaceFilter = "All" | "Places" | "Eats" | "Gems";

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
  userSubmitted?: boolean;
  submittedBy?: string;
}

interface Place {
  id: number;
  type: PlaceType;
  name: string;
  neighborhood: string;
  review: string;
  submittedBy: string;
  rating: number;
  stamps: number;
  category?: string;
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

const INITIAL_HAPPENINGS: Happening[] = [
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

const INITIAL_PLACES: Place[] = [
  // Girl Places
  { id: 1, type: "place", name: "The High Line", neighborhood: "Chelsea", review: "Best morning walk in the city, especially early before crowds.", submittedBy: "Sofia K.", rating: 4.8, stamps: 127 },
  { id: 2, type: "place", name: "Brooklyn Bridge Park", neighborhood: "DUMBO", review: "Golden hour from the pier. Bring a blanket and stay for hours.", submittedBy: "Priya R.", rating: 4.9, stamps: 203 },
  // Girl Eats
  { id: 3, type: "eat", name: "Sadelle's", neighborhood: "SoHo", review: "The smoked fish platter for brunch. Every time.", submittedBy: "Aaliyah M.", rating: 4.9, stamps: 89 },
  { id: 4, type: "eat", name: "Bangkok Supper Club", neighborhood: "Lower East Side", review: "The tom yum is religious. Go late, go often.", submittedBy: "Jade O.", rating: 4.8, stamps: 64 },
  { id: 5, type: "eat", name: "La Mercerie", neighborhood: "SoHo", review: "Quiet, elegant, the best croissant. Perfect solo lunch.", submittedBy: "Naomi B.", rating: 4.7, stamps: 44 },
  // Girl Gems
  { id: 6, type: "gem", name: "McNally Jackson Café", neighborhood: "Nolita", review: "Tiny tables, good coffee, and nobody bothers you for hours.", submittedBy: "Rachel M.", rating: 4.8, stamps: 71 },
  { id: 7, type: "gem", name: "Russ & Daughters Café", neighborhood: "Lower East Side", review: "The OG. Bagels, lox, and history on every wall.", submittedBy: "Deja W.", rating: 4.7, stamps: 55 },
  { id: 8, type: "gem", name: "Archway Café under the Manhattan Bridge", neighborhood: "DUMBO", review: "Nobody knows about this. Best kept secret in Brooklyn.", submittedBy: "Zara F.", rating: 5.0, stamps: 38 },
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

const PLACE_TYPE_LABEL: Record<PlaceType, string> = {
  place: "GIRL PLACE",
  eat: "GIRL EAT",
  gem: "GIRL GEM",
};

const PRIVACY_STYLE: Record<Privacy, { bg: string; color: string; symbol: string }> = {
  "Public":        { bg: "#E8F9F0", color: "#22A85A", symbol: "○" },
  "Bloomies Only": { bg: "#FFF0F5", color: "#FF1F7D", symbol: "⬡" },
  "Club Only":     { bg: "#EEF0FF", color: "#6366F1", symbol: "◈" },
  "Invited Only":  { bg: "#FFF8E8", color: "#D97706", symbol: "◆" },
};

const HAPPENING_GRADIENTS: Record<HappeningType, string> = {
  gallery: "linear-gradient(160deg, #1a0a22 0%, #5a1a4a 100%)",
  popup: "linear-gradient(160deg, #2a0a10 0%, #6a1a2a 100%)",
  rooftop: "linear-gradient(160deg, #0a0a1a 0%, #1a2a4a 100%)",
  workshop: "linear-gradient(160deg, #1a1208 0%, #4a3010 100%)",
  class: "linear-gradient(160deg, #0a1a0a 0%, #1a3a1a 100%)",
  festival: "linear-gradient(160deg, #0a0a20 0%, #2a0a3a 100%)",
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
              {h.userSubmitted && (
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
                >
                  ✦ Community
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

// ── Add Popup Sheet ───────────────────────────────────────────────────────────

function AddPopupSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (h: Happening) => void }) {
  const [name, setName]           = useState("");
  const [type, setType]           = useState<HappeningType>("popup");
  const [dateTime, setDateTime]   = useState("");
  const [location, setLocation]   = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [price, setPrice]         = useState("0");
  const [description, setDescription] = useState("");

  const eventTypes: { key: HappeningType; label: string }[] = [
    { key: "gallery", label: "Gallery" },
    { key: "popup", label: "Pop-up" },
    { key: "workshop", label: "Workshop" },
    { key: "rooftop", label: "Rooftop" },
    { key: "class", label: "Class" },
    { key: "festival", label: "Festival" },
  ];

  function handlePost() {
    if (!name.trim()) return;
    const priceNum = parseFloat(price) || 0;
    const newHappening: Happening = {
      id: Date.now(),
      type,
      title: name.trim(),
      venue: location.trim() || "TBD",
      neighborhood: neighborhood.trim() || "NYC",
      time: dateTime.trim() || "TBD",
      timeTag: "tonight",
      price: priceNum,
      priceLabel: priceNum === 0 ? "Free" : `$${priceNum}`,
      womenLoved: false,
      featured: false,
      gradient: HAPPENING_GRADIENTS[type],
      userSubmitted: true,
    };
    onAdd(newHappening);
    onClose();
  }

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
              Add a pop-up
            </h2>
            <button onClick={onClose} className="text-gray-300 p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Event name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ceramics Pop-Up in the Village"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#FFE0EE", color: "#1A0514" }} />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Type</label>
              <div className="flex flex-wrap gap-2">
                {eventTypes.map(({ key, label }) => (
                  <button key={key} onClick={() => setType(key)}
                    className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all"
                    style={type === key
                      ? { background: "#FF1F7D", color: "white" }
                      : { background: "#FFF5F8", color: "#555", border: "1.5px solid #FFE0EE" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Date &amp; time</label>
              <input type="text" value={dateTime} onChange={(e) => setDateTime(e.target.value)}
                placeholder="e.g. Saturday · 2PM–6PM"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#FFE0EE", color: "#1A0514" }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                  placeholder="Venue name or address"
                  className="w-full px-3 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#FFE0EE", color: "#1A0514" }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Neighborhood</label>
                <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. SoHo"
                  className="w-full px-3 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#FFE0EE", color: "#1A0514" }} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Price (0 = free)</label>
              <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: "#FFE0EE" }}>
                <span className="px-3 py-2.5 text-sm font-bold" style={{ background: "#FFF5F8", color: "#FF1F7D" }}>$</span>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                  min="0" placeholder="0"
                  className="flex-1 px-3 py-2.5 text-sm outline-none" style={{ color: "#1A0514" }} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                Description <span className="text-gray-300 normal-case font-normal">({description.length}/200)</span>
              </label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                placeholder="Tell us about this event..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                style={{ borderColor: "#FFE0EE", color: "#1A0514" }} />
            </div>

            <button onClick={handlePost}
              className="w-full py-4 rounded-full font-bold text-base text-white mt-1"
              style={{ background: "#FF1F7D" }}>
              Post it
            </button>
          </div>
        </div>
      </div>
    </>
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

// ── Place Card ────────────────────────────────────────────────────────────────

function PlaceCard({ place, stamped, onStamp }: { place: Place; stamped: boolean; onStamp: () => void }) {
  const typeColors: Record<PlaceType, { bg: string; color: string }> = {
    place: { bg: "#FFF0F5", color: "#FF1F7D" },
    eat: { bg: "#FFF8E8", color: "#D97706" },
    gem: { bg: "#EEF0FF", color: "#6366F1" },
  };
  const tc = typeColors[place.type];

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
      {/* Pink accent stripe */}
      <div className="w-1 flex-shrink-0" style={{ background: "#FF1F7D" }} />
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider"
                style={{ background: tc.bg, color: tc.color }}
              >
                {PLACE_TYPE_LABEL[place.type]}
              </span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "#F5F5F5", color: "#888" }}
              >
                {place.neighborhood}
              </span>
            </div>
            <p className="font-bold text-sm leading-snug" style={{ color: "#1A0514" }}>{place.name}</p>
          </div>
          {/* Star rating */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} width="10" height="10" viewBox="0 0 24 24"
                fill={star <= Math.round(place.rating) ? "#FF1F7D" : "none"}
                stroke="#FF1F7D" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
            <span className="text-xs font-bold ml-0.5" style={{ color: "#1A0514" }}>{place.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Review quote */}
        <p
          className="text-xs italic text-gray-500 mb-2 leading-relaxed"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          &ldquo;{place.review}&rdquo;
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">— {place.submittedBy}</span>
            <div className="flex items-center gap-1">
              {/* Flower/stamp icon */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF1F7D" opacity="0.7">
                <circle cx="12" cy="12" r="3" />
                <ellipse cx="12" cy="5" rx="2" ry="3.5" />
                <ellipse cx="12" cy="19" rx="2" ry="3.5" />
                <ellipse cx="5" cy="12" rx="3.5" ry="2" />
                <ellipse cx="19" cy="12" rx="3.5" ry="2" />
                <ellipse cx="7.05" cy="7.05" rx="2" ry="3.5" transform="rotate(45 7.05 7.05)" />
                <ellipse cx="16.95" cy="16.95" rx="2" ry="3.5" transform="rotate(45 16.95 16.95)" />
                <ellipse cx="16.95" cy="7.05" rx="2" ry="3.5" transform="rotate(-45 16.95 7.05)" />
                <ellipse cx="7.05" cy="16.95" rx="2" ry="3.5" transform="rotate(-45 7.05 16.95)" />
              </svg>
              <span className="text-xs font-semibold" style={{ color: "#FF1F7D" }}>{place.stamps}</span>
            </div>
          </div>
          <button
            onClick={onStamp}
            disabled={stamped}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
            style={stamped
              ? { background: "#FFF0F5", color: "#FF1F7D", cursor: "default" }
              : { background: "#FF1F7D", color: "white" }}
          >
            {stamped ? "Stamped ✓" : "Stamp it"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add Place Sheet ───────────────────────────────────────────────────────────

function AddPlaceSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Place) => void }) {
  const [name, setName]           = useState("");
  const [type, setType]           = useState<PlaceType>("place");
  const [neighborhood, setNeighborhood] = useState("");
  const [category, setCategory]   = useState("");
  const [review, setReview]       = useState("");
  const [rating, setRating]       = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const categories = ["Café", "Restaurant", "Bar", "Outdoors", "Culture", "Wellness", "Shop", "Other"];
  const typeOptions: { key: PlaceType; label: string }[] = [
    { key: "place", label: "Place" },
    { key: "eat", label: "Eat" },
    { key: "gem", label: "Gem" },
  ];

  function handleAdd() {
    if (!name.trim()) return;
    const newPlace: Place = {
      id: Date.now(),
      type,
      name: name.trim(),
      neighborhood: neighborhood.trim() || "NYC",
      review: review.trim() || "A wonderful spot.",
      submittedBy: "You",
      rating: rating || 5,
      stamps: 1,
      category,
    };
    onAdd(newPlace);
    onClose();
  }

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
              Add a place
            </h2>
            <button onClick={onClose} className="text-gray-300 p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Place name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sadelle's"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#FFE0EE", color: "#1A0514" }} />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Type</label>
              <div className="flex gap-2">
                {typeOptions.map(({ key, label }) => (
                  <button key={key} onClick={() => setType(key)}
                    className="flex-1 py-2.5 rounded-full text-sm font-semibold transition-all"
                    style={type === key
                      ? { background: "#FF1F7D", color: "white" }
                      : { background: "#FFF5F8", color: "#555", border: "1.5px solid #FFE0EE" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Neighborhood</label>
              <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g. SoHo"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#FFE0EE", color: "#1A0514" }} />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={category === cat
                      ? { background: "#FF1F7D", color: "white" }
                      : { background: "#FFF5F8", color: "#555", border: "1.5px solid #FFE0EE" }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                Why you love it <span className="text-gray-300 normal-case font-normal">({review.length}/160)</span>
              </label>
              <textarea value={review} onChange={(e) => setReview(e.target.value.slice(0, 160))}
                placeholder="Your honest review..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                style={{ borderColor: "#FFE0EE", color: "#1A0514" }} />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Your rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-all active:scale-90"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24"
                      fill={star <= (hoverRating || rating) ? "#FF1F7D" : "none"}
                      stroke="#FF1F7D" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleAdd}
              className="w-full py-4 rounded-full font-bold text-base text-white mt-1"
              style={{ background: "#FF1F7D" }}>
              Add my pick
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── What's On Tab ─────────────────────────────────────────────────────────────

function WhatsOnTab() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Tonight");
  const [happenings, setHappenings]     = useState<Happening[]>(INITIAL_HAPPENINGS);
  const [reservedSeats, setReservedSeats] = useState<Set<number>>(new Set());
  const [showCreate, setShowCreate]     = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showingUp, setShowingUp]       = useState<Set<number>>(new Set());

  function reserveSeat(id: number) { setReservedSeats((p) => new Set([...p, id])); }
  function dropSeat(id: number) { setReservedSeats((p) => { const n = new Set(p); n.delete(id); return n; }); }

  const filtered = happenings.filter((h) => {
    if (activeFilter === "Tonight")      return h.timeTag === "tonight";
    if (activeFilter === "Today")        return h.timeTag === "today" || h.timeTag === "tonight";
    if (activeFilter === "This Weekend") return h.timeTag === "weekend";
    if (activeFilter === "Free")         return h.price === 0;
    if (activeFilter === "Women-Loved")  return h.womenLoved;
    return true;
  });

  const featured = filtered.find((h) => h.featured);
  const rest     = filtered.filter((h) => !h.featured);

  return (
    <div className="flex flex-col gap-10">
      {/* Filter chips */}
      <div className="overflow-x-auto -mx-5 px-5 md:-mx-8 md:px-8">
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

      {/* City events */}
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

        {/* Add a pop-up card */}
        <button
          onClick={() => setShowAddPopup(true)}
          className="w-full mt-4 rounded-3xl p-5 flex items-center gap-4 transition-all active:scale-[0.98]"
          style={{ background: "#1A0514" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,31,125,0.2)" }}
          >
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="1" x2="6" y2="11" /><line x1="1" y1="6" x2="11" y2="6" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-bold text-white text-sm">Add a pop-up</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Know about something happening? Post it for the city.</p>
          </div>
        </button>
      </div>

      {/* BloomBay Seats */}
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

      {/* Celebrate */}
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

      {showCreate && <CreateSeatSheet onClose={() => setShowCreate(false)} />}
      {showAddPopup && (
        <AddPopupSheet
          onClose={() => setShowAddPopup(false)}
          onAdd={(h) => setHappenings((prev) => [...prev, h])}
        />
      )}
    </div>
  );
}

// ── Girl Picks Tab ────────────────────────────────────────────────────────────

function GirlPicksTab() {
  const [placeFilter, setPlaceFilter] = useState<PlaceFilter>("All");
  const [places, setPlaces]           = useState<Place[]>(INITIAL_PLACES);
  const [stampedPlaces, setStampedPlaces] = useState<Set<number>>(new Set());
  const [showAddPlace, setShowAddPlace]   = useState(false);

  const PLACE_FILTERS: PlaceFilter[] = ["All", "Places", "Eats", "Gems"];

  const filterMap: Record<PlaceFilter, PlaceType | null> = {
    All: null,
    Places: "place",
    Eats: "eat",
    Gems: "gem",
  };

  const filtered = places.filter((p) => {
    const ft = filterMap[placeFilter];
    return ft === null || p.type === ft;
  });

  function handleStamp(id: number) {
    if (stampedPlaces.has(id)) return;
    setStampedPlaces((prev) => new Set([...prev, id]));
    setPlaces((prev) => prev.map((p) => p.id === id ? { ...p, stamps: p.stamps + 1 } : p));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {PLACE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setPlaceFilter(f)}
              className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95"
              style={placeFilter === f
                ? { background: "#FF1F7D", color: "white" }
                : { background: "white", color: "#555", border: "1.5px solid #E8E8E8" }}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddPlace(true)}
          className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold text-white"
          style={{ background: "#FF1F7D" }}
        >
          + Add a place
        </button>
      </div>

      {/* Place cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            stamped={stampedPlaces.has(place.id)}
            onStamp={() => handleStamp(place.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-3xl p-10 text-center bg-white">
            <p className="text-gray-400 text-sm">No picks here yet. Be the first!</p>
          </div>
        )}
      </div>

      {showAddPlace && (
        <AddPlaceSheet
          onClose={() => setShowAddPlace(false)}
          onAdd={(p) => setPlaces((prev) => [p, ...prev])}
        />
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function CityPage() {
  const [activeTab, setActiveTab] = useState<"whats-on" | "girl-picks">("whats-on");

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

      {/* ── Top-level tabs ── */}
      <div className="px-5 md:px-8 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("whats-on")}
            className="px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95"
            style={activeTab === "whats-on"
              ? { background: "#1A0514", color: "white" }
              : { background: "white", color: "#555", border: "1.5px solid #E8E8E8" }}
          >
            What&apos;s On
          </button>
          <button
            onClick={() => setActiveTab("girl-picks")}
            className="px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95"
            style={activeTab === "girl-picks"
              ? { background: "#1A0514", color: "white" }
              : { background: "white", color: "#555", border: "1.5px solid #E8E8E8" }}
          >
            Girl Picks
          </button>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="px-5 md:px-8">
        {activeTab === "whats-on" ? <WhatsOnTab /> : <GirlPicksTab />}
      </div>
    </div>
  );
}
