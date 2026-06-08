"use client";

import Link from "next/link";
import {
  queuePendingCount,
  queueTotalCount,
  submissionQueueHref,
  SUBMISSION_QUEUES,
  type SubmissionQueueSlug,
} from "@/lib/submissions-queues";
import type { StaffBase } from "@/lib/mc-paths";
import type { WaitlistRow } from "@/lib/waitlist-admin";
import { TickerNumber } from "./ticker-number";

export function SubmissionsHub({
  rows,
  staffBase = "/founder",
}: {
  rows: WaitlistRow[];
  staffBase?: StaffBase;
}) {
  const byType = SUBMISSION_QUEUES.filter((q) =>
    ["women", "club-hosts", "partners", "founding-mothers"].includes(q.slug)
  );
  const byStatus = SUBMISSION_QUEUES.filter((q) =>
    ["new", "in-review", "approved", "rejected"].includes(q.slug)
  );
  const tools = SUBMISSION_QUEUES.filter((q) => q.slug === "all");

  return (
    <div className="fp-portal-page fp-submissions-hub">
      <header className="fp-portal-hero">
        <p className="fp-portal-hero__kicker">Submissions</p>
        <h2 className="fp-portal-hero__title">Every waitlist row, organized</h2>
        <p className="fp-portal-hero__sub">
          Open a queue below — each has its own page to review, update status, and follow up.
        </p>
      </header>

      <QueueSection title="By who" queues={byType} rows={rows} staffBase={staffBase} />
      <QueueSection title="By status" queues={byStatus} rows={rows} staffBase={staffBase} />
      <QueueSection title="Tools" queues={tools} rows={rows} staffBase={staffBase} />

      <aside className="fp-submissions-hub__careers fp-surface-white">
        <div>
          <p className="fp-submissions-box__kicker">Hiring</p>
          <h3 className="fp-submissions-box__title">Careers</h3>
          <p className="fp-submissions-box__blurb">Resume applications from the public careers page</p>
        </div>
        <Link href={`${staffBase}/careers`} className="fp-portal-btn fp-portal-btn--pink">
          Open careers →
        </Link>
      </aside>
    </div>
  );
}

function QueueSection({
  title,
  queues,
  rows,
  staffBase,
}: {
  title: string;
  queues: typeof SUBMISSION_QUEUES;
  rows: WaitlistRow[];
  staffBase: StaffBase;
}) {
  return (
    <section className="fp-submissions-section">
      <h3 className="fp-submissions-section__title">{title}</h3>
      <div className="fp-submissions-grid">
        {queues.map((q) => (
          <SubmissionBox
            key={q.slug}
            slug={q.slug}
            kicker={q.kicker}
            title={q.title}
            blurb={q.blurb}
            icon={q.icon}
            accent={q.accent}
            pending={queuePendingCount(rows, q.slug)}
            total={queueTotalCount(rows, q.slug)}
            href={submissionQueueHref(staffBase, q.slug)}
          />
        ))}
      </div>
    </section>
  );
}

function SubmissionBox({
  slug,
  kicker,
  title,
  blurb,
  icon,
  accent,
  pending,
  total,
  href,
}: {
  slug: SubmissionQueueSlug;
  kicker: string;
  title: string;
  blurb: string;
  icon: string;
  accent?: "pink" | "ink" | "blush";
  pending: number;
  total: number;
  href: string;
}) {
  const showPending = slug !== "approved" && slug !== "rejected" && slug !== "all";

  return (
    <Link
      href={href}
      className={`fp-submissions-box${accent ? ` fp-submissions-box--${accent}` : ""}`}
    >
      <span className="fp-submissions-box__icon" aria-hidden>
        {icon}
      </span>
      <span className="fp-submissions-box__kicker">{kicker}</span>
      <span className="fp-submissions-box__title">{title}</span>
      {showPending ? (
        <>
          <TickerNumber value={pending} className="fp-submissions-box__count" />
          <span className="fp-submissions-box__waiting">needs attention</span>
        </>
      ) : (
        <TickerNumber value={total} className="fp-submissions-box__count" />
      )}
      <span className="fp-submissions-box__total">{total.toLocaleString()} total</span>
      <span className="fp-submissions-box__blurb">{blurb}</span>
      <span className="fp-submissions-box__cta">Open queue →</span>
    </Link>
  );
}
