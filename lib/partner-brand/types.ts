export type PartnerBrandTemplateId = "cafe" | "restaurant" | "salon" | "studio" | "venue";

export type PartnerAboutSlide = {
  id: string;
  headline: string;
  body: string;
  /** Short caption for cards / social */
  caption?: string;
  imageUrl?: string;
};

export type PartnerMenuItem = {
  id: string;
  name: string;
  description: string;
  /** Editable member-facing caption */
  caption?: string;
  price?: string;
  imageUrl?: string;
};

export type PartnerMenuSection = {
  id: string;
  title: string;
  items: PartnerMenuItem[];
};

export type PartnerBrandColors = {
  accent: string;
  accentSoft: string;
  background: string;
  text: string;
};

export type PartnerBrandProfile = {
  id: string;
  slug: string;
  name: string;
  businessType: string;
  tagline: string;
  neighborhood: string;
  address?: string;
  templateId: PartnerBrandTemplateId;
  colors: PartnerBrandColors;
  heroImageUrl?: string;
  /** Caption under hero / on Eats cards */
  heroCaption?: string;
  logoImageUrl?: string;
  aboutSlides: PartnerAboutSlide[];
  menuSections: PartnerMenuSection[];
  published: boolean;
  updatedAt: string;
};
