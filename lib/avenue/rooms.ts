export interface AvenueConfig {
  signLine1: string;
  signLine2: string;
  title: string;
  tagline: string;
  href: string;
  accent: string;
  count: number | null;
  icon?: "magazine";
}

export const AVENUES: AvenueConfig[] = [
  {
    signLine1: "DROP ZONE",
    signLine2: "BLOOM DROPS BLVD.",
    title: "Drops",
    tagline: "Only the good stuff. ✿",
    href: "/member/drops",
    accent: "#FF1F7D",
    count: null,
  },
  {
    signLine1: "EATS AVE.",
    signLine2: "GIRL EATS BLVD.",
    title: "Eats",
    tagline: "Girl spots. Weekly drops. ☕",
    href: "/member/avenue/eats",
    accent: "#6B3A2A",
    count: null,
  },
  {
    signLine1: "WALL ST.",
    signLine2: "THE WALL AVE.",
    title: "The Wall",
    tagline: "Post. Share. Vibe.",
    href: "/member/avenue/wall",
    accent: "#FF1F7D",
    count: null,
  },
  {
    signLine1: "FASHION AVE.",
    signLine2: "THE CLOSET BLVD.",
    title: "Fashion Avenue",
    tagline: "Magazine. Style. Drops.",
    href: "/member/avenue/fashion",
    accent: "#E8007A",
    count: null,
    icon: "magazine" as const,
  },
  {
    signLine1: "BLOOM BLVD.",
    signLine2: "THE VANITY AVE.",
    title: "The Vanity",
    tagline: "Beauty. Glow. You.",
    href: "/member/avenue/vanity",
    accent: "#FF1F7D",
    count: null,
  },
  {
    signLine1: "LIBRARY LANE",
    signLine2: "READING ROOM RD.",
    title: "The Reading Room",
    tagline: "Books. Discuss. Share.",
    href: "/member/avenue/reading-room",
    accent: "#D4A853",
    count: null,
  },
  {
    signLine1: "CINEMA ROW",
    signLine2: "SCREENING ROOM ST.",
    title: "The Screening Room",
    tagline: "Film. Watch. Review.",
    href: "/member/avenue/screening-room",
    accent: "#FF1F7D",
    count: null,
  },
  {
    signLine1: "FITNESS ROW",
    signLine2: "GIRL FIT AVE.",
    title: "Girl Fit",
    tagline: "Move. Eat. Glow.",
    href: "/member/avenue/wellness",
    accent: "#4A7C59",
    count: null,
  },
  {
    signLine1: "CAREER BLVD.",
    signLine2: "GIRL WORKING ST.",
    title: "Girl Working",
    tagline: "Jobs. Money. Hot Takes.",
    href: "/member/avenue/working",
    accent: "#1A0A2E",
    count: null,
  },
];
