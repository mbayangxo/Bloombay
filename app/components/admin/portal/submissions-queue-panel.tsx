"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { formatDate, formatInterestList } from "@/lib/admin-labels";
import {
  displayType,
  locationLabel,
  type WaitlistRow,
  type WaitlistStatus,
} from "@/lib/waitlist-admin";
import {
  filterRowsByQueue,
  getSubmissionQueue,
  rowDetailLine,
  rowSecondaryLine,
  statusLabel,
  type SubmissionQueueSlug,
} from "@/lib/submissions-queues";
import type { StaffBase } from "@/lib/mc-paths";
import { StatusSelect } from "../status-select";
import { SubmissionsTable } from "../submissions-table";

function referralSource(row: WaitlistRow): string {
  if (row.founding_mother) return "Founding invite";
  if (row.extra_notes?.trim()) return row.extra_notes.trim();
  return "Waitlist";
}

export function SubmissionsQueuePanel({
  rows,
  queue: queueSlug,
  staffBase = "/founder",
}: {
  rows: WaitlistRow[];
  queue: SubmissionQueueSlug;
  staffBase?: StaffBase;
}) {
  const queue = getSubmissionQueue(queueSlug)!;
  const [localRows, setLocalRows] = useState(rows);
  const [updating, setUpdating] = useState<string | null>(null);
  const [patchError, setPatchError] = useState<string | null>(null);

  const queueRows = useMemo(
    () =>
      [...filterRowsByQueue(localRows, queueSlug)].sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
      ),
    [localRows, queueSlug]
  );

  const updateStatus = useCallback(async (id: string, status: WaitlistStatus) => {
    setUpdating(id);
    setPatchError(null);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        row?: WaitlistRow;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      if (!data.row) throw new Error("Update failed");
      setLocalRows((prev) => prev.map((r) => (r.id === id ? data.row! : r)));
    } catch (err) {
      setPatchError(err instanceof Error ? err.message : "Could not update status.");
    } finally {
      setUpdating(null);
    }
  }, []);

  if (queueSlug === "all") {
    return (
      <div className="fp-portal-page fp-submissions-queue">
        <QueueHeader queue={queue} count={queueRows.length} staffBase={staffBase} />
        <SubmissionsTable initialRows={localRows} showActions />
      </div>
    );
  }

  return (
    <div className="fp-portal-page fp-submissions-queue">
      <QueueHeader queue={queue} count={queueRows.length} staffBase={staffBase} />

      {patchError ? (
        <p className="bb-admin-login-error" role="alert" style={{ marginBottom: "1rem" }}>
          {patchError}
        </p>
      ) : null}

      <section className="fp-app-queue fp-surface-white">
        {queueRows.length === 0 ? (
          <p className="fp-portal-empty">No submissions in this queue right now.</p>
        ) : (
          <ul className="fp-app-queue__list">
            {queueRows.map((row) => (
              <li key={row.id} className="fp-app-person fp-submissions-person">
                <div className="fp-app-person__avatar" aria-hidden>
                  {(row.first_name ?? row.business_name ?? "?").charAt(0).toUpperCase()}
                </div>
                <div className="fp-submissions-person__body">
                  <div className="fp-submissions-person__head">
                    <strong>{row.first_name ?? row.business_name ?? "—"}</strong>
                    <span className={`fp-submissions-status fp-submissions-status--${row.status}`}>
                      {statusLabel(row.status)}
                    </span>
                  </div>
                  <p className="fp-portal-muted">
                    {rowDetailLine(row)} · {locationLabel(row)} · {displayType(row.signup_type)}
                  </p>
                  <p className="fp-portal-muted">
                    {formatDate(row.created_at)} · {referralSource(row)}
                  </p>
                  <p className="fp-portal-muted">{rowSecondaryLine(row)}</p>
                  {row.email ? (
                    <p className="fp-submissions-person__contact">
                      <a href={`mailto:${row.email}`}>{row.email}</a>
                      {row.phone ? (
                        <>
                          {" · "}
                          <a href={`tel:${row.phone}`}>{row.phone}</a>
                        </>
                      ) : null}
                    </p>
                  ) : null}
                  {row.signup_type === "member" && row.interests?.length ? (
                    <p className="fp-portal-muted">Interests: {formatInterestList(row.interests)}</p>
                  ) : null}
                  {row.extra_notes?.trim() ? (
                    <p className="fp-submissions-person__notes">{row.extra_notes}</p>
                  ) : null}
                  <div className="fp-submissions-person__status-row">
                    <label className="fp-submissions-person__status-label">
                      Status
                      <StatusSelect
                        value={row.status}
                        disabled={updating === row.id}
                        onChange={(s) => updateStatus(row.id, s)}
                      />
                    </label>
                  </div>
                </div>
                <div className="fp-app-person__actions">
                  <button
                    type="button"
                    className="fp-portal-btn fp-portal-btn--pink"
                    disabled={updating === row.id}
                    onClick={() => updateStatus(row.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="fp-portal-btn"
                    disabled={updating === row.id}
                    onClick={() => updateStatus(row.id, "rejected")}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="fp-portal-btn"
                    disabled={updating === row.id}
                    onClick={() => updateStatus(row.id, "reviewed")}
                  >
                    Review
                  </button>
                  <button
                    type="button"
                    className="fp-portal-btn"
                    disabled={updating === row.id}
                    onClick={() => updateStatus(row.id, "contacted")}
                  >
                    Contacted
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function QueueHeader({
  queue,
  count,
  staffBase,
}: {
  queue: NonNullable<ReturnType<typeof getSubmissionQueue>>;
  count: number;
  staffBase: StaffBase;
}) {
  return (
    <header className="fp-submissions-queue__hero">
      <Link href={`${staffBase}/submissions`} className="fp-submissions-queue__back">
        ← All submissions
      </Link>
      <p className="fp-portal-hero__kicker">{queue.kicker}</p>
      <h2 className="fp-portal-hero__title">{queue.title}</h2>
      <p className="fp-portal-hero__sub">{queue.blurb}</p>
      <p className="fp-submissions-queue__count-line">
        <strong>{count.toLocaleString()}</strong> in this queue
      </p>
    </header>
  );
}
