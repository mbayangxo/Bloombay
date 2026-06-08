/**
 * Girlmates board — Intros space for questions, roommates, subleases.
 * Local cache + Supabase community_posts when signed in.
 */

export type GirlMatePostKind = "roommate" | "question" | "sublease" | "favor";

export type GirlMateBoardPost = {
  id: string;
  kind: GirlMatePostKind;
  authorName: string;
  /** Short headline — required for questions; optional for roommate */
  title: string;
  neighborhood: string;
  city: string;
  budget: string;
  moveIn: string;
  body: string;
  createdAt: string;
  replies: number;
};

/** @deprecated Use GirlMateBoardPost */
export type GirlMateRoomPost = GirlMateBoardPost;

const KEY = "bb_girl_mate_posts";

export const GIRLMATE_KIND_LABELS: Record<GirlMatePostKind, string> = {
  roommate: "Roommate",
  question: "Question",
  sublease: "Sublease",
  favor: "Favor",
};

const SEED: GirlMateBoardPost[] = [
  {
    id: "seed1",
    kind: "roommate",
    authorName: "Simone",
    title: "Room open on Perry St",
    neighborhood: "West Village",
    city: "New York",
    budget: "$1,750 / room",
    moveIn: "Aug 1",
    body: "2BR on Perry St — one room open. Prefer someone in creative fields, cat-friendly building.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    replies: 6,
  },
  {
    id: "seed2",
    kind: "roommate",
    authorName: "Rina",
    title: "Touring apartments together?",
    neighborhood: "Hoboken",
    city: "New Jersey",
    budget: "$1,350",
    moveIn: "June 15",
    body: "Looking for a girl mate to tour 2 beds near PATH — non-smoker, quiet weeknights.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    replies: 3,
  },
  {
    id: "seed3",
    kind: "question",
    authorName: "Devon",
    title: "Broker recs in Bushwick?",
    neighborhood: "Bushwick",
    city: "New York",
    budget: "",
    moveIn: "",
    body: "Has anyone worked with a broker who actually listens to women and doesn't push sketchy listings?",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    replies: 11,
  },
  {
    id: "seed4",
    kind: "sublease",
    authorName: "Maya",
    title: "Summer sublease — July–Aug",
    neighborhood: "Bed-Stuy",
    city: "New York",
    budget: "$1,900",
    moveIn: "July 1",
    body: "Furnished 1BR while I'm in Lisbon. Building has doorman, laundry in unit. DM for photos.",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    replies: 4,
  },
  {
    id: "seed5",
    kind: "question",
    authorName: "Tess",
    title: "Safe to view alone at night?",
    neighborhood: "Harlem",
    city: "New York",
    budget: "",
    moveIn: "",
    body: "First time hunting solo — any buildings or blocks you'd avoid for evening tours?",
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    replies: 8,
  },
  {
    id: "seed6",
    kind: "favor",
    authorName: "Jules",
    title: "Hold mail while I'm away",
    neighborhood: "Fort Greene",
    city: "New York",
    budget: "",
    moveIn: "",
    body: "Two weeks in June — happy to swap plant-watering or keys pickup with another member.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    replies: 2,
  },
];

type ApiPost = {
  id: string;
  author_name: string;
  kind: GirlMatePostKind;
  title: string;
  neighborhood: string | null;
  city: string | null;
  budget: string | null;
  move_in: string | null;
  body: string;
  reply_count: number;
  created_at: string;
};

function mapApiPost(row: ApiPost): GirlMateBoardPost {
  return {
    id: row.id,
    kind: row.kind,
    authorName: row.author_name,
    title: row.title,
    neighborhood: row.neighborhood ?? "",
    city: row.city ?? "New York",
    budget: row.budget ?? "",
    moveIn: row.move_in ?? "",
    body: row.body,
    createdAt: row.created_at,
    replies: row.reply_count ?? 0,
  };
}

function normalizePost(raw: GirlMateBoardPost & { kind?: GirlMatePostKind }): GirlMateBoardPost {
  const kind = raw.kind ?? "roommate";
  return {
    ...raw,
    kind,
    title: raw.title?.trim() || raw.neighborhood || "Girlmates post",
    neighborhood: raw.neighborhood ?? "",
    city: raw.city ?? "New York",
    budget: raw.budget ?? "",
    moveIn: raw.moveIn ?? "",
  };
}

function readUserPosts(): GirlMateBoardPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as GirlMateBoardPost[];
    return Array.isArray(arr) ? arr.map(normalizePost) : [];
  } catch {
    return [];
  }
}

function mergePosts(user: GirlMateBoardPost[], remote: GirlMateBoardPost[]): GirlMateBoardPost[] {
  const ids = new Set(user.map((p) => p.id));
  const merged = [...user, ...remote.filter((r) => !ids.has(r.id)), ...SEED.filter((s) => !ids.has(s.id))];
  return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function listGirlMateBoardPosts(): GirlMateBoardPost[] {
  return mergePosts(readUserPosts(), []);
}

/** Fetch remote posts and merge into local list (client). */
export async function refreshGirlMateBoardFromServer(): Promise<GirlMateBoardPost[]> {
  let remote: GirlMateBoardPost[] = [];
  try {
    const res = await fetch("/api/member/community-posts");
    if (res.ok) {
      const json = (await res.json()) as { posts?: ApiPost[] };
      remote = (json.posts ?? []).map(mapApiPost);
    }
  } catch {
    /* offline */
  }
  const merged = mergePosts(readUserPosts(), remote);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("bb-girl-mate-updated"));
  }
  return merged;
}

/** @deprecated */
export const listGirlMateRoomPosts = listGirlMateBoardPosts;

export function addGirlMateBoardPost(input: {
  kind: GirlMatePostKind;
  authorName: string;
  title: string;
  neighborhood: string;
  city: string;
  budget?: string;
  moveIn?: string;
  body: string;
}): GirlMateBoardPost {
  const post: GirlMateBoardPost = {
    id: `gmp-${Date.now()}`,
    kind: input.kind,
    authorName: input.authorName.trim() || "You",
    title: input.title.trim() || input.neighborhood.trim() || "New post",
    neighborhood: input.neighborhood.trim(),
    city: input.city.trim() || "New York",
    budget: input.budget?.trim() ?? "",
    moveIn: input.moveIn?.trim() ?? "",
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
    replies: 0,
  };
  if (typeof window !== "undefined") {
    const user = readUserPosts();
    localStorage.setItem(KEY, JSON.stringify([post, ...user]));
    window.dispatchEvent(new Event("bb-girl-mate-updated"));
    void fetch("/api/member/community-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: input.kind,
        authorName: post.authorName,
        title: post.title,
        neighborhood: post.neighborhood,
        city: post.city,
        budget: post.budget,
        moveIn: post.moveIn,
        body: post.body,
      }),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const json = (await res.json()) as { post?: ApiPost };
        if (json.post?.id) {
          const updated = [mapApiPost(json.post), ...user];
          localStorage.setItem(KEY, JSON.stringify(updated));
          window.dispatchEvent(new Event("bb-girl-mate-updated"));
        }
      })
      .catch(() => {
        /* local post kept */
      });
  }
  return post;
}

/** @deprecated */
export const addGirlMateRoomPost = (input: {
  authorName: string;
  neighborhood: string;
  city: string;
  budget: string;
  moveIn: string;
  body: string;
}) =>
  addGirlMateBoardPost({
    kind: "roommate",
    ...input,
    title: `Looking in ${input.neighborhood}`,
  });

export function postMetaLine(post: GirlMateBoardPost): string {
  const parts: string[] = [];
  if (post.neighborhood) parts.push(post.neighborhood);
  if (post.city && post.city !== post.neighborhood) parts.push(post.city);
  if (post.kind === "roommate" || post.kind === "sublease") {
    if (post.budget) parts.push(post.budget);
    if (post.moveIn) parts.push(`Move-in ${post.moveIn}`);
  }
  return parts.join(" · ") || "BloomBay · Intros";
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}
