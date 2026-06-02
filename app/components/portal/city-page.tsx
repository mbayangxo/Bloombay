"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type CityTab = "eat" | "go" | "solo" | "trending" | "moments";
type GoFilter = "All" | "Museums" | "Parks" | "Events" | "Experiences";
type CelebType = "birthday" | "promotion" | "new_home" | "anniversary" | "graduation" | "new_job" | "breakup";
type CelebFilter = "All" | "Birthdays" | "Wins" | "Milestones";

interface Restaurant {
  id: number; name: string; neighborhood: string; blurb: string;
  womenLoved: number; price: "$" | "$$" | "$$$" | "$$$$";
  tags: string[]; soloFriendly: boolean;
  notableDish?: string; notableDishNote?: string;
  submittedBy: string; featured?: boolean; emoji: string; bgColor: string;
}

interface GoPlace {
  id: number; filter: Exclude<GoFilter, "All">; name: string; neighborhood: string;
  blurb: string; womenLoved: number; soloFriendly: boolean;
  emoji: string; bgColor: string; tags: string[]; submittedBy: string;
}

interface SoloSpot {
  id: number; name: string; neighborhood: string; type: string;
  why: string; womenLoved: number; submittedBy: string; emoji: string;
}

interface TrendItem {
  id: number; type: "place" | "dish" | "neighborhood" | "stat";
  title: string; sub: string; count?: number; change?: string;
  emoji: string; bgColor: string;
}

interface CityMoment {
  id: number; initial: string; avatarColor: string; location: string;
  neighborhood: string; caption: string; flowers: number;
  timeAgo: string; bgColor: string; emoji: string;
}

interface Celebration {
  id: number; celebType: CelebType; name: string; event: string;
  venue: string; time: string; month: string; day: string;
  seats: number; message: string; initial: string; avatarColor: string;
}

type PlaceType = "place" | "eat" | "gem";

interface Place {
  id: number; type: PlaceType; name: string; neighborhood: string;
  review: string; submittedBy: string; rating: number; stamps: number;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const RESTAURANTS: Restaurant[] = [
  { id: 1, name: "Sadelle's", neighborhood: "SoHo", blurb: "The smoked fish platter for brunch. Every single time.", womenLoved: 2847, price: "$$$", tags: ["Brunch", "Weekend"], soloFriendly: true, notableDish: "Smoked Salmon Platter", notableDishNote: "889 women saved this", submittedBy: "Aaliyah M.", featured: true, emoji: "🥯", bgColor: "#FFF0F5" },
  { id: 2, name: "Bangkok Supper Club", neighborhood: "Lower East Side", blurb: "The tom yum is religious. Go late, go often.", womenLoved: 1432, price: "$$", tags: ["Late Night", "Thai"], soloFriendly: false, notableDish: "Tom Yum", notableDishNote: "Most reordered dish", submittedBy: "Jade O.", emoji: "🍜", bgColor: "#FFF5F8" },
  { id: 3, name: "La Mercerie", neighborhood: "SoHo", blurb: "Quiet, elegant, the best croissant. Perfect solo lunch.", womenLoved: 1201, price: "$$$", tags: ["French", "Quiet"], soloFriendly: true, notableDish: "Butter Croissant", notableDishNote: "638 women saved", submittedBy: "Naomi B.", emoji: "🥐", bgColor: "#FDFAF5" },
  { id: 4, name: "Loring Place", neighborhood: "West Village", blurb: "Small plates, big energy. The best girls dinner.", womenLoved: 987, price: "$$$", tags: ["Girls Night", "Small Plates"], soloFriendly: false, submittedBy: "Sofia K.", emoji: "🌿", bgColor: "#FFF0F5" },
  { id: 5, name: "Russ & Daughters Café", neighborhood: "Lower East Side", blurb: "The OG. Bagels, lox, and history on every wall.", womenLoved: 3102, price: "$$", tags: ["NYC Classic", "Brunch"], soloFriendly: true, notableDish: "Bagel with Lox", notableDishNote: "NYC staple", submittedBy: "Deja W.", emoji: "🥯", bgColor: "#FFF5F8" },
];

const GO_PLACES: GoPlace[] = [
  { id: 1, filter: "Parks", name: "Brooklyn Bridge Park", neighborhood: "DUMBO", blurb: "Golden hour from the pier. Bring a blanket.", womenLoved: 4821, soloFriendly: true, emoji: "🌉", bgColor: "#F0F8FF", tags: ["Golden Hour", "Views"], submittedBy: "Priya R." },
  { id: 2, filter: "Museums", name: "The Met", neighborhood: "Upper East Side", blurb: "Pay-what-you-wish. No crowds before 10AM.", womenLoved: 6210, soloFriendly: true, emoji: "🏛", bgColor: "#FFF8F0", tags: ["Culture", "Solo Ritual"], submittedBy: "Sofia K." },
  { id: 3, filter: "Experiences", name: "Archway Café", neighborhood: "DUMBO", blurb: "Under the Manhattan Bridge. Best kept secret in Brooklyn.", womenLoved: 893, soloFriendly: true, emoji: "☕", bgColor: "#F5F0FF", tags: ["Hidden Gem", "Coffee"], submittedBy: "Zara F." },
  { id: 4, filter: "Parks", name: "The High Line", neighborhood: "Chelsea", blurb: "Best morning walk. Go early, beat the crowds.", womenLoved: 3987, soloFriendly: true, emoji: "🌿", bgColor: "#F0FFF4", tags: ["Morning Walk", "Art"], submittedBy: "Sofia K." },
  { id: 5, filter: "Events", name: "Smorgasburg", neighborhood: "Williamsburg", blurb: "Saturdays at the waterfront. 100 food vendors, all summer.", womenLoved: 5102, soloFriendly: true, emoji: "🌮", bgColor: "#FFFAF0", tags: ["Food", "Outdoor"], submittedBy: "Aaliyah M." },
  { id: 6, filter: "Museums", name: "MoMA", neighborhood: "Midtown", blurb: "Worth every visit. The Matisse floor never gets old.", womenLoved: 4201, soloFriendly: true, emoji: "🎨", bgColor: "#FFF5F8", tags: ["Art", "Culture"], submittedBy: "Jade O." },
  { id: 7, filter: "Experiences", name: "McNally Jackson", neighborhood: "Nolita", blurb: "Good coffee, no rush, nobody bothers you for hours.", womenLoved: 1644, soloFriendly: true, emoji: "📚", bgColor: "#FFF0F5", tags: ["Books", "Solo"], submittedBy: "Rachel M." },
];

const SOLO_SPOTS: SoloSpot[] = [
  { id: 1, name: "La Mercerie", neighborhood: "SoHo", type: "Café · Restaurant", why: "Bar seating, natural light, staff never rushes you. Perfect for a solo lunch with a book.", womenLoved: 1201, submittedBy: "Naomi B.", emoji: "🥐" },
  { id: 2, name: "McNally Jackson Café", neighborhood: "Nolita", type: "Bookshop Café", why: "Back of the bookstore. Loud enough to feel alive, quiet enough to think.", womenLoved: 891, submittedBy: "Rachel M.", emoji: "📚" },
  { id: 3, name: "Archway Café", neighborhood: "DUMBO", type: "Hidden Café", why: "Under the Manhattan Bridge. Stunning views, no laptop crowd. You just sit with it.", womenLoved: 643, submittedBy: "Zara F.", emoji: "🌉" },
  { id: 4, name: "Prospect Park — Breeze Hill", neighborhood: "Park Slope", type: "Park", why: "Less tourists, more locals with blankets and books. Completely safe, completely yours.", womenLoved: 2340, submittedBy: "Priya R.", emoji: "🌳" },
  { id: 5, name: "The Met — Egyptian Wing", neighborhood: "Upper East Side", type: "Museum", why: "The Temple of Dendur room at 9:30AM is one of the most peaceful places in NYC.", womenLoved: 3102, submittedBy: "Sofia K.", emoji: "🏛" },
];

const TRENDING: TrendItem[] = [
  { id: 1, type: "stat", title: "Most Saved This Week", sub: "Bagels with Lox at Russ & Daughters", count: 889, emoji: "🥯", bgColor: "#FFF0F5" },
  { id: 2, type: "neighborhood", title: "Neighborhood of the Moment", sub: "DUMBO — Golden hour and bridge views. Best on weekday evenings.", emoji: "🌉", bgColor: "#F0F8FF" },
  { id: 3, type: "dish", title: "Most Loved Dish", sub: "Tom Yum at Bangkok Supper Club", count: 1432, change: "+23% this week", emoji: "🍜", bgColor: "#FFF5F8" },
  { id: 4, type: "place", title: "New on Everyone's List", sub: "Archway Café, DUMBO — 643 women discovered this month.", count: 643, emoji: "☕", bgColor: "#F5F0FF" },
  { id: 5, type: "stat", title: "Solo Trips This Week", sub: "1,247 women tagged themselves going solo.", count: 1247, emoji: "✦", bgColor: "#FDFAF5" },
];

const MOMENTS: CityMoment[] = [
  { id: 1, initial: "A", avatarColor: "#FF1F7D", location: "Sadelle's", neighborhood: "SoHo", caption: "Sunday brunch season never ends.", flowers: 47, timeAgo: "2h", bgColor: "#FFE8F0", emoji: "🥯" },
  { id: 2, initial: "S", avatarColor: "#FF69B4", location: "Brooklyn Bridge Park", neighborhood: "DUMBO", caption: "Golden hour ✦", flowers: 83, timeAgo: "4h", bgColor: "#E8F4FF", emoji: "🌉" },
  { id: 3, initial: "P", avatarColor: "#FF1F7D", location: "The Met", neighborhood: "Upper East Side", caption: "Matisse forever.", flowers: 61, timeAgo: "6h", bgColor: "#FFF8E8", emoji: "🎨" },
  { id: 4, initial: "Z", avatarColor: "#FF69B4", location: "High Line", neighborhood: "Chelsea", caption: "8AM and the city is still asleep.", flowers: 34, timeAgo: "8h", bgColor: "#E8FFE8", emoji: "🌿" },
  { id: 5, initial: "N", avatarColor: "#FF1F7D", location: "La Mercerie", neighborhood: "SoHo", caption: "This croissant is my whole personality.", flowers: 112, timeAgo: "10h", bgColor: "#FFF0F5", emoji: "🥐" },
  { id: 6, initial: "J", avatarColor: "#FF69B4", location: "Archway Café", neighborhood: "DUMBO", caption: "Found my new place.", flowers: 28, timeAgo: "12h", bgColor: "#F5E8FF", emoji: "🌉" },
];

const GIRL_PICKS: Place[] = [
  { id: 1, type: "place", name: "The High Line", neighborhood: "Chelsea", review: "Best morning walk in the city. Go early before the crowds.", submittedBy: "Sofia K.", rating: 4.8, stamps: 127 },
  { id: 2, type: "place", name: "Brooklyn Bridge Park", neighborhood: "DUMBO", review: "Golden hour from the pier. Bring a blanket and stay for hours.", submittedBy: "Priya R.", rating: 4.9, stamps: 203 },
  { id: 3, type: "eat", name: "Sadelle's", neighborhood: "SoHo", review: "The smoked fish platter for brunch. Every time.", submittedBy: "Aaliyah M.", rating: 4.9, stamps: 89 },
  { id: 4, type: "eat", name: "Bangkok Supper Club", neighborhood: "Lower East Side", review: "The tom yum is religious. Go late, go often.", submittedBy: "Jade O.", rating: 4.8, stamps: 64 },
  { id: 5, type: "eat", name: "La Mercerie", neighborhood: "SoHo", review: "Quiet, elegant, the best croissant. Perfect solo lunch.", submittedBy: "Naomi B.", rating: 4.7, stamps: 44 },
  { id: 6, type: "gem", name: "McNally Jackson Café", neighborhood: "Nolita", review: "Tiny tables, good coffee, and nobody bothers you for hours.", submittedBy: "Rachel M.", rating: 4.8, stamps: 71 },
  { id: 7, type: "gem", name: "Russ & Daughters Café", neighborhood: "Lower East Side", review: "The OG. Bagels, lox, and history on every wall.", submittedBy: "Deja W.", rating: 4.7, stamps: 55 },
  { id: 8, type: "gem", name: "Archway Café under Manhattan Bridge", neighborhood: "DUMBO", review: "Nobody knows about this. Best kept secret in Brooklyn.", submittedBy: "Zara F.", rating: 5.0, stamps: 38 },
];

const CONFETTI: Celebration[] = [
  { id: 1, celebType: "birthday", name: "Aaliyah", event: "Birthday", venue: "Dinner at Carbone, SoHo", time: "Saturday · 8:00PM", month: "may", day: "26", seats: 12, initial: "A", avatarColor: "#FF1F7D", message: "One more trip around the sun and she's doing it right." },
  { id: 2, celebType: "promotion", name: "Teni", event: "Promotion", venue: "Celebrating the new chapter", time: "Friday · 7:00PM", month: "may", day: "30", seats: 8, initial: "T", avatarColor: "#FF69B4", message: "She got the job she was scared to apply for." },
  { id: 3, celebType: "new_home", name: "Maya", event: "New Apartment", venue: "Housewarming & girl time", time: "Sunday · 3:00PM", month: "jun", day: "02", seats: 6, initial: "M", avatarColor: "#FF1F7D", message: "Moved to NYC alone. Now she has a city." },
];

// ── Constants ────────────────────────────────────────────────────────────────

const CELEB_FILTER_MAP: Record<CelebFilter, CelebType[]> = {
  All:        ["birthday", "promotion", "new_home", "anniversary", "graduation", "new_job", "breakup"],
  Birthdays:  ["birthday", "anniversary"],
  Wins:       ["promotion", "new_job"],
  Milestones: ["new_home", "graduation", "breakup"],
};

const CELEB_WISH_DEFAULT: Record<CelebType, string> = {
  birthday:    "Happy Birthday! So glad you're my girl 🎂",
  promotion:   "Congratulations! So incredibly proud of you 🥂",
  new_home:    "Welcome home! Can't wait to celebrate with you 🏠",
  anniversary: "Happy Anniversary! Love to see it 🌸",
  graduation:  "Congratulations, graduate! You earned every bit 🎓",
  new_job:     "You got this! So excited to see what you do next 💪",
  breakup:     "Freedom looks so good on you. Cheers 👑",
};

const PLACE_TYPE_LABEL: Record<PlaceType, string> = {
  place: "GIRL PLACE",
  eat: "GIRL EAT",
  gem: "GIRL GEM",
};

const PLACE_TYPE_COLOR: Record<PlaceType, { bg: string; color: string }> = {
  place: { bg: "#FFF0F5", color: "#FF1F7D" },
  eat:   { bg: "#FFE0EE", color: "#FF69B4" },
  gem:   { bg: "#FFF0F5", color: "#FF1F7D" },
};

const TAB_LABELS: { key: CityTab; label: string }[] = [
  { key: "eat",      label: "Eat" },
  { key: "go",       label: "Go" },
  { key: "solo",     label: "Solo" },
  { key: "trending", label: "Trending" },
  { key: "moments",  label: "Moments" },
];

// ── Shared helpers ────────────────────────────────────────────────────────────

function FlowerCount({ count, light = false }: { count: number; light?: boolean }) {
  const display = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
  return (
    <span className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: light ? "rgba(255,255,255,0.8)" : "#FF1F7D" }}>
      ✿ {display}
    </span>
  );
}

// ── EAT components ────────────────────────────────────────────────────────────

function EatFeaturedCard({ r }: { r: Restaurant }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="rounded-3xl overflow-hidden mb-5" style={{ background: r.bgColor, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
      <div className="relative flex items-center justify-center" style={{ height: "148px", background: `linear-gradient(135deg, ${r.bgColor} 0%, #FFE0EE 100%)` }}>
        <span style={{ fontSize: "72px", opacity: 0.65 }}>{r.emoji}</span>
        <span className="absolute top-3 left-4 text-[9px] font-bold tracking-[0.22em] uppercase px-3 py-1 rounded-full" style={{ background: "#FF1F7D", color: "white" }}>
          WOMEN&apos;S PICK
        </span>
        <button onClick={() => setSaved(s => !s)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.92)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={saved ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2.2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-black text-xl leading-none" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{r.name}</h3>
            <p className="text-[10px] mt-0.5" style={{ color: "#999" }}>{r.neighborhood} · {r.price}</p>
          </div>
          <FlowerCount count={r.womenLoved} />
        </div>
        <p className="text-sm italic mt-2 leading-relaxed" style={{ fontFamily: "var(--font-playfair)", color: "#555" }}>&ldquo;{r.blurb}&rdquo;</p>
        {r.notableDish && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,31,125,0.06)" }}>
            <span style={{ fontSize: "13px" }}>⭐</span>
            <div>
              <p className="text-xs font-bold" style={{ color: "#111" }}>{r.notableDish}</p>
              <p className="text-[10px]" style={{ color: "#FF1F7D" }}>{r.notableDishNote}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {r.soloFriendly && <span className="text-[8px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#111", color: "white" }}>SOLO FRIENDLY</span>}
          {r.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[9px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "white", color: "#888", border: "1px solid #EEE" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function EatRowCard({ r }: { r: Restaurant }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 10px rgba(0,0,0,0.05)" }}>
      <div className="flex items-stretch">
        <div className="w-14 flex-shrink-0 flex items-center justify-center text-3xl" style={{ background: r.bgColor }}>{r.emoji}</div>
        <div className="p-3 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-black text-sm" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{r.name}</h3>
              <p className="text-[10px]" style={{ color: "#999" }}>{r.neighborhood} · {r.price}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <FlowerCount count={r.womenLoved} />
              <button onClick={() => setSaved(s => !s)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#FFF5F8" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill={saved ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2.2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>
          </div>
          <p className="text-[11px] mt-1 italic" style={{ fontFamily: "var(--font-playfair)", color: "#777" }}>&ldquo;{r.blurb}&rdquo;</p>
          {r.soloFriendly && <span className="mt-1 inline-block text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#111", color: "white" }}>SOLO FRIENDLY</span>}
        </div>
      </div>
    </div>
  );
}

// ── GO components ─────────────────────────────────────────────────────────────

function GoCard({ p }: { p: GoPlace }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: p.bgColor, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div className="flex items-center justify-center" style={{ height: "88px", background: `linear-gradient(135deg, ${p.bgColor} 0%, ${p.bgColor}99 100%)` }}>
        <span style={{ fontSize: "44px", opacity: 0.75 }}>{p.emoji}</span>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-black text-sm leading-tight" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{p.name}</h3>
            <p className="text-[10px]" style={{ color: "#999" }}>{p.neighborhood}</p>
          </div>
          <button onClick={() => setSaved(s => !s)} className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "white" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill={saved ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2.2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        </div>
        <p className="text-[11px] mt-1 italic" style={{ fontFamily: "var(--font-playfair)", color: "#666" }}>&ldquo;{p.blurb}&rdquo;</p>
        <div className="flex items-center justify-between mt-2">
          <FlowerCount count={p.womenLoved} />
          {p.soloFriendly && <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#111", color: "white" }}>SOLO</span>}
        </div>
      </div>
    </div>
  );
}

// ── SOLO components ───────────────────────────────────────────────────────────

function SoloCard({ s }: { s: SoloSpot }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="bg-white rounded-2xl overflow-hidden flex" style={{ boxShadow: "0 1px 10px rgba(0,0,0,0.05)" }}>
      <div className="w-1.5 flex-shrink-0" style={{ background: "#111" }} />
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{s.emoji}</span>
            <div>
              <h3 className="font-black text-sm leading-tight" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{s.name}</h3>
              <p className="text-[10px] mt-0.5" style={{ color: "#aaa" }}>{s.neighborhood} · {s.type}</p>
            </div>
          </div>
          <button onClick={() => setSaved(sv => !sv)} className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FFF5F8" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill={saved ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2.2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#555" }}>{s.why}</p>
        <div className="flex items-center justify-between mt-3">
          <FlowerCount count={s.womenLoved} />
          <p className="text-[10px]" style={{ color: "#ccc" }}>— {s.submittedBy}</p>
        </div>
      </div>
    </div>
  );
}

// ── TRENDING components ───────────────────────────────────────────────────────

function TrendCard({ t }: { t: TrendItem }) {
  return (
    <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: t.bgColor, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: "white" }}>{t.emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold tracking-[0.18em] uppercase mb-0.5" style={{ color: "#FF1F7D" }}>{t.title}</p>
        <p className="text-sm font-bold leading-snug" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{t.sub}</p>
        {t.count && <p className="text-[10px] mt-1 font-semibold" style={{ color: "#FF1F7D" }}>✿ {t.count.toLocaleString()} women{t.change ? ` · ${t.change}` : ""}</p>}
      </div>
    </div>
  );
}

// ── MOMENTS components ────────────────────────────────────────────────────────

function MomentCard({ m, onFlower }: { m: CityMoment & { flowered?: boolean }; onFlower: () => void }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
      <div className="relative flex items-center justify-center" style={{ height: "120px", background: m.bgColor }}>
        <span style={{ fontSize: "52px", opacity: 0.65 }}>{m.emoji}</span>
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: m.avatarColor }}>{m.initial}</div>
          <p className="text-[9px] font-semibold" style={{ color: "#555" }}>{m.neighborhood}</p>
        </div>
        <p className="absolute top-2 right-2 text-[9px]" style={{ color: "#aaa" }}>{m.timeAgo}</p>
      </div>
      <div className="bg-white px-3 py-2.5">
        <p className="text-xs italic" style={{ fontFamily: "var(--font-playfair)", color: "#333" }}>{m.caption}</p>
        <p className="text-[10px] mt-0.5" style={{ color: "#bbb" }}>{m.location}</p>
        <button onClick={onFlower} className="flex items-center gap-1 mt-1.5 text-[10px] font-semibold" style={{ color: "#FF1F7D" }}>
          ✿ {m.flowers}
        </button>
      </div>
    </div>
  );
}

// ── CONFETTI cards ────────────────────────────────────────────────────────────

function ConfettiCard({ c, onOpen }: { c: Celebration; onOpen: () => void }) {

  if (c.celebType === "birthday") {
    return (
      <div onClick={onOpen} className="relative flex-shrink-0 cursor-pointer transition-transform active:scale-[0.96]"
        style={{ width: "164px", borderRadius: "20px", background: "#FF1F7D", padding: "12px 12px 14px", boxShadow: "0 10px 32px rgba(255,31,125,0.38)" }}>
        <div className="absolute" style={{ top: "-5px", left: "8px" }}>
          <svg width="38" height="24" viewBox="0 0 38 24">
            <ellipse cx="9" cy="12" rx="8" ry="5.5" fill="#111" opacity="0.85" transform="rotate(-20 9 12)" />
            <ellipse cx="29" cy="12" rx="8" ry="5.5" fill="#111" opacity="0.85" transform="rotate(20 29 12)" />
            <circle cx="19" cy="12" r="4" fill="#111" />
          </svg>
        </div>
        <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-base mx-auto mt-3 mb-2.5" style={{ background: "rgba(255,255,255,0.2)", border: "2.5px solid white", color: "white" }}>{c.initial}</div>
        <div className="rounded-2xl p-3" style={{ background: "#FDFAF5" }}>
          <div className="flex items-baseline gap-1 mb-1">
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "12px", color: "#FF1F7D", fontStyle: "italic" }}>{c.month}</p>
            <p className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "24px", color: "#111" }}>{c.day}</p>
          </div>
          <p className="font-black leading-tight" style={{ fontFamily: "var(--font-playfair)", fontSize: "14px", color: "#111", lineHeight: 1.1 }}>{c.name}&apos;s<br />{c.event}</p>
          <p className="mt-1.5 text-[10px]" style={{ color: "#999" }}>{c.venue.split(",")[0]}</p>
        </div>
        <div className="flex items-center justify-between mt-2 px-0.5">
          <div className="w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px]" style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>{c.seats}</div>
          <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "16px" }}>♡</span>
        </div>
      </div>
    );
  }

  if (c.celebType === "promotion" || c.celebType === "new_job") {
    return (
      <div onClick={onOpen} className="relative flex-shrink-0 cursor-pointer overflow-hidden transition-transform active:scale-[0.96]"
        style={{ width: "164px", borderRadius: "20px", background: "#FDFAF5", padding: "22px 12px 14px", boxShadow: "0 8px 28px rgba(0,0,0,0.10)" }}>
        <div className="absolute top-0 left-1/2" style={{ transform: "translateX(-50%) translateY(-8px)" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "3.5px solid #FF69B4", background: "white" }} />
        </div>
        <div className="absolute pointer-events-none" style={{ top: "26px", left: "-24px", right: "-24px", height: "48px", background: "rgba(255,105,180,0.13)", transform: "rotate(-5deg)", borderRadius: "8px" }} />
        <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-base mx-auto mb-3" style={{ background: `linear-gradient(135deg, ${c.avatarColor} 0%, ${c.avatarColor}88 100%)`, border: "2.5px solid white", color: "white", boxShadow: "0 4px 12px rgba(255,31,125,0.2)" }}>{c.initial}</div>
        <div className="flex items-baseline gap-1 mb-1">
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: "12px", color: "#FF69B4", fontStyle: "italic" }}>{c.month}</p>
          <p className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "24px", color: "#111" }}>{c.day}</p>
        </div>
        <p className="font-black leading-tight" style={{ fontFamily: "var(--font-playfair)", fontSize: "14px", color: "#111", lineHeight: 1.1 }}>{c.name}&apos;s<br />{c.event}</p>
        <p className="mt-1.5 text-[10px]" style={{ color: "#999" }}>{c.venue}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px]" style={{ background: "#FFE0EE", color: "#FF1F7D" }}>{c.seats}</div>
          <span style={{ color: "#FF69B4", fontSize: "16px" }}>♡</span>
        </div>
      </div>
    );
  }

  if (c.celebType === "new_home") {
    return (
      <div onClick={onOpen} className="relative flex-shrink-0 cursor-pointer overflow-hidden transition-transform active:scale-[0.96]"
        style={{ width: "164px", borderRadius: "20px", boxShadow: "0 8px 28px rgba(0,0,0,0.13)" }}>
        <div className="absolute inset-0" style={{ backgroundImage: "repeating-conic-gradient(#111 0% 25%, #F5F5F5 0% 50%)", backgroundSize: "18px 18px" }} />
        <div className="absolute top-0 left-1/2 z-20" style={{ transform: "translateX(-50%) translateY(-8px)" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "3.5px solid #FF1F7D", background: "white" }} />
        </div>
        <div className="relative z-10 p-3 pt-5">
          <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-base mx-auto mb-3" style={{ background: `linear-gradient(135deg, ${c.avatarColor} 0%, ${c.avatarColor}88 100%)`, border: "3px solid white", color: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.18)" }}>{c.initial}</div>
          <div className="rounded-2xl p-3" style={{ background: "rgba(253,250,245,0.97)" }}>
            <div className="flex items-baseline gap-1 mb-1">
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "12px", color: "#FF1F7D", fontStyle: "italic" }}>{c.month}</p>
              <p className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "24px", color: "#111" }}>{c.day}</p>
            </div>
            <p className="font-black leading-tight" style={{ fontFamily: "var(--font-playfair)", fontSize: "13px", color: "#111", lineHeight: 1.1 }}>{c.name}&apos;s<br />{c.event}</p>
            <p className="mt-1 text-[10px]" style={{ color: "#777" }}>{c.venue.split("&")[0].trim()}</p>
          </div>
          <div className="flex items-center justify-between mt-2 px-0.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] text-white" style={{ background: "#FF1F7D" }}>{c.seats}</div>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>♡</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onOpen} className="relative flex-shrink-0 cursor-pointer transition-transform active:scale-[0.96]"
      style={{ width: "164px", borderRadius: "20px", background: "#FFF0F5", padding: "16px 12px 14px", boxShadow: "0 6px 24px rgba(255,31,125,0.12)" }}>
      <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-base mx-auto mb-3" style={{ background: c.avatarColor, border: "2.5px solid white", color: "white" }}>{c.initial}</div>
      <div className="flex items-baseline gap-1 mb-1">
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "12px", color: "#FF1F7D", fontStyle: "italic" }}>{c.month}</p>
        <p className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "24px", color: "#111" }}>{c.day}</p>
      </div>
      <p className="font-black leading-tight" style={{ fontFamily: "var(--font-playfair)", fontSize: "14px", color: "#111" }}>{c.name}&apos;s {c.event}</p>
      <p className="mt-1.5 text-[10px]" style={{ color: "#999" }}>{c.venue}</p>
      <div className="flex items-center justify-between mt-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px]" style={{ background: "#FFE0EE", color: "#FF1F7D" }}>{c.seats}</div>
        <span style={{ color: "#FF69B4", fontSize: "16px" }}>♡</span>
      </div>
    </div>
  );
}

function PlanSomethingCard() {
  return (
    <div className="flex-shrink-0 flex flex-col items-center justify-center gap-3 cursor-pointer transition-transform active:scale-[0.96]"
      style={{ width: "164px", minHeight: "210px", borderRadius: "20px", border: "2px dashed #FF69B4", background: "rgba(255,105,180,0.04)" }}>
      <span style={{ fontSize: "18px", color: "#FF69B4" }}>✿</span>
      <p className="text-center font-black leading-tight px-4" style={{ fontFamily: "var(--font-playfair)", fontSize: "16px", color: "#111" }}>Plan<br />something<br />special</p>
      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#FF1F7D", boxShadow: "0 4px 12px rgba(255,31,125,0.3)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </div>
    </div>
  );
}

// ── Confetti Sheet ────────────────────────────────────────────────────────────

function ConfettiSheet({ c, accepted, onAccept, onClose }: {
  c: Celebration; accepted: boolean; onAccept: () => void; onClose: () => void;
}) {
  const [wishText, setWishText] = useState("");
  const [wishSent, setWishSent] = useState(false);

  const eventCode = `BB-${String(c.id).padStart(4, "0")}-CONF-${c.month.toUpperCase()}${c.day}`;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-y-auto" style={{ background: "white", boxShadow: "0 -4px 40px rgba(0,0,0,0.18)", maxHeight: "90vh" }}>
        <div className="p-5 pb-12">
          <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />

          {!accepted ? (
            <>
              <div className="text-center mb-6">
                <p className="text-[9px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color: "#FF1F7D" }}>CONFETTI ✿</p>
                <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-white text-2xl mx-auto mb-3" style={{ background: `linear-gradient(135deg, ${c.avatarColor} 0%, ${c.avatarColor}99 100%)`, boxShadow: "0 6px 20px rgba(255,31,125,0.28)" }}>{c.initial}</div>
                <h2 className="font-black leading-none mb-2" style={{ fontFamily: "var(--font-playfair)", fontSize: "26px", color: "#111" }}>{c.name}&apos;s {c.event}</h2>
                <p className="text-sm italic" style={{ fontFamily: "var(--font-instrument)", color: "#888" }}>{c.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl p-3" style={{ background: "#FFF5F8" }}>
                  <p className="text-[9px] font-bold tracking-wider uppercase mb-0.5" style={{ color: "#bbb" }}>WHEN</p>
                  <p className="text-sm font-bold" style={{ color: "#111" }}>{c.time}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: "#FFF5F8" }}>
                  <p className="text-[9px] font-bold tracking-wider uppercase mb-0.5" style={{ color: "#bbb" }}>WHERE</p>
                  <p className="text-sm font-bold leading-tight" style={{ color: "#111" }}>{c.venue.split("&")[0].split(",")[0].trim()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {Array.from({ length: Math.min(4, c.seats) }).map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ background: i % 2 === 0 ? "#FF1F7D" : "#FF69B4", marginLeft: i > 0 ? "-4px" : "0" }}>✿</div>
                  ))}
                </div>
                <p className="text-xs" style={{ color: "#bbb" }}>{c.seats} women celebrating with her</p>
              </div>

              <button onClick={onAccept} className="w-full py-4 rounded-2xl font-bold text-base text-white mb-3 transition-all active:scale-[0.97]" style={{ background: "#FF1F7D", boxShadow: "0 6px 20px rgba(255,31,125,0.35)" }}>
                I&apos;ll be there ✿
              </button>

              {!wishSent ? (
                <div>
                  <p className="text-center text-xs mb-3" style={{ color: "#ccc" }}>— or send her a message without going —</p>
                  <textarea value={wishText} onChange={(e) => setWishText(e.target.value)}
                    placeholder={CELEB_WISH_DEFAULT[c.celebType]} rows={3}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none mb-2"
                    style={{ borderColor: "#FFE0EE", color: "#111" }} />
                  <button onClick={() => { if (wishText.trim()) setWishSent(true); }}
                    disabled={!wishText.trim()}
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.97]"
                    style={wishText.trim() ? { background: "#FFF0F5", color: "#FF1F7D" } : { background: "#F5F5F5", color: "#ccc" }}>
                    💌 Send wishes
                  </button>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm font-bold" style={{ color: "#FF1F7D" }}>Wishes sent! 💌</p>
                  <p className="text-xs mt-0.5 italic" style={{ color: "#bbb" }}>She&apos;ll feel the love.</p>
                </div>
              )}
            </>
          ) : (
            /* ── ACCEPTED: show ticket + Plan Room ── */
            <>
              <p className="text-[9px] font-bold tracking-[0.28em] uppercase text-center mb-4" style={{ color: "#FF1F7D" }}>YOU&apos;RE GOING ✿</p>

              {/* Ticket stub */}
              <div className="rounded-2xl overflow-hidden mb-5" style={{ background: "#FDFAF5", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
                <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1.5px dashed rgba(0,0,0,0.08)" }}>
                  <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
                  <p className="text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: "#bbb" }}>ADMIT ONE</p>
                </div>
                <div className="px-5 pt-4 pb-3">
                  <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#bbb" }}>CONFETTI INVITATION</p>
                  <h2 className="font-black leading-none mb-1" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(20px,6vw,28px)", color: "#111", lineHeight: 0.9, letterSpacing: "-0.015em" }}>
                    {c.name}&apos;s<br />{c.event}
                  </h2>
                  <p className="text-xs mt-2" style={{ color: "#777" }}>{c.time} · {c.venue.split(",")[0]}</p>
                </div>
                <div style={{ borderTop: "1.5px dashed rgba(0,0,0,0.08)", margin: "0 20px 12px" }} />
                <div className="px-5 pb-4">
                  {/* Mini barcode */}
                  <div className="flex items-end gap-[1.5px] mb-1" style={{ height: "22px" }}>
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} style={{ width: i % 5 === 0 ? "3px" : "1.5px", height: `${52 + Math.sin(i * 1.8) * 28}%`, background: "#111", opacity: 0.5 + (i % 4) * 0.1, flexShrink: 0 }} />
                    ))}
                  </div>
                  <p className="text-[8px] font-mono tracking-widest" style={{ color: "#bbb" }}>{eventCode}</p>
                </div>
              </div>

              <p className="text-xs text-center mb-4 italic" style={{ fontFamily: "var(--font-instrument)", color: "#999" }}>
                Your ticket is saved. Show the QR at the door.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button className="py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.97]" style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.3)" }}>
                  💌 Invite a Bloomie
                </button>
                <button onClick={onClose} className="py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.97]" style={{ background: "#111", color: "white" }}>
                  Enter Plan Room →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Girl Picks card ───────────────────────────────────────────────────────────

function PlaceCard({ place, stamped, onStamp }: { place: Place; stamped: boolean; onStamp: () => void }) {
  const tc = PLACE_TYPE_COLOR[place.type];
  return (
    <div className="bg-white rounded-2xl overflow-hidden flex" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
      <div className="w-1 flex-shrink-0" style={{ background: "#FF1F7D" }} />
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider" style={{ background: tc.bg, color: tc.color }}>
                {PLACE_TYPE_LABEL[place.type]}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#F5F5F5", color: "#888" }}>{place.neighborhood}</span>
            </div>
            <p className="font-bold text-sm" style={{ color: "#111" }}>{place.name}</p>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {[1,2,3,4,5].map(star => (
              <svg key={star} width="9" height="9" viewBox="0 0 24 24" fill={star <= Math.round(place.rating) ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
            <span className="text-xs font-bold ml-0.5" style={{ color: "#111" }}>{place.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-xs italic leading-relaxed mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#666" }}>&ldquo;{place.review}&rdquo;</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "#aaa" }}>— {place.submittedBy}</span>
            <span className="text-xs font-semibold" style={{ color: "#FF1F7D" }}>✿ {place.stamps}</span>
          </div>
          <button onClick={onStamp} disabled={stamped}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
            style={stamped ? { background: "#FFF0F5", color: "#FF1F7D", cursor: "default" } : { background: "#FF1F7D", color: "white" }}>
            {stamped ? "Stamped ✓" : "Stamp it"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main CityPage ─────────────────────────────────────────────────────────────

export function CityPage() {
  const [activeTab, setActiveTab]         = useState<CityTab>("eat");
  const [goFilter, setGoFilter]           = useState<GoFilter>("All");
  const [celebFilter, setCelebFilter]     = useState<CelebFilter>("All");
  const [selectedCeleb, setSelectedCeleb] = useState<Celebration | null>(null);
  const [acceptedCelebs, setAcceptedCelebs] = useState<Set<number>>(new Set());
  const [floweredMoments, setFloweredMoments] = useState<Set<number>>(new Set());
  const [girlPicks, setGirlPicks]         = useState<Place[]>(GIRL_PICKS);
  const [stampedPlaces, setStampedPlaces] = useState<Set<number>>(new Set());

  function handleStamp(id: number) {
    if (stampedPlaces.has(id)) return;
    setStampedPlaces(p => new Set([...p, id]));
    setGirlPicks(p => p.map(pl => pl.id === id ? { ...pl, stamps: pl.stamps + 1 } : pl));
  }

  const filteredConfetti = CONFETTI.filter(c => CELEB_FILTER_MAP[celebFilter].includes(c.celebType));
  const filteredGo = goFilter === "All" ? GO_PLACES : GO_PLACES.filter(p => p.filter === goFilter);

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>

      {/* ── Header ── */}
      <div className="px-5 pt-12 pb-0 md:px-10 md:pt-8 md:max-w-[1280px] md:mx-auto">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ NYC · WILLIAMSBURG</p>
        <h1 className="font-black leading-none mb-1" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(34px,6vw,48px)", color: "#111", lineHeight: 0.92, letterSpacing: "-0.02em" }}>
          The City.
        </h1>
        <p className="text-sm italic mb-5" style={{ fontFamily: "var(--font-instrument)", color: "#999" }}>
          A city viewed through women.
        </p>

        {/* ── Tab bar ── */}
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-5 px-5 md:mx-0 md:px-0">
          {TAB_LABELS.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold transition-all"
              style={activeTab === key
                ? { background: "#111", color: "white" }
                : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="px-5 md:px-10 md:max-w-[1280px] md:mx-auto pt-6 flex flex-col gap-6">

        {/* ── EAT ── */}
        {activeTab === "eat" && (
          <div className="flex flex-col gap-6">
            <div className="md:grid md:grid-cols-[1fr_1fr] md:gap-6">
              <div>
                {RESTAURANTS.filter(r => r.featured).map(r => <EatFeaturedCard key={r.id} r={r} />)}
                <div className="flex flex-col gap-3">
                  {RESTAURANTS.filter(r => !r.featured).map(r => <EatRowCard key={r.id} r={r} />)}
                </div>
              </div>
              <div className="hidden md:block">
                <div className="rounded-2xl p-5 mb-4" style={{ background: "#111", boxShadow: "0 8px 28px rgba(0,0,0,0.18)" }}>
                  <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF69B4" }}>WOMEN ARE EATING</p>
                  <div className="flex flex-col gap-3">
                    {RESTAURANTS.filter(r => r.notableDish).map((r, i) => (
                      <div key={r.id} className="flex items-center gap-3 py-2" style={{ borderBottom: i < RESTAURANTS.filter(x => x.notableDish).length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                        <span className="text-xl">{r.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: "white" }}>{r.notableDish}</p>
                          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{r.name} · {r.neighborhood}</p>
                        </div>
                        <p className="text-[10px] font-bold flex-shrink-0" style={{ color: "#FF1F7D" }}>✿ {r.notableDishNote?.split(" ")[0]}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <TrendCard t={TRENDING[0]} />
              </div>
            </div>

            {/* Girl Picks */}
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-1" style={{ color: "#FF1F7D" }}>GIRL PICKS</p>
                  <h3 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: "#111" }}>Places the city loves</h3>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {girlPicks.map(place => (
                  <PlaceCard key={place.id} place={place} stamped={stampedPlaces.has(place.id)} onStamp={() => handleStamp(place.id)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── GO ── */}
        {activeTab === "go" && (
          <div className="flex flex-col gap-4">
            {/* Sub-filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 md:mx-0 md:px-0">
              {(["All", "Parks", "Museums", "Experiences", "Events"] as GoFilter[]).map(f => (
                <button key={f} onClick={() => setGoFilter(f)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
                  style={goFilter === f ? { background: "#FF1F7D", color: "white" } : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }}>
                  {f}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredGo.map(p => <GoCard key={p.id} p={p} />)}
            </div>
          </div>
        )}

        {/* ── SOLO ── */}
        {activeTab === "solo" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-5" style={{ background: "#111", boxShadow: "0 6px 24px rgba(0,0,0,0.18)" }}>
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: "#FF69B4" }}>SOLO IN THE CITY</p>
              <h2 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px,5vw,28px)", color: "white", lineHeight: 0.95, letterSpacing: "-0.015em" }}>
                Places women<br />love going alone.
              </h2>
              <p className="text-xs mt-2 italic" style={{ fontFamily: "var(--font-instrument)", color: "rgba(255,255,255,0.45)" }}>
                Safe. Beautiful. Yours.
              </p>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-3 flex flex-col gap-3">
              {SOLO_SPOTS.map(s => <SoloCard key={s.id} s={s} />)}
            </div>
          </div>
        )}

        {/* ── TRENDING ── */}
        {activeTab === "trending" && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-1" style={{ color: "#FF1F7D" }}>THIS WEEK IN NYC</p>
              <h2 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(24px,5vw,32px)", color: "#111", lineHeight: 0.95, letterSpacing: "-0.015em" }}>
                What women<br />are loving.
              </h2>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-3 flex flex-col gap-3">
              {TRENDING.map(t => <TrendCard key={t.id} t={t} />)}
            </div>
          </div>
        )}

        {/* ── MOMENTS ── */}
        {activeTab === "moments" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-1" style={{ color: "#FF1F7D" }}>MOMENTS</p>
                <h2 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px,5vw,28px)", color: "#111", lineHeight: 0.95, letterSpacing: "-0.015em" }}>
                  Not influencers.<br />Just women.
                </h2>
              </div>
              <button className="px-4 py-2 rounded-full text-xs font-bold text-white" style={{ background: "#FF1F7D" }}>
                + Share
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {MOMENTS.map(m => (
                <MomentCard key={m.id}
                  m={{ ...m, flowered: floweredMoments.has(m.id) }}
                  onFlower={() => setFloweredMoments(p => new Set([...p, m.id]))}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── CONFETTI strip (always visible below tabs) ── */}
        <div className="pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[9px] font-bold tracking-[0.28em] uppercase mb-1" style={{ color: "#FF1F7D" }}>CONFETTI ✿</p>
              <h3 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "18px", color: "#111" }}>We show up for our girls.</h3>
            </div>
            {/* Filter chips */}
            <div className="hidden md:flex gap-1">
              {(["All", "Birthdays", "Wins", "Milestones"] as CelebFilter[]).map(f => (
                <button key={f} onClick={() => setCelebFilter(f)}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold transition-all"
                  style={celebFilter === f ? { background: "#111", color: "white" } : { background: "white", color: "#666", border: "1px solid #E8E8E8" }}>
                  {f === "All" ? "All" : f}
                </button>
              ))}
            </div>
          </div>
          {/* Mobile filter chips */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 md:hidden">
            {(["All", "Birthdays", "Wins", "Milestones"] as CelebFilter[]).map(f => (
              <button key={f} onClick={() => setCelebFilter(f)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
                style={celebFilter === f ? { background: "#111", color: "white" } : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }}>
                {f === "All" ? "All Celebrations" : f}
              </button>
            ))}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-5 px-5 md:mx-0 md:px-0">
            {filteredConfetti.map(c => (
              <ConfettiCard key={c.id} c={c} onOpen={() => setSelectedCeleb(c)} />
            ))}
            <PlanSomethingCard />
          </div>
        </div>

      </div>

      {selectedCeleb && (
        <ConfettiSheet
          c={selectedCeleb}
          accepted={acceptedCelebs.has(selectedCeleb.id)}
          onAccept={() => setAcceptedCelebs(p => new Set([...p, selectedCeleb.id]))}
          onClose={() => setSelectedCeleb(null)}
        />
      )}
    </div>
  );
}
