import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

const EVENTS = [
  {
    tag: "TONIGHT",
    date: "Mon, Jun 1",
    time: "7:00 PM",
    title: "Museum Evening at The Met",
    location: "Upper East Side, NYC",
    seats: "4 seats left",
    color: "linear-gradient(160deg, #111111 0%, #FF1F7D 100%)",
    official: true,
  },
  {
    tag: "THIS WEEK",
    date: "Wed, Jun 3",
    time: "10:00 AM",
    title: "Morning Walk: High Line to Chelsea Market",
    location: "Chelsea, NYC",
    seats: "8 seats left",
    color: "linear-gradient(160deg, #1a2a1a 0%, #2a5230 100%)",
    official: true,
  },
  {
    tag: "THIS WEEK",
    date: "Fri, Jun 5",
    time: "7:30 PM",
    title: "Dinner Society: Long Table Edition",
    location: "West Village, NYC",
    seats: "2 seats left",
    color: "linear-gradient(160deg, #FF1F7D 0%, #111111 100%)",
    official: true,
  },
  {
    tag: "THIS MONTH",
    date: "Sat, Jun 14",
    time: "2:00 PM",
    title: "Book Club Pop-Up at Housing Works",
    location: "SoHo, NYC",
    seats: "12 seats left",
    color: "linear-gradient(160deg, #2a1a0a 0%, #5a3010 100%)",
    official: true,
  },
  {
    tag: "THIS MONTH",
    date: "Sun, Jun 22",
    time: "11:00 AM",
    title: "Bloom in the Park — Picnic Edition",
    location: "Central Park, NYC",
    seats: "20 seats left",
    color: "linear-gradient(160deg, #1a2a1a 0%, #3a5a30 100%)",
    official: true,
  },
];

export default function EventsPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-24">

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "#FF1F7D" }}>BLOOMBAY EVENTS</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Official BloomBay<br />Gatherings
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            Curated by the BloomBay team and open to all members. These are the events we design, host, and show up for ourselves.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#FF1F7D" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className="text-sm font-semibold" style={{ color: "#FF1F7D" }}>BloomBay Official</span>
          </div>
        </div>

        {/* Event list */}
        <div className="flex flex-col gap-4 mb-16">
          {EVENTS.map((ev) => (
            <div key={ev.title} className="rounded-3xl overflow-hidden flex" style={{ boxShadow: "0 1px 10px rgba(0,0,0,0.06)" }}>
              {/* Color stub */}
              <div className="w-3 flex-shrink-0" style={{ background: ev.color }} />
              <div className="flex-1 bg-white p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>{ev.tag}</span>
                    {ev.official && (
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#FF1F7D" }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </div>
                        <span className="text-xs font-bold" style={{ color: "#FF1F7D" }}>Official</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-base mb-1" style={{ color: "#111111" }}>{ev.title}</h3>
                  <p className="text-sm text-gray-400">{ev.date} · {ev.time} · {ev.location}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-bold" style={{ color: "#FF1F7D" }}>{ev.seats}</span>
                  <Link
                    href="/onboard"
                    className="px-5 py-2.5 rounded-full font-bold text-sm text-white"
                    style={{ background: "#FF1F7D" }}
                  >
                    Grab a seat
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join CTA */}
        <div className="rounded-3xl p-8 text-center" style={{ background: "#FFF5F8" }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Members reserve seats first.
          </h2>
          <p className="text-sm text-gray-500 mb-5">BloomBay events open to members before the public. Join to get early access.</p>
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
