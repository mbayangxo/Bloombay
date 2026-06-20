"use client";

import { useState } from "react";

const SHOW =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_DEV_AUTH_HINTS === "1";

export function IrlFunnelDev() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!SHOW) return null;

  async function runFunnel() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/irl/complete-funnel", { method: "POST" });
      const json = await res.json();
      if (!json.ok) {
        setStatus(json.error ?? "Failed");
        return;
      }
      setStatus(json.message ?? `Done: ${json.steps?.join(" → ")}`);
    } catch {
      setStatus("Network error — are you signed in?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mp-section" style={{ border: "1px dashed var(--bb-hot)", borderRadius: 12 }}>
      <p className="mp-section__title">Dev · IRL funnel</p>
      <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "var(--mp-muted)" }}>
        One tap: verified → join club → reserve seat → attended. Updates founder 14-day cohort (requires Supabase
        migrations + sign-in).
      </p>
      <button type="button" className="mp-btn mp-btn--hot mp-btn--block" disabled={busy} onClick={runFunnel}>
        {busy ? "Running…" : "Complete IRL funnel"}
      </button>
      {status ? (
        <p style={{ margin: "0.75rem 0 0", fontSize: "0.8rem", color: "var(--mp-muted)" }}>{status}</p>
      ) : null}
    </section>
  );
}
