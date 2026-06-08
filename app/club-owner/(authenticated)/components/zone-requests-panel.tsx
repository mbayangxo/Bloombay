"use client";

import { useCallback, useState } from "react";
import {
  decideZoneRequest,
  listZoneRequests,
  type ZoneRequest,
} from "@/lib/club-owner-data";
import { logAudit } from "@/lib/club-owner-store";

export function ZoneRequestsPanel({ clubId }: { clubId: string }) {
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [requests, setRequests] = useState<ZoneRequest[]>(() =>
    listZoneRequests(clubId, filter === "pending" ? "pending" : undefined)
  );

  const refresh = useCallback(() => {
    setRequests(listZoneRequests(clubId, filter === "pending" ? "pending" : undefined));
  }, [clubId, filter]);

  function decide(id: string, decision: "approved" | "denied") {
    const zr = requests.find((z) => z.id === id);
    decideZoneRequest(id, decision);
    logAudit(clubId, `${decision === "approved" ? "Approved" : "Denied"} zone`, zr?.zoneName);
    refresh();
  }

  return (
    <div>
      <div className="co-tabs">
        <button
          type="button"
          className={filter === "pending" ? "co-tabs__active" : ""}
          onClick={() => {
            setFilter("pending");
            setRequests(listZoneRequests(clubId, "pending"));
          }}
        >
          Pending
        </button>
        <button
          type="button"
          className={filter === "all" ? "co-tabs__active" : ""}
          onClick={() => {
            setFilter("all");
            setRequests(listZoneRequests(clubId));
          }}
        >
          All
        </button>
      </div>

      {requests.length === 0 ? (
        <p className="co-hint" style={{ marginTop: "1rem" }}>
          No zone requests {filter === "pending" ? "waiting" : "yet"}.
        </p>
      ) : (
        <ul className="co-app-list">
          {requests.map((zr) => (
            <li key={zr.id} className="co-app-card">
              <div className="co-app-card__head">
                <strong>{zr.zoneName}</strong>
                <span className={`co-badge co-badge--${zr.status}`}>{zr.status}</span>
              </div>
              <p className="co-app-card__meta">
                Requested by {zr.requestedBy} · {new Date(zr.submittedAt).toLocaleDateString()}
              </p>
              <p className="co-app-card__why">{zr.reason}</p>
              {zr.status === "pending" ? (
                <div className="co-app-card__actions">
                  <button type="button" className="co-btn co-btn--primary" onClick={() => decide(zr.id, "approved")}>
                    Approve zone
                  </button>
                  <button type="button" className="co-btn co-btn--ghost" onClick={() => decide(zr.id, "denied")}>
                    Deny
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
