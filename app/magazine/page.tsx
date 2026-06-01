import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

const PREVIEWS = [
  {
    tag: "GATHERING",
    title: "We Hosted a Dinner for 12 Women Who'd Never Met. Here's What Happened.",
    author: "Aminah C.",
    read: "8 min read",
    color: "linear-gradient(160deg, #FF1F7D 0%, #111111 100%)",
  },
  {
    tag: "CULTURE",
    title: "The Art of Arriving Alone (and Leaving with Everyone's Number)",
    author: "BloomBay Editors",
    read: "5 min read",
    color: "linear-gradient(160deg, #111111 0%, #FF1F7D 100%)",
  },
  {
    tag: "CITY",
    title: "New York's Best Saturday Walks, Ranked by Women Who've Done Them All",
    author: "Jade O.",
    read: "6 min read",
    color: "linear-gradient(160deg, #FF69B4 0%, #111111 100%)",
  },
  {
    tag: "COMMUNITY",
    title: "Why I Started a Book Club When I Was New to the City",
    author: "Rachel M.",
    read: "4 min read",
    color: "linear-gradient(160deg, #1a2a1a 0%, #2a5230 100%)",
  },
];

export default function MagazinePage() {
  return (
    <MarketingLayout>
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-24">

        {/* Masthead */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ color: "#FF1F7D" }}>EST. 2026</p>
          <h1 className="text-5xl md:text-8xl font-bold leading-none mb-4" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            BloomBay
          </h1>
          <p className="text-xl font-light tracking-[0.25em] uppercase mb-6" style={{ color: "#888" }}>
            The Magazine
          </p>
          <div className="w-16 h-px mx-auto" style={{ background: "#FF1F7D" }} />
        </div>

        {/* Coming soon banner */}
        <div className="rounded-3xl p-10 text-center mb-16" style={{ background: "#FF1F7D" }}>
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3 text-white/70">LAUNCHING FALL 2026</p>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Stories worth gathering for.
          </h2>
          <p className="text-white/80 text-base leading-relaxed max-w-lg mx-auto mb-8">
            BloomBay Mag is a place for real stories — written by women in the community, about the things that happen when women show up for each other.
          </p>
          <div className="flex items-center gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-5 py-3 rounded-full text-sm bg-white/20 text-white placeholder-white/60 border border-white/30 outline-none focus:bg-white/30"
            />
            <button className="px-5 py-3 rounded-full font-bold text-sm bg-white" style={{ color: "#FF1F7D" }}>
              Notify me
            </button>
          </div>
        </div>

        {/* Preview stories */}
        <p className="text-xs font-bold tracking-[0.25em] uppercase mb-8" style={{ color: "#FF1F7D" }}>PREVIEW STORIES</p>
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {PREVIEWS.map((story) => (
            <div key={story.title} className="rounded-3xl overflow-hidden bg-white" style={{ boxShadow: "0 1px 10px rgba(0,0,0,0.06)" }}>
              <div className="h-40" style={{ background: story.color }} />
              <div className="p-6">
                <span className="text-xs font-bold tracking-wider" style={{ color: "#FF1F7D" }}>{story.tag}</span>
                <h3 className="font-bold text-sm leading-snug mt-2 mb-4" style={{ color: "#111111" }}>{story.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">By {story.author}</span>
                  <span className="text-xs text-gray-400">{story.read}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Write for us */}
        <div className="rounded-3xl p-8 text-center" style={{ background: "#FFF5F8" }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Have a story to tell?
          </h2>
          <p className="text-sm text-gray-500 mb-5">We want to hear from women in the community. Pitch us something real.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white"
            style={{ background: "#FF1F7D" }}
          >
            Pitch a story
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
