"use client";

import Link from "next/link";

const features = [
  {
    icon: "🤝",
    title: "Real connections, not swipes",
    body: "Girl Match AI matches you by energy, values, schedule, and identity. Yande facilitates every first interaction so it's never weird.",
  },
  {
    icon: "🔒",
    title: "Women only. Actually.",
    body: "Live selfie verification before account creation. No exceptions. No loopholes. The first women's app that truly means it.",
  },
  {
    icon: "🌸",
    title: "Your sanctuary inside",
    body: "The Girl Lounge is entirely yours — journal, memories, Yande, your private world. Nothing demands your attention there.",
  },
  {
    icon: "✨",
    title: "A world that moves",
    body: "Girl Happenings, Girl Tonight, Girl Things 2 Do — your city is always alive inside BloomBay. There's always something happening right now.",
  },
  {
    icon: "🗺️",
    title: "Girl Map – trusted reviews",
    body: "Yelp but verified women only. Every review is from a real BloomBay member. Find spots that actually feel safe and designed for you.",
  },
  {
    icon: "💎",
    title: "Girl Clubs that feel alive",
    body: "Not a Facebook group. A world. Watch parties, audio rooms, events, circles, custom skins — every club has its own identity.",
  },
];

const mvpFeatures = [
  { emoji: "👯‍♀️", name: "Girl Clubs", desc: "Join or create women-only communities. Events, rooms, circles, watch parties — all inside.", tag: "MVP" },
  { emoji: "✨", name: "Girl Happenings", desc: "Events, Girl Tonight drops, Girl Map reviews, and Girl Things 2 Do — the city comes alive.", tag: "MVP" },
  { emoji: "🌙", name: "Girl Lounge", desc: "Your private sanctuary. Yande, journal, memories, Girl Code, everything that's just yours.", tag: "MVP" },
  { emoji: "🗺️", name: "Girl Map", desc: "Women-verified reviews of restaurants, cafes, wellness spots across NYC. The most trusted map in the city.", tag: "MVP" },
  { emoji: "⭐", name: "Girl Points & The Drop", desc: "Partner scavenger hunts, daily challenges, Girl Tonight drops. Earn points for showing up in your life.", tag: "MVP" },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pb-24 pt-16 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #FF1F7D 0%, #c40060 50%, #1A0514 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-1/4 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: "#FF69B4", transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-1/4 left-0 w-48 h-48 rounded-full opacity-15 pointer-events-none"
          style={{ background: "#FF1F7D", transform: "translate(-30%, 20%)" }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <span className="text-2xl">🌸</span>
          </div>
          <div>
            <p className="text-white text-xl font-bold tracking-tight leading-none">
              Bloom<span style={{ color: "#FFB6D0" }}>Bay</span>
            </p>
            <p className="text-white/60 text-xs tracking-widest uppercase">
              Girlfrnds by BloomBay
            </p>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-6 max-w-sm">
          <h1 className="text-white font-bold text-5xl leading-[1.05] mb-4">
            Where you{" "}
            <span
              className="italic"
              style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
            >
              bloom.
            </span>
          </h1>
          <p className="text-white/75 text-base font-light leading-relaxed">
            BloomBay is where NYC women build real friendships — through motion,
            timing, and intent. Not algorithms. Not swiping.
          </p>
          <p className="text-white/50 text-xs mt-3 tracking-widest uppercase">
            Women only · Live verification · NYC first
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/onboard"
            className="block text-center py-4 rounded-full text-white font-semibold text-base tracking-wide transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: "var(--bb-pink)" }}
          >
            Join BloomBay 🌸
          </Link>
          <Link
            href="/login"
            className="block text-center py-4 rounded-full font-semibold text-base tracking-wide border-2 border-white/30 text-white hover:border-white/60 transition-all"
          >
            Already a member? Log in
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-10 text-center">
          <div>
            <p className="text-white font-bold text-2xl">247</p>
            <p className="text-white/50 text-xs tracking-wider uppercase">Girls</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <p className="text-white font-bold text-2xl">500</p>
            <p className="text-white/50 text-xs tracking-wider uppercase">Goal</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <p className="text-white font-bold text-2xl">NYC</p>
            <p className="text-white/50 text-xs tracking-wider uppercase">First</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-16 bg-white max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: "var(--bb-black)" }}>
          Built for women.
        </h2>
        <p
          className="text-3xl font-bold text-center mb-10 italic"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)" }}
        >
          Finally.
        </p>
        <div className="grid grid-cols-1 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-5"
              style={{ background: "#1A0514" }}
            >
              <p className="text-2xl mb-2">{f.icon}</p>
              <h3 className="text-white font-bold text-base mb-1">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MVP Section */}
      <section className="px-5 py-12" style={{ background: "var(--pale-pink-bg)" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--bb-black)" }}>
            Everything you&apos;ve been waiting for.
          </h2>
          <div className="flex flex-col gap-4">
            {mvpFeatures.map((f) => (
              <div
                key={f.name}
                className="bg-white rounded-2xl p-4 flex items-start gap-4"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: "var(--light-pink)" }}
                >
                  {f.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base" style={{ color: "var(--bb-black)" }}>
                      {f.name}
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "#E8F5E9", color: "#2E7D32" }}
                    >
                      {f.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="px-6 py-16 text-center"
        style={{ background: "var(--bb-pink)" }}
      >
        <div className="max-w-sm mx-auto">
          <h2 className="text-white font-bold text-3xl mb-2">
            It&apos;s a girls world.
          </h2>
          <p
            className="text-white font-bold text-3xl mb-6 italic"
            style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
          >
            We&apos;re living in it.
          </p>
          <Link
            href="/onboard"
            className="block py-4 rounded-full bg-white font-bold text-base tracking-wide hover:bg-white/90 transition-all"
            style={{ color: "var(--bb-pink)" }}
          >
            Join the Founding 500 →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ background: "#1A0514" }}>
        <p className="text-white/40 text-xs tracking-widest uppercase">
          BloomBay · NYC · 2025
        </p>
        <p className="text-white/25 text-xs mt-1">
          @welovebloombay
        </p>
      </footer>
    </div>
  );
}
