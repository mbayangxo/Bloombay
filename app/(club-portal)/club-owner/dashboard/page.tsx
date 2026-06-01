const HAPPENINGS = [
  { emoji: "🧘", title: "Wellness Walk", detail: "Jun 8, 2025 · 8:30 AM · McCarren Park", going: 8 },
  { emoji: "🎵", title: "Sound Bath + Brunch", detail: "Jun 15, 2025 · 10:00 AM · The W Loft", going: 12 },
  { emoji: "📓", title: "Journaling Circle", detail: "Jun 22, 2025 · 7:00 PM · Williamsburg", going: 6 },
];

const OPEN_SEATS = [
  { title: "Pilates + Coffee", detail: "Jun 9 · 9:00 AM · Williamsburg", seats: 3 },
  { title: "Museum Morning", detail: "Jun 11 · 11:00 AM", seats: 2 },
  { title: "Plant Swap + Brunch", detail: "Jun 14 · 10:00 AM", seats: 4 },
];

const REQUESTS = [
  { name: "Sabrina M.", time: "2h ago" },
  { name: "Danielle R.", time: "5h ago" },
  { name: "Aisha P.", time: "1d ago" },
];

export default function ClubOwnerDashboardPage() {
  return (
    <div className="min-h-screen pb-10" style={{ background: "#FFF5F8" }}>
      {/* Club header */}
      <div className="px-8 pt-8 pb-6" style={{ background: "white", borderBottom: "1px solid #FFE0EE" }}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: "var(--light-pink)" }}
            >
              🌿
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold" style={{ color: "var(--bb-black)" }}>Wellness Circle</h1>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}>Active</span>
              </div>
              <p className="text-sm text-gray-400">Williamsburg, Brooklyn</p>
              <p className="text-sm text-gray-500 mt-1">Movement, Mindfulness, Sisterhood.</p>
            </div>
          </div>
          <button
            className="px-5 py-2.5 rounded-full text-sm font-bold border-2"
            style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}
          >
            Edit Club
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-6">
          {[
            { n: "126", l: "Members" },
            { n: "18", l: "Open Seats" },
            { n: "4", l: "Upcoming" },
            { n: "92%", l: "Attendance" },
            { n: "4.9", l: "Rating ⭐" },
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
          {/* Upcoming Happenings */}
          <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Upcoming Happenings</p>
              <button className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>View Calendar →</button>
            </div>
            <div className="flex flex-col gap-3">
              {HAPPENINGS.map((h, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0" style={{ borderColor: "#FFF0F5" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: "var(--light-pink)" }}>
                    {h.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: "var(--bb-black)" }}>{h.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{h.detail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{h.going}</p>
                    <p className="text-xs text-gray-400">Going</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-full py-3 rounded-full text-white font-bold text-sm"
              style={{ background: "var(--bb-pink)" }}
            >
              + Create Happening
            </button>
          </div>

          {/* Requests */}
          <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Requests</p>
              <button className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>View all →</button>
            </div>
            <div className="flex flex-col gap-3">
              {REQUESTS.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "var(--bb-pink)" }}>
                    {r.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "var(--bb-black)" }}>{r.name}</p>
                    <p className="text-xs text-gray-400">Requested to join · {r.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--bb-pink)", color: "white" }}>Accept</button>
                    <button className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "#F5F5F5", color: "#999" }}>Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          {/* Open Seats */}
          <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>Open Seats</p>
              <button className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>View all →</button>
            </div>
            <div className="flex flex-col gap-3">
              {OPEN_SEATS.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "#FFF0F5" }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--bb-black)" }}>{s.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.detail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color: "var(--bb-pink)" }}>{s.seats}</p>
                    <p className="text-xs text-gray-400">seats left</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-3 w-full py-2.5 rounded-full font-bold text-sm border-2"
              style={{ borderColor: "var(--bb-pink)", color: "var(--bb-pink)" }}
            >
              Manage Open Seats
            </button>
          </div>

          {/* Club Vibes */}
          <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>Your Club Vibes</p>
              <button className="text-xs font-semibold" style={{ color: "var(--bb-pink)" }}>Edit</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["🌿", "☕", "🧘"].map((e, i) => (
                <div key={i} className="h-16 rounded-xl flex items-center justify-center text-2xl" style={{ background: "var(--light-pink)" }}>{e}</div>
              ))}
            </div>
          </div>

          {/* Leila card */}
          <div className="rounded-3xl p-4" style={{ background: "var(--light-pink)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "var(--bb-pink)" }}>L</div>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>Leila K.</p>
                <p className="text-xs text-gray-400">Club Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
