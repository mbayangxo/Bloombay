"use client";

import { useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";

const CLUB_CATEGORIES = [
  "Dining & Food", "Arts & Culture", "Books & Ideas", "Wellness & Movement",
  "Social & Lifestyle", "Travel & Adventure", "Career & Growth", "Community Service",
];

const FREQUENCIES = ["Weekly", "Bi-weekly", "Monthly", "Quarterly"];

const MEMBERSHIP_TYPES = [
  { id: "open",    label: "Open",         desc: "Any BloomBay member can request to join" },
  { id: "curated", label: "Curated",      desc: "You review and approve each member yourself" },
  { id: "invite",  label: "Invite-Only",  desc: "You personally invite each woman" },
];

const CLUB_EMOJIS = ["🌸","🍷","📚","🎨","🏃‍♀️","✈️","🌿","☕","🎵","🥂","💃","🌺","🧘","🎭","🍳","🖼️","🌙","🌷","🎬","🌊"];

const REQUIREMENTS = [
  "Host at least 2 club events per month",
  "Maintain a minimum of 8 active members",
  "Respond to member questions within 48 hours",
  "Submit a brief monthly recap to BloomBay",
];

export default function ApplyClubMamaPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Club Identity
  const [clubName, setClubName] = useState("");
  const [clubEmoji, setClubEmoji] = useState("🌸");
  const [category, setCategory] = useState("");
  const [tagline, setTagline] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  // Step 2 — Club Structure
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");
  const [capacity, setCapacity] = useState("12");
  const [membershipType, setMembershipType] = useState("");

  // Step 3 — About You
  const [whyRun, setWhyRun] = useState("");
  const [experience, setExperience] = useState("");
  const [vision, setVision] = useState("");

  // Step 4 — Commitment
  const [agreeCommit, setAgreeCommit] = useState(false);
  const [agreeStipend, setAgreeStipend] = useState(false);
  const [agreeStandards, setAgreeStandards] = useState(false);

  function canNext(): boolean {
    if (step === 1) return clubName.trim().length >= 2 && !!category && neighborhood.trim().length >= 2;
    if (step === 2) return description.trim().length >= 30 && !!frequency && !!membershipType;
    if (step === 3) return whyRun.trim().length >= 40 && experience.trim().length >= 20;
    if (step === 4) return agreeCommit && agreeStipend && agreeStandards;
    return false;
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: "#0A0A0A", paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="max-w-xs w-full">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
            style={{ background: `${PINK}18`, border: `1.5px solid ${PINK}33` }}>
            🌸
          </div>
          <p className="text-[9px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color: PINK }}>
            APPLICATION SUBMITTED
          </p>
          <h2 className="text-2xl font-bold italic mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,238,220,0.92)", lineHeight: 1.2 }}>
            You&apos;re in the running.
          </h2>
          <p className="text-sm leading-relaxed mb-8"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
            BloomBay reviews every application personally. If you&apos;re selected, you&apos;ll hear from us within 2 weeks.
          </p>
          <Link href="/member/lounge"
            className="block w-full py-4 rounded-2xl text-sm font-bold text-center transition-all active:scale-[0.98]"
            style={{ background: PINK, color: "white" }}>
            Back to My Apartment
          </Link>
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: "#0A0A0A" }}>

      {/* Header */}
      <div className="relative px-5 pt-14 pb-6"
        style={{
          background: "linear-gradient(180deg, #0E0808 0%, #0A0A0A 100%)",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 56px)",
        }}>
        <Link href="/member/lounge"
          className="absolute left-5 flex items-center gap-1.5 transition-opacity active:opacity-60"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 56px)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>

        <div className="text-center">
          <p className="text-[9px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color: PINK }}>
            ✦ CLUB MAMA PROGRAM
          </p>
          <h1 className="font-bold italic leading-tight"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,7vw,32px)", color: "rgba(255,238,220,0.92)" }}>
            Run your own club.
          </h1>
          <h1 className="font-bold italic leading-tight mb-3"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,7vw,32px)", color: PINK }}>
            Get paid for it.
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: `${PINK}15`, border: `1px solid ${PINK}28` }}>
            <span style={{ fontSize: "14px" }}>💸</span>
            <p className="text-xs font-bold" style={{ color: PINK }}>$250/month stipend</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5 px-5 mb-8">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex-1 h-1 rounded-full transition-all duration-400"
            style={{ background: s <= step ? PINK : "rgba(255,255,255,0.1)" }} />
        ))}
      </div>

      <div className="px-5">

        {/* ── STEP 1: Club Identity ── */}
        {step === 1 && (
          <div style={{ animation: "fadeSlide 0.22s ease-out" }}>
            <div className="mb-6">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                STEP 1 OF 4
              </p>
              <h2 className="text-xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,238,220,0.9)" }}>
                Your Club Identity
              </h2>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
                What is this club, in its essence?
              </p>
            </div>

            {/* Emoji picker */}
            <div className="mb-5">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-2.5" style={{ color: "rgba(255,255,255,0.3)" }}>CLUB ICON</p>
              <div className="flex flex-wrap gap-2">
                {CLUB_EMOJIS.map(em => (
                  <button key={em} onClick={() => setClubEmoji(em)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all active:scale-90"
                    style={{
                      background: clubEmoji === em ? `${PINK}22` : "rgba(255,255,255,0.05)",
                      border: clubEmoji === em ? `1.5px solid ${PINK}` : "1.5px solid rgba(255,255,255,0.08)",
                    }}>
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Club name */}
            <div className="mb-4">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>CLUB NAME *</p>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
                style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: "20px" }}>{clubEmoji}</span>
                <input
                  value={clubName}
                  onChange={e => setClubName(e.target.value)}
                  placeholder="e.g. Sunday Book Girls"
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "rgba(255,238,220,0.85)", caretColor: PINK }}
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>CATEGORY *</p>
              <div className="flex flex-wrap gap-2">
                {CLUB_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                    style={{
                      background: category === cat ? `${PINK}22` : "rgba(255,255,255,0.05)",
                      border: category === cat ? `1.5px solid ${PINK}` : "1.5px solid rgba(255,255,255,0.08)",
                      color: category === cat ? PINK : "rgba(255,255,255,0.45)",
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tagline */}
            <div className="mb-4">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                TAGLINE <span style={{ color: "rgba(255,255,255,0.18)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>optional</span>
              </p>
              <input
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="e.g. Books, tea, and honest conversations"
                className="w-full rounded-2xl px-4 py-3.5 text-sm bg-transparent outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,238,220,0.8)",
                  caretColor: PINK,
                }}
              />
            </div>

            {/* Neighborhood */}
            <div className="mb-8">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>NEIGHBORHOOD / CITY *</p>
              <input
                value={neighborhood}
                onChange={e => setNeighborhood(e.target.value)}
                placeholder="e.g. Brooklyn, Crown Heights"
                className="w-full rounded-2xl px-4 py-3.5 text-sm bg-transparent outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,238,220,0.8)",
                  caretColor: PINK,
                }}
              />
            </div>
          </div>
        )}

        {/* ── STEP 2: Club Structure ── */}
        {step === 2 && (
          <div style={{ animation: "fadeSlide 0.22s ease-out" }}>
            <div className="mb-6">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                STEP 2 OF 4
              </p>
              <h2 className="text-xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,238,220,0.9)" }}>
                The Structure
              </h2>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
                How will this club run, day to day?
              </p>
            </div>

            {/* Description */}
            <div className="mb-5">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                WHAT IS THIS CLUB ABOUT? *
              </p>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the experience — what happens at a typical gathering, what kind of women it&apos;s for, why it matters..."
                rows={4}
                className="w-full rounded-2xl px-4 py-3.5 text-sm bg-transparent outline-none resize-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: `1.5px solid ${description.length >= 30 ? `${PINK}55` : "rgba(255,255,255,0.1)"}`,
                  color: "rgba(255,238,220,0.8)",
                  caretColor: PINK,
                  lineHeight: 1.65,
                }}
              />
              <p className="text-[9px] mt-1 text-right"
                style={{ color: description.length >= 30 ? `${PINK}88` : "rgba(255,255,255,0.2)" }}>
                {description.length} chars {description.length < 30 ? `(${30 - description.length} more)` : "✓"}
              </p>
            </div>

            {/* Meeting frequency */}
            <div className="mb-5">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>MEETING FREQUENCY *</p>
              <div className="flex gap-2 flex-wrap">
                {FREQUENCIES.map(f => (
                  <button key={f} onClick={() => setFrequency(f)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                    style={{
                      background: frequency === f ? `${PINK}22` : "rgba(255,255,255,0.05)",
                      border: frequency === f ? `1.5px solid ${PINK}` : "1.5px solid rgba(255,255,255,0.08)",
                      color: frequency === f ? PINK : "rgba(255,255,255,0.45)",
                    }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity */}
            <div className="mb-5">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                CAPACITY (MAX MEMBERS)
              </p>
              <div className="flex items-center gap-3">
                {["8", "12", "20", "30", "50"].map(n => (
                  <button key={n} onClick={() => setCapacity(n)}
                    className="flex-1 py-3 rounded-xl text-xs font-bold transition-all active:scale-95"
                    style={{
                      background: capacity === n ? `${PINK}22` : "rgba(255,255,255,0.05)",
                      border: capacity === n ? `1.5px solid ${PINK}` : "1.5px solid rgba(255,255,255,0.08)",
                      color: capacity === n ? PINK : "rgba(255,255,255,0.4)",
                    }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Membership type */}
            <div className="mb-8">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>MEMBERSHIP TYPE *</p>
              <div className="flex flex-col gap-2.5">
                {MEMBERSHIP_TYPES.map(mt => (
                  <button key={mt.id} onClick={() => setMembershipType(mt.id)}
                    className="flex items-start gap-3 rounded-2xl p-4 text-left transition-all active:scale-[0.98]"
                    style={{
                      background: membershipType === mt.id ? `${PINK}15` : "rgba(255,255,255,0.04)",
                      border: membershipType === mt.id ? `1.5px solid ${PINK}55` : "1.5px solid rgba(255,255,255,0.07)",
                    }}>
                    <div className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                      style={{ border: `2px solid ${membershipType === mt.id ? PINK : "rgba(255,255,255,0.2)"}` }}>
                      {membershipType === mt.id && (
                        <div className="w-2 h-2 rounded-full" style={{ background: PINK }} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: membershipType === mt.id ? PINK : "rgba(255,238,220,0.7)" }}>
                        {mt.label}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{mt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: About You ── */}
        {step === 3 && (
          <div style={{ animation: "fadeSlide 0.22s ease-out" }}>
            <div className="mb-6">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                STEP 3 OF 4
              </p>
              <h2 className="text-xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,238,220,0.9)" }}>
                About You
              </h2>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
                We choose Club Mamas who are already natural connectors.
              </p>
            </div>

            {/* Why run this club */}
            <div className="mb-5">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                WHY DO YOU WANT TO RUN THIS CLUB? *
              </p>
              <p className="text-[10px] italic mb-2" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-instrument)" }}>
                What gap does it fill? What&apos;s the feeling you want to create?
              </p>
              <textarea
                value={whyRun}
                onChange={e => setWhyRun(e.target.value)}
                placeholder="Tell us what drives you..."
                rows={4}
                className="w-full rounded-2xl px-4 py-3.5 text-sm bg-transparent outline-none resize-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: `1.5px solid ${whyRun.length >= 40 ? `${PINK}55` : "rgba(255,255,255,0.1)"}`,
                  color: "rgba(255,238,220,0.8)",
                  caretColor: PINK,
                  lineHeight: 1.65,
                }}
              />
              <p className="text-[9px] mt-1 text-right"
                style={{ color: whyRun.length >= 40 ? `${PINK}88` : "rgba(255,255,255,0.2)" }}>
                {whyRun.length} chars {whyRun.length < 40 ? `(${40 - whyRun.length} more)` : "✓"}
              </p>
            </div>

            {/* Community experience */}
            <div className="mb-5">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                HAVE YOU BUILT COMMUNITY BEFORE? *
              </p>
              <p className="text-[10px] italic mb-2" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-instrument)" }}>
                Hosting events, running groups, organizing anything — big or small.
              </p>
              <textarea
                value={experience}
                onChange={e => setExperience(e.target.value)}
                placeholder="Even informal counts — a Sunday dinner you always host, a group chat you keep alive..."
                rows={3}
                className="w-full rounded-2xl px-4 py-3.5 text-sm bg-transparent outline-none resize-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: `1.5px solid ${experience.length >= 20 ? `${PINK}55` : "rgba(255,255,255,0.1)"}`,
                  color: "rgba(255,238,220,0.8)",
                  caretColor: PINK,
                  lineHeight: 1.65,
                }}
              />
            </div>

            {/* Vision */}
            <div className="mb-8">
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                WHAT DOES YOUR FIRST MONTH LOOK LIKE?{" "}
                <span style={{ color: "rgba(255,255,255,0.18)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>optional</span>
              </p>
              <textarea
                value={vision}
                onChange={e => setVision(e.target.value)}
                placeholder="Paint the picture — first gathering, first 10 members, first memorable moment..."
                rows={3}
                className="w-full rounded-2xl px-4 py-3.5 text-sm bg-transparent outline-none resize-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,238,220,0.8)",
                  caretColor: PINK,
                  lineHeight: 1.65,
                }}
              />
            </div>
          </div>
        )}

        {/* ── STEP 4: The Commitment ── */}
        {step === 4 && (
          <div style={{ animation: "fadeSlide 0.22s ease-out" }}>
            <div className="mb-6">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                STEP 4 OF 4
              </p>
              <h2 className="text-xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,238,220,0.9)" }}>
                The Commitment
              </h2>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
                Club Mamas are held to a standard. This is what we ask.
              </p>
            </div>

            {/* Stipend card */}
            <div className="rounded-2xl p-5 mb-6 relative overflow-hidden"
              style={{ background: `${PINK}12`, border: `1.5px solid ${PINK}30` }}>
              <div className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${PINK} 0%, transparent 70%)`, opacity: 0.1, transform: "translate(30%, -30%)" }} />
              <div className="relative">
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: `${PINK}99` }}>
                  YOUR MONTHLY STIPEND
                </p>
                <p className="text-3xl font-black mb-1"
                  style={{ fontFamily: "var(--font-playfair)", color: PINK }}>
                  $250
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Paid monthly, directly to you. BloomBay covers club operating costs separately.
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="rounded-2xl p-4 mb-6"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[9px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
                REQUIREMENTS
              </p>
              <div className="flex flex-col gap-2.5">
                {REQUIREMENTS.map((req, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span style={{ color: PINK, fontSize: "10px", marginTop: "2px", flexShrink: 0 }}>✦</span>
                    <p className="text-sm" style={{ color: "rgba(255,238,220,0.6)", lineHeight: 1.5 }}>{req}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Club preview */}
            <div className="rounded-2xl p-4 mb-6 flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${PINK}15` }}>
                {clubEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: "rgba(255,238,220,0.85)" }}>
                  {clubName || "Your Club"}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {category || "Category"} · {neighborhood || "Location"}
                </p>
                {frequency && (
                  <p className="text-[10px] mt-0.5" style={{ color: `${PINK}88` }}>
                    {frequency} · Max {capacity} members
                  </p>
                )}
              </div>
            </div>

            {/* Agreements */}
            <div className="flex flex-col gap-3 mb-8">
              {[
                { label: "I commit to the program requirements above", state: agreeCommit, set: setAgreeCommit },
                { label: "I understand stipend is contingent on maintaining active membership and event standards", state: agreeStipend, set: setAgreeStipend },
                { label: "I agree to uphold BloomBay's community standards and values", state: agreeStandards, set: setAgreeStandards },
              ].map(({ label, state, set }, i) => (
                <button key={i} onClick={() => set(s => !s)}
                  className="flex items-start gap-3 text-left transition-all active:scale-[0.98]">
                  <div className="w-5 h-5 rounded-md flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                    style={{
                      background: state ? PINK : "rgba(255,255,255,0.06)",
                      border: state ? `2px solid ${PINK}` : "2px solid rgba(255,255,255,0.15)",
                    }}>
                    {state && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="2 6 5 9 10 3"/>
                      </svg>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: state ? "rgba(255,238,220,0.75)" : "rgba(255,255,255,0.35)" }}>
                    {label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-4 rounded-2xl text-sm font-bold transition-all active:scale-[0.97]"
              style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
              ← Back
            </button>
          )}
          <button
            onClick={() => {
              if (!canNext()) return;
              if (step < 4) { setStep(s => s + 1); }
              else { setSubmitted(true); }
            }}
            className="flex-1 py-4 rounded-2xl text-sm font-bold transition-all active:scale-[0.97]"
            style={{
              background: canNext() ? PINK : "rgba(255,255,255,0.08)",
              color: canNext() ? "white" : "rgba(255,255,255,0.2)",
              boxShadow: canNext() ? `0 6px 20px ${PINK}44` : "none",
            }}>
            {step === 4 ? "Submit Application ✦" : "Continue →"}
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
