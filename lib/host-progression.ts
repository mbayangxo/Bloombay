/** Host career ladder — find future city leaders */

export type HostLevel = "new_host" | "host" | "senior_host" | "curator";

export type HostProfile = {
  id: string;
  name: string;
  city: string;
  level: HostLevel;
  trustScore: number;
  attendanceScore: number;
  communityScore: number;
  badges: string[];
  clubs: string[];
  eventsCurated: number;
  status: "active" | "paused" | "rising";
};

export const HOST_LEVEL_META: Record<HostLevel, { label: string; next?: HostLevel }> = {
  new_host: { label: "New host", next: "host" },
  host: { label: "Host", next: "senior_host" },
  senior_host: { label: "Senior host", next: "curator" },
  curator: { label: "Curator" },
};

export const DEMO_HOSTS: HostProfile[] = [
  {
    id: "h1",
    name: "Amanda R.",
    city: "Williamsburg",
    level: "curator",
    trustScore: 97,
    attendanceScore: 96,
    communityScore: 94,
    badges: ["Verified", "Hosted event", "Community leader", "Curator"],
    clubs: ["Williamsburg Dinner", "Book Club"],
    eventsCurated: 24,
    status: "active",
  },
  {
    id: "h2",
    name: "Zoe L.",
    city: "Chelsea",
    level: "senior_host",
    trustScore: 91,
    attendanceScore: 89,
    communityScore: 88,
    badges: ["Verified", "Hosted event", "City lead candidate"],
    clubs: ["Founders Club"],
    eventsCurated: 15,
    status: "rising",
  },
  {
    id: "h3",
    name: "Priya S.",
    city: "Harlem",
    level: "host",
    trustScore: 86,
    attendanceScore: 91,
    communityScore: 85,
    badges: ["Verified", "Attended event"],
    clubs: ["Book Club · Harlem"],
    eventsCurated: 8,
    status: "active",
  },
];

export function overallHostScore(h: HostProfile): number {
  return Math.round((h.trustScore + h.attendanceScore + h.communityScore) / 3);
}
