/** Partner dashboard insights (prototype seed). */

export type MenuItemStat = {
  name: string;
  orders: number;
  revenue: number;
  trend: string;
  caption: string;
};

export const PARTNER_MENU_STATS: MenuItemStat[] = [
  {
    name: "Burrata & peppers",
    orders: 142,
    revenue: 2556,
    trend: "+18%",
    caption: "Women-rated hero dish — photograph this for IG",
  },
  {
    name: "Saffron pasta",
    orders: 98,
    revenue: 3136,
    trend: "+12%",
    caption: "Pairs with Friday BloomBay tables",
  },
  {
    name: "Market greens",
    orders: 76,
    revenue: 1064,
    trend: "+6%",
    caption: "Solo lunch favorite",
  },
  {
    name: "House wine",
    orders: 64,
    revenue: 896,
    trend: "+9%",
    caption: "Add to Boom drop bundles",
  },
];

export const PARTNER_INSIGHTS = [
  "Thursday 7pm tables convert 2× vs walk-ins — keep availability open.",
  "Women who view your menu on BloomBay order burrata 40% more often.",
  "Active Boom drops lift weekend covers by ~15% (prototype benchmark).",
];
