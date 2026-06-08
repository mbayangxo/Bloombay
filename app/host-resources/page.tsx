import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

const GUIDES = [
  {
    tag: "GETTING STARTED",
    title: "Your First Gathering: A Complete Guide",
    desc: "From posting a seat to welcoming your first guests — everything you need before day one.",
    icon: "star",
  },
  {
    tag: "SAFETY",
    title: "Bloom Guard Training",
    desc: "Required for all paid-gathering hosts. 12 minutes that cover safe hosting, managing difficult situations, and connecting members to support.",
    icon: "shield",
  },
  {
    tag: "COMMUNITY",
    title: "Building Your Clubhouse",
    desc: "How to set up your club profile, write an application form that attracts the right members, and create a culture worth staying for.",
    icon: "home",
  },
  {
    tag: "FINANCES",
    title: "Pricing Your Gatherings",
    desc: "How to set prices that feel fair, use deposits effectively, and understand how BloomBay's commission works.",
    icon: "wallet",
  },
  {
    tag: "GROWTH",
    title: "Using Yande to Match Members",
    desc: "Yande is BloomBay's matching system. Learn how to use it to find women who will genuinely belong in your club.",
    icon: "users",
  },
  {
    tag: "OPERATIONS",
    title: "Managing RSVPs and Attendance",
    desc: "How the seat management system works — confirmations, deposits, Drop My Spot, and day-of reminders.",
    icon: "calendar",
  },
];

export default function HostResourcesPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-24">

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "#FF1F7D" }}>HOST RESOURCES</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Everything you need<br />to host well.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            Guides, tools, and training for BloomBay club owners and hosts. You bring the vision — we give you the infrastructure.
          </p>
        </div>

        {/* Resource grid */}
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {GUIDES.map((guide) => (
            <div key={guide.title} className="rounded-3xl p-6 bg-white" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FFF0F5" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="1.8" strokeLinecap="round">
                    {guide.icon === "star"     && <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />}
                    {guide.icon === "shield"   && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
                    {guide.icon === "home"     && <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>}
                    {guide.icon === "wallet"   && <><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>}
                    {guide.icon === "users"    && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>}
                    {guide.icon === "calendar" && <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>}
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wider" style={{ color: "#FF1F7D" }}>{guide.tag}</span>
                  <h3 className="font-bold text-sm mt-1 mb-1.5" style={{ color: "#111111" }}>{guide.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{guide.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bloom Guard callout */}
        <div className="rounded-3xl p-8 md:p-10 mb-16" style={{ background: "#111111" }}>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF1F7D" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#FF1F7D" }}>REQUIRED</p>
              <h3 className="font-bold text-lg text-white mb-2">Bloom Guard Host Training</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-lg">
                Every host collecting payment for a gathering must complete Bloom Guard training before their first event. It takes 12 minutes and covers safe hosting, handling difficult situations, and knowing when and how to involve our safety team.
              </p>
              <Link href="/onboard" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full font-bold text-sm" style={{ background: "#FF1F7D", color: "white" }}>
                Start training
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl p-8 text-center" style={{ background: "#FFF5F8" }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Ready to start hosting?
          </h2>
          <p className="text-sm text-gray-500 mb-5">Apply to start a club and get access to your full host dashboard.</p>
          <Link
            href="/start-a-club"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white"
            style={{ background: "#FF1F7D" }}
          >
            Start a club
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
