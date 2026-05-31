"use client";

import Link from "next/link";

function BBMark({ size = 48, light = false }: { size?: number; light?: boolean }) {
  const darkFill = light ? "white" : "#1A0514";
  return (
    <svg width={size} height={Math.round(size * 0.72)} viewBox="0 0 60 43" fill="none">
      {/* Left B */}
      <path
        fillRule="evenodd"
        d="M 2 1.5 h 15 a 10 10 0 0 1 0 20 a 10 10 0 0 1 0 20 H 2 Z
           M 22 7.5 a 3.5 4 0 1 0 0 8 a 3.5 4 0 1 0 0 -8 Z
           M 22 27.5 a 3.5 4 0 1 0 0 8 a 3.5 4 0 1 0 0 -8 Z"
        fill={darkFill}
      />
      {/* Right B – mirrored, hot pink */}
      <path
        fillRule="evenodd"
        d="M 58 1.5 h -15 a 10 10 0 0 0 0 20 a 10 10 0 0 0 0 20 H 58 Z
           M 38 7.5 a 3.5 4 0 1 0 0 8 a 3.5 4 0 1 0 0 -8 Z
           M 38 27.5 a 3.5 4 0 1 0 0 8 a 3.5 4 0 1 0 0 -8 Z"
        fill="#FF1F7D"
      />
    </svg>
  );
}

const AVATARS = [
  { initials: "A", color: "#FF6B6B" },
  { initials: "S", color: "#C06BE8" },
  { initials: "P", color: "#6B9EFF" },
  { initials: "K", color: "#FF69B4" },
  { initials: "C", color: "#FFB347" },
  { initials: "M", color: "#4CAF9A" },
];

export function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#1A0514" }}>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col px-6 pt-6 overflow-hidden">

        {/* Giant BB watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: 0.04 }}
        >
          <BBMark size={340} light />
        </div>

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 55%, rgba(255,31,125,0.22) 0%, transparent 70%)",
          }}
        />

        {/* Nav */}
        <nav className="relative flex items-center justify-between pb-10">
          <div className="flex items-center gap-2.5">
            <BBMark size={30} light />
            <span className="text-white font-bold text-base tracking-widest uppercase">
              BLOOM<span style={{ color: "#FF1F7D" }}>BAY</span>
            </span>
          </div>
          <Link
            href="/login"
            className="text-sm font-semibold transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Log in →
          </Link>
        </nav>

        {/* Headline block */}
        <div className="relative flex-1 flex flex-col justify-center pb-6">
          {/* Live badge */}
          <div className="flex mb-5">
            <span
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,31,125,0.18)", color: "#FF69B4" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "#FF69B4", animation: "pulse 2s infinite" }}
              />
              NYC · Founding Wave · 247 Members
            </span>
          </div>

          {/* Main text */}
          <h1 className="leading-none mb-5">
            <span
              className="block font-bold tracking-tight text-white"
              style={{ fontSize: "clamp(48px, 14vw, 68px)" }}
            >
              Where you
            </span>
            <span
              className="block"
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(56px, 16vw, 80px)",
                color: "#FF1F7D",
                lineHeight: 1,
              }}
            >
              bloom.
            </span>
          </h1>

          <p
            className="mb-8 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", maxWidth: "300px" }}
          >
            The first world built by women, verified for women, alive with women. Real friendships. Real life. NYC.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3 max-w-xs">
            <Link
              href="/onboard"
              className="text-center py-4 rounded-full text-white font-bold text-base tracking-wide transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ background: "#FF1F7D" }}
            >
              Join BloomBay 🌸
            </Link>
            <Link
              href="/login"
              className="text-center py-3.5 rounded-full font-semibold text-sm tracking-wide border transition-all hover:border-white/40"
              style={{
                borderColor: "rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Already a member? Log in
            </Link>
          </div>
        </div>

        {/* Stats bar — flush bottom */}
        <div
          className="-mx-6 px-6 py-4 flex items-center border-t"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          {[
            { n: "247", label: "Girls inside" },
            { n: "500", label: "Founding spots" },
            { n: "NYC", label: "First city" },
          ].map((s, i) => (
            <div key={i} className="text-center flex-1">
              <p className="text-white font-bold text-xl leading-none">{s.n}</p>
              <p className="text-xs mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="px-6 py-6" style={{ background: "var(--pale-pink-bg)" }}>
        <div className="flex items-center gap-2 mb-3">
          {AVATARS.map((a, i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: a.color }}
            >
              {a.initials}
            </div>
          ))}
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: "#E8E8E8", color: "#999" }}>
            +241
          </div>
        </div>
        <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>
          247 women already inside.{" "}
          <span style={{ color: "var(--bb-pink)" }}>253 founding spots left.</span>
        </p>
        <p className="text-xs text-gray-400 mt-0.5">Every member live-verified · NYC founding wave</p>
      </section>

      {/* ─── FEATURE BENTO ─── */}
      <section className="px-5 py-10" style={{ background: "#1A0514" }}>
        {/* Section header */}
        <div className="mb-6">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-1"
            style={{ color: "#FF1F7D" }}
          >
            WHAT&apos;S INSIDE
          </p>
          <h2 className="text-white font-bold leading-tight" style={{ fontSize: "28px" }}>
            Built for women.
          </h2>
          <p
            className="font-bold italic"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "#FF1F7D",
              fontWeight: 400,
              fontSize: "28px",
            }}
          >
            Finally.
          </p>
        </div>

        {/* Bento grid */}
        <div className="flex flex-col gap-3">

          {/* Wide — Girl Match */}
          <div className="rounded-3xl p-5" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-3xl block mb-3">🤝</span>
                <h3 className="text-white font-bold text-lg leading-snug mb-1">
                  Real connections, not swipes
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Girl Match AI pairs you by energy, values, and schedule. Yande handles every first move so it&apos;s never awkward.
                </p>
              </div>
            </div>
          </div>

          {/* 2-col row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl p-4" style={{ background: "#FF1F7D" }}>
              <span className="text-2xl block mb-2">🔒</span>
              <h3 className="text-white font-bold text-sm leading-snug mb-1">
                Women only. Actually.
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                Live selfie verification. No exceptions. No loopholes.
              </p>
            </div>
            <div className="rounded-3xl p-4" style={{ background: "rgba(255,255,255,0.06)" }}>
              <span className="text-2xl block mb-2">🌸</span>
              <h3 className="text-white font-bold text-sm leading-snug mb-1">
                Your sanctuary
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Journal, Yande, memories. Entirely and only yours.
              </p>
            </div>
          </div>

          {/* 2-col row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl p-4" style={{ background: "rgba(255,255,255,0.06)" }}>
              <span className="text-2xl block mb-2">✨</span>
              <h3 className="text-white font-bold text-sm leading-snug mb-1">
                A city alive
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Girl Happenings, Tonight drops — always something now.
              </p>
            </div>
            <div className="rounded-3xl p-4" style={{ background: "rgba(255,255,255,0.06)" }}>
              <span className="text-2xl block mb-2">🗺️</span>
              <h3 className="text-white font-bold text-sm leading-snug mb-1">
                Girl Map
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Women-verified reviews. Every spot tested by real members.
              </p>
            </div>
          </div>

          {/* Wide — Girl Clubs */}
          <div
            className="rounded-3xl p-5"
            style={{
              background: "rgba(255,31,125,0.13)",
              border: "1px solid rgba(255,31,125,0.22)",
            }}
          >
            <span className="text-3xl block mb-3">💎</span>
            <h3 className="text-white font-bold text-lg leading-snug mb-1">
              Girl Clubs that feel alive
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Not a group chat. A world. Watch parties, audio rooms, events, circles — every club has its own identity.
            </p>
          </div>
        </div>
      </section>

      {/* ─── EDITORIAL QUOTE BLOCKS ─── */}
      <section style={{ background: "var(--pale-pink-bg)" }}>

        {/* Quote 1 */}
        <div
          className="px-6 py-10"
          style={{ borderBottom: "1px solid #f0ccd8" }}
        >
          <p
            className="text-xs font-bold tracking-widest uppercase mb-5"
            style={{ color: "var(--bb-pink)" }}
          >
            THE MISSION
          </p>
          <p
            className="font-bold italic leading-snug mb-5"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--bb-black)",
              fontSize: "26px",
            }}
          >
            &ldquo;Show up for a stranger and she becomes someone you know.&rdquo;
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Every feature inside BloomBay is built around one truth: women want real friendships — not followers, not likes. Real ones.
          </p>
        </div>

        {/* Quote 2 */}
        <div className="px-6 py-10">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-5"
            style={{ color: "var(--bb-pink)" }}
          >
            GIRL TONIGHT · DROPS
          </p>
          <p
            className="font-bold italic leading-snug mb-5"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--bb-black)",
              fontSize: "26px",
            }}
          >
            &ldquo;Tonight&apos;s plans, dropped at 5PM. Gone by 8.&rdquo;
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Curated, limited, exclusive. Girl Tonight drops land daily — rooftops, dinners, galleries. Verified girls only.
          </p>
          <div className="flex gap-2 flex-wrap">
            {["🕯️ Candlelight dinner", "🍷 Rooftop wine", "🎨 Gallery night"].map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1.5 rounded-full font-semibold"
                style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOUNDING CTA ─── */}
      <section className="px-6 py-14 relative overflow-hidden" style={{ background: "#FF1F7D" }}>
        {/* Decorative circles */}
        <div
          className="absolute -top-10 -right-10 w-44 h-44 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.12)" }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full pointer-events-none"
          style={{ background: "rgba(196,0,96,0.4)" }}
        />

        <div className="relative">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-5"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            JOIN THE FOUNDING 500
          </p>
          <h2
            className="text-white font-bold leading-[1.0] mb-1"
            style={{ fontSize: "clamp(36px, 11vw, 52px)" }}
          >
            It&apos;s a girls world.
          </h2>
          <p
            className="font-bold italic leading-[1.0] mb-6"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "white",
              fontWeight: 400,
              fontSize: "clamp(36px, 11vw, 52px)",
            }}
          >
            We&apos;re living in it.
          </p>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            253 founding spots remaining. No algorithm. No men. Just women — and a world built entirely around you.
          </p>
          <Link
            href="/onboard"
            className="block text-center py-4 rounded-full font-bold text-base tracking-wide transition-all hover:bg-white/90 active:scale-[0.98]"
            style={{ background: "white", color: "#FF1F7D" }}
          >
            Claim your spot →
          </Link>
          <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            Free to join · Women verified · NYC first
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="px-6 py-7 flex items-center justify-between"
        style={{ background: "#1A0514" }}
      >
        <div className="flex items-center gap-2.5">
          <BBMark size={22} light />
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            BLOOMBAY
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            NYC · 2025
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            @welovebloombay
          </p>
        </div>
      </footer>
    </div>
  );
}
