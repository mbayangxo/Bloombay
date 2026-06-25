// Real event data is fetched from the API — no mock data.

export interface EventInvite {
  id: string;
  type: "Birthday" | "Wins" | "Milestones";
  name: string;
  what: string;
  venue: string;
  date: string;
  time: string;
  initials: string;
  color: string;
  confirmed: number;
}

export const INVITE_DEMO: EventInvite[] = [];
