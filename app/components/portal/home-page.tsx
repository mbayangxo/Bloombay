import { TopBar } from "./top-bar";

const nearbyWave = [
  { name: "Aaliyah", initial: "A", color: "#FF6B6B" },
  { name: "Sofia",   initial: "S", color: "#C06BE8" },
  { name: "Priya",   initial: "P", color: "#6B9EFF" },
  { name: "Cam",     initial: "C", color: "#FFB347" },
  { name: "Kezia",   initial: "K", color: "#FF69B4" },
];

const openSeats = [
  {
    id: 1,
    badge: "2 SEATS",
    title: "Girls dinner · Carbone",
    detail: "Tonight 7PM",
    bg: "#FFF0F5",
    emoji: "🍷",
  },
  {
    id: 2,
    badge: "3 SEATS",
    title: "Run Club",
    detail: "Sat 7AM · Free",
    bg: "#F0FFF4",
    emoji: "🏃‍♀️",
  },
  {
    id: 3,
    badge: "2 SPOTS",
    title: "MoMA visit",
    detail: "Sat 11AM · 2 spots",
    bg: "#F0F0FF",
    emoji: "🎨",
  },
  {
    id: 4,
    badge: "4 SEATS",
    title: "Pilates + matcha",
    detail: "Sun 9AM · $20",
    bg: "#FFFDE7",
    emoji: "🧘",
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen pb-36" style={{ background: "var(--pale-pink-bg)" }}>
      <TopBar />

      {/* Greeting */}
      <div className="px-5 pb-4">
        <h1 className="text-4xl font-bold leading-tight" style={{ color: "var(--bb-black)" }}>
          Good morning,
        </h1>
        <h1
          className="text-4xl font-bold italic"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-pink)", fontWeight: 400 }}
        >
          Maya.
        </h1>
        <div className="mt-1 h-0.5 w-12 rounded-full" style={{ background: "var(--bb-pink)" }} />
      </div>

      {/* Daily card */}
      <div className="px-5 mb-6">
        <div
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{ background: "#1A0514" }}
        >
          <div
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "var(--bb-pink)" }}
          >
            <span>🌸</span>
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--mid-pink)" }}>
            ✦ THE DAILY · FROM YANDE
          </p>
          <p
            className="text-white text-2xl font-bold leading-snug mb-1 italic"
            style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}
          >
            Matcha morning in Williamsburg.
          </p>
          <p className="text-white/50 text-sm mb-5">
            Sunday 10AM · 3 seats · $1 deposit · 30% off nearby
          </p>
          <div className="flex gap-3">
            <button
              className="flex-1 py-3 rounded-full text-white font-semibold text-sm border border-white/30 hover:bg-white/10 transition-colors"
            >
              See the Seat ✨
            </button>
            <button
              className="flex-1 py-3 rounded-full font-semibold text-sm transition-colors"
              style={{ background: "var(--bb-pink)", color: "white" }}
            >
              Get Drop 🌸
            </button>
          </div>
        </div>
      </div>

      {/* Nearby Wave */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p
            className="text-base font-bold italic"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
          >
            Nearby Wave
          </p>
          <button className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>
            See all →
          </button>
        </div>
        <div className="flex gap-4">
          {nearbyWave.map((person) => (
            <div key={person.name} className="flex flex-col items-center gap-1.5">
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-white"
                  style={{ background: person.color }}
                >
                  {person.initial}
                </div>
                <div
                  className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white"
                  style={{ background: "#4CAF50" }}
                />
              </div>
              <p className="text-xs text-gray-500 font-medium">{person.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Seats */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <p
            className="text-base font-bold italic"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}
          >
            Open Seats
          </p>
          <button className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>
            See all →
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {openSeats.map((seat) => (
            <div
              key={seat.id}
              className="rounded-2xl overflow-hidden"
              style={{ background: seat.bg }}
            >
              <div
                className="h-24 flex items-center justify-center text-3xl"
                style={{ background: `${seat.bg}` }}
              >
                {seat.emoji || "🍷"}
              </div>
              <div className="p-3">
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mb-1"
                  style={{ background: "var(--bb-pink)", color: "white" }}
                >
                  ● {seat.badge}
                </span>
                <p className="text-sm font-semibold leading-snug" style={{ color: "var(--bb-black)" }}>
                  {seat.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{seat.detail}</p>
                <button
                  className="mt-2 w-full py-1.5 rounded-full text-white text-xs font-bold"
                  style={{ background: "var(--bb-pink)" }}
                >
                  Join 🌸
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
