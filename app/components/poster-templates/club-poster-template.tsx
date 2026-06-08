import type { PosterTemplateProps } from "@/lib/poster-templates/types";
import { PosterSeal } from "./poster-decorations";
import { PosterFrame } from "./poster-frame";
import { PosterMeta } from "./poster-meta";

/** Identity & belonging — club pages and club events. */
export function ClubPosterTemplate({
  title,
  category,
  date,
  time,
  location,
  seatsLeft,
  hostName,
  imageUrl,
  accentColor = "#e85d8a",
  ctaLabel,
  memberCount,
  href,
  className,
}: PosterTemplateProps) {
  return (
    <PosterFrame
      template="club"
      href={href}
      className={className}
      style={{ "--bb-pt-accent": accentColor } as React.CSSProperties}
    >
      <div className="bb-pt-club__crest">
        <PosterSeal className="bb-pt-club__seal" label="MEMBER" />
      </div>
      <div className="bb-pt-club__visual">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="bb-pt-club__photo" />
        ) : (
          <div className="bb-pt-club__photo bb-pt-club__photo--fallback" />
        )}
        <div className="bb-pt-club__band" aria-hidden />
      </div>
      <div className="bb-pt-club__body">
        <p className="bb-pt-club__category">{category}</p>
        <h2 className="bb-pt-club__title">{title}</h2>
        {typeof memberCount === "number" ? (
          <p className="bb-pt-club__members">
            <span className="bb-pt-club__members-n">{memberCount}</span> members
          </p>
        ) : null}
        <PosterMeta
          date={date}
          time={time}
          location={location}
          seatsLeft={seatsLeft}
          hostName={hostName}
          ctaLabel={ctaLabel}
          variant="light"
        />
      </div>
    </PosterFrame>
  );
}
