export type Club = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  members: number;
  description: string;
  gradient: string;
  ownerName: string;
  ownerInitial: string;
  welcomeMessage: string;
  upcomingEvents: { title: string; date: string; location: string }[];
  vibeBoard: { author: string; initial: string; text: string; time: string }[];
};

// Club data is fetched from the database — no hardcoded entries.
export const CLUBS: Club[] = [];

export const MOCK_MEMBERS: { name: string; initial: string; color: string }[] = [];

export const SUGGESTED: { name: string; initial: string; neighborhood: string; shared: string }[] = [];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Fitness:           { bg: "#ffe4ec", text: "#121212" },
  Books:             { bg: "#ffb7ce", text: "#121212" },
  Travel:            { bg: "#ffe4ec", text: "#ff2d8a" },
  Wellness:          { bg: "#ffb7ce", text: "#121212" },
  Food:              { bg: "#ffe4ec", text: "#ff2d8a" },
  Nightlife:         { bg: "#121212", text: "#ffffff" },
  Entrepreneurship:  { bg: "#ff2d8a", text: "#ffffff" },
  "Arts & Culture":  { bg: "#ffb7ce", text: "#121212" },
};
