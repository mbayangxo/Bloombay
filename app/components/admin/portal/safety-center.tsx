"use client";

import { useEffect, useMemo, useState } from "react";
import { McLink } from "../mc-link";
import {
  BLOCKED_MEMBERS,
  SAFETY_HEALTH,
} from "@/lib/mission-control-data";
import { TickerNumber } from "./ticker-number";

type ModerationCase = {
  id: string;
  source_type: string;
  severity: string;
  status: string;
  reported_user_id: string | null;
  reporter_id: string | null;
  yande_recommendation: string | null;
  created_at: string;
};

type QueueItem = {
  id: string;
  type: string;
  reporter: string;
  reported: string;
  evidence: string;
  date: string;
  status: string;
};

const REASON_LABELS: Record<string, string> = {
  harassment: "Harassment",
  hate_speech: "Hate Speech",
  scam: "Scam",
  fake_profile: "Fake Profile",
  inappropriate_content: "Inappropriate",
  spam: "Spam",
  other: "Other",
};

function formatCase(c: ModerationCase): QueueItem {
  const reasonKey = c.source_type.replace("_report", "");
  return {
    id: c.id,
    type: REASON_LABELS[reasonKey] ?? c.severity ?? "Report",
    reporter: c.reporter_id ? c.reporter_id.slice(0, 8) : "Unknown",
    reported: c.reported_user_id ? c.reported_user_id.slice(0, 8) : "Unknown",
    evidence: c.yande_recommendation ?? `${c.source_type} · ${c.severity} severity`,
    date: new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    status: c.status,
  };
}

const MAIN_CATEGORIES = [
  { type: "Harassment", count: 0 },
  { type: "Fake Profile", count: 0 },
  { type: "Hate Speech", count: 0 },
  { type: "Spam", count: 0 },
] as const;

export function SafetyCenter() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [showBlockedList, setShowBlockedList] = useState(false);

  useEffect(() => {
    fetch("/api/admin/moderation/cases")
      .then((r) => r.json())
      .then((data: { cases?: ModerationCase[] }) => {
        setQueue((data.cases ?? []).map(formatCase));
      })
      .catch(() => setQueue([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    return MAIN_CATEGORIES.map((c) => ({
      ...c,
      count: queue.filter((q) => q.type === c.type).length,
    }));
  }, [queue]);

  const filtered = useMemo(
    () => (category ? queue.filter((q) => q.type === category) : []),
    [queue, category]
  );

  async function resolve(id: string, action: "dismiss" | "ban") {
    await fetch("/api/admin/moderation/cases", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setQueue((q) => q.filter((item) => item.id !== id));
  }

  const score = SAFETY_HEALTH.safetyScore;
  const circumference = 2 * Math.PI * 44;
  const dash = (score / 100) * circumference;
  const openReports = queue.length;

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
            value={openReports}
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

      {loading ? (
        <p className="fp-portal-muted">Loading moderation queue…</p>
      ) : !category ? (
        <div className="fp-safety-category-grid fp-safety-category-grid--compact">
          {categories.map((c) => (
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
                    <button type="button" className="fp-portal-btn" onClick={() => resolve(r.id, "dismiss")}>
                      Dismiss
                    </button>
                    <button type="button" className="fp-portal-btn fp-portal-btn--pink" onClick={() => resolve(r.id, "ban")}>
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
