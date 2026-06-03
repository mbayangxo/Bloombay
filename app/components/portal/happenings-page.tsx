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
type HapFilter = "All" | "Tonight" | "This Week" | "Coming Up" | "Free";

interface Happening {
  id: number; type: HappeningType; title: string; venue: string;
  neighborhood: string; time: string; timeTag: TimeTag;
  price: number; priceLabel: string; womenLoved: boolean;
  featured: boolean; partner?: string; gradient: string;
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

// ── Main HappeningsPage ───────────────────────────────────────────────────────

export function HappeningsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Happening | null>(null);
  const [selectedCeleb, setSelectedCeleb] = useState<Celebration | null>(null);
  const [acceptedCelebs, setAcceptedCelebs] = useState<Set<number>>(new Set());
  const [celebFilter, setCelebFilter] = useState<CelebFilter>("All");
  const [hapFilter, setHapFilter] = useState<HapFilter>("All");

  const filteredConfetti = CONFETTI.filter(c => CELEB_FILTER_MAP[celebFilter].includes(c.celebType));
  const filteredHap = HAPPENINGS.filter(h => {
    if (hapFilter === "Tonight") return h.timeTag === "tonight";
    if (hapFilter === "This Week") return h.timeTag === "today";
    if (hapFilter === "Coming Up") return h.timeTag === "weekend";
    if (hapFilter === "Free") return h.price === 0;
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

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-4 md:px-10 md:pt-8">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>✦ NYC · HAPPENINGS</p>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h1 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(34px,6vw,48px)", color: "#111", lineHeight: 0.92, letterSpacing: "-0.02em" }}>
              What&apos;s<br />happening.
            </h1>
            <p className="text-sm italic mt-1" style={{ fontFamily: "var(--font-instrument)", color: "#999" }}>Tonight and beyond.</p>
          </div>
          <button className="px-4 py-2 rounded-full text-xs font-bold text-white" style={{ background: "#111" }}>+ Add</button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 md:mx-0 md:px-0">
          {(["All", "Tonight", "This Week", "Coming Up", "Free"] as HapFilter[]).map(f => (
            <button key={f} onClick={() => setHapFilter(f)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
              style={hapFilter === f ? { background: "#FF1F7D", color: "white" } : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 md:px-10 flex flex-col gap-10">

        {/* Desktop: 2-col layout — posters left, confetti/sidebar right */}
        <div className="md:grid md:grid-cols-[1fr_320px] md:gap-8">

          {/* Event posters grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            {filteredHap.map(h => (
              <HappeningPoster key={h.id} h={h} onOpen={() => setSelectedEvent(h)} />
            ))}
            {filteredHap.length === 0 && (
              <div className="col-span-2 rounded-3xl p-12 text-center" style={{ background: "var(--pale-pink-bg)", border: "1px solid rgba(255,31,125,0.1)" }}>
                <p className="text-sm italic" style={{ fontFamily: "var(--font-instrument)", color: "#bbb" }}>Nothing here right now. Try a different filter.</p>
              </div>
            )}
          </div>

          {/* Desktop sidebar: Confetti + stats */}
          <div className="hidden md:flex flex-col gap-4 pt-0 sticky top-8">
            <div style={{ borderRadius: "16px", overflow: "hidden", background: "#111" }}>
              <div className="p-4">
                <p className="text-[9px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color: "#FF1F7D" }}>CONFETTI ✿</p>
                <p className="font-black leading-none mb-1" style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: "white" }}>
                  We show up<br />for our girls.
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-3 px-4" style={{ scrollbarWidth: "none" }}>
                {CONFETTI.map(c => <ConfettiCard key={c.id} c={c} onOpen={() => setSelectedCeleb(c)} />)}
              </div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: "#FFF0F5" }}>
              <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "#FF1F7D" }}>TONIGHT IN NYC</p>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>
                {filteredHap.filter(h => h.timeTag === "tonight").length}
              </p>
              <p className="text-xs" style={{ color: "#aaa" }}>happenings tonight</p>
            </div>
          </div>

        </div>

        {/* ── CONFETTI ── */}
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[9px] font-bold tracking-[0.28em] uppercase mb-1" style={{ color: "#FF1F7D" }}>CONFETTI ✿</p>
              <h2 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(20px,4vw,26px)", color: "#111", lineHeight: 0.95, letterSpacing: "-0.015em" }}>
                We show up<br />for our girls.
              </h2>
            </div>
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
            {filteredConfetti.map(c => <ConfettiCard key={c.id} c={c} onOpen={() => setSelectedCeleb(c)} />)}
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
