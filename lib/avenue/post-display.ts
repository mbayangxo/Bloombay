export interface WallPost {
  id: string;
  text: string;
  blooms: number;
  category: string | null;
  is_seed: boolean;
  seed_author: string | null;
  author: { first_name: string | null; full_name: string | null } | null;
}

export interface PostDisplay {
  room: string;
  roomHref: string;
  user: string;
  initial: string;
  color: string;
  text: string;
  blooms: number;
}

export const CATEGORY_ROOMS: Record<string, { title: string; href: string }> = {
  wall:           { title: "The Wall",          href: "/member/avenue/wall" },
  closet:         { title: "The Closet",         href: "/member/avenue/closet" },
  vanity:         { title: "The Vanity",         href: "/member/avenue/vanity" },
  wellness:       { title: "Girl Fit",           href: "/member/avenue/wellness" },
  "reading-room": { title: "The Reading Room",   href: "/member/avenue/reading-room" },
  screening:      { title: "The Screening Room", href: "/member/avenue/screening-room" },
  working:        { title: "Girl Working",       href: "/member/avenue/working" },
  magazine:       { title: "Magazine",           href: "/member/avenue/magazine" },
};

const AVATAR_COLORS = [
  "#FF1F7D", "#FF69B4", "#A855F7", "#E8A050",
  "#4A7C59", "#C4005A", "#1565C0", "#D4A853",
];

export function getPostDisplay(post: WallPost, idx: number): PostDisplay {
  const roomMeta = CATEGORY_ROOMS[post.category ?? "wall"] ?? { title: "The Wall", href: "/member/avenue/wall" };
  // For seed posts use seed_author name; for real posts use first name only (no surname)
  const userName = post.is_seed && post.seed_author
    ? post.seed_author
    : (post.author?.first_name ?? post.author?.full_name?.split(" ")[0] ?? "Member");
  return {
    room: roomMeta.title,
    roomHref: roomMeta.href,
    user: userName,
    initial: userName[0]?.toUpperCase() ?? "B",
    color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
    text: post.text,
    blooms: post.blooms,
  };
}
