import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

const COVERAGE = [
  {
    outlet: "The New York Times",
    headline: "The App Helping Women Reclaim the Art of Gathering",
    date: "May 2026",
  },
  {
    outlet: "Refinery29",
    headline: "BloomBay Is What Happens When Women Build Social Media for Themselves",
    date: "April 2026",
  },
  {
    outlet: "Fast Company",
    headline: "Inside the NYC Startup Proving Real-World Community Beats the Algorithm",
    date: "March 2026",
  },
  {
    outlet: "Essence",
    headline: "BloomBay Wants to Be the Place Every Woman in the City Calls Home",
    date: "February 2026",
  },
];

export default function PressPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-24">

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "#FF1F7D" }}>PRESS</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Media & Press
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            For press inquiries, media assets, and interview requests, reach our communications team directly.
          </p>
          <a
            href="mailto:press@bloombay.app"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full font-bold text-base text-white transition-all hover:brightness-110"
            style={{ background: "#FF1F7D" }}
          >
            press@bloombay.app
          </a>
        </div>

        {/* Fast facts */}
        <div className="rounded-3xl p-8 md:p-12 mb-16" style={{ background: "#111111" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-8" style={{ color: "#FF1F7D" }}>FAST FACTS</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: "2025", l: "Founded in New York City" },
              { n: "NYC", l: "Launching city" },
              { n: "Women", l: "only community 18+" },
              { n: "IRL", l: "Focus — real gatherings, real life" },
            ].map((f) => (
              <div key={f.n} className="text-center">
                <p className="text-2xl font-bold mb-1" style={{ color: "#FF1F7D" }}>{f.n}</p>
                <p className="text-white/50 text-xs leading-snug">{f.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent coverage */}
        <div className="mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-8" style={{ color: "#FF1F7D" }}>AS SEEN IN</p>
          <div className="flex flex-col gap-3">
            {COVERAGE.map((c) => (
              <div key={c.outlet} className="bg-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-3 justify-between" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
                <div>
                  <p className="text-xs font-bold tracking-wider mb-1.5" style={{ color: "#FF1F7D" }}>{c.outlet}</p>
                  <p className="font-semibold text-sm leading-snug" style={{ color: "#111111" }}>{c.headline}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{c.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assets */}
        <div className="rounded-3xl p-8 text-center" style={{ background: "#FFF5F8" }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Brand assets & media kit
          </h2>
          <p className="text-sm text-gray-500 mb-5">Logos, photography, founder bios, and brand guidelines — available on request.</p>
          <a
            href="mailto:press@bloombay.app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white"
            style={{ background: "#FF1F7D" }}
          >
            Request media kit
          </a>
        </div>
      </div>
    </MarketingLayout>
  );
}
