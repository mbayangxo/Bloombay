/** Today's Bloom — narrative command center (not a data grid) */

export type TodaysBloomLine = {
  text: string;
  tone?: "celebrate" | "action" | "watch";
  href?: string;
};

export const TODAYS_BLOOM_NARRATIVE: TodaysBloomLine[] = [
  { text: "17 women joined today.", tone: "celebrate" },
  { text: "Williamsburg book club reached launch threshold.", tone: "celebrate", href: "/admin/clubs" },
  { text: "2 partner applications need review.", tone: "action", href: "/admin/partners" },
  { text: "3 women are waiting for verification.", tone: "action", href: "/admin/verification" },
  { text: "Founders club attendance increased 11%.", tone: "watch", href: "/admin/clubs" },
];
