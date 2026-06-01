"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ClubOnboardingData {
  clubName: string;
  hostName: string;
  hostWelcome: string;
  clubStory: string;
  expectations: string[];
  rules: string[];
  howGatheringsWork: string;
  whatToBring?: string;
  firstAction: "introduce" | "seat" | "payment";
  color: string;
}

const DEFAULT: ClubOnboardingData = {
  clubName: "Dinner Society",
  hostName: "Amanda R.",
  hostWelcome: "You&apos;re in. Welcome to the table.",
  clubStory:
    "Dinner Society started as a WhatsApp thread between six women who kept saying 'we should do this more often.' Two years and 312 members later, we have. This is a table where real things happen — not small talk.",
  expectations: [
    "Show up when you RSVP. Women save seats for you.",
    "Be present. One dinner, two hours, no phone at the table.",
    "Reciprocate. If someone shows up for you, show up for them.",
    "Leave no woman behind. If someone is new, bring them in.",
  ],
  rules: [
    "No phones at the table during dinner",
    "What&apos;s shared stays at the table",
    "Come with an open heart",
    "Respect every woman&apos;s story",
  ],
  howGatheringsWork:
    "Dinners are posted 2 weeks in advance. You reserve a seat with a $1 deposit. The host confirms 48h before. Show up, sit down, and let the table do the rest.",
  whatToBring: "Just yourself. Dress is smart casual — whatever makes you feel beautiful.",
  firstAction: "seat",
  color: "#FF0055",
};

export function ClubOnboarding({ data = DEFAULT }: { data?: ClubOnboardingData }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const STEPS = ["Welcome", "Story", "How It Works", "Club Rules", "Your First Step"];

  return (
    <div className="min-h-screen" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Progress */}
      <div className="flex gap-1 px-5 pt-12 mb-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full flex-1 transition-all"
            style={{ background: i <= step ? data.color : "#F0D0DC" }}
          />
        ))}
      </div>
      <p className="px-5 text-xs text-gray-400 mb-8">{STEPS[step]}</p>

      <div className="max-w-md mx-auto px-5">

        {/* Step 0: Welcome from host */}
        {step === 0 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center pt-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-2xl mb-4"
                style={{ background: data.color, boxShadow: `0 6px 24px ${data.color}55` }}
              >
                {data.hostName[0]}
              </div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: data.color }}>
                FROM {data.hostName.toUpperCase()}
              </p>
              <h1
                className="text-3xl font-bold leading-tight mb-3"
                style={{ color: "#1A0514", fontFamily: "var(--font-playfair)" }}
              >
                {data.hostWelcome}
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                {data.hostName} personally approved your application.
                You&apos;re now part of {data.clubName}.
              </p>
            </div>

            <div className="rounded-3xl p-5" style={{ background: "#1A0514" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
                YOU JOINED
              </p>
              <p
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {data.clubName}
              </p>
              <p className="text-white/50 text-sm mt-1">BloomBay NYC</p>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full py-4 rounded-full font-bold text-base text-white transition-all active:scale-[0.98]"
              style={{ background: data.color }}
            >
              Meet the club →
            </button>
          </div>
        )}

        {/* Step 1: Club story */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: data.color }}>THE STORY</p>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#1A0514", fontFamily: "var(--font-playfair)" }}>
                How {data.clubName} was built.
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">{data.clubStory}</p>
            </div>

            <div className="rounded-3xl p-5 mt-2" style={{ background: `${data.color}12` }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: data.color }}>WHAT&apos;S EXPECTED OF YOU</p>
              <ul className="flex flex-col gap-3">
                {data.expectations.map((e, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="font-bold flex-shrink-0" style={{ color: data.color }}>0{i + 1}</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={() => setStep(2)} className="w-full py-4 rounded-full font-bold text-base text-white" style={{ background: data.color }}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: How gatherings work */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: data.color }}>HOW IT WORKS</p>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#1A0514", fontFamily: "var(--font-playfair)" }}>
                How gatherings work.
              </h2>
            </div>

            <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <p className="text-sm leading-relaxed text-gray-600">{data.howGatheringsWork}</p>
            </div>

            {data.whatToBring && (
              <div className="rounded-3xl p-5" style={{ background: `${data.color}12` }}>
                <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: data.color }}>WHAT TO BRING</p>
                <p className="text-sm text-gray-600">{data.whatToBring}</p>
              </div>
            )}

            <div className="bg-white rounded-3xl p-4 flex gap-3 items-start" style={{ border: "1px solid #F0D0DC" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={data.color} strokeWidth="1.8" className="flex-shrink-0 mt-0.5">
                <circle cx="10" cy="10" r="9" />
                <line x1="10" y1="7" x2="10" y2="10" />
                <circle cx="10" cy="13.5" r="0.7" fill={data.color} />
              </svg>
              <p className="text-sm text-gray-500">If you can&apos;t make it to a gathering, cancel at least 24 hours in advance so another woman can take your seat.</p>
            </div>

            <button onClick={() => setStep(3)} className="w-full py-4 rounded-full font-bold text-base text-white" style={{ background: data.color }}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 3: Club rules */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: data.color }}>CLUB RULES</p>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "#1A0514", fontFamily: "var(--font-playfair)" }}>
                The house rules.
              </h2>
              <p className="text-sm text-gray-400 mb-4">You must accept these to enter the Clubhouse.</p>
            </div>

            <div className="rounded-3xl overflow-hidden" style={{ background: "#1A0514" }}>
              {data.rules.map((rule, i) => (
                <div
                  key={i}
                  className="px-5 py-4 flex items-start gap-4"
                  style={{ borderBottom: i < data.rules.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
                >
                  <span className="text-sm font-bold flex-shrink-0" style={{ color: data.color }}>0{i + 1}</span>
                  <span className="text-sm text-white/80">{rule}</span>
                </div>
              ))}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setRulesAccepted(!rulesAccepted)}
                className="w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center cursor-pointer transition-all"
                style={{ background: rulesAccepted ? data.color : "white", border: `2px solid ${rulesAccepted ? data.color : "#E0E0E0"}` }}
              >
                {rulesAccepted && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5l2.5 2.5L9 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <span className="text-sm text-gray-500">I have read and I accept these club rules.</span>
            </label>

            <button
              onClick={() => { if (rulesAccepted) setStep(4); }}
              className="w-full py-4 rounded-full font-bold text-base text-white transition-all active:scale-[0.98]"
              style={{ background: rulesAccepted ? data.color : "#FFB6D0", cursor: rulesAccepted ? "pointer" : "default" }}
            >
              {rulesAccepted ? "Accept & Continue →" : "Accept the rules to continue"}
            </button>
          </div>
        )}

        {/* Step 4: First action */}
        {step === 4 && (
          <div className="flex flex-col items-center text-center gap-6 pt-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: `${data.color}20` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={data.color} strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: data.color }}>YOU&apos;RE IN</p>
              <h2 className="text-2xl font-bold leading-tight" style={{ color: "#1A0514", fontFamily: "var(--font-playfair)" }}>
                Welcome to {data.clubName}.
              </h2>
              <p className="text-sm text-gray-400 mt-2">The table is set. Your seat is waiting.</p>
            </div>

            <div className="w-full flex flex-col gap-3">
              <Link
                href="/member/happenings"
                className="w-full py-4 rounded-full font-bold text-base text-white text-center"
                style={{ background: data.color }}
              >
                Reserve your first seat
              </Link>
              <Link
                href="/member/clubs"
                className="w-full py-4 rounded-full font-semibold text-sm text-center"
                style={{ color: data.color, border: `2px solid ${data.color}30` }}
              >
                Explore the Clubhouse
              </Link>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Introduce yourself to the club from the Clubhouse page. The other women are excited to meet you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
