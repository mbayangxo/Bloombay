import type { CSSProperties } from "react";
import type { PosterTemplateProps } from "@/lib/poster-templates/types";
import { PosterCornerFlourish, PosterFlower } from "./poster-decorations";
import { PosterFrame } from "./poster-frame";
import { PosterMeta } from "./poster-meta";

/** Intimate, candlelit editorial — dinners, supper clubs, wine nights. */
export function DinnerPosterTemplate({
  title,
  category,
  date,
  time,
  location,
  seatsLeft,
  hostName,
  imageUrl,
  accentColor = "#c9a66b",
  ctaLabel,
  href,
  className,
}: PosterTemplateProps) {
  return (
    <PosterFrame
      template="dinner"
      href={href}
      className={className}
      style={{ "--bb-pt-accent": accentColor } as CSSProperties}
    >
      <div className="bb-pt-dinner__visual">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external demo JPG/WebP
          <img src={imageUrl} alt="" className="bb-pt-dinner__photo" />
        ) : (
          <div className="bb-pt-dinner__photo bb-pt-dinner__photo--fallback" />
        )}
        <div className="bb-pt-dinner__veil" aria-hidden />
        <PosterCornerFlourish className="bb-pt-dinner__flourish bb-pt-dinner__flourish--tl" />
        <PosterCornerFlourish className="bb-pt-dinner__flourish bb-pt-dinner__flourish--br" flip />
      </div>
      <div className="bb-pt-dinner__body">
        <p className="bb-pt-dinner__category">{category}</p>
        <h2 className="bb-pt-dinner__title">{title}</h2>
        <PosterFlower className="bb-pt-dinner__flower" />
        <PosterMeta
          date={date}
          time={time}
          location={location}
          seatsLeft={seatsLeft}
          hostName={hostName}
          ctaLabel={ctaLabel}
          variant="dark"
        />
      </div>
    </PosterFrame>
  );
}
