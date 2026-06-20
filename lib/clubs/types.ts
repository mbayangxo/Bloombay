/** A club that exists in BloomBay — official (us) or onboarded (Club Mama). */
export type PortalClub = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  /** BloomBay-operated club vs Club Mama onboarded */
  isOfficial: boolean;
  memberCount: number;
  color: string;
  accentColor: string;
  crestBg: string;
  curator: string;
  tags: string[];
  vibe: string;
  coverUrl: string | null;
  bannerUrl: string | null;
  logoUrl: string | null;
  logoTemplate: string | null;
  logoText: string | null;
  crestImageUrl: string | null;
  welcomeLine: string | null;
  crestSymbol: string | null;
  crestAccent: string | null;
  aestheticKey: string | null;
  layoutKey: string | null;
  defaultHappeningTemplate: string | null;
  source: "official" | "database";
};
