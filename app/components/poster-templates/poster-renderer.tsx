import "@/app/styles/bb-poster-templates.css";
import type { PosterTemplateData, PosterTemplateProps, PosterTemplateType } from "@/lib/poster-templates/types";
import { ClubPosterTemplate } from "./club-poster-template";
import { DinnerPosterTemplate } from "./dinner-poster-template";
import { GridPosterTemplate } from "./grid-poster-template";
import { MuseumPosterTemplate } from "./museum-poster-template";
import { PartyPosterTemplate } from "./party-poster-template";
import { PlatePosterTemplate } from "./plate-poster-template";
import { WalkPosterTemplate } from "./walk-poster-template";
import { WellnessPosterTemplate } from "./wellness-poster-template";
import { AperitivoPosterTemplate } from "./aperitivo-poster-template";
import { BrunchPosterTemplate } from "./brunch-poster-template";
import { SaturdayPosterTemplate } from "./saturday-poster-template";
import { RooftopPosterTemplate } from "./rooftop-poster-template";
import { WinePosterTemplate } from "./wine-poster-template";
import { AfterWorkPosterTemplate } from "./afterwork-poster-template";
import { CafePosterTemplate } from "./cafe-poster-template";
import { ButterLoveTemplate } from "./butter-love-template";
import { BiteCrunchTemplate } from "./bite-crunch-template";
import { ReceiptMenuTemplate } from "./receipt-menu-template";
import { FoodGridTemplate } from "./food-grid-template";
import { SundaySpecialTemplate } from "./sunday-special-template";
import { BakeryPromoTemplate } from "./bakery-promo-template";

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
    case "grid":
      return <GridPosterTemplate {...props} />;
    case "plate":
      return <PlatePosterTemplate {...props} />;
    case "aperitivo":
      return <AperitivoPosterTemplate {...props} />;
    case "brunch_poster":
      return <BrunchPosterTemplate {...props} />;
    case "saturday":
      return <SaturdayPosterTemplate {...props} />;
    case "rooftop_poster":
      return <RooftopPosterTemplate {...props} />;
    case "wine_poster":
      return <WinePosterTemplate {...props} />;
    case "after_work":
      return <AfterWorkPosterTemplate {...props} />;
    case "cafe":
      return <CafePosterTemplate {...props} />;
    case "butter_love":
      return <ButterLoveTemplate {...props} />;
    case "bite_crunch":
      return <BiteCrunchTemplate {...props} />;
    case "receipt_menu":
      return <ReceiptMenuTemplate {...props} />;
    case "food_grid":
      return <FoodGridTemplate {...props} />;
    case "sunday_special":
      return <SundaySpecialTemplate {...props} />;
    case "bakery_promo":
      return <BakeryPromoTemplate {...props} />;
    default:
      return <DinnerPosterTemplate {...props} />;
  }
}

/** Renders the correct physical poster from `posterTemplateType` on the event. */
export function PosterRenderer({ data }: { data: PosterTemplateData }) {
  return renderPosterByType(data.template, pickProps(data));
}
