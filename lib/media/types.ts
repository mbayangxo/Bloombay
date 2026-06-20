export type MemberMemory = {
  id: string;
  user_id: string;
  image_url: string;
  title: string | null;
  caption: string | null;
  club_slug: string | null;
  created_at: string;
};

export type ProfilePhoto = {
  id: string;
  user_id: string;
  image_url: string;
  sort_order: number;
  kind: "avatar" | "gallery";
  created_at: string;
};

export type ClubBranding = {
  id: string;
  slug: string;
  owner_id: string | null;
  name: string;
  cover_url: string | null;
  banner_url: string | null;
  logo_url: string | null;
  tagline: string | null;
  description: string | null;
  welcome_line: string | null;
  primary_color: string | null;
  accent_color: string | null;
  instagram: string | null;
  website: string | null;
  tiktok: string | null;
};

export type HomeGlanceMedia = {
  avatarUrl: string | null;
  profilePhotos: ProfilePhoto[];
  memories: MemberMemory[];
  clubCovers: { slug: string; name: string; coverUrl: string | null }[];
};
