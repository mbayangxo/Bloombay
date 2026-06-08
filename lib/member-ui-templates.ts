/** PNG template paths — visual source of truth for member mobile UI. */

function asset(path: string): string {
  return encodeURI(path.startsWith("/") ? path : `/${path}`);
}

export const EATS_CARD_TEMPLATES = [
  "/food templates/01_Hero_Product.png",
  "/food templates/02_Promotion.png",
  "/food templates/04_Menu_Card.png",
  "/food templates/05_Founder_Story.png",
  "/food templates/06_Loyalty_Card.png",
  "/food templates/08_New_On_The_Menu.png",
].map(asset);

/** Orchideia dossier — transparent PNG badge (no outer card). */
export const ORCHIDEIA_DOSSIER_TEMPLATE = asset(
  "/profile templates/3A788D9A-58DB-47DD-9B32-029D38893AFF.png"
);

export const PROFILE_TEMPLATES = [
  ORCHIDEIA_DOSSIER_TEMPLATE,
  "/profile templates/21120E35-3330-4B6B-8E52-75C39792D524.png",
  "/profile templates/36DC68CD-0120-44C3-848A-99F36B1DDF13.png",
  "/profile templates/4D3F009C-3A40-4C6E-BBFB-CD8C03C9AEDC.png",
  "/profile templates/8D8CE165-B757-494E-AEEE-434B99DA6050.png",
  "/profile templates/B185FD9F-F89E-4DEE-8163-D357B6746321.png",
  "/profile templates/D99754DB-D97C-4763-88F5-657BB2D374E3.png",
  "/profile templates/E8BCA86E-4EA7-4267-A02E-A5D66865350B.png",
  "/profile templates/E9FD796B-852A-4E3B-BB31-CF0D7344EB5B.png",
].map(asset);

export const HAPPENING_POSTER_TEMPLATES = [
  "/happenings/posters/01_Girls_Night.png",
  "/happenings/posters/02_Save_The_Date_Aperitivo.png",
  "/happenings/posters/03_Vinyl_Night_Jazz.png",
  "/happenings/posters/04_Italian_Dinner_Society.png",
  "/happenings/posters/05_Film_Club.png",
  "/happenings/posters/06_Dance_All_Night.png",
  "/happenings/posters/07_Sunday_Brunch_Club.png",
  "/happenings/posters/08_Rooftop_Sessions.png",
  "/happenings/posters/09_Bagels_And_Books.png",
  "/happenings/posters/10_Ladies_First_Road_Trip.png",
].map(asset);

export const CLUBS_MAGAZINE_BG = "/clubs/clubs-page-mockup.png";

export const SEAT_TICKET_TEMPLATES = [
  "/tickets templates/Ticket_Girls_Night.png",
  "/tickets templates/Ticket_Dinner_Society.png",
  "/tickets templates/Ticket_Museum_Exhibition.png",
  "/tickets templates/Ticket_NYC_Marrakech.png",
].map(asset);

export function templateAt<T extends readonly string[]>(list: T, index: number): T[number] {
  return list[index % list.length]!;
}

export const EATS_FILTER_CHIPS = ["All", "Brunch", "Late Night", "Solo", "NYC Classic"] as const;
export type EatsFilterChip = (typeof EATS_FILTER_CHIPS)[number];
