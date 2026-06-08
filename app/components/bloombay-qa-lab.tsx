"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ALL_QA_ROUTES,
  QA_PORTAL_OPTIONS,
  QA_VIEWPORTS,
  defaultRouteForPortal,
  routesForPortal,
  type QaPortalId,
  type QaViewportId,
} from "@/lib/qa-routes";
import { clearQaSessions, listQaSessions, saveQaSession, type QaSessionEntry } from "@/lib/founder-qa-store";
import type { SmokeResult } from "@/lib/founder-qa-engine";
import { clearMemberSession } from "@/lib/auth/member-sign-out";

export function BloomBayQaLab({ staffLabel = "Founder" }: { staffLabel?: string }) {
  const [portal, setPortal] = useState<QaPortalId>("member");
  const [viewport, setViewport] = useState<QaViewportId>("desktop");
  const [routePath, setRoutePath] = useState("/member/home");
  const [iframeKey, setIframeKey] = useState(0);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [cursorPrompt, setCursorPrompt] = useState("");
  const [smoke, setSmoke] = useState<SmokeResult[] | null>(null);
  const [history, setHistory] = useState<QaSessionEntry[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [clearingPreview, setClearingPreview] = useState(false);

  const portalRoutes = useMemo(() => routesForPortal(portal), [portal]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const vp = QA_VIEWPORTS[viewport];
  const previewUrl = `${origin}${routePath}`;

  const frameScale = useMemo(() => {
    if (typeof window === "undefined") return 1;
    const colMax = viewport === "desktop" ? 720 : viewport === "tablet" ? 560 : 400;
    const maxH = Math.min(window.innerHeight * 0.62, 820);
    return Math.min(1, (colMax - 24) / vp.width, (maxH - 40) / vp.height);
  }, [viewport, vp.width, vp.height]);

  const refreshHistory = useCallback(() => {
    setHistory(listQaSessions());
  }, []);

  useEffect(() => {
    refreshHistory();
    window.addEventListener("bb-founder-qa-updated", refreshHistory);
    return () => window.removeEventListener("bb-founder-qa-updated", refreshHistory);
  }, [refreshHistory]);

  useEffect(() => {
    if (!portalRoutes.some((r) => r.path === routePath)) {
      setRoutePath(defaultRouteForPortal(portal));
    }
  }, [portal, portalRoutes, routePath]);

  const smokeSummary = useMemo(() => {
    if (!smoke) return null;
    const bad = smoke.filter((s) => !s.ok);
    return { ok: smoke.length - bad.length, total: smoke.length, bad };
  }, [smoke]);

  async function runAction(action: "smoke" | "ask") {
    setLoading(true);
    setCopied(null);
    try {
      const res = await fetch("/api/founder/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: action === "smoke" ? "smoke" : "ask",
          question,
          route: routePath,
          viewport,
          portal,
          origin,
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? `Request failed (${res.status})`);
      }
      const data = (await res.json()) as {
        smoke?: SmokeResult[];
        report?: string;
        cursorPrompt?: string;
      };
      if (data.smoke) setSmoke(data.smoke);
      if (action === "ask" && data.report && data.cursorPrompt) {
        setReport(data.report);
        setCursorPrompt(data.cursorPrompt);
        saveQaSession({
          viewport,
          route: routePath,
          question: question || "General QA pass",
          report: data.report,
          cursorPrompt: data.cursorPrompt,
          smoke: data.smoke,
        });
        refreshHistory();
      }
    } catch (e) {
      setReport(e instanceof Error ? e.message : "QA request failed.");
    } finally {
      setLoading(false);
    }
  }

  async function copyText(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  function openExternal() {
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  }

  async function clearPreviewSession() {
    setClearingPreview(true);
    try {
      await clearMemberSession();
      setIframeKey((k) => k + 1);
    } finally {
      setClearingPreview(false);
    }
  }

  function onPortalChange(next: QaPortalId) {
    setPortal(next);
    setRoutePath(defaultRouteForPortal(next));
  }

  const portalHint = QA_PORTAL_OPTIONS.find((p) => p.id === portal)?.hint ?? "";

  return (
    <div className="fp-qa-lab">
      <p className="fp-qa-lab__intro">
        Live preview for <strong>every BloomBay portal</strong> — member, founder, operations, clubhouse,
        partner, and curator — on mobile, tablet, and desktop. Routes come from{" "}
        <code>lib/qa-routes.ts</code> + Mission Control nav, not hardcoded in this UI.
      </p>

      <div className="fp-qa-lab__layout">
        <section className="fp-qa-lab__preview" aria-label="Live preview">
          <div className="fp-qa-lab__toolbar">
            <div className="fp-qa-lab__portal-row">
              <label className="fp-qa-lab__label">
                Portal
                <select
                  className="fp-qa-lab__select"
                  value={portal}
                  onChange={(e) => onPortalChange(e.target.value as QaPortalId)}
                >
                  {QA_PORTAL_OPTIONS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="fp-qa-lab__portal-hint">{portalHint}</p>
            </div>

            <div className="fp-qa-lab__viewports" role="tablist" aria-label="Device size">
              {(Object.keys(QA_VIEWPORTS) as QaViewportId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={viewport === id}
                  className={`fp-qa-lab__vp-btn${viewport === id ? " fp-qa-lab__vp-btn--active" : ""}`}
                  onClick={() => setViewport(id)}
                >
                  {QA_VIEWPORTS[id].label}
                  <span className="fp-qa-lab__vp-size">
                    {QA_VIEWPORTS[id].width}×{QA_VIEWPORTS[id].height}
                  </span>
                </button>
              ))}
            </div>

            <div className="fp-qa-lab__route-row">
              <label className="fp-qa-lab__label">
                Page
                <select
                  value={routePath}
                  onChange={(e) => setRoutePath(e.target.value)}
                  className="fp-qa-lab__select"
                >
                  {portalRoutes.map((r) => (
                    <option key={r.path} value={r.path}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="fp-portal-btn fp-portal-btn--ghost" onClick={() => setIframeKey((k) => k + 1)}>
                Reload
              </button>
              <button type="button" className="fp-portal-btn fp-portal-btn--ghost" onClick={openExternal}>
                Open tab
              </button>
            </div>
          </div>

          <div className="fp-qa-lab__frame-stage">
            <div
              className="fp-qa-lab__frame-wrap"
              style={{
                width: vp.width * frameScale + 2,
                height: vp.height * frameScale + 36,
              }}
            >
              <div className="fp-qa-lab__frame-chrome">
                <span>
                  {vp.label} · {Math.round(frameScale * 100)}%
                </span>
                <span className="fp-qa-lab__frame-url">{routePath}</span>
              </div>
              <div
                className="fp-qa-lab__frame-scaler"
                style={{
                  width: vp.width,
                  height: vp.height,
                  transform: `scale(${frameScale})`,
                }}
              >
                <iframe
                  key={`${iframeKey}-${routePath}-${viewport}-${portal}`}
                  title={`Preview ${routePath} at ${viewport}`}
                  src={previewUrl}
                  className="fp-qa-lab__iframe"
                  style={{ width: vp.width, height: vp.height }}
                />
              </div>
            </div>
          </div>

          <p className="fp-qa-lab__hint">
            Preview shares cookies with this {staffLabel} tab. Member sign-in inside the frame only affects
            member routes — founder sidebar (Reports, Yande, etc.) should stay on{" "}
            <strong>founder login</strong>, not member home.{" "}
            <button type="button" className="fp-qa-lab__inline-link" onClick={() => void clearPreviewSession()} disabled={clearingPreview}>
              {clearingPreview ? "Clearing…" : "Clear member preview session"}
            </button>
            {" · "}
            <button type="button" className="fp-qa-lab__inline-link" onClick={openExternal}>
              Open in new tab
            </button>
          </p>

          {smokeSummary ? (
            <div className="fp-qa-lab__smoke-bar" role="status">
              <strong>
                Smoke: {smokeSummary.ok}/{smokeSummary.total} routes OK
              </strong>
              {smokeSummary.bad.length > 0 ? (
                <span className="fp-qa-lab__smoke-bad">
                  {" "}
                  — check {smokeSummary.bad.map((b) => b.path).join(", ")}
                </span>
              ) : null}
            </div>
          ) : null}
        </section>

        <aside className="fp-qa-lab__assistant" aria-label="QA assistant">
          <h2 className="fp-qa-lab__assistant-title">QA assistant</h2>
          <p className="fp-qa-lab__assistant-sub">
            Smoke-checks all {ALL_QA_ROUTES.length} monitored routes, then builds a Cursor brief for the
            portal and page you have selected.
          </p>

          <textarea
            className="fp-qa-lab__textarea"
            rows={4}
            placeholder="e.g. Lobby doors fill the viewport. Partner login uses venue art. No brown-on-black on member home at night."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <div className="fp-qa-lab__actions">
            <button type="button" className="fp-portal-btn" disabled={loading} onClick={() => void runAction("smoke")}>
              {loading ? "Running…" : "Smoke check all portals"}
            </button>
            <button
              type="button"
              className="fp-portal-btn fp-portal-btn--hot"
              disabled={loading}
              onClick={() => void runAction("ask")}
            >
              {loading ? "Building…" : "Ask QA (Cursor brief)"}
            </button>
          </div>

          {report ? (
            <div className="fp-qa-lab__report">
              <pre className="fp-qa-lab__report-text">{report}</pre>
            </div>
          ) : null}

          {cursorPrompt ? (
            <div className="fp-qa-lab__prompt-box">
              <div className="fp-qa-lab__prompt-head">
                <span>Cursor Agent prompt</span>
                <button type="button" className="fp-portal-btn fp-portal-btn--ghost" onClick={() => void copyText(cursorPrompt, "prompt")}>
                  {copied === "prompt" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="fp-qa-lab__prompt-text">{cursorPrompt}</pre>
            </div>
          ) : null}

          {history.length > 0 ? (
            <div className="fp-qa-lab__history">
              <div className="fp-qa-lab__history-head">
                <h3>Recent QA sessions</h3>
                <button type="button" className="fp-portal-btn fp-portal-btn--ghost" onClick={() => { clearQaSessions(); refreshHistory(); }}>
                  Clear
                </button>
              </div>
              <ul className="fp-qa-lab__history-list">
                {history.slice(0, 8).map((h) => (
                  <li key={h.id}>
                    <button
                      type="button"
                      className="fp-qa-lab__history-item"
                      onClick={() => {
                        setRoutePath(h.route);
                        setViewport(h.viewport as QaViewportId);
                        setQuestion(h.question);
                        setReport(h.report);
                        setCursorPrompt(h.cursorPrompt);
                        if (h.smoke) setSmoke(h.smoke);
                      }}
                    >
                      <strong>{h.route}</strong>
                      <span>
                        {h.viewport} · {new Date(h.createdAt).toLocaleString()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <details className="fp-qa-lab__routes-detail">
            <summary>All monitored routes ({ALL_QA_ROUTES.length})</summary>
            <ul>
              {ALL_QA_ROUTES.map((r) => (
                <li key={r.path}>
                  <button type="button" className="fp-qa-lab__inline-link" onClick={() => { setPortal(r.portal); setRoutePath(r.path); }}>
                    {r.label}
                  </button>
                  <code>{r.path}</code>
                </li>
              ))}
            </ul>
          </details>
        </aside>
      </div>
    </div>
  );
}
