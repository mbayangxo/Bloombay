const STATS = [
  { n: "12,842", label: "Total Women", delta: "+287 this week" },
  { n: "7,196",  label: "Active (30d)", delta: "+142 this week" },
  { n: "214",    label: "Clubs",        delta: "+6 this week" },
  { n: "58",     label: "Cities",       delta: "+2 this month" },
  { n: "312",    label: "Partners",     delta: "+9 this week" },
];

const CITIES = [
  { city: "New York, NY", n: "4,312" },
  { city: "London, UK",   n: "1,842" },
  { city: "Toronto, CA",  n: "1,103" },
  { city: "Los Angeles, CA", n: "982" },
  { city: "Atlanta, GA",  n: "713" },
];

const ACTIVITY = [
  { text: "The Artist Circle just launched", time: "2h ago" },
  { text: "Wellness Circle hit 100 members", time: "4h ago" },
  { text: "Leila K. joined as Curator", time: "6h ago" },
  { text: "Ladurée SoHo is now a partner", time: "1d ago" },
  { text: "32 new club requests", time: "1d ago" },
];

const COHORT = [
  { label: "Joined",       n: "1,248", sub: "78%" },
  { label: "Verified",     n: "980",   sub: "62%" },
  { label: "Joined Club",  n: "612",   sub: "44%" },
  { label: "Reserved Seat",n: "432",   sub: "44%" },
  { label: "Attended Seat",n: "286",   sub: "23%" },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen pb-10" style={{ background: "#0D0D0D", color: "white" }}>
      {/* Header */}
      <div className="px-8 pt-8 pb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#FF1F7D" }}>
            FOUNDER PORTAL
          </p>
          <h1 className="text-5xl font-bold leading-none">Mission Control</h1>
          <p className="text-lg italic mt-1" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
            We build belonging
          </p>
        </div>
        {/* Blooming Daily card */}
        <div className="rounded-2xl px-5 py-4 text-center" style={{ background: "#FF1F7D", minWidth: "150px" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>BLOOMING DAILY</p>
          <p className="text-4xl font-bold">12,842</p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>WOMEN</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>+287 TODAY</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-8 mb-6 grid grid-cols-5 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl px-4 py-4" style={{ background: "rgba(255,255,255,0.05)" }}>
            <p className="text-2xl font-bold">{s.n}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</p>
            <p className="text-xs mt-1 font-semibold" style={{ color: "#FF1F7D" }}>{s.delta}</p>
          </div>
        ))}
      </div>

      {/* Main 2-col */}
      <div className="px-8 grid grid-cols-[1fr_300px] gap-6">
        {/* Left */}
        <div className="flex flex-col gap-5">
          {/* Growth + Top Cities */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold">Growth Over Time</p>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,31,125,0.2)", color: "#FF69B4" }}>This Month</span>
              </div>
              {/* Simple sparkline bar chart */}
              <div className="flex items-end gap-1 h-16">
                {[40, 55, 45, 70, 60, 80, 75, 90, 85, 100].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 9 ? "#FF1F7D" : "rgba(255,31,125,0.25)" }} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>May 1</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Jun 5</p>
              </div>
            </div>
            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold">Top Cities</p>
                <span className="text-xs" style={{ color: "#FF1F7D" }}>This Month →</span>
              </div>
              <div className="flex flex-col gap-2">
                {CITIES.map((c) => (
                  <div key={c.city} className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{c.city}</p>
                    <p className="text-xs font-bold">{c.n}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What's Happening */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-sm font-semibold">What&apos;s Happening</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(255,31,125,0.2)", color: "#FF69B4" }}>● LIVE</span>
            </div>
            <div className="flex flex-col gap-2">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#FF1F7D" }} />
                  <p className="text-sm flex-1" style={{ color: "rgba(255,255,255,0.7)" }}>{a.text}</p>
                  <p className="text-xs flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>{a.time}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 text-xs font-semibold" style={{ color: "#FF1F7D" }}>See all activity →</button>
          </div>

          {/* First 14 Days Cohort */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">First 14 Days Cohort</p>
              <span className="text-xs" style={{ color: "#FF1F7D" }}>May 17 – May 30 →</span>
            </div>
            <div className="flex gap-4">
              {COHORT.map((c, i) => (
                <div key={i} className="flex-1 text-center">
                  <p className="text-xl font-bold">{c.n}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{c.label}</p>
                  <p className="text-xs font-bold mt-1" style={{ color: "#FF69B4" }}>{c.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          {/* Community Pulse */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-sm font-semibold">Community Pulse</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(255,31,125,0.2)", color: "#FF69B4" }}>Live</span>
            </div>
            <div className="flex gap-4">
              {[{ n: "8", l: "Clubs active" }, { n: "24", l: "Seats open" }, { n: "312", l: "Women online" }].map((s) => (
                <div key={s.l} className="flex-1 text-center">
                  <p className="text-xl font-bold" style={{ color: "#FF1F7D" }}>{s.n}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Yande Insight */}
          <div className="rounded-2xl p-5" style={{ background: "#FF1F7D" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>YANDE INSIGHT</p>
            <p className="text-white font-bold italic text-lg leading-snug" style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}>
              &ldquo;The most powerful currency is presence.&rdquo;
            </p>
          </div>

          {/* Open Blooms */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.05)" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>OPEN BLOOMS</p>
            <p className="text-5xl font-bold" style={{ color: "#FF1F7D" }}>24</p>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Requests to review</p>
            <button
              className="mt-4 w-full py-2.5 rounded-full text-sm font-bold text-white"
              style={{ background: "#FF1F7D" }}
            >
              Review Queue
            </button>
          </div>

          {/* Today's Top Blooms */}
          <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">Today&apos;s Top Blooms</p>
              <span className="text-xs" style={{ color: "#FF1F7D" }}>View all →</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["🌸", "🍷", "☕"].map((e, i) => (
                <div key={i} className="rounded-xl h-16 flex items-center justify-center text-2xl" style={{ background: "rgba(255,31,125,0.15)" }}>
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
