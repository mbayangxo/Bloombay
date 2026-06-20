/** Club launch pipeline — growing → ready → launching → open */

export type ClubLaunchStatus = "growing" | "ready" | "launching" | "open";

export type ClubLaunch = {
  id: string;
  name: string;
  womenInterested: number;
  womenGoal: number;
  hasHost: boolean;
  hasVenue: boolean;
  status: ClubLaunchStatus;
  city: string;
};

export const CLUB_LAUNCH_STATUS_LABEL: Record<ClubLaunchStatus, string> = {
  growing: "Growing",
  ready: "Ready",
  launching: "Launching",
  open: "Open",
};

export function computeClubLaunchStatus(club: Omit<ClubLaunch, "status">): ClubLaunchStatus {
  if (club.womenInterested >= club.womenGoal && club.hasHost && club.hasVenue) return "open";
  if (club.womenInterested >= club.womenGoal * 0.85 && club.hasHost && club.hasVenue) return "launching";
  if (club.womenInterested >= club.womenGoal * 0.85 && club.hasHost) return "ready";
  return "growing";
}

export const DEMO_CLUB_LAUNCHES: ClubLaunch[] = [
  {
    id: "travel-club",
    name: "Travel Club",
    womenInterested: 21,
    womenGoal: 50,
    hasHost: false,
    hasVenue: false,
    status: "growing",
    city: "NYC",
  },
  {
    id: "book-harlem",
    name: "Book Club · Harlem",
    womenInterested: 312,
    womenGoal: 50,
    hasHost: true,
    hasVenue: true,
    status: "open",
    city: "NYC",
  },
  {
    id: "williamsburg-book",
    name: "Williamsburg Book Club",
    womenInterested: 48,
    womenGoal: 50,
    hasHost: true,
    hasVenue: true,
    status: "ready",
    city: "NYC",
  },
  {
    id: "founders",
    name: "Founders Club",
    womenInterested: 398,
    womenGoal: 50,
    hasHost: true,
    hasVenue: false,
    status: "launching",
    city: "NYC",
  },
];
