"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  listNightSubmissions,
  approveNight,
  rejectNight,
  approveAllPendingNights,
  type NightSubmission,
} from "@/lib/actions/nights";

const PINK = "#FF1F7D";

export function NightsQueueClient() {
  const [nights, setNights] = useState<NightSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function reload(status = filter) {
    setLoading(true);
    const rows = await listNightSubmissions(status);
    setNights(rows);
    setLoading(false);
  }

  useEffect(() => {
    void reload(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  function run(action: () => Promise<{ ok: boolean; error?: string; approved?: number }>, okMsg: string) {
    startTransition(async () => {
      const res = await action();
      if (!res.ok) {
        setMessage(res.error ?? "Something went wrong");
        return;
      }
      setMessage(okMsg.replace("{n}", String(res.approved ?? "")));
      await reload(filter);
    });
  }

  return (
    <div style={{ fontFamily: "var(--font-jost)", maxWidth: 720 }}>
      <p style={{ fontSize: 14, color: "#666", lineHeight: 1.5, marginBottom: 20 }}>
        Eventbrite nights land here from the Wednesday city-intelligence cron (and any manual pulls).
        Approve publishes them to Happenings. Reject hides them. With{" "}
        <code style={{ fontSize: 12 }}>AUTO_APPROVE_EXTERNAL_NIGHTS</code> unset/true, Eventbrite
        auto-publishes after the aesthetic filter — use this queue to clean up.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 12,
              background: filter === f ? PINK : "#F3F3F3",
              color: filter === f ? "white" : "#444",
              textTransform: "capitalize",
            }}
          >
            {f}
          </button>
        ))}
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(
              () => approveAllPendingNights(),
              "Approved {n} nights → Happenings",
            )
          }
          style={{
            marginLeft: "auto",
            padding: "8px 16px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            fontWeight: 800,
            fontSize: 12,
            background: "#111",
            color: "white",
          }}
        >
          Approve all pending
        </button>
      </div>

      {message && (
        <p style={{ fontSize: 13, color: PINK, marginBottom: 12 }}>{message}</p>
      )}

      {loading ? (
        <p style={{ color: "#999" }}>Loading…</p>
      ) : nights.length === 0 ? (
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: "#888" }}>
          Nothing in this queue. Set EVENTBRITE_API_KEY and run the city-intelligence cron, or wait for Wednesday 8:00 UTC.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {nights.map((n) => (
            <li
              key={n.id}
              style={{
                background: "white",
                border: "1px solid #EEE",
                borderRadius: 16,
                padding: "16px 18px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: 15, color: "#111", margin: 0 }}>{n.title}</p>
                  <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0" }}>
                    {[n.external_source, n.category, n.venue || n.neighborhood, n.starts_at ? new Date(n.starts_at).toLocaleString() : "Date TBD"]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {n.description && (
                    <p style={{ fontSize: 13, color: "#555", marginTop: 8, lineHeight: 1.45 }}>
                      {n.description.slice(0, 180)}
                      {n.description.length > 180 ? "…" : ""}
                    </p>
                  )}
                  {n.aesthetic_note && (
                    <p style={{ fontSize: 11, color: PINK, marginTop: 6 }}>
                      Aesthetic {n.aesthetic_score ?? "—"} · {n.aesthetic_note}
                    </p>
                  )}
                  {n.external_url && (
                    <a href={n.external_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: PINK }}>
                      Open source →
                    </a>
                  )}
                </div>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: n.status === "approved" ? "#16a34a" : n.status === "rejected" ? "#999" : PINK,
                  }}
                >
                  {n.status}
                </span>
              </div>
              {n.status === "pending" && (
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => approveNight(n.id), "Published to Happenings")}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      borderRadius: 999,
                      border: "none",
                      background: PINK,
                      color: "white",
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Approve → Happenings
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => rejectNight(n.id, "Not a fit"), "Rejected")}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      borderRadius: 999,
                      border: "1.5px solid #E5E5E5",
                      background: "white",
                      color: "#666",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
              {n.status === "approved" && n.gathering_id && (
                <Link
                  href={`/member/happenings`}
                  style={{ display: "inline-block", marginTop: 10, fontSize: 12, color: PINK, fontWeight: 700 }}
                >
                  View Happenings →
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
