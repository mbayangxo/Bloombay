import type { PosterTemplateProps } from "@/lib/poster-templates/types";
import { PosterBloomMark } from "./poster-decorations";
import { PosterFrame } from "./poster-frame";
import { PosterMeta } from "./poster-meta";

/** Cultural, gallery — museums, exhibitions. */
export function MuseumPosterTemplate({
  title,
  category,
  date,
  time,
  location,
  seatsLeft,
  hostName,
  imageUrl,
  accentColor = "#2a2a32",
  ctaLabel,
  href,
  className,
}: PosterTemplateProps) {
  return (
    <PosterFrame
      template="museum"
      href={href}
      className={className}
      style={{ "--bb-pt-accent": accentColor } as React.CSSProperties}
    >
      <header className="bb-pt-museum__head">
        <PosterBloomMark className="bb-pt-museum__mark" />
        <p className="bb-pt-museum__category">{category}</p>
      </header>
      <h2 className="bb-pt-museum__title">{title}</h2>
      <div className="bb-pt-museum__frame">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="bb-pt-museum__photo" />
        ) : (
          <div className="bb-pt-museum__photo bb-pt-museum__photo--fallback" />
        )}
      </div>
      <PosterMeta
        date={date}
        time={time}
        location={location}
        seatsLeft={seatsLeft}
        hostName={hostName}
        ctaLabel={ctaLabel}
        variant="minimal"
        showCta
      />
    </PosterFrame>
  );
}
