"use client";

import { useState } from "react";

const TABS = ["All", "My Clubs", "Popular", "New"];

const FEATURED_CLUB = {
  name: "Soft Life Club NYC",
  members: "312 members",
  desc: "For women who choose peace, softness, and intention. Brunches, spa days, rooftop hangs, slow mornings.",
  tags: ["Lifestyle", "Wellness", "Social"],
  active: true,
};

const CLUBS = [
  {
    emoji: "💻",
    name: "Girl Tech Collective",
    members: "89 members",
    desc: "Tech, startups, side projects. Monthly hackathons and mentorship.",
    bg: "#FFF0F5",
    color: "var(--bb-pink)",
  },
  {
    emoji: "🏃‍♀️",
    name: "Girls Who Move",
    members: "142 members",
    desc: "Run clubs, gym check-ins, yoga flows, hikes. Move together.",
    bg: "#FFE0EE",
    color: "var(--bb-pink)",
  },
  {
    emoji: "🌍",
    name: "Indigenous African NYC",
    members: "54 members",
    desc: "Culture, community, and joy for African women in the city.",
    bg: "#FFF5F8",
    color: "var(--bb-pink)",
  },
  {
    emoji: "🌙",
    name: "Muslim Women NYC",
    members: "76 members",
    desc: "Faith, fashion, food, and sisterhood. Halal outings every week.",
    bg: "#FFF0F5",
    color: "var(--bb-pink)",
  },
  {
    emoji: "📖",
    name: "Girl Creatives",
    members: "98 members",
    desc: "Writers, artists, photographers. Monthly showcases and collabs.",
    bg: "#FFE0EE",
    color: "var(--bb-pink)",
  },
  {
    emoji: "🎵",
    name: "Jazz & Wine Girls",
    members: "61 members",
    desc: "Jazz nights, wine bars, vinyl listening sessions.",
    bg: "#FFF0F5",
    color: "var(--bb-pink)",
  },
];

const GIRL_BAR = [
  { room: "Morning Room", count: 8, emoji: "☀️", live: true },
  { room: "Night Owl", count: 14, emoji: "🌙", live: true },
  { room: "Study With Me", count: 5, emoji: "📚", live: false },
];

export function ClubsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen pb-36" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-4xl font-bold" style={{ color: "var(--bb-black)" }}>
          Girl Clubs
        </h1>
        <p
          className="italic text-gray-400 mt-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Find your people
        </p>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search clubs..."
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "var(--bb-black)" }}
          />
        </div>
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
        {/* My Clubs tab empty state */}
        {activeTab === 1 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4 block">👯‍♀️</span>
            <h3
              className="text-2xl font-bold italic mb-2"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
            >
              No clubs yet
            </h3>
            <p className="text-gray-400 text-sm mb-6">Join a club and find your people</p>
            <button
              onClick={() => setActiveTab(0)}
              className="px-6 py-3 rounded-full text-white font-bold text-sm"
              style={{ background: "var(--bb-pink)" }}
            >
              Explore clubs
            </button>
          </div>
        )}

        {/* All / Popular / New tabs */}
        {(activeTab === 0 || activeTab === 2 || activeTab === 3) && (
          <div className="flex flex-col gap-5">
            {/* Featured club */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{ background: "var(--bb-pink)" }}
            >
              <div
                className="h-28 flex items-center justify-center text-5xl relative"
                style={{ background: "linear-gradient(135deg, #FF1F7D, #c40060, #1A0514)" }}
              >
                <span>🌸</span>
                {FEATURED_CLUB.active && (
                  <span
                    className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                    style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
                  >
                    ● ACTIVE
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3
                      className="text-white text-lg font-bold italic"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {FEATURED_CLUB.name}
                    </h3>
                    <p className="text-white/70 text-xs mt-0.5">{FEATURED_CLUB.members}</p>
                  </div>
                  <button
                    className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold"
                    style={{ background: "white", color: "var(--bb-pink)" }}
                  >
                    Join
                  </button>
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-3">
                  {FEATURED_CLUB.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {FEATURED_CLUB.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Girl Bar */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p
                  className="text-base font-bold italic"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
                >
                  Girl Bar · Live Now
                </p>
                <span className="text-xs font-semibold" style={{ color: "var(--bb-pink)" }}>
                  ● LIVE
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {GIRL_BAR.map((room) => (
                  <div
                    key={room.room}
                    className="bg-white rounded-2xl p-3.5 flex items-center justify-between"
                    style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{room.emoji}</span>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "var(--bb-black)" }}>
                          {room.room}
                        </p>
                        <p className="text-xs text-gray-400">{room.count} here</p>
                      </div>
                    </div>
                    <button
                      className="px-4 py-1.5 rounded-full text-xs font-bold"
                      style={
                        room.live
                          ? { background: "var(--bb-pink)", color: "white" }
                          : { background: "#F5F5F5", color: "#999" }
                      }
                    >
                      {room.live ? "Join" : "Soon"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Clubs grid */}
            <div>
              <p
                className="text-base font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
              >
                All Clubs
              </p>
              <div className="grid grid-cols-2 gap-3">
                {CLUBS.map((club) => (
                  <div
                    key={club.name}
                    className="rounded-2xl overflow-hidden bg-white"
                    style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
                  >
                    <div
                      className="h-16 flex items-center justify-center text-3xl"
                      style={{ background: club.bg }}
                    >
                      {club.emoji}
                    </div>
                    <div className="p-3">
                      <p
                        className="font-bold text-sm leading-snug mb-1"
                        style={{ color: "var(--bb-black)" }}
                      >
                        {club.name}
                      </p>
                      <p className="text-xs text-gray-400 mb-2 leading-relaxed line-clamp-2">
                        {club.desc}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold" style={{ color: club.color }}>
                          {club.members}
                        </p>
                        <button
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
