"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TickerNumber } from "./ticker-number";

type SafetyReport = {
  id: string;
  userId: string | null;
  email: string | null;
  category: string;
  body: string;
  status: string;
  createdAt: string;
};

type SafetyPing = {
  id: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  recipientName: string;
  status: string;
  eventName: string | null;
  createdAt: string;
};

type Tab = "reports" | "pings";

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function SafetyCenter() {
  const [tab, setTab] = useState<Tab>("reports");
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [pings, setPings] = useState<SafetyPing[]>([]);
  const [openReports, setOpenReports] = useState(0);
  const [recentPings, setRecentPings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/founder/safety");
      const data = await res.json() as {
        reports?: SafetyReport[];
        pings?: SafetyPing[];
        openReports?: number;
        recentPings?: number;
        warning?: string | null;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Could not load safety data");
      setReports(data.reports ?? []);
      setPings(data.pings ?? []);
      setOpenReports(data.openReports ?? 0);
      setRecentPings(data.recentPings ?? 0);
      setWarning(data.warning ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load safety data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openReportRows = useMemo(
    () => reports.filter((r) => r.status === "open"),
    [reports]
  );

  async function setReportStatus(id: string, status: "reviewed" | "closed") {
    setUpdating(id);
    try {
      const res = await fetch("/api/founder/safety", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Update failed");
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      setOpenReports((n) => Math.max(0, n - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="fp-portal-page fp-safety-page">
      <header className="fp-safety-header">
        <div className="fp-safety-header__copy">
          <p className="fp-portal-hero__kicker">Safety</p>
          <h2 className="fp-portal-hero__title">Live reports & bouquet pings</h2>
          <p className="fp-portal-muted" style={{ marginTop: "0.35rem" }}>
            Data from <code>safety_reports</code> and <code>safety_pings</code> — not demo queue.
          </p>
        </div>
      </header>

      {warning ? (
        <p className="bb-admin-login-error" style={{ marginBottom: "1rem" }}>
          {warning}
        </p>
      ) : null}
      {error ? (
        <p className="bb-admin-login-error" style={{ marginBottom: "1rem" }}>
          {error}
        </p>
      ) : null}

      <div className="fp-safety-metrics-row">
        <div className="fp-safety-metric-card fp-safety-metric-card--compact">
          <TickerNumber value={openReports} className="fp-safety-metric-card__num" />
          <span className="fp-safety-metric-card__label">Open reports</span>
        </div>
        <div className="fp-safety-metric-card fp-safety-metric-card--compact">
          <TickerNumber value={recentPings} className="fp-safety-metric-card__num" />
          <span className="fp-safety-metric-card__label">Pings (7 days)</span>
        </div>
      </div>

      <div className="fp-app-gates" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className={`fp-app-gate${tab === "reports" ? " fp-app-gate--active" : ""}`}
          onClick={() => setTab("reports")}
        >
          <h3>Reports</h3>
          <TickerNumber value={openReportRows.length} className="fp-app-gate__count" />
          <span className="fp-app-gate__waiting">open</span>
        </button>
        <button
          type="button"
          className={`fp-app-gate${tab === "pings" ? " fp-app-gate--active" : ""}`}
          onClick={() => setTab("pings")}
        >
          <h3>Bouquet pings</h3>
          <TickerNumber value={pings.length} className="fp-app-gate__count" />
          <span className="fp-app-gate__waiting">recent</span>
        </button>
      </div>

      {loading ? (
        <p className="fp-portal-muted">Loading safety data…</p>
      ) : tab === "reports" ? (
        <section className="fp-safety-drilldown fp-surface-white">
          {reports.length === 0 ? (
            <p className="fp-portal-empty">No safety reports yet.</p>
          ) : (
            <ul className="fp-safety-reports">
              {reports.map((r) => (
                <li key={r.id} className="fp-safety-report">
                  <p>
                    <strong>{r.category}</strong>
                    {r.status !== "open" ? ` · ${r.status}` : ""}
                    <span className="fp-portal-muted"> · {formatWhen(r.createdAt)}</span>
                  </p>
                  <p className="fp-portal-muted">
                    {r.email ?? r.userId ?? "Anonymous member"}
                  </p>
                  <p>{r.body}</p>
                  {r.status === "open" ? (
                    <div className="fp-safety-report__actions">
                      <button
                        type="button"
                        className="fp-portal-btn"
                        disabled={updating === r.id}
                        onClick={() => void setReportStatus(r.id, "reviewed")}
                      >
                        Mark reviewed
                      </button>
                      <button
                        type="button"
                        className="fp-portal-btn fp-portal-btn--pink"
                        disabled={updating === r.id}
                        onClick={() => void setReportStatus(r.id, "closed")}
                      >
                        Close
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section className="fp-safety-drilldown fp-surface-white">
          {pings.length === 0 ? (
            <p className="fp-portal-empty">No bouquet pings yet.</p>
          ) : (
            <ul className="fp-safety-reports">
              {pings.map((p) => (
                <li key={p.id} className="fp-safety-report">
                  <p>
                    <strong>{p.senderName}</strong> pinged <strong>{p.recipientName}</strong>
                    <span className="fp-portal-muted"> · {formatWhen(p.createdAt)}</span>
                  </p>
                  <p className="fp-portal-muted">
                    Status: {p.status}
                    {p.eventName ? ` · at ${p.eventName}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <p className="fp-portal-muted" style={{ marginTop: "1.25rem", fontSize: "0.82rem" }}>
        Demo-only panels (blocked-member chips, fake safety score) were removed for beta.
        Member enforcement flows are Phase 2.
      </p>
    </div>
  );
}
