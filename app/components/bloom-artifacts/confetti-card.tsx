import Link from "next/link";
import type { ConfettiInvitation } from "@/lib/confetti-data";
import { CONFETTI_TYPE_LABELS } from "@/lib/confetti-data";

export function ConfettiCard({
  confetti,
  tilt = 0,
  className = "",
}: {
  confetti: ConfettiInvitation;
  tilt?: number;
  className?: string;
}) {
  const typeLabel = CONFETTI_TYPE_LABELS[confetti.type];

  return (
    <Link
      href={`/member/happenings/confetti/${confetti.id}`}
      className={`bb-confetti-card bb-confetti-card--${confetti.type} ${className}`.trim()}
      style={{ transform: `rotate(${tilt}deg)` }}
      aria-label={`Open confetti for ${confetti.honoree} — ${typeLabel}`}
    >
      <span className="bb-confetti-card__wash" aria-hidden />
      <span className="bb-confetti-card__type bb-eyebrow">{typeLabel}</span>
      <h3 className="bb-confetti-card__headline">{confetti.headline}</h3>
      <p className="bb-confetti-card__honoree bb-accent-sm">
        For <em>{confetti.honoree}</em>
      </p>
      <p className="bb-confetti-card__meta bb-caption">
        {confetti.when} · {confetti.place}
      </p>
      <p className="bb-confetti-card__cta">Open her confetti →</p>
      <span className="bb-confetti-card__note" aria-hidden>
        {confetti.stickyNote}
      </span>
    </Link>
  );
}
