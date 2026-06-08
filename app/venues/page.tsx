import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

const VENUES = [
  {
    name: "Café Marlowe",
    neighborhood: "West Village",
    type: "Café · Private dining room available",
    capacity: "Up to 16",
    note: "BloomBay approved",
  },
  {
    name: "The Studio at Greene St.",
    neighborhood: "SoHo",
    type: "Studio space · Yoga & events",
    capacity: "Up to 30",
    note: "BloomBay approved",
  },
  {
    name: "Rooftop at The Nines",
    neighborhood: "Lower East Side",
    type: "Rooftop bar · Private buy-outs",
    capacity: "Up to 25",
    note: "BloomBay approved",
  },
  {
    name: "Private Dining at Maison",
    neighborhood: "Midtown East",
    type: "French bistro · Full room hire",
    capacity: "Up to 20",
    note: "BloomBay approved",
  },
  {
    name: "The Garden Room",
    neighborhood: "Brooklyn Heights",
    type: "Garden venue · Sunlit events",
    capacity: "Up to 40",
    note: "BloomBay approved",
  },
  {
    name: "Williamsburg Loft Collective",
    neighborhood: "Williamsburg",
    type: "Open loft · Flexible layout",
    capacity: "Up to 50",
    note: "BloomBay approved",
  },
];

export default function VenuesPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-24">

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "#FF1F7D" }}>VENUE DIRECTORY</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Spaces worth<br />gathering in.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            Every venue in this directory has been reviewed by our team. They are welcoming, beautiful, and suited for the kind of gatherings BloomBay hosts deserve.
          </p>
        </div>

        {/* Filter strip */}
        <div className="flex gap-2 flex-wrap mb-10">
          {["All NYC", "West Village", "SoHo", "Brooklyn", "Lower East Side", "Midtown"].map((f, i) => (
            <span
              key={f}
              className="px-4 py-2 rounded-full text-xs font-bold cursor-pointer"
              style={{
                background: i === 0 ? "#FF1F7D" : "#FFF5F8",
                color: i === 0 ? "white" : "#888",
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Venue grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-16">
          {VENUES.map((v) => (
            <div key={v.name} className="rounded-2xl p-6 bg-white" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-base" style={{ color: "#111111" }}>{v.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{v.neighborhood}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ml-2" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>
                  ✓ {v.note}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{v.type}</p>
              <div className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                </svg>
                <span className="text-xs font-medium" style={{ color: "#FF1F7D" }}>{v.capacity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add your venue */}
        <div className="rounded-3xl p-8 md:p-10" style={{ background: "#111111" }}>
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#FF1F7D" }}>VENUE OWNERS</p>
              <h3 className="font-bold text-xl text-white mb-2">Is your space BloomBay-worthy?</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-md">
                We are always looking for welcoming, beautiful spaces for our hosts to gather in. Submit your venue for review and we will be in touch.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 px-6 py-3 rounded-full font-bold text-sm text-white"
              style={{ background: "#FF1F7D" }}
            >
              Submit a venue
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
