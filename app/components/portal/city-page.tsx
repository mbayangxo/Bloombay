"use client";

import { useState } from "react";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────────────────

type CityTab = "eat" | "go" | "solo" | "girl-picks";
type GoFilter = "All" | "Museums" | "Parks" | "Events" | "Experiences";
type GirlPicksFilter = "Bloomie Gems" | "City Secrets" | "New In Town" | "Most Loved";

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

type PlaceType = "place" | "eat" | "gem";

interface Place {
  id: number; type: PlaceType; name: string; neighborhood: string;
  review: string; submittedBy: string; rating: number; stamps: number;
  girlCategory: GirlPicksFilter;
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


const GIRL_PICKS: Place[] = [
  // Most Loved
  { id: 1, type: "place", name: "Brooklyn Bridge Park", neighborhood: "DUMBO", review: "Golden hour from the pier. Bring a blanket and stay for hours.", submittedBy: "Priya R.", rating: 4.9, stamps: 203, girlCategory: "Most Loved" },
  { id: 2, type: "place", name: "The High Line", neighborhood: "Chelsea", review: "Best morning walk in the city. Go early before the crowds.", submittedBy: "Sofia K.", rating: 4.8, stamps: 127, girlCategory: "Most Loved" },
  { id: 3, type: "eat", name: "Sadelle's", neighborhood: "SoHo", review: "The smoked fish platter for brunch. Every single time.", submittedBy: "Aaliyah M.", rating: 4.9, stamps: 89, girlCategory: "Most Loved" },
  { id: 4, type: "place", name: "The Met", neighborhood: "Upper East Side", review: "Pay what you wish and stay all day. The Egyptian Wing at 9:30AM is a ritual.", submittedBy: "Sofia K.", rating: 4.9, stamps: 312, girlCategory: "Most Loved" },
  // Bloomie Gems
  { id: 5, type: "gem", name: "Russ & Daughters Café", neighborhood: "Lower East Side", review: "The OG. Bagels, lox, and a century of New York on every wall.", submittedBy: "Deja W.", rating: 4.7, stamps: 155, girlCategory: "Bloomie Gems" },
  { id: 6, type: "eat", name: "La Mercerie", neighborhood: "SoHo", review: "Quiet, elegant, the best croissant in the city. Perfect solo lunch.", submittedBy: "Naomi B.", rating: 4.7, stamps: 94, girlCategory: "Bloomie Gems" },
  { id: 7, type: "eat", name: "Loring Place", neighborhood: "West Village", review: "Small plates made for sharing. The best girls dinner in the city.", submittedBy: "Sofia K.", rating: 4.8, stamps: 78, girlCategory: "Bloomie Gems" },
  { id: 8, type: "place", name: "Prospect Park — Breeze Hill", neighborhood: "Park Slope", review: "Less tourists, more locals with blankets and books. Completely yours.", submittedBy: "Priya R.", rating: 4.7, stamps: 61, girlCategory: "Bloomie Gems" },
  // City Secrets
  { id: 9, type: "gem", name: "Archway Café", neighborhood: "DUMBO", review: "Under the Manhattan Bridge. Nobody knows about this. Best kept secret in Brooklyn.", submittedBy: "Zara F.", rating: 5.0, stamps: 38, girlCategory: "City Secrets" },
  { id: 10, type: "gem", name: "McNally Jackson Café", neighborhood: "Nolita", review: "Back of the bookstore. Loud enough to feel alive, quiet enough to think.", submittedBy: "Rachel M.", rating: 4.8, stamps: 71, girlCategory: "City Secrets" },
  { id: 11, type: "place", name: "The Ramble — Central Park", neighborhood: "Upper West Side", review: "A secret woodland in the middle of Manhattan. Even locals forget it exists.", submittedBy: "Naomi B.", rating: 4.8, stamps: 44, girlCategory: "City Secrets" },
  { id: 12, type: "eat", name: "Lucali", neighborhood: "Carroll Gardens", review: "No phone orders, cash only, bring wine. The city's best kept pizza secret.", submittedBy: "Jade O.", rating: 5.0, stamps: 29, girlCategory: "City Secrets" },
  // New In Town
  { id: 13, type: "eat", name: "Bangkok Supper Club", neighborhood: "Lower East Side", review: "The tom yum is religious. Late-night energy, go often.", submittedBy: "Jade O.", rating: 4.8, stamps: 64, girlCategory: "New In Town" },
  { id: 14, type: "place", name: "The Seaport District", neighborhood: "FiDi", review: "Completely transformed. Cobblestones, water views, and actually good food.", submittedBy: "Aaliyah M.", rating: 4.6, stamps: 41, girlCategory: "New In Town" },
  { id: 15, type: "gem", name: "Sunday in Brooklyn", neighborhood: "Williamsburg", review: "Malted pancakes, natural light, great energy. The brunch spot everyone is finding.", submittedBy: "Sofia K.", rating: 4.8, stamps: 53, girlCategory: "New In Town" },
  { id: 16, type: "place", name: "Industry City", neighborhood: "Sunset Park", review: "Brooklyn's best-kept neighbourhood secret. Art, food, and zero tourists.", submittedBy: "Priya R.", rating: 4.7, stamps: 36, girlCategory: "New In Town" },
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
  { key: "eat",        label: "Eat" },
  { key: "go",         label: "Go" },
  { key: "solo",       label: "Solo" },
  { key: "girl-picks", label: "Girl Picks" },
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

// ── Go Place Notes data ───────────────────────────────────────────────────────

const GO_NOTES: Record<number, string[]> = {
  1: ['"Golden hour from Pier 1 is the most beautiful thing in Brooklyn."', '"Go on a weekday evening — totally different energy."'],
  2: ['"The Egyptian Wing at 9:30AM before the crowds is sacred."', '"Pay what you wish and stay all day."'],
  3: ['"Hidden gem under the bridge. Nobody knows about this."', '"Best coffee with the best view."'],
  4: ['"Best morning walk in the city. Go before 8AM."', '"The art installations make every walk different."'],
  5: ['"Every Saturday of summer. This is the ritual."', '"100 vendors and you can\'t go wrong."'],
  6: ['"The Matisse floor never gets old. Ever."', '"MoMA on a Friday evening is peaceful and perfect."'],
  7: ['"Four hours, one coffee, zero interruptions."', '"The back room upstairs is the best kept secret."'],
};


// ── WALL_AVATARS-style placeholder avatars ────────────────────────────────────

const DISH_SAVES_AVATARS = [
  { initial: "A", color: "#FF1F7D" },
  { initial: "S", color: "#FF69B4" },
  { initial: "K", color: "#FF1F7D" },
  { initial: "N", color: "#FF69B4" },
  { initial: "Z", color: "#FF1F7D" },
  { initial: "I", color: "#FF69B4" },
  { initial: "P", color: "#FF1F7D" },
  { initial: "D", color: "#FF69B4" },
];

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

// ── Bottom sheet: BloomNoteSheet ──────────────────────────────────────────────

function BloomNoteSheet({ note, onClose }: {
  note: { note: string; author: string; avatarColor: string };
  onClose: () => void;
}) {
  const [ownNote, setOwnNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (ownNote.trim()) {
      setSubmitted(true);
    }
  }

  return (
    <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div
        className="fixed bottom-0 left-0 right-0 rounded-t-3xl p-6 pb-10"
        style={{ background: "#FDFAF6" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "#E0E0E0" }} />

        {/* Quote */}
        <div className="rounded-2xl p-4 mb-4" style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
          <p className="text-sm italic leading-relaxed" style={{ fontFamily: "var(--font-playfair)", color: "#444" }}>
            &ldquo;{note.note}&rdquo;
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: note.avatarColor }}>
              {note.author[0]}
            </div>
            <p className="text-xs font-semibold" style={{ color: "#aaa" }}>— {note.author}</p>
          </div>
        </div>

        {/* Leave own note */}
        <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "#FF1F7D" }}>LEAVE YOUR OWN NOTE</p>
        {submitted ? (
          <div className="rounded-2xl p-4 text-center" style={{ background: "#FFF0F5" }}>
            <p className="text-sm font-bold" style={{ color: "#FF1F7D" }}>Note submitted ✿</p>
            <p className="text-xs mt-1" style={{ color: "#aaa" }}>Thank you for sharing.</p>
          </div>
        ) : (
          <>
            <textarea
              value={ownNote}
              onChange={e => setOwnNote(e.target.value)}
              placeholder="Share what you love about this place…"
              rows={3}
              className="w-full rounded-2xl p-3.5 text-sm resize-none outline-none"
              style={{ background: "white", border: "1.5px solid #F0E0E8", color: "#333", fontFamily: "var(--font-instrument)" }}
            />
            <button
              onClick={handleSubmit}
              className="mt-3 w-full py-3 rounded-full text-sm font-bold transition-all active:scale-[0.98]"
              style={{ background: "#FF1F7D", color: "white" }}
            >
              Submit note
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Bottom sheet: DishSavesSheet ──────────────────────────────────────────────

function DishSavesSheet({ r, onClose }: { r: Restaurant; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div
        className="fixed bottom-0 left-0 right-0 rounded-t-3xl p-6 pb-10"
        style={{ background: "#FDFAF6" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "#E0E0E0" }} />

        {/* Dish hero */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: r.bgColor }}>
            {r.emoji}
          </div>
          <div>
            <h3 className="font-black text-lg leading-tight" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{r.notableDish}</h3>
            <p className="text-xs mt-0.5 font-semibold" style={{ color: "#FF1F7D" }}>889 women saved this</p>
            <p className="text-[10px] mt-0.5" style={{ color: "#aaa" }}>{r.notableDishNote}</p>
          </div>
        </div>

        {/* Avatar scroll */}
        <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#FF1F7D" }}>WOMEN WHO SAVED THIS</p>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {DISH_SAVES_AVATARS.map((av, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: av.color }}
              >
                {av.initial}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Restaurant Detail view ────────────────────────────────────────────────────

function RestaurantDetail({ r, onBack }: { r: Restaurant; onBack: () => void }) {
  const [saved, setSaved] = useState(false);
  const [selectedNote, setSelectedNote] = useState<{ note: string; author: string; avatarColor: string } | null>(null);
  const [dishSheetOpen, setDishSheetOpen] = useState(false);

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
              <button
                key={i}
                className="rounded-2xl p-3.5 flex items-start gap-3 cursor-pointer text-left w-full"
                style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.05)", border: "none" }}
                onClick={() => setSelectedNote(n)}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: n.avatarColor }}>
                  {n.author[0]}
                </div>
                <div>
                  <p className="text-xs italic leading-relaxed" style={{ fontFamily: "var(--font-playfair)", color: "#444" }}>&ldquo;{n.note}&rdquo;</p>
                  <p className="text-[10px] mt-1 font-semibold" style={{ color: "#bbb" }}>— {n.author}</p>
                </div>
              </button>
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
            <button
              className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer w-full text-left"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "none" }}
              onClick={() => setDishSheetOpen(true)}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: r.bgColor }}>{r.emoji}</div>
              <div>
                <p className="font-black text-base" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{r.notableDish}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#FF1F7D" }}>{r.notableDishNote}</p>
              </div>
            </button>
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

      {/* Bloom Note sheet */}
      {selectedNote && (
        <BloomNoteSheet note={selectedNote} onClose={() => setSelectedNote(null)} />
      )}

      {/* Dish saves sheet */}
      {dishSheetOpen && r.notableDish && (
        <DishSavesSheet r={r} onClose={() => setDishSheetOpen(false)} />
      )}
    </div>
  );
}

// ── GO components ─────────────────────────────────────────────────────────────

function GoCard({ p, onClick }: { p: GoPlace; onClick: () => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: p.bgColor, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      onClick={onClick}
    >
      <div className="flex items-center justify-center" style={{ height: "88px", background: `linear-gradient(135deg, ${p.bgColor} 0%, ${p.bgColor}99 100%)` }}>
        <span style={{ fontSize: "44px", opacity: 0.75 }}>{p.emoji}</span>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-black text-sm leading-tight" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{p.name}</h3>
            <p className="text-[10px]" style={{ color: "#999" }}>{p.neighborhood}</p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); setSaved(s => !s); }}
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "white" }}
          >
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

// ── GoPlace Detail view ───────────────────────────────────────────────────────

function GoPlaceDetail({ p, onBack }: { p: GoPlace; onBack: () => void }) {
  const [saved, setSaved] = useState(false);
  const quotes = GO_NOTES[p.id] ?? [
    '"A wonderful spot. Never disappoints."',
    '"Worth every visit — add it to your list."',
  ];

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
      <div className="relative flex items-center justify-center" style={{ height: "140px", background: `linear-gradient(135deg, ${p.bgColor} 0%, #E8F4FF 100%)` }}>
        <span style={{ fontSize: "64px", opacity: 0.65 }}>{p.emoji}</span>
      </div>

      {/* Core info */}
      <div className="px-5 pt-4 pb-3" style={{ background: "white" }}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-black text-2xl leading-none" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{p.name}</h2>
            <p className="text-xs mt-1" style={{ color: "#999" }}>{p.neighborhood} · {p.filter}</p>
          </div>
          <FlowerCount count={p.womenLoved} />
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {p.soloFriendly && <span className="text-[8px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#111", color: "white" }}>SOLO FRIENDLY</span>}
          {p.tags.map(t => (
            <span key={t} className="text-[9px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#FFF5F8", color: "#888", border: "1px solid #EEE" }}>{t}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5 pt-5 pb-8">
        {/* Blurb / quote */}
        <div className="rounded-2xl p-4" style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
          <p className="text-sm italic leading-relaxed" style={{ fontFamily: "var(--font-playfair)", color: "#444" }}>
            &ldquo;{p.blurb}&rdquo;
          </p>
          <p className="text-[10px] mt-2 font-semibold" style={{ color: "#bbb" }}>— {p.submittedBy}</p>
        </div>

        {/* What Women Say */}
        <div>
          <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF1F7D" }}>WHAT WOMEN SAY</p>
          <div className="flex flex-col gap-2.5">
            {quotes.map((quote, i) => (
              <div key={i} className="rounded-2xl px-4 py-3" style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <p className="text-sm italic" style={{ fontFamily: "var(--font-playfair)", color: "#444" }}>{quote}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SOLO components ───────────────────────────────────────────────────────────

function SoloCard({ s, onClick }: { s: SoloSpot; onClick: () => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex cursor-pointer"
      style={{ boxShadow: "0 1px 10px rgba(0,0,0,0.05)" }}
      onClick={onClick}
    >
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
          <button
            onClick={e => { e.stopPropagation(); setSaved(sv => !sv); }}
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#FFF5F8" }}
          >
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

// ── SoloSpot Detail view ──────────────────────────────────────────────────────

function SoloSpotDetail({ s, onBack }: { s: SoloSpot; onBack: () => void }) {
  const [saved, setSaved] = useState(false);

  const SOLO_BG_COLORS: Record<number, string> = {
    1: "#FDFAF5",
    2: "#FFF0F5",
    3: "#F0F8FF",
    4: "#F0FFF4",
    5: "#FFF8F0",
  };
  const bgColor = SOLO_BG_COLORS[s.id] ?? "#FFF5F8";

  const WHY_WOMEN_LOVE: Record<number, string[]> = {
    1: ['"Bar seating with natural light. You never feel watched or rushed."', '"The quietest loud restaurant in the city. Perfect paradox."'],
    2: ['"Back of the bookstore is its own world. Zero judgment if you stay three hours."', '"Best kept secret in Nolita — real cozy, real coffee."'],
    3: ['"The view under the bridge is cinematic. You almost forget you\'re in NYC."', '"Solo here feels like a little vacation from the week."'],
    4: ['"Breeze Hill has the best people-watching in all of Brooklyn."', '"Nobody is in a rush here. It\'s the city\'s secret permission slip to slow down."'],
    5: ['"The Temple of Dendur at opening time is one of the most peaceful places on earth."', '"Solo morning at the Met is a ritual I protect at all costs."'],
  };

  const loveQuotes = WHY_WOMEN_LOVE[s.id] ?? [
    '"A place that feels made for you, alone."',
    '"Solo time here is the best kind of reset."',
  ];

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
          <button onClick={() => setSaved(sv => !sv)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? "#FF1F7D" : "none"} stroke="#FF1F7D" strokeWidth="2.2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative flex items-center justify-center" style={{ height: "140px", background: `linear-gradient(135deg, ${bgColor} 0%, #FFF0F5 100%)` }}>
        <span style={{ fontSize: "64px", opacity: 0.65 }}>{s.emoji}</span>
        <span className="absolute top-3 left-4 text-[9px] font-bold tracking-[0.22em] uppercase px-3 py-1 rounded-full" style={{ background: "#111", color: "white" }}>
          SOLO SPOT
        </span>
      </div>

      {/* Core info */}
      <div className="px-5 pt-4 pb-3" style={{ background: "white" }}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-black text-2xl leading-none" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{s.name}</h2>
            <p className="text-xs mt-1" style={{ color: "#999" }}>{s.neighborhood} · {s.type}</p>
          </div>
          <FlowerCount count={s.womenLoved} />
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5 pt-5 pb-8">
        {/* Why quote */}
        <div className="rounded-2xl p-4" style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
          <p className="text-sm italic leading-relaxed" style={{ fontFamily: "var(--font-playfair)", color: "#444" }}>
            {s.why}
          </p>
          <p className="text-[10px] mt-2 font-semibold" style={{ color: "#bbb" }}>— {s.submittedBy}</p>
        </div>

        {/* Why women love it */}
        <div>
          <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF1F7D" }}>WHY WOMEN LOVE IT</p>
          <div className="flex flex-col gap-2.5">
            {loveQuotes.map((quote, i) => (
              <div key={i} className="rounded-2xl px-4 py-3" style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <p className="text-sm italic" style={{ fontFamily: "var(--font-playfair)", color: "#444" }}>{quote}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// ── Girl Picks card ───────────────────────────────────────────────────────────

function PlaceCard({ place, stamped, onStamp, onClick }: {
  place: Place;
  stamped: boolean;
  onStamp: () => void;
  onClick: () => void;
}) {
  const tc = PLACE_TYPE_COLOR[place.type];
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex cursor-pointer"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
      onClick={onClick}
    >
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
          <button
            onClick={e => { e.stopPropagation(); onStamp(); }}
            disabled={stamped}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
            style={stamped ? { background: "#FFF0F5", color: "#FF1F7D", cursor: "default" } : { background: "#FF1F7D", color: "white" }}
          >
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
  const [girlPicksFilter, setGirlPicksFilter] = useState<GirlPicksFilter>("Most Loved");
  const [girlPicks, setGirlPicks]           = useState<Place[]>(GIRL_PICKS);
  const [stampedPlaces, setStampedPlaces]   = useState<Set<number>>(new Set());
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedGoPlace, setSelectedGoPlace] = useState<GoPlace | null>(null);
  const [selectedSoloSpot, setSelectedSoloSpot] = useState<SoloSpot | null>(null);
  const [showAllSpots, setShowAllSpots]     = useState(false);

  function handleStamp(id: number) {
    if (stampedPlaces.has(id)) return;
    setStampedPlaces(p => new Set([...p, id]));
    setGirlPicks(p => p.map(pl => pl.id === id ? { ...pl, stamps: pl.stamps + 1 } : pl));
  }

  function handlePlaceCardClick(place: Place) {
    if (place.type === "eat") {
      const restaurant = RESTAURANTS.find(r => r.name === place.name);
      if (restaurant) {
        setSelectedRestaurant(restaurant);
        setActiveTab("eat");
      }
    } else {
      // "place" or "gem" — find matching go place
      // Try exact name match first, then partial match
      const exactName = place.name.replace(" under Manhattan Bridge", "");
      const goPlace = GO_PLACES.find(p => p.name === place.name || p.name === exactName || place.name.startsWith(p.name));
      if (goPlace) {
        setSelectedGoPlace(goPlace);
      }
    }
  }

  const filteredGo = goFilter === "All" ? GO_PLACES : GO_PLACES.filter(p => p.filter === goFilter);

  // Full-page detail routes
  if (selectedRestaurant) return <RestaurantDetail r={selectedRestaurant} onBack={() => setSelectedRestaurant(null)} />;
  if (selectedGoPlace) return <GoPlaceDetail p={selectedGoPlace} onBack={() => setSelectedGoPlace(null)} />;
  if (selectedSoloSpot) return <SoloSpotDetail s={selectedSoloSpot} onBack={() => setSelectedSoloSpot(null)} />;

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>

      {/* ── Header ── */}
      <div className="px-5 pt-12 pb-0 md:px-10 md:pt-8 md:max-w-[1280px] md:mx-auto">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ NYC · WILLIAMSBURG</p>
        <h1 className="font-black leading-none mb-1" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(34px,6vw,48px)", color: "var(--heading-color, #111)", lineHeight: 0.92, letterSpacing: "-0.02em" }}>
          The City.
        </h1>
        <p className="text-sm italic mb-5" style={{ fontFamily: "var(--font-instrument)", color: "var(--text-muted, #999)" }}>
          Places worth knowing. Always.
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
        {activeTab === "eat" && (
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
                <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "#FFF0F5", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: "white" }}>🥯</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold tracking-[0.18em] uppercase mb-0.5" style={{ color: "#FF1F7D" }}>MOST SAVED</p>
                    <p className="text-sm font-bold leading-snug" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>Bagel with Lox at Russ &amp; Daughters</p>
                    <p className="text-[10px] mt-1 font-semibold" style={{ color: "#FF1F7D" }}>✿ 3,102 women love this</p>
                  </div>
                </div>
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
                  <PlaceCard
                    key={place.id}
                    place={place}
                    stamped={stampedPlaces.has(place.id)}
                    onStamp={() => handleStamp(place.id)}
                    onClick={() => handlePlaceCardClick(place)}
                  />
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
              {filteredGo.map(p => <GoCard key={p.id} p={p} onClick={() => setSelectedGoPlace(p)} />)}
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
              {SOLO_SPOTS.map(s => <SoloCard key={s.id} s={s} onClick={() => setSelectedSoloSpot(s)} />)}
            </div>
          </div>
        )}

        {/* ── GIRL PICKS ── */}
        {activeTab === "girl-picks" && (
          <div className="flex flex-col gap-6">
            {/* Intro header */}
            <div className="rounded-2xl p-5" style={{ background: "#111", boxShadow: "0 6px 24px rgba(0,0,0,0.18)" }}>
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: "#FF69B4" }}>GIRL PICKS</p>
              <h2 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px,5vw,28px)", color: "white", lineHeight: 0.95, letterSpacing: "-0.015em" }}>
                The places women<br />actually love.
              </h2>
              <p className="text-xs mt-2 italic" style={{ fontFamily: "var(--font-instrument)", color: "rgba(255,255,255,0.45)" }}>
                Timeless. Local. Ours.
              </p>
            </div>

            {/* Sub-filter pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 md:mx-0 md:px-0" style={{ scrollbarWidth: "none" }}>
              {(["Most Loved", "Bloomie Gems", "City Secrets", "New In Town"] as GirlPicksFilter[]).map(f => (
                <button key={f} onClick={() => setGirlPicksFilter(f)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
                  style={girlPicksFilter === f ? { background: "#FF1F7D", color: "white" } : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }}>
                  {f}
                </button>
              ))}
            </div>

            {/* Sub-category description */}
            {girlPicksFilter === "Most Loved" && (
              <p className="text-xs italic" style={{ fontFamily: "var(--font-instrument)", color: "var(--text-muted, #999)", marginTop: "-12px" }}>
                The spots women return to, again and again.
              </p>
            )}
            {girlPicksFilter === "Bloomie Gems" && (
              <p className="text-xs italic" style={{ fontFamily: "var(--font-instrument)", color: "var(--text-muted, #999)", marginTop: "-12px" }}>
                Hand-picked favourites from BloomBay women.
              </p>
            )}
            {girlPicksFilter === "City Secrets" && (
              <p className="text-xs italic" style={{ fontFamily: "var(--font-instrument)", color: "var(--text-muted, #999)", marginTop: "-12px" }}>
                Under the radar. Off the tourist map. Entirely yours.
              </p>
            )}
            {girlPicksFilter === "New In Town" && (
              <p className="text-xs italic" style={{ fontFamily: "var(--font-instrument)", color: "var(--text-muted, #999)", marginTop: "-12px" }}>
                Recently discovered. Women are already obsessed.
              </p>
            )}

            {/* Filtered places */}
            <div className="flex flex-col gap-3">
              {girlPicks.filter(p => p.girlCategory === girlPicksFilter).map(place => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  stamped={stampedPlaces.has(place.id)}
                  onStamp={() => handleStamp(place.id)}
                  onClick={() => handlePlaceCardClick(place)}
                />
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
