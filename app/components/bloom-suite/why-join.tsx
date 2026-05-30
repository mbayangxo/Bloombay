"use client";

import { WHY_JOIN_REASONS } from "./constants";

const CARD_GRADIENTS: Record<string, string> = {
  "book-club":  "linear-gradient(145deg, #ffd6e8 0%, #fbb8d0 100%)",
  "friends":    "linear-gradient(145deg, #ffe4f0 0%, #fcc8df 100%)",
  "events":     "linear-gradient(145deg, #fce8f4 0%, #f9c4df 100%)",
  "wellness":   "linear-gradient(145deg, #fff0f7 0%, #ffd6ee 100%)",
  "business":   "linear-gradient(145deg, #fad0e8 0%, #f5aed1 100%)",
  "travel":     "linear-gradient(145deg, #fde4f2 0%, #f8bfde 100%)",
};

export function WhyJoin({
  chosen,
  onToggle,
  onContinue,
  onBack,
}: {
  chosen: string[];
  onToggle: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div className="bb-why-join">
      <div className="bb-step-header">
        <span className="bb-step-badge">2</span>
        <div>
          <p className="bb-page-label">PAGE 2 · WHY ARE YOU HERE?</p>
          <h2 className="bb-screen-title font-display">
            What are you hoping to find in BloomBay?
          </h2>
          <p className="bb-screen-sub">Choose all that feel like you.</p>
        </div>
      </div>

      <div className="bb-reasons-grid">
        {WHY_JOIN_REASONS.map((reason) => {
          const selected = chosen.includes(reason.id);
          return (
            <button
              key={reason.id}
              type="button"
              className={`bb-reason ${selected ? "bb-reason--on" : ""}`}
              onClick={() => onToggle(reason.id)}
              aria-pressed={selected}
              style={{ background: CARD_GRADIENTS[reason.id] }}
            >
              {selected && (
                <span className="bb-reason__check" aria-hidden>✓</span>
              )}
              <span className="bb-reason__emoji" aria-hidden>{reason.emoji}</span>
              <span className="bb-reason__label">{reason.label}</span>
            </button>
          );
        })}
      </div>

      <p className="bb-something-else">
        <span className="bb-something-else__plus">+</span>{" "}
        <em>Something else? Tell us more on the next page.</em>
      </p>

      <button type="button" className="bb-cta" onClick={onContinue}>
        Continue →
      </button>

      <button type="button" className="bb-soft-back font-script" onClick={onBack}>
        ← back
      </button>
    </div>
  );
}
