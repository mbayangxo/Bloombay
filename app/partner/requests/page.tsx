"use client";

import { useEffect, useState } from "react";
import { PartnerShell } from "../components/partner-shell";

interface PendingRequest {
  id: string;
  guest: string;
  date: string;
  time: string;
  party_size: number;
  notes?: string | null;
}

export default function PartnerRequestsPage() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [handled, setHandled] = useState<Set<string>>(new Set());
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/partner-portal/my-venue")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setRequests(data.pending_requests ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function decide(id: string, status: "confirmed" | "cancelled") {
    setBusy((prev) => new Set([...prev, id]));
    setMsg(null);
    try {
      const res = await fetch("/api/reservations/confirm", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg((data as { error?: string }).error ?? "Couldn't update that request.");
        return;
      }
      setHandled((prev) => new Set([...prev, id]));
      setMsg(status === "confirmed" ? "Reservation confirmed." : "Reservation declined.");
    } catch {
      setMsg("Couldn't reach the server. Try again.");
    } finally {
      setBusy((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  const pending = requests.filter((r) => !handled.has(r.id));

  return (
    <PartnerShell title="Booking requests" sub="Confirm or decline table requests from BloomBay members.">
      {msg ? <p className="pb-builder__msg">{msg}</p> : null}
      <div className="pp-card">
        {loading ? (
          <p className="pp-dash__empty">Loading…</p>
        ) : pending.length === 0 ? (
          <p className="pp-dash__empty">No pending booking requests.</p>
        ) : (
          pending.map((r) => (
            <div key={r.id} className="pp-list-row" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                <div>
                  <strong>{r.guest}</strong>
                  <br />
                  <span style={{ color: "var(--pp-muted)" }}>
                    {r.date}{r.time ? ` · ${r.time}` : ""} · {r.party_size} guests
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <button
                    type="button"
                    className="pp-btn pp-btn--primary pp-btn--sm"
                    disabled={busy.has(r.id)}
                    onClick={() => decide(r.id, "confirmed")}
                  >
                    {busy.has(r.id) ? "…" : "Confirm"}
                  </button>
                  <button
                    type="button"
                    className="pp-btn pp-btn--ghost pp-btn--sm"
                    disabled={busy.has(r.id)}
                    onClick={() => decide(r.id, "cancelled")}
                  >
                    Decline
                  </button>
                </div>
              </div>
              {r.notes ? (
                <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--pp-muted)", fontStyle: "italic" }}>
                  &ldquo;{r.notes}&rdquo;
                </p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </PartnerShell>
  );
}
