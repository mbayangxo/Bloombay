import type { PosterTemplateProps } from "@/lib/poster-templates/types";
import { PosterRibbon, PosterTicketStub } from "./poster-decorations";
import { PosterFrame } from "./poster-frame";
import { PosterMeta } from "./poster-meta";

/** Bold nightlife — parties, launches, celebrations. */
export function PartyPosterTemplate({
  title,
  category,
  date,
  time,
  location,
  seatsLeft,
  hostName,
  imageUrl,
  accentColor = "#ff2d6f",
  ctaLabel,
  href,
  className,
}: PosterTemplateProps) {
  return (
    <PosterFrame
      template="party"
      href={href}
      className={className}
      style={{ "--bb-pt-accent": accentColor } as React.CSSProperties}
    >
      <div className="bb-pt-party__field" aria-hidden />
      <PosterTicketStub className="bb-pt-party__stub" />
      <div className="bb-pt-party__visual">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="bb-pt-party__photo" />
        ) : null}
      </div>
      <div className="bb-pt-party__body">
        <PosterRibbon className="bb-pt-party__ribbon" />
        <p className="bb-pt-party__category">{category}</p>
        <h2 className="bb-pt-party__title">{title}</h2>
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
