import type { PosterTemplateProps } from "@/lib/poster-templates/types";

type PosterMetaProps = Pick<
  PosterTemplateProps,
  "date" | "time" | "location" | "seatsLeft" | "hostName" | "ctaLabel"
> & {
  variant?: "dark" | "light" | "minimal";
  showCta?: boolean;
};

export function PosterMeta({
  date,
  time,
  location,
  seatsLeft,
  hostName,
  ctaLabel = "RSVP",
  variant = "dark",
  showCta = true,
}: PosterMetaProps) {
  return (
    <footer className={`bb-pt-meta bb-pt-meta--${variant}`}>
      <dl className="bb-pt-meta__grid">
        <div>
          <dt>When</dt>
          <dd>
            {date}
            <span className="bb-pt-meta__sep">·</span>
            {time}
          </dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>{location}</dd>
        </div>
        {hostName ? (
          <div>
            <dt>Host</dt>
            <dd>{hostName}</dd>
          </div>
        ) : null}
        {typeof seatsLeft === "number" ? (
          <div>
            <dt>Seats</dt>
            <dd>{seatsLeft} left</dd>
          </div>
        ) : null}
      </dl>
      {showCta ? <span className="bb-pt-meta__cta">{ctaLabel}</span> : null}
    </footer>
  );
}
