"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { McLink } from "../mc-link";
import {
  BLOCKED_MEMBERS,
  SAFETY_HEALTH,
  SAFETY_QUEUE,
} from "@/lib/mission-control-data";
import { TickerNumber } from "./ticker-number";

const MAIN_CATEGORIES = [
  { type: "Harassment", count: 2 },
  { type: "Fake Profile", count: 1 },
  { type: "Bullying", count: 1 },
  { type: "Spam", count: 0 },
] as const;

export function SafetyCenter() {
  const [queue, setQueue] = useState(SAFETY_QUEUE);
  const [category, setCategory] = useState<string | null>(null);
  const [showBlockedList, setShowBlockedList] = useState(false);

  const filtered = useMemo(
    () => (category ? queue.filter((q) => q.type === category) : []),
    [queue, category]
  );

  function resolve(id: string) {
    setQueue((q) => q.filter((item) => item.id !== id));
  }

  const score = SAFETY_HEALTH.safetyScore;
  const circumference = 2 * Math.PI * 44;
  const dash = (score / 100) * circumference;

  return (
    <div className="fp-portal-page fp-safety-page">
      <header className="fp-safety-header">
        <div className="fp-safety-header__copy">
          <p className="fp-portal-hero__kicker">Safety</p>
          <h2 className="fp-portal-hero__title">Women must feel safe here</h2>
        </div>
        <div className="fp-trust-meter fp-trust-meter--compact" aria-label={`Safety score ${score}`}>
          <svg viewBox="0 0 120 120" className="fp-trust-meter__svg">
            <circle cx="60" cy="60" r="44" className="fp-trust-meter__track" />
            <circle
              cx="60"
              cy="60"
              r="44"
              className="fp-trust-meter__fill"
              style={{ strokeDasharray: `${dash} ${circumference}` }}
            />
          </svg>
          <div className="fp-trust-meter__center">
            <span className="fp-trust-meter__label">Safety score</span>
            <TickerNumber value={score} className="fp-trust-meter__value" />
          </div>
        </div>
      </header>

      <div className="fp-safety-metrics-row">
        <div className="fp-safety-metric-card fp-safety-metric-card--compact">
          <TickerNumber
            value={SAFETY_HEALTH.openReports}
            className="fp-safety-metric-card__num"
          />
          <span className="fp-safety-metric-card__label">Open reports</span>
        </div>
        <div className="fp-safety-metric-card fp-safety-metric-card--compact">
          <span className="fp-safety-metric-card__num">
            {SAFETY_HEALTH.avgResolutionHours}
            <em>h</em>
          </span>
          <span className="fp-safety-metric-card__label">Avg resolution</span>
        </div>
      </div>

      {!category ? (
        <div className="fp-safety-category-grid fp-safety-category-grid--compact">
          {MAIN_CATEGORIES.map((c) => (
            <button
              key={c.type}
              type="button"
              className="fp-safety-category-card fp-safety-category-card--compact"
              onClick={() => setCategory(c.type)}
            >
              <h3>{c.type}</h3>
              <TickerNumber value={c.count} className="fp-safety-category-card__count" />
            </button>
          ))}
        </div>
      ) : (
        <section className="fp-safety-drilldown fp-surface-white">
          <button type="button" className="fp-portal-link-btn" onClick={() => setCategory(null)}>
            ← All categories
          </button>
          <h3 className="fp-portal-card__title">{category}</h3>
          {filtered.length === 0 ? (
            <p className="fp-portal-empty">No open reports.</p>
          ) : (
            <ul className="fp-safety-reports">
              {filtered.map((r) => (
                <li key={r.id} className="fp-safety-report">
                  <p>
                    <strong>{r.reporter}</strong> → {r.reported}
                  </p>
                  <p className="fp-portal-muted">{r.evidence}</p>
                  <div className="fp-safety-report__actions">
                    <button type="button" className="fp-portal-btn" onClick={() => resolve(r.id)}>
                      Dismiss
                    </button>
                    <button type="button" className="fp-portal-btn fp-portal-btn--pink" onClick={() => resolve(r.id)}>
                      Ban
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="fp-safety-bottom-row">
        <section className="fp-safety-blocked-mini fp-surface-white">
          <h3>Blocked</h3>
          <p>
            <TickerNumber value={BLOCKED_MEMBERS.length} className="fp-safety-metric-card__num" />{" "}
            total
          </p>
          <button type="button" className="fp-portal-btn fp-portal-btn--pink" onClick={() => setShowBlockedList((v) => !v)}>
            {showBlockedList ? "Hide" : "View list"}
          </button>
        </section>
        {BLOCKED_MEMBERS.slice(0, 3).map((m) => (
          <div key={m.name} className="fp-safety-blocked-chip fp-surface-barbie">
            <strong>{m.name}</strong>
            <span>{m.status}</span>
          </div>
        ))}
        <McLink href="/admin/inbox" className="fp-safety-blocked-chip fp-surface-barbie">
          Inbox →
        </McLink>
      </div>
      {showBlockedList ? (
        <ul className="fp-safety-blocked-full">
          {BLOCKED_MEMBERS.map((m) => (
            <li key={m.name}>
              <strong>{m.name}</strong> · {m.reason} · {m.status}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
