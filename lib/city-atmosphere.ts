import { readYandeMemberState } from "@/lib/yande-member-state";

export type CityAtmosphere = {
  city: string;
  neighborhood: string;
  tempF: number;
  sky: string;
  neighborhoodPulse: string;
  boroughLabel: string;
};

const NEIGHBORHOOD_COPY: Record<string, { pulse: string; borough: string }> = {
  williamsburg: {
    pulse: "Williamsburg is busy tonight",
    borough: "Brooklyn",
  },
  soho: {
    pulse: "SoHo tables are filling",
    borough: "Manhattan",
  },
  harlem: {
    pulse: "Harlem is warm and loud tonight",
    borough: "Manhattan",
  },
  hoboken: {
    pulse: "Hoboken girls are making plans",
    borough: "New Jersey",
  },
  chelsea: {
    pulse: "Chelsea is glowing after work",
    borough: "Manhattan",
  },
};

function skyForHour(hour: number, rainy = false): string {
  if (rainy) return "Rainy evening";
  if (hour >= 5 && hour < 10) return "Soft morning";
  if (hour >= 10 && hour < 17) return "Bright afternoon";
  if (hour >= 17 && hour < 20) return "Golden sunset";
  return "City lights on";
}

export function getCityAtmosphere(overrides?: {
  neighborhood?: string;
  city?: string;
  rainy?: boolean;
}): CityAtmosphere {
  const state = typeof window !== "undefined" ? readYandeMemberState() : null;
  const neighborhood =
    overrides?.neighborhood ??
    state?.neighborhood ??
    (typeof window !== "undefined" ? sessionStorage.getItem("gf_neighborhood") : null) ??
    "Williamsburg";
  const city =
    overrides?.city ??
    state?.city ??
    (typeof window !== "undefined" ? sessionStorage.getItem("gf_city") : null) ??
    "New York";

  const key = neighborhood.toLowerCase().replace(/\s+/g, "");
  const hood =
    NEIGHBORHOOD_COPY[key] ??
    (key.includes("williamsburg")
      ? NEIGHBORHOOD_COPY.williamsburg
      : { pulse: `${neighborhood} is awake tonight`, borough: city });

  const hour = new Date().getHours();
  const rainy = overrides?.rainy ?? false;
  const cozy = rainy || hour >= 20;

  return {
    city,
    neighborhood,
    tempF: rainy ? 58 : hour >= 17 && hour < 21 ? 72 : hour < 12 ? 64 : 68,
    sky: skyForHour(hour, rainy),
    neighborhoodPulse: cozy
      ? `17 women looking for cozy plans`
      : hood.pulse,
    boroughLabel: hood.borough,
  };
}
