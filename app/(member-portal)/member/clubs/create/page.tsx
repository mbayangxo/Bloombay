"use client";

import { useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";

const CLUB_CATEGORIES = [
  "Dining & Food", "Arts & Culture", "Books & Ideas", "Wellness & Movement",
  "Social & Lifestyle", "Travel & Adventure", "Career & Growth", "Community Service",
];

const CLUB_EMOJIS = ["🌸","🍷","📚","🎨","🏃‍♀️","✈️","🌿","☕","🎵","🥂","💃","🌺","🧘","🎭","🍳","🖼️","🌙","🌷","🎬","🌊"];

const ACCENT_COLORS = [
  "#FF1F7D","#FF69B4","#C084FC","#60A5FA","#34D399","#FB923C","#F472B6","#818CF8","#A78BFA","#2DD4BF",
];

const FREQUENCIES = ["Weekly", "Bi-weekly", "Monthly", "As needed"];

const MEMBERSHIP_TYPES = [
  { id: "open",    label: "Open",         desc: "Any BloomBay member can request to join", emoji: "🌐" },
  { id: "curated", label: "Curated",      desc: "You review and approve each member yourself", emoji: "✦" },
  { id: "invite",  label: "Invite-Only",  desc: "You personally invite each woman", emoji: "🔒" },
];

export default function CreateClubPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Club Identity
  const [clubName, setClubName] = useState("");
  const [clubEmoji, setClubEmoji] = useState("🌸");
  const [accentColor, setAccentColor] = useState(PINK);
  const [category, setCategory] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  // Step 2 — About the Club
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");
  const [capacity, setCapacity] = useState("12");

  // Step 3 — Membership + Confirm
  const [membershipType, setMembershipType] = useState("");

  function canNext(): boolean {
    if (step === 1) return clubName.trim().length >= 2 && !!category && neighborhood.trim().length >= 2;
    if (step === 2) return description.trim().length >= 20 && !!frequency;
    if (step === 3) return !!membershipType;
    return false;
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: "#FDF4EC", paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="max-w-xs w-full">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6"
            style={{ background: `${accentColor}18`, border: `1.5px solid ${accentColor}33` }}>
            {clubEmoji}
          </div>
          <p className="text-[9px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color: accentColor }}>
            CLUB CREATED
          </p>
          <h2 className="text-2xl font-bold italic mb-3"
            style={{ fontFamily: "var(--font-playfair)", color: "#111", lineHeight: 1.2 }}>
            {clubName || "Your Club"} is live.
          </h2>
          <p className="text-sm leading-relaxed mb-8"
            style={{ color: "#888", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
            Your club is now visible to BloomBay members. Start inviting women and hosting gatherings.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/member/clubs"
              className="block w-full py-4 rounded-2xl text-sm font-bold text-center transition-all active:scale-[0.98]"
              style={{ background: accentColor, color: "white" }}>
              View My Clubs
            </Link>
            <Link href="/member/apply-club-mama"
              className="block w-full py-3.5 rounded-2xl text-sm font-semibold text-center transition-all active:scale-[0.98]"
              style={{ background: "#111", color: PINK }}>
              Apply for Club Mama Stipend ✦
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: "#FDF4EC" }}>

      {/* Header */}
      <div className="relative px-5 pb-6"
        style={{
          background: "linear-gradient(180deg, #FFF0E8 0%, #FDF4EC 100%)",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 56px)",
        }}>
        <Link href="/member/clubs"
          className="absolute left-5 flex items-center gap-1.5 transition-opacity active:opacity-60"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 56px)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>

        <div className="text-center pt-8">
          <p className="text-[9px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color: PINK }}>
            ✦ START A CLUB
          </p>
          <h1 className="font-bold italic leading-tight mb-1"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(24px,7vw,30px)", color: "#111" }}>
            Create your gathering.
          </h1>
          <p className="text-xs" style={{ color: "#aaa", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
            Every great club starts with one woman who just started.
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5 px-5 mb-8 mt-4">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex-1 h-1 rounded-full transition-all duration-400"
            style={{ background: s <= step ? PINK : "rgba(0,0,0,0.1)" }} />
        ))}
      </div>

      <div className="px-5">

        {/* ── STEP 1: Club Identity ── */}
        {step === 1 && (
          <div style={{ animation: "fadeSlide 0.22s ease-out" }}>
            <div className="mb-6">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(0,0,0,0.25)" }}>
                STEP 1 OF 3
              </p>
              <h2 className="text-xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>
                Club Identity
              </h2>
            </div>

            {/* Emoji + color preview */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: `${accentColor}18`, border: `2px solid ${accentColor}33`, boxShadow: `0 8px 24px ${accentColor}22` }}>
                {clubEmoji}
              </div>
            </div>

            {/* Emoji picker */}
            <div className="mb-5">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-2.5" style={{ color: "rgba(0,0,0,0.3)" }}>CLUB ICON</p>
              <div className="flex flex-wrap gap-2">
                {CLUB_EMOJIS.map(em => (
                  <button key={em} onClick={() => setClubEmoji(em)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all active:scale-90"
                    style={{
                      background: clubEmoji === em ? `${accentColor}18` : "rgba(0,0,0,0.04)",
                      border: clubEmoji === em ? `1.5px solid ${accentColor}` : "1.5px solid rgba(0,0,0,0.07)",
                    }}>
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent color */}
            <div className="mb-5">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-2.5" style={{ color: "rgba(0,0,0,0.3)" }}>CLUB COLOR</p>
              <div className="flex gap-2.5 flex-wrap">
                {ACCENT_COLORS.map(c => (
                  <button key={c} onClick={() => setAccentColor(c)}
                    className="w-9 h-9 rounded-full transition-all active:scale-90"
                    style={{
                      background: c,
                      boxShadow: accentColor === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : "none",
                    }} />
                ))}
              </div>
            </div>

            {/* Club name */}
            <div className="mb-4">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "rgba(0,0,0,0.3)" }}>CLUB NAME *</p>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 bg-white"
                style={{ border: `1.5px solid ${clubName.trim().length >= 2 ? `${accentColor}44` : "rgba(0,0,0,0.08)"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <span style={{ fontSize: "20px" }}>{clubEmoji}</span>
                <input
                  value={clubName}
                  onChange={e => setClubName(e.target.value)}
                  placeholder="e.g. Sunday Book Girls"
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "#111", caretColor: accentColor }}
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "rgba(0,0,0,0.3)" }}>CATEGORY *</p>
              <div className="flex flex-wrap gap-2">
                {CLUB_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                    style={{
                      background: category === cat ? `${accentColor}15` : "rgba(0,0,0,0.04)",
                      border: category === cat ? `1.5px solid ${accentColor}` : "1.5px solid rgba(0,0,0,0.07)",
                      color: category === cat ? accentColor : "rgba(0,0,0,0.45)",
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Neighborhood */}
            <div className="mb-8">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "rgba(0,0,0,0.3)" }}>NEIGHBORHOOD / CITY *</p>
              <input
                value={neighborhood}
                onChange={e => setNeighborhood(e.target.value)}
                placeholder="e.g. Brooklyn, Williamsburg"
                className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none bg-white"
                style={{
                  border: `1.5px solid ${neighborhood.trim().length >= 2 ? `${accentColor}44` : "rgba(0,0,0,0.08)"}`,
                  color: "#111",
                  caretColor: accentColor,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              />
            </div>
          </div>
        )}

        {/* ── STEP 2: About the Club ── */}
        {step === 2 && (
          <div style={{ animation: "fadeSlide 0.22s ease-out" }}>
            <div className="mb-6">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(0,0,0,0.25)" }}>
                STEP 2 OF 3
              </p>
              <h2 className="text-xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>
                About Your Club
              </h2>
              <p className="text-xs mt-1" style={{ color: "#aaa", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
                Help women understand what to expect.
              </p>
            </div>

            {/* Club name + emoji reminder */}
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-5"
              style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}22` }}>
              <span style={{ fontSize: "22px" }}>{clubEmoji}</span>
              <div>
                <p className="font-bold text-sm" style={{ color: "#111" }}>{clubName || "Your Club"}</p>
                <p className="text-[10px]" style={{ color: "#aaa" }}>{category} · {neighborhood}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "rgba(0,0,0,0.3)" }}>DESCRIPTION *</p>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What happens at your gatherings? Who is this for? What&apos;s the vibe?"
                rows={4}
                className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none resize-none bg-white"
                style={{
                  border: `1.5px solid ${description.length >= 20 ? `${accentColor}44` : "rgba(0,0,0,0.08)"}`,
                  color: "#111",
                  caretColor: accentColor,
                  lineHeight: 1.65,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              />
              <p className="text-[9px] mt-1 text-right"
                style={{ color: description.length >= 20 ? `${accentColor}99` : "rgba(0,0,0,0.2)" }}>
                {description.length} chars {description.length < 20 ? `(${20 - description.length} more)` : "✓"}
              </p>
            </div>

            {/* Frequency */}
            <div className="mb-5">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(0,0,0,0.3)" }}>HOW OFTEN DO YOU MEET? *</p>
              <div className="flex gap-2 flex-wrap">
                {FREQUENCIES.map(f => (
                  <button key={f} onClick={() => setFrequency(f)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                    style={{
                      background: frequency === f ? `${accentColor}15` : "rgba(0,0,0,0.04)",
                      border: frequency === f ? `1.5px solid ${accentColor}` : "1.5px solid rgba(0,0,0,0.07)",
                      color: frequency === f ? accentColor : "rgba(0,0,0,0.45)",
                    }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity */}
            <div className="mb-8">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(0,0,0,0.3)" }}>
                MAX MEMBERS
              </p>
              <div className="flex items-center gap-2">
                {["8", "12", "20", "30", "50+"].map(n => (
                  <button key={n} onClick={() => setCapacity(n)}
                    className="flex-1 py-3 rounded-xl text-xs font-bold transition-all active:scale-95"
                    style={{
                      background: capacity === n ? `${accentColor}15` : "rgba(0,0,0,0.04)",
                      border: capacity === n ? `1.5px solid ${accentColor}` : "1.5px solid rgba(0,0,0,0.07)",
                      color: capacity === n ? accentColor : "rgba(0,0,0,0.4)",
                    }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Membership + Confirm ── */}
        {step === 3 && (
          <div style={{ animation: "fadeSlide 0.22s ease-out" }}>
            <div className="mb-6">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(0,0,0,0.25)" }}>
                STEP 3 OF 3
              </p>
              <h2 className="text-xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>
                Membership & Preview
              </h2>
            </div>

            {/* Membership type */}
            <div className="mb-6">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(0,0,0,0.3)" }}>HOW DO WOMEN JOIN? *</p>
              <div className="flex flex-col gap-2.5">
                {MEMBERSHIP_TYPES.map(mt => (
                  <button key={mt.id} onClick={() => setMembershipType(mt.id)}
                    className="flex items-start gap-3 rounded-2xl p-4 text-left transition-all active:scale-[0.98]"
                    style={{
                      background: membershipType === mt.id ? `${accentColor}10` : "white",
                      border: membershipType === mt.id ? `1.5px solid ${accentColor}` : "1.5px solid rgba(0,0,0,0.07)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: membershipType === mt.id ? `${accentColor}15` : "rgba(0,0,0,0.05)" }}>
                      {mt.emoji}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: membershipType === mt.id ? accentColor : "#111" }}>{mt.label}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#aaa" }}>{mt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Club preview card */}
            {membershipType && (
              <div className="rounded-2xl overflow-hidden mb-6"
                style={{ background: "#111", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", animation: "fadeSlide 0.2s ease-out" }}>
                {/* Header band */}
                <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}88 100%)` }} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ background: `${accentColor}22` }}>
                      {clubEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black italic text-lg leading-tight"
                        style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,238,220,0.92)" }}>
                        {clubName || "Your Club"}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {category} · {neighborhood}
                      </p>
                    </div>
                  </div>
                  {description && (
                    <p className="text-xs leading-relaxed mb-4"
                      style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
                      &ldquo;{description.slice(0, 100)}{description.length > 100 ? "…" : ""}&rdquo;
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {frequency && (
                      <span className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: `${accentColor}22`, color: accentColor }}>
                        {frequency}
                      </span>
                    )}
                    <span className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}>
                      Max {capacity} members
                    </span>
                    <span className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}>
                      {MEMBERSHIP_TYPES.find(m => m.id === membershipType)?.label}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Club Mama upsell */}
            <Link href="/member/apply-club-mama"
              className="flex items-center gap-3 rounded-2xl p-4 mb-8 transition-all active:scale-[0.98] block"
              style={{ background: `${PINK}0E`, border: `1px solid ${PINK}22` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${PINK}18` }}>
                💸
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: PINK }}>Apply for Club Mama stipend</p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(0,0,0,0.35)" }}>Earn $250/month to run this club professionally.</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={`${PINK}88`} strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-4 rounded-2xl text-sm font-bold transition-all active:scale-[0.97]"
              style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.45)", border: "1px solid rgba(0,0,0,0.08)" }}>
              ← Back
            </button>
          )}
          <button
            onClick={() => {
              if (!canNext()) return;
              if (step < 3) { setStep(s => s + 1); }
              else { setSubmitted(true); }
            }}
            className="flex-1 py-4 rounded-2xl text-sm font-bold transition-all active:scale-[0.97]"
            style={{
              background: canNext() ? accentColor : "rgba(0,0,0,0.08)",
              color: canNext() ? "white" : "rgba(0,0,0,0.2)",
              boxShadow: canNext() ? `0 6px 20px ${accentColor}44` : "none",
            }}>
            {step === 3 ? `Create ${clubEmoji} Club` : "Continue →"}
          </button>
        </div>

      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
