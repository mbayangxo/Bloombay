export type MagazineTheme = "lifestyle" | "fashion" | "city" | "clubs" | "food";

export type SpreadKind = "photo" | "gif" | "layout";

export type MagazineEdition = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  theme: MagazineTheme;
  coverImageUrl?: string;
  coverGradient: string;
  publishedAt: string;
  spreadIds: string[];
};

export type MagazineSpread = {
  id: string;
  magazineId: string;
  pageIndex: number;
  headline: string;
  caption: string;
  body?: string;
  imageUrl?: string;
  kind: SpreadKind;
  linkHref?: string;
};

export type MagazineThought = {
  id: string;
  magazineId: string;
  spreadId: string;
  authorName: string;
  body: string;
  createdAt: string;
};
