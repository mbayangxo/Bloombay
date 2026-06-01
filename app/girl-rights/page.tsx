import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

const RIGHTS = [
  {
    n: "01",
    title: "You have the right to be safe.",
    body: "Every woman in BloomBay has the right to feel safe at every gathering, in every club, and in every message. Safety is not a feature — it is the foundation. If something makes you feel unsafe, report it. We take every report seriously.",
  },
  {
    n: "02",
    title: "You have the right to be real.",
    body: "You never have to perform, curate, or compete here. BloomBay is a place for genuine connection, not highlight reels. Show up as you are.",
  },
  {
    n: "03",
    title: "You have the right to know the cost.",
    body: "Every gathering shows its full cost upfront — including any deposit. We do not hide fees or surprise you at the door. What you see is what you pay.",
  },
  {
    n: "04",
    title: "You have the right to change your mind.",
    body: "Life happens. Drop My Spot lets you release your seat up to 24 hours before a gathering, no explanation needed. If you cancel with enough notice, your deposit is returned.",
  },
  {
    n: "05",
    title: "You have the right to your data.",
    body: "Your contact information is never shared with other members or sold to third parties. You can view, edit, or delete your data at any time. When you leave, we delete everything.",
  },
  {
    n: "06",
    title: "You have the right to block and report.",
    body: "You can block or report any user from their profile at any time, no questions asked. Blocks take effect immediately. Every report is reviewed by a human within 24 hours.",
  },
  {
    n: "07",
    title: "You have the right to leave.",
    body: "No dark patterns. No guilt trip. No 'are you sure?' maze. If you want to leave BloomBay, you can. We give you 30 days to change your mind, then everything is gone.",
  },
];

export default function GirlRightsPage() {
  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-24">

        {/* Hero */}
        <div className="mb-14">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF1F7D" }}>GIRL RIGHTS</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Your rights as a<br />BloomBay member.
          </h1>
          <p className="text-base text-gray-500 leading-relaxed max-w-xl">
            This is not legal fine print. It is a real commitment — plain language, no jargon — about what you are owed as a woman in this community.
          </p>
        </div>

        {/* Rights list */}
        <div className="flex flex-col gap-0 mb-16">
          {RIGHTS.map((right, i) => (
            <div
              key={right.n}
              className="py-9 flex gap-6 items-start"
              style={{ borderBottom: i < RIGHTS.length - 1 ? "1px solid #ecddd4" : "none" }}
            >
              <span className="text-2xl font-bold flex-shrink-0 w-10 text-right" style={{ color: "#FF1F7D" }}>{right.n}</span>
              <div>
                <h3 className="font-bold text-base mb-2" style={{ color: "#111111" }}>{right.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{right.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="rounded-3xl p-8 text-center" style={{ background: "#111111" }}>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            Something feels wrong?
          </h2>
          <p className="text-white/60 text-sm mb-6">
            If your rights as a member have been violated, tell us. We will listen and we will act.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white"
            style={{ background: "#FF1F7D" }}
          >
            Contact our team
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
