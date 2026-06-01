import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

export default function AboutPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="px-6 pt-20 pb-16 max-w-4xl mx-auto text-center">
        <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "#FF1F7D" }}>OUR STORY</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
          A world built<br />for women.
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
          BloomBay started with a question: why is it so hard for women in a city of eight million people to find their people?
        </p>
      </section>

      {/* Story sections */}
      <section className="max-w-3xl mx-auto px-6 pb-20 flex flex-col gap-16">
        <div className="rounded-3xl p-8 md:p-12" style={{ background: "#111111" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#FF1F7D" }}>WHERE IT STARTED</p>
          <p className="text-white text-lg leading-relaxed" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
            &ldquo;I moved to New York at 27, knowing no one. I spent six months going to events, downloading apps, making small talk — and feeling more alone every time. I wanted a table to sit at. I wanted to know the women in my neighbourhood. I wanted something real.&rdquo;
          </p>
          <p className="text-white/50 text-sm mt-4">— The Founder</p>
        </div>

        {[
          {
            label: "THE PROBLEM",
            title: "Women in big cities are lonely in public.",
            body: "Social media made it look easy to connect. But real friendship — the kind that shows up for you, that sits at the table with you, that says your name — has never been harder to find. Especially in a city like New York, where you can be surrounded by thousands and still feel completely invisible.",
          },
          {
            label: "THE ANSWER",
            title: "BloomBay is a world, not an app.",
            body: "We built BloomBay so women could find their people, join their clubs, show up for each other's milestones, and build a life in their city. Not through algorithms that flatten everything. Through real gatherings, real introductions, and real moments that matter.",
          },
          {
            label: "THE PROMISE",
            title: "Every woman gets a table.",
            body: "Whether you just moved to the city, or you've been here for ten years but never quite found your circle — BloomBay is your table. Pull up a seat. The women are already there.",
          },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#FF1F7D" }}>{s.label}</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>{s.title}</h2>
            <p className="text-base text-gray-500 leading-relaxed">{s.body}</p>
          </div>
        ))}

        <div className="text-center pt-4">
          <Link
            href="/onboard"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm text-white transition-all hover:brightness-110"
            style={{ background: "#FF1F7D" }}
          >
            Join BloomBay
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
