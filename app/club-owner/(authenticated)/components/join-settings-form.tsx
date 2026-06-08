"use client";

import { useEffect, useState } from "react";
import type { ClubJoinSettings, ClubJoinMode, ClubPricing } from "@/lib/club-world-data";
import {
  buildPriceLabel,
  getStoredJoinSettings,
  saveJoinSettings,
} from "@/lib/club-host-store";

export function JoinSettingsForm({ clubId, clubName }: { clubId: string; clubName: string }) {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<ClubJoinSettings>({
    mode: "open",
    pricing: "free",
    payTiming: "after",
    autoApprove: true,
    useLandingPage: true,
  });
  const [amount, setAmount] = useState("12");
  const [period, setPeriod] = useState<"once" | "month" | "year">("year");

  useEffect(() => {
    const stored = getStoredJoinSettings(clubId);
    if (stored) {
      setSettings(stored);
      if (stored.priceLabel?.includes("/ month")) setPeriod("month");
      else if (stored.priceLabel?.includes("one-time")) setPeriod("once");
    }
  }, [clubId]);

  function update<K extends keyof ClubJoinSettings>(key: K, value: ClubJoinSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const next = { ...settings };
    if (next.pricing === "free") {
      delete next.priceLabel;
    } else {
      next.priceLabel = buildPriceLabel(
        next.pricing,
        amount,
        next.pricing === "one_time" ? "once" : period
      );
    }
    if (next.mode === "open") {
      next.autoApprove = true;
    }
    saveJoinSettings(clubId, next);
    setSettings(next);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSave} className="co-form">
      <p className="co-form__club">{clubName}</p>

      <fieldset className="co-fieldset">
        <legend>Club landing page</legend>
        <label className="co-toggle">
          <input
            type="checkbox"
            checked={settings.useLandingPage !== false}
            onChange={(e) => update("useLandingPage", e.target.checked)}
          />
          <span>
            <strong>Full landing page</strong> — photos, zones preview, and club story before Join
          </span>
        </label>
        <p className="co-hint">
          When off, members still see a landing page with Join — just shorter (hero, health, and join rules).
        </p>
      </fieldset>

      <fieldset className="co-fieldset">
        <legend>How girls join</legend>
        <label className="co-radio">
          <input
            type="radio"
            name="mode"
            checked={settings.mode === "open"}
            onChange={() => update("mode", "open" as ClubJoinMode)}
          />
          <span>
            <strong>Open</strong> — anyone can explore and join (one tap)
          </span>
        </label>
        <label className="co-radio">
          <input
            type="radio"
            name="mode"
            checked={settings.mode === "request"}
            onChange={() => update("mode", "request" as ClubJoinMode)}
          />
          <span>
            <strong>Request</strong> — fill out a short application first
          </span>
        </label>
      </fieldset>

      {settings.mode === "request" ? (
        <label className="co-toggle">
          <input
            type="checkbox"
            checked={settings.autoApprove}
            onChange={(e) => update("autoApprove", e.target.checked)}
          />
          <span>Auto-approve applications (no manual review)</span>
        </label>
      ) : (
        <p className="co-hint">Open clubs let members in instantly when payment rules are met.</p>
      )}

      <fieldset className="co-fieldset">
        <legend>Pricing</legend>
        <label className="co-radio">
          <input
            type="radio"
            name="pricing"
            checked={settings.pricing === "free"}
            onChange={() => update("pricing", "free" as ClubPricing)}
          />
          <span>Free club</span>
        </label>
        <label className="co-radio">
          <input
            type="radio"
            name="pricing"
            checked={settings.pricing === "one_time"}
            onChange={() => update("pricing", "one_time" as ClubPricing)}
          />
          <span>One-time payment</span>
        </label>
        <label className="co-radio">
          <input
            type="radio"
            name="pricing"
            checked={settings.pricing === "subscription"}
            onChange={() => update("pricing", "subscription" as ClubPricing)}
          />
          <span>Recurring subscription</span>
        </label>
      </fieldset>

      {settings.pricing !== "free" ? (
        <div className="co-form__row">
          <label>
            Amount (USD)
            <input
              className="co-input"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          {settings.pricing === "subscription" ? (
            <label>
              Billing
              <select
                className="co-input"
                value={period}
                onChange={(e) => setPeriod(e.target.value as "month" | "year")}
              >
                <option value="month">Per month</option>
                <option value="year">Per year</option>
              </select>
            </label>
          ) : null}
        </div>
      ) : null}

      {settings.pricing !== "free" ? (
        <fieldset className="co-fieldset">
          <legend>When they pay</legend>
          <label className="co-radio">
            <input
              type="radio"
              name="payTiming"
              checked={settings.payTiming === "before"}
              onChange={() => update("payTiming", "before")}
            />
            <span>Pay before entering the club</span>
          </label>
          <label className="co-radio">
            <input
              type="radio"
              name="payTiming"
              checked={settings.payTiming === "after"}
              onChange={() => update("payTiming", "after")}
            />
            <span>Pay after approval (request clubs) or at the door</span>
          </label>
        </fieldset>
      ) : null}

      <button type="submit" className="co-btn co-btn--primary">
        Save join settings
      </button>
      {saved ? <p className="co-success">Saved — members will see this on the club page.</p> : null}
    </form>
  );
}
