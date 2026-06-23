"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

const PINK  = "#FF1F7D";
const PLUM  = "#1A0A2E";
const IVORY = "#fdf4ec";
const INK   = "#111111";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "available" | "looking";

interface Listing {
  id: number;
  type: "room" | "apartment" | "roommate-wanted";
  city: string;
  neighborhood: string;
  price: number;
  availableFrom: string;
  availableTo?: string;
  furnished: boolean;
  bathroom: "private" | "shared";
  pets: boolean;
  smoking: boolean;
  weed: boolean;
  halalKitchen: boolean;
  description: string;
  poster: { initial: string; color: string; name: string; showProfile: boolean; clubs?: string[] };
  compatibility: number;
  yandeNote: string;
  ageRange?: string;
  lifestyleTags?: string[];
  personalityType?: string;
  cleanlinessLevel?: string;
  noiseLevel?: string;
  drinking?: string;
  momStatus?: string;
  wantsKids?: string;
  religion?: string;
  religionLevel?: string;
  moveInTimeline?: string;
  guestFrequency?: string;
  kitchenUse?: string;
  tempPreference?: string;
  dealbreakerTags?: string[];
  interests?: string[];
  dealBreakers?: string;
  voiceNoteUrl?: string;
  videoIntroUrl?: string;
}

interface Seeker {
  id: number;
  initial: string;
  color: string;
  name: string;
  city: string;
  neighborhood: string;
  budget: number;
  moveIn: string;
  type: "room" | "apartment" | "co-search";
  showProfile: boolean;
  clubs?: string[];
  note: string;
  compatibility: number;
  yandeNote: string;
  ageRange?: string;
  lifestyleTags?: string[];
  personalityType?: string;
  cleanlinessLevel?: string;
  noiseLevel?: string;
  drinking?: string;
  momStatus?: string;
  wantsKids?: string;
  religion?: string;
  religionLevel?: string;
  moveInTimeline?: string;
  guestFrequency?: string;
  kitchenUse?: string;
  tempPreference?: string;
  dealbreakerTags?: string[];
  interests?: string[];
  dealBreakers?: string;
  voiceNoteUrl?: string;
  videoIntroUrl?: string;
}

// ── Demo data ─────────────────────────────────────────────────────────────────

const LISTINGS: Listing[] = [
  {
    id: 1, type: "room",
    city: "New York City", neighborhood: "Williamsburg",
    price: 1450, availableFrom: "Aug 1", availableTo: "Nov 30",
    furnished: true, bathroom: "private", pets: false, smoking: false, weed: false, halalKitchen: false,
    description: "Sunny room in a 3BR with two other creatives. Great light, walk to the L. Looking for someone quiet, tidy, no smoking.",
    poster: { initial: "A", color: "#FF1F7D", name: "Amara D.", showProfile: true, clubs: ["Book Girls", "Museum Girls"] },
    compatibility: 91,
    yandeNote: "You and Amara are both in Book Girls and have saved 4 of the same cafés. She saves quiet, non-smoking spaces almost exclusively.",
  },
  {
    id: 2, type: "apartment",
    city: "New York City", neighborhood: "Crown Heights",
    price: 2800, availableFrom: "Sep 1", availableTo: "Dec 31",
    furnished: false, bathroom: "private", pets: true, smoking: false, weed: false, halalKitchen: false,
    description: "Full 1BR sublet while I'm traveling for work. Great block, laundry in building. Cat-friendly. No smoking.",
    poster: { initial: "F", color: "#C084FC", name: "Fatima A.", showProfile: true, clubs: ["African Girls Club", "Travel Girls"] },
    compatibility: 78,
    yandeNote: "Fatima is in African Girls Club. You've both saved the same 2 restaurants in Crown Heights. Pet-friendly matches your answers.",
  },
  {
    id: 3, type: "roommate-wanted",
    city: "London", neighborhood: "Peckham",
    price: 950, availableFrom: "Jul 15",
    furnished: true, bathroom: "shared", pets: false, smoking: false, weed: true, halalKitchen: false,
    description: "Looking for a third roommate in our flat. We're both early-30s, creative, social but respect space. Great area, tons of cafés.",
    poster: { initial: "Z", color: "#0EA5E9", name: "Zara M.", showProfile: false },
    compatibility: 65,
    yandeNote: "Zara hasn't linked her BloomBay profile — compatibility is based on your quiz answers only. She allows weed use.",
  },
  {
    id: 4, type: "room",
    city: "New York City", neighborhood: "Astoria",
    price: 1200, availableFrom: "Aug 15",
    furnished: false, bathroom: "shared", pets: true, smoking: false, weed: false, halalKitchen: true,
    description: "Large bedroom in a sunny 2BR with me and my dog. Halal kitchen, no pork in the apartment. Clean, quiet, warm vibes.",
    poster: { initial: "N", color: "#FF69B4", name: "Nadia K.", showProfile: true, clubs: ["Wellness Girls", "Dinner Society"] },
    compatibility: 84,
    yandeNote: "Nadia keeps a halal kitchen — you marked that as important. She's in Dinner Society, and you've both saved the same spots in Astoria.",
  },
];

const SEEKERS: Seeker[] = [
  {
    id: 1, initial: "I", color: "#FF1F7D", name: "Ifeoma O.",
    city: "New York City", neighborhood: "Brooklyn (flexible)",
    budget: 1500, moveIn: "Aug 1", type: "room", showProfile: true, clubs: ["African Girls Club"],
    note: "Just moved from Lagos. Looking for a quiet, clean space. Halal kitchen preferred. Non-smoker.",
    compatibility: 88,
    yandeNote: "You and Ifeoma are both in African Girls Club. She has similar lifestyle answers — early riser, tidy, no smoking.",
  },
  {
    id: 2, initial: "C", color: "#8B5CF6", name: "Camille D.",
    city: "New York City", neighborhood: "West Village / SoHo",
    budget: 2200, moveIn: "Sep 1", type: "apartment", showProfile: true, clubs: ["Soft Life Club NYC"],
    note: "Relocated from Paris. Need a proper apartment, not just a room. Quiet, no parties, good taste.",
    compatibility: 72,
    yandeNote: "Camille recently moved from Paris. Detailed profile — good match on lifestyle even without shared clubs.",
  },
  {
    id: 3, initial: "T", color: "#D97706", name: "Tara L.",
    city: "New York City", neighborhood: "West Village",
    budget: 1800, moveIn: "Flexible", type: "co-search", showProfile: true, clubs: ["Dinner Society", "Book Girls"],
    note: "Looking for someone to apartment-hunt with in the West Village. Budget $1800 each. Let's find something good together.",
    compatibility: 94,
    yandeNote: "You and Tara are 94% compatible because you're both in Book Girls and Dinner Society, you've saved 6 of the same places, and you both tend to show up for the same type of events.",
  },
  {
    id: 4, initial: "S", color: "#0EA5E9", name: "Sade T.",
    city: "London", neighborhood: "Peckham / Brixton",
    budget: 1100, moveIn: "Jul 1", type: "room", showProfile: true, clubs: ["Book Girls"],
    note: "Just moved from New York. Need a room in south London. Quiet bookworm. Prefer no weed in the flat.",
    compatibility: 80,
    yandeNote: "Sade is in Book Girls. She's new to London — looking for community as much as a room.",
  },
];

const QUIZ = [
  { id: "sleep", q: "Sleep schedule?", opts: ["Early bird (in by 10pm)", "Night owl (up past midnight)", "Flexible"] },
  { id: "guests", q: "Guests?", opts: ["Often (weekly)", "Sometimes (monthly)", "Rarely", "Never"] },
  { id: "clean", q: "Cleanliness?", opts: ["Very tidy — everything in its place", "Clean and organized", "Relaxed", "I'm working on it"] },
  { id: "noise", q: "Noise level?", opts: ["Very quiet — silence is important", "Moderate — music sometimes", "I like background noise"] },
  { id: "pets", q: "Pets?", opts: ["I have pets", "I love pets — welcome", "No pets please", "Allergic"] },
  { id: "smoking", q: "Smoking?", opts: ["I smoke inside", "Outside only", "No smoking please"] },
  { id: "weed", q: "Weed / cannabis?", opts: ["Fine inside", "Outside only", "No please"] },
  { id: "dietary", q: "Kitchen needs?", opts: ["Halal kitchen (no pork/alcohol)", "No pork", "Vegan kitchen preferred", "No restrictions"] },
  { id: "wfh", q: "Working from home?", opts: ["Always home", "Few days a week", "Rarely home"] },
  { id: "partner", q: "Partner visits?", opts: ["Often — very present", "Sometimes", "Single / partner rarely here"] },
  { id: "age", q: "Your age range?", opts: ["20–25", "26–30", "31–35", "36–40", "40+"] },
  { id: "lifestyle", q: "Your daily rhythm?", opts: ["Early bird — up by 7, in by 10", "Night owl — alive after midnight", "Homebody — mostly at home", "Social butterfly — always out"] },
  { id: "mom", q: "Family status?", opts: ["I'm a mom · kids at home", "Not a mom", "Open to living with moms", "Prefer child-free home"] },
  { id: "religion", q: "Religion (helps with lifestyle fit)?", opts: ["Muslim", "Christian", "Jewish", "Hindu", "Buddhist", "Atheist/agnostic", "Spiritual", "Prefer not to say"] },
  { id: "dealbreaker", q: "Biggest deal-breaker in a home?", opts: ["Messiness / uncleanliness", "Loud guests at night", "No personal space respected", "Misaligned values / lifestyle"] },
];

// ── Lifestyle & profile constants ─────────────────────────────────────────────

const LIFESTYLE_TAGS = [
  { id: "early_bird",    label: "Early bird",       emoji: "🌅" },
  { id: "night_owl",     label: "Night owl",         emoji: "🌙" },
  { id: "homebody",      label: "Homebody",          emoji: "🏡" },
  { id: "social",        label: "Social butterfly",  emoji: "🦋" },
  { id: "creative",      label: "Creative",          emoji: "🎨" },
  { id: "fitness",       label: "Fitness focused",   emoji: "💪" },
  { id: "wfh",           label: "Works from home",   emoji: "💻" },
  { id: "travel",        label: "Travels often",     emoji: "✈️" },
  { id: "quiet_space",   label: "Needs quiet",       emoji: "🤫" },
  { id: "spiritual",     label: "Spiritual",         emoji: "🙏" },
];

const MOM_OPTIONS = [
  { id: "is_mom",           label: "I'm a mom 👶",       desc: "Kids live with me" },
  { id: "not_mom",          label: "Not a mom",           desc: "No kids at home" },
  { id: "open_to_moms",     label: "Open to moms 💛",    desc: "Kids are welcome" },
  { id: "prefer_child_free",label: "Child-free home",    desc: "Prefer no kids at home" },
];

const RELIGION_OPTIONS = [
  "Muslim", "Christian", "Jewish", "Hindu", "Buddhist",
  "Atheist/agnostic", "Spiritual", "Prefer not to say",
];

const DEALBREAKER_OPTIONS = [
  { id: "loud_parties",    label: "Loud parties" },
  { id: "overnight_guests", label: "Overnight guests constantly" },
  { id: "smoking_inside",  label: "Smoking inside" },
  { id: "no_cleaning",     label: "Not cleaning shared spaces" },
  { id: "no_notice",       label: "No notice for guests" },
  { id: "loud_music",      label: "Loud music at night" },
  { id: "no_boundaries",   label: "Not respecting personal space" },
  { id: "misaligned_values", label: "Misaligned values" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function Avatar({ initial, color, size = 40 }: { initial: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}, ${color}BB)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontWeight: 800, fontSize: size / 2.5,
      flexShrink: 0, boxShadow: `0 2px 8px ${color}44`,
    }}>
      {initial}
    </div>
  );
}

function CompatBadge({ score }: { score: number }) {
  const c = score >= 85 ? PINK : score >= 70 ? "#D97706" : "#6B7280";
  const bg = score >= 85 ? "#FFF0F5" : score >= 70 ? "#FFFBEB" : "#F9FAFB";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: bg, border: `1px solid ${c}33`, borderRadius: 999, padding: "3px 8px" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c, display: "inline-block" }} />
      <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, color: c, letterSpacing: "0.05em" }}>{score}% match</span>
    </span>
  );
}

const TYPE_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  "room":             { label: "ROOM",             bg: "#FFF0F5", color: PINK },
  "apartment":        { label: "FULL APT",          bg: "#F5F0FF", color: "#7C3AED" },
  "roommate-wanted":  { label: "ROOMMATE WANTED",   bg: "#ECFDF5", color: "#059669" },
  "co-search":        { label: "CO-SEARCHER",       bg: "#EFF6FF", color: "#2563EB" },
};

function TypeBadge({ type }: { type: string }) {
  const s = TYPE_LABELS[type] ?? { label: type, bg: "#F5F5F5", color: "#666" };
  return (
    <span style={{ background: s.bg, color: s.color, fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.12em", padding: "3px 8px", borderRadius: 999 }}>
      {s.label}
    </span>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 600, color: "#666", background: "#F0F0F0", borderRadius: 999, padding: "3px 8px" }}>
      {label}
    </span>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
      <div style={{ flex: 1, height: 1, background: "#F0EBE4" }} />
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "#ccc", flexShrink: 0 }}>{label}</p>
      <div style={{ flex: 1, height: 1, background: "#F0EBE4" }} />
    </div>
  );
}

const PROFILE_TAG: React.CSSProperties = {
  fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 600,
  color: "#555", background: "#F5F5F5", padding: "4px 10px", borderRadius: 999,
};

type ProfileFields = Pick<Listing,
  "ageRange" | "lifestyleTags" | "personalityType" | "cleanlinessLevel" |
  "noiseLevel" | "drinking" | "momStatus" | "wantsKids" | "religion" |
  "religionLevel" | "moveInTimeline" | "guestFrequency" | "kitchenUse" |
  "tempPreference" | "dealbreakerTags" | "interests" | "dealBreakers"
>;

const READABLE: Record<string, string> = {
  introvert: "Introvert", extrovert: "Extrovert", ambivert: "Ambivert",
  very_tidy: "Very tidy", organized: "Organized", relaxed: "Relaxed",
  very_quiet: "Very quiet", moderate: "Moderate", social: "Social",
  no_alcohol: "No alcohol", socially: "Drinks socially", regularly: "Drinks regularly",
  asap: "Looking now", "1_3_months": "1–3 months", "3_6_months": "3–6 months", "6_plus_months": "6+ months",
  never: "Guests: never", occasionally: "Guests: occasionally", regularly_guests: "Guests: regularly",
  cook_often: "Cooks often", sometimes: "Cooks sometimes", rarely: "Rarely cooks",
  cold: "Keeps it cool", warm: "Keeps it warm",
  yes: "Wants kids someday", no: "Doesn't want kids", undecided: "Undecided on kids",
  very_religious: "Very religious", moderately: "Moderately religious", not_religious: "Not religious",
};

function ProfileTags({ l }: { l: ProfileFields }) {
  const hasAny = l.ageRange || l.momStatus || l.religion || l.personalityType || l.moveInTimeline ||
    (l.lifestyleTags && l.lifestyleTags.length > 0) || (l.interests && l.interests.length > 0) ||
    l.dealBreakers || (l.dealbreakerTags && l.dealbreakerTags.length > 0);
  if (!hasAny) return null;
  return (
    <div style={{ background: "white", borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.15em", color: "#bbb", marginBottom: 10 }}>ABOUT THE POSTER</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {l.ageRange && <span style={PROFILE_TAG}>Age {l.ageRange}</span>}
        {l.personalityType && <span style={PROFILE_TAG}>{READABLE[l.personalityType] ?? l.personalityType}</span>}
        {l.moveInTimeline && <span style={{ ...PROFILE_TAG, background: "#FFF0F5", color: "#FF1F7D" }}>{READABLE[l.moveInTimeline] ?? l.moveInTimeline}</span>}
        {l.momStatus && <span style={PROFILE_TAG}>{MOM_OPTIONS.find(m => m.id === l.momStatus)?.label ?? l.momStatus}</span>}
        {l.religion && <span style={PROFILE_TAG}>{l.religion}{l.religionLevel ? ` · ${READABLE[l.religionLevel] ?? l.religionLevel}` : ""}</span>}
        {l.cleanlinessLevel && <span style={PROFILE_TAG}>{READABLE[l.cleanlinessLevel] ?? l.cleanlinessLevel}</span>}
        {l.noiseLevel && <span style={PROFILE_TAG}>{READABLE[l.noiseLevel] ?? l.noiseLevel} home</span>}
        {l.drinking && <span style={PROFILE_TAG}>{READABLE[l.drinking] ?? l.drinking}</span>}
        {l.lifestyleTags?.map(t => {
          const tag = LIFESTYLE_TAGS.find(lt => lt.id === t);
          return tag ? <span key={t} style={PROFILE_TAG}>{tag.emoji} {tag.label}</span> : null;
        })}
      </div>
      {l.interests && l.interests.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: "#bbb", marginBottom: 4 }}>INTERESTS</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#444" }}>{l.interests.join(", ")}</p>
        </div>
      )}
      {(l.dealbreakerTags?.length || l.dealBreakers) && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #F5F5F5" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: "#e53e3e", marginBottom: 6 }}>DEAL-BREAKERS</p>
          {l.dealbreakerTags && l.dealbreakerTags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
              {l.dealbreakerTags.map(t => {
                const opt = DEALBREAKER_OPTIONS.find(d => d.id === t);
                return opt ? <span key={t} style={{ ...PROFILE_TAG, background: "#FFF5F5", color: "#e53e3e" }}>✕ {opt.label}</span> : null;
              })}
            </div>
          )}
          {l.dealBreakers && <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#444" }}>{l.dealBreakers}</p>}
        </div>
      )}
    </div>
  );
}

function VoiceVideoDisplay({ voiceNoteUrl, videoIntroUrl }: { voiceNoteUrl?: string; videoIntroUrl?: string }) {
  if (!voiceNoteUrl && !videoIntroUrl) return null;
  return (
    <>
      {voiceNoteUrl && (
        <div style={{ background: "white", borderRadius: 14, padding: "12px 16px", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: "#bbb", marginBottom: 8 }}>🎙 VOICE INTRO</p>
          <audio src={voiceNoteUrl} controls style={{ width: "100%", accentColor: PINK }} />
        </div>
      )}
      {videoIntroUrl && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: "#bbb", marginBottom: 8 }}>🎬 VIDEO INTRO</p>
          <video src={videoIntroUrl} controls playsInline style={{ width: "100%", borderRadius: 12, maxHeight: 280, objectFit: "cover", background: "#000" }} />
        </div>
      )}
    </>
  );
}

// ── Listing Card ──────────────────────────────────────────────────────────────

function ListingCard({ l, onOpen }: { l: Listing; onOpen: () => void }) {
  return (
    <button onClick={onOpen} style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "white", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden", padding: 0 }}>
      {/* Photo placeholder */}
      <div style={{ height: 120, background: `linear-gradient(135deg, ${l.poster.color}22, ${l.poster.color}0A)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="52" height="52" viewBox="0 0 60 60" fill="none" opacity={0.22}>
          <rect x="10" y="25" width="40" height="28" rx="2" fill={l.poster.color} />
          <path d="M5 28 L30 10 L55 28" stroke={l.poster.color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="23" y="35" width="14" height="18" rx="1.5" fill="white" />
        </svg>
        <div style={{ position: "absolute", top: 10, left: 12 }}><TypeBadge type={l.type} /></div>
        <div style={{ position: "absolute", top: 10, right: 12 }}><CompatBadge score={l.compatibility} /></div>
      </div>

      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 17, fontWeight: 700, color: INK, lineHeight: 1.1 }}>{l.neighborhood}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#888", marginTop: 1 }}>{l.city}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 18, fontWeight: 900, color: PINK }}>${l.price.toLocaleString()}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#bbb" }}>/month</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", margin: "8px 0 10px" }}>
          <Tag label={`${l.availableFrom}${l.availableTo ? ` → ${l.availableTo}` : " onward"}`} />
          <Tag label={l.furnished ? "Furnished" : "Unfurnished"} />
          <Tag label={l.bathroom === "private" ? "Private bath" : "Shared bath"} />
          {!l.smoking && <Tag label="🚭 No smoking" />}
          {l.pets && <Tag label="🐾 Pets ok" />}
          {l.halalKitchen && <Tag label="🥩 Halal kitchen" />}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 10, borderTop: "1px solid #F0F0F0" }}>
          <Avatar initial={l.poster.initial} color={l.poster.color} size={28} />
          <div style={{ flex: 1 }}>
            {l.poster.showProfile ? (
              <>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: INK }}>{l.poster.name}</p>
                {l.poster.clubs && <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#bbb" }}>{l.poster.clubs.join(" · ")}</p>}
              </>
            ) : (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#bbb" }}>Profile hidden</p>
            )}
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </div>
      </div>
    </button>
  );
}

// ── Seeker Card ───────────────────────────────────────────────────────────────

function SeekerCard({ s, onOpen }: { s: Seeker; onOpen: () => void }) {
  return (
    <button onClick={onOpen} style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "white", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)", padding: "16px" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Avatar initial={s.initial} color={s.color} size={46} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, fontWeight: 700, color: INK }}>{s.showProfile ? s.name : "Anonymous Bloomie"}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#888", marginTop: 2 }}>{s.neighborhood} · {s.city}</p>
            </div>
            <CompatBadge score={s.compatibility} />
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#444", lineHeight: 1.55, margin: "8px 0" }}>{s.note}</p>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <TypeBadge type={s.type} />
            <Tag label={`$${s.budget.toLocaleString()}/mo`} />
            <Tag label={`From ${s.moveIn}`} />
            {s.clubs?.map(c => <span key={c} style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK, background: "#FFF0F5", borderRadius: 999, padding: "3px 8px" }}>{c}</span>)}
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Detail Sheet (shared) ─────────────────────────────────────────────────────

function DetailSheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 301, background: IVORY, borderRadius: "24px 24px 0 0", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 -12px 48px rgba(0,0,0,0.22)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} />
        </div>
        {children}
      </div>
    </>
  );
}

function YandeNote({ note }: { note: string }) {
  return (
    <div style={{ background: PLUM, borderRadius: 16, padding: "14px 16px", marginBottom: 20 }}>
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: 6 }}>
        &ldquo;{note}&rdquo;
      </p>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK, letterSpacing: "0.08em" }}>— Yande ✦</p>
    </div>
  );
}

function SendButton({ name, sent, onSend }: { name: string; sent: boolean; onSend: () => void }) {
  return sent ? (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 17, color: INK }}>Message sent. ✦</p>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#888", marginTop: 4 }}>You&apos;ll hear back through BloomBay messages.</p>
    </div>
  ) : (
    <button onClick={onSend} style={{ width: "100%", padding: "16px", background: PINK, color: "white", border: "none", borderRadius: 14, fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", cursor: "pointer", boxShadow: `0 3px 0 rgba(150,0,55,0.7), 0 6px 20px ${PINK}44` }}>
      {name} →
    </button>
  );
}

// ── Listing Detail ────────────────────────────────────────────────────────────

function ListingDetail({ l, onClose }: { l: Listing; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  return (
    <DetailSheet onClose={onClose}>
      <div style={{ height: 160, margin: "0 16px", background: `linear-gradient(135deg, ${l.poster.color}33, ${l.poster.color}0A)`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: 4 }}>
        <svg width="68" height="68" viewBox="0 0 60 60" fill="none" opacity={0.2}><rect x="10" y="25" width="40" height="28" rx="2" fill={l.poster.color} /><path d="M5 28 L30 10 L55 28" stroke={l.poster.color} strokeWidth="2.5" fill="none" strokeLinecap="round" /><rect x="23" y="35" width="14" height="18" rx="1.5" fill="white" /></svg>
        <div style={{ position: "absolute", top: 12, left: 12 }}><TypeBadge type={l.type} /></div>
        <div style={{ position: "absolute", top: 12, right: 12 }}><CompatBadge score={l.compatibility} /></div>
      </div>

      <div style={{ padding: "16px 20px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 24, fontWeight: 700, color: INK }}>{l.neighborhood}</p>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 22, fontWeight: 900, color: PINK }}>${l.price.toLocaleString()}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#bbb" }}>per month</p>
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#888", marginBottom: 14 }}>{l.city}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#444", lineHeight: 1.65, marginBottom: 18 }}>{l.description}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
          {[
            { label: "AVAILABLE", value: `${l.availableFrom}${l.availableTo ? ` → ${l.availableTo}` : " onward"}` },
            { label: "FURNISHED", value: l.furnished ? "Yes" : "No" },
            { label: "BATHROOM", value: l.bathroom === "private" ? "Private" : "Shared" },
            { label: "PETS", value: l.pets ? "Allowed" : "No pets" },
            { label: "SMOKING", value: l.smoking ? "Allowed" : "No smoking" },
            { label: "WEED", value: l.weed ? "Allowed" : "No" },
            { label: "KITCHEN", value: l.halalKitchen ? "Halal (no pork/alcohol)" : "No restrictions" },
          ].map(d => (
            <div key={d.label} style={{ background: "white", borderRadius: 12, padding: "10px 12px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.15em", color: "#bbb", marginBottom: 2 }}>{d.label}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: INK }}>{d.value}</p>
            </div>
          ))}
        </div>

        {l.poster.showProfile && (
          <div style={{ background: "white", borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.15em", color: "#bbb", marginBottom: 10 }}>POSTED BY</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar initial={l.poster.initial} color={l.poster.color} size={40} />
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: INK }}>{l.poster.name}</p>
                {l.poster.clubs && (
                  <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                    {l.poster.clubs.map(c => <span key={c} style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: PINK, background: "#FFF0F5", borderRadius: 999, padding: "2px 7px" }}>{c}</span>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <ProfileTags l={l} />
        <VoiceVideoDisplay voiceNoteUrl={l.voiceNoteUrl} videoIntroUrl={l.videoIntroUrl} />
        <YandeNote note={l.yandeNote} />
        <SendButton name={`Message ${l.poster.showProfile ? l.poster.name.split(" ")[0] : "this Bloomie"}`} sent={sent} onSend={() => setSent(true)} />
      </div>
    </DetailSheet>
  );
}

// ── Seeker Detail ─────────────────────────────────────────────────────────────

function SeekerDetail({ s, onClose }: { s: Seeker; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  return (
    <DetailSheet onClose={onClose}>
      <div style={{ padding: "16px 20px 48px" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
          <Avatar initial={s.initial} color={s.color} size={56} />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, fontWeight: 700, color: INK, lineHeight: 1.1 }}>{s.showProfile ? s.name : "Anonymous Bloomie"}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#888", marginTop: 3 }}>{s.neighborhood} · {s.city}</p>
            <div style={{ marginTop: 6 }}><CompatBadge score={s.compatibility} /></div>
          </div>
        </div>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#444", lineHeight: 1.65, marginBottom: 16 }}>{s.note}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[
            { label: "LOOKING FOR", value: s.type === "co-search" ? "Co-searcher" : s.type === "room" ? "A room" : "Full apartment" },
            { label: "BUDGET", value: `$${s.budget.toLocaleString()}/mo` },
            { label: "MOVE IN", value: s.moveIn },
            { label: "PREFERRED AREA", value: s.neighborhood },
          ].map(d => (
            <div key={d.label} style={{ background: "white", borderRadius: 12, padding: "10px 12px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.15em", color: "#bbb", marginBottom: 2 }}>{d.label}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: INK }}>{d.value}</p>
            </div>
          ))}
        </div>

        {s.clubs && s.clubs.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.15em", color: "#bbb", marginBottom: 8 }}>CLUBS IN COMMON</p>
            <div style={{ display: "flex", gap: 6 }}>
              {s.clubs.map(c => <span key={c} style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: PINK, background: "#FFF0F5", borderRadius: 999, padding: "4px 10px" }}>{c}</span>)}
            </div>
          </div>
        )}

        <ProfileTags l={s} />
        <VoiceVideoDisplay voiceNoteUrl={s.voiceNoteUrl} videoIntroUrl={s.videoIntroUrl} />
        <YandeNote note={s.yandeNote} />
        <SendButton name="Reach out" sent={sent} onSend={() => setSent(true)} />
      </div>
    </DetailSheet>
  );
}

// ── Roommate Quiz ─────────────────────────────────────────────────────────────

function QuizSheet({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const q = QUIZ[step];

  function pick(opt: string) {
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    if (step === QUIZ.length - 1) { setTimeout(onComplete, 250); }
    else setStep(s => s + 1);
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 401, background: "white", borderRadius: "24px 24px 0 0", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 -12px 48px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div style={{ padding: "12px 22px 48px" }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>ROOMMATE PROFILE · {step + 1}/{QUIZ.length}</p>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ height: 3, background: "#F0F0F0", borderRadius: 999 }}>
              <div style={{ height: 3, background: PINK, borderRadius: 999, width: `${((step + 1) / QUIZ.length) * 100}%`, transition: "width 0.3s ease" }} />
            </div>
          </div>

          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: INK, lineHeight: 1.25, marginBottom: 22 }}>{q.q}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.opts.map(opt => (
              <button key={opt} onClick={() => pick(opt)} style={{
                padding: "13px 16px", borderRadius: 14,
                border: `1.5px solid ${answers[q.id] === opt ? PINK : "#F0EBE4"}`,
                background: answers[q.id] === opt ? "#FFF0F5" : "white",
                color: answers[q.id] === opt ? PINK : "#333",
                fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 500,
                textAlign: "left", cursor: "pointer", transition: "all 0.15s",
              }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Post Sheet ────────────────────────────────────────────────────────────────

function PostSheet({ onClose, onPosted }: { onClose: () => void; onPosted?: () => void }) {
  const [mode, setMode] = useState<"have" | "need">("have");
  const [type, setType] = useState("room");
  const [city, setCity] = useState("");
  const [hood, setHood] = useState("");
  const [price, setPrice] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [desc, setDesc] = useState("");
  const [furnished, setFurnished] = useState(false);
  const [privateBath, setPrivateBath] = useState(false);
  const [petsOk, setPetsOk] = useState(false);
  const [smokingOk, setSmokingOk] = useState(false);
  const [weedOk, setWeedOk] = useState(false);
  const [halalKitchen, setHalalKitchen] = useState(false);
  const [wfhFriendly, setWfhFriendly] = useState(false);
  const [partnerOk, setPartnerOk] = useState(false);
  const [showProfile, setShowProfile] = useState(true);

  // Comprehensive profile fields — About You
  const [ageRange, setAgeRange] = useState("");
  const [selectedLifestyle, setSelectedLifestyle] = useState<string[]>([]);
  const [personalityType, setPersonalityType] = useState("");
  const [momStatus, setMomStatus] = useState("");
  const [wantsKids, setWantsKids] = useState("");
  const [religion, setReligion] = useState("");
  const [religionLevel, setReligionLevel] = useState("");
  const [moveInTimeline, setMoveInTimeline] = useState("");
  const [interests, setInterests] = useState("");

  // House rules
  const [cleanlinessLevel, setCleanlinessLevel] = useState("");
  const [noiseLevel, setNoiseLevel] = useState("");
  const [drinking, setDrinking] = useState("");
  const [guestFrequency, setGuestFrequency] = useState("");
  const [kitchenUse, setKitchenUse] = useState("");
  const [tempPreference, setTempPreference] = useState("");

  // Dealbreakers
  const [selectedDealbreakers, setSelectedDealbreakers] = useState<string[]>([]);
  const [dealBreakers, setDealBreakers] = useState("");

  // Media
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [voicePreviewUrl, setVoicePreviewUrl] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const [done, setDone] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const voiceRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  function toggleLifestyle(tag: string) {
    setSelectedLifestyle(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  function toggleDealbreaker(id: string) {
    setSelectedDealbreakers(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  }

  function handleVoiceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVoiceFile(file);
    setVoicePreviewUrl(URL.createObjectURL(file));
  }

  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
  }

  async function uploadMedia(file: File, folder: string): Promise<string | null> {
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from("girlmate-media").upload(path, file, { upsert: true });
      if (error || !data) return null;
      const { data: { publicUrl } } = supabase.storage.from("girlmate-media").getPublicUrl(data.path);
      return publicUrl;
    } catch {
      return null;
    }
  }

  const valid = city.trim() && hood.trim() && price.trim() && from.trim() && desc.trim();

  async function submit() {
    if (!valid || posting) return;
    setPosting(true);
    setPostError(null);
    try {
      const [voiceNoteUrl, videoIntroUrl] = await Promise.all([
        voiceFile ? uploadMedia(voiceFile, "voice") : Promise.resolve(null),
        videoFile ? uploadMedia(videoFile, "video") : Promise.resolve(null),
      ]);

      const listingType = mode === "have"
        ? type
        : type === "room" ? "roommate-wanted" : type === "apartment" ? "co-search" : "co-search";

      const res = await fetch("/api/girlmate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_type: listingType,
          city: city.trim(),
          neighborhood: hood.trim(),
          price: Number(price),
          available_from: from.trim() || null,
          available_to: to.trim() || null,
          description: desc.trim(),
          furnished,
          private_bathroom: privateBath,
          pets: petsOk,
          smoking: smokingOk,
          weed_ok: weedOk,
          halal_kitchen: halalKitchen,
          wfh_friendly: wfhFriendly,
          partner_ok: partnerOk,
          show_profile: showProfile,
          age_range: ageRange || null,
          lifestyle_tags: selectedLifestyle,
          personality_type: personalityType || null,
          cleanliness_level: cleanlinessLevel || null,
          noise_level: noiseLevel || null,
          drinking: drinking || null,
          mom_status: momStatus || null,
          wants_kids: wantsKids || null,
          religion: religion || null,
          religion_level: religionLevel || null,
          move_in_timeline: moveInTimeline || null,
          guest_frequency: guestFrequency || null,
          kitchen_use: kitchenUse || null,
          temp_preference: tempPreference || null,
          dealbreaker_tags: selectedDealbreakers,
          interests: interests.trim()
            ? interests.split(",").map(s => s.trim()).filter(Boolean)
            : [],
          deal_breakers: dealBreakers.trim() || null,
          voice_note_url: voiceNoteUrl,
          video_intro_url: videoIntroUrl,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setPostError(d.error ?? "Something went wrong");
        setPosting(false);
        return;
      }
      setDone(true);
      onPosted?.();
    } catch {
      setPostError("Something went wrong");
      setPosting(false);
    }
  }

  if (done) return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 401, background: IVORY, borderRadius: "24px 24px 0 0", padding: "40px 24px 64px", textAlign: "center", boxShadow: "0 -12px 48px rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>🌸</div>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 24, color: INK, marginBottom: 8 }}>Your listing is live.</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#888", marginBottom: 24 }}>Bloomies in {city || "your city"} can now find it.</p>
        <button onClick={onClose} style={{ padding: "14px 32px", background: PINK, color: "white", border: "none", borderRadius: 14, fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Done ✦</button>
      </div>
    </>
  );

  const INPUT: React.CSSProperties = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #F0EBE4", background: "white", fontFamily: "var(--font-jost)", fontSize: 14, color: INK, outline: "none", boxSizing: "border-box" };
  const LABEL: React.CSSProperties = { fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: "#bbb", marginBottom: 6, display: "block" };

  const TOGGLE_RULES = [
    { label: "Furnished",             val: furnished,    set: setFurnished },
    { label: "Private bathroom",      val: privateBath,  set: setPrivateBath },
    { label: "Pets OK",               val: petsOk,       set: setPetsOk },
    { label: "Smoking OK",            val: smokingOk,    set: setSmokingOk },
    { label: "Weed / cannabis OK",    val: weedOk,       set: setWeedOk },
    { label: "Halal kitchen",         val: halalKitchen, set: setHalalKitchen },
    { label: "WFH friendly",          val: wfhFriendly,  set: setWfhFriendly },
    { label: "Partner can visit often", val: partnerOk,  set: setPartnerOk },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 401, background: IVORY, borderRadius: "24px 24px 0 0", maxHeight: "95vh", overflowY: "auto", boxShadow: "0 -12px 48px rgba(0,0,0,0.22)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} />
        </div>

        <div style={{ padding: "12px 20px 80px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>GIRLMATE LISTING</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: INK, marginTop: 2 }}>Your profile.</p>
            </div>
            <button onClick={onClose} style={{ background: "rgba(0,0,0,0.07)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>×</button>
          </div>

          {/* ── SECTION: What are you looking for? ── */}
          <SectionDivider label="WHAT ARE YOU LOOKING FOR?" />

          <div style={{ display: "flex", background: "#F0EBE4", borderRadius: 14, padding: 4 }}>
            {[{ k: "have", l: "I have a space" }, { k: "need", l: "I need a space" }].map(m => (
              <button key={m.k} onClick={() => setMode(m.k as "have" | "need")} style={{ flex: 1, padding: "10px", borderRadius: 11, border: "none", background: mode === m.k ? "white" : "transparent", color: mode === m.k ? INK : "#999", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", boxShadow: mode === m.k ? "0 1px 6px rgba(0,0,0,0.08)" : "none" }}>
                {m.l}
              </button>
            ))}
          </div>

          <div>
            <label style={LABEL}>TYPE</label>
            <div style={{ display: "flex", gap: 8 }}>
              {(mode === "have"
                ? [{ k: "room", l: "Room" }, { k: "apartment", l: "Full Apt" }, { k: "roommate-wanted", l: "Roommate" }]
                : [{ k: "room", l: "Need a room" }, { k: "apartment", l: "Need a flat" }, { k: "co-search", l: "Co-search" }]
              ).map(t => (
                <button key={t.k} onClick={() => setType(t.k)} style={{ flex: 1, padding: "10px 4px", border: `1.5px solid ${type === t.k ? PINK : "#F0EBE4"}`, background: type === t.k ? "#FFF0F5" : "white", color: type === t.k ? PINK : "#666", borderRadius: 12, fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                  {t.l}
                </button>
              ))}
            </div>
          </div>

          {/* ── SECTION: Location ── */}
          <SectionDivider label="LOCATION" />

          <div>
            <label style={LABEL}>CITY</label>
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="New York City, London, Paris…" style={INPUT} />
          </div>
          <div>
            <label style={LABEL}>NEIGHBORHOOD</label>
            <input value={hood} onChange={e => setHood(e.target.value)} placeholder="Williamsburg, Peckham…" style={INPUT} />
          </div>

          {/* ── SECTION: Price & Timing ── */}
          <SectionDivider label="PRICE & TIMING" />

          <div>
            <label style={LABEL}>{mode === "have" ? "ASKING PRICE / MONTH" : "BUDGET / MONTH"}</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#888", fontFamily: "var(--font-jost)", fontSize: 14 }}>$</span>
              <input value={price} onChange={e => setPrice(e.target.value)} placeholder="1,400" type="number" style={{ ...INPUT, paddingLeft: 28 }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={LABEL}>{mode === "have" ? "AVAILABLE FROM" : "MOVE-IN"}</label>
              <input value={from} onChange={e => setFrom(e.target.value)} placeholder="Aug 1" style={INPUT} />
            </div>
            <div>
              <label style={LABEL}>{mode === "have" ? "UNTIL (optional)" : "FLEXIBLE UNTIL"}</label>
              <input value={to} onChange={e => setTo(e.target.value)} placeholder="Dec 31" style={INPUT} />
            </div>
          </div>

          {/* ── SECTION: About the Space ── */}
          <SectionDivider label="ABOUT THE SPACE" />

          <div>
            <label style={LABEL}>{mode === "have" ? "DESCRIBE THE SPACE & YOUR TERMS" : "ABOUT YOU & WHAT YOU NEED"}</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)}
              placeholder={mode === "have" ? "The vibe, your rules, what kind of person you're looking for…" : "A bit about yourself, lifestyle, what matters most to you…"}
              rows={4} style={{ ...INPUT, resize: "none", lineHeight: 1.6 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {TOGGLE_RULES.map(({ label, val, set }) => (
              <button key={label} onClick={() => set((p: boolean) => !p)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${val ? PINK : "#F0EBE4"}`, background: val ? "#FFF0F5" : "white", cursor: "pointer", textAlign: "left" }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: val ? PINK : "transparent", border: `1.5px solid ${val ? PINK : "#ddd"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                  {val && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><polyline points="1.5,4.5 3.5,6.5 7.5,2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, color: val ? PINK : "#555" }}>{label}</span>
              </button>
            ))}
          </div>

          {/* ── SECTION: About You ── */}
          <SectionDivider label="ABOUT YOU" />

          {/* Age range */}
          <div>
            <label style={LABEL}>YOUR AGE RANGE</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["20–25", "26–30", "31–35", "36–40", "40+"].map(age => (
                <button key={age} onClick={() => setAgeRange(ageRange === age ? "" : age)} style={{ padding: "8px 14px", borderRadius: 999, border: `1.5px solid ${ageRange === age ? PINK : "#F0EBE4"}`, background: ageRange === age ? "#FFF0F5" : "white", color: ageRange === age ? PINK : "#555", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: ageRange === age ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* Lifestyle tags */}
          <div>
            <label style={LABEL}>YOUR LIFESTYLE <span style={{ fontWeight: 400, textTransform: "none", color: "#bbb" }}>— select all that apply</span></label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {LIFESTYLE_TAGS.map(tag => {
                const active = selectedLifestyle.includes(tag.id);
                return (
                  <button key={tag.id} onClick={() => toggleLifestyle(tag.id)} style={{ padding: "8px 14px", borderRadius: 999, border: `1.5px solid ${active ? PINK : "#F0EBE4"}`, background: active ? "#FFF0F5" : "white", color: active ? PINK : "#555", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                    {tag.emoji} {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Family status */}
          <div>
            <label style={LABEL}>FAMILY STATUS</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MOM_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => setMomStatus(momStatus === opt.id ? "" : opt.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${momStatus === opt.id ? PINK : "#F0EBE4"}`, background: momStatus === opt.id ? "#FFF0F5" : "white", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${momStatus === opt.id ? PINK : "#ddd"}`, background: momStatus === opt.id ? PINK : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                    {momStatus === opt.id && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} />}
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: momStatus === opt.id ? PINK : INK, margin: 0 }}>{opt.label}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#888", margin: "2px 0 0" }}>{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Religion */}
          <div>
            <label style={LABEL}>RELIGION <span style={{ fontWeight: 400, textTransform: "none", color: "#bbb" }}>— optional · helps with lifestyle compatibility</span></label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {RELIGION_OPTIONS.map(r => (
                <button key={r} onClick={() => setReligion(religion === r ? "" : r)} style={{ padding: "8px 12px", borderRadius: 999, border: `1.5px solid ${religion === r ? PINK : "#F0EBE4"}`, background: religion === r ? "#FFF0F5" : "white", color: religion === r ? PINK : "#555", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: religion === r ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label style={LABEL}>INTERESTS & HOBBIES</label>
            <input value={interests} onChange={e => setInterests(e.target.value)} placeholder="Museums, cooking, yoga, travel, fashion, books…" style={INPUT} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#ccc", marginTop: 4 }}>Separate with commas</p>
          </div>

          {/* Personality */}
          <div>
            <label style={LABEL}>PERSONALITY</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ k: "introvert", l: "Introvert 🪴" }, { k: "extrovert", l: "Extrovert 🌻" }, { k: "ambivert", l: "Ambivert 🌿" }].map(p => (
                <button key={p.k} onClick={() => setPersonalityType(personalityType === p.k ? "" : p.k)} style={{ flex: 1, padding: "10px 6px", borderRadius: 12, border: `1.5px solid ${personalityType === p.k ? PINK : "#F0EBE4"}`, background: personalityType === p.k ? "#FFF0F5" : "white", color: personalityType === p.k ? PINK : "#555", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: personalityType === p.k ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                  {p.l}
                </button>
              ))}
            </div>
          </div>

          {/* Move-in timeline */}
          <div>
            <label style={LABEL}>MOVE-IN TIMELINE</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                { k: "asap", l: "ASAP 🔑" },
                { k: "1_3_months", l: "1–3 months" },
                { k: "3_6_months", l: "3–6 months" },
                { k: "6_plus_months", l: "6+ months" },
              ].map(t => (
                <button key={t.k} onClick={() => setMoveInTimeline(moveInTimeline === t.k ? "" : t.k)} style={{ padding: "8px 14px", borderRadius: 999, border: `1.5px solid ${moveInTimeline === t.k ? PINK : "#F0EBE4"}`, background: moveInTimeline === t.k ? "#FFF0F5" : "white", color: moveInTimeline === t.k ? PINK : "#555", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: moveInTimeline === t.k ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                  {t.l}
                </button>
              ))}
            </div>
          </div>

          {/* Future kids */}
          <div>
            <label style={LABEL}>CHILDREN IN THE FUTURE?</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ k: "yes", l: "Yes, someday" }, { k: "no", l: "No thanks" }, { k: "undecided", l: "Undecided" }].map(k => (
                <button key={k.k} onClick={() => setWantsKids(wantsKids === k.k ? "" : k.k)} style={{ flex: 1, padding: "10px 6px", borderRadius: 12, border: `1.5px solid ${wantsKids === k.k ? PINK : "#F0EBE4"}`, background: wantsKids === k.k ? "#FFF0F5" : "white", color: wantsKids === k.k ? PINK : "#555", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: wantsKids === k.k ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                  {k.l}
                </button>
              ))}
            </div>
          </div>

          {/* Religion level */}
          {religion && religion !== "Prefer not to say" && religion !== "Atheist/agnostic" && (
            <div>
              <label style={LABEL}>HOW IMPORTANT IS FAITH TO YOUR LIFESTYLE?</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ k: "very_religious", l: "Very important" }, { k: "moderately", l: "Moderately" }, { k: "not_religious", l: "Not much" }].map(r => (
                  <button key={r.k} onClick={() => setReligionLevel(religionLevel === r.k ? "" : r.k)} style={{ flex: 1, padding: "10px 4px", borderRadius: 12, border: `1.5px solid ${religionLevel === r.k ? PINK : "#F0EBE4"}`, background: religionLevel === r.k ? "#FFF0F5" : "white", color: religionLevel === r.k ? PINK : "#555", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: religionLevel === r.k ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                    {r.l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── SECTION: House Rules ── */}
          <SectionDivider label="HOUSE RULES" />

          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#888", marginTop: -8 }}>
            Most roommate conflicts start here. Be honest — it saves everyone time.
          </p>

          {[
            { label: "CLEANLINESS", set: setCleanlinessLevel, val: cleanlinessLevel, opts: [{ k: "very_tidy", l: "Very tidy" }, { k: "organized", l: "Organized" }, { k: "relaxed", l: "Relaxed" }] },
            { label: "NOISE LEVEL", set: setNoiseLevel, val: noiseLevel, opts: [{ k: "very_quiet", l: "Very quiet" }, { k: "moderate", l: "Moderate" }, { k: "social", l: "Social/loud" }] },
            { label: "GUESTS", set: setGuestFrequency, val: guestFrequency, opts: [{ k: "never", l: "Never" }, { k: "occasionally", l: "Sometimes" }, { k: "regularly", l: "Regularly" }] },
            { label: "KITCHEN", set: setKitchenUse, val: kitchenUse, opts: [{ k: "cook_often", l: "Cook often" }, { k: "sometimes", l: "Sometimes" }, { k: "rarely", l: "Rarely" }] },
            { label: "DRINKING", set: setDrinking, val: drinking, opts: [{ k: "no_alcohol", l: "No alcohol" }, { k: "socially", l: "Socially" }, { k: "regularly", l: "Regularly" }] },
            { label: "TEMPERATURE", set: setTempPreference, val: tempPreference, opts: [{ k: "cold", l: "Cool home" }, { k: "moderate", l: "Moderate" }, { k: "warm", l: "Warm home" }] },
          ].map(row => (
            <div key={row.label}>
              <label style={LABEL}>{row.label}</label>
              <div style={{ display: "flex", gap: 8 }}>
                {row.opts.map(o => (
                  <button key={o.k} onClick={() => row.set((row.val === o.k ? "" : o.k) as string)} style={{ flex: 1, padding: "10px 4px", borderRadius: 12, border: `1.5px solid ${row.val === o.k ? PINK : "#F0EBE4"}`, background: row.val === o.k ? "#FFF0F5" : "white", color: row.val === o.k ? PINK : "#555", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: row.val === o.k ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* ── SECTION: Dealbreakers ── */}
          <SectionDivider label="DEAL-BREAKERS" />

          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#888", marginTop: -8 }}>
            Be upfront. This helps the right people reach out and the wrong ones kindly move on.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {DEALBREAKER_OPTIONS.map(opt => {
              const active = selectedDealbreakers.includes(opt.id);
              return (
                <button key={opt.id} onClick={() => toggleDealbreaker(opt.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${active ? "#e53e3e" : "#F0EBE4"}`, background: active ? "#FFF5F5" : "white", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: active ? "#e53e3e" : "transparent", border: `1.5px solid ${active ? "#e53e3e" : "#ddd"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                    {active && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><polyline points="1.5,4.5 3.5,6.5 7.5,2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, color: active ? "#e53e3e" : "#555" }}>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Additional deal-breakers */}
          <div>
            <label style={LABEL}>ANYTHING ELSE?</label>
            <textarea value={dealBreakers} onChange={e => setDealBreakers(e.target.value)} placeholder="Anything not on the list above…" rows={2} style={{ ...INPUT, resize: "none", lineHeight: 1.6 }} />
          </div>

          {/* ── SECTION: Your Intro Media ── */}
          <SectionDivider label="YOUR INTRO" />

          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#888", marginTop: -8 }}>
            Let Bloomies hear and see you before they reach out. Optional — but people connect faster when they can.
          </p>

          {/* Voice message */}
          <div style={{ background: "white", borderRadius: 14, padding: "14px 16px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: "#bbb", marginBottom: 4 }}>🎙 VOICE MESSAGE</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#555", marginBottom: 12, lineHeight: 1.5 }}>
              A 30–60 second voice note introducing yourself. Hearing someone&apos;s voice builds trust before meeting.
            </p>
            {voicePreviewUrl ? (
              <div>
                <audio src={voicePreviewUrl} controls style={{ width: "100%", accentColor: PINK }} />
                <button onClick={() => { setVoiceFile(null); setVoicePreviewUrl(null); if (voiceRef.current) voiceRef.current.value = ""; }} style={{ marginTop: 8, fontFamily: "var(--font-jost)", fontSize: 11, color: "#aaa", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  × Remove
                </button>
              </div>
            ) : (
              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, border: `1.5px dashed ${PINK}55`, cursor: "pointer", background: "#FFF8FA" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: PINK }}>Add voice message</span>
                <input ref={voiceRef} type="file" accept="audio/*" onChange={handleVoiceChange} style={{ display: "none" }} />
              </label>
            )}
          </div>

          {/* Video intro */}
          <div style={{ background: "white", borderRadius: 14, padding: "14px 16px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: "#bbb", marginBottom: 4 }}>
              🎬 SHORT VIDEO INTRO <span style={{ fontWeight: 500, color: "#ddd" }}>· max 30 sec</span>
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#555", marginBottom: 12, lineHeight: 1.5 }}>
              A quick &ldquo;hi, this is me&rdquo; clip — 30 seconds is enough. Helps people decide whether to reach out and makes it easy to kindly pass if it&apos;s not a fit.
            </p>
            {videoPreviewUrl ? (
              <div>
                <video src={videoPreviewUrl} controls playsInline style={{ width: "100%", borderRadius: 10, maxHeight: 220, objectFit: "cover", background: "#000" }} />
                <button onClick={() => { setVideoFile(null); setVideoPreviewUrl(null); if (videoRef.current) videoRef.current.value = ""; }} style={{ marginTop: 8, fontFamily: "var(--font-jost)", fontSize: 11, color: "#aaa", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  × Remove
                </button>
              </div>
            ) : (
              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, border: `1.5px dashed ${PINK}55`, cursor: "pointer", background: "#FFF8FA" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: PINK }}>Add video intro</span>
                <input ref={videoRef} type="file" accept="video/*" onChange={handleVideoChange} style={{ display: "none" }} />
              </label>
            )}
          </div>

          {/* ── SECTION: Privacy ── */}
          <SectionDivider label="PRIVACY" />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", borderRadius: 14, padding: "14px 16px" }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: INK, margin: 0 }}>Show my BloomBay profile</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#888", marginTop: 2 }}>Bloomies see your clubs and saved places</p>
            </div>
            <button onClick={() => setShowProfile(p => !p)} style={{ width: 44, height: 26, borderRadius: 999, background: showProfile ? PINK : "#E0E0E0", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: showProfile ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
            </button>
          </div>

          {postError && <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#B71C1C" }}>{postError}</p>}

          <button onClick={submit} disabled={!valid || posting} style={{ width: "100%", padding: "16px", background: valid ? PINK : "#eee", color: valid ? "white" : "#bbb", border: "none", borderRadius: 14, fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", cursor: valid && !posting ? "pointer" : "default", boxShadow: valid ? `0 3px 0 rgba(150,0,55,0.7), 0 6px 20px ${PINK}44` : "none", transition: "all 0.2s" }}>
            {posting ? "Posting…" : "Post listing ✦"}
          </button>

        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

// Map API data to the Listing shape expected by the card components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function apiToListing(r: any): Listing {
  const COLORS = ["#FF1F7D", "#C084FC", "#0EA5E9", "#FF69B4", "#8B5CF6"];
  const name = r.profile?.full_name ?? r.profile?.first_name ?? "Bloomie";
  const colorIdx = r.id.charCodeAt(0) % COLORS.length;
  return {
    id: r.id,
    type: r.listing_type === "co-search" ? "roommate-wanted" : r.listing_type,
    city: r.city ?? "New York City",
    neighborhood: r.neighborhood_name ?? "",
    price: r.price_cents ? Math.round(r.price_cents / 100) : 0,
    availableFrom: r.available_from ? new Date(r.available_from).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Soon",
    availableTo: r.available_to ? new Date(r.available_to).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : undefined,
    furnished: r.furnished ?? false,
    bathroom: r.private_bathroom ? "private" : "shared",
    pets: r.pets ?? false,
    smoking: r.smoking ?? false,
    weed: r.weed_ok ?? false,
    halalKitchen: r.halal_kitchen ?? false,
    description: r.description ?? "",
    poster: { initial: name[0]?.toUpperCase() ?? "B", color: COLORS[colorIdx], name, showProfile: r.show_profile ?? true },
    compatibility: 75,
    yandeNote: r.yande_note ?? "A fellow Bloomie looking for the right match.",
    ageRange: r.age_range ?? undefined,
    lifestyleTags: r.lifestyle_tags ?? [],
    momStatus: r.mom_status ?? undefined,
    religion: r.religion ?? undefined,
    interests: r.interests ?? [],
    dealBreakers: r.deal_breakers ?? undefined,
    voiceNoteUrl: r.voice_note_url ?? undefined,
    videoIntroUrl: r.video_intro_url ?? undefined,
  };
}

export function GirlMatePage({ onBack }: { onBack?: () => void } = {}) {
  const [tab, setTab]                       = useState<Tab>("available");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedSeeker, setSelectedSeeker]   = useState<Seeker | null>(null);
  const [showQuiz, setShowQuiz]               = useState(false);
  const [quizDone, setQuizDone]               = useState(false);
  const [showPost, setShowPost]               = useState(false);
  const [realListings, setRealListings]       = useState<Listing[]>([]);
  const [realSeekers, setRealSeekers]         = useState<Listing[]>([]);

  async function loadListings(t: Tab) {
    try {
      const res = await fetch(`/api/girlmate?tab=${t}`);
      if (!res.ok) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any[] = await res.json();
      const mapped = data.map(apiToListing);
      if (t === "available") setRealListings(mapped);
      else setRealSeekers(mapped);
    } catch { /* ignore */ }
  }

  useEffect(() => {
    loadListings("available");
    loadListings("looking");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayListings = realListings.length > 0 ? realListings : LISTINGS;
  // Seekers from API are stored as Listing; cast to Seeker for compatibility view
  const displaySeekers  = realSeekers.length  > 0
    ? realSeekers.map(l => ({ id: l.id as unknown as number, initial: l.poster.initial, color: l.poster.color, name: l.poster.name, city: l.city, neighborhood: l.neighborhood, budget: l.price, moveIn: l.availableFrom, type: l.type as "room" | "apartment" | "co-search", showProfile: l.poster.showProfile, note: l.description, compatibility: l.compatibility, yandeNote: l.yandeNote }))
    : SEEKERS;

  return (
    <div style={{ minHeight: "100dvh", background: IVORY, paddingBottom: 120 }}>

      {/* ── Header ── */}
      <div style={{ background: `linear-gradient(160deg, ${PLUM} 0%, #2E0A1C 100%)`, padding: "52px 20px 24px", position: "relative", overflow: "hidden" }}>
        {/* Petal bg */}
        <svg style={{ position: "absolute", right: -30, top: -30, opacity: 0.05 }} width="220" height="220" viewBox="0 0 220 220" fill="none">
          {[0,1,2,3,4,5].map(i => { const a = (i/6)*Math.PI*2; return <ellipse key={i} cx={110+Math.cos(a)*60} cy={110+Math.sin(a)*60} rx="32" ry="54" fill="white" transform={`rotate(${i*60} ${110+Math.cos(a)*60} ${110+Math.sin(a)*60})`} />; })}
        </svg>

        {onBack ? (
          <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em" }}>INTRODUCTIONS</span>
          </button>
        ) : (
          <Link href="/member/introductions" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16, textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em" }}>INTRODUCTIONS</span>
          </Link>
        )}

        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>✦ GIRLMATE</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 28, color: "white", lineHeight: 1.1, marginBottom: 6 }}>
          Find your next<br />home & Bloomie.
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
          Rooms · Apartments · Subletting · Co-search · Worldwide
        </p>

        {quizDone ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,31,125,0.15)", border: `1px solid ${PINK}44`, borderRadius: 12, padding: "10px 14px" }}>
            <span style={{ color: PINK, fontSize: 13 }}>✦</span>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.65)" }}>Roommate profile complete — compatibility active</p>
          </div>
        ) : (
          <button onClick={() => setShowQuiz(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 12, padding: "11px 16px", cursor: "pointer", width: "100%" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: PINK, flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.7)", flex: 1, textAlign: "left" }}>
              Complete your roommate profile to unlock compatibility scores
            </p>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", background: "white", borderBottom: "1px solid #F0EBE4", position: "sticky", top: 0, zIndex: 20 }}>
        {([{ k: "available", l: "AVAILABLE" }, { k: "looking", l: "LOOKING" }] as { k: Tab; l: string }[]).map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{ flex: 1, padding: "14px 0", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: tab === t.k ? PINK : "#bbb", background: "none", border: "none", cursor: "pointer", borderBottom: `2px solid ${tab === t.k ? PINK : "transparent"}`, transition: "all 0.15s" }}>
            {t.l}
          </button>
        ))}
        <button onClick={() => setShowPost(true)} style={{ padding: "10px 18px", background: PINK, color: "white", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", margin: "6px 12px 6px 0", borderRadius: 999, flexShrink: 0 }}>
          + POST
        </button>
      </div>

      {/* ── Feed ── */}
      <div style={{ padding: "18px 16px 100px", display: "flex", flexDirection: "column", gap: 14 }}>
        {tab === "available" && displayListings.map(l => <ListingCard key={l.id} l={l} onOpen={() => setSelectedListing(l)} />)}
        {tab === "looking"   && displaySeekers.map(s  => <SeekerCard  key={s.id} s={s as unknown as Seeker} onOpen={() => setSelectedSeeker(s as unknown as Seeker)} />)}
      </div>

      {/* ── Sheets ── */}
      {selectedListing && <ListingDetail l={selectedListing} onClose={() => setSelectedListing(null)} />}
      {selectedSeeker  && <SeekerDetail  s={selectedSeeker}  onClose={() => setSelectedSeeker(null)} />}
      {showQuiz && <QuizSheet onClose={() => setShowQuiz(false)} onComplete={() => { setQuizDone(true); setShowQuiz(false); }} />}
      {showPost && <PostSheet onClose={() => setShowPost(false)} onPosted={() => { loadListings(tab); }} />}
    </div>
  );
}
