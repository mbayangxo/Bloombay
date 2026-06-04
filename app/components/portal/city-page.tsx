"use client";

import { useState } from "react";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────────────────

type CityTab = "eat" | "go" | "solo" | "trending" | "moments";
type GoFilter = "All" | "Museums" | "Parks" | "Events" | "Experiences";

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

// ── Constants ────────────────────────────────────────────────────────────────

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

// ── Bloom Notes data ──────────────────────────────────────────────────────────

const BLOOM_NOTES: Record<number, { note: string; author: string; avatarColor: string }[]> = {
  1: [
    { note: "The smoked fish platter is worth every penny", author: "Aaliyah M.", avatarColor: "#FF1F7D" },
    { note: "Perfect Sunday ritual. Been coming here for 2 years", author: "Naomi B.", avatarColor: "#FF69B4" },
  ],
  2: [
    { note: "Go late, the vibe hits different after 10PM", author: "Jade O.", avatarColor: "#FF1F7D" },
    { note: "Tom Yum is a must-order", author: "Sofia K.", avatarColor: "#FF69B4" },
  ],
  3: [
    { note: "Best solo lunch spot. Staff never rushes you", author: "Naomi B.", avatarColor: "#FF69B4" },
    { note: "The croissant is everything. Get there before noon", author: "Priya R.", avatarColor: "#FF1F7D" },
  ],
  4: [
    { note: "Small plates made for sharing — order everything", author: "Sofia K.", avatarColor: "#FF69B4" },
    { note: "Perfect girls dinner energy. Every dish lands", author: "Zara F.", avatarColor: "#FF1F7D" },
  ],
  5: [
    { note: "NYC history in every bite. Come early on weekends", author: "Deja W.", avatarColor: "#FF1F7D" },
    { note: "The OG bagel experience. Nothing compares", author: "Rachel M.", avatarColor: "#FF69B4" },
  ],
};

const WHAT_WOMEN_SAY: Record<number, string[]> = {
  1: ["\"Honestly the best brunch in SoHo. Worth the wait.\"", "\"I bring every out-of-town friend here. Never disappoints.\""],
  2: ["\"Late night Thai that actually slaps. Order the tom yum.\"", "\"Love the vibe — dark, loud, delicious.\""],
  3: ["\"The most peaceful lunch I've had in this city.\"", "\"Croissant + coffee + a book. That's the move.\""],
  4: ["\"Best girls dinner spot. The small plates are unreal.\"", "\"Every dish is better than the last.\""],
  5: ["\"NYC on a plate. Don't skip the bagels with lox.\"", "\"Line moves fast. The food is worth every minute.\""],
};

// ── EAT components ────────────────────────────────────────────────────────────

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} width="9" height="9" viewBox="0 0 24 24"
          fill={star <= Math.round(value) ? "#FF1F7D" : "none"}
          stroke="#FF1F7D" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span className="text-[10px] font-bold ml-0.5" style={{ color: "#111" }}>{value.toFixed(1)}</span>
    </div>
  );
}

function ratingFromWomenLoved(womenLoved: number): number {
  // Map womenLoved count to a 4.2–5.0 range
  const min = 900; const max = 3200;
  const clamped = Math.min(Math.max(womenLoved, min), max);
  return +(4.2 + ((clamped - min) / (max - min)) * 0.8).toFixed(1);
}

// Polaroid cluster emojis for bloom notes preview
const POLAROID_EMOJIS = ["🌸", "✨", "💕", "🌺", "🫶", "🌷"];

function PolaroidCluster({ restaurantId, noteCount }: { restaurantId: number; noteCount: number }) {
  const notes = BLOOM_NOTES[restaurantId] ?? [];
  const count = notes.length || noteCount;
  const emojis = POLAROID_EMOJIS.slice(0, 3);
  const rotations = [-8, 2, -3];
  const offsets = [{ x: -8, y: 2 }, { x: 0, y: -4 }, { x: 8, y: 0 }];

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="relative" style={{ width: "68px", height: "44px" }}>
        {emojis.map((emoji, i) => (
          <div
            key={i}
            className="absolute flex items-center justify-center rounded-sm"
            style={{
              width: "32px",
              height: "36px",
              background: "white",
              boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
              transform: `rotate(${rotations[i]}deg)`,
              left: `${offsets[i].x + 10}px`,
              top: `${offsets[i].y + 2}px`,
              border: "1.5px solid rgba(0,0,0,0.04)",
              zIndex: i + 1,
            }}
          >
            <span style={{ fontSize: "14px" }}>{emoji}</span>
          </div>
        ))}
      </div>
      <span className="text-[9px] font-semibold" style={{ color: "#FF1F7D" }}>+{count} notes</span>
    </div>
  );
}

function EatCarouselCard({ r, onClick }: { r: Restaurant; onClick: () => void }) {
  const [saved, setSaved] = useState(false);
  const rating = ratingFromWomenLoved(r.womenLoved);
  const noteCount = (BLOOM_NOTES[r.id] ?? []).length;

  return (
    <div
      className="rounded-3xl overflow-hidden cursor-pointer flex-shrink-0 flex flex-col"
      style={{
        width: "220px",
        height: "300px",
        background: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
      }}
      onClick={onClick}
    >
      {/* Top gradient area */}
      <div
        className="relative flex flex-col items-center justify-center flex-shrink-0"
        style={{
          height: "150px",
          background: `linear-gradient(145deg, ${r.bgColor} 0%, #FFE0EE 100%)`,
        }}
      >
        {/* WOMEN'S PICK badge */}
        <span
          className="absolute top-2.5 left-3 text-[8px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
          style={{ background: "#FF1F7D", color: "white" }}
        >
          WOMEN&apos;S PICK
        </span>
        {/* Save button */}
        <button
          onClick={e => { e.stopPropagation(); setSaved(s => !s); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.92)" }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill={saved ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2.2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
        {/* Main emoji */}
        <span style={{ fontSize: "52px", opacity: 0.65 }}>{r.emoji}</span>
        {/* Polaroid cluster */}
        <div className="absolute bottom-2 left-3">
          <PolaroidCluster restaurantId={r.id} noteCount={noteCount} />
        </div>
      </div>

      {/* Bottom info section */}
      <div className="px-3.5 pt-3 pb-3 flex flex-col gap-1 flex-1">
        <h3
          className="font-black text-sm leading-snug"
          style={{ fontFamily: "var(--font-playfair)", color: "#111" }}
        >
          {r.name}
        </h3>
        <p className="text-[10px]" style={{ color: "#999" }}>
          {r.neighborhood} · {r.price}
        </p>
        <StarRating value={rating} />
      </div>
    </div>
  );
}

function EatGridCard({ r, onClick }: { r: Restaurant; onClick: () => void }) {
  const [saved, setSaved] = useState(false);
  const rating = ratingFromWomenLoved(r.womenLoved);
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
      onClick={onClick}
    >
      <div className="relative flex items-center justify-center" style={{ height: "80px", background: `linear-gradient(135deg, ${r.bgColor} 0%, #FFE0EE 100%)` }}>
        <span style={{ fontSize: "34px", opacity: 0.65 }}>{r.emoji}</span>
        <button
          onClick={e => { e.stopPropagation(); setSaved(s => !s); }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.92)" }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill={saved ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2.2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-black text-sm leading-tight" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{r.name}</h3>
        <p className="text-[10px] mt-0.5 mb-1.5" style={{ color: "#999" }}>{r.neighborhood} · {r.price}</p>
        <StarRating value={rating} />
      </div>
    </div>
  );
}

// ── Restaurant Detail view ────────────────────────────────────────────────────

function RestaurantDetail({ r, onBack }: { r: Restaurant; onBack: () => void }) {
  const [saved, setSaved] = useState(false);
  const rating = ratingFromWomenLoved(r.womenLoved);
  const notes = BLOOM_NOTES[r.id] ?? [
    { note: "A hidden gem — always leaves me happy", author: "Priya R.", avatarColor: "#FF1F7D" },
    { note: "One of my go-to spots in the city", author: "Sofia K.", avatarColor: "#FF69B4" },
  ];
  const reviews = WHAT_WOMEN_SAY[r.id] ?? [
    "\"A true gem. Never lets me down.\"",
    "\"Worth every visit. Highly recommend.\"",
  ];

  // Build photo gallery cards from bloom notes + what women say
  const galleryEmojis = [r.emoji, "✨", r.emoji, "🌸", "💕", "🌺"];
  const galleryBgs = [r.bgColor, "#FFF5F8", "#FFE0EE", "#FFF0F5", "#FFF8F8", "#FDFAF5"];
  const allNotes: { quote: string; author: string; avatarColor: string }[] = [
    ...notes.map(n => ({ quote: `"${n.note}"`, author: n.author, avatarColor: n.avatarColor })),
    ...reviews.map((rev, i) => ({
      quote: rev,
      author: notes[i]?.author ?? (i === 0 ? "Priya R." : "Sofia K."),
      avatarColor: notes[i]?.avatarColor ?? (i === 0 ? "#FF1F7D" : "#FF69B4"),
    })),
  ];
  const photoGalleryCards = allNotes.map((item, i) => ({
    emoji: galleryEmojis[i % galleryEmojis.length],
    bg: galleryBgs[i % galleryBgs.length],
    quote: item.quote,
    author: item.author,
    avatarColor: item.avatarColor,
  }));

  return (
    <div className="flex flex-col gap-0" style={{ background: "var(--pale-pink-bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-5 pt-4 pb-3" style={{ background: "var(--pale-pink-bg)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "#FF1F7D" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </button>
          <button onClick={() => setSaved(s => !s)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2.2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative flex items-center justify-center" style={{ height: "140px", background: `linear-gradient(135deg, ${r.bgColor} 0%, #FFE0EE 100%)` }}>
        <span style={{ fontSize: "64px", opacity: 0.55 }}>{r.emoji}</span>
        <span className="absolute top-3 left-4 text-[9px] font-bold tracking-[0.22em] uppercase px-3 py-1 rounded-full" style={{ background: "#FF1F7D", color: "white" }}>
          WOMEN&apos;S PICK
        </span>
      </div>

      {/* Core info */}
      <div className="px-5 pt-4 pb-3" style={{ background: "white" }}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-black text-2xl leading-none" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{r.name}</h2>
            <p className="text-xs mt-1" style={{ color: "#999" }}>{r.neighborhood} · {r.price}</p>
          </div>
          <FlowerCount count={r.womenLoved} />
        </div>
        <div className="mt-2">
          <StarRating value={rating} />
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {r.soloFriendly && <span className="text-[8px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#111", color: "white" }}>SOLO FRIENDLY</span>}
          {r.tags.map(t => (
            <span key={t} className="text-[9px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#FFF5F8", color: "#888", border: "1px solid #EEE" }}>{t}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5 pt-5 pb-8">
        {/* Bloom Notes */}
        <div>
          <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF1F7D" }}>BLOOM NOTES</p>
          <div className="flex flex-col gap-2.5">
            {notes.map((n, i) => (
              <div key={i} className="rounded-2xl p-3.5 flex items-start gap-3" style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: n.avatarColor }}>
                  {n.author[0]}
                </div>
                <div>
                  <p className="text-xs italic leading-relaxed" style={{ fontFamily: "var(--font-playfair)", color: "#444" }}>&ldquo;{n.note}&rdquo;</p>
                  <p className="text-[10px] mt-1 font-semibold" style={{ color: "#bbb" }}>— {n.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photos — scrollable gallery with review quotes */}
        <div>
          <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF1F7D" }}>PHOTOS</p>
          <div
            className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {photoGalleryCards.map((card, i) => (
              <div
                key={i}
                className="rounded-2xl flex-shrink-0 flex flex-col overflow-hidden"
                style={{
                  width: "120px",
                  height: "150px",
                  background: "white",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                {/* Photo area */}
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ height: "64px", background: card.bg }}
                >
                  <span style={{ fontSize: "28px", opacity: 0.7 }}>{card.emoji}</span>
                </div>
                {/* Quote + author */}
                <div className="px-2 pt-2 pb-2 flex flex-col gap-1 flex-1 overflow-hidden">
                  <p
                    className="text-[9px] italic leading-tight line-clamp-3"
                    style={{ fontFamily: "var(--font-playfair)", color: "#555" }}
                  >
                    {card.quote}
                  </p>
                  <div className="flex items-center gap-1 mt-auto">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white flex-shrink-0"
                      style={{ background: card.avatarColor }}
                    >
                      {card.author[0]}
                    </div>
                    <p className="text-[8px] font-semibold truncate" style={{ color: "#bbb" }}>{card.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Dish */}
        {r.notableDish && (
          <div>
            <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF1F7D" }}>FAVORITE DISH</p>
            <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: r.bgColor }}>{r.emoji}</div>
              <div>
                <p className="font-black text-base" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{r.notableDish}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#FF1F7D" }}>{r.notableDishNote}</p>
              </div>
            </div>
          </div>
        )}

        {/* What Women Say */}
        <div>
          <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF1F7D" }}>WHAT WOMEN SAY</p>
          <div className="flex flex-col gap-2.5">
            {reviews.map((review, i) => (
              <div key={i} className="rounded-2xl px-4 py-3" style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <p className="text-sm italic" style={{ fontFamily: "var(--font-playfair)", color: "#444" }}>{review}</p>
              </div>
            ))}
          </div>
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

const POLAROID_ROTATIONS = ["-2.5deg", "2deg", "-1deg", "3deg", "-1.8deg", "1.5deg"];

function MomentCard({ m, onFlower, idx, onClick }: {
  m: CityMoment & { flowered?: boolean };
  onFlower: () => void;
  idx: number;
  onClick?: () => void;
}) {
  const rotate = POLAROID_ROTATIONS[idx % POLAROID_ROTATIONS.length];
  return (
    <div
      className="flex-shrink-0 cursor-pointer transition-transform active:scale-[0.97]"
      style={{ transform: `rotate(${rotate})`, transformOrigin: "center top" }}
      onClick={onClick}
    >
      {/* Polaroid frame — white card with image area + handwritten caption */}
      <div style={{
        background: "white",
        borderRadius: "3px",
        padding: "9px 9px 32px",
        width: "152px",
        boxShadow: "0 8px 28px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08)",
      }}>
        {/* Photo area */}
        <div className="w-full relative overflow-hidden"
          style={{ height: "130px", background: m.bgColor, borderRadius: "2px" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ fontSize: "54px", opacity: 0.55 }}>{m.emoji}</span>
          </div>
          {/* Avatar + neighborhood overlay */}
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white flex-shrink-0"
              style={{ background: m.avatarColor, boxShadow: "0 1px 4px rgba(0,0,0,0.25)" }}>
              {m.initial}
            </div>
            <p className="text-[8px] font-semibold rounded px-1 py-px"
              style={{ color: "rgba(0,0,0,0.5)", background: "rgba(255,255,255,0.75)" }}>
              {m.neighborhood}
            </p>
          </div>
          <p className="absolute top-1.5 right-1.5 text-[8px] font-medium px-1.5 py-px rounded"
            style={{ color: "rgba(0,0,0,0.4)", background: "rgba(255,255,255,0.65)" }}>
            {m.timeAgo}
          </p>
        </div>
        {/* Polaroid caption area — white space below image */}
        <div className="pt-2.5 px-0.5">
          <p className="leading-snug text-center"
            style={{ fontFamily: "var(--font-caveat)", fontSize: "14px", color: "#333", lineHeight: 1.3 }}>
            {m.caption}
          </p>
          <p className="text-[9px] text-center mt-0.5" style={{ color: "#bbb" }}>{m.location}</p>
          <button
            onClick={e => { e.stopPropagation(); onFlower(); }}
            className="flex items-center justify-center gap-1 mt-2 w-full text-[9px] font-bold transition-all"
            style={{ color: m.flowered ? "#FF1F7D" : "#ccc" }}>
            ✿ {m.flowers + (m.flowered ? 1 : 0)}
          </button>
        </div>
      </div>
    </div>
  );
}

function MomentDetailSheet({ m, onClose }: { m: CityMoment; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div className="flex-1" />
      <div
        className="rounded-t-3xl p-6 pb-10"
        style={{ background: "#FDFAF5" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close bar */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "#E0E0E0" }} />
        {/* Large polaroid */}
        <div className="mx-auto" style={{ width: "200px", transform: "rotate(-1deg)" }}>
          <div style={{ background: "white", borderRadius: "3px", padding: "10px 10px 44px", boxShadow: "0 10px 36px rgba(0,0,0,0.18)" }}>
            <div className="relative overflow-hidden" style={{ height: "180px", background: m.bgColor, borderRadius: "2px" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ fontSize: "72px", opacity: 0.55 }}>{m.emoji}</span>
              </div>
            </div>
            <div className="pt-3 px-1 text-center">
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: "17px", color: "#333", lineHeight: 1.3 }}>{m.caption}</p>
              <p className="text-[10px] mt-1" style={{ color: "#aaa" }}>{m.location}, {m.neighborhood}</p>
            </div>
          </div>
        </div>
        {/* Meta */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: m.avatarColor }}>{m.initial}</div>
            <div>
              <p className="text-xs font-bold" style={{ color: "#111" }}>{m.neighborhood}</p>
              <p className="text-[10px]" style={{ color: "#aaa" }}>{m.timeAgo} ago</p>
            </div>
          </div>
          <span className="text-sm font-bold" style={{ color: "#FF1F7D" }}>✿ {m.flowers}</span>
        </div>
      </div>
    </div>
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
  const [activeTab, setActiveTab]           = useState<CityTab>("eat");
  const [goFilter, setGoFilter]             = useState<GoFilter>("All");
  const [floweredMoments, setFloweredMoments] = useState<Set<number>>(new Set());
  const [girlPicks, setGirlPicks]           = useState<Place[]>(GIRL_PICKS);
  const [stampedPlaces, setStampedPlaces]   = useState<Set<number>>(new Set());
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedMoment, setSelectedMoment] = useState<CityMoment | null>(null);
  const [showAllSpots, setShowAllSpots]     = useState(false);

  function handleStamp(id: number) {
    if (stampedPlaces.has(id)) return;
    setStampedPlaces(p => new Set([...p, id]));
    setGirlPicks(p => p.map(pl => pl.id === id ? { ...pl, stamps: pl.stamps + 1 } : pl));
  }

  const filteredGo = goFilter === "All" ? GO_PLACES : GO_PLACES.filter(p => p.filter === goFilter);

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>

      {/* ── Header ── */}
      <div className="px-5 pt-12 pb-0 md:px-10 md:pt-8 md:max-w-[1280px] md:mx-auto">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ NYC · WILLIAMSBURG</p>
        <h1 className="font-black leading-none mb-1" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(34px,6vw,48px)", color: "var(--heading-color, #111)", lineHeight: 0.92, letterSpacing: "-0.02em" }}>
          Girl Picks.
        </h1>
        <p className="text-sm italic mb-5" style={{ fontFamily: "var(--font-instrument)", color: "var(--text-muted, #999)" }}>
          The city, through women.
        </p>

        {/* ── Tab bar ── */}
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-5 px-5 md:mx-0 md:px-0">
          {TAB_LABELS.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold transition-all"
              style={activeTab === key
                ? { background: "var(--heading-color, #111)", color: "var(--pale-pink-bg, white)" }
                : { background: "var(--card-bg, white)", color: "#666", border: "1.5px solid var(--card-border, #E8E8E8)" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="px-5 md:px-10 md:max-w-[1280px] md:mx-auto pt-6 flex flex-col gap-6">

        {/* ── EAT ── */}
        {activeTab === "eat" && selectedRestaurant && (
          <RestaurantDetail r={selectedRestaurant} onBack={() => setSelectedRestaurant(null)} />
        )}

        {activeTab === "eat" && !selectedRestaurant && (
          <div className="flex flex-col gap-6">
            {/* Women's Picks carousel */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "#FF1F7D" }}>WOMEN&apos;S PICKS</p>
                <Link href="/member/city/places" className="text-[9px] font-bold tracking-[0.15em] uppercase" style={{ color: "#FF1F7D" }}>See More →</Link>
              </div>
              <div
                className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0"
                style={{ scrollbarWidth: "none" }}
              >
                {RESTAURANTS.filter(r => r.featured || r.womenLoved > 1000).map(r => (
                  <EatCarouselCard key={r.id} r={r} onClick={() => setSelectedRestaurant(r)} />
                ))}
              </div>
            </div>

            <div className="md:grid md:grid-cols-[1fr_1fr] md:gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "#FF1F7D" }}>ALL SPOTS</p>
                  <Link href="/member/city/places" className="text-[9px] font-bold tracking-[0.15em] uppercase" style={{ color: "#FF1F7D" }}>See More →</Link>
                </div>
                <div
                  className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-2"
                  style={{ scrollbarWidth: "none" }}
                >
                  {(showAllSpots ? RESTAURANTS : RESTAURANTS.slice(0, 5)).map(r => (
                    <div key={r.id} className="flex-shrink-0 md:flex-shrink md:w-auto" style={{ width: "clamp(180px, 52vw, 240px)" }}>
                      <EatGridCard r={r} onClick={() => setSelectedRestaurant(r)} />
                    </div>
                  ))}
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
                  <h3 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: "var(--heading-color, #111)" }}>Places the city loves</h3>
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

        {/* ── MOMENTS tab ── */}
        {activeTab === "moments" && (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ MOMENTS</p>
                <h2 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,5vw,32px)", color: "var(--heading-color, #111)", lineHeight: 0.95, letterSpacing: "-0.015em" }}>
                  Not influencers.<br />Just women.
                </h2>
                <p className="text-xs mt-1 italic" style={{ fontFamily: "var(--font-instrument)", color: "var(--text-muted, #999)" }}>
                  Real life. Real places. Real city.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: "#FF1F7D" }}>
                  + Share
                </button>
              </div>
            </div>

            {/* Polaroid swipe row */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "#aaa" }}>RECENT</p>
                <Link href="/member/city/moments" className="text-[9px] font-bold tracking-[0.15em] uppercase" style={{ color: "#FF1F7D" }}>
                  See More →
                </Link>
              </div>
              <div
                className="flex gap-6 overflow-x-auto pb-8 -mx-5 px-5"
                style={{ scrollbarWidth: "none", alignItems: "flex-start" }}
              >
                {MOMENTS.map((m, idx) => (
                  <MomentCard
                    key={m.id}
                    m={{ ...m, flowered: floweredMoments.has(m.id) }}
                    onFlower={() => setFloweredMoments(p => new Set([...p, m.id]))}
                    idx={idx}
                    onClick={() => setSelectedMoment(m)}
                  />
                ))}
              </div>
            </div>

            {/* Explore more CTA */}
            <Link href="/member/city/moments"
              className="flex items-center justify-center gap-2 rounded-2xl py-4 transition-all active:scale-[0.98]"
              style={{ background: "#111", color: "white" }}>
              <span className="text-sm font-bold">See all moments →</span>
            </Link>
          </div>
        )}

      </div>

      {/* Moment detail sheet */}
      {selectedMoment && (
        <MomentDetailSheet m={selectedMoment} onClose={() => setSelectedMoment(null)} />
      )}
    </div>
  );
}
