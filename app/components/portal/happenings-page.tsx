"use client";

import { useState } from "react";
import Link from "next/link";
import { EventDetail } from "@/app/components/portal/event-detail";
import type { EventData } from "@/app/components/portal/event-detail";

// ── Types ────────────────────────────────────────────────────────────────────

type HappeningType = "gallery" | "popup" | "rooftop" | "workshop" | "class" | "festival";
type TimeTag = "tonight" | "today" | "weekend";
type CelebType = "birthday" | "promotion" | "new_home" | "anniversary" | "graduation" | "new_job" | "breakup";
type CelebFilter = "All" | "Birthdays" | "Wins" | "Milestones";
type HapFilter = "All" | "Today" | "Tomorrow" | "This Week" | "Free";

interface Happening {
  id: number; type: HappeningType; title: string; venue: string;
  neighborhood: string; time: string; timeTag: TimeTag;
  price: number; priceLabel: string; womenLoved: boolean;
  featured: boolean; partner?: string; gradient: string;
}

interface MembersOnlyClub {
  id: number;
  name: string;
  crest: string;
  tagline: string;
  description: string;
  memberCount: number;
  joinType: "apply" | "free";
  tags: string[];
  coverEmojis: string[];
  accentColor: string;
}

interface ClubEvent {
  id: number;
  title: string;
  time: string;
  city: string;
  priceLabel: string;
  price: number;
  type: string;
  clubId: number;
  bg: string;
}

interface Celebration {
  id: number; celebType: CelebType; name: string; event: string;
  venue: string; time: string; month: string; day: string;
  seats: number; message: string; initial: string; avatarColor: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const HAPPENINGS: Happening[] = [
  { id: 1, type: "gallery", title: "Soft Opening: Women in Lens", venue: "The Parlor Gallery", neighborhood: "Bushwick", time: "Tonight · 7PM", timeTag: "tonight", price: 0, priceLabel: "Free", womenLoved: true, featured: true, gradient: "" },
  { id: 2, type: "workshop", title: "Wheel Throwing for Beginners", venue: "Brooklyn Clay", neighborhood: "Williamsburg", time: "Tonight · 6:30PM", timeTag: "tonight", price: 45, priceLabel: "$45", womenLoved: true, featured: false, partner: "Brooklyn Clay", gradient: "" },
  { id: 3, type: "rooftop", title: "Golden Hour at Westlight", venue: "Westlight Hotel", neighborhood: "Williamsburg", time: "Tonight · 8PM", timeTag: "tonight", price: 20, priceLabel: "$20", womenLoved: false, featured: false, gradient: "" },
  { id: 4, type: "popup", title: "Local Designers Pop-Up Market", venue: "The Canvas Space", neighborhood: "SoHo", time: "Saturday · 12–6PM", timeTag: "weekend", price: 0, priceLabel: "Free", womenLoved: true, featured: false, gradient: "" },
  { id: 5, type: "class", title: "Morning Pilates in the Park", venue: "Sheep Meadow, Central Park", neighborhood: "Midtown", time: "Today · 8AM", timeTag: "today", price: 15, priceLabel: "$15", womenLoved: true, featured: false, partner: "Form Pilates", gradient: "" },
  { id: 6, type: "festival", title: "Brooklyn Night Bazaar", venue: "Industry City", neighborhood: "Sunset Park", time: "Sat–Sun", timeTag: "weekend", price: 0, priceLabel: "Free", womenLoved: true, featured: false, gradient: "" },
  { id: 7, type: "class", title: "Bookbinding Workshop", venue: "McNally Jackson", neighborhood: "Nolita", time: "Today · 3PM", timeTag: "today", price: 30, priceLabel: "$30", womenLoved: false, featured: false, partner: "McNally Jackson", gradient: "" },
  { id: 8, type: "gallery", title: "First Friday: New Figurative Works", venue: "Tanya Bonakdar Gallery", neighborhood: "Chelsea", time: "Friday · 6PM", timeTag: "weekend", price: 0, priceLabel: "Free", womenLoved: false, featured: false, gradient: "" },
];

const CLUBS: MembersOnlyClub[] = [
  {
    id: 1, name: "Lens & Light", crest: "📸",
    tagline: "For women who see the world differently.",
    description: "A private club for women in photography, film, and visual art. Monthly darkroom nights, gallery walks, and field trips with curated intimacy — never more than 40 members.",
    memberCount: 34, joinType: "apply",
    tags: ["Photography", "Art", "Film", "Visual"],
    coverEmojis: ["🖼", "📷", "🌅", "🎞"],
    accentColor: "#D4A853",
  },
  {
    id: 2, name: "Sofra Circle", crest: "🫖",
    tagline: "West African women in finance & tech.",
    description: "A curated dinner circle for West African women building wealth. Monthly dinners, candid conversations about money, careers, and community — no corporate speak allowed.",
    memberCount: 28, joinType: "apply",
    tags: ["Finance", "Tech", "Culture", "Diaspora"],
    coverEmojis: ["🍽", "💼", "✨", "🌍"],
    accentColor: "#C4A265",
  },
  {
    id: 3, name: "The Garden Set", crest: "🌿",
    tagline: "Weekly walks. Real air. Real talk.",
    description: "We walk. We talk. No agenda, no pressure. Prospect Park every Sunday morning and occasional hikes outside the city. Free to join, just show up.",
    memberCount: 52, joinType: "free",
    tags: ["Outdoors", "Wellness", "Walking"],
    coverEmojis: ["🌸", "🌿", "☀️", "🍃"],
    accentColor: "#83C5A0",
  },
];

const CLUB_EVENTS: ClubEvent[] = [
  { id: 101, title: "Darkroom Night", time: "Fri Jun 13 · 8PM", city: "Bushwick, Brooklyn", priceLabel: "Members", price: 0, type: "gallery", clubId: 1, bg: "#0D0A08" },
  { id: 102, title: "Quarterly Dinner", time: "Sat Jun 21 · 7PM", city: "West Village, Manhattan", priceLabel: "$45 · Members", price: 45, type: "dinner", clubId: 2, bg: "#0A0808" },
  { id: 103, title: "Prospect Park Walk", time: "Sun Jun 8 · 9AM", city: "Prospect Park, Brooklyn", priceLabel: "Free", price: 0, type: "outdoor", clubId: 3, bg: "#070F08" },
];

const CONFETTI: Celebration[] = [
  { id: 1, celebType: "birthday", name: "Aaliyah", event: "Birthday", venue: "Dinner at Carbone, SoHo", time: "Saturday · 8:00PM", month: "may", day: "26", seats: 12, initial: "A", avatarColor: "#FF1F7D", message: "One more trip around the sun and she's doing it right." },
  { id: 2, celebType: "promotion", name: "Teni", event: "Promotion", venue: "Celebrating the new chapter", time: "Friday · 7:00PM", month: "may", day: "30", seats: 8, initial: "T", avatarColor: "#FF69B4", message: "She got the job she was scared to apply for." },
  { id: 3, celebType: "new_home", name: "Maya", event: "New Apartment", venue: "Housewarming & girl time", time: "Sunday · 3:00PM", month: "jun", day: "02", seats: 6, initial: "M", avatarColor: "#FF1F7D", message: "Moved to NYC alone. Now she has a city." },
];

const CELEB_FILTER_MAP: Record<CelebFilter, CelebType[]> = {
  All:        ["birthday", "promotion", "new_home", "anniversary", "graduation", "new_job", "breakup"],
  Birthdays:  ["birthday", "anniversary"],
  Wins:       ["promotion", "new_job"],
  Milestones: ["new_home", "graduation", "breakup"],
};

const CELEB_WISH_DEFAULT: Record<CelebType, string> = {
  birthday: "Happy Birthday! 🎂", promotion: "Congratulations! 🥂",
  new_home: "Welcome home! 🏠", anniversary: "Happy Anniversary! 🌸",
  graduation: "Congratulations! 🎓", new_job: "You got this! 💪",
  breakup: "Freedom looks good on you 👑",
};

// ── Unique poster designs per event type ──────────────────────────────────────

function HappeningPoster({ h, onOpen }: { h: Happening; onOpen: () => void }) {
  const [saved, setSaved] = useState(false);

  // ── GALLERY: art-deco editorial ──────────────────────────────────────────
  if (h.type === "gallery") {
    return (
      <div onClick={onOpen} className="relative rounded-2xl overflow-hidden cursor-pointer transition-transform active:scale-[0.98]"
        style={{ height: "210px", background: "#111111", boxShadow: "0 6px 28px rgba(0,0,0,0.22)" }}>
        {/* Art deco corner frames */}
        <div className="absolute top-2.5 left-2.5 w-6 h-6 pointer-events-none" style={{ borderTop: "2px solid rgba(255,215,150,0.6)", borderLeft: "2px solid rgba(255,215,150,0.6)" }} />
        <div className="absolute top-2.5 right-2.5 w-6 h-6 pointer-events-none" style={{ borderTop: "2px solid rgba(255,215,150,0.6)", borderRight: "2px solid rgba(255,215,150,0.6)" }} />
        <div className="absolute bottom-2.5 left-2.5 w-6 h-6 pointer-events-none" style={{ borderBottom: "2px solid rgba(255,215,150,0.6)", borderLeft: "2px solid rgba(255,215,150,0.6)" }} />
        <div className="absolute bottom-2.5 right-2.5 w-6 h-6 pointer-events-none" style={{ borderBottom: "2px solid rgba(255,215,150,0.6)", borderRight: "2px solid rgba(255,215,150,0.6)" }} />
        <button onClick={e => { e.stopPropagation(); setSaved(s => !s); }} className="absolute top-3.5 right-8 z-10 w-6 h-6 flex items-center justify-center">
          <svg width="11" height="11" viewBox="0 0 24 24" fill={saved ? "rgba(255,215,150,0.9)" : "none"} stroke="rgba(255,215,150,0.6)" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </button>
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "rgba(255,215,150,0.7)" }}>GALLERY OPENING{h.partner ? ` × ${h.partner}` : ""}</p>
          <div>
            <h3 className="font-black uppercase leading-none mb-2" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(18px,4.5vw,24px)", color: "white", lineHeight: 0.9, letterSpacing: "-0.01em" }}>{h.title}</h3>
            <div style={{ width: "28px", height: "1px", background: "rgba(255,215,150,0.5)", marginBottom: "8px" }} />
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>{h.time}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{h.neighborhood}</p>
              <span className="text-[10px] font-bold" style={{ color: "rgba(255,215,150,0.85)" }}>{h.priceLabel} →</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── WORKSHOP: warm craft ─────────────────────────────────────────────────
  if (h.type === "workshop" || h.type === "class") {
    return (
      <div onClick={onOpen} className="relative rounded-2xl overflow-hidden cursor-pointer transition-transform active:scale-[0.98]"
        style={{ height: "210px", background: "#FDFAF5", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        {/* Diagonal craft stripe */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position: "absolute", top: "-20px", right: "-30px", width: "120px", height: "200px", background: "rgba(255,105,180,0.08)", transform: "rotate(15deg)", borderRadius: "8px" }} />
        </div>
        <button onClick={e => { e.stopPropagation(); setSaved(s => !s); }} className="absolute top-3.5 right-3.5 z-10 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.06)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill={saved ? "#FF69B4" : "none"} stroke="#888" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </button>
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF69B4" }}>{h.type === "workshop" ? "WORKSHOP" : "CLASS"}{h.partner ? ` × ${h.partner}` : ""}</p>
          <div>
            <h3 className="font-black uppercase leading-none mb-2" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(18px,4.5vw,24px)", color: "#111", lineHeight: 0.9, letterSpacing: "-0.01em" }}>{h.title}</h3>
            <div style={{ width: "24px", height: "2px", background: "#FF69B4", marginBottom: "8px" }} />
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#888" }}>{h.time}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[9px]" style={{ color: "#bbb" }}>{h.neighborhood}</p>
              <span className="text-[10px] font-bold" style={{ color: "#111" }}>{h.priceLabel} →</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── ROOFTOP: midnight sky ────────────────────────────────────────────────
  if (h.type === "rooftop") {
    return (
      <div onClick={onOpen} className="relative rounded-2xl overflow-hidden cursor-pointer transition-transform active:scale-[0.98]"
        style={{ height: "210px", background: "linear-gradient(175deg, #0a0014 0%, #1a0025 60%, #2d0040 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}>
        {/* Stars */}
        {[{ x: "15%", y: "18%" }, { x: "72%", y: "12%" }, { x: "88%", y: "35%" }, { x: "42%", y: "8%" }, { x: "60%", y: "22%" }, { x: "28%", y: "30%" }].map((s, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{ left: s.x, top: s.y, width: i % 2 === 0 ? "2px" : "3px", height: i % 2 === 0 ? "2px" : "3px", background: "rgba(255,255,255,0.8)", boxShadow: "0 0 3px rgba(255,255,255,0.5)" }} />
        ))}
        {/* Horizon glow */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "60px", background: "linear-gradient(to top, rgba(255,31,125,0.15), transparent)" }} />
        <button onClick={e => { e.stopPropagation(); setSaved(s => !s); }} className="absolute top-3.5 right-3.5 z-10 w-6 h-6 flex items-center justify-center">
          <svg width="11" height="11" viewBox="0 0 24 24" fill={saved ? "rgba(255,105,180,0.9)" : "none"} stroke="rgba(255,105,180,0.6)" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </button>
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "rgba(255,105,180,0.7)" }}>ROOFTOP NIGHT</p>
          <div>
            <h3 className="font-black uppercase leading-none mb-2" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(18px,4.5vw,24px)", color: "white", lineHeight: 0.9, letterSpacing: "-0.01em" }}>{h.title}</h3>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>{h.time}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>{h.neighborhood}</p>
              <span className="text-[10px] font-bold" style={{ color: "rgba(255,105,180,0.85)" }}>{h.priceLabel} →</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── POPUP: bold editorial color block ────────────────────────────────────
  if (h.type === "popup") {
    return (
      <div onClick={onOpen} className="relative rounded-2xl overflow-hidden cursor-pointer transition-transform active:scale-[0.98]"
        style={{ height: "210px", background: "#FF1F7D", boxShadow: "0 6px 28px rgba(255,31,125,0.35)" }}>
        {/* Bold color block element */}
        <div className="absolute bottom-0 right-0 pointer-events-none" style={{ width: "50%", height: "55%", background: "rgba(255,255,255,0.1)", borderTopLeftRadius: "100%" }} />
        <button onClick={e => { e.stopPropagation(); setSaved(s => !s); }} className="absolute top-3.5 right-3.5 z-10 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill={saved ? "white" : "none"} stroke="white" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </button>
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "rgba(255,255,255,0.65)" }}>POP-UP{h.partner ? ` × ${h.partner}` : ""}</p>
          <div>
            <h3 className="font-black uppercase leading-none mb-2" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(18px,4.5vw,24px)", color: "white", lineHeight: 0.9, letterSpacing: "-0.01em" }}>{h.title}</h3>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.65)" }}>{h.time}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.45)" }}>{h.neighborhood}</p>
              <span className="text-[10px] font-bold text-white">{h.priceLabel} →</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── FESTIVAL: energy & movement ──────────────────────────────────────────
  return (
    <div onClick={onOpen} className="relative rounded-2xl overflow-hidden cursor-pointer transition-transform active:scale-[0.98]"
      style={{ height: "210px", background: "linear-gradient(135deg, #FF69B4 0%, #FF1F7D 60%, #C4006A 100%)", boxShadow: "0 8px 28px rgba(255,31,125,0.4)" }}>
      {/* Confetti dots */}
      {[{ x: "10%", y: "15%", s: 8, op: 0.3 }, { x: "80%", y: "20%", s: 6, op: 0.25 }, { x: "60%", y: "10%", s: 10, op: 0.2 }, { x: "25%", y: "25%", s: 7, op: 0.3 }, { x: "90%", y: "55%", s: 5, op: 0.2 }].map((d, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none" style={{ left: d.x, top: d.y, width: d.s, height: d.s, background: "white", opacity: d.op }} />
      ))}
      <button onClick={e => { e.stopPropagation(); setSaved(s => !s); }} className="absolute top-3.5 right-3.5 z-10 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill={saved ? "white" : "none"} stroke="white" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "rgba(255,255,255,0.65)" }}>FESTIVAL</p>
        <div>
          <h3 className="font-black uppercase leading-none mb-2" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(18px,4.5vw,24px)", color: "white", lineHeight: 0.9, letterSpacing: "-0.01em" }}>{h.title}</h3>
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.65)" }}>{h.time}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.45)" }}>{h.neighborhood}</p>
            <span className="text-[10px] font-bold text-white">{h.priceLabel} →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Confetti cards ────────────────────────────────────────────────────────────

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
      style={{ width: "164px", minHeight: "200px", borderRadius: "20px", border: "2px dashed #FF69B4", background: "rgba(255,105,180,0.04)" }}>
      <span style={{ fontSize: "18px", color: "#FF69B4" }}>✿</span>
      <p className="text-center font-black leading-tight px-4" style={{ fontFamily: "var(--font-playfair)", fontSize: "16px", color: "#111" }}>Plan<br />something<br />special</p>
      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#FF1F7D", boxShadow: "0 4px 12px rgba(255,31,125,0.3)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </div>
    </div>
  );
}

// ── Confetti Sheet ────────────────────────────────────────────────────────────

function ConfettiSheet({ c, accepted, onAccept, onClose }: { c: Celebration; accepted: boolean; onAccept: () => void; onClose: () => void }) {
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
                  <textarea value={wishText} onChange={e => setWishText(e.target.value)} placeholder={CELEB_WISH_DEFAULT[c.celebType]} rows={3} className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none mb-2" style={{ borderColor: "#FFE0EE", color: "#111" }} />
                  <button onClick={() => { if (wishText.trim()) setWishSent(true); }} disabled={!wishText.trim()} className="w-full py-3 rounded-xl font-bold text-sm" style={wishText.trim() ? { background: "#FFF0F5", color: "#FF1F7D" } : { background: "#F5F5F5", color: "#ccc" }}>
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
            <>
              <p className="text-[9px] font-bold tracking-[0.28em] uppercase text-center mb-4" style={{ color: "#FF1F7D" }}>YOU&apos;RE GOING ✿</p>
              <div className="rounded-2xl overflow-hidden mb-5" style={{ background: "#FDFAF5", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
                <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1.5px dashed rgba(0,0,0,0.08)" }}>
                  <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
                  <p className="text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: "#bbb" }}>ADMIT ONE</p>
                </div>
                <div className="px-5 pt-4 pb-3">
                  <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#bbb" }}>CONFETTI INVITATION</p>
                  <h2 className="font-black leading-none mb-1" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(20px,6vw,28px)", color: "#111", lineHeight: 0.9, letterSpacing: "-0.015em" }}>{c.name}&apos;s<br />{c.event}</h2>
                  <p className="text-xs mt-2" style={{ color: "#777" }}>{c.time} · {c.venue.split(",")[0]}</p>
                </div>
                <div style={{ borderTop: "1.5px dashed rgba(0,0,0,0.08)", margin: "0 20px 12px" }} />
                <div className="px-5 pb-4">
                  <div className="flex items-end gap-[1.5px] mb-1" style={{ height: "22px" }}>
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} style={{ width: i % 5 === 0 ? "3px" : "1.5px", height: `${52 + Math.sin(i * 1.8) * 28}%`, background: "#111", opacity: 0.5 + (i % 4) * 0.1, flexShrink: 0 }} />
                    ))}
                  </div>
                  <p className="text-[8px] font-mono tracking-widest" style={{ color: "#bbb" }}>{eventCode}</p>
                </div>
              </div>
              <p className="text-xs text-center mb-4 italic" style={{ fontFamily: "var(--font-instrument)", color: "#999" }}>Your ticket is saved in Plans. Show the QR at the door.</p>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3.5 rounded-2xl font-bold text-sm" style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.3)" }}>💌 Invite a Bloomie</button>
                <Link href="/member/messages" onClick={onClose} className="px-6 py-3.5 rounded-2xl font-bold text-sm inline-flex items-center" style={{ background: "#2C1A0E", color: "white" }}>Enter Plan Room →</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Add Event Sheet ───────────────────────────────────────────────────────────

const EVENT_TYPE_OPTIONS = [
  { value: "dinner",    label: "Dinner / Brunch",     emoji: "🍽" },
  { value: "gallery",   label: "Gallery / Art",        emoji: "🎨" },
  { value: "workshop",  label: "Workshop / Class",     emoji: "✂️" },
  { value: "fitness",   label: "Fitness / Wellness",   emoji: "🧘" },
  { value: "social",    label: "Social / Mixer",       emoji: "✨" },
  { value: "outdoor",   label: "Outdoor / Walk",       emoji: "🌿" },
  { value: "party",     label: "Party / Celebration",  emoji: "🎉" },
  { value: "culture",   label: "Culture / Music",      emoji: "🎵" },
];

const STOCK_COVERS = [
  { id: 1, emoji: "🌸", bg: "linear-gradient(135deg,#FFE0EE,#FFF0F5)" },
  { id: 2, emoji: "🕯", bg: "linear-gradient(135deg,#1A1008,#2D1A0A)" },
  { id: 3, emoji: "🌿", bg: "linear-gradient(135deg,#E8F5E9,#F0FFF0)" },
  { id: 4, emoji: "✨", bg: "linear-gradient(135deg,#F0E6FF,#FAF0FF)" },
  { id: 5, emoji: "🍷", bg: "linear-gradient(135deg,#2D1020,#4A1A30)" },
  { id: 6, emoji: "🎨", bg: "linear-gradient(135deg,#FFF5F8,#FFE8F0)" },
];

function AddEventSheet({ onClose }: { onClose: () => void }) {
  const [eventType, setEventType] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [paid, setPaid] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState(false);
  const [cover, setCover] = useState(1);
  const [step, setStep] = useState<"type" | "details">("type");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!title.trim()) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); }, 2200);
  }

  const selectedType = EVENT_TYPE_OPTIONS.find(t => t.value === eventType);

  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{ background: "#FDFAF5", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#FF1F7D" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h3 className="font-black text-2xl italic mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>Event submitted!</h3>
            <p className="text-sm" style={{ color: "#aaa" }}>We'll review and post it shortly.</p>
          </div>
        ) : step === "type" ? (
          <div className="px-6 pb-8">
            <div className="mb-5">
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ NEW EVENT</p>
              <h2 className="font-black text-2xl italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>What kind of event?</h2>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {EVENT_TYPE_OPTIONS.map(t => (
                <button key={t.value} onClick={() => setEventType(t.value)}
                  className="rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-[0.97]"
                  style={eventType === t.value
                    ? { background: "#111111", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }
                    : { background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <span style={{ fontSize: "20px" }}>{t.emoji}</span>
                  <span className="text-xs font-bold leading-tight"
                    style={{ color: eventType === t.value ? "white" : "#111" }}>{t.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => eventType && setStep("details")}
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
              style={eventType ? { background: "#FF1F7D", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.3)" } : { background: "#F0E8EC", color: "#C8A0B0" }}>
              Continue →
            </button>
          </div>
        ) : (
          <div className="px-6 pb-8">
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setStep("type")}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.06)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div>
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>
                  {selectedType?.emoji} {selectedType?.label}
                </p>
                <h2 className="font-black text-xl italic leading-none" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>Details</h2>
              </div>
            </div>

            {/* Cover photo */}
            <div className="mb-4">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: "rgba(0,0,0,0.4)" }}>COVER</p>
              <div className="flex gap-2">
                {STOCK_COVERS.map(c => (
                  <button key={c.id} onClick={() => setCover(c.id)}
                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: c.bg, border: cover === c.id ? "2px solid #FF1F7D" : "2px solid transparent", fontSize: "22px" }}>
                    {c.emoji}
                  </button>
                ))}
                <button className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#F5F5F5", border: "1.5px dashed #ddd" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="mb-3">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>EVENT NAME</p>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder={`e.g. "${selectedType?.label} in Brooklyn"`}
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                style={{ background: "white", border: "1.5px solid #F0E8EC", color: "#111" }} />
            </div>

            {/* Location */}
            <div className="mb-3">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>VENUE / LOCATION</p>
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Carbone, SoHo"
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                style={{ background: "white", border: "1.5px solid #F0E8EC", color: "#111" }} />
            </div>

            {/* Date + Time */}
            <div className="mb-4">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>DATE & TIME</p>
              <input value={dateTime} onChange={e => setDateTime(e.target.value)}
                placeholder="e.g. Saturday · 7PM"
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                style={{ background: "white", border: "1.5px solid #F0E8EC", color: "#111" }} />
            </div>

            {/* Paid / Free */}
            <div className="mb-3">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: "rgba(0,0,0,0.4)" }}>PRICE</p>
              <div className="flex gap-2 mb-2">
                {(["free", "paid"] as const).map(opt => (
                  <button key={opt} onClick={() => setPaid(opt)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={paid === opt ? { background: "#111111", color: "white" } : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }}>
                    {opt === "free" ? "Free" : "Paid"}
                  </button>
                ))}
              </div>
              {paid === "paid" && (
                <div className="flex gap-2 items-center">
                  <input value={price} onChange={e => setPrice(e.target.value)}
                    placeholder="e.g. $25"
                    className="flex-1 rounded-2xl px-4 py-2.5 text-sm outline-none"
                    style={{ background: "white", border: "1.5px solid #F0E8EC", color: "#111" }} />
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer" style={{ color: "#666" }}>
                    <input type="checkbox" checked={deposit} onChange={e => setDeposit(e.target.checked)} className="w-4 h-4 accent-pink-500" />
                    Deposit hold
                  </label>
                </div>
              )}
            </div>

            <button onClick={handleSubmit} disabled={!title.trim()}
              className="w-full py-4 rounded-2xl font-bold text-sm mt-2 transition-all active:scale-[0.98]"
              style={title.trim() ? { background: "#FF1F7D", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.3)" } : { background: "#F0E8EC", color: "#C8A0B0" }}>
              Submit Event →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Founding Mothers Only data ───────────────────────────────────────────────

interface FMEvent {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  venue: string;
  capacity: number;
  confirmed: number;
  type: "dinner" | "gathering" | "trip";
}

const FM_EVENTS: FMEvent[] = [
  {
    id: 901, title: "Founders' Table",
    subtitle: "Private dinner with the BloomBay founders. No agenda. Real talk.",
    date: "Sat Jun 28 · 7PM", venue: "Private Residence, Brooklyn Heights",
    capacity: 20, confirmed: 14, type: "dinner",
  },
  {
    id: 902, title: "FM Anniversary Evening",
    subtitle: "One year of building something real. For the original 100 only.",
    date: "Thu Jul 3 · 6PM", venue: "Rooftop · Location sent via Ping",
    capacity: 100, confirmed: 63, type: "gathering",
  },
];

function FoundingMothersSection({ onOpenEvent }: { onOpenEvent: (ev: FMEvent) => void }) {
  return (
    <div className="-mx-5 px-5 py-8 relative overflow-hidden" style={{ background: "#0A0804" }}>
      {/* Gold shimmer */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(212,168,83,0.14) 0%, transparent 60%)" }} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-2 relative">
        <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(212,168,83,0.45))" }} />
        <p className="text-[8px] font-bold tracking-[0.32em] uppercase whitespace-nowrap" style={{ color: "rgba(212,168,83,0.75)" }}>
          ✦ FOUNDING MOTHERS ONLY ✦
        </p>
        <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(212,168,83,0.45))" }} />
      </div>
      <p className="text-[10px] text-center italic mb-6 relative" style={{ fontFamily: "var(--font-instrument)", color: "rgba(212,168,83,0.38)" }}>
        These invitations are for the original 100. They cannot be forwarded.
      </p>

      {/* FM event cards */}
      <div className="flex flex-col gap-3 relative">
        {FM_EVENTS.map(ev => (
          <button key={ev.id} onClick={() => onOpenEvent(ev)}
            className="w-full text-left rounded-2xl overflow-hidden transition-all active:scale-[0.98]"
            style={{ background: "#161008", border: "1px solid rgba(212,168,83,0.18)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
            <div className="relative px-4 pt-4 pb-3">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 85% 15%, rgba(212,168,83,0.1) 0%, transparent 55%)" }} />
              <div className="flex items-start justify-between gap-3 relative">
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: "rgba(212,168,83,0.55)" }}>
                    {ev.type === "dinner" ? "PRIVATE DINNER" : ev.type === "trip" ? "TRIP" : "GATHERING"}
                  </p>
                  <h3 className="font-black text-base leading-tight mb-1"
                    style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,238,220,0.92)" }}>
                    {ev.title}
                  </h3>
                  <p className="text-[10px] leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.38)" }}>{ev.subtitle}</p>
                  <p className="text-[10px] font-semibold" style={{ color: "rgba(212,168,83,0.6)" }}>{ev.date}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{ev.venue}</p>
                </div>
                <div className="flex-shrink-0 text-center">
                  <p className="text-xl font-black leading-none" style={{ color: "rgba(212,168,83,0.8)", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                    {ev.confirmed}
                  </p>
                  <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.22)" }}>of {ev.capacity}<br />confirmed</p>
                </div>
              </div>
            </div>
            <div className="px-4 py-2.5 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(212,168,83,0.1)", background: "rgba(0,0,0,0.2)" }}>
              <p className="text-[9px] font-bold tracking-[0.12em]" style={{ color: "rgba(212,168,83,0.5)" }}>
                ✦ FOUNDING MOTHER INVITATION
              </p>
              <p className="text-[9px] font-bold" style={{ color: "rgba(212,168,83,0.7)" }}>Accept →</p>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom seal */}
      <div className="flex items-center gap-3 mt-6 relative">
        <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(212,168,83,0.25))" }} />
        <p className="text-[7px] font-bold tracking-[0.3em] uppercase" style={{ color: "rgba(212,168,83,0.28)" }}>END OF FM BOARD</p>
        <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(212,168,83,0.25))" }} />
      </div>
    </div>
  );
}

// ── FM Event Accept Sheet ─────────────────────────────────────────────────────

function FMEventSheet({ ev, onClose }: { ev: FMEvent; onClose: () => void }) {
  const [accepted, setAccepted] = useState(false);
  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-y-auto"
        style={{ background: "#0F0C06", maxHeight: "88vh", boxShadow: "0 -8px 40px rgba(0,0,0,0.6)", border: "1px solid rgba(212,168,83,0.15)" }}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(212,168,83,0.2)" }} />
        </div>
        <div className="px-5 pb-10 pt-3">
          <p className="text-[9px] font-bold tracking-[0.28em] uppercase text-center mb-4" style={{ color: "rgba(212,168,83,0.6)" }}>
            ✦ FOUNDING MOTHER INVITATION ✦
          </p>

          {!accepted ? (
            <>
              <h2 className="font-black text-2xl leading-tight mb-1 text-center"
                style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,238,220,0.92)" }}>
                {ev.title}
              </h2>
              <p className="text-sm italic text-center mb-6" style={{ fontFamily: "var(--font-instrument)", color: "rgba(212,168,83,0.55)" }}>
                {ev.subtitle}
              </p>

              <div className="flex flex-col gap-2.5 mb-6">
                {[
                  { label: "WHEN", value: ev.date },
                  { label: "WHERE", value: ev.venue },
                  { label: "ATTENDING", value: `${ev.confirmed} of ${ev.capacity} Founding Mothers confirmed` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,168,83,0.12)" }}>
                    <p className="text-[8px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(212,168,83,0.4)" }}>{label}</p>
                    <p className="text-sm font-semibold" style={{ color: "rgba(255,238,220,0.8)" }}>{value}</p>
                  </div>
                ))}
              </div>

              <button onClick={() => setAccepted(true)}
                className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] mb-3"
                style={{ background: "linear-gradient(135deg, #D4A853 0%, #B8862A 100%)", color: "#0A0804", boxShadow: "0 4px 20px rgba(212,168,83,0.3)" }}>
                ✦ Accept this invitation
              </button>
              <button onClick={onClose}
                className="w-full py-3 rounded-2xl font-semibold text-sm"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>
                Maybe later
              </button>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(212,168,83,0.15)", border: "2px solid rgba(212,168,83,0.4)" }}>
                <span style={{ fontSize: "28px", color: "#D4A853" }}>✦</span>
              </div>
              <h3 className="font-black text-xl italic mb-2"
                style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,238,220,0.9)" }}>
                You&apos;re confirmed.
              </h3>
              <p className="text-sm italic mb-6" style={{ fontFamily: "var(--font-instrument)", color: "rgba(212,168,83,0.55)" }}>
                Details will be sent to your mailbox closer to the date.
              </p>
              <button onClick={onClose}
                className="w-full py-3.5 rounded-2xl font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #D4A853 0%, #B8862A 100%)", color: "#0A0804" }}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Members Only card (horizontal scroll) ────────────────────────────────────

function MembersOnlyCard({ ev, onPress }: { ev: ClubEvent; onPress: () => void }) {
  const club = CLUBS.find(c => c.id === ev.clubId)!;
  return (
    <button onClick={onPress}
      className="flex-shrink-0 rounded-2xl overflow-hidden relative active:scale-[0.96] transition-transform text-left"
      style={{ width: "152px", background: ev.bg, boxShadow: "0 4px 20px rgba(0,0,0,0.45)" }}>
      {/* Club crest */}
      <div className="flex items-center justify-center relative" style={{ height: "92px" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 50%, ${club.accentColor}18 0%, transparent 65%)` }} />
        <span style={{ fontSize: "36px" }}>{club.crest}</span>
        <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span className="text-[7px] font-bold tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.55)" }}>MEMBERS</span>
        </div>
      </div>
      <div className="px-3 pb-3.5 pt-1.5">
        <p className="text-[8px] font-bold tracking-[0.14em] uppercase mb-0.5 truncate"
          style={{ color: club.accentColor }}>{club.name}</p>
        <p className="text-[11px] font-bold leading-tight text-white truncate">{ev.title}</p>
        <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
          {ev.city.split(",")[0]}
        </p>
        <p className="text-[9px] mt-1 font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>{ev.time}</p>
      </div>
    </button>
  );
}

// ── Club Landing Sheet ────────────────────────────────────────────────────────

function ClubLandingSheet({ club, applied, onApply, onClose }: {
  club: MembersOnlyClub; applied: boolean; onApply: () => void; onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-y-auto"
        style={{ background: "#FDFAF5", maxHeight: "90vh", boxShadow: "0 -8px 40px rgba(0,0,0,0.3)" }}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>

        {/* Cover */}
        <div className="relative mx-5 mb-4 rounded-3xl overflow-hidden flex items-center justify-center"
          style={{ height: "180px", background: "#111111" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at 60% 40%, ${club.accentColor}28 0%, transparent 65%)` }} />
          <span style={{ fontSize: "68px" }}>{club.crest}</span>
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4"
            style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.65))" }}>
            <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: club.accentColor }}>PRIVATE CLUB</p>
          </div>
        </div>

        <div className="px-5 pb-10">
          <h2 className="font-black text-2xl leading-none mb-1" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>
            {club.name}
          </h2>
          <p className="text-sm italic mb-5" style={{ fontFamily: "var(--font-instrument)", color: "#888" }}>{club.tagline}</p>

          {/* Stats */}
          <div className="flex gap-6 mb-5">
            <div>
              <p className="text-2xl font-black" style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>{club.memberCount}</p>
              <p className="text-[10px]" style={{ color: "#bbb" }}>Members</p>
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                {club.joinType === "apply" ? "App." : "Open"}
              </p>
              <p className="text-[10px]" style={{ color: "#bbb" }}>Entry</p>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ color: "#555" }}>{club.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {club.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "#FFF0F5", color: "#FF1F7D" }}>{tag}</span>
            ))}
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {club.coverEmojis.map((emoji, i) => (
              <div key={i} className="rounded-xl flex items-center justify-center aspect-square"
                style={{ background: "#F5F0F2", fontSize: "26px" }}>{emoji}</div>
            ))}
          </div>

          {/* CTA */}
          {applied ? (
            <div className="w-full py-4 rounded-2xl text-center font-bold text-sm"
              style={{ background: "#F5F5F5", color: "#999" }}>
              ⏳ Application Pending
            </div>
          ) : club.joinType === "apply" ? (
            <button onClick={onApply}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all active:scale-[0.98]"
              style={{ background: "#FF1F7D", boxShadow: "0 4px 16px rgba(255,31,125,0.3)" }}>
              Apply to Join →
            </button>
          ) : (
            <button onClick={onApply}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all active:scale-[0.98]"
              style={{ background: "#111111" }}>
              Join {club.name} →
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ── Members Only Event Page ───────────────────────────────────────────────────

function MembersOnlyEventPage({ ev, appliedClubs, onApplyClub, onBack }: {
  ev: ClubEvent; appliedClubs: Set<number>; onApplyClub: (clubId: number) => void; onBack: () => void;
}) {
  const [showClubSheet, setShowClubSheet] = useState(false);
  const club = CLUBS.find(c => c.id === ev.clubId)!;
  const isApplied = appliedClubs.has(club.id);

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0D0810" }}>

      {/* Club banner — tappable */}
      <div className="relative w-full flex items-center justify-center"
        style={{ height: "260px", background: ev.bg, cursor: "pointer" }}
        onClick={() => setShowClubSheet(true)}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 50%, ${club.accentColor}20 0%, transparent 65%)` }} />
        <span style={{ fontSize: "80px" }}>{club.crest}</span>

        {/* Back */}
        <button onClick={e => { e.stopPropagation(); onBack(); }}
          className="absolute flex items-center justify-center rounded-full"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 60px)", left: "20px", width: "36px", height: "36px", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Tap hint */}
        <div className="absolute top-4 right-4">
          <div className="px-2.5 py-1 rounded-full text-[8px] font-bold tracking-[0.1em]"
            style={{ background: `${club.accentColor}20`, color: club.accentColor, border: `1px solid ${club.accentColor}40` }}>
            TAP TO EXPLORE CLUB
          </div>
        </div>

        {/* Lock pill bottom */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span className="text-[10px] font-bold tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.65)" }}>MEMBERS ONLY</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-5 pt-6">
        <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: club.accentColor }}>
          {club.name} · PRIVATE EVENT
        </p>
        <h1 className="font-black leading-none mb-5"
          style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px,7vw,40px)", color: "rgba(255,238,220,0.92)", lineHeight: 0.92, letterSpacing: "-0.02em" }}>
          {ev.title}
        </h1>

        <div className="flex flex-col gap-3 mb-5">
          {/* When */}
          <div className="rounded-2xl p-4" style={{ background: "#1A1218" }}>
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.28)" }}>WHEN</p>
            <p className="text-base font-bold" style={{ color: "rgba(255,238,220,0.9)" }}>{ev.time}</p>
          </div>

          {/* Where — restricted */}
          <div className="rounded-2xl p-4" style={{ background: "#1A1218" }}>
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.28)" }}>WHERE</p>
            <p className="text-base font-bold mb-2" style={{ color: "rgba(255,238,220,0.9)" }}>{ev.city}</p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.22)" }}>Full address visible to club members only</p>
            </div>
          </div>

          {/* Price */}
          <div className="rounded-2xl p-4" style={{ background: "#1A1218" }}>
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.28)" }}>PRICE</p>
            <p className="text-base font-bold" style={{ color: ev.price === 0 ? "#83C5A0" : "#FF69B4" }}>{ev.priceLabel}</p>
          </div>
        </div>

        {/* Club card */}
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.22)" }}>HOSTED BY</p>
        <button onClick={() => setShowClubSheet(true)}
          className="w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-all active:scale-[0.98] mb-5"
          style={{ background: "#1A1218", border: `1px solid ${club.accentColor}25` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${club.accentColor}14`, border: `1.5px solid ${club.accentColor}30`, fontSize: "26px" }}>
            {club.crest}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ color: "rgba(255,238,220,0.9)" }}>{club.name}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {club.memberCount} members · {club.joinType === "apply" ? "Application required" : "Open to join"}
            </p>
            <p className="text-[10px] mt-1 italic" style={{ fontFamily: "var(--font-instrument)", color: club.accentColor }}>{club.tagline}</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={club.accentColor} strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        {/* CTA */}
        {isApplied ? (
          <div className="w-full py-4 rounded-2xl text-center font-bold text-sm"
            style={{ background: "#1A1218", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.07)" }}>
            ⏳ Application Pending
          </div>
        ) : club.joinType === "apply" ? (
          <button onClick={() => setShowClubSheet(true)}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all active:scale-[0.98]"
            style={{ background: "#FF1F7D", boxShadow: "0 4px 16px rgba(255,31,125,0.35)" }}>
            Apply to Join {club.name} →
          </button>
        ) : (
          <button onClick={() => setShowClubSheet(true)}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all active:scale-[0.98]"
            style={{ background: "#111111" }}>
            Join {club.name} →
          </button>
        )}
      </div>

      {showClubSheet && (
        <ClubLandingSheet
          club={club}
          applied={isApplied}
          onApply={() => { onApplyClub(club.id); }}
          onClose={() => setShowClubSheet(false)}
        />
      )}
    </div>
  );
}

// ── New section data ─────────────────────────────────────────────────────────

const PINK_DAYS = [
  { id: 1, title: "First Friday",        sub: "5 museums · Free admission",  date: "Fri Jun 6",  emoji: "🌸", accent: "#FF1F7D" },
  { id: 2, title: "Sunday Soft Pilates", sub: "Prospect Park · No signup",   date: "Sun Jun 8",  emoji: "🧘", accent: "#FF69B4" },
  { id: 3, title: "Chelsea Gallery Walk",sub: "5 galleries · Curated picks", date: "Sat Jun 14", emoji: "🎨", accent: "#C51B7A" },
  { id: 4, title: "Film Night · IFC",    sub: "Complimentary screening",     date: "Wed Jun 11", emoji: "🎬", accent: "#FF1F7D" },
];

interface GatheringItem {
  id: number; title: string; venue: string; time: string; women: number; host: string; color: string;
}
const GATHERINGS_DATA: GatheringItem[] = [
  { id: 1, title: "Coffee Morning",  venue: "Blue Bottle, DUMBO",         time: "Sat · 10AM", women: 6,  host: "Sofia",  color: "#FF69B4" },
  { id: 2, title: "Park Picnic",     venue: "Sheep Meadow, Central Park", time: "Sun · 1PM",  women: 12, host: "Nadia",  color: "#83C5A0" },
  { id: 3, title: "Book Swap",       venue: "McNally Jackson Café",        time: "Sat · 3PM",  women: 8,  host: "Zeynep", color: "#FF1F7D" },
  { id: 4, title: "Morning Walk",    venue: "Prospect Park",               time: "Sat · 7AM",  women: 5,  host: "Amara",  color: "#C084FC" },
];

interface TableItem {
  id: number; title: string; venue: string; time: string; seats: number; total: number; price: string;
}
const TABLES_DATA: TableItem[] = [
  { id: 1, title: "Long Table Dinner", venue: "Carbone, SoHo",         time: "Sat 8PM",  seats: 2, total: 8,  price: "$65" },
  { id: 2, title: "Sunday Brunch",     venue: "Jack's Wife Freda",     time: "Sun 11AM", seats: 3, total: 6,  price: "$35" },
  { id: 3, title: "Jazz & Dinner",     venue: "Minton's, Harlem",      time: "Fri 9PM",  seats: 1, total: 4,  price: "$45" },
  { id: 4, title: "Farm Table Lunch",  venue: "Via Carota, W Village", time: "Sun 12PM", seats: 4, total: 10, price: "$28" },
];

interface OpenSeatItem {
  id: number; title: string; venue: string; seats: number; time: string; type: string; price: string;
}
const OPEN_SEATS_DATA: OpenSeatItem[] = [
  { id: 1, title: "Book Society",   venue: "McNally Jackson", seats: 2, time: "Thu · 7PM", type: "Club",     price: "Free"    },
  { id: 2, title: "Darkroom Night", venue: "Bushwick Studio", seats: 1, time: "Fri · 8PM", type: "Workshop", price: "Members" },
  { id: 3, title: "Girls Dinner",   venue: "Carbone, SoHo",  seats: 3, time: "Sat · 8PM", type: "Dinner",   price: "$65"     },
  { id: 4, title: "Rooftop Mixer",  venue: "Westlight Hotel", seats: 5, time: "Sat · 9PM", type: "Social",   price: "$25"     },
];

// ── Section row wrapper ────────────────────────────────────────────────────────

function SectionRow({ label, sub, accent = "#FF1F7D", dark = false, children }: {
  label: string; sub?: string; accent?: string; dark?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="mb-5" style={dark ? { background: "#0A0804", paddingTop: "20px", paddingBottom: "20px" } : {}}>
      <div className="flex items-center justify-between px-5 mb-3">
        <div>
          <p className="text-[9px] font-bold tracking-[0.26em] uppercase" style={{ color: accent }}>{label}</p>
          {sub && <p className="text-[10px] mt-0.5 italic" style={{ fontFamily: "var(--font-instrument)", color: dark ? "rgba(255,255,255,0.28)" : "#bbb" }}>{sub}</p>}
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ paddingLeft: "20px", paddingRight: "20px", scrollbarWidth: "none" }}>
        {children}
      </div>
    </div>
  );
}

// ── Pink Day Card ─────────────────────────────────────────────────────────────

function PinkDayCard({ item }: { item: typeof PINK_DAYS[0] }) {
  return (
    <div className="flex-shrink-0 rounded-2xl transition-transform active:scale-[0.97]"
      style={{ width: "148px", background: `${item.accent}10`, border: `1.5px solid ${item.accent}28`, padding: "14px 12px" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${item.accent}18` }}>
        <span style={{ fontSize: "22px" }}>{item.emoji}</span>
      </div>
      <p className="font-black text-[13px] leading-tight mb-1" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{item.title}</p>
      <p className="text-[9px] mb-2" style={{ color: "#999" }}>{item.sub}</p>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#FF1F7D" }} />
        <p className="text-[9px] font-bold" style={{ color: "#FF1F7D" }}>FREE · {item.date}</p>
      </div>
    </div>
  );
}

// ── Gathering Card ────────────────────────────────────────────────────────────

function GatheringCard({ g }: { g: GatheringItem }) {
  return (
    <div className="flex-shrink-0 rounded-2xl transition-transform active:scale-[0.97]"
      style={{ width: "152px", background: "white", boxShadow: "0 3px 14px rgba(0,0,0,0.07)", padding: "14px" }}>
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white mb-3"
        style={{ background: g.color }}>{g.host[0]}</div>
      <p className="font-black text-[13px] leading-tight mb-0.5" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{g.title}</p>
      <p className="text-[9px] mb-0.5" style={{ color: "#aaa" }}>{g.venue}</p>
      <p className="text-[9px] font-semibold mb-2" style={{ color: "#888" }}>{g.time}</p>
      <div className="flex items-center gap-1.5">
        <div className="flex">
          {Array.from({ length: Math.min(3, g.women) }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full"
              style={{ background: g.color, border: "1.5px solid white", marginLeft: i > 0 ? "-3px" : "0", opacity: 0.85 - i * 0.15 }} />
          ))}
        </div>
        <span className="text-[9px]" style={{ color: "#bbb" }}>{g.women} going</span>
      </div>
    </div>
  );
}

// ── Table Card ────────────────────────────────────────────────────────────────

function TableCard({ t }: { t: TableItem }) {
  const filled = t.total - t.seats;
  return (
    <div className="flex-shrink-0 rounded-2xl transition-transform active:scale-[0.97]"
      style={{ width: "152px", background: "#FDFAF5", boxShadow: "0 3px 14px rgba(0,0,0,0.08)", padding: "14px" }}>
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontSize: "22px" }}>🍽</span>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#FF1F7D", color: "white" }}>{t.seats} left</span>
      </div>
      <p className="font-black text-[13px] leading-tight mb-0.5" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{t.title}</p>
      <p className="text-[9px] mb-0.5" style={{ color: "#aaa" }}>{t.venue}</p>
      <p className="text-[9px] font-semibold mb-3" style={{ color: "#888" }}>{t.time}</p>
      <div className="h-1 rounded-full mb-1.5" style={{ background: "#F0E8EC" }}>
        <div className="h-1 rounded-full" style={{ width: `${(filled / t.total) * 100}%`, background: "#FF1F7D" }} />
      </div>
      <p className="text-[9px] font-bold" style={{ color: "#FF1F7D" }}>{t.price} · Join table →</p>
    </div>
  );
}

// ── Open Seat Card ────────────────────────────────────────────────────────────

function OpenSeatCard({ item }: { item: OpenSeatItem }) {
  return (
    <div className="flex-shrink-0 rounded-2xl transition-transform active:scale-[0.97]"
      style={{ width: "152px", background: "white", boxShadow: "0 3px 14px rgba(0,0,0,0.07)", padding: "14px" }}>
      <div className="mb-3">
        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>{item.type}</span>
      </div>
      <p className="font-black text-[13px] leading-tight mb-0.5" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{item.title}</p>
      <p className="text-[9px] mb-0.5" style={{ color: "#aaa" }}>{item.venue}</p>
      <p className="text-[9px] font-semibold mb-3" style={{ color: "#888" }}>{item.time}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <span className="text-[9px] font-bold" style={{ color: "#FF1F7D" }}>{item.seats} open</span>
        </div>
        <span className="text-[9px] font-bold" style={{ color: "#111" }}>{item.price} →</span>
      </div>
    </div>
  );
}

// ── Main HappeningsPage ───────────────────────────────────────────────────────

export function HappeningsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Happening | null>(null);
  const [selectedClubEvent, setSelectedClubEvent] = useState<ClubEvent | null>(null);
  const [selectedCeleb, setSelectedCeleb] = useState<Celebration | null>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [acceptedCelebs, setAcceptedCelebs] = useState<Set<number>>(new Set());
  const [celebFilter, setCelebFilter] = useState<CelebFilter>("All");
  const [hapFilter, setHapFilter] = useState<HapFilter>("All");
  const [appliedClubs, setAppliedClubs] = useState<Set<number>>(new Set());
  const [selectedFMEvent, setSelectedFMEvent] = useState<FMEvent | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredConfetti = CONFETTI.filter(c => CELEB_FILTER_MAP[celebFilter].includes(c.celebType));
  const filteredHap = HAPPENINGS.filter(h => {
    if (hapFilter === "Today")      return h.timeTag === "today" || h.timeTag === "tonight";
    if (hapFilter === "Tomorrow")   return h.timeTag === "weekend";
    if (hapFilter === "This Week")  return true;
    if (hapFilter === "Free")       return h.price === 0;
    return true;
  });

  if (selectedEvent) {
    const eventData: EventData = {
      id: selectedEvent.id, type: selectedEvent.type, title: selectedEvent.title,
      venue: selectedEvent.venue, neighborhood: selectedEvent.neighborhood,
      time: selectedEvent.time, priceLabel: selectedEvent.priceLabel,
      price: selectedEvent.price, partner: selectedEvent.partner,
      womenLoved: selectedEvent.womenLoved,
    };
    return <EventDetail event={eventData} onBack={() => setSelectedEvent(null)} />;
  }

  if (selectedClubEvent) {
    return (
      <MembersOnlyEventPage
        ev={selectedClubEvent}
        appliedClubs={appliedClubs}
        onApplyClub={id => setAppliedClubs(p => new Set([...p, id]))}
        onBack={() => setSelectedClubEvent(null)}
      />
    );
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: "#FDFAF5" }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-3 md:px-10 md:pt-8">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ NYC · HAPPENINGS</p>
        <h1 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(34px,6vw,48px)", color: "#111", lineHeight: 0.92, letterSpacing: "-0.02em" }}>
          What&apos;s<br />happening.
        </h1>
        <p className="text-sm italic mt-1" style={{ fontFamily: "var(--font-instrument)", color: "#999" }}>Tonight and beyond.</p>
      </div>

      {/* Collapsible filter */}
      <div className="px-5 pb-5">
        <button
          onClick={() => setFilterOpen(f => !f)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
          style={hapFilter !== "All"
            ? { background: "#FF1F7D", color: "white", border: "1.5px solid #FF1F7D" }
            : { background: "white", color: "#666", border: "1.5px solid #E8E8E8", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
          </svg>
          {hapFilter === "All" ? "Filter" : hapFilter}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: filterOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {filterOpen && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {(["All", "Today", "Tomorrow", "This Week", "Free"] as HapFilter[]).map(f => (
              <button key={f} onClick={() => { setHapFilter(f); setFilterOpen(false); }}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
                style={hapFilter === f
                  ? { background: "#FF1F7D", color: "white" }
                  : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }}>
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── MEMBERS ONLY — top, personalized, only clubs you're in ── */}
      <SectionRow label="MEMBERS ONLY" sub="Your clubs · Only you see this" accent="rgba(0,0,0,0.45)">
        {CLUB_EVENTS.map(ev => (
          <MembersOnlyCard key={ev.id} ev={ev} onPress={() => setSelectedClubEvent(ev)} />
        ))}
      </SectionRow>

      <div style={{ height: "1px", background: "rgba(0,0,0,0.05)", margin: "0 20px 20px" }} />

      {/* ── BLOOM EVENTS ── */}
      <SectionRow label="✦ BLOOM EVENTS" sub="Open to all members">
        {filteredHap.map(h => (
          <div key={h.id} className="flex-shrink-0" style={{ width: "200px" }}>
            <HappeningPoster h={h} onOpen={() => setSelectedEvent(h)} />
          </div>
        ))}
        {filteredHap.length === 0 && (
          <div className="flex-shrink-0 rounded-2xl flex items-center justify-center"
            style={{ width: "200px", height: "210px", background: "white", border: "1.5px dashed #F0E8EC" }}>
            <p className="text-sm italic px-4 text-center" style={{ fontFamily: "var(--font-instrument)", color: "#ccc" }}>Nothing for this filter.</p>
          </div>
        )}
      </SectionRow>

      {/* ── PINK DAYS — free days for all members ── */}
      <SectionRow label="PINK DAYS 🌸" sub="Free days · All members" accent="#FF69B4">
        {PINK_DAYS.map(item => <PinkDayCard key={item.id} item={item} />)}
      </SectionRow>

      {/* ── GATHERINGS ── */}
      <SectionRow label="GATHERINGS" sub="Women making plans">
        {GATHERINGS_DATA.map(g => <GatheringCard key={g.id} g={g} />)}
      </SectionRow>

      {/* ── CONFETTI — celebrations ── */}
      <SectionRow label="CONFETTI ✿" sub="We show up for our girls">
        {filteredConfetti.map(c => <ConfettiCard key={c.id} c={c} onOpen={() => setSelectedCeleb(c)} />)}
        <PlanSomethingCard />
      </SectionRow>

      {/* ── TABLES — open seats at dinner tables ── */}
      <SectionRow label="TABLES" sub="Open seats at dinner tables" accent="#D4A853">
        {TABLES_DATA.map(t => <TableCard key={t.id} t={t} />)}
      </SectionRow>

      {/* ── OPEN SEATS ── */}
      <SectionRow label="OPEN SEATS" sub="Join something happening now">
        {OPEN_SEATS_DATA.map(item => <OpenSeatCard key={item.id} item={item} />)}
      </SectionRow>

      {/* ── FOUNDING MOTHERS ONLY ── */}
      <FoundingMothersSection onOpenEvent={ev => setSelectedFMEvent(ev)} />

      {selectedFMEvent && <FMEventSheet ev={selectedFMEvent} onClose={() => setSelectedFMEvent(null)} />}

      {selectedCeleb && (
        <ConfettiSheet
          c={selectedCeleb}
          accepted={acceptedCelebs.has(selectedCeleb.id)}
          onAccept={() => setAcceptedCelebs(p => new Set([...p, selectedCeleb.id]))}
          onClose={() => setSelectedCeleb(null)}
        />
      )}

      {showAddSheet && <AddEventSheet onClose={() => setShowAddSheet(false)} />}

      {/* Floating + create button */}
      <button
        onClick={() => setShowAddSheet(true)}
        className="fixed z-30 flex items-center justify-center transition-all active:scale-90"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 96px)",
          right: "20px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "#FF1F7D",
          boxShadow: "0 4px 20px rgba(255,31,125,0.5), 0 2px 8px rgba(0,0,0,0.15)",
        }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
  );
}
