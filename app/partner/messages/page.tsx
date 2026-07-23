"use client";

import { useEffect, useState } from "react";
import { PartnerShell } from "../components/partner-shell";

interface Notification {
  id: string;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default function PartnerMessagesPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partner-portal/messages")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PartnerShell title="Communication" sub="Updates from BloomBay — new booking requests and confirmations.">
      <div className="pp-card">
        {loading ? (
          <p className="pp-dash__empty">Loading…</p>
        ) : notifications.length === 0 ? (
          <p className="pp-dash__empty">No messages yet — new booking requests will show up here.</p>
        ) : (
          notifications.map((m) => (
            <div key={m.id} className="pp-list-row">
              <div>
                <strong>
                  {m.title}
                  {!m.read ? " · new" : ""}
                </strong>
                <br />
                <span style={{ color: "var(--pp-muted)" }}>{m.body}</span>
              </div>
              <span>{timeAgo(m.created_at)}</span>
            </div>
          ))
        )}
      </div>
    </PartnerShell>
  );
}
