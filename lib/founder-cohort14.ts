/** Founder north star: did she attend IRL within 14 days? */

export type Cohort14Step = "joined" | "verified" | "joined_club" | "reserved_seat" | "attended";

export type Cohort14Row = {
  cohort: string;
  joined: number;
  verified: number;
  joinedClub: number;
  reservedSeat: number;
  attended: number;
};

export const COHORT_14_FUNNEL: Cohort14Row[] = [
  { cohort: "This week", joined: 48, verified: 41, joinedClub: 28, reservedSeat: 19, attended: 12 },
  { cohort: "Last week", joined: 52, verified: 44, joinedClub: 31, reservedSeat: 22, attended: 15 },
  { cohort: "2 weeks ago", joined: 39, verified: 35, joinedClub: 24, reservedSeat: 18, attended: 11 },
];

export function attendedRate14(row: Cohort14Row): number {
  if (!row.joined) return 0;
  return Math.round((row.attended / row.joined) * 100);
}
