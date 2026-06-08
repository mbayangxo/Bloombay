import { ArtifactShell } from "./artifact-shell";

export type ClubPosterProps = {
  name: string;
  category: string;
  tagline: string;
  meta?: string;
  coverStyle?: React.CSSProperties;
  href?: string;
  joinLabel?: string;
  className?: string;
  onClick?: () => void;
};

export function ClubPoster({
  name,
  category,
  tagline,
  meta,
  coverStyle,
  href,
  joinLabel = "Enter",
  className = "",
  onClick,
}: ClubPosterProps) {
  return (
    <ArtifactShell href={href} className={`bb-club-poster ${className}`.trim()} onClick={onClick}>
      <div className="bb-club-poster__img" style={coverStyle} role="img" aria-label={`${name} poster`} />
      <div className="bb-club-poster__overlay" aria-hidden />
      {href ? (
        <span className="bb-club-poster__join">{joinLabel}</span>
      ) : null}
      <div className="bb-club-poster__content">
        <p className="bb-club-poster__category">{category}</p>
        <h3 className="bb-club-poster__name">{name}</h3>
        <p className="bb-club-poster__tagline">{tagline}</p>
        {meta ? <p className="bb-club-poster__meta">{meta}</p> : null}
      </div>
    </ArtifactShell>
  );
}
