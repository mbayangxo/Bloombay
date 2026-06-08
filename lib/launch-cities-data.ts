import { LAUNCH_THRESHOLD_PERCENT } from "./founder-dashboard-metrics";

export type LaunchNeighborhood = {
  id: string;
  name: string;
  percent: number;
  signedUp: number;
};

export type LaunchCity = {
  id: string;
  name: string;
  percent: number;
  totalSignedUp: number;
  neighborhoods: LaunchNeighborhood[];
};

export type LaunchNeighborhoodStats = {
  signedUp: number;
  launchGoal: number;
  membersLeft: number;
  percent: number;
};

/** Members still needed to hit 100% launch at this neighborhood */
export function neighborhoodLaunchStats(
  signedUp: number,
  percent: number
): LaunchNeighborhoodStats {
  if (percent >= 100) {
    return {
      signedUp,
      launchGoal: signedUp,
      membersLeft: 0,
      percent: 100,
    };
  }
  const launchGoal = Math.max(
    signedUp + 1,
    Math.ceil(signedUp / (percent / 100))
  );
  return {
    signedUp,
    launchGoal,
    membersLeft: Math.max(0, launchGoal - signedUp),
    percent,
  };
}

export function isCityLaunchReady(percent: number): boolean {
  return percent >= LAUNCH_THRESHOLD_PERCENT;
}

export const LAUNCH_CITIES: LaunchCity[] = [
  {
    id: "nyc",
    name: "New York City",
    percent: 84,
    totalSignedUp: 4211,
    neighborhoods: [
      { id: "williamsburg", name: "Williamsburg", percent: 88, signedUp: 528 },
      { id: "chelsea", name: "Chelsea", percent: 82, signedUp: 412 },
      { id: "harlem", name: "Harlem", percent: 77, signedUp: 308 },
      { id: "ues", name: "Upper East Side", percent: 74, signedUp: 291 },
      { id: "hoboken", name: "Hoboken", percent: 71, signedUp: 143 },
      { id: "jersey-city", name: "Jersey City", percent: 68, signedUp: 127 },
    ],
  },
  {
    id: "london",
    name: "London",
    percent: 52,
    totalSignedUp: 1843,
    neighborhoods: [
      { id: "shoreditch", name: "Shoreditch", percent: 61, signedUp: 284 },
      { id: "notting-hill", name: "Notting Hill", percent: 58, signedUp: 241 },
      { id: "chelsea-london", name: "Chelsea", percent: 54, signedUp: 198 },
      { id: "hackney", name: "Hackney", percent: 49, signedUp: 176 },
      { id: "camden", name: "Camden", percent: 44, signedUp: 152 },
    ],
  },
  {
    id: "toronto",
    name: "Toronto",
    percent: 41,
    totalSignedUp: 1002,
    neighborhoods: [
      { id: "queen-west", name: "Queen West", percent: 48, signedUp: 198 },
      { id: "yorkville", name: "Yorkville", percent: 45, signedUp: 164 },
      { id: "leslieville", name: "Leslieville", percent: 42, signedUp: 141 },
      { id: "the-beaches", name: "The Beaches", percent: 38, signedUp: 118 },
    ],
  },
  {
    id: "atlanta",
    name: "Atlanta",
    percent: 41,
    totalSignedUp: 721,
    neighborhoods: [
      { id: "buckhead", name: "Buckhead", percent: 46, signedUp: 142 },
      { id: "midtown-atl", name: "Midtown", percent: 43, signedUp: 128 },
      { id: "west-end", name: "West End", percent: 39, signedUp: 97 },
    ],
  },
];
