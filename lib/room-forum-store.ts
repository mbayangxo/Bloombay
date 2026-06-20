/** The Wall — community forum posts in The Room. */

export type WallPost = {
  id: string;
  author: string;
  topic: string;
  title: string;
  body: string;
  replies: number;
  createdAt: string;
};

const WALL_KEY = "bb_room_wall";

const SEED: WallPost[] = [
  {
    id: "w-pin",
    author: "Yande",
    topic: "The Gathering",
    title: "Invitation scraps on the board",
    body: "The next BloomBay Gathering is pinned here — grab your envelope in Happenings when it drops.",
    replies: 0,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "w1",
    author: "Temi",
    topic: "Community",
    title: "What does BloomBay feel like after 30 days?",
    body: "Curious how your social rhythm changed — clubs vs seats vs The Room?",
    replies: 24,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "w-style",
    author: "Naomi",
    topic: "Style notes",
    title: "Hot pink + ivory for rooftop season",
    body: "Sharing what I packed for Sant Ambroeus dinners — one statement piece, always.",
    replies: 8,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "w2",
    author: "Zoe",
    topic: "Founders",
    title: "Hosting your first gathering — lessons learned",
    body: "We had 18 women show up. Here's what I'd do differently for seating and vibes.",
    replies: 11,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "w-move",
    author: "Priya",
    topic: "Moving notes",
    title: "Williamsburg sublease — July 1",
    body: "Girl mate thread lives in New Keys, but leaving a pin here for anyone browsing The Wall.",
    replies: 5,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "w-well",
    author: "Amanda",
    topic: "Wellness",
    title: "Sunday walk crew — hydration + boundaries",
    body: "Wellness Circle is hosting a slow walk this weekend. No performance, just pace.",
    replies: 14,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "w-bloom",
    author: "Lexi",
    topic: "Bloom request",
    title: "Looking for a brunch friend in SoHo",
    body: "Folded note energy — connect with me after Museum Girls if you're free Saturday.",
    replies: 3,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

export function listWallPosts(): WallPost[] {
  if (typeof window === "undefined") return SEED;
  try {
    const user = JSON.parse(localStorage.getItem(WALL_KEY) ?? "[]") as WallPost[];
    const ids = new Set(user.map((p) => p.id));
    return [...user, ...SEED.filter((s) => !ids.has(s.id))].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return SEED;
  }
}

export function addWallPost(input: { author: string; title: string; body: string; topic?: string }) {
  const post: WallPost = {
    id: `wall-${Date.now()}`,
    author: input.author,
    topic: input.topic ?? "Discussion",
    title: input.title,
    body: input.body,
    replies: 0,
    createdAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem(WALL_KEY) ?? "[]") as WallPost[];
    localStorage.setItem(WALL_KEY, JSON.stringify([post, ...user]));
  }
  return post;
}
