"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { McLink } from "../mc-link";
import { INBOX_STATS } from "@/lib/mission-control-data";
import { TickerNumber } from "./ticker-number";
import {
  composeFounderThread,
  listFounderInboxThreads,
  replyToFounderThread,
  resolveFounderThread,
  type FounderInboxCategory,
  type FounderInboxThread,
} from "@/lib/founder-inbox-store";

type StatusFilter = "all" | "unread" | "open" | "resolved";
type CategoryFilter = "all" | FounderInboxCategory;

const CATEGORIES: CategoryFilter[] = [
  "all",
  "Member",
  "Club",
  "Club post",
  "Partner",
  "Curator",
  "Moderator",
  "Verification",
  "Safety",
];

const COMPOSE_CATEGORIES: FounderInboxCategory[] = [
  "Member",
  "Club",
  "Club post",
  "Partner",
  "Curator",
  "Moderator",
];

export function InboxCenter() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [threads, setThreads] = useState<FounderInboxThread[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeName, setComposeName] = useState("");
  const [composeCat, setComposeCat] = useState<FounderInboxCategory>("Member");
  const [composeBody, setComposeBody] = useState("");

  const refresh = useCallback(() => {
    const list = listFounderInboxThreads();
    setThreads(list);
    if (selectedId && !list.some((t) => t.id === selectedId)) setSelectedId(list[0]?.id ?? null);
  }, [selectedId]);

  useEffect(() => {
    refresh();
    window.addEventListener("bb-founder-inbox-updated", refresh);
    return () => window.removeEventListener("bb-founder-inbox-updated", refresh);
  }, [refresh]);

  const filtered = useMemo(() => {
    return threads.filter((t) => {
      const statusOk = statusFilter === "all" || t.status === statusFilter;
      const catOk = categoryFilter === "all" || t.category === categoryFilter;
      return statusOk && catOk;
    });
  }, [threads, statusFilter, categoryFilter]);

  const selected = threads.find((t) => t.id === selectedId) ?? filtered[0];

  function sendReply() {
    if (!selected || !reply.trim()) return;
    replyToFounderThread(selected.id, reply);
    setReply("");
    refresh();
  }

  function sendCompose() {
    if (!composeName.trim() || !composeBody.trim()) return;
    const t = composeFounderThread({
      name: composeName.trim(),
      category: composeCat,
      body: composeBody.trim(),
    });
    setComposeOpen(false);
    setComposeName("");
    setComposeBody("");
    setSelectedId(t.id);
    refresh();
  }

  return (
    <div className="fp-portal-page fp-inbox-page">
      <header className="fp-portal-hero fp-portal-hero--compact">
        <h2 className="fp-portal-hero__title">Inbox · Every portal & club post</h2>
        <p className="fp-portal-hero__sub">
          Message members, club hosts, partners, curators, and reply to club posts from one place.
        </p>
        <button
          type="button"
          className="fp-portal-btn fp-portal-btn--pink"
          style={{ marginTop: "0.75rem" }}
          onClick={() => setComposeOpen((v) => !v)}
        >
          {composeOpen ? "Close compose" : "+ New message"}
        </button>
      </header>

      {composeOpen && (
        <div className="fp-inbox-compose fp-surface-white">
          <label className="fp-field">
            <span>To (name or club)</span>
            <input
              className="fp-field__input"
              value={composeName}
              onChange={(e) => setComposeName(e.target.value)}
              placeholder="e.g. Morning Run Club, Maya K."
            />
          </label>
          <label className="fp-field">
            <span>Category</span>
            <select
              className="fp-field__input"
              value={composeCat}
              onChange={(e) => setComposeCat(e.target.value as FounderInboxCategory)}
            >
              {COMPOSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="fp-field">
            <span>Message</span>
            <textarea
              className="fp-field__input"
              rows={4}
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              placeholder="Your message appears in their portal mailbox…"
            />
          </label>
          <button type="button" className="fp-portal-btn fp-portal-btn--pink" onClick={sendCompose}>
            Send from founder
          </button>
        </div>
      )}

      <div className="fp-inbox-pink-cards">
        <article className="fp-inbox-pink-card">
          <TickerNumber value={INBOX_STATS.open} className="fp-inbox-pink-card__num" />
          <span className="fp-inbox-pink-card__label">Open</span>
        </article>
        <article className="fp-inbox-pink-card">
          <span className="fp-inbox-pink-card__num">{INBOX_STATS.avgResponseHours}h</span>
          <span className="fp-inbox-pink-card__label">Avg response</span>
        </article>
        <article className="fp-inbox-pink-card">
          <span className="fp-inbox-pink-card__num">{INBOX_STATS.oldestUnansweredHours}h</span>
          <span className="fp-inbox-pink-card__label">Oldest unanswered</span>
        </article>
      </div>

      <div className="fp-inbox-categories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`fp-inbox-cat${categoryFilter === c ? " fp-inbox-cat--active" : ""}`}
            onClick={() => setCategoryFilter(c)}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      <div className="fp-inbox-filter-row">
        {(["all", "unread", "open", "resolved"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            className={`fp-portal-tab${statusFilter === f ? " fp-portal-tab--active" : ""}`}
            onClick={() => setStatusFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="fp-inbox-split">
        <ul className="fp-inbox-threads fp-inbox-threads--list">
          {filtered.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className={`fp-inbox-thread fp-inbox-thread--${t.status} fp-surface-white${selected?.id === t.id ? " fp-inbox-thread--selected" : ""}`}
                onClick={() => setSelectedId(t.id)}
              >
                <div className="fp-inbox-thread__head">
                  <strong>{t.name}</strong>
                  <span className={`fp-inbox-priority fp-inbox-priority--${t.priority}`}>
                    {t.priority}
                  </span>
                </div>
                <div className="fp-inbox-thread__meta">
                  <span className="fp-portal-tag">{t.category}</span>
                  <span className="fp-portal-muted">{t.portal}</span>
                  <span className="fp-portal-muted">{t.date}</span>
                </div>
                <p className="fp-inbox-thread__preview">{t.preview}</p>
              </button>
            </li>
          ))}
        </ul>

        {selected ? (
          <div className="fp-inbox-detail fp-surface-white">
            <h3>{selected.name}</h3>
            <p className="fp-portal-muted">
              {selected.category} · {selected.portal} portal
            </p>
            {selected.targetHref ? (
              <Link href={selected.targetHref} className="fp-portal-btn" style={{ marginBottom: "0.75rem" }}>
                Open in portal →
              </Link>
            ) : null}
            <ul className="fp-inbox-messages">
              {selected.messages.map((m) => (
                <li
                  key={m.id}
                  className={`fp-inbox-message fp-inbox-message--${m.from}`}
                >
                  <span className="fp-portal-muted">
                    {m.from === "founder" ? "You" : selected.name} ·{" "}
                    {new Date(m.at).toLocaleString()}
                  </span>
                  <p>{m.body}</p>
                </li>
              ))}
            </ul>
            {selected.status !== "resolved" && (
              <div className="fp-inbox-reply">
                <textarea
                  className="fp-field__input"
                  rows={3}
                  placeholder="Reply from founder…"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <div className="fp-inbox-thread__actions">
                  <button
                    type="button"
                    className="fp-portal-btn fp-portal-btn--pink"
                    onClick={sendReply}
                  >
                    Send reply
                  </button>
                  <button
                    type="button"
                    className="fp-portal-btn"
                    onClick={() => {
                      resolveFounderThread(selected.id);
                      refresh();
                    }}
                  >
                    Resolve
                  </button>
                  {selected.category === "Safety" ? (
                    <McLink href="/founder/safety" className="fp-portal-btn">
                      Safety
                    </McLink>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="fp-portal-empty">Select a thread to read and reply.</p>
        )}
      </div>
    </div>
  );
}
