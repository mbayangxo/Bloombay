"use client";

import { useState } from "react";
import Link from "next/link";

interface ClubOnboardingData {
  clubName: string;
  clubColor: string;
  clubCrestBg: string;
  hostName: string;
  hostWelcome: string;
  clubStory: string;
  expectations: string[];
  rules: string[];
  howItWorks: { step: string; detail: string }[];
  whatToBring?: string;
}

const DEFAULT: ClubOnboardingData = {
  clubName: "Dinner Society",
  clubColor: "#FF0055",
  clubCrestBg: "#7F0028",
  hostName: "Amanda R.",
  hostWelcome: "You're in, love. Welcome to the table.",
  clubStory:
    "Dinner Society started as a WhatsApp thread between six women who kept saying 'we should do this more often.' Two years and 312 members later, we have. This is a table where real things happen — not small talk.",
  expectations: [
    "Show up when you RSVP. Women save seats for you.",
    "Be present. One dinner, two hours, no phone at the table.",
    "Reciprocate. If someone shows up for you, show up for them.",
    "Leave no woman behind. If someone is new, bring her in.",
  ],
  rules: [
    "No phones at the table during dinner",
    "What's shared stays at the table",
    "Come with an open heart",
    "Respect every woman's story",
  ],
  howItWorks: [
    { step: "Dinners are posted", detail: "Two weeks in advance. You see the venue, the vibe, and who's hosting." },
    { step: "Reserve your seat", detail: "A small deposit holds your spot. Other women count on you showing up." },
    { step: "The host confirms", detail: "48h before. You get the full details — address, dress code, what to expect." },
    { step: "Show up", detail: "Sit down. Let the table do the rest." },
  ],
  whatToBring: "Just yourself. Smart casual — whatever makes you feel beautiful.",
};

// ─── Shared components ──────────────────────────────────────────────────────────

function Crest({ name, color, crestBg, size = 72 }: {
  name: string; color: string; crestBg: string; size?: number;
}) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white relative flex-shrink-0"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}, ${crestBg})`,
        boxShadow: `0 8px 32px ${color}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
        fontSize: size / 3.2,
      }}>
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: "1.5px solid rgba(255,255,255,0.2)", transform: "scale(0.85)" }} />
      <span className="relative z-10">{initials}</span>
    </div>
  );
}

function ProgressDots({ current, total, color }: { current: number; total: number; color: string }) {
  return (
    <div className="flex gap-1.5 px-5 pt-12 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex-1 h-0.5 rounded-full transition-all duration-500"
          style={{ background: i <= current ? color : "rgba(0,0,0,0.10)" }} />
      ))}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export function ClubOnboarding({ data = DEFAULT }: { data?: ClubOnboardingData }) {
  const [step, setStep] = useState(0);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const TOTAL = 5;

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--pale-pink-bg)" }}>
      <ProgressDots current={step} total={TOTAL} color={data.clubColor} />

      <div className="px-5 max-w-md mx-auto">

        {/* ── Step 0: The Letter ── */}
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <div className="rounded-3xl overflow-hidden"
              style={{ background: "#FDFAF5", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
              {/* "PERSONAL" stamp */}
              <div className="px-5 pt-5 pb-2 flex justify-end">
                <div className="px-2.5 py-1 rounded border-2 text-[9px] font-bold tracking-widest uppercase"
                  style={{ borderColor: data.clubColor, color: data.clubColor }}>
                  PERSONAL
                </div>
              </div>

              {/* Letter body */}
              <div className="px-6 pb-6 pt-1 flex flex-col items-center text-center gap-5">
                <Crest name={data.clubName} color={data.clubColor} crestBg={data.clubCrestBg} size={80} />
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: data.clubColor }}>
                    FROM {data.hostName.toUpperCase()}
                  </p>
                  <h1 className="text-3xl font-bold italic leading-tight mb-4"
                    style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
                    {data.hostWelcome}
                  </h1>
                  <p className="text-sm leading-relaxed" style={{ color: "#999" }}>
                    {data.hostName} personally reviewed your application and opened the door.
                    You are now part of {data.clubName}.
                  </p>
                </div>
              </div>

              <div className="mx-5 mb-5 h-px" style={{ background: "rgba(0,0,0,0.06)" }} />

              <div className="px-5 pb-5">
                <div className="rounded-2xl p-4" style={{ background: "#111111" }}>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-1"
                    style={{ color: "rgba(255,255,255,0.3)" }}>YOU JOINED</p>
                  <p className="text-lg font-bold italic text-white"
                    style={{ fontFamily: "var(--font-playfair)" }}>{data.clubName}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>BloomBay NYC</p>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(1)}
              className="w-full py-4 rounded-full font-bold text-base text-white"
              style={{ background: data.clubColor }}>
              Meet the club →
            </button>
          </div>
        )}

        {/* ── Step 1: The Story ── */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: data.clubColor }}>
                THE STORY
              </p>
              <h2 className="text-3xl font-bold italic leading-tight mb-5"
                style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
                How {data.clubName} was built.
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#666" }}>{data.clubStory}</p>
            </div>

            <div className="rounded-3xl p-5"
              style={{ background: `${data.clubColor}10`, border: `1px solid ${data.clubColor}25` }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: data.clubColor }}>
                WHAT&apos;S EXPECTED OF YOU
              </p>
              <div className="flex flex-col gap-3.5">
                {data.expectations.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-sm font-bold flex-shrink-0 mt-0.5" style={{ color: data.clubColor }}>
                      0{i + 1}
                    </span>
                    <p className="text-sm leading-snug" style={{ color: "#555" }}>{e}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(2)}
              className="w-full py-4 rounded-full font-bold text-base text-white"
              style={{ background: data.clubColor }}>
              Continue →
            </button>
          </div>
        )}

        {/* ── Step 2: How It Works ── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: data.clubColor }}>
                HOW IT WORKS
              </p>
              <h2 className="text-3xl font-bold italic leading-tight"
                style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
                How gatherings work.
              </h2>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-[19px] top-5 bottom-5 w-0.5 pointer-events-none"
                style={{ background: `${data.clubColor}20` }} />
              <div className="flex flex-col gap-6">
                {data.howItWorks.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm relative z-10"
                      style={{
                        background: i === 0 ? data.clubColor : "white",
                        color: i === 0 ? "white" : data.clubColor,
                        border: `2px solid ${i === 0 ? data.clubColor : `${data.clubColor}30`}`,
                      }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="font-bold text-sm mb-0.5" style={{ color: "#111111" }}>{item.step}</p>
                      <p className="text-sm leading-snug" style={{ color: "#888" }}>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {data.whatToBring && (
              <div className="rounded-2xl p-4 flex gap-3 items-start" style={{ background: "#FFF0F5" }}>
                <span style={{ color: data.clubColor, fontSize: "16px", lineHeight: 1 }}>✦</span>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: data.clubColor }}>
                    WHAT TO BRING
                  </p>
                  <p className="text-sm" style={{ color: "#666" }}>{data.whatToBring}</p>
                </div>
              </div>
            )}

            <div className="rounded-2xl p-4 flex items-start gap-3"
              style={{ background: "white", border: "1px solid #F0E0E8" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={data.clubColor} strokeWidth="1.8"
                className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <circle cx="12" cy="16" r="0.5" fill={data.clubColor} />
              </svg>
              <p className="text-xs leading-relaxed" style={{ color: "#888" }}>
                If you can&apos;t make it, cancel at least 24 hours in advance so another woman can take your seat.
              </p>
            </div>

            <button onClick={() => setStep(3)}
              className="w-full py-4 rounded-full font-bold text-base text-white"
              style={{ background: data.clubColor }}>
              Continue →
            </button>
          </div>
        )}

        {/* ── Step 3: House Rules ── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: data.clubColor }}>
                CLUB RULES
              </p>
              <h2 className="text-3xl font-bold italic leading-tight mb-1"
                style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
                The house rules.
              </h2>
              <p className="text-sm" style={{ color: "#bbb" }}>Accept these to enter the Clubhouse.</p>
            </div>

            <div className="rounded-3xl overflow-hidden" style={{ background: "#111111" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[9px] font-bold tracking-[0.3em] uppercase"
                  style={{ color: "rgba(255,255,255,0.25)" }}>
                  {data.clubName.toUpperCase()} · BLOOMBAY
                </p>
              </div>
              {data.rules.map((rule, i) => (
                <div key={i} className="px-5 py-4 flex items-start gap-4"
                  style={{ borderBottom: i < data.rules.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <span className="text-sm font-bold flex-shrink-0" style={{ color: data.clubColor }}>0{i + 1}</span>
                  <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>{rule}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setRulesAccepted(!rulesAccepted)} className="flex items-start gap-3 text-left w-full">
              <div className="w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                style={{
                  background: rulesAccepted ? data.clubColor : "white",
                  border: `2px solid ${rulesAccepted ? data.clubColor : "#E0E0E0"}`,
                }}>
                {rulesAccepted && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 5l2.5 2.5L9 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm leading-relaxed" style={{ color: "#666" }}>
                I have read and I accept these club rules.
              </span>
            </button>

            <button
              onClick={() => { if (rulesAccepted) setStep(4); }}
              className="w-full py-4 rounded-full font-bold text-base text-white transition-all"
              style={{ background: rulesAccepted ? data.clubColor : "#E8E8E8", cursor: rulesAccepted ? "pointer" : "default" }}>
              {rulesAccepted ? "Accept & Enter →" : "Accept the rules to continue"}
            </button>
          </div>
        )}

        {/* ── Step 4: Your Stamp ── */}
        {step === 4 && (
          <div className="flex flex-col items-center text-center gap-6 pt-2">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-6" style={{ color: data.clubColor }}>
                STAMP ISSUED
              </p>
              <div className="inline-block relative">
                <Crest name={data.clubName} color={data.clubColor} crestBg={data.clubCrestBg} size={100} />
                <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "#16a34a", border: "3px solid var(--pale-pink-bg)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold italic leading-tight mb-3"
                style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
                You&apos;re inside.
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#999" }}>
                Your {data.clubName} stamp has been added to your Club Passport.
                The table is set. Your seat is waiting.
              </p>
            </div>

            {/* Passport preview */}
            <div className="w-full rounded-2xl overflow-hidden"
              style={{ background: "#FDFAF5", border: "1.5px solid rgba(0,0,0,0.06)" }}>
              <div style={{ height: "3px", background: `linear-gradient(90deg, ${data.clubColor}, ${data.clubCrestBg})` }} />
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Crest name={data.clubName} color={data.clubColor} crestBg={data.clubCrestBg} size={44} />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-bold text-sm" style={{ color: "#111111" }}>{data.clubName}</p>
                    <p className="text-[11px]" style={{ color: "#ccc" }}>New member · 0 events</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: "#FFF0F5", color: "#FF1F7D" }}>Joined ✓</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.07)" }}>
                  <div className="h-full rounded-full" style={{ background: data.clubColor, width: "33%" }} />
                </div>
                <div className="flex justify-between mt-1.5 px-0.5">
                  {["Member", "Regular", "Insider"].map((l, i) => (
                    <span key={l} className="text-[9px] font-bold"
                      style={{ color: i === 0 ? data.clubColor : "#ddd" }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <Link href="/member/happenings"
                className="w-full py-4 rounded-full font-bold text-base text-white text-center"
                style={{ background: data.clubColor, textDecoration: "none" }}>
                Reserve your first seat
              </Link>
              <Link href="/member/clubs"
                className="w-full py-3 rounded-full font-semibold text-sm text-center"
                style={{ color: data.clubColor, border: `1.5px solid ${data.clubColor}30`, textDecoration: "none" }}>
                Back to Club House
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
