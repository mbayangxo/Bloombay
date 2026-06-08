"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { renderTemplateString, welcomeTemplateVars } from "@/lib/message-templates/render";

type TemplateRow = {
  id: string;
  key: string;
  channel: string;
  subject: string | null;
  body: string;
  isActive: boolean;
  updatedAt: string;
};

const SAMPLE = welcomeTemplateVars({
  fullName: "Maya Chen",
  email: "maya@example.com",
  city: "New York",
  neighborhood: "Williamsburg",
});

const VARIABLE_HINTS = "{{first_name}}, {{full_name}}, {{place}}, {{city}}, {{title}}, {{when}}, {{club_name}}, {{app_url}}";

function labelForKey(key: string) {
  return key.replace(/_/g, " ");
}

export function MessagingStudio() {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loadWarning, setLoadWarning] = useState<string | null>(null);

  const selected = useMemo(
    () => templates.find((t) => t.key === selectedKey) ?? templates[0] ?? null,
    [templates, selectedKey]
  );

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/founder/message-templates");
      const json = (await res.json()) as {
        templates?: TemplateRow[];
        warning?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(json.error ?? "Could not load templates");
        return;
      }
      setTemplates(json.templates ?? []);
      setLoadWarning(json.warning ?? null);
      if (!selectedKey && json.templates?.[0]) {
        setSelectedKey(json.templates[0].key);
      }
    } catch {
      setError("Offline — could not load templates.");
    }
  }, [selectedKey]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!selected) return;
    setSubject(selected.subject ?? "");
    setBody(selected.body);
    setIsActive(selected.isActive);
    setSaved(false);
  }, [selected]);

  const previewSubject = subject ? renderTemplateString(subject, SAMPLE) : "(no subject)";
  const previewBody = renderTemplateString(body || "", SAMPLE);

  async function handleSave() {
    if (!selected) return;
    if (!body.trim()) {
      setError("Message body is required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/founder/message-templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selected.id,
          key: selected.key,
          subject: selected.channel === "sms" ? null : subject,
          body,
          isActive,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; template?: TemplateRow };
      if (!res.ok || !json.ok || !json.template) {
        setError(json.error ?? "Save failed");
        return;
      }
      setTemplates((rows) => rows.map((r) => (r.key === json.template!.key ? json.template! : r)));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Offline — could not save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bb-messaging-studio">
      <header className="bb-messaging-studio__header">
        <div>
          <h2 className="bb-messaging-studio__title">Messaging Studio</h2>
          <p className="bb-messaging-studio__sub">
            Edit BloomBay automated emails, SMS, and in-app copy — no code deploy needed.
          </p>
        </div>
        <p className="bb-messaging-studio__hint">Variables: {VARIABLE_HINTS}</p>
      </header>

      {loadWarning ? <p className="bb-admin-login-error">{loadWarning}</p> : null}
      {error ? <p className="bb-admin-login-error">{error}</p> : null}

      <div className="bb-messaging-studio__grid">
        <aside className="bb-messaging-studio__list" aria-label="Templates">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              className={
                selected?.key === t.key
                  ? "bb-messaging-studio__item bb-messaging-studio__item--on"
                  : "bb-messaging-studio__item"
              }
              onClick={() => setSelectedKey(t.key)}
            >
              <span className="bb-messaging-studio__item-key">{labelForKey(t.key)}</span>
              <span className="bb-messaging-studio__item-meta">
                {t.channel}
                {!t.isActive ? " · paused" : ""}
              </span>
            </button>
          ))}
        </aside>

        <section className="bb-messaging-studio__editor">
          {selected ? (
            <>
              <div className="bb-messaging-studio__editor-head">
                <h3>{labelForKey(selected.key)}</h3>
                <span className="bb-messaging-studio__chip">{selected.channel}</span>
              </div>

              <label className="bb-messaging-studio__field">
                <span>Active</span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              </label>

              {selected.channel !== "sms" ? (
                <label className="bb-messaging-studio__field">
                  <span>Subject</span>
                  <input
                    className="bb-messaging-studio__input"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Welcome to BloomBay, {{first_name}}"
                  />
                </label>
              ) : null}

              <label className="bb-messaging-studio__field">
                <span>Body</span>
                <textarea
                  className="bb-messaging-studio__input bb-messaging-studio__textarea"
                  rows={12}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </label>

              <div className="bb-messaging-studio__actions">
                <button type="button" className="fp-invites__btn fp-invites__btn--hot" disabled={busy} onClick={() => void handleSave()}>
                  {busy ? "Saving…" : "Save template"}
                </button>
                {saved ? <span className="bb-messaging-studio__saved">Saved</span> : null}
              </div>
            </>
          ) : (
            <p className="bb-messaging-studio__sub">No templates loaded yet.</p>
          )}
        </section>

        <aside className="bb-messaging-studio__preview">
          <h3>Preview</h3>
          <p className="bb-messaging-studio__sub">Sample member: Maya Chen · Williamsburg, New York</p>
          {selected?.channel !== "sms" ? (
            <p className="bb-messaging-studio__preview-subject">
              <strong>Subject:</strong> {previewSubject}
            </p>
          ) : null}
          <pre className="bb-messaging-studio__preview-body">{previewBody}</pre>
        </aside>
      </div>
    </div>
  );
}
