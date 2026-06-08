/** Founder portal display data — UI layer only, does not touch Supabase */

import { SIGNUP_MIX, TOP_CITIES_RANKED } from "./founder-dashboard-metrics";

export type GrowthTrend = "up" | "down" | "steady";

export const PORTAL_KPI = {
  totalSignups: {
    total: SIGNUP_MIX.joined,
    week: 312,
    month: 1842,
    trend: "up" as GrowthTrend,
  },
  totalWomen: {
    total: SIGNUP_MIX.members,
    week: 312,
    month: 1842,
    trend: "up" as GrowthTrend,
  },
  clubHosts: {
    total: SIGNUP_MIX.clubHosts,
    week: 28,
    month: 142,
    trend: "up" as GrowthTrend,
  },
  partners: {
    total: SIGNUP_MIX.partners,
    week: 9,
    month: 48,
    trend: "up" as GrowthTrend,
  },
  pendingVerification: {
    total: 127,
    week: 34,
    month: 89,
    trend: "up" as GrowthTrend,
  },
};

export const MEMBERSHIP_GROWTH = {
  today: { value: 48, trend: "up" as GrowthTrend },
  week: { value: 312, trend: "up" as GrowthTrend },
  month: { value: 1842, trend: "up" as GrowthTrend },
  last30: { value: 2104, trend: "up" as GrowthTrend },
};

export const NYC_LAUNCH_HERO = {
  city: "NYC",
  percent: 84,
  label: "Ready To Bloom",
  women: 4211,
  clubsForming: 23,
  partnersApproved: 18,
  waitingVerification: 127,
  membersNeeded: 789,
  topNeighborhoods: ["Williamsburg", "Chelsea", "Harlem", "Hoboken"],
};

export type GeoNode = {
  id: string;
  name: string;
  count: number;
  percent?: number;
  children?: GeoNode[];
};

export const GEOGRAPHY_TREE: GeoNode[] = [
  {
    id: "usa",
    name: "United States",
    count: 6214,
    percent: 72,
    children: [
      {
        id: "ny-state",
        name: "New York",
        count: 4211,
        percent: 84,
        children: [
          {
            id: "nyc",
            name: "New York City",
            count: 3892,
            percent: 84,
            children: [
              { id: "williamsburg", name: "Williamsburg", count: 528, percent: 88 },
              { id: "chelsea", name: "Chelsea", count: 412, percent: 82 },
              { id: "harlem", name: "Harlem", count: 308, percent: 77 },
              { id: "hoboken", name: "Hoboken", count: 143, percent: 71 },
              { id: "ues", name: "Upper East Side", count: 291, percent: 74 },
            ],
          },
          { id: "brooklyn-boro", name: "Brooklyn", count: 1204, percent: 78 },
        ],
      },
      {
        id: "ca",
        name: "California",
        count: 1124,
        percent: 48,
        children: [
          {
            id: "la",
            name: "Los Angeles",
            count: 892,
            percent: 52,
            children: [
              { id: "silver-lake", name: "Silver Lake", count: 142, percent: 58 },
              { id: "weho", name: "West Hollywood", count: 118, percent: 54 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "uk",
    name: "United Kingdom",
    count: 1843,
    percent: 52,
    children: [
      {
        id: "england",
        name: "England",
        count: 1642,
        percent: 54,
        children: [
          {
            id: "london",
            name: "London",
            count: 1843,
            percent: 52,
            children: [
              { id: "shoreditch", name: "Shoreditch", count: 284, percent: 61 },
              { id: "notting-hill", name: "Notting Hill", count: 241, percent: 58 },
              { id: "camden", name: "Camden", count: 152, percent: 44 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "canada",
    name: "Canada",
    count: 1002,
    percent: 41,
    children: [
      {
        id: "on",
        name: "Ontario",
        count: 842,
        percent: 43,
        children: [
          {
            id: "toronto",
            name: "Toronto",
            count: 1002,
            percent: 41,
            children: [
              { id: "queen-west", name: "Queen West", count: 198, percent: 48 },
              { id: "yorkville", name: "Yorkville", count: 164, percent: 45 },
            ],
          },
        ],
      },
    ],
  },
];

export const MOST_REQUESTED_CLUBS = [
  { name: "Book Club", interested: 1204, weekGrowth: 12, readiness: 86, trend: "up" as GrowthTrend },
  { name: "Founders Club", interested: 998, weekGrowth: 18, readiness: 78, trend: "up" as GrowthTrend },
  { name: "Faith Club", interested: 882, weekGrowth: 9, readiness: 71, trend: "up" as GrowthTrend },
  { name: "Travel Club", interested: 641, weekGrowth: 14, readiness: 68, trend: "up" as GrowthTrend },
  { name: "Dinner Club", interested: 612, weekGrowth: 7, readiness: 74, trend: "steady" as GrowthTrend },
  { name: "Wellness Club", interested: 588, weekGrowth: 11, readiness: 65, trend: "up" as GrowthTrend },
];

export const CLUBS_WAITING = [
  { name: "Founders Club", women: 398, status: "Need host", readiness: 78 },
  { name: "Faith Club", women: 127, status: "Need venue", readiness: 71 },
  { name: "Travel Club", women: 221, status: "Ready to launch", readiness: 92 },
  { name: "Book Club", women: 312, status: "Host confirmed", readiness: 88 },
];

export const CLUBS_CENTER = [
  { name: "Founders Club", women: 398, city: "Brooklyn", host: "Host Needed", venue: "Venue Needed", readiness: 78 },
  { name: "Faith Club", women: 127, city: "Harlem", host: "Host Needed", venue: "Venue Needed", readiness: 71 },
  { name: "Travel Club", women: 221, city: "Manhattan", host: "Confirmed", venue: "Confirmed", readiness: 92 },
  { name: "Book Club", women: 312, city: "Williamsburg", host: "Confirmed", venue: "Searching", readiness: 88 },
  { name: "Dinner Club", women: 186, city: "Chelsea", host: "Confirmed", venue: "Confirmed", readiness: 85 },
];

export const VERIFICATION_STATS = {
  waitingToday: 23,
  waitingWeek: 89,
  avgReviewHours: 4.2,
};

export const VERIFICATION_PREVIEW = [
  {
    id: "v1",
    name: "Sarah M.",
    city: "Brooklyn",
    instagram: "@sarahm",
    referral: "Invited by Amanda",
    status: "new" as const,
    photoInitial: "S",
  },
  {
    id: "v2",
    name: "Maya K.",
    city: "Williamsburg",
    instagram: "@mayak",
    referral: "Instagram",
    status: "reviewed" as const,
    photoInitial: "M",
  },
  {
    id: "v3",
    name: "Priya L.",
    city: "Chelsea",
    instagram: "@priyal",
    referral: "Friend invite",
    status: "new" as const,
    photoInitial: "P",
  },
];

export const PARTNER_PIPELINE = {
  types: ["Cafés", "Restaurants", "Venues", "Brands", "Creators"],
  counts: { pending: 9, approved: 18, rejected: 3 },
};

export const PARTNER_APPLICATIONS = [
  {
    id: "p1",
    businessName: "The Rose Room",
    type: "Venues",
    photoType: "venue" as const,
    location: "Toronto",
    neighborhood: "Yorkville",
    website: "theroseroom.ca",
    instagram: "@theroseroomto",
    capacity: "40 seated",
    date: "May 12",
    googleMapsListed: true,
    googleRating: 4.9,
    audienceMatch: 94,
    womenInterested: 286,
    partnershipScore: 88,
    status: "new" as const,
  },
  {
    id: "p2",
    businessName: "Café Lume",
    type: "Cafés",
    photoType: "restaurant" as const,
    location: "NYC",
    neighborhood: "Williamsburg",
    website: "cafelume.com",
    instagram: "@cafelume",
    capacity: "28 seated",
    date: "May 11",
    googleMapsListed: true,
    googleRating: 4.7,
    audienceMatch: 91,
    womenInterested: 412,
    partnershipScore: 92,
    status: "new" as const,
  },
  {
    id: "p3",
    businessName: "Bloom & Co",
    type: "Brands",
    photoType: "brand" as const,
    location: "NYC",
    neighborhood: "Chelsea",
    website: "bloomand.co",
    instagram: "@bloomandco",
    capacity: "Events · 80",
    date: "May 10",
    googleMapsListed: false,
    googleRating: 4.5,
    audienceMatch: 86,
    womenInterested: 198,
    partnershipScore: 81,
    status: "new" as const,
  },
  {
    id: "p4",
    businessName: "Petite Fleur",
    type: "Cafés",
    photoType: "restaurant" as const,
    location: "NYC",
    neighborhood: "Harlem",
    website: "petitefleur.nyc",
    instagram: "@petitefleur",
    capacity: "22 seated",
    date: "May 9",
    googleMapsListed: true,
    googleRating: 4.8,
    audienceMatch: 89,
    womenInterested: 156,
    partnershipScore: 85,
    status: "new" as const,
  },
  {
    id: "p5",
    businessName: "The Loft House",
    type: "Venues",
    photoType: "venue" as const,
    location: "NYC",
    neighborhood: "Brooklyn",
    website: "lofthouse.events",
    instagram: "@lofthousebk",
    capacity: "120 standing",
    date: "May 8",
    googleMapsListed: true,
    googleRating: 4.6,
    audienceMatch: 92,
    womenInterested: 334,
    partnershipScore: 90,
    status: "new" as const,
  },
  {
    id: "p6",
    businessName: "Gloss Studio",
    type: "Brands",
    photoType: "brand" as const,
    location: "NYC",
    neighborhood: "SoHo",
    website: "glossstudio.co",
    instagram: "@glossstudio",
    capacity: "Pop-ups · 40",
    date: "May 7",
    googleMapsListed: true,
    googleRating: 4.4,
    audienceMatch: 83,
    womenInterested: 241,
    partnershipScore: 79,
    status: "new" as const,
  },
];

export const TOP_CITIES = TOP_CITIES_RANKED.map((c) => ({
  name: c.city,
  signups: c.count,
  growthRate: c.rank === 1 ? 18 : c.rank === 2 ? 12 : 8,
  readiness: c.city === "NYC" ? 84 : c.city === "London" ? 52 : c.city === "Toronto" ? 41 : 38,
}));

export const ATTENTION_TODAY = [
  { label: "Women awaiting verification", count: 23, href: "/admin/verification" },
  { label: "Club hosts to approve", count: 18, href: "/admin/applications?type=club_host" },
  { label: "Partner applications", count: 9, href: "/admin/partners" },
  { label: "Clubs ready to launch", count: 4, href: "/admin/clubs" },
];
