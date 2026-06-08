"use client";

import { useEffect, useState } from "react";
import { listPings, sendBloomPing, type BloomPing } from "@/lib/club-host-store";
import { logAudit } from "@/lib/club-owner-store";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function BloomPingPanel({ clubId, memberCount }: { clubId: string; memberCount: number }) {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<BloomPing[]>([]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setHistory(listPings(clubId));
  }, [clubId, sent]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    sendBloomPing(clubId, message, memberCount);
    logAudit(clubId, "Sent Bloom ping", message.slice(0, 40));
    setMessage("");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
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
          Sends a Bloom ping to every member at once. They&apos;ll see it in Mailbox.
        </p>
        <button type="submit" className="co-btn co-btn--primary" disabled={!message.trim()}>
          Send Bloom ping
        </button>
        {sent ? <p className="co-success">Ping sent to {memberCount} members.</p> : null}
      </form>

      {history.length > 0 ? (
        <section style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "0.95rem", marginBottom: "0.75rem" }}>Recent pings</h2>
          <ul className="co-app-list">
            {history.map((p) => (
              <li key={p.id} className="co-app-card">
                <p style={{ margin: 0 }}>{p.message}</p>
                <p className="co-hint" style={{ marginTop: "0.35rem" }}>
                  {formatWhen(p.sentAt)} · {p.recipientCount} members
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
