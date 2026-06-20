"use client";

import type { ClubApplication } from "@/lib/club-host-store";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ApplicationDetail({
  app,
  onDecide,
  onClose,
}: {
  app: ClubApplication;
  onDecide: (id: string, decision: "approved" | "denied") => void;
  onClose: () => void;
}) {
  const gradient = app.photoGradient ?? "linear-gradient(135deg,#ffe4ec,#ffb7ce)";

  return (
    <article className="co-application-detail">
      <div className="co-application-detail__nav">
        <button type="button" className="co-application-detail__back" onClick={onClose}>
          ← Applicants
        </button>
        <button type="button" className="co-application-detail__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="co-application-detail__hero">
        <div
          className="co-application-detail__photo"
          style={
            app.photoUrl
              ? { backgroundImage: `url(${app.photoUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: gradient }
          }
        >
          {!app.photoUrl ? <span>{initials(app.applicantName)}</span> : null}
        </div>
        <div>
          <h2 className="co-application-detail__name">{app.applicantName}</h2>
          <p className="co-application-detail__meta">
            {app.city}
            {app.instagram ? ` · ${app.instagram}` : ""}
          </p>
          <span className={`co-badge co-badge--${app.status}`}>{app.status}</span>
        </div>
      </div>

      <dl className="co-application-detail__facts">
        <div>
          <dt>Applied</dt>
          <dd>{formatWhen(app.submittedAt)}</dd>
        </div>
        {app.decidedAt ? (
          <div>
            <dt>Decided</dt>
            <dd>{formatWhen(app.decidedAt)}</dd>
          </div>
        ) : null}
      </dl>

      {app.interests?.length ? (
        <div className="co-application-detail__tags">
          {app.interests.map((tag) => (
            <span key={tag} className="co-application-detail__tag">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <section className="co-application-detail__why">
        <h3>Why they want in</h3>
        <p>&ldquo;{app.why}&rdquo;</p>
      </section>

      {app.status === "pending" ? (
        <div className="co-application-detail__actions">
          <button type="button" className="co-btn co-btn--primary" onClick={() => onDecide(app.id, "approved")}>
            Accept into club
          </button>
          <button type="button" className="co-btn co-btn--ghost" onClick={() => onDecide(app.id, "denied")}>
            Deny
          </button>
        </div>
      ) : (
        <p className="co-hint">This application was already {app.status}.</p>
      )}
    </article>
  );
}
