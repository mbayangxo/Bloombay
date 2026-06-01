import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

const ROLES = [
  {
    team: "Product",
    title: "Senior Product Designer",
    type: "Full-time · NYC",
    desc: "You'll shape the visual and interaction language of BloomBay — from the first tap a new member takes to the moment she posts her first gathering.",
  },
  {
    team: "Engineering",
    title: "Full-Stack Engineer",
    type: "Full-time · Remote",
    desc: "Build the infrastructure that powers real-world connections at scale. We work in Next.js, TypeScript, and Supabase.",
  },
  {
    team: "Community",
    title: "City Lead — New York",
    type: "Full-time · NYC",
    desc: "The heartbeat of BloomBay on the ground. You'll recruit club owners, host BloomBay IRL events, and make sure this city feels alive.",
  },
  {
    team: "Operations",
    title: "Trust & Safety Specialist",
    type: "Part-time · Remote",
    desc: "Review reports, protect members, and help build the policies that keep BloomBay a genuinely safe space for every woman in the community.",
  },
];

export default function CareersPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-24">

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "#FF1F7D" }}>CAREERS</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "#1A0514", fontFamily: "var(--font-playfair)" }}>
            Build the world<br />women deserve.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            We are a small team with a very large belief: that women gathering together in the real world changes everything. Come build it with us.
          </p>
        </div>

        {/* Values */}
        <div className="rounded-3xl p-8 md:p-12 mb-16" style={{ background: "#1A0514" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-8" style={{ color: "#FF1F7D" }}>WHAT WE BELIEVE</p>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { t: "Real over virtual", b: "We build for the moments that happen offline — the dinners, the walks, the introductions that change lives." },
              { t: "Trust is the product", b: "Safety, verification, and authentic community are not features. They are the foundation." },
              { t: "Women lead here", b: "The majority of our team, leadership, and community is women. By design." },
              { t: "Small and intentional", b: "We are not trying to be every social app. We are trying to be the one that actually matters." },
            ].map((v) => (
              <div key={v.t}>
                <p className="font-bold text-white text-sm mb-1">{v.t}</p>
                <p className="text-white/50 text-sm leading-relaxed">{v.b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open roles */}
        <div className="mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-8" style={{ color: "#FF1F7D" }}>OPEN ROLES</p>
          <div className="flex flex-col gap-4">
            {ROLES.map((role) => (
              <div key={role.title} className="rounded-2xl p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>{role.team}</span>
                    <span className="text-xs text-gray-400">{role.type}</span>
                  </div>
                  <p className="font-bold text-base mb-1" style={{ color: "#1A0514" }}>{role.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-lg">{role.desc}</p>
                </div>
                <Link
                  href="/contact"
                  className="flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm text-white"
                  style={{ background: "#FF1F7D" }}
                >
                  Apply
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* General */}
        <div className="rounded-3xl p-8 text-center" style={{ background: "#FFF5F8" }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1A0514", fontFamily: "var(--font-playfair)" }}>
            Don&apos;t see your role?
          </h2>
          <p className="text-sm text-gray-500 mb-5">We are always open to meeting the right people. Send us a note.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white"
            style={{ background: "#FF1F7D" }}
          >
            Say hello
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
