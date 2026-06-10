"use client";

import { useState } from "react";
import Link from "next/link";

const PLACES = [
  { id: 1, name: "Sadelle's", neighborhood: "SoHo", blurb: "The smoked fish platter for brunch. Every single time.", womenLoved: 2847, price: "$$$", tags: ["Brunch", "Weekend"], emoji: "🥯", bgColor: "#FFF0F5", featured: true },
  { id: 2, name: "Bangkok Supper Club", neighborhood: "Lower East Side", blurb: "The tom yum is religious. Go late, go often.", womenLoved: 1432, price: "$$", tags: ["Late Night", "Thai"], emoji: "🍜", bgColor: "#FFF5F8" },
  { id: 3, name: "La Mercerie", neighborhood: "SoHo", blurb: "Quiet, elegant, the best croissant. Perfect solo lunch.", womenLoved: 1201, price: "$$$", tags: ["French", "Quiet"], emoji: "🥐", bgColor: "#FDFAF5" },
  { id: 4, name: "Loring Place", neighborhood: "West Village", blurb: "Small plates, big energy. The best girls dinner.", womenLoved: 987, price: "$$$", tags: ["Girls Night"], emoji: "🌿", bgColor: "#FFF0F5" },
  { id: 5, name: "Russ & Daughters Café", neighborhood: "Lower East Side", blurb: "The OG. Bagels, lox, and history on every wall.", womenLoved: 3102, price: "$$", tags: ["NYC Classic"], emoji: "🥯", bgColor: "#FFF5F8" },
  { id: 6, name: "Brooklyn Bridge Park", neighborhood: "DUMBO", blurb: "Golden hour from the pier. Bring a blanket.", womenLoved: 4821, price: "Free", tags: ["Golden Hour", "Views"], emoji: "🌉", bgColor: "#F0F8FF" },
  { id: 7, name: "The Met", neighborhood: "Upper East Side", blurb: "Pay-what-you-wish. No crowds before 10AM.", womenLoved: 6210, price: "Pay-what-you-wish", tags: ["Culture", "Solo"], emoji: "🏛", bgColor: "#FFF8F0" },
  { id: 8, name: "The High Line", neighborhood: "Chelsea", blurb: "Best morning walk. Go early, beat the crowds.", womenLoved: 3987, price: "Free", tags: ["Morning Walk", "Art"], emoji: "🌿", bgColor: "#F0FFF4" },
  { id: 9, name: "Smorgasburg", neighborhood: "Williamsburg", blurb: "Saturdays at the waterfront. 100 food vendors.", womenLoved: 5102, price: "$", tags: ["Food", "Outdoor"], emoji: "🌮", bgColor: "#FFFAF0" },
  { id: 10, name: "MoMA", neighborhood: "Midtown", blurb: "Worth every visit. The Matisse floor never gets old.", womenLoved: 4201, price: "$$$", tags: ["Art", "Culture"], emoji: "🎨", bgColor: "#FFF5F8" },
  { id: 11, name: "Archway Café", neighborhood: "DUMBO", blurb: "Under the Manhattan Bridge. Best kept secret in Brooklyn.", womenLoved: 893, price: "$", tags: ["Hidden Gem", "Coffee"], emoji: "☕", bgColor: "#F5F0FF" },
  { id: 12, name: "McNally Jackson Café", neighborhood: "Nolita", blurb: "Good coffee, no rush, nobody bothers you for hours.", womenLoved: 1644, price: "$", tags: ["Books", "Solo"], emoji: "📚", bgColor: "#FFF0F5" },
];

const FILTERS = ["All", "Eat", "Explore", "Solo"] as const;
type Filter = typeof FILTERS[number];

function PlaceCard({ p, saved, onSave }: { p: typeof PLACES[0]; saved: boolean; onSave: () => void }) {
  return (
    <Link href={`/member/city/places/${p.id}`} style={{ display: "block", textDecoration: "none" }}>
    <div className="rounded-3xl overflow-hidden" style={{ background: "white", boxShadow: "0 3px 16px rgba(0,0,0,0.07)" }}>
      <div className="relative flex items-center justify-center" style={{ height: 120, background: `linear-gradient(145deg, ${p.bgColor} 0%, #FFE0EE 100%)` }}>
        <span style={{ fontSize: 44, opacity: 0.6 }}>{p.emoji}</span>
        {p.featured && (
          <span className="absolute top-2 left-3 text-[8px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
            style={{ background: "#FF1F7D", color: "white" }}>
            WOMEN&apos;S PICK
          </span>
        )}
        <button onClick={onSave}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.9)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill={saved ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2.2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>
      <div className="px-3.5 py-3">
        <h3 className="font-black text-sm" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{p.name}</h3>
        <p className="text-[10px] mt-0.5" style={{ color: "#999" }}>{p.neighborhood} · {p.price}</p>
        <p className="text-[11px] mt-1.5 leading-snug" style={{ color: "#666", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>{p.blurb}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <span style={{ color: "#FF1F7D", fontSize: 10 }}>✿</span>
          <span className="text-[10px] font-bold" style={{ color: "#FF1F7D" }}>{(p.womenLoved / 1000).toFixed(1)}k women</span>
          {p.tags.slice(0, 1).map(t => (
            <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-1"
              style={{ background: "#FFF0F5", color: "#FF1F7D" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
    </Link>
  );
}

export default function PlacesPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const shown = filter === "All" ? PLACES : filter === "Eat"
    ? PLACES.filter(p => ["🥯","🍜","🥐","🌿","🌮"].includes(p.emoji))
    : filter === "Solo"
    ? PLACES.filter(p => p.tags.includes("Solo") || p.tags.includes("Coffee") || p.tags.includes("Books"))
    : PLACES;

  return (
    <div className="min-h-screen pb-28" style={{ background: "#FDFAF5" }}>
      <div className="px-5 pt-20 pb-4 md:pt-8">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/member/city"
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,0,0,0.06)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
          <div>
            <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "#FF1F7D" }}>THE CITY</p>
            <h1 className="font-black leading-tight" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,6vw,36px)", color: "#111" }}>
              All Places.
            </h1>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wider whitespace-nowrap"
              style={filter === f ? { background: "#111", color: "white" } : { background: "white", color: "#888", border: "1.5px solid #E8E8E8" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-6">
        <p className="text-xs mb-4" style={{ color: "#aaa" }}>{shown.length} spots curated by women</p>
        <div className="grid grid-cols-2 gap-3">
          {shown.map(p => (
            <PlaceCard key={p.id} p={p} saved={saved.has(p.id)} onSave={() => setSaved(s => { const n = new Set(s); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })} />
          ))}
        </div>
      </div>
    </div>
  );
}
