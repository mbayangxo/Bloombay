"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = ["Seats", "Events", "Celebrate", "City Guides", "Solo"];

type Seat = {
  id: number;
  badge: string;
  seats: number;
  title: string;
  detail: string;
  gradientFrom: string;
  gradientTo: string;
};

const SEATS: Seat[] = [
  { id: 1, badge: "SEATS", seats: 2, title: "Girls dinner · Carbone", detail: "Tonight 7:30PM · Individual pay", gradientFrom: "#FF1F7D", gradientTo: "#1A0514" },
  { id: 2, badge: "SEATS", seats: 3, title: "Pilates + matcha morning", detail: "Sunday 9AM · $20 · 3 spots", gradientFrom: "#FF69B4", gradientTo: "#1A0514" },
  { id: 3, badge: "SEATS", seats: 4, title: "MoMA + froyo after", detail: "Saturday 2PM · $1 deposit", gradientFrom: "#FF1F7D", gradientTo: "#3D0A2A" },
  { id: 4, badge: "SEATS", seats: 2, title: "Rooftop wine hour · SoHo", detail: "Friday 7PM · Free entry", gradientFrom: "#c40060", gradientTo: "#1A0514" },
];

const EVENTS = [
  { id: 1, title: "Paint + sip + dinner", detail: "Fri 7PM · $65 · 8 seats", host: "BloomBay Official", color: "#FF1F7D" },
  { id: 2, title: "Book club and sip", detail: "Sat 4PM · $35 · 12 seats", host: "Girl Creatives", color: "#FF69B4" },
  { id: 3, title: "Gym and juice morning", detail: "Sun 8AM · $25 · 10 seats", host: "Girls Who Move", color: "#c40060" },
  { id: 4, title: "Zumba and snacks", detail: "Mon 6PM · $30 · 15 seats", host: "Soft Life Club", color: "#FF1F7D" },
];

const CELEBRATE = [
  { id: 1, name: "Aaliyah M.", initial: "A", event: "Birthday picnic", quote: '"First birthday I am actually celebrating"', location: "Prospect Park · Sat 2PM", seats: "4 seats · Free" },
  { id: 2, name: "Sofia K.", initial: "S", event: "Promotion dinner", quote: '"I got the job I was scared to apply for"', location: "Carbone · Fri 7PM · $85", seats: "2 seats left" },
  { id: 3, name: "Priya R.", initial: "P", event: "New apartment", quote: '"Moved to NYC alone. Now I have a city"', location: "Williamsburg · Sun 3PM · Free", seats: "6 seats" },
];

const CITY_GUIDES = [
  { id: 1, neighborhood: "Williamsburg", tag: "GIRL APPROVED", spots: 18, desc: "Matcha bars, pilates, rooftop hangs. The heartbeat of girl culture in NYC." },
  { id: 2, neighborhood: "SoHo", tag: "TRENDING", spots: 24, desc: "Galleries, dinner spots, boutique drops. Where the city dresses up." },
  { id: 3, neighborhood: "West Village", tag: "COZY SEASON", spots: 14, desc: "Wine bars, candlelit dinners, cobblestone strolls. Date yourself here." },
  { id: 4, neighborhood: "DUMBO", tag: "SUNRISE CLUB", spots: 9, desc: "Bridge runs, waterfront brunch, golden hour every morning." },
  { id: 5, neighborhood: "Greenpoint", tag: "HIDDEN GEM", spots: 11, desc: "Polish bakeries, indie coffee, the real Williamsburg." },
];

const SOLO = [
  { id: 1, title: "Solo dinner at the bar", detail: "Carbone · Tonight · Seat 4", time: "7PM", tag: "TONIGHT" },
  { id: 2, title: "Morning run · Brooklyn Bridge", detail: "Meet point: Cadman Plaza · Sat 7AM", time: "7AM", tag: "SAT" },
  { id: 3, title: "Museum afternoon", detail: "MoMA · Sunday · general entry", time: "2PM", tag: "SUN" },
  { id: 4, title: "Coffee shop work session", detail: "Blank Street · Williamsburg · Open", time: "Any", tag: "OPEN" },
];

export function CityPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [reservedSeats, setReservedSeats] = useState<Set<number>>(new Set());
  const [seatCounts, setSeatCounts] = useState<Record<number, number>>(
    Object.fromEntries(SEATS.map((s) => [s.id, s.seats]))
  );
  const [reservingId, setReservingId] = useState<number | null>(null);
  const [rsvpd, setRsvpd] = useState<Set<number>>(new Set());
  const [showingUp, setShowingUp] = useState<Set<number>>(new Set());

  function reserveSeat(id: number) {
    if (reservedSeats.has(id) || seatCounts[id] === 0) return;
    setReservingId(id);
    setTimeout(() => {
      setReservedSeats((prev) => new Set([...prev, id]));
      setSeatCounts((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
      setReservingId(null);
    }, 320);
  }

  function toggleRsvp(id: number) {
    setRsvpd((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function showUp(id: number) {
    setShowingUp((prev) => new Set([...prev, id]));
  }

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
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            {SEATS.map((seat) => {
              const reserved = reservedSeats.has(seat.id);
              const reserving = reservingId === seat.id;
              const count = seatCounts[seat.id];

              return (
                <div
                  key={seat.id}
                  className="bg-white rounded-3xl overflow-hidden"
                  style={{
                    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                    transform: reserved ? "scale(0.97)" : "scale(1)",
                    transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  <div
                    className="relative flex items-end p-3"
                    style={{
                      height: "130px",
                      background: `linear-gradient(135deg, ${seat.gradientFrom}, ${seat.gradientTo})`,
                    }}
                  >
                    {/* Seat count badge */}
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full text-white flex items-center gap-1.5 transition-all"
                      style={{
                        background: reserved ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(8px)",
                        opacity: count === 0 ? 0.5 : 1,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ background: reserved ? "#fff" : "var(--bb-pink)" }}
                      />
                      {count === 0 ? "FULL" : `${count} ${seat.badge}`}
                    </span>

                    {/* Reserved stamp */}
                    {reserved && (
                      <div
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: "white",
                          color: "var(--bb-pink)",
                          animation: "stamp-press 0.35s ease-out",
                        }}
                      >
                        ✓ Reserved
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold leading-snug truncate" style={{ color: "var(--bb-black)" }}>
                        {seat.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{seat.detail}</p>
                    </div>
                    <button
                      onClick={() => reserveSeat(seat.id)}
                      disabled={reserved || count === 0}
                      className="flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-90"
                      style={{
                        background: reserved ? "var(--light-pink)" : "var(--bb-pink)",
                        color: reserved ? "var(--bb-pink)" : "white",
                        transform: reserving ? "scale(0.9)" : "scale(1)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {reserving ? "…" : reserved ? "Joined ✓" : "Join"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── EVENTS ── */}
        {activeTab === 1 && (
          <div className="flex flex-col gap-3">
            {EVENTS.map((evt) => {
              const going = rsvpd.has(evt.id);
              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl p-4 flex items-center gap-4"
                  style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
                >
                  <div className="w-14 h-14 rounded-2xl flex-shrink-0" style={{ background: `linear-gradient(135deg,${evt.color},#1A0514)` }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm leading-snug" style={{ color: "var(--bb-black)" }}>{evt.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{evt.detail}</p>
                    <p className="text-xs font-bold mt-1" style={{ color: "var(--bb-pink)" }}>{evt.host}</p>
                  </div>
                  <button
                    onClick={() => toggleRsvp(evt.id)}
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
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--bb-pink)" }}>SHOW UP · BE THERE</p>
              <p className="italic text-base leading-relaxed" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>
                Real milestones. Real women. Show up for a stranger and she becomes someone you know.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {CELEBRATE.map((c) => {
                const attending = showingUp.has(c.id);
                return (
                  <div key={c.id} className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "var(--bb-pink)" }}>
                        {c.initial}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{c.name}</p>
                        <p className="text-sm text-gray-400">{c.event}</p>
                      </div>
                    </div>
                    <div className="rounded-2xl p-3 mb-3" style={{ background: "var(--pale-pink-bg)" }}>
                      <p className="italic text-sm" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>{c.quote}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">{c.location}</p>
                        <p className="text-xs font-bold mt-0.5" style={{ color: "var(--bb-pink)" }}>{c.seats}</p>
                      </div>
                      <button
                        onClick={() => showUp(c.id)}
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

        {/* ── CITY GUIDES ── */}
        {activeTab === 3 && (
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl p-5 mb-1" style={{ background: "#1A0514" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--mid-pink)" }}>GIRL-VERIFIED</p>
              <p className="text-white font-bold text-xl italic" style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}>
                The city through her eyes.
              </p>
              <p className="text-white/50 text-xs mt-1">Every spot reviewed by a real BloomBay woman.</p>
            </div>
            {CITY_GUIDES.map((guide) => (
              <div key={guide.id} className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <div className="h-24 flex items-end p-3" style={{ background: `linear-gradient(135deg,#FF1F7D,#1A0514)` }}>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-lg">{guide.neighborhood}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>{guide.tag}</span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 leading-relaxed">{guide.desc}</p>
                    <p className="text-xs font-bold mt-2" style={{ color: "var(--bb-pink)" }}>{guide.spots} girl-approved spots</p>
                  </div>
                  <button className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95" style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}>
                    Explore →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SOLO ── */}
        {activeTab === 4 && (
          <div>
            <div className="rounded-3xl p-5 mb-5" style={{ background: "var(--light-pink)" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--bb-pink)" }}>GO SOLO · GO SOFT</p>
              <p className="italic text-base leading-relaxed" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>
                Things to do alone in NYC. No awkward. No excuses. Just you and the city.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {SOLO.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-4 flex items-center gap-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-center" style={{ background: "#1A0514" }}>
                    <div>
                      <p className="text-white text-xs font-bold leading-none">{item.tag}</p>
                      <p className="text-white/60 text-xs">{item.time}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
                  </div>
                  <button className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border-2 transition-all active:scale-95" style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}>
                    I&apos;m in
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
