"use client";

import { FOUNDING_MOTHER_PERKS } from "./constants";
import { BBPetalMark } from "./brand-mark";

export function FoundingMothers({
  onBack,
  onJoin,
}: {
  onBack: () => void;
  onJoin: () => void;
}) {
  return (
    <div className="fm-screen">
      {/* Decorative stamp */}
      <div className="fm-stamp" aria-hidden>
        <BBPetalMark size={36} />
      </div>

      <div className="fm-header">
        <span className="fm-badge">PAGE 5 · FOUNDING MOTHERS</span>
        <span className="fm-crown" aria-hidden>👑</span>
        <h2 className="fm-title font-display">Founding Mothers</h2>
        <p className="fm-tagline font-script">The first. The original.</p>
      </div>

      <p className="fm-desc">
        Be one of the first <strong>100 women</strong> to help BloomBay bloom in New York City.
      </p>

      <ul className="fm-perks">
        {FOUNDING_MOTHER_PERKS.map((p) => (
          <li key={p.text} className="fm-perk">
            <span className="fm-perk__icon" aria-hidden>{p.icon}</span>
            <span className="fm-perk__text">{p.text}</span>
          </li>
        ))}
      </ul>

      <p className="fm-urgency">
        Spots are limited to 100 women.<br />
        <strong>This is your moment.</strong>
      </p>

      <button type="button" className="fm-btn fm-btn--primary" onClick={onJoin}>
        Join the Waitlist →
      </button>

      <button type="button" className="fm-btn fm-btn--outline">
        Apply as Founding Mother 👑
      </button>

      <button type="button" className="bb-soft-back font-script" onClick={onBack}>
        ← back
      </button>
    </div>
  );
}
