/** Curator portal — no fabricated demo women/gatherings. */

export const CURATOR_PROFILE = {
  name: "Curator",
  email: "",
  city: "",
  neighborhood: "",
  status: "active" as const,
  clubs: [] as string[],
};

export const CURATOR_STATS = {
  womenWelcomed: 0,
  gatheringsHosted: 0,
  eventsScheduled: 0,
};

export const CURATOR_GATHERINGS: {
  id: string;
  title: string;
  date: string;
  venue: string;
  status: "confirmed" | "draft";
  women: number;
}[] = [];

export const CURATOR_WOMEN: {
  id: string;
  name: string;
  status: string;
  club: string;
  note: string;
}[] = [];
