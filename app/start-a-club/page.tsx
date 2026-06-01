import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

export default function StartAClubPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-24">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "#FF1F7D" }}>CLUB OWNERS</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Start a Club
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            You already know how to bring women together. BloomBay gives you the infrastructure to do it at scale.
          </p>
          <Link
            href="/onboard"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full font-bold text-base text-white transition-all hover:brightness-110"
            style={{ background: "#FF1F7D" }}
          >
            Apply to host a club
          </Link>
        </div>

        {/* What you get */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {[
            { title: "Your Clubhouse", desc: "A dedicated space for your members — events, community board, member profiles, and direct messaging." },
            { title: "Seat Management", desc: "Post gatherings, manage RSVPs, track attendance, and collect deposits automatically." },
            { title: "Your Revenue", desc: "Set your own pricing. BloomBay takes a small commission. The rest is yours." },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl p-6" style={{ background: "#FFF5F8" }}>
              <div className="w-10 h-10 rounded-full mb-4" style={{ background: "#FF1F7D" }} />
              <h3 className="font-bold text-base mb-2" style={{ color: "#111111" }}>{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="rounded-3xl p-8 md:p-12" style={{ background: "#111111" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-8" style={{ color: "#FF1F7D" }}>HOW IT WORKS</p>
          <div className="flex flex-col gap-8">
            {[
              { n: "01", t: "Apply", b: "Tell us about your club concept, who it is for, and how you plan to host gatherings." },
              { n: "02", t: "Build your Clubhouse", b: "Set up your club profile, rules, application form, and access settings." },
              { n: "03", t: "Post your first seat", b: "Invite women to your first gathering. BloomBay handles reservations, deposits, and reminders." },
              { n: "04", t: "Grow your community", b: "Use Yande matching, club health analytics, and BloomBay features to keep your community thriving." },
            ].map((step) => (
              <div key={step.n} className="flex gap-5 items-start">
                <span className="text-2xl font-bold flex-shrink-0 w-10 text-right" style={{ color: "#FF1F7D" }}>{step.n}</span>
                <div>
                  <p className="font-bold text-white text-base">{step.t}</p>
                  <p className="text-white/50 text-sm mt-1">{step.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
