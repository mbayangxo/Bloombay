import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

const EVENTS = [
  {
    title: "The Summer Table",
    desc: "A long-table dinner for 60 women across 6 clubs. One night. One city. New York City.",
    date: "August 2026",
    color: "linear-gradient(160deg, #FF1F7D 0%, #111111 100%)",
  },
  {
    title: "Bloom in the Park",
    desc: "A morning in Central Park — walks, flowers, coffee, strangers turned friends.",
    date: "July 2026",
    color: "linear-gradient(160deg, #1a2a1a 0%, #2a5230 100%)",
  },
  {
    title: "The First Year Party",
    desc: "BloomBay turns one. The members who built it celebrate together.",
    date: "Fall 2026",
    color: "linear-gradient(160deg, #111111 0%, #FF1F7D 100%)",
  },
];

export default function IRLPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-24">

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "#FF1F7D" }}>BLOOMBAY IRL</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            The city is<br />our venue.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            BloomBay IRL is our series of city-wide activations — large gatherings, pop-up events, and seasonal experiences that bring the entire community together.
          </p>
        </div>

        {/* What is IRL */}
        <div className="rounded-3xl p-8 md:p-12 mb-16" style={{ background: "#111111" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: "#FF1F7D" }}>WHAT IS BLOOMBAY IRL?</p>
          <p className="text-white/80 text-base leading-relaxed max-w-2xl">
            Most BloomBay gatherings happen inside clubs — intimate, curated, by invitation. But a few times a year, we open the city up. BloomBay IRL events are bigger: long tables, rooftop evenings, morning markets, walking tours. They are open to all members and designed to help women from different clubs cross paths.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { n: "All members", l: "Open to every BloomBay member" },
              { n: "3–4×", l: "Per year in each city" },
              { n: "NYC", l: "Launching here first" },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <p className="text-2xl font-bold mb-1" style={{ color: "#FF1F7D" }}>{s.n}</p>
                <p className="text-white/50 text-xs">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-8" style={{ color: "#FF1F7D" }}>COMING UP</p>
          <div className="flex flex-col gap-5">
            {EVENTS.map((ev) => (
              <div key={ev.title} className="rounded-3xl overflow-hidden flex flex-col md:flex-row" style={{ boxShadow: "0 1px 10px rgba(0,0,0,0.06)" }}>
                <div className="w-full md:w-48 h-36 md:h-auto flex-shrink-0" style={{ background: ev.color }} />
                <div className="p-6 bg-white flex flex-col justify-center flex-1">
                  <span className="text-xs font-bold tracking-wider mb-1.5" style={{ color: "#FF1F7D" }}>{ev.date}</span>
                  <h3 className="font-bold text-lg mb-1.5" style={{ color: "#111111" }}>{ev.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notify */}
        <div className="rounded-3xl p-8 text-center" style={{ background: "#FFF5F8" }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Members get first access.
          </h2>
          <p className="text-sm text-gray-500 mb-5">BloomBay IRL events are announced inside the app first. Join to be first to know.</p>
          <Link
            href="/onboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white"
            style={{ background: "#FF1F7D" }}
          >
            Join BloomBay
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
