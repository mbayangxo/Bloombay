import type { PosterTemplateData, PosterTemplateProps, PosterTemplateType } from "@/lib/poster-templates/types";
import { ClubPosterTemplate } from "./club-poster-template";
import { DinnerPosterTemplate } from "./dinner-poster-template";
import { MuseumPosterTemplate } from "./museum-poster-template";
import { PartyPosterTemplate } from "./party-poster-template";
import { WalkPosterTemplate } from "./walk-poster-template";
import { WellnessPosterTemplate } from "./wellness-poster-template";

function pickProps(data: PosterTemplateData): PosterTemplateProps {
  const { template: _t, id: _id, ...rest } = data;
  return rest;
}

export function renderPosterByType(type: PosterTemplateType, props: PosterTemplateProps) {
  switch (type) {
    case "dinner":
      return <DinnerPosterTemplate {...props} />;
    case "club":
      return <ClubPosterTemplate {...props} />;
    case "party":
      return <PartyPosterTemplate {...props} />;
    case "museum":
      return <MuseumPosterTemplate {...props} />;
    case "walk":
      return <WalkPosterTemplate {...props} />;
    case "wellness":
      return <WellnessPosterTemplate {...props} />;
    default:
      return <DinnerPosterTemplate {...props} />;
  }
}

/** Renders the correct physical poster from `posterTemplateType` on the event. */
export function PosterRenderer({ data }: { data: PosterTemplateData }) {
  return renderPosterByType(data.template, pickProps(data));
}
