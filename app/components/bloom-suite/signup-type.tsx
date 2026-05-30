"use client";

import type { SignupType } from "../../../lib/supabase";

const SIGNUP_OPTIONS: {
  id: SignupType;
  emoji: string;
  title: string;
  desc: string;
  color: string;
  accent: string;
}[] = [
  {
    id: "member",
    emoji: "👩‍🦰",
    title: "I'm joining as a member.",
    desc: "Find clubs, attend gatherings, and meet your people. Any member can start a club once inside.",
    color: "linear-gradient(145deg, #ffd6e8 0%, #fbb8d0 100%)",
    accent: "#ff0055",
  },
  {
    id: "club_host",
    emoji: "🏛",
    title: "I want to onboard my existing club.",
    desc: "Already running a group on Facebook, TikTok, or Instagram? Bring your community to BloomBay.",
    color: "linear-gradient(145deg, #ead6ff 0%, #d4a8f9 100%)",
    accent: "#8B00CC",
  },
  {
    id: "partner",
    emoji: "🤝",
    title: "I want to partner with BloomBay.",
    desc: "Venues, brands & organizers — host events and reach BloomBay women in your city.",
    color: "linear-gradient(145deg, #fdecd3 0%, #f5d4a8 100%)",
    accent: "#C9A27A",
  },
];

export function SignupTypeScreen({
  chosen,
  onSelect,
  onContinue,
  onBack,
}: {
  chosen: SignupType | null;
  onSelect: (t: SignupType) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div className="bb-stype-screen">
      <div className="bb-step-header">
        <span className="bb-step-badge">1</span>
        <div>
          <p className="bb-page-label">HOW ARE YOU JOINING?</p>
          <h2 className="bb-screen-title font-display">Welcome to BloomBay.</h2>
          <p className="bb-screen-sub">Tell us how you&apos;d like to be part of our world.</p>
        </div>
      </div>

      <div className="bb-stype-grid">
        {SIGNUP_OPTIONS.map((opt) => {
          const selected = chosen === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              className={`bb-stype-card ${selected ? "bb-stype-card--on" : ""}`}
              onClick={() => onSelect(opt.id)}
              aria-pressed={selected}
              style={{
                background: opt.color,
                borderColor: selected ? opt.accent : "transparent",
                boxShadow: selected
                  ? `0 0 0 1px ${opt.accent}, 0 6px 20px ${opt.accent}33`
                  : undefined,
              }}
            >
              {selected && (
                <span className="bb-stype-card__check" style={{ background: opt.accent }} aria-hidden>✓</span>
              )}
              <span className="bb-stype-card__emoji" aria-hidden>{opt.emoji}</span>
              <strong className="bb-stype-card__title">{opt.title}</strong>
              <span className="bb-stype-card__desc">{opt.desc}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="bb-cta"
        onClick={onContinue}
        disabled={!chosen}
        style={{ opacity: chosen ? 1 : 0.5 }}
      >
        Continue →
      </button>

      <button type="button" className="bb-soft-back font-script" onClick={onBack}>
        ← back
      </button>
    </div>
  );
}
