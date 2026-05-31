"use client";

import { useState } from "react";

const TABS = ["Seats", "Events", "Celebrate", "Drops", "Girl Favorites"];

const SEATS = [
  {
    badge: "2 SEATS",
    title: "Girls dinner · Carbone",
    detail: "Tonight 7:30PM · Individual pay",
    bg: "#F5F5F5",
  },
  {
    badge: "3 SEATS",
    title: "Pilates + matcha morning",
    detail: "Sunday 9AM · $20 · 3 spots",
    bg: "#F5F5F5",
  },
  {
    badge: "4 SEATS",
    title: "MoMA + froyo after",
    detail: "Saturday 2PM · $1 deposit",
    bg: "#F5F5F5",
  },
];

const EVENTS = [
  {
    emoji: "🎨",
    title: "Paint + sip + dinner",
    detail: "Fri 7PM · $65 · 8 seats",
    host: "BloomBay Official",
    bg: "#FFF0F5",
    hostColor: "var(--bb-pink)",
  },
  {
    emoji: "📚",
    title: "Book club and sip",
    detail: "Sat 4PM · $35 · 12 seats",
    host: "Girl Creatives",
    bg: "#FFFDE7",
    hostColor: "#F9A825",
  },
  {
    emoji: "💪",
    title: "Gym and juice morning",
    detail: "Sun 8AM · $25 · 10 seats",
    host: "Girls Who Move",
    bg: "#E8F5E9",
    hostColor: "#2E7D32",
  },
  {
    emoji: "💃",
    title: "Zumba and snacks",
    detail: "Mon 6PM · $30 · 15 seats",
    host: "Soft Life Club",
    bg: "#EDE7F6",
    hostColor: "#6A1B9A",
  },
  {
    emoji: "🧘",
    title: "Pilates and matcha",
    detail: "Tue 9AM · $40 · 8 seats",
    host: "Soft Life Club",
    bg: "#E3F2FD",
    hostColor: "#1565C0",
  },
];

const CELEBRATE = [
  {
    name: "Aaliyah M.",
    event: "Birthday picnic 🎂",
    quote: '"First birthday I am actually celebrating"',
    location: "Prospect Park · Sat 2PM",
    seats: "4 seats · Free",
    seatsColor: "var(--bb-pink)",
  },
  {
    name: "Sofia K.",
    event: "Promotion dinner ✨",
    quote: '"I got the job I was scared to apply for"',
    location: "Carbone · Fri 7PM · $85",
    seats: "2 seats left",
    seatsColor: "var(--bb-pink)",
  },
];

export function CityPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-4xl font-bold" style={{ color: "var(--bb-black)" }}>
          Happenings
        </h1>
        <p
          className="italic text-gray-400 mt-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          The city is breathing tonight
        </p>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-6 overflow-x-auto">
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
        {/* Seats tab */}
        {activeTab === 0 && (
          <div className="flex flex-col gap-4">
            {SEATS.map((seat, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm">
                <div
                  className="relative"
                  style={{ height: "120px", background: "linear-gradient(135deg, #E0E0E0, #C8C8C8)" }}
                >
                  <span
                    className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white flex items-center gap-1"
                    style={{ background: "var(--bb-pink)" }}
                  >
                    ● {seat.badge}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p
                      className="text-base font-bold italic"
                      style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
                    >
                      {seat.title}
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">{seat.detail}</p>
                  </div>
                  <button
                    className="px-5 py-2.5 rounded-full text-white font-bold text-sm"
                    style={{ background: "var(--bb-pink)" }}
                  >
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Events tab */}
        {activeTab === 1 && (
          <div className="flex flex-col gap-3">
            {EVENTS.map((evt, i) => (
              <div
                key={i}
                className="rounded-3xl p-4 flex items-center gap-4"
                style={{ background: evt.bg }}
              >
                <span className="text-3xl flex-shrink-0">{evt.emoji}</span>
                <div className="flex-1">
                  <p
                    className="text-base font-bold italic leading-snug"
                    style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
                  >
                    {evt.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{evt.detail}</p>
                  <p className="text-xs font-bold mt-1" style={{ color: evt.hostColor }}>
                    {evt.host}
                  </p>
                </div>
                <button
                  className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border-2 hover:bg-pink-50 transition-colors"
                  style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}
                >
                  RSVP
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Celebrate tab */}
        {activeTab === 2 && (
          <div>
            <div
              className="rounded-3xl p-5 mb-5"
              style={{ background: "var(--light-pink)" }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: "var(--bb-pink)" }}
              >
                SHOW UP · BE THERE
              </p>
              <p
                className="italic text-base leading-relaxed"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
              >
                Real milestones. Real women. Show up for a stranger and she becomes someone
                you know.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {CELEBRATE.map((c, i) => (
                <div key={i} className="bg-white rounded-3xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full border-2"
                      style={{ borderColor: "var(--bb-pink)" }}
                    />
                    <div>
                      <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>
                        {c.name}
                      </p>
                      <p className="text-sm text-gray-400">{c.event}</p>
                    </div>
                  </div>
                  <div
                    className="rounded-2xl p-3 mb-3"
                    style={{ background: "var(--pale-pink-bg)" }}
                  >
                    <p
                      className="italic text-sm"
                      style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
                    >
                      {c.quote}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">{c.location}</p>
                      <p className="text-xs font-bold mt-0.5" style={{ color: c.seatsColor }}>
                        {c.seats}
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-bold"
                      style={{ background: "var(--bb-pink)" }}
                    >
                      Show up 🌸
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drops tab */}
        {activeTab === 3 && (
          <div className="flex flex-col gap-4">
            <div
              className="rounded-3xl p-5"
              style={{ background: "#1A0514" }}
            >
              <p className="text-xs font-bold tracking-widest uppercase text-pink-400 mb-3">
                ● GIRL TONIGHT · DROPPED 5PM · 6 SPOTS LEFT
              </p>
              <p
                className="text-white text-xl font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Tonight&apos;s curated drops
              </p>
              <p className="text-white/50 text-xs mb-4">
                Limited spots · Disappear by 8PM · Verified girls only
              </p>
              <div className="flex gap-3">
                {[
                  { emoji: "🕯️", title: "Candlelight dinner", detail: "West Village · 8PM", spots: "2 spots left" },
                  { emoji: "🍷", title: "Rooftop wine hour", detail: "SoHo · 6:30PM", spots: "1 spot left" },
                ].map((drop, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-2xl p-3"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <span className="text-2xl block mb-2">{drop.emoji}</span>
                    <p className="text-white text-sm font-semibold">{drop.title}</p>
                    <p className="text-white/50 text-xs mt-0.5">{drop.detail}</p>
                    <p className="text-pink-400 text-xs font-bold mt-1">{drop.spots}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Girl Favorites tab */}
        {activeTab === 4 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4 block">🌸</span>
            <h3
              className="text-2xl font-bold italic mb-2"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
            >
              Girl Favorites
            </h3>
            <p className="text-gray-400 text-sm">Coming to your city soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
