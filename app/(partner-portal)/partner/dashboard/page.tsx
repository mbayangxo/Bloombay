const UPCOMING_EVENTS = [
  { emoji: "🍷", title: "Sunset Dinner", detail: "Jun 5, 2025 · 7:00 PM", going: 12 },
  { emoji: "☕", title: "Coffee & Connections", detail: "Jun 12, 2025 · 10:00 AM", going: 16 },
  { emoji: "🌸", title: "BloomBay Brunch", detail: "Jun 19, 2025 · 11:00 AM", going: 16 },
];

const RECENT_BOOKINGS = [
  { name: "Maya W.", detail: "May 29 · 7:00 PM · 6 guests" },
  { name: "Leila K.", detail: "May 27 · 12:00 PM · 4 guests" },
  { name: "Tara S.", detail: "May 26 · 11:00 AM · 3 guests" },
];

const PERKS = [
  "Priority Placement",
  "Partner Badge",
  "Event Promotion",
  "Access to Bloomies",
];

const MESSAGES = [
  { from: "BloomBay Team", preview: "Partnership update", time: "2h ago" },
  { from: "Leila K.", preview: "Event inquiry", time: "1d ago" },
  { from: "Maya W.", preview: "Special request", time: "2d ago" },
];

export default function PartnerDashboardPage() {
  return (
    <div className="min-h-screen pb-10" style={{ background: "#FFF5F8" }}>
      {/* Header */}
      <div className="px-8 pt-8 pb-6" style={{ background: "white", borderBottom: "1px solid #FFE0EE" }}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: "var(--light-pink)" }}
            >
              🌹
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold" style={{ color: "var(--bb-black)" }}>Ladurée SoHo</h1>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}>✓ Verified Partner</span>
              </div>
              <p className="text-sm text-gray-400">Café &amp; Restaurant · SoHo, New York</p>
              <p className="italic text-sm mt-1" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)" }}>Merci!</p>
            </div>
          </div>
          {/* Bloom Partner stamp */}
          <div
            className="rounded-2xl px-5 py-4 text-center border-2 border-dashed"
            style={{ borderColor: "var(--bb-pink)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>BLOOM</p>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>PARTNER</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-6">
          {[
            { n: "8", l: "Events Hosted" },
            { n: "412", l: "Women Hosted" },
            { n: "$8,240", l: "Revenue" },
            { n: "4.9 ⭐", l: "Rating" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-2xl font-bold" style={{ color: "var(--bb-black)" }}>{s.n}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 pt-6 grid grid-cols-[1fr_320px] gap-6">
        {/* Left */}
        <div className="flex flex-col gap-5">
          {/* Upcoming Events */}
          <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Upcoming Events</p>
              <button className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>View all →</button>
            </div>
            <div className="flex flex-col gap-3">
              {UPCOMING_EVENTS.map((e, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0" style={{ borderColor: "#FFF0F5" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: "var(--light-pink)" }}>
                    {e.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: "var(--bb-black)" }}>{e.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{e.detail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{e.going}</p>
                    <p className="text-xs text-gray-400">Going</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Recent Bookings</p>
              <button className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>View all →</button>
            </div>
            <div className="flex flex-col gap-3">
              {RECENT_BOOKINGS.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "var(--bb-pink)" }}>
                    {b.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--bb-black)" }}>{b.name}</p>
                    <p className="text-xs text-gray-400">{b.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          {/* Partner Perks */}
          <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--bb-pink)" }}>PARTNER PERKS · Thank you!</p>
            <div className="flex flex-col gap-2">
              {PERKS.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <span style={{ color: "var(--bb-pink)" }}>◆</span>
                  <p className="text-sm" style={{ color: "var(--bb-black)" }}>{p}</p>
                </div>
              ))}
            </div>
            <button className="mt-3 text-xs font-semibold" style={{ color: "var(--bb-pink)" }}>Learn more about perks →</button>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>Messages</p>
              <button className="text-xs font-semibold" style={{ color: "var(--bb-pink)" }}>View all →</button>
            </div>
            <div className="flex flex-col gap-3">
              {MESSAGES.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "var(--bb-pink)" }}>
                    {m.from[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--bb-black)" }}>{m.from}</p>
                    <p className="text-xs text-gray-400 truncate">{m.preview}</p>
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">{m.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bloom Partner card */}
          <div className="rounded-3xl p-5" style={{ background: "var(--bb-pink)" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>BLOOM PARTNER</p>
            <p className="text-white font-bold italic text-lg leading-snug" style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}>
              &ldquo;Let&apos;s create magic together.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
