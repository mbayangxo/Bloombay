"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BETA_LAUNCH_ITEMS,
  BETA_LAUNCH_STORAGE_KEY,
  type BetaLaunchItemId,
} from "@/lib/founder/beta-launch-items";

type Signals = {
  waitlistCount: number;
  waitlistOk: boolean;
  pendingClubMama: number;
  openModerationCases: number;
  stripeConfigured: boolean;
  emailConfigured: boolean;
  smsConfigured: boolean;
  cronEnabled: boolean;
  reportsApiOk: boolean;
};

type SignalTone = "ok" | "warn" | "fail" | "neutral";

function loadChecked(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(BETA_LAUNCH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function signalForItem(id: BetaLaunchItemId, signals: Signals | null): SignalTone {
  if (!signals) return "neutral";
  switch (id) {
    case "waitlist":
      return signals.waitlistOk ? "ok" : "fail";
    case "stripe":
      return signals.stripeConfigured ? "ok" : "warn";
    case "email":
      return signals.emailConfigured ? "ok" : "warn";
    case "sms":
      return signals.smsConfigured ? "ok" : "warn";
    case "reports":
      return signals.reportsApiOk ? "ok" : "fail";
    case "moderation_queue":
      return signals.openModerationCases === 0 ? "ok" : "warn";
    case "club_mama_queue":
      return signals.pendingClubMama === 0 ? "ok" : "warn";
    case "cron":
      return signals.cronEnabled ? "ok" : "warn";
    default:
      return "neutral";
  }
}

function signalDetail(id: BetaLaunchItemId, signals: Signals | null): string | null {
  if (!signals) return null;
  switch (id) {
    case "waitlist":
      return `${signals.waitlistCount.toLocaleString()} signups`;
    case "moderation_queue":
      return signals.openModerationCases === 0
        ? "Queue clear"
        : `${signals.openModerationCases} open`;
    case "club_mama_queue":
      return signals.pendingClubMama === 0
        ? "None pending"
        : `${signals.pendingClubMama} pending`;
    case "stripe":
      return signals.stripeConfigured ? "Keys configured" : "Missing keys";
    case "email":
      return signals.emailConfigured ? "Resend configured" : "RESEND_API_KEY missing";
    case "sms":
      return signals.smsConfigured ? "Twilio configured" : "Twilio not configured";
    case "cron":
      return signals.cronEnabled ? "CRON_ENABLED" : "Cron disabled";
    case "reports":
      return signals.reportsApiOk ? "API reachable" : "API error";
    default:
      return null;
  }
}

const TONE_CLASS: Record<SignalTone, string> = {
  ok: "fp-beta-launch__signal--ok",
  warn: "fp-beta-launch__signal--warn",
  fail: "fp-beta-launch__signal--fail",
  neutral: "fp-beta-launch__signal--neutral",
};

export function BetaLaunchChecklist({ compact = false }: { compact?: boolean }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [signals, setSignals] = useState<Signals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setChecked(loadChecked());
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/founder/beta-launch")
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<{ signals: Signals }>;
      })
      .then((data) => setSignals(data.signals))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load signals"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = (id: BetaLaunchItemId) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(BETA_LAUNCH_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const doneCount = useMemo(
    () => BETA_LAUNCH_ITEMS.filter((item) => checked[item.id]).length,
    [checked],
  );

  const total = BETA_LAUNCH_ITEMS.length;
  const allDone = doneCount === total;

  return (
    <section className={compact ? "fp-beta-launch fp-beta-launch--compact" : "fp-beta-launch"}>
      <header className="fp-beta-launch__header">
        <div>
          <h2 className="fp-beta-launch__title">Operator beta launch</h2>
          <p className="fp-beta-launch__sub">
            Morning checklist before inviting Club Mamas. Auto signals refresh from live data;
            check each item after you verify it.
          </p>
        </div>
        <div className="fp-beta-launch__meta">
          <span className={allDone ? "fp-beta-launch__progress fp-beta-launch__progress--done" : "fp-beta-launch__progress"}>
            {doneCount}/{total} done
          </span>
          <button type="button" className="fp-beta-launch__refresh" onClick={refresh} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh signals"}
          </button>
          {!compact ? (
            <Link href="/founder/beta-launch" className="fp-beta-launch__full-link">
              Full checklist →
            </Link>
          ) : null}
        </div>
      </header>

      {error ? <p className="fp-beta-launch__error">{error}</p> : null}

      <ul className="fp-beta-launch__list">
        {BETA_LAUNCH_ITEMS.map((item) => {
          const tone = item.autoSignal ? signalForItem(item.id, signals) : "neutral";
          const detail = item.autoSignal ? signalDetail(item.id, signals) : null;
          const isChecked = Boolean(checked[item.id]);

          return (
            <li key={item.id} className={isChecked ? "fp-beta-launch__item fp-beta-launch__item--done" : "fp-beta-launch__item"}>
              <label className="fp-beta-launch__label">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(item.id)}
                  className="fp-beta-launch__checkbox"
                />
                <span className="fp-beta-launch__copy">
                  <span className="fp-beta-launch__label-text">{item.label}</span>
                  <span className="fp-beta-launch__hint">{item.hint}</span>
                </span>
              </label>
              <div className="fp-beta-launch__aside">
                {detail ? (
                  <span className={`fp-beta-launch__signal ${TONE_CLASS[tone]}`}>{detail}</span>
                ) : null}
                {item.href ? (
                  <Link href={item.href} className="fp-beta-launch__link">
                    Open
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      {compact && !allDone ? (
        <p className="fp-beta-launch__footer-note">
          <Link href="/founder/beta-launch">Open full checklist</Link> before your first Club Mama invite.
        </p>
      ) : null}
    </section>
  );
}
