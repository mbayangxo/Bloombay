"use client";

import { useCallback, useEffect, useState } from "react";
import { logAudit } from "@/lib/club-owner-store";

type PingHistoryRow = { message: string; sentAt: string; recipientCount: number };

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function BloomPingPanel({ clubId }: { clubId: string }) {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<PingHistoryRow[]>([]);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/club-portal/bloom-ping");
      if (res.ok) setHistory((await res.json()) as PingHistoryRow[]);
    } catch {
      /* history is a nice-to-have; ignore fetch failures */
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || sending) return;
    setSending(true);
    setError(null);
    setSentCount(null);
    try {
      const res = await fetch("/api/club-portal/bloom-ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; recipientCount?: number; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Couldn't send the ping. Try again.");
        return;
      }
      logAudit(clubId, "Sent Bloom ping", message.trim().slice(0, 40));
      setSentCount(data.recipientCount ?? 0);
      setMessage("");
      await refresh();
    } catch {
      setError("Couldn't send the ping. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSend} className="co-form">
        <label>
          Message to all members
          <textarea
            className="co-input co-input--area"
            rows={4}
            placeholder="e.g. Saturday route is Central Park — 6am sharp. Who's in?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
        <p className="co-hint">
          Sends a real notification to every current member of your club. They&apos;ll see it in Notifications.
        </p>
        <button type="submit" className="co-btn co-btn--primary" disabled={!message.trim() || sending}>
          {sending ? "Sending…" : "Send Bloom ping"}
        </button>
        {error ? <p className="co-hint" style={{ color: "#c0264a" }}>{error}</p> : null}
        {sentCount !== null && !error ? (
          <p className="co-success">
            {sentCount > 0 ? `Ping sent to ${sentCount} member${sentCount === 1 ? "" : "s"}.` : "No members to ping yet."}
          </p>
        ) : null}
      </form>

      {history.length > 0 ? (
        <section style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "0.95rem", marginBottom: "0.75rem" }}>Recent pings</h2>
          <ul className="co-app-list">
            {history.map((p, idx) => (
              <li key={`${p.sentAt}-${idx}`} className="co-app-card">
                <p style={{ margin: 0 }}>{p.message}</p>
                <p className="co-hint" style={{ marginTop: "0.35rem" }}>
                  {formatWhen(p.sentAt)} · {p.recipientCount} member{p.recipientCount === 1 ? "" : "s"}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
