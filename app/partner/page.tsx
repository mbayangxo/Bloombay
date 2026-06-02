import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

export default function PartnerPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-24">

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "#FF1F7D" }}>PARTNERS</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Reach women who<br />actually show up.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            BloomBay connects brands with engaged, community-driven women in the real world — at dinners, museum visits, wellness gatherings, and more.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full font-bold text-base text-white transition-all hover:brightness-110"
            style={{ background: "#FF1F7D" }}
          >
            Start a conversation
          </Link>
        </div>

        {/* Partnership types */}
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {[
            {
              title: "Event Sponsorship",
              desc: "Put your brand inside real gatherings — curated dinners, cultural outings, wellness events — with women who are present, not scrolling.",
              icon: "ticket",
            },
            {
              title: "Club Partnerships",
              desc: "Partner with specific clubs whose members align with your brand. Think book clubs, museum-goers, wellness circles, travel groups.",
              icon: "clubs",
            },
            {
              title: "In-App Presence",
              desc: "Contextual brand placement inside the BloomBay member experience — never intrusive, always intentional.",
              icon: "app",
            },
            {
              title: "IRL Activations",
              desc: "Co-create a BloomBay experience. Host a gathering, curate a moment, sponsor a city-wide event. Your brand becomes the memory.",
              icon: "city",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl p-7 bg-white" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div className="w-10 h-10 rounded-full mb-4" style={{ background: "#FFF0F5" }}>
                <div className="w-full h-full rounded-full flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="1.8" strokeLinecap="round">
                    {item.icon === "ticket" && <><path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z" /></>}
                    {item.icon === "clubs" && <><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 018 0v2" /></>}
                    {item.icon === "app" && <><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>}
                    {item.icon === "city" && <><path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21V11h6v10" /></>}
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: "#111111" }}>{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="rounded-3xl p-10 mb-16" style={{ background: "#111111" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-8 text-center" style={{ color: "#FF1F7D" }}>THE BLOOMBAY WOMAN</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: "92%", l: "attend gatherings they RSVP to" },
              { n: "3.4×", l: "more likely to recommend a brand she discovered IRL" },
              { n: "18–42", l: "primary age range" },
              { n: "NYC", l: "launching with more cities soon" },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <p className="text-3xl font-bold mb-1" style={{ color: "#FF1F7D" }}>{s.n}</p>
                <p className="text-white/50 text-xs leading-snug">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl p-10 text-center" style={{ background: "#FFF5F8" }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Let&apos;s build something together.
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Tell us about your brand, your goals, and the kind of women you want to reach. We will find the right fit.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white"
            style={{ background: "#FF1F7D" }}
          >
            Get in touch
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
