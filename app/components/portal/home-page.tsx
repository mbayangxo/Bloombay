import { BBLogo } from "./bb-logo";

const openSeats = [
  { id: 1, badge: "2 SEATS", title: "Girls dinner · Carbone", detail: "Tonight 7PM", bg: "#FFF0F5", emoji: "🍷" },
  { id: 2, badge: "3 SEATS", title: "Run Club",               detail: "Sat 7AM · Free",       bg: "#FFE0EE", emoji: "🏃‍♀️" },
  { id: 3, badge: "2 SPOTS", title: "MoMA visit",             detail: "Sat 11AM · 2 spots",   bg: "#FFF0F5", emoji: "🎨" },
  { id: 4, badge: "4 SEATS", title: "Pilates + matcha",       detail: "Sun 9AM · $20",        bg: "#FFE0EE", emoji: "🧘" },
];

const EVENTS_PREVIEW = [
  { emoji: "🎨", title: "Paint + sip + dinner", detail: "Fri 7PM · $65 · 8 seats",  host: "BloomBay Official" },
  { emoji: "📖", title: "Book club and sip",     detail: "Sat 4PM · $35 · 12 seats", host: "Girl Creatives" },
  { emoji: "💃", title: "Zumba and snacks",      detail: "Mon 6PM · $30 · 15 seats", host: "Soft Life Club" },
];

const CLUBS_PREVIEW = [
  { emoji: "🌸", name: "Soft Life Club NYC",     members: "312 members" },
  { emoji: "💻", name: "Girl Tech Collective",   members: "89 members" },
  { emoji: "🏃‍♀️", name: "Girls Who Move",       members: "142 members" },
];

const TONIGHT_DROPS = [
  { emoji: "🕯️", title: "Candlelight dinner", detail: "West Village · 8PM", spots: "2 spots left" },
  { emoji: "🍷", title: "Rooftop wine hour",  detail: "SoHo · 6:30PM",     spots: "1 spot left" },
];

export function HomePage() {
  return (
    <div
      className="min-h-screen pb-36 md:pb-10"
      style={{ background: "var(--pale-pink-bg)" }}
    >
      {/* ── MOBILE TOP BAR ── */}
      <header className="flex items-center justify-between px-4 pt-12 pb-3 md:hidden">
        <div className="flex items-center gap-2">
          <BBLogo size={26} />
          <span className="text-lg font-bold tracking-tight" style={{ color: "var(--bb-black)" }}>
            Bloom<span style={{ color: "var(--bb-pink)" }}>Bay</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-lg">🔔</button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "var(--bb-pink)" }}
          >
            M
          </div>
        </div>
      </header>

      {/* ── DESKTOP HEADER ── */}
      <div className="hidden md:flex items-center justify-between px-8 pt-8 pb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--bb-black)" }}>
            Good morning, <span className="italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}>Maya.</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Friday · Williamsburg, NYC</p>
        </div>
        {/* Desktop stats row */}
        <div className="flex items-center gap-4">
          {[
            { n: "12", label: "Events this week" },
            { n: "8",  label: "Active clubs" },
            { n: "420", label: "Your points" },
          ].map((s) => (
            <div key={s.label} className="text-center px-4 py-2 bg-white rounded-2xl" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <p className="font-bold text-lg leading-none" style={{ color: "var(--bb-pink)" }}>{s.n}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ml-2" style={{ background: "var(--bb-pink)" }}>M</div>
        </div>
      </div>

      {/* ── MOBILE GREETING ── */}
      <div className="px-5 pb-4 md:hidden">
        <h1 className="text-4xl font-bold leading-tight" style={{ color: "var(--bb-black)" }}>Good morning,</h1>
        <h1 className="text-4xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}>Maya.</h1>
        <div className="mt-1 h-0.5 w-12 rounded-full" style={{ background: "var(--bb-pink)" }} />
      </div>

      {/* ── DESKTOP: 2-col layout ── */}
      <div className="md:grid md:grid-cols-[1fr_320px] md:gap-6 md:px-8 md:items-start">

        {/* LEFT COLUMN */}
        <div>
          {/* Daily card */}
          <div className="px-5 mb-6 md:px-0">
            <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: "#1A0514" }}>
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--bb-pink)" }}>
                <span>🌸</span>
              </div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--mid-pink)" }}>✦ THE DAILY · FROM YANDE</p>
              <p className="text-white text-2xl font-bold leading-snug mb-1 italic" style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}>
                Matcha morning in Williamsburg.
              </p>
              <p className="text-white/50 text-sm mb-5">Sunday 10AM · 3 seats · $1 deposit · 30% off nearby</p>
              <div className="flex gap-3">
                <button className="flex-1 py-3 rounded-full text-white font-semibold text-sm border border-white/30 hover:bg-white/10 transition-colors">
                  See the Seat ✨
                </button>
                <button className="flex-1 py-3 rounded-full font-semibold text-sm transition-colors" style={{ background: "var(--bb-pink)", color: "white" }}>
                  Get Drop 🌸
                </button>
              </div>
            </div>
          </div>

          {/* Open Seats */}
          <div className="px-5 mb-6 md:px-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Open Seats</p>
              <button className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>See all →</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {openSeats.map((seat) => (
                <div key={seat.id} className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div className="h-20 flex items-center justify-center text-3xl" style={{ background: seat.bg }}>{seat.emoji}</div>
                  <div className="p-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mb-1" style={{ background: "var(--bb-pink)", color: "white" }}>● {seat.badge}</span>
                    <p className="text-sm font-semibold leading-snug" style={{ color: "var(--bb-black)" }}>{seat.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{seat.detail}</p>
                    <button className="mt-2 w-full py-1.5 rounded-full text-white text-xs font-bold" style={{ background: "var(--bb-pink)" }}>Join 🌸</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events — desktop extra section */}
          <div className="hidden md:block mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Upcoming Events</p>
              <button className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>See all →</button>
            </div>
            <div className="flex flex-col gap-3">
              {EVENTS_PREVIEW.map((evt, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: "var(--light-pink)" }}>{evt.emoji}</div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{evt.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{evt.detail}</p>
                    <p className="text-xs font-bold mt-0.5" style={{ color: "var(--bb-pink)" }}>{evt.host}</p>
                  </div>
                  <button className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border-2 transition-colors hover:bg-pink-50" style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}>RSVP</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — desktop only */}
        <div className="hidden md:flex flex-col gap-5">

          {/* What is BloomBay */}
          <div className="rounded-3xl overflow-hidden" style={{ background: "#1A0514" }}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <BBLogo size={22} light />
                <span className="text-white font-bold text-sm tracking-widest uppercase">ABOUT</span>
              </div>
              <p className="text-white font-bold text-lg leading-snug mb-2 italic" style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}>
                The only world built for women.
              </p>
              <p className="text-white/60 text-xs leading-relaxed mb-4">
                BloomBay is NYC's first women-only social platform. Real friendships, live-verified members, city-wide events, and a world that moves with you.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Girl Clubs", "Happenings", "Girl Tonight", "Girl Map", "Girl Lounge"].map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(255,31,125,0.2)", color: "#FF69B4" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Tonight's Drops */}
          <div className="rounded-3xl p-4" style={{ background: "#1A0514" }}>
            <p className="text-xs font-bold tracking-widest uppercase text-pink-400 mb-3">● GIRL TONIGHT · DROPS</p>
            <div className="flex flex-col gap-2">
              {TONIGHT_DROPS.map((d, i) => (
                <div key={i} className="rounded-2xl p-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <span className="text-xl">{d.emoji}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">{d.title}</p>
                    <p className="text-white/50 text-xs">{d.detail}</p>
                  </div>
                  <span className="text-pink-400 text-xs font-bold">{d.spots}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Girl Clubs spotlight */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Girl Clubs</p>
              <button className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>All clubs →</button>
            </div>
            <div className="flex flex-col gap-2">
              {CLUBS_PREVIEW.map((club, i) => (
                <div key={i} className="bg-white rounded-2xl p-3.5 flex items-center gap-3" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: "var(--light-pink)" }}>{club.emoji}</div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{club.name}</p>
                    <p className="text-xs text-gray-400">{club.members}</p>
                  </div>
                  <button className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}>Join</button>
                </div>
              ))}
            </div>
          </div>

          {/* Girl Lounge teaser */}
          <div className="rounded-3xl p-4" style={{ background: "var(--light-pink)" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--bb-pink)" }}>MY LOUNGE</p>
            <p className="font-bold text-sm mb-3" style={{ color: "var(--bb-black)" }}>Your private world awaits</p>
            <div className="flex gap-3">
              {[
                { emoji: "📓", label: "Journal" },
                { emoji: "🌸", label: "Yande" },
                { emoji: "💌", label: "Girl Mail" },
              ].map((item) => (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-white">{item.emoji}</div>
                  <p className="text-xs font-semibold" style={{ color: "var(--bb-black)" }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE-ONLY: extra sections ── */}
      <div className="md:hidden px-5">
        {/* Mobile events preview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Upcoming Events</p>
            <button className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>See all →</button>
          </div>
          <div className="flex flex-col gap-3">
            {EVENTS_PREVIEW.slice(0, 2).map((evt, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: "var(--light-pink)" }}>{evt.emoji}</div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{evt.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{evt.detail}</p>
                  <p className="text-xs font-bold mt-0.5" style={{ color: "var(--bb-pink)" }}>{evt.host}</p>
                </div>
                <button className="flex-shrink-0 px-3 py-2 rounded-full text-xs font-bold border-2" style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}>RSVP</button>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile club spotlight */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Girl Clubs</p>
            <button className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>All →</button>
          </div>
          <div className="flex flex-col gap-2">
            {CLUBS_PREVIEW.slice(0, 2).map((club, i) => (
              <div key={i} className="bg-white rounded-2xl p-3.5 flex items-center gap-3" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: "var(--light-pink)" }}>{club.emoji}</div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{club.name}</p>
                  <p className="text-xs text-gray-400">{club.members}</p>
                </div>
                <button className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}>Join</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
