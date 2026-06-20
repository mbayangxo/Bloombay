import type { PosterTemplateProps } from "@/lib/poster-templates/types";
import { PosterCornerFlourish } from "./poster-decorations";
import { PosterFrame } from "./poster-frame";
import { PosterMeta } from "./poster-meta";

/** Soft outdoors — walks, parks, casual meetups. */
export function WalkPosterTemplate({
  title,
  category,
  date,
  time,
  location,
  seatsLeft,
  hostName,
  imageUrl,
  accentColor = "#7eb8a4",
  ctaLabel,
  href,
  className,
}: PosterTemplateProps) {
  return (
    <PosterFrame
      template="walk"
      href={href}
      className={className}
      style={{ "--bb-pt-accent": accentColor } as React.CSSProperties}
    >
      <div className="bb-pt-walk__sky" aria-hidden />
      <div className="bb-pt-walk__visual">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="bb-pt-walk__photo" />
        ) : (
          <div className="bb-pt-walk__photo bb-pt-walk__photo--fallback" />
        )}
      </div>
      <div className="bb-pt-walk__body">
        <PosterCornerFlourish className="bb-pt-walk__flourish" />
        <p className="bb-pt-walk__category">{category}</p>
        <h2 className="bb-pt-walk__title">{title}</h2>
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
