import { splitTitleHighlight } from "@/lib/bloom-artifact-types";
import { artifactSizeClass, type ArtifactSize } from "@/lib/bloom-artifact-size";
import { ArtifactShell } from "./artifact-shell";

export type EventPosterProps = {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  tags?: string[];
  meta?: string;
  href?: string;
  coverStyle?: React.CSSProperties;
  compact?: boolean;
  size?: ArtifactSize;
  className?: string;
};

export function EventPoster({
  eyebrow = "HAPPENING · BLOOMBAY",
  title,
  titleHighlight,
  subtitle,
  tags = [],
  meta,
  href,
  coverStyle,
  compact,
  size,
  className = "",
}: EventPosterProps) {
  const artifactSize: ArtifactSize = size ?? (compact ? "compact" : "standard");
  const split = splitTitleHighlight(title);
  const lead = titleHighlight ? title.replace(new RegExp(`\\s*${titleHighlight}$`, "i"), "").trim() : split.lead;
  const hot = titleHighlight ?? split.highlight;

  return (
    <ArtifactShell
      href={href}
      className={`bb-event-poster${compact ? " bb-event-poster--compact" : ""} ${artifactSizeClass(artifactSize)} ${className}`.trim()}
    >
      {coverStyle ? <div className="bb-event-poster__visual" style={coverStyle} aria-hidden /> : null}
      <div className="bb-event-poster__inner">
        <p className="bb-event-poster__eyebrow">{eyebrow}</p>
        <h3 className="bb-event-poster__title">
          {lead}
          {hot ? <span className="bb-event-poster__hot"> {hot}</span> : null}
        </h3>
        {subtitle ? <p className="bb-event-poster__subtitle">{subtitle}</p> : null}
        {tags.length > 0 ? (
          <div className="bb-event-poster__tags">
            {tags.map((t) => (
              <span key={t} className="bb-event-poster__tag">
                {t}
              </span>
            ))}
          </div>
        ) : null}
        {meta ? <p className="bb-event-poster__meta">{meta}</p> : null}
      </div>
    </ArtifactShell>
  );
}
