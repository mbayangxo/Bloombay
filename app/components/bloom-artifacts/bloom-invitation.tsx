import { formatDateBadge } from "@/lib/bloom-artifact-types";
import { artifactSizeClass, type ArtifactSize } from "@/lib/bloom-artifact-size";
import { ArtifactShell } from "./artifact-shell";

export type BloomInvitationProps = {
  eventName: string;
  meta: string;
  inviteLine?: string;
  dateBadge?: string;
  when?: string;
  href?: string;
  className?: string;
  size?: ArtifactSize;
  /** Show “open event” cue — card is navigation, not an inline RSVP toggle */
  showOpenCta?: boolean;
};

export function BloomInvitation({
  eventName,
  meta,
  inviteLine = "You're invited",
  dateBadge,
  when,
  href,
  className = "",
  size = "standard",
  showOpenCta = false,
}: BloomInvitationProps) {
  const badge = dateBadge ?? (when ? formatDateBadge(when) : undefined);

  return (
    <ArtifactShell
      href={href}
      className={`bb-envelope ${artifactSizeClass(size)} ${className}`.trim()}
    >
      <div className="bb-envelope__flap" aria-hidden />
      {badge ? <span className="bb-envelope__date-badge">{badge}</span> : null}
      <div className="bb-envelope__body">
        <span className="bb-wax-seal bb-wax-seal--sm" style={{ top: "1.25rem", left: "50%", transform: "translateX(-50%)" }}>
          BB
        </span>
        <p className="bb-envelope__invite-line">{inviteLine}</p>
        <h3 className="bb-envelope__event-name">{eventName}</h3>
        <p className="bb-envelope__meta">{meta}</p>
        {showOpenCta && href ? (
          <span className="bb-envelope__open-cta">Open event · know more →</span>
        ) : null}
      </div>
    </ArtifactShell>
  );
}
