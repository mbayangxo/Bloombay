import type { PosterTemplateProps } from "@/lib/poster-templates/types";
import { PosterFlower } from "./poster-decorations";
import { PosterFrame } from "./poster-frame";
import { PosterMeta } from "./poster-meta";

/** Calm restorative — pilates, yoga, matcha mornings. */
export function WellnessPosterTemplate({
  title,
  category,
  date,
  time,
  location,
  seatsLeft,
  hostName,
  imageUrl,
  accentColor = "#d4a5c8",
  ctaLabel,
  href,
  className,
}: PosterTemplateProps) {
  return (
    <PosterFrame
      template="wellness"
      href={href}
      className={className}
      style={{ "--bb-pt-accent": accentColor } as React.CSSProperties}
    >
      <div className="bb-pt-wellness__glow" aria-hidden />
      <div className="bb-pt-wellness__visual">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="bb-pt-wellness__photo" />
        ) : (
          <div className="bb-pt-wellness__photo bb-pt-wellness__photo--fallback" />
        )}
      </div>
      <PosterFlower className="bb-pt-wellness__flower" />
      <div className="bb-pt-wellness__body">
        <p className="bb-pt-wellness__category">{category}</p>
        <h2 className="bb-pt-wellness__title">{title}</h2>
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
